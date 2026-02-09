import React from 'react';
import { MapPin } from 'lucide-react';

export function HomeVisitMonitoring() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[300px] relative">
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <MapPin size={16} className="text-teal-600" />
          ติดตามการเยี่ยมบ้าน (Live)
        </h3>
        <p className="text-xs text-slate-500">ทีมลงพื้นที่ปัจจุบัน: 4 ทีม</p>
      </div>
      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm font-medium">Map Visualization Placeholder</p>
      </div>
    </div>
  );
}
