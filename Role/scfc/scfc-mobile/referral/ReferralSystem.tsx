import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Building2,
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Users,
  CheckCircle2,
  Send,
  PieChart as PieChartIcon,
  XCircle,
  Eye
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { PieChart, Pie, Cell } from 'recharts';
import { ReferralList } from "./ReferralList";
import { ReferralDetailMobile, ReferralCase } from "./ReferralDetailMobile";
import { PATIENTS_DATA, REFERRAL_DATA } from "../../../../data/patientData";
import { MOCK_CAPACITY, HOSPITAL_PROVINCE_MAP, matchHospitalFilter as matchHospital, getProvinceFromHospital as getProvince } from "../../../../data/themeConfig";
import { useDragScroll } from '../components/useDragScroll';

// Drilldown imports
import { RefDrilldownView, buildFlatReferrals, FlatReferral } from './DrillDown/shared';
import { UrgencyDrilldown } from './DrillDown/UrgencyDrilldown';
import { CapacityDrilldown } from './DrillDown/CapacityDrilldown';
import { OverdueDrilldown } from './DrillDown/OverdueDrilldown';

// ── Purple Theme (mobile) ──
// Primary: #49358E, Medium: #7066A9, Dark: #37286A
// Light: #E3E0F0, #D2CEE7, #F4F0FF

// Map shared REFERRAL_DATA → mobile ReferralCase shape
const buildCases = (): ReferralCase[] => REFERRAL_DATA.map((r: any) => {
  const urgencyMap: Record<string, 'ปกติ' | 'เร่งด่วน' | 'ฉุกเฉิน'> = {
    'Routine': 'ปกติ', 'Urgent': 'เร่งด่วน', 'Emergency': 'ฉุกเฉิน'
  };
  const statusMap: Record<string, string> = {
    'Pending': 'รอการตอบรับ', 'Accepted': 'นัดหมายแล้ว', 'Completed': 'เสร็จสิ้น',
    'Rejected': 'ถูกปฏิเสธ', 'Canceled': 'ยกเลิก'
  };
  return {
    id: r.id,
    patientName: r.patientName || r.name || '-',
    hn: r.patientHn || r.hn || '-',
    sourceHospital: r.sourceHospital || r.hospital || '-',
    destHospital: r.destinationHospital || '-',
    status: statusMap[r.status] || r.status || 'รอการตอบรับ',
    urgency: urgencyMap[r.urgency] || 'ปกติ',
    requestDate: r.referralDate || r.date || '-',
    isBottleneck: r.status === 'Pending',
    history: (r.logs || []).map((l: any) => ({ date: l.date, action: l.description, user: l.actor })),
  };
});

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ["ทุกหน่วยงาน", "รพ.มหาราชนครเชียงใหม่", "รพ.นครพิงค์", "รพ.ฝาง", "รพ.จอมทอง", "รพ.เชียงรายประชานุเคราะห์", "รพ.แม่จัน"];

export default function ReferralSystem({ onBack, initialHN }: { onBack?: () => void, initialHN?: string }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail'>('dashboard');
  const [selectedCase, setSelectedCase] = useState<ReferralCase | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialHN || "");
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [selectedHospital, setSelectedHospital] = useState("ทุกหน่วยงาน");
  const [isMounted, setIsMounted] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  // Drilldown state
  const [drilldown, setDrilldown] = useState<RefDrilldownView>(null);

  const statsDrag = useDragScroll();
  const chartsDrag = useDragScroll();

  useEffect(() => { setIsMounted(true); }, []);

  const REFERRAL_CASES = useMemo(() => buildCases(), []);

  // ═══ Raw referral data ═══
  const rawReferrals = useMemo(() => (REFERRAL_DATA || []).map((r: any) => ({
    ...r,
    id: r.id || `REF-${Math.random().toString(36).substr(2, 6)}`,
    patientName: r.patientName || r.name || 'ไม่ระบุ',
    hn: r.hn || r.patientHn || '-',
    sourceHospital: r.sourceHospital || r.hospital || '-',
    destinationHospital: r.destinationHospital || '-',
    status: r.status || 'Pending',
    urgency: r.urgency || 'Routine',
    date: r.date || r.referralDate || '-',
  })), []);

  // ═══ Filtered referrals (by province & hospital — match source OR destination) ═══
  const filteredReferrals = useMemo(() => {
    return rawReferrals.filter((r: any) => {
      const srcHosp = r.sourceHospital || '';
      const destHosp = r.destinationHospital || '';
      // Province match
      if (selectedProvince !== 'ทุกจังหวัด') {
        const srcProv = getProvince(srcHosp);
        const destProv = getProvince(destHosp);
        if (srcProv !== selectedProvince && destProv !== selectedProvince) return false;
      }
      // Hospital match
      if (selectedHospital !== 'ทุกหน่วยงาน') {
        if (!matchHospital(srcHosp, selectedHospital) && !matchHospital(destHosp, selectedHospital)) return false;
      }
      return true;
    });
  }, [rawReferrals, selectedProvince, selectedHospital]);

  // ═══ Flat referrals for drilldowns (filtered) ═══
  const flatReferrals: FlatReferral[] = useMemo(() => {
    return filteredReferrals.map((r: any) => {
      const patient = PATIENTS_DATA.find(
        (p: any) => p.hn === (r.patientHn || r.hn) || p.name === (r.patientName || r.name)
      );
      return {
        id: r.id,
        patientName: r.patientName,
        hn: r.hn,
        image: patient?.image || '',
        sourceHospital: r.sourceHospital,
        destinationHospital: r.destinationHospital,
        status: r.status,
        urgency: r.urgency,
        date: r.date,
        reason: r.reason || r.diagnosis || '-',
        province: patient?.province || 'เชียงใหม่',
      };
    });
  }, [filteredReferrals]);

  // ═══ Stats (from filtered data) ═══
  const stats = useMemo(() => {
    const total = filteredReferrals.length;
    const pending = filteredReferrals.filter((r: any) => r.status === 'Pending').length;
    const accepted = filteredReferrals.filter((r: any) => r.status === 'Accepted').length;
    const rejected = filteredReferrals.filter((r: any) => r.status === 'Rejected').length;
    const examined = filteredReferrals.filter((r: any) => r.status === 'Examined' || r.status === 'Completed').length;
    const treated = filteredReferrals.filter((r: any) => r.status === 'Treated').length;
    return { total, pending, accepted, rejected, examined, treated };
  }, [filteredReferrals]);

  // ═══ Pie data (from filtered stats) ═══
  const pieData = useMemo(() => [
    { name: 'รอตอบรับ', value: stats.pending, color: '#4285f4' },
    { name: 'รอรับตัว', value: stats.accepted, color: '#ff6d00' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
    { name: 'ตรวจแล้ว', value: stats.examined, color: '#00cfe8' },
    { name: 'รักษาแล้ว', value: stats.treated, color: '#28c76f' },
  ], [stats]);

  // ═══ Urgency breakdown (from filtered data) ═══
  const urgencyData = useMemo(() => {
    return ['Emergency', 'Urgent', 'Routine'].map(urg => {
      const count = filteredReferrals.filter((r: any) => r.urgency === urg).length;
      const labels: Record<string, string> = { Emergency: 'ฉุกเฉิน', Urgent: 'เร่งด่วน', Routine: 'ปกติ' };
      const colors: Record<string, string> = { Emergency: '#ea5455', Urgent: '#ff9f43', Routine: '#28c76f' };
      return { key: urg, label: labels[urg], count, color: colors[urg] };
    });
  }, [filteredReferrals]);

  // ═══ Pending wait-time breakdown (overdue analysis) ═══
  const pendingWaitData = useMemo(() => {
    const TODAY = new Date('2026-02-17');
    const getDays = (dateStr: string) => {
      if (!dateStr || dateStr === '-') return 0;
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? 0 : Math.max(0, Math.floor((TODAY.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)));
    };
    const pendingRefs = filteredReferrals.filter((r: any) => r.status === 'Pending');
    const critical = pendingRefs.filter((r: any) => getDays(r.date || r.referralDate) > 7).length;
    const warning = pendingRefs.filter((r: any) => { const d = getDays(r.date || r.referralDate); return d > 3 && d <= 7; }).length;
    const normal = pendingRefs.filter((r: any) => getDays(r.date || r.referralDate) <= 3).length;
    const total = pendingRefs.length;
    return [
      { key: 'critical', label: 'รอมากกว่า 7 วัน', count: critical, color: '#ea5455' },
      { key: 'warning',  label: 'รอ 3-7 วัน',      count: warning,  color: '#ff9f43' },
      { key: 'normal',   label: 'รอไม่เกิน 3 วัน',  count: normal,   color: '#28c76f' },
    ];
  }, [filteredReferrals]);

  const pendingTotal = useMemo(() => pendingWaitData.reduce((sum, d) => sum + d.count, 0), [pendingWaitData]);

  // ═══ Hospital load data (from filtered data) ═══
  const hospitalLoadData = useMemo(() => {
    // Patients per hospital (filtered)
    const filteredPatients = PATIENTS_DATA.filter((p: any) => {
      const hosp = p.hospital || '';
      const matchesProv = selectedProvince === 'ทุกจังหวัด' || getProvince(hosp) === selectedProvince;
      const matchesHosp = matchHospital(hosp, selectedHospital);
      return matchesProv && matchesHosp;
    });
    const hospPatients = new Map<string, number>();
    filteredPatients.forEach((p: any) => {
      const h = p.hospital || '-';
      if (h !== '-') hospPatients.set(h, (hospPatients.get(h) || 0) + 1);
    });

    // Incoming referrals from filtered data
    const incomingRefs = new Map<string, number>();
    filteredReferrals.forEach((r: any) => {
      if (r.status === 'Pending' || r.status === 'Accepted') {
        const dest = r.destinationHospital || '-';
        if (dest !== '-') incomingRefs.set(dest, (incomingRefs.get(dest) || 0) + 1);
      }
    });

    const allH = new Set([...hospPatients.keys(), ...incomingRefs.keys()]);
    return Array.from(allH).map(h => {
      const current = hospPatients.get(h) || 0;
      const incoming = incomingRefs.get(h) || 0;
      const capacity = MOCK_CAPACITY[h] || 15;
      const total = current + incoming;
      const percent = Math.round((total / capacity) * 100);
      const shortName = h.replace('โรงพยาบาล', 'รพ.').trim();
      return {
        name: shortName.length > 14 ? shortName.slice(0, 12) + '..' : shortName,
        fullName: h, current, incoming, total, capacity, percent,
        level: (percent >= 90 ? 'danger' : percent >= 70 ? 'warning' : 'safe') as 'danger' | 'warning' | 'safe',
      };
    }).sort((a, b) => b.percent - a.percent);
  }, [filteredReferrals, selectedProvince, selectedHospital]);

  // ═══ Filtered patients for bottom section ═══
  const filteredPatientsList = useMemo(() => {
    return PATIENTS_DATA.filter((p: any) => {
      const hosp = p.hospital || '';
      const matchesProv = selectedProvince === 'ทุกจังหวัด' || getProvince(hosp) === selectedProvince;
      const matchesHosp = matchHospital(hosp, selectedHospital);
      return matchesProv && matchesHosp;
    });
  }, [selectedProvince, selectedHospital]);

  // Filtered referral cases for list view
  const filteredCases = useMemo(() => REFERRAL_CASES.filter(ref => {
    const matchesSearch = !searchQuery ||
      ref.patientName.includes(searchQuery) ||
      ref.hn.includes(searchQuery) ||
      ref.id.includes(searchQuery);
    return matchesSearch;
  }), [searchQuery, REFERRAL_CASES]);

  const handleSelectCase = (item: ReferralCase) => {
    setSelectedCase(item);
    setCurrentView('detail');
  };

  const scrollDashboard = (direction: 'left' | 'right') => {
    if (chartsDrag.ref.current) {
      chartsDrag.ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  // --- Sub-views ---
  if (currentView === 'detail' && selectedCase) {
    return <ReferralDetailMobile referral={selectedCase} onBack={() => setCurrentView('list')} />;
  }
  if (currentView === 'list') {
    return (
      <ReferralList
        data={filteredCases}
        onSelect={handleSelectCase}
        onBack={() => setCurrentView('dashboard')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreate={() => console.log("Create Referral Clicked")}
      />
    );
  }

  // ═══ Drill-down views ═══
  if (drilldown && drilldown.type === 'urgency') {
    return (
      <UrgencyDrilldown
        referrals={flatReferrals}
        filter={drilldown.filter}
        label={drilldown.label}
        onBack={() => setDrilldown(null)}
        onSelectReferral={() => setDrilldown(null)}
      />
    );
  }
  if (drilldown && drilldown.type === 'capacity') {
    return (
      <CapacityDrilldown
        referrals={flatReferrals}
        hospitalName={drilldown.hospitalName}
        onBack={() => setDrilldown(null)}
        onSelectReferral={() => setDrilldown(null)}
      />
    );
  }
  if (drilldown && drilldown.type === 'overdue') {
    return (
      <OverdueDrilldown
        referrals={flatReferrals}
        filter={drilldown.filter}
        label={drilldown.label}
        onBack={() => setDrilldown(null)}
        onSelectReferral={() => setDrilldown(null)}
      />
    );
  }

  // --- Dashboard View ---
  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        {onBack && (
          <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-white text-[18px] font-bold">ส่งต่อผู้ป่วย</h1>
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

        {/* --- Stats Summary — horizontal drag-scrollable --- */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          <div className="bg-white px-4 py-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0"><Send size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.total}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ส่งตัวทั้งหมด</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Clock size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.pending}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">รอตอบรับ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><AlertTriangle size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.accepted}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">รอรับตัว</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><XCircle size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.rejected}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ปฏิเสธ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-cyan-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0"><Activity size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.examined}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ตรวจแล้ว</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-green-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0"><CheckCircle2 size={20} /></div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.treated}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">รักษาแล้ว</p>
            </div>
          </div>
        </div>

        {/* --- แดชบอร์ด: สถิติสถานะการส่งตัว Pie Chart (standalone, no drilldown) --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
              <PieChartIcon className="text-[#7066A9]" size={13} /> สถิติสถานะการส่งตัว
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

        {/* --- ข้อมูลส่งตัว (drag-scrollable) --- */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 uppercase tracking-wider">
              <Activity className="text-[#7066A9]" size={14} /> ข้อมูลส่งตัว
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
            {/* ══ Card A: ผู้ป่วยรอตอบรับเกินกำหนด (filtered, cards pattern) ══ */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="text-[#7066A9]" size={13} /> ระยะเวลารอตอบรับ
                </h3>
                <span className="text-[16px] font-bold text-white bg-[#49358E] px-1.5 py-0.5 rounded-full">{pendingTotal} รายการ</span>
              </div>
              <div className="p-3 space-y-2.5 flex-1">
                {pendingWaitData.map(w => (
                  <div key={w.key} className="p-2.5 rounded-lg bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: w.color }}></div>
                        <span className="text-[16px] font-bold text-[#37286A]">{w.label}</span>
                      </div>
                      <span className="text-[16px] text-[#7066A9] shrink-0 ml-2">{w.count} รายการ</span>
                    </div>
                    <div className="w-full h-2 bg-[#E3E0F0] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pendingTotal > 0 ? Math.round((w.count / pendingTotal) * 100) : 0}%`, backgroundColor: w.color }}></div>
                    </div>
                  </div>
                ))}
                {/* Summary */}
                <div className="pt-2 mt-1 border-t border-[#F4F0FF] flex items-center justify-between px-1">
                  <span className="text-[16px] text-[#7066A9]">รวมทั้งหมด</span>
                  <span className="text-[16px] font-black text-[#49358E]">{pendingTotal} รายการ</span>
                </div>
              </div>
              {/* ดูรายละเอียด button */}
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'overdue', filter: 'all', label: 'ผู้ป่วยรอตอบรับเกินกำหนด' }); }}
                  className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                >
                  <Eye size={16} />
                  ดูรายละเอียด
                </button>
              </div>
            </Card>

            {/* ══ Card B: ความจุโรงพยาบาล (filtered, 2 items + "+X เพิ่มเติม") ══ */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <Building2 className="text-[#7066A9]" size={13} /> ความจุโรงพยาบาล
                </h3>
                <span className="text-[16px] font-bold text-white bg-[#49358E] px-1.5 py-0.5 rounded-full">{hospitalLoadData.length} แห่ง</span>
              </div>
              {hospitalLoadData.length > 0 ? (
                <div className="p-3 space-y-2.5 flex-1">
                  {hospitalLoadData.slice(0, 2).map(h => (
                    <div key={h.fullName} className="p-2.5 rounded-lg bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[16px] font-bold text-[#37286A] truncate flex-1">{h.name}</span>
                        <span className={cn(
                          "text-[14px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2",
                          h.level === 'danger' ? "bg-[#ea5455]/10 text-[#ea5455]" :
                          h.level === 'warning' ? "bg-[#ff9f43]/10 text-[#ff9f43]" :
                          "bg-[#28c76f]/10 text-[#28c76f]"
                        )}>{h.percent}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#E3E0F0] rounded-full overflow-hidden mb-1.5">
                        <div className="h-full rounded-full flex" style={{ width: `${Math.min(h.percent, 100)}%` }}>
                          <div className="h-full rounded-l-full" style={{
                            width: h.total > 0 ? `${(h.current / h.total) * 100}%` : '100%',
                            backgroundColor: h.level === 'danger' ? '#ea5455' : h.level === 'warning' ? '#ff9f43' : '#28c76f'
                          }}></div>
                          {h.incoming > 0 && (
                            <div className="h-full rounded-r-full opacity-60" style={{
                              width: `${(h.incoming / h.total) * 100}%`,
                              backgroundColor: '#ff6d00'
                            }}></div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[14px]">
                        <span className="text-[#7066A9]">{h.total}/{h.capacity} ราย</span>
                        {h.incoming > 0 && <span className="text-[#ff6d00] font-bold">+{h.incoming} รอส่งเข้า</span>}
                      </div>
                    </div>
                  ))}
                  {hospitalLoadData.length > 2 && (
                    <div className="text-center text-[14px] text-[#7066A9] py-1">
                      +{hospitalLoadData.length - 2} โรงพยาบาลเพิ่มเติม
                    </div>
                  )}
                  {/* Legend */}
                  <div className="flex items-center gap-3 pt-2 mt-1 border-t border-[#F4F0FF]">
                    <div className="flex items-center gap-1"><div className="w-2.5 h-1.5 rounded-sm bg-[#28c76f]"></div><span className="text-[14px] text-[#7066A9]">ปัจจุบัน</span></div>
                    <div className="flex items-center gap-1"><div className="w-2.5 h-1.5 rounded-sm bg-[#ff6d00] opacity-60"></div><span className="text-[14px] text-[#7066A9]">รอส่งเข้า</span></div>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex flex-col items-center gap-2 text-center flex-1">
                  <Building2 size={28} className="text-[#D2CEE7]" />
                  <p className="text-[16px] text-[#7066A9]">ไม่พบข้อมูลโรงพยาบาล</p>
                  <p className="text-[14px] text-[#D2CEE7]">สำหรับตัวกรองที่เลือก</p>
                </div>
              )}
              {/* ดูรายละเอียด button */}
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => {
                    if (!chartsDrag.hasMoved.current && hospitalLoadData[0]) {
                      setDrilldown({ type: 'capacity', hospitalName: hospitalLoadData[0].fullName });
                    }
                  }}
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
            <span className="text-[16px] font-black text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filteredPatientsList.length} ราย</span>
          </div>
          {filteredPatientsList.length > 0 ? (
            <>
              <div className="divide-y divide-[#F4F0FF]">
                {filteredPatientsList.slice(0, 5).map((p) => {
                  const hasReferral = (p.referralHistory || []).some((r: any) => r.status === 'Pending');
                  const hospShort = (p.hospital || '').replace('โรงพยาบาล', 'รพ.').trim();
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F0FF]/40 transition-colors cursor-pointer">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-full object-cover border-2 border-[#E3E0F0] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-[#37286A] truncate">{p.name}</span>
                          {hasReferral && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>}
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
              {filteredPatientsList.length > 5 && (
                <div className="p-3 border-t border-[#F4F0FF]">
                  <button className="w-full text-center text-[16px] font-bold text-[#49358E] hover:text-[#37286A] transition-colors py-1">
                    ดูทั้งหมด ({filteredPatientsList.length} ราย) →
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