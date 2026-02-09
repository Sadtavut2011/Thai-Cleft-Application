import React, { useState, useEffect } from 'react';
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
  CalendarPlus
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar } from "../../../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";

interface AddAppointmentModalProps {
  onBack: () => void;
  onConfirm: (data: any) => void;
  initialData?: any;
}

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
  const [doctor, setDoctor] = useState(initialData?.doctorName || "ปนัดดา");
  const [note, setNote] = useState(initialData?.note || (isEditMode ? "ติดตามอาการต่อเนื่อง" : ""));

  const handleConfirm = () => {
    if (!patientInput || !date) {
        // Basic validation
        return; 
    }

    const data = {
        patientName: patientInput,
        hn: "-", // Default HN since we are using a single search field
        date: date ? format(date, "yyyy-MM-dd") : "",
        time: `${startTime} - ${endTime}`,
        hospital,
        clinic: room || "แผนกทั่วไป",
        treatment,
        doctorName: doctor,
        note
    };
    onConfirm(data);
  };

  const MOCK_PATIENTS = [
    { id: '1', name: 'ด.ช. สมชาย ใจดี', hn: 'HN-6600123' },
    { id: '2', name: 'น.ส. มานี มีนา', hn: 'HN-6600124' },
    { id: '3', name: 'นาย ปิติ ยินดี', hn: 'HN-6600111' },
    { id: '4', name: 'นาย รักษา ดี', hn: 'HN-6600999' },
    { id: '5', name: 'ด.ญ. วีระ วงศ์', hn: 'HN-6600555' }
  ];
  const filteredPatients = patientInput ? MOCK_PATIENTS.filter(p => p.name.includes(patientInput) || p.hn.includes(patientInput)) : [];

  return (
    <>
        {/* Header */}
        <div className="mb-6 bg-[#DFF6F8] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-[#DFF6F8]/80 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5" /> {isEditMode ? "แก้ไขนัดหมาย (Edit Appointment)" : "เพิ่มนัดหมายใหม่ (New Appointment)"}
                </h1>
            </div>
        </div>

        {/* Form Content */}
        <div className="bg-white border border-gray-100 rounded-[16px] p-8 shadow-sm max-w-4xl mx-auto space-y-8">
            
            {/* Section 1: Patient Info */}
            <div>
               <div className="flex items-center gap-2 mb-4 text-[#7367f0]">
                  <User className="w-5 h-5" />
                  <h3 className="font-semibold text-lg text-[#5e5873]">ข้อมูลผู้ป่วย</h3>
               </div>
               
               <div className="space-y-2">
                    <label className="text-sm font-medium text-[#120d26]">ค้นหาผู้ป่วย (ชื่อ หรือ HN) <span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5669FF]">
                            <User size={20} />
                        </div>
                        <Input 
                            className="pl-12 h-[50px] rounded-[12px] border-[#e4dfdf] text-[#747688] text-[14px] focus:ring-[#5669FF] focus:border-[#5669FF] transition-all bg-[#F9FAFB] border-transparent focus:bg-white focus:border-[#5669FF]"
                            placeholder="พิมพ์ชื่อผู้ป่วย หรือรหัส HN..."
                            value={patientInput}
                            onChange={(e) => setPatientInput(e.target.value)}
                        />
                        {patientInput && filteredPatients.length > 0 && (
                            <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-lg z-20 overflow-hidden">
                                {filteredPatients.map((patient) => (
                                    <div 
                                        key={patient.id}
                                        className="px-4 py-3 hover:bg-[#F4F5F7] cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                                        onClick={() => setPatientInput(`${patient.name} (${patient.hn})`)}
                                    >
                                        <div className="font-medium text-[#120d26] text-sm">{patient.name}</div>
                                        <div className="text-xs text-[#747688]">{patient.hn}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
               </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Section 2: Date & Time */}
            <div>
               <div className="flex items-center gap-2 mb-4 text-[#7367f0]">
                  <CalendarIcon className="w-5 h-5" />
                  <h3 className="font-semibold text-lg text-[#5e5873]">วันและเวลานัดหมาย</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#120d26]">วันที่นัดหมาย <span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5669FF] group-focus-within:text-[#4858e0] transition-colors z-10 pointer-events-none">
                                <CalendarIcon size={20} />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal pl-12 h-[50px] rounded-[12px] border-[#e4dfdf] text-[#141518] text-[14px] hover:bg-transparent hover:text-[#141518] focus:ring-[#5669FF] focus:border-[#5669FF] transition-all bg-white shadow-none",
                                            !date && "text-[#747688]"
                                        )}
                                    >
                                        {date ? format(date, "d MMMM yyyy", { locale: th }) : <span>เลือกวันที่</span>}
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
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#120d26]">เวลา <span className="text-red-500">*</span></label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5669FF]">
                                    <Clock size={18} />
                                </div>
                                <Input 
                                    className="pl-10 h-[50px] rounded-[10px] border-[#e6e6e6] text-[#747688] text-[13px] text-center focus:ring-[#5669FF] focus:border-[#5669FF]"
                                    placeholder="Start"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="text-[#CCD2E3]">
                                <Minus size={20} />
                            </div>
                            <div className="relative flex-1 group">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5669FF]">
                                    <Clock size={18} />
                                </div>
                                <Input 
                                    className="pl-10 h-[50px] rounded-[10px] border-[#e6e6e6] text-[#747688] text-[13px] text-center focus:ring-[#5669FF] focus:border-[#5669FF]"
                                    placeholder="End"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* Presets */}
                        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 no-scrollbar">
                            {['08:00', '13:00', '16:00'].map((time) => (
                                <button 
                                    key={time} 
                                    onClick={() => setStartTime(time)}
                                    className="px-3 py-1.5 border border-[#e6e6e6] rounded-[8px] text-[#807a7a] text-[12px] bg-white whitespace-nowrap hover:bg-[#5669FF]/5 hover:text-[#5669FF] hover:border-[#5669FF] transition-colors"
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
               </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Section 3: Treatment Details */}
            <div>
               <div className="flex items-center gap-2 mb-4 text-[#7367f0]">
                  <Stethoscope className="w-5 h-5" />
                  <h3 className="font-semibold text-lg text-[#5e5873]">ข้อมูลการรักษา</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hospital */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#120d26]">โรงพยาบาล <span className="text-red-500">*</span></label>
                        <div className="relative group cursor-pointer">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5669FF]">
                                <MapPin size={20} />
                            </div>
                            <Input 
                                className="pl-12 h-[50px] rounded-[12px] border-[#e4dfdf] text-[#747688] text-[14px] cursor-pointer hover:border-[#5669FF] transition-colors"
                                placeholder="เลือกโรงพยาบาล"
                                value={hospital}
                                onChange={(e) => setHospital(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9da3b5]">
                                <ChevronRight size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Room */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#120d26]">ห้องตรวจ</label>
                        <div className="relative group cursor-pointer">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5669FF] z-10 pointer-events-none">
                                <Home size={20} />
                            </div>
                            <Select value={room} onValueChange={setRoom}>
                                <SelectTrigger className="pl-12 h-[50px] rounded-[12px] border-[#e4dfdf] text-[#747688] text-[14px] hover:border-[#5669FF] transition-colors bg-white">
                                    <SelectValue placeholder="เลือกห้องตรวจ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ศัลยกรรมตกแต่ง">ศัลยกรรมตกแต่ง</SelectItem>
                                    <SelectItem value="ทันตกรรม">ทันตกรรม</SelectItem>
                                    <SelectItem value="ฝึกพูด">ฝึกพูด</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Treatment */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#120d26]">การรักษา <span className="text-red-500">*</span></label>
                        <div className="relative group cursor-pointer">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5669FF] z-10 pointer-events-none">
                                <Stethoscope size={20} />
                            </div>
                            <Select value={treatment} onValueChange={setTreatment}>
                                <SelectTrigger className="pl-12 h-[50px] rounded-[12px] border-[#e4dfdf] text-[#747688] text-[14px] hover:border-[#5669FF] transition-colors bg-white">
                                    <SelectValue placeholder="เลือกการรักษา" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="เย็บริมฝีปาก">เย็บริมฝีปาก</SelectItem>
                                    <SelectItem value="เย็บเพดานปาก">เย็บเพดานปาก</SelectItem>
                                    <SelectItem value="ใส่เพดานเทียม">ใส่เพดานเทียม</SelectItem>
                                    <SelectItem value="ฝึกพูด">ฝึกพูด</SelectItem>
                                    <SelectItem value="ตรวจการได้ยิน">ตรวจการได้ยิน</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Doctor */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#120d26]">ชื่อผู้ที่รักษา</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5669FF]">
                                <div className="w-6 h-6 border border-[#5669FF] rounded-[4px] flex items-center justify-center bg-white group-focus-within:bg-[#5669FF] group-focus-within:text-white transition-colors">
                                     <User size={14} fill="currentColor" />
                                </div>
                            </div>
                            <Input 
                                className="pl-14 h-[50px] rounded-[12px] border-[#e4dfdf] text-[#747688] text-[14px] focus:ring-[#5669FF] focus:border-[#5669FF] transition-all"
                                value={doctor}
                                onChange={(e) => setDoctor(e.target.value)}
                            />
                        </div>
                    </div>
               </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Section 4: Note */}
            <div>
               <div className="flex items-center gap-2 mb-4 text-[#7367f0]">
                  <Home className="w-5 h-5" />
                  <h3 className="font-semibold text-lg text-[#5e5873]">รายละเอียดเพิ่มเติม</h3>
               </div>
               
               <div className="space-y-2">
                    <label className="text-sm font-medium text-[#120d26]">หมายเหตุ / รายละเอียดการนัดหมาย</label>
                    <textarea 
                        className="w-full h-[100px] rounded-[12px] border border-[#e4dfdf] p-4 text-[#747688] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#5669FF] border-gray-200 resize-none hover:border-[#5669FF] transition-colors bg-[#F9FAFB] border-transparent focus:bg-white focus:border-[#5669FF]"
                        placeholder="ระบุรายละเอียดการนัดหมายเพิ่มเติม..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4">
                 <Button 
                    variant="outline"
                    onClick={onBack}
                    className="h-[50px] px-8 rounded-[12px] border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                 >
                    ยกเลิก
                 </Button>
                 <Button 
                    onClick={handleConfirm}
                    className="h-[50px] px-8 rounded-[12px] bg-[#7367f0] hover:bg-[#685dd8] text-white text-[16px] font-semibold shadow-md"
                 >
                    {isEditMode ? "บันทึกการแก้ไข" : "บันทึกนัดหมาย"}
                 </Button>
            </div>
        </div>
    </>
  );
}
