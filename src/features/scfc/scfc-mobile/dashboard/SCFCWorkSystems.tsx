import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    Briefcase, 
    Video, 
    Users, 
    Activity, 
    ShieldCheck, 
    TrendingUp, 
    AlertCircle,
    ChevronRight, 
    ArrowRight,
    Home,
    Calendar,
    Ambulance,
    Clock,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    FileText,
    MapPin,
    Building2,
    ChevronDown
} from 'lucide-react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Cell 
} from 'recharts';
import { cn } from "../../../../components/ui/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { HomeVisitSystem } from '../home-visit/HomeVisitSystem';
import { HomeVisitDashboard } from '../home-visit/HomeVisitDashboard';
import { AppointmentSystem } from '../appointment/AppointmentSystem';
import ReferralSystem from '../referral/ReferralSystem';
import FundSystem from '../funding/FundSystem';
import TeleConsultationSystem from '../tele-med/TeleConsultationSystem';
import { PATIENTS_DATA, REFERRAL_DATA, HOME_VISIT_DATA, TELEMED_DATA } from '../../../../data/patientData';

// --- MOCK DATA FOR CHART ---
const fundDistributionData = [
  { name: 'การศึกษา', value: 45000, color: '#0d9488' },
  { name: 'รักษาพยาบาล', value: 85000, color: '#0891b2' },
  { name: 'การเดินทาง', value: 12000, color: '#0f766e' },
  { name: 'ค่าครองชีพ', value: 25000, color: '#115e59' },
];

// Mock Data for Filters
const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

// --- COMPONENTS ---

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  variant: 'teal' | 'cyan' | 'slate' | 'rose';
  onClick?: () => void;
}

function StatCard({ title, value, subtitle, icon, trend, trendUp, variant, onClick }: StatCardProps) {
  const variants = {
    teal: "bg-teal-50 border-teal-100 text-teal-600",
    cyan: "bg-cyan-50 border-cyan-100 text-cyan-600",
    slate: "bg-slate-50 border-slate-100 text-slate-600",
    rose: "bg-rose-50 border-rose-100 text-rose-600",
  };

  return (
    <div 
        onClick={onClick}
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between transition-all active:scale-95 active:shadow-none"
    >
      <div className="flex justify-between items-start mb-3">
        <div className={cn("p-2 rounded-lg border", variant === 'cyan' ? "bg-[#F6339A] border-[#F6339A] text-white" : variant === 'teal' ? "bg-[#F0B100] border-[#F0B100] text-white" : variants[variant])}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
            trendUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
          )}>
            {trendUp ? <TrendingUp size={10} className="mr-1" /> : null}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 truncate">{title}</h3>
        <div className="text-xl font-black text-slate-800 tracking-tight leading-none">{value}</div>
        {subtitle && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
            <p className="text-[9px] text-slate-400 font-medium truncate">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const SystemsDashboard = ({ onNavigate, stats }: { onNavigate: (sys: string, params?: any) => void, stats: any }) => {
    // New Filter State
    const [selectedProvince, setSelectedProvince] = useState<string>('All');
    const [selectedHospital, setSelectedHospital] = useState<string>('All');
    const [isProvinceOpen, setIsProvinceOpen] = useState(false);
    const [isHospitalOpen, setIsHospitalOpen] = useState(false);

    // Drag to Scroll Logic for Quick Menu
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // Calculate additional stats derived from props or mock data
    const pendingReferrals = REFERRAL_DATA.filter(r => r.type === 'Refer In' && (r.status === 'Pending' || r.status === 'pending'));
    const pendingFunds = 8; // Mock value as used in web dashboard
    const lossFollowUpRate = 12; // Mock value

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header and Filters */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="bg-teal-600 text-white p-1 rounded">
                        <ShieldCheck size={14} />
                    </div>
                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.15em]">SCFC Overseer Mode</span>
                </div>
                
                <div className="flex justify-between items-end">
                    <div>
                         <h1 className="font-black text-slate-900 tracking-tight leading-none text-[32px]">System <span className="text-teal-600">&</span> Audit</h1>
                         <p className="text-slate-500 text-xs font-medium mt-1 text-[18px]">ภาพรวมเครือข่าย ThaiCleftLink</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        NORMAL
                    </div>
                </div>

                {/* Province and Hospital Filters */}
                <div className="flex gap-2 pt-1">
                    {/* Province Filter */}
                    <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative flex-1 h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all active:scale-95">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none">
                                     <MapPin size={18} />
                                 </div>
                                 <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">
                                     {selectedProvince === 'All' ? 'ทุกจังหวัด' : selectedProvince}
                                 </span>
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                     <ChevronDown size={18} />
                                 </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                             <div className="flex flex-col">
                                 <button
                                      onClick={() => { setSelectedProvince('All'); setIsProvinceOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedProvince === 'All' ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50"
                                      )}
                                  >
                                      ทุกจังหวัด
                                  </button>
                                 {PROVINCES.map(p => (
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
                            <button className="relative flex-1 h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all active:scale-95">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none">
                                     <Building2 size={18} />
                                 </div>
                                 <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">
                                     {selectedHospital === 'All' ? 'ทุกโรงพยาบาล' : selectedHospital}
                                 </span>
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                     <ChevronDown size={18} />
                                 </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                             <div className="flex flex-col">
                                 <button
                                      onClick={() => { setSelectedHospital('All'); setIsHospitalOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedHospital === 'All' ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50"
                                      )}
                                  >
                                      ทุกโรงพยาบาล
                                  </button>
                                 {HOSPITALS.map(h => (
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
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard 
                  title="ขอทุนรอพิจารณา" 
                  value={pendingFunds} 
                  subtitle="รอการอนุมัติ" 
                  icon={<Briefcase size={16} />}
                  variant="teal"
                  trend="High Priority"
                  onClick={() => onNavigate('funding')}
                />
                <StatCard 
                  title="ผู้ป่วยขาดนัด" 
                  value={`${lossFollowUpRate}%`} 
                  subtitle="เสี่ยงขาดการรักษา" 
                  icon={<AlertCircle size={16} />}
                  variant="rose"
                  trend="+2 Alerts"
                />
                <StatCard 
                  title="Tele-consult" 
                  value={stats.appointments}
                  subtitle="เคสสำเร็จเดือนนี้" 
                  icon={<Video size={16} />}
                  variant="cyan"
                  trendUp={true}
                  trend="12%"
                  onClick={() => onNavigate('teleconsult')}
                />
                <StatCard 
                  title="Case Manager" 
                  value="48" 
                  subtitle="ผู้ประสานงาน" 
                  icon={<Users size={16} />}
                  variant="slate"
                />
            </div>

            {/* Approval Inbox Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1 pt-2 pb-1">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                        <Activity className="text-teal-600" size={16} />
                        รายการรอตรวจสอบ (Priority Inbox)
                    </h3>
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pendingReferrals.length + pendingFunds} ACTION
                    </span>
                </div>

                {/* Mock Fund Items */}
                {[1, 2].map((i) => (
                    <div key={`fund-${i}`} className="bg-[#F0B100]/10 rounded-2xl p-5 flex justify-between items-center relative overflow-hidden" onClick={() => onNavigate('funding')}>
                        <div className="relative z-10 w-full pr-12">
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-900 text-sm text-[18px]">คำขอทุนการศึกษา</h4>
                                <span className="text-[10px] text-slate-500 bg-white/50 px-2 py-0.5 rounded-full">2 ชม. ที่แล้ว</span>
                             </div>
                             <div className="flex items-start gap-3">
                                 <div className="mt-0.5 text-[#F0B100] shrink-0">
                                     <Briefcase size={16} />
                                 </div>
                                 <div className="min-w-0">
                                     <p className="font-bold text-slate-700 text-xs truncate text-[16px]">ด.ช. สมชาย ใจดี</p>
                                     <p className="text-[14px] text-slate-500 font-medium truncate">ทุนการศึกษาต่อเนื่อง (3,000 บ.)</p>
                                 </div>
                             </div>
                        </div>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F0B100] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#F0B100]/40 shrink-0">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                ))}
                
                {/* Referral Items */}
                {pendingReferrals.slice(0, 3).map((r, i) => (
                    <div key={`ref-${i}`} className="bg-[#FFF8F1] rounded-2xl p-5 flex justify-between items-center relative overflow-hidden" onClick={() => onNavigate('referral', { hn: r.hn })}>
                        <div className="relative z-10 w-full pr-12">
                             <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-slate-900 text-sm text-[18px]">รับตัวผู้ป่วยส่งต่อ</h4>
                                <span className="text-[10px] text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">{r.urgency || 'Normal'}</span>
                             </div>
                             <div className="flex items-start gap-3">
                                 <div className="mt-0.5 text-orange-500 shrink-0">
                                     <Ambulance size={16} />
                                 </div>
                                 <div className="min-w-0">
                                     <p className="font-bold text-slate-700 text-xs truncate">{r.patientName}</p>
                                     <p className="text-[11px] text-slate-500 font-medium truncate">จาก {r.hospital}</p>
                                 </div>
                             </div>
                        </div>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200 shrink-0">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                ))}

                <button className="w-full py-3 text-xs font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                    ดูรายการทั้งหมด <ArrowRight size={12} />
                </button>
            </div>

            {/* Monitoring Grid */}
            <div className="grid grid-cols-1 gap-4">
                {/* Quick Menu */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-[20px]">เมนูด่วน</h3>
                    <div className="grid grid-cols-3 gap-2 select-none">
                        {[
                            { label: 'เยี่ยมบ้าน', icon: Home, color: 'text-blue-500', bg: 'bg-blue-50', nav: 'visit' },
                            { label: 'นัดหมาย', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50', nav: 'appointment' },
                            { label: 'ส่งตัว', icon: Ambulance, color: 'text-orange-500', bg: 'bg-orange-50', nav: 'referral' },
                        ].map((item, idx) => (
                            <button 
                                key={idx}
                                onClick={() => onNavigate(item.nav)}
                                className="bg-white py-3 px-1 rounded-xl flex flex-col items-center justify-center gap-2 shadow-sm border border-slate-100 active:scale-95 transition-all"
                            >
                                <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center`}>
                                    <item.icon className={item.color} size={18} />
                                </div>
                                <span className="text-slate-700 font-bold text-xs text-[16px]">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Home Visit & Appointments Row */}
                <div className="grid grid-cols-2 gap-3">
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200" onClick={() => onNavigate('funding')}>
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                           <Briefcase size={16} />
                        </div>
                        <h3 className="text-slate-500 text-[16px] font-bold uppercase mb-1">ขอทุน</h3>
                        <div className="text-2xl font-black text-slate-800 text-[32px]">{pendingFunds}</div>
                        <p className="text-[14px] text-slate-400 mt-1">รอพิจารณา</p>
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                           <div className="h-full bg-teal-500 w-[60%]"></div>
                        </div>
                     </div>
                     
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200" onClick={() => onNavigate('teleconsult')}>
                        <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
                           <Video size={16} />
                        </div>
                        <h3 className="text-slate-500 text-[16px] font-bold uppercase mb-1">Tele-med</h3>
                        <div className="text-2xl font-black text-slate-800 text-[32px]">12</div>
                        <p className="text-[14px] text-slate-400 mt-1">กำลังใช้งาน</p>
                        <div className="flex -space-x-1.5 mt-2">
                           {[1,2,3].map(i => (
                              <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200"></div>
                           ))}
                           <div className="w-5 h-5 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[8px] text-slate-500 font-bold">+9</div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function SCFCWorkSystems({ 
  outgoingCases = [], 
  currentSystem: initialSystem = 'dashboard', 
  onRequestFund, 
  onRequestReferral, 
  onVisitFormStateChange, 
  initialHN, 
  onExitDetail 
}: { 
  outgoingCases?: any[], 
  currentSystem?: string, 
  onRequestFund?: () => void, 
  onRequestReferral?: () => void, 
  onVisitFormStateChange?: (isOpen: boolean) => void, 
  initialHN?: string, 
  onExitDetail?: () => void 
}) {
  const [currentSystem, setCurrentSystem] = useState(initialSystem);

  // Stats for Dashboard using Central Data
  const stats = useMemo(() => ({
      referral: REFERRAL_DATA.length,
      appointments: PATIENTS_DATA.filter(p => p.date === '2025-12-04').length,
      pending: REFERRAL_DATA.filter(r => (r.status === 'pending' || r.status === 'Pending')).length,
      inbound: REFERRAL_DATA.filter(r => r.type === 'Refer In').length,
      outbound: REFERRAL_DATA.filter(r => r.type === 'Refer Out').length,
      funds: { pending: 8 } // Mock
  }), []);

  // Effect to handle external navigation props
  React.useEffect(() => {
      if (initialHN) {
          setCurrentSystem('referral');
      }
  }, [initialHN]);

  // Local state for internal navigation params
  const [navParams, setNavParams] = useState<any>({});

  const handleNavigate = (sys: string, params?: any) => {
      setCurrentSystem(sys);
      if (params) {
          setNavParams(params);
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${(currentSystem === 'visit' || currentSystem === 'visit_detail' || currentSystem === 'teleconsult' || currentSystem === 'referral' || currentSystem === 'funding' || currentSystem === 'appointment') ? 'p-0' : 'p-4 md:p-6'}`}>
            {currentSystem === 'dashboard' && (
                <SystemsDashboard onNavigate={handleNavigate} stats={stats} />
            )}
            
            {currentSystem === 'referral' && (
                <ReferralSystem 
                    onBack={() => setCurrentSystem('dashboard')}
                    initialHN={navParams.hn || initialHN}
                />
            )}

            {currentSystem === 'funding' && (
                <FundSystem 
                    onBack={() => setCurrentSystem('dashboard')}
                />
            )}

            {/* Visit Dashboard Overview */}
            {currentSystem === 'visit' && (
                <HomeVisitDashboard 
                     onBack={() => setCurrentSystem('dashboard')}
                     onViewDetail={(id) => handleNavigate('visit_detail', { visitId: id })}
                />
            )}

            {/* Visit Detail (Legacy System View) */}
            {currentSystem === 'visit_detail' && (
                <HomeVisitSystem 
                     onBack={() => setCurrentSystem('visit')}
                     onVisitFormStateChange={onVisitFormStateChange}
                     initialSearch={navParams.visitId}
                />
            )}

            {currentSystem === 'teleconsult' && (
                <TeleConsultationSystem 
                     onBack={() => setCurrentSystem('dashboard')}
                />
            )}

            {currentSystem === 'appointment' && (
                 <AppointmentSystem 
                    onBack={() => setCurrentSystem('dashboard')}
                 />
            )}
        </div>
    </div>
  );
}
