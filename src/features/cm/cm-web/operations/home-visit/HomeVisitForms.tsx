import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Separator } from "../../../../../components/ui/separator";
import { Calendar as CalendarIcon, Upload, Save, ArrowLeft, Camera } from "lucide-react";

interface HomeVisitF1Props {
    onBack?: () => void;
}

export function HomeVisitForms({ onBack }: HomeVisitF1Props) {
    const [lipSurgeryStatus, setLipSurgeryStatus] = useState("none");
    const [palateSurgeryStatus, setPalateSurgeryStatus] = useState("none");
    const [speechStatus, setSpeechStatus] = useState("no");
    const [hearingStatus, setHearingStatus] = useState("no");
    const [travelProblemStatus, setTravelProblemStatus] = useState("no");

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                {onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-[#4C4398]">แบบฟอร์มเยี่ยมผู้ป่วย</h1>
                    <p className="text-gray-500">บันทึกข้อมูลการเยี่ยมบ้านและประวัติการรักษา</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Part 1: General Information */}
                <Card className="border-t-4 border-t-[#4C4398]">
                    <CardHeader>
                        <CardTitle className="text-xl text-[#4C4398]">ส่วนที่ 1: ข้อมูลทั่วไป (General Information)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* 1. Patient Info */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="bg-[#4C4398] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                ข้อมูลผู้ป่วย
                            </h3>
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

                        <Separator />

                        {/* 2. Guardian Info */}
                        <div>
                             <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="bg-[#4C4398] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                ข้อมูลผู้ปกครอง
                            </h3>
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

                        <Separator />

                        {/* 3. Travel */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="bg-[#4C4398] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                การเดินทาง
                            </h3>
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
                    </CardContent>
                </Card>

                {/* Part 2: Treatment History */}
                <Card className="border-t-4 border-t-[#4C4398]">
                    <CardHeader>
                        <CardTitle className="text-xl text-[#4C4398]">ส่วนที่ 2: ประวัติการรักษา (Treatment History)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* 1. Surgery */}
                        <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="bg-[#4C4398] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                การผ่าตัด (Surgery)
                            </h3>
                            
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

                         <Separator />

                        {/* 2. Dev & Hearing */}
                         <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="bg-[#4C4398] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                การพัฒนาการและการได้ยิน
                            </h3>
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

                        <Separator />

                         {/* 3. Dental */}
                         <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="bg-[#4C4398] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                การรักษาทางทันตกรรม (Dental Treatment)
                            </h3>
                            
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
                                        <div className="space-y-2">
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

                        <Separator />

                         {/* 4. ST5 */}
                         <div>
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <span className="bg-[#4C4398] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                                แบบประเมินความเครียด (ST5)
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">โปรดประเมินอาการของท่านในช่วง 2-4 สัปดาห์ที่ผ่านมา</p>
                            
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="w-[40%]">อาการ</TableHead>
                                            <TableHead className="text-center">ไม่เลย (0)</TableHead>
                                            <TableHead className="text-center">เล็กน้อย (1)</TableHead>
                                            <TableHead className="text-center">มาก (2)</TableHead>
                                            <TableHead className="text-center">มากที่สุด (3)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {[
                                            "1. นอนไม่หลับ เพราะคิดมากหรือกังวล",
                                            "2. รู้สึกหงุดหงิด รำคาญใจ",
                                            "3. ท่านทำอะไรไม่ได้เลย เพราะประสาทตึงเครียด",
                                            "4. ท่านมีความวุ่นวายใจ",
                                            "5. ท่านไม่อยากพบปะผู้คน"
                                        ].map((q, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{q}</TableCell>
                                                {[0, 1, 2, 3].map((score) => (
                                                    <TableCell key={score} className="text-center">
                                                        <input type="radio" name={`st5-${idx}`} className="w-4 h-4 accent-[#4C4398]" />
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                 {/* Part 3: Feedback */}
                 <Card className="border-t-4 border-t-[#4C4398]">
                    <CardHeader>
                        <CardTitle className="text-xl text-[#4C4398]">ส่วนท้าย: ข้อเสนอแนะและหลักฐาน</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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

                        <Separator />

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
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 pt-4 sticky bottom-4 z-10 bg-white/80 p-4 backdrop-blur-sm rounded-lg border shadow-lg">
                    {onBack && (
                        <Button variant="outline" className="w-32" onClick={onBack}>ยกเลิก</Button>
                    )}
                    <Button className="bg-[#4C4398] hover:bg-[#3f377f] w-32 gap-2 shadow-md">
                        <Save className="w-4 h-4" /> บันทึก
                    </Button>
                </div>
            </div>
        </div>
    );
}
