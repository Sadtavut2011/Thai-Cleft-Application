import React, { useState, useMemo } from 'react';
import {
  Video, Search, Clock, MapPin, Building2,
  CheckCircle2, Filter, ArrowLeft,
  LayoutDashboard, List, ChevronRight, Eye,
  BarChart3, XCircle, Users, Calendar, Smartphone,
  UserCheck, AlertCircle, Activity,
  PieChart as PieChartIcon
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, YAxis
} from 'recharts';
import { TELEMED_DATA } from "../../../../../data/patientData";
import { SYSTEM_ICON_COLORS, PROVINCES, HOSPITALS } from "../../../../../data/themeConfig";
import { TeleDetailPage } from "./TeleDetailPage";
import { TeleDrilldownView, getStatusKey, buildProviderData } from "./drilldown/shared";
import { StatusDrilldown as TeleStatusDrilldown } from "./drilldown/StatusDrilldown";

// ===== UI = สีม่วง / Icon = สีชมพู (#e91e63) =====
const ICON = SYSTEM_ICON_COLORS.telemed;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  waiting:   { label: 'รอสาย', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]' },
  inprogress:{ label: 'ดำเนินการ', color: 'text-blue-600', bg: 'bg-blue-50' },
  completed: { label: 'เสร็จสิ้น', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]' },
  cancelled: { label: 'ยกเลิก', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]' },
};

const getStatusConfigLocal = (status: string) => {
  return STATUS_CONFIG[getStatusKey(status)] || STATUS_CONFIG.completed;
};

const formatThaiShortDate = (raw: string | undefined): string => {
  if (!raw || raw === '-') return '-';
  if (/[ก-๙]/.test(raw)) return raw;
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch { return raw; }
};

// Hospital → Province map (synced with mobile)
const HOSPITAL_PROVINCE_MAP: Record<string, string> = {
  'โรงพยาบาลฝาง': 'เชียงใหม่',
  'โรงพยาบาลมหาราชนครเชียงใหม่': 'เชียงใหม่',
  'โรงพยาบาลนครพิงค์': 'เชียงใหม่',
  'โรงพยาบาลจอมทอง': 'เชียงใหม่',
  'โรงพยาบาลเชียงรายประชานุเคราะห์': 'เชียงราย',
  'โรงพยาบาลแม่จัน': 'เชียงราย',
  'โรงพยาบาลลำพูน': 'ลำพูน',
  'รพ.สต. บ้านหนองหอย': 'เชียงใหม่',
};

const matchHospitalFilter = (dataHospital: string, filterHospital: string): boolean => {
  if (filterHospital === 'ทั้งหมด') return true;
  const normalized = (dataHospital || '').replace('โรงพยาบาล', 'รพ.').trim();
  return normalized === filterHospital || dataHospital.includes(filterHospital.replace('รพ.', ''));
};

export function TeleConsultationSystem({ onBack }: { onBack?: () => void }) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('ทั้งหมด');
  const [hospitalFilter, setHospitalFilter] = useState('ทั้งหมด');
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [teleDrilldown, setTeleDrilldown] = useState<TeleDrilldownView>(null);

  // ═══ Raw sessions from TELEMED_DATA ═══
  const sessions = useMemo(() => {
    return (TELEMED_DATA || []).map((t: any) => ({
      ...t,
      id: t.id || `TM-${Math.random().toString(36).substr(2, 6)}`,
      patientName: t.patientName || t.name || 'ไม่ระบุ',
      hn: t.hn || t.patientHn || '-',
      status: t.status || 'completed',
      doctor: t.doctor || '-',
      channel: t.channel || 'mobile',
      datetime: t.datetime || t.date || '-',
      time: t.time || '09:00',
      title: t.title || t.detail || '-',
    }));
  }, []);

  // ═══ Filtered raw sessions by province/hospital (synced with mobile) ═══
  const filteredRawSessions = useMemo(() => sessions.filter((t: any) => {
    const hosp = t.hospital || '';
    const matchesProv = provinceFilter === 'ทั้งหมด' || (HOSPITAL_PROVINCE_MAP[hosp] || '') === provinceFilter;
    const matchesHosp = matchHospitalFilter(hosp, hospitalFilter);
    return matchesProv && matchesHosp;
  }), [sessions, provinceFilter, hospitalFilter]);

  // ═══ List filter (search + status + province + hospital) ═══
  const filtered = useMemo(() => {
    return sessions.filter((t: any) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        (t.patientName || '').toLowerCase().includes(term) ||
        (t.hn || '').toLowerCase().includes(term) ||
        (t.doctor || '').toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || getStatusKey(t.status) === statusFilter;
      const hosp = t.hospital || '';
      const matchProv = provinceFilter === 'ทั้งหมด' || (HOSPITAL_PROVINCE_MAP[hosp] || '') === provinceFilter;
      const matchHosp = matchHospitalFilter(hosp, hospitalFilter);
      return matchSearch && matchStatus && matchProv && matchHosp;
    });
  }, [sessions, searchTerm, statusFilter, provinceFilter, hospitalFilter]);

  // ═══ Stats (from filteredRawSessions — synced with mobile) ═══
  const stats = useMemo(() => ({
    total: filteredRawSessions.length,
    waiting: filteredRawSessions.filter((t: any) => getStatusKey(t.status) === 'waiting').length,
    inprogress: filteredRawSessions.filter((t: any) => getStatusKey(t.status) === 'inprogress').length,
    completed: filteredRawSessions.filter((t: any) => getStatusKey(t.status) === 'completed').length,
    cancelled: filteredRawSessions.filter((t: any) => getStatusKey(t.status) === 'cancelled').length,
  }), [filteredRawSessions]);

  // Pie data (synced with mobile — 3 items only)
  const pieData = useMemo(() => [
    { name: 'รอสาย', value: stats.waiting, color: '#ff9f43' },
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'ยกเลิก', value: stats.cancelled, color: '#ea5455' },
  ], [stats]);

  // ═══ Consultations breakdown (from filteredRawSessions — synced with mobile) ═══
  const consultBreakdown = useMemo(() => {
    const total = filteredRawSessions.length;
    return { daily: Math.max(1, Math.round(total / 30)), weekly: Math.max(1, Math.round(total / 4)), monthly: total };
  }, [filteredRawSessions]);

  // Channel breakdown (from filteredRawSessions — synced with mobile)
  const channelBreakdown = useMemo(() => {
    return ['mobile', 'agency', 'hospital'].map(ch => ({
      key: ch,
      label: { mobile: 'Mobile App', agency: 'ผ่าน รพ.สต.', hospital: 'ผ่านโรงพยาบาล' }[ch] || ch,
      count: filteredRawSessions.filter((t: any) => (t.channel || 'mobile') === ch).length,
    }));
  }, [filteredRawSessions]);

  // ═══ Peak Hours (from filteredRawSessions — synced with mobile) ═══
  const peakHoursData = useMemo(() => {
    const hourSlots = Array.from({ length: 12 }, (_, i) => ({
      hour: `${String(i + 7).padStart(2, '0')}:00`,
      count: 0,
    }));
    filteredRawSessions.forEach((t: any) => {
      const timeStr = (t.time || '').trim();
      const hourMatch = timeStr.match(/^(\d{1,2})/);
      if (hourMatch) {
        const h = parseInt(hourMatch[1], 10);
        if (h >= 7 && h <= 18) hourSlots[h - 7].count++;
      }
    });
    if (hourSlots.every(s => s.count === 0)) {
      const mock = [2, 5, 9, 8, 4, 3, 4, 6, 7, 3, 2, 1];
      hourSlots.forEach((s, i) => { s.count = mock[i]; });
    }
    return hourSlots;
  }, [filteredRawSessions]);

  const peakHour = useMemo(() => {
    return peakHoursData.reduce((max, h) => h.count > max.count ? h : max, peakHoursData[0]);
  }, [peakHoursData]);

  // ═══ Active providers (from buildProviderData — synced with mobile) ═══
  const allProviders = useMemo(() => buildProviderData(), []);

  const activeProviders = useMemo(() => {
    return allProviders.filter(prov => {
      const matchesProv = provinceFilter === 'ทั้งหมด' || (HOSPITAL_PROVINCE_MAP[prov.hospital] || '') === provinceFilter;
      const matchesHosp = matchHospitalFilter(prov.hospital, hospitalFilter);
      return matchesProv && matchesHosp;
    });
  }, [allProviders, provinceFilter, hospitalFilter]);

  const allFilteredStaff = useMemo(() => {
    return activeProviders.flatMap(prov =>
      [...prov.doctors, ...prov.nurses].map(s => ({
        ...s,
        hospitalShort: prov.shortName,
      }))
    );
  }, [activeProviders]);

  // ═══ Drilldown rendering ═══
  if (teleDrilldown) {
    const drillFilter = teleDrilldown.type === 'status' ? teleDrilldown.filter : 'all';
    const drillLabel = teleDrilldown.type === 'status' ? teleDrilldown.label : 'รายละเอียด Tele-med';
    return (
      <TeleStatusDrilldown
        sessions={sessions}
        filter={drillFilter}
        label={drillLabel}
        onBack={() => setTeleDrilldown(null)}
        onSelectSession={(s) => { setTeleDrilldown(null); setSelectedSession(s); }}
      />
    );
  }

  // Detail view
  if (selectedSession) {
    return (
      <TeleDetailPage
        session={selectedSession}
        onBack={() => setSelectedSession(null)}
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
            <Video className={cn("w-6 h-6", ICON.text)} />
          </div>
          <div>
            <h1 className="text-[#5e5873] text-xl">ระบบ Tele-med</h1>
            <p className="text-xs text-gray-500">ติดตามและจัดการปรึกษาแพทย์ทางไกล</p>
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

      {/* Search & Filters (province added — synced with mobile) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="ค้นหาผู้ป่วย, HN, แพทย์..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-lg" />
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
            <SelectTrigger className="w-[160px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><Filter size={14} className="text-[#7367f0]" /><SelectValue placeholder="ทุกสถานะ" /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="waiting">รอสาย</SelectItem>
              <SelectItem value="inprogress">ดำเนินการ</SelectItem>
              <SelectItem value="completed">เสร็จสิ้น</SelectItem>
              <SelectItem value="cancelled">ยกเลิก</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ════════ DASHBOARD (synced with mobile) ════════ */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">

          {/* ═══ 4 Stat Cards (synced with mobile) ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'ทั้งหมด', value: stats.total, icon: Video, iconColor: ICON.text, iconBg: ICON.bg, borderColor: 'border-gray-100' },
              { label: 'เสร็จสิ้น', value: stats.completed, icon: CheckCircle2, iconColor: 'text-green-600', iconBg: 'bg-green-50', borderColor: 'border-green-100' },
              { label: 'รอสาย', value: stats.waiting, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', borderColor: 'border-amber-100' },
              { label: 'ยกเลิก', value: stats.cancelled, icon: XCircle, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', borderColor: 'border-rose-100' },
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

          {/* ═══ สถิติสถานะ Pie Chart (standalone — synced with mobile) ═══ */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <PieChartIcon className={cn("w-5 h-5", ICON.text)} /> สถิติสถานะ
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

          {/* ═══ ข้อมูลการปรึกษา: จำนวนปรึกษา + ช���วงเวลา + บุคลากร (synced with mobile) ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Card A: จำนวนการปรึกษา + Channel */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <BarChart3 className={cn("w-5 h-5", ICON.text)} /> จำนวนการปรึกษา
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                {[
                  { label: 'รายวัน (เฉลี่ย)', value: consultBreakdown.daily, unit: 'ครั้ง/วัน' },
                  { label: 'รายสัปดาห์', value: consultBreakdown.weekly, unit: 'ครั้ง/สัปดาห์' },
                  { label: 'รายเดือน (ทั้งหมด)', value: consultBreakdown.monthly, unit: 'ครั้ง/เดือน' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-[#7066A9]">{item.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-base text-[#37286A]">{item.value}</span>
                      <span className="text-xs text-[#7066A9]">{item.unit}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 space-y-1.5">
                  <p className="text-sm text-[#7066A9]">แยกตามช่องทาง</p>
                  {channelBreakdown.map(ch => (
                    <div key={ch.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Smartphone size={11} className="text-[#7066A9]" />
                        <span className="text-sm text-[#37286A]">{ch.label}</span>
                      </div>
                      <span className="text-sm text-[#37286A]">{ch.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => setTeleDrilldown({ type: 'channel', filter: 'all', label: 'จำนวนการปรึกษา' })}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* Card B: ช่วงเวลาหนาแน่น — Peak Hours */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                    <Clock className={cn("w-5 h-5", ICON.text)} /> ช่วงเวลาหนาแน่น
                  </CardTitle>
                  {peakHour && (
                    <span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full shrink-0">
                      Peak: {peakHour.hour}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1" style={{ minHeight: 200 }}>
                  <ResponsiveContainer width="100%" height={200} debounce={50}>
                    <AreaChart data={peakHoursData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="peakGradTeleWeb" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#49358E" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#49358E" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#7066A9' }} interval={2} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#7066A9' }} allowDecimals={false} axisLine={false} tickLine={false} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '12px' }} formatter={(val: any) => [`${val} เซสชัน`, 'จำนวน']} />
                      <Area type="monotone" dataKey="count" stroke="#49358E" fill="url(#peakGradTeleWeb)" strokeWidth={2} dot={{ fill: '#49358E', r: 2.5, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {peakHour && peakHour.count > 0 && (
                  <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-[#F4F0FF] border border-[#E3E0F0]">
                    <AlertCircle size={14} className="text-[#49358E] shrink-0" />
                    <span className="text-xs text-[#37286A]">
                      หนาแน่นที่สุด: <span className="text-[#49358E]">{peakHour.hour} น.</span> ({peakHour.count} เซสชัน)
                    </span>
                  </div>
                )}
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => setTeleDrilldown({ type: 'peakHours', filter: 'all', label: 'ช่วงเวลาหนาแน่น Tele-med' })}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* Card C: บุคลากรที่ออนไลน์ (synced with mobile — buildProviderData) */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <UserCheck className={cn("w-5 h-5", ICON.text)} /> บุคลากรที่ออนไลน์
                </CardTitle>
                <span className="text-xs text-white bg-[#7367f0] px-1.5 py-0.5 rounded-full">{allFilteredStaff.length} คน</span>
              </CardHeader>
              {allFilteredStaff.length > 0 ? (
                <CardContent className="space-y-2.5 flex-1">
                  {allFilteredStaff.slice(0, 2).map((staff) => (
                    <div key={staff.id} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", staff.online ? "bg-green-500" : "bg-gray-300")}></div>
                        <span className="text-sm text-[#37286A] flex-1 min-w-0 truncate">{staff.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          staff.role === 'doctor' ? "bg-[#49358E]/10 text-[#49358E]" : "bg-[#00cfe8]/10 text-[#00cfe8]"
                        )}>
                          {staff.role === 'doctor' ? 'แพทย์' : 'พยาบาล'}
                        </span>
                        <span className="text-xs text-[#7066A9]">{staff.specialty || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Building2 size={12} className="text-[#7066A9]" />
                        <span className="text-xs text-[#7066A9]">{staff.hospitalShort}</span>
                        {staff.activePatients > 0 && (
                          <span className="text-xs text-[#49358E] ml-auto">{staff.activePatients} ผู้ป่วย</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {allFilteredStaff.length > 2 && (
                    <div className="text-center text-xs text-[#7066A9] py-1">+{allFilteredStaff.length - 2} คนเพิ่มเติม</div>
                  )}
                  <div className="pt-2 mt-1 border-t border-gray-100 flex items-center justify-between px-1">
                    <span className="text-xs text-[#7066A9]">ออนไลน์</span>
                    <span className="text-sm text-[#28c76f]">{allFilteredStaff.filter(s => s.online).length}/{allFilteredStaff.length} คน</span>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-6">
                  <Users size={28} className="text-gray-300" />
                  <p className="text-sm text-[#7066A9]">ไม่พบข้อมูลบุคลากร</p>
                  <p className="text-xs text-gray-400">สำหรับตัวกรองที่เลือก</p>
                </CardContent>
              )}
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => setTeleDrilldown({ type: 'provider', filter: 'all', label: 'บุคลากรที่ออนไลน์' })}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>
          </div>

          {/* ═══ รายการล่าสุด (kept — uses filtered) ═══ */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <Calendar className={cn("w-5 h-5", ICON.text)} /> รายการล่าสุด
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
                      <TableHead className="text-xs text-[#5e5873]">หัวข้อ</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">แพทย์</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">วันที่</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.slice(0, 5).map((t: any) => {
                      const sc = getStatusConfigLocal(t.status);
                      return (
                        <TableRow key={t.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedSession(t)}>
                          <TableCell>
                            <div className="text-sm text-[#5e5873]">{t.patientName}</div>
                            <div className="text-xs text-gray-400">{t.hn}</div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 truncate max-w-[150px]">{t.title}</TableCell>
                          <TableCell className="text-sm text-gray-600">{t.doctor}</TableCell>
                          <TableCell className="text-sm text-gray-500">{formatThaiShortDate(t.datetime)}</TableCell>
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
                {filtered.slice(0, 5).map((t: any) => {
                  const sc = getStatusConfigLocal(t.status);
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedSession(t)}>
                      <div className={cn("p-2 rounded-lg shrink-0", ICON.bg)}>
                        <Video className={cn("w-4 h-4", ICON.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#5e5873] truncate">{t.patientName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{t.hn}</span>
                          <span className="text-xs text-gray-300">&bull;</span>
                          <span className="text-xs text-gray-500">{formatThaiShortDate(t.datetime)}</span>
                        </div>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap shrink-0", sc.bg, sc.color)}>
                        {sc.label}
                      </span>
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
            <h3 className="text-sm text-gray-600">รายการ Tele-med</h3>
            <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length} รายการ</span>
          </div>

          {/* Desktop: Table */}
          <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EDE9FE]/30">
                    <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย / หน่วยงานต้นทาง</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">หัวข้อปรึกษา</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">แพทย์ผู้เชี่ยวชาญ</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">ช่องทาง</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">วันที่</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                    <TableHead className="text-xs w-[80px]">ดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t: any) => {
                    const sc = getStatusConfigLocal(t.status);
                    const chLabel: Record<string, string> = { mobile: 'Mobile', agency: 'รพ.สต.', hospital: 'รพ.' };
                    return (
                      <TableRow key={t.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => setSelectedSession(t)}>
                        <TableCell>
                          <div className="text-sm text-[#5e5873]">{t.patientName}</div>
                          <div className="text-xs text-gray-400">HN: {t.hn}</div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-[180px] truncate">{t.title}</TableCell>
                        <TableCell className="text-sm text-gray-600">{t.doctor}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Video size={14} className={ICON.text} />
                            <span className="text-sm text-[#5e5873]">{chLabel[t.channel] || t.channel}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{formatThaiShortDate(t.datetime)}</TableCell>
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
                <Video className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>ไม่พบรายการ Tele-med</p>
              </div>
            )}
          </Card>

          {/* Mobile: Card-based list */}
          <div className="md:hidden space-y-3">
            {filtered.map((t: any) => {
              const sc = getStatusConfigLocal(t.status);
              const chLabel: Record<string, string> = { mobile: 'Mobile', agency: 'รพ.สต.', hospital: 'รพ.' };
              return (
                <Card
                  key={t.id}
                  className="border-gray-100 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedSession(t)}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("p-2 rounded-lg shrink-0", ICON.bg)}>
                          <Video className={cn("w-4 h-4", ICON.text)} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-[#5e5873] truncate">{t.patientName}</p>
                          <p className="text-xs text-gray-400">HN: {t.hn}</p>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs whitespace-nowrap shrink-0", sc.bg, sc.color)}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Video size={12} className={ICON.text} />
                        <span>{chLabel[t.channel] || t.channel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-gray-400" />
                        <span>{formatThaiShortDate(t.datetime)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-xs text-gray-500 truncate max-w-[160px]">{t.doctor}</span>
                      <ChevronRight size={16} className="text-gray-300" />
                    </div>
                  </div>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>ไม่พบรายการ Tele-med</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
