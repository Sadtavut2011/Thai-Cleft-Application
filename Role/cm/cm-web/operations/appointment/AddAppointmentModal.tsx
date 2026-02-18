import React, { useState } from 'react';
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Home, 
  Stethoscope, 
  User, 
  Minus,
  ChevronRight,
  ArrowLeft,
  CalendarPlus,
  Search as SearchIcon
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { Label } from "../../../../../components/ui/label";
import { Calendar } from "../../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";

import { PATIENTS_DATA } from "../../../../../data/patientData";

// Import shared selector components
import { HospitalSelector } from "../../patient/hospitalSelectorweb";
import { MedicSelector } from "../../patient/medicSelectorweb";
import { RoomSelector } from "../../patient/RoomSelectorweb";
import { TreatmentSelector } from "../../patient/TreatmentSelectorweb";

interface AddAppointmentModalProps {
  onBack: () => void;
  onConfirm: (data: any) => void;
  initialData?: any;
}

type ActiveSelector = 'hospital' | 'room' | 'treatment' | 'doctor' | null;

export function AddAppointmentModal({ onBack, onConfirm, initialData }: AddAppointmentModalProps) {
  const isEditMode = !!initialData?.id;
  const [patientInput, setPatientInput] = useState(initialData?.patientName || "");
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );
  
  // Parse time range "09:00 - 10:00" or simple "09:00"
  const initialStartTime = initialData?.time ? initialData.time.split(' - ')[0] : "09:00";
  const initialEndTime = initialData?.time && initialData.time.includes(' - ') ? initialData.time.split(' - ')[1] : "10:00";

  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [hospital, setHospital] = useState(initialData?.hospital || "โรงพยาบาลฝาง");
  const [room, setRoom] = useState(initialData?.clinic || "");
  const [treatment, setTreatment] = useState(initialData?.treatment || "");
  const [doctor, setDoctor] = useState(initialData?.doctorName || "");
  const [note, setNote] = useState(initialData?.note || (isEditMode ? "ติดตามอาการต่อเนื่อง" : ""));

  // Active selector state
  const [activeSelector, setActiveSelector] = useState<ActiveSelector>(null);

  const formatThaiDate = (d: Date): string => {
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleConfirm = () => {
    if (!patientInput || !date) {
        return; 
    }

    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const data = {
        patientName: patientInput,
        hn: "-",
        date: dateStr,
        time: `${startTime} - ${endTime}`,
        hospital,
        clinic: room || "แผนกทั่วไป",
        treatment,
        doctorName: doctor,
        note
    };
    onConfirm(data);
  };

  const MOCK_PATIENTS = PATIENTS_DATA.map(p => ({
    id: p.id || p.hn,
    name: p.name,
    hn: p.hn || p.id,
  }));
  const filteredPatients = patientInput ? MOCK_PATIENTS.filter(p => p.name.includes(patientInput) || p.hn.includes(patientInput)) : [];

  const inputStyle = "bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors h-11";

  // ===== Render Selector Pages =====
  if (activeSelector === 'hospital') {
    return (
      <HospitalSelector
        initialSelected={hospital}
        onSave={(value) => {
          setHospital(value);
          setActiveSelector(null);
        }}
        onBack={() => setActiveSelector(null)}
      />
    );
  }

  if (activeSelector === 'room') {
    return (
      <RoomSelector
        initialSelected={room}
        onSave={(value) => {
          setRoom(value);
          setActiveSelector(null);
        }}
        onBack={() => setActiveSelector(null)}
      />
    );
  }

  if (activeSelector === 'treatment') {
    return (
      <TreatmentSelector
        initialSelected={treatment}
        onSave={(value) => {
          setTreatment(value);
          setActiveSelector(null);
        }}
        onBack={() => setActiveSelector(null)}
      />
    );
  }

  if (activeSelector === 'doctor') {
    return (
      <MedicSelector
        initialSelected={doctor}
        onSave={(value) => {
          setDoctor(value);
          setActiveSelector(null);
        }}
        onBack={() => setActiveSelector(null)}
      />
    );
  }

  // ===== Main Form =====
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
        {/* Header Banner */}
        <div className="bg-white p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-[#5e5873] font-bold text-lg">
                    {isEditMode ? "แก้ไขนัดหมาย (Edit Appointment)" : "เพิ่มนัดหมายใหม่ (New Appointment)"}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? "แก้ไขรายละเอียดการนัดหมาย" : "กรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็ว"}
                </p>
            </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-[#EBE9F1] p-6 max-w-4xl mx-auto">
            <div className="space-y-8">
            
            {/* Section 1: Patient Info */}
            <div className="space-y-4">
               <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                  <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
               </h3>
               
               <div className="space-y-2">
                    <Label className="text-sm font-semibold text-[#5e5873]">ค้นหาผู้ป่วย (ชื่อ หรือ HN) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input 
                            className="pl-9 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] h-11"
                            placeholder="พิมพ์ชื่อผู้ป่วย หรือรหัส HN..."
                            value={patientInput}
                            onChange={(e) => setPatientInput(e.target.value)}
                        />
                        {patientInput && filteredPatients.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                                {filteredPatients.map((patient) => (
                                    <div 
                                        key={patient.id}
                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 flex justify-between items-center group"
                                        onClick={() => setPatientInput(`${patient.name} (${patient.hn})`)}
                                    >
                                        <div>
                                            <p className="font-medium text-sm text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{patient.name}</p>
                                            <p className="text-xs text-gray-500">HN: {patient.hn}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
               </div>
            </div>

            {/* Section 2: Date & Time */}
            <div className="space-y-4">
               <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                  <CalendarIcon className="w-5 h-5 text-[#7367f0]" /> วันและเวลานัดหมาย
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">วันที่นัดหมาย <span className="text-red-500">*</span></Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-11 bg-[#F8F8F8] border-none hover:bg-gray-100 shadow-none",
                                        date ? "text-[#5e5873]" : "text-gray-400"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                    {date ? formatThaiDate(date) : "เลือกวันที่"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">เวลา <span className="text-red-500">*</span></Label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                    className={cn(inputStyle, "pl-9 text-center")}
                                    placeholder="Start"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <Minus size={16} className="text-gray-300 shrink-0" />
                            <div className="relative flex-1">
                                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                    className={cn(inputStyle, "pl-9 text-center")}
                                    placeholder="End"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-1">
                            {['08:00', '13:00', '16:00'].map((time) => (
                                <button 
                                    key={time} 
                                    onClick={() => setStartTime(time)}
                                    className={cn(
                                        "px-3 py-1 rounded-md text-xs transition-colors",
                                        startTime === time 
                                            ? "bg-[#7367f0]/10 text-[#7367f0] font-medium" 
                                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                    )}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
               </div>
            </div>

            {/* Section 3: Treatment Details — using shared selectors */}
            <div className="space-y-4">
               <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Stethoscope className="w-5 h-5 text-[#7367f0]" /> ข้อมูลการรักษา
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hospital */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">โรงพยาบาล <span className="text-red-500">*</span></Label>
                        <div 
                            onClick={() => setActiveSelector('hospital')}
                            className="relative cursor-pointer"
                        >
                            <div className={cn(
                                "h-11 px-4 bg-[#F8F8F8] rounded-lg flex items-center justify-between transition-all border",
                                hospital 
                                    ? "border-[#7367f0] bg-[#7367f0]/5" 
                                    : "border-transparent hover:bg-gray-100"
                            )}>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <MapPin size={16} className={hospital ? "text-[#7367f0]" : "text-gray-400"} />
                                    <span className={cn(
                                        "text-sm truncate",
                                        hospital ? "text-[#5e5873] font-medium" : "text-gray-400"
                                    )}>
                                        {hospital || "เลือกโรงพยาบาล"}
                                    </span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Room */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">ห้องตรวจ</Label>
                        <div 
                            onClick={() => setActiveSelector('room')}
                            className="relative cursor-pointer"
                        >
                            <div className={cn(
                                "h-11 px-4 bg-[#F8F8F8] rounded-lg flex items-center justify-between transition-all border",
                                room 
                                    ? "border-[#7367f0] bg-[#7367f0]/5" 
                                    : "border-transparent hover:bg-gray-100"
                            )}>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Home size={16} className={room ? "text-[#7367f0]" : "text-gray-400"} />
                                    <span className={cn(
                                        "text-sm truncate",
                                        room ? "text-[#5e5873] font-medium" : "text-gray-400"
                                    )}>
                                        {room || "เลือกห้องตรวจ"}
                                    </span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Treatment */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">การรักษา <span className="text-red-500">*</span></Label>
                        <div 
                            onClick={() => setActiveSelector('treatment')}
                            className="relative cursor-pointer"
                        >
                            <div className={cn(
                                "h-11 px-4 bg-[#F8F8F8] rounded-lg flex items-center justify-between transition-all border",
                                treatment 
                                    ? "border-[#7367f0] bg-[#7367f0]/5" 
                                    : "border-transparent hover:bg-gray-100"
                            )}>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Stethoscope size={16} className={treatment ? "text-[#7367f0]" : "text-gray-400"} />
                                    <span className={cn(
                                        "text-sm truncate",
                                        treatment ? "text-[#5e5873] font-medium" : "text-gray-400"
                                    )}>
                                        {treatment || "เลือกการรักษา"}
                                    </span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                            </div>
                        </div>
                    </div>

                    {/* Doctor */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">ชื่อผู้ที่รักษา</Label>
                        <div 
                            onClick={() => setActiveSelector('doctor')}
                            className="relative cursor-pointer"
                        >
                            <div className={cn(
                                "h-11 px-4 bg-[#F8F8F8] rounded-lg flex items-center justify-between transition-all border",
                                doctor 
                                    ? "border-[#7367f0] bg-[#7367f0]/5" 
                                    : "border-transparent hover:bg-gray-100"
                            )}>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <User size={16} className={doctor ? "text-[#7367f0]" : "text-gray-400"} />
                                    <span className={cn(
                                        "text-sm truncate",
                                        doctor ? "text-[#5e5873] font-medium" : "text-gray-400"
                                    )}>
                                        {doctor || "เลือกผู้ที่รักษา"}
                                    </span>
                                </div>
                                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                            </div>
                        </div>
                    </div>
               </div>
            </div>

            {/* Section 4: Note */}
            <div className="space-y-4">
               <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Home className="w-5 h-5 text-[#7367f0]" /> รายละเอียดเพิ่มเติม
               </h3>
               
               <div className="space-y-2">
                    <Label className="text-sm font-semibold text-[#5e5873]">หมายเหตุ / รายละเอียดการนัดหมาย</Label>
                    <textarea 
                        className="w-full min-h-[100px] rounded-lg p-4 text-sm resize-none bg-[#F8F8F8] border-none focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors"
                        placeholder="ระบุรายละเอียดการนัดหมายเพิ่มเติม..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
               </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                 <Button 
                    variant="outline"
                    onClick={onBack}
                    className="h-11 px-8 text-gray-600"
                 >
                    ยกเลิก
                 </Button>
                 <Button 
                    onClick={handleConfirm}
                    className="bg-[#7367f0] hover:bg-[#5e54ce] h-11 px-8 shadow-md shadow-indigo-200 transition-all"
                 >
                    {isEditMode ? "บันทึกการแก้ไข" : "บันทึกนัดหมาย"}
                 </Button>
            </div>
            </div>
        </div>
    </div>
  );
}