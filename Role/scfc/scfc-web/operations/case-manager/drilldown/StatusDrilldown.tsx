import React, { useMemo } from 'react';
import { ArrowLeft, Users, UserCheck, Building2, Eye, MapPin, Baby, Home, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { CASE_MANAGER_DATA, CaseManager } from '../../../../../../data/patientData';
import { PURPLE } from '../../../../../../data/themeConfig';
import { getStatusLabel, getStatusStyle } from './shared';

interface Props {
  filter: string;
  label: string;
  onBack: () => void;
  onSelectCM: (cm: CaseManager) => void;
}

export function StatusDrilldown({ filter, label, onBack, onSelectCM }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return CASE_MANAGER_DATA;
    return CASE_MANAGER_DATA.filter(cm => cm.status === filter);
  }, [filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    active: filtered.filter(c => c.status === 'active').length,
    leave: filtered.filter(c => c.status === 'leave').length,
    totalPatients: filtered.reduce((s, c) => s + c.patientCount, 0),
    totalHospitals: new Set(filtered.flatMap(c => c.hospitals.map(h => h.id))).size,
  }), [filtered]);

  const pieData = [
    { name: 'ปฏิบัติงาน', value: stats.active, color: '#28c76f' },
    { name: 'ลาพัก', value: stats.leave, color: '#ff9f43' },
    { name: 'ไม่ใช้งาน', value: filtered.filter(c => c.status === 'inactive').length, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const provData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(cm => map.set(cm.province, (map.get(cm.province) || 0) + cm.patientCount));
    return Array.from(map.entries()).map(([name, patients]) => ({ name, patients })).sort((a, b) => b.patients - a.patients);
  }, [filtered]);

  const headerColor = filter === 'active' ? '#28c76f' : filter === 'leave' ? '#ff9f43' : filter === 'inactive' ? '#ea5455' : PURPLE.primary;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${headerColor}15` }}><Users className="w-6 h-6" style={{ color: headerColor }} /></div>
        <div className="flex-1"><h1 className="text-[#5e5873] text-xl">{label}</h1><p className="text-xs text-gray-500">รายละเอียด Case Manager</p></div>
        <span className="text-xs text-white px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: headerColor }}>{filtered.length} คน</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'CM ทั้งหมด', value: `${stats.total} คน`, icon: Users, ic: 'text-[#7367f0]', ib: 'bg-[#7367f0]/10' },
          { label: 'ปฏิบัติงาน', value: `${stats.active} คน`, icon: UserCheck, ic: 'text-[#28c76f]', ib: 'bg-[#28c76f]/10' },
          { label: 'ผู้ป่วยในระบบ', value: `${stats.totalPatients} คน`, icon: Baby, ic: 'text-[#4285f4]', ib: 'bg-[#4285f4]/10' },
          { label: 'โรงพยาบาล', value: `${stats.totalHospitals} แห่ง`, icon: Building2, ic: 'text-[#ff6d00]', ib: 'bg-[#ff6d00]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl"><CardContent className="p-4 flex items-center gap-3"><div className={cn("p-2.5 rounded-xl", s.ib)}><s.icon className={cn("w-4 h-4", s.ic)} /></div><div><p className="text-xs text-gray-500">{s.label}</p><p className={cn("text-xl", s.ic)}>{s.value}</p></div></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-[#7367f0]" /> สถานะ CM</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-[180px] relative" style={{ minHeight: 180 }}>
                <ResponsiveContainer width="100%" height={180} debounce={50}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} /></PieChart></ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-2xl text-[#5e5873]">{stats.total}</span><span className="text-[10px] text-gray-400">คน</span></div>
              </div>
              <div className="space-y-2.5">{pieData.map(item => (<div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-sm text-gray-600">{item.name}</span></div><span className="text-sm text-[#5e5873]">{item.value} คน</span></div>))}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><MapPin className="w-5 h-5 text-[#7367f0]" /> ผู้ป่วยต่อจังหวัด</CardTitle></CardHeader>
          <CardContent><div className="space-y-2.5">
            {provData.map(p => {
              const maxV = provData[0]?.patients || 1;
              const pct = Math.round((p.patients / maxV) * 100);
              return (<div key={p.name} className="space-y-1"><div className="flex items-center justify-between"><span className="text-sm text-[#5e5873]">จ.{p.name}</span><span className="text-sm text-[#7367f0]">{p.patients} คน</span></div><div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#7367f0]" style={{ width: `${pct}%` }}></div></div></div>);
            })}
          </div></CardContent>
        </Card>
      </div>

      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Users className="w-5 h-5 text-[#7367f0]" /> รายชื่อ Case Manager</CardTitle><span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length} คน</span></CardHeader>
        <CardContent className="p-0"><div className="overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-[#EDE9FE]/30">
            <TableHead className="text-xs text-[#5e5873]">ชื่อ / รหัส</TableHead><TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead><TableHead className="text-xs text-[#5e5873] text-center">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873] text-center">เยี่ยมบ้าน</TableHead><TableHead className="text-xs text-[#5e5873] text-center">สถานะ</TableHead><TableHead className="text-xs w-[60px]"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.slice(0, 20).map(cm => {
              const ss = getStatusStyle(cm.status);
              return (<TableRow key={cm.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectCM(cm)}>
                <TableCell><div className="flex items-center gap-3"><img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 border border-white shadow-sm shrink-0" /><div><div className="text-sm text-[#5e5873]">{cm.name}</div><div className="text-xs text-gray-400">{cm.id} - จ.{cm.province}</div></div></div></TableCell>
                <TableCell><div className="flex flex-wrap gap-1 max-w-[200px]">{cm.hospitals.slice(0, 2).map(h => (<span key={h.id} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-100"><Building2 size={10} className="text-[#7367f0]" />{h.name.replace('รพ.', '')}</span>))}{cm.hospitals.length > 2 && <span className="text-xs text-[#7367f0]">+{cm.hospitals.length - 2}</span>}</div></TableCell>
                <TableCell className="text-center"><span className={cn("text-sm", cm.patientCount > 40 ? "text-[#EA5455]" : "text-[#5e5873]")}>{cm.patientCount}</span></TableCell>
                <TableCell className="text-center"><span className="text-sm text-[#28c76f]">{cm.activeVisits}</span><span className="text-xs text-gray-400"> / {cm.completedVisits}</span></TableCell>
                <TableCell className="text-center"><span className={cn("px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1.5", ss.bg, ss.color)}><span className={cn("w-1.5 h-1.5 rounded-full", ss.dot)}></span>{getStatusLabel(cm.status)}</span></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table></div>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><Users className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบ Case Manager</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
