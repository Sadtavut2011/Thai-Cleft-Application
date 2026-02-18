import React from 'react';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    CalendarPlus,
    Stethoscope,
    Home,
    CheckCircle2,
    AlertCircle,
    StickyNote,
    Printer,
    Phone,
    ClipboardList
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';
import { formatThaiDate } from '../../utils/formatThaiDate';
import { getPatientByHn } from '../../../../../data/patientData';

interface AppointmentDetailPageProps {
    data: any;
    patient?: any;
    onBack: () => void;
}

const InfoItem = ({ label, value, icon: Icon }: { label: string, value?: string, icon?: any }) => (
    <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
            {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
            {value || '-'}
        </div>
    </div>
);

export const AppointmentDetailPage: React.FC<AppointmentDetailPageProps> = ({ data, patient, onBack }) => {
    // Single source lookup for full patient data
    const patientRecord = patient ? getPatientByHn(patient.hn) : null;
    const resolvedDob = patientRecord?.dob;
    const resolvedGender = patientRecord?.gender;
    const patientDiagnosis = patientRecord?.diagnosis || '-';
    const patientAge = (() => {
        if (!resolvedDob) return null;
        const dob = new Date(resolvedDob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const md = today.getMonth() - dob.getMonth();
        if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
        return age;
    })();
    const patientAgeGenderText = [
        patientAge !== null ? `${patientAge} ปี` : null,
        resolvedGender || null
    ].filter(Boolean).join(' / ') || '-';

    // Extract date and time from datetime string (e.g., "20/12/2566 09:00")
    const parsedDate = data.date || (data.datetime ? data.datetime.split(' ')[0] : '-');
    const parsedTime = data.time || (data.datetime && data.datetime.includes(' ') ? data.datetime.split(' ')[1] : '-');

    // Status config - synced with AppointmentDetailPage.tsx (operations)
    const getStatusConfig = (status: string) => {
        const s = (status || '').toLowerCase();
        // Warning / Pending / Waiting
        if (['waiting', 'pending', 'รอพบแพทย์', 'รอตรวจ', 'รอการยืนยัน'].includes(s)) {
            return { color: 'bg-orange-100 text-orange-700', text: 'รอตรวจ', icon: <AlertCircle size={14} /> };
        }
        // Confirmed / Checked-in
        if (['confirmed', 'checked-in', 'accepted', 'ยืนยันแล้ว', 'มาตามนัด'].includes(s)) {
            return { color: 'bg-blue-100 text-blue-700', text: 'ยืนยันแล้ว', icon: <CheckCircle2 size={14} /> };
        }
        // Completed
        if (['completed', 'done', 'success', 'เสร็จสิ้น'].includes(s)) {
            return { color: 'bg-green-100 text-green-700', text: 'เสร็จสิ้น', icon: <CheckCircle2 size={14} /> };
        }
        // Cancelled / Missed
        if (['cancelled', 'missed', 'rejected', 'ยกเลิก', 'ขาดนัด'].includes(s)) {
            return { color: 'bg-red-100 text-red-700', text: s === 'missed' || s === 'ขาดนัด' ? 'ขาดนัด' : 'ยกเลิก', icon: <AlertCircle size={14} /> };
        }
        // Default
        return { color: 'bg-gray-100 text-gray-700', text: status || '-', icon: <AlertCircle size={14} /> };
    };

    const statusConfig = getStatusConfig(data.status || data.apptStatus);

    // Show date banner for all except cancelled/missed - synced with operations
    const showDateBanner = statusConfig.text !== 'ยกเลิก' && statusConfig.text !== 'ขาดนัด';

    // Extract display time
    const displayTime = (() => {
        const t = parsedTime;
        if (!t || t === '-') return '';
        return t.length > 5 ? t : `${t} น.`;
    })();

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-[#5e5873] font-bold text-lg">
                        รายละเอียดนัดหมาย
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        ข้อมูลรายละเอียดและบันทึกการนัดหมาย
                    </p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            {/* Blue Appointment Date Banner */}
            {showDateBanner && parsedDate && parsedDate !== '-' && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white p-2.5 rounded-full shadow-sm border border-blue-100">
                        <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div>
                        <span className="text-sm text-blue-600 font-semibold block mb-0.5">วันนัดหมาย</span>
                        <span className="text-blue-900 font-bold text-lg">
                            {formatThaiDate(parsedDate)}
                        </span>
                        {displayTime && (
                            <span className="text-blue-700 text-sm ml-2">
                                {displayTime}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Info Card */}
                    {patient && (
                        <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="pb-3 border-b border-gray-50">
                                <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${statusConfig.color}`}>
                                        {statusConfig.text}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-[72px] h-[72px] bg-gray-100 rounded-full shrink-0 overflow-hidden border-2 border-white shadow">
                                        <img 
                                            src={patient.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                                            alt={patient.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-xl truncate">{patient.name || 'ไม่ระบุชื่อ'}</h3>
                                        <p className="text-sm text-slate-500">HN: {patient.hn || '-'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                            <Phone className="w-4 h-4" /> ติดต่อ
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                            <ClipboardList className="w-4 h-4" /> ดูประวัติ
                                        </Button>
                                    </div>
                                </div>

                                {/* Info strip: อายุ/เพศ + ผลการวินิจฉัย */}
                                <div className="grid grid-cols-2 mt-5 bg-[#F4F9FF] rounded-lg border border-blue-100/60 overflow-hidden">
                                    <div className="px-5 py-3 border-r border-blue-100/60">
                                        <span className="text-xs text-slate-500 block mb-0.5">อายุ / เพศ</span>
                                        <span className="text-sm text-slate-800 font-semibold">{patientAgeGenderText}</span>
                                    </div>
                                    <div className="px-5 py-3">
                                        <span className="text-xs text-slate-500 block mb-0.5">ผลการวินิจฉัย</span>
                                        <span className="text-sm text-slate-800 font-semibold">{patientDiagnosis}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Appointment Detail Card */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                        <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#4285f4]/10 p-2 rounded-lg text-[#4285f4]">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-[#5e5873]">ข้อมูลนัดหมาย</CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            
                            {/* Date & Time Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoItem label="วันที่สร้างคำขอ" value={formatThaiDate(data.requestDate)} icon={Calendar} />
                                <InfoItem label="วันที่นัดหมาย" value={formatThaiDate(parsedDate)} icon={CalendarPlus} />
                                <InfoItem label="เวลา" value={displayTime} icon={Clock} />
                            </div>

                            {/* Location Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <MapPin size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">สถานที่</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoItem label="โรงพยาบาล" value={data.location || data.hospital || '-'} icon={MapPin} />
                                    <InfoItem label="ห้องตรวจ" value={data.room || data.roomName || (data.raw && data.raw.room) || '-'} icon={Home} />
                                </div>
                            </div>

                            {/* Medical Info Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <Stethoscope size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">ข้อมูลการรักษา</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoItem label="การรักษา / หัวข้อนัดหมาย" value={data.title || data.type || data.treatment || '-'} icon={CalendarPlus} />
                                    <InfoItem label="ชื่อผู้ที่รักษา" value={data.doctor || '-'} icon={User} />
                                </div>
                            </div>

                            {/* Note Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <StickyNote size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">รายละเอียดการนัดหมาย</h3>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px]">
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {data.note || data.reason || data.detail || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Recorder */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <User className="text-gray-400" size={16} />
                                    <span className="text-sm text-gray-500 font-medium">ผู้บันทึกข้อมูล</span>
                                </div>
                                <span className="text-sm text-gray-700 font-medium">
                                    {data.recorder || 'สภัคศิริ สุวิวัฒนา'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Tracking Timeline */}
                <div className="space-y-6">
                    <Card className="border-gray-100 shadow-sm rounded-xl">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="text-lg text-[#5e5873]">สถานะการติดตาม</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                                {/* Step 1: Created */}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#5e5873]">สร้างนัดหมาย</span>
                                        <span className="text-sm text-gray-400">{formatThaiDate(data.requestDate) || '-'}</span>
                                    </div>
                                </div>

                                {/* Step 2: Confirmed */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        statusConfig.text === 'ยืนยันแล้ว' || statusConfig.text === 'เสร็จสิ้น' ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            statusConfig.text === 'ยืนยันแล้ว' || statusConfig.text === 'เสร็จสิ้น' ? "text-[#5e5873]" : "text-gray-400"
                                        )}>ยืนยันนัดหมาย</span>
                                        <span className="text-sm text-gray-400">-</span>
                                    </div>
                                </div>

                                {/* Step 3: Completed */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        statusConfig.text === 'เสร็จสิ้น' ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            statusConfig.text === 'เสร็จสิ้น' ? "text-[#5e5873]" : "text-gray-400"
                                        )}>เข้าพบแพทย์</span>
                                        <span className="text-sm text-gray-400">-</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};