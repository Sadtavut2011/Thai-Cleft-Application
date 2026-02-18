import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from "../../../../components/ui/input";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { 
  ChevronLeft,
  Search, 
  Calendar, 
  Smartphone, 
  Building2, 
  Filter,
  Home
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";

import { TeleConsultDetail } from "../patient/History/TeleConsultDetail";
import { TELEMED_DATA } from "../../../../data/patientData";
import { SystemFilterDrawer, GenericFilterState, FilterTabConfig } from "../../../../components/shared/SystemFilterDrawer";
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE, formatThaiDateWithDay } from "../../../../components/shared/ThaiCalendarDrawer";

// Helper: format date string to Thai Buddhist short date (e.g., "4 ธ.ค. 68")
const formatThaiShortDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '-';
  try {
    const safe = dateStr.match(/^\d{4}-\d{2}-\d{2}$/) ? dateStr + 'T00:00:00' : dateStr;
    const d = new Date(safe);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch {
    return dateStr;
  }
};

interface TeleConsultationSystemProps {
  onBack?: () => void;
}

export type ChannelType = 'Direct' | 'Intermediary' | 'Hospital';

export interface TeleAppointment {
  id: string;
  patientImage?: string | null;
  patientName: string;
  hn: string;
  treatmentDetails?: string;
  date: string;
  time: string;
  requestDate?: string;
  meetingLink: string;
  channel: ChannelType;
  intermediaryName?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  caseManager?: string;
  hospital?: string;
  pcu?: string;
  zoomUser?: string;
}

const mapTelemedData = (data: typeof TELEMED_DATA): TeleAppointment[] => {
    return data.map((item: any) => ({
        id: item.id,
        patientImage: item.patientImage,
        patientName: item.patientName,
        hn: item.hn,
        treatmentDetails: undefined,
        date: item.date,
        time: item.time,
        requestDate: item.requestDate,
        meetingLink: item.meetingLink || "",
        channel: (item.channel === 'mobile' ? 'Direct' : item.channel === 'hospital' ? 'Hospital' : 'Intermediary') as ChannelType,
        status: (item.status === 'Waiting' ? 'Scheduled' : item.status) as 'Scheduled' | 'Completed' | 'Cancelled',
        intermediaryName: item.channel !== 'mobile' ? (item.agency_name || "โรงพยาบาลต้นทาง") : undefined,
        caseManager: "-",
        hospital: "โรงพยาบาลนครพิงค์", 
        pcu: "รพ.สต.บ้านดอนแก้ว",
        zoomUser: item.patientName
    }));
};

export function TeleConsultationSystem({ onBack }: TeleConsultationSystemProps) {
  const [allAppointments, setAllAppointments] = useState<TeleAppointment[]>([]);
  const [appointments, setAppointments] = useState<TeleAppointment[]>([]);
  const [history, setHistory] = useState<TeleAppointment[]>([]);
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [drawerFilters, setDrawerFilters] = useState<GenericFilterState>({ channel: [] });
  const [viewingData, setViewingData] = useState<TeleAppointment | null>(null);
  const [filterDate, setFilterDate] = useState<Date>(DEFAULT_FILTER_DATE);

  const STATUS_PILLS = [
    { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#7367f0] text-white shadow-md shadow-indigo-200' },
    { id: 'Scheduled', label: 'รอสาย', color: 'bg-cyan-50 text-cyan-600 border border-cyan-200', activeColor: 'bg-cyan-500 text-white shadow-md shadow-cyan-200' },
    { id: 'Completed', label: 'เสร็จสิ้น', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
    { id: 'Cancelled', label: 'ยกเลิก', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
  ];

  const TELE_FILTER_TABS: FilterTabConfig[] = [
    { key: 'channel', label: 'ช่องทาง', type: 'list', searchPlaceholder: 'ค้นหาช่องทาง...', options: [
      { id: 'ch1', label: 'Direct (ผู้ป่วยเชื่อมต่อเอง)', description: 'ผู้ป่วยเข้าระบบ Tele-med โดยตรงผ่านมือถือ', icon: <Smartphone className="w-4 h-4 text-green-500" /> },
      { id: 'ch2', label: 'Via Host (ผ่านหน่วยงาน)', description: 'เชื่อมต่อผ่านหน่วยงานต้นทาง เช่น รพ.สต.', icon: <Building2 className="w-4 h-4 text-blue-500" /> },
      { id: 'ch3', label: 'โรงพยาบาล', description: 'เชื่อมต่อผ่านระบบโรงพยาบาลโดยตรง', icon: <Home className="w-4 h-4 text-purple-500" /> },
    ], emptyText: 'ไม่พบช่องทาง' },
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

  useEffect(() => {
      const mapped = mapTelemedData(TELEMED_DATA);
      setAllAppointments(mapped);
      setAppointments(mapped.filter(d => d.status === 'Scheduled'));
      setHistory(mapped.filter(d => d.status !== 'Scheduled'));
  }, []);

  const handleEditClick = (apt: TeleAppointment) => {
    setViewingData(apt);
  };

  const getFilteredData = (data: TeleAppointment[]) => {
    return data.filter(item => {
        const matchesSearch = item.patientName.includes(searchTerm) || item.hn.includes(searchTerm);
        const matchesFilter = filterStatus === 'All' || item.status === filterStatus;

        // Calendar date filter — match requestDate with selected filterDate (Reference: HomeVisitSystem)
        let matchesDate = true;
        if (filterDate && activeTab !== 'history') {
          const y = filterDate.getFullYear();
          const m = String(filterDate.getMonth() + 1).padStart(2, '0');
          const d = String(filterDate.getDate()).padStart(2, '0');
          const selectedDateStr = `${y}-${m}-${d}`;
          const reqDateStr = String(item.requestDate || '');
          if (reqDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            matchesDate = reqDateStr === selectedDateStr;
          }
        }

        // Drawer: channel
        let matchesChannel = true;
        const chArr = Array.isArray(drawerFilters.channel) ? drawerFilters.channel as string[] : [];
        if (chArr.length > 0) {
          const channelLabel = item.channel === 'Direct' ? 'Direct (ผู้ป่วยเชื่อมต่อเอง)' : item.channel === 'Hospital' ? 'โรงพยาบาล' : 'Via Host (ผ่านหน่วยงาน)';
          matchesChannel = chArr.includes(channelLabel);
        }

        return matchesSearch && matchesFilter && matchesChannel && matchesDate;
    });
  };

  if (viewingData) {
    // Helper: safely create Date from date-only string (avoid UTC timezone shift)
    const safeDate = (dateStr: string) => {
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return new Date(dateStr + 'T00:00:00');
      return new Date(dateStr);
    };

    const consultData = {
        date: safeDate(viewingData.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
        rawDate: viewingData.date,
        time: viewingData.time,
        requestDate: (() => {
            if (!viewingData.requestDate) return '-';
            const rd = safeDate(viewingData.requestDate);
            return rd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
        })(),
        meetingLink: viewingData.meetingLink,
        status: viewingData.status,
        doctor: viewingData.caseManager,
        title: "Tele-consultation",
        detail: viewingData.treatmentDetails,
        channel: viewingData.channel === 'Direct' ? 'mobile' : viewingData.channel === 'Hospital' ? 'hospital' : 'agency',
        agency_name: viewingData.intermediaryName
    };
    const patientData = {
        name: viewingData.patientName,
        hn: viewingData.hn,
        image: viewingData.patientImage
    };
    return <TeleConsultDetail consult={consultData} patient={patientData} onBack={() => setViewingData(null)} />;
  }

  const drawerHasFilter = !!((Array.isArray(drawerFilters.channel) && (drawerFilters.channel as string[]).length > 0));

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in duration-300">
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ChevronLeft size={24} /></button>
            <h1 className="text-white text-lg font-bold">ระบบ Tele-med</h1>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input placeholder="ค้นหาชื่อผู้ป่วย, HN..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" />
                </div>
                <SystemFilterDrawer
                  tabs={TELE_FILTER_TABS}
                  filters={drawerFilters}
                  onApply={setDrawerFilters}
                  title="ตัวกรอง (Filter)"
                  description="กรองรายการ Tele-med"
                  trigger={
                    <button className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm relative", drawerHasFilter ? "bg-[#7367f0] text-white border border-[#7367f0] hover:bg-[#685dd8]" : "bg-white border border-gray-200 text-slate-500 hover:bg-slate-50")}>
                      <Filter className="w-5 h-5" />
                    </button>
                  }
                />
                <CalendarFilterButton filterDate={filterDate} onDateSelect={setFilterDate} accentColor="#e91e63" drawerTitle="กรองวันที่" />
             </div>
             <TabsList className="bg-[#F3F4F6] p-1 h-12 rounded-xl grid grid-cols-2 w-full">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold relative text-[16px]">
                   รายการนัดหมาย
                   {appointments.length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">{appointments.length}</span>}
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold text-[16px]">ประวัติ</TabsTrigger>
             </TabsList>
          </div>

          {/* Status Pills */}
          <div ref={statusScrollRef} className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1" onMouseDown={handleStatusMouseDown} onMouseMove={handleStatusMouseMove} onMouseUp={handleStatusMouseUp} onMouseLeave={handleStatusMouseUp} onTouchStart={handleStatusTouchStart} onTouchMove={handleStatusTouchMove} onTouchEnd={handleStatusMouseUp}>
            {STATUS_PILLS.map((option) => (
              <button key={option.id} onClick={() => setFilterStatus(option.id)} className={cn("px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0", filterStatus === option.id ? option.activeColor : option.color)}>{option.label}</button>
            ))}
          </div>

          {/* Date Label */}
          {activeTab !== 'history' && <DateFilterLabel filterDate={filterDate} />}

          <TabsContent value="upcoming" className="space-y-4 mt-2">
             {getFilteredData(appointments).map(apt => (
                 <Card key={apt.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => handleEditClick(apt)}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">{apt.patientName}</h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">{apt.hn}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#E0FBFC] px-3 py-1 rounded-[10px]">
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">รอสาย</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full mt-2">
                                    <div className="flex items-center gap-2">
                                        {apt.channel === 'Direct' ? <Smartphone className="w-[16px] h-[16px] text-green-600" /> : apt.channel === 'Hospital' ? <Home className="w-[16px] h-[16px] text-purple-600" /> : <Building2 className="w-[16px] h-[16px] text-blue-600" />}
                                        <span className={cn("font-['IBM_Plex_Sans_Thai'] font-medium text-[16px]", apt.channel === 'Direct' ? "text-green-700" : apt.channel === 'Hospital' ? "text-purple-700" : "text-blue-700")}>
                                            {apt.channel === 'Direct' ? 'Direct (ผู้ป่วยเชื่อมต่อเอง)' : apt.channel === 'Hospital' ? 'โรงพยาบาล' : 'Via Host (ผ่านหน่วยงาน)'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-[#6a7282]" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">{formatThaiShortDate(apt.requestDate || apt.date)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
             {getFilteredData(appointments).length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400"><Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการนัดหมาย</p></div>
             )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-2">
             {(() => {
               // Group history by requestDate (วันที่สร้างคำขอ) to match card display
               const historyData = getFilteredData(allAppointments); // Show ALL statuses in history
               const groups: { date: string; label: string; items: typeof historyData }[] = [];
               const map = new Map<string, typeof historyData>();
               historyData.forEach(item => {
                 const dateKey = String(item.requestDate || item.date || 'unknown');
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
               return groups.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400"><Home className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบประวัติ</p></div>
               ) : (
                 groups.map(group => (
                   <div key={group.date} className="space-y-3">
                     {/* Date Divider */}
                     <div className="flex items-center gap-3 px-1 py-1">
                       <div className="h-px flex-1 bg-gray-200" />
                       <span className="text-[15px] text-[#b4b7bd] whitespace-nowrap">{group.label}</span>
                       <div className="h-px flex-1 bg-gray-200" />
                     </div>
                     {group.items.map(apt => (
                       <Card key={apt.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => handleEditClick(apt)}>
                         <CardContent className="p-4">
                           <div className="flex gap-4">
                             <div className="flex-1 min-w-0 flex flex-col gap-1">
                               <div className="flex justify-between items-start">
                                 <div>
                                   <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">{apt.patientName}</h3>
                                   <div className="flex items-center gap-1.5 mt-0.5">
                                     <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">{apt.hn}</span>
                                   </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                   {apt.status === 'Scheduled' && (
                                     <div className="bg-[#E0FBFC] px-3 py-1 rounded-[10px]"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">รอสาย</span></div>
                                   )}
                                   {apt.status === 'Completed' && (
                                     <div className="bg-green-100 px-3 py-1 rounded-[10px]"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-green-600 text-[12px]">เสร็จสิ้น</span></div>
                                   )}
                                   {apt.status === 'Cancelled' && (
                                     <div className="bg-red-100 px-3 py-1 rounded-[10px]"><span className="font-['IBM_Plex_Sans_Thai'] font-medium text-red-600 text-[12px]">ยกเลิก</span></div>
                                   )}
                                 </div>
                               </div>
                               <div className="flex items-center justify-between w-full mt-2">
                                 <div className="flex items-center gap-2">
                                   {apt.channel === 'Direct' ? <Smartphone className="w-[16px] h-[16px] text-green-600" /> : apt.channel === 'Hospital' ? <Home className="w-[16px] h-[16px] text-purple-600" /> : <Building2 className="w-[16px] h-[16px] text-blue-600" />}
                                   <span className={cn("font-['IBM_Plex_Sans_Thai'] font-medium text-[16px]", apt.channel === 'Direct' ? "text-green-700" : apt.channel === 'Hospital' ? "text-purple-700" : "text-blue-700")}>
                                     {apt.channel === 'Direct' ? 'Direct (ผู้ป่วยเชื่อมต่อเอง)' : apt.channel === 'Hospital' ? 'โรงพยาบาล' : 'Via Host (ผ่านหน่วยงาน)'}
                                   </span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                   <Calendar className="w-3.5 h-3.5 text-[#6a7282]" />
                                   <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">{formatThaiShortDate(apt.requestDate || apt.date)}</span>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     ))}
                   </div>
                 ))
               );
             })()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}