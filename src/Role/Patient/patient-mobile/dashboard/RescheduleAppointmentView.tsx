import React from 'react';
import { ChevronLeft, Calendar } from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface RescheduleAppointmentViewProps {
  mode: 'reschedule' | 'cancel';
  onBack: () => void;
  onConfirm: () => void;
}

export default function RescheduleAppointmentView({ mode, onBack, onConfirm }: RescheduleAppointmentViewProps) {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-lg font-bold text-slate-800">
          {mode === 'cancel' ? 'ยกเลิกนัดหมาย' : 'เลื่อนนัดหมาย'}
        </h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${mode === 'cancel' ? 'bg-red-50 text-red-500' : 'bg-[#F3F0FF] text-[#49358e]'}`}>
          <Calendar className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {mode === 'cancel' ? 'ยืนยันการยกเลิกนัดหมาย?' : 'เลือกวันนัดหมายใหม่'}
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            {mode === 'cancel' 
              ? 'คุณต้องการยกเลิกนัดหมายนี้ใช่หรือไม่? การยกเลิกอาจส่งผลต่อการรักษาของคุณ' 
              : 'กรุณาเลือกวันและเวลาที่สะดวกสำหรับการนัดหมายใหม่'}
          </p>
        </div>

        <div className="w-full pt-4 flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
            ย้อนกลับ
          </Button>
          <Button 
            onClick={onConfirm} 
            className={`flex-1 h-12 rounded-xl text-white ${mode === 'cancel' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#49358e] hover:bg-[#3b2a75]'}`}
          >
            {mode === 'cancel' ? 'ยืนยันยกเลิก' : 'ยืนยัน'}
          </Button>
        </div>
      </div>
    </div>
  );
}
