import React from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Calendar, MapPin, Home, Stethoscope, User, ArrowLeft, Edit2, Save } from "lucide-react";


const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

interface MedicalRecordFormProps {
  appointment: any;
  onBack: () => void;
  onSave?: (data: any) => void;
}

export function MedicalRecordForm({ appointment, onBack, onSave }: MedicalRecordFormProps) {
  // Mock data filling from appointment
  const defaultDate = appointment?.date ? (() => {
    const d = new Date(appointment.date);
    return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
  })() : "";
  
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Header */}
      <div className="bg-white p-4 rounded-[6px] shadow-sm border border-[#EBE9F1] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-100 text-[#5e5873]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-[#5e5873] font-bold text-lg">Medical Record</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#EBE9F1] p-6 max-w-4xl mx-auto">
        
        {/* Patient Name Section */}
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-[#7367f0] text-xl font-bold">{appointment?.patientName || "ไม่ระบุชื่อผู้ป่วย"}</h2>

        </div>

        <div className="space-y-6">
            {/* Date */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">วันที่ได้รับการรักษา</Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7367f0]">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <Input 
                        defaultValue={defaultDate}
                        className="pl-10 h-11 bg-white border-[#EBE9F1] focus:ring-[#7367f0]" 
                    />
                </div>
            </div>

            {/* Hospital */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">โรงพยาบาล</Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7367f0]">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <Input 
                        defaultValue={appointment?.hospital || "โรงพยาบาลมหาราชนครเชียงใหม่"}
                        className="pl-10 h-11 bg-white border-[#EBE9F1] focus:ring-[#7367f0]" 
                    />
                </div>
            </div>

            {/* Room */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">ห้องตรวจ</Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7367f0]">
                        <Home className="w-5 h-5" />
                    </div>
                    <Input 
                        defaultValue="ห้องตรวจ 1"
                        className="pl-10 h-11 bg-white border-[#EBE9F1] focus:ring-[#7367f0]" 
                    />
                </div>
            </div>

            {/* Treatment */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">การรักษา</Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7367f0]">
                        <Stethoscope className="w-5 h-5" />
                    </div>
                    <Input 
                        defaultValue={`Consult ${appointment?.clinic || "คลินิกนมแม่"}`}
                        className="pl-10 h-11 bg-white border-[#EBE9F1] focus:ring-[#7367f0]" 
                    />
                </div>
            </div>

            {/* Doctor */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">ชื่อผู้รักษา</Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7367f0]">
                        <User className="w-5 h-5" />
                    </div>
                    <Input 
                        defaultValue={appointment?.doctorName || "ปนัดดา"}
                        className="pl-10 h-11 bg-white border-[#EBE9F1] focus:ring-[#7367f0]" 
                    />
                </div>
            </div>

            {/* CC */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">อาการนำ (Chief Complaint)</Label>
                <Textarea 
                    placeholder="ระบุ อาการนำ (Chief Complaint)"
                    className="min-h-[100px] bg-white border-[#EBE9F1] focus:ring-[#7367f0] resize-none"
                />
            </div>

            {/* PI */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">อาการเจ็บป่วยปัจจุบัน (Present Illness)</Label>
                <Textarea 
                    placeholder="ระบุ อาการเจ็บป่วยปัจจุบัน (Present Illness)"
                    className="min-h-[100px] bg-white border-[#EBE9F1] focus:ring-[#7367f0] resize-none"
                />
            </div>

            {/* PH */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">อาการเจ็บป่วยในอดีต (Past History)</Label>
                <Textarea 
                    placeholder="ระบุ อาการเจ็บป่วยในอดีต (Past History)"
                    className="min-h-[100px] bg-white border-[#EBE9F1] focus:ring-[#7367f0] resize-none"
                />
            </div>

            {/* PE */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">ตรวจร่างกาย</Label>
                <Textarea 
                    placeholder="ระบุ ตรวจร่างกาย"
                    className="min-h-[100px] bg-white border-[#EBE9F1] focus:ring-[#7367f0] resize-none"
                />
            </div>

            {/* Result */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">ผลการรักษา</Label>
                <Textarea 
                    placeholder="ระบุผลการรักษา"
                    className="min-h-[100px] bg-white border-[#EBE9F1] focus:ring-[#7367f0] resize-none"
                />
            </div>

            {/* Plan */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">การวางแผนการักษา</Label>
                <Textarea 
                    placeholder="ระบุการวางแผนการรักษา"
                    className="min-h-[100px] bg-white border-[#EBE9F1] focus:ring-[#7367f0] resize-none"
                />
            </div>

            {/* Recorder Info */}
            <div className="space-y-2">
                <Label className="text-[#5e5873] font-semibold">ผู้บันทึกข้อมูล</Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7367f0]">
                        <User className="w-5 h-5" />
                    </div>
                    <Input 
                        defaultValue="สภัคสิริ สุวิวัฒนา"
                        className="pl-10 h-11 bg-white border-[#EBE9F1] focus:ring-[#7367f0]" 
                        readOnly
                    />
                </div>
            </div>
            
            <div className="pt-2 text-xs text-gray-500">
                วันที่ {(() => { const now = new Date(); return `${now.getDate()} ${THAI_MONTHS[now.getMonth()]} ${now.getFullYear() + 543} เวลา ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} น.`; })()}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <Button variant="outline" onClick={onBack} className="h-11 px-8 text-gray-600">
                    ยกเลิก
                </Button>
                <Button onClick={() => onSave?.({ status: 'Completed' })} className="bg-[#7367f0] hover:bg-[#5e54ce] h-11 px-8 shadow-md shadow-indigo-200 gap-2">
                    <Save className="w-4 h-4" /> บันทึกข้อมูล
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}