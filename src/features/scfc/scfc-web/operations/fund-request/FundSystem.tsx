import React, { useState } from 'react';
import { FundRequestDetailPage } from "./FundRequestDetailPage";
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Upload, 
  Calendar as CalendarIcon,
  MoreHorizontal,
  Edit, 
  Trash2, 
  User, 
  Activity, 
  Info, 
  Paperclip, 
  Coins, 
  Clock, 
  TrendingUp, 
  Building2, 
  MapPin, 
  PieChart as PieChartIcon, 
  LayoutDashboard, 
  Inbox, 
  Database, 
  Receipt, 
  History as HistoryIcon, 
  ShieldCheck, 
  ChevronRight, 
  Download, 
  Eye, 
  Check, 
  ArrowRight, 
  Hospital as HospitalIcon, 
  ChevronDown, 
  Archive, 
  Flag,
  Printer,
  Mail,
  X,
  FileCheck
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger, DialogClose } from "../../../../../components/ui/dialog";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Separator } from "../../../../../components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { toast } from "sonner";
import { cn } from "../../../../../components/ui/utils";
import { useSystem } from "../../../../../context/SystemContext";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// --- Types ---
type FundStatus = 'Pending' | 'Approved' | 'Rejected' | 'Received' | 'Disbursed';
type UrgencyLevel = 'Normal' | 'Urgent' | 'Emergency';

interface FundSource {
  id: string;
  name: string;
  totalBudget: number;
  disbursed: number;
  status: 'Active' | 'Inactive';
}

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
  receiptUrl?: string;
}

// --- Mock Data ---
const MOCK_SOURCES: FundSource[] = [
  { id: 'S1', name: 'สภากาชาดไทย (Red Cross)', totalBudget: 500000, disbursed: 120000, status: 'Active' },
  { id: 'S2', name: 'มูลนิธิเพื่อผู้ป่วยยากไร้ A', totalBudget: 200000, disbursed: 85000, status: 'Active' },
  { id: 'S3', name: 'กองทุนรัฐบาล (Northern Care)', totalBudget: 1000000, disbursed: 450000, status: 'Active' },
];

const MOCK_REQUESTS: FundRequest[] = [
  {
    id: 'FR-2026-001',
    patientName: 'ด.ช. อนันต์ สุขใจ',
    hn: 'HN12345',
    diagnosis: 'Cleft Lip & Palate',
    fundType: 'สภากาชาดไทย (Red Cross)',
    amount: 15000,
    requestDate: '2026-01-18',
    urgency: 'Emergency',
    hospital: 'รพ.มหาราชนครเชียงใหม่',
    status: 'Pending',
    documents: ['medical_report.pdf', 'house_photo.jpg'],
    history: [
      { date: '2026-01-18 09:00', action: 'Created', user: 'Case Manager A' }
    ]
  },
  {
    id: 'FR-2026-002',
    patientName: 'น.ส. มะลิ แซ่ลี้',
    hn: 'HN67890',
    diagnosis: 'Secondary Deformity',
    fundType: 'Northern Care Fund',
    amount: 25000,
    requestDate: '2026-01-20',
    urgency: 'Urgent',
    hospital: 'รพ.เชียงรายประชานุเคราะห์',
    status: 'Pending',
    documents: ['assessment_form.pdf'],
    history: [
      { date: '2026-01-20 14:30', action: 'Created', user: 'Case Manager B' }
    ]
  },
  {
    id: 'FR-2026-003',
    patientName: 'นาย สมชาย จริงใจ',
    hn: 'HN54321',
    diagnosis: 'Speech Delay Therapy',
    fundType: ' Northern Care Fund',
    amount: 5000,
    requestDate: '2026-01-15',
    urgency: 'Normal',
    hospital: 'รพ.ฝาง',
    status: 'Approved',
    documents: ['therapy_plan.pdf'],
    history: [
      { date: '2026-01-15 10:00', action: 'Created', user: 'Case Manager C' },
      { date: '2026-01-16 11:00', action: 'Approved', user: 'SCFC Admin' }
    ]
  },
  {
    id: 'FR-2026-004',
    patientName: 'นาง สมพร แสงแก้ว',
    hn: 'HN99887',
    diagnosis: 'Post-op Follow-up',
    fundType: 'สภากาชาดไทย (Red Cross)',
    amount: 3000,
    requestDate: '2026-01-10',
    urgency: 'Normal',
    hospital: 'รพ.ลำพูน',
    status: 'Disbursed',
    documents: ['followup_form.pdf'],
    history: [
      { date: '2026-01-10 09:00', action: 'Created', user: 'Case Manager D' },
      { date: '2026-01-11 14:00', action: 'Approved', user: 'SCFC Admin' },
      { date: '2026-01-12 10:00', action: 'Disbursed', user: 'Finance Officer' }
    ]
  },
  {
    id: 'FR-2026-005',
    patientName: 'ด.ญ. กนกพร มีสุข',
    hn: 'HN44556',
    diagnosis: 'Cleft Palate Repair',
    fundType: 'Northern Care Fund',
    amount: 45000,
    requestDate: '2026-01-05',
    urgency: 'Urgent',
    hospital: 'รพ.แม่ฮ่องสอน',
    status: 'Rejected',
    rejectReason: 'รายได้เกินเกณฑ์ที่กำหนด',
    documents: ['assessment.pdf'],
    history: [
      { date: '2026-01-05 08:30', action: 'Created', user: 'Case Manager E' },
      { date: '2026-01-06 16:00', action: 'Rejected', user: 'SCFC Admin' }
    ]
  }
];

const DISTRIBUTION_DATA = [
  { name: 'เชียงใหม่', value: 45 },
  { name: 'เชียงราย', value: 25 },
  { name: 'ลำปาง', value: 15 },
  { name: 'จังหวัดอื่น', value: 15 },
];

const COLORS = ['#0d9488', '#0891b2', '#0f766e', '#115e59'];
const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ["ทุกโรงพยาบาล", "รพ.มหาราชนครเชียงใหม่", "รพ.เชียงรายประชานุเคราะห์", "รพ.ฝาง", "รพ.ลำพูน", "รพ.แม่ฮ่องสอน"];

export default function FundSystem({ onBack }: { onBack: () => void }) {
  const { stats, updateStat } = useSystem();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [approvalView, setApprovalView] = useState<"pending" | "approved_docs">("pending");
  const [requests, setRequests] = useState<FundRequest[]>(MOCK_REQUESTS);
  const [sources, setSources] = useState<FundSource[]>(MOCK_SOURCES);
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [selectedHospital, setSelectedHospital] = useState("ทุกโรงพยาบาล");
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleApprove = (req: FundRequest) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { 
      ...r, 
      status: 'Approved',
      history: [...r.history, { date: new Date().toLocaleString(), action: 'อนุมัติแล้ว', user: 'SCFC Admin' }]
    } : r));
    
    // Update Global Stats
    if (stats?.funds) {
        updateStat('funds', 'granted', (stats.funds.granted || 0) + req.amount);
        updateStat('funds', 'pending', Math.max(0, (stats.funds.pending || 0) - 1));
    }
    
    toast.success("อนุมัติทุนเรียบร้อยแล้ว");
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectReason) return;
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { 
      ...r, 
      status: 'Rejected', 
      rejectReason,
      history: [...r.history, { date: new Date().toLocaleString(), action: 'ปฏิเสธคำขอ', user: 'SCFC Admin' }]
    } : r));
    
    if (stats?.funds) {
        updateStat('funds', 'pending', Math.max(0, (stats.funds.pending || 0) - 1));
    }
    
    toast.error("ปฏิเสธคำขอเรียบร้อยแล้ว");
    setIsRejectDialogOpen(false);
    setSelectedRequest(null);
    setRejectReason("");
  };

  const UrgencyBadge = ({ level }: { level: UrgencyLevel }) => {
    const colors = {
      Normal: "bg-teal-50 text-teal-700 border-teal-100",
      Urgent: "bg-amber-50 text-amber-700 border-amber-100",
      Emergency: "bg-rose-50 text-rose-700 border-rose-100",
    };
    const labels = { Normal: 'ปกติ', Urgent: 'เร่งด่วน', Emergency: 'วิกฤต/เร่งด่วนที่สุด' };
    return <Badge className={cn("border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg", colors[level])}>{labels[level]}</Badge>;
  };

  const StatusBadge = ({ status }: { status: FundStatus }) => {
    const colors = {
      Pending: "bg-amber-100 text-amber-700",
      Approved: "bg-blue-100 text-blue-700",
      Rejected: "bg-rose-100 text-rose-700",
      Received: "bg-purple-100 text-purple-700",
      Disbursed: "bg-emerald-100 text-emerald-700",
    };
    const labels = {
      Pending: "รอพิจารณา",
      Approved: "อนุมัติแล้ว",
      Rejected: "ปฏิเสธ",
      Received: "ได้รับเงินแล้ว",
      Disbursed: "จ่ายเงินแล้ว",
    };
    return <Badge className={cn("border-none text-[10px] font-black tracking-widest px-2 rounded-lg", colors[status])}>{labels[status]}</Badge>;
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.hn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHospital = selectedHospital === "ทุกโรงพยาบาล" || r.hospital === selectedHospital;
    return matchesSearch && matchesHospital;
  });

  const pendingRequests = filteredRequests.filter(r => r.status === 'Pending');
  const approvedRequests = filteredRequests.filter(r => r.status === 'Approved' || r.status === 'Received');
  const finalizedRequests = filteredRequests.filter(r => r.status === 'Disbursed' || r.status === 'Rejected');

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (list: FundRequest[]) => {
    const listIds = list.map(r => r.id);
    const allSelected = listIds.length > 0 && listIds.every(id => selectedItems.includes(id));
    if (allSelected) {
      setSelectedItems(prev => prev.filter(id => !listIds.includes(id)));
    } else {
      setSelectedItems(prev => [...new Set([...prev, ...listIds])]);
    }
  };

  const handleBatchPrint = () => {
    toast.success(`กำลังเตรียมพิมพ์เอกสาร (${selectedItems.length} รายการ)`, {
      description: "ระบบกำลังสร้างไฟล์สำหรับพิมพ์ชุดคำขอทุน"
    });
  };

  const handleBatchNotify = () => {
    toast.info(`ส่งการแจ้งเตือนไปยังผู้เกี่ยวข้อง ${selectedItems.length} ท่าน`, {
      description: "ระบบกำลังส่งสถานะการอนุมัติทุนผ่านช่องทางที่กำหนด"
    });
  };

  const BatchActions = ({ list }: { list: FundRequest[] }) => {
    const listSelected = selectedItems.filter(id => list.some(r => r.id === id));
    if (listSelected.length === 0) return null;

    return (
      <div className="flex items-center gap-3 animate-in slide-in-from-right-2">
         <div className="flex flex-col items-end mr-2">
            <span className="text-[14px] font-black text-slate-700 leading-none">{listSelected.length}</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">เลือกแล้ว</span>
         </div>
         <Separator orientation="vertical" className="h-8 bg-slate-200" />
         <Button onClick={handleBatchNotify} variant="outline" size="sm" className="h-10 border-blue-200 text-blue-600 bg-blue-50/50 text-[10px] font-black tracking-widest hover:bg-blue-600 hover:text-white transition-all rounded-xl px-4">
           <Mail size={14} className="mr-1.5" /> ส่งการแจ้งเตือน
         </Button>
         <Button onClick={handleBatchPrint} variant="outline" size="sm" className="h-10 border-slate-200 text-slate-600 bg-white text-[10px] font-black tracking-widest hover:bg-slate-900 hover:text-white transition-all rounded-xl px-4">
           <Printer size={14} className="mr-1.5" /> พิมพ์เอกสาร (ชุด)
         </Button>
         <Button onClick={() => setSelectedItems(prev => prev.filter(id => !list.some(r => r.id === id)))} variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
           <X size={18} />
         </Button>
      </div>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700 font-sans">
      {selectedRequest ? (
        <FundRequestDetailPage 
          request={selectedRequest}
          onBack={() => setSelectedRequest(null)}
          onApprove={() => handleApprove(selectedRequest)}
          onReject={() => setIsRejectDialogOpen(true)}
        />
      ) : (
        <>
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
               <div className="flex items-center gap-2 mb-1">
                 <div className="bg-teal-600 text-white p-1 rounded-lg shadow-sm">
                   <ShieldCheck size={16} />
                 </div>
                 <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">SCFC Financial Hub</span>
               </div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">ระบบบริหาร <span className="text-teal-600">จัดการทุนสนับสนุน</span></h1>
               <p className="text-slate-500 text-sm font-medium">ศูนย์กลางการพิจารณาและจัดสรรทุนสำหรับผู้ป่วยยากไร้ในเครือข่าย</p>
            </div>
            <div className="flex flex-wrap gap-3">
               <div className="flex items-center gap-2 text-xs font-bold mr-4 self-center">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px]">สถานะงบประมาณ:</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    พร้อมจัดสรร
                  </span>
               </div>
               
               <Button variant="outline" size="sm" className="h-12 border-slate-200 text-slate-600 font-black text-[11px] px-5 bg-white shadow-sm rounded-2xl transition-all hover:bg-slate-50 uppercase tracking-widest" onClick={onBack}>
                 <ArrowLeft size={16} className="mr-2" /> ย้อนกลับ
               </Button>
               
               <Button className="h-12 bg-teal-600 hover:bg-teal-700 text-white font-black text-[11px] px-6 shadow-xl shadow-teal-600/20 rounded-2xl uppercase tracking-widest transition-all">
                 <Download size={18} className="mr-2" /> รายงานสรุปทุน
               </Button>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-none shadow-xl shadow-teal-600/5 bg-white border-l-4 border-l-teal-600 rounded-[2rem] transition-all hover:translate-y-[-4px]">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-teal-50 p-3 rounded-2xl border border-teal-100 text-teal-600">
                   <TrendingUp size={22} />
                 </div>
                 <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">Granted</div>
               </div>
               <div>
                 <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">งบประมาณจัดสรรแล้ว</h3>
                 <div className="text-2xl font-black text-slate-900 tracking-tight">฿{((stats?.funds?.granted) || 500000).toLocaleString()}</div>
                 <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">Total Funds Granted</p>
               </div>
            </Card>

            <Card className="p-6 border-none shadow-xl shadow-amber-600/5 bg-white border-l-4 border-l-amber-500 rounded-[2rem] transition-all hover:translate-y-[-4px]">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 text-amber-600">
                   <Clock size={22} />
                 </div>
                 <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase">Urgent</div>
               </div>
               <div>
                 <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">คำขอที่รอการพิจารณา</h3>
                 <div className="text-2xl font-black text-slate-900 tracking-tight">{stats?.funds?.pending || 12} รายการ</div>
                 <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">Pending Approval</p>
               </div>
            </Card>

            <Card className="p-6 border-none shadow-xl shadow-blue-600/5 bg-white border-l-4 border-l-blue-600 rounded-[2rem] transition-all hover:translate-y-[-4px]">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-blue-600">
                   <Database size={22} />
                 </div>
               </div>
               <div>
                 <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">แหล่งทุนที่เปิดใช้งาน</h3>
                 <div className="text-2xl font-black text-slate-900 tracking-tight">{stats?.funds?.activeSources || 3} แหล่งทุน</div>
                 <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">Active Fund Sources</p>
               </div>
            </Card>

            <Card className="p-6 border-none shadow-xl shadow-purple-600/5 bg-white border-l-4 border-l-purple-600 rounded-[2rem] transition-all hover:translate-y-[-4px]">
               <div className="flex justify-between items-start mb-4">
                 <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 text-purple-600">
                   <Activity size={22} />
                 </div>
               </div>
               <div>
                 <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">สัดส่วนการเบิกจ่าย</h3>
                 <div className="text-2xl font-black text-slate-900 tracking-tight">{stats?.funds?.disbursementRate || 85}%</div>
                 <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">Disbursement Rate</p>
               </div>
            </Card>
          </div>

          {/* 🎯 Master UI Container (Search & Menu grouping) */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-wrap items-center gap-6 transition-all hover:shadow-2xl hover:shadow-teal-600/5 ring-1 ring-slate-200/50 animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="flex-1 min-w-[320px] relative group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                 <input 
                   type="text"
                   placeholder="ค้นหาชื่อผู้ป่วย, HN, หรือรหัสคำขอทุน..." 
                   className="w-full pl-12 pr-4 h-14 bg-slate-50/50 border-slate-200/60 focus:bg-white focus:ring-4 focus:ring-teal-500/5 transition-all rounded-[1.25rem] font-bold text-base outline-none border"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               
               <div className="flex items-center gap-4">
                  <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                    <SelectTrigger className="w-[160px] h-14 bg-white border-slate-200/60 text-xs font-black uppercase tracking-widest rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-teal-500/5 transition-all">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-teal-600" />
                        <SelectValue placeholder="จังหวัด" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl font-sans">
                      {PROVINCES.map(p => <SelectItem key={p} value={p} className="font-bold text-xs text-slate-700 py-3">{p}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                    <SelectTrigger className="w-[180px] h-14 bg-white border-slate-200/60 text-xs font-black uppercase tracking-widest rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-teal-500/5 transition-all">
                      <div className="flex items-center gap-3">
                        <HospitalIcon size={18} className="text-teal-600" />
                        <SelectValue placeholder="โรงพยาบาล" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl font-sans">
                      {HOSPITALS.map(h => <SelectItem key={h} value={h} className="font-bold text-xs text-slate-700 py-3">{h}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select defaultValue="ทุกแหล่งทุน">
                    <SelectTrigger className="w-[180px] h-14 bg-white border-slate-200/60 text-xs font-black uppercase tracking-widest rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-teal-500/5 transition-all">
                      <div className="flex items-center gap-3">
                        <Coins size={18} className="text-teal-600" />
                        <SelectValue placeholder="แหล่งทุน" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl font-sans">
                      <SelectItem value="ทุกแหล่งทุน" className="font-bold text-xs py-3">ทุกแหล่งทุน</SelectItem>
                      <SelectItem value="สภากาชาดไทย" className="font-bold text-xs py-3">สภากาชาดไทย</SelectItem>
                      <SelectItem value="Northern Care Fund" className="font-bold text-xs py-3">Northern Care Fund</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-14 bg-white border-slate-200/60 text-xs font-black uppercase tracking-widest px-6 rounded-[1.25rem] shadow-sm hover:bg-slate-50 transition-all border-dashed">
                        <CalendarIcon size={18} className="mr-3 text-teal-600" />
                        {format(new Date(selectedDate), "d MMM yyyy", { locale: th })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-[2rem] overflow-hidden shadow-2xl border-none ring-1 ring-slate-200/50" align="end">
                      <CalendarPicker 
                        mode="single" 
                        selected={new Date(selectedDate)} 
                        onSelect={(d) => d && setSelectedDate(format(d, "yyyy-MM-dd"))} 
                        locale={th}
                        className="p-4"
                      />
                    </PopoverContent>
                  </Popover>
               </div>
             </div>

             {/* Tab Menu Box */}
             <div className="bg-white px-8 py-4 rounded-[1.25rem] shadow-xl shadow-slate-200/20 border border-slate-100 flex items-center animate-in fade-in slide-in-from-top-2 duration-700">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                   <TabsList className="bg-transparent h-auto p-0 flex flex-wrap gap-12">
                      <TabsTrigger 
                        value="dashboard" 
                        className="p-0 h-auto bg-transparent border-none font-black text-[15px] data-[state=active]:text-teal-600 text-slate-900 transition-all shadow-none hover:text-teal-500 uppercase tracking-tight"
                      >
                        ภาพรวม
                      </TabsTrigger>
                      <TabsTrigger 
                        value="approvals" 
                        className="p-0 h-auto bg-transparent border-none font-black text-[15px] text-orange-500 data-[state=active]:text-orange-600 transition-all shadow-none hover:text-orange-400 uppercase tracking-tight"
                      >
                        รออนุมัติ ({stats?.funds?.pending || 12})
                      </TabsTrigger>
                      <TabsTrigger 
                        value="sources" 
                        className="p-0 h-auto bg-transparent border-none font-black text-[15px] data-[state=active]:text-teal-600 text-slate-900 transition-all shadow-none hover:text-teal-500 uppercase tracking-tight"
                      >
                        คลังแหล่งทุน
                      </TabsTrigger>
                      <TabsTrigger 
                        value="history" 
                        className="p-0 h-auto bg-transparent border-none font-black text-[15px] data-[state=active]:text-teal-600 text-slate-900 transition-all shadow-none hover:text-teal-500 uppercase tracking-tight ml-auto"
                      >
                        ประวัติ
                      </TabsTrigger>
                   </TabsList>
                </Tabs>
             </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
               <Tabs value={activeTab} className="w-full space-y-8">
                  <TabsContent value="dashboard" className="space-y-8 mt-0 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <Card className="shadow-sm border-slate-200 rounded-[2.5rem] bg-white overflow-hidden transition-all hover:shadow-xl hover:shadow-teal-600/5">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                          <CardTitle className="text-base font-black flex items-center gap-2 uppercase tracking-widest">
                            <MapPin className="w-5 h-5 text-teal-600" /> การกระจายทุนรายจังหวัด
                          </CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-tighter pt-1">Geographical Fund Distribution (Northern)</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px] py-8" style={{ width: '100%', height: '350px', minWidth: 0 }}>
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                            <PieChart>
                              <Pie
                                data={DISTRIBUTION_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                              >
                                {DISTRIBUTION_DATA.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card className="shadow-sm border-slate-200 rounded-[2.5rem] bg-white overflow-hidden transition-all hover:shadow-xl hover:shadow-teal-600/5">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                          <CardTitle className="text-base font-black flex items-center gap-2 uppercase tracking-widest">
                            <Activity className="w-5 h-5 text-teal-600" /> ประวัติการพิจารณาล่าสุด
                          </CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-tighter pt-1">Recent Financial Audit Trail</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ScrollArea className="h-[350px]">
                            <div className="p-8 space-y-6">
                              {requests.flatMap(r => r.history).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log, i) => (
                                <div key={i} className="flex items-start gap-5 border-b border-slate-50 pb-6 last:border-0">
                                  <div className="bg-teal-50 p-3 rounded-2xl border border-teal-100 text-teal-600 shadow-sm transition-transform hover:scale-110">
                                    <Activity className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-[13px] font-black text-slate-800 tracking-tight leading-none mb-2">{log.action}</p>
                                    <div className="flex items-center gap-2">
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{log.user}</p>
                                       <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{log.date}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="approvals" className="space-y-6 mt-0 outline-none">
                    {/* View Switcher */}
                    <div className="flex p-1 bg-slate-100/80 rounded-2xl w-fit">
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => setApprovalView("pending")}
                         className={cn(
                           "rounded-xl text-[11px] font-black uppercase tracking-widest h-9 px-4 transition-all",
                           approvalView === "pending" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
                         )}
                       >
                         รายการรอพิจารณา
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm"
                         onClick={() => setApprovalView("approved_docs")}
                         className={cn(
                           "rounded-xl text-[11px] font-black uppercase tracking-widest h-9 px-4 transition-all",
                           approvalView === "approved_docs" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                         )}
                       >
                         อนุมัติแล้ว (รอเอกสาร)
                       </Button>
                    </div>

                    {approvalView === "pending" && (
                      <Card className="shadow-sm border-slate-200 overflow-hidden bg-white rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-2">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 px-10 flex items-center justify-between min-h-[100px]">
                          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Pending Approvals Pipeline</CardTitle>
                          <BatchActions list={pendingRequests} />
                        </CardHeader>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader className="bg-slate-50/30">
                              <TableRow>
                                <TableHead className="w-14 px-10 text-center">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                                    checked={pendingRequests.length > 0 && pendingRequests.every(r => selectedItems.includes(r.id))}
                                    onChange={() => toggleSelectAll(pendingRequests)}
                                  />
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14">Priority</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14">ID</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14">Patient Information</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14 text-right">Fund Amount</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14 text-center">Status</TableHead>
                                <TableHead className="w-10 px-10"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pendingRequests.map((req) => (
                                <TableRow 
                                  key={req.id} 
                                  className={cn("cursor-pointer hover:bg-teal-50/30 transition-all group border-b border-slate-50", selectedItems.includes(req.id) && "bg-teal-50/50")}
                                  onClick={() => setSelectedRequest(req)}
                                >
                                  <TableCell className="px-10 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                                      checked={selectedItems.includes(req.id)}
                                      onChange={() => toggleSelectItem(req.id)}
                                    />
                                  </TableCell>
                                  <TableCell><UrgencyBadge level={req.urgency} /></TableCell>
                                  <TableCell className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.id}</TableCell>
                                  <TableCell>
                                    <div className="py-6">
                                      <p className="font-black text-slate-800 text-base tracking-tight mb-1 group-hover:text-teal-700 transition-colors">{req.patientName}</p>
                                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">HN: {req.hn} | {req.hospital}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right font-black text-teal-600 text-[15px] tracking-tight italic">฿{req.amount.toLocaleString()}</TableCell>
                                  <TableCell className="text-center"><StatusBadge status={req.status} /></TableCell>
                                  <TableCell className="px-10">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-teal-600 group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm" onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}>
                                       <ChevronRight className="w-5 h-5" />
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Card>
                    )}

                    {approvalView === "approved_docs" && (
                      <Card className="shadow-sm border-slate-200 overflow-hidden bg-white rounded-[2.5rem] border-t-4 border-t-blue-500 animate-in fade-in slide-in-from-bottom-2">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 px-10 flex flex-row items-center justify-between min-h-[100px]">
                          <div className="flex flex-col gap-1">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                              <Flag size={18} /> อนุมัติแล้ว (รอเอกสาร/หลักฐาน)
                            </CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Requests waiting for financial documentation</CardDescription>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <BatchActions list={approvedRequests} />
                            <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-black px-4 py-1.5 rounded-full text-xs">
                              {approvedRequests.length} รายการ
                            </Badge>
                          </div>
                        </CardHeader>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader className="bg-slate-50/30">
                              <TableRow>
                                <TableHead className="w-14 px-10 text-center">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                                    checked={approvedRequests.length > 0 && approvedRequests.every(r => selectedItems.includes(r.id))}
                                    onChange={() => toggleSelectAll(approvedRequests)}
                                  />
                                </TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14">ID</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14">Patient Information</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14">Hospital</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14 text-right">Fund Amount</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14 text-center">Status</TableHead>
                                <TableHead className="w-10 px-10"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {approvedRequests.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="h-32 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px] italic">
                                    ไม่มีรายการที่รอเอกสาร
                                  </TableCell>
                                </TableRow>
                              ) : (
                                approvedRequests.map((req) => (
                                  <TableRow 
                                    key={req.id} 
                                    className={cn("cursor-pointer hover:bg-blue-50/30 transition-all group border-b border-slate-50", selectedItems.includes(req.id) && "bg-blue-50/50")}
                                    onClick={() => setSelectedRequest(req)}
                                  >
                                    <TableCell className="px-10 text-center" onClick={(e) => e.stopPropagation()}>
                                      <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                                        checked={selectedItems.includes(req.id)}
                                        onChange={() => toggleSelectItem(req.id)}
                                      />
                                    </TableCell>
                                    <TableCell className="font-mono text-[10px] font-bold text-slate-400 px-10">{req.id}</TableCell>
                                    <TableCell>
                                      <div className="py-5">
                                        <p className="font-black text-slate-800 text-sm tracking-tight mb-0.5 group-hover:text-blue-700 transition-colors">{req.patientName}</p>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">HN: {req.hn}</p>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-[11px] font-bold text-slate-600">{req.hospital}</TableCell>
                                    <TableCell className="text-right font-black text-blue-600 text-[14px]">฿{req.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-center"><StatusBadge status={req.status} /></TableCell>
                                    <TableCell className="px-10">
                                      <div onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-all" />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="sources" className="mt-0 outline-none">
                     <Card className="shadow-sm border-slate-200 rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-8 px-10">
                          <div>
                             <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">Fund Sources Portfolio</CardTitle>
                             <CardDescription className="text-[10px] font-bold uppercase tracking-widest pt-1">Management of Active Funding Entities</CardDescription>
                          </div>
                          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl px-6 h-12 shadow-lg shadow-teal-600/20 transition-all active:scale-95">
                             <Plus size={18} className="mr-2" /> เพิ่มแหล่งทุนใหม่
                          </Button>
                        </CardHeader>
                        <CardContent className="p-10">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {sources.map((source) => (
                                <div key={source.id} className="p-8 rounded-[2rem] border-2 border-slate-50 bg-white shadow-sm hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-600/5 transition-all group relative overflow-hidden ring-1 ring-slate-100/50">
                                   <div className="flex justify-between items-start mb-8">
                                      <Badge variant="outline" className={cn("border-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg", source.status === 'Active' ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-400")}>{source.status}</Badge>
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                         <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-teal-600 rounded-xl bg-slate-50 transition-all"><Edit className="w-5 h-5" /></Button>
                                         <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-600 rounded-xl bg-slate-50 transition-all"><Trash2 className="w-5 h-5" /></Button>
                                      </div>
                                   </div>
                                   <h4 className="font-black text-slate-800 text-xl mb-8 tracking-tight">"{source.name}"</h4>
                                   <div className="space-y-8">
                                      <div className="space-y-3">
                                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span>Budget Usage</span>
                                            <span className="text-teal-600 font-black">{Math.round((source.disbursed / source.totalBudget) * 100)}%</span>
                                         </div>
                                         <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                                            <div 
                                              className="bg-teal-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(20,184,166,0.4)] rounded-full" 
                                              style={{ width: `${(source.disbursed / source.totalBudget) * 100}%` }}
                                            />
                                         </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-50 mt-6">
                                         <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Total Grant</p>
                                            <p className="text-lg font-black text-slate-800 tracking-tight leading-none">฿{source.totalBudget.toLocaleString()}</p>
                                         </div>
                                         <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Disbursed</p>
                                            <p className="text-lg font-black text-teal-600 tracking-tight leading-none">฿{source.disbursed.toLocaleString()}</p>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </CardContent>
                     </Card>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-12 mt-0 outline-none">
                    {/* 📋 Table 2: จบ flow ระบบขอทุน (เสร็จสิ้น / ถูกปฏิเสธ) */}
                    <Card className="shadow-sm border-slate-200 overflow-hidden bg-white rounded-[2.5rem] border-t-4 border-t-slate-800">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 px-10 flex flex-row items-center justify-between min-h-[100px]">
                        <div className="flex flex-col gap-1">
                          <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
                            <Archive size={18} /> จบ flow ระบบขอทุน (เสร็จสิ้น / ถูกปฏิเสธ)
                          </CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Archived requests - Completed or Rejected</CardDescription>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <BatchActions list={finalizedRequests} />
                          <Badge className="bg-slate-100 text-slate-600 border-slate-200 font-black px-4 py-1.5 rounded-full text-xs">
                            {finalizedRequests.length} รายการ
                          </Badge>
                        </div>
                      </CardHeader>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-slate-50/30">
                            <TableRow>
                              <TableHead className="w-14 px-10 text-center">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                                  checked={finalizedRequests.length > 0 && finalizedRequests.every(r => selectedItems.includes(r.id))}
                                  onChange={() => toggleSelectAll(finalizedRequests)}
                                />
                              </TableHead>
                              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14 px-10">ID</TableHead>
                              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14">Patient Information</TableHead>
                              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14">Hospital</TableHead>
                              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14 text-right">Fund Amount</TableHead>
                              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-14 text-center">Status</TableHead>
                              <TableHead className="w-10 px-10"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {finalizedRequests.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px] italic">
                                  ไม่มีรายการที่จบ flow
                                </TableCell>
                              </TableRow>
                            ) : (
                              finalizedRequests.map((req) => (
                                <TableRow 
                                  key={req.id} 
                                  className={cn("cursor-pointer hover:bg-slate-50 transition-all group border-b border-slate-100", selectedItems.includes(req.id) && "bg-slate-50")}
                                  onClick={() => setSelectedRequest(req)}
                                >
                                  <TableCell className="px-10 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="checkbox" 
                                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                                      checked={selectedItems.includes(req.id)}
                                      onChange={() => toggleSelectItem(req.id)}
                                    />
                                  </TableCell>
                                  <TableCell className="font-mono text-[10px] font-bold text-slate-400 px-10">{req.id}</TableCell>
                                  <TableCell>
                                    <div className="py-5">
                                      <p className="font-black text-slate-800 text-sm tracking-tight mb-0.5">{req.patientName}</p>
                                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">HN: {req.hn}</p>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-[11px] font-bold text-slate-600">{req.hospital}</TableCell>
                                  <TableCell className="text-right font-black text-slate-600 text-[14px]">฿{req.amount.toLocaleString()}</TableCell>
                                  <TableCell className="text-center"><StatusBadge status={req.status} /></TableCell>
                                  <TableCell className="px-10">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm" onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}>
                                      <ChevronRight className="w-5 h-5" />
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </Card>
                  </TabsContent>
               </Tabs>
            </div>

            <div className="space-y-8">
               <Card className="p-8 border-slate-200 shadow-sm bg-white rounded-[2.5rem] transition-all hover:shadow-xl hover:shadow-teal-600/5 hover:border-teal-200 ring-1 ring-slate-100 border-t-4 border-t-teal-600">
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-teal-600" /> Executive Financial Overview
                  </h3>
                  <div className="space-y-10">
                     <div className="flex justify-between items-end">
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Combined Budget</p>
                           <p className="text-4xl font-black text-slate-900 tracking-tight leading-none">฿{(sources.reduce((a, b) => a + b.totalBudget, 0)).toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="p-6 bg-teal-50/50 rounded-[2rem] border-2 border-teal-100 flex items-center justify-between shadow-inner transition-colors hover:bg-teal-50">
                        <div className="space-y-1.5">
                           <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Net Available Funds</p>
                           <p className="text-2xl font-black text-teal-800 tracking-tight leading-none">฿{(sources.reduce((a, b) => a + (b.totalBudget - b.disbursed), 0)).toLocaleString()}</p>
                        </div>
                        <Activity className="text-teal-400 transition-transform hover:rotate-12" size={36} />
                     </div>
                     <Separator className="bg-slate-50" />
                     <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Breakdown by Entity</p>
                        {sources.map(s => (
                           <div key={s.id} className="flex items-center justify-between text-xs font-black text-slate-700 hover:text-teal-600 transition-colors">
                              <span className="truncate max-w-[180px] uppercase tracking-tighter">{s.name}</span>
                              <span className="text-slate-900 font-black bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">฿{s.totalBudget.toLocaleString()}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        </>
      )}

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-3xl border-none shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
               <AlertCircle className="text-rose-600" /> ปฏิเสธคำขอทุน
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              โปรดระบุเหตุผลในการปฏิเสธคำขอ เพื่อแจ้งให้ผู้ขอทุนทราบ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-xs font-bold text-slate-700">เหตุผลการปฏิเสธ</Label>
              <Textarea
                id="reason"
                placeholder="เช่น เอกสารไม่ครบถ้วน, ไม่อยู่ในเกณฑ์การพิจารณา..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px] rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} className="rounded-xl border-slate-200 font-bold">ยกเลิก</Button>
            <Button onClick={handleReject} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-600/20">ยืนยันการปฏิเสธ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
