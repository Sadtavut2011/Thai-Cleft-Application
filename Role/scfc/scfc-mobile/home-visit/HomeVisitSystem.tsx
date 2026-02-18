import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent } from "../../../../components/ui/card";
import { 
  ChevronLeft,
  Search, 
  Home,
  MapPin,
  Building2,
  ChevronDown,
  Filter,
  Clock,
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
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE, formatThaiDateShort, formatThaiDateWithDay } from "../../../../components/shared/ThaiCalendarDrawer";

// --- Home Visit filter sections (ไม่มีสถานะ — ย้ายออกเป็น pills แล้ว) ---
const HOME_VISIT_FILTER_SECTIONS = [
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
    requestDate: '2025-12-04',
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
    requestDate: '2025-12-04',
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
    requestDate: '2025-12-04',
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
    requestDate: '2025-12-03',
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

  // Status pill state (extracted from SuperFilter)
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // SuperFilter State (type + rph only, no status)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Calendar date filter state — default: null (show all)
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  // Request Management State - Initialize from Mock Data
  const [requests, setRequests] = useState<any[]>(() => {
    let sourceData = HOME_VISIT_DATA;
    if (!sourceData || sourceData.length === 0) {
      sourceData = FALLBACK_DATA;
    }
    return sourceData.map(visit => ({
      ...visit,
      id: visit.id || `REQ-${Math.random().toString(36).substr(2, 9)}`,
      patientName: visit.patientName || (visit as any).name || "ไม่ระบุชื่อ",
      patientId: visit.patientId || (visit as any).hn || "-",
      patientAddress: visit.patientAddress || 'ไม่ระบุที่อยู่',
      type: visit.type || 'Joint',
      rph: visit.rph || (visit as any).provider || '-',
      status: visit.status || 'Pending',
      requestDate: visit.requestDate || (visit as any).date || new Date().toISOString().split('T')[0]
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

  // Status pills (purple theme)
  const STATUS_PILLS = [
    { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#49358E] text-white shadow-md shadow-[#49358E]/20' },
    { id: 'Pending', label: 'รอตอบรับ', color: 'bg-orange-50 text-orange-600 border border-orange-200', activeColor: 'bg-orange-500 text-white shadow-md shadow-orange-200' },
    { id: 'WaitVisit', label: 'รอเยี่ยม', color: 'bg-yellow-50 text-yellow-600 border border-yellow-200', activeColor: 'bg-yellow-500 text-white shadow-md shadow-yellow-200' },
    { id: 'InProgress', label: 'ดำเนินการ', color: 'bg-cyan-50 text-cyan-600 border border-cyan-200', activeColor: 'bg-cyan-500 text-white shadow-md shadow-cyan-200' },
    { id: 'Completed', label: 'เสร็จสิ้น', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
    { id: 'Rejected', label: 'ปฏิเสธ', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
    { id: 'NotHome', label: 'ไม่อยู่', color: 'bg-gray-50 text-gray-500 border border-gray-200', activeColor: 'bg-gray-500 text-white shadow-md shadow-gray-200' },
    { id: 'NotAllowed', label: 'ไม่อนุญาต', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' }
  ];

  // Drag-to-scroll for status pills
  const statusScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingStatus = useRef(false);
  const startXStatus = useRef(0);
  const scrollLeftStatus = useRef(0);
  const handleStatusMouseDown = useCallback((e: React.MouseEvent) => { isDraggingStatus.current = true; startXStatus.current = e.pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeftStatus.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const handleStatusMouseMove = useCallback((e: React.MouseEvent) => { if (!isDraggingStatus.current || !statusScrollRef.current) return; e.preventDefault(); const x = e.pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = scrollLeftStatus.current - (x - startXStatus.current) * 1.5; }, []);
  const handleStatusMouseUp = useCallback(() => { isDraggingStatus.current = false; }, []);
  const handleStatusTouchStart = useCallback((e: React.TouchEvent) => { isDraggingStatus.current = true; startXStatus.current = e.touches[0].pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeftStatus.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const handleStatusTouchMove = useCallback((e: React.TouchEvent) => { if (!isDraggingStatus.current || !statusScrollRef.current) return; const x = e.touches[0].pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = scrollLeftStatus.current - (x - startXStatus.current) * 1.5; }, []);

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

  // --- Filtering Logic (flat list, no tabs) ---
  const getFilteredRequests = () => {
    return requests.filter(req => {
      // 1. Status pill filter
      const statusMatch = filterStatus === 'All' || req.status === filterStatus;

      // 2. Visit Type filter (from SuperFilter)
      const typeFilter = activeFilters['type'];
      const matchesType = !typeFilter?.length || typeFilter.includes(req.type);

      // 3. RPH / Provider filter (from SuperFilter)
      const rphFilter = activeFilters['rph'];
      const matchesRph = !rphFilter?.length || rphFilter.some(r => req.rph && req.rph.includes(r));

      // 4. Search filter
      const term = searchTerm.toLowerCase().trim();
      const searchMatch = !term ||
        (req.patientName && req.patientName.toLowerCase().includes(term)) ||
        (req.patientId && req.patientId.toLowerCase().includes(term));

      // 5. Calendar date filter
      let matchesDate = true;
      if (filterDate) {
        const y = filterDate.getFullYear();
        const m = String(filterDate.getMonth() + 1).padStart(2, '0');
        const d = String(filterDate.getDate()).padStart(2, '0');
        const selectedDateStr = `${y}-${m}-${d}`;
        const reqDateStr = String(req.requestDate || '');
        if (reqDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          matchesDate = reqDateStr === selectedDateStr;
        }
      }

      return statusMatch && matchesType && matchesRph && searchMatch && matchesDate;
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
      requestDate: now.toISOString().split('T')[0],
      rawDate: now.toISOString(),
      status: 'Pending',
      note: data.note,
      title: 'เยี่ยมบ้านใหม่',
      name: data.patientName,
      hn: data.patientId,
      date: now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
    };

    setRequests([request, ...requests]);

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
    <div className="bg-white min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-white text-lg font-bold">ระบบเยี่ยมบ้าน</h1>
      </div>

      {/* FAB */}
      <div className="px-6 py-4 flex justify-end">
        <button
          className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity"
          onClick={() => setIsCreating(true)}
        />
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4 -mt-4">

        {/* Search + SuperFilter + Calendar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#C4BFFA] flex flex-col gap-3">
          <div className="flex gap-2 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7066A9]" />
              <Input
                placeholder="ค้นหาผู้ป่วย, HN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#F4F0FF]/30 border-[#C4BFFA] rounded-xl h-12 text-sm shadow-sm focus:ring-[#7066A9] focus:border-[#7066A9]"
              />
            </div>

            <SuperFilter
              sections={HOME_VISIT_FILTER_SECTIONS}
              activeFilters={activeFilters}
              onApply={handleSuperFilterApply}
              onClear={() => { setActiveFilters({}); }}
            />

            <CalendarFilterButton filterDate={filterDate} onDateSelect={setFilterDate} accentColor="#49358E" drawerTitle="กรองวันที่" />
          </div>
        </div>

        {/* Horizontal Scrollable Status Pills */}
        <div
          ref={statusScrollRef}
          className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1"
          onMouseDown={handleStatusMouseDown}
          onMouseMove={handleStatusMouseMove}
          onMouseUp={handleStatusMouseUp}
          onMouseLeave={handleStatusMouseUp}
          onTouchStart={handleStatusTouchStart}
          onTouchMove={handleStatusTouchMove}
          onTouchEnd={handleStatusMouseUp}
        >
          {STATUS_PILLS.map((option) => (
            <button
              key={option.id}
              onClick={() => setFilterStatus(option.id)}
              className={cn(
                "px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                filterStatus === option.id ? option.activeColor : option.color
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Active Filters Display (type + rph chips) */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, values]) =>
              values.map(v => (
                <span key={`${key}-${v}`} className="bg-[#F4F0FF] text-[#7066A9] px-2 py-1 rounded text-xs border border-[#C4BFFA] flex items-center gap-1">
                  {FILTER_LABEL_MAP[key]?.[v] || v}
                  <button onClick={() => handleRemoveFilterChip(key, v)} className="hover:text-[#49358E]">
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>
        )}

        {/* Date Label */}
        <DateFilterLabel filterDate={filterDate} />

        {/* Count */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[#5B4FCC] text-sm">รายการคำขอเยี่ยมบ้าน</h3>
          <span className="text-[10px] text-[#7066A9] bg-[#F4F0FF] px-2 py-0.5 rounded-full border border-[#C4BFFA]">{displayedRequests.length} รายการ</span>
        </div>

        {/* Request Cards */}
        <div className="space-y-3">
          {displayedRequests.map(req => (
            <Card key={req.id} className="bg-white border-[#C4BFFA] shadow-sm rounded-xl active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group hover:border-[#9b93f5] hover:shadow-md hover:shadow-[#7066A9]/5" onClick={() => {
              if (onViewDetail) onViewDetail(req);
              else setSelectedRequest(req);
            }}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                          {req.patientName || req.name}
                        </h3>
                        <div className="mt-0.5">
                          <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">
                            HN: {req.patientId || req.hn}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
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
                      <div className="flex items-center gap-2">
                        <div className="w-[16px] h-[16px]">
                          <VisitTypeIcon />
                        </div>
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7066A9] text-[16px]">
                          {req.rph || 'ไม่ระบุหน่วยบริการ'}
                        </span>
                      </div>
                      <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                        {(req.requestDate || req.date) && String(req.requestDate || req.date).match(/^\d{4}-\d{2}-\d{2}$/)
                          ? new Date(req.requestDate || req.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
                          : (req.requestDate || req.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {displayedRequests.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#C4BFFA] text-[#9b93f5]">
              <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>ไม่พบรายการคำขอ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}