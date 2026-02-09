import React from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Calendar, 
  Home, 
  AlertCircle
} from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { cn } from "../../../../components/ui/utils";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";
import { VisitRequest } from "./types";

interface HomeVisitDetailProps {
  request: VisitRequest;
  onBack: () => void;
  onCancelRequest?: (id: string) => void;
  onOpenForm?: () => void;
}

export function HomeVisitDetail({ request, onBack, onCancelRequest, onOpenForm }: HomeVisitDetailProps) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-[#f8f9fa] w-full h-[100dvh] overflow-y-auto font-sans [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Header Container */}
      <div className="sticky top-0 z-[10000] w-full bg-[#7066a9] shadow-md flex flex-col">
        {/* Status Bar */}
        <div className="w-full">
            <StatusBarIPhone16Main />
        </div>
        
        {/* Navigation Bar */}
        <div className="h-[50px] px-4 flex items-center gap-3 shrink-0 pb-2">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold leading-none pt-0.5">รายละเอียด</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-md mx-auto w-full pb-24 pt-4">
        {/* Patient Info Card */}
        <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-[#5e5873] text-base font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                </CardTitle>
                {request.status === 'Pending' && (
                    <div className="bg-[#fff0e1] px-3 py-1 rounded-[10px]">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#ff9f43] text-[12px]">รอการตอบรับ</span>
                    </div>
                )}
                {request.status === 'InProgress' && (
                    <div className="bg-[#E0FBFC] px-3 py-1 rounded-[10px]">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">ดำเนินการ</span>
                    </div>
                )}
                {request.status === 'NotHome' && (
                    <div className="bg-[#F8F8F8] px-3 py-1 rounded-[10px]">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#B9B9C3] text-[12px]">ไม่อยู่</span>
                    </div>
                )}
                {request.status === 'NotAllowed' && (
                    <div className="bg-[#FCEAEA] px-3 py-1 rounded-[10px]">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#EA5455] text-[12px]">ไม่อนุญาต</span>
                    </div>
                )}
                {request.status === 'Completed' && (
                    <div className="bg-[#E5F8ED] px-3 py-1 rounded-[10px]">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#28C76F] text-[12px]">เสร็จสิ้น</span>
                    </div>
                )}
            </CardHeader>
            <div className="px-6 pb-2">
                <div className="h-[1px] bg-gray-100 w-full"></div>
            </div>
            <CardContent className="pt-2 pb-6">
                <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-[#5e5873] text-lg">{request.name}</h3>
                        <p className="text-gray-500 text-sm">HN: {request.hn}</p>
                        
                        <div className="flex flex-col gap-1 mt-2">
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                <span className="break-all">{request.contact?.address || request.patientAddress || 'ไม่ระบุที่อยู่'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                <span>{request.contact?.phone || '08x-xxx-xxxx'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Actions Card - Mobile Friendly */}
        <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="pb-2">
                 <CardTitle className="text-[#5e5873] text-base font-bold">การดำเนินการ</CardTitle>
            </CardHeader>
             <div className="px-6 pb-2">
                <div className="h-[1px] bg-gray-100 w-full"></div>
            </div>
            <CardContent className="pt-2 space-y-3">
                {request.status === 'InProgress' && request.type !== 'Delegated' && (
                    <Button 
                        onClick={onOpenForm}
                        className="w-full h-10 bg-[#7367f0] hover:bg-[#685dd8] text-white rounded-xl shadow-md"
                    >
                        <FileText className="w-4 h-4 mr-2" /> กรอกฟอร์มเยี่ยมบ้าน
                    </Button>
                )}
                <Button variant="outline" className="w-full h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl">
                    <Phone className="w-4 h-4 mr-2" /> ติดต่อ รพ.สต.
                </Button>
                {request.status === 'Pending' && (
                    <Button 
                        variant="outline" 
                        className="w-full h-10 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                        onClick={() => onCancelRequest?.(request.id)}
                    >
                        ยกเลิกคำขอ
                    </Button>
                )}
            </CardContent>
        </Card>

        {/* Visit Details Card */}
        <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[#5e5873] text-base font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#7367f0]" /> รายละเอียดการเยี่ยม
                </CardTitle>
            </CardHeader>
            <div className="px-6 pb-2">
                <div className="h-[1px] bg-gray-100 w-full"></div>
            </div>
            <CardContent className="pt-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500">ประเภทการเยี่ยม</span>
                        <div className="flex items-center gap-1.5 font-medium text-[#7367f0] text-sm">
                            <Home className="w-4 h-4" />
                            {request.type === 'Joint' ? 'ลงเยี่ยมพร้อม รพ.สต.' : 'ฝาก รพ.สต. เยี่ยม'}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500">หน่วยงานที่รับผิดชอบ</span>
                        <div className="flex items-center gap-1.5 font-medium text-[#5e5873] text-sm">
                            <Home className="w-4 h-4 text-gray-400" />
                            {request.rph}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500">วันที่แจ้งคำขอ</span>
                        <div className="flex items-center gap-1.5 font-medium text-[#5e5873] text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {request.requestDate}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs text-gray-500">ความเร่งด่วน</span>
                        <div className="flex items-center gap-1.5 font-medium text-orange-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            ปานกลาง
                        </div>
                    </div>
                    {request.type === 'Joint' && (
                        <div className="space-y-1">
                            <span className="text-xs text-gray-500">วันนัด</span>
                            <div className="flex items-center gap-1.5 font-medium text-[#5e5873] text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                14 ธ.ค. 68
                            </div>
                        </div>
                    )}
                </div>

                {request.note && (
                    <div className="mt-4 bg-[#f8f9fa] p-3 rounded-xl border border-dashed border-gray-200">
                        <span className="text-xs font-semibold text-gray-500 block mb-1">หมายเหตุ / อาการเบื้องต้น</span>
                        <p className="text-sm text-[#5e5873]">{request.note}</p>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Tracking Status Card */}
        <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[#5e5873] text-base font-bold">สถานะการติดตาม</CardTitle>
            </CardHeader>
            <div className="px-6 pb-2">
                <div className="h-[1px] bg-gray-100 w-full"></div>
            </div>
            <CardContent className="pt-4">
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                    {/* Step 1: Created */}
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#5e5873]">สร้างคำขอเยี่ยมบ้าน</span>
                            <span className="text-xs text-gray-400">{request.requestDate}</span>
                        </div>
                    </div>

                    {/* Step 2: Accepted */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            request.status === 'InProgress' || request.status === 'Completed' ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-sm font-bold",
                                request.status === 'InProgress' || request.status === 'Completed' ? "text-[#5e5873]" : "text-gray-400"
                            )}>ดำเนินการ / ตอบรับ</span>
                            <span className="text-xs text-gray-400">-</span>
                        </div>
                    </div>

                    {/* Step 3: Visited */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            request.status === 'Completed' ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                         <div className="flex flex-col">
                            <span className={cn(
                                "text-sm font-bold",
                                request.status === 'Completed' ? "text-[#5e5873]" : "text-gray-400"
                            )}>ลงพื้นที่เยี่ยมบ้าน</span>
                            <span className="text-xs text-gray-400">-</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>,
    document.body
  );
}