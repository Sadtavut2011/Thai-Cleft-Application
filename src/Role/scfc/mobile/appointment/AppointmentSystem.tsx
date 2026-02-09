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

  // Stats Logic
  const stats = {
    total: MOCK_DATA.length,
    confirmed: MOCK_DATA.filter(a => a.status === 'Confirmed').length,
    pending: MOCK_DATA.filter(a => a.status === 'Pending').length,
    missed: MOCK_DATA.filter(a => a.status === 'Missed').length,
  };

  const PIE_DATA = [
    { name: 'ยืนยันแล้ว', value: stats.confirmed, color: '#0d9488' },
    { name: 'รอยืนยัน', value: stats.pending, color: '#f59e0b' },
    { name: 'ขาดนัด', value: stats.missed, color: '#ef4444' },
  ];

  // Filter Logic
  const filteredData = MOCK_DATA.filter(item => {
     const matchSearch = item.patientName.includes(searchQuery) || item.hn.includes(searchQuery);
     const matchProvince = selectedProvince === 'All' || selectedProvince === 'ทุกจังหวัด' || item.province === selectedProvince;
     const matchHospital = selectedHospital === 'All' || selectedHospital === 'ทุกโรงพยาบาล' || item.hospital === selectedHospital;
     
     const matchStatus = filterStatus === 'all' || 
        (filterStatus === 'pending' && item.status === 'Pending') ||
        (filterStatus === 'confirmed' && item.status === 'Confirmed') ||
        (filterStatus === 'missed' && item.status === 'Missed');

     return matchSearch && matchProvince && matchHospital && matchStatus;
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
            data={filteredData}
            onSelect={handleSelectAppointment}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBack={() => setCurrentView('dashboard')}
            totalItems={filteredData.length}
        />
      );
  }

  // --- Dashboard View ---
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
      
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>

            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">นัดหมาย</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-teal-50 text-teal-600 p-1.5 rounded-lg">
                <ShieldAlert size={18} />
            </div>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        
        {/* --- Filter Section (Copied Style) --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, HN..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" 
                    />
                </div>
                
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <button className="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0 shadow-sm text-slate-500">
                       <Filter size={20} />
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

            {/* --- Action Button (View Details) --- */}
            <div className="pt-1">
                <Button 
                    onClick={() => setCurrentView('list')}
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
                <span className="text-xl font-black text-slate-800 leading-none">{stats.confirmed}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">ยืนยันแล้ว</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                    <Clock size={16} />
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.pending}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">รอยืนยัน</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
                    <AlertCircle size={16} />
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.missed}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-1">ขาดนัด</span>
            </div>
        </div>

        {/* --- Chart Section --- */}
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 uppercase tracking-wider">
                    <PieChartIcon className="text-teal-600" size={14} /> ภาพรวมนัดหมาย
                </h3>
            </div>
            <div className="p-4 flex items-center justify-between">
                 <div className="w-[100px] h-[100px] relative" style={{ minWidth: 100, minHeight: 100 }}>
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
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-black text-slate-800">{stats.total}</span>
                     </div>
                 </div>
                 <div className="flex-1 pl-4 space-y-2">
                     {PIE_DATA.map((item) => (
                       <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                             <span className="text-[10px] font-bold text-slate-500">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-800">{stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%</span>
                       </div>
                     ))}
                 </div>
            </div>
        </Card>

      </div>
    </div>
  );
}
