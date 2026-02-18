import React, { useMemo } from 'react';
import {
  ArrowLeft, TrendingUp, BarChart3, Coins, Calendar,
  Building2, DollarSign,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';
import { useDragScroll } from '../../components/useDragScroll';
import { FIVE_YEAR_DATA } from '../../../../../data/themeConfig';

const SOURCE_LABELS: Record<string, string> = {
  redCross: 'สภากาชาดไทย',
  foundation: 'มูลนิธิฯ',
  northern: 'กองทุนรัฐบาล',
};

const SOURCE_COLORS: Record<string, string> = {
  redCross: '#ea5455',
  foundation: '#f5a623',
  northern: '#49358E',
};

interface Props {
  onBack: () => void;
}

export function YearlyDrilldown({ onBack }: Props) {
  const statsDrag = useDragScroll();

  const totalAll = useMemo(() =>
    FIVE_YEAR_DATA.reduce((s, d) => s + d.redCross + d.foundation + d.northern, 0),
    []
  );

  const latestYear = FIVE_YEAR_DATA[FIVE_YEAR_DATA.length - 1];
  const prevYear = FIVE_YEAR_DATA[FIVE_YEAR_DATA.length - 2];
  const latestTotal = latestYear.redCross + latestYear.foundation + latestYear.northern;
  const prevTotal = prevYear.redCross + prevYear.foundation + prevYear.northern;
  const growthPct = prevTotal > 0 ? Math.round(((latestTotal - prevTotal) / prevTotal) * 100) : 0;

  // Source totals across 5 years
  const sourceTotals = useMemo(() => {
    const keys = ['redCross', 'foundation', 'northern'] as const;
    return keys.map(k => ({
      key: k,
      name: SOURCE_LABELS[k],
      color: SOURCE_COLORS[k],
      total: FIVE_YEAR_DATA.reduce((s, d) => s + d[k], 0),
    })).sort((a, b) => b.total - a.total);
  }, []);

  // Pie data for source breakdown
  const pieData = sourceTotals.map(s => ({
    name: s.name,
    value: s.total,
    color: s.color,
  }));

  // Yearly trend data
  const yearlyTotals = FIVE_YEAR_DATA.map(d => ({
    year: d.year,
    total: d.redCross + d.foundation + d.northern,
    redCross: d.redCross,
    foundation: d.foundation,
    northern: d.northern,
  }));

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">ยอดเบิกจ่าย 5 ปี</h1>
          <p className="text-white/70 text-[14px] truncate">ปี 2565-2569 ภาพรวมแหล่งทุน</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">
          ฿{totalAll.toLocaleString()}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Stat cards */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {[
            { label: 'รวม 5 ปี', value: `฿${totalAll.toLocaleString()}`, icon: DollarSign, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: `ปี ${latestYear.year}`, value: `฿${latestTotal.toLocaleString()}`, icon: Calendar, iconColor: 'text-[#f5a623]', iconBg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'เติบโต', value: `${growthPct >= 0 ? '+' : ''}${growthPct}%`, icon: TrendingUp, iconColor: growthPct >= 0 ? 'text-[#28c76f]' : 'text-[#ea5455]', iconBg: growthPct >= 0 ? 'bg-green-50' : 'bg-red-50', border: growthPct >= 0 ? 'border-green-100' : 'border-red-100' },
            { label: 'แหล่งทุน', value: '3', icon: Coins, iconColor: 'text-[#7367f0]', iconBg: 'bg-[#7367f0]/10', border: 'border-[#7367f0]/20' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border", s.border)}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}>
                <s.icon size={20} className={s.iconColor} />
              </div>
              <div>
                <span className="text-2xl font-black text-[#37286A] leading-none">{s.value}</span>
                <p className="text-[16px] font-bold text-[#7066A9]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stacked bar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <BarChart3 className="text-[#7066A9]" size={18} /> ยอดเบิกจ่ายรายปี
          </h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={FIVE_YEAR_DATA} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fontSize: 16, fill: '#7066A9' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 16, fill: '#7066A9' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '16px' }}
                  formatter={(value: any, name: string) => [`฿${Number(value).toLocaleString()}`, SOURCE_LABELS[name] || name]}
                />
                <Bar dataKey="redCross" fill="#ea5455" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="foundation" fill="#f5a623" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="northern" fill="#49358E" radius={[2, 2, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ea5455]"></div><span className="text-[16px] text-[#7066A9]">กาชาด</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#f5a623]"></div><span className="text-[16px] text-[#7066A9]">มูลนิธิฯ</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#49358E]"></div><span className="text-[16px] text-[#7066A9]">รัฐบาล</span></div>
          </div>
        </div>

        {/* Source proportion pie chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <Coins className="text-[#7066A9]" size={18} /> สัดส่วนแหล่งทุน (5 ปี)
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-[110px] h-[110px] relative shrink-0" style={{ minWidth: 110, minHeight: 110 }}>
              <PieChart width={110} height={110}>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[16px] font-black text-[#37286A]">5 ปี</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {sourceTotals.map(s => (
                <div key={s.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }}></div>
                    <span className="text-[16px] text-[#5e5873]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-black text-[#37286A]">฿{s.total.toLocaleString()}</span>
                    <span className="text-[14px] text-[#7066A9]">({totalAll > 0 ? Math.round((s.total / totalAll) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
              <div className="pt-1.5 border-t border-[#F4F0FF]">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-[#7066A9]">รวมทั้งหมด</span>
                  <span className="text-[16px] font-black text-[#f5a623]">฿{totalAll.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly breakdown table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
          <div className="p-4 border-b border-[#F4F0FF]">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Calendar className="text-[#7066A9]" size={18} /> รายละเอียดรายปี
            </h3>
          </div>
          <div className="divide-y divide-[#F4F0FF]">
            {yearlyTotals.map((yr) => (
              <div key={yr.year} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[16px] font-bold text-[#37286A]">ปี {yr.year}</span>
                  <span className="text-[16px] font-black text-[#49358E]">฿{yr.total.toLocaleString()}</span>
                </div>
                {/* Progress bar showing composition */}
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  {yr.total > 0 && (
                    <>
                      <div className="h-full bg-[#ea5455]" style={{ width: `${(yr.redCross / yr.total) * 100}%` }}></div>
                      <div className="h-full bg-[#f5a623]" style={{ width: `${(yr.foundation / yr.total) * 100}%` }}></div>
                      <div className="h-full bg-[#49358E]" style={{ width: `${(yr.northern / yr.total) * 100}%` }}></div>
                    </>
                  )}
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[14px] text-[#ea5455]">฿{yr.redCross.toLocaleString()}</span>
                  <span className="text-[14px] text-[#f5a623]">฿{yr.foundation.toLocaleString()}</span>
                  <span className="text-[14px] text-[#49358E]">฿{yr.northern.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <TrendingUp className="text-[#7066A9]" size={18} /> แนวโน้มการเติบโต
          </h3>
          <div className="space-y-3">
            {FIVE_YEAR_DATA.slice(1).map((d, i) => {
              const prev = FIVE_YEAR_DATA[i];
              const currTotal = d.redCross + d.foundation + d.northern;
              const prevTotalVal = prev.redCross + prev.foundation + prev.northern;
              const growth = prevTotalVal > 0 ? Math.round(((currTotal - prevTotalVal) / prevTotalVal) * 100) : 0;
              return (
                <div key={d.year} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", growth >= 0 ? "bg-green-50" : "bg-red-50")}>
                      <TrendingUp size={14} className={growth >= 0 ? "text-[#28c76f]" : "text-[#ea5455] rotate-180"} />
                    </div>
                    <span className="text-[16px] text-[#5e5873]">{prev.year} → {d.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[16px] font-bold", growth >= 0 ? "text-[#28c76f]" : "text-[#ea5455]")}>
                      {growth >= 0 ? '+' : ''}{growth}%
                    </span>
                    <span className="text-[14px] text-[#7066A9]">(+฿{(currTotal - prevTotalVal).toLocaleString()})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}