import React, { useMemo } from 'react';
import { ArrowLeft, Video, CheckCircle2, Clock, XCircle, Eye, Building2, Smartphone, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PURPLE, SYSTEM_ICON_COLORS } from '../../../../../../data/themeConfig';
import { FlatSession, STATUS_CONFIG, getStatusConfig } from './shared';

const ICON = SYSTEM_ICON_COLORS.telemed;

interface Props {
  sessions: FlatSession[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectSession: (s: FlatSession) => void;
}

export function StatusDrilldown({ sessions, filter, label, onBack, onSelectSession }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return sessions;
    const cfg = STATUS_CONFIG[filter];
    return cfg ? sessions.filter(t => getStatusConfig(t.status) === cfg) : sessions;
  }, [sessions, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter(t => getStatusConfig(t.status) === STATUS_CONFIG.completed).length,
    waiting: filtered.filter(t => getStatusConfig(t.status) === STATUS_CONFIG.waiting).length,
    cancelled: filtered.filter(t => getStatusConfig(t.status) === STATUS_CONFIG.cancelled).length,
  }), [filtered]);

  const pieData = [
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'รอสาย', value: stats.waiting, color: '#ff9f43' },
    { name: 'ยกเลิก', value: stats.cancelled, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const hospData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(t => { const h = (t.hospital || t.sourceUnit || 'ไม่ระบุ').replace('โรงพยาบาล', 'รพ.'); map.set(h, (map.get(h) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + '..' : name, fullName: name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [filtered]);

  const channelData = useMemo(() => {
    const map = new Map<string, number>();
    const labels: Record<string, string> = { mobile: 'Mobile App', agency: 'ผ่าน รพ.สต.', hospital: 'ผ่านโรงพยาบาล' };
    filtered.forEach(t => { const ch = t.channel || 'mobile'; map.set(ch, (map.get(ch) || 0) + 1); });
    return Array.from(map.entries()).map(([ch, value]) => ({ name: labels[ch] || ch, value }));
  }, [filtered]);

  const filterColor = STATUS_CONFIG[filter]?.hex || PURPLE.primary;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${filterColor}15` }}><Video className="w-6 h-6" style={{ color: filterColor }} /></div>
        <div className="flex-1"><h1 className="text-[#5e5873] text-xl">{label}</h1><p className="text-xs text-gray-500">รายละเอียด Tele-med</p></div>
        <span className="text-xs text-white px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: filterColor }}>{filtered.length} รายการ</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ทั้งหมด', value: stats.total, icon: Video, ic: ICON.text, ib: ICON.bg },
          { label: 'เสร็จสิ้น', value: stats.completed, icon: CheckCircle2, ic: 'text-[#28c76f]', ib: 'bg-[#28c76f]/10' },
          { label: 'รอสาย', value: stats.waiting, icon: Clock, ic: 'text-[#ff9f43]', ib: 'bg-[#ff9f43]/10' },
          { label: 'ยกเลิก', value: stats.cancelled, icon: XCircle, ic: 'text-[#EA5455]', ib: 'bg-[#EA5455]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl"><CardContent className="p-4 flex items-center gap-3"><div className={cn("p-2.5 rounded-xl", s.ib)}><s.icon className={cn("w-4 h-4", s.ic)} /></div><div><p className="text-xs text-gray-500">{s.label}</p><p className="text-xl text-[#5e5873]">{s.value}</p></div></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><PieChartIcon className={cn("w-5 h-5", ICON.text)} /> สัดส่วนสถานะ</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-[200px] relative" style={{ minHeight: 200 }}>
                <ResponsiveContainer width="100%" height={200} debounce={50}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={5} dataKey="value" stroke="none">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} /></PieChart></ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-2xl text-[#5e5873]">{stats.total}</span><span className="text-[10px] text-gray-400">รายการ</span></div>
              </div>
              <div className="space-y-2.5">{pieData.map(item => (<div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-sm text-gray-600">{item.name}</span></div><span className="text-sm text-[#5e5873]">{item.value}</span></div>))}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Building2 className={cn("w-5 h-5", ICON.text)} /> แยกตามหน่วยงาน & ช่องทาง</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2.5">
              <p className="text-xs text-gray-400">โรงพยาบาล/หน่วยบริการ</p>
              {hospData.map(h => {
                const maxV = hospData[0]?.value || 1;
                const pct = Math.round((h.value / maxV) * 100);
                return (<div key={h.fullName} className="space-y-1"><div className="flex items-center justify-between"><span className="text-sm text-[#5e5873]">{h.fullName}</span><span className="text-sm text-[#5e5873]">{h.value}</span></div><div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: filterColor }}></div></div></div>);
              })}
            </div>
            {channelData.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">ช่องทาง</p>
                {channelData.map(ch => (<div key={ch.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><Smartphone size={13} className="text-gray-400" /><span className="text-sm text-[#5e5873]">{ch.name}</span></div><span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full">{ch.value}</span></div>))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Video className={cn("w-5 h-5", ICON.text)} /> รายการ Tele-med</CardTitle><span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length}</span></CardHeader>
        <CardContent className="p-0"><div className="overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-[#EDE9FE]/30">
            <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873]">รายการ</TableHead><TableHead className="text-xs text-[#5e5873]">แพทย์</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead><TableHead className="text-xs w-[60px]"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.slice(0, 20).map((t) => {
              const sc = getStatusConfig(t.status);
              return (<TableRow key={t.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectSession(t)}>
                <TableCell><div className="text-sm text-[#5e5873]">{t.patientName}</div><div className="text-xs text-gray-400">{t.hn}</div></TableCell>
                <TableCell className="text-sm text-gray-600">{t.title}</TableCell>
                <TableCell className="text-sm text-gray-600">{t.doctor}</TableCell>
                <TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table></div>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><Video className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการ</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
