import React, { useState, useRef } from 'react';
import { Search, Check, ChevronLeft, ClipboardList, FileText, Stethoscope, Baby } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { cn } from "../../../../../components/ui/utils";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";

interface VisitSelectorProps {
  initialSelected?: string;
  onSave: (value: string) => void;
  onBack: () => void;
}

const CATEGORIES = ["ทั้งหมด", "Cleft Lip and Palate", "Cleft Palate", "Cleft Lip"];

interface VisitFormOption {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: 'clipboard' | 'stethoscope' | 'baby' | 'file';
}

const VISIT_FORM_OPTIONS: VisitFormOption[] = [
  // Cleft Lip and Palate forms
  { id: 'clp-oral-face', label: 'แบบประเมินสุขภาพช่องปากและใบหน้า', description: 'ประเมินสุขภาพช่องปาก ริมฝีปาก และเพดานปาก', category: 'Cleft Lip and Palate', icon: 'stethoscope' },
  { id: 'clp-feeding', label: 'แบบประเมินการให้นม/การกิน', description: 'ประเมินความสามารถในการดูดนมและรับประทานอาหาร', category: 'Cleft Lip and Palate', icon: 'baby' },
  { id: 'clp-speech-dev', label: 'แบบประเมินการพูดและพัฒนาการ', description: 'ประเมินพัฒนาการด้านการพูด ภาษา และการสื่อสาร', category: 'Cleft Lip and Palate', icon: 'clipboard' },
  { id: 'clp-post-lip', label: 'แบบประเมินหลังผ่าตัดริมฝีปาก', description: 'ติดตามแผลผ่าตัดเย็บริมฝีปาก สังเกตอาการแทรกซ้อน', category: 'Cleft Lip and Palate', icon: 'file' },
  { id: 'clp-post-palate', label: 'แบบประเมินหลังผ่าตัดเพดานปาก', description: 'ติดตามแผลผ่าตัดเย็บเพดานปาก ประเมินการหายของแผล', category: 'Cleft Lip and Palate', icon: 'file' },
  { id: 'clp-psychosocial', label: 'แบบประเมินทางจิตสังคม', description: 'ประเมินสภาพจิตใจ การปรับตัว ความเครียดของครอบครัว', category: 'Cleft Lip and Palate', icon: 'clipboard' },
  
  // Cleft Palate only forms
  { id: 'cp-palate-health', label: 'แบบประเมินสุขภาพเพดานปาก', description: 'ตรวจสอบสภาพเพดานปาก รูรั่ว และการทำงาน', category: 'Cleft Palate', icon: 'stethoscope' },
  { id: 'cp-feeding', label: 'แบบประเมินการให้นม/การกิน (CP)', description: 'ประเมินปัญหาการดูดกลืนจากเพดานโหว่', category: 'Cleft Palate', icon: 'baby' },
  { id: 'cp-speech', label: 'แบบประเมินการพูด', description: 'ประเมินเสียงขึ้นจมูก (Hypernasality) และความชัดเจนในการพูด', category: 'Cleft Palate', icon: 'clipboard' },
  { id: 'cp-post-palate', label: 'แบบประเมินหลังผ่าตัดเพดานปาก (CP)', description: 'ติดตามแผลผ่าตัด การทำงานของเพดานอ่อน', category: 'Cleft Palate', icon: 'file' },
  { id: 'cp-hearing', label: 'แบบประเมินการได้ยิน', description: 'ตรวจสอบปัญหาหูชั้นกลาง การได้ยินที่อาจเกิดจากเพดานโหว่', category: 'Cleft Palate', icon: 'stethoscope' },
  
  // Cleft Lip only forms
  { id: 'cl-lip-health', label: 'แบบประเมินสุขภาพริมฝีปาก', description: 'ตรวจสอบสภาพริมฝีปาก ความสมมาตร และการเคลื่อนไหว', category: 'Cleft Lip', icon: 'stethoscope' },
  { id: 'cl-feeding', label: 'แบบประเมินการให้นม/การกิน (CL)', description: 'ประเมินความสามารถในการดูดนมจากภาวะปากแหว่ง', category: 'Cleft Lip', icon: 'baby' },
  { id: 'cl-post-lip', label: 'แบบประเมินหลังผ่าตัดริมฝีปาก (CL)', description: 'ติดตามแผลผ่าตัดเย็บริมฝีปาก ความสมมาตร รอยแผลเป็น', category: 'Cleft Lip', icon: 'file' },
  { id: 'cl-general-dev', label: 'แบบประเมินพัฒนาการทั่วไป', description: 'ประเมินพัฒนาการตามวัย ด้านร่างกาย สติปัญญา อารมณ์', category: 'Cleft Lip', icon: 'clipboard' },
];

const getIcon = (type: string, isSelected: boolean) => {
  const color = isSelected ? "text-[#7367f0]" : "text-gray-400";
  const size = 18;
  switch (type) {
    case 'stethoscope': return <Stethoscope size={size} className={color} />;
    case 'baby': return <Baby size={size} className={color} />;
    case 'clipboard': return <ClipboardList size={size} className={color} />;
    case 'file': return <FileText size={size} className={color} />;
    default: return <FileText size={size} className={color} />;
  }
};

export function VisitSelector({ initialSelected, onSave, onBack }: VisitSelectorProps) {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string>(initialSelected || "");

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

  const handleSave = () => {
    onSave(selectedItem);
  };

  const filteredOptions = VISIT_FORM_OPTIONS.filter(item => {
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
                <h1 className="text-white text-lg font-bold">เลือกฟอร์มเยี่ยมบ้าน</h1>
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
              placeholder="ค้นหาฟอร์ม..." 
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

          {/* Selected indicator */}
          {selectedItem && (
            null
          )}

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
                    const isSelected = selectedItem === item.label;
                    return (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedItem(isSelected ? "" : item.label)}
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
                <ClipboardList className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">ไม่พบฟอร์มที่ค้นหา</p>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[10002] pb-8">
             <Button 
               onClick={handleSave}
               disabled={!selectedItem}
               className={cn(
                 "w-full h-[50px] rounded-xl text-white font-medium shadow-md shadow-indigo-200 text-[16px] flex items-center justify-center gap-2 uppercase tracking-wide",
                 selectedItem 
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