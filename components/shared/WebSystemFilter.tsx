import React, { useState } from 'react';
import { Filter, X, Check, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '../ui/utils';

// Reuse the same types from SystemFilterDrawer for consistency
export interface FilterListOption {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
}

export interface FilterTabConfig {
  key: string;
  label: string;
  type: 'list';
  options?: FilterListOption[];
  categories?: string[];
  searchPlaceholder?: string;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
}

export interface GenericFilterState {
  [key: string]: string[];
}

interface WebSystemFilterProps {
  tabs: FilterTabConfig[];
  filters: GenericFilterState;
  onApply: (filters: GenericFilterState) => void;
  title?: string;
}

export function WebSystemFilter({
  tabs,
  filters,
  onApply,
  title = 'ตัวกรอง (Filter)',
}: WebSystemFilterProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');
  const [localFilters, setLocalFilters] = useState<GenericFilterState>({});
  const [searchStates, setSearchStates] = useState<Record<string, string>>({});
  const [catStates, setCatStates] = useState<Record<string, string>>({});

  // Sync on open
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      const cloned: GenericFilterState = {};
      for (const tab of tabs) {
        const val = filters[tab.key];
        cloned[tab.key] = Array.isArray(val) ? [...val] : [];
      }
      setLocalFilters(cloned);
      const cats: Record<string, string> = {};
      const srch: Record<string, string> = {};
      tabs.forEach(t => { cats[t.key] = 'ทั้งหมด'; srch[t.key] = ''; });
      setCatStates(cats);
      setSearchStates(srch);
    }
    setOpen(isOpen);
  };

  const toggleListItem = (tabKey: string, label: string) => {
    setLocalFilters(prev => {
      const arr = Array.isArray(prev[tabKey]) ? [...prev[tabKey]] : [];
      const idx = arr.indexOf(label);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(label);
      return { ...prev, [tabKey]: arr };
    });
  };

  const handleClearAll = () => {
    const cleared: GenericFilterState = {};
    tabs.forEach(t => { cleared[t.key] = []; });
    setLocalFilters(cleared);
  };

  const handleApply = () => {
    onApply({ ...localFilters });
    setOpen(false);
  };

  const getTabCount = (tab: FilterTabConfig): number => {
    const val = localFilters[tab.key];
    return Array.isArray(val) ? val.length : 0;
  };

  const totalCount = tabs.reduce((sum, t) => sum + getTabCount(t), 0);
  // Count from actual applied filters
  const appliedCount = tabs.reduce((sum, t) => {
    const val = filters[t.key];
    return sum + (Array.isArray(val) ? val.length : 0);
  }, 0);

  const renderListTab = (tab: FilterTabConfig) => {
    const options = tab.options || [];
    const categories = tab.categories || ['ทั้งหมด'];
    const activeCat = catStates[tab.key] || 'ทั้งหมด';
    const searchQ = searchStates[tab.key] || '';
    const selectedItems = Array.isArray(localFilters[tab.key]) ? localFilters[tab.key] : [];

    const filtered = options.filter(item => {
      const matchesCat = activeCat === 'ทั้งหมด' || item.category === activeCat;
      const matchesSearch = !searchQ ||
        item.label.toLowerCase().includes(searchQ.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQ.toLowerCase());
      return matchesCat && matchesSearch;
    });

    const catsWithoutAll = categories.filter(c => c !== 'ทั้งหมด');
    const grouped = activeCat === 'ทั้งหมด'
      ? catsWithoutAll.map(cat => ({ category: cat, items: filtered.filter(i => i.category === cat) })).filter(g => g.items.length > 0)
      : [{ category: activeCat, items: filtered }];

    const showGroups = catsWithoutAll.length > 0;
    const flatFiltered = showGroups ? undefined : [{ category: '', items: filtered }];

    return (
      <div className="flex flex-col min-h-0">
        {tab.searchPlaceholder !== undefined && (
          <div className="relative mb-3">
            <Input
              value={searchQ}
              onChange={(e) => setSearchStates(prev => ({ ...prev, [tab.key]: e.target.value }))}
              placeholder={tab.searchPlaceholder || 'ค้นหา...'}
              className="h-9 rounded-lg border-gray-200 bg-[#F3F4F6] pl-9 text-[13px]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>
        )}
        {categories.length > 1 && (
          <div className="flex gap-1.5 mb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCatStates(prev => ({ ...prev, [tab.key]: cat }))}
                className={cn(
                  "px-3 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-all shrink-0 border",
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
        <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200">
          {(flatFiltered || grouped).map(group => (
            <div key={group.category}>
              {showGroups && activeCat === 'ทั้งหมด' && group.category && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-0.5 h-3.5 rounded-full bg-[#7367f0]" />
                  <span className="text-[12px] font-bold text-[#5e5873]">{group.category}</span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded-full">{group.items.length}</span>
                </div>
              )}
              <div className="space-y-1">
                {group.items.map(item => {
                  const isSelected = selectedItems.includes(item.label);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleListItem(tab.key, item.label)}
                      className={cn(
                        "px-3 py-2 rounded-lg flex items-center gap-2.5 cursor-pointer transition-all border",
                        isSelected
                          ? "bg-[#F4F6FF] border-[#7367f0]/30"
                          : "bg-white border-transparent hover:bg-gray-50"
                      )}
                    >
                      {item.icon && (
                        <div className={cn(
                          "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                          isSelected ? "bg-[#7367f0]/10" : "bg-gray-100"
                        )}>
                          {item.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className={cn("text-[13px] font-medium block truncate", isSelected ? "text-[#7367f0]" : "text-[#120d26]")}>
                          {item.label}
                        </span>
                        {item.description && (
                          <span className="text-[11px] text-gray-400 block truncate">{item.description}</span>
                        )}
                      </div>
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 border transition-colors",
                        isSelected ? "bg-[#7367f0] border-[#7367f0]" : "bg-white border-gray-300"
                      )}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              {tab.emptyIcon || <Search className="w-8 h-8 mb-1.5 opacity-30" />}
              <p className="text-[12px]">{tab.emptyText || 'ไม่พบรายการ'}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-[40px] gap-2 border-gray-200 shadow-sm relative",
            appliedCount > 0
              ? "bg-[#7367f0]/5 border-[#7367f0]/30 text-[#7367f0] hover:bg-[#7367f0]/10"
              : "bg-white text-gray-600 hover:bg-gray-50"
          )}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">ตัวกรอง</span>
          {appliedCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#7367f0] text-white text-[11px] font-bold flex items-center justify-center">
              {appliedCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end" side="bottom" sideOffset={8}>
        <div className="flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#7367f0]/10 flex items-center justify-center">
                  <Filter className="w-4 h-4 text-[#7367f0]" />
                </div>
                <span className="text-[15px] font-bold text-[#5e5873]">{title}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {totalCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-[13px] font-medium text-[#7367f0] hover:text-[#685dd8] px-2 py-1 rounded-lg hover:bg-[#7367f0]/5 transition-colors"
                  >
                    ล้างค่า
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab Pills */}
            <div className="flex gap-1.5 mt-3">
              {tabs.map(tab => {
                const count = getTabCount(tab);
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-1.5",
                      activeTab === tab.key
                        ? "bg-[#7367f0] text-white shadow-md shadow-indigo-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={cn(
                        "min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center",
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
          <div className="p-4">
            {tabs.map(tab => {
              if (activeTab !== tab.key) return null;
              return <div key={tab.key}>{renderListTab(tab)}</div>;
            })}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex gap-2.5">
            <Button
              variant="outline"
              className="flex-1 h-9 text-[13px] rounded-lg"
              onClick={() => setOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button
              className="flex-1 bg-[#7367f0] hover:bg-[#685dd8] text-white h-9 text-[13px] shadow-md shadow-indigo-200 rounded-lg"
              onClick={handleApply}
            >
              ยืนยัน {totalCount > 0 && `(${totalCount})`}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
