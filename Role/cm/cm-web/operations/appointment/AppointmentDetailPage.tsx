import React, { useState } from 'react';
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
  AlertCircle,
  Home,
  StickyNote,
  CalendarPlus,
  Printer,
  ClipboardList
} from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Separator } from "../../../../../components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../../components/ui/alert-dialog";
import { getPatientByHn } from "../../../../../data/patientData";

// InfoItem with optional icon support (same pattern as HomeVisitRequestDetail)
const InfoItem = ({ label, value, icon: Icon, valueClassName }: { label: string, value?: string, icon?: any, valueClassName?: string }) => (
    <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
            {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
            <span className={valueClassName}>{value || '-'}</span>
        </div>
    </div>
);

interface AppointmentDetailPageProps {
  appointment: any;
  patient?: any; // Added to match Mobile prop structure and for fuller data
  onBack: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onContact?: () => void;
  onEdit?: () => void;
  onAddRecord?: () => void;
  onReschedule?: () => void;
  onViewPatient?: () => void;
}

export function AppointmentDetailPage({
  appointment,
  patient,
  onBack,
  onConfirm,
  onCancel,
  onContact,
  onEdit,
  onAddRecord,
  onReschedule,
  onViewPatient
}: AppointmentDetailPageProps) {
  if (!appointment) return null;

  // --- Data Normalization & Helpers (Matched with Mobile) ---

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '-';
    // If already contains Thai characters, normalize 4-digit year to 2-digit
    if (/[ก-๙]/.test(dateStr)) {
      const m = dateStr.match(/^(\d{1,2}\s+\S+\s+)(25\d{2})$/);
      if (m) return m[1] + m[2].slice(-2);
      return dateStr;
    }
    // Try to parse YYYY-MM-DD
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const year = String(parseInt(parts[0]) + 543).slice(-2);
      const month = monthNames[parseInt(parts[1]) - 1];
      const day = parseInt(parts[2]);
      return `${day} ${month} ${year}`;
    }
    // Fallback
    try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
        }
    } catch (e) {}
    return dateStr;
  };

  const getStatusConfig = (status: string) => {
    const s = (status || '').toLowerCase();
    
    // Warning / Pending / Waiting
    if (['waiting', 'pending', 'รอพบแพทย์', 'รอตรวจ', 'รอการยืนยัน'].includes(s)) {
        return { color: 'bg-orange-100 text-orange-700 border-orange-200', text: 'รอตรวจ', icon: <AlertCircle size={14} />, badgeVariant: 'secondary', key: 'waiting' };
    }
    // Success / Confirmed / Completed
    if (['confirmed', 'checked-in', 'accepted', 'ยืนยันแล้ว', 'มาตามนัด'].includes(s)) {
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', text: 'ยืนยันแล้ว', icon: <CheckCircle2 size={14} />, badgeVariant: 'default', key: 'confirmed' };
    }
    if (['completed', 'done', 'success', 'เสร็จสิ้น'].includes(s)) {
        return { color: 'bg-green-100 text-green-700 border-green-200', text: 'เสร็จสิ้น', icon: <CheckCircle2 size={14} />, badgeVariant: 'outline', key: 'completed' };
    }
    // Error / Cancelled
    if (['cancelled', 'missed', 'rejected', 'ยกเลิก', 'ขาดนัด'].includes(s)) {
        return { color: 'bg-red-100 text-red-700 border-red-200', text: s === 'missed' || s === 'ขาดนัด' ? 'ขาดนัด' : 'ยกเลิก', icon: <AlertCircle size={14} />, badgeVariant: 'destructive', key: 'cancelled' };
    }
    
    // Default
    return { color: 'bg-gray-100 text-gray-700 border-gray-200', text: status || '-', icon: <AlertCircle size={14} />, badgeVariant: 'outline', key: 'default' };
  };

  const statusConfig = getStatusConfig(appointment.status || appointment.apptStatus);

  // Derive Patient Data (Use passed patient prop or fallback to appointment fields)
  const patientHN = patient?.hn || appointment.hn || appointment.patientId || '-';
  
  // Single source lookup from PATIENTS_DATA
  const patientRecord = getPatientByHn(patientHN);

  const patientName = patientRecord?.name || patient?.name || appointment.patientName || appointment.name || 'ไม่ระบุชื่อ';
  const patientImage = patientRecord?.image || patient?.image || appointment.patientImage || "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
  const patientPhone = patient?.contact?.phone || patient?.phone || appointment.phone || '08x-xxx-xxxx';
  const patientRights = patient?.rights || appointment.rights || 'บัตรทอง';
  const patientId = patient?.id || appointment.patientId || appointment.id;

  // Age/gender/diagnosis from PATIENTS_DATA single source
  const patientDob = patientRecord?.dob || patient?.dob || appointment.patientDob;
  const patientGender = patientRecord?.gender || patient?.gender || appointment.patientGender;
  const patientDiagnosis = patientRecord?.diagnosis || patient?.diagnosis || appointment.diagnosis || '-';
  const patientAge = (() => {
    if (!patientDob) return null;
    const dob = new Date(patientDob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const md = today.getMonth() - dob.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  })();
  const patientAgeGenderText = [
    patientAge !== null ? `${patientAge} ปี` : null,
    patientGender || null
  ].filter(Boolean).join(' / ') || '-';

  // Derive Appointment Data
  const requestDate = appointment.requestDate || appointment.createdDate || '-';
  const apptDate = appointment.date || appointment.date_time || appointment.appointmentDate;
  const apptTime = appointment.time || (appointment.date_time ? (() => { try { const d = new Date(appointment.date_time); return !isNaN(d.getTime()) ? d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }) : '08:00'; } catch { return '08:00'; } })() : '08:00 - 12:00');
  const location = appointment.location || appointment.hospital || appointment.department || '-';
  const room = appointment.room || appointment.roomName || (appointment.raw && appointment.raw.room) || '-';
  const title = appointment.title || appointment.type || appointment.treatment || '-';
  const doctor = appointment.doctor || appointment.doctor_name || appointment.doctorName || '-';
  const note = appointment.note || appointment.reason || '-';
  const recorder = appointment.recorder || 'สภัคศิริ สุวิวัฒนา'; // Match Mobile Default

  // Aliases for user's code template
  const data = appointment;
  const formatThaiDate = formatDateDisplay;
  const parsedDate = apptDate;
  const displayTime = apptTime ? (apptTime.includes('น.') ? apptTime : `${apptTime} น.`) : '-';

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-['IBM_Plex_Sans_Thai']">
      
      {/* Header Banner — matching FundRequestDetailPage */}
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
              <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
              <h1 className="text-[#5e5873] font-bold text-lg">
                  รายละเอียดนัดหมาย {appointment.id || appointment.appointment_id || ''}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                  ข้อมูลรายละเอียดและบันทึกการนัดหมาย
              </p>
          </div>
          <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
          </Button>
      </div>

      {/* Blue Appointment Date Banner (matching Mobile AppointmentDetail) */}
      {statusConfig.key !== 'cancelled' && apptDate && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="bg-white p-2.5 rounded-full shadow-sm border border-blue-100">
                <Calendar className="text-blue-600 w-5 h-5" />
            </div>
            <div>
                <span className="text-sm text-blue-600 font-semibold block mb-0.5">วันนัดหมาย</span>
                <span className="text-blue-900 font-bold text-lg">
                    {formatDateDisplay(apptDate)}
                </span>
                {apptTime && (
                  <span className="text-blue-700 text-sm ml-2">
                      {apptTime.includes('น.') ? apptTime : `${apptTime} น.`}
                  </span>
                )}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Left Column: Main Details */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Patient Info Card */}
              <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-gray-50">
                      <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 ${statusConfig.color}`}>
                              {statusConfig.text}
                          </span>
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="flex items-center gap-5">
                          <div className="w-[72px] h-[72px] bg-gray-100 rounded-full shrink-0 overflow-hidden border-2 border-white shadow">
                              <img 
                                  src={patient?.image || patientImage}
                                  alt={patient?.name || patientName}
                                  className="w-full h-full object-cover"
                              />
                          </div>
                          <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-800 text-xl truncate">{patient?.name || patientName}</h3>
                              <p className="text-sm text-slate-500">HN: {patient?.hn || patientHN}</p>
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

              {/* Appointment Detail Card */}
              <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                  <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                          <div className="bg-[#4285f4]/10 p-2 rounded-lg text-[#4285f4]">
                              <Calendar size={24} />
                          </div>
                          <div>
                              <CardTitle className="text-lg text-[#5e5873]">ข้อมูลนัดหมาย</CardTitle>
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                      
                      {/* Date & Time Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InfoItem label="วันที่สร้างคำขอ" value={formatThaiDate(data.requestDate)} icon={Calendar} />
                          <InfoItem label="วันที่นัดหมาย" value={formatThaiDate(parsedDate)} icon={CalendarPlus} />
                          <InfoItem label="เวลา" value={displayTime} icon={Clock} />
                      </div>

                      {/* Location Section */}
                      <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                              <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                  <MapPin size={20} />
                              </div>
                              <h3 className="font-bold text-lg text-[#5e5873]">สถานที่</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InfoItem label="โรงพยาบาล" value={data.location || data.hospital || '-'} icon={MapPin} />
                              <InfoItem label="ห้องตรวจ" value={data.room || data.roomName || (data.raw && data.raw.room) || '-'} icon={Home} />
                          </div>
                      </div>

                      {/* Medical Info Section */}
                      <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                              <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                  <Stethoscope size={20} />
                              </div>
                              <h3 className="font-bold text-lg text-[#5e5873]">ข้อมูลการรักษา</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <InfoItem label="การรักษา / หัวข้อนัดหมาย" value={data.title || data.type || data.treatment || '-'} icon={CalendarPlus} />
                              <InfoItem label="ชื่อผู้ที่รักษา" value={data.doctor || '-'} icon={User} />
                          </div>
                      </div>

                      {/* Note Section */}
                      <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                              <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                  <StickyNote size={20} />
                              </div>
                              <h3 className="font-bold text-lg text-[#5e5873]">รายละเอียดการนัดหมาย</h3>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px]">
                              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                  {data.note || data.reason || data.detail || '-'}
                              </p>
                          </div>
                      </div>

                      {/* Recorder */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                              <User className="text-gray-400" size={16} />
                              <span className="text-sm text-gray-500 font-medium">ผู้บันทึกข้อมูล</span>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                              {data.recorder || 'สภัคศิริ สุวิวัฒนา'}
                          </span>
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Right Column: Actions & History */}
          <div className="space-y-6">
              
              {/* Actions Card */}
              <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="pb-3 border-b border-gray-50">
                      <CardTitle className="text-lg text-[#5e5873]">การดำเนินการ</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                       {/* Pending Status Actions: Cancel & Confirm */}
                       {statusConfig.text === 'รอตรวจ' && (
                           <>
                                {onConfirm && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className="w-full bg-[#7367f0] hover:bg-[#685dd8] text-white shadow-sm h-11">
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> ยืนยันนัดหมาย
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-2xl max-w-[340px] w-[90%] gap-6 p-8">
                                            <AlertDialogHeader className="space-y-4">
                                                <div className="mx-auto w-16 h-16 flex items-center justify-center">
                                                    <AlertTriangle className="w-14 h-14 text-red-500" strokeWidth={2} />
                                                </div>
                                                <AlertDialogTitle className="font-bold text-xl text-center text-slate-800 leading-snug">ยืนยันการเปลี่ยนสถานะนัดหมาย</AlertDialogTitle>
                                                <AlertDialogDescription className="text-center text-slate-500 text-base leading-relaxed">
                                                    คุณต้องการเปลี่ยนสถานะนัดหมายจาก "รอตรวจ" เป็น "ยืนยันแล้ว" หรือไม่?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex flex-row gap-3 w-full sm:justify-center pt-2">
                                                <AlertDialogCancel className="flex-1 h-12 rounded-full border-slate-200 font-bold text-slate-700 m-0 text-base bg-white hover:bg-slate-50">ยกเลิก</AlertDialogCancel>
                                                <AlertDialogAction 
                                                    onClick={onConfirm}
                                                    className="flex-1 h-12 rounded-full bg-[#28c76f] hover:bg-[#20a059] text-white font-bold m-0 text-base border-none shadow-md shadow-green-200"
                                                >
                                                    ยืนยัน
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 border-red-200 h-11">
                                            <XCircle className="w-4 h-4 mr-2" /> ยกเลิกนั
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl max-w-[340px] w-[90%] gap-6">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="font-bold text-xl text-center text-slate-800">ยืนยันการยกเลิก</AlertDialogTitle>
                                            <AlertDialogDescription className="text-center text-slate-500 text-base">
                                                คุณต้องการลบนัดหมายนี้ใช่หรือไม่?<br/>
                                                การดำเนินการนี้ไม่สามารถเรียกคืนได้
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex flex-row gap-3 w-full sm:justify-center">
                                            <AlertDialogCancel className="flex-1 h-12 rounded-xl border-slate-200 font-bold text-slate-700 m-0 text-base">กลับ</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={onCancel}
                                                className="flex-1 h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold m-0 text-base border-none shadow-md shadow-red-100"
                                            >
                                                ยืนยันลบ
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                           </>
                       )}

                       {/* Confirmed Status Actions: Record Treatment */}
                       {statusConfig.text === 'ยืนยันแล้ว' && onAddRecord && (
                          <Button 
                              variant="default" 
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm h-11"
                              onClick={onAddRecord}
                          >
                              <PlusCircle className="w-4 h-4" /> บันทึกผลการรักษา
                          </Button>
                       )}
                       
                       <Button variant="outline" className="w-full h-10 border-gray-200 text-gray-600 hover:text-[#7367f0] hover:bg-slate-50" onClick={onEdit}>
                           <Edit className="w-4 h-4 mr-2" /> แก้ไขนัดหมาย
                       </Button>
                  </CardContent>
              </Card>

              {/* Status Timeline Card (Matches Logic of Mobile Steps but displayed vertically in card) */}
              <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="pb-3 border-b border-gray-50">
                      <CardTitle className="text-lg text-[#5e5873]">สถานะการติดตาม</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                          {/* Created */}
                          <div className="relative">
                              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                              <p className="text-sm font-semibold text-[#5e5873]">สร้างนัดหมาย</p>
                              <p className="text-xs text-gray-400">{requestDate !== '-' ? requestDate : '-'}</p>
                          </div>
                          
                          {/* Confirmed */}
                          <div className="relative">
                              <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${statusConfig.text === 'ยืนยันแล้ว' || statusConfig.text === 'เสร็จสิ้น' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <p className={`text-sm font-semibold ${statusConfig.text === 'ยืนยันแล้ว' || statusConfig.text === 'เสร็จสิ้น' ? 'text-[#5e5873]' : 'text-gray-400'}`}>ยืนยันนัดหมาย</p>
                              <p className="text-xs text-gray-400">-</p>
                          </div>

                          {/* Completed */}
                          <div className="relative">
                              <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${statusConfig.text === 'เสร็จสิ้น' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <p className={`text-sm font-semibold ${statusConfig.text === 'เสร็จสิ้น' ? 'text-[#5e5873]' : 'text-gray-400'}`}>ตรวจเสร็จสิ้น</p>
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