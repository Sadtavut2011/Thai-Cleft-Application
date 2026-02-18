import React, { useState } from 'react';
import { Search, ArrowLeft, Check, Scissors, Smile, MessageCircle, FileText } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../components/ui/utils";

interface TreatmentSelectorProps {
  initialSelected?: string;
  onSave: (value: string) => void;
  onBack: () => void;
}

const CATEGORIES = ["ทั้งหมด", "การผ่าตัด", "ทันตกรรม", "ฝึกพูด", "อื่นๆ"];

interface TreatmentOption {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: 'scissors' | 'smile' | 'message' | 'file';
}

const TREATMENT_OPTIONS: TreatmentOption[] = [
  { id: 't1', label: 'Consult คลินิกนมแม่', description: 'ปรึกษาเรื่องการให้นมในเด็กปากแหว่งเพดานโหว่', category: 'อื่นๆ', icon: 'file' },
  { id: 't2', label: 'Consult Pediatrician เพื่อประเมินเรื่อง associated anomaly', description: 'ตรวจหาความผิดปกติร่วมอื่นๆ โดยกุมารแพทย์', category: 'อื่นๆ', icon: 'file' },
  { id: 't3', label: 'Consult Pediatrician เพื่อประเมิน Pre-op evaluation', description: 'ประเมินความพร้อมก่อนผ่าตัดโดยกุมารแพทย์', category: 'อื่นๆ', icon: 'file' },
  { id: 't4', label: 'Consult ENT เพื่อประเมิน Hearing and airway obstruction', description: 'ตรวจการได้ยินและทางเดินหายใจ โดยแพทย์หู คอ จมูก', category: 'อื่นๆ', icon: 'file' },
  { id: 't5', label: 'Hearing Screening (OAE)', description: 'ตรวจคัดกรองการได้ยินด้วยเครื่อง OAE', category: 'อื่นๆ', icon: 'file' },
  { id: 't6', label: 'Lip Repair (Cheiloplasty)', description: 'ผ่าตัดเย็บซ่อมริมฝีปาก อายุประมาณ 3 เดือน', category: 'การผ่าตัด', icon: 'scissors' },
  { id: 't7', label: 'Palate Repair (Palatoplasty)', description: 'ผ่าตัดเย็บซ่อมเพดานปาก อายุประมาณ 9-12 เดือน', category: 'การผ่าตัด', icon: 'scissors' },
  { id: 't8', label: 'Alveolar Bone Graft', description: 'ปลูกกระดูกสันเหงือก อายุประมาณ 9-11 ปี', category: 'การผ่าตัด', icon: 'scissors' },
  { id: 't9', label: 'Lip/Nose Revision', description: 'แก้ไขรูปจมูกและริมฝีปาก หลังเข้าวัยรุ่น', category: 'การผ่าตัด', icon: 'scissors' },
  { id: 't10', label: 'NAM (Nasoalveolar Molding)', description: 'ใส่เพดานเทียมปรับรูปจมูกและสันเหงือกก่อนผ่าตัด', category: 'ทันตกรรม', icon: 'smile' },
  { id: 't11', label: 'จัดฟัน (Orthodontics)', description: 'จัดฟันเพื่อเตรียมสันเหงือกก่อนปลูกกระดูก', category: 'ทันตกรรม', icon: 'smile' },
  { id: 't12', label: 'Speech Therapy', description: 'ฝึกพูดและแก้ไขปัญหาเสียงขึ้นจมูก', category: 'ฝึกพูด', icon: 'message' },
  { id: 't13', label: 'Speech Assessment', description: 'ประเมินพัฒนาการด้านภาษาและการพูด', category: 'ฝึกพูด', icon: 'message' },
];

const getIcon = (type: string, isSelected: boolean) => {
  const color = isSelected ? "text-[#7367f0]" : "text-gray-400";
  const size = 18;
  switch (type) {
    case 'scissors': return <Scissors size={size} className={color} />;
    case 'smile': return <Smile size={size} className={color} />;
    case 'message': return <MessageCircle size={size} className={color} />;
    case 'file': return <FileText size={size} className={color} />;
    default: return <FileText size={size} className={color} />;
  }
};

export function TreatmentSelector({ initialSelected, onSave, onBack }: TreatmentSelectorProps) {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    if (!initialSelected) return [];
    return initialSelected.split(',').map(s => s.trim()).filter(Boolean);
  });

  const toggleSelection = (label: string) => {
    setSelectedItems(prev => {
      if (prev.includes(label)) {
        return prev.filter(i => i !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  const handleSave = () => {
    onSave(selectedItems.join(', '));
  };

  const filteredOptions = TREATMENT_OPTIONS.filter(item => {
    const matchesCategory = activeTab === "ทั้งหมด" || item.category === activeTab;
    const matchesSearch = !searchQuery || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const groupedOptions = activeTab === "ทั้งหมด" 
    ? CATEGORIES.filter(c => c !== "ทั้งหมด").map(cat => ({
        category: cat,
        items: filteredOptions.filter(item => item.category === cat)
      })).filter(g => g.items.length > 0)
    : [{ category: activeTab, items: filteredOptions }];

  return (
    <div className="bg-[#FAFAFA] h-full flex flex-col font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Header */}
      <div className="relative bg-white pt-6 pb-4 px-6 shadow-sm z-10 flex-shrink-0 flex items-center gap-4 border-b border-gray-100">
         <Button variant="ghost" size="icon" onClick={onBack} className="text-[#120d26]">
           <ArrowLeft className="w-6 h-6" />
         </Button>
         <div className="flex items-center gap-3">
           <div className="w-9 h-9 rounded-lg bg-[#7367f0]/10 flex items-center justify-center">
             <Scissors size={18} className="text-[#7367f0]" />
           </div>
           <div className="flex flex-col gap-0.5">
             <h1 className="text-xl font-medium text-[#120d26]">เลือกรายการรักษา</h1>
             <p className="text-xs text-gray-400">เลือกรายการรักษาหรือการ Consult ที่ต้องการ</p>
           </div>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-2xl mx-auto flex flex-col min-h-[500px]">
          
          {/* Search Bar */}
          <div className="relative mb-5">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาการรักษา..." 
              className="h-[50px] rounded-xl border-gray-200 bg-white text-[#120d26] pl-10 focus:ring-[#7367f0]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
                  activeTab === cat 
                    ? "bg-[#7367f0] text-white border-[#7367f0] shadow-md shadow-indigo-200" 
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List grouped by category */}
          <div className="flex-1 space-y-5 mb-6">
            {groupedOptions.map(group => (
              <div key={group.category}>
                {activeTab === "ทั้งหมด" && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-5 rounded-full bg-[#7367f0]" />
                    <h3 className="text-sm font-bold text-[#5e5873]">{group.category}</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{group.items.length}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const isSelected = selectedItems.includes(item.label);
                    return (
                      <div 
                        key={item.id}
                        onClick={() => toggleSelection(item.label)}
                        className={cn(
                          "p-4 rounded-xl flex items-start gap-3 cursor-pointer transition-all border",
                          isSelected 
                            ? "bg-[#F4F6FF] border-[#7367f0]/30 shadow-sm" 
                            : "bg-white border-transparent hover:bg-gray-50"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                          isSelected ? "bg-[#7367f0]/10" : "bg-gray-100"
                        )}>
                          {getIcon(item.icon, isSelected)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={cn(
                            "text-sm font-medium leading-relaxed block",
                            isSelected ? "text-[#7367f0]" : "text-[#120d26]"
                          )}>{item.label}</span>
                          <span className="text-xs text-gray-400 leading-relaxed block mt-0.5">{item.description}</span>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors border mt-0.5",
                          isSelected ? "bg-[#7367f0] border-[#7367f0]" : "bg-white border-gray-300"
                        )}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredOptions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Scissors className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">ไม่พบรายการรักษาที่ค้นหา</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-auto pt-4 border-t border-gray-100">
             <Button 
               onClick={handleSave}
               disabled={selectedItems.length === 0}
               className={cn(
                 "w-full h-[50px] rounded-xl font-medium text-[16px] flex items-center justify-center gap-2 uppercase tracking-wide",
                 selectedItems.length > 0
                   ? "bg-[#7367f0] text-white hover:bg-[#685dd8] shadow-md shadow-indigo-200"
                   : "bg-gray-300 text-gray-500 cursor-not-allowed"
               )}
             >
               SAVE
             </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
