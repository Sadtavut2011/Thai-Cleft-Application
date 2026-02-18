import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
// Use shared CM components with readOnly mode
import { PatientProfileTab } from '../../../../cm/cm-mobile/patient/detail/PatientProfileTab';
import { PatientHistoryTab } from '../../../../cm/cm-mobile/patient/detail/PatientHistoryTab';
import { TreatmentDetail } from '../History/TreatmentDetail';
import { VisitDetail } from '../History/VisitDetail';
import { AppointmentDetail } from '../History/AppointmentDetail';
import { ReferralDetail } from '../History/ReferralDetail';
import { TeleConsultDetail } from '../History/TeleConsultDetail';

interface PatientDetailViewProps {
    patient: any;
    onBack: () => void;
    onEdit?: (id: string) => void;
    onAddMedicalRecord?: () => void;
    onRequestFund?: (patient: any) => void;
    onAction?: (action: string, data: any) => void;
    readOnly?: boolean;
    initialTab?: 'profile' | 'history';
    initialSubTab?: string;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ 
    patient: propPatient, 
    onBack, 
    readOnly = true,  // Default to read-only for Patient role
    initialTab = 'profile',
    initialSubTab = 'info'
}) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'history'>(initialTab);
    const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
    const [activeHistoryTab, setActiveHistoryTab] = useState('treatment');
    const [expandedHistoryIndex, setExpandedHistoryIndex] = useState<number | null>(null);

    // Sync with props when navigating from quick menu
    useEffect(() => {
        setActiveTab(initialTab);
        setActiveSubTab(initialSubTab);
    }, [initialTab, initialSubTab]);
    
    // State for History Details (view-only navigation)
    const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
    const [selectedVisit, setSelectedVisit] = useState<any>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [selectedReferral, setSelectedReferral] = useState<any>(null);
    const [selectedTeleConsult, setSelectedTeleConsult] = useState<any>(null);

    if (!propPatient) return null;

    // Merge with mock details for missing fields
    const patient = {
        cid: '1100100200301',
        dob: '15 พ.ย. 2566',
        rights: 'บัตรทอง (UC)',
        contact: {
            name: 'นายสมบูรณ์ ใจดี (บิดา)',
            phone: '081-234-5678',
            address: '123/4 ม.5 ซ.สุขสวัสดิ์ 3 ถ.เชียงใหม่-ฝาง ต.ริมใต้ อ.แม่ริม จ.เชียงใหม่ 50180',
            relationship: 'บิดา'
        },
        timeline: [
            { age: '3 เดือน', stage: 'ผ่าตัดเย็บปากแหว่ง (Cheiloplasty)', date: '15 ก.พ. 67', status: 'completed' },
            { age: '9-18 เดือน', stage: 'ผ่าตัดเย็บเพดานโหว่ (Palatoplasty)', date: '15 มิ.ย. 67', status: 'completed' },
            { age: '2 ปี', stage: 'ฝึกพูด (Speech Therapy)', date: '15 พ.ย. 68', status: 'completed' }
        ],
        visitHistory: [
            { date: '10 มี.ค. 67', type: 'เยี่ยมบ้าน', title: 'ติดตามอาการหลังผ่าตัด', provider: 'รพ.สต.ริมใต้', detail: 'แผลผ่าตัดแห้งดี ทานนมได้ปกติ' },
        ],
        appointmentHistory: [
             { date: '4 ธ.ค. 68', time: '09:00', title: 'ติดตามอาการ', location: 'รพ.มหาราชนครเชียงใหม่, อาคารผู้ป่วยนอก', room: 'ห้องตรวจ1', status: 'upcoming', doctor: 'นพ.วิชัย เกียรติเกรียงไกร', note: '' },
             { date: '15 พ.ย. 68', time: '10:00', title: 'ฝึกพูด (Speech Therapy)', location: 'รพ.มหาราชนครเชียงใหม่, คลินิกฝึกพูด', room: 'ห้องตรวจ1', status: 'completed', doctor: 'นักแก้ไขการพูด สมศรี', note: '' },
             { date: '15 มิ.ย. 67', time: '09:00', title: 'ผ่าตัดเย็บเพดานโหว่ (Palatoplasty)', location: 'รพ.มหาราชนครเชียงใหม่, ตึกศัลยกรรมชั้น 3', room: 'ห้องตรวจ1', status: 'completed', doctor: 'นพ.สมศักดิ์ รักงาน', note: '' },
             { date: '15 ก.พ. 67', time: '09:00', title: 'ผ่าตัดเย็บปากแหว่ง (Cheiloplasty)', location: 'รพ.มหาราชนครเชียงใหม่, ตึกศัลยกรรมชั้น 3', room: 'ห้องตรวจ1', status: 'completed', doctor: 'นพ.วิชัย เกียรติเกรียงไกร', note: '' }
        ],
        referralHistory: [
            { date: '1 ธ.ค. 66', type: 'Referral', title: 'ส่งตัวรักษาเฉพาะทางครั้งแรก', from: 'รพ.สต.ริมใต้', to: 'รพ.มหาราชนครเชียงใหม่', doctor: 'นพ.วิชัย เกียรติเกรียงไกร', status: 'accepted' }
        ],
        teleConsultHistory: [],
        history: [
            {
                title: 'ฝึกพูด (Speech Therapy)',
                date: '15 พ.ย. 68',
                detail: 'ผู้ป่วยเข้ารับการฝึกพูดตามแผนการรักษา ผลการฝึกอยู่ในเกณฑ์ดี',
                doctor: 'นักแก้ไขการพูด สมศรี',
                department: 'คลินิกฝึกพูด'
            },
            {
                title: 'ผ่าตัดเย็บเพดานโหว่ (Palatoplasty)',
                date: '15 มิ.ย. 67',
                detail: 'ผู้ป่วยเข้ารับการผ่าตัดเย็บเพดานโหว่ตามนัดหมาย การผ่าตัดเป็นไปด้วยความเรียบร้อย',
                doctor: 'นพ.สมศักดิ์ รักงาน',
                department: 'ศัลยกรรม'
            },
            {
                title: 'ผ่าตัดเย็บปากแหว่ง (Cheiloplasty)',
                date: '15 ก.พ. 67',
                detail: 'ผู้ป่วยเข้ารับการผ่าตัดเย็บปากแหว่งตามนัดหมาย การผ่าตัดเป็นไปด้วยความเรียบร้อย แผลแห้งดี',
                doctor: 'นพ.วิชัย เกียรติเกรียงไกร',
                department: 'ศัลยกรรมตกแต่ง'
            }
        ],
        nextAppointment: '4 ธ.ค. 68 09:00',
        funding: [
            { type: 'กองทุนมูลนิธิตะวันยิ้ม', status: 'approved', date: '10 ม.ค. 67', amount: 15000 },
            { type: 'กองทุนช่วยเหลือฉุกเฉิน', status: 'pending', date: '1 ก.พ. 67', amount: 5000 }
        ],
        diagnosis: 'Cleft Lip and Palate',
        lastVisit: '10 มีนาคม 2567',
        ...propPatient,
        contact: propPatient.contact || {
            name: 'นายสมบูรณ์ ใจดี (บิดา)',
            phone: '081-234-5678',
            address: '123/4 ม.5 ซ.สุขสวัส���ิ์ 3 ถ.เชียงใหม่-ฝาง ต.ริมใต้ อ.แม่ริม จ.เชียงใหม่ 50180'
        },
        admissionDate: propPatient.admissionDate || '1 ธ.ค. 66',
        originHospital: propPatient.originHospital || 'โรงพยาบาลฝาง',
        allergyHistory: propPatient.allergyHistory || 'ไม่มี',
        attendingPhysician: propPatient.attendingPhysician || 'นพ.วิชัย เกียรติเกรียงไกร',
        responsibleHealthCenter: propPatient.responsibleHealthCenter || '-'
    };

    // Render History Detail Pages (view-only)
    if (selectedTreatment) {
        return (
            <TreatmentDetail 
                treatment={selectedTreatment}
                patient={patient}
                onBack={() => setSelectedTreatment(null)}
            />
        );
    }
    if (selectedVisit) {
        return (
            <VisitDetail
                visit={selectedVisit}
                patient={patient}
                onBack={() => setSelectedVisit(null)}
            />
        );
    }
    if (selectedAppointment) {
        return (
            <AppointmentDetail
                appointment={selectedAppointment}
                patient={patient}
                onBack={() => setSelectedAppointment(null)}
            />
        );
    }
    if (selectedReferral) {
        return (
            <ReferralDetail
                referral={selectedReferral}
                patient={patient}
                onBack={() => setSelectedReferral(null)}
            />
        );
    }
    if (selectedTeleConsult) {
        return (
            <TeleConsultDetail
                consult={selectedTeleConsult}
                patient={patient}
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
                <h1 className="text-white text-lg font-bold">ข้อมูลของฉัน</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                
                {/* Top Tabs Switcher */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-1.5 rounded-full flex w-full max-w-md shadow-inner">
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={cn(
                                "flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                                activeTab === 'profile' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Profile
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={cn(
                                "flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300",
                                activeTab === 'history' ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            History
                        </button>
                    </div>
                </div>

                {/* Main Content — readOnly mode: no editing/FAB */}
                {activeTab === 'profile' ? (
                    <PatientProfileTab 
                        patient={patient}
                        activeSubTab={activeSubTab}
                        setActiveSubTab={setActiveSubTab}
                        isEditingInfo={false}
                        setIsEditingInfo={() => {}}
                        editData={null}
                        setEditData={() => {}}
                        setInfoData={() => {}}
                        setIsEditCarePathwayOpen={() => {}}
                        setSelectedMilestone={() => {}}
                        readOnly={true}
                    />
                ) : (
                    <PatientHistoryTab 
                        patient={patient}
                        activeHistoryTab={activeHistoryTab}
                        setActiveHistoryTab={setActiveHistoryTab}
                        expandedHistoryIndex={expandedHistoryIndex}
                        setExpandedHistoryIndex={setExpandedHistoryIndex}
                        onViewTreatmentDetail={setSelectedTreatment}
                        onViewVisitDetail={setSelectedVisit}
                        onViewAppointmentDetail={setSelectedAppointment}
                        onViewReferralDetail={setSelectedReferral}
                        onViewTeleConsultDetail={setSelectedTeleConsult}
                        readOnly={true}
                    />
                )}
            </div>
            
            {/* NO FAB Menu — Patient role is read-only */}
        </div>
    );
};