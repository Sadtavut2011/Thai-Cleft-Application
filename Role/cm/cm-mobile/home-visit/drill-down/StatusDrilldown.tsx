import React, { useMemo } from 'react';
import {
  ChevronLeft, Home, CheckCircle2, Clock, XCircle,
  Share2, Handshake, Building2, ChevronRight
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { SYSTEM_ICON_COLORS } from '../../../../../data/themeConfig';
import { FlatVisit, STATUS_CONFIG, getStatusConfig, formatThaiShortDate } from './shared';
import VisitTypeIcon from '../../../../../imports/Icon-4061-1646';

const ICON = SYSTEM_ICON_COLORS.homeVisit;

interface Props {
  visits: FlatVisit[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectVisit: (v: FlatVisit) => void;
}

export function StatusDrilldown({ visits, filter, label, onBack, onSelectVisit }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return visits;
    const cfg = STATUS_CONFIG[filter];
    if (!cfg) return visits;
    return visits.filter(v => getStatusConfig(v.status) === cfg);
  }, [visits, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.Completed).length,
    pending: filtered.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.Pending).length,
    inProgress: filtered.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.InProgress || getStatusConfig(v.status) === STATUS_CONFIG.WaitVisit).length,
    rejected: filtered.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.Rejected).length,
    delegated: filtered.filter(v => (v.type || '').toLowerCase() === 'delegated').length,
    joint: filtered.filter(v => (v.type || '').toLowerCase() !== 'delegated').length,
  }), [filtered]);

  const pieData = [
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'รอการตอบรับ', value: stats.pending, color: '#ff9f43' },
    { name: 'รอเยี่ยม/ดำเนินการ', value: stats.inProgress, color: '#00cfe8' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const hospData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(v => {
      const h = (v.hospital || 'อื่นๆ').replace('โรงพยาบาล', 'รพ.').trim();
      map.set(h, (map.get(h) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const filterColor = STATUS_CONFIG[filter]?.hex || '#49358E';

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Mobile Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <Home className="w-5 h-5 text-white" />
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] truncate">{label}</h1>
          <p className="text-white/70 text-[14px]">
            {filter === 'all' ? 'ภาพรวมทั้งหมด' : `กรอง: ${STATUS_CONFIG[filter]?.label || filter}`}
          </p>
        </div>
        <span className="text-white text-[14px] px-3 py-1 rounded-full shrink-0" style={{ backgroundColor: filterColor }}>
          {filtered.length}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'ทั้งหมด', value: stats.total, icon: Home, color: ICON.text, bg: ICON.bg },
            { label: 'เสร็จสิ้น', value: stats.completed, icon: CheckCircle2, color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
            { label: 'ฝากเยี่ยม', value: stats.delegated, icon: Share2, color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/10' },
            { label: 'เยี่ยมร่วม', value: stats.joint, icon: Handshake, color: 'text-[#00cfe8]', bg: 'bg-[#00cfe8]/10' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border-none shadow-sm p-3 flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", s.bg)}>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div>
                <p className="text-[14px] text-[#6a7282]">{s.label}</p>
                <p className="font-black text-[#37286A] text-[18px]">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
            <h3 className="text-[16px] text-[#37286A] flex items-center gap-2">
              สัดส่วนสถานะ
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative" style={{ width: 140, height: 140 }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 14 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-black text-[#37286A] text-[18px]">{stats.total}</span>
                  <span className="text-[12px] text-[#6a7282]">รายการ</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[14px] text-[#6a7282]">{item.name}</span>
                    </div>
                    <span className="text-[16px] text-[#5e5873]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hospital Breakdown */}
        {hospData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
            <h3 className="text-[16px] text-[#37286A] flex items-center gap-2">
              <Building2 className={cn("w-4 h-4", ICON.text)} /> แยกตามโรงพยาบาล
            </h3>
            {hospData.map(h => (
              <div key={h.name} className="flex items-center justify-between p-3 bg-[#F4F0FF]/50 rounded-xl border border-[#E3E0F0]">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Building2 size={14} className="text-[#49358E] shrink-0" />
                  <span className="text-[16px] text-[#5e5873] truncate">{h.name}</span>
                </div>
                <span className="font-black text-[#37286A] text-[18px] ml-2">{h.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Visit List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[16px] text-[#37286A]">รายการเยี่ยมบ้าน</h3>
            <span className="text-[12px] text-[#49358E] bg-[#F4F0FF] px-2.5 py-0.5 rounded-full border border-[#C4BFFA]">{filtered.length} รายการ</span>
          </div>

          {filtered.slice(0, 20).map((v) => {
            const sc = getStatusConfig(v.status);
            return (
              <div
                key={v.id}
                className="bg-white p-3 rounded-xl border border-[#E3E0F0] hover:border-[#C4BFFA] transition-all cursor-pointer active:scale-[0.98]"
                onClick={() => onSelectVisit(v)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                        {v.patientName || v.name}
                      </h3>
                      <div className="mt-0.5">
                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                          HN: {v.patientId || v.hn}
                        </span>
                      </div>
                    </div>
                    <div className={cn("px-3 py-1 rounded-[10px]", sc.bg)}>
                      <span className={cn("font-['IBM_Plex_Sans_Thai'] font-medium text-[12px]", sc.color)}>
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-[16px] h-[16px]">
                        <VisitTypeIcon />
                      </div>
                      <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[16px]">
                        {v.rph || 'ไม่ระบุหน่วยบริการ'}
                      </span>
                    </div>
                    <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                      {formatThaiShortDate(v.requestDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#6a7282]">
              <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-[16px]">ไม่พบรายการ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
