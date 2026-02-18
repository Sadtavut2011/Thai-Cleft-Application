import React from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

interface TeleADDProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

export function TeleADD({ onBack, onSave }: TeleADDProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-2xl font-bold">สร้างห้อง Tele-consult ใหม่</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลการนัดหมาย</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>ชื่อผู้ป่วย</Label>
            <Input placeholder="ระบุชื่อผู้ป่วย" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onBack}>ยกเลิก</Button>
            <Button onClick={() => onSave({ status: 'created' })}>
              <Save className="w-4 h-4 mr-2" /> บันทึก
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
