import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Trash2, 
  Calendar as CalendarIcon, 
  Info
} from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";
import { toast } from 'sonner@2.0.3';
import { TreatmentSelector } from './TreatmentSelector';

interface EditStageDetailProps {
  stage: any;
  patient: any;
  onBack: () => void;
  onSave: (updatedStage: any) => void;
  onDelete: (id: number) => void;
}

export function EditStageDetail({ stage, patient, onBack, onSave, onDelete }: EditStageDetailProps) {
  const [formData, setFormData] = useState({
    ...stage,
    treatmentName: stage.treatment || '',
    calculatedDate: stage.date || ''
  });
  
  const [ageDuration, setAgeDuration] = useState({ years: '', months: '' });
  const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);

  // Initialize age duration from existing data if possible, or just leave empty
  useEffect(() => {
    // Logic to parse existing ageRange if needed, but for now we start fresh or keep what's in state
  }, []);

  // Mock calculation effect
  useEffect(() => {
    if (ageDuration.years || ageDuration.months) {
        // Mock calculation: Just showing a string for now as we don't have real date logic library imported yet
        const calculated = `Calculated from ${ageDuration.years || 0}y ${ageDuration.months || 0}m`;
        setFormData(prev => ({ ...prev, calculatedDate: calculated }));
    }
  }, [ageDuration]);

  const handleSave = () => {
    onSave({
        ...formData,
        treatment: formData.treatmentName,
        date: formData.calculatedDate
    });
  };

  return (
    <div className="fixed inset-0 z-[10001] bg-white w-full h-[100dvh] overflow-y-auto flex flex-col font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      
      {/* Hide the global bottom navigation bar when this component is mounted */}
      <style>{`
        div.fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
          display: none !important;
        }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-[10000] w-full bg-[#7066a9] shadow-md flex flex-col">
        {/* Status Bar */}
        <div className="w-full">
            <StatusBarIPhone16Main />
        </div>
        
        {/* Navigation Bar */}
        <div className="h-[64px] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-white text-lg font-bold">{stage.id === -1 ? 'เพิ่มขั้นตอนการรักษา' : 'แก้ไขรายละเอียด'}</h1>
            </div>
        </div>
      </div>

      {/* Main Content - Full Screen (No Box/Card) */}
      <div className="flex-1 p-4 md:p-6 pb-24 space-y-6">
            
            {/* Status */}
            <div className="flex items-center justify-between">
                <label className="text-[#120d26] font-bold text-[16px]">สถานะปัจจุบัน</label>
                <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-none px-4 py-1 text-sm font-medium rounded-full">
                    {formData.status || 'Pending'}
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
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[10002] space-y-3 pb-8">
                {/* Save Button */}
                <Button 
                   onClick={() => handleSave()}
                   className="w-full h-[50px] rounded-xl bg-[#7367f0] text-white font-medium hover:bg-[#685dd8] shadow-md shadow-indigo-200 text-[16px] flex items-center justify-center gap-2"
                >
                   <Save className="w-5 h-5" />
                   บันทึกการเปลี่ยนแปลง
                </Button>

                {/* Delete Button */}
                {onDelete && (
                    <div className="flex justify-center">
                        <button 
                            className="text-red-500 hover:text-red-600 font-medium flex items-center gap-2 text-sm transition-colors"
                            onClick={() => onDelete(formData.id || "current")} 
                        >
                            <Trash2 className="w-4 h-4" />
                            ลบขั้นตอนการรักษานี้
                        </button>
                    </div>
                )}
            </div>
      </div>

      {/* Treatment Selector Modal - Updated */}
      {showTreatmentSelector && (
        <div className="fixed inset-0 z-[20000] bg-white">
            <TreatmentSelector 
                initialSelected={formData.treatmentName}
                onBack={() => setShowTreatmentSelector(false)}
                onSave={(value) => {
                    setFormData(prev => ({ ...prev, treatmentName: value }));
                    setShowTreatmentSelector(false);
                }}
            />
        </div>
      )}

    </div>
  );
}
