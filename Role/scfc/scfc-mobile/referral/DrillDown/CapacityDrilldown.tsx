import React, { useMemo } from 'react';
import {
  ArrowLeft, Send, Building2, AlertTriangle, CheckCircle2,
  Clock, Users, MapPin, Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PATIENTS_DATA } from '../../../../../data/patientData';
import { FlatReferral, STATUS_CONFIG, URGENCY_CONFIG, getStatusConfig, getUrgencyConfig } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  referrals: FlatReferral[];
  hospitalName: string;
  onBack: () => void;
  onSelectReferral: (r: FlatReferral) => void;
}

export function CapacityDrilldown({ referrals, hospitalName, onBack, onSelectReferral }: Props) {
  const hospReferrals = useMemo(() =>
    referrals.filter(r =>
      (r.sourceHospital || '').includes(hospitalName) ||
      (r.destinationHospital || '').includes(hospitalName)
    ), [referrals, hospitalName]);

  const incoming = useMemo(() =>
    hospReferrals.filter(r =>
      (r.destinationHospital || '').includes(hospitalName) &&
      (r.status === 'Pending' || r.status === 'Accepted')
    ), [hospReferrals, hospitalName]);

  const outgoing = useMemo(() =>
    hospReferrals.filter(r => (r.sourceHospital || '').includes(hospitalName)),
    [hospReferrals, hospitalName]);

  const patients = useMemo(() =>
    PATIENTS_DATA.filter((p: any) => (p.hospital || '').includes(hospitalName)),
    [hospitalName]);

  const stats = useMemo(() => ({
    totalReferrals: hospReferrals.length,
    incoming: incoming.length,
    outgoing: outgoing.length,
    patients: patients.length,
    pending: hospReferrals.filter(r => r.status === 'Pending').length,
    completed: hospReferrals.filter(r => r.status === 'Completed').length,
  }), [hospReferrals, incoming, outgoing, patients]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{hospitalName}</h1>
          <p className="text-white/70 text-[14px] truncate">ข้อมูลส่งตัวและผู้ป่วยในการดูแล</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{stats.totalReferrals} การส่งตัว</span>
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
            { label: 'ผู้ป่วยในดูแล', value: stats.patients, icon: Users, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'ส่งตัวเข้า (รอ)', value: stats.incoming, icon: AlertTriangle, iconColor: 'text-[#ff6d00]', iconBg: 'bg-orange-50', border: 'border-orange-100' },
            { label: 'ส่งตัวออก', value: stats.outgoing, icon: Send, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'ตรวจเสร็จ', value: stats.completed, icon: CheckCircle2, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
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

        {/* Incoming referrals (waiting) */}
        {incoming.length > 0 && (
          <div>
            <div className="flex items-center gap-2 px-1 mb-3">
              <AlertTriangle className="text-[#ff6d00]" size={18} />
              <h3 className="font-bold text-[#37286A] text-[18px]">รอส่งตัวเข้ามา ({incoming.length} ราย)</h3>
            </div>
            <div className="space-y-3">
              {incoming.map(r => {
                const sc = getStatusConfig(r.status);
                const uc = getUrgencyConfig(r.urgency);
                return (
                  <div
                    key={r.id}
                    onClick={() => onSelectReferral(r)}
                    className="bg-white border border-[#E3E0F0] border-l-4 border-l-[#ff6d00] shadow-sm rounded-2xl active:scale-[0.98] transition-all cursor-pointer overflow-hidden hover:border-[#7066A9] hover:shadow-md"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#5e5873] text-[18px] truncate">{r.patientName}</h4>
                          <p className="text-[14px] text-[#6a7282] mt-0.5">จาก: {r.sourceHospital}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                          <span className={cn("rounded-full px-2 py-0.5 text-[12px] font-bold", uc.bg, uc.color)}>{uc.label}</span>
                          <span className={cn("rounded-full px-2 py-0.5 text-[12px] font-bold", sc.bg, sc.color)}>{sc.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All referrals for this hospital */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Send className="text-[#7066A9]" size={18} /> การส่งตัวทั้งหมด
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{hospReferrals.length}</span>
          </div>
          {hospReferrals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E3E0F0] text-[#7066A9]">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบรายการ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hospReferrals.slice(0, 20).map(r => {
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
              {hospReferrals.length > 20 && (
                <p className="text-center text-[16px] text-[#7066A9] py-2">แสดง 20 จาก {hospReferrals.length} รายการ</p>
              )}
            </div>
          )}
        </div>

        {/* Patients in this hospital */}
        {patients.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
                <Users className="text-[#7066A9]" size={18} /> ผู้ป่วยในการดูแล
              </h3>
              <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{patients.length} ราย</span>
            </div>
            <div className="divide-y divide-[#F4F0FF]">
              {patients.slice(0, 10).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#E3E0F0] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#37286A] text-[16px] truncate block">{p.name}</span>
                    <span className="text-[14px] text-[#7066A9]">HN: {p.hn}</span>
                  </div>
                </div>
              ))}
            </div>
            {patients.length > 10 && (
              <div className="p-3 border-t border-[#F4F0FF] text-center">
                <span className="text-[16px] text-[#7066A9]">แสดง 10 จาก {patients.length} ราย</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}