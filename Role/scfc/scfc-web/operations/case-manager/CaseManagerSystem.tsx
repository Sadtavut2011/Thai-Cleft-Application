import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, Users, Building2, MapPin,
  TrendingUp, Phone, Mail, Clock, CheckCircle,
  AlertCircle, UserCheck, ChevronRight, CalendarDays,
  Activity, Eye, LayoutDashboard, List, Home, Baby,
  PieChart as PieChartIcon
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { CASE_MANAGER_DATA, CaseManager } from '../../../../../data/patientData';
import { buildServiceUnits } from '../../../../../data/themeConfig';
import { CMDrilldownView } from './drilldown/shared';
import { StatusDrilldown as CMStatusDrilldown } from './drilldown/StatusDrilldown';
import { ProvinceDrilldown as CMProvinceDrilldown } from './drilldown/ProvinceDrilldown';
import { WorkloadDrilldown } from './drilldown/WorkloadDrilldown';
import { TopPerformersDrilldown } from './drilldown/TopPerformersDrilldown';

// ===== Color: CM = #7367f0 (ม่วง, สีหลักระบบ) =====

const PROVINCES = ['ทั้งหมด', 'เชียงใหม่', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'พะเยา', 'แพร่', 'น่าน', 'แม่ฮ่องสอน'];

const getStatusLabel = (s: string) => {
  if (s === 'active') return 'ปฏิบัติงาน';
  if (s === 'leave') return 'ลาพัก';
  if (s === 'inactive') return 'ไม่ใช้งาน';
  return s;
};
const getStatusStyle = (s: string) => {
  if (s === 'active') return { color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]', dot: 'bg-[#28c76f]' };
  if (s === 'leave') return { color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', dot: 'bg-[#ff9f43]' };
  return { color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', dot: 'bg-[#EA5455]' };
};
const statusFilterMap: Record<string, string> = { 'ปฏิบัติงาน': 'active', 'ลาพัก': 'leave', 'ไม่ใช้งาน': 'inactive' };

const formatLastActive = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ชม.ที่แล้ว`;
    return `${Math.floor(hrs / 24)} วันที่แล้ว`;
  } catch { return dateStr; }
};
const formatThaiDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try { return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }); } catch { return dateStr; }
};

// ── CM Detail Panel ──
function CMDetailPanel({ cm, onClose }: { cm: CaseManager; onClose: () => void }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Button variant="outline" size="sm" className="h-9 border-gray-200 text-[#5e5873] bg-white shadow-sm rounded-xl" onClick={onClose}>
        <ArrowLeft size={16} className="mr-2" /> กลับไปรายการ
      </Button>

      {/* Profile */}
      <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#7367f0] to-[#9e95f5] p-6 text-white">
          <div className="flex items-center gap-5">
            <img src={cm.image} alt={cm.name} className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg bg-white" />
            <div>
              <h2 className="text-xl text-white">{cm.name}</h2>
              <p className="text-white/70 text-sm">{cm.position}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 rounded-full text-xs bg-white/20 text-white">{getStatusLabel(cm.status)}</span>
                <span className="text-white/60 text-xs">{cm.id}</span>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600"><Phone size={16} className="text-[#7367f0] shrink-0" /><span>{cm.phone}</span></div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><Mail size={16} className="text-[#7367f0] shrink-0" /><span className="truncate">{cm.email}</span></div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><MapPin size={16} className="text-[#7367f0] shrink-0" /><span>จ.{cm.province}</span></div>
            <div className="flex items-center gap-3 text-sm text-gray-600"><CalendarDays size={16} className="text-[#7367f0] shrink-0" /><span>เข้าร่วม: {formatThaiDate(cm.joinDate)}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ผู้ป่วย', value: cm.patientCount, sub: 'ในความดูแล', color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10', icon: Baby },
          { label: 'เยี่ยมบ้าน', value: cm.activeVisits, sub: 'กำลังดำเนินการ', color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10', icon: Home },
          { label: 'สำเร็จ', value: cm.completedVisits, sub: 'เยี่ยมเสร็จสิ้น', color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10', icon: CheckCircle },
          { label: 'ทุนรอพิจารณา', value: cm.pendingFunds, sub: 'รอพิจารณา', color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10', icon: Clock },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl", s.bg)}><s.icon className={cn("w-5 h-5", s.color)} /></div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={cn("text-xl", s.color)}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hospitals */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
            <Building2 size={18} className="text-[#7367f0]" /> โรงพยาบาลที่รับผิดชอบ ({cm.hospitals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cm.hospitals.map(h => (
              <div key={h.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-9 h-9 rounded-lg bg-[#7367f0]/10 text-[#7367f0] flex items-center justify-center shrink-0">
                  <Building2 size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#5e5873] truncate">{h.name}</p>
                  <p className="text-xs text-gray-400">จ.{h.province}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
            <Activity size={18} className="text-[#7367f0]" /> กิจกรรมล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 border-l-2 border-gray-100 space-y-5 ml-2">
            {[
              { label: 'เยี่ยมบ้านผู้ป่วย ด.ช. สมชาย', time: 'เมื่อวาน 14:30 น.', color: 'bg-[#28c76f]' },
              { label: 'ส่งรายงานทุนสงเคราะห์', time: '2 วันที่แล้ว', color: 'bg-[#4285f4]' },
              { label: 'ประสานงานส่งตัวผู้ป่วย', time: '5 วันที่แล้ว', color: 'bg-[#ff6d00]' },
              { label: 'อัปเดตข้อมูลการรักษา', time: '1 สัปดาห์ที่แล้ว', color: 'bg-[#7367f0]' },
            ].map((act, i) => (
              <div key={i} className="relative">
                <div className={cn("absolute -left-[29px] top-1 w-3 h-3 rounded-full ring-4 ring-white", act.color)}></div>
                <p className="text-sm text-[#5e5873]">{act.label}</p>
                <p className="text-xs text-gray-400">{act.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Component ──
export default function CaseManagerSystem({ onBack }: { onBack?: () => void }) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState('ทุกสถานะ');
  const [selectedCM, setSelectedCM] = useState<CaseManager | null>(null);
  const [cmDrilldown, setCmDrilldown] = useState<CMDrilldownView>(null);

  const filtered = useMemo(() => {
    return CASE_MANAGER_DATA.filter(cm => {
      const matchSearch = !searchQuery ||
        cm.name.includes(searchQuery) ||
        cm.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cm.hospitals.some(h => h.name.includes(searchQuery));
      const matchProvince = selectedProvince === 'ทั้งหมด' || cm.province === selectedProvince;
      const matchStatus = selectedStatus === 'ทุกสถานะ' || cm.status === statusFilterMap[selectedStatus];
      return matchSearch && matchProvince && matchStatus;
    });
  }, [searchQuery, selectedProvince, selectedStatus]);

  // ═══ Stats (filtered by province — synced with mobile) ═══
  const stats = useMemo(() => {
    const all = CASE_MANAGER_DATA;
    const byProvince = selectedProvince === 'ทั้งหมด' ? all : all.filter(c => c.province === selectedProvince);
    return {
      total: byProvince.length,
      active: byProvince.filter(c => c.status === 'active').length,
      leave: byProvince.filter(c => c.status === 'leave').length,
      inactive: byProvince.filter(c => c.status === 'inactive').length,
      totalPatients: byProvince.reduce((s, c) => s + c.patientCount, 0),
      totalHospitals: new Set(byProvince.flatMap(c => c.hospitals.map(h => h.id))).size,
      avgPatients: byProvince.length > 0 ? Math.round(byProvince.reduce((s, c) => s + c.patientCount, 0) / byProvince.length) : 0,
    };
  }, [selectedProvince]);

  // ═══ Pie data (synced with mobile — 3 items) ═══
  const statusChartData = useMemo(() => [
    { name: 'ปฏิบัติงาน', value: stats.active, color: '#28c76f' },
    { name: 'ลาพัก', value: stats.leave, color: '#ff9f43' },
    { name: 'ไม่ใช้งาน', value: stats.inactive, color: '#ea5455' },
  ].filter(d => d.value > 0), [stats]);

  // ═══ Overloaded CMs (synced with mobile) ═══
  const overloadedCMs = useMemo(() => CASE_MANAGER_DATA.filter(c => c.patientCount > 40 && c.status === 'active'), []);

  // ═══ Top performers (synced with mobile) ═══
  const topCMs = useMemo(() => CASE_MANAGER_DATA.filter(c => c.status === 'active').sort((a, b) => b.patientCount - a.patientCount).slice(0, 3), []);

  // ═══ Service units (synced with mobile) ═══
  const serviceUnits = useMemo(() => buildServiceUnits(), []);
  const totalServiceCases = useMemo(() => serviceUnits.reduce((s, u) => s + u.caseCount, 0), [serviceUnits]);

  // ═══ Drilldown rendering ═══
  if (cmDrilldown) {
    if (cmDrilldown.type === 'status') {
      return (
        <CMStatusDrilldown
          filter={cmDrilldown.filter}
          label={cmDrilldown.label}
          onBack={() => setCmDrilldown(null)}
          onSelectCM={(cm) => { setCmDrilldown(null); setSelectedCM(cm); }}
        />
      );
    }
    if (cmDrilldown.type === 'province') {
      return (
        <CMProvinceDrilldown
          province={cmDrilldown.province}
          onBack={() => setCmDrilldown(null)}
          onSelectCM={(cm) => { setCmDrilldown(null); setSelectedCM(cm); }}
        />
      );
    }
    if (cmDrilldown.type === 'workload') {
      return (
        <WorkloadDrilldown
          onBack={() => setCmDrilldown(null)}
          onSelectCM={(cm) => { setCmDrilldown(null); setSelectedCM(cm); }}
        />
      );
    }
    if (cmDrilldown.type === 'topPerformers') {
      return (
        <TopPerformersDrilldown
          onBack={() => setCmDrilldown(null)}
          onSelectCM={(cm) => { setCmDrilldown(null); setSelectedCM(cm); }}
        />
      );
    }
  }

  // Detail view
  if (selectedCM) {
    return (
      <div className="max-w-[1400px] mx-auto pb-12 font-['IBM_Plex_Sans_Thai']">
        <CMDetailPanel cm={selectedCM} onClose={() => setSelectedCM(null)} />
      </div>
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
          <div className="bg-[#7367f0]/10 p-2.5 rounded-xl">
            <Users className="w-6 h-6 text-[#7367f0]" />
          </div>
          <div>
            <h1 className="text-[#5e5873] text-xl">จัดการ Case Manager</h1>
            <p className="text-xs text-gray-500">บริหารจัดการบุคลากรผู้ประสานงานเครือข่าย</p>
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
          <Input placeholder="ค้นหาชื่อ CM, รหัส, โรงพยาบาล..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-[#7367f0]" /><SelectValue /></div>
            </SelectTrigger>
            <SelectContent>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><UserCheck size={14} className="text-[#7367f0]" /><SelectValue /></div>
            </SelectTrigger>
            <SelectContent>
              {['ทุกสถานะ', 'ปฏิบัติงาน', 'ลาพัก', 'ไม่ใช้งาน'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
              { label: 'CM ทั้งหมด', value: stats.total, icon: Users, iconColor: 'text-[#7367f0]', iconBg: 'bg-[#7367f0]/10', borderColor: 'border-gray-100' },
              { label: 'ปฏิบัติงาน', value: stats.active, icon: UserCheck, iconColor: 'text-green-600', iconBg: 'bg-green-50', borderColor: 'border-green-100' },
              { label: 'ผู้ป่วยในระบบ', value: stats.totalPatients, icon: Baby, iconColor: 'text-blue-600', iconBg: 'bg-blue-50', borderColor: 'border-blue-100' },
              { label: 'โรงพยาบาล', value: stats.totalHospitals, icon: Building2, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', borderColor: 'border-amber-100' },
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

          {/* ═══ สถานะ CM Pie Chart (standalone — synced with mobile) ═══ */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#7367f0]" /> สถานะ CM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-[220px] relative flex items-center justify-center" style={{ minHeight: 220 }}>
                  <ResponsiveContainer width="100%" height={220} minWidth={0} debounce={50}>
                    <PieChart>
                      <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                        {statusChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl text-[#37286A]">{stats.total}</span>
                    <span className="text-xs text-[#7066A9]">คน</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {statusChartData.map((item) => (
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

          {/* ═══ ทีมงาน + Workload + CM ดูแลมากที่สุด (synced with mobile) ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Card A: ทีมงาน/หน่วยบริการ (2 items + "+X เพิ่มเติม") */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#7367f0]" /> ทีมงาน/หน่วยบริการ
                </CardTitle>
                <span className="text-xs text-white bg-[#7367f0] px-1.5 py-0.5 rounded-full">{serviceUnits.length} แห่ง</span>
              </CardHeader>
              <CardContent className="space-y-2.5 flex-1">
                {serviceUnits.slice(0, 2).map((unit) => (
                  <div key={unit.name} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-[#7367f0]/10 flex items-center justify-center shrink-0">
                        <Building2 size={12} className="text-[#7367f0]" />
                      </div>
                      <span className="text-sm text-[#37286A] truncate">{unit.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#EDE9FE] text-[#5B4FCC] text-[11px] px-2 py-0.5 rounded-full">{unit.caseCount} เคส</span>
                        <span className="bg-[#E0FBFC] text-[#00B8D4] text-[11px] px-2 py-0.5 rounded-full">{unit.patientCount} ผู้ป่วย</span>
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0">{unit.parentHospital}</span>
                    </div>
                  </div>
                ))}
                {serviceUnits.length > 2 && (
                  <div className="text-center text-xs text-[#7066A9] pt-1">+{serviceUnits.length - 2} หน่วยเพิ่มเติม</div>
                )}
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#7066A9]">เคสรวม</span>
                  <span className="text-sm text-[#7367f0]">{totalServiceCases} เคส</span>
                </div>
                <button
                  onClick={() => setViewMode('list')}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* Card B: Workload Alert */}
            <Card className={cn("border-gray-100 shadow-sm rounded-xl flex flex-col", overloadedCMs.length > 0 && "border-red-100")}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <AlertCircle className={cn("w-5 h-5", overloadedCMs.length > 0 ? "text-[#EA5455]" : "text-[#7367f0]")} /> Workload Alert
                </CardTitle>
                {overloadedCMs.length > 0 && (
                  <span className="text-xs text-[#EA5455] bg-[#FCEAEA] px-1.5 py-0.5 rounded-full">{overloadedCMs.length} คน</span>
                )}
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                {overloadedCMs.length > 0 ? (
                  overloadedCMs.map(cm => (
                    <div key={cm.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 cursor-pointer hover:bg-amber-50 transition-colors" onClick={() => setSelectedCM(cm)}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#37286A] truncate">{cm.name}</p>
                        <p className="text-xs text-[#EA5455]">{cm.patientCount} ผู้ป่วย | {cm.hospitals.length} รพ.</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <CheckCircle className="w-8 h-8 mx-auto mb-1 opacity-20" />
                    <p className="text-sm">ภาระงานปกติ</p>
                  </div>
                )}
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => setCmDrilldown({ type: 'workload' })}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* Card C: CM ดูแลมากที่สุด */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#7367f0]" /> CM ดูแลมากที่สุด
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 flex-1">
                {topCMs.map((cm, i) => (
                  <div
                    key={cm.id}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100/80 transition-colors"
                    onClick={() => setSelectedCM(cm)}
                  >
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
                      i === 0 ? "bg-[#7367f0] text-white" : i === 1 ? "bg-[#9e95f5] text-white" : "bg-[#c4bffa] text-[#5e5873]"
                    )}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#37286A] truncate">{cm.name}</p>
                      <p className="text-xs text-[#7066A9]">{cm.hospitals.length} รพ.</p>
                    </div>
                    <span className="text-sm text-[#7367f0]">{cm.patientCount}</span>
                  </div>
                ))}
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => setCmDrilldown({ type: 'topPerformers' })}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>
          </div>

          {/* ═══ รายชื่อ CM Table (kept) ═══ */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#7367f0]" /> รายชื่อ Case Manager
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
                      <TableHead className="text-xs text-[#5e5873]">ชื่อ / รหัส</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead>
                      <TableHead className="text-xs text-[#5e5873] text-center">ผู้ป่วย</TableHead>
                      <TableHead className="text-xs text-[#5e5873] text-center">เยี่ยมบ้าน</TableHead>
                      <TableHead className="text-xs text-[#5e5873] text-center">สถานะ</TableHead>
                      <TableHead className="text-xs text-[#5e5873] w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CASE_MANAGER_DATA.slice(0, 5).map((cm) => {
                      const ss = getStatusStyle(cm.status);
                      return (
                        <TableRow key={cm.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedCM(cm)}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 border border-white shadow-sm shrink-0" />
                              <div>
                                <div className="text-sm text-[#5e5873]">{cm.name}</div>
                                <div className="text-xs text-gray-400">{cm.id} • จ.{cm.province}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {cm.hospitals.slice(0, 2).map(h => (
                                <span key={h.id} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-100">
                                  <Building2 size={10} className="text-[#7367f0]" /> {h.name.replace('รพ.', '')}
                                </span>
                              ))}
                              {cm.hospitals.length > 2 && <span className="text-xs text-[#7367f0]">+{cm.hospitals.length - 2}</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={cn("text-sm", cm.patientCount > 40 ? "text-[#EA5455]" : "text-[#5e5873]")}>{cm.patientCount}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-sm text-[#28c76f]">{cm.activeVisits}</span>
                            <span className="text-xs text-gray-400"> / {cm.completedVisits}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={cn("px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1.5", ss.bg, ss.color)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", ss.dot)}></span>
                              {getStatusLabel(cm.status)}
                            </span>
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
                {CASE_MANAGER_DATA.slice(0, 5).map((cm) => {
                  const ss = getStatusStyle(cm.status);
                  return (
                    <div key={cm.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedCM(cm)}>
                      <img src={cm.image} alt={cm.name} className="w-10 h-10 rounded-full bg-gray-100 border border-white shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#5e5873] truncate">{cm.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                          <span>{cm.id}</span>
                          <span>&bull;</span>
                          <span>{cm.patientCount} ผู้ป่วย</span>
                          <span>&bull;</span>
                          <span>{cm.activeVisits} เยี่ยมบ้าน</span>
                        </div>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap shrink-0 inline-flex items-center gap-1", ss.bg, ss.color)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", ss.dot)}></span>
                        {getStatusLabel(cm.status)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== LIST VIEW ===== */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm text-gray-600">รายชื่อ Case Manager</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{filtered.length} คน</span>
          </div>

          <div className="space-y-3">
            {filtered.map((cm) => {
              const ss = getStatusStyle(cm.status);
              return (
                <Card key={cm.id} className="border-gray-100 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer" onClick={() => setSelectedCM(cm)}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={cm.image} alt={cm.name} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-100 shrink-0" />
                          <div className="min-w-0">
                            <h3 className="text-[#5e5873] text-base truncate">{cm.name}</h3>
                            <p className="text-xs text-gray-400">{cm.id} • {cm.position}</p>
                          </div>
                        </div>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs shrink-0 inline-flex items-center gap-1.5", ss.bg, ss.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", ss.dot)}></span>
                          {getStatusLabel(cm.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 pt-2 border-t border-dashed border-gray-100 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin size={12} /> จ.{cm.province}</span>
                        <span className="flex items-center gap-1"><Baby size={12} /> {cm.patientCount} ผู้ป่วย</span>
                        <span className="flex items-center gap-1"><Home size={12} /> {cm.activeVisits} เยี่ยมบ้าน</span>
                        <span className="flex items-center gap-1"><Building2 size={12} /> {cm.hospitals.length} รพ.</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>ไม่พบ Case Manager</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}