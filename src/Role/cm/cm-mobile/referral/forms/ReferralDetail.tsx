import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { Badge } from "../../../../../components/ui/badge";
import { TopHeader } from '../../../../../components/shared/layout/TopHeader';
import { 
  Calendar as CalendarIcon, 
  AlertTriangle,
  FileText,
  Printer,
  ChevronLeft,
  CheckCircle2
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { AcceptReferralDialog } from "../components/AcceptReferralDialog";
import { RejectedReferralDialog } from "../components/RejectedReferralDialog";

interface ReferralDetailProps {
    referral: any;
    onBack: () => void;
    onExit?: () => void;
    initialHN?: string;
    onAccept: (id: number, date?: Date, details?: string) => void;
    onReject: (id: number, reason?: string) => void;
}

export const ReferralDetail: React.FC<ReferralDetailProps> = ({
    referral,
    onBack,
    onExit,
    initialHN,
    onAccept,
    onReject
}) => {
    const STATUS_LABELS: Record<string, string> = {
        'Accepted': 'อนุมัติ',
        'accepted': 'อนุมัติ',
        'Pending': 'รอการตอบรับ',
        'pending': 'รอการตอบรับ',
        'Rejected': 'ปฏิเสธ',
        'rejected': 'ปฏิเสธ',
    };

    const getStatusColor = (status: string) => {
        const s = status?.toLowerCase();
        switch(s) {
            case 'accepted': 
                return 'bg-green-100 text-green-700 hover:bg-green-100 border-none';
            case 'pending': 
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none';
            case 'rejected': 
                return 'bg-red-100 text-red-700 hover:bg-red-100 border-none';
            default: 
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (!referral) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#f8f9fa] h-[100dvh] flex flex-col w-full font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="flex flex-col shrink-0 bg-[#7066a9]">
                <TopHeader />
                <div className="h-[64px] px-4 flex items-center gap-3 z-20">
                    <button onClick={() => {
                        if (initialHN && onExit) {
                            onExit();
                        } else {
                            onBack();
                        }
                    }} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-white text-lg font-bold">รายละเอียดการส่งตัว</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 space-y-4 no-scrollbar">
                {/* Referral ID */}
                <div className="text-slate-600 font-semibold text-sm pl-1">
                    {referral.referralNo}
                </div>

                {/* Appointment Card - Show for Accepted status */}
                {(referral.status === 'Accepted' || referral.status === 'accepted') && (
                    <div className="bg-green-50/50 border border-green-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center animate-in fade-in slide-in-from-top-2">
                        <Label className="text-green-800/70 text-xs font-normal mb-1 block flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            วันนัดหมาย (ตอบรับ)
                        </Label>
                        <div className="font-bold text-green-700 text-lg">
                            {/* Prefer appointmentDate, fallback to acceptedDate, or a default date for display if missing in mock */}
                            {format(new Date(referral.appointmentDate || referral.acceptedDate || new Date()), "d MMMM yyyy", { locale: th })} 
                            <span className="text-green-600/60 text-sm font-normal ml-2">
                                เวลา {format(new Date(referral.appointmentDate || referral.acceptedDate || new Date()), "HH:mm", { locale: th })} น.
                            </span>
                        </div>
                    </div>
                )}

                {/* Rejection Reason Card - Show for Rejected status */}
                {(referral.status === 'Rejected' || referral.status === 'rejected') && (
                    <div className="bg-red-50/50 border border-red-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center animate-in fade-in slide-in-from-top-2">
                        <Label className="text-red-800/70 text-xs font-normal mb-1 block flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            เหตุผลการปฎิเสธ
                        </Label>
                        <div className="font-bold text-red-700 text-lg">
                            {referral.logs?.find((l: any) => l.status === 'Rejected')?.description?.replace('ปฏิเสธ: ', '') || 'ไม่ระบุเหตุผล'}
                        </div>
                    </div>
                )}

                {/* Patient Card */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-6 right-6">
                            <Badge className={cn("px-3 py-1 text-xs font-normal", getStatusColor(referral.status))}>
                                {STATUS_LABELS[referral.status] || referral.status}
                            </Badge>
                        </div>

                        <div className="pr-24 mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex flex-wrap items-baseline gap-2">
                                {referral.patientName} 
                                <span className="text-slate-400 font-normal text-sm whitespace-nowrap">(HN: {referral.patientHn || referral.hn})</span>
                            </h2>
                            <div className="text-slate-500 mt-1 text-sm">
                                ส่งต่อไปยัง: <span className="text-slate-800 font-medium">{referral.destinationHospital}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            {(referral.status === 'Pending' || referral.status === 'pending') && (
                                referral.type === 'Refer In' ? (
                                    createPortal(
                                        <div className="shrink-0 px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] bg-white shadow-[0_-8px_30px_-8px_rgba(0,0,0,0.1)] z-[10000] flex gap-3 fixed bottom-0 left-0 w-full rounded-t-[24px]">
                                            <div className="flex-1 min-w-0">
                                                <RejectedReferralDialog 
                                                    onConfirm={(reason) => onReject(referral.id, reason)}
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
                                        </div>,
                                        document.body
                                    )
                                ) : null
                            )}
                            
                            <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl">
                                <Printer className="mr-2 h-4 w-4" /> พิมพ์ใบส่งตัว
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-6 text-[#7066a9]">
                        <FileText className="h-6 w-6" />
                        <h3 className="font-bold text-lg text-slate-800">รายละเอียดการส่งตัว</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                                <div className="mb-4">
                                    <Label className="text-slate-400 text-xs font-normal mb-1 block">วันที่ส่งเรื่อง</Label>
                                    <div className="font-medium text-slate-800 text-base">
                                        {referral.referralDate ? 
                                          format(new Date(referral.referralDate), "d MMMM yyyy", { locale: th }) :
                                          'ไม่ได้ระบุ'
                                        } 
                                        {referral.referralDate && (
                                          <span className="text-slate-400"> เวลา {format(new Date(referral.referralDate), "HH:mm", { locale: th })} น.</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="sm:text-right">
                                <Label className="text-slate-400 text-xs font-normal mb-1 block">ความเร่งด่วน</Label>
                                <div className={cn("font-bold text-base", 
                                    referral.urgency === 'Emergency' ? 'text-red-500' :
                                    referral.urgency === 'Urgent' ? 'text-orange-500' : 'text-slate-700'
                                )}>
                                    {referral.urgency}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label className="text-slate-400 text-xs font-normal mb-1 block">การวินิจฉัย (DIAGNOSIS)</Label>
                            <div className="font-medium text-slate-800 text-lg">
                                {referral.diagnosis || '-'}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <Label className="text-slate-400 text-xs font-normal mb-2 block">เหตุผล / รายละเอียดเพิ่มเติม</Label>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                {referral.reason || '-'}
                            </p>
                        </div>

                        <div>
                            <Label className="text-slate-400 text-xs font-normal mb-3 block">เอกสารแนบ ({referral.documents?.length || 0})</Label>
                             <div className="flex flex-col gap-2">
                                 {referral.documents && referral.documents.length > 0 ? (
                                    referral.documents.map((doc: string, i: number) => (
                                       <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                                  <FileText className="w-5 h-5" />
                                              </div>
                                              <span className="text-sm font-medium text-slate-700">{doc}</span>
                                          </div>
                                       </div>
                                    ))
                                 ) : (
                                    <div className="text-slate-400 text-sm italic">- ไม่มีเอกสารแนบ -</div>
                                 )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};