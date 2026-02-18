import React from 'react';
import { 
  ChevronLeft,
  Clock, 
  FileText, 
  MapPin, 
  AlertTriangle
} from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";

interface HomeVisitF2Props {
  onClose: () => void;
}

export function HomeVisitF2({ onClose }: HomeVisitF2Props) {

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="fixed inset-0 z-[100] w-full h-full bg-[#f8fafc] flex flex-col">
        
        {/* Status Bar Filler */}
        <div className="w-full h-[48px] bg-[#4C3C96] shrink-0" />

        {/* Header */}
        <div className="shrink-0 h-[60px] bg-white border-b border-slate-100 flex items-center px-4 gap-3 z-50 relative mt-3">
          <button 
              onClick={onClose} 
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-[#37286a] hover:bg-slate-50 transition-colors"
          >
              <ChevronLeft size={24} />
          </button>
          <h1 className="text-[18px] font-bold text-[#37286a] font-['IBM_Plex_Sans_Thai:Bold',sans-serif]">
              ระบบเยี่ยมบ้าน
          </h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-safe-bottom space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            {/* Patient Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex flex-col gap-1 mb-6">
                     <div className="flex justify-between items-center">
                        <h2 className="text-xl font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-slate-800">สมชาย แข็งแรง</h2>
                        <span className="bg-[#F3E8FF] text-[#7E22CE] text-xs font-['IBM_Plex_Sans_Thai:Bold',sans-serif] px-3 py-1 rounded-full">
                            Recheck
                        </span>
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Clock size={16} />
                            <span className="font-['IBM_Plex_Sans_Thai:Medium',sans-serif]">แจ้งเมื่อ: 08:30</span>
                        </div>
                        <span className="text-[rgb(115,103,240)] text-sm font-['IBM_Plex_Sans_Thai:Medium',sans-serif]">
                            ประเภท: เยี่ยมบ้าน
                        </span>
                     </div>
                </div>

                <div className="space-y-5">
                    {/* Symptoms */}
                    <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#4C3C96] shrink-0">
                             <FileText size={22} />
                         </div>
                         <div className="pt-1">
                             <h3 className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-slate-800 text-sm mb-1">อาการ/คำร้อง</h3>
                             <p className="text-slate-600 font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-sm leading-relaxed">
                                Cleft Lip and Palate (ปากแหว่งเพดานโหว่)
                             </p>
                         </div>
                    </div>

                    <div className="h-px bg-slate-100 w-full" />

                    {/* Location */}
                    <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                             <MapPin size={22} />
                         </div>
                         <div className="pt-1">
                             <h3 className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-slate-800 text-sm mb-1">สถานที่</h3>
                             <p className="text-slate-600 font-['IBM_Plex_Sans_Thai:Regular',sans-serif] text-sm leading-relaxed">
                                123 ม.1 ต.สุเทพ อ.เมือง จ.เชียงใหม่
                             </p>
                         </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
                <div className="bg-[#FFF5F5] rounded-2xl p-4 border border-[#FECACA]">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="text-[#DC2626]" size={20} />
                        <h3 className="font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[#37286a] text-base">ระบุสาเหตุที่ปฏิเสธ</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-['IBM_Plex_Sans_Thai:Bold',sans-serif] text-[#37286a]">สาเหตุ</label>
                            <Textarea 
                                placeholder="ระบุเหตุผล..."
                                className="min-h-[120px] bg-white border-slate-200 rounded-xl font-['IBM_Plex_Sans_Thai:Regular',sans-serif] resize-none p-3 text-slate-800"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button 
                                variant="outline"
                                onClick={onClose}
                                className="h-12 bg-white border-slate-200 text-slate-700 rounded-xl font-['IBM_Plex_Sans_Thai:Bold',sans-serif]"
                            >
                                ยกเลิก
                            </Button>
                            <Button 
                                className="h-12 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-['IBM_Plex_Sans_Thai:Bold',sans-serif]"
                            >
                                บันทึก
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}