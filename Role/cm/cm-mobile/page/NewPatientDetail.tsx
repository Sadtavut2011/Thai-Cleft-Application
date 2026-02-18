import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { ArrowLeft, Upload, FileText, Send } from "lucide-react";
import { TopHeader } from "../../../../components/shared/layout/TopHeader";
import { MinHeader } from "../../../../components/shared/layout/MinHeader";

interface CaseManagerNotifyFormProps {
  patient?: any;
  onBack?: () => void;
  onSubmit?: () => void;
}

const SectionHeader = ({ number, text }: { number: string; text: string }) => (
  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-100">
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7367f0] text-white text-sm font-bold shadow-md">
      {number}
    </div>
    <h3 className="font-bold text-[#5e5873] text-lg">{text}</h3>
  </div>
);

const FormLabel = ({ text, required }: { text: string; required?: boolean }) => (
  <Label className="text-[#5e5873] text-sm font-medium mb-2 block">
    {text} {required && <span className="text-red-500">*</span>}
  </Label>
);

export function NewPatientDetail({ patient, onBack, onSubmit }: CaseManagerNotifyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    idCard: "",
    hospital: "",
    address: "123 หมู่ 4 ต.แม่สูน อ.ฝาง จ.เชียงใหม่ 50110",
    diagnosis: "",
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        idCard: patient.hn || "", // Mapped from patient.hn
        hospital: patient.hospital || "",
        address: "123 หมู่ 4 ต.แม่สูน อ.ฝาง จ.เชียงใหม่ 50110",
        diagnosis: patient.condition || "", // Mapped from patient.condition
      });
    }
  }, [patient]);

  return (
    <div className="bg-slate-50 h-full flex flex-col font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      <TopHeader />
      <div className="bg-[#7066a9] sticky top-0 z-10 shadow-sm">
          <MinHeader onBack={onBack} title="แจ้งเตือน Case Manager" />
      </div>

      <div className="p-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
          {/* Header Banner */}
          <div className="bg-[#DFF6F8] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center gap-4">
            <h1 className="text-[#5e5873] font-bold text-xl flex items-center gap-2">
                <FileText className="w-6 h-6" /> แจ้งเตือน Case Manager
            </h1>
          </div>

          <div className="bg-white rounded-[6px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-8">
                {/* Section 1: Identity */}
                <div>
                  <SectionHeader number="1" text="ข้อมูลระบุตัวตน (Patient Identity)" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                    <div className="col-span-1 md:col-span-2">
                      <FormLabel text="ชื่อ - นามสกุล" required />
                      <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="ระบุชื่อ-นามสกุลผู้ป่วย" 
                        className="bg-gray-50 border-gray-200 h-11 text-base"
                      />
                    </div>
                    <div>
                      <FormLabel text="หมายเลขบัตรประชาชน" required />
                      <Input 
                        value={formData.idCard}
                        onChange={(e) => setFormData({...formData, idCard: e.target.value})}
                        placeholder="เลข 13 หลัก" 
                        className="bg-gray-50 border-gray-200 h-11 text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Referral Info */}
                <div>
                  <SectionHeader number="2" text="ข้อมูลการส่งต่อ (Referral Info)" />
                  <div className="pl-2 space-y-4">
                    <div>
                      <Label className="text-[#5e5873] text-sm font-normal mb-2 block">
                        โรงพยาบาลต้นสังกัด (Target Hospital) <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.hospital} onValueChange={(val) => setFormData({...formData, hospital: val})}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-11 text-base w-full font-normal">
                          <SelectValue placeholder="เลือกโรงพยาบาล" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="โรงพยาบาลฝาง">โรงพยาบาลฝาง</SelectItem>
                          <SelectItem value="โรงพยาบาลมหาราชนครเชียงใหม่">โรงพยาบาลมหาราชนครเชียงใหม่</SelectItem>
                          <SelectItem value="โรงพยาบาลเชียงรายประชานุเคราะห์">โรงพยาบาลเชียงรายประชานุเคราะห์</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-2 text-[#99a1af] text-sm font-light">
                        *ระบบจะส่งการแจ้งเตือนไปยัง Case Manager ของโรงพยาบาลที่ท่านเลือก
                      </p>
                    </div>
                  </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
                {/* Section 3: Additional Info */}
                <div>
                  <SectionHeader number="3" text="ข้อมูลเพิ่มเติม (Additional Info)" />
                  <div className="pl-2 space-y-6">
                    <div>
                      <FormLabel text="ที่อยู่ปัจจุบัน" />
                      <Textarea 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="บ้านเลขที่ หมู่ ตำบล อำเภอ จังหวัด..." 
                        className="bg-gray-50 border-gray-200 min-h-[100px] text-base resize-none"
                      />
                    </div>
                    <div>
                      <FormLabel text="การวินิจฉัย/อาการเบื้องต้น" />
                      <Textarea 
                        value={formData.diagnosis}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        placeholder="ระบุอาการ หรือความพิการที่พบ..." 
                        className="bg-gray-50 border-gray-200 min-h-[100px] text-base resize-none"
                      />
                    </div>
                    <div>
                      <FormLabel text="เอกสารแนบ/รูปถ่าย" />
                      <div className="border-2 border-dashed border-gray-200 rounded-lg h-[120px] flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-[#7367f0]/50 transition-colors cursor-pointer bg-gray-50/30">
                         <Upload className="w-10 h-10 mb-2 opacity-50 text-[#7367f0]" />
                         <span className="text-sm">คลิกหรือลากไฟล์มาวางเพื่ออัพโหลด</span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end gap-4">
            <Button 
                variant="outline" 
                onClick={onBack}
                className="h-11 px-6 text-[#5e5873] border-gray-300 hover:bg-gray-50"
            >
                ยกเลิก
            </Button>
            <Button 
                onClick={onSubmit}
                className="bg-[#7367f0] hover:bg-[#685dd8] text-white h-11 px-8 shadow-md text-base"
            >
                <Send className="w-4 h-4 mr-2" /> ลงทะเบียนผู้ป่วยใหม่
            </Button>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
