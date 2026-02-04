import React from 'react';
import { 
  Clock,
  User,
  Smartphone,
  Video,
  ArrowLeft,
  Search
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { TeleSession, TeleStatus } from "./TeleDetailMobile";

interface TeleListProps {
  data: TeleSession[];
  onSelect: (item: TeleSession) => void;
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreate?: () => void;
}

export function TeleList({ 
  data, 
  onSelect, 
  onBack, 
  searchQuery, 
  onSearchChange,
  onCreate
}: TeleListProps) {
  const getStatusStyle = (status: TeleStatus) => {
    switch (status) {
      case 'Active': return 'bg-[#EEEBFF] text-[#7367f0]';
      case 'Waiting': return 'bg-[#E0FBFC] text-[#00CFE8]';
      case 'Tech Issue': return 'bg-[#FFEEEE] text-[#EA5455]';
      case 'Delayed': return 'bg-[#FFF0E1] text-[#FF9F43]';
      case 'Completed': return 'bg-[#E5F8ED] text-[#28C76F]';
      default: return 'bg-[#F8F8F8] text-[#B9B9C3]';
    }
  };

  const translateStatus = (status: TeleStatus) => {
    switch (status) {
      case 'Active': return 'กำลังตรวจ';
      case 'Waiting': return 'รอตรวจ';
      case 'Tech Issue': return 'ปัญหาเทคนิค';
      case 'Delayed': return 'ล่าช้า';
      case 'Scheduled': return 'นัดหมายแล้ว';
      case 'Completed': return 'เสร็จสิ้น';
      default: return status;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
        {/* Header List View */}
        <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">รายการ Tele-Consult</h1>
                </div>
            </div>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="ค้นหาชื่อ, HN..." 
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-white border-slate-200 rounded-xl h-11 text-sm shadow-sm focus:ring-teal-500" 
                />
            </div>

            <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-700 text-lg text-[14px]">รายการ Tele-Consult</h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{data.length} รายการ</span>
            </div>
            <div className="space-y-3">
                {data.map((session) => (
                    <Card 
                        key={session.id}
                        onClick={() => onSelect(session)}
                        className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden cursor-pointer active:scale-[0.98] transition-all group"
                    >
                        <CardContent className="p-4">
                            <div className="flex gap-4">
                                {/* Right Content */}
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                                {session.patientName}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <User className="w-[14px] h-[14px] text-[#6a7282]" />
                                                <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px]">
                                                    {session.hn}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Status Badge */}
                                            <div className={cn("px-3 py-1 rounded-[10px]", getStatusStyle(session.status))}>
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px]">
                                                    {translateStatus(session.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Row */}
                                    <div className="flex items-center justify-between w-full mt-2">
                                        {/* Channel Type */}
                                        <div className="flex items-center gap-2">
                                            {session.platform.includes('Line') || session.platform.includes('Mobile') ? (
                                                <Smartphone className="w-[16px] h-[16px] text-[#7367f0]" />
                                            ) : (
                                                <Video className="w-[16px] h-[16px] text-[#7367f0]" />
                                            )}
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[12px]">
                                                {session.platform}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                                {session.startTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        {/* FAB */}
        <button 
            className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
            onClick={onCreate}
        >
            <div className="bg-[#7066a9] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full">
                <div className="relative shrink-0 w-4 h-4 pointer-events-none">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g>
                      <path d="M3.33293 7.99902H12.6651" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                      <path d="M7.99902 3.33293V12.6651" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                    </g>
                  </svg>
                </div>
            </div>
        </button>
    </div>
  );
}
