import React, { useState } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Label } from "../../../../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../../components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Textarea } from "../../../../components/ui/textarea";
import { 
  ArrowLeft,
  ChevronLeft,
  Video, 
  Search, 
  Clock, 
  Calendar, 
  User, 
  Smartphone, 
  Building2, 
  Link as LinkIcon,
  Edit,
  CheckCircle2,
  XCircle,
  Printer,
  Filter,
  Stethoscope,
  MapPin
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from 'sonner@2.0.3';
import FigmaConfirmDialog from '../../../../components/shared/FigmaConfirmDialog';

const THAI_MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const formatShortThaiDate = (d: Date) => `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]}`;

import { TeleForm } from './TeleForm';

interface TeleConsultationSystemProps {
  onBack?: () => void;
}

// --- Mock Data Types ---

type ChannelType = 'Direct' | 'Intermediary';

interface TeleAppointment {
  id: string;
  patientName: string;
  hn: string;
  treatmentDetails: string;
  date: string;
  time: string;
  meetingLink: string;
  channel: ChannelType;
  intermediaryName?: string; // Optional: Only if channel is Intermediary
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  // Mock participants for detail view
  caseManager?: string;
  hospital?: string;
  pcu?: string;
  zoomUser?: string;
}

// --- Mock Data ---

const MOCK_APPOINTMENTS: TeleAppointment[] = [
  {
    id: "TC-001",
    patientName: "นาย สมชาย รักดี",
    hn: "HN001",
    treatmentDetails: "ติดตามอาการเบาหวานและความดัน",
    date: "2025-12-25",
    time: "10:00",
    meetingLink: "https://zoom.us/j/123456789",
    channel: "Direct",
    status: "Scheduled",
    caseManager: "พยาบาลวิชาชีพ ใจดี มีเมตตา",
    hospital: "โรงพยาบาลนครพิงค์",
    pcu: "รพ.สต.บ้านดอนแก้ว",
    zoomUser: "นาย สมชาย รักดี"
  },
  {
    id: "TC-002",
    patientName: "นาง สมหญิง จริงใจ",
    hn: "HN002",
    treatmentDetails: "ปรึกษาปัญหาแผลเรื้อรัง",
    date: "2025-12-26",
    time: "14:30",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    channel: "Intermediary",
    intermediaryName: "รพ.สต. บ้านหนองหอย",
    status: "Scheduled",
    caseManager: "พยาบาลวิชาชีพ สุภาพ เรียบร้อย",
    hospital: "โรงพยาบาลนครพิงค์",
    pcu: "รพ.สต.บ้านหนองหอย",
    zoomUser: "เจ้าหน้าที่ รพ.สต."
  }
];

const MOCK_HISTORY: TeleAppointment[] = [
  {
    id: "TC-003",
    patientName: "นาย สมชาย รักดี",
    hn: "HN001",
    treatmentDetails: "ติดตามผลการปรับยา",
    date: "2025-11-20",
    time: "09:00",
    meetingLink: "https://zoom.us/j/987654321",
    channel: "Direct",
    status: "Completed",
    caseManager: "พยาบาลวิชาชีพ ใจดี มีเมตตา",
    hospital: "โรงพยาบาลนครพิงค์",
    pcu: "รพ.สต.บ้านดอนแก้ว",
    zoomUser: "นาย สมชาย รักดี"
  },
  {
    id: "TC-004",
    patientName: "ด.ช. กล้าหาญ ชาญชัย",
    hn: "HN005",
    treatmentDetails: "ประเมินพัฒนาการเด็ก",
    date: "2025-11-15",
    time: "13:00",
    meetingLink: "https://zoom.us/j/555666777",
    channel: "Intermediary",
    intermediaryName: "โรงพยาบาลแม่แตง",
    status: "Completed"
  },
    {
    id: "TC-005",
    patientName: "นาง มานี มีตา",
    hn: "HN006",
    treatmentDetails: "ติดตามอาการผื่นคัน",
    date: "2025-11-10",
    time: "10:00",
    meetingLink: "-",
    channel: "Direct",
    status: "Cancelled"
  }
];

export function TeleConsultationSystem({ onBack }: TeleConsultationSystemProps) {
  const [appointments, setAppointments] = useState<TeleAppointment[]>(MOCK_APPOINTMENTS);
  const [history, setHistory] = useState<TeleAppointment[]>(MOCK_HISTORY);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [viewingData, setViewingData] = useState<TeleAppointment | null>(null);
  const [formData, setFormData] = useState<Partial<TeleAppointment>>({
    channel: 'Direct',
    status: 'Scheduled'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  // Handlers
  const handleCreateClick = () => {
    setFormData({
      id: `TC-${Date.now()}`,
      channel: 'Direct',
      status: 'Scheduled',
      caseManager: "พยาบาลวิชาชีพ (ยังไม่ระบุ)",
      hospital: "โรงพยาบาลนครพิงค์",
      pcu: "-",
      zoomUser: "-"
    });
    setErrors({});
    setIsEditing(true);
    setIsCreateOpen(true);
  };

  const handleEditClick = (apt: TeleAppointment) => {
    setViewingData(apt);
  };

  const handleCancelClick = (id: string) => {
    setCancelTargetId(id);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientName) newErrors.patientName = "กรุณาระบุชื่อผู้ป่วย";
    if (!formData.date) newErrors.date = "กรุณาระบุวันที่";
    if (!formData.time) newErrors.time = "กรุณาระบุเวลา";
    if (!formData.treatmentDetails) newErrors.treatmentDetails = "กรุณาระบุรายละเอียดการรักษา";
    if (!formData.meetingLink) newErrors.meetingLink = "กรุณาระบุลิงค์การประชุม";
    
    if (formData.channel === 'Intermediary' && !formData.intermediaryName) {
      newErrors.intermediaryName = "กรุณาระบุชื่อหน่วยงานตัวกลาง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (appointments.some(a => a.id === formData.id)) {
      // Update
      setAppointments(prev => prev.map(a => a.id === formData.id ? formData as TeleAppointment : a));
      toast.success("บันทึกการแก้ไขเรียบร้อยแล้ว");
    } else {
      // Create
      setAppointments(prev => [formData as TeleAppointment, ...prev]);
      toast.success("สร้างนัดหมาย Tele-consult ใหม่เรียบร้อยแล้ว");
    }
    setIsCreateOpen(false);
  };

  const filteredAppointments = appointments.filter(a => 
    (a.patientName.includes(searchTerm) || a.hn.includes(searchTerm)) &&
    a.status !== 'Cancelled'
  );

  if (viewingData) {
    return (
      <TeleForm 
        data={viewingData}
        onBack={() => setViewingData(null)}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['Montserrat','Noto_Sans_Thai',sans-serif] animate-in fade-in duration-300">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">ระบบ Tele-consult</h1>
      </div>

      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* Main Content Card */}
      <Card className="border-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
        
        {/* Card Header with Search */}
        <div className="p-6 border-b border-[#EBE9F1] flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#5e5873] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#7367f0]" /> รายการนัดหมาย
            </h2>
             
             {/* Search */}
             <div className="relative w-full max-w-[300px]">
                <Input 
                  placeholder="ค้นหาชื่อผู้ป่วย, HN..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pr-10 h-[40px] border-[#EBE9F1] bg-white focus:ring-[#40bfff]"
                />
                <div className="absolute right-0 top-0 h-full w-10 bg-[#28C76F] flex items-center justify-center rounded-r-md cursor-pointer hover:bg-[#23af62]">
                    <Search className="h-4 w-4 text-white" />
                </div>
             </div>
        </div>

        <div className="p-0">
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                {/* Filters Section */}
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50/50 border-b border-gray-200 items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Filter className="w-4 h-4" /> ตัวกรอง:
                    </div>
                    
                    <TabsList className="bg-white border border-gray-200 h-9 p-1">
                        <TabsTrigger value="upcoming" className="text-xs h-7 data-[state=active]:bg-[#7367f0] data-[state=active]:text-white">
                            นัดหมาย
                        </TabsTrigger>
                        <TabsTrigger value="history" className="text-xs h-7 data-[state=active]:bg-[#7367f0] data-[state=active]:text-white">
                            ประวัติ
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab: Upcoming Appointments */}
                <TabsContent value="upcoming" className="mt-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-[#f8f9fa] border-b border-[#EBE9F1]">
                                <tr>
                                    <th className="px-2 py-2 font-semibold text-[#5e5873] text-[10px] text-center w-[70px]">วัน/เวลา</th>
                                    <th className="px-2 py-2 font-semibold text-[#5e5873] text-[10px]">ผู้ป่วย</th>
                                    <th className="px-2 py-2 font-semibold text-[#5e5873] text-[10px] w-full">รายละเอียด</th>
                                    <th className="px-2 py-2 font-semibold text-[#5e5873] text-[10px] text-right">ช่องทาง</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EBE9F1]">
                                {filteredAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Calendar className="w-8 h-8 opacity-20" />
                                                <p className="text-xs">ไม่มีรายการนัดหมาย</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAppointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleEditClick(apt)}>
                                            <td className="px-2 py-2 align-top text-center">
                                                <div className="font-bold text-[#7367f0] text-sm leading-none mb-0.5">{apt.time}</div>
                                                <div className="text-[9px] text-[#b9b9c3] leading-tight">
                                                    {formatShortThaiDate(new Date(apt.date))}
                                                </div>
                                                <div className="text-[9px] text-[#b9b9c3] leading-tight">
                                                    {String((new Date(apt.date).getFullYear() + 543) % 100)}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 align-top">
                                                <div className="font-bold text-[#5e5873] text-xs leading-tight mb-0.5">{apt.patientName}</div>
                                                <span className="inline-block text-[9px] text-[#b9b9c3] bg-gray-100 px-1 py-0.5 rounded">
                                                    {apt.hn}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2 align-top">
                                                <div className="text-[#5e5873] text-xs max-w-[120px] truncate" title={apt.treatmentDetails}>
                                                    {apt.treatmentDetails}
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 align-top text-right">
                                                {apt.channel === 'Direct' ? (
                                                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 border border-emerald-100 shadow-sm">
                                                        <Smartphone className="w-3.5 h-3.5" />
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-500 border border-blue-100 shadow-sm">
                                                        <Building2 className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>

                {/* Tab: History Tracking */}
                <TabsContent value="history" className="mt-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-[#f8f9fa] border-b border-[#EBE9F1]">
                                <tr>
                                    <th className="px-2 py-2 font-semibold text-[#5e5873] text-[10px] text-center w-[70px]">วัน/เวลา</th>
                                    <th className="px-2 py-2 font-semibold text-[#5e5873] text-[10px]">ผู้ป่วย</th>
                                    <th className="px-2 py-2 font-semibold text-[#5e5873] text-[10px]">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#EBE9F1]">
                                 {history.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-2 py-2 align-top text-center">
                                            <div className="font-medium text-[#5e5873] text-xs leading-none mb-0.5">{formatShortThaiDate(new Date(apt.date))}</div>
                                            <div className="text-[10px] text-[#b9b9c3]">{apt.time}</div>
                                        </td>
                                        <td className="px-2 py-2 align-top">
                                            <div className="font-bold text-[#5e5873] text-xs leading-tight mb-0.5">{apt.patientName}</div>
                                            <div className="text-[9px] text-[#b9b9c3] max-w-[150px] truncate">{apt.treatmentDetails}</div>
                                        </td>
                                        <td className="px-2 py-2 align-top">
                                             {apt.status === 'Completed' ? (
                                                <Badge className="bg-green-100 text-green-800 border-none font-medium text-[9px] px-1.5 h-5">
                                                    เสร็จสิ้น
                                                </Badge>
                                             ) : (
                                                <Badge className="bg-red-100 text-red-800 border-none font-medium text-[9px] px-1.5 h-5">
                                                    ยกเลิก
                                                </Badge>
                                             )}
                                        </td>
                                    </tr>
                                 ))}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </Card>

      {/* --- Create/Edit/View Modal --- */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[700px] font-['Montserrat','Noto_Sans_Thai',sans-serif] max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
            
            {/* VIEW MODE */}
            {!isEditing ? (
                 <TeleForm 
                    data={formData} 
                    onBack={() => setIsCreateOpen(false)} 
                 />
            ) : (
                /* EDIT MODE (Existing Form) */
                <>
                    <DialogHeader className="bg-[#f8f9fa] -mx-6 -mt-6 p-6 border-b">
                        <DialogTitle className="flex items-center gap-2 text-[#7367f0]">
                            {formData.id && appointments.some(a => a.id === formData.id) ? 'แก้ไขนัดหมาย' : 'สร้างนัดหมาย Tele-consult ใหม่'}
                        </DialogTitle>
                        <DialogDescription>
                            กรุณากรอกข้อมูลให้ครบถ้วนเพื่อประสิทธิภาพในการเชื่อมต่อ
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-6">
                        
                        {/* Part A: Essential Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <User className="w-4 h-4 text-[#7367f0]" /> ส่วนที่ 1: ข้อมูลพื้นฐาน (Essential Details)
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>ชื่อผู้ป่วย <span className="text-red-500">*</span></Label>
                                    <Input 
                                        placeholder="ระบุชื่อผู้ป่วย" 
                                        value={formData.patientName || ''}
                                        onChange={e => setFormData({...formData, patientName: e.target.value})}
                                        className={errors.patientName ? "border-red-500" : ""}
                                    />
                                    {errors.patientName && <span className="text-xs text-red-500">{errors.patientName}</span>}
                                </div>
                                <div className="space-y-2">
                                    <Label>HN (ถ้ามี)</Label>
                                    <Input 
                                        placeholder="ระบุ HN" 
                                        value={formData.hn || ''}
                                        onChange={e => setFormData({...formData, hn: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>รายละเอียดการรักษา / เหตุผลที่นัด <span className="text-red-500">*</span></Label>
                                <Textarea 
                                    placeholder="เช่น ติดตามอาการเบาหวาน, ปรึกษาผลเลือด..." 
                                    value={formData.treatmentDetails || ''}
                                    onChange={e => setFormData({...formData, treatmentDetails: e.target.value})}
                                    className={errors.treatmentDetails ? "border-red-500" : ""}
                                />
                                 {errors.treatmentDetails && <span className="text-xs text-red-500">{errors.treatmentDetails}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label>วันที่นัด <span className="text-red-500">*</span></Label>
                                    <Input 
                                        type="date"
                                        value={formData.date || ''}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        className={errors.date ? "border-red-500" : ""}
                                    />
                                    {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
                                 </div>
                                 <div className="space-y-2">
                                    <Label>เวลา <span className="text-red-500">*</span></Label>
                                    <Input 
                                        type="time"
                                        value={formData.time || ''}
                                        onChange={e => setFormData({...formData, time: e.target.value})}
                                        className={errors.time ? "border-red-500" : ""}
                                    />
                                    {errors.time && <span className="text-xs text-red-500">{errors.time}</span>}
                                 </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                     Meeting Link (Zoom/Google Meet/etc.) <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input 
                                        className={`pl-9 ${errors.meetingLink ? "border-red-500" : ""}`}
                                        placeholder="https://..." 
                                        value={formData.meetingLink || ''}
                                        onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                                    />
                                </div>
                                {errors.meetingLink && <span className="text-xs text-red-500">{errors.meetingLink}</span>}
                            </div>
                        </div>

                        {/* Part B: Channel Selection */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <Video className="w-4 h-4 text-[#7367f0]" /> ช่องทาง (Channel)
                            </h3>
                            
                            <RadioGroup 
                                value={formData.channel} 
                                onValueChange={(val) => {
                                    const newChannel = val as ChannelType;
                                    setFormData({
                                        ...formData, 
                                        channel: newChannel,
                                        intermediaryName: newChannel === 'Intermediary' ? 'โรงพยาบาลฝาง' : ''
                                    });
                                }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Direct Option */}
                                    <label className={cn(
                                        "relative border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-[100px]",
                                        formData.channel === 'Direct' 
                                            ? "border-[#34D399] bg-[#ECFDF5] ring-1 ring-[#34D399]" 
                                            : "border-gray-200 hover:border-[#34D399]/50 bg-white"
                                    )}>
                                        <RadioGroupItem value="Direct" id="direct" className="sr-only" />
                                        <div className="flex items-center gap-2 text-[#059669]">
                                            <Smartphone className="w-5 h-5" />
                                            <span className="font-bold text-lg">Direct</span>
                                        </div>
                                    </label>

                                    {/* Via Host Option */}
                                    <label className={cn(
                                        "relative border rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-[100px]",
                                        formData.channel === 'Intermediary' 
                                            ? "border-[#3B82F6] bg-[#EFF6FF] ring-1 ring-[#3B82F6]" 
                                            : "border-gray-200 hover:border-[#3B82F6]/50 bg-white"
                                    )}>
                                        <RadioGroupItem value="Intermediary" id="inter" className="sr-only" />
                                        <div className="flex items-center gap-2 text-[#2563EB]">
                                            <Building2 className="w-5 h-5" />
                                            <span className="font-bold text-lg">Via Host</span>
                                        </div>
                                        {formData.channel === 'Intermediary' && (
                                            <span className="text-sm text-slate-500 font-medium animate-in fade-in slide-in-from-top-1">
                                                {formData.intermediaryName || 'โรงพยาบาลฝาง'}
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </RadioGroup>
                        </div>

                    </div>

                    <DialogFooter className="bg-gray-50 -mx-6 -mb-6 p-4 border-t gap-2">
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                            ยกเลิก
                        </Button>
                        <Button 
                            onClick={handleSave}
                            className="bg-[#7367f0] hover:bg-[#655bd3] text-white"
                        >
                            {formData.id && appointments.some(a => a.id === formData.id) ? 'บันทึกการแก้ไข' : 'สร้างนัดหมาย'}
                        </Button>
                    </DialogFooter>
                </>
            )}
        </DialogContent>
      </Dialog>
      
      {/* Cancel Appointment Confirmation Dialog */}
      <FigmaConfirmDialog
        isOpen={!!cancelTargetId}
        onClose={() => setCancelTargetId(null)}
        title="ยืนยันการยกเลิกนัดหมาย"
        description="คุณต้องการยกเลิกนัดหมายนี้ใช่หรือไม่?"
        cancelLabel="ยกเลิกนัดหมาย"
        confirmLabel="ไม่ยกเลิก"
        onCancel={() => {
          setAppointments(prev => prev.map(a => a.id === cancelTargetId ? { ...a, status: 'Cancelled' } : a));
          toast.success("ยกเลิกนัดหมายเรียบร้อยแล้ว");
          setCancelTargetId(null);
        }}
        onConfirm={() => setCancelTargetId(null)}
      />
      </div>
    </div>
  );
}
