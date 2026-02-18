import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Textarea } from "../../../../../components/ui/textarea";
import { 
    Upload, Save, ArrowLeft, Camera, 
    ChevronRight, ChevronLeft, ClipboardList, Users, Building2, 
    Check, Printer, Settings, User, Stethoscope, MessageSquare, 
    Truck, Ear, SmilePlus, Brain, Image as ImageIcon
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner@2.0.3";
import { VisitSelectorWeb } from "./VisitSelectorWeb";

interface HomeVisitFormsProps {
    onBack?: () => void;
    onSave?: (data: any) => void;
    readOnly?: boolean;
    initialData?: any;
    initialPatientId?: string;
    patientName?: string;
}

const STEPS = [
    // Part 0 — Setup
    { part: 0, title: "ตั้งค่าเบื้องต้น", subtitle: "ข้อมูลเบื้องต้น", id: "setup" },
    // Part 1
    { part: 1, title: "ข้อมูลทั่วไป", subtitle: "ข้อมูลผู้ป่วย", id: "patient" },
    { part: 1, title: "ข้อมูลทั่วไป", subtitle: "ข้อมูลผู้ปกครอง", id: "guardian" },
    { part: 1, title: "ข้อมูลทั่วไป", subtitle: "การเดินทาง", id: "travel" },
    // Part 2
    { part: 2, title: "ประวัติการรักษา", subtitle: "การผ่าตัด", id: "surgery" },
    { part: 2, title: "ประวัติการรักษา", subtitle: "พัฒนาการและการได้ยิน", id: "dev_hearing" },
    { part: 2, title: "ประวัติการรักษา", subtitle: "ทันตกรรม", id: "dental" },
    { part: 2, title: "ประวัติการรักษา", subtitle: "แบบประเมินความเครียด", id: "st5" },
    // Part 3
    { part: 3, title: "ข้อเสนอแนะ", subtitle: "ข้อเสนอแนะ", id: "feedback" },
    { part: 3, title: "ข้อเสนอแนะ", subtitle: "หลักฐานรูปถ่าย", id: "evidence" },
];

const STEP_ICONS: Record<string, React.ElementType> = {
    setup: Settings,
    patient: User,
    guardian: Users,
    travel: Truck,
    surgery: Stethoscope,
    dev_hearing: Ear,
    dental: SmilePlus,
    st5: Brain,
    feedback: MessageSquare,
    evidence: Camera,
};

export function HomeVisitForms({ onBack, onSave, readOnly = false, initialData = {}, initialPatientId, patientName }: HomeVisitFormsProps) {
    const [currentStep, setCurrentStep] = useState(0);

    // Setup step states
    const [visitDate, setVisitDate] = useState(initialData?.visitDate || '');
    const [visitType, setVisitType] = useState<'joint' | 'delegated'>(initialData?.visitType || 'joint');
    const [selectedVisitForm, setSelectedVisitForm] = useState(initialData?.visitForm || '');
    const [showVisitSelector, setShowVisitSelector] = useState(false);

    // Form States
    const [lipSurgeryStatus, setLipSurgeryStatus] = useState(initialData?.lipSurgeryStatus || "none");
    const [palateSurgeryStatus, setPalateSurgeryStatus] = useState(initialData?.palateSurgeryStatus || "none");
    const [speechStatus, setSpeechStatus] = useState(initialData?.speechStatus || "no");
    const [hearingStatus, setHearingStatus] = useState(initialData?.hearingStatus || "no");
    const [travelProblemStatus, setTravelProblemStatus] = useState(initialData?.travelProblemStatus || "no");

    const totalSteps = STEPS.length;
    const currentStepData = STEPS[currentStep];

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        } else if (onBack) {
            onBack();
        }
    };

    const handleSaveDraft = () => {
        const draftData = {
            lipSurgeryStatus,
            palateSurgeryStatus,
            speechStatus,
            hearingStatus,
            travelProblemStatus,
            currentStep,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('home_visit_draft', JSON.stringify(draftData));
        toast.success("บันทึกร่างเรียบร้อยแล้ว", {
            description: "ข้อมูลถูกบันทึกในเครื่องสำหรับใช้งานออฟไลน์"
        });
    };

    // --- Step Content (shared logic with mobile) ---
    const renderStepContent = () => {
        const id = currentStepData.id;
        switch (id) {
            case "setup":
                return (
                    <div className="space-y-7 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* วันที่นัดหมาย */}
                        <div className="space-y-2">
                            <Label className="text-[#5e5873] font-semibold text-sm">วันที่นัดหมาย</Label>
                            <Input
                                type="date"
                                value={visitDate}
                                onChange={(e) => setVisitDate(e.target.value)}
                                className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg block"
                                disabled={readOnly}
                            />
                        </div>

                        {/* ค้นหาผู้ป่วย */}
                        <div className="space-y-2">
                            <Label className="text-[#5e5873] font-semibold text-sm">ค้นหาผู้ป่วย</Label>
                            <div className="h-11 bg-[#F8F8F8] rounded-lg flex items-center px-4 border border-[#7367f0]/20">
                                <span className="text-[#5e5873]">{patientName || initialPatientId || '—'}</span>
                            </div>
                        </div>

                        {/* รูปแบบการเยี่ยม */}
                        <div className="space-y-3">
                            <Label className="text-[#5e5873] font-semibold text-sm">รูปแบบการเยี่ยม</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* ลงเยี่ยมร่วม */}
                                <button
                                    type="button"
                                    onClick={() => !readOnly && setVisitType('joint')}
                                    className={cn(
                                        "p-4 rounded-lg border text-left transition-all",
                                        visitType === 'joint'
                                            ? 'border-[#7367f0] bg-[#7367f0]/5'
                                            : 'border-slate-200 bg-[#F8F8F8] hover:border-slate-300'
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Users size={16} className={visitType === 'joint' ? 'text-[#7367f0]' : 'text-slate-400'} />
                                        <span className={cn("font-semibold text-[15px]", visitType === 'joint' ? 'text-[#7367f0]' : 'text-[#5e5873]')}>ลงเยี่ยมร่วม</span>
                                    </div>
                                    <p className={cn("text-[13px] leading-snug", visitType === 'joint' ? 'text-[#7367f0]/70' : 'text-slate-400')}>
                                        รพ. ลงเยี่ยมพร้อม รพ.สต.
                                    </p>
                                </button>
                                {/* ฝากเยี่ยม */}
                                <button
                                    type="button"
                                    onClick={() => !readOnly && setVisitType('delegated')}
                                    className={cn(
                                        "p-4 rounded-lg border text-left transition-all",
                                        visitType === 'delegated'
                                            ? 'border-[#7367f0] bg-[#7367f0]/5'
                                            : 'border-slate-200 bg-[#F8F8F8] hover:border-slate-300'
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Building2 size={16} className={visitType === 'delegated' ? 'text-[#7367f0]' : 'text-slate-400'} />
                                        <span className={cn("font-semibold text-[15px]", visitType === 'delegated' ? 'text-[#7367f0]' : 'text-[#5e5873]')}>ฝากเยี่ยม</span>
                                    </div>
                                    <p className={cn("text-[13px] leading-snug", visitType === 'delegated' ? 'text-[#7367f0]/70' : 'text-slate-400')}>
                                        ฝาก รพ.สต. เยี่ยมให้
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* ฟอร์มเยี่ยมบ้าน */}
                        <div className="space-y-2">
                            <Label className="text-[#5e5873] font-semibold text-sm">ฟอร์มเยี่ยมบ้าน</Label>
                            <button
                                type="button"
                                onClick={() => !readOnly && setShowVisitSelector(true)}
                                className={cn(
                                    "w-full h-11 rounded-lg flex items-center justify-between px-4 transition-colors border",
                                    selectedVisitForm
                                        ? "border-[#7367f0] bg-[#7367f0]/5"
                                        : "bg-[#F8F8F8] border-slate-200 hover:bg-slate-100"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <ClipboardList size={18} className={selectedVisitForm ? "text-[#7367f0]" : "text-slate-400"} />
                                    <span className={cn("text-sm", selectedVisitForm ? 'text-[#5e5873]' : 'text-slate-400')}>
                                        {selectedVisitForm || 'เลือกฟอร์มเยี่ยมบ้าน...'}
                                    </span>
                                </div>
                                <ChevronRight size={18} className="text-slate-400" />
                            </button>
                        </div>

                    </div>
                );

            case "patient":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">ชื่อ-นามสกุล</Label>
                                <Input placeholder="ระบุชื่อ-นามสกุล" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" defaultValue={initialData?.patientName} disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">วันเดือนปีเกิด</Label>
                                <Input type="date" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg block" defaultValue={initialData?.dob} disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">อายุ (ปี)</Label>
                                <Input type="number" placeholder="ระบุอายุ" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" defaultValue={initialData?.age} disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">เลขบัตรประชาชน</Label>
                                <Input placeholder="ระบุเลขบัตรประชาชน 13 หลัก" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" defaultValue={initialData?.idCard} disabled={readOnly} />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">ที่อยู่ปัจจุบัน</Label>
                                <Textarea placeholder="ระบุที่อยู่ปัจจุบัน" rows={3} className="bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg p-4" defaultValue={initialData?.address} disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">เบอร์โทรศัพท์</Label>
                                <Input placeholder="ระบุเบอร์โทรศัพท์" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" defaultValue={initialData?.phone} disabled={readOnly} />
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <Label className="text-sm font-semibold text-[#5e5873]">การวินิจฉัยอาการ (Diagnosis)</Label>
                            <div className="flex flex-col gap-3">
                                {[
                                    { id: 'cleft-lip-w', label: 'ปากแหว่ง (Cleft Lip)', key: 'Cleft Lip' },
                                    { id: 'cleft-palate-w', label: 'เพดานโหว่ (Cleft Palate)', key: 'Cleft Palate' },
                                    { id: 'both-w', label: 'เป็นทั้งสองอย่าง', key: 'Both' },
                                    { id: 'other-diag-w', label: 'ความผิดปกติอื่นร่วมด้วย', key: 'Other' },
                                ].map(item => (
                                    <div key={item.id} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                        <Checkbox id={item.id} disabled={readOnly} defaultChecked={initialData?.diagnosis?.includes(item.key)} />
                                        <Label htmlFor={item.id} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case "guardian":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">ชื่อ-นามสกุลผู้ปกครอง</Label>
                                <Input placeholder="ระบุชื่อ-นามสกุล" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">ความสัมพันธ์กับผู้ป่วย</Label>
                                <RadioGroup defaultValue="father">
                                    <div className="flex flex-col gap-3">
                                        {[
                                            { value: 'father', label: 'บิดา', id: 'w-rel-father' },
                                            { value: 'mother', label: 'มารดา', id: 'w-rel-mother' },
                                            { value: 'relative', label: 'ญาติ', id: 'w-rel-relative' },
                                            { value: 'other', label: 'อื่น ๆ', id: 'w-rel-other' },
                                        ].map(item => (
                                            <div key={item.id} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                                <RadioGroupItem value={item.value} id={item.id} />
                                                <Label htmlFor={item.id} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">อาชีพ</Label>
                                <Input placeholder="ระบุอาชีพ" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">รายได้ต่อเดือน (บาท)</Label>
                                <Input type="number" placeholder="ระบุรายได้" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">ที่อยู่และเบอร์ติดต่อ</Label>
                                <Textarea placeholder="ระบุที่อยู่และเบอร์ติดต่อ (หากต่างจากผู้ป่วย)" rows={2} className="bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg p-4" disabled={readOnly} />
                            </div>
                        </div>
                    </div>
                );

            case "travel":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">พาหนะที่ใช้เดินทาง</Label>
                                <Input placeholder="เช่น รถยนต์ส่วนตัว, รถโดยสาร" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">ระยะทางในการเดินทางมารักษา (กม.)</Label>
                                <Input type="number" placeholder="ระบุระยะทาง" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <Label className="text-sm font-semibold text-[#5e5873]">ปัญหาในการเดินทาง</Label>
                            <div className="space-y-4">
                                <RadioGroup value={travelProblemStatus} onValueChange={v => !readOnly && setTravelProblemStatus(v)}>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                            <RadioGroupItem value="no" id="w-travel-no" />
                                            <Label htmlFor="w-travel-no" className="font-normal text-[#5e5873] flex-1 cursor-pointer">ไม่มีปัญหา</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                            <RadioGroupItem value="yes" id="w-travel-yes" />
                                            <Label htmlFor="w-travel-yes" className="font-normal text-[#5e5873] flex-1 cursor-pointer">มีปัญหา</Label>
                                        </div>
                                    </div>
                                </RadioGroup>

                                {travelProblemStatus === 'yes' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label className="text-sm font-semibold text-[#5e5873]">ระบุสาเหตุ</Label>
                                        <Input placeholder="ระบุปัญหาในการเดินทาง" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case "surgery":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Cleft Lip Surgery */}
                            <div>
                                <h4 className="mb-3 text-[#5e5873] font-semibold text-sm">1.1 การผ่าตัดเย็บปิดปากแหว่ง</h4>
                                <div className="space-y-4">
                                    <RadioGroup value={lipSurgeryStatus} onValueChange={v => !readOnly && setLipSurgeryStatus(v)}>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { value: 'none', label: 'ไม่ต้องผ่าตัด', id: 'w-lip-none' },
                                                { value: 'not-yet', label: 'ยังไม่ได้ผ่าตัด', id: 'w-lip-not-yet' },
                                                { value: 'waiting', label: 'กำลังรอคิว', id: 'w-lip-waiting' },
                                                { value: 'done', label: 'ผ่าตัดเรียบร้อยแล้ว', id: 'w-lip-done' },
                                            ].map(item => (
                                                <div key={item.id} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                                    <RadioGroupItem value={item.value} id={item.id} />
                                                    <Label htmlFor={item.id} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>

                                    {lipSurgeryStatus === 'waiting' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label className="text-sm font-semibold text-[#5e5873]">วันที่นัดผ่าตัด</Label>
                                            <Input type="date" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg block" disabled={readOnly} />
                                        </div>
                                    )}

                                    {lipSurgeryStatus === 'done' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-[#5e5873]">อายุตอนผ่าตัด</Label>
                                                <Input placeholder="ระบุอายุ" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-[#5e5873]">โรงพยาบาล</Label>
                                                <Input placeholder="ระบุโรงพยาบาล" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cleft Palate Surgery */}
                            <div>
                                <h4 className="mb-3 text-[#5e5873] font-semibold text-sm">1.2 การผ่าตัดเย็บปิดเพดานโหว่</h4>
                                <div className="space-y-4">
                                    <RadioGroup value={palateSurgeryStatus} onValueChange={v => !readOnly && setPalateSurgeryStatus(v)}>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { value: 'none', label: 'ไม่ต้องผ่าตัด', id: 'w-palate-none' },
                                                { value: 'not-yet', label: 'ยังไม่ได้ผ่าตัด', id: 'w-palate-not-yet' },
                                                { value: 'waiting', label: 'กำลังรอคิว', id: 'w-palate-waiting' },
                                                { value: 'done', label: 'ผ่าตัดเรียบร้อยแล้ว', id: 'w-palate-done' },
                                            ].map(item => (
                                                <div key={item.id} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                                    <RadioGroupItem value={item.value} id={item.id} />
                                                    <Label htmlFor={item.id} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>

                                    {palateSurgeryStatus === 'waiting' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label className="text-sm font-semibold text-[#5e5873]">วันที่นัดผ่าตัด</Label>
                                            <Input type="date" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg block" disabled={readOnly} />
                                        </div>
                                    )}

                                    {palateSurgeryStatus === 'done' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-[#5e5873]">อายุตอนผ่าตัด</Label>
                                                <Input placeholder="ระบุอายุ" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-[#5e5873]">โรงพยาบาล</Label>
                                                <Input placeholder="ระบุโรงพยาบาล" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "dev_hearing":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold text-[#5e5873]">การแก้ไขการพูด</Label>
                                <RadioGroup value={speechStatus} onValueChange={v => !readOnly && setSpeechStatus(v)}>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                            <RadioGroupItem value="no" id="w-speech-no" />
                                            <Label htmlFor="w-speech-no" className="font-normal text-[#5e5873] flex-1 cursor-pointer">ยังไม่ได้รับแก้ไข</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                            <RadioGroupItem value="yes" id="w-speech-yes" />
                                            <Label htmlFor="w-speech-yes" className="font-normal text-[#5e5873] flex-1 cursor-pointer">ได้รับแก้ไขแล้ว</Label>
                                        </div>
                                    </div>
                                </RadioGroup>

                                {speechStatus === 'yes' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-[#5e5873]">เริ่มตอนอายุ</Label>
                                            <Input placeholder="ระบุอายุ" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-[#5e5873]">ทำครั้งล่าสุด</Label>
                                            <Input type="date" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg block" disabled={readOnly} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-semibold text-[#5e5873]">การตรวจการได้ยิน</Label>
                                <RadioGroup value={hearingStatus} onValueChange={v => !readOnly && setHearingStatus(v)}>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                            <RadioGroupItem value="no" id="w-hearing-no" />
                                            <Label htmlFor="w-hearing-no" className="font-normal text-[#5e5873] flex-1 cursor-pointer">ไม่เคยตรวจ</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                            <RadioGroupItem value="yes" id="w-hearing-yes" />
                                            <Label htmlFor="w-hearing-yes" className="font-normal text-[#5e5873] flex-1 cursor-pointer">เคยตรวจ</Label>
                                        </div>
                                    </div>
                                </RadioGroup>

                                {hearingStatus === 'yes' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label className="text-sm font-semibold text-[#5e5873]">ผลการตรวจ</Label>
                                        <Input placeholder="ระบุผลการตรวจ" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case "dental":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">ประวัติการใส่เครื่องมือ</Label>
                                <div className="flex flex-col gap-3">
                                    {['Obturator', 'NAM', 'Nasoform'].map(item => (
                                        <div key={item} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                            <Checkbox id={`w-${item.toLowerCase()}`} disabled={readOnly} />
                                            <Label htmlFor={`w-${item.toLowerCase()}`} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">การดูแลสุขภาพช่องปาก</Label>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { id: 'w-scaling', label: 'ขูดหินปูน' },
                                        { id: 'w-filling', label: 'อุดฟัน' },
                                        { id: 'w-extract', label: 'ถอนฟัน' },
                                        { id: 'w-ortho', label: 'จัดฟัน' },
                                    ].map(item => (
                                        <div key={item.id} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                            <Checkbox id={item.id} disabled={readOnly} />
                                            <Label htmlFor={item.id} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <Label className="text-sm font-semibold text-[#5e5873] mb-4 block">พฤติกรรมการดูแลสุขภาพช่องปาก</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#5e5873]">ชนิดยาสีฟัน</Label>
                                    <RadioGroup defaultValue="fluoride">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                                <RadioGroupItem value="fluoride" id="w-paste-fluoride" />
                                                <Label htmlFor="w-paste-fluoride" className="font-normal text-[#5e5873] flex-1 cursor-pointer">ผสมฟลูออไรด์</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                                <RadioGroupItem value="non-fluoride" id="w-paste-non" />
                                                <Label htmlFor="w-paste-non" className="font-normal text-[#5e5873] flex-1 cursor-pointer">ไม่ผสมฟลูออไรด์</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#5e5873]">ความถี่ในการแปรงฟัน</Label>
                                    <RadioGroup defaultValue="2">
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { value: '1', label: 'วันละ 1 ครั้ง', id: 'w-freq-1' },
                                                { value: '2', label: 'วันละ 2 ครั้ง', id: 'w-freq-2' },
                                                { value: '3', label: 'มากกว่า 2 ครั้ง', id: 'w-freq-3' },
                                            ].map(item => (
                                                <div key={item.id} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                                    <RadioGroupItem value={item.value} id={item.id} />
                                                    <Label htmlFor={item.id} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#5e5873]">วิธีการแปรงฟัน</Label>
                                    <RadioGroup defaultValue="scrub">
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { value: 'scrub', label: 'ถูไปมา', id: 'w-method-scrub' },
                                                { value: 'roll', label: 'ขยับปัด', id: 'w-method-roll' },
                                                { value: 'circular', label: 'วนเป็นวงกลม', id: 'w-method-circular' },
                                            ].map(item => (
                                                <div key={item.id} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                                    <RadioGroupItem value={item.value} id={item.id} />
                                                    <Label htmlFor={item.id} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                                    <Label className="text-sm font-semibold text-[#5e5873]">อุปกรณ์เสริม</Label>
                                    <div className="flex flex-col gap-3 mt-2">
                                        {[
                                            { id: 'w-floss', label: 'ไหมขัดฟัน' },
                                            { id: 'w-mouthwash', label: 'น้ำยาบ้วนปาก' },
                                        ].map(item => (
                                            <div key={item.id} className="flex items-center space-x-3 bg-[#F8F8F8] p-3 rounded-lg">
                                                <Checkbox id={item.id} disabled={readOnly} />
                                                <Label htmlFor={item.id} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label className="text-sm font-semibold text-[#5e5873]">ความถี่ในการพบทันตแพทย์</Label>
                                    <Input placeholder="เช่น ทุก 6 เดือน, ปีละครั้ง" className="h-11 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg" disabled={readOnly} />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "st5":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="text-sm text-gray-500 mb-2">โปรดประเมินอาการของท่านในช่วง 2-4 สัปดาห์ที่ผ่านมา</p>
                        <div className="space-y-4">
                            {[
                                "1. นอนไม่หลับ เพราะคิดมากหรือกังวล",
                                "2. รู้สึกหงุดหงิด รำคาญใจ",
                                "3. ท่านทำอะไรไม่ได้เลย เพราะประสาทตึงเครียด",
                                "4. ท่านมีความวุ่นวายใจ",
                                "5. ท่านไม่อยากพบปะผู้คน"
                            ].map((q, idx) => (
                                <div key={idx} className="bg-[#F8F8F8] p-4 rounded-lg flex flex-col gap-4">
                                    <p className="font-medium text-[#5e5873] text-sm md:text-base">{q}</p>
                                    <RadioGroup>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { value: '0', label: 'ไม่เลย (0)' },
                                                { value: '1', label: 'เล็กน้อย (1)' },
                                                { value: '2', label: 'มาก (2)' },
                                                { value: '3', label: 'มากที่สุด (3)' },
                                            ].map(item => (
                                                <div key={item.value} className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-slate-100">
                                                    <RadioGroupItem value={item.value} id={`w-st5-${idx}-${item.value}`} />
                                                    <Label htmlFor={`w-st5-${idx}-${item.value}`} className="font-normal text-[#5e5873] flex-1 cursor-pointer">{item.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "feedback":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'ความรู้สึกหลังได้รับการรักษา', placeholder: 'ระบุความรู้สึก' },
                                { label: 'ปัญหาที่เกิดจากการบริการ', placeholder: 'ระบุปัญหา' },
                                { label: 'ความต้องการเพิ่มเติม', placeholder: 'ระบุความต้องการ' },
                                { label: 'ข้อเสนอแนะ', placeholder: 'ระบุข้อเสนอแนะ' },
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#5e5873]">{item.label}</Label>
                                    <Textarea placeholder={item.placeholder} rows={3} className="bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] rounded-lg p-4" disabled={readOnly} />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "evidence":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <Label className="font-semibold flex items-center gap-2 text-[#5e5873]">
                                <Camera className="w-5 h-5" />
                                รูปถ่ายการเยี่ยมบ้าน
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="bg-gray-100 p-4 rounded-full mb-4">
                                    <Upload className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="font-medium">คลิกเพื่ออัปโหลดรูปภาพ</p>
                                <p className="text-sm">หรือลากไฟล์มาวางที่นี่</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Early return: VisitSelectorWeb sub-view
    if (showVisitSelector) {
        return (
            <VisitSelectorWeb
                initialSelected={selectedVisitForm}
                onSave={(value) => {
                    setSelectedVisitForm(value);
                    setShowVisitSelector(false);
                }}
                onBack={() => setShowVisitSelector(false)}
            />
        );
    }

    const StepIcon = STEP_ICONS[currentStepData.id] || ClipboardList;
    const isLastStep = currentStep >= totalSteps - 1;

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header Banner — matching NewPatient pattern */}
            <div className="bg-white p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={() => { if (currentStep > 0) handleBack(); else onBack(); }} className="hover:bg-slate-100 text-[#5e5873]">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-[#7367f0]" />
                            แบบฟอร์มเยี่ยมผู้ป่วย (Home Visit Form)
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            ขั้นตอนที่ {currentStep + 1} จาก {totalSteps} — {currentStepData.subtitle}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="icon" className="hover:text-[#7367f0] hover:border-[#7367f0]" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#EBE9F1] p-6 max-w-4xl mx-auto">
                {/* Horizontal Numbered Circle Stepper — matching NewPatient */}
                <div className="flex items-center justify-center gap-1.5 mb-8">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <button
                                onClick={() => setCurrentStep(index)}
                                className={cn(
                                    "flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer",
                                    index === currentStep
                                        ? "w-9 h-9 bg-[#7367f0] text-white shadow-md shadow-indigo-200"
                                        : index < currentStep
                                            ? "w-7 h-7 bg-[#7367f0]/20 text-[#7367f0]"
                                            : "w-7 h-7 bg-gray-100 text-gray-400"
                                )}
                            >
                                {index < currentStep ? (
                                    <Check className="w-3.5 h-3.5" />
                                ) : (
                                    <span className="text-xs font-bold">{index + 1}</span>
                                )}
                            </button>
                            {index < totalSteps - 1 && (
                                <div className={cn(
                                    "w-6 h-0.5 rounded-full transition-colors",
                                    index < currentStep ? "bg-[#7367f0]/30" : "bg-gray-200"
                                )} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Section Header — matching NewPatient */}
                <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2 mb-6">
                    <StepIcon className="w-5 h-5 text-[#7367f0]" />
                    {currentStepData.subtitle}
                </h3>

                {/* Step Content */}
                <div className="min-h-[400px]">
                    {renderStepContent()}

                    {/* Save Draft (on evidence step) */}
                    {currentStepData.id === 'evidence' && !readOnly && (
                        <div className="mt-6">
                            <Button
                                variant="outline"
                                className="w-full border-[#7367f0] text-[#7367f0] hover:bg-indigo-50 h-11 shadow-sm bg-white"
                                onClick={handleSaveDraft}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                บันทึกร่าง (Save Draft)
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer Actions — matching NewPatient StepActions */}
                <div className="flex justify-between gap-3 pt-6 border-t border-gray-100 mt-8">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 0 && !onBack}
                        className="h-11 px-8 text-gray-600"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        ย้อนกลับ
                    </Button>

                    {isLastStep ? (
                        <Button
                            className={cn(
                                "h-11 px-8 shadow-md shadow-indigo-200 transition-all",
                                readOnly
                                    ? "bg-slate-500 hover:bg-slate-600"
                                    : "bg-[#7367f0] hover:bg-[#5e54ce]"
                            )}
                            onClick={() => {
                                if (readOnly && onBack) {
                                    onBack();
                                } else if (onSave) {
                                    onSave({});
                                } else {
                                    toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
                                }
                            }}
                        >
                            {readOnly ? (
                                <span>ปิด</span>
                            ) : (
                                <span className="inline-flex items-center">
                                    <Check className="w-4 h-4 mr-1" />
                                    ยืนยันและบันทึก
                                </span>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="bg-[#7367f0] hover:bg-[#5e54ce] h-11 px-8 shadow-md shadow-indigo-200 transition-all"
                        >
                            ถัดไป
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
