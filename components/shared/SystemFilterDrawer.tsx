import React, { useState, useRef, useCallback } from 'react';
import {
  Filter, X, Calendar as CalendarIcon, Check, Search
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerTitle, DrawerDescription } from '../ui/drawer';
import { Calendar } from '../ui/calendar';
import { cn } from '../ui/utils';
import { th } from 'date-fns/locale';

const THAI_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

function formatThaiDateLong(date: Date): string {
  return date.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

// ===== Generic Filter Option =====
export interface FilterListOption {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
}

// ===== Tab Configuration =====
export interface FilterTabConfig {
  key: string;
  label: string;
  type: 'date' | 'list';
  // List-specific
  options?: FilterListOption[];
  categories?: string[];
  searchPlaceholder?: string;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
}

// ===== Filter State =====
export interface GenericFilterState {
  [key: string]: Date | null | string[];
}

interface SystemFilterDrawerProps {
  tabs: FilterTabConfig[];
  filters: GenericFilterState;
  onApply: (filters: GenericFilterState) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
}

export function SystemFilterDrawer({
  tabs,
  filters,
  onApply,
  trigger,
  title = 'ตัวกรอง (Filter)',
  description = 'กรองรายการ'
}: SystemFilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');

  // Local filter state - mirrors shape of filters prop
  const [localFilters, setLocalFilters] = useState<GenericFilterState>({});

  // Sub-category state per tab
  const [catStates, setCatStates] = useState<Record<string, string>>({});
  const [searchStates, setSearchStates] = useState<Record<string, string>>({});

  // Drag refs
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const makeDragHandlers = (ref: React.RefObject<HTMLDivElement | null>) => ({
    onMouseDown: (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStartX.current = e.pageX - (ref.current?.offsetLeft || 0);
      dragScrollLeft.current = ref.current?.scrollLeft || 0;
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (!isDragging.current || !ref.current) return;
      e.preventDefault();
      const x = e.pageX - (ref.current.offsetLeft || 0);
      ref.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current) * 1.5;
    },
    onMouseUp: () => { isDragging.current = false; },
    onMouseLeave: () => { isDragging.current = false; },
    onTouchStart: (e: React.TouchEvent) => {
      isDragging.current = true;
      dragStartX.current = e.touches[0].pageX - (ref.current?.offsetLeft || 0);
      dragScrollLeft.current = ref.current?.scrollLeft || 0;
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (!isDragging.current || !ref.current) return;
      const x = e.touches[0].pageX - (ref.current.offsetLeft || 0);
      ref.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current) * 1.5;
    },
    onTouchEnd: () => { isDragging.current = false; },
  });

  const tabScrollRef = useRef<HTMLDivElement>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const tabDrag = makeDragHandlers(tabScrollRef);
  const catDrag = makeDragHandlers(catScrollRef);

  // Sync on open
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      const cloned: GenericFilterState = {};
      for (const tab of tabs) {
        const val = filters[tab.key];
        if (tab.type === 'date') {
          cloned[tab.key] = val instanceof Date ? val : null;
        } else {
          cloned[tab.key] = Array.isArray(val) ? [...val] : [];
        }
      }
      setLocalFilters(cloned);
      // Reset search/cat
      const cats: Record<string, string> = {};
      const srch: Record<string, string> = {};
      tabs.forEach(t => { cats[t.key] = 'ทั้งหมด'; srch[t.key] = ''; });
      setCatStates(cats);
      setSearchStates(srch);
    }
    setOpen(isOpen);
  };

  const handleClearAll = () => {
    const cleared: GenericFilterState = {};
    tabs.forEach(t => { cleared[t.key] = t.type === 'date' ? null : []; });
    setLocalFilters(cleared);
  };

  const handleApply = () => {
    onApply({ ...localFilters });
    setOpen(false);
  };

  const toggleListItem = (tabKey: string, label: string) => {
    setLocalFilters(prev => {
      const arr = Array.isArray(prev[tabKey]) ? [...(prev[tabKey] as string[])] : [];
      const idx = arr.indexOf(label);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(label);
      return { ...prev, [tabKey]: arr };
    });
  };

  // Count active filters
  const getTabCount = (tab: FilterTabConfig): number => {
    const val = localFilters[tab.key];
    if (tab.type === 'date') return val ? 1 : 0;
    return Array.isArray(val) ? val.length : 0;
  };

  const totalCount = tabs.reduce((sum, t) => sum + getTabCount(t), 0);
  const hasAnyFilter = totalCount > 0;

  // Render list tab content
  const renderListTab = (tab: FilterTabConfig) => {
    const options = tab.options || [];
    const categories = tab.categories || ['ทั้งหมด'];
    const activeCat = catStates[tab.key] || 'ทั้งหมด';
    const searchQ = searchStates[tab.key] || '';
    const selectedItems = Array.isArray(localFilters[tab.key]) ? (localFilters[tab.key] as string[]) : [];

    const filtered = options.filter(item => {
      const matchesCat = activeCat === 'ทั้งหมด' || item.category === activeCat;
      const matchesSearch = !searchQ ||
        item.label.toLowerCase().includes(searchQ.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQ.toLowerCase());
      return matchesCat && matchesSearch;
    });

    // Group by category
    const catsWithoutAll = categories.filter(c => c !== 'ทั้งหมด');
    const grouped = activeCat === 'ทั้งหมด'
      ? catsWithoutAll.map(cat => ({ category: cat, items: filtered.filter(i => i.category === cat) })).filter(g => g.items.length > 0)
      : [{ category: activeCat, items: filtered }];

    // If no categories defined or only "ทั้งหมด", show flat
    const showGroups = catsWithoutAll.length > 0;
    const flatFiltered = showGroups ? undefined : [{ category: '', items: filtered }];

    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="p-4 pb-2 space-y-3 shrink-0">
          {tab.searchPlaceholder !== undefined && (
            <div className="relative">
              <Input
                value={searchQ}
                onChange={(e) => setSearchStates(prev => ({ ...prev, [tab.key]: e.target.value }))}
                placeholder={tab.searchPlaceholder || 'ค้นหา...'}
                className="h-11 rounded-xl border-gray-200 bg-[#F3F4F6] pl-10 text-[14px]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          )}
          {categories.length > 1 && (
            <div
              ref={catScrollRef}
              className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing select-none pb-1"
              {...catDrag}
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatStates(prev => ({ ...prev, [tab.key]: cat }))}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all shrink-0 border",
                    activeCat === cat
                      ? "bg-[#7367f0] text-white border-[#7367f0]"
                      : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-28 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-4">
            {(flatFiltered || grouped).map(group => (
              <div key={group.category}>
                {showGroups && activeCat === 'ทั้งหมด' && group.category && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 rounded-full bg-[#7367f0]" />
                    <span className="text-[13px] font-bold text-[#5e5873]">{group.category}</span>
                    <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{group.items.length}</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  {group.items.map(item => {
                    const isSelected = selectedItems.includes(item.label);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleListItem(tab.key, item.label)}
                        className={cn(
                          "p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all border",
                          isSelected
                            ? "bg-[#F4F6FF] border-[#7367f0]/30"
                            : "bg-white border-transparent hover:bg-gray-50"
                        )}
                      >
                        {item.icon && (
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            isSelected ? "bg-[#7367f0]/10" : "bg-gray-100"
                          )}>
                            {item.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className={cn("text-[14px] font-medium block truncate", isSelected ? "text-[#7367f0]" : "text-[#120d26]")}>
                            {item.label}
                          </span>
                          {item.description && (
                            <span className="text-[11px] text-gray-400 block truncate">{item.description}</span>
                          )}
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
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                {tab.emptyIcon || <Search className="w-10 h-10 mb-2 opacity-30" />}
                <p className="text-[13px]">{tab.emptyText || 'ไม่พบรายการ'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <DrawerDescription className="sr-only">{description}</DrawerDescription>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7367f0]/10 flex items-center justify-center">
                <Filter className="w-5 h-5 text-[#7367f0]" />
              </div>
              <span className="text-lg font-bold text-[#5e5873]">{title}</span>
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
            {...tabDrag}
          >
            {tabs.map(tab => {
              const count = getTabCount(tab);
              return (
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
                  {count > 0 && (
                    <span className={cn(
                      "min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center",
                      activeTab === tab.key ? "bg-white/25 text-white" : "bg-[#7367f0] text-white"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {tabs.map(tab => {
            if (activeTab !== tab.key) return null;

            if (tab.type === 'date') {
              const selectedDate = localFilters[tab.key] instanceof Date ? (localFilters[tab.key] as Date) : undefined;
              return (
                <div key={tab.key} className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex flex-col items-center p-4 pb-28">
                    {selectedDate && (
                      <div className="w-full max-w-md mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between bg-[#7367f0]/10 rounded-xl px-4 py-3 border border-[#7367f0]/20">
                          <div className="flex items-center gap-2 text-[#7367f0]">
                            <CalendarIcon className="w-4 h-4" />
                            <span className="text-[14px] font-medium">
                              {formatThaiDateLong(selectedDate)}
                            </span>
                          </div>
                          <button
                            onClick={() => setLocalFilters(prev => ({ ...prev, [tab.key]: null }))}
                            className="w-7 h-7 rounded-full bg-[#7367f0]/20 hover:bg-[#7367f0]/30 flex items-center justify-center transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-[#7367f0]" />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => setLocalFilters(prev => ({ ...prev, [tab.key]: d || null }))}
                        className="w-full p-4"
                        classNames={{
                          month: "space-y-4 w-full",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex w-full justify-between",
                          row: "flex w-full mt-2 justify-between",
                          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                          day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-gray-100",
                          day_selected: "bg-[#7367f0] text-white hover:bg-[#7367f0] hover:text-white focus:bg-[#7367f0] focus:text-white",
                          day_today: "bg-gray-100 text-gray-900",
                        }}
                        locale={th}
                        formatters={{
                          formatCaption: (date) => {
                            const year = date.getFullYear() + 543;
                            return `${THAI_MONTHS_FULL[date.getMonth()]} ${year}`;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }

            return <div key={tab.key} className="h-full min-h-0">{renderListTab(tab)}</div>;
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white shrink-0">
          <div className="w-full max-w-md mx-auto flex gap-3">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1 h-12 text-base rounded-xl">ยกเลิก</Button>
            </DrawerClose>
            <Button
              className="flex-1 bg-[#7367f0] hover:bg-[#685dd8] text-white h-12 text-base shadow-md shadow-indigo-200 rounded-xl"
              onClick={handleApply}
            >
              ยืนยัน {totalCount > 0 && `(${totalCount})`}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}