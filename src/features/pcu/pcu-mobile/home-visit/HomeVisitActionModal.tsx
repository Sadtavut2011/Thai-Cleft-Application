import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";

interface HomeVisitActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  reportTime: string;
  symptoms: string;
  location: string;
}

export function HomeVisitActionModal({ isOpen, onClose, patientName, reportTime, symptoms, location }: HomeVisitActionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Home Visit Action</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p><strong>Patient:</strong> {patientName}</p>
          <p><strong>Time:</strong> {reportTime}</p>
          <p><strong>Symptoms:</strong> {symptoms}</p>
          <p><strong>Location:</strong> {location}</p>
          <div className="flex gap-2 mt-4">
             <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
