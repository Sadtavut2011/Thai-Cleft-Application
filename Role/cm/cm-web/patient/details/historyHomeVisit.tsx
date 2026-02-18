import React from 'react';
import { 
    ArrowLeft, 
    Home, 
    Calendar, 
    FileText, 
    CheckCircle2, 
    User, 
    MapPin,
    Printer,
    Phone,
    ClipboardList
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';
import { formatThaiDate, formatThaiDateFull } from '../../utils/formatThaiDate';
import { getPatientByHn } from '../../../../../data/patientData';

interface HomeVisitRequestDetailProps {
    data: any;
    patient?: any;
    onBack: () => void;
}

const InfoItem = ({ label, value, icon: Icon, valueClassName }: { label: string, value?: string, icon?: any, valueClassName?: string }) => (
    <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
            {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
            <span className={valueClassName}>{value || '-'}</span>
        </div>
    </div>
);

export const HomeVisitRequestDetail: React.FC<HomeVisitRequestDetailProps> = ({ data, patient, onBack }) => {
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

    // Status normalization - synced with HomeVisitRequestDetail.tsx (operations)
    const rawStatus = (data?.status || '').toLowerCase();
    let displayStatus = 'Pending';
    if (['inprogress', 'in_progress', 'working', 'ลงพื้นที่', 'อยู่ในพื้นที่', 'ดำเนินการ'].includes(rawStatus)) displayStatus = 'InProgress';
    if (['accepted', 'accept', 'รับงาน', 'ยืนยันรับงาน'].includes(rawStatus)) displayStatus = 'Accepted';
    if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited', 'เรียบร้อย'].includes(rawStatus)) displayStatus = 'Completed';
    if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(rawStatus)) displayStatus = 'Rejected';
    if (['pending', 'waiting', 'wait', 'รอ', 'รอการตอบรับ'].includes(rawStatus)) displayStatus = 'Pending';
    if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(rawStatus)) displayStatus = 'WaitVisit';
    if (['nothome', 'not_home', 'not home', 'ไม่อยู่'].includes(rawStatus)) displayStatus = 'NotHome';
    if (['notallowed', 'not_allowed', 'not allowed', 'ไม่อนุญาต'].includes(rawStatus)) displayStatus = 'NotAllowed';

    const getStatusLabel = () => {
        switch (displayStatus) {
            case 'Pending': return 'รอการตอบรับ';
            case 'Accepted': return 'รับงาน';
            case 'WaitVisit': return 'รอเยี่ยม';
            case 'InProgress': return 'ดำเนินการ';
            case 'Completed': return 'เสร็จสิ้น';
            case 'Rejected': return 'ปฏิเสธ';
            case 'NotHome': return 'ไม่อยู่';
            case 'NotAllowed': return 'ไม่อนุญาต';
            default: return 'รอการตอบรับ';
        }
    };

    const getStatusColor = () => {
        switch (displayStatus) {
            case 'Pending': return 'bg-orange-100 text-orange-600';
            case 'Accepted': return 'bg-blue-100 text-blue-600';
            case 'WaitVisit': return 'bg-yellow-100 text-yellow-700';
            case 'InProgress': return 'bg-blue-100 text-blue-600';
            case 'Completed': return 'bg-green-100 text-green-600';
            case 'Rejected': return 'bg-red-100 text-red-600';
            case 'NotHome': return 'bg-red-50 text-red-500';
            case 'NotAllowed': return 'bg-gray-100 text-gray-500';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // Type normalization - matches mobile
    const rawType = (data?.type || data?.visit_type || data?.visitType || '').toLowerCase();
    let displayType = 'Joint';
    if (rawType.includes('delegated') || rawType.includes('ฝาก')) displayType = 'Delegated';

    const getTypeLabel = () => {
        if (displayType === 'Delegated') return 'ฝาก รพ.สต. เยี่ยม';
        return 'ลงเยี่ยมพร้อม รพ.สต.';
    };

    // Data normalization
    const displayRequestDate = formatThaiDate(data?.requestDate || data?.createdDate);
    const displayDate = formatThaiDate(data?.date);
    const displayVisitor = data?.visitor || data?.rph || data?.provider || '-';
    const displayNote = data?.note || data?.detail || data?.results || '-';

    // Show appointment date for certain statuses - matches mobile
    const showAppointmentDate = ['WaitVisit', 'InProgress', 'Completed'].includes(displayStatus);

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-[#5e5873] font-bold text-lg">
                        รายละเอียดการเยี่ยมบ้าน {data?.id || '-'}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        ข้อมูลรายละเอียดและแบบประเมินการเยี่ยมบ้าน
                    </p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            {/* Appointment Date Green Card - matches mobile */}
            {showAppointmentDate && data?.date && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 mb-6">
                    <div className="bg-white p-2.5 rounded-full shadow-sm border border-emerald-100">
                        <Calendar className="text-emerald-600" size={20} />
                    </div>
                    <div>
                        <span className="text-sm text-emerald-600 font-semibold block mb-0.5">วันนัดหมายเยี่ยมบ้าน</span>
                        <span className="text-emerald-900 font-bold text-lg">
                            {formatThaiDateFull(data.date)}
                        </span>
                        {data.time && (
                            <span className="text-emerald-700 text-sm ml-2">{data.time.substring(0, 5)} น.</span>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Info Summary - matches reference image */}
                    {patient && (
                        <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="pb-3 border-b border-gray-50">
                                <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor()}`}>
                                        {getStatusLabel()}
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

                    {/* Visit Detail Card */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                        <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#28c76f]/10 p-2 rounded-lg text-[#28c76f]">
                                    <Home size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-[#5e5873]">บันทึกการเยี่ยมบ้าน</CardTitle>
                                    <p className="text-sm text-gray-500">วันที่: {displayDate}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Visit Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoItem label="วันที่สร้างคำขอ" value={displayRequestDate !== '-' ? displayRequestDate : displayDate} icon={Calendar} />
                                <InfoItem 
                                    label="ประเภทการเยี่ยม" 
                                    value={getTypeLabel()} 
                                    icon={Home} 
                                    valueClassName="font-semibold text-[#7367f0]"
                                />
                                <InfoItem label="หน่วยงาน/ผู้เยี่ยม" value={displayVisitor} icon={User} />
                                <InfoItem label="ผลการประเมิน" value={data.status || 'เรียบร้อย'} icon={CheckCircle2} />
                            </div>

                            {/* Note / Result Section */}
                            {displayNote && displayNote !== '-' && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                            <FileText size={20} />
                                        </div>
                                        <h3 className="font-bold text-lg text-[#5e5873]">ผลการเยี่ยม / หมายเหตุ</h3>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px]">
                                        <p className="text-gray-600 leading-relaxed">{displayNote}</p>
                                    </div>
                                </div>
                            )}

                            {/* Location & Map */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <MapPin size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">พิกัด</h3>
                                </div>
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between">
                                    <span className="text-gray-600 text-sm">18.796, 98.979</span>
                                    <Button variant="link" size="sm" className="h-auto p-0 text-[#7367f0]">ดูแผนที่</Button>
                                </div>
                            </div>

                            {/* Images Placeholder */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-700">รูปภาพประกอบ</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
                                            IMG_{i}
                                        </div>
                                    ))}
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
                                        <span className="text-sm font-bold text-[#5e5873]">สร้างคำขอเยี่ยมบ้าน</span>
                                        <span className="text-sm text-gray-400">{displayRequestDate !== '-' ? displayRequestDate : displayDate}</span>
                                    </div>
                                </div>

                                {/* Step 2: Accepted */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        ['InProgress', 'WaitVisit', 'Completed', 'Accepted'].includes(displayStatus) ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            ['InProgress', 'WaitVisit', 'Completed', 'Accepted'].includes(displayStatus) ? "text-[#5e5873]" : "text-gray-400"
                                        )}>ตอบรับคำขอ</span>
                                        <span className="text-sm text-gray-400">-</span>
                                    </div>
                                </div>

                                {/* Step 3: Visited */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        displayStatus === 'Completed' ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            displayStatus === 'Completed' ? "text-[#5e5873]" : "text-gray-400"
                                        )}>ลงพื้นที่เยี่ยมบ้าน</span>
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