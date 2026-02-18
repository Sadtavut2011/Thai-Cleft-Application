import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Label } from "../../../../components/ui/label";
import { 
  ChevronLeft,
  Search, 
  Home,
  MapPin,
  History,
  Filter,
  CalendarDays,
  Users,
  Building2,
  X as XIcon
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import { HomeVisitADD } from "./forms/HomeVisitADD";
import { VisitDetail } from "../patient/History/VisitDetail"; 
import Icon from "../../../../imports/Icon";
import { VisitRequest } from "./types";
import VisitTypeIcon from "../../../../imports/Icon-4061-1646";
import DocIcon from "../../../../imports/Icon-4061-1692";
import EditIcon from "../../../../imports/Icon-4062-1729";
import DeleteIcon from "../../../../imports/Icon-4062-1733";
import { HOME_VISIT_DATA, PATIENTS_DATA } from "../../../../data/patientData";
import { SystemFilterDrawer, GenericFilterState, FilterTabConfig, FilterListOption } from "../../../../components/shared/SystemFilterDrawer";
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE, formatThaiDateShort, formatThaiDateWithDay } from "../../../../components/shared/ThaiCalendarDrawer";

interface HomeVisitSystemProps {
  onBack?: () => void;
  onVisitFormStateChange?: (isOpen: boolean) => void;
  initialSearch?: string;
  onViewDetail?: (visit: any) => void;
  role?: string;
}

export function HomeVisitSystem({ onBack, onVisitFormStateChange, initialSearch, onViewDetail, role }: HomeVisitSystemProps) {
  // --- State ---
  const [activeTab, setActiveTab] = useState("requests");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [drawerFilters, setDrawerFilters] = useState<GenericFilterState>({ unit: [] });
  
  // Calendar date filter state — default: 4 ธ.ค. 68 (Dec 4, 2025)
  const [filterDate, setFilterDate] = useState<Date>(DEFAULT_FILTER_DATE);
  
  // 1. Request Management State - Initialize from Mock Data
  const [requests, setRequests] = useState<any[]>(() => {
      // Map HOME_VISIT_DATA to match the UI needs if necessary, or use as is since VisitDetail is flexible
      return HOME_VISIT_DATA.map(visit => ({
          ...visit,
          // Ensure fields expected by UI logic exist
          patientId: visit.hn,
          patientAddress: visit.patientAddress || 'ไมระบุที่อยู่', // Will be populated from patientData
          type: visit.type, // Preserve original type (Routine/Joint/Delegated)
          rph: visit.rph || '-', // Derive from patientData
          status: visit.status // Use normalized status from data source
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

  const STATUS_PILLS = [
    { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#7367f0] text-white shadow-md shadow-indigo-200' },
    { id: 'Pending', label: 'รอตอบรับ', color: 'bg-orange-50 text-orange-600 border border-orange-200', activeColor: 'bg-orange-500 text-white shadow-md shadow-orange-200' },
    { id: 'WaitVisit', label: 'รอเยี่ยม', color: 'bg-yellow-50 text-yellow-600 border border-yellow-200', activeColor: 'bg-yellow-500 text-white shadow-md shadow-yellow-200' },
    { id: 'InProgress', label: 'ดำเนินการ', color: 'bg-cyan-50 text-cyan-600 border border-cyan-200', activeColor: 'bg-cyan-500 text-white shadow-md shadow-cyan-200' },
    { id: 'Rejected', label: 'ปฏิเสธ', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
    { id: 'NotHome', label: 'ไม่อยู่', color: 'bg-gray-50 text-gray-500 border border-gray-200', activeColor: 'bg-gray-500 text-white shadow-md shadow-gray-200' },
    { id: 'NotAllowed', label: 'ไม่อนุญาต', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' }
  ];

  const VISIT_FILTER_TABS: FilterTabConfig[] = [
    { key: 'unit', label: 'หน่วยบริการ', type: 'list', searchPlaceholder: 'ค้นหาหน่วยบริการ...', categories: ['ทั้งหมด', 'รพ.สต.'], options: [
      { id: 'u1', label: 'รพ.สต.ริมใต้', description: 'ตำบลริมใต้ อ.แม่ริม', category: 'รพ.สต.' },
      { id: 'u2', label: 'รพ.สต.แม่งอน', description: 'ตำบลแม่งอน อ.ฝาง', category: 'รพ.สต.' },
      { id: 'u3', label: 'รพ.สต.ช้างเผือก', description: 'ตำบลช้างเผือก อ.เมืองเชียงใหม่', category: 'รพ.สต.' },
    ], emptyText: 'ไม่พบหน่วยบริการ', emptyIcon: <Building2 className="w-10 h-10 mb-2 opacity-30" /> },
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

  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

    const getFilteredRequests = (tabType: 'Delegated' | 'Joint') => {
    return requests.filter(req => {
      const reqType = req.type; 
      let typeMatch = false;
      if (tabType === 'Delegated') typeMatch = (reqType === 'Delegated');
      if (tabType === 'Joint') typeMatch = (reqType === 'Joint');
      if (req.status === 'Completed') return false;
      const statusMatch = filterStatus === 'All' || req.status === filterStatus;
      const searchMatch = !initialSearch || 
          (req.patientName && req.patientName.includes(initialSearch)) || 
          (req.patientId && req.patientId.includes(initialSearch));

      // Calendar date filter — match requestDate with selected filterDate
      let matchesDate = true;
      if (filterDate) {
        const y = filterDate.getFullYear();
        const m = String(filterDate.getMonth() + 1).padStart(2, '0');
        const d = String(filterDate.getDate()).padStart(2, '0');
        const selectedDateStr = `${y}-${m}-${d}`; // timezone-safe "YYYY-MM-DD"
        const reqDateStr = String(req.requestDate || '');
        // Compare only if requestDate is in ISO format
        if (reqDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          matchesDate = reqDateStr === selectedDateStr;
        }
      }

      // Drawer unit filter
      let matchesUnit = true;
      const unitArr = Array.isArray(drawerFilters.unit) ? drawerFilters.unit as string[] : [];
      if (unitArr.length > 0) {
        matchesUnit = unitArr.some(u => (req.rph || '').includes(u));
      }

      return typeMatch && statusMatch && searchMatch && matchesUnit && matchesDate;
    });
  };

  const getHistoryRequests = () => {
    const filtered = requests.filter(req => {
      // Show ALL statuses in history
      const searchMatch = !initialSearch || 
          (req.patientName && req.patientName.includes(initialSearch)) || 
          (req.patientId && req.patientId.includes(initialSearch));

      // Drawer unit filter
      let matchesUnit = true;
      const unitArr = Array.isArray(drawerFilters.unit) ? drawerFilters.unit as string[] : [];
      if (unitArr.length > 0) {
        matchesUnit = unitArr.some(u => (req.rph || '').includes(u));
      }

      return searchMatch && matchesUnit;
    });
    // Sort by requestDate descending (newest first)
    return filtered.sort((a, b) => {
      const dateA = String(a.requestDate || '');
      const dateB = String(b.requestDate || '');
      return dateB.localeCompare(dateA);
    });
  };

  // Group requests by requestDate for history display
  const groupByDate = (items: any[]) => {
    const groups: { date: string; label: string; items: any[] }[] = [];
    const map = new Map<string, any[]>();
    items.forEach(item => {
      const dateKey = String(item.requestDate || 'unknown');
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(item);
    });
    // Sort date keys descending
    const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    sortedKeys.forEach(dateKey => {
      let label = dateKey;
      if (dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const d = new Date(dateKey + 'T00:00:00');
        label = formatThaiDateWithDay(d);
      }
      groups.push({ date: dateKey, label, items: map.get(dateKey)! });
    });
    return groups;
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
      provider: data.rph, // Sync for HistoryTab
      requestDate: now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
      rawDate: now.toISOString(), // Sync for HistoryTab sorting
      status: 'Pending',
      note: data.note,
      title: 'เยี่ยมบ้านใหม่', // Sync for HistoryTab title
      name: data.patientName, // Compat
      hn: data.patientId, // Compat
      date: now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) // Sync for HistoryTab display
    };

    // Update Local State
    setRequests([request, ...requests]);

    // Update Global Mock Data (Persistence Sim)
    // 1. Add to HOME_VISIT_DATA so it appears in this list if re-mounted
    HOME_VISIT_DATA.unshift({
        ...request,
        patientAddress: request.patientAddress || 'ไม่ระบุที่อยู่',
    });

    // 2. Add to PATIENTS_DATA so it appears in PatientHistoryTab
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

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">ระบบเยี่ยมบ้าน</h1>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, เลขที่ส่งตัว..." 
                      defaultValue={initialSearch}
                      className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" 
                    />
                </div>
                
                <SystemFilterDrawer
                  tabs={VISIT_FILTER_TABS}
                  filters={drawerFilters}
                  onApply={setDrawerFilters}
                  title="ตัวกรอง (Filter)"
                  description="กรองรายการเยี่ยมบ้าน"
                  trigger={
                    <button className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm relative",
                      ((Array.isArray(drawerFilters.unit) && (drawerFilters.unit as string[]).length > 0))
                        ? "bg-[#7367f0] text-white border border-[#7367f0] hover:bg-[#685dd8]"
                        : "bg-white border border-gray-200 text-slate-500 hover:bg-slate-50"
                    )}>
                      <Filter className="w-5 h-5" />
                    </button>
                  }
                />
                <CalendarFilterButton filterDate={filterDate} onDateSelect={setFilterDate} accentColor="#28c76f" drawerTitle="กรองวันที่" />
             </div>
             
             <TabsList className={cn("bg-[#F3F4F6] p-1 h-12 rounded-xl grid w-full", role === 'pcu' ? 'grid-cols-2' : 'grid-cols-3')}>
                <TabsTrigger value="requests" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold relative text-[16px]">
                   ฝากเยี่ยม
                   {requests.filter(r => r.status === 'Pending' && r.type === 'Delegated').length > 0 && 
                     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {requests.filter(r => r.status === 'Pending' && r.type === 'Delegated').length}
                     </span>
                   }
                </TabsTrigger>
                {role !== 'pcu' && (
                <TabsTrigger value="joint" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold text-[16px]">
                   ลงเยี่ยมร่วม
                </TabsTrigger>
                )}
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold text-[16px]">
                   ประวัติ
                </TabsTrigger>
             </TabsList>
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

          {/* Date Label (after status pills, matching FundingSystem pattern) */}
          {activeTab !== 'history' && <DateFilterLabel filterDate={filterDate} />}

          {/* --- Tab 1: Delegated Requests (ฝากเยี่ยม) --- */}
          <TabsContent value="requests" className="space-y-4 mt-2">
             {getFilteredRequests('Delegated').map(req => (
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
                                            {req.patientName || req.name}
                                        </h3>
                                        <div className="mt-0.5">
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">
                                                HN:{req.patientId || req.hn}
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
                                    {/* Responsible Unit */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-[16px] h-[16px]">
                                            <VisitTypeIcon />
                                        </div>
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[16px]">
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
             {getFilteredRequests('Delegated').length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบรายการคำขอ</p>
                 </div>
             )}
          </TabsContent>
          
          {/* --- Tab 2: Joint Visits (ลงเยี่ยมร่วม) --- */}
          <TabsContent value="joint" className="space-y-4 mt-2">
             {getFilteredRequests('Joint').map(req => (
                 <Card key={req.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => setSelectedRequest(req)}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Right Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                {/* Header Row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                            {req.patientName || req.name}
                                        </h3>
                                        <div className="mt-0.5">
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">
                                                HN:{req.patientId || req.hn}
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
                                    {/* Responsible Unit */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-[16px] h-[16px]">
                                            <VisitTypeIcon />
                                        </div>
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[16px]">
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
             {getFilteredRequests('Joint').length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบรายการลงเยี่ยมร่วม</p>
                 </div>
             )}
          </TabsContent>

          {/* --- Tab 3: History (Completed) --- */}
          <TabsContent value="history" className="space-y-4 mt-2">
            {groupByDate(getHistoryRequests()).map(group => (
              <div key={group.date} className="space-y-3">
                {/* Date Divider */}
                <div className="flex items-center gap-3 px-1 py-1">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-[15px] text-[#b4b7bd] whitespace-nowrap">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                {group.items.map(req => (
                 <Card key={req.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => setSelectedRequest(req)}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Right Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                {/* Header Row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                            {req.patientName || req.name}
                                        </h3>
                                        <div className="mt-0.5">
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">
                                                HN:{req.patientId || req.hn}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Dynamic Status Badge */}
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
                                    {/* Responsible Unit */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-[16px] h-[16px]">
                                            <VisitTypeIcon />
                                        </div>
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[16px]">
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
              </div>
            ))}
             {getHistoryRequests().length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบประวัติการเยี่ยม</p>
                 </div>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}