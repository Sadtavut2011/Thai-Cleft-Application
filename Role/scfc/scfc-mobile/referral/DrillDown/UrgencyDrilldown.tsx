import React, { useMemo } from 'react';
import {
  ArrowLeft, Send, AlertTriangle, CheckCircle2, Clock,
  Building2, PieChart as PieChartIcon, MapPin, Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { useDragScroll } from '../../components/useDragScroll';
import { FlatReferral, STATUS_CONFIG, URGENCY_CONFIG, getStatusConfig } from './shared';

interface Props {
  referrals: FlatReferral[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectReferral: (r: FlatReferral) => void;
}

export function UrgencyDrilldown({ referrals, filter, label, onBack, onSelectReferral }: Props) {
  const filtered = useMemo(() => referrals.filter(r => r.urgency === filter), [referrals, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    pending: filtered.filter(r => r.status === 'Pending').length,
    accepted: filtered.filter(r => r.status === 'Accepted').length,
    completed: filtered.filter(r => r.status === 'Completed').length,
    rejected: filtered.filter(r => r.status === 'Rejected').length,
  }), [filtered]);

  const pieData = [
    { name: 'รอการตอบรับ', value: stats.pending, color: '#4285f4' },
    { name: 'รอรับตัว', value: stats.accepted, color: '#ff6d00' },
    { name: 'ตรวจแล้ว', value: stats.completed, color: '#28c76f' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const destData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => {
      const d = r.destinationHospital || '-';
      if (d !== '-') map.set(d, (map.get(d) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name: name.replace('โรงพยาบาล', 'รพ.'), value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filtered]);

  const uc = URGENCY_CONFIG[filter] || URGENCY_CONFIG.Routine;

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">ระดับความเร่งด่วน "{uc.label}"</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{filtered.length} รายการ</span>
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
            { label: 'ทั้งหมด', value: stats.total, icon: Send, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'รอการตอบรับ', value: stats.pending, icon: Clock, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'รอรับตัว', value: stats.accepted, icon: AlertTriangle, iconColor: 'text-[#ff6d00]', iconBg: 'bg-orange-50', border: 'border-orange-100' },
            { label: 'ตรวจแล้ว', value: stats.completed, icon: CheckCircle2, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
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

        {/* Pie chart — status breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <PieChartIcon className="text-[#7066A9]" size={18} /> สัดส่วนสถานะ
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-[110px] h-[110px] relative shrink-0" style={{ minWidth: 110, minHeight: 110 }}>
              <PieChart width={110} height={110}>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[18px] font-black text-[#37286A]">{stats.total}</span>
                <span className="text-[12px] text-[#7066A9]">รายการ</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[16px] text-[#5e5873]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-black text-[#37286A]">{item.value}</span>
                    <span className="text-[14px] text-[#7066A9]">({stats.total > 0 ? Math.round(item.value / stats.total * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Destination hospitals */}
        {destData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
                <Building2 className="text-[#7066A9]" size={18} /> ปลายทางส่งตัว
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {destData.map(h => {
                const maxV = destData[0]?.value || 1;
                const pct = Math.round((h.value / maxV) * 100);
                return (
                  <div key={h.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-bold text-[#37286A] truncate">{h.name}</span>
                      <span className="text-[16px] font-black text-[#37286A]">{h.value}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: uc.hex }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Referral list */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Send className="text-[#7066A9]" size={18} /> รายการส่งตัว — {uc.label}
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E3E0F0] text-[#7066A9]">
              <Send className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบรายการ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.slice(0, 20).map(r => {
                const sc = getStatusConfig(r.status);
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
                        <span className={cn("rounded-full px-3 py-1 text-[12px] font-bold shrink-0 ml-2", sc.bg, sc.color)}>{sc.label}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-3 bg-[#F4F0FF]/50 rounded-xl px-3 py-2.5">
                        <span className="text-[16px] text-[#5e5873] truncate">{r.sourceHospital}</span>
                        <Send size={14} className="text-[#7066A9] shrink-0" />
                        <span className="text-[16px] font-bold text-[#7367f0] truncate">{r.destinationHospital}</span>
                      </div>
                      <div className="flex items-center justify-end mt-2">
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