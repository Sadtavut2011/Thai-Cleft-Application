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
import CMWorkSystems from '../dashboard/CMWorkSystems'; // This is "My Work"
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
import { VisitDetail } from '../patient/History/VisitDetail';
import { HomeVisitForm } from '../home-visit/forms/HomeVisitForm';
import { FundingSystem } from '../funding/FundingSystem';
import { TeleConsultationSystem } from '../tele-med/TeleConsultationSystem';
import ConfirmModal from '../../../../components/shared/ConfirmModal';
import { REFERRAL_DATA, HOME_VISIT_DATA } from '../../../../../data/patientData';

// Hook
import { useCMData } from '../../../../hooks/useCMData';
import { useRole } from '../../../../context/RoleContext';
import { toast } from 'sonner@2.0.3';

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

  // Derived state to ensure PatientDetailView always gets fresh data
  const activePatientDetail = useMemo(() => {
      if (!selectedHistoryPatient) return null;
      return patients.find(p => p.id === selectedHistoryPatient.id) || selectedHistoryPatient;
  }, [patients, selectedHistoryPatient]);

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
      } else if (system === 'home-visit-form') {
          setSelectedHomeVisit(data);
          setReturnView('calendar');
          setCurrentView('home-visit-form');
      } else if (system === 'add-medical-record') {
          setSelectedAppointment(data);
          setReturnView('calendar');
          setCurrentView('add-medical-record');
      } else if (system === 'patient-detail') {
          const patient = patients.find(p => String(p.id) === String(data.patientId) || p.hn === data.hn);
          if (patient) {
              setSelectedHistoryPatient(patient);
              setReturnView(data.returnTo || 'patients');
              setCurrentView('patients');
          }
      }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-0 text-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col h-screen">
        {/* Sidebar Navigation - Mobile Bottom Bar */}
        <div className={`mobile-bottom-nav fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-[24px] shadow-[0px_-6px_4px_0px_rgba(0,0,0,0.04)] border-t-2 border-[#d2cee7] flex-row items-center pb-[20px] pt-[12px] px-[12px] ${currentView === 'add-medical-record' || currentView === 'appointment-form' || currentView === 'home-visit-add' ? 'hidden' : 'flex'}`}>
           
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
        <div className={`transition-all duration-500 ease-in-out flex flex-col h-full w-full overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
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
                    <CMWorkSystems 
                        initialHN={targetReferralHN}
                        onExitDetail={() => {
                           setTargetReferralHN(undefined);
                           setCurrentView('dashboard');
                        }}
                        onNavigateToPatient={(hn) => {
                           const patient = patients.find(p => p.hn === hn);
                           if (patient) {
                               setSelectedHistoryPatient(patient);
                               setCurrentView('patients');
                           }
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
                    {activePatientDetail ? (
                        <PatientDetailView 
                            patient={activePatientDetail} 
                            onBack={() => setSelectedHistoryPatient(null)} 
                            onAddMedicalRecord={() => {
                                setSelectedAppointment(null);
                                setReturnView('patients');
                                setCurrentView('add-medical-record');
                            }}
                            onRequestFund={(patient) => {
                                setFundRequestPatient(patient);
                                setIsFundRequestOpen(true);
                            }}
                            onAction={(action: string, data: any) => {
                                if (action === 'add-medical-record') {
                                    setSelectedAppointment(null);
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
                                } else if (action === 'update-patient') {
                                     setPatients(prev => prev.map(p => p.id === data.id ? data : p));
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
                            patient={
                                (selectedHistoryPatient ? patients.find(p => p.id === selectedHistoryPatient.id) : null)
                                || patients.find(p => 
                                    selectedAppointment && (String(p.id) === String(selectedAppointment.patientId) || p.hn === selectedAppointment.hn)
                                )
                            }
                            initialAppointment={selectedAppointment || undefined}
                            onSave={(saveData?: any) => {
                                // Determine the appointment to sync: from ConfirmModal path OR from timeline selection
                                const apptToSync = selectedAppointment || saveData?._selectedAppointment;
                                
                                if (apptToSync) {
                                    // Find the patient to update
                                    const targetPatientId = apptToSync.patientId || apptToSync.id;
                                    const targetPatientHn = apptToSync.hn;
                                    const targetPatient = selectedHistoryPatient || patients.find(p => 
                                        String(p.id) === String(targetPatientId) || p.hn === targetPatientHn
                                    );

                                    if (targetPatient) {
                                        setPatients(prev => prev.map(p => {
                                            if (p.id !== targetPatient.id) return p;
                                            
                                            // Deep clone
                                            const updated = { ...p };
                                            
                                            // Update appointment history: match by rawDate
                                            const targetDate = apptToSync.rawDate || apptToSync.date_time || apptToSync.date;
                                            if (updated.appointmentHistory) {
                                                updated.appointmentHistory = updated.appointmentHistory.map((h: any) => {
                                                    if (h.rawDate === targetDate || h.rawDate === apptToSync.rawDate) {
                                                        return { ...h, status: 'completed' };
                                                    }
                                                    return h;
                                                });
                                            }
                                            
                                            // Update referral history if date matches
                                            if (updated.referralHistory) {
                                                updated.referralHistory = updated.referralHistory.map((h: any) => {
                                                    if (h.rawDate === targetDate || h.rawDate === apptToSync.rawDate) {
                                                        return { ...h, status: 'Treated' };
                                                    }
                                                    return h;
                                                });
                                            }

                                            // Also update global REFERRAL_DATA
                                            if (apptToSync.referralId) {
                                                 const refIndex = REFERRAL_DATA.findIndex(r => r.id === apptToSync.referralId || `ref-${r.id}` === apptToSync.referralId || String(r.id) === String(apptToSync.referralId));
                                                 if (refIndex !== -1) {
                                                     REFERRAL_DATA[refIndex].status = 'Treated';
                                                 }
                                            }

                                            // Update visit history if date matches
                                            if (updated.visitHistory) {
                                                updated.visitHistory = updated.visitHistory.map((h: any) => {
                                                    if (h.rawDate === targetDate || h.rawDate === apptToSync.rawDate) {
                                                        return { ...h, status: 'completed' };
                                                    }
                                                    return h;
                                                });
                                            }
                                            
                                            // Update appointments array
                                            if (updated.appointments) {
                                                updated.appointments = updated.appointments.map((a: any) => {
                                                    if (a.date_time === targetDate) {
                                                        return { ...a, status: 'เสร็จสิ้น' };
                                                    }
                                                    return a;
                                                });
                                            }

                                            return updated;
                                        }));
                                    }
                                }
                                
                                // Navigate: if from ConfirmModal go to calendar, otherwise go back to return view
                                if (selectedAppointment) {
                                    setCurrentView('calendar');
                                    setIsSuccessModalOpen(true);
                                } else {
                                    setCurrentView(returnView);
                                    setIsSuccessModalOpen(true);
                                }
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
                            // Update Global HOME_VISIT_DATA directly
                            if (selectedHomeVisit) {
                                const visitIndex = HOME_VISIT_DATA.findIndex(v => v.id === selectedHomeVisit.id);
                                if (visitIndex !== -1) {
                                    HOME_VISIT_DATA[visitIndex].status = 'Completed';
                                }

                                // Update Local State to reflect changes immediately
                                setPatients(prev => prev.map(p => {
                                    // Match by patientId (if from event) or id (if direct)
                                    const pId = selectedHomeVisit.patientId || selectedHomeVisit.id;
                                    
                                    if (String(p.id) === String(pId)) {
                                        const updated = { ...p };
                                        
                                        // Update specific visit in history
                                        if (updated.visitHistory) {
                                            updated.visitHistory = updated.visitHistory.map((h: any) => {
                                                // Match by rawDate
                                                if (h.rawDate === selectedHomeVisit.rawDate || h.date === selectedHomeVisit.date) {
                                                    return { ...h, status: 'completed' };
                                                }
                                                return h;
                                            });
                                        }

                                        // Update main status if needed
                                        // updated.status = 'completed';
                                        
                                        return updated;
                                    }
                                    return p;
                                }));
                                
                                toast.success("บันทึกการเยี่ยมบ้านเรียบร้อยแล้ว");
                            }
                            setCurrentView(returnView);
                        }}
                    />
                </div>
            )}

            {/* Feature: Home Visit Detail */}
            {currentView === 'home-visit-detail' && selectedHomeVisit && (
                 <VisitDetail 
                    visit={selectedHomeVisit}
                    patient={patients.find(p => p.hn === selectedHomeVisit.hn)}
                    onBack={() => setCurrentView(returnView)}
                    onOpenForm={() => setCurrentView('home-visit-form')}
                />
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
                appointment={selectedAppointment ? { ...selectedAppointment, status: 'completed' } : null}
                role={currentRole}
                onReschedule={() => setIsSuccessModalOpen(false)}
                onRequestRefer={() => {
                     if (selectedAppointment) {
                         setTargetReferralHN(selectedAppointment.hn);
                         setCurrentView('referrals');
                     }
                     setIsSuccessModalOpen(false);
                }}
                onViewDetail={() => {
                     if (selectedAppointment) {
                         const pId = selectedAppointment.patientId || selectedAppointment.id;
                         const patient = patients.find(p => String(p.id) === String(pId) || p.hn === selectedAppointment.hn);
                         if (patient) {
                             setSelectedHistoryPatient(patient);
                             setCurrentView('patients');
                         }
                     }
                     setIsSuccessModalOpen(false);
                }}
            />
        </div>
      </div>
    </div>
  );
}