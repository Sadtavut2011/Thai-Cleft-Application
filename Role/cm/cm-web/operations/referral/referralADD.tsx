import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { cn } from "../../../../../components/ui/utils";
import { 
  ArrowLeft, 
  Search, 
  User, 
  Stethoscope,
  Send,
  Upload,
  Hospital,
  ChevronRight,
  Home
} from "lucide-react";
import { Referral } from './ReferralSystemDetail';
import { HospitalSelector } from '../../patient/hospitalSelectorweb';

interface ReferralAddProps {
  onBack: () => void;
  isEditMode: boolean;
  initialData: Partial<Referral>;
  onSubmit: (data: Partial<Referral>) => void;
}

export default function ReferralAdd({ onBack, isEditMode, initialData, onSubmit }: ReferralAddProps) {
  const [formData, setFormData] = useState<Partial<Referral>>(initialData);
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const inputStyle = "bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors h-11";

  // --- Full-page Hospital Selector (early return pattern) ---
  if (showHospitalSelector) {
    return (
      <HospitalSelector
        initialSelected={formData.destinationHospital || ''}
        onBack={() => setShowHospitalSelector(false)}
        onSave={(value) => {
          setFormData({ ...formData, destinationHospital: value });
          setShowHospitalSelector(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-[#5e5873] font-bold text-lg">
            {isEditMode ? "แก้ไขคำขอส่งตัว (Edit Referral)" : "สร้างคำขอส่งตัว (Create Referral)"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isEditMode ? "แก้ไขข้อมูลการส่งตัวผู้ป่วย" : "กรอกข้อมูลการส่งตัวผู้ป่วยเพื่อประสานงานกับหน่วยงานปลายทาง"}
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
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="พิมพ์ชื่อ หรือ HN เพื่อค้นหา..." 
                  className="pl-9 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] h-11" 
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  value={formData.patientName || ""}
                />
              </div>
              <p className="text-xs text-gray-400 ml-1">ระบบจะดึงข้อมูลประวัติการรักษาล่าสุดอัตโนมัติ</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#5e5873]">ความเร่งด่วน</Label>
                <Select onValueChange={(v: any) => setFormData({...formData, urgency: v})} defaultValue={formData.urgency}>
                  <SelectTrigger className={inputStyle}>
                    <SelectValue placeholder="เลือกความเร่งด่วน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine">Routine (ปกติ)</SelectItem>
                    <SelectItem value="Urgent">Urgent (ด่วน)</SelectItem>
                    <SelectItem value="Emergency">Emergency (ฉุกเฉิน)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
              <Stethoscope className="w-5 h-5 text-[#7367f0]" /> ข้อมูลทางคลินิก
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#5e5873]">การวินิจฉัยโรค (Diagnosis) <span className="text-red-500">*</span></Label>
              <textarea 
                placeholder="ระบุการวินิจฉัยโรคเบื้องต้น..."
                className="w-full min-h-[100px] rounded-lg p-4 text-sm resize-none bg-[#F8F8F8] border-none focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors"
                value={formData.diagnosis || ""}
                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              />
            </div>
          </div>

          {/* Section 3: Referral Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
              <Send className="w-5 h-5 text-[#7367f0]" /> รายละเอียดการส่งตัว
            </h3>

            {/* Hospital Selector Button */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#5e5873]">โรงพยาบาลปลายทาง <span className="text-red-500">*</span></Label>
              <div 
                onClick={() => setShowHospitalSelector(true)}
                className="relative cursor-pointer"
              >
                <div className={cn(
                  "h-11 px-4 bg-[#F8F8F8] rounded-lg flex items-center justify-between transition-all border",
                  formData.destinationHospital 
                    ? "border-[#7367f0] bg-[#7367f0]/5" 
                    : "border-transparent hover:bg-gray-100"
                )}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Hospital size={16} className={formData.destinationHospital ? "text-[#7367f0]" : "text-gray-400"} />
                    <span className={cn(
                      "text-sm truncate",
                      formData.destinationHospital ? "text-[#5e5873] font-medium" : "text-gray-400"
                    )}>
                      {formData.destinationHospital || "เลือกโรงพยาบาลปลายทาง"}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#5e5873]">เหตุผลการส่งตัว <span className="text-red-500">*</span></Label>
              <textarea 
                placeholder="ระบุเหตุผลที่ต้องส่งตัวผู้ป่วยไปรักษาต่อ..."
                className="w-full min-h-[100px] rounded-lg p-4 text-sm resize-none bg-[#F8F8F8] border-none focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors"
                value={formData.reason || ""}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#5e5873]">แนบเอกสารเพิ่มเติม</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-[#F8F8F8] hover:bg-gray-100 transition-colors cursor-pointer group">
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-[#7367f0]" />
                </div>
                <p className="text-sm text-gray-600 font-medium">คลิกเพื่ออัพโหลด หรือลากไฟล์มาวางที่นี่</p>
                <p className="text-xs text-gray-400 mt-1">รองรับ PDF, JPG, PNG (ไม่เกิน 5MB)</p>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button variant="outline" onClick={onBack} className="h-11 px-8 text-gray-600">
              ยกเลิก
            </Button>
            <Button onClick={handleSubmit} className="bg-[#7367f0] hover:bg-[#5e54ce] h-11 px-8 shadow-md shadow-indigo-200 transition-all">
              {isEditMode ? "บันทึกการแก้ไข" : "บันทึกการส่งตัว"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
