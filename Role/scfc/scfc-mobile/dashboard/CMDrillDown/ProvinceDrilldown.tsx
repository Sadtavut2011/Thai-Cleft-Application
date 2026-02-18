import React, { useMemo } from 'react';
import {
  ArrowLeft, Users, UserCheck, Building2, MapPin, Baby,
  Home, AlertCircle, ChevronRight,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { CASE_MANAGER_DATA, CaseManager, getStatusLabel, getStatusStyle } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  province: string;
  onBack: () => void;
  onSelectCM: (cm: CaseManager) => void;
}

export function ProvinceDrilldown({ province, onBack, onSelectCM }: Props) {
  const filtered = useMemo(() => CASE_MANAGER_DATA.filter(cm => cm.province === province), [province]);

  const stats = useMemo(() => ({
    total: filtered.length,
    active: filtered.filter(c => c.status === 'active').length,
    totalPatients: filtered.reduce((s, c) => s + c.patientCount, 0),
    totalHospitals: new Set(filtered.flatMap(c => c.hospitals.map(h => h.id))).size,
    avgPatients: filtered.length > 0 ? Math.round(filtered.reduce((s, c) => s + c.patientCount, 0) / filtered.length) : 0,
    overloaded: filtered.filter(c => c.patientCount > 40 && c.status === 'active').length,
  }), [filtered]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">จังหวัด{province}</h1>
          <p className="text-white/70 text-[14px] truncate">ข้อมูล Case Manager ในจังหวัด</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{filtered.length} คน</span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Stats */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {[
            { label: 'CM ในจังหวัด', value: `${stats.total} คน`, icon: Users, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'ปฏิบัติงาน', value: `${stats.active} คน`, icon: UserCheck, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
            { label: 'ผู้ป่วยรวม', value: `${stats.totalPatients} คน`, icon: Baby, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'เฉลี่ยต่อ CM', value: `${stats.avgPatients} คน`, icon: Building2, iconColor: 'text-[#ff6d00]', iconBg: 'bg-orange-50', border: 'border-orange-100' },
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

        {/* Overloaded alert */}
        {stats.overloaded > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] border-l-4 border-l-[#EA5455] overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF]">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
                <AlertCircle className="text-[#EA5455]" size={18} /> CM ภาระงานเกิน ({stats.overloaded} คน)
              </h3>
            </div>
            <div className="divide-y divide-dashed divide-gray-100">
              {filtered.filter(c => c.patientCount > 40 && c.status === 'active').map(cm => (
                <div key={cm.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-[#F4F0FF]/50 transition-colors" onClick={() => onSelectCM(cm)}>
                  <img src={cm.image} alt={cm.name} className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] font-bold text-[#37286A] truncate">{cm.name}</p>
                    <p className="text-[14px] text-[#EA5455]">{cm.patientCount} ผู้ป่วย | {cm.hospitals.length} รพ.</p>
                  </div>
                  <ChevronRight size={16} className="text-[#D2CEE7] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CM list */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
          <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Users className="text-[#7066A9]" size={18} /> CM ในจังหวัด{province}
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length} คน</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#7066A9]">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบ CM ในจังหวัดนี้</p>
            </div>
          ) : (
            <div className="divide-y divide-dashed divide-gray-100">
              {filtered.map(cm => {
                const ss = getStatusStyle(cm.status);
                return (
                  <div key={cm.id} className="px-4 py-3 hover:bg-[#F4F0FF]/30 cursor-pointer active:bg-[#F4F0FF]/50 transition-colors" onClick={() => onSelectCM(cm)}>
                    <div className="flex items-center gap-3">
                      <img src={cm.image} alt={cm.name} className="w-11 h-11 rounded-full bg-slate-100 border-2 border-white shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#37286A] text-[18px] truncate">{cm.name}</span>
                          <span className={cn("rounded-full px-2.5 py-0.5 text-[14px] font-bold shrink-0 flex items-center gap-1", ss.bg, ss.color)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", ss.dot)}></span>
                            {getStatusLabel(cm.status)}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#7066A9]">{cm.id}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1"><Baby size={14} className="text-[#4285f4]" /><span className={cn("text-[14px]", cm.patientCount > 40 ? "text-[#EA5455] font-bold" : "text-[#37286A]")}>{cm.patientCount} ผู้ป่วย</span></div>
                          <div className="flex items-center gap-1"><Building2 size={14} className="text-[#7066A9]" /><span className="text-[14px] text-[#37286A]">{cm.hospitals.length} รพ.</span></div>
                          <div className="flex items-center gap-1"><Home size={14} className="text-[#28c76f]" /><span className="text-[14px] text-[#37286A]">{cm.activeVisits}/{cm.completedVisits}</span></div>
                        </div>
                      </div>
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