import React, { useState } from 'react';
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
  Home
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import type { Appointment } from "./AppointmentSystem";
import { SuperFilter } from "../components/SuperFilter";

// --- Appointment-specific filter sections ---
const APPOINTMENT_FILTER_SECTIONS = [
  {
    id: 'status',
    title: 'สถานะ',
    options: [
      { id: 'Confirmed', label: 'ยืนยันแล้ว' },
      { id: 'Pending', label: 'รอการยืนยัน' },
      { id: 'Missed', label: 'ขาดนัด' },
    ]
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
      { id: 'ศัลยกรรมตกแต่ง', label: 'ศัลยกรรมตกแต่ง' },
      { id: 'ทันตกรรม', label: 'ทันตกรรม' },
      { id: 'หูคอจมูก', label: 'หูคอจมูก' },
      { id: 'อรรถบำบัด', label: 'อรรถบำบัด' },
    ]
  },
  {
    id: 'hospital',
    title: 'โรงพยาบาล',
    options: [
      { id: 'รพ.มหาราชนครเชียงใหม่', label: 'รพ.มหาราชนครเชียงใหม่' },
      { id: 'รพ.เชียงรายประชานุเคราะห์', label: 'รพ.เชียงรายประชานุเคราะห์' },
      { id: 'รพ.ลำพูน', label: 'รพ.ลำพูน' },
      { id: 'รพ.ฝาง', label: 'รพ.ฝาง' },
      { id: 'รพ.นครพิงค์', label: 'รพ.นครพิงค์' },
      { id: 'รพ.จอมทอง', label: 'รพ.จอมทอง' },
    ]
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
    const statusFilter = activeFilters['status'];
    const matchesStatus = !statusFilter?.length || statusFilter.includes(apt.status);

    const typeFilter = activeFilters['type'];
    const matchesType = !typeFilter?.length || typeFilter.includes(apt.type);

    const clinicFilter = activeFilters['clinic'];
    const matchesClinic = !clinicFilter?.length || clinicFilter.includes(apt.clinic);

    const hospitalFilter = activeFilters['hospital'];
    const matchesHospital = !hospitalFilter?.length || hospitalFilter.some(h => apt.hospital.includes(h));

    const riskFilter = activeFilters['riskLevel'];
    const matchesRisk = !riskFilter?.length || riskFilter.includes(apt.riskLevel);

    return matchesStatus && matchesType && matchesClinic && matchesHospital && matchesRisk;
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

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            
            {/* Search and Filter Row */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E3E0F0] flex flex-col gap-3">
                 <div className="flex gap-2 w-full">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7066A9]" />
                        <Input 
                            placeholder="ค้นหาผู้ป่วย, HN..." 
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 bg-[#F4F0FF]/30 border-[#E3E0F0] rounded-xl h-12 text-sm shadow-sm focus:ring-[#7066A9] focus:border-[#7066A9]" 
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
                 </div>
            </div>
            
            {/* Active Filters Display */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, values]) => 
                        values.map(v => (
                            <span key={`${key}-${v}`} className="bg-[#F4F0FF] text-[#49358E] px-2 py-1 rounded text-xs font-bold border border-[#E3E0F0] flex items-center gap-1">
                                {FILTER_LABEL_MAP[key]?.[v] || v} 
                                <button onClick={() => handleRemoveFilterChip(key, v)} className="hover:text-[#37286A]">×</button>
                            </span>
                        ))
                    )}
                </div>
            )}

            {/* Card List */}
            <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-[#37286A] text-[14px]">รายการนัดหมาย</h3>
                  <span className="text-[10px] font-bold text-[#7066A9] bg-[#F4F0FF] px-2 py-0.5 rounded-full border border-[#E3E0F0]">{filteredData.length} รายการ</span>
            </div>
            <div className="space-y-3">
                {filteredData.map((apt) => (
                    <Card 
                        key={apt.id}
                        onClick={() => onSelect(apt)}
                        className={cn(
                            "bg-white border-[#E3E0F0] shadow-sm rounded-xl p-3 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group hover:border-[#D2CEE7] hover:shadow-md hover:shadow-[#49358E]/5",
                            apt.isOverdue && "border-rose-100 ring-1 ring-rose-50"
                        )}
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#37286A] text-[14px] leading-tight">
                                        {apt.patientName}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Stethoscope className="w-3 h-3 text-[#7066A9]" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#7066A9] text-[12px]">
                                            {apt.clinic === 'ศัลยกรรมตกแต่ง' ? 'ผ่าตัดเย็บเพดานปาก' : 
                                             apt.clinic === 'อรรถบำบัด' ? 'ฝึกพูด' : 
                                             apt.clinic === 'ทันตกรรม' ? 'ทันตกรรมประดิษฐ์' :
                                             apt.clinic}
                                        </span>
                                    </div>
                                </div>

                                 <div className={cn("px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap", 
                                    apt.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600" :
                                    apt.status === 'Pending' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                 )}>
                                    {apt.status === 'Confirmed' ? 'ยืนยันแล้ว' : apt.status === 'Pending' ? 'รอการยืนยัน' : 'ขาดนัด'}
                                 </div>
                            </div>

                            <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-[#E3E0F0]">
                                 <div className="flex items-center gap-1.5">
                                     <Hospital className="w-3 h-3 text-[#7066A9]" />
                                     <span className="font-['IBM_Plex_Sans_Thai'] text-[#7066A9] text-[12px] truncate max-w-[140px]">
                                         {apt.hospital}
                                     </span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <Clock className="w-3 h-3 text-[#D2CEE7]" />
                                     <span className="font-['IBM_Plex_Sans_Thai'] text-[#7066A9] text-[12px]">
                                         {format(new Date(apt.date), "d MMM", { locale: th })} {apt.time}
                                     </span>
                                 </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {filteredData.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E3E0F0] text-[#7066A9]">
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
            <div className="bg-[#7066a9] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="Button">
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