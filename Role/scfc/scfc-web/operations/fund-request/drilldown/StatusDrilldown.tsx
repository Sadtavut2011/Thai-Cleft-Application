import React, { useMemo } from 'react';
import { ArrowLeft, Coins, CheckCircle2, Clock, XCircle, Eye, Building2, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { PURPLE, SYSTEM_ICON_COLORS } from '../../../../../../data/themeConfig';
import { FlatFundRequest, STATUS_CONFIG, getStatusConfig } from './shared';

const ICON = SYSTEM_ICON_COLORS.fund;

interface Props {
  requests: FlatFundRequest[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectRequest: (r: FlatFundRequest) => void;
}

export function StatusDrilldown({ requests, filter, label, onBack, onSelectRequest }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return requests;
    if (filter === 'approved_received') return requests.filter(r => r.status === 'Approved' || r.status === 'Received');
    return requests.filter(r => r.status === filter);
  }, [requests, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    totalAmount: filtered.reduce((s, r) => s + (r.amount || 0), 0),
    pending: filtered.filter(r => r.status === 'Pending').length,
    approved: filtered.filter(r => r.status === 'Approved' || r.status === 'Received').length,
    disbursed: filtered.filter(r => r.status === 'Disbursed').length,
    rejected: filtered.filter(r => r.status === 'Rejected').length,
  }), [filtered]);

  const pieData = [
    { name: 'รอพิจารณา', value: stats.pending, color: '#f5a623' },
    { name: 'อนุมัติ/รับเงิน', value: stats.approved, color: '#4285f4' },
    { name: 'จ่ายเงินแล้ว', value: stats.disbursed, color: '#28c76f' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const hospData = useMemo(() => {
    const map = new Map<string, { count: number; amount: number }>();
    filtered.forEach(r => {
      const h = r.hospital || '-';
      if (!map.has(h)) map.set(h, { count: 0, amount: 0 });
      const e = map.get(h)!; e.count++; e.amount += r.amount || 0;
    });
    return Array.from(map.entries()).map(([name, d]) => ({ name: name.replace('โรงพยาบาล', 'รพ.'), ...d })).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [filtered]);

  const fundTypeData = useMemo(() => {
    const map = new Map<string, { count: number; amount: number }>();
    filtered.forEach(r => {
      const ft = r.fundType || 'ไม่ระบุ';
      if (!map.has(ft)) map.set(ft, { count: 0, amount: 0 });
      const e = map.get(ft)!; e.count++; e.amount += r.amount || 0;
    });
    const colors = ['#7367f0', '#f5a623', '#ea5455', '#28c76f', '#00cfe8'];
    return Array.from(map.entries()).map(([name, d], i) => ({ name, ...d, color: colors[i % colors.length] })).sort((a, b) => b.amount - a.amount);
  }, [filtered]);

  const filterColor = STATUS_CONFIG[filter]?.hex || PURPLE.primary;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${filterColor}15` }}><Coins className="w-6 h-6" style={{ color: filterColor }} /></div>
        <div className="flex-1"><h1 className="text-[#5e5873] text-xl">{label}</h1><p className="text-xs text-gray-500">รายละเอียดคำขอทุน</p></div>
        <span className="text-xs text-white px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: filterColor }}>{filtered.length} คำขอ</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'คำขอทั้งหมด', value: String(stats.total), icon: Coins, ic: ICON.text, ib: ICON.bg },
          { label: 'รอพิจารณา', value: String(stats.pending), icon: Clock, ic: 'text-[#f5a623]', ib: 'bg-[#f5a623]/10' },
          { label: 'อนุมัติแล้ว', value: String(stats.approved), icon: CheckCircle2, ic: 'text-[#4285f4]', ib: 'bg-[#4285f4]/10' },
          { label: 'ยอดรวม', value: `฿${stats.totalAmount.toLocaleString()}`, icon: TrendingUp, ic: 'text-[#28c76f]', ib: 'bg-[#28c76f]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl"><CardContent className="p-4 flex items-center gap-3"><div className={cn("p-2.5 rounded-xl", s.ib)}><s.icon className={cn("w-4 h-4", s.ic)} /></div><div><p className="text-xs text-gray-500">{s.label}</p><p className="text-lg text-[#5e5873]">{s.value}</p></div></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><PieChartIcon className={cn("w-5 h-5", ICON.text)} /> สัดส่วนสถานะ</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-[200px] relative" style={{ minHeight: 200 }}>
                <ResponsiveContainer width="100%" height={200} debounce={50}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={5} dataKey="value" stroke="none">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} /></PieChart></ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-2xl text-[#5e5873]">{stats.total}</span><span className="text-[10px] text-gray-400">คำขอ</span></div>
              </div>
              <div className="space-y-2.5">{pieData.map(item => (<div key={item.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-sm text-gray-600">{item.name}</span></div><span className="text-sm text-[#5e5873]">{item.value}</span></div>))}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Coins className={cn("w-5 h-5", ICON.text)} /> แยกตามแหล่งทุน</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {fundTypeData.map(ft => {
              const maxV = fundTypeData[0]?.amount || 1;
              const pct = Math.round((ft.amount / maxV) * 100);
              return (<div key={ft.name} className="space-y-1.5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ft.color }}></div><span className="text-sm text-[#5e5873]">{ft.name}</span></div><div className="text-right"><span className="text-sm text-[#f5a623]">฿{ft.amount.toLocaleString()}</span><span className="text-xs text-gray-400 ml-1.5">({ft.count})</span></div></div><div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ft.color }}></div></div></div>);
            })}
          </div></CardContent>
        </Card>
      </div>

      {hospData.length > 0 && (
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Building2 className={cn("w-5 h-5", ICON.text)} /> แยกตามโรงพยาบาล</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {hospData.map(h => (<div key={h.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"><div className="flex items-center gap-2"><Building2 size={14} className="text-[#7367f0]" /><span className="text-sm text-[#5e5873]">{h.name}</span></div><div className="text-right"><span className="text-sm text-[#f5a623]">฿{h.amount.toLocaleString()}</span><span className="text-xs text-gray-400 ml-1">({h.count})</span></div></div>))}
          </div></CardContent>
        </Card>
      )}

      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Coins className={cn("w-5 h-5", ICON.text)} /> รายการคำขอทุน</CardTitle><span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length}</span></CardHeader>
        <CardContent className="p-0"><div className="overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-[#EDE9FE]/30">
            <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873]">แหล่งทุน</TableHead><TableHead className="text-xs text-[#5e5873]">จำนวนเงิน</TableHead><TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead><TableHead className="text-xs w-[60px]"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.slice(0, 20).map((r) => {
              const sc = getStatusConfig(r.status);
              return (<TableRow key={r.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectRequest(r)}>
                <TableCell><div className="text-sm text-[#5e5873]">{r.patientName}</div><div className="text-xs text-gray-400">{r.hn}</div></TableCell>
                <TableCell className="text-sm text-gray-600">{r.fundType}</TableCell>
                <TableCell className="text-sm text-[#f5a623]">฿{(r.amount || 0).toLocaleString()}</TableCell>
                <TableCell className="text-sm text-gray-600">{r.hospital}</TableCell>
                <TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table></div>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><Coins className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการ</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
