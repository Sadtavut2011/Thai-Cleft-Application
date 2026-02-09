import React, { useState, useEffect, useRef } from 'react';
import { Filter, X, Check } from 'lucide-react';
import { cn } from "../../../../components/ui/utils";
import { Button } from "../../../../components/ui/button";

interface FilterOption {
  id: string;
  label: string;
  color?: string;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
}

interface SuperFilterProps {
  sections?: FilterSection[];
  onApply?: (filters: Record<string, string[]>) => void;
  onClear?: () => void;
  activeFilters?: Record<string, string[]>;
}

// Default filter sections based on user request (Updated Area to Tambon)
const DEFAULT_SECTIONS: FilterSection[] = [
  {
    id: 'province',
    title: 'จังหวัด',
    options: [
      { id: 'cm', label: 'เชียงใหม่' },
      { id: 'cr', label: 'เชียงราย' },
      { id: 'lp', label: 'ลำพูน' },
      { id: 'ms', label: 'แม่ฮ่องสอน' },
      { id: 'py', label: 'พะเยา' },
      { id: 'pr', label: 'แพร่' },
      { id: 'nn', label: 'น่าน' },
      { id: 'lg', label: 'ลำปาง' }
    ]
  },
  {
    id: 'area',
    title: 'พื้นที่ (ตำบล)',
    options: [
      { id: 'wiang', label: 'ต.เวียง' },
      { id: 'monpin', label: 'ต.ม่อนปิ่น' },
      { id: 'sansai', label: 'ต.สันทราย' },
      { id: 'maekha', label: 'ต.แม่คะ' },
      { id: 'maeka', label: 'ต.แม่ข่า' },
      { id: 'pongnamron', label: 'ต.โป่งน้ำร้อน' },
      { id: 'maengon', label: 'ต.แม่งอน' },
      { id: 'maesun', label: 'ต.แม่สูน' }
    ]
  },
  {
    id: 'age',
    title: 'ช่วงอายุ',
    options: [
      { id: '0-5', label: '0 - 5 ปี' },
      { id: '6-12', label: '6 - 12 ปี' },
      { id: '13-18', label: '13 - 18 ปี' },
      { id: '19+', label: '19 ปีขึ้นไป' }
    ]
  },
  {
    id: 'hospital',
    title: 'โรงพยาบาล',
    options: [
      { id: 'h1', label: 'รพ.มหาราชนครเชียงใหม่' },
      { id: 'h2', label: 'รพ.นครพิงค์' },
      { id: 'h3', label: 'รพ.ฝาง' },
      { id: 'h4', label: 'รพ.จอมทอง' },
      { id: 'h5', label: 'รพ.เชียงรายประชานุเคราะห์' },
      { id: 'h6', label: 'รพ.แม่จัน' }
    ]
  },
  {
    id: 'status',
    title: 'สถานะ',
    options: [
      { id: 'pending', label: 'รอดำเนินการ' },
      { id: 'confirmed', label: 'ยืนยัน/นัดหมายแล้ว' },
      { id: 'completed', label: 'เสร็จสิ้น' },
      { id: 'cancelled', label: 'ยกเลิก/ปฏิเสธ' }
    ]
  }
];

export function SuperFilter({ sections = DEFAULT_SECTIONS, onApply, onClear, activeFilters = {} }: SuperFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>(activeFilters);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');

  // Update active section if sections change
  useEffect(() => {
    if (sections.length > 0 && !activeSectionId) {
        setActiveSectionId(sections[0].id);
    }
  }, [sections]);

  // Sync temp filters when active filters change or modal opens
  useEffect(() => {
    if (isOpen) {
      setTempFilters(activeFilters);
      if (sections.length > 0) setActiveSectionId(sections[0].id);
    }
  }, [isOpen, activeFilters, sections]);

  // Drag to Scroll Logic for Tabs
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const toggleOption = (sectionId: string, optionId: string) => {
    setTempFilters(prev => {
      const sectionValues = prev[sectionId] || [];
      const isSelected = sectionValues.includes(optionId);
      
      if (isSelected) {
        return {
          ...prev,
          [sectionId]: sectionValues.filter(id => id !== optionId)
        };
      } else {
        return {
          ...prev,
          [sectionId]: [...sectionValues, optionId]
        };
      }
    });
  };

  const handleApply = () => {
    if (onApply) onApply(tempFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempFilters({});
  };

  const handleConfirmClear = () => {
      handleReset();
      if (onClear) onClear();
      setIsOpen(false);
  }

  // Count active filters for badge
  const activeCount = Object.values(activeFilters).reduce((acc, curr) => acc + curr.length, 0);
  const tempCount = Object.values(tempFilters).reduce((acc, curr) => acc + curr.length, 0);

  // Get active section data
  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0 shadow-sm text-slate-500 relative"
      >
         <Filter size={20} />
         {activeCount > 0 && (
           <span className="absolute -top-1 -right-1 h-4 w-4 bg-teal-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold border border-white">
             {activeCount}
           </span>
         )}
      </button>

      {/* Modal/Sheet Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[10050] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white w-full h-[85vh] sm:h-[80vh] sm:max-w-md sm:rounded-2xl rounded-t-[24px] flex flex-col shadow-xl animate-in slide-in-from-bottom-10 duration-300 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
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
                        className="text-slate-500 text-sm font-medium hover:text-[#7066a9] hover:bg-slate-50 px-3 text-[16px]"
                    >
                        ล้างค่า
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        <X size={24} />
                    </Button>
                </div>
            </div>

            {/* Horizontal Tabs (Draggable) */}
            <div className="border-b border-slate-100 bg-white shrink-0">
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-1 p-3 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] cursor-grab active:cursor-grabbing select-none"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {sections.map(section => {
                         const isSelected = activeSectionId === section.id;
                         const filterCount = (tempFilters[section.id] || []).length;
                         
                         return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSectionId(section.id)}
                                className={cn(
                                    "whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all border shrink-0 flex items-center gap-2",
                                    isSelected 
                                        ? "bg-[#7066a9] text-white border-[#7066a9] shadow-md shadow-indigo-200" 
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                )}
                            >
                                {section.title}
                                {filterCount > 0 && (
                                    <span className={cn(
                                        "w-5 h-5 rounded-full text-[10px] flex items-center justify-center",
                                        isSelected ? "bg-white/20 text-white" : "bg-[#7066a9] text-white"
                                    )}>
                                        {filterCount}
                                    </span>
                                )}
                            </button>
                         );
                    })}
                </div>
            </div>

            {/* Content (Options List) */}
            <div className="flex-1 overflow-y-auto p-5 font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] bg-slate-50/50">
               {activeSection && (
                 <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[16px] flex items-center justify-between">
                        {activeSection.title}
                        <span className="text-xs font-normal text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                            เลือกแล้ว {(tempFilters[activeSection.id] || []).length} รายการ
                        </span>
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5">
                       {activeSection.options.map((option) => {
                         const isSelected = (tempFilters[activeSection.id] || []).includes(option.id);
                         return (
                           <label 
                             key={option.id} 
                             className={cn(
                               "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 select-none",
                               isSelected ? "bg-white border-[#7066a9] shadow-sm ring-1 ring-[#7066a9]/20" : "bg-white border-slate-200 hover:border-slate-300"
                             )}
                             onClick={(e) => {
                                 e.preventDefault();
                                 toggleOption(activeSection.id, option.id);
                             }}
                           >
                              <div className={cn(
                                "w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0",
                                isSelected ? "bg-[#7066a9] border-[#7066a9]" : "bg-slate-50 border-slate-300"
                              )}>
                                 {isSelected && <Check size={14} className="text-white" />}
                              </div>
                              <input 
                                  type="checkbox" 
                                  className="hidden"
                                  checked={isSelected}
                                  readOnly
                              />
                              <div className="flex-1">
                                  <span className={cn(
                                    "text-[16px] flex items-center gap-2",
                                    isSelected ? "text-[#7066a9] font-bold" : "text-slate-700 font-medium"
                                  )}>
                                    {option.label}
                                    {option.color && <span className={cn("w-2 h-2 rounded-full", option.color)} />}
                                  </span>
                              </div>
                           </label>
                         );
                       })}
                    </div>
                 </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-white flex gap-3 pb-8 sm:pb-4 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                <Button 
                    variant="outline" 
                    onClick={handleConfirmClear}
                    className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-[16px] font-medium"
                >
                    ล้างค่าทั้งหมด
                </Button>
                <Button 
                    onClick={handleApply}
                    className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-lg shadow-indigo-200 text-[16px] font-bold"
                >
                    แสดงผลลัพธ์ ({tempCount})
                </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
