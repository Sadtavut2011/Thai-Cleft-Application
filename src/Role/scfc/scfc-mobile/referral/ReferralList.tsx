import React, { useState } from 'react';
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
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ReferralCase } from "./ReferralDetailMobile";
import { SuperFilter } from "../components/SuperFilter";

// --- Referral-specific filter sections ---
const REFERRAL_FILTER_SECTIONS = [
  {
    id: 'status',
    title: 'สถานะ',
    options: [
      { id: 'ส่งคำขอแล้ว', label: 'ส่งคำขอแล้ว' },
      { id: 'รอการตอบรับ', label: 'รอการตอบรับ' },
      { id: 'ตอบรับแล้ว', label: 'ตอบรับแล้ว' },
      { id: 'ปฏิเสธ', label: 'ปฏิเสธ' },
      { id: 'นัดหมายแล้ว', label: 'นัดหมายแล้ว' },
      { id: 'รอรับตัว', label: 'รอรับตัว' },
      { id: 'รักษาแล้ว', label: 'รักษาแล้ว' },
      { id: 'ส่งตัวกลับพื้นที่', label: 'ส่งตัวกลับพื้นที่' },
    ]
  },
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
    options: [
      { id: 'รพ.สต. บ้านป่าซาง', label: 'รพ.สต. บ้านป่าซาง' },
      { id: 'รพ.นครพิงค์', label: 'รพ.นครพิงค์' },
      { id: 'รพ.ฝาง', label: 'รพ.ฝาง' },
      { id: 'รพ.มหาราชนครเชียงใหม่', label: 'รพ.มหาราชนครเชียงใหม่' },
    ]
  },
  {
    id: 'destHospital',
    title: 'โรงพยาบาลปลายทาง',
    options: [
      { id: 'รพ.มหาราชนครเชียงใหม่', label: 'รพ.มหาราชนครเชียงใหม่' },
      { id: 'รพ.เชียงรายประชานุเคราะห์', label: 'รพ.เชียงรายประชานุเคราะห์' },
      { id: 'รพ.สต. ดอยหล่อ', label: 'รพ.สต. ดอยหล่อ' },
    ]
  }
];

// Build a flat lookup map: sectionId -> optionId -> label
const FILTER_LABEL_MAP: Record<string, Record<string, string>> = {};
REFERRAL_FILTER_SECTIONS.forEach(section => {
  FILTER_LABEL_MAP[section.id] = {};
  section.options.forEach(opt => {
    FILTER_LABEL_MAP[section.id][opt.id] = opt.label;
  });
});

interface ReferralListProps {
  data: ReferralCase[];
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

  // --- Local filtering based on SuperFilter selections ---
  const localFilteredData = data.filter(ref => {
    const statusFilter = activeFilters['status'];
    const urgencyFilter = activeFilters['urgency'];
    const sourceFilter = activeFilters['sourceHospital'];
    const destFilter = activeFilters['destHospital'];

    const matchesStatus = !statusFilter?.length || statusFilter.includes(ref.status);
    const matchesUrgency = !urgencyFilter?.length || urgencyFilter.includes(ref.urgency);
    const matchesSource = !sourceFilter?.length || sourceFilter.includes(ref.sourceHospital);
    const matchesDest = !destFilter?.length || destFilter.includes(ref.destHospital);

    return matchesStatus && matchesUrgency && matchesSource && matchesDest;
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ส่งคำขอแล้ว': return 'bg-indigo-50 text-indigo-600';
      case 'รอการตอบรับ': return 'bg-[#fff0e1] text-[#ff9f43]';
      case 'ตอบรับแล้ว': return 'bg-[#E0FBFC] text-[#00CFE8]';
      case 'ปฏิเสธ': return 'bg-red-50 text-red-500';
      case 'นัดหมายแล้ว': return 'bg-blue-50 text-blue-600';
      case 'รอรับตัว': return 'bg-purple-50 text-purple-600';
      case 'รักษาแล้ว': return 'bg-emerald-50 text-emerald-600';
      case 'ส่งตัวกลับพื้นที่': return 'bg-teal-50 text-teal-600';
      case 'Pending': case 'pending': return 'bg-[#fff0e1] text-[#ff9f43]';
      case 'Accepted': return 'bg-[#E0FBFC] text-[#00CFE8]';
      case 'Rejected': return 'bg-red-50 text-red-500';
      case 'Treated': case 'treated': return 'bg-emerald-50 text-emerald-600';
      case 'WaitingReceive': return 'bg-blue-50 text-blue-600';
      case 'NotTreated': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pending': case 'pending': return 'รอการตอบรับ';
      case 'Accepted': return 'อนุมัติ';
      case 'Rejected': return 'ปฏิเสธ';
      case 'Treated': case 'treated': return 'รักษาแล้ว';
      case 'WaitingReceive': return 'รอรับตัว';
      case 'NotTreated': return 'รอตรวจ';
      default: return status;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'ฉุกเฉิน': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'เร่งด่วน': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-teal-50 text-teal-600 border-teal-100';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
        {/* Header List View */}
        <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">รายการส่งตัว</h1>
                </div>
            </div>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Search and Filter Row */}
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
                        sections={REFERRAL_FILTER_SECTIONS}
                        activeFilters={activeFilters}
                        onApply={handleSuperFilterApply}
                        onClear={() => setActiveFilters({})}
                     />
                 </div>
            </div>
            
            {/* Active Filters Display */}
            {Object.keys(activeFilters).length > 0 && (
                <div className="flex flex-wrap gap-2">
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
                  <h3 className="font-bold text-slate-700 text-lg text-[14px]">รายการคำขอส่งตัว</h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{localFilteredData.length} รายการ</span>
              </div>
            <div className="space-y-3">
                {localFilteredData.map((ref) => (
                    <div 
                        key={ref.id} 
                        onClick={() => onSelect(ref)}
                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                    >
                         {/* Bottleneck Indicator */}
                         {ref.isBottleneck && (
                             <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg flex items-center gap-1 z-10">
                                 <AlertCircle size={10} /> ล่าช้า
                             </div>
                        )}

                         <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 pr-2">
                                    <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                        {ref.patientName} <span className="ml-1 font-normal text-[#6a7282]">{ref.hn}</span>
                                    </h3>
                                </div>

                                <div className="shrink-0">
                                    <div className={cn("px-2 py-0.5 rounded-lg", getStatusStyle(ref.status))}>
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px]">
                                            {getStatusLabel(ref.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                 <span className="text-xs text-slate-500 truncate max-w-[40%]">
                                    {ref.sourceHospital?.replace('โรงพยาบาล', 'รพ.') || '-'}
                                 </span>
                                 <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                                 <span className="text-xs text-[#7367f0] font-medium truncate max-w-[40%]">
                                    {ref.destHospital?.replace('โรงพยาบาล', 'รพ.') || '-'}
                                 </span>
                            </div>

                            <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100">
                                <span className="text-xs text-slate-400">
                                    <Clock size={12} className="inline mr-1" />
                                    {ref.requestDate.split(' ')[0]}
                                </span>
                                <div className="h-7 flex items-center justify-center text-xs text-[#7367f0] hover:bg-indigo-50 px-2 rounded cursor-pointer font-medium">
                                    ดูรายละเอียด
                                </div>
                            </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>

        {/* FAB */}
        <button 
            className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
            onClick={onCreate}
        >
            <div className="bg-[#7066a9] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full">
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
