import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Badge } from "../../../../../components/ui/badge";
import { Label } from "../../../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { 
  ArrowLeft, 
  Coins, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MoreHorizontal,
  TrendingUp,
  Edit,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { FundRequestPage } from "./FundRequestPage";
import { FundRequestDetailPage } from "./FundRequestDetailPage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { cn } from "../../../../../components/ui/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";

export interface FundSystemProps {
  patient?: any;
  onBack?: () => void;
}

export interface FundRequest {
  id: string;
  patientName: string;
  hn: string;
  fundType: string;
  amount: number;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  doctor: string;
}

const MOCK_REQUESTS: FundRequest[] = [
  {
    id: "REQ-001",
    patientName: "นาย สมชาย ใจดี",
    hn: "HN001",
    fundType: "กองทุนสุขภาพตำบล",
    amount: 5000,
    requestDate: "2025-12-15",
    status: "Pending",
    doctor: "นพ. ใจดี มีเมตตา"
  },
  {
    id: "REQ-002",
    patientName: "นาง สมหญิง จริงใจ",
    hn: "HN002",
    fundType: "กองทุนผู้สูงอายุ",
    amount: 2500,
    requestDate: "2025-12-10",
    status: "Approved",
    doctor: "พญ. รักษา ดี"
  },
  {
    id: "REQ-003",
    patientName: "ด.ช. กล้าหาญ ชาญชัย",
    hn: "HN005",
    fundType: "มูลนิธิขาเทียม",
    amount: 15000,
    requestDate: "2025-11-20",
    status: "Approved",
    doctor: "นพ. กระดูก แข็งแรง"
  },
  {
    id: "REQ-004",
    patientName: "นาย มีบุญ มาเกิด",
    hn: "HN008",
    fundType: "กองทุนสุขภาพตำบล",
    amount: 3000,
    requestDate: "2025-11-01",
    status: "Completed",
    doctor: "นพ. ใจดี มีสุข"
  },
  {
    id: "REQ-005",
    patientName: "ด.ญ. สมใจ หายไว",
    hn: "HN009",
    fundType: "มูลนิธิขาเทียม",
    amount: 8000,
    requestDate: "2025-10-15",
    status: "Rejected",
    doctor: "พญ. เมตตา ปราณี"
  }
];

export default function FundSystem({ patient, onBack }: FundSystemProps) {
  const [viewMode, setViewMode] = useState<'current' | 'history'>('current');
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<FundRequest[]>(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState<FundRequest | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetRequest, setTargetRequest] = useState<FundRequest | null>(null);

  const handleConfirmDelete = () => {
    if (targetRequest) {
      setRequests(prev => prev.filter(req => req.id !== targetRequest.id));
      setIsDeleteOpen(false);
      setTargetRequest(null);
    }
  };

  const handleCreateSubmit = (data: any) => {
    const newRequest: FundRequest = {
      id: `REQ-${(requests.length + 1).toString().padStart(3, '0')}`,
      patientName: data.patientName || "ไม่ระบุชื่อ",
      hn: data.hn || "-",
      fundType: data.fundType || "อื่นๆ",
      amount: Number(data.amount) || 0,
      requestDate: new Date().toISOString(),
      status: "Pending",
      doctor: "พญ. รักษา ดี"
    };
    setRequests([newRequest, ...requests]);
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (data: any) => {
    if (!requestToEdit) return;
    
    setRequests(prev => prev.map(req => 
      req.id === requestToEdit.id 
        ? { 
            ...req, 
            patientName: data.patientName,
            hn: data.hn,
            fundType: data.fundType,
            amount: Number(data.amount)
          } 
        : req
    ));
    setRequestToEdit(null);
  };

  if (isCreateOpen) {
    return (
      <FundRequestPage 
        onBack={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        patient={patient}
      />
    );
  }

  if (requestToEdit) {
    return (
      <FundRequestPage 
        onBack={() => setRequestToEdit(null)}
        onSubmit={handleEditSubmit}
        patient={patient}
        initialData={requestToEdit}
      />
    );
  }

  if (selectedRequest) {
    return (
      <FundRequestDetailPage
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
      />
    );
  }

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.patientName.includes(searchTerm) || req.hn.includes(searchTerm);
    const matchesTab = activeTab === "all" || req.status.toLowerCase() === activeTab;
    // If patient prop is provided, filter by that patient
    const matchesPatient = patient ? (req.patientName === patient.name || req.hn === patient.hn) : true;
    const matchesDate = selectedDate ? req.requestDate.startsWith(selectedDate) : true;
    
    const matchesViewMode = viewMode === 'history' 
      ? ['Completed', 'Rejected'].includes(req.status)
      : ['Pending', 'Approved'].includes(req.status);
    
    return matchesSearch && matchesTab && matchesPatient && matchesDate && matchesViewMode;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#FFF4E5]/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-[#FFF4E5]/80 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            )}
            <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                <Coins className="w-5 h-5 text-orange-500" /> ระบบขอทุน (Fund System)
            </h1>
          </div>
          {patient && (
            <Badge variant="outline" className="bg-white text-[#5e5873] border-orange-200">
               ผู้ป่วย: {patient.name}
            </Badge>
          )}
      </div>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{requests.length}</p>
                  <p className="text-blue-600/80 text-sm">รายการทั้งหมด</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-orange-600 font-bold text-2xl">{requests.filter(r => r.status === 'Pending').length}</p>
                  <p className="text-orange-600/80 text-sm">รอพิจารณา</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">{requests.filter(r => r.status === 'Completed').length}</p>
                  <p className="text-green-600/80 text-sm">อนุมัติแล้ว</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">{requests.filter(r => r.status === 'Rejected').length}</p>
                  <p className="text-red-600/80 text-sm">ถูกปฎิเสธ</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="w-5 h-5 text-red-600" />
              </div>
          </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
        
        {/* Card Header with Search */}
        <div className="p-6 border-b border-[#EBE9F1] flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#5e5873] flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#7367f0]" /> รายการคำร้องขอทุน
            </h2>
             
             {/* Search and Action */}
             <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-[250px]">
                    <Input 
                      placeholder="ค้นหาชื่อ, HN..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pr-10 h-[40px] border-[#EBE9F1] bg-white focus:ring-[#40bfff]"
                    />
                    <div className="absolute right-0 top-0 h-full w-10 bg-[#7367f0] flex items-center justify-center rounded-r-md cursor-pointer hover:bg-[#5e54ce]">
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
                            <Calendar className="mr-2 h-4 w-4" />
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

                <Button onClick={() => setIsCreateOpen(true)} className="bg-[#7367f0] hover:bg-[#5e54ce] h-[40px] gap-2">
                    <Plus className="w-4 h-4" /> <span className="hidden sm:inline">สร้างคำขอทุน</span>
                </Button>
             </div>
        </div>

        <div className="p-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                {/* Filters Section */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-4 p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 items-center justify-between">
                        
                        {/* View Mode Menu (Left) */}
                         <div className="bg-white p-1 rounded-md border border-gray-200 flex items-center shadow-sm">
                             <button
                                onClick={() => { setViewMode('current'); setActiveTab('all'); }}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded transition-all flex items-center justify-center",
                                    viewMode === 'current' 
                                        ? "bg-[#7367f0] text-white shadow-sm" 
                                        : "text-gray-500 hover:bg-gray-50"
                                )}
                             >
                                รายการขอทุน
                             </button>
                             <button
                                onClick={() => { setViewMode('history'); setActiveTab('all'); }}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded transition-all flex items-center justify-center",
                                    viewMode === 'history' 
                                        ? "bg-[#7367f0] text-white shadow-sm" 
                                        : "text-gray-500 hover:bg-gray-50"
                                )}
                             >
                                ประวัติย้อนหลัง
                             </button>
                         </div>

                        {/* Filters (Right) */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <Filter className="w-4 h-4" /> ประเภทกองทุน:
                                </div>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px]">
                                        <SelectValue placeholder="เลือกประเภทกองทุน" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">ทั้งหมด</SelectItem>
                                        <SelectItem value="local-health">กองทุนสุขภาพตำบล</SelectItem>
                                        <SelectItem value="elderly">กองทุนผู้สูงอายุ</SelectItem>
                                        <SelectItem value="prostheses">มูลนิธิขาเทียม</SelectItem>
                                        <SelectItem value="other">อื่นๆ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    สถานะ:
                                </div>
                                
                                <Select value={activeTab} onValueChange={setActiveTab}>
                                    <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px]">
                                        <SelectValue placeholder="สถานะ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">ทั้งหมด</SelectItem>
                                        {viewMode === 'current' ? (
                                            <>
                                                <SelectItem value="pending">รอพิจารณา</SelectItem>
                                                <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                                            </>
                                        ) : (
                                            <>
                                                <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                                                <SelectItem value="rejected">ถูกปฎิเสธ</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <TabsContent value={activeTab} className="mt-0">
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-[60px]"></TableHead>
                                    <TableHead>ผู้ป่วย</TableHead>
                                    <TableHead>ประเภททุน</TableHead>
                                    <TableHead>จำนวนเงิน</TableHead>
                                    <TableHead>วันที่ขอ</TableHead>
                                    <TableHead>สถานะ</TableHead>
                                    <TableHead className="text-right">จัดการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <Coins className="w-10 h-10 opacity-20" />
                                                <p className="text-sm">ไม่พบรายการคำร้อง</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRequests.map((req) => (
                                        <TableRow 
                                            key={req.id} 
                                            className="cursor-pointer hover:bg-slate-50 group"
                                            onClick={() => setSelectedRequest(req)}
                                        >
                                            <TableCell>
                                                <div className={cn("p-2 rounded-lg w-fit", 
                                                    req.status === 'Pending' ? "bg-orange-100 text-orange-600" :
                                                    req.status === 'Approved' ? "bg-green-100 text-green-600" :
                                                    req.status === 'Rejected' ? "bg-red-100 text-red-600" :
                                                    "bg-blue-100 text-blue-600"
                                                )}>
                                                    <Coins className="w-4 h-4" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{req.patientName}</div>
                                                    <Badge variant="outline" className="text-gray-500 text-[10px] h-5 border-gray-200 bg-gray-50">HN: {req.hn}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                    {req.fundType}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-[#5e5873] text-sm font-medium">
                                                    {req.amount.toLocaleString()} บาท
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                    <Calendar className="w-3 h-3" /> {format(new Date(req.requestDate), "d MMM yy", { locale: th })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {req.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200 font-normal">รอพิจารณา</Badge>}
                                                {req.status === 'Approved' && <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200 font-normal">อนุมัติแล้ว</Badge>}
                                                {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-red-200 font-normal">ถูกปฏิเสธ</Badge>}
                                                {req.status === 'Completed' && <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200 font-normal">เสร็จสิ้น</Badge>}
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
                                                                setTargetRequest(req);
                                                                setIsDeleteOpen(true);
                                                            }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </Card>
      
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
         <DialogContent className="max-w-[400px]">
             <DialogHeader>
                 <DialogTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> ยืนยันการลบ
                 </DialogTitle>
                 <DialogDescription className="sr-only">
                    ยืนยันการลบรายการคำร้องขอทุน
                 </DialogDescription>
             </DialogHeader>
             <div className="py-4 text-center">
                <p className="text-gray-600">คุณต้องการลบคำร้องขอทุนของ</p>
                <p className="text-lg font-bold text-[#5e5873] my-2">{targetRequest?.patientName}</p>
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
