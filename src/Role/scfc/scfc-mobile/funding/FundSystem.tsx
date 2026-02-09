import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Coins, 
  Building2, 
  MapPin, 
  ArrowRight,
  ChevronDown,
  Database,
  Calendar
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { toast } from "sonner";
import { FundList } from "./FundList";
import { FundDetailMobile, FundRequest, FundStatus, UrgencyLevel } from "./FundDetailMobile";

// --- Mock Data ---
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
  { name: 'เชียงใหม่', value: 45, color: '#0d9488' },
  { name: 'เชียงราย', value: 25, color: '#0891b2' },
  { name: 'ลำปาง', value: 15, color: '#0f766e' },
  { name: 'อื่นๆ', value: 15, color: '#115e59' },
];

const FILTER_OPTIONS = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'pending', label: 'รอพิจารณา' },
    { id: 'approved', label: 'อนุมัติแล้ว' },
    { id: 'rejected', label: 'ปฏิเสธ' }
];

const PROVINCES = ["ทุกจังหวัด", "เชียงใหม่", "เชียงราย", "ลำพูน", "ลำปาง", "พะเยา", "แพร่", "น่าน", "แม่ฮ่องสอน"];
const HOSPITALS = ["ทุกโรงพยาบาล", "รพ.มหาราชนครเชียงใหม่", "รพ.เชียงรายประชานุเคราะห์", "รพ.ฝาง", "รพ.ลำพูน", "รพ.แม่ฮ่องสอน"];

export default function FundSystem({ onBack }: { onBack: () => void }) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail'>('dashboard');
  const [requests, setRequests] = useState<FundRequest[]>(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<FundRequest | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState("ทุกจังหวัด");
  const [selectedHospital, setSelectedHospital] = useState("ทุกโรงพยาบาล");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Stats
  const stats = {
      granted: 500000,
      pending: requests.filter(r => r.status === 'Pending').length,
      activeSources: 3,
      disbursementRate: 85
  };

  const filteredRequests = requests.filter(r => {
      const matchesSearch = !searchQuery || r.patientName.includes(searchQuery) || r.hn.includes(searchQuery);
      return matchesSearch;
  });

  const handleSelectRequest = (req: FundRequest) => {
      setSelectedRequest(req);
      setCurrentView('detail');
  };

  const handleApprove = (req: FundRequest) => {
      setRequests(prev => prev.map(r => r.id === req.id ? { 
        ...r, 
        status: 'Approved' as FundStatus,
        history: [...r.history, { date: new Date().toLocaleString(), action: 'อนุมัติแล้ว', user: 'SCFC Admin' }]
      } : r));
      toast.success("อนุมัติทุนเรียบร้อยแล้ว");
      setCurrentView('list');
  };

  const handleReject = () => {
      if (!selectedRequest) return;
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { 
        ...r, 
        status: 'Rejected' as FundStatus,
        history: [...r.history, { date: new Date().toLocaleString(), action: 'ปฏิเสธคำขอ', user: 'SCFC Admin' }]
      } : r));
      toast.error("ปฏิเสธคำขอเรียบร้อยแล้ว");
      setCurrentView('list');
  };
  
  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  // --- Views ---

  if (currentView === 'detail' && selectedRequest) {
      return (
          <FundDetailMobile 
            request={selectedRequest} 
            onBack={() => setCurrentView('list')} 
            onApprove={handleApprove}
            onReject={handleReject}
          />
      );
  }

  if (currentView === 'list') {
      return (
          <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
             {/* Header List View */}
            <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => setCurrentView('dashboard')} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">รายการขอทุน</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ทั้งหมด {filteredRequests.length} รายการ</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto">

                <FundList 
                    data={filteredRequests} 
                    onSelect={handleSelectRequest} 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>
          </div>
      );
  }

  // --- Dashboard View ---
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
       {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
             <ArrowLeft size={20} />
          </button>
          <div>

            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">จัดการทุน</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg border border-emerald-100">
                <Coins size={18} />
            </div>
        </div>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
         
         {/* Filter Section */}
         <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             
             {/* Province & Hospital Filter */}
             <div className="grid grid-cols-2 gap-3">
                {/* Province Filter */}
                <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                    <PopoverTrigger asChild>
                        <button className="relative w-full h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all active:scale-95">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none">
                                 <MapPin size={18} />
                             </div>
                             <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">
                                 {selectedProvince === 'ทุกจังหวัด' ? 'ทุกจังหวัด' : selectedProvince}
                             </span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                 <ChevronDown size={18} />
                             </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                         <div className="flex flex-col">
                             <button
                                  onClick={() => { setSelectedProvince('ทุกจังหวัด'); setIsProvinceOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedProvince === 'ทุกจังหวัด' ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50"
                                  )}
                              >
                                  ทุกจังหวัด
                              </button>
                             {PROVINCES.filter(p => p !== 'ทุกจังหวัด').map(p => (
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
                        <button className="relative w-full h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all active:scale-95">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none">
                                 <Building2 size={18} />
                             </div>
                             <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">
                                 {selectedHospital === 'ทุกโรงพยาบาล' ? 'ทุกโรงพยาบาล' : selectedHospital}
                             </span>
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                 <ChevronDown size={18} />
                             </div>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                         <div className="flex flex-col">
                             <button
                                  onClick={() => { setSelectedHospital('ทุกโรงพยาบาล'); setIsHospitalOpen(false); }}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                      selectedHospital === 'ทุกโรงพยาบาล' ? "bg-teal-50 text-teal-600" : "text-slate-700 hover:bg-slate-50"
                                  )}
                              >
                                  ทุกโรงพยาบาล
                              </button>
                             {HOSPITALS.filter(h => h !== 'ทุกโรงพยาบาล').map(h => (
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

             <div className="pt-1">
                <Button 
                    onClick={() => setCurrentView('list')}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-12 text-base font-bold shadow-md shadow-teal-100 flex items-center justify-center gap-2"
                >
                    ดูรายการทั้งหมด
                    <ArrowRight size={18} />
                </Button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-teal-100 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                     <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                         <TrendingUp size={16} />
                     </div>
                 </div>
                 <span className="text-xl font-black text-slate-800 leading-none">฿{stats.granted.toLocaleString()}</span>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">จัดสรรแล้ว</p>
             </div>

             <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                     <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                         <Clock size={16} />
                     </div>
                     {stats.pending > 0 && (
                         <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded animate-pulse">{stats.pending} รอ</span>
                     )}
                 </div>
                 <span className="text-xl font-black text-slate-800 leading-none">{stats.pending}</span>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">รออนุมัติ</p>
             </div>

             <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                     <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                         <Database size={16} />
                     </div>
                 </div>
                 <span className="text-xl font-black text-slate-800 leading-none">{stats.activeSources}</span>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">แหล่งทุน</p>
             </div>

             <div className="bg-white p-3 rounded-xl border border-purple-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                     <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                         <Activity size={16} />
                     </div>
                 </div>
                 <span className="text-xl font-black text-slate-800 leading-none">{stats.disbursementRate}%</span>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">อัตราเบิกจ่าย</p>
             </div>
         </div>

         {/* Chart Section */}
         <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 uppercase tracking-wider">
                    <MapPin className="text-teal-600" size={14} /> การกระจายทุน (Province)
                </h3>
            </div>
            <div className="p-4">
                 <div style={{ width: '100%', height: 150, minWidth: 0 }}>
                     {isMounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DISTRIBUTION_DATA}>
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} 
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                                {DISTRIBUTION_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     ) : (
                        <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                     )}
                 </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
