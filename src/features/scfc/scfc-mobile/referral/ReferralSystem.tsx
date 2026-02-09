import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Building2,
  Ambulance,
  CheckCircle2,
  AlertCircle,
  Activity,
  TrendingUp,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { ReferralList } from "./ReferralList";
import { ReferralDetailMobile, ReferralCase } from "./ReferralDetailMobile";

// --- Mock Data ---

const MOCK_REFERRALS: ReferralCase[] = [
  {
    id: 'REF-001',
    patientName: 'ด.ช. อนันต์ รักดี',
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

const RESPONSE_TREND = [
  { time: '08:00', avg: 15 },
  { time: '10:00', avg: 45 },
  { time: '12:00', avg: 30 },
  { time: '14:00', avg: 120 },
  { time: '16:00', avg: 60 },
];

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];
const FILTER_OPTIONS = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'pending', label: 'รอการตอบรับ' },
    { id: 'confirmed', label: 'นัดหมายแล้ว' },
    { id: 'completed', label: 'เสร็จสิ้น' }
];

export default function ReferralSystem({ onBack, initialHN }: { onBack?: () => void, initialHN?: string }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail'>('dashboard');
  const [selectedCase, setSelectedCase] = useState<ReferralCase | null>(null);
  
  const [searchQuery, setSearchQuery] = useState(initialHN || "");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = {
    active: 142,
    avgResponse: '4 ชม.',
    referBack: 45,
    emergency: 3
  };

  const filteredReferrals = MOCK_REFERRALS.filter(ref => {
    const matchesSearch = !searchQuery ||
        ref.patientName.includes(searchQuery) || 
        ref.hn.includes(searchQuery) || 
        ref.id.includes(searchQuery);
    return matchesSearch;
  });

  const handleSelectCase = (item: ReferralCase) => {
      setSelectedCase(item);
      setCurrentView('detail');
  };

  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  if (currentView === 'detail' && selectedCase) {
      return <ReferralDetailMobile referral={selectedCase} onBack={() => setCurrentView('list')} />;
  }

  if (currentView === 'list') {
      return (
        <ReferralList 
            data={filteredReferrals} 
            onSelect={handleSelectCase} 
            onBack={() => setCurrentView('dashboard')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreate={() => console.log("Create Referral Clicked")}
        />
      );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">ส่งต่อผู้ป่วย</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-teal-50 text-teal-600 p-1.5 rounded-lg">
                <Ambulance size={18} />
            </div>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2">
                <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                    <PopoverTrigger asChild>
                        <button className="relative flex-1 h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all active:scale-95">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none"><MapPin size={18} /></div>
                             <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">{selectedProvince === 'All' ? 'ทุกจังหวัด' : selectedProvince}</span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={18} /></div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                         <div className="flex flex-col">
                             <button onClick={() => { setSelectedProvince('All'); setIsProvinceOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg", selectedProvince === 'All' ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50")}>ทุกจังหวัด</button>
                             {PROVINCES.filter(p => p !== 'ทุกจังหวัด').map(p => (
                               <button key={p} onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg", selectedProvince === p ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50")}>{p}</button>
                             ))}
                         </div>
                    </PopoverContent>
                </Popover>

                <Popover open={isHospitalOpen} onOpenChange={setIsHospitalOpen}>
                    <PopoverTrigger asChild>
                        <button className="relative flex-1 h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all active:scale-95">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none"><Building2 size={18} /></div>
                             <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">{selectedHospital === 'All' ? 'ทุกโรงพยาบาล' : selectedHospital}</span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><ChevronDown size={18} /></div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                         <div className="flex flex-col">
                             <button onClick={() => { setSelectedHospital('All'); setIsHospitalOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg", selectedHospital === 'All' ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50")}>ทุกโรงพยาบาล</button>
                             {HOSPITALS.map(h => (
                               <button key={h} onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg", selectedHospital === h ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50")}>{h}</button>
                             ))}
                         </div>
                    </PopoverContent>
                </Popover>
             </div>

            <div className="pt-1">
                <Button onClick={() => setCurrentView('list')} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 text-base font-bold shadow-md shadow-teal-100 flex items-center justify-center gap-2">
                    ดูรายละเอียด <ArrowRight size={18} />
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center"><Activity size={16} /></div>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+14%</span>
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.active}</span>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">กำลังดำเนินการ</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={16} /></div>
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.avgResponse}</span>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">รอตอบรับเฉลี่ย</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><RotateCcw size={16} /></div>
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.referBack}</span>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">ส่งกลับสำเร็จ</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center"><Ambulance size={16} /></div>
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                </div>
                <span className="text-xl font-black text-slate-800 leading-none">{stats.emergency}</span>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">ฉุกเฉิน</p>
            </div>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 uppercase tracking-wider">
                    <TrendingUp className="text-amber-500" size={14} /> แนวโน้มระยะเวลาตอบรับ
                </h3>
            </div>
            <div className="p-4">
                 <div style={{ width: '100%', height: 120, minWidth: 0 }}>
                     {isMounted ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={RESPONSE_TREND}>
                             <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} labelStyle={{ color: '#64748b' }} />
                             <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
                           </LineChart>
                         </ResponsiveContainer>
                     ) : (
                         <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                     )}
                 </div>
                 <div className="mt-2 flex items-center gap-2 text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                     <AlertCircle size={12} />
                     <span className="font-bold">ช่วง 14:00-16:00 มักตอบรับล่าช้า</span>
                 </div>
            </div>
        </Card>
      </div>
    </div>
  );
}
