import React, { useState, useEffect } from 'react';
import { ReferralDetailPage } from "./ReferralDetailPage";
import { 
  ArrowLeft, 
  ArrowRight,
  Search, 
  Plus, 
  Filter, 
  Clock, 
  MapPin, 
  Building2,
  Ambulance,
  CheckCircle2,
  XCircle,
  ChevronRight,
  History,
  Send,
  MessageSquare,
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  LayoutDashboard,
  Trello,
  Users,
  TrendingUp,
  Map as MapIcon,
  Stethoscope,
  MoreVertical,
  Calendar as CalendarIcon,
  ShieldCheck,
  Hospital,
  Printer,
  Mail,
  X
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../../../../components/ui/table";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Separator } from "../../../../../components/ui/separator";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useSystem } from "../../../../../context/SystemContext";

// --- Types ---
type ReferralStatus = 'ส่งคำขอแล้ว' | 'รอการตอบรับ' | 'นัดหมายแล้ว' | 'ได้รับการรักษาแล้ว' | 'ส่งตัวกลับพื้นที่';
type Urgency = 'ปกติ' | 'เร่งด่วน' | 'ฉุกเฉิน';

interface ReferralCase {
  id: string;
  patientName: string;
  hn: string;
  sourceHospital: string;
  destHospital: string;
  status: ReferralStatus;
  urgency: Urgency;
  requestDate: string;
  responseTime?: string; 
  isBottleneck: boolean;
  history: { date: string; action: string; user: string }[];
}

// --- Mock Data ---
const MOCK_REFERRALS: ReferralCase[] = [
  {
    id: 'REF-001',
    patientName: 'ด.ช. อานนท์ รักดี',
    hn: 'HN6600123',
    sourceHospital: 'รพ.สต. บ้านป่าซาง',
    destHospital: 'รพ.มหาราชนครเชียงใหม่',
    status: 'ส่งคำขอแล้ว',
    urgency: 'ฉุกเฉิน',
    requestDate: '2026-01-21 08:30',
    isBottleneck: false,
    history: [{ date: '2026-01-21 08:30', action: 'ส่งคำขอส่งตัว', user: 'Case Manager (ป่าซาง)' }]
  },
  {
    id: 'REF-002',
    patientName: 'น.ส. มานี ใจผ่อง',
    hn: 'HN6600456',
    sourceHospital: 'รพ.นครพิงค์',
    destHospital: 'รพ.เชียงรายประชานุเคราะห์',
    status: 'รอการตอบรับ',
    urgency: 'เร่งด่วน',
    requestDate: '2026-01-20 10:00',
    responseTime: '24h+',
    isBottleneck: true,
    history: [
      { date: '2026-01-20 10:00', action: 'ส่งคำขอส่งตัว', user: 'Case Manager (นครพิงค์)' },
      { date: '2026-01-21 09:00', action: 'SCFC แจ้งเตือนปลายทางล่าช้า', user: 'SCFC Admin' }
    ]
  },
  {
    id: 'REF-003',
    patientName: 'นาย ปิติ ยินดี',
    hn: 'HN6600789',
    sourceHospital: 'รพ.ฝาง',
    destHospital: 'รพ.มหาราชนครเชียงใหม่',
    status: 'นัดหมายแล้ว',
    urgency: 'ปกติ',
    requestDate: '2026-01-18 14:00',
    isBottleneck: false,
    history: [
      { date: '2026-01-18 14:00', action: 'ส่งคำขอส่งตัว', user: 'Case Manager (ฝาง)' },
      { date: '2026-01-19 09:00', action: 'ตอบรับการส่งตัว', user: 'Admin (มหาราช)' },
      { date: '2026-01-19 11:00', action: 'ยืนยันวันนัดหมาย (25 ม.ค.)', user: 'Admin (มหาราช)' }
    ]
  },
  {
    id: 'REF-004',
    patientName: 'ด.ญ. ชูใจ ใฝ่ดี',
    hn: 'HN6600999',
    sourceHospital: 'รพ.มหาราชนครเชียงใหม่',
    destHospital: 'รพ.สต. ดอยหล่อ',
    status: 'ส่งตัวกลับพื้นที่',
    urgency: 'ปกติ',
    requestDate: '2026-01-21 11:30',
    isBottleneck: false,
    history: [
      { date: '2026-01-21 11:30', action: 'เริ่มกระบวนการส่งกลับพื้นที่', user: 'Case Manager (มหาราช)' }
    ]
  }
];

const HOSPITAL_CAPACITY = [
  { name: 'มหาราชฯ', load: 92, status: 'วิกฤต' },
  { name: 'เชียงรายฯ', load: 78, status: 'ปานกลาง' },
  { name: 'นครพิงค์', load: 45, status: 'ปกติ' },
  { name: 'ลำปาง', load: 30, status: 'ปกติ' },
];

const RESPONSE_TREND = [
  { time: '08:00', avg: 15 },
  { time: '10:00', avg: 45 },
  { time: '12:00', avg: 30 },
  { time: '14:00', avg: 120 },
  { time: '16:00', avg: 60 },
];

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];

// --- Helper Functions ---
const getUrgencyColor = (urgency: Urgency) => {
  switch (urgency) {
    case 'ฉุกเฉิน': return 'bg-rose-50 text-rose-600 border-rose-100';
    case 'เร่งด่วน': return 'bg-amber-50 text-amber-600 border-amber-100';
    default: return 'bg-teal-50 text-teal-600 border-teal-100';
  }
};

const getStatusStep = (status: ReferralStatus) => {
  const steps = ['ส่งคำขอแล้ว', 'รอการตอบรับ', 'นัดหมายแล้ว', 'ได้รับการรักษาแล้ว', 'ส่งตัวกลับพื้นที่'];
  return steps.indexOf(status);
};

export default function ReferralSystem({ onBack, initialHN }: { onBack?: () => void, initialHN?: string }) {
  const { stats } = useSystem();
  const [selectedCase, setSelectedCase] = useState<ReferralCase | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialHN || "");
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Update searchQuery if initialHN changes
  useEffect(() => {
    if (initialHN) {
        setSearchQuery(initialHN);
    }
  }, [initialHN]);

  // Filter referrals based on search
  const filteredReferrals = MOCK_REFERRALS.filter(ref => {
    const matchesSearch = 
        ref.patientName.includes(searchQuery) || 
        ref.hn.includes(searchQuery) || 
        ref.id.includes(searchQuery);
    
    // Simple filter simulation
    return matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredReferrals.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredReferrals.map(r => r.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchPrint = () => {
    toast.success(`กำลังเตรียมพิมพ์ใบส่งตัว (${selectedItems.length} รายการ)`, {
      description: "ระบบกำลังสร้างไฟล์สำหรับพิมพ์ชุดใบส่งตัวผู้ป่วย"
    });
  };

  const handleBatchNotify = () => {
    toast.info(`แจ้งเตือนไปยังสถานพยาบาลปลายทาง ${selectedItems.length} แห่ง`, {
      description: "ระบบส่งการแจ้งเตือนเร่งด่วนเพื่อการตอบรับ"
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700 font-sans">
      {selectedCase ? (
        <ReferralDetailPage 
          referral={selectedCase}
          onBack={() => setSelectedCase(null)}
        />
      ) : (
        <>
          {/* 1. Network Monitoring Dashboard */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <div className="flex items-center gap-2 mb-1">
                 <div className="bg-teal-600 text-white p-1 rounded">
                   <ShieldCheck size={16} />
                 </div>
                 <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">SCFC Traffic Mode</span>
               </div>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight">ศูนย์บริหารจัดการ <span className="text-teal-600">การส่งต่อผู้ป่วย</span></h1>
               <p className="text-slate-500 text-sm font-medium">ควบคุมและติดตามสถานะการส่งตัวผู้ป่วยทั่วเครือข่าย 8 จังหวัดภาคเหนือ</p>
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
                   <Button variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600 font-bold text-xs px-4 bg-white shadow-sm rounded-xl" onClick={onBack}>
                     <ArrowLeft size={16} className="mr-2" /> ย้อนกลับ
                   </Button>
               )}
               
               <Button className="h-10 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 shadow-lg shadow-teal-600/20 rounded-xl">
                 <LayoutDashboard size={16} className="mr-2" /> รายงานเชิงลึก
               </Button>
            </div>
          </div>

          {/* Referral Analytics Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-teal-600 rounded-xl transition-all hover:shadow-md">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-teal-50 p-2.5 rounded-lg border border-teal-100">
                   <Activity className="text-teal-600" size={20} />
                 </div>
                 <div className="text-[10px] font-black text-emerald-600 flex items-center gap-1 uppercase">
                    <TrendingUp size={12} /> +14%
                 </div>
               </div>
               <div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">เคสส่งต่อที่กำลังดำเนินการ</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats?.referrals?.active || 142} เคส</h3>
                 <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Total Active Referrals</p>
               </div>
            </Card>
            
            <Card className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-amber-500 rounded-xl transition-all hover:shadow-md">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                   <Clock className="text-amber-500" size={20} />
                 </div>
                 <div className="text-[10px] font-black text-rose-500 flex items-center gap-1 uppercase">
                    <AlertCircle size={12} /> แจ้งเตือนคอขวด
                 </div>
               </div>
               <div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">ระยะเวลาตอบรับเฉลี่ย</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats?.referrals?.avgResponse || '4 ชม.'}</h3>
                 <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Avg. Pending Response</p>
               </div>
            </Card>

            <Card className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-emerald-500 rounded-xl transition-all hover:shadow-md">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                   <RotateCcw className="text-emerald-500" size={20} />
                 </div>
                 <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-black uppercase tracking-widest px-2 rounded-full">Success</Badge>
               </div>
               <div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">ส่งตัวกลับพื้นที่สำเร็จ</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats?.referrals?.referBack || 45} เคส</h3>
                 <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Successful Refer-Back</p>
               </div>
            </Card>

            <Card className="p-5 border-slate-200 shadow-sm bg-white border-l-4 border-l-rose-600 rounded-xl transition-all hover:shadow-md">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                   <Ambulance className="text-rose-600" size={20} />
                 </div>
                 <div className={cn("w-2.5 h-2.5 rounded-full bg-rose-500", (stats?.referrals?.emergency || 0) > 0 && "animate-ping")}></div>
               </div>
               <div>
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">เคสฉุกเฉิน/วิกฤต</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stats?.referrals?.emergency || 3} เคส</h3>
                 <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Emergency Cases</p>
               </div>
            </Card>
          </div>

          {/* Optimized Search & Filter Container */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4 transition-all hover:shadow-md">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือรหัสส่งตัว..." 
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
                   <SelectItem value="ทุกแผนก">ทุกแผนก</SelectItem>
                   <SelectItem value="ศัลยกรรมตกแต่ง">ศัลยกรรมตกแต่ง</SelectItem>
                   <SelectItem value="ทันตกรรม">ทันตกรรม</SelectItem>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Referral Flow Map & Capacity Indicators */}
            <div className="lg:col-span-1 space-y-6">
               <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-teal-200">
                 <div className="flex items-center justify-between mb-6">
                   <div>
                     <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                       <MapIcon className="text-teal-600" size={16} /> แผนผังการส่งต่อผู้ป่วย (Flow Map)
                     </h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">เครือข่าย 8 จังหวัดภาคเหนือ</p>
                   </div>
                   <Badge className="bg-teal-50 text-teal-600 border-none px-2 h-5 text-[9px] font-black uppercase tracking-widest rounded-full">Live</Badge>
                 </div>
                 
                 <div className="relative aspect-[4/5] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center group shadow-inner">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800')] bg-cover opacity-[0.03] grayscale group-hover:scale-105 transition-transform duration-1000"></div>
                    
                    <div className="relative w-full h-full p-8 flex flex-col justify-between z-10">
                       <div className="flex justify-between items-start">
                          <div className="w-5 h-5 rounded-full bg-teal-600 shadow-[0_0_15px_rgba(13,148,136,0.5)] animate-pulse relative ring-4 ring-teal-600/10">
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-800 whitespace-nowrap uppercase tracking-widest">เชียงใหม่</span>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-slate-400 shadow-sm relative border-2 border-white">
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 whitespace-nowrap uppercase tracking-widest">เชียงราย</span>
                          </div>
                       </div>
                       <div className="flex justify-center">
                          <div className="w-4 h-4 rounded-full bg-slate-400 shadow-sm relative border-2 border-white">
                            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 whitespace-nowrap uppercase tracking-widest">ลำปาง</span>
                          </div>
                       </div>
                       
                       <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                          <path d="M220,100 Q150,150 100,200" fill="none" stroke="#0d9488" strokeWidth="2" strokeDasharray="5,5" />
                          <path d="M100,200 Q150,250 200,300" fill="none" stroke="#0d9488" strokeWidth="1" strokeDasharray="5,5" />
                       </svg>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm border border-slate-100 p-4 rounded-xl shadow-2xl z-20">
                       <p className="text-[10px] font-black text-slate-800 mb-3 uppercase tracking-[0.1em] border-b border-slate-100 pb-2 flex items-center gap-2">
                          <Activity size={12} className="text-teal-600" /> ภาระงานเครือข่าย (Network Load)
                       </p>
                       <div className="space-y-3">
                         {HOSPITAL_CAPACITY.map((h, i) => (
                           <div key={i} className="space-y-1">
                             <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                <span>{h.name}</span>
                                <span className={cn("font-black", h.status === 'วิกฤต' ? 'text-rose-600' : 'text-teal-600')}>{h.load}%</span>
                             </div>
                             <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className={cn("h-full rounded-full transition-all duration-500", h.status === 'วิกฤต' ? 'bg-rose-500' : h.status === 'ปานกลาง' ? 'bg-amber-500' : 'bg-teal-500')} style={{ width: `${h.load}%` }}></div>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>
               </Card>

               <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-xl transition-all hover:shadow-md hover:border-teal-200">
                  <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <TrendingUp className="text-amber-500" size={16} /> แนวโน้มระยะเวลาตอบรับ (Response Trend)
                  </h3>
                  <div className="h-[120px] w-full min-h-[120px] min-w-0" style={{ width: '100%', height: '120px', minWidth: 0 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                      <LineChart data={RESPONSE_TREND}>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }} />
                        <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100 flex items-center gap-2">
                     <AlertCircle size={14} className="text-amber-600" />
                     <p className="text-[10px] text-amber-700 font-bold italic tracking-tight">ช่วงเวลา 14:00 - 16:00 มักเกิดความล่าช้าในการตอบรับ</p>
                  </div>
               </Card>
            </div>

            {/* 2. Centralized Referral Pipeline */}
            <div className="lg:col-span-2 space-y-6">
               <Card className="border-slate-200 shadow-sm overflow-hidden bg-white rounded-xl transition-all hover:shadow-md">
                 <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 min-h-[80px]">
                   <div className="flex items-center gap-4">
                     <h2 className="font-bold text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                        <Trello size={18} className="text-teal-600" /> 
                        ท่อส่งต่อผู้ป่วยส่วนกลาง (Pipeline)
                     </h2>
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
                             <Printer size={14} className="mr-1.5" /> พิมพ์ใบส่งตัว (ชุด)
                           </Button>
                           <Button onClick={() => setSelectedItems([])} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                             <X size={18} />
                           </Button>
                        </div>
                      ) : (
                        <div className="flex bg-slate-200/50 p-1 rounded-lg ml-2 animate-in fade-in duration-300">
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-black bg-white shadow-sm text-teal-600 uppercase tracking-widest rounded-md">ขั้นตอน</Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-800 rounded-md">คัมบัง</Button>
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
                            checked={selectedItems.length === filteredReferrals.length && filteredReferrals.length > 0}
                            onChange={toggleSelectAll}
                           />
                         </TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ข้อมูลผู้ป่วย / ความเร่งด่วน</TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest">เส้นทางการส่งตัว</TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">สถานะความคืบหน้า</TableHead>
                         <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">การประสานงาน</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {filteredReferrals.map((ref) => (
                         <TableRow 
                          key={ref.id} 
                          className={cn(
                            "hover:bg-slate-50 transition-all group border-b border-slate-100 cursor-pointer",
                            ref.isBottleneck && "bg-rose-50/10",
                            selectedItems.includes(ref.id) && "bg-teal-50/30"
                          )}
                          onClick={() => toggleSelectItem(ref.id)}
                         >
                           <TableCell className="px-6 text-center" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                               checked={selectedItems.includes(ref.id)}
                               onChange={() => toggleSelectItem(ref.id)}
                             />
                           </TableCell>
                           <TableCell className="py-5 px-6" onClick={(e) => { e.stopPropagation(); setSelectedCase(ref); }}>
                             <div className="font-black text-slate-900 text-sm tracking-tight group-hover:text-teal-700 transition-colors">{ref.patientName}</div>
                             <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">HN: {ref.hn}</span>
                                <Badge className={cn("text-[9px] h-5 font-black uppercase px-2 border-none tracking-widest rounded-full", getUrgencyColor(ref.urgency))}>
                                   {ref.urgency}
                                </Badge>
                             </div>
                           </TableCell>
                           <TableCell className="py-5" onClick={(e) => { e.stopPropagation(); setSelectedCase(ref); }}>
                             <div className="flex items-center gap-3 text-[11px] font-black text-slate-600 tracking-tight">
                                <div className="flex flex-col items-end">
                                  <span className="text-[8px] text-slate-400 uppercase tracking-widest mb-0.5">จาก</span>
                                  <span className="truncate max-w-[100px]">{ref.sourceHospital}</span>
                                </div>
                                <ArrowRight size={14} className="text-teal-500" />
                                <div className="flex flex-col items-start">
                                  <span className="text-[8px] text-slate-400 uppercase tracking-widest mb-0.5">ไปยัง</span>
                                  <span className="truncate max-w-[100px] text-teal-600">{ref.destHospital}</span>
                                </div>
                             </div>
                           </TableCell>
                           <TableCell className="py-5 text-center" onClick={(e) => { e.stopPropagation(); setSelectedCase(ref); }}>
                              <div className="flex flex-col items-center gap-1.5">
                                 <Badge variant="outline" className="text-[9px] h-5 font-black uppercase px-2 border-slate-200 text-slate-500 tracking-widest rounded-md">
                                    {ref.status}
                                 </Badge>
                                 <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${(getStatusStep(ref.status) + 1) * 20}%` }}></div>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="py-5 text-right">
                              <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" onClick={(e) => e.stopPropagation()}>
                                   <MessageSquare size={18} />
                                 </Button>
                                 <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" onClick={(e) => { e.stopPropagation(); setSelectedCase(ref); }}>
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

               <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden relative group transition-all hover:shadow-md hover:border-teal-200">
                  <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Ambulance size={160} />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                        <AlertCircle className="text-rose-600" size={20} />
                     </div>
                     <div>
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">การแจ้งเตือนจากระบบตรวจจับความล่าช้า</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">AI Monitoring System</p>
                     </div>
                  </div>
                  <div className="space-y-4 relative z-10">
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 animate-pulse"></div>
                        <div className="flex-1">
                           <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">REF-002: ล่าช้าในการตอบรับเกิน 24 ชม.</p>
                           <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">ปลายทาง: รพ.เชียงรายประชานุเคราะห์ (สถานะภาระงาน: ปานกลาง)</p>
                           <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" className="h-7 text-[9px] font-black uppercase border-rose-200 text-rose-600 px-3 hover:bg-rose-600 hover:text-white transition-all rounded-lg">โทรประสานงานด่วน</Button>
                              <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase text-slate-400 px-3 rounded-lg">ละเว้น</Button>
                           </div>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
