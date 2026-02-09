import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Clock, 
  MapPin, 
  MoreHorizontal, 
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Video,
  Hospital,
  Filter,
  Users,
  TrendingDown,
  TrendingUp,
  Download,
  Mail,
  ChevronRight,
  UserX,
  LayoutGrid,
  List,
  AlertCircle,
  Printer,
  ArrowLeft
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useSystem } from "../../../../../context/SystemContext";
import { AppointmentDetail, Appointment } from "./AppointmentDetail";

// --- Types & Mock Data ---

const MOCK_DATA: Appointment[] = [
  {
    id: "APT-001",
    patientName: "ด.ช. อนันต์ สุขใจ",
    hn: "HN001",
    hospital: "รพ.มหาราชนครเชียงใหม่",
    province: "เชียงใหม่",
    clinic: "ศัลยกรรมตกแต่ง",
    date: "2026-01-21",
    time: "09:00",
    type: 'มาตรวจที่ รพ.',
    status: 'Confirmed',
    isOverdue: false,
    hasConflict: false,
    needsIntervention: false,
    riskLevel: 'ต่ำ'
  },
  {
    id: "APT-002",
    patientName: "นางสาว มะลิ แซ่ลี้",
    hn: "HN002",
    hospital: "รพ.เชียงรายประชานุเคราะห์",
    province: "เชียงราย",
    clinic: "ทันตกรรม",
    date: "2026-01-21",
    time: "10:30",
    type: 'ปรึกษาทางไกล (Tele)',
    status: 'Pending',
    isOverdue: true,
    hasConflict: false,
    needsIntervention: true,
    riskLevel: 'สูง'
  },
  {
    id: "APT-003",
    patientName: "ด.ช. ปิติ มีทรัพย์",
    hn: "HN003",
    hospital: "รพ.ลำพูน",
    province: "ลำพูน",
    clinic: "หูคอจมูก",
    date: "2026-01-21",
    time: "13:00",
    type: 'มาตรวจที่ รพ.',
    status: 'Missed',
    isOverdue: false,
    hasConflict: true,
    needsIntervention: true,
    riskLevel: 'กลาง'
  },
  {
    id: "APT-004",
    patientName: "ด.ญ. ชูใจ ใฝ่ดี",
    hn: "HN004",
    hospital: "รพ.ฝาง",
    province: "เชียงใหม่",
    clinic: "อรรถบำบัด",
    date: "2026-01-22",
    time: "14:00",
    type: 'ปรึกษาทางไกล (Tele)',
    status: 'Confirmed',
    isOverdue: false,
    hasConflict: false,
    needsIntervention: false,
    riskLevel: 'ต่ำ'
  },
];

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const CLINICS = ["ทุกแผนก", "ศัลยกรรมตกแต่ง", "ทันตกรรม", "หูคอจมูก", "กุมารเวช", "อรรถบำบัด"];

const heatmapData = [
  { hospital: 'รพ.มหาราชฯ', load: 85 },
  { hospital: 'รพ.เชียงรายฯ', load: 65 },
  { hospital: 'รพ.นครพิงค์', load: 45 },
  { hospital: 'รพ.ลำปาง', load: 30 },
  { hospital: 'รพ.ลำพูน', load: 20 },
  { hospital: 'รพ.ฝาง', load: 55 },
];

// --- Sub-components ---

function StatCard({ title, value, subtitle, icon, trend, trendUp, variant }: any) {
  const variants: any = {
    teal: "bg-teal-50 border-teal-100 text-teal-600",
    rose: "bg-rose-50 border-rose-100 text-rose-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
    slate: "bg-slate-50 border-slate-100 text-slate-600",
  };

  return (
    <Card className="p-5 border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all flex flex-col justify-between h-full group bg-white rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-lg border transition-colors", variants[variant] || variants.slate)}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
            trendUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
          )}>
            {trendUp ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mb-1">{title}</h3>
        <div className="text-2xl font-black text-slate-800 tracking-tight">{value}</div>
        <div className="flex items-center gap-1 mt-2">
            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
            <p className="text-[10px] text-slate-400 font-bold">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}

export function AppointmentSystem({ onBack }: { onBack?: () => void }) {
  const { stats } = useSystem();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleBatchExport = () => {
    toast.success(`กำลังส่งออกข้อมูล ${selectedAppointments.length} รายการ`, {
      description: "ไฟล์ PDF กำลังถูกสร้างและเตรียมดาวน์โหลด"
    });
  };

  const handleBatchNotify = () => {
    toast.info(`กำลังส่งการแจ้งเตือนไปยังผู้ป่วย ${selectedAppointments.length} ท่าน`, {
      description: "ระบบกำลังส่ง SMS และ Push Notification"
    });
  };

  const toggleSelectAll = () => {
    if (selectedAppointments.length === MOCK_DATA.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(MOCK_DATA.map(a => a.id));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    setSelectedAppointments(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleRowClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
  };

  if (selectedAppointment) {
    return (
      <AppointmentDetail 
        appointment={selectedAppointment} 
        onBack={() => setSelectedAppointment(null)} 
      />
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700 font-sans">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="bg-teal-600 text-white p-1 rounded">
               <ShieldAlert size={16} />
             </div>
             <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">SCFC Appointment Hub</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">ระบบติดตาม <span className="text-teal-600">การนัดหมาย</span></h1>
          <p className="text-slate-500 text-sm font-medium">ภาพรวมการนัดหมายและการประสานงานในเขตเครือข่ายภาคเหนือ</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 text-xs font-bold mr-4">
              <span className="text-slate-400 uppercase">สถานะระบบ:</span>
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                ตรวจพบความเสี่ยง 2 รายการ
              </span>
           </div>
           
           <Button variant="outline" size="sm" className="h-10 bg-white border-slate-200 text-slate-600 font-bold text-xs px-4 shadow-sm rounded-xl">
             <Download size={16} className="mr-2" /> ออกรายงาน (PDF)
           </Button>
           
           {onBack && (
             <Button variant="outline" size="sm" onClick={onBack} className="h-10 border-slate-200 text-slate-600 font-bold text-xs px-4 bg-white shadow-sm rounded-xl">
               <ArrowLeft size={16} className="mr-2" /> ย้อนกลับ
             </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="นัดหมายทั้งหมด" 
          value={stats.appointments.total.toLocaleString()} 
          subtitle="เครือข่ายภาคเหนือ (รายเดือน)" 
          icon={<CalendarIcon size={20} />}
          trend="+5.2%"
          trendUp={true}
          variant="teal"
        />
        <StatCard 
          title="รอยืนยันนัดหมาย" 
          value={`${stats.appointments.pending}%`} 
          subtitle="รอยืนยันเกิน 48 ชม." 
          icon={<Clock size={20} />}
          trend="แจ้งเตือนด่วน"
          trendUp={false}
          variant="amber"
        />
        <StatCard 
          title="อัตราการขาดนัด (No-Show)" 
          value={`${stats.appointments.noShow}%`} 
          subtitle="ค่าเฉลี่ยทั้งเครือข่าย" 
          icon={<UserX size={20} />}
          trend="-1.5%"
          trendUp={true} 
          variant="rose"
        />
        <StatCard 
          title="การตรวจทางไกล (Tele)" 
          value={`${stats.appointments.teleRatio}%`} 
          subtitle="สัดส่วนออนไลน์ : ปกติ" 
          icon={<Video size={20} />}
          trend="กำลังเติบโต"
          trendUp={true}
          variant="blue"
        />
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4 transition-all hover:shadow-md">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือเลขที่นัดหมาย..." 
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
        
        <div className="xl:col-span-3 space-y-6">
           <Card className="border-slate-200 shadow-sm overflow-hidden bg-white rounded-xl">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-4">
                 <h2 className="font-bold text-slate-800 text-sm uppercase tracking-widest">ตารางนัดหมายลำดับความสำคัญสูง</h2>
                 <div className="flex bg-slate-200/50 p-1 rounded-lg">
                    <button 
                     onClick={() => setViewMode('list')}
                     className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-white shadow-sm text-teal-600" : "text-slate-500 hover:text-slate-800")}
                    >
                      <List size={16} />
                    </button>
                    <button 
                     onClick={() => setViewMode('calendar')}
                     className={cn("p-1.5 rounded-md transition-all", viewMode === 'calendar' ? "bg-white shadow-sm text-teal-600" : "text-slate-500 hover:text-slate-800")}
                    >
                      <LayoutGrid size={16} />
                    </button>
                 </div>
               </div>
               
               <div className="flex items-center gap-2">
                  {selectedAppointments.length > 0 && (
                    <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                       <span className="text-[10px] font-black text-slate-400 mr-2 uppercase tracking-widest">{selectedAppointments.length} เลือกแล้ว</span>
                       <Button onClick={handleBatchNotify} variant="outline" size="sm" className="h-9 border-blue-200 text-blue-600 bg-blue-50/50 text-[10px] font-black tracking-widest hover:bg-blue-600 hover:text-white transition-all rounded-xl">
                         <Mail size={14} className="mr-1.5" /> ส่งการแจ้งเตือน
                       </Button>
                       <Button onClick={handleBatchExport} variant="outline" size="sm" className="h-9 border-slate-200 text-slate-600 bg-white text-[10px] font-black tracking-widest hover:bg-slate-900 hover:text-white transition-all rounded-xl">
                         <Printer size={14} className="mr-1.5" /> พิมพ์ใบนัด (ชุด)
                       </Button>
                    </div>
                  )}
               </div>
             </div>

             <div className="overflow-x-auto">
               <Table>
                 <TableHeader className="bg-slate-50/50">
                   <TableRow>
                     <TableHead className="w-10 px-6">
                       <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                        checked={selectedAppointments.length === MOCK_DATA.length}
                        onChange={toggleSelectAll}
                       />
                     </TableHead>
                     <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">วัน/เวลา</TableHead>
                     <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">ผู้ป่วย / โรงพยาบาล</TableHead>
                     <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">ประเภทนัดหมาย</TableHead>
                     <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">สถานะ</TableHead>
                     <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">ความเสี่ยง / การดำเนินการ</TableHead>
                     <TableHead className="w-10"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {MOCK_DATA.map((apt) => (
                     <TableRow 
                       key={apt.id} 
                       className={cn(
                         "hover:bg-slate-50 transition-all group border-b border-slate-100 last:border-0 cursor-pointer",
                         apt.needsIntervention && "bg-rose-50/10"
                       )}
                       onClick={() => handleRowClick(apt)}
                     >
                       <TableCell className="px-6" onClick={(e) => e.stopPropagation()}>
                         <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                          checked={selectedAppointments.includes(apt.id)}
                          onChange={(e) => toggleSelect(apt.id, e)}
                          onClick={(e) => e.stopPropagation()}
                         />
                       </TableCell>
                       <TableCell className="py-4">
                         <div className="font-black text-slate-900 text-sm tracking-tight">{apt.time} น.</div>
                         <div className="text-[10px] text-slate-500 font-bold">{format(new Date(apt.date), "dd/MM/yyyy")}</div>
                       </TableCell>
                       <TableCell className="py-4">
                         <div className="font-black text-slate-800 text-sm group-hover:text-teal-600 transition-colors tracking-tight">{apt.patientName}</div>
                         <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold mt-0.5">
                           <Hospital size={12} className="text-teal-500" /> {apt.hospital} ({apt.clinic})
                         </div>
                       </TableCell>
                       <TableCell className="py-4 text-center">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                           apt.type === 'ปรึกษาทางไกล (Tele)' ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-slate-50 text-slate-600 border border-slate-100"
                         )}>
                           {apt.type === 'ปรึกษาทางไกล (Tele)' ? <Video size={12} /> : <Users size={12} />}
                           {apt.type}
                         </div>
                       </TableCell>
                       <TableCell className="py-4 text-center">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                           apt.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                           apt.status === 'Pending' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                           "bg-rose-50 text-rose-600 border border-rose-100"
                         )}>
                           <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                              apt.status === 'Confirmed' ? "bg-emerald-500" :
                              apt.status === 'Pending' ? "bg-amber-500" :
                              "bg-rose-500"
                           )}></div>
                           {apt.status === 'Confirmed' ? 'ยืนยันแล้ว' :
                            apt.status === 'Pending' ? 'รอยืนยัน' : 'ขาดนัด'}
                         </div>
                       </TableCell>
                       <TableCell className="py-4">
                         <div className="flex flex-wrap gap-1.5">
                           {apt.isOverdue && (
                             <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 text-[9px] h-5 font-black uppercase px-2 tracking-wider">
                               ยืนยันล่าช้า
                             </Badge>
                           )}
                           {apt.hasConflict && (
                             <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[9px] h-5 font-black uppercase px-2 tracking-wider">
                               ตารางทับซ้อน
                             </Badge>
                           )}
                           {apt.needsIntervention && (
                             <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200 text-[9px] h-5 font-black uppercase px-2 tracking-wider">
                               SCFC ต้องประสานงาน
                             </Badge>
                           )}
                         </div>
                       </TableCell>
                       <TableCell className="py-4">
                         <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                           <MoreHorizontal size={18} />
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-xl h-full flex flex-col transition-all hover:shadow-md hover:border-teal-200">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                  <TrendingUp className="text-teal-600" size={16} /> การกระจายภาระงาน (Network Load)
                </h3>
             </div>
             
             <div className="h-[350px] w-full min-h-[350px] min-w-0" style={{ minHeight: '350px', height: '350px', width: '100%', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                  <BarChart data={heatmapData} layout="vertical" margin={{ left: -10 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="hospital" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                      width={90}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="load" radius={[0, 4, 4, 0]} barSize={14}>
                      {heatmapData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.load > 80 ? '#ef4444' : entry.load > 50 ? '#f59e0b' : '#0d9488'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>

             <div className="mt-8 p-5 bg-teal-600 rounded-2xl shadow-xl shadow-teal-600/10 border border-teal-500/20 text-white relative overflow-hidden">
               <div className="absolute -bottom-4 -right-4 opacity-20 transform rotate-12 pointer-events-none">
                 <AlertCircle size={72} />
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-90">
                 <AlertCircle size={16} /> ระบบวิเคราะห์อัตโนมัติ
               </div>
               <p className="text-[11px] text-teal-50 leading-relaxed font-medium mb-4 relative z-10">
                 รพ.มหาราชฯ มีความหนาแน่นสูง (85%) พิจารณาส่งต่อเคสใหม่ไปยัง รพ.นครพิงค์ หรือใช้ระบบ Tele-consult เพื่อลดความแออัด
               </p>
               <Button className="w-full h-10 bg-white hover:bg-teal-50 text-teal-600 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95">
                 จัดการระบบส่งต่อ <ChevronRight size={14} className="ml-1" />
               </Button>
             </div>
           </Card>
        </div>

      </div>
    </div>
  );
}
