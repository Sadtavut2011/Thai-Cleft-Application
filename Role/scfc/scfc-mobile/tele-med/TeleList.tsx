import React, { useState, useMemo, useRef, useCallback } from 'react';
import { 
  Clock,
  User,
  Smartphone,
  Video,
  ArrowLeft,
  Search,
  MapPin,
  Building2,
  ChevronDown,
  Filter,
  Home,
  Calendar,
  X
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { TeleSession, TeleStatus, Platform } from "./TeleDetailMobile";
import { SuperFilter } from "../components/SuperFilter";
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE } from "../../../../components/shared/ThaiCalendarDrawer";
import { PATIENTS_DATA, getPatientByHn } from "../../../../data/patientData";
import { TeleConsultDetail } from "../../../cm/cm-mobile/patient/History/TeleConsultDetail";
import { PatientDetailView } from "../../../cm/cm-mobile/patient/detail/PatientDetailView";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";
import { toast } from "sonner@2.0.3";

const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

const THAI_MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const formatThaiShortDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]}`;
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
  'รพ.มหาราชนครเชียงใหม่': 'เชียงใหม่',
  'รพ.นครพิงค์': 'เชียงใหม่',
  'รพ.ฝาง': 'เชียงใหม่',
  'รพ.จอมทอง': 'เชียงใหม่',
  'รพ.เชียงรายประชานุเคราะห์': 'เชียงราย',
  'รพ.แม่จัน': 'เชียงราย',
};

const matchHospital = (dataHospital: string, filterHospital: string): boolean => {
  if (filterHospital === 'All') return true;
  const normalized = (dataHospital || '').replace('โรงพยาบาล', 'รพ.').trim();
  return normalized === filterHospital || dataHospital.includes(filterHospital.replace('รพ.', ''));
};

// Extended session type with extra fields
type ExtendedTeleSession = TeleSession & { _province: string; _hospital: string; _originalConsult: any };

// ═══ Build TeleSession[] from PATIENTS_DATA ═══
const buildTeleSessionsFromPatients = (): ExtendedTeleSession[] => {
  const platformOptions: Platform[] = ['Zoom', 'MS Teams', 'Hospital Link'];
  return PATIENTS_DATA.flatMap((p: any) => {
    return (p.teleConsultHistory || []).map((tele: any, idx: number) => {
      const channelMap: Record<string, Platform> = {
        'zoom': 'Zoom', 'teams': 'MS Teams', 'ms teams': 'MS Teams',
        'mobile': 'Hospital Link', 'hospital': 'Hospital Link', 'agency': 'Hospital Link',
      };
      const rawChannel = (tele.channel || 'mobile').toLowerCase();
      const platform: Platform = channelMap[rawChannel] || platformOptions[idx % 3];

      const rawStatus = (tele.status || '').toLowerCase();
      let status: TeleStatus = 'Waiting';
      if (['completed', 'เสร็จสิ้น', 'done'].includes(rawStatus)) status = 'Completed';
      else if (['active', 'inprogress', 'in_progress', 'กำลังปรึกษา'].includes(rawStatus)) status = 'Active';
      else if (['scheduled', 'confirmed', 'นัดหมาย'].includes(rawStatus)) status = 'Scheduled';
      else if (['cancelled', 'missed', 'ยกเลิก'].includes(rawStatus)) status = 'Completed';
      else if (['delayed', 'ล่าช้า'].includes(rawStatus)) status = 'Delayed';
      else if (['tech_issue', 'error'].includes(rawStatus)) status = 'Tech Issue';

      const channelForDetail = rawChannel === 'zoom' ? 'mobile' : rawChannel === 'teams' ? 'hospital' : rawChannel;

      return {
        id: `TELE-${p.hn}-${idx}`,
        patientName: p.name,
        hn: p.hn,
        sourceUnit: p.hospital || tele.agency_name || '-',
        specialist: tele.doctor || p.doctor || '-',
        specialistHospital: tele.agency_name || p.hospital || '-',
        platform,
        status,
        urgency: 'Normal' as const,
        linkStatus: status === 'Active' ? 'Live' as const : 'Checking' as const,
        waitingTime: Math.floor(Math.random() * 30) + 1,
        connectionStability: Math.floor(Math.random() * 20) + 80,
        startTime: tele.rawDate || undefined,
        _province: p.province || HOSPITAL_PROVINCE_MAP[p.hospital] || '',
        _hospital: p.hospital || '',
        _originalConsult: {
          ...tele,
          channel: channelForDetail,
          doctor: tele.doctor || p.doctor || '-',
          agency_name: tele.agency_name || p.hospital || '-',
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

// --- Tele-med specific filter sections ---
const TELE_FILTER_SECTIONS = [
  {
    id: 'urgency',
    title: 'ความเร่งด่วน',
    options: [
      { id: 'Normal', label: 'ปกติ' },
      { id: 'Urgent', label: 'เร่งด่วน' },
    ]
  },
  {
    id: 'platform',
    title: 'แพลตฟอร์ม',
    options: [
      { id: 'Zoom', label: 'Zoom' },
      { id: 'MS Teams', label: 'MS Teams' },
      { id: 'Hospital Link', label: 'Hospital Link' },
    ]
  },
  {
    id: 'sourceUnit',
    title: 'หน่วยบริการ',
    options: HOSPITALS.map(h => ({ id: h, label: h }))
  }
];

const TELE_STATUS_PILLS = [
  { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#49358E] text-white shadow-md shadow-[#49358E]/20' },
  { id: 'Active', label: 'กำลังตรวจ', color: 'bg-purple-50 text-purple-600 border border-purple-200', activeColor: 'bg-purple-500 text-white shadow-md shadow-purple-200' },
  { id: 'Waiting', label: 'รอตรวจ', color: 'bg-cyan-50 text-cyan-600 border border-cyan-200', activeColor: 'bg-cyan-500 text-white shadow-md shadow-cyan-200' },
  { id: 'Scheduled', label: 'นัดหมายแล้ว', color: 'bg-blue-50 text-blue-600 border border-blue-200', activeColor: 'bg-blue-500 text-white shadow-md shadow-blue-200' },
  { id: 'Delayed', label: 'ล่าช้า', color: 'bg-orange-50 text-orange-600 border border-orange-200', activeColor: 'bg-orange-500 text-white shadow-md shadow-orange-200' },
  { id: 'Tech Issue', label: 'ปัญหาเทคนิค', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
  { id: 'Completed', label: 'เสร็จสิ้น', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
];

const FILTER_LABEL_MAP: Record<string, Record<string, string>> = {};
TELE_FILTER_SECTIONS.forEach(section => {
  FILTER_LABEL_MAP[section.id] = {};
  section.options.forEach(opt => {
    FILTER_LABEL_MAP[section.id][opt.id] = opt.label;
  });
});

interface TeleListProps {
  data?: TeleSession[];
  onSelect: (item: TeleSession) => void;
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreate?: () => void;
}

export function TeleList({ 
  data, 
  onSelect, 
  onBack, 
  searchQuery, 
  onSearchChange,
  onCreate,
}: TeleListProps) {
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
  const [selectedSession, setSelectedSession] = useState<ExtendedTeleSession | null>(null);
  
  // Patient history view state
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const [historyPatient, setHistoryPatient] = useState<any>(null);

  // Build sessions from PATIENTS_DATA
  const allSessions = useMemo(() => buildTeleSessionsFromPatients(), []);

  // Full filtering
  const localFilteredData = useMemo(() => {
    return allSessions.filter((session) => {
      const sessionProvince = session._province || HOSPITAL_PROVINCE_MAP[session.sourceUnit] || '';
      const matchesProvince = selectedProvince === 'All' || sessionProvince === selectedProvince;
      const matchesHosp = matchHospital(session._hospital || session.sourceUnit || '', selectedHospital);
      const term = (searchQuery || '').toLowerCase().trim();
      const matchesSearch = !term || session.patientName.toLowerCase().includes(term) || session.hn.toLowerCase().includes(term);
      const urgencyFilter = activeFilters['urgency'];
      const platformFilter = activeFilters['platform'];
      const sourceUnitFilter = activeFilters['sourceUnit'];
      const matchesStatusPill = filterStatus === 'All' || session.status === filterStatus;
      const matchesUrgency = !urgencyFilter?.length || urgencyFilter.includes(session.urgency);
      const matchesPlatform = !platformFilter?.length || platformFilter.includes(session.platform);
      const matchesSourceUnit = !sourceUnitFilter?.length || sourceUnitFilter.some((u: string) => matchHospital(session.sourceUnit, u));
      return matchesProvince && matchesHosp && matchesSearch && matchesStatusPill && matchesUrgency && matchesPlatform && matchesSourceUnit;
    });
  }, [allSessions, selectedProvince, selectedHospital, searchQuery, activeFilters, filterStatus]);

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

  const handleSelectSession = (session: ExtendedTeleSession) => {
    setSelectedSession(session);
  };

  const getStatusStyle = (status: TeleStatus) => {
    switch (status) {
      case 'Active': return 'bg-[#EEEBFF] text-[#7367f0]';
      case 'Waiting': return 'bg-[#E0FBFC] text-[#00CFE8]';
      case 'Tech Issue': return 'bg-[#FFEEEE] text-[#EA5455]';
      case 'Delayed': return 'bg-[#FFF0E1] text-[#FF9F43]';
      case 'Completed': return 'bg-[#E5F8ED] text-[#28C76F]';
      default: return 'bg-[#F8F8F8] text-[#B9B9C3]';
    }
  };

  const translateStatus = (status: TeleStatus) => {
    switch (status) {
      case 'Active': return 'กำลังตรวจ';
      case 'Waiting': return 'รอตรวจ';
      case 'Tech Issue': return 'ปัญหาเทคนิค';
      case 'Delayed': return 'ล่าช้า';
      case 'Scheduled': return 'นัดหมายแล้ว';
      case 'Completed': return 'เสร็จสิ้น';
      default: return status;
    }
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

  // ═══ Detail View — TeleConsultDetail from CM with SCFC role ═══
  if (selectedSession) {
    const patientRecord = getPatientByHn(selectedSession.hn);
    const patientObj = {
      name: selectedSession.patientName,
      hn: selectedSession.hn,
      image: patientRecord?.image,
    };
    const consultObj = selectedSession._originalConsult;

    return (
      <TeleConsultDetail
        consult={consultObj}
        patient={patientObj}
        onBack={() => setSelectedSession(null)}
        role="scfc"
        onCancel={() => {
          toast.success('ยกเลิกนัดหมาย Tele-med เรียบร้อย');
        }}
        onReschedule={() => {
          toast.info('กำลังเลื่อนนัดหมาย...');
        }}
        onViewHistory={() => {
          const pt = getPatientByHn(selectedSession.hn);
          if (pt) {
            setHistoryPatient(pt);
            setShowPatientHistory(true);
          } else {
            setHistoryPatient({
              name: selectedSession.patientName,
              hn: selectedSession.hn,
              hospital: selectedSession.sourceUnit,
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
            <h1 className="text-white text-lg font-bold">รายการ Tele-Consult</h1>
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
                        sections={TELE_FILTER_SECTIONS}
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
              {TELE_STATUS_PILLS.map((o) => (
                <button key={o.id} onClick={() => setFilterStatus(o.id)} className={cn("px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0", filterStatus === o.id ? o.activeColor : o.color)}>{o.label}</button>
              ))}
            </div>

            {/* Active Filters Display */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="flex flex-wrap gap-2 px-1 mb-1">
                    {Object.entries(activeFilters).map(([sectionId, values]) => 
                        values.map(v => (
                            <span key={`${sectionId}-${v}`} className="bg-[#F4F0FF] text-[#7367f0] px-2 py-1 rounded text-xs font-bold border border-[#C4BFFA] flex items-center gap-1">
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
                  <h3 className="text-[#5B4FCC] text-sm">รายการ Tele-Consult</h3>
                  <span className="text-[10px] text-[#7367f0] bg-[#F4F0FF] px-2 py-0.5 rounded-full border border-[#C4BFFA]">{localFilteredData.length} รายการ</span>
            </div>
            <div className="space-y-3">
                {localFilteredData.map((session) => (
                    <Card 
                        key={session.id}
                        onClick={() => handleSelectSession(session)}
                        className="bg-white border-[#C4BFFA] shadow-sm rounded-xl active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group hover:border-[#9b93f5] hover:shadow-md hover:shadow-[#7367f0]/5"
                    >
                        <div className="p-4">
                            <div className="flex gap-4">
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">{session.patientName}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">HN: {session.hn}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("px-3 py-1 rounded-[10px]", getStatusStyle(session.status))}>
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px]">
                                                    {translateStatus(session.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Channel / Platform Row */}
                                    <div className="flex items-center justify-between w-full mt-2">
                                        <div className="flex items-center gap-2">
                                            {session.platform === 'Zoom' ? (
                                                <Smartphone className="w-[16px] h-[16px] text-green-600" />
                                            ) : session.platform === 'Hospital Link' ? (
                                                <Home className="w-[16px] h-[16px] text-purple-600" />
                                            ) : (
                                                <Building2 className="w-[16px] h-[16px] text-blue-600" />
                                            )}
                                            <span className={cn(
                                                "font-['IBM_Plex_Sans_Thai'] font-medium text-[16px]",
                                                session.platform === 'Zoom' ? "text-green-700" : session.platform === 'Hospital Link' ? "text-purple-700" : "text-blue-700"
                                            )}>
                                                {session.platform === 'Zoom' ? 'Zoom (การประชุมทางไกล)' : session.platform === 'Hospital Link' ? 'Hospital Link (ผ่าน รพ.)' : 'MS Teams'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-[#6a7282]" />
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                                                {formatThaiShortDate(session.startTime)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Hospital info */}
                                    <div className="flex items-center gap-2 mt-1 pt-1 border-t border-dashed border-gray-100">
                                        <MapPin className="w-3.5 h-3.5 text-[#7066A9] shrink-0" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#7066A9] text-[14px] truncate">{session.sourceUnit}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {localFilteredData.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#C4BFFA] text-[#9b93f5]">
                        <Video className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>ไม่พบรายการ Tele-Consult</p>
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
                <div className="relative shrink-0 w-4 h-4 pointer-events-none">
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