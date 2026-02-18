import React, { useState, useMemo } from 'react';
import {
  Search, Clock, MapPin,
  CheckCircle2, Filter, ArrowLeft,
  LayoutDashboard, List, ChevronRight, Eye,
  BarChart3, XCircle, Calendar,
  Coins, Building2,
  Check, X, Database,
  PieChart as PieChartIcon
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../../../components/ui/dialog";
import { Textarea } from "../../../../../components/ui/textarea";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PATIENTS_DATA } from "../../../../../data/patientData";
import { SYSTEM_ICON_COLORS, PROVINCES, HOSPITALS, HOSPITAL_PROVINCE_MAP, FUND_SOURCES, FIVE_YEAR_DATA } from "../../../../../data/themeConfig";
import type { FundSourceInfo } from "../../../../../data/themeConfig";
import { toast } from "sonner@2.0.3";
import { FundRequestDetailPage } from "./FundRequestDetailPage";
import { FundSourceDetailPage } from "./FundSourceDetailPage";
import { FundDrilldownView } from "./drilldown/shared";
import { StatusDrilldown as FundStatusDrilldown } from "./drilldown/StatusDrilldown";

// ===== UI = สีม่วง / Icon = สีเหลืองอำพัน (#f5a623) =====
const ICON = SYSTEM_ICON_COLORS.fund;

type FundStatus = 'Pending' | 'Approved' | 'Rejected' | 'Received' | 'Disbursed';
type UrgencyLevel = 'Normal' | 'Urgent' | 'Emergency';

interface FundRequest {
  id: string;
  patientName: string;
  hn: string;
  diagnosis: string;
  fundType: string;
  amount: number;
  requestDate: string;
  urgency: UrgencyLevel;
  hospital: string;
  status: FundStatus;
  rejectReason?: string;
  documents: string[];
  history: { date: string; action: string; user: string }[];
}

// Status Config (synced with mobile)
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Pending:   { label: 'รอพิจารณา', color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' },
  Approved:  { label: 'อนุมัติแล้ว', color: 'text-[#4285f4]', bg: 'bg-blue-50' },
  Rejected:  { label: 'ปฏิเสธ', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]' },
  Received:  { label: 'ได้รับเงินแล้ว', color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
  Disbursed: { label: 'จ่ายเงินแล้ว', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]' },
};

const getStatusConfig = (status: string) => STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

const getUrgencyConfig = (urgency: string) => {
  if (urgency === 'Emergency') return { label: 'ฉุกเฉิน', color: 'text-red-600', bg: 'bg-red-50' };
  if (urgency === 'Urgent') return { label: 'เร่งด่วน', color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' };
  return { label: 'ปกติ', color: 'text-gray-600', bg: 'bg-gray-50' };
};

const formatThaiShortDate = (raw: string | undefined): string => {
  if (!raw || raw === '-') return '-';
  if (/[ก-๙]/.test(raw)) return raw;
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch { return raw; }
};

// Build initial fund requests from PATIENTS_DATA (synced with mobile)
const buildInitialRequests = (): FundRequest[] => {
  const fromPatients: FundRequest[] = [];
  PATIENTS_DATA.forEach((p) => {
    const fundings = p.funding || [];
    fundings.forEach((f: any, fIdx: number) => {
      fromPatients.push({
        id: `FR-${p.hn}-${fIdx}`,
        patientName: p.name,
        hn: p.hn,
        diagnosis: p.diagnosis || 'Cleft Lip/Palate',
        fundType: f.type || 'ไม่ระบุ',
        amount: parseInt(f.amount) || 0,
        requestDate: f.date || '2026-01-15',
        urgency: (['Emergency', 'Urgent'].includes(f.urgency) ? f.urgency : 'Normal') as UrgencyLevel,
        hospital: p.hospital || '-',
        status: (['Pending', 'Approved', 'Rejected', 'Received', 'Disbursed'].includes(f.status) ? f.status : 'Pending') as FundStatus,
        rejectReason: f.rejectReason,
        documents: f.documents || ['medical_report.pdf'],
        history: [{ date: f.date || '2026-01-15', action: 'สร้างคำขอ', user: 'Case Manager' }],
      });
    });
  });
  if (fromPatients.length === 0) {
    return [
      { id: 'FR-2026-001', patientName: 'ด.ช. อนันต์ สุขใจ', hn: 'HN12345', diagnosis: 'Cleft Lip & Palate', fundType: 'สภากาชาดไทย', amount: 15000, requestDate: '2026-01-18', urgency: 'Emergency', hospital: 'รพ.มหาราชนครเชียงใหม่', status: 'Pending', documents: ['medical_report.pdf'], history: [{ date: '2026-01-18', action: 'สร้างคำขอ', user: 'Case Manager A' }] },
      { id: 'FR-2026-002', patientName: 'น.ส. มะลิ แซ่ลี้', hn: 'HN67890', diagnosis: 'Secondary Deformity', fundType: 'Northern Care Fund', amount: 25000, requestDate: '2026-01-20', urgency: 'Urgent', hospital: 'รพ.เชียงรายประชานุเคราะห์', status: 'Pending', documents: ['assessment_form.pdf'], history: [{ date: '2026-01-20', action: 'สร้างคำขอ', user: 'Case Manager B' }] },
      { id: 'FR-2026-003', patientName: 'นาย สมชาย จริงใจ', hn: 'HN54321', diagnosis: 'Speech Delay Therapy', fundType: 'Northern Care Fund', amount: 5000, requestDate: '2026-01-15', urgency: 'Normal', hospital: 'รพ.ฝาง', status: 'Approved', documents: ['therapy_plan.pdf'], history: [{ date: '2026-01-15', action: 'สร้างคำขอ', user: 'Case Manager C' }, { date: '2026-01-16', action: 'อนุมัติ', user: 'SCFC Admin' }] },
      { id: 'FR-2026-004', patientName: 'นาง สมพร แสงแก้ว', hn: 'HN99887', diagnosis: 'Post-op Follow-up', fundType: 'สภากาชาดไทย', amount: 3000, requestDate: '2026-01-10', urgency: 'Normal', hospital: 'รพ.ลำพูน', status: 'Disbursed', documents: ['followup_form.pdf'], history: [{ date: '2026-01-10', action: 'สร้างคำขอ', user: 'CM D' }, { date: '2026-01-11', action: 'อนุมัติ', user: 'SCFC Admin' }, { date: '2026-01-12', action: 'จ่ายเงิน', user: 'Finance' }] },
      { id: 'FR-2026-005', patientName: 'ด.ญ. กนกพร มีสุข', hn: 'HN44556', diagnosis: 'Cleft Palate Repair', fundType: 'Northern Care Fund', amount: 45000, requestDate: '2026-01-05', urgency: 'Urgent', hospital: 'รพ.แม่ฮ่องสอน', status: 'Rejected', rejectReason: 'รายได้เกินเกณฑ์', documents: ['assessment.pdf'], history: [{ date: '2026-01-05', action: 'สร้างคำขอ', user: 'CM E' }, { date: '2026-01-06', action: 'ปฏิเสธ', user: 'SCFC Admin' }] },
    ];
  }
  return fromPatients;
};

export default function FundSystem({ onBack }: { onBack: () => void }) {
  const [viewMode, setViewMode] = useState<'dashboard' | 'list'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('ทั้งหมด');
  const [hospitalFilter, setHospitalFilter] = useState('ทั้งหมด');
  const [fundTypeFilter, setFundTypeFilter] = useState('all');
  const [requests, setRequests] = useState<FundRequest[]>(buildInitialRequests);
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedFundSource, setSelectedFundSource] = useState<FundSourceInfo | null>(null);
  const [fundDrilldown, setFundDrilldown] = useState<FundDrilldownView>(null);

  // Derive unique hospitals & fund types
  const uniqueHospitals = useMemo(() => Array.from(new Set(requests.map(r => r.hospital).filter(h => h && h !== '-'))).sort(), [requests]);
  const uniqueFundTypes = useMemo(() => Array.from(new Set(requests.map(r => r.fundType).filter(Boolean))).sort(), [requests]);

  // ═══ Dashboard requests filtered by province & hospital (synced with mobile) ═══
  const dashboardRequests = useMemo(() => {
    return requests.filter(r => {
      if (provinceFilter !== 'ทั้งหมด') {
        const reqProvince = HOSPITAL_PROVINCE_MAP[r.hospital] || '';
        if (reqProvince !== provinceFilter) return false;
      }
      if (hospitalFilter !== 'ทั้งหมด') {
        if (r.hospital !== hospitalFilter) return false;
      }
      return true;
    });
  }, [requests, provinceFilter, hospitalFilter]);

  // ═══ Stats (from dashboardRequests — synced with mobile) ═══
  const stats = useMemo(() => {
    const total = dashboardRequests.length;
    const pending = dashboardRequests.filter(r => r.status === 'Pending').length;
    const approved = dashboardRequests.filter(r => r.status === 'Approved' || r.status === 'Received' || r.status === 'Disbursed').length;
    const rejected = dashboardRequests.filter(r => r.status === 'Rejected').length;
    const totalAmount = dashboardRequests.reduce((sum, r) => sum + r.amount, 0);
    const grantedAmount = dashboardRequests.filter(r => r.status === 'Approved' || r.status === 'Disbursed').reduce((s, r) => s + r.amount, 0);
    return { total, pending, approved, rejected, totalAmount, grantedAmount };
  }, [dashboardRequests]);

  // ═══ Pie data (synced with mobile — 3 items) ═══
  const pieData = useMemo(() => [
    { name: 'รอพิจารณา', value: stats.pending, color: '#f5a623' },
    { name: 'อนุมัติ', value: stats.approved, color: '#28c76f' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
  ], [stats]);

  // Pending requests for dashboard table
  const pendingFiltered = useMemo(() => dashboardRequests.filter(r => r.status === 'Pending'), [dashboardRequests]);

  // List filter (search + status + fundType)
  const filtered = useMemo(() => {
    return dashboardRequests.filter((r) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        r.patientName.toLowerCase().includes(term) ||
        r.hn.toLowerCase().includes(term) ||
        r.id.toLowerCase().includes(term) ||
        r.hospital.toLowerCase().includes(term);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchFundType = fundTypeFilter === 'all' || r.fundType === fundTypeFilter;
      return matchSearch && matchStatus && matchFundType;
    });
  }, [dashboardRequests, searchTerm, statusFilter, fundTypeFilter]);

  // Actions
  const handleApprove = (req: FundRequest) => {
    setRequests(prev => prev.map(r => r.id === req.id ? {
      ...r, status: 'Approved' as FundStatus,
      history: [...r.history, { date: new Date().toLocaleDateString('th-TH'), action: 'อนุมัติแล้ว', user: 'SCFC Admin' }]
    } : r));
    toast.success("อนุมัติทุนเรียบร้อยแล้ว");
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectReason) return;
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? {
      ...r, status: 'Rejected' as FundStatus, rejectReason,
      history: [...r.history, { date: new Date().toLocaleDateString('th-TH'), action: 'ปฏิเสธคำขอ', user: 'SCFC Admin' }]
    } : r));
    toast.error("ปฏิเสธคำขอเรียบร้อยแล้ว");
    setIsRejectDialogOpen(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  // ═══ Drilldown rendering ═══
  if (fundDrilldown) {
    const drillFilter = fundDrilldown.type === 'status' ? fundDrilldown.filter : 'all';
    const drillLabel = fundDrilldown.type === 'status' ? fundDrilldown.label : 'ภาพรวมยอดเบิกจ่ายรายปี';
    return (
      <FundStatusDrilldown
        requests={requests as any}
        filter={drillFilter}
        label={drillLabel}
        onBack={() => setFundDrilldown(null)}
        onSelectRequest={(r: any) => { setFundDrilldown(null); setSelectedRequest(r); }}
      />
    );
  }

  // Detail view
  if (selectedRequest) {
    return (
      <div className="font-['IBM_Plex_Sans_Thai']">
        <FundRequestDetailPage
          request={selectedRequest}
          onBack={() => setSelectedRequest(null)}
          onApprove={() => handleApprove(selectedRequest)}
          onReject={() => setIsRejectDialogOpen(true)}
        />
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-[#5e5873]">เหตุผลในการปฏิเสธ</DialogTitle>
            </DialogHeader>
            <Textarea placeholder="กรุณาระบุเหตุผล..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="min-h-[100px]" />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>ยกเลิก</Button>
              <Button className="bg-[#EA5455] hover:bg-red-600 text-white" onClick={handleReject} disabled={!rejectReason}>ยืนยันปฏิเสธ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Fund Source Detail view
  if (selectedFundSource) {
    return (
      <div className="font-['IBM_Plex_Sans_Thai']">
        <FundSourceDetailPage source={selectedFundSource} onBack={() => setSelectedFundSource(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai'] px-4 md:px-0">

      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="bg-[#f5a623]/10 p-2.5 rounded-xl">
            <Coins className={cn("w-6 h-6", ICON.text)} />
          </div>
          <div>
            <h1 className="text-[#5e5873] text-xl">ระบบบริหารจัดการทุน</h1>
            <p className="text-xs text-gray-500">พิจารณาและจัดสรรทุนสนับสนุนผู้ป่วย</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button onClick={() => setViewMode('dashboard')} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all", viewMode === 'dashboard' ? "bg-white text-[#7367f0] shadow-sm" : "text-gray-500 hover:text-gray-700")}>
              <LayoutDashboard size={16} /> แดชบอร์ด
            </button>
            <button onClick={() => setViewMode('list')} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all", viewMode === 'list' ? "bg-white text-[#7367f0] shadow-sm" : "text-gray-500 hover:text-gray-700")}>
              <List size={16} /> รายการ
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="ค้นหาชื่อ, HN, โรงพยาบาล..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-lg" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={provinceFilter} onValueChange={setProvinceFilter}>
            <SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-[#7367f0]" /><SelectValue /></div>
            </SelectTrigger>
            <SelectContent>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
            <SelectTrigger className="w-[180px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><Building2 size={14} className="text-[#7367f0]" /><SelectValue /></div>
            </SelectTrigger>
            <SelectContent>{HOSPITALS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-11 border-gray-200 rounded-lg text-sm">
              <div className="flex items-center gap-2"><Filter size={14} className="text-[#7367f0]" /><SelectValue placeholder="ทุกสถานะ" /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="Pending">รอพิจารณา</SelectItem>
              <SelectItem value="Approved">อนุมัติแล้ว</SelectItem>
              <SelectItem value="Disbursed">จ่ายเงินแล้ว</SelectItem>
              <SelectItem value="Rejected">ปฏิเสธ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ════════ DASHBOARD (synced with mobile) ════════ */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">

          {/* ═══ 4 Stat Cards (synced with mobile) ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'คำขอทั้งหมด', value: stats.total, icon: Coins, iconColor: ICON.text, iconBg: 'bg-[#f5a623]/10', borderColor: 'border-gray-100' },
              { label: 'รอพิจารณา', value: stats.pending, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', borderColor: 'border-amber-100' },
              { label: 'อนุมัติ', value: stats.approved, icon: CheckCircle2, iconColor: 'text-green-600', iconBg: 'bg-green-50', borderColor: 'border-green-100' },
              { label: 'ปฏิเสธ', value: stats.rejected, icon: XCircle, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', borderColor: 'border-rose-100' },
            ].map((stat, i) => (
              <Card key={i} className={cn("shadow-sm rounded-xl hover:shadow-md transition-all", stat.borderColor)}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", stat.iconBg)}>
                    <stat.icon size={20} className={stat.iconColor} />
                  </div>
                  <div>
                    <span className="text-2xl text-[#37286A]">{stat.value}</span>
                    <p className="text-sm text-[#7066A9]">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ═══ สถิติสถานะคำขอทุน Pie Chart (standalone — synced with mobile) ═══ */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-[#f5a623]" /> สถิติสถานะคำขอทุน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="h-[220px] relative flex items-center justify-center" style={{ minHeight: 220 }}>
                  <ResponsiveContainer width="100%" height={220} minWidth={0} debounce={50}>
                    <PieChart>
                      <Pie data={pieData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                        {pieData.filter(d => d.value > 0).map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl text-[#37286A]">{stats.total}</span>
                    <span className="text-xs text-[#7066A9]">ทั้งหมด</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-[#5e5873]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-[#37286A]">{item.value}</span>
                        <span className="text-xs text-[#7066A9]">({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)</span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#7066A9]">ยอดรวม</span>
                      <span className="text-sm text-[#f5a623]">฿{stats.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ═══ แหล่งทุน + ยอดเบิกจ่าย 5 ปี (synced with mobile) ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Card A: แหล่งทุน (2 items + "+X เพิ่มเติม") */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#f5a623]" /> แหล่งทุน
                </CardTitle>
                <span className="text-xs text-white bg-[#7367f0] px-1.5 py-0.5 rounded-full">{FUND_SOURCES.length} แหล่ง</span>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                {FUND_SOURCES.slice(0, 2).map((source) => {
                  const pct = Math.round((source.disbursed / source.totalBudget) * 100);
                  return (
                    <div
                      key={source.id}
                      className="p-3 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100/80 transition-colors"
                      onClick={() => setSelectedFundSource(source)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-[#37286A] truncate max-w-[200px]">{source.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={cn("text-xs px-1.5 py-0.5 rounded-full", source.status === 'Active' ? "bg-green-50 text-[#28c76f]" : "bg-gray-100 text-gray-400")}>
                            {source.status === 'Active' ? 'ใช้งาน' : 'ปิด'}
                          </span>
                          <ChevronRight size={14} className="text-gray-300" />
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                        <div className="h-full bg-[#f5a623] rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-[#7066A9]">
                        <span>เบิกจ่าย ฿{source.disbursed.toLocaleString()}</span>
                        <span>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
                {FUND_SOURCES.length > 2 && (
                  <div className="text-center text-xs text-[#7066A9] py-1">+{FUND_SOURCES.length - 2} แหล่งเพิ่มเติม</div>
                )}
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#7066A9]">งบประมาณรวม</span>
                  <span className="text-sm text-[#7367f0]">฿{FUND_SOURCES.reduce((s, f) => s + f.totalBudget, 0).toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Card B: ยอดเบิกจ่าย 5 ปี (synced with mobile) */}
            <Card className="border-gray-100 shadow-sm rounded-xl flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#f5a623]" /> ยอดเบิกจ่าย 5 ปี
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1" style={{ width: '100%', minHeight: 220, minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height={220} minWidth={0} debounce={50}>
                    <BarChart data={FIVE_YEAR_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#7066A9' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#7066A9' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                      <RechartsTooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '12px' }}
                        formatter={(value: any, name: string) => {
                          const labels: Record<string, string> = { redCross: 'สภากาชาดไทย', foundation: 'มูลนิธิฯ', northern: 'กองทุนรัฐบาล' };
                          return [`฿${Number(value).toLocaleString()}`, labels[name] || name];
                        }}
                      />
                      <Bar dataKey="redCross" fill="#ea5455" radius={[2, 2, 0, 0]} stackId="a" />
                      <Bar dataKey="foundation" fill="#f5a623" radius={[0, 0, 0, 0]} stackId="a" />
                      <Bar dataKey="northern" fill="#7367f0" radius={[2, 2, 0, 0]} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2 rounded-sm bg-[#ea5455]"></div><span className="text-xs text-[#7066A9]">กาชาด</span></div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2 rounded-sm bg-[#f5a623]"></div><span className="text-xs text-[#7066A9]">มูลนิธิฯ</span></div>
                  <div className="flex items-center gap-1"><div className="w-2.5 h-2 rounded-sm bg-[#7367f0]"></div><span className="text-xs text-[#7066A9]">รัฐบาล</span></div>
                </div>
              </CardContent>
              <div className="px-4 pb-4 pt-1 mt-auto">
                <button
                  onClick={() => setFundDrilldown({ type: 'status', filter: 'all', label: 'ภาพรวมยอดเบิกจ่ายรายปี' })}
                  className="w-full h-[38px] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#7367f0] rounded-xl flex items-center justify-center gap-2 text-sm transition-all border border-[#C4BFFA]"
                >
                  <Eye size={16} /> ดูรายละเอียด
                </button>
              </div>
            </Card>
          </div>

          {/* ═══ คำขอรอพิจารณา (kept — uses filtered) ═══ */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#f5a623]" /> คำขอรอพิจารณา
                <span className="text-xs text-white bg-[#f5a623] px-2 py-0.5 rounded-full">{pendingFiltered.length}</span>
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[#7367f0] text-sm" onClick={() => { setViewMode('list'); setStatusFilter('Pending'); }}>
                ดูทั้งหมด <ChevronRight size={16} />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop table */}
              <div className="overflow-x-auto hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">แหล่งทุน</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead>
                      <TableHead className="text-xs text-[#5e5873] text-right">จำนวนเงิน</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                      <TableHead className="text-xs text-[#5e5873] w-[100px]">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingFiltered.slice(0, 5).map((r) => {
                      const sc = getStatusConfig(r.status);
                      return (
                        <TableRow key={r.id} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedRequest(r)}>
                          <TableCell>
                            <div className="text-sm text-[#5e5873]">{r.patientName}</div>
                            <div className="text-xs text-gray-400">{r.hn}</div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 truncate max-w-[150px]">{r.fundType}</TableCell>
                          <TableCell className="text-sm text-gray-600">{r.hospital}</TableCell>
                          <TableCell className="text-right text-[#f5a623]">฿{r.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button className="w-8 h-8 rounded-lg bg-green-50 text-[#28c76f] hover:bg-green-100 flex items-center justify-center transition-colors" onClick={() => handleApprove(r)} title="อนุมัติ"><Check size={16} /></button>
                              <button className="w-8 h-8 rounded-lg bg-red-50 text-[#EA5455] hover:bg-red-100 flex items-center justify-center transition-colors" onClick={() => { setSelectedRequest(r); setIsRejectDialogOpen(true); }} title="ปฏิเสธ"><X size={16} /></button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {pendingFiltered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-20 text-center text-gray-400">ไม่มีคำขอรอพิจารณา</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile cards */}
              <div className="md:hidden p-3 space-y-2">
                {pendingFiltered.slice(0, 5).map((r) => {
                  const sc = getStatusConfig(r.status);
                  return (
                    <div key={r.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors space-y-2" onClick={() => setSelectedRequest(r)}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1.5 rounded-lg bg-[#f5a623]/10 shrink-0"><Coins className="w-3.5 h-3.5 text-[#f5a623]" /></div>
                          <div className="min-w-0">
                            <p className="text-sm text-[#5e5873] truncate">{r.patientName}</p>
                            <p className="text-xs text-gray-400">{r.hn}</p>
                          </div>
                        </div>
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap shrink-0", sc.bg, sc.color)}>{sc.label}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 truncate">{r.fundType}</span>
                        <span className="text-[#f5a623]">฿{r.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== LIST VIEW — TABLE (desktop) + CARD (mobile) ===== */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm text-gray-600">รายการคำขอทุน</h3>
            <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length} รายการ</span>
          </div>

          {/* Desktop: Table */}
          <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EDE9FE]/30">
                    <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย / หน่วยงาน</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">แหล่งทุน</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead>
                    <TableHead className="text-xs text-[#5e5873] text-right">จำนวนเงิน</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">วันที่ขอ</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">ความเร่งด่วน</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                    <TableHead className="text-xs text-[#5e5873] w-[110px]">ดำเนินการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const sc = getStatusConfig(r.status);
                    const uc = getUrgencyConfig(r.urgency);
                    return (
                      <TableRow key={r.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => setSelectedRequest(r)}>
                        <TableCell>
                          <div className="text-sm text-[#5e5873]">{r.patientName}</div>
                          <div className="text-xs text-gray-400">HN: {r.hn}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Coins size={14} className={ICON.text} />
                            <span className="text-sm text-[#5e5873]">{r.fundType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{r.hospital}</TableCell>
                        <TableCell className="text-right text-[#f5a623]">฿{r.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-gray-500">{formatThaiShortDate(r.requestDate)}</TableCell>
                        <TableCell><span className={cn("px-2 py-1 rounded-full text-xs", uc.bg, uc.color)}>{uc.label}</span></TableCell>
                        <TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {r.status === 'Pending' && (
                              <div className="flex gap-1">
                                <button className="w-8 h-8 rounded-lg bg-green-50 text-[#28c76f] hover:bg-green-100 flex items-center justify-center" onClick={() => handleApprove(r)} title="อนุมัติ"><Check size={16} /></button>
                                <button className="w-8 h-8 rounded-lg bg-red-50 text-[#EA5455] hover:bg-red-100 flex items-center justify-center" onClick={() => { setSelectedRequest(r); setIsRejectDialogOpen(true); }} title="ปฏิเสธ"><X size={16} /></button>
                              </div>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10" onClick={() => setSelectedRequest(r)}><Eye size={16} /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Coins className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>ไม่พบรายการคำขอทุน</p>
              </div>
            )}
          </Card>

          {/* Mobile: Card-based list */}
          <div className="md:hidden space-y-3">
            {filtered.map((r) => {
              const sc = getStatusConfig(r.status);
              const uc = getUrgencyConfig(r.urgency);
              return (
                <Card key={r.id} className="border-gray-100 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedRequest(r)}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-[#f5a623]/10 shrink-0"><Coins className="w-4 h-4 text-[#f5a623]" /></div>
                        <div className="min-w-0">
                          <p className="text-sm text-[#5e5873] truncate">{r.patientName}</p>
                          <p className="text-xs text-gray-400">HN: {r.hn}</p>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs whitespace-nowrap shrink-0", sc.bg, sc.color)}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1"><Building2 size={12} className="text-[#7367f0]" /><span className="truncate max-w-[100px]">{r.hospital}</span></div>
                      <div className="flex items-center gap-1"><Calendar size={12} className="text-gray-400" /><span>{formatThaiShortDate(r.requestDate)}</span></div>
                      <span className={cn("px-1.5 py-0.5 rounded-full text-[10px]", uc.bg, uc.color)}>{uc.label}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-xs text-gray-500 truncate max-w-[140px]">{r.fundType}</span>
                      <span className="text-sm text-[#f5a623]">฿{r.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Coins className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>ไม่พบรายการคำขอทุน</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen && !selectedRequest?.status?.includes('view')} onOpenChange={(open) => { if (!open) { setIsRejectDialogOpen(false); setRejectReason(''); } }}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#5e5873]">เหตุผลในการปฏิเสธ</DialogTitle>
          </DialogHeader>
          <Textarea placeholder="กรุณาระบุเหตุผล..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="min-h-[100px]" />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRejectDialogOpen(false); setRejectReason(''); }}>ยกเลิก</Button>
            <Button className="bg-[#EA5455] hover:bg-red-600 text-white" onClick={handleReject} disabled={!rejectReason}>ยืนยันปฏิเสธ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}