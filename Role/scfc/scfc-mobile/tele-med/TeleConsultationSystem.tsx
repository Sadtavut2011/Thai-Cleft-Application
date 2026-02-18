import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Search, Video, Clock, Signal,
  MapPin, ArrowRight, ChevronDown, Building2,
  TrendingUp, Activity, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, BarChart3, Users,
  Smartphone, UserCheck,
  PieChart as PieChartIcon,
  Eye, AlertCircle
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  Tooltip as RechartsTooltip,
  AreaChart, Area
} from 'recharts';
import { TeleList } from "./TeleList";
import { TeleDetailMobile, TeleSession, Platform, TeleStatus } from "./TeleDetailMobile";
import { TeleADD } from "./TeleADD";
import { TELEMED_DATA, PATIENTS_DATA } from "../../../../data/patientData";
import { TeleDrilldownView, FlatSession, buildFlatSessions, buildProviderData } from './DrillDown/shared';
import { ChannelDrilldown } from './DrillDown/ChannelDrilldown';
import { PeakHoursDrilldown } from './DrillDown/PeakHoursDrilldown';
import { ProviderDrilldown } from './DrillDown/ProviderDrilldown';
import { useDragScroll } from '../components/useDragScroll';

// ── Purple Theme (mobile) ──
// Primary:   #49358E (dark), #7066A9 (medium), #37286A (darker)
// Light:     #E3E0F0, #D2CEE7, #F4F0FF (lightest)
// Icon accent: #e91e63 (telemed system)

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ["ทุกหน่วยงาน", "รพ.สต. บ้านหนองหอย", "รพ.ฝาง", "รพ.ลำพูน", "รพ.มหาราชนครเชียงใหม่"];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  waiting:   { label: 'รอสาย', color: '#ff9f43' },
  inprogress:{ label: 'ดำเนินการ', color: '#4285f4' },
  completed: { label: 'เสร็จสิ้น', color: '#28c76f' },
  cancelled: { label: 'ยกเลิก', color: '#ea5455' },
};

const getStatusKey = (status: string): string => {
  const s = (status || '').toLowerCase();
  if (['waiting', 'pending', 'scheduled'].includes(s)) return 'waiting';
  if (['inprogress', 'in_progress', 'working', 'active'].includes(s)) return 'inprogress';
  if (['completed', 'done', 'success', 'เสร็จสิ้น'].includes(s)) return 'completed';
  if (['cancelled', 'missed', 'rejected'].includes(s)) return 'cancelled';
  return 'completed';
};

// Map shared TELEMED_DATA → mobile TeleSession shape
const buildSessions = (): TeleSession[] => TELEMED_DATA.map((t: any) => {
  const platformMap: Record<string, Platform> = { 'zoom': 'Zoom', 'teams': 'MS Teams', 'mobile': 'Hospital Link' };
  const rawChannel = (t.channel || 'mobile').toLowerCase();
  const platform: Platform = platformMap[rawChannel] || 'Hospital Link';

  const rawStatus = (t.status || '').toLowerCase();
  let status: TeleStatus = 'Waiting';
  if (rawStatus === 'completed' || rawStatus === 'เสร็จสิ้น') status = 'Completed';
  else if (rawStatus === 'active' || rawStatus === 'กำลังปรึกษา') status = 'Active';
  else if (rawStatus === 'scheduled') status = 'Scheduled';

  return {
    id: t.id,
    patientName: t.patientName || t.name || '-',
    hn: t.hn || '-',
    sourceUnit: t.hospital || '-',
    specialist: t.doctor || '-',
    specialistHospital: t.agency_name || t.hospital || '-',
    platform,
    status,
    urgency: 'Normal' as const,
    linkStatus: status === 'Active' ? 'Live' as const : 'Checking' as const,
    waitingTime: Math.floor(Math.random() * 30) + 1,
    connectionStability: Math.floor(Math.random() * 20) + 80,
    startTime: t.date ? `${t.date} ${t.time || '09:00'}` : undefined,
  };
});

// Helper: calculate age
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

export default function TeleConsultationSystem({ onBack }: { onBack: () => void }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail' | 'create'>('dashboard');
  const [selectedSession, setSelectedSession] = useState<TeleSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [selectedHospital, setSelectedHospital] = useState("ทุกหน่วยงาน");
  const [isMounted, setIsMounted] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  const [drilldown, setDrilldown] = useState<TeleDrilldownView>(null);

  const statsDrag = useDragScroll();
  const chartsDrag = useDragScroll();

  useEffect(() => { setIsMounted(true); }, []);

  const TELE_SESSIONS = useMemo(() => buildSessions(), []);

  // Hospital matching helper for filters
  const matchHospital = (dataHospital: string, filterHospital: string): boolean => {
    if (filterHospital === 'ทุกหน่วยงาน') return true;
    const normalized = (dataHospital || '').replace('โรงพยาบาล', 'รพ.').trim();
    return normalized === filterHospital || dataHospital.includes(filterHospital.replace('รพ.', ''));
  };

  // Hospital → Province map
  const HOSPITAL_PROVINCE_MAP: Record<string, string> = {
    'โรงพยาบาลฝาง': 'เชียงใหม่',
    'โรงพยาบาลมหาราชนครเชียงใหม่': 'เชียงใหม่',
    'โรงพยาบาลนครพิงค์': 'เชียงใหม่',
    'โรงพยาบาลจอมทอง': 'เชียงใหม่',
    'โรงพยาบาลเชียงรายประชานุเคราะห์': 'เชียงราย',
    'โรงพยาบาลแม่จัน': 'เชียงราย',
    'โรงพยาบาลลำพูน': 'ลำพูน',
    'รพ.สต. บ้านหนองหอย': 'เชียงใหม่',
  };

  // Raw sessions for chart data (from TELEMED_DATA directly)
  const rawSessions = useMemo(() => (TELEMED_DATA || []).map((t: any) => ({
    ...t,
    id: t.id || `TM-${Math.random().toString(36).substr(2, 6)}`,
    patientName: t.patientName || t.name || 'ไม่ระบุ',
    hn: t.hn || t.patientHn || '-',
    status: t.status || 'completed',
    doctor: t.doctor || '-',
    channel: t.channel || 'mobile',
    datetime: t.datetime || t.date || '-',
    time: t.time || '09:00',
    title: t.title || t.detail || '-',
  })), []);

  // Filtered raw sessions by province/hospital
  const filteredRawSessions = useMemo(() => rawSessions.filter((t: any) => {
    const hosp = t.hospital || '';
    const matchesProv = selectedProvince === 'ทุกจังหวัด' || (HOSPITAL_PROVINCE_MAP[hosp] || '') === selectedProvince;
    const matchesHosp = matchHospital(hosp, selectedHospital);
    return matchesProv && matchesHosp;
  }), [rawSessions, selectedProvince, selectedHospital]);

  // Stats (filtered)
  const stats = useMemo(() => {
    const total = filteredRawSessions.length;
    const waiting = filteredRawSessions.filter((t: any) => getStatusKey(t.status) === 'waiting').length;
    const inprogress = filteredRawSessions.filter((t: any) => getStatusKey(t.status) === 'inprogress').length;
    const completed = filteredRawSessions.filter((t: any) => getStatusKey(t.status) === 'completed').length;
    const cancelled = filteredRawSessions.filter((t: any) => getStatusKey(t.status) === 'cancelled').length;
    return { total, waiting, inprogress, completed, cancelled };
  }, [filteredRawSessions]);

  // Pie data
  const pieData = useMemo(() => [
    { name: 'รอสาย', value: stats.waiting, color: '#ff9f43' },
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'ยกเลิก', value: stats.cancelled, color: '#ea5455' },
  ], [stats]);

  // Consultations breakdown (filtered)
  const consultBreakdown = useMemo(() => {
    const total = filteredRawSessions.length;
    return { daily: Math.max(1, Math.round(total / 30)), weekly: Math.max(1, Math.round(total / 4)), monthly: total };
  }, [filteredRawSessions]);

  // Channel breakdown (filtered)
  const channelBreakdown = useMemo(() => {
    return ['mobile', 'agency', 'hospital'].map(ch => ({
      key: ch,
      label: { mobile: 'Mobile App', agency: 'ผ่าน รพ.สต.', hospital: 'ผ่านโรงพยาบาล' }[ch] || ch,
      count: filteredRawSessions.filter((t: any) => (t.channel || 'mobile') === ch).length,
    }));
  }, [filteredRawSessions]);

  // Peak Hours data (filtered) — replaces Age Group
  const peakHoursData = useMemo(() => {
    const hourSlots = Array.from({ length: 12 }, (_, i) => ({
      hour: `${String(i + 7).padStart(2, '0')}:00`,
      count: 0,
    }));
    filteredRawSessions.forEach((t: any) => {
      const timeStr = (t.time || '').trim();
      const hourMatch = timeStr.match(/^(\d{1,2})/);
      if (hourMatch) {
        const h = parseInt(hourMatch[1], 10);
        if (h >= 7 && h <= 18) hourSlots[h - 7].count++;
      }
    });
    if (hourSlots.every(s => s.count === 0)) {
      const mock = [2, 5, 9, 8, 4, 3, 4, 6, 7, 3, 2, 1];
      hourSlots.forEach((s, i) => { s.count = mock[i]; });
    }
    return hourSlots;
  }, [filteredRawSessions]);

  const peakHour = useMemo(() => {
    return peakHoursData.reduce((max, h) => h.count > max.count ? h : max, peakHoursData[0]);
  }, [peakHoursData]);

  // Active providers per hospital (all data)
  const allProviders = useMemo(() => buildProviderData(), []);

  // Filtered providers by province/hospital
  const activeProviders = useMemo(() => {
    return allProviders.filter(prov => {
      const matchesProv = selectedProvince === 'ทุกจังหวัด' || (HOSPITAL_PROVINCE_MAP[prov.hospital] || '') === selectedProvince;
      const matchesHosp = matchHospital(prov.hospital, selectedHospital);
      return matchesProv && matchesHosp;
    });
  }, [allProviders, selectedProvince, selectedHospital]);

  // Flatten all staff from filtered providers into one list
  const allFilteredStaff = useMemo(() => {
    return activeProviders.flatMap(prov =>
      [...prov.doctors, ...prov.nurses].map(s => ({
        ...s,
        hospitalShort: prov.shortName,
      }))
    );
  }, [activeProviders]);

  const filteredSessions = useMemo(() => TELE_SESSIONS.filter(s => {
    const matchesSearch = !searchQuery || s.patientName.includes(searchQuery) || s.hn.includes(searchQuery);
    return matchesSearch;
  }), [searchQuery, TELE_SESSIONS]);

  const handleSelectSession = (session: TeleSession) => {
    setSelectedSession(session);
    setCurrentView('detail');
  };

  // Scroll dashboard charts
  const scrollDashboard = (direction: 'left' | 'right') => {
    if (chartsDrag.ref.current) {
      chartsDrag.ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  // ═══ Drill-down: build FlatSession[] for drilldown components ═══
  const flatSessions: FlatSession[] = useMemo(() => buildFlatSessions(), []);

  // Channel drilldown
  if (drilldown && drilldown.type === 'channel') {
    return (
      <ChannelDrilldown
        sessions={flatSessions}
        filter={drilldown.filter}
        label={drilldown.label}
        onBack={() => setDrilldown(null)}
        onSelectSession={(s) => {
          setDrilldown(null);
          // find matching TeleSession
          const match = TELE_SESSIONS.find(ts => ts.hn === s.hn);
          if (match) handleSelectSession(match);
        }}
      />
    );
  }

  // Peak Hours drilldown (replaces Age Group)
  if (drilldown && drilldown.type === 'peakHours') {
    return (
      <PeakHoursDrilldown
        sessions={flatSessions}
        onBack={() => setDrilldown(null)}
        onSelectSession={(s) => {
          setDrilldown(null);
          const match = TELE_SESSIONS.find(ts => ts.hn === s.hn);
          if (match) handleSelectSession(match);
        }}
      />
    );
  }

  // Provider drilldown
  if (drilldown && drilldown.type === 'provider') {
    return (
      <ProviderDrilldown
        sessions={flatSessions}
        filter={drilldown.filter}
        label={drilldown.label}
        onBack={() => setDrilldown(null)}
        onSelectSession={(s) => {
          setDrilldown(null);
          // find matching TeleSession
          const match = TELE_SESSIONS.find(ts => ts.hn === s.hn);
          if (match) handleSelectSession(match);
        }}
      />
    );
  }

  // --- Sub-views ---
  if (currentView === 'create') {
    return <TeleADD onBack={() => setCurrentView('list')} onSave={(data) => { console.log("Saved:", data); setCurrentView('list'); }} />;
  }
  if (currentView === 'detail' && selectedSession) {
    return <TeleDetailMobile session={selectedSession} onBack={() => setCurrentView('list')} />;
  }
  if (currentView === 'list') {
    return <TeleList data={filteredSessions} onSelect={handleSelectSession} onBack={() => setCurrentView('dashboard')} searchQuery={searchQuery} onSearchChange={setSearchQuery} onCreate={() => setCurrentView('create')} />;
  }

  // --- Dashboard View ---
  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
      {/* Header - Purple */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white text-[18px] font-bold">Tele-Consult</h1>
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
                    <button key={p} onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedProvince === p ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>{p}</button>
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
                    <button key={h} onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedHospital === h ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>{h}</button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="pt-1">
            <Button onClick={() => setCurrentView('list')} className="w-full bg-[#49358E] hover:bg-[#37286A] text-white rounded-xl h-12 text-base font-bold shadow-md shadow-[#49358E]/20 flex items-center justify-center gap-2 transition-all">
              ดูรายการทั้งหมด <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        {/* --- Stats Summary (4 cards) — horizontal drag-scrollable --- */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          <div className="bg-white px-4 py-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0">
              <Video size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.total}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ทั้งหมด</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-green-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.completed}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">เสร็จสิ้น</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.waiting}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">รอสาย</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.cancelled}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ยกเลิก</p>
            </div>
          </div>
        </div>

        {/* --- แดชบอร์ด: สถิติสถานะ Pie Chart (standalone, filter-responsive) --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
              <PieChartIcon className="text-[#7066A9]" size={13} /> สถิติสถานะ
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

        {/* --- จำนวนปรึกษา + ช่วงเวลา + บุคลากร (drag-scrollable) --- */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 uppercase tracking-wider">
              <Activity className="text-[#7066A9]" size={14} /> ข้อมูลการปรึกษา
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
            {/* Card A: จำนวนการปรึกษา + Channel */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <BarChart3 className="text-[#7066A9]" size={13} /> จำนวนการปรึกษา
                </h3>
              </div>
              <div className="p-3 space-y-3 flex-1">
                {[
                  { label: 'รายวัน (เฉลี่ย)', value: consultBreakdown.daily, unit: 'ครั้ง/วัน', color: '#49358E' },
                  { label: 'รายสัปดาห์', value: consultBreakdown.weekly, unit: 'ครั้ง/สัปดาห์', color: '#7066A9' },
                  { label: 'รายเดือน (ทั้งหมด)', value: consultBreakdown.monthly, unit: 'ครั้ง/เดือน', color: '#37286A' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[#F4F0FF] last:border-0">
                    <span className="text-[16px] font-bold text-[#7066A9]">{item.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[18px] font-black text-[#37286A]">{item.value}</span>
                      <span className="text-[16px] text-[#7066A9]">{item.unit}</span>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-[#F4F0FF] space-y-1.5">
                  <p className="text-[16px] font-bold text-[#7066A9]">แยกตามช่องทาง</p>
                  {channelBreakdown.map(ch => (
                    <div key={ch.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Smartphone size={11} className="text-[#7066A9]" />
                        <span className="text-[16px] text-[#37286A]">{ch.label}</span>
                      </div>
                      <span className="text-[16px] font-black text-[#37286A]">{ch.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-4 pb-4 mt-auto">
                <button
                  onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'channel', filter: 'all', label: 'จำนวนการปรึกษา' }); }}
                  className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                >
                  <Eye size={16} />
                  ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* Card B: ช่วงเวลาหนาแน่น — Peak Hours */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="text-[#7066A9]" size={13} /> ช่วงเวลาหนาแน่น
                </h3>
                {peakHour && (
                  <span className="text-[16px] font-bold text-white bg-[#49358E] px-1.5 py-0.5 rounded-full">
                    Peak: {peakHour.hour}
                  </span>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex-1" style={{ width: '100%', minHeight: 180, minWidth: 0 }}>
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={peakHoursData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="peakGradTeleMob" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#49358E" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#49358E" stopOpacity={0.03} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="hour" tick={{ fontSize: 16, fill: '#7066A9' }} interval={2} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 16, fill: '#7066A9' }} allowDecimals={false} axisLine={false} tickLine={false} />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '16px' }}
                          formatter={(val: any) => [`${val} เซสชัน`, 'จำนวน']}
                        />
                        <Area type="monotone" dataKey="count" stroke="#49358E" fill="url(#peakGradTeleMob)" strokeWidth={2} dot={{ fill: '#49358E', r: 2.5, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-[#F4F0FF] animate-pulse rounded-lg" />
                  )}
                </div>
                {peakHour && peakHour.count > 0 && (
                  <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-[#F4F0FF] border border-[#E3E0F0]">
                    <AlertCircle size={14} className="text-[#49358E] shrink-0" />
                    <span className="text-[14px] text-[#37286A]">
                      หนาแน่นที่สุด: <span className="font-bold text-[#49358E]">{peakHour.hour} น.</span> ({peakHour.count} เซสชัน)
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 pb-4 mt-auto">
                <button
                  onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'peakHours', filter: 'all', label: 'ช่วงเวลาหนาแน่น Tele-med' }); }}
                  className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                >
                  <Eye size={16} />
                  ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* Card C: บุคลากรที่ออนไลน์ */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <UserCheck className="text-[#7066A9]" size={13} /> บุคลากรที่ออนไลน์
                </h3>
                <span className="text-[16px] font-bold text-white bg-[#49358E] px-1.5 py-0.5 rounded-full">{allFilteredStaff.length} คน</span>
              </div>
              {allFilteredStaff.length > 0 ? (
                <div className="p-3 space-y-2.5 flex-1">
                  {allFilteredStaff.slice(0, 2).map((staff) => (
                    <div key={staff.id} className="p-2.5 rounded-lg bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", staff.online ? "bg-green-500" : "bg-gray-300")}></div>
                        <span className="text-[16px] font-bold text-[#37286A] flex-1 min-w-0 truncate">{staff.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "text-[14px] px-2 py-0.5 rounded-full font-bold",
                          staff.role === 'doctor' ? "bg-[#49358E]/10 text-[#49358E]" : "bg-[#00cfe8]/10 text-[#00cfe8]"
                        )}>
                          {staff.role === 'doctor' ? 'แพทย์' : 'พยาบาล'}
                        </span>
                        <span className="text-[14px] text-[#7066A9]">{staff.specialty || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Building2 size={12} className="text-[#7066A9]" />
                        <span className="text-[14px] text-[#7066A9]">{staff.hospitalShort}</span>
                        {staff.activePatients > 0 && (
                          <span className="text-[14px] font-bold text-[#49358E] ml-auto">{staff.activePatients} ผู้ป่วย</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {allFilteredStaff.length > 2 && (
                    <div className="text-center text-[14px] text-[#7066A9] py-1">
                      +{allFilteredStaff.length - 2} คนเพิ่มเติม
                    </div>
                  )}
                  {/* Summary */}
                  <div className="pt-2 mt-1 border-t border-[#F4F0FF] flex items-center justify-between px-1">
                    <span className="text-[16px] text-[#7066A9]">ออนไลน์</span>
                    <span className="text-[16px] font-black text-[#28c76f]">{allFilteredStaff.filter(s => s.online).length}/{allFilteredStaff.length} คน</span>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center gap-2 text-center flex-1">
                  <Users size={28} className="text-[#D2CEE7]" />
                  <p className="text-[16px] text-[#7066A9]">ไม่พบข้อมูลบุคลากร</p>
                  <p className="text-[14px] text-[#D2CEE7]">สำหรับตัวกรองที่เลือก</p>
                </div>
              )}
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'provider', filter: 'all', label: 'บุคลากรที่ออนไลน์' }); }}
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
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D2CEE7]"></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}