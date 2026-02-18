import React from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  Video, 
  Building2,
  Smartphone,
  Printer,
  Home,
  CalendarPlus,
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

interface TeleConsultDetailProps {
  consult: any;
  patient: any;
  onBack: () => void;
  /** Role: 'cm' (default) or 'scfc' */
  role?: 'cm' | 'scfc';
  /** SCFC callback: cancel tele-consult */
  onCancel?: () => void;
  /** SCFC callback: reschedule tele-consult */
  onReschedule?: () => void;
  /** SCFC callback: view patient history */
  onViewHistory?: () => void;
}

// Helper: format raw date to Thai short date
const formatThaiShortDate = (raw: string | undefined): string => {
  if (!raw) return '-';
  try {
    // Append T00:00:00 for date-only strings to avoid UTC timezone shift
    const safeRaw = raw.match(/^\d{4}-\d{2}-\d{2}$/) ? raw + 'T00:00:00' : raw;
    const d = new Date(safeRaw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch {
    return raw;
  }
};

// Helper: get status config for Tele-med
const getStatusConfig = (status: string) => {
  const s = (status || '').toLowerCase();
  if (['scheduled', 'waiting', 'pending'].includes(s)) {
    return { label: 'รอสาย', bg: 'bg-[#E0FBFC]', text: 'text-[#00A8BD]', headerBg: 'bg-pink-50', headerBorder: 'border-pink-100', headerIcon: 'text-[#e91e63]', headerText: 'text-[#e91e63]', headerDateText: 'text-pink-900', headerTimeText: 'text-pink-700' };
  }
  if (['completed'].includes(s)) {
    return { label: 'เสร็จสิ้น', bg: 'bg-[#E5F8ED]', text: 'text-[#28C76F]', headerBg: 'bg-pink-50', headerBorder: 'border-pink-100', headerIcon: 'text-[#e91e63]', headerText: 'text-[#e91e63]', headerDateText: 'text-pink-900', headerTimeText: 'text-pink-700' };
  }
  if (['cancelled', 'missed'].includes(s)) {
    return { label: 'ยกเลิก', bg: 'bg-[#FCEAEA]', text: 'text-[#EA5455]', headerBg: 'bg-pink-50', headerBorder: 'border-pink-100', headerIcon: 'text-[#e91e63]', headerText: 'text-[#e91e63]', headerDateText: 'text-pink-900', headerTimeText: 'text-pink-700' };
  }
  if (['inprogress', 'in_progress'].includes(s)) {
    return { label: 'ดำเนินการ', bg: 'bg-[#EEF2FF]', text: 'text-[#4F46E5]', headerBg: 'bg-pink-50', headerBorder: 'border-pink-100', headerIcon: 'text-[#e91e63]', headerText: 'text-[#e91e63]', headerDateText: 'text-pink-900', headerTimeText: 'text-pink-700' };
  }
  return { label: status || '-', bg: 'bg-gray-100', text: 'text-gray-600', headerBg: 'bg-pink-50', headerBorder: 'border-pink-100', headerIcon: 'text-[#e91e63]', headerText: 'text-[#e91e63]', headerDateText: 'text-pink-900', headerTimeText: 'text-pink-700' };
};

export const TeleConsultDetail: React.FC<TeleConsultDetailProps> = ({ consult, patient, onBack, role = 'cm', onCancel, onReschedule, onViewHistory }) => {
  // CSS Hack to hide sidebar when this component is mounted
  React.useEffect(() => {
      const style = document.createElement('style');
      style.innerHTML = `
          .fixed.bottom-0.left-0.w-full.bg-white.z-50 {
              display: none !important;
          }
      `;
      document.head.appendChild(style);
      
      return () => {
          document.head.removeChild(style);
      };
  }, []);

  if (!consult) return null;

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

  const statusConfig = getStatusConfig(consult?.status);

  // Determine display date: prefer rawDate, fallback to date
  const displayDate = (() => {
    if (consult.rawDate) {
      return formatThaiShortDate(consult.rawDate);
    }
    return consult.date || '-';
  })();

  // Determine display time
  const displayTime = (() => {
    if (consult.time) {
      return `${consult.time.substring(0, 5)} น.`;
    }
    // try to extract from rawDate
    if (consult.rawDate && consult.rawDate.includes('T')) {
      return `${consult.rawDate.split('T')[1]?.substring(0, 5)} น.`;
    }
    return '';
  })();

  // Request date
  const displayRequestDate = formatThaiShortDate(consult.requestDate || consult.createdDate || '');

  // Channel display
  const channelDisplay = (() => {
    const ch = consult.channel;
    if (ch === 'mobile') return { label: 'ผ่านผู้ป่วยเอง (Mobile)', icon: <Smartphone size={16} className="text-green-500 shrink-0" />, color: 'text-green-700' };
    if (ch === 'hospital') return { label: `ผ่านโรงพยาบาล: ${consult.agency_name || 'โรงพยาบาลต้นทาง'}`, icon: <Home size={16} className="text-purple-500 shrink-0" />, color: 'text-purple-700' };
    return { label: `ผ่านหน่วยงาน: ${consult.agency_name || 'รพ.สต. ในพื้นที่'}`, icon: <Building2 size={16} className="text-blue-500 shrink-0" />, color: 'text-blue-700' };
  })();

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 fixed inset-0 z-[50000] overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#7066a9] shrink-0 z-20 shadow-md">
        <StatusBarIPhone16Main />
        <div className="h-[64px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียด Tele-med</h1>
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

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto p-4 pb-24 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* Pink Card: Appointment Date (like HomeVisit green card) */}
        <div className={`${statusConfig.headerBg} p-4 rounded-xl border ${statusConfig.headerBorder} shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2`}>
            <div className="bg-white p-2.5 rounded-full shadow-sm border border-pink-100">
                <Calendar className={statusConfig.headerIcon} size={20} />
            </div>
            <div>
                <span className={`text-sm ${statusConfig.headerText} font-semibold block mb-0.5 text-[16px]`}>วันนัดหมาย Tele-med</span>
                <span className={`${statusConfig.headerDateText} font-bold text-lg font-['IBM_Plex_Sans_Thai']`}>
                    {displayDate}
                </span>
                {displayTime && (
                  <span className={`${statusConfig.headerTimeText} text-sm ml-2 text-[18px]`}>
                      {displayTime}
                  </span>
                )}
            </div>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0 overflow-hidden">
                    <img 
                        src={patient?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                        alt={patient?.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-base text-[18px]">{patient?.name || 'ไม่ระบุชื่อ'}</h3>
                    <p className="text-sm text-slate-500">HN: {patient?.hn || '-'}</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusConfig.label}
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

        {/* Detail Card (Request Date + Channel + Meeting Link + Doctor) */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">

            {/* วันที่สร้างคำขอ */}
            <div className="flex items-center gap-3">
                <Calendar className="text-[#7066a9]" size={20} />
                <div>
                    <span className="text-sm text-[#7066a9] block text-[16px]">วันที่สร้างคำขอ</span>
                    <span className="font-bold text-slate-800 text-[18px]">{displayRequestDate}</span>
                </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            {/* ช่องทางการเชื่อมต่อ */}
            <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-sm text-slate-400 text-[16px]">ช่องทางการเชื่อมต่อ</span>
                <div className="flex items-center gap-2">
                    {channelDisplay.icon}
                    <span className={`font-semibold text-sm truncate text-[18px] ${channelDisplay.color}`}>
                        {channelDisplay.label}
                    </span>
                </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm text-slate-400 text-[16px]">Meeting Link</span>
                 <div className="flex items-center gap-2">
                     <Video size={16} className="text-slate-400 shrink-0" />
                     <a 
                        href={consult.meetingLink || "https://meet.google.com/abc-defg-hij"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-medium text-sm hover:underline break-all text-[18px]"
                     >
                        {consult.meetingLink || "https://meet.google.com/abc-defg-hij"}
                     </a>
                 </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>

            <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-sm text-slate-400 text-[16px]">แพทย์ผู้ให้คำปรึกษา</span>
                <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-sm truncate text-[18px] text-[#5e5873]">{consult.doctor || '-'}</span>
                </div>
            </div>
        </div>

        {/* Detail Info */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Video className="text-[#7066a9]" size={22} />
                <h3 className="font-bold text-lg text-slate-800 text-[20px]">ข้อมูลการปรึกษา</h3>
            </div>
            
            <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-600 text-[16px] text-[15px]">หัวข้อการปรึกษา</span>
                <p className="text-slate-800 font-medium bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-[18px]">
                    {consult.title || '-'}
                </p>
            </div>

            <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-600 text-[16px]">รายละเอียด / ผลการปรึกษา</span>
                <p className="text-slate-600 leading-relaxed text-sm text-[16px]">
                    {consult.detail || "ผู้ป่วยมีอาการดีขึ้นตามลำดับ แผลแห้งดี ไม่มีอาการบวมแดงหรือมีหนอง ผู้ปกครองสามารถดูแลทำความสะอาดแผลได้ถูกต้อง แนะนำให้สังเกตอาการต่อเนื่องและมาตามนัดครั้งถัดไป"}
                </p>
            </div>
        </div>

        {/* Tracking Status Timeline (matching web TeleConsultationSystemDetail) */}
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
                            <span className="text-sm font-bold text-[#5e5873] text-[16px]">สร้างคำขอ Tele-med</span>
                            <span className="text-sm text-gray-400">{displayRequestDate}</span>
                        </div>
                    </div>

                    {/* Step 2: Started */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            ['ดำเนินการ', 'เสร็จสิ้น'].includes(statusConfig.label) ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[16px] font-bold",
                                ['ดำเนินการ', 'เสร็จสิ้น'].includes(statusConfig.label) ? "text-[#5e5873]" : "text-gray-400"
                            )}>เริ่มการปรึกษา</span>
                            <span className="text-sm text-gray-400">{displayDate} {displayTime}</span>
                        </div>
                    </div>

                    {/* Step 3: Completed */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            statusConfig.label === 'เสร็จสิ้น' ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[16px] font-bold",
                                statusConfig.label === 'เสร็จสิ้น' ? "text-[#5e5873]" : "text-gray-400"
                            )}>เสร็จสิ้นการปรึกษา</span>
                            <span className="text-sm text-gray-400">-</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Footer Actions — SCFC role: ยกเลิก / เลื่อนนัดหมาย (outside scrollable content) */}
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
                        คุณต้องการยกเลิกนัดหมาย Tele-med นี้ใช่หรือไม่?<br/>
                        การดำเนินการนี้ไม่สามารถเรียกคืนได้
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row gap-3 w-full sm:justify-center">
                      <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-700 m-0 text-base">กลับ</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          onCancel?.();
                          toast.success('ยกเลิกนัดหมาย Tele-med เรียบร้อย');
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