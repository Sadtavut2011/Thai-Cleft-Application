import React from 'react';
import { 
    ArrowLeft, 
    Calendar, 
    Building2, 
    ClipboardList, 
    User, 
    Activity, 
    FileText, 
    CheckCircle2, 
    Pill,
    Stethoscope
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

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
        treatmentResult?: string;
        treatmentPlan?: string;
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

export const MedicalRecordDetail: React.FC<MedicalRecordDetailProps> = ({ data, onBack }) => {
    // Format date if it's a valid date object or string
    const formattedDate = data.date 
        ? (data.date instanceof Date 
            ? format(data.date, "dd MMMM yyyy", { locale: th }) 
            : data.date) 
        : '-';

    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-[#5e5873]">รายละเอียดการรักษา</h1>
                    <p className="text-sm text-gray-500">ข้อมูลประวัติการรักษาและการวินิจฉัย</p>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl mb-6">
                <CardContent className="p-8 space-y-8">
                    
                    {/* General Information Section */}
                    <DetailSection title="ข้อมูลทั่วไป" icon={Building2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem label="วันที่เข้ารับบริการ" value={formattedDate} />
                            <InfoItem label="โรงพยาบาล" value={data.hospital} />
                            <InfoItem label="ห้องตรวจ / แผนก" value={data.department} />
                            <InfoItem label="แพทย์ผู้รักษา" value={data.doctor} />
                        </div>
                    </DetailSection>

                    {/* Treatment Type Section */}
                    <DetailSection title="ประเภทการรักษา" icon={Stethoscope}>
                         <div className="grid grid-cols-1 gap-6">
                            <InfoItem label="การรักษา (Treatment)" value={data.treatment} fullWidth />
                         </div>
                    </DetailSection>

                    {/* Symptoms & History Section */}
                    <DetailSection title="อาการและประวัติ" icon={Activity}>
                        <div className="space-y-6">
                            <LargeTextItem label="อาการนำ (Chief Complaint)" value={data.chiefComplaint} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <LargeTextItem label="ประวัติเจ็บป่วยปัจจุบัน (Present Illness)" value={data.presentIllness} />
                                <LargeTextItem label="ประวัติอดีต (Past History)" value={data.pastHistory} />
                            </div>
                        </div>
                    </DetailSection>

                    {/* Diagnosis & Plan Section */}
                    <DetailSection title="การวินิจฉัยและแผนการรักษา" icon={Pill}>
                        <div className="space-y-6">
                            <LargeTextItem label="การวินิจฉัย (Diagnosis)" value={data.diagnosis} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <LargeTextItem label="ผลการรักษา" value={data.treatmentResult} />
                                <LargeTextItem label="แผนการรักษา" value={data.treatmentPlan} />
                            </div>
                        </div>
                    </DetailSection>

                </CardContent>
            </Card>
        </div>
    );
};
