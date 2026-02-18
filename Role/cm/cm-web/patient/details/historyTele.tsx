import React from 'react';
import { 
    ArrowLeft, 
    Video, 
    Calendar, 
    User, 
    Building2,
    Smartphone,
    FileText,
    Printer,
    Phone,
    ClipboardList
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';
import { formatThaiDate } from '../../utils/formatThaiDate';
import { getPatientByHn } from '../../../../../data/patientData';

interface TeleConsultationSystemDetailProps {
    data: any;
    patient?: any;
    onBack: () => void;
}

const InfoItem = ({ label, value, icon: Icon, valueClassName }: { label: string, value?: string | React.ReactNode, icon?: any, valueClassName?: string }) => (
    <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
            {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
            <span className={valueClassName}>{value || '-'}</span>
        </div>
    </div>
);

export const TeleConsultationSystemDetail: React.FC<TeleConsultationSystemDetailProps> = ({ data, patient, onBack }) => {
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

    // Status helpers - synced with TeleConsultationSystemDetail.tsx (operations)
    const getStatusLabel = (status: string) => {
        const s = (status || '').toLowerCase();
        if (['waiting', 'pending', 'scheduled'].includes(s)) return 'รอสาย';
        if (['inprogress', 'in_progress', 'working'].includes(s)) return 'ดำเนินการ';
        if (['cancelled', 'missed', 'rejected'].includes(s)) return 'ยกเลิก';
        return 'เสร็จสิ้น';
    };

    const getStatusColor = (status: string) => {
        const s = (status || '').toLowerCase();
        if (['waiting', 'pending', 'scheduled'].includes(s)) return 'bg-orange-100 text-orange-700';
        if (['inprogress', 'in_progress', 'working'].includes(s)) return 'bg-blue-100 text-blue-700';
        if (['cancelled', 'missed', 'rejected'].includes(s)) return 'bg-red-100 text-red-700';
        return 'bg-green-100 text-green-700';
    };

    const statusLabel = getStatusLabel(data.status);

    // Channel normalization - synced with operations (supports Direct/Intermediary/Hospital)
    const channel = data.channel || (data.type === 'Direct' ? 'mobile' : 'agency');
    const isMobile = channel === 'mobile' || channel === 'Direct';
    const isHospital = channel === 'hospital' || channel === 'Hospital';
    const agencyName = data.agency_name || data.intermediaryName || 'รพ.สต. ในพื้นที่';
    const channelLabel = isMobile
        ? 'ผ่านผู้ป่วยเอง (Mobile)'
        : isHospital
        ? `ผ่านโรงพยาบาล: ${agencyName}`
        : `ผ่านหน่วยงาน: ${agencyName}`;

    const meetingLink = data.link || data.meetingLink || "https://meet.google.com/abc-defg-hij";

    // Separate title from detail/result to avoid showing same value twice
    const displayTitle = data.title || data.detail || '-';
    const displayResult = data.consultResult || (data.title && data.detail !== data.title ? data.detail : null) || '-';

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-[#5e5873] font-bold text-lg">
                        รายละเอียด Tele-med
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        ข้อมูลรายละเอียดและบันทึกการปรึกษาแพทย์ทางไกล
                    </p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            {/* Pink Appointment Date Banner */}
            {(data.datetime || data.date) && (
                <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 shadow-sm flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white p-2.5 rounded-full shadow-sm border border-pink-100">
                        <Calendar className="text-[#e91e63]" size={20} />
                    </div>
                    <div>
                        <span className="text-sm text-[#e91e63] font-semibold block mb-0.5">วันนัดหมาย Tele-med</span>
                        <span className="text-pink-900 font-bold text-lg">
                            {formatThaiDate(data.datetime || data.date)}
                        </span>
                        {(() => {
                            const raw = data.datetime || data.date || '';
                            if (raw.includes('T')) {
                                const timePart = raw.split('T')[1]?.substring(0, 5);
                                if (timePart) return <span className="text-pink-700 text-sm ml-2">{timePart} น.</span>;
                            }
                            if (raw.includes(' ')) {
                                const timePart = raw.split(' ')[1]?.substring(0, 5);
                                if (timePart) return <span className="text-pink-700 text-sm ml-2">{timePart} น.</span>;
                            }
                            return null;
                        })()}
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
                                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor(data.status)}`}>
                                        {statusLabel}
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

                    {/* Tele Detail Card */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                        <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#e91e63]/10 p-2 rounded-lg text-[#e91e63]">
                                    <Video size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-[#5e5873]">นัดหมายปรึกษาแพทย์</CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                                            data.type === 'Direct' ? "bg-cyan-50 text-cyan-600 border-cyan-100" : "bg-purple-50 text-purple-600 border-purple-100"
                                        )}>
                                            {data.type === 'Direct' ? 'ส่งตรงหาผู้ป่วย' : 'ผ่าน รพ.สต.'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            {/* Date & Connection Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoItem label="วันที่สร้างคำขอ" value={formatThaiDate(data.requestDate)} icon={Calendar} />
                                <InfoItem 
                                    label="ช่องทางการเชื่อมต่อ" 
                                    value={channelLabel} 
                                    icon={isMobile ? Smartphone : Building2} 
                                />
                                <InfoItem 
                                    label="Meeting Link" 
                                    value={
                                        <a 
                                            href={meetingLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 font-medium hover:underline break-all"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {meetingLink}
                                        </a>
                                    }
                                    icon={Video} 
                                />
                            </div>

                            {/* Doctor Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <User size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">แพทย์ผู้ให้คำปรึกษา</h3>
                                </div>
                                <InfoItem label="แพทย์ผู้ให้คำปรึกษา" value={data.doctor || '-'} icon={User} />
                            </div>

                            {/* Consultation Info Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">ข้อมูลการปรึกษา</h3>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">หัวข้อการปรึกษา</p>
                                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 min-h-[48px] flex items-center text-gray-800 font-medium">
                                        {displayTitle}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">รายละเอียด / ผลการปรึกษา</p>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {displayResult}
                                    </div>
                                </div>
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
                                        <span className="text-sm font-bold text-[#5e5873]">สร้างคำขอ Tele-med</span>
                                        <span className="text-sm text-gray-400">{formatThaiDate(data.requestDate) || '-'}</span>
                                    </div>
                                </div>

                                {/* Step 2: Scheduled */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        ['ดำเนินการ', 'เสร็จสิ้น'].includes(statusLabel) ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            ['ดำเนินการ', 'เสร็จสิ้น'].includes(statusLabel) ? "text-[#5e5873]" : "text-gray-400"
                                        )}>เริ่มการปรึกษา</span>
                                        <span className="text-sm text-gray-400">-</span>
                                    </div>
                                </div>

                                {/* Step 3: Completed */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        statusLabel === 'เสร็จสิ้น' ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            statusLabel === 'เสร็จสิ้น' ? "text-[#5e5873]" : "text-gray-400"
                                        )}>เสร็จสิ้นการปรึกษา</span>
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