import React, { useState, useEffect } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent } from "../../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { 
  ChevronLeft,
  Search, 
  Home,
  MapPin,
  Building2,
  ChevronDown,
  Filter,
  X
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import { HomeVisitADD } from "../../../cm/cm-mobile/home-visit/forms/HomeVisitADD";
import { VisitDetail } from "../../../cm/cm-mobile/patient/History/VisitDetail";
import { VisitRequest } from "../../../cm/cm-mobile/home-visit/types";
import VisitTypeIcon from "../../../../imports/Icon-4061-1646";
import DocIcon from "../../../../imports/Icon-4061-1692";
import { HOME_VISIT_DATA, PATIENTS_DATA } from "../../../../data/patientData";
import { SuperFilter } from "../components/SuperFilter";

// --- Home Visit specific filter sections ---
const HOME_VISIT_FILTER_SECTIONS = [
  {
    id: 'status',
    title: 'สถานะ',
    options: [
      { id: 'Pending', label: 'รอการตอบรับ' },
      { id: 'WaitVisit', label: 'รอเยี่ยม' },
      { id: 'InProgress', label: 'ดำเนินการ' },
      { id: 'Completed', label: 'เสร็จสิ้น' },
      { id: 'Rejected', label: 'ปฏิเสธ' },
      { id: 'NotHome', label: 'ไม่อยู่' },
      { id: 'NotAllowed', label: 'ไม่อนุญาต' },
    ]
  },
  {
    id: 'type',
    title: 'ประเภทการเยี่ยม',
    options: [
      { id: 'Joint', label: 'ลงเยี่ยมพร้อม รพ.สต.' },
      { id: 'Delegated', label: 'ฝาก รพ.สต. เยี่ยม' },
    ]
  },
  {
    id: 'rph',
    title: 'หน่วยบริการ',
    options: [
      { id: 'รพ.สต. ริมใต้', label: 'รพ.สต. ริมใต้' },
      { id: 'รพ.สต. แม่สา', label: 'รพ.สต. แม่สา' },
      { id: 'รพ.นครพิงค์', label: 'รพ.นครพิงค์' },
      { id: 'รพ.สันทราย', label: 'รพ.สันทราย' },
      { id: 'รพ.ฝาง', label: 'รพ.ฝาง' },
      { id: 'รพ.มหาราชนครเชียงใหม่', label: 'รพ.มหาราชนครเชียงใหม่' },
    ]
  }
];

// Build a flat lookup map: sectionId -> optionId -> label (for Thai chip display)
const FILTER_LABEL_MAP: Record<string, Record<string, string>> = {};
HOME_VISIT_FILTER_SECTIONS.forEach(section => {
  FILTER_LABEL_MAP[section.id] = {};
  section.options.forEach(opt => {
    FILTER_LABEL_MAP[section.id][opt.id] = opt.label;
  });
});

// Mock Data for Filters
const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

// Fallback Data if HOME_VISIT_DATA is empty
const FALLBACK_DATA = [
  {
      id: 'REQ-FB-001',
      patientName: 'นาย สมชาย มั่งมี',
      patientId: 'HN001001',
      patientAddress: '123/4 ม.1 ต.ริมใต้ อ.แม่ริม จ.เชียงใหม่',
      type: 'Joint',
      rph: 'รพ.สต. ริมใต้',
      status: 'Pending',
      requestDate: '2023-11-15',
      note: 'ผู้ป่วยติดเตียง ต้องการการดูแลต่อเนื่อง'
  },
  {
      id: 'REQ-FB-002',
      patientName: 'นาง สมศรี ดีใจ',
      patientId: 'HN001002',
      patientAddress: '55 ม.3 ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่',
      type: 'Delegated',
      rph: 'รพ.นครพิงค์',
      status: 'InProgress',
      requestDate: '2023-11-10',
      note: 'ติดตามอาการเบาหวานและความดัน'
  },
  {
      id: 'REQ-FB-003',
      patientName: 'ด.ช. กล้าหาญ รักชาติ',
      patientId: 'HN001003',
      patientAddress: '88 ม.5 ต.แม่สา อ.แม่ริม จ.เชียงใหม่',
      type: 'Delegated',
      rph: 'รพ.สต. แม่สา',
      status: 'WaitVisit',
      requestDate: '2023-11-12',
      note: 'ฉีดวัคซีนและประเมินพัฒนาการ'
  },
  {
      id: 'REQ-FB-004',
      patientName: 'นาย มีชัย ชนะศึก',
      patientId: 'HN001004',
      patientAddress: '99 ม.2 ต.เหมืองแก้ว อ.แม่ริม จ.เชียงใหม่',
      type: 'Joint',
      rph: 'รพ.สันทราย',
      status: 'Completed',
      requestDate: '2023-10-30',
      note: 'แผลผ่าตัดแห้งดี ตัดไหมแล้ว'
  }
];

interface HomeVisitSystemProps {
  onBack?: () => void;
  onVisitFormStateChange?: (isOpen: boolean) => void;
  initialSearch?: string;
  onViewDetail?: (visit: any) => void;
}

export function HomeVisitSystem({ onBack, onVisitFormStateChange, initialSearch, onViewDetail }: HomeVisitSystemProps) {
  // --- State ---
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch === 'all' ? "" : (initialSearch || ""));
  
  // SuperFilter State (single source of truth for filtering)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  // Request Management State - Initialize from Mock Data
  const [requests, setRequests] = useState<any[]>(() => {
      // 1. Try to use imported data
      let sourceData = HOME_VISIT_DATA;
      
      // 2. If empty or undefined, use fallback data to ensure list is populated
      if (!sourceData || sourceData.length === 0) {
          sourceData = FALLBACK_DATA;
      }

      return sourceData.map(visit => ({
          ...visit,
          // Ensure essential fields exist with fallbacks
          id: visit.id || `REQ-${Math.random().toString(36).substr(2, 9)}`,
          patientName: visit.patientName || visit.name || "ไม่ระบุชื่อ",
          patientId: visit.patientId || visit.hn || "-",
          patientAddress: visit.patientAddress || 'ไม่ระบุที่อยู่',
          type: visit.type || 'Joint', 
          rph: visit.rph || visit.provider || 'รพ.สต. สันป่าตอง',
          status: visit.status || 'Pending',
          requestDate: visit.requestDate || visit.date || new Date().toLocaleDateString('th-TH')
      }));
  });

  // UI States
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Sync with App Sidebar
  useEffect(() => {
    if (onVisitFormStateChange) {
      onVisitFormStateChange(isCreating);
    }
  }, [isCreating, onVisitFormStateChange]);

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

  // --- Local filtering: search + SuperFilter ---
  const getFilteredRequests = () => {
    return requests.filter(req => {
      // 1. Status filter (multi-select)
      const statusFilter = activeFilters['status'];
      const matchesStatus = !statusFilter?.length || statusFilter.includes(req.status);

      // 2. Visit Type filter (multi-select)
      const typeFilter = activeFilters['type'];
      const matchesType = !typeFilter?.length || typeFilter.includes(req.type);

      // 3. RPH / Provider filter (multi-select)
      const rphFilter = activeFilters['rph'];
      const matchesRph = !rphFilter?.length || rphFilter.some(r => req.rph && req.rph.includes(r));

      // 4. Search filter
      const term = searchTerm.toLowerCase().trim();
      const searchMatch = !term || 
          (req.patientName && req.patientName.toLowerCase().includes(term)) || 
          (req.patientId && req.patientId.toLowerCase().includes(term));

      return matchesStatus && matchesType && matchesRph && searchMatch; 
    });
  };

  // --- Handlers ---

  const handleCreateRequest = (data: any) => {
    const now = new Date();
    const request = {
      id: `REQ-${Date.now()}`,
      patientName: data.patientName,
      patientId: data.patientId,
      patientAddress: data.patientAddress,
      patientImage: data.patientImage,
      type: data.type,
      rph: data.rph,
      provider: data.rph, 
      requestDate: now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
      rawDate: now.toISOString(),
      status: 'Pending',
      note: data.note,
      title: 'เยี่ยมบ้านใหม่',
      name: data.patientName,
      hn: data.patientId,
      date: now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
    };

    setRequests([request, ...requests]);

    // Update Global Mock Data
    HOME_VISIT_DATA.unshift({
        ...request,
        patientAddress: request.patientAddress || 'ไม่ระบุที่อยู่',
    });

    const targetPatient = PATIENTS_DATA.find(p => p.hn === request.patientId || p.id === request.patientId);
    if (targetPatient) {
        if (!targetPatient.visitHistory) targetPatient.visitHistory = [];
        targetPatient.visitHistory.unshift({
            date: request.date,
            rawDate: request.rawDate,
            title: request.title,
            provider: request.provider,
            status: request.status,
            type: request.type
        });
    }

    setIsCreating(false);
    toast.success("ส่งคำขอเยี่ยมบ้านเรียบร้อยแล้ว", {
      description: `แจ้งเตือนไปยัง ${request.rph} แล้ว`
    });
  };

  const handleCancelRequest = (id: string) => {
    if (confirm("ยืนยันการยกเลิกคำขอ?")) {
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success("ยกเลิกคำขอเรียบร้อยแล้ว");
    }
  };

  if (isCreating) {
    return (
      <HomeVisitADD 
        onBack={() => setIsCreating(false)} 
        onSubmit={handleCreateRequest}
      />
    );
  }

  if (selectedRequest) {
    return (
      <VisitDetail 
        visit={selectedRequest} 
        onBack={() => setSelectedRequest(null)} 
        onCancelRequest={(id) => {
            handleCancelRequest(id);
            setSelectedRequest(null);
        }}
        onOpenForm={() => setIsEditingForm(true)}
      />
    );
  }

  const displayedRequests = getFilteredRequests();

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">ระบบเยี่ยมบ้าน</h1>
      </div>

      <div className="px-6 py-4 flex justify-end">
             <button 
                className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
                onClick={() => setIsCreating(true)}
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

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4">
          
          {/* Search and Filter Row (New Style) */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2 w-full">
                 <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="ค้นหาผู้ป่วย, HN..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white border-slate-200 rounded-xl h-12 text-sm shadow-sm focus:ring-teal-500" 
                    />
                </div>
                 
                 <SuperFilter 
                    sections={HOME_VISIT_FILTER_SECTIONS}
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
                          <span key={`${key}-${v}`} className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-bold border border-teal-100 flex items-center gap-1">
                              {FILTER_LABEL_MAP[key][v]} 
                              <button onClick={() => handleRemoveFilterChip(key, v)}>×</button>
                          </span>
                      ))
                  )}
              </div>
          )}

          <div className="flex items-center justify-between px-1">
               <h3 className="font-bold text-slate-700 text-lg text-[14px]">รายการคำขอเยี่ยมบ้าน</h3>
               <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{displayedRequests.length} รายการ</span>
          </div>

          <div className="space-y-4">
             {displayedRequests.map(req => (
                 <Card key={req.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => {
                     if (onViewDetail) onViewDetail(req);
                     else setSelectedRequest(req);
                 }}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Right Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                {/* Header Row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                            {req.patientName}
                                        </h3>
                                        <div className="mt-0.5">
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">
                                                {req.patientId}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Status Badge */}
                                        {req.status === 'Pending' && (
                                            <div className="bg-[#fff0e1] px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#ff9f43] text-[12px]">รอการตอบรับ</span>
                                            </div>
                                        )}
                                        {req.status === 'WaitVisit' && (
                                            <div className="bg-yellow-100 px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-yellow-700 text-[12px]">รอเยี่ยม</span>
                                            </div>
                                        )}
                                        {req.status === 'InProgress' && (
                                            <div className="bg-[#E0FBFC] px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">ดำเนินการ</span>
                                            </div>
                                        )}
                                        {req.status === 'Completed' && (
                                            <div className="bg-[#E5F8ED] px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#28C76F] text-[12px]">เสร็จสิ้น</span>
                                            </div>
                                        )}
                                        {req.status === 'Rejected' && (
                                            <div className="bg-[#FCEAEA] px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#EA5455] text-[12px]">ปฏิเสธ</span>
                                            </div>
                                        )}
                                        {req.status === 'NotHome' && (
                                            <div className="bg-[#F8F8F8] px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#B9B9C3] text-[12px]">ไม่อยู่</span>
                                            </div>
                                        )}
                                        {req.status === 'NotAllowed' && (
                                            <div className="bg-[#FCEAEA] px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#EA5455] text-[12px]">ไม่อนุญาต</span>
                                            </div>
                                        )}
                                        
                                    </div>
                                </div>

                                {/* Details Row */}
                                <div className="flex items-center justify-between w-full mt-1">
                                    {/* Visit Type */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-[16px] h-[16px]">
                                            <VisitTypeIcon />
                                        </div>
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[14px]">
                                            {req.type === 'Joint' ? 'ลงเยี่ยมพร้อม รพ.สต.' : 'ฝาก รพ.สต. เยี่ยม'}
                                        </span>
                                    </div>
                                    <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                                         {(req.requestDate) && String(req.requestDate).match(/^\d{4}-\d{2}-\d{2}$/) 
                                            ? new Date(req.requestDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) 
                                            : (req.requestDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
             {displayedRequests.length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบรายการคำขอ</p>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
}