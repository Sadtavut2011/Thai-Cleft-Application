import React from 'react';
import { cn } from '../../../components/ui/utils';

interface WebHeaderProps {
  onNavigate?: (page: string) => void;
}

export function WebHeader({ onNavigate }: WebHeaderProps) {
  return (
    <header className="h-[62px] bg-white shadow-[0px_4px_24px_0px_rgba(24,41,47,0.1)] rounded-[6px] px-4 flex items-center justify-end">
      <div className="flex items-center gap-6">
        <a href="#" className="bg-[rgb(91,77,157)] text-white hover:bg-[#7367f0] px-4 py-2 rounded-md text-[16px] font-medium transition-colors">
            Thai Cleft Link
        </a>

        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onNavigate?.("ข้อมูลส่วนตัว")}
        >
          <div className="text-right">
            <p className="text-[#6e6b7b] text-[14px] font-medium leading-none mb-1">Admin User</p>
            <p className="text-[#b9b9c3] text-[12px] leading-none">Admin</p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMG1hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc2OTEyMjE1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
              alt="Admin User" 
              className="w-[38px] h-[38px] rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-[11px] h-[11px] bg-[#28C76F] border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
