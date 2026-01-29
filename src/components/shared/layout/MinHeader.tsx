import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface MinHeaderProps {
  onBack?: () => void;
  title?: string;
  rightContent?: React.ReactNode;
}

export const MinHeader = ({ onBack, title, rightContent }: MinHeaderProps) => {
  return (
    <div className="relative box-border content-stretch flex items-center justify-between px-[16px] py-[12px] w-full">
      {onBack ? (
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-white hover:text-white/80 transition-colors z-50"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="font-['IBM_Plex_Sans_Thai'] text-[18px] font-medium">สร้างคำขอเยี่ยมบ้าน</span>
        </button>
      ) : (
        <p className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] leading-[1.5] not-italic relative shrink-0 text-[20px] text-center text-nowrap text-white whitespace-pre">{title || "งานของฉัน"}</p>
      )}
      {rightContent}
    </div>
  );
};
