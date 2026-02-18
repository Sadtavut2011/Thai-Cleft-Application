import React, { useMemo } from 'react';
import { ArrowLeft, Send, CheckCircle2, Clock, AlertTriangle, Eye, Building2, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PURPLE, SYSTEM_ICON_COLORS } from '../../../../../../data/themeConfig';
import { FlatReferral, STATUS_CONFIG, URGENCY_CONFIG, getStatusConfig, getUrgencyConfig } from './shared';

const ICON = SYSTEM_ICON_COLORS.referral;

interface Props {
  referrals: FlatReferral[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectReferral: (r: FlatReferral) => void;
}

export function StatusDrilldown({ referrals, filter, label, onBack, onSelectReferral }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return referrals;
    return referrals.filter(r => r.status === filter);
  }, [referrals, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    pending: filtered.filter(r => r.status === 'Pending').length,
    accepted: filtered.filter(r => r.status === 'Accepted').length,
    completed: filtered.filter(r => r.status === 'Completed').length,
    rejected: filtered.filter(r => r.status === 'Rejected').length,
    emergency: filtered.filter(r => r.urgency === 'Emergency').length,
  }), [filtered]);

  const pieData = [
    { name: 'รอการตอบรับ', value: stats.pending, color: '#4285f4' },
    { name: 'รอรับตัว', value: stats.accepted, color: '#ff6d00' },
    { name: 'ตรวจแล้ว', value: stats.completed, color: '#28c76f' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const destData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => { const d = r.destinationHospital || '-'; if (d !== '-') map.set(d, (map.get(d) || 0) + 1); });
    return Array.from(map.entries()).map(([name, value]) => ({
      name: name.replace('โรงพยาบาล', 'รพ.').length > 12 ? name.replace('โรงพยาบาล', 'รพ.').slice(0, 12) + '..' : name.replace('โรงพยาบาล', 'รพ.'),
      fullName: name, value,
    })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [filtered]);

  const filterColor = STATUS_CONFIG[filter]?.hex || PURPLE.primary;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${filterColor}15` }}><Send className="w-6 h-6" style={{ color: filterColor }} /></div>
        <div className="flex-1"><h1 className="text-[#5e5873] text-xl">{label}</h1><p className="text-xs text-gray-500">รายละเอียดการส่งตัว</p></div>
        <span className="text-xs text-white px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: filterColor }}>{filtered.length} รายการ</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'ทั้งหมด', value: stats.total, icon: Send, ic: ICON.text, ib: ICON.bg },
          { label: 'รอการตอบรับ', value: stats.pending, icon: Clock, ic: 'text-[#4285f4]', ib: 'bg-[#4285f4]/10' },
          { label: 'รอรับตัว', value: stats.accepted, icon: AlertTriangle, ic: 'text-[#ff6d00]', ib: 'bg-[#ff6d00]/10' },
          { label: 'ตรวจแล้ว', value: stats.completed, icon: CheckCircle2, ic: 'text-[#28c76f]', ib: 'bg-[#28c76f]/10' },
          { label: 'ฉุกเฉิน', value: stats.emergency, icon: AlertTriangle, ic: 'text-[#ea5455]', ib: 'bg-[#ea5455]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3"><div className={cn("p-2.5 rounded-xl", s.ib)}><s.icon className={cn("w-4 h-4", s.ic)} /></div><div><p className="text-xs text-gray-500">{s.label}</p><p className="text-xl text-[#5e5873]">{s.value}</p></div></CardContent>
          </Card>
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
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Building2 className={cn("w-5 h-5", ICON.text)} /> ปลายทางส่งตัว (Top 6)</CardTitle></CardHeader>
          <CardContent>
            {destData.length > 0 ? (
              <div style={{ minHeight: 220 }}>
                <ResponsiveContainer width="100%" height={220} debounce={50}>
                  <BarChart data={destData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
        <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Send className={cn("w-5 h-5", ICON.text)} /> รายการส่งตัว</CardTitle><span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length}</span></CardHeader>
        <CardContent className="p-0"><div className="overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-[#EDE9FE]/30">
            <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873]">ต้นทาง → ปลายทาง</TableHead><TableHead className="text-xs text-[#5e5873]">ความเร่งด่วน</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead><TableHead className="text-xs w-[60px]"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.slice(0, 20).map((r) => {
              const sc = getStatusConfig(r.status);
              const uc = getUrgencyConfig(r.urgency);
              return (<TableRow key={r.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectReferral(r)}>
                <TableCell><div className="text-sm text-[#5e5873]">{r.patientName}</div><div className="text-xs text-gray-400">{r.hn}</div></TableCell>
                <TableCell><div className="flex items-center gap-1 text-sm text-gray-600"><span className="truncate max-w-[80px]">{r.sourceHospital}</span><Send size={12} className="text-[#ff6d00] shrink-0" /><span className="truncate max-w-[80px] text-[#7367f0]">{r.destinationHospital}</span></div></TableCell>
                <TableCell><span className={cn("px-2 py-1 rounded-full text-xs", uc.bg, uc.color)}>{uc.label}</span></TableCell>
                <TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table></div>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><Send className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการ</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
