import React from 'react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Separator } from "../../../../../components/ui/separator";
import { 
  ArrowLeft, 
  Video, 
  Clock, 
  Calendar, 
  Smartphone, 
  Building2, 
  User,
  CheckCircle2,
  XCircle,
  Printer,
  Copy,
  Phone,
  FileText,
  ClipboardList
} from "lucide-react";
import { toast } from "sonner";
import { getPatientByHn } from "../../../../../data/patientData";
import { cn } from "../../../../../components/ui/utils";

// InfoItem with optional icon support (same pattern as AppointmentDetailPage)
const InfoItem = ({ label, value, icon: Icon }: { label: string, value?: React.ReactNode, icon?: any }) => (
    <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
            {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
            <span>{value || '-'}</span>
        </div>
    </div>
);

export interface Appointment {
  id: string;
  patientName: string;
  patientImage?: string; // Added to match
  hn: string;
  date: string;
  time: string;
  doctor: string;
  status: string; // Changed to string to be flexible like mobile
  channel: 'mobile' | 'agency' | 'Direct' | 'Intermediary'; // Union for compatibility
  intermediaryName?: string;
  agency_name?: string; // Match mobile
  meetingLink: string;
  treatmentDetails?: string;
  // New fields from Mobile
  requestDate?: string;
  title?: string;
  detail?: string;
}

interface TeleConsultationSystemDetailProps {
  appointment: Appointment;
  onBack: () => void;
}

export function TeleConsultationSystemDetail({ appointment: selectedAppointment, onBack }: TeleConsultationSystemDetailProps) {
  
  // Helper to normalize status (Match Mobile Logic)
  const getStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase();
    if (['waiting', 'pending', 'scheduled'].includes(s)) return { color: 'bg-orange-100 text-orange-700 border-orange-200', text: 'รอสาย', icon: <Clock size={14} /> };
    if (['inprogress', 'in_progress', 'working'].includes(s)) return { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'ดำเนินการ', icon: <Video size={14} /> };
    if (['cancelled', 'missed', 'rejected'].includes(s)) return { color: 'bg-red-100 text-red-700 border-red-200', text: 'ยกเลิก', icon: <XCircle size={14} /> };
    return { color: 'bg-green-100 text-green-700 border-green-200', text: 'เสร็จสิ้น', icon: <CheckCircle2 size={14} /> };
  };

  const statusConfig = getStatusConfig(selectedAppointment.status);
  
  // Normalizing Data
  const patientHN = selectedAppointment.hn || '-';
  
  // Single source lookup from PATIENTS_DATA
  const patientRecord = getPatientByHn(patientHN);

  const patientName = patientRecord?.name || selectedAppointment.patientName || 'ไม่ระบุชื่อ';
  const patientImage = patientRecord?.image || selectedAppointment.patientImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

  const resolvedDob = patientRecord?.dob || (selectedAppointment as any).patientDob;
  const resolvedGender = patientRecord?.gender || (selectedAppointment as any).patientGender;
  const patientDiagnosis = patientRecord?.diagnosis || (selectedAppointment as any).diagnosis || '-';
  const patientAge = (() => {
    if (!resolvedDob) return null;
    const dob = new Date(resolvedDob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const md = today.getMonth() - dob.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  })();
  const patientAgeGenderText = [
    patientAge !== null ? `${patientAge} ปี` : null,
    resolvedGender || null
  ].filter(Boolean).join(' / ') || '-';
  
  const requestDate = selectedAppointment.requestDate || '-';
  // Use date string directly if formatted, or format if ISO
  const consultDate = selectedAppointment.date; 
  
  // Helper to format date to Thai short date (matching mobile TeleConsultDetail)
  const formatThaiShortDate = (raw: string | undefined): string => {
    if (!raw) return '-';
    try {
      const safeRaw = raw.match(/^\d{4}-\d{2}-\d{2}$/) ? raw + 'T00:00:00' : raw;
      const d = new Date(safeRaw);
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    } catch {
      return raw;
    }
  };

  // Display time
  const displayTime = (() => {
    if (selectedAppointment.time) {
      const t = selectedAppointment.time;
      return `${t.length > 5 ? t.substring(0, 5) : t} น.`;
    }
    if (consultDate && consultDate.includes('T')) {
      return `${consultDate.split('T')[1]?.substring(0, 5)} น.`;
    }
    return '';
  })();

  // Channel Logic
  const isMobile = selectedAppointment.channel === 'mobile' || selectedAppointment.channel === 'Direct';
  const isHospital = (selectedAppointment.channel as string) === 'hospital' || (selectedAppointment.channel as string) === 'Hospital';
  const agencyName = selectedAppointment.agency_name || selectedAppointment.intermediaryName || 'รพ.สต. ในพื้นที่';
  
  const channelLabel = isMobile 
    ? 'ผ่านผู้ป่วยเอง (Mobile)' 
    : isHospital 
    ? `ผ่านโรงพยาบาล: ${agencyName}` 
    : `ผ่านหน่วยงาน: ${agencyName}`;

  const topic = selectedAppointment.title || selectedAppointment.treatmentDetails || '-';
  const detail = selectedAppointment.detail || "ผู้ป่วยมีอาการดีขึ้นตามลำดับ แผลแห้งดี ไม่มีอาการบวมแดงหรือมีหนอง ผู้ปกครองสามารถดูแลทำความสะอาดแผลได้ถูกต้อง แนะนำให้สังเกตอาการต่อเนื่องแฉะมาตามนัดครั้งถัดไป";

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20 font-['IBM_Plex_Sans_Thai'] space-y-6">
        
        {/* Header Banner — matching FundRequestDetailPage */}
        <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
                <h1 className="text-[#5e5873] font-bold text-lg">
                    รายละเอียด Tele-med {selectedAppointment.id}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                    ข้อมูลรายละเอียดและบันทึกการปรึกษาทางไกล
                </p>
            </div>
            <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
                <Printer className="w-4 h-4" />
            </Button>
        </div>

        {/* Pink Appointment Date Banner (matching Mobile TeleConsultDetail — always shown) */}
        {consultDate && (
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="bg-white p-2.5 rounded-full shadow-sm border border-pink-100">
                  <Calendar className="text-[#e91e63] w-5 h-5" />
              </div>
              <div>
                  <span className="text-sm text-[#e91e63] font-semibold block mb-0.5">วันนัดหมาย Tele-med</span>
                  <span className="text-pink-900 font-bold text-lg">
                      {formatThaiShortDate(consultDate)}
                  </span>
                  {displayTime && (
                    <span className="text-pink-700 text-sm ml-2">
                        {displayTime}
                    </span>
                  )}
              </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            
            {/* Left Column: Patient & Detail Info */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Patient Info Card */}
                <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="pb-3 border-b border-gray-50">
                        <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${statusConfig.color}`}>
                                {statusConfig.text}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-5">
                            <div className="w-[72px] h-[72px] bg-gray-100 rounded-full shrink-0 overflow-hidden border-2 border-white shadow">
                                <img 
                                    src={patientImage}
                                    alt={patientName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-800 text-xl truncate">{patientName}</h3>
                                <p className="text-sm text-slate-500">HN: {patientHN}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                    <Phone className="w-4 h-4" /> ติดต่อ
                                </Button>
                                <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                    <ClipboardList className="w-4 h-4" /> ดูประวัติ
                                </Button>
                            </div>
                        </div>

                        {/* Info strip: อายุ/เพศ + ผลการวินิจฉัย */}
                        <div className="grid grid-cols-2 mt-5 bg-[#F4F9FF] rounded-lg border border-blue-100/60 overflow-hidden">
                            <div className="px-5 py-3 border-r border-blue-100/60">
                                <span className="text-xs text-slate-500 block mb-0.5">อายุ / เพศ</span>
                                <span className="text-sm text-slate-800 font-semibold">{patientAgeGenderText}</span>
                            </div>
                            <div className="px-5 py-3">
                                <span className="text-xs text-slate-500 block mb-0.5">ผลการวินิจฉัย</span>
                                <span className="text-sm text-slate-800 font-semibold">{patientDiagnosis}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tele Detail Card */}
                <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                    <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#e91e63]/10 p-2 rounded-lg text-[#e91e63]">
                                <Video size={24} />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-[#5e5873]">นัดหมายปรึกษาแพทย์</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                                        isMobile ? "bg-cyan-50 text-cyan-600 border-cyan-100" : "bg-purple-50 text-purple-600 border-purple-100"
                                    )}>
                                        {isMobile ? 'ส่งตรงหาผู้ป่วย' : 'ผ่าน รพ.สต.'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">

                        {/* Date & Connection Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem label="วันที่สร้างคำขอ" value={formatThaiShortDate(requestDate)} icon={Calendar} />
                            <InfoItem 
                                label="ช่องทางการเชื่อมต่อ" 
                                value={channelLabel} 
                                icon={isMobile ? Smartphone : Building2} 
                            />
                            <InfoItem 
                                label="Meeting Link" 
                                value={
                                    <a 
                                        href={selectedAppointment.meetingLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 font-medium hover:underline break-all"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {selectedAppointment.meetingLink}
                                    </a>
                                }
                                icon={Video} 
                            />
                        </div>

                        {/* Doctor Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                    <User size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-[#5e5873]">แพทย์ผู้ให้คำปรึกษา</h3>
                            </div>
                            <InfoItem label="แพทย์ผู้ให้คำปรึกษา" value={selectedAppointment.doctor || '-'} icon={User} />
                        </div>

                        {/* Consultation Info Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-bold text-lg text-[#5e5873]">ข้อมูลการปรึกษา</h3>
                            </div>
                            
                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-gray-500">หัวข้อการปรึกษา</p>
                                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 min-h-[48px] flex items-center text-gray-800 font-medium">
                                    {topic}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-gray-500">รายละเอียด / ผลการปรึกษา</p>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {detail}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Actions (matching other systems) */}
            <div className="space-y-6">
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-3 border-b border-gray-50">
                        <CardTitle className="text-lg text-[#5e5873]">การดำเนินการ</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        {statusConfig.text === 'ดำเนินการ' && (
                            <Button className="w-full bg-[#7367f0] hover:bg-[#685dd8] text-white shadow-sm h-11">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> เสร็จสิ้นการปรึกษา
                            </Button>
                        )}
                        <Button 
                            variant="outline" 
                            className="w-full h-10 border-gray-200 text-gray-600 hover:text-[#7367f0] hover:bg-slate-50"
                            onClick={() => {navigator.clipboard.writeText(selectedAppointment.meetingLink); toast.success("คัดลอกลิงก์แล้ว")}}
                        >
                            <Copy className="w-4 h-4 mr-2" /> คัดลอกลิงก์ประชุม
                        </Button>
                    </CardContent>
                </Card>

                {/* Tracking Timeline */}
                <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-3 border-b border-gray-50">
                        <CardTitle className="text-lg text-[#5e5873]">สถานะการติดตาม</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                            {/* Step 1: Created */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-[#5e5873]">สร้างคำขอ Tele-med</span>
                                    <span className="text-sm text-gray-400">{formatThaiShortDate(requestDate)}</span>
                                </div>
                            </div>
                            {/* Step 2: Scheduled */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${
                                    ['ดำเนินการ', 'เสร็จสิ้น'].includes(statusConfig.text) ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${['ดำเนินการ', 'เสร็จสิ้น'].includes(statusConfig.text) ? 'text-[#5e5873]' : 'text-gray-400'}`}>
                                        เริ่มการปรึกษา
                                    </span>
                                    <span className="text-sm text-gray-400">{formatThaiShortDate(consultDate)} {displayTime}</span>
                                </div>
                            </div>
                            {/* Step 3: Completed */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${
                                    statusConfig.text === 'เสร็จสิ้น' ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${statusConfig.text === 'เสร็จสิ้น' ? 'text-[#5e5873]' : 'text-gray-400'}`}>
                                        เสร็จสิ้นการปรึกษา
                                    </span>
                                    <span className="text-sm text-gray-400">-</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    </div>
  );
}