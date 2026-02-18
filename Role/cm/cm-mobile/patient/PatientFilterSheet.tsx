import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { cn } from '../../../../components/ui/utils';

export interface FilterCriteria {
  diagnoses: string[];
  rights: string[];
  patientStatuses: string[];  // สถานะผู้ป่วย: ปกติ, Loss follow up, รักษาเสร็จสิ้น, เสียชีวิต, มารดา
  caseStatuses: string[];     // สถานะผู้ใช้งาน: Active, Inactive
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

const PATIENT_STATUS_OPTIONS = [
  { id: "ปกติ", label: "ปกติ", color: "bg-emerald-500" },
  { id: "Loss follow up", label: "Loss follow up", color: "bg-orange-400" },
  { id: "รักษาเสร็จสิ้น", label: "รักษาเสร็จสิ้น", color: "bg-blue-400" },
  { id: "เสียชีวิต", label: "เสียชีวิต", color: "bg-red-400" },
  { id: "มารดา", label: "มารดา", color: "bg-pink-400" }
];

const CASE_STATUS_OPTIONS = [
  { id: "Active", label: "Active", color: "bg-emerald-500" },
  { id: "Inactive", label: "Inactive", color: "bg-slate-400" }
];

type TabKey = 'diagnosis' | 'rights' | 'patientStatus' | 'caseStatus';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'diagnosis', label: 'ผลการวินิจฉัย' },
  { key: 'rights', label: 'สิทธิการรักษา' },
  { key: 'patientStatus', label: 'สถานะผู้ป่วย' },
  { key: 'caseStatus', label: 'สถานะผู้ใช้งาน' },
];

export default function PatientFilterSheet({ 
  isOpen, 
  onClose, 
  onApply, 
  initialCriteria 
}: PatientFilterSheetProps) {
  const [criteria, setCriteria] = useState<FilterCriteria>(initialCriteria);
  const [activeTab, setActiveTab] = useState<TabKey>('diagnosis');
  
  // Reset local state when opening
  useEffect(() => {
    if (isOpen) {
      setCriteria(initialCriteria);
      setActiveTab('diagnosis');
    }
  }, [isOpen, initialCriteria]);

  if (!isOpen) return null;

  const toggleItem = (field: keyof FilterCriteria, item: string) => {
    setCriteria(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter(i => i !== item)
        : [...(prev[field] as string[]), item]
    }));
  };

  const handleReset = () => {
    setCriteria({
      diagnoses: [],
      rights: [],
      patientStatuses: [],
      caseStatuses: []
    });
  };

  const handleApply = () => {
    onApply(criteria);
    onClose();
  };

  const totalSelected = criteria.diagnoses.length + criteria.rights.length + criteria.patientStatuses.length + criteria.caseStatuses.length;

  // Count per tab
  const tabCounts: Record<TabKey, number> = {
    diagnosis: criteria.diagnoses.length,
    rights: criteria.rights.length,
    patientStatus: criteria.patientStatuses.length,
    caseStatus: criteria.caseStatuses.length,
  };

  // Reusable checkbox row renderer
  const renderCheckboxItem = (
    item: { id: string; label: string; color?: string },
    isSelected: boolean,
    onToggle: () => void
  ) => (
    <label 
      key={item.id} 
      className={cn(
        "flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200",
        isSelected ? 'bg-[#F3E8FF] border-[#D8B4FE]' : 'bg-white border-slate-100 hover:border-slate-200'
      )}
    >
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
        isSelected ? 'bg-[#7066a9] border-[#7066a9]' : 'bg-white border-slate-300'
      )}>
        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
      <input 
        type="checkbox" 
        className="hidden"
        checked={isSelected}
        onChange={onToggle}
      />
      <span className={cn("text-[15px] flex items-center gap-2", isSelected ? 'text-[#6b21a8] font-medium' : 'text-slate-600')}>
        {item.label}
        {item.color && <span className={cn("w-2.5 h-2.5 rounded-full", item.color)} />}
      </span>
    </label>
  );

  return (
    <div className="fixed inset-0 z-[10050] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full h-[85vh] sm:h-auto sm:max-w-md sm:rounded-2xl rounded-t-[24px] flex flex-col shadow-xl animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="bg-[#7066a9]/10 p-1.5 rounded-lg text-[#7066a9]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                ตัวกรอง (Filter)
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X size={24} />
            </Button>
        </div>

        {/* Tab Bar */}
        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const count = tabCounts[tab.key];
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                    isActive
                      ? "bg-[#7066a9] text-white shadow-md shadow-[#7066a9]/25"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={cn(
                      "min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] font-bold px-1",
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-[#7066a9] text-white"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] min-h-0">
            
            {/* Diagnosis Tab */}
            {activeTab === 'diagnosis' && (
              <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
                {DIAGNOSIS_OPTIONS.map((item) => {
                  const isSelected = criteria.diagnoses.includes(item);
                  return renderCheckboxItem(
                    { id: item, label: item },
                    isSelected,
                    () => toggleItem('diagnoses', item)
                  );
                })}
              </div>
            )}

            {/* Rights Tab */}
            {activeTab === 'rights' && (
              <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
                {RIGHTS_OPTIONS.map((item) => {
                  const isSelected = criteria.rights.includes(item);
                  return renderCheckboxItem(
                    { id: item, label: item },
                    isSelected,
                    () => toggleItem('rights', item)
                  );
                })}
              </div>
            )}

            {/* Patient Status Tab - สถานะผู้ป่วย */}
            {activeTab === 'patientStatus' && (
              <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
                {PATIENT_STATUS_OPTIONS.map((item) => {
                  const isSelected = criteria.patientStatuses.includes(item.id);
                  return renderCheckboxItem(
                    item,
                    isSelected,
                    () => toggleItem('patientStatuses', item.id)
                  );
                })}
              </div>
            )}

            {/* Case Status Tab - สถานะผู้ใช้งาน */}
            {activeTab === 'caseStatus' && (
              <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
                {CASE_STATUS_OPTIONS.map((item) => {
                  const isSelected = criteria.caseStatuses.includes(item.id);
                  return renderCheckboxItem(
                    item,
                    isSelected,
                    () => toggleItem('caseStatuses', item.id)
                  );
                })}
              </div>
            )}
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
                ยืนยัน {totalSelected > 0 ? `(${totalSelected})` : ''}
            </Button>
        </div>
      </div>
    </div>
  );
}
