import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, FileText, ChevronLeft, Stethoscope, MapPin, Building2, Search } from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";
import { PATIENTS_DATA } from '../../../../../data/patientData';

interface AppointmentFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialDate?: string;
  initialPatient?: any;
}

export default function AppointmentForm({ onClose, onSubmit, initialDate, initialPatient }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: initialDate || new Date().toISOString().split('T')[0],
    time: '09:00',
    doctor: '',
    department: 'ศัลยกรรมตกแต่ง',
    reason: '',
    type: 'Follow-up',
    location: 'โรงพยาบาลมหาราชนครเชียงใหม่'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientResults, setShowPatientResults] = useState(false);

  useEffect(() => {
    if (initialPatient) {
      setFormData(prev => ({
        ...prev,
        patientId: initialPatient.id,
        patientName: initialPatient.name,
        reason: initialPatient.diagnosis || ''
      }));
      setSearchTerm(initialPatient.name);
    }
  }, [initialPatient]);

  const filteredPatients = PATIENTS_DATA.filter(p => 
    p.name.includes(searchTerm) || p.hn.includes(searchTerm)
  );

  const handleSubmit = () => {
    // Validate
    if (!formData.patientName || !formData.date || !formData.time) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    onSubmit(formData);
  };

  const inputStyle = "bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors h-11";

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
              <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                  <ChevronLeft size={24} />
              </button>
              <h1 className="text-white text-lg font-bold">สร้างนัดหมายใหม่</h1>
          </div>
      </div>

      <div className="flex-1 w-full overflow-y-auto no-scrollbar px-4 pt-4 pb-24">
            <div className="space-y-8">
                {/* 1. Patient Info */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <User className="w-5 h-5 text-[#7367f0]" /> 1. ข้อมูลผู้ป่วย
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2 relative">
                            <Label className="text-sm font-semibold text-[#5e5873]">ค้นหาผู้ป่วย (ชื่อ หรือ HN)</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                    value={searchTerm} 
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowPatientResults(true);
                                    }}
                                    onFocus={() => setShowPatientResults(true)}
                                    placeholder="พิมพ์ชื่อ หรือ HN..." 
                                    className={`${inputStyle} pl-10`}
                                />
                            </div>
                            {showPatientResults && searchTerm && (
                                <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-lg rounded-xl mt-1 z-50 max-h-60 overflow-y-auto">
                                    {filteredPatients.length > 0 ? (
                                        filteredPatients.map(p => (
                                            <div 
                                                key={p.id}
                                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, patientId: p.id, patientName: p.name }));
                                                    setSearchTerm(p.name);
                                                    setShowPatientResults(false);
                                                }}
                                            >
                                                <div className="font-bold text-slate-800">{p.name}</div>
                                                <div className="text-xs text-slate-500">HN: {p.hn} | อายุ: {p.age}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-slate-400 text-sm">ไม่พบข้อมูล</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Date & Time */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Calendar className="w-5 h-5 text-[#7367f0]" /> 2. วันและเวลานัดหมาย
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#5e5873]">วันที่</Label>
                            <div className="relative">
                                <Input 
                                    type="date"
                                    value={formData.date} 
                                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                                    className={`${inputStyle}`}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#5e5873]">เวลา</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                    type="time"
                                    value={formData.time} 
                                    onChange={(e) => setFormData({...formData, time: e.target.value})} 
                                    className={`${inputStyle} pl-10`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Appointment Details */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Stethoscope className="w-5 h-5 text-[#7367f0]" /> 3. รายละเอียดการนัด
                    </h3>
                    
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">แผนก/คลินิก</Label>
                        <Select value={formData.department} onValueChange={(val) => setFormData({...formData, department: val})}>
                            <SelectTrigger className={inputStyle}>
                                <SelectValue placeholder="เลือกแผนก" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ศัลยกรรมตกแต่ง">ศัลยกรรมตกแต่ง</SelectItem>
                                <SelectItem value="ทันตกรรม">ทันตกรรม</SelectItem>
                                <SelectItem value="โสต ศอ นาสิก">โสต ศอ นาสิก</SelectItem>
                                <SelectItem value="กุมารเวชกรรม">กุมารเวชกรรม</SelectItem>
                                <SelectItem value="อรรถบำบัด">อรรถบำบัด</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">แพทย์ผู้นัด (ถ้ามี)</Label>
                        <Input 
                            value={formData.doctor} 
                            onChange={(e) => setFormData({...formData, doctor: e.target.value})} 
                            placeholder="ระบุชื่อแพทย์..." 
                            className={inputStyle}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">สถานที่นัดหมาย</Label>
                        <div className="relative">
                             <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                             <Input 
                                value={formData.location} 
                                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                                className={`${inputStyle} pl-10`}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-[#5e5873]">เหตุผลการนัด / รายละเอียดเพิ่มเติม</Label>
                        <Textarea 
                            value={formData.reason} 
                            onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                            placeholder="ระบุรายละเอียด..." 
                            className={`min-h-[100px] bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors resize-y`}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-slate-100 bg-white">
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            onClick={onClose} 
                            className="flex-1 h-[48px] rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-[16px] font-bold"
                        >
                            ยกเลิก
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                            className="flex-1 h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
                        >
                            สร้างนัดหมาย
                        </Button>
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
}
