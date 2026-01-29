import React, { useState } from 'react';
import { 
  Home, 
  Map as MapIcon, 
  Search, 
  Clock, 
  MapPin, 
  MoreHorizontal, 
  ShieldCheck,
  CheckCircle2, 
  Users, 
  TrendingUp,
  Filter,
  ArrowRight,
  Navigation,
  AlertCircle,
  BarChart3,
  Calendar,
  LayoutGrid,
  List,
  ChevronRight,
  XCircle,
  ArrowLeft,
  Printer,
  Mail,
  X
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { toast } from "sonner";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { useSystem } from "../../../../../context/SystemContext";
import { Separator } from "../../../../../components/ui/separator";
import { HomeVisitDetail, Visit } from "./HomeVisitDetail";

// --- Mock Data & Constants ---

const PROVINCES = ["8 จังหวัดภาคเหนือ", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];

const MOCK_VISITS: Visit[] = [
  {
    id: "HV-001",
    patientName: "ด.ช. อนันต์ สุขใจ",
    hn: "HN202",
    province: "เชียงใหม่",
    hospital: "รพ.ฝาง",
    team: "ทีมสหวิชาชีพ A",
    date: "2026-01-21",
    status: 'Confirmed',
    type: 'หลังผ่าตัด',
    priority: 'สูง'
  },
  {
    id: "HV-002",
    patientName: "ด.ญ. กานดา รักดี",
    hn: "HN205",
    province: "เชียงราย",
    hospital: "รพ.เชียงรายฯ",
    team: "รพ.สต. บ้านดอย",
    date: "2026-01-21",
    status: 'Pending',
    type: 'ทั่วไป',
    priority: 'กลาง'
  },
  {
    id: "HV-003",
    patientName: "นาย สมจิต มั่นคง",
    hn: "HN210",
    province: "ลำพูน",
    hospital: "รพ.ลำพูน",
    team: "ทีมพยาบาลจิตเวช",
    date: "2026-01-21",
    status: 'Missed',
    type: 'ทั่วไป',
    priority: 'ต่ำ'
  }
];

// --- Sub-components ---

function SummaryCard({ title, value, icon, colorClass }: any) {
  return (
    <Card className="p-4 border-slate-200 shadow-sm flex items-center gap-4 group hover:border-teal-200 transition-all bg-white rounded-xl">
      <div className={cn("p-3 rounded-xl", colorClass)}>
        {icon}
      </div>
      <div>
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</h3>
        <div className="text-xl font-black text-slate-800 tracking-tight">{value}</div>
      </div>
    </Card>
  );
}

export function HomeVisitSystem({ onBack, onViewPatient }: { onBack?: () => void, onViewPatient?: (patient: any) => void }) {
  const { stats } = useSystem();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedProvince, setSelectedProvince] = useState("8 จังหวัดภาคเหนือ");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const VISIT_DATA = [
    { name: 'ดำเนินการเสร็จสิ้น', value: stats.homeVisits?.completed || 12, color: '#0d9488' },
    { name: 'รอดำเนินการ', value: stats.homeVisits?.pending || 8, color: '#f59e0b' },
    { name: 'เกินกำหนด', value: stats.homeVisits?.overdue || 4, color: '#ef4444' },
  ];

  const totalVisits = (stats.homeVisits?.completed || 12) + (stats.homeVisits?.pending || 8) + (stats.homeVisits?.overdue || 4);

  const toggleSelectAll = () => {
    if (selectedItems.length === MOCK_VISITS.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(MOCK_VISITS.map(v => v.id));
    }
  };

  const toggleSelectItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRowClick = (visit: Visit) => {
    setSelectedVisit(visit);
  };

  const handleBatchPrint = () => {
    toast.success(`กำลังเตรียมพิมพ์ใบนัดเยี่ยมบ้าน (${selectedItems.length} รายการ)`, {
      description: "ระบบกำลังสร้างไฟล์สำหรับพิมพ์ชุดใบนัด"
    });
  };

  const handleBatchNotify = () => {
    toast.info(`ส่งการแจ้งเตือนไปยังทีมงาน ${selectedItems.length} กลุ่ม`, {
      description: "ระบบส่งรายละเอียดการเยี่ยมบ้านไปยังแอปพลิเคชันทีมงาน"
    });
  };

  if (selectedVisit) {
    return (
      <HomeVisitDetail 
        visit={selectedVisit} 
        onBack={() => setSelectedVisit(null)} 
      />
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700 font-sans">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="bg-teal-600 text-white p-1 rounded">
               <ShieldCheck size={16} />
             </div>
             <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">SCFC Home Visit Mode</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">ระบบติดตามการ <span className="text-teal-600">เยี่ยมบ้าน</span></h1>
          <p className="text-slate-500 text-sm font-medium">ศูนย์บัญชาการติดตามและประสานงานการเยี่ยมบ้านทั่วเครือข่ายภาคเหนือ</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 text-xs font-bold mr-4">
              <span className="text-slate-400 uppercase">สถานะเครือข่าย:</span>
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                เชื่อมต่อปกติ
              </span>
           </div>
           
           <div className="bg-white p-1 rounded-lg border border-slate-200 flex shadow-sm">
             <button 
              onClick={() => setViewMode('map')}
              className={cn("p-2 rounded-md transition-all", viewMode === 'map' ? "bg-teal-50 text-teal-600 shadow-inner" : "text-slate-400 hover:text-slate-600")}
             >
               <MapIcon size={18} />
             </button>
             <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-md transition-all", viewMode === 'list' ? "bg-teal-50 text-teal-600 shadow-inner" : "text-slate-400 hover:text-slate-600")}
             >
               <List size={18} />
             </button>
           </div>
           
           {onBack && (
             <Button variant="outline" size="sm" onClick={onBack} className="h-10 border-slate-200 text-slate-600 font-bold text-xs px-4 bg-white shadow-sm rounded-xl">
               <ArrowLeft size={16} className="mr-2" /> ย้อนกลับ
             </Button>
           )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-4 transition-all hover:shadow-md">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="ค้นหาตามชื่อผู้ป่วย, HN หรือ รพ.สต. ที่รับผิดชอบ..." 
            className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
          />
        </div>
        
        <div className="flex items-center gap-3">
           <Select value={selectedProvince} onValueChange={setSelectedProvince}>
             <SelectTrigger className="w-[200px] h-11 bg-white border-slate-200 text-xs font-bold rounded-xl">
               <div className="flex items-center gap-2">
                 <MapPin size={16} className="text-teal-600" />
                 <SelectValue placeholder="เลือกพื้นที่" />
               </div>
             </SelectTrigger>
             <SelectContent>
               {PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
             </SelectContent>
           </Select>

           <Select defaultValue="all">
             <SelectTrigger className="w-[160px] h-11 bg-white border-slate-200 text-xs font-bold rounded-xl">
               <div className="flex items-center gap-2">
                 <Filter size={16} className="text-teal-600" />
                 <SelectValue placeholder="สถานะทั้งหมด" />
               </div>
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">ทุกสถานะ</SelectItem>
               <SelectItem value="pending">รอดำเนินการ</SelectItem>
               <SelectItem value="completed">เสร็จสิ้นแล้ว</SelectItem>
             </SelectContent>
           </Select>
           
           <Button className="h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 shadow-lg shadow-teal-600/20 rounded-xl transition-all">
             ค้นหาขั้นสูง
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-3 space-y-6">
           {viewMode === 'map' ? (
             <Card className="border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col min-h-[600px] rounded-xl">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 min-h-[80px]">
                   <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider">
                     <Navigation size={18} className="text-teal-600" /> 
                     แผนที่แสดงกลุ่มผู้ป่วย (เครือข่ายภาคเหนือ)
                   </h2>
                   <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-teal-600"></div> เสร็จสิ้น</div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> รอเยี่ยม</div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> เกินกำหนด</div>
                   </div>
                </div>
                
                <div className="flex-1 relative bg-[#F1F5F9] overflow-hidden">
                   <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                     <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                        <path d="M10,20 Q30,10 50,30 T90,20 L80,80 Q50,90 20,70 Z" fill="currentColor" />
                     </svg>
                   </div>
                   
                   {[
                     { x: 30, y: 40, status: 'completed', label: 'เชียงใหม่ (12 เคส)' },
                     { x: 60, y: 25, status: 'pending', label: 'เชียงราย (8 เคส)' },
                     { x: 45, y: 65, status: 'overdue', label: 'ลำพูน (4 เคส)' },
                     { x: 15, y: 35, status: 'pending', label: 'แม่ฮ่องสอน (2 เคส)' }
                   ].map((m, i) => (
                     <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-300 hover:scale-150 hover:z-20",
                          m.status === 'completed' ? "bg-teal-600" : m.status === 'pending' ? "bg-amber-500" : "bg-rose-500"
                        )}></div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
                           <div className="bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg shadow-2xl font-black uppercase tracking-widest">{m.label}</div>
                        </div>
                     </div>
                   ))}

                   <div className="absolute bottom-6 left-6 right-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <SummaryCard title="รอดำเนินการ" value={stats.homeVisits?.pending || 8} icon={<Clock size={20} className="text-amber-600" />} colorClass="bg-amber-50" />
                      <SummaryCard title="ดำเนินการแล้ว" value={stats.homeVisits?.completed || 12} icon={<CheckCircle2 size={20} className="text-teal-600" />} colorClass="bg-teal-50" />
                      <SummaryCard title="เกินกำหนดเยี่ยม" value={stats.homeVisits?.overdue || 4} icon={<AlertCircle size={20} className="text-rose-600" />} colorClass="bg-rose-50" />
                   </div>
                </div>
             </Card>
           ) : (
             <Card className="border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl transition-all">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 min-h-[80px]">
                   <h2 className="font-bold text-slate-800 text-sm uppercase tracking-widest">รายการเยี่ยมบ้านลำดับความสำคัญสูง</h2>
                   
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
                        <div className="animate-in fade-in duration-300">
                           {/* No specific buttons here for now, but space is reserved */}
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
                                 checked={selectedItems.length === MOCK_VISITS.length && MOCK_VISITS.length > 0}
                                 onChange={toggleSelectAll}
                               />
                            </TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">วันนัดหมาย</TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">ผู้ป่วย / พื้นที่</TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">ทีมรับผิดชอบ</TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">ประเภท</TableHead>
                            <TableHead className="text-[10px] font-black uppercase text-slate-500 tracking-wider">สถานะ</TableHead>
                            <TableHead className="w-10"></TableHead>
                         </TableRow>
                      </TableHeader>
                      <TableBody>
                         {MOCK_VISITS.map((v) => (
                           <TableRow 
                            key={v.id} 
                            className={cn(
                              "hover:bg-slate-50 transition-all group border-b border-slate-100 last:border-0 cursor-pointer",
                              selectedItems.includes(v.id) && "bg-teal-50/30"
                            )}
                            onClick={() => handleRowClick(v)}
                           >
                              <TableCell className="px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                                  checked={selectedItems.includes(v.id)}
                                  onChange={(e) => toggleSelectItem(v.id, e)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="font-black text-slate-900 text-sm tracking-tight">{format(new Date(v.date), "dd/MM/yyyy")}</div>
                                <div className={cn(
                                  "text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded-md w-fit mt-1",
                                  v.priority === 'สูง' ? "bg-rose-50 text-rose-600" :
                                  v.priority === 'กลาง' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
                                )}>
                                  ระดับความสำคัญ: {v.priority}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-black text-slate-800 text-sm group-hover:text-teal-600 transition-colors tracking-tight">
                                    {v.patientName}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-bold mt-0.5">
                                  <MapPin size={12} className="text-teal-500" /> {v.province} | {v.hospital}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-xs font-bold text-slate-700">{v.team}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[9px] h-5 bg-white border-slate-200 uppercase font-black tracking-wider px-2 rounded-md">{v.type}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className={cn(
                                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                  v.status === 'Confirmed' ? "bg-teal-50 text-teal-600 border border-teal-100" :
                                  v.status === 'Pending' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                  "bg-rose-50 text-rose-600 border border-rose-100"
                                )}>
                                  <div className={cn(
                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                    v.status === 'Confirmed' ? "bg-teal-600" :
                                    v.status === 'Pending' ? "bg-amber-600" : "bg-rose-600"
                                  )}></div>
                                  {v.status === 'Confirmed' ? 'ยืนยันแล้ว' :
                                   v.status === 'Pending' ? 'รอยืนยัน' : 'ขาดนัด'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal size={18} />
                                </Button>
                              </TableCell>
                           </TableRow>
                         ))}
                      </TableBody>
                   </Table>
                </div>
             </Card>
           )}
        </div>

        <div className="space-y-6">
           <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-xl transition-all hover:shadow-md hover:border-teal-200">
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <BarChart3 className="text-teal-600" size={16} /> ประสิทธิภาพการเยี่ยมบ้าน
              </h3>
              
              <div className="h-[200px] w-full mb-8 relative min-h-[200px] min-w-0" style={{ minHeight: '200px', height: '200px', width: '100%', minWidth: 0 }}>
                 <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                   <PieChart>
                      <Pie
                        data={VISIT_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {VISIT_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }}
                      />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-800 tracking-tight">{totalVisits}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ทั้งหมด</span>
                 </div>
              </div>

              <div className="space-y-4">
                 {VISIT_DATA.map((item) => (
                   <div key={item.name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full shadow-sm group-hover:scale-125 transition-transform" style={{ backgroundColor: item.color }}></div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                      </div>
                      <span className="text-xs font-black text-slate-800 tracking-tight">{item.value}</span>
                   </div>
                 ))}
              </div>
           </Card>

           <Card className="p-6 border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden relative transition-all hover:shadow-md hover:border-teal-200">
              <div className="absolute -top-4 -right-4 opacity-[0.05] pointer-events-none">
                <Users size={96} className="text-teal-600" />
              </div>
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-6">ทีมงานที่กำลังปฏิบัติหน้าที่</h3>
              <div className="space-y-5">
                 {[
                   { name: 'ทีมเชียงใหม่ A (สหวิชาชีพ)', cases: 12, status: 'ปกติ' },
                   { name: 'รพ.แม่จัน ทีม RPH', cases: 5, status: 'ปกติ' },
                   { name: 'ทีม รพ.ฝาง (พยาบาล)', cases: 18, status: 'งานหนาแน่น' }
                 ].map((t, i) => (
                   <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                      <div>
                        <div className="text-[11px] font-black text-slate-800 tracking-tight">{t.name}</div>
                        <div className="text-[9px] text-slate-400 font-bold mt-0.5">{t.cases} เคสที่ดูแลอยู่</div>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[8px] h-5 font-black uppercase tracking-widest border-none px-2 rounded-full",
                        t.status === 'งานหนาแน่น' ? "bg-rose-50 text-rose-600" : "bg-teal-50 text-teal-600"
                      )}>
                        {t.status}
                      </Badge>
                   </div>
                 ))}
              </div>
              <Button className="w-full mt-6 h-11 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl shadow-lg transition-all active:scale-95">
                จัดการทีมงาน <ChevronRight size={14} />
              </Button>
           </Card>

           <div className="bg-teal-600 p-5 rounded-2xl shadow-xl shadow-teal-600/10 border border-teal-500/20 text-white overflow-hidden relative">
              <div className="absolute -bottom-6 -right-6 opacity-20 transform rotate-12">
                 <AlertCircle size={80} />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-90">
                <AlertCircle size={16} /> บันทึกจากผู้ประสานงาน
              </div>
              <p className="text-xs text-teal-50 leading-relaxed font-medium mb-0 relative z-10">
                สำหรับการสร้างนัดเยี่ยมบ้านใหม่ กรุณาไปที่ <span className="underline decoration-teal-300 underline-offset-4 font-black">ข้อมูลผู้ป่วย</span> เพื่อระบุแผนการรักษาและเลือกทีมงานให้สอดคล้องกับไทม์ไลน์
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
