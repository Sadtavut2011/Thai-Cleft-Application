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
import { toast } from 'sonner';
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
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);

  // Initialize age duration from existing data
  useEffect(() => {
    if (stage.ageRange) {
        // Simple parser for Thai string e.g. "1 ปี 6 เดือน" or "3 เดือน"
        const text = stage.ageRange;
        let y = '';
        let m = '';
        
        if (text.includes('ปี')) {
            const parts = text.split('ปี');
            y = parts[0].trim().match(/\d+/)?.[0] || '';
            if (parts[1] && parts[1].includes('เดือน')) {
                m = parts[1].trim().match(/\d+/)?.[0] || '';
            }
        } else if (text.includes('เดือน')) {
            m = text.match(/\d+/)?.[0] || '';
        }
        
        setAgeDuration({ years: y, months: m });
    }
  }, [stage.ageRange]);

  // Real calculation effect based on fixed birth date (1 Jan 2560)
  useEffect(() => {
    if (ageDuration.years !== '' || ageDuration.months !== '') {
        const yearsToAdd = parseInt(ageDuration.years) || 0;
        const monthsToAdd = parseInt(ageDuration.months) || 0;

        // Calculate based on patient DOB
        let birthDate = new Date(2023, 0, 1); // Default fallback
        if (patient?.dob) {
             const d = new Date(patient.dob);
             if (!isNaN(d.getTime())) {
                 birthDate = d;
             }
        }
        
        // Calculate target date
        const targetDate = new Date(birthDate);
        targetDate.setFullYear(targetDate.getFullYear() + yearsToAdd);
        targetDate.setMonth(targetDate.getMonth() + monthsToAdd);

        // Format to Thai date
        const thaiMonths = [
          'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        
        const day = targetDate.getDate();
        const month = thaiMonths[targetDate.getMonth()];
        const year = targetDate.getFullYear() + 543;

        const calculated = `${day} ${month} ${year}`;
        setFormData(prev => ({ ...prev, calculatedDate: calculated }));
    }
  }, [ageDuration]);

  const handleSave = () => {
    let newAgeRange = '';
    const y = parseInt(ageDuration.years) || 0;
    const m = parseInt(ageDuration.months) || 0;
    
    if (y > 0) newAgeRange += `${y} ปี `;
    if (m > 0) newAgeRange += `${m} เดือน`;
    if (y === 0 && m === 0) newAgeRange = 'แรกเกิด'; // Default or keep existing?
    
    onSave({
        ...formData,
        treatment: formData.treatmentName,
        date: formData.calculatedDate,
        ageRange: newAgeRange.trim() || formData.ageRange // Fallback to old if empty calculation?
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
            {stage.id !== -1 && (
                <>
                    <div className="flex items-center justify-between">
                        <label className="text-[#120d26] font-bold text-[16px]">สถานะปัจจุบัน</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
                            className={`appearance-none px-4 py-1.5 text-sm font-medium rounded-full border-none cursor-pointer outline-none transition-colors ${
                                formData.status === 'completed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : formData.status === 'overdue'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-blue-100 text-blue-700'
                            }`}
                            style={{ 
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat', 
                                backgroundPosition: 'right 10px center',
                                paddingRight: '30px'
                            }}
                        >
                            <option value="completed">เสร็จสิ้น</option>
                            <option value="overdue">ล่าช้า</option>
                            <option value="upcoming">รอดำเนินการ</option>
                        </select>
                    </div>
                    
                    <div className="border-b border-gray-100 my-2"></div>
                </>
            )}

            {/* Treatment Name */}
            <div className="space-y-2">
               <label className="text-[#120d26] font-bold text-[16px]">ชื่อการรักษา (Treatment Name)</label>
               <div onClick={() => setShowTreatmentSelector(true)} className="relative">
                 <Input 
                    value={formData.treatmentName} 
                    readOnly
                    placeholder="แตะเพื่อเลือกการรักษา"
                    className="h-[50px] rounded-xl border-gray-200 bg-white text-[#120d26] focus:ring-[#5669FF] cursor-pointer pointer-events-none pr-10" 
                 />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <ChevronLeft size={20} className="rotate-180" />
                 </div>
               </div>
            </div>

            {/* Target Age Range - Changed to Years/Months Input */}
            <div className="space-y-2">
               <label className="text-[#120d26] font-bold text-[16px]">ระยะเวลาที่กำหนด (Duration)</label>
               <div className="flex gap-4">
                  <div 
                     className="flex-1 relative cursor-pointer"
                     onClick={() => setShowDurationPicker(true)}
                  >
                     <div className="h-[50px] rounded-xl border-gray-200 bg-[#F8F9FA] text-[#120d26] flex items-center px-4">
                        {ageDuration.years || '0'}
                     </div>
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">ปี</span>
                  </div>
                  <div 
                     className="flex-1 relative cursor-pointer"
                     onClick={() => setShowDurationPicker(true)}
                  >
                     <div className="h-[50px] rounded-xl border-gray-200 bg-[#F8F9FA] text-[#120d26] flex items-center px-4">
                        {ageDuration.months || '0'}
                     </div>
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

      {showDurationPicker && (
        <DurationPicker 
            initialValue={ageDuration}
            onClose={() => setShowDurationPicker(false)}
            onSave={(val: any) => {
                setAgeDuration({ years: val.years.toString(), months: val.months.toString() });
                setShowDurationPicker(false);
            }}
        />
      )}

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

function DurationPicker({ initialValue, onClose, onSave }: any) {
  const [years, setYears] = useState(parseInt(initialValue.years) || 0);
  const [months, setMonths] = useState(parseInt(initialValue.months) || 0);
  
  // Years 0-20
  const yearOptions = Array.from({length: 21}, (_, i) => i);
  // Months 0-11
  const monthOptions = Array.from({length: 12}, (_, i) => i);
  
  return (
    <div className="fixed inset-0 z-[20000] bg-black/60 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200" onClick={onClose}>
        <div className="bg-[#1C1C1E] w-full h-[70vh] rounded-t-[24px] pb-8 animate-in slide-in-from-bottom duration-300 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
                <button onClick={onClose} className="text-gray-400 font-medium px-2">ยกเลิก</button>
                <span className="text-white font-bold text-lg">ระยะเวลา</span>
                <button onClick={() => onSave({years, months})} className="text-[#0A84FF] font-bold px-2">เสร็จสิ้น</button>
            </div>
            
            <div className="flex-1 flex items-center justify-center">
                <div className="flex justify-center gap-0 relative h-[250px] overflow-hidden w-full">
                    {/* Highlight Bar */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-[40px] bg-white/10 pointer-events-none z-0 rounded-lg mx-4" />
                    
                    {/* Years */}
                    <div className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar w-32 text-center py-[105px] z-10">
                         {yearOptions.map(y => (
                             <div key={y} 
                                  onClick={() => setYears(y)}
                                  className={`h-[40px] flex items-center justify-center snap-center text-xl transition-all cursor-pointer ${y === years ? 'text-white font-bold' : 'text-gray-600'}`}>
                                 {y} ปี
                             </div>
                         ))}
                    </div>
                    
                    {/* Months */}
                     <div className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar w-32 text-center py-[105px] z-10">
                         {monthOptions.map(m => (
                             <div key={m} 
                                  onClick={() => setMonths(m)}
                                  className={`h-[40px] flex items-center justify-center snap-center text-xl transition-all cursor-pointer ${m === months ? 'text-white font-bold' : 'text-gray-600'}`}>
                                 {m} เดือน
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}