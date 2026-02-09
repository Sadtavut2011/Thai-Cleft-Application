import React from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  ChevronRight,
  ClipboardList
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
  onRequestRefer?: () => void; // New prop for Refer Patient
  onViewHistory?: () => void;
  onViewDetail?: () => void;
  role?: string;
}

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    appointment: propAppointment, 
    onConfirm, 
    onReschedule, 
    onRequestFund, 
    onRecordTreatment, 
    onCancel, 
    onContactPatient, 
    onOpenVisitForm,
    onRequestRefer,
    onViewHistory,
    onViewDetail,
    role
}: ConfirmModalProps) {
  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

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
      status: data.status?.toLowerCase() || '',
      medicalCondition: (data as any).medicalCondition || "Cleft Lip - left - microform"
  };

  const isConfirmed = ['checked-in', 'confirmed', 'accepted'].includes(displayData.status);
  const isCompleted = ['completed', 'treated'].includes(displayData.status);
  const isMissed = ['missed', 'cancelled', 'rejected'].includes(displayData.status);
  const isWaiting = ['waiting', 'pending', 'waiting-doctor', 'waiting_staff'].includes(displayData.status);
  const isReferral = ['Referred', 'Refer In', 'Refer Out', 'รับตัว'].includes(displayData.type);
  const isReferPending = ['pending', 'referred'].includes(displayData.status);
  const isReferAccepted = ['accepted', 'confirmed'].includes(displayData.status);
  const isReferReceived = ['received', 'waiting_doctor'].includes(displayData.status);
  const isHomeVisit = ['Home Visit', 'Joint Visit', 'Routine', 'Delegated', 'ฝากเยี่ยม', 'Joint', 'เยี่ยมร่วม'].includes(displayData.type);
  const isInProgress = ['inprogress', 'in_progress'].includes(displayData.status);

  // --- COMPLETED STATE LAYOUT ---
  if (isCompleted) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[380px] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden relative">
           
           {/* Header */}
           <div className="pt-6 px-6 pb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1e1b4b] text-[18px]">
                  บันทึกการรักษาเรียบร้อย
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={24} />
              </button>
          </div>

          <div className="p-6 space-y-4">
             {/* Patient Card (Conditional Style) */}
             <div 
                 onClick={() => {
                    if (onViewDetail) {
                        onViewDetail();
                        onClose();
                    }
                 }}
                 className={cn(
                 "p-5 rounded-[28px] border shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]",
                 isReferral 
                    ? "bg-[#fff7ed] border-orange-200" 
                    : isHomeVisit
                        ? "bg-[#f0fdf4] border-green-200"
                        : displayData.type === 'Telemed'
                            ? "bg-pink-50 border-pink-200"
                            : "bg-[#ecf4ff] border-blue-200"
             )}>
                <div className="flex flex-col min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[18px] font-bold text-[#2F80ED] leading-tight truncate pr-2">
                            {displayData.patientName}
                        </h3>
                        <div className="flex items-center text-slate-400 gap-0.5 shrink-0 hover:text-slate-600 transition-colors">
                            <span className="text-[12px]">ดูรายละเอียด</span>
                            <ChevronRight size={14} />
                        </div>
                    </div>

                    <div className="flex gap-4 mb-3">
                        <p className="text-[#64748B] text-[13px] font-medium">
                            HN : {displayData.hn}
                        </p>
                        <p className="text-[#64748B] text-[13px] font-medium">
                            อายุ {displayData.age.replace(' ปี', '')} ปี
                        </p>
                    </div>
                    <p className="text-[#334155] font-bold text-base mb-4 truncate text-[15px]">
                        {displayData.medicalCondition}
                    </p>
                    
                    {isReferral ? (
                        <div className="text-[#EA580C] text-[14px] font-bold">
                            {displayData.type === 'Refer Out' ? 'Refer Out ไปยัง ' : 'Refer In จาก '} 
                            {displayData.hospital || "รพ.สต.บ้านดอย"}
                        </div>
                    ) : isHomeVisit ? (
                         <div className="flex flex-col gap-1 mt-1 w-full">
                             <p className="text-[#64748B] text-[13px] font-medium">หน่วยงานที่รับผิดชอบ</p>
                             <div className="flex items-center gap-2 text-[#334155] font-bold text-[15px]">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8]"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                 {(data as any).rph || displayData.hospital || "CM อาสาสมัคร"}
                             </div>
                         </div>
                    ) : displayData.type === 'Telemed' ? (
                         <div className="flex flex-col gap-1 mt-1 w-full">
                             <p className="text-[#64748B] text-[13px] font-medium">ช่องทาง</p>
                             <div className={`flex items-center gap-2 font-bold text-[15px] ${(data as any).channel === 'mobile' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                 {(data as any).channel === 'mobile' ? (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                                        Mobile (Direct)
                                    </>
                                 ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                                        Hospital
                                    </>
                                 )}
                             </div>
                         </div>
                    ) : (
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#ecf4ff] border border-blue-100 text-[#2F80ED] text-[14px] font-bold w-full justify-start">
                            ห้องตรวจ : {displayData.room || "ห้องตรวจ 1"}
                        </div>
                    )}
                </div>
             </div>

             {/* Action Menu Items */}
             <div className="space-y-3 pt-2">
                {/* Next Appointment */}
                <button 
                    onClick={() => {
                        if (onReschedule) onReschedule();
                        onClose();
                    }}
                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#4F46E5]">
                            <Calendar size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-[#64748B] text-xs font-medium">นัดหมายถัดไป</p>
                            <p className="text-[#1e293b] font-bold text-[16px]">ลงนัดหมายใหม่</p>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-300" size={24} />
                </button>

                {/* Refer Patient */}
                {role?.toLowerCase() !== 'hospital' && (
                    <button 
                        onClick={() => {
                            if (onRequestRefer) onRequestRefer();
                            // onClose(); // Keep open or close? Usually navigation closes modal
                        }}
                        className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#EA580C]">
                                 <ClipboardList size={24} />
                            </div>
                            <div className="text-left">
                                <p className="text-[#64748B] text-xs font-medium">ส่งตัวผู้ป่วย</p>
                                <p className="text-[#1e293b] font-bold text-[16px]">สร้างใบส่งตัว</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300" size={24} />
                    </button>
                )}
             </div>

             {/* Footer Button */}
             <button 
                onClick={onClose}
                className="w-full py-3.5 bg-[#4D45A4] text-white rounded-xl font-bold text-[16px] shadow-lg shadow-[#4d45a4]/20 hover:bg-[#3d3685] transition-colors mt-4"
             >
                เสร็จสิ้น
             </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // --- DEFAULT STATE LAYOUT (Waiting / Confirmed / Missed) ---

  const getLeftButtonText = () => {
      if (displayData.type === 'Telemed') return 'ประวัติผู้ป่วย';
      if (isHomeVisit) return 'ประวัติผู้ป่วย';
      if (isReferral && (isReferPending || isReferAccepted || isReferReceived)) return 'ประวัติผู้ป่วย';
      if (isMissed) return 'ยกเลิก'; // or Close?
      return 'ประวัติผู้ป่วย';
  }

  const getRightButtonText = () => {
      if (displayData.type === 'Telemed') return 'เข้าร่วมประชุม';
      if (isHomeVisit) {
          if (isInProgress) return 'บันทึกผล';
          return 'ยืนยันการเยี่ยม';
      }
      if (isMissed) return 'ติดต่อผู้ป่วย'; // Logic for missed
      if (isReferral) {
          if (isReferPending) return 'ยืนยันการรับตัว';
          if (isReferAccepted) return 'ยืนยันรับตัว';
          if (isReferReceived) return 'บันทึกการรักษา';
      }
      if (isConfirmed) return 'บันทึกการรักษา';
      if (isWaiting) return 'ยืนยันการรักษา';
      
      // Fallback logic
      if (displayData.type === 'Joint Visit') return 'กรอกฟอร์ม';
      if (displayData.type === 'Telemed') return 'เข้าร่วมประชุม';
      return 'ยืนยัน';
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[380px] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="pt-6 px-6 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1e1b4b] text-[20px]">
                รายละเอียดการนัดหมาย
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
             <div 
                onClick={() => {
                    if (onViewDetail) {
                        onViewDetail();
                        onClose();
                    }
                }}
                className={cn(
                 "p-5 rounded-[28px] border shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-[0.98]",
                 isReferral 
                    ? "bg-[#fff7ed] border-orange-200" // Orange for Refer
                    : (isHomeVisit || displayData.type === 'Joint')
                        ? "bg-[#f0fdf4] border-green-200" // Green for Home Visit
                        : displayData.type === 'Telemed'
                            ? "bg-pink-50 border-pink-200"
                            : "bg-[#ecf4ff] border-blue-200" // Blue for Appointment
             )}>
                 <div className="flex flex-col min-w-0">
                     <div>
                         <div className="flex justify-between items-center mb-1">
                             <h3 className="text-[20px] font-bold text-[#2F80ED] leading-tight truncate pr-2">
                                 {displayData.patientName}
                             </h3>
                             <div className="flex items-center text-slate-400 gap-0.5 shrink-0 hover:text-slate-600 transition-colors">
                                <span className="text-[12px]">ดูรายละเอียด</span>
                                <ChevronRight size={14} />
                             </div>
                         </div>
                         <div className="flex gap-4 mb-3">
                             <p className="text-[#64748B] text-[16px] font-medium">
                                 HN : {displayData.hn}
                             </p>
                             <p className="text-[#64748B] text-[16px] font-medium">
                                 อายุ {displayData.age.replace(' ปี', '')} ปี
                             </p>
                         </div>
                         
                         <p className="text-[#334155] font-bold text-base mb-4 truncate text-[16px]">
                             {displayData.medicalCondition}
                         </p>
                     </div>

                     {/* Content based on Type */}
                     {isReferral ? (
                         <div className="text-[#EA580C] text-[16px] font-bold">
                             {displayData.type === 'Refer Out' ? 'Refer Out ไปยัง ' : 'Refer In จาก '} 
                             {displayData.hospital || "รพ.สต.บ้านดอย"}
                         </div>
                     ) : (isHomeVisit || displayData.type === 'Joint') ? (
                         <div className="flex flex-col gap-1 mt-1 w-full">
                             <p className="text-[#64748B] text-[14px] font-medium">หน่วยงานที่รับผิดชอบ</p>
                             <div className="flex items-center gap-2 text-[#334155] font-bold text-[16px]">
                                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8]"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                 {(data as any).rph || displayData.hospital || "CM อาสาสมัคร"}
                             </div>
                         </div>
                     ) : displayData.type === 'Telemed' ? (
                         <div className="flex flex-col gap-1 mt-1 w-full">
                             <p className="text-[#64748B] text-[14px] font-medium">ช่องทาง</p>
                             <div className={`flex items-center gap-2 font-bold text-[16px] ${(data as any).channel === 'mobile' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                 {(data as any).channel === 'mobile' ? (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                                        Mobile (Direct)
                                    </>
                                 ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                                        Hospital
                                    </>
                                 )}
                             </div>
                         </div>
                     ) : (
                         // Default Appointment (Blue)
                         <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-blue-100 text-[#2F80ED] text-[14px] font-bold shadow-sm w-fit">
                             {displayData.room || "1"}
                         </div>
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
                        <p className="text-xs text-slate-500 font-medium mb-0.5 text-[16px]">วันที่นัดหมาย</p>
                        <p className="text-slate-800 font-bold text-sm text-[20px]">
                            {(() => {
                                const d = new Date(displayData.date);
                                return !isNaN(d.getTime()) 
                                    ? d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
                                    : displayData.date;
                            })()}
                        </p>
                    </div>
                </div>
                 <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className="h-10 w-10 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#EA580C] shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5 text-[16px]">เวลานัดหมาย</p>
                        <p className="text-slate-800 font-bold text-sm text-[20px]">{displayData.time}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {displayData.type === 'Telemed' ? (
                <div className="pt-2 w-full text-left">
                     <label className="text-xs text-slate-400 block mb-1">Meeting Link</label>
                     <a 
                        href={(data as any).meetingLink || 'https://zoom.us/j/123456789'} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:underline break-all block text-[16px] font-medium"
                     >
                         {(data as any).meetingLink || 'https://zoom.us/j/123456789'}
                     </a>
                </div>
            ) : (
            <div className="flex gap-3 pt-2">
                <button 
                    onClick={() => {
                        if (displayData.type === 'Telemed') {
                             if (onViewHistory) onViewHistory();
                             onClose();
                             return;
                        }

                        if (isReferral && (isReferPending || isReferAccepted)) {
                            if (onViewHistory) onViewHistory();
                            onClose();
                            return;
                        }

                        if (isMissed) {
                            if (onCancel) onCancel();
                        } else {
                             if (onViewHistory) onViewHistory();
                        }
                        onClose();
                    }}
                    className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-slate-600 font-bold hover:bg-gray-50 transition-colors"
                >
                    {getLeftButtonText()}
                </button>
                <button 
                    onClick={() => {
                        if (displayData.type === 'Telemed') {
                             if (onConfirm) onConfirm();
                             onClose();
                             return;
                        }

                        if (isHomeVisit) {
                             if (isInProgress) {
                                 // "บันทึกผล" -> Open Form
                                 if (onOpenVisitForm) {
                                     onOpenVisitForm();
                                 }
                             } else {
                                 // "ยืนยันการเยี่ยม" -> Confirm
                                 if (onConfirm) onConfirm();
                             }
                             onClose();
                             return;
                        }

                        if (isReferral) {
                             if (isReferPending) {
                                 if (onConfirm) onConfirm();
                             } else if (isReferAccepted) {
                                 // Now moves to 'received' state
                                 if (onConfirm) onConfirm();
                             } else if (isReferReceived) {
                                 if (onRecordTreatment) onRecordTreatment();
                             }
                             onClose();
                             return;
                        }

                        if (isConfirmed) {
                             if (onRecordTreatment) onRecordTreatment();
                        } else if (isWaiting) {
                             if (onConfirm) onConfirm();
                        } else if (isMissed) {
                             if (onContactPatient) onContactPatient();
                        } else {
                             // Default fallback
                             if (onConfirm) onConfirm();
                        }
                        
                        onClose();
                    }}
                    className={cn(
                        "flex-1 py-3 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center",
                        "bg-[#4D45A4] text-white hover:bg-[#3d3685] shadow-[#4d45a4]/20"
                    )}
                >
                    {getRightButtonText()}
                </button>
            </div>
            )}

        </div>
      </div>
    </div>,
    document.body
  );
}
