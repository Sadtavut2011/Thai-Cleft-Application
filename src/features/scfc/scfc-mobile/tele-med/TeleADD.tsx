import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Video, 
  Calendar, 
  Clock, 
  Link as LinkIcon, 
  ExternalLink, 
  User, 
  Building2, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Info,
  Loader2,
  Trash2,
  Globe,
  Activity,
  UserPlus
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Separator } from "../../../../components/ui/separator";
import { ScrollArea, ScrollBar } from "../../../../components/ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { cn } from "../../../../components/ui/utils";

interface TeleADDProps {
  onBack: () => void;
  onSave: (data: any) => void;
  initialData?: any; // For Edit Mode
}

// Mock Due Patients Data
const DUE_PATIENTS = [
  {
    id: "p-due-1",
    name: "ด.ช. อานนท์ รักดี",
    hn: "HN66001",
    treatment: "ประเมินอรรถบำบัด (Speech Evaluation)",
    status: "due-today",
    age: "8 ปี",
    province: "เชียงใหม่",
    lastVisit: "15 ธ.ค. 2568"
  },
  {
    id: "p-due-2",
    name: "น.ส. มะลิ แซ่ลี้",
    hn: "HN66052",
    treatment: "ตรวจสุขภาพฟันและช่องปาก (Dental Check)",
    status: "upcoming",
    age: "12 ปี",
    province: "เชียงราย",
    lastVisit: "20 ธ.ค. 2568"
  },
  {
    id: "p-due-3",
    name: "นาย ปิติ ยินดี",
    hn: "HN66112",
    treatment: "ปรึกษาศัลยกรรมตกแต่ง (Plastic Surgery)",
    status: "due-today",
    age: "19 ปี",
    province: "ลำพูน",
    lastVisit: "10 ม.ค. 2569"
  }
];

export function TeleADD({ onBack, onSave, initialData }: TeleADDProps) {
  const isEdit = !!initialData;
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState(isEdit ? initialData.hn : "");
  const [selectedPatient, setSelectedPatient] = useState<any>(isEdit ? initialData : null);
  const [requestType, setRequestType] = useState<string>(initialData?.requestType || "direct");
  const [meetingUrl, setMeetingUrl] = useState(initialData?.meetingUrl || "");

  // Drag to scroll logic
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSearch = (query?: string) => {
    // If dragging, prevent click event
    if (isDragging) return;

    const term = query || searchQuery;
    if (!term) return;
    
    // Simulate searching
    const found = DUE_PATIENTS.find(p => p.hn === term || p.name.includes(term));
    
    if (found) {
      setSelectedPatient(found);
      setSearchQuery(found.hn);
    } else {
      // Default mock if not found in list
      setSelectedPatient({
        name: term.includes("HN") ? "ผู้ป่วยใหม่ (Mock)" : term,
        hn: term.includes("HN") ? term : "HN-NEW-001",
        age: "N/A",
        province: "N/A",
        lastVisit: "N/A"
      });
    }
    toast.success("ดึงข้อมูลโปรไฟล์ผู้ป่วยเรียบร้อยแล้ว");
  };

  const handleTestLink = () => {
    if (!meetingUrl) {
      toast.error("กรุณาใส่ URL ของห้องประชุมก่อน");
      return;
    }
    toast.info("กำลังตรวจสอบลิงก์...", { icon: <Globe size={16} /> });
    setTimeout(() => {
      toast.success("ลิงก์ถูกต้อง พร้อมใช้งาน");
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("บันทึกและส่งการแจ้งเตือนเรียบร้อยแล้ว", {
        description: `ส่งข้อมูลนัดหมายไปยัง ${requestType === 'direct' ? selectedPatient.name : 'รพ.สต. ปลายทาง'}`,
      });
      onBack();
    }, 1500);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
      {/* CSS Hack to hide Sidebar Navigation */}
      <style>{`
        .fixed.bottom-0.left-0.w-full.bg-white.z-50.flex-row.items-center.flex {
          display: none !important;
        }
      `}</style>
      
      {/* 1. Sticky Header - Matches TeleList/TeleConsultationSystem */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 p-0 border-none">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-2">
               <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">
                 {isEdit ? "แก้ไขนัดหมาย" : "สร้างนัดหมาย"}
               </h1>
            </div>
          </div>
        </div>
        
        {isEdit && (
           <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-50 rounded-full h-9 w-9">
              <Trash2 size={18} />
           </Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* 2. Patient Search & Suggestions Header */}
        {!isEdit && (
          <div className="space-y-4">
            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-slate-700">ค้นหาผู้ป่วย</Label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input 
                            placeholder="HN / ชื่อ-นามสกุล..." 
                            className="pl-9 h-11 bg-slate-50 border-slate-200 focus:bg-white text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button onClick={() => handleSearch()} className="h-11 bg-slate-900 text-white rounded-lg px-4 shrink-0">
                            ค้นหา
                        </Button>
                    </div>
                </div>

                {selectedPatient && (
                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 flex items-start gap-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 bg-white rounded-lg border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm shrink-0">
                        <User size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-bold text-slate-900 text-sm truncate">{selectedPatient.name}</h3>
                                <p className="text-xs text-slate-500">HN: {selectedPatient.hn}</p>
                             </div>
                             {isEdit && <Badge className="bg-amber-100 text-amber-700 border-none text-[10px]">Edit</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-slate-500">
                          <span className="bg-white px-2 py-0.5 rounded border border-teal-100/50">อายุ: {selectedPatient.age}</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-teal-100/50">{selectedPatient.province}</span>
                        </div>
                      </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Due for Treatment Suggestions */}
            {!selectedPatient && (
              <div className="space-y-3">
                 <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Activity className="text-teal-600" size={16} />
                        ผู้ป่วยถึงกำหนด (Due)
                    </h3>
                 </div>
                 
                 {/* ScrollArea replaced with custom div for drag-to-scroll */}
                 <div 
                    ref={scrollContainerRef}
                    className="w-full overflow-x-auto whitespace-nowrap -mx-4 px-4 pb-2 cursor-grab active:cursor-grabbing no-scrollbar"
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
                 >
                    <div className="inline-flex gap-3">
                       {DUE_PATIENTS.map((p) => (
                         <div 
                          key={p.id} 
                          className="w-[280px] shrink-0 bg-white border border-slate-200 shadow-sm rounded-xl p-4 active:scale-95 transition-transform select-none"
                          onClick={(e) => {
                             // Only trigger if not dragging (simple heuristic: if mouse didn't move much)
                             handleSearch(p.hn)
                          }}
                         >
                              <div className="flex justify-between items-start mb-3">
                                 <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
                                    <User size={16} />
                                 </div>
                                 <Badge className={cn(
                                   "text-[10px] font-bold border-none px-2 h-5",
                                   p.status === 'due-today' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                                 )}>
                                   {p.status === 'due-today' ? 'วันนี้' : 'พรุ่งนี้'}
                                 </Badge>
                              </div>
                              <div className="space-y-1 mb-3">
                                 <h4 className="font-bold text-slate-900 text-sm truncate">{p.name}</h4>
                                 <p className="text-xs text-slate-500">HN: {p.hn}</p>
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 h-[46px] whitespace-normal">
                                {p.treatment}
                              </p>
                              <Button variant="ghost" className="w-full h-8 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold rounded-lg pointer-events-none">
                                    สร้างนัดหมาย
                              </Button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        )}

        {selectedPatient && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              
              {/* Consultation Details */}
              <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 px-4">
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-teal-600" /> รายละเอียดนัดหมาย
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600">เรื่องที่ปรึกษา</Label>
                    <Textarea 
                      placeholder="ระบุวัตถุประสงค์..." 
                      className="min-h-[100px] rounded-xl border-slate-200 bg-white text-sm resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600">วันที่</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <Input type="date" className="h-10 pl-9 rounded-lg border-slate-200 text-sm" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600">เวลา</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <Input type="time" className="h-10 pl-9 rounded-lg border-slate-200 text-sm" required />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Integration */}
              <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 px-4">
                  <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Video className="w-4 h-4 text-teal-600" /> ห้องประชุม (Meeting URL)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <Input 
                          placeholder="วางลิงก์ Zoom / Meet..." 
                          className="h-10 pl-9 rounded-lg border-slate-200 bg-white text-sm"
                          value={meetingUrl}
                          onChange={(e) => setMeetingUrl(e.target.value)}
                          required
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={handleTestLink}
                        className="h-10 w-10 border-slate-200 text-slate-600 rounded-lg shrink-0"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Zoom', 'Teams', 'Meet'].map((p) => (
                            <span key={p} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-medium border border-slate-200">{p}</span>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recipient */}
              <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-3 px-4">
                  <CardTitle className="text-sm font-bold text-slate-700">ผู้รับปลายทาง</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <RadioGroup value={requestType} onValueChange={setRequestType} className="grid grid-cols-1 gap-3">
                    <Label
                      htmlFor="direct"
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        requestType === "direct" ? "border-teal-500 bg-teal-50/50" : "border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", requestType === "direct" ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400")}>
                          <User size={16} />
                      </div>
                      <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">ส่งตรงผู้ป่วย</p>
                          <p className="text-[10px] text-slate-500">แจ้งเตือนผ่าน SMS/App</p>
                      </div>
                      <RadioGroupItem value="direct" id="direct" className="text-teal-600" />
                    </Label>

                    <Label
                      htmlFor="via-hospital"
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        requestType === "via-hospital" ? "border-teal-500 bg-teal-50/50" : "border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", requestType === "via-hospital" ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400")}>
                          <Building2 size={16} />
                      </div>
                      <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">ผ่านหน่วยงาน (PCU)</p>
                          <p className="text-[10px] text-slate-500">เจ้าหน้าที่ประสานงานต่อ</p>
                      </div>
                      <RadioGroupItem value="via-hospital" id="via-hospital" className="text-teal-600" />
                    </Label>
                  </RadioGroup>

                  {requestType === "via-hospital" && (
                     <div className="animate-in slide-in-from-top-1">
                        <Select required>
                          <SelectTrigger className="h-10 rounded-lg border-slate-200 text-sm">
                            <SelectValue placeholder="เลือกหน่วยงาน..." />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="p1">รพ.สต. บ้านหนองหอย</SelectItem>
                             <SelectItem value="p2">รพ.สต. ดอยสะเก็ด</SelectItem>
                             <SelectItem value="p3">รพ.สต. สันกำแพง</SelectItem>
                          </SelectContent>
                        </Select>
                     </div>
                  )}
                </CardContent>
              </Card>

              {/* Submit Section */}
              <>
                <div className="h-32" />
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.05)] pb-8 flex items-center gap-3">
                  <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onBack} 
                      className="flex-1 h-12 text-slate-600 border-slate-200 hover:bg-slate-50 font-bold text-sm rounded-xl"
                  >
                      ยกเลิก
                  </Button>
                  <Button 
                      type="submit" 
                      disabled={isSaving}
                      className="flex-[2] h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-600/20"
                  >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          กำลังบันทึก...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          {isEdit ? "บันทึกการแก้ไข" : "ยืนยันนัดหมาย"}
                        </>
                      )}
                  </Button>
                </div>
              </>
          </form>
        )}
      </div>
    </div>
  );
}

// Internal History Helper Icon (Unused in new clean design, but kept if referenced)
function History({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}