import React, { useState, useMemo } from 'react';
import {
  Send, Search, Clock, MapPin, Building2,
  CheckCircle2, Filter, AlertTriangle, ArrowLeft,
  LayoutDashboard, List, ChevronRight, Eye,
  XCircle, Users, Calendar, Activity,
  PieChart as PieChartIcon
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { REFERRAL_DATA, PATIENTS_DATA } from "../../../../../data/patientData";
import { SYSTEM_ICON_COLORS, PROVINCES, HOSPITALS, MOCK_CAPACITY, HOSPITAL_PROVINCE_MAP, matchHospitalFilter, getProvinceFromHospital } from "../../../../../data/themeConfig";
import { ReferralDetailPage } from "./ReferralDetailPage";
import { RefDrilldownView } from "./drilldown/shared";
import { StatusDrilldown as RefStatusDrilldown } from "./drilldown/StatusDrilldown";
import { UrgencyDrilldown as RefUrgencyDrilldown } from "./drilldown/UrgencyDrilldown";
import { CapacityDrilldown as RefCapacityDrilldown } from "./drilldown/CapacityDrilldown";

// ===== UI = สีม่วง / Icon = สีส้ม (#ff6d00) =====
const ICON = SYSTEM_ICON_COLORS.referral;

// Status helpers
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Pending:   { label: 'รอการตอบรับ', color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10' },
  Accepted:  { label: 'รอรับตัว',    color: 'text-[#ff6d00]', bg: 'bg-[#ff6d00]/10' },
  Completed: { label: 'ตรวจแล้ว',    color: 'text-[#00cfe8]', bg: 'bg-[#00cfe8]/10' },
  Treated:   { label: 'รักษาแล้ว',   color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
  Rejected:  { label: 'ปฏิเสธ',      color: 'text-[#ea5455]', bg: 'bg-[#ea5455]/10' },
};
const getStatusConfig = (s: string) => STATUS_CONFIG[s] || { label: s, color: 'text-gray-500', bg: 'bg-gray-100' };

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Emergency: { label: 'ฉุกเฉิน',   color: 'text-[#ea5455]', bg: 'bg-[#ea5455]/10' },
  Urgent:    { label: 'เร่งด่วน',   color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/10' },
  Routine:   { label: 'ปกติ',       color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
};
const getUrgencyConfig = (u: string) => URGENCY_CONFIG[u] || { label: u, color: 'text-gray-500', bg: 'bg-gray-100' };

const formatThaiShortDate = (dateStr: string) => {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch { return dateStr; }
};

export function ReferralSystem({ onBack, initialHN }: { onBack?: () => void, initialHN?: string }) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [searchTerm, setSearchTerm] = useState(initialHN || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('ทั้งหมด');
  const [hospitalFilter, setHospitalFilter] = useState('ทั้งหมด');
  const [selectedReferral, setSelectedReferral] = useState<any | null>(null);
  const [refDrilldown, setRefDrilldown] = useState<RefDrilldownView>(null);

  // ═══ Raw referrals from REFERRAL_DATA ═══
  const referrals = useMemo(() => {
    return (REFERRAL_DATA || []).map((r: any) => ({
      ...r,
      id: r.id || `REF-${Math.random().toString(36).substr(2, 6)}`,
      patientName: r.patientName || r.name || 'ไม่ระบุ',
      hn: r.hn || r.patientHn || '-',
      sourceHospital: r.sourceHospital || r.hospital || '-',
      destinationHospital: r.destinationHospital || '-',
      status: r.status || 'Pending',
      urgency: r.urgency || 'Routine',
      date: r.date || r.referralDate || '-',
    }));
  }, []);

  // ═══ Filtered referrals by province & hospital (synced with mobile) ═══
  const filteredReferrals = useMemo(() => {
    return referrals.filter((r: any) => {
      const srcHosp = r.sourceHospital || '';
      const destHosp = r.destinationHospital || '';
      if (provinceFilter !== 'ทั้งหมด') {
        const srcProv = getProvinceFromHospital(srcHosp);
        const destProv = getProvinceFromHospital(destHosp);
        if (srcProv !== provinceFilter && destProv !== provinceFilter) return false;
      }
      if (hospitalFilter !== 'ทั้งหมด') {
        if (!matchHospitalFilter(srcHosp, hospitalFilter) && !matchHospitalFilter(destHosp, hospitalFilter)) return false;
      }
      return true;
    });
  }, [referrals, provinceFilter, hospitalFilter]);

  // ═══ List filter (search + status + province + hospital) ═══
  const filtered = useMemo(() => {
    return filteredReferrals.filter((r: any) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        (r.patientName || '').toLowerCase().includes(term) ||
        (r.hn || '').toLowerCase().includes(term) ||
        (r.sourceHospital || '').toLowerCase().includes(term) ||
        (r.destinationHospital || '').toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [filteredReferrals, searchTerm, statusFilter]);

  // ═══ Stats (from filteredReferrals — synced with mobile) ═══
  const stats = useMemo(() => ({
    total: filteredReferrals.length,
    pending: filteredReferrals.filter((r: any) => r.status === 'Pending').length,
    accepted: filteredReferrals.filter((r: any) => r.status === 'Accepted').length,
    rejected: filteredReferrals.filter((r: any) => r.status === 'Rejected').length,
    examined: filteredReferrals.filter((r: any) => r.status === 'Examined' || r.status === 'Completed').length,
    treated: filteredReferrals.filter((r: any) => r.status === 'Treated').length,
  }), [filteredReferrals]);

  // Pie data (synced with mobile — 5 items)
  const pieData = useMemo(() => [
    { name: 'รอตอบรับ', value: stats.pending, color: '#4285f4' },
    { name: 'รอรับตัว', value: stats.accepted, color: '#ff6d00' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
    { name: 'ตรวจแล้ว', value: stats.examined, color: '#00cfe8' },
    { name: 'รักษาแล้ว', value: stats.treated, color: '#28c76f' },
  ], [stats]);

  // ═══ Pending wait-time breakdown (synced with mobile) ═══
  const pendingWaitData = useMemo(() => {
    const TODAY = new Date('2026-02-18');
    const getDays = (dateStr: string) => {
      if (!dateStr || dateStr === '-') return 0;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 0 : Math.max(0, Math.floor((TODAY.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
    };
    const pendingRefs = filteredReferrals.filter((r: any) => r.status === 'Pending');
    const critical = pendingRefs.filter((r: any) => getDays(r.date || r.referralDate) > 7).length;
    const warning = pendingRefs.filter((r: any) => { const d = getDays(r.date || r.referralDate); return d > 3 && d <= 7; }).length;
    const normal = pendingRefs.filter((r: any) => getDays(r.date || r.referralDate) <= 3).length;
    return [
      { key: 'critical', label: 'รอมากกว่า 7 วัน', count: critical, color: '#ea5455' },
      { key: 'warning',  label: 'รอ 3-7 วัน',      count: warning,  color: '#ff9f43' },
      { key: 'normal',   label: 'รอไม่เกิน 3 วัน',  count: normal,   color: '#28c76f' },
    ];
  }, [filteredReferrals]);

  const pendingTotal = useMemo(() => pendingWaitData.reduce((sum, d) => sum + d.count, 0), [pendingWaitData]);

  // ═══ Hospital load data (from filtered — synced with mobile) ═══
  const hospitalLoadData = useMemo(() => {
    const filteredPatients = PATIENTS_DATA.filter((p: any) => {
      const hosp = p.hospital || '';
      const matchesProv = provinceFilter === 'ทั้งหมด' || getProvinceFromHospital(hosp) === provinceFilter;
      const matchesHosp = matchHospitalFilter(hosp, hospitalFilter);
      return matchesProv && matchesHosp;
    });
    const hospPatients = new Map<string, number>();
    filteredPatients.forEach((p: any) => {
      const h = p.hospital || '-';
      if (h !== '-') hospPatients.set(h, (hospPatients.get(h) || 0) + 1);
    });

    const incomingRefs = new Map<string, number>();
    filteredReferrals.forEach((r: any) => {
      if (r.status === 'Pending' || r.status === 'Accepted') {
        const dest = r.destinationHospital || '-';
        if (dest !== '-') incomingRefs.set(dest, (incomingRefs.get(dest) || 0) + 1);
      }
    });

    const allH = new Set([...hospPatients.keys(), ...incomingRefs.keys()]);
    return Array.from(allH).map(h => {
      const current = hospPatients.get(h) || 0;
      const incoming = incomingRefs.get(h) || 0;
      const capacity = MOCK_CAPACITY[h] || 15;
      const total = current + incoming;
      const percent = Math.round((total / capacity) * 100);
      const shortName = h.replace('โรงพยาบาล', 'รพ.').trim();
      return {
        name: shortName.length > 14 ? shortName.slice(0, 12) + '..' : shortName,
        fullName: h, current, incoming, total, capacity, percent,
        level: (percent >= 90 ? 'danger' : percent >= 70 ? 'warning' : 'safe') as 'danger' | 'warning' | 'safe',
      };
    }).sort((a, b) => b.percent - a.percent);
  }, [filteredReferrals, provinceFilter, hospitalFilter]);

  // ═══ Filtered patients list (synced with mobile) ═══
  const filteredPatientsList = useMemo(() => {
    return PATIENTS_DATA.filter((p: any) => {
      const hosp = p.hospital || '';
      const matchesProv = provinceFilter === 'ทั้งหมด' || getProvinceFromHospital(hosp) === provinceFilter;
      const matchesHosp = matchHospitalFilter(hosp, hospitalFilter);
      return matchesProv && matchesHosp;
    });
  }, [provinceFilter, hospitalFilter]);

  // ═══ Drilldown rendering ═══
  if (refDrilldown) {
    switch (refDrilldown.type) {
      case 'status':
        return (
          <RefStatusDrilldown
            referrals={referrals}
            filter={refDrilldown.filter}
            label={refDrilldown.label}
            onBack={() => setRefDrilldown(null)}
            onSelectReferral={(r) => { setRefDrilldown(null); setSelectedReferral(r); }}
          />
        );
      case 'urgency':
        return (
          <RefUrgencyDrilldown
            referrals={referrals}
            filter={refDrilldown.filter}
            label={refDrilldown.label}
            onBack={() => setRefDrilldown(null)}
            onSelectReferral={(r) => { setRefDrilldown(null); setSelectedReferral(r); }}
          />
        );
      case 'capacity':
        return (
          <RefCapacityDrilldown
            referrals={referrals}
            hospitalName={refDrilldown.hospitalName}
            onBack={() => setRefDrilldown(null)}
            onSelectReferral={(r) => { setRefDrilldown(null); setSelectedReferral(r); }}
          />
        );
    }
  }

  // Detail view
  if (selectedReferral) {
    return (
      <ReferralDetailPage
        referral={selectedReferral}
        onBack={() => setSelectedReferral(null)}
      />
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai'] px-4 md:px-0">

      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className={cn("p-2.5 rounded-xl", ICON.bg)}>
            <Send className={cn("w-6 h-6", ICON.text)} />
          </div>
          <div>
            <h1 className="text-[#5e5873] text-xl">ระบบส่งตัว</h1>
            <p className="text-xs text-gray-500">ติดตามและจัดการการส่งตัวผู้ป่วยทั่วเครือข่าย</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button onClick={() => setViewMode('dashboard')} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all", viewMode === 'dashboard' ? "bg-white text-[#7367f0] shadow-sm" : "text-gray-500 hover:text-gray-700")}>
              <LayoutDashboard size={16} /> แดชบอร์ด
            </button>
            <button onClick={() => setViewMode('list')} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all", viewMode === 'list' ? "bg-white text-[#7367f0] shadow-sm" : "text-gray-500 hover:text-gray-700")}>
              <List size={16} /> รายการ
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="ค้นหาผู้ป่วย, HN, โรงพยาบาล..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-lg" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={provinceFilter} onValueChange={setProvinceFilter}>
            <SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-[#7367f0]" /><SelectValue /></div>
            </SelectTrigger>
            <SelectContent>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
            <SelectTrigger className="w-[180px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><Building2 size={14} className="text-[#7367f0]" /><SelectValue /></div>
            </SelectTrigger>
            <SelectContent>{HOSPITALS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><Filter size={14} className="text-[#7367f0]" /><SelectValue placeholder="ทุกสถานะ" /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="Pending">รอการตอบรับ</SelectItem>
              <SelectItem value="Accepted">รอรับตัว</SelectItem>
              <SelectItem value="Completed">ตรวจแล้ว</SelectItem>
              <SelectItem value="Rejected">ปฏิเสธ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ════════ DASHBOARD (synced with mobile) ════════ */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">

          {/* ═══ 6 Stat Cards (synced with mobile) ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'ส่งตัวทั้งหมด', value: stats.total, icon: Send, iconColor: ICON.text, iconBg: ICON.bg, borderColor: 'border-gray-100' },
              { label: 'รอตอบรับ', value: stats.pending, icon: Clock, iconColor: 'text-blue-600', iconBg: 'bg-blue-50', borderColor: 'border-blue-100' },
              { label: 'รอรับตัว', value: stats.accepted, icon: AlertTriangle, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', borderColor: 'border-amber-100' },
              { label: 'ปฏิเสธ', value: stats.rejected, icon: XCircle, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', borderColor: 'border-rose-100' },
              { label: 'ตรวจแล้ว', value: stats.examined, icon: Activity, iconColor: 'text-cyan-600', iconBg: 'bg-cyan-50', borderColor: 'border-cyan-100' },
              { label: 'รักษาแล้ว', value: stats.treated, icon: CheckCircle2, iconColor: 'text-green-600', iconBg: 'bg-green-50', borderColor: 'border-green-100' },
            ].map((stat, i) => (
              <Card key={i} className={cn("shadow-sm rounded-xl hover:shadow-md transition-all", stat.borderColor)}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", stat.iconBg)}>
                    <stat.icon size={20} className={stat.iconColor} />
                  </div>
                  <div>
                    <span className="text-2xl text-[#37286A]">{stat.value}</span>
                    <p className="text-sm text-[#7066A9]">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ═══ สถิติสถานะการส่งตัว Pie Chart (standalone — synced with mobile) ═══ */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <PieChartIcon className={cn("w-5 h-5", ICON.text)} /> สถิติสถานะการส่งตัว
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-[220px] relative flex items-center justify-center" style={{ minHeight: 220 }}>
                  <ResponsiveContainer width="100%" height={220} minWidth={0} debounce={50}>
                    <PieChart>
                      <Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                        {pieData.filter(d => d.value > 0).map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl text-[#37286A]">{stats.total}</span>
                    <span className="text-xs text-[#7066A9]">ทั้งหมด</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-[#5e5873]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-[#37286A]">{item.value}</span>
                        <span className="text-xs text-[#7066A9]">({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ═══ ข้อมูลส่งตัว: ระยะเวลารอตอบรับ + ความจุโรงพยาบาล + ผู้ป่วยที่อยู่ในการดูแล (synced with mobile) ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Card A: ระยะเวลารอตอบรับ */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <Clock className={cn("w-5 h-5", ICON.text)} /> ระยะเวลารอตอบรับ
                </CardTitle>
                <span className="text-xs text-white bg-[#7367f0] px-1.5 py-0.5 rounded-full">{pendingTotal} รายการ</span>
              </CardHeader>
              <CardContent className="space-y-2.5 flex-1">
                {pendingWaitData.map(w => (
                  <div key={w.key} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: w.color }}></div>
                        <span className="text-sm text-[#37286A]">{w.label}</span>
                      </div>
                      <span className="text-xs text-[#7066A9] shrink-0 ml-2">{w.count} รายการ</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pendingTotal > 0 ? Math.round((w.count / pendingTotal) * 100) : 0}%`, backgroundColor: w.color }}></div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 mt-1 border-t border-gray-100 flex items-center justify-between px-1">
                  <span className="text-xs text-[#7066A9]">รวมทั้งหมด</span>
                  <span className="text-sm text-[#7367f0]">{pendingTotal} รายการ</span>
                </div>
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => setRefDrilldown({ type: 'status', filter: 'Pending', label: 'ผู้ป่วยรอตอบรับเกินกำหนด' })}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* Card B: ความจุโรงพยาบาล (2 items + "+X เพิ่มเติม" pattern) */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <Building2 className={cn("w-5 h-5", ICON.text)} /> ความจุโรงพยาบาล
                </CardTitle>
                <span className="text-xs text-white bg-[#7367f0] px-1.5 py-0.5 rounded-full">{hospitalLoadData.length} แห่ง</span>
              </CardHeader>
              {hospitalLoadData.length > 0 ? (
                <CardContent className="space-y-2.5 flex-1">
                  {hospitalLoadData.slice(0, 2).map(h => (
                    <div key={h.fullName} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-[#37286A] truncate flex-1">{h.name}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full shrink-0 ml-2",
                          h.level === 'danger' ? "bg-[#ea5455]/10 text-[#ea5455]" :
                          h.level === 'warning' ? "bg-[#ff9f43]/10 text-[#ff9f43]" :
                          "bg-[#28c76f]/10 text-[#28c76f]"
                        )}>{h.percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                        <div className="h-full rounded-full flex" style={{ width: `${Math.min(h.percent, 100)}%` }}>
                          <div className="h-full rounded-l-full" style={{
                            width: h.total > 0 ? `${(h.current / h.total) * 100}%` : '100%',
                            backgroundColor: h.level === 'danger' ? '#ea5455' : h.level === 'warning' ? '#ff9f43' : '#28c76f'
                          }}></div>
                          {h.incoming > 0 && (
                            <div className="h-full rounded-r-full opacity-60" style={{
                              width: `${(h.incoming / h.total) * 100}%`,
                              backgroundColor: '#ff6d00'
                            }}></div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#7066A9]">{h.total}/{h.capacity} ราย</span>
                        {h.incoming > 0 && <span className="text-[#ff6d00]">+{h.incoming} รอส่งเข้า</span>}
                      </div>
                    </div>
                  ))}
                  {hospitalLoadData.length > 2 && (
                    <div className="text-center text-xs text-[#7066A9] py-1">+{hospitalLoadData.length - 2} โรงพยาบาลเพิ่มเติม</div>
                  )}
                  <div className="flex items-center gap-3 pt-2 mt-1 border-t border-gray-100">
                    <div className="flex items-center gap-1"><div className="w-2.5 h-1.5 rounded-sm bg-[#28c76f]"></div><span className="text-xs text-[#7066A9]">ปัจจุบัน</span></div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-1.5 rounded-sm bg-[#ff6d00] opacity-60"></div><span className="text-xs text-[#7066A9]">รอส่งเข้า</span></div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-6">
                  <Building2 size={28} className="text-gray-300" />
                  <p className="text-sm text-[#7066A9]">ไม่พบข้อมูลโรงพยาบาล</p>
                  <p className="text-xs text-gray-400">สำหรับตัวกรองที่เลือก</p>
                </CardContent>
              )}
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => { if (hospitalLoadData[0]) setRefDrilldown({ type: 'capacity', hospitalName: hospitalLoadData[0].fullName }); }}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* Card C: ผู้ป่วยที่อยู่ในการดูแล (filtered — synced with mobile) */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#7367f0]" /> ผู้ป่วยที่อยู่ในการดูแล
                </CardTitle>
                <span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full">{filteredPatientsList.length} ราย</span>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                {filteredPatientsList.length > 0 ? (
                  <>
                    <div className="divide-y divide-gray-50">
                      {filteredPatientsList.slice(0, 4).map((p: any) => {
                        const hasReferral = (p.referralHistory || []).some((r: any) => r.status === 'Pending');
                        const hospShort = (p.hospital || '').replace('โรงพยาบาล', 'รพ.').trim();
                        return (
                          <div key={p.id || p.hn} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition-colors cursor-pointer">
                            <img src={p.image} alt={p.name} className="w-8 h-8 rounded-full object-cover border-2 border-gray-100 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-[#37286A] truncate block">{p.name}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-[#7066A9]">{p.hn}</span>
                                <span className="text-xs text-gray-300">&bull;</span>
                                <span className="text-xs text-[#7066A9] truncate">{hospShort}</span>
                              </div>
                            </div>
                            {hasReferral && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>}
                          </div>
                        );
                      })}
                    </div>
                    {filteredPatientsList.length > 4 && (
                      <div className="p-2.5 border-t border-gray-100 text-center">
                        <button className="text-sm text-[#7367f0] hover:text-[#5B4FCC] transition-colors">
                          ดูทั้งหมด ({filteredPatientsList.length} ราย) →
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 flex flex-col items-center justify-center gap-2 text-center">
                    <Users size={28} className="text-gray-300" />
                    <p className="text-sm text-[#7066A9]">ไม่พบข้อมูลผู้ป่วย</p>
                    <p className="text-xs text-gray-400">สำหรับตัวกรองที่เลือก</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ═══ รายการส่งตัวล่าสุด (kept — uses filtered) ═══ */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <Calendar className={cn("w-5 h-5", ICON.text)} /> รายการส่งตัวล่าสุด
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#7367f0] text-sm" onClick={() => setViewMode('list')}>
                ดูทั้งหมด <ChevronRight size={16} />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop table */}
              <div className="overflow-x-auto hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">ต้นทาง → ปลายทาง</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">ความเร่งด่วน</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">วันที่</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.slice(0, 5).map((r: any) => {
                      const sc = getStatusConfig(r.status);
                      const uc = getUrgencyConfig(r.urgency);
                      return (
                        <TableRow key={r.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedReferral(r)}>
                          <TableCell>
                            <div className="text-sm text-[#5e5873]">{r.patientName}</div>
                            <div className="text-xs text-gray-400">{r.hn}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="truncate max-w-[100px]">{r.sourceHospital}</span>
                              <Send size={12} className="text-[#ff6d00] shrink-0" />
                              <span className="truncate max-w-[100px] text-[#7367f0]">{r.destinationHospital}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={cn("px-2 py-1 rounded-full text-xs", uc.bg, uc.color)}>{uc.label}</span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">{formatThaiShortDate(r.date)}</TableCell>
                          <TableCell>
                            <span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile cards */}
              <div className="md:hidden p-3 space-y-2">
                {filtered.slice(0, 5).map((r: any) => {
                  const sc = getStatusConfig(r.status);
                  const uc = getUrgencyConfig(r.urgency);
                  return (
                    <div key={r.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors space-y-2" onClick={() => setSelectedReferral(r)}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={cn("p-1.5 rounded-lg shrink-0", ICON.bg)}>
                            <Send className={cn("w-3.5 h-3.5", ICON.text)} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-[#5e5873] truncate">{r.patientName}</p>
                            <p className="text-xs text-gray-400">{r.hn}</p>
                          </div>
                        </div>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap shrink-0", sc.bg, sc.color)}>{sc.label}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="truncate">{r.sourceHospital}</span>
                        <Send size={10} className="text-[#ff6d00] shrink-0" />
                        <span className="truncate text-[#7367f0]">{r.destinationHospital}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px]", uc.bg, uc.color)}>{uc.label}</span>
                        <span className="text-xs text-gray-400">{formatThaiShortDate(r.date)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== LIST VIEW — TABLE (desktop) + CARD (mobile) ===== */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm text-gray-600">รายการส่งตัว</h3>
            <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length} รายการ</span>
          </div>

          {/* Desktop: Table */}
          <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EDE9FE]/30">
                    <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">ต้นทาง → ปลายทาง</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">ความเร่งด่วน</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">วันที่</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">เหตุผล</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                    <TableHead className="text-xs w-[80px]">ดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r: any) => {
                    const sc = getStatusConfig(r.status);
                    const uc = getUrgencyConfig(r.urgency);
                    return (
                      <TableRow key={r.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => setSelectedReferral(r)}>
                        <TableCell>
                          <div className="text-sm text-[#5e5873]">{r.patientName}</div>
                          <div className="text-xs text-gray-400">HN: {r.hn}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span className="truncate max-w-[100px]">{r.sourceHospital}</span>
                            <Send size={12} className={ICON.text} />
                            <span className="truncate max-w-[100px] text-[#7367f0]">{r.destinationHospital}</span>
                          </div>
                        </TableCell>
                        <TableCell><span className={cn("px-2 py-1 rounded-full text-xs", uc.bg, uc.color)}>{uc.label}</span></TableCell>
                        <TableCell className="text-sm text-gray-500">{formatThaiShortDate(r.date)}</TableCell>
                        <TableCell className="text-sm text-gray-500 max-w-[150px] truncate">{r.reason || '-'}</TableCell>
                        <TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Send className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>ไม่พบรายการส่งตัว</p>
              </div>
            )}
          </Card>

          {/* Mobile: Card-based list */}
          <div className="md:hidden space-y-3">
            {filtered.map((r: any) => {
              const sc = getStatusConfig(r.status);
              const uc = getUrgencyConfig(r.urgency);
              return (
                <Card
                  key={r.id}
                  className="border-gray-100 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedReferral(r)}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("p-2 rounded-lg shrink-0", ICON.bg)}>
                          <Send className={cn("w-4 h-4", ICON.text)} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-[#5e5873] truncate">{r.patientName}</p>
                          <p className="text-xs text-gray-400">HN: {r.hn}</p>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs whitespace-nowrap shrink-0", sc.bg, sc.color)}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="truncate">{r.sourceHospital}</span>
                      <Send size={10} className="text-[#ff6d00] shrink-0" />
                      <span className="truncate text-[#7367f0]">{r.destinationHospital}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px]", uc.bg, uc.color)}>{uc.label}</span>
                      <span className="text-xs text-gray-400">{formatThaiShortDate(r.date)}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Send className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>ไม่พบรายการส่งตัว</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}