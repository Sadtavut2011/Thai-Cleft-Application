import React, { useState } from 'react';
import { ChevronLeft, Clock, FileText, MapPin, Navigation, CheckCircle, AlertTriangle } from 'lucide-react';
import { RejectedReferralDialog } from '../../../cm/cm-mobile/referral/components/RejectedReferralDialog';
import { AcceptReferralDialog } from '../../../cm/cm-mobile/referral/components/AcceptReferralDialog';
import { HomeVisitForm } from './forms/VisitForm';

export function HomeVisitF1({ onClose, status = 'recheck' }: { onClose: () => void, status?: 'recheck' | 'pending' | 'completed' }) {
    const [isAccepted, setIsAccepted] = useState(false);
    const [showVisitForm, setShowVisitForm] = useState(false);

    if (showVisitForm) {
        return (
            <div className="fixed inset-0 z-[200] bg-white">
                <HomeVisitForm
                    onBack={() => setShowVisitForm(false)}
                    onSave={(data) => {
                        setShowVisitForm(false);
                        onClose();
                    }}
                />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex flex-col font-['IBM_Plex_Sans_Thai']">
            <style>{`
        #mobile-bottom-navigation {
          display: none !important;
        }
      `}</style>
            {/* Header */}
            <div className="pt-[60px] pb-4 px-4 flex items-center gap-3 shrink-0 bg-[#7066a9] shadow-md sticky top-0 z-10">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 hover:bg-white/20 rounded-full transition-colors text-white"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold text-white">ระบบเยี่ยมบ้าน</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Main Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    {/* Patient Header */}
                    <div className="mb-5">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-[20px] font-bold text-[#1E2939] leading-tight">สมชาย แข็งแรง</h2>
                            {status === 'pending' ? (
                                <span className="bg-[#ffedd4] text-[#9f2d00] text-[12px] font-bold px-3 py-1 rounded-full shrink-0">ดำเนินการ</span>
                            ) : status === 'completed' ? (
                                <span className="bg-[#84e1bc] text-[#0e9f6e] text-[12px] font-bold px-3 py-1 rounded-full shrink-0">เสร็จสิ้น</span>
                            ) : (
                                <span className="bg-[#F3E8FF] text-[#7E22CE] text-[12px] font-bold px-3 py-1 rounded-full shrink-0">Recheck</span>
                            )}
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span className="text-[14px]">แจ้งเมื่อ: 08:30</span>
                            </div>
                            <div className="text-[#7367F0] font-medium text-[14px]">
                                ประเภท: ฝากเยี่ยม
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100 my-5"></div>

                    {/* Symptoms */}
                    <div className="flex gap-4 mb-5">

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-[#1E2939] mb-2 text-[16px]">รายละเอียดคำร้อง</h3>
                            <div className="text-[#475569] text-[14px] leading-relaxed break-words flex flex-col gap-2">
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <span className="font-bold text-slate-700 block text-xs mb-0.5">การวินิจฉัย</span>
                                    <span>Cleft Lip and Palate (ปากแหว่งเพดานโหว่)</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <span className="font-bold text-slate-700 block text-xs mb-0.5">สิ่งที่ต้องการให้ช่วยเหลือ</span>
                                    <span>รบกวนติดตามอาการหลังผ่าตัด ประเมินแผลกดทับ และแนะนำโภชนาการ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-[14px] bg-[#FEF2F2] flex items-center justify-center shrink-0">
                            <MapPin className="w-6 h-6 text-[#EF4444]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-[#1E2939] mb-1 text-[16px]">สถานที่</h3>
                            <p className="text-[#475569] text-[14px] leading-relaxed break-words">123 ม.1 ต.สุเทพ อ.เมือง จ.เชียงใหม่</p>
                        </div>
                    </div>
                </div>

                {/* Actions Header */}


                {/* Action Buttons */}
                <div className={`fixed bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 flex ${isAccepted || status === 'pending' || status === 'completed' ? 'flex-col' : 'flex-row'} gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]`}>
                    {status === 'pending' ? (
                        <button
                            onClick={() => setShowVisitForm(true)}
                            className="w-full bg-[#4C3C96] text-white h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-[#3b2e75] transition-colors active:scale-95 duration-200"
                        >
                            <FileText className="w-5 h-5" />
                            <span className="text-[14px]">กรอกฟอร์มเยี่ยมบ้าน</span>
                        </button>
                    ) : status === 'completed' ? (
                        <button
                            onClick={() => setShowVisitForm(true)}
                            className="w-full bg-white border border-[#0e9f6e] text-[#0e9f6e] h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-green-50 transition-colors active:scale-95 duration-200"
                        >
                            <FileText className="w-5 h-5" />
                            <span className="text-[14px]">แก้ไขผลการติดตาม</span>
                        </button>
                    ) : (
                        !isAccepted ? (
                            <>
                                <RejectedReferralDialog
                                    trigger={
                                        <button className="flex-1 bg-white border border-red-200 text-[#DC2626] h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-red-50 transition-colors active:scale-95 duration-200">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span className="text-[14px]">ปฎิเสธ</span>
                                        </button>
                                    }
                                    onConfirm={(reason) => {
                                        console.log("Rejected with reason:", reason);
                                        onClose();
                                    }}
                                />
                                <button
                                    onClick={() => setIsAccepted(true)}
                                    className="flex-1 bg-[#10b981] text-white h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-[#059669] transition-colors active:scale-95 duration-200"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-[14px]">ยืนยันรับงาน</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="w-full bg-[#F1F5F9] text-[#64748B] h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-[#E2E8F0] transition-colors active:scale-95 duration-200">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span className="text-[14px]">ไม่อนุญาตให้ลงพื้นที่</span>
                                </button>
                                <div className="flex gap-3 w-full">
                                    <button className="flex-1 bg-white border border-red-200 text-[#DC2626] h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-red-50 transition-colors active:scale-95 duration-200">
                                        <Navigation className="w-5 h-5 rotate-45 fill-current" />
                                        <span className="text-[14px]">ไม่อยู่ในพื้นที่</span>
                                    </button>
                                    <AcceptReferralDialog
                                        referralId={1}
                                        onAccept={(id, date, details) => {
                                            console.log("Accepted:", { id, date, details });
                                            onClose();
                                        }}
                                        trigger={
                                            <button className="flex-1 bg-[#10b981] text-white h-[48px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-sm hover:bg-[#059669] transition-colors active:scale-95 duration-200">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="text-[14px]">อยู่ในพื้นที่</span>
                                            </button>
                                        }
                                    />
                                </div>
                            </>
                        )
                    )}
                </div>



            </div>
        </div>
    );
}
