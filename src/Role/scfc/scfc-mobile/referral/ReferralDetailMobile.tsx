import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building2,
  Ambulance,
  Phone,
  MoreHorizontal
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";

// Re-using types from the main system file (we will define them there or share)
// For now, I'll define a local interface matching the mock data structure
export interface ReferralCase {
  id: string;
  patientName: string;
  hn: string;
  sourceHospital: string;
  destHospital: string;
  status: string;
  urgency: 'ปกติ' | 'เร่งด่วน' | 'ฉุกเฉิน';
  requestDate: string;
  responseTime?: string; 
  isBottleneck: boolean;
  history: { date: string; action: string; user: string }[];
}

interface ReferralDetailMobileProps {
  referral: ReferralCase;
  onBack: () => void;
}

export function ReferralDetailMobile({ referral, onBack }: ReferralDetailMobileProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'ฉุกเฉิน': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'เร่งด่วน': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-teal-50 text-teal-600 border-teal-100';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
        {/* Header */}
        <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">รายละเอียดการส่งตัว</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{referral.id}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400">
                <MoreHorizontal size={20} />
            </Button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1 pb-20">
            {/* Status Card */}
            <Card className="p-4 border-slate-200 shadow-sm bg-white rounded-xl">
                <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", getUrgencyColor(referral.urgency))}>
                        {referral.urgency}
                    </Badge>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">สถานะ</span>
                        <span className="text-sm font-black text-slate-800">{referral.status}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative">
                     <div className="flex-1 text-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                         <p className="text-[10px] text-slate-500 font-medium mb-1 truncate">{referral.sourceHospital}</p>
                         <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-sm">
                             <Building2 size={16} />
                         </div>
                     </div>
                     
                     <div className="text-slate-300">
                         <ArrowLeft className="rotate-180" size={24} />
                     </div>

                     <div className="flex-1 text-center p-3 bg-teal-50 rounded-lg border border-teal-100">
                         <p className="text-[10px] text-teal-600 font-bold mb-1 truncate">{referral.destHospital}</p>
                         <div className="w-8 h-8 rounded-full bg-white border border-teal-200 flex items-center justify-center mx-auto text-teal-600 shadow-sm">
                             <Building2 size={16} />
                         </div>
                     </div>
                </div>
            </Card>

            {/* Patient Info */}
            <Card className="p-4 border-slate-200 shadow-sm bg-white rounded-xl">
                 <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-teal-600" /> ข้อมูลผู้ป่วย
                 </h3>
                 <div className="space-y-3">
                     <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span className="text-xs text-slate-500 font-medium">ชื่อ-นามสกุล</span>
                         <span className="text-xs text-slate-800 font-bold">{referral.patientName}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-50 pb-2">
                         <span className="text-xs text-slate-500 font-medium">HN</span>
                         <span className="text-xs text-slate-800 font-bold">{referral.hn}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-xs text-slate-500 font-medium">วันที่ส่งเรื่อง</span>
                         <span className="text-xs text-slate-800 font-bold">{referral.requestDate}</span>
                     </div>
                 </div>
            </Card>

            {/* Timeline */}
            <Card className="p-4 border-slate-200 shadow-sm bg-white rounded-xl">
                 <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-teal-600" /> ประวัติการดำเนินการ
                 </h3>
                 <div className="space-y-4 relative pl-2">
                     {/* Vertical Line */}
                     <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                     {referral.history.map((item, idx) => (
                         <div key={idx} className="relative flex gap-3">
                             <div className="w-5 h-5 rounded-full bg-white border-2 border-teal-500 z-10 shrink-0"></div>
                             <div className="flex-1">
                                 <p className="text-xs font-bold text-slate-800">{item.action}</p>
                                 <div className="flex justify-between items-center mt-1">
                                     <span className="text-[10px] text-slate-500">{item.user}</span>
                                     <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{item.date.split(' ')[1]}</span>
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
            </Card>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] flex gap-3 z-30">
            <Button variant="outline" className="flex-1 h-11 border-slate-200 text-slate-600 font-bold rounded-xl bg-white">
                <Phone size={16} className="mr-2" /> ติดต่อ
            </Button>
            <Button className="flex-1 h-11 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20">
                <Ambulance size={16} className="mr-2" /> ดำเนินการ
            </Button>
        </div>
    </div>
  );
}
