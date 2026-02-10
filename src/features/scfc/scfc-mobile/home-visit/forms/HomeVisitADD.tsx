import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Card, CardContent } from "../../../../../components/ui/card";
import { X, CheckCircle2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  
} from "../../../../../components/ui/popover"
import { TopHeader } from '../../../../../components/shared/layout/TopHeader';
import { MinHeader } from '../../../../../components/shared/layout/MinHeader';

interface HomeVisitADDProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  initialPatientId?: string;
  initialPatient?: any;
  isModal?: boolean;
}

const MOCK_PATIENTS = [
  { id: "HN001", name: "ด.ช. สมชาย รักดี", address: "123 ม.1 ต.บ้านใหม่", rph: "รพ.สต. บ้านใหม่" },
  { id: "HN002", name: "ด.ญ. มานี ใจผ่อง", address: "45 ม.2 ต.ทุ่งนา", rph: "รพ.สต. ทุ่งนา" },
  { id: "HN003", name: "ด.ช. ปิติ มีทรัพย์", address: "88 ม.5 ต.ดอนเมือง", rph: "รพ.สต. ดอนเมือง" },
];

export function HomeVisitADD({ onBack, onSubmit, initialPatientId, initialPatient, isModal = false }: HomeVisitADDProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId || initialPatient?.id || "HN001");
  const [visitType, setVisitType] = useState<'Joint' | 'Delegated'>('Joint');
  const [open, setOpen] = useState(false);
  
  // Try to find in mock data first, otherwise use initialPatient if provided
  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId) || 
                          (initialPatient && (initialPatient.id === selectedPatientId || initialPatient.hn === selectedPatientId) ? initialPatient : null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Construct data object
    const data = {
      patientName: selectedPatient?.name || (selectedPatient?.firstName ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : ""),
      patientId: selectedPatient?.id || selectedPatient?.hn,
      patientAddress: selectedPatient?.address || (selectedPatient?.contact?.address),
      type: visitType,
      rph: formData.get('rph'),
      note: formData.get('note'),
    };
    onSubmit(data);
  };

  return (
    <div className={cn(
      "flex items-start justify-center p-0 animate-in fade-in duration-300",
      isModal ? "min-h-fit bg-transparent md:bg-transparent md:p-0 items-stretch" : "fixed inset-0 z-[9999] overflow-y-auto min-h-screen bg-white md:bg-[#f8f9fa] md:items-center md:p-4"
    )}>
      {/* CSS Hack to hide mobile bottom navigation */}
      <style>{`
        .fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
            display: none !important;
        }
      `}</style>
      
      <Card className={cn(
        "w-full bg-white flex flex-col",
        isModal ? "shadow-none border-0 rounded-none h-full" : "md:max-w-[600px] shadow-none md:shadow-xl rounded-none md:rounded-2xl border-0 min-h-screen md:min-h-fit"
      )}>
        
        {/* Header */}
        <div className="sticky top-0 z-50 flex flex-col shrink-0 shadow-sm">
          <TopHeader />
          <div className="bg-[#7066a9]">
            <MinHeader onBack={onBack} title="สร้างคำขอเยี่ยมบ้านใหม่" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <CardContent className="p-4 md:p-6 space-y-6 flex-1">
            
            {/* 1. Search Patient */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-800">1. ค้นหาผู้ป่วย</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-12 bg-gray-50/50 border-gray-200 text-base rounded-xl font-normal hover:bg-gray-100 hover:text-slate-900"
                  >
                    {selectedPatient
                      ? (selectedPatient.name || `${selectedPatient.firstName || ''} ${selectedPatient.lastName || ''}`.trim()) + " (" + (selectedPatient.id || selectedPatient.hn) + ")"
                      : "ค้นหาผู้ป่วย..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="พิมพ์ชื่อ หรือ HN..." />
                    <CommandList>
                      <CommandEmpty>ไม่พบผู้ป่วย</CommandEmpty>
                      <CommandGroup>
                        {MOCK_PATIENTS.map((patient) => (
                          <CommandItem
                            key={patient.id}
                            value={`${patient.name} ${patient.id}`}
                            onSelect={() => {
                              setSelectedPatientId(patient.id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPatientId === patient.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {patient.name} ({patient.id})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Patient Info Box */}
              {selectedPatient && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-1">
                  <span className="font-semibold text-[#5e5873]">{selectedPatient.name}</span>
                  <span className="text-slate-500 text-sm">{selectedPatient.address}</span>
                </div>
              )}
            </div>

            {/* 2. Visit Type */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-800">2. รูปแบบการเยี่ยม</Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Type: Joint */}
                <div 
                  onClick={() => setVisitType('Joint')}
                  className={cn(
                    "cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 relative overflow-hidden",
                    visitType === 'Joint' 
                      ? "border-[#7367f0] bg-[#f8f7fa]" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "font-bold text-base",
                      visitType === 'Joint' ? "text-[#5e5873]" : "text-slate-600"
                    )}>
                      Joint Visit
                    </span>
                    <span className="text-xs text-slate-500">รพ. ลงเยี่ยมพร้อม รพ.สต.</span>
                  </div>
                </div>

                {/* Type: Delegated */}
                <div 
                  onClick={() => setVisitType('Delegated')}
                  className={cn(
                    "cursor-pointer rounded-xl p-4 border-2 transition-all duration-200 relative overflow-hidden",
                    visitType === 'Delegated' 
                      ? "border-[#7367f0] bg-[#f8f7fa]" 
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "font-bold text-base",
                      visitType === 'Delegated' ? "text-[#5e5873]" : "text-slate-600"
                    )}>
                      Delegated
                    </span>
                    <span className="text-xs text-slate-500">ฝาก รพ.สต. เยี่ยมให้</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Responsibility Area */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-800">3. พื้นที่รับผิดชอบ (รพ.สต.)</Label>
              <Select name="rph" defaultValue={selectedPatient?.rph || "รพ.สต. บ้านใหม่"}>
                <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 text-base rounded-xl">
                  <SelectValue placeholder="เลือกหน่วยบริการ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="รพ.สต. บ้านใหม่">รพ.สต. บ้านใหม่</SelectItem>
                  <SelectItem value="รพ.สต. ทุ่งนา">รพ.สต. ทุ่งนา</SelectItem>
                  <SelectItem value="รพ.สต. ดอนเมือง">รพ.สต. ดอนเมือง</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400 font-light">
                * ระบบเลือกให้อัตโนมัติตามที่อยู่ผู้ป่วย
              </p>
            </div>

            {/* 4. Note */}
            <div className="space-y-3">
              <Label htmlFor="note" className="text-base font-semibold text-slate-800">หมายเหตุ / อาการที่ต้องติดตาม</Label>
              <Textarea 
                id="note" 
                name="note" 
                placeholder="ระบุรายละเอียดเพิ่มเติม..." 
                className="min-h-[100px] bg-gray-50/50 border-gray-200 resize-none rounded-xl text-base" 
              />
            </div>

          </CardContent>

          {/* Footer Buttons */}
          <div className="p-4 md:p-6 pt-4 flex items-center justify-between gap-4 bg-white">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack} 
              className="h-12 px-8 rounded-full border-slate-200 text-slate-600 font-bold text-base hover:bg-slate-50 flex-1 md:flex-none md:w-40"
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-8 rounded-full bg-[#7066a9] hover:bg-[#5b528a] text-white font-bold text-base shadow-lg shadow-indigo-200 flex-1 md:flex-none md:w-48"
            >
              ส่งคำขอ
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
