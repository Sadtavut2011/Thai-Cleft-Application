import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, List, LayoutGrid } from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';

// Helper: Date → YYYY-MM-DD (local safe)
function toISODateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Helper: format month/year in Thai
function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
}

export interface CalendarSubTab {
  value: string;
  label: string;
}

export interface WebCalendarViewProps {
  items: any[];
  dateField: string;
  themeColor: string;
  countLabel?: string;
  onDateSelect: (date: string | null) => void;
  selectedDate: string | null;
  subTabs?: CalendarSubTab[];
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
  itemFilter?: (item: any) => boolean;
}

export function WebCalendarView({
  items,
  dateField,
  themeColor,
  countLabel = 'รายการ',
  onDateSelect,
  selectedDate,
  subTabs,
  activeSubTab,
  onSubTabChange,
  itemFilter,
}: WebCalendarViewProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Build calendar grid (Monday start)
  const days = useMemo(() => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const result: Date[] = [];
    let d = new Date(startDate);
    while (d <= endOfMonth || result.length % 7 !== 0) {
      result.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return result;
  }, [currentMonth]);

  // Count items per day
  const countsPerDay = useMemo(() => {
    const map = new Map<string, number>();
    const filtered = itemFilter ? items.filter(itemFilter) : items;
    filtered.forEach(item => {
      const dateValue = item[dateField];
      if (!dateValue) return;
      const dateKey = String(dateValue).split('T')[0];
      map.set(dateKey, (map.get(dateKey) || 0) + 1);
    });
    return map;
  }, [items, dateField, itemFilter]);

  const changeMonth = (amount: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  const todayStr = toISODateString(today);
  const bgColor = themeColor;
  const bgColorLight = themeColor + '18';

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Calendar Header — compact */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50/40">
        <div className="flex items-center gap-1.5">
          <button onClick={() => changeMonth(-1)} className="p-1 rounded text-gray-400 hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[#5e5873] font-bold text-[13px] min-w-[130px] text-center select-none">
            {formatMonthYear(currentMonth)}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 rounded text-gray-400 hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* ทั้งหมด / วันนี้ */}
          <div className="bg-gray-100 p-0.5 rounded-md inline-flex items-center ml-1.5">
            <button
              onClick={() => onDateSelect(null)}
              className={cn(
                "px-2.5 py-[3px] text-[12px] font-medium rounded transition-all",
                !selectedDate ? "bg-white shadow-sm text-[#5e5873]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => onDateSelect(todayStr)}
              className={cn(
                "px-2.5 py-[3px] text-[12px] font-medium rounded transition-all",
                selectedDate === todayStr ? "bg-white shadow-sm text-[#5e5873]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              วันนี้
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        {subTabs && subTabs.length > 0 && (
          <div className="flex items-center p-0.5 bg-gray-100 rounded-md">
            {subTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => onSubTabChange?.(tab.value)}
                className={cn(
                  "px-3 py-[3px] text-[12px] font-medium rounded transition-all",
                  activeSubTab === tab.value
                    ? "bg-white shadow-sm text-[#5e5873]"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Calendar Grid — compact, centered */}
      <div className="px-4 py-3 max-w-[520px] mx-auto">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center mb-1">
          {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map(day => (
            <div key={day} className="py-1 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-[3px]">
          {days.map((day, index) => {
            const dateString = toISODateString(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = dateString === todayStr;
            const isSelected = dateString === selectedDate;
            const count = countsPerDay.get(dateString) || 0;

            return (
              <button
                key={index}
                onClick={() => {
                  if (!isCurrentMonth) return;
                  onDateSelect(selectedDate === dateString ? null : dateString);
                }}
                disabled={!isCurrentMonth}
                className={cn(
                  "h-[46px] rounded-lg flex flex-col items-center justify-center transition-all",
                  !isCurrentMonth && "text-gray-200 cursor-not-allowed",
                  isCurrentMonth && !isSelected && "hover:bg-gray-50 text-[#5e5873]",
                  isSelected && "text-white shadow-md"
                )}
                style={{
                  ...(isSelected ? { backgroundColor: bgColor } : {}),
                  ...(isToday && !isSelected ? { boxShadow: `inset 0 0 0 1.5px ${bgColor}` } : {})
                }}
              >
                <span
                  className={cn(
                    "text-[13px] font-bold leading-none",
                    isSelected && "text-white"
                  )}
                  style={isToday && !isSelected ? { color: bgColor } : undefined}
                >
                  {day.getDate()}
                </span>
                {count > 0 && isCurrentMonth && (
                  <span
                    className={cn(
                      "text-[9px] font-semibold mt-0.5 px-1 py-[1px] rounded-full leading-none",
                      isSelected && "bg-white/90"
                    )}
                    style={
                      isSelected
                        ? { color: bgColor }
                        : { color: bgColor, backgroundColor: bgColorLight }
                    }
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Toggle button — compact, matches filter bar height */
export function ViewModeToggle({
  viewMode,
  onChange,
}: {
  viewMode: 'list' | 'calendar';
  onChange: (mode: 'list' | 'calendar') => void;
}) {
  return (
    <div className="bg-[#f0eff4] p-[3px] rounded-lg inline-flex items-center h-[38px]">
      <button
        onClick={() => onChange('list')}
        className={cn(
          "h-full px-2 flex items-center justify-center rounded-md transition-all duration-150",
          viewMode === 'list'
            ? "bg-white shadow-sm text-[#7367f0]"
            : "text-[#b4b0c7] hover:text-[#8a82b5]"
        )}
        title="มุมมองรายการ"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('calendar')}
        className={cn(
          "h-full px-2 flex items-center justify-center rounded-md transition-all duration-150",
          viewMode === 'calendar'
            ? "bg-white shadow-sm text-[#7367f0]"
            : "text-[#b4b0c7] hover:text-[#8a82b5]"
        )}
        title="มุมมองปฏิทิน"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
}
