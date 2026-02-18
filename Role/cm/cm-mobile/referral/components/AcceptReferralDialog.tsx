import React, { useState, useEffect } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription, DrawerTrigger, DrawerClose } from "../../../../../components/ui/drawer";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Input } from "../../../../../components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, FileText, X, Clock } from "lucide-react";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { ThaiCalendar } from "../../../../../components/shared/ThaiCalendarDrawer";

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const toTimeString = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

interface AcceptReferralDialogProps {
  referralId?: number;
  onAccept?: (id: number, date: Date, details: string) => void;
  onSave?: (date: Date, details: string) => void;
  trigger?: React.ReactNode;
  initialDate?: Date;
  initialStep?: number;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

export function AcceptReferralDialog({ 
  referralId, 
  onAccept, 
  onSave, 
  trigger, 
  initialDate, 
  initialStep = 1,
  title,
  description,
  confirmLabel
}: AcceptReferralDialogProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState(initialDate ? toTimeString(initialDate) : toTimeString(new Date()));
  const [details, setDetails] = useState('');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(initialStep);

  // Reset step when dialog opens
  useEffect(() => {
    if (open) {
      setStep(initialStep);
      if (initialDate) {
        setDate(initialDate);
        setTime(toTimeString(initialDate));
      } else {
        setDate(new Date());
        setTime(toTimeString(new Date()));
      }
      setDetails('');
    }
  }, [open, initialStep, initialDate]);

  const handleNext = () => {
    if (step === 1) {
        if (!date) {
            toast.error("กรุณาระบุวันที่นัดหมาย");
            return;
        }
        setStep(2);
    } else if (step === 2) {
        setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
        setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    if (!date) return;

    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const finalDate = new Date(date);
    finalDate.setHours(hours);
    finalDate.setMinutes(minutes);

    if (onSave) {
        onSave(finalDate, details);
    } else if (onAccept && referralId) {
        onAccept(referralId, finalDate, details);
    }
    
    setOpen(false);
  };

  const getStepTitle = () => {
      switch(step) {
          case 1: return title || 'เลือกวันที่';
          case 2: return 'ระบุเวลา';
          case 3: return 'รายละเอียดเพิ่มเติม';
          default: return title || 'ยอมรับการส่งตัว';
      }
  };

  const getStepDescription = () => {
      switch(step) {
          case 1: return description || 'เลือกวันที่ที่ต้องการนัดหมายรับผู้ป่วย';
          case 2: return 'ระบุเวลาที่ต้องการนัดหมาย';
          case 3: return 'ระบุหมายเหตุการตอบรับ (ถ้ามี)';
          default: return description || 'ดำเนินการตอบรับผู้ป่วย';
      }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger || (
          <Button size="sm" className="h-9 text-xs bg-[#28c76f] hover:bg-[#20a35a] text-white flex-1 md:flex-none">
               <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> ยอมรับการส่งตัว
          </Button>
        )}
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh] h-[75vh] z-[50000]">
        <DrawerHeader className="px-6 border-b shrink-0 bg-white">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
                <DrawerTitle className="text-xl">
                    {getStepTitle()}
                </DrawerTitle>
                <DrawerDescription>
                    {getStepDescription()}
                </DrawerDescription>
             </div>
             <DrawerClose asChild>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <X className="h-4 w-4" />
                 </Button>
             </DrawerClose>
          </div>
          
          {/* Steps Indicator */}
          <div className="flex gap-1 mt-4">
               <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-[#28c76f]' : 'bg-gray-100'}`} />
               <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-[#28c76f]' : 'bg-gray-100'}`} />
               <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-[#28c76f]' : 'bg-gray-100'}`} />
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-hidden relative bg-gray-50/50">
           {step === 1 && (
             <div className="h-full w-full flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <ThaiCalendar
                        selected={date || null}
                        onSelect={(d) => setDate(d)}
                        accentColor="#28c76f"
                    />
                </div>
             </div>
           )}

           {step === 2 && (
             <ScrollArea className="h-full w-full animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* The Picker Container - Full Width White Background */}
                  <div className="w-full bg-white h-full flex justify-center items-center py-8">
                    {/* Constrained Width Content */}
                    <div className="relative w-full max-w-[280px] h-64 flex text-lg select-none">
                        {/* Selection Bar Highlight */}
                        <div className="absolute top-1/2 left-0 right-0 h-16 -mt-8 z-0 pointer-events-none border-y border-gray-100 bg-gray-50/50" />
                        
                        {/* Hours Column */}
                        <div className="flex-1 z-10 overflow-y-auto no-scrollbar py-[calc(50%-2rem)] snap-y snap-mandatory text-center">
                            {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((h) => (
                                <div 
                                    key={h} 
                                    onClick={() => {
                                        const [_, m] = time.split(':');
                                        setTime(`${h}:${m}`);
                                    }}
                                    className={`h-16 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${
                                        time.startsWith(h) 
                                            ? 'font-bold text-[#28c76f] text-5xl scale-110' 
                                            : 'text-gray-300 text-3xl scale-90'
                                    }`}
                                >
                                    {h}
                                </div>
                            ))}
                            <div className="h-[calc(50%-2rem)] w-full" />
                        </div>

                        {/* Colon Separator */}
                        <div className="flex items-center justify-center z-10 pb-2 w-8">
                            <span className="text-4xl font-bold text-gray-300">:</span>
                        </div>

                        {/* Minutes Column */}
                        <div className="flex-1 z-10 overflow-y-auto no-scrollbar py-[calc(50%-2rem)] snap-y snap-mandatory text-center">
                            {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((m) => (
                                <div 
                                    key={m} 
                                    onClick={() => {
                                        const [h, _] = time.split(':');
                                        setTime(`${h}:${m}`);
                                    }}
                                    className={`h-16 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${
                                        time.endsWith(m) 
                                            ? 'font-bold text-[#28c76f] text-5xl scale-110' 
                                            : 'text-gray-300 text-3xl scale-90'
                                    }`}
                                >
                                    {m}
                                </div>
                            ))}
                            <div className="h-[calc(50%-2rem)] w-full" />
                        </div>
                    </div>
                 </div>
             </ScrollArea>
           )}

           {step === 3 && (
             <ScrollArea className="h-full w-full animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="flex flex-col items-center p-4 md:p-8 min-h-full">
                     <div className="w-full max-w-md space-y-6 pb-4">
                        
                        {/* Date Display Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3">
                           <div className="h-14 w-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-1">
                              <CalendarIcon size={28} />
                           </div>
                           <div>
                              <div className="text-sm text-gray-500 mb-1">เวลานัดหมาย</div>
                              <div className="text-2xl font-bold text-gray-800">
                                {date && `${date.getDate()} ${THAI_MONTHS[date.getMonth()]} ${date.getFullYear() + 543}`}
                              </div>
                              <div className="text-3xl font-bold text-[#28c76f] mt-1">
                                {time} น.
                              </div>
                           </div>
                        </div>

                        <div className="grid gap-2">
                           <Label className="text-gray-600">หมายเหตุ / รายละเอียดเพิ่มเติม</Label>
                           <div className="relative">
                             <Textarea 
                               placeholder="ระบุรายละเอียดเพิ่มเติม..." 
                               value={details}
                               onChange={(e) => setDetails(e.target.value)}
                               className="resize-none min-h-[120px] pl-10 pt-4 text-base bg-white shadow-sm border-gray-200"
                             />
                             <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                           </div>
                        </div>
                     </div>
                 </div>
             </ScrollArea>
           )}
        </div>

        <DrawerFooter className="p-4 border-t bg-white shrink-0">
            <div className="w-full max-w-md mx-auto flex gap-3">
                {step === 1 ? (
                <>
                    <DrawerClose asChild>
                       <Button variant="outline" className="flex-1 h-12 text-base">ยกเลิก</Button>
                    </DrawerClose>
                    <Button 
                    className="flex-1 bg-[#28c76f] hover:bg-[#20a35a] text-white h-12 text-base shadow-md shadow-green-200" 
                    onClick={handleNext}
                    disabled={!date}
                    >
                    ถัดไป <ChevronRight className="ml-1 h-5 w-5" />
                    </Button>
                </>
                ) : (
                <>
                    <Button variant="outline" className="flex-1 h-12 text-base" onClick={handleBack}>
                        <ChevronLeft className="mr-1 h-5 w-5" /> ย้อนกลับ
                    </Button>
                    {step < 3 ? (
                        <Button 
                        className="flex-1 bg-[#28c76f] hover:bg-[#20a35a] text-white h-12 text-base shadow-md shadow-green-200" 
                        onClick={handleNext}
                        >
                        ถัดไป <ChevronRight className="ml-1 h-5 w-5" />
                        </Button>
                    ) : (
                        <Button 
                        className="flex-1 bg-[#28c76f] hover:bg-[#20a35a] text-white h-12 text-base shadow-md shadow-green-200" 
                        onClick={handleConfirm}
                        >
                        {confirmLabel || 'ยืนยันการตอบรับ'}
                        </Button>
                    )}
                </>
                )}
            </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}