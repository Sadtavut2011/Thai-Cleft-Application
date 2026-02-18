import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
  Building2,
  ArrowRight,
  Clock,
  AlertCircle,
  ArrowLeft,
  Search,
  MapPin,
  ChevronDown,
  Filter
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ReferralCase } from "./ReferralDetailMobile";
import { SuperFilter } from "../components/SuperFilter";
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE } from "../../../../components/shared/ThaiCalendarDrawer";
import { PATIENTS_DATA, getPatientByHn } from "../../../../data/patientData";
import { ReferralDetail } from "../../../cm/cm-mobile/patient/History/ReferralDetail";
import { PatientDetailView } from "../../../cm/cm-mobile/patient/detail/PatientDetailView";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";
import { toast } from "sonner@2.0.3";

const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

// Hospital → Province map
const HOSPITAL_PROVINCE_MAP: Record<string, string> = {
  'โรงพยาบาลฝาง': 'เชียงใหม่', 'โรงพยาบาลมหาราชนครเชียงใหม่': 'เชียงใหม่',
  'โรงพยาบาลนครพิงค์': 'เชียงใหม่', 'โรงพยาบาลจอมทอง': 'เชียงใหม่',
  'โรงพยาบาลเชียงรายประชานุเคราะห์': 'เชียงราย', 'โรงพยาบาลแม่จัน': 'เชียงราย',
  'โรงพยาบาลลำพูน': 'ลำพูน',
  'รพ.มหาราชนครเชียงใหม่': 'เชียงใหม่', 'รพ.นครพิงค์': 'เชียงใหม่',
  'รพ.ฝาง': 'เชียงใหม่', 'รพ.จอมทอง': 'เชียงใหม่',
  'รพ.เชียงรายประชานุเคราะห์': 'เชียงราย', 'รพ.แม่จัน': 'เชียงราย',
};

const matchHospital = (dataHospital: string, filterHospital: string): boolean => {
  if (filterHospital === 'All') return true;
  const normalized = (dataHospital || '').replace('โรงพยาบาล', 'รพ.').trim();
  return normalized === filterHospital || dataHospital.includes(filterHospital.replace('รพ.', ''));
};

// Extended referral type with original data
type ExtendedReferral = ReferralCase & { _province: string; _hospital: string; _originalReferral: any; _patientHn: string };

// ═══ Build ReferralCase[] from PATIENTS_DATA ═══
const buildReferralsFromPatients = (): ExtendedReferral[] => {
  const urgencyMap: Record<string, 'ปกติ' | 'เร่งด่วน' | 'ฉุกเฉิน'> = {
    'Routine': 'ปกติ', 'Urgent': 'เร่งด่วน', 'Emergency': 'ฉุกเฉิน',
  };
  const statusMap: Record<string, string> = {
    'Pending': 'รอการตอบรับ', 'Accepted': 'ตอบรับแล้ว', 'Completed': 'รักษาแล้ว',
    'Rejected': 'ปฏิเสธ', 'Canceled': 'ยกเลิก',
  };
  return PATIENTS_DATA.flatMap((p: any) => {
    return (p.referralHistory || []).map((ref: any, idx: number) => {
      const statusKey = ref.status || 'Pending';
      return {
        id: `REF-${p.hn}-${idx}`,
        patientName: p.name,
        hn: p.hn,
        sourceHospital: ref.from || p.hospital || '-',
        destHospital: ref.to || '-',
        status: statusMap[statusKey] || statusKey,
        urgency: urgencyMap[ref.urgency] || 'ปกติ',
        requestDate: ref.rawDate || ref.date || '-',
        responseTime: undefined,
        isBottleneck: statusKey === 'Pending',
        history: [],
        _province: p.province || HOSPITAL_PROVINCE_MAP[p.hospital] || '',
        _hospital: p.hospital || '',
        _patientHn: p.hn,
        _originalReferral: {
          ...ref,
          from: ref.from || p.hospital || '-',
          to: ref.to || '-',
          doctor: ref.doctor || p.doctor || '-',
          reason: ref.title || ref.reason || '-',
          title: ref.title || '-',
        },
      };
    });
  });
};

// ═══ Patient History Wrapper for SCFC ═══
function PatientHistoryWrapper({ patient, onBack }: { patient: any; onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-[50001] bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300">
      <style>{`
        .fixed.bottom-0.left-0.w-full.bg-white.z-50 { z-index: 50002 !important; }
      `}</style>
      <div className="bg-[#7066a9] shrink-0">
        <StatusBarIPhone16Main />
      </div>
      <PatientDetailView
        patient={patient}
        onBack={onBack}
        onEdit={() => {}}
        userRole="scfc"
      />
    </div>
  );
}

// --- Referral-specific filter sections ---
const REFERRAL_FILTER_SECTIONS = [
  {
    id: 'urgency',
    title: 'ความเร่งด่วน',
    options: [
      { id: 'ปกติ', label: 'ปกติ' },
      { id: 'เร่งด่วน', label: 'เร่งด่วน' },
      { id: 'ฉุกเฉิน', label: 'ฉุกเฉิน' },
    ]
  },
  {
    id: 'sourceHospital',
    title: 'โรงพยาบาลต้นทาง',
    options: HOSPITALS.map(h => ({ id: h, label: h }))
  },
  {
    id: 'destHospital',
    title: 'โรงพยาบาลปลายทาง',
    options: HOSPITALS.map(h => ({ id: h, label: h }))
  }
];

const REFERRAL_STATUS_PILLS = [
  { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#49358E] text-white shadow-md shadow-[#49358E]/20' },
  { id: 'รอการตอบรับ', label: 'รอตอบรับ', color: 'bg-blue-50 text-blue-600 border border-blue-200', activeColor: 'bg-blue-500 text-white shadow-md shadow-blue-200' },
  { id: 'ตอบรับแล้ว', label: 'ตอบรับแล้ว', color: 'bg-orange-50 text-orange-600 border border-orange-200', activeColor: 'bg-orange-500 text-white shadow-md shadow-orange-200' },
  { id: 'ปฏิเสธ', label: 'ปฏิเสธ', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
  { id: 'รักษาแล้ว', label: 'รักษาแล้ว', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
  { id: 'ส่งตัวกลับพื้นที่', label: 'ส่งตัวกลับ', color: 'bg-teal-50 text-teal-600 border border-teal-200', activeColor: 'bg-teal-500 text-white shadow-md shadow-teal-200' },
];

interface ReferralListProps {
  data?: ReferralCase[];
  onSelect: (item: ReferralCase) => void;
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreate?: () => void;
}

export function ReferralList({ 
  data, 
  onSelect, 
  onBack, 
  searchQuery, 
  onSearchChange,
  onCreate,
}: ReferralListProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  // Status pill + date filter
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Drag-to-scroll for status pills
  const statusScrollRef = useRef<HTMLDivElement>(null);
  const isDrag = useRef(false);
  const sX = useRef(0);
  const sL = useRef(0);
  const onMD = useCallback((e: React.MouseEvent) => { isDrag.current = true; sX.current = e.pageX - (statusScrollRef.current?.offsetLeft || 0); sL.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const onMM = useCallback((e: React.MouseEvent) => { if (!isDrag.current || !statusScrollRef.current) return; e.preventDefault(); statusScrollRef.current.scrollLeft = sL.current - (e.pageX - (statusScrollRef.current.offsetLeft || 0) - sX.current) * 1.5; }, []);
  const onMU = useCallback(() => { isDrag.current = false; }, []);
  const onTS = useCallback((e: React.TouchEvent) => { isDrag.current = true; sX.current = e.touches[0].pageX - (statusScrollRef.current?.offsetLeft || 0); sL.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const onTM = useCallback((e: React.TouchEvent) => { if (!isDrag.current || !statusScrollRef.current) return; statusScrollRef.current.scrollLeft = sL.current - (e.touches[0].pageX - (statusScrollRef.current.offsetLeft || 0) - sX.current) * 1.5; }, []);

  // Detail view state
  const [selectedRef, setSelectedRef] = useState<ExtendedReferral | null>(null);

  // Patient history view state
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const [historyPatient, setHistoryPatient] = useState<any>(null);

  // Build from PATIENTS_DATA
  const allReferrals = useMemo(() => buildReferralsFromPatients(), []);

  // Full filtering
  const localFilteredData = useMemo(() => {
    return allReferrals.filter((ref) => {
      const refProvince = ref._province || HOSPITAL_PROVINCE_MAP[ref.sourceHospital] || '';
      const matchesProvince = selectedProvince === 'All' || refProvince === selectedProvince;
      const matchesHosp = matchHospital(ref._hospital || ref.sourceHospital || '', selectedHospital);

      const term = (searchQuery || '').toLowerCase().trim();
      const matchesSearch = !term || ref.patientName.toLowerCase().includes(term) || ref.hn.toLowerCase().includes(term);

      // Status pill filter
      const matchesStatusPill = filterStatus === 'All' || ref.status === filterStatus;

      const urgencyFilter = activeFilters['urgency'];
      const sourceFilter = activeFilters['sourceHospital'];
      const destFilter = activeFilters['destHospital'];

      const matchesUrgency = !urgencyFilter?.length || urgencyFilter.includes(ref.urgency);
      const matchesSource = !sourceFilter?.length || sourceFilter.some(s => matchHospital(ref.sourceHospital, s));
      const matchesDest = !destFilter?.length || destFilter.some(d => matchHospital(ref.destHospital, d));

      return matchesProvince && matchesHosp && matchesSearch && matchesStatusPill && matchesUrgency && matchesSource && matchesDest;
    });
  }, [allReferrals, selectedProvince, selectedHospital, searchQuery, activeFilters, filterStatus]);

  const handleSuperFilterApply = (filters: Record<string, string[]>) => {
    const cleaned: Record<string, string[]> = {};
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) cleaned[key] = values;
    });
    setActiveFilters(cleaned);
  };

  const handleRemoveFilterChip = (sectionId: string, valueId: string) => {
    const newFilters = { ...activeFilters, [sectionId]: activeFilters[sectionId].filter(v => v !== valueId) };
    if (newFilters[sectionId].length === 0) delete newFilters[sectionId];
    setActiveFilters(newFilters);
  };

  // ═══ Patient History View ═══
  if (showPatientHistory && historyPatient) {
    return (
      <PatientHistoryWrapper
        patient={historyPatient}
        onBack={() => setShowPatientHistory(false)}
      />
    );
  }

  // ═══ Detail View — ReferralDetail from CM with SCFC role ═══
  if (selectedRef) {
    const patientRecord = getPatientByHn(selectedRef.hn);
    const patientObj = {
      name: selectedRef.patientName,
      hn: selectedRef.hn,
      image: patientRecord?.image,
      doctor: patientRecord?.doctor,
    };
    const referralObj = selectedRef._originalReferral;

    return (
      <ReferralDetail
        referral={referralObj}
        patient={patientObj}
        onBack={() => setSelectedRef(null)}
        role="scfc"
        onCancel={() => {
          toast.success('ยกเลิกการส่งตัวเรียบร้อย');
        }}
        onEdit={() => {
          toast.info('กำลังแก้ไขข้อมูลการส่งตัว...');
        }}
        onViewHistory={() => {
          const pt = getPatientByHn(selectedRef.hn);
          if (pt) {
            setHistoryPatient(pt);
            setShowPatientHistory(true);
          } else {
            setHistoryPatient({
              name: selectedRef.patientName,
              hn: selectedRef.hn,
              hospital: selectedRef.sourceHospital,
            });
            setShowPatientHistory(true);
          }
        }}
      />
    );
  }

  // ═══ List View ═══
  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
        {/* Header List View */}
        <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">รายการส่งตัว</h1>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Province & Hospital Filter Dropdowns */}
            <div className="flex gap-2">
              <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                <PopoverTrigger asChild>
                  <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><MapPin size={18} /></div>
                    <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">{selectedProvince === 'All' ? 'ทุกจังหวัด' : selectedProvince}</span>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><ChevronDown size={18} /></div>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  <div className="flex flex-col">
                    <button onClick={() => { setSelectedProvince('All'); setIsProvinceOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedProvince === 'All' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>ทุกจังหวัด</button>
                    {PROVINCES.map(p => (
                      <button key={p} onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedProvince === p ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>{p}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Popover open={isHospitalOpen} onOpenChange={setIsHospitalOpen}>
                <PopoverTrigger asChild>
                  <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><Building2 size={18} /></div>
                    <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">{selectedHospital === 'All' ? 'ทุกโรงพยาบาล' : selectedHospital}</span>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><ChevronDown size={18} /></div>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  <div className="flex flex-col">
                    <button onClick={() => { setSelectedHospital('All'); setIsHospitalOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedHospital === 'All' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>ทุกโรงพยาบาล</button>
                    {HOSPITALS.map(h => (
                      <button key={h} onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedHospital === h ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>{h}</button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search and Filter Row */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#C4BFFA] flex flex-col gap-3">
                 <div className="flex gap-2 w-full">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7367f0]" />
                        <Input 
                            placeholder="ค้นหาชื่อ, HN..." 
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 bg-[#F4F0FF]/30 border-[#C4BFFA] rounded-xl h-12 text-sm shadow-sm focus:ring-[#7367f0] focus:border-[#7367f0]" 
                        />
                    </div>
                     
                     <SuperFilter 
                        sections={REFERRAL_FILTER_SECTIONS}
                        activeFilters={activeFilters}
                        onApply={handleSuperFilterApply}
                        onClear={() => setActiveFilters({})}
                     />
                     <CalendarFilterButton filterDate={filterDate} onDateSelect={setFilterDate} accentColor="#49358E" drawerTitle="กรองวันที่" />
                 </div>
            </div>
            
            {/* Status Pills */}
            <div ref={statusScrollRef} className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1"
              onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onMU}>
              {REFERRAL_STATUS_PILLS.map((o) => (
                <button key={o.id} onClick={() => setFilterStatus(o.id)} className={cn("px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0", filterStatus === o.id ? o.activeColor : o.color)}>{o.label}</button>
              ))}
            </div>
            
            {/* Active Filters Display */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([sectionId, values]) => 
                        values.map(v => (
                            <span key={`${sectionId}-${v}`} className="bg-[#F4F0FF] text-[#7367f0] px-2 py-1 rounded text-xs border border-[#C4BFFA] flex items-center gap-1">
                                {FILTER_LABEL_MAP[sectionId]?.[v] || v}
                                <button onClick={() => handleRemoveFilterChip(sectionId, v)} className="hover:text-[#5B4FCC]">×</button>
                            </span>
                        ))
                    )}
                </div>
            )}
            
            {/* Date Label */}
            <DateFilterLabel filterDate={filterDate} />

            <div className="flex items-center justify-between px-1">
                  <h3 className="text-[#5B4FCC] text-sm">รายการคำขอส่งตัว</h3>
                  <span className="text-[10px] text-[#7367f0] bg-[#F4F0FF] px-2 py-0.5 rounded-full border border-[#C4BFFA]">{localFilteredData.length} รายการ</span>
            </div>
            <div className="space-y-3">
                {localFilteredData.map((ref) => (
                    <div 
                        key={ref.id} 
                        onClick={() => setSelectedRef(ref)}
                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                         {/* Bottleneck Indicator */}
                         {ref.isBottleneck && (
                             <div className="flex justify-end mb-1">
                                 <div className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                                     <AlertCircle size={10} /> ล่าช้า
                                 </div>
                             </div>
                         )}

                         <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex flex-col">
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                            {ref.patientName}
                                        </h3>
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-normal text-[#6a7282] text-[14px] leading-[20px] mt-0.5">
                                            HN: {ref.hn}
                                        </span>
                                    </div>
                                </div>

                                {(ref.status === 'Pending' || ref.status === 'pending' || ref.status === 'ส่งคำขอแล้ว' || ref.status === 'รอการตอบรับ') && (
                                    <div className="bg-blue-50 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-blue-600 text-[12px]">รอการตอบรับ</span>
                                    </div>
                                )}
                                {(ref.status === 'Accepted' || ref.status === 'ตอบรับแล้ว') && (
                                    <div className="bg-orange-50 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-orange-600 text-[12px]">รอรับตัว</span>
                                    </div>
                                )}
                                {(ref.status === 'Rejected' || ref.status === 'ปฏิเสธ') && (
                                    <div className="bg-red-50 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-red-500 text-[12px]">ปฏิเสธ</span>
                                    </div>
                                )}
                                {(ref.status === 'Treated' || ref.status === 'treated' || ref.status === 'รักษาแล้ว' || ref.status === 'Completed') && (
                                    <div className="bg-emerald-50 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-emerald-600 text-[12px]">รักษาแล้ว</span>
                                    </div>
                                )}
                                {ref.status === 'Examined' && (
                                    <div className="bg-teal-50 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-teal-600 text-[12px]">ตรวจแล้ว</span>
                                    </div>
                                )}
                                {(ref.status === 'WaitingReceive' || ref.status === 'รอรับตัว' || ref.status === 'นัดหมายแล้ว') && (
                                    <div className="bg-orange-50 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-orange-600 text-[12px]">รอรับตัว</span>
                                    </div>
                                )}
                                {(ref.status === 'ส่งตัวกลับพื้นที่') && (
                                    <div className="bg-teal-50 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-teal-600 text-[12px]">ส่งตัวกลับ</span>
                                    </div>
                                )}
                                {!['Pending', 'pending', 'ส่งคำขอแล้ว', 'รอการตอบรับ', 'Accepted', 'ตอบรับแล้ว', 'Rejected', 'ปฏิเสธ', 'Treated', 'treated', 'รักษาแล้ว', 'Completed', 'Examined', 'WaitingReceive', 'รอรับตัว', 'นัดหมายแล้ว', 'ส่งตัวกลับพื้นที่'].includes(ref.status) && (
                                     <div className="bg-slate-100 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-slate-600 text-[12px]">{ref.status === 'NotTreated' ? 'รอตรวจ' : ref.status}</span>
                                     </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                 <span className="font-['IBM_Plex_Sans_Thai'] text-slate-500 truncate max-w-[40%] text-[16px]">
                                    {ref.sourceHospital?.replace('โรงพยาบาล', 'รพ.') || '-'}
                                 </span>
                                 <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                                 <span className="font-['IBM_Plex_Sans_Thai'] text-[#7367f0] font-medium truncate max-w-[40%] text-[16px]">
                                    {ref.destHospital?.replace('โรงพยาบาล', 'รพ.') || '-'}
                                 </span>
                            </div>

                            <div className="flex justify-end items-center pt-2 mt-1 border-t border-slate-100">
                                <span className="font-['IBM_Plex_Sans_Thai'] text-slate-400 text-[13px]">
                                    {ref.requestDate && String(ref.requestDate).match(/^\\d{4}-\\d{2}-\\d{2}/)
                                        ? new Date(ref.requestDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
                                        : (ref.requestDate || '-')}
                                </span>
                            </div>
                         </div>
                    </div>
                ))}
                {localFilteredData.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#C4BFFA] text-[#9b93f5]">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>ไม่พบรายการส่งตัว</p>
                    </div>
                )}
            </div>
        </div>

        {/* FAB */}
        <button 
            className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
            onClick={onCreate}
        >
            <div className="bg-[#49358E] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full">
                <div className="relative shrink-0 w-4 h-4">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g>
                      <path d="M3.33293 7.99902H12.6651" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                      <path d="M7.99902 3.33293V12.6651" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                    </g>
                  </svg>
                </div>
            </div>
        </button>
    </div>
  );
}