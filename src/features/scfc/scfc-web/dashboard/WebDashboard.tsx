import React, { useState } from 'react';
import SCFCSidebar from '../layout/SCFCSidebar';
import { WebHeader } from '../components/WebHeader';
import { AppointmentSystem } from '../operations/appointment/AppointmentSystem';
import ReferralSystem from '../operations/referral/ReferralSystem';
import PatientManagement from '../../../../Role/cm/cm-web/patient/treatment-plan';
import { NewPatient } from '../../../../Role/cm/cm-web/pages/NewPatient';
import { CaseManagerNotifyForm } from '../../../../Role/cm/cm-web/pages/CaseManagerNotifyForm';
import { PatientDetailView as PatientDetail } from '../../../../Role/cm/cm-web/patient/PatientDetailView';
import TeleConsultationSystem from '../operations/tele-consult/TeleConsultationSystem';
import { HomeVisitSystem } from '../operations/home-visit/HomeVisitSystem';
import { TreatmentPlanSystem } from '../page/TreatmentPlanSystem';
import { OperationsDashboard } from '../page/OperationsDashboard';
import FundSystem from '../operations/fund-request/FundSystem';
import GISSystem from '../../../../Role/cm/cm-web/patient/gis-map/gis-patient';
import ChatSystem from '../../../../Role/cm/cm-web/chat/ChatSystem';
import { ProfilePage } from '../../../../Role/cm/cm-web/pages/ProfilePage';
import { Toaster } from "../../../../components/ui/sonner";
import { useCMData } from '../../../../hooks/useCMData';

export default function WebDashboard() {
  // Main App Component
  const [activePage, setActivePage] = useState("จัดการข้อมูลผู้ป่วย");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedNewPatient, setSelectedNewPatient] = useState<any>(null);
  const [targetPatientId, setTargetPatientId] = useState<string | null>(null);

  const { allPatients } = useCMData();

  const renderContent = () => {
    switch (activePage) {
      case "ระบบนัดหมาย":
        return <AppointmentSystem />;
      case "ระบบส่งตัวผู้ป่วย":
        return <ReferralSystem 
                  initialHN={selectedPatient?.hn}
               />;
      case "ลงทะเบียนผู้ป่วยใหม่":
        return (
            <NewPatient 
                onBack={() => setActivePage("จัดการข้อมูลผู้ป่วย")}
                onFinish={() => {
                    setActivePage("จัดการข้อมูลผู้ป่วย");
                }}
            />
        );
      case "แจ้งเตือน Case Manager":
        return (
            <CaseManagerNotifyForm 
                patient={selectedNewPatient}
                onBack={() => setActivePage("ค้นหาผู้ป่วยใหม่")}
                onSubmit={() => {
                    setActivePage("จัดการข้อมูลผู้ป่วย");
                }}
            />
        );
      case "จัดการข้อมูลผู้ป่วย":
        if (selectedPatient) {
          return (
            <PatientDetail 
              patient={selectedPatient} 
              onBack={() => setSelectedPatient(null)} 
              onAction={(action: string, data: any) => {
                  if (action === 'referral') {
                      setActivePage("ระบบส่งตัวผู้ป่วย");
                  } else if (action === 'home-visit') {
                      setActivePage("ระบบเยี่ยมบ้าน");
                  }
              }}
              onAddMedicalRecord={() => {
                  // Handle add record
              }}
              onRequestFund={() => {
                  setActivePage("ระบบขอทุน");
              }}
            />
          );
        }
        return (
          <PatientManagement 
            patients={allPatients} 
            onSelectPatient={(patient: any) => setSelectedPatient(patient)} 
            onAddPatient={() => setActivePage("ลงทะเบียนผู้ป่วยใหม่")}
          />
        );
      case "Tele-consult":
        return <TeleConsultationSystem onBack={() => setActivePage("จัดการข้อมูลผู้ป่วย")} />;
      case "ระบบเยี่ยมบ้าน":
        return <HomeVisitSystem />;
      case "ระบบขอทุน":
        return <FundSystem />;
      case "แผนการรักษา":
        return (
          <TreatmentPlanSystem 
            initialPatientId={targetPatientId || selectedPatient?.id}
            onBack={() => {
                setTargetPatientId(null);
                setActivePage("จัดการข้อมูลผู้ป่วย");
            }}
            onViewPatient={(patient) => {
               setSelectedPatient(patient);
               setActivePage("จัดการข้อมูลผู้ป่วย");
            }} 
          />
        );
      case "แผนที่(GIS)":
        return <GISSystem />;
      case "ระบบสนทนา":
        return <ChatSystem />;
      case "แดชบอร์ด":
        return <OperationsDashboard />;
      case "ข้อมูลส่วนตัว":
        return <ProfilePage onBack={() => setActivePage("จัดการข้อมูลผู้ป่วย")} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
             <div className="text-xl font-medium">Coming Soon</div>
             <p className="text-sm">หน้า "{activePage}" กำลังอยู่ระหว่างการพัฒนา</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F8F8] font-['IBM_Plex_Sans_Thai']">
      <SCFCSidebar 
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-10" 
        currentView={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          if (page !== "จัดการข้อมูลผู้ป่วย" && page !== "แผนการรักษา") {
             setSelectedPatient(null);
          }
        }} 
      />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-[250px] flex flex-col min-h-screen">
        {/* Top Navbar Area */}
        <div className="p-4 md:p-6 pb-0">
            <WebHeader onNavigate={(page) => setActivePage(page)} />
        </div>
        
        {/* Page Content */}
        <main className="p-4 md:p-6 flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}