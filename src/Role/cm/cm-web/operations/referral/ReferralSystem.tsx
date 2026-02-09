import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Calendar } from "../../../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../../../components/ui/dialog";
import { Textarea } from "../../../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Separator } from "../../../../../components/ui/separator";
import { 
  ArrowLeft, 
  ArrowDown, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Clock, 
  Edit, 
  Trash2, 
  Filter, 
  AlertTriangle,
  FileText,
  User,
  Ambulance,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Building,
  Send,
  Upload
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, isSameMonth, isSameDay } from "date-fns";
import { th } from "date-fns/locale";
import ReferralSystemDetail, { Referral, ReferralLog } from './ReferralSystemDetail';
import ReferralAdd from './referralADD';

// --- Mock Data ---

const MOCK_REFERRALS: Referral[] = [
  {
    id: "REF-001",
    referralNo: "REF-66-1024",
    patientId: "P-001",
    patientName: "ด.ช. สมชาย ใจดี",
    patientHn: "HN-6600123",
    referralDate: "2023-12-14T09:00:00",
    lastUpdateDate: "2023-12-15T10:30:00",
    type: 'Refer Out',
    sourceHospital: "โรงพยาบาลฝาง",
    destinationHospital: "โรงพยาบาลศิริราช",
    reason: "ต้องการการผ่าตัดแก้ไขปากแหว่งเพดานโหว่ซับซ้อน",
    diagnosis: "Cleft Lip and Palate (Bilateral)",
    urgency: 'Routine',
    status: 'Accepted',
    documents: ["lab_results.pdf", "xray_film.jpg"],
    destinationContact: "คุณพยาบาล วิไล (Case Manager)",
    logs: [
      { date: "2023-12-14T09:00:00", status: "Created", description: "สร้างคำขอส่งตัว", actor: "SCFC Staff (คุณสมศรี)" },
      { date: "2023-12-14T10:15:00", status: "Sent", description: "ส่งคำขอไปยังปลายทาง", actor: "System" },
      { date: "2023-12-15T09:00:00", status: "Viewed", description: "ปลายทางเปิดอ่านข้อมูล", actor: "R.Siriraj Staff" },
      { date: "2023-12-15T10:30:00", status: "Accepted", description: "ตอบรับการส่งตัว นัดหมายวันที่ 20 ธ.ค.", actor: "นพ. ผู้เชี่ยวชาญ (ศิริราช)" },
    ]
  },
  {
    id: "REF-002",
    referralNo: "REF-66-1025",
    patientId: "P-002",
    patientName: "น.ส. มานี มีนา",
    patientHn: "HN-6600124",
    referralDate: "2023-12-15T13:00:00",
    lastUpdateDate: "2023-12-15T13:00:00",
    type: 'Refer Out',
    sourceHospital: "โรงพยาบาลฝาง",
    destinationHospital: "โรงพยาบาลมหาราชนครเชียงใหม่",
    reason: "ปรึกษาทันตกรรมจัดฟันร่วมกับการผ่าตัดขากรรไกร",
    diagnosis: "Skeletal Class III Malocclusion",
    urgency: 'Routine',
    status: 'Pending',
    documents: ["dental_records.pdf"],
    logs: [
      { date: "2023-12-15T13:00:00", status: "Created", description: "สร้างคำขอส่งตัว", actor: "SCFC Staff (คุณสมศรี)" },
      { date: "2023-12-15T13:05:00", status: "Sent", description: "ส่งคำขอไปยังปลายทาง", actor: "System" },
    ]
  },
  {
    id: "REF-003",
    referralNo: "REF-66-1020",
    patientId: "P-003",
    patientName: "นาย ปิติ ยินดี",
    patientHn: "HN-6600111",
    referralDate: "2023-12-10T08:30:00",
    lastUpdateDate: "2023-12-11T14:20:00",
    type: 'Refer Out',
    sourceHospital: "โรงพยาบาลฝาง",
    destinationHospital: "โรงพยาบาลศูนย์ขอนแก่น",
    reason: "Speech Therapy Consultation",
    diagnosis: "Hypernasality",
    urgency: 'Urgent',
    status: 'Rejected',
    documents: ["speech_assessment.pdf"],
    destinationContact: "-",
    logs: [
      { date: "2023-12-10T08:30:00", status: "Created", description: "สร้างคำขอส่งตัว", actor: "SCFC Staff" },
      { date: "2023-12-10T08:45:00", status: "Sent", description: "ส่งคำขอไปยังปลายทาง", actor: "System" },
      { date: "2023-12-11T14:20:00", status: "Rejected", description: "ปฏิเสธ: คิวเต็ม กรุณาส่งต่อ รพ. อื่น", actor: "จนท. รับเรื่อง (ขอนแก่น)" },
    ]
  },
  {
    id: "REF-004",
    referralNo: "REF-IN-66-0001",
    patientId: "P-004",
    patientName: "นาย รักษา ดี",
    patientHn: "HN-6600999",
    referralDate: "2023-12-16T11:00:00",
    lastUpdateDate: "2023-12-16T11:00:00",
    type: 'Refer In',
    sourceHospital: "โรงพยาบาลเชียงรายประชานุเคราะห์",
    destinationHospital: "โรงพยาบาลฝาง",
    reason: "ส่งกลับมารักษาต่อใกล้บ้าน (Continuity of Care)",
    diagnosis: "Post-op Cleft Palate Repair",
    urgency: 'Routine',
    status: 'Pending',
    documents: ["discharge_summary.pdf"],
    logs: [
      { date: "2023-12-16T11:00:00", status: "Created", description: "สร้างคำขอส่งตัว (Refer In)", actor: "R.Chiangrai Staff" },
    ]
  },
];

interface ReferralSystemProps {
  onBack?: () => void;
  initialHN?: string;
}

export default function ReferralSystem({ onBack, initialHN }: ReferralSystemProps) {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [referralDirection, setReferralDirection] = useState<'Refer Out' | 'Refer In' | 'History'>('Refer Out');
  const [historyFilter, setHistoryFilter] = useState<'Refer In' | 'Refer Out'>('Refer In');
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Create Form State
  const [isEditMode, setIsEditMode] = useState(false);
  const [newReferral, setNewReferral] = useState<Partial<Referral>>({
    type: 'Refer Out',
    urgency: 'Routine',
    documents: []
  });

  // Delete Dialog State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetReferral, setTargetReferral] = useState<Referral | null>(null);

  // Initial HN Effect
  React.useEffect(() => {
    if (initialHN) {
      setSearchTerm(initialHN);
    }
  }, [initialHN]);

  // --- Handlers ---

  const handleCreateClick = () => {
    setIsEditMode(false);
    setNewReferral({
      type: 'Refer Out',
      urgency: 'Routine',
      documents: [],
      referralDate: new Date().toISOString(),
      status: 'Pending',
      sourceHospital: 'โรงพยาบาลฝาง'
    });
    setView('create');
  };

  const handleEditClick = (referral: Referral) => {
    setIsEditMode(true);
    setNewReferral({
      ...referral,
      patientName: `${referral.patientName} (${referral.patientHn})`
    });
    setView('create');
  };

  const handleViewDetail = (referral: Referral) => {
    setSelectedReferral(referral);
    setView('detail');
  };

  const handleDetailAccept = (date: Date, note: string) => {
    if (!selectedReferral) return;
    
    const formattedDate = format(date, "d MMM yyyy", { locale: th });
    
    const updatedLogs: ReferralLog[] = [...selectedReferral.logs, { 
      date: new Date().toISOString(), 
      status: 'Accepted', 
      description: `ตอบรับการส่งตัว (นัดหมาย: ${formattedDate})${note ? ` - ${note}` : ''}`, 
      actor: 'โรงพยาบาลฝาง' 
    }];

    const updatedReferral = {
        ...selectedReferral,
        status: 'Accepted' as const,
        logs: updatedLogs
    };

    setReferrals(referrals.map(r => r.id === selectedReferral.id ? updatedReferral : r));
    setSelectedReferral(updatedReferral);
    toast.success("ตอบรับการส่งตัวเรียบร้อยแล้ว");
  };

  const handleDetailCancel = (reason: string) => {
    if (!selectedReferral) return;

    const updatedLogs: ReferralLog[] = [...selectedReferral.logs, { 
      date: new Date().toISOString(), 
      status: 'Canceled', 
      description: `ยกเลิกคำขอ: ${reason}`, 
      actor: 'SCFC Staff' 
    }];

    const updatedReferral = {
        ...selectedReferral,
        status: 'Canceled' as const,
        logs: updatedLogs
    };

    setReferrals(referrals.map(r => r.id === selectedReferral.id ? updatedReferral : r));
    setSelectedReferral(updatedReferral);
    toast.success("ยกเลิกคำขอส่งตัวเรียบร้อยแล้ว");
  };

  const handleConfirmDelete = () => {
    if (targetReferral) {
        setReferrals(prev => prev.filter(r => r.id !== targetReferral.id));
        toast.success("ลบคำขอเรียบร้อยแล้ว");
        setIsDeleteOpen(false);
        setTargetReferral(null);
    }
  };

  const handleSubmitCreate = () => {
    // Mock Submit
    const created: Referral = {
      id: `REF-${Math.floor(Math.random() * 1000)}`,
      referralNo: `REF-66-${Math.floor(Math.random() * 10000)}`,
      patientId: "P-NEW",
      patientName: newReferral.patientName || "New Patient",
      patientHn: newReferral.patientHn || "HN-NEW",
      referralDate: new Date().toISOString(),
      lastUpdateDate: new Date().toISOString(),
      type: 'Refer Out',
      sourceHospital: "โรงพยาบาลฝาง",
      destinationHospital: newReferral.destinationHospital || "Unknown",
      reason: newReferral.reason || "",
      diagnosis: newReferral.diagnosis || "",
      urgency: newReferral.urgency || 'Routine',
      status: 'Pending',
      documents: newReferral.documents || [],
      logs: [
        { date: new Date().toISOString(), status: "Created", description: "สร้างคำขอส่งตัว", actor: "SCFC Staff" },
        { date: new Date().toISOString(), status: "Sent", description: "ส่งคำขอไปยังปลายทาง", actor: "System" }
      ]
    };
    setReferrals([created, ...referrals]);
    toast.success("โรงพยาบาลฝาง ได้ทำการส่งคำขอส่งตัว ผู้ป่วยแล้ว");
    setView('list');
  };

  // --- Render Helpers ---

  const renderTodaysArrivals = () => {
    return (
       <div className="mb-6">
         <div className="flex items-center gap-2 mb-4">
           <div className="bg-green-100 text-green-700 p-2 rounded-lg">
             <Ambulance className="w-5 h-5" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-gray-800">ผู้ป่วยรับเข้าวันนี้ (Today's Arrivals)</h3>
             <p className="text-sm text-gray-500">12 มกราคม 2569</p>
           </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mock Patient 1 */}
            <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                   <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-medium">ยังไม่ได้รับการรักษา</Badge>
                   <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">09:30 น.</span>
                </div>
                <h4 className="font-bold text-gray-800 text-base mb-0.5">ด.ช. อานนท์ รักดี</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Building className="w-3 h-3" />
                    <span>(รพ.ต้นทาง) รพ. มหาราชนครราชสีมา</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-700 bg-[#f8f9fa] p-2.5 rounded-md border border-gray-100">
                   <FileText className="w-3.5 h-3.5 text-yellow-600" />
                   <span className="line-clamp-1">ปากแหว่งเพดานโหว่ (Cleft Lip)</span>
                </div>
              </CardContent>
            </Card>

            {/* Mock Patient 2 */}
            <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">ได้รับการรักษา</Badge>
                   <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">10:45 น.</span>
                </div>
                <h4 className="font-bold text-gray-800 text-base mb-0.5">น.ส. มานี ใจผ่อง</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Building className="w-3 h-3" />
                    <span>(รพ.ต้นทาง) รพ. สตูล</span>
                </div>
                 <div className="flex items-center gap-2 text-xs text-gray-700 bg-[#f8f9fa] p-2.5 rounded-md border border-gray-100">
                   <FileText className="w-3.5 h-3.5 text-green-600" />
                   <span className="line-clamp-1">ปรึกษาศัลยกรรมตกแต่ง (Plastic Surgery)</span>
                </div>
              </CardContent>
            </Card>

            {/* Mock Patient 3 */}
            <Card className="border border-dashed border-gray-200 shadow-none bg-gray-50/50">
               <CardContent className="p-4 flex flex-col items-center justify-center h-full text-gray-400 py-6">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 shadow-sm">
                     <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">ไม่มีรายการเพิ่มเติม</span>
                  <span className="text-xs text-gray-400">อัปเดตล่าสุด: 11:00 น.</span>
               </CardContent>
            </Card>
         </div>
       </div>
    );
  };

  const renderListView = () => {
    const filtered = referrals.filter(r => {
      const matchSearch = r.patientName.includes(searchTerm) || r.referralNo.includes(searchTerm);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchDate = selectedDate ? isSameDay(new Date(r.referralDate), new Date(selectedDate)) : true;

      // Statuses considered as "History"
      const isHistoryStatus = ['Accepted', 'Rejected', 'Completed', 'Canceled'].includes(r.status);

      if (referralDirection === 'History') {
          const matchHistoryType = r.type === historyFilter;
          return matchSearch && matchStatus && isHistoryStatus && matchDate && matchHistoryType;
      } else {
          const matchType = r.type === referralDirection;
          return matchSearch && matchStatus && matchType && !isHistoryStatus && matchDate;
      }
    });

    return (
        <Card className="border-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
          <div className="p-6 border-b border-[#EBE9F1] flex flex-col md:flex-row gap-4 items-center justify-between">
             <h2 className="text-[18px] font-bold text-[#5e5873] flex items-center gap-2">
                 <Send className="w-5 h-5 text-[#7367f0]" /> รายการส่งตัว/รับตัว
             </h2>
             
             <div className="flex items-center gap-3">
                 <div className="relative w-full max-w-[300px]">
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, เลขที่ส่งตัว..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pr-10 h-[40px] border-[#EBE9F1] bg-white focus:ring-[#7367f0]"
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
                        <Calendar
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
                   onClick={handleCreateClick} 
                   className="bg-[#7367f0] hover:bg-[#685dd8] text-white font-medium px-4 py-2 h-[42px] rounded-[5px] shadow-sm gap-2"
                 >
                    <Plus className="h-4 w-4" />
                    <span>สร้างคำขอส่งตัว</span>
                 </Button>
             </div>
          </div>

          <div className="p-6">
             <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 items-center">
                 <div className="bg-white p-1 rounded-md border border-gray-200 flex items-center shadow-sm">
                   <button
                     className={cn(
                       "relative px-4 py-1.5 text-sm font-medium rounded transition-all",
                       referralDirection === 'Refer In' ? "bg-[#7367f0] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                     )}
                     onClick={() => setReferralDirection('Refer In')}
                   >
                     รายการรับตัว
                     {referrals.filter(r => r.type === 'Refer In' && r.status === 'Pending').length > 0 && (
                       <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                         {referrals.filter(r => r.type === 'Refer In' && r.status === 'Pending').length}
                       </span>
                     )}
                   </button>
                   <button
                     className={cn(
                       "px-4 py-1.5 text-sm font-medium rounded transition-all",
                       referralDirection === 'Refer Out' ? "bg-[#7367f0] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                     )}
                     onClick={() => setReferralDirection('Refer Out')}
                   >
                     รายการส่งตัว
                   </button>
                   <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded transition-all",
                        referralDirection === 'History' ? "bg-[#7367f0] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                      )}
                      onClick={() => setReferralDirection('History')}
                    >
                      ประวัติย้อนหลัง
                    </button>
                   </div>
                 </div>

                 <div className="h-8 w-px bg-gray-300 hidden md:block"></div>

                 <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
                    {referralDirection === 'History' && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                             <Select value={historyFilter} onValueChange={(val: any) => setHistoryFilter(val)}>
                                <SelectTrigger className="w-[120px] bg-white border-gray-200 rounded-[6px] h-[38px] text-[#7367f0] font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Refer In">รับตัว</SelectItem>
                                    <SelectItem value="Refer Out">ส่งตัว</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="h-4 w-px bg-gray-300 mx-1"></div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-500 shrink-0">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">สถานะ:</span>
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px]">
                            <SelectValue placeholder="สถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">ทั้งหมด</SelectItem>
                            <SelectItem value="Pending">รอตอบรับ</SelectItem>
                            <SelectItem value="Accepted">ตอบรับแล้ว</SelectItem>
                            <SelectItem value="Rejected">ถูกปฎิเสธ</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
             </div>

             <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="w-[60px]"></TableHead>
                      <TableHead>ผู้ป่วย</TableHead>
                      <TableHead>เส้นทาง</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>ความเร่งด่วน</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                            <div className="flex flex-col items-center gap-3">
                                <FileText className="w-10 h-10 opacity-20" />
                                <p className="text-sm">{referralDirection === 'History' ? "ไม่พบประวัติการส่งตัว" : "ไม่พบข้อมูลการส่งตัว"}</p>
                            </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((referral) => (
                        <TableRow 
                            key={referral.id} 
                            className="cursor-pointer hover:bg-slate-50 group" 
                            onClick={() => handleViewDetail(referral)}
                        >
                          <TableCell>
                             <div className={cn("p-2 rounded-lg w-fit", 
                                referral.status === 'Pending' ? "bg-yellow-100 text-yellow-600" :
                                referral.status === 'Accepted' ? "bg-green-100 text-green-600" :
                                referral.status === 'Rejected' ? "bg-red-100 text-red-600" :
                                referral.status === 'Completed' ? "bg-blue-100 text-blue-600" :
                                "bg-gray-100 text-gray-600"
                             )}>
                                {referral.type === 'Refer Out' ? <Send className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                             </div>
                          </TableCell>
                          <TableCell>
                            <div>
                                <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{referral.patientName}</div>
                                <Badge variant="outline" className="text-gray-500 text-[10px] h-5 border-gray-200 bg-gray-50">{referral.referralNo}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-[#5e5873] text-sm">
                                 <Building size={14} className="text-[#b9b9c3]" />
                                 <span className="text-xs">{referral.sourceHospital}</span>
                              </div>
                              <div className="pl-1">
                                <ArrowDown size={12} className="text-gray-400" />
                              </div>
                              <div className="flex items-center gap-2 text-[#7367f0] font-medium text-sm">
                                 <Building size={14} />
                                 <span>{referral.destinationHospital}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-1 text-gray-400 text-xs">
                                 <CalendarIcon className="w-3 h-3" /> {format(new Date(referral.referralDate), "d MMM yy", { locale: th })}
                             </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn("text-xs font-medium uppercase tracking-wide", 
                                referral.urgency === 'Emergency' ? "text-red-600" : 
                                referral.urgency === 'Urgent' ? "text-orange-500" : "text-gray-600"
                            )}>
                              {referral.urgency}
                            </div>
                          </TableCell>
                          <TableCell>
                             {referral.status === 'Pending' && <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200 font-normal">รอการตอบรับ</Badge>}
                             {referral.status === 'Accepted' && <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 font-normal">ตอบรับแล้ว</Badge>}
                             {referral.status === 'Rejected' && <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 font-normal">ถูกปฏิเสธ</Badge>}
                             {referral.status === 'Completed' && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 font-normal">เสร็จสิ้น</Badge>}
                             {referral.status === 'Canceled' && <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200 font-normal">ยกเลิก</Badge>}
                          </TableCell>
                          <TableCell className="text-right">
                             <div className="flex items-center justify-end gap-1">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-gray-400 hover:text-[#7367f0]" 
                                    title="แก้ไขข้อมูล"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(referral);
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
                                        setTargetReferral(referral);
                                        setIsDeleteOpen(true);
                                    }} 
                                    title="ลบ"
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
          </div>
        </Card>
    );
  };



  return (
    <div className="w-full pb-20">
      {view === 'list' && (
      <div className="space-y-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Ambulance className="w-6 h-6 text-[#7367f0]" />
          <h1 className="text-xl font-bold text-[#5e5873]">ระบบส่งตัวผู้ป่วย (Referral System)</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">0</p>
                  <p className="text-blue-600/80 text-sm">เคสรับตัววันนี้</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <Ambulance className="w-5 h-5 text-blue-600" />
              </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-orange-600 font-bold text-2xl">2</p>
                  <p className="text-orange-600/80 text-sm">รอการตอบรับ</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
              </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">2</p>
                  <p className="text-green-600/80 text-sm">ดำเนินการเสร็จสิ้น</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">1</p>
                  <p className="text-red-600/80 text-sm">ถูกปฏิเสธ</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="w-5 h-5 text-red-600" />
              </div>
          </div>
        </div>
      </div>
      )}
      
      {view === 'list' && renderTodaysArrivals()}
      {view === 'list' && renderListView()}
      {view === 'create' && (
        <ReferralAdd 
          onBack={() => setView('list')}
          isEditMode={isEditMode}
          initialData={newReferral}
          onSubmit={(data) => {
             // Merge data back to newReferral state before submitting
             setNewReferral({...newReferral, ...data});
             // We need to delay submit slightly or just call handleSubmitCreate directly if data is passed fully
             // But handleSubmitCreate uses newReferral state. 
             // Ideally refactor handleSubmitCreate to accept data, but for now:
             setTimeout(handleSubmitCreate, 0); 
          }}
        />
      )}
      
      {view === 'detail' && selectedReferral && (
        <ReferralSystemDetail 
            referral={selectedReferral} 
            onBack={() => setView('list')}
            onAccept={handleDetailAccept}
            onCancel={handleDetailCancel}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
         <DialogContent className="max-w-[400px]">
             <DialogHeader>
                 <DialogTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> ยืนยันการลบ
                 </DialogTitle>
                 <DialogDescription className="sr-only">
                    ยืนยันการลบรายการส่งตัว
                 </DialogDescription>
             </DialogHeader>
             <div className="py-4 text-center">
                <p className="text-gray-600">คุณต้องการลบคำขอส่งตัวของ</p>
                <p className="text-lg font-bold text-[#5e5873] my-2">{targetReferral?.patientName}</p>
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
