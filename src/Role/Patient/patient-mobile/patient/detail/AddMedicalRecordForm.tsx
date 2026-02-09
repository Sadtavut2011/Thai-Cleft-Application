import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, 
    Calendar as CalendarIcon, 
    ChevronRight, 
    Stethoscope, 
    User, 
    FileText, 
    Activity, 
    Building2, 
    ClipboardList, 
    Pill 
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components/ui/popover';
import { Calendar } from '../../../../../components/ui/calendar';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { cn } from '../../../../../components/ui/utils';
import { Textarea } from '../../../../../components/ui/textarea';

export type MedicalRecordMode = 'general' | 'appointment' | 'referral' | 'telemed';

interface AddMedicalRecordFormProps {
    onBack: () => void;
    onSave: (data: any) => void;
    mode?: MedicalRecordMode;
    initialData?: any;
}

// Internal reusable InputField component
const InputField = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange, 
    placeholder, 
    readOnly = false,
    onClick,
    multiline = false
}: any) => (
    <div className="space-y-2">
        <Label className="text-slate-700 font-semibold text-sm">
            {label}
        </Label>
        <div className="relative group">
            <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-[#7066a9] transition-colors">
                <Icon size={18} />
            </div>
            {multiline ? (
                <Textarea 
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onClick={onClick}
                    className={cn(
                        "pl-10 min-h-[80px] rounded-xl bg-white border-slate-200 focus:border-[#7066a9] focus:ring-[#7066a9]/20 transition-all resize-none",
                        readOnly ? "cursor-pointer hover:bg-slate-50" : ""
                    )}
                />
            ) : (
                <Input 
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onClick={onClick}
                    className={cn(
                        "pl-10 h-[48px] rounded-xl bg-white border-slate-200 focus:border-[#7066a9] focus:ring-[#7066a9]/20 transition-all",
                        readOnly ? "cursor-pointer hover:bg-slate-50" : ""
                    )}
                />
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
    
    // Initialize form data with defaults based on mode if needed
    const [formData, setFormData] = useState({
        date: initialData?.date || new Date(),
        hospital: initialData?.hospital || 'โรงพยาบาลมหาราชนครเชียงใหม่',
        department: initialData?.department || '',
        treatment: initialData?.treatment || (mode === 'telemed' ? 'Tele-consultation' : 'Consult คลินิกนมแม่'),
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

    const handleNext = () => {
        if (step === 1) setStep(2);
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
        else onBack();
    };

    const handleSave = () => {
        onSave({ ...formData, mode });
    };

    return (
        <div className="bg-slate-50 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 h-[64px] px-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-slate-800 text-lg font-bold leading-tight">{getTitle()}</h1>
                        <p className="text-xs text-slate-500">
                            Step {step} of 2: {step === 1 ? 'ข้อมูลทั่วไป' : 'ข้อมูลทางคลินิก'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-6">
                    
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Section: General Info */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-2">
                                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                        <Building2 size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">ข้อมูลสถานที่และแพทย์</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-semibold text-sm">
                                            วันที่เข้ารับบริการ <span className="text-red-500">*</span>
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <div className="relative cursor-pointer group">
                                                    <div className={cn(
                                                        "flex items-center h-[48px] w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm transition-all hover:border-[#7066a9] focus-visible:ring-[#7066a9]/20",
                                                        !formData.date && "text-slate-400"
                                                    )}>
                                                        {formData.date ? format(formData.date, "dd MMMM yyyy", { locale: th }) : "เลือกวันที่"}
                                                    </div>
                                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#7066a9]">
                                                        <CalendarIcon size={18} />
                                                    </div>
                                                </div>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.date}
                                                    onSelect={(d) => d && setFormData({...formData, date: d})}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <InputField 
                                        label="โรงพยาบาล/สถานพยาบาล"
                                        icon={Building2}
                                        value={formData.hospital}
                                        onChange={(e: any) => setFormData({...formData, hospital: e.target.value})}
                                        placeholder="ระบุชื่อโรงพยาบาล"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InputField 
                                            label="แผนก/คลินิก"
                                            icon={ClipboardList}
                                            value={formData.department}
                                            onChange={(e: any) => setFormData({...formData, department: e.target.value})}
                                            placeholder="ระบุแผนก"
                                        />
                                        <InputField 
                                            label="แพทย์ผู้รักษา"
                                            icon={User}
                                            value={formData.doctor}
                                            onChange={(e: any) => setFormData({...formData, doctor: e.target.value})}
                                            placeholder="ระบุชื่อแพทย์"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Treatment Type */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-2">
                                    <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">ประเภทการรักษา</h3>
                                </div>
                                <InputField 
                                    label="หัวข้อการรักษา"
                                    icon={FileText}
                                    value={formData.treatment}
                                    onChange={(e: any) => setFormData({...formData, treatment: e.target.value})}
                                    placeholder="เช่น ตรวจติดตามอาการ, ผ่าตัด, ทำแผล"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Section: Symptoms */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-2">
                                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                        <Stethoscope size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">อาการและประวัติ</h3>
                                </div>

                                <InputField 
                                    label="อาการสำคัญ (Chief Complaint)"
                                    icon={Activity}
                                    value={formData.chiefComplaint}
                                    onChange={(e: any) => setFormData({...formData, chiefComplaint: e.target.value})}
                                    placeholder="ระบุอาการสำคัญที่มาพบแพทย์"
                                    multiline
                                />

                                <InputField 
                                    label="ประวัติเจ็บป่วยปัจจุบัน (Present Illness)"
                                    icon={FileText}
                                    value={formData.presentIllness}
                                    onChange={(e: any) => setFormData({...formData, presentIllness: e.target.value})}
                                    placeholder="รายละเอียดอาการเจ็บป่วย"
                                    multiline
                                />

                                <InputField 
                                    label="ประวัติอดีต (Past History)"
                                    icon={FileText}
                                    value={formData.pastHistory}
                                    onChange={(e: any) => setFormData({...formData, pastHistory: e.target.value})}
                                    placeholder="โรคประจำตัว, การแพ้ยา, การผ่าตัดในอดีต"
                                    multiline
                                />
                            </div>

                            {/* Section: Diagnosis & Plan */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-2">
                                    <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                        <Pill size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">การวินิจฉัยและการรักษา</h3>
                                </div>

                                <InputField 
                                    label="การวินิจฉัย (Diagnosis)"
                                    icon={Activity}
                                    value={formData.diagnosis}
                                    onChange={(e: any) => setFormData({...formData, diagnosis: e.target.value})}
                                    placeholder="ระบุผลการวินิจฉัย"
                                    multiline
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField 
                                        label="ผลการรักษา"
                                        icon={ClipboardList}
                                        value={formData.treatmentResult}
                                        onChange={(e: any) => setFormData({...formData, treatmentResult: e.target.value})}
                                        placeholder="ผลลัพธ์หลังการรักษา"
                                        multiline
                                    />
                                    <InputField 
                                        label="แผนการรักษา"
                                        icon={FileText}
                                        value={formData.treatmentPlan}
                                        onChange={(e: any) => setFormData({...formData, treatmentPlan: e.target.value})}
                                        placeholder="ยาที่สั่งจ่าย, นัดหมายครั้งต่อไป"
                                        multiline
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-white border-t border-slate-200 p-4 shrink-0 z-50">
                <div className="max-w-2xl mx-auto flex gap-3">
                    {step === 1 ? (
                         <Button 
                            onClick={handleNext} 
                            className="w-full h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold transition-all active:scale-[0.98]"
                        >
                           ถัดไป
                           <ChevronRight size={20} className="ml-2" />
                         </Button>
                    ) : (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={handleBack} 
                                className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[16px] font-bold"
                            >
                                ย้อนกลับ
                            </Button>
                            <Button 
                                onClick={handleSave} 
                                className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold transition-all active:scale-[0.98]"
                            >
                                บันทึกข้อมูล
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
