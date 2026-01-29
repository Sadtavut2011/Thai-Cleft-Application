import React, { useState, useEffect } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription, DrawerTrigger, DrawerClose } from "../../../../../components/ui/drawer";
import { Calendar } from "../../../../../components/ui/calendar";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Input } from "../../../../../components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, FileText, X, Clock } from "lucide-react";
import { th } from "date-fns/locale";
import { format } from "date-fns";
import { ScrollArea } from "../../../../../components/ui/scroll-area";

interface AcceptReferralDialogProps {
  referralId: number;
  onAccept: (id: number, date: Date, details: string) => void;
  trigger?: React.ReactNode;
}

export function AcceptReferralDialog({ referralId, onAccept, trigger }: AcceptReferralDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [details, setDetails] = useState('');
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Reset step when dialog opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setDate(new Date());
      setTime(format(new Date(), 'HH:mm'));
      setDetails('');
    }
  }, [open]);

  const handleNext = () => {
    if (!date) {
      toast.error("กรุณาระบุวันที่นัดหมาย");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleConfirm = () => {
    if (!date) return;

    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const finalDate = new Date(date);
    finalDate.setHours(hours);
    finalDate.setMinutes(minutes);

    onAccept(referralId, finalDate, details);
    setOpen(false);
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
                    {step === 1 ? 'เลือกวันที่' : 'ระบุเวลาและรายละเอียด'}
                </DrawerTitle>
                <DrawerDescription>
                    {step === 1 ? 'เลือกวันที่ที่ต้องการนัดหมายรับผู้ป่วย' : 'ระบุเวลาและหมายเหตุการตอบรับ'}
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
          </div>
        </DrawerHeader>
        
        <div className="flex-1 overflow-hidden relative bg-gray-50/50">
           {step === 1 && (
             <ScrollArea className="h-full w-full">
                 <div className="flex flex-col items-center pb-20 p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="w-full p-4"
                            classNames={{
                                month: "space-y-4 w-full",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex w-full justify-between",
                                row: "flex w-full mt-2 justify-between",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-gray-100",
                                day_selected: "bg-[#28c76f] text-white hover:bg-[#28c76f] hover:text-white focus:bg-[#28c76f] focus:text-white",
                                day_today: "bg-gray-100 text-gray-900",
                            }}
                            locale={th}
                            numberOfMonths={12}
                        />
                    </div>
                 </div>
             </ScrollArea>
           )}

           {step === 2 && (
             <ScrollArea className="h-full w-full animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="flex flex-col items-center p-4 md:p-8 min-h-full">
                     <div className="w-full max-w-md space-y-6 pb-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3">
                           <div className="h-14 w-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-1">
                              <CalendarIcon size={28} />
                           </div>
                           <div>
                              <div className="text-sm text-gray-500 mb-1">วันที่เลือก</div>
                              <div className="text-2xl font-bold text-gray-800">
                                {date && format(date, "d MMMM yyyy", { locale: th })}
                              </div>
                           </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <Label className="text-gray-600 mb-2 block flex items-center gap-2">
                                <Clock size={16} /> เวลาที่นัดหมาย
                            </Label>
                            <div className="relative">
                                <Input 
                                    type="time" 
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="pl-9 h-12 text-lg font-medium"
                                />
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                    <Button 
                    className="flex-1 bg-[#28c76f] hover:bg-[#20a35a] text-white h-12 text-base shadow-md shadow-green-200" 
                    onClick={handleConfirm}
                    >
                    ยืนยันการตอบรับ
                    </Button>
                </>
                )}
            </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
