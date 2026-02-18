import React, { useState, useEffect } from 'react';
import { User, FileText, DollarSign, Upload, ChevronLeft } from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";

interface FundRequestMobileProps {
  patient: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  formTitle?: string;
  initialFundType?: string;
}

export default function FundRequestMobile({ 
  patient, 
  onClose, 
  onSubmit, 
  formTitle, 
  initialFundType 
}: FundRequestMobileProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    fundType: initialFundType || '',
    reason: '',
    amount: ''
  });

  useEffect(() => {
    if (patient?.name) {
      setFormData(prev => ({ ...prev, patientName: patient.name }));
    }
  }, [patient]);

  useEffect(() => {
    if (initialFundType) {
        setFormData(prev => ({ ...prev, fundType: initialFundType }));
    }
  }, [initialFundType]);

  const handleSubmit = () => {
    // Logic to handle submit
    onSubmit(formData);
  };

  const inputStyle = "w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus-visible:ring-[#7066a9] text-base transition-colors";

  // Ensure initialFundType is in the list of options
  const defaultFundTypes = ["Operation Smile", "กองทุนสุขภาพตำบล", "กองทุนผู้สูงอายุ", "มูลนิธิขาเทียม", "อื่นๆ"];
  const fundOptions = initialFundType && !defaultFundTypes.includes(initialFundType) 
    ? [initialFundType, ...defaultFundTypes] 
    : defaultFundTypes;

  return (
    <div className="fixed inset-0 z-[50000] h-[100dvh] w-full bg-white flex flex-col overflow-hidden font-['IBM_Plex_Sans_Thai']">
      {/* CSS Hack to hide mobile bottom navigation */}
      <style>{`
        .fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
            display: none !important;
        }
      `}</style>

      {/* Header */}
      <div className="bg-[#7066a9] shrink-0 z-50 shadow-sm">
          <StatusBarIPhone16Main />
          <div className="h-[64px] px-4 flex items-center gap-3">
              <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                  <ChevronLeft size={24} />
              </button>
              <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">
                {formTitle || "สร้างคำขอทุนใหม่"}
              </h1>
          </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto no-scrollbar px-4 pt-4 pb-24">
            <div className="space-y-8">
                {/* 1. Basic Info */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold text-[#5e5873]">ค้นหาผู้ป่วย (ชื่อ หรือ HN)</Label>
                        <div className="relative">
                            <Input 
                                value={formData.patientName} 
                                onChange={(e) => setFormData({...formData, patientName: e.target.value})} 
                                placeholder="ค้นหาชื่อ หรือ HN..." 
                                className="px-4 h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm peer border-[#7367f0]"
                            />
                            <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl mt-2 z-50 hidden peer-focus:block hover:block max-h-60 overflow-y-auto">
                                {[
                                    "นายสมชาย ใจดี (HN: 123456)",
                                    "นางสาวใจมา พาสุข (HN: 654321)",
                                    "เด็กชายกล้าหาญ ชาญชัย (HN: 789012)",
                                    "นางสมศรี มีทรัพย์ (HN: 345678)",
                                    "นายมีบุญ ค้ำจุน (HN: 901234)"
                                ].filter(name => !formData.patientName || name.includes(formData.patientName)).map((name, i) => (
                                    <div 
                                        key={i}
                                        className="px-4 py-4 hover:bg-slate-50 cursor-pointer text-base text-[#5e5873] border-b border-slate-50 last:border-0"
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input blur
                                            setFormData({...formData, patientName: name});
                                        }}
                                    >
                                        {name}
                                    </div>
                                ))}
                                {/* Show message if no results */}
                                {[
                                    "นายสมชาย ใจดี (HN: 123456)",
                                    "นางสาวใจมา พาสุข (HN: 654321)",
                                    "เด็กชายกล้าหาญ ชาญชัย (HN: 789012)",
                                    "นางสมศรี มีทรัพย์ (HN: 345678)",
                                    "นายมีบุญ ค้ำจุน (HN: 901234)"
                                ].filter(name => !formData.patientName || name.includes(formData.patientName)).length === 0 && (
                                    <div className="px-4 py-4 text-base text-slate-400 text-center">ไม่พบข้อมูล</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Reason */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold text-[#5e5873]">ประเภททุน</Label>
                        <div className="relative">
                            <Select 
                                value={formData.fundType}
                                onValueChange={(val) => setFormData({...formData, fundType: val})}
                            >
                                <SelectTrigger className={`${inputStyle} w-full`}>
                                    <SelectValue placeholder="เลือกประเภททุน" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fundOptions.map((option) => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-base font-semibold text-[#5e5873]">เหตุผลความจำเป็น</Label>
                        <Textarea 
                            value={formData.reason} 
                            onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                            placeholder="อธิบายเหตุผลความจำเป็น..." 
                            className="min-h-[120px] bg-white border border-slate-200 rounded-xl focus-visible:ring-[#7066a9] text-base transition-colors resize-y"
                        />
                    </div>
                </div>

                {/* 3. Expenses */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-base font-semibold text-[#5e5873]">จำนวนเงินที่ขอ (บาท)</Label>
                        <Input 
                            type="number" 
                            value={formData.amount} 
                            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                            placeholder="0.00" 
                            className={inputStyle}
                        />
                    </div>
                </div>

                {/* 4. Attachments */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        แนบเอกสาร
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
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-slate-100 bg-white">
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            onClick={onClose} 
                            className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[16px] font-bold"
                        >
                            ยกเลิก
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
                        >
                            บันทึก
                        </Button>
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
}