import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Calendar } from "../../../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card } from "../../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { 
  ArrowLeft, 
  ArrowDown, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Clock, 
  Edit, 
  Trash2, 
  Filter, 
  FileText,
  Send,
  Building,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { th } from "date-fns/locale";
import { REFERRAL_DATA } from "../../../../../data/patientData";
import ReferralSystemDetail from './ReferralSystemDetail';
import ReferralAdd from './referralADD';
import { formatThaiDateWithDay } from "../../../../../components/shared/ThaiCalendarDrawer";
import { WebCalendarView, ViewModeToggle } from "../shared/WebCalendarView";

const THAI_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

function toISODateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isSameDateStr(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface ReferralSystemProps {
  onBack?: () => void;
  initialHN?: string;
}

export default function ReferralSystem({ onBack, initialHN }: ReferralSystemProps) {
  // --- State from Mobile Logic ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [filterStatus, setFilterStatus] = useState<string>("All");
  
  const [referralType, setReferralType] = useState<'Refer Out' | 'Refer In' | 'History'>('Refer Out');
  const [historyType, setHistoryType] = useState<'All' | 'Refer In' | 'Refer Out'>('All');
  
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filterSourceHospital, setFilterSourceHospital] = useState<string>("all");
  const [filterDestHospital, setFilterDestHospital] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState<string | null>(null);
  const [calendarSubTab, setCalendarSubTab] = useState<string>('Refer In');

  // Use Centralized Data (same as Mobile)
  const [referrals, setReferrals] = useState<any[]>(REFERRAL_DATA);

  // Dynamic hospital lists from mock data
  const uniqueSourceHospitals = useMemo(() => {
    const set = new Set<string>();
    referrals.forEach(r => {
      const src = r.hospital || r.sourceHospital;
      if (src) set.add(src);
    });
    return Array.from(set);
  }, [referrals]);

  const uniqueDestHospitals = useMemo(() => {
    const set = new Set<string>();
    referrals.forEach(r => {
      const dst = r.destinationHospital || r.destination;
      if (dst) set.add(dst);
    });
    return Array.from(set);
  }, [referrals]);

  // Initial HN Effect
  useEffect(() => {
    if (initialHN) {
      setSearchTerm(initialHN);
      const found = referrals.find(r => r.hn === initialHN || r.patientHn === initialHN);
      if (found) {
        setSelectedReferral(found);
      }
    }
  }, [initialHN, referrals]);

  // --- Logic from Mobile ---
  
  const filtered = referrals.filter(r => {
    const matchesSearch = (r.patientName || '').includes(searchTerm) || (r.hn || '').includes(searchTerm) || (r.referralNo || '').includes(searchTerm);
    
    // Combined status filter: standard status check AND new filter menu check
    const matchesStatus = (statusFilter === 'all' || r.status === statusFilter) && 
                          (filterStatus === 'All' || r.status === filterStatus);
    
    const matchesDate = selectedDate ? isSameDateStr(new Date(r.referralDate || r.date), new Date(selectedDate)) : true;

    // Hospital filters
    const matchesSource = filterSourceHospital === 'all' || (r.hospital || r.sourceHospital || '').includes(filterSourceHospital);
    const matchesDest = filterDestHospital === 'all' || (r.destinationHospital || r.destination || '').includes(filterDestHospital);

    // UX/UI Logic: Status Lifecycle Definition (Matched with Mobile)
    const activeStatuses = ['Pending', 'Accepted', 'NotTreated', 'Waiting', 'Arrived', 'Treating', 'pending', 'accepted', 'referred', 'WaitingReceive'];
    const terminalStatuses = ['Treated', 'Rejected', 'Completed', 'Cancelled', 'NoShow', 'treated', 'rejected', 'completed', 'cancelled', 'Canceled'];

    let matchesType = false;
    if (referralType === 'History') {
        // History Menu: Show ALL statuses (matched with HomeVisit pattern)
        matchesType = true;
        
        // Apply Sub-filter for History
        if (historyType !== 'All') {
            matchesType = r.type === historyType;
        }
    } else {
        // Operational Menu: Show only Active states
        matchesType = r.type === referralType && activeStatuses.includes(r.status);
    }
    
    // Role Isolation Logic (Matched with Mobile)
    if (referralType === 'Refer Out') {
        const isCreatedByCM = r.creatorRole === 'CM' || (!r.creatorRole && !r.hospital?.includes('รพ.สต.'));
        matchesType = matchesType && isCreatedByCM;
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate && matchesSource && matchesDest;
  });

  // Helper for Status Badge (Matched with Mobile colors)
  const renderStatusBadge = (status: string) => {
      switch(status) {
          case 'Pending':
          case 'pending':
              return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 font-normal">รอการตอบรับ</Badge>;
          case 'Accepted':
          case 'accepted':
              return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 font-normal">รอรับตัว</Badge>;
          case 'WaitingReceive':
              return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 font-normal">รอรับตัว</Badge>;
          case 'Rejected':
          case 'rejected':
              return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200 font-normal">ถูกปฏิเสธ</Badge>;
          case 'Examined':
              return <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-200 font-normal">ตรวจแล้ว</Badge>;
          case 'Completed':
          case 'completed':
          case 'Treated':
          case 'treated':
              return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 font-normal">เสร็จสิ้น</Badge>;
          case 'Cancelled':
          case 'cancelled':
          case 'Canceled':
              return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200 font-normal">ยกเลิก</Badge>;
          default:
              return <Badge className="bg-gray-100 text-gray-600 font-normal">{status}</Badge>;
      }
  };

  const handleCreateClick = () => {
    // Logic to open create modal (omitted for brevity as focusing on list logic)
    setIsCreateOpen(true);
  };

  const handleDelete = (id: any) => {
    setReferrals(prev => prev.filter(r => r.id !== id));
    toast.success("ลบรายการเรียบร้อยแล้ว");
  };

  // --- Early returns for full-page sub-views (same pattern as AppointmentSystem / HomeVisitSystem) ---

  if (isCreateOpen) {
    return (
      <ReferralAdd
        onBack={() => setIsCreateOpen(false)}
        isEditMode={false}
        initialData={{}}
        onSubmit={(data) => {
          const newReferral = {
            id: `REF-${Date.now()}`,
            referralNo: `RF-${Date.now()}`,
            patientName: data.patientName || '',
            hn: data.patientHn || '',
            patientHn: data.patientHn || '',
            referralDate: new Date().toISOString().split('T')[0],
            type: 'Refer Out' as const,
            hospital: data.sourceHospital || 'โรงพยาบาลฝาง',
            sourceHospital: data.sourceHospital || 'โรงพยาบาลฝาง',
            destinationHospital: data.destinationHospital || '',
            destination: data.destinationHospital || '',
            reason: data.reason || '',
            diagnosis: data.diagnosis || '',
            urgency: data.urgency || 'Routine',
            status: 'Pending',
            creatorRole: 'CM',
          };
          setReferrals(prev => [newReferral, ...prev]);
          setIsCreateOpen(false);
          toast.success("สร้างคำขอส่งตัวเรียบร้อยแล้ว", {
            description: `ส่งตัว ${newReferral.patientName} ไปยัง ${newReferral.destinationHospital}`
          });
        }}
      />
    );
  }

  if (selectedReferral) {
    return (
      <ReferralSystemDetail 
        referral={selectedReferral} 
        onBack={() => setSelectedReferral(null)}
        onAccept={(date, note) => {
          setReferrals(prev => prev.map(r => r.id === selectedReferral.id ? { ...r, status: 'Accepted', acceptedDate: date.toISOString() } : r));
          setSelectedReferral((prev: any) => prev ? { ...prev, status: 'Accepted' } : null);
          toast.success("ตอบรับการส่งตัวเรียบร้อยแล้ว");
        }}
        onCancel={(reason) => {
          setReferrals(prev => prev.map(r => r.id === selectedReferral.id ? { ...r, status: 'Canceled' } : r));
          setSelectedReferral((prev: any) => prev ? { ...prev, status: 'Canceled' } : null);
          toast.success("ยกเลิก/ปฏิเสธการส่งตัวเรียบร้อยแล้ว");
        }}
        onDelete={(id) => {
          setReferrals(prev => prev.filter(r => r.id !== id));
          setSelectedReferral(null);
          toast.success("ยกเลิกคำขอส่งตัวเรียบร้อยแล้ว");
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 relative font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Header Banner */}
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
              <Send className="w-5 h-5" /> ระบบส่งตัว (Referral)
          </h1>
        </div>
      </div>

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{referrals.filter(r => r.status === 'Pending' || r.status === 'pending').length}</p>
                  <p className="text-blue-600/80 text-sm">รอตอบรับ</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-orange-600 font-bold text-2xl">{referrals.filter(r => r.status === 'Accepted' || r.status === 'accepted' || r.status === 'WaitingReceive').length}</p>
                  <p className="text-orange-600/80 text-sm">รอรับตัว</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
          </div>
          <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-cyan-600 font-bold text-2xl">{referrals.filter(r => r.type === 'Refer In').length}</p>
                  <p className="text-cyan-600/80 text-sm">รับตัวเข้า</p>
              </div>
              <div className="bg-cyan-100 p-2 rounded-full">
                  <ArrowDownToLine className="w-5 h-5 text-cyan-600" />
              </div>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-purple-600 font-bold text-2xl">{referrals.filter(r => r.type === 'Refer Out').length}</p>
                  <p className="text-purple-600/80 text-sm">ส่งตัวออก</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                  <ArrowUpFromLine className="w-5 h-5 text-purple-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">{referrals.filter(r => ['Completed', 'completed', 'Treated', 'treated'].includes(r.status)).length}</p>
                  <p className="text-green-600/80 text-sm">เสร็จสิ้น</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
          </div>
      </div>

      {/* Main Content */}
      <Card className="border-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
          <div className="p-6 border-b border-[#EBE9F1] flex flex-col md:flex-row gap-4 items-center justify-between">
             <h2 className="text-[18px] font-bold text-[#5e5873] flex items-center gap-2">
                 <Send className="w-5 h-5 text-[#7367f0]" /> รายการส่งตัว/รับตัว
             </h2>
             
             <div className="flex items-center gap-3">
                 <div className="relative w-full max-w-[300px]">
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, เลขที่, HN..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pr-10 h-[40px] border-[#EBE9F1] bg-white focus:ring-[#7367f0]"
                    />
                    <div className="absolute right-0 top-0 h-full w-10 bg-[#7367f0] flex items-center justify-center rounded-r-md cursor-pointer hover:bg-[#685dd8]">
                        <Search className="h-4 w-4 text-white" />
                    </div>
                 </div>

                 <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />

                 <Button 
                   onClick={handleCreateClick} 
                   className="bg-[#7367f0] hover:bg-[#685dd8] text-white font-medium px-4 py-2 h-[42px] rounded-[5px] shadow-sm gap-2"
                 >
                    <Plus className="h-4 w-4" />
                    <span>สร้างคำขอส่งตัว</span>
                 </Button>
             </div>
          </div>

          {viewMode === 'calendar' ? (
            <div className="p-6 space-y-6">
              <WebCalendarView
                items={referrals}
                dateField="date"
                themeColor="#ff6d00"
                countLabel="รายการ"
                selectedDate={calendarDate}
                onDateSelect={setCalendarDate}
                subTabs={[
                  { value: 'Refer In', label: 'รายการรับตัว' },
                  { value: 'Refer Out', label: 'รายการส่งตัว' },
                ]}
                activeSubTab={calendarSubTab}
                onSubTabChange={setCalendarSubTab}
                itemFilter={(item) => {
                  if (item.type !== calendarSubTab) return false;
                  return !!item.date;
                }}
              />
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="w-[60px]"></TableHead>
                      <TableHead>ผู้ป่วย</TableHead>
                      <TableHead>เส้นทาง</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const calItems = referrals.filter(r => {
                        if (r.type !== calendarSubTab) return false;
                        if (!r.date) return false;
                        if (calendarDate && r.date !== calendarDate) return false;
                        if (searchTerm) {
                          const q = searchTerm.toLowerCase();
                          if (!(r.patientName || '').toLowerCase().includes(q) && !(r.hn || '').toLowerCase().includes(q)) return false;
                        }
                        return true;
                      });
                      if (calItems.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-400 py-12">
                              <div className="flex flex-col items-center gap-3">
                                <Send className="w-10 h-10 opacity-20" />
                                <p className="text-sm">{calendarDate ? 'ไม่พบรายการในวันที่เลือก' : 'เลือกวันที่เพื่อดูรายการ'}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      }
                      return calItems.map(referral => (
                        <TableRow key={referral.id} className="cursor-pointer hover:bg-slate-50 group" onClick={() => setSelectedReferral(referral)}>
                          <TableCell>
                            <div className={cn("p-2 rounded-lg w-fit",
                              referral.status === 'Pending' || referral.status === 'pending' ? "bg-blue-100 text-blue-600" :
                              referral.status === 'Accepted' || referral.status === 'accepted' ? "bg-orange-100 text-orange-600" :
                              ['Completed','completed','Treated','treated'].includes(referral.status) ? "bg-green-100 text-green-600" :
                              "bg-gray-100 text-gray-600"
                            )}>
                              {referral.type === 'Refer Out' ? <Send className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{referral.patientName}</div>
                              <Badge variant="outline" className="text-gray-500 text-[10px] h-5">{referral.hn || referral.patientHn}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="text-xs">{(referral.hospital || '').replace('โรงพยาบาล', 'รพ.')}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-xs text-[#7367f0] font-medium">{(referral.destinationHospital || '').replace('โรงพยาบาล', 'รพ.')}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-gray-500">
                              {referral.date && referral.date.match(/^\d{4}-\d{2}-\d{2}$/) ? formatThaiDateWithDay(new Date(referral.date)) : referral.date || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(referral.status)}
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
          <div className="p-6">
             {/* Tabs / Filters */}
             <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 items-center">
                 <div className="bg-white p-1 rounded-md border border-gray-200 flex items-center shadow-sm">
                   <button
                     className={cn(
                       "relative px-4 py-1.5 text-sm font-medium rounded transition-all",
                       referralType === 'Refer In' ? "bg-[#7367f0] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                     )}
                     onClick={() => setReferralType('Refer In')}
                   >
                     รายการรับตัว
                     {referrals.filter(r => r.type === 'Refer In' && (r.status === 'Pending' || r.status === 'pending')).length > 0 && (
                       <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
                         {referrals.filter(r => r.type === 'Refer In' && (r.status === 'Pending' || r.status === 'pending')).length}
                       </span>
                     )}
                   </button>
                   <button
                     className={cn(
                       "px-4 py-1.5 text-sm font-medium rounded transition-all",
                       referralType === 'Refer Out' ? "bg-[#7367f0] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                     )}
                     onClick={() => setReferralType('Refer Out')}
                   >
                     รายการส่งตัว
                   </button>
                   <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded transition-all",
                        referralType === 'History' ? "bg-[#7367f0] text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"
                      )}
                      onClick={() => setReferralType('History')}
                    >
                      ประวัติย้อนหลัง
                    </button>
                   </div>
                 </div>

                 <div className="h-8 w-px bg-gray-300 hidden md:block"></div>

                 <div className="flex items-center gap-3 flex-wrap w-full md:w-auto md:ml-auto">
                    {referralType === 'History' && (
                        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
                            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">ประเภท:</span>
                             <Select value={historyType} onValueChange={(val: any) => setHistoryType(val)}>
                                <SelectTrigger className="w-[120px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm text-[#7367f0] font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">ทั้งหมด</SelectItem>
                                    <SelectItem value="Refer In">รับตัว</SelectItem>
                                    <SelectItem value="Refer Out">ส่งตัว</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">ต้นทาง:</span>
                        <Select value={filterSourceHospital} onValueChange={setFilterSourceHospital}>
                            <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm">
                                <SelectValue placeholder="ต้นทาง" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ทั้งหมด</SelectItem>
                                {uniqueSourceHospitals.map(hospital => (
                                    <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">ปลายทาง:</span>
                        <Select value={filterDestHospital} onValueChange={setFilterDestHospital}>
                            <SelectTrigger className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm">
                                <SelectValue placeholder="ปลายทาง" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ทั้งหมด</SelectItem>
                                {uniqueDestHospitals.map(hospital => (
                                    <SelectItem key={hospital} value={hospital}>{hospital}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">สถานะ:</span>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[160px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm">
                                <SelectValue placeholder="สถานะ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">ทั้งหมด</SelectItem>
                                <SelectItem value="Pending">รอตอบรับ</SelectItem>
                                <SelectItem value="Accepted">ตอบรับแล้ว</SelectItem>
                                <SelectItem value="Rejected">ปฏิเสธ</SelectItem>
                                <SelectItem value="Examined">ตรวจแล้ว</SelectItem>
                                <SelectItem value="Treated">รักษาแล้ว</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">วันที่สร้างคำขอ:</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                    {selectedDate ? (() => {
                                        const date = new Date(selectedDate);
                                        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
                                    })() : "ทั้งหมด"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate ? new Date(selectedDate) : undefined}
                                    onSelect={(date) => setSelectedDate(date ? toISODateString(date) : "")}
                                    locale={th}
                                    formatters={{
                                        formatCaption: (date) => {
                                            const year = date.getFullYear() + 543;
                                            return `${THAI_MONTHS_FULL[date.getMonth()]} ${year}`;
                                        }
                                    }}
                                    classNames={{
                                        day_selected: "bg-[#7367f0] text-white hover:bg-[#7367f0] hover:text-white focus:bg-[#7367f0] focus:text-white rounded-md",
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                 </div>
             </div>

             <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow>
                      <TableHead className="w-[60px]"></TableHead>
                      <TableHead>ผู้ป่วย</TableHead>
                      <TableHead>เส้นทาง</TableHead>
                      <TableHead>วันที่ขอ</TableHead>
                      <TableHead>ความเร่งด่วน</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                            <div className="flex flex-col items-center gap-3">
                                <FileText className="w-10 h-10 opacity-20" />
                                <p className="text-sm">ไม่พบข้อมูลการส่งตัว</p>
                            </div>
                        </TableCell>
                      </TableRow>
                    ) : referralType === 'History' ? (
                      // Group by date for history (matched with HomeVisit pattern)
                      (() => {
                        const groups: { date: string; label: string; items: typeof filtered }[] = [];
                        const map = new Map<string, typeof filtered>();
                        filtered.forEach(item => {
                          const dateKey = item.referralDate ? item.referralDate.split('T')[0] : item.date || 'unknown';
                          if (!map.has(dateKey)) map.set(dateKey, []);
                          map.get(dateKey)!.push(item);
                        });
                        const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
                        sortedKeys.forEach(dateKey => {
                          let label = dateKey;
                          if (dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            const d = new Date(dateKey + 'T00:00:00');
                            label = formatThaiDateWithDay(d);
                          }
                          groups.push({ date: dateKey, label, items: map.get(dateKey)! });
                        });
                        return groups.flatMap(group => [
                            /* Date Divider Row */
                            <TableRow key={`divider-${group.date}`} className="bg-gray-50/80 hover:bg-gray-50/80">
                               <TableCell colSpan={7} className="py-2">
                                 <div className="flex items-center gap-3">
                                   <div className="h-px flex-1 bg-gray-200" />
                                   <span className="text-sm text-[#b4b7bd] whitespace-nowrap">{group.label}</span>
                                   <div className="h-px flex-1 bg-gray-200" />
                                 </div>
                               </TableCell>
                            </TableRow>,
                            /* Data Rows */
                            ...group.items.map((referral) => (
                               <TableRow 
                                   key={referral.id} 
                                   className="cursor-pointer hover:bg-slate-50 group" 
                                   onClick={() => setSelectedReferral(referral)}
                               >
                                 <TableCell>
                                    <div className={cn("p-2 rounded-lg w-fit", 
                                       referral.status === 'Pending' || referral.status === 'pending' ? "bg-blue-100 text-blue-600" :
                                       referral.status === 'Accepted' || referral.status === 'accepted' ? "bg-orange-100 text-orange-600" :
                                       referral.status === 'Rejected' || referral.status === 'rejected' ? "bg-red-100 text-red-600" :
                                       referral.status === 'Completed' || referral.status === 'completed' ? "bg-green-100 text-green-600" :
                                       "bg-gray-100 text-gray-600"
                                    )}>
                                       {referral.type === 'Refer Out' ? <Send className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                   <div>
                                       <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{referral.patientName}</div>
                                       <Badge variant="outline" className="text-gray-500 text-[10px] h-5 border-gray-200 bg-gray-50">{referral.hn || referral.patientHn}</Badge>
                                   </div>
                                 </TableCell>
                                 <TableCell>
                                   <div className="flex flex-col gap-1">
                                     <div className="flex items-center gap-2 text-[#5e5873] text-sm">
                                        <Building size={14} className="text-[#b9b9c3]" />
                                        <span className="text-xs">{referral.hospital?.replace('โรงพยาบาล', 'รพ.') || referral.sourceHospital || '-'}</span>
                                     </div>
                                     <div className="pl-1">
                                       <ArrowDown size={12} className="text-gray-400" />
                                     </div>
                                     <div className="flex items-center gap-2 text-[#7367f0] font-medium text-sm">
                                        <Building size={14} />
                                        <span>{referral.destinationHospital?.replace('โรงพยาบาล', 'รพ.') || referral.destination || '-'}</span>
                                     </div>
                                   </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                                        <CalendarIcon className="w-3 h-3" /> {referral.referralDate ? formatThaiDateWithDay(new Date(referral.referralDate)) : '-'}
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                   <div className={cn("text-xs font-medium uppercase tracking-wide", 
                                       referral.urgency === 'Emergency' ? "text-red-600" : 
                                       referral.urgency === 'Urgent' ? "text-orange-500" : "text-gray-600"
                                   )}>
                                     {referral.urgency || 'Routine'}
                                   </div>
                                 </TableCell>
                                 <TableCell>
                                    {renderStatusBadge(referral.status)}
                                 </TableCell>
                                 <TableCell className="text-right">
                                     {/* View only in history */}
                                 </TableCell>
                               </TableRow>
                            ))
                         ]);
                       })()
                    ) : (
                      filtered.map((referral) => (
                        <TableRow 
                            key={referral.id} 
                            className="cursor-pointer hover:bg-slate-50 group" 
                            onClick={() => setSelectedReferral(referral)}
                        >
                          <TableCell>
                             <div className={cn("p-2 rounded-lg w-fit", 
                                referral.status === 'Pending' || referral.status === 'pending' ? "bg-blue-100 text-blue-600" :
                                referral.status === 'Accepted' || referral.status === 'accepted' ? "bg-orange-100 text-orange-600" :
                                referral.status === 'Rejected' || referral.status === 'rejected' ? "bg-red-100 text-red-600" :
                                referral.status === 'Completed' || referral.status === 'completed' ? "bg-green-100 text-green-600" :
                                "bg-gray-100 text-gray-600"
                             )}>
                                {referral.type === 'Refer Out' ? <Send className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                             </div>
                          </TableCell>
                          <TableCell>
                            <div>
                                <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{referral.patientName}</div>
                                <Badge variant="outline" className="text-gray-500 text-[10px] h-5 border-gray-200 bg-gray-50">{referral.hn || referral.patientHn}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-[#5e5873] text-sm">
                                 <Building size={14} className="text-[#b9b9c3]" />
                                 <span className="text-xs">{referral.hospital?.replace('โรงพยาบาล', 'รพ.') || referral.sourceHospital || '-'}</span>
                              </div>
                              <div className="pl-1">
                                <ArrowDown size={12} className="text-gray-400" />
                              </div>
                              <div className="flex items-center gap-2 text-[#7367f0] font-medium text-sm">
                                 <Building size={14} />
                                 <span>{referral.destinationHospital?.replace('โรงพยาบาล', 'รพ.') || referral.destination || '-'}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-1 text-gray-400 text-xs">
                                 <CalendarIcon className="w-3 h-3" /> {referral.referralDate ? formatThaiDateWithDay(new Date(referral.referralDate)) : '-'}
                             </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn("text-xs font-medium uppercase tracking-wide", 
                                referral.urgency === 'Emergency' ? "text-red-600" : 
                                referral.urgency === 'Urgent' ? "text-orange-500" : "text-gray-600"
                            )}>
                              {referral.urgency || 'Routine'}
                            </div>
                          </TableCell>
                          <TableCell>
                             {renderStatusBadge(referral.status)}
                          </TableCell>
                          <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-gray-400 hover:text-[#7367f0]"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          // Edit logic
                                          toast.info("Edit feature");
                                      }}
                                  >
                                      <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                       variant="ghost" 
                                       size="icon" 
                                       className="h-8 w-8 text-gray-400 hover:text-red-500" 
                                       onClick={(e) => {
                                           e.stopPropagation(); 
                                           handleDelete(referral.id);
                                       }}
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </Button>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
             </div>
          </div>
          )}
        </Card>
    </div>
  );
}