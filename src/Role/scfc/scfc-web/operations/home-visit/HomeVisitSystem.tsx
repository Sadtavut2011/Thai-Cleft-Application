import React, { useState, useMemo } from 'react';
import { 
  Home, Search, Clock, MapPin, CheckCircle2, 
  Filter, BarChart3, Calendar, List, ChevronRight,
  ArrowLeft, Users, AlertCircle, TrendingUp,
  LayoutDashboard, Eye, XCircle, PlusCircle, Building2,
  Handshake, Share2
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { HOME_VISIT_DATA, PATIENTS_DATA, getPatientByHn } from "../../../../../data/patientData";
import { PURPLE, SYSTEM_ICON_COLORS, PROVINCES, HOSPITALS } from "../../../../../data/themeConfig";
import { HomeVisitRequestDetail } from "./HomeVisitRequestDetail";
import { TeamDetailCard } from "./TeamDetailCard";
import { HVDrilldownView } from "./drilldown/shared";
import { StatusDrilldown as HVStatusDrilldown } from "./drilldown/StatusDrilldown";
import { HospitalDrilldown as HVHospitalDrilldown } from "./drilldown/HospitalDrilldown";

// ===== UI = สีม่วง / Icon = สีเขียว (#28c76f) =====
const ICON = SYSTEM_ICON_COLORS.homeVisit;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Pending:    { label: 'รอการตอบรับ', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', border: 'border-orange-100' },
  WaitVisit:  { label: 'รอเยี่ยม',   color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  InProgress: { label: 'ดำเนินการ',  color: 'text-[#00CFE8]', bg: 'bg-[#E0FBFC]', border: 'border-cyan-100' },
  Completed:  { label: 'เสร็จสิ้น',  color: 'text-[#28C76F]', bg: 'bg-[#E5F8ED]', border: 'border-green-100' },
  Rejected:   { label: 'ปฏิเสธ',    color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', border: 'border-red-100' },
  NotHome:    { label: 'ไม่อยู่',    color: 'text-[#B9B9C3]', bg: 'bg-[#F8F8F8]', border: 'border-gray-200' },
  NotAllowed: { label: 'ไม่อนุญาต', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', border: 'border-red-100' },
};

const HOSPITAL_PROVINCE_MAP: Record<string, string> = {
  'โรงพยาบาลมหาราชนครเชียงใหม่': 'เชียงใหม่',
  'โรงพยาบาลนครพิงค์': 'เชียงใหม่',
  'โรงพยาบาลฝาง': 'เชียงใหม่',
  'โรงพยาบาลจอมทอง': 'เชียงใหม่',
  'โรงพยาบาลเชียงรายประชานุเคราะห์': 'เชียงราย',
  'โรงพยาบาลแม่จัน': 'เชียงราย',
  'โรงพยาบาลลำพูน': 'ลำพูน',
  'โรงพยาบาลลำปาง': 'ลำปาง',
  'โรงพยาบาลแม่ฮ่องสอน': 'แม่ฮ่องสอน',
  'รพ.สต. บ้านหนองหอย': 'เชียงใหม่',
};

const matchHospitalFilter = (dataHospital: string, filterHospital: string): boolean => {
  if (filterHospital === 'ทั้งหมด') return true;
  const normalized = (dataHospital || '').replace('โรงพยาบาล', 'รพ.').trim();
  return normalized === filterHospital || dataHospital === filterHospital || dataHospital.includes(filterHospital.replace('รพ.', ''));
};

const getStatusKey = (status: string): string => {
  const s = (status || '').toLowerCase();
  if (['inprogress', 'in_progress', 'working', 'ลงพื้นที่', 'ดำเนินการ'].includes(s)) return 'InProgress';
  if (['accepted', 'accept', 'รับงาน'].includes(s)) return 'WaitVisit';
  if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited'].includes(s)) return 'Completed';
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(s)) return 'Rejected';
  if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(s)) return 'WaitVisit';
  if (['nothome', 'not_home', 'ไม่อยู่'].includes(s)) return 'NotHome';
  if (['notallowed', 'not_allowed', 'ไม่อนุญาต'].includes(s)) return 'NotAllowed';
  return 'Pending';
};

const getStatusConfig = (status: string) => {
  const s = (status || '').toLowerCase();
  if (['inprogress', 'in_progress', 'working', 'ลงพื้นที่', 'ดำเนินการ'].includes(s)) return STATUS_CONFIG.InProgress;
  if (['accepted', 'accept', 'รับงาน'].includes(s)) return STATUS_CONFIG.WaitVisit;
  if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited'].includes(s)) return STATUS_CONFIG.Completed;
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(s)) return STATUS_CONFIG.Rejected;
  if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(s)) return STATUS_CONFIG.WaitVisit;
  if (['nothome', 'not_home', 'ไม่อยู่'].includes(s)) return STATUS_CONFIG.NotHome;
  if (['notallowed', 'not_allowed', 'ไม่อนุญาต'].includes(s)) return STATUS_CONFIG.NotAllowed;
  return STATUS_CONFIG.Pending;
};

const formatThaiShortDate = (raw: string | undefined): string => {
  if (!raw || raw === '-') return '-';
  if (/[ก-๙]/.test(raw)) return raw;
  try {
    const safeRaw = raw.match(/^\d{4}-\d{2}-\d{2}$/) ? raw + 'T00:00:00' : raw;
    const d = new Date(safeRaw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch { return raw; }
};

interface HomeVisitSystemProps {
  onBack?: () => void;
  onViewPatient?: (patient: any) => void;
}

export function HomeVisitSystem({ onBack, onViewPatient }: HomeVisitSystemProps) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('ทั้งหมด');
  const [hospitalFilter, setHospitalFilter] = useState('ทั้งหมด');
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null);
  const [showTeamDetail, setShowTeamDetail] = useState(false);
  const [showVisitTypeDetail, setShowVisitTypeDetail] = useState(false);
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null);
  const [hvDrilldown, setHvDrilldown] = useState<HVDrilldownView>(null);

  const visits = useMemo(() => {
    const source = HOME_VISIT_DATA && HOME_VISIT_DATA.length > 0 ? HOME_VISIT_DATA : [];
    return source.map((v: any) => ({
      ...v,
      id: v.id || `HV-${Math.random().toString(36).substr(2, 6)}`,
      patientName: v.patientName || v.name || 'ไม่ระบุชื่อ',
      patientId: v.patientId || v.hn || '-',
      patientAddress: v.patientAddress || 'ไม่ระบุที่อยู่',
      type: v.type || 'Joint',
      rph: v.rph || v.provider || '-',
      status: v.status || 'Pending',
      requestDate: v.requestDate || v.date || '-',
      hospital: v.hospital || 'โรงพยาบาลฝาง',
      province: v.province || 'เชียงใหม่',
    }));
  }, []);

  const filteredVisits = useMemo(() => {
    return visits.filter((v: any) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term || (v.patientName || '').toLowerCase().includes(term) || (v.patientId || '').toLowerCase().includes(term) || (v.rph || '').toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || getStatusKey(v.status).toLowerCase() === statusFilter.toLowerCase();
      const hosp = v.hospital || '';
      const matchesProv = provinceFilter === 'ทั้งหมด' || (HOSPITAL_PROVINCE_MAP[hosp] || v.province || '') === provinceFilter;
      const matchesHosp = matchHospitalFilter(hosp, hospitalFilter);
      return matchSearch && matchStatus && matchesProv && matchesHosp;
    });
  }, [visits, searchTerm, statusFilter, provinceFilter, hospitalFilter]);

  const stats = useMemo(() => {
    const total = filteredVisits.length;
    const pending = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'Pending').length;
    const waitVisit = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'WaitVisit').length;
    const inProgress = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'InProgress').length;
    const completed = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'Completed').length;
    const rejected = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'Rejected').length;
    const notHome = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'NotHome').length;
    const notAllowed = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'NotAllowed').length;
    return { total, pending, waitVisit, inProgress, completed, rejected, notHome, notAllowed };
  }, [filteredVisits]);

  const pieData = useMemo(() => [
    { name: 'รอตอบรับ', value: stats.pending, color: '#ff9f43' },
    { name: 'รอเยี่ยม', value: stats.waitVisit, color: '#f5a623' },
    { name: 'ดำเนินการ', value: stats.inProgress, color: '#00cfe8' },
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
    { name: 'ไม่อยู่', value: stats.notHome, color: '#B9B9C3' },
    { name: 'ไม่อนุญาต', value: stats.notAllowed, color: '#e74c3c' },
  ], [stats]);

  const barData = useMemo(() => {
    const rphToHospital = new Map<string, string>();
    PATIENTS_DATA.forEach((p: any) => { const rph = p.responsibleHealthCenter || p.hospitalInfo?.responsibleRph || ''; const hosp = p.hospital || ''; if (rph && hosp) rphToHospital.set(rph, hosp); });
    const map = new Map<string, number>();
    filteredVisits.forEach((v: any) => { const rph = v.rph || ''; const parentHosp = rphToHospital.get(rph) || v.hospital || rph || 'อื่นๆ'; const shortName = parentHosp.replace('โรงพยาบาล', 'รพ.').replace('รพ.สต.', '').trim(); map.set(shortName, (map.get(shortName) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.length > 10 ? name.slice(0, 10) + '..' : name, fullName: name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filteredVisits]);

  const visitTypeData = useMemo(() => {
    const rphToHospital = new Map<string, string>();
    PATIENTS_DATA.forEach((p: any) => { const rph = p.responsibleHealthCenter || p.hospitalInfo?.responsibleRph || ''; const hosp = p.hospital || ''; if (rph && hosp) rphToHospital.set(rph, hosp); });
    const hospMap = new Map<string, Map<string, { delegated: number; joint: number; total: number }>>();
    filteredVisits.forEach((v: any) => { const rph = v.rph || '-'; const parentHosp = rphToHospital.get(rph) || v.hospital || 'อื่นๆ'; const isDelegated = (v.type || '').toLowerCase() === 'delegated'; if (!hospMap.has(parentHosp)) hospMap.set(parentHosp, new Map()); const rphMap = hospMap.get(parentHosp)!; if (!rphMap.has(rph)) rphMap.set(rph, { delegated: 0, joint: 0, total: 0 }); const entry = rphMap.get(rph)!; if (isDelegated) { entry.delegated++; } else { entry.joint++; } entry.total++; });
    return Array.from(hospMap.entries()).map(([hospital, rphMap]) => { const rphs = Array.from(rphMap.entries()).map(([rphName, counts]) => ({ name: rphName, ...counts })).sort((a, b) => b.total - a.total); const totalDelegated = rphs.reduce((s, r) => s + r.delegated, 0); const totalJoint = rphs.reduce((s, r) => s + r.joint, 0); return { hospital, rphs, delegated: totalDelegated, joint: totalJoint, total: totalDelegated + totalJoint }; }).sort((a, b) => b.total - a.total);
  }, [filteredVisits]);

  const totalDelegated = useMemo(() => filteredVisits.filter((v: any) => (v.type || '').toLowerCase() === 'delegated').length, [filteredVisits]);
  const totalJoint = useMemo(() => filteredVisits.length - totalDelegated, [filteredVisits, totalDelegated]);

  const teamsData = useMemo(() => {
    const pcuMap = new Map<string, { parentHospital: string; count: number }>();
    PATIENTS_DATA.forEach((p: any) => { const pcu = p.responsibleHealthCenter || p.hospitalInfo?.responsibleRph || '-'; if (pcu === '-') return; const hosp = p.hospital || ''; const matchesProv = provinceFilter === 'ทั้งหมด' || (HOSPITAL_PROVINCE_MAP[hosp] || '') === provinceFilter; const matchesHosp = matchHospitalFilter(hosp, hospitalFilter); if (!matchesProv || !matchesHosp) return; if (!pcuMap.has(pcu)) pcuMap.set(pcu, { parentHospital: hosp, count: 0 }); pcuMap.get(pcu)!.count++; });
    const visitCounts = new Map<string, number>(); filteredVisits.forEach((v: any) => { const rph = v.rph || '-'; visitCounts.set(rph, (visitCounts.get(rph) || 0) + 1); });
    const allKeys = new Set([...pcuMap.keys(), ...visitCounts.keys()]);
    return Array.from(allKeys).filter(k => k !== '-').map(k => ({ name: k, parentHospital: (pcuMap.get(k)?.parentHospital || '-').replace('โรงพยาบาล', 'รพ.').trim(), visitCount: visitCounts.get(k) || 0, patientCount: pcuMap.get(k)?.count || 0 })).sort((a, b) => b.visitCount - a.visitCount);
  }, [filteredVisits, provinceFilter, hospitalFilter]);

  const filteredPatients = useMemo(() => {
    return PATIENTS_DATA.filter((p: any) => { const hosp = p.hospital || ''; const matchesProv = provinceFilter === 'ทั้งหมด' || (HOSPITAL_PROVINCE_MAP[hosp] || '') === provinceFilter; const matchesHosp = matchHospitalFilter(hosp, hospitalFilter); return matchesProv && matchesHosp; });
  }, [provinceFilter, hospitalFilter]);

  if (hvDrilldown) {
    if (hvDrilldown.type === 'status' || hvDrilldown.type === 'pie') { return <HVStatusDrilldown visits={visits} filter={hvDrilldown.type === 'pie' ? 'all' : hvDrilldown.filter} label={hvDrilldown.type === 'pie' ? 'ภาพรวมสถานะเยี่ยมบ้าน' : hvDrilldown.label} onBack={() => setHvDrilldown(null)} onSelectVisit={(v) => { setHvDrilldown(null); setSelectedVisit(v); }} />; }
    if (hvDrilldown.type === 'hospital') { return <HVHospitalDrilldown visits={visits} hospitalName={hvDrilldown.hospitalName} onBack={() => setHvDrilldown(null)} onSelectVisit={(v) => { setHvDrilldown(null); setSelectedVisit(v); }} />; }
  }

  if (selectedVisit) { return <HomeVisitRequestDetail request={{ id: selectedVisit.id, patientName: selectedVisit.patientName, patientId: selectedVisit.patientId, patientAddress: selectedVisit.patientAddress || 'ไม่ระบุที่อยู่', type: selectedVisit.type === 'Delegated' ? 'Delegated' : 'Joint', rph: selectedVisit.rph, requestDate: selectedVisit.requestDate, status: selectedVisit.status || 'Pending', note: selectedVisit.note }} onBack={() => setSelectedVisit(null)} />; }

  if (showTeamDetail) { return <div className="max-w-[1400px] mx-auto pb-12 font-['IBM_Plex_Sans_Thai']"><TeamDetailCard provinceFilter={provinceFilter} hospitalFilter={hospitalFilter} onSelectVisit={(v) => { setShowTeamDetail(false); setSelectedVisit(v); }} onBack={() => setShowTeamDetail(false)} fullPage /></div>; }

  if (showVisitTypeDetail) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setShowVisitTypeDetail(false); setExpandedHospital(null); }} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
          <div className={cn("p-2.5 rounded-xl", ICON.bg)}><Share2 className={cn("w-6 h-6", ICON.text)} /></div>
          <div><h1 className="text-[#5e5873] text-xl">ประเภทการเยี่ยมบ้านตามโรงพยาบาล</h1><p className="text-xs text-gray-500">แยกประเภทฝากเยี่ยม / ลงเยี่ยมร่วม พร้อมรายละเอียด รพ.สต. ในสังกัด</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-100 shadow-sm rounded-xl"><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-xl bg-[#7367f0]/10"><Home className="w-5 h-5 text-[#7367f0]" /></div><div><p className="text-sm text-gray-500">การเยี่ยมบ้านทั้งหมด</p><p className="text-2xl text-[#5e5873]">{filteredVisits.length}</p></div></CardContent></Card>
          <Card className="border-gray-100 shadow-sm rounded-xl"><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-xl bg-[#ff9f43]/10"><Share2 className="w-5 h-5 text-[#ff9f43]" /></div><div><p className="text-sm text-gray-500">ฝากเยี่ยม (Delegated)</p><div className="flex items-baseline gap-2"><p className="text-2xl text-[#5e5873]">{totalDelegated}</p><span className="text-xs text-gray-400">({filteredVisits.length > 0 ? Math.round((totalDelegated / filteredVisits.length) * 100) : 0}%)</span></div></div></CardContent></Card>
          <Card className="border-gray-100 shadow-sm rounded-xl"><CardContent className="p-5 flex items-center gap-4"><div className="p-3 rounded-xl bg-[#00cfe8]/10"><Handshake className="w-5 h-5 text-[#00cfe8]" /></div><div><p className="text-sm text-gray-500">ลงเยี่ยมร่วม (Joint)</p><div className="flex items-baseline gap-2"><p className="text-2xl text-[#5e5873]">{totalJoint}</p><span className="text-xs text-gray-400">({filteredVisits.length > 0 ? Math.round((totalJoint / filteredVisits.length) * 100) : 0}%)</span></div></div></CardContent></Card>
        </div>
        <div className="space-y-4">
          {visitTypeData.map((hosp) => {
            const isExpanded = expandedHospital === hosp.hospital;
            const hospShort = hosp.hospital.replace('โรงพยาบาล', 'รพ.').trim();
            const delegatedPct = hosp.total > 0 ? Math.round((hosp.delegated / hosp.total) * 100) : 0;
            const jointPct = hosp.total > 0 ? Math.round((hosp.joint / hosp.total) * 100) : 0;
            return (
              <Card key={hosp.hospital} className={cn("border-gray-100 shadow-sm rounded-xl transition-all", isExpanded && "border-[#7367f0]/30 shadow-md")}>
                <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedHospital(isExpanded ? null : hosp.hospital)}>
                  <div className={cn("p-2.5 rounded-xl shrink-0", ICON.bg)}><Building2 className={cn("w-5 h-5", ICON.text)} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><p className="text-[#5e5873]">{hospShort}</p><span className="text-xs px-2 py-0.5 rounded-full bg-[#7367f0]/10 text-[#7367f0]">{hosp.total} เคส</span></div>
                    <div className="flex items-center gap-2"><div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden flex"><div className="h-full bg-[#ff9f43] rounded-l-full transition-all" style={{ width: `${delegatedPct}%` }} /><div className="h-full bg-[#00cfe8] rounded-r-full transition-all" style={{ width: `${jointPct}%` }} /></div><div className="flex items-center gap-3 shrink-0"><div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#ff9f43]" /><span className="text-xs text-gray-500">{hosp.delegated}</span></div><div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[#00cfe8]" /><span className="text-xs text-gray-500">{hosp.joint}</span></div></div></div>
                    <span className="text-[10px] text-gray-400">รพ.สต. ในสังกัด {hosp.rphs.length} แห่ง</span>
                  </div>
                  <ChevronRight size={18} className={cn("text-gray-400 shrink-0 transition-transform", isExpanded && "rotate-90")} />
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/30 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-4 mb-1"><div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff9f43]" /><span className="text-xs text-gray-500">ฝากเยี่ยม (Delegated)</span></div><div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#00cfe8]" /><span className="text-xs text-gray-500">ลงเยี่ยมร่วม (Joint)</span></div></div>
                    {hosp.rphs.map((rph) => { const rDPct = rph.total > 0 ? Math.round((rph.delegated / rph.total) * 100) : 0; const rJPct = rph.total > 0 ? Math.round((rph.joint / rph.total) * 100) : 0; return (
                      <div key={rph.name} className="bg-white p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><MapPin size={14} className={ICON.text} /><span className="text-sm text-[#5e5873]">{rph.name}</span></div><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{rph.total} เคส</span></div>
                        <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex"><div className="h-full bg-[#ff9f43] rounded-l-full" style={{ width: `${rDPct}%` }} /><div className="h-full bg-[#00cfe8] rounded-r-full" style={{ width: `${rJPct}%` }} /></div></div>
                        <div className="flex items-center gap-4 mt-1.5"><div className="flex items-center gap-1"><Share2 size={11} className="text-[#ff9f43]" /><span className="text-xs text-gray-500">ฝากเยี่ยม {rph.delegated}</span></div><div className="flex items-center gap-1"><Handshake size={11} className="text-[#00cfe8]" /><span className="text-xs text-gray-500">เยี่ยมร่วม {rph.joint}</span></div></div>
                      </div>
                    ); })}
                  </div>
                )}
              </Card>
            );
          })}
          {visitTypeData.length === 0 && <div className="text-center py-16 text-gray-400"><Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบข้อมูลการเยี่ยมบ้าน</p></div>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai'] px-4 md:px-0">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>}
          <div className={cn("p-2.5 rounded-xl", ICON.bg)}><Home className={cn("w-6 h-6", ICON.text)} /></div>
          <div><h1 className="text-[#5e5873] text-xl">ระบบเยี่ยมบ้าน</h1><p className="text-xs text-gray-500">ติดตามและประสานงานการเยี่ยมบ้านทั่วเครือข่าย</p></div>
        </div>
        <div className="flex items-center gap-3"><div className="bg-gray-100 p-1 rounded-lg flex"><button onClick={() => setViewMode('dashboard')} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all", viewMode === 'dashboard' ? "bg-white text-[#7367f0] shadow-sm" : "text-gray-500 hover:text-gray-700")}><LayoutDashboard size={16} /> แดชบอร์ด</button><button onClick={() => setViewMode('list')} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all", viewMode === 'list' ? "bg-white text-[#7367f0] shadow-sm" : "text-gray-500 hover:text-gray-700")}><List size={16} /> รายการ</button></div></div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="ค้นหาผู้ป่วย, HN, หน่วยบริการ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-lg" /></div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={provinceFilter} onValueChange={setProvinceFilter}><SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm"><div className="flex items-center gap-2"><MapPin size={14} className="text-[#7367f0]" /><SelectValue /></div></SelectTrigger><SelectContent>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
          <Select value={hospitalFilter} onValueChange={setHospitalFilter}><SelectTrigger className="w-[180px] h-11 border-gray-200 rounded-lg text-sm"><div className="flex items-center gap-2"><Building2 size={14} className="text-[#7367f0]" /><SelectValue /></div></SelectTrigger><SelectContent>{HOSPITALS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm"><div className="flex items-center gap-2"><Filter size={14} className="text-[#7367f0]" /><SelectValue placeholder="ทุกสถานะ" /></div></SelectTrigger><SelectContent><SelectItem value="all">ทุกสถานะ</SelectItem><SelectItem value="Pending">รอการตอบรับ</SelectItem><SelectItem value="WaitVisit">รอเยี่ยม</SelectItem><SelectItem value="InProgress">ดำเนินการ</SelectItem><SelectItem value="Completed">เสร็จสิ้น</SelectItem><SelectItem value="Rejected">ปฏิเสธ</SelectItem><SelectItem value="NotHome">ไม่อยู่</SelectItem><SelectItem value="NotAllowed">ไม่อนุญาต</SelectItem></SelectContent></Select>
        </div>
      </div>
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[{ label: 'ทั้งหมด', value: stats.total, icon: Home, iconColor: ICON.text, iconBg: ICON.bg, borderColor: 'border-gray-100', fk: 'all' },{ label: 'รอตอบรับ', value: stats.pending, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', borderColor: 'border-amber-100', fk: 'Pending' },{ label: 'รอเยี่ยม', value: stats.waitVisit, icon: Calendar, iconColor: 'text-yellow-600', iconBg: 'bg-yellow-50', borderColor: 'border-yellow-100', fk: 'WaitVisit' },{ label: 'ดำเนินการ', value: stats.inProgress, icon: TrendingUp, iconColor: 'text-cyan-600', iconBg: 'bg-cyan-50', borderColor: 'border-cyan-100', fk: 'InProgress' },{ label: 'ปฏิเสธ', value: stats.rejected, icon: XCircle, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', borderColor: 'border-rose-100', fk: 'Rejected' },{ label: 'ไม่อยู่', value: stats.notHome, icon: Home, iconColor: 'text-gray-500', iconBg: 'bg-gray-100', borderColor: 'border-gray-200', fk: 'NotHome' },{ label: 'ไม่อนุญาต', value: stats.notAllowed, icon: AlertCircle, iconColor: 'text-red-500', iconBg: 'bg-red-50', borderColor: 'border-red-200', fk: 'NotAllowed' }].map((stat, i) => (
              <Card key={i} className={cn("shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer group", stat.borderColor)} onClick={() => setHvDrilldown({ type: 'status', filter: stat.fk, label: stat.label })}>
                <CardContent className="p-4 flex items-center gap-3"><div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", stat.iconBg)}><stat.icon size={20} className={stat.iconColor} /></div><div><span className="text-2xl text-[#37286A]">{stat.value}</span><p className="text-sm text-[#7066A9]">{stat.label}</p></div></CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><BarChart3 className={cn("w-5 h-5", ICON.text)} /> ภาพรวมสถานะ</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-[220px] relative flex items-center justify-center" style={{ minHeight: 220 }}>
                  <ResponsiveContainer width="100%" height={220} minWidth={0} debounce={50}><PieChart><Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">{pieData.filter(d => d.value > 0).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} /></PieChart></ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl text-[#37286A]">{stats.total}</span><span className="text-xs text-[#7066A9]">ทั้งหมด</span></div>
                </div>
                <div className="space-y-2.5">{pieData.map((item) => <div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} /><span className="text-sm text-[#5e5873]">{item.name}</span></div><div className="flex items-center gap-1"><span className="text-sm text-[#37286A]">{item.value}</span><span className="text-xs text-[#7066A9]">({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)</span></div></div>)}</div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Share2 className={cn("w-5 h-5", ICON.text)} /> ประเภทการเยี่ยม</CardTitle></CardHeader>
              <CardContent className="space-y-3 flex-1">
                <div className="flex items-center gap-3"><div className="flex-1 text-center"><div className="flex items-center justify-center gap-1 mb-1"><Share2 size={12} className="text-[#ff9f43]" /><span className="text-sm text-[#7066A9]">ฝากเยี่ยม</span></div><span className="text-xl text-[#37286A]">{totalDelegated}</span></div><div className="w-px h-10 bg-gray-200" /><div className="flex-1 text-center"><div className="flex items-center justify-center gap-1 mb-1"><Handshake size={12} className="text-[#00cfe8]" /><span className="text-sm text-[#7066A9]">ลงเยี่ยมร่วม</span></div><span className="text-xl text-[#37286A]">{totalJoint}</span></div></div>
                <div className="space-y-1.5"><div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex"><div className="h-full bg-[#ff9f43] rounded-l-full transition-all" style={{ width: `${filteredVisits.length > 0 ? (totalDelegated / filteredVisits.length) * 100 : 0}%` }} /><div className="h-full bg-[#00cfe8] rounded-r-full transition-all" style={{ width: `${filteredVisits.length > 0 ? (totalJoint / filteredVisits.length) * 100 : 0}%` }} /></div><div className="flex items-center gap-3"><div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#ff9f43]" /><span className="text-xs text-[#7066A9]">ฝากเยี่ยม</span></div><div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00cfe8]" /><span className="text-xs text-[#7066A9]">ลงเยี่ยมร่วม</span></div></div></div>
                {visitTypeData.length > 0 && <div className="pt-2 border-t border-gray-100 space-y-2"><p className="text-xs text-[#7066A9]">แยกตามโรงพยาบาล</p>{visitTypeData.slice(0, 2).map((hosp) => { const hospShort = hosp.hospital.replace('โรงพยาบาล', 'รพ.').trim(); return <div key={hosp.hospital} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100"><div className="flex items-center justify-between mb-1"><span className="text-sm text-[#37286A] truncate">{hospShort}</span><span className="text-xs text-[#7066A9] shrink-0 ml-2">{hosp.total} เคส</span></div><div className="flex items-center gap-2"><span className="text-xs px-2 py-0.5 rounded-full bg-[#ff9f43]/15 text-[#ff9f43]">ฝากเยี่ยม {hosp.delegated}</span><span className="text-xs px-2 py-0.5 rounded-full bg-[#00cfe8]/15 text-[#00cfe8]">ร่วมเยี่ยม {hosp.joint}</span></div></div>; })}{visitTypeData.length > 2 && <div className="text-center text-xs text-[#7066A9] py-1">+{visitTypeData.length - 2} โรงพยาบาลเพิ่มเติม</div>}</div>}
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto"><button onClick={() => setShowVisitTypeDetail(true)} className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"><Eye size={16} /> ดูรายละเอียด</button></div>
            </Card>
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Users className={cn("w-5 h-5", ICON.text)} /> ทีมงาน/หน่วยบริการ</CardTitle><span className="text-xs text-white bg-[#7367f0] px-1.5 py-0.5 rounded-full">{teamsData.length} แห่ง</span></CardHeader>
              {teamsData.length > 0 ? <CardContent className="space-y-2.5 flex-1">{teamsData.slice(0, 2).map((team) => <div key={team.name} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100"><div className="flex items-center gap-2 mb-1.5"><div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", ICON.bg)}><Building2 size={13} className={ICON.text} /></div><span className="text-sm text-[#37286A] truncate flex-1">{team.name}</span></div><div className="flex items-center gap-2 flex-wrap"><span className="text-xs px-2 py-0.5 rounded-full bg-[#7367f0]/10 text-[#7367f0]">{team.visitCount} เคส</span><span className="text-xs px-2 py-0.5 rounded-full bg-[#00cfe8]/10 text-[#00cfe8]">{team.patientCount} ผู้ป่วย</span><span className="text-xs text-[#7066A9] ml-auto truncate">{team.parentHospital}</span></div></div>)}{teamsData.length > 2 && <div className="text-center text-xs text-[#7066A9] py-1">+{teamsData.length - 2} หน่วยเพิ่มเติม</div>}<div className="pt-2 mt-1 border-t border-gray-100 flex items-center justify-between px-1"><span className="text-xs text-[#7066A9]">เคสรวม</span><span className="text-sm text-[#7367f0]">{teamsData.reduce((s, t) => s + t.visitCount, 0)} เคส</span></div></CardContent> : <CardContent className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-6"><Users size={28} className="text-gray-300" /><p className="text-sm text-[#7066A9]">ไม่พบทีมงาน</p><p className="text-xs text-gray-400">สำหรับตัวกรองที่เลือก</p></CardContent>}
              <div className="px-4 pb-4 pt-1 mt-auto"><button onClick={() => setShowTeamDetail(true)} className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"><Eye size={16} /> ดูรายละเอียด</button></div>
            </Card>
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Users className={cn("w-5 h-5", ICON.text)} /> ผู้ป่วยที่อยู่ในการดูแล</CardTitle><span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full">{filteredPatients.length} ราย</span></CardHeader>
              <CardContent className="p-0 flex-1">
                {filteredPatients.length > 0 ? <><div className="divide-y divide-gray-50">{filteredPatients.slice(0, 4).map((p: any) => { const hasVisit = (p.visitHistory || []).some((v: any) => v.status === 'Pending' || v.status === 'WaitVisit'); const hospShort = (p.hospital || '').replace('โรงพยาบาล', 'รพ.').trim(); return <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => onViewPatient && onViewPatient(p)}><img src={p.image} alt={p.name} className="w-8 h-8 rounded-full object-cover border-2 border-gray-100 shrink-0" /><div className="flex-1 min-w-0"><span className="text-sm text-[#37286A] truncate block">{p.name}</span><div className="flex items-center gap-1.5 mt-0.5"><span className="text-xs text-[#7066A9]">{p.hn}</span><span className="text-xs text-gray-300">&bull;</span><span className="text-xs text-[#7066A9] truncate">{hospShort}</span></div></div>{hasVisit && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}</div>; })}</div>{filteredPatients.length > 4 && <div className="p-2.5 border-t border-gray-100 text-center"><button className="text-sm text-[#7367f0] hover:text-[#5B4FCC] transition-colors">ดูทั้งหมด ({filteredPatients.length} ราย) &rarr;</button></div>}</> : <div className="p-6 flex flex-col items-center justify-center gap-2 text-center"><Users size={28} className="text-gray-300" /><p className="text-sm text-[#7066A9]">ไม่พบข้อมูลผู้ป่วย</p><p className="text-xs text-gray-400">สำหรับตัวกรองที่เลือก</p></div>}
              </CardContent>
            </Card>
          </div>
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Calendar className={cn("w-5 h-5", ICON.text)} /> รายการล่าสุด</CardTitle><Button variant="ghost" size="sm" className="text-[#7367f0] text-sm" onClick={() => setViewMode('list')}>ดูทั้งหมด <ChevronRight size={16} /></Button></CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto hidden md:block"><Table><TableHeader><TableRow className="bg-gray-50/50"><TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873]">ประเภท</TableHead><TableHead className="text-xs text-[#5e5873]">หน่วยบริการ</TableHead><TableHead className="text-xs text-[#5e5873]">วันที่</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead><TableHead className="text-xs text-[#5e5873] w-[60px]" /></TableRow></TableHeader><TableBody>{filteredVisits.slice(0, 5).map((v: any) => { const sc = getStatusConfig(v.status); return <TableRow key={v.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedVisit(v)}><TableCell><div className="text-sm text-[#5e5873]">{v.patientName}</div><div className="text-xs text-gray-400">{v.patientId}</div></TableCell><TableCell><span className="text-sm text-[#7367f0]">{v.type === 'Delegated' ? 'ฝาก รพ.สต.' : 'ลงเยี่ยมร่วม'}</span></TableCell><TableCell className="text-sm text-gray-600">{v.rph}</TableCell><TableCell className="text-sm text-gray-500">{formatThaiShortDate(v.requestDate)}</TableCell><TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell></TableRow>; })}</TableBody></Table></div>
              <div className="md:hidden p-3 space-y-2">{filteredVisits.slice(0, 5).map((v: any) => { const sc = getStatusConfig(v.status); return <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedVisit(v)}><div className={cn("p-2 rounded-lg shrink-0", ICON.bg)}><Home className={cn("w-4 h-4", ICON.text)} /></div><div className="flex-1 min-w-0"><p className="text-sm text-[#5e5873] truncate">{v.patientName}</p><div className="flex items-center gap-2 mt-0.5"><span className="text-xs text-gray-400">{v.patientId}</span><span className="text-xs text-gray-300">&bull;</span><span className="text-xs text-gray-500">{formatThaiShortDate(v.requestDate)}</span></div></div><span className={cn("px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap shrink-0", sc.bg, sc.color)}>{sc.label}</span></div>; })}</div>
            </CardContent>
          </Card>
        </div>
      )}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1"><h3 className="text-sm text-gray-600">รายการคำขอเยี่ยมบ้าน</h3><span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filteredVisits.length} รายการ</span></div>
          <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden hidden md:block"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-[#EDE9FE]/30"><TableHead className="text-xs text-[#5e5873]">ผู้ป่วย / หน่วยงานต้นทาง</TableHead><TableHead className="text-xs text-[#5e5873]">ประเภท</TableHead><TableHead className="text-xs text-[#5e5873]">หน่วยบริการ</TableHead><TableHead className="text-xs text-[#5e5873]">วันที่ขอ</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead><TableHead className="text-xs text-[#5e5873] w-[80px]">ดำเนินการ</TableHead></TableRow></TableHeader><TableBody>{filteredVisits.map((v: any) => { const sc = getStatusConfig(v.status); return <TableRow key={v.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => setSelectedVisit(v)}><TableCell><div className="text-sm text-[#5e5873]">{v.patientName}</div><div className="text-xs text-gray-400">{v.patientId}</div></TableCell><TableCell><div className="flex items-center gap-1.5"><Home size={14} className={ICON.text} /><span className="text-sm text-[#5e5873]">{v.type === 'Delegated' ? 'ฝาก รพ.สต.' : 'ลงเยี่ยมร่วม'}</span></div></TableCell><TableCell className="text-sm text-gray-600">{v.rph}</TableCell><TableCell className="text-sm text-gray-500">{formatThaiShortDate(v.requestDate)}</TableCell><TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell></TableRow>; })}</TableBody></Table></div>{filteredVisits.length === 0 && <div className="text-center py-16 text-gray-400"><Home className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการคำขอเยี่ยมบ้าน</p></div>}</Card>
          <div className="md:hidden space-y-3">{filteredVisits.map((v: any) => { const sc = getStatusConfig(v.status); return <Card key={v.id} className="border-gray-100 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedVisit(v)}><div className="p-4 space-y-3"><div className="flex items-start justify-between"><div className="flex items-center gap-3 min-w-0"><div className={cn("p-2 rounded-lg shrink-0", ICON.bg)}><Home className={cn("w-4 h-4", ICON.text)} /></div><div className="min-w-0"><p className="text-sm text-[#5e5873] truncate">{v.patientName}</p><p className="text-xs text-gray-400">{v.patientId}</p></div></div><span className={cn("px-2.5 py-1 rounded-full text-xs whitespace-nowrap shrink-0", sc.bg, sc.color)}>{sc.label}</span></div><div className="flex items-center gap-4 text-xs text-gray-500"><div className="flex items-center gap-1"><Building2 size={12} className="text-[#7367f0]" /><span className="truncate max-w-[120px]">{v.rph}</span></div><div className="flex items-center gap-1"><Calendar size={12} className="text-gray-400" /><span>{formatThaiShortDate(v.requestDate)}</span></div></div><div className="flex items-center justify-between pt-2 border-t border-gray-50"><span className="text-xs text-[#7367f0]">{v.type === 'Delegated' ? 'ฝาก รพ.สต.' : 'ลงเยี่ยมร่วม'}</span><ChevronRight size={16} className="text-gray-300" /></div></div></Card>; })}{filteredVisits.length === 0 && <div className="text-center py-16 text-gray-400"><Home className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการคำขอเยี่ยมบ้าน</p></div>}</div>
        </div>
      )}
    </div>
  );
}
