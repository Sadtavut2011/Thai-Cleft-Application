import React, { useState } from 'react';
import {
    ChevronLeft,
    Calendar as CalendarIcon,
    Activity,
    Building2,
    ClipboardList,
    Pill,
    Save,
    FileText,
    Stethoscope,
    User,
    ChevronRight,
    Search,
    ArrowLeft,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';
import { Calendar } from '../../../../components/ui/calendar';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { cn } from '../../../../components/ui/utils';
import { Textarea } from '../../../../components/ui/textarea';
import { Card, CardContent } from '../../../../components/ui/card';
import { Separator } from '../../../../components/ui/separator';
import { TreatmentSelector } from '../pages/TreatmentSelector';
import { HospitalSelector } from '../pages/HospitalSelector';
import { RoomSelector } from '../pages/RoomSelector';
import { DoctorSelector } from '../pages/DoctorSelector';

export type MedicalRecordMode = 'general' | 'appointment' | 'referral' | 'telemed';

interface AddMedicalRecordFormProps {
    onBack: () => void;
    onSave: (data: any) => void;
    mode?: MedicalRecordMode;
    initialData?: any;
}

const InputField = ({
    label,
    icon: Icon,
    value,
    onChange,
    placeholder,
    readOnly = false,
    onClick,
    multiline = false,
    className,
    required = false
}: any) => (
    <div className="space-y-2">
        <Label className="text-[#5e5873] font-medium text-sm flex gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative group" onClick={onClick}>
            <div className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-[#7367f0] transition-colors">
                {Icon && <Icon size={18} />}
            </div>
            {multiline ? (
                <Textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className={cn(
                        "pl-10 min-h-[100px] rounded-xl bg-white border-slate-200 focus:border-[#7367f0] focus:ring-[#7367f0]/20 transition-all resize-none",
                        readOnly ? "cursor-pointer hover:bg-slate-50" : "",
                        className
                    )}
                />
            ) : (
                <Input
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    className={cn(
                        "pl-10 h-12 rounded-xl bg-white border-slate-200 focus:border-[#7367f0] focus:ring-[#7367f0]/20 transition-all",
                        readOnly ? "cursor-pointer hover:bg-slate-50" : "",
                        className
                    )}
                />
            )}
            {readOnly && onClick && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronRight size={18} />
                </div>
            )}
        </div>
    </div>
);

export const AddMedicalRecordForm: React.FC<AddMedicalRecordFormProps> = ({
    onBack,
    onSave,
    mode = 'general',
    initialData
}) => {
    const [step, setStep] = useState(1);
    const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);
    const [showHospitalSelector, setShowHospitalSelector] = useState(false);
    const [showRoomSelector, setShowRoomSelector] = useState(false);
    const [showDoctorSelector, setShowDoctorSelector] = useState(false);

    const [formData, setFormData] = useState({
        date: initialData?.date || undefined,
        hospital: initialData?.hospital || 'โรงพยาบาลมหาราชนครเชียงใหม่',
        department: initialData?.department || '',
        treatment: initialData?.treatment || '',
        doctor: initialData?.doctor || '',
        chiefComplaint: initialData?.chiefComplaint || '',
        presentIllness: initialData?.presentIllness || '',
        pastHistory: initialData?.pastHistory || '',
        diagnosis: initialData?.diagnosis || '',
        treatmentResult: initialData?.treatmentResult || '',
        treatmentPlan: initialData?.treatmentPlan || ''
    });

    const getTitle = () => {
        switch (mode) {
            case 'appointment': return 'บันทึกการนัดหมาย';
            case 'referral': return 'บันทึกการรับส่งตัว';
            case 'telemed': return 'บันทึก Tele-med';
            default: return 'เพิ่มบันทึกการรักษา';
        }
    };

    const handleSave = () => {
        onSave({ ...formData, mode });
    };

    const handleNext = () => setStep(2);
    const handlePrev = () => setStep(1);

    if (showTreatmentSelector) {
        return (
            <TreatmentSelector
                initialSelected={formData.treatment}
                onSave={(value) => {
                    setFormData({ ...formData, treatment: value });
                    setShowTreatmentSelector(false);
                }}
                onBack={() => setShowTreatmentSelector(false)}
            />
        );
    }

    if (showHospitalSelector) {
        return (
            <HospitalSelector
                initialSelected={formData.hospital}
                onSave={(value) => {
                    setFormData({ ...formData, hospital: value });
                    setShowHospitalSelector(false);
                }}
                onBack={() => setShowHospitalSelector(false)}
            />
        );
    }

    if (showRoomSelector) {
        return (
            <RoomSelector
                initialSelected={formData.department}
                onSave={(value) => {
                    setFormData({ ...formData, department: value });
                    setShowRoomSelector(false);
                }}
                onBack={() => setShowRoomSelector(false)}
            />
        );
    }

    if (showDoctorSelector) {
        return (
            <DoctorSelector
                initialSelected={formData.doctor}
                onSave={(value) => {
                    setFormData({ ...formData, doctor: value });
                    setShowDoctorSelector(false);
                }}
                onBack={() => setShowDoctorSelector(false)}
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header with Step Indicator */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-[#5e5873]">{getTitle()}</h1>
                        <p className="text-sm text-gray-500">
                            {step === 1 ? "ขั้นตอนที่ 1/2: ข้อมูลทั่วไป" : "ขั้นตอนที่ 2/2: รายละเอียดการรักษา"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", step === 1 ? "bg-[#7367f0]/10 text-[#7367f0]" : "text-gray-400")}>
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", step === 1 ? "bg-[#7367f0] text-white" : "bg-gray-200 text-gray-500")}>1</div>
                        <span className="font-medium">ข้อมูลทั่วไป</span>
                    </div>
                    <div className="h-0.5 w-8 bg-gray-200" />
                    <div className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-colors", step === 2 ? "bg-[#7367f0]/10 text-[#7367f0]" : "text-gray-400")}>
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", step === 2 ? "bg-[#7367f0] text-white" : "bg-gray-200 text-gray-500")}>2</div>
                        <span className="font-medium">รายละเอียด</span>
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl max-w-4xl mx-auto min-h-[600px] flex flex-col">
                <CardContent className="p-8 space-y-8 flex-1">

                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                            {/* Section 1: General Info */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                        <Building2 size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">ข้อมูลสถานที่และแพทย์</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[#5e5873] font-medium text-sm">
                                            วันที่เข้ารับบริการ <span className="text-red-500">*</span>
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="relative cursor-pointer group">
                                                    <div className={cn(
                                                        "flex items-center h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm transition-all hover:border-[#7367f0] focus-visible:ring-[#7367f0]/20",
                                                        !formData.date && "text-slate-400"
                                                    )}>
                                                        {formData.date ? format(formData.date, "dd MMMM yyyy", { locale: th }) : "เลือกวันที่"}
                                                    </div>
                                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#7367f0]">
                                                        <CalendarIcon size={18} />
                                                    </div>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date}
                                                    onSelect={(d: Date | undefined) => d && setFormData({ ...formData, date: d })}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <InputField
                                        label="โรงพยาบาล"
                                        icon={Building2}
                                        value={formData.hospital}
                                        placeholder="แตะเพื่อเลือกโรงพยาบาล"
                                        readOnly
                                        onClick={() => setShowHospitalSelector(true)}
                                        className="cursor-pointer text-[#7367f0] font-medium placeholder:text-gray-400"
                                        required
                                    />

                                    <InputField
                                        label="ห้องตรวจ / แผนก"
                                        icon={ClipboardList}
                                        value={formData.department}
                                        placeholder="แตะเพื่อเลือกห้องตรวจ"
                                        readOnly
                                        onClick={() => setShowRoomSelector(true)}
                                        className="cursor-pointer text-[#7367f0] font-medium placeholder:text-gray-400"
                                    />

                                    <InputField
                                        label="แพทย์ผู้รักษา"
                                        icon={User}
                                        value={formData.doctor}
                                        placeholder="แตะเพื่อเลือกแพทย์"
                                        readOnly
                                        onClick={() => setShowDoctorSelector(true)}
                                        className="cursor-pointer text-[#7367f0] font-medium placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Section 2: Treatment Type */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                        <Stethoscope size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">ประเภทการรักษา</h3>
                                </div>

                                <div className="max-w-xl">
                                    <InputField
                                        label="การรักษา (Treatment)"
                                        icon={Activity}
                                        value={formData.treatment}
                                        placeholder="แตะเพื่อเลือกรายการรักษา"
                                        readOnly
                                        onClick={() => setShowTreatmentSelector(true)}
                                        className="cursor-pointer text-[#7367f0] font-medium placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            {/* Section 3: Symptoms */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">อาการและประวัติ (Symptoms & History)</h3>
                                </div>

                                <div className="space-y-4">
                                    <InputField
                                        label="อาการนำ (Chief Complaint)"
                                        icon={Activity}
                                        value={formData.chiefComplaint}
                                        onChange={(e: any) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                                        placeholder="ระบุอาการสำคัญที่มาพบแพทย์..."
                                        multiline
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="ประวัติเจ็บป่วยปัจจุบัน (Present Illness)"
                                            icon={FileText}
                                            value={formData.presentIllness}
                                            onChange={(e: any) => setFormData({ ...formData, presentIllness: e.target.value })}
                                            placeholder="รายละเอียดอาการ..."
                                            multiline
                                        />
                                        <InputField
                                            label="ประวัติอดีต (Past History)"
                                            icon={FileText}
                                            value={formData.pastHistory}
                                            onChange={(e: any) => setFormData({ ...formData, pastHistory: e.target.value })}
                                            placeholder="โรคประจำตัว, ยาที่แพ้..."
                                            multiline
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Diagnosis & Plan */}
                            <div>
                                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                                    <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                        <Pill size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">การวินิจฉัยและแผนการรักษา</h3>
                                </div>

                                <div className="space-y-4">
                                    <InputField
                                        label="การวินิจฉัย (Diagnosis)"
                                        icon={CheckCircle2}
                                        value={formData.diagnosis}
                                        onChange={(e: any) => setFormData({ ...formData, diagnosis: e.target.value })}
                                        placeholder="ระบุผลการวินิจฉัย..."
                                        multiline
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="ผลการรักษา"
                                            icon={ClipboardList}
                                            value={formData.treatmentResult}
                                            onChange={(e: any) => setFormData({ ...formData, treatmentResult: e.target.value })}
                                            placeholder="ผลลัพธ์หลังการรักษา..."
                                            multiline
                                        />
                                        <InputField
                                            label="แผนการรักษา"
                                            icon={FileText}
                                            value={formData.treatmentPlan}
                                            onChange={(e: any) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                                            placeholder="ยา, นัดหมายครั้งต่อไป..."
                                            multiline
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </CardContent>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 z-10">
                    {step === 1 ? (
                        <>
                            <Button variant="outline" onClick={onBack} className="h-12 px-8 rounded-xl bg-white text-gray-600 hover:bg-gray-50 border-gray-200">
                                ยกเลิก
                            </Button>
                            <Button onClick={handleNext} className="h-12 px-8 rounded-xl bg-[#7367f0] hover:bg-[#685dd8] text-white shadow-lg shadow-indigo-200 gap-2">
                                ถัดไป <ArrowRight size={18} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handlePrev} className="h-12 px-8 rounded-xl bg-white text-gray-600 hover:bg-gray-50 border-gray-200 gap-2">
                                <ArrowLeft size={18} /> ย้อนกลับ
                            </Button>
                            <Button onClick={handleSave} className="h-12 px-8 rounded-xl bg-[#28c76f] hover:bg-[#20a059] text-white shadow-lg shadow-green-200 gap-2">
                                <Save size={18} /> บันทึกข้อมูล
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};
