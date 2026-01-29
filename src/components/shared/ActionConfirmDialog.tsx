import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  FileText
} from 'lucide-react';
import { cn } from '../ui/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: any;
  onConfirm?: () => void;
  onReschedule?: () => void;
  onRequestFund?: () => void;
  onRecordTreatment?: () => void;
  onCancel?: () => void;
  onContactPatient?: () => void;
  onOpenVisitForm?: () => void;
}

export default function ActionConfirmDialog({ isOpen, onClose, appointment: propAppointment, onConfirm, onReschedule, onRequestFund, onRecordTreatment, onCancel, onContactPatient, onOpenVisitForm }: ConfirmModalProps) {
  if (!isOpen) return null;

  // Mock Data matching the design (Fallback if no prop provided)
  const defaultAppointment = {
    patientName: "นางสาว มุ่งมั่น ทำดี",
    hn: "66012346",
    age: "20 ปี",
    type: "Follow-up",
    date: "4 ธันวาคม 2568",
    time: "11:00 - 12:00",
    startTime: "11:00",
    endTime: "12:00",
    hospital: "โรงพยาบาลมหาราชนครเชียงใหม่",
    room: "ห้องตรวจ 1",
    treatment: "ติดตามอาการ",
    doctor: "ปนัดดา",
    note: "ระบุรายละเอียดการนัดหมาย"
  };

  const data = { ...defaultAppointment, ...propAppointment };

  // Helper to safely get data if structure varies
  const displayData = {
      patientName: data.name || data.patientName,
      hn: data.hn,
      age: data.age,
      type: data.type,
      date: data.date,
      time: data.time,
      hospital: data.hospital,
      room: data.room,
      treatment: data.treatment,
      doctor: data.doctor,
      note: data.note,
      status: data.status
  };

  const isConfirmed = ['checked-in', 'referred', 'confirmed'].includes(displayData.status);
  const isMissed = displayData.status === 'missed';

  const getLeftButtonText = () => {
      if (isMissed) return 'ยกเลิก';
      if (isConfirmed) return 'ขอทุน';
      if (displayData.type === 'Joint Visit') return 'นำทาง';
      if (displayData.type === 'Telemed') return 'ขอยกเลิก';
      return 'เลื่อนนัดหมาย';
  }

  const getRightButtonText = () => {
      if (isMissed) return 'ติดต่อผู้ป่วย';
      if (isConfirmed) return 'บันทึกการรักษา';
      if (displayData.type === 'Joint Visit') return 'กรอกฟอร์ม';
      if (displayData.type === 'Telemed') return 'เข้าร่วมประชุม';
      return 'ยืนยันการรักษา';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[380px] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="pt-6 px-6 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1e1b4b] text-[16px]">
                {displayData.type === 'Joint Visit' ? 'รายละเอียดนัดหมาย' : 'รายละเอียดการนัดหมาย'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-slate-100"
            >
              <X size={24} />
            </button>
        </div>

        <div className="p-6 space-y-6">
            
            {/* Patient Card */}
            <div className={cn(
                "p-5 rounded-[28px] border shadow-sm transition-colors",
                ['Referred', 'Refer In', 'รับตัว'].includes(displayData.type)
                    ? "bg-orange-50 border-orange-200"
                    : displayData.type === 'Joint Visit'
                        ? "bg-green-50 border-green-200"
                        : displayData.type === 'Telemed'
                            ? "bg-pink-50 border-pink-200"
                            : "bg-blue-50 border-blue-200"
            )}>
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
                            {(data as any).medicalCondition || "Cleft Lip - left - microform"}
                        </p>
                    </div>

                    {displayData.type === 'Referred' ? (
                        <div className="text-[#5B5E91] text-[14px] font-bold">
                            Refer In จาก {displayData.hospital || "รพ.สต.บ้านดอย"}
                        </div>
                    ) : !['Joint Visit', 'Telemed'].includes(displayData.type) ? (
                        ['Referred', 'Refer In', 'รับตัว'].includes(displayData.type) ? (
                            <div className="text-[#EA580C] text-[14px] font-bold">
                                Refer In จาก {displayData.hospital || "รพ.สต.บ้านดอย"}
                            </div>
                        ) : (
                            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-blue-100 text-[#2F80ED] text-[12px] font-bold shadow-sm">
                                ห้องตรวจ : {displayData.room || "ห้องตรวจ 1"}
                            </div>
                        )
                    ) : (
                        displayData.type === 'Joint Visit' ? (
                            <div className="flex flex-col gap-3 mt-1 w-full">

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
                                {(data as any).channel === 'hospital' ? (
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

            {/* Appointment Info */}
            <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className="h-10 w-10 bg-[#EEF2FF] rounded-full flex items-center justify-center text-[#4F46E5] shrink-0">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">วันที่นัดหมาย</p>
                        <p className="text-slate-800 font-bold text-sm">{displayData.date}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className="h-10 w-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#EA580C] shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">เวลานัดหมาย</p>
                        <p className="text-slate-800 font-bold text-sm">{displayData.time}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button 
                    onClick={() => {
                        if (isMissed) {
                            if (onCancel) onCancel();
                        } else {
                             if (onReschedule) onReschedule();
                        }
                        onClose();
                    }}
                    className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-slate-600 font-bold hover:bg-gray-50 transition-colors"
                >
                    {isMissed ? 'ยกเลิก' : 'เลื่อนนัดหมาย'}
                </button>
                <button 
                    onClick={() => {
                        if (displayData.type === 'Joint Visit') {
                            if (onOpenVisitForm) onOpenVisitForm();
                        } else if (isMissed) {
                            if (onContactPatient) onContactPatient();
                        } else if (isConfirmed) {
                            if (onRecordTreatment) onRecordTreatment();
                        } else {
                            if (onConfirm) onConfirm();
                        }
                        onClose();
                    }}
                    className={cn(
                        "flex-1 py-3 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center",
                        displayData.type === 'Joint Visit' 
                            ? "bg-[#7367f0] hover:bg-[#685dd8] text-white shadow-md"
                            : "bg-[#4D45A4] text-white hover:bg-[#3d3685] shadow-[#4d45a4]/20"
                    )}
                >
                    {displayData.type === 'Joint Visit' && <FileText className="w-4 h-4 mr-2" />}
                    {getRightButtonText()}
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}
