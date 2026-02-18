// ===== VisitTypeDrilldown (Mobile) =====
// Full-page drill-down: ประเภทการเยี่ยมบ้านตามโรงพยาบาล
// Shows Delegated vs Joint visit breakdown per hospital → รพ.สต. → patient list

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Share2,
  Handshake,
  Building2,
  MapPin,
  Users,
  Calendar,
  Activity,
  User,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { HOME_VISIT_DATA, PATIENTS_DATA } from '../../../../../data/patientData';
import { FlatVisit, getStatusConfig, formatThaiShortDate } from './shared';

// ── Purple Theme (mobile) ──
const THEME = {
  header: 'bg-[#7066a9]',
  darkPurple: '#37286A',
  mediumPurple: '#7066A9',
  btnPrimary: 'bg-[#49358E]',
  lightBg: '#F4F0FF',
  border: '#E3E0F0',
  borderActive: '#C4BFFA',
  cardBorder: 'border-[#E3E0F0]',
};

// ── Icon colors (system colors retained) ──
const ICON = {
  bg: 'bg-[#ff9f43]/10',
  text: 'text-[#ff9f43]',
};

interface VisitTypeHospitalData {
  hospital: string;
  rphs: {
    name: string;
    delegated: number;
    joint: number;
    total: number;
    visits: VisitWithPatient[];
  }[];
  delegated: number;
  joint: number;
  total: number;
}

interface VisitWithPatient {
  id: string;
  patientName: string;
  patientId: string;
  patientImage: string;
  type: string;
  status: string;
  requestDate: string;
  rph: string;
}

interface VisitTypeDrilldownProps {
  visits: FlatVisit[];
  onBack?: () => void;
  onSelectVisit?: (visit: FlatVisit) => void;
}

export function VisitTypeDrilldown({ visits, onBack, onSelectVisit }: VisitTypeDrilldownProps) {
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null);
  const [expandedRph, setExpandedRph] = useState<string | null>(null);

  // Build patient image lookup from PATIENTS_DATA (hn → image)
  const patientImageMap = useMemo(() => {
    const map = new Map<string, string>();
    PATIENTS_DATA.forEach((p: any) => {
      if (p.hn) map.set(p.hn, p.image || '');
      if (p.name) map.set(p.name, p.image || '');
    });
    return map;
  }, []);

  // Build HOME_VISIT_DATA image lookup (hn → patientImage)
  const hvImageMap = useMemo(() => {
    const map = new Map<string, string>();
    HOME_VISIT_DATA.forEach((v: any) => {
      if (v.hn && v.patientImage) map.set(v.hn, v.patientImage);
      if (v.patientName && v.patientImage) map.set(v.patientName, v.patientImage);
    });
    return map;
  }, []);

  const getPatientImage = (name: string, hn: string): string => {
    return hvImageMap.get(hn) || hvImageMap.get(name) || patientImageMap.get(hn) || patientImageMap.get(name) || '';
  };

  // Build rph → parent hospital mapping AND collect visits with patient details
  const visitTypeData = useMemo<VisitTypeHospitalData[]>(() => {
    const rphToHospital = new Map<string, string>();
    PATIENTS_DATA.forEach((p: any) => {
      const rph = p.responsibleHealthCenter || p.hospitalInfo?.responsibleRph || '';
      const hosp = p.hospital || '';
      if (rph && hosp) rphToHospital.set(rph, hosp);
    });

    const hospMap = new Map<string, Map<string, {
      delegated: number; joint: number; total: number;
      visits: VisitWithPatient[];
    }>>();

    visits.forEach((v) => {
      const rph = v.rph || '-';
      const parentHosp = rphToHospital.get(rph) || v.hospital || 'อื่นๆ';
      const isDelegated = (v.type || '').toLowerCase() === 'delegated';

      if (!hospMap.has(parentHosp)) hospMap.set(parentHosp, new Map());
      const rphMap = hospMap.get(parentHosp)!;
      if (!rphMap.has(rph)) rphMap.set(rph, { delegated: 0, joint: 0, total: 0, visits: [] });
      const entry = rphMap.get(rph)!;
      if (isDelegated) { entry.delegated++; } else { entry.joint++; }
      entry.total++;
      entry.visits.push({
        id: v.id,
        patientName: v.patientName || v.name || 'ไม่ระบุชื่อ',
        patientId: v.patientId || v.hn || '-',
        patientImage: getPatientImage(v.patientName || v.name || '', v.patientId || v.hn || ''),
        type: v.type || 'Joint',
        status: v.status || 'Pending',
        requestDate: v.requestDate || v.date || '-',
        rph: rph,
      });
    });

    return Array.from(hospMap.entries())
      .map(([hospital, rphMap]) => {
        const rphs = Array.from(rphMap.entries())
          .map(([rphName, data]) => ({ name: rphName, ...data }))
          .sort((a, b) => b.total - a.total);
        const totalDelegated = rphs.reduce((s, r) => s + r.delegated, 0);
        const totalJoint = rphs.reduce((s, r) => s + r.joint, 0);
        return { hospital, rphs, delegated: totalDelegated, joint: totalJoint, total: totalDelegated + totalJoint };
      })
      .sort((a, b) => b.total - a.total);
  }, [visits]);

  const totalDelegated = useMemo(() => visits.filter((v) => (v.type || '').toLowerCase() === 'delegated').length, [visits]);
  const totalJoint = useMemo(() => visits.length - totalDelegated, [visits, totalDelegated]);

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Mobile Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        {onBack && (
          <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
        )}
        <Share2 className="w-5 h-5 text-white" />
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] truncate">ประเภทการเยี่ยมบ้าน</h1>
          <p className="text-white/70 text-[16px] truncate">แยกฝากเยี่ยม / ลงเยี่ยมร่วม ตามโรงพยาบาล</p>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* ── Summary Stat Cards ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total */}
          <div className="bg-white p-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0">
              <Home size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] text-[#7066A9] leading-tight">ทั้งหมด</p>
              <p className="text-[20px] font-black text-[#37286A] leading-tight">{visits.length}</p>
            </div>
          </div>

          {/* Delegated */}
          <div className="bg-white p-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ff9f43]/10 text-[#ff9f43] flex items-center justify-center shrink-0">
              <Share2 size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] text-[#7066A9] leading-tight truncate">ฝากเยี่ยม</p>
              <div className="flex items-baseline gap-0.5">
                <p className="text-[20px] font-black text-[#37286A] leading-tight">{totalDelegated}</p>
                <span className="text-[14px] text-[#7066A9]">({visits.length > 0 ? Math.round((totalDelegated / visits.length) * 100) : 0}%)</span>
              </div>
            </div>
          </div>

          {/* Joint */}
          <div className="bg-white p-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#00cfe8]/10 text-[#00cfe8] flex items-center justify-center shrink-0">
              <Handshake size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[16px] text-[#7066A9] leading-tight truncate">เยี่ยมร่วม</p>
              <div className="flex items-baseline gap-0.5">
                <p className="text-[20px] font-black text-[#37286A] leading-tight">{totalJoint}</p>
                <span className="text-[14px] text-[#7066A9]">({visits.length > 0 ? Math.round((totalJoint / visits.length) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hospital Cards with drill-down ── */}
        <div className="space-y-3">
          {visitTypeData.map((hosp) => {
            const isExpanded = expandedHospital === hosp.hospital;
            const hospShort = hosp.hospital.replace('โรงพยาบาล', 'รพ.').trim();
            const delegatedPct = hosp.total > 0 ? Math.round((hosp.delegated / hosp.total) * 100) : 0;
            const jointPct = hosp.total > 0 ? Math.round((hosp.joint / hosp.total) * 100) : 0;

            return (
              <div key={hosp.hospital} className={cn("bg-white rounded-2xl shadow-sm border transition-all overflow-hidden", isExpanded ? "border-[#C4BFFA] shadow-md" : "border-[#E3E0F0]")}>
                {/* Hospital header — clickable */}
                <div
                  className="p-4 flex items-center gap-3 cursor-pointer active:bg-[#F4F0FF]/50 transition-colors"
                  onClick={() => { setExpandedHospital(isExpanded ? null : hosp.hospital); setExpandedRph(null); }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F4F0FF] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#49358E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-bold text-[#37286A] text-[18px] truncate">{hospShort}</p>
                      <span className="text-[16px] px-2 py-0.5 rounded-full bg-[#F4F0FF] text-[#49358E] font-bold shrink-0">{hosp.total} เคส</span>
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#ff9f43] rounded-l-full transition-all" style={{ width: `${delegatedPct}%` }}></div>
                        <div className="h-full bg-[#00cfe8] rounded-r-full transition-all" style={{ width: `${jointPct}%` }}></div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff9f43]"></div>
                          <span className="text-[16px] text-[#7066A9]">{hosp.delegated}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#00cfe8]"></div>
                          <span className="text-[16px] text-[#7066A9]">{hosp.joint}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[16px] text-[#7066A9] mt-1">รพ.สต. ในสังกัด {hosp.rphs.length} แห่ง</p>
                  </div>
                  <ChevronRight size={18} className={cn("text-[#D2CEE7] shrink-0 transition-transform", isExpanded && "rotate-90")} />
                </div>

                {/* Expanded: รพ.สต. detail */}
                {isExpanded && (
                  <div className="border-t border-[#E3E0F0] bg-[#F4F0FF]/30 p-4 space-y-3">
                    {/* Legend */}
                    <div className="flex items-center gap-4 mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff9f43]"></div>
                        <span className="text-[16px] text-[#7066A9]">ฝากเยี่ยม</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#00cfe8]"></div>
                        <span className="text-[16px] text-[#7066A9]">ลงเยี่ยมร่วม</span>
                      </div>
                    </div>

                    {hosp.rphs.map((rph) => {
                      const rDPct = rph.total > 0 ? Math.round((rph.delegated / rph.total) * 100) : 0;
                      const rJPct = rph.total > 0 ? Math.round((rph.joint / rph.total) * 100) : 0;
                      const isRphExpanded = expandedRph === `${hosp.hospital}::${rph.name}`;

                      return (
                        <div key={rph.name} className={cn("bg-white rounded-xl border transition-all overflow-hidden", isRphExpanded ? "border-[#C4BFFA] shadow-sm" : "border-[#E3E0F0] hover:border-[#C4BFFA]")}>
                          {/* รพ.สต. header — clickable to expand patient list */}
                          <div
                            className="p-3 cursor-pointer active:bg-[#F4F0FF]/40 transition-colors"
                            onClick={() => setExpandedRph(isRphExpanded ? null : `${hosp.hospital}::${rph.name}`)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-[#49358E]" />
                                <span className="text-[16px] font-bold text-[#5e5873]">{rph.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[16px] px-2 py-0.5 rounded-full bg-[#F4F0FF] text-[#49358E]">{rph.total} เคส</span>
                                <ChevronDown size={16} className={cn("text-[#D2CEE7] transition-transform", isRphExpanded && "rotate-180")} />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                                <div className="h-full bg-[#ff9f43] rounded-l-full" style={{ width: `${rDPct}%` }}></div>
                                <div className="h-full bg-[#00cfe8] rounded-r-full" style={{ width: `${rJPct}%` }}></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Share2 size={14} className="text-[#ff9f43]" />
                                <span className="text-[16px] text-[#7066A9]">ฝากเยี่ยม {rph.delegated}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Handshake size={14} className="text-[#00cfe8]" />
                                <span className="text-[16px] text-[#7066A9]">เยี่ยมร่วม {rph.joint}</span>
                              </div>
                            </div>
                          </div>

                          {/* Patient list — expanded */}
                          {isRphExpanded && rph.visits.length > 0 && (
                            <div className="border-t border-dashed border-[#E3E0F0] bg-[#F4F0FF]/20 divide-y divide-dashed divide-gray-100">
                              {rph.visits.map((pv) => {
                                const sc = getStatusConfig(pv.status);
                                const isDelegated = (pv.type || '').toLowerCase() === 'delegated';
                                const fallbackImg = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400';
                                const imgSrc = pv.patientImage && pv.patientImage !== 'null' ? pv.patientImage : fallbackImg;

                                return (
                                  <div
                                    key={pv.id}
                                    className="flex items-center gap-3 px-3 py-3 cursor-pointer active:bg-[#F4F0FF]/60 transition-colors"
                                    onClick={() => {
                                      const found = visits.find(v => v.id === pv.id);
                                      if (found && onSelectVisit) onSelectVisit(found);
                                    }}
                                  >
                                    {/* Patient avatar */}
                                    <img
                                      src={imgSrc}
                                      alt={pv.patientName}
                                      className="w-10 h-10 rounded-full object-cover border-2 border-[#E3E0F0] shrink-0"
                                      onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
                                    />
                                    {/* Patient info */}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-[#5e5873] text-[18px] truncate">{pv.patientName}</p>
                                      <p className="text-[16px] text-[#6a7282]">{pv.patientId}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        {/* Visit type badge */}
                                        {isDelegated ? (
                                          <span className="inline-flex items-center gap-1 text-[16px] px-2 py-0.5 rounded-[10px] bg-[#ff9f43]/15 text-[#ff9f43] font-bold">
                                            <Share2 size={12} /> ฝากเยี่ยม
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 text-[16px] px-2 py-0.5 rounded-[10px] bg-[#00cfe8]/15 text-[#00cfe8] font-bold">
                                            <Handshake size={12} /> เยี่ยมร่วม
                                          </span>
                                        )}
                                        {/* Status badge */}
                                        <span className={cn("text-[16px] px-2 py-0.5 rounded-[10px] font-bold", sc.bg, sc.color)}>
                                          {sc.label}
                                        </span>
                                      </div>
                                    </div>
                                    {/* Date + chevron */}
                                    <div className="flex flex-col items-end shrink-0 gap-1">
                                      <div className="flex items-center gap-1 text-[16px] text-[#7066A9]">
                                        <Calendar size={14} className="text-[#7367f0]" />
                                        <span>{formatThaiShortDate(pv.requestDate)}</span>
                                      </div>
                                      <ChevronRight size={14} className="text-[#D2CEE7]" />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {visitTypeData.length === 0 && (
            <div className="text-center py-16 text-[#6a7282]">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-[16px]">ไม่พบข้อมูลการเยี่ยมบ้าน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}