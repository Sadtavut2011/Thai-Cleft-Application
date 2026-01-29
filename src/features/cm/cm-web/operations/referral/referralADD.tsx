import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";
import { Separator } from "../../../../../components/ui/separator";
import { 
  ArrowLeft, 
  Search, 
  User, 
  Stethoscope,
  Send,
  Upload
} from "lucide-react";
import { Referral } from './ReferralSystemDetail';

interface ReferralAddProps {
  onBack: () => void;
  isEditMode: boolean;
  initialData: Partial<Referral>;
  onSubmit: (data: Partial<Referral>) => void;
}

export default function ReferralAdd({ onBack, isEditMode, initialData, onSubmit }: ReferralAddProps) {
  const [formData, setFormData] = useState<Partial<Referral>>(initialData);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
           <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
           </Button>
           <div>
              <h1 className="text-xl font-bold text-[#5e5873]">{isEditMode ? "แก้ไขคำขอส่งตัว (Edit Referral)" : "สร้างคำขอส่งตัว (Create Referral)"}</h1>
              <p className="text-sm text-gray-500">{isEditMode ? "แก้ไขข้อมูลการส่งตัวผู้ป่วย" : "กรอกข้อมูลการส่งตัวผู้ป่วยเพื่อประสานงานกับหน่วยงานปลายทาง"}</p>
           </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl max-w-4xl mx-auto">
        <CardContent className="p-8 space-y-8">
          <div>
             <div className="flex items-center gap-2 mb-4 text-[#7367f0]">
                <User className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-[#5e5873]">ข้อมูลผู้ป่วย</h3>
             </div>
             
             <div className="p-6 border border-gray-100 rounded-xl bg-slate-50/50 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                       <Label className="mb-2 block text-[#5e5873]">ค้นหาผู้ป่วย (ชื่อ หรือ HN) <span className="text-red-500">*</span></Label>
                       <div className="relative">
                         <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                         <Input 
                             placeholder="พิมพ์ชื่อ หรือ HN เพื่อค้นหา..." 
                             className="pl-10 h-12 bg-white border-gray-200 focus:ring-[#7367f0]" 
                             onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                             value={formData.patientName || ""}
                         />
                       </div>
                       <p className="text-xs text-gray-400 mt-2 ml-1">ระบบจะดึงข้อมูลประวัติการรักษาล่าสุดอัตโนมัติ</p>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block text-[#5e5873]">ความเร่งด่วน</Label>
                      <Select onValueChange={(v: any) => setFormData({...formData, urgency: v})} defaultValue={formData.urgency}>
                        <SelectTrigger className="h-12 bg-white border-gray-200">
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
          </div>

          <Separator className="bg-gray-100" />

          <div>
             <div className="flex items-center gap-2 mb-4 text-[#7367f0]">
                <Stethoscope className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-[#5e5873]">ข้อมูลทางคลินิก</h3>
             </div>
             
             <div className="space-y-6 pl-2">
                  <div>
                      <Label className="mb-2 block text-[#5e5873]">การวินิจฉัยโรค (Diagnosis) <span className="text-red-500">*</span></Label>
                      <Textarea 
                        placeholder="ระบุการวินิจฉัยโรคเบื้องต้น..."
                        className="min-h-[100px] bg-white border-gray-200 resize-none focus:ring-[#7367f0]"
                        value={formData.diagnosis || ""}
                        onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                      />
                  </div>
             </div>
          </div>

          <Separator className="bg-gray-100" />

           <div>
             <div className="flex items-center gap-2 mb-4 text-[#7367f0]">
                <Send className="w-5 h-5" />
                <h3 className="font-semibold text-lg text-[#5e5873]">รายละเอียดการส่งตัว</h3>
             </div>
             
             <div className="space-y-6 pl-2">
                  <div>
                       <Label className="mb-2 block text-[#5e5873]">โรงพยาบาลปลายทาง <span className="text-red-500">*</span></Label>
                       <Select onValueChange={(v) => setFormData({...formData, destinationHospital: v})} defaultValue={formData.destinationHospital}>
                        <SelectTrigger className="h-12 bg-white border-gray-200">
                          <SelectValue placeholder="เลือกโรงพยาบาลปลายทาง" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="โรงพยาบาลมหาราชนครเชียงใหม่">โรงพยาบาลมหาราชนครเชียงใหม่ (สวนดอก)</SelectItem>
                          <SelectItem value="โรงพยาบาลเชียงรายประชานุเคราะห์">โรงพยาบาลเชียงรายประชานุเคราะห์</SelectItem>
                          <SelectItem value="โรงพยาบาลลำปาง">โรงพยาบาลลำปาง</SelectItem>
                          <SelectItem value="โรงพยาบาลศูนย์ขอนแก่น">โรงพยาบาลศูนย์ขอนแก่น</SelectItem>
                        </SelectContent>
                       </Select>
                  </div>

                  <div>
                      <Label className="mb-2 block text-[#5e5873]">เหตุผลการส่งตัว <span className="text-red-500">*</span></Label>
                      <Textarea 
                        placeholder="ระบุเหตุผลที่ต้องส่งตัวผู้ป่วยไปรักษาต่อ..."
                        className="min-h-[100px] bg-white border-gray-200 resize-none focus:ring-[#7367f0]"
                        value={formData.reason || ""}
                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      />
                  </div>

                  <div>
                      <Label className="mb-2 block text-[#5e5873]">แนบเอกสารเพิ่มเติม</Label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                           <Upload className="w-6 h-6 text-[#7367f0]" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">คลิกเพื่ออัพโหลด หรือลากไฟล์มาวางที่นี่</p>
                        <p className="text-xs text-gray-400 mt-1">รองรับ PDF, JPG, PNG (ไม่เกิน 5MB)</p>
                      </div>
                  </div>
             </div>
          </div>

        </CardContent>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 z-10">
              <Button variant="outline" onClick={onBack} className="h-12 px-6 rounded-lg bg-white hover:bg-gray-50 border-gray-200 text-gray-600">
                ยกเลิก
              </Button>
              <Button onClick={handleSubmit} className="h-12 px-6 rounded-lg bg-[#7367f0] hover:bg-[#685dd8] text-white shadow-lg shadow-indigo-500/20 font-semibold">
                {isEditMode ? "บันทึกการแก้ไข" : "บันทึกการส่งตัว"}
              </Button>
        </div>
      </Card>
    </div>
  );
}