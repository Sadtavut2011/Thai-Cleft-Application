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
    Wallet
} from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../../components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

// --- Placeholder Components for missing dependencies ---

const PatientQuickActions = () => (
    <div className="flex items-center gap-2">
        {/* Placeholder for Quick Actions */}
    </div>
);

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
    status?: string; // Added status for compatibility
    // Extended for detail view
    location?: string;
    doctor?: string;
    type?: string;
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
}

export interface HomeVisitItem {
    id?: string;
    date: string;
    detail: string;
    status: string;
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

    // Extended fields
    dob?: string;
    address?: string;
    phone?: string;
    guardian?: string;
    rph?: string; // รพ.สต.
    rights?: string; // สิทธิการรักษา
    doctor?: string; // แพทย์ผู้วินิจฉัย

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

// --- Helper Components ---

function SectionHeader({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-4 mt-8 pb-2 border-b border-[#E0E0E0]">
            <div className="text-[#7367f0] p-1.5 bg-[#7367f0]/10 rounded-lg">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-[#5e5873]">{title}</h3>
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

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Accepted': "text-[#28c76f] bg-[#28c76f]/10",
        'Approved': "text-[#28c76f] bg-[#28c76f]/10",
        'Rejected': "text-[#ea5455] bg-[#ea5455]/10",
        'Pending': "text-[#ff9f43] bg-[#ff9f43]/10",
        'Completed': "text-[#28c76f] bg-[#28c76f]/10",
        'Direct': "text-[#00cfe8] bg-[#00cfe8]/10",
        'ViaHospital': "text-[#7367f0] bg-[#7367f0]/10",
    };

    const defaultStyle = "text-[#6e6b7b] bg-[#6e6b7b]/10";

    return (
        <span className={cn("text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded-full", ['Accepted', 'Approved', 'Completed', 'เรียบร้อย'].includes(status) ? "text-[#00A63E] bg-[#E8F5E9]" : (styles[status] || defaultStyle))}>
            {status === 'Accepted' || status === 'Approved' ? 'อนุมัติ/ยอมรับ' :
                status === 'Rejected' ? 'ปฏิเสธ' :
                    status === 'Pending' ? 'รออนุมัติ' :
                        status === 'Direct' ? 'ส่งตรงหาผู้ป่วย' :
                            status === 'ViaHospital' ? 'ผ่าน รพ.สต.' :
                                status === 'Completed' ? 'เรียบร้อย' :
                                    status}
        </span>
    );
}

function EmptyState({ title, onClick }: { title: string, onClick?: (e: React.MouseEvent) => void }) {
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

// --- Main Component ---

export function PatientDetailView({ patient, onBack, onNavigate, onAction, onAddMedicalRecord, onRequestFund }: PatientDetailProps) {
    const [activeFundCard, setActiveFundCard] = useState<'smile' | 'travel' | 'add'>('smile');

    // Enrich patient data with mock details if missing
    const [formData, setFormData] = useState<PatientData>(() => ({
        ...patient,
        dob: patient.dob || "12 มกราคม 2560",
        address: patient.address || "123 หมู่ 4 ต.บ้านใหม่ อ.เมือง จ.เชียงใหม่ 50000",
        phone: patient.phone || "089-123-4567",
        guardian: patient.guardian || "นางสมศรี ใจดี (มารดา)",
        rph: patient.rph || "รพ.สต. บ��านใหม่",
        rights: patient.rights || "บัตรทอง (UC)",
        doctor: patient.doctor || "นพ. สมชาย รักษาดี",

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
            { id: "apt-1", datetime: "20/12/2566 09:00", detail: "ติดตามผลหลังผ่าตัด 6 เดือน", location: "ห้องตรวจ 4 ศัลยกรรม", doctor: "นพ. สมชาย รักษาดี", status: "นัดหมาย", type: "ติดตามผล" },
            { id: "apt-2", datetime: "15/03/2567 10:30", detail: "ประเมินการผ่าตัดเพดานปาก", location: "ห้องตรวจ 4 ศัลยกรรม", doctor: "นพ. สมชาย รักษาดี", status: "นัดหมาย", type: "ประเมินก่อนผ่าตัด" },
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
                reason: "ต้องการแพทย์ผู้เชี่ยวชา���เฉพาะทางเพื่อทำการผ่าตัด",
                diagnosis: "Cleft Lip and Palate",
                urgency: "Routine"
            }
        ],

        homeVisits: patient.homeVisits || [
            { id: "hv-1", date: "20/02/2566", detail: "เยี่ยมบ้านหลังผ่าตัด ดูแลแผล", status: "เรียบร้อย", visitor: "พยาบาลวิชาชีพ ดวงใจ", result: "แผลแห้งดี ไม่มีหนอง มารดาดูแลได้ดี" }
        ],

        teleConsults: patient.teleConsults || [
            { id: "tc-1", detail: "ติดตามอาการแผลผ่าตัด", datetime: "25/02/2566 14:00", link: "https://meet.google.com/abc-defg-hij", type: "Direct", doctor: "นพ. สมชาย รักษาดี", status: "Completed" }
        ],

        funds: patient.funds || [
            { id: "fund-1", name: "กองทุนเพื่อผู้ป่วยปากแหว่งเพดานโหว่", date: "01/02/2566", amount: 5000, status: "Approved", requester: "นางสมศรี ใจดี", description: "ค่าเดินทางและค่าอาหารสำหรับการผ่าตัด" }
        ]
    }));

    const [isEditing, setIsEditing] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showFundSystem, setShowFundSystem] = useState(false);
    const [showReferralSystem, setShowReferralSystem] = useState(false);
    const [showAppointmentSystem, setShowAppointmentSystem] = useState(false);
    const [showHomeVisitSystem, setShowHomeVisitSystem] = useState(false);
    const [showHomeVisitForm, setShowHomeVisitForm] = useState(false);
    const [showTeleConsultSystem, setShowTeleConsultSystem] = useState(false);
    const [showAddTreatmentPlan, setShowAddTreatmentPlan] = useState(false);
    const [showAddMedicalRecord, setShowAddMedicalRecord] = useState(false);
    const [showFundDisbursement, setShowFundDisbursement] = useState(false);

    // Detail View States
    const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [selectedReferral, setSelectedReferral] = useState<any>(null);
    const [selectedHomeVisit, setSelectedHomeVisit] = useState<any>(null);
    const [selectedTeleConsult, setSelectedTeleConsult] = useState<any>(null);
    const [selectedFund, setSelectedFund] = useState<any>(null);

    // Tab State
    const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
    const [activeHistoryTab, setActiveHistoryTab] = useState<'treatment' | 'appointment' | 'referral' | 'homevisit' | 'tele' | 'fund'>('treatment');

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
        />
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

    if (showAddMedicalRecord) {
        return <AddMedicalRecordForm
            onBack={() => setShowAddMedicalRecord(false)}
            onSave={(data) => {
                console.log("Saved medical record:", data);
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

    // --- Detail Views ---

    if (selectedTreatment) {
        return <MedicalRecordDetail
            onBack={() => setSelectedTreatment(null)}
            data={{
                date: selectedTreatment.date,
                hospital: selectedTreatment.hospital,
                department: selectedTreatment.department,
                treatment: selectedTreatment.treatment || selectedTreatment.detail,
                doctor: selectedTreatment.doctor,
                diagnosis: selectedTreatment.diagnosis,
                // Add mock data for missing fields to show the detail view fully
                chiefComplaint: "มีอาการปวดบริเวณแผลผ่าตัด",
                presentIllness: "ผู้ป่วยมีอาการปวดบวมแดงบริเวณแผลผ่าตัด 2 วันก่อนมาโรงพยาบาล",
                pastHistory: "ไม่มีโรคประจำตัว ปฏิเสธการแพ้ยา",
                treatmentResult: "แผลแห้งดี ไม่มีหนอง",
                treatmentPlan: "ทานยาแก้ปวด และยาปฏิชีวนะตามแพทย์สั่ง"
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
                hospital: selectedAppointment.location || formData.hospital,
                doctor: selectedAppointment.doctor || formData.doctor,
                detail: selectedAppointment.detail,
                status: selectedAppointment.status || "upcoming"
            }}
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
                destination: selectedReferral.destination,
                treatment: selectedReferral.treatment,
                status: selectedReferral.status
            }}
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
                visitor: selectedHomeVisit.visitor,
                result: selectedHomeVisit.result
            }}
            onBack={() => setSelectedHomeVisit(null)}
        />;
    }

    if (selectedTeleConsult) {
        return <TeleConsultationSystemDetail
            data={{
                id: selectedTeleConsult.id || "tc-1",
                datetime: selectedTeleConsult.datetime,
                detail: selectedTeleConsult.detail,
                link: selectedTeleConsult.link,
                type: selectedTeleConsult.type,
                doctor: selectedTeleConsult.doctor,
                status: selectedTeleConsult.status
            }}
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
            onBack={() => setSelectedFund(null)}
        />;
    }

    return (
        <>
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
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 rounded-tr-xl shadow-sm border-b border-[#E0E0E0]">
                    <div className="flex items-center justify-between p-6 pb-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onBack}
                                    className="mr-2 text-gray-500 hover:text-[#7367f0] hover:bg-[#7367f0]/10"
                                >
                                    <ArrowLeft size={24} />
                                </Button>
                                <div className="h-10 w-10 bg-[#7367f0]/10 rounded-full flex items-center justify-center text-[#7367f0] font-bold text-lg">
                                    {formData.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#5e5873]">
                                        {formData.name}
                                    </h2>
                                    <p className="text-sm text-[#b9b9c3]">HN: {formData.code} | {formData.hospital}</p>
                                </div>
                            </div>

                            <PatientQuickActions />
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Action Menu Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="bg-[#009688] hover:bg-[#00796b] text-white font-bold px-6 h-[45px] rounded-xl shadow-lg shadow-[#009688]/20 text-base flex items-center gap-2"
                                    >
                                        เมนูปฏิบัติการ
                                        <ChevronDown size={20} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[240px] p-2">
                                    <DropdownMenuItem onClick={() => setShowTeleConsultSystem(true)} className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#009688] focus:text-[#009688] focus:bg-[#009688]/5">
                                        <Video size={18} className="mr-3" />
                                        <span className="font-medium">สร้างนัดหมายผู้ป่วย</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowReferralSystem(true)} className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#009688] focus:text-[#009688] focus:bg-[#009688]/5">
                                        <Send size={18} className="mr-3" />
                                        <span className="font-medium">ส่งตัวผู้ป่วย</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowFundSystem(true)} className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#009688] focus:text-[#009688] focus:bg-[#009688]/5">
                                        <CreditCard size={18} className="mr-3" />
                                        <span className="font-medium">ขอยื่นรับทุน</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowHomeVisitSystem(true)} className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#009688] focus:text-[#009688] focus:bg-[#009688]/5">
                                        <Home size={18} className="mr-3" />
                                        <span className="font-medium">ส่งคำขอเยี่ยมบ้าน</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setShowAddMedicalRecord(true)} className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#009688] focus:text-[#009688] focus:bg-[#009688]/5 border-t mt-1 pt-3">
                                        <FileText size={18} className="mr-3" />
                                        <span className="font-medium">บันทึกการรักษา</span>
                                    </DropdownMenuItem>

                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Edit Button (Icon Only) */}
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                className={cn(
                                    "h-[45px] w-[45px] rounded-xl p-0 transition-all shadow-lg flex items-center justify-center",
                                    isEditing
                                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        : "bg-[#7367f0] hover:bg-[#685dd8] text-white shadow-[#7367f0]/30"
                                )}
                            >
                                {isEditing ? <X size={20} /> : <Pencil size={20} />}
                            </Button>

                            {/* Delete Button (Icon Only) */}
                            <Button
                                className="bg-[#ea5455] hover:bg-[#d94a4b] text-white h-[45px] w-[45px] rounded-xl p-0 shadow-lg shadow-[#ea5455]/30 flex items-center justify-center"
                                onClick={() => {
                                    if (window.confirm("ยืนยันการลบข้อมูลผู้ป่วยรายนี้?")) {
                                        onBack();
                                    }
                                }}
                            >
                                <Trash2 size={20} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 space-y-8 animate-in fade-in duration-500">

                    {/* INFO TAB CONTENT */}
                    {activeTab === 'info' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                            {/* Patient Image */}
                            <div className="w-[300px] h-[350px] mx-auto rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mb-6">
                                <div className="flex flex-col items-center text-gray-500">
                                    <Upload className="h-8 w-8 mb-2" />
                                    <span className="text-sm font-medium">Click to upload cover image</span>
                                    <span className="text-xs text-gray-400">JPG, PNG up to 5MB</span>
                                </div>
                            </div>

                            {/* 1. Personal Information */}
                            <section>
                                <SectionHeader title="ข้อมูลส่วนตัว" icon={<User size={20} />} />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <DetailRow label="ชื่อ - นามสกุล" value={formData.name} isReadOnly={!isEditing} onChange={(v) => handleInputChange("name", v)} icon={<User size={14} />} />
                                    <DetailRow label="วัน/เดือน/ปีเกิด" value={formData.dob!} isReadOnly={!isEditing} onChange={(v) => handleInputChange("dob", v)} icon={<Calendar size={14} />} />
                                    <DetailRow label="เบอร์โทรศัพท์" value={formData.phone!} isReadOnly={!isEditing} onChange={(v) => handleInputChange("phone", v)} icon={<Phone size={14} />} />
                                    <DetailRow label="ผู้ปกครอง" value={formData.guardian!} isReadOnly={!isEditing} onChange={(v) => handleInputChange("guardian", v)} icon={<User size={14} />} />
                                    <DetailRow label="สิทธิการรักษา" value={formData.rights!} isReadOnly={!isEditing} onChange={(v) => handleInputChange("rights", v)} icon={<FileText size={14} />} />
                                    <DetailRow label="โรงพยาบาลต้นสังกัด" value={formData.hospital} isReadOnly={!isEditing} onChange={(v) => handleInputChange("hospital", v)} icon={<Home size={14} />} />
                                    <DetailRow label="รพ.สต. ที่รับผิดชอบ" value={formData.rph!} isReadOnly={!isEditing} onChange={(v) => handleInputChange("rph", v)} icon={<MapPin size={14} />} />
                                    <div className="md:col-span-2 lg:col-span-3">
                                        <DetailRow label="ที่อยู่" value={formData.address!} isReadOnly={!isEditing} onChange={(v) => handleInputChange("address", v)} icon={<MapPin size={14} />} />
                                    </div>
                                </div>
                            </section>

                            {/* 2. Diagnosis Information */}
                            <section>
                                <SectionHeader title="ข้อมูลการวินิจฉัย" icon={<Activity size={20} />} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <DetailRow label="การวินิจฉัยโรค" value={formData.diagnosis} isReadOnly={!isEditing} onChange={(v) => handleInputChange("diagnosis", v)} icon={<Stethoscope size={14} />} />
                                    <DetailRow label="แพทย์ผู้วินิจฉัย" value={formData.doctor!} isReadOnly={!isEditing} onChange={(v) => handleInputChange("doctor", v)} icon={<User size={14} />} />
                                </div>

                                <div
                                    className="bg-[#f8f9fa] p-6 rounded-lg border border-dashed border-[#d8d6de] cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => onNavigate?.("แผนการรักษา", String(formData.id))}
                                >
                                    <h4 className="font-semibold text-[#5e5873] mb-4 flex items-center gap-2">
                                        <Clock size={16} /> แผนการรักษา (Timeline)
                                    </h4>
                                    {formData.treatmentPlan?.length === 0 ? (
                                        <EmptyState title="แผนการรักษา" onClick={(e) => { e.stopPropagation(); setShowAddTreatmentPlan(true); }} />
                                    ) : (
                                        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full px-2">
                                            {/* Line behind */}
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 md:left-0 md:right-0 md:top-4 md:h-0.5 md:w-full -z-0 hidden md:block" />

                                            {formData.treatmentPlan?.map((item, index) => (
                                                <div key={index} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto mb-6 md:mb-0">
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 bg-white",
                                                        item.status === 'completed' ? "border-[#28c76f] text-[#28c76f]" :
                                                            item.status === 'current' ? "border-[#7367f0] text-[#7367f0]" :
                                                                "border-gray-300 text-gray-300"
                                                    )}>
                                                        {item.status === 'completed' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                                    </div>
                                                    <div className="text-left md:text-center">
                                                        <p className={cn("font-semibold text-sm",
                                                            item.status === 'current' ? "text-[#7367f0]" : "text-[#5e5873]"
                                                        )}>
                                                            {item.stage}
                                                        </p>
                                                        {item.date && <p className="text-xs text-gray-500">{item.date}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* 4. Map */}
                            <section>
                                <SectionHeader title="ข้อมูลพิกัดบนแผนที่" icon={<MapPin size={20} />} />
                                <div className="w-full h-[300px] bg-gray-100 rounded-xl border border-gray-200 relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-10"></div>
                                    <div className="text-center z-10">
                                        <div className="w-12 h-12 bg-[#ea5455] rounded-full mx-auto mb-3 flex items-center justify-center text-white shadow-xl animate-bounce">
                                            <MapPin size={24} fill="currentColor" />
                                        </div>
                                        <h3 className="text-gray-500 font-bold">Patient Location</h3>
                                        <p className="text-gray-400 text-sm">{formData.address}</p>
                                        <p className="text-[#7367f0] text-xs mt-2 cursor-pointer hover:underline">View on Google Maps</p>
                                    </div>
                                </div>
                            </section>
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
                                    { id: 'tele', label: 'Tele-consult', icon: <Video size={14} /> },
                                    { id: 'fund', label: 'ทุน', icon: <CreditCard size={14} /> },
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
                                                <Plus size={14} className="mr-1" /> เพิ่มบันทึกการรักษา
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
                                                                <TableCell className="text-xs font-medium">{item.date}</TableCell>
                                                                <TableCell className="text-xs">
                                                                    <div className="font-semibold">{item.detail}</div>
                                                                    <div className="text-gray-500">{item.doctor}</div>
                                                                </TableCell>
                                                                <TableCell className="text-xs text-gray-500">{item.hospital}</TableCell>
                                                                <TableCell className="text-xs text-right">
                                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                                                            <TableHead className="text-xs">รายละเอียด</TableHead>
                                                            <TableHead className="text-xs">ห้องตรวจ</TableHead>
                                                            <TableHead className="text-xs">โรงพยาบาล</TableHead>
                                                            <TableHead className="text-xs">แพทย์ผู้รักษา</TableHead>
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
                                                                <TableCell className="text-xs font-medium text-[#7367f0]">{item.datetime}</TableCell>
                                                                <TableCell className="text-xs text-gray-700">{item.detail}</TableCell>
                                                                <TableCell className="text-xs text-gray-700">{item.location || "-"}</TableCell>
                                                                <TableCell className="text-xs text-gray-700">{formData.hospital}</TableCell>
                                                                <TableCell className="text-xs text-gray-700">{item.doctor || "-"}</TableCell>
                                                                <TableCell className="text-xs text-right">
                                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                                                                <TableCell className="text-xs">{item.date}</TableCell>
                                                                <TableCell className="text-xs font-medium">{item.treatment}</TableCell>
                                                                <TableCell className="text-xs">{item.destination}</TableCell>
                                                                <TableCell><StatusBadge status={item.status} /></TableCell>
                                                                <TableCell className="text-xs text-right">
                                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                                                <Plus size={14} className="mr-1" /> เพิ่มข้อมูลเยี่ยมบ้าน
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
                                                                <TableCell className="text-xs">{item.date}</TableCell>
                                                                <TableCell className="text-xs">{item.detail}</TableCell>
                                                                <TableCell className="text-xs text-[#00A63E] font-medium whitespace-nowrap">{item.status}</TableCell>
                                                                <TableCell className="text-xs text-right">
                                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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
                                            <h3 className="font-bold text-[#5e5873]">ประวัติ Tele-consult</h3>
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
                                                            <TableHead className="text-xs">รูปแบบ</TableHead>
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
                                                                <TableCell className="text-xs">{item.datetime}</TableCell>
                                                                <TableCell className="text-xs">
                                                                    <div>{item.detail}</div>
                                                                    <a href={item.link} className="text-[#7367f0] underline text-[10px]" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Meeting Link</a>
                                                                </TableCell>
                                                                <TableCell><StatusBadge status={item.type} /></TableCell>
                                                                <TableCell className="text-xs text-right">
                                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
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

                                {/* 6. Funds */}
                                {activeHistoryTab === 'fund' && (
                                    <div>
                                        {/* Fund Carousel */}
                                        <div className="w-full max-w-lg mx-auto mb-10 mt-4 relative min-h-[160px] flex items-center justify-center">

                                            {/* Left Arrow */}
                                            {activeFundCard !== 'smile' && (
                                                <button
                                                    onClick={() => {
                                                        if (activeFundCard === 'travel') setActiveFundCard('smile');
                                                        if (activeFundCard === 'add') setActiveFundCard('travel');
                                                    }}
                                                    className="absolute -left-4 md:-left-12 h-10 w-10 bg-white shadow-md rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-[#7367f0] transition-all hover:scale-105 z-10"
                                                >
                                                    <ArrowLeft size={24} />
                                                </button>
                                            )}

                                            {/* Card 1: Operation Smile */}
                                            {activeFundCard === 'smile' && (
                                                <div className="bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full animate-in fade-in slide-in-from-left-4 duration-300">
                                                    <h3 className="text-[#6e6b7b] font-medium text-xl mb-3">Operation Smile</h3>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl font-bold text-[#7367f0]">10,000</span>
                                                        <span className="text-[#b9b9c3] text-xl">บาท</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Card 2: Travel */}
                                            {activeFundCard === 'travel' && (
                                                <div className="bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full animate-in fade-in slide-in-from-right-4 duration-300">
                                                    <h3 className="text-[#6e6b7b] font-medium text-xl mb-3">ค่าเดินทาง</h3>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl font-bold text-[#7367f0]">5,000</span>
                                                        <span className="text-[#b9b9c3] text-xl">บาท</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Card 3: Add Fund */}
                                            {activeFundCard === 'add' && (
                                                <div
                                                    className="bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[#7367f0] hover:bg-[#7367f0]/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center w-full min-h-[160px] cursor-pointer group transition-all animate-in fade-in slide-in-from-right-4 duration-300"
                                                    onClick={() => setShowFundSystem(true)}
                                                >
                                                    <div className="h-14 w-14 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#7367f0] group-hover:text-[#7367f0] transition-colors shadow-sm">
                                                        <Plus size={32} className="text-gray-400 group-hover:text-[#7367f0]" />
                                                    </div>
                                                    <h3 className="text-gray-500 font-medium text-lg group-hover:text-[#7367f0]">เพิ่มทุนสงเคราะห์</h3>
                                                </div>
                                            )}

                                            {/* Right Arrow */}
                                            {activeFundCard !== 'add' && (
                                                <button
                                                    onClick={() => {
                                                        if (activeFundCard === 'smile') setActiveFundCard('travel');
                                                        if (activeFundCard === 'travel') setActiveFundCard('add');
                                                    }}
                                                    className="absolute -right-4 md:-right-12 h-10 w-10 bg-white shadow-md rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-[#7367f0] transition-all hover:scale-105 z-10"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>
                                            )}

                                            {/* Dots Indicators */}
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                                <div className={`w-2 h-2 rounded-full transition-colors ${activeFundCard === 'smile' ? 'bg-[#7367f0]' : 'bg-gray-300'}`}></div>
                                                <div className={`w-2 h-2 rounded-full transition-colors ${activeFundCard === 'travel' ? 'bg-[#7367f0]' : 'bg-gray-300'}`}></div>
                                                <div className={`w-2 h-2 rounded-full transition-colors ${activeFundCard === 'add' ? 'bg-[#7367f0]' : 'bg-gray-300'}`}></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-[#5e5873]">
                                                {activeFundCard === 'smile' ? 'ประวัติทุนสงเคราะห์' :
                                                    activeFundCard === 'travel' ? 'ประวัติการเบิกเงินค่าเดินทาง' :
                                                        'ข้อมูลทุน'}
                                            </h3>
                                            <Button variant="outline" size="sm" onClick={() => setShowFundSystem(true)} className="text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/5">
                                                <Plus size={14} className="mr-1" /> ขอเบิกจ่ายทุน
                                            </Button>
                                        </div>

                                        <div className="border rounded-lg overflow-hidden bg-white">
                                            {activeFundCard === 'add' ? (
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
                                                        {activeFundCard === 'smile' ? (
                                                            <>
                                                                <TableRow className="cursor-pointer hover:bg-gray-50">
                                                                    <TableCell className="text-xs font-medium">ค่าผ่าตัดเพิ่มเติม</TableCell>
                                                                    <TableCell className="text-xs">15 พ.ย. 67</TableCell>
                                                                    <TableCell className="text-xs font-bold text-[#7367f0]">2,500</TableCell>
                                                                    <TableCell><StatusBadge status="Approved" /></TableCell>
                                                                    <TableCell className="text-xs text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]"><Pencil size={14} /></Button></div></TableCell>
                                                                </TableRow>
                                                                <TableRow className="cursor-pointer hover:bg-gray-50">
                                                                    <TableCell className="text-xs font-medium">ค่าผ่าตัดเพดานปาก</TableCell>
                                                                    <TableCell className="text-xs">10 ธ.ค. 67</TableCell>
                                                                    <TableCell className="text-xs font-bold text-[#7367f0]">3,000</TableCell>
                                                                    <TableCell><StatusBadge status="Pending" /></TableCell>
                                                                    <TableCell className="text-xs text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]"><Pencil size={14} /></Button></div></TableCell>
                                                                </TableRow>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <TableRow className="cursor-pointer hover:bg-gray-50">
                                                                    <TableCell className="text-xs font-medium">ค่าเดินทาง (ไป-กลับ)</TableCell>
                                                                    <TableCell className="text-xs">01 ม.ค. 67</TableCell>
                                                                    <TableCell className="text-xs font-bold text-[#7367f0]">1,500</TableCell>
                                                                    <TableCell><StatusBadge status="Approved" /></TableCell>
                                                                    <TableCell className="text-xs text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]"><Pencil size={14} /></Button></div></TableCell>
                                                                </TableRow>
                                                                <TableRow className="cursor-pointer hover:bg-gray-50">
                                                                    <TableCell className="text-xs font-medium">ค่าเดินทาง (Follow-up)</TableCell>
                                                                    <TableCell className="text-xs">20 ม.ค. 67</TableCell>
                                                                    <TableCell className="text-xs font-bold text-[#7367f0]">500</TableCell>
                                                                    <TableCell><StatusBadge status="Approved" /></TableCell>
                                                                    <TableCell className="text-xs text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-[#7367f0]"><Pencil size={14} /></Button></div></TableCell>
                                                                </TableRow>
                                                            </>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </div>
                                    </div>
                                )}
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
        </>
    );
}
