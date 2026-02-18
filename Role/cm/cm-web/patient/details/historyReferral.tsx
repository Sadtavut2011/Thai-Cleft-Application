import React from 'react';
import { 
    ArrowLeft, 
    Building2, 
    Calendar, 
    FileText, 
    Send, 
    User, 
    Printer,
    AlertTriangle,
    Phone,
    ClipboardList
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';
import { formatThaiDate, formatThaiDateFull } from '../../utils/formatThaiDate';
import { getPatientByHn } from '../../../../../data/patientData';

interface ReferralSystemDetailProps {
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

export const ReferralSystemDetail: React.FC<ReferralSystemDetailProps> = ({ data, patient, onBack }) => {
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

    // Status helpers - synced with ReferralSystemDetail.tsx (operations)
    const STATUS_LABELS: Record<string, string> = {
        'Pending': 'รอการตอบรับ',
        'Accepted': 'รอรับตัว',
        'Rejected': 'ปฏิเสธ',
        'Completed': 'ตรวจแล้ว',
        'Canceled': 'ยกเลิก',
    };

    const getStatusLabel = (status: string) => {
        // Check exact match first
        if (STATUS_LABELS[status]) return STATUS_LABELS[status];
        const s = (status || '').toLowerCase();
        if (['pending', 'referred'].includes(s)) return 'รอการตอบรับ';
        if (['accepted', 'confirmed', 'waitingreceive'].includes(s)) return 'รอรับตัว';
        if (['received', 'waiting_doctor'].includes(s)) return 'รอตรวจ';
        if (['completed', 'treated'].includes(s)) return 'ตรวจแล้ว';
        if (s === 'rejected') return 'ปฏิเสธ';
        if (s === 'canceled') return 'ยกเลิก';
        return status || '-';
    };

    const getStatusColor = (status: string) => {
        // Check exact match first (synced with operations)
        if (status === 'Pending') return 'bg-blue-100 text-blue-600';
        if (status === 'Accepted') return 'bg-orange-100 text-orange-600';
        if (status === 'Completed') return 'bg-green-100 text-green-600';
        if (status === 'Rejected') return 'bg-red-100 text-red-600';
        if (status === 'Canceled') return 'bg-gray-100 text-gray-500';
        const s = (status || '').toLowerCase();
        if (['pending', 'referred'].includes(s)) return 'bg-blue-100 text-blue-600';
        if (['accepted', 'confirmed', 'waitingreceive'].includes(s)) return 'bg-orange-100 text-orange-600';
        if (['received', 'waiting_doctor'].includes(s)) return 'bg-blue-100 text-blue-600';
        if (['completed', 'treated'].includes(s)) return 'bg-green-100 text-green-600';
        if (s === 'rejected') return 'bg-red-100 text-red-600';
        return 'bg-slate-100 text-slate-700';
    };

    // Format date safely - use shared utility
    const formatDate = (dateStr: string) => formatThaiDate(dateStr);

    // Show accepted date for specific statuses - matches mobile
    const showAcceptedDate = ['accepted', 'confirmed', 'waitingreceive', 'received', 'waiting_doctor', 'completed', 'treated']
        .includes((data?.status || '').toLowerCase()) && data.acceptedDate;

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-[#5e5873] font-bold text-lg">
                        รายละเอียดการส่งตัว
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        ข้อมูลรายละเอียดและบันทึกการส่งตัวผู้ป่วย
                    </p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            {/* Accepted Date Card */}
            {showAcceptedDate && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 mb-6">
                    <div className="bg-white p-2.5 rounded-full shadow-sm border border-emerald-100">
                        <Calendar className="text-emerald-600" size={20} />
                    </div>
                    <div>
                        <span className="text-sm text-emerald-600 font-semibold block mb-0.5">วันนัดหมายส่งตัว</span>
                        <span className="text-emerald-900 font-bold text-lg">
                            {formatThaiDateFull(data.acceptedDate)}
                        </span>
                        <span className="text-emerald-700 text-sm ml-2">
                            {(() => { try { return new Date(data.acceptedDate).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }); } catch { return ''; } })()} น.
                        </span>
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
                                        {getStatusLabel(data.status)}
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

                    {/* Referral Detail Card */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                        <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#ff6d00]/10 p-2 rounded-lg text-[#ff6d00]">
                                        <Send size={24} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-[#5e5873]">ใบส่งตัว (Referral Letter)</CardTitle>
                                        <p className="text-sm text-gray-500">เลขที่: {data.referralNo || '-'}</p>
                                    </div>
                                </div>
                                {!patient && (
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2",
                                        getStatusColor(data.status)
                                    )}>
                                        {getStatusLabel(data.status)}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">

                            {/* Date Section */}
                            <InfoItem label="วันที่สร้างคำขอ" value={formatDate(data.referralDate || data.date)} icon={Calendar} />

                            {/* Route Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <Send size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">เส้นทางส่งตัว</h3>
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">ต้นทาง</p>
                                            <p className="font-semibold text-gray-700">
                                                {data.sourceHospital || data.hospital || data.from || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 w-full md:px-4 flex items-center justify-center">
                                        <div className="h-[2px] w-full bg-gray-300 relative">
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-gray-400">
                                                <Send size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">ปลายทาง</p>
                                            <p className="font-semibold text-[#7367f0]">{data.destinationHospital || data.destination || data.to || '-'}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-[#7367f0] flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                            <Building2 size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Doctor & Urgency */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoItem label="แพทย์เจ้าของไข้" value={data.doctor || patient?.doctor || '-'} icon={User} />
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">ความเร่งด่วน</p>
                                    <div className={cn(
                                        "p-3 rounded-lg border min-h-[48px] flex items-center gap-2",
                                        data.urgency === 'Emergency' ? 'bg-red-50 border-red-100' :
                                        data.urgency === 'Urgent' ? 'bg-orange-50 border-orange-100' :
                                        'bg-gray-50 border-gray-100'
                                    )}>
                                        <AlertTriangle size={16} className={cn(
                                            "shrink-0",
                                            data.urgency === 'Emergency' ? 'text-red-500' :
                                            data.urgency === 'Urgent' ? 'text-orange-500' :
                                            'text-gray-400'
                                        )} />
                                        <span className={cn(
                                            "font-medium",
                                            data.urgency === 'Emergency' ? 'text-red-600' :
                                            data.urgency === 'Urgent' ? 'text-orange-500' :
                                            'text-gray-700'
                                        )}>
                                            {data.urgency === 'Emergency' ? 'ฉุกเฉิน' :
                                             data.urgency === 'Urgent' ? 'เร่งด่วน' :
                                             'ปกติ (Routine)'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">ข้อมูลการส่งต่อ</h3>
                                </div>
                                
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">เรื่อง / การวินิจฉัย</p>
                                    <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 min-h-[48px] flex items-center text-gray-800 font-medium">
                                        {data.title || data.treatment || '-'}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">เหตุผลการส่งต่อ</p>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {data.reason || '-'}
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
                                        <span className="text-sm font-bold text-[#5e5873]">สร้างคำขอส่งตัว</span>
                                        <span className="text-sm text-gray-400">{formatDate(data.referralDate || data.date)}</span>
                                    </div>
                                </div>

                                {/* Step 2: Accepted */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        ['accepted', 'confirmed', 'waitingreceive', 'received', 'waiting_doctor', 'completed', 'treated']
                                            .includes((data?.status || '').toLowerCase()) ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            ['accepted', 'confirmed', 'waitingreceive', 'received', 'waiting_doctor', 'completed', 'treated']
                                                .includes((data?.status || '').toLowerCase()) ? "text-[#5e5873]" : "text-gray-400"
                                        )}>ตอบรับ / รอรับตัว</span>
                                        <span className="text-sm text-gray-400">-</span>
                                    </div>
                                </div>

                                {/* Step 3: Completed */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        ['completed', 'treated'].includes((data?.status || '').toLowerCase()) ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            ['completed', 'treated'].includes((data?.status || '').toLowerCase()) ? "text-[#5e5873]" : "text-gray-400"
                                        )}>ตรวจแล้ว / เสร็จสิ้น</span>
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