import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Input } from "../../../../components/ui/input";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { 
  ChevronLeft,
  Search, 
  FileText,
  Calendar,
  Banknote,
  Clock,
  Filter,
  Building2,
  ChevronRight,
  X
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import FundRequestForm from './forms/FundRequestForm';
import { MutualFundDetail } from './MutualFundDetail';
import { PATIENTS_DATA } from "../../../../data/patientData";
import { SystemFilterDrawer, GenericFilterState, FilterTabConfig } from "../../../../components/shared/SystemFilterDrawer";
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE, formatThaiDateShort, formatThaiDateWithDay } from "../../../../components/shared/ThaiCalendarDrawer";

// ===== Main Component =====

// Define Props Interface
interface FundingSystemProps {
    onBack: () => void;
    onRequestFund: () => void;
    initialPatient?: any;
}

interface FundRequest {
  id: string;
  patientName: string;
  patientId: string;
  patientImage?: string;
  amount: number;
  reason: string;
  requestDate: string;
  requestDateRaw?: string; // ISO date string for filtering
  status: 'Pending' | 'Approved' | 'Rejected';
  hospital: string;
  type: string;
  approvedDate?: string; // ISO datetime for approved
  rejectedDate?: string; // ISO datetime for rejected
}

const getConsolidatedFunds = (): FundRequest[] => {
  const funds: FundRequest[] = [];
  if (!PATIENTS_DATA || !Array.isArray(PATIENTS_DATA)) return funds;
  PATIENTS_DATA.forEach(patient => {
    if (patient.funds) {
      patient.funds.forEach((fund: any, index: number) => {
         // Use the fund date or format it consistently using our Thai formatter
         let displayDate = fund.date || (fund.history && fund.history.length > 0 ? fund.history[0].date : '');
         // If displayDate is empty, default
         if (!displayDate) displayDate = formatThaiDateShort(new Date(2025, 11, 3));

         funds.push({
           id: `FUND-${patient.id}-${index}`,
           patientName: patient.name,
           patientId: patient.hn,
           patientImage: patient.image,
           amount: fund.amount,
           reason: fund.reason || fund.name, 
           requestDate: displayDate,
           requestDateRaw: fund.dateRaw || undefined,
           status: (fund.status || 'Approved') as 'Pending' | 'Approved' | 'Rejected', 
           hospital: patient.hospital || 'รพ.มหาราชนครเชียงใหม่',
           type: fund.name,
           approvedDate: fund.approvedDate || undefined,
           rejectedDate: fund.rejectedDate || undefined,
         });
      });
    }
  });
  return funds;
};

export function FundingSystem({ onBack, onRequestFund, initialPatient }: FundingSystemProps) {
  const [activeTab, setActiveTab] = useState("requests");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFund, setSelectedFund] = useState<FundRequest | null>(null);
  const [drawerFilters, setDrawerFilters] = useState<GenericFilterState>({ fundType: [] });
  const [funds, setFunds] = useState<FundRequest[]>(getConsolidatedFunds());
  const [isCreating, setIsCreating] = useState(!!initialPatient);

  // Date filter state (separate from drawer) — default: 3 ธ.ค. 68 (Dec 3, 2025)
  const [filterDate, setFilterDate] = useState<Date>(new Date(2025, 11, 3));

  const STATUS_PILLS = [
    { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#7367f0] text-white shadow-md shadow-indigo-200' },
    { id: 'Pending', label: 'รอพิจารา', color: 'bg-orange-50 text-orange-600 border border-orange-200', activeColor: 'bg-orange-500 text-white shadow-md shadow-orange-200' },
    { id: 'Approved', label: 'อนุมัติ', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
    { id: 'Rejected', label: 'ปฏิเสธ', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
  ];

  const FUND_FILTER_TABS: FilterTabConfig[] = [
    { key: 'fundType', label: 'กองทุน', type: 'list', searchPlaceholder: 'ค้นหากองทุน...', options: [
      { id: 'กองทุนมูลนิธิตะวันยิ้ม', label: 'กองทุนมูลนิธิตะวันยิ้ม' },
      { id: 'กองทุนช่วยเหลือฉุกเฉิน', label: 'กองทุนช่วยเหลือฉุกเฉิน' },
      { id: 'กองทุนพัฒนาคุณภาพชีวิต', label: 'กองทุนพัฒนาคุณภาพชีวิต' },
      { id: 'ทุนสภากาชาดไทย', label: 'ทุนสภากาชาดไทย' },
      { id: 'กองทุนเพื่อผู้ยากไร้', label: 'กองทุนเพื่อผู้ยากไร้' },
      { id: 'ทุนอบจ.เชียงใหม่', label: 'ทุนอบจ.เชียงใหม่' },
      { id: 'มูลนิธิขาเทียม', label: 'มูลนิธิขาเทียม' },
      { id: 'กองทุนฟื้นฟูสมรรถภาพ', label: 'กองทุนฟื้นฟูสมรรถภาพ จ.เชียงใหม่' },
    ], emptyText: 'ไม่พบกองทุน' },
  ];

  // Drag-to-scroll for status pills
  const statusScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingStatus = useRef(false);
  const startXStatus = useRef(0);
  const scrollLeftStatus = useRef(0);
  const handleStatusMouseDown = useCallback((e: React.MouseEvent) => { isDraggingStatus.current = true; startXStatus.current = e.pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeftStatus.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const handleStatusMouseMove = useCallback((e: React.MouseEvent) => { if (!isDraggingStatus.current || !statusScrollRef.current) return; e.preventDefault(); const x = e.pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = scrollLeftStatus.current - (x - startXStatus.current) * 1.5; }, []);
  const handleStatusMouseUp = useCallback(() => { isDraggingStatus.current = false; }, []);
  const handleStatusTouchStart = useCallback((e: React.TouchEvent) => { isDraggingStatus.current = true; startXStatus.current = e.touches[0].pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeftStatus.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const handleStatusTouchMove = useCallback((e: React.TouchEvent) => { if (!isDraggingStatus.current || !statusScrollRef.current) return; const x = e.touches[0].pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = scrollLeftStatus.current - (x - startXStatus.current) * 1.5; }, []);

  const getFilteredFunds = (tab: 'requests' | 'history') => {
    return funds.filter(fund => {
      if (tab === 'requests' && fund.status !== 'Pending') return false;
      // History: show ALL statuses (matched with HomeVisit pattern)
      if (filterStatus !== 'All' && fund.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!fund.patientName.toLowerCase().includes(query) && !fund.patientId.toLowerCase().includes(query)) return false;
      }
      // Drawer filters
      const vtArr = Array.isArray(drawerFilters.fundType) ? drawerFilters.fundType as string[] : [];
      if (vtArr.length > 0 && !vtArr.some(v => (fund.type || '').includes(v))) return false;
      // Date filter — only apply for non-history tab, use raw date for accurate comparison
      if (tab !== 'history' && filterDate) {
        if (fund.requestDateRaw) {
          const filterStr = `${filterDate.getFullYear()}-${String(filterDate.getMonth() + 1).padStart(2, '0')}-${String(filterDate.getDate()).padStart(2, '0')}`;
          if (fund.requestDateRaw !== filterStr) return false;
        } else {
          const filterDateStr = formatThaiDateShort(filterDate);
          if (!fund.requestDate.includes(filterDateStr)) return false;
        }
      }
      return true;
    });
  };

  // Group funds by requestDateRaw for history display (matched with HomeVisit pattern)
  const groupFundsByDate = (items: FundRequest[]) => {
    const groups: { date: string; label: string; items: FundRequest[] }[] = [];
    const map = new Map<string, FundRequest[]>();
    items.forEach(item => {
      const dateKey = item.requestDateRaw || item.requestDate || 'unknown';
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(item);
    });
    // Sort by ISO date descending (newest first)
    const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    sortedKeys.forEach(dateKey => {
      let label = dateKey;
      // If it's an ISO date, format with formatThaiDateWithDay
      if (dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const d = new Date(dateKey + 'T00:00:00');
        if (!isNaN(d.getTime())) label = formatThaiDateWithDay(d);
      }
      groups.push({ date: dateKey, label, items: map.get(dateKey)! });
    });
    return groups;
  };

  const getHistoryFunds = () => {
    const filtered = funds.filter(fund => {
      // Show ALL statuses in history
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!fund.patientName.toLowerCase().includes(query) && !fund.patientId.toLowerCase().includes(query)) return false;
      }
      const vtArr = Array.isArray(drawerFilters.fundType) ? drawerFilters.fundType as string[] : [];
      if (vtArr.length > 0 && !vtArr.some(v => (fund.type || '').includes(v))) return false;
      return true;
    });
    return filtered;
  };

  const handleCreateFund = (data: any) => {
    setIsCreating(false);
    toast.success("ส่งคำขอทุนเรียบร้อยแล้ว");
  };

  const handleDateSelect = (date: Date) => {
    setFilterDate(date);
  };

  const clearDateFilter = () => {
    setFilterDate(null);
  };

  if (selectedFund) {
      return <MutualFundDetail fund={selectedFund} onBack={() => setSelectedFund(null)} />;
  }

  if (isCreating) {
     return <FundRequestForm patient={initialPatient || null} onClose={() => setIsCreating(false)} onSubmit={handleCreateFund} />;
  }

  const renderFundCard = (req: FundRequest) => (
      <Card key={req.id} onClick={() => setSelectedFund(req)} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group">
        <CardContent className="p-3">
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-2">
                        <div className="flex flex-col">
                            <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">{req.patientName}</h3>
                            <span className="font-['IBM_Plex_Sans_Thai'] font-normal text-[#6a7282] text-[14px] leading-[16px] mt-1">HN:{req.patientId}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <FileText className="w-[14px] h-[14px] text-[#6a7282] shrink-0" />
                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[16px] leading-[16px] truncate">{req.type}</span>
                        </div>
                    </div>
                    {req.status === 'Pending' && <div className="bg-[#fff0e1] px-2 py-0.5 rounded-lg shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#ff9f43] text-[12px]">รอพิจารณา</span></div>}
                    {req.status === 'Approved' && <div className="bg-[#E0FBFC] px-2 py-0.5 rounded-lg shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">อนุมัติ</span></div>}
                    {req.status === 'Rejected' && <div className="bg-red-50 px-2 py-0.5 rounded-lg shrink-0"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-red-500 text-[12px]">ปฎิเสธ</span></div>}
                </div>
                <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-gray-100">
                    <div className="flex items-center gap-2">
                        <Banknote className="w-[16px] h-[16px] text-[#7367f0]" />
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[20px]">{req.amount.toLocaleString()} บาท</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {req.status === 'Pending' ? <Clock className="w-3 h-3 text-gray-400" /> : <Calendar className="w-3 h-3 text-gray-400" />}
                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">{req.requestDate}</span>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
  );

  const drawerHasFilter = !!((Array.isArray(drawerFilters.fundType) && (drawerFilters.fundType as string[]).length > 0));

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ChevronLeft size={24} /></button>
            <h1 className="text-white text-lg font-bold">ระบบขอทุนสงเคราะห์</h1>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input placeholder="ค้นหาชื่อผู้ป่วย, HN..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" />
                </div>
                <SystemFilterDrawer
                  tabs={FUND_FILTER_TABS}
                  filters={drawerFilters}
                  onApply={setDrawerFilters}
                  title="ตัวกรอง (Filter)"
                  description="กรองรายการขอทุน"
                  trigger={
                    <button className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm relative", drawerHasFilter ? "bg-[#7367f0] text-white border border-[#7367f0] hover:bg-[#685dd8]" : "bg-white border border-gray-200 text-slate-500 hover:bg-slate-50")}>
                      <Filter className="w-5 h-5" />
                    </button>
                  }
                />
                {/* Calendar Date Filter Button */}
                <CalendarFilterButton filterDate={filterDate} onDateSelect={(date) => setFilterDate(date)} accentColor="#f5a623" drawerTitle="กรองวันที่" />
             </div>
             <TabsList className="bg-[#F3F4F6] p-1 h-12 rounded-xl grid grid-cols-2 w-full">
                <TabsTrigger value="requests" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold relative text-[16px]">
                   รายการทุน
                   {funds.filter(r => r.status === 'Pending').length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">{funds.filter(r => r.status === 'Pending').length}</span>}
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold text-[16px]">ประวัติทุน</TabsTrigger>
             </TabsList>
          </div>

          {/* Status Pills */}
          <div ref={statusScrollRef} className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1" onMouseDown={handleStatusMouseDown} onMouseMove={handleStatusMouseMove} onMouseUp={handleStatusMouseUp} onMouseLeave={handleStatusMouseUp} onTouchStart={handleStatusTouchStart} onTouchMove={handleStatusTouchMove} onTouchEnd={handleStatusMouseUp}>
            {STATUS_PILLS.map((option) => (
              <button key={option.id} onClick={() => setFilterStatus(option.id)} className={cn("px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0", filterStatus === option.id ? option.activeColor : option.color)}>{option.label}</button>
            ))}
          </div>

          {/* Selected Date Label */}
          {activeTab !== 'history' && <DateFilterLabel filterDate={filterDate} />}

          <TabsContent value="requests" className="space-y-4 mt-2">
             {getFilteredFunds('requests').map(renderFundCard)}
             {getFilteredFunds('requests').length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400"><Banknote className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการขอทุน</p></div>
             )}
          </TabsContent>
          <TabsContent value="history" className="space-y-4 mt-2">
             {groupFundsByDate(getHistoryFunds()).map(group => (
               <div key={group.date} className="space-y-3">
                 {/* Date Divider */}
                 <div className="flex items-center gap-3 px-1 py-1">
                   <div className="h-px flex-1 bg-gray-200" />
                   <span className="text-[15px] text-[#b4b7bd] whitespace-nowrap">
                     {group.label}
                   </span>
                   <div className="h-px flex-1 bg-gray-200" />
                 </div>
                 {group.items.map(renderFundCard)}
               </div>
             ))}
             {getHistoryFunds().length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400"><Banknote className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบประวัติการขอทุน</p></div>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}