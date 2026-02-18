import React from 'react';
import { 
    ArrowLeft, 
    Building2, 
    Activity, 
    Pill,
    Stethoscope,
    Printer
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { formatThaiDate } from '../../utils/formatThaiDate';
import { getPatientByHn } from '../../../../../data/patientData';

interface MedicalRecordDetailProps {
    data: {
        date?: Date | string;
        hospital?: string;
        department?: string;
        doctor?: string;
        treatment?: string;
        chiefComplaint?: string;
        presentIllness?: string;
        pastHistory?: string;
        diagnosis?: string;
        title?: string;
        treatmentResult?: string;
        treatmentPlan?: string;
        status?: string;
    };
    patient?: {
        name?: string;
        hn?: string;
        image?: string;
    };
    onBack: () => void;
}

const DetailSection = ({ title, icon: Icon, children, className }: { title: string, icon: any, children: React.ReactNode, className?: string }) => (
    <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                <Icon size={20} />
            </div>
            <h3 className="font-bold text-lg text-[#5e5873]">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const InfoItem = ({ label, value, fullWidth = false }: { label: string, value?: string, fullWidth?: boolean }) => (
    <div className={`${fullWidth ? 'col-span-full' : ''} space-y-1.5`}>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center text-gray-700">
            {value || '-'}
        </div>
    </div>
);

const LargeTextItem = ({ label, value }: { label: string, value?: string }) => (
    <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px] text-gray-700 whitespace-pre-wrap leading-relaxed">
            {value || '-'}
        </div>
    </div>
);

export const MedicalRecordDetail: React.FC<MedicalRecordDetailProps> = ({ data, patient, onBack }) => {
    // Format date using shared Thai date utility
    const formattedDate = formatThaiDate(data.date);

    // Look up patient record from PATIENTS_DATA for age/gender/diagnosis
    const patientRecord = patient?.hn ? getPatientByHn(patient.hn) : undefined;
    const patientDob = patientRecord?.dob;
    const patientGender = patientRecord?.gender;
    const patientDiagnosis = patientRecord?.diagnosis || data.diagnosis || data.title || '-';
    const patientAge = (() => {
        if (!patientDob) return null;
        const dob = new Date(patientDob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const md = today.getMonth() - dob.getMonth();
        if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
        return age;
    })();
    const patientAgeGenderText = [
        patientAge !== null ? `${patientAge} ปี` : null,
        patientGender || null
    ].filter(Boolean).join(' / ') || '-';

    const getStatusLabel = (status?: string) => {
        if (!status) return 'เสร็จสิ้น';
        if (status === 'upcoming') return 'รอตรวจ';
        return 'เสร็จสิ้น';
    };

    const getStatusColor = (status?: string) => {
        if (status === 'upcoming') return 'bg-orange-100 text-orange-700';
        return 'bg-green-100 text-green-700';
    };

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                            รายละเอียดการรักษา
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            ข้อมูลรายละเอียดและบันทึกการรักษา
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Info Card */}
                    {patient && (
                        <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="pb-3 border-b border-gray-50">
                                <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
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
                                </div>
                                {/* Age/Gender & Diagnosis info strip */}
                                <div className="grid grid-cols-2 mt-5 bg-[#F4F9FF] rounded-lg border border-blue-100/60 overflow-hidden">
                                    <div className="px-5 py-3 border-r border-blue-100/60">
                                        <p className="text-xs text-slate-500 mb-0.5">อายุ / เพศ</p>
                                        <p className="text-sm text-slate-800 font-semibold">{patientAgeGenderText}</p>
                                    </div>
                                    <div className="px-5 py-3">
                                        <p className="text-xs text-slate-500 mb-0.5">ผลการวินิจฉัย</p>
                                        <p className="text-sm text-slate-800 font-semibold">{patientDiagnosis}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Medical Record Detail Card */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                        <CardContent className="p-6 space-y-6">
                            
                            {/* General Information */}
                            <DetailSection title="ข้อมูลทั่วไป" icon={Building2}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoItem label="วันที่เข้ารับการรักษา" value={formattedDate} />
                                    <InfoItem label="โรงพยาบาล" value={data.hospital} />
                                    <InfoItem label="สถานที่ / แผนก" value={data.department} />
                                    <InfoItem label="แพทย์ผู้รักษา" value={data.doctor} />
                                </div>
                            </DetailSection>

                            {/* Treatment Info */}
                            <DetailSection title="ข้อมูลการรักษา" icon={Stethoscope}>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoItem label="การรักษา" value={data.treatment} />
                                    <InfoItem label="การวินิจฉัย" value={data.diagnosis || data.title} />
                                 </div>
                            </DetailSection>

                            {/* Symptoms & History */}
                            <DetailSection title="อาการและประวัติ" icon={Activity}>
                                <div className="space-y-6">
                                    <LargeTextItem label="อาการนำ (Chief Complaint)" value={data.chiefComplaint} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <LargeTextItem label="อาการเจ็บป่วยปัจจุบัน (Present Illness)" value={data.presentIllness} />
                                        <LargeTextItem label="อาการเจ็บป่วยในอดีต (Past History)" value={data.pastHistory} />
                                    </div>
                                </div>
                            </DetailSection>

                            {/* Results & Plan */}
                            <DetailSection title="ผลการรักษาและแผนการรักษา" icon={Pill}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <LargeTextItem label="ผลการรักษา" value={data.treatmentResult} />
                                    <LargeTextItem label="แผนการรักษา" value={data.treatmentPlan} />
                                </div>
                            </DetailSection>
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
                                {/* Step 1: Registered */}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#5e5873]">เข้ารับการรักษา</span>
                                        <span className="text-sm text-gray-400">{formattedDate}</span>
                                    </div>
                                </div>

                                {/* Step 2: Treated */}
                                <div className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${data.status !== 'upcoming' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold ${data.status !== 'upcoming' ? 'text-[#5e5873]' : 'text-gray-400'}`}>ดำเนินการรักษา</span>
                                        <span className="text-sm text-gray-400">-</span>
                                    </div>
                                </div>

                                {/* Step 3: Completed */}
                                <div className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${data.status !== 'upcoming' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-bold ${data.status !== 'upcoming' ? 'text-[#5e5873]' : 'text-gray-400'}`}>เสร็จสิ้น</span>
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