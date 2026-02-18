import React, { useState } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Label } from "../../../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { 
  ChevronLeft,
  Search, 
  Calendar, 
  User, 
  Smartphone, 
  Building2, 
  Video,
  Clock,
  Filter,
  Home
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner@2.0.3";


const THAI_MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const formatShortThaiDate = (d: Date) => `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]}`;

import { TeleForm } from './TeleForm';

interface TeleConsultationSystemProps {
  onBack?: () => void;
}

// --- Mock Data Types ---

type ChannelType = 'Direct' | 'Intermediary';

interface TeleAppointment {
  id: string;
  patientName: string;
  hn: string;
  treatmentDetails: string;
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
}

// --- Mock Data ---

const MOCK_APPOINTMENTS: TeleAppointment[] = [
  {
    id: "TC-001",
    patientName: "นาย สมชาย รักดี",
    hn: "HN001",
    treatmentDetails: "ติดตามอาการเบาหวานและความดัน",
    date: "2025-12-25",
    time: "10:00",
    meetingLink: "https://zoom.us/j/123456789",
    channel: "Direct",
    status: "Scheduled",
    caseManager: "พยาบาลวิชาชีพ ใจดี มีเมตตา",
    hospital: "โรงพยาบาลนครพิงค์",
    pcu: "รพ.สต.บ้านดอนแก้ว",
    zoomUser: "นาย สมชาย รักดี"
  },
  {
    id: "TC-002",
    patientName: "นาง สมหญิง จริงใจ",
    hn: "HN002",
    treatmentDetails: "ปรึกษาปัญหาแผลเรื้อรัง",
    date: "2025-12-26",
    time: "14:30",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    channel: "Intermediary",
    intermediaryName: "รพ.สต. บ้านหนองหอย",
    status: "Scheduled",
    caseManager: "พยาบาลวิชาชีพ สุภาพ เรียบร้อย",
    hospital: "โรงพยาบาลนครพิงค์",
    pcu: "รพ.สต.บ้านหนองหอย",
    zoomUser: "เจ้าหน้าที่ รพ.สต."
  }
];

const MOCK_HISTORY: TeleAppointment[] = [
  {
    id: "TC-003",
    patientName: "นาย สมชาย รักดี",
    hn: "HN001",
    treatmentDetails: "ติดตามผลการปรับยา",
    date: "2025-11-20",
    time: "09:00",
    meetingLink: "https://zoom.us/j/987654321",
    channel: "Direct",
    status: "Completed",
    caseManager: "พยาบาลวิชาชีพ ใจดี มีเมตตา",
    hospital: "โรงพยาบาลนครพิงค์",
    pcu: "รพ.สต.บ้านดอนแก้ว",
    zoomUser: "นาย สมชาย รักดี"
  },
  {
    id: "TC-004",
    patientName: "ด.ช. กล้าหาญ ชาญชัย",
    hn: "HN005",
    treatmentDetails: "ประเมินพัฒนาการเด็ก",
    date: "2025-11-15",
    time: "13:00",
    meetingLink: "https://zoom.us/j/555666777",
    channel: "Intermediary",
    intermediaryName: "โรงพยาบาลแม่แตง",
    status: "Completed"
  },
    {
    id: "TC-005",
    patientName: "นาง มานี มีตา",
    hn: "HN006",
    treatmentDetails: "ติดตามอาการผื่นคัน",
    date: "2025-11-10",
    time: "10:00",
    meetingLink: "-",
    channel: "Direct",
    status: "Cancelled"
  }
];

export function TeleConsultationSystem({ onBack }: TeleConsultationSystemProps) {
  const [appointments, setAppointments] = useState<TeleAppointment[]>(MOCK_APPOINTMENTS);
  const [history, setHistory] = useState<TeleAppointment[]>(MOCK_HISTORY);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Form State
  const [viewingData, setViewingData] = useState<TeleAppointment | null>(null);

  const handleEditClick = (apt: TeleAppointment) => {
    setViewingData(apt);
  };

  const FILTER_OPTIONS = [
    { id: 'All', label: 'ทั้งหมด' },
    { id: 'Scheduled', label: 'รอสาย' },
    { id: 'Completed', label: 'เสร็จสิ้น' },
    { id: 'Cancelled', label: 'ยกเลิก' }
  ];

  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  const getFilteredData = (data: TeleAppointment[]) => {
    return data.filter(item => {
        const matchesSearch = item.patientName.includes(searchTerm) || item.hn.includes(searchTerm);
        const matchesFilter = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });
  };

  if (viewingData) {
    return (
      <TeleForm 
        data={viewingData}
        onBack={() => setViewingData(null)}
      />
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">ระบบ Tele-med</h1>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, HN..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" 
                    />
                </div>
                
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <button className="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0 shadow-sm text-slate-500">
                       <Filter className="w-5 h-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100">
                      <div className="flex flex-col">
                          {FILTER_OPTIONS.map((option) => (
                              <button
                                  key={option.id}
                                  onClick={() => handleFilterSelect(option.id, () => setIsFilterOpen(false))}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
                                      filterStatus === option.id ? "bg-slate-50 text-[#7367f0]" : "text-slate-700 hover:bg-slate-50"
                                  )}
                              >
                                  {option.label}
                              </button>
                          ))}
                          <div className="my-1 border-t border-slate-100" />
                          <button 
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full text-left px-3 py-3 text-[16px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ยกเลิก
                          </button>
                      </div>
                  </PopoverContent>
                </Popover>
             </div>
             
             <TabsList className="bg-[#F3F4F6] p-1 h-12 rounded-xl grid grid-cols-2 w-full">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold relative">
                   รายการนัดหมาย
                   {appointments.length > 0 && 
                     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {appointments.length}
                     </span>
                   }
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold">
                   ประวัติ
                </TabsTrigger>
             </TabsList>
          </div>

          {/* --- Tab 1: Upcoming Appointments --- */}
          <TabsContent value="upcoming" className="space-y-4 mt-2">
             {getFilteredData(appointments).map(apt => (
                 <Card key={apt.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => handleEditClick(apt)}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Right Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                {/* Header Row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                            {apt.patientName}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <User className="w-[14px] h-[14px] text-[#6a7282]" />
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px]">
                                                {apt.hn}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Status Badge */}
                                        <div className="bg-[#E0FBFC] px-3 py-1 rounded-[10px]">
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">รอสาย</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Row */}
                                <div className="flex items-center justify-between w-full mt-2">
                                    {/* Channel Type */}
                                    <div className="flex items-center gap-2">
                                        {apt.channel === 'Direct' ? (
                                            <Smartphone className="w-[16px] h-[16px] text-[#7367f0]" />
                                        ) : (
                                            <Building2 className="w-[16px] h-[16px] text-[#7367f0]" />
                                        )}
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[12px]">
                                            {apt.channel === 'Direct' ? 'Direct Call' : 'Via Host'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                            {formatShortThaiDate(new Date(apt.date))} {apt.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
             {getFilteredData(appointments).length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบรายการนัดหมาย</p>
                 </div>
             )}
          </TabsContent>

          {/* --- Tab 2: History --- */}
          <TabsContent value="history" className="space-y-4 mt-2">
             {getFilteredData(history).map(apt => (
                 <Card key={apt.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => handleEditClick(apt)}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Right Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                {/* Header Row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                            {apt.patientName}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <User className="w-[14px] h-[14px] text-[#6a7282]" />
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px]">
                                                {apt.hn}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Status Badge */}
                                        {apt.status === 'Completed' ? (
                                            <div className="bg-green-100 px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-green-600 text-[12px]">เสร็จสิ้น</span>
                                            </div>
                                        ) : (
                                            <div className="bg-red-100 px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-red-600 text-[12px]">ยกเลิก</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Details Row */}
                                <div className="flex items-center justify-between w-full mt-2">
                                    <div className="flex items-center gap-2">
                                        {apt.channel === 'Direct' ? (
                                            <Smartphone className="w-[16px] h-[16px] text-gray-400" />
                                        ) : (
                                            <Building2 className="w-[16px] h-[16px] text-gray-400" />
                                        )}
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-gray-500 text-[12px]">
                                            {apt.channel === 'Direct' ? 'Direct Call' : 'Via Host'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                            {formatShortThaiDate(new Date(apt.date))} {apt.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
             {getFilteredData(history).length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบประวัติ</p>
                 </div>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}