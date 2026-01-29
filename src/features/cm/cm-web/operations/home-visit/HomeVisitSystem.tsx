import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "../../../../../components/ui/dialog";
import { Textarea } from "../../../../../components/ui/textarea";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { 
  ArrowLeft, 
  MapPin, 
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
  AlertTriangle,
  Send,
  Home,
  Building2,
  Filter
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { HomeVisitRequestDetail } from "./HomeVisitRequestDetail";

import { CreateHomeVisitPage } from "./CreateHomeVisitPage";
import { HomeVisitForms } from "./HomeVisitForms";

interface HomeVisitSystemProps {
  onBack?: () => void;
  onViewPatient?: (patient: any) => void;
}

// --- Mock Data Types ---

interface VisitRequest {
  id: string;
  patientName: string;
  patientId: string;
  patientAddress: string;
  type: 'Joint' | 'Delegated'; // Joint = ไปพร้อม รพ.สต., Delegated = ฝาก รพ.สต.
  rph: string; // รพ.สต.
  requestDate: string;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
  note?: string;
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

interface MapPinData {
  id: string;
  lat: number;
  lng: number;
  patientName: string;
  status: string;
  address: string;
}

// --- Mock Data ---

const MOCK_PATIENTS = [
  { id: "HN001", name: "ด.ช. สมชาย รักดี", address: "123 ม.1 ต.บ้านใหม่", rph: "รพ.สต. บ้านใหม่" },
  { id: "HN002", name: "ด.ญ. มานี ใจผ่อง", address: "45 ม.2 ต.ทุ่งนา", rph: "รพ.สต. ทุ่งนา" },
  { id: "HN003", name: "ด.ช. ปิติ มีทรัพย์", address: "88 ม.5 ต.ดอนเมือง", rph: "รพ.สต. ดอนเมือง" },
];

const MOCK_RPH = [
  "รพ.สต. บ้านใหม่",
  "รพ.สต. ทุ่งนา",
  "รพ.สต. ดอนเมือง",
  "รพ.สต. สันกำแพง"
];

export function HomeVisitSystem({ onBack, onViewPatient }: HomeVisitSystemProps) {
  // --- State ---
  const [activeTab, setActiveTab] = useState("requests");
  
  const [requestToEdit, setRequestToEdit] = useState<VisitRequest | null>(null);
  
  // 1. Request Management State
  const [requests, setRequests] = useState<VisitRequest[]>([
    {
      id: "REQ-001",
      patientName: "ด.ช. สมชาย รักดี",
      patientId: "HN001",
      patientAddress: "123 ม.1 ต.บ้านใหม่",
      type: 'Joint',
      rph: "รพ.สต. บ้านใหม่",
      requestDate: "14/12/2025",
      status: 'Pending',
      note: "ติดตามแผลผ่าตัด"
    },
    {
      id: "REQ-002",
      patientName: "ด.ญ. มานี ใจผ่อง",
      patientId: "HN002",
      patientAddress: "45 ม.2 ต.ทุ่งนา",
      type: 'Delegated',
      rph: "รพ.สต. ทุ่งนา",
      requestDate: "10/12/2025",
      status: 'Accepted',
      note: "ประเมินพัฒนาการ"
    },
    {
      id: "REQ-003",
      patientName: "นาง สมหญิง ใจเย็น",
      patientId: "HN004",
      patientAddress: "99 ม.3 ต.ดอนเมือง",
      type: 'Joint',
      rph: "รพ.สต. ดอนเมือง",
      requestDate: "05/12/2025",
      status: 'Completed',
      note: "เยี่ยมหลังคลอด"
    },
    {
      id: "REQ-004",
      patientName: "นาย รักษา ดี",
      patientId: "HN005",
      patientAddress: "22 ม.4 ต.แม่ริม",
      type: 'Joint',
      rph: "รพ.สต. แม่ริม",
      requestDate: "11/01/2026",
      status: 'Accepted',
      note: "ติดตามอาการเบาหวาน"
    }
  ]);

  // 2. Form Management State
  const [forms, setForms] = useState<VisitForm[]>([
     {
      id: "FORM-001",
      requestId: "REQ-000",
      patientName: "ด.ช. ปิติ มีทรัพย์",
      visitDate: "01/12/2025",
      visitorName: "พยาบาล วิชาชีพ",
      vitalSigns: { bp: "110/70", pulse: "80", temp: "36.5" },
      symptoms: "แผลแห้งดี ไม่มีหนอง",
      photos: []
     }
  ]);

  // 3. Map Data State
  const [pins] = useState<MapPinData[]>([
    { id: "P1", lat: 30, lng: 40, patientName: "ด.ช. สมชาย รักดี", status: "รอเยี่ยม", address: "123 ม.1 ต.บ้านใหม่" },
    { id: "P2", lat: 60, lng: 70, patientName: "ด.ญ. มานี ใจผ่อง", status: "ตอบรับแล้ว", address: "45 ม.2 ต.ทุ่งนา" },
    { id: "P3", lat: 45, lng: 20, patientName: "ด.ช. ปิติ มีทรัพย์", status: "เยี่ยมแล้ว", address: "88 ม.5 ต.ดอนเมือง" },
  ]);

  // 4. History Data State (Mock)
  const [visitHistory] = useState([
    {
      id: "H-001",
      date: "10/01/2025",
      patientName: "สมชาย ใจดี",
      patientId: "00000001",
      address: "123 ม.1 ต.บ้านใหม่",
      visitor: "ทีมสหวิชาชีพ",
      result: "แผลแห้งดี ตัดไหมเรียบร้อย ไม่มีการติดเชื้อ",
      status: "Completed",
      rph: "รพ.สต. บ้านใหม่",
      type: "Joint"
    },
    {
      id: "H-002",
      date: "05/01/2025",
      patientName: "วิภาวี รักไทย",
      patientId: "00000002",
      address: "45 ม.2 ต.ทุ่งนา",
      visitor: "พยาบาลวิชาชีพ",
      result: "ประเมินพัฒนาการเด็กสมวัย ให้คำแนะนำโภชนาการ",
      status: "Completed",
      rph: "รพ.สต. ทุ่งนา",
      type: "Delegated"
    }
  ]);

  // UI States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditF1Open, setIsEditF1Open] = useState(false);
  const [newRequest, setNewRequest] = useState<Partial<VisitRequest>>({ type: 'Joint' });
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedPin, setSelectedPin] = useState<MapPinData | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetApt, setTargetApt] = useState<VisitRequest | null>(null);

  // --- Handlers ---

  const handleConfirmDelete = () => {
    if (targetApt) {
        setRequests(prev => prev.filter(r => r.id !== targetApt.id));
        toast.success("ยกเลิกคำขอเรียบร้อยแล้ว");
        setIsDeleteOpen(false);
        setTargetApt(null);
    }
  };

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
      requestDate: new Date().toLocaleDateString('th-TH'),
      status: 'Pending',
      note: data.note
    };

    setRequests([request, ...requests]);
    setIsCreateOpen(false);
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

  const handleDeleteForm = (id: string) => {
     if (confirm("ยืนยันการลบแบบฟอร์ม?")) {
      setForms(prev => prev.filter(f => f.id !== id));
      toast.success("ลบแบบฟอร์มเรียบร้อยแล้ว");
    }
  };

  // Auto-fill RPH when patient is selected
  const handlePatientSelect = (val: string) => {
    setSelectedPatientId(val);
    const patient = MOCK_PATIENTS.find(p => p.id === val);
    if (patient) {
      setNewRequest(prev => ({ ...prev, rph: patient.rph }));
    }
  };

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

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 relative font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Header Banner */}
      {!selectedRequest && (
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
              <Home className="w-5 h-5" /> ระบบเยี่ยมบ้าน (Home Visit)
          </h1>
        </div>
      </div>
      )}

      {!selectedRequest && (
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
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{requests.filter(r => r.status === 'Accepted' || r.status === 'Accepted').length}</p>
                  <p className="text-blue-600/80 text-sm">กำลังดำเนินการ</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <Building2 className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-gray-600 font-bold text-2xl">0</p>
                  <p className="text-gray-600/80 text-sm">ไม่อยู่ในพื้นที่</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-full">
                  <MapPin className="w-5 h-5 text-gray-600" />
              </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">0</p>
                  <p className="text-red-600/80 text-sm">ไม่อนุญาตให้ลงพื้นที่</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="w-5 h-5 text-red-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">{forms.length}</p>
                  <p className="text-green-600/80 text-sm">เยี่ยมบ้านเสร็จสิ้น</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
          </div>
      </div>
      )}

      {/* Main Content */}
      {selectedRequest ? (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <HomeVisitRequestDetail 
                request={selectedRequest} 
                onBack={() => setSelectedRequest(null)}
                onRecordResult={() => setIsEditF1Open(true)}
            />
        </div>
      ) : (
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

                  <Popover>
                      <PopoverTrigger asChild>
                          <Button
                              variant={"outline"}
                              className={cn(
                                  "w-[180px] bg-white border-gray-200 h-[40px] text-sm justify-start text-left font-normal shadow-sm",
                                  !selectedDate && "text-muted-foreground"
                              )}
                          >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? (
                                  (() => {
                                      const date = new Date(selectedDate);
                                      const year = date.getFullYear() + 543;
                                      return `${format(date, "d MMM", { locale: th })} ${year}`;
                                  })()
                              ) : (
                                  <span>ทั้งหมด</span>
                              )}
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className={cn("w-auto p-0")} align="start" side="left">
                          <CalendarPicker
                              mode="single"
                              selected={selectedDate ? new Date(selectedDate) : undefined}
                              onSelect={(date) => setSelectedDate(date ? format(date, "yyyy-MM-dd") : "")}
                              locale={th}
                              formatters={{
                                  formatCaption: (date) => {
                                      const year = date.getFullYear() + 543;
                                      return `${format(date, "MMMM", { locale: th })} ${year}`;
                                  }
                              }}
                              classNames={{
                                  day_selected: "bg-[#7367f0] text-white hover:bg-[#7367f0] hover:text-white focus:bg-[#7367f0] focus:text-white rounded-md",
                              }}
                          />
                      </PopoverContent>
                  </Popover>

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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
              
              {/* Filter/Tabs Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-lg border border-dashed border-gray-200">
                 <TabsList className="bg-white p-1 h-auto rounded-lg grid grid-cols-4 w-full md:w-auto md:min-w-[600px] border border-gray-200 shadow-sm mx-auto md:mx-0">
                    <TabsTrigger value="requests" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-2 rounded-md transition-all text-xs sm:text-sm">
                       ฝากเยี่ยม
                    </TabsTrigger>
                    <TabsTrigger value="forms" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-2 rounded-md transition-all text-xs sm:text-sm">
                       ลงเยี่ยมร่วม
                    </TabsTrigger>
                    <TabsTrigger value="map" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-2 rounded-md transition-all text-xs sm:text-sm">
                       แผนที่ผู้ป่วย
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-2 rounded-md transition-all text-xs sm:text-sm">
                       ประวัติย้อนหลัง
                    </TabsTrigger>
                 </TabsList>

                 <div className="flex items-center gap-2 self-end md:self-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium whitespace-nowrap">
                          <Filter className="w-4 h-4" /> สถานะ:
                      </div>
                      <Select defaultValue="all">
                          <SelectTrigger className="w-[160px] bg-white border-gray-200 rounded-[6px] h-[38px]">
                              <SelectValue placeholder="สถานะ" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="all">ทั้งหมด</SelectItem>
                              <SelectItem value="pending">รอการตอบรับ</SelectItem>
                              <SelectItem value="accepted">กำลังดำเนินการ</SelectItem>
                              <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                          </SelectContent>
                      </Select>
                 </div>
              </div>

              {/* --- Tab 1: Requests --- */}
              <TabsContent value="requests" className="space-y-4">
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                   <Table>
                       <TableHeader className="bg-gray-50/50">
                           <TableRow>
                               <TableHead className="w-[60px]"></TableHead>
                               <TableHead>ผู้ป่วย</TableHead>
                               <TableHead>รพ.สต.</TableHead>
                               <TableHead>ประเภทการเยี่ยม</TableHead>
                               <TableHead>วันที่สร้าง</TableHead>
                               <TableHead>สถานะ</TableHead>
                               <TableHead className="text-right">จัดการ</TableHead>
                           </TableRow>
                       </TableHeader>
                       <TableBody>
                          {requests
                            .filter(req => req.type === 'Delegated')
                            .filter(req => 
                               req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               req.patientId.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map(req => (
                              <TableRow 
                                   key={req.id} 
                                   className="cursor-pointer hover:bg-slate-50 group"
                                   onClick={() => setSelectedRequest(req)}
                              >
                                  <TableCell>
                                      <div className={cn("p-2 rounded-lg w-fit", 
                                          req.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                                          req.status === 'Accepted' ? "bg-blue-100 text-blue-600" :
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
                                      <div className="flex items-center gap-1 text-[#7367f0] text-xs">
                                          <Navigation className="w-3 h-3" /> 
                                          {req.type === 'Joint' ? 'ลงเยี่ยมพร้อม รพ.สต.' : 'ฝาก รพ.สต. เยี่ยม'}
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                                          <CalendarIcon className="w-3 h-3" /> {req.requestDate}
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      {req.status === 'Pending' && (
                                          <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200">รอการตอบรับ</Badge>
                                      )}
                                      {req.status === 'Accepted' && (
                                          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200">กำลังดำเนินการ</Badge>
                                      )}
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
                       </TableBody>
                   </Table>
                  </div>
                  {requests.length === 0 && (
                      <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-400">
                          <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p>ยังไม่มีคำขอเยี่ยมบ้าน</p>
                      </div>
                  )}
              </TabsContent>

              {/* --- Tab 2: Forms --- */}
              <TabsContent value="forms" className="space-y-4">
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                   <Table>
                       <TableHeader className="bg-gray-50/50">
                           <TableRow>
                               <TableHead className="w-[60px]"></TableHead>
                               <TableHead>ผู้ป่วย</TableHead>
                               <TableHead>รพ.สต.</TableHead>
                               <TableHead>ประเภทการเยี่ยม</TableHead>
                               <TableHead>วันที่สร้าง</TableHead>
                               <TableHead>สถานะ</TableHead>
                               <TableHead className="text-right">จัดการ</TableHead>
                           </TableRow>
                       </TableHeader>
                       <TableBody>
                          {requests
                            .filter(req => req.type === 'Joint')
                            .filter(req => 
                               req.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               req.patientId.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map(req => (
                              <TableRow 
                                   key={req.id} 
                                   className="cursor-pointer hover:bg-slate-50 group"
                                   onClick={() => setSelectedRequest(req)}
                              >
                                  <TableCell>
                                      <div className={cn("p-2 rounded-lg w-fit", 
                                          req.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                                          req.status === 'Accepted' ? "bg-blue-100 text-blue-600" :
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
                                      <div className="flex items-center gap-1 text-[#7367f0] text-xs">
                                          <Navigation className="w-3 h-3" /> 
                                          {req.type === 'Joint' ? 'ลงเยี่ยมพร้อม รพ.สต.' : 'ฝาก รพ.สต. เยี่ยม'}
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                                          <CalendarIcon className="w-3 h-3" /> {req.requestDate}
                                      </div>
                                  </TableCell>
                                  <TableCell>
                                      {req.status === 'Pending' && (
                                          <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200">รอการตอบรับ</Badge>
                                      )}
                                      {req.status === 'Accepted' && (
                                          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200">กำลังดำเนินการ</Badge>
                                      )}
                                      {req.status === 'Completed' && (
                                          <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200">เยี่ยมบ้านเสร็จสิ้น</Badge>
                                      )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                      <div className="flex items-center justify-end gap-1">
                                          <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8 text-gray-400 hover:text-[#7367f0]"
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (req.status === 'Completed') {
                                                      setIsEditF1Open(true);
                                                  } else {
                                                      setRequestToEdit(req);
                                                  }
                                              }}
                                          >
                                              {req.status === 'Completed' ? <FileText className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
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
                       </TableBody>
                   </Table>
                  </div>
              </TabsContent>

              {/* --- Tab 3: Map --- */}
              <TabsContent value="map" className="h-[600px] flex gap-6">
                  {/* Sidebar List */}
                  <div className="w-[300px] bg-white rounded-xl shadow-sm border flex flex-col overflow-hidden shrink-0">
                      <div className="p-4 border-b space-y-4">
                          <h3 className="font-bold text-[#5e5873] text-lg">ตัวกรองข้อมูล</h3>
                          
                          <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                              <Input placeholder="ค้นหาชื่อ, ที่อยู่..." className="pl-9 bg-gray-50 border-gray-200" />
                          </div>

                          <div className="space-y-3">
                              <Label className="text-[#5e5873] font-semibold">เลือกพื้นที่</Label>
                              <div className="space-y-2">
                                  <Select defaultValue="fang">
                                      <SelectTrigger className="bg-gray-50 border-gray-200">
                                          <SelectValue placeholder="เลือกอำเภอ" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="fang">อำเภอฝาง</SelectItem>
                                          <SelectItem value="mae-ai">อำเภอแม่อาย</SelectItem>
                                          <SelectItem value="chai-prakan">อำเภอไชยปราการ</SelectItem>
                                      </SelectContent>
                                  </Select>
                                  <Select defaultValue="all">
                                      <SelectTrigger className="bg-gray-50 border-gray-200">
                                          <SelectValue placeholder="เลือกพื้นที่" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="all">ทั้งหมด</SelectItem>
                                          <SelectItem value="area1">ต.บ้านใหม่</SelectItem>
                                          <SelectItem value="area2">ต.ทุ่งนา</SelectItem>
                                          <SelectItem value="area3">ต.ดอนเมือง</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>
                          </div>
                      </div>
                      <ScrollArea className="flex-1">
                          <div className="divide-y">
                              {pins.map(pin => (
                                  <div 
                                    key={pin.id} 
                                    className={cn(
                                        "p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                                        selectedPin?.id === pin.id ? "bg-[#7367f0]/5 border-l-4 border-l-[#7367f0]" : "border-l-4 border-l-transparent"
                                    )}
                                    onClick={() => setSelectedPin(pin)}
                                  >
                                      <h4 className="font-bold text-sm text-[#5e5873]">{pin.patientName}</h4>
                                      <p className="text-xs text-gray-500 mb-2 truncate">{pin.address}</p>
                                      <Badge variant="secondary" className="text-[10px] h-5">{pin.status}</Badge>
                                  </div>
                              ))}
                          </div>
                      </ScrollArea>
                  </div>

                  {/* Map Visualization */}
                  <div className="flex-1 bg-gray-100 rounded-xl border relative overflow-hidden group">
                       {/* Fake Map Background */}
                       <div className="absolute inset-0 bg-[#e5e7eb] opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover"></div>
                       
                       {/* Grid Lines */}
                       <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                       {/* Pins */}
                       {pins.map(pin => (
                           <div 
                              key={pin.id}
                              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-125 z-10"
                              style={{ top: `${pin.lat}%`, left: `${pin.lng}%` }}
                              onClick={() => setSelectedPin(pin)}
                           >
                               <MapPin 
                                  className={cn(
                                      "w-8 h-8 drop-shadow-md",
                                      pin.status === 'รอเยี่ยม' ? "text-orange-500 fill-orange-500" :
                                      pin.status === 'ตอบรับแล้ว' ? "text-blue-500 fill-blue-500" :
                                      "text-green-500 fill-green-500"
                                  )} 
                               />
                           </div>
                       ))}

                       {/* Pin Info Card */}
                       {selectedPin && (
                           <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white p-4 rounded-xl shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-10 z-20">
                               <div className="flex justify-between items-start mb-2">
                                   <h4 className="font-bold text-lg text-[#5e5873]">{selectedPin.patientName}</h4>
                                   <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 -mt-2 text-gray-400" onClick={() => setSelectedPin(null)}>
                                       <XCircle className="w-4 h-4" />
                                   </Button>
                               </div>
                               <p className="text-sm text-gray-500 mb-3 flex items-start gap-2">
                                   <MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {selectedPin.address}
                               </p>
                               <div className="flex gap-2">
                                   <Button className="flex-1 bg-[#7367f0] hover:bg-[#685dd8] h-8 text-xs">
                                       <Navigation className="w-3 h-3 mr-1" /> นำทาง
                                   </Button>
                                   <Button 
                                      variant="outline" 
                                      className="flex-1 h-8 text-xs border-[#7367f0] text-[#7367f0]"
                                      onClick={() => {
                                          if (onViewPatient) {
                                              const patient = MOCK_PATIENTS.find(p => p.name === selectedPin.patientName) || {
                                                  id: "UNKNOWN",
                                                  name: selectedPin.patientName,
                                                  address: selectedPin.address,
                                                  rph: "รพ.สต. ไม่ระบุ"
                                              };
                                              onViewPatient(patient);
                                          } else {
                                              const request = requests.find(r => r.patientName === selectedPin.patientName);
                                              if (request) {
                                                  setSelectedRequest(request);
                                                  setActiveTab("requests");
                                              } else {
                                                  toast.error("ไม่พบข้อมูลรายละเอียด", { description: "ยังไม่มีคำขอเยี่ยมบ้านสำหรับผู้ป่วยรายนี้" });
                                              }
                                          }
                                      }}
                                   >
                                       ดูข้อมูล
                                   </Button>
                               </div>
                           </div>
                       )}
                  </div>
              </TabsContent>

              {/* --- Tab 4: History --- */}
              <TabsContent value="history" className="space-y-4">
                 <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                     <Table>
                          <TableHeader className="bg-gray-50/50">
                              <TableRow>
                                  <TableHead className="w-[60px]"></TableHead>
                                  <TableHead>ผู้ป่วย</TableHead>
                                  <TableHead>รพ.สต.</TableHead>
                                  <TableHead>ประเภทการเยี่ยม</TableHead>
                                  <TableHead>วันที่เยี่ยม</TableHead>
                                  <TableHead>สถานะ</TableHead>
                                  <TableHead className="text-right">จัดการ</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                             {visitHistory.map((item: any) => (
                                 <TableRow 
                                      key={item.id} 
                                      className="cursor-pointer hover:bg-slate-50 group"
                                 >
                                     <TableCell>
                                         <div className="p-2 rounded-lg w-fit bg-green-100 text-green-600">
                                             <CheckCircle2 className="w-4 h-4" />
                                         </div>
                                     </TableCell>
                                     <TableCell>
                                         <div>
                                             <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{item.patientName}</div>
                                             <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {item.patientId}</Badge>
                                         </div>
                                     </TableCell>
                                     <TableCell>
                                         <div className="flex items-center gap-1 text-sm text-gray-600">
                                             <Building2 className="w-3.5 h-3.5 shrink-0 text-gray-400" /> <span>{item.rph}</span>
                                         </div>
                                     </TableCell>
                                     <TableCell>
                                         <div className="flex items-center gap-1 text-[#7367f0] text-xs">
                                             <Navigation className="w-3 h-3" /> 
                                             {item.type === 'Joint' ? 'ลงเยี่ยมพร้อม รพ.สต.' : 'ฝาก รพ.สต. เยี่ยม'}
                                         </div>
                                     </TableCell>
                                     <TableCell>
                                         <div className="flex items-center gap-1 text-gray-400 text-xs">
                                             <CalendarIcon className="w-3 h-3" /> {item.date}
                                         </div>
                                     </TableCell>
                                     <TableCell>
                                         <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200">เยี่ยมบ้านเสร็จสิ้น</Badge>
                                     </TableCell>
                                     <TableCell className="text-right">
                                         <div className="flex items-center justify-end gap-1">
                                             <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#7367f0]">
                                                 <Edit className="w-4 h-4" />
                                             </Button>
                                             <Button 
                                                  variant="ghost" 
                                                  size="icon" 
                                                  className="h-8 w-8 text-gray-400 hover:text-red-500" 
                                             >
                                                 <Trash2 className="w-4 h-4" />
                                             </Button>
                                         </div>
                                     </TableCell>
                                 </TableRow>
                             ))}
                          </TableBody>
                     </Table>
                 </div>
              </TabsContent>

            </Tabs>
          </div>
        </Card>
      )}
      
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
         <DialogContent className="max-w-[400px]">
             <DialogHeader>
                 <DialogTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> ยืนยันการลบ
                 </DialogTitle>
                 <DialogDescription className="sr-only">
                    ยืนยันการลบรายการนัดหมาย
                 </DialogDescription>
             </DialogHeader>
             <div className="py-4 text-center">
                <p className="text-gray-600">คุณต้องการลบรายการคำขอของ</p>
                <p className="text-lg font-bold text-[#5e5873] my-2">{targetApt?.patientName}</p>
                <p className="text-sm text-gray-400">การกระทำนี้ไม่สามารถเรียกคืนได้</p>
             </div>
             <DialogFooter className="flex gap-2 justify-center sm:justify-center">
                 <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>ยกเลิก</Button>
                 <Button variant="destructive" onClick={handleConfirmDelete}>ยืนยันลบ</Button>
             </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}
