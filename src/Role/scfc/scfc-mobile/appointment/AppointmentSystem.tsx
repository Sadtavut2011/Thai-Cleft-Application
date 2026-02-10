import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Clock, 
  ShieldAlert,
  Video,
  Filter,
  TrendingDown,
  TrendingUp,
  Mail,
  UserX,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Building2,
  ChevronDown,
  ArrowRight,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ResponsiveContainer, BarChart, Bar, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { AppointmentList } from "./AppointmentList";
import { AppointmentDetailMobile } from "./AppointmentDetailMobile";

// ── Purple Theme Palette ──
// Primary:   #49358E (dark), #7066A9 (medium), #37286A (darker)
// Light:     #E3E0F0, #D2CEE7, #F4F0FF (lightest)

// --- Types & Mock Data ---

export interface Appointment {
  id: string;
  patientName: string;
  hn: string;
  hospital: string;
  province: string;
  clinic: string;
  date: string;
  time: string;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Missed';
  isOverdue: boolean;
  hasConflict: boolean;
  needsIntervention: boolean;
  riskLevel: 'สูง' | 'กลาง' | 'ต่ำ';
}

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
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

const FILTER_OPTIONS = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'pending', label: 'รอยืนยัน' },
    { id: 'confirmed', label: 'ยืนยันแล้ว' },
    { id: 'missed', label: 'ขาดนัด' },
];

// --- Main Component ---

export function AppointmentSystem({ onBack }: { onBack?: () => void }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail'>('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Shared Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Stats Logic
  const stats = {
    total: MOCK_DATA.length,
    confirmed: MOCK_DATA.filter(a => a.status === 'Confirmed').length,
    pending: MOCK_DATA.filter(a => a.status === 'Pending').length,
    missed: MOCK_DATA.filter(a => a.status === 'Missed').length,
  };

  const PIE_DATA = [
    { name: 'ยืนยันแล้ว', value: stats.confirmed, color: '#49358E' },
    { name: 'รอยืนยัน', value: stats.pending, color: '#f59e0b' },
    { name: 'ขาดนัด', value: stats.missed, color: '#ef4444' },
  ];

  // Filter Logic — parent only handles search, SuperFilter is inside AppointmentList
  const searchFilteredData = MOCK_DATA.filter(item => {
     const term = searchQuery.toLowerCase().trim();
     if (!term) return true;
     return item.patientName.toLowerCase().includes(term) || item.hn.toLowerCase().includes(term);
  });

  const handleSelectAppointment = (apt: Appointment) => {
      setSelectedAppointment(apt);
      setCurrentView('detail');
  };

  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  // --- Views ---

  if (currentView === 'detail' && selectedAppointment) {
      return <AppointmentDetailMobile appointment={selectedAppointment} onBack={() => setCurrentView('list')} />;
  }

  if (currentView === 'list') {
      return (
        <AppointmentList 
            data={searchFilteredData}
            onSelect={handleSelectAppointment}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBack={() => setCurrentView('dashboard')}
        />
      );
  }

  // --- Dashboard View ---
  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
      
      {/* Header - Purple */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
          {onBack && (
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-white text-lg font-bold">นัดหมาย</h1>
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
                             {PROVINCES.filter(p => p !== 'ทุกจังหวัด').map(p => (
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

            {/* --- Action Button (View Details) --- */}
            <div className="pt-1">
                <Button 
                    onClick={() => setCurrentView('list')}
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
                <span className="text-xl font-black text-[#37286A] leading-none">{stats.confirmed}</span>
                <span className="text-[9px] font-bold text-[#7066A9] mt-1">ยืนยันแล้ว</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                    <Clock size={16} />
                </div>
                <span className="text-xl font-black text-[#37286A] leading-none">{stats.pending}</span>
                <span className="text-[9px] font-bold text-[#7066A9] mt-1">รอยืนยัน</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
                    <AlertCircle size={16} />
                </div>
                <span className="text-xl font-black text-[#37286A] leading-none">{stats.missed}</span>
                <span className="text-[9px] font-bold text-[#7066A9] mt-1">ขาดนัด</span>
            </div>
        </div>

        {/* --- Chart Section --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-xs flex items-center gap-2 uppercase tracking-wider">
                    <PieChartIcon className="text-[#7066A9]" size={14} /> ภาพรวมนัดหมาย
                </h3>
            </div>
            <div className="p-4 flex items-center justify-between">
                 <div className="w-[100px] h-[100px] relative" style={{ minWidth: 100, minHeight: 100 }}>
                     {isMounted && (
                       <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                         <PieChart>
                            <Pie
                              data={PIE_DATA}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={45}
                              paddingAngle={5}
                              dataKey="value"
                              stroke="none"
                            >
                              {PIE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                         </PieChart>
                       </ResponsiveContainer>
                     )}
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-black text-[#37286A]">{stats.total}</span>
                     </div>
                 </div>
                 <div className="flex-1 pl-4 space-y-2">
                     {PIE_DATA.map((item) => (
                       <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                             <span className="text-[10px] font-bold text-[#7066A9]">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-[#37286A]">{stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%</span>
                       </div>
                     ))}
                 </div>
            </div>
        </Card>

      </div>
    </div>
  );
}