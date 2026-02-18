import React, { useState, useEffect } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Card, CardContent } from "../../../../../components/ui/card";
import { X, CheckCircle2, Check, ChevronsUpDown, ChevronLeft, ClipboardList, ChevronRight } from "lucide-react";
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
import { VisitSelector } from './VisitSelector';
import { PCU_OPTIONS } from '../../patient/pcuSelector';

interface HomeVisitADDProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  initialPatientId?: string;
  initialPatient?: any;
  isModal?: boolean;
}

import { PATIENTS_DATA } from "../../../../../data/patientData";

export function HomeVisitADD({ onBack, onSubmit, initialPatientId, initialPatient, isModal = false }: HomeVisitADDProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId || initialPatient?.id || (PATIENTS_DATA[0]?.id || ""));
  const [visitType, setVisitType] = useState<'Joint' | 'Delegated'>('Joint');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showVisitSelector, setShowVisitSelector] = useState(false);
  const [selectedVisitForm, setSelectedVisitForm] = useState("");
  
  // Use PATIENTS_DATA for the search source
  const patientsSource = PATIENTS_DATA.map(p => ({
    id: p.hn || p.id,
    name: p.name,
    address: p.contact?.address || "ไม่ระบุที่อยู่",
    rph: p.hospitalInfo?.responsibleRph || p.responsibleHealthCenter || '-',
    original: p
  }));

  // Find selected patient
  const selectedPatient = patientsSource.find(p => p.id === selectedPatientId) || 
                          (initialPatient ? {
                              id: initialPatient.hn || initialPatient.id,
                              name: initialPatient.name,
                              address: initialPatient.contact?.address || initialPatient.address || "",
                              rph: initialPatient.hospitalInfo?.responsibleRph || initialPatient.responsibleHealthCenter || "",
                              original: initialPatient
                          } : null);

  useEffect(() => {
    if (selectedPatient) {
      setSearchQuery(selectedPatient.name);
    }
  }, [selectedPatient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Construct data object
    const data = {
      patientName: selectedPatient?.name || searchQuery,
      patientId: selectedPatient?.id || "N/A",
      patientAddress: selectedPatient?.address || "",
      patientImage: selectedPatient?.original?.image,
      type: visitType,
      visitForm: selectedVisitForm,
      rph: formData.get('rph'),
      note: formData.get('note'),
    };
    onSubmit(data);
  };

  // Show VisitSelector full-screen
  if (showVisitSelector) {
    return (
      <VisitSelector
        initialSelected={selectedVisitForm}
        onBack={() => setShowVisitSelector(false)}
        onSave={(value) => {
          setSelectedVisitForm(value);
          setShowVisitSelector(false);
        }}
      />
    );
  }

  return (
    <div className={cn(
      "flex items-start justify-center p-0 animate-in fade-in duration-300",
      isModal ? "min-h-fit bg-transparent md:bg-transparent md:p-0 items-stretch" : "fixed inset-0 z-[9999] overflow-y-auto min-h-screen bg-white md:bg-[#f8f9fa] md:items-center md:p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
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
          <div className="bg-[#7066a9] w-full shrink-0 z-20">
            <div className="h-[64px] px-4 flex items-center gap-3">
              <button 
                onClick={onBack} 
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-white text-lg font-bold">สร้างคำขอเยี่ยมบ้านใหม่</h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <CardContent className="p-4 md:p-6 space-y-6 flex-1">
            
            {/* 1. Search Patient */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-800">ค้นหาผู้ป่วย</Label>
              <div className="relative group">
                <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อ หรือ HN..." 
                    className="px-4 h-12 bg-white border-slate-200 rounded-xl focus:ring-[#7066a9] text-base shadow-sm peer border-[#7367f0]"
                />
                <div className="absolute top-full left-0 w-full bg-white border border-slate-200 shadow-xl rounded-xl mt-2 z-50 hidden peer-focus:block hover:block max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {patientsSource
                        .filter(patient => !searchQuery || patient.name.includes(searchQuery) || patient.id.includes(searchQuery))
                        .map((patient) => (
                            <div 
                                key={patient.id}
                                className="px-4 py-4 hover:bg-slate-50 cursor-pointer text-base text-[#5e5873] border-b border-slate-50 last:border-0"
                                onMouseDown={(e) => {
                                    e.preventDefault(); 
                                    setSelectedPatientId(patient.id);
                                    setSearchQuery(patient.name);
                                }}
                            >
                                {patient.name} ({patient.id})
                            </div>
                    ))}
                    {patientsSource.filter(patient => !searchQuery || patient.name.includes(searchQuery) || patient.id.includes(searchQuery)).length === 0 && (
                        <div className="px-4 py-4 text-base text-slate-400 text-center">ไม่พบข้อมูล</div>
                    )}
                </div>
              </div>
            </div>

            {/* 2. Visit Type */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-800">รูปแบบการเยี่ยม</Label>
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
                      ลงเยี่ยมร่วม
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
                      ฝากเยี่ยม
                    </span>
                    <span className="text-xs text-slate-500">ฝาก รพ.สต. เยี่ยมให้</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Visit Form Selector */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-800">ฟอร์มเยี่ยมบ้าน</Label>
              <div 
                onClick={() => setShowVisitSelector(true)} 
                className="relative cursor-pointer"
              >
                <div className={cn(
                  "h-12 px-4 bg-white border rounded-xl flex items-center justify-between transition-all",
                  selectedVisitForm 
                    ? "border-[#7367f0] bg-[#f8f7fa]" 
                    : "border-slate-200 hover:border-slate-300"
                )}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <ClipboardList size={18} className={selectedVisitForm ? "text-[#7367f0]" : "text-slate-400"} />
                    <span className={cn(
                      "text-base truncate",
                      selectedVisitForm ? "text-[#5e5873] font-medium" : "text-slate-400"
                    )}>
                      {selectedVisitForm || "เลือกฟอร์มเยี่ยมบ้าน..."}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                </div>
              </div>
              {selectedVisitForm && (
                <div className="flex items-center gap-2 px-1 animate-in fade-in duration-200">
                  <Check size={14} className="text-[#7367f0]" />
                  <span className="text-xs text-[#7367f0] font-medium">{selectedVisitForm}</span>
                  <button 
                    type="button"
                    onClick={() => setSelectedVisitForm("")}
                    className="ml-auto text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Responsibility Area */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-800">พื้นที่รับผิดชอบ (รพ.สต.)</Label>
              <Select key={selectedPatient?.id} name="rph" defaultValue={selectedPatient?.rph || '-'}>
                <SelectTrigger className="h-12 bg-white border border-slate-200 text-base rounded-xl focus-visible:ring-[#7066a9]">
                  <SelectValue placeholder="เลือกหน่วยบริการ" />
                </SelectTrigger>
                <SelectContent>
                  {selectedPatient?.rph && selectedPatient.rph !== '-' && !PCU_OPTIONS.some(o => o.label === selectedPatient.rph) && (
                    <SelectItem value={selectedPatient.rph}>{selectedPatient.rph}</SelectItem>
                  )}
                  {PCU_OPTIONS.map(pcu => (
                    <SelectItem key={pcu.id} value={pcu.label}>{pcu.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400 font-light text-[16px]">
                * ระบบเลือกให้อัตโนมัติตามที่อยู่ผู้ป่วย
              </p>
            </div>

            {/* 5. Note */}
            <div className="space-y-3">
              <Label htmlFor="note" className="text-base font-semibold text-slate-800">หมายเหตุ / อาการที่ต้องติดตาม</Label>
              <Textarea 
                id="note" 
                name="note" 
                placeholder="ระบุรายละเอียดเพิ่มเติม..." 
                className="min-h-[100px] bg-white border border-slate-200 resize-none rounded-xl text-base focus-visible:ring-[#7066a9]" 
              />
            </div>

          </CardContent>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 z-40 bg-white rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-5 py-4 flex items-center gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack} 
              className="h-[52px] rounded-full border-2 border-slate-200 bg-white text-[#3c3c3c] font-bold text-base hover:bg-slate-50 flex-1 shadow-none"
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              className="h-[52px] rounded-full bg-[#7066a9] hover:bg-[#5b528a] text-white font-bold text-base flex-1 shadow-[0_6px_20px_rgba(112,102,169,0.4)]"
            >
              ส่งคำขอ
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}