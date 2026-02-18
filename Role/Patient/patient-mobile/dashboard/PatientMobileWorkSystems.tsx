import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import RescheduleAppointmentView from './RescheduleAppointmentView';

interface AppointmentViewProps {
    patients: any[];
    setNewPatient: (patient: any) => void;
    setIsWalkInModalOpen: (isOpen: boolean) => void;
    handleDeletePatient: (id: number) => void;
    setEditingAppointment: (appointment: any) => void;
    setCurrentView: (view: string) => void;
    setSelectedHistoryPatient: (patient: any) => void;
    onSelectAppointment: (patient: any) => void;
    onViewDetail?: (patient: any) => void;
}

export default function AppointmentView({
    setCurrentView
}: AppointmentViewProps) {
    const [actionType, setActionType] = useState<'none' | 'reschedule' | 'cancel'>('none');

    if (actionType !== 'none') {
        return (
            <RescheduleAppointmentView 
                mode={actionType === 'cancel' ? 'cancel' : 'reschedule'}
                onBack={() => setActionType('none')}
                onConfirm={() => setActionType('none')}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] p-4 space-y-6 overflow-y-auto pb-24 md:pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Next Appointment Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#49358e]" />
                        นัดหมายถัดไป
                    </h2>
                    <span className="bg-[#F3F0FF] text-[#49358e] px-3 py-1 rounded-lg text-sm font-medium">
                        อีก 5 วัน
                    </span>
                </div>

                <div className="space-y-4">
                    {/* Existing Card */}
                    <div className="bg-[#F3F0FF] rounded-2xl p-4 shadow-sm border border-[#E9E4F5]">
                        <div className="flex gap-4">
                            <div className="bg-white rounded-xl w-[72px] h-[72px] flex flex-col items-center justify-center shrink-0 shadow-sm">
                                <span className="text-sm font-medium text-[#49358e]">ต.ค.</span>
                                <span className="text-2xl font-bold text-[#49358e]">15</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-slate-800 mb-1">ติดตามผลผ่าตัด</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                                    <Clock className="w-4 h-4 shrink-0" />
                                    09:00 - 10:30
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                    อาคารผู้ป่วยนอก ชั้น 2 รพ.มหาราชนครเชียงใหม่
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* New Tele-consult Card */}
                    <div className="bg-[#E0F2FE] rounded-2xl p-4 shadow-sm border border-[#BAE6FD]">
                        <div className="flex gap-4">
                            <div className="bg-white rounded-xl w-[72px] h-[72px] flex flex-col items-center justify-center shrink-0 shadow-sm">
                                <span className="text-sm font-medium text-[#0284C7]">ต.ค.</span>
                                <span className="text-2xl font-bold text-[#0284C7]">18</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-slate-800 mb-1">Tele-medicine</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                                    <Clock className="w-4 h-4 shrink-0" />
                                    14:00 - 14:30
                                </div>
                                <div className="text-xs text-slate-500 truncate">
                                    ปรึกษาแพทย์ผ่านระบบออนไลน์ (VDO Call)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule List Section */}
            <div>
                {/* Referral Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-4 text-slate-800">แจ้งเตือนส่งตัว</h2>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">ส่งตัวรักษานอกเขต</h3>
                                <p className="text-xs text-slate-500">ระบบส่งต่อผู้ป่วย (Referral System)</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <div className="font-semibold text-slate-700 text-sm">รพ.ฝาง</div>
                             <div className="flex flex-col items-center px-2">
                                <span className="text-[10px] text-slate-400 mb-1">ส่งไปที่</span>
                                <ChevronRight className="w-4 h-4 text-blue-500" />
                             </div>
                             <div className="font-semibold text-blue-700 text-sm text-right">รพ.เชียงราย</div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>25 ต.ค. 2568</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>09:00 น.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-lg font-bold mb-4 text-slate-800">ตารางนัดหมาย</h2>
                
                <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 items-start">
                        <div className="bg-[#F3F0FF] rounded-xl w-[64px] h-[64px] flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs font-medium text-[#49358e]">ต.ค.</span>
                            <span className="text-xl font-bold text-[#49358e]">20</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 mb-1">ติดตามผลผ่าตัด</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                                <Clock className="w-4 h-4 shrink-0" />
                                15:00 - 15:00
                            </div>
                            <div className="text-xs text-slate-500 mb-2">
                                คลินิกทันตกรรมพิเศษ
                            </div>
                            <span className="inline-block px-3 py-1 bg-[#FEF9C3] text-[#A16207] text-xs font-medium rounded-full border border-[#FEF08A]">
                                รอตรวจสอบ
                            </span>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-5 h-5 text-[#F97316]" />
                            <h3 className="font-bold text-slate-800 text-lg">ติดตามเยี่ยมบ้าน</h3>
                        </div>

                        <div className="flex gap-4 items-start mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFEDD5] flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-[#EA580C]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-base">รพ.สต. บ้านแม่สูน</h4>
                                <p className="text-sm text-slate-500">เจ้าหน้าที่: คุณใจดี มีสุข (พยาบาลวิชาชีพ)</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 justify-between">
                            <span className="inline-block px-3 py-1 bg-[#FFEDD5] text-[#EA580C] text-xs font-medium rounded-full border border-[#FED7AA]">
                                นัดหมาย: 12 ต.ค. 2568
                            </span>
                            <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#FFEDD5] text-[#EA580C] text-[10px] font-medium rounded border border-[#FED7AA]">
                                นัดหมายแล้ว
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}