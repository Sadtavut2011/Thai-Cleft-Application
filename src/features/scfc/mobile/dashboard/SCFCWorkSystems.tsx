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
        <div className={cn("p-2 rounded-lg border", variants[variant])}>
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
                         <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">System <span className="text-teal-600">&</span> Audit</h1>
                         <p className="text-slate-500 text-xs font-medium mt-1">ภาพรวมเครือข่าย ThaiCleftLink</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        NORMAL
                    </div>
                </div>

                {/* Province and Hospital Filters */}
                <div className="flex gap-2 pt-1">
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
                  // onClick={() => onNavigate('appointment')} // Optional
                />
                <StatCard 
                  title="Tele-consult" 
                  value={stats.appointments} // Reuse appointments count for demo or add tele count
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                        <Activity className="text-teal-600" size={16} />
                        รายการรอตรวจสอบ (Priority Inbox)
                    </h3>
                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pendingReferrals.length + pendingFunds} ACTION
                    </span>
                </div>
                <div className="divide-y divide-slate-50">
                    {/* Mock Fund Items */}
                    {[1, 2].map((i) => (
                        <div key={`fund-${i}`} className="p-3 flex items-center gap-3 active:bg-slate-50" onClick={() => onNavigate('funding')}>
                             <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                <Briefcase size={16} />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-center mb-0.5">
                                     <span className="text-xs font-bold text-slate-800">คำขอทุนการศึกษา</span>
                                     <span className="text-[10px] text-slate-400">2 ชม. ที่แล้ว</span>
                                 </div>
                                 <p className="text-[11px] text-slate-500 truncate">ด.ช. สมชาย ใจดี - ทุนการศึกษาต่อเนื่อง (3,000 บ.)</p>
                             </div>
                             <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    ))}
                    
                    {/* Referral Items */}
                    {pendingReferrals.slice(0, 3).map((r, i) => (
                         <div key={`ref-${i}`} className="p-3 flex items-center gap-3 active:bg-slate-50" onClick={() => onNavigate('referral', { hn: r.hn })}>
                             <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <Ambulance size={16} />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-center mb-0.5">
                                     <span className="text-xs font-bold text-slate-800">รับตัวผู้ป่วย (Inbound)</span>
                                     <span className="text-[10px] text-orange-500 font-semibold bg-orange-50 px-1.5 rounded">{r.urgency || 'Normal'}</span>
                                 </div>
                                 <p className="text-[11px] text-slate-500 truncate">{r.patientName} - จาก {r.hospital}</p>
                             </div>
                             <ChevronRight size={16} className="text-slate-300" />
                        </div>
                    ))}
                </div>
                <button className="w-full py-3 text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-center gap-1">
                    ดูรายการทั้งหมด <ArrowRight size={12} />
                </button>
            </div>

            {/* Monitoring Grid */}
            <div className="grid grid-cols-1 gap-4">
                {/* Quick Menu */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-[18px]">เมนูด่วน</h3>
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
                                <span className="text-slate-700 font-bold text-xs">{item.label}</span>
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
                        <h3 className="text-slate-500 text-[10px] font-bold uppercase mb-1">ขอทุน</h3>
                        <div className="text-2xl font-black text-slate-800">{pendingFunds}</div>
                        <p className="text-[9px] text-slate-400 mt-1">รอพิจารณา</p>
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                           <div className="h-full bg-teal-500 w-[60%]"></div>
                        </div>
                     </div>
                     
                     <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200" onClick={() => onNavigate('teleconsult')}>
                        <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
                           <Video size={16} />
                        </div>
                        <h3 className="text-slate-500 text-[10px] font-bold uppercase mb-1">Tele-med</h3>
                        <div className="text-2xl font-black text-slate-800">12</div>
                        <p className="text-[9px] text-slate-400 mt-1">กำลังใช้งาน</p>
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
