import React, { useMemo } from 'react';
import {
  ArrowLeft, Building2, UserCheck, Users, Stethoscope,
  Calendar as CalendarIcon, Smartphone, Monitor, Phone,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { FlatSession, getStatusConfig, buildProviderData, TeleHospitalProvider } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  sessions: FlatSession[];
  filter: string; // 'all' | specific hospital name
  label: string;
  onBack: () => void;
  onSelectSession: (s: FlatSession) => void;
}

export function ProviderDrilldown({ sessions, filter, label, onBack, onSelectSession }: Props) {
  // Provider data from mock
  const providerData = useMemo(() => buildProviderData(), []);

  const filtered = useMemo(() => {
    if (filter === 'all') return sessions;
    return sessions.filter(t => {
      const h = (t.hospital || '').replace('โรงพยาบาล', 'รพ.').trim();
      return h === filter || t.hospital === filter;
    });
  }, [sessions, filter]);

  // Filter provider data by hospital if needed
  const filteredProviders = useMemo(() => {
    if (filter === 'all') return providerData;
    return providerData.filter(p => {
      return p.hospital === filter || p.shortName === filter;
    });
  }, [providerData, filter]);

  const totalOnlineProviders = useMemo(() => {
    let count = 0;
    filteredProviders.forEach(h => {
      count += h.doctors.filter(d => d.online).length;
      count += h.nurses.filter(n => n.online).length;
    });
    return count;
  }, [filteredProviders]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">บุคลากร & หน่วยบริการ Tele-med</p>
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
          <div className="bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border border-[#E3E0F0]">
            <div className="w-10 h-10 rounded-full bg-[#F4F0FF] flex items-center justify-center shrink-0">
              <UserCheck size={20} className="text-[#49358E]" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{filteredProviders.length}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">หน่วยบริการ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border border-green-100">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{filtered.length}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">รายการทั้งหมด</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border border-[#E3E0F0]">
            <div className="w-10 h-10 rounded-full bg-[#F4F0FF] flex items-center justify-center shrink-0">
              <Stethoscope size={20} className="text-[#49358E]" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{totalOnlineProviders}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ออนไลน์</p>
            </div>
          </div>
        </div>

        {/* Hospital breakdown with real provider data */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <Building2 className="text-[#7066A9]" size={18} /> หน่วยบริการ
          </h3>
          <div className="space-y-3">
            {filteredProviders.map(h => {
              const onlineDoctors = h.doctors.filter(d => d.online).length;
              const onlineNurses = h.nurses.filter(n => n.online).length;
              return (
                <div key={h.hospital} className="py-3 px-3 rounded-xl bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-[#49358E]" />
                      <span className="text-[16px] font-bold text-[#37286A] truncate">{h.shortName}</span>
                      <div className={cn("w-2 h-2 rounded-full shrink-0", h.online ? "bg-green-500" : "bg-gray-300")}></div>
                    </div>
                    <span className="text-[14px] font-bold text-white bg-[#49358E] w-7 h-7 rounded-full flex items-center justify-center shrink-0">{h.totalSessions}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px] px-2 py-0.5 rounded-full bg-[#49358E]/10 text-[#49358E] font-bold">แพทย์ {onlineDoctors}/{h.doctors.length}</span>
                    <span className="text-[14px] px-2 py-0.5 rounded-full bg-[#00cfe8]/10 text-[#00cfe8] font-bold">พยาบาล {onlineNurses}/{h.nurses.length}</span>
                  </div>
                  {/* Bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#49358E]" style={{ width: `${Math.round((h.totalSessions / Math.max(1, ...filteredProviders.map(p => p.totalSessions))) * 100)}%` }}></div>
                  </div>
                  {/* Provider list */}
                  <div className="mt-2 space-y-1">
                    {[...h.doctors, ...h.nurses].map(prov => (
                      <div key={prov.id} className="flex items-center gap-2 py-1">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", prov.online ? "bg-green-500" : "bg-gray-300")}></div>
                        <span className="text-[14px] text-[#37286A] truncate flex-1">{prov.name}</span>
                        <span className="text-[12px] text-[#7066A9] shrink-0">{prov.specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session list */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <UserCheck className="text-[#7066A9]" size={18} /> รายการ Tele-med
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E3E0F0] text-[#7066A9]">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบรายการ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.slice(0, 20).map(t => {
                const sc = getStatusConfig(t.status);
                const channelIcon = t.channel === 'agency' ? Building2 : t.channel === 'hospital' ? Monitor : Phone;
                const channelLabel = t.channel === 'agency' ? `Via Host (${t.sourceUnit || 'ผ่านหน่วยงาน'})` : t.channel === 'hospital' ? (t.hospital || 'โรงพยาบาล') : 'Direct (ผู้ป่วยเชื่อมต่อเอง)';
                const channelColor = t.channel === 'agency' ? 'text-[#7367f0]' : t.channel === 'hospital' ? 'text-[#ff9f43]' : 'text-[#28c76f]';
                const ChannelIcon = channelIcon;
                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectSession(t)}
                    className="bg-white border border-[#E3E0F0] shadow-sm rounded-2xl active:scale-[0.98] transition-all cursor-pointer overflow-hidden hover:border-[#7066A9] hover:shadow-md"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#5e5873] text-[18px] truncate">{t.patientName}</h4>
                          <p className="text-[14px] text-[#6a7282] mt-0.5">{t.hn}</p>
                        </div>
                        <span className={cn("rounded-full px-3 py-1 text-[12px] font-bold shrink-0 ml-2", sc.bg, sc.color)}>{sc.label}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <ChannelIcon className={cn("w-4 h-4 shrink-0", channelColor)} />
                          <span className={cn("text-[16px] font-bold truncate", channelColor)}>{channelLabel}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#6a7282]" />
                          <span className="text-[14px] text-[#6a7282]">{t.datetime}</span>
                        </div>
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
