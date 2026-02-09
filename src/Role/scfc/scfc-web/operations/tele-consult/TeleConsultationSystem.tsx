import React, { useState } from 'react';
import { TeleDetailPage } from "./TeleDetailPage";
import { TeleADD } from "./TeleADD";
import { 
  ArrowLeft, 
  ArrowRight,
  Search, 
  Plus, 
  Filter, 
  Video, 
  Monitor, 
  Users, 
  Clock, 
  Signal, 
  Activity, 
  MessageSquare, 
  ShieldAlert, 
  Settings, 
  Download, 
  MapPin, 
  Building2, 
  Stethoscope, 
  MoreVertical, 
  RefreshCw,
  ExternalLink,
  UserX,
  XCircle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  LayoutDashboard,
  Cpu,
  ChevronRight,
  UserCheck,
  Send,
  ShieldCheck,
  Calendar as CalendarIcon,
  Hospital,
  Printer,
  Mail,
  RotateCcw,
  X
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Separator } from "../../../../../components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useSystem } from "../../../../../context/SystemContext";

// --- Types ---
type TeleStatus = 'Active' | 'Waiting' | 'Scheduled' | 'Delayed' | 'Tech Issue' | 'Completed';
type Platform = 'Zoom' | 'MS Teams' | 'Hospital Link';

interface TeleSession {
  id: string;
  patientName: string;
  hn: string;
  sourceUnit: string; // PCU or Hospital
  specialist: string;
  specialistHospital: string;
  platform: Platform;
  status: TeleStatus;
  urgency: 'Normal' | 'Urgent';
  linkStatus: 'Live' | 'Expired' | 'Checking';
  waitingTime: number; // minutes
  connectionStability: number; // 0-100
  startTime?: string;
}

interface SpecialistStatus {
  hospital: string;
  doctors: { name: string; status: 'Available' | 'In Session' | 'Offline'; department: string }[];
}

// --- Mock Data ---
const MOCK_SESSIONS: TeleSession[] = [
  {
    id: 'TS-101',
    patientName: 'ด.ช. อนันต์ สุขใจ',
    hn: 'HN66001',
    sourceUnit: 'รพ.สต. บ้านหนองหอย',
    specialist: 'นพ. วิศรุต (ศัลยกรรมตกแต่ง)',
    specialistHospital: 'รพ.มหาราชนครเชียงใหม่',
    platform: 'Zoom',
    status: 'Active',
    urgency: 'Normal',
    linkStatus: 'Live',
    waitingTime: 12,
    connectionStability: 98,
    startTime: '2026-01-21 13:30'
  },
  {
    id: 'TS-102',
    patientName: 'นาง มะลิ แซ่ลี้',
    hn: 'HN66052',
    sourceUnit: 'รพ.ฝาง',
    specialist: 'พญ. พรทิพย์ (ทันตกรรม)',
    specialistHospital: 'รพ.เชียงรายประชานุเคราะห์',
    platform: 'Hospital Link',
    status: 'Tech Issue',
    urgency: 'Urgent',
    linkStatus: 'Checking',
    waitingTime: 45,
    connectionStability: 32,
    startTime: '2026-01-21 13:15'
  },
  {
    id: 'TS-103',
    patientName: 'นาย ปิติ ยินดี',
    hn: 'HN66112',
    sourceUnit: 'รพ.ลำพูน',
    specialist: 'นพ. เกรียงไกร (หูคอจมูก)',
    specialistHospital: 'รพ.มหาราชนครเชียงใหม่',
    platform: 'MS Teams',
    status: 'Waiting',
    urgency: 'Normal',
    linkStatus: 'Live',
    waitingTime: 5,
    connectionStability: 100
  }
];

const SPECIALIST_AVAILABILITY: SpecialistStatus[] = [
  {
    hospital: 'รพ.มหาราชนครเชียงใหม่',
    doctors: [
      { name: 'นพ. วิศรุต', status: 'In Session', department: 'ศัลยกรรมตกแต่ง' },
      { name: 'พญ. จันจิรา', status: 'Available', department: 'อรรถบำบัด' },
    ]
  },
  {
    hospital: 'รพ.เชียงรายประชานุเคราะห์',
    doctors: [
      { name: 'พญ. พรทิพย์', status: 'In Session', department: 'ทันตกรรม' },
      { name: 'นพ. สมเกียรติ', status: 'Offline', department: 'ศัลยกรรมตกแต่ง' },
    ]
  }
];

const STABILITY_DATA = [
  { time: '13:00', stability: 98 },
  { time: '13:10', stability: 95 },
  { time: '13:20', stability: 82 },
  { time: '13:30', stability: 45 }, 
  { time: '13:40', stability: 70 },
  { time: '13:50', stability: 99 },
];

const WAIT_TIME_TREND = [
  { day: 'จ.', avg: 12 },
  { day: 'อ.', avg: 18 },
  { day: 'พ.', avg: 25 },
  { day: 'พฤ.', avg: 15 },
  { day: 'ศ.', avg: 10 },
];

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const CLINICS = ["ทุกแผนก", "ศัลยกรรมตกแต่ง", "ทันตกรรม", "หูคอจมูก", "กุมารเวช", "อรรถบำบัด"];

// --- Helper Functions ---
const getStatusColor = (status: TeleStatus) => {
  switch (status) {
    case 'Active': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Waiting': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Tech Issue': return 'bg-red-100 text-red-700 border-red-200';
    case 'Delayed': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const translateStatus = (status: TeleStatus) => {
  switch (status) {
    case 'Active': return 'กำลังตรวจ';
    case 'Waiting': return 'รอตรวจ';
    case 'Tech Issue': return 'ปัญหาเทคนิค';
    case 'Delayed': return 'ล่าช้า';
    case 'Scheduled': return 'นัดหมายแล้ว';
    case 'Completed': return 'เสร็จสิ้น';
    default: return status;
  }
};

export default function TeleConsultationSystem({ onBack }: { onBack?: () => void }) {
  const { stats } = useSystem();
  const [selectedSession, setSelectedSession] = useState<TeleSession | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedItems.length === MOCK_SESSIONS.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(MOCK_SESSIONS.map(s => s.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchPrint = () => {
    toast.success(`กำลังเตรียมพิมพ์ใบนัด (${selectedItems.length} รายการ)`, {
      description: "ระบบกำลังสร้างไฟล์สำหรับพิมพ์ชุดใบนัดทางไกล"
    });
  };

  const handleBatchNotify = () => {
    toast.info(`ส่งการแจ้งเตือนไปยัง ${selectedItems.length} รายการ`, {
      description: "ระบบกำลังส่งลิงก์การเข้าตรวจทาง SMS/Line"
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700 font-sans">
      {isAdding ? (
        <TeleADD 
          onBack={() => setIsAdding(false)} 
          onSave={(data) => {
            console.log(data);
            setIsAdding(false);
          }} 
        />
      ) : selectedSession ? (
        <TeleDetailPage 
          session={selectedSession}
          stabilityData={STABILITY_DATA}
          onBack={() => setSelectedSession(null)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <div className="bg-teal-600 text-white p-1 rounded">
                   <ShieldCheck size={16} />
                 </div>
                 <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">SCFC Tele-Health Mode</span>
               </div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">ศูนย์ประสานงาน <span className="text-teal-600">Tele-Consultation</span></h1>
               <p className="text-slate-500 text-sm font-medium">ระบบควบคุมและติดตามการรักษาทางไกล 8 จังหวัดภาคเหนือ</p>
            </div>
            <div className="flex gap-2">
               <div className="flex items-center gap-2 text-xs font-bold mr-4 self-center">
                  <span className="text-slate-400 uppercase">สถานะเครือข่าย:</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    ONLINE
                  </span>
               </div>
               
               {onBack && (
                 <Button variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600 font-bold text-xs px-4 bg-white shadow-sm" onClick={onBack}>
                   <ArrowLeft size={16} className="mr-2" /> ย้อนกลับ
                 </Button>
               )}

               <Button onClick={() => setIsAdding(true)} className="h-10 bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 shadow-lg rounded-xl">
                 <Plus size={16} className="mr-2" /> สร้างห้อง
               </Button>
               
               <Button className="h-10 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 shadow-lg shadow-teal-600/20 rounded-xl">
                 <LayoutDashboard size={16} className="mr-2" /> ดูภาพรวมทั้งหมด
               </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-purple-600 rounded-xl transition-all hover:shadow-md">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                   <Video className="text-purple-600" size={20} />
                 </div>
                 <Badge className="bg-purple-50 text-purple-700 border-none text-[10px] font-black uppercase tracking-widest px-2 rounded-full">Live</Badge>
               </div>
               <div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">จำนวนการปรึกษาขณะนี้</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.teleConsult.active} เคส</h3>
                 <div className="mt-2 flex items-center gap-2">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200 shadow-sm" />)}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">จาก 4 โรงพยาบาลศูนย์</span>
                 </div>
               </div>
            </Card>
            
            <Card className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-amber-500 rounded-xl transition-all hover:shadow-md">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                   <Clock className="text-amber-500" size={20} />
                 </div>
                 <div className="text-[10px] font-black text-rose-500 flex items-center gap-1">
                    <TrendingUp size={12} /> +2m
                 </div>
               </div>
               <div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">ระยะเวลารอคอยเฉลี่ย</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.teleConsult.avgWait || '12 min'}</h3>
                 <div className="mt-2 h-[30px] w-full min-h-[30px] min-w-0" style={{ width: '100%', height: '30px', minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                       <BarChart data={WAIT_TIME_TREND}>
                        <Bar dataKey="avg" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
               </div>
            </Card>

            <Card className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-emerald-500 rounded-xl transition-all hover:shadow-md">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                   <Signal className="text-emerald-500" size={20} />
                 </div>
                 <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-black uppercase tracking-widest px-2 rounded-full">Stable</Badge>
               </div>
               <div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">ความเสถียรของระบบ</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.teleConsult.stability || '99.9'}%</h3>
                 <div className="mt-2 h-[30px] w-full min-h-[30px] min-w-0" style={{ width: '100%', height: '30px', minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                       <AreaChart data={STABILITY_DATA}>
                        <Area type="monotone" dataKey="stability" stroke="#10b981" fill="#ecfdf5" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
               </div>
            </Card>

            <Card className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-blue-600 rounded-xl transition-all hover:shadow-md">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                   <Stethoscope className="text-blue-600" size={20} />
                 </div>
               </div>
               <div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">ผู้เชี่ยวชาญพร้อมให้บริการ</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats.teleConsult.specialists || '14'} ท่าน</h3>
                 <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Specialists Available</span>
                    <ArrowRight size={14} className="text-slate-300" />
                 </div>
               </div>
            </Card>
          </div>

          {/* Optimized Search & Filter Container (Appointment System Style) */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4 transition-all hover:shadow-md">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือ รพ. ปลายทาง..." 
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
               <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                 <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200 text-xs font-bold rounded-xl">
                   <div className="flex items-center gap-2">
                     <MapPin size={16} className="text-teal-600" />
                     <SelectValue placeholder="จังหวัด" />
                   </div>
                 </SelectTrigger>
                 <SelectContent>
                   {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                 </SelectContent>
               </Select>

               <Select defaultValue="ทุกแผนก">
                 <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200 text-xs font-bold rounded-xl">
                   <div className="flex items-center gap-2">
                     <Hospital size={16} className="text-teal-600" />
                     <SelectValue placeholder="ทุกแผนก" />
                   </div>
                 </SelectTrigger>
                 <SelectContent>
                   {CLINICS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                 </SelectContent>
               </Select>

               <Popover>
                 <PopoverTrigger asChild>
                   <Button variant="outline" className="h-11 bg-white border-slate-200 text-xs font-bold px-4 rounded-xl">
                     <CalendarIcon size={16} className="mr-2 text-teal-600" />
                     {format(new Date(selectedDate), "d MMM yyyy", { locale: th })}
                   </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0 rounded-xl overflow-hidden shadow-2xl border-none" align="end">
                   <CalendarPicker 
                     mode="single" 
                     selected={new Date(selectedDate)} 
                     onSelect={(d) => d && setSelectedDate(format(d, "yyyy-MM-dd"))} 
                     locale={th}
                     className="p-3"
                   />
                 </PopoverContent>
               </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-6">
               <Card className="border-slate-200 shadow-sm overflow-hidden bg-white rounded-xl">
                 <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 min-h-[80px]">
                   <div className="flex items-center gap-4">
                     <h2 className="font-bold text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                        <Monitor size={18} className="text-teal-600" /> 
                        รายการรอปรึกษาทางไกล (Global Waiting Room)
                     </h2>
                     {selectedItems.length === 0 && (
                        <Badge className="bg-teal-100 text-teal-700 border-none px-2 h-5 text-[9px] font-black uppercase tracking-widest rounded-full animate-in fade-in duration-300">Live Updates</Badge>
                     )}
                   </div>
                   
                   <div className="flex items-center gap-2">
                      {selectedItems.length > 0 ? (
                        <div className="flex items-center gap-3 animate-in slide-in-from-right-2">
                           <div className="flex flex-col items-end mr-2">
                              <span className="text-[14px] font-black text-slate-700 leading-none">{selectedItems.length}</span>
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">เลือกแล้ว</span>
                           </div>
                           <Separator orientation="vertical" className="h-8 bg-slate-200" />
                           <Button onClick={handleBatchNotify} variant="outline" size="sm" className="h-10 border-blue-200 text-blue-600 bg-blue-50/50 text-[10px] font-black tracking-widest hover:bg-blue-600 hover:text-white transition-all rounded-xl px-4">
                             <Mail size={14} className="mr-1.5" /> ส่งการแจ้งเตือน
                           </Button>
                           <Button onClick={handleBatchPrint} variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600 bg-white text-[10px] font-black tracking-widest hover:bg-slate-900 hover:text-white transition-all rounded-xl px-4">
                             <Printer size={14} className="mr-1.5" /> พิมพ์ใบนัด (ชุด)
                           </Button>
                           <Button onClick={() => setSelectedItems([])} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                             <X size={18} />
                           </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 animate-in fade-in duration-300">
                           <Button variant="outline" size="sm" className="h-10 border-slate-200 text-[10px] font-black uppercase tracking-widest px-4 bg-white rounded-xl">
                             <Download size={16} className="mr-2" /> รายงานประจำเดือน
                           </Button>
                        </div>
                      )}
                   </div>
                 </div>

                 <div className="overflow-x-auto">
                   <Table>
                     <TableHeader className="bg-slate-50/50">
                       <TableRow>
                         <TableHead className="w-14 px-6 text-center">
                           <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                            checked={selectedItems.length === MOCK_SESSIONS.length && MOCK_SESSIONS.length > 0}
                            onChange={toggleSelectAll}
                           />
                         </TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">ผู้ป่วย / หน่วยงานต้นทาง</TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">แพทย์ผู้เชี่ยวชาญ</TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">ช่องทางและสถานะลิงก์</TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">สถานะระบบ</TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider text-right">การประสานงาน</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {MOCK_SESSIONS.map((session) => (
                         <TableRow 
                          key={session.id} 
                          className={cn(
                            "hover:bg-slate-50 transition-all group border-b border-slate-100 cursor-pointer",
                            session.status === 'Tech Issue' && "bg-rose-50/20",
                            selectedItems.includes(session.id) && "bg-teal-50/30"
                          )}
                          onClick={() => setSelectedSession(session)}
                         >
                           <TableCell className="px-6 text-center" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                               checked={selectedItems.includes(session.id)}
                               onChange={() => toggleSelectItem(session.id)}
                             />
                           </TableCell>
                           <TableCell className="py-4">
                             <div className="font-black text-slate-900 text-sm tracking-tight group-hover:text-teal-700 transition-colors">{session.patientName}</div>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">HN: {session.hn}</span>
                                <span className="text-slate-200">|</span>
                                <span className="text-[10px] text-teal-600 font-black uppercase tracking-tighter">{session.sourceUnit}</span>
                             </div>
                           </TableCell>
                           <TableCell className="py-4">
                             <div className="font-bold text-slate-700 text-[13px] tracking-tight">{session.specialist}</div>
                             <div className="text-[10px] text-slate-400 font-bold uppercase">{session.specialistHospital}</div>
                           </TableCell>
                           <TableCell className="py-4 text-center">
                             <div className="flex flex-col items-center gap-1.5">
                                <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600 text-[9px] h-5 font-black uppercase px-2 tracking-widest rounded-md">
                                   {session.platform}
                                </Badge>
                                <div className="flex items-center gap-1">
                                   <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", session.linkStatus === 'Live' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500')}></div>
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{session.linkStatus === 'Live' ? 'พร้อมเชื่อมต่อ' : 'ลิงก์หมดอายุ'}</span>
                                </div>
                             </div>
                           </TableCell>
                           <TableCell className="py-4 text-center">
                              <div className="flex flex-col items-center gap-1.5">
                                 <Badge className={cn("text-[9px] h-5 font-black uppercase px-2 border-none tracking-widest rounded-full", getStatusColor(session.status))}>
                                   {translateStatus(session.status)}
                                 </Badge>
                                 {session.waitingTime > 30 && (
                                   <span className="text-[9px] font-black text-rose-500 uppercase flex items-center gap-1 tracking-widest">
                                     <AlertCircle size={10} /> รอ: {session.waitingTime} นาที
                                   </span>
                                 )}
                              </div>
                           </TableCell>
                           <TableCell className="py-4 text-right">
                              <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" onClick={(e) => e.stopPropagation()}>
                                   <MessageSquare size={18} />
                                 </Button>
                                 <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all" onClick={(e) => e.stopPropagation()}>
                                   <RefreshCw size={18} />
                                 </Button>
                                 <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 rounded-lg transition-all" onClick={(e) => { e.stopPropagation(); setSelectedSession(session); }}>
                                   <ChevronRight size={18} />
                                 </Button>
                              </div>
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 </div>
               </Card>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
               <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-xl h-full flex flex-col transition-all hover:shadow-md hover:border-teal-200">
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                        <Stethoscope className="text-teal-600" size={16} /> แหล่งทรัพยากรผู้เชี่ยวชาญ
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ความพร้อมปฏิบัติงานทั่วเครือข่าย</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 h-5 text-[9px] font-black uppercase tracking-widest rounded-full">Active</Badge>
                  </div>

                  <ScrollArea className="flex-1 h-[450px] pr-3">
                     <div className="space-y-8">
                        {SPECIALIST_AVAILABILITY.map((h, idx) => (
                           <div key={idx} className="space-y-4">
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase border-b border-slate-50 pb-2">
                                 <Building2 size={12} /> {h.hospital}
                              </div>
                              <div className="space-y-3">
                                 {h.doctors.map((d, dIdx) => (
                                    <div key={dIdx} className="flex items-center justify-between group">
                                       <div className="flex items-center gap-3">
                                          <div className="relative">
                                             <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                                {d.name.split(' ')[1]?.[0] || 'D'}
                                             </div>
                                             <div className={cn(
                                                "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm",
                                                d.status === 'Available' ? "bg-emerald-500" : d.status === 'In Session' ? "bg-amber-500" : "bg-slate-300"
                                             )}></div>
                                          </div>
                                          <div>
                                             <p className="text-[11px] font-black text-slate-700 leading-none mb-1 group-hover:text-teal-600 transition-colors">{d.name}</p>
                                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{d.department}</p>
                                          </div>
                                       </div>
                                       <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-teal-600 opacity-0 group-hover:opacity-100 transition-all">
                                          <ExternalLink size={12} />
                                       </Button>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  </ScrollArea>

                  <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Monitor size={48} />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-teal-400">Technical Support</p>
                     <p className="text-[11px] font-medium leading-relaxed mb-4">
                        พบปัญหาการเชื่อมต่อ? ติดต่อศูนย์ควบคุม IT เครือข่ายภาคเหนือ โทร. 053-XXX-XXXX
                     </p>
                     <Button className="w-full h-9 bg-teal-600 hover:bg-teal-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-teal-600/20">
                        <Cpu size={14} className="mr-2" /> ตรวจสอบความเสถียร
                     </Button>
                  </div>
               </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
