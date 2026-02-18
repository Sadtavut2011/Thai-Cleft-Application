import React from 'react';
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
  ThumbsDown
} from 'lucide-react';
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";

interface MutualFundDetailProps {
  fund: any;
  onBack: () => void;
}

export const MutualFundDetail: React.FC<MutualFundDetailProps> = ({ fund, onBack }) => {
  if (!fund) return null;

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
    if (s === 'rejected' || s === 'ปฎิเสธ' || s === 'rejected') {
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
          <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดกองทุน</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto p-4 pb-24 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* Approved Date Banner (Reference: VisitDetail green box pattern) */}
        {fund.status === 'Approved' && approvedDT && (
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

        {/* Rejected Date Banner */}
        {fund.status === 'Rejected' && rejectedDT && (
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

        {/* Patient Info Card with Status Badge */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm shrink-0 overflow-hidden">
                 <img 
                    src={fund.patientImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                    alt={fund.patientName}
                    className="w-full h-full object-cover" 
                 />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-base">{fund.patientName || 'ไม่ระบุชื่อ'}</h3>
                <p className="text-sm text-slate-500">HN: {fund.patientId || '-'}</p>
            </div>
            <div className="ml-auto">
                {renderStatusBadge(fund.status)}
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
                    <p className="font-bold text-blue-600 text-lg">{fund.type || fund.reason || 'ไม่ระบุ'}</p>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-sm text-slate-400 text-[16px]">โรงพยาบาล</span>
                        <span className="font-semibold text-[18px] text-[#5e5873]">{fund.hospital || '-'}</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                        <span className="text-sm text-slate-400 text-[16px]">วันที่ยื่นเรื่อง</span>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-400 shrink-0" />
                            <span className="font-semibold text-[18px] text-[#5e5873]">{fund.requestDate || '-'}</span>
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
                        {fund.reason || "ไม่มีรายละเอียด"}
                    </div>
                </div>
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
            </div>
        </div>

      </div>
    </div>
  );
};