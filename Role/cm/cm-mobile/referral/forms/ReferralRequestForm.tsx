import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { 
  FileText, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  X, 
  Check,
  MapPin,
  Save,
  ArrowLeft
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";
import { PATIENTS_DATA } from "../../../../../data/patientData";
import { HospitalSelector } from "../../patient/hospitalSelector";
import { useRole } from "../../../../../context/RoleContext";

interface ReferralRequestFormProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialPatient?: any;
}

const STEPS = [
    { part: 1, title: "ข้อมูลทั่วไป", subtitle: "ข้อมูลผู้ป่วยและการรักษา", id: "patient_info" },
    { part: 2, title: "การส่งตัว", subtitle: "ปลายทางและเอกสาร", id: "destination" },
    { part: 3, title: "ยืนยัน", subtitle: "ตรวจสอบและยืนยัน", id: "confirm" },
];

export function ReferralRequestForm({ onClose, onSubmit, initialPatient }: ReferralRequestFormProps) {
  const { currentRole } = useRole();
  const [currentStep, setCurrentStep] = useState(0); // 0-based index to match HomeVisitForm
  const [searchQuery, setSearchQuery] = useState(
    initialPatient 
      ? `${initialPatient.name || ''} (HN: ${initialPatient.hn || initialPatient.cid || ''})`
      : ""
  );
  // Store the actual selected patient object
  const [selectedPatient, setSelectedPatient] = useState<any>(initialPatient || null);
  
  const [hospital, setHospital] = useState(initialPatient?.hospital || "");
  const [destinationHospital, setDestinationHospital] = useState("");
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [reason, setReason] = useState("");

  const filteredPatients = PATIENTS_DATA.filter(p => 
    !searchQuery || 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.hn.includes(searchQuery)
  );

  const totalSteps = STEPS.length;
  const currentStepData = STEPS[currentStep];

  const handleNext = () => {
      if (currentStep < totalSteps - 1) {
          setCurrentStep(currentStep + 1);
          window.scrollTo(0, 0); // Scroll to top might not work in portal if container scrolls, need to scroll container
          document.querySelector('.scrollable-content')?.scrollTo(0, 0);
      }
  };

  const handleBack = () => {
      if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
          document.querySelector('.scrollable-content')?.scrollTo(0, 0);
      } else {
          onClose();
      }
  };
  
  const handleSubmit = () => {
      if (onSubmit) {
          // Prepare complete data object
          const referralData = {
              patient: searchQuery,
              patientData: selectedPatient, // Include full patient object
              fromHospital: hospital,
              toHospital: destinationHospital,
              diagnosis: diagnosis,
              reason: reason,
              date: new Date().toISOString()
          };
          onSubmit(referralData);
      }
  };

  if (showHospitalSelector) {
      return (
          <HospitalSelector 
              initialSelected={destinationHospital}
              onSave={(val) => {
                  setDestinationHospital(val);
                  setShowHospitalSelector(false);
              }}
              onBack={() => setShowHospitalSelector(false)}
          />
      );
  }

  const renderStepContent = () => {
      switch (currentStepData.id) {
          case "patient_info":
              return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Search Field */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">
                            ผู้ป่วย <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative group">
                            <Input 
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    // Reset selected patient if user clears input
                                    if (!e.target.value) setSelectedPatient(null);
                                }}
                                placeholder="ค้นหาชื่อ หรือ HN..." 
                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                            />
                            {/* Autocomplete Dropdown */}
                            {searchQuery && filteredPatients.length > 0 && !selectedPatient && (
                                <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl mt-1 z-50 max-h-60 overflow-y-auto">
                                    {filteredPatients.map((patient, index) => (
                                        <div 
                                            key={index}
                                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-0 flex items-center gap-2"
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevent input blur
                                                setSearchQuery(`${patient.name} (HN: ${patient.hn})`);
                                                setSelectedPatient(patient);
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
                            {currentRole === 'PCU' ? 'หน่วยงานต้นทาง' : 'โรงพยาบาลต้นทาง'}
                        </Label>
                        <div className="relative">
                            <Input 
                                value={currentRole === 'PCU' ? hospital : hospital.replace(/รพ\./g, 'โรงพยาบาล')}
                                readOnly
                                placeholder={currentRole === 'PCU' ? 'หน่วยงานต้นสังกัด' : 'โรงพยาบาลต้นสังกัด'}
                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                            />
                        </div>
                    </div>

                    {/* Destination Hospital — shown in Step 1 for PCU role */}
                    {currentRole === 'PCU' && (
                        <div className="space-y-2">
                            <Label className="text-slate-700 font-bold text-base">
                                โรงพยาบาลปลายทาง <span className="text-red-500">*</span>
                            </Label>
                            <div 
                                onClick={() => setShowHospitalSelector(true)}
                                className="relative cursor-pointer"
                            >
                                <Input 
                                    value={destinationHospital}
                                    readOnly
                                    placeholder="เลือกโรงพยาบาล..." 
                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4 cursor-pointer"
                                />
                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                    )}

                    {/* HN & Urgency Row */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold">ความเร่งด่วน</Label>
                        <Select defaultValue="routine">
                            <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm">
                                <SelectValue placeholder="เลือกความเร่งด่วน" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="routine">Routine (ปกติ)</SelectItem>
                                <SelectItem value="urgent">Urgent (ด่วน)</SelectItem>
                                <SelectItem value="emergency">Emergency (วิกฤต)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Diagnosis */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">การวินิจฉัย (Diagnosis)</Label>
                        <Input 
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="ระบุการวินิจฉัยโรค..." 
                            className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
                        />
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">เหตุผลการส่งตัว / รายละเอียดการรักษา</Label>
                        <Textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="อธิบายรายละเอียดอาการ และเหตุผลที่ต้องส่งต่อ..." 
                            className="min-h-[120px] bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base resize-none p-4 shadow-sm"
                        />
                    </div>
                </div>
              );
          case "destination":
              return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Destination Hospital */}
                    <div className="space-y-2">
                        <Label className="text-slate-700 font-bold text-base">
                            โรงพยาบาลปลายทาง <span className="text-red-500">*</span>
                        </Label>
                        <div 
                            onClick={() => setShowHospitalSelector(true)}
                            className="relative cursor-pointer"
                        >
                            <Input 
                                value={destinationHospital}
                                readOnly
                                placeholder="เลือกโรงพยาบาล..." 
                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4 cursor-pointer"
                            />
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
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
                </div>
              );
          case "confirm":
              return (
                <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-right-4 duration-300">
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
                                <span className="text-[#7066a9] font-bold mx-1">{destinationHospital || "ไม่ระบุ"}</span> 
                                และเจ้าหน้าที่ปลายทางจะได้รับการแจ้งเตือนทันที
                            </p>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl p-6 space-y-4 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">ผู้ป่วย:</span>
                            <span className="text-slate-800 font-bold text-lg text-[16px]">{searchQuery || "ด.ช. รักดี มีสุข"}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">ความเร่งด่วน:</span>
                            <span className="text-slate-800 font-bold">Routine</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">การวินิจฉัย:</span>
                            <span className="text-slate-800 font-bold">{diagnosis || "-"}</span>
                        </div>

                        {/* Hospital Route — inline inside summary card */}
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">{currentRole === 'PCU' ? 'หน่วยงานต้นทาง:' : 'โรงพยาบาลต้นทาง:'}</span>
                            <span className="text-slate-800 font-bold text-right pl-4">{hospital ? (currentRole === 'PCU' ? hospital : hospital.replace(/รพ\./g, 'โรงพยาบาล')) : 'ไม่ระบุ'}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">โรงพยาบาลปลายทาง:</span>
                            <span className="text-slate-800 font-bold text-right pl-4">{destinationHospital || 'ไม่ระบุ'}</span>
                        </div>

                        <div className="flex justify-between items-baseline">
                            <span className="text-slate-500">เหตุผล:</span>
                            <span className="text-slate-800 font-bold text-right pl-4">{reason || "-"}</span>
                        </div>
                    </div>
                </div>
              );
          default:
              return null;
      }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] h-[100dvh] w-full bg-slate-50 flex flex-col font-['IBM_Plex_Sans_Thai']">
      
      {/* Status Bar */}
      <div className="shrink-0 bg-[#7066a9] z-50">
          <StatusBarIPhone16Main />
      </div>

      {/* Header */}
      <div className="shrink-0 z-40 bg-[#7066a9] shadow-sm px-4 py-3 flex items-center gap-3">
          <button 
              onClick={onClose} 
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"
          >
              <ChevronLeft size={24} />
          </button>
          <div className="flex-1 min-w-0">
              <h1 className="font-bold text-white text-lg truncate">สร้างคำขอส่งตัวผู้ป่วย</h1>
          </div>
          <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded text-white">
              Step {currentStep + 1}/{totalSteps}
          </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-200">
          <div 
              className="h-full bg-[#7066a9] transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] scrollable-content">
        <div className="p-4 max-w-3xl mx-auto w-full pb-24 md:pb-6">
            {renderStepContent()}
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white z-[50] border-t border-slate-200 px-4 py-4 flex justify-between items-center pb-safe shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <Button 
                variant="outline" 
                onClick={handleBack}
                className="w-[120px] rounded-xl h-11"
            >
                <ChevronLeft className="w-4 h-4 mr-2" />
                ย้อนกลับ
            </Button>
            
            {currentStep < totalSteps - 1 ? (
                <Button 
                    type="button"
                    onClick={handleNext}
                    className="bg-[#4C4398] hover:bg-[#3f377f] w-[120px] rounded-xl h-11 shadow-md shadow-indigo-200"
                >
                    ถัดไป
                    <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            ) : (
                <Button 
                    className="bg-green-600 hover:bg-green-700 w-[120px] rounded-xl h-11 shadow-md shadow-green-200"
                    onClick={handleSubmit}
                >
                    <Save className="w-4 h-4 mr-2" />
                    ยืนยัน
                </Button>
            )}
      </div>

    </div>,
    document.body
  );
}