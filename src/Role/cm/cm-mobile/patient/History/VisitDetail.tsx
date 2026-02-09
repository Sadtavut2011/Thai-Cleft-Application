import React from 'react';
import {
  ArrowLeft,
  Calendar,
  User,
  Home,
  FileText,
  MapPin
} from 'lucide-react';
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";

interface VisitDetailProps {
  visit: any;
  patient: any;
  onBack: () => void;
}

export const VisitDetail: React.FC<VisitDetailProps> = ({ visit, patient, onBack }) => {
  if (!visit) return null;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 fixed inset-0 z-[50000] overflow-hidden">

      {/* Header */}
      <div className="bg-white shrink-0 z-20 shadow-sm">
        <StatusBarIPhone16Main />
        <div className="h-[64px] px-4 flex items-center gap-3">
          <button onClick={onBack} className="text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-slate-800 text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดการเยี่ยม</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto p-4 pb-24 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

        {/* Patient Info Summary */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
            {patient?.name ? patient.name.charAt(0) : <User size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{patient?.name || 'ไม่ระบุชื่อ'}</h3>
            <p className="text-sm text-slate-500">HN: {patient?.hn || '-'}</p>
          </div>
        </div>

        {/* Date & Type Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
          <div className="flex items-center gap-3 text-slate-700">
            <Calendar className="text-[#7066a9]" size={20} />
            <div>
              <span className="text-xs text-slate-400 block">วันที่เยี่ยม</span>
              <span className="font-semibold">{visit.date}</span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-slate-100"></div>
          <div className="flex items-center gap-3 text-slate-700">
            <Home className="text-[#7066a9]" size={20} />
            <div>
              <span className="text-xs text-slate-400 block">ประเภทการเยี่ยม</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${visit.type === 'เยี่ยมบ้าน' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                {visit.type}
              </span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-slate-100"></div>
          <div className="flex items-center gap-3 text-slate-700">
            <User className="text-[#7066a9]" size={20} />
            <div>
              <span className="text-xs text-slate-400 block">ผู้ให้บริการ</span>
              <span className="font-semibold">{visit.provider || '-'}</span>
            </div>
          </div>
        </div>

        {/* Detail Info */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="text-[#7066a9]" size={22} />
            <h3 className="font-bold text-lg text-slate-800">ข้อมูลการเยี่ยม</h3>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-600">หัวข้อการเยี่ยม</span>
            <p className="text-slate-800 font-medium bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              {visit.title || '-'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-600">รายละเอียด / ผลการเยี่ยม</span>
            <p className="text-slate-600 leading-relaxed text-sm">
              {visit.detail || 'ไม่มีรายละเอียดเพิ่มเติม'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
