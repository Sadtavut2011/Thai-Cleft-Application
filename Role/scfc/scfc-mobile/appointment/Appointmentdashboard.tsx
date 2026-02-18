import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Clock, 
  Video,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Building2,
  ChevronDown,
  ArrowRight,
  AlertCircle,
  PieChart as PieChartIcon,
  Users,
  ChevronRight,
  ChevronLeft,
  XCircle,
  TrendingUp,
  Activity,
  Stethoscope,
  Eye,
  ClipboardList
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Input } from "../../../../components/ui/input";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip as RechartsTooltip, AreaChart, Area, CartesianGrid, YAxis } from 'recharts';
import { AppointmentList } from "./AppointmentList";
import { AppointmentDetail } from "../../../cm/cm-mobile/patient/History/AppointmentDetail";
import { PatientDetailView } from "../../../cm/cm-mobile/patient/detail/PatientDetailView";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";
import { PATIENTS_DATA, getPatientByHn } from "../../../../data/patientData";
import { useDragScroll } from "../components/useDragScroll";
import { toast } from "sonner@2.0.3";

// Drilldown imports
import { AptDrilldownView, buildFlatAppointments, FlatAppointment } from './DrillDown/shared';
import { PeakHoursDrilldown } from './DrillDown/PeakHoursDrilldown';
import { TreatmentDrilldown } from './DrillDown/TreatmentDrilldown';

// ===== นัดหมาย = โทนม่วง SCFC =====
// Primary:   #49358E (dark), #7066A9 (medium), #37286A (darker)
// Light:     #E3E0F0, #D2CEE7, #F4F0FF (lightest)

// ═══ Patient History Wrapper for SCFC (same pattern as FundSystem) ═══
function PatientHistoryWrapper({ patient, onBack }: { patient: any; onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-[50001] bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300">
      <style>{`
        .fixed.bottom-0.left-0.w-full.bg-white.z-50 { z-index: 50002 !important; }
      `}</style>
      <div className="bg-[#7066a9] shrink-0">
        <StatusBarIPhone16Main />
      </div>
      <PatientDetailView
        patient={patient}
        onBack={onBack}
        onEdit={() => {}}
        userRole="scfc"
      />
    </div>
  );
}

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
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  isOverdue: boolean;
  hasConflict: boolean;
  needsIntervention: boolean;
  riskLevel: 'สูง' | 'กลาง' | 'ต่ำ';
}

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

const TREATMENT_MAP: Record<string, string> = {
  'ผ่าตัด': 'ศัลยกรรม', 'ติดตามอาการ': 'อายุรกรรม', 'ฝึกพูด': 'แก้ไขการพูด',
  'ตรวจรักษา': 'ตรวจรักษาทั่วไป', 'นัดหมายตรวจรักษา': 'ตรวจรักษาทั่วไป',
  'ตรวจประเมิน': 'จิตเวช/พัฒนาการ', 'นัดผ่าตัด': 'ศัลยกรรม',
  'ศัลยกรรม': 'ศัลยกรรม', 'อายุรกรรม': 'อายุรกรรม',
};

// Derive appointment data from shared PATIENTS_DATA
const APPOINTMENT_DATA: Appointment[] = PATIENTS_DATA.flatMap((p) => {
  return (p.appointmentHistory || []).map((a: any, idx: number) => {
    const rawStatus = (a.status || '').toLowerCase();
    let status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' = 'Pending';
    if (['confirmed', 'checked-in', 'ยืนยัน', 'ยืนยันแล้ว', 'มาตามนัด'].includes(rawStatus)) status = 'Confirmed';
    else if (['completed', 'done', 'เสร็จสิ้น'].includes(rawStatus)) status = 'Completed';
    else if (['cancelled', 'ยกเลิก', 'missed', 'ขาดนัด'].includes(rawStatus)) status = 'Cancelled';

    const apptDate = new Date(a.date || '2026-01-21');
    const isOverdue = status === 'Pending' && apptDate < new Date();

    return {
      id: `APT-${p.hn}-${idx}`,
      patientName: p.name,
      hn: p.hn,
      hospital: p.hospital || a.location || '-',
      province: p.province || 'เชียงใหม่',
      clinic: a.title || a.clinic || a.detail || '-',
      date: a.date || '2026-01-21',
      time: a.time || '09:00',
      type: a.title || a.type || 'มาตรวจที่ รพ.',
      status,
      isOverdue,
      hasConflict: false,
      needsIntervention: isOverdue || status === 'Cancelled',
      riskLevel: (status === 'Cancelled' ? 'สูง' : isOverdue ? 'กลาง' : 'ต่ำ') as 'สูง' | 'กลาง' | 'ต่ำ',
    };
  });
});

// --- Main Component ---

export function AppointmentSystem({ onBack }: { onBack?: () => void }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail'>('dashboard');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Drilldown state
  const [drilldown, setDrilldown] = useState<AptDrilldownView>(null);
  const flatAppointments = useMemo(() => buildFlatAppointments(), []);

  // Patient history view for SCFC
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const [historyPatient, setHistoryPatient] = useState<any>(null);

  // useDragScroll: ลาก/เลื่อนทั้ง mouse + touch
  const statsDrag = useDragScroll();
  const chartsDrag = useDragScroll();

  useEffect(() => { setIsMounted(true); }, []);

  const filteredData = useMemo(() => APPOINTMENT_DATA.filter(item => {
     const term = searchQuery.toLowerCase().trim();
     const matchesSearch = !term || item.patientName.toLowerCase().includes(term) || item.hn.toLowerCase().includes(term);
     const matchesProvince = selectedProvince === 'All' || item.province === selectedProvince;
     const matchesHospital = selectedHospital === 'All' || item.hospital === selectedHospital;
     return matchesSearch && matchesProvince && matchesHospital;
  }), [searchQuery, selectedProvince, selectedHospital]);

  const stats = useMemo(() => ({
    total: filteredData.length,
    pending: filteredData.filter(a => a.status === 'Pending').length,
    confirmed: filteredData.filter(a => a.status === 'Confirmed').length,
    completed: filteredData.filter(a => a.status === 'Completed').length,
    cancelled: filteredData.filter(a => a.status === 'Cancelled').length,
  }), [filteredData]);

  const PIE_DATA = [
    { name: 'รอตรวจ', value: stats.pending, color: '#f59e0b' },
    { name: 'ยืนยันแล้ว', value: stats.confirmed, color: '#49358E' },
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'ยกเลิก', value: stats.cancelled, color: '#ef4444' },
  ];

  // Peak Booking Hours (filtered)
  const peakHoursData = useMemo(() => {
    const hourSlots = Array.from({ length: 12 }, (_, i) => ({
      hour: `${String(i + 7).padStart(2, '0')}:00`,
      count: 0,
    }));
    filteredData.forEach((a) => {
      const t = (a.time || '').trim();
      const hourMatch = t.match(/^(\d{1,2})/);
      if (hourMatch) {
        const h = parseInt(hourMatch[1], 10);
        if (h >= 7 && h <= 18) hourSlots[h - 7].count++;
      }
    });
    if (hourSlots.every(s => s.count === 0)) {
      const mock = [3, 8, 12, 10, 6, 4, 5, 7, 9, 5, 3, 2];
      hourSlots.forEach((s, i) => { s.count = mock[i]; });
    }
    return hourSlots;
  }, [filteredData]);

  const peakHour = useMemo(() => {
    return peakHoursData.reduce((max, h) => h.count > max.count ? h : max, peakHoursData[0]);
  }, [peakHoursData]);

  // Treatment Plan Data — derived from PATIENTS_DATA.timeline, filtered by province/hospital
  const treatmentPlanData = useMemo(() => {
    const filteredPatients = PATIENTS_DATA.filter((p: any) => {
      const matchesProvince = selectedProvince === 'All' || p.province === selectedProvince;
      const matchesHospital = selectedHospital === 'All' || p.hospital === selectedHospital;
      return matchesProvince && matchesHospital;
    });

    const map = new Map<string, { name: string; total: number; completed: number; upcoming: number; overdue: number }>();
    filteredPatients.forEach((p: any) => {
      (p.timeline || []).forEach((t: any) => {
        const stage = t.stage || 'ไม่ระบุ';
        const existing = map.get(stage);
        const st = (t.status || '').toLowerCase();
        const isCompleted = st === 'completed';
        const isOverdue = st.includes('overdue') || st.includes('delayed');
        const isUpcoming = st === 'upcoming';
        if (existing) {
          existing.total += 1;
          if (isCompleted) existing.completed += 1;
          if (isUpcoming) existing.upcoming += 1;
          if (isOverdue) existing.overdue += 1;
        } else {
          map.set(stage, {
            name: stage,
            total: 1,
            completed: isCompleted ? 1 : 0,
            upcoming: isUpcoming ? 1 : 0,
            overdue: isOverdue ? 1 : 0,
          });
        }
      });
    });

    const PLAN_COLORS = ['#49358E', '#7066A9', '#28c76f', '#f59e0b', '#ea5455', '#00cfe8', '#9b59b6', '#e67e22'];
    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .map((item, i) => ({ ...item, color: PLAN_COLORS[i % PLAN_COLORS.length] }));
  }, [selectedProvince, selectedHospital]);

  const handleSelectAppointment = (apt: Appointment) => {
      setSelectedAppointment(apt);
      setCurrentView('detail');
  };

  // Horizontal scroll helpers
  const scrollDashboard = (direction: 'left' | 'right') => {
    if (chartsDrag.ref.current) {
      const scrollAmount = 300;
      chartsDrag.ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // --- Views ---

  // Patient History view (SCFC)
  if (showPatientHistory && historyPatient) {
    return (
      <PatientHistoryWrapper
        patient={historyPatient}
        onBack={() => setShowPatientHistory(false)}
      />
    );
  }

  // Detail view — use AppointmentDetail from CM with SCFC role
  if (currentView === 'detail' && selectedAppointment) {
    const patientRecord = getPatientByHn(selectedAppointment.hn);
    const patientObj = {
      name: selectedAppointment.patientName,
      hn: selectedAppointment.hn,
      image: patientRecord?.image,
    };
    // Map SCFC Appointment status to CM format
    const statusMap: Record<string, string> = {
      'Pending': 'waiting',
      'Confirmed': 'confirmed',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
    };
    const appointmentObj = {
      ...selectedAppointment,
      status: statusMap[selectedAppointment.status] || 'waiting',
      hospital: selectedAppointment.hospital,
      location: selectedAppointment.hospital,
      title: selectedAppointment.type,
      treatment: selectedAppointment.clinic,
      doctor: patientRecord?.doctor || '-',
      room: '-',
      requestDate: selectedAppointment.date,
    };
    return (
      <AppointmentDetail
        appointment={appointmentObj}
        patient={patientObj}
        onBack={() => {
          setSelectedAppointment(null);
          setCurrentView('list');
        }}
        role="scfc"
        onCancel={() => {
          toast.success('ยกเลิกนัดหมายเรียบร้อย');
        }}
        onReschedule={() => {
          toast.info('กำลังเลื่อนนัดหมาย...');
        }}
        onViewHistory={() => {
          const pt = getPatientByHn(selectedAppointment.hn);
          if (pt) {
            setHistoryPatient(pt);
            setShowPatientHistory(true);
          } else {
            setHistoryPatient({
              name: selectedAppointment.patientName,
              hn: selectedAppointment.hn,
              hospital: selectedAppointment.hospital,
            });
            setShowPatientHistory(true);
          }
        }}
      />
    );
  }

  if (currentView === 'list') {
      return (
        <AppointmentList 
            data={filteredData}
            onSelect={handleSelectAppointment}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onBack={() => setCurrentView('dashboard')}
        />
      );
  }

  // ═══ Drill-down views ═══
  if (drilldown && drilldown.type === 'peakHours') {
    return (
      <PeakHoursDrilldown
        appointments={flatAppointments}
        onBack={() => setDrilldown(null)}
        onSelectAppointment={() => setDrilldown(null)}
      />
    );
  }
  if (drilldown && drilldown.type === 'treatment') {
    return (
      <TreatmentDrilldown
        appointments={flatAppointments}
        treatmentName={drilldown.name}
        treatmentColor={drilldown.color}
        onBack={() => setDrilldown(null)}
        onSelectAppointment={() => setDrilldown(null)}
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
          <h1 className="text-white text-[18px] font-bold">นัดหมาย</h1>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
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
                             <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">
                                 {selectedProvince === 'All' ? 'ทุกจังหวัด' : selectedProvince}
                             </span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                 <ChevronDown size={18} />
                             </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
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
                             {PROVINCES.filter(p => p !== 'ทุกจังหวัด').map(p => (
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
                        <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
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
                    <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
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

            {/* --- Action Button --- */}
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

        {/* --- Stats Summary (5 cards) — horizontal drag-scrollable --- */}
        <div 
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
            <div className="bg-white px-4 py-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
                <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0">
                    <CalendarIcon size={20} />
                </div>
                <div>
                    <span className="text-2xl font-black text-[#37286A] leading-none">{stats.total}</span>
                    <p className="text-[16px] font-bold text-[#7066A9]">ทั้งหมด</p>
                </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                </div>
                <div>
                    <span className="text-2xl font-black text-[#37286A] leading-none">{stats.pending}</span>
                    <p className="text-[16px] font-bold text-[#7066A9]">รอตรวจ</p>
                </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
                <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <span className="text-2xl font-black text-[#37286A] leading-none">{stats.confirmed}</span>
                    <p className="text-[16px] font-bold text-[#7066A9]">ยืนยันแล้ว</p>
                </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-green-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <span className="text-2xl font-black text-[#37286A] leading-none">{stats.completed}</span>
                    <p className="text-[16px] font-bold text-[#7066A9]">เสร็จสิ้น</p>
                </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <XCircle size={20} />
                </div>
                <div>
                    <span className="text-2xl font-black text-[#37286A] leading-none">{stats.cancelled}</span>
                    <p className="text-[16px] font-bold text-[#7066A9]">ยกเลิก</p>
                </div>
            </div>
        </div>

        {/* --- แดชบอร์ด: สถิติสถานะ Pie Chart (standalone, filter-responsive) --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                    <PieChartIcon className="text-[#7066A9]" size={13} /> สถิติสถานะ
                </h3>
            </div>
            <div className="p-4 flex flex-col items-center gap-4">
                 <div className="w-[160px] h-[160px] relative shrink-0" style={{ minWidth: 160, minHeight: 160 }}>
                     {isMounted && (
                       <PieChart width={160} height={160}>
                          <Pie data={PIE_DATA.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                            {PIE_DATA.filter(d => d.value > 0).map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                          </Pie>
                       </PieChart>
                     )}
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[22px] font-black text-[#37286A]">{stats.total}</span>
                        <span className="text-[12px] text-[#7066A9]">ทั้งหมด</span>
                     </div>
                 </div>
                 <div className="w-full space-y-2.5">
                     {PIE_DATA.map((item) => (
                       <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                             <span className="text-[16px] font-bold text-[#5e5873]">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[16px] font-black text-[#37286A]">{item.value}</span>
                            <span className="text-[14px] text-[#7066A9]">({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)</span>
                          </div>
                       </div>
                     ))}
                 </div>
            </div>
        </Card>

        {/* --- ช่วงเวลาหนาแน่น + แผนการรักษา (drag-scrollable) --- */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 uppercase tracking-wider">
              <Activity className="text-[#7066A9]" size={14} /> ข้อมูลนัดหมาย
            </h3>
            <div className="flex items-center gap-1">
              <button onClick={() => scrollDashboard('left')} className="w-7 h-7 rounded-full bg-white border border-[#E3E0F0] flex items-center justify-center text-[#7066A9] hover:bg-[#F4F0FF] transition-colors shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => scrollDashboard('right')} className="w-7 h-7 rounded-full bg-white border border-[#E3E0F0] flex items-center justify-center text-[#7066A9] hover:bg-[#F4F0FF] transition-colors shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div 
            ref={chartsDrag.ref}
            {...chartsDrag.handlers}
            className="flex gap-4 overflow-x-auto pb-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
          >
            {/* Card A: Peak Hours */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
                <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                    <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                        <Clock className="text-[#7066A9]" size={13} /> ช่วงเวลาหนาแน่น
                    </h3>
                    {peakHour && (
                      <span className="text-[16px] font-bold text-white bg-[#49358E] px-1.5 py-0.5 rounded-full">
                        Peak: {peakHour.hour}
                      </span>
                    )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                    <div className="flex-1" style={{ width: '100%', minHeight: 180, minWidth: 0 }}>
                        {isMounted ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={peakHoursData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="peakGradMobile" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#49358E" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#49358E" stopOpacity={0.03} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="hour" tick={{ fontSize: 16, fill: '#7066A9' }} interval={2} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 16, fill: '#7066A9' }} allowDecimals={false} axisLine={false} tickLine={false} />
                              <RechartsTooltip 
                                contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '16px' }}
                                formatter={(val: any) => [`${val} นัดหมาย`, 'จำนวน']}
                              />
                              <Area type="monotone" dataKey="count" stroke="#49358E" fill="url(#peakGradMobile)" strokeWidth={2} dot={{ fill: '#49358E', r: 2.5, strokeWidth: 0 }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="w-full h-full bg-[#F4F0FF] animate-pulse rounded-lg" />
                        )}
                    </div>
                    {peakHour && peakHour.count > 0 && (
                      <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-[#F4F0FF] border border-[#E3E0F0]">
                        <AlertCircle size={14} className="text-[#49358E] shrink-0" />
                        <span className="text-[14px] text-[#37286A]">
                          หนาแน่นที่สุด: <span className="font-bold text-[#49358E]">{peakHour.hour} น.</span> ({peakHour.count} นัดหมาย)
                        </span>
                      </div>
                    )}
                </div>
                <div className="px-4 pb-4 mt-auto">
                  <button
                    onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'peakHours' }); }}
                    className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                  >
                    <Eye size={16} />
                    ดูรายละเอียด
                  </button>
                </div>
            </Card>

            {/* Card B: ตามแผนการรักษา (Treatment Plan) */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
                <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                    <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                        <ClipboardList className="text-[#7066A9]" size={13} /> ตามแผนการรักษา
                    </h3>
                    <span className="text-[16px] font-bold text-white bg-[#49358E] px-1.5 py-0.5 rounded-full">{treatmentPlanData.length} แผน</span>
                </div>
                {treatmentPlanData.length > 0 ? (
                  <div className="p-3 space-y-2.5 flex-1">
                    {treatmentPlanData.slice(0, 2).map((plan) => {
                      const totalAll = treatmentPlanData.reduce((s, p) => s + p.total, 0);
                      const pct = totalAll > 0 ? Math.round((plan.total / totalAll) * 100) : 0;
                      return (
                        <div key={plan.name} className="p-2.5 rounded-lg bg-[#F4F0FF]/40 border border-[#E3E0F0]">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: plan.color }}></div>
                              <span className="text-[16px] font-bold text-[#37286A] truncate">{plan.name}</span>
                            </div>
                            <span className="text-[16px] text-[#7066A9] shrink-0 ml-2">{plan.total} รายการ</span>
                          </div>
                          <div className="w-full h-2 bg-[#E3E0F0] rounded-full overflow-hidden mb-1.5">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: plan.color }}></div>
                          </div>
                          <div className="flex justify-between text-[14px]">
                            <div className="flex items-center gap-2">
                              <span className="text-[#28c76f]">เสร็จ {plan.completed}</span>
                              <span className="text-[#f59e0b]">รอ {plan.upcoming}</span>
                              {plan.overdue > 0 && <span className="text-[#ea5455]">ล่าช้า {plan.overdue}</span>}
                            </div>
                            <span className="font-bold text-[#7066A9]">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                    {treatmentPlanData.length > 2 && (
                      <div className="text-center text-[14px] text-[#7066A9] py-1">
                        +{treatmentPlanData.length - 2} แผนเพิ่มเติม
                      </div>
                    )}
                    {/* Total */}
                    <div className="pt-2 mt-1 border-t border-[#F4F0FF] flex items-center justify-between px-1">
                      <span className="text-[16px] text-[#7066A9]">รวมทั้งหมด</span>
                      <span className="text-[16px] font-black text-[#49358E]">{treatmentPlanData.reduce((s, p) => s + p.total, 0)} รายการ</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 flex flex-col items-center gap-2 text-center flex-1">
                    <ClipboardList size={28} className="text-[#D2CEE7]" />
                    <p className="text-[16px] text-[#7066A9]">ไม่พบข้อมูลแผนการรักษา</p>
                    <p className="text-[14px] text-[#D2CEE7]">สำหรับตัวกรองที่เลือก</p>
                  </div>
                )}
                <div className="px-4 pb-4 pt-1 mt-auto">
                  <button
                    onClick={() => { if (!chartsDrag.hasMoved.current && treatmentPlanData[0]) setDrilldown({ type: 'treatment', name: treatmentPlanData[0].name, color: treatmentPlanData[0].color }); }}
                    className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                  >
                    <Eye size={16} />
                    ดูรายละเอียด
                  </button>
                </div>
            </Card>
          </div>

          {/* Scroll dots indicator */}
          <div className="flex justify-center gap-1.5 mt-2">
            {[0, 1].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D2CEE7]"></div>
            ))}
          </div>
        </div>

        {/* --- ผู้ป่วยที่อยู่ในการดูแล --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 uppercase tracking-wider">
                    <Users className="text-[#7066A9]" size={14} /> ผู้ป่วยที่อยู่ในการดูแล
                </h3>
                <span className="text-[16px] font-black text-white bg-[#49358E] px-2 py-0.5 rounded-full">{PATIENTS_DATA.length} ราย</span>
            </div>
            <div className="divide-y divide-[#F4F0FF]">
                {PATIENTS_DATA.slice(0, 5).map((p) => {
                    const hasPending = (p.appointmentHistory || []).some((a: any) => a.status === 'waiting' || a.status === 'confirmed');
                    return (
                        <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F4F0FF]/40 transition-colors cursor-pointer">
                            <img src={p.image} alt={p.name} className="w-9 h-9 rounded-full object-cover border-2 border-[#E3E0F0] shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-bold text-[#37286A] truncate">{p.name}</span>
                                    {hasPending && (
                                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[16px] text-[#7066A9] font-medium">{p.hn}</span>
                                    <span className="text-[16px] text-[#b9b9c3]">•</span>
                                    <span className="text-[16px] text-[#7066A9] font-medium truncate">{p.hospital}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-[#D2CEE7] shrink-0" />
                        </div>
                    );
                })}
            </div>
            {PATIENTS_DATA.length > 5 && (
                <div className="p-3 border-t border-[#F4F0FF]">
                    <button className="w-full text-center text-[16px] font-bold text-[#49358E] hover:text-[#37286A] transition-colors py-1">
                        ดูทั้งหมด ({PATIENTS_DATA.length} ราย) →
                    </button>
                </div>
            )}
        </Card>

      </div>
    </div>
  );
}