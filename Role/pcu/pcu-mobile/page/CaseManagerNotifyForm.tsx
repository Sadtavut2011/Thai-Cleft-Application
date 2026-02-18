import React, { useState, useEffect } from 'react';
import { createPortal } from "react-dom";
import { ChevronLeft, Upload } from 'lucide-react';
import { TopHeader } from '../../../../components/shared/layout/TopHeader';

// --- Reusable UI Components ---

function SectionHeader({ number, text }: { number: string, text: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="bg-[#7066a9] flex items-center justify-center rounded-full w-6 h-6 shrink-0">
        <span className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] text-xs text-white">{number}</span>
      </div>
      <h3 className="font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] text-[#7066a9] text-base text-[20px]">{text}</h3>
    </div>
  );
}

function FormLabel({ text }: { text: string }) {
  return (
    <label className="block font-['IBM_Plex_Sans_Thai:Medium',sans-serif] text-[#4a5565] text-sm mb-1.5 text-[16px]">
      {text}
    </label>
  );
}

function InputField({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative">
      <input 
        className="w-full h-[48px] px-3 bg-[#f3f3f5] rounded-lg border border-[#d1d5dc] outline-none font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#3c3c3c] text-base placeholder:text-[#9ca3af] focus:border-[#7066a9] focus:ring-1 focus:ring-[#7066a9] transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}

function DropdownField({ placeholder }: { placeholder: string }) {
  return (
    <button className="w-full h-[48px] px-3 bg-[#f3f3f5] rounded-lg border border-[#d1d5dc] flex items-center justify-between outline-none font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-base text-left hover:bg-slate-50 transition-colors group">
      <span className="text-[#9ca3af] group-hover:text-slate-600">{placeholder}</span>
      <svg className="w-4 h-4 text-[#717182]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

function TextareaField({ placeholder }: { placeholder: string }) {
  return (
    <textarea 
      className="w-full h-[80px] px-3 py-2 bg-[#f3f3f5] rounded-lg border border-[#d1d5dc] outline-none font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#3c3c3c] text-base placeholder:text-[#9ca3af] resize-none focus:border-[#7066a9] focus:ring-1 focus:ring-[#7066a9] transition-all"
      placeholder={placeholder}
    />
  );
}

function UploadField() {
  return (
    <button className="w-full h-[100px] bg-[#f9fafb] rounded-lg border-2 border-dashed border-[#e5e7eb] flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
        <Upload className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
      </div>
      <span className="font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#6a7282] text-sm">คลิกเพื่ออัปโหลดไฟล์</span>
    </button>
  );
}

function SubmitButton({ onClick }: { onClick: () => void }) {
  return (
    <>
      <div className="h-[80px]" />
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 pb-8 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-[360px] mx-auto">
          <button 
            onClick={onClick} 
            className="w-full h-[48px] bg-[#ff8a4c] rounded-xl flex items-center justify-center shadow-sm hover:bg-[#ff8a4c]/90 active:scale-[0.98] transition-all"
          >
            <span className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] text-white text-base">ยืนยันการแจ้งเหตุ</span>
          </button>
        </div>
      </div>
    </>
  );
}

function CaseManagerNotifyFormContent({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="w-full max-w-[360px] mx-auto p-4 flex flex-col gap-6">
      
      {/* Section 1 */}
      <div>
        <SectionHeader number="1" text="ข้อมูลระบุตัวตน" />
        <div className="space-y-4 pl-1">
          <div>
            <FormLabel text="ชื่อ - นามสกุล" />
            <InputField placeholder="ระบุชื่อ-นามสกุลผู้ป่วย" />
          </div>
          <div>
            <FormLabel text="หมายเลขบัตรประชาชน" />
            <InputField placeholder="เลข 13 หลัก" />
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div>
        <SectionHeader number="2" text="ข้อมูลการส่งต่อ" />
        <div className="space-y-4 pl-1">
          <div>
            <FormLabel text="โรงพยาบาลต้นสังกัด (Target)" />
            <DropdownField placeholder="เลือกโรงพยาบาล" />
            <p className="mt-2 font-['IBM_Plex_Sans_Thai:Light',sans-serif] text-[#99a1af] leading-relaxed text-[14px]">
              *ระบบจะส่งการแจ้งเตือนไปยัง Case Manager ของโรงพยาบาลที่ท่านเลือก
            </p>
          </div>
        </div>
      </div>

      {/* Section 3 */}
      <div>
        <SectionHeader number="3" text="ข้อมูลเพิ่มเติม" />
        <div className="space-y-4 pl-1">
          <div>
            <FormLabel text="ที่อยู่ปัจจุบัน" />
            <TextareaField placeholder="บ้านเลขที่ หมู่ ตำบล อำเภอ จังหวัด..." />
          </div>
          <div>
            <FormLabel text="การวินิจฉัย/อาการเบื้องต้น" />
            <TextareaField placeholder="ระบุอาการ หรือความพิการที่พบ..." />
          </div>
          <div>
            <FormLabel text="เอกสารแนบ/รูปถ่าย" />
            <UploadField />
          </div>
        </div>
      </div>

      <SubmitButton onClick={onSubmit} />
    </div>
  );
}

// --- Main Page Component ---

interface CaseManagerNotifyFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export const CaseManagerNotifyForm: React.FC<CaseManagerNotifyFormProps> = ({ isOpen, onOpenChange, onSubmit }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
       {/* Header */}
       <div className="bg-[#7066a9] shrink-0 shadow-sm z-10 sticky top-0">
          <TopHeader />
          <div className="px-4 pb-3 flex items-center gap-4">
            <button 
              onClick={() => onOpenChange(false)} 
              className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
            >
               <ChevronLeft size={24} />
            </button>
            <span className="text-white font-['IBM_Plex_Sans_Thai',sans-serif] font-bold text-lg">แจ้ง Case Manager</span>
          </div>
       </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-white pb-safe-area [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
         <CaseManagerNotifyFormContent onSubmit={() => {
           onSubmit();
           onOpenChange(false);
         }} />
      </div>
    </div>,
    document.body
  );
};