import React, { useState, useMemo } from 'react';
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
    ChevronUp
} from 'lucide-react';
import { PATIENTS_DATA, REFERRAL_DATA, HOME_VISIT_DATA, TELEMED_DATA } from '../../../../data/patientData';

import svgPaths from '../../../../imports/svg-lx78w36rmv';
import svgPathsArrow from '../../../../imports/svg-33c6748exo';
import svgPathsNew from '../../../../imports/svg-l4he4b92l4';
import svgPathsPending from '../../../../imports/svg-u3hdghfp1w';
import svgPathsCompleted from '../../../../imports/svg-6asdpbn8gk';
import svgPathsAppointments from '../../../../imports/svg-8pbfv8elow';
import imgImage from "figma:asset/bbbf046797e51a7b758177d9ed80ba440e116052.png";
import imgImage1 from "figma:asset/bcc7d4796b1918c63dfe93672706a89c7cf35586.png";
import imgImage2 from "figma:asset/66a4af6a00fb05488c9ce48aff64fe487b87e999.png";
import imgImage3 from "figma:asset/9e3371d1316d8628e293b6c06cc73e00d380840e.png";
import imgImage4 from "figma:asset/ccad3c8e4d346215fe550b9c982861424d34b65b.png";
import imgImage5 from "figma:asset/60e7294dfea18c421e91f502e0c0eeea64ea4756.png";
import patientImg from 'figma:asset/64070ab3d19658ffc6623b974bf9b3d26b92b736.png';
import exampleImage from 'figma:asset/fbf725a4050293e20174e56a39ec68ae1f8e5657.png';
import patientAvatar from 'figma:asset/9887b893a8033583d93c216a34e6bb7a45b3c485.png';
import glassBg from 'figma:asset/11cfd8ef6dfae6b8f0542cb8e9414f51ede74a0f.png';
import spiralBg from 'figma:asset/9884a1ebb87a4c3678759557c26eb1d65be780a3.png';
import triangleBg from 'figma:asset/d4fec6b9e93a49e7f83d3663ab0c9141cffb4696.png';
import wavyBg from 'figma:asset/b1a7b4a87f804eb40c10d3c662cab3fe40bd384f.png';
import { HomeVisitSystem } from '../../../../Role/cm/cm-mobile/home-visit/HomeVisitSystem';
import ReferralSystemNew from '../referral/ReferralDashboard';
import { TeleConsultationSystem } from '../tele-med/TeleConsultationSystem';

// Mock Components for missing files
const CreateFundRequestForm = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">ยื่นขอทุนใหม่</h3>
                <p className="mb-4 text-slate-500">แบบฟอร์มขอทุน (Mock)</p>
                <button onClick={onClose} className="w-full bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200">ปิด</button>
            </div>
        </div>
    );
};

const HomeVisitRequestCard = ({ data }: { data?: any }) => (
     <div className="bg-orange-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors">
        <div className="flex flex-col gap-1">
            <span className="font-bold text-gray-800">{data?.title || 'คำร้องขอเยี่ยมบ้านใหม่'}</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={14} className="text-orange-500" />
                <span>{data?.patientName || data?.name || 'ไม่ระบุชื่อ'} (HN: {data?.hn || '-'})</span>
            </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-sm">
            <ChevronRight size={18} />
        </div>
    </div>
);

// --- MOCK DATA ---
const INITIAL_FUNDS = [
  { id: 'FUND-001', patient: 'นางมาลี สีสวย', amount: 5000, reason: 'ค่าเดินทางฟอกไต', status: 'approved', date: '2023-10-20' },
  { id: 'FUND-002', patient: 'นายดำรง คงมั่น', amount: 2500, reason: 'อุปกรณ์ทำแผลกดทับ', status: 'pending', date: '2023-10-26' },
];

const MAP_PATIENTS = [
  { id: 1, name: 'ผู้ป่วยติดเตียง A', lat: 20, lng: 30, status: 'urgent', address: '123 ม.1 ต.สุเทพ' },
  { id: 2, name: 'ผู้ป่วยโรคเรื้อรัง B', lat: 50, lng: 60, status: 'normal', address: '45/2 ม.3 ต.แม่เหียะ' },
  { id: 3, name: 'ผู้ป่วยหลังผ่าตัด C', lat: 70, lng: 20, status: 'visited', address: '88 ม.5 ต.ป่าแดด' },
];

// --- SHARED COMPONENTS ---

const Badge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'รอการตอบรับ': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    'ยอมรับการส่งตัว': 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    'ปฏิเสธการส่งตัว': 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-red-100 text-red-800 border-red-200',
    'เร่งด่วน': 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    low: 'bg-green-100 text-green-800 border-green-200',
    urgent: 'bg-red-500 text-white',
    normal: 'bg-blue-500 text-white',
    visited: 'bg-gray-400 text-white',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    'ขอส่งตัว': 'bg-blue-50 text-blue-600 border-blue-200',
    referred: 'bg-blue-50 text-blue-600 border-blue-200',
    inbound: 'bg-blue-100 text-blue-800 border-blue-200',
    outbound: 'bg-purple-100 text-purple-800 border-purple-200'
  };
  
  const labels: Record<string, string> = {
    pending: 'รออนุมัติ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ปฏิเสธ',
    high: 'วิกฤต',
    medium: 'ปานกลาง',
    low: 'ทั่วไป',
    urgent: 'เร่งด่วน',
    normal: 'ทั่วไป',
    visited: 'เยี่ยมแล้ว',
    'รอการตอบรับ': 'รอการตอบรับ',
    'ยอมรับการส่งตัว': 'ยอมรับการส่งตัว',
    'ปฏิเสธการส่งตัว': 'ปฏิเสธการส่งตัว',
    'ขอส่งตัว': 'ขอส่งตัว',
    inbound: 'รับเข้า',
    outbound: 'ส่งออก'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || 'bg-gray-100'} whitespace-nowrap`}>
      {labels[status] || status}
    </span>
  );
};

const SystemCard = ({ icon: Icon, title, description, colorClass, onClick, decorationColor }: any) => (
  <button 
    onClick={onClick}
    className="group relative bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 text-left flex flex-col h-full overflow-hidden"
  >
    {/* Large Decoration Circle */}
    <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10 pointer-events-none ${decorationColor || 'bg-slate-100'}`}></div>

    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10 ${colorClass.replace('text-', 'bg-').replace(/[0-9]+/, '100')} ${colorClass}`}>
      <Icon size={28} />
    </div>
    <h3 className={`text-xl font-bold mb-2 relative z-10 ${title === 'ระบบเยี่ยมบ้าน' ? 'text-blue-600' : 'text-slate-800'}`}>{title}</h3>
    <p className="text-sm text-slate-500 mb-6 relative z-10 leading-relaxed max-w-[85%]">{description}</p>
    <div className="mt-auto flex items-center text-sm font-bold text-blue-600 relative z-10">
      เข้าสู่ระบบ <ChevronRight size={16} className="ml-1" />
    </div>
  </button>
);

// --- SUB-SYSTEMS ---

// 2. Funding System
const FundingSystem = () => {
  const [funds] = useState(INITIAL_FUNDS);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Status & History */}
      <div className="order-2 lg:order-2 lg:col-span-2 space-y-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-bold text-lg mb-4 text-slate-800">สถานะล่าสุด</h3>
           {funds.filter(f => f.status === 'pending').map(fund => (
             <div key={fund.id} className="border rounded-lg p-4 mb-3 relative overflow-hidden hover:shadow-sm transition-all">
               <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
               <div className="flex justify-between items-start">
                   <div>
                       <h4 className="font-bold text-slate-800">{fund.patient}</h4>
                       <p className="text-sm text-slate-500 line-clamp-1">{fund.reason}</p>
                       <p className="text-sm font-medium text-slate-700 mt-1">{fund.amount.toLocaleString()} บาท</p>
                   </div>
                   <Badge status={fund.status} />
               </div>
             </div>
           ))}
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4 text-slate-800">ปะวัติ (History)</h3>
          <div className="space-y-3">
            {funds.filter(f => f.status !== 'pending').map(fund => (
              <div key={fund.id} className="flex items-center justify-between p-3 border-b last:border-0 md:border-0 md:hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${fund.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {fund.status === 'approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">{fund.patient}</p>
                        <p className="text-xs text-slate-500">{fund.date}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{fund.amount.toLocaleString()} ฿</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Funding Form Sidebar */}
      <div className="order-1 lg:order-1 lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
        <div className="mb-6">
            <h3 className="font-bold text-2xl text-slate-800 mb-1">จัดการขอทุน</h3>
            <p className="text-slate-500 font-medium text-sm">Funding Management System</p>
        </div>
        <button 
            onClick={() => setShowForm(true)}
            className="w-full bg-blue-600 text-white h-[50px] rounded-xl hover:bg-blue-700 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
        >
            <Plus size={24} />
            ยื่นขอทุนใหม่
        </button>
      </div>

      {/* Search Modal */}
      <CreateFundRequestForm 
        open={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </div>
  );
};

// --- DASHBOARD HOME ---
const SystemsDashboard = ({ onNavigate, stats }: any) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // DEMO DATE for Logic matches CM Dashboard
  const TODAY = '2025-12-04';

  const todaysTasks = useMemo(() => {
      const tasks: any[] = [];
      
      // 1. Visit
      HOME_VISIT_DATA.forEach(v => {
          if (v.date === TODAY) {
             tasks.push({ ...v, type: 'visit', title: 'คำร้องขอเยี่ยมบ้านใหม่' });
          }
      });
      
      // 2. Appointment
      PATIENTS_DATA.forEach(p => {
         if (p.date === TODAY && p.type !== 'Telemed') {
             tasks.push({ 
                 ...p, 
                 type: 'appointment', 
                 title: `นัดหมายผู้ป่วย (${p.time || '09:00'} น.)`,
                 patientName: p.name
             });
         }
      });
      
      // 3. Tele
      TELEMED_DATA.forEach(t => {
         if (t.date === TODAY) {
             tasks.push({ 
                 ...t, 
                 type: 'tele', 
                 title: `Tele-consultation (${t.time || '10:00'} น.)`,
                 patientName: t.patientName || t.name
             });
         }
      });

      // 4. Referral
      REFERRAL_DATA.forEach(r => {
         if (r.date === TODAY) {
             tasks.push({ 
                 ...r, 
                 type: 'referral', 
                 title: 'ส่งตัวผู้ป่วย',
                 patientName: r.patientName
             });
         }
      });
      
      return tasks;
  }, []);

  const filteredTasks = activeFilter === 'all' ? todaysTasks : todaysTasks.filter(t => t.type === activeFilter);

  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
    {/* System Navigation Cards */}
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <LayoutGrid size={20} className="text-blue-600"/>
        เลือกระบบงาน
      </h3>
      <div className="flex flex-col gap-6">
        {/* Quick Menu */}
        <div>
           <div 
              className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => {
                  const slider = e.currentTarget;
                  let isDown = true;
                  const startX = e.pageX;
                  const scrollLeft = slider.scrollLeft;
                  let hasMoved = false;
                  
                  const onMouseMove = (e: any) => {
                      if (!isDown) return;
                      e.preventDefault();
                      const x = e.pageX;
                      const walk = (x - startX) * 2;
                      if (Math.abs(walk) > 5) hasMoved = true;
                      slider.scrollLeft = scrollLeft - walk;
                  };
                  
                  const onMouseUp = () => {
                      isDown = false;
                      slider.removeEventListener('mousemove', onMouseMove);
                      slider.removeEventListener('mouseup', onMouseUp);
                      slider.removeEventListener('mouseleave', onMouseUp);
                      
                      if (hasMoved) {
                          const preventClick = (e: any) => {
                              e.preventDefault();
                              e.stopPropagation();
                              slider.removeEventListener('click', preventClick, true);
                          };
                          slider.addEventListener('click', preventClick, true);
                          setTimeout(() => slider.removeEventListener('click', preventClick, true), 50);
                      }
                  };
                  
                  slider.addEventListener('mousemove', onMouseMove);
                  slider.addEventListener('mouseup', onMouseUp);
                  slider.addEventListener('mouseleave', onMouseUp);
              }}
           >
              <div onClick={() => onNavigate('visit')} className="min-w-[110px] h-[110px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                     <Home size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">เยี่ยมบ้าน</span>
              </div>
              
              <div onClick={() => onNavigate('teleconsult')} className="min-w-[110px] h-[110px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-[#F6339A]/10 flex items-center justify-center text-[#F6339A]">
                     <Video size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Tele-med</span>
              </div>

              <div onClick={() => onNavigate('referral')} className="min-w-[110px] h-[110px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                     <Ambulance size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">ส่งตัว</span>
              </div>

              <div onClick={() => onNavigate('appointment')} className="min-w-[110px] h-[110px] bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-[#2B7FFF]/10 flex items-center justify-center text-[#2B7FFF]">
                     <Calendar size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">นัดหมาย</span>
              </div>
           </div>
        </div>

        {/* My Tasks Today */}
        <div>
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <LayoutGrid className="text-blue-600" size={20} />
                  งานของฉันวันนี้
              </h2>
              <span className="text-sm text-gray-500 text-[16px]">พฤหัสบดี 4 ธ.ค. 68</span>
           </div>
           
           <div 
              className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => {
                  const slider = e.currentTarget;
                  let isDown = true;
                  const startX = e.pageX;
                  const scrollLeft = slider.scrollLeft;
                  let hasMoved = false;
                  
                  const onMouseMove = (e: any) => {
                      if (!isDown) return;
                      e.preventDefault();
                      const x = e.pageX;
                      const walk = (x - startX) * 2;
                      if (Math.abs(walk) > 5) hasMoved = true;
                      slider.scrollLeft = scrollLeft - walk;
                  };
                  
                  const onMouseUp = () => {
                      isDown = false;
                      slider.removeEventListener('mousemove', onMouseMove);
                      slider.removeEventListener('mouseup', onMouseUp);
                      slider.removeEventListener('mouseleave', onMouseUp);
                      
                      if (hasMoved) {
                          const preventClick = (e: any) => {
                              e.preventDefault();
                              e.stopPropagation();
                              slider.removeEventListener('click', preventClick, true);
                          };
                          slider.addEventListener('click', preventClick, true);
                          setTimeout(() => slider.removeEventListener('click', preventClick, true), 50);
                      }
                  };
                  
                  slider.addEventListener('mousemove', onMouseMove);
                  slider.addEventListener('mouseup', onMouseUp);
                  slider.addEventListener('mouseleave', onMouseUp);
              }}
           >
                 <button onClick={() => setActiveFilter('all')} className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'all' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>ทั้งหมด ({todaysTasks.length})</button>
                 <button onClick={() => setActiveFilter('visit')} className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'visit' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>เยี่ยมบ้าน</button>
                 <button onClick={() => setActiveFilter('appointment')} className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'appointment' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>นัดหมาย</button>
                 <button onClick={() => setActiveFilter('tele')} className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'tele' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Tele</button>
                 <button onClick={() => setActiveFilter('referral')} className={`px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'referral' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>ส่งตัว</button>
           </div>

           <div className="space-y-3">
              {filteredTasks.length > 0 ? filteredTasks.map(task => {
                if (task.type === 'visit') {
                    return (
                        <div key={task.id} className="bg-green-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-green-100 transition-colors mb-3">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-gray-800">{task.title} ({task.time || '10:00'} น.)</span>
                                <div className="flex items-start gap-2 text-sm text-gray-600">
                                    <User size={14} className="text-green-500 mt-1" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{task.patientName}</span>
                                        <span className="text-[11px] text-gray-500">HN: {task.hn}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    );
                }
                if (task.type === 'appointment') return (
                    <div key={task.id} className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors mb-3">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-800">{task.title}</span>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                <User size={14} className="text-blue-500 mt-1" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{task.patientName}</span>
                                    <span className="text-[11px] text-gray-500">HN: {task.hn}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                );
                if (task.type === 'tele') return (
                    <div key={task.id} className="bg-pink-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-pink-100 transition-colors mb-3">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-800">{task.title.replace('Tele-consultation', 'Tele-med')}</span>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                <User size={14} className="text-pink-500 mt-1" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{task.patientName}</span>
                                    <span className="text-[11px] text-gray-500">HN: {task.hn}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-sm">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                );
                 if (task.type === 'referral') return (
                    <div key={task.id} className="bg-orange-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors mb-3">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-gray-800">{task.title}</span>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                <Ambulance size={14} className="text-orange-500 mt-1" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{task.patientName}</span>
                                    <span className="text-[11px] text-gray-500">HN: {task.hn}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-sm">
                            <ChevronRight size={18} />
                        </div>
                    </div>
                );
                return null;
              }) : (
                <div className="text-center py-8 text-gray-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    ไม่มีงานในหมวดหมู่นี้
                </div>
              )}
           </div>

           {/* Tomorrow Section */}
           <div className="mt-8 pt-6 border-t border-gray-100">
               <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={24} className="text-[#7066A9]" />
                  <h2 className="text-xl font-bold text-slate-800">
                      งานที่อยู่ในการดูแล
                  </h2>
               </div>
               <div className="space-y-3 opacity-90">
                  <div className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors">
                      <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-800">นัดหมายผู้ป่วย (09:00 น.)</span>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                              <User size={14} className="text-blue-500 mt-1" />
                              <div className="flex flex-col">
                                  <span className="font-medium">คุณวิชัย ใจดี</span>
                                  <span className="text-[11px] text-gray-500">HN: 66011223</span>
                              </div>
                          </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
                          <ChevronRight size={18} />
                      </div>
                  </div>
               </div>
           </div>
        </div>

      </div>
    </div>
  </div>
  );
};

// --- MAIN COMPONENT ---
export default function PCUWorkSystems({ 
    outgoingCases = [], 
    currentSystem: propSystem, 
    setCurrentSystem: propSetSystem,
    initialHN,
    onExitDetail
}: { 
    outgoingCases?: any[], 
    currentSystem?: string, 
    setCurrentSystem?: (val: string) => void,
    initialHN?: string,
    onExitDetail?: () => void
}) {
  // Use internal state if parent doesn't control fully
  const [internalSystem, setInternalSystem] = useState(propSystem || 'dashboard');

  const currentSystem = propSystem !== undefined ? propSystem : internalSystem;
  const setCurrentSystem = propSetSystem || setInternalSystem;

  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1: Search, 2: Form
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const mockPatients = PATIENTS_DATA.map((p, i) => ({
      id: i + 1,
      name: p.name,
      hn: p.hn || p.id || '-',
      age: p.age || '-',
      img: p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=7367f0&color=fff`,
  }));

  const filteredPatients = mockPatients.filter(p => 
    searchTerm && (p.name.includes(searchTerm) || p.hn.includes(searchTerm))
  );
  
  // Modals
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptDate, setAcceptDate] = useState('');
  const [acceptNote, setAcceptNote] = useState('');

  // Referral Data State
  const [incomingCases, setIncomingCases] = useState<any[]>([
    {
        id: 1,
        name: 'นางสาว มุ่งมั่น ทำดี',
        hn: '66012346',
        date: '4 ธันวาคม 2568',
        age: '20 ปี',
        hospital: 'รพ.สต.บ้านทุ่ง',
        diagnosis: 'กระดูกหักแขนขวา (Fracture of right arm)',
        reason: 'ขอส่งตัวเพื่อรับการผ่าตัดจัดกระดูก ต้องการผู้เชี่ยวชาญด้านกระดูก',
        doctor: 'นพ. สมชาย ใจดี',
        contact: '082-333-4444',
        urgency: 'เร่งด่วน',
        status: 'รอการตอบรับ',
        type: 'inbound',
        files: ['ใบส่งตัว.pdf', 'ผลเอกซเรย์.jpg', 'ประวัติการรักษา.pdf'],
        history: []
    }
  ]);

  // Merge for display
  const allReferrals = [
      ...incomingCases.map(c => ({ ...c, type: 'inbound', patient: c.name })),
      ...outgoingCases.map(c => ({ ...c, type: 'outbound', patient: c.name, urgency: c.urgency || 'ปกติ' }))
  ];

  // Stats for Dashboard
  const stats = {
      all: allReferrals.length,
      pending: allReferrals.filter(r => r.status === 'pending' || r.status === 'รอการตอบรับ').length,
      inbound: allReferrals.filter(r => r.type === 'inbound').length,
      outbound: allReferrals.filter(r => r.type === 'outbound').length,
      homeVisitAccepted: MAP_PATIENTS.filter(p => p.status === 'visited' || p.status === 'normal' || p.status === 'urgent').length // Counting all as accepted for demo
  };

  // Handlers
  const handleRejectClick = (patient: any) => {
    setSelectedCase(patient);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedCase) return;
    const timestamp = new Date().toLocaleString('th-TH');
    setIncomingCases(prev => prev.map(p => {
        if (p.id === selectedCase.id) {
            return {
                ...p,
                status: 'ปฏิเสธการส่งตัว',
                actionNote: rejectReason,
                actionDate: timestamp,
                history: [...(p.history || []), { action: 'ปฏิเสธการส่งตัว', note: rejectReason, timestamp: timestamp, by: 'เจ้าหน้าที่' }]
            };
        }
        return p;
    }));
    setIsRejectModalOpen(false);
    setSelectedCase(null);
  };

  const handleAcceptClick = (patient: any) => {
    setSelectedCase(patient);
    setAcceptDate('');
    setAcceptNote('');
    setIsAcceptModalOpen(true);
  };

  const handleConfirmAccept = () => {
    if (!selectedCase) return;
    const timestamp = new Date().toLocaleString('th-TH');
    setIncomingCases(prev => prev.map(p => {
        if (p.id === selectedCase.id) {
            return {
                ...p,
                status: 'ยอมรับการส่งตัว',
                appointmentDate: acceptDate,
                actionNote: acceptNote,
                actionDate: timestamp,
                history: [...(p.history || []), { action: 'ยอมรับการส่งตัว', note: `นัดหมาย: ${acceptDate}`, timestamp: timestamp, by: 'เจ้าหน้าที่' }]
            };
        }
        return p;
    }));
    setIsAcceptModalOpen(false);
    setSelectedCase(null);
  };

  // Title Helper
  const getTitle = () => {
      switch(currentSystem) {
          case 'dashboard': return 'ภาพรวมระบบงาน';
          case 'referral': return 'ระบบส่งตัวผู้ป่วย';
          case 'funding': return 'ระบบขอทุนสงเคราะห์';
          case 'teleconsult': return 'ระบบ Tele-consult';
          case 'visit': return 'ระบบเยี่ยมบ้าน';
          default: return '';
      }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
        {/* Inner Header for Navigation (if not on dashboard) */}


        {/* Content Area */}
        <div className="relative flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {currentSystem === 'dashboard' && (
                <div className="p-4 md:p-6">
                    <SystemsDashboard onNavigate={setCurrentSystem} stats={stats} />
                </div>
            )}
            
            {currentSystem === 'referral' && (
                <ReferralSystemNew 
                    onBack={() => setCurrentSystem('dashboard')}
                />
            )}

            {currentSystem === 'funding' && (
                <div className="p-4 md:p-6">
                    <FundingSystem />
                </div>
            )}

            {currentSystem === 'teleconsult' && (
                <TeleConsultationSystem onBack={() => setCurrentSystem('dashboard')} />
            )}

            {currentSystem === 'visit' && (
                <HomeVisitSystem onBack={() => setCurrentSystem('dashboard')} role="pcu" />
            )}

            {currentSystem === 'learning' && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 md:p-6">
                    <Book size={64} className="mb-4 opacity-20" />
                    <h3 className="text-xl font-bold text-slate-600">ระบบสื่อการเรียนรู้</h3>
                    <p className="text-slate-500 mt-2">กำลังอยู่ในระหว่างการพัฒนา</p>
                </div>
            )}
        </div>

        {/* --- MODALS (Global for Referral System) --- */}
        
        {/* Reject Modal */}
        {isRejectModalOpen && (
            <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-8 duration-300">
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <button onClick={() => setIsRejectModalOpen(false)} className="p-1 -ml-1 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h3 className="font-bold text-slate-800 text-lg flex-1">ปฏิเสธการส่งตัว</h3>
                </div>
                <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <textarea className="w-full p-3 border rounded-lg h-32 resize-none outline-none focus:ring-2 focus:ring-red-200" placeholder="ระบุเหตุผล..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} autoFocus />
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-slate-50">ยกเลิก</button>
                            <button onClick={handleConfirmReject} className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">ยืนยัน</button>
                        </div>
                    </div>
            </div>
        )}

        {/* Accept Modal */}
        {isAcceptModalOpen && (
            <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-8 duration-300">
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <button onClick={() => setIsAcceptModalOpen(false)} className="p-1 -ml-1 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h3 className="font-bold text-slate-800 text-lg flex-1">ตอบรับการส่งตัว</h3>
                </div>
                <div className="p-6 flex-1 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div><label className="text-sm font-medium mb-1 block">วันนัดหมาย</label><input type="date" className="w-full p-2 border rounded-lg" value={acceptDate} onChange={(e) => setAcceptDate(e.target.value)} /></div>
                        <div><label className="text-sm font-medium mb-1 block">หมายเหตุ</label><textarea className="w-full p-2 border rounded-lg h-24 resize-none" value={acceptNote} onChange={(e) => setAcceptNote(e.target.value)} /></div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsAcceptModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-slate-50">ยกเลิก</button>
                            <button onClick={handleConfirmAccept} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">ยืนยัน</button>
                        </div>
                    </div>
            </div>
        )}

        {/* New Referral Modal / Page */}
        {showForm && (
            <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-8 duration-300">
                {/* 1. Header & Navigation */}
                <div className="bg-[#7c3aed] pt-safe-top">
                    <div className="px-4 py-3 flex items-center justify-between text-white">
                         <button onClick={() => setShowForm(false)} className="p-1 -ml-1 hover:bg-white/20 rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h3 className="font-bold text-lg flex-1 text-center pr-8">สร้างคำขอส่งตัว (Create Referral)</h3>
                    </div>
                    
                    {/* Stepper */}
                    <div className="px-8 pb-6 flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[1px] bg-white/30 z-0" />
                        
                        {/* Step 1 */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white text-[#7c3aed] flex items-center justify-center font-bold text-sm shadow-md">1</div>
                        </div>
                        {/* Step 2 */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#7c3aed] border border-white/40 text-white flex items-center justify-center font-bold text-sm">2</div>
                        </div>
                        {/* Step 3 */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#7c3aed] border border-white/40 text-white flex items-center justify-center font-bold text-sm">3</div>
                        </div>
                    </div>
                    
                    <div className="px-4 pb-3 text-center text-white/80 text-xs">
                        กรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการพิจารณา
                    </div>
                </div>

                {/* 2. Content Layout */}
                <div className="flex-1 overflow-y-auto bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="p-5 space-y-6 pb-32">
                        {/* Section Title */}
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-[#7c3aed] rounded-full" />
                            <h4 className="text-lg font-bold text-slate-800">A. ข้อมูลผู้ป่วยและการรักษา</h4>
                        </div>

                        {/* Search Patient */}
                        <div className="space-y-2 relative">
                            <label className="text-sm font-medium text-slate-700">
                                ค้นหาผู้ป่วย <span className="text-red-500">*</span>
                            </label>
                            <div className="relative z-20">
                                <Search size={20} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
                                <input 
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all"
                                    placeholder="พิมพ์ชื่อ หรือ HN เพื่อค้นา..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {/* Search Results Dropdown */}
                            {searchTerm && !selectedPatient && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-30 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                    {filteredPatients.map(patient => (
                                        <div key={patient.id} onClick={() => { setSelectedPatient(patient); setSearchTerm(patient.name); }} className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                                                {patient.img ? <img src={patient.img} className="w-full h-full object-cover" alt={patient.name}/> : <User size={14}/>}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">{patient.name}</div>
                                                <div className="text-xs text-slate-500">HN: {patient.hn}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredPatients.length === 0 && <div className="p-4 text-center text-slate-400 text-sm">ไม่พบข้อมูล</div>}
                                </div>
                            )}
                            <p className="text-xs text-slate-400">ระบบจะดึงข้อมูลประวัติการรักษาล่าสุดอัตโนมัติ</p>
                        </div>

                        {/* HN and Urgency */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">HN</label>
                                <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 h-[50px] flex items-center">
                                    {selectedPatient?.hn || 'HN'}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">ความเร่งด่วน</label>
                                <div className="relative">
                                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] h-[50px]">
                                        <option>Routine (ปกติ)</option>
                                        <option>Urgent (ด่วน)</option>
                                        <option>Emergency (ฉุกเฉิน)</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-[17px] text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Diagnosis */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">การวินิจฉัย (Diagnosis)</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]"
                                placeholder="ระบุการวินิจฉัยโรค..."
                            />
                        </div>

                        {/* Reason */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">เหตุผลการส่งตัว / รายละเอียดการรักษา</label>
                            <textarea 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] h-32 resize-none"
                                placeholder="อธิบายรายละเอียดอาการ และเหตุผลที่ต้องส่งต่อ..."
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 pb-safe shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center gap-4 z-20">
                    <button onClick={() => setShowForm(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                        ยกเลิก
                    </button>
                    <button onClick={() => setFormStep(2)} className="flex-1 py-3 bg-[#7c3aed] text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-[#6d28d9] transition-all flex items-center justify-center gap-2">
                        ถัดไป <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}