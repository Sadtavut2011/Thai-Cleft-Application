import React from 'react';
import { 
  ArrowRight, 
  Calendar,
  Building2,
  AlertCircle,
  Coins,
  FileText,
  Banknote,
  Clock,
  MapPin,
  ChevronDown,
  Search,
  Filter,
  X
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { useState, useRef, useCallback } from "react";
import { FundRequest, FundStatus, UrgencyLevel } from "./FundDetailMobile";
import { SuperFilter } from "../components/SuperFilter";
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE } from "../../../../components/shared/ThaiCalendarDrawer";

// --- Province & Hospital constants ---
const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

// --- Fund-specific filter sections ---
const FUND_FILTER_SECTIONS = [
  {
    id: 'urgency',
    title: 'ความเร่งด่วน',
    options: [
      { id: 'Normal', label: 'ปกติ' },
      { id: 'Urgent', label: 'เร่งด่วน' },
      { id: 'Emergency', label: 'วิกฤต/เร่งด่วนที่สุด' },
    ]
  },
  {
    id: 'fundType',
    title: 'แหล่งทุน',
    options: [
      { id: 'สภากาชาดไทย (Red Cross)', label: 'สภากาชาดไทย (Red Cross)' },
      { id: 'Northern Care Fund', label: 'Northern Care Fund' },
    ]
  },
  {
    id: 'hospital',
    title: 'โรงพยาบาล',
    options: [
      { id: 'รพ.มหาราชนครเชียงใหม่', label: 'รพ.มหาราชนครเชียงใหม่' },
      { id: 'รพ.เชียงรายประชานุเคราะห์', label: 'รพ.เชียงรายประชานุเคราะห์' },
      { id: 'รพ.ฝาง', label: 'รพ.ฝาง' },
      { id: 'รพ.ลำพูน', label: 'รพ.ลำพูน' },
      { id: 'รพ.แม่ฮ่องสอน', label: 'รพ.แม่ฮ่องสอน' },
    ]
  }
];

// Status pills
const FUND_STATUS_PILLS = [
  { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#49358E] text-white shadow-md shadow-[#49358E]/20' },
  { id: 'Pending', label: 'รอพิจารณา', color: 'bg-amber-50 text-amber-600 border border-amber-200', activeColor: 'bg-amber-500 text-white shadow-md shadow-amber-200' },
  { id: 'Approved', label: 'อนุมัติแล้ว', color: 'bg-blue-50 text-blue-600 border border-blue-200', activeColor: 'bg-blue-500 text-white shadow-md shadow-blue-200' },
  { id: 'Rejected', label: 'ปฏิเสธ', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
  { id: 'Received', label: 'ได้รับเงินแล้ว', color: 'bg-purple-50 text-purple-600 border border-purple-200', activeColor: 'bg-purple-500 text-white shadow-md shadow-purple-200' },
  { id: 'Disbursed', label: 'จ่ายเงินแล้ว', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
];

// Build a flat lookup map: sectionId+optionId -> label
const FILTER_LABEL_MAP: Record<string, Record<string, string>> = {};
FUND_FILTER_SECTIONS.forEach(section => {
  FILTER_LABEL_MAP[section.id] = {};
  section.options.forEach(opt => {
    FILTER_LABEL_MAP[section.id][opt.id] = opt.label;
  });
});

interface FundListProps {
  data: FundRequest[];
  onSelect: (item: FundRequest) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function FundList({ 
  data, 
  onSelect,
  searchQuery = "",
  onSearchChange,
}: FundListProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Province & Hospital filter state
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  // Drag-to-scroll for status pills
  const statusScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const onMouseDown = useCallback((e: React.MouseEvent) => { isDragging.current = true; startX.current = e.pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeft.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!isDragging.current || !statusScrollRef.current) return; e.preventDefault(); const x = e.pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5; }, []);
  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);
  const onTouchStart = useCallback((e: React.TouchEvent) => { isDragging.current = true; startX.current = e.touches[0].pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeft.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => { if (!isDragging.current || !statusScrollRef.current) return; const x = e.touches[0].pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.5; }, []);

  // --- Local filtering ---
  const localFilteredData = data.filter(req => {
    // Status pill
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;

    const urgencyFilter = activeFilters['urgency'];
    const fundTypeFilter = activeFilters['fundType'];
    const hospitalFilter = activeFilters['hospital'];

    const matchesUrgency = !urgencyFilter?.length || urgencyFilter.includes(req.urgency);
    const matchesFundType = !fundTypeFilter?.length || fundTypeFilter.some(ft => req.fundType.includes(ft));
    const matchesHospital = !hospitalFilter?.length || hospitalFilter.includes(req.hospital);

    // Date filter
    let matchesDate = true;
    if (filterDate && req.requestDate) {
      const y = filterDate.getFullYear();
      const m = String(filterDate.getMonth() + 1).padStart(2, '0');
      const d = String(filterDate.getDate()).padStart(2, '0');
      const selectedDateStr = `${y}-${m}-${d}`;
      const reqDateStr = String(req.requestDate);
      if (reqDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        matchesDate = reqDateStr === selectedDateStr;
      }
    }

    return matchesStatus && matchesUrgency && matchesFundType && matchesHospital && matchesDate;
  });

  const handleSuperFilterApply = (filters: Record<string, string[]>) => {
    // Clean up empty arrays
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

  const getStatusColor = (status: FundStatus) => {
      switch(status) {
          case 'Pending': return 'text-amber-600 bg-amber-50';
          case 'Approved': return 'text-blue-600 bg-blue-50';
          case 'Rejected': return 'text-rose-600 bg-rose-50';
          case 'Received': return 'text-[#7367f0] bg-[#F4F0FF]';
          case 'Disbursed': return 'text-emerald-600 bg-emerald-50';
          default: return 'text-slate-600 bg-slate-50';
      }
  };
  
  const getStatusLabel = (status: FundStatus) => {
      switch(status) {
          case 'Pending': return 'รอพิจารณา';
          case 'Approved': return 'อนุมัติแล้ว';
          case 'Rejected': return 'ปฏิเสธ';
          case 'Received': return 'ได้รับเงินแล้ว';
          case 'Disbursed': return 'จ่ายเงินแล้ว';
          default: return status;
      }
  };

  return (
    <div className="pb-4">
        {/* Province & Hospital Filter Dropdowns */}
        <div className="flex gap-2 mb-4 mx-1">
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
        {onSearchChange && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#C4BFFA] flex flex-col gap-3 mb-4 mx-1">
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
                        sections={FUND_FILTER_SECTIONS}
                        activeFilters={activeFilters}
                        onApply={handleSuperFilterApply}
                        onClear={() => setActiveFilters({})}
                     />
                     <CalendarFilterButton filterDate={filterDate} onDateSelect={setFilterDate} accentColor="#49358E" drawerTitle="กรองวันที่" />
                 </div>
            </div>
        )}
        
        {/* Status Pills */}
        <div
          ref={statusScrollRef}
          className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1 mb-3"
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onMouseUp}
        >
          {FUND_STATUS_PILLS.map((option) => (
            <button key={option.id} onClick={() => setFilterStatus(option.id)}
              className={cn("px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0", filterStatus === option.id ? option.activeColor : option.color)}>
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
            <div className="flex flex-wrap gap-2 px-1 mb-3">
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

        <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[#5B4FCC] text-sm">รายการขอทุน</h3>
            <span className="text-[10px] text-[#7367f0] bg-[#F4F0FF] px-2 py-0.5 rounded-full border border-[#C4BFFA]">{localFilteredData.length} รายการ</span>
        </div>
        
        <div className="space-y-3">
            {localFilteredData.map((req) => (
                <Card 
                    key={req.id}
                    onClick={() => onSelect(req)}
                    className="bg-white border-[#C4BFFA] shadow-sm rounded-xl active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group hover:border-[#9b93f5] hover:shadow-md hover:shadow-[#7367f0]/5"
                >
                    <div className="p-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex flex-col">
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">{req.patientName}</h3>
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-normal text-[#6a7282] text-[14px] leading-[16px] mt-1">HN: {req.hn}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <FileText className="w-[14px] h-[14px] text-[#6a7282] shrink-0" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[16px] leading-[16px] truncate">{req.fundType}</span>
                                    </div>
                                </div>
                                {req.status === 'Pending' && <div className="bg-[#fff0e1] px-2 py-0.5 rounded-lg shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#ff9f43] text-[12px]">รอพิจารณา</span></div>}
                                {req.status === 'Approved' && <div className="bg-[#E0FBFC] px-2 py-0.5 rounded-lg shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">อนุมัติ</span></div>}
                                {req.status === 'Rejected' && <div className="bg-red-50 px-2 py-0.5 rounded-lg shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-red-500 text-[12px]">ปฏิเสธ</span></div>}
                                {req.status === 'Received' && <div className="bg-[#F4F0FF] px-2 py-0.5 rounded-lg shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[12px]">ได้รับเงินแล้ว</span></div>}
                                {req.status === 'Disbursed' && <div className="bg-[#E5F8ED] px-2 py-0.5 rounded-lg shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#28c76f] text-[12px]">จ่ายเงินแล้ว</span></div>}
                            </div>
                            <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Banknote className="w-[16px] h-[16px] text-[#7367f0]" />
                                    <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[20px]">{req.amount.toLocaleString()} บาท</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {req.status === 'Pending' ? <Clock className="w-3 h-3 text-gray-400" /> : <Calendar className="w-3 h-3 text-gray-400" />}
                                    <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">{req.requestDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
}