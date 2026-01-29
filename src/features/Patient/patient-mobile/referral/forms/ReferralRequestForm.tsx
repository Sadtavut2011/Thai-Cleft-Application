import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { 
  FileText, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  X, 
  Check,
  MapPin
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";

interface ReferralRequestFormProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialPatient?: any;
}

export function ReferralRequestForm({ onClose, onSubmit, initialPatient }: ReferralRequestFormProps) {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState(
    initialPatient 
      ? `${initialPatient.name || ''} (HN: ${initialPatient.hn || initialPatient.cid || ''})`
      : ""
  );
  const [hospital, setHospital] = useState(initialPatient?.hospital || "");

  const patients = [
    { name: "ด.ช. รักดี มีสุข", hn: "66012345", hospital: "รพ.สต.บ้านทุ่ง" },
    { name: "ด.ญ. ใจดี มีสุข", hn: "640001", hospital: "รพ.สต.แม่ริม" },
    { name: "ด.ช. กล้าหาญ ชาญชัย", hn: "640002", hospital: "รพ.สต.หางดง" },
    { name: "น.ส. สมหญิง จริงใจ", hn: "640003", hospital: "รพ.สต.สารภี" },
    { name: "นาย สมชาย ขายดี", hn: "640004", hospital: "รพ.สต.สันทราย" },
    { name: "ด.ญ. มานี มีตา", hn: "640005", hospital: "รพ.สต.แม่วาง" }
  ];

  const filteredPatients = patients.filter(p => 
    !searchQuery || 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.hn.includes(searchQuery)
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] h-[100dvh] w-full bg-slate-50 flex flex-col font-['IBM_Plex_Sans_Thai']">
      
      {/* Top Header */}
      <div className="bg-[#7066a9] shrink-0 z-50 shadow-none w-full relative">
          <StatusBarIPhone16Main />
          <div className="h-[64px] px-4 flex items-center gap-3">
              <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                  <ChevronLeft size={24} />
              </button>
              <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">สร้างคำขอส่งตัว</h1>
          </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar bg-slate-50">
        
        {/* Decorative Header with Stepper - Merges with Top Header */}
        <div className="bg-[#7066a9] pb-8 px-6 text-white shrink-0 shadow-md rounded-b-[32px] relative -mt-1 pt-2 bg-[rgb(102,81,165)]">
            <div className="flex flex-col items-center text-center space-y-4">
                <p className="text-white/80 text-sm font-light">
                    กรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการพิจารณา
                </p>

                {/* Stepper */}
                <div className="flex items-center gap-3 mt-2">
                    {/* Step 1 */}
                    <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-base shadow-sm transition-colors ${step >= 1 ? 'bg-white text-[#7066a9]' : 'border-2 border-white/40 text-white/60'}`}>
                        1
                    </div>
                    {/* Line */}
                    <div className={`w-12 h-[2px] ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
                    
                    {/* Step 2 */}
                    <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-base transition-colors ${step >= 2 ? 'bg-white text-[#7066a9]' : 'border-2 border-white/40 text-white/60'}`}>
                        2
                    </div>
                    {/* Line */}
                    <div className={`w-12 h-[2px] ${step >= 3 ? 'bg-white' : 'bg-white/30'}`}></div>

                    {/* Step 3 */}
                    <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-base transition-colors ${step >= 3 ? 'bg-white text-[#7066a9]' : 'border-2 border-white/40 text-white/60'}`}>
                        3
                    </div>
                </div>
                
                {/* Step Label */}
                <div className="text-sm font-medium text-white/90">
                    {step === 1 && "ข้อมูลผู้ป่วย"}
                    {step === 2 && "ปลายทาง & เอกสาร"}
                    {step === 3 && "ตรวจสอบ & ยืนยัน"}
                </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="p-6 pb-32">
            
            {step === 1 && (
                <div className="space-y-6">
                    {/* Section A Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-6 bg-[#7066a9] rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-800">A. ข้อมูลผู้ป่วยและการรักษา</h2>
                    </div>

                    {/* Search Field */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">
                            ผู้ป่วย <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7367f0] w-5 h-5 z-10" />
                            <Input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาชื่อ หรือ HN..." 
                                className="pl-10 h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm peer border-[#7367f0]"
                            />
                            {/* Autocomplete Dropdown */}
                            {searchQuery && filteredPatients.length > 0 && !patients.some(p => `${p.name} (HN: ${p.hn})` === searchQuery) && (
                                <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl mt-1 z-50 max-h-60 overflow-y-auto">
                                    {filteredPatients.map((patient, index) => (
                                        <div 
                                            key={index}
                                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-0 flex items-center gap-2"
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevent input blur
                                                setSearchQuery(`${patient.name} (HN: ${patient.hn})`);
                                                setHospital(patient.hospital);
                                            }}
                                        >
                                            <Search className="w-4 h-4 text-slate-400" />
                                            <div>
                                                <span className="font-medium">{patient.name}</span>
                                                <span className="text-slate-500 ml-1">(HN: {patient.hn})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hospital Field */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">
                            โรงพยาบาล
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7367f0] w-5 h-5 z-10" />
                            <Input 
                                value={hospital}
                                readOnly
                                placeholder="โรงพยาบาลต้นสังกัด" 
                                className="pl-10 h-12 bg-white border-slate-200 rounded-xl text-slate-700 text-base shadow-sm"
                            />
                        </div>
                    </div>

                    {/* HN & Urgency Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">HN</Label>
                            <div className="h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center px-4 text-slate-500 font-medium">
                                {searchQuery && searchQuery.includes("HN:") 
                                    ? searchQuery.match(/HN: (\d+)/)?.[1] || "HN" 
                                    : "HN"}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold">ความเร่งด่วน</Label>
                            <Select defaultValue="routine">
                                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl text-slate-700 font-medium shadow-sm">
                                    <SelectValue placeholder="เลือกความเร่งด่วน" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="routine">Routine (ปกติ)</SelectItem>
                                    <SelectItem value="urgent">Urgent (ด่วน)</SelectItem>
                                    <SelectItem value="emergency">Emergency (วิกฤต)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">การวินิจฉัย (Diagnosis)</Label>
                        <Input 
                            placeholder="ระบุการวินิจฉัยโรค..." 
                            className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm"
                        />
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">เหตุผลการส่งตัว / รายละเอียดการรักษา</Label>
                        <Textarea 
                            placeholder="อธิบายรายละเอียดอาการ และเหตุผลที่ต้องส่งต่อ..." 
                            className="min-h-[120px] bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base resize-none p-4 shadow-sm"
                        />
                    </div>

                    {/* Inline Footer Actions */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-slate-100 bg-white">
                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                onClick={onClose}
                                className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[16px] font-bold"
                            >
                                ยกเลิก
                            </Button>
                            <Button 
                                onClick={() => setStep(2)}
                                className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
                            >
                                ถัดไป
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8">
                    {/* Section B Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#7066a9] rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-800">B. ปลายทางและเอกสาร</h2>
                    </div>

                    {/* Destination Hospital */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">
                            โรงพยาบาลปลายทาง <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                            <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl text-slate-700 text-base shadow-sm">
                                <SelectValue placeholder="เลือกโรงพยาบาล..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hosp1">โรงพยาบาลศูนย์ขอนแก่น</SelectItem>
                                <SelectItem value="hosp2">โรงพยาบาลศรีนครินทร์</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-3">
                        <Label className="text-slate-700 font-bold text-base">
                            แนบเอกสารประกอบ (ผล Lab, X-Ray, ประวัติ)
                        </Label>
                        
                        {/* Dropzone */}
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                                <Upload className="w-6 h-6" />
                            </div>
                            <p className="text-slate-700 font-medium mb-1">
                                คลิกเพื่ออัปโหลด หรือลากไฟล์มาวางที่นี่
                            </p>
                            <p className="text-slate-400 text-sm">
                                รองรับ PDF, JPG, PNG (Max 10MB)
                            </p>
                        </div>

                        {/* File Item */}
                        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-slate-700 truncate">blood_test_results.pdf</span>
                                    <span className="text-xs text-slate-400">2.4 MB</span>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-slate-100 bg-white">
                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setStep(1)}
                                className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[16px] font-bold"
                            >
                                ย้อนกลับ
                            </Button>
                            <Button 
                                onClick={() => setStep(3)} 
                                className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
                            >
                                ถัดไป
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-8 pt-4">
                    <div className="flex flex-col items-center text-center space-y-6">
                        {/* Icon */}
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-green-200 shadow-lg">
                                <Check className="w-8 h-8 text-white stroke-[3]" />
                            </div>
                        </div>
                        
                        {/* Text */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-800">ยืนยันการส่งข้อมูล?</h2>
                            <p className="text-slate-500 text-sm px-4 leading-relaxed">
                                กรุณาตรวจสอบความถูกต้อง ข้อมูลจะถูกส่งไปยัง
                                <span className="text-[#7066a9] font-bold mx-1">ไม่ระบุ</span> 
                                และเจ้าหน้าที่ปลายทางจะได้รับการแจ้งเตือนทันที
                            </p>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl p-6 space-y-4 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">ผู้ป่วย:</span>
                            <span className="text-slate-800 font-bold text-lg">{searchQuery || "ด.ช. รักดี มีสุข"}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">ความเร่งด่วน:</span>
                            <span className="text-slate-800 font-bold">Routine</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">การวินิจฉัย:</span>
                            <span className="text-slate-800 font-bold">-</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-slate-100 bg-white">
                        <div className="flex gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setStep(2)}
                                className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[16px] font-bold"
                            >
                                ย้อนกลับ
                            </Button>
                            <Button 
                                onClick={() => {
                                  if (onSubmit) onSubmit({ patient: searchQuery, hospital });
                                }} 
                                className="flex-1 h-[48px] rounded-xl bg-[#10b981] hover:bg-[#059669] text-white shadow-md shadow-green-200 text-[16px] font-bold"
                            >
                                ยืนยัน
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>,
    document.body
  );
}