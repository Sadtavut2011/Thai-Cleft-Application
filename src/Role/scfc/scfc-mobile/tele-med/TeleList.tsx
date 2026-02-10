import React, { useState } from 'react';
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
  Filter
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { TeleSession, TeleStatus } from "./TeleDetailMobile";
import { SuperFilter } from "../components/SuperFilter";

// --- Tele-med specific filter sections ---
const TELE_FILTER_SECTIONS = [
  {
    id: 'status',
    title: 'สถานะ',
    options: [
      { id: 'Active', label: 'กำลังตรวจ' },
      { id: 'Waiting', label: 'รอตรวจ' },
      { id: 'Scheduled', label: 'นัดหมายแล้ว' },
      { id: 'Delayed', label: 'ล่าช้า' },
      { id: 'Tech Issue', label: 'ปัญหาเทคนิค' },
      { id: 'Completed', label: 'เสร็จสิ้น' },
    ]
  },
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
    options: [
      { id: 'รพ.สต. บ้านหนองหอย', label: 'รพ.สต. บ้านหนองหอย' },
      { id: 'รพ.ฝาง', label: 'รพ.ฝาง' },
      { id: 'รพ.ลำพูน', label: 'รพ.ลำพูน' },
      { id: 'รพ.มหาราชนครเชียงใหม่', label: 'รพ.มหาราชนครเชียงใหม่' },
    ]
  }
];

// Build a flat lookup map: sectionId -> optionId -> label
const FILTER_LABEL_MAP: Record<string, Record<string, string>> = {};
TELE_FILTER_SECTIONS.forEach(section => {
  FILTER_LABEL_MAP[section.id] = {};
  section.options.forEach(opt => {
    FILTER_LABEL_MAP[section.id][opt.id] = opt.label;
  });
});

interface TeleListProps {
  data: TeleSession[];
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

  // --- Local filtering based on SuperFilter selections ---
  const localFilteredData = data.filter(session => {
    const statusFilter = activeFilters['status'];
    const urgencyFilter = activeFilters['urgency'];
    const platformFilter = activeFilters['platform'];
    const sourceUnitFilter = activeFilters['sourceUnit'];

    const matchesStatus = !statusFilter?.length || statusFilter.includes(session.status);
    const matchesUrgency = !urgencyFilter?.length || urgencyFilter.includes(session.urgency);
    const matchesPlatform = !platformFilter?.length || platformFilter.includes(session.platform);
    const matchesSourceUnit = !sourceUnitFilter?.length || sourceUnitFilter.includes(session.sourceUnit);

    return matchesStatus && matchesUrgency && matchesPlatform && matchesSourceUnit;
  });

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

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
        {/* Header List View */}
        <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">รายการ Tele-Consult</h1>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                 <div className="flex gap-2 w-full">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="ค้นหาชื่อ, HN..." 
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 bg-white border-slate-200 rounded-xl h-12 text-sm shadow-sm focus:ring-teal-500" 
                        />
                    </div>
                     
                     <SuperFilter 
                        sections={TELE_FILTER_SECTIONS}
                        activeFilters={activeFilters}
                        onApply={handleSuperFilterApply}
                        onClear={() => setActiveFilters({})}
                     />
                 </div>
            </div>

            {/* Active Filters Display */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="flex flex-wrap gap-2 px-1 mb-1">
                    {Object.entries(activeFilters).map(([sectionId, values]) => 
                        values.map(v => (
                            <span key={`${sectionId}-${v}`} className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-bold border border-teal-100 flex items-center gap-1">
                                {FILTER_LABEL_MAP[sectionId]?.[v] || v}
                                <button onClick={() => handleRemoveFilterChip(sectionId, v)}>×</button>
                            </span>
                        ))
                    )}
                </div>
            )}

            <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-700 text-lg text-[14px]">รายการ Tele-Consult</h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{localFilteredData.length} รายการ</span>
            </div>
            <div className="space-y-3">
                {localFilteredData.map((session) => (
                    <Card 
                        key={session.id}
                        onClick={() => onSelect(session)}
                        className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all group"
                    >
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Right Content */}
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                                {session.patientName}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <User className="w-[14px] h-[14px] text-[#6a7282]" />
                                                <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px]">
                                                    {session.hn}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Status Badge */}
                                            <div className={cn("px-3 py-1 rounded-[10px]", getStatusStyle(session.status))}>
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px]">
                                                    {translateStatus(session.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Row */}
                                    <div className="flex items-center justify-between w-full mt-2">
                                        {/* Channel Type */}
                                        <div className="flex items-center gap-2">
                                            {session.platform.includes('Line') || session.platform.includes('Mobile') ? (
                                                <Smartphone className="w-[16px] h-[16px] text-[#7367f0]" />
                                            ) : (
                                                <Video className="w-[16px] h-[16px] text-[#7367f0]" />
                                            )}
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[12px]">
                                                {session.platform}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                                {session.startTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
        
        {/* FAB */}
        <button 
            className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
            onClick={onCreate}
        >
            <div className="bg-[#7066a9] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full">
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