import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";

interface HomeVisitProceedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HomeVisitProceedModal({ isOpen, onClose }: HomeVisitProceedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Proceed Home Visit</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Proceeding with home visit...</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
