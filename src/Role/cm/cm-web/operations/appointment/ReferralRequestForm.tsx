import React, { useState } from 'react';
import { ArrowLeft, Send, Hospital, AlertCircle, FileText, User } from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group";

interface ReferralRequestFormProps {
  patientData: any;
  onBack: () => void;
  onConfirm: (data: any) => void;
}

const TARGET_HOSPITALS = [
  "โรงพยาบาลมหาราชนครเชียงใหม่",
  "โรงพยาบาลนครพิงค์",
  "โรงพยาบาลลำปาง",
  "โรงพยาบาลเชียงรายประชานุเคราะห์",
  "โรงพยาบาลสวนปรุง"
];

export function ReferralRequestForm({ patientData, onBack, onConfirm }: ReferralRequestFormProps) {
  const [formData, setFormData] = useState({
    targetHospital: '',
    urgency: 'Routine',
    department: '',
    reason: '',
    transport: 'None'
  });

  const handleSubmit = () => {
    onConfirm(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col animate-in slide-in-from-right-5 duration-300 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#5e5873]">
              สร้างใบส่งตัว (Referral Request)
            </h1>
            <p className="text-sm text-gray-500">ส่งต่อผู้ป่วยไปยังหน่วยงานอื่น</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>ยกเลิก</Button>
            <Button className="bg-[#ea5455] hover:bg-[#d94445] text-white" onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" /> ยืนยันการส่งตัว
            </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto w-full p-6 space-y-6 pb-20">

        {/* Patient Info Summary */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm">
             <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <User className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm text-gray-500">กำลังส่งตัวผู้ป่วย</p>
                <h3 className="text-lg font-bold text-[#5e5873]">{patientData.patientName}</h3>
                <p className="text-sm text-gray-500">HN: {patientData.hn}</p>
             </div>
        </div>
        
        <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#5e5873]">
                    <Hospital className="w-5 h-5 text-[#ea5455]" /> ปลายทางและระดับความเร่งด่วน
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                    <Label>โรงพยาบาลปลายทาง <span className="text-red-500">*</span></Label>
                    <Select value={formData.targetHospital} onValueChange={(val) => setFormData({...formData, targetHospital: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="เลือกโรงพยาบาลปลายทาง" />
                        </SelectTrigger>
                        <SelectContent>
                            {TARGET_HOSPITALS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label>ระดับความเร่งด่วน (Urgency)</Label>
                    <RadioGroup 
                        value={formData.urgency} 
                        onValueChange={(val) => setFormData({...formData, urgency: val})}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${formData.urgency === 'Routine' ? 'border-green-500 bg-green-50' : ''}`}>
                            <RadioGroupItem value="Routine" id="r1" />
                            <Label htmlFor="r1" className="cursor-pointer">Routine (ปกติ)</Label>
                        </div>
                        <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${formData.urgency === 'Urgent' ? 'border-orange-500 bg-orange-50' : ''}`}>
                            <RadioGroupItem value="Urgent" id="r2" />
                            <Label htmlFor="r2" className="cursor-pointer">Urgent (ด่วน)</Label>
                        </div>
                        <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 ${formData.urgency === 'Emergency' ? 'border-red-500 bg-red-50' : ''}`}>
                            <RadioGroupItem value="Emergency" id="r3" />
                            <Label htmlFor="r3" className="cursor-pointer">Emergency (ฉุกเฉิน)</Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#5e5873]">
                    <FileText className="w-5 h-5 text-[#7367f0]" /> รายละเอียดการส่งตัว
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                    <Label>แผนกที่ส่งปรึกษา (ถ้าทราบ)</Label>
                    <Input 
                        placeholder="เช่น อายุรกรรม, ศัลยกรรม..." 
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                    />
                </div>

                <div className="space-y-2">
                    <Label>สาเหตุการส่งตัว / การวินิจฉัยเบื้องต้น <span className="text-red-500">*</span></Label>
                    <Textarea 
                        placeholder="ระบุสาเหตุ และรายละเอียดทางคลินิกที่สำคัญ..." 
                        className="min-h-[120px]"
                        value={formData.reason}
                        onChange={e => setFormData({...formData, reason: e.target.value})}
                    />
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                        <p className="font-semibold">หมายเหตุ:</p>
                        <p>ระบบจะแนบประวัติการรักษาล่าสุด (Medical Record) และผล Lab ล่าสุดให้โดยอัตโนมัติ</p>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
