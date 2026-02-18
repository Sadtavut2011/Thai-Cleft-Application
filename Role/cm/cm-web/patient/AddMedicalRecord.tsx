import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Info,
  Save,
  Trash2
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { cn } from "../../../../components/ui/utils";
import { TreatmentSelector } from "../pages/TreatmentSelector";

interface AddMedicalRecordProps {
  onAdd: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export function AddMedicalRecord({ onAdd, onBack, initialData }: AddMedicalRecordProps) {
  const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);
  const [formData, setFormData] = useState({
     status: initialData?.status || "Pending",
     targetAgeRange: initialData?.targetAgeRange || "",
     calculatedDate: initialData?.calculatedDate || "",
     treatmentName: initialData?.treatmentName || "",
     birthDate: initialData?.birthDate || "2024-01-01", // Default mock birthdate
     ...initialData
  });

  const [ageDuration, setAgeDuration] = useState({ 
    years: "", 
    months: "" 
  });

  // Calculate date when duration changes
  useEffect(() => {
    const years = parseInt(ageDuration.years) || 0;
    const months = parseInt(ageDuration.months) || 0;

    if (years === 0 && months === 0 && !formData.calculatedDate) {
        return;
    }

    const birthDate = new Date(formData.birthDate);
    if (isNaN(birthDate.getTime())) return;

    const targetDate = new Date(birthDate);
    targetDate.setFullYear(targetDate.getFullYear() + years);
    targetDate.setMonth(targetDate.getMonth() + months);

    // Format Date: "1 เมษายน 2546"
    const day = targetDate.getDate();
    const month = targetDate.toLocaleDateString('th-TH', { month: 'long' });
    const year = targetDate.getFullYear() + 543;
    const formattedDate = `${day} ${month} ${year}`;

    const newTargetAgeRange = `${years} ปี ${months} เดือน`;

    // Only update if changed
    if (formData.calculatedDate !== formattedDate || formData.targetAgeRange !== newTargetAgeRange) {
        setFormData(prev => ({
            ...prev,
            targetAgeRange: newTargetAgeRange,
            calculatedDate: formattedDate
        }));
    }
  }, [ageDuration.years, ageDuration.months, formData.birthDate]);

  const handleTreatmentSelect = (selected: string) => {
    setFormData({ ...formData, treatmentName: selected });
    setShowTreatmentSelector(false);
  };

  if (showTreatmentSelector) {
    return (
      <TreatmentSelector 
        initialSelected={formData.treatmentName}
        onSave={handleTreatmentSelect}
        onBack={() => setShowTreatmentSelector(false)}
      />
    );
  }

  return (
    <div className="bg-[#FAFAFA] h-full flex flex-col font-['Montserrat','Noto_Sans_Thai',sans-serif]">
       {/* Header */}
       <div className="relative bg-white pt-6 pb-4 px-6 shadow-sm z-10 flex-shrink-0 flex items-center gap-4 border-b border-gray-100">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="text-[#120d26]"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex flex-col gap-1">
             <h1 className="text-xl font-medium text-[#120d26]">เพิ่มข้อมูลการรักษา</h1>
          </div>
       </div>

       {/* Form Content */}
       <div className="flex-1 overflow-y-auto p-6">
         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-lg mx-auto space-y-6">
            
            {/* Status */}
            <div className="flex items-center justify-between">
                <label className="text-[#120d26] font-bold text-[16px]">สถานะปัจจุบัน</label>
                <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-none px-4 py-1 text-sm font-medium rounded-full">
                    {formData.status}
                </Badge>
            </div>
            
            <div className="border-b border-gray-100 my-2"></div>

            {/* Treatment Name */}
            <div className="space-y-2">
               <label className="text-[#120d26] font-bold text-[16px]">ชื่อการรักษา (Treatment Name)</label>
               <div onClick={() => setShowTreatmentSelector(true)}>
                 <Input 
                    value={formData.treatmentName} 
                    readOnly
                    placeholder="แตะเพื่อเลือกการรักษา"
                    className="h-[50px] rounded-xl border-gray-200 bg-white text-[#120d26] focus:ring-[#5669FF] cursor-pointer pointer-events-none" 
                 />
               </div>
            </div>

            {/* Target Age Range - Changed to Years/Months Input */}
            <div className="space-y-2">
               <label className="text-[#120d26] font-bold text-[16px]">ระยะเวลาที่กำหนด (Duration)</label>
               <div className="flex gap-4">
                  <div className="flex-1 relative">
                     <Input 
                        type="number"
                        min="0"
                        value={ageDuration.years} 
                        onChange={(e) => setAgeDuration({...ageDuration, years: e.target.value})}
                        className="h-[50px] rounded-xl border-gray-200 bg-[#F8F9FA] text-[#120d26] focus:ring-[#5669FF] pr-12"
                        placeholder="0"
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">ปี</span>
                  </div>
                  <div className="flex-1 relative">
                     <Input 
                        type="number"
                        min="0"
                        max="11"
                        value={ageDuration.months} 
                        onChange={(e) => setAgeDuration({...ageDuration, months: e.target.value})}
                        className="h-[50px] rounded-xl border-gray-200 bg-[#F8F9FA] text-[#120d26] focus:ring-[#5669FF] pr-16"
                        placeholder="0"
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">เดือน</span>
                  </div>
               </div>
               <p className="text-xs text-gray-400 mt-1">* ระบุระยะเวลาเพื่อคำนวณวันที่คาดการณ์จากวันเกิด</p>
            </div>

            {/* Calculated Date */}
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                   <label className="text-[#120d26] font-bold text-[16px]">วันที่คาดการณ์ (Calculated Date)</label>
                   <Info className="w-4 h-4 text-gray-400" />
               </div>
               <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <CalendarIcon size={20} />
                  </div>
                  <Input 
                     value={formData.calculatedDate} 
                     readOnly
                     className="pl-12 h-[50px] rounded-xl border-gray-200 bg-[#F1F3F5] text-[#5e5873] focus:ring-0 cursor-not-allowed border-none" 
                     placeholder="ระบบจะคำนวณให้อัตโนมัติ"
                  />
               </div>
            </div>
            
            <div className="pt-4 space-y-4">
                {/* Save Button */}
                <Button 
                   onClick={() => onAdd(formData)}
                   className="w-full h-[50px] rounded-xl bg-[#7367f0] text-white font-medium hover:bg-[#685dd8] shadow-md shadow-indigo-200 text-[16px] flex items-center justify-center gap-2"
                >
                   <Save className="w-5 h-5" />
                   บันทึกการแผนการรักษา
                </Button>

                {/* Delete Button */}
                <div className="flex justify-center">
                    <button 
                        className="text-red-500 hover:text-red-600 font-medium flex items-center gap-2 text-sm transition-colors"
                        onClick={onBack} 
                    >
                        <Trash2 className="w-4 h-4" />
                        ยกเลิก
                    </button>
                </div>
            </div>

         </div>
       </div>
    </div>
  );
}
