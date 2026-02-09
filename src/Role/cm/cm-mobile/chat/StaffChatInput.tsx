import React from 'react';
import { Plus, Smile, Send } from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface StaffChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export default function StaffChatInput({ inputText, setInputText, onSendMessage }: StaffChatInputProps) {
  const autoReplies = [
    "ทานยาตรงเวลาไหมครับ?",
    "นัดหมายครั้งถัดไป",
    "อาการดีขึ้นแล้วครับ",
    "ดูแลสุขภาพด้วยนะครับ"
  ];

  return (
    <>
      {/* Hide the global bottom navigation bar when this component is mounted */}
      <style>{`
        div.fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
          display: none !important;
        }
      `}</style>

      {/* Fixed Input Area - Replacing Bottom Navigation */}
      <div className="w-full bg-white border-t z-[100] shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
         <footer className="fixed bottom-0 left-0 right-0 p-3 space-y-3 bg-white border-t z-50">
             <form 
                onSubmit={onSendMessage}
                className="flex items-end gap-2"
             >
                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-gray-600 rounded-full shrink-0">
                    <Plus className="w-6 h-6" />
                </Button>
                
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
         </footer>
      </div>
    </>
  );
}
