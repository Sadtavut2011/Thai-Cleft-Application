import React, { useState } from 'react';
import { 
  Calendar, 
  FileText, 
  Home, 
  Users, 
  MessageCircle,
  Video
} from 'lucide-react';

// Components
import StandardPageLayout from '../../../../components/shared/layout/StandardPageLayout';

// Hospital Mobile Specific Components
import MobileDashboard from '../dashboard/MobileDashboard';
import HospitalMobileWorkSystems from '../dashboard/HospitalMobileWorkSystems';

// Reusing CM components for now (as placeholders until fully cloned)
import StaffChatList from '../../../cm/cm-mobile/chat/StaffChatList';
import NotificationPage from '../../../cm/cm-mobile/page/NotificationPage';
import UserProfileMenu from '../page/UserProfileMenu';
import AppointmentSystem from '../../../cm/cm-mobile/appointment/AppointmentSystem';
import PatientDirectory from '../../../cm/cm-mobile/patient/PatientDirectory';
import { PatientDetailView } from '../../../cm/cm-mobile/patient/detail/PatientDetailView';
import { AddMedicalRecordForm } from '../../../cm/cm-mobile/patient/detail/AddMedicalRecordForm';
import { NewPatientList } from '../../../cm/cm-mobile/page/NewPatientList';
import { NewPatientDetail } from '../../../cm/cm-mobile/page/NewPatientDetail';
import { HomeVisitSystem } from '../../../cm/cm-mobile/home-visit/HomeVisitSystem';
import { HomeVisitDetail } from '../../../cm/cm-mobile/home-visit/HomeVisitDetail';
import { HomeVisitForm } from '../../../cm/cm-mobile/home-visit/forms/HomeVisitForm';
import { FundingSystem } from '../../../cm/cm-mobile/funding/FundingSystem';
import { TeleConsultationSystem } from '../../../cm/cm-mobile/tele-med/TeleConsultationSystem';
import ConfirmModal from '../../../../components/shared/ConfirmModal';

// Hook
import { useCMData } from '../../../../hooks/useCMData';
import { useRole } from '../../../../context/RoleContext';

export default function MobileLayout() {
  const { currentRole } = useRole();
  const { allPatients } = useCMData();
  
  // Use local state for patients to support deletion/editing demo
  const [patients, setPatients] = useState(allPatients);
  
  // State for View Navigation
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [selectedHistoryPatient, setSelectedHistoryPatient] = useState<any>(null);  
  const [returnView, setReturnView] = useState('patients');
  
  const [isFundRequestOpen, setIsFundRequestOpen] = useState(false);
  const [fundRequestPatient, setFundRequestPatient] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedHomeVisit, setSelectedHomeVisit] = useState<any>(null);
  const [selectedNewPatient, setSelectedNewPatient] = useState(null);
  const [targetReferralHN, setTargetReferralHN] = useState<string | undefined>(undefined);
  const [targetHomeVisitSearch, setTargetHomeVisitSearch] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleDeletePatient = (id: any) => {
    if (window.confirm('คุณต้องการลบข้อมูลผู้ป่วยนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      setPatients(prev => prev.filter(p => p.id !== id));
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
      } else if (system === 'home-visit-form') {
          setSelectedHomeVisit(data);
          setReturnView('calendar');
          setCurrentView('home-visit-form');
      } else if (system === 'add-medical-record') {
          setSelectedAppointment(data);
          setReturnView('calendar');
          setCurrentView('add-medical-record');
      }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-0 text-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col h-screen">
        {/* Sidebar Navigation - Mobile Bottom Bar */}
        <div className={`fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-[24px] shadow-[0px_-6px_4px_0px_rgba(0,0,0,0.04)] border-t-2 border-[#d2cee7] flex-row items-center pb-[20px] pt-[12px] px-[12px] ${['add-medical-record', 'home-visit-form'].includes(currentView) ? 'hidden' : 'flex'}`}>
           
           <nav className="flex flex-row w-full gap-4">
             {/* Home (Dashboard) */}
             <button 
                 onClick={() => {
                     setCurrentView('dashboard');
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
        <div className={`transition-all duration-500 ease-in-out flex flex-col h-full w-full ${currentView === 'dashboard' ? 'overflow-hidden pb-0' : (['add-medical-record', 'home-visit-form'].includes(currentView) ? 'overflow-y-auto pb-0' : 'overflow-y-auto pb-20')}`}>
            {/* CONDITION: View = Dashboard */}
            {currentView === 'dashboard' && (
                <div className="h-full w-full relative">
                    <MobileDashboard 
                        onRegisterPatient={() => {
                            setCurrentView('registration');
                        }}
                        onProfileClick={() => setCurrentView('avatar')}
                        onNotificationClick={() => setCurrentView('notification')}
                        onReportNewPatient={() => setCurrentView('new-patient-report')}
                    />
                </div>
            )}
            
            {/* CONDITION: View = My Work (Referrals) */}
            {currentView === 'referrals' && (
                <StandardPageLayout title="งานของฉัน" bypassContentCard={true}>
                    <HospitalMobileWorkSystems 
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
                         onNavigateToSystem={handleNavigateToSystem}
                         hiddenScopes={['refer', 'homevisit']}
                         patients={patients}
                         onUpdatePatient={(updatedPatient: any) => {
                             setPatients(prev => {
                                 const exists = prev.some(p => String(p.id) === String(updatedPatient.id));
                                 if (exists) {
                                     return prev.map(p => String(p.id) === String(updatedPatient.id) ? updatedPatient : p);
                                 } else {
                                     return [...prev, updatedPatient];
                                 }
                             });
                         }}
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
                            userRole="hospital"
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
                                }
                            }}
                        />
                    ) : (
                        <PatientDirectory 
                            patients={patients} 
                            onSelectPatient={setSelectedHistoryPatient}
                            onAddPatient={() => { 
                                setCurrentView('registration');
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

            {/* Feature: Home Visit Form */}
            {currentView === 'home-visit-form' && (
                <div className="h-full w-full bg-white z-[200]">
                    <HomeVisitForm 
                        onBack={() => setCurrentView(returnView)}
                        initialPatientId={selectedHomeVisit?.hn}
                        patientName={selectedHomeVisit?.name || selectedHomeVisit?.patientName}
                        initialData={{
                            visitDate: selectedHomeVisit?.date ? (() => { try { const d = new Date(selectedHomeVisit.date); return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]; } catch { return ''; } })() : '',
                            visitType: ['Delegated', 'ฝากเยี่ยม'].includes(selectedHomeVisit?.type) ? 'delegated' : 'joint'
                        }}
                        onSave={(data) => {
                            // Update patient status to completed
                            if (selectedHomeVisit) {
                                setPatients(prev => prev.map(p => {
                                    if (p.id === selectedHomeVisit.id || p.hn === selectedHomeVisit.hn) {
                                        return { ...p, status: 'completed' };
                                    }
                                    return p;
                                }));
                            }
                            setCurrentView(returnView);
                        }}
                    />
                </div>
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

            {/* Feature: Funding System */}
            {currentView === 'funding-system' || isFundRequestOpen ? (
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

            {/* Success/Completed Modal */}
            <ConfirmModal 
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                appointment={patients.find((p: any) => selectedAppointment && p.id === selectedAppointment.id) || selectedAppointment}
                role={currentRole}
                onReschedule={() => setIsSuccessModalOpen(false)}
                onRequestRefer={() => {
                     if (selectedAppointment) {
                         setTargetReferralHN(selectedAppointment.hn);
                         setCurrentView('referrals');
                     }
                     setIsSuccessModalOpen(false);
                }}
            />
        </div>
      </div>
    </div>
  );
}