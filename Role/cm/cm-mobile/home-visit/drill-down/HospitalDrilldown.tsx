import React, { useMemo } from 'react';
import {
  ChevronLeft, Home, CheckCircle2, ClipboardList,
  Building2, MapPin, Share2, Handshake, ChevronRight
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { SYSTEM_ICON_COLORS } from '../../../../../data/themeConfig';
import { FlatVisit, getStatusConfig, formatThaiShortDate } from './shared';
import VisitTypeIcon from '../../../../../imports/Icon-4061-1646';

const ICON = SYSTEM_ICON_COLORS.homeVisit;

interface Props {
  visits: FlatVisit[];
  hospitalName: string;
  onBack: () => void;
  onSelectVisit: (v: FlatVisit) => void;
}

export function HospitalDrilldown({ visits, hospitalName, onBack, onSelectVisit }: Props) {
  const filtered = useMemo(() => {
    return visits.filter(v => {
      const h = (v.hospital || '').replace('โรงพยาบาล', 'รพ.').trim();
      return h === hospitalName || v.hospital === hospitalName || h.includes(hospitalName.replace('รพ.', '').replace('..', ''));
    });
  }, [visits, hospitalName]);

  const stats = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter(v => getStatusConfig(v.status).label === 'เสร็จสิ้น').length,
    delegated: filtered.filter(v => (v.type || '').toLowerCase() === 'delegated').length,
    joint: filtered.filter(v => (v.type || '').toLowerCase() !== 'delegated').length,
  }), [filtered]);

  const rphData = useMemo(() => {
    const map = new Map<string, { total: number; delegated: number; joint: number }>();
    filtered.forEach(v => {
      const r = v.rph || '-';
      if (!map.has(r)) map.set(r, { total: 0, delegated: 0, joint: 0 });
      const e = map.get(r)!;
      e.total++;
      if ((v.type || '').toLowerCase() === 'delegated') e.delegated++; else e.joint++;
    });
    return Array.from(map.entries()).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.total - a.total);
  }, [filtered]);

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Mobile Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <Building2 className="w-5 h-5 text-white" />
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] truncate">{hospitalName}</h1>
          <p className="text-white/70 text-[14px]">รายละเอียดการเยี่ยมบ้าน</p>
        </div>
        
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Hospital Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F4F0FF] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[#49358E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#37286A] text-[18px] truncate">{hospitalName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={16} className="text-[#7066A9] shrink-0" />
                <p className="text-[16px] text-[#7066A9] truncate">รายละเอียดการเยี่ยมบ้าน</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#F4F0FF] text-[#49358E] text-[16px] font-bold shrink-0">{filtered.length} รายการ</span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'ทั้งหมด', value: stats.total, icon: ClipboardList, color: ICON.text, bg: ICON.bg },
            { label: 'เสร็จสิ้น', value: stats.completed, icon: CheckCircle2, color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
            { label: 'ฝากเยี่ยม', value: stats.delegated, icon: Share2, color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/10' },
            { label: 'เยี่ยมร่วม', value: stats.joint, icon: Handshake, color: 'text-[#00cfe8]', bg: 'bg-[#00cfe8]/10' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border-none shadow-sm p-3 flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", s.bg)}>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div>
                <p className="text-[16px] text-[#6a7282]">{s.label}</p>
                <p className="font-black text-[#37286A] text-[18px]">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* RPH Breakdown */}
        {rphData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
            <h3 className="text-[16px] text-[#37286A] flex items-center gap-2">
              <MapPin className={cn("w-4 h-4", ICON.text)} /> รพ.สต. ในสังกัด ({rphData.length} แห่ง)
            </h3>

            {/* Legend */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff9f43]"></div>
                <span className="text-[14px] text-[#6a7282]">ฝากเยี่ยม</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#00cfe8]"></div>
                <span className="text-[14px] text-[#6a7282]">เยี่ยมร่วม</span>
              </div>
            </div>

            {rphData.map(r => {
              const dPct = r.total > 0 ? Math.round((r.delegated / r.total) * 100) : 0;
              const jPct = r.total > 0 ? Math.round((r.joint / r.total) * 100) : 0;
              return (
                <div key={r.name} className="p-3 bg-[#F4F0FF]/50 rounded-xl border border-[#E3E0F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[16px] text-[#5e5873]">{r.name}</span>
                    <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#F4F0FF] text-[#49358E]">{r.total} เคส</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2.5 bg-[#E3E0F0] rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#ff9f43] rounded-l-full" style={{ width: `${dPct}%` }}></div>
                      <div className="h-full bg-[#00cfe8] rounded-r-full" style={{ width: `${jPct}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-[14px] text-[#6a7282]">
                    <span className="flex items-center gap-1">
                      <Share2 size={12} className="text-[#ff9f43]" /> ฝากเยี่ยม {r.delegated}
                    </span>
                    <span className="flex items-center gap-1">
                      <Handshake size={12} className="text-[#00cfe8]" /> เยี่ยมร่วม {r.joint}
                    </span>
                  </div>
                </div>
              );
            })}
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
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-[16px]">ไม่พบรายการ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}