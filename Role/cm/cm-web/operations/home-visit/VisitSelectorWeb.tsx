import React, { useState } from 'react';
import { Search, Check, ArrowLeft, Save, ClipboardList, FileText, Stethoscope, Baby } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { cn } from "../../../../../components/ui/utils";

interface VisitSelectorWebProps {
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

export function VisitSelectorWeb({ initialSelected, onSave, onBack }: VisitSelectorWebProps) {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<string>(initialSelected || "");

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
    <div className="w-full min-h-full bg-[#F8F9FA] font-['Montserrat','Noto_Sans_Thai',sans-serif] space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-[6px] shadow-sm border border-[#EBE9F1] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-100 text-[#5e5873]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#7367f0]/10 flex items-center justify-center">
              <ClipboardList size={18} className="text-[#7367f0]" />
            </div>
            <div>
              <h1 className="text-[#5e5873] font-bold text-lg">เลือกฟอร์มเยี่ยมบ้าน</h1>
              <p className="text-xs text-gray-400">เลือกฟอร์มที่เหมาะสมกับภาวะของผู้ป่วย</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#EBE9F1] p-6 max-w-4xl mx-auto min-h-[600px] flex flex-col">

        {/* Search Bar */}
        <div className="relative mb-5">
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาฟอร์ม..." 
            className="h-12 rounded-lg border-gray-200 bg-white text-gray-700 pl-12 focus:ring-[#7367f0] focus:border-[#7367f0] text-base"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-3 mb-6 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0",
                activeTab === cat 
                  ? "bg-[#7367f0] text-white border-[#7367f0] shadow-md shadow-indigo-200" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-grow space-y-6 content-start">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((item) => {
                  const isSelected = selectedItem === item.label;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedItem(isSelected ? "" : item.label)}
                      className={cn(
                        "p-4 rounded-xl flex items-start gap-3 cursor-pointer transition-all border hover:shadow-md",
                        isSelected 
                          ? "bg-[#F4F6FF] border-[#7367f0] shadow-sm" 
                          : "bg-white border-gray-200 hover:border-[#7367f0]"
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
                          "text-sm font-medium leading-relaxed block",
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
                        "w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5",
                        isSelected 
                          ? "bg-[#7367f0] border-[#7367f0]" 
                          : "bg-white border-gray-300"
                      )}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredOptions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ClipboardList className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">ไม่พบฟอร์มที่ค้นหา</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="h-11 px-8 text-gray-600 rounded-lg border-gray-300"
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedItem}
            className={cn(
              "h-11 px-8 rounded-lg gap-2 font-medium",
              selectedItem
                ? "bg-[#7367f0] hover:bg-[#5e54ce] text-white shadow-md shadow-indigo-200"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" /> ยืนยันเลือกฟอร์ม
          </Button>
        </div>
      </div>
    </div>
  );
}