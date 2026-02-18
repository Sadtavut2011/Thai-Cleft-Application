import React, { useState, useMemo } from 'react';
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
    ArrowRight,
    CalendarPlus,
    MapPin,
    CheckCircle,
    SkipForward,
    AlertTriangle,
    X
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components/ui/popover';
import { Calendar } from '../../../../../components/ui/calendar';

import { cn } from '../../../../../components/ui/utils';
import { Textarea } from '../../../../../components/ui/textarea';
import { Card, CardContent } from '../../../../../components/ui/card';
import { TreatmentSelector } from '../../cm-mobile/patient/TreatmentSelector';
import { HospitalSelector } from './hospitalSelectorweb';
import { RoomSelector } from './RoomSelectorweb';
import { MedicSelector } from './medicSelectorweb';

export type MedicalRecordMode = 'general' | 'appointment' | 'referral' | 'telemed';

// Helper: map appointment status to display config
const getStatusConfig = (status: string) => {
    switch(status?.toLowerCase()) {
        case 'waiting':
            return { color: 'bg-orange-100 text-orange-700', ring: 'bg-orange-500 ring-orange-100', border: 'bg-orange-50 border-orange-200 shadow-sm hover:border-orange-300 hover:shadow-md', text: 'text-orange-900', label: 'รอตรวจ' };
        case 'confirmed':
        case 'checked-in':
        case 'accepted':
            return { color: 'bg-blue-100 text-blue-700', ring: 'bg-blue-500 ring-blue-100', border: 'bg-blue-50 border-blue-200 shadow-sm hover:border-blue-300 hover:shadow-md', text: 'text-blue-900', label: 'ยืนยันแล้ว' };
        case 'cancelled':
        case 'missed':
        case 'rejected':
            return { color: 'bg-red-100 text-red-700', ring: 'bg-red-500 ring-red-100', border: 'bg-red-50 border-red-200 hover:border-red-300', text: 'text-red-900', label: 'ยกเลิก' };
        default:
            return { color: 'bg-green-100 text-green-700', ring: 'bg-green-500 ring-green-100', border: 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300', text: 'text-slate-800', label: 'เสร็จสิ้น' };
    }
};

interface AddMedicalRecordFormProps {
    onBack: () => void;
    onSave: (data: any) => void;
    mode?: MedicalRecordMode;
    initialData?: any;
    patient?: any;
    initialAppointment?: any;
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
    initialData,
    patient,
    initialAppointment
}) => {
    // If initialAppointment is provided (from AppointmentSystem), skip timeline step (step 0)
    // and start at step 1 (General Info) so user can review pre-filled data before proceeding
    const skipTimeline = !!initialAppointment;

    const [step, setStep] = useState(skipTimeline ? 1 : 0);
    const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);
    const [showHospitalSelector, setShowHospitalSelector] = useState(false);
    const [showRoomSelector, setShowRoomSelector] = useState(false);
    const [showDoctorSelector, setShowDoctorSelector] = useState(false);
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
                treatment: initialAppointment.treatment || initialAppointment.title || '',
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
            date: initialData?.date || undefined as Date | undefined,
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

    const getTitle = () => {
        switch (mode) {
            case 'appointment': return 'บันทึกการนัดหมาย';
            case 'referral': return 'บันทึกการรับส่งตัว';
            case 'telemed': return 'บันทึก Tele-med';
            default: return 'เพิ่มบันทึกการรักษา';
        }
    };

    const handleSave = () => {
        onSave({ ...formData, mode, _selectedAppointment: selectedApptData || initialAppointment || null });
    };

    const handleNext = () => {
        if (step === 0) setStep(1);
        else if (step === 1) setStep(2);
    };

    const handlePrev = () => {
        if (step === 2) setStep(1);
        else if (step === 1 && !skipTimeline) setStep(0);
        else onBack();
    };

    // Step labels for indicator
    const getStepLabel = () => {
        if (skipTimeline) {
            return step === 1 
                ? "ขั้นตอนที่ 1/2: ข้อมูลทั่วไป" 
                : "ขั้นตอนที่ 2/2: รายละเอียดการรักษา";
        }
        if (step === 0) return "ขั้นตอนที่ 1/3: เลือกนัดหมาย";
        if (step === 1) return "ขั้นตอนที่ 2/3: ข้อมูลทั่วไป";
        return "ขั้นตอนที่ 3/3: รายละเอียดการรักษา";
    };

    if (showTreatmentSelector) {
        return (
            <TreatmentSelector 
                initialSelected={formData.treatment}
                onSave={(value) => {
                    setFormData({...formData, treatment: value});
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
                    setFormData({...formData, hospital: value});
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
                    setFormData({...formData, department: value});
                    setShowRoomSelector(false);
                }}
                onBack={() => setShowRoomSelector(false)}
            />
        );
    }

    if (showDoctorSelector) {
        return (
            <MedicSelector 
                initialSelected={formData.doctor}
                onSave={(value) => {
                    setFormData({...formData, doctor: value});
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
                      <p className="text-sm text-gray-500">{getStepLabel()}</p>
                   </div>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2">
                    {!skipTimeline && (
                        <>
                            <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg transition-colors", step === 0 ? "bg-[#7367f0]/10 text-[#7367f0]" : step > 0 ? "text-green-600" : "text-gray-400")}>
                                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", step === 0 ? "bg-[#7367f0] text-white" : step > 0 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500")}>
                                    {step > 0 ? <CheckCircle2 size={14} /> : '1'}
                                </div>
                                <span className="font-medium hidden sm:inline">นัดหมาย</span>
                            </div>
                            <div className="h-0.5 w-6 bg-gray-200" />
                        </>
                    )}
                    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg transition-colors", step === 1 ? "bg-[#7367f0]/10 text-[#7367f0]" : step > 1 ? "text-green-600" : "text-gray-400")}>
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", step === 1 ? "bg-[#7367f0] text-white" : step > 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500")}>
                            {step > 1 ? <CheckCircle2 size={14} /> : skipTimeline ? '1' : '2'}
                        </div>
                        <span className="font-medium hidden sm:inline">ข้อมูลทั่วไป</span>
                    </div>
                    <div className="h-0.5 w-6 bg-gray-200" />
                    <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg transition-colors", step === 2 ? "bg-[#7367f0]/10 text-[#7367f0]" : "text-gray-400")}>
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", step === 2 ? "bg-[#7367f0] text-white" : "bg-gray-200 text-gray-500")}>
                            {skipTimeline ? '2' : '3'}
                        </div>
                        <span className="font-medium hidden sm:inline">รายละเอียด</span>
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl max-w-4xl mx-auto min-h-[600px] flex flex-col">
                <CardContent className="p-6 md:p-8 space-y-8 flex-1">
                    
                    {/* Step 0: Appointment Timeline */}
                    {step === 0 && (
                        <div className="animate-in slide-in-from-left-4 duration-300">
                            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                    <CalendarPlus size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">เลือกนัดหมายที่ต้องการบันทึก</h3>
                                    <p className="text-sm text-gray-400 mt-0.5">เลือกนัดหมายเพื่อ pre-fill ข้อมูลอัตโนมัติ หรือกด "ข้าม" เพื่อกรอกเอง</p>
                                </div>
                            </div>

                            {filteredAppointments.length > 0 ? (
                                <div className="relative pl-2 ml-2">
                                    {filteredAppointments.map((appt: any, index: number) => {
                                        const config = getStatusConfig(appt.status);
                                        const isSelected = selectedApptIndex === index;
                                        return (
                                            <div key={index} className="relative pl-8 pb-6 last:pb-0">
                                                {/* Timeline dot */}
                                                <div className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${config.ring}`}></div>
                                                {/* Timeline line */}
                                                {index !== filteredAppointments.length - 1 && <div className="absolute left-[7px] top-6 bottom-0 w-[2px] bg-slate-100"></div>}
                                                
                                                <div 
                                                    className={cn(
                                                        `p-5 rounded-xl border transition-all cursor-pointer`,
                                                        config.border
                                                    )}
                                                    onClick={() => handleSelectAppointment(appt, index)}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className={`text-sm font-bold ${config.label === 'รอตรวจ' ? 'text-orange-600' : 'text-slate-500'}`}>{appt.date}</span>
                                                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${config.color} ${config.label === 'รอตรวจ' ? 'animate-pulse' : ''}`}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <h5 className={`font-bold text-base ${config.text}`}>{appt.title}</h5>
                                                    <div className="text-sm text-slate-500 mt-2 space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={13} className="text-slate-400" /> {appt.location}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <User size={13} className="text-slate-400" /> {appt.doctor}
                                                        </div>
                                                        {appt.note && (
                                                            <div className="flex items-start gap-1.5 text-blue-600/80 mt-1 text-xs">
                                                                <FileText size={12} className="mt-0.5 shrink-0" /> {appt.note}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-slate-400">
                                    <CalendarPlus size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-base">ไม่พบนัดหมายที่รอตรวจหรือยืนยันแล้ว</p>
                                    <p className="text-sm mt-1">กด "ข้าม" เพื่อกรอกข้อมูลเอง</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 1: General Info */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
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
                                                        {formData.date ? formData.date.toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'}) : "เลือกวันที่"}
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

                    {/* Step 2: Details */}
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
                                        onChange={(e: any) => setFormData({...formData, chiefComplaint: e.target.value})}
                                        placeholder="ระบุอาการสำคัญที่มาพบแพทย์..."
                                        multiline
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField 
                                            label="ประวัติเจ็บป่วยปัจจุบัน (Present Illness)"
                                            icon={FileText}
                                            value={formData.presentIllness}
                                            onChange={(e: any) => setFormData({...formData, presentIllness: e.target.value})}
                                            placeholder="รายละเอียดอาการ..."
                                            multiline
                                        />
                                        <InputField 
                                            label="ประวัติอดีต (Past History)"
                                            icon={FileText}
                                            value={formData.pastHistory}
                                            onChange={(e: any) => setFormData({...formData, pastHistory: e.target.value})}
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
                                        onChange={(e: any) => setFormData({...formData, diagnosis: e.target.value})}
                                        placeholder="ระบุผลการวินิจฉัย..."
                                        multiline
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField 
                                            label="ผลการรักษา"
                                            icon={ClipboardList}
                                            value={formData.treatmentResult}
                                            onChange={(e: any) => setFormData({...formData, treatmentResult: e.target.value})}
                                            placeholder="ผลลัพธ์หลังการรักษา..."
                                            multiline
                                        />
                                        <InputField 
                                            label="แผนการรักษา"
                                            icon={FileText}
                                            value={formData.treatmentPlan}
                                            onChange={(e: any) => setFormData({...formData, treatmentPlan: e.target.value})}
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
                    {step === 0 ? (
                        <>
                            <Button variant="outline" onClick={onBack} className="h-12 px-8 rounded-xl bg-white text-gray-600 hover:bg-gray-50 border-gray-200">
                                ยกเลิก
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleNext} 
                                className="h-12 px-8 rounded-xl border-[#7367f0] text-[#7367f0] hover:bg-[#7367f0]/5 gap-2"
                            >
                                <SkipForward size={18} /> ข้าม
                            </Button>
                        </>
                    ) : step === 1 ? (
                        <>
                            <Button variant="outline" onClick={handlePrev} className="h-12 px-8 rounded-xl bg-white text-gray-600 hover:bg-gray-50 border-gray-200 gap-2">
                                <ArrowLeft size={18} /> ย้อนกลับ
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

            {/* Confirmation Dialog for Waiting Appointment */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center">
                        <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
                        <h3 className="text-xl font-bold text-gray-800">ยืนยันการเปลี่ยนสถานะนัดหมาย</h3>
                        <p className="text-sm text-gray-500 mt-2">คุณต้องการเปลี่ยนสถานะนัดหมายจาก "รอตรวจ" เป็น "ยืนยันแล้ว" หรือไม่?</p>
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <Button variant="outline" onClick={handleCancelConfirmDialog} className="h-10 px-4 rounded-xl bg-white text-gray-600 hover:bg-gray-50 border-gray-200">
                                ยกเลิก
                            </Button>
                            <Button onClick={handleConfirmWaitingAppt} className="h-10 px-4 rounded-xl bg-[#28c76f] hover:bg-[#20a059] text-white shadow-lg shadow-green-200 gap-2">
                                ยืนยัน
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
