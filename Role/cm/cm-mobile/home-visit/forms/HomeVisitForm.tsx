import React, { useState, useMemo } from 'react';
import { Button } from "../../../../../components/ui/button";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Calendar as CalendarIcon, Upload, Save, ArrowLeft, Camera, ChevronRight, ChevronLeft, Users, Home, MapPin, User, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getPatientByHn } from "../../../../../data/patientData";
import { cn } from "../../../../../components/ui/utils";

// Helper: map home visit status to display config
const getVisitStatusConfig = (status: string) => {
    switch(status) {
        case 'WaitVisit':
            return { color: 'bg-[#FEF3C7] text-[#D97706]', ring: 'bg-[#F59E0B] ring-[#FEF3C7]', border: 'bg-[#FFFBEB] border-[#FDE68A] shadow-sm hover:border-[#FCD34D]', text: 'text-[#92400E]', label: 'รอเยี่ยม' };
        case 'Pending':
            return { color: 'bg-[#FEF3C7] text-[#B45309]', ring: 'bg-[#FBBF24] ring-[#FEF9C3]', border: 'bg-[#FFFBEB] border-[#FDE68A] shadow-sm hover:border-[#FCD34D]', text: 'text-[#78350F]', label: 'รอดำเนินการ' };
        case 'InProgress':
            return { color: 'bg-blue-100 text-blue-700', ring: 'bg-blue-500 ring-blue-100', border: 'bg-blue-50 border-blue-100 shadow-sm hover:border-blue-300', text: 'text-blue-900', label: 'กำลังดำเนินการ' };
        case 'Completed':
            return { color: 'bg-green-100 text-green-700', ring: 'bg-green-500 ring-green-100', border: 'bg-green-50 border-green-100 hover:border-green-300', text: 'text-green-900', label: 'เสร็จสิ้น' };
        case 'Rejected':
            return { color: 'bg-red-100 text-red-700', ring: 'bg-red-500 ring-red-100', border: 'bg-red-50 border-red-100 hover:border-red-300', text: 'text-red-900', label: 'ยกเลิก' };
        case 'NotHome':
            return { color: 'bg-slate-100 text-slate-700', ring: 'bg-slate-400 ring-slate-100', border: 'bg-slate-50 border-slate-100 hover:border-slate-300', text: 'text-slate-800', label: 'ไม่อยู่บ้าน' };
        default:
            return { color: 'bg-[#FEF3C7] text-[#D97706]', ring: 'bg-[#F59E0B] ring-[#FEF3C7]', border: 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-300', text: 'text-slate-800', label: 'รอดำเนินการ' };
    }
};

interface HomeVisitFormProps {
    onBack?: () => void;
    onSave?: (data: any) => void;
    readOnly?: boolean;
    initialData?: any;
    initialPatientId?: string;
    patientName?: string;
    patient?: any;
}

const STEPS = [
    // Part 0 — Setup
    { part: 0, title: "เลือกประวัติเยี่ยมบ้าน", subtitle: "เลือกรายการเยี่ยมบ้าน", id: "setup" },
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

export function HomeVisitForm({ onBack, onSave, readOnly = false, initialData = {}, initialPatientId, patientName, patient: patientProp }: HomeVisitFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    
    // Setup step states
    const [visitDate, setVisitDate] = useState(initialData?.visitDate || '');
    const [visitType, setVisitType] = useState<'joint' | 'delegated'>(initialData?.visitType || 'joint');
    const [selectedVisitForm, setSelectedVisitForm] = useState(initialData?.visitForm || '');

    // Step 0: Visit timeline selection states
    const [selectedVisitIndex, setSelectedVisitIndex] = useState<number | null>(null);
    const [selectedVisitData, setSelectedVisitData] = useState<any>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingVisit, setPendingVisit] = useState<{ visit: any; index: number } | null>(null);

    // Resolve patient from prop or lookup by HN
    const resolvedPatient = useMemo(() => {
        if (patientProp) return patientProp;
        if (initialPatientId) return getPatientByHn(initialPatientId);
        return undefined;
    }, [patientProp, initialPatientId]);

    // Filter visits: only "WaitVisit" and "Pending" statuses
    const filteredVisits = useMemo(() => {
        const history = resolvedPatient?.visitHistory || [];
        return history.filter((v: any) => {
            const s = v.status || '';
            return s === 'WaitVisit' || s === 'Pending';
        }).sort((a: any, b: any) => {
            const dateA = new Date(a.rawDate || a.date).getTime();
            const dateB = new Date(b.rawDate || b.date).getTime();
            return dateB - dateA;
        });
    }, [resolvedPatient]);

    // Handle selecting a visit from the timeline
    const handleSelectVisit = (visit: any, index: number) => {
        const status = visit.status || '';
        // Show confirmation dialog for WaitVisit
        if (status === 'WaitVisit') {
            setPendingVisit({ visit, index });
            setShowConfirmDialog(true);
            return;
        }
        proceedWithVisit(visit, index);
    };

    // Pre-fill form data from selected visit and advance
    const proceedWithVisit = (visit: any, index: number) => {
        setSelectedVisitIndex(index);
        setSelectedVisitData(visit);
        // Pre-fill visit date from selected visit
        const vDate = visit.rawDate;
        if (vDate) {
            try {
                const d = new Date(vDate);
                if (!isNaN(d.getTime())) setVisitDate(d.toISOString().split('T')[0]);
            } catch {}
        }
        // Pre-fill visit type
        if (visit.type) {
            setVisitType(['Delegated', 'ฝากเยี่ยม'].includes(visit.type) ? 'delegated' : 'joint');
        }
        // Auto-advance to step 1
        setTimeout(() => setCurrentStep(1), 300);
    };

    // Confirm WaitVisit → proceed
    const handleConfirmWaitVisit = () => {
        if (!pendingVisit) return;
        setShowConfirmDialog(false);
        proceedWithVisit(pendingVisit.visit, pendingVisit.index);
        setPendingVisit(null);
    };

    const handleCancelConfirmDialog = () => {
        setShowConfirmDialog(false);
        setPendingVisit(null);
    };

    // Form States
    const [lipSurgeryStatus, setLipSurgeryStatus] = useState(initialData?.lipSurgeryStatus || "none");
    const [palateSurgeryStatus, setPalateSurgeryStatus] = useState(initialData?.palateSurgeryStatus || "none");
    const [speechStatus, setSpeechStatus] = useState(initialData?.speechStatus || "no");
    const [hearingStatus, setHearingStatus] = useState(initialData?.hearingStatus || "no");
    const [travelProblemStatus, setTravelProblemStatus] = useState(initialData?.travelProblemStatus || "no");

    const totalSteps = STEPS.length;
    const currentStepData = STEPS[currentStep];

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

    const renderStepContent = (stepId?: string) => {
        const id = stepId || currentStepData.id;
        switch (id) {
            case "setup":
                return (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                            <Home className="text-[#7066a9]" /> ประวัติเยี่ยมบ้าน
                        </h3>

                        {filteredVisits.length > 0 ? (
                            <div className="relative pl-2 ml-2">
                                {filteredVisits.map((visit: any, index: number) => {
                                    const config = getVisitStatusConfig(visit.status);
                                    return (
                                        <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${config.ring}`}></div>
                                            {index !== filteredVisits.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                            
                                            <div 
                                                className={cn(
                                                    `p-4 rounded-xl border transition-all cursor-pointer`,
                                                    config.border
                                                )}
                                                onClick={() => handleSelectVisit(visit, index)}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className={`text-[16px] font-bold ${visit.status === 'WaitVisit' ? 'text-[#D97706]' : visit.status === 'Pending' ? 'text-[#B45309]' : 'text-slate-500'}`}>{visit.date}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.color} ${visit.status === 'WaitVisit' ? 'animate-pulse' : ''}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <h5 className={`font-bold text-[16px] ${config.text}`}>{visit.title || 'เยี่ยมบ้าน'}</h5>
                                                <div className="text-[14px] text-slate-500 mt-2 space-y-1">
                                                    {visit.provider && (
                                                        <div className="flex items-center gap-1">
                                                            <User size={12} /> {visit.provider}
                                                        </div>
                                                    )}
                                                    {visit.type && (
                                                        <div className="flex items-center gap-1">
                                                            <Users size={12} /> {visit.type === 'Joint' ? 'ลงเยี่ยมร่วม' : visit.type === 'Delegated' ? 'ฝากเยี่ยม' : visit.type}
                                                        </div>
                                                    )}
                                                    {visit.note && (
                                                        <div className="flex items-center gap-1 text-[#B45309]/70 mt-1">
                                                            * {visit.note}
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
                                <Home size={48} className="mx-auto mb-4 opacity-50" />
                                <p>ไม่พบประวัติเยี่ยมบ้านที่รอเยี่ยม</p>
                            </div>
                        )}
                    </div>
                );
            case "patient":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ชื่อ-นามสกุล</Label>
                                <Input 
                                    placeholder="ระบุชื่อ-นามสกุล" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                    defaultValue={initialData?.patientName}
                                    disabled={readOnly}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">วันเดือนปีเกิด</Label>
                                <Input 
                                    type="date" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4 block"
                                    defaultValue={initialData?.dob}
                                    disabled={readOnly}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">อายุ (ปี)</Label>
                                <Input 
                                    type="number" 
                                    placeholder="ระบุอายุ" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                    defaultValue={initialData?.age}
                                    disabled={readOnly}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">เลขบัตรประชาชน</Label>
                                <Input 
                                    placeholder="ระบุเลขบัตรประชาชน 13 หลัก" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                    defaultValue={initialData?.idCard}
                                    disabled={readOnly}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ที่อยู่ปัจจุบัน</Label>
                                <Textarea 
                                    placeholder="ระบุที่อยู่ปัจจุบัน" 
                                    rows={3} 
                                    className="bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm p-4"
                                    defaultValue={initialData?.address}
                                    disabled={readOnly}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">เบอร์โทรศัพท์</Label>
                                <Input 
                                    placeholder="ระบุเบอร์โทรศัพท์" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                    defaultValue={initialData?.phone}
                                    disabled={readOnly}
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                            <Label className="text-slate-700 font-bold text-base">การวินิจฉัยอาการ (Diagnosis)</Label>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <Checkbox id="cleft-lip" disabled={readOnly} defaultChecked={initialData?.diagnosis?.includes('Cleft Lip')} />
                                    <Label htmlFor="cleft-lip" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ปากแหว่ง (Cleft Lip)</Label>
                                </div>
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <Checkbox id="cleft-palate" disabled={readOnly} defaultChecked={initialData?.diagnosis?.includes('Cleft Palate')} />
                                    <Label htmlFor="cleft-palate" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">เพดานโหว่ (Cleft Palate)</Label>
                                </div>
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <Checkbox id="both" disabled={readOnly} defaultChecked={initialData?.diagnosis?.includes('Both')} />
                                    <Label htmlFor="both" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">เป็นทั้งสองอย่าง</Label>
                                </div>
                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <Checkbox id="other-diag" disabled={readOnly} defaultChecked={initialData?.diagnosis?.includes('Other')} />
                                    <Label htmlFor="other-diag" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ความผิดปกติอื่นร่วมด้วย</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "guardian":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ชื่อ-นามสกุลผู้ปกครอง</Label>
                                <Input 
                                    placeholder="ระบุชื่อ-นามสกุล" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ความสัมพันธ์กับผู้ป่วย</Label>
                                <RadioGroup defaultValue="father">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <RadioGroupItem value="father" id="rel-father" />
                                            <Label htmlFor="rel-father" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">บิดา</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <RadioGroupItem value="mother" id="rel-mother" />
                                            <Label htmlFor="rel-mother" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">มารดา</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <RadioGroupItem value="relative" id="rel-relative" />
                                            <Label htmlFor="rel-relative" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ญาติ</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <RadioGroupItem value="other" id="rel-other" />
                                            <Label htmlFor="rel-other" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">อื่น ๆ</Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">อาชีพ</Label>
                                <Input 
                                    placeholder="ระบุอาชีพ" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">รายได้ต่อเดือน (บาท)</Label>
                                <Input 
                                    type="number" 
                                    placeholder="ระบุรายได้" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ที่อยู่และเบอร์ติดต่อ</Label>
                                <Textarea 
                                    placeholder="ระบุที่อยู่และเบอร์ติดต่อ (หากต่างจากผู้ป่วย)" 
                                    rows={2} 
                                    className="bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm p-4"
                                />
                            </div>
                        </div>
                    </div>
                );
            case "travel":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">พาหนะที่ใช้เดินทาง</Label>
                                <Input 
                                    placeholder="เช่น รถยนต์ส่วนตัว, รถโดยสาร" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ระยะทางในการเดินทางมารักษา (กม.)</Label>
                                <Input 
                                    type="number" 
                                    placeholder="ระบุระยะทาง" 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <Label className="text-slate-700 font-bold text-base">ปัญหาในการเดินทาง</Label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <RadioGroup value={travelProblemStatus} onValueChange={setTravelProblemStatus}>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                <RadioGroupItem value="no" id="travel-no" />
                                                <Label htmlFor="travel-no" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ไม่มีปัญหา</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                <RadioGroupItem value="yes" id="travel-yes" />
                                                <Label htmlFor="travel-yes" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">มีปัญหา</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {travelProblemStatus === 'yes' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label className="text-slate-700 font-bold text-base">ระบุสาเหตุ</Label>
                                        <Input 
                                            placeholder="ระบุปัญหาในการเดินทาง" 
                                            className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                        />
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
                            <div className="">
                                <h4 className="mb-3 text-slate-700 font-bold text-base">1.1 การผ่าตัดเย็บปิดปากแหว่ง</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-base">สถานะการรักษา</Label>
                                        <RadioGroup value={lipSurgeryStatus} onValueChange={setLipSurgeryStatus}>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="none" id="lip-none" />
                                                    <Label htmlFor="lip-none" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ไม่ต้องผ่าตัด</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="not-yet" id="lip-not-yet" />
                                                    <Label htmlFor="lip-not-yet" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ยังไม่ได้ผ่าตัด</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="waiting" id="lip-waiting" />
                                                    <Label htmlFor="lip-waiting" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">กำลังรอคิว</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="done" id="lip-done" />
                                                    <Label htmlFor="lip-done" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ผ่าตัดเรียบร้อยแล้ว</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {lipSurgeryStatus === 'waiting' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label className="text-slate-700 font-bold text-base">วันที่นัดผ่าตัด</Label>
                                            <Input 
                                                type="date" 
                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4 block"
                                            />
                                        </div>
                                    )}

                                    {lipSurgeryStatus === 'done' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-bold text-base">อายุตอนผ่าตัด</Label>
                                                <Input 
                                                    placeholder="ระบุอายุ" 
                                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-bold text-base">โรงพยาบาล</Label>
                                                <Input 
                                                    placeholder="ระบุโรงพยาบาล" 
                                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cleft Palate Surgery */}
                            <div className="">
                                <h4 className="mb-3 text-slate-700 font-bold text-base">1.2 การผ่าตัดเย็บปิดเพดานโหว่</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-base">สถานะการรักษา</Label>
                                        <RadioGroup value={palateSurgeryStatus} onValueChange={setPalateSurgeryStatus}>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="none" id="palate-none" />
                                                    <Label htmlFor="palate-none" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ไม่ต้องผ่าตัด</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="not-yet" id="palate-not-yet" />
                                                    <Label htmlFor="palate-not-yet" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ยังไม่ได้ผ่าตัด</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="waiting" id="palate-waiting" />
                                                    <Label htmlFor="palate-waiting" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">กำลังรอคิว</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="done" id="palate-done" />
                                                    <Label htmlFor="palate-done" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ผ่าตัดเรียบร้อยแล้ว</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {palateSurgeryStatus === 'waiting' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label className="text-slate-700 font-bold text-base">วันที่นัดผ่าตัด</Label>
                                            <Input 
                                                type="date" 
                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4 block"
                                            />
                                        </div>
                                    )}

                                    {palateSurgeryStatus === 'done' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-bold text-base">อายุตอนผ่าตัด</Label>
                                                <Input 
                                                    placeholder="ระบุอายุ" 
                                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-slate-700 font-bold text-base">โรงพยาบาล</Label>
                                                <Input 
                                                    placeholder="ระบุโรงพยาบาล" 
                                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                                />
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
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-bold text-base">การแก้ไขการพูด</Label>
                                    <RadioGroup value={speechStatus} onValueChange={setSpeechStatus}>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                <RadioGroupItem value="no" id="speech-no" />
                                                <Label htmlFor="speech-no" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ยังไม่ได้รับแก้ไข</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                <RadioGroupItem value="yes" id="speech-yes" />
                                                <Label htmlFor="speech-yes" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ได้รับแก้ไขแล้ว</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                                
                                {speechStatus === 'yes' && (
                                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-bold text-base">เริ่มตอนอายุ</Label>
                                            <Input 
                                                placeholder="ระบุอายุ" 
                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-700 font-bold text-base">ทำครั้งล่าสุด</Label>
                                            <Input 
                                                type="date" 
                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4 block"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-bold text-base">การตรวจการได้ยิน</Label>
                                    <RadioGroup value={hearingStatus} onValueChange={setHearingStatus}>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                <RadioGroupItem value="no" id="hearing-no" />
                                                <Label htmlFor="hearing-no" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ไม่เคยตรวจ</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                <RadioGroupItem value="yes" id="hearing-yes" />
                                                <Label htmlFor="hearing-yes" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">เคยตรวจ</Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {hearingStatus === 'yes' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label className="text-slate-700 font-bold text-base">ผลการตรวจ</Label>
                                        <Input 
                                            placeholder="ระบุผลการตรวจ" 
                                            className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case "dental":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-bold text-base">ประวัติการใส่เครื่องมือ</Label>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <Checkbox id="obturator" />
                                            <Label htmlFor="obturator" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">Obturator</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <Checkbox id="nam" />
                                            <Label htmlFor="nam" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">NAM</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <Checkbox id="nasoform" />
                                            <Label htmlFor="nasoform" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">Nasoform</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-bold text-base">การดูแลสุขภาพช่องปาก</Label>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <Checkbox id="scaling" />
                                            <Label htmlFor="scaling" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ขูดหินปูน</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <Checkbox id="filling" />
                                            <Label htmlFor="filling" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">อุดฟัน</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <Checkbox id="extract" />
                                            <Label htmlFor="extract" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ถอนฟัน</Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                            <Checkbox id="ortho" />
                                            <Label htmlFor="ortho" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">จัดฟัน</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Label className="text-slate-700 font-bold text-base mb-4 block">พฤติกรรมการดูแลสุขภาพช่องปาก</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-base">ชนิดยาสีฟัน</Label>
                                        <RadioGroup defaultValue="fluoride">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="fluoride" id="paste-fluoride" />
                                                    <Label htmlFor="paste-fluoride" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ผสมฟลูออไรด์</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="non-fluoride" id="paste-non" />
                                                    <Label htmlFor="paste-non" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ไม่ผสมฟลูออไรด์</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-base">ความถี่ในการแปรงฟัน</Label>
                                        <RadioGroup defaultValue="2">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="1" id="freq-1" />
                                                    <Label htmlFor="freq-1" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">วันละ 1 ครั้ง</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="2" id="freq-2" />
                                                    <Label htmlFor="freq-2" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">วันละ 2 ครั้ง</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="3" id="freq-3" />
                                                    <Label htmlFor="freq-3" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">มากกว่า 2 ครั้ง</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-700 font-bold text-base">วิธีการแปรงฟัน</Label>
                                        <RadioGroup defaultValue="scrub">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="scrub" id="method-scrub" />
                                                    <Label htmlFor="method-scrub" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ถูไปมา</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="roll" id="method-roll" />
                                                    <Label htmlFor="method-roll" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ขยับปัด</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="circular" id="method-circular" />
                                                    <Label htmlFor="method-circular" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">วนเป็นวงกลม</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                                        <Label className="text-slate-700 font-bold text-base">อุปกรณ์เสริม</Label>
                                        <div className="flex flex-col gap-3 mt-2">
                                            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                <Checkbox id="floss" />
                                                <Label htmlFor="floss" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ไหมขัดฟัน</Label>
                                            </div>
                                            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                <Checkbox id="mouthwash" />
                                                <Label htmlFor="mouthwash" className="font-normal text-base text-slate-700 flex-1 cursor-pointer">น้ำยาบ้วนปาก</Label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <Label className="text-slate-700 font-bold text-base">ความถี่ในการพบทันตแพทย์</Label>
                                        <Input 
                                            placeholder="เช่น ทุก 6 เดือน, ปีละครั้ง" 
                                            className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "st5":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500 mb-2">โปรดประเมินอาการของท่านในช่วง 2-4 สัปดาห์ที่ผ่านมา</p>
                            {[
                                "1. นอนไม่หลับ เพราะคิดมากหรือกังวล",
                                "2. รู้สึกหงุดหงิด รำคาญใจ",
                                "3. ท่านทำอะไรไม่ได้เลย เพราะประสาทตึงเครียด",
                                "4. ท่านมีความวุ่นวายใจ",
                                "5. ท่านไม่อยากพบปะผู้คน"
                            ].map((q, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col gap-4">
                                    <p className="font-medium text-slate-800 text-sm md:text-base">{q}</p>
                                    <div className="w-full">
                                        <RadioGroup>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="0" id={`st5-${idx}-0`} />
                                                    <Label htmlFor={`st5-${idx}-0`} className="font-normal text-base text-slate-700 flex-1 cursor-pointer">ไม่เลย (0)</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="1" id={`st5-${idx}-1`} />
                                                    <Label htmlFor={`st5-${idx}-1`} className="font-normal text-base text-slate-700 flex-1 cursor-pointer">เล็กน้อย (1)</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="2" id={`st5-${idx}-2`} />
                                                    <Label htmlFor={`st5-${idx}-2`} className="font-normal text-base text-slate-700 flex-1 cursor-pointer">มาก (2)</Label>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <RadioGroupItem value="3" id={`st5-${idx}-3`} />
                                                    <Label htmlFor={`st5-${idx}-3`} className="font-normal text-base text-slate-700 flex-1 cursor-pointer">มากที่สุด (3)</Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "feedback":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ความรู้สึกหลังได้รับการรักษา</Label>
                                <Textarea 
                                    placeholder="ระบุความรู้สึก" 
                                    rows={3} 
                                    className="bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm p-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ปัญหาที่เกิดจากการบริการ</Label>
                                <Textarea 
                                    placeholder="ระบุปัญหา" 
                                    rows={3} 
                                    className="bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm p-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ความต้องการเพิ่มเติม</Label>
                                <Textarea 
                                    placeholder="ระบุความต้องการ" 
                                    rows={3} 
                                    className="bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm p-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-bold text-base">ข้อเสนอแนะ</Label>
                                <Textarea 
                                    placeholder="ระบุข้อเสนอแนะ" 
                                    rows={3} 
                                    className="bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm p-4"
                                />
                            </div>
                        </div>
                    </div>
                );
            case "evidence":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                         <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2 text-slate-700">
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

    // List View block removed to support Stepper View for ReadOnly as well
    // if (readOnly) { ... } removed

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Status Bar */}
            <div className="shrink-0 bg-[#7066a9] z-50">
                <StatusBarIPhone16Main />
            </div>

            {/* Header - Purple bar matching project pattern */}
            <div className="shrink-0 z-40 bg-[#7066a9] h-[64px] px-4 flex items-center gap-3">
                <button onClick={handleBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="font-bold text-white text-lg truncate">
                        {currentStepData.id === 'setup' ? 'เพิ่มบันทึกเยี่ยมบ้าน' : 'แบบฟอร์มเยี่ยมผู้ป่วย'}
                    </h1>
                    {currentStepData.id !== 'setup' && (
                        <p className="text-xs text-white/70 truncate">
                            {`ส่วนที่ ${currentStepData.part}: ${currentStepData.title}`}
                        </p>
                    )}
                </div>
                {currentStepData.id !== 'setup' && (
                    <div className="text-xs font-medium bg-white/20 px-2.5 py-1 rounded-full text-white">
                        {currentStep + 1}/{totalSteps}
                    </div>
                )}
            </div>

            {/* Progress Bar - hide on step 0 (timeline selection) */}
            {currentStepData.id !== 'setup' && (
                <div className="h-1 w-full bg-slate-200">
                    <div 
                        className="h-full bg-[#7367f0] transition-all duration-300 ease-in-out"
                        style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    />
                </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="p-4 max-w-3xl mx-auto w-full pb-24 md:pb-6">
                    <div className="pb-24 pt-4">
                        {currentStepData.id === 'setup' ? (
                            <div className="mb-4">
                                <p className="text-sm text-slate-500">
                                    เลือกประวัติเยี่ยมบ้านที่ต้องการบันทึก
                                </p>
                            </div>
                        ) : (
                            <div className="mb-6 flex items-center gap-3 px-1">
                                <span className="flex items-center justify-center bg-[#7367f0] text-white w-8 h-8 rounded-full text-sm font-bold shadow-sm shadow-indigo-200 shrink-0">
                                    {currentStep + 1}
                                </span>
                                <h2 className="text-base font-bold text-slate-700">
                                    {currentStepData.subtitle}
                                </h2>
                            </div>
                        )}
                        
                        <div className="px-1">
                            {renderStepContent()}

                            {/* Desktop Footer (Inline) */}
                            <div className="hidden md:flex justify-between items-center pt-8 border-t border-slate-100 mt-8">
                                <Button 
                                    variant="outline" 
                                    onClick={handleBack}
                                    disabled={currentStep === 0 && !onBack}
                                    className="w-[120px] rounded-xl h-11"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    ย้อนกลับ
                                </Button>
                                
                                {currentStep < totalSteps - 1 ? (
                                    <Button 
                                        onClick={handleNext}
                                        className="bg-[#7367f0] hover:bg-[#655bd3] w-[120px] rounded-xl h-11 shadow-md shadow-indigo-200"
                                    >
                                        ถัดไป
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button 
                                        className={readOnly ? "bg-slate-500 hover:bg-slate-600 w-[120px] rounded-xl h-11" : "bg-green-600 hover:bg-green-700 w-[120px] rounded-xl h-11 shadow-md shadow-green-200"}
                                        onClick={() => {
                                            if (readOnly && onBack) {
                                                onBack();
                                            } else if (onSave) {
                                                onSave({});
                                            }
                                        }}
                                    >
                                        {readOnly ? (
                                            <>ปิด</>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                บันทึก
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {currentStepData.id === 'evidence' && (
                        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                             <Button 
                                variant="outline"
                                className="w-full border-[#7367f0] text-[#7367f0] hover:bg-indigo-50 h-12 text-base shadow-sm bg-white"
                                onClick={handleSaveDraft}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                บันทึกร่าง (Save Draft)
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white z-[50] border-t border-slate-100 px-4 py-4 pb-safe shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}>
                {currentStep === 0 ? (
                    <Button 
                        onClick={handleNext} 
                        variant="outline"
                        className="w-full h-[48px] rounded-xl border-[#7066a9] text-[#7066a9] hover:bg-[#7066a9]/5 text-[16px] font-bold"
                    >
                        ข้าม
                    </Button>
                ) : currentStep < totalSteps - 1 ? (
                    <div className="flex justify-between items-center">
                        <Button 
                            variant="outline" 
                            onClick={handleBack}
                            className="w-[120px] rounded-xl h-11"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            ย้อนกลับ
                        </Button>
                        <Button 
                            onClick={handleNext}
                            className="bg-[#7367f0] hover:bg-[#655bd3] w-[120px] rounded-xl h-11 shadow-md shadow-indigo-200"
                        >
                            ถัดไป
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
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
                            className="flex-1 h-[48px] rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200 text-[16px] font-bold"
                            onClick={() => onSave && onSave({ _selectedVisit: selectedVisitData })}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            บันทึก
                        </Button>
                    </div>
                )}
            </div>

            {/* ═══ Confirm Dialog: WaitVisit → Proceed ═══ */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black/50 z-[60000] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="bg-white relative rounded-[14px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] w-[300px] animate-in zoom-in-95 duration-200">
                        {/* X close button */}
                        <button 
                            onClick={handleCancelConfirmDialog}
                            className="absolute right-[15px] top-[15px] w-[24px] h-[24px] flex items-center justify-center"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                <path d="M6 6L18 18" stroke="#99A1AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                        </button>

                        {/* Warning Icon */}
                        <div className="flex justify-center pt-6">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <path d="M43.46 36L27.46 8C27.1111 7.38441 26.6052 6.87238 25.9938 6.51614C25.3825 6.1599 24.6876 5.97221 23.98 5.97221C23.2724 5.97221 22.5775 6.1599 21.9662 6.51614C21.3548 6.87238 20.8489 7.38441 20.5 8L4.5 36C4.14736 36.6107 3.96246 37.3038 3.96402 38.009C3.96558 38.7142 4.15356 39.4065 4.50889 40.0156C4.86423 40.6248 5.3743 41.1292 5.98739 41.4777C6.60049 41.8261 7.29481 42.0063 8 42H40C40.7018 41.9993 41.3911 41.8139 41.9986 41.4626C42.6061 41.1112 43.1104 40.6062 43.461 39.9982C43.8116 39.3903 43.9961 38.7008 43.9959 37.999C43.9957 37.2972 43.8109 36.6078 43.46 36Z" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                                <path d="M24 18V26" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                                <path d="M24 34H24.02" stroke="#FB2C36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                            </svg>
                        </div>

                        {/* Title */}
                        <p className="font-['IBM_Plex_Sans_Thai',sans-serif] font-bold text-[20px] leading-[28px] text-[#1e2939] text-center mt-4 px-6">
                            ยืนยันเริ่มบันทึกเยี่ยมบ้าน
                        </p>

                        {/* Description */}
                        <p className="font-['IBM_Plex_Sans_Thai',sans-serif] text-[14px] leading-[20px] text-[#6a7282] text-center mt-3 px-6">
                            คุณต้องการเริ่มบันทึกผลการเยี่ยมบ้าน สำหรับรายการที่มีสถานะ "รอเยี่ยม" หรือไม่?
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-4 items-center justify-center px-6 pt-5 pb-6">
                            <button
                                onClick={handleCancelConfirmDialog}
                                className="bg-[#fb2c36] h-[40px] rounded-[14px] px-5 flex items-center justify-center active:scale-95 transition-all"
                            >
                                <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[14px] text-white whitespace-nowrap">ยกเลิก</span>
                            </button>
                            <button
                                onClick={handleConfirmWaitVisit}
                                className="bg-[#28c76f] h-[40px] rounded-[14px] shadow-[0px_10px_15px_0px_#b9f8cf,0px_4px_6px_0px_#b9f8cf] px-5 flex items-center justify-center active:scale-95 transition-all"
                            >
                                <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[14px] text-white whitespace-nowrap">ยืนยัน</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}