import React, { useState, useRef } from 'react';
import { Search, Check, ChevronLeft, Scissors, Smile, MessageCircle, FileText } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../components/ui/utils";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";

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
  // อื่นๆ (Consult / Assessment)
  { id: 't1', label: 'Consult คลินิกนมแม่', description: 'ปรึกษาเรื่องการให้นมในเด็กปากแหว่งเพดานโหว่', category: 'อื่นๆ', icon: 'file' },
  { id: 't2', label: 'Consult Pediatrician เพื่อประเมินเรื่อง associated anomaly', description: 'ตรวจหาความผิดปกติร่วมอื่นๆ โดยกุมารแพทย์', category: 'อื่นๆ', icon: 'file' },
  { id: 't3', label: 'Consult Pediatrician เพื่อประเมิน Pre-op evaluation', description: 'ประเมินความพร้อมก่อนผ่าตัดโดยกุมารแพทย์', category: 'อื่นๆ', icon: 'file' },
  { id: 't4', label: 'Consult ENT เพื่อประเมิน Hearing and airway obstruction', description: 'ตรวจการได้ยินและทางเดินหายใจ โดยแพทย์หู คอ จมูก', category: 'อื่นๆ', icon: 'file' },
  { id: 't5', label: 'Hearing Screening (OAE)', description: 'ตรวจคัดกรองการได้ยินด้วยเครื่อง OAE', category: 'อื่นๆ', icon: 'file' },

  // การผ่าตัด
  { id: 't6', label: 'Lip Repair (Cheiloplasty)', description: 'ผ่าตัดเย็บซ่อมริมฝีปาก อายุประมาณ 3 เดือน', category: 'การผ่าตัด', icon: 'scissors' },
  { id: 't7', label: 'Palate Repair (Palatoplasty)', description: 'ผ่าตัดเย็บซ่อมเพดานปาก อายุประมาณ 9-12 เดือน', category: 'การผ่าตัด', icon: 'scissors' },
  { id: 't8', label: 'Alveolar Bone Graft', description: 'ปลูกกระดูกสันเหงือก อายุประมาณ 9-11 ปี', category: 'การผ่าตัด', icon: 'scissors' },
  { id: 't9', label: 'Lip/Nose Revision', description: 'แก้ไขรูปจมูกและริมฝีปาก หลังเข้าวัยรุ่น', category: 'การผ่าตัด', icon: 'scissors' },

  // ทันตกรรม
  { id: 't10', label: 'NAM (Nasoalveolar Molding)', description: 'ใส่เพดานเทียมปรับรูปจมูกและสันเหงือกก่อนผ่าตัด', category: 'ทันตกรรม', icon: 'smile' },
  { id: 't11', label: 'จัดฟัน (Orthodontics)', description: 'จัดฟันเพื่อเตรียมสันเหงือกก่อนปลูกกระดูก', category: 'ทันตกรรม', icon: 'smile' },

  // ฝึกพูด
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

  // Drag to scroll logic
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => { setIsDragging(false); };
  const handleMouseUp = () => { setIsDragging(false); };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

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

  // Group by category when showing all
  const groupedOptions = activeTab === "ทั้งหมด" 
    ? CATEGORIES.filter(c => c !== "ทั้งหมด").map(cat => ({
        category: cat,
        items: filteredOptions.filter(item => item.category === cat)
      })).filter(g => g.items.length > 0)
    : [{ category: activeTab, items: filteredOptions }];

  return (
    <div className="fixed inset-0 z-[10001] bg-white w-full h-[100dvh] overflow-y-auto flex flex-col font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      
      {/* Hide the global bottom navigation bar */}
      <style>{`
        div.fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
          display: none !important;
        }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-[10000] w-full bg-[#7066a9] shadow-md flex flex-col">
        <div className="w-full">
            <StatusBarIPhone16Main />
        </div>
        <div className="h-[64px] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-white text-lg font-bold">เลือกรายการรักษา</h1>
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 md:p-6 pb-24 flex flex-col">
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาการรักษา..." 
              className="h-[50px] rounded-xl border-gray-200 bg-white text-[#120d26] pl-10 focus:ring-[#7367f0]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Category Tabs - Draggable */}
          <div 
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto gap-2 mb-4 pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] cursor-grab active:cursor-grabbing select-none"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                   if (!isDragging) setActiveTab(cat);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-[14px] font-medium transition-colors border whitespace-nowrap flex-shrink-0 select-none",
                  activeTab === cat 
                    ? "bg-[#7367f0] text-white border-[#7367f0]" 
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List grouped by category */}
          <div className="flex-1 overflow-y-auto mb-6 -mx-2 px-2 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {groupedOptions.map(group => (
              <div key={group.category}>
                {/* Category Header */}
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
                        {/* Icon */}
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                          isSelected ? "bg-[#7367f0]/10" : "bg-gray-100"
                        )}>
                          {getIcon(item.icon, isSelected)}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <span className={cn(
                            "text-[15px] font-medium leading-relaxed block",
                            isSelected ? "text-[#7367f0]" : "text-[#120d26]"
                          )}>
                            {item.label}
                          </span>
                          <span className="text-xs text-gray-400 leading-relaxed block mt-0.5">
                            {item.description}
                          </span>
                        </div>

                        {/* Check */}
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors border mt-1",
                          isSelected 
                            ? "bg-[#7367f0] border-[#7367f0]" 
                            : "bg-white border-gray-300"
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
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[10002] pb-8">
             <Button 
               onClick={handleSave}
               disabled={selectedItems.length === 0}
               className={cn(
                 "w-full h-[50px] rounded-xl text-white font-medium shadow-md shadow-indigo-200 text-[16px] flex items-center justify-center gap-2 uppercase tracking-wide",
                 selectedItems.length > 0 
                   ? "bg-[#7367f0] hover:bg-[#685dd8]" 
                   : "bg-gray-300 cursor-not-allowed"
               )}
             >
               SAVE
             </Button>
          </div>

      </div>
    </div>
  );
}