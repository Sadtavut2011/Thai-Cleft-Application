import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    FileText, 
    Calendar, 
    Building, 
    Phone, 
    User, 
    CheckCircle, 
    XCircle,
    File,
    ChevronRight,
    ChevronDown,
    Info,
    Send,
    Clock,
    Pencil,
    Trash2,
    X,
    History,
    Ambulance,
    Users,
    Plus,
    Upload,
    Map,
    CreditCard,
    MapPin,
    Navigation,
    LayoutGrid,
    ArrowLeft,
    Home,
    Activity,
    Search,
    MessageCircle,
    List,
    Filter,
    Book,
    Briefcase,
    Video,
    TrendingUp,
    Smartphone,
    Building2,
    ChevronUp,
    Banknote
} from 'lucide-react';
import { HomeVisitSystem } from '../home-visit/HomeVisitSystem';
import ReferralDashboard from '../referral/ReferralDashboard';
import { TeleConsultationSystem } from '../tele-med/TeleConsultationSystem';
import { FundingSystem } from '../funding/FundingSystem';
import AppointmentDashboard from '../appointment/AppointmentDashboard';
import { PATIENTS_DATA, REFERRAL_DATA, HOME_VISIT_DATA, TELEMED_DATA } from '../../../../data/patientData';

// --- HELPER FUNCTIONS ---
const getUrgencyColor = (urgency: string) => {
    switch(urgency?.toLowerCase()) {
        case 'emergency': return 'text-red-600 bg-red-50 border-red-100';
        case 'urgent': return 'text-orange-600 bg-orange-50 border-orange-100';
        default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
};

const SystemsDashboard = ({ onNavigate, stats }: { onNavigate: (sys: string, params?: any) => void, stats: any }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAllTasks, setShowAllTasks] = useState(false);
  
  // Drag to scroll logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if(scrollRef.current) {
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeftState(scrollRef.current.scrollLeft);
    }
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if(scrollRef.current) {
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; 
        scrollRef.current.scrollLeft = scrollLeftState - walk;
    }
  };
  
  // DEMO DATE: 2025-12-04
  const TODAY = '2025-12-04'; 
  const displayDate = "พฤหัสบดี 4 ธ.ค. 68";

  // Reset showAllTasks when filter changes
  useEffect(() => {
      setShowAllTasks(false);
  }, [activeFilter]);

  // --- FILTER TASKS FOR TODAY ---
  const todaysTasks = useMemo(() => {
      const tasks: any[] = [];

      // 1. Appointments (Hospital Check-up)
      PATIENTS_DATA.forEach(p => {
          // Check if it is a pure appointment (not other types mixed in)
          const type = p.type || '';
          const isOtherType = ['Refer In', 'Refer Out', 'Home Visit', 'Joint Visit', 'Telemed', 'Routine'].includes(type);

          if (p.date === TODAY && !isOtherType) {
              tasks.push({
                  id: `appt-${p.id}`,
                  type: 'appointment',
                  time: p.time,
                  title: 'นัดหมายตรวจรักษา',
                  patient: p.name,
                  hn: p.hn,
                  detail: p.hospital ? `ที่ ${p.hospital}` : 'นัดหมายปกติ',
                  status: p.status,
                  raw: p
              });
          }
      });

      // 2. Tele-med (Tele-consult)
      TELEMED_DATA.forEach(t => {
          if (t.date === TODAY) {
              tasks.push({
                  id: `tele-${t.id}`,
                  type: 'tele',
                  time: t.time,
                  title: 'Tele-consultation',
                  patient: t.name,
                  hn: t.hn,
                  detail: t.channel === 'mobile' ? 'ผ่านมือถือ' : 'ผ่านโรงพยาบาล',
                  status: t.status,
                  raw: t
              });
          }
      });

      // 3. Home Visit (Joint Visit)
      HOME_VISIT_DATA.forEach(v => {
          if (v.date === TODAY && (v.type === 'Joint Visit' || v.type === 'Joint')) {
              tasks.push({
                  id: `visit-${v.id}`,
                  type: 'visit',
                  time: v.time,
                  title: 'เยี่ยมบ้านผู้ป่วย',
                  patient: v.name,
                  hn: v.hn,
                  detail: v.rph ? `พื้นที่: ${v.rph}` : 'ลงพื้นที่',
                  status: v.status,
                  raw: v
              });
          }
      });

      // 4. Referral (Receive - Inbound)
      // Focus on "Receive case where hospital scheduled transfer"
      REFERRAL_DATA.forEach(r => {
          // Check if acceptedDate matches TODAY for Refer In
          const acceptedDate = r.acceptedDate ? r.acceptedDate.split('T')[0] : '';
          
          // If type is Refer In and date matches (meaning arrival/transfer date)
          if (r.type === 'Refer In' && (r.date === TODAY || acceptedDate === TODAY)) {
               tasks.push({
                  id: `refer-${r.id}`,
                  type: 'referral',
                  time: r.time,
                  title: 'รับตัวผู้ป่วยส่งต่อ',
                  patient: r.patientName || r.name,
                  hn: r.patientHn || r.hn,
                  detail: `จาก: ${r.hospital}`,
                  status: r.status,
                  raw: r
              });
          }
      });

      return tasks.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }, []);

  const filteredTasks = todaysTasks.filter(task => activeFilter === 'all' || task.type === activeFilter);
  
  // Filter logic for My Tasks section
  const myTasks = todaysTasks.filter(task => 
      activeFilter === 'all' || activeFilter === task.type
  );

  const displayedTasks = showAllTasks ? myTasks : myTasks.slice(0, 3);
  const remainingCount = myTasks.length - displayedTasks.length;

  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
    {/* Summary Stats */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
      {/* 1. Home Visit */}
      <div 
        onClick={() => onNavigate('visit')}
        className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 relative flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-2">
           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Home className="w-4 h-4 md:w-5 md:h-5" />
           </div>
           <div className="bg-green-50 text-green-700 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
              <TrendingUp size={16}/> +12%
           </div>
        </div>
        <div>
           <h3 className="text-slate-500 md:text-xs font-medium truncate text-[16px]">ระบบเยี่ยมบ้าน</h3>
           <div className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">124</div>
           <p className="text-slate-400 md:text-[10px] mt-0.5 font-light truncate text-[14px]">ลงพื้นที่แล้วในเดือนนี้</p>
        </div>
      </div>

      {/* 2. Appointments */}
      <div 
        onClick={() => onNavigate('appointment')} // This is handled by parent to switch to calendar probably, or just pure info
        className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 relative flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-2">
           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" />
           </div>
           <div className="bg-green-50 text-green-700 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
              <TrendingUp size={16}/> {stats.appointments} นัด
           </div>
        </div>
        <div>
           <h3 className="text-slate-500 md:text-xs font-medium truncate text-[16px]">ระบบนัดหมาย</h3>
           <div className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">{stats.appointments}</div>
           <p className="text-slate-400 md:text-[10px] mt-0.5 font-light truncate text-[13px]">นัดหมายวันนี้</p>
        </div>
      </div>

      {/* 3. Fund Request */}
      <div 
        onClick={() => onNavigate('funding')}
        className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 relative flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-2">
           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-yellow-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
           </div>
        </div>
        <div>
           <h3 className="text-slate-500 md:text-xs font-medium truncate text-[16px]">ระบบขอทุน</h3>
           <div className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">89</div>
           <p className="text-slate-400 md:text-[10px] mt-0.5 font-light truncate text-[14px]">คำขอทั้งหมด</p>
        </div>
      </div>

      {/* 4. Tele-consult */}
      <div 
        onClick={() => onNavigate('teleconsult')}
        className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 relative flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex justify-between items-start mb-2">
           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-pink-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4 md:w-5 md:h-5" />
           </div>
           <div className="bg-green-50 text-green-700 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
              <TrendingUp size={16}/> +5%
           </div>
        </div>
        <div>
           <h3 className="text-slate-500 md:text-xs font-medium truncate text-[16px]">Tele-med</h3>
           <div className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">32</div>
           <p className="text-slate-400 md:text-[10px] mt-0.5 font-light truncate text-[14px]">ชั่วโมงปรึกษา</p>
        </div>
      </div>

      {/* 5. Referral */}
      <div 
        onClick={() => onNavigate('referral')}
        className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-slate-100 relative flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group col-span-2 md:col-span-1"
      >
        <div className="flex justify-between items-start mb-2">
           <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Ambulance className="w-4 h-4 md:w-5 md:h-5" />
           </div>
           <div className="bg-green-50 text-green-700 text-xs md:text-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
              <TrendingUp size={16}/> In {stats.inbound} / Out {stats.outbound}
           </div>
        </div>
        <div>
           <h3 className="text-slate-500 md:text-xs font-medium truncate text-[16px]">ระบบส่งตัว</h3>
           <div className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">{stats.referral}</div>
           <p className="text-slate-400 md:text-[10px] mt-0.5 font-light truncate text-[14px]">เคสส่งตัวเดือนนี้</p>
        </div>
      </div>
    </div>

    {/* System Navigation Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: My Tasks */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           <div className="flex flex-col gap-6">
               <div>
                   <div className="flex flex-col gap-3 mb-4">
                      <div className="flex justify-end w-full">
                         <div 
                             ref={scrollRef}
                             onMouseDown={handleMouseDown}
                             onMouseLeave={handleMouseLeave}
                             onMouseUp={handleMouseUp}
                             onMouseMove={handleMouseMove}
                             className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] cursor-grab active:cursor-grabbing select-none"
                         >
                                 <button onClick={() => setActiveFilter('all')} className={`px-3 py-1.5 rounded-full text-[16px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'all' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>ทั้งหมด ({todaysTasks.length})</button>
                                 <button onClick={() => setActiveFilter('visit')} className={`px-3 py-1.5 rounded-full text-[16px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'visit' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>เยี่ยมบ้าน</button>
                                 <button onClick={() => setActiveFilter('appointment')} className={`px-3 py-1.5 rounded-full text-[16px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'appointment' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>นัดหมาย</button>
                                 <button onClick={() => setActiveFilter('tele')} className={`px-3 py-1.5 rounded-full text-[16px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'tele' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Tele</button>
                                 <button onClick={() => setActiveFilter('referral')} className={`px-3 py-1.5 rounded-full text-[16px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'referral' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>รับตัว</button>
                           </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 text-[20px]">
                              <LayoutGrid className="text-blue-600" size={20} />
                              งานของฉันวันนี้
                          </h2>
                          <span className="text-sm text-gray-500 text-[16px]">{displayDate}</span>
                      </div>
                   </div>
                   <div className="space-y-3">
                      {displayedTasks.map(task => {
                          if (task.type === 'appointment') {
                              return (
                                  <div key={task.id} onClick={() => onNavigate('appointment')} className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors">
                                      <div className="flex flex-col gap-1">
                                          <span className="font-bold text-gray-800 text-[18px]">{task.title} ({task.time} น.)</span>
                                          <div className="flex items-start gap-2 text-sm text-gray-600">
                                              <User size={14} className="text-blue-500 mt-1" />
                                              <div className="flex flex-col">
                                                  <span className="font-medium text-[16px]">{task.patient}</span>
                                                  <span className="text-[14px] text-gray-500">HN: {task.hn}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          } else if (task.type === 'tele') {
                               return (
                                  <div key={task.id} onClick={() => onNavigate('teleconsult')} className="bg-pink-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-pink-100 transition-colors">
                                      <div className="flex flex-col gap-1">
                                          <span className="font-bold text-gray-800 text-[18px]">{task.title.replace('Tele-consultation', 'Tele-med')} ({task.time} น.)</span>
                                          <div className="flex items-start gap-2 text-sm text-gray-600">
                                              <User size={14} className="text-pink-500 mt-1" />
                                              <div className="flex flex-col">
                                                  <span className="font-medium text-[16px]">{task.patient}</span>
                                                  <span className="text-[14px] text-gray-500">HN: {task.hn}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          } else if (task.type === 'visit') {
                              return (
                                  <div key={task.id} onClick={() => onNavigate('visit')} className="bg-green-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-green-100 transition-colors">
                                      <div className="flex flex-col gap-1">
                                          <span className="font-bold text-gray-800 text-[18px]">{task.title} ({task.time} น.)</span>
                                          <div className="flex items-start gap-2 text-sm text-gray-600">
                                              <User size={14} className="text-green-500 mt-1" />
                                              <div className="flex flex-col">
                                                  <span className="font-medium text-[16px]">{task.patient}</span>
                                                  <span className="text-[14px] text-gray-500">HN: {task.hn}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          } else if (task.type === 'referral') {
                              return (
                                  <div key={task.id} onClick={() => onNavigate('referral')} className="bg-orange-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors">
                                      <div className="flex flex-col gap-1">
                                          <span className="font-bold text-gray-800 text-[18px]">{task.title} ({task.time} น.)</span>
                                          <div className="flex items-start gap-2 text-sm text-gray-600">
                                              <User size={14} className="text-orange-500 mt-1" />
                                              <div className="flex flex-col">
                                                  <span className="font-medium text-[16px]">{task.patient}</span>
                                                  <span className="text-[14px] text-gray-500">HN: {task.hn}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              );
                          }
                          return null;
                      })}
                      
                      {myTasks.length === 0 && (
                          <div className="text-center py-6 text-slate-400">
                               <p className="text-sm">ไม่มีงานที่ต้องทำในช่วงนี้</p>
                          </div>
                      )}
                      
                      {/* Show More Button */}
                      {(remainingCount > 0 || showAllTasks) && myTasks.length > 3 && (
                          <div className="flex justify-center pt-2">
                              <button 
                                onClick={() => setShowAllTasks(!showAllTasks)}
                                className="text-sm text-[#7066a9] font-medium hover:underline flex items-center gap-1 transition-colors"
                              >
                                  {showAllTasks ? (
                                      <>
                                          ย่อรายการ <ChevronUp size={14} />
                                      </>
                                  ) : (
                                      <>
                                          แสดงเพิ่มเติมอีก {remainingCount} รายการ <ChevronDown size={14} />
                                      </>
                                  )}
                              </button>
                          </div>
                      )}
                   </div>
               </div>

               <div>
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 text-[20px]">
                         <Briefcase className="text-[#7066a9]" size={20} />
                         งานที่อยู่ในการดูแล
                     </h2>
                  </div>
                  <div className="space-y-3">
                      {(activeFilter === 'all' || activeFilter === 'referral') && PATIENTS_DATA.flatMap(p => (p.funds || []).map((f: any, i: number) => ({
                          ...f,
                          patientName: p.name,
                          hn: p.hn,
                          id: `fund-${p.id}-${i}`
                      }))).filter(f => f.status === 'Pending' || f.status === 'pending').map(fund => (
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
                      
                      {(activeFilter === 'all' || activeFilter === 'referral') && PATIENTS_DATA.flatMap(p => (p.funds || []).map((f: any, i: number) => ({
                          ...f,
                          patientName: p.name,
                          hn: p.hn,
                          id: `fund-${p.id}-${i}`
                      }))).filter(f => f.status === 'Pending' || f.status === 'pending').length === 0 && (
                           <div className="text-center py-6 text-slate-400">
                               <p className="text-sm">ไม่มีงานที่อยู่ในการดูแล</p>
                           </div>
                      )}
                  </div>
               </div>
            </div>
        </div>

        {/* Right Column: Pending Referrals */}

    </div>
  </div>
  );
};

// --- MAIN COMPONENT ---
export default function CMWorkSystems({ 
  outgoingCases = [], 
  currentSystem: initialSystem = 'dashboard', 
  onRequestFund, 
  onRequestReferral, 
  onVisitFormStateChange, 
  initialHN, 
  onExitDetail,
  onNavigateToPatient
}: { 
  outgoingCases?: any[], 
  currentSystem?: string, 
  onRequestFund?: () => void, 
  onRequestReferral?: () => void, 
  onVisitFormStateChange?: (isOpen: boolean) => void, 
  initialHN?: string, 
  onExitDetail?: () => void,
  onNavigateToPatient?: (hn: string) => void
}) {
  const [currentSystem, setCurrentSystem] = useState(initialSystem);

  // Stats for Dashboard using Central Data
  const stats = useMemo(() => ({
      referral: REFERRAL_DATA.length,
      appointments: PATIENTS_DATA.filter(p => p.date === '2025-12-04').length,
      pending: REFERRAL_DATA.filter(r => (r.status === 'pending' || r.status === 'Pending')).length,
      inbound: REFERRAL_DATA.filter(r => r.type === 'Refer In').length,
      outbound: REFERRAL_DATA.filter(r => r.type === 'Refer Out').length
  }), []);

  // Effect to handle external navigation props
  React.useEffect(() => {
      if (initialHN) {
          setCurrentSystem('referral');
      }
  }, [initialHN]);

  // Wrapper for navigation that handles params if needed (e.g. auto-select patient in referral)
  // In a real app, this might pass props down. For now, we rely on initialHN prop pattern or Context.
  // But since we can't easily change the top-level Props from here without a callback, 
  // we'll assume the sub-components handle their own state or we pass `initialHN` if we could.
  // Note: The `ReferralDashboard` already takes `initialHN`. 
  // If we navigate internally, we might need a way to pass that state.
  
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
        <div className={`flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${(currentSystem === 'visit' || currentSystem === 'teleconsult' || currentSystem === 'referral' || currentSystem === 'funding' || currentSystem === 'appointment') ? 'p-0' : 'p-4 md:p-6'}`}>
            {currentSystem === 'dashboard' && (
                <SystemsDashboard onNavigate={handleNavigate} stats={stats} />
            )}
            
            {currentSystem === 'referral' && (
                <ReferralDashboard 
                    onBack={() => setCurrentSystem('dashboard')}
                    onRequestReferral={onRequestReferral}
                    initialHN={navParams.hn || initialHN}
                    onNavigateToPatient={onNavigateToPatient}
                    onExit={() => {
                        setNavParams({});
                        if (onExitDetail) onExitDetail();
                        else setCurrentSystem('dashboard');
                    }}
                />
            )}

            {currentSystem === 'funding' && (
                <FundingSystem 
                    onBack={() => setCurrentSystem('dashboard')} 
                    onRequestFund={onRequestFund}
                />
            )}

            {currentSystem === 'teleconsult' && (
                <TeleConsultationSystem onBack={() => setCurrentSystem('dashboard')} />
            )}

            {currentSystem === 'visit' && (
                <HomeVisitSystem 
                    onBack={() => setCurrentSystem('dashboard')} 
                    onVisitFormStateChange={onVisitFormStateChange}
                />
            )}
            
            {currentSystem === 'appointment' && (
                <AppointmentDashboard onBack={() => setCurrentSystem('dashboard')} />
            )}
        </div>
    </div>
  );
}