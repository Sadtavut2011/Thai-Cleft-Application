import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Video, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Signal,
  MapPin,
  Hospital,
  ArrowRight,
  ChevronDown,
  Building2
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { TeleList } from "./TeleList";
import { TeleDetailMobile, TeleSession, Platform, TeleStatus } from "./TeleDetailMobile";
import { TeleADD } from "./TeleADD";
import { Badge } from "../../../../components/ui/badge";

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

const STABILITY_DATA = [
  { time: '13:00', stability: 98 },
  { time: '13:10', stability: 95 },
  { time: '13:20', stability: 82 },
  { time: '13:30', stability: 45 }, 
  { time: '13:40', stability: 70 },
  { time: '13:50', stability: 99 },
];

const FILTER_OPTIONS = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'active', label: 'กำลังตรวจ' },
    { id: 'waiting', label: 'รอตรวจ' },
    { id: 'issue', label: 'ปัญหาเทคนิค' }
];

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ["ทุกหน่วยงาน", "รพ.สต. บ้านหนองหอย", "รพ.ฝาง", "รพ.ลำพูน", "รพ.มหาราชนครเชียงใหม่"];

export default function TeleConsultationSystem({ onBack }: { onBack: () => void }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail' | 'create'>('dashboard');
  const [selectedSession, setSelectedSession] = useState<TeleSession | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [selectedHospital, setSelectedHospital] = useState("ทุกหน่วยงาน");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Stats
  const stats = {
      active: MOCK_SESSIONS.filter(s => s.status === 'Active').length,
      avgWait: '12 min',
      stability: 99.9,
      specialists: 14
  };

  const filteredSessions = MOCK_SESSIONS.filter(s => {
      const matchesSearch = !searchQuery || s.patientName.includes(searchQuery) || s.hn.includes(searchQuery);
      return matchesSearch;
  });

  const handleSelectSession = (session: TeleSession) => {
      setSelectedSession(session);
      setCurrentView('detail');
  };
  
  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  // --- Views ---

  if (currentView === 'create') {
    return (
        <TeleADD 
            onBack={() => setCurrentView('list')}
            onSave={(data) => {
                console.log("Saved:", data);
                setCurrentView('list');
            }}
        />
    );
  }

  if (currentView === 'detail' && selectedSession) {
      return (
          <TeleDetailMobile 
            session={selectedSession} 
            onBack={() => setCurrentView('list')} 
          />
      );
  }

  if (currentView === 'list') {
      return (
        <TeleList 
            data={filteredSessions} 
            onSelect={handleSelectSession} 
            onBack={() => setCurrentView('dashboard')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreate={() => setCurrentView('create')}
        />
      );
  }

  // --- Dashboard View ---
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
       {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
             <ArrowLeft size={20} />
          </button>
          <div>

            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">Tele-Consult</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-purple-50 text-purple-600 p-1.5 rounded-lg border border-purple-100">
                <Video size={18} />
            </div>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
         
         {/* Filter Section */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             
             {/* Province & Hospital Filter */}
             <div className="grid grid-cols-2 gap-3">
                {/* Province Filter */}
                <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                    <PopoverTrigger asChild>
                        <button className="relative w-full h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all active:scale-95">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none">
                                 <MapPin size={18} />
                             </div>
                             <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">
                                 {selectedProvince === 'ทุกจังหวัด' ? 'ทุกจังหวัด' : selectedProvince}
                             </span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                 <ChevronDown size={18} />
                             </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                         <div className="flex flex-col">
                             <button
                                  onClick={() => { setSelectedProvince('ทุกจังหวัด'); setIsProvinceOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedProvince === 'ทุกจังหวัด' ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50"
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
                                      selectedProvince === p ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50"
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
                        <button className="relative w-full h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all active:scale-95">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none">
                                 <Building2 size={18} />
                             </div>
                             <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">
                                 {selectedHospital === 'ทุกหน่วยงาน' ? 'ทุกหน่วยงาน' : selectedHospital}
                             </span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                 <ChevronDown size={18} />
                             </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                         <div className="flex flex-col">
                             <button
                                  onClick={() => { setSelectedHospital('ทุกหน่วยงาน'); setIsHospitalOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedHospital === 'ทุกหน่วยงาน' ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50"
                                  )}
                              >
                                  ทุกหน่วยงาน
                              </button>
                             {HOSPITALS.filter(h => h !== 'ทุกหน่วยงาน').map(h => (
                               <button
                                  key={h}
                                  onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedHospital === h ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50"
                                  )}
                              >
                                  {h}
                              </button>
                             ))}
                         </div>
                    </PopoverContent>
                </Popover>
             </div>

             <div className="pt-1">
                <Button 
                    onClick={() => setCurrentView('list')}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 text-base font-bold shadow-md shadow-teal-100 flex items-center justify-center gap-2"
                >
                    ดูรายการทั้งหมด
                    <ArrowRight size={18} />
                </Button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                     <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                         <Video size={16} />
                     </div>
                     <Badge className="bg-purple-50 text-purple-700 border-none text-[9px] font-bold">LIVE</Badge>
                 </div>
                 <span className="text-xl font-black text-slate-800 leading-none">{stats.active}</span>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">กำลังปรึกษา</p>
             </div>

             <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                     <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                         <Clock size={16} />
                     </div>
                     <div className="flex items-center gap-1 text-[9px] font-bold text-rose-500">
                         <TrendingUp size={10} /> +2m
                     </div>
                 </div>
                 <span className="text-xl font-black text-slate-800 leading-none">{stats.avgWait}</span>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">รอเฉลี่ย</p>
             </div>

             <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                     <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                         <Signal size={16} />
                     </div>
                 </div>
                 <span className="text-xl font-black text-slate-800 leading-none">{stats.stability}%</span>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">ความเสถียร</p>
             </div>

             <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                     <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                         <Hospital size={16} />
                     </div>
                 </div>
                 <span className="text-xl font-black text-slate-800 leading-none">{stats.specialists}</span>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">แพทย์พร้อม</p>
             </div>
         </div>

         {/* Chart Section */}
         <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 uppercase tracking-wider">
                    <Signal className="text-emerald-500" size={14} /> System Stability
                </h3>
                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px]">Stable</Badge>
            </div>
            <div className="p-4">
                 <div style={{ width: '100%', height: 150, minWidth: 0 }}>
                     {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={STABILITY_DATA}>
                            <defs>
                                <linearGradient id="colorStability" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} 
                            />
                            <Area type="monotone" dataKey="stability" stroke="#10b981" fill="url(#colorStability)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                     ) : (
                        <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                     )}
                 </div>
            </div>
         </Card>
      </div>
    </div>
  );
}