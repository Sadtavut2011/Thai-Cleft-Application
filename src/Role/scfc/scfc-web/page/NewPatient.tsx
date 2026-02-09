import React, { useState } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { ChevronRight, Calendar, User, Phone, MapPin, CreditCard, Check, ArrowLeft, Globe, Flag, Mail, Heart, AlertCircle, Trash2, Plus, MessageSquare, UserPlus } from "lucide-react";
import { cn } from "../../../../components/ui/utils";

interface NewPatientProps {
    onBack: () => void;
    onFinish: () => void;
}

export function NewPatient({ onBack, onFinish }: NewPatientProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 6;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            onBack();
        }
    };

    return (
        <>
            {/* Header / Navigation */}
            <div className="mb-6 bg-[#DFF6F8] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-[#DFF6F8]/80 text-[#5e5873]">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                        <UserPlus className="w-5 h-5" /> ลงทะเบียนผู้ป่วยใหม่ (New Patient Registration)
                    </h1>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex flex-col items-center justify-center mb-8">
                <h1 className="text-xl font-bold text-[#4C4398] mb-4">
                    {currentStep === 1 && "การระบุตัวตน"}
                    {currentStep === 2 && "ประวัติผู้ป่วย"}
                    {currentStep === 3 && "ข้อมูลทั่วไป"}
                    {currentStep === 4 && "สิทธิการรักษา"}
                    {currentStep === 5 && "ข้อมูลผู้ปกครอง"}
                    {currentStep === 6 && "ข้อมูลโรงพยาบาล"}
                </h1>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full transition-colors",
                                index + 1 === currentStep ? "bg-[#4C4398]" : "bg-gray-200"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <div className="bg-transparent min-h-[400px] pb-8">
                {currentStep === 1 && <Step1Identity onNext={handleNext} />}
                {currentStep === 2 && <Step2PatientHistory onNext={handleNext} />}
                {currentStep === 3 && <Step3GeneralInfo onNext={handleNext} />}
                {currentStep === 4 && <Step4TreatmentRights onNext={handleNext} />}
                {currentStep === 5 && <Step5GuardianInfo onNext={handleNext} />}
                {currentStep === 6 && <Step6HospitalInfo onNext={handleNext} isLastStep={true} />}
            </div>
        </>
    );
}

// Step 1: Identity Verification
function Step1Identity({ onNext }: { onNext: () => void }) {
    const [selectedType, setSelectedType] = useState<string>("idcard");

    return (
        <div className="space-y-4">
            <div 
                className={cn(
                    "bg-white p-6 rounded-[16px] border cursor-pointer transition-all",
                    selectedType === "idcard" ? "border-[#4C4398] ring-1 ring-[#4C4398]" : "border-gray-100 hover:border-gray-200"
                )}
                onClick={() => setSelectedType("idcard")}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="text-[16px] font-medium text-[#120d26]">เลขประจำตัวประชาชน</span>
                    </div>
                    <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center", selectedType === "idcard" ? "border-[#4C4398]" : "border-gray-300")}>
                        {selectedType === "idcard" && <div className="w-3 h-3 bg-[#4C4398] rounded-full" />}
                    </div>
                </div>
                {selectedType === "idcard" && (
                    <div className="mt-4 pl-14 animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-2 text-sm font-medium text-gray-700">หมายเลขบัตรประชาชน 13 หลัก</div>
                        <Input placeholder="x-xxxx-xxxxx-xx-x" className="bg-gray-50 border-gray-200 h-11 focus:bg-white transition-colors" />
                    </div>
                )}
            </div>

            <div 
                className={cn(
                    "bg-white p-6 rounded-[16px] border cursor-pointer transition-all",
                    selectedType === "passport" ? "border-[#4C4398] ring-1 ring-[#4C4398]" : "border-gray-100 hover:border-gray-200"
                )}
                onClick={() => setSelectedType("passport")}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center text-white">
                            <Globe className="w-6 h-6" />
                        </div>
                        <span className="text-[16px] font-medium text-[#120d26]">หมายเลขหนังสือเดินทาง</span>
                    </div>
                    <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center", selectedType === "passport" ? "border-[#4C4398]" : "border-gray-300")}>
                        {selectedType === "passport" && <div className="w-3 h-3 bg-[#4C4398] rounded-full" />}
                    </div>
                </div>
                {selectedType === "passport" && (
                    <div className="mt-4 pl-14 animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-2 text-sm font-medium text-gray-700">หมายเลขหนังสือเดินทาง (Passport No.)</div>
                        <Input placeholder="ระบุหมายเลขหนังสือเดินทาง" className="bg-gray-50 border-gray-200 h-11 focus:bg-white transition-colors" />
                    </div>
                )}
            </div>

            <div 
                className={cn(
                    "bg-white p-6 rounded-[16px] border cursor-pointer transition-all flex items-center justify-between",
                    selectedType === "noid" ? "border-[#4C4398] ring-1 ring-[#4C4398]" : "border-gray-100 hover:border-gray-200"
                )}
                onClick={() => setSelectedType("noid")}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                        <CreditCard className="w-6 h-6" />
                        <div className="absolute translate-x-3 translate-y-3 bg-white rounded-full p-[1px]">
                           <div className="w-3 h-3 bg-red-500 rounded-full" />
                        </div>
                    </div>
                    <span className="text-[16px] font-medium text-[#120d26]">ไม่มี ID ระบุตัวตน</span>
                </div>
                <div className={cn("w-6 h-6 rounded-full border flex items-center justify-center", selectedType === "noid" ? "border-[#4C4398]" : "border-gray-300")}>
                    {selectedType === "noid" && <div className="w-3 h-3 bg-[#4C4398] rounded-full" />}
                </div>
            </div>

            <Button 
                onClick={onNext}
                className="w-full h-[56px] rounded-[16px] bg-[#4C4398] hover:bg-[#3f377f] text-white text-[18px] font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-6"
            >
                ถัดไป
                <div className="bg-white/20 rounded-full p-1">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </Button>
        </div>
    );
}

// Step 2: Patient History (Thai Info)
function Step2PatientHistory({ onNext }: { onNext: () => void }) {
    return (
        <div className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">ชื่อภาษาไทย *</label>
                    <Input 
                        className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                        placeholder="ระบุชื่อภาษาไทย"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">นามสกุลภาษาไทย *</label>
                    <Input 
                        className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                        placeholder="ระบุนามสกุลภาษาไทย"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">วันเดือนปีเกิด *</label>
                    <div className="relative">
                        <Input 
                            className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4 pr-10"
                            placeholder="เลือกวันที่"
                            type="date"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">อายุ</label>
                    <Input 
                        className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                        placeholder="คำนวณอายุอัตโนมัติ"
                        readOnly
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">สถานะของผู้ป่วย</label>
                    <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
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
                    <label className="text-[16px] font-medium text-[#120d26]">เพศ</label>
                    <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
                            <SelectValue placeholder="เลือกเพศ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">ชาย</SelectItem>
                            <SelectItem value="female">หญิง</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                 <div className="space-y-2 md:col-span-2">
                    <label className="text-[16px] font-medium text-[#120d26]">เบอร์โทรศัพท์มือถือ</label>
                    <Input 
                        className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                        placeholder="ระบุเบอร์โทรศัพท์มือถือ"
                    />
                </div>
            </div>
        </div>

        <Button 
            onClick={onNext}
            className="w-full h-[56px] rounded-[16px] bg-[#4C4398] hover:bg-[#3f377f] text-white text-[18px] font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
            ถัดไป
            <div className="bg-white/20 rounded-full p-1">
                <ChevronRight className="w-4 h-4" />
            </div>
        </Button>
        </div>
    );
}

// Step 3: General Info (English + Others)
function Step3GeneralInfo({ onNext }: { onNext: () => void }) {
    return (
        <div className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">ชื่อภาษาอังกฤษ</label>
                    <Input 
                        className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                        placeholder="ระบุชื่อภาษาอังกฤษ"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">นามสกุลภาษาอังกฤษ</label>
                    <Input 
                        className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                        placeholder="ระบุนามสกุลภาษาอังกฤษ"
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">เชื้อชาติ</label>
                    <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
                            <SelectValue placeholder="เลือกเชื้อชาติ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="thai">ไทย</SelectItem>
                            <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">สัญชาติ</label>
                    <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
                            <SelectValue placeholder="เลือกสัญชาติ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="thai">ไทย</SelectItem>
                            <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">ศาสนา</label>
                    <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
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
                    <label className="text-[16px] font-medium text-[#120d26]">สถานภาพ</label>
                    <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
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
                    <label className="text-[16px] font-medium text-[#120d26]">อาชีพ</label>
                    <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
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
                    <label className="text-[16px] font-medium text-[#120d26]">เบอร์โทรศัพท์บ้าน</label>
                    <Input 
                        className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                        placeholder="ระบุเบอร์โทรศัพท์บ้าน"
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">อีเมล</label>
                    <Input 
                        className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                        placeholder="ระบุอีเมล"
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-[16px] font-medium text-[#120d26]">หมู่เลือด</label>
                     <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
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
                    <label className="text-[16px] font-medium text-[#120d26]">ประวัติการแพ้อาหาร</label>
                     <Select>
                        <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500">
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
        </div>

        <Button 
            onClick={onNext}
            className="w-full h-[56px] rounded-[16px] bg-[#4C4398] hover:bg-[#3f377f] text-white text-[18px] font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
            ถัดไป
            <div className="bg-white/20 rounded-full p-1">
                <ChevronRight className="w-4 h-4" />
            </div>
        </Button>
        </div>
    );
}

// Step 4: Treatment Rights
function Step4TreatmentRights({ onNext }: { onNext: () => void }) {
     return (
        <div className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm">
            <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[16px] font-bold text-[#120d26]">สิทธิหลักในการรับบริการ</label>
                    <div className="relative">
                        <Select>
                            <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500 pl-12">
                                <SelectValue placeholder="เลือกสิทธิหลักในการรับบริการ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gold">บัตรทอง</SelectItem>
                                <SelectItem value="social">ประกันสังคม</SelectItem>
                                <SelectItem value="civil">ข้าราชการ</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <MessageSquare className="w-5 h-5 fill-gray-500 text-gray-500" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[16px] font-bold text-[#120d26]">ระบุโรงพยาบาล</label>
                     <div className="relative">
                        <Input 
                            className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-12"
                            placeholder="ชื่อโรงพยาบาล"
                        />
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <MessageSquare className="w-5 h-5 fill-gray-500 text-gray-500" />
                        </div>
                    </div>
                </div>

                 <div className="space-y-2">
                    <label className="text-[16px] font-bold text-[#120d26]">ประเภทสิทธิย่อย</label>
                     <div className="relative">
                        <Select>
                            <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500 pl-12">
                                <SelectValue placeholder="เลือกประเภทสิทธิย่อย" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="type1">ประเภท 1</SelectItem>
                                <SelectItem value="type2">ประเภท 2</SelectItem>
                            </SelectContent>
                        </Select>
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            <MessageSquare className="w-5 h-5 fill-gray-500 text-gray-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Button 
            onClick={onNext}
            className="w-full h-[56px] rounded-[16px] bg-[#4C4398] hover:bg-[#3f377f] text-white text-[18px] font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
        >
            ถัดไป
            <div className="bg-white/20 rounded-full p-1">
                <ChevronRight className="w-4 h-4" />
            </div>
        </Button>
        </div>
    );
}

// Step 5: Guardian Info
function Step5GuardianInfo({ onNext }: { onNext: () => void }) {
    const [birthDate, setBirthDate] = useState<string>("");

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
            <Button className="w-full h-[50px] rounded-[12px] bg-[#4C4398] hover:bg-[#3f377f] text-white text-[16px] font-medium flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> เพิ่มผู้ปกครอง
            </Button>

            {/* Guardian Card */}
            <div className="bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm relative">
                <div className="absolute top-4 right-4">
                    <div className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1">
                        DELETE
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                        <label className="text-[16px] font-bold text-[#120d26]">ชื่อภาษาไทย *</label>
                         <div className="relative">
                            <Input 
                                className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-12"
                                placeholder="ระบุชื่อภาษาไทย"
                            />
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <MessageSquare className="w-5 h-5 fill-gray-500 text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[16px] font-bold text-[#120d26]">นามสกุลภาษาไทย *</label>
                         <div className="relative">
                            <Input 
                                className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-12"
                                placeholder="ระบุนามสกุลภาษาไทย"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <MessageSquare className="w-5 h-5 fill-gray-500 text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[16px] font-bold text-[#120d26]">วันเดือนปีเกิด *</label>
                        <div className="relative">
                            <Input 
                                type="date"
                                className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4 pr-10"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                            />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[16px] font-bold text-[#120d26]">อายุ</label>
                        <Input 
                            className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                            value={age}
                            readOnly
                            placeholder="คำนวณอายุอัตโนมัติ"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[16px] font-bold text-[#120d26]">ความเกี่ยวข้อง *</label>
                         <div className="relative">
                            <Select>
                                <SelectTrigger className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-gray-500 pl-12">
                                    <SelectValue placeholder="เลือกความเกี่ยวข้อง" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="father">บิดา</SelectItem>
                                    <SelectItem value="mother">มารดา</SelectItem>
                                    <SelectItem value="relative">ญาติ</SelectItem>
                                </SelectContent>
                            </Select>
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <User className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[16px] font-bold text-[#120d26]">เบอร์โทรศัพท์ *</label>
                         <div className="relative">
                            <Input 
                                className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-12"
                                placeholder="ระบุเบอร์โทรศัพท์"
                            />
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <Phone className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Button 
                onClick={onNext}
                className="w-full h-[56px] rounded-[16px] bg-[#4C4398] hover:bg-[#3f377f] text-white text-[18px] font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
                ถัดไป
                <div className="bg-white/20 rounded-full p-1">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </Button>
        </div>
    );
}

// Step 6: Hospital Info
function Step6HospitalInfo({ onNext, isLastStep }: { onNext: () => void, isLastStep: boolean }) {
    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[16px] font-medium text-[#120d26]">HN</label>
                        <Input 
                            className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                            placeholder="ระบุ HN"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[16px] font-medium text-[#120d26]">วันที่ลงทะเบียน</label>
                        <div className="relative">
                            <Input 
                                type="date"
                                className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4 pr-10"
                            />
                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[16px] font-medium text-[#120d26]">หมายเหตุ</label>
                        <Input 
                            className="h-[50px] rounded-[12px] bg-[#F5F6FA] border-none text-[#120d26] placeholder:text-gray-400 pl-4"
                            placeholder="ระบุหมายเหตุเพิ่มเติม"
                        />
                    </div>
                </div>
            </div>

            <Button 
                onClick={onNext}
                className="w-full h-[56px] rounded-[16px] bg-[#4C4398] hover:bg-[#3f377f] text-white text-[18px] font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
                {isLastStep ? "บันทึกข้อมูล" : "ถัดไป"}
                <div className="bg-white/20 rounded-full p-1">
                    {isLastStep ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
            </Button>
        </div>
    );
}
