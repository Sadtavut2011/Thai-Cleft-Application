import React from 'react';
import { 
  Hospital,
  Video,
  Stethoscope,
  Clock,
  ArrowLeft,
  Search
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import type { Appointment } from "./AppointmentSystem";

interface AppointmentListProps {
  data: Appointment[];
  onSelect: (appointment: Appointment) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
  totalItems: number;
}

export function AppointmentList({ 
    data, 
    onSelect, 
    searchQuery, 
    onSearchChange, 
    onBack,
    totalItems 
}: AppointmentListProps) {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
        {/* Header List View */}
        <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">รายการนัดหมาย</h1>

                </div>
            </div>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Search in List View */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="ค้นหาผู้ป่วย, HN..." 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-white border-slate-200 rounded-xl h-11 text-sm shadow-sm focus:ring-teal-500" 
                />
            </div>
            
            {/* Card List */}
            <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-700 text-lg text-[14px]">รายการนัดหมาย</h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{data.length} รายการ</span>
            </div>
            <div className="space-y-3">
                {data.map((apt) => (
                    <Card 
                        key={apt.id}
                        onClick={() => onSelect(apt)}
                        className={cn(
                            "bg-white border-slate-200 shadow-sm rounded-xl p-3 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group",
                            apt.isOverdue && "border-rose-100 ring-1 ring-rose-50"
                        )}
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-tight">
                                        {apt.patientName}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Stethoscope className="w-3 h-3 text-indigo-500" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                            {apt.clinic === 'ศัลยกรรมตกแต่ง' ? 'ผ่าตัดเย็บเพดานปาก' : 
                                             apt.clinic === 'อรรถบำบัด' ? 'ฝึกพูด' : 
                                             apt.clinic === 'ทันตกรรม' ? 'ทันตกรรมประดิษฐ์' :
                                             apt.clinic}
                                        </span>
                                    </div>
                                </div>

                                 <div className={cn("px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap", 
                                    apt.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600" :
                                    apt.status === 'Pending' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                 )}>
                                    {apt.status === 'Confirmed' ? 'ยืนยันแล้ว' : apt.status === 'Pending' ? 'รอการยืนยัน' : apt.status}
                                 </div>
                            </div>

                            <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-gray-100">
                                 <div className="flex items-center gap-1.5">
                                     <Hospital className="w-3 h-3 text-teal-500" />
                                     <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] truncate max-w-[140px]">
                                         {apt.hospital}
                                     </span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <Clock className="w-3 h-3 text-[#6a7282]" />
                                     <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                         {format(new Date(apt.date), "d MMM", { locale: th })} {apt.time}
                                     </span>
                                 </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
        
        {/* FAB */}
        <button 
            className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
            onClick={() => {}}
        >
            <div className="bg-[#7066a9] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="Button">
                <div className="relative shrink-0 w-4 h-4" data-name="Icon">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g id="Icon">
                      <path d="M3.33293 7.99902H12.6651" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                      <path d="M7.99902 3.33293V12.6651" id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                    </g>
                  </svg>
                </div>
            </div>
        </button>
    </div>
  );
}
