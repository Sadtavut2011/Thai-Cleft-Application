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
  Filter
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { useState } from "react";
import { FundRequest, FundStatus, UrgencyLevel } from "./FundDetailMobile";
import { SuperFilter } from "../components/SuperFilter";

// --- Fund-specific filter sections ---
const FUND_FILTER_SECTIONS = [
  {
    id: 'status',
    title: 'สถานะ',
    options: [
      { id: 'Pending', label: 'รอพิจารณา' },
      { id: 'Approved', label: 'อนุมัติแล้ว' },
      { id: 'Rejected', label: 'ปฏิเสธ' },
      { id: 'Received', label: 'ได้รับเงินแล้ว' },
      { id: 'Disbursed', label: 'จ่ายเงินแล้ว' },
    ]
  },
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

  // --- Local filtering based on SuperFilter selections ---
  const localFilteredData = data.filter(req => {
    const statusFilter = activeFilters['status'];
    const urgencyFilter = activeFilters['urgency'];
    const fundTypeFilter = activeFilters['fundType'];
    const hospitalFilter = activeFilters['hospital'];

    const matchesStatus = !statusFilter?.length || statusFilter.includes(req.status);
    const matchesUrgency = !urgencyFilter?.length || urgencyFilter.includes(req.urgency);
    const matchesFundType = !fundTypeFilter?.length || fundTypeFilter.some(ft => req.fundType.includes(ft));
    const matchesHospital = !hospitalFilter?.length || hospitalFilter.includes(req.hospital);

    return matchesStatus && matchesUrgency && matchesFundType && matchesHospital;
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

  const getStatusColor = (status: FundStatus) => {
      switch(status) {
          case 'Pending': return 'text-amber-600 bg-amber-50';
          case 'Approved': return 'text-blue-600 bg-blue-50';
          case 'Rejected': return 'text-rose-600 bg-rose-50';
          case 'Received': return 'text-purple-600 bg-purple-50';
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
        {/* Search and Filter Row */}
        {onSearchChange && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 mb-4 mx-1">
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
                        sections={FUND_FILTER_SECTIONS}
                        activeFilters={activeFilters}
                        onApply={handleSuperFilterApply}
                        onClear={() => setActiveFilters({})}
                     />
                 </div>
            </div>
        )}
        
        {/* Active Filters Display */}
        {Object.keys(activeFilters).length > 0 && (
            <div className="flex flex-wrap gap-2 px-1 mb-3">
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

        <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-slate-700 text-sm">รายการขอทุน</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{localFilteredData.length} รายการ</span>
        </div>
        
        <div className="space-y-3">
            {localFilteredData.map((req) => (
                <Card 
                    key={req.id}
                    onClick={() => onSelect(req)}
                    className="bg-white border-slate-200 shadow-sm rounded-xl p-3 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
                >
                    <div className="flex flex-col gap-1">
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-2">
                                <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                    {req.patientName} <span className="ml-1 font-normal text-[#6a7282]">{req.hn}</span>
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <FileText className="w-[14px] h-[14px] text-[#6a7282]" />
                                    <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px] truncate">
                                        {req.fundType}
                                    </span>
                                </div>
                            </div>

                            <div className="px-2 py-0.5 rounded-lg flex-shrink-0">
                                <span className={cn("font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] whitespace-nowrap px-2 py-0.5 rounded-lg", getStatusColor(req.status))}>
                                   {getStatusLabel(req.status)}
                                </span>
                            </div>
                        </div>

                        {/* Details Row */}
                        <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-gray-100">
                            <div className="flex items-center gap-2">
                                <Banknote className="w-[16px] h-[16px] text-[#7367f0]" />
                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[14px]">
                                    {req.amount.toLocaleString()} บาท
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                    {req.requestDate}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
}
