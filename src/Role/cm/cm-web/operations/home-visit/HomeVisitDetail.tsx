import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Calendar, 
  Home, 
  AlertCircle,
  FileEdit,
  Trash
} from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { cn } from "../../../../../components/ui/utils";

// Define interface locally if types.ts is not easily shared, or import from relative path if possible.
// Assuming VisitRequest type structure from mobile version
export interface VisitRequest {
    id: string;
    date: string; // The "display" date string in the data (e.g., '10 ม.ค. 67')
    time?: string;
    hn: string;
    name: string;
    rph: string; // Responsible Health Center (รพ.สต.)
    status: 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled' | 'NotHome' | 'NotAllowed';
    type: 'Delegated' | 'Joint'; // Delegated = ฝากเยี่ยม, Joint = ลงเยี่ยมด้วย
    requestDate: string;
    contact?: {
        phone: string;
        address: string;
        map?: { lat: number, lng: number };
    };
    patientAddress?: string; // Fallback
    tags?: string[];
    priority?: 'Normal' | 'Urgent' | 'Emergency';
    note?: string;
}

interface HomeVisitDetailProps {
  request: VisitRequest;
  onBack: () => void;
  onCancelRequest?: (id: string) => void;
  onOpenForm?: () => void;
}

export function HomeVisitDetail({ request, onBack, onCancelRequest, onOpenForm }: HomeVisitDetailProps) {
  return (
    <div className="flex flex-col h-full font-['IBM_Plex_Sans_Thai'] space-y-6">
      {/* Web Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={onBack} className="rounded-full border-slate-200">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    รายละเอียดการเยี่ยมบ้าน
                    <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full border",
                        request.status === 'Pending' ? "bg-orange-50 text-orange-600 border-orange-100" :
                        request.status === 'InProgress' ? "bg-blue-50 text-blue-600 border-blue-100" :
                        request.status === 'Completed' ? "bg-green-50 text-green-600 border-green-100" :
                        "bg-slate-50 text-slate-600 border-slate-100"
                    )}>
                        {request.status === 'Pending' ? 'รอการตอบรับ' :
                         request.status === 'InProgress' ? 'กำลังดำเนินการ' :
                         request.status === 'Completed' ? 'เสร็จสิ้น' : request.status}
                    </span>
                </h1>
                <p className="text-slate-500 text-sm">เลขที่คำขอ: {request.id}</p>
            </div>
        </div>
        <div className="flex gap-2">
             {request.status === 'InProgress' && request.type !== 'Delegated' && (
                <Button onClick={onOpenForm} className="bg-[#7367f0] hover:bg-[#685dd8] text-white">
                    <FileEdit className="w-4 h-4 mr-2" /> กรอกแบบประเมินเยี่ยมบ้าน
                </Button>
            )}
            {request.status === 'Pending' && (
                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => onCancelRequest?.(request.id)}>
                    <Trash className="w-4 h-4 mr-2" /> ยกเลิกคำขอ
                </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Info */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-xl shadow-sm border border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex gap-6 items-start">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                            <User className="w-10 h-10 text-slate-400" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-xl">{request.name}</h3>
                                <p className="text-slate-500">HN: {request.hn}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-0.5">ที่อยู่</span>
                                        <span className="text-sm text-slate-800 font-medium">{request.contact?.address || request.patientAddress || 'ไม่ระบุที่อยู่'}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <span className="text-xs text-slate-500 block mb-0.5">เบอร์โทรศัพท์</span>
                                        <span className="text-sm text-slate-800 font-medium">{request.contact?.phone || '08x-xxx-xxxx'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#7367f0]" /> รายละเอียดคำขอ
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-sm text-slate-500">ประเภทการเยี่ยม</span>
                            <div className="flex items-center gap-2 font-medium text-[#7367f0]">
                                <Home className="w-4 h-4" />
                                {request.type === 'Joint' ? 'ลงเยี่ยมพร้อม รพ.สต.' : 'ฝาก รพ.สต. เยี่ยม'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm text-slate-500">หน่วยงานที่รับผิดชอบ</span>
                            <div className="flex items-center gap-2 font-medium text-slate-800">
                                <Home className="w-4 h-4 text-slate-400" />
                                {request.rph}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm text-slate-500">วันที่แจ้งคำขอ</span>
                            <div className="flex items-center gap-2 font-medium text-slate-800">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {request.requestDate}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm text-slate-500">ความเร่งด่วน</span>
                            <div className="flex items-center gap-2 font-medium text-orange-500">
                                <AlertCircle className="w-4 h-4" />
                                {request.priority || 'ปานกลาง'}
                            </div>
                        </div>
                        {request.type === 'Joint' && (
                            <div className="space-y-1">
                                <span className="text-sm text-slate-500">วันนัดหมายลงพื้นที่</span>
                                <div className="flex items-center gap-2 font-medium text-slate-800">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    14 ธ.ค. 68
                                </div>
                            </div>
                        )}
                    </div>

                    {request.note && (
                        <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">หมายเหตุ / อาการเบื้องต้น</span>
                            <p className="text-slate-700">{request.note}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Tracking */}
        <div className="space-y-6">
            <Card className="rounded-xl shadow-sm border border-slate-200 h-full">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-lg font-bold text-slate-800">สถานะการติดตาม</CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="relative pl-4 border-l-2 border-slate-100 space-y-10 ml-2">
                        {/* Step 1: Created */}
                        <div className="relative">
                            <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-green-500 ring-4 ring-white shadow-sm"></div>
                            <div className="flex flex-col">
                                <span className="text-base font-bold text-slate-800">สร้างคำขอเยี่ยมบ้าน</span>
                                <span className="text-xs text-slate-400">{request.requestDate}</span>
                            </div>
                        </div>

                        {/* Step 2: Accepted */}
                        <div className="relative">
                            <div className={cn(
                                "absolute -left-[23px] top-1 w-4 h-4 rounded-full ring-4 ring-white shadow-sm",
                                request.status === 'InProgress' || request.status === 'Completed' ? "bg-green-500" : "bg-slate-200"
                            )}></div>
                            <div className="flex flex-col">
                                <span className={cn(
                                    "text-base font-bold",
                                    request.status === 'InProgress' || request.status === 'Completed' ? "text-slate-800" : "text-slate-400"
                                )}>ดำเนินการ / ตอบรับ</span>
                                <span className="text-xs text-slate-400">-</span>
                            </div>
                        </div>

                        {/* Step 3: Visited */}
                        <div className="relative">
                            <div className={cn(
                                "absolute -left-[23px] top-1 w-4 h-4 rounded-full ring-4 ring-white shadow-sm",
                                request.status === 'Completed' ? "bg-green-500" : "bg-slate-200"
                            )}></div>
                             <div className="flex flex-col">
                                <span className={cn(
                                    "text-base font-bold",
                                    request.status === 'Completed' ? "text-slate-800" : "text-slate-400"
                                )}>ลงพื้นที่เยี่ยมบ้าน</span>
                                <span className="text-xs text-slate-400">-</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
