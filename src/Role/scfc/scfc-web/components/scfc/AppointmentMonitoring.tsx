import React from 'react';
import { Calendar } from 'lucide-react';

export function AppointmentMonitoring() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Calendar size={18} className="text-teal-600" />
        การนัดหมายวันนี้
      </h3>
      <div className="flex items-center gap-4 text-center">
        <div className="flex-1 p-3 bg-teal-50 rounded-lg border border-teal-100">
            <div className="text-2xl font-black text-teal-700">45</div>
            <div className="text-xs font-medium text-teal-600">นัดทั้งหมด</div>
        </div>
        <div className="flex-1 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-2xl font-black text-blue-700">32</div>
            <div className="text-xs font-medium text-blue-600">มาตรวจแล้ว</div>
        </div>
        <div className="flex-1 p-3 bg-rose-50 rounded-lg border border-rose-100">
            <div className="text-2xl font-black text-rose-700">3</div>
            <div className="text-xs font-medium text-rose-600">ไม่มาตามนัด</div>
        </div>
      </div>
    </div>
  );
}
