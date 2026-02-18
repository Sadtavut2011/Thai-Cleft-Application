import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { Badge } from "../../../../../components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription, DrawerTrigger, DrawerClose } from "../../../../../components/ui/drawer";
import { Textarea } from "../../../../../components/ui/textarea";
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


const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const formatThaiFullDate = (d: Date) => `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
const formatTime = (d: Date) => `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;

import { AcceptReferralDialog } from "../components/AcceptReferralDialog";

interface ReferralDetailProps {
    referral: any;
    onBack: () => void;
    onExit?: () => void;
    initialHN?: string;
    onAccept: (id: number, date?: Date, details?: string) => void;
    onReject: (id: number) => void;
}

export const ReferralDetail: React.FC<ReferralDetailProps> = ({
    referral,
    onBack,
    onExit,
    initialHN,
    onAccept,
    onReject
}) => {
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const STATUS_LABELS: Record<string, string> = {
        'Accepted': 'ยอมรับแล้ว',
        'accepted': 'ยอมรับแล้ว',
        'Pending': 'รอการตอบรับ',
        'pending': 'รอการตอบรับ',
        'Rejected': 'ปฏิเสธ',
        'rejected': 'ปฏิเสธ',
        'NotTreated': 'ยังไม่ได้รับการรักษา',
        'nottreated': 'ยังไม่ได้รับการรักษา',
        'Treated': 'รักษาแล้ว',
        'treated': 'รักษาแล้ว',
        'Referred': 'ส่งตัวแล้ว',
        'referred': 'ส่งตัวแล้ว',
        'Waiting': 'รอรับบริการ'
    };

    const getStatusColor = (status: string) => {
        const s = status?.toLowerCase();
        switch(s) {
            case 'accepted': 
                return 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-none';
            case 'referred':
                return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-none';
            case 'pending': return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-none';
            case 'rejected': return 'bg-red-100 text-red-700 hover:bg-red-100 border-none';
            case 'nottreated': return 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-none';
            case 'treated': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none';
            default: return 'bg-gray-100 text-gray-700';
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

                {referral.acceptedDate && (
                    <div className="bg-green-50/50 border border-green-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center animate-in fade-in slide-in-from-top-2">
                        <Label className="text-green-800/70 text-xs font-normal mb-1 block flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            วันนัดหมาย (ตอบรับ)
                        </Label>
                        <div className="font-bold text-green-700 text-lg">
                            {formatThaiFullDate(new Date(referral.acceptedDate))} 
                            <span className="text-green-600/60 text-sm font-normal ml-2">เวลา {formatTime(new Date(referral.acceptedDate))} น.</span>
                        </div>
                    </div>
                )}

                {referral.status === 'Rejected' && (
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
                            <div className="flex gap-3">
                                <Drawer open={isRejectOpen} onOpenChange={(open) => {
                                    setIsRejectOpen(open);
                                    if (open) setRejectReason('');
                                }}>
                                    <DrawerTrigger asChild>
                                        <Button variant="outline" className="flex-1 h-11 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-xl">
                                            ปฎิเสธคำขอ
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="z-[50000]">
                                        <DrawerHeader>
                                            <DrawerTitle className="text-red-600 flex items-center justify-center gap-2 pt-4 text-xl">
                                                <AlertTriangle className="h-6 w-6" />
                                                ยืนยันการปฎิเสธคำขอ
                                            </DrawerTitle>
                                            <DrawerDescription className="text-center px-4 text-gray-500">
                                                การปฎิเสธคำขอส่งตัว จะทำให้สถานะเปลี่ยนเป็น "ปฎิเสธ" และไม่สามารถดำเนินการต่อได้
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="px-6 py-4">
                                            <div className="grid gap-2">
                                                <Label className="text-red-500 font-medium">
                                                    เหตุผลการปฎิเสธ *
                                                </Label>
                                                <Textarea
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    placeholder="ระบุสาเหตุที่ต้องการยกเลิก..."
                                                    className="min-h-[120px] border-red-200 focus:border-red-400 focus:ring-red-100 bg-red-50/10 text-base"
                                                />
                                            </div>
                                        </div>
                                        <DrawerFooter className="px-6 pb-8 pt-2">
                                            <div className="flex flex-col gap-3 w-full">
                                                <Button 
                                                    variant="destructive" 
                                                    className="w-full h-12 text-base bg-red-600 hover:bg-red-700 shadow-md shadow-red-100"
                                                    onClick={() => {
                                                        if(rejectReason.trim()) {
                                                            onReject(referral.id);
                                                            setIsRejectOpen(false);
                                                        } else {
                                                            toast.error("กรุณาระบุเหตุผล");
                                                        }
                                                    }}
                                                >
                                                    ยืนยันการปฎิเสธ
                                                </Button>
                                                <DrawerClose asChild>
                                                    <Button variant="outline" className="w-full h-12 text-base border-gray-200 text-gray-700 hover:bg-gray-50">กลับ</Button>
                                                </DrawerClose>
                                            </div>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>

                                <AcceptReferralDialog 
                                    referralId={referral.id}
                                    onAccept={onAccept}
                                    trigger={
                                        <Button className="flex-1 h-11 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl shadow-md shadow-green-100">
                                            <CheckCircle2 className="mr-2 h-5 w-5" /> ยอมรับการส่งตัว
                                        </Button>
                                    }
                                />
                            </div>
                            ) : null
                        )}
                        
                        <Button variant="outline" className="w-full h-11 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl">
                            <Printer className="mr-2 h-4 w-4" /> พิมพ์ใบส่งตัว
                        </Button>
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
                                          formatThaiFullDate(new Date(referral.referralDate)) :
                                          'ไม่ได้ระบุ'
                                        } 
                                        {referral.referralDate && (
                                          <span className="text-slate-400"> เวลา {formatTime(new Date(referral.referralDate))} น.</span>
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