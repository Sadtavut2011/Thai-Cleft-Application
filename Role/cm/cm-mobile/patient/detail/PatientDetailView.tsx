import React, { useState } from 'react';
import { 
    ChevronLeft, 
    Send, 
    CalendarPlus,
    FileText,
    Stethoscope,
    Home,
    Plus,
    MessageCirclePlus,
    Video
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { HomeVisitADD } from '../../home-visit/forms/HomeVisitADD';
import { HOME_VISIT_DATA, PATIENTS_DATA } from '../../../../../data/patientData';
import { ReferralRequestForm } from '../../referral/forms/ReferralRequestForm';
import CreateAppointmentForm from '../../appointment/forms/AppointmentForm';
import { EditCarePathway } from './EditCarePathway';
import { toast } from 'sonner';
import { PatientProfileTab } from './PatientProfileTab';
import { PatientHistoryTab } from './PatientHistoryTab';
import { TreatmentDetail } from '../History/TreatmentDetail';
import { VisitDetail } from '../History/VisitDetail';
import { AppointmentDetail } from '../History/AppointmentDetail';
import { ReferralDetail } from '../History/ReferralDetail';
import { TeleConsultDetail } from '../History/TeleConsultDetail';
import FundRequestMobile from '../../funding/forms/FundRequestForm';
import { TeleADD } from '../../../../scfc/scfc-mobile/tele-med/TeleADD';

interface PatientDetailViewProps {
    patient: any;
    onBack: () => void;
    onEdit: (id: string) => void;
    onAddMedicalRecord?: () => void;
    onRequestFund?: (patient: any) => void;
    onAction?: (action: string, data: any) => void;
    userRole?: 'cm' | 'hospital' | 'pcu' | 'scfc';
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient: propPatient, onBack, onEdit, onAddMedicalRecord, onRequestFund, onAction, userRole = 'cm' }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
    const [activeSubTab, setActiveSubTab] = useState('info');
    const [activeHistoryTab, setActiveHistoryTab] = useState('treatment');
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [isHomeVisitOpen, setIsHomeVisitOpen] = useState(false);
    const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
    const [isReferralOpen, setIsReferralOpen] = useState(false);
    const [expandedHistoryIndex, setExpandedHistoryIndex] = useState<number | null>(null);
    const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [infoData, setInfoData] = useState<any>(null);
    const [editData, setEditData] = useState<any>(null);
    const [isEditCarePathwayOpen, setIsEditCarePathwayOpen] = useState(false);
    const [isFundRequestOpen, setIsFundRequestOpen] = useState(false);
    const [isTelemedOpen, setIsTelemedOpen] = useState(false);
    
    // State for History Details
    const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
    const [selectedVisit, setSelectedVisit] = useState<any>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [selectedReferral, setSelectedReferral] = useState<any>(null);
    const [selectedTeleConsult, setSelectedTeleConsult] = useState<any>(null);
    const [editingAppointment, setEditingAppointment] = useState<any>(null);

    if (!propPatient) return null;

    // Merge with mock details for missing fields
    const patient = {
        cid: '1-5099-xxxxx-xx-x',
        dob: '01 ม.ค. 2563',
        rights: 'บัตรทอง',
        contact: {
            name: 'นางสมศรี (มารดา)',
            phone: '081-999-9999',
            address: '123 ต.สุเทพ อ.เมือง จ.เชียงใหม่'
        },
        timeline: [
            { age: 'แรกเกิด', stage: 'การให้คำปรึกษาและส่งต่อ', date: '10 ม.ค. 66', status: 'completed' },
            { age: '3 เดือน', stage: 'ผ่าตัดเย็บซ่อมริมฝีปาก', date: '15 เม.ย. 66', status: 'completed' },
            { 
                age: '9-18 เดือน', 
                stage: 'ผ่าตัดเย็บซ่อมเพดานปาก', 
                date: '20 ม.ค. 67', 
                status: 'current',
                secondary_bookings: [
                    { date: '22 ม.ค. 67', title: 'ติดตามอาการ' },
                    { date: '25 ม.ค. 67', title: 'ตัดไหม' }
                ]
            },
            { age: '2-5 ปี', stage: 'ฝึกพูดและประเมินพัฒนาการ', date: '-', status: 'pending' }
        ],
        visitHistory: [
            { date: '15 มี.ค. 67', type: 'เยี่ยมบ้าน', title: 'ติดตามอาการหลังผ่าตัด', provider: 'ทีมเยี่ยมบ้าน รพ.สต.', detail: 'แผลแห้งดี ไม่มีหนอง น้องดูดนมได้ดี ผู้ปกครองมีความเข้าใจในการดูแล' },
            { date: '01 ก.พ. 67', type: 'Tele-med', title: 'ติดตามผลเบื้องต้น', provider: 'พญ.วิไล', detail: 'แผลเริ่มแห้ง แนะนำการทำความสะอาดเพิ่มเติม' }
        ],
        appointmentHistory: [
             { date: '20 ธ.ค. 68', time: '09:00', title: 'ติดตามพัฒนาการ (Follow up)', location: 'แผนกศลยกรรม รพ.มหาราช', room: 'ห้องตรวจ1', status: 'upcoming', doctor: 'นพ.สมชาย ใจดี', note: 'เตรียมสมุดบันทึกพัฒนาการมาด้วย' },
             { date: '20 ม.ค. 67', time: '08:30', title: 'ผ่าตัดเย็บซ่อมเพดานปาก', location: 'ห้องผ่าตัด รพ.มหาราช', room: 'ห้องตรวจ1', status: 'completed', doctor: 'นพ.สมชาย ใจดี', note: '' },
             { date: '10 ม.ค. 67', time: '10:00', title: 'ตรวจประเมินก่อนผ่าตัด', location: 'OPD ศัลยกรรม', room: 'ห้องตรวจ1', status: 'completed', doctor: 'นพ.สมชาย ใจดี', note: '' }
        ],
        referralHistory: [
            { date: '10 ม.ค. 67', type: 'Referral', title: 'ส่งตัวเพื่อผ่าตัด (Refer Out)', from: 'รพ.ฝาง', to: 'รพ.มหาราช', doctor: '-', status: 'accepted' }
        ],
        teleConsultHistory: [
            { date: '15 ก.พ. 67', type: 'Tele-consult', title: 'ปรึกษาเคสผ่าตัด (Pre-op)', from: 'รพ.สต. บ้านสุเทพ', to: 'รพ.มหาราช', doctor: 'นพ.สมชาย', status: 'completed' }
        ],
        history: [
            {
                title: 'ติดตามอาการหลังผ่าตัด',
                date: '25 ก.พ. 67',
                detail: 'ติดตามผลการรักษา แผลหายดี เริ่มฝึกการกลืนและการพูดเบื้องต้น แนะนำให้ผู้ปกครองฝึกกระตุ้นพัฒนาการที่บ้านอย่างต่อเนื่อง',
                doctor: 'พญ.วิไล รักษา',
                department: 'กุมารเวชกรรม'
            },
            {
                title: 'ผ่าตัดเย็บซ่อมเพดานปาก',
                date: '20 ม.ค. 67',
                detail: 'ผู้ป่วยเข้ารับการผ่าตัดตามนัดหมาย การผ่าตัดเป็นไปด้วยความเรียบร้อย อาการหลังผ่าตัดปกติ แผลแห้งดี ไม่มีอาการติดเชื้อ พักฟื้นที่โรงพยาบาล 3 วัน',
                doctor: 'นพ.สมชาย ใจดี',
                department: 'ศัลยกรรมตกแต่ง'
            },
            {
                title: 'ตรวจประเมินก่อนผ่าตัด',
                date: '10 ม.ค. 67',
                detail: 'ตรวจร่างกายและเตรียมความพร้อมก่อนการผ่าตัด ผลเลือดและเอกซเรย์ปอดปกติ สุขภาพแข็งแรงพร้อมสำหรับการผ่าตัด',
                doctor: 'นพ.สมชาย ใจดี',
                department: 'ศัลยกรรมตกแต่ง'
            }
        ],
        nextAppointment: '12 ต.ค. 68 09:00',
        funding: [],
        diagnosis: 'Cleft Lip - left - microform',
        lastVisit: '3 มีนาคม 2567',
        ...propPatient,
        contact: propPatient.contact || {
            name: 'นางสมศรี (มารดา)',
            phone: '081-999-9999',
            address: '123 ต.สุเทพ อ.เมือง จ.เชียงใหม่'
        },
        admissionDate: propPatient.admissionDate || '28 ม.ค. 68',
        originHospital: propPatient.originHospital || 'โรงพยาบาลฝาง',
        allergyHistory: propPatient.allergyHistory || 'ปฏิเสธการแพ้ยา',
        attendingPhysician: propPatient.attendingPhysician || 'นพ.สมชาย ใจดี',
        responsibleHealthCenter: propPatient.responsibleHealthCenter || '-'
    };

    const activePatient = infoData ? { 
        ...patient, 
        ...infoData, 
        contact: { ...patient.contact, ...infoData.contact } 
    } : patient;

    // Use ReferralRequestForm as the full page view for referrals if that is the intent
    if (isReferralOpen) {
        return (
             <ReferralRequestForm 
                onClose={() => setIsReferralOpen(false)}
                initialPatient={patient}
                onSubmit={(data) => {
                    setIsReferralOpen(false);
                    // Add to global data
                    const { REFERRAL_DATA } = require('../../../../../data/patientData');
                    const newReferral = {
                        id: Date.now(),
                        patientName: data.patientData?.name || data.patient,
                        patientHn: data.patientData?.hn || "N/A",
                        hn: data.patientData?.hn || "N/A",
                        hospital: data.fromHospital,
                        destinationHospital: data.toHospital,
                        destination: data.toHospital,
                        status: "Pending",
                        type: "Refer Out",
                        referralDate: new Date().toISOString(),
                        date: new Date().toISOString().split('T')[0],
                        title: data.diagnosis || "ส่งต่อผู้ป่วย",
                        diagnosis: data.diagnosis,
                        reason: data.reason,
                        doctor: "แพทย์เจ้าของไข้",
                        image: data.patientData?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
                    };
                    REFERRAL_DATA.unshift(newReferral);
                    
                    toast.success("สร้างใบส่งตัวเรียบร้อยแล้ว");
                    
                    // Navigate to Referral Dashboard
                    if (onAction) {
                        onAction('navigate-referral', { type: 'Refer Out' });
                    }
                }}
            />
        );
    }

    if (isEditCarePathwayOpen) {
        return (
            <EditCarePathway 
                onBack={() => setIsEditCarePathwayOpen(false)}
                onSave={() => {
                    toast.success("บันทึกแผนการรักษาเรียบร้อยแล้ว");
                    setIsEditCarePathwayOpen(false);
                }}
                patient={activePatient}
            />
        );
    }

    // Render Tele-med Form (full page, like ReferralRequestForm)
    if (isTelemedOpen) {
        return (
            <TeleADD 
                onBack={() => setIsTelemedOpen(false)}
                onSave={() => {
                    setIsTelemedOpen(false);
                    toast.success("สร้างคำขอ Tele-med เรียบร้อยแล้ว");
                }}
                initialPatient={activePatient}
            />
        );
    }
    
    // Render History Detail Pages
    if (selectedTreatment) {
        return (
            <TreatmentDetail 
                treatment={selectedTreatment}
                patient={activePatient}
                onBack={() => setSelectedTreatment(null)}
            />
        );
    }
    if (selectedVisit) {
        return (
            <VisitDetail
                visit={selectedVisit}
                patient={activePatient}
                onBack={() => setSelectedVisit(null)}
            />
        );
    }
    if (selectedAppointment) {
        return (
            <AppointmentDetail
                appointment={selectedAppointment}
                patient={activePatient}
                onBack={() => setSelectedAppointment(null)}
                onReschedule={() => {
                    setEditingAppointment(selectedAppointment);
                    setSelectedAppointment(null);
                    setIsWalkInModalOpen(true);
                }}
                onCancel={() => {
                     // Create a deep copy of the patient to modify
                     const updatedPatient = JSON.parse(JSON.stringify(activePatient));
                     
                     // Filter out the appointment
                     if (updatedPatient.appointmentHistory) {
                         updatedPatient.appointmentHistory = updatedPatient.appointmentHistory.filter((a: any) => 
                            a.rawDate !== selectedAppointment.rawDate && 
                            // Fallback check if rawDate missing
                            !(a.date === selectedAppointment.date && a.title === selectedAppointment.title)
                         );
                     }
                     
                     // Propagate update via onAction
                     if (onAction) {
                         onAction('update-patient', updatedPatient);
                         toast.success("ลบนัดหมายเรียบร้อยแล้ว");
                     }
                     
                     setSelectedAppointment(null);
                }}
            />
        );
    }
    if (selectedReferral) {
        return (
            <ReferralDetail
                referral={selectedReferral}
                patient={activePatient}
                onBack={() => setSelectedReferral(null)}
            />
        );
    }
    if (selectedTeleConsult) {
        return (
            <TeleConsultDetail
                consult={selectedTeleConsult}
                patient={activePatient}
                onBack={() => setSelectedTeleConsult(null)}
            />
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden font-['IBM_Plex_Sans_Thai'] relative">
            
            {/* Header */}
            <div className="bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-20">
                <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-white text-lg font-bold">รายละเอียดผู้ป่วย</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                
                {/* Top Tabs Switcher */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-1.5 rounded-full flex w-full max-w-md shadow-inner">
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={cn(
                                "flex-1 py-2.5 rounded-full text-[16px] font-semibold transition-all duration-300",
                                activeTab === 'profile' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            ข้อมูลส่วนตัว
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                "flex-1 py-2.5 rounded-full text-[16px] font-semibold transition-all duration-300",
                                activeTab === 'history' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            ประวัติ
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                {activeTab === 'profile' ? (
                    <PatientProfileTab 
                        patient={activePatient}
                        activeSubTab={activeSubTab}
                        setActiveSubTab={setActiveSubTab}
                        isEditingInfo={isEditingInfo}
                        setIsEditingInfo={setIsEditingInfo}
                        editData={editData}
                        setEditData={setEditData}
                        setInfoData={setInfoData}
                        setIsEditCarePathwayOpen={setIsEditCarePathwayOpen}
                        setSelectedMilestone={setSelectedMilestone}
                    />
                ) : (
                    <PatientHistoryTab 
                        patient={activePatient}
                        activeHistoryTab={activeHistoryTab}
                        setActiveHistoryTab={setActiveHistoryTab}
                        expandedHistoryIndex={expandedHistoryIndex}
                        setExpandedHistoryIndex={setExpandedHistoryIndex}
                        onViewTreatmentDetail={setSelectedTreatment}
                        onViewVisitDetail={setSelectedVisit}
                        onViewAppointmentDetail={setSelectedAppointment}
                        onViewReferralDetail={setSelectedReferral}
                        onViewTeleConsultDetail={setSelectedTeleConsult}
                    />
                )}
            </div>
            
            {/* FAB Menu Overlay */}
            {isFabOpen && (
                <div className="fixed bottom-[160px] right-4 flex flex-col items-end gap-3 z-50">
                    {userRole !== 'hospital' && (
                        <button 
                            onClick={() => setIsHomeVisitOpen(true)}
                            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-medium text-sm text-[16px]">ส่งคำขอเยี่ยมบ้าน</span>
                            <div className="w-8 h-8 rounded-full bg-[#5B4D9D]/10 flex items-center justify-center text-[#5B4D9D]">
                                <Home size={16} />
                            </div>
                        </button>
                    )}
                    
                    <button 
                        onClick={() => setIsWalkInModalOpen(true)}
                        className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                        <span className="font-medium text-sm text-[16px]">เพิ่มนัดหมาย</span>
                        <div className="w-8 h-8 rounded-full bg-[#5B4D9D]/10 flex items-center justify-center text-[#5B4D9D]">
                            <CalendarPlus size={16} />
                        </div>
                    </button>

                    {/* Appointment Form Modal */}
                    {isWalkInModalOpen && (
                        <CreateAppointmentForm 
                            onClose={() => {
                                setIsWalkInModalOpen(false);
                                setEditingAppointment(null);
                            }}
                            initialPatient={editingAppointment || patient}
                            isEditMode={!!editingAppointment}
                            onSubmit={() => {
                                setIsWalkInModalOpen(false);
                                setEditingAppointment(null);
                                toast.success(editingAppointment ? "แก้ไขนัดหมายสำเร็จ" : "นัดหมายสำเร็จ");
                            }}
                        />
                    )}
                    
                    {userRole !== 'hospital' && (
                        <button 
                            onClick={() => setIsReferralOpen(true)}
                            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-medium text-sm text-[16px]">ส่งคำขอส่งตัว</span>
                            <div className="w-8 h-8 rounded-full bg-[#5B4D9D]/10 flex items-center justify-center text-[#5B4D9D]">
                                <Send size={16} />
                            </div>
                        </button>
                    )}

                    <button 
                        onClick={() => {
                            if (onAddMedicalRecord) {
                                onAddMedicalRecord();
                            } else if (onAction) {
                                onAction('add-medical-record', null);
                            }
                        }}
                        className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                        <span className="font-medium text-sm text-[16px]">เพิ่มบันทึกการรักษา</span>
                        <div className="w-8 h-8 rounded-full bg-[#5B4D9D]/10 flex items-center justify-center text-[#5B4D9D]">
                            <Stethoscope size={16} />
                        </div>
                    </button>
                    
                    {userRole !== 'hospital' && (
                        <button 
                            onClick={() => {
                                setIsFundRequestOpen(true);
                            }}
                            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-medium text-sm text-[16px]">{userRole === 'scfc' ? 'เพิ่มกองทุน' : 'ส่งคำขอทุน'}</span>
                            <div className="w-8 h-8 rounded-full bg-[#5B4D9D]/10 flex items-center justify-center text-[#5B4D9D]">
                                <FileText size={16} />
                            </div>
                        </button>
                    )}
                    
                    {userRole === 'scfc' && (
                        <button 
                            onClick={() => {
                                setIsTelemedOpen(true);
                            }}
                            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-medium text-sm text-[16px]">ส่งคำขอ Tele-med</span>
                            <div className="w-8 h-8 rounded-full bg-[#5B4D9D]/10 flex items-center justify-center text-[#5B4D9D]">
                                <Video size={16} />
                            </div>
                        </button>
                    )}
                </div>
            )}
            
            {/* Backdrop for closing menu */}
            {isFabOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                    onClick={() => setIsFabOpen(false)}
                />
            )}

            <button 
                onClick={() => setIsFabOpen(!isFabOpen)}
                className={`fixed bottom-[90px] right-4 w-12 h-12 bg-[rgb(91,77,157)] hover:bg-[#4a3e8a] text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-40 p-3 ${isFabOpen ? 'rotate-45' : ''}`}
            >
                {isFabOpen ? <Plus size={24} /> : <MessageCirclePlus />}
            </button>

            {isHomeVisitOpen && (
                <HomeVisitADD 
                    onBack={() => setIsHomeVisitOpen(false)}
                    onSubmit={(data) => {
                        // Persistence Logic
                        const now = new Date();
                        const request = {
                            id: `REQ-${Date.now()}`,
                            patientName: data.patientName,
                            patientId: data.patientId,
                            patientAddress: data.patientAddress,
                            patientImage: data.patientImage,
                            type: data.type,
                            rph: data.rph,
                            provider: data.rph,
                            requestDate: now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
                            rawDate: now.toISOString(),
                            status: 'Pending',
                            note: data.note,
                            title: 'เยี่ยมบ้านใหม่',
                            name: data.patientName,
                            hn: data.patientId,
                            date: now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
                        };

                        // Update Global Mock Data
                        HOME_VISIT_DATA.unshift({
                            ...request,
                            patientAddress: request.patientAddress || 'ไม่ระบุที่อยู่',
                        });

                        const targetPatient = PATIENTS_DATA.find(p => p.hn === request.patientId || p.id === request.patientId);
                        if (targetPatient) {
                            if (!targetPatient.visitHistory) targetPatient.visitHistory = [];
                            targetPatient.visitHistory.unshift({
                                date: request.date,
                                rawDate: request.rawDate,
                                title: request.title,
                                provider: request.provider,
                                status: request.status,
                                type: request.type
                            });
                        }

                        setIsHomeVisitOpen(false);
                        toast.success("สร้างคำขอเยี่ยมบ้านเรียบร้อยแล้ว", {
                            description: `แจ้งเตือนไปยัง ${request.rph} แล้ว`
                        });
                    }}
                    initialPatientId={patient.hn}
                    initialPatient={patient}
                />
            )}
            
            {isFundRequestOpen && (
                <FundRequestMobile 
                    patient={activePatient}
                    onClose={() => setIsFundRequestOpen(false)}
                    onSubmit={() => {
                        setIsFundRequestOpen(false);
                        toast.success(userRole === 'scfc' ? "เพิ่มกองทุนเรียบร้อยแล้ว" : "สร้างคำขอทุนเรียบร้อยแล้ว");
                    }}
                />
            )}
        </div>
    );
};