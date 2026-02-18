import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Textarea } from "../../../../../components/ui/textarea";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Phone,
  Navigation,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home,
  AlertTriangle,
  Printer,
  ChevronRight,
  CheckCircle,
  X,
  PlusCircle,
  Edit,
  ClipboardList
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { HOME_VISIT_DATA, getPatientByHn } from '../../../../../data/patientData';
import { HomeVisitForm } from "../../../cm-mobile/home-visit/forms/HomeVisitForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";

// Helper to format Thai Date
const formatThaiDate = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === '-') return '-';
    // Normalize Thai text with 4-digit year to 2-digit
    if (/[ก-๙]/.test(dateStr)) {
        const m = dateStr.match(/^(\d{1,2}\s+\S+\s+)(25\d{2})$/);
        if (m) return m[1] + m[2].slice(-2);
        return dateStr;
    }
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    } catch (e) {
        return dateStr;
    }
};

// InfoItem with optional icon support
const InfoItem = ({ label, value, icon: Icon, valueClassName }: { label: string, value?: string, icon?: any, valueClassName?: string }) => (
    <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
            {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
            <span className={valueClassName}>{value || '-'}</span>
        </div>
    </div>
);

export interface VisitDetailProps {
  visit: any; 
  patient?: any;
  onBack: () => void;
  onCancelRequest?: (id: string) => void;
  onOpenForm?: () => void;
  showFooter?: boolean;
  onViewHistory?: () => void;
  onContactPCU?: () => void;
  role?: 'cm' | 'pcu';
}

export function HomeVisitRequestDetail({ visit, patient, onBack, onCancelRequest, onOpenForm, role = 'cm', onContactPCU }: VisitDetailProps) {
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<string>(visit?.status || 'pending');

  // Helper to update global data
  const updateVisitData = (updates: any) => {
      if (!visit) return;
      
      const target = HOME_VISIT_DATA.find(v => {
          if (visit.id && v.id === visit.id) return true;
          if (visit.hn && v.hn === visit.hn && visit.date === v.date) return true;
          return false;
      });

      if (target) {
          Object.assign(target, updates);
          console.log(`Updated visit data for ${visit.patientName}:`, updates);
      }
      
      if (updates.status) {
          setLocalStatus(updates.status);
      }
  };

  const updateGlobalStatus = (newStatus: string) => {
      updateVisitData({ status: newStatus });
  };

  // --- Data Normalization Logic ---
  const rawVisit = visit || {};
  const rawPatient = patient || {};

  // 1. Patient Info - Single source from PATIENTS_DATA
  const displayHN = rawVisit.hn || rawVisit.patientId || rawVisit.patientHn || rawPatient.hn || rawPatient.id_card || rawPatient.cid || '-';
  const patientRecord = getPatientByHn(displayHN);

  const displayName = patientRecord?.name || rawVisit.patientName || rawVisit.name || rawPatient.name || rawPatient.full_name_th || rawPatient.full_name_en || '-';
  
  const rawImage = patientRecord?.image || rawVisit.patientImage || rawPatient.image || rawPatient.profile_picture || rawPatient.personal_profile?.profile_picture;
  const displayImage = (rawImage && rawImage !== "null") ? rawImage : null;

  const resolvedDob = patientRecord?.dob || rawVisit.patientDob;
  const resolvedGender = patientRecord?.gender || rawVisit.patientGender;
  const resolvedDiagnosis = patientRecord?.diagnosis || rawVisit.diagnosis || '-';

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

  let displayAddress = rawVisit.patientAddress || rawVisit.contact?.address || rawPatient.contact?.address;
  if (!displayAddress && rawPatient.address) {
      const a = rawPatient.address;
      displayAddress = `${a.house_no || ''} ${a.moo ? 'ม.'+a.moo : ''} ${a.sub_district || ''} ${a.district || ''} ${a.province || ''}`.trim();
  }
  if (!displayAddress) displayAddress = 'ไมระบุที่อยู่';

  const displayPhone = rawVisit.contact?.phone || rawPatient.phone || rawPatient.contact?.phone || '08x-xxx-xxxx';

  // 2. Visit Info
  const displayRequestDate = formatThaiDate(rawVisit.requestDate || rawVisit.createdDate || rawVisit.rawRequestDate);
  const displayDate = formatThaiDate(rawVisit.date || rawVisit.appointmentDate || rawVisit.rawDate);
  const displayRPH = rawVisit.rph || rawVisit.provider || rawVisit.visitor || rawVisit.responsibleHealthCenter || '-';
  const displayVisitor = displayRPH;
  const displayNote = rawVisit.note || rawVisit.detail || rawVisit.results || rawVisit.title || '-';
  const patientDiagnosis = resolvedDiagnosis;

  // 3. Status Normalization
  const rawStatus = (localStatus || '').toLowerCase();
  let displayStatus = 'Pending';
  if (['inprogress', 'in_progress', 'working', 'ลงพื้นที่', 'อยู่ในพื้นที่', 'ดำเนินการ'].includes(rawStatus)) displayStatus = 'InProgress';
  if (['accepted', 'accept', 'รับงาน', 'ยืนยันรับงาน'].includes(rawStatus)) displayStatus = 'Accepted';
  if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited'].includes(rawStatus)) displayStatus = 'Completed';
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(rawStatus)) displayStatus = 'Rejected';
  if (['pending', 'waiting', 'wait', 'รอ', 'รอการตอบรับ'].includes(rawStatus)) displayStatus = 'Pending';
  if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(rawStatus)) displayStatus = 'WaitVisit';
  if (['nothome', 'not_home', 'not home', 'ไม่อยู่'].includes(rawStatus)) displayStatus = 'NotHome';
  if (['notallowed', 'not_allowed', 'not allowed', 'ไม่อนุญาต'].includes(rawStatus)) displayStatus = 'NotAllowed';

  // 4. Type Normalization
  let displayType = 'Joint'; 
  const rawType = (rawVisit.type || rawVisit.visit_type || '').toLowerCase();
  if (rawType.includes('delegated') || rawType.includes('ฝาก')) displayType = 'Delegated';
  else displayType = 'Joint'; 

  const getTypeLabel = () => {
      if (displayType === 'Delegated') return 'ฝาก รพ.สต. เยี่ยม';
      return 'ลงเยี่ยมพร้อม รพ.สต.';
  };

  // Status helpers
  const getStatusLabel = () => {
      switch (displayStatus) {
          case 'Pending': return 'รอการตอบรับ';
          case 'Accepted': return 'รับงาน';
          case 'WaitVisit': return 'รอเยี่ยม';
          case 'InProgress': return 'ดำเนินการ';
          case 'Completed': return 'เสร็จสิ้น';
          case 'Rejected': return 'ปฏิเสธ';
          case 'NotHome': return 'ไม่อยู่';
          case 'NotAllowed': return 'ไม่อนุญาต';
          default: return 'รอการตอบรับ';
      }
  };

  const getStatusColor = () => {
      switch (displayStatus) {
          case 'Pending': return 'bg-orange-100 text-orange-600';
          case 'Accepted': return 'bg-blue-100 text-blue-600';
          case 'WaitVisit': return 'bg-yellow-100 text-yellow-700';
          case 'InProgress': return 'bg-blue-100 text-blue-600';
          case 'Completed': return 'bg-green-100 text-green-600';
          case 'Rejected': return 'bg-red-100 text-red-600';
          case 'NotHome': return 'bg-red-50 text-red-500';
          case 'NotAllowed': return 'bg-gray-100 text-gray-500';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  // --- Handlers ---
  const handleRecordResult = () => {
      setIsVisitFormOpen(true);
  };

  const handlePCUAccept = (date: Date, details: string) => {
      updateVisitData({
          status: 'wait_visit',
          date: date.toISOString(),
          time: date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }),
          note: details ? details : (visit?.note || '')
      });
  };

  const handlePCUReject = (reason: string) => {
      updateVisitData({ status: 'rejected', note: reason });
      onBack();
  };

  const handlePCUInArea = (details: string) => {
     // Assuming InArea just confirms they are there, similar to WaitVisit but maybe different sub-flow
     // Mobile logic maps 'Accepted' -> 'In Area' dialog -> 'WaitVisit'
     // Here we can map it to WaitVisit as well if they confirm date/time, OR keep it separate.
     // Mobile logic: AcceptReferralDialog triggers 'wait_visit'.
     // So 'In Area' button usually means "I'm in the area, ready to visit"?
     // Wait, in mobile: "อยู่ในพื้นที่" triggers AcceptReferralDialog -> sets 'wait_visit'.
     // "ไม่อยู่ในพื้นที่" triggers RejectedReferralDialog -> sets 'nothome'.
     // "ไม่อนุญาตให้ลงพื้นที่" -> sets 'notallowed'.
  };

  if (isVisitFormOpen) {
      return (
        <div className="fixed inset-0 z-[10002] bg-white flex flex-col">
            <HomeVisitForm 
                onBack={() => setIsVisitFormOpen(false)} 
                onSave={(data) => {
                    setIsVisitFormOpen(false);
                    const nextStatus = 'completed';
                    updateGlobalStatus(nextStatus);
                }}
                initialPatientId={patient?.hn}
                patientName={patient?.name}
                patient={patient}
            />
        </div>
      );
  }

  // --- Render ---
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 font-['IBM_Plex_Sans_Thai']">
      
      {/* Result Form Overlay (View Only) */}
      {isResultOpen && (
        <div className="fixed inset-0 z-[10002] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
             <HomeVisitForm 
                readOnly={true} 
                initialData={rawVisit.data || {}} 
                onBack={() => setIsResultOpen(false)}
             />
        </div>
      )}

      {/* Header with Back Button */}
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
            <h1 className="text-[#5e5873] font-bold text-lg">
                รายละเอียดการเยี่ยมบ้าน {rawVisit.id || '-'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
                ข้อมูลรายละเอียดและแบบประเมินการเยี่ยมบ้าน
            </p>
        </div>
        <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
        </Button>
      </div>

      {/* Green Appointment Date Banner (matching Mobile VisitDetail — outside grid) */}
      {['WaitVisit', 'InProgress', 'Completed'].includes(displayStatus) && (
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
             <div className="bg-white p-2.5 rounded-full shadow-sm border border-emerald-100">
                 <Calendar className="text-emerald-600 w-5 h-5" />
             </div>
             <div>
                 <span className="text-sm text-emerald-600 font-semibold block mb-0.5">วันนัดหมายเยี่ยมบ้าน</span>
                 <span className="text-emerald-900 font-bold text-lg">
                    {(() => {
                         try {
                             const d = rawVisit.date ? new Date(rawVisit.date) : null;
                             if (d && !isNaN(d.getTime())) {
                                 return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                             }
                             return displayDate; 
                         } catch { return displayDate; }
                    })()}
                 </span>
                 <span className="text-emerald-700 text-sm ml-2">
                    {rawVisit.time ? `${rawVisit.time.substring(0, 5)} น.` : ''}
                 </span>
             </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
              {/* Patient Info Summary - matches reference image */}
              <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 border-b border-gray-50">
                      <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor()}`}>
                              {getStatusLabel()}
                          </span>
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="flex items-center gap-5">
                          <div className="w-[72px] h-[72px] bg-gray-100 rounded-full shrink-0 overflow-hidden border-2 border-white shadow">
                              <img 
                                  src={displayImage || patientRecord?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                              />
                          </div>
                          <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-800 text-xl truncate">{displayName}</h3>
                              <p className="text-sm text-slate-500">HN: {displayHN}</p>
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

              {/* Visit Detail Card */}
              <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                  <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                          <div className="bg-[#28c76f]/10 p-2 rounded-lg text-[#28c76f]">
                              <Home size={24} />
                          </div>
                          <div>
                              <CardTitle className="text-lg text-[#5e5873]">บันทึกการเยี่ยมบ้าน</CardTitle>
                              <p className="text-sm text-gray-500">วันที่: {displayDate}</p>
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                      {/* Visit Info Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InfoItem label="วันที่สร้างคำขอ" value={displayRequestDate !== '-' ? displayRequestDate : displayDate} icon={Calendar} />
                          <InfoItem 
                              label="ประเภทการเยี่ยม" 
                              value={getTypeLabel()} 
                              icon={Home} 
                              valueClassName="font-semibold text-[#7367f0]"
                          />
                          <InfoItem label="หน่วยงาน/ผู้เยี่ยม" value={displayVisitor} icon={User} />
                          <InfoItem label="ผลการประเมิน" value={rawVisit.status || 'เรียบร้อย'} icon={CheckCircle2} />
                      </div>

                      {/* Note / Result Section */}
                      {displayNote && displayNote !== '-' && (
                          <div className="space-y-3">
                              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                  <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                      <FileText size={20} />
                                  </div>
                                  <h3 className="font-bold text-lg text-[#5e5873]">ผลการเยี่ยม / หมายเหตุ</h3>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px]">
                                  <p className="text-gray-600 leading-relaxed">{displayNote}</p>
                              </div>
                          </div>
                      )}

                      {/* Location & Map */}
                      <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                              <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                  <MapPin size={20} />
                              </div>
                              <h3 className="font-bold text-lg text-[#5e5873]">พิกัด</h3>
                          </div>
                          <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between">
                              <span className="text-gray-600 text-sm">18.796, 98.979</span>
                              <Button variant="link" size="sm" className="h-auto p-0 text-[#7367f0]">ดูแผนที่</Button>
                          </div>
                      </div>

                      {/* Images Placeholder */}
                      <div className="space-y-3">
                          <h3 className="font-semibold text-gray-700">รูปภาพประกอบ</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[1, 2].map((i) => (
                                  <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
                                      IMG_{i}
                                  </div>
                              ))}
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Visit Results Link */}
              {(displayStatus === 'Completed' || (rawVisit.data && Object.keys(rawVisit.data).length > 0)) && (
                   <Card 
                        className="rounded-2xl border-none shadow-sm cursor-pointer hover:bg-gray-50 transition-all bg-white group border border-gray-100"
                        onClick={() => setIsResultOpen(true)}
                    >
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#F3F2FF] flex items-center justify-center text-[#7066a9] shrink-0 group-hover:scale-105 transition-transform">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-base">เอกสารผลการเยี่ยมบ้าน</h4>
                                    <p className="text-sm text-slate-500">คลิกเพื่อดูรายละเอียดบันทึก</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-300 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </CardContent>
                    </Card>
              )}
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
              <Card className="border-gray-100 shadow-sm">
                  <CardHeader className="pb-3 border-b border-gray-50">
                      <CardTitle className="text-lg text-[#5e5873]">การดำเนินการ</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                      
                      {role === 'pcu' ? (
                        // PCU Actions
                        <>
                           {displayStatus === 'Pending' && (
                             <div className="flex gap-3">
                                <RejectDialog 
                                    trigger={
                                        <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                                            ปฏิเสธ
                                        </Button>
                                    }
                                    onConfirm={handlePCUReject}
                                />
                                <AcceptDialog 
                                    trigger={
                                        <Button className="flex-1 bg-[#28c76f] hover:bg-[#22a85e] text-white">
                                            รับงาน
                                        </Button>
                                    }
                                    onConfirm={handlePCUAccept}
                                />
                             </div>
                           )}

                           {(displayStatus === 'InProgress' || displayStatus === 'Accepted') && (
                             <div className="space-y-3">
                                <Button 
                                    variant="outline"
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => updateGlobalStatus('notallowed')}
                                >
                                    ไม่อนุญาตให้ลงพื้นที่
                                </Button>
                                <div className="flex gap-3">
                                    <RejectDialog 
                                        trigger={
                                            <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                                                ไม่อยู่ในพื้นที่
                                            </Button>
                                        }
                                        onConfirm={(reason) => {
                                            updateVisitData({ status: 'nothome', note: reason });
                                            onBack();
                                        }}
                                        title="เหตุผลที่ไม่อยู่ในพื้นที่"
                                        label="รายละเอียด"
                                    />
                                    <AcceptDialog 
                                        trigger={
                                            <Button className="flex-1 bg-[#28c76f] hover:bg-[#22a85e] text-white">
                                                อยู่ในพื้นที่
                                            </Button>
                                        }
                                        onConfirm={handlePCUAccept}
                                        title="ยืนยันอยู่ในพื้นที่"
                                        description="กำหนดวันนัดหมายเยี่ยมบ้าน"
                                    />
                                </div>
                             </div>
                           )}

                           {displayStatus === 'WaitVisit' && (
                               <Button 
                                    className="w-full bg-[#7367F0] hover:bg-[#655bd3] shadow-sm text-white"
                                    onClick={handleRecordResult}
                                >
                                    <FileText className="w-5 h-5 mr-2" /> ลงบันทึกการเยี่ยม
                                </Button>
                           )}

                           {displayStatus === 'Completed' && (
                               <Button 
                                    className="w-full bg-white border border-[#0e9f6e] text-[#0e9f6e] hover:bg-green-50 shadow-sm"
                                    onClick={() => setIsVisitFormOpen(true)}
                                >
                                    <FileText className="w-5 h-5 mr-2" /> แก้ไขผลการติดตาม
                                </Button>
                           )}
                        </>
                      ) : (
                        // CM Actions
                        <div className="space-y-4">
                           {displayStatus === 'WaitVisit' && (
                             <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm h-11"
                                onClick={handleRecordResult}
                            >
                                <PlusCircle className="w-4 h-4" /> บันทึกผลการรักษา
                            </Button>
                          )}

                          {displayStatus === 'Completed' && (
                              <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm h-11"
                                onClick={() => setIsVisitFormOpen(true)}
                              >
                                 <PlusCircle className="w-4 h-4" /> แก้ไขผลการติดตาม
                              </Button>
                          )}

                          <Button 
                              variant="outline" 
                              className="w-full h-10 border-gray-200 text-gray-600 hover:text-[#7367f0] hover:bg-slate-50" 
                              onClick={onContactPCU}
                          >
                              <Edit className="w-4 h-4 mr-2" /> แก้ไขนัดหมาย
                          </Button>
                          
                          {displayStatus === 'Pending' && (
                            <Button 
                                variant="outline" 
                                className="w-full text-red-600 hover:bg-red-50 border-red-200 h-11"
                                onClick={() => {
                                    if (onCancelRequest) onCancelRequest(rawVisit.id);
                                }}
                            >
                                <X className="w-4 h-4 mr-2" /> ยกเลิกคำขอ
                            </Button>
                          )}
                        </div>
                      )}

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
                                  <span className="text-sm font-bold text-[#5e5873]">สร้างคำขอเยี่ยมบ้าน</span>
                                  <span className="text-sm text-gray-400">{displayRequestDate !== '-' ? displayRequestDate : displayDate}</span>
                              </div>
                          </div>
                          
                          {/* Step 2: Accepted */}
                          <div className="relative">
                              <div className={cn(
                                  "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                  ['InProgress', 'WaitVisit', 'Completed', 'Accepted'].includes(displayStatus) ? "bg-green-500" : "bg-gray-300"
                              )}></div>
                              <div className="flex flex-col">
                                  <span className={cn(
                                      "text-sm font-bold",
                                      ['InProgress', 'WaitVisit', 'Completed', 'Accepted'].includes(displayStatus) ? "text-[#5e5873]" : "text-gray-400"
                                  )}>ตอบรับคำขอ</span>
                                  <span className="text-sm text-gray-400">-</span>
                              </div>
                          </div>

                          {/* Step 3: Visited */}
                          <div className="relative">
                              <div className={cn(
                                  "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                  displayStatus === 'Completed' ? "bg-green-500" : "bg-gray-300"
                              )}></div>
                              <div className="flex flex-col">
                                  <span className={cn(
                                      "text-sm font-bold",
                                      displayStatus === 'Completed' ? "text-[#5e5873]" : "text-gray-400"
                                  )}>ลงพื้นที่เยี่ยมบ้าน</span>
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

// Inline Simplified Dialog Components for Web
function RejectDialog({ trigger, onConfirm, title = "ปฏิเสธคำขอ", label = "เหตุผลการปฏิเสธ" }: { trigger: React.ReactNode, onConfirm: (reason: string) => void, title?: string, label?: string }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        โปรดระบุรายละเอียดการดำเนินการ
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label className="mb-2 block">{label}</Label>
                    <Textarea 
                        value={reason} 
                        onChange={e => setReason(e.target.value)} 
                        placeholder="ระบุรายละเอียด..."
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
                    <Button 
                        variant="destructive" 
                        onClick={() => {
                            onConfirm(reason);
                            setOpen(false);
                        }}
                        disabled={!reason.trim()}
                    >
                        ยืนยัน
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function AcceptDialog({ trigger, onConfirm, title = "ตอบรับคำขอ", description = "กำหนดวันนัดหมาย" }: { trigger: React.ReactNode, onConfirm: (date: Date, details: string) => void, title?: string, description?: string }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [details, setDetails] = useState("");

    const handleConfirm = () => {
        if (!date || !time) return;
        const d = new Date(`${date}T${time}`);
        onConfirm(d, details);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>วันที่</Label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>เวลา</Label>
                            <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>รายละเอียดเพิ่มเติม</Label>
                        <Textarea 
                            value={details} 
                            onChange={e => setDetails(e.target.value)} 
                            placeholder="ระบุรายละเอียด (ถ้ามี)..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
                    <Button 
                        className="bg-[#28c76f] hover:bg-[#22a85e] text-white" 
                        onClick={handleConfirm}
                        disabled={!date || !time}
                    >
                        ยืนยัน
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}