import React, { useMemo } from 'react';
import {
  ArrowLeft, Video, CheckCircle2, Clock, XCircle,
  Building2, Smartphone, PieChart as PieChartIcon, Calendar as CalendarIcon,
  Activity, Monitor, Phone,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { FlatSession, STATUS_CONFIG, getStatusKey, getStatusConfig } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  sessions: FlatSession[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectSession: (s: FlatSession) => void;
}

export function StatusDrilldown({ sessions, filter, label, onBack, onSelectSession }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return sessions;
    const cfg = STATUS_CONFIG[filter];
    return cfg ? sessions.filter(t => getStatusConfig(t.status) === cfg) : sessions;
  }, [sessions, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter(t => getStatusKey(t.status) === 'completed').length,
    waiting: filtered.filter(t => getStatusKey(t.status) === 'waiting').length,
    inprogress: filtered.filter(t => getStatusKey(t.status) === 'inprogress').length,
    cancelled: filtered.filter(t => getStatusKey(t.status) === 'cancelled').length,
  }), [filtered]);

  const pieData = [
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'รอสาย', value: stats.waiting, color: '#ff9f43' },
    { name: 'ดำเนินการ', value: stats.inprogress, color: '#4285f4' },
    { name: 'ยกเลิก', value: stats.cancelled, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const hospData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(t => {
      const h = (t.hospital || t.sourceUnit || 'ไม่ระบุ').replace('โรงพยาบาล', 'รพ.');
      map.set(h, (map.get(h) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filtered]);

  const channelData = useMemo(() => {
    const map = new Map<string, number>();
    const labels: Record<string, string> = { mobile: 'Mobile App', agency: 'ผ่าน รพ.สต.', hospital: 'ผ่านโรงพยาบาล' };
    filtered.forEach(t => {
      const ch = t.channel || 'mobile';
      map.set(ch, (map.get(ch) || 0) + 1);
    });
    return Array.from(map.entries()).map(([ch, value]) => ({ name: labels[ch] || ch, value }));
  }, [filtered]);

  const filterColor = STATUS_CONFIG[filter]?.hex || '#49358E';

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">รายละเอียด Tele-med</p>
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
            { label: 'ทั้งหมด', value: stats.total, icon: Video, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'เสร็จสิ้น', value: stats.completed, icon: CheckCircle2, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
            { label: 'รอสาย', value: stats.waiting, icon: Clock, iconColor: 'text-[#ff9f43]', iconBg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'ยกเลิก', value: stats.cancelled, icon: XCircle, iconColor: 'text-[#EA5455]', iconBg: 'bg-rose-50', border: 'border-rose-100' },
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

        {/* Hospital + Channel */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <Building2 className="text-[#7066A9]" size={18} /> หน่วยงาน & ช่องทาง
          </h3>
          {/* Hospitals */}
          <div className="space-y-2.5 mb-4">
            <p className="text-[14px] text-[#7066A9] font-bold">โรงพยาบาล/หน่วยบริการ</p>
            {hospData.map(h => {
              const maxV = hospData[0]?.value || 1;
              const pct = Math.round((h.value / maxV) * 100);
              return (
                <div key={h.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] text-[#37286A] truncate">{h.name}</span>
                    <span className="text-[16px] font-black text-[#37286A] shrink-0">{h.value}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: filterColor }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Channels */}
          {channelData.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-[#F4F0FF]">
              <p className="text-[14px] text-[#7066A9] font-bold">ช่องทาง</p>
              {channelData.map(ch => (
                <div key={ch.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-[#7066A9]" />
                    <span className="text-[16px] text-[#37286A]">{ch.name}</span>
                  </div>
                  <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{ch.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session list */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Video className="text-[#7066A9]" size={18} /> รายการ Tele-med
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E3E0F0] text-[#7066A9]">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบรายการ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.slice(0, 20).map(t => {
                const sc = getStatusConfig(t.status);
                const channelIcon = t.channel === 'agency' ? Building2 : t.channel === 'hospital' ? Monitor : Phone;
                const channelLabel = t.channel === 'agency' ? `Via Host (${t.sourceUnit || 'ผ่านหน่วยงาน'})` : t.channel === 'hospital' ? (t.hospital || 'โรงพยาบาล') : `Direct (ผู้ป่วยเชื่อมต่อเอง)`;
                const channelColor = t.channel === 'agency' ? 'text-[#28c76f]' : t.channel === 'hospital' ? 'text-[#7367f0]' : 'text-[#28c76f]';
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