import React, { useMemo } from 'react';
import {
  ArrowLeft, Smartphone, Monitor, Phone, Building2,
  Video, Calendar as CalendarIcon, BarChart3, TrendingUp,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { FlatSession, getStatusConfig } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

const CHANNEL_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string; icon: typeof Smartphone }> = {
  mobile:   { label: 'Mobile App',      color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]', hex: '#28c76f', icon: Phone },
  agency:   { label: 'ผ่าน รพ.สต.',     color: 'text-[#7367f0]', bg: 'bg-[#EEEDFD]', hex: '#7367f0', icon: Building2 },
  hospital: { label: 'ผ่านโรงพยาบาล',   color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', hex: '#ff9f43', icon: Monitor },
};

const getChannelKey = (ch: string): string => {
  const c = (ch || '').toLowerCase();
  if (c === 'agency') return 'agency';
  if (c === 'hospital') return 'hospital';
  return 'mobile';
};

interface Props {
  sessions: FlatSession[];
  filter: string; // 'all' | 'mobile' | 'agency' | 'hospital'
  label: string;
  onBack: () => void;
  onSelectSession: (s: FlatSession) => void;
}

export function ChannelDrilldown({ sessions, filter, label, onBack, onSelectSession }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return sessions;
    return sessions.filter(t => getChannelKey(t.channel) === filter);
  }, [sessions, filter]);

  const channelStats = useMemo(() => {
    const mobile = filtered.filter(t => getChannelKey(t.channel) === 'mobile').length;
    const agency = filtered.filter(t => getChannelKey(t.channel) === 'agency').length;
    const hospital = filtered.filter(t => getChannelKey(t.channel) === 'hospital').length;
    return { total: filtered.length, mobile, agency, hospital };
  }, [filtered]);

  const pieData = [
    { name: 'Mobile App', value: channelStats.mobile, color: '#28c76f' },
    { name: 'ผ่าน รพ.สต.', value: channelStats.agency, color: '#7367f0' },
    { name: 'ผ่านโรงพยาบาล', value: channelStats.hospital, color: '#ff9f43' },
  ].filter(d => d.value > 0);

  // Consultation breakdown statistics
  const consultBreakdown = useMemo(() => {
    const total = filtered.length;
    return {
      daily: Math.max(1, Math.round(total / 30)),
      weekly: Math.max(1, Math.round(total / 4)),
      monthly: total,
    };
  }, [filtered]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">แยกตามช่องทาง Tele-med</p>
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
            { label: 'ทั้งหมด', value: channelStats.total, icon: Video, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'Mobile App', value: channelStats.mobile, icon: Phone, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
            { label: 'ผ่าน รพ.สต.', value: channelStats.agency, icon: Building2, iconColor: 'text-[#7367f0]', iconBg: 'bg-purple-50', border: 'border-purple-100' },
            { label: 'ผ่าน รพ.', value: channelStats.hospital, icon: Monitor, iconColor: 'text-[#ff9f43]', iconBg: 'bg-amber-50', border: 'border-amber-100' },
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

        {/* Pie chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <BarChart3 className="text-[#7066A9]" size={18} /> สัดส่วนช่องทาง
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-[110px] h-[110px] relative shrink-0" style={{ minWidth: 110, minHeight: 110 }}>
              <PieChart width={110} height={110}>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[18px] font-black text-[#37286A]">{channelStats.total}</span>
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
                    <span className="text-[14px] text-[#7066A9]">({channelStats.total > 0 ? Math.round(item.value / channelStats.total * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consultation Statistics — Daily / Weekly / Monthly */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <TrendingUp className="text-[#7066A9]" size={18} /> สถิติการปรึกษา
          </h3>
          <div className="space-y-3">
            {[
              { label: 'รายวัน (เฉลี่ย)', value: consultBreakdown.daily, unit: 'ครั้ง/วัน', color: '#49358E' },
              { label: 'รายสัปดาห์', value: consultBreakdown.weekly, unit: 'ครั้ง/สัปดาห์', color: '#7066A9' },
              { label: 'รายเดือน (ทั้งหมด)', value: consultBreakdown.monthly, unit: 'ครั้ง/เดือน', color: '#37286A' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#F4F0FF] last:border-0">
                <span className="text-[16px] font-bold text-[#7066A9]">{item.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[18px] font-black" style={{ color: item.color }}>{item.value}</span>
                  <span className="text-[14px] text-[#7066A9]">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Channel breakdown within stats */}
          <div className="pt-3 mt-3 border-t border-[#F4F0FF] space-y-2">
            <p className="text-[14px] font-bold text-[#7066A9]">แยกตามช่องทาง</p>
            {[
              { key: 'mobile', label: 'Mobile App', icon: Phone, count: channelStats.mobile, color: '#28c76f' },
              { key: 'agency', label: 'ผ่าน รพ.สต.', icon: Building2, count: channelStats.agency, color: '#7367f0' },
              { key: 'hospital', label: 'ผ่านโรงพยาบาล', icon: Monitor, count: channelStats.hospital, color: '#ff9f43' },
            ].map(ch => {
              const Icon = ch.icon;
              return (
                <div key={ch.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} style={{ color: ch.color }} />
                    <span className="text-[16px] text-[#37286A]">{ch.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-black text-[#37286A]">{ch.count}</span>
                    <span className="text-[14px] text-[#7066A9]">({channelStats.total > 0 ? Math.round(ch.count / channelStats.total * 100) : 0}%)</span>
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
              <Smartphone className="text-[#7066A9]" size={18} /> รายการตามช่องทาง
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E3E0F0] text-[#7066A9]">
              <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบรายการ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.slice(0, 20).map(t => {
                const sc = getStatusConfig(t.status);
                const chKey = getChannelKey(t.channel);
                const chCfg = CHANNEL_CONFIG[chKey] || CHANNEL_CONFIG.mobile;
                const ChannelIcon = chCfg.icon;
                const channelLabel = chKey === 'agency' ? `Via Host (${t.sourceUnit || 'ผ่านหน่วยงาน'})` : chKey === 'hospital' ? (t.hospital || 'โรงพยาบาล') : 'Direct (ผู้ป่วยเชื่อมต่อเอง)';
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
                          <ChannelIcon className={cn("w-4 h-4 shrink-0", chCfg.color)} />
                          <span className={cn("text-[16px] font-bold truncate", chCfg.color)}>{channelLabel}</span>
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