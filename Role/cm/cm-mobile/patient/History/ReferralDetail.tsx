import React from 'react';
import { 
  ChevronLeft, 
  ArrowLeft,
  Calendar, 
  User, 
  Home, 
  Send,
  FileText,
  CheckCircle,
  Building,
  CheckCircle2,
  Printer,
  AlertTriangle,
  History,
  Pencil
} from 'lucide-react';
import { StatusBarIPhone16Main } from "../../../../../../components/shared/layout/TopHeader";
import { Button } from "../../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { cn } from "../../../../../../components/ui/utils";
import { PATIENTS_DATA } from "../../../../../../data/patientData";
import { getPatientByHn } from "../../../../../../data/patientData";
import { AcceptReferralDialog } from "../../referral/components/AcceptReferralDialog";
import { RejectedReferralDialog } from "../../referral/components/RejectedReferralDialog";
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

interface ReferralDetailProps {
  referral: any;
  patient: any;
  onBack: () => void;
  onAccept?: (id: number, date?: Date, details?: string) => void;
  onReject?: (id: number, reason?: string) => void;
  onDelete?: (id: number) => void;
  onViewPatient?: (hn: string) => void;
  readOnly?: boolean;
  /** Role: 'cm' (default) or 'scfc' */
  role?: 'cm' | 'scfc';
  /** SCFC callback: cancel referral */
  onCancel?: () => void;
  /** SCFC callback: edit referral */
  onEdit?: () => void;
  /** SCFC callback: view patient history */
  onViewHistory?: () => void;
}

export const ReferralDetail: React.FC<ReferralDetailProps> = ({ referral, patient, onBack, onAccept, onReject, onDelete, onViewPatient, readOnly, role = 'cm', onCancel, onEdit, onViewHistory }) => {
  if (!referral) return null;

  // Look up patient record from PATIENTS_DATA for age/gender/diagnosis
  const patientRecord = patient?.hn ? getPatientByHn(patient.hn) : undefined;
  const _patientDob = patientRecord?.dob;
  const _patientGender = patientRecord?.gender;
  const _patientDiagnosis = patientRecord?.diagnosis || referral?.title || '-';
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
      
      <style>{`
        .bottom-nav, nav.fixed.bottom-0, .navigation-bar, .mobile-bottom-nav, #mobile-bottom-navigation { display: none !important; }
      `}</style>
      {/* Header */}
      <div className="bg-[#7066a9] shrink-0 z-20">
        <StatusBarIPhone16Main />
        <div className="h-[64px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดการส่งตัว</h1>
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

        {/* Green Card: Appointment Date (Show only if Accepted/WaitingReceive/Received/Treated) */}
        {['accepted', 'confirmed', 'waitingreceive', 'received', 'waiting_doctor', 'completed', 'treated'].includes((referral?.status || '').toLowerCase()) && referral.acceptedDate && (
             <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                 <div className="bg-white p-2.5 rounded-full shadow-sm border border-emerald-100">
                     <Calendar className="text-emerald-600" size={20} />
                 </div>
                 <div>
                     <span className="text-sm text-emerald-600 font-semibold block mb-0.5 text-[16px]">วันนัดหมายส่งตัว</span>
                     <span className="text-emerald-900 font-bold text-lg font-['IBM_Plex_Sans_Thai']">
                        {new Date(referral.acceptedDate).toLocaleDateString('th-TH', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric'
                        })}
                     </span>
                     <span className="text-emerald-700 text-sm ml-2 text-[18px]">
                        {new Date(referral.acceptedDate).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                     </span>
                 </div>
            </div>
        )}
        
        {/* Patient Info Summary */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4">
                <img 
                    src={patient?.image || PATIENTS_DATA.find(p => p.hn === patient?.hn)?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                    alt={patient?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-slate-100"
                />
                <div>
                    <h3 className="font-bold text-slate-800 text-base text-[18px]">{patient?.name || 'ไม่ระบุชื่อ'}</h3>
                    <p className="text-sm text-slate-500">HN: {patient?.hn || '-'}</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-3 py-1 rounded-full text-[14px] font-bold ${
                        (() => {
                            const status = (referral?.status || '').toLowerCase();
                            if (['pending', 'referred'].includes(status)) return 'bg-blue-100 text-blue-700';
                            if (['accepted', 'confirmed'].includes(status)) return 'bg-orange-100 text-orange-700';
                            if (['received', 'waiting_doctor'].includes(status)) return 'bg-blue-100 text-blue-700';
                            if (status === 'examined') return 'bg-teal-100 text-teal-700';
                            if (['completed', 'treated'].includes(status)) return 'bg-green-100 text-green-700';
                            if (status === 'rejected') return 'bg-red-100 text-red-700';
                            return 'bg-slate-100 text-slate-700';
                        })()
                    }`}>
                        {(() => {
                            const status = (referral?.status || '').toLowerCase();
                            if (['pending', 'referred'].includes(status)) return 'รอการตอบรับ';
                            if (['accepted', 'confirmed'].includes(status)) return 'รอรับตัว';
                            if (['received', 'waiting_doctor'].includes(status)) return 'รอตรวจ';
                            if (status === 'examined') return 'ตรวจแล้ว';
                            if (['completed', 'treated'].includes(status)) return 'รักษาแล้ว';
                            if (status === 'rejected') return 'ปฏิเสธ';
                            if (status === 'waitingreceive') return 'รอรับตัว';
                            return status || '-';
                        })()}
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

        {/* Date & Route Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
            

            <div className="flex items-center gap-3 text-slate-700">
                <Calendar className="text-[#7066a9]" size={20} />
                <div>
                    <span className="text-sm text-slate-400 block text-[16px]">วันที่สร้างคำขอ</span>
                    <span className="font-semibold text-[18px]">
                        {(() => {
                            if (!referral.date) return '-';
                            if (/[ก-๙]/.test(referral.date)) return referral.date;
                            try {
                                const d = new Date(referral.date);
                                if (isNaN(d.getTime())) return referral.date;
                                return d.toLocaleDateString('th-TH', { 
                                    day: 'numeric', 
                                    month: 'short', 
                                    year: '2-digit' 
                                });
                            } catch (e) {
                                return referral.date;
                            }
                        })()}
                    </span>
                </div>
            </div>
            <div className="w-full h-[1px] bg-slate-100"></div>
            
            <div className="flex flex-col gap-4">
                 <div className="flex flex-col gap-1 overflow-hidden">
                     <span className="text-sm text-slate-400 text-[16px]">ต้นทาง</span>
                     <div className="flex items-center gap-2">
                         <Building size={16} className="text-slate-400 shrink-0" />
                         <span className="font-semibold text-sm truncate text-[18px]">
                             {referral.creatorRole === 'PCU' 
                                ? (patient?.responsibleHealthCenter || patient?.hospitalInfo?.responsibleRph || referral.from)
                                : referral.from}
                         </span>
                     </div>
                 </div>
                 <div className="flex pl-1">
                     <ArrowLeft size={18} className="text-slate-300 -rotate-90" />
                 </div>
                 <div className="flex flex-col gap-1 overflow-hidden">
                     <span className="text-sm text-slate-400 text-[16px]">ปลายทาง</span>
                     <div className="flex items-center gap-2">
                         <Building size={16} className="text-blue-500 shrink-0" />
                         <span className="font-semibold text-sm line-clamp-2 text-[18px]">{referral.to}</span>
                     </div>
                 </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>
            <div className="flex items-center gap-3 text-slate-700">
                <User className="text-[#7066a9]" size={20} />
                <div>
                    <span className="text-sm text-slate-400 block text-[16px]">แพทย์เจ้าของไข้</span>
                    <span className="font-semibold text-[18px]">{referral.doctor || patient?.doctor || '-'}</span>
                </div>
            </div>
            <div className="w-full h-[1px] bg-slate-100"></div>
            <div className="flex items-center gap-3 text-slate-700">
                <AlertTriangle className={`${
                    referral.urgency === 'Emergency' ? 'text-red-500' :
                    referral.urgency === 'Urgent' ? 'text-orange-500' :
                    'text-[#7066a9]'
                }`} size={20} />
                <div>
                    <span className="text-sm text-slate-400 block text-[16px]">ความเร่งด่วน</span>
                    <span className={`font-semibold text-[18px] ${
                        referral.urgency === 'Emergency' ? 'text-red-600' :
                        referral.urgency === 'Urgent' ? 'text-orange-500' :
                        'text-slate-700'
                    }`}>
                        {referral.urgency === 'Emergency' ? 'ฉุกเฉิน' :
                         referral.urgency === 'Urgent' ? 'เร่งด่วน' :
                         'ปกติ (Routine)'}
                    </span>
                </div>
            </div>
        </div>

        {/* Referral Info */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Send className="text-[#7066a9]" size={22} />
                <h3 className="font-bold text-lg text-slate-800 text-[20px]">ข้อมูลการส่งต่อ</h3>
            </div>
            
            <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-600 text-[16px]">เรื่อง / การวินิจฉัย</span>
                <p className="text-slate-800 font-medium bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-[18px]">
                    {referral.title || '-'}
                </p>
            </div>

            <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-600 text-[16px]">เหตุผลการส่งต่อ</span>
                <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 text-[18px]">
                   {referral.reason || 'ผู้ป่วยมีภาวะปากแหว่งเพดานโหว่ ต้องการการประเมินและวางแผนการผ่าตัดร่วมกับศัลยแพทย์ตกแต่งและกุมารแพทย์'}
                </p>
            </div>

             <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-sm font-semibold text-slate-400 flex items-center gap-1 text-[16px]">
                     <FileText size={14} /> เลขที่ใบส่งตัว
                </span>
                <p className="text-slate-600 text-sm font-mono text-[16px] text-[15px]">
                   {referral.referralNo || 'REF-6701-100X'}
                </p>
            </div>
        </div>

        {/* Tracking Status Timeline (matching web ReferralSystemDetail) */}
        <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[#5e5873] text-base font-bold">สถานะการติดตาม</CardTitle>
            </CardHeader>
            <div className="px-6 pb-2">
                <div className="h-[1px] bg-gray-100 w-full"></div>
            </div>
            <CardContent className="pt-4">
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                    {referral.logs && referral.logs.length > 0 ? (
                        referral.logs.map((log: any, index: number) => {
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
                                        <span className="text-sm font-bold text-[#5e5873] text-[16px]">{log.description || log.status}</span>
                                        <span className="text-sm text-gray-400">
                                            {(() => {
                                                if (!log.date) return '-';
                                                if (/[ก-๙]/.test(log.date)) return log.date;
                                                try {
                                                    const d = new Date(log.date);
                                                    if (isNaN(d.getTime())) return log.date;
                                                    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                                                } catch { return log.date; }
                                            })()}
                                        </span>
                                        {log.actor && log.actor !== '-' && (
                                            <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <User size={10} /> {log.actor}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <>
                            {/* Step 1: Created */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#5e5873] text-[16px]">สร้างคำขอส่งตัว</span>
                                    <span className="text-sm text-gray-400">
                                        {(() => {
                                            if (!referral.date) return '-';
                                            if (/[ก-๙]/.test(referral.date)) return referral.date;
                                            try {
                                                const d = new Date(referral.date);
                                                if (isNaN(d.getTime())) return referral.date;
                                                return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                                            } catch { return referral.date; }
                                        })()}
                                    </span>
                                </div>
                            </div>
                            {/* Step 2: Accepted */}
                            <div className="relative">
                                <div className={cn(
                                    "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                    ['accepted', 'confirmed', 'completed', 'treated'].includes((referral.status || '').toLowerCase()) ? "bg-green-500" : "bg-gray-300"
                                )}></div>
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-[16px] font-bold",
                                        ['accepted', 'confirmed', 'completed', 'treated'].includes((referral.status || '').toLowerCase()) ? "text-[#5e5873]" : "text-gray-400"
                                    )}>ตอบรับการส่งตัว</span>
                                    <span className="text-sm text-gray-400">-</span>
                                </div>
                            </div>
                            {/* Step 3: Completed */}
                            <div className="relative">
                                <div className={cn(
                                    "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                    ['completed', 'treated'].includes((referral.status || '').toLowerCase()) ? "bg-green-500" : "bg-gray-300"
                                )}></div>
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-[16px] font-bold",
                                        ['completed', 'treated'].includes((referral.status || '').toLowerCase()) ? "text-[#5e5873]" : "text-gray-400"
                                    )}>ตรวจเสร็จสิ้น</span>
                                    <span className="text-sm text-gray-400">-</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Action Buttons (Only if onAccept/onReject provided and Pending) */}
      {onAccept && onReject && (referral.status === 'Pending' || referral.status === 'pending') && !readOnly && (
         <div className="shrink-0 px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] bg-white shadow-[0_-8px_30px_-8px_rgba(0,0,0,0.1)] z-[50001] flex gap-3 fixed bottom-0 left-0 w-full rounded-t-[24px]">
             {referral.type === 'Refer Out' ? (
                 <>
                    <div className="flex-1 min-w-0">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                                variant="outline" 
                                className="w-full h-[52px] rounded-2xl text-base border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 font-bold shadow-sm"
                            >
                                ยกเลิกคำขอ
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl max-w-[340px] w-[90%] gap-6">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-bold text-xl text-center text-slate-800">ยืนยันกรยกเลิก</AlertDialogTitle>
                              <AlertDialogDescription className="text-center text-slate-500 text-base">
                                คุณต้องการยกเลิกคำขอนี้ใช่หรือไม่?<br/>
                                การดำเนินการนี้ไม่สามารถเรียกคืนได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-row gap-3 w-full sm:justify-center">
                              <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-700 m-0 text-base">กลับ</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDelete && onDelete(referral.id)}
                                className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold m-0 text-base border-none shadow-md shadow-red-100"
                              >
                                ยืนยันลบ
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <div className="flex-1 min-w-0">
                         <Button 
                            className="w-full h-[52px] rounded-2xl text-base bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-lg shadow-indigo-200 font-bold flex items-center justify-center gap-2"
                            onClick={() => onViewPatient && onViewPatient(patient.hn)}
                         >
                             <User className="w-5 h-5" /> ข้อมูลผู้ป่วย
                         </Button>
                    </div>
                 </>
             ) : (
                 <>
                    <div className="flex-1 min-w-0">
                        <RejectedReferralDialog 
                            onConfirm={(reason) => onReject && onReject(referral.id, reason)}
                            trigger={
                                <Button variant="outline" className="w-full h-[52px] rounded-2xl text-base border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 font-bold shadow-sm">
                                    ปฎิเสธคำขอ
                                </Button>
                            }
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <AcceptReferralDialog 
                            referralId={referral.id}
                            onAccept={onAccept}
                            trigger={
                                <Button className="w-full h-[52px] rounded-2xl text-base bg-[#10b981] hover:bg-[#059669] text-white shadow-lg shadow-green-200 font-bold flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" /> ยอมรับการส่งตัว
                                </Button>
                            }
                        />
                    </div>
                 </>
             )}
         </div>
      )}

      {/* SCFC Footer Actions: ยกเลิก / แก้ไข */}
      {role === 'scfc' && (
      <div className="shrink-0 p-4 border-t border-[#E3E0F0] bg-white pb-8 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3">
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <button
                          className="flex-1 h-12 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-[16px] hover:bg-red-100 transition-colors"
                      >
                          ยกเลิกการส่งตัว
                      </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl max-w-[340px] w-[90%] gap-6">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-bold text-xl text-center text-slate-800">ยืนยันการยกเลิก</AlertDialogTitle>
                      <AlertDialogDescription className="text-center text-slate-500 text-base">
                        คุณต้องการยกเลิกการส่งตัวนี้ใช่หรือไม่?<br/>
                        การดำเนินการนี้ไม่สามารถเรียกคืนได้
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row gap-3 w-full sm:justify-center">
                      <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-700 m-0 text-base">กลับ</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onCancel?.();
                          toast.success('ยกเลิกการส่งตัวเรียบร้อย');
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
                    onEdit?.();
                    toast.info('กำลังแก้ไขข้อมูลการส่งตัว...');
                  }}
                  className="flex-1 h-12 rounded-xl bg-[#49358E] text-white font-bold text-[16px] hover:bg-[#37286A] shadow-md shadow-[#49358E]/20 transition-colors flex items-center justify-center gap-2"
              >
                  <Pencil size={18} />
                  แก้ไข
              </button>
          </div>
      </div>
      )}
    </div>
  );
}