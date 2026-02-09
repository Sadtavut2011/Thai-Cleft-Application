import React from 'react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Label } from "../../../../../components/ui/label";
import { Separator } from "../../../../../components/ui/separator";
import { 
  ArrowLeft, 
  Upload,
  Stethoscope,
  MapPin,
  Monitor,
  Video, 
  Clock, 
  Calendar, 
  Smartphone, 
  Building2, 
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Paperclip,
  Copy
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export interface Appointment {
  id: string;
  patientName: string;
  hn: string;
  date: string;
  time: string;
  doctor: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  channel: 'Direct' | 'Intermediary';
  intermediaryName?: string;
  meetingLink: string;
  treatmentDetails?: string;
}

interface TeleConsultationSystemDetailProps {
  appointment: Appointment;
  onBack: () => void;
}

export function TeleConsultationSystemDetail({ appointment: selectedAppointment, onBack }: TeleConsultationSystemDetailProps) {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Detail View Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-10 w-10 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full" onClick={onBack}>
                    <ArrowLeft className="w-6 h-6"/>
                </Button>
                <div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-bold text-[#5e5873]">รายละเอียด Tele-consult</h2>
                        {selectedAppointment.status === 'Scheduled' && <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-none px-3 py-1 text-sm font-medium rounded-full"><Clock className="w-3.5 h-3.5 mr-1.5"/> รอการตรวจ</Badge>}
                        {selectedAppointment.status === 'Completed' && <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none px-3 py-1 text-sm font-medium rounded-full"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5"/> เสร็จสิ้น</Badge>}
                        {selectedAppointment.status === 'Cancelled' && <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none px-3 py-1 text-sm font-medium rounded-full"><XCircle className="w-3.5 h-3.5 mr-1.5"/> ยกเลิก</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">ข้อมูลรายละเอียดการนัดหมายและการรักษาผู้ป่วย</p>
                </div>
            </div>
            <div className="flex gap-2 pl-14 md:pl-0">
                <Button className="bg-[#7367f0] hover:bg-[#685dd8] shadow-md shadow-[#7367f0]/20" onClick={() => window.open(selectedAppointment.meetingLink, '_blank')}>
                    <Video className="w-4 h-4 mr-2"/> เข้าร่วมประชุม
                </Button>
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm border-[#EBE9F1]">
                    <CardHeader className="pb-3 border-b border-[#EBE9F1]">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#5e5873]">
                            <FileText className="w-4 h-4 text-[#7367f0]"/> รายละเอียดการนัดหมาย
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-[#b9b9c3] text-xs uppercase tracking-wider font-medium">ผู้ป่วย</Label>
                                <div className="mt-2">
                                    <p className="font-semibold text-lg text-[#5e5873]">{selectedAppointment.patientName}</p>
                                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-blue-100 mt-1 inline-block">HN: {selectedAppointment.hn}</span>
                                </div>
                            </div>
                            <div>
                                <Label className="text-[#b9b9c3] text-xs uppercase tracking-wider font-medium">วันเวลาที่นัดหมาย</Label>
                                <div className="mt-2 flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <Calendar className="w-4 h-4 text-[#7367f0]"/> 
                                        {format(new Date(selectedAppointment.date), "d MMM yyyy", {locale: th})}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <Clock className="w-4 h-4 text-[#7367f0]"/> 
                                        {selectedAppointment.time} น.
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <Separator className="bg-gray-100" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label className="text-[#b9b9c3] text-xs uppercase tracking-wider font-medium">แพทย์ผู้รักษา</Label>
                                <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#7367f0] shadow-sm border border-gray-100">
                                        <Stethoscope className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-700 text-sm">{selectedAppointment.doctor || "ไม่ระบุแพทย์"}</p>
                                        <p className="text-xs text-gray-500">แพทย์เจ้าของไข้</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                        <div>
                            <Label className="text-[#b9b9c3] text-xs uppercase tracking-wider font-medium">หัวข้อการรักษา / อาการ</Label>
                            <div className="mt-2 p-4 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 text-gray-700 leading-relaxed text-sm">
                                {selectedAppointment.treatmentDetails}
                            </div>
                        </div>

                        <div>
                            <Label className="text-[#b9b9c3] text-xs uppercase tracking-wider font-medium">ผู้เข้าร่วมประชุม (Participants)</Label>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Case Manager */}
                                <div className="bg-white border border-gray-100 rounded-[20px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#9333EA] group-hover:scale-105 transition-transform">
                                        <Stethoscope className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium">Case Manager</span>
                                        <span className="text-sm font-bold text-[#5e5873] line-clamp-1">{selectedAppointment.doctor || "ไม่ระบุแพทย์"}</span>
                                    </div>
                                </div>

                                {/* Host Hospital */}
                                <div className="bg-white border border-gray-100 rounded-[20px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#2563EB] group-hover:scale-105 transition-transform">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium">โรงพยาบาลแม่ข่าย</span>
                                        <span className="text-sm font-bold text-[#5e5873] line-clamp-1">โรงพยาบาลนครพิงค์</span>
                                    </div>
                                </div>

                                {/* PCU / Service Unit */}
                                {selectedAppointment.channel === 'Intermediary' && (
                                    <div className="bg-white border border-gray-100 rounded-[20px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                        <div className="w-12 h-12 rounded-full bg-[#FFEDD5] flex items-center justify-center text-[#EA580C] group-hover:scale-105 transition-transform">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 font-medium">รพ.สต. / หน่วยบริการ</span>
                                            <span className="text-sm font-bold text-[#5e5873] line-clamp-1">{selectedAppointment.intermediaryName}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Patient */}
                                <div className="bg-white border border-gray-100 rounded-[20px] p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] group-hover:scale-105 transition-transform">
                                        <Video className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 font-medium">ผู้ป่วย (Zoom User)</span>
                                        <span className="text-sm font-bold text-[#5e5873] line-clamp-1">{selectedAppointment.patientName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Documents Section (Mock) */}
                <Card className="shadow-sm border-[#EBE9F1]">
                    <CardHeader className="pb-3 border-b border-[#EBE9F1]">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-[#5e5873]">
                            <Paperclip className="w-4 h-4 text-[#7367f0]"/> เอกสารประกอบ (Documents)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-500 group-hover:bg-red-200 transition-colors">
                                        <FileText className="w-4 h-4"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Medical_Report.pdf</p>
                                        <p className="text-xs text-gray-400">2.4 MB • 14 Dec 2023</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#7367f0]">
                                    <ExternalLink className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 border-dashed text-gray-500 hover:text-[#7367f0] hover:border-[#7367f0]/50 hover:bg-[#7367f0]/5">
                            <Upload className="w-4 h-4 mr-2"/> อัปโหลดเอกสารเพิ่มเติม
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Connection Info */}
            <div className="space-y-6">
                <Card className="shadow-sm border-[#EBE9F1] overflow-hidden">
                    <div className="h-2 bg-[#7367f0]"></div>
                    <CardHeader className="pb-3 border-b border-[#EBE9F1] bg-gray-50/30">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-[#5e5873]">
                            <Monitor className="w-4 h-4"/> ช่องทางการเชื่อมต่อ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <Label className="text-[#b9b9c3] text-xs uppercase tracking-wider font-medium">ประเภทการเชื่อมต่อ</Label>
                            <div className="mt-2">
                                {selectedAppointment.channel === 'Direct' ? (
                                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-3">
                                        <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <Smartphone className="w-3.5 h-3.5"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-emerald-700">Direct to Patient</p>
                                            <p className="text-xs text-emerald-600/80 mt-0.5 leading-tight">เชื่อมต่อโดยตรงไปยังอุปกรณ์ของผู้ป่วย</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
                                        <div className="mt-0.5 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                            <Building2 className="w-3.5 h-3.5"/>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-blue-700">Via Host Agency</p>
                                            <p className="text-xs text-blue-600/80 mt-0.5 leading-tight">{selectedAppointment.intermediaryName}</p>
                                            <p className="text-[10px] text-blue-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Location verified</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label className="text-[#b9b9c3] text-xs uppercase tracking-wider font-medium mb-2 block">Meeting Link</Label>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 group relative">
                                <p className="text-xs text-slate-600 font-mono break-all pr-8 leading-relaxed">
                                    {selectedAppointment.meetingLink}
                                </p>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute top-1 right-1 h-7 w-7 text-slate-400 hover:text-[#7367f0] hover:bg-slate-200"
                                    onClick={() => {navigator.clipboard.writeText(selectedAppointment.meetingLink); toast.success("คัดลอกลิงก์แล้ว")}}
                                >
                                    <Copy className="w-3.5 h-3.5"/>
                                </Button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 text-center">
                                ลิงก์จะหมดอายุภายใน 24 ชม. หลังจบการนัดหมาย
                            </p>
                        </div>
                        
                        <Separator className="bg-gray-100" />
                        
                        <div className="flex justify-center">
                            <Button variant="ghost" className="text-xs text-gray-500 hover:text-[#7367f0]">
                                <AlertCircle className="w-3 h-3 mr-1.5"/> แจ้งปัญหาการใช้งาน
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
