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
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface AppointmentDetailPageProps {
  appointment: any;
  onBack: () => void;
  onConfirm: () => void;
  onCancel: () => void; // Cancel the appointment (change status)
  onContact: () => void;
  onEdit: () => void;
  onAddRecord: () => void;
}

export function AppointmentDetailPage({
  appointment,
  onBack,
  onConfirm,
  onCancel,
  onContact,
  onEdit,
  onAddRecord
}: AppointmentDetailPageProps) {
  if (!appointment) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                    รายละเอียดนัดหมาย
                </h1>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">ID: {appointment.id}</span>
                    <Separator orientation="vertical" className="h-3" />
                    {appointment.status === 'Confirmed' && <Badge className="bg-green-100 text-green-600 border-green-200 hover:bg-green-200">ยืนยันแล้ว</Badge>}
                    {appointment.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200">รอการยืนยัน</Badge>}
                    {appointment.status === 'Cancelled' && <Badge className="bg-red-100 text-red-600 border-red-200 hover:bg-red-200">ยกเลิก</Badge>}
                    {appointment.status === 'Missed' && <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200">ขาดนัด</Badge>}
                    {appointment.status === 'Completed' && <Badge className="bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200">เสร็จสิ้น</Badge>}
                </div>
            </div>
        </div>
        
        <div className="flex gap-2">
            {appointment.status === 'Pending' && (
                <>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={onCancel}>
                        <XCircle className="w-4 h-4 mr-2" /> ยกเลิกนัด
                    </Button>
                    <Button className="bg-[#7367f0] hover:bg-[#685dd8] text-white shadow-sm" onClick={onConfirm}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> ยืนยันนัดหมาย
                    </Button>
                </>
            )}
            {appointment.status === 'Confirmed' && (
                 <Button variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={onCancel}>
                    <XCircle className="w-4 h-4 mr-2" /> ยกเลิกนัด
                </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Left Column: Main Details */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Patient Info Card */}
              <Card className="border-[#EBE9F1] shadow-sm">
                  <CardHeader className="pb-3 border-b border-[#EBE9F1]">
                      <CardTitle className="text-base font-semibold text-[#5e5873] flex items-center gap-2">
                          <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="flex items-start gap-6">
                          <div className="w-20 h-20 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#7367f0] shrink-0 border-4 border-white shadow-sm">
                              <User className="w-10 h-10" />
                          </div>
                          <div className="flex-1 space-y-3">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div>
                                      <h3 className="text-xl font-bold text-[#5e5873]">{appointment.patientName}</h3>
                                      <p className="text-sm text-gray-500 font-medium">HN: {appointment.hn}</p>
                                  </div>
                                  <div className="flex gap-2">
                                      <Button variant="outline" size="sm" className="gap-2" onClick={onContact}>
                                          <Phone className="w-3.5 h-3.5" /> ติดต่อ
                                      </Button>
                                      <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
                                          <Edit className="w-3.5 h-3.5" /> แก้ไขข้อมูล
                                      </Button>
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                  <div className="space-y-1">
                                      <p className="text-xs text-gray-400">เบอร์โทรศัพท์</p>
                                      <p className="text-sm font-medium text-gray-700">08x-xxx-xxxx</p>
                                  </div>
                                  <div className="space-y-1">
                                      <p className="text-xs text-gray-400">สิทธิการรักษา</p>
                                      <p className="text-sm font-medium text-gray-700">บัตรทอง</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Appointment Details Card */}
              <Card className="border-[#EBE9F1] shadow-sm">
                   <CardHeader className="pb-3 border-b border-[#EBE9F1]">
                      <CardTitle className="text-base font-semibold text-[#5e5873] flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#7367f0]" /> รายละเอียดการนัดหมาย
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                  <Calendar className="w-4 h-4 text-[#7367f0]" /> วันที่นัด
                              </div>
                              <p className="font-semibold text-gray-800 text-lg pl-6">
                                  {format(new Date(appointment.date), "d MMMM yyyy", { locale: th })}
                              </p>
                          </div>
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                  <Clock className="w-4 h-4 text-[#7367f0]" /> เวลา
                              </div>
                              <p className="font-semibold text-gray-800 text-lg pl-6">{appointment.time} น.</p>
                          </div>
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                  <Building2 className="w-4 h-4 text-[#7367f0]" /> โรงพยาบาล
                              </div>
                              <p className="font-semibold text-gray-800 pl-6">{appointment.hospital}</p>
                          </div>
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                  <MapPin className="w-4 h-4 text-[#7367f0]" /> แผนก/คลินิก
                              </div>
                              <p className="font-semibold text-gray-800 pl-6">{appointment.clinic}</p>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                  <Stethoscope className="w-4 h-4 text-[#7367f0]" /> แพทย์ผู้ตรวจ
                              </div>
                              <div className="flex items-center gap-3 mt-1 pl-6">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                      <User className="w-4 h-4 text-slate-500" />
                                  </div>
                                  <span className="font-medium text-gray-800">{appointment.doctorName || "ไม่ระบุแพทย์"}</span>
                              </div>
                          </div>
                      </div>

                      <div className="bg-[#FFF4E5] p-4 rounded-lg border border-[#FFE0B2]">
                          <div className="flex items-center gap-2 text-orange-800 text-sm font-semibold mb-2">
                              <AlertCircle className="w-4 h-4" /> หมายเหตุ / อาการเบื้องต้น
                          </div>
                          <p className="text-sm text-orange-900/80 leading-relaxed pl-6">
                              {appointment.note || "ไม่มีรายละเอียดเพิ่มเติม"}
                          </p>
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Right Column: Actions & History */}
          <div className="space-y-6">
              
              {/* Actions Card */}
              <Card className="border-[#EBE9F1] shadow-sm">
                  <CardHeader className="pb-3 border-b border-[#EBE9F1] bg-gray-50/50">
                      <CardTitle className="text-base font-semibold text-[#5e5873]">การดำเนินการ</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                       {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                          <Button 
                              variant="default" 
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm h-11"
                              onClick={onAddRecord}
                          >
                              <PlusCircle className="w-4 h-4" /> บันทึกผลการรักษา
                          </Button>
                       )}
                       
                       <Button variant="outline" className="w-full justify-start h-10 border-gray-200 text-gray-600 hover:text-[#7367f0] hover:bg-slate-50">
                           <FileText className="w-4 h-4 mr-2" /> ดูประวัติการรักษา
                       </Button>
                  </CardContent>
              </Card>

              {/* Status Timeline Card (Mock) */}
              <Card className="border-[#EBE9F1] shadow-sm">
                  <CardHeader className="pb-3 border-b border-[#EBE9F1]">
                      <CardTitle className="text-base font-semibold text-[#5e5873]">สถานะการติดตาม</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                          <div className="relative">
                              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                              <p className="text-sm font-semibold text-[#5e5873]">สร้างนัดหมาย</p>
                              <p className="text-xs text-gray-400">โดย {appointment.createdBy || "System"}</p>
                          </div>
                          <div className="relative">
                              <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${appointment.status !== 'Pending' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <p className={`text-sm font-semibold ${appointment.status !== 'Pending' ? 'text-[#5e5873]' : 'text-gray-400'}`}>ยืนยันนัดหมาย</p>
                              <p className="text-xs text-gray-400">-</p>
                          </div>
                          <div className="relative">
                              <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${appointment.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <p className={`text-sm font-semibold ${appointment.status === 'Completed' ? 'text-[#5e5873]' : 'text-gray-400'}`}>ตรวจเสร็จสิ้น</p>
                              <p className="text-xs text-gray-400">-</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
