import React, { useMemo } from 'react';
import {
  ArrowLeft, Users, TrendingUp, Baby, Building2,
  Home, ChevronRight, Award, Star,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { CASE_MANAGER_DATA, CaseManager, getStatusLabel, getStatusStyle } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  onBack: () => void;
  onSelectCM: (cm: CaseManager) => void;
}

export function TopPerformersDrilldown({ onBack, onSelectCM }: Props) {
  const ranked = useMemo(() =>
    CASE_MANAGER_DATA
      .filter(c => c.status === 'active')
      .sort((a, b) => b.patientCount - a.patientCount),
  []);

  const stats = useMemo(() => ({
    total: ranked.length,
    totalPatients: ranked.reduce((s, c) => s + c.patientCount, 0),
    avgPatients: ranked.length > 0 ? Math.round(ranked.reduce((s, c) => s + c.patientCount, 0) / ranked.length) : 0,
    totalHospitals: new Set(ranked.flatMap(c => c.hospitals.map(h => h.id))).size,
  }), [ranked]);

  const maxPatients = ranked.length > 0 ? ranked[0].patientCount : 1;

  const statsDrag = useDragScroll();

  const getRankStyle = (rank: number) => {
    if (rank === 0) return { bg: 'bg-gradient-to-r from-[#49358E] to-[#7066A9]', text: 'text-white', badge: 'bg-amber-400 text-amber-900' };
    if (rank === 1) return { bg: 'bg-gradient-to-r from-[#5e4fa2] to-[#8b7ec8]', text: 'text-white', badge: 'bg-slate-300 text-slate-700' };
    if (rank === 2) return { bg: 'bg-gradient-to-r from-[#7066A9] to-[#9b93cc]', text: 'text-white', badge: 'bg-orange-300 text-orange-800' };
    return { bg: 'bg-white', text: 'text-[#37286A]', badge: 'bg-[#F4F0FF] text-[#49358E]' };
  };

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">CM ดูแลมากที่สุด</h1>
          <p className="text-white/70 text-[14px] truncate">อันดับ Case Manager ที่ดูแลผู้ป่วยมากที่สุด</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{ranked.length} คน</span>
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
            { label: 'CM ปฏิบัติงาน', value: `${stats.total}`, icon: Users, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'ผู้ป่วยรวม', value: `${stats.totalPatients}`, icon: Baby, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'เฉลี่ยต่อ CM', value: `${stats.avgPatients}`, icon: TrendingUp, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
            { label: 'โรงพยาบาล', value: `${stats.totalHospitals}`, icon: Building2, iconColor: 'text-[#ff6d00]', iconBg: 'bg-orange-50', border: 'border-orange-100' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border", s.border)}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}>
                <s.icon size={20} className={s.iconColor} />
              </div>
              <div>
                <span className="text-2xl font-black text-[#37286A] leading-none">{s.value}</span>
                <p className="text-[14px] font-bold text-[#7066A9]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Top 3 podium */}
        {ranked.length >= 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-4">
              <Award size={18} className="text-amber-500" /> Top 3 CM
            </h3>
            <div className="space-y-3">
              {ranked.slice(0, 3).map((cm, i) => {
                const rs = getRankStyle(i);
                const pct = Math.round((cm.patientCount / maxPatients) * 100);
                return (
                  <div
                    key={cm.id}
                    className={cn("rounded-xl p-3.5 cursor-pointer active:scale-[0.98] transition-all", rs.bg, i >= 3 ? 'border border-[#E3E0F0]' : 'shadow-md')}
                    onClick={() => onSelectCM(cm)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={cm.image} alt={cm.name} className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm" />
                        <span className={cn("absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-black", rs.badge)}>
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn("font-bold text-[18px] truncate", rs.text)}>{cm.name}</span>
                          <span className={cn("text-[16px] font-black shrink-0", rs.text)}>{cm.patientCount} ผู้ป่วย</span>
                        </div>
                        <p className={cn("text-[14px] mt-0.5", i < 3 ? 'text-white/70' : 'text-[#7066A9]')}>
                          จ.{cm.province} | {cm.hospitals.length} รพ.
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", i < 3 ? 'bg-white/60' : 'bg-[#49358E]')} style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className={cn("text-[12px] font-bold shrink-0", i < 3 ? 'text-white/80' : 'text-[#49358E]')}>{pct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full ranking list */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
          <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <TrendingUp className="text-[#7066A9]" size={18} /> อันดับทั้งหมด
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{ranked.length} คน</span>
          </div>
          {ranked.length === 0 ? (
            <div className="text-center py-12 text-[#7066A9]">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบ CM ที่ปฏิบัติงาน</p>
            </div>
          ) : (
            <div className="divide-y divide-dashed divide-gray-100">
              {ranked.map((cm, i) => {
                const pct = Math.round((cm.patientCount / maxPatients) * 100);
                const ss = getStatusStyle(cm.status);
                return (
                  <div key={cm.id} className="px-4 py-3 cursor-pointer active:bg-[#F4F0FF]/50 transition-colors" onClick={() => onSelectCM(cm)}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-black shrink-0",
                        i === 0 ? "bg-amber-400 text-amber-900" :
                        i === 1 ? "bg-slate-300 text-slate-700" :
                        i === 2 ? "bg-orange-300 text-orange-800" :
                        "bg-[#F4F0FF] text-[#49358E]"
                      )}>{i + 1}</span>
                      <img src={cm.image} alt={cm.name} className="w-11 h-11 rounded-full bg-slate-100 border-2 border-white shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#37286A] text-[18px] truncate">{cm.name}</span>
                          <span className="text-[16px] font-black text-[#49358E] shrink-0">{cm.patientCount}</span>
                        </div>
                        <p className="text-[14px] text-[#7066A9]">{cm.id} — จ.{cm.province}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: cm.patientCount > 40
                              ? 'linear-gradient(90deg, #EA5455, #ff6b6b)'
                              : 'linear-gradient(90deg, #49358E, #7066A9)',
                          }}
                        ></div>
                      </div>
                      <span className={cn("text-[12px] font-bold shrink-0", cm.patientCount > 40 ? "text-[#EA5455]" : "text-[#49358E]")}>{pct}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1"><Building2 size={14} className="text-[#7066A9]" /><span className="text-[14px] text-[#37286A]">{cm.hospitals.length} รพ.</span></div>
                      <div className="flex items-center gap-1"><Home size={14} className="text-[#28c76f]" /><span className="text-[14px] text-[#37286A]">{cm.activeVisits}/{cm.completedVisits}</span></div>
                      <ChevronRight size={16} className="text-[#D2CEE7] ml-auto shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
