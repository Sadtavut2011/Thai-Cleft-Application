import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, Search, Clock, MapPin, 
  CheckCircle2, Filter, 
  LayoutDashboard, List, ChevronRight, ArrowLeft,
  AlertCircle, TrendingUp, Eye, Stethoscope, Users, ClipboardList,
  XCircle, PieChart as PieChartIcon, Building2, Activity,
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PATIENTS_DATA } from "../../../../../data/patientData";
import { PURPLE, SYSTEM_ICON_COLORS, PROVINCES, HOSPITALS } from "../../../../../data/themeConfig";
import { AppointmentDetail } from "./AppointmentDetail";
import { FlatAppointment, STATUS_CONFIG, getStatusConfig, TREATMENT_MAP, DrilldownView } from "./drilldown/shared";
import { StatusDrilldown } from "./drilldown/StatusDrilldown";
import { HospitalDrilldown } from "./drilldown/HospitalDrilldown";
import { PeakHoursDrilldown } from "./drilldown/PeakHoursDrilldown";
import { TreatmentDrilldown } from "./drilldown/TreatmentDrilldown";

const ICON = SYSTEM_ICON_COLORS.appointment;

export function AppointmentSystem({ onBack }: { onBack?: () => void }) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('ทั้งหมด');
  const [hospitalFilter, setHospitalFilter] = useState('ทั้งหมด');
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [drilldownView, setDrilldownView] = useState<DrilldownView>(null);

  const appointments = useMemo(() => {
    const list: FlatAppointment[] = [];
    PATIENTS_DATA.forEach((p) => {
      (p.appointmentHistory || []).forEach((a: any, idx: number) => {
        list.push({ id: `APT-${p.hn}-${idx}`, patientName: p.name, hn: p.hn, image: p.image || '', hospital: p.hospital || a.location || '-', province: p.province || 'เชียงใหม่', clinic: a.title || '-', date: a.date || '-', rawDate: a.rawDate || '', time: a.time || '-', type: a.title || '-', status: a.status || 'waiting', doctor: a.doctor || '-', room: a.room || '-', note: a.note || '-', requestDate: a.requestDate || '-' });
      });
    });
    return list;
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term || a.patientName.toLowerCase().includes(term) || a.hn.toLowerCase().includes(term) || a.hospital.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchProvince = provinceFilter === 'ทั้งหมด' || a.province === provinceFilter;
      const matchHospital = hospitalFilter === 'ทั้งหมด' || a.hospital.includes(hospitalFilter.replace('ทั้งหมด', ''));
      return matchSearch && matchStatus && matchProvince && matchHospital;
    });
  }, [appointments, searchTerm, statusFilter, provinceFilter, hospitalFilter]);

  const stats = useMemo(() => ({ total: filteredAppointments.length, pending: filteredAppointments.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.waiting).length, confirmed: filteredAppointments.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.confirmed).length, completed: filteredAppointments.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.completed).length, cancelled: filteredAppointments.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.cancelled).length }), [filteredAppointments]);

  const pieData = useMemo(() => [
    { name: 'รอตรวจ', value: stats.pending, color: '#f59e0b' },
    { name: 'ยืนยันแล้ว', value: stats.confirmed, color: '#49358E' },
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'ยกเลิก', value: stats.cancelled, color: '#ef4444' },
  ], [stats]);

  const peakHoursData = useMemo(() => {
    const hourSlots = Array.from({ length: 12 }, (_, i) => ({ hour: `${String(i + 7).padStart(2, '0')}:00`, count: 0 }));
    filteredAppointments.forEach((a) => { const t = (a.time || '').trim(); const hourMatch = t.match(/^(\d{1,2})/); if (hourMatch) { const h = parseInt(hourMatch[1], 10); if (h >= 7 && h <= 18) hourSlots[h - 7].count++; } });
    if (hourSlots.every(s => s.count === 0)) { const mock = [3, 8, 12, 10, 6, 4, 5, 7, 9, 5, 3, 2]; hourSlots.forEach((s, i) => { s.count = mock[i]; }); }
    return hourSlots;
  }, [filteredAppointments]);

  const peakHour = useMemo(() => peakHoursData.reduce((max, h) => h.count > max.count ? h : max, peakHoursData[0]), [peakHoursData]);

  const treatmentPlanData = useMemo(() => {
    const filteredPatients = PATIENTS_DATA.filter((p: any) => { const matchesProvince = provinceFilter === 'ทั้งหมด' || p.province === provinceFilter; const matchesHospital = hospitalFilter === 'ทั้งหมด' || (p.hospital || '').includes(hospitalFilter.replace('ทั้งหมด', '')); return matchesProvince && matchesHospital; });
    const map = new Map<string, { name: string; total: number; completed: number; upcoming: number; overdue: number }>();
    filteredPatients.forEach((p: any) => { (p.timeline || []).forEach((t: any) => { const stage = t.stage || 'ไม่ระบุ'; const existing = map.get(stage); const st = (t.status || '').toLowerCase(); const isCompleted = st === 'completed'; const isOverdue = st.includes('overdue') || st.includes('delayed'); const isUpcoming = st === 'upcoming'; if (existing) { existing.total += 1; if (isCompleted) existing.completed += 1; if (isUpcoming) existing.upcoming += 1; if (isOverdue) existing.overdue += 1; } else { map.set(stage, { name: stage, total: 1, completed: isCompleted ? 1 : 0, upcoming: isUpcoming ? 1 : 0, overdue: isOverdue ? 1 : 0 }); } }); });
    const PLAN_COLORS = ['#49358E', '#7066A9', '#28c76f', '#f59e0b', '#ea5455', '#00cfe8', '#9b59b6', '#e67e22'];
    return Array.from(map.values()).sort((a, b) => b.total - a.total).map((item, i) => ({ ...item, color: PLAN_COLORS[i % PLAN_COLORS.length] }));
  }, [provinceFilter, hospitalFilter]);

  const handleSelectAppointment = (a: FlatAppointment) => { setSelectedAppointment(a); };

  if (drilldownView) {
    if (drilldownView.type === 'status') { return <StatusDrilldown appointments={appointments} filter={drilldownView.filter} label={drilldownView.label} onBack={() => setDrilldownView(null)} onSelectAppointment={handleSelectAppointment} />; }
    if (drilldownView.type === 'hospital') { return <HospitalDrilldown appointments={appointments} hospital={drilldownView.hospital} fullName={drilldownView.fullName} onBack={() => setDrilldownView(null)} onSelectAppointment={handleSelectAppointment} />; }
    if (drilldownView.type === 'peakHours') { return <PeakHoursDrilldown appointments={appointments} onBack={() => setDrilldownView(null)} onSelectAppointment={handleSelectAppointment} />; }
    if (drilldownView.type === 'treatment') { return <TreatmentDrilldown appointments={appointments} treatmentName={drilldownView.name} treatmentColor={drilldownView.color} onBack={() => setDrilldownView(null)} onSelectAppointment={handleSelectAppointment} />; }
  }

  if (selectedAppointment) {
    return <AppointmentDetail appointment={{ id: selectedAppointment.id, patientName: selectedAppointment.patientName, hn: selectedAppointment.hn, hospital: selectedAppointment.hospital, province: selectedAppointment.province, clinic: selectedAppointment.clinic, date: selectedAppointment.rawDate || selectedAppointment.date, time: selectedAppointment.time, type: selectedAppointment.type, status: selectedAppointment.status === 'confirmed' ? 'Confirmed' : selectedAppointment.status === 'cancelled' ? 'Missed' : 'Pending', isOverdue: false, hasConflict: false, needsIntervention: false, riskLevel: 'ต่ำ' }} onBack={() => setSelectedAppointment(null)} />;
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>}
          <div className={cn("p-2.5 rounded-xl", ICON.bg)}><CalendarIcon className={cn("w-6 h-6", ICON.text)} /></div>
          <div><h1 className="text-[#5e5873] text-xl">ระบบนัดหมาย</h1><p className="text-xs text-gray-500">ติดตามและจัดการนัดหมายทั่วเครือข่าย</p></div>
        </div>
        <div className="flex items-center gap-3"><div className="bg-gray-100 p-1 rounded-lg flex"><button onClick={() => setViewMode('dashboard')} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all", viewMode === 'dashboard' ? "bg-white text-[#7367f0] shadow-sm" : "text-gray-500 hover:text-gray-700")}><LayoutDashboard size={16} /> แดชบอร์ด</button><button onClick={() => setViewMode('list')} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all", viewMode === 'list' ? "bg-white text-[#7367f0] shadow-sm" : "text-gray-500 hover:text-gray-700")}><List size={16} /> รายการ</button></div></div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder="ค้นหาผู้ป่วย, HN, โรงพยาบาล..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-lg" /></div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={provinceFilter} onValueChange={setProvinceFilter}><SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm"><div className="flex items-center gap-2"><MapPin size={14} className="text-[#7367f0]" /><SelectValue /></div></SelectTrigger><SelectContent>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
          <Select value={hospitalFilter} onValueChange={setHospitalFilter}><SelectTrigger className="w-[180px] h-11 border-gray-200 rounded-lg text-sm"><div className="flex items-center gap-2"><Building2 size={14} className="text-[#7367f0]" /><SelectValue /></div></SelectTrigger><SelectContent>{HOSPITALS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent></Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[160px] h-11 border-gray-200 rounded-lg text-sm"><div className="flex items-center gap-2"><Filter size={14} className="text-[#7367f0]" /><SelectValue placeholder="ทุกสถานะ" /></div></SelectTrigger><SelectContent><SelectItem value="all">ทุกสถานะ</SelectItem><SelectItem value="confirmed">ยืนยันแล้ว</SelectItem><SelectItem value="waiting">รอการยืนยัน</SelectItem><SelectItem value="completed">เสร็จสิ้น</SelectItem><SelectItem value="cancelled">ขาดนัด/ยกเลิก</SelectItem></SelectContent></Select>
        </div>
      </div>
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[{ label: 'ทั้งหมด', value: stats.total, icon: CalendarIcon, iconColor: ICON.text, iconBg: ICON.bg, borderColor: 'border-gray-100', fk: 'all' },{ label: 'รอตรวจ', value: stats.pending, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', borderColor: 'border-amber-100', fk: 'waiting' },{ label: 'ยืนยันแล้ว', value: stats.confirmed, icon: CheckCircle2, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', borderColor: 'border-[#E3E0F0]', fk: 'confirmed' },{ label: 'เสร็จสิ้น', value: stats.completed, icon: TrendingUp, iconColor: 'text-green-600', iconBg: 'bg-green-50', borderColor: 'border-green-100', fk: 'completed' },{ label: 'ยกเลิก', value: stats.cancelled, icon: XCircle, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', borderColor: 'border-rose-100', fk: 'cancelled' }].map((stat, i) => (
              <Card key={i} className={cn("shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer group", stat.borderColor)} onClick={() => setDrilldownView({ type: 'status', filter: stat.fk, label: stat.label })}>
                <CardContent className="p-4 flex items-center gap-3"><div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", stat.iconBg)}><stat.icon size={20} className={stat.iconColor} /></div><div><span className="text-2xl text-[#37286A]">{stat.value}</span><p className="text-sm text-[#7066A9]">{stat.label}</p></div></CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><PieChartIcon className={cn("w-5 h-5", ICON.text)} /> สถิติสถานะ</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-[220px] relative flex items-center justify-center" style={{ minHeight: 220 }}><ResponsiveContainer width="100%" height={220} minWidth={0} debounce={50}><PieChart><Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">{pieData.filter(d => d.value > 0).map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} /></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-3xl text-[#37286A]">{stats.total}</span><span className="text-xs text-[#7066A9]">ทั้งหมด</span></div></div>
                <div className="space-y-2.5">{pieData.map((item) => <div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} /><span className="text-sm text-[#5e5873]">{item.name}</span></div><div className="flex items-center gap-1"><span className="text-sm text-[#37286A]">{item.value}</span><span className="text-xs text-[#7066A9]">({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)</span></div></div>)}</div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2"><div className="flex items-center justify-between w-full"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Clock className={cn("w-5 h-5", ICON.text)} /> ช่วงเวลาหนาแน่น</CardTitle>{peakHour && <span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full shrink-0">Peak: {peakHour.hour}</span>}</div></CardHeader>
              <CardContent className="flex-1 flex flex-col"><div className="flex-1" style={{ minHeight: 200 }}><ResponsiveContainer width="100%" height={200} debounce={50}><AreaChart data={peakHoursData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}><defs><linearGradient id="peakGradAppt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#49358E" stopOpacity={0.3} /><stop offset="95%" stopColor="#49358E" stopOpacity={0.03} /></linearGradient></defs><XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#7066A9' }} interval={2} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: '#7066A9' }} allowDecimals={false} axisLine={false} tickLine={false} /><RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '12px' }} formatter={(val: any) => [`${val} นัดหมาย`, 'จำนวน']} /><Area type="monotone" dataKey="count" stroke="#49358E" fill="url(#peakGradAppt)" strokeWidth={2} dot={{ fill: '#49358E', r: 2.5, strokeWidth: 0 }} /></AreaChart></ResponsiveContainer></div>{peakHour && peakHour.count > 0 && <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-[#F4F0FF] border border-[#E3E0F0]"><AlertCircle size={14} className="text-[#49358E] shrink-0" /><span className="text-xs text-[#37286A]">หนาแน่นที่สุด: <span className="text-[#49358E]">{peakHour.hour} น.</span> ({peakHour.count} นัดหมาย)</span></div>}</CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto"><button onClick={() => setDrilldownView({ type: 'peakHours' })} className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"><Eye size={16} /> ดูรายละเอียด</button></div>
            </Card>
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><ClipboardList className={cn("w-5 h-5", ICON.text)} /> ตามแผนการรักษา</CardTitle><span className="text-xs text-white bg-[#7367f0] px-1.5 py-0.5 rounded-full">{treatmentPlanData.length} แผน</span></CardHeader>
              {treatmentPlanData.length > 0 ? <CardContent className="space-y-2.5 flex-1">{treatmentPlanData.slice(0, 2).map((plan) => { const totalAll = treatmentPlanData.reduce((s, p) => s + p.total, 0); const pct = totalAll > 0 ? Math.round((plan.total / totalAll) * 100) : 0; return <div key={plan.name} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100"><div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-2 min-w-0"><div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: plan.color }} /><span className="text-sm text-[#37286A] truncate">{plan.name}</span></div><span className="text-xs text-[#7066A9] shrink-0 ml-2">{plan.total} รายการ</span></div><div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: plan.color }} /></div><div className="flex justify-between text-xs"><div className="flex items-center gap-2"><span className="text-[#28c76f]">เสร็จ {plan.completed}</span><span className="text-[#f59e0b]">รอ {plan.upcoming}</span>{plan.overdue > 0 && <span className="text-[#ea5455]">ล่าช้า {plan.overdue}</span>}</div><span className="text-[#7066A9]">{pct}%</span></div></div>; })}{treatmentPlanData.length > 2 && <div className="text-center text-xs text-[#7066A9] py-1">+{treatmentPlanData.length - 2} แผนเพิ่มเติม</div>}<div className="pt-2 mt-1 border-t border-gray-100 flex items-center justify-between px-1"><span className="text-xs text-[#7066A9]">รวมทั้งหมด</span><span className="text-sm text-[#7367f0]">{treatmentPlanData.reduce((s, p) => s + p.total, 0)} รายการ</span></div></CardContent> : <CardContent className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-6"><ClipboardList size={28} className="text-gray-300" /><p className="text-sm text-[#7066A9]">ไม่พบข้อมูลแผนการรักษา</p><p className="text-xs text-gray-400">สำหรับตัวกรองที่เลือก</p></CardContent>}
              <div className="px-4 pb-4 pt-1 mt-auto"><button onClick={() => { if (treatmentPlanData[0]) setDrilldownView({ type: 'treatment', name: treatmentPlanData[0].name, color: treatmentPlanData[0].color }); }} className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"><Eye size={16} /> ดูรายละเอียด</button></div>
            </Card>
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Users className={cn("w-5 h-5", ICON.text)} /> ผู้ป่วยที่อยู่ในการดูแล</CardTitle><span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full">{PATIENTS_DATA.length} ราย</span></CardHeader>
              <CardContent className="p-0 flex-1"><div className="divide-y divide-gray-50">{PATIENTS_DATA.slice(0, 4).map((p: any) => { const hasPending = (p.appointmentHistory || []).some((a: any) => a.status === 'waiting' || a.status === 'confirmed'); const hospShort = (p.hospital || '').replace('โรงพยาบาล', 'รพ.').trim(); return <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition-colors cursor-pointer"><img src={p.image} alt={p.name} className="w-8 h-8 rounded-full object-cover border-2 border-gray-100 shrink-0" /><div className="flex-1 min-w-0"><span className="text-sm text-[#37286A] truncate block">{p.name}</span><div className="flex items-center gap-1.5 mt-0.5"><span className="text-xs text-[#7066A9]">{p.hn}</span><span className="text-xs text-gray-300">&bull;</span><span className="text-xs text-[#7066A9] truncate">{hospShort}</span></div></div>{hasPending && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}</div>; })}</div>{PATIENTS_DATA.length > 4 && <div className="p-2.5 border-t border-gray-100 text-center"><button className="text-sm text-[#7367f0] hover:text-[#5B4FCC] transition-colors">ดูทั้งหมด ({PATIENTS_DATA.length} ราย) &rarr;</button></div>}</CardContent>
            </Card>
          </div>
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><CalendarIcon className={cn("w-5 h-5", ICON.text)} /> รายการนัดหมายล่าสุด</CardTitle><Button variant="ghost" size="sm" className="text-[#7367f0] text-sm" onClick={() => setViewMode('list')}>ดูทั้งหมด <ChevronRight size={16} /></Button></CardHeader>
            <CardContent className="p-0"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-gray-50/50"><TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873]">คลินิก/รายการ</TableHead><TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead><TableHead className="text-xs text-[#5e5873]">วันที่/เวลา</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead><TableHead className="text-xs w-[60px]" /></TableRow></TableHeader><TableBody>{filteredAppointments.slice(0, 5).map((a) => { const sc = getStatusConfig(a.status); return <TableRow key={a.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedAppointment(a)}><TableCell><div className="text-sm text-[#5e5873]">{a.patientName}</div><div className="text-xs text-gray-400">{a.hn}</div></TableCell><TableCell><div className="flex items-center gap-1.5"><Stethoscope size={14} className={ICON.text} /><span className="text-sm text-[#5e5873]">{a.clinic}</span></div></TableCell><TableCell className="text-sm text-gray-600">{a.hospital}</TableCell><TableCell><div className="text-sm text-gray-600">{a.date}</div><div className="text-xs text-gray-400">{a.time}</div></TableCell><TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell></TableRow>; })}</TableBody></Table></div></CardContent>
          </Card>
        </div>
      )}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1"><h3 className="text-sm text-gray-600">รายการนัดหมาย</h3><span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filteredAppointments.length} รายการ</span></div>
          <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-[#EDE9FE]/30"><TableHead className="text-xs text-[#5e5873]">ผู้ป่วย / หน่วยงานต้นทาง</TableHead><TableHead className="text-xs text-[#5e5873]">คลินิก/รายการ</TableHead><TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead><TableHead className="text-xs text-[#5e5873]">วันที่/เวลา</TableHead><TableHead className="text-xs text-[#5e5873]">แพทย์</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead><TableHead className="text-xs text-[#5e5873] w-[80px]">ดำเนินการ</TableHead></TableRow></TableHeader><TableBody>{filteredAppointments.map((a) => { const sc = getStatusConfig(a.status); return <TableRow key={a.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => setSelectedAppointment(a)}><TableCell><div className="text-sm text-[#5e5873]">{a.patientName}</div><div className="text-xs text-gray-400">HN: {a.hn}</div></TableCell><TableCell><div className="flex items-center gap-1.5"><Stethoscope size={14} className={ICON.text} /><span className="text-sm text-[#5e5873]">{a.clinic}</span></div></TableCell><TableCell className="text-sm text-gray-600">{a.hospital}</TableCell><TableCell><div className="text-sm text-gray-600">{a.date}</div><div className="text-xs text-gray-400">{a.time}</div></TableCell><TableCell className="text-sm text-gray-600">{a.doctor}</TableCell><TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell></TableRow>; })}</TableBody></Table></div>{filteredAppointments.length === 0 && <div className="text-center py-16 text-gray-400"><CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการนัดหมาย</p></div>}</Card>
        </div>
      )}
    </div>
  );
}
