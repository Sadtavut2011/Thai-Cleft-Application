import React, { useState, useMemo } from 'react';
import { Search, Plus, ChevronRight, CheckCircle } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import RegistrationContainer from './registration/RegistrationContainer';

// Imports from Figma design for assets
import imgFrame1171276583 from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";

// --- Mock Data for System Patients (Simulating DB) ---
// These patients exist in the system but might not be passed via props yet
const SYSTEM_EXTRA_PATIENTS = [
  {
    id: "1509900000001",
    hn: "66012345",
    prefix: "ด.ช.",
    name: "ด.ช. รักดี มีสุข",
    age: "5 ปี",
    image: imgFrame1171276583,
    contact: { address: "เชียงใหม่" },
    history: [],
    cid: "1509900000001"
  }
];

interface Patient {
  id?: string | number;
  name: string;
  hn: string;
  image?: string;
  age?: string;
  contact?: {
    address?: string;
  };
  isNew?: boolean;
  medicalCondition?: string; 
  [key: string]: any;
}

interface PatientsViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

export default function PatientDirectory({ patients, onSelectPatient, onAddPatient }: PatientsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Combine props patients with our mock system patients
  const allSystemPatients = useMemo(() => {
    // Avoid duplicates if props already contain them
    const propIds = new Set(patients.map(p => p.hn || p.id));
    const extras = SYSTEM_EXTRA_PATIENTS.filter(p => !propIds.has(p.id));
    return [...patients, ...extras];
  }, [patients]);

  const filteredPatients = allSystemPatients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.hn && p.hn.includes(searchTerm)) ||
    (p.cid && String(p.cid).includes(searchTerm)) ||
    (p.id && String(p.id).includes(searchTerm))
  );

  if (isRegistering) {
    return (
      <RegistrationContainer 
        onBack={() => setIsRegistering(false)} 
        onSubmit={(data) => {
          console.log("Registered patient:", data);
          setIsRegistering(false);
          // Optionally call parent callback if needed to refresh data
          // onAddPatient(); 
        }} 
      />
    );
  }

  return (
    <div className="h-full flex flex-col font-['IBM_Plex_Sans_Thai'] bg-[#edebfe]">
      {/* Search and Header Section */}
      <div className="p-5 pb-4 flex flex-col gap-4">
        
        {/* Tabs Header */}
        <div className="flex items-center gap-6 pl-1">
          <button 
            className="text-[18px] font-medium transition-colors relative pb-1 text-[#3c3c3c]"
          >
            ข้อมูลผู้ป่วย
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-[3px] bg-[#7066a9] rounded-full" />
          </button>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7066a9]">
             <Search size={20} />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหา ชื่อ-สกุล, เลขบัตรประชาชน, HN..."
            className="w-full pl-12 pr-4 py-3 rounded-[8px] border-none shadow-sm text-[16px] text-[#3c3c3c] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7066a9]/20"
          />
        </div>

        {/* Add Patient Button */}
        <button 
          onClick={() => setIsRegistering(true)}
          className="w-full bg-[rgb(255,255,255)] h-[47px] rounded-[16px] flex items-center justify-center gap-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] active:scale-95 transition-all"
        >
           <div className="bg-[#7066a9] rounded-full w-[24px] h-[24px] flex items-center justify-center">
             <Plus size={14} className="text-white" />
           </div>
           <span className="text-[#3c3c3c] font-semibold text-[16px]">เพิ่มข้อมูล ผู้ป่วยใหม่</span>
        </button>
      </div>

      {/* Results List Section */}
      <div className="bg-white rounded-t-[24px] flex-1 p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        <h3 className="text-[18px] font-medium text-[#3c3c3c] mb-4 flex justify-between items-center">
          <span>
            {searchTerm 
                    ? `พบข้อมูล ‘${searchTerm}’ ${filteredPatients.length} รายการ`
                    : `รายชื่อผู้ป่วยทั้งหมด ${filteredPatients.length} รายการ`
            }
          </span>
        </h3>

        <div className="flex flex-col gap-3 overflow-y-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
           {filteredPatients.length > 0 ? (
             filteredPatients.map((patient, index) => (
               <div 
                 key={patient.id || index}
                 onClick={() => onSelectPatient(patient)}
                 className="bg-white rounded-[16px] p-3 flex items-center justify-between cursor-pointer border border-gray-200 shadow-md transition-all"
               >
                 <div className="flex items-center gap-3 overflow-hidden flex-1">
                   {/* Avatar */}
                   <div className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden shrink-0 border border-white shadow-sm">
                      <ImageWithFallback 
                        src={patient.image || imgFrame1171276583} 
                        alt={patient.name}
                        className="w-full h-full object-cover"
                      />
                   </div>
                   
                   {/* Patient Info */}
                   <div className="flex flex-col min-w-0 justify-center flex-1">
                     <p className="font-semibold text-[#3c3c3c] text-[16px] leading-tight truncate">{patient.name}</p>
                     <div className="flex items-center justify-between mt-0.5">
                       <p className="text-[#787878] text-[14px] font-medium truncate">HN: {patient.hn}</p>
                       <Badge className="bg-emerald-400 hover:bg-emerald-500 text-white border-none gap-1 px-2 py-0.5 text-[10px] md:text-xs rounded-full shadow-sm shadow-emerald-200">
                         <CheckCircle className="w-3 h-3" strokeWidth={3} /> Active
                       </Badge>
                     </div>
                     <div className="flex items-center justify-between mt-0.5">
                       <p className="text-[#787878] text-[14px] font-medium truncate flex-1">
                          {patient.age ? `อายุ ${patient.age}` : ''}
                          {patient.age && patient.contact?.address ? ', ' : ''}
                          {patient.contact?.address ? patient.contact.address : ''}
                       </p>
                       <div className="bg-white border border-[#2F80ED] px-2 py-0.5 rounded-full flex items-center justify-center shrink-0 ml-2 text-[rgb(112,102,169)]">
                         <span className="text-[10px] font-bold text-[rgb(112,102,169)]">Cleft Lip - left - microform</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Arrow Icon */}
                 <div className="bg-[#7066a9] rounded-full w-[32px] h-[32px] flex items-center justify-center shrink-0 ml-2">
                   <ChevronRight size={20} className="text-white" />
                 </div>
               </div>
             ))
           ) : searchTerm ? (
             <div className="flex flex-col items-center justify-start pt-8 gap-6 animate-in fade-in duration-300">
                <div className="text-center">
                  <p className="text-[18px] text-[#3c3c3c]">
                     <span className="text-red-500 font-medium">ไม่พบ</span> ‘{searchTerm}’
                  </p>
                  <p className="text-sm text-gray-400 mt-2">เลขบัตร/HN นี้ยังไม่มีในระบบฐานข้อมูล</p>
                </div>
             </div>
           ) : (
             <div className="text-center py-8 text-gray-400">
               <p>ไม่พบข้อมูลที่ค้นหา</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
