import React, { useMemo } from 'react';
import {
  ArrowLeft, Users, AlertCircle, Baby, Building2,
  Home, ChevronRight, TrendingUp, Activity,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { CASE_MANAGER_DATA, CaseManager, getStatusLabel, getStatusStyle } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

const OVERLOAD_THRESHOLD = 40;

interface Props {
  onBack: () => void;
  onSelectCM: (cm: CaseManager) => void;
}

export function WorkloadDrilldown({ onBack, onSelectCM }: Props) {
  const allActive = useMemo(() =>
    CASE_MANAGER_DATA.filter(c => c.status === 'active').sort((a, b) => b.patientCount - a.patientCount),
  []);

  const overloaded = useMemo(() => allActive.filter(c => c.patientCount > OVERLOAD_THRESHOLD), [allActive]);
  const normal = useMemo(() => allActive.filter(c => c.patientCount <= OVERLOAD_THRESHOLD), [allActive]);

  const stats = useMemo(() => ({
    totalActive: allActive.length,
    overloaded: overloaded.length,
    avgPatients: allActive.length > 0 ? Math.round(allActive.reduce((s, c) => s + c.patientCount, 0) / allActive.length) : 0,
    maxPatients: allActive.length > 0 ? allActive[0].patientCount : 0,
  }), [allActive, overloaded]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">Workload Alert</h1>
          <p className="text-white/70 text-[14px] truncate">ภาระงาน Case Manager</p>
        </div>
        {overloaded.length > 0 && (
          <span className="text-white text-[14px] font-bold bg-[#EA5455] px-3 py-1 rounded-full shrink-0">
            {overloaded.length} เกินเกณฑ์
          </span>
        )}
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
            { label: 'CM ปฏิบัติงาน', value: `${stats.totalActive}`, icon: Users, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'ภาระงานเกิน', value: `${stats.overloaded}`, icon: AlertCircle, iconColor: 'text-[#EA5455]', iconBg: 'bg-red-50', border: 'border-red-100' },
            { label: 'เฉลี่ยต่อ CM', value: `${stats.avgPatients}`, icon: Baby, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'สูงสุด', value: `${stats.maxPatients}`, icon: TrendingUp, iconColor: 'text-[#ff6d00]', iconBg: 'bg-orange-50', border: 'border-orange-100' },
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

        {/* Workload threshold info */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={18} className="text-[#7066A9]" />
            <h3 className="font-bold text-[#37286A] text-[18px]">เกณฑ์ภาระงาน</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#7066A9]">เกณฑ์ปกติ</span>
                <span className="text-[16px] font-bold text-[#28c76f]">&le; {OVERLOAD_THRESHOLD} ผู้ป่วย/CM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#7066A9]">เกินเกณฑ์</span>
                <span className="text-[16px] font-bold text-[#EA5455]">&gt; {OVERLOAD_THRESHOLD} ผู้ป่วย/CM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overloaded CMs */}
        {overloaded.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] border-l-4 border-l-[#EA5455] overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
                <AlertCircle className="text-[#EA5455]" size={18} /> ภาระงานเกินเกณฑ์
              </h3>
              <span className="text-[14px] font-bold text-[#EA5455] bg-[#FCEAEA] px-2 py-0.5 rounded-full">{overloaded.length} คน</span>
            </div>
            <div className="divide-y divide-dashed divide-gray-100">
              {overloaded.map(cm => {
                const pct = stats.maxPatients > 0 ? Math.round((cm.patientCount / stats.maxPatients) * 100) : 0;
                return (
                  <div key={cm.id} className="px-4 py-3 cursor-pointer active:bg-[#F4F0FF]/50 transition-colors" onClick={() => onSelectCM(cm)}>
                    <div className="flex items-center gap-3 mb-2">
                      <img src={cm.image} alt={cm.name} className="w-11 h-11 rounded-full bg-slate-100 border-2 border-white shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#37286A] text-[18px] truncate">{cm.name}</span>
                          <span className="text-[16px] font-black text-[#EA5455] shrink-0">{cm.patientCount} ผู้ป่วย</span>
                        </div>
                        <p className="text-[14px] text-[#7066A9]">{cm.id} — จ.{cm.province}</p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#EA5455]" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="text-[12px] text-[#EA5455] font-bold shrink-0">{pct}%</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1"><Building2 size={14} className="text-[#7066A9]" /><span className="text-[14px] text-[#37286A]">{cm.hospitals.length} รพ.</span></div>
                      <div className="flex items-center gap-1"><Home size={14} className="text-[#28c76f]" /><span className="text-[14px] text-[#37286A]">{cm.activeVisits} เยี่ยมบ้าน</span></div>
                      <ChevronRight size={16} className="text-[#D2CEE7] ml-auto shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Normal workload CMs */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
          <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Users className="text-[#7066A9]" size={18} /> ภาระงานปกติ
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#28c76f] px-2 py-0.5 rounded-full">{normal.length} คน</span>
          </div>
          {normal.length === 0 ? (
            <div className="text-center py-12 text-[#7066A9]">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบ CM ที่ภาระงานปกติ</p>
            </div>
          ) : (
            <div className="divide-y divide-dashed divide-gray-100">
              {normal.map(cm => {
                const pct = stats.maxPatients > 0 ? Math.round((cm.patientCount / stats.maxPatients) * 100) : 0;
                return (
                  <div key={cm.id} className="px-4 py-3 cursor-pointer active:bg-[#F4F0FF]/50 transition-colors" onClick={() => onSelectCM(cm)}>
                    <div className="flex items-center gap-3 mb-2">
                      <img src={cm.image} alt={cm.name} className="w-11 h-11 rounded-full bg-slate-100 border-2 border-white shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#37286A] text-[18px] truncate">{cm.name}</span>
                          <span className="text-[16px] font-black text-[#37286A] shrink-0">{cm.patientCount} ผู้ป่วย</span>
                        </div>
                        <p className="text-[14px] text-[#7066A9]">{cm.id} — จ.{cm.province}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#28c76f]" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="text-[12px] text-[#28c76f] font-bold shrink-0">{pct}%</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1"><Building2 size={14} className="text-[#7066A9]" /><span className="text-[14px] text-[#37286A]">{cm.hospitals.length} รพ.</span></div>
                      <div className="flex items-center gap-1"><Home size={14} className="text-[#28c76f]" /><span className="text-[14px] text-[#37286A]">{cm.activeVisits} เยี่ยมบ้าน</span></div>
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
