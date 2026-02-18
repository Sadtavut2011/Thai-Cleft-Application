import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../../../components/ui/card";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { Separator } from "../../../../../components/ui/separator";
import { 
  ArrowLeft, 
  ArrowDown, 
  ArrowRight,
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Edit, 
  Trash2, 
  Printer, 
  AlertTriangle,
  FileText,
  User,
  ShieldAlert,
  Ambulance,
  CheckCircle2,
  XCircle,
  Paperclip,
  History,
  FileCheck,
  Building,
  Send,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";

// --- Types (Duplicated for standalone capability) ---

export interface ReferralLog {
  date: string;
  status: string;
  description: string;
  actor: string;
}

export interface Referral {
  id: string;
  referralNo: string;
  patientId: string;
  patientName: string;
  patientHn: string;
  referralDate: string;
  lastUpdateDate: string;
  type: 'Refer Out' | 'Refer In';
  sourceHospital: string;
  destinationHospital: string;
  reason: string;
  diagnosis: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Canceled';
  documents: string[];
  logs: ReferralLog[];
  destinationContact?: string;
}

const STATUS_LABELS: Record<string, string> = {
  'Pending': 'รอการตอบรับ',
  'Accepted': 'ตอบรับแล้ว',
  'Rejected': 'ถูกปฏิเสธ',
  'Completed': 'เสร็จสิ้น',
  'Canceled': 'ยกเลิก',
  'Created': 'สร้างรายการ',
  'Sent': 'ส่งเรื่องแล้ว',
  'Viewed': 'เปิดอ่านแล้ว'
};

interface ReferralSystemDetailProps {
  referral: Referral;
  onBack: () => void;
  onAccept: (date: Date, note: string) => void;
  onCancel: (reason: string) => void;
  onDelete?: (id: string) => void; // Optional delete action
}

export default function ReferralSystemDetail({ referral, onBack, onAccept, onCancel }: ReferralSystemDetailProps) {
  const [mode, setMode] = useState<'view' | 'accept' | 'cancel'>('view');
  
  // Accept Form State
  const [acceptDate, setAcceptDate] = useState<Date | undefined>(new Date());
  const [acceptNote, setAcceptNote] = useState("");
  
  // Cancel Form State
  const [cancelReason, setCancelReason] = useState("");

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);

  // --- Calendar Helpers ---
  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  const THAI_MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

  const formatMonthYear = (date: Date) => {
    const year = date.getFullYear() + 543;
    return `${THAI_MONTHS_FULL[date.getMonth()]} ${year}`;
  };
  
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDaysInMonth = (date: Date) => {
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = new Date(firstOfMonth);
    const dow = startDay.getDay();
    startDay.setDate(startDay.getDate() - (dow === 0 ? 6 : dow - 1));
    const endDay = new Date(lastOfMonth);
    const edow = endDay.getDay();
    if (edow !== 0) endDay.setDate(endDay.getDate() + (7 - edow));
    const days: Date[] = [];
    const current = new Date(startDay);
    while (current <= endDay) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const isSameMonthNative = (d1: Date, d2: Date) =>
    d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  // Format log date to Thai short
  const formatThaiLogDate = (dateStr: string): string => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const datePart = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
      const timePart = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${datePart} ${timePart}`;
    } catch { return dateStr; }
  };
  
  // --- Actions ---

  const handleConfirmAccept = () => {
    if (!acceptDate) {
        toast.error("กรุณาระบุวันที่นัดหมาย");
        return;
    }
    onAccept(acceptDate, acceptNote);
    setMode('view');
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
        toast.error("กรุณาระบุเหตุผล");
        return;
    }
    onCancel(cancelReason);
    setMode('view');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case 'Accepted': return "bg-green-50 text-green-700 border-green-200";
      case 'Rejected': return "bg-red-50 text-red-700 border-red-200";
      case 'Completed': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'Canceled': return "bg-gray-50 text-gray-500 border-gray-200";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Emergency': return "text-red-600 font-bold flex items-center gap-1";
      case 'Urgent': return "text-orange-500 font-semibold flex items-center gap-1";
      default: return "text-gray-600 flex items-center gap-1";
    }
  };

  // --- Render ---

  if (mode === 'accept') {
    return (
        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
           <Card className="border-none shadow-lg overflow-hidden">
             <CardHeader className="bg-[rgb(0,166,62)] text-white p-6">
                <CardTitle className="text-xl flex items-center gap-2">
                   <FileCheck className="w-6 h-6 text-white" /> ตอบรับการส่งตัว (Accept Referral)
                </CardTitle>
                <CardDescription className="text-[#e0e0fc]">
                   ยืนยันการรับผู้ป่วยและกำหนดวันนัดหมายสำหรับ {referral.patientName}
                </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6 pt-8 px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <Label className="text-base">วันที่นัดหมาย (Appointment Date) <span className="text-red-500">*</span></Label>
                      <div className="border rounded-lg bg-gray-50/30 overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
                             <button onClick={() => changeMonth(-1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" disabled={!isCalendarOpen}>
                                <ChevronLeft size={18} />
                              </button>
                              
                              <h3 className="font-semibold text-lg text-slate-800">
                                {formatMonthYear(currentMonth)}
                              </h3>

                              <button onClick={() => changeMonth(1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" disabled={!isCalendarOpen}>
                                <ChevronRight size={18} />
                              </button>
                        </div>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-white ${isCalendarOpen ? 'max-h-screen p-4' : 'max-h-0 p-0'}`}>
                          <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500 mb-2">
                            {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map(day => (
                              <div key={day} className="py-2">{day}</div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => {
                              const dateString = formatDate(day);
                              const isSelected = acceptDate && dateString === formatDate(acceptDate);
                              const isToday = dateString === formatDate(today);
                              const isCurrentMonth = isSameMonthNative(day, currentMonth);

                              return (
                                <button
                                  key={index}
                                  onClick={() => setAcceptDate(day)}
                                  disabled={!isCurrentMonth}
                                  className={`aspect-square w-full p-1 rounded-lg flex flex-col items-center justify-center transition-colors 
                                    ${!isCurrentMonth ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-primary/5'}
                                    ${isSelected ? 'bg-[#00A63E] text-white shadow-md' : 'bg-white text-slate-800'}
                                    ${isToday && !isSelected ? 'border-2 border-orange-500 bg-orange-50' : ''}
                                  `}
                                >
                                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : (isToday ? 'text-orange-700' : 'text-slate-800')}`}>
                                    {day.getDate()}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <Label className="text-base">หมายเหตุเพิ่มเติม (Note)</Label>
                         <Textarea 
                            placeholder="ระบุข้อความถึงต้นทาง เช่น ให้งดน้ำงดอาหารมาด้วย..." 
                            value={acceptNote}
                            onChange={(e) => setAcceptNote(e.target.value)}
                            className="min-h-[200px] resize-none text-base"
                         />
                      </div>
                      <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-sm flex gap-3 items-start">
                         <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                         <div>
                            <span className="font-semibold block mb-1">คำแนะนำ</span>
                            กรุณาตรวจสอบตารางนัดหมายของแพทย์ให้เรียบร้อยก่อนยืนยันการตอบรับ เมื่อยืนยันแล้วระบบจะแจ้งเตือนไปยังโรงพยาบาลต้นทางทันที
                         </div>
                      </div>
                   </div>
                </div>
             </CardContent>
             <CardFooter className="flex justify-between border-t bg-gray-50/50 p-6">
                <Button variant="outline" onClick={() => setMode('view')} className="h-11 px-6">
                   <ArrowLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                </Button>
                <div className="flex gap-3">
                   <Button variant="ghost" onClick={() => setMode('view')} className="text-gray-500">
                      ยกเลิก
                   </Button>
                   <Button onClick={handleConfirmAccept} className="bg-green-600 hover:bg-green-700 text-white h-11 px-8 shadow-md">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> ยืนยันการตอบรับ
                   </Button>
                </div>
             </CardFooter>
           </Card>
        </div>
    );
  }

  if (mode === 'cancel') {
    return (
        <div className="w-full animate-in fade-in zoom-in-95 duration-300">
           <Card className="border-none shadow-lg overflow-hidden">
             <CardHeader className="bg-red-600 text-white p-6">
                <CardTitle className="text-xl flex items-center gap-2">
                   <AlertTriangle className="w-6 h-6 text-white" /> ปฏิเสธ/ยกเลิกการส่งตัว (Reject/Cancel)
                </CardTitle>
                <CardDescription className="text-red-100">
                   กรุณาระบุเหตุผลในการปฏิเสธหรือยกเลิกคำขอส่งตัวนี้ เพื่อแจ้งให้ต้นทางทราบ
                </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6 pt-8 px-8">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <Label className="text-base">เหตุผล (Reason) <span className="text-red-500">*</span></Label>
                      <Textarea 
                         placeholder="ระบุเหตุผลการปฏิเสธ หรือข้อมูลเพิ่มเติม..." 
                         value={cancelReason}
                         onChange={(e) => setCancelReason(e.target.value)}
                         className="min-h-[200px] resize-none text-base"
                      />
                   </div>
                   <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm flex gap-3 items-start">
                      <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                         <span className="font-semibold block mb-1">คำเตือน</span>
                         การปฏิเสธหรือยกเลิกคำขอส่งตัวจะไม่สามารถเรียกคืนสถานะเดิมได้ กรุณาตรวจสอบความถูกต้องก่อนยืนยัน
                      </div>
                   </div>
                </div>
             </CardContent>
             <CardFooter className="flex justify-between border-t bg-gray-50/50 p-6">
                <Button variant="outline" onClick={() => setMode('view')} className="h-11 px-6">
                   <ArrowLeft className="w-4 h-4 mr-2" /> ย้อนกลับ
                </Button>
                <div className="flex gap-3">
                   <Button variant="ghost" onClick={() => setMode('view')} className="text-gray-500">
                      ยกเลิก
                   </Button>
                   <Button onClick={handleConfirmCancel} variant="destructive" className="h-11 px-8 shadow-md bg-red-600 hover:bg-red-700">
                      <XCircle className="w-4 h-4 mr-2" /> ยืนยันการปฏิเสธ
                   </Button>
                </div>
             </CardFooter>
           </Card>
        </div>
    );
  }

  return (
    <div className="w-full animate-in slide-in-from-right-4 duration-500 pb-20">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900" onClick={onBack}>
                  <ArrowLeft size={20} />
                </Button>
                <div>
                   <div className="flex items-center gap-2">
                     <h1 className="text-xl font-bold text-[#5e5873]">รายละเอียดคำขอ {referral.referralNo}</h1>
                     <Badge variant="outline" className={cn("font-normal", getStatusColor(referral.status))}>
                        {STATUS_LABELS[referral.status]}
                     </Badge>
                   </div>
                   <p className="text-sm text-gray-500 mt-1">ข้อมูลรายละเอียดและเอกสารประกอบการขอทุน</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
               {referral.status === 'Pending' && referral.type === 'Refer In' && (
                  <>
                     <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { setMode('accept'); setAcceptDate(new Date()); setAcceptNote(""); }}>
                        ตอบรับ (Accept)
                     </Button>
                     <Button className="bg-white border-red-200 text-red-600 hover:bg-red-50 border" onClick={() => { setMode('cancel'); setCancelReason(""); }}>
                        ปฏิเสธ (Reject)
                     </Button>
                  </>
               )}
               {referral.status === 'Pending' && referral.type === 'Refer Out' && (
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300" onClick={() => { setMode('cancel'); setCancelReason(""); }}>
                     ยกเลิกคำขอ (Cancel)
                  </Button>
               )}
               <Button variant="secondary" className="gap-2">
                  <Printer size={16} /> พิมพ์ใบส่งตัว
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="bg-[#f8f8f8] border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-[#5e5873] flex items-center gap-2">
                        <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                      </CardTitle>
                      <CardDescription>HN: {referral.patientHn}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-[#7367f0] bg-[#7367f0]/10 border-none">
                      {referral.referralNo}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div>
                        <Label className="text-gray-500 text-xs uppercase">ชื่อ-นามสกุล</Label>
                        <div className="font-medium text-base mt-1">{referral.patientName}</div>
                      </div>
                      <div>
                        <Label className="text-gray-500 text-xs uppercase">อายุ / เพศ</Label>
                        <div className="font-medium text-base mt-1">8 ปี / ชาย</div>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-gray-500 text-xs uppercase">การวินิจฉัย (Diagnosis)</Label>
                        <div className="font-medium text-base mt-1 p-3 bg-gray-50 rounded-md text-gray-700">
                           {referral.diagnosis}
                        </div>
                      </div>
                   </div>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="text-lg font-bold text-[#5e5873] flex items-center gap-2">
                       <Ambulance className="w-5 h-5 text-[#7367f0]" /> ข้อมูลการส่งต่อ
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-[#f0f2f5] p-4 rounded-lg">
                       <div className="flex-1 text-center md:text-left">
                          <span className="text-xs text-gray-500 block mb-1">ต้นทาง</span>
                          <span className="font-semibold text-[#5e5873]">{referral.sourceHospital}</span>
                       </div>
                       <ArrowRight className="text-gray-400 hidden md:block" />
                       <ArrowDown className="text-gray-400 md:hidden" />
                       <div className="flex-1 text-center md:text-right">
                          <span className="text-xs text-gray-500 block mb-1">ปลายทาง</span>
                          <span className="font-semibold text-[#7367f0] text-lg">{referral.destinationHospital}</span>
                       </div>
                    </div>

                    <div>
                        <Label className="text-gray-500 text-xs uppercase block mb-2">เหตุผลการส่งตัว</Label>
                        <p className="text-gray-700 leading-relaxed bg-white border border-gray-100 p-4 rounded-md shadow-sm">
                           {referral.reason}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <Label className="text-gray-500 text-xs uppercase block mb-1">ความเร่งด่วน</Label>
                          <div className={getUrgencyColor(referral.urgency)}>
                             <AlertTriangle size={16} /> {referral.urgency}
                          </div>
                       </div>
                       <div>
                          <Label className="text-gray-500 text-xs uppercase block mb-1">ผู้ติดต่อปลายทาง</Label>
                          <div className="text-gray-700 font-medium">
                             {referral.destinationContact || "-"}
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
               <Card>
                 <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="text-base font-bold text-[#5e5873] flex items-center gap-2">
                       <History className="w-4 h-4" /> Timeline
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-4">
                    <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                       {referral.logs.map((log, index) => (
                         <div key={index} className="relative">
                            <div className={cn(
                               "absolute -left-[21px] top-0 h-3 w-3 rounded-full border-2 border-white",
                               log.status === 'Created' ? "bg-blue-500" :
                               log.status === 'Sent' ? "bg-yellow-500" :
                               log.status === 'Viewed' ? "bg-purple-500" :
                               log.status === 'Accepted' ? "bg-green-500" :
                               log.status === 'Rejected' ? "bg-red-500" : "bg-gray-400"
                            )}></div>
                            <div className="text-xs text-gray-400 mb-1">{formatThaiLogDate(log.date)}</div>
                            <div className="font-semibold text-sm text-gray-800">{log.status}</div>
                            <div className="text-xs text-gray-600 mt-1">{log.description}</div>
                            <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                               <User size={10} /> {log.actor}
                            </div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
               </Card>

               <Card>
                 <CardHeader className="pb-3 border-b border-gray-100">
                    <CardTitle className="text-base font-bold text-[#5e5873] flex items-center gap-2">
                       <Paperclip className="w-4 h-4" /> เอกสารแนบ
                    </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-4">
                    {referral.documents.length > 0 ? (
                       <ul className="space-y-2">
                          {referral.documents.map((doc, idx) => (
                             <li key={idx} className="flex items-center gap-2 text-sm text-[#7367f0] hover:underline cursor-pointer p-2 hover:bg-gray-50 rounded">
                                <FileText size={16} /> {doc}
                             </li>
                          ))}
                       </ul>
                    ) : (
                       <div className="text-sm text-gray-400 text-center py-4">ไม่มีเอกสารแนบ</div>
                    )}
                 </CardContent>
               </Card>
            </div>
         </div>
      </div>
  );
}