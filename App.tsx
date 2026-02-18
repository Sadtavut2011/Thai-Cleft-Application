import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  FileText, 
  Home, 
  Users, 
  MessageCircle,
} from 'lucide-react';
import thaiCleftLogo from 'figma:asset/12ae20be12afdbbc28ab9f595255380bf78a4390.png';

// Context
import { RoleProvider, useRole } from './context/RoleContext';

// Role Dashboards
import HospitalDashboard from './Role/hospital/HospitalEntry';
import SCFCEntry from './Role/scfc/SCFCEntry';
import PCUDashboard from './Role/pcu/dashboard/PCUDashboard';
// Removed legacy PatientDashboard import
import AdminDashboard from './Role/admin/dashboard/AdminDashboard';

// Role Entry Points
import CMEntry from './Role/cm/CMEntry';
import PCUEntry from './Role/pcu/PCUEntry';
import HospitalMobileLayout from './Role/hospital/hospital-mobile/layout/MobileLayout';
// Imported directly from features/patient/mobile as requested
import PatientMobileLayout from './Role/Patient/patient-mobile/layout/MobileLayout';

// Features - Patient (Still used by other roles?)
import { NewPatientList } from './Role/cm/cm-mobile/page/NewPatientList';
import PatientDirectory from './Role/cm/cm-mobile/patient/PatientDirectory';
import { PatientDetailView } from './Role/cm/cm-mobile/patient/detail/PatientDetailView';
import { AddMedicalRecordForm } from './Role/cm/cm-mobile/patient/detail/AddMedicalRecordForm';
import NotificationPage from './Role/cm/cm-mobile/page/NotificationPage';
import UserProfileMenu from './Role/cm/cm-mobile/page/UserProfileMenu';

import StandardPageLayout from './components/shared/layout/StandardPageLayout';
import { PATIENTS_DATA } from './data/patientData';
import { useMediaQuery } from './hooks/useMediaQuery';

// Helper functions
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Legacy Mobile Layout for Non-CM Roles
// TODO: Refactor other roles to use their own layouts
function MobileLayout() {
  const { currentRole } = useRole();
  
  // Use PATIENTS_DATA as the initial state
  const [patients, setPatients] = useState(PATIENTS_DATA);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  
  // State for View Navigation
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [selectedHistoryPatient, setSelectedHistoryPatient] = useState<any>(null); 
  const [returnView, setReturnView] = useState('patients');
  
  const today = useMemo(() => new Date(2025, 11, 4), []);
  
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedNewPatient, setSelectedNewPatient] = useState(null);

  const handleDeletePatient = (id: any) => {
    if (window.confirm('คุณต้องการลบข้อมูลผู้ป่วยนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถ้อนกลับได้')) {
      setPatients(prev => prev.filter(p => p.id !== id));
      setSelectedPatient(null);
    }
  };

  const renderDashboardContent = () => {
    switch(currentRole) {
      case 'Hospital': return <HospitalMobileLayout />;
      // case 'SCFC': return <SCFCDashboard />; // Handled by SCFCEntry
      case 'PCU': return <PCUDashboard />;
      // Patient role is now handled by PatientMobileLayout in AppContent
      case 'Admin': return <AdminDashboard />;
      default: return <div>Role Dashboard Not Found</div>;
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
                    {renderDashboardContent()}
                </StandardPageLayout>
            )}
            
            {/* CONDITION: View = Chat */}
            {currentView === 'chat' && (
                 <StandardPageLayout title="สนทนา" onBack={() => setCurrentView('dashboard')} bypassContentCard={true}>
                     <div className="p-4 text-center text-slate-500">Feature not available for this role</div>
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
                            onRequestFund={() => {}}
                            onAction={() => {}}
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
                                setCurrentView('dashboard');
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
                            setCurrentView('dashboard');
                        }}
                    />
                </div>
            )}

        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { currentRole } = useRole();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // CM Entry Point - Handles both Web and Mobile logic internally
  if (currentRole === 'CM') {
      return <CMEntry />;
  }

  // SCFC Entry Point - Handles both Web and Mobile logic internally
  if (currentRole === 'SCFC') {
      return <SCFCEntry />;
  }

  // PCU Entry Point
  if (currentRole === 'PCU') {
      return <PCUEntry />;
  }

  // Patient Entry Point (New) - Role: 'ผู้ป่วย' (Patient)
  if (currentRole === 'Patient') {
      return <PatientMobileLayout />;
  }

  if (isDesktop) {
     if (currentRole === 'Admin') {
       return <AdminDashboard />;
     }

     return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
           <div className="w-[393px] h-[852px] bg-white rounded-[40px] overflow-hidden shadow-2xl relative">
              {currentRole === 'Hospital' ? <HospitalMobileLayout /> : <MobileLayout />}
           </div>
           <div className="absolute top-8 left-8 text-white">
              <h1 className="text-2xl font-bold">Mobile View Preview</h1>
              <p className="opacity-70">Role: {currentRole}</p>
           </div>
        </div>
     );
  }

  if (currentRole === 'Hospital') {
    return <HospitalMobileLayout />;
  }

  return <MobileLayout />
}

export default function CleftClinicApp() {
  return (
    <RoleProvider>
      <AppContent />
    </RoleProvider>
  );
}
