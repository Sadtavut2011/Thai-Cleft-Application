import React, { useState } from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter, 
  DrawerDescription, 
  DrawerTrigger, 
  DrawerClose 
} from "../../../../../components/ui/drawer";
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface RejectedReferralDialogProps {
  trigger: React.ReactNode;
  onConfirm: (reason: string) => void;
}

export const RejectedReferralDialog: React.FC<RejectedReferralDialogProps> = ({ 
  trigger,
  onConfirm 
}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setReason('');
    }
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error("กรุณาระบุเหตุผล");
      return;
    }
    onConfirm(reason);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent className="z-[50000] font-['IBM_Plex_Sans_Thai']">
        <DrawerHeader>
          <DrawerTitle className="text-[#DC2626] flex items-center justify-center gap-2 pt-4 text-xl font-bold">
            <AlertTriangle className="h-6 w-6" />
            ยืนยันการปฏิเสธคำขอ
          </DrawerTitle>
          <DrawerDescription className="text-center px-4 text-gray-500 text-sm mt-2 leading-relaxed">
            การปฏิเสธคำขอส่งตัว จะทำให้สถานะเปลี่ยนเป็น "ปฏิเสธ" <br/>
            และไม่สามารถดำเนินการต่อได้
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 py-4">
          <div className="grid gap-2">
            <Label className="text-[#DC2626] font-bold text-sm">
              เหตุผลการปฏิเสธ *
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="ระบุสาเหตุที่ต้องการยกเลิก..."
              className="min-h-[120px] border-red-200 focus:border-red-400 focus:ring-red-100 bg-red-50/10 text-base rounded-xl resize-none p-3"
            />
          </div>
        </div>
        <DrawerFooter className="px-6 pb-8 pt-2 gap-3">
          <Button 
            variant="destructive" 
            className="w-full h-12 text-base font-bold bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-none"
            onClick={handleConfirm}
          >
            ยืนยันการปฏิเสธ
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full h-12 text-base font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl">
              กลับ
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
