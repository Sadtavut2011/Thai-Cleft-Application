import React, { useState } from 'react';
import { 
    ChevronLeft, 
    Calendar as CalendarIcon, 
    Check, 
    ChevronRight, 
    MapPin, 
    Home, 
    Stethoscope, 
    User, 
    AlertCircle, 
    Clock, 
    FileText, 
    CheckCircle, 
    Info
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components/ui/popover';
import { Calendar } from '../../../../../components/ui/calendar';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { cn } from '../../../../../components/ui/utils';
import { TreatmentSelector } from '../TreatmentSelector';
import { HospitalSelector } from '../hospitalSelector';
import { RoomSelector } from '../RoomSelector';
import { MedicSelector } from '../medicSelector';

interface AddMedicalRecordFormProps {
    onBack: () => void;
    onSave: (data: any) => void;
}

export const AddMedicalRecordForm: React.FC<AddMedicalRecordFormProps> = ({ onBack, onSave }) => {
    const [step, setStep] = useState(1);
    const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);
    const [showHospitalSelector, setShowHospitalSelector] = useState(false);
    const [showRoomSelector, setShowRoomSelector] = useState(false);
    const [showMedicSelector, setShowMedicSelector] = useState(false);
    const [formData, setFormData] = useState({
        date: undefined as Date | undefined,
        hospital: 'โรงพยาบาลมหาราชนครเชียงใหม่',
        department: '',
        treatment: 'Consult คลินิกนมแม่',
        doctor: '',
        chiefComplaint: '',
        presentIllness: '',
        pastHistory: '',
        diagnosis: '',
        treatmentResult: '',
        treatmentPlan: ''
    });

    const handleNext = () => {
        if (step === 1) setStep(2);
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
        else onBack();
    };

    return (
        <div className="bg-white h-full flex flex-col w-full relative">
            {showHospitalSelector && (
                <HospitalSelector 
                    initialSelected={formData.hospital}
                    onBack={() => setShowHospitalSelector(false)}
                    onSave={(value) => {
                        setFormData({...formData, hospital: value});
                        setShowHospitalSelector(false);
                    }}
                />
            )}
            {showRoomSelector && (
                <RoomSelector 
                    initialSelected={formData.department}
                    onBack={() => setShowRoomSelector(false)}
                    onSave={(value) => {
                        setFormData({...formData, department: value});
                        setShowRoomSelector(false);
                    }}
                />
            )}
            {showMedicSelector && (
                <MedicSelector 
                    initialSelected={formData.doctor}
                    onBack={() => setShowMedicSelector(false)}
                    onSave={(value) => {
                        setFormData({...formData, doctor: value});
                        setShowMedicSelector(false);
                    }}
                />
            )}
            {showTreatmentSelector && (
                <TreatmentSelector 
                    initialSelected={formData.treatment}
                    onBack={() => setShowTreatmentSelector(false)}
                    onSave={(value) => {
                        setFormData({...formData, treatment: value});
                        setShowTreatmentSelector(false);
                    }}
                />
            )}

            {/* Header */}
            <div className="bg-[#7066a9] w-full shrink-0 z-20">
                <div className="h-[64px] px-4 flex items-center gap-3">
                    <button 
                        onClick={onBack} 
                        className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-white text-lg font-bold">เพิ่มบันทึกการรักษา</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-28">
                <div className="mb-4">
                    <p className="text-sm text-slate-500">กรอกรายละเอียดการรักษา</p>
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {/* Date */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">
                                วันที่ที่ได้รับการรักษา *
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative cursor-pointer group">
                                        <div className={cn(
                                            "flex items-center h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm transition-all hover:border-[#7066a9]/50",
                                            !formData.date && "text-slate-400"
                                        )}>
                                            {formData.date ? format(formData.date, "dd/MM/yyyy") : "วว/ดด/ปปปป"}
                                        </div>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#7066a9]">
                                            <CalendarIcon size={18} />
                                        </div>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date}
                                        onSelect={(d) => setFormData({...formData, date: d})}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Hospital */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">โรงพยาบาล *</Label>
                            <div onClick={() => setShowHospitalSelector(true)} className="relative">
                                <Input 
                                    value={formData.hospital}
                                    readOnly
                                    placeholder="ระบุโรงพยาบาล"
                                    className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9] pointer-events-none pr-10"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">ห้องตรวจ</Label>
                            <div onClick={() => setShowRoomSelector(true)} className="relative">
                                <Input 
                                    value={formData.department}
                                    readOnly
                                    placeholder="ห้องตรวจ"
                                    className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9] pointer-events-none pr-10"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Treatment */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">การรักษา *</Label>
                            <div onClick={() => setShowTreatmentSelector(true)} className="relative">
                                <Input 
                                    value={formData.treatment}
                                    readOnly
                                    placeholder="ระบุการรักษา"
                                    className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9] pointer-events-none pr-10"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Doctor */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">ชื่อผู้ที่รักษา</Label>
                            <div onClick={() => setShowMedicSelector(true)} className="relative">
                                <Input 
                                    value={formData.doctor}
                                    readOnly
                                    placeholder="ระบุชื่อแพทย์"
                                    className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9] pointer-events-none pr-10"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {/* Chief Complaint */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">อาการนำ (Chief Complaint)</Label>
                            <Input 
                                value={formData.chiefComplaint}
                                onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
                                placeholder="ระบุ อาการนำ"
                                className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Present Illness */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">อาการเจ็บป่วยปัจจุบัน (Present illness)</Label>
                            <Input 
                                value={formData.presentIllness}
                                onChange={(e) => setFormData({...formData, presentIllness: e.target.value})}
                                placeholder="ระบุ อาการเจ็บป่วยปัจจุบัน"
                                className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Past History */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">อาการเจ็บป่วยในอดีต (Past history)</Label>
                            <Input 
                                value={formData.pastHistory}
                                onChange={(e) => setFormData({...formData, pastHistory: e.target.value})}
                                placeholder="ระบุ อาการเจ็บป่วยในอดีต"
                                className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Diagnosis */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">การวินิจฉัย</Label>
                            <Input 
                                value={formData.diagnosis}
                                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                                placeholder="ระบุผลการวินิจฉัย"
                                className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Treatment Result */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">ผลการรักษา</Label>
                            <Input 
                                value={formData.treatmentResult}
                                onChange={(e) => setFormData({...formData, treatmentResult: e.target.value})}
                                placeholder="ระบุผลการรักษา"
                                className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Treatment Plan */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-bold text-slate-700">การวางแผนการรักษา</Label>
                            <Input 
                                value={formData.treatmentPlan}
                                onChange={(e) => setFormData({...formData, treatmentPlan: e.target.value})}
                                placeholder="ระบุการวางแผนการรักษา"
                                className="h-[48px] rounded-xl border-slate-200 text-sm focus-visible:ring-[#7066a9]"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-slate-100 bg-white" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
                {step === 1 ? (
                     <Button 
                        onClick={handleNext} 
                        className="w-full h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
                    >
                       ถัดไป
                     </Button>
                ) : (
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            onClick={handleBack} 
                            className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[16px] font-bold"
                        >
                            กลับ
                        </Button>
                        <Button 
                            onClick={() => onSave(formData)} 
                            className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
                        >
                            บันทึก
                        </Button>
                    </div>
                )}
            </footer>
        </div>
    );
};
