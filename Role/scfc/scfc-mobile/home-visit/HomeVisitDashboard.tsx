import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building2,
  ChevronDown,
  XCircle,
  Activity,
  PieChart as PieChartIcon,
  Share2,
  Handshake,
  ArrowLeft,
  Eye
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { PieChart, Pie, Cell } from 'recharts';
import { HOME_VISIT_DATA, PATIENTS_DATA } from "../../../../data/patientData";
import { HVDrilldownView, FlatVisit } from '../../../cm/cm-mobile/home-visit/drill-down/shared';
import { StatusDrilldown } from '../../../cm/cm-mobile/home-visit/drill-down/StatusDrilldown';
import { TeamDetailCard } from '../../../cm/cm-mobile/home-visit/drill-down/TeamDetailCard';
import { VisitTypeDrilldown } from '../../../cm/cm-mobile/home-visit/drill-down/VisitTypeDrilldown';
import { useDragScroll } from '../components/useDragScroll';

// ── Purple Theme (mobile) ──
// Primary:   #49358E (dark), #7066A9 (medium), #37286A (darker)
// Light:     #E3E0F0, #D2CEE7, #F4F0FF (lightest)

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ["ทุกหน่วยงาน", "รพ.มหาราชนครเชียงใหม่", "รพ.นครพิงค์", "รพ.ฝาง", "รพ.จอมทอง", "รพ.เชียงรายประชานุเคราะห์", "รพ.แม่จัน"];

// Hospital → Province mapping for filter logic
const HOSPITAL_PROVINCE_MAP: Record<string, string> = {
  'โรงพยาบาลมหาราชนครเชียงใหม่': 'เชียงใหม่',
  'โรงพยาบาลนครพิงค์': 'เชียงใหม่',
  'โรงพยาบาลฝาง': 'เชียงใหม่',
  'โรงพยาบาลจอมทอง': 'เชียงใหม่',
  'โรงพยาบาลเชียงรายประชานุเคราะห์': 'เชียงราย',
  'โรงพยาบาลแม่จัน': 'เชียงราย',
  'โรงพยาบาลลำพูน': 'ลำพูน',
  'โรงพยาบาลลำปาง': 'ลำปาง',
  'โรงพยาบาลแม่ฮ่องสอน': 'แม่ฮ่องสอน',
  'รพ.สต. บ้านหนองหอย': 'เชียงใหม่',
};

/** Match hospital name from data (full "โรงพยาบาลฝาง") with filter short form ("รพ.ฝาง") */
const matchHospital = (dataHospital: string, filterHospital: string): boolean => {
  if (filterHospital === 'ทุกหน่วยงาน') return true;
  const normalized = (dataHospital || '').replace('โรงพยาบาล', 'รพ.').trim();
  return normalized === filterHospital || dataHospital.includes(filterHospital.replace('รพ.', ''));
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  Pending:    { label: 'รอการตอบรับ', color: '#ff9f43' },
  WaitVisit:  { label: 'รอเยี่ยม',   color: '#f5a623' },
  InProgress: { label: 'ดำเนินการ',  color: '#00cfe8' },
  Completed:  { label: 'เสร็จสิ้น',  color: '#28c76f' },
  Rejected:   { label: 'ปฏิเสธ',    color: '#ea5455' },
  NotHome:    { label: 'ไม่อยู่',    color: '#B9B9C3' },
  NotAllowed: { label: 'ไม่อนุญาต', color: '#ea5455' },
};

const getStatusKey = (status: string): string => {
  const s = (status || '').toLowerCase();
  if (['inprogress', 'in_progress', 'working', 'ลงพื้นที่', 'ดำเนินการ'].includes(s)) return 'InProgress';
  if (['accepted', 'accept', 'รับงาน'].includes(s)) return 'WaitVisit';
  if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited'].includes(s)) return 'Completed';
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(s)) return 'Rejected';
  if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(s)) return 'WaitVisit';
  if (['nothome', 'not_home', 'ไม่อยู่'].includes(s)) return 'NotHome';
  if (['notallowed', 'not_allowed', 'ไม่อนุญาต'].includes(s)) return 'NotAllowed';
  return 'Pending';
};

export function HomeVisitDashboard({ onBack, onViewDetail, initialSearch }: { onBack?: () => void, onViewDetail?: (id: string) => void, initialSearch?: string }) {
  const [selectedProvince, setSelectedProvince] = useState<string>('ทุกจังหวัด');
  const [selectedHospital, setSelectedHospital] = useState<string>('ทุกหน่วยงาน');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [drilldown, setDrilldown] = useState<HVDrilldownView>(null);

  const statsDrag = useDragScroll();
  const chartsDrag = useDragScroll();

  useEffect(() => { setIsMounted(true); }, []);

  // ═══ Build visit list from HOME_VISIT_DATA ═══
  const visits = useMemo(() => {
    const source = HOME_VISIT_DATA && HOME_VISIT_DATA.length > 0 ? HOME_VISIT_DATA : [];
    return source.map((v: any) => ({
      ...v,
      id: v.id || `HV-${Math.random().toString(36).substr(2, 6)}`,
      patientName: v.patientName || v.name || 'ไม่ระบุชื่อ',
      patientId: v.patientId || v.hn || '-',
      type: v.type || 'Joint',
      rph: v.rph || v.provider || '-',
      status: v.status || 'Pending',
      requestDate: v.requestDate || v.date || '-',
      hospital: v.hospital || 'โรงพยาบาลฝาง',
      province: v.province || 'เชียงใหม่',
    }));
  }, []);

  // ═══ Filtered visits (by province & hospital) ═══
  const filteredVisits = useMemo(() => {
    return visits.filter((v: any) => {
      const hosp = v.hospital || '';
      const matchesProv = selectedProvince === 'ทุกจังหวัด' || (HOSPITAL_PROVINCE_MAP[hosp] || v.province || '') === selectedProvince;
      const matchesHosp = matchHospital(hosp, selectedHospital);
      return matchesProv && matchesHosp;
    });
  }, [visits, selectedProvince, selectedHospital]);

  // ═══ Stats (from filtered visits) ═══
  const stats = useMemo(() => {
    const total = filteredVisits.length;
    const pending = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'Pending').length;
    const waitVisit = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'WaitVisit').length;
    const inProgress = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'InProgress').length;
    const rejected = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'Rejected').length;
    const notHome = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'NotHome').length;
    const notAllowed = filteredVisits.filter((v: any) => getStatusKey(v.status) === 'NotAllowed').length;
    return { total, pending, waitVisit, inProgress, rejected, notHome, notAllowed };
  }, [filteredVisits]);

  // ═══ Pie data (from filtered stats) ═══
  const pieData = useMemo(() => [
    { name: 'รอตอบรับ', value: stats.pending, color: '#ff9f43' },
    { name: 'รอเยี่ยม', value: stats.waitVisit, color: '#f5a623' },
    { name: 'ดำเนินการ', value: stats.inProgress, color: '#00cfe8' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
    { name: 'ไม่อยู่', value: stats.notHome, color: '#B9B9C3' },
    { name: 'ไม่อนุญาต', value: stats.notAllowed, color: '#e74c3c' },
  ], [stats]);

  // ═══ Visit type data (from FILTERED visits) ═══
  const totalDelegated = useMemo(() => filteredVisits.filter((v: any) => (v.type || '').toLowerCase() === 'delegated').length, [filteredVisits]);
  const totalJoint = useMemo(() => filteredVisits.length - totalDelegated, [filteredVisits, totalDelegated]);

  // Visit type breakdown by hospital (filtered)
  const visitTypeData = useMemo(() => {
    const rphToHospital = new Map<string, string>();
    PATIENTS_DATA.forEach((p: any) => {
      const rph = p.responsibleHealthCenter || p.hospitalInfo?.responsibleRph || '';
      const hosp = p.hospital || '';
      if (rph && hosp) rphToHospital.set(rph, hosp);
    });

    const hospMap = new Map<string, { delegated: number; joint: number; total: number }>();
    filteredVisits.forEach((v: any) => {
      const rph = v.rph || '-';
      const parentHosp = rphToHospital.get(rph) || v.hospital || 'อื่นๆ';
      const shortHosp = parentHosp.replace('โรงพยาบาล', 'รพ.').trim();
      const isDelegated = (v.type || '').toLowerCase() === 'delegated';
      if (!hospMap.has(shortHosp)) hospMap.set(shortHosp, { delegated: 0, joint: 0, total: 0 });
      const entry = hospMap.get(shortHosp)!;
      if (isDelegated) { entry.delegated++; } else { entry.joint++; }
      entry.total++;
    });

    return Array.from(hospMap.entries())
      .map(([hospital, counts]) => ({ hospital, ...counts }))
      .sort((a, b) => b.total - a.total);
  }, [filteredVisits]);

  // ═══ Teams data (from FILTERED visits) ═══
  const teamsData = useMemo(() => {
    // Build PCU → parent hospital map from PATIENTS_DATA
    const pcuMap = new Map<string, { parentHospital: string; count: number }>();
    PATIENTS_DATA.forEach((p: any) => {
      const pcu = p.responsibleHealthCenter || p.hospitalInfo?.responsibleRph || '-';
      if (pcu === '-') return;
      // Apply same filter to patient data
      const hosp = p.hospital || '';
      const matchesProv = selectedProvince === 'ทุกจังหวัด' || (HOSPITAL_PROVINCE_MAP[hosp] || '') === selectedProvince;
      const matchesHosp = matchHospital(hosp, selectedHospital);
      if (!matchesProv || !matchesHosp) return;
      if (!pcuMap.has(pcu)) pcuMap.set(pcu, { parentHospital: hosp, count: 0 });
      pcuMap.get(pcu)!.count++;
    });

    // Count visits per RPH
    const visitCounts = new Map<string, number>();
    filteredVisits.forEach((v: any) => {
      const rph = v.rph || '-';
      visitCounts.set(rph, (visitCounts.get(rph) || 0) + 1);
    });

    const allKeys = new Set([...pcuMap.keys(), ...visitCounts.keys()]);
    return Array.from(allKeys)
      .filter(k => k !== '-')
      .map(k => ({
        name: k,
        parentHospital: (pcuMap.get(k)?.parentHospital || '-').replace('โรงพยาบาล', 'รพ.').trim(),
        visitCount: visitCounts.get(k) || 0,
        patientCount: pcuMap.get(k)?.count || 0,
      }))
      .sort((a, b) => b.visitCount - a.visitCount);
  }, [filteredVisits, selectedProvince, selectedHospital]);

  // ═══ Filtered patients for bottom section ═══
  const filteredPatients = useMemo(() => {
    return PATIENTS_DATA.filter((p: any) => {
      const hosp = p.hospital || '';
      const matchesProv = selectedProvince === 'ทุกจังหวัด' || (HOSPITAL_PROVINCE_MAP[hosp] || '') === selectedProvince;
      const matchesHosp = matchHospital(hosp, selectedHospital);
      return matchesProv && matchesHosp;
    });
  }, [selectedProvince, selectedHospital]);

  // Scroll dashboard charts
  const scrollDashboard = (direction: 'left' | 'right') => {
    if (chartsDrag.ref.current) {
      chartsDrag.ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  // ═══ Drill-down views ═══
  const flatVisits: FlatVisit[] = useMemo(() => filteredVisits.map((v: any) => ({
    id: v.id,
    patientName: v.patientName,
    patientId: v.patientId,
    patientAddress: v.patientAddress || '',
    type: v.type,
    rph: v.rph,
    status: v.status,
    requestDate: v.requestDate,
    hospital: v.hospital,
    province: v.province,
    note: v.note,
    name: v.patientName,
    hn: v.patientId,
    date: v.requestDate,
  })), [filteredVisits]);

  // Status drill-down
  if (drilldown && drilldown.type === 'status') {
    return (
      <StatusDrilldown
        visits={flatVisits}
        filter={drilldown.filter}
        label={drilldown.label}
        onBack={() => setDrilldown(null)}
        onSelectVisit={(v) => {
          setDrilldown(null);
          if (onViewDetail) onViewDetail(v.id);
        }}
      />
    );
  }

  // Team drill-down
  if (drilldown && drilldown.type === 'team') {
    return (
      <TeamDetailCard
        provinceFilter={selectedProvince === 'ทุกจังหวัด' ? 'ทั้งหมด' : selectedProvince}
        hospitalFilter={selectedHospital === 'ทุกหน่วยงาน' ? 'ทั้งหมด' : selectedHospital}
        onBack={() => setDrilldown(null)}
        onSelectVisit={(v: any) => {
          setDrilldown(null);
          if (onViewDetail) onViewDetail(v.id);
        }}
      />
    );
  }

  // Visit type drill-down
  if (drilldown && drilldown.type === 'visitType') {
    return (
      <VisitTypeDrilldown
        visits={flatVisits}
        onBack={() => setDrilldown(null)}
        onSelectVisit={(v: any) => {
          setDrilldown(null);
          if (onViewDetail) onViewDetail(v.id);
        }}
      />
    );
  }

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
      {/* Header - Purple */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        {onBack && (
          <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-white text-[18px] font-bold">เยี่ยมบ้าน</h1>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* --- Filter Section --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E3E0F0] flex flex-col gap-3">
          <div className="flex gap-2">
            {/* Province Filter */}
            <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
              <PopoverTrigger asChild>
                <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><MapPin size={18} /></div>
                  <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">{selectedProvince}</span>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><ChevronDown size={18} /></div>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-col">
                  {PROVINCES.map(p => (
                    <button
                      key={p}
                      onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }}
                      className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedProvince === p ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}
                    >{p}</button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Hospital Filter */}
            <Popover open={isHospitalOpen} onOpenChange={setIsHospitalOpen}>
              <PopoverTrigger asChild>
                <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><Building2 size={18} /></div>
                  <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">{selectedHospital}</span>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><ChevronDown size={18} /></div>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-col">
                  {HOSPITALS.map(h => (
                    <button
                      key={h}
                      onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }}
                      className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedHospital === h ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}
                    >{h}</button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="pt-1">
            <Button
              onClick={() => onViewDetail && onViewDetail('all')}
              className="w-full bg-[#49358E] hover:bg-[#37286A] text-white rounded-xl h-12 text-base font-bold shadow-md shadow-[#49358E]/20 flex items-center justify-center gap-2 transition-all"
            >
              ดูรายการทั้งหมด <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        {/* --- Stats Summary — horizontal drag-scrollable --- */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          <div className="bg-white px-4 py-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'all', label: 'ทั้งหมด' }); }}>
            <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0"><Home size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.total}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ทั้งหมด</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'Pending', label: 'รอตอบรับ' }); }}>
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Clock size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.pending}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">รอตอบรับ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-yellow-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'WaitVisit', label: 'รอเยี่ยม' }); }}>
            <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0"><Calendar size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.waitVisit}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">รอเยี่ยม</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-cyan-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'InProgress', label: 'ดำเนินการ' }); }}>
            <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0"><TrendingUp size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.inProgress}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ดำเนินการ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'Rejected', label: 'ปฏิเสธ' }); }}>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><XCircle size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.rejected}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ปฏิเสธ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'NotHome', label: 'ไม่อยู่' }); }}>
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0"><Home size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.notHome}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ไม่อยู่</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-red-200 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'NotAllowed', label: 'ไม่อนุญาต' }); }}>
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0"><AlertCircle size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.notAllowed}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ไม่อนุญาต</p>
            </div>
          </div>
        </div>

        {/* --- แดชบอร์ด: ภาพรวมสถานะ Pie Chart (standalone, no drilldown) --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
              <PieChartIcon className="text-[#7066A9]" size={13} /> ภาพรวมสถานะ
            </h3>
          </div>
          <div className="p-4 flex flex-col items-center gap-4">
            <div className="w-[160px] h-[160px] relative shrink-0" style={{ minWidth: 160, minHeight: 160 }}>
              {isMounted && (
                <PieChart width={160} height={160}>
                  <Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[22px] font-black text-[#37286A]">{stats.total}</span>
                <span className="text-[12px] text-[#7066A9]">ทั้งหมด</span>
              </div>
            </div>
            <div className="w-full space-y-2.5">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[16px] font-bold text-[#5e5873]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[16px] font-black text-[#37286A]">{item.value}</span>
                    <span className="text-[14px] text-[#7066A9]">({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* --- ข้อมูลเยี่ยมบ้าน (drag-scrollable) --- */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 uppercase tracking-wider">
              <Activity className="text-[#7066A9]" size={14} /> ข้อมูลเยี่ยมบ้าน
            </h3>
            <div className="flex items-center gap-1">
              <button onClick={() => scrollDashboard('left')} className="w-7 h-7 rounded-full bg-white border border-[#E3E0F0] flex items-center justify-center text-[#7066A9] hover:bg-[#F4F0FF] transition-colors shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => scrollDashboard('right')} className="w-7 h-7 rounded-full bg-white border border-[#E3E0F0] flex items-center justify-center text-[#7066A9] hover:bg-[#F4F0FF] transition-colors shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            ref={chartsDrag.ref}
            {...chartsDrag.handlers}
            className="flex gap-4 overflow-x-auto pb-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
          >
            {/* ══ Card A: ประเภทการเยี่ยม — ฝากเยี่ยม vs ลงเยี่ยมร่วม (filtered) ══ */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <Share2 className="text-[#7066A9]" size={13} /> ประเภทการเยี่ยม
                </h3>
              </div>
              <div className="p-3 space-y-3 flex-1">
                {/* Summary */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Share2 size={12} className="text-[#ff9f43]" />
                      <span className="text-[16px] text-[#7066A9]">ฝากเยี่ยม</span>
                    </div>
                    <span className="text-lg font-black text-[#37286A]">{totalDelegated}</span>
                  </div>
                  <div className="w-px h-10 bg-[#E3E0F0]"></div>
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Handshake size={12} className="text-[#00cfe8]" />
                      <span className="text-[16px] text-[#7066A9]">ลงเยี่ยมร่วม</span>
                    </div>
                    <span className="text-lg font-black text-[#37286A]">{totalJoint}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-[#ff9f43] rounded-l-full transition-all" style={{ width: `${filteredVisits.length > 0 ? (totalDelegated / filteredVisits.length) * 100 : 0}%` }}></div>
                    <div className="h-full bg-[#00cfe8] rounded-r-full transition-all" style={{ width: `${filteredVisits.length > 0 ? (totalJoint / filteredVisits.length) * 100 : 0}%` }}></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#ff9f43]"></div>
                      <span className="text-[16px] text-[#7066A9]">ฝากเยี่ยม</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-[#00cfe8]"></div>
                      <span className="text-[16px] text-[#7066A9]">ลงเยี่ยมร่วม</span>
                    </div>
                  </div>
                </div>

                {/* Top hospitals — show 2 + "+X เพิ่มเติม" */}
                {visitTypeData.length > 0 && (
                  <div className="pt-2 border-t border-[#F4F0FF] space-y-2">
                    <p className="text-[16px] text-[#7066A9] font-bold">แยกตามโรงพยาบาล</p>
                    {visitTypeData.slice(0, 2).map((hosp) => (
                      <div key={hosp.hospital} className="p-2.5 rounded-lg bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[16px] font-bold text-[#37286A] truncate">{hosp.hospital}</span>
                          <span className="text-[16px] text-[#7066A9] shrink-0 ml-2">{hosp.total} เคส</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] px-2 py-0.5 rounded-full bg-[#ff9f43]/15 text-[#ff9f43] font-bold">ฝากเยี่ยม {hosp.delegated}</span>
                          <span className="text-[14px] px-2 py-0.5 rounded-full bg-[#00cfe8]/15 text-[#00cfe8] font-bold">ร่วมเยี่ยม {hosp.joint}</span>
                        </div>
                      </div>
                    ))}
                    {visitTypeData.length > 2 && (
                      <div className="text-center text-[14px] text-[#7066A9] py-1">
                        +{visitTypeData.length - 2} โรงพยาบาลเพิ่มเติม
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* ดูรายละเอียด button */}
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'visitType' }); }}
                  className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                >
                  <Eye size={16} />
                  ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* ══ Card B: ทีมงาน/หน่วยบริการ (filtered, 2 items + "+X เพิ่มเติม") ══ */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <Users className="text-[#7066A9]" size={13} /> ทีมงาน/หน่วยบริการ
                </h3>
                <span className="text-[16px] font-bold text-white bg-[#49358E] px-1.5 py-0.5 rounded-full">{teamsData.length} แห่ง</span>
              </div>
              {teamsData.length > 0 ? (
                <div className="p-3 space-y-2.5 flex-1">
                  {teamsData.slice(0, 2).map((team) => (
                    <div key={team.name} className="p-2.5 rounded-lg bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-lg bg-[#F4F0FF] flex items-center justify-center shrink-0">
                          <Building2 size={13} className="text-[#49358E]" />
                        </div>
                        <span className="text-[16px] font-bold text-[#37286A] truncate flex-1">{team.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] px-2 py-0.5 rounded-full bg-[#49358E]/10 text-[#49358E] font-bold">{team.visitCount} เคส</span>
                        <span className="text-[14px] px-2 py-0.5 rounded-full bg-[#00cfe8]/10 text-[#00cfe8] font-bold">{team.patientCount} ผู้ป่วย</span>
                        <span className="text-[14px] text-[#7066A9] ml-auto truncate">{team.parentHospital}</span>
                      </div>
                    </div>
                  ))}
                  {teamsData.length > 2 && (
                    <div className="text-center text-[14px] text-[#7066A9] py-1">
                      +{teamsData.length - 2} หน่วยเพิ่มเติม
                    </div>
                  )}
                  {/* Summary */}
                  <div className="pt-2 mt-1 border-t border-[#F4F0FF] flex items-center justify-between px-1">
                    <span className="text-[16px] text-[#7066A9]">เคสรวม</span>
                    <span className="text-[16px] font-black text-[#49358E]">{teamsData.reduce((s, t) => s + t.visitCount, 0)} เคส</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center gap-2 text-center flex-1">
                  <Users size={28} className="text-[#D2CEE7]" />
                  <p className="text-[16px] text-[#7066A9]">ไม่พบทีมงาน</p>
                  <p className="text-[14px] text-[#D2CEE7]">สำหรับตัวกรองที่เลือก</p>
                </div>
              )}
              {/* ดูรายละเอียด button */}
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'team' }); }}
                  className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                >
                  <Eye size={16} />
                  ดูรายละเอียด
                </button>
              </div>
            </Card>
          </div>

          {/* Scroll dots indicator */}
          <div className="flex justify-center gap-1.5 mt-2">
            {[0, 1].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D2CEE7]"></div>
            ))}
          </div>
        </div>

        {/* --- ผู้ป่วยที่อยู่ในการดูแล (filtered) --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 uppercase tracking-wider">
              <Users className="text-[#7066A9]" size={14} /> ผู้ป่วยที่อยู่ในการดูแล
            </h3>
            <span className="text-[16px] font-black text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filteredPatients.length} ราย</span>
          </div>
          {filteredPatients.length > 0 ? (
            <>
              <div className="divide-y divide-[#F4F0FF]">
                {filteredPatients.slice(0, 5).map((p) => {
                  const hasVisit = (p.visitHistory || []).some((v: any) => v.status === 'Pending' || v.status === 'WaitVisit');
                  const hospShort = (p.hospital || '').replace('โรงพยาบาล', 'รพ.').trim();
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F0FF]/40 transition-colors cursor-pointer" onClick={() => onViewDetail && onViewDetail(p.id)}>
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-full object-cover border-2 border-[#E3E0F0] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-[#37286A] truncate">{p.name}</span>
                          {hasVisit && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[16px] text-[#7066A9] font-medium">{p.hn}</span>
                          <span className="text-[16px] text-[#b9b9c3]">&bull;</span>
                          <span className="text-[16px] text-[#7066A9] font-medium truncate">{hospShort}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#D2CEE7] shrink-0" />
                    </div>
                  );
                })}
              </div>
              {filteredPatients.length > 5 && (
                <div className="p-3 border-t border-[#F4F0FF]">
                  <button className="w-full text-center text-[16px] font-bold text-[#49358E] hover:text-[#37286A] transition-colors py-1">
                    ดูทั้งหมด ({filteredPatients.length} ราย) →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 flex flex-col items-center gap-2 text-center">
              <Users size={28} className="text-[#D2CEE7]" />
              <p className="text-[16px] text-[#7066A9]">ไม่พบข้อมูลผู้ป่วย</p>
              <p className="text-[14px] text-[#D2CEE7]">สำหรับตัวกรองที่เลือก</p>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}