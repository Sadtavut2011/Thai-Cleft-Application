import React from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ChevronLeft, Save } from "lucide-react";

interface HospitalDataSystemEditProps {
  onBack: () => void;
}

export function HospitalDataSystemEdit({ onBack }: HospitalDataSystemEditProps) {
  return (
    <div className="bg-white min-h-full rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300 relative">
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
               <ChevronLeft className="w-5 h-5 text-slate-500" />
             </Button>
             <div>
                <h2 className="text-2xl font-bold text-slate-800">แก้ไขข้อมูลโรงพยาบาล</h2>
                <p className="text-slate-500 text-sm">ปรับปรุงรายละเอียดหน่วยงาน</p>
             </div>
        </div>
        <Button onClick={onBack} className="bg-[#5e50ee] text-white">
          <Save className="mr-2 h-4 w-4" /> บันทึก
        </Button>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label>ชื่อหน่วยงาน</Label>
          <Input defaultValue="โรงพยาบาลมหาราชนครเชียงใหม่" />
        </div>
        <div className="space-y-2">
          <Label>รหัสหน่วยงาน</Label>
          <Input defaultValue="10001" />
        </div>
        <div className="space-y-2">
          <Label>จังหวัด</Label>
          <Input defaultValue="เชียงใหม่" />
        </div>
      </div>
    </div>
  );
}
