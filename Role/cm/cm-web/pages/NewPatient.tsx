import React, { useState } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { ChevronRight, ChevronLeft, Calendar, User, Phone, MapPin, CreditCard, Check, ArrowLeft, Globe, Flag, Mail, Heart, AlertCircle, Trash2, Plus, MessageSquare, UserPlus, Pencil, Save, Home, Stethoscope, Shield, Users, Hospital } from "lucide-react";
import { cn } from "../../../../components/ui/utils";

export interface PatientFormData {
    // Step 1 - Identity
    idType?: string;
    idNumber?: string;
    // Step 2 - Patient History
    firstNameTh?: string;
    lastNameTh?: string;
    dob?: string;
    age?: string;
    patientStatus?: string;
    gender?: string;
    phoneMobile?: string;
    diagnosis?: string;
    attendingPhysician?: string;
    // Step 3 - General Info
    firstNameEn?: string;
    lastNameEn?: string;
    race?: string;
    nationality?: string;
    religion?: string;
    maritalStatus?: string;
    occupation?: string;
    phoneHome?: string;
    email?: string;
    bloodGroup?: string;
    foodAllergy?: string;
    // Step 4 - Current Address
    addressNo?: string;
    addressSoi?: string;
    addressRoad?: string;
    addressPostalCode?: string;
    addressProvince?: string;
    addressDistrict?: string;
    addressSubDistrict?: string;
    // Step 5 - Treatment Rights
    mainRight?: string;
    rightHospital?: string;
    subRight?: string;
    // Step 6 - Guardian Info
    guardianFirstNameTh?: string;
    guardianLastNameTh?: string;
    guardianIdCard?: string;
    guardianRelation?: string;
    guardianDob?: string;
    guardianAge?: string;
    guardianPhone?: string;
    guardianOccupation?: string;
    guardianStatus?: string;
    // Step 7 - Hospital Info
    hospital?: string;
    isPrimaryHospital?: boolean;
    hn?: string;
    firstTreatmentDate?: string;
    travelDistance?: string;
    travelTime?: string;
}

interface NewPatientProps {
    onBack: () => void;
    onFinish: () => void;
    // Edit mode props
    editMode?: boolean;
    initialStep?: number;
    initialData?: PatientFormData;
    onSave?: (data: PatientFormData) => void;
}

const STEP_LABELS: Record<number, string> = {
    1: "การระบุตัวตน",
    2: "ประวัติผู้ป่วย",
    3: "ข้อมูลทั่วไป",
    4: "ที่อยู่ปัจจุบัน",
    5: "สิทธิการรักษา",
    6: "ข้อมูลผู้ปกครอง",
    7: "ข้อมูลโรงพยาบาล",
};

const STEP_ICONS: Record<number, React.ElementType> = {
    1: CreditCard,
    2: User,
    3: Globe,
    4: MapPin,
    5: Shield,
    6: Users,
    7: Hospital,
};

const inputStyle = "h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors";
const selectStyle = "h-11 bg-[#F8F8F8] border-none";
const labelStyle = "text-sm font-semibold text-[#5e5873]";

export function NewPatient({ onBack, onFinish, editMode = false, initialStep = 1, initialData, onSave }: NewPatientProps) {
    const [currentStep, setCurrentStep] = useState(editMode ? initialStep : 1);
    const [formValues, setFormValues] = useState<PatientFormData>(initialData || {});
    const totalSteps = 7;

    const updateField = (field: keyof PatientFormData, value: string | boolean) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (editMode) {
            onSave?.(formValues);
            return;
        }
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish();
        }
    };

    const handleBack = () => {
        if (editMode) {
            onBack();
            return;
        }
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            onBack();
        }
    };

    const StepIcon = STEP_ICONS[currentStep] || User;

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-20">
            {/* Header Banner */}
            <div className="bg-white p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-slate-100 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                        {editMode ? (
                            <><Pencil className="w-5 h-5 text-[#7367f0]" /> แก้ไขข้อมูลผู้ป่วย — {STEP_LABELS[currentStep]}</>
                        ) : (
                            <><UserPlus className="w-5 h-5 text-[#7367f0]" /> ลงทะเบียนผู้ป่วยใหม่ (New Patient Registration)</>
                        )}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        {editMode ? "กรุณาแก้ไขข้อมูลแล้วกด \"บันทึก\"" : `ขั้นตอนที่ ${currentStep} จาก ${totalSteps} — ${STEP_LABELS[currentStep]}`}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-[#EBE9F1] p-6 max-w-4xl mx-auto">
                {/* Stepper */}
                {!editMode && (
                    <div className="flex items-center justify-center gap-1.5 mb-8">
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                                <div
                                    className={cn(
                                        "flex items-center justify-center rounded-full transition-all duration-300",
                                        index + 1 === currentStep 
                                            ? "w-9 h-9 bg-[#7367f0] text-white shadow-md shadow-indigo-200" 
                                            : index + 1 < currentStep 
                                                ? "w-7 h-7 bg-[#7367f0]/20 text-[#7367f0]" 
                                                : "w-7 h-7 bg-gray-100 text-gray-400"
                                    )}
                                >
                                    {index + 1 < currentStep ? (
                                        <Check className="w-3.5 h-3.5" />
                                    ) : (
                                        <span className="text-xs font-bold">{index + 1}</span>
                                    )}
                                </div>
                                {index < totalSteps - 1 && (
                                    <div className={cn(
                                        "w-6 h-0.5 rounded-full transition-colors",
                                        index + 1 < currentStep ? "bg-[#7367f0]/30" : "bg-gray-200"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Section Header */}
                <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2 mb-6">
                    <StepIcon className="w-5 h-5 text-[#7367f0]" /> {STEP_LABELS[currentStep]}
                </h3>

                {/* Form Content */}
                <div className="min-h-[400px]">
                    {currentStep === 1 && <Step1Identity onNext={handleNext} onBack={handleBack} editMode={editMode} formValues={formValues} updateField={updateField} />}
                    {currentStep === 2 && <Step2PatientHistory onNext={handleNext} onBack={handleBack} editMode={editMode} formValues={formValues} updateField={updateField} />}
                    {currentStep === 3 && <Step3GeneralInfo onNext={handleNext} onBack={handleBack} editMode={editMode} formValues={formValues} updateField={updateField} />}
                    {currentStep === 4 && <Step4CurrentAddress onNext={handleNext} onBack={handleBack} editMode={editMode} formValues={formValues} updateField={updateField} />}
                    {currentStep === 5 && <Step5TreatmentRights onNext={handleNext} onBack={handleBack} editMode={editMode} formValues={formValues} updateField={updateField} />}
                    {currentStep === 6 && <Step6GuardianInfo onNext={handleNext} onBack={handleBack} editMode={editMode} formValues={formValues} updateField={updateField} />}
                    {currentStep === 7 && <Step7HospitalInfo onNext={handleNext} onBack={handleBack} editMode={editMode} formValues={formValues} updateField={updateField} isLastStep={!editMode} />}
                </div>
            </div>
        </div>
    );
}

// Shared type for step props
interface StepProps {
    onNext: () => void;
    onBack: () => void;
    editMode?: boolean;
    formValues?: PatientFormData;
    updateField?: (field: keyof PatientFormData, value: string | boolean) => void;
    isLastStep?: boolean;
}

// Shared action buttons component
function StepActions({ onNext, onBack, editMode, isLastStep }: { onNext: () => void; onBack: () => void; editMode?: boolean; isLastStep?: boolean }) {
    return (
        <div className="flex justify-between gap-3 pt-6 border-t border-gray-100">
            <Button 
                variant="outline"
                onClick={onBack}
                className="h-11 px-8 text-gray-600"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {editMode ? "ยกเลิก" : "ย้อนกลับ"}
            </Button>
            <Button 
                onClick={onNext}
                className="bg-[#7367f0] hover:bg-[#5e54ce] h-11 px-8 shadow-md shadow-indigo-200 transition-all"
            >
                {editMode ? (
                    <><Save className="w-4 h-4 mr-1" /> บันทึก</>
                ) : isLastStep ? (
                    <><Check className="w-4 h-4 mr-1" /> ยืนยันการลงทะเบียน</>
                ) : (
                    <>ถัดไป <ChevronRight className="w-4 h-4 ml-1" /></>
                )}
            </Button>
        </div>
    );
}

// Step 1: Identity Verification
function Step1Identity({ onNext, onBack, editMode, formValues, updateField }: StepProps) {
    const [selectedType, setSelectedType] = useState<string>(formValues?.idType || "idcard");

    return (
        <div className="space-y-4">
            <div 
                className={cn(
                    "p-5 rounded-lg border-2 cursor-pointer transition-all",
                    selectedType === "idcard" ? "bg-[#7367f0]/5 border-[#7367f0]" : "bg-white border-gray-100 hover:border-gray-200"
                )}
                onClick={() => setSelectedType("idcard")}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#7367f0] rounded-lg flex items-center justify-center text-white">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className={cn("font-medium text-[#5e5873]", selectedType === "idcard" && "font-bold")}>เลขประจำตัวประชาชน</span>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", selectedType === "idcard" ? "border-[#7367f0]" : "border-gray-300")}>
                        {selectedType === "idcard" && <div className="w-2.5 h-2.5 bg-[#7367f0] rounded-full" />}
                    </div>
                </div>
                {selectedType === "idcard" && (
                    <div className="mt-4 pl-14 animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                        <Label className={cn(labelStyle, "mb-2 block")}>หมายเลขบัตรประชาชน 13 หลัก</Label>
                        <Input 
                            placeholder="x-xxxx-xxxxx-xx-x" 
                            className={inputStyle}
                            value={formValues?.idNumber || ""}
                            onChange={(e) => updateField?.("idNumber", e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div 
                className={cn(
                    "p-5 rounded-lg border-2 cursor-pointer transition-all",
                    selectedType === "passport" ? "bg-[#7367f0]/5 border-[#7367f0]" : "bg-white border-gray-100 hover:border-gray-200"
                )}
                onClick={() => setSelectedType("passport")}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#4285f4] rounded-lg flex items-center justify-center text-white">
                            <Globe className="w-5 h-5" />
                        </div>
                        <span className={cn("font-medium text-[#5e5873]", selectedType === "passport" && "font-bold")}>หมายเลขหนังสือเดินทาง</span>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", selectedType === "passport" ? "border-[#7367f0]" : "border-gray-300")}>
                        {selectedType === "passport" && <div className="w-2.5 h-2.5 bg-[#7367f0] rounded-full" />}
                    </div>
                </div>
                {selectedType === "passport" && (
                    <div className="mt-4 pl-14 animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                        <Label className={cn(labelStyle, "mb-2 block")}>หมายเลขหนังสือเดินทาง (Passport No.)</Label>
                        <Input 
                            placeholder="ระบุหมายเลขหนังสือเดินทาง" 
                            className={inputStyle}
                            value={formValues?.idNumber || ""}
                            onChange={(e) => updateField?.("idNumber", e.target.value)}
                        />
                    </div>
                )}
            </div>

            <div 
                className={cn(
                    "p-5 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between",
                    selectedType === "noid" ? "bg-[#7367f0]/5 border-[#7367f0]" : "bg-white border-gray-100 hover:border-gray-200"
                )}
                onClick={() => setSelectedType("noid")}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white relative">
                        <CreditCard className="w-5 h-5" />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[1px]">
                           <div className="w-3 h-3 bg-red-500 rounded-full" />
                        </div>
                    </div>
                    <span className={cn("font-medium text-[#5e5873]", selectedType === "noid" && "font-bold")}>ไม่มี ID ระบุตัวตน</span>
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", selectedType === "noid" ? "border-[#7367f0]" : "border-gray-300")}>
                    {selectedType === "noid" && <div className="w-2.5 h-2.5 bg-[#7367f0] rounded-full" />}
                </div>
            </div>

            <StepActions onNext={onNext} onBack={onBack} editMode={editMode} />
        </div>
    );
}

// Step 2: Patient History (Thai Info)
function Step2PatientHistory({ onNext, onBack, editMode, formValues, updateField }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className={labelStyle}>ชื่อภาษาไทย <span className="text-red-500">*</span></Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุชื่อภาษาไทย"
                        value={formValues?.firstNameTh || ""}
                        onChange={(e) => updateField?.("firstNameTh", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>นามสกุลภาษาไทย <span className="text-red-500">*</span></Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุนามสกุลภาษาไทย"
                        value={formValues?.lastNameTh || ""}
                        onChange={(e) => updateField?.("lastNameTh", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>วันเดือนปีเกิด <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <Input 
                            className={cn(inputStyle, "pr-10")}
                            placeholder="เลือกวันที่"
                            type="date"
                            value={formValues?.dob || ""}
                            onChange={(e) => updateField?.("dob", e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>อายุ</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="คำนวณอายุอัตโนมัติ"
                        readOnly
                        value={formValues?.age || ""}
                    />
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>สถานะของผู้ป่วย</Label>
                    <Select
                        value={formValues?.patientStatus || ""}
                        onValueChange={(value) => updateField?.("patientStatus", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกสถานะของผู้ป่วย" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="normal">ปกติ</SelectItem>
                            <SelectItem value="deceased">เสียชีวิต</SelectItem>
                            <SelectItem value="completed">รักษาเสร็จสิ้น</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>เพศ</Label>
                    <Select
                        value={formValues?.gender || ""}
                        onValueChange={(value) => updateField?.("gender", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกเพศ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">ชาย</SelectItem>
                            <SelectItem value="female">หญิง</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className={labelStyle}>เบอร์โทรศัพท์มือถือ</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุเบอร์โทรศัพท์มือถือ"
                        value={formValues?.phoneMobile || ""}
                        onChange={(e) => updateField?.("phoneMobile", e.target.value)}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className={labelStyle}>การวินิจฉัย</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุการวินิจฉัย"
                        value={formValues?.diagnosis || ""}
                        onChange={(e) => updateField?.("diagnosis", e.target.value)}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className={labelStyle}>แพทย์ผู้ดูแล</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุแพทย์ผู้ดูแล"
                        value={formValues?.attendingPhysician || ""}
                        onChange={(e) => updateField?.("attendingPhysician", e.target.value)}
                    />
                </div>
            </div>

            <StepActions onNext={onNext} onBack={onBack} editMode={editMode} />
        </div>
    );
}

// Step 3: General Info (English + Others)
function Step3GeneralInfo({ onNext, onBack, editMode, formValues, updateField }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className={labelStyle}>ชื่อภาษาอังกฤษ</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุชื่อภาษาอังกฤษ"
                        value={formValues?.firstNameEn || ""}
                        onChange={(e) => updateField?.("firstNameEn", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>นามสกุลภาษาอังกฤษ</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุนามสกุลภาษาอังกฤษ"
                        value={formValues?.lastNameEn || ""}
                        onChange={(e) => updateField?.("lastNameEn", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>เชื้อชาติ</Label>
                    <Select
                        value={formValues?.race || ""}
                        onValueChange={(value) => updateField?.("race", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกเชื้อชาติ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="thai">ไทย</SelectItem>
                            <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>สัญชาติ</Label>
                    <Select
                        value={formValues?.nationality || ""}
                        onValueChange={(value) => updateField?.("nationality", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกสัญชาติ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="thai">ไทย</SelectItem>
                            <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>ศาสนา</Label>
                    <Select
                        value={formValues?.religion || ""}
                        onValueChange={(value) => updateField?.("religion", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกศาสนา" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="buddhism">พุทธ</SelectItem>
                            <SelectItem value="islam">อิสลาม</SelectItem>
                            <SelectItem value="christianity">คริสต์</SelectItem>
                            <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>สถานภาพ</Label>
                    <Select
                        value={formValues?.maritalStatus || ""}
                        onValueChange={(value) => updateField?.("maritalStatus", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกสถานภาพ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="single">โสด</SelectItem>
                            <SelectItem value="married">สมรส</SelectItem>
                            <SelectItem value="divorced">หย่าร้าง</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>อาชีพ</Label>
                    <Select
                        value={formValues?.occupation || ""}
                        onValueChange={(value) => updateField?.("occupation", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกอาชีพ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">นักเรียน/นักศึกษา</SelectItem>
                            <SelectItem value="employee">พนักงานบริษัท</SelectItem>
                            <SelectItem value="government">ข้าราชการ</SelectItem>
                            <SelectItem value="freelance">รับจ้างทั่วไป</SelectItem>
                            <SelectItem value="unemployed">ว่างงาน</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>เบอร์โทรศัพท์บ้าน</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุเบอร์โทรศัพท์บ้าน"
                        value={formValues?.phoneHome || ""}
                        onChange={(e) => updateField?.("phoneHome", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>อีเมล</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุอีเมล"
                        value={formValues?.email || ""}
                        onChange={(e) => updateField?.("email", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>หมู่เลือด</Label>
                    <Select
                        value={formValues?.bloodGroup || ""}
                        onValueChange={(value) => updateField?.("bloodGroup", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกหมู่เลือด" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="O">O</SelectItem>
                            <SelectItem value="AB">AB</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                    <Label className={labelStyle}>ประวัติการแพ้อาหาร</Label>
                    <Select
                        value={formValues?.foodAllergy || ""}
                        onValueChange={(value) => updateField?.("foodAllergy", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกประวัติการแพ้อาหาร" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">ไม่แพ้</SelectItem>
                            <SelectItem value="seafood">อาหารทะเล</SelectItem>
                            <SelectItem value="nuts">ถั่ว</SelectItem>
                            <SelectItem value="dairy">นมวัว</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <StepActions onNext={onNext} onBack={onBack} editMode={editMode} />
        </div>
    );
}

// Step 4: Current Address
function Step4CurrentAddress({ onNext, onBack, editMode, formValues, updateField }: StepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className={labelStyle}>บ้านเลขที่</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุบ้านเลขที่"
                        value={formValues?.addressNo || ""}
                        onChange={(e) => updateField?.("addressNo", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>ซอย</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุซอย"
                        value={formValues?.addressSoi || ""}
                        onChange={(e) => updateField?.("addressSoi", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>ถนน</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุถนน"
                        value={formValues?.addressRoad || ""}
                        onChange={(e) => updateField?.("addressRoad", e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>รหัสไปรษณีย์</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ระบุรหัสไปรษณีย์"
                        value={formValues?.addressPostalCode || ""}
                        onChange={(e) => updateField?.("addressPostalCode", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>จังหวัด</Label>
                    <Select
                        value={formValues?.addressProvince || ""}
                        onValueChange={(value) => updateField?.("addressProvince", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกจังหวัด" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bangkok">กรุงเทพมหานคร</SelectItem>
                            <SelectItem value="nonthaburi">นนทบุรี</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className={labelStyle}>อำเภอ</Label>
                    <Select
                        value={formValues?.addressDistrict || ""}
                        onValueChange={(value) => updateField?.("addressDistrict", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกอำเภอ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pathumthani">ปทุมธานี</SelectItem>
                            <SelectItem value="samutprakan">สมุทรปราการ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className={labelStyle}>ตำบล</Label>
                    <Select
                        value={formValues?.addressSubDistrict || ""}
                        onValueChange={(value) => updateField?.("addressSubDistrict", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกตำบล" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bangkoknoi">บางกอกน้อย</SelectItem>
                            <SelectItem value="bangkokyai">บางกอกใหญ่</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <StepActions onNext={onNext} onBack={onBack} editMode={editMode} />
        </div>
    );
}

// Step 5: Treatment Rights
function Step5TreatmentRights({ onNext, onBack, editMode, formValues, updateField }: StepProps) {
     return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className={labelStyle}>สิทธิหลักในการรับบริการ</Label>
                    <Select
                        value={formValues?.mainRight || ""}
                        onValueChange={(value) => updateField?.("mainRight", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกสิทธิหลักในการรับบริการ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gold">บัตรทอง</SelectItem>
                            <SelectItem value="social">ประกันสังคม</SelectItem>
                            <SelectItem value="civil">ข้าราชการ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className={labelStyle}>ระบุโรงพยาบาล</Label>
                    <Input 
                        className={inputStyle}
                        placeholder="ชื่อโรงพยาบาล"
                        value={formValues?.rightHospital || ""}
                        onChange={(e) => updateField?.("rightHospital", e.target.value)}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label className={labelStyle}>ประเภทสิทธิย่อย</Label>
                    <Select
                        value={formValues?.subRight || ""}
                        onValueChange={(value) => updateField?.("subRight", value)}
                    >
                        <SelectTrigger className={selectStyle}>
                            <SelectValue placeholder="เลือกประเภทสิทธิย่อย" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="type1">ประเภท 1</SelectItem>
                            <SelectItem value="type2">ประเภท 2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <StepActions onNext={onNext} onBack={onBack} editMode={editMode} />
        </div>
    );
}

// Step 6: Guardian Info
function Step6GuardianInfo({ onNext, onBack, editMode, formValues, updateField }: StepProps) {
    const [birthDate, setBirthDate] = useState<string>(formValues?.guardianDob || "");

    const calculateAge = (dateStr: string) => {
        if (!dateStr) return "";
        const today = new Date();
        const dob = new Date(dateStr);
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(birthDate);

    return (
        <div className="space-y-6">
            <Button className="w-full h-11 bg-[#7367f0] hover:bg-[#5e54ce] text-white font-medium flex items-center justify-center gap-2 shadow-md shadow-indigo-200">
                <Plus className="w-4 h-4" /> เพิ่มผู้ปกครอง
            </Button>

            {/* Guardian Card */}
            <div className="rounded-lg border border-[#EBE9F1] p-6 relative">
                <div className="absolute top-4 right-4">
                    <button className="bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3 h-3" /> ลบ
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                        <Label className={labelStyle}>ชื่อภาษาไทย <span className="text-red-500">*</span></Label>
                        <Input 
                            className={inputStyle}
                            placeholder="ระบุชื่อภาษาไทย"
                            value={formValues?.guardianFirstNameTh || ""}
                            onChange={(e) => updateField?.("guardianFirstNameTh", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelStyle}>นามสกุลภาษาไทย <span className="text-red-500">*</span></Label>
                        <Input 
                            className={inputStyle}
                            placeholder="ระบุนามสกุลภาษาไทย"
                            value={formValues?.guardianLastNameTh || ""}
                            onChange={(e) => updateField?.("guardianLastNameTh", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelStyle}>เลขประจำตัวประชาชน</Label>
                        <Input 
                            className={inputStyle}
                            placeholder="ระบุเลขประจำตัวประชาชน"
                            value={formValues?.guardianIdCard || ""}
                            onChange={(e) => updateField?.("guardianIdCard", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelStyle}>ความสัมพันธ์</Label>
                        <Select
                            value={formValues?.guardianRelation || ""}
                            onValueChange={(value) => updateField?.("guardianRelation", value)}
                        >
                            <SelectTrigger className={selectStyle}>
                                <SelectValue placeholder="เลือกความสัมพันธ์" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="parent">บิดา/มารดา</SelectItem>
                                <SelectItem value="relative">ญาติ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className={labelStyle}>วัน/เดือน/ปีเกิด</Label>
                        <div className="relative">
                            <Input 
                                className={cn(inputStyle, "pr-10")}
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className={labelStyle}>อายุ</Label>
                        <Input 
                            className={inputStyle}
                            placeholder="คำนวณอายุอัตโนมัติ"
                            value={age ? `${age} ปี` : ""}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelStyle}>เบอร์โทรศัพท์</Label>
                        <Input 
                            className={inputStyle}
                            placeholder="ระบุเบอร์โทรศัพท์"
                            value={formValues?.guardianPhone || ""}
                            onChange={(e) => updateField?.("guardianPhone", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelStyle}>อาชีพ</Label>
                        <Select
                            value={formValues?.guardianOccupation || ""}
                            onValueChange={(value) => updateField?.("guardianOccupation", value)}
                        >
                            <SelectTrigger className={selectStyle}>
                                <SelectValue placeholder="เลือกอาชีพ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="employee">พนักงานบริษัท</SelectItem>
                                <SelectItem value="business">ธุรกิจส่วนตัว</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelStyle}>สถานะ</Label>
                        <Select
                            value={formValues?.guardianStatus || ""}
                            onValueChange={(value) => updateField?.("guardianStatus", value)}
                        >
                            <SelectTrigger className={selectStyle}>
                                <SelectValue placeholder="เลือกสถานะ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">มีชีวิตอยู่</SelectItem>
                                <SelectItem value="deceased">เสียชีวิต</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <StepActions onNext={onNext} onBack={onBack} editMode={editMode} />
        </div>
    );
}

// Step 7: Hospital Info
function Step7HospitalInfo({ onNext, onBack, editMode, formValues, updateField, isLastStep }: StepProps) {
    return (
        <div className="space-y-6">
            <Button className="w-full h-11 bg-[#7367f0] hover:bg-[#5e54ce] text-white font-medium flex items-center justify-center gap-2 shadow-md shadow-indigo-200">
                <Plus className="w-4 h-4" /> เพิ่มโรงพยาบาล
            </Button>

            {/* Hospital Card */}
            <div className="rounded-lg border border-[#EBE9F1] p-6 relative">
                <div className="absolute top-4 right-4">
                    <button className="bg-red-50 hover:bg-red-100 text-red-500 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3 h-3" /> ลบ
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                        <Label className={labelStyle}>โรงพยาบาล <span className="text-red-500">*</span></Label>
                        <Select
                            value={formValues?.hospital || ""}
                            onValueChange={(value) => updateField?.("hospital", value)}
                        >
                            <SelectTrigger className={selectStyle}>
                                <SelectValue placeholder="เลือกโรงพยาบาล" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hosp1">โรงพยาบาลศิริราช</SelectItem>
                                <SelectItem value="hosp2">โรงพยาบาลจุฬาลงกรณ์</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 flex items-end">
                        <div className="w-full h-11 rounded-lg border border-[#EBE9F1] bg-white flex items-center justify-between px-4">
                            <span className="text-sm font-medium text-[#5e5873]">โรงพยาบาลต้นสังกัด</span>
                            <div className="w-5 h-5 rounded-full border-2 border-[#7367f0] flex items-center justify-center">
                                <div className="w-2.5 h-2.5 bg-[#7367f0] rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className={labelStyle}>HN</Label>
                        <Input 
                            className={inputStyle}
                            placeholder="ระบุ HN"
                            value={formValues?.hn || ""}
                            onChange={(e) => updateField?.("hn", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelStyle}>เข้ารับการรักษาครั้งแรกเมื่อไหร่</Label>
                        <div className="relative">
                            <Input 
                                className={cn(inputStyle, "pr-10")}
                                type="date"
                                value={formValues?.firstTreatmentDate || ""}
                                onChange={(e) => updateField?.("firstTreatmentDate", e.target.value)}
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className={labelStyle}>ระยะทางที่เดินทางมารักษา</Label>
                        <Input 
                            className={inputStyle}
                            placeholder="กิโลเมตร"
                            value={formValues?.travelDistance || ""}
                            onChange={(e) => updateField?.("travelDistance", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={labelStyle}>ระยะเวลาที่เดินทางมารักษา</Label>
                        <Input 
                            className={inputStyle}
                            placeholder="ชั่วโมง:นาที"
                            value={formValues?.travelTime || ""}
                            onChange={(e) => updateField?.("travelTime", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <StepActions onNext={onNext} onBack={onBack} editMode={editMode} isLastStep={isLastStep} />
        </div>
    );
}