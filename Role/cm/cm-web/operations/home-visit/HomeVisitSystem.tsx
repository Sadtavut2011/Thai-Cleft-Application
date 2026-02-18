import React, { useState, useMemo } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  MoreHorizontal, 
  User, 
  Phone,
  Navigation,
  FileText, 
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  Filter,
  Home
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";

import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { th } from "date-fns/locale";
import { HomeVisitRequestDetail } from "./HomeVisitRequestDetail";
import { CreateHomeVisitPage } from "./CreateHomeVisitPage";
import { HomeVisitForms } from "./HomeVisitForms";
import { HOME_VISIT_DATA, PATIENTS_DATA } from "../../../../../data/patientData";
import type { HomeVisitStatus } from "../../../../../data/types";
import { formatHomeVisitStatus, getHomeVisitStatusStyle } from "../../../../../data/statusUtils";
import { formatThaiDateWithDay } from "../../../../../components/shared/ThaiCalendarDrawer";
import { WebCalendarView, ViewModeToggle } from "../shared/WebCalendarView";

const THAI_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

interface HomeVisitSystemProps {
  onBack?: () => void;
  onViewPatient?: (patient: any) => void;
}

// --- Mock Data Types ---

// Using shared HomeVisitStatus type from /data/types.ts
interface VisitRequest {
  id: string;
  patientName: string;
  patientId: string; // HN
  hn?: string;
  patientAddress: string;
  type: 'Joint' | 'Delegated' | 'Routine';
  rph: string;
  requestDate: string;
  date?: string;
  time?: string;
  status: HomeVisitStatus;
  note?: string;
  patientImage?: string;
  patientDob?: string;
  patientGender?: string;
  diagnosis?: string;
  images?: string[];
  data?: any;
}

interface VisitForm {
  id: string;
  requestId: string;
  patientName: string;
  visitDate: string;
  visitorName: string;
  vitalSigns: {
    bp: string; // Blood Pressure
    pulse: string;
    temp: string;
  };
  symptoms: string;
  photos: string[];
}

export function HomeVisitSystem({ onBack, onViewPatient }: HomeVisitSystemProps) {
  // --- State ---
  const [activeTab, setActiveTab] = useState("requests");
  const [requestToEdit, setRequestToEdit] = useState<VisitRequest | null>(null);
  const [filterUnit, setFilterUnit] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<Date>(new Date(2025, 11, 4)); // Default: 4 ธ.ค. 68

  // Initialize requests from HOME_VISIT_DATA (Data Source Synchronization)
  const [requests, setRequests] = useState<VisitRequest[]>(() => {
      // If HOME_VISIT_DATA is available, use it. Otherwise fallback to PATIENTS_DATA mapping
      if (HOME_VISIT_DATA && HOME_VISIT_DATA.length > 0) {
          return HOME_VISIT_DATA.map(visit => ({
              id: visit.id,
              patientName: visit.patientName,
              patientId: visit.hn,
              hn: visit.hn,
              patientAddress: visit.patientAddress || "ไม่ระบุที่อยู่",
              type: visit.type as 'Joint' | 'Delegated' | 'Routine',
              rph: visit.rph || "รพ.สต.",
              requestDate: visit.requestDate,
              date: visit.date,
              time: visit.time,
              status: visit.status as any,
              note: visit.note,
              patientImage: visit.patientImage,
              patientDob: visit.patientDob,
              patientGender: visit.patientGender,
              diagnosis: visit.diagnosis,
              images: visit.images,
              data: visit.data
          }));
      }
      // Fallback (Logic from previous turn)
      return PATIENTS_DATA.slice(0, 5).map((patient, index) => ({
        id: `REQ-${String(index + 1).padStart(3, '0')}`,
        patientName: patient.name,
        patientId: patient.hn,
        patientAddress: patient.contact.address || "ไม่ระบุที่อยู่",
        type: index % 2 === 0 ? 'Joint' as const : 'Delegated' as const,
        rph: patient.hospitalInfo?.responsibleRph || patient.responsibleHealthCenter || '-',
        requestDate: (() => { const d = new Date(); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; })(),
        status: (index === 0 ? 'Pending' : index === 1 ? 'WaitVisit' : 'Completed') as VisitRequest['status'],
        note: "ติดตามอาการทั่วไป"
      }));
  });

  // UI States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditF1Open, setIsEditF1Open] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetApt, setTargetApt] = useState<VisitRequest | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState<string | null>(null);
  const [calendarSubTab, setCalendarSubTab] = useState<string>('Delegated');

  // --- Logic for Tabs & Filtering (Matched with Mobile) ---
  const getFilteredRequests = (tabType: 'Delegated' | 'Joint') => {
    return requests.filter(req => {
      // 1. Filter by Type
      if (req.type !== tabType) return false;
      
      // 2. Exclude Completed (History Logic)
      if (req.status === 'Completed') return false;

      // 3. Search Filter
      const matchSearch = 
          req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          req.patientId.toLowerCase().includes(searchQuery.toLowerCase());

      // 4. Unit Filter
      const matchUnit = filterUnit === 'all' || (req.rph || '').includes(filterUnit);

      // 5. Status Filter
      const matchStatus = filterStatus === 'all' || req.status === filterStatus;

      // 6. Calendar date filter — match requestDate with selected filterDate
      let matchDate = true;
      if (filterDate) {
        const y = filterDate.getFullYear();
        const m = String(filterDate.getMonth() + 1).padStart(2, '0');
        const d = String(filterDate.getDate()).padStart(2, '0');
        const selectedDateStr = `${y}-${m}-${d}`; // timezone-safe "YYYY-MM-DD"
        const reqDateStr = String(req.requestDate || '');
        if (reqDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          matchDate = reqDateStr === selectedDateStr;
        }
      }
          
      return matchSearch && matchUnit && matchStatus && matchDate;
    });
  };

  const getHistoryRequests = () => {
    const filtered = requests.filter(req => {
      // Show ALL statuses in history (no status filter)

      // Search Filter
      const matchSearch = 
          req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          req.patientId.toLowerCase().includes(searchQuery.toLowerCase());

      // Unit Filter
      const matchUnit = filterUnit === 'all' || (req.rph || '').includes(filterUnit);
          
      return matchSearch && matchUnit;
    });
    // Sort by requestDate descending (newest first)
    return filtered.sort((a, b) => {
      const dateA = String(a.requestDate || '');
      const dateB = String(b.requestDate || '');
      return dateB.localeCompare(dateA);
    });
  };

  // Group requests by requestDate for history display
  const groupByDate = (items: VisitRequest[]) => {
    const groups: { date: string; label: string; items: VisitRequest[] }[] = [];
    const map = new Map<string, VisitRequest[]>();
    items.forEach(item => {
      const dateKey = String(item.requestDate || 'unknown');
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(item);
    });
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

  const handleEditRequest = (data: any) => {
    if (!requestToEdit) return;
    
    setRequests(prev => prev.map(req => 
      req.id === requestToEdit.id 
        ? { 
            ...req,
            patientName: data.patientName,
            patientId: data.patientId,
            patientAddress: data.patientAddress,
            type: data.type,
            rph: data.rph,
            note: data.note
          } 
        : req
    ));
    setRequestToEdit(null);
    toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
  };

  const handleCreateRequest = (data: any) => {
    const request: VisitRequest = {
      id: `REQ-${Date.now()}`,
      patientName: data.patientName,
      patientId: data.patientId,
      patientAddress: data.patientAddress,
      type: data.type,
      rph: data.rph,
      requestDate: (() => { const d = new Date(); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; })(),
      status: 'Pending',
      note: data.note
    };

    setRequests([request, ...requests]);
    setIsCreateOpen(false);
    toast.success("ส่งคำขอเยี่ยมบ้านเรียบร้อยล้ว", {
      description: `แจ้งเตือนไปยัง ${request.rph} แล้ว`
    });
  };

  // --- Early returns for full-page sub-views (same pattern as AppointmentSystem) ---

  if (isCreateOpen) {
    return (
      <CreateHomeVisitPage 
        onBack={() => setIsCreateOpen(false)}
        onSubmit={handleCreateRequest}
      />
    );
  }

  if (requestToEdit) {
    return (
      <CreateHomeVisitPage 
        onBack={() => setRequestToEdit(null)}
        onSubmit={handleEditRequest}
        initialData={requestToEdit}
      />
    );
  }

  if (isEditF1Open) {
    return <HomeVisitForms onBack={() => setIsEditF1Open(false)} />;
  }

  if (selectedRequest) {
    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
        <HomeVisitRequestDetail 
          visit={selectedRequest} 
          onBack={() => setSelectedRequest(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 relative font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Header Banner */}
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
              <Home className="w-5 h-5" /> ระบบเยี่ยมบ้าน (Home Visit)
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-orange-600 font-bold text-2xl">{requests.filter(r => r.status === 'Pending').length}</p>
                  <p className="text-orange-600/80 text-sm">รอการตอบรับ</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
              </div>
          </div>
          <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-cyan-600 font-bold text-2xl">{requests.filter(r => r.status === 'WaitVisit').length}</p>
                  <p className="text-cyan-600/80 text-sm">รอเยี่ยม</p>
              </div>
              <div className="bg-cyan-100 p-2 rounded-full">
                  <Home className="w-5 h-5 text-cyan-600" />
              </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{requests.filter(r => r.status === 'InProgress').length}</p>
                  <p className="text-blue-600/80 text-sm">กำลังดำเนินการ</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <Building2 className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">{requests.filter(r => ['Rejected', 'NotHome', 'NotAllowed'].includes(r.status)).length}</p>
                  <p className="text-red-600/80 text-sm">ปฏิเสธ/ไม่สำเร็จ</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="w-5 h-5 text-red-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">{requests.filter(r => r.status === 'Completed').length}</p>
                  <p className="text-green-600/80 text-sm">เยี่ยมบ้านเสร็จสิ้น</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
          </div>
      </div>

      {/* Main Content */}
      <Card className="border-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
          <div className="p-6 border-b border-[#EBE9F1] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-[18px] font-bold text-[#5e5873] flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#7367f0]" /> รายการเยี่ยมบ้าน
              </h2>
              
              <div className="flex items-center gap-3">
                  <div className="relative w-full max-w-[250px]">
                      <Input 
                          placeholder="ค้นหาจากชื่อและ HN" 
                          className="pr-10 h-[40px] border-[#EBE9F1] bg-white focus:ring-[#7367f0]" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="absolute right-0 top-0 h-full w-10 bg-[#7367f0] flex items-center justify-center rounded-r-md cursor-pointer hover:bg-[#685dd8]">
                          <Search className="h-4 w-4 text-white" />
                      </div>
                  </div>

                  <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />

                  <Button 
                      onClick={() => setIsCreateOpen(true)} 
                      className="bg-[#7367f0] hover:bg-[#685dd8] text-white font-medium px-4 py-2 h-[42px] rounded-[5px] shadow-sm gap-2"
                  >
                      <Plus className="h-4 w-4" />
                      <span>สร้างคำขอเยี่ยมบ้าน</span>
                  </Button>
              </div>
          </div>

          <div className="p-6">
            {viewMode === 'calendar' ? (
              /* ===== CALENDAR VIEW ===== */
              <div className="space-y-6">
                <WebCalendarView
                  items={requests}
                  dateField="date"
                  themeColor="#28c76f"
                  countLabel="รายการ"
                  selectedDate={calendarDate}
                  onDateSelect={setCalendarDate}
                  subTabs={[
                    { value: 'Delegated', label: 'ฝากเยี่ยม' },
                    { value: 'Joint', label: 'ลงเยี่ยมร่วม' },
                  ]}
                  activeSubTab={calendarSubTab}
                  onSubTabChange={setCalendarSubTab}
                  itemFilter={(item) => {
                    // Filter by sub-tab type
                    if (item.type !== calendarSubTab) return false;
                    // Exclude terminal statuses that don't have a scheduled visit
                    // All statuses with a `date` field should show on calendar
                    return !!item.date;
                  }}
                />

                {/* Items for selected date */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50/50">
                      <TableRow>
                        <TableHead className="w-[60px]"></TableHead>
                        <TableHead>ผู้ป่วย</TableHead>
                        <TableHead>หน่วยงานรับผิดชอบ</TableHead>
                        <TableHead>วันที่นัดหมาย</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead className="text-right">จัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const calItems = requests.filter(req => {
                          if (req.type !== calendarSubTab) return false;
                          if (!req.date) return false;
                          if (calendarDate && req.date !== calendarDate) return false;
                          // Search filter
                          if (searchQuery) {
                            const q = searchQuery.toLowerCase();
                            if (!req.patientName.toLowerCase().includes(q) && !req.patientId.toLowerCase().includes(q)) return false;
                          }
                          return true;
                        });
                        if (calItems.length === 0) {
                          return (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                                <div className="flex flex-col items-center gap-3">
                                  <Home className="w-10 h-10 opacity-20" />
                                  <p className="text-sm">{calendarDate ? 'ไม่พบรายการในวันที่เลือก' : 'เลือกวันที่เพื่อดูรายการ'}</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        }
                        return calItems.map(req => (
                          <TableRow
                            key={req.id}
                            className="cursor-pointer hover:bg-slate-50 group"
                            onClick={() => setSelectedRequest(req)}
                          >
                            <TableCell>
                              <div className={cn("p-2 rounded-lg w-fit",
                                req.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                                req.status === 'WaitVisit' ? "bg-cyan-100 text-cyan-600" :
                                req.status === 'InProgress' ? "bg-blue-100 text-blue-600" :
                                req.status === 'Completed' ? "bg-green-100 text-green-600" :
                                ['Rejected','NotHome','NotAllowed'].includes(req.status) ? "bg-red-100 text-red-600" :
                                "bg-gray-100 text-gray-600"
                              )}>
                                <Home className="w-4 h-4" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{req.patientName}</div>
                                <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {req.patientId}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" /> <span>{req.rph}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-gray-500 text-xs">
                                <CalendarIcon className="w-3 h-3" />
                                {req.date && req.date.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(req.date + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : req.date || '-'}
                                {req.time && <span className="ml-1 text-gray-400">({req.time})</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              {req.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 border-orange-200">รอตอบรับ</Badge>}
                              {req.status === 'WaitVisit' && <Badge className="bg-cyan-100 text-cyan-600 border-cyan-200">รอเยี่ยม</Badge>}
                              {req.status === 'InProgress' && <Badge className="bg-blue-100 text-blue-600 border-blue-200">ดำเนินการ</Badge>}
                              {req.status === 'Completed' && <Badge className="bg-green-100 text-green-600 border-green-200">เสร็จสิ้น</Badge>}
                              {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-600 border-red-200">ปฏิเสธ</Badge>}
                              {req.status === 'NotHome' && <Badge className="bg-gray-100 text-gray-400 border-gray-200">ไม่อยู่</Badge>}
                              {req.status === 'NotAllowed' && <Badge className="bg-red-100 text-red-600 border-red-200">ไม่อนุญาต</Badge>}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#7367f0]" onClick={(e) => { e.stopPropagation(); setRequestToEdit(req); }}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
            /* ===== LIST VIEW (existing) ===== */
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
              
              {/* Filter/Tabs Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-lg border border-dashed border-gray-200">
                 <TabsList className="bg-white p-1 h-auto rounded-lg grid grid-cols-3 w-full md:w-auto md:min-w-[450px] border border-gray-200 shadow-sm mx-auto md:mx-0">
                    <TabsTrigger value="requests" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-2 rounded-md transition-all text-xs sm:text-sm">
                       ฝากเยี่ยม
                    </TabsTrigger>
                    <TabsTrigger value="forms" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-2 rounded-md transition-all text-xs sm:text-sm">
                       ลงเยี่ยมร่วม
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-2 rounded-md transition-all text-xs sm:text-sm">
                       ประวัติย้อนหลัง
                    </TabsTrigger>
                 </TabsList>

                 <div className="flex items-center gap-3 flex-wrap self-end md:self-center">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">หน่วยบริการ:</span>
                        <Select value={filterUnit} onValueChange={setFilterUnit}>
                          <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm">
                              <SelectValue placeholder="หน่วยบริการ" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">ทั้งหมด</SelectItem>
                              <SelectItem value="รพ.สต.ริมใต้">รพ.สต.ริมใต้</SelectItem>
                              <SelectItem value="รพ.สต.แม่งอน">รพ.สต.แม่งอน</SelectItem>
                              <SelectItem value="รพ.สต.ช้างเผือก">รพ.สต.ช้างเผือก</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">สถานะ:</span>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-[160px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm">
                              <SelectValue placeholder="สถานะ" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">ทั้งหมด</SelectItem>
                              <SelectItem value="Pending">รอการตอบรับ</SelectItem>
                              <SelectItem value="WaitVisit">รอเยี่ยม</SelectItem>
                              <SelectItem value="InProgress">ดำเนินการ</SelectItem>
                              <SelectItem value="Rejected">ปฏิเสธ</SelectItem>
                              <SelectItem value="NotHome">ไม่อยู่</SelectItem>
                              <SelectItem value="NotAllowed">ไม่อนุญาต</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">วันที่สร้างคำขอ:</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                              {filterDate ? filterDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : "เลือกวันที่"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="end">
                            <CalendarPicker
                              mode="single"
                              selected={filterDate}
                              onSelect={(date) => { if (date) setFilterDate(date); }}
                              locale={th}
                              formatters={{
                                formatCaption: (date) => {
                                  const year = date.getFullYear() + 543;
                                  return `${THAI_MONTHS_FULL[date.getMonth()]} ${year}`;
                                }
                              }}
                              classNames={{
                                day_selected: "bg-[#7367f0] text-white hover:bg-[#7367f0] hover:text-white focus:bg-[#7367f0] focus:text-white rounded-md",
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                 </div>
              </div>

              {/* --- Tab 1: Requests (Delegated) --- */}
              <TabsContent value="requests" className="space-y-4">
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                   <Table>
                       <TableHeader className="bg-gray-50/50">
                           <TableRow>
                               <TableHead className="w-[60px]"></TableHead>
                               <TableHead>ผู้ป่วย</TableHead>
                               <TableHead>หน่วยงานรับผิดชอบ</TableHead>
                               <TableHead>วันที่สร้างคำขอ</TableHead>
                               <TableHead>สถานะ</TableHead>
                               <TableHead className="text-right">จัดการ</TableHead>
                           </TableRow>
                       </TableHeader>
                       <TableBody>
                          {getFilteredRequests('Delegated').map(req => (
                              <TableRow 
                                   key={req.id} 
                                   className="cursor-pointer hover:bg-slate-50 group"
                                   onClick={() => setSelectedRequest(req)}
                              >
                                  <TableCell>
                                      <div className={cn("p-2 rounded-lg w-fit", 
                                          req.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                                          req.status === 'WaitVisit' ? "bg-cyan-100 text-cyan-600" :
                                          req.status === 'InProgress' ? "bg-blue-100 text-blue-600" :
                                          ['Rejected','NotHome','NotAllowed'].includes(req.status) ? "bg-red-100 text-red-600" :
                                          "bg-green-100 text-green-600"
                                      )}>
                                          <Home className="w-4 h-4" />
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div>
                                          <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{req.patientName}</div>
                                          <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {req.patientId}</Badge>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                          <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" /> <span>{req.rph}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                                          <CalendarIcon className="w-3 h-3" /> {String(req.requestDate || '').match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(req.requestDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : req.requestDate}
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      {req.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 border-orange-200">รอตอบรับ</Badge>}
                                      {req.status === 'WaitVisit' && <Badge className="bg-cyan-100 text-cyan-600 border-cyan-200">รอเยี่ยม</Badge>}
                                      {req.status === 'InProgress' && <Badge className="bg-blue-100 text-blue-600 border-blue-200">ดำเนินการ</Badge>}
                                      {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-600 border-red-200">ปฏิเสธ</Badge>}
                                      {req.status === 'NotHome' && <Badge className="bg-gray-100 text-gray-400 border-gray-200">ไม่อยู่</Badge>}
                                      {req.status === 'NotAllowed' && <Badge className="bg-red-100 text-red-600 border-red-200">ไม่อนุญาต</Badge>}
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1">
                                          <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8 text-gray-400 hover:text-[#7367f0]"
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setRequestToEdit(req);
                                              }}
                                          >
                                              <Edit className="w-4 h-4" />
                                          </Button>
                                          <Button 
                                               variant="ghost" 
                                               size="icon" 
                                               className="h-8 w-8 text-gray-400 hover:text-red-500" 
                                               onClick={(e) => {
                                                   e.stopPropagation(); 
                                                   setTargetApt(req);
                                                   setIsDeleteOpen(true);
                                               }}
                                          >
                                              <Trash2 className="w-4 h-4" />
                                          </Button>
                                      </div>
                                  </TableCell>
                              </TableRow>
                          ))}
                          {getFilteredRequests('Delegated').length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <Home className="w-10 h-10 opacity-20" />
                                        <p className="text-sm">ไม่พบรายการคำขอ</p>
                                    </div>
                                </TableCell>
                              </TableRow>
                          )}
                       </TableBody>
                   </Table>
                  </div>
              </TabsContent>

              {/* --- Tab 2: Forms (Joint) --- */}
              <TabsContent value="forms" className="space-y-4">
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                   <Table>
                       <TableHeader className="bg-gray-50/50">
                           <TableRow>
                               <TableHead className="w-[60px]"></TableHead>
                               <TableHead>ผู้ป่วย</TableHead>
                               <TableHead>หน่วยงานรับผิดชอบ</TableHead>
                               <TableHead>วันที่สร้างคำขอ</TableHead>
                               <TableHead>สถานะ</TableHead>
                               <TableHead className="text-right">จัดการ</TableHead>
                           </TableRow>
                       </TableHeader>
                       <TableBody>
                          {getFilteredRequests('Joint').map(req => (
                              <TableRow 
                                   key={req.id} 
                                   className="cursor-pointer hover:bg-slate-50 group"
                                   onClick={() => setSelectedRequest(req)}
                              >
                                  <TableCell>
                                      <div className={cn("p-2 rounded-lg w-fit", 
                                          req.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                                          req.status === 'WaitVisit' ? "bg-cyan-100 text-cyan-600" :
                                          req.status === 'InProgress' ? "bg-blue-100 text-blue-600" :
                                          ['Rejected','NotHome','NotAllowed'].includes(req.status) ? "bg-red-100 text-red-600" :
                                          "bg-green-100 text-green-600"
                                      )}>
                                          <User className="w-4 h-4" />
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div>
                                          <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{req.patientName}</div>
                                          <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {req.patientId}</Badge>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-1 text-sm text-gray-600">
                                          <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" /> <span>{req.rph}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                                          <CalendarIcon className="w-3 h-3" /> {String(req.requestDate || '').match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(req.requestDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : req.requestDate}
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      {req.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 border-orange-200">รอตอบรับ</Badge>}
                                      {req.status === 'WaitVisit' && <Badge className="bg-cyan-100 text-cyan-600 border-cyan-200">รอเยี่ยม</Badge>}
                                      {req.status === 'InProgress' && <Badge className="bg-blue-100 text-blue-600 border-blue-200">ดำเนินการ</Badge>}
                                      {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-600 border-red-200">ปฏิเสธ</Badge>}
                                      {req.status === 'NotHome' && <Badge className="bg-gray-100 text-gray-400 border-gray-200">ไม่อยู่</Badge>}
                                      {req.status === 'NotAllowed' && <Badge className="bg-red-100 text-red-600 border-red-200">ไม่อนุญาต</Badge>}
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-gray-400 hover:text-[#7367f0]"
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              setRequestToEdit(req);
                                          }}
                                      >
                                          <Edit className="w-4 h-4" />
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                          {getFilteredRequests('Joint').length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <User className="w-10 h-10 opacity-20" />
                                        <p className="text-sm">ไม่พบรายการลงเยี่ยมร่วม</p>
                                    </div>
                                </TableCell>
                              </TableRow>
                          )}
                       </TableBody>
                   </Table>
                  </div>
              </TabsContent>

              {/* --- Tab 3: History (Completed) --- */}
              <TabsContent value="history" className="space-y-4">
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                   <Table>
                       <TableHeader className="bg-gray-50/50">
                           <TableRow>
                               <TableHead className="w-[60px]"></TableHead>
                               <TableHead>ผู้ป่วย</TableHead>
                               <TableHead>หน่วยงารับผิดชอบ</TableHead>
                               <TableHead>ประเภท</TableHead>
                               <TableHead>สถานะ</TableHead>
                               <TableHead className="text-right">จัดการ</TableHead>
                           </TableRow>
                       </TableHeader>
                       <TableBody>
                          {groupByDate(getHistoryRequests()).flatMap(group => [
                             /* Date Divider Row */
                             <TableRow key={`divider-${group.date}`} className="bg-gray-50/80 hover:bg-gray-50/80">
                                 <TableCell colSpan={6} className="py-2">
                                   <div className="flex items-center gap-3">
                                     <div className="h-px flex-1 bg-gray-200" />
                                     <span className="text-sm text-[#b4b7bd] whitespace-nowrap">
                                       {group.label}
                                     </span>
                                     <div className="h-px flex-1 bg-gray-200" />
                                   </div>
                                 </TableCell>
                             </TableRow>,
                             /* Data Rows */
                             ...group.items.map(req => (
                                 <TableRow 
                                      key={req.id} 
                                      className="cursor-pointer hover:bg-slate-50 group"
                                      onClick={() => setSelectedRequest(req)}
                                 >
                                     <TableCell>
                                         <div className={cn("p-2 rounded-lg w-fit", 
                                             req.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                                             req.status === 'WaitVisit' ? "bg-cyan-100 text-cyan-600" :
                                             req.status === 'InProgress' ? "bg-blue-100 text-blue-600" :
                                             req.status === 'Completed' ? "bg-green-100 text-green-600" :
                                             req.status === 'NotHome' ? "bg-gray-100 text-gray-400" :
                                             ['Rejected','NotAllowed'].includes(req.status) ? "bg-red-100 text-red-600" :
                                             "bg-gray-100 text-gray-600"
                                         )}>
                                             <Home className="w-4 h-4" />
                                         </div>
                                     </TableCell>
                                     <TableCell>
                                         <div>
                                             <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{req.patientName}</div>
                                             <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {req.patientId}</Badge>
                                         </div>
                                     </TableCell>
                                     <TableCell>
                                         <div className="flex items-center gap-1 text-sm text-gray-600">
                                             <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" /> <span>{req.rph}</span>
                                         </div>
                                     </TableCell>
                                     <TableCell>
                                         <span className="text-sm text-gray-500">
                                           {req.type === 'Delegated' ? 'ฝากเยี่ยม' : req.type === 'Joint' ? 'ลงเยี่ยมร่วม' : 'ปกติ'}
                                         </span>
                                     </TableCell>
                                     <TableCell>
                                         {req.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 border-orange-200">รอตอบรับ</Badge>}
                                         {req.status === 'WaitVisit' && <Badge className="bg-cyan-100 text-cyan-600 border-cyan-200">รอเยี่ยม</Badge>}
                                         {req.status === 'InProgress' && <Badge className="bg-blue-100 text-blue-600 border-blue-200">ดำเนินการ</Badge>}
                                         {req.status === 'Completed' && <Badge className="bg-green-100 text-green-600 border-green-200">เสร็จสิ้น</Badge>}
                                         {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-600 border-red-200">ปฏิเสธ</Badge>}
                                         {req.status === 'NotHome' && <Badge className="bg-gray-100 text-gray-400 border-gray-200">ไม่อยู่</Badge>}
                                         {req.status === 'NotAllowed' && <Badge className="bg-red-100 text-red-600 border-red-200">ไม่อนุญาต</Badge>}
                                     </TableCell>
                                     <TableCell className="text-right">
                                         {/* View only */}
                                     </TableCell>
                                 </TableRow>
                               ))
                           ])}
                           {getHistoryRequests().length === 0 && (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <Clock className="w-10 h-10 opacity-20" />
                                        <p className="text-sm">ไม่พบประวัติย้อนหลัง</p>
                                    </div>
                                </TableCell>
                              </TableRow>
                          )}
                       </TableBody>
                   </Table>
                  </div>
              </TabsContent>

            </Tabs>
            )}
          </div>
        </Card>
    </div>
  );
}