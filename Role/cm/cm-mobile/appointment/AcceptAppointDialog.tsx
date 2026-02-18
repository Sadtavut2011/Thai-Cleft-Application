import React, { useState, useEffect } from 'react';
import { Button } from "../../../../components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription, DrawerTrigger, DrawerClose } from "../../../../components/ui/drawer";
import { Calendar } from "../../../../components/ui/calendar";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import { CheckCircle2, X, Clock } from "lucide-react";
import { th } from "date-fns/locale";

const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const toTimeString = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

interface AcceptAppointDialogProps {
  mode: 'date' | 'time';
  onSave: (date: Date, details?: string) => void;
  trigger?: React.ReactNode;
  initialDate?: Date;
  title?: string;
  description?: string;
  confirmLabel?: string;
}

export function AcceptAppointDialog({ 
  mode,
  onSave, 
  trigger, 
  initialDate, 
  title,
  description,
  confirmLabel
}: AcceptAppointDialogProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState(initialDate ? toTimeString(initialDate) : toTimeString(new Date()));
  const [details, setDetails] = useState('');
  const [open, setOpen] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      if (initialDate) {
        setDate(initialDate);
        setTime(toTimeString(initialDate));
      } else {
        setDate(new Date());
        setTime(toTimeString(new Date()));
      }
      setDetails('');
    }
  }, [open, initialDate]);

  const handleConfirm = () => {
    if (!date && mode === 'date') return;
    
    // Combine date and time based on mode
    const finalDate = new Date(date || new Date());
    
    if (mode === 'time') {
       const [hours, minutes] = time.split(':').map(Number);
       finalDate.setHours(hours);
       finalDate.setMinutes(minutes);
    }
    
    onSave(finalDate, details);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger || (
          <Button size="sm" className="h-9 text-xs bg-[#28c76f] hover:bg-[#20a35a] text-white flex-1 md:flex-none">
               <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> เลือก
          </Button>
        )}
      </DrawerTrigger>
      
      <DrawerContent className={`z-[50000] ${mode === 'time' ? 'h-auto' : 'max-h-[85vh] h-[75vh]'}`}>
        {mode === 'date' ? (
            <>
                <DrawerHeader className="px-6 border-b shrink-0 bg-white">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <DrawerTitle className="text-xl">
                            {title || 'เลือกวันที่'}
                        </DrawerTitle>
                        <DrawerDescription>
                            {description || 'เลือกวันที่ที่ต้องการนัดหมาย'}
                        </DrawerDescription>
                     </div>
                     <DrawerClose asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                         </Button>
                     </DrawerClose>
                  </div>
                </DrawerHeader>
                
                <div className="flex-1 overflow-hidden relative bg-gray-50/50">
                     <div className="h-full w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                                    formatters={{
                                        formatCaption: (date) => {
                                            const year = date.getFullYear() + 543;
                                            return `${THAI_MONTHS[date.getMonth()]} ${year}`;
                                        }
                                    }}
                                    numberOfMonths={1}
                                />
                            </div>
                         </div>
                     </div>
                </div>

                <DrawerFooter className="p-4 border-t bg-white shrink-0">
                    <div className="w-full max-w-md mx-auto flex gap-3">
                        <DrawerClose asChild>
                           <Button variant="outline" className="flex-1 h-12 text-base">ยกเลิก</Button>
                        </DrawerClose>
                        <Button 
                        className="flex-1 bg-[#28c76f] hover:bg-[#20a35a] text-white h-12 text-base shadow-md shadow-green-200" 
                        onClick={handleConfirm}
                        disabled={!date}
                        >
                        {confirmLabel || 'บันทึก'}
                        </Button>
                    </div>
                </DrawerFooter>
            </>
        ) : (
            // TIME MODE - Light Style (Consistent with Date Mode)
            <>
                <DrawerHeader className="px-6 border-b shrink-0 bg-white">
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <DrawerTitle className="text-xl">
                            {title || 'ระบุเวลา'}
                        </DrawerTitle>
                        <DrawerDescription>
                            {description || 'ระบุเวลาที่ต้องการนัดหมาย'}
                        </DrawerDescription>
                     </div>
                     <DrawerClose asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                         </Button>
                     </DrawerClose>
                  </div>
                </DrawerHeader>

                {/* Content - Picker Area */}
                <div className="flex-1 overflow-hidden bg-gray-50/50 py-8">
                     {/* The Picker Container - Full Width White Background */}
                     <div className="w-full bg-white h-80 flex justify-center">
                        {/* Constrained Width Content */}
                        <div className="relative w-full max-w-[280px] h-full flex text-lg select-none">
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
                </div>

                <DrawerFooter className="p-4 border-t bg-white shrink-0">
                    <div className="w-full max-w-md mx-auto flex gap-3">
                        <DrawerClose asChild>
                           <Button variant="outline" className="flex-1 h-12 text-base">ยกเลิก</Button>
                        </DrawerClose>
                        <Button 
                        className="flex-1 bg-[#28c76f] hover:bg-[#20a35a] text-white h-12 text-base shadow-md shadow-green-200" 
                        onClick={handleConfirm}
                        >
                        {confirmLabel || 'บันทึก'}
                        </Button>
                    </div>
                </DrawerFooter>
            </>
        )}
      </DrawerContent>
    </Drawer>
  );
}