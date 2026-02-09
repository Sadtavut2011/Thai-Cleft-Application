import React from 'react';
import { 
  X, 
  Calendar, 
  FileText, // Changed Clock to FileText for "Referral"
  User, 
  ChevronRight
} from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: any;
  onScheduleNext?: () => void;
  onRefer?: () => void;
  onRecordTreatment?: () => void;
}

export default function SuccessModal({ isOpen, onClose, patient, onScheduleNext, onRefer, onRecordTreatment }: SuccessModalProps) {
  if (!isOpen) return null;

  // Fallback data
  const displayData = {
      patientName: patient?.name || "ไม่ระบุชื่อ",
      hn: patient?.hn || "-",
      age: patient?.age || "-",
      type: patient?.type || "-",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[380px] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="pt-6 px-6 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1e1b4b] text-[16px]">บันทึกการรักษาเรียบร้อย</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-slate-100"
            >
              <X size={24} />
            </button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Patient Card */}
            <div className="bg-[#F8FAFC] p-5 rounded-[28px] border border-[#E2E8F0] shadow-sm">
                <div className="flex flex-col min-w-0">
                    <div>
                        <h3 className="text-[18px] font-bold text-[#2F80ED] leading-tight mb-1 truncate">
                            {displayData.patientName}
                        </h3>
                        <div className="flex gap-4 mb-3">
                            <p className="text-[#64748B] text-[13px] font-medium">
                                HN : {displayData.hn}
                            </p>
                            <p className="text-[#64748B] text-[13px] font-medium">
                                อายุ {displayData.age.replace(' ปี', '')} ปี
                            </p>
                        </div>
                        
                        <p className="text-[#334155] font-bold text-base mb-4 truncate text-[15px]">
                            {patient?.medicalCondition || "Cleft Lip - left - microform"}
                        </p>
                    </div>

                    {displayData.type === 'Referred' ? (
                        <div className="text-[#5B5E91] text-[14px] font-bold">
                            Refer In จาก {patient?.hospital || "รพ.สต.บ้านดอย"}
                        </div>
                    ) : !['Joint Visit', 'Telemed'].includes(displayData.type) ? (
                        ['Referred', 'Refer In', 'รับตัว'].includes(displayData.type) ? (
                            <div className="text-[#5B5E91] text-[14px] font-bold">
                                Refer In จาก {patient?.hospital || "รพ.สต.บ้านดอย"}
                            </div>
                        ) : (
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#2F80ED] text-[12px] font-bold shadow-sm">
                                ห้องตรวจ : {patient?.room || "ห้องตรวจ 1"}
                            </div>
                        )
                    ) : (
                        displayData.type === 'Joint Visit' ? (
                            <div className="flex flex-col gap-3 mt-1 w-full">
                                <div>
                                    <p className="text-[#64748B] text-[12px] font-medium mb-1">ประเภทการเยี่ยม</p>
                                    <div className="flex items-center gap-2 text-[#5B5E91] font-bold text-[14px]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                        ลงเยี่ยมพร้อม รพ.สต.
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[#64748B] text-[12px] font-medium mb-1">หน่วยงานที่รับผิดชอบ</p>
                                    <div className="flex items-center gap-2 text-[#475569] font-bold text-[14px]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8]"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                        รพ.สต.ดอนเมือง
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-1 mt-1">
                                <p className="text-[#64748B] text-[12px] font-medium">ช่องทาง</p>
                                {patient?.channel === 'hospital' ? (
                                    <div className="flex items-center gap-2 text-[#334155] font-bold text-[14px]">
                                        <div className="flex items-center justify-center w-6 h-6 rounded text-[#2F80ED]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                                        </div>
                                        ผ่านหน่วยงาน (รพ.สต.)
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-[#334155] font-bold text-[14px]">
                                        <div className="flex items-center justify-center w-6 h-6 rounded text-[#10B981]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                                        </div>
                                        Direct (มือถือผู้ป่วย)
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Actions / Info Rows */}
            <div className="space-y-3">
                {/* Next Appointment */}
                <button 
                    onClick={onScheduleNext}
                    className="w-full flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 transition-colors text-left group"
                >
                    <div className="h-10 w-10 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#4F46E5] shrink-0 group-hover:scale-110 transition-transform">
                        <Calendar size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-slate-500 font-medium mb-0.5">นัดหมายถัดไป</p>
                        <p className="text-slate-800 font-bold text-sm">ลงนัดหมายใหม่</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-[#4F46E5] transition-colors" />
                </button>

                {/* Refer Patient */}
                <button 
                    onClick={displayData.type === 'Telemed' ? onRecordTreatment : onRefer}
                    className="w-full flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:bg-slate-50 transition-colors text-left group"
                >
                    <div className="h-10 w-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#EA580C] shrink-0 group-hover:scale-110 transition-transform">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-slate-500 font-medium mb-0.5">
                            {displayData.type === 'Telemed' ? 'ผลการรักษา' : 'ส่งตัวผู้ป่วย'}
                        </p>
                        <p className="text-slate-800 font-bold text-sm">
                            {displayData.type === 'Telemed' ? 'บันทึกการรักษา' : 'สร้างใบส่งตัว'}
                        </p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-[#EA580C] transition-colors" />
                </button>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 pt-2">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 bg-[#4D45A4] text-white rounded-xl font-bold hover:bg-[#3d3685] transition-colors shadow-lg shadow-[#4d45a4]/20"
                >
                    เสร็จสิ้น
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}