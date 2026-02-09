import React from 'react';
import { ChevronLeft } from 'lucide-react';

export const HomeVisitDetailPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="bg-[#f8fafc] w-full h-full flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="sticky top-0 w-full bg-white h-[60px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-sm border-b border-gray-100">
            <button onClick={onBack} className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-[#37286a] text-lg font-bold">รายละเอียดการเยี่ยมบ้าน</h1>
      </div>

      <div className="p-6 flex flex-col items-center justify-center flex-1 text-slate-400">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📄</span>
          </div>
          <p>รายละเอียดผู้ป่วย (Mock Data)</p>
      </div>
    </div>
  );
};
