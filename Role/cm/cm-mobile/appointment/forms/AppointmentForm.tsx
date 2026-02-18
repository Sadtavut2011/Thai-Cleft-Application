import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, FileText, ChevronLeft, Stethoscope, MapPin, Home, Minus, Search, ChevronRight } from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";
import { PATIENTS_DATA } from '../../../../../data/patientData';
import { RoomSelector } from '../../patient/RoomSelector';
import { TreatmentSelector } from '../../patient/TreatmentSelector';
import { MedicSelector } from '../../patient/medicSelector';
import { HospitalSelector } from '../../patient/hospitalSelector';
import { AcceptAppointDialog } from '../AcceptAppointDialog';

const toISODateString = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const toTimeString = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

interface AppointmentFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialDate?: string;
  initialPatient?: any;
  isEditMode?: boolean;
}

export default function AppointmentForm({ onClose, onSubmit, initialDate, initialPatient, isEditMode = false }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: initialDate || (() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    })(),
    startTime: '08:00',
    endTime: '12:00',
    location: 'โรงพยาบาลฝาง',
    assignedRoom: '', // Renamed from 'room' to avoid conflict
    treatment: '',
    doctor: '',
    reason: '',
    recorder: 'สภัคศิริ สุวิวัฒนา' // Mocked current user
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [showTreatmentSelector, setShowTreatmentSelector] = useState(false);
  const [showMedicSelector, setShowMedicSelector] = useState(false);
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);

  useEffect(() => {
    if (initialPatient) {
        setFormData(prev => ({
            ...prev,
            patientId: initialPatient.patientId || initialPatient.id,
            patientName: initialPatient.name,
            ...(isEditMode ? {
                date: initialPatient.date || prev.date,
                startTime: initialPatient.startTime || initialPatient.time?.split('-')[0]?.trim() || prev.startTime,
                endTime: initialPatient.endTime || initialPatient.time?.split('-')[1]?.trim() || prev.endTime,
                location: initialPatient.location || initialPatient.hospital || prev.location,
                assignedRoom: initialPatient.room || prev.assignedRoom,
                treatment: initialPatient.treatment || initialPatient.type || prev.treatment,
                doctor: initialPatient.doctor || prev.doctor,
                reason: initialPatient.note || initialPatient.reason || prev.reason,
            } : {})
        }));
        setSearchTerm(initialPatient.name);
    } else if (initialDate) {
         setFormData(prev => ({ ...prev, date: initialDate }));
    }
  }, [initialPatient, initialDate, isEditMode]);

  const patientsSource = PATIENTS_DATA.map(p => ({
    id: p.id, // Use internal ID for matching with AppointmentSystem
    hn: p.hn, // Keep HN for display and search
    name: p.name,
    original: p
  }));

  const filteredPatients = patientsSource.filter(p => 
    p.name.includes(searchTerm) || 
    (p.hn && p.hn.includes(searchTerm)) || 
    p.id.includes(searchTerm)
  );

  const handleSubmit = () => {
    if (!formData.patientId) {
        alert('กรุณาเลือกผู้ป่วย');
        return;
    }
    if (!formData.date || !formData.startTime || !formData.endTime) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    // Construct data object to match expected format
    const submissionData = {
        patientId: formData.patientId,
        patientName: formData.patientName,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        time: `${formData.startTime} - ${formData.endTime}`,
        location: formData.location,
        room: formData.assignedRoom, // Map internal name to external expectation
        selectedRoom: formData.assignedRoom, // Explicit field
        treatment: formData.treatment,
        doctor: formData.doctor,
        reason: formData.reason,
        recorder: formData.recorder
    };
    
    onSubmit(submissionData);
  };

  const inputStyle = "h-[50px] bg-white border border-slate-200 rounded-xl focus-visible:ring-[#7066a9] text-[15px] transition-colors pl-11 text-slate-600 font-medium";
  const iconStyle = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4D45A4]";
  const labelStyle = "text-[16px] font-bold text-[#1e1b4b] mb-2 block";

  // Format date for display if needed, but input[type='date'] handles ISO YYYY-MM-DD
  // The image shows "15 สิงหาคม 2565", but native date input shows system format.
  // We'll stick to native input for functionality.

  return (
    <div className="fixed inset-0 z-[100] h-[100dvh] w-full bg-white flex flex-col overflow-hidden font-['IBM_Plex_Sans_Thai']">
      {/* CSS Hack to hide mobile bottom navigation */}
      <style>{`
        .fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
            display: none !important;
        }
      `}</style>
      {/* Header */}
      <div className="bg-[#7066a9] shrink-0 z-20 shadow-sm">
          <StatusBarIPhone16Main />
          <div className="h-[64px] px-4 flex items-center gap-3">
              <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
                  <ChevronLeft size={24} />
              </button>
              <h1 className="text-white text-lg font-bold">{isEditMode ? "รายละเอียดนัดหมาย" : "สร้างนัดหมายใหม่"}</h1>
          </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto no-scrollbar px-5 pt-6 pb-32">
            <div className="space-y-6">

                {/* 0. Patient Search */}
                <div>
                    <Label className={labelStyle}>ค้นหาผู้ป่วย</Label>
                    <div className="relative">
                        <Input 
                            value={searchTerm} 
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (e.target.value === '') {
                                    setFormData(prev => ({ ...prev, patientId: '', patientName: '' }));
                                }
                            }}
                            placeholder="ค้นหาชื่อ หรือ HN..." 
                            className="px-4 h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm peer border-[#7367f0]"
                        />
                        {/* Dropdown Results */}
                        <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl mt-2 z-50 hidden peer-focus:block hover:block max-h-60 overflow-y-auto">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map(p => (
                                    <div 
                                        key={p.id}
                                        className="px-4 py-4 hover:bg-slate-50 cursor-pointer text-base text-[#5e5873] border-b border-slate-50 last:border-0"
                                        onMouseDown={(e) => {
                                            e.preventDefault(); 
                                            setFormData(prev => ({ ...prev, patientId: p.id, patientName: p.name }));
                                            setSearchTerm(p.name);
                                        }}
                                    >
                                        {p.name} (HN: {p.hn || p.id})
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-4 text-base text-slate-400 text-center">ไม่พบข้อมูล</div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* 1. Date */}
                <div>
                    <Label className={labelStyle}>วันที่นัดหมาย *</Label>
                    <AcceptAppointDialog
                        mode="date"
                        initialDate={(() => {
                            if (!formData.date) return new Date();
                            const [y, m, d] = formData.date.split('-').map(Number);
                            return new Date(y, m - 1, d);
                        })()}
                        title="เลือกวันที่นัดหมาย"
                        description="เลือกวันที่ที่ต้องการนัดหมาย"
                        confirmLabel="ยืนยันวันที่"
                        onSave={(date, details) => {
                             const dateStr = toISODateString(date);
                             // Keep existing time or default if needed
                             setFormData(prev => ({
                                 ...prev,
                                 date: dateStr,
                             }));
                        }}
                        trigger={
                            <div className="relative cursor-pointer">
                                <Calendar className={`${iconStyle} z-10`} />
                                <div className={`${inputStyle} flex items-center`}>
                                    {formData.date ? (
                                        <span>
                                            {(() => {
                                                const [y, m, d] = formData.date.split('-');
                                                return `${d}/${m}/${parseInt(y) + 543}`;
                                            })()}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">วว/ดด/ปปปป</span>
                                    )}
                                </div>
                            </div>
                        }
                    />
                </div>

                {/* 2. Time */}
                <div>
                    <Label className={labelStyle}>เวลา</Label>
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                             <AcceptAppointDialog
                                mode="time"
                                initialDate={(() => {
                                    if (!formData.date) return new Date();
                                    const [y, m, d] = formData.date.split('-').map(Number);
                                    const date = new Date(y, m - 1, d);
                                    if (formData.startTime) {
                                        const [h, min] = formData.startTime.split(':').map(Number);
                                        date.setHours(h);
                                        date.setMinutes(min);
                                    }
                                    return date;
                                })()}
                                title="ระบุเวลานัดหมาย"
                                description="ระบุเวลาเริ่มต้น"
                                confirmLabel="ยืนยันเวลา"
                                onSave={(date, details) => {
                                     const timeStr = toTimeString(date);
                                     setFormData(prev => ({ ...prev, startTime: timeStr }));
                                }}
                                trigger={
                                    <div className="relative cursor-pointer">
                                        <Clock className={iconStyle} />
                                        <div className={`${inputStyle} flex items-center`}>
                                            {formData.startTime}
                                        </div>
                                    </div>
                                }
                             />
                        </div>
                        <div className="text-slate-300">
                            <Minus size={24} />
                        </div>
                        <div className="relative flex-1">
                             <AcceptAppointDialog
                                mode="time"
                                initialDate={(() => {
                                    if (!formData.date) return new Date();
                                    const [y, m, d] = formData.date.split('-').map(Number);
                                    const date = new Date(y, m - 1, d);
                                    if (formData.endTime) {
                                        const [h, min] = formData.endTime.split(':').map(Number);
                                        date.setHours(h);
                                        date.setMinutes(min);
                                    }
                                    return date;
                                })()}
                                title="ระบุเวลาสิ้นสุด"
                                description="ระบุเวลาสิ้นสุดการนัดหมาย"
                                confirmLabel="ยืนยันเวลา"
                                onSave={(date, details) => {
                                     const timeStr = toTimeString(date);
                                     setFormData(prev => ({ ...prev, endTime: timeStr }));
                                }}
                                trigger={
                                    <div className="relative cursor-pointer">
                                        <Clock className={iconStyle} />
                                        <div className={`${inputStyle} flex items-center`}>
                                            {formData.endTime}
                                        </div>
                                    </div>
                                }
                             />
                        </div>
                    </div>
                </div>

                {/* 3. Hospital */}
                <div>
                    <Label className={labelStyle}>โรงพยาบาล</Label>
                    <div onClick={() => setShowHospitalSelector(true)} className="relative cursor-pointer">
                        <MapPin className={iconStyle} />
                        <div className={`${inputStyle} flex items-center ${!formData.location ? 'text-slate-400 font-normal' : ''}`}>
                            {formData.location || "เลือกโรงพยาบาล"}
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>

                {/* 4. Room */}
                <div>
                    <Label className={labelStyle}>ห้องตรวจ</Label>
                    <div onClick={() => setShowRoomSelector(true)} className="relative cursor-pointer">
                        <Home className={iconStyle} />
                        <div className={`${inputStyle} flex items-center ${!formData.assignedRoom ? 'text-slate-400 font-normal' : ''}`}>
                            {formData.assignedRoom || "ระบุห้องตรวจ"}
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>

                {/* 5. Treatment */}
                <div>
                    <Label className={labelStyle}>การรักษา</Label>
                    <div onClick={() => setShowTreatmentSelector(true)} className="relative cursor-pointer">
                        <Stethoscope className={iconStyle} />
                        <div className={`${inputStyle} flex items-center ${!formData.treatment ? 'text-slate-400 font-normal' : ''}`}>
                            {formData.treatment || "ระบุการรักษา"}
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>

                {/* 6. Doctor */}
                <div>
                    <Label className={labelStyle}>ชื่อผู้ที่รักษา</Label>
                    <div onClick={() => setShowMedicSelector(true)} className="relative cursor-pointer">
                        <User className={iconStyle} />
                        <div className={`${inputStyle} flex items-center bg-slate-50/50 ${!formData.doctor ? 'text-slate-400 font-normal' : ''}`}>
                            {formData.doctor || "ระบุแพทย์"}
                        </div>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>

                {/* 7. Note */}
                <div>
                    <Label className={labelStyle}>รายละเอียดการนัดหมาย</Label>
                    <Textarea 
                        value={formData.reason} 
                        onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                        placeholder="ใบนัดหมาย" 
                        className="min-h-[120px] bg-slate-50/50 border border-slate-200 rounded-xl focus-visible:ring-[#7066a9] text-[15px] transition-colors resize-none p-4"
                    />
                </div>

                {/* 8. Recorder (Read Only) */}
                <div>
                    <Label className={labelStyle}>ผู้บันทึกข้อมูล</Label>
                    <div className="relative">
                        <User className={iconStyle} />
                        <Input 
                            value={formData.recorder} 
                            readOnly
                            className={`${inputStyle} bg-slate-50 text-slate-500`}
                        />
                    </div>
                </div>

            </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-slate-100 bg-white">
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    onClick={onClose} 
                    className={`flex-1 h-[52px] rounded-xl border-slate-200 text-[16px] font-bold ${
                        isEditMode 
                            ? "text-red-600 border-red-200 hover:bg-red-50" 
                            : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    ยกเลิก
                </Button>
                <Button 
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="flex-1 h-[52px] rounded-xl bg-[#4D45A4] hover:bg-[#3d3685] text-white shadow-lg shadow-[#4d45a4]/20 text-[16px] font-bold"
                >
                    บันทึกข้อมูล
                </Button>
            </div>
      </div>

      {/* Selectors */}
      {showRoomSelector && (
        <RoomSelector
            initialSelected={formData.assignedRoom}
            onBack={() => setShowRoomSelector(false)}
            onSave={(val) => {
                setFormData(prev => ({ ...prev, assignedRoom: val }));
                setShowRoomSelector(false);
            }}
        />
      )}
      {showTreatmentSelector && (
        <TreatmentSelector
            initialSelected={formData.treatment}
            onBack={() => setShowTreatmentSelector(false)}
            onSave={(val) => {
                setFormData(prev => ({ ...prev, treatment: val }));
                setShowTreatmentSelector(false);
            }}
        />
      )}
      {showMedicSelector && (
        <MedicSelector
            initialSelected={formData.doctor}
            onBack={() => setShowMedicSelector(false)}
            onSave={(val) => {
                setFormData(prev => ({ ...prev, doctor: val }));
                setShowMedicSelector(false);
            }}
        />
      )}
      {showHospitalSelector && (
        <HospitalSelector
            initialSelected={formData.location}
            onBack={() => setShowHospitalSelector(false)}
            onSave={(val) => {
                setFormData(prev => ({ ...prev, location: val }));
                setShowHospitalSelector(false);
            }}
        />
      )}
    </div>
  );
}