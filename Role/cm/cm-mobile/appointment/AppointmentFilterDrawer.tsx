import React, { useState, useRef, useCallback } from 'react';
import { cn } from '../../../../components/ui/utils';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '../../../../components/ui/drawer';
import {
  Filter,
  X,
  Check,
  Search,
  DoorOpen,
  Activity,
  Syringe,
  Scan,
  Scissors,
  Smile,
  MessageCircle,
  FileText,
} from 'lucide-react';

// ===== Data from RoomSelector =====
interface RoomOption {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: 'door' | 'activity' | 'syringe' | 'scan';
}

const ROOM_OPTIONS: RoomOption[] = [
  { id: 'r1', label: 'ห้องตรวจ 1 (OPD)', description: 'ห้องตรวจผู้ป่วยนอก ชั้น 1 อาคาร A', category: 'OPD', icon: 'door' },
  { id: 'r2', label: 'ห้องตรวจ 2 (OPD)', description: 'ห้องตรวจผู้ป่วยนอก ชั้น 1 อาคาร A', category: 'OPD', icon: 'door' },
  { id: 'r3', label: 'ห้องตรวจ 3 (OPD)', description: 'ห้องตรวจเฉพาะทาง ชั้น 2 อาคาร B', category: 'OPD', icon: 'door' },
  { id: 'r4', label: 'ER 1 (ฉุกเฉิน)', description: 'ห้องฉุกเฉิน รับผู้ป่วยตลอด 24 ชั่วโมง', category: 'ER', icon: 'activity' },
  { id: 'r5', label: 'OR 1 (ผ่าตัด)', description: 'ห้องผ่าตัดใหญ่ ชั้น 3 อาคารศัลยกรรม', category: 'OR', icon: 'syringe' },
  { id: 'r6', label: 'IPD Ward 4 (ผู้ป่วยใน)', description: 'หอผู้ป่วยใน ชั้น 4 อาคาร C', category: 'IPD', icon: 'door' },
  { id: 'r7', label: 'ห้องรังสีวินิจฉัย', description: 'แผนกรังสีวิทยา ชั้น 1 อาคาร B', category: 'OPD', icon: 'scan' },
  { id: 'r8', label: 'ห้องเจาะเลือด', description: 'ห้องปฏิบัติการ ชั้น 1 อาคาร A', category: 'OPD', icon: 'syringe' },
];

const ROOM_CATEGORIES = ["ทั้งหมด", "OPD", "IPD", "ER", "OR"];

// ===== Data from TreatmentSelector =====
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

const TREATMENT_CATEGORIES = ["ทั้งหมด", "การผ่าตัด", "ทันตกรรม", "ฝึกพูด", "อื่นๆ"];

// ===== Icon Helpers =====
const getRoomIcon = (type: string, isSelected: boolean) => {
  const color = isSelected ? "text-[#7367f0]" : "text-gray-400";
  const size = 16;
  switch (type) {
    case 'door': return <DoorOpen size={size} className={color} />;
    case 'activity': return <Activity size={size} className={color} />;
    case 'syringe': return <Syringe size={size} className={color} />;
    case 'scan': return <Scan size={size} className={color} />;
    default: return <DoorOpen size={size} className={color} />;
  }
};

const getTreatmentIcon = (type: string, isSelected: boolean) => {
  const color = isSelected ? "text-[#7367f0]" : "text-gray-400";
  const size = 16;
  switch (type) {
    case 'scissors': return <Scissors size={size} className={color} />;
    case 'smile': return <Smile size={size} className={color} />;
    case 'message': return <MessageCircle size={size} className={color} />;
    case 'file': return <FileText size={size} className={color} />;
    default: return <FileText size={size} className={color} />;
  }
};

// ===== Filter State Types =====
export interface FilterState {
  rooms: string[];
  treatments: string[];
}

interface AppointmentFilterDrawerProps {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  trigger?: React.ReactNode;
}

type TabKey = 'room' | 'treatment';

export function AppointmentFilterDrawer({ filters, onApply, trigger }: AppointmentFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('room');
  
  // Local filter state (applied only on confirm)
  const [localRooms, setLocalRooms] = useState<string[]>(filters.rooms);
  const [localTreatments, setLocalTreatments] = useState<string[]>(filters.treatments);

  // Sub-tabs for room/treatment categories
  const [roomCat, setRoomCat] = useState("ทั้งหมด");
  const [treatmentCat, setTreatmentCat] = useState("ทั้งหมด");
  const [roomSearch, setRoomSearch] = useState("");
  const [treatmentSearch, setTreatmentSearch] = useState("");

  // Drag scroll refs
  const tabScrollRef = useRef<HTMLDivElement>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const handleDragStart = useCallback((ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    dragStartX.current = pageX - (ref.current?.offsetLeft || 0);
    dragScrollLeft.current = ref.current?.scrollLeft || 0;
  }, []);

  const handleDragMove = useCallback((ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !ref.current) return;
    if ('preventDefault' in e && 'pageX' in e) e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - (ref.current.offsetLeft || 0);
    const walk = (x - dragStartX.current) * 1.5;
    ref.current.scrollLeft = dragScrollLeft.current - walk;
  }, []);

  const handleDragEnd = useCallback(() => { isDragging.current = false; }, []);

  // When drawer opens, sync local state
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalRooms([...filters.rooms]);
      setLocalTreatments([...filters.treatments]);
      setRoomSearch("");
      setTreatmentSearch("");
      setRoomCat("ทั้งหมด");
      setTreatmentCat("ทั้งหมด");
    }
    setOpen(isOpen);
  };

  const handleClearAll = () => {
    setLocalRooms([]);
    setLocalTreatments([]);
  };

  const handleApply = () => {
    onApply({
      rooms: localRooms,
      treatments: localTreatments,
    });
    setOpen(false);
  };

  const toggleRoom = (label: string) => {
    setLocalRooms(prev => prev.includes(label) ? prev.filter(r => r !== label) : [...prev, label]);
  };

  const toggleTreatment = (label: string) => {
    setLocalTreatments(prev => prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]);
  };

  const hasAnyFilter = localRooms.length > 0 || localTreatments.length > 0;
  const activeFilterCount = localRooms.length + localTreatments.length;

  // Tab data
  const TABS: { key: TabKey; label: string; count: number }[] = [
    { key: 'room', label: 'ห้องตรวจ', count: localRooms.length },
    { key: 'treatment', label: 'การรักษา', count: localTreatments.length },
  ];

  // Filtered room/treatment lists
  const filteredRooms = ROOM_OPTIONS.filter(item => {
    const matchesCat = roomCat === "ทั้งหมด" || item.category === roomCat;
    const matchesSearch = !roomSearch || item.label.toLowerCase().includes(roomSearch.toLowerCase()) || item.description.toLowerCase().includes(roomSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredTreatments = TREATMENT_OPTIONS.filter(item => {
    const matchesCat = treatmentCat === "ทั้งหมด" || item.category === treatmentCat;
    const matchesSearch = !treatmentSearch || item.label.toLowerCase().includes(treatmentSearch.toLowerCase()) || item.description.toLowerCase().includes(treatmentSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Group items
  const groupedRooms = roomCat === "ทั้งหมด"
    ? ROOM_CATEGORIES.filter(c => c !== "ทั้งหมด").map(cat => ({ category: cat, items: filteredRooms.filter(i => i.category === cat) })).filter(g => g.items.length > 0)
    : [{ category: roomCat, items: filteredRooms }];

  const groupedTreatments = treatmentCat === "ทั้งหมด"
    ? TREATMENT_CATEGORIES.filter(c => c !== "ทั้งหมด").map(cat => ({ category: cat, items: filteredTreatments.filter(i => i.category === cat) })).filter(g => g.items.length > 0)
    : [{ category: treatmentCat, items: filteredTreatments }];

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        {trigger || (
          <button className="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0 shadow-sm text-slate-500">
            <Filter className="w-5 h-5" />
          </button>
        )}
      </DrawerTrigger>

      <DrawerContent className="z-[50000] max-h-[90vh] h-[85vh] flex flex-col">
        {/* Accessible title & description (visually hidden) */}
        <DrawerTitle className="sr-only">ตัวกรอง (Filter)</DrawerTitle>
        <DrawerDescription className="sr-only">กรองรายการนัดหมายตามวันที่ ห้องตรวจ และการรักษา</DrawerDescription>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7367f0]/10 flex items-center justify-center">
                <Filter className="w-5 h-5 text-[#7367f0]" />
              </div>
              <span className="text-lg font-bold text-[#5e5873]">ตัวกรอง (Filter)</span>
            </div>
            <div className="flex items-center gap-2">
              {hasAnyFilter && (
                <button
                  onClick={handleClearAll}
                  className="text-[14px] font-medium text-[#7367f0] hover:text-[#685dd8] px-2 py-1 rounded-lg hover:bg-[#7367f0]/5 transition-colors"
                >
                  ล้างค่า
                </button>
              )}
              <DrawerClose asChild>
                <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </DrawerClose>
            </div>
          </div>

          {/* Tab Pills */}
          <div
            ref={tabScrollRef}
            className="flex gap-2 mt-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleDragStart(tabScrollRef) as any}
            onMouseMove={handleDragMove(tabScrollRef) as any}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart(tabScrollRef) as any}
            onTouchMove={handleDragMove(tabScrollRef) as any}
            onTouchEnd={handleDragEnd}
          >
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5",
                  activeTab === tab.key
                    ? "bg-[#7367f0] text-white shadow-md shadow-indigo-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={cn(
                    "min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center",
                    activeTab === tab.key ? "bg-white/25 text-white" : "bg-[#7367f0] text-white"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {/* ===== Tab: ห้องตรวจ ===== */}
          {activeTab === 'room' && (
            <div className="flex flex-col h-full min-h-0">
              <div className="p-4 pb-2 space-y-3 shrink-0">
                {/* Search */}
                <div className="relative">
                  <Input
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                    placeholder="ค้นหาห้องตรวจ..."
                    className="h-11 rounded-xl border-gray-200 bg-[#F3F4F6] pl-10 text-[14px]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {/* Category pills */}
                <div
                  ref={catScrollRef}
                  className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none pb-1"
                  onMouseDown={handleDragStart(catScrollRef) as any}
                  onMouseMove={handleDragMove(catScrollRef) as any}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart(catScrollRef) as any}
                  onTouchMove={handleDragMove(catScrollRef) as any}
                  onTouchEnd={handleDragEnd}
                >
                  {ROOM_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setRoomCat(cat)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all shrink-0 border",
                        roomCat === cat
                          ? "bg-[#7367f0] text-white border-[#7367f0]"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room list */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="space-y-4">
                  {groupedRooms.map(group => (
                    <div key={group.category}>
                      {roomCat === "ทั้งหมด" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-4 rounded-full bg-[#7367f0]" />
                          <span className="text-[13px] font-bold text-[#5e5873]">{group.category}</span>
                          <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{group.items.length}</span>
                        </div>
                      )}
                      <div className="space-y-1.5">
                        {group.items.map(item => {
                          const isSelected = localRooms.includes(item.label);
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleRoom(item.label)}
                              className={cn(
                                "p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border",
                                isSelected
                                  ? "bg-[#F4F6FF] border-[#7367f0]/30"
                                  : "bg-white border-transparent hover:bg-gray-50"
                              )}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-[#7367f0]/10" : "bg-gray-100"
                              )}>
                                {getRoomIcon(item.icon, isSelected)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={cn("text-[14px] font-medium block truncate", isSelected ? "text-[#7367f0]" : "text-[#120d26]")}>
                                  {item.label}
                                </span>
                                <span className="text-[11px] text-gray-400 block truncate">{item.description}</span>
                              </div>
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                                isSelected ? "bg-[#7367f0] border-[#7367f0]" : "bg-white border-gray-300"
                              )}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {filteredRooms.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <DoorOpen className="w-10 h-10 mb-2 opacity-30" />
                      <p className="text-[13px]">ไม่พบห้องตรวจ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== Tab: การรักษา ===== */}
          {activeTab === 'treatment' && (
            <div className="flex flex-col h-full min-h-0">
              <div className="p-4 pb-2 space-y-3 shrink-0">
                {/* Search */}
                <div className="relative">
                  <Input
                    value={treatmentSearch}
                    onChange={(e) => setTreatmentSearch(e.target.value)}
                    placeholder="ค้นหาการรักษา..."
                    className="h-11 rounded-xl border-gray-200 bg-[#F3F4F6] pl-10 text-[14px]"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {/* Category pills */}
                <div
                  className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none pb-1"
                >
                  {TREATMENT_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setTreatmentCat(cat)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all shrink-0 border",
                        treatmentCat === cat
                          ? "bg-[#7367f0] text-white border-[#7367f0]"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Treatment list */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="space-y-4">
                  {groupedTreatments.map(group => (
                    <div key={group.category}>
                      {treatmentCat === "ทั้งหมด" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-4 rounded-full bg-[#7367f0]" />
                          <span className="text-[13px] font-bold text-[#5e5873]">{group.category}</span>
                          <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{group.items.length}</span>
                        </div>
                      )}
                      <div className="space-y-1.5">
                        {group.items.map(item => {
                          const isSelected = localTreatments.includes(item.label);
                          return (
                            <div
                              key={item.id}
                              onClick={() => toggleTreatment(item.label)}
                              className={cn(
                                "p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border",
                                isSelected
                                  ? "bg-[#F4F6FF] border-[#7367f0]/30"
                                  : "bg-white border-transparent hover:bg-gray-50"
                              )}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-[#7367f0]/10" : "bg-gray-100"
                              )}>
                                {getTreatmentIcon(item.icon, isSelected)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={cn("text-[14px] font-medium block", isSelected ? "text-[#7367f0]" : "text-[#120d26]")}>
                                  {item.label}
                                </span>
                                <span className="text-[11px] text-gray-400 block mt-0.5 line-clamp-1">{item.description}</span>
                              </div>
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                                isSelected ? "bg-[#7367f0] border-[#7367f0]" : "bg-white border-gray-300"
                              )}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {filteredTreatments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <Scissors className="w-10 h-10 mb-2 opacity-30" />
                      <p className="text-[13px]">ไม่พบรายการรักษา</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer: Apply button */}
        <div className="p-4 border-t bg-white shrink-0">
          <div className="w-full max-w-md mx-auto flex gap-3">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1 h-12 text-base rounded-xl">ยกเลิก</Button>
            </DrawerClose>
            <Button
              className="flex-1 bg-[#7367f0] hover:bg-[#685dd8] text-white h-12 text-base shadow-md shadow-indigo-200 rounded-xl"
              onClick={handleApply}
            >
              ยืนยัน {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}