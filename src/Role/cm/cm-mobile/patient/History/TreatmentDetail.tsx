import React from 'react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    FileText,
    Stethoscope,
    Activity,
    Pill,
    Thermometer
} from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";

interface Treatment {
    date: string;
    department?: string;
    doctor?: string;
    title?: string;
    detail?: string;
}

interface Patient {
    name?: string;
    hn?: string;
}

interface TreatmentDetailProps {
    treatment: Treatment;
    patient: Patient;
    onBack: () => void;
}

export const TreatmentDetail: React.FC<TreatmentDetailProps> = ({ treatment, patient, onBack }) => {
    if (!treatment) return null;

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 fixed inset-0 z-[50000] overflow-hidden">

            {/* Header */}
            <div className="bg-white shrink-0 z-20 shadow-sm">
                <StatusBarIPhone16Main />
                <div className="h-[64px] px-4 flex items-center gap-3">
                    <button onClick={onBack} className="text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-slate-800 text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดการรักษา</h1>
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

                {/* Date & Location Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex items-center gap-3 text-slate-700">
                        <Calendar className="text-[#7066a9]" size={20} />
                        <div>
                            <span className="text-xs text-slate-400 block">วันที่เข้ารับการรักษา</span>
                            <span className="font-semibold">{treatment.date}</span>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-slate-100"></div>
                    <div className="flex items-center gap-3 text-slate-700">
                        <MapPin className="text-[#7066a9]" size={20} />
                        <div>
                            <span className="text-xs text-slate-400 block">สถานที่ / แผนก</span>
                            <span className="font-semibold">{treatment.department || '-'}</span>
                        </div>
                    </div>
                    <div className="w-full h-[1px] bg-slate-100"></div>
                    <div className="flex items-center gap-3 text-slate-700">
                        <User className="text-[#7066a9]" size={20} />
                        <div>
                            <span className="text-xs text-slate-400 block">แพทย์ผู้รักษา</span>
                            <span className="font-semibold">{treatment.doctor || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Treatment Info */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="text-[#7066a9]" size={22} />
                        <h3 className="font-bold text-lg text-slate-800">ข้อมูลการรักษา</h3>
                    </div>

                    <div className="space-y-1">
                        <span className="text-sm font-semibold text-slate-600">การวินิจฉัย / หัวข้อ</span>
                        <p className="text-slate-800 font-medium bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            {treatment.title || '-'}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-sm font-semibold text-slate-600">รายละเอียดเพิ่มเติม</span>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {treatment.detail || 'ไม่มีรายละเอียดเพิ่มเติม'}
                        </p>
                    </div>
                </div>

                {/* Vital Signs (Mockup if not in data) */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-[#7066a9]" size={22} />
                        <h3 className="font-bold text-lg text-slate-800">สัญญาณชีพ</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <span className="text-xs text-slate-400 block">ความดันโลหิต</span>
                            <span className="font-bold text-slate-700 text-lg">120/80</span>
                            <span className="text-xs text-slate-400 ml-1">mmHg</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <span className="text-xs text-slate-400 block">ชีพจร</span>
                            <span className="font-bold text-slate-700 text-lg">72</span>
                            <span className="text-xs text-slate-400 ml-1">bpm</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <span className="text-xs text-slate-400 block">อุณหภูมิ</span>
                            <span className="font-bold text-slate-700 text-lg">36.6</span>
                            <span className="text-xs text-slate-400 ml-1">°C</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg text-center">
                            <span className="text-xs text-slate-400 block">น้ำหนัก</span>
                            <span className="font-bold text-slate-700 text-lg">65.5</span>
                            <span className="text-xs text-slate-400 ml-1">kg</span>
                        </div>
                    </div>
                </div>

                {/* Prescriptions (Mockup) */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Pill className="text-[#7066a9]" size={22} />
                        <h3 className="font-bold text-lg text-slate-800">ยาและการรักษา</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 shrink-0">
                                1
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Paracetamol 500 mg</p>
                                <p className="text-xs text-slate-500">รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เวลาปวดหรือมีไข้</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 shrink-0">
                                2
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Amoxicillin 500 mg</p>
                                <p className="text-xs text-slate-500">รับประทานครั้งละ 1 เม็ด วันละ 3 ครั้ง หลังอาหาร เช้า กลางวัน เย็น</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
