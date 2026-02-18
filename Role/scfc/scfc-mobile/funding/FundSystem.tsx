import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft, Search, Clock, TrendingUp, Activity,
  Coins, Building2, MapPin, ArrowRight, ChevronDown, Database, Calendar,
  CheckCircle2, XCircle, ChevronRight, ChevronLeft, BarChart3,
  PieChart as PieChartIcon, DollarSign, Eye
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { toast } from "sonner@2.0.3";
import { FundList } from "./FundList";
import { FundRequest, FundStatus, UrgencyLevel } from "./FundDetailMobile";
import { FundingDetail } from "../../../cm/cm-mobile/funding/FundingDetail";
import { PatientDetailView } from "../../../cm/cm-mobile/patient/detail/PatientDetailView";
import { PATIENTS_DATA, getPatientByHn } from "../../../../data/patientData";
import { FUND_SOURCES, FIVE_YEAR_DATA, HOSPITAL_SUMMARY } from "../../../../data/themeConfig";
import { useDragScroll } from "../components/useDragScroll";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";

// Drilldown imports
import { FundDrilldownView, FundSourceInfo, buildFlatFundRequests } from './DrillDown/shared';
import { FundSourceDetailDrilldown } from './DrillDown/FundSourceDetailDrilldown';
import { YearlyDrilldown } from './DrillDown/YearlyDrilldown';

// ── Purple Theme (mobile) ──
// Primary:   #49358E (dark), #7066A9 (medium), #37286A (darker)
// Light:     #E3E0F0, #D2CEE7, #F4F0FF (lightest)
// Chart:     #49358E, Icon accent: #f5a623 (fund system)

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ["ทุกโรงพยาบาล", "รพ.มหาราชนครเชียงใหม่", "รพ.เชียงรายประชานุเคราะห์", "รพ.ฝาง", "รพ.ลำพูน", "รพ.แม่ฮ่องสอน"];

// Hospital → Province mapping for filter logic (local extras not yet in shared config)
const HOSPITAL_PROVINCE_MAP: Record<string, string> = {
  'รพ.มหาราชนครเชียงใหม่': 'เชียงใหม่',
  'รพ.เชียงรายประชานุเคราะห์': 'เชียงราย',
  'รพ.ฝาง': 'เชียงใหม่',
  'รพ.ลำพูน': 'ลำพูน',
  'รพ.แม่ฮ่องสอน': 'แม่ฮ่องสอน',
  'รพ.ลำปาง': 'ลำปาง',
  'รพ.พะเยา': 'พะเยา',
  'รพ.แพร่': 'แพร่',
  'รพ.น่าน': 'น่าน',
};

// Status Config (mobile)
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Pending:   { label: 'รอพิจารณา', color: '#f5a623', bg: 'bg-[#f5a623]/15' },
  Approved:  { label: 'อนุมัติแล้ว', color: '#4285f4', bg: 'bg-blue-50' },
  Rejected:  { label: 'ปฏิเสธ', color: '#EA5455', bg: 'bg-[#FCEAEA]' },
  Received:  { label: 'ได้รับเงินแล้ว', color: '#7367f0', bg: 'bg-[#7367f0]/10' },
  Disbursed: { label: 'จ่ายเงินแล้ว', color: '#28c76f', bg: 'bg-[#E5F8ED]' },
};

// Derive fund requests from shared PATIENTS_DATA.funding
const buildFundRequests = (): FundRequest[] => {
  const fromPatients: FundRequest[] = [];
  PATIENTS_DATA.forEach((p) => {
    const fundings = p.funding || [];
    fundings.forEach((f: any, idx: number) => {
      fromPatients.push({
        id: `FR-${p.hn}-${idx}`,
        patientName: p.name,
        hn: p.hn,
        diagnosis: p.diagnosis || 'Cleft Lip/Palate',
        fundType: f.type || 'ไม่ระบุ',
        amount: parseInt(f.amount) || 0,
        requestDate: f.date || '2026-01-15',
        urgency: (['Emergency', 'Urgent'].includes(f.urgency) ? f.urgency : 'Normal') as UrgencyLevel,
        hospital: p.hospital || '-',
        status: (['Pending', 'Approved', 'Rejected', 'Received', 'Disbursed'].includes(f.status) ? f.status : 'Pending') as FundStatus,
        documents: f.documents || ['medical_report.pdf'],
        history: [
          { date: f.date || '2026-01-15', action: 'สร้างคำขอ', user: 'Case Manager' },
          ...(f.status === 'Approved' ? [{ date: f.approvedDate || f.date || '2026-01-16', action: 'อนุมัติ', user: 'SCFC Admin' }] : []),
          ...(f.status === 'Rejected' ? [{ date: f.date || '2026-01-16', action: 'ปฏิเสธ', user: 'SCFC Admin' }] : []),
        ],
      });
    });
  });

  // Fallback if no data from patients
  if (fromPatients.length === 0) {
    return [
      { id: 'FR-2026-001', patientName: 'ด.ช. อนันต์ สุขใจ', hn: 'HN12345', diagnosis: 'Cleft Lip & Palate', fundType: 'สภากาชาดไทย', amount: 15000, requestDate: '2026-01-18', urgency: 'Emergency', hospital: 'รพ.มหาราชนครเชียงใหม่', status: 'Pending', documents: ['medical_report.pdf'], history: [{ date: '2026-01-18', action: 'สร้างคำขอ', user: 'Case Manager A' }] },
      { id: 'FR-2026-002', patientName: 'น.ส. มะลิ แซ่ลี้', hn: 'HN67890', diagnosis: 'Secondary Deformity', fundType: 'Northern Care Fund', amount: 25000, requestDate: '2026-01-20', urgency: 'Urgent', hospital: 'รพ.เชียงรายประชานุเคราะห์', status: 'Pending', documents: ['assessment_form.pdf'], history: [{ date: '2026-01-20', action: 'สร้างคำขอ', user: 'Case Manager B' }] },
      { id: 'FR-2026-003', patientName: 'นาย สมชาย จริงใจ', hn: 'HN54321', diagnosis: 'Speech Delay Therapy', fundType: 'Northern Care Fund', amount: 5000, requestDate: '2026-01-15', urgency: 'Normal', hospital: 'รพ.ฝาง', status: 'Approved', documents: ['therapy_plan.pdf'], history: [{ date: '2026-01-15', action: 'สร้างคำขอ', user: 'Case Manager C' }, { date: '2026-01-16', action: 'อนุมัติ', user: 'SCFC Admin' }] },
      { id: 'FR-2026-004', patientName: 'นาง สมพร แสงแก้ว', hn: 'HN99887', diagnosis: 'Post-op Follow-up', fundType: 'สภากาชาดไทย', amount: 3000, requestDate: '2026-01-10', urgency: 'Normal', hospital: 'รพ.ลำพูน', status: 'Disbursed', documents: ['followup_form.pdf'], history: [{ date: '2026-01-10', action: 'สร้างคำขอ', user: 'CM D' }, { date: '2026-01-11', action: 'อนุมัติ', user: 'SCFC Admin' }, { date: '2026-01-12', action: 'จ่ายเงิน', user: 'Finance' }] },
      { id: 'FR-2026-005', patientName: 'ด.ญ. กนกพร มีสุข', hn: 'HN44556', diagnosis: 'Cleft Palate Repair', fundType: 'Northern Care Fund', amount: 45000, requestDate: '2026-01-05', urgency: 'Urgent', hospital: 'รพ.แม่ฮ่องสอน', status: 'Rejected', documents: ['assessment.pdf'], history: [{ date: '2026-01-05', action: 'สร้างคำขอ', user: 'CM E' }, { date: '2026-01-06', action: 'ปฏิเสธ', user: 'SCFC Admin' }] },
    ];
  }
  return fromPatients;
};

// ═══ Patient History Wrapper for SCFC ═══
function PatientHistoryWrapper({ patient, onBack }: { patient: any; onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-[50001] bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Raise bottom bar above this overlay instead of hiding it */}
      <style>{`
        .fixed.bottom-0.left-0.w-full.bg-white.z-50 { z-index: 50002 !important; }
      `}</style>
      {/* Status Bar */}
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

export default function FundSystem({ onBack }: { onBack: () => void }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail'>('dashboard');
  const [requests, setRequests] = useState<FundRequest[]>(buildFundRequests);
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [selectedHospital, setSelectedHospital] = useState("ทุกโรงพยาบาล");
  const [isMounted, setIsMounted] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  // Patient history view for SCFC
  const [showPatientHistory, setShowPatientHistory] = useState(false);
  const [historyPatient, setHistoryPatient] = useState<any>(null);

  // Drilldown state
  const [drilldown, setDrilldown] = useState<FundDrilldownView>(null);
  const flatFundRequests = useMemo(() => buildFlatFundRequests(), []);

  const statsDrag = useDragScroll();
  const chartsDrag = useDragScroll();

  useEffect(() => { setIsMounted(true); }, []);

  // ═══ Dashboard requests filtered by province & hospital ═══
  const dashboardRequests = useMemo(() => {
    return requests.filter(r => {
      // Province filter
      if (selectedProvince !== 'ทุกจังหวัด') {
        const reqProvince = HOSPITAL_PROVINCE_MAP[r.hospital] || '';
        if (reqProvince !== selectedProvince) return false;
      }
      // Hospital filter
      if (selectedHospital !== 'ทุกโรงพยาบาล') {
        if (r.hospital !== selectedHospital) return false;
      }
      return true;
    });
  }, [requests, selectedProvince, selectedHospital]);

  // Stats (derived from filtered dashboard requests)
  const stats = useMemo(() => {
    const total = dashboardRequests.length;
    const pending = dashboardRequests.filter(r => r.status === 'Pending').length;
    const approved = dashboardRequests.filter(r => r.status === 'Approved' || r.status === 'Received' || r.status === 'Disbursed').length;
    const rejected = dashboardRequests.filter(r => r.status === 'Rejected').length;
    const totalAmount = dashboardRequests.reduce((sum, r) => sum + r.amount, 0);
    const grantedAmount = dashboardRequests.filter(r => r.status === 'Approved' || r.status === 'Disbursed').reduce((s, r) => s + r.amount, 0);
    return { total, pending, approved, rejected, totalAmount, grantedAmount };
  }, [dashboardRequests]);

  // Pie data (from filtered stats)
  const pieData = useMemo(() => [
    { name: 'รอพิจารณา', value: stats.pending, color: '#f5a623' },
    { name: 'อนุมัติ', value: stats.approved, color: '#28c76f' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
  ], [stats]);

  const filteredRequests = useMemo(() => requests.filter(r => {
    const matchesSearch = !searchQuery || r.patientName.includes(searchQuery) || r.hn.includes(searchQuery);
    return matchesSearch;
  }), [searchQuery, requests]);

  const handleSelectRequest = (req: FundRequest) => { setSelectedRequest(req); setCurrentView('detail'); };

  // SCFC: handle status change from FundingDetail
  const handleStatusChange = (newStatus: string, reason?: string) => {
    if (!selectedRequest) return;
    setRequests(prev => prev.map(r => {
      if (r.id !== selectedRequest.id) return r;
      return {
        ...r,
        status: newStatus as FundStatus,
        rejectReason: newStatus === 'Rejected' ? reason : r.rejectReason,
        history: [
          ...r.history,
          {
            date: new Date().toLocaleString(),
            action: newStatus === 'Approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธคำขอ',
            user: 'SCFC Admin'
          }
        ]
      };
    }));
    // Update selectedRequest in-place for UI
    setSelectedRequest(prev => prev ? { ...prev, status: newStatus as FundStatus, rejectReason: newStatus === 'Rejected' ? reason : prev.rejectReason } : null);
  };

  // SCFC: view patient history
  const handleViewHistory = () => {
    if (!selectedRequest) return;
    const pt = getPatientByHn(selectedRequest.hn);
    if (pt) {
      setHistoryPatient(pt);
      setShowPatientHistory(true);
    } else {
      // Fallback: build minimal patient object
      setHistoryPatient({
        name: selectedRequest.patientName,
        hn: selectedRequest.hn,
        diagnosis: selectedRequest.diagnosis,
        hospital: selectedRequest.hospital,
      });
      setShowPatientHistory(true);
    }
  };

  // Scroll dashboard charts
  const scrollDashboard = (direction: 'left' | 'right') => {
    if (chartsDrag.ref.current) {
      const scrollAmount = 300;
      chartsDrag.ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // --- Views ---
  // Patient History view
  if (showPatientHistory && historyPatient) {
    return (
      <PatientHistoryWrapper
        patient={historyPatient}
        onBack={() => setShowPatientHistory(false)}
      />
    );
  }

  // Detail view — use FundingDetail from CM with SCFC role
  if (currentView === 'detail' && selectedRequest) {
    const patientObj = {
      name: selectedRequest.patientName,
      hn: selectedRequest.hn,
      image: getPatientByHn(selectedRequest.hn)?.image,
    };
    return (
      <FundingDetail
        fund={selectedRequest}
        patient={patientObj}
        fundSource={selectedRequest.fundType}
        onBack={() => {
          setSelectedRequest(null);
          // If drilldown state exists, go back to dashboard to render drilldown
          if (drilldown) {
            setCurrentView('dashboard');
          } else {
            setCurrentView('list');
          }
        }}
        role="scfc"
        onStatusChange={handleStatusChange}
        onViewHistory={handleViewHistory}
      />
    );
  }

  if (currentView === 'list') {
    return (
      <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
        <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
          <button onClick={() => setCurrentView('dashboard')} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
          <h1 className="text-white text-[18px] font-bold">รายการขอทุน</h1>
        </div>
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <FundList data={filteredRequests} onSelect={handleSelectRequest} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </div>
    );
  }

  // ═══ Drill-down views ═══
  if (drilldown && drilldown.type === 'fundSource') {
    return (
      <FundSourceDetailDrilldown
        source={drilldown.source}
        onBack={() => setDrilldown(null)}
      />
    );
  }
  if (drilldown && drilldown.type === 'yearly') {
    return (
      <YearlyDrilldown
        onBack={() => setDrilldown(null)}
      />
    );
  }

  // --- Dashboard View ---
  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
      {/* Header - Purple */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <h1 className="text-white text-[18px] font-bold">จัดการทุน</h1>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* --- Filter Section --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E3E0F0] flex flex-col gap-3">
          <div className="flex gap-2">
            {/* Province Filter */}
            <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
              <PopoverTrigger asChild>
                <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><MapPin size={18} /></div>
                  <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">{selectedProvince}</span>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><ChevronDown size={18} /></div>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-col">
                  {PROVINCES.map(p => (
                    <button key={p} onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedProvince === p ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>{p}</button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Hospital Filter */}
            <Popover open={isHospitalOpen} onOpenChange={setIsHospitalOpen}>
              <PopoverTrigger asChild>
                <button className="relative flex-1 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><Building2 size={18} /></div>
                  <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">{selectedHospital}</span>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><ChevronDown size={18} /></div>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className="flex flex-col">
                  {HOSPITALS.map(h => (
                    <button key={h} onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedHospital === h ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>{h}</button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="pt-1">
            <Button onClick={() => setCurrentView('list')} className="w-full bg-[#49358E] hover:bg-[#37286A] text-white rounded-xl h-12 text-base font-bold shadow-md shadow-[#49358E]/20 flex items-center justify-center gap-2 transition-all">
              ดูรายการทั้งหมด <ArrowRight size={18} />
            </Button>
          </div>
        </div>

        {/* --- Stats Summary (4 cards) — horizontal drag-scrollable --- */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          <div className="bg-white px-4 py-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0">
              <Coins size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.total}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">คำขอทั้งหมด</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.pending}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">รอพิจารณา</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-green-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.approved}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">อนุมัติ</p>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl border border-rose-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle size={20} />
            </div>
            <div>
              <span className="text-2xl font-black text-[#37286A] leading-none">{stats.rejected}</span>
              <p className="text-[16px] font-bold text-[#7066A9]">ปฏิเสธ</p>
            </div>
          </div>
        </div>

        {/* --- แดชบอร์ด: สถิติสถานะ Pie Chart (filter-responsive) --- */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
              <PieChartIcon className="text-[#7066A9]" size={13} /> สถิติสถานะคำขอทุน
            </h3>
          </div>
          <div className="p-4 flex flex-col items-center gap-4">
            <div className="w-[160px] h-[160px] relative shrink-0" style={{ minWidth: 160, minHeight: 160 }}>
              {isMounted && (
                <PieChart width={160} height={160}>
                  <Pie
                    data={pieData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[22px] font-black text-[#37286A]">{stats.total}</span>
                <span className="text-[12px] text-[#7066A9]">ทั้งหมด</span>
              </div>
            </div>
            <div className="w-full space-y-2.5">
              {pieData.map((item) => (
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
              <div className="pt-1.5 border-t border-[#F4F0FF]">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-[#7066A9]">ยอดรวม</span>
                  <span className="text-[16px] font-black text-[#f5a623]">฿{stats.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* --- แหล่งทุน + ยอดเบิกจ่าย (drag-scrollable, 2 cards) --- */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 uppercase tracking-wider">
              <Database className="text-[#7066A9]" size={14} /> แหล่งทุนและเบิกจ่าย
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
            {/* Card A: แหล่งทุน */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <Database className="text-[#7066A9]" size={13} /> แหล่งทุน
                </h3>
                <span className="text-[16px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{FUND_SOURCES.length} แหล่ง</span>
              </div>
              <div className="p-3 space-y-3 flex-1">
                {FUND_SOURCES.slice(0, 2).map((source) => {
                  const pct = Math.round((source.disbursed / source.totalBudget) * 100);
                  return (
                    <div
                      key={source.id}
                      className="p-3 rounded-xl bg-[#F4F0FF]/40 border border-[#E3E0F0] cursor-pointer active:bg-[#F4F0FF] transition-colors"
                      onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'fundSource', source }); }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[16px] font-bold text-[#37286A] truncate max-w-[200px]">{source.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={cn("text-[16px] px-1.5 py-0.5 rounded-full font-bold", source.status === 'Active' ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400")}>
                            {source.status === 'Active' ? 'ใช้งาน' : 'ปิด'}
                          </span>
                          <ChevronRight size={14} className="text-[#D2CEE7]" />
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-[#E3E0F0] rounded-full overflow-hidden mb-1.5">
                        <div className="h-full bg-[#f5a623] rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[16px] text-[#7066A9]">
                        <span>เบิกจ่าย ฿{source.disbursed.toLocaleString()}</span>
                        <span className="font-bold">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
                {FUND_SOURCES.length > 2 && (
                  <div className="text-center text-[14px] text-[#7066A9] py-1">
                    +{FUND_SOURCES.length - 2} แหล่งเพิ่มเติม
                  </div>
                )}
              </div>
              {/* Footer: ยอดงบทั้งหมด */}
              <div className="px-4 pb-3 pt-1 mt-auto border-t border-[#F4F0FF]">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-[#7066A9]">งบประมาณรวม</span>
                  <span className="text-[16px] font-black text-[#49358E]">฿{FUND_SOURCES.reduce((s, f) => s + f.totalBudget, 0).toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Card B: ยอดเบิกจ่าย 5 ปี */}
            <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
              <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                  <BarChart3 className="text-[#7066A9]" size={13} /> ยอดเบิกจ่าย 5 ปี
                </h3>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex-1" style={{ width: '100%', minHeight: 180, minWidth: 0 }}>
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={FIVE_YEAR_DATA} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                        <XAxis dataKey="year" tick={{ fontSize: 16, fill: '#7066A9' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 16, fill: '#7066A9' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '16px' }}
                          formatter={(value: any, name: string) => {
                            const labels: Record<string, string> = { redCross: 'สภากาชาดไทย', foundation: 'มูลนิธิฯ', northern: 'กองทุนรัฐบาล' };
                            return [`฿${Number(value).toLocaleString()}`, labels[name] || name];
                          }}
                        />
                        <Bar dataKey="redCross" fill="#ea5455" radius={[2, 2, 0, 0]} stackId="a" />
                        <Bar dataKey="foundation" fill="#f5a623" radius={[0, 0, 0, 0]} stackId="a" />
                        <Bar dataKey="northern" fill="#49358E" radius={[2, 2, 0, 0]} stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full bg-[#F4F0FF] animate-pulse rounded-lg" />
                  )}
                </div>
                <div className="flex justify-center gap-3 mt-2">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#ea5455]"></div><span className="text-[16px] text-[#7066A9]">กาชาด</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#f5a623]"></div><span className="text-[16px] text-[#7066A9]">มูลนิธิฯ</span></div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-[#49358E]"></div><span className="text-[16px] text-[#7066A9]">รัฐบาล</span></div>
                </div>
              </div>
              {/* ดูรายละเอียด button */}
              <div className="px-4 pb-4 mt-auto">
                <button
                  onClick={() => { if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'yearly' }); }}
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

      </div>
    </div>
  );
}