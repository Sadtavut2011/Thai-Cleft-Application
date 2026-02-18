import React, { useState, useRef, useCallback } from 'react';
import { Plus, Smile, Send, X, Home, CalendarPlus, Navigation, Stethoscope, FileText, LayoutGrid, Camera, Upload } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner@2.0.3";

interface StaffChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onMenuAction?: (action: string) => void;
}

// Rich menu card items
const RICH_MENU_CARDS = [
  {
    id: 'home-visit',
    label: 'เยี่ยมบ้าน',
    subtitle: 'ส่งคำขอเยี่ยมบ้าน',
    icon: Home,
    gradient: 'from-[#28c76f] to-[#48da89]',
    iconBg: 'bg-white/20',
  },
  {
    id: 'appointment',
    label: 'นัดหมาย',
    subtitle: 'เพิ่มนัดหมายใหม่',
    icon: CalendarPlus,
    gradient: 'from-[#4285f4] to-[#6ea8fe]',
    iconBg: 'bg-white/20',
  },
  {
    id: 'referral',
    label: 'ส่งตัว',
    subtitle: 'ส่งคำขอส่งตัว',
    icon: Navigation,
    gradient: 'from-[#ff6d00] to-[#ff9e45]',
    iconBg: 'bg-white/20',
  },
  {
    id: 'treatment',
    label: 'บันทึกการรักษา',
    subtitle: 'เพิ่มบันทึกใหม่',
    icon: Stethoscope,
    gradient: 'from-[#e91e63] to-[#f06292]',
    iconBg: 'bg-white/20',
  },
  {
    id: 'funding',
    label: 'ขอทุน',
    subtitle: 'ส่งคำขอทุน',
    icon: FileText,
    gradient: 'from-[#f5a623] to-[#ffc558]',
    iconBg: 'bg-white/20',
  },
];

export default function StaffChatInput({ inputText, setInputText, onSendMessage, onMenuAction }: StaffChatInputProps) {
  const [isPlusPopupOpen, setIsPlusPopupOpen] = useState(false);
  const [isRichMenuOpen, setIsRichMenuOpen] = useState(false);

  // Drag to scroll for rich menu cards
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDragged = useRef(false);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    startX.current = pageX - (cardScrollRef.current?.offsetLeft || 0);
    scrollLeftRef.current = cardScrollRef.current?.scrollLeft || 0;
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !cardScrollRef.current) return;
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - (cardScrollRef.current.offsetLeft || 0);
    const walk = x - startX.current;
    if (Math.abs(walk) > 5) hasDragged.current = true;
    cardScrollRef.current.scrollLeft = scrollLeftRef.current - walk * 1.5;
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const autoReplies = [
    "ทานยาตรงเวลาไหมครับ?",
    "นัดหมายครั้งถัดไป",
    "อาการดีขึ้นแล้วครับ",
    "ดูแลสุขภาพด้วยนะครับ"
  ];

  const handleCardAction = (actionId: string, label: string) => {
    if (hasDragged.current) return; // Ignore click after drag
    if (onMenuAction) {
      onMenuAction(actionId);
    } else {
      toast.success(`เปิด: ${label}`, {
        description: 'ฟีเจอร์นี้จะพาไปหน้าที่เกี่ยวข้อง',
      });
    }
  };

  const handlePlusOption = (option: 'rich-menu' | 'camera' | 'upload') => {
    setIsPlusPopupOpen(false);
    switch (option) {
      case 'rich-menu':
        setIsRichMenuOpen(!isRichMenuOpen);
        break;
      case 'camera':
        toast.info('เปิดกล้องถ่ายรูป', { description: 'ฟีเจอร์กล้องจะพร้อมใช้งานเร็วๆ นี้' });
        break;
      case 'upload':
        toast.info('อัพโหลดไฟล์', { description: 'ฟีเจอร์อัพโหลดจะพร้อมใช้งานเร็วๆ นี้' });
        break;
    }
  };

  return (
    <>
      {/* Hide the global bottom navigation bar when this component is mounted */}
      <style>{`
        div.fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
          display: none !important;
        }
      `}</style>

      {/* Popup overlay - close when tapping outside */}
      {isPlusPopupOpen && (
        <div
          className="fixed inset-0 z-[95]"
          onClick={() => setIsPlusPopupOpen(false)}
        />
      )}

      {/* Fixed Input Area */}
      <div className="w-full bg-white border-t z-[100] shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-[100]">

          {/* === Rich Menu Card Strip (horizontal drag-scroll) === */}
          {isRichMenuOpen && (
            <div className="border-b border-gray-100 bg-[#f8f9fa] animate-in slide-in-from-bottom-2 fade-in duration-200">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <span className="text-[13px] font-semibold text-gray-500">เมนูลัด</span>
                <button
                  onClick={() => setIsRichMenuOpen(false)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Horizontal Card Scroll */}
              <div
                ref={cardScrollRef}
                className="flex gap-3 overflow-x-auto px-4 pb-3 pt-1 cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
              >
                {RICH_MENU_CARDS.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleCardAction(card.id, card.label)}
                      className={cn(
                        "shrink-0 w-[120px] h-[100px] rounded-2xl p-3 flex flex-col justify-between",
                        "bg-gradient-to-br shadow-md hover:shadow-lg active:scale-95 transition-all duration-200",
                        card.gradient
                      )}
                    >
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", card.iconBg)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-[13px] font-bold text-white leading-tight truncate">{card.label}</p>
                        <p className="text-[10px] text-white/70 truncate leading-tight mt-0.5">{card.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input form area */}
          <div className="p-3 space-y-3">
            <form
              onSubmit={onSendMessage}
              className="flex items-end gap-2"
            >
              {/* Plus button with popup */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlusPopupOpen(!isPlusPopupOpen);
                  }}
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200",
                    isPlusPopupOpen
                      ? "bg-[#7367f0] text-white shadow-md shadow-indigo-200"
                      : "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {isPlusPopupOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Plus className="w-6 h-6" />
                  )}
                </button>

                {/* Plus Popup (3 options) */}
                {isPlusPopupOpen && (
                  <div className="absolute bottom-full left-0 mb-2 z-[100] animate-in slide-in-from-bottom-2 fade-in duration-150">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 min-w-[180px]">
                      {/* ริชเมนู */}
                      <button
                        onClick={() => handlePlusOption('rich-menu')}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                          isRichMenuOpen
                            ? "bg-[#7367f0]/10 text-[#7367f0]"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          isRichMenuOpen ? "bg-[#7367f0] text-white" : "bg-[#f0eeff] text-[#7367f0]"
                        )}>
                          <LayoutGrid className="w-[18px] h-[18px]" />
                        </div>
                        <div className="text-left">
                          <p className="text-[14px] font-semibold">ริชเมนู</p>
                          <p className="text-[11px] text-gray-400">เมนูลัดคำสั่ง</p>
                        </div>
                      </button>

                      {/* ถ่ายรูป */}
                      <button
                        onClick={() => handlePlusOption('camera')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#e8faf0] text-[#28c76f] flex items-center justify-center">
                          <Camera className="w-[18px] h-[18px]" />
                        </div>
                        <div className="text-left">
                          <p className="text-[14px] font-semibold">ถ่ายรูป</p>
                          <p className="text-[11px] text-gray-400">เปิดกล้องถ่ายภาพ</p>
                        </div>
                      </button>

                      {/* อัพโหลด */}
                      <button
                        onClick={() => handlePlusOption('upload')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#fff3e8] text-[#ff9f43] flex items-center justify-center">
                          <Upload className="w-[18px] h-[18px]" />
                        </div>
                        <div className="text-left">
                          <p className="text-[14px] font-semibold">อัพโหลด</p>
                          <p className="text-[11px] text-gray-400">แนบไฟล์หรือรูปภาพ</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl flex items-center px-3 py-1 focus-within:border-[#7367F0] focus-within:ring-1 focus-within:ring-[#7367F0] transition-all relative">
                <textarea
                  className="flex-1 bg-transparent border-none focus:ring-0 p-1 min-h-[40px] max-h-[100px] resize-none text-sm placeholder:text-gray-400 outline-none leading-relaxed pr-8"
                  placeholder="พิมพ์ข้อความ..."
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSendMessage(e);
                    }
                  }}
                  onFocus={() => {
                    if (isPlusPopupOpen) setIsPlusPopupOpen(false);
                  }}
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 bottom-1 h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full shrink-0">
                  <Smile className="w-5 h-5" />
                </Button>
              </div>

              {/* Send Button */}
              <Button type="submit" size="icon" className="h-10 w-10 bg-[#7367F0] hover:bg-[#655bd3] text-white rounded-full shadow-md shrink-0">
                <Send className="w-5 h-5 ml-0.5" />
              </Button>
            </form>

            {/* Auto Replies */}
            <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1 pl-1">
              <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 font-medium">ข้อความอัตโนมัติ:</span>
              {autoReplies.map((reply, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setInputText(reply)}
                  className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}