import React, { useState, useRef } from 'react';
import { Search, Check, ChevronLeft, Building2, MapPin, Hospital } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../components/ui/utils";
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";

interface PcuSelectorProps {
  initialSelected?: string;
  onSave: (value: string) => void;
  onBack: () => void;
}

export interface PcuOption {
  id: string;
  label: string;
  description: string;
  parentHospital: string;
  address?: string;
}

// Mock PCU data grouped by parent hospital
export const PCU_OPTIONS: PcuOption[] = [
  // โรงพยาบาลฝาง
  { id: 'pcu-1', label: 'รพ.สต.ริมใต้', description: 'ตำบลริมใต้ อำเภอแม่ริม', parentHospital: 'โรงพยาบาลฝาง', address: 'หมู่ 3 ต.ริมใต้ อ.แม่ริม จ.เชียงใหม่' },
  { id: 'pcu-2', label: 'รพ.สต.แม่คะ', description: 'ตำบลแม่คะ อำเภอฝาง', parentHospital: 'โรงพยาบาลฝาง', address: 'หมู่ 5 ต.แม่คะ อ.ฝาง จ.เชียงใหม่' },
  { id: 'pcu-3', label: 'รพ.สต.แม่งอน', description: 'ตำบลแม่งอน อำเภอฝาง', parentHospital: 'โรงพยาบาลฝาง', address: 'หมู่ 1 ต.แม่งอน อ.ฝาง จ.เชียงใหม่' },
  { id: 'pcu-4', label: 'รพ.สต.โป่งน้ำร้อน', description: 'ตำบลโป่งน้ำร้อน อำเภอฝาง', parentHospital: 'โรงพยาบาลฝาง', address: 'หมู่ 2 ต.โป่งน้ำร้อน อ.ฝาง จ.เชียงใหม่' },
  { id: 'pcu-17', label: 'รพ.สต.ในเมือง', description: 'ตำบลเวียง อำเภอฝาง', parentHospital: 'โรงพยาบาลฝาง', address: 'หมู่ 1 ต.เวียง อ.ฝาง จ.เชียงใหม่' },

  // โรงพยาบาลมหาราชนครเชียงใหม่
  { id: 'pcu-5', label: 'รพ.สต.ช้างเผือก', description: 'ตำบลช้างเผือก อำเภอเมืองเชียงใหม่', parentHospital: 'รพ.มหาราชนครเชียงใหม่', address: 'หมู่ 1 ต.ช้างเผือก อ.เมือง จ.เชียงใหม่' },
  { id: 'pcu-6', label: 'รพ.สต.ศรีภูมิ', description: 'ตำบลศรีภูมิ อำเภอเมืองเชียงใหม่', parentHospital: 'รพ.มหาราชนครเชียงใหม่', address: 'ต.ศรีภูมิ อ.เมือง จ.เชียงใหม่' },
  { id: 'pcu-7', label: 'รพ.สต.หายยา', description: 'ตำบลหายยา อำเภอเมืองเชียงใหม่', parentHospital: 'รพ.มหาราชนครเชียงใหม่', address: 'ต.หายยา อ.เมือง จ.เชียงใหม่' },
  { id: 'pcu-18', label: 'รพ.สต.ป่าแดด', description: 'ตำบลป่าแดด อำเภอเมืองเชียงใหม่', parentHospital: 'รพ.มหาราชนครเชียงใหม่', address: 'หมู่ 2 ต.ป่าแดด อ.เมือง จ.เชียงใหม่' },

  // โรงพยาบาลนครพิงค์
  { id: 'pcu-8', label: 'รพ.สต.ดอนแก้ว', description: 'ตำบลดอนแก้ว อำเภอแม่ริม', parentHospital: 'โรงพยาบาลนครพิงค์', address: 'หมู่ 4 ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่' },
  { id: 'pcu-9', label: 'รพ.สต.แม่สา', description: 'ตำบลแม่สา อำเภอแม่ริม', parentHospital: 'โรงพยาบาลนครพิงค์', address: 'หมู่ 2 ต.แม่สา อ.แม่ริม จ.เชียงใหม่' },
  { id: 'pcu-10', label: 'รพ.สต.สันทรายหลวง', description: 'ตำบลสันทรายหลวง อำเภอสันทราย', parentHospital: 'โรงพยาบาลนครพิงค์', address: 'หมู่ 1 ต.สันทรายหลวง อ.สันทราย จ.เชียงใหม่' },

  // โรงพยาบาลเชียงรายประชานุเคราะห์
  { id: 'pcu-11', label: 'รพ.สต.บ้านดู่', description: 'ตำบลบ้านดู่ อำเภอเมืองเชียงราย', parentHospital: 'รพ.เชียงรายประชานุเคราะห์', address: 'หมู่ 3 ต.บ้านดู่ อ.เมือง จ.เชียงราย' },
  { id: 'pcu-12', label: 'รพ.สต.แม่ยาว', description: 'ตำบลแม่ยาว อำเภอเมืองเชียงราย', parentHospital: 'รพ.เชียงรายประชานุเคราะห์', address: 'หมู่ 6 ต.แม่ยาว อ.เมือง จ.เชียงราย' },
  { id: 'pcu-13', label: 'รพ.สต.ท่าสุด', description: 'ตำบลท่าสุด อำเภอเมืองเชียงราย', parentHospital: 'รพ.เชียงรายประชานุเคราะห์', address: 'หมู่ 1 ต.ท่าสุด อ.เมือง จ.เชียงราย' },

  // โรงพยาบาลลำปาง
  { id: 'pcu-14', label: 'รพ.สต.พิชัย', description: 'ตำบลพิชัย อำเภอเมืองลำปาง', parentHospital: 'โรงพยาบาลลำปาง', address: 'หมู่ 2 ต.พิชัย อ.เมือง จ.ลำปาง' },
  { id: 'pcu-15', label: 'รพ.สต.ปงแสนทอง', description: 'ตำบลปงแสนทอง อำเภอเมืองลำปาง', parentHospital: 'โรงพยาบาลลำปาง', address: 'หมู่ 4 ต.ปงแสนทอง อ.เมือง จ.ลำปาง' },
  { id: 'pcu-16', label: 'รพ.สต.บ่อแฮ้ว', description: 'ตำบลบ่อแฮ้ว อำเภอเมืองลำปาง', parentHospital: 'โรงพยาบาลลำปาง', address: 'หมู่ 1 ต.บ่อแฮ้ว อ.เมือง จ.ลำปาง' },
];

// Helper: Get all unique parent hospital names for tabs
const HOSPITAL_TABS = ["ทั้งหมด", ...Array.from(new Set(PCU_OPTIONS.map(p => p.parentHospital)))];

export function PcuSelector({ initialSelected, onSave, onBack }: PcuSelectorProps) {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedItem, setSelectedItem] = useState<string>(initialSelected || "");

  // Drag to scroll logic for tabs
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

  const handleSelect = (label: string) => {
    setSelectedItem(prev => prev === label ? "" : label);
  };

  const handleSave = () => {
    onSave(selectedItem);
  };

  const filteredOptions = PCU_OPTIONS.filter(item => {
    const matchesTab = activeTab === "ทั้งหมด" || item.parentHospital === activeTab;
    const matchesSearch = !searchQuery ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.parentHospital.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Group by parent hospital
  const groupedOptions = activeTab === "ทั้งหมด"
    ? HOSPITAL_TABS.filter(h => h !== "ทั้งหมด").map(hospital => ({
        hospital,
        items: filteredOptions.filter(item => item.parentHospital === hospital)
      })).filter(g => g.items.length > 0)
    : [{ hospital: activeTab, items: filteredOptions }];

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
                <h1 className="text-white text-lg font-bold">เลือกหน่วยงานที่รับผิดชอบ</h1>
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
              placeholder="ค้นหา รพ.สต. / หน่วยงาน..."
              className="h-[50px] rounded-xl border-gray-200 bg-white text-[#120d26] pl-10 focus:ring-[#7367f0]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Hospital Tabs - Draggable */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex overflow-x-auto gap-2 mb-4 pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] cursor-grab active:cursor-grabbing select-none"
          >
            {HOSPITAL_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => {
                   if (!isDragging) setActiveTab(tab);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-[14px] font-medium transition-colors border whitespace-nowrap flex-shrink-0 select-none",
                  activeTab === tab
                    ? "bg-[#7367f0] text-white border-[#7367f0]"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List grouped by hospital */}
          <div className="flex-1 overflow-y-auto mb-6 -mx-2 px-2 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {groupedOptions.map(group => (
              <div key={group.hospital}>
                {/* Hospital Group Header */}
                {activeTab === "ทั้งหมด" && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-5 rounded-full bg-[#7367f0]" />
                    <Hospital size={14} className="text-[#7367f0]" />
                    <h3 className="text-sm font-bold text-[#5e5873]">{group.hospital}</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{group.items.length}</span>
                  </div>
                )}

                <div className="space-y-2">
                  {group.items.map((item) => {
                    const isSelected = selectedItem === item.label;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item.label)}
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
                          <MapPin size={18} className={isSelected ? "text-[#7367f0]" : "text-gray-400"} />
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
                          {activeTab !== "ทั้งหมด" && (
                            <span className="text-[10px] text-gray-300 leading-relaxed block mt-0.5">
                              สังกัด: {item.parentHospital}
                            </span>
                          )}
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
                <Building2 className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">ไม่พบหน่วยงานที่ค้นหา</p>
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
