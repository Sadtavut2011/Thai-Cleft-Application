import React, { useMemo } from 'react';
import {
  ArrowLeft, Users, Calendar as CalendarIcon, Building2,
  Smartphone, Monitor, Phone,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { FlatSession, getStatusConfig, getStatusKey } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

const AGE_GROUPS = ['0-5', '6-12', '13-18', '19-30', '31-50', '51+'] as const;

function calcAge(dob: string | undefined): number | null {
  if (!dob) return null;
  try {
    const d = new Date(dob);
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
    return age;
  } catch { return null; }
}

function getAgeGroup(age: number | null): string {
  if (age === null) return 'unknown';
  if (age <= 5) return '0-5';
  if (age <= 12) return '6-12';
  if (age <= 18) return '13-18';
  if (age <= 30) return '19-30';
  if (age <= 50) return '31-50';
  return '51+';
}

const GROUP_COLORS: Record<string, string> = {
  '0-5': '#49358E', '6-12': '#7066A9', '13-18': '#28c76f',
  '19-30': '#ff9f43', '31-50': '#4285f4', '51+': '#ea5455',
};

interface Props {
  sessions: FlatSession[];
  filter: string; // 'all' | '0-5' | '6-12' etc.
  label: string;
  onBack: () => void;
  onSelectSession: (s: FlatSession) => void;
}

export function AgeGroupDrilldown({ sessions, filter, label, onBack, onSelectSession }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return sessions;
    return sessions.filter(t => {
      const age = calcAge(t.patientDob);
      return getAgeGroup(age) === filter;
    });
  }, [sessions, filter]);

  const ageStats = useMemo(() => {
    const groups: Record<string, number> = {};
    AGE_GROUPS.forEach(g => { groups[g] = 0; });
    filtered.forEach(t => {
      const age = calcAge(t.patientDob);
      const group = getAgeGroup(age);
      if (group !== 'unknown' && groups[group] !== undefined) groups[group]++;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">แยกตามกลุ่มอายุ Tele-med</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{filtered.length} รายการ</span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Stat cards - age groups */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {ageStats.map((g, i) => (
            <div key={i} className="bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[140px] shrink-0 border border-[#E3E0F0]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${GROUP_COLORS[g.name] || '#49358E'}15` }}>
                <Users size={20} style={{ color: GROUP_COLORS[g.name] || '#49358E' }} />
              </div>
              <div>
                <span className="text-2xl font-black text-[#37286A] leading-none">{g.value}</span>
                <p className="text-[16px] font-bold text-[#7066A9]">{g.name} ปี</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <Users className="text-[#7066A9]" size={18} /> กราฟกลุ่มอายุ
          </h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ageStats} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 14, fill: '#7066A9' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 13, fill: '#7066A9' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E3E0F0', fontSize: '14px' }}
                  formatter={(val: any) => [`${val} ราย`, 'จำนวน']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32} fill="#49358E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[16px] text-[#7066A9] mt-3 text-center">แบ่งตามช่วงอายุ (ปี)</p>
        </div>

        {/* Session list */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Users className="text-[#7066A9]" size={18} /> รายการผู้ป่วย
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
                const age = calcAge(t.patientDob);
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
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-[#5e5873] text-[18px] truncate">{t.patientName}</h4>
                            {age !== null && (
                              <span className="text-[12px] font-bold text-[#49358E] bg-[#F4F0FF] px-2 py-0.5 rounded-full shrink-0">{age} ปี</span>
                            )}
                          </div>
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
