import React, { useState } from 'react';
import { Search, ArrowLeft, Check } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../components/ui/utils";

interface HospitalSelectorProps {
  initialSelected?: string;
  onSave: (value: string) => void;
  onBack: () => void;
}

const CATEGORIES = ["โรงพยาบาลรัฐ", "โรงพยาบาลเอกชน", "คลินิก", "อื่นๆ"];

const MOCK_OPTIONS = [
  "โรงพยาบาลมหาราชนครเชียงใหม่",
  "โรงพยาบาลนครพิงค์",
  "โรงพยาบาลสวนปรุง",
  "โรงพยาบาลเชียงใหม่ราม",
  "โรงพยาบาลลานนา",
  "โรงพยาบาลเทพปัญญา"
];

export function HospitalSelector({ initialSelected, onSave, onBack }: HospitalSelectorProps) {
  const [activeTab, setActiveTab] = useState("โรงพยาบาลรัฐ");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Single selection for Hospital
  const [selectedItem, setSelectedItem] = useState<string>(initialSelected || "");

  const toggleSelection = (item: string) => {
    setSelectedItem(item === selectedItem ? "" : item);
  };

  const handleSave = () => {
    onSave(selectedItem);
  };

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
            <h1 className="text-xl font-medium text-[#120d26]">เลือกโรงพยาบาล</h1>
         </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-lg mx-auto flex flex-col h-full md:h-auto min-h-[500px]">
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาโรงพยาบาล..." 
              className="h-[50px] rounded-xl border-gray-200 bg-white text-[#120d26] pl-10 focus:ring-[#5669FF]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border",
                  activeTab === cat 
                    ? "bg-[#5669FF] text-white border-[#5669FF]" 
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
              const isSelected = selectedItem === item;
              return (
                <div 
                  key={item}
                  onClick={() => toggleSelection(item)}
                  className={cn(
                    "p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all border mb-2",
                    isSelected 
                      ? "bg-[#F4F6FF] border-[#5669FF]/30" 
                      : "bg-white border-transparent hover:bg-gray-50"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium leading-relaxed pr-4",
                    isSelected ? "text-[#5669FF]" : "text-[#120d26]"
                  )}>
                    {item}
                  </span>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors border",
                    isSelected 
                      ? "bg-[#5669FF] border-[#5669FF]" 
                      : "bg-white border-gray-300"
                  )}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Button */}
          <div className="mt-auto pt-4 border-t border-gray-100">
             <Button 
               onClick={handleSave}
               className="w-full h-[50px] rounded-xl bg-[#5669FF] text-white font-medium hover:bg-[#4854d6] shadow-md shadow-indigo-200 text-[16px] flex items-center justify-center gap-2 uppercase tracking-wide"
             >
               SAVE
             </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
