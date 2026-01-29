import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  FileText, 
  Home, 
  Users, 
  MessageCircle,
  Heart
} from 'lucide-react';
import thaiCleftLogo from 'figma:asset/12ae20be12afdbbc28ab9f595255380bf78a4390.png';

// Components
import StandardPageLayout from '../../../../components/shared/layout/StandardPageLayout';
import MobileDashboard from '../dashboard/MobileDashboard';
import PatientMobileWorkSystems from '../dashboard/PatientMobileWorkSystems'; // Was CMWorkSystems
import StaffChatList from '../chat/StaffChatList';
import NotificationPage from '../page/NotificationPage';
import UserProfileMenu from '../page/UserProfileMenu';
import AppointmentSystem from '../appointment/AppointmentSystem';
import PatientDirectory from '../patient/PatientDirectory';
import { PatientDetailView } from '../patient/detail/PatientDetailView';
import { AddMedicalRecordForm } from '../patient/detail/AddMedicalRecordForm';
import { NewPatientList } from '../page/NewPatientList';
import { NewPatientDetail } from '../page/NewPatientDetail';
import { HomeVisitSystem } from '../home-visit/HomeVisitSystem';
import { HomeVisitDetail } from '../home-visit/HomeVisitDetail';
import { FundingSystem } from '../funding/FundingSystem';
import { TeleConsultationSystem } from '../tele-med/TeleConsultationSystem';

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
  const [isChatInterfaceOpen, setIsChatInterfaceOpen] = useState(false);

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
        <div className={`fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-[24px] shadow-[0px_-6px_4px_0px_rgba(0,0,0,0.04)] border-t-2 border-[#d2cee7] flex-row items-center pb-[20px] pt-[12px] px-[12px] md:static md:w-auto md:bg-transparent md:border-none md:shadow-none md:rounded-none md:flex-col md:gap-6 md:py-4 md:px-0 md:col-span-1 md:z-auto pb-safe ${isChatInterfaceOpen ? 'hidden md:flex' : 'flex'}`}>
           <div className="hidden md:flex w-16 h-16 rounded-2xl items-center justify-center overflow-hidden mb-2">
             <img src={thaiCleftLogo} alt="Thai Cleft Link" className="w-full h-full object-contain" />
           </div>
           
           {/* Navigation Items */}
           <nav className="flex flex-row md:flex-col w-full md:w-auto md:gap-4">
             {/* Home (Dashboard) */}
             <button 
                 onClick={() => {
                     setCurrentView('dashboard');
                     setSelectedPatient(null);
                     setSelectedHistoryPatient(null);
                 }}
                 className={`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full ${
                     currentView === 'dashboard' 
                     ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                     : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
                 }`}
             >
                 <Home size={20} className="md:w-5 md:h-5" />
                 <span className={`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap ${currentView === 'dashboard' ? 'font-bold' : 'font-medium'}`}>หน้าหลัก</span>
             </button>

             {/* Appointment */}
             <button 
                onClick={() => {
                    setCurrentView('calendar');
                    setSelectedPatient(null);
                }}
                className={`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full ${
                    currentView === 'calendar' 
                    ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                    : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
                }`}
             >
                <Calendar size={20} className="md:w-5 md:h-5" />
                <span className={`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap ${currentView === 'calendar' ? 'font-bold' : 'font-medium'}`}>นัดหมาย</span>
             </button>

             {/* Support Services */}
             <button 
                onClick={() => {
                    setCurrentView('referrals');
                    setSelectedPatient(null);
                    setSelectedHistoryPatient(null);
                }}
                className={`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full ${
                    currentView === 'referrals' 
                    ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                    : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
                }`}
             >
                 <Heart size={20} className="md:w-5 md:h-5" />
                 <span className={`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap ${currentView === 'referrals' ? 'font-bold' : 'font-medium'}`}>บริการช่วยเหลือ</span>
             </button>

             {/* Chat */}
             <button 
                onClick={() => {
                    setCurrentView('chat');
                    setSelectedPatient(null);
                    setSelectedHistoryPatient(null);
                }}
                className={`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full ${
                    currentView === 'chat' 
                    ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                    : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
                }`}
             >
                 <MessageCircle size={20} className="md:w-5 md:h-5" />
                 <span className={`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap ${currentView === 'chat' ? 'font-bold' : 'font-medium'}`}>สนทนา</span>
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
            
            {/* CONDITION: View = Support Services (Mapped to 'referrals' view name) */}
            {currentView === 'referrals' && (
                <StandardPageLayout title="บริการช่วยเหลือ" bypassContentCard={true}>
                     <FundingSystem 
                         initialPatient={fundRequestPatient}
                         onBack={() => { setIsFundRequestOpen(false); setCurrentView('dashboard'); }}
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

            {/* CONDITION: View = Appointment (Mapped to 'calendar' view name) */}
            {currentView === 'calendar' && (
                <StandardPageLayout title="นัดหมาย" bypassContentCard={true}>
                     <PatientMobileWorkSystems 
                        initialHN={targetReferralHN}
                        onExitDetail={() => {
                           setTargetReferralHN(undefined);
                           setCurrentView('dashboard');
                        }}
                    />
                </StandardPageLayout>
            )}

            {/* CONDITION: View = Patients Directory (Kept for history/details if accessed via other means, though button removed from sidebar) */}
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
                        <PatientDirectory 
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
                        visit={selectedHomeVisit}
                        onBack={() => setCurrentView(returnView)}
                    />
                </StandardPageLayout>
            )}

            {/* Feature: Funding System (Also accessible via 'referrals' view now, but kept for direct link if any) */}
            {(currentView === 'funding-system' || isFundRequestOpen) && currentView !== 'referrals' ? (
                 <StandardPageLayout title="ระบบขอรับเงินทุน" onBack={() => { setIsFundRequestOpen(false); setCurrentView('dashboard'); }} bypassContentCard={true}>
                     <FundingSystem 
                         initialPatient={fundRequestPatient}
                         onBack={() => { setIsFundRequestOpen(false); setCurrentView('dashboard'); }}
                     />
                 </StandardPageLayout>
            ) : null}

            {/* Feature: Tele-med System */}
            {currentView === 'telemed-system' && (
                <StandardPageLayout title="Tele-Medicine" onBack={() => setCurrentView('dashboard')} bypassContentCard={true}>
                    <TeleConsultationSystem />
                </StandardPageLayout>
            )}

        </div>
      </div>
    </div>
  );
}