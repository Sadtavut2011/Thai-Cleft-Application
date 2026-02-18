import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { cn } from '../ui/utils';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerTitle, DrawerDescription } from '../ui/drawer';

// ===== Thai Date Helpers =====
const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const THAI_MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const THAI_DAY_HEADERS = ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'];
const THAI_DAY_NAMES = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];

export function formatThaiDateShort(date: Date): string {
  const d = date.getDate();
  const m = THAI_MONTHS_SHORT[date.getMonth()];
  const y = (date.getFullYear() + 543) % 100;
  return `${d} ${m} ${y}`;
}

export function formatThaiDateWithDay(date: Date): string {
  const dayName = THAI_DAY_NAMES[date.getDay()];
  return `วัน${dayName}ที่ ${formatThaiDateShort(date)}`;
}

// Default date: 4 ธ.ค. 68 (Dec 4, 2025)
export const DEFAULT_FILTER_DATE = new Date(2025, 11, 4);

// ===== Thai Calendar Component =====
interface ThaiCalendarProps {
  selected: Date | null;
  onSelect: (date: Date | null) => void;
  accentColor?: string;
}

export function ThaiCalendar({ selected, onSelect, accentColor = '#7367f0' }: ThaiCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const buddhistYear = viewYear + 543;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return selected.getDate() === day && selected.getMonth() === viewMonth && selected.getFullYear() === viewYear;
  };
  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  };

  const handleDayClick = (day: number) => {
    // Toggle: if clicking the already-selected date, deselect (show all)
    if (isSelected(day)) {
      onSelect(null);
    } else {
      onSelect(new Date(viewYear, viewMonth, day));
    }
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-[16px] font-medium text-[#5e5873]">
          {THAI_MONTHS[viewMonth]} {buddhistYear}
        </span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-2">
        {THAI_DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[13px] text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center py-1">
            {day !== null ? (
              <button
                onClick={() => handleDayClick(day)}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-[15px] transition-all duration-150",
                  isSelected(day)
                    ? "text-white shadow-md"
                    : isToday(day)
                    ? "bg-gray-100 text-[#5e5873]"
                    : "text-[#5e5873] hover:bg-gray-50"
                )}
                style={isSelected(day) ? { backgroundColor: accentColor, boxShadow: `0 4px 6px -1px ${accentColor}40` } : undefined}
              >
                {day}
              </button>
            ) : <div className="w-9 h-9" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Calendar Filter Button + Drawer =====
interface CalendarFilterButtonProps {
  filterDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  accentColor?: string;
  drawerTitle?: string;
}

export function CalendarFilterButton({ filterDate, onDateSelect, accentColor = '#7367f0', drawerTitle = 'กรองวันที่' }: CalendarFilterButtonProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | null) => {
    onDateSelect(date);
    setCalendarOpen(false);
  };

  const isActive = filterDate !== null;

  return (
    <Drawer open={calendarOpen} onOpenChange={setCalendarOpen}>
      <DrawerTrigger asChild>
        <button
          className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm relative",
            isActive
              ? "bg-[#49358E] text-white border border-[#49358E] hover:bg-[#37286A]"
              : "bg-white border border-gray-200 text-slate-500 hover:bg-slate-50"
          )}
        >
          <Calendar className="w-5 h-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="font-['IBM_Plex_Sans_Thai']">
        <div className="mx-auto w-full max-w-lg px-4 pb-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ebe9fd] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#7367f0]" />
              </div>
              <DrawerTitle className="text-[18px] font-semibold text-[#5e5873]">{drawerTitle}</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">เลือกวันที่เพื่อกรองรายการ กดวันที่เดิมอีกครั้งเพื่อแสดงทั้งหมด</DrawerDescription>
          {/* Hint text */}
          <p className="text-[13px] text-gray-400 text-center mb-2">กดวันที่เดิมอีกครั้งเพื่อแสดงทั้งหมด</p>
          <ThaiCalendar selected={filterDate} onSelect={handleDateSelect} accentColor={accentColor} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

// ===== Date Label Component =====
interface DateFilterLabelProps {
  filterDate: Date | null;
}

export function DateFilterLabel({ filterDate }: DateFilterLabelProps) {
  return (
    <div className="flex items-center gap-3 px-1 py-1">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-[15px] text-[#b4b7bd] whitespace-nowrap">
        {filterDate ? formatThaiDateWithDay(filterDate) : 'แสดงทุกวัน'}
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}