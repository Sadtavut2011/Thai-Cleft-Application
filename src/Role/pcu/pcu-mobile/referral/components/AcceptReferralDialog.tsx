import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog";
import { Label } from "../../../../../components/ui/label";
import { Input } from "../../../../../components/ui/input";
import { Textarea } from "../../../../../components/ui/textarea";
import { Calendar } from "../../../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { cn } from "../../../../../components/ui/utils";

interface AcceptReferralDialogProps {
    referralId: number | string;
    onAccept: (id: number, date?: Date, details?: string) => void;
    trigger: React.ReactNode;
}

export function AcceptReferralDialog({ referralId, onAccept, trigger }: AcceptReferralDialogProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [details, setDetails] = useState('');

    const handleConfirm = () => {
        onAccept(Number(referralId), date, details);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] font-['IBM_Plex_Sans_Thai']">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" /> ยืนยันการตอบรับ (Accept)
                    </DialogTitle>
                    <DialogDescription>
                        กำหนดวันนัดหมายและรายละเอียดการตอบรับผู้ป่วย
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="date" className="text-right">
                            วันที่นัดหมาย
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: th }) : <span>เลือกวันที่</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="details" className="text-right">
                            รายละเอียดเพิ่มเติม
                        </Label>
                        <Textarea
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="ระบุสถานที่นัดหมาย หรือข้อความถึงต้นทาง..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white">ยืนยันการตอบรับ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
