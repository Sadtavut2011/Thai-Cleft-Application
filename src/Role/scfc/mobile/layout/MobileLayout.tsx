import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  FileText, 
  Home, 
  Users, 
  MessageCircle,
} from 'lucide-react';

// Components
import StandardPageLayout from '../../../../components/shared/layout/StandardPageLayout';
import MobileDashboard from '../dashboard/MobileDashboard';
import SCFCWorkSystems from '../dashboard/SCFCWorkSystems'; 
import StaffChatList from '../../../cm/cm-mobile/chat/StaffChatList';
import NotificationPage from '../../../cm/cm-mobile/page/NotificationPage';
import UserProfileMenu from '../../../cm/cm-mobile/page/UserProfileMenu';
import { AppointmentSystem } from '../appointment/AppointmentSystem';
import PatientSystems from '../patient/PatientSystems';
import { PatientDetailView } from '../../../cm/cm-mobile/patient/detail/PatientDetailView';
import { AddMedicalRecordForm } from '../../../cm/cm-mobile/patient/detail/AddMedicalRecordForm';
import { NewPatientList } from '../../../cm/cm-mobile/page/NewPatientList';
import { NewPatientDetail } from '../../../cm/cm-mobile/page/NewPatientDetail';
import { HomeVisitSystem } from '../home-visit/HomeVisitSystem';
import { HomeVisitDetail } from '../home-visit/HomeVisitDetail';
import FundSystem from '../funding/FundSystem';
import TeleConsultationSystem from '../tele-med/TeleConsultationSystem';

// Hook
import { useCMData } from '../../../../hooks/useCMData';
import { useRole } from '../../../../context/RoleContext';

export default function MobileLayout() {
  const { currentRole } = useRole();
  const { allPatients, todayDateObj } = useCMData();
  
  // Use local state for patients to support deletion/editing demo
  const [patients, setPatients] = useState(allPatients);
  
  // State for View Navigation
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedHistoryPatient, setSelectedHistoryPatient] = useState<any>(null); 
  const [returnView, setReturnView] = useState('patients');
  
  const [isFundRequestOpen, setIsFundRequestOpen] = useState(false);
  const [fundRequestPatient, setFundRequestPatient] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedHomeVisit, setSelectedHomeVisit] = useState<any>(null);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [targetReferralHN, setTargetReferralHN] = useState<string | undefined>(undefined);
  const [targetHomeVisitSearch, setTargetHomeVisitSearch] = useState('');
  const [selectedNewPatient, setSelectedNewPatient] = useState(null);

  const handleDeletePatient = (id: any) => {
    if (window.confirm('คุณต้องการลบข้อมูลผู้ป่วยนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      setPatients(prev => prev.filter(p => p.id !== id));
      setSelectedPatient(null);
    }
  };

  const handleNavigateToSystem = (system: string, data?: any) => {
      if (system === 'telemed-system') {
          setCurrentView('telemed-system');
      } else if (system === 'home-visit-detail') {
          setSelectedHomeVisit(data);
          setReturnView('calendar');
          setCurrentView('home-visit-detail');
      } else if (system === 'referrals') {
          setTargetReferralHN(data.hn);
          setCurrentView('referrals');
      }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-0 text-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col h-screen">
        {/* Sidebar Navigation - Mobile Bottom Bar */}
        <div className={`fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-[24px] shadow-[0px_-6px_4px_0px_rgba(0,0,0,0.04)] border-t-2 border-[#d2cee7] flex-row items-center pb-[20px] pt-[12px] px-[12px] flex`}>
           
           <nav className="flex flex-row w-full gap-4">
             {/* Home (Dashboard) */}
             <button 
                 onClick={() => {
                     setCurrentView('dashboard');
                     setSelectedPatient(null);
                     setSelectedHistoryPatient(null);
                 }}
                 className={`flex-1 flex flex-col items-center gap-[8px] p-0 rounded-xl transition-all ${
                     currentView === 'dashboard' 
                     ? 'text-[#49358e]' 
                     : 'text-[#b8aeea]'
                 }`}
             >
                 <Home size={20} />
                 <span className={`text-[12px] leading-[1.5] whitespace-nowrap ${currentView === 'dashboard' ? 'font-bold' : 'font-medium'}`}>หน้าหลัก</span>
             </button>

             {/* Patients */}
             <button 
                onClick={() => {
                    setCurrentView('patients');
                    setSelectedPatient(null);
                }}
                className={`flex-1 flex flex-col items-center gap-[8px] p-0 rounded-xl transition-all ${
                    currentView === 'patients' 
                    ? 'text-[#49358e]' 
                    : 'text-[#b8aeea]'
                }`}
             >
                <Users size={20} />
                <span className={`text-[12px] leading-[1.5] whitespace-nowrap ${currentView === 'patients' ? 'font-bold' : 'font-medium'}`}>ผู้ป่วย</span>
             </button>

             {/* My Work */}
             <button 
                onClick={() => {
                    setCurrentView('referrals');
                    setSelectedPatient(null);
                    setSelectedHistoryPatient(null);
                    setTargetReferralHN(undefined);
                }}
                className={`flex-1 flex flex-col items-center gap-[8px] p-0 rounded-xl transition-all ${
                    currentView === 'referrals' 
                    ? 'text-[#49358e]' 
                    : 'text-[#b8aeea]'
                }`}
             >
                 <FileText size={20} />
                 <span className={`text-[12px] leading-[1.5] whitespace-nowrap ${currentView === 'referrals' ? 'font-bold' : 'font-medium'}`}>งานของฉัน</span>
             </button>

             {/* Appointments (renamed to Calendar) */}
             <button 
                 onClick={() => {
                     setCurrentView('calendar');
                     setSelectedPatient(null);
                     setSelectedHistoryPatient(null);
                 }}
                 className={`flex-1 flex flex-col items-center gap-[8px] p-0 rounded-xl transition-all ${
                     currentView === 'calendar' 
                     ? 'text-[#49358e]' 
                     : 'text-[#b8aeea]'
                 }`}
             >
                 <Calendar size={20} />
                 <span className={`text-[12px] leading-[1.5] whitespace-nowrap ${currentView === 'calendar' ? 'font-bold' : 'font-medium'}`}>ปฏิทิน</span>
             </button>

             {/* Chat */}
             <button 
                onClick={() => {
                    setCurrentView('chat');
                    setSelectedPatient(null);
                    setSelectedHistoryPatient(null);
                }}
                className={`flex-1 flex flex-col items-center gap-[8px] p-0 rounded-xl transition-all ${
                     currentView === 'chat' 
                     ? 'text-[#49358e]' 
                     : 'text-[#b8aeea]'
                }`}
             >
                 <MessageCircle size={20} />
                 <span className={`text-[12px] leading-[1.5] whitespace-nowrap ${currentView === 'chat' ? 'font-bold' : 'font-medium'}`}>สนทนา</span>
             </button>
           </nav>
        </div>

        {/* Content Area */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col h-full w-full overflow-y-auto pb-20`}>
            {/* CONDITION: View = Dashboard */}
            {currentView === 'dashboard' && (
                <StandardPageLayout title="ภาพรวม" bypassContentCard={true}>
                    <MobileDashboard 
                        patients={patients}
                        onRegisterPatient={() => {
                            setCurrentView('registration');
                            setRegistrationStep(1);
                        }}
                        onEditPatient={(patient: any) => {
                            setSelectedHistoryPatient(patient);
                            setCurrentView('patients');
                        }}
                        onDeletePatient={handleDeletePatient}
                        onProfileClick={() => setCurrentView('avatar')}
                        onNotificationClick={() => setCurrentView('notification')}
                        onReportNewPatient={() => setCurrentView('new-patient-report')}
                    />
                </StandardPageLayout>
            )}
            
            {/* CONDITION: View = My Work (Referrals) */}
            {currentView === 'referrals' && (
                <StandardPageLayout title="งานของฉัน" bypassContentCard={true}>
                    <SCFCWorkSystems 
                        initialHN={targetReferralHN}
                        onExitDetail={() => {
                           setTargetReferralHN(undefined);
                           setCurrentView('dashboard');
                        }}
                    />
                </StandardPageLayout>
            )}

            {/* CONDITION: View = Chat */}
            {currentView === 'chat' && (
                 <StandardPageLayout title="สนทนา" onBack={() => setCurrentView('dashboard')} bypassContentCard={true}>
                     <StaffChatList />
                 </StandardPageLayout>
            )}

            {/* CONDITION: View = Notification */}
            {currentView === 'notification' && (
                 <StandardPageLayout title="การแจ้งเตือน" onBack={() => setCurrentView('dashboard')} bypassContentCard={true}>
                     <NotificationPage onBack={() => setCurrentView('dashboard')} />
                 </StandardPageLayout>
            )}

            {/* CONDITION: View = Avatar / Profile */}
            {currentView === 'avatar' && (
                 <StandardPageLayout title="จัดการบัญชี" onBack={() => setCurrentView('dashboard')} bypassContentCard={true}>
                     <UserProfileMenu onBack={() => setCurrentView('dashboard')} />
                 </StandardPageLayout>
            )}

            {/* CONDITION: View = Appointment System */}
            {currentView === 'calendar' && (
                <StandardPageLayout title="ปฏิทิน" bypassContentCard={true}>
                    <AppointmentSystem 
                         // Pass a back handler if needed by internal logic
                         onBack={() => setCurrentView('dashboard')}
                    />
                </StandardPageLayout>
            )}

            {/* CONDITION: View = Patients Directory */}
            {currentView === 'patients' && (
                <StandardPageLayout 
                    title="ผู้ป่วย" 
                    bypassContentCard={true}
                    onBack={selectedHistoryPatient ? () => setSelectedHistoryPatient(null) : undefined}
                >
                    {selectedHistoryPatient ? (
                        <PatientDetailView 
                            patient={selectedHistoryPatient} 
                            onBack={() => setSelectedHistoryPatient(null)} 
                            onAddMedicalRecord={() => {
                                setReturnView('patients');
                                setCurrentView('add-medical-record');
                            }}
                            onRequestFund={(patient) => {
                                setFundRequestPatient(patient);
                                setIsFundRequestOpen(true);
                            }}
                            onAction={(action: string, data: any) => {
                                if (action === 'add-medical-record') {
                                    setReturnView('patients');
                                    setCurrentView('add-medical-record');
                                } else if (action === 'home-visit') {
                                    setTargetHomeVisitSearch(data.hn || data.name);
                                    setCurrentView('home-visit-system');
                                } else if (action === 'referral') {
                                     setTargetReferralHN(data.hn);
                                     setCurrentView('referrals');
                                } else if (action === 'request-fund') {
                                     setFundRequestPatient(data);
                                     setIsFundRequestOpen(true);
                                } else if (action === 'edit') {
                                     setEditingPatient(data);
                                     setIsEditPatientModalOpen(true);
                                }
                            }}
                        />
                    ) : (
                        <PatientSystems 
                            patients={patients} 
                            onSelectPatient={setSelectedHistoryPatient}
                            onAddPatient={() => { 
                                setCurrentView('registration');
                                setRegistrationStep(1);
                            }}
                        />
                    )}
                </StandardPageLayout>
            )}

            {/* CONDITION: View = Add Medical Record */}
            {currentView === 'add-medical-record' && (
                <StandardPageLayout 
                    title="เพิ่มบันทึกการรักษา" 
                    bypassContentCard={true}
                    onBack={() => setCurrentView(returnView)}
                >
                    <div className="h-full w-full">
                        <AddMedicalRecordForm 
                            onBack={() => setCurrentView(returnView)}
                            onSave={() => {
                                if (selectedAppointment) {
                                    setPatients(prev => prev.map(p => 
                                        p.id === selectedAppointment.id ? { ...p, status: 'completed' } : p
                                    ));
                                }
                                setCurrentView('calendar');
                                setIsSuccessModalOpen(true);
                            }}
                        />
                    </div>
                </StandardPageLayout>
            )}
            
            {/* New Patient Report */}
            {currentView === 'new-patient-report' && (
                <div className="h-full w-full bg-slate-50">
                    <NewPatientList 
                        onBack={() => setCurrentView('dashboard')}
                        onSubmit={(data: any) => {
                            setSelectedNewPatient(data);
                            setCurrentView('case-manager-notify');
                        }}
                    />
                </div>
            )}

            {/* Feature: Case Manager Notify (New Patient Detail) */}
            {currentView === 'case-manager-notify' && selectedNewPatient && (
                <div className="h-full w-full bg-slate-50">
                    <NewPatientDetail 
                        patient={selectedNewPatient}
                        onBack={() => setCurrentView('new-patient-report')}
                        onSubmit={() => {
                            // Handle submission logic here (e.g., save to DB)
                            // For now, go back to dashboard or show success
                            setCurrentView('dashboard');
                        }}
                    />
                </div>
            )}

            {/* Feature: Home Visit System */}
            {currentView === 'home-visit-system' && (
                <StandardPageLayout title="ระบบเยี่ยมบ้าน" onBack={() => setCurrentView('dashboard')} bypassContentCard={true}>
                    <HomeVisitSystem 
                        initialSearch={targetHomeVisitSearch} 
                        onViewDetail={(visit) => {
                            setSelectedHomeVisit(visit);
                            setReturnView('home-visit-system');
                            setCurrentView('home-visit-detail');
                        }}
                    />
                </StandardPageLayout>
            )}

            {/* Feature: Home Visit Detail */}
            {currentView === 'home-visit-detail' && selectedHomeVisit && (
                <StandardPageLayout title="รายละเอียดการเยี่ยมบ้าน" onBack={() => setCurrentView(returnView)} bypassContentCard={true}>
                    <HomeVisitDetail 
                        request={selectedHomeVisit} // Fixed prop name to match HomeVisitDetail component
                        onBack={() => setCurrentView(returnView)}
                    />
                </StandardPageLayout>
            )}

            {/* Feature: Funding System */}
            {currentView === 'funding-system' || isFundRequestOpen ? (
                 <StandardPageLayout title="ระบบขอรับเงินทุน" onBack={() => { setIsFundRequestOpen(false); setCurrentView('dashboard'); }} bypassContentCard={true}>
                     <FundSystem 
                         // initialPatient={fundRequestPatient} // Note: FundSystem might not accept initialPatient yet, check props
                         onBack={() => { setIsFundRequestOpen(false); setCurrentView('dashboard'); }}
                     />
                 </StandardPageLayout>
            ) : null}

            {/* Feature: Tele-med System */}
            {currentView === 'telemed-system' && (
                <StandardPageLayout title="Tele-Medicine" onBack={() => setCurrentView('dashboard')} bypassContentCard={true}>
                    <TeleConsultationSystem 
                        onBack={() => setCurrentView('dashboard')}
                    />
                </StandardPageLayout>
            )}

        </div>
      </div>
    </div>
  );
}
