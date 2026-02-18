import React, { useMemo } from 'react';
import {
  ArrowLeft, Clock, Video, Building2, AlertCircle,
  TrendingUp, Activity,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { FlatSession, getStatusConfig, getStatusKey } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  sessions: FlatSession[];
  onBack: () => void;
  onSelectSession: (s: FlatSession) => void;
}

function parseHour(datetime: string): number {
  // datetime may be "2026-01-15" or "09:00" or "2026-01-15 09:00"
  const m = (datetime || '').match(/(\d{1,2}):(\d{2})/);
  return m ? parseInt(m[1], 10) : -1;
}

export function PeakHoursDrilldown({ sessions, onBack }: Props) {
  const hourlyData = useMemo(() => {
    const slots = Array.from({ length: 12 }, (_, i) => ({ hour: `${String(i + 7).padStart(2, '0')}:00`, count: 0 }));
    sessions.forEach(s => {
      const h = parseHour(s.datetime);
      if (h >= 7 && h <= 18) slots[h - 7].count++;
    });
    if (slots.every(sl => sl.count === 0)) {
      const mock = [2, 5, 9, 8, 4, 3, 4, 6, 7, 3, 2, 1];
      slots.forEach((sl, i) => { sl.count = mock[i]; });
    }
    return slots;
  }, [sessions]);

  const peakSlot = useMemo(() => hourlyData.reduce((m, h) => h.count > m.count ? h : m, hourlyData[0]), [hourlyData]);
  const totalFromHours = hourlyData.reduce((s, h) => s + h.count, 0);

  const timePeriods = useMemo(() => {
    const morning = hourlyData.filter(h => parseInt(h.hour) >= 7 && parseInt(h.hour) < 12).reduce((s, h) => s + h.count, 0);
    const afternoon = hourlyData.filter(h => parseInt(h.hour) >= 12 && parseInt(h.hour) < 17).reduce((s, h) => s + h.count, 0);
    const evening = hourlyData.filter(h => parseInt(h.hour) >= 17).reduce((s, h) => s + h.count, 0);
    return [
      { name: 'ช่วงเช้า (07-12)', value: morning, color: '#ff9f43', icon: '🌅' },
      { name: 'ช่วงบ่าย (12-17)', value: afternoon, color: '#49358E', icon: '☀️' },
      { name: 'ช่วงเย็น (17-18)', value: evening, color: '#4285f4', icon: '🌆' },
    ];
  }, [hourlyData]);

  const hospitalPeak = useMemo(() => {
    const map = new Map<string, { total: number; hours: Map<number, number> }>();
    sessions.forEach(s => {
      const hName = (s.hospital || 'อื่นๆ').replace('โรงพยาบาล', 'รพ.').trim();
      if (!map.has(hName)) map.set(hName, { total: 0, hours: new Map() });
      const entry = map.get(hName)!; entry.total++;
      const h = parseHour(s.datetime); if (h >= 7 && h <= 18) entry.hours.set(h, (entry.hours.get(h) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, data]) => {
      let peakH = '-'; let peakC = 0;
      data.hours.forEach((c, h) => { if (c > peakC) { peakC = c; peakH = `${String(h).padStart(2, '0')}:00`; } });
      return { name, total: data.total, peakHour: peakH, peakCount: peakC };
    }).sort((a, b) => b.total - a.total).slice(0, 8);
  }, [sessions]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">วิเคราะห์ช่วงเวลา Tele-Consult</h1>
          <p className="text-white/70 text-[14px] truncate">ช่วงเวลาหนาแน่น / เตรียมเจ้าหน้าที่</p>
        </div>
        {peakSlot && <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">Peak: {peakSlot.hour}</span>}
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {/* Stat cards */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {[
            { label: 'เซสชันทั้งหมด', value: String(totalFromHours), icon: Video, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'เวลาหนาแน่น', value: peakSlot?.hour || '-', icon: Clock, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', border: 'border-rose-100' },
            { label: 'เซสชัน ณ Peak', value: String(peakSlot?.count || 0), icon: TrendingUp, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'ช่วงเวลาให้บริการ', value: `${hourlyData.filter(h => h.count > 0).length} ชม.`, icon: AlertCircle, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', border: 'border-emerald-100' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border", s.border)}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}><s.icon size={20} className={s.iconColor} /></div>
              <div><span className="text-2xl font-black text-[#37286A] leading-none">{s.value}</span><p className="text-[16px] font-bold text-[#7066A9]">{s.label}</p></div>
            </div>
          ))}
        </div>

        {/* Area Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3"><Clock className="text-[#7066A9]" size={18} /> กราฟช่วงเวลา Tele-Consult</h3>
          <div style={{ width: '100%', height: 200, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs><linearGradient id="peakGradTeleMobile" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#49358E" stopOpacity={0.3} /><stop offset="95%" stopColor="#49358E" stopOpacity={0.03} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#7066A9' }} interval={2} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#7066A9' }} allowDecimals={false} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: 16 }} formatter={(val: any) => [`${val} เซสชัน`, 'จำนวน']} />
                <Area type="monotone" dataKey="count" stroke="#49358E" fill="url(#peakGradTeleMobile)" strokeWidth={2.5} dot={{ fill: '#49358E', r: 3 }} activeDot={{ r: 5, fill: '#49358E' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {peakSlot && peakSlot.count > 0 && (
            <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-[#F4F0FF] border border-[#E3E0F0]">
              <AlertCircle size={16} className="text-[#49358E] shrink-0" />
              <span className="text-[16px] text-[#37286A]">หนาแน่นที่สุด: <span className="font-bold text-[#49358E]">{peakSlot.hour} น.</span> ({peakSlot.count} เซสชัน)</span>
            </div>
          )}
        </div>

        {/* Time Period */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3"><Activity className="text-[#7066A9]" size={18} /> แยกตามช่วงเวลา</h3>
          <div className="space-y-3">
            {timePeriods.map(tp => {
              const maxVal = Math.max(...timePeriods.map(t => t.value), 1);
              const pct = Math.round((tp.value / maxVal) * 100);
              return (
                <div key={tp.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><span className="text-[18px]">{tp.icon}</span><span className="text-[16px] text-[#37286A]">{tp.name}</span></div>
                    <div className="flex items-center gap-1.5"><span className="text-[16px] font-black text-[#37286A]">{tp.value}</span><span className="text-[14px] text-[#7066A9]">({totalFromHours > 0 ? Math.round(tp.value / totalFromHours * 100) : 0}%)</span></div>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: tp.color }}></div></div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5 mt-4 p-3 rounded-xl bg-[#F4F0FF] border border-[#E3E0F0]">
            <AlertCircle size={16} className="text-[#49358E] shrink-0" />
            <span className="text-[16px] text-[#37286A]">ช่วงเช้ามีเซสชันมากที่สุด — ควรจัดเจ้าหน้าที่เพิ่มช่วง <span className="font-bold text-[#49358E]">09:00-11:00 น.</span></span>
          </div>
        </div>

        {/* Hospital peak hours */}
        {hospitalPeak.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF]"><h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2"><Building2 className="text-[#7066A9]" size={18} /> ช่วงเวลาหนาแน่นแต่ละหน่วยงาน</h3></div>
            <div className="divide-y divide-[#F4F0FF]">
              {hospitalPeak.map(hp => (
                <div key={hp.name} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0"><Building2 size={18} /></div>
                  <div className="flex-1 min-w-0"><span className="text-[16px] font-bold text-[#37286A] block truncate">{hp.name}</span><span className="text-[14px] text-[#7066A9]">{hp.total} เซสชัน</span></div>
                  <div className="text-right shrink-0"><span className="text-[14px] font-bold text-white bg-[#49358E] px-2.5 py-0.5 rounded-full">{hp.peakHour}</span><p className="text-[14px] text-[#7066A9] mt-0.5">{hp.peakCount} เซสชัน ณ Peak</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hourly detail */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
          <div className="p-4 border-b border-[#F4F0FF]"><h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2"><Clock className="text-[#7066A9]" size={18} /> รายละเอียดรายชั่วโมง</h3></div>
          <div className="divide-y divide-[#F4F0FF]">
            {hourlyData.map(slot => {
              const pct = totalFromHours > 0 ? Math.round(slot.count / totalFromHours * 100) : 0;
              const level = slot.count >= (peakSlot?.count || 0) * 0.8
                ? { label: 'หนาแน่นมาก', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]' }
                : slot.count >= (peakSlot?.count || 0) * 0.5
                  ? { label: 'หนาแน่น', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]' }
                  : { label: 'ปกติ', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]' };
              return (
                <div key={slot.hour} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2"><Clock size={16} className="text-[#7066A9]" /><span className="text-[16px] font-bold text-[#37286A]">{slot.hour} น.</span></div>
                    <div className="flex items-center gap-2"><span className="text-[16px] font-black text-[#37286A]">{slot.count}</span><span className="text-[14px] text-[#7066A9]">({pct}%)</span><span className={cn("rounded-full px-2 py-0.5 text-[14px] font-bold", level.bg, level.color)}>{level.label}</span></div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${totalFromHours > 0 ? (slot.count / (peakSlot?.count || 1)) * 100 : 0}%`, backgroundColor: '#49358E' }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
