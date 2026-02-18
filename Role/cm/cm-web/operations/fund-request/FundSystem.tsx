import React, { useState, useMemo } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Badge } from "../../../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { 
  ArrowLeft, 
  Coins, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Clock,
  Edit,
  Trash2,
  AlertTriangle,
  FileText
} from "lucide-react";
import { useSystem } from "../../../../../context/SystemContext";
import { th } from "date-fns/locale";

const THAI_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

function toISODateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
import { FundRequestPage } from "./FundRequestPage";
import { FundRequestDetailPage } from "./FundRequestDetailPage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { cn } from "../../../../../components/ui/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { PATIENTS_DATA } from "../../../../../data/patientData";
import { toast } from "sonner";
import { formatThaiDateWithDay } from "../../../../../components/shared/ThaiCalendarDrawer";

export interface FundSystemProps {
  patient?: any;
  onBack?: () => void;
}

// Matched with Mobile Logic
export interface FundRequest {
  id: string;
  patientName: string;
  patientId: string; // HN
  patientImage?: string;
  patientDob?: string;
  patientGender?: string;
  diagnosis?: string;
  amount: number;
  reason: string;
  requestDate: string;
  requestDateRaw?: string; // ISO date string for grouping/sorting
  status: 'Pending' | 'Approved' | 'Rejected';
  hospital: string;
  type: string;
  approvedDate?: string; // ISO datetime for approved
  rejectedDate?: string; // ISO datetime for rejected
}

// Logic from Mobile
const getConsolidatedFunds = (): FundRequest[] => {
  const funds: FundRequest[] = [];
  
  if (!PATIENTS_DATA || !Array.isArray(PATIENTS_DATA)) {
      return funds;
  }
  
  PATIENTS_DATA.forEach(patient => {
    if (patient.funds) {
      patient.funds.forEach((fund: any, index: number) => {
         funds.push({
           id: `FUND-${patient.id}-${index}`,
           patientName: patient.name,
           patientId: patient.hn,
           patientImage: patient.image,
           patientDob: patient.dob,
           patientGender: patient.gender,
           diagnosis: patient.diagnosis,
           amount: fund.amount,
           reason: fund.reason || fund.name, 
           requestDate: fund.date || (fund.history && fund.history.length > 0 ? fund.history[0].date : '3 ธ.ค. 68'),
           requestDateRaw: fund.dateRaw || undefined,
           status: (fund.status || 'Approved') as 'Pending' | 'Approved' | 'Rejected', 
           hospital: patient.hospital || 'รพ.มหาราชนครเชียงใหม่',
           type: fund.name,
           approvedDate: fund.approvedDate || undefined,
           rejectedDate: fund.rejectedDate || undefined,
         });
      });
    }
  });

  return funds;
};

export default function FundSystem({ patient, onBack }: FundSystemProps) {
  // --- State ---
  const [activeTab, setActiveTab] = useState("requests");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  
  // Data Source
  const [funds, setFunds] = useState<FundRequest[]>(getConsolidatedFunds());
  
  // UI States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundRequest | null>(null);
  
  const [requestToEdit, setRequestToEdit] = useState<FundRequest | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetRequest, setTargetRequest] = useState<FundRequest | null>(null);
  const [filterFundType, setFilterFundType] = useState<string>("all");

  // --- Filter Logic (Matched with Mobile) ---
  const getFilteredFunds = (tab: 'requests' | 'history') => {
    return funds.filter(fund => {
      // Tab filtering — requests only Pending, history shows ALL statuses
      if (tab === 'requests' && fund.status !== 'Pending') return false;

      // Status filtering
      if (filterStatus !== 'All' && fund.status !== filterStatus) return false;

      // Search filtering
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        if (!fund.patientName.toLowerCase().includes(query) && !fund.patientId.toLowerCase().includes(query)) {
            return false;
        }
      }

      // Fund type filtering
      if (filterFundType && filterFundType !== 'all') {
        if (!(fund.type || '').includes(filterFundType)) return false;
      }

      // Patient Prop filtering (Web Specific Context)
      if (patient) {
          if (fund.patientName !== patient.name && fund.patientId !== patient.hn) return false;
      }

      return true;
    });
  };

  // Group funds by requestDateRaw for history display (matched with HomeVisit pattern)
  const groupFundsByDate = (items: FundRequest[]) => {
    const groups: { date: string; label: string; items: FundRequest[] }[] = [];
    const map = new Map<string, FundRequest[]>();
    items.forEach(item => {
      const dateKey = String(item.requestDateRaw || item.requestDate || 'unknown');
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(item);
    });
    // Sort by ISO date descending (newest first)
    const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    sortedKeys.forEach(dateKey => {
      let label = dateKey;
      // If it's an ISO date, format with formatThaiDateWithDay
      if (dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const d = new Date(dateKey + 'T00:00:00');
        if (!isNaN(d.getTime())) label = formatThaiDateWithDay(d);
      }
      groups.push({ date: dateKey, label, items: map.get(dateKey)! });
    });
    return groups;
  };

  // --- Handlers ---

  const handleCreateSubmit = (data: any) => {
    // Mock Create
    toast.success("ส่งคำขอทุนเรียบร้อยแล้ว");
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (data: any) => {
    // Mock Edit
    toast.success("แก้ไขคำขอเรียบร้อยแล้ว");
    setRequestToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (targetRequest) {
      setFunds(prev => prev.filter(req => req.id !== targetRequest.id));
      setIsDeleteOpen(false);
      setTargetRequest(null);
      toast.success("ลบคำขอเรียบร้อยแล้ว");
    }
  };

  // --- Detail / Create / Edit Rendering ---
  
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
        initialData={{
            id: requestToEdit.id,
            patientName: requestToEdit.patientName,
            hn: requestToEdit.patientId,
            fundType: requestToEdit.type,
            amount: requestToEdit.amount,
            requestDate: requestToEdit.requestDate,
            status: requestToEdit.status,
            doctor: "แพทย์ผู้รับผิดชอบ" 
        }}
      />
    );
  }

  if (selectedFund) {
    return (
      <FundRequestDetailPage
        request={{
            id: selectedFund.id,
            patientName: selectedFund.patientName,
            hn: selectedFund.patientId,
            fundType: selectedFund.type,
            amount: selectedFund.amount,
            requestDate: selectedFund.requestDate,
            status: selectedFund.status,
            doctor: "แพทย์ผู้รับผิดชอบ",
            patientImage: selectedFund.patientImage,
            patientDob: selectedFund.patientDob,
            patientGender: selectedFund.patientGender,
            diagnosis: selectedFund.diagnosis,
            approvedDate: selectedFund.approvedDate,
            rejectedDate: selectedFund.rejectedDate,
        }}
        onBack={() => setSelectedFund(null)}
      />
    );
  }

  const currentList = activeTab === 'requests' ? getFilteredFunds('requests') : getFilteredFunds('history');

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

      {/* Dashboard Stats Cards (Derived from Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{funds.length}</p>
                  <p className="text-blue-600/80 text-sm">รายการทั้งหมด</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-orange-600 font-bold text-2xl">{funds.filter(r => r.status === 'Pending').length}</p>
                  <p className="text-orange-600/80 text-sm">รอพิจารณา</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">{funds.filter(r => r.status === 'Approved').length}</p>
                  <p className="text-green-600/80 text-sm">อนุมัติแล้ว</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <Coins className="w-5 h-5 text-green-600" />
              </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">{funds.filter(r => r.status === 'Rejected').length}</p>
                  <p className="text-red-600/80 text-sm">ถูกปฏิเสธ</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
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

                <Button onClick={() => setIsCreateOpen(true)} className="bg-[#7367f0] hover:bg-[#5e54ce] h-[40px] gap-2">
                    <Plus className="w-4 h-4" /> <span className="hidden sm:inline">สร้างคำขอทุน</span>
                </Button>
             </div>
        </div>

        <div className="p-6">
            <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                {/* Filters Section */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-4 p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 items-center justify-between">
                        
                        {/* Tabs (Left) */}
                         <TabsList className="bg-white p-1 rounded-md border border-gray-200 flex items-center shadow-sm h-auto">
                             <TabsTrigger
                                value="requests"
                                className="px-4 py-1.5 text-sm font-medium rounded transition-all flex items-center justify-center data-[state=active]:bg-[#7367f0] data-[state=active]:text-white data-[state=active]:shadow-sm relative"
                             >
                                รายการทุน
                                {funds.filter(r => r.status === 'Pending').length > 0 && 
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                        {funds.filter(r => r.status === 'Pending').length}
                                    </span>
                                }
                             </TabsTrigger>
                             <TabsTrigger
                                value="history"
                                className="px-4 py-1.5 text-sm font-medium rounded transition-all flex items-center justify-center data-[state=active]:bg-[#7367f0] data-[state=active]:text-white data-[state=active]:shadow-sm"
                             >
                                ประวัติทุน
                             </TabsTrigger>
                         </TabsList>

                        {/* Filters (Right) */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">กองทุน:</span>
                                <Select value={filterFundType} onValueChange={setFilterFundType}>
                                    <SelectTrigger className="w-[220px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm">
                                        <SelectValue placeholder="กองทุน" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">ทั้งหมด</SelectItem>
                                        <SelectItem value="กองทุนมูลนิธิตะวันยิ้ม">กองทุนมูลนิธิตะวันยิ้ม</SelectItem>
                                        <SelectItem value="กองทุนช่วยเหลือฉุกเฉิน">กองทุนช่วยเหลือฉุกเฉิน</SelectItem>
                                        <SelectItem value="กองทุนพัฒนาคุณภาพชีวิต">กองทุนพัฒนาคุณภาพชีวิต</SelectItem>
                                        <SelectItem value="ทุนสภากาชาดไทย">ทุนสภากาชาดไทย</SelectItem>
                                        <SelectItem value="กองทุนเพื่อผู้ยากไร้">กองทุนเพื่อผู้ยากไร้</SelectItem>
                                        <SelectItem value="ทุนอบจ.เชียงใหม่">ทุนอบจ.เชียงใหม่</SelectItem>
                                        <SelectItem value="มูลนิธิขาเทียม">มูลนิธิขาเทียม</SelectItem>
                                        <SelectItem value="กองทุนฟื้นฟูสมรรถภาพ">กองทุนฟื้นฟูสมรรถภาพ จ.เชียงใหม่</SelectItem>
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
                                        <SelectItem value="All">ทั้งหมด</SelectItem>
                                        <SelectItem value="Pending">รอพิจารณา</SelectItem>
                                        <SelectItem value="Approved">อนุมัติ</SelectItem>
                                        <SelectItem value="Rejected">ปฎิเสธ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm text-gray-500 font-medium whitespace-nowrap">วันที่สร้างคำขอ:</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm justify-start text-left font-normal">
                                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                            {selectedDate ? (() => {
                                                const date = new Date(selectedDate);
                                                return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
                                            })() : "ทั้งหมด"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                        <CalendarPicker
                                            mode="single"
                                            selected={selectedDate ? new Date(selectedDate) : undefined}
                                            onSelect={(date) => setSelectedDate(date ? toISODateString(date) : "")}
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
                </div>

                <TabsContent value="requests" className="mt-0">
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
                                {getFilteredFunds('requests').length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <Coins className="w-10 h-10 opacity-20" />
                                                <p className="text-sm">ไม่พบรายการ</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    getFilteredFunds('requests').map((req) => (
                                        <TableRow 
                                            key={req.id} 
                                            className="cursor-pointer hover:bg-slate-50 group"
                                            onClick={() => setSelectedFund(req)}
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
                                                    <Badge variant="outline" className="text-gray-500 text-[10px] h-5 border-gray-200 bg-gray-50">HN: {req.patientId}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                    {req.type}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-[#5e5873] text-sm font-medium">
                                                    {req.amount.toLocaleString()} บาท
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                    <Calendar className="w-3 h-3" /> {req.requestDate}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {req.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200 font-normal">รอพิจารณา</Badge>}
                                                {req.status === 'Approved' && <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200 font-normal">อนุมัติ</Badge>}
                                                {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-red-200 font-normal">ปฎิเสธ</Badge>}
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

                {/* History Tab with groupByDate (matched with HomeVisit pattern) */}
                <TabsContent value="history" className="mt-0">
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
                              {groupFundsByDate(getFilteredFunds('history')).flatMap(group => [
                                   /* Date Divider Row */
                                   <TableRow key={`divider-${group.date}`} className="bg-gray-50/80 hover:bg-gray-50/80">
                                       <TableCell colSpan={7} className="py-2">
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
                                   ...group.items.map((req) => (
                                         <TableRow 
                                             key={req.id} 
                                             className="cursor-pointer hover:bg-slate-50 group"
                                             onClick={() => setSelectedFund(req)}
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
                                                    <Badge variant="outline" className="text-gray-500 text-[10px] h-5 border-gray-200 bg-gray-50">HN: {req.patientId}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                    {req.type}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-[#5e5873] text-sm font-medium">
                                                    {req.amount.toLocaleString()} บาท
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                    <Calendar className="w-3 h-3" /> {req.requestDate}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {req.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200 font-normal">รอพิจารณา</Badge>}
                                                {req.status === 'Approved' && <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200 font-normal">อนุมัติ</Badge>}
                                                {req.status === 'Rejected' && <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-red-200 font-normal">ปฎิเสธ</Badge>}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {/* View only in history */}
                                            </TableCell>
                                        </TableRow>
                                     ))
                                 ])}
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