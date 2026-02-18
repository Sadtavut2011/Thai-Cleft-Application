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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Printer,
  CheckCircle,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { cn } from "../../../../../components/ui/utils";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";
import { HomeVisitForm } from "../../home-visit/forms/HomeVisitForm";
import { RejectedReferralDialog } from '../../referral/components/RejectedReferralDialog';
import { AcceptReferralDialog } from '../../referral/components/AcceptReferralDialog';
import { HOME_VISIT_DATA } from '../../../../../data/patientData';
import { getPatientByHn } from '../../../../../data/patientData';

// Unified Props Interface
export interface VisitDetailProps {
  visit: any; // Flexible input to handle different data sources (HomeVisitSystem, PatientHistory, etc.)
  patient?: any; // Optional parent patient object for fallback data
  onBack: () => void;
  onCancelRequest?: (id: string) => void;
  onOpenForm?: () => void;
  showFooter?: boolean;
  onViewHistory?: () => void;
  onContactPCU?: () => void;
  role?: 'cm' | 'pcu';
}

// Helper to format Thai Date (e.g. 14 ธ.ค. 68)
const formatThaiDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === '-') return '-';
    // Check if already contains Thai characters (already formatted) — normalize 4-digit year to 2-digit
    if (/[ก-๙]/.test(dateStr)) {
        const m = dateStr.match(/^(\d{1,2}\s+\S+\s+)(25\d{2})$/);
        if (m) return m[1] + m[2].slice(-2);
        return dateStr;
    }
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    } catch (e) {
        return dateStr;
    }
};

export function VisitDetail({ visit, patient, onBack, onCancelRequest, onOpenForm, showFooter = false, onViewHistory, onContactPCU, role = 'cm' }: VisitDetailProps) {
  const [isResultOpen, setIsResultOpen] = React.useState(false);
  const [isVisitFormOpen, setIsVisitFormOpen] = React.useState(false);
  const [localStatus, setLocalStatus] = React.useState<string>(visit?.status || 'pending');

  // Helper to update global data
  const updateVisitData = (updates: any) => {
      if (!visit) return;
      
      const target = HOME_VISIT_DATA.find(v => {
          if (visit.id && v.id === visit.id) return true;
          if (visit.hn && v.hn === visit.hn && visit.date === v.date) return true;
          return false;
      });

      if (target) {
          Object.assign(target, updates);
          console.log(`Updated visit data for ${visit.patientName}:`, updates);
      }
      
      // Update local state if status changed
      if (updates.status) {
          setLocalStatus(updates.status);
      }
  };

  const updateGlobalStatus = (newStatus: string) => {
      updateVisitData({ status: newStatus });
  };

  // --- Data Normalization Logic ---
  const rawVisit = visit || {};
  const rawPatient = patient || {};

  // 1. Patient Info
  // Priority: Visit Data -> Patient Data -> Fallback
  const displayName = rawVisit.patientName || rawVisit.name || rawPatient.name || rawPatient.full_name_th || rawPatient.full_name_en || '-';
  const displayHN = rawVisit.hn || rawVisit.patientId || rawVisit.patientHn || rawPatient.hn || rawPatient.id_card || rawPatient.cid || '-';
  
  // Image logic: Check visit first, then patient objects
  const rawImage = rawVisit.patientImage || rawPatient.image || rawPatient.profile_picture || rawPatient.personal_profile?.profile_picture;
  const displayImage = (rawImage && rawImage !== "null") ? rawImage : null;

  // Address logic
  let displayAddress = rawVisit.patientAddress || rawVisit.contact?.address || rawPatient.contact?.address;
  if (!displayAddress && rawPatient.address) {
      const a = rawPatient.address;
      displayAddress = `${a.house_no || ''} ${a.moo ? 'ม.'+a.moo : ''} ${a.sub_district || ''} ${a.district || ''} ${a.province || ''}`.trim();
  }
  if (!displayAddress) displayAddress = 'ไม่ระบุที่อยู่';

  const displayPhone = rawVisit.contact?.phone || rawPatient.phone || rawPatient.contact?.phone || '08x-xxx-xxxx';

  // 2. Visit Info
  const displayRequestDate = formatThaiDate(rawVisit.requestDate || rawVisit.createdDate || rawVisit.rawRequestDate);
  const displayDate = formatThaiDate(rawVisit.date || rawVisit.appointmentDate || rawVisit.rawDate);
  const displayRPH = rawVisit.rph || rawVisit.provider || rawVisit.visitor || rawVisit.responsibleHealthCenter || '-';
  
  // Note/Detail: Prioritize explicit note/detail fields, fallback to title (common in history lists)
  const displayNote = rawVisit.note || rawVisit.detail || rawVisit.results || rawVisit.title || '-';
  const displayImages = rawVisit.images || rawVisit.photos || [];

  // 3. Status Normalization (Use localStatus)
  const rawStatus = (localStatus || '').toLowerCase();
  let displayStatus = 'Pending';
  if (['inprogress', 'in_progress', 'working', 'ลงพื้นที่', 'อยู่ในพื้นที่', 'ดำเนินการ'].includes(rawStatus)) displayStatus = 'InProgress';
  if (['accepted', 'accept', 'รับงาน', 'ยืนยันรับงาน'].includes(rawStatus)) displayStatus = 'Accepted';
  if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited'].includes(rawStatus)) displayStatus = 'Completed';
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(rawStatus)) displayStatus = 'Rejected';
  if (['pending', 'waiting', 'wait', 'รอ', 'รอการตอบรับ'].includes(rawStatus)) displayStatus = 'Pending';
  if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(rawStatus)) displayStatus = 'WaitVisit';
  if (['nothome', 'not_home', 'not home', 'ไม่อยู่'].includes(rawStatus)) displayStatus = 'NotHome';
  if (['notallowed', 'not_allowed', 'not allowed', 'ไม่อนุญาต'].includes(rawStatus)) displayStatus = 'NotAllowed';

  // PCU Logic Helpers
  const isCompleted = displayStatus === 'Completed';
  const isWaitVisit = displayStatus === 'WaitVisit';
  const isInProgress = displayStatus === 'InProgress';
  const isAccepted = displayStatus === 'Accepted';
  const isRejected = displayStatus === 'Rejected';
  const isNotHome = displayStatus === 'NotHome';
  const isNotAllowed = displayStatus === 'NotAllowed';
  const isPending = displayStatus === 'Pending';

  // 4. Type Normalization
  let displayType = 'Joint'; // Default to Joint if unknown
  const rawType = (rawVisit.type || rawVisit.visit_type || '').toLowerCase();
  
  if (rawType.includes('delegated') || rawType.includes('ฝาก')) displayType = 'Delegated';
  else displayType = 'Joint'; // Everything else falls back to Joint

  // Type Label Display
  const getTypeLabel = () => {
      if (displayType === 'Delegated') return 'ฝาก รพ.สต. เยี่ยม';
      return 'ลงเยี่ยมพร้อม รพ.สต.';
  };

  // Look up patient record from PATIENTS_DATA for age/gender/diagnosis
  const _lookupHn = rawVisit.patientHn || rawVisit.hn || rawPatient.hn || displayHN;
  const patientRecord = _lookupHn && _lookupHn !== '-' ? getPatientByHn(_lookupHn) : undefined;
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

  // Handle Form Logic
  if (isVisitFormOpen) {
    return createPortal(
      <div className="fixed inset-0 z-[10002] bg-white">
          <HomeVisitForm 
              onBack={() => setIsVisitFormOpen(false)} 
              onSave={(data) => {
                  setIsVisitFormOpen(false);
                  const nextStatus = 'completed';
                  updateGlobalStatus(nextStatus);
                  onBack();
              }}
              patientName={displayName}
              initialPatientId={displayHN}
              initialData={{ 
                  visitDate: rawVisit.date ? rawVisit.date.split('T')[0] : '',
                  visitType: displayType === 'Delegated' ? 'delegated' : 'joint'
              }}
          />
      </div>,
      document.body
    );
  }

  return createPortal(
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
            <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดเยี่ยมบ้าน</h1>
          </div>
          <button className="text-white hover:bg-white/20 p-2 rounded-full transition-colors" onClick={() => window.print()}>
            <Printer size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto p-4 pb-24 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Green Card: Appointment Date (Show only if WaitVisit/InProgress/Completed) */}
        {['WaitVisit', 'InProgress', 'Completed'].includes(displayStatus) && (
             <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                 <div className="bg-white p-2.5 rounded-full shadow-sm border border-emerald-100">
                     <Calendar className="text-emerald-600" size={20} />
                 </div>
                 <div>
                     <span className="text-sm text-emerald-600 font-semibold block mb-0.5 text-[16px]">วันนัดหมายเยี่ยมบ้าน</span>
                     <span className="text-emerald-900 font-bold text-lg font-['IBM_Plex_Sans_Thai']">
                        {(() => {
                             try {
                                 const d = rawVisit.date ? new Date(rawVisit.date) : null;
                                 if (d && !isNaN(d.getTime())) {
                                     return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                                 }
                                 return displayDate; 
                             } catch { return displayDate; }
                        })()}
                     </span>
                     <span className="text-emerald-700 text-sm ml-2 text-[18px]">
                        {rawVisit.time ? `${rawVisit.time.substring(0, 5)} น.` : ''}
                     </span>
                 </div>
            </div>
        )}

        {/* Patient Info Card - Style from TreatmentDetail */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0 overflow-hidden">
                     <img 
                        src={displayImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                        alt={displayName} 
                        className="w-full h-full object-cover" 
                     />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-base text-[18px]">{displayName}</h3>
                    <p className="text-sm text-slate-500">HN: {displayHN}</p>
                </div>
                <div className="ml-auto">
                    {/* Status Badge */}
                    {displayStatus === 'Pending' && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#fff0e1] text-[#ff9f43] text-[14px]">รอตอบรับ</span>
                    )}
                    {displayStatus === 'Accepted' && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#EEF2FF] text-[#4F46E5]">
                            รับงาน
                        </span>
                    )}
                    {displayStatus === 'WaitVisit' && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">
                            รอเยี่ยม
                        </span>
                    )}
                    {displayStatus === 'InProgress' && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#EEF2FF] text-[#4F46E5]">
                            ดำเนินการ
                        </span>
                    )}
                    {displayStatus === 'Completed' && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#E5F8ED] text-[#28C76F]">
                            เสร็จสิ้น
                        </span>
                    )}
                    {displayStatus === 'Rejected' && (
                         <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#FCEAEA] text-[#EA5455]">
                            ปฏิเสธ
                        </span>
                    )}
                    {displayStatus === 'NotHome' && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#F8F8F8] text-[#B9B9C3]">
                            ไม่อยู่
                        </span>
                    )}
                     {displayStatus === 'NotAllowed' && (
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#FCEAEA] text-[#EA5455]">
                            ไม่อนุญาต
                        </span>
                    )}
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

        {/* Visit Details Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-3 text-slate-700">
                <Calendar className="text-[#7066a9]" size={20} />
                <div>
                    <span className="text-sm text-slate-400 block text-[16px]">วันที่สร้างคำขอ</span>
                    <span className="font-semibold text-[18px]">
                        {displayRequestDate !== '-' ? displayRequestDate : displayDate}
                    </span>
                </div>
            </div>
            
            <div className="w-full h-[1px] bg-slate-100"></div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-sm text-slate-400 text-[16px]">ประเภทการเยี่ยม</span>
                    <div className="flex items-center gap-2">
                        <Home className="text-[#7367f0] shrink-0" size={16} />
                        <span className="font-semibold text-sm truncate text-[18px] text-[#7367f0]">
                            {getTypeLabel()}
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-1 overflow-hidden">
                    <span className="text-sm text-slate-400 text-[16px]">หน่วยงาน/ผู้เยี่ยม</span>
                    <div className="flex items-center gap-2">
                        <Home className="text-slate-400 shrink-0" size={16} />
                        <span className="font-semibold text-sm truncate text-[18px] text-[#5e5873]">
                            {displayRPH}
                        </span>
                    </div>
                </div>

            </div>

            {displayNote && displayNote !== '-' && (
                <>
                    <div className="w-full h-[1px] bg-slate-100"></div>
                    <div className="mt-1 bg-[#f8f9fa] p-3 rounded-xl border border-dashed border-gray-200">
                        <span className="text-sm font-semibold text-gray-500 block mb-1 text-[16px]">ผลการเยี่ยม / หมายเหตุ</span>
                        <p className="text-sm text-[#5e5873] text-[18px]">{displayNote}</p>
                    </div>
                </>
            )}
        </div>

        {/* Visit Results Document Box */}
        {(displayStatus === 'Completed' || (rawVisit.data && Object.keys(rawVisit.data).length > 0)) && (
            <>
                <Card 
                    className="rounded-2xl border-none shadow-sm cursor-pointer active:scale-[0.98] transition-all bg-white"
                    onClick={() => setIsResultOpen(true)}
                >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#F3F2FF] flex items-center justify-center text-[#7066a9] shrink-0">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-base text-[20px]">เอกสารผลการเยี่ยมบ้าน</h4>
                                <p className="text-sm text-slate-500">แตะเพื่อดูรายละเอียดบันทึก</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 w-6 h-6" />
                    </CardContent>
                </Card>

                {/* Full Screen Form Overlay */}
                {isResultOpen && createPortal(
                    <div className="fixed inset-0 z-[10001] bg-white animate-in slide-in-from-bottom duration-300 w-full h-[100dvh]">
                         <HomeVisitForm 
                            readOnly={true} 
                            initialData={rawVisit.data || {}} 
                            onBack={() => setIsResultOpen(false)}
                         />
                    </div>,
                    document.body
                )}
            </>
        )}

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
                            <span className="text-sm font-bold text-[#5e5873] text-[16px]">สร้างคำขอเยี่ยมบ้าน</span>
                            <span className="text-sm text-gray-400">{displayRequestDate !== '-' ? displayRequestDate : displayDate}</span>
                        </div>
                    </div>

                    {/* Step 2: Accepted */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            displayStatus === 'InProgress' || displayStatus === 'Completed' ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[16px] font-bold",
                                displayStatus === 'InProgress' || displayStatus === 'Completed' ? "text-[#5e5873]" : "text-gray-400"
                            )}>ดำเนินการ / ตอบรับ</span>
                            <span className="text-sm text-gray-400">-</span>
                        </div>
                    </div>

                    {/* Step 3: Visited */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            displayStatus === 'Completed' ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                         <div className="flex flex-col">
                            <span className={cn(
                                "text-[16px] font-bold",
                                displayStatus === 'Completed' ? "text-[#5e5873]" : "text-gray-400"
                            )}>ลงพื้นที่เยี่ยมบ้าน</span>
                            <span className="text-sm text-gray-400">-</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
      
      {/* Footer Actions */}
      {role === 'pcu' ? (
        <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 flex flex-col gap-3 z-[10002] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           {isCompleted ? (
               // Case 1: Completed
               <button 
                   onClick={() => setIsVisitFormOpen(true)}
                   className="w-full bg-white border border-[#0e9f6e] text-[#0e9f6e] h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-green-50 transition-colors active:scale-95 duration-200"
               >
                   <FileText className="w-5 h-5" />
                   <span className="text-[14px]">แก้ไขผลการติดตาม</span>
               </button>
           ) : isWaitVisit ? (
               // Case 3: Wait for Visit (Scheduled) -> Show Record Visit
                <button 
                   onClick={() => setIsVisitFormOpen(true)}
                   className="w-full bg-[#7367F0] text-white h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-[#6458d6] transition-colors active:scale-95 duration-200"
               >
                   <FileText className="w-5 h-5" />
                   <span className="text-[14px]">ลงบันทึกการเยี่ยม</span>
               </button>
           ) : isInProgress || isAccepted ? (
               // Case 2: In Progress (Accepted, Not Scheduled)
               <>
                   <button 
                       onClick={() => {
                           const nextStatus = 'notallowed';
                           updateGlobalStatus(nextStatus);
                           onBack();
                       }}
                       className="w-full bg-[#F1F5F9] text-[#64748B] h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-[#E2E8F0] transition-colors active:scale-95 duration-200">
                       <AlertTriangle className="w-5 h-5" />
                       <span className="text-[14px]">ไม่อนุญาตให้ลงพื้นที่</span>
                   </button>
                   <div className="flex gap-3 w-full">
                        <RejectedReferralDialog
                           title="เหตุผลที่ไม่อยู่ในพื้นที่"
                           trigger={
                               <button className="flex-1 bg-white border border-red-200 text-[#DC2626] h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-red-50 transition-colors active:scale-95 duration-200">
                                   <Navigation className="w-5 h-5 rotate-45 fill-current" />
                                   <span className="text-[14px]">ไม่อยู่ในพื้นที่</span>
                               </button>
                           }
                           onConfirm={(reason) => {
                               console.log("Not In Area reason:", reason);
                               const nextStatus = 'nothome';
                               updateGlobalStatus(nextStatus);
                               onBack();
                           }}
                        />
                       
                        <AcceptReferralDialog
                         referralId={visit?.id || 0}
                         onAccept={(id, date, details) => {
                             console.log('Accepted visit:', { id, date, details });
                             // Change status to Wait for Visit and sync Date/Time
                             updateVisitData({
                                 status: 'wait_visit',
                                 date: date.toISOString(),
                                 time: date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }),
                                 note: details ? details : (visit?.note || '')
                             });
                         }}
                         trigger={
                              <button 
                                 className="flex-1 bg-[#10b981] text-white h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-[#059669] transition-colors active:scale-95 duration-200"
                             >
                                 <CheckCircle className="w-5 h-5" />
                                 <span className="text-[14px]">อยู่ในพื้นที่</span>
                             </button>
                         }
                       />
                   </div>
               </>
           ) : isRejected ? (
               <button disabled className="w-full bg-red-50 text-red-500 h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold">
                   <span className="text-[14px]">ปฏิเสธการเยี่ยมแล้ว</span>
               </button>
           ) : (
               // Case 4: Pending (Wait Accept)
               <div className="flex gap-3 w-full">
                   <RejectedReferralDialog
                       trigger={
                           <button className="flex-1 bg-white border border-red-200 text-[#DC2626] h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-red-50 transition-colors active:scale-95 duration-200">
                               <AlertTriangle className="w-5 h-5" />
                               <span className="text-[14px]">ปฎิเสธ</span>
                           </button>
                       }
                       onConfirm={(reason) => {
                           console.log("Rejected with reason:", reason);
                           const nextStatus = 'rejected';
                           updateGlobalStatus(nextStatus);
                           onBack();
                       }}
                   />
                   <button 
                       onClick={() => {
                           const nextStatus = 'accepted';
                           updateGlobalStatus(nextStatus);
                       }}
                       className="flex-1 bg-[#10b981] text-white h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-[#059669] transition-colors active:scale-95 duration-200"
                   >
                       <CheckCircle className="w-5 h-5" />
                       <span className="text-[14px]">ยืนยันรับงาน</span>
                   </button>
               </div>
           )}
        </div>
      ) : showFooter && (
        <div className="shrink-0 px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] bg-white shadow-[0_-8px_30px_-8px_rgba(0,0,0,0.1)] z-[60] flex gap-3 fixed bottom-0 left-0 w-full rounded-t-[24px]">
            <Button 
                onClick={onViewHistory}
                variant="outline"
                className="flex-1 h-[52px] rounded-2xl text-base border-[#E2E8F0] text-[#1e293b] hover:bg-slate-50 font-bold shadow-sm"
            >
                ประวัติผู้ป่วย
            </Button>
            <Button 
                onClick={() => setIsVisitFormOpen(true)}
                className="flex-1 h-[52px] rounded-2xl text-base bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-lg shadow-indigo-200 font-bold flex items-center justify-center gap-2"
            >
                <FileText className="w-5 h-5" />
                บันทึกผล
            </Button>
        </div>
      )}
    </div>,
    document.body
  );
}