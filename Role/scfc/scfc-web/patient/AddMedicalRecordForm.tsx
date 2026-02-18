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
    User
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components/ui/popover';
import { Calendar } from '../../../../../components/ui/calendar';

import { cn } from '../../../../../components/ui/utils';
import { Textarea } from '../../../../../components/ui/textarea';

// Reuse types if needed, or redefine
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
    // Web version: Single page layout, no steps needed for desktop usually
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

    const handleSave = () => {
        onSave({ ...formData, mode });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full font-['IBM_Plex_Sans_Thai']">
            {/* Desktop Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={onBack} className="rounded-full h-10 w-10 border-slate-200">
                        <ChevronLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{getTitle()}</h1>
                        <p className="text-slate-500 text-sm">กรอกข้อมูลการรักษาและอาการผู้ป่วย</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onBack} className="px-6">ยกเลิก</Button>
                    <Button onClick={handleSave} className="bg-[#7066a9] hover:bg-[#5f5690] text-white px-6 gap-2">
                        <Save size={18} /> บันทึกข้อมูล
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Left Column: General Info & History */}
                    <div className="space-y-6">
                         {/* General Info Card */}
                         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-2">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                    <Building2 size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">ข้อมูลสถานที่และแพทย์</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                    {formData.date ? formData.date.toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'}) : "เลือกวันที่"}
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
                                    label="โรงพยาบาล"
                                    icon={Building2}
                                    value={formData.hospital}
                                    onChange={(e: any) => setFormData({...formData, hospital: e.target.value})}
                                    placeholder="ระบุชื่อโรงพยาบาล"
                                />
                            </div>

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

                         {/* Symptoms Card */}
                         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-2">
                                <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                    <Stethoscope size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">อาการและประวัติ</h3>
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
                                label="ประวัติเจ็บป่วยปัจจุบัน (PI)"
                                icon={FileText}
                                value={formData.presentIllness}
                                onChange={(e: any) => setFormData({...formData, presentIllness: e.target.value})}
                                placeholder="รายละเอียดอาการเจ็บป่วย"
                                multiline
                            />
                            <InputField 
                                label="ประวัติอดีต (PH)"
                                icon={FileText}
                                value={formData.pastHistory}
                                onChange={(e: any) => setFormData({...formData, pastHistory: e.target.value})}
                                placeholder="โรคประจำตัว, การแพ้ยา, การผ่าตัดในอดีต"
                                multiline
                            />
                         </div>
                    </div>

                    {/* Right Column: Treatment & Diagnosis */}
                    <div className="space-y-6">
                        {/* Treatment Type */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-2">
                                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                                    <Activity size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">ประเภทการรักษา</h3>
                            </div>
                            <InputField 
                                label="หัวข้อการรักษา"
                                icon={FileText}
                                value={formData.treatment}
                                onChange={(e: any) => setFormData({...formData, treatment: e.target.value})}
                                placeholder="เช่น ตรวจติดตามอาการ, ผ่าตัด, ทำแผล"
                            />
                        </div>

                        {/* Diagnosis & Plan */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-fit">
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-2">
                                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                    <Pill size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">การวินิจฉัยและการรักษา</h3>
                            </div>

                            <InputField 
                                label="การวินิจฉัย (Diagnosis)"
                                icon={Activity}
                                value={formData.diagnosis}
                                onChange={(e: any) => setFormData({...formData, diagnosis: e.target.value})}
                                placeholder="ระบุผลการวินิจฉัย"
                                multiline
                            />

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
            </div>
        </div>
    );
};