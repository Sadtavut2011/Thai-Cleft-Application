import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "../../../../components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

export function AcceptReferralDialog({ referralId, onAccept }: { referralId: number, onAccept: (id: number) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1 md:flex-none h-9 text-xs bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-100">
            ยอมรับคำขอ
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" /> ยืนยันการรับผู้ป่วย
          </DialogTitle>
          <DialogDescription>
            คุณต้องการยอมรับคำขอส่งตัวนี้ใช่หรือไม่? เมื่อยอมรับแล้วสถานะจะเปลี่ยนเป็น "ยอมรับแล้ว"
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onAccept(referralId)} className="bg-green-600 hover:bg-green-700 text-white">
            ยืนยัน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
