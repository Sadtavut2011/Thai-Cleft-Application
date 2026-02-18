import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { cn } from "../../../../components/ui/utils";
// Adapt imports to point to existing mobile components
import { FundRequestPage } from "../operations/fund-request/FundRequestPage";
import { FundDisbursementPage } from "./operations/fund-request/FundDisbursementPage";
import ReferralAdd from "../operations/referral/referralADD";
import AppointmentSystem from "../../cm-mobile/appointment/AppointmentSystem";
import { AddMedicalRecordForm } from "./AddMedicalRecordForm";
import { CreateHomeVisitPage } from "../operations/home-visit/CreateHomeVisitPage";
import { HomeVisitForms } from "../operations/home-visit/HomeVisitForms";
import { AddAppointmentModal } from "../operations/appointment/AddAppointmentModal";

// Detail Page Imports from ./details/
import { AppointmentDetailPage } from "./details/AppointmentDetailPage";
import { ReferralSystemDetail } from "./details/ReferralSystemDetail";
import { HomeVisitRequestDetail } from "./details/HomeVisitRequestDetail";
import { TeleConsultationSystemDetail } from "./details/TeleConsultationSystemDetail";
import { FundRequestDetailPage } from "./details/FundRequestDetailPage";
import { MedicalRecordDetail } from "./details/MedicalRecordDetail";
import { MutualFundHistory } from "./details/MutualFundHistory";
import { formatThaiDate, formatThaiDateFull } from "../utils/formatThaiDate";
import { PatientDetailHeader } from "./PatientDetailHeader";
import { NewPatient, PatientFormData } from "../pages/NewPatient";
import { PATIENTS_DATA, getPatientByHn } from '../../../../data/patientData';
import { EditCarePathway } from '../../cm-mobile/patient/detail/EditCarePathway';

import { 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Activity, 
  FileText, 
  Clock, 
  Stethoscope,
  Video,
  Home,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  Upload,
  X,
  AlertTriangle,
  Pencil,
  ArrowLeft,
  Send,
  ChevronDown,
  Wallet,
  ShieldCheck,
  Users,
  MessageCircle,
  Image as ImageIcon,
  Download
} from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

// --- Placeholder Components for missing dependencies ---

const ADDTreatmentPlanSystem = ({ patient, onBack }: { patient: any, onBack: () => void }) => (
    <div className="p-6 bg-white rounded-lg h-full flex flex-col">
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={onBack}><X /></Button>
            <h2 className="text-xl font-bold">เพิ่มแผนการรักษา</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
            แบบฟอร์มเพิ่มแผนการรักษา (Placeholder)
        </div>
    </div>
);

const SaveConfirmationModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">ยืนยันการบันทึก</h3>
                    <p className="text-gray-500 text-sm">คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลใช่หรือไม่?</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onCancel}>ยกเลิก</Button>
                    <Button className="flex-1 bg-[#28c76f] hover:bg-[#20a059] text-white" onClick={onConfirm}>ยืนยัน</Button>
                </div>
            </div>
        </div>
    );
};

// --- Interfaces ---

export interface TreatmentPlanItem {
  stage: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
}

export interface TreatmentHistoryItem {
  date: string;
  hospital: string;
  detail: string;
  doctor: string;
  // Extended for detail view
  department?: string;
  treatment?: string;
  diagnosis?: string;
}

export interface AppointmentItem {
  id?: string;
  datetime: string;
  detail: string;
  status?: string;
  // Extended for detail view
  location?: string;
  doctor?: string;
  type?: string;
  date?: string;
  time?: string;
  requestDate?: string;
  room?: string;
  title?: string;
  note?: string;
  reason?: string;
  recorder?: string;
  hospital?: string;
}

export interface ReferralItem {
  id?: string;
  treatment: string;
  date: string;
  status: 'Accepted' | 'Rejected' | 'Pending' | 'Completed' | 'Approved' | 'Created' | 'Sent' | 'Viewed' | 'Canceled';
  destination: string;
  // Extended
  referralNo?: string;
  patientHn?: string;
  patientName?: string;
  sourceHospital?: string;
  reason?: string;
  diagnosis?: string;
  urgency?: 'Routine' | 'Urgent' | 'Emergency';
  doctor?: string;
  acceptedDate?: string;
  title?: string;
  from?: string;
  to?: string;
}

export interface HomeVisitItem {
  id?: string;
  date: string;
  detail: string;
  status: string;
  visitType?: 'ฝากเยี่ยม' | 'เยี่ยมร่วม';
  // Extended
  visitor?: string;
  result?: string;
}

export interface TeleConsultItem {
  id?: string;
  detail: string;
  datetime: string;
  link: string;
  type: 'Direct' | 'ViaHospital';
  // Extended
  doctor?: string;
  status?: string;
  title?: string;
  date?: string;
  channel?: string;
  agency_name?: string;
  requestDate?: string;
  consultResult?: string;
  meetingLink?: string;
}

export interface FundItem {
  id?: string;
  name: string;
  date: string;
  amount: number;
  status: 'Approved' | 'Pending';
  // Extended
  requester?: string;
  description?: string;
}

export interface PatientData {
  id: number;
  code: string;
  name: string;
  diagnosis: string;
  hospital: string;
  status: string;
  image?: string;
  
  // Extended fields (matches mobile PatientProfileTab)
  cid?: string;
  hn?: string;
  dob?: string;
  age?: string;
  gender?: string;
  bloodGroup?: string;
  race?: string;
  nationality?: string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  allergies?: string;
  attendingPhysician?: string;
  address?: string;
  phone?: string;
  guardian?: string;
  rph?: string;
  responsibleHealthCenter?: string;
  rights?: string;
  rightsSecondary?: string;
  doctor?: string;

  // English name fields (matches NewPatient Step 3)
  firstNameEn?: string;
  lastNameEn?: string;

  // Patient status label (matches NewPatient Step 2)
  patientStatusLabel?: string;

  // Address breakdown (matches NewPatient Step 4)
  addressNo?: string;
  addressMoo?: string;
  addressSoi?: string;
  addressRoad?: string;
  addressPostalCode?: string;
  addressProvince?: string;
  addressDistrict?: string;
  addressSubDistrict?: string;

  // Contact info (matches mobile)
  contact?: {
    phone?: string;
    homePhone?: string;
    email?: string;
    address?: string;
    name?: string;
    relation?: string;
    idCard?: string;
    dob?: string;
    age?: string;
    occupation?: string;
    status?: string;
  };

  // Hospital info (matches mobile)
  hospitalInfo?: {
    responsibleRph?: string;
    firstDate?: string;
    distance?: string;
    travelTime?: string;
  };

  treatmentPlan?: TreatmentPlanItem[];
  treatmentHistory?: TreatmentHistoryItem[];
  appointments?: AppointmentItem[];
  referrals?: ReferralItem[];
  homeVisits?: HomeVisitItem[];
  teleConsults?: TeleConsultItem[];
  funds?: FundItem[];
  
  // Mock fields from previous version
  dateAdded?: string;
  addedBy?: string;
  lastUpdated?: string;
}

interface PatientDetailProps {
  patient: PatientData;
  onBack: () => void;
  onNavigate?: (page: string, patientId?: string) => void;
  onAction?: (action: string, data?: any) => void;
  onAddMedicalRecord?: () => void;
  onRequestFund?: () => void;
}

interface DetailRowProps {
  label: string;
  value: string;
  isReadOnly?: boolean;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
}

// Helper: parse age string like "3 เดือน", "9-18 เดือน", "2 ปี" to numeric months for sorting
const parseAgeToMonths = (ageStr: string): number => {
    if (!ageStr || ageStr === '-' || ageStr === 'แรกเกิด') return 0;
    const nums = ageStr.match(/(\d+)/g);
    if (!nums) return 0;
    const firstNum = parseInt(nums[0]);
    if (ageStr.includes('ปี')) return firstNum * 12;
    return firstNum; // treat as months
};

// Helper: format age string to normalized duration
const formatAgeDuration = (ageStr: string): string => {
    if (!ageStr || ageStr === '-') return '-';
    if (ageStr === 'แรกเกิด') return 'แรกเกิด';
    let years = 0, months = 0;
    if (ageStr.includes('ปี')) {
        const parts = ageStr.split('ปี');
        const yMatch = parts[0].trim().match(/(\d+)/);
        if (yMatch) years = parseInt(yMatch[1]);
        if (parts[1] && parts[1].includes('เดือน')) {
            const mMatch = parts[1].trim().match(/(\d+)/);
            if (mMatch) months = parseInt(mMatch[1]);
        }
    } else if (ageStr.includes('เดือน')) {
        const mMatch = ageStr.match(/(\d+)/);
        if (mMatch) months = parseInt(mMatch[1]);
    }
    let result = '';
    if (years > 0) result += `${years} ปี`;
    if (months > 0) result += `${result ? ' ' : ''}${months} เดือน`;
    return result || ageStr;
};

// --- Helper Components ---

function SectionHeader({ title, icon, action }: { title: string, icon: React.ReactNode, action?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-8 pb-2 border-b border-[#E0E0E0]">
      <div className="text-[#7367f0] p-1.5 bg-[#7367f0]/10 rounded-lg">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#5e5873]">{title}</h3>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}

function DetailRow({ label, value, isReadOnly = true, onChange, icon }: DetailRowProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center gap-2 text-sm font-medium text-[#6e6b7b]">
        {icon && <div className="text-[#7367f0] w-4 h-4">{icon}</div>}
        {label}
      </div>
      <Input 
        value={value} 
        readOnly={isReadOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "h-[40px] rounded-[5px] text-[15px]",
          isReadOnly 
            ? "bg-[#f8f8f8] border-transparent text-[#5e5873]" 
            : "bg-white border-[#7367f0] text-black ring-2 ring-[#7367f0]/20"
        )}
      />
    </div>
  );
}

function StatusBadge({ status, system }: { status: string; system?: 'fund' | 'referral' | 'homevisit' | 'teleconsult' }) {
  const s = (status || '').toLowerCase();

  const getLabel = (): string => {
    if (system === 'fund') {
      if (['approved', 'อนุมัติ'].includes(s)) return 'อนุมัติแล้ว';
      if (['pending', 'รอ'].includes(s)) return 'รอการพิจารณา';
      if (['rejected', 'ปฏิเสธ'].includes(s)) return 'ปฏิเสธ';
      return status;
    }
    if (system === 'referral') {
      if (['pending', 'referred'].includes(s)) return 'รอการตอบรับ';
      if (['accepted', 'confirmed'].includes(s)) return 'รอรับตัว';
      if (['received', 'waiting_doctor'].includes(s)) return 'รอตรวจ';
      if (['completed', 'treated'].includes(s)) return 'ตรวจแล้ว';
      if (['cancelled', 'rejected'].includes(s)) return 'ยกเลิก';
      return status;
    }
    if (system === 'homevisit') {
      if (['pending', 'waiting', 'wait', 'รอ', 'รอการตอบรับ'].includes(s)) return 'รอตอบรับ';
      if (['accepted', 'รับงาน'].includes(s)) return 'รับงาน';
      if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(s)) return 'รอเยี่ยม';
      if (['inprogress', 'in_progress'].includes(s)) return 'ดำเนินการ';
      if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited', 'เรียบร้อย'].includes(s)) return 'เสร็จสิ้น';
      if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(s)) return 'ปฏิเสธ';
      return status;
    }
    if (system === 'teleconsult') {
      if (['waiting', 'pending'].includes(s)) return 'รอสาย';
      if (['inprogress', 'in_progress'].includes(s)) return 'ดำเนินการ';
      if (['cancelled', 'missed'].includes(s)) return 'ยกเลิก';
      if (['completed', 'done'].includes(s)) return 'เสร็จสิ้น';
      if (s === 'direct') return 'ส่งตรงหาผู้ป่วย';
      if (s === 'viahospital') return 'ผ่าน รพ.สต.';
      return status;
    }
    // Generic fallback
    if (s === 'approved') return 'อนุมัติ';
    if (s === 'pending') return 'รอดำเนินการ';
    if (s === 'accepted') return 'ตอบรับแล้ว';
    if (s === 'rejected') return 'ปฏิเสธ';
    if (['completed', 'เรียบร้อย'].includes(s)) return 'เสร็จสิ้น';
    if (s === 'canceled' || s === 'cancelled') return 'ยกเลิก';
    if (s === 'direct') return 'ส่งตรงหาผู้ป่วย';
    if (s === 'viahospital') return 'ผ่าน รพ.สต.';
    if (s === 'created') return 'สร้างแล้ว';
    if (s === 'sent') return 'ส่งแล้ว';
    return status;
  };

  const getColor = (): string => {
    if (system === 'fund') {
      if (['approved', 'อนุมัติ'].includes(s)) return 'text-[#00A63E]';
      if (['pending', 'รอ'].includes(s)) return 'text-[#ff9f43]';
      if (['rejected', 'ปฏิเสธ'].includes(s)) return 'text-[#ea5455]';
      return 'text-[#6e6b7b]';
    }
    if (system === 'referral') {
      if (['pending', 'referred'].includes(s)) return 'text-[#4285f4]';
      if (['accepted', 'confirmed'].includes(s)) return 'text-[#ff6d00]';
      if (['received', 'waiting_doctor'].includes(s)) return 'text-[#00cfe8]';
      if (['completed', 'treated'].includes(s)) return 'text-[#00A63E]';
      if (['cancelled', 'rejected', 'canceled'].includes(s)) return 'text-[#ea5455]';
      return 'text-[#6e6b7b]';
    }
    if (system === 'homevisit') {
      if (['pending', 'waiting', 'wait', 'รอ', 'รอการตอบรับ'].includes(s)) return 'text-[#ff9f43]';
      if (['accepted', 'รับงาน'].includes(s)) return 'text-[#00cfe8]';
      if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(s)) return 'text-[#ff9f43]';
      if (['inprogress', 'in_progress'].includes(s)) return 'text-[#00cfe8]';
      if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited', 'เรียบร้อย'].includes(s)) return 'text-[#00A63E]';
      if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(s)) return 'text-[#ea5455]';
      return 'text-[#6e6b7b]';
    }
    if (system === 'teleconsult') {
      if (['waiting', 'pending'].includes(s)) return 'text-[#ff9f43]';
      if (['inprogress', 'in_progress'].includes(s)) return 'text-[#00cfe8]';
      if (['cancelled', 'missed'].includes(s)) return 'text-[#ea5455]';
      if (['completed', 'done'].includes(s)) return 'text-[#00A63E]';
      if (s === 'direct') return 'text-[#00cfe8]';
      if (s === 'viahospital') return 'text-[#7367f0]';
      return 'text-[#6e6b7b]';
    }
    // Generic fallback
    if (['approved', 'completed', 'เรียบร้อย'].includes(s)) return 'text-[#00A63E]';
    if (['accepted', 'pending'].includes(s)) return 'text-[#ff9f43]';
    if (['rejected', 'canceled', 'cancelled'].includes(s)) return 'text-[#ea5455]';
    if (['direct', 'created', 'sent'].includes(s)) return 'text-[#00cfe8]';
    if (s === 'viahospital') return 'text-[#7367f0]';
    return 'text-[#6e6b7b]';
  };

  return (
    <span className={cn("text-xs font-medium whitespace-nowrap", getColor())}>
      {getLabel()}
    </span>
  );
}

function EmptyState({ title, onClick }: { title: string, onClick?: () => void }) {
    return (
      <div 
          className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-300 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group" 
          onClick={onClick}
      >
          <div className="h-12 w-12 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#7367f0] group-hover:text-[#7367f0] transition-colors shadow-sm">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#7367f0]" />
          </div>
          <p className="text-sm font-medium text-gray-500 group-hover:text-[#7367f0]">เพิ่ม{title}</p>
      </div>
    )
}

// --- House Photo Uploader for Map Tab (matching mobile pattern) ---

function MapHousePhotoUploader() {
    const [photos, setPhotos] = useState<{ id: string; url: string; name: string; date: string }[]>([
        {
            id: 'default-1',
            url: 'https://images.unsplash.com/photo-1644130171866-8236ff6d821a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwaG91c2UlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzEyMDkzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            name: 'บ้านผู้ป่วย - ภาพด้านหน้า',
            date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
        }
    ]);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPhotos(prev => [...prev, {
                    id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                    url: ev.target?.result as string,
                    name: file.name,
                    date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
                }]);
            };
            reader.readAsDataURL(file);
        });
        e.target.value = '';
    };

    const removePhoto = (id: string) => {
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="bg-white rounded-xl border border-[#EBE9F1] overflow-hidden shadow-sm">
            {/* Photo Grid */}
            {photos.length > 0 ? (
                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                <div className="relative h-48 cursor-pointer" onClick={() => setPreviewPhoto(photo.url)}>
                                    <img
                                        src={photo.url}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                        alt={photo.name}
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                                            <ImageIcon size={20} className="text-[#7367f0]" />
                                        </div>
                                    </div>
                                </div>
                                {/* Info Bar */}
                                <div className="p-3 flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-[#5e5873] truncate">{photo.name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                            <Calendar size={10} /> {photo.date}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                                        className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add More Photo Tile */}
                        <div
                            className="h-48 border-2 border-dashed border-slate-300 hover:border-[#7367f0] rounded-xl flex flex-col items-center justify-center cursor-pointer group transition-all hover:bg-[#7367f0]/5"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2 group-hover:border-[#7367f0] transition-colors shadow-sm">
                                <Plus className="w-6 h-6 text-slate-400 group-hover:text-[#7367f0]" />
                            </div>
                            <p className="text-xs text-slate-400 group-hover:text-[#7367f0] font-medium">เพิ่มรูปภาพ</p>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="p-8 flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <ImageIcon size={28} className="text-slate-400" />
                    </div>
                    <h4 className="font-medium text-[#5e5873] mb-1">ยังไม่มีรูปบ้านผู้ป่วย</h4>
                    <p className="text-xs text-slate-400 mb-4">อัปโหลดรูปถ่ายบ้านผู้ป่วยเพื่อใช้ในการเยี่ยมบ้าน</p>
                </div>
            )}

            {/* Upload Button Bar */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleUpload}
                />
                
            </div>

            {/* Photo Preview Modal */}
            {previewPhoto && (
                <div className="fixed inset-0 z-[60000] bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewPhoto(null)}>
                    <div className="relative max-w-4xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setPreviewPhoto(null)}
                            className="absolute -top-3 -right-3 z-10 h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <img
                            src={previewPhoto}
                            className="w-full h-full object-contain rounded-xl"
                            alt="Preview"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Timeline Item Card (matching mobile TimelineItemCard with expandable secondary bookings) ---

function WebTimelineItemCard({ item, isOverdue, isCompleted }: { item: any; isOverdue: boolean; isCompleted: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const secondaryBookings = item.secondary_bookings || item.secondaryBookings || [];

    return (
        <div 
            onClick={() => { if (secondaryBookings.length > 0) setIsExpanded(!isExpanded); }}
            className={cn(
                "bg-white p-3 sm:p-4 rounded-xl border transition-all flex flex-col cursor-pointer",
                isOverdue ? "border-red-200 shadow-sm shadow-red-50" :
                "border-gray-200 shadow-sm hover:border-blue-200"
            )}
        >
            {/* Header: Age Badge + Status */}
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <span className={cn(
                    "text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md whitespace-nowrap",
                    isOverdue ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                )}>
                    {formatAgeDuration(item.age)}
                </span>
                {isCompleted ? (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md whitespace-nowrap">เสร็จสิ้น</span>
                ) : isOverdue ? (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md whitespace-nowrap">ล่าช้า</span>
                ) : (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md whitespace-nowrap">รอดำเนินการ</span>
                )}
            </div>

            {/* Title */}
            <h5 className={cn("font-bold text-sm leading-tight mb-2", isOverdue ? "text-red-700" : "text-[#5e5873]")}>
                {item.stage}
            </h5>

            {/* Estimated Date */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <span className="text-xs text-slate-600 truncate">
                    {(() => {
                        const d = item.estimatedDate || item.date || '-';
                        if (d === '-' || d === 'Completed' || d === 'Pending') return item.estimatedDate || '-';
                        if (d.includes('Auto-calc')) return d.replace('Auto-calc: ', '');
                        return d;
                    })()}
                </span>
            </div>

            {/* Show More Link */}
            {secondaryBookings.length > 0 && (
                <div 
                    className="flex items-center gap-1 cursor-pointer w-fit mt-2"
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                >
                    <span className="font-bold text-blue-600 hover:text-blue-700 transition-colors text-xs">
                        {isExpanded ? 'ซ่อนนัดหมาย' : `ดูนัดหมายเพิ่มเติม (${secondaryBookings.length})`}
                    </span>
                    <ChevronLeft 
                        size={12} 
                        className={cn("text-blue-600 transition-transform duration-200", isExpanded ? "-rotate-90" : "-rotate-180")} 
                    />
                </div>
            )}

            {/* Secondary Bookings (Expandable) */}
            {isExpanded && secondaryBookings.length > 0 && (
                <div className="flex flex-col gap-2 pl-2 sm:pl-3 ml-1 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {secondaryBookings.map((booking: any, idx: number) => {
                        const isAssessment = booking.title?.includes('ประเมิน') || booking.title?.includes('Assessment');
                        const Icon = isAssessment ? Stethoscope : Clock;
                        
                        return (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100 border-dashed">
                                <Icon size={12} className="text-slate-400 shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs text-slate-400 truncate">{booking.title || 'ติดตามอาการ (Follow-up)'}</span>
                                    <span className="text-xs text-slate-600 font-medium">{booking.date}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// --- Main Component ---

export function PatientDetailView({ patient, onBack, onNavigate, onAction, onAddMedicalRecord, onRequestFund }: PatientDetailProps) {
  const [activeFundCardIndex, setActiveFundCardIndex] = useState<number>(0);

  // Enrich patient data with mock details if missing
  const [formData, setFormData] = useState<PatientData>(() => ({
    ...patient,
    code: patient.code || (patient as any).hn || '-',
    hn: (patient as any).hn || patient.code || '-',
    cid: (patient as any).cid || "1-1099-12345-67-8",
    dob: patient.dob || "12 มกราคม 2560",
    age: (patient as any).age || "9 ปี 2 เดือน",
    gender: (patient as any).gender || "ชาย",
    bloodGroup: (patient as any).bloodGroup || "O",
    race: (patient as any).race || "ไทย",
    nationality: (patient as any).nationality || "ไทย",
    religion: (patient as any).religion || "พุทธ",
    maritalStatus: (patient as any).maritalStatus || "-",
    occupation: (patient as any).occupation || "นักเรียน",
    allergies: (patient as any).allergies || "ไม่มี",
    attendingPhysician: (patient as any).attendingPhysician || "นพ. สมชาย รักษาดี",
    address: patient.address || "123 หมู่ 4 ต.บ้านใหม่ อ.เมือง จ.เชียงใหม่ 50000",
    guardian: patient.guardian || "นางสมศรี ใจดี (มารดา)",
    rph: patient.rph || patient.responsibleHealthCenter || (patient as any).hospitalInfo?.responsibleRph || '-',
    rights: patient.rights || "บัตรทอง (UC)",
    rightsSecondary: (patient as any).rightsSecondary || "-",
    doctor: patient.doctor || "นพ. สมชาย รักษาดี",

    contact: (patient as any).contact || {
      phone: "081-234-5678",
      homePhone: "053-123-456",
      email: "-",
      address: "123 หมู่ 4 ต.บ้านใหม่ อ.เมือง จ.เชียงใหม่ 50000",
      name: "นางสมศรี ใจดี",
      relation: "มารดา",
      idCard: "1-1099-98765-43-2",
      dob: "15 มีนาคม 2530",
      age: "39 ปี",
      occupation: "แม่บ้าน",
      status: "ยังมีชีวิตอยู่",
    },

    hospitalInfo: (patient as any).hospitalInfo || {
      responsibleRph: "-",
      firstDate: "-",
    },
    
    treatmentPlan: patient.treatmentPlan || [
      { stage: "การปรึกษาเบื้องต้น", status: "completed", date: "10/01/2566" },
      { stage: "ผ่าตัดเย็บริมฝีปาก", status: "completed", date: "15/02/2566" },
      { stage: "ผ่าตัดเย็บเพดานปาก", status: "current", date: "รอประเมิน" },
      { stage: "ฝึกพูด", status: "upcoming" },
      { stage: "จัดฟัน", status: "upcoming" },
    ],
    
    treatmentHistory: patient.treatmentHistory || [
      { date: "15/02/2566", hospital: "โรงพยาบาลมหาราชนครเชียงใหม่", detail: "ผ่าตัดเย็บริมฝีปาก (Cheiloplasty)", doctor: "นพ. สมชาย รักษาดี", department: "ห้องผ่าตัด", treatment: "Cheiloplasty", diagnosis: "Cleft Lip" },
      { date: "10/01/2566", hospital: "รพ.สต. บ้านใหม่", detail: "ตรวจร่างกายเบื้องต้นและส่งต่อ", doctor: "พยาบาลวิชาชีพ ดวงใจ", department: "OPD", treatment: "Physical Exam", diagnosis: "N/A" },
    ],
    
    appointments: patient.appointments || [
      { id: "apt-1", datetime: "20/12/2566 09:00", date: "20/12/2566", time: "09:00 - 12:00", requestDate: "10/12/2566", detail: "ติดตามผลหลังผ่าตัด 6 เดือน", location: "โรงพยาบาลมหาราชนครเชียงใหม่", room: "ห้องตรวจ 4 ศัลยกรรม", doctor: "นพ. สมชาย รักษาดี", status: "นัดหมาย", type: "ติดตามผล", title: "ติดตามผลหลังผ่าตัด", note: "นัดตรวจติดตามแผลผ่าตัดเย็บริมฝีปากหลัง 6 เดือน ประเมินการสมานของแผลและความสมมาตรของริมฝีปาก", recorder: "สภัคศิริ สุวิวัฒนา" },
      { id: "apt-2", datetime: "15/03/2567 10:30", date: "15/03/2567", time: "10:30 - 12:00", requestDate: "01/03/2567", detail: "ประเมินการผ่าตัดเพดานปาก", location: "โรงพยาบาลมหาราชนครเชียงใหม่", room: "ห้องตรวจ 4 ศัลยกรรม", doctor: "นพ. สมชาย รักษาดี", status: "นัดหมาย", type: "ประเมินก่อนผ่าตัด", title: "ประเมินก่อนผ่าตัดเพดานปาก", note: "ประเมินความพร้อมก่อนทำการผ่าตัดเย็บเพดานปาก (Palatoplasty)", recorder: "สภัคศิริ สุวิวัฒนา" },
    ],
    
    referrals: patient.referrals || [
      { 
        id: "ref-1",
        treatment: "ผ่าตัดศัลยกรรมตกแต่ง", 
        date: "12/01/2566", 
        status: "Accepted", 
        destination: "โรงพยาบาลมหาราชนครเชียงใหม่",
        referralNo: "RF-66001",
        patientHn: patient.code,
        patientName: patient.name,
        sourceHospital: patient.hospital,
        reason: "ผู้ป่วยมีภาวะปากแหว่งเพดานโหว่ ต้องการการประเมินและวางแผนการผ่าตัดร่วมกับศัลยแพทย์ตกแต่งและกุมารแพทย์",
        diagnosis: "Cleft Lip and Palate",
        urgency: "Routine",
        doctor: "นพ. สมชาย รักษาดี",
        title: "ส่งตัวเพื่อผ่าตัดศัลยกรรมตกแต่ง",
        acceptedDate: "2566-01-20T09:00:00"
      }
    ],
    
    homeVisits: patient.homeVisits || [
      { id: "hv-1", date: "20/02/2566", detail: "เยี่ยมบ้านหลังผ่าตัด ดูแลแผล ประเมินสุขภาพทั่วไปของผู้ป่วย", status: "เรียบร้อย", visitType: "ฝากเยี่ยม", visitor: "พยาบาลวิชาชีพ ดวงใจ", result: "แผลแห้งดี ไม่มีหนอง มารดาดูแลได้ดี" }
    ],
    
    teleConsults: patient.teleConsults || [
      { id: "tc-1", title: "ปรึกษาติดตามอาการแผลผ่าตัด", detail: "ติดตามอาการแผลผ่าตัด", datetime: "25/02/2566 14:00", link: "https://meet.google.com/abc-defg-hij", type: "Direct", doctor: "นพ. สมชาย รักษาดี", status: "Completed", requestDate: "24/02/2566", consultResult: "ผู้ป่วยมีอาการดีขึ้นตามลำดับ แผลแห้งดี ไม่มีอาการบวมแดงหรือมีหนอง ผู้ปกครองสามารถดูแลทำความสะอาดแผลได้ถูกต้อง แนะนำให้สังเกตอาการต่อเนื่องและมาตามนัดครั้งถัดไป" }
    ],
    
    funds: patient.funds || [
      { id: "fund-1", name: "กองทุนเพื่อผู้ป่วยปากแหว่งเพดานโหว่", date: "01/02/2566", amount: 5000, status: "Approved", requester: "นางสมศรี ใจดี", description: "ค่าเดินทางและค่าอาหารสำหรับการผ่าตัด" }
    ]
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [showFundSystem, setShowFundSystem] = useState(false);
  const [showReferralSystem, setShowReferralSystem] = useState(false);
  const [showAppointmentSystem, setShowAppointmentSystem] = useState(false);
  const [showHomeVisitSystem, setShowHomeVisitSystem] = useState(false);
  const [showHomeVisitForm, setShowHomeVisitForm] = useState(false);
  const [showTeleConsultSystem, setShowTeleConsultSystem] = useState(false);
  const [showAddTreatmentPlan, setShowAddTreatmentPlan] = useState(false);
  const [showAddMedicalRecord, setShowAddMedicalRecord] = useState(false);
  const [showFundDisbursement, setShowFundDisbursement] = useState(false);
  const [showMutualFundHistory, setShowMutualFundHistory] = useState(false);
  const [showEditCarePathway, setShowEditCarePathway] = useState(false);
  const [patientStatus, setPatientStatus] = useState<string>(patient.patientStatusLabel || 'ปกติ');

  // Document States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [documents, setDocuments] = useState([
    { id: '1', name: 'X-Ray ใบหน้า (Pre-op)', category: 'X-Ray', date: '15 มิ.ย. 67', fileType: 'image', size: '2.4 MB', uploadedBy: 'พญ.สมหญิง รักษาดี' },
    { id: '2', name: 'X-Ray Cephalometric', category: 'X-Ray', date: '15 มิ.ย. 67', fileType: 'image', size: '3.1 MB', uploadedBy: 'พญ.สมหญิง รักษาดี' },
    { id: '3', name: 'ผลตรวจเลือด CBC', category: 'ผลตรวจ', date: '10 มิ.ย. 67', fileType: 'pdf', size: '540 KB', uploadedBy: 'นพ.สมชาย ใจดี' },
    { id: '4', name: 'ใบยินยอมผ่าตัด (Consent Form)', category: 'เอก���ารยินยอม', date: '20 มิ.ย. 67', fileType: 'pdf', size: '320 KB', uploadedBy: 'CM สมศรี' },
    { id: '5', name: 'รูปถ่ายก่อนผ่าตัด (Front view)', category: 'รูปถ่าย', date: '18 มิ.ย. 67', fileType: 'image', size: '1.8 MB', uploadedBy: 'CM สมศรี' },
    { id: '6', name: 'รูปถ่ายหลังผ่าตัด 3 เดือน', category: 'รูปถ่าย', date: '20 ก.ย. 67', fileType: 'image', size: '2.1 MB', uploadedBy: 'CM สมศรี' },
    { id: '7', name: 'ผลประเมินการพูด (Speech Assessment)', category: 'ผลประเมิน', date: '5 ต.ค. 67', fileType: 'pdf', size: '1.2 MB', uploadedBy: 'นักแก้ไขการพูด' },
    { id: '8', name: 'แบบประเมินพัฒนาการ DSPM', category: 'ผลประเมิน', date: '12 พ.ย. 67', fileType: 'pdf', size: '890 KB', uploadedBy: 'พยาบาล PCU' },
    { id: '9', name: 'บันทึกเยี่ยมบ้านครั้งที่ 1', category: 'เยี่ยมบ้าน', date: '15 มี.ค. 67', fileType: 'pdf', size: '1.5 MB', uploadedBy: 'ทีมเยี่ยมบ้าน รพ.สต.' },
    { id: '10', name: 'บันทึกเยี่ยมบ้านครั้งที่ 2', category: 'เยี่ยมบ้าน', date: '20 เม.ย. 67', fileType: 'pdf', size: '1.3 MB', uploadedBy: 'ทีมเยี่ยมบ้าน รพ.สต.' },
  ]);
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadDocCategory, setUploadDocCategory] = useState('');

  // Detail View States
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [selectedHomeVisit, setSelectedHomeVisit] = useState<any>(null);
  const [selectedTeleConsult, setSelectedTeleConsult] = useState<any>(null);
  const [selectedFund, setSelectedFund] = useState<any>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'treatment' | 'appointment' | 'referral' | 'homevisit' | 'tele'>('treatment');
  const [activeInfoTab, setActiveInfoTab] = useState<'personal' | 'diagnosis' | 'map' | 'fund' | 'documents'>('personal');

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = () => {
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    console.log("Saving data:", formData);
    setIsEditing(false);
    setShowSaveModal(false);
  };

  if (showFundSystem) {
    return <FundRequestPage 
      onBack={() => setShowFundSystem(false)} 
      onSubmit={(data) => { console.log(data); setShowFundSystem(false); }}
      patient={{ name: formData.name, hn: formData.code, age: "10" }} 
    />;
  }

  if (showReferralSystem) {
    return <ReferralAdd 
      onBack={() => setShowReferralSystem(false)}
      isEditMode={false}
      initialData={{
          patientName: formData.name,
          patientHn: formData.code
      }}
      onSubmit={(data) => {
          console.log("Submitted referral:", data);
          setShowReferralSystem(false);
      }}
    />;
  }

  if (showAppointmentSystem) {
    return <AppointmentSystem onNavigateToSystem={(sys: string) => console.log('Navigate to', sys)} />;
  }

  if (showHomeVisitSystem) {
    return <CreateHomeVisitPage 
      onBack={() => setShowHomeVisitSystem(false)} 
      onSubmit={(data) => { console.log(data); setShowHomeVisitSystem(false); }}
      initialData={{ patientId: formData.code }}
    />;
  }

  if (showHomeVisitForm) {
      return <HomeVisitForms onBack={() => setShowHomeVisitForm(false)} />;
  }

  if (showTeleConsultSystem) {
    return <AddAppointmentModal 
      onBack={() => setShowTeleConsultSystem(false)} 
      onConfirm={(data) => { console.log(data); setShowTeleConsultSystem(false); }}
      initialData={{ patientName: `${formData.name} (${formData.code})` }}
    />;
  }

  if (showAddTreatmentPlan) {
    return <ADDTreatmentPlanSystem patient={formData} onBack={() => setShowAddTreatmentPlan(false)} />;
  }

  if (showEditCarePathway) {
    const realPatientForEdit = getPatientByHn(formData.code || formData.hn || '') 
        || PATIENTS_DATA.find(p => p.id === String(formData.id) || p.name === formData.name);
    return <EditCarePathway 
      onBack={() => setShowEditCarePathway(false)} 
      onSave={() => setShowEditCarePathway(false)}
      patient={realPatientForEdit || formData}
    />;
  }

  if (showAddMedicalRecord) {
    return <AddMedicalRecordForm 
        onBack={() => setShowAddMedicalRecord(false)}
        patient={patient}
        onSave={(data) => {
            // Sync appointment status if a timeline appointment was selected
            const apptToSync = data?._selectedAppointment;
            if (apptToSync) {
                const targetDate = apptToSync.rawDate || apptToSync.date_time || apptToSync.date;
                // Update patient's appointmentHistory (mutate source for global sync)
                if ((patient as any).appointmentHistory) {
                    (patient as any).appointmentHistory = (patient as any).appointmentHistory.map((h: any) => {
                        if (h.rawDate === targetDate || h.rawDate === apptToSync.rawDate) {
                            return { ...h, status: 'completed' };
                        }
                        return h;
                    });
                }
                // Update formData appointments array for local UI
                if (formData.appointments) {
                    setFormData(prev => ({
                        ...prev,
                        appointments: prev.appointments?.map(a => {
                            if (a.datetime === targetDate || (a as any).date_time === targetDate) {
                                return { ...a, status: 'completed' };
                            }
                            return a;
                        })
                    }));
                }
            }
            setShowAddMedicalRecord(false);
        }}
    />;
  }

  if (showFundDisbursement) {
    return <FundDisbursementPage 
        onBack={() => setShowFundDisbursement(false)}
        onSubmit={(data) => {
            console.log("Submitted disbursement:", data);
            setShowFundDisbursement(false);
        }}
        patient={{ name: formData.name, hn: formData.code }}
    />;
  }

  if (showMutualFundHistory) {
    return <MutualFundHistory
      patient={{ name: formData.name, hn: formData.code, image: formData.image, funds: formData.funds }}
      onBack={() => setShowMutualFundHistory(false)}
    />;
  }

  // --- Edit Patient Section ---
  const mapPatientToFormData = (): PatientFormData => {
    const nameParts = (formData.name || "").split(" ");
    return {
      // Step 1
      idType: "idcard",
      idNumber: formData.cid || "",
      // Step 2
      firstNameTh: nameParts[0] || "",
      lastNameTh: nameParts.slice(1).join(" ") || "",
      dob: formData.dob || "",
      age: formData.age || "",
      patientStatus: formData.status === "Active" ? "normal" : formData.status === "เสียชีวิต" ? "deceased" : formData.status === "รักษาเสร็จสิ้น" ? "completed" : formData.status?.toLowerCase() || "",
      gender: formData.gender === "ชาย" ? "male" : formData.gender === "หญิง" ? "female" : "",
      phoneMobile: formData.contact?.phone || "",
      diagnosis: formData.diagnosis || "",
      attendingPhysician: formData.attendingPhysician || formData.doctor || "",
      // Step 3
      firstNameEn: formData.firstNameEn || "",
      lastNameEn: formData.lastNameEn || "",
      race: formData.race === "ไทย" ? "thai" : formData.race ? "other" : "",
      nationality: formData.nationality === "ไทย" ? "thai" : formData.nationality ? "other" : "",
      religion: formData.religion === "พุทธ" ? "buddhism" : formData.religion === "อิสลาม" ? "islam" : formData.religion === "คริสต์" ? "christianity" : formData.religion ? "other" : "",
      maritalStatus: formData.maritalStatus === "โสด" ? "single" : formData.maritalStatus === "สมรส" ? "married" : formData.maritalStatus === "หย่าร้าง" ? "divorced" : "",
      occupation: formData.occupation === "นักเรียน" ? "student" : formData.occupation === "ข้าราชการ" ? "government" : formData.occupation === "พนักงานบริษัท" ? "employee" : formData.occupation === "รับจ้างทั่���ไป" ? "freelance" : formData.occupation === "ว่างงาน" ? "unemployed" : "",
      phoneHome: formData.contact?.homePhone || "",
      email: formData.contact?.email || "",
      bloodGroup: formData.bloodGroup || "",
      foodAllergy: formData.allergies === "ไม่มี" ? "none" : formData.allergies === "อาหารทะเล" ? "seafood" : formData.allergies === "ถั่ว" ? "nuts" : formData.allergies === "นมวัว" ? "dairy" : "",
      // Step 4 - Address (from stored breakdown fields)
      addressNo: formData.addressNo || "",
      addressSoi: formData.addressSoi || "",
      addressRoad: formData.addressRoad || "",
      addressPostalCode: formData.addressPostalCode || "",
      addressProvince: formData.addressProvince || "",
      addressDistrict: formData.addressDistrict || "",
      addressSubDistrict: formData.addressSubDistrict || "",
      // Step 5
      mainRight: formData.rights?.includes("บัตรทอง") ? "gold" : formData.rights?.includes("ประกันสังคม") ? "social" : formData.rights?.includes("ข้าราชการ") ? "civil" : "",
      rightHospital: formData.hospital || "",
      subRight: "",
      // Step 6
      guardianFirstNameTh: formData.contact?.name?.split(" ")[0] || "",
      guardianLastNameTh: formData.contact?.name?.split(" ").slice(1).join(" ") || "",
      guardianIdCard: formData.contact?.idCard || "",
      guardianRelation: formData.contact?.relation === "มารดา" || formData.contact?.relation === "บิดา" ? "parent" : formData.contact?.relation ? "relative" : "",
      guardianDob: formData.contact?.dob || "",
      guardianAge: formData.contact?.age || "",
      guardianPhone: formData.contact?.phone || "",
      guardianOccupation: formData.contact?.occupation === "แม่บ้าน" || formData.contact?.occupation === "พนักงานบริษัท" ? "employee" : formData.contact?.occupation === "ธุรกิจส่วนตัว" ? "business" : "",
      guardianStatus: formData.contact?.status?.includes("มีชีวิต") ? "active" : formData.contact?.status?.includes("เสียชีวิต") ? "deceased" : "",
      // Step 7
      hospital: "",
      hn: formData.code || "",
      firstTreatmentDate: formData.hospitalInfo?.firstDate || "",
      travelDistance: formData.hospitalInfo?.distance || "",
      travelTime: formData.hospitalInfo?.travelTime || "",
    };
  };

  const handleEditSectionSave = (data: PatientFormData) => {
    // Map form data back to patient data based on which section was edited
    const updatedData: Partial<PatientData> = {};
    
    if (editingSection === 1) {
      updatedData.cid = data.idNumber;
    }
    if (editingSection === 2) {
      updatedData.name = `${data.firstNameTh || ""} ${data.lastNameTh || ""}`.trim();
      updatedData.dob = data.dob;
      updatedData.age = data.age;
      updatedData.gender = data.gender === "male" ? "ชาย" : data.gender === "female" ? "หญิง" : formData.gender;
      updatedData.patientStatusLabel = data.patientStatus === "normal" ? "ปกติ" : data.patientStatus === "deceased" ? "เสียชีวิต" : data.patientStatus === "completed" ? "รักษาเสร็จสิ้น" : formData.patientStatusLabel;
      updatedData.status = data.patientStatus === "normal" ? "Active" : data.patientStatus === "deceased" ? "เสียชีวิต" : data.patientStatus === "completed" ? "รักษาเสร็จสิ้น" : formData.status;
      updatedData.contact = { ...formData.contact, phone: data.phoneMobile };
      if (data.diagnosis) {
        updatedData.diagnosis = data.diagnosis;
      }
      if (data.attendingPhysician) {
        updatedData.attendingPhysician = data.attendingPhysician;
        updatedData.doctor = data.attendingPhysician;
      }
    }
    if (editingSection === 3) {
      updatedData.firstNameEn = data.firstNameEn;
      updatedData.lastNameEn = data.lastNameEn;
      updatedData.race = data.race === "thai" ? "ไทย" : data.race || formData.race;
      updatedData.nationality = data.nationality === "thai" ? "ไทย" : data.nationality || formData.nationality;
      updatedData.religion = data.religion === "buddhism" ? "พุทธ" : data.religion === "islam" ? "อิสลาม" : data.religion === "christianity" ? "คริสต์" : formData.religion;
      updatedData.maritalStatus = data.maritalStatus === "single" ? "โสด" : data.maritalStatus === "married" ? "สมรส" : data.maritalStatus === "divorced" ? "หย่าร้าง" : formData.maritalStatus;
      updatedData.occupation = data.occupation === "student" ? "นักเรียน" : data.occupation === "government" ? "ข้าราชการ" : data.occupation === "employee" ? "พนักงานบริษัท" : data.occupation === "freelance" ? "รับจ้างทั่วไป" : data.occupation === "unemployed" ? "ว่างงาน" : formData.occupation;
      updatedData.bloodGroup = data.bloodGroup || formData.bloodGroup;
      updatedData.allergies = data.foodAllergy === "none" ? "ไม่มี" : data.foodAllergy === "seafood" ? "อาหารทะเล" : data.foodAllergy === "nuts" ? "ถั่ว" : data.foodAllergy === "dairy" ? "นมวัว" : formData.allergies;
      updatedData.contact = { ...formData.contact, homePhone: data.phoneHome, email: data.email };
    }
    if (editingSection === 4) {
      // Address - store individual breakdown fields
      updatedData.addressNo = data.addressNo;
      updatedData.addressSoi = data.addressSoi;
      updatedData.addressRoad = data.addressRoad;
      updatedData.addressPostalCode = data.addressPostalCode;
      updatedData.addressProvince = data.addressProvince;
      updatedData.addressDistrict = data.addressDistrict;
      updatedData.addressSubDistrict = data.addressSubDistrict;
      // Also construct combined address string for display
      const parts = [
        data.addressNo,
        data.addressSoi ? `ซ.${data.addressSoi}` : "",
        data.addressRoad ? `ถ.${data.addressRoad}` : "",
        data.addressSubDistrict ? `ต.${data.addressSubDistrict}` : "",
        data.addressDistrict ? `อ.${data.addressDistrict}` : "",
        data.addressProvince ? `จ.${data.addressProvince}` : "",
        data.addressPostalCode
      ].filter(Boolean);
      if (parts.length > 0) {
        updatedData.address = parts.join(" ");
        updatedData.contact = { ...formData.contact, address: parts.join(" ") };
      }
    }
    if (editingSection === 5) {
      updatedData.rights = data.mainRight === "gold" ? "บัตรทอง (UC)" : data.mainRight === "social" ? "ประกันสังคม" : data.mainRight === "civil" ? "ข้าราชการ" : formData.rights;
      updatedData.rightsSecondary = data.subRight || formData.rightsSecondary;
      if (data.rightHospital) {
        updatedData.hospital = data.rightHospital;
      }
    }
    if (editingSection === 6) {
      const guardianName = `${data.guardianFirstNameTh || ""} ${data.guardianLastNameTh || ""}`.trim();
      const relation = data.guardianRelation === "parent" ? "บิดา/มารดา" : "ญาติ";
      updatedData.guardian = `${guardianName} (${relation})`;
      updatedData.contact = {
        ...formData.contact,
        name: guardianName,
        relation: relation,
        idCard: data.guardianIdCard,
        dob: data.guardianDob,
        age: data.guardianAge,
        occupation: data.guardianOccupation === "employee" ? "พนักงานบริษัท" : data.guardianOccupation === "business" ? "ธุรกิจส่วนตัว" : formData.contact?.occupation,
        status: data.guardianStatus === "active" ? "ยังมีชีวิตอยู่" : data.guardianStatus === "deceased" ? "เสียชีวิต" : formData.contact?.status,
        phone: data.guardianPhone || formData.contact?.phone,
      };
    }
    if (editingSection === 7) {
      updatedData.code = data.hn || formData.code;
      updatedData.hn = data.hn || formData.hn;
      updatedData.hospitalInfo = {
        ...formData.hospitalInfo,
        firstDate: data.firstTreatmentDate || formData.hospitalInfo?.firstDate,
        distance: data.travelDistance,
        travelTime: data.travelTime,
      };
    }

    setFormData(prev => ({ ...prev, ...updatedData }));
    setEditingSection(null);
  };

  if (editingSection !== null) {
    return (
      <NewPatient
        editMode={true}
        initialStep={editingSection}
        initialData={mapPatientToFormData()}
        onBack={() => setEditingSection(null)}
        onFinish={() => setEditingSection(null)}
        onSave={handleEditSectionSave}
      />
    );
  }

  // --- Detail Views ---

  if (selectedTreatment) {
    return <MedicalRecordDetail 
        onBack={() => setSelectedTreatment(null)}
        patient={{ name: formData.name, hn: formData.code, image: formData.image }}
        data={{
            date: selectedTreatment.date, 
            hospital: selectedTreatment.hospital,
            department: selectedTreatment.department,
            treatment: selectedTreatment.treatment || selectedTreatment.detail,
            doctor: selectedTreatment.doctor,
            diagnosis: selectedTreatment.diagnosis,
            title: selectedTreatment.title,
            status: selectedTreatment.status,
            chiefComplaint: selectedTreatment.chiefComplaint || "มีอาการปวดบริเวณแผลผ่าตัด",
            presentIllness: selectedTreatment.presentIllness || "ผู้ป่วยมีอาการปวดบวมแดงบริเวณแผลผ่าตัด 2 วันก่อนมาโรงพยาบาล",
            pastHistory: selectedTreatment.pastHistory || "ไม่มีโรคประจำตัว ปฏิเสธการแพ้ยา",
            treatmentResult: selectedTreatment.treatmentResult || "แผลแห้งดี ไม่มีหนอง",
            treatmentPlan: selectedTreatment.treatmentPlan || "ทานยาแก้ปวด และยาปฏิชีวนะตามแพทย์สั่ง"
        }}
    />;
  }

  if (selectedAppointment) {
    return <AppointmentDetailPage 
        data={{
            id: selectedAppointment.id || "1",
            patientName: formData.name,
            patientId: formData.code,
            datetime: selectedAppointment.datetime,
            date: selectedAppointment.date,
            time: selectedAppointment.time,
            requestDate: selectedAppointment.requestDate,
            hospital: selectedAppointment.location || formData.hospital,
            location: selectedAppointment.location,
            room: selectedAppointment.room || selectedAppointment.roomName,
            doctor: selectedAppointment.doctor || formData.doctor,
            detail: selectedAppointment.detail,
            title: selectedAppointment.title,
            treatment: selectedAppointment.treatment,
            note: selectedAppointment.note,
            reason: selectedAppointment.reason,
            recorder: selectedAppointment.recorder,
            status: selectedAppointment.status || "upcoming"
        }}
        patient={{ name: formData.name, hn: formData.code, image: formData.image }}
        onBack={() => setSelectedAppointment(null)}
    />;
  }

  if (selectedReferral) {
     return <ReferralSystemDetail 
        data={{
            id: selectedReferral.id || "ref-1",
            referralNo: selectedReferral.referralNo || "RF-XXXX",
            patientHn: selectedReferral.patientHn || formData.code,
            patientName: selectedReferral.patientName || formData.name,
            date: selectedReferral.date,
            sourceHospital: selectedReferral.sourceHospital || formData.hospital,
            from: selectedReferral.sourceHospital || formData.hospital,
            destination: selectedReferral.destination,
            to: selectedReferral.destination,
            treatment: selectedReferral.treatment,
            title: selectedReferral.title || selectedReferral.treatment,
            reason: selectedReferral.reason || selectedReferral.diagnosis,
            doctor: selectedReferral.doctor || formData.doctor,
            acceptedDate: selectedReferral.acceptedDate,
            status: selectedReferral.status,
            urgency: selectedReferral.urgency || 'Routine'
        }}
        patient={{ name: formData.name, hn: formData.code, image: formData.image }}
        onBack={() => setSelectedReferral(null)} 
     />;
  }

  if (selectedHomeVisit) {
      return <HomeVisitRequestDetail 
        data={{
            id: selectedHomeVisit.id || "hv-1",
            date: selectedHomeVisit.date,
            detail: selectedHomeVisit.detail,
            status: selectedHomeVisit.status,
            visitType: selectedHomeVisit.visitType,
            type: selectedHomeVisit.visitType,
            visitor: selectedHomeVisit.visitor,
            result: selectedHomeVisit.result,
            requestDate: selectedHomeVisit.requestDate,
            note: selectedHomeVisit.note,
            time: selectedHomeVisit.time
        }}
        patient={{ name: formData.name, hn: formData.code, image: formData.image }}
        onBack={() => setSelectedHomeVisit(null)}
      />;
  }

  if (selectedTeleConsult) {
      return <TeleConsultationSystemDetail 
        data={{
            id: selectedTeleConsult.id || "tc-1",
            datetime: selectedTeleConsult.datetime,
            date: selectedTeleConsult.date,
            detail: selectedTeleConsult.detail,
            title: selectedTeleConsult.title,
            link: selectedTeleConsult.link || selectedTeleConsult.meetingLink,
            type: selectedTeleConsult.type,
            channel: selectedTeleConsult.channel,
            agency_name: selectedTeleConsult.agency_name,
            doctor: selectedTeleConsult.doctor,
            status: selectedTeleConsult.status,
            requestDate: selectedTeleConsult.requestDate,
            consultResult: selectedTeleConsult.consultResult,
            meetingLink: selectedTeleConsult.meetingLink
        }}
        patient={{ name: formData.name, hn: formData.code, image: formData.image }}
        onBack={() => setSelectedTeleConsult(null)}
      />;
  }

  if (selectedFund) {
      return <FundRequestDetailPage 
        data={{
            id: selectedFund.id || "fund-1",
            name: selectedFund.name,
            amount: selectedFund.amount,
            date: selectedFund.date,
            status: selectedFund.status,
            requester: selectedFund.requester,
            description: selectedFund.description
        }}
        patient={{ name: formData.name, hn: formData.code, image: formData.image }}
        onBack={() => setSelectedFund(null)}
      />;
  }

  return (
    <div className="contents">
      <SaveConfirmationModal 
        isOpen={showSaveModal}
        onConfirm={handleConfirmSave}
        onCancel={() => setShowSaveModal(false)}
      />
      
      {/* Tabs placed outside/above the main card */}
      <div className="flex px-6 gap-2 mb-[-1px] relative z-20">
          <button 
              onClick={() => setActiveTab('info')}
              className={cn(
                  "px-8 py-3 rounded-t-xl font-bold transition-all text-base shadow-[0_-2px_6px_rgba(0,0,0,0.02)] border-t border-x border-transparent",
                  activeTab === 'info' 
                    ? "bg-white text-[#7367f0] border-gray-100" 
                    : "bg-gray-100/80 text-gray-500 hover:bg-white/50"
              )}
          >
              ข้อมูลส่วนตัว
          </button>
          <button 
              onClick={() => setActiveTab('history')}
              className={cn(
                  "px-8 py-3 rounded-t-xl font-bold transition-all text-base shadow-[0_-2px_6px_rgba(0,0,0,0.02)] border-t border-x border-transparent",
                  activeTab === 'history' 
                    ? "bg-white text-[#7367f0] border-gray-100" 
                    : "bg-gray-100/80 text-gray-500 hover:bg-white/50"
              )}
          >
              ประวัติผู้ป่วย
          </button>
      </div>

      <div className="bg-white rounded-xl rounded-tl-none shadow-sm min-h-[800px] flex flex-col relative z-10 border border-gray-100">
        {/* Header - extracted to PatientDetailHeader component */}
        <PatientDetailHeader
          formData={formData}
          patientStatus={patientStatus}
          isEditing={isEditing}
          onBack={onBack}
          onToggleEdit={() => setIsEditing(!isEditing)}
          onEditSection={(step) => setEditingSection(step)}
          onShowTeleConsult={() => setShowTeleConsultSystem(true)}
          onShowReferral={() => setShowReferralSystem(true)}
          onShowFund={() => setShowFundSystem(true)}
          onShowHomeVisit={() => setShowHomeVisitSystem(true)}
          onShowAddMedicalRecord={() => setShowAddMedicalRecord(true)}
        />

        {/* Scrollable Content */}
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
          
          {/* INFO TAB CONTENT */}
          {activeTab === 'info' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                {/* Info Sub-tabs */}
                <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100/50 rounded-lg w-fit">
                    {[
                        { id: 'personal', label: 'ข้อมูลส่วนตัว', icon: <User size={14} /> },
                        { id: 'diagnosis', label: 'การวินิจฉัยและแผนการรักษา', icon: <Stethoscope size={14} /> },
                        { id: 'map', label: 'แผนที่', icon: <MapPin size={14} /> },
                        { id: 'fund', label: 'ทุนสงเคราะห์', icon: <Wallet size={14} /> },
                        { id: 'documents', label: 'เอกสาร', icon: <FileText size={14} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveInfoTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeInfoTab === tab.id 
                                    ? "bg-white text-[#7367f0] shadow-sm" 
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Info Sub-tab Content */}
                <div className="bg-white rounded-lg space-y-8">

                {/* === ข้อมูลส่วนตัว Sub-tab === */}
                {activeInfoTab === 'personal' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Patient Image */}
                        <div className="w-[300px] h-[350px] mx-auto rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-6">
                            <div className="flex flex-col items-center text-gray-500">
                                <Upload className="h-8 w-8 mb-2" />
                                <span className="text-sm font-medium">Click to upload cover image</span>
                                <span className="text-xs text-gray-400">JPG, PNG up to 5MB</span>
                            </div>
                        </div>

                        {/* สถานะผู้ป่วย — horizontal radio chips */}
                        <section>
                            <SectionHeader title="สถานะผู้ป่วย" icon={<Activity size={20} />} />
                            <div className="flex flex-wrap gap-3">
                                {['ปกติ', 'Loss follow up', 'รักษาเสร็จสิ้น', 'เสียชีวิต', 'มารดา'].map((value) => {
                                    const isSelected = patientStatus === value;
                                    return (
                                        <button
                                            key={value}
                                            onClick={() => setPatientStatus(value)}
                                            className={cn(
                                                "flex items-center gap-2.5 px-5 py-2.5 rounded-lg border transition-all cursor-pointer text-[15px]",
                                                isSelected
                                                    ? "border-[#7367f0] bg-[#7367f0]/10 text-[#7367f0]"
                                                    : "border-[#d8d6de] bg-white text-[#6e6b7b] hover:border-[#7367f0]/40"
                                            )}
                                        >
                                            <span className={cn(
                                                "w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all",
                                                isSelected ? "border-[#7367f0] bg-[#7367f0]" : "border-[#d8d6de] bg-white"
                                            )}>
                                                {isSelected && (
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                )}
                                            </span>
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ข้อมูลส่วนตัว */}
                        <section>
                            <SectionHeader title="ข้อมูลส่วนตัว" icon={<User size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailRow label="ชื่อ - นามสกุล" value={formData.name} isReadOnly={!isEditing} onChange={(v) => handleInputChange("name", v)} icon={<User size={14}/>} />
                                <DetailRow label="เลขประจำตัวประชาชน" value={formData.cid || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("cid" as any, v)} />
                                <DetailRow label="สถานะของผู้ป่วย" value={patientStatus} />
                                <DetailRow label="วัน/เดือน/ปีเกิด" value={formatThaiDateFull(formData.dob)} isReadOnly={!isEditing} onChange={(v) => handleInputChange("dob", v)} icon={<Calendar size={14}/>} />
                                <DetailRow label="อายุ" value={formData.age || '-'} />
                                <DetailRow label="เพศ" value={formData.gender || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("gender" as any, v)} />
                                <DetailRow label="หมู่เลือด" value={formData.bloodGroup || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("bloodGroup" as any, v)} />
                                <DetailRow label="เชื้อชาติ" value={formData.race || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("race" as any, v)} />
                                <DetailRow label="สัญชาติ" value={formData.nationality || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("nationality" as any, v)} />
                                <DetailRow label="ศาสนา" value={formData.religion || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("religion" as any, v)} />
                                <DetailRow label="สถานภาพ" value={formData.maritalStatus || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("maritalStatus" as any, v)} />
                                <DetailRow label="อาชีพ" value={formData.occupation || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("occupation" as any, v)} />
                                {(formData.firstNameEn || formData.lastNameEn) && (
                                    <DetailRow label="ชื่อ-นามสกุล (EN)" value={`${formData.firstNameEn || ''} ${formData.lastNameEn || ''}`.trim() || '-'} />
                                )}
                            </div>
                        </section>

                        {/* ข้อมูลการติดต่อ */}
                        <section>
                            <SectionHeader title="ข้อมูลการติดต่อ" icon={<MessageCircle size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailRow label="เบอร์โทรศัพท์มือถือ" value={formData.contact?.phone || formData.phone || '-'} isReadOnly={!isEditing} icon={<Phone size={14}/>} />
                                <DetailRow label="เบอร์โทรศัพท์บ้าน" value={formData.contact?.homePhone || '-'} />
                                <DetailRow label="อีเมล" value={formData.contact?.email || '-'} />
                            </div>
                        </section>

                        {/* ที่อยู่ปัจจุบัน */}
                        <section>
                            <SectionHeader title="ที่อยู่ปัจจุบัน" icon={<MapPin size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailRow label="บ้านเลขที่" value={formData.addressNo || '-'} icon={<MapPin size={14}/>} />
                                <DetailRow label="หมู่ที่" value={formData.addressMoo && formData.addressMoo !== '-' ? formData.addressMoo : '-'} />
                                <DetailRow label="ซอย" value={formData.addressSoi && formData.addressSoi !== '-' ? formData.addressSoi : '-'} />
                                <DetailRow label="ถนน" value={formData.addressRoad && formData.addressRoad !== '-' ? formData.addressRoad : '-'} />
                                <DetailRow label="ตำบล" value={formData.addressSubDistrict || '-'} />
                                <DetailRow label="อำเภอ" value={formData.addressDistrict || '-'} />
                                <DetailRow label="จังหวัด" value={formData.addressProvince || '-'} />
                                <DetailRow label="รหัสไปรษณีย์" value={formData.addressPostalCode || '-'} />
                            </div>
                        </section>

                        {/* ข้อมูลสุขภาพ */}
                        <section>
                            <SectionHeader title="ข้อมูลสุขภาพ" icon={<Activity size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailRow label="ประวัติการแพ้อาหาร" value={formData.allergies || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("allergies" as any, v)} />
                            </div>
                        </section>

                        {/* สิทธิการรักษาและข้อมูลโรงพยาบาล */}
                        <section>
                            <SectionHeader title="สิทธิการรักษาและข้อมูลโรงพยาบาล" icon={<ShieldCheck size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailRow label="สิทธิการรักษาหลัก" value={formData.rights || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("rights", v)} icon={<FileText size={14}/>} />
                                <DetailRow label="สิทธิการรักษาย่อย" value={formData.rightsSecondary || '-'} />
                                <DetailRow label="หน่วยงานที่รับผิดชอบ" value={formData.hospitalInfo?.responsibleRph || formData.rph || '-'} isReadOnly={!isEditing} icon={<MapPin size={14}/>} />
                                <DetailRow label="โรงพยาบาลที่รักษา" value={formData.hospital} isReadOnly={!isEditing} onChange={(v) => handleInputChange("hospital", v)} icon={<Home size={14}/>} />
                                <DetailRow label="HN" value={formData.hn || formData.code || '-'} />
                                <DetailRow label="วันที่เข้ารับการรักษาครั้งแรก" value={formatThaiDateFull(formData.hospitalInfo?.firstDate)} icon={<Calendar size={14}/>} />
                            </div>
                        </section>

                        {/* ข้อมูลผู้ปกครอง */}
                        <section>
                            <SectionHeader title="ข้อมูลผู้ปกครอง" icon={<Users size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailRow label="ชื่อ-นามสกุล" value={formData.contact?.name || formData.guardian || '-'} isReadOnly={!isEditing} icon={<User size={14}/>} />
                                <DetailRow label="ความสัมพันธ์" value={formData.contact?.relation || '-'} isReadOnly={!isEditing} />
                                <DetailRow label="เลขประจำตัวประชาชน" value={formData.contact?.idCard || '-'} />
                                <DetailRow label="วันเกิด" value={formatThaiDateFull(formData.contact?.dob)} icon={<Calendar size={14}/>} />
                                <DetailRow label="อายุ" value={formData.contact?.age || '-'} />
                                <DetailRow label="อาชีพ" value={formData.contact?.occupation || '-'} />
                                <DetailRow label="เบอร์โทรศัพท์" value={formData.contact?.phone || '-'} isReadOnly={!isEditing} icon={<Phone size={14}/>} />
                                <DetailRow label="สถานะ" value={formData.contact?.status || '-'} />
                            </div>
                        </section>
                    </div>
                )}

                {/* === การวินิจฉัย Sub-tab === */}
                {activeInfoTab === 'diagnosis' && (() => {
                    // Lookup real patient timeline from PATIENTS_DATA
                    const realPatient = getPatientByHn(formData.code || formData.hn || '') 
                        || PATIENTS_DATA.find(p => p.id === String(formData.id) || p.name === formData.name);
                    const timelineData = (realPatient as any)?.timeline || (patient as any)?.timeline || [];

                    return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <section>
                            <SectionHeader title="ข้อมูลการวินิจฉัย" icon={<Stethoscope size={20} />} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <DetailRow label="การวินิจฉัยโรค" value={formData.diagnosis} isReadOnly={!isEditing} onChange={(v) => handleInputChange("diagnosis", v)} icon={<Stethoscope size={14}/>} />
                                <DetailRow label="แพทย์เจ้าของไข้" value={formData.attendingPhysician || formData.doctor || '-'} isReadOnly={!isEditing} onChange={(v) => handleInputChange("doctor", v)} icon={<User size={14}/>} />
                            </div>
                            
                            {/* แผนการรักษา (Timeline) - Vertical layout matching mobile */}
                            <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#EBE9F1]">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <h4 className="font-semibold text-[#5e5873] flex items-center gap-2">
                                        <Clock size={16} className="text-[#7367f0]" /> แผนการรักษา (Timeline)
                                    </h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/10 flex items-center gap-1.5"
                                        onClick={() => setShowEditCarePathway(true)}
                                    >
                                        <Pencil size={12} />
                                        แก้ไขแผนการรักษา
                                    </Button>
                                </div>
                                {timelineData.length === 0 ? (
                                    <EmptyState title="แผนการรักษา" onClick={() => setShowAddTreatmentPlan(true)} />
                                ) : (
                                    <div className="relative pl-2 sm:pl-4 space-y-4 sm:space-y-6">
                                        {/* Vertical Line */}
                                        <div className="absolute left-[15px] sm:left-[23px] top-4 bottom-8 w-[2px] bg-gray-200 z-0"></div>

                                        {[...timelineData]
                                            .sort((a: any, b: any) => parseAgeToMonths(b.age) - parseAgeToMonths(a.age))
                                            .map((item: any, index: number) => {
                                                const isOverdue = item.status === 'overdue' || (item.status === 'pending' && item.stage.includes('ฝึกพูด'));
                                                const isCompleted = item.status === 'completed';

                                                return (
                                                    <div key={index} className="relative pl-9 sm:pl-12 z-10">
                                                        {/* Timeline Dot */}
                                                        <div className={cn(
                                                            "absolute left-1 sm:left-3 top-4 sm:top-5 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-[3px] sm:border-4 border-white shadow-sm z-20 flex items-center justify-center",
                                                            isOverdue ? "bg-red-500 ring-2 ring-red-100" :
                                                            isCompleted ? "bg-green-500 ring-2 ring-green-100" :
                                                            "bg-blue-500 ring-2 ring-blue-100"
                                                        )}>
                                                            {isCompleted && <CheckCircle2 size={10} className="text-white sm:[&]:w-3 sm:[&]:h-3" />}
                                                            {isOverdue && <AlertTriangle size={10} className="text-white sm:[&]:w-3 sm:[&]:h-3" />}
                                                        </div>
                                                        
                                                        {/* Card with expandable bookings */}
                                                        <WebTimelineItemCard item={item} isOverdue={isOverdue} isCompleted={isCompleted} />
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                    );
                })()}

                {/* === แผนที่ Sub-tab === */}
                {activeInfoTab === 'map' && (() => {
                    return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <section>
                            <SectionHeader title="ข้อมูลพิกัดบนแผนที่" icon={<MapPin size={20} />} />
                            
                            {/* Map Card */}
                            <div className="bg-white rounded-xl border border-[#EBE9F1] overflow-hidden shadow-sm">
                                {/* Map Image Area */}
                                <div className="relative h-[240px] sm:h-[300px] bg-gray-100 group">
                                    <img
                                        src="https://images.unsplash.com/photo-1551729513-02ac4976572c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBtYXAlMjBzdHJlZXQlMjB2aWV3JTIwbG9jYXRpb258ZW58MXx8fHwxNzY1Mzc3Mzg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                                        alt="Map Location"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="relative">
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 blur-sm rounded-full"></div>
                                            <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg -mt-4 animate-bounce" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>

                                {/* Address Info */}
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-[#5e5873] flex items-center gap-2">
                                                <Home size={16} className="text-[#7367f0]" /> บ้านพักผู้ป่วย
                                            </h4>
                                            <p className="text-sm text-slate-500 max-w-md">
                                                {formData.contact?.address || formData.address || '123 หมู่ 4 ต.บ้านใหม่ อ.เมือง จ.เชียงใหม่ 50000'}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="text-xs text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400 flex items-center gap-2 shrink-0"
                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.contact?.address || formData.address || '')}`, '_blank')}
                                        >
                                            <MapPin size={14} />
                                            ดูบน Google Maps
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* รูปบ้านผู้ป่วย Section */}
                        <section>
                            <SectionHeader title="รูปบ้านผู้ป่วย" icon={<ImageIcon size={20} />} />
                            <MapHousePhotoUploader />
                        </section>
                    </div>
                    );
                })()}

                {/* === ทุนสงเคราะห์ Sub-tab === */}
                {activeInfoTab === 'fund' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                <section>
                    <SectionHeader title="ทุนสงเคราะห์" icon={<Wallet size={20} />} action={
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/10"
                            onClick={() => setShowMutualFundHistory(true)}
                        >
                            <FileText size={14} className="mr-1" />
                            ประวัติทุน
                        </Button>
                    } />

                    {/* Fund Cards - Only Approved Funds */}
                    {(() => {
                        const approvedFunds = (formData.funds || []).filter((f: any) => {
                            const s = (f.status || '').toLowerCase();
                            return s === 'approved' || s === 'อนุมัติ';
                        });
                        // Total slides = approved funds + 1 (add card)
                        const totalSlides = approvedFunds.length + 1;
                        const isAddCard = activeFundCardIndex >= approvedFunds.length;
                        const currentFund = !isAddCard ? approvedFunds[activeFundCardIndex] : null;

                        return (
                            <div className="contents">
                                <div className="w-full max-w-lg mx-auto mb-10 mt-4 relative min-h-[160px] flex items-center justify-center">
                                    {/* Left Arrow */}
                                    <button 
                                        onClick={() => setActiveFundCardIndex(Math.max(0, activeFundCardIndex - 1))}
                                        disabled={activeFundCardIndex === 0}
                                        className={`absolute -left-4 md:-left-12 h-10 w-10 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center transition-all z-10 ${activeFundCardIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer hover:bg-gray-50 hover:text-[#7367f0] hover:border-[#7367f0]/30 hover:scale-105'}`}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    {/* Approved Fund Card */}
                                    {currentFund && (
                                        <div className="relative bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full animate-in fade-in duration-300">
                                            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">อนุมัติ</span>
                                            <h3 className="text-[#6e6b7b] font-medium text-xl mb-3">{currentFund.name}</h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-bold text-[#7367f0]">
                                                    {typeof currentFund.amount === 'number' ? currentFund.amount.toLocaleString() : currentFund.amount}
                                                </span>
                                                <span className="text-[#b9b9c3] text-xl">บาท</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Add Fund Card */}
                                    {isAddCard && (
                                        <div 
                                            className="bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[#7367f0] hover:bg-[#7367f0]/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full min-h-[160px] cursor-pointer group transition-all animate-in fade-in duration-300"
                                            onClick={() => setShowFundSystem(true)}
                                        >
                                            <div className="h-14 w-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#7367f0] group-hover:text-[#7367f0] transition-colors shadow-sm">
                                                <Plus size={32} className="text-gray-400 group-hover:text-[#7367f0]" />
                                            </div>
                                            <h3 className="text-gray-500 font-medium text-lg group-hover:text-[#7367f0]">เพิ่มทุนสงเคราะห์</h3>
                                        </div>
                                    )}

                                    {/* Right Arrow */}
                                    <button 
                                        onClick={() => setActiveFundCardIndex(Math.min(totalSlides - 1, activeFundCardIndex + 1))}
                                        disabled={activeFundCardIndex >= totalSlides - 1}
                                        className={`absolute -right-4 md:-right-12 h-10 w-10 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center transition-all z-10 ${activeFundCardIndex >= totalSlides - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 cursor-pointer hover:bg-gray-50 hover:text-[#7367f0] hover:border-[#7367f0]/30 hover:scale-105'}`}
                                    >
                                        <ChevronRight size={20} />
                                    </button>

                                    {/* Dots Indicators */}
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                        {Array.from({ length: totalSlides }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveFundCardIndex(i)}
                                                className={`w-2 h-2 rounded-full transition-colors ${activeFundCardIndex === i ? 'bg-[#7367f0]' : 'bg-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Fund History Table */}
                                <div id="fund-history-section" className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-[#5e5873]">
                                        {isAddCard ? 'ข้อมูลทุน' : `ประวัติทุนสงเคราะห์`}
                                    </h3>
                                    <Button variant="outline" size="sm" onClick={() => setShowFundDisbursement(true)} className="text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/5">
                                        ขอเบิกจ่ายทุน
                                    </Button>
                                </div>
                                
                                <div className="border rounded-lg overflow-hidden bg-white">
                                    {isAddCard ? (
                                        <EmptyState title="ข้อมูลทุน" onClick={() => setShowFundSystem(true)} />
                                    ) : (
                                        <Table>
                                            <TableHeader className="bg-[#f3f2f7]">
                                                <TableRow>
                                                    <TableHead className="text-xs">รายการ</TableHead>
                                                    <TableHead className="text-xs">วันที่</TableHead>
                                                    <TableHead className="text-xs">จำนวนเงิน (บาท)</TableHead>
                                                    <TableHead className="text-xs">สถานะ</TableHead>
                                                    <TableHead className="text-xs text-right w-[100px]">จัดการ</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(currentFund?.history && currentFund.history.length > 0) ? (
                                                    currentFund.history.map((item: any, idx: number) => (
                                                        <TableRow key={idx} className="cursor-pointer hover:bg-gray-50">
                                                            <TableCell className="text-xs">{item.type || '-'}</TableCell>
                                                            <TableCell className="text-xs">{formatThaiDate(item.date)}</TableCell>
                                                            <TableCell className="text-xs text-[#7367f0]">
                                                                {typeof item.amount === 'number' ? item.amount.toLocaleString() : item.amount}
                                                            </TableCell>
                                                            <TableCell><StatusBadge status={item.status} system="fund" /></TableCell>
                                                            <TableCell className="text-xs text-right">
                                                                <div className="flex justify-end gap-1">
                                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]"><Pencil size={14}/></Button>
                                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" title="ลบ"><Trash2 size={14}/></Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center text-sm text-gray-400 py-8">
                                                            ยังไม่มีประวัติการเบิกจ่าย
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </section>
                    </div>
                )}

                {/* === เอกสาร Sub-tab === */}
                {activeInfoTab === 'documents' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                <section>
                    <SectionHeader title="เอกสารผู้ป่วย" icon={<FileText size={20} />} action={
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/10"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <Upload size={14} className="mr-1" />
                            อัปโหลดเอกสาร
                        </Button>
                    } />

                    {/* Upload Drop Zone */}
                    

                    {/* Document Grid */}
                    {(() => {
                        const targetDocs = documents.filter(d => d.category === 'เอกสารยินยอม' || d.category === 'X-Ray');
                        
                        if (targetDocs.length === 0) {
                            return (
                                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                                    <FileText className="w-10 h-10 mb-2 text-gray-300" />
                                    <p className="text-sm text-gray-400">ยังไม่มีเอกสาร</p>
                                </div>
                            );
                        }

                        return (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {targetDocs.map((doc) => (
                                    <div
                                        key={doc.id}
                                        onClick={() => setPreviewDoc(doc)}
                                        className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-[#7367f0]/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn(
                                                "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                                                doc.fileType === 'image' ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500"
                                            )}>
                                                {doc.fileType === 'image' ? <ImageIcon size={22} /> : <FileText size={22} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-medium text-[#5e5873] text-sm truncate group-hover:text-[#7367f0] transition-colors">{doc.name}</h5>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Calendar size={11} /> {doc.date}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{doc.size}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </section>
                    </div>
                )}

                </div>
            </div>
          )}

          {/* HISTORY TAB CONTENT */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 min-h-[500px]">
                
                {/* Sub-tabs */}
                <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100/50 rounded-lg w-fit">
                    {[
                        { id: 'treatment', label: 'การรักษา', icon: <FileText size={14} /> },
                        { id: 'appointment', label: 'นัดหมาย', icon: <Clock size={14} /> },
                        { id: 'referral', label: 'ส่งตัว', icon: <Send size={14} /> },
                        { id: 'homevisit', label: 'เยี่ยมบ้าน', icon: <Home size={14} /> },
                        { id: 'tele', label: 'Tele-med', icon: <Video size={14} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveHistoryTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeHistoryTab === tab.id 
                                    ? "bg-white text-[#7367f0] shadow-sm" 
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sub-tab Content */}
                <div className="bg-white rounded-lg">
                    
                    {/* 1. Treatment History */}
                    {activeHistoryTab === 'treatment' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-[#5e5873]">ประวัติการรักษา</h3>
                                <Button variant="outline" size="sm" onClick={() => setShowAddMedicalRecord(true)} className="text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/5">
                                    เพิ่มบันทึกการรักษา
                                </Button>
                            </div>
                            {formData.treatmentHistory?.length === 0 ? (
                                <EmptyState title="ประวัติการรักษา" onClick={() => setShowAddMedicalRecord(true)} />
                            ) : (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-[#f3f2f7]">
                                            <TableRow>
                                                <TableHead className="text-xs">วันที่</TableHead>
                                                <TableHead className="text-xs">รายการ</TableHead>
                                                <TableHead className="text-xs">การรักษา</TableHead>
                                                <TableHead className="text-xs">แพทย์ผู้รับผิดชอบ</TableHead>
                                                <TableHead className="text-xs">โรงพยาบาล</TableHead>
                                                <TableHead className="text-xs text-right w-[100px]">จัดการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.treatmentHistory?.map((item, idx) => (
                                                <TableRow 
                                                    key={idx} 
                                                    className="cursor-pointer hover:bg-gray-50 group transition-colors"
                                                    onClick={() => setSelectedTreatment(item)}
                                                >
                                                    <TableCell className="text-xs">{formatThaiDate(item.date)}</TableCell>
                                                    <TableCell className="text-xs">
                                                        <div>{item.detail}</div>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-gray-500">{item.treatment || '-'}</TableCell>
                                                    <TableCell className="text-xs text-gray-500">{item.doctor}</TableCell>
                                                    <TableCell className="text-xs text-gray-500">{item.hospital}</TableCell>
                                                    <TableCell className="text-xs text-right">
                                                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]" title="แก้ไข">
                                                                <Pencil size={14} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" title="ลบ">
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. Appointments */}
                    {activeHistoryTab === 'appointment' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-[#5e5873]">ประวัติการนัดหมาย</h3>
                            </div>
                            {formData.appointments?.length === 0 ? (
                                <EmptyState title="ประวัติการนัดหมาย" onClick={() => setShowTeleConsultSystem(true)} />
                            ) : (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-[#f3f2f7]">
                                            <TableRow>
                                                <TableHead className="text-xs">วันและเวลา</TableHead>
                                                <TableHead className="text-xs">ห้องตรวจ</TableHead>
                                                <TableHead className="text-xs">โรงพยาบาล</TableHead>
                                                <TableHead className="text-xs">แพทย์ผู้รับผิดชอบ</TableHead>
                                                <TableHead className="text-xs">สถานะ</TableHead>
                                                <TableHead className="text-xs text-right w-[100px]">จัดการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.appointments?.map((item, idx) => (
                                                <TableRow 
                                                    key={idx} 
                                                    className="cursor-pointer hover:bg-gray-50 group transition-colors"
                                                    onClick={() => setSelectedAppointment(item)}
                                                >
                                                    <TableCell className="text-xs">{formatThaiDate(item.datetime)}</TableCell>
                                                    <TableCell className="text-xs text-gray-700">{item.room || "-"}</TableCell>
                                                    <TableCell className="text-xs text-gray-700">{formData.hospital}</TableCell>
                                                    <TableCell className="text-xs text-gray-700">{item.doctor || "-"}</TableCell>
                                                    <TableCell>
                                                        <span className={cn(
                                                            "text-xs font-medium",
                                                            (() => {
                                                                const s = (item.status || '').toLowerCase();
                                                                if (s === 'waiting') return "text-orange-700";
                                                                if (['confirmed', 'checked-in', 'accepted'].includes(s)) return "text-blue-700";
                                                                if (['cancelled', 'missed', 'rejected'].includes(s)) return "text-red-700";
                                                                return "text-green-700";
                                                            })()
                                                        )}>
                                                            {(() => {
                                                                const s = (item.status || '').toLowerCase();
                                                                if (s === 'waiting') return 'รอตรวจ';
                                                                if (['confirmed', 'checked-in', 'accepted'].includes(s)) return 'ยืนยันแล้ว';
                                                                if (['cancelled', 'missed', 'rejected'].includes(s)) return 'ยกเลิก';
                                                                return 'เสร็จสิ้น';
                                                            })()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-right">
                                                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]" title="แก้ไข">
                                                                <Pencil size={14} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" title="ลบ">
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Referrals */}
                    {activeHistoryTab === 'referral' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-[#5e5873]">ประวัติการส่งตัว (Referral)</h3>
                            </div>
                            {formData.referrals?.length === 0 ? (
                                <EmptyState title="ประวัติการส่งตัว" onClick={() => setShowReferralSystem(true)} />
                            ) : (
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-[#f3f2f7]">
                                            <TableRow>
                                                <TableHead className="text-xs">วันที่</TableHead>
                                                <TableHead className="text-xs">การรักษา</TableHead>
                                                <TableHead className="text-xs">ต้นทาง</TableHead>
                                                <TableHead className="text-xs">ปลายทาง</TableHead>
                                                <TableHead className="text-xs">สถานะ</TableHead>
                                                <TableHead className="text-xs text-right w-[100px]">จัดการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.referrals?.map((item, idx) => (
                                                <TableRow 
                                                    key={idx}
                                                    className="cursor-pointer hover:bg-gray-50 group transition-colors"
                                                    onClick={() => setSelectedReferral(item)}
                                                >
                                                    <TableCell className="text-xs">{formatThaiDate(item.date)}</TableCell>
                                                    <TableCell className="text-xs">{item.treatment}</TableCell>
                                                    <TableCell className="text-xs">{item.sourceHospital || formData.hospital || "-"}</TableCell>
                                                    <TableCell className="text-xs">{item.destination}</TableCell>
                                                    <TableCell><StatusBadge status={item.status} system="referral" /></TableCell>
                                                    <TableCell className="text-xs text-right">
                                                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]" title="แก้ไข">
                                                                <Pencil size={14} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" title="ลบ">
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. Home Visits */}
                    {activeHistoryTab === 'homevisit' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-[#5e5873]">ประวัติการเยี่ยมบ้าน</h3>
                                <Button variant="outline" size="sm" onClick={() => setShowHomeVisitForm(true)} className="text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/5">
                                    เพิ่มข้อมูลเยี่ยมบ้าน
                                </Button>
                            </div>
                            {formData.homeVisits?.length === 0 ? (
                                <EmptyState title="ประวัติการเยี่ยมบ้าน" onClick={() => setShowHomeVisitSystem(true)} />
                            ) : (
                                <div className="border rounded-lg overflow-hidden">
                                     <Table>
                                        <TableHeader className="bg-[#f3f2f7]">
                                            <TableRow>
                                                <TableHead className="text-xs">วันที่</TableHead>
                                                <TableHead className="text-xs">รายละเอียด</TableHead>
                                                <TableHead className="text-xs">หน่วยงาน/ผู้เยี่ยม</TableHead>
                                                <TableHead className="text-xs">ประเภท</TableHead>
                                                <TableHead className="text-xs">สถานะ</TableHead>
                                                <TableHead className="text-xs text-right w-[100px]">จัดการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.homeVisits?.map((item, idx) => (
                                                <TableRow 
                                                    key={idx}
                                                    className="cursor-pointer hover:bg-gray-50 group transition-colors"
                                                    onClick={() => setSelectedHomeVisit(item)}
                                                >
                                                    <TableCell className="text-xs">{formatThaiDate(item.date)}</TableCell>
                                                    <TableCell className="text-xs">{item.detail}</TableCell>
                                                    <TableCell className="text-xs">{item.visitor || (item as any).agency || "-"}</TableCell>
                                                    <TableCell className="text-xs">{item.visitType || "-"}</TableCell>
                                                    <TableCell><StatusBadge status={item.status} system="homevisit" /></TableCell>
                                                    <TableCell className="text-xs text-right">
                                                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]" title="แก้ไข">
                                                                <Pencil size={14} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" title="ลบ">
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 5. Tele-consult */}
                    {activeHistoryTab === 'tele' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-[#5e5873]">ประวัติ Tele-med</h3>
                            </div>
                            {formData.teleConsults?.length === 0 ? (
                                <EmptyState title="ประวัติ Tele-consult" onClick={() => setShowTeleConsultSystem(true)} />
                            ) : (
                                 <div className="border rounded-lg overflow-hidden">
                                     <Table>
                                        <TableHeader className="bg-[#f3f2f7]">
                                            <TableRow>
                                                <TableHead className="text-xs">วัน-เวลา</TableHead>
                                                <TableHead className="text-xs">รายละเอียด</TableHead>
                                                <TableHead className="text-xs">แพทย์ผู้รับผิดชอบ</TableHead>
                                                <TableHead className="text-xs">ช่องทาง</TableHead>
                                                <TableHead className="text-xs">สถานะ</TableHead>
                                                <TableHead className="text-xs text-right w-[100px]">จัดการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.teleConsults?.map((item, idx) => (
                                                <TableRow 
                                                    key={idx}
                                                    className="cursor-pointer hover:bg-gray-50 group transition-colors"
                                                    onClick={() => setSelectedTeleConsult(item)}
                                                >
                                                    <TableCell className="text-xs">{formatThaiDate(item.datetime)}</TableCell>
                                                    <TableCell className="text-xs">
                                                        <div>{item.detail}</div>
                                                        <a href={item.link} className="text-[#7367f0] underline text-[10px]" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Meeting Link</a>
                                                    </TableCell>
                                                    <TableCell className="text-xs">{item.doctor || "-"}</TableCell>
                                                    <TableCell><StatusBadge status={item.type} system="teleconsult" /></TableCell>
                                                    <TableCell><StatusBadge status={item.status} system="teleconsult" /></TableCell>
                                                    <TableCell className="text-xs text-right">
                                                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]" title="แก้ไข">
                                                                <Pencil size={14} />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" title="ลบ">
                                                                <Trash2 size={14} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fund section moved to Info tab */}
                </div>
            </div>
          )}
          
          {/* Save Action Bar */}
          {isEditing && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-center items-center shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-4">
              <Button 
                onClick={handleSaveClick}
                className="bg-[#28c76f] hover:bg-[#20a059] text-white font-bold px-12 h-[48px] text-[16px] shadow-lg"
              >
                บันทึกการเปลี่ยนแปลง
              </Button>
            </div>
          )}

        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6 animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-[#5e5873] text-lg flex items-center gap-2">
                        <Upload className="text-[#7367f0]" size={20} /> อัปโหลดเอกสาร
                    </h3>
                    <button
                        onClick={() => { setIsUploadModalOpen(false); setUploadDocName(''); setUploadDocCategory(''); }}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-[#7367f0]/30 rounded-2xl p-8 text-center bg-[#7367f0]/5 hover:bg-[#7367f0]/10 transition-colors cursor-pointer mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#7367f0]/10 flex items-center justify-center mx-auto mb-4">
                        <Upload size={28} className="text-[#7367f0]" />
                    </div>
                    <p className="font-medium text-[#5e5873] mb-1">กดเพื่อเลือกไฟล์</p>
                    <p className="text-sm text-gray-400">รองรับ JPG, PNG, PDF (สูงสุด 10MB)</p>
                </div>

                {/* Document Name */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-[#6e6b7b] block mb-1.5">ชื่อเอกสาร</label>
                    <Input 
                        placeholder="เช่น X-Ray ใบหน้า" 
                        className="rounded-lg border-gray-200 h-11" 
                        value={uploadDocName}
                        onChange={(e) => setUploadDocName(e.target.value)}
                    />
                </div>

                {/* Category Select */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-[#6e6b7b] block mb-1.5">หมวดหมู่</label>
                    <select 
                        className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm text-[#5e5873] bg-white focus:outline-none focus:ring-2 focus:ring-[#7367f0]/20 focus:border-[#7367f0]"
                        value={uploadDocCategory}
                        onChange={(e) => setUploadDocCategory(e.target.value)}
                    >
                        <option value="">เลือกหมวดหมู่</option>
                        <option value="X-Ray">X-Ray</option>
                        <option value="ผลตรวจ">ผลตรวจ</option>
                        <option value="เอกสารยินยอม">เอกสารยินยอม</option>
                        <option value="รูปถ่าย">รูปถ่าย</option>
                        <option value="ผลประเมิน">ผลประเมิน</option>
                        <option value="เยี่ยมบ้าน">เยี่ยมบ้าน</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => { setIsUploadModalOpen(false); setUploadDocName(''); setUploadDocCategory(''); }}
                        className="flex-1 rounded-lg border-gray-200 text-[#6e6b7b] h-11"
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={() => {
                            const newDoc = {
                                id: String(documents.length + 1),
                                name: uploadDocName || 'เอกสารใหม่',
                                category: uploadDocCategory || 'อื่นๆ',
                                date: '12 ก.พ. 69',
                                fileType: 'pdf' as const,
                                size: '1.5 MB',
                                uploadedBy: 'CM ผู้ใช้งาน'
                            };
                            setDocuments(prev => [newDoc, ...prev]);
                            setIsUploadModalOpen(false);
                            setUploadDocName('');
                            setUploadDocCategory('');
                        }}
                        className="flex-1 bg-[#7367f0] hover:bg-[#685dd8] text-white rounded-lg h-11 shadow-lg shadow-[#7367f0]/20"
                    >
                        <Upload size={18} className="mr-2" /> อัปโหลด
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                {/* Preview Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            previewDoc.fileType === 'image' ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500"
                        )}>
                            {previewDoc.fileType === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-medium text-[#5e5873] truncate">{previewDoc.name}</h4>
                            <p className="text-sm text-gray-400">{previewDoc.date} | {previewDoc.size}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setPreviewDoc(null)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors shrink-0"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Preview Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {previewDoc.fileType === 'image' ? (
                        <div className="bg-gray-50 rounded-xl p-2 flex items-center justify-center min-h-[300px]">
                            <div className="text-center">
                                <ImageIcon size={64} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-[#5e5873] font-medium">{previewDoc.name}</p>
                                <p className="text-sm text-gray-400 mt-1">ตัวอย่างรูปภาพ (Mock Preview)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center min-h-[300px]">
                            <div className="text-center">
                                <FileText size={64} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-[#5e5873] font-medium">{previewDoc.name}</p>
                                <p className="text-sm text-gray-400 mt-1">ตัวอย่างเอกสาร PDF (Mock Preview)</p>
                            </div>
                        </div>
                    )}

                    {/* Detail Info */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-400 block mb-0.5">หมวดหมู่</span>
                            <span className="text-sm font-medium text-[#5e5873]">{previewDoc.category}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-400 block mb-0.5">วันที่อัปโหลด</span>
                            <span className="text-sm font-medium text-[#5e5873]">{previewDoc.date}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-400 block mb-0.5">ขนาดไฟล์</span>
                            <span className="text-sm font-medium text-[#5e5873]">{previewDoc.size}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm text-gray-400 block mb-0.5">อัปโหลดโดย</span>
                            <span className="text-sm font-medium text-[#5e5873]">{previewDoc.uploadedBy}</span>
                        </div>
                    </div>
                </div>

                {/* Preview Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setPreviewDoc(null)}
                        className="flex-1 rounded-lg border-gray-200 text-[#6e6b7b]"
                    >
                        ปิด
                    </Button>
                    <Button className="flex-1 bg-[#7367f0] hover:bg-[#685dd8] text-white rounded-lg shadow-lg shadow-[#7367f0]/20">
                        <Download size={18} className="mr-2" /> ดาวน์โหลด
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
