import React, { useState, useMemo } from 'react';
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
    Info,
    CalendarPlus,
    AlertTriangle
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components/ui/popover';
import { Calendar } from '../../../../../components/ui/calendar';

import { cn } from '../../../../../components/ui/utils';
import { TreatmentSelector } from '../TreatmentSelector';
import { HospitalSelector } from '../hospitalSelector';
import { RoomSelector } from '../RoomSelector';
import { MedicSelector } from '../medicSelector';

interface AddMedicalRecordFormProps {
    onBack: () => void;
    onSave: (data: any) => void;
    patient?: any;
    initialAppointment?: any;
}

// Helper: map appointment status to display config (same logic as PatientHistoryTab)
const getStatusConfig = (status: string) => {
    switch(status?.toLowerCase()) {
        case 'waiting':
            return { color: 'bg-orange-100 text-orange-700', ring: 'bg-orange-500 ring-orange-100', border: 'bg-orange-50 border-orange-100 shadow-sm hover:border-orange-300', text: 'text-orange-900', label: 'รอตรวจ' };
        case 'confirmed':
        case 'checked-in':
        case 'accepted':
            return { color: 'bg-blue-100 text-blue-700', ring: 'bg-blue-500 ring-blue-100', border: 'bg-blue-50 border-blue-100 shadow-sm hover:border-blue-300', text: 'text-blue-900', label: 'ยืนยันแล้ว' };
        case 'cancelled':
        case 'missed':
        case 'rejected':
            return { color: 'bg-red-100 text-red-700', ring: 'bg-red-500 ring-red-100', border: 'bg-red-50 border-red-100 hover:border-red-300', text: 'text-red-900', label: 'ยกเลิก' };
        default:
            return { color: 'bg-green-100 text-green-700', ring: 'bg-green-500 ring-green-100', border: 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-300', text: 'text-slate-800', label: 'เสร็จสิ้น' };
    }
};

export const AddMedicalRecordForm: React.FC<AddMedicalRecordFormProps> = ({ onBack, onSave, patient, initialAppointment }) => {
    // If initialAppointment is provided (from ConfirmModal/AppointmentSystem), skip timeline step
    const skipTimeline = !!initialAppointment;
    
    const [step, setStep] = useState(skipTimeline ? 1 : 0);
    const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);
    const [showHospitalSelector, setShowHospitalSelector] = useState(false);
    const [showRoomSelector, setShowRoomSelector] = useState(false);
    const [showMedicSelector, setShowMedicSelector] = useState(false);
    const [selectedApptIndex, setSelectedApptIndex] = useState<number | null>(null);
    const [selectedApptData, setSelectedApptData] = useState<any>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingAppt, setPendingAppt] = useState<{ appt: any; index: number } | null>(null);

    // Pre-fill from initialAppointment if provided
    const getInitialFormData = () => {
        if (initialAppointment) {
            const apptDate = initialAppointment.rawDate || initialAppointment.date_time || initialAppointment.date;
            let parsedDate: Date | undefined;
            if (apptDate) {
                const d = new Date(apptDate);
                if (!isNaN(d.getTime())) parsedDate = d;
            }
            return {
                date: parsedDate,
                hospital: initialAppointment.hospital || initialAppointment.location || 'โรงพยาบาลมหาราชนครเชียงใหม่',
                department: initialAppointment.room || initialAppointment.department || '',
                treatment: initialAppointment.treatment || initialAppointment.title || 'Consult คลินิกนมแม่',
                doctor: initialAppointment.doctor || '',
                chiefComplaint: '',
                presentIllness: '',
                pastHistory: '',
                diagnosis: '',
                treatmentResult: '',
                treatmentPlan: ''
            };
        }
        return {
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
        };
    };

    const [formData, setFormData] = useState(getInitialFormData);

    // Filter appointments: only "รอตรวจ" (waiting) and "ยืนยันแล้ว" (confirmed/checked-in/accepted)
    const filteredAppointments = useMemo(() => {
        const history = patient?.appointmentHistory || [];
        return history.filter((appt: any) => {
            const s = (appt.status || '').toLowerCase();
            return s === 'waiting' || s === 'confirmed' || s === 'checked-in' || s === 'accepted';
        }).sort((a: any, b: any) => {
            const dateA = new Date(a.rawDate || a.date).getTime();
            const dateB = new Date(b.rawDate || b.date).getTime();
            return dateB - dateA;
        });
    }, [patient]);

    const handleSelectAppointment = (appt: any, index: number) => {
        const status = (appt.status || '').toLowerCase();

        // If status is "waiting" (รอตรวจ), show confirmation dialog first
        if (status === 'waiting') {
            setPendingAppt({ appt, index });
            setShowConfirmDialog(true);
            return;
        }

        // If status is "confirmed"/"checked-in"/"accepted" (ยืนยันแล้ว), proceed directly
        proceedWithAppointment(appt, index);
    };

    // Helper: pre-fill form data and advance to next step
    const proceedWithAppointment = (appt: any, index: number) => {
        setSelectedApptIndex(index);
        setSelectedApptData(appt);
        // Pre-fill form data from selected appointment
        const apptDate = appt.rawDate || appt.date_time || appt.date;
        let parsedDate: Date | undefined;
        if (apptDate) {
            const d = new Date(apptDate);
            if (!isNaN(d.getTime())) parsedDate = d;
        }
        setFormData(prev => ({
            ...prev,
            date: parsedDate,
            hospital: appt.hospital || appt.location || prev.hospital,
            department: appt.room || appt.department || prev.department,
            treatment: appt.treatment || appt.title || prev.treatment,
            doctor: appt.doctor || prev.doctor,
        }));
        // Auto-advance to step 1
        setTimeout(() => setStep(1), 300);
    };

    // Handle confirm waiting appointment → change to confirmed and proceed
    const handleConfirmWaitingAppt = () => {
        if (!pendingAppt) return;
        const confirmedAppt = { ...pendingAppt.appt, status: 'Confirmed' };
        setShowConfirmDialog(false);
        proceedWithAppointment(confirmedAppt, pendingAppt.index);
        setPendingAppt(null);
    };

    const handleCancelConfirmDialog = () => {
        setShowConfirmDialog(false);
        setPendingAppt(null);
    };

    const handleNext = () => {
        if (step === 0) setStep(1);
        else if (step === 1) setStep(2);
    };

    const handleBack = () => {
        if (step === 2) setStep(1);
        else if (step === 1 && !skipTimeline) setStep(0);
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
                        onClick={handleBack} 
                        className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-white text-lg font-bold">เพิ่มบันทึกการรักษา</h1>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-28">
                {/* Step indicator */}
                <div className="mb-4">
                    <p className="text-sm text-slate-500">
                        {step === 0 ? 'เลือกนัดหมายที่ต้องการบันทึก' : 'กรอกรายละเอียดการรักษา'}
                    </p>
                </div>

                {/* Step 0: Appointment Timeline */}
                {step === 0 && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                            <CalendarPlus className="text-blue-500" /> ประวัตินัดหมาย
                        </h3>

                        {filteredAppointments.length > 0 ? (
                            <div className="relative pl-2 ml-2">
                                {filteredAppointments.map((appt: any, index: number) => {
                                    const config = getStatusConfig(appt.status);
                                    const isSelected = selectedApptIndex === index;
                                    return (
                                        <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${config.ring}`}></div>
                                            {index !== filteredAppointments.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                            
                                            <div 
                                                className={cn(
                                                    `p-4 rounded-xl border transition-all cursor-pointer`,
                                                    config.border
                                                )}
                                                onClick={() => handleSelectAppointment(appt, index)}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-[16px] font-bold ${config.label === 'รอตรวจ' ? 'text-orange-600' : 'text-slate-500'}`}>{appt.date}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.color} ${config.label === 'รอตรวจ' ? 'animate-pulse' : ''}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <h5 className={`font-bold text-[16px] ${config.text}`}>{appt.title}</h5>
                                                <div className="text-[14px] text-slate-500 mt-2 space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} /> {appt.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <User size={12} /> {appt.doctor}
                                                    </div>
                                                    {appt.note && (
                                                        <div className="flex items-center gap-1 text-blue-600/80 mt-1">
                                                            * {appt.note}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-400">
                                <CalendarPlus size={48} className="mx-auto mb-4 opacity-50" />
                                <p>ไม่พบนัดหมายที่รอตรวจหรือยืนยันแล้ว</p>
                            </div>
                        )}
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {/* Date */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">
                                วันที่ที่ได้รับการรักษา *
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="relative cursor-pointer group">
                                        <div className={cn(
                                            "flex items-center h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base transition-all hover:border-[#7066a9]/50",
                                            !formData.date && "text-slate-400"
                                        )}>
                                            {formData.date ? formData.date.toLocaleDateString('th-TH') : "วว/ดด/ปปปป"}
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
                            <Label className="text-base font-bold text-slate-700">โรงพยาบาล *</Label>
                            <div onClick={() => setShowHospitalSelector(true)} className="relative">
                                <Input 
                                    value={formData.hospital}
                                    readOnly
                                    placeholder="ระบุโรงพยาบาล"
                                    className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9] pointer-events-none pr-10"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">ห้องตรวจ</Label>
                            <div onClick={() => setShowRoomSelector(true)} className="relative">
                                <Input 
                                    value={formData.department}
                                    readOnly
                                    placeholder="ห้องตรวจ"
                                    className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9] pointer-events-none pr-10"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Treatment */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">การรักษา *</Label>
                            <div onClick={() => setShowTreatmentSelector(true)} className="relative">
                                <Input 
                                    value={formData.treatment}
                                    readOnly
                                    placeholder="ระบุการรักษา"
                                    className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9] pointer-events-none pr-10"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Doctor */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">ชื่อผู้ที่รักษา</Label>
                            <div onClick={() => setShowMedicSelector(true)} className="relative">
                                <Input 
                                    value={formData.doctor}
                                    readOnly
                                    placeholder="ระบุชื่อแพทย์"
                                    className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9] pointer-events-none pr-10"
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
                            <Label className="text-base font-bold text-slate-700">อาการนำ (Chief Complaint)</Label>
                            <Input 
                                value={formData.chiefComplaint}
                                onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
                                placeholder="ระบุ อาการนำ"
                                className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Present Illness */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">อาการเจ็บป่วยปัจจุบัน (Present illness)</Label>
                            <Input 
                                value={formData.presentIllness}
                                onChange={(e) => setFormData({...formData, presentIllness: e.target.value})}
                                placeholder="ระบุ อาการเจ็บป่วยปัจจุบัน"
                                className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Past History */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">อาการเจ็บป่วยในอดีต (Past history)</Label>
                            <Input 
                                value={formData.pastHistory}
                                onChange={(e) => setFormData({...formData, pastHistory: e.target.value})}
                                placeholder="ระบุ อาการเจ็บป่วยในอดีต"
                                className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Diagnosis */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">การวินิจฉัย</Label>
                            <Input 
                                value={formData.diagnosis}
                                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                                placeholder="ระบุผลการวินิจฉัย"
                                className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Treatment Result */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">ผลการรักษา</Label>
                            <Input 
                                value={formData.treatmentResult}
                                onChange={(e) => setFormData({...formData, treatmentResult: e.target.value})}
                                placeholder="ระบุผลการรักษา"
                                className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9]"
                            />
                        </div>

                        {/* Treatment Plan */}
                        <div className="space-y-1.5">
                            <Label className="text-base font-bold text-slate-700">การวางแผนการรักษา</Label>
                            <Input 
                                value={formData.treatmentPlan}
                                onChange={(e) => setFormData({...formData, treatmentPlan: e.target.value})}
                                placeholder="ระบุการวางแผนการรักษา"
                                className="h-12 bg-white rounded-xl border-slate-200 text-base focus-visible:ring-[#7066a9]"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-slate-100 bg-white" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
                {step === 0 ? (
                    <Button 
                        onClick={handleNext} 
                        variant="outline"
                        className="w-full h-[48px] rounded-xl border-[#7066a9] text-[#7066a9] hover:bg-[#7066a9]/5 text-[16px] font-bold"
                    >
                       ข้าม
                    </Button>
                ) : step === 1 ? (
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
                            onClick={() => {
                                onSave({ ...formData, _selectedAppointment: selectedApptData || initialAppointment || null });
                            }} 
                            className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
                        >
                            บันทึก
                        </Button>
                    </div>
                )}
            </footer>

            {/* Confirm Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black/50 z-[60000] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-[300px] text-center animate-in zoom-in-95 duration-300">
                        <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการเปลี่ยนสถานะนัดหมาย</h3>
                        <p className="text-sm text-gray-500 mb-6">คุณต้องการเปลี่ยนสถานะนัดหมายจาก &quot;รอตรวจ&quot; เป็น &quot;ยืนยันแล้ว&quot; หรือไม่?</p>
                        <div className="flex items-center justify-center gap-3">
                            <Button 
                                onClick={handleCancelConfirmDialog} 
                                variant="outline" 
                                className="h-[44px] px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-[15px] font-bold"
                            >
                                ยกเลิก
                            </Button>
                            <Button 
                                onClick={handleConfirmWaitingAppt} 
                                className="h-[44px] px-6 rounded-xl bg-[#28c76f] hover:bg-[#20a059] text-white shadow-md shadow-green-200 text-[15px] font-bold"
                            >
                                ยืนยัน
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};