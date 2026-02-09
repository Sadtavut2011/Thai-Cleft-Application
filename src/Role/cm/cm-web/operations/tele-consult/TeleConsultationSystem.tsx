import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../../../components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";
import { Textarea } from "../../../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Separator } from "../../../../../components/ui/separator";
import { 
  ArrowLeft, 
  Upload,
  Stethoscope,
  MapPin,
  ChevronRight,
  Monitor,
  Video, 
  Plus, 
  Search, 
  Clock, 
  Calendar, 
  User, 
  Smartphone, 
  Building2, 
  Link as LinkIcon,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle,
  History,
  CheckCircle2,
  XCircle,
  Printer,
  MoreHorizontal,
  FileText,
  Filter,
  Send,
  MoreVertical,
  Paperclip,
  Users,
  Copy
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { TeleConsultationSystemDetail } from "./TeleConsultationSystemDetail";

// --- Mock Data ---
export interface Appointment {
  id: string;
  patientName: string;
  hn: string;
  date: string;
  time: string;
  doctor: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  channel: 'Direct' | 'Intermediary';
  intermediaryName?: string;
  meetingLink: string;
  treatmentDetails?: string; // New field for details
}

const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-001',
    patientName: 'นาย สมชาย ใจดี',
    hn: '66000123',
    date: '2025-01-15',
    time: '09:00',
    doctor: 'นพ. รักษา ดีมาก',
    status: 'Scheduled',
    channel: 'Direct',
    meetingLink: 'https://zoom.us/j/1234567890',
    treatmentDetails: 'ติดตามอาการเบาหวานและความดันโลหิตสูง ปรับยาตามผลเลือดล่าสุด ผู้ป่วยแจ้งว่ามีอาการเวียนศีรษะบ้างในช่วงเช้า'
  },
  {
    id: 'APT-002',
    patientName: 'นาง สมศรี รักสวย',
    hn: '66000456',
    date: '2025-01-15',
    time: '10:30',
    doctor: 'พญ. ใจดี มีเมตตา',
    status: 'Scheduled',
    channel: 'Intermediary',
    intermediaryName: 'รพ.สต. บ้านใหม่',
    meetingLink: 'https://zoom.us/j/0987654321',
    treatmentDetails: 'ปรึกษาเรื่องผื่นคันเรื้อรัง และอาการปวดข้อเข่าด้านขวา'
  },
  {
    id: 'APT-003',
    patientName: 'ด.ช. เก่ง กล้าหาญ',
    hn: '66000789',
    date: '2025-01-16',
    time: '14:00',
    doctor: 'นพ. เด็กดี',
    status: 'Scheduled',
    channel: 'Direct',
    meetingLink: 'https://zoom.us/j/1122334455',
    treatmentDetails: 'ติดตามอาการหอบหืด พ่นยาแล้วอาการดีขึ้น แต่ยังมีไอตอนกลางคืน'
  }
];

const HISTORY_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-H01',
    patientName: 'นาย สมศักดิ์ จริงใจ',
    hn: '65000111',
    date: '2024-12-20',
    time: '11:00',
    doctor: 'นพ. รักษา ดีมาก',
    status: 'Completed',
    channel: 'Intermediary',
    intermediaryName: 'รพ.สต. ทุ่งนา',
    meetingLink: 'https://zoom.us/j/oldlink1',
    treatmentDetails: 'ตรวจติดตามแผลผ่าตัด แผลแห้งดี ตัดไหมแล้ว'
  },
  {
    id: 'APT-H02',
    patientName: 'นางสาว มานี มีใจ',
    hn: '65000222',
    date: '2024-12-18',
    time: '09:30',
    doctor: 'พญ. ใจดี มีเมตตา',
    status: 'Cancelled',
    channel: 'Direct',
    meetingLink: 'https://zoom.us/j/oldlink2',
    treatmentDetails: 'ผู้ป่วยขอเลื่อนนัดเนื่องจากติดธุระด่วน'
  }
];

type ChannelType = 'Direct' | 'Intermediary';

interface FormData {
    id?: string;
    patientName: string;
    hn: string;
    date: string;
    time: string;
    treatmentDetails: string;
    channel: ChannelType;
    intermediaryName?: string;
    meetingLink: string;
}

const INITIAL_FORM_DATA: FormData = {
    patientName: '',
    hn: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    treatmentDetails: '',
    channel: 'Direct',
    meetingLink: ''
};

export default function TeleConsultationSystem({
  onBack,
  onViewPatient
}: {
  onBack?: () => void;
  onViewPatient?: (patient: any) => void;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>(UPCOMING_APPOINTMENTS);
  const [history] = useState<Appointment[]>(HISTORY_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Create/Edit Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const filteredAppointments = appointments.filter(apt => {
      const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            apt.hn.includes(searchTerm);
      const matchesDate = selectedDate ? apt.date === selectedDate : true;
      return matchesSearch && matchesDate;
  });

  const handleCreateClick = () => {
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
      setIsCreateOpen(true);
  };

  const validateForm = () => {
      const newErrors: any = {};
      if (!formData.patientName) newErrors.patientName = "กรุณาระบุชื่อผู้ป่วย";
      if (!formData.date) newErrors.date = "กรุณาระบุวันที่";
      if (!formData.time) newErrors.time = "กรุณาระบุเวลา";
      if (!formData.treatmentDetails) newErrors.treatmentDetails = "กรุณาระบุรายละเอียด";
      if (!formData.meetingLink) newErrors.meetingLink = "กรุณาระบุ Meeting Link";
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
      if (!validateForm()) return;

      const newAppointment: Appointment = {
          id: formData.id || `APT-${Date.now()}`,
          patientName: formData.patientName,
          hn: formData.hn || '-',
          date: formData.date,
          time: formData.time,
          doctor: 'พญ. ใจดี มีเมตตา (Host)', // Mock
          status: 'Scheduled',
          channel: formData.channel,
          intermediaryName: formData.intermediaryName,
          meetingLink: formData.meetingLink,
          treatmentDetails: formData.treatmentDetails
      };

      if (formData.id) {
          setAppointments(prev => prev.map(p => p.id === formData.id ? newAppointment : p));
          toast.success("แก้ไขนัดหมายเรียบร้อยแล้ว");
      } else {
          setAppointments(prev => [newAppointment, ...prev]);
          toast.success("สร้างนัดหมายใหม่เรียบร้อยแล้ว");
      }
      setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 relative font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Header Banner */}
      {!selectedAppointment && (
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
              <Video className="w-5 h-5" /> ระบบการแพทย์ทางไกล (Tele-medicine)
          </h1>
        </div>

      </div>
      )}

      {!selectedAppointment && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-orange-600 font-bold text-2xl">{appointments.filter(a => a.status === 'Scheduled').length}</p>
                  <p className="text-orange-600/80 text-sm">รอการตรวจ</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
              </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{appointments.filter(a => a.channel === 'Direct').length}</p>
                  <p className="text-blue-600/80 text-sm">Direct to Patient</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-purple-600 font-bold text-2xl">{appointments.filter(a => a.channel === 'Intermediary').length}</p>
                  <p className="text-purple-600/80 text-sm">Via Host Agency</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                  <Building2 className="w-5 h-5 text-purple-600" />
              </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">{history.filter(a => a.status === 'Cancelled').length}</p>
                  <p className="text-red-600/80 text-sm">ยกเลิกนัดหมาย</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="w-5 h-5 text-red-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">{history.filter(a => a.status === 'Completed').length}</p>
                  <p className="text-green-600/80 text-sm">ตรวจเสร็จสิ้น</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
          </div>
      </div>
      )}

      {/* Main Content: Detail View OR List View */}
      {selectedAppointment ? (
        <TeleConsultationSystemDetail 
          appointment={selectedAppointment} 
          onBack={() => setSelectedAppointment(null)} 
        />
      ) : (
      <Card className="border-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
        
        {/* Card Header with Search */}
        <div className="p-6 border-b border-[#EBE9F1] flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#5e5873] flex items-center gap-2">
                <Video className="w-5 h-5 text-[#7367f0]" /> รายการTele-consult
            </h2>
             
             <div className="flex items-center gap-3 w-full md:w-auto">
                 {/* Search */}
                 <div className="relative w-full max-w-[300px]">
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, HN..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pr-10 h-[40px] border-[#EBE9F1] bg-white focus:ring-[#40bfff]"
                    />
                    <div className="absolute right-0 top-0 h-full w-10 bg-[rgb(115,103,240)] flex items-center justify-center rounded-r-md cursor-pointer hover:bg-[#23af62]">
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
             </div>
        </div>

        <div className="p-6">
                <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                {/* Filters Section */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 items-center justify-between">
                    <TabsList className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 h-auto">
                        <TabsTrigger 
                            value="upcoming" 
                            className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#7367f0] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-500 hover:text-[#7367f0] min-w-[140px]"
                        >
                            รายการนัดหมาย
                        </TabsTrigger>
                        <TabsTrigger 
                            value="history" 
                            className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#7367f0] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-500 hover:text-[#7367f0] min-w-[140px] relative"
                        >
                            ประวัติย้อนหลัง
                            {history.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white shadow-sm">
                                    {history.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <Filter className="w-4 h-4" /> สถานะ:
                        </div>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px]">
                                <SelectValue placeholder="สถานะ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ทั้งหมด</SelectItem>
                                <SelectItem value="scheduled">นัดหมายแล้ว</SelectItem>
                                <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                                <SelectItem value="cancelled">ยกเลิก</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Tab: Upcoming Appointments */}
                <TabsContent value="upcoming" className="mt-0">
                   <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[60px]"></TableHead>
                                <TableHead>วัน/เวลา</TableHead>
                                <TableHead>ผู้ป่วย</TableHead>
                                <TableHead>ช่องทาง</TableHead>
                                <TableHead>ผู้ดูแลรับผิดชอบ</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAppointments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <Calendar className="w-10 h-10 opacity-20" />
                                            <p className="text-sm">ไม่มีรายการนัดหมายที่กำลังจะถึง</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAppointments.map((apt) => (
                                    <TableRow
                                        key={apt.id}
                                        className="cursor-pointer hover:bg-slate-50 group"
                                        onClick={() => setSelectedAppointment(apt)}
                                    >
                                        <TableCell>
                                           <div className={cn("p-2 rounded-lg w-fit", 
                                               apt.status === 'Scheduled' ? "bg-orange-100 text-orange-600" :
                                               apt.status === 'Completed' ? "bg-green-100 text-green-600" :
                                               "bg-red-100 text-red-600"
                                           )}>
                                               {apt.status === 'Scheduled' ? <Clock className="w-4 h-4" /> :
                                                apt.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> :
                                                <XCircle className="w-4 h-4" />}
                                           </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-[#5e5873] font-medium">{format(new Date(apt.date), "dd MMM yyyy", { locale: th })}</div>
                                            <div className="text-xs text-[#b9b9c3]">{apt.time}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{apt.patientName}</div>
                                                <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {apt.hn}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                                {apt.channel === 'Direct' ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-medium">
                                                        <Smartphone className="w-3 h-3" /> Direct
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-start gap-1">
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-medium">
                                                            <Building2 className="w-3 h-3" /> Via Host
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 px-1 truncate max-w-[120px]">
                                                            {apt.intermediaryName}
                                                        </span>
                                                    </div>
                                                )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-[#5e5873]">{apt.doctor || "-"}</div>
                                        </TableCell>
                                        <TableCell>
                                                <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200">
                                                    รอการตรวจ
                                                </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="inline-block"
                                            >
                                                <a 
                                                    href={apt.meetingLink} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="inline-flex items-center gap-1.5 text-[#7367f0] hover:text-[#5e54ce] hover:bg-[#7367f0]/5 px-2 py-1 rounded text-xs font-medium transition-colors"
                                                >
                                                    <Video className="w-3.5 h-3.5" /> Join
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                   </div>
                </TabsContent>

                {/* Tab: History Tracking */}
                <TabsContent value="history" className="mt-0">
                   <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[60px]"></TableHead>
                                <TableHead>วัน/เวลา</TableHead>
                                <TableHead>ผู้ป่วย</TableHead>
                                <TableHead>ช่องทาง</TableHead>
                                <TableHead>ผู้ดูแลรับผิดชอบ</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {history.map((apt) => (
                               <TableRow 
                                    key={apt.id} 
                                    className="cursor-pointer hover:bg-slate-50 group"
                                    onClick={() => setSelectedAppointment(apt)}
                               >
                                   <TableCell>
                                       <div className={cn("p-2 rounded-lg w-fit", 
                                           apt.status === 'Completed' ? "bg-green-100 text-green-600" :
                                           "bg-red-100 text-red-600"
                                       )}>
                                           {apt.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                       </div>
                                   </TableCell>
                                   <TableCell>
                                       <div className="text-[#5e5873] font-medium">{format(new Date(apt.date), "dd MMM yyyy", { locale: th })}</div>
                                       <div className="text-xs text-[#b9b9c3]">{apt.time}</div>
                                   </TableCell>
                                   <TableCell>
                                       <div>
                                           <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{apt.patientName}</div>
                                           <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {apt.hn}</Badge>
                                       </div>
                                   </TableCell>
                                   <TableCell>
                                       <div className="text-xs text-[#5e5873]">
                                            {apt.channel === 'Direct' ? 'Direct to Patient' : `Via ${apt.intermediaryName}`}
                                       </div>
                                   </TableCell>
                                   <TableCell>
                                       <div className="text-sm text-[#5e5873]">{apt.doctor || "-"}</div>
                                   </TableCell>
                                   <TableCell>
                                         {apt.status === 'Completed' ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none font-medium flex w-fit items-center gap-1">
                                                เสร็จสิ้น
                                            </Badge>
                                         ) : (
                                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none font-medium flex w-fit items-center gap-1">
                                                ยกเลิก
                                            </Badge>
                                         )}
                                   </TableCell>
                                   <TableCell className="text-right">
                                       <div className="text-xs text-[#b9b9c3] font-mono bg-gray-50 px-2 py-1 rounded w-fit max-w-[150px] truncate ml-auto">
                                           {apt.meetingLink}
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

      {/* --- Create/Edit Modal (Kept functionality, matched font style) --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[700px] font-['Montserrat','Noto_Sans_Thai',sans-serif]" aria-describedby={undefined}>
            <DialogHeader className="bg-[#f8f9fa] -mx-6 -mt-6 p-6 border-b">
                <DialogTitle className="flex items-center gap-2 text-[#7367f0]">
                    {formData.id && appointments.some(a => a.id === formData.id) ? 'แก้ไขนัดหมาย' : 'สร้างนัดหมาย Tele-consult ใหม่'}
                </DialogTitle>
                <DialogDescription>
                    กรุณากรอกข้อมูลให้ครบถ้วนเพื่อประสิทธิภาพในการเชื่อมต่อ
                </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-6">
                
                {/* Part A: Essential Details */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                        <User className="w-4 h-4 text-[#7367f0]" /> ส่วนที่ 1: ข้อมูลพื้นฐาน (Essential Details)
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>ชื่อผู้ป่วย <span className="text-red-500">*</span></Label>
                            <Input 
                                placeholder="ระบุชื่อผู้ป่วย" 
                                value={formData.patientName || ''}
                                onChange={e => setFormData({...formData, patientName: e.target.value})}
                                className={errors.patientName ? "border-red-500" : ""}
                            />
                            {errors.patientName && <span className="text-xs text-red-500">{errors.patientName}</span>}
                        </div>
                        <div className="space-y-2">
                            <Label>HN (ถ้ามี)</Label>
                            <Input 
                                placeholder="ระบุ HN" 
                                value={formData.hn || ''}
                                onChange={e => setFormData({...formData, hn: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>รายละเอียดการรักษา / เหตุผลที่นัด <span className="text-red-500">*</span></Label>
                        <Textarea 
                            placeholder="เช่น ติดตามอาการเบาหวาน, ปรึกษาผลเลือด..." 
                            value={formData.treatmentDetails || ''}
                            onChange={e => setFormData({...formData, treatmentDetails: e.target.value})}
                            className={errors.treatmentDetails ? "border-red-500" : ""}
                        />
                         {errors.treatmentDetails && <span className="text-xs text-red-500">{errors.treatmentDetails}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label>วันที่นัด <span className="text-red-500">*</span></Label>
                            <Input 
                                type="date"
                                value={formData.date || ''}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                                className={errors.date ? "border-red-500" : ""}
                            />
                            {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
                         </div>
                         <div className="space-y-2">
                            <Label>เวลา <span className="text-red-500">*</span></Label>
                            <Input 
                                type="time"
                                value={formData.time || ''}
                                onChange={e => setFormData({...formData, time: e.target.value})}
                                className={errors.time ? "border-red-500" : ""}
                            />
                            {errors.time && <span className="text-xs text-red-500">{errors.time}</span>}
                         </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                             Meeting Link (Zoom/Google Meet/etc.) <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input 
                                className={`pl-9 ${errors.meetingLink ? "border-red-500" : ""}`}
                                placeholder="https://..." 
                                value={formData.meetingLink || ''}
                                onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                            />
                        </div>
                        {errors.meetingLink && <span className="text-xs text-red-500">{errors.meetingLink}</span>}
                    </div>
                </div>

                {/* Part B: Channel Selection */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                        <Video className="w-4 h-4 text-[#7367f0]" /> ช่องทาง (Channel)
                    </h3>
                    
                    <RadioGroup 
                        value={formData.channel} 
                        onValueChange={(val) => {
                            const newChannel = val as ChannelType;
                            setFormData({
                                ...formData, 
                                channel: newChannel,
                                intermediaryName: newChannel === 'Intermediary' ? 'โรงพยาบาลฝาง' : ''
                            });
                        }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Direct Option */}
                            <label className={cn(
                                "relative border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-[100px]",
                                formData.channel === 'Direct' 
                                    ? "border-[#34D399] bg-[#ECFDF5] ring-1 ring-[#34D399]" 
                                    : "border-gray-200 hover:border-[#34D399]/50 bg-white"
                            )}>
                                <RadioGroupItem value="Direct" id="direct" className="sr-only" />
                                <div className="flex items-center gap-2 text-[#059669]">
                                    <Smartphone className="w-5 h-5" />
                                    <span className="font-bold text-lg">Direct</span>
                                </div>
                            </label>

                            {/* Via Host Option */}
                            <label className={cn(
                                "relative border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-[100px]",
                                formData.channel === 'Intermediary' 
                                    ? "border-[#3B82F6] bg-[#EFF6FF] ring-1 ring-[#3B82F6]" 
                                    : "border-gray-200 hover:border-[#3B82F6]/50 bg-white"
                            )}>
                                <RadioGroupItem value="Intermediary" id="inter" className="sr-only" />
                                <div className="flex items-center gap-2 text-[#2563EB]">
                                    <Building2 className="w-5 h-5" />
                                    <span className="font-bold text-lg">Via Host</span>
                                </div>
                                {formData.channel === 'Intermediary' && (
                                    <span className="text-sm text-slate-500 font-medium animate-in fade-in slide-in-from-top-1">
                                        {formData.intermediaryName || 'โรงพยาบาลฝาง'}
                                    </span>
                                )}
                            </label>
                        </div>
                    </RadioGroup>
                </div>

            </div>

            <DialogFooter className="bg-gray-50 -mx-6 -mb-6 p-4 border-t gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>ยกเลิก</Button>
                <Button className="bg-[#7367f0]" onClick={handleSave}>บันทึกข้อมูลนัดหมาย</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
