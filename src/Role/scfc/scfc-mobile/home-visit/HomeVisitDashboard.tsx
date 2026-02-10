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

// ── Purple Theme Palette ──
// Primary:   #49358E (dark), #7066A9 (medium), #37286A (darker)
// Light:     #E3E0F0, #D2CEE7, #F4F0FF (lightest)

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
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Stats Data
  const stats = {
    completed: MOCK_VISITS.filter(v => v.status === 'Completed').length + 12,
    pending: MOCK_VISITS.filter(v => v.status === 'Pending').length + 5,
    overdue: MOCK_VISITS.filter(v => v.status === 'Missed').length + 2,
  };

  const VISIT_DATA = [
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#49358E' },
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
    
    const matchProvince = selectedProvince === 'All' || v.province === selectedProvince;
    const matchHospital = selectedHospital === 'All' || v.hospital === selectedHospital;

    return matchStatus && matchSearch && matchProvince && matchHospital;
  });

  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
      {/* --- Header - Purple --- */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
          {onBack && (
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-white text-lg font-bold">Home Visit</h1>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        
        {/* --- Filter Section --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E3E0F0] flex flex-col gap-3">
             
             {/* Province and Hospital Filters */}
             <div className="flex gap-2">
                {/* Province Filter */}
                <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                    <PopoverTrigger asChild>
                        <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                 <MapPin size={18} />
                             </div>
                             <span className="pl-7 pr-6 text-[14px] font-medium text-[#37286A] truncate">
                                 {selectedProvince === 'All' ? 'ทุกจังหวัด' : selectedProvince}
                             </span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                 <ChevronDown size={18} />
                             </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                         <div className="flex flex-col">
                             <button
                                  onClick={() => { setSelectedProvince('All'); setIsProvinceOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedProvince === 'All' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                  )}
                              >
                                  ทุกจังหวัด
                              </button>
                             {PROVINCES.filter(p => p !== 'ทุกพื้นที่' && p !== 'ทุกจังหวัด').map(p => (
                               <button
                                  key={p}
                                  onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedProvince === p ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                  )}
                              >
                                  {p}
                              </button>
                             ))}
                         </div>
                    </PopoverContent>
                </Popover>

                {/* Hospital Filter */}
                <Popover open={isHospitalOpen} onOpenChange={setIsHospitalOpen}>
                    <PopoverTrigger asChild>
                        <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                 <Building2 size={18} />
                             </div>
                             <span className="pl-7 pr-6 text-[14px] font-medium text-[#37286A] truncate">
                                 {selectedHospital === 'All' ? 'ทุกโรงพยาบาล' : selectedHospital}
                             </span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                 <ChevronDown size={18} />
                             </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                         <div className="flex flex-col">
                             <button
                                  onClick={() => { setSelectedHospital('All'); setIsHospitalOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedHospital === 'All' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                  )}
                              >
                                  ทุกโรงพยาบาล
                              </button>
                             {HOSPITALS.filter(h => h !== 'ทุกโรงพยาบาล').map(h => (
                               <button
                                  key={h}
                                  onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedHospital === h ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                  )}
                              >
                                  {h}
                              </button>
                             ))}
                         </div>
                    </PopoverContent>
                </Popover>
             </div>

            {/* --- Action Button --- */}
            <div className="pt-1">
                <Button 
                    onClick={() => onViewDetail && onViewDetail('all')}
                    className="w-full bg-[#49358E] hover:bg-[#37286A] text-white rounded-xl h-12 text-base font-bold shadow-md shadow-[#49358E]/20 flex items-center justify-center gap-2 transition-all"
                >
                    ดูรายละเอียด
                    <ArrowRight size={18} />
                </Button>
            </div>
        </div>

        {/* --- Stats Summary --- */}
        <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-[#E3E0F0] shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center mb-1">
                    <CheckCircle2 size={16} />
                </div>
                <span className="text-xl font-black text-[#37286A] leading-none">{stats.completed}</span>
                <span className="text-[9px] font-bold text-[#7066A9] mt-1">เยี่ยมแล้ว</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                    <Clock size={16} />
                </div>
                <span className="text-xl font-black text-[#37286A] leading-none">{stats.pending}</span>
                <span className="text-[9px] font-bold text-[#7066A9] mt-1">รอเยี่ยม</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
                    <AlertCircle size={16} />
                </div>
                <span className="text-xl font-black text-[#37286A] leading-none">{stats.overdue}</span>
                <span className="text-[9px] font-bold text-[#7066A9] mt-1">เกินกำหนด</span>
            </div>
        </div>

        {/* --- Chart Section --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-xs flex items-center gap-2 uppercase tracking-wider">
                    <BarChart3 className="text-[#7066A9]" size={14} /> ภาพรวมประจำเดือน
                </h3>
            </div>
            <div className="p-4 flex items-center justify-between">
                 <div className="w-[100px] h-[100px] relative shrink-0">
                     {isMounted && (
                         <PieChart width={100} height={100}>
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
                             <RechartsTooltip />
                         </PieChart>
                     )}
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-black text-[#37286A]">{stats.completed + stats.pending + stats.overdue}</span>
                     </div>
                 </div>
                 <div className="flex-1 pl-4 space-y-2">
                     {VISIT_DATA.map((item) => (
                       <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                             <span className="text-[10px] font-bold text-[#7066A9]">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-[#37286A]">{Math.round((item.value / (stats.completed + stats.pending + stats.overdue)) * 100)}%</span>
                       </div>
                     ))}
                 </div>
            </div>
        </Card>

        {/* --- Map View (if active) --- */}
        {viewMode === 'map' && (
            <div className="bg-white rounded-2xl border border-[#E3E0F0] overflow-hidden shadow-sm h-[400px] relative">
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-[#7066A9] border border-[#E3E0F0]">
                        <Navigation size={18} />
                    </button>
                    <button className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-[#7066A9] border border-[#E3E0F0]">
                        <MapPin size={18} />
                    </button>
                </div>
                
                <div className="w-full h-full bg-[#F4F0FF] relative">
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
                                v.status === 'Confirmed' ? "bg-[#49358E]" :
                                v.status === 'Pending' ? "bg-amber-500" : "bg-rose-500"
                            )}></div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap z-20">
                                <div className="bg-[#37286A] text-white text-[9px] py-1 px-2 rounded-md shadow-lg font-bold">
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