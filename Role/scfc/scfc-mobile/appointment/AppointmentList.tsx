import React, { useState, useRef, useCallback } from 'react';
import { 
  Hospital,
  Video,
  Stethoscope,
  Clock,
  ArrowLeft,
  Search,
  MapPin,
  Building2,
  ChevronDown,
  Filter,
  Home,
  X
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import type { Appointment } from "./Appointmentdashboard";
import { SuperFilter } from "../components/SuperFilter";
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE } from "../../../../components/shared/ThaiCalendarDrawer";

const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

const THAI_MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const formatThaiDateShortInline = (d: Date) => `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]}`;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Confirmed': return 'bg-[#E5F8ED] text-[#28c76f]';
    case 'Pending': return 'bg-[#fff0e1] text-[#ff9f43]';
    case 'Missed': return 'bg-red-50 text-red-500';
    default: return 'bg-slate-100 text-slate-500';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'Confirmed': return 'ยืนยันแล้ว';
    case 'Pending': return 'รอการยืนยัน';
    case 'Missed': return 'ขาดนัด';
    default: return status;
  }
};

// --- Appointment-specific filter sections ---
const APPOINTMENT_FILTER_SECTIONS = [
  {
    id: 'province',
    title: 'จังหวัด',
    options: PROVINCES.map(p => ({ id: p, label: p }))
  },
  {
    id: 'type',
    title: 'ประเภทนัดหมาย',
    options: [
      { id: 'มาตรวจที่ รพ.', label: 'มาตรวจที่ รพ.' },
      { id: 'ปรึกษาทางไกล (Tele)', label: 'ปรึกษาทางไกล (Tele)' },
    ]
  },
  {
    id: 'clinic',
    title: 'คลินิก',
    options: [
      { id: 'ศัลยกรรมตกแต่ง', label: 'ศัลยกรรมตก��ต่ง' },
      { id: 'ทันตกรรม', label: 'ทันตกรรม' },
      { id: 'หูคอจมูก', label: 'หูคอจมูก' },
      { id: 'อรรถบำบัด', label: 'อรรถบำบัด' },
    ]
  },
  {
    id: 'hospital',
    title: 'โรงพยาบาล',
    options: HOSPITALS.map(h => ({ id: h, label: h }))
  },
  {
    id: 'riskLevel',
    title: 'ระดับความเสี่ยง',
    options: [
      { id: 'สูง', label: 'สูง' },
      { id: 'กลาง', label: 'กลาง' },
      { id: 'ต่ำ', label: 'ต่ำ' },
    ]
  }
];

const APPT_STATUS_PILLS = [
  { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#49358E] text-white shadow-md shadow-[#49358E]/20' },
  { id: 'Confirmed', label: 'ยืนยันแล้ว', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
  { id: 'Pending', label: 'รอการยืนยัน', color: 'bg-orange-50 text-orange-600 border border-orange-200', activeColor: 'bg-orange-500 text-white shadow-md shadow-orange-200' },
  { id: 'Missed', label: 'ขาดนัด', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
];

// Build a flat lookup map: sectionId -> optionId -> label (for Thai chip display)
const FILTER_LABEL_MAP: Record<string, Record<string, string>> = {};
APPOINTMENT_FILTER_SECTIONS.forEach(section => {
  FILTER_LABEL_MAP[section.id] = {};
  section.options.forEach(opt => {
    FILTER_LABEL_MAP[section.id][opt.id] = opt.label;
  });
});

interface AppointmentListProps {
  data: Appointment[];
  onSelect: (appointment: Appointment) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
}

export function AppointmentList({ 
    data, 
    onSelect, 
    searchQuery, 
    onSearchChange, 
    onBack,
}: AppointmentListProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Province & Hospital filter state
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  // Status pill + date filter
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Drag-to-scroll for status pills
  const statusScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const sLeft = useRef(0);
  const onMD = useCallback((e: React.MouseEvent) => { isDragging.current = true; startX.current = e.pageX - (statusScrollRef.current?.offsetLeft || 0); sLeft.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const onMM = useCallback((e: React.MouseEvent) => { if (!isDragging.current || !statusScrollRef.current) return; e.preventDefault(); const x = e.pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = sLeft.current - (x - startX.current) * 1.5; }, []);
  const onMU = useCallback(() => { isDragging.current = false; }, []);
  const onTS = useCallback((e: React.TouchEvent) => { isDragging.current = true; startX.current = e.touches[0].pageX - (statusScrollRef.current?.offsetLeft || 0); sLeft.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const onTM = useCallback((e: React.TouchEvent) => { if (!isDragging.current || !statusScrollRef.current) return; const x = e.touches[0].pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = sLeft.current - (x - startX.current) * 1.5; }, []);

  // --- SuperFilter handlers ---
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

  // --- Local filtering: SuperFilter on data from parent (search-filtered) ---
  const filteredData = data.filter(apt => {
    // Status pill
    const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;

    const provinceFilter = activeFilters['province'];
    const matchesProvince = !provinceFilter?.length || provinceFilter.includes(apt.province);

    const typeFilter = activeFilters['type'];
    const matchesType = !typeFilter?.length || typeFilter.includes(apt.type);

    const clinicFilter = activeFilters['clinic'];
    const matchesClinic = !clinicFilter?.length || clinicFilter.includes(apt.clinic);

    const hospitalFilter = activeFilters['hospital'];
    const matchesHospital = !hospitalFilter?.length || hospitalFilter.some(h => apt.hospital.includes(h));

    const riskFilter = activeFilters['riskLevel'];
    const matchesRisk = !riskFilter?.length || riskFilter.includes(apt.riskLevel);

    // Date filter
    let matchesDate = true;
    if (filterDate && apt.date) {
      const y = filterDate.getFullYear();
      const m = String(filterDate.getMonth() + 1).padStart(2, '0');
      const d = String(filterDate.getDate()).padStart(2, '0');
      const selectedDateStr = `${y}-${m}-${d}`;
      const aptDateStr = String(apt.date);
      if (aptDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        matchesDate = aptDateStr === selectedDateStr;
      }
    }

    return matchesStatus && matchesProvince && matchesType && matchesClinic && matchesHospital && matchesRisk && matchesDate;
  });

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
        {/* Header List View - Purple */}
        <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">รายการนัดหมาย</h1>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            
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
                            placeholder="ค้นหาผู้ป่วย, HN..." 
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 bg-[#F4F0FF]/30 border-[#C4BFFA] rounded-xl h-12 text-sm shadow-sm focus:ring-[#7367f0] focus:border-[#7367f0]" 
                        />
                    </div>
                     
                     <SuperFilter 
                        sections={APPOINTMENT_FILTER_SECTIONS}
                        activeFilters={activeFilters} 
                        onApply={handleSuperFilterApply}
                        onClear={() => {
                            setActiveFilters({});
                        }}
                     />
                     <CalendarFilterButton filterDate={filterDate} onDateSelect={setFilterDate} accentColor="#49358E" drawerTitle="กรองวันที่" />
                 </div>
            </div>
            
            {/* Status Pills */}
            <div ref={statusScrollRef} className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1"
              onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onMU}>
              {APPT_STATUS_PILLS.map((o) => (
                <button key={o.id} onClick={() => setFilterStatus(o.id)} className={cn("px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0", filterStatus === o.id ? o.activeColor : o.color)}>{o.label}</button>
              ))}
            </div>

            {/* Active Filters Display */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, values]) => 
                        values.map(v => (
                            <span key={`${key}-${v}`} className="bg-[#F4F0FF] text-[#7367f0] px-2 py-1 rounded text-xs border border-[#C4BFFA] flex items-center gap-1">
                                {FILTER_LABEL_MAP[key]?.[v] || v} 
                                <button onClick={() => handleRemoveFilterChip(key, v)} className="hover:text-[#5B4FCC]">×</button>
                            </span>
                        ))
                    )}
                </div>
            )}

            {/* Date Label */}
            <DateFilterLabel filterDate={filterDate} />

            {/* Card List */}
            <div className="flex items-center justify-between px-1">
                  <h3 className="text-[#5B4FCC] text-sm">รายการนัดหมาย</h3>
                  <span className="text-[10px] text-[#7367f0] bg-[#F4F0FF] px-2 py-0.5 rounded-full border border-[#C4BFFA]">{filteredData.length} รายการ</span>
            </div>
            <div className="space-y-3">
                {filteredData.map((apt) => (
                    <Card 
                        key={apt.id}
                        onClick={() => onSelect(apt)}
                        className={cn(
                            "bg-white border-[#C4BFFA] shadow-sm rounded-xl active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group hover:border-[#9b93f5] hover:shadow-md hover:shadow-[#7367f0]/5",
                            apt.isOverdue && "border-rose-100 ring-1 ring-rose-50"
                        )}
                    >
                        <div className="p-4">
                            <div className="flex gap-4">
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                                {apt.patientName}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">
                                                    HN: {apt.hn}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className={`px-3 py-1 rounded-[10px] ${getStatusColor(apt.status)}`}>
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px]">
                                                    {getStatusLabel(apt.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Row */}
                                    <div className="flex items-center justify-between w-full mt-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-[16px] h-[16px] text-[#7066a9]" />
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-slate-600">
                                                {apt.hospital || 'ไม่ได้ระบุสถานที่'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-100">
                                        {apt.clinic ? (
                                            <div className="flex items-center gap-2">
                                                <Stethoscope className="w-[14px] h-[14px] text-slate-400" />
                                                <span className="font-['IBM_Plex_Sans_Thai'] text-slate-500 text-[14px]">{apt.clinic}</span>
                                            </div>
                                        ) : <div></div>}
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                                                {apt.date || '-'} • {apt.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {filteredData.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#C4BFFA] text-[#9b93f5]">
                        <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>ไม่พบรายการนัดหมาย</p>
                    </div>
                )}
            </div>
        </div>
        
        {/* FAB */}
        <button 
            className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
            onClick={() => {}}
        >
            <div className="bg-[#49358E] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="Button">
                <div className="relative shrink-0 w-4 h-4" data-name="Icon">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g id="Icon">
                      <path d="M3.33293 7.99902H12.6651" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                      <path d="M7.99902 3.33293V12.6651" id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                    </g>
                  </svg>
                </div>
            </div>
        </button>
    </div>
  );
}