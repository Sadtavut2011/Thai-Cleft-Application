import React, { useState } from 'react';
import { 
  ChevronLeft, 
  FileText, 
  Banknote, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle,
  Paperclip,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  History,
  AlertTriangle,
  X,
  Shield
} from 'lucide-react';
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";
import { getPatientByHn } from "../../../../data/patientData";
import { toast } from "sonner@2.0.3";

interface FundingDetailProps {
  fund: any;
  patient: any;
  fundSource?: string;
  onBack: () => void;
  /** Role: 'cm' (default) or 'scfc' */
  role?: 'cm' | 'scfc';
  /** Callback when SCFC approves/rejects — receives newStatus + optional reason */
  onStatusChange?: (newStatus: string, reason?: string) => void;
  /** Callback when SCFC clicks "ประวัติ" */
  onViewHistory?: () => void;
}

export const FundingDetail: React.FC<FundingDetailProps> = ({ 
  fund, 
  patient, 
  fundSource, 
  onBack,
  role = 'cm',
  onStatusChange,
  onViewHistory
}) => {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  // Track local status for immediate UI update
  const [localStatus, setLocalStatus] = useState<string | null>(null);
  // SCFC: Action sheet modal
  const [showActionSheet, setShowActionSheet] = useState(false);

  if (!fund) return null;

  const currentStatus = localStatus || fund.status;

  // Look up patient record from PATIENTS_DATA for age/gender/diagnosis
  const patientRecord = patient?.hn ? getPatientByHn(patient.hn) : undefined;
  const _patientDob = patientRecord?.dob;
  const _patientGender = patientRecord?.gender;
  const _patientDiagnosis = patientRecord?.diagnosis || fund?.diagnosis || '-';
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

  // Helper: format ISO datetime to Thai Buddhist date + time
  const formatThaiDateTime = (isoStr: string | undefined): { date: string; time: string } | null => {
    if (!isoStr) return null;
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return null;
      const datePart = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
      const timePart = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
      return { date: datePart, time: timePart };
    } catch {
      return null;
    }
  };

  const approvedDT = formatThaiDateTime(fund.approvedDate);
  const rejectedDT = formatThaiDateTime(fund.rejectedDate);

  const renderStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    
    if (s === 'approved' || s === 'อนุมัติ') {
        return (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#E5F8ED] text-[#28C76F]">
                อนุมัติแล้ว
            </span>
        );
    }
    if (s === 'rejected' || s === 'ปฎิเสธ' || s === 'ปฏิเสธ') {
        return (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FCEAEA] text-[#EA5455]">
                ถูกปฏิเสธ
            </span>
        );
    }
    // Default Pending
    return (
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#fff0e1] text-[#ff9f43]">
            รอพิจารณา
        </span>
    );
  };

  // Determine if SCFC should show action footer
  const isScfc = role === 'scfc';
  const isPending = (currentStatus || '').toLowerCase() === 'pending' || currentStatus === 'รอพิจารณา';
  const isApproved = (currentStatus || '').toLowerCase() === 'approved';
  const isRejected = (currentStatus || '').toLowerCase() === 'rejected';

  // Handle approve
  const handleApproveConfirm = () => {
    setLocalStatus('Approved');
    onStatusChange?.('Approved');
    setShowApproveConfirm(false);
    toast.success('อนุมัติทุนเรียบร้อยแล้ว');
  };

  // Handle reject — step 1: confirm, step 2: reason
  const handleRejectConfirmStep1 = () => {
    setShowActionSheet(false);
    setShowRejectReason(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      toast.error('กรุณาระบุเหตุผลในการปฏิเสธ');
      return;
    }
    setLocalStatus('Rejected');
    onStatusChange?.('Rejected', rejectReason.trim());
    setShowRejectReason(false);
    setRejectReason('');
    toast.error('ปฏิเสธคำขอทุนเรียบร้อยแล้ว');
  };

  return (
    <div className="fixed inset-0 z-[50000] bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* CSS Hack to hide sidebar if needed */}
      <style>{`
        .fixed.bottom-0.left-0.w-full.bg-white.z-50 { display: none !important; }
      `}</style>

      {/* Header */}
      <div className="bg-[#7066a9] shrink-0 z-20 shadow-md">
        <StatusBarIPhone16Main />
        <div className="h-[64px] px-4 flex items-center gap-3">
          <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif] flex-1">รายละเอียดขอเบิกจ่ายทุน</h1>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 w-full overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${isScfc ? 'pb-32' : 'pb-24'}`}>
        
        {/* Approved Date Banner */}
        {isApproved && approvedDT && (
             <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                 <div className="bg-white p-2.5 rounded-full shadow-sm border border-green-100">
                     <ThumbsUp className="text-green-600" size={20} />
                 </div>
                 <div>
                     <span className="text-sm text-green-600 font-semibold block mb-0.5 text-[16px]">วันที่ได้รับอนุมัติทุน</span>
                     <span className="text-green-900 font-bold text-lg font-['IBM_Plex_Sans_Thai']">{approvedDT.date}</span>
                     <span className="text-green-700 text-sm ml-2 text-[18px]">{approvedDT.time} น.</span>
                 </div>
            </div>
        )}

        {/* Approved Banner (local state, no approvedDate yet) */}
        {isApproved && !approvedDT && (
             <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                 <div className="bg-white p-2.5 rounded-full shadow-sm border border-green-100">
                     <ThumbsUp className="text-green-600" size={20} />
                 </div>
                 <div>
                     <span className="text-sm text-green-600 font-semibold block mb-0.5 text-[16px]">อนุมัติทุนแล้ว</span>
                     <span className="text-green-900 font-bold text-lg font-['IBM_Plex_Sans_Thai']">
                       {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                     </span>
                 </div>
            </div>
        )}

        {/* Rejected Date Banner */}
        {isRejected && rejectedDT && (
             <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                 <div className="bg-white p-2.5 rounded-full shadow-sm border border-red-100">
                     <ThumbsDown className="text-red-500" size={20} />
                 </div>
                 <div>
                     <span className="text-sm text-red-500 font-semibold block mb-0.5 text-[16px]">วันที่ปฏิเสธทุน</span>
                     <span className="text-red-900 font-bold text-lg font-['IBM_Plex_Sans_Thai']">{rejectedDT.date}</span>
                     <span className="text-red-700 text-sm ml-2 text-[18px]">{rejectedDT.time} น.</span>
                 </div>
            </div>
        )}

        {/* Rejected Banner (local state, no rejectedDate yet) */}
        {isRejected && !rejectedDT && (
             <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                 <div className="bg-white p-2.5 rounded-full shadow-sm border border-red-100">
                     <ThumbsDown className="text-red-500" size={20} />
                 </div>
                 <div>
                     <span className="text-sm text-red-500 font-semibold block mb-0.5 text-[16px]">ปฏิเสธคำขอทุนแล้ว</span>
                     <span className="text-red-900 font-bold text-lg font-['IBM_Plex_Sans_Thai']">
                       {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                     </span>
                 </div>
            </div>
        )}

        {/* Patient Info Card with Status Badge */}
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
                    <h3 className="font-bold text-slate-800 text-base">{patient?.name || 'ไม่ระบุชื่อ'}</h3>
                    <p className="text-sm text-slate-500">HN: {patient?.hn || '-'}</p>
                </div>
                <div className="ml-auto">
                    {renderStatusBadge(currentStatus)}
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

        {/* Fund Details */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base text-[20px]">
                <FileText className="text-[#7066a9]" size={20} />
                รายละเอียดการขอทุน
            </h3>
            
            <div className="space-y-4">
                {/* Fund Name Section */}
                <div className="space-y-1 pb-3 border-b border-slate-50">
                    <span className="text-xs text-slate-400 text-[14px]">ชื่อกองทุน</span>
                    <p className="font-bold text-blue-600 text-lg">{fundSource || fund.type || fund.fundType || fund.name || 'ไม่ระบุ'}</p>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-sm text-slate-400 text-[16px]">โรงพยาบาลที่ทำเรื่อง</span>
                        <span className="font-semibold text-[18px] text-[#5e5873]">{fund.hospital || 'โรงพยาบาลฝาง'}</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-sm text-slate-400 text-[16px]">วันที่ยื่นเรื่อง</span>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-400 shrink-0" />
                            <span className="font-semibold text-[18px] text-[#5e5873]">{fund.date || fund.requestDate || '-'}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400 block mb-2 text-[14px]">จำนวนเงินที่ขอเบิก</span>
                    <div className="flex items-center gap-2">
                        <Banknote className="text-green-600" size={24} />
                        <span className="text-2xl font-bold text-green-600">
                            {typeof fund.amount === 'number' ? fund.amount.toLocaleString() : fund.amount} 
                            <span className="text-sm text-slate-400 font-normal ml-1">บาท</span>
                        </span>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-xs text-slate-400 block text-[14px]">เหตุผลความจำเป็น / รายละเอียด</span>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed">
                        {fund.reason || fund.diagnosis || "ไม่มีรายละเอียด"}
                    </div>
                </div>

                {/* Show reject reason if rejected */}
                {isRejected && fund.rejectReason && (
                  <div className="pt-4 border-t border-red-100 space-y-2">
                    <span className="text-xs text-red-400 block text-[14px]">เหตุผลที่ปฏิเสธ</span>
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-600 leading-relaxed">
                        {fund.rejectReason}
                    </div>
                  </div>
                )}
            </div>
        </div>

        {/* Attachments (Mock) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base text-[20px]">
                <Paperclip className="text-[#7066a9]" size={20} />
                เอกสารแนบ
            </h3>
            <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold">PDF</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">แบบฟอร์มขอรับทุน.pdf</p>
                        <p className="text-xs text-slate-400">1.2 MB</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold">IMG</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">รูปถ่ายสภาพความเป็นอยู่.jpg</p>
                        <p className="text-xs text-slate-400">3.5 MB</p>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* ═══ SCFC Footer: ประวัติ + ดำเนินการ ═══ */}
      {isScfc && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30">
          <div className="p-4 pb-8">
            <div className="flex gap-3">
              {/* ปุ่มประวัติ */}
              <button 
                onClick={onViewHistory}
                className="flex-1 h-[52px] bg-[#F4F0FF] border-2 border-[#C4BFFA] text-[#49358E] rounded-2xl flex items-center justify-center gap-2 font-bold text-[16px] active:scale-95 transition-all hover:bg-[#ebe7ff]"
              >
                <History size={20} />
                ประวัติ
              </button>
              {/* ปุ่มดำเนินการ */}
              {isPending ? (
                <button 
                  onClick={() => setShowActionSheet(true)}
                  className="flex-[2] h-[52px] bg-[#49358E] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-[16px] active:scale-95 transition-all hover:bg-[#37286A] shadow-lg shadow-[#49358E]/25"
                >
                  <Shield size={20} />
                  ดำเนินการ
                </button>
              ) : isApproved ? (
                <div className="flex-[2] h-[52px] flex items-center justify-center bg-green-50 rounded-2xl border border-green-200 text-green-600 font-bold text-[16px]">
                  <CheckCircle2 size={20} className="mr-2" />
                  อนุมัติทุนแล้ว
                </div>
              ) : isRejected ? (
                <div className="flex-[2] h-[52px] flex items-center justify-center bg-red-50 rounded-2xl border border-red-200 text-red-600 font-bold text-[16px]">
                  <XCircle size={20} className="mr-2" />
                  รายการนี้ถูกปฏิเสธ
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ═══ SCFC Action Sheet: ปฏิเสธ / อนุมัติ ═══ */}
      {showActionSheet && (
        <div className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-6" onClick={() => setShowActionSheet(false)}>
          <div 
            className="bg-white relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] w-[300px] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* X close button */}
            <button 
              onClick={() => setShowActionSheet(false)}
              className="absolute right-[15px] top-[15px] w-[24px] h-[24px] flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M6 6L18 18" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center pt-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M43.46 36L27.46 8C27.1111 7.38441 26.6052 6.87238 25.9938 6.51614C25.3825 6.1599 24.6876 5.97221 23.98 5.97221C23.2724 5.97221 22.5775 6.1599 21.9662 6.51614C21.3548 6.87238 20.8489 7.38441 20.5 8L4.5 36C4.14736 36.6107 3.96246 37.3038 3.96402 38.009C3.96558 38.7142 4.15356 39.4065 4.50889 40.0156C4.86423 40.6248 5.3743 41.1292 5.98739 41.4777C6.60049 41.8261 7.29481 42.0063 8 42H40C40.7018 41.9993 41.3911 41.8139 41.9986 41.4626C42.6061 41.1112 43.1104 40.6062 43.461 39.9982C43.8116 39.3903 43.9961 38.7008 43.9959 37.999C43.9957 37.2972 43.8109 36.6078 43.46 36Z" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                <path d="M24 18V26" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                <path d="M24 34H24.02" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </svg>
            </div>

            {/* Title */}
            <p className="font-['IBM_Plex_Sans_Thai',sans-serif] font-bold text-[20px] leading-[28px] text-[#1e2939] text-center mt-4 px-6">
              เลือกการพิจารณาทุน
            </p>

            {/* Description */}
            <p className="font-['IBM_Plex_Sans_Thai',sans-serif] text-[14px] leading-[20px] text-[#6a7282] text-center mt-3 px-6">
              กรุณาเลือกการดำเนินการสำหรับคำขอทุนนี้
            </p>

            {/* Buttons */}
            <div className="flex gap-4 items-center justify-center px-6 pt-5 pb-6">
              <button
                onClick={() => { setShowActionSheet(false); setShowRejectReason(true); }}
                className="bg-[#fb2c36] h-[40px] rounded-[14px] px-5 flex items-center justify-center active:scale-95 transition-all"
              >
                <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[14px] text-white whitespace-nowrap">ปฏิเสธ</span>
              </button>
              <button
                onClick={() => { setShowActionSheet(false); setShowApproveConfirm(true); }}
                className="bg-[#28c76f] h-[40px] rounded-[14px] shadow-[0px_10px_15px_0px_#b9f8cf,0px_4px_6px_0px_#b9f8cf] px-5 flex items-center justify-center active:scale-95 transition-all"
              >
                <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[14px] text-white whitespace-nowrap">อนุมัติ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Approve Confirmation Modal ═══ */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-6">
          <div className="bg-white relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] w-[300px] animate-in zoom-in-95 duration-200">
            {/* X close button */}
            <button 
              onClick={() => setShowApproveConfirm(false)}
              className="absolute right-[15px] top-[15px] w-[24px] h-[24px] flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M6 6L18 18" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center pt-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M43.46 36L27.46 8C27.1111 7.38441 26.6052 6.87238 25.9938 6.51614C25.3825 6.1599 24.6876 5.97221 23.98 5.97221C23.2724 5.97221 22.5775 6.1599 21.9662 6.51614C21.3548 6.87238 20.8489 7.38441 20.5 8L4.5 36C4.14736 36.6107 3.96246 37.3038 3.96402 38.009C3.96558 38.7142 4.15356 39.4065 4.50889 40.0156C4.86423 40.6248 5.3743 41.1292 5.98739 41.4777C6.60049 41.8261 7.29481 42.0063 8 42H40C40.7018 41.9993 41.3911 41.8139 41.9986 41.4626C42.6061 41.1112 43.1104 40.6062 43.461 39.9982C43.8116 39.3903 43.9961 38.7008 43.9959 37.999C43.9957 37.2972 43.8109 36.6078 43.46 36Z" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                <path d="M24 18V26" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                <path d="M24 34H24.02" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </svg>
            </div>

            {/* Title */}
            <p className="font-['IBM_Plex_Sans_Thai',sans-serif] font-bold text-[20px] leading-[28px] text-[#1e2939] text-center mt-4 px-6">
              ยืนยันการอนุมัติทุน
            </p>

            {/* Description */}
            <p className="font-['IBM_Plex_Sans_Thai',sans-serif] text-[14px] leading-[20px] text-[#6a7282] text-center mt-3 px-6">
              คุณต้องการเปลี่ยนสถานะจาก "รอพิจารณา" เป็น "อนุมัติ" หรือไม่?
            </p>

            {/* Buttons */}
            <div className="flex gap-4 items-center justify-center px-6 pt-5 pb-6">
              <button
                onClick={() => setShowApproveConfirm(false)}
                className="bg-[#fb2c36] h-[40px] rounded-[14px] px-5 flex items-center justify-center active:scale-95 transition-all"
              >
                <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[14px] text-white whitespace-nowrap">ยกเลิก</span>
              </button>
              <button
                onClick={handleApproveConfirm}
                className="bg-[#28c76f] h-[40px] rounded-[14px] shadow-[0px_10px_15px_0px_#b9f8cf,0px_4px_6px_0px_#b9f8cf] px-5 flex items-center justify-center active:scale-95 transition-all"
              >
                <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[14px] text-white whitespace-nowrap">ยืนยัน</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Reject Reason Modal (Step 2) ═══ */}
      {showRejectReason && (
        <div className="fixed inset-0 z-[60000] flex items-center justify-center bg-black/40 animate-in fade-in duration-200 p-6">
          <div className="bg-white relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] w-[300px] animate-in zoom-in-95 duration-200">
            {/* X close button */}
            <button 
              onClick={() => { setShowRejectReason(false); setRejectReason(''); }}
              className="absolute right-[15px] top-[15px] w-[24px] h-[24px] flex items-center justify-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M6 6L18 18" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            {/* Icon */}
            <div className="flex justify-center pt-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <FileText className="text-[#fb2c36]" size={24} />
              </div>
            </div>

            {/* Title */}
            <p className="font-['IBM_Plex_Sans_Thai',sans-serif] font-bold text-[20px] leading-[28px] text-[#1e2939] text-center mt-4 px-6">
              ระบุเหตุผลการปฏิเสธ
            </p>

            {/* Description */}
            <p className="font-['IBM_Plex_Sans_Thai',sans-serif] text-[14px] leading-[20px] text-[#6a7282] text-center mt-2 px-6">
              กรุณาระบุเหตุผลในการปฏิเสธคำขอทุนนี้
            </p>

            {/* Reject Reason Input */}
            <div className="px-6 mt-4">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="กรุณาระบุเหตุผลในการปฏิเสธ..."
                className="w-full h-[100px] p-3 border border-[#e5e7eb] rounded-[14px] text-[14px] text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none font-['IBM_Plex_Sans_Thai',sans-serif]"
                autoFocus
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 items-center justify-center px-6 pt-4 pb-6">
              <button
                onClick={() => { setShowRejectReason(false); setRejectReason(''); }}
                className="bg-[#fb2c36] h-[40px] rounded-[14px] px-5 flex items-center justify-center active:scale-95 transition-all"
              >
                <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[14px] text-white whitespace-nowrap">ยกเลิก</span>
              </button>
              <button
                onClick={handleRejectConfirm}
                className="bg-[#28c76f] h-[40px] rounded-[14px] shadow-[0px_10px_15px_0px_#b9f8cf,0px_4px_6px_0px_#b9f8cf] px-5 flex items-center justify-center active:scale-95 transition-all"
              >
                <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[14px] text-white whitespace-nowrap">ยืนยันปฏิเสธ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};