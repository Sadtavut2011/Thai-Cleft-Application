import React from 'react';
import {
    ArrowLeft,
    Calendar,
    User,
    MapPin,
    Clock,
    CalendarPlus,
    StickyNote
} from 'lucide-react';
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";

interface AppointmentDetailProps {
    appointment: any;
    patient: any;
    onBack: () => void;
}

export const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ appointment, patient, onBack }) => {
    if (!appointment) return null;

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 fixed inset-0 z-[50000] overflow-hidden">

            {/* Header */}
            <div className="bg-white shrink-0 z-20 shadow-sm">
                <StatusBarIPhone16Main />
                <div className="h-[64px] px-4 flex items-center gap-3">
                    <button onClick={onBack} className="text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-slate-800 text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดการนัดหมาย</h1>
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

                {/* Date & Time Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    {/* Status Badge */}
                    <div className="flex justify-end mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${appointment.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-700 animate-pulse'
                                : 'bg-green-100 text-green-700'
                            }`}>
                            {appointment.status === 'upcoming' ? 'นัดหมายครั้งถัดไป' : 'เสร็จสิ้นแล้ว'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700">
                        <Calendar className="text-[#7066a9]" size={20} />
                        <div>
                            <span className="text-xs text-slate-400 block">วันที่นัดหมาย</span>
                            <span className="font-semibold">{appointment.date}</span>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-slate-100"></div>
                    <div className="flex items-center gap-3 text-slate-700">
                        <Clock className="text-[#7066a9]" size={20} />
                        <div>
                            <span className="text-xs text-slate-400 block">เวลา</span>
                            <span className="font-semibold">{appointment.time || '-'}</span>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-slate-100"></div>
                    <div className="flex items-center gap-3 text-slate-700">
                        <MapPin className="text-[#7066a9]" size={20} />
                        <div>
                            <span className="text-xs text-slate-400 block">สถานที่ / แผนก</span>
                            <span className="font-semibold">{appointment.location || '-'}</span>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-slate-100"></div>
                    <div className="flex items-center gap-3 text-slate-700">
                        <User className="text-[#7066a9]" size={20} />
                        <div>
                            <span className="text-xs text-slate-400 block">แพทย์ผู้นัด</span>
                            <span className="font-semibold">{appointment.doctor || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Detail Info */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CalendarPlus className="text-[#7066a9]" size={22} />
                        <h3 className="font-bold text-lg text-slate-800">ข้อมูลการนัดหมาย</h3>
                    </div>

                    <div className="space-y-1">
                        <span className="text-sm font-semibold text-slate-600">หัวข้อนัดหมาย</span>
                        <p className="text-slate-800 font-medium bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            {appointment.title || '-'}
                        </p>
                    </div>

                    {appointment.note && (
                        <div className="space-y-1">
                            <span className="text-sm font-semibold text-slate-600 flex items-center gap-1">
                                <StickyNote size={14} /> หมายเหตุ / คำสั่งแพทย์
                            </span>
                            <p className="text-slate-600 leading-relaxed text-sm bg-yellow-50/50 p-3 rounded-lg border border-yellow-100 text-yellow-800">
                                {appointment.note}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
