import React, { useState } from 'react';
import { Search, ArrowLeft, Check, Hospital, Building2, Stethoscope, MapPin } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../components/ui/utils";

interface HospitalSelectorProps {
  initialSelected?: string;
  onSave: (value: string) => void;
  onBack: () => void;
}

const CATEGORIES = ["ทั้งหมด", "รัฐบาล", "เอกชน", "คลินิก", "อื่นๆ"];

interface HospitalOption {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: 'hospital' | 'building' | 'stethoscope' | 'mappin';
}

const HOSPITAL_OPTIONS: HospitalOption[] = [
  { id: 'h1', label: 'โรงพยาบาลมหาราชนครเชียงใหม่', description: 'โรงพยาบาลมหาวิทยาลัย ศูนย์เชี่ยวชาญด้านปากแหว่งเพดานโหว่', category: 'รัฐบาล', icon: 'hospital' },
  { id: 'h2', label: 'โรงพยาบาลนครพิงค์', description: 'โรงพยาบาลศูนย์ จังหวัดเชียงใหม่', category: 'รัฐบาล', icon: 'hospital' },
  { id: 'h3', label: 'โรงพยาบาลสวนปรุง', description: 'โรงพยาบาลจิตเวช จังหวัดเชียงใหม่', category: 'รัฐบาล', icon: 'hospital' },
  { id: 'h4', label: 'โรงพยาบาลเชียงใหม่ราม', description: 'โรงพยาบาลเอกชน บริการครบวงจร', category: 'เอกชน', icon: 'building' },
  { id: 'h5', label: 'โรงพยาบาลลานนา', description: 'โรงพยาบาลเอกชน บริการดูแลสุขภาพ', category: 'เอกชน', icon: 'building' },
  { id: 'h6', label: 'โรงพยาบาลเทพปัญญา', description: 'โรงพยาบาลเอกชน เชี่ยวชาญด้านศัลยกรรม', category: 'เอกชน', icon: 'building' },
];

const getIcon = (type: string, isSelected: boolean) => {
  const color = isSelected ? "text-[#7367f0]" : "text-gray-400";
  const size = 18;
  switch (type) {
    case 'hospital': return <Hospital size={size} className={color} />;
    case 'building': return <Building2 size={size} className={color} />;
    case 'stethoscope': return <Stethoscope size={size} className={color} />;
    case 'mappin': return <MapPin size={size} className={color} />;
    default: return <Hospital size={size} className={color} />;
  }
};

export function HospitalSelector({ initialSelected, onSave, onBack }: HospitalSelectorProps) {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedItem, setSelectedItem] = useState<string>(initialSelected || "");

  const toggleSelection = (label: string) => {
    setSelectedItem(label === selectedItem ? "" : label);
  };

  const handleSave = () => {
    onSave(selectedItem);
  };

  const filteredOptions = HOSPITAL_OPTIONS.filter(item => {
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
             <Hospital size={18} className="text-[#7367f0]" />
           </div>
           <div className="flex flex-col gap-0.5">
             <h1 className="text-xl font-medium text-[#120d26]">เลือกโรงพยาบาล</h1>
             <p className="text-xs text-gray-400">เลือกสถานพยาบาลที่ทำการรักษา</p>
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
              placeholder="ค้นหาโรงพยาบาล..." 
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
                    const isSelected = selectedItem === item.label;
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
                <Hospital className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">ไม่พบโรงพยาบาลที่ค้นหา</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-auto pt-4 border-t border-gray-100">
             <Button 
               onClick={handleSave}
               disabled={!selectedItem}
               className={cn(
                 "w-full h-[50px] rounded-xl font-medium text-[16px] flex items-center justify-center gap-2 uppercase tracking-wide",
                 selectedItem
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
