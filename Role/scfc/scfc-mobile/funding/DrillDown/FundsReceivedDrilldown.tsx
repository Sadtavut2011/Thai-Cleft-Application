import React, { useMemo } from 'react';
import {
  ArrowLeft, Coins, TrendingUp, Building2, Users,
  PieChart as PieChartIcon, DollarSign, BarChart3,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { FlatFundRequest, FundReceivedItem, getStatusConfig, buildFlatFundRequests } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  funds: FundReceivedItem[];
  filterLabel: string;
  onBack: () => void;
}

export function FundsReceivedDrilldown({ funds, filterLabel, onBack }: Props) {
  const flatRequests = useMemo(() => buildFlatFundRequests(), []);

  const totalAmount = useMemo(() => funds.reduce((s, f) => s + f.amount, 0), [funds]);
  const totalCount = useMemo(() => funds.reduce((s, f) => s + f.count, 0), [funds]);

  // Pie chart data from funds
  const pieData = useMemo(() =>
    funds.filter(f => f.amount > 0).map(f => ({
      name: f.name,
      value: f.amount,
      color: f.color,
    })),
  [funds]);

  // Breakdown by status for requests matching these fund types
  const statusBreakdown = useMemo(() => {
    const fundNames = new Set(funds.map(f => f.name));
    const matching = flatRequests.filter(r => fundNames.has(r.fundType));
    const map = new Map<string, { count: number; amount: number }>();
    matching.forEach(r => {
      const existing = map.get(r.status);
      if (existing) { existing.count++; existing.amount += r.amount; }
      else map.set(r.status, { count: 1, amount: r.amount });
    });
    return Array.from(map.entries())
      .map(([status, d]) => {
        const cfg = getStatusConfig(status);
        return { status, label: cfg.label, hex: cfg.hex, ...d };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [flatRequests, funds]);

  // Top patients by amount for the matched fund types
  const topPatients = useMemo(() => {
    const fundNames = new Set(funds.map(f => f.name));
    const matching = flatRequests.filter(r => fundNames.has(r.fundType));
    const map = new Map<string, { name: string; hn: string; hospital: string; amount: number; count: number }>();
    matching.forEach(r => {
      const existing = map.get(r.hn);
      if (existing) { existing.amount += r.amount; existing.count++; }
      else map.set(r.hn, { name: r.patientName, hn: r.hn, hospital: r.hospital, amount: r.amount, count: 1 });
    });
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount).slice(0, 8);
  }, [flatRequests, funds]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">กองทุนที่ได้รับ</h1>
          <p className="text-white/70 text-[14px] truncate">{filterLabel}</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{funds.length} กองทุน</span>
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
            { label: 'กองทุน', value: String(funds.length), icon: Coins, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'คำขอทั้งหมด', value: String(totalCount), icon: BarChart3, iconColor: 'text-[#f5a623]', iconBg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'ยอดรวม', value: `฿${totalAmount.toLocaleString()}`, icon: TrendingUp, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
            { label: 'เฉลี่ย/คำขอ', value: `฿${totalCount > 0 ? Math.round(totalAmount / totalCount).toLocaleString() : 0}`, icon: DollarSign, iconColor: 'text-[#7367f0]', iconBg: 'bg-[#7367f0]/10', border: 'border-[#7367f0]/20' },
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

        {/* Pie chart — สัดส่วนกองทุน */}
        {pieData.length > 0 && (
          null
        )}

        {/* รายละเอียดแต่ละกองทุน */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <Coins className="text-[#7066A9]" size={18} /> รายละเอียดกองทุน
          </h3>
          <div className="space-y-3">
            {funds.map((fund, idx) => {
              const pct = totalAmount > 0 ? Math.round((fund.amount / totalAmount) * 100) : 0;
              return (
                <div key={fund.name} className="p-3 rounded-xl bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${fund.color}15` }}>
                        <Coins size={16} style={{ color: fund.color }} />
                      </div>
                      <span className="text-[16px] font-bold text-[#37286A] truncate">{fund.name}</span>
                    </div>
                    <span className="text-[16px] font-bold text-[#7066A9] shrink-0 ml-2">{fund.count} คำขอ</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#E3E0F0] rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: fund.color }}></div>
                  </div>
                  <div className="flex justify-between text-[16px]">
                    <span className="text-[#7066A9]">ยอดรวม ({pct}%)</span>
                    <span className="font-black text-[#f5a623]">฿{fund.amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Total row */}
          <div className="mt-3 pt-3 border-t border-[#E3E0F0] flex items-center justify-between px-1">
            <span className="text-[16px] font-bold text-[#37286A]">รวมทั้งหมด</span>
            <span className="text-[18px] font-black text-[#49358E]">฿{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* สถานะคำขอในกองทุนเหล่านี้ */}
        {statusBreakdown.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
              <BarChart3 className="text-[#7066A9]" size={18} /> สถานะคำขอ
            </h3>
            <div className="space-y-2.5">
              {statusBreakdown.map(sb => (
                <div key={sb.status} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[#F4F0FF]/30 border border-[#E3E0F0]">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sb.hex }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold text-[#37286A]">{sb.label}</p>
                    <span className="text-[14px] text-[#7066A9]">{sb.count} คำขอ</span>
                  </div>
                  <span className="text-[16px] font-black text-[#f5a623] shrink-0">฿{sb.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ผู้ป่วยที่เกี่ยวข้อง */}
        {topPatients.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
              <Users className="text-[#7066A9]" size={18} /> ผู้ป่วยที่เกี่ยวข้อง
            </h3>
            <div className="space-y-2">
              {topPatients.map((pt, idx) => (
                <div key={pt.hn} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-[#F4F0FF]/30 border border-[#E3E0F0]">
                  <div className="w-8 h-8 rounded-full bg-[#F4F0FF] flex items-center justify-center shrink-0 text-[14px] font-bold text-[#49358E]">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold text-[#37286A] truncate">{pt.name}</p>
                    <div className="flex items-center gap-2 text-[14px] text-[#7066A9]">
                      <span>{pt.hn}</span>
                      <span className="text-[#D2CEE7]">|</span>
                      <span className="truncate">{pt.hospital}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[16px] font-black text-[#f5a623]">฿{pt.amount.toLocaleString()}</span>
                    <p className="text-[14px] text-[#7066A9]">{pt.count} คำขอ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
