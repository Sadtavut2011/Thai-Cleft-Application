import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Calendar as CalendarIcon, Upload, Save, ArrowLeft, Camera, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface HomeVisitFormProps {
    onBack?: () => void;
    onSave?: (data: any) => void;
}

const STEPS = [
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

export function HomeVisitForm({ onBack, onSave }: HomeVisitFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    
    // Form States
    const [lipSurgeryStatus, setLipSurgeryStatus] = useState("none");
    const [palateSurgeryStatus, setPalateSurgeryStatus] = useState("none");
    const [speechStatus, setSpeechStatus] = useState("no");
    const [hearingStatus, setHearingStatus] = useState("no");
    const [travelProblemStatus, setTravelProblemStatus] = useState("no");

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

    const renderStepContent = () => {
        switch (currentStepData.id) {
            case "patient":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>ชื่อ-นามสกุล</Label>
                                <Input placeholder="ระบุชื่อ-นามสกุล" />
                            </div>
                            <div className="space-y-2">
                                <Label>วันเดือนปีเกิด</Label>
                                <Input type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label>อายุ (ปี)</Label>
                                <Input type="number" placeholder="ระบุอายุ" />
                            </div>
                            <div className="space-y-2">
                                <Label>เลขบัตรประชาชน</Label>
                                <Input placeholder="ระบุเลขบัตรประชาชน 13 หลัก" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label>ที่อยู่ปัจจุบัน</Label>
                                <Textarea placeholder="ระบุที่อยู่ปัจจุบัน" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label>เบอร์โทรศัพท์</Label>
                                <Input placeholder="ระบุเบอร์โทรศัพท์" />
                            </div>
                        </div>
                        
                        <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <Label className="font-semibold">การวินิจฉัยอาการ (Diagnosis)</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="cleft-lip" />
                                    <Label htmlFor="cleft-lip" className="font-normal">ปากแหว่ง (Cleft Lip)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="cleft-palate" />
                                    <Label htmlFor="cleft-palate" className="font-normal">เพดานโหว่ (Cleft Palate)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="both" />
                                    <Label htmlFor="both" className="font-normal">เป็นทั้งสองอย่าง</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="other-diag" />
                                    <Label htmlFor="other-diag" className="font-normal">ความผิดปกติอื่นร่วมด้วย</Label>
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
                                <Label>ชื่อ-นามสกุลผู้ปกครอง</Label>
                                <Input placeholder="ระบุชื่อ-นามสกุล" />
                            </div>
                            <div className="space-y-2">
                                <Label>ความสัมพันธ์กับผู้ป่วย</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกความสัมพันธ์" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="father">บิดา</SelectItem>
                                        <SelectItem value="mother">มารดา</SelectItem>
                                        <SelectItem value="relative">ญาติ</SelectItem>
                                        <SelectItem value="other">อื่น ๆ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>อาชีพ</Label>
                                <Input placeholder="ระบุอาชีพ" />
                            </div>
                            <div className="space-y-2">
                                <Label>รายได้ต่อเดือน (บาท)</Label>
                                <Input type="number" placeholder="ระบุรายได้" />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label>ที่อยู่และเบอร์ติดต่อ</Label>
                                <Textarea placeholder="ระบุที่อยู่และเบอร์ติดต่อ (หากต่างจากผู้ป่วย)" rows={2} />
                            </div>
                        </div>
                    </div>
                );
            case "travel":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>พาหนะที่ใช้เดินทาง</Label>
                                <Input placeholder="เช่น รถยนต์ส่วนตัว, รถโดยสาร" />
                            </div>
                            <div className="space-y-2">
                                <Label>ระยะทางในการเดินทางมารักษา (กม.)</Label>
                                <Input type="number" placeholder="ระบุระยะทาง" />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <Label>ปัญหาในการเดินทาง</Label>
                            <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                                <div className="space-y-2">
                                    <Select value={travelProblemStatus} onValueChange={setTravelProblemStatus}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="เลือกสถานะ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no">ไม่มีปัญหา</SelectItem>
                                            <SelectItem value="yes">มีปัญหา</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {travelProblemStatus === 'yes' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label>ระบุสาเหตุ</Label>
                                        <Input placeholder="ระบุปัญหาในการเดินทาง" className="bg-white" />
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
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-medium mb-3 text-[#4C4398]">1.1 การผ่าตัดเย็บปิดปากแหว่ง</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>สถานะการรักษา</Label>
                                        <Select value={lipSurgeryStatus} onValueChange={setLipSurgeryStatus}>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="เลือกสถานะ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">ไม่ต้องผ่าตัด</SelectItem>
                                                <SelectItem value="not-yet">ยังไม่ได้ผ่าตัด</SelectItem>
                                                <SelectItem value="waiting">กำลังรอคิว</SelectItem>
                                                <SelectItem value="done">ผ่าตัดเรียบร้อยแล้ว</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {lipSurgeryStatus === 'waiting' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label>วันที่นัดผ่าตัด</Label>
                                            <Input type="date" className="bg-white" />
                                        </div>
                                    )}

                                    {lipSurgeryStatus === 'done' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label>อายุตอนผ่าตัด</Label>
                                                <Input placeholder="ระบุอายุ" className="bg-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>โรงพยาบาล</Label>
                                                <Input placeholder="ระบุโรงพยาบาล" className="bg-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cleft Palate Surgery */}
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h4 className="font-medium mb-3 text-[#4C4398]">1.2 การผ่าตัดเย็บปิดเพดานโหว่</h4>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>สถานะการรักษา</Label>
                                        <Select value={palateSurgeryStatus} onValueChange={setPalateSurgeryStatus}>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="เลือกสถานะ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">ไม่ต้องผ่าตัด</SelectItem>
                                                <SelectItem value="not-yet">ยังไม่ได้ผ่าตัด</SelectItem>
                                                <SelectItem value="waiting">กำลังรอคิว</SelectItem>
                                                <SelectItem value="done">ผ่าตัดเรียบร้อยแล้ว</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {palateSurgeryStatus === 'waiting' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label>วันที่นัดผ่าตัด</Label>
                                            <Input type="date" className="bg-white" />
                                        </div>
                                    )}

                                    {palateSurgeryStatus === 'done' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="space-y-2">
                                                <Label>อายุตอนผ่าตัด</Label>
                                                <Input placeholder="ระบุอายุ" className="bg-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>โรงพยาบาล</Label>
                                                <Input placeholder="ระบุโรงพยาบาล" className="bg-white" />
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
                            <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-[#4C4398]">การแก้ไขการพูด</Label>
                                    <Select value={speechStatus} onValueChange={setSpeechStatus}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="เลือกสถานะ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no">ยังไม่ได้รับแก้ไข</SelectItem>
                                            <SelectItem value="yes">ได้รับแก้ไขแล้ว</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                {speechStatus === 'yes' && (
                                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <Label>เริ่มตอนอายุ</Label>
                                            <Input placeholder="ระบุอายุ" className="bg-white h-9" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ทำครั้งล่าสุด</Label>
                                            <Input type="date" className="bg-white h-9" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-base font-medium text-[#4C4398]">การตรวจการได้ยิน</Label>
                                    <Select value={hearingStatus} onValueChange={setHearingStatus}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="เลือกสถานะ" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="no">ไม่เคยตรวจ</SelectItem>
                                            <SelectItem value="yes">เคยตรวจ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {hearingStatus === 'yes' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                        <Label>ผลการตรวจ</Label>
                                        <Input placeholder="ระบุผลการตรวจ" className="bg-white h-9" />
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
                                    <Label>ประวัติการใส่เครื่องมือ</Label>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="obturator" />
                                            <Label htmlFor="obturator">Obturator</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="nam" />
                                            <Label htmlFor="nam">NAM</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="nasoform" />
                                            <Label htmlFor="nasoform">Nasoform</Label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>การดูแลสุขภาพช่องปาก</Label>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="scaling" />
                                            <Label htmlFor="scaling">ขูดหินปูน</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="filling" />
                                            <Label htmlFor="filling">อุดฟัน</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="extract" />
                                            <Label htmlFor="extract">ถอนฟัน</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="ortho" />
                                            <Label htmlFor="ortho">จัดฟัน</Label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <Label className="font-semibold mb-2 block">พฤติกรรมการดูแลสุขภาพช่องปาก</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>ชนิดยาสีฟัน</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="เลือกชนิด" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fluoride">ผสมฟลูออไรด์</SelectItem>
                                                <SelectItem value="non-fluoride">ไม่ผสมฟลูออไรด์</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ความถี่ในการแปรงฟัน</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="เลือกความถี่" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">วันละ 1 ครั้ง</SelectItem>
                                                <SelectItem value="2">วันละ 2 ครั้ง</SelectItem>
                                                <SelectItem value="3">มากกว่า 2 ครั้ง</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>วิธีการแปรงฟัน</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="เลือกวิธี" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="scrub">ถูไปมา</SelectItem>
                                                <SelectItem value="roll">ขยับปัด</SelectItem>
                                                <SelectItem value="circular">วนเป็นวงกลม</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                                        <Label>อุปกรณ์เสริม</Label>
                                        <div className="flex gap-4 mt-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="floss" />
                                                <Label htmlFor="floss">ไหมขัดฟัน</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="mouthwash" />
                                                <Label htmlFor="mouthwash">น้ำยาบ้วนปาก</Label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <Label>ความถี่ในการพบทันตแพทย์</Label>
                                        <Input placeholder="เช่น ทุก 6 เดือน, ปีละครั้ง" />
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
                                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <p className="font-medium text-slate-800 text-sm md:text-base flex-1">{q}</p>
                                    <div className="w-full md:w-[200px] shrink-0">
                                        <Select>
                                            <SelectTrigger className="bg-white w-full">
                                                <SelectValue placeholder="เลือกประเมิน" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">ไม่เลย (0)</SelectItem>
                                                <SelectItem value="1">เล็กน้อย (1)</SelectItem>
                                                <SelectItem value="2">มาก (2)</SelectItem>
                                                <SelectItem value="3">มากที่สุด (3)</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                <Label>ความรู้สึกหลังได้รับการรักษา</Label>
                                <Textarea placeholder="ระบุความรู้สึก" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label>ปัญหาที่เกิดจากการบริการ</Label>
                                <Textarea placeholder="ระบุปัญหา" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label>ความต้องการเพิ่มเติม</Label>
                                <Textarea placeholder="ระบุความต้องการ" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label>ข้อเสนอแนะ</Label>
                                <Textarea placeholder="ระบุข้อเสนอแนะ" rows={3} />
                            </div>
                        </div>
                    </div>
                );
            case "evidence":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                         <div className="space-y-4">
                            <Label className="text-lg font-semibold flex items-center gap-2">
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

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Status Bar */}
            <div className="shrink-0 bg-[#7066a9] z-50">
                <StatusBarIPhone16Main />
            </div>

            {/* Header */}
            <div className="shrink-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={onBack} className="-ml-2 text-slate-500 hover:bg-slate-50">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1 min-w-0">
                    <h1 className="font-bold text-[#4C4398] text-lg truncate">แบบฟอร์มเยี่ยมผู้ป่วย</h1>
                    <p className="text-xs text-gray-500 truncate">
                        ส่วนที่ {currentStepData.part}: {currentStepData.title}
                    </p>
                </div>
                <div className="text-xs font-medium bg-slate-100 px-2 py-1 rounded text-slate-600">
                    Step {currentStep + 1}/{totalSteps}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-200">
                <div 
                    className="h-full bg-[#4C4398] transition-all duration-300 ease-in-out"
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="p-4 max-w-3xl mx-auto w-full pb-24 md:pb-6">
                    <Card className="border-t-4 border-t-[#4C4398] shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-xl text-[#4C4398] flex items-center gap-2">
                                <span className="flex items-center justify-center bg-[#4C4398] text-white w-8 h-8 rounded-full text-sm font-bold shadow-sm shadow-indigo-200">
                                    {currentStep + 1}
                                </span>
                                {currentStepData.subtitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
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
                                        className="bg-[#4C4398] hover:bg-[#3f377f] w-[120px] rounded-xl h-11 shadow-md shadow-indigo-200"
                                    >
                                        ถัดไป
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button 
                                        className="bg-green-600 hover:bg-green-700 w-[120px] rounded-xl h-11 shadow-md shadow-green-200"
                                        onClick={() => onSave && onSave({})}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        บันทึก
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {currentStepData.id === 'evidence' && (
                        <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                             <Button 
                                variant="outline"
                                className="w-full border-[#4C4398] text-[#4C4398] hover:bg-indigo-50 h-12 text-base shadow-sm bg-white"
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
            <div className="fixed bottom-0 left-0 w-full bg-white z-[50] border-t border-slate-200 px-4 py-4 flex justify-between items-center pb-safe shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
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
                        className="bg-[#4C4398] hover:bg-[#3f377f] w-[120px] rounded-xl h-11 shadow-md shadow-indigo-200"
                    >
                        ถัดไป
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button 
                        className="bg-green-600 hover:bg-green-700 w-[120px] rounded-xl h-11 shadow-md shadow-green-200"
                        onClick={() => onSave && onSave({})}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        บันทึก
                    </Button>
                )}
            </div>
        </div>
    );
}