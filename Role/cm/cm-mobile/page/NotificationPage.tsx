import React from 'react';
import { ChevronLeft, Bell, Settings } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { cn } from "../../../../components/ui/utils";

// Mock Data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    title: 'ผู้ป่วยวิกฤต',
    message: 'นายสมชาย มีอาการหายใจลำบาก ต้องการความช่วยเหลือด่วน',
    time: '2 นาทีที่แล้ว',
    read: false,
  },
  {
    id: 2,
    type: 'appointment',
    title: 'นัดหมายใหม่',
    message: 'มีนัดหมายใหม่สำหรับ ด.ช. รักดี เวลา 10:00 น.',
    time: '1 ชั่วโมงที่แล้ว',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'อัปเดตระบบ',
    message: 'ระบบจะปิดปรับปรุงเวลา 02:00 - 04:00 น.',
    time: 'เมื่อวาน',
    read: true,
  },
  {
    id: 4,
    type: 'message',
    title: 'ข้อความใหม่',
    message: 'คุณได้รับข้อความใหม่จาก พยาบาลวิชาชีพ',
    time: 'เมื่อวาน',
    read: true,
  },
];

export default function NotificationPage({ onBack }: { onBack?: () => void }) {
  return (
    <div className="bg-slate-50 h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#7066a9] h-16 px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-white text-lg font-bold">การแจ้งเตือน</h1>
        <div className="ml-auto">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                <Settings className="w-5 h-5" />
            </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-md mx-auto p-4 space-y-4">
            {MOCK_NOTIFICATIONS.length > 0 ? (
                MOCK_NOTIFICATIONS.map((notif) => (
                    <div 
                        key={notif.id}
                        className={cn(
                            "bg-white p-4 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md cursor-pointer relative overflow-hidden",
                            !notif.read ? "border-l-4 border-l-[#7066a9]" : ""
                        )}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h3 className={cn("text-sm font-bold", !notif.read ? "text-[#7066a9]" : "text-slate-700")}>
                                {notif.title}
                            </h3>
                            <span className="text-sm text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{notif.message}</p>
                        {!notif.read && (
                            <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Bell className="w-12 h-12 mb-4 opacity-20" />
                    <p>ไม่มีการแจ้งเตือนใหม่</p>
                </div>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
