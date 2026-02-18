import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Calendar, CreditCard, Save, Home, AlertCircle, Stethoscope } from 'lucide-react';

export interface PatientEditModalProps {
  patient: any;
  onClose: () => void;
  onSave: (updatedPatient: any) => void;
}

export default function PatientEditModal({ patient, onClose, onSave }: PatientEditModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idCard: '',
    dob: '',
    rights: '',
    admissionDate: '',
    originHospital: '',
    allergyHistory: '',
    attendingPhysician: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactAddress: ''
  });

  useEffect(() => {
    if (patient) {
      // Split name if possible
      const nameParts = patient.name ? patient.name.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setFormData({
        firstName,
        lastName,
        idCard: patient.cid || patient.idCard || '',
        dob: patient.dob || '',
        rights: patient.rights || '',
        admissionDate: patient.admissionDate || '28 ม.ค. 68', // Default from snippet if missing
        originHospital: patient.originHospital || 'โรงพยาบาลฝาง', // Default from snippet
        allergyHistory: patient.allergyHistory || 'ปฏิเสธการแพ้ยา', // Default from snippet
        attendingPhysician: patient.attendingPhysician || 'นพ.สมชาย ใจดี', // Default from snippet
        emergencyContactName: patient.contact?.name || '',
        emergencyContactPhone: patient.contact?.phone || '',
        emergencyContactAddress: patient.contact?.address || ''
      });
    }
  }, [patient]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Construct updated patient object
    const updatedPatient = {
      ...patient,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      cid: formData.idCard,
      dob: formData.dob,
      rights: formData.rights,
      admissionDate: formData.admissionDate,
      originHospital: formData.originHospital,
      allergyHistory: formData.allergyHistory,
      attendingPhysician: formData.attendingPhysician,
      contact: {
        ...patient.contact,
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        address: formData.emergencyContactAddress
      }
    };
    onSave(updatedPatient);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white shadow-sm z-10">
        <h2 className="text-lg font-bold text-[#49358E]">แก้ไขข้อมูลผู้ป่วย</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Personal Info & Medical Basic */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                <User className="w-5 h-5 text-[#49358E]" />
                ข้อมูลทั่วไป
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">ชื่อจริง</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">นามสกุล</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">เลขบัตรประชาชน</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.idCard}
                    onChange={(e) => handleChange('idCard', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">วันเกิด</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">สิทธิ์การรักษา</label>
                <select
                  value={formData.rights}
                  onChange={(e) => handleChange('rights', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E] bg-white"
                >
                  <option value="บัตรทอง">บัตรทอง</option>
                  <option value="ประกันสังคม">ประกันสังคม</option>
                  <option value="ข้าราชการ">ข้าราชการ</option>
                  <option value="จ่ายตรง">จ่ายตรง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">วันที่เข้ารับการรักษา</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.admissionDate}
                    onChange={(e) => handleChange('admissionDate', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">สถานพยาบาลต้นสังกัด</label>
                <div className="relative">
                  <Home className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.originHospital}
                    onChange={(e) => handleChange('originHospital', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E]"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Contact & Medical Extra */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
                <Phone className="w-5 h-5 text-[#49358E]" />
                ข้อมูลติดต่อ & การรักษา
              </h3>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">ชื่อผู้ติดต่อฉุกเฉิน</label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">เบอร์โทรศัพท์</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">ที่อยู่</label>
                <textarea
                  value={formData.emergencyContactAddress}
                  onChange={(e) => handleChange('emergencyContactAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">ประวัติการแพ้ยา</label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-2.5 w-4 h-4 text-red-400" />
                  <input
                    type="text"
                    value={formData.allergyHistory}
                    onChange={(e) => handleChange('allergyHistory', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#49358E] focus:ring-1 focus:ring-[#49358E] text-red-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">แพทย์เจ้าของไข้</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.attendingPhysician}
                    readOnly
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={onClose}
          className="flex-1 py-3 text-[#49358E] font-bold bg-[#F4F0FF] rounded-xl hover:bg-[#EBE5FF] transition-colors"
        >
          ยกเลิก
        </button>
        <button 
          onClick={handleSubmit}
          className="flex-1 py-3 text-white font-bold bg-[#49358E] rounded-xl hover:bg-[#3d2c76] shadow-lg shadow-[#49358E]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Save size={18} />
          บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
}