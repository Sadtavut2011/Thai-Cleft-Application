import React from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  User, 
  Activity,
  History,
  Paperclip,
  Coins
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import { cn } from "../../../../components/ui/utils";

// --- Types ---
export type FundStatus = 'Pending' | 'Approved' | 'Rejected' | 'Received' | 'Disbursed';
export type UrgencyLevel = 'Normal' | 'Urgent' | 'Emergency';

export interface FundRequest {
  id: string;
  patientName: string;
  hn: string;
  diagnosis: string;
  fundType: string;
  amount: number;
  requestDate: string;
  urgency: UrgencyLevel;
  hospital: string;
  status: FundStatus;
  rejectReason?: string;
  documents: string[];
  history: { date: string; action: string; user: string }[];
  receiptUrl?: string;
}

interface FundDetailMobileProps {
  request: FundRequest;
  onBack: () => void;
  onApprove?: (req: FundRequest) => void;
  onReject?: () => void;
}

export function FundDetailMobile({ request, onBack, onApprove, onReject }: FundDetailMobileProps) {
  const UrgencyBadge = ({ level }: { level: string }) => {
    const colors: any = {
      Normal: "bg-[#F4F0FF] text-[#7066A9] border-[#E3E0F0]",
      Urgent: "bg-amber-50 text-amber-700 border-amber-100",
      Emergency: "bg-rose-50 text-rose-700 border-rose-100",
    };
    const labels: any = { Normal: 'ปกติ', Urgent: 'เร่งด่วน', Emergency: 'วิกฤต/เร่งด่วนที่สุด' };
    return <Badge variant="outline" className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider", colors[level])}>{labels[level]}</Badge>;
  };

  const StatusBadge = ({ status }: { status: FundStatus }) => {
    const colors: any = {
      Pending: "bg-amber-100 text-amber-700",
      Approved: "bg-blue-100 text-blue-700",
      Rejected: "bg-rose-100 text-rose-700",
      Received: "bg-[#E3E0F0] text-[#49358E]",
      Disbursed: "bg-emerald-100 text-emerald-700",
    };
    const labels: any = {
      Pending: "รอพิจารณา",
      Approved: "อนุมัติแล้ว",
      Rejected: "ปฏิเสธ",
      Received: "ได้รับเงินแล้ว",
      Disbursed: "จ่ายเงินแล้ว",
    };
    return <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", colors[status])}>{labels[status]}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-[#F4F0FF]/40 font-sans">
      <style>
        {`
          .fixed.bottom-0.z-50 {
            display: none !important;
          }
        `}
      </style>
      {/* Header - Purple */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-white text-lg font-bold">รายละเอียดทุน</h1>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Patient & Request Info Card */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#F4F0FF] bg-[#F4F0FF]/50 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <User size={16} className="text-[#49358E]" />
                <span className="text-xs font-bold text-[#37286A]">ข้อมูลผู้ป่วย</span>
             </div>
             <UrgencyBadge level={request.urgency} />
          </div>
          <div className="p-4 space-y-3">
             <div className="flex justify-between">
                <span className="text-xs text-[#7066A9] font-medium">ชื่อ-นามสกุล</span>
                <span className="text-xs text-[#37286A] font-bold">{request.patientName}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-xs text-[#7066A9] font-medium">HN</span>
                <span className="text-xs text-[#37286A] font-bold">{request.hn}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-xs text-[#7066A9] font-medium">โรงพยาบาล</span>
                <span className="text-xs text-[#37286A] font-bold">{request.hospital}</span>
             </div>
             <Separator className="my-2 bg-[#E3E0F0]" />
             <div className="bg-[#F4F0FF] p-3 rounded-lg border border-[#E3E0F0]">
                <div className="flex justify-between items-center mb-2">
                   <div className="flex items-center gap-2">
                      <Coins size={14} className="text-[#49358E]" />
                      <span className="text-[10px] font-bold text-[#49358E] uppercase">ยอดเงินที่ขอ</span>
                   </div>
                   <span className="text-lg font-black text-[#49358E]">฿{request.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start">
                   <span className="text-[10px] text-[#7066A9] font-medium">แหล่งทุน:</span>
                   <span className="text-[10px] text-[#37286A] font-bold text-right max-w-[150px]">{request.fundType}</span>
                </div>
             </div>
          </div>
        </Card>

        {/* Diagnosis Card */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
           <div className="p-4 border-b border-[#F4F0FF] bg-[#F4F0FF]/50 flex items-center gap-2">
              <Activity size={16} className="text-[#49358E]" />
              <span className="text-xs font-bold text-[#37286A]">การวินิจฉัย / เหตุผล</span>
           </div>
           <div className="p-4">
              <p className="text-xs text-[#37286A] leading-relaxed font-medium">
                 {request.diagnosis}
              </p>
           </div>
        </Card>

        {/* Documents Card */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
           <div className="p-4 border-b border-[#F4F0FF] bg-[#F4F0FF]/50 flex items-center gap-2">
              <Paperclip size={16} className="text-[#49358E]" />
              <span className="text-xs font-bold text-[#37286A]">เอกสารประกอบ ({request.documents.length})</span>
           </div>
           <div className="p-2 space-y-2">
              {request.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E3E0F0] shadow-sm">
                      <div className="flex items-center gap-3">
                          <div className="bg-[#F4F0FF] p-2 rounded-lg text-[#7066A9]">
                              <FileText size={16} />
                          </div>
                          <div className="flex flex-col">
                              <span className="text-xs font-bold text-[#37286A] truncate max-w-[180px]">{doc}</span>
                              <span className="text-[9px] text-[#7066A9] font-bold uppercase">PDF File</span>
                          </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#49358E] hover:bg-[#F4F0FF]">
                          <Eye size={16} />
                      </Button>
                  </div>
              ))}
           </div>
        </Card>

        {/* Timeline */}
        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden mb-6">
             <div className="p-4 border-b border-[#F4F0FF] bg-[#F4F0FF]/50 flex items-center gap-2">
                <History size={16} className="text-[#49358E]" />
                <span className="text-xs font-bold text-[#37286A]">ประวัติการดำเนินการ</span>
             </div>
             <div className="p-4 relative pl-6 space-y-6">
                 <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-[#E3E0F0]"></div>
                 {request.history.map((item, idx) => (
                     <div key={idx} className="relative flex gap-4 z-10">
                         <div className={cn(
                             "w-3 h-3 rounded-full border-2 mt-1 shrink-0 bg-white",
                             idx === request.history.length - 1 ? "border-[#49358E] bg-[#F4F0FF]" : "border-[#D2CEE7]"
                         )}></div>
                         <div className="flex-1">
                             <p className="text-xs font-bold text-[#37286A]">{item.action}</p>
                             <div className="flex justify-between items-center mt-1">
                                 <span className="text-[10px] text-[#7066A9] flex items-center gap-1">
                                    <User size={10} /> {item.user}
                                 </span>
                                 <span className="text-[10px] text-[#7066A9] font-medium bg-[#F4F0FF] px-1.5 py-0.5 rounded">
                                     {item.date.split(' ')[0]}
                                 </span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        </Card>
      </div>

      {/* Footer Actions */}
      {(request.status === 'Pending' || request.status === 'Rejected' || request.status === 'Approved' || request.status === 'Disbursed') && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E3E0F0] p-4 pb-8 shadow-[0_-5px_20px_rgba(73,53,142,0.08)] flex gap-3 z-30">
            {request.status === 'Pending' && (
                <>
                    <Button 
                        variant="outline" 
                        onClick={onReject}
                        className="flex-1 h-12 border-rose-200 text-rose-600 font-bold rounded-xl bg-rose-50 hover:bg-rose-100 hover:text-rose-700"
                    >
                        <XCircle size={18} className="mr-2" /> ปฏิเสธ
                    </Button>
                    <Button 
                        onClick={() => onApprove && onApprove(request)}
                        className="flex-[2] h-12 bg-[#49358E] hover:bg-[#37286A] text-white font-bold rounded-xl shadow-lg shadow-[#49358E]/20"
                    >
                        <CheckCircle2 size={18} className="mr-2" /> อนุมัติทุน
                    </Button>
                </>
            )}

            {request.status === 'Rejected' && (
                <div className="w-full h-12 flex items-center justify-center bg-rose-50 rounded-xl border border-rose-100 text-rose-600 font-bold">
                    <XCircle size={18} className="mr-2" /> รายการนี้ถูกปฏิเสธ
                </div>
            )}

            {request.status === 'Approved' && (
                <div className="w-full h-12 flex items-center justify-center bg-[#F4F0FF] rounded-xl border border-[#E3E0F0] text-[#49358E] font-bold">
                    <Clock size={18} className="mr-2" /> รอเอกสาร
                </div>
            )}

            {request.status === 'Disbursed' && (
                <div className="w-full h-12 flex items-center justify-center bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600 font-bold">
                    <CheckCircle2 size={18} className="mr-2" /> เสร็จสิ้น
                </div>
            )}
        </div>
      )}
    </div>
  );
}