import React from 'react';
import { Filter as FilterIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface FilterProps {
  onFilterSelect: (status: string) => void;
  scope?: string;
}

export default function Filter({ onFilterSelect, scope = 'appointment' }: FilterProps) {
  
  const renderMenuItems = () => {
      if (scope === 'refer') {
          return (
              <>
                  <DropdownMenuItem onClick={() => onFilterSelect('all')}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('pending_receive')}>รอรับตัว</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('waiting_exam')}>รอตรวจ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('examined')}>ตรวจแล้ว</DropdownMenuItem>
              </>
          );
      }

      if (scope === 'homevisit') {
          return (
              <>
                  <DropdownMenuItem onClick={() => onFilterSelect('all')}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('waiting')}>รอเยี่ยม</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('in_progress')}>กำลังเยี่ยม</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('completed')}>เสร็จสิ้น</DropdownMenuItem>
              </>
          );
      }

      if (scope === 'telemed') {
          return (
              <>
                  <DropdownMenuItem onClick={() => onFilterSelect('all')}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('waiting')}>รอสาย</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('completed')}>เสร็จสิ้น</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('cancelled')} className="text-red-600">ยกเลิก</DropdownMenuItem>
              </>
          );
      }
      
      // Strict Appointment Filter (Pending, Confirmed, Completed only)
      if (scope === 'appointment_strict') {
          return (
              <>
                  <DropdownMenuItem onClick={() => onFilterSelect('all')}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('waiting')}>รอตรวจ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('confirmed')}>ยืนยันแล้ว</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFilterSelect('completed')}>เสร็จสิ้น</DropdownMenuItem>
              </>
          );
      }
      
      // Default (Appointment)
      return (
          <>
            <DropdownMenuItem onClick={() => onFilterSelect('all')}>ทั้งหมด</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterSelect('waiting')}>รอตรวจ</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterSelect('confirmed')}>ยืนยันแล้ว</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterSelect('completed')}>เสร็จสิ้น</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterSelect('cancelled')} className="text-red-600">ยกเลิก</DropdownMenuItem>
          </>
      );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <FilterIcon size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {renderMenuItems()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}