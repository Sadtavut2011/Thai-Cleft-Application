import React, { useMemo } from 'react';
import {
  ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Clock,
  XCircle, ClipboardList, Building2, Stethoscope, Eye,
  AlertCircle, TrendingUp, Users, Activity,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, AreaChart, Area,
} from 'recharts';
import { PURPLE, SYSTEM_ICON_COLORS } from '../../../../../../data/themeConfig';
import { FlatAppointment, STATUS_CONFIG, getStatusConfig } from './shared';

const ICON = SYSTEM_ICON_COLORS.appointment;

interface Props {
  appointments: FlatAppointment[];
  onBack: () => void;
  onSelectAppointment: (a: FlatAppointment) => void;
}

function parseHour(time: string): number {
  const m = (time || '').trim().match(/^(\d{1,2})/);
  return m ? parseInt(m[1], 10) : -1;
}

export function PeakHoursDrilldown({ appointments, onBack, onSelectAppointment }: Props) {
  // Build hourly data (7-18)
  const hourlyData = useMemo(() => {
    const slots = Array.from({ length: 12 }, (_, i) => ({
      hour: `${String(i + 7).padStart(2, '0')}:00`,
      label: `${String(i + 7).padStart(2, '0')}:00`,
      count: 0,
    }));
    appointments.forEach(a => {
      const h = parseHour(a.time);
      if (h >= 7 && h <= 18) slots[h - 7].count++;
    });
    if (slots.every(s => s.count === 0)) {
      const mock = [3, 8, 12, 10, 6, 4, 5, 7, 9, 5, 3, 2];
      slots.forEach((s, i) => { s.count = mock[i]; });
    }
    return slots;
  }, [appointments]);

  const peakSlot = useMemo(() => hourlyData.reduce((m, h) => h.count > m.count ? h : m, hourlyData[0]), [hourlyData]);
  const totalFromHours = hourlyData.reduce((s, h) => s + h.count, 0);

  // Classify time periods
  const timePeriods = useMemo(() => {
    const morning = hourlyData.filter(h => { const n = parseInt(h.hour); return n >= 7 && n < 12; }).reduce((s, h) => s + h.count, 0);
    const afternoon = hourlyData.filter(h => { const n = parseInt(h.hour); return n >= 12 && n < 17; }).reduce((s, h) => s + h.count, 0);
    const evening = hourlyData.filter(h => { const n = parseInt(h.hour); return n >= 17; }).reduce((s, h) => s + h.count, 0);
    return [
      { name: 'ช่วงเช้า (07-12)', value: morning, color: '#ff9f43', emoji: '🌅' },
      { name: 'ช่วงบ่าย (12-17)', value: afternoon, color: PURPLE.primary, emoji: '☀️' },
      { name: 'ช่วงเย็น (17-18)', value: evening, color: '#4285f4', emoji: '🌆' },
    ];
  }, [hourlyData]);

  // Hospital breakdown with peak hour
  const hospitalPeak = useMemo(() => {
    const map = new Map<string, { total: number; hours: Map<number, number> }>();
    appointments.forEach(a => {
      const hName = (a.hospital || 'อื่นๆ').replace('โรงพยาบาล', 'รพ.').trim();
      if (!map.has(hName)) map.set(hName, { total: 0, hours: new Map() });
      const entry = map.get(hName)!;
      entry.total++;
      const h = parseHour(a.time);
      if (h >= 7 && h <= 18) entry.hours.set(h, (entry.hours.get(h) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, data]) => {
      let peakH = '-';
      let peakC = 0;
      data.hours.forEach((c, h) => { if (c > peakC) { peakC = c; peakH = `${String(h).padStart(2, '0')}:00`; } });
      return { name, total: data.total, peakHour: peakH, peakCount: peakC };
    }).sort((a, b) => b.total - a.total).slice(0, 8);
  }, [appointments]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className={cn("p-2.5 rounded-xl", ICON.bg)}>
          <Clock className={cn("w-6 h-6", ICON.text)} />
        </div>
        <div className="flex-1">
          <h1 className="text-[#5e5873] text-xl">วิเคราะห์ช่วงเวลานัดหมาย</h1>
          <p className="text-xs text-gray-500">ช่วงเวลาที่มีนัดหมายหนาแน่น เพื่อเตรียมจุดคัดกรองและเจ้าหน้าที่</p>
        </div>
        {peakSlot && (
          <span className="text-xs text-white bg-[#7367f0] px-3 py-1.5 rounded-full shrink-0">
            Peak: {peakSlot.hour}
          </span>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'นัดหมายทั้งหมด', value: totalFromHours, icon: ClipboardList, iconColor: ICON.text, iconBg: ICON.bg },
          { label: 'ช่วงเวลาหนาแน่น', value: peakSlot?.hour || '-', icon: Clock, iconColor: 'text-[#EA5455]', iconBg: 'bg-[#EA5455]/10', isText: true },
          { label: 'นัดหมาย ณ Peak', value: peakSlot?.count || 0, icon: TrendingUp, iconColor: 'text-[#ff9f43]', iconBg: 'bg-[#ff9f43]/10' },
          { label: 'ช่วงเวลาตรวจ', value: `${hourlyData.filter(h => h.count > 0).length} ชม.`, icon: AlertCircle, iconColor: 'text-[#28c76f]', iconBg: 'bg-[#28c76f]/10', isText: true },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl", s.iconBg)}>
                <s.icon className={cn("w-4 h-4", s.iconColor)} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={cn("text-[#5e5873]", (s as any).isText ? "text-lg" : "text-xl")}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main area chart - larger */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Clock className={cn("w-5 h-5", ICON.text)} /> กราฟช่วงเวลานัดหมาย
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ minHeight: 280 }}>
            <ResponsiveContainer width="100%" height={280} debounce={50}>
              <AreaChart data={hourlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="peakGradDrill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE.primary} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={PURPLE.primary} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis tick={{ fontSize: 11, fill: '#888' }} allowDecimals={false} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #eee', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} นัดหมาย`, 'จำนวน']}
                />
                <Area
                  type="monotone" dataKey="count"
                  stroke={PURPLE.primary} fill="url(#peakGradDrill)" strokeWidth={2.5}
                  dot={{ fill: PURPLE.primary, r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: PURPLE.primary }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time period breakdown */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Activity className={cn("w-5 h-5", ICON.text)} /> แยกตามช่วงเวลา
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timePeriods.map(tp => {
                const maxVal = Math.max(...timePeriods.map(t => t.value), 1);
                const pct = Math.round((tp.value / maxVal) * 100);
                return (
                  <div key={tp.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{tp.emoji}</span>
                        <span className="text-sm text-[#5e5873]">{tp.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-[#5e5873]">{tp.value}</span>
                        <span className="text-xs text-gray-400">นัดหมาย</span>
                        <span className="text-xs text-gray-400">({totalFromHours > 0 ? Math.round(tp.value / totalFromHours * 100) : 0}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: tp.color }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Insight */}
            <div className="flex items-center gap-2.5 mt-5 p-3 rounded-lg bg-[#7367f0]/5 border border-[#7367f0]/10">
              <div className={cn("p-1.5 rounded-lg", ICON.bg)}>
                <AlertCircle size={14} className={ICON.text} />
              </div>
              <span className="text-xs text-[#5e5873]">
                ช่วงเช้ามีนัดหมายมากที่สุด — ควรจัดเจ้าหน้าที่คัดกรองเพิ่มช่วง <span className="text-[#7367f0]">08:00-10:00 น.</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Hospital peak hours */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Building2 className={cn("w-5 h-5", ICON.text)} /> ช่วงเวลาหนาแน่นแต่ละ รพ.
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospitalPeak.length > 0 ? (
              <div className="space-y-3">
                {hospitalPeak.map(hp => (
                  <div key={hp.name} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Building2 size={14} className="text-[#7367f0]" />
                      <div>
                        <span className="text-sm text-[#5e5873]">{hp.name}</span>
                        <div className="text-xs text-gray-400">{hp.total} นัดหมาย</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full">{hp.peakHour}</span>
                      <div className="text-[10px] text-gray-400 mt-0.5">{hp.peakCount} นัด ณ Peak</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">ไม่มีข้อมูล</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hourly detail table */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
            <CalendarIcon className={cn("w-5 h-5", ICON.text)} /> รายละเอียดรายชั่วโมง
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#EDE9FE]/30">
                  <TableHead className="text-xs text-[#5e5873]">เวลา</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">จำนวนนัดหมาย</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">สัดส่วน</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">ระดับ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hourlyData.map(slot => {
                  const pct = totalFromHours > 0 ? Math.round(slot.count / totalFromHours * 100) : 0;
                  const level = slot.count >= (peakSlot?.count || 0) * 0.8
                    ? { label: 'หนาแน่นมาก', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]' }
                    : slot.count >= (peakSlot?.count || 0) * 0.5
                      ? { label: 'หนาแน่น', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]' }
                      : { label: 'ปกติ', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]' };
                  return (
                    <TableRow key={slot.hour} className="hover:bg-[#EDE9FE]/10">
                      <TableCell className="text-sm text-[#5e5873]">{slot.hour} น.</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#5e5873] w-6">{slot.count}</span>
                          <div className="flex-1 max-w-[200px] h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${totalFromHours > 0 ? (slot.count / (peakSlot?.count || 1)) * 100 : 0}%`, backgroundColor: PURPLE.primary }}></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{pct}%</TableCell>
                      <TableCell>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs", level.bg, level.color)}>{level.label}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
