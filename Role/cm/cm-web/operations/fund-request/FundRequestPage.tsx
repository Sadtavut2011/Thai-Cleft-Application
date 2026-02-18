import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Upload, FileText, User, DollarSign, ArrowLeft } from "lucide-react";
import { PATIENTS_DATA } from "../../../../../data/patientData";

interface FundRequestPageProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  patient?: any;
  initialData?: any;
}

export function FundRequestPage({ onBack, onSubmit, patient, initialData }: FundRequestPageProps) {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState({
     patientName: initialData?.patientName || patient?.name || '',
     hn: initialData?.hn || patient?.hn || '',
     age: initialData?.age || patient?.age || '',
     fundType: initialData?.fundType || '',
     reason: initialData?.reason || (initialData ? "ผู้ป่วยมีฐานะยากจน ไม่สามารถชำระค่าเดินทางมารักษาได้" : ''),
     amount: initialData?.amount ? String(initialData.amount) : '',
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
                    {isEditMode ? "แก้ไขคำขอทุน (Edit Fund Request)" : "สร้างคำขอทุนสนับสนุน (Create Fund Request)"}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? "แก้ไขรายละเอียดคำขอทุน" : "กรอกรายละเอียดเพื่อสร้างคำขอทุนใหม่"}
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
                            <Label className="text-sm font-semibold text-[#5e5873]">ค้นหาผู้ป่วย (ชื่อ หรือ HN)</Label>
                            <div className="relative">
                                <Input 
                                    value={formData.patientName} 
                                    onChange={e => setFormData({...formData, patientName: e.target.value})} 
                                    placeholder="พิมพ์ชื่อผู้ป่วย หรือรหัส HN เพื่อค้นหา..." 
                                    className={inputStyle}
                                />
                                {(() => {
                                  const patients = PATIENTS_DATA.map(p => ({
                                    id: p.id || p.hn,
                                    name: p.name,
                                    hn: p.hn || p.id,
                                  }));
                                  const searchTerm = formData.patientName || "";
                                  const filtered = patients.filter(p => 
                                    searchTerm.length > 0 && 
                                    (p.name.includes(searchTerm) || p.hn.includes(searchTerm))
                                  );

                                  if (filtered.length === 0) return null;

                                  return (
                                    <div className="absolute top-[105%] left-0 w-full bg-white border border-gray-100 rounded-[12px] shadow-lg z-20 overflow-hidden">
                                        {filtered.map((patient) => (
                                            <div 
                                                key={patient.id}
                                                className="px-4 py-3 hover:bg-[#F4F5F7] cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                                                onClick={() => setFormData({
                                                    ...formData, 
                                                    patientName: `${patient.name} (${patient.hn})`,
                                                    hn: patient.hn
                                                })}
                                            >
                                                <div className="font-medium text-[#120d26] text-sm">{patient.name}</div>
                                                <div className="text-xs text-[#747688]">{patient.hn}</div>
                                            </div>
                                        ))}
                                    </div>
                                  );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Reason */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <FileText className="w-5 h-5 text-[#7367f0]" /> 2. เหตุผลการขอทุน
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#5e5873]">ประเภททุน</Label>
                             <Select onValueChange={(val) => setFormData({...formData, fundType: val})}>
                                <SelectTrigger className={inputStyle}>
                                    <SelectValue placeholder="เลือกประเภททุน" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="กองทุนสุขภาพตำบล">กองทุนสุขภาพตำบล</SelectItem>
                                    <SelectItem value="กองทุนผู้สูงอายุ">กองทุนผู้สูงอายุ</SelectItem>
                                    <SelectItem value="มูลนิธิขาเทียม">มูลนิธิขาเทียม</SelectItem>
                                    <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">เหตุผลความจำเป็น</Label>
                        <Textarea 
                            value={formData.reason} 
                            onChange={e => setFormData({...formData, reason: e.target.value})} 
                            placeholder="อธิบายเหตุผลความจำเป็น..." 
                            className={`min-h-[120px] bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors resize-y`}
                        />
                    </div>
                </div>

                {/* 3. Expenses */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <DollarSign className="w-5 h-5 text-[#7367f0]" /> 3. ค่าใช้จ่าย
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#5e5873]">จำนวนเงินที่ขอ (บาท)</Label>
                            <Input 
                                type="number" 
                                value={formData.amount} 
                                onChange={e => setFormData({...formData, amount: e.target.value})} 
                                placeholder="0.00" 
                                className={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Attachments */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Upload className="w-5 h-5 text-[#7367f0]" /> 4. แนบเอกสาร
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer bg-white group">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#7367f0]" />
                        </div>
                        <div>
                            <span className="text-sm font-medium text-[#5e5873]">คลิกเพื่ออัปโหลดเอกสาร</span>
                            <span className="text-sm text-gray-500"> หรือลากไฟล์มาวางที่นี่</span>
                        </div>
                        <span className="text-xs text-gray-400">(รองรับ PDF, JPG, PNG ขนาดไม่เกิน 10MB)</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" onClick={onBack} className="h-11 px-8 text-gray-600">
                        ยกเลิก
                    </Button>
                    <Button onClick={handleSubmit} className="bg-[#7367f0] hover:bg-[#5e54ce] h-11 px-8 shadow-md shadow-indigo-200">
                        {isEditMode ? "บันทึกการแก้ไข" : "บันทึกคำขอ"}
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}