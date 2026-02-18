import React from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  MapPin, 
  Clock,
  CalendarPlus,
  StickyNote,
  Stethoscope,
  Home,
  CheckCircle2,
  AlertCircle,
  Printer,
  ClockArrowUp,
  History
} from 'lucide-react';
import { StatusBarIPhone16Main } from "../../../../../../components/shared/layout/TopHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { cn } from "../../../../../../components/ui/utils";
import { getPatientByHn } from "../../../../../../data/patientData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../../components/ui/alert-dialog";
import { toast } from "sonner@2.0.3";

interface AppointmentDetailProps {
  appointment: any;
  patient: any;
  onBack: () => void;
  hideHeader?: boolean;
  onCancel?: () => void;
  onReschedule?: () => void;
  /** Role: 'cm' (default) or 'scfc' */
  role?: 'cm' | 'scfc';
  /** SCFC callback: confirm appointment */
  onConfirm?: () => void;
  /** SCFC callback: coordinate/contact */
  onCoordinate?: () => void;
  /** SCFC callback: view patient history */
  onViewHistory?: () => void;
}

export const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ 
  appointment, 
  patient, 
  onBack, 
  hideHeader = false,
  onCancel,
  onReschedule,
  role = 'cm',
  onConfirm,
  onCoordinate,
  onViewHistory,
}) => {
  if (!appointment) return null;

  // Function to format date safely
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    // Try to parse YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]) + 543;
      const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
      ];
      const month = monthNames[parseInt(parts[1]) - 1];
      const day = parseInt(parts[2]);
      return `${day} ${month} ${year}`;
    }
    return dateStr;
  };

  // Short Thai date format for banner (e.g. "4 ธ.ค. 68")
  const formatShortThaiDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
        }
      }
      // If already contains Thai characters, return as-is
      if (/[ก-๙]/.test(dateStr)) return dateStr;
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
      }
    } catch {}
    return dateStr;
  };

  const getStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'waiting') return { color: 'bg-orange-100 text-orange-700', text: 'รอตรวจ', icon: <AlertCircle size={14} />, key: 'waiting' };
    if (['confirmed', 'checked-in', 'accepted'].includes(s)) return { color: 'bg-blue-100 text-blue-700', text: 'ยืนยันแล้ว', icon: <CheckCircle2 size={14} />, key: 'confirmed' };
    if (['cancelled', 'missed', 'rejected'].includes(s)) return { color: 'bg-red-100 text-red-700', text: 'ยกเลิก', icon: <AlertCircle size={14} />, key: 'cancelled' };
    return { color: 'bg-green-100 text-green-700', text: 'เสร็จสิ้น', icon: <CheckCircle2 size={14} />, key: 'completed' };
  };

  const statusConfig = getStatusConfig(appointment.status || appointment.apptStatus);

  // Determine if the appointment date banner should be shown
  // Show for: waiting (scheduled), confirmed/accepted (confirmed), completed (done)
  // Don't show for: cancelled/missed/rejected (no longer active)
  const showDateBanner = statusConfig.key !== 'cancelled';

  // Look up patient record from PATIENTS_DATA for age/gender/diagnosis
  const patientRecord = patient?.hn ? getPatientByHn(patient.hn) : undefined;
  const _patientDob = patientRecord?.dob;
  const _patientGender = patientRecord?.gender;
  const _patientDiagnosis = patientRecord?.diagnosis || '-';
  const _patientAge = (() => {
    if (!_patientDob) return null;
    const dob = new Date(_patientDob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const md = today.getMonth() - dob.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  })();
  const _patientAgeGenderText = [
    _patientAge !== null ? `${_patientAge} ปี` : null,
    _patientGender || null
  ].filter(Boolean).join(' / ') || '-';

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 fixed inset-0 z-[50000] overflow-hidden">
      
      {/* CSS Hack to hide mobile bottom navigation */}
      <style>{`
        .fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
            display: none !important;
        }
      `}</style>

      {/* Header */}
      {!hideHeader && (
      <div className="bg-[#7066a9] shrink-0 z-20 shadow-md">
        <StatusBarIPhone16Main />
        <div className="h-[64px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดนัดหมาย</h1>
          </div>
          <div className="flex items-center gap-1">
            {role === 'scfc' && onViewHistory && (
              <button onClick={onViewHistory} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors" title="ดูประวัติผู้ป่วย">
                <History size={22} />
              </button>
            )}
            <button className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
              <Printer size={24} />
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto p-4 pb-24 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* Blue Appointment Date Banner (Similar to VisitDetail green box) */}
        {showDateBanner && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="bg-white p-2.5 rounded-full shadow-sm border border-blue-100">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <span className="text-sm text-blue-600 font-semibold block mb-0.5 text-[16px]">วันนัดหมาย</span>
              <span className="text-blue-900 font-bold text-lg font-['IBM_Plex_Sans_Thai']">
                {formatShortThaiDate(appointment.date)}
              </span>
              {appointment.time && (
                <span className="text-blue-700 text-sm ml-2 text-[18px]">
                  {appointment.time.length > 5 ? appointment.time : `${appointment.time} น.`}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Patient Info Summary */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4">
                <img 
                    src={patient?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                    alt={patient?.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-50 shadow-sm bg-slate-100"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-base truncate text-[18px]">{patient?.name || 'ไม่ระบุชื่อ'}</h3>
                    <p className="text-sm text-slate-500">HN: {patient?.hn || '-'}</p>
                </div>
                <div className="shrink-0">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${statusConfig.color}`}>
                        
                        {statusConfig.text}
                    </span>
                </div>
            </div>
            {/* Age/Gender & Diagnosis info strip */}
            <div className="grid grid-cols-2 bg-slate-50 border-t border-slate-100">
                <div className="px-4 py-2.5 border-r border-slate-100">
                    <p className="text-xs text-slate-400">อายุ / เพศ</p>
                    <p className="text-sm text-slate-800 font-semibold">{_patientAgeGenderText}</p>
                </div>
                <div className="px-4 py-2.5">
                    <p className="text-xs text-slate-400">ผลการวินิจฉัย</p>
                    <p className="text-sm text-slate-800 font-semibold">{_patientDiagnosis}</p>
                </div>
            </div>
        </div>

        {/* Appointment Details Card (Unified - matching VisitDetail pattern) */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
            {/* วันที่สร้างคำขอ */}
            <div className="flex items-center gap-3 text-slate-700">
                <Calendar className="text-[#7066a9]" size={20} />
                <div>
                    <span className="text-sm text-slate-400 block text-[16px]">วันที่สร้างคำขอ</span>
                    <span className="font-semibold text-[18px]">
                        {formatShortThaiDate(appointment.requestDate || appointment.createdDate || '')}
                    </span>
                </div>
            </div>
            
            <div className="w-full h-[1px] bg-slate-100"></div>

            <div className="flex flex-col gap-4">
                {/* โรงพยาบาล */}
                <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-sm text-slate-400 text-[16px]">โรงพยาบาล</span>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-400 shrink-0" />
                        <span className="font-semibold text-sm truncate text-[18px] text-[#5e5873]">
                            {appointment.location || appointment.hospital || '-'}
                        </span>
                    </div>
                </div>

                {/* ห้องตรวจ */}
                <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-sm text-slate-400 text-[16px]">ห้องตรวจ</span>
                    <div className="flex items-center gap-2">
                        <Home size={16} className="text-slate-400 shrink-0" />
                        <span className="font-semibold text-sm truncate text-[18px] text-[#5e5873]">
                            {appointment.room || appointment.roomName || (appointment.raw && appointment.raw.room) || '-'}
                        </span>
                    </div>
                </div>

                {/* การรักษา / หัวข้อนัดหมาย */}
                <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-sm text-slate-400 text-[16px]">การรักษา / หัวข้อนัดหมาย</span>
                    <div className="flex items-center gap-2">
                        <Stethoscope size={16} className="text-[#7367f0] shrink-0" />
                        <span className="font-semibold text-sm truncate text-[18px] text-[#7367f0]">
                            {appointment.title || appointment.type || appointment.treatment || '-'}
                        </span>
                    </div>
                </div>

                {/* ชื่อผู้ที่รักษา */}
                <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-sm text-slate-400 text-[16px]">ชื่อผู้ที่รักษา</span>
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400 shrink-0" />
                        <span className="font-semibold text-sm truncate text-[18px] text-[#5e5873]">
                            {appointment.doctor || '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* รายละเอียด / หมายเหตุ */}
            {(appointment.note || appointment.reason) && (
                <>
                    <div className="w-full h-[1px] bg-slate-100"></div>
                    <div className="mt-1 bg-[#f8f9fa] p-3 rounded-xl border border-dashed border-gray-200">
                        <span className="text-sm font-semibold text-gray-500 block mb-1 text-[16px]">รายละเอียดการนัดหมาย</span>
                        <p className="text-sm text-[#5e5873] text-[18px]">{appointment.note || appointment.reason}</p>
                    </div>
                </>
            )}
        </div>

         {/* 5. Recorder */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <User className="text-slate-400" size={16} />
                    <span className="text-sm text-slate-500 font-medium text-[16px]">ผู้บันทึกข้อมูล</span>
                 </div>
                 <span className="text-sm text-slate-700 font-medium text-[16px]">
                     {appointment.recorder || 'สภัคศิริ สุวิวัฒนา'}
                 </span>
             </div>
        </div>

        {/* Tracking Status Timeline (matching web AppointmentDetailPage) */}
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
                            <span className="text-sm font-bold text-[#5e5873] text-[16px]">สร้างนัดหมาย</span>
                            <span className="text-sm text-gray-400">{formatShortThaiDate(appointment.requestDate || appointment.createdDate || '')}</span>
                        </div>
                    </div>

                    {/* Step 2: Confirmed */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            statusConfig.key === 'confirmed' || statusConfig.key === 'completed' ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[16px] font-bold",
                                statusConfig.key === 'confirmed' || statusConfig.key === 'completed' ? "text-[#5e5873]" : "text-gray-400"
                            )}>ยืนยันนัดหมาย</span>
                            <span className="text-sm text-gray-400">-</span>
                        </div>
                    </div>

                    {/* Step 3: Completed */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            statusConfig.key === 'completed' ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[16px] font-bold",
                                statusConfig.key === 'completed' ? "text-[#5e5873]" : "text-gray-400"
                            )}>ตรวจเสร็จสิ้น</span>
                            <span className="text-sm text-gray-400">-</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>

      {/* Footer Actions — CM role */}
      {role === 'cm' && (appointment.status || appointment.apptStatus || '').toLowerCase() === 'waiting' && (
      <div className="shrink-0 p-4 border-t border-slate-200 bg-white pb-8 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3">
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <button 
                          className="flex-1 h-12 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-base hover:bg-red-100 transition-colors"
                      >
                          ยกเลิกนัดหมาย
                      </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl max-w-[340px] w-[90%] gap-6">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold text-xl text-center text-slate-800">ยืนยันการยกเลิก</AlertDialogTitle>
                      <AlertDialogDescription className="text-center text-slate-500 text-base">
                        คุณต้องการลบนัดหมายนี้ใช่หรือไม่?<br/>
                        การดำเนินการนี้ไม่สามารถเรียกคืนได้
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row gap-3 w-full sm:justify-center">
                      <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-700 m-0 text-base">กลับ</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={onCancel}
                        className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold m-0 text-base border-none shadow-md shadow-red-100"
                      >
                        ยืนยันลบ
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
              {onReschedule && (
              <button 
                  onClick={onReschedule}
                  className="flex-1 h-12 rounded-xl bg-[#7066a9] text-white font-bold text-base hover:bg-[#5f5690] shadow-md shadow-indigo-200 transition-colors"
              >
                  เลื่อนนัดหมาย
              </button>
              )}
          </div>
      </div>
      )}

      {/* Footer Actions — SCFC role: ยกเลิก / เลื่อนนัดหมาย */}
      {role === 'scfc' && (
      <div className="shrink-0 p-4 border-t border-[#E3E0F0] bg-white pb-8 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3">
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <button 
                          className="flex-1 h-12 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-[16px] hover:bg-red-100 transition-colors"
                      >
                          ยกเลิกนัดหมาย
                      </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl max-w-[340px] w-[90%] gap-6">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold text-xl text-center text-slate-800">ยืนยันการยกเลิก</AlertDialogTitle>
                      <AlertDialogDescription className="text-center text-slate-500 text-base">
                        คุณต้องการยกเลิกนัดหมายนี้ใช่หรือไม่?<br/>
                        การดำเนินการนี้ไม่สามารถเรียกคืนได้
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row gap-3 w-full sm:justify-center">
                      <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-700 m-0 text-base">กลับ</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          onCancel?.();
                          toast.success('ยกเลิกนัดหมายเรียบร้อย');
                        }}
                        className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold m-0 text-base border-none shadow-md shadow-red-100"
                      >
                        ยืนยัน
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
              <button 
                  onClick={() => {
                    onReschedule?.();
                    toast.info('กำลังเลื่อนนัดหมาย...');
                  }}
                  className="flex-1 h-12 rounded-xl bg-[#49358E] text-white font-bold text-[16px] hover:bg-[#37286A] shadow-md shadow-[#49358E]/20 transition-colors flex items-center justify-center gap-2"
              >
                  <CalendarPlus size={18} />
                  เลื่อนนัดหมาย
              </button>
          </div>
      </div>
      )}
    </div>
  );
}