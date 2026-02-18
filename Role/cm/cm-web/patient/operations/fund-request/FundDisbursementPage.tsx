import React, { useState } from 'react';
import { Button } from "../../../../../../components/ui/button";
import { Input } from "../../../../../../components/ui/input";
import { Label } from "../../../../../../components/ui/label";
import { Textarea } from "../../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../../components/ui/select";
import { Upload, FileText, User, DollarSign, ArrowLeft, Receipt } from "lucide-react";

interface FundDisbursementPageProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  patient?: any;
  initialData?: any;
}

interface FundDisbursementData {
  patientName: string;
  hn: string;
  fundName: string;
  amount: string;
  description: string;
  files: File[];
}

export function FundDisbursementPage({ onBack, onSubmit, patient, initialData }: FundDisbursementPageProps) {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState<FundDisbursementData>({
     patientName: initialData?.patientName || patient?.name || '',
     hn: initialData?.hn || patient?.hn || '',
     fundName: initialData?.fundName || '',
     amount: initialData?.amount ? String(initialData.amount) : '',
     description: initialData?.description || '',
     files: [] as File[]
  });

  const handleSubmit = () => {
     onSubmit(formData);
  };

  const inputStyle = "bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors h-11";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-['Montserrat','Noto_Sans_Thai',sans-serif]">
        {/* Header Banner */}
        <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#FFF4E5]/50 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-[#FFF4E5]/80 text-[#5e5873]">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                    {isEditMode ? "แก้ไขการเบิกจ่าย (Edit Disbursement)" : "ขออนุมัติเบิกจ่ายทุน (Request Disbursement)"}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? "แก้ไขรายละเอียดการเบิกจ่าย" : "กรอกรายละเอียดเพื่อขออนุมัติเบิกจ่ายเงินทุน"}
                </p>
            </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm border border-[#EBE9F1] p-6 max-w-4xl mx-auto">
            <div className="space-y-8">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <User className="w-5 h-5 text-[#7367f0]" /> 1. ข้อมูลผู้ป่วย
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-sm font-semibold text-[#5e5873]">ผู้ป่วย</Label>
                            <Input 
                                value={formData.patientName} 
                                readOnly
                                className={inputStyle + " bg-gray-100 cursor-not-allowed"}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Fund Info */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <DollarSign className="w-5 h-5 text-[#7367f0]" /> 2. รายละเอียดการเบิกจ่าย
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#5e5873]">เลือกทุนที่ได้รับอนุมัติ</Label>
                             <Select onValueChange={(val) => setFormData({...formData, fundName: val})}>
                                <SelectTrigger className={inputStyle}>
                                    <SelectValue placeholder="เลือกทุน" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fund-1">กองทุนเพื่อผู้ป่วยปากแหว่งเพดานโหว่ (อนุมัติแล้ว 5,000 บาท)</SelectItem>
                                    <SelectItem value="fund-2">กองทุนสุขภาพตำบล (อนุมัติแล้ว 2,000 บาท)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#5e5873]">จำนวนเงินที่เบิก (บาท)</Label>
                            <Input 
                                type="number" 
                                value={formData.amount} 
                                onChange={e => setFormData({...formData, amount: e.target.value})} 
                                placeholder="0.00" 
                                className={inputStyle}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">รายละเอียดการนำไปใช้</Label>
                        <Textarea 
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                            placeholder="เช่น ค่าเดินทางไปโรงพยาบาล, ค่าอาหาร..." 
                            className={`min-h-[100px] bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors resize-y`}
                        />
                    </div>
                </div>

                {/* 3. Proof */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Receipt className="w-5 h-5 text-[#7367f0]" /> 3. หลักฐานการเบิกจ่าย
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer bg-white group">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#7367f0]" />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-[#5e5873]">อัปโหลดใบเสร็จ / หลักฐาน</span>
                            <span className="text-sm text-gray-500"> หรือลากไฟล์มาวางที่นี่</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" onClick={onBack} className="h-11 px-8 text-gray-600">
                        ยกเลิก
                    </Button>
                    <Button onClick={handleSubmit} className="bg-[#28c76f] hover:bg-[#20a059] text-white h-11 px-8 shadow-md shadow-green-200">
                        ยืนยันการเบิกจ่าย
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
