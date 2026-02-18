import React from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Stethoscope, 
  Activity, 
  Pill,
  Thermometer,
  Printer,
  Building2
} from 'lucide-react';
import { Button } from "../../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { cn } from "../../../../../../components/ui/utils";
import { StatusBarIPhone16Main } from "../../../../../../components/shared/layout/TopHeader";
import { getPatientByHn } from "../../../../../../data/patientData";

interface Treatment {
  date: string;
  department: string;
  doctor: string;
  title: string; // Used as Diagnosis/Topic
  detail: string;
  status?: string;
  // New fields from AddMedicalRecordForm
  hospital?: string;
  treatment?: string; // "การรักษา"
  chiefComplaint?: string; // "อาการนำ"
  presentIllness?: string; // "อาการเจ็บป่วยปัจจุบัน"
  pastHistory?: string; // "อาการเจ็บป่วยในอดีต"
  diagnosis?: string; // "การวินิจฉัย" (Can fallback to title)
  treatmentResult?: string; // "ผลการรักษา"
  treatmentPlan?: string; // "การวางแผนการรักษา"
}

interface Patient {
  name: string;
  hn: string;
}

interface TreatmentDetailProps {
  treatment: Treatment;
  patient: Patient;
  onBack: () => void;
}

export const TreatmentDetail: React.FC<TreatmentDetailProps> = ({ treatment, patient, onBack }) => {
  if (!treatment) return null;

  // Look up patient record from PATIENTS_DATA for age/gender/diagnosis
  const patientRecord = patient?.hn ? getPatientByHn(patient.hn) : undefined;
  const patientDob = patientRecord?.dob;
  const patientGender = patientRecord?.gender;
  const patientDiagnosis = patientRecord?.diagnosis || treatment.diagnosis || treatment.title || '-';
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

  // Helper: format raw date to Thai short date
  const formatThaiShortDate = (raw: string | undefined): string => {
    if (!raw) return '-';
    // If already contains Thai characters, return as-is
    if (/[ก-๙]/.test(raw)) return raw;
    try {
      const safeRaw = raw.match(/^\d{4}-\d{2}-\d{2}$/) ? raw + 'T00:00:00' : raw;
      const d = new Date(safeRaw);
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    } catch {
      return raw;
    }
  };

  const isCompleted = treatment?.status !== 'upcoming';

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300 fixed inset-0 z-[50000] overflow-hidden">
      
      <style>{`
        .bottom-nav, nav.fixed.bottom-0, .navigation-bar, .mobile-bottom-nav, #mobile-bottom-navigation { display: none !important; }
      `}</style>

      {/* Header */}
      <div className="bg-[#7066a9] shrink-0 z-20">
        <StatusBarIPhone16Main />
        <div className="h-[64px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai',sans-serif]">รายละเอียดการรักษา</h1>
          </div>
          <button className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <Printer size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto p-4 pb-24 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* Patient Info Summary */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4">
                <img 
                    src={patient?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                    alt={patient?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm bg-slate-100"
                />
                <div>
                    <h3 className="font-bold text-slate-800 text-base text-[18px]">{patient?.name || 'ไม่ระบุชื่อ'}</h3>
                    <p className="text-sm text-slate-500">HN: {patient?.hn || '-'}</p>
                </div>
                
            </div>
            {/* Age/Gender & Diagnosis info strip */}
            <div className="grid grid-cols-2 bg-slate-50 border-t border-slate-100">
                <div className="px-4 py-2.5 border-r border-slate-100">
                    <p className="text-xs text-slate-400">อายุ / เพศ</p>
                    <p className="text-sm text-slate-800 font-semibold">{patientAgeGenderText}</p>
                </div>
                <div className="px-4 py-2.5">
                    <p className="text-xs text-slate-400">ผลการวินิจฉัย</p>
                    <p className="text-sm text-slate-800 font-semibold">{patientDiagnosis}</p>
                </div>
            </div>
        </div>

        {/* Date & Location Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-sm text-slate-400 text-[16px]">วันที่เข้ารับการรักษา</span>
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-[18px] text-[#5e5873]">{formatThaiShortDate(treatment.date)}</span>
                </div>
            </div>

            <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-sm text-slate-400 text-[16px]">โรงพยาบาล</span>
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-[18px] text-[#5e5873]">{treatment.hospital || '-'}</span>
                </div>
            </div>
            
            <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-sm text-slate-400 text-[16px]">สถานที่ / แผนก</span>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-[18px] text-[#5e5873]">{treatment.department || '-'}</span>
                </div>
            </div>

            <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-sm text-slate-400 text-[16px]">แพทย์ผู้รักษา</span>
                <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-[18px] text-[#5e5873]">{treatment.doctor || '-'}</span>
                </div>
            </div>
        </div>

        {/* Treatment Info */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="text-[#7066a9]" size={22} />
                <h3 className="font-bold text-lg text-slate-800 text-[20px]">ข้อมูลการรักษา</h3>
            </div>
            
            <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm text-slate-400 text-[16px]">การรักษา</span>
                 <span className="font-semibold text-[18px] text-[#5e5873]">{treatment.treatment || '-'}</span>
            </div>

            <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm text-slate-400 text-[16px]">การวินิจฉัย</span>
                 <span className="font-semibold text-[18px] text-[#5e5873]">{treatment.diagnosis || treatment.title || '-'}</span>
            </div>

            <div className="w-full h-[1px] bg-slate-100 my-2"></div>

            <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm text-slate-400 text-[16px]">อาการนำ (Chief Complaint)</span>
                 <span className="text-[18px] text-[#5e5873]">{treatment.chiefComplaint || '-'}</span>
            </div>

            <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm text-slate-400 text-[16px]">อาการเจ็บป่วยปัจจุบัน (Present Illness)</span>
                 <span className="text-[18px] text-[#5e5873]">{treatment.presentIllness || '-'}</span>
            </div>

            <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm text-slate-400 text-[16px]">อาการเจ็บป่วยในอดีต (Past History)</span>
                 <span className="text-[18px] text-[#5e5873]">{treatment.pastHistory || '-'}</span>
            </div>

             <div className="w-full h-[1px] bg-slate-100 my-2"></div>

            <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm text-slate-400 text-[16px]">ผลการรักษา</span>
                 <span className="text-[18px] text-[#5e5873]">{treatment.treatmentResult || '-'}</span>
            </div>

            <div className="flex flex-col gap-1 overflow-hidden">
                 <span className="text-sm text-slate-400 text-[16px]">แผนการรักษา</span>
                 <span className="text-[18px] text-[#5e5873]">{treatment.treatmentPlan || '-'}</span>
            </div>
        </div>

        {/* Tracking Status Timeline (matching web MedicalRecordDetail pattern) */}
        <Card className="rounded-2xl border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-[#5e5873] text-base font-bold">สถานะการติดตาม</CardTitle>
            </CardHeader>
            <div className="px-6 pb-2">
                <div className="h-[1px] bg-gray-100 w-full"></div>
            </div>
            <CardContent className="pt-4">
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                    {/* Step 1: Created */}
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#5e5873] text-[16px]">บันทึกการรักษา</span>
                            <span className="text-sm text-gray-400">{formatThaiShortDate(treatment.date)}</span>
                        </div>
                    </div>

                    {/* Step 2: Treatment */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[16px] font-bold",
                                isCompleted ? "text-[#5e5873]" : "text-gray-400"
                            )}>เข้ารับการรักษา</span>
                            <span className="text-sm text-gray-400">{isCompleted ? formatThaiShortDate(treatment.date) : '-'}</span>
                        </div>
                    </div>

                    {/* Step 3: Completed */}
                    <div className="relative">
                        <div className={cn(
                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[16px] font-bold",
                                isCompleted ? "text-[#5e5873]" : "text-gray-400"
                            )}>เสร็จสิ้นการรักษา</span>
                            <span className="text-sm text-gray-400">-</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}