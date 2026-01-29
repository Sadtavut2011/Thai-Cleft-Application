import React, { useState } from 'react';
import { Search, ArrowRight, Check, ChevronLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../components/ui/utils";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";

interface TreatmentSelectorProps {
  initialSelected?: string;
  onSave: (value: string) => void;
  onBack: () => void;
}

const CATEGORIES = ["การผ่าตัด", "ทันตกรรม", "ฝึกพูด", "อื่นๆ"];

const MOCK_OPTIONS = [
  "Consult คลินิกนมแม่",
  "Consult Pediatrician เพื่อประเมินเรื่อง associated anomaly",
  "Consult Pediatrician เพื่อประเมิน Pre-op evaluation",
  "Consult ENT เพื่อประเมิน Hearing and airway obstruction",
  "Hearing Screening (OAE)"
];

export function TreatmentSelector({ initialSelected, onSave, onBack }: TreatmentSelectorProps) {
  const [activeTab, setActiveTab] = useState("อื่นๆ");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    if (!initialSelected) return [];
    return initialSelected.split(',').map(s => s.trim()).filter(Boolean);
  });

  const toggleSelection = (item: string) => {
    setSelectedItems(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSave = () => {
    onSave(selectedItems.join(', '));
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
                <h1 className="text-white text-lg font-bold">เลือกรายการรักษา</h1>
            </div>
        </div>
      </div>

      {/* Content Area - Full Screen */}
      <div className="flex-1 p-4 md:p-6 pb-24 flex flex-col">
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาการรักษา..." 
              className="h-[50px] rounded-xl border-gray-200 bg-white text-[#120d26] pl-10 focus:ring-[#7367f0]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-1 py-2 rounded-full text-xs font-medium transition-colors border text-center truncate",
                  activeTab === cat 
                    ? "bg-[#7367f0] text-white border-[#7367f0]" 
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-1 mb-6 -mx-2 px-2">
            {MOCK_OPTIONS.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => {
              const isSelected = selectedItems.includes(item);
              return (
                <div 
                  key={item}
                  onClick={() => toggleSelection(item)}
                  className={cn(
                    "p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all border mb-2",
                    isSelected 
                      ? "bg-[#F4F6FF] border-[#7367f0]/30" 
                      : "bg-white border-transparent hover:bg-gray-50"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium leading-relaxed pr-4",
                    isSelected ? "text-[#7367f0]" : "text-[#120d26]"
                  )}>
                    {item}
                  </span>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors border",
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

          {/* Save Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[10002] pb-8">
             <Button 
               onClick={handleSave}
               className="w-full h-[50px] rounded-xl bg-[#7367f0] text-white font-medium hover:bg-[#685dd8] shadow-md shadow-indigo-200 text-[16px] flex items-center justify-center gap-2 uppercase tracking-wide"
             >
               SAVE
               <ArrowRight className="w-5 h-5" />
             </Button>
          </div>

      </div>
    </div>
  );
}
