import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    Briefcase, 
    Video, 
    Users, 
    User,
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
    MapPin,
    Building2,
    ChevronDown,
    ArrowLeft,
    FileText,
    Wifi,
    Banknote
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
import { AppointmentSystem as SCFCAppointmentDashboard } from '../appointment/Appointmentdashboard';
import ReferralSystem from '../referral/ReferralSystem';
import FundSystem from '../funding/FundSystem';
import TeleConsultationSystem from '../tele-med/TeleConsultationSystem';
import CaseManagerSystem from './CaseManagerSystem';
import { PATIENTS_DATA, REFERRAL_DATA, HOME_VISIT_DATA, TELEMED_DATA, CASE_MANAGER_DATA } from '../../../../data/patientData';

// --- Helper: format patient name ---
const formatPatientName = (name: string) => {
  if (!name) return '';
  return name
    .replace('เด็กชาย', 'ด.ช.')
    .replace('เด็กหญิง', 'ด.ญ.')
    .replace('นางสาว', 'น.ส.')
    .replace('นาย', 'น.');
};

// --- MOCK DATA FOR CHART ---
const fundDistributionData = [
  { name: 'การศึกษา', value: 45000, color: '#49358E' },
  { name: 'รักษาพยาบาล', value: 85000, color: '#7367f0' },
  { name: 'การเดินทาง', value: 12000, color: '#7066A9' },
  { name: 'ค่าครองชีพ', value: 25000, color: '#37286A' },
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
  variant: 'green' | 'blue' | 'amber' | 'pink' | 'orange' | 'slate' | 'rose' | 'purple';
  onClick?: () => void;
}

function StatCard({ title, value, subtitle, icon, trend, trendUp, variant, onClick }: StatCardProps) {
  const iconStyles: Record<string, string> = {
    green:  "bg-[#28c76f] border-[#28c76f] text-white",
    blue:   "bg-[#4285f4] border-[#4285f4] text-white",
    amber:  "bg-[#f5a623] border-[#f5a623] text-white",
    pink:   "bg-[#e91e63] border-[#e91e63] text-white",
    orange: "bg-[#ff6d00] border-[#ff6d00] text-white",
    purple: "bg-[#7367f0] border-[#7367f0] text-white",
    slate:  "bg-slate-100 border-slate-200 text-slate-600",
    rose:   "bg-rose-100 border-rose-200 text-rose-600",
  };

  return (
    <div 
        onClick={onClick}
        className="bg-white p-4 rounded-2xl shadow-sm border border-[#E3E0F0] flex flex-col justify-between transition-all active:scale-95 active:shadow-none h-[140px] cursor-pointer select-none snap-center"
    >
      <div className="flex justify-between items-start mb-3">
        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center border", iconStyles[variant])}>
          {icon}
        </div>
        {trend && (
          <div className={cn("flex items-center font-bold px-2 py-0.5 rounded-full text-[14px]", trendUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50")}>
            {trendUp ? <TrendingUp size={12} className="mr-1" /> : null}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-[#7066A9] font-bold mb-1 truncate text-[14px]">{title}</h3>
        <div className="text-2xl font-black text-[#37286A] tracking-tight leading-none">{value}</div>
        {subtitle && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#D2CEE7]"></div>
            <p className="text-[16px] text-[#7066A9]/70 font-medium truncate">{subtitle}</p>
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

    // Drag to Scroll — single container for synchronized 2-row scrolling
    const gridRef = useRef<HTMLDivElement>(null);
    const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0, hasDragged: false });

    const onPointerDown = (e: React.PointerEvent) => {
        if (!gridRef.current) return;
        // Do NOT use setPointerCapture — it blocks click events on children
        dragState.current = {
            isDragging: true,
            startX: e.clientX,
            scrollLeft: gridRef.current.scrollLeft,
            hasDragged: false,
        };
    };

    const onPointerMove = (e: React.PointerEvent) => {
        const ds = dragState.current;
        if (!ds.isDragging || !gridRef.current) return;
        const dx = e.clientX - ds.startX;
        if (Math.abs(dx) > 5) ds.hasDragged = true;
        gridRef.current.scrollLeft = ds.scrollLeft - dx;
    };

    const onPointerUp = () => {
        dragState.current.isDragging = false;
    };

    const handleCardClick = (nav: string) => {
        // Prevent click after drag
        if (dragState.current.hasDragged) return;
        if (nav) onNavigate(nav);
    };

    // Calculate additional stats derived from props or mock data
    const pendingReferrals = REFERRAL_DATA.filter(r => r.type === 'Refer In' && (r.status === 'Pending' || r.status === 'pending'));

    // Build pending fund items from PATIENTS_DATA (using same pattern as CM)
    const pendingFundItems = useMemo(() => {
        return PATIENTS_DATA.flatMap((p: any) =>
            (p.funds || []).map((f: any, idx: number) => ({
                ...f,
                id: `${p.id}-fund-${idx}`,
                patientName: formatPatientName(p.name),
                hn: p.hn || '-',
            }))
        ).filter((f: any) => f.status === 'Pending' || f.status === 'pending');
    }, []);

    const pendingFunds = pendingFundItems.length || 8;

    // Stat cards — top row & bottom row (interleaved for grid-flow-col)
    const statsTop = [
        { title: 'ขอทุนรอพิจารณา', value: pendingFunds, subtitle: 'รอการอนุมัติ', icon: <Briefcase size={16} />, variant: 'amber' as const, trend: 'High Priority', nav: 'funding' },
        { title: 'Tele-consult', value: stats.appointments, subtitle: 'เคสสำเร็จเดือนนี้', icon: <Video size={16} />, variant: 'pink' as const, trendUp: true, trend: '12%', nav: 'teleconsult' },
        { title: 'เยี่ยมบ้าน', value: HOME_VISIT_DATA.length, subtitle: 'รายการทั้งหมด', icon: <Home size={16} />, variant: 'green' as const, nav: 'visit' },
    ];

    const statsBottom = [
        { title: 'นัดหมาย', value: 24, subtitle: 'เดือนนี้', icon: <Calendar size={16} />, variant: 'blue' as const, nav: 'appointment' },
        { title: 'Case Manager', value: CASE_MANAGER_DATA.length, subtitle: 'ผู้ประสานงาน', icon: <Users size={16} />, variant: 'slate' as const, nav: 'casemanager' },
        { title: 'ส่งตัวผู้ป่วย', value: pendingReferrals.length, subtitle: 'รอดำเนินการ', icon: <Ambulance size={16} />, variant: 'orange' as const, nav: 'referral' },
    ];

    // Interleave top/bottom for CSS grid-flow-col (fills column-first)
    const gridCards = statsTop.flatMap((card, i) => [
        { ...card, key: `t-${i}` },
        { ...statsBottom[i], key: `b-${i}` },
    ]);

    return (
        <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header and Filters */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="bg-[#49358E] text-white p-1.5 rounded-lg">
                        <ShieldCheck size={16} />
                    </div>
                    <span className="text-[16px] font-black text-[#49358E] uppercase tracking-[0.1em]">SCFC Overseer Mode</span>
                </div>
                
                <div className="flex justify-between items-end">
                    <div>
                         <h1 className="font-black text-[#37286A] tracking-tight leading-none text-[32px]">System <span className="text-[#7367f0]">&</span> Audit</h1>
                         <p className="text-[#7066A9] font-medium mt-1 text-[18px]">ภาพรวมเครือข่าย ThaiCleftLink</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#49358E] bg-[#F4F0FF] px-3 py-1.5 rounded-full border border-[#E3E0F0]">
                        <div className="w-2 h-2 rounded-full bg-[#7367f0] animate-pulse"></div>
                        NORMAL
                    </div>
                </div>

                {/* Province and Hospital Filters */}
                <div className="flex gap-2 pt-1">
                    {/* Province Filter */}
                    <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative flex-1 h-[44px] bg-white border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                     <MapPin size={18} />
                                 </div>
                                 <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">
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
                                          "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
                                          selectedProvince === 'All' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                      )}
                                  >
                                      ทุกจังหวัด
                                  </button>
                                 {PROVINCES.map(p => (
                                   <button
                                      key={p}
                                      onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
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
                            <button className="relative flex-1 h-[44px] bg-white border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                     <Building2 size={18} />
                                 </div>
                                 <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">
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
                                          "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
                                          selectedHospital === 'All' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                      )}
                                  >
                                      ทุกโรงพยาบาล
                                  </button>
                                 {HOSPITALS.map(h => (
                                   <button
                                      key={h}
                                      onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
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
            </div>

            {/* Stats — 2 horizontal drag-scrollable rows */}
            <div className="-mx-4 md:-mx-6">
                {/* Row 1 & 2 */}
                <div
                    ref={gridRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    className="grid grid-rows-2 grid-flow-col auto-cols-[calc(50vw-24px)] gap-2.5 overflow-x-auto px-4 md:px-6 pb-2 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] touch-pan-x"
                >
                    {gridCards.map(card => (
                        <StatCard
                            key={card.key}
                            title={card.title}
                            value={card.value}
                            subtitle={card.subtitle}
                            icon={card.icon}
                            variant={card.variant}
                            trend={card.trend}
                            trendUp={card.trendUp}
                            onClick={() => handleCardClick(card.nav)}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Action Cards — เพิ่มรายการขอทุน & สร้าง Tele-med */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => onNavigate('funding')}
                    className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl p-5 text-left transition-all active:scale-95 shadow-sm border-none"
                >
                    <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                        <FileText size={22} className="text-[#28c76f]" />
                    </div>
                    <h4 className="font-black text-[#1B5E20] text-[18px] leading-tight">เพิ่มรายการทุน</h4>
                    <p className="text-[16px] text-[#4CAF50] mt-1">ทุนสงเคราะห์</p>
                </button>

                <button
                    onClick={() => onNavigate('teleconsult')}
                    className="bg-gradient-to-br from-[#FFEBEE] to-[#FFCDD2] rounded-2xl p-5 text-left transition-all active:scale-95 shadow-sm border-none"
                >
                    <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                        <Wifi size={22} className="text-[#e91e63]" />
                    </div>
                    <h4 className="font-black text-[#880E4F] text-[18px] leading-tight">สร้าง Tele-med</h4>
                    <p className="text-[16px] text-[#E91E63] mt-1">ระบบปรึกษาทางไกล</p>
                </button>
            </div>

            {/* Approval Inbox Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1 pt-2 pb-1">
                    <h3 className="font-bold text-[#37286A] flex items-center gap-2 text-[18px]">
                        <Activity className="text-[#7066A9]" size={16} />
                        รายการรอตรวจสอบ
                    </h3>
                    <span className="bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full text-[12px]">
                        {pendingFunds} ACTION
                    </span>
                </div>

                {/* Mock Fund Items */}
                {pendingFundItems.map((fund) => (
                    <div key={fund.id} onClick={() => onNavigate('funding')} className="bg-[#fffbeb] p-4 rounded-2xl flex justify-between cursor-pointer hover:bg-yellow-50 transition-colors border border-yellow-100">
                        <div className="flex flex-col gap-2 flex-1 min-w-0 pr-2">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-800 truncate text-[18px]">{fund.name || 'ขอทุนสงเคราะห์'}</span>
                                    <div className="bg-[#fff0e1] px-2 py-0.5 rounded-lg shrink-0">
                                        <span className="font-medium text-[#ff9f43] text-[12px] font-bold">รอพิจารณา</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <User size={14} className="text-yellow-500 shrink-0 mt-1" />
                                    <div className="flex flex-col">
                                        <span className="truncate font-medium text-[16px]">{fund.patientName}</span>
                                        <span className="text-[14px] text-gray-500">HN: {fund.hn}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1.5">
                                    <Banknote size={14} className="text-[#7367f0]" />
                                    <span className="font-medium text-[#7367f0] text-sm font-bold">{(fund.amount || 0).toLocaleString()} บาท</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400 ml-auto">
                                    <Clock size={12} />
                                    <span className="text-xs">{fund.date || 'วันนี้'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {pendingFundItems.length === 0 && (
                    <div className="text-center py-6 text-slate-400">
                        <p className="text-[16px]">ไม่มีรายการรอตรวจสอบ</p>
                    </div>
                )}
                
                <button onClick={() => onNavigate('funding')} className="w-full py-3 text-[16px] font-bold text-[#7066A9] bg-[#F4F0FF]/60 rounded-xl hover:bg-[#F4F0FF] transition-colors flex items-center justify-center gap-1">
                    ดูรายการทั้งหมด <ArrowRight size={12} />
                </button>
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
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${(currentSystem === 'visit' || currentSystem === 'visit_detail' || currentSystem === 'teleconsult' || currentSystem === 'referral' || currentSystem === 'funding' || currentSystem === 'appointment' || currentSystem === 'casemanager') ? 'p-0' : 'p-4 md:p-6'}`}>
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
                 <SCFCAppointmentDashboard 
                     onBack={() => setCurrentSystem('dashboard')}
                 />
            )}

            {currentSystem === 'casemanager' && (
                <CaseManagerSystem 
                    onBack={() => setCurrentSystem('dashboard')}
                />
            )}
        </div>
    </div>
  );
}