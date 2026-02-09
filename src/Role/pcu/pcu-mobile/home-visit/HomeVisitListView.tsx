import React, { useState } from 'react';
import { HomeVisitActionModal } from './HomeVisitActionModal';
import { HomeVisitProceedModal } from './HomeVisitProceedModal';
import { HomeVisitF1 } from './HomeVisitF1';
import { HomeVisitF2 } from './HomeVisitF2';
import { HomeVisitForm } from './forms/VisitForm';
import { User, Clock, FileText, MapPin, AlertTriangle, ChevronDown, CheckCircle, Navigation, ChevronLeft } from 'lucide-react';

// --- Sub-components for List View ---

function ListIcon() {
  return (
    <div className="absolute left-0 size-[19.997px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M2.49962 4.16604H2.50796" id="Vector" stroke="#37286A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M2.49962 9.99849H2.50796" id="Vector_2" stroke="#37286A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M2.49962 15.8309H2.50796" id="Vector_3" stroke="#37286A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M6.66566 4.16604H17.4974" id="Vector_4" stroke="#37286A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M6.66566 9.99849H17.4974" id="Vector_5" stroke="#37286A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
          <path d="M6.66566 15.8309H17.4974" id="Vector_6" stroke="#37286A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66641" />
        </g>
      </svg>
    </div>
  );
}

function ListHeading() {
  return (
    <div className="h-[27.992px] relative shrink-0 w-[150.116px] pointer-events-none" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <ListIcon />
        <p className="absolute font-['IBM_Plex_Sans_Thai:Bold',sans-serif] leading-[28px] left-[27.99px] not-italic text-[#37286a] text-[18px] top-[-0.14px] w-[123px]">รายชื่อผู้ป่วย (3)</p>
      </div>
    </div>
  );
}

// --- Card 1: Urgent ---

function Card1({ onConfirm }: { onConfirm: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showF1, setShowF1] = useState(false);
  const [showF2, setShowF2] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showConfirmForm, setShowConfirmForm] = useState(false);

  // Mock Data for this Card
  const patientName = "สมชาย แข็งแรง";
  const reportTime = "08:30";
  const symptoms = "Cleft Lip and Palate (ปากแหว่งเพดานโหว่)";
  const visitType = "ฝากเยี่ยม";
  const location = "123 ม.1 ต.สุเทพ อ.เมือง จ.เชียงใหม่";

  const onClose = () => {
      setIsModalOpen(false);
      setShowRejectForm(false);
      setShowConfirmForm(false);
  };

  return (
    <>
      <div 
        onClick={() => setShowF1(true)}
        className="bg-purple-50 p-4 rounded-2xl w-full cursor-pointer hover:bg-purple-100 transition-colors"
      >
          <div className="flex flex-col gap-2">
              <div>
                  <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2 text-gray-800">
                          <User size={16} className="text-purple-500 shrink-0" />
                          <span className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] font-medium text-[16px]">{patientName} (HN: 65778811)</span>
                      </div>
                      <span className="bg-[#FFF8E1] text-[#F59E0B] text-[10px] px-2 py-1 rounded-full font-['IBM_Plex_Sans_Thai:Bold',sans-serif] font-bold shrink-0">รอตอบรับ</span>
                  </div>

                  <div className="text-sm text-gray-600 flex flex-col gap-1 pl-6">
                      <div className="flex items-center gap-2">
                          <span className="text-gray-500 min-w-[30px] font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">จาก:</span>
                          <span className="font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">รพ.มหาราช</span>
                      </div>
                      <div className="flex items-start gap-2">
                          <span className="text-gray-500 min-w-[30px] font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">ประเภท:</span>
                          <span className="leading-tight font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">{visitType}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* New HomeVisitF1 Page */}
      {showF1 && <HomeVisitF1 onClose={() => setShowF1(false)} />}
      {showF2 && <HomeVisitF2 onClose={() => setShowF2(false)} />}

      {/* Inline Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onClose} />
            
            {/* Modal Content */}
            <div className="absolute inset-0 z-50 bg-white overflow-y-auto pb-32 animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Top Header with Back Button */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <button 
                onClick={onClose}
                className="p-1 -ml-1 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
                >
                <ChevronLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                <h2 className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[18px] text-[#1e2939] truncate">
                    {patientName}
                </h2>
                </div>
                <div className="bg-[#F3E8FF] px-2 py-0.5 rounded-full flex items-center shrink-0">
                <span className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[12px] text-[#7E22CE]">Recheck</span>
                </div>
            </div>

            {/* Content Container */}
            <div className="p-4 pt-4">

            {/* Time */}
            <div className="flex items-center gap-2 text-[#64748B] mb-5 px-1">
            <Clock size={16} />
            <span className="font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[14px]">
                แจ้งเมื่อ: {reportTime}
            </span>
            </div>

            {/* Symptoms Card */}
            <div className="bg-[#F8F9FA] rounded-[16px] p-4 mb-5 border border-slate-100">
            <div className="flex items-center gap-2 mb-2 text-[#334155]">
                <FileText size={18} />
                <span className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[16px]">
                อาการ/คำร้อง
                </span>
            </div>
            <p className="font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#475569] text-[14px] leading-[1.5]">
                {symptoms}
            </p>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 mb-8 px-1">
            <div className="mt-0.5 text-[#EF4444]">
                <MapPin size={20} />
            </div>
            <span className="font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#475569] text-[14px] leading-tight">
                {location}
            </span>
            </div>

            {/* Actions */}
            {showRejectForm ? (
            <div className="bg-[#FEF2F2] border border-[#FFE2E2] rounded-[14px] p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="text-[#DC2626]" size={18} />
                <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[#37286a] text-[14px]">ระบุสาเหตุที่ไม่อยู่ในพื้นที่</p>
                </div>
                
                <div className="mb-3">
                <label className="block text-[#37286a] text-[12px] font-['IBM_Plex_Sans_Thai:Bold',sans-serif] mb-1">สาเหตุ</label>
                <div className="relative">
                    <select className="w-full h-[40px] border border-[#E2E8F0] rounded-[10px] px-3 text-[14px] appearance-none bg-white font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#334155] focus:outline-none focus:border-[#DC2626]">
                        <option>ผู้ป่วยย้ายที่อยู่</option>
                        <option>ติดต่อไม่ได้</option>
                        <option>อื่นๆ</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
                </div>

                <div className="flex gap-2">
                <button 
                    onClick={() => setShowRejectForm(false)} 
                    className="flex-1 h-[40px] border border-[#E2E8F0] rounded-[10px] text-[#45556c] font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px] bg-white hover:bg-slate-50 transition-colors"
                >
                    ยกเลิก
                </button>
                <button className="flex-1 h-[40px] bg-[#DC2626] rounded-[10px] text-white font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px] shadow-sm hover:bg-[#B91C1C] transition-colors">
                    บันทึก
                </button>
                </div>
            </div>
            ) : showConfirmForm ? (
            <div className="bg-[#f0fdf9] border border-[#ccfbf1] rounded-[14px] p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-[#059669]" size={18} />
                <p className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[#37286a] text-[16px]">ยืนยันการเยี่ยมบ้าน</p>
                </div>

                <div className="flex gap-3 mb-3">
                <div className="flex-1">
                    <label className="block text-[#37286a] text-[12px] font-['IBM_Plex_Sans_Thai:Bold',sans-serif] mb-1">วันที่</label>
                    <input type="date" className="w-full h-[44px] border border-[#E2E8F0] rounded-[14px] px-3 text-[14px] bg-white font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#334155] focus:outline-none focus:border-[#059669]" />
                </div>
                <div className="flex-1">
                    <label className="block text-[#37286a] text-[12px] font-['IBM_Plex_Sans_Thai:Bold',sans-serif] mb-1">เวลา</label>
                    <input type="time" className="w-full h-[44px] border border-[#E2E8F0] rounded-[14px] px-3 text-[14px] bg-white font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#334155] focus:outline-none focus:border-[#059669]" />
                </div>
                </div>

                <div className="mb-3">
                <label className="block text-[#37286a] text-[12px] font-['IBM_Plex_Sans_Thai:Bold',sans-serif] mb-1">บันทึกเพิ่มเติม</label>
                <textarea 
                    placeholder="เช่น ญาติจะอยู่บ้านช่วงบ่าย..."
                    className="w-full h-[96px] border border-[#E2E8F0] rounded-[14px] p-3 text-[14px] bg-white font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-[#334155] focus:outline-none focus:border-[#059669] resize-none placeholder:text-gray-300"
                />
                </div>

                <div className="flex gap-2">
                <button 
                    onClick={() => setShowConfirmForm(false)} 
                    className="flex-1 h-[48px] border border-[#E2E8F0] rounded-[14px] text-[#45556c] font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px] bg-white hover:bg-slate-50 transition-colors"
                >
                    ยกเลิก
                </button>
                <button className="flex-1 h-[48px] bg-[#059669] rounded-[14px] text-white font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px] shadow-sm hover:bg-[#047857] transition-colors">
                    ยืนยัน
                </button>
                </div>
            </div>
            ) : (
            <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                <button 
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white h-[48px] rounded-[14px] flex items-center justify-center gap-2 transition-colors"
                >
                    <Navigation size={18} className="rotate-45" fill="currentColor" />
                    <span className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px]">ไม่อยู่ในพื้นที่</span>
                </button>
                
                <button 
                    onClick={() => setShowConfirmForm(true)}
                    className="flex-1 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#1E2939] h-[48px] rounded-[14px] flex items-center justify-center gap-2 transition-colors"
                >
                    <CheckCircle size={18} />
                    <span className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px]">อยู่ในพื้นที่</span>
                </button>
                </div>

                <button 
                type="button"
                className="w-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] h-[48px] rounded-[14px] flex items-center justify-center gap-2 transition-colors"
                >
                <AlertTriangle size={18} />
                <span className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[14px]">ไม่อนุญาตให้ลงพื้นที่</span>
                </button>
            </div>
            )}
            </div>
            </div>
        </div>
      )}
    </>
  );
}

// --- Card 2: Pending ---

function Card2({ onProceed }: { onProceed: () => void }) {
  const [showF1, setShowF1] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowF1(true)}
        className="bg-purple-50 p-4 rounded-2xl w-full cursor-pointer hover:bg-purple-100 transition-colors"
      >
          <div className="flex flex-col gap-2">
              <div>
                  <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2 text-gray-800">
                        <User size={16} className="text-purple-500 shrink-0" />
                        <span className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] font-medium text-[16px]">รักดี มีสุข (HN: 66095432)</span>
                      </div>
                      <span className="bg-[#ffedd4] text-[#9f2d00] text-[10px] px-2 py-1 rounded-full font-['IBM_Plex_Sans_Thai:Medium',sans-serif] font-bold shrink-0">ดำเนินการ</span>
                  </div>

                  <div className="text-sm text-gray-600 flex flex-col gap-1 pl-6">
                      <div className="flex items-center gap-2">
                          <span className="text-gray-500 min-w-[30px] font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">จาก:</span>
                          <span className="font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">รพ.มหาราช</span>
                      </div>
                      <div className="flex items-start gap-2">
                          <span className="text-gray-500 min-w-[30px] font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">ประเภท:</span>
                          <span className="leading-tight font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">ฝากเยี่ยม</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      
      {showF1 && (
        <HomeVisitF1 
            onClose={() => setShowF1(false)} 
            status="pending"
        />
      )}
    </>
  );
}

// --- Card 3: Completed ---

function Card3() {
  const [showF1, setShowF1] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowF1(true)}
        className="bg-purple-50 p-4 rounded-2xl w-full cursor-pointer hover:bg-purple-100 transition-colors"
      >
        <div className="flex flex-col gap-2">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 text-gray-800">
                       <User size={16} className="text-purple-500 shrink-0" />
                       <span className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif] font-medium text-[16px]">รักดี มีสุข (HN: 66095432)</span>
                    </div>
                    <span className="bg-[#84e1bc] text-[#0e9f6e] text-[10px] px-2 py-1 rounded-full font-['IBM_Plex_Sans_Thai:Medium',sans-serif] font-bold shrink-0">เสร็จสิ้น</span>
                </div>

                <div className="text-sm text-gray-600 flex flex-col gap-1 pl-6">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 min-w-[30px] font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">จาก:</span>
                        <span className="font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">รพ.มหาราช</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-500 min-w-[30px] font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">ประเภท:</span>
                        <span className="leading-tight font-['IBM_Plex_Sans_Thai:Regular',sans-serif]">ฝากเยี่ยม</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {showF1 && (
        <HomeVisitF1 
            onClose={() => setShowF1(false)} 
            status="completed"
        />
      )}
    </>
  );
}

function CardsList({ onConfirm, onProceed }: { onConfirm: () => void; onProceed: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[11.993px] relative shrink-0 w-full" data-name="Container">
      <Card1 onConfirm={onConfirm} />
      <Card2 onProceed={onProceed} />
      <Card3 />
    </div>
  );
}

function ListContent({ onConfirm, onProceed }: { onConfirm: () => void; onProceed: () => void }) {
  return (
    <div className="h-full relative shrink-0 w-full overflow-y-auto" data-name="Container">
        <div className="content-stretch flex flex-col gap-[16px] items-start pb-[20px] pt-[80px] px-[16px] relative size-full min-h-full">
          <CardsList onConfirm={onConfirm} onProceed={onProceed} />
        </div>
    </div>
  );
}

export const HomeVisitListView = ({ onBack, onShowDetail, showHeader = true, onToggleView }: { onBack?: () => void, onShowDetail?: () => void, showHeader?: boolean, onToggleView?: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProceedModalOpen, setIsProceedModalOpen] = useState(false);

  // If onShowDetail is not provided (e.g. from tests), we can default to opening modal or doing nothing
  const handleProceed = () => {
    if (onShowDetail) {
      onShowDetail();
    } else {
      setIsProceedModalOpen(true);
    }
  };

  return (
    <div className="bg-[#f8fafc] w-full h-full flex flex-col" data-name="Container">
      {/* Header */}
      {showHeader && (
        <div className="sticky top-0 w-full bg-white h-[60px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-sm border-b border-gray-100">
                <button onClick={onBack} className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-[#37286a] text-lg font-['IBM_Plex_Sans_Thai:Bold',sans-serif]">รายการเยี่ยมบ้าน</h1>
        </div>
      )}

      <div className={`flex-1 overflow-hidden relative ${!showHeader ? 'pt-[0px]' : ''}`}>
        <ListContent 
            onConfirm={() => setIsModalOpen(true)} 
            onProceed={handleProceed}
        />
      </div>
      
      {/* Existing global modal (optional, might be redundant now for Card1 but kept for compatibility) */}
      <HomeVisitActionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientName="ด.ช. รักดี มีสุข"
        reportTime="09:00"
        symptoms="แผลกดทับมีหนองและบวมแดง ต้องการพยาบาลทำแผลด่วน"
        location="123 ม.1 ต.สุเทพ อ.เมือง จ.เชียงใหม่"
      />

      <HomeVisitProceedModal
        isOpen={isProceedModalOpen}
        onClose={() => setIsProceedModalOpen(false)}
      />
    </div>
  );
}
