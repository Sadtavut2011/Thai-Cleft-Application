import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Label } from '../../../../components/ui/label';
import { cn } from '../../../../components/ui/utils';

export interface FilterCriteria {
  diagnoses: string[];
  rights: string[];
  statuses: string[];
}

interface PatientFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (criteria: FilterCriteria) => void;
  initialCriteria: FilterCriteria;
}

const DIAGNOSIS_OPTIONS = [
  "ปากแหว่งด้านเดียว",
  "เพดานโหว่สมบูรณ์",
  "ปากแหว่งและเพดานโหว่",
  "ปากแหว่งสองด้าน",
  "เพดานโหว่ไม่สมบูรณ์",
  "ปากแหว่งด้านซ้าย",
  "ปากแหว่งด้านขวา"
];

const RIGHTS_OPTIONS = [
  "บัตรทอง",
  "ประกันสังคม",
  "ข้าราชการ/รัฐวิสาหกิจ",
  "ชำระเงินเอง"
];

const STATUS_OPTIONS = [
  { id: "Active", label: "Active", color: "bg-emerald-500" },
  { id: "Inactive", label: "Inactive", color: "bg-slate-400" }
];

export default function PatientFilterSheet({ 
  isOpen, 
  onClose, 
  onApply, 
  initialCriteria 
}: PatientFilterSheetProps) {
  const [criteria, setCriteria] = useState<FilterCriteria>(initialCriteria);
  
  // Reset local state when opening
  useEffect(() => {
    if (isOpen) {
      setCriteria(initialCriteria);
    }
  }, [isOpen, initialCriteria]);

  if (!isOpen) return null;

  const toggleDiagnosis = (item: string) => {
    setCriteria(prev => ({
      ...prev,
      diagnoses: prev.diagnoses.includes(item)
        ? prev.diagnoses.filter(i => i !== item)
        : [...prev.diagnoses, item]
    }));
  };

  const toggleRight = (item: string) => {
    setCriteria(prev => ({
      ...prev,
      rights: prev.rights.includes(item)
        ? prev.rights.filter(i => i !== item)
        : [...prev.rights, item]
    }));
  };

  const toggleStatus = (item: string) => {
    setCriteria(prev => ({
      ...prev,
      statuses: prev.statuses.includes(item)
        ? prev.statuses.filter(i => i !== item)
        : [...prev.statuses, item]
    }));
  };

  const handleReset = () => {
    setCriteria({
      diagnoses: [],
      rights: [],
      statuses: []
    });
  };

  const handleApply = () => {
    onApply(criteria);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10050] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full h-[85vh] sm:h-auto sm:max-w-md sm:rounded-2xl rounded-t-[24px] flex flex-col shadow-xl animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="bg-[#7066a9]/10 p-1.5 rounded-lg text-[#7066a9]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                ตัวกรอง (Filter)
            </h2>
            <div className="flex items-center gap-1">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset}
                    className="text-slate-500 text-sm font-medium hover:text-[#7066a9] hover:bg-slate-50 px-3"
                >
                    ล้างค่า
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                    <X size={24} />
                </Button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            
            {/* 1. Diagnosis */}
            <div className="space-y-4">
                <Label className="text-base font-bold text-slate-700">ผลการวินิจฉัย</Label>
                <div className="grid grid-cols-1 gap-3">
                    {DIAGNOSIS_OPTIONS.map((item) => (
                        <div key={item} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleDiagnosis(item)}>
                            <Checkbox 
                                id={`diag-${item}`} 
                                checked={criteria.diagnoses.includes(item)}
                                onCheckedChange={() => toggleDiagnosis(item)}
                                className="w-6 h-6 border-2 border-slate-200 data-[state=checked]:bg-[#7066a9] data-[state=checked]:border-[#7066a9] rounded-md transition-all"
                            />
                            <Label 
                                htmlFor={`diag-${item}`}
                                className="text-[15px] font-normal text-slate-600 group-hover:text-[#7066a9] cursor-pointer"
                            >
                                {item}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* 2. Rights */}
            <div className="space-y-4">
                <Label className="text-base font-bold text-slate-700">สิทธิการรักษา</Label>
                <div className="grid grid-cols-1 gap-3">
                    {RIGHTS_OPTIONS.map((item) => (
                        <div key={item} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleRight(item)}>
                            <Checkbox 
                                id={`right-${item}`} 
                                checked={criteria.rights.includes(item)}
                                onCheckedChange={() => toggleRight(item)}
                                className="w-6 h-6 border-2 border-slate-200 data-[state=checked]:bg-[#7066a9] data-[state=checked]:border-[#7066a9] rounded-md transition-all"
                            />
                            <Label 
                                htmlFor={`right-${item}`}
                                className="text-[15px] font-normal text-slate-600 group-hover:text-[#7066a9] cursor-pointer"
                            >
                                {item}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* 3. Status */}
            <div className="space-y-4">
                <Label className="text-base font-bold text-slate-700">สถานะ (STATUS)</Label>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    {STATUS_OPTIONS.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleStatus(item.id)}>
                            <Checkbox 
                                id={`status-${item.id}`} 
                                checked={criteria.statuses.includes(item.id)}
                                onCheckedChange={() => toggleStatus(item.id)}
                                className="w-6 h-6 border-2 border-slate-200 data-[state=checked]:bg-[#7066a9] data-[state=checked]:border-[#7066a9] rounded-md transition-all"
                            />
                            <Label 
                                htmlFor={`status-${item.id}`}
                                className="text-[15px] font-normal text-slate-600 group-hover:text-[#7066a9] cursor-pointer flex items-center gap-2"
                            >
                                {item.label}
                                <span className={cn("w-2 h-2 rounded-full", item.color)} />
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex gap-3 pb-8 sm:pb-4">
            <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-[16px] font-medium"
            >
                ล้างค่า
            </Button>
            <Button 
                onClick={handleApply}
                className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
            >
                ยืนยัน ({criteria.diagnoses.length + criteria.rights.length + criteria.statuses.length})
            </Button>
        </div>
      </div>
    </div>
  );
}
