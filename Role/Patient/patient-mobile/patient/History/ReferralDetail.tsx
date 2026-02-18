import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Home, 
  Send,
  FileText,
  CheckCircle,
  Building
} from 'lucide-react';
import { StatusBarIPhone16Main } from "../../../../../../components/shared/layout/TopHeader";

interface ReferralDetailProps {
  referral: any;
  patient: any;
  onBack: () => void;
}

export const ReferralDetail: React.FC<ReferralDetailProps> = ({ referral, patient, onBack }) => {
  if (!referral) return null;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 fixed inset-0 z-[50000] overflow-hidden">
      
      {/* Header */}
      <div className="bg-white shrink-0 z-20 shadow-sm">
        <StatusBarIPhone16Main />
        <div className="h-[64px] px-4 flex items-center gap-3">
          <button onClick={onBack} className="text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-slate-800 text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดการส่งตัว</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto p-4 pb-24 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* Patient Info Summary */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {patient?.name ? patient.name.charAt(0) : <User size={24} />}
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-base">{patient?.name || 'ไม่ระบุชื่อ'}</h3>
                <p className="text-sm text-slate-500">HN: {patient?.hn || '-'}</p>
            </div>
        </div>

        {/* Date & Route Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-end mb-2">
                 <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    <CheckCircle size={12} /> {referral.status === 'accepted' ? 'อนุมัติแล้ว' : referral.status}
                </span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
                <Calendar className="text-[#7066a9]" size={20} />
                <div>
                    <span className="text-xs text-slate-400 block">วันที่ส่งตัว</span>
                    <span className="font-semibold">{referral.date}</span>
                </div>
            </div>
            <div className="w-full h-[1px] bg-slate-100"></div>
            
            <div className="flex items-start justify-between gap-2">
                 <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                     <span className="text-xs text-slate-400">ต้นทาง</span>
                     <div className="flex items-center gap-2">
                         <Building size={16} className="text-slate-400 shrink-0" />
                         <span className="font-semibold text-sm truncate">{referral.from}</span>
                     </div>
                 </div>
                 <div className="flex items-center justify-center pt-6 px-1">
                     <ArrowLeft size={18} className="text-slate-300 rotate-180" />
                 </div>
                 <div className="flex-1 flex flex-col gap-1 items-end overflow-hidden">
                     <span className="text-xs text-slate-400">ปลายทาง</span>
                     <div className="flex items-center gap-2">
                         <span className="font-semibold text-sm truncate">{referral.to}</span>
                         <Building size={16} className="text-blue-500 shrink-0" />
                     </div>
                 </div>
            </div>

            <div className="w-full h-[1px] bg-slate-100"></div>
            <div className="flex items-center gap-3 text-slate-700">
                <User className="text-[#7066a9]" size={20} />
                <div>
                    <span className="text-xs text-slate-400 block">แพทย์เจ้าของไข้</span>
                    <span className="font-semibold">{referral.doctor || '-'}</span>
                </div>
            </div>
        </div>

        {/* Referral Info */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Send className="text-[#7066a9]" size={22} />
                <h3 className="font-bold text-lg text-slate-800">ข้อมูลการส่งต่อ</h3>
            </div>
            
            <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-600">เรื่อง / การวินิจฉัย</span>
                <p className="text-slate-800 font-medium bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    {referral.title || '-'}
                </p>
            </div>

            <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-600">เหตุผลการส่งต่อ</span>
                <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                   ผู้ป่วยมีภาวะปากแหว่งเพดานโหว่ ต้องการการประเมินและวางแผนการผ่าตัดร่วมกับศัลยแพทย์ตกแต่งและกุมารแพทย์
                   {/* Note: This is hardcoded mock data as per PatientHistoryTab.tsx logic */}
                </p>
            </div>

             <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-sm font-semibold text-slate-400 flex items-center gap-1">
                     <FileText size={14} /> เลขที่ใบส่งตัว
                </span>
                <p className="text-slate-600 text-sm font-mono">
                   REF-6701-100X
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
