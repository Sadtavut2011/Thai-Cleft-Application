import React from 'react';
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  FileText, 
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Edit,
  PlusCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Separator } from "../../../../../components/ui/separator";
import { cn } from "../../../../../components/ui/utils";

// Helper: format date to Thai full date (native, no date-fns)
const formatThaiDateFull = (raw: string | undefined): string => {
    if (!raw) return '-';
    try {
        const d = new Date(raw);
        if (isNaN(d.getTime())) return raw;
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return raw; }
};

export interface Appointment {
    id: string;
    patientName: string;
    hn: string;
    hospital: string;
    province: string;
    clinic: string;
    date: string;
    time: string;
    type: string;
    status: string;
    isOverdue?: boolean;
    hasConflict?: boolean;
    needsIntervention?: boolean;
    riskLevel?: string;
    doctorName?: string;
    note?: string;
    createdBy?: string;
}

interface AppointmentDetailProps {
  appointment: Appointment;
  onBack: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onContact?: () => void;
  onEdit?: () => void;
  onAddRecord?: () => void;
}

export function AppointmentDetail({
  appointment,
  onBack,
  onConfirm,
  onCancel,
  onContact,
  onEdit,
  onAddRecord
}: AppointmentDetailProps) {
  if (!appointment) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-slate-600 rounded-xl">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-slate-800 font-black text-xl flex items-center gap-2 tracking-tight">
                    รายละเอียดนัดหมาย
                </h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 font-bold">ID: {appointment.id}</span>
                    <Separator orientation="vertical" className="h-3" />
                    {appointment.status === 'Confirmed' && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100">ยืนยันแล้ว</Badge>}
                    {appointment.status === 'Pending' && <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100">รอการยืนยัน</Badge>}
                    {appointment.status === 'Cancelled' && <Badge className="bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100">ยกเลิก</Badge>}
                    {appointment.status === 'Missed' && <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">ขาดนัด</Badge>}
                    {appointment.status === 'Completed' && <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100">เสร็จสิ้น</Badge>}
                </div>
            </div>
        </div>
        
        <div className="flex gap-2">
            {appointment.status === 'Pending' && (
                <>
                    <Button variant="outline" className="text-rose-600 hover:bg-rose-50 border-rose-200 rounded-xl font-bold" onClick={onCancel}>
                        <XCircle className="w-4 h-4 mr-2" /> ยกเลิกนัด
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm rounded-xl font-bold" onClick={onConfirm}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> ยืนยันนัดหมาย
                    </Button>
                </>
            )}
            {appointment.status === 'Confirmed' && (
                 <Button variant="outline" className="text-rose-600 hover:bg-rose-50 border-rose-200 rounded-xl font-bold" onClick={onCancel}>
                    <XCircle className="w-4 h-4 mr-2" /> ยกเลิกนัด
                </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Main Details */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Patient Info Card */}
              <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                          <User className="w-5 h-5 text-teal-600" /> ข้อมูลผู้ป่วย
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="flex items-start gap-6">
                          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border-4 border-white shadow-sm">
                              <User className="w-10 h-10" />
                          </div>
                          <div className="flex-1 space-y-3">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div>
                                      <h3 className="text-xl font-black text-slate-800 tracking-tight">{appointment.patientName}</h3>
                                      <p className="text-sm text-slate-500 font-bold">HN: {appointment.hn}</p>
                                  </div>
                                  <div className="flex gap-2">
                                      <Button variant="outline" size="sm" className="gap-2 rounded-lg font-bold" onClick={onContact}>
                                          <Phone className="w-3.5 h-3.5" /> ติดต่อ
                                      </Button>
                                      <Button variant="outline" size="sm" className="gap-2 rounded-lg font-bold" onClick={onEdit}>
                                          <Edit className="w-3.5 h-3.5" /> แก้ไขข้อมูล
                                      </Button>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                  <div className="space-y-1">
                                      <p className="text-xs text-slate-400 font-bold uppercase">เบอร์โทรศัพท์</p>
                                      <p className="text-sm font-bold text-slate-700">08x-xxx-xxxx</p>
                                  </div>
                                  <div className="space-y-1">
                                      <p className="text-xs text-slate-400 font-bold uppercase">สิทธิการรักษา</p>
                                      <p className="text-sm font-bold text-slate-700">บัตรทอง</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Appointment Details Card */}
              <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                   <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-teal-600" /> รายละเอียดการนัดหมาย
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                  <Calendar className="w-4 h-4 text-teal-600" /> วันที่นัด
                              </div>
                              <p className="font-black text-slate-800 text-lg pl-6">
                                  {formatThaiDateFull(appointment.date)}
                              </p>
                          </div>
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                  <Clock className="w-4 h-4 text-teal-600" /> เวลา
                              </div>
                              <p className="font-black text-slate-800 text-lg pl-6">{appointment.time} น.</p>
                          </div>
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                  <Building2 className="w-4 h-4 text-teal-600" /> โรงพยาบาล
                              </div>
                              <p className="font-bold text-slate-800 pl-6">{appointment.hospital}</p>
                          </div>
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                  <MapPin className="w-4 h-4 text-teal-600" /> แผนก/คลินิก
                              </div>
                              <p className="font-bold text-slate-800 pl-6">{appointment.clinic}</p>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                  <Stethoscope className="w-4 h-4 text-teal-600" /> แพทย์ผู้ตรวจ
                              </div>
                              <div className="flex items-center gap-3 mt-1 pl-6">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                      <User className="w-4 h-4 text-slate-500" />
                                  </div>
                                  <span className="font-bold text-slate-800">{appointment.doctorName || "ไม่ระบุแพทย์"}</span>
                              </div>
                          </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                          <div className="flex items-center gap-2 text-amber-800 text-xs font-black uppercase mb-2">
                              <AlertCircle className="w-4 h-4" /> หมายเหตุ / อาการเบื้องต้น
                          </div>
                          <p className="text-sm text-amber-900/80 leading-relaxed pl-6 font-medium">
                              {appointment.note || "ไม่มีรายละเอียดเพิ่มเติม"}
                          </p>
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Right Column: Actions & History */}
          <div className="space-y-6">
              
              {/* Actions Card */}
              <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-base font-bold text-slate-800">การดำเนินการ</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                       {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                          <Button 
                              variant="default" 
                              className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2 shadow-sm h-11 rounded-xl font-bold"
                              onClick={onAddRecord}
                          >
                              <PlusCircle className="w-4 h-4" /> บันทึกผลการรักษา
                          </Button>
                       )}
                       
                       <Button variant="outline" className="w-full justify-start h-10 border-slate-200 text-slate-600 hover:text-teal-600 hover:bg-slate-50 rounded-xl font-bold">
                           <FileText className="w-4 h-4 mr-2" /> ดูประวัติการรักษา
                       </Button>
                  </CardContent>
              </Card>

              {/* Status Timeline Card (Mock) */}
              <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-base font-bold text-slate-800">สถานะการติดตาม</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                          <div className="relative">
                              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-white shadow-sm"></div>
                              <p className="text-sm font-bold text-slate-800">สร้างนัดหมาย</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">โดย {appointment.createdBy || "System"}</p>
                          </div>
                          <div className="relative">
                              <div className={cn("absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white shadow-sm", appointment.status !== 'Pending' ? 'bg-teal-500' : 'bg-slate-200')}></div>
                              <p className={cn("text-sm font-bold", appointment.status !== 'Pending' ? 'text-slate-800' : 'text-slate-400')}>ยืนยันนัดหมาย</p>
                              <p className="text-xs text-slate-400 font-bold">-</p>
                          </div>
                          <div className="relative">
                              <div className={cn("absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white shadow-sm", appointment.status === 'Completed' ? 'bg-teal-500' : 'bg-slate-200')}></div>
                              <p className={cn("text-sm font-bold", appointment.status === 'Completed' ? 'text-slate-800' : 'text-slate-400')}>ตรวจเสร็จสิ้น</p>
                              <p className="text-xs text-slate-400 font-bold">-</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}