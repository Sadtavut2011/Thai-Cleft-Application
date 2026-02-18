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
  Building2,
  Send,
  ChevronRight,
  ChevronLeft,
  Phone,
  Shield,
  ClipboardList
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { getPatientByHn } from "../../../../../data/patientData";

// Helper: Format ISO date to Thai short date (synced with history pattern)
const formatThaiShortDate = (raw: string | undefined): string => {
    if (!raw || raw === '-') return '-';
    // Already Thai formatted
    if (/[ก-๙]/.test(raw)) return raw;
    try {
        const safeRaw = raw.match(/^\d{4}-\d{2}-\d{2}$/) ? raw + 'T00:00:00' : raw;
        const d = new Date(safeRaw);
        if (isNaN(d.getTime())) return raw;
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    } catch {
        return raw;
    }
};

// InfoItem with optional icon support (same pattern as other detail pages)
const InfoItem = ({ label, value, icon: Icon }: { label: string, value?: React.ReactNode, icon?: any }) => (
    <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
            {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
            <span>{value || '-'}</span>
        </div>
    </div>
);

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
  patientId?: string;
  patientName: string;
  patientHn: string;
  patientImage?: string;
  patientDob?: string;
  patientGender?: string;
  patientPhone?: string;
  insuranceType?: string;
  referralDate: string;
  lastUpdateDate?: string;
  type: 'Refer Out' | 'Refer In';
  sourceHospital?: string;
  hospital?: string;
  destinationHospital: string;
  reason: string;
  diagnosis?: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency' | string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Examined' | 'Completed' | 'Canceled' | string;
  documents: string[];
  logs: ReferralLog[];
  destinationContact?: string;
}

const STATUS_LABELS: Record<string, string> = {
  'Pending': 'รอการตอบรับ',
  'Accepted': 'รอรับตัว',
  'Rejected': 'ปฏิเสธ',
  'Examined': 'ตรวจแล้ว',
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
  onDelete?: (id: string) => void;
}

export default function ReferralSystemDetail({ referral, onBack, onAccept, onCancel, onDelete }: ReferralSystemDetailProps) {
  const [mode, setMode] = useState<'view' | 'accept' | 'cancel'>('view');
  
  // Accept Form State
  const [acceptDate, setAcceptDate] = useState<Date | undefined>(new Date());
  const [acceptNote, setAcceptNote] = useState("");
  
  // Cancel Form State
  const [cancelReason, setCancelReason] = useState("");

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);

  // --- Computed Patient Data (Single Source from PATIENTS_DATA) ---
  const sourceHospitalName = referral.sourceHospital || referral.hospital || '-';
  
  // Lookup patient from PATIENTS_DATA as single source of truth
  const patientRecord = getPatientByHn(referral.patientHn);
  
  const resolvedDob = patientRecord?.dob || referral.patientDob;
  const resolvedGender = patientRecord?.gender || referral.patientGender;
  const resolvedDiagnosis = patientRecord?.diagnosis || referral.diagnosis || '-';
  const resolvedImage = patientRecord?.image || referral.patientImage;

  const patientAge = (() => {
    if (!resolvedDob) return null;
    const dob = new Date(resolvedDob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  })();

  const patientAgeGenderText = [
    patientAge !== null ? `${patientAge} ปี` : null,
    resolvedGender || null
  ].filter(Boolean).join(' / ') || '-';

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
    // Start of week (Monday) for first day of month
    const startDay = new Date(firstOfMonth);
    const dow = startDay.getDay();
    startDay.setDate(startDay.getDate() - (dow === 0 ? 6 : dow - 1));
    // End of week (Sunday) for last day of month
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
  
  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  // Mock appointments count logic
  const appointmentsPerDay = new Map<string, number>();
  days.forEach(d => {
      if (d.getDay() !== 0 && d.getDay() !== 6 && Math.random() > 0.7) {
         appointmentsPerDay.set(formatDate(d), Math.floor(Math.random() * 5) + 1);
      }
  });

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
      case 'Pending': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'Accepted': return "bg-orange-50 text-orange-700 border-orange-200";
      case 'Rejected': return "bg-red-50 text-red-700 border-red-200";
      case 'Completed': return "bg-green-50 text-green-700 border-green-200";
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
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20 font-['IBM_Plex_Sans_Thai'] space-y-6">
      {/* Header Banner — matching FundRequestDetailPage */}
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
              <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
              <h1 className="text-[#5e5873] font-bold text-lg">
                  รายละเอียดส่งตัวผู้ป่วย {referral.referralNo}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                  ข้อมูลรายละเอียดและเอกสารประกอบการส่งตัวผู้ป่วย
              </p>
          </div>
          <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
          </Button>
      </div>

      {/* Green Appointment Date Banner (matching Mobile ReferralDetail) */}
      {['Accepted', 'Completed'].includes(referral.status) && (referral as any).acceptedDate && (() => {
          try {
              const d = new Date((referral as any).acceptedDate);
              if (isNaN(d.getTime())) return null;
              const datePart = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
              const timePart = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
              return (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white p-2.5 rounded-full shadow-sm border border-emerald-100">
                        <CalendarIcon className="text-emerald-600 w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-sm text-emerald-600 font-semibold block mb-0.5">วันนัดหมายส่งตัว</span>
                        <span className="text-emerald-900 font-bold text-lg">{datePart}</span>
                        <span className="text-emerald-700 text-sm ml-2">{timePart} น.</span>
                    </div>
                </div>
              );
          } catch { return null; }
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            {/* Patient Info Card */}
            <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-gray-50">
                    <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor(referral.status)}`}>
                            {STATUS_LABELS[referral.status] || referral.status}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-5">
                        <div className="w-[72px] h-[72px] bg-gray-100 rounded-full shrink-0 overflow-hidden border-2 border-white shadow">
                            {resolvedImage ? (
                                <img 
                                    src={resolvedImage}
                                    alt={referral.patientName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-9 h-9 text-slate-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-xl truncate">{referral.patientName}</h3>
                            <p className="text-sm text-slate-500">HN: {referral.patientHn}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                <Phone className="w-4 h-4" /> ติดต่อ
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                <ClipboardList className="w-4 h-4" /> ดูประวัติ
                            </Button>
                        </div>
                    </div>

                    {/* Info strip: อายุ/เพศ + ผลการวินิจฉัย */}
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

            {/* Referral Detail Card */}
            <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#ff6d00]/10 p-2 rounded-lg text-[#ff6d00]">
                                <Send size={24} />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-[#5e5873]">ใบส่งตัว (Referral Letter)</CardTitle>
                                <p className="text-sm text-gray-500">เลขที่: {referral.referralNo || '-'}</p>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">

                    {/* Date Section */}
                    <InfoItem label="วันที่สร้างคำขอ" value={formatThaiShortDate(referral.referralDate)} icon={CalendarIcon} />

                    {/* Route Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                <Send size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-[#5e5873]">เส้นทางส่งตัว</h3>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                    <Building2 size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">ต้นทาง</p>
                                    <p className="font-semibold text-gray-700">
                                        {sourceHospitalName}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex-1 w-full md:px-4 flex items-center justify-center">
                                <div className="h-[2px] w-full bg-gray-300 relative">
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-gray-400">
                                        <Send size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">ปลายทาง</p>
                                    <p className="font-semibold text-[#7367f0]">{referral.destinationHospital}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#7367f0] flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <Building2 size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor & Urgency */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem label="แพทย์เจ้าของไข้" value={referral.destinationContact || patientRecord?.doctor || '-'} icon={User} />
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-gray-500">ความเร่งด่วน</p>
                            <div className={cn(
                                "p-3 rounded-lg border min-h-[48px] flex items-center gap-2",
                                referral.urgency === 'Emergency' ? 'bg-red-50 border-red-100' :
                                referral.urgency === 'Urgent' ? 'bg-orange-50 border-orange-100' :
                                'bg-gray-50 border-gray-100'
                            )}>
                                <AlertTriangle size={16} className={cn(
                                    "shrink-0",
                                    referral.urgency === 'Emergency' ? 'text-red-500' :
                                    referral.urgency === 'Urgent' ? 'text-orange-500' :
                                    'text-gray-400'
                                )} />
                                <span className={cn(
                                    "font-medium",
                                    referral.urgency === 'Emergency' ? 'text-red-600' :
                                    referral.urgency === 'Urgent' ? 'text-orange-500' :
                                    'text-gray-700'
                                )}>
                                    {referral.urgency === 'Emergency' ? 'ฉุกเฉิน' :
                                     referral.urgency === 'Urgent' ? 'เร่งด่วน' :
                                     'ปกติ (Routine)'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Referral Info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                <FileText size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-[#5e5873]">ข้อมูลการส่งต่อ</h3>
                        </div>
                        
                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-gray-500">เรื่อง / การวินิจฉัย</p>
                            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 min-h-[48px] flex items-center text-gray-800 font-medium">
                                {resolvedDiagnosis}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-sm font-medium text-gray-500">เหตุผลการส่งตัว</p>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {referral.reason || '-'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* เอกสารแนบ */}
            <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="pb-3 border-b border-gray-50">
                    <CardTitle className="text-lg text-[#5e5873] flex items-center gap-2">
                        <Paperclip className="w-5 h-5 text-[#7367f0]" /> เอกสารแนบ
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    {referral.documents.length > 0 ? (
                        <ul className="space-y-2">
                            {referral.documents.map((doc, idx) => (
                                <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                                    <FileText size={16} className="text-[#7367f0] shrink-0" />
                                    <span className="text-sm text-slate-700 font-medium">{doc}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-slate-400 text-center py-4">ไม่มีเอกสารแนบ</div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Actions + Tracking */}
        <div className="space-y-6">
            {/* การดำเนินการ — matching Mobile ReferralDetail logic */}
            {(referral.status === 'Pending' || referral.status === 'Accepted') && (
              <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="pb-3 border-b border-gray-50">
                      <CardTitle className="text-lg text-[#5e5873]">การดำเนินการ</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                      {referral.status === 'Pending' && referral.type === 'Refer In' && (
                        <div className="space-y-4">
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm h-11"
                            onClick={() => setMode('accept')}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> ตอบรับการส่งตัว
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full text-red-600 hover:bg-red-50 border-red-200 h-11"
                            onClick={() => setMode('cancel')}
                          >
                            <XCircle className="w-4 h-4 mr-2" /> ปฏิเสธการส่งตัว
                          </Button>
                        </div>
                      )}
                      {referral.status === 'Pending' && referral.type === 'Refer Out' && (
                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            className="w-full h-10 border-gray-200 text-gray-600 hover:text-[#7367f0] hover:bg-slate-50"
                          >
                            <Edit className="w-4 h-4 mr-2" /> แก้ไขคำขอส่งตัว
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full text-red-600 hover:bg-red-50 border-red-200 h-11"
                            onClick={() => {
                              if (onDelete) {
                                onDelete(referral.id);
                              } else {
                                onCancel('ผู้สร้างยกเลิกคำขอ');
                              }
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" /> ยกเลิกคำขอส่งตัว
                          </Button>
                        </div>
                      )}
                      {referral.status === 'Accepted' && referral.type === 'Refer In' && (
                        <Button className="w-full bg-[#7367f0] hover:bg-[#685dd8] text-white shadow-sm h-11">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> บันทึกผลการตรวจ
                        </Button>
                      )}
                      {referral.status === 'Accepted' && referral.type === 'Refer Out' && (
                        <div className="text-center text-sm text-slate-500 py-3 bg-slate-50 rounded-lg border border-slate-100">
                          <Clock className="w-5 h-5 mx-auto mb-1.5 text-orange-400" />
                          รอโรงพยาบาลปลายทางดำเนินการ
                        </div>
                      )}
                  </CardContent>
              </Card>
            )}

            {/* สถานะการติดตาม — matching TeleConsultation pattern */}
            <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-3 border-b border-gray-50">
                    <CardTitle className="text-lg text-[#5e5873]">สถานะการติดตาม</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                        {referral.logs.map((log, index) => {
                            const dotColor =
                                log.status === 'Rejected' || log.status === 'Canceled' ? 'bg-red-500' :
                                'bg-green-500';

                            return (
                                <div key={index} className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        dotColor
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#5e5873]">{log.description || STATUS_LABELS[log.status] || log.status}</span>
                                        <span className="text-sm text-gray-400">{formatThaiShortDate(log.date)}</span>
                                        {log.actor && log.actor !== '-' && (
                                            <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <User size={10} /> {log.actor}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}