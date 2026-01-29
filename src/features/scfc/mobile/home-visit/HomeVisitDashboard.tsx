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
  List,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Phone,
  Building2,
  ChevronDown
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { format } from "date-fns";
import { th } from "date-fns/locale";
import SlotClone from "../../../../imports/SlotClone-4162-1830";

// --- Types ---
interface Visit {
  id: string;
  patientName: string;
  hn: string;
  province: string;
  hospital: string;
  team: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Missed' | 'Completed';
  type: string;
  priority: 'สูง' | 'กลาง' | 'ต่ำ';
  phone?: string;
  address?: string;
}

// --- Mock Data ---
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
    priority: 'สูง',
    phone: "081-234-5678",
    address: "123 ม.1 ต.เวียง อ.ฝาง"
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
    priority: 'กลาง',
    phone: "089-987-6543",
    address: "45 ม.2 ต.ดอยฮาง อ.เมือง"
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
    priority: 'ต่ำ',
    phone: "053-111-222",
    address: "78 ม.3 ต.ในเมือง อ.เมือง"
  },
  {
    id: "HV-004",
    patientName: "นาง มานี มีทรัพย์",
    hn: "HN215",
    province: "เชียงใหม่",
    hospital: "รพ.นครพิงค์",
    team: "ทีมกายภาพ",
    date: "2026-01-22",
    status: 'Completed',
    type: 'ฟื้นฟู',
    priority: 'กลาง',
    phone: "086-555-4444",
    address: "99 ม.5 ต.ดอนแก้ว อ.แม่ริม"
  }
];

const PROVINCES = ["ทุกพื้นที่", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

const FILTER_OPTIONS = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'pending', label: 'รอเยี่ยม' },
    { id: 'confirmed', label: 'ยืนยันแล้ว' },
    { id: 'missed', label: 'ขาดนัด' },
    { id: 'completed', label: 'เสร็จสิ้น' }
];

export function HomeVisitDashboard({ onBack, onViewDetail, initialSearch }: { onBack?: () => void, onViewDetail?: (id: string) => void, initialSearch?: string }) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');

  // Stats Data
  const stats = {
    completed: MOCK_VISITS.filter(v => v.status === 'Completed').length + 12,
    pending: MOCK_VISITS.filter(v => v.status === 'Pending').length + 5,
    overdue: MOCK_VISITS.filter(v => v.status === 'Missed').length + 2,
  };

  const VISIT_DATA = [
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#0d9488' },
    { name: 'รอเยี่ยม', value: stats.pending, color: '#f59e0b' },
    { name: 'เกินกำหนด', value: stats.overdue, color: '#ef4444' },
  ];

  const filteredVisits = MOCK_VISITS.filter(v => {
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'pending' && v.status === 'Pending') ||
      (filterStatus === 'confirmed' && v.status === 'Confirmed') ||
      (filterStatus === 'completed' && v.status === 'Completed') ||
      (filterStatus === 'missed' && v.status === 'Missed');
    
    const matchSearch = v.patientName.includes(searchQuery) || v.hn.includes(searchQuery) || v.hospital.includes(searchQuery);
    
    // Simple mock filter for province/hospital (assuming data matches or 'All')
    const matchProvince = selectedProvince === 'All' || v.province === selectedProvince;
    const matchHospital = selectedHospital === 'All' || v.hospital === selectedHospital;

    return matchStatus && matchSearch && matchProvince && matchHospital;
  });

  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
      {/* --- Header --- */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">Home Visit</h1>

          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-teal-50 text-teal-600 p-1.5 rounded-lg">
                <ShieldCheck size={18} />
            </div>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        
        {/* --- Filter Section --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, เลขที่ส่งตัว..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" 
                    />
                </div>
                
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <button className="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0 shadow-sm text-slate-500">
                       <div className="w-5 h-5">
                           <SlotClone />
                       </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100">
                      <div className="flex flex-col">
                          {FILTER_OPTIONS.map((option) => (
                              <button
                                  key={option.id}
                                  onClick={() => handleFilterSelect(option.id, () => setIsFilterOpen(false))}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
                                      filterStatus === option.id ? "bg-slate-50 text-[#7367f0]" : "text-slate-700 hover:bg-slate-50"
                                  )}
                              >
                                  {option.label}
                              </button>
                          ))}
                          <div className="my-1 border-t border-slate-100" />
                          <button 
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full text-left px-3 py-3 text-[16px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ยกเลิก
                          </button>
                      </div>
                  </PopoverContent>
                </Popover>
             </div>

             {/* Province and Hospital Filters */}
             <div className="flex gap-2">
                <div className="relative flex-1">
                   <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none">
                      <MapPin size={14} />
                   </div>
                   <select 
                     value={selectedProvince}
                     onChange={(e) => setSelectedProvince(e.target.value)}
                     className="w-full h-[36px] pl-8 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                   >
                     <option value="All">ทุกจังหวัด</option>
                     {PROVINCES.map(p => (
                       <option key={p} value={p}>{p}</option>
                     ))}
                   </select>
                   <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown size={14} />
                   </div>
                </div>

                <div className="relative flex-1">
                   <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none">
                      <Building2 size={14} />
                   </div>
                   <select 
                     value={selectedHospital}
                     onChange={(e) => setSelectedHospital(e.target.value)}
                     className="w-full h-[36px] pl-8 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                   >
                     <option value="All">ทุกโรงพยาบาล</option>
                     {HOSPITALS.map(h => (
                       <option key={h} value={h}>{h}</option>
                     ))}
                   </select>
                   <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown size={14} />
                   </div>
                </div>
             </div>

            {/* --- Action Button (Moved inside) --- */}
            <div className="pt-1">
                <Button 
                    onClick={() => onViewDetail && onViewDetail('all')}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 text-base font-bold shadow-md shadow-teal-100 flex items-center justify-center gap-2"
                >
                    ดูรายละเอียด
                    <ArrowRight size={18} />
                </Button>
            </div>
        </div>

        {/* --- Stats Summary --- */}
        <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-1">
                    <CheckCircle2 size={16} />
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.completed}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">เยี่ยมแล้ว</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                    <Clock size={16} />
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.pending}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">รอเยี่ยม</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
                    <AlertCircle size={16} />
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.overdue}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">เกินกำหนด</span>
            </div>
        </div>

        {/* --- Chart Section --- */}
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 uppercase tracking-wider">
                    <BarChart3 className="text-teal-600" size={14} /> ภาพรวมประจำเดือน
                </h3>
            </div>
            <div className="p-4 flex items-center justify-between">
                 <div className="w-[100px] h-[100px] relative" style={{ minWidth: 100, minHeight: 100 }}>
                     <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                       <PieChart>
                          <Pie
                            data={VISIT_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={45}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {VISIT_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                       </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-black text-slate-800">{stats.completed + stats.pending + stats.overdue}</span>
                     </div>
                 </div>
                 <div className="flex-1 pl-4 space-y-2">
                     {VISIT_DATA.map((item) => (
                       <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                             <span className="text-[10px] font-bold text-slate-500">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-800">{Math.round((item.value / (stats.completed + stats.pending + stats.overdue)) * 100)}%</span>
                       </div>
                     ))}
                 </div>
            </div>
        </Card>

        {/* --- Map View (if active) --- */}
        {viewMode === 'map' && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[400px] relative">
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 border border-slate-100">
                        <Navigation size={18} />
                    </button>
                    <button className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 border border-slate-100">
                        <MapPin size={18} />
                    </button>
                </div>
                
                <div className="w-full h-full bg-slate-100 relative">
                     <iframe 
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3753.689626577903!2d99.03057531494883!3d19.809279030623315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a7e91a66a1b%3A0x4d567c9e0d167735!2sFang%20Hospital!5e0!3m2!1sen!2sth!4v1625567891234!5m2!1sen!2sth"
                       width="100%"
                       height="100%"
                       style={{ border: 0, opacity: 0.7 }}
                       loading="lazy"
                    />
                    
                    {MOCK_VISITS.map((v, i) => (
                        <div 
                            key={i}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{ top: `${30 + (i * 15)}%`, left: `${40 + (i * 10)}%` }}
                        >
                            <div className={cn(
                                "w-3 h-3 rounded-full border border-white shadow-lg",
                                v.status === 'Confirmed' ? "bg-teal-500" :
                                v.status === 'Pending' ? "bg-amber-500" : "bg-rose-500"
                            )}></div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap z-20">
                                <div className="bg-slate-800 text-white text-[9px] py-1 px-2 rounded-md shadow-lg font-bold">
                                    {v.patientName}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
