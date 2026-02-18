import React, { useMemo } from 'react';
import {
  ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Clock,
  XCircle, ClipboardList, Building2, Stethoscope, Eye,
  TrendingUp, Activity, PieChart as PieChartIcon,
} from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { SYSTEM_ICON_COLORS } from '../../../../../../data/themeConfig';
import { FlatAppointment, STATUS_CONFIG, getStatusConfig, TREATMENT_MAP } from './shared';

const ICON = SYSTEM_ICON_COLORS.appointment;

interface Props {
  appointments: FlatAppointment[];
  treatmentName: string;
  treatmentColor: string;
  onBack: () => void;
  onSelectAppointment: (a: FlatAppointment) => void;
}

export function TreatmentDrilldown({ appointments, treatmentName, treatmentColor, onBack, onSelectAppointment }: Props) {
  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const raw = (a.type || a.clinic || 'ไม่ระบุ').trim();
      const mapped = TREATMENT_MAP[raw] || raw;
      return mapped === treatmentName;
    });
  }, [appointments, treatmentName]);

  const stats = useMemo(() => ({
    total: filtered.length,
    confirmed: filtered.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.confirmed).length,
    waiting: filtered.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.waiting).length,
    completed: filtered.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.completed).length,
    cancelled: filtered.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.cancelled).length,
  }), [filtered]);

  const pieData = [
    { name: 'ยืนยันแล้ว', value: stats.confirmed, color: '#4285f4' },
    { name: 'รอการยืนยัน', value: stats.waiting, color: '#ff9f43' },
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'ขาดนัด/ยกเลิก', value: stats.cancelled, color: '#ea5455' },
  ].filter(d => d.value > 0);

  // Hospital breakdown
  const hospitalData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(a => {
      const h = a.hospital || 'ไม่ระบุ';
      map.set(h, (map.get(h) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name: name.replace('โรงพยาบาล', 'รพ.'), fullName: name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${treatmentColor}15` }}>
          <Activity className="w-6 h-6" style={{ color: treatmentColor }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[#5e5873] text-xl">{treatmentName}</h1>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: treatmentColor }}></div>
          </div>
          <p className="text-xs text-gray-500">รายละเอียดนัดหมายประเภท {treatmentName}</p>
        </div>
        <span className="text-xs text-white px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: treatmentColor }}>
          {filtered.length} นัดหมาย
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ทั้งหมด', value: stats.total, icon: ClipboardList, iconColor: ICON.text, iconBg: ICON.bg },
          { label: 'ยืนยันแล้ว', value: stats.confirmed, icon: CheckCircle2, iconColor: 'text-[#4285f4]', iconBg: 'bg-[#4285f4]/10' },
          { label: 'รอการยืนยัน', value: stats.waiting, icon: Clock, iconColor: 'text-[#ff9f43]', iconBg: 'bg-[#ff9f43]/10' },
          { label: 'เสร็จสิ้น', value: stats.completed, icon: CheckCircle2, iconColor: 'text-[#28c76f]', iconBg: 'bg-[#28c76f]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl", s.iconBg)}>
                <s.icon className={cn("w-4 h-4", s.iconColor)} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl text-[#5e5873]">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital breakdown */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Building2 className={cn("w-5 h-5", ICON.text)} /> แยกตามโรงพยาบาล
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospitalData.length > 0 ? (
              <div className="space-y-3">
                {hospitalData.map(h => {
                  const maxVal = hospitalData[0]?.value || 1;
                  const pct = Math.round((h.value / maxVal) * 100);
                  return (
                    <div key={h.fullName} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5e5873]">{h.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-[#5e5873]">{h.value}</span>
                          <span className="text-xs text-gray-400">นัดหมาย</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: treatmentColor }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">ไม่มีข้อมูล</p>
            )}
          </CardContent>
        </Card>

        {/* Status distribution */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <PieChartIcon className={cn("w-5 h-5", ICON.text)} /> สถานะนัดหมาย
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="h-[180px] relative" style={{ minHeight: 180, minWidth: 180 }}>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180} debounce={50}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={5} dataKey="value" stroke="none">
                        {pieData.map((entry, idx) => (<Cell key={`c-${idx}`} fill={entry.color} />))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">ไม่มีข้อมูล</div>
                )}
                {pieData.length > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl text-[#5e5873]">{stats.total}</span>
                    <span className="text-[10px] text-gray-400">รายการ</span>
                  </div>
                )}
              </div>
              <div className="space-y-2.5">
                {pieData.map(item => {
                  const pct = stats.total > 0 ? Math.round(item.value / stats.total * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-[#5e5873]">{item.value}</span>
                        <span className="text-xs text-gray-400">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments table */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
            <CalendarIcon className={cn("w-5 h-5", ICON.text)} /> รายการนัดหมาย — {treatmentName}
          </CardTitle>
          <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length} รายการ</span>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#EDE9FE]/30">
                  <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">รายการ</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">วันที่/เวลา</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">แพทย์</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                  <TableHead className="text-xs w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, 20).map(a => {
                  const sc = getStatusConfig(a.status);
                  return (
                    <TableRow key={a.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectAppointment(a)}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          {a.image && <img src={a.image} alt={a.patientName} className="w-8 h-8 rounded-full object-cover border-2 border-gray-100 shrink-0" />}
                          <div>
                            <div className="text-sm text-[#5e5873]">{a.patientName}</div>
                            <div className="text-xs text-gray-400">HN: {a.hn}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Stethoscope size={14} className={ICON.text} />
                          <span className="text-sm text-[#5e5873]">{a.clinic}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{a.hospital}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">{a.date}</div>
                        <div className="text-xs text-gray-400">{a.time}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{a.doctor}</TableCell>
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
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>ไม่พบนัดหมายประเภท {treatmentName}</p>
            </div>
          )}
          {filtered.length > 20 && (
            <div className="text-center py-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">แสดง 20 จาก {filtered.length} รายการ</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
