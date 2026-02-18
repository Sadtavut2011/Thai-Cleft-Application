import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { 
  Video, 
  Search, 
  Clock, 
  Calendar, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  XCircle,
  Filter
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { th } from "date-fns/locale";
import { TeleConsultationSystemDetail } from "./TeleConsultationSystemDetail";
import { TELEMED_DATA } from "../../../../../data/patientData";
import { formatThaiDateWithDay } from "../../../../../components/shared/ThaiCalendarDrawer";
import { WebCalendarView, ViewModeToggle } from "../shared/WebCalendarView";

const THAI_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

function toISODateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// --- Types (Matched with Mobile) ---

export type ChannelType = 'Direct' | 'Intermediary' | 'Hospital';

export interface TeleAppointment {
  id: string;
  patientImage?: string | null;
  patientName: string;
  hn: string;
  treatmentDetails?: string;
  date: string;
  time: string;
  meetingLink: string;
  channel: ChannelType;
  intermediaryName?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  caseManager?: string;
  hospital?: string;
  pcu?: string;
  zoomUser?: string;
  requestDate?: string; // วันที่สร้างคำขอ — synced with history
}

// --- Data Mapping (Copied from Mobile) ---
const mapTelemedData = (data: typeof TELEMED_DATA): TeleAppointment[] => {
    return data.map((item: any) => ({
        id: item.id,
        patientImage: item.patientImage,
        patientName: item.patientName,
        hn: item.hn,
        treatmentDetails: undefined, // Force undefined so detail uses fallback
        date: item.date,
        time: item.time,
        meetingLink: item.meetingLink || "",
        channel: (item.channel === 'mobile' ? 'Direct' : item.channel === 'hospital' ? 'Hospital' : 'Intermediary') as ChannelType,
        status: (item.status === 'Waiting' ? 'Scheduled' : item.status) as 'Scheduled' | 'Completed' | 'Cancelled',
        intermediaryName: item.channel !== 'mobile' ? (item.agency_name || "โรงพยาบาลต้นทาง") : undefined,
        caseManager: "-",
        hospital: "โรงพยาบาลนครพิงค์", 
        pcu: "รพ.สต.บ้านดอนแก้ว",
        zoomUser: item.patientName,
        requestDate: item.requestDate || undefined,
    }));
};

export default function TeleConsultationSystem({
  onBack,
  onViewPatient
}: {
  onBack?: () => void;
  onViewPatient?: (patient: any) => void;
}) {
  // --- State ---
  const [allAppointments, setAllAppointments] = useState<TeleAppointment[]>([]);
  const [appointments, setAppointments] = useState<TeleAppointment[]>([]); // Upcoming
  const [history, setHistory] = useState<TeleAppointment[]>([]); // History

  const [selectedAppointment, setSelectedAppointment] = useState<TeleAppointment | null>(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState<string | null>(null);

  // --- Logic ---
  useEffect(() => {
      const mapped = mapTelemedData(TELEMED_DATA);
      setAllAppointments(mapped);
      
      // Split into Upcoming (Scheduled) and History (Completed/Cancelled)
      const upcoming = mapped.filter(d => d.status === 'Scheduled');
      const past = mapped.filter(d => d.status !== 'Scheduled');
      
      setAppointments(upcoming);
      setHistory(past);
  }, []);

  const getFilteredData = (data: TeleAppointment[]) => {
      return data.filter(apt => {
          const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                apt.hn.includes(searchTerm);
          const matchesDate = selectedDate ? apt.date === selectedDate : true;
          const matchesFilter = filterStatus === 'All' || apt.status === filterStatus;
          const matchesChannel = filterChannel === 'all' || apt.channel === filterChannel;

          return matchesSearch && matchesDate && matchesFilter && matchesChannel;
      });
  };

  const filteredUpcoming = getFilteredData(appointments);
  const filteredHistory = getFilteredData(allAppointments); // Show ALL statuses in history (matched with HomeVisit pattern)

  // --- Detail View Wrapper ---
  // If selectedAppointment exists, we map it to the structure expected by TeleConsultationSystemDetail
  // (Assuming TeleConsultationSystemDetail expects 'appointment' prop with compatible fields)
  // Let's check if TeleConsultationSystemDetail needs adjustment. 
  // For now, we pass the TeleAppointment object.

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 relative font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Header Banner */}
      {!selectedAppointment && (
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
              <Video className="w-5 h-5" /> ระบบกรแพทย์ทางไกล (Tele-medicine)
          </h1>
        </div>
      </div>
      )}

      {!selectedAppointment && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <div className="bg-[#E0FBFC] border border-[#B8F2F5] rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-[#00A8BD] font-bold text-2xl">{appointments.filter(a => a.status === 'Scheduled').length}</p>
                  <p className="text-[#00A8BD]/80 text-sm">รอสาย (Scheduled)</p>
              </div>
              <div className="bg-white/50 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-[#00A8BD]" />
              </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{allAppointments.filter(a => a.channel === 'Direct').length}</p>
                  <p className="text-blue-600/80 text-sm">Direct to Patient</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-purple-600 font-bold text-2xl">{allAppointments.filter(a => a.channel === 'Intermediary').length}</p>
                  <p className="text-purple-600/80 text-sm">Via Host Agency</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                  <Building2 className="w-5 h-5 text-purple-600" />
              </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">{history.filter(a => a.status === 'Cancelled').length}</p>
                  <p className="text-red-600/80 text-sm">ยกเลิกนัดหมาย</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="w-5 h-5 text-red-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">{history.filter(a => a.status === 'Completed').length}</p>
                  <p className="text-green-600/80 text-sm">ตรวจเสร็จสิ้น</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
          </div>
      </div>
      )}

      {/* Main Content: Detail View OR List View */}
      {selectedAppointment ? (
        <TeleConsultationSystemDetail 
          appointment={selectedAppointment as any} 
          onBack={() => setSelectedAppointment(null)} 
        />
      ) : (
      <Card className="border-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
        
        {/* Card Header with Search */}
        <div className="p-6 border-b border-[#EBE9F1] flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#5e5873] flex items-center gap-2">
                <Video className="w-5 h-5 text-[#7367f0]" /> รายการ Tele-consult
            </h2>
             
             <div className="flex items-center gap-3 w-full md:w-auto">
                 {/* Search */}
                 <div className="relative w-full max-w-[300px]">
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, HN..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pr-10 h-[40px] border-[#EBE9F1] bg-white focus:ring-[#40bfff]"
                    />
                    <div className="absolute right-0 top-0 h-full w-10 bg-[rgb(115,103,240)] flex items-center justify-center rounded-r-md cursor-pointer hover:bg-[#23af62]">
                        <Search className="h-4 w-4 text-white" />
                    </div>
                 </div>

                 <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
             </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="p-6 space-y-6">
            <WebCalendarView
              items={allAppointments}
              dateField="date"
              themeColor="#e91e63"
              countLabel="นัด"
              selectedDate={calendarDate}
              onDateSelect={setCalendarDate}
              itemFilter={(item) => !!item.date}
            />
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead>วัน/เวลา</TableHead>
                    <TableHead>ผู้ป่วย</TableHead>
                    <TableHead>ช่องทาง</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const calItems = allAppointments.filter(apt => {
                      if (!apt.date) return false;
                      if (calendarDate && apt.date !== calendarDate) return false;
                      if (searchTerm) {
                        const q = searchTerm.toLowerCase();
                        if (!apt.patientName.toLowerCase().includes(q) && !apt.hn.toLowerCase().includes(q)) return false;
                      }
                      return true;
                    });
                    if (calItems.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                            <div className="flex flex-col items-center gap-3">
                              <Video className="w-10 h-10 opacity-20" />
                              <p className="text-sm">{calendarDate ? 'ไม่พบรายการในวันที่เลือก' : 'เลือกวันที่เพื่อดูรายการ'}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return calItems.map(apt => (
                      <TableRow key={apt.id} className="cursor-pointer hover:bg-slate-50 group" onClick={() => setSelectedAppointment(apt)}>
                        <TableCell>
                          <div className={cn("p-2 rounded-lg w-fit",
                            apt.status === 'Scheduled' ? "bg-[#E0FBFC] text-[#00A8BD]" :
                            apt.status === 'Completed' ? "bg-green-100 text-green-600" :
                            "bg-red-100 text-red-600"
                          )}>
                            {apt.status === 'Scheduled' ? <Clock className="w-4 h-4" /> : apt.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-[#5e5873] font-medium">{formatThaiDateWithDay(new Date(apt.date))}</div>
                          <div className="text-xs text-[#b9b9c3]">{apt.time}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{apt.patientName}</div>
                            <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {apt.hn}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-[#5e5873]">
                            {apt.channel === 'Direct' ? 'Direct' : apt.channel === 'Hospital' ? `โรงพยาบาล` : `Via Host`}
                          </div>
                        </TableCell>
                        <TableCell>
                          {apt.status === 'Scheduled' ? (
                            <Badge className="bg-[#E0FBFC] text-[#00A8BD] border-none font-medium">รอสาย</Badge>
                          ) : apt.status === 'Completed' ? (
                            <Badge className="bg-green-100 text-green-800 border-none font-medium">เสร็จสิ้น</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 border-none font-medium">ยกเลิก</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div onClick={(e) => e.stopPropagation()} className="inline-block">
                            <a href={apt.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#7367f0] hover:text-[#5e54ce] px-2 py-1 rounded text-xs font-medium transition-colors">
                              <Video className="w-3.5 h-3.5" /> Join
                            </a>
                          </div>
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
                <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                {/* Filters Section */}
                <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 items-center justify-between">
                    <TabsList className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 h-auto">
                        <TabsTrigger 
                            value="upcoming" 
                            className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#7367f0] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-500 hover:text-[#7367f0] min-w-[140px]"
                        >
                            รายการนัดหมาย
                        </TabsTrigger>
                        <TabsTrigger 
                            value="history" 
                            className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#7367f0] data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-500 hover:text-[#7367f0] min-w-[140px] relative"
                        >
                            ประวัติย้อนหลัง
                            {history.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white shadow-sm">
                                    {history.length}
                                </span>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">ช่องทาง:</span>
                            <Select value={filterChannel} onValueChange={setFilterChannel}>
                                <SelectTrigger className="w-[160px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm">
                                    <SelectValue placeholder="ช่องทาง" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">ทั้งหมด</SelectItem>
                                    <SelectItem value="Direct">Direct (ผู้ป่วยตรง)</SelectItem>
                                    <SelectItem value="Intermediary">Via Host (ผ่านหน่วยงาน)</SelectItem>
                                    <SelectItem value="Hospital">Via Hospital (ผ่านโรงพยาบาล)</SelectItem>
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
                                    <SelectItem value="Scheduled">รอสาย</SelectItem>
                                    <SelectItem value="Completed">เสร็จสิ้น</SelectItem>
                                    <SelectItem value="Cancelled">ยกเลิก</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">วันที่สร้างคำขอ:</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm justify-start text-left font-normal">
                                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                        {selectedDate ? (() => {
                                            const date = new Date(selectedDate);
                                            return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
                                        })() : "ทั้งหมด"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <CalendarPicker
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

                {/* Tab: Upcoming Appointments */}
                <TabsContent value="upcoming" className="mt-0">
                   <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[60px]"></TableHead>
                                <TableHead>วัน/เวลา</TableHead>
                                <TableHead>ผู้ป่วย</TableHead>
                                <TableHead>ช่องทาง</TableHead>
                                <TableHead>ผู้ดแลรับผิดชอบ</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUpcoming.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <Calendar className="w-10 h-10 opacity-20" />
                                            <p className="text-sm">ไม่มีรายการนัดหมายที่กำลังจะถึง</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUpcoming.map((apt) => (
                                    <TableRow
                                        key={apt.id}
                                        className="cursor-pointer hover:bg-slate-50 group"
                                        onClick={() => setSelectedAppointment(apt)}
                                    >
                                        <TableCell>
                                           <div className="p-2 rounded-lg w-fit bg-[#E0FBFC] text-[#00A8BD]">
                                               <Clock className="w-4 h-4" />
                                           </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-[#5e5873] font-medium">{formatThaiDateWithDay(new Date(apt.date))}</div>
                                            <div className="text-xs text-[#b9b9c3]">{apt.time}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{apt.patientName}</div>
                                                <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {apt.hn}</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                                {apt.channel === 'Direct' ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-medium">
                                                        <Smartphone className="w-3 h-3" /> Direct
                                                    </div>
                                                ) : apt.channel === 'Hospital' ? (
                                                    <div className="flex flex-col items-start gap-1">
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-50 text-purple-600 border border-purple-100 text-[11px] font-medium">
                                                            <Building2 className="w-3 h-3" /> โรงพยาบาล
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 px-1 truncate max-w-[120px]">
                                                            {apt.intermediaryName}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-start gap-1">
                                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-medium">
                                                            <Building2 className="w-3 h-3" /> Via Host
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 px-1 truncate max-w-[120px]">
                                                            {apt.intermediaryName}
                                                        </span>
                                                    </div>
                                                )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-[#5e5873]">{apt.caseManager || "-"}</div>
                                        </TableCell>
                                        <TableCell>
                                                <Badge className="bg-[#E0FBFC] text-[#00A8BD] hover:bg-[#B8F2F5] border-none font-medium">
                                                    รอสาย
                                                </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="inline-block"
                                            >
                                                <a 
                                                    href={apt.meetingLink} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="inline-flex items-center gap-1.5 text-[#7367f0] hover:text-[#5e54ce] hover:bg-[#7367f0]/5 px-2 py-1 rounded text-xs font-medium transition-colors"
                                                >
                                                    <Video className="w-3.5 h-3.5" /> Join
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                   </div>
                </TabsContent>

                {/* Tab: History Tracking */}
                <TabsContent value="history" className="mt-0">
                   <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[60px]"></TableHead>
                                <TableHead>วัน/เวลา</TableHead>
                                <TableHead>ผู้ป่วย</TableHead>
                                <TableHead>ช่องทาง</TableHead>
                                <TableHead>ผู้ดูแลรับผิดชอบ</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {(() => {
                             // Group by date for history (matched with HomeVisit pattern)
                             const groups: { date: string; label: string; items: typeof filteredHistory }[] = [];
                             const map = new Map<string, typeof filteredHistory>();
                             filteredHistory.forEach(item => {
                               const dateKey = String(item.date || 'unknown');
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
                             if (groups.length === 0) {
                               return (
                                 <TableRow>
                                     <TableCell colSpan={7} className="text-center text-gray-400 py-12">
                                         <div className="flex flex-col items-center gap-3">
                                             <Clock className="w-10 h-10 opacity-20" />
                                             <p className="text-sm">ไม่มีประวัติย้อนหลัง</p>
                                         </div>
                                     </TableCell>
                                 </TableRow>
                               );
                             }
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
                               ...group.items.map((apt) => (
                               <TableRow 
                                    key={apt.id} 
                                    className="cursor-pointer hover:bg-slate-50 group"
                                    onClick={() => setSelectedAppointment(apt)}
                               >
                                   <TableCell>
                                       <div className={cn("p-2 rounded-lg w-fit", 
                                           apt.status === 'Scheduled' ? "bg-[#E0FBFC] text-[#00A8BD]" :
                                           apt.status === 'Completed' ? "bg-green-100 text-green-600" :
                                           "bg-red-100 text-red-600"
                                       )}>
                                           {apt.status === 'Scheduled' ? <Clock className="w-4 h-4" /> : apt.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                       </div>
                                   </TableCell>
                                   <TableCell>
                                       <div className="text-[#5e5873] font-medium">{formatThaiDateWithDay(new Date(apt.date))}</div>
                                       <div className="text-xs text-[#b9b9c3]">{apt.time}</div>
                                   </TableCell>
                                   <TableCell>
                                       <div>
                                           <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{apt.patientName}</div>
                                           <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {apt.hn}</Badge>
                                       </div>
                                   </TableCell>
                                   <TableCell>
                                       <div className="text-xs text-[#5e5873]">
                                            {apt.channel === 'Direct' ? 'Direct to Patient' : apt.channel === 'Hospital' ? `โรงพยาบาล (${apt.intermediaryName})` : `Via ${apt.intermediaryName}`}
                                       </div>
                                   </TableCell>
                                   <TableCell>
                                       <div className="text-sm text-[#5e5873]">{apt.caseManager || "-"}</div>
                                   </TableCell>
                                   <TableCell>
                                         {apt.status === 'Scheduled' ? (
                                            <Badge className="bg-[#E0FBFC] text-[#00A8BD] hover:bg-[#B8F2F5] border-none font-medium flex w-fit items-center gap-1">
                                                รอสาย
                                            </Badge>
                                         ) : apt.status === 'Completed' ? (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none font-medium flex w-fit items-center gap-1">
                                                เสร็จสิ้น
                                            </Badge>
                                         ) : (
                                            <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none font-medium flex w-fit items-center gap-1">
                                                ยกเลิก
                                            </Badge>
                                         )}
                                   </TableCell>
                                   <TableCell className="text-right">
                                       <div 
                                           onClick={(e) => e.stopPropagation()} 
                                           className="inline-block"
                                       >
                                           <a 
                                               href={apt.meetingLink} 
                                               target="_blank" 
                                               rel="noreferrer" 
                                               className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#5e54ce] hover:bg-gray-100 px-2 py-1 rounded text-xs font-medium transition-colors opacity-60"
                                           >
                                               <Video className="w-3.5 h-3.5" /> View
                                           </a>
                                       </div>
                                   </TableCell>
                               </TableRow>
                               ))
                             ]);
                           })()}
                        </TableBody>
                    </Table>
                   </div>
                </TabsContent>
        </Tabs>
        </div>
        )}
      </Card>
      )}
    </div>
  );
}