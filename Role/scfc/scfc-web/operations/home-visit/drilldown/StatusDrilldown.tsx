import React, { useMemo } from 'react';
import {
  ArrowLeft, Home, CheckCircle2, Clock, XCircle, Eye,
  Share2, Handshake, Building2, ChevronRight,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PURPLE, SYSTEM_ICON_COLORS } from '../../../../../../data/themeConfig';
import { FlatVisit, STATUS_CONFIG, getStatusConfig } from './shared';

const ICON = SYSTEM_ICON_COLORS.homeVisit;

interface Props {
  visits: FlatVisit[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectVisit: (v: FlatVisit) => void;
}

export function StatusDrilldown({ visits, filter, label, onBack, onSelectVisit }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return visits;
    const cfg = STATUS_CONFIG[filter];
    if (!cfg) return visits;
    return visits.filter(v => getStatusConfig(v.status) === cfg);
  }, [visits, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.Completed).length,
    pending: filtered.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.Pending).length,
    inProgress: filtered.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.InProgress || getStatusConfig(v.status) === STATUS_CONFIG.WaitVisit).length,
    rejected: filtered.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.Rejected).length,
    delegated: filtered.filter(v => (v.type || '').toLowerCase() === 'delegated').length,
    joint: filtered.filter(v => (v.type || '').toLowerCase() !== 'delegated').length,
  }), [filtered]);

  const pieData = [
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'รอการตอบรับ', value: stats.pending, color: '#ff9f43' },
    { name: 'รอเยี่ยม/ดำเนินการ', value: stats.inProgress, color: '#00cfe8' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const hospData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(v => {
      const h = (v.hospital || 'อื่นๆ').replace('โรงพยาบาล', 'รพ.').trim();
      map.set(h, (map.get(h) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name: name.length > 12 ? name.slice(0, 12) + '..' : name, fullName: name, value,
    })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered]);

  const filterColor = STATUS_CONFIG[filter]?.hex || PURPLE.primary;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${filterColor}15` }}>
          <Home className="w-6 h-6" style={{ color: filterColor }} />
        </div>
        <div className="flex-1">
          <h1 className="text-[#5e5873] text-xl">{label}</h1>
          <p className="text-xs text-gray-500">{filter === 'all' ? 'ภาพรวมการเยี่ยมบ้านทั้งหมด' : `กรองตามสถานะ "${STATUS_CONFIG[filter]?.label}"`}</p>
        </div>
        <span className="text-xs text-white px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: filterColor }}>{filtered.length} รายการ</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'ทั้งหมด', value: stats.total, icon: Home, ic: ICON.text, ib: ICON.bg },
          { label: 'เสร็จสิ้น', value: stats.completed, icon: CheckCircle2, ic: 'text-[#28c76f]', ib: 'bg-[#28c76f]/10' },
          { label: 'รอดำเนินการ', value: stats.pending + stats.inProgress, icon: Clock, ic: 'text-[#ff9f43]', ib: 'bg-[#ff9f43]/10' },
          { label: 'ฝากเยี่ยม', value: stats.delegated, icon: Share2, ic: 'text-[#ff9f43]', ib: 'bg-[#ff9f43]/10' },
          { label: 'เยี่ยมร่วม', value: stats.joint, icon: Handshake, ic: 'text-[#00cfe8]', ib: 'bg-[#00cfe8]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl", s.ib)}><s.icon className={cn("w-4 h-4", s.ic)} /></div>
              <div><p className="text-xs text-gray-500">{s.label}</p><p className="text-xl text-[#5e5873]">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><PieChartIcon className={cn("w-5 h-5", ICON.text)} /> สัดส่วนสถานะ</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-[200px] relative" style={{ minHeight: 200 }}>
                <ResponsiveContainer width="100%" height={200} debounce={50}>
                  <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={5} dataKey="value" stroke="none">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} /></PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl text-[#5e5873]">{stats.total}</span><span className="text-[10px] text-gray-400">รายการ</span>
                </div>
              </div>
              <div className="space-y-2.5">{pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-sm text-gray-600">{item.name}</span></div>
                  <span className="text-sm text-[#5e5873]">{item.value}</span>
                </div>
              ))}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Building2 className={cn("w-5 h-5", ICON.text)} /> แยกตามโรงพยาบาล</CardTitle></CardHeader>
          <CardContent>
            {hospData.length > 0 ? (
              <div style={{ minHeight: 220 }}>
                <ResponsiveContainer width="100%" height={220} debounce={50}>
                  <BarChart data={hospData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} /><YAxis tick={{ fontSize: 11, fill: '#888' }} allowDecimals={false} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #eee', fontSize: '12px' }} formatter={(val: any, _: any, p: any) => [`${val} รายการ`, p.payload.fullName]} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28} fill={filterColor} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-gray-400 text-center py-8">ไม่มีข้อมูล</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Home className={cn("w-5 h-5", ICON.text)} /> รายการเยี่ยมบ้าน</CardTitle>
          <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length} รายการ</span>
        </CardHeader>
        <CardContent className="p-0"><div className="overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-[#EDE9FE]/30">
            <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead>
            <TableHead className="text-xs text-[#5e5873]">ประเภท</TableHead>
            <TableHead className="text-xs text-[#5e5873]">หน่วยบริการ</TableHead>
            <TableHead className="text-xs text-[#5e5873]">วันที่</TableHead>
            <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
            <TableHead className="text-xs w-[60px]"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.slice(0, 20).map((v) => {
              const sc = getStatusConfig(v.status);
              return (
                <TableRow key={v.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectVisit(v)}>
                  <TableCell><div className="text-sm text-[#5e5873]">{v.patientName}</div><div className="text-xs text-gray-400">{v.patientId}</div></TableCell>
                  <TableCell><span className="text-sm text-[#7367f0]">{v.type === 'Delegated' ? 'ฝาก รพ.สต.' : 'ลงเยี่ยมร่วม'}</span></TableCell>
                  <TableCell className="text-sm text-gray-600">{v.rph}</TableCell>
                  <TableCell className="text-sm text-gray-500">{v.requestDate}</TableCell>
                  <TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table></div>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><Home className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการ</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
