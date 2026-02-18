import React, { useMemo } from 'react';
import {
  ArrowLeft, Clock, AlertTriangle, Send,
  Building2, CalendarClock,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { useDragScroll } from '../../components/useDragScroll';
import { FlatReferral, getStatusConfig } from './shared';

// Today reference (project date: 2026-02-17)
const TODAY = new Date('2026-02-17');

function getDaysWaiting(dateStr: string): number {
  if (!dateStr || dateStr === '-') return 0;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  return Math.max(0, Math.floor((TODAY.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
}

function getWaitCategory(days: number): 'critical' | 'warning' | 'normal' {
  if (days > 7) return 'critical';
  if (days > 3) return 'warning';
  return 'normal';
}

const WAIT_CONFIG: Record<string, { label: string; color: string; hex: string; bg: string }> = {
  critical: { label: 'รอมากกว่า 7 วัน', color: 'text-[#ea5455]', hex: '#ea5455', bg: 'bg-[#ea5455]/10' },
  warning:  { label: 'รอ 3-7 วัน',      color: 'text-[#ff9f43]', hex: '#ff9f43', bg: 'bg-[#ff9f43]/10' },
  normal:   { label: 'รอไม่เกิน 3 วัน',  color: 'text-[#28c76f]', hex: '#28c76f', bg: 'bg-[#28c76f]/10' },
};

interface Props {
  referrals: FlatReferral[];
  filter: string;    // 'all' | 'critical' | 'warning' | 'normal'
  label: string;
  onBack: () => void;
  onSelectReferral: (r: FlatReferral) => void;
}

export function OverdueDrilldown({ referrals, filter, label, onBack, onSelectReferral }: Props) {
  // Only pending referrals
  const pendingRefs = useMemo(() =>
    referrals.filter(r => r.status === 'Pending').map(r => ({
      ...r,
      daysWaiting: getDaysWaiting(r.date),
      waitCategory: getWaitCategory(getDaysWaiting(r.date)),
    })),
    [referrals]
  );

  // Filter by category
  const filtered = useMemo(() => {
    if (filter === 'all') return pendingRefs;
    return pendingRefs.filter(r => r.waitCategory === filter);
  }, [pendingRefs, filter]);

  // Stats
  const stats = useMemo(() => ({
    total: pendingRefs.length,
    critical: pendingRefs.filter(r => r.waitCategory === 'critical').length,
    warning: pendingRefs.filter(r => r.waitCategory === 'warning').length,
    normal: pendingRefs.filter(r => r.waitCategory === 'normal').length,
  }), [pendingRefs]);

  const statsDrag = useDragScroll();

  const filterConfig = WAIT_CONFIG[filter] || { label: 'ทั้งหมด', hex: '#49358E' };

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">
            {filter === 'all' ? 'ทุกระยะเวลา' : filterConfig.label}
          </p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{filtered.length} รายการ</span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Stat summary cards */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {[
            { label: 'รอตอบรับทั้งหมด', value: stats.total, icon: Clock, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'รอ >7 วัน', value: stats.critical, icon: AlertTriangle, iconColor: 'text-[#ea5455]', iconBg: 'bg-red-50', border: 'border-red-100' },
            { label: 'รอ 3-7 วัน', value: stats.warning, icon: CalendarClock, iconColor: 'text-[#ff9f43]', iconBg: 'bg-orange-50', border: 'border-orange-100' },
            { label: 'รอ <3 วัน', value: stats.normal, icon: Clock, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border snap-center", s.border)}>
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

        {/* Wait time breakdown card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <Clock className="text-[#7066A9]" size={18} /> ระยะเวลารอตอบรับ
          </h3>
          <div className="space-y-2.5">
            {(['critical', 'warning', 'normal'] as const).map(cat => {
              const conf = WAIT_CONFIG[cat];
              const count = stats[cat];
              return (
                <div key={cat} className="p-2.5 rounded-lg bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: conf.hex }}></div>
                      <span className="text-[16px] font-bold text-[#37286A]">{conf.label}</span>
                    </div>
                    <span className="text-[16px] text-[#7066A9] shrink-0 ml-2">{count} รายการ</span>
                  </div>
                  <div className="w-full h-2 bg-[#E3E0F0] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%`,
                      backgroundColor: conf.hex,
                    }}></div>
                  </div>
                </div>
              );
            })}
            <div className="pt-2 mt-1 border-t border-[#F4F0FF] flex items-center justify-between px-1">
              <span className="text-[16px] text-[#7066A9]">รวมทั้งหมด</span>
              <span className="text-[16px] font-black text-[#49358E]">{stats.total} รายการ</span>
            </div>
          </div>
        </div>

        {/* Referral list */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Send className="text-[#7066A9]" size={18} /> รายการรอตอบรับ
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E3E0F0] text-[#7066A9]">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบรายการรอตอบรับ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.slice(0, 20).map(r => {
                const sc = getStatusConfig(r.status);
                const wc = WAIT_CONFIG[r.waitCategory];
                return (
                  <div
                    key={r.id}
                    onClick={() => onSelectReferral(r)}
                    className="bg-white border border-[#E3E0F0] shadow-sm rounded-2xl active:scale-[0.98] transition-all cursor-pointer overflow-hidden hover:border-[#7066A9] hover:shadow-md"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#5e5873] text-[18px] truncate">{r.patientName}</h4>
                          <p className="text-[14px] text-[#6a7282] mt-0.5">HN: {r.hn}</p>
                        </div>
                        <span className={cn("rounded-full px-3 py-1 text-[12px] font-bold shrink-0 ml-2", wc.bg, wc.color)}>
                          รอ {r.daysWaiting} วัน
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-3 bg-[#F4F0FF]/50 rounded-xl px-3 py-2.5">
                        <span className="text-[16px] text-[#5e5873] truncate">{r.sourceHospital}</span>
                        <Send size={14} className="text-[#7066A9] shrink-0" />
                        <span className="text-[16px] font-bold text-[#7367f0] truncate">{r.destinationHospital}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: wc.hex }}></div>
                          <span className={cn("text-[14px] font-bold", wc.color)}>{wc.label}</span>
                        </div>
                        <span className="text-[14px] text-[#6a7282]">{r.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length > 20 && (
                <p className="text-center text-[16px] text-[#7066A9] py-2">แสดง 20 จาก {filtered.length} รายการ</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
