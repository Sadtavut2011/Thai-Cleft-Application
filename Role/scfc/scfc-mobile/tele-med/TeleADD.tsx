import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  Video,
  Calendar,
  Clock,
  Link as LinkIcon,
  ExternalLink,
  User,
  Building2,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Trash2,
  Globe,
  Activity,
  Save
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { toast } from "sonner@2.0.3";
import { cn } from "../../../../components/ui/utils";
import { HospitalSelector } from "../../../cm/cm-mobile/patient/hospitalSelector";
import { PcuSelector } from "../../../cm/cm-mobile/patient/pcuSelector";
import { AcceptAppointDialog } from "../../../cm/cm-mobile/appointment/AcceptAppointDialog";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";
import { PATIENTS_DATA, getPatientByHn } from "../../../../data/patientData";

interface TeleADDProps {
  onBack: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  initialPatient?: any;
}

// Due patients derived from PATIENTS_DATA
const DUE_PATIENTS = PATIENTS_DATA.filter(p => p.nextAppointment || p.status === 'Active').slice(0, 4).map((p, i) => {
  const nextTreatment = p.timeline?.find(t => t.status === 'pending' || t.status === 'scheduled' || t.status === 'รอดำเนินการ');
  return {
    id: p.id,
    name: p.name,
    hn: p.hn,
    treatment: nextTreatment?.stage || p.diagnosis || 'ติดตามอาการ',
    status: i % 2 === 0 ? 'due-today' as const : 'upcoming' as const,
    age: p.age,
    province: p.addressProvince || p.hospital || '-',
    lastVisit: p.history?.[0]?.date || '-',
    responsiblePcu: p.responsibleHealthCenter || '-',
  };
});

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const STEPS = [
  { part: 1, title: "ข้อมูลนัดหมาย", subtitle: "ผู้ป่วย, วัน/เวลา และรายละเอียด", id: "appointment_info" },
  { part: 2, title: "ข้อมูลการประชุม", subtitle: "ลิงก์ประชุมและผู้รับปลายทาง", id: "meeting_info" },
];

function formatThaiDate(d: Date) {
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function formatTime(d: Date) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} น.`;
}

export function TeleADD({ onBack, onSave, initialData, initialPatient }: TeleADDProps) {
  const isEdit = !!initialData;

  // Default patient from PATIENTS_DATA
  const defaultPatient = (() => {
    const p = getPatientByHn('64001234');
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      hn: p.hn,
      age: p.age,
      province: p.addressProvince || p.hospital || '-',
      lastVisit: p.history?.[0]?.date || '-',
      responsiblePcu: p.responsibleHealthCenter || '-',
    };
  })();

  // Step state
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = STEPS.length;
  const currentStepData = STEPS[currentStep];

  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState(isEdit ? initialData.hn : (initialPatient?.hn || defaultPatient?.hn || ""));
  const [selectedPatient, setSelectedPatient] = useState<any>(isEdit ? initialData : (initialPatient ? {
    name: initialPatient.name,
    hn: initialPatient.hn,
    age: initialPatient.age || "N/A",
    province: initialPatient.province || initialPatient.hospital || "N/A",
    lastVisit: initialPatient.lastVisit || "N/A"
  } : defaultPatient));
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<Date | null>(null);
  const [appointmentDetails, setAppointmentDetails] = useState("");
  const [meetingUrl, setMeetingUrl] = useState(initialData?.meetingUrl || "");
  const [requestType, setRequestType] = useState<string>(initialData?.requestType || "direct");
  const [isHospitalSelectorOpen, setIsHospitalSelectorOpen] = useState(false);
  const [selectedCMHospital, setSelectedCMHospital] = useState<string>("");
  const [isPcuSelectorOpen, setIsPcuSelectorOpen] = useState(false);
  const [selectedPcu, setSelectedPcu] = useState<string>(() => {
    if (initialPatient?.responsibleHealthCenter && initialPatient.responsibleHealthCenter !== '-') {
      return initialPatient.responsibleHealthCenter;
    }
    if (initialPatient?.responsiblePcu) {
      return initialPatient.responsiblePcu;
    }
    const hn = initialPatient?.hn || initialData?.hn || "";
    if (hn) {
      const found = getPatientByHn(hn);
      if (found?.responsibleHealthCenter && found.responsibleHealthCenter !== '-') {
        return found.responsibleHealthCenter;
      }
    }
    return "";
  });

  // Drag scroll for due patients
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollContainerRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
  };

  const handleSearch = (query?: string) => {
    if (isDragging) return;
    const term = query || searchQuery;
    if (!term) return;

    const foundDue = DUE_PATIENTS.find(p => p.hn === term || p.name.includes(term));
    if (foundDue) {
      setSelectedPatient(foundDue);
      setSearchQuery(foundDue.hn);
      if (foundDue.responsiblePcu && foundDue.responsiblePcu !== '-') setSelectedPcu(foundDue.responsiblePcu);
    } else {
      const foundFull = PATIENTS_DATA.find(p => p.hn === term || p.name.includes(term));
      if (foundFull) {
        setSelectedPatient({
          name: foundFull.name, hn: foundFull.hn, age: foundFull.age,
          province: foundFull.addressProvince || foundFull.hospital || '-',
          lastVisit: foundFull.history?.[0]?.date || '-',
          responsiblePcu: foundFull.responsibleHealthCenter || '-',
        });
        setSearchQuery(foundFull.hn);
        if (foundFull.responsibleHealthCenter && foundFull.responsibleHealthCenter !== '-') setSelectedPcu(foundFull.responsibleHealthCenter);
      } else {
        toast.error("ไม่พบข้อมูลผู้ป่วย กรุณาตรวจสอบ HN หรือชื่อ");
        return;
      }
    }
    toast.success("ดึงข้อมูลโปรไฟล์ผู้ป่วยเรียบร้อยแล้ว");
  };

  const handleTestLink = () => {
    if (!meetingUrl) { toast.error("กรุณาใส่ URL ของห้องประชุมก่อน"); return; }
    toast.info("กำลังตรวจสอบลิงก์...", { icon: <Globe size={16} /> });
    setTimeout(() => toast.success("ลิงก์ถูกต้อง พร้อมใช้งาน"), 1000);
  };

  const handleNext = () => {
    // Validate step 1
    if (currentStep === 0) {
      if (!selectedPatient) { toast.error("กรุณาเลือกผู้ป่วยก่อน"); return; }
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      document.querySelector('.scrollable-content')?.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      document.querySelector('.scrollable-content')?.scrollTo(0, 0);
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    if (!meetingUrl) { toast.error("กรุณาใส่ลิงก์ห้องประชุม"); return; }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("บันทึกและส่งการแจ้งเตือนเรียบร้อยแล้ว", {
        description: `ส่งข้อมูลนัดหมายไปยัง ${requestType === 'direct' ? selectedPatient?.name : requestType === 'via-cm' ? selectedCMHospital || 'โรงพยาบาล CM' : 'รพ.สต. ปลายทาง'}`,
      });
      onBack();
    }, 1500);
  };

  // Full-page selectors
  if (isHospitalSelectorOpen) {
    return (
      <HospitalSelector
        initialSelected={selectedCMHospital}
        onSave={(value) => { setSelectedCMHospital(value); setIsHospitalSelectorOpen(false); }}
        onBack={() => setIsHospitalSelectorOpen(false)}
      />
    );
  }
  if (isPcuSelectorOpen) {
    return (
      <PcuSelector
        initialSelected={selectedPcu}
        onSave={(value) => { setSelectedPcu(value); setIsPcuSelectorOpen(false); }}
        onBack={() => setIsPcuSelectorOpen(false)}
      />
    );
  }

  // ── Step Renderers ──
  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

      {/* Patient Search */}
      <div className="space-y-2">
        <Label className="text-slate-700 font-bold text-base">
          ผู้ป่วย <span className="text-red-500">*</span>
        </Label>
        {!selectedPatient ? (
          <div className="relative group">
            <Input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (!e.target.value) setSelectedPatient(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="ค้นหา HN / ชื่อ-นามสกุล..."
              className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4"
            />
            {/* Autocomplete */}
            {searchQuery && !selectedPatient && (() => {
              const filtered = PATIENTS_DATA.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.hn.includes(searchQuery)
              ).slice(0, 6);
              if (!filtered.length) return null;
              return (
                <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl mt-1 z-50 max-h-60 overflow-y-auto">
                  {filtered.map((patient, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-50 last:border-0 flex items-center gap-2"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchQuery(patient.hn);
                        handleSearch(patient.hn);
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
              );
            })()}
          </div>
        ) : (
          <Input
            value={`${selectedPatient?.name} (HN: ${selectedPatient?.hn})`}
            readOnly
            className="h-14 bg-white border-slate-200 rounded-2xl text-base shadow-sm px-5 text-[#3b3578] font-medium"
          />
        )}
      </div>

      {/* Due Patients Suggestions */}
      {!isEdit && !selectedPatient && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
            <Activity className="text-[#7066a9]" size={16} />
            ผู้ป่วยถึงกำหนด (Due)
          </h3>
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto whitespace-nowrap -mx-4 px-4 pb-2 cursor-grab active:cursor-grabbing no-scrollbar"
            onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}
            style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
          >
            <div className="inline-flex gap-3">
              {DUE_PATIENTS.map((p) => (
                <div
                  key={p.id}
                  className="w-[260px] shrink-0 bg-white border border-slate-200 shadow-sm rounded-xl p-4 active:scale-95 transition-transform select-none cursor-pointer"
                  onClick={() => handleSearch(p.hn)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-[#f0edf9] p-2 rounded-lg text-[#7066a9]"><User size={16} /></div>
                    <span className={cn(
                      "inline-flex items-center text-[10px] font-bold border-none px-2 h-5 rounded-full",
                      p.status === 'due-today' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {p.status === 'due-today' ? 'วันนี้' : 'พรุ่งนี้'}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{p.name}</h4>
                    <p className="text-xs text-slate-500">HN: {p.hn}</p>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 h-[46px] whitespace-normal">
                    {p.treatment}
                  </p>
                  <Button variant="ghost" className="w-full h-8 bg-[#f0edf9] text-[#7066a9] hover:bg-[#e4dff5] text-xs font-bold rounded-lg pointer-events-none">
                    สร้างนัดหมาย
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date & Time Pickers */}
      {selectedPatient && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold text-base">วันที่นัดหมาย</Label>
              <AcceptAppointDialog
                mode="date"
                initialDate={appointmentDate || undefined}
                title="เลือกวันที่นัดหมาย"
                description="เลือกวันที่สำหรับ Tele-consult"
                confirmLabel="เลือกวันนี้"
                onSave={(d) => setAppointmentDate(d)}
                trigger={
                  <button
                    type="button"
                    className="w-full h-12 flex items-center gap-3 px-4 bg-white border border-slate-200 rounded-xl shadow-sm text-left hover:bg-slate-50 transition-colors"
                  >
                    <Calendar size={16} className="text-[#7066a9] shrink-0" />
                    <span className={cn("text-sm truncate", appointmentDate ? "text-slate-800" : "text-slate-400")}>
                      {appointmentDate ? formatThaiDate(appointmentDate) : "เลือกวันที่"}
                    </span>
                  </button>
                }
              />
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold text-base">เวลา</Label>
              <AcceptAppointDialog
                mode="time"
                initialDate={appointmentTime || undefined}
                title="เลือกเวลา"
                description="เลือกเวลาสำหรับ Tele-consult"
                confirmLabel="ยืนยันเวลา"
                onSave={(d) => setAppointmentTime(d)}
                trigger={
                  <button
                    type="button"
                    className="w-full h-12 flex items-center gap-3 px-4 bg-white border border-slate-200 rounded-xl shadow-sm text-left hover:bg-slate-50 transition-colors"
                  >
                    <Clock size={16} className="text-[#7066a9] shrink-0" />
                    <span className={cn("text-sm truncate", appointmentTime ? "text-slate-800" : "text-slate-400")}>
                      {appointmentTime ? formatTime(appointmentTime) : "เลือกเวลา"}
                    </span>
                  </button>
                }
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-bold text-base">รายละเอียดนัดหมาย</Label>
            <Textarea
              value={appointmentDetails}
              onChange={(e) => setAppointmentDetails(e.target.value)}
              placeholder="ระบุวัตถุประสงค์ / เรื่องที่ต้องการปรึกษา..."
              className="min-h-[120px] bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base resize-none p-4 shadow-sm"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

      {/* Meeting URL */}
      <div className="space-y-3">
        <Label className="text-slate-700 font-bold text-base">
          ลิงก์ห้องประชุม (Meeting URL) <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <Input
              placeholder="วางลิงก์ Zoom / Meet / Teams..."
              className="h-12 pl-10 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleTestLink}
            className="h-12 w-12 border-slate-200 text-slate-600 rounded-xl shrink-0"
          >
            <ExternalLink size={18} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Zoom', 'Microsoft Teams', 'Google Meet'].map((p) => (
            <span key={p} className="text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500 font-medium border border-slate-200">{p}</span>
          ))}
        </div>
      </div>

      {/* Recipient */}
      <div className="space-y-3">
        <Label className="text-slate-700 font-bold text-base">ผู้รับปลายทาง</Label>
        <RadioGroup value={requestType} onValueChange={setRequestType} className="grid grid-cols-1 gap-3">
          {/* Direct */}
          <Label
            htmlFor="direct"
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
              requestType === "direct" ? "border-[#7066a9] bg-[#f0edf9]" : "border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", requestType === "direct" ? "bg-[#7066a9]/20 text-[#7066a9]" : "bg-slate-100 text-slate-400")}>
              <User size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">ส่งตรงผู้ป่วย</p>
              <p className="text-[11px] text-slate-500">แจ้งเตือนผ่าน SMS/App</p>
            </div>
            <RadioGroupItem value="direct" id="direct" className="text-[#7066a9]" />
          </Label>

          {/* Via Hospital (PCU) */}
          <Label
            htmlFor="via-hospital"
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
              requestType === "via-hospital" ? "border-[#7066a9] bg-[#f0edf9]" : "border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", requestType === "via-hospital" ? "bg-[#7066a9]/20 text-[#7066a9]" : "bg-slate-100 text-slate-400")}>
              <Building2 size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">ผ่านหน่วยงาน (PCU)</p>
              <p className="text-[11px] text-slate-500">เจ้าหน้าที่ประสานงานต่อ</p>
            </div>
            <RadioGroupItem value="via-hospital" id="via-hospital" className="text-[#7066a9]" />
          </Label>

          {/* Via CM Hospital */}
          <Label
            htmlFor="via-cm"
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
              requestType === "via-cm" ? "border-[#7066a9] bg-[#f0edf9]" : "border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", requestType === "via-cm" ? "bg-[#7066a9]/20 text-[#7066a9]" : "bg-slate-100 text-slate-400")}>
              <Building2 size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">ผ่านโรงพยาบาล CM</p>
              <p className="text-[11px] text-slate-500">เจ้าหน้าที่ประสานงานต่อ</p>
            </div>
            <RadioGroupItem value="via-cm" id="via-cm" className="text-[#7066a9]" />
          </Label>
        </RadioGroup>

        {/* PCU Selector */}
        {requestType === "via-hospital" && (
          <div className="animate-in slide-in-from-top-1 space-y-2 pt-2">
            <Label className="text-sm font-bold text-slate-700">เลือกหน่วยงาน <span className="text-red-500">*</span></Label>
            <div
              onClick={() => setIsPcuSelectorOpen(true)}
              className="relative cursor-pointer"
            >
              <Input
                value={selectedPcu}
                readOnly
                placeholder="เลือกหน่วยงาน..."
                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4 cursor-pointer"
              />
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
        )}

        {/* Hospital Selector */}
        {requestType === "via-cm" && (
          <div className="animate-in slide-in-from-top-1 space-y-2 pt-2">
            <Label className="text-sm font-bold text-slate-700">โรงพยาบาล <span className="text-red-500">*</span></Label>
            <div
              onClick={() => setIsHospitalSelectorOpen(true)}
              className="relative cursor-pointer"
            >
              <Input
                value={selectedCMHospital}
                readOnly
                placeholder="เลือกโรงพยาบาล..."
                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm px-4 cursor-pointer"
              />
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "appointment_info": return renderStep1();
      case "meeting_info": return renderStep2();
      default: return null;
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
          onClick={handleBack}
          className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-white text-lg truncate">
            {isEdit ? "แก้ไขนัดหมาย Tele-consult" : "สร้างนัดหมาย Tele-consult"}
          </h1>
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

      {/* Footer */}
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
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                บันทึก...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                ยืนยัน
              </>
            )}
          </Button>
        )}
      </div>

    </div>,
    document.body
  );
}