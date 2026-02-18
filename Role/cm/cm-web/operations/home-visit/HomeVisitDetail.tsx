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
  Trash,
  CheckCircle2,
  Clock,
  XCircle,
  Printer
} from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { cn } from "../../../../../components/ui/utils";
import { getPatientByHn } from "../../../../../data/patientData";

// Define interface locally if types.ts is not easily shared, or import from relative path if possible.
// Assuming VisitRequest type structure from mobile version
export interface VisitRequest {
    id: string;
    date: string;
    time?: string;
    hn: string;
    name: string;
    rph: string;
    status: 'Pending' | 'Accepted' | 'InProgress' | 'Completed' | 'Cancelled' | 'NotHome' | 'NotAllowed';
    type: 'Delegated' | 'Joint';
    requestDate: string;
    contact?: {
        phone: string;
        address: string;
        map?: { lat: number, lng: number };
    };
    patientAddress?: string;
    patientImage?: string;
    patientDob?: string;
    patientGender?: string;
    diagnosis?: string;
    patientPhone?: string;
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
  // Single source lookup from PATIENTS_DATA
  const patientRecord = getPatientByHn(request.hn);

  // Computed patient data
  const resolvedDob = patientRecord?.dob || (request as any).patientDob;
  const resolvedGender = patientRecord?.gender || (request as any).patientGender;
  const resolvedDiagnosis = patientRecord?.diagnosis || (request as any).diagnosis || '-';
  const resolvedImage = patientRecord?.image || (request as any).patientImage;

  const patientAge = (() => {
    if (!resolvedDob) return null;
    const dob = new Date(resolvedDob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const md = today.getMonth() - dob.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  })();
  const patientAgeGenderText = [
    patientAge !== null ? `${patientAge} ปี` : null,
    resolvedGender || null
  ].filter(Boolean).join(' / ') || '-';

  const statusLabel = request.status === 'Pending' ? 'รอการตอบรับ' :
    request.status === 'InProgress' ? 'กำลังดำเนินการ' :
    request.status === 'Completed' ? 'เสร็จสิ้น' : request.status;

  const statusBadgeClass = request.status === 'Pending' ? "bg-orange-50 text-orange-600 border-orange-200" :
    request.status === 'InProgress' ? "bg-blue-50 text-blue-600 border-blue-200" :
    request.status === 'Completed' ? "bg-green-50 text-green-600 border-green-200" :
    "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div className="flex flex-col h-full font-['IBM_Plex_Sans_Thai'] space-y-6">
      {/* Header Banner — matching Mobile VisitDetail */}
      <div className="bg-[#7066a9] px-4 py-3 rounded-xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
              <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors -ml-1">
                  <ArrowLeft size={22} />
              </button>
              <h1 className="text-white text-lg font-bold leading-none pt-0.5">รายละเอียดเยี่ยมบ้าน</h1>
          </div>
          <button className="text-white hover:bg-white/20 p-2 rounded-xl transition-colors" onClick={() => window.print()}>
              <Printer size={22} />
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Info */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-xl shadow-sm border border-slate-200">
                <CardHeader className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                        </CardTitle>
                        <span className={cn("text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5", statusBadgeClass)}>
                            {request.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {statusLabel}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {/* Row: Avatar + Name/HN + Action buttons */}
                    <div className="flex items-center gap-5">
                        <div className="w-[72px] h-[72px] bg-slate-100 rounded-full shrink-0 overflow-hidden border-2 border-white shadow">
                            {resolvedImage ? (
                                <img src={resolvedImage} alt={request.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-9 h-9 text-slate-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-xl truncate">{request.name}</h3>
                            <p className="text-slate-500 text-sm">HN: {request.hn}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                <Phone className="w-4 h-4" /> ติดต่อ
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                <FileText className="w-4 h-4" /> ดูประวัติ
                            </Button>
                        </div>
                    </div>

                    {/* Info strip */}
                    <div className="grid grid-cols-2 mt-5 bg-[#F4F9FF] rounded-lg border border-blue-100/60 overflow-hidden">
                        <div className="px-5 py-3 border-r border-blue-100/60">
                            <span className="text-xs text-slate-500 block mb-0.5">อายุ / เพศ</span>
                            <span className="text-sm text-slate-800 font-semibold">{patientAgeGenderText}</span>
                        </div>
                        <div className="px-5 py-3">
                            <span className="text-xs text-slate-500 block mb-0.5">ผลการวินิจฉัย</span>
                            <span className="text-sm text-slate-800 font-semibold">{resolvedDiagnosis}</span>
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