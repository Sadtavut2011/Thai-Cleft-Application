import React from 'react';
import { Trash, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Label } from '../../../../../components/ui/label';
import { Textarea } from '../../../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components/ui/popover';
import { Calendar } from '../../../../../components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '../../../../../components/ui/utils';

interface EditMilestoneModalProps {
  milestone: {
    stage: string;
    date: string;
    status: string;
    note?: string;
  } | null;
  onBack: () => void;
  onSave: (data: any) => void;
  onDelete: () => void;
}

export const EditMilestoneModal: React.FC<EditMilestoneModalProps> = ({
  milestone,
  onBack,
  onSave,
  onDelete,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    milestone?.date && milestone.date !== '-' 
      ? new Date() 
      : undefined
  );
  
  if (!milestone) return null;

  return (
    <div className="h-full flex flex-col bg-white animate-in slide-in-from-bottom-4 duration-300">
        {/* Purple Header */}
        <div className="bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-20">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">แก้ไขแผนการรักษา</h1>
            <button 
                onClick={onDelete}
                className="ml-auto text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
                <Trash size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-4">
            <div className="mb-4">
                <p className="text-sm text-slate-500">ปรับปรุงสถานะหรือเลื่อนนัดหมาย</p>
            </div>

            <div className="space-y-4">
              {/* Item Name */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-700">
                  รายการ
                </Label>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-700 text-sm font-medium">
                  {milestone.stage}
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-700">
                  วันที่นัดหมาย
                </Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="relative cursor-pointer group">
                            <div className={cn(
                                "flex items-center h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm transition-all hover:border-[#7066a9]/50",
                                !date && "text-slate-400"
                            )}>
                                {date ? format(date, "dd/MM/yyyy") : "เลือกวันที่"}
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-[#7066a9]">
                                <CalendarIcon size={18} />
                            </div>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-700">
                  สถานะ
                </Label>
                <Select defaultValue={milestone.status === 'completed' ? 'completed' : 'upcoming'}>
                    <SelectTrigger className="h-[48px] rounded-xl border-slate-200 text-sm focus:ring-[#7066a9]">
                        <SelectValue placeholder="เลือกสถานะ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="upcoming">Upcoming (ใกล้ถึงกำหนด)</SelectItem>
                        <SelectItem value="completed">Completed (เสร็จสิ้น)</SelectItem>
                        <SelectItem value="pending">Pending (รอรัดหมาย)</SelectItem>
                        <SelectItem value="cancelled">Cancelled (ยกเลิก)</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-700">
                  บันทึกเพิ่มเติม
                </Label>
                <Textarea 
                    placeholder="ระบุเหตุผล หรือรายละเอียด..." 
                    className="bg-white border-slate-200 min-h-[120px] resize-none rounded-xl focus-visible:ring-[#7066a9] text-sm p-3"
                />
              </div>
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white mt-auto">
            <Button 
                onClick={onSave} 
                className="w-full h-[48px] rounded-xl bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 text-[16px] font-bold"
            >
                บันทึกการแก้ไข
            </Button>
        </div>
    </div>
  );
};
