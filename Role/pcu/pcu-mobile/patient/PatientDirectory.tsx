import React, { useState, useMemo } from 'react';
import { Search, Plus, ChevronRight, CheckCircle } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import SlotClone from '../../../../imports/SlotClone';
import PatientFilterSheet, { FilterCriteria } from '../../../../Role/cm/cm-mobile/patient/PatientFilterSheet';
import { CaseManagerNotifyForm } from '../page/CaseManagerNotifyForm';
import { cn } from '../../../../components/ui/utils';

// Imports from Figma design for assets
import imgFrame1171276583 from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";

// --- Mock Data for System Patients (Simulating DB) ---
// These patients exist in the system but might not be passed via props yet
const SYSTEM_EXTRA_PATIENTS: any[] = [];

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
  const [isNotifyFormOpen, setIsNotifyFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
      diagnoses: [],
      rights: [],
      patientStatuses: [],
      caseStatuses: []
  });

  // Helper: get patient status label and style
  const getPatientStatusInfo = (patient: Patient) => {
    const label = patient.patientStatusLabel || 'ปกติ';
    switch (label) {
      case 'ปกติ':
        return { label, bg: 'bg-emerald-400 hover:bg-emerald-500 shadow-emerald-200' };
      case 'Loss follow up':
        return { label, bg: 'bg-orange-400 hover:bg-orange-500 shadow-orange-200' };
      case 'รักษาเสร็จสิ้น':
        return { label, bg: 'bg-blue-400 hover:bg-blue-500 shadow-blue-200' };
      case 'เสียชีวิต':
        return { label, bg: 'bg-red-400 hover:bg-red-500 shadow-red-200' };
      case 'มารดา':
        return { label, bg: 'bg-pink-400 hover:bg-pink-500 shadow-pink-200' };
      default:
        return { label, bg: 'bg-emerald-400 hover:bg-emerald-500 shadow-emerald-200' };
    }
  };
  
  // Combine props patients with our mock system patients
  const allSystemPatients = useMemo(() => {
    // Avoid duplicates if props already contain them
    const propIds = new Set(patients.map(p => p.hn || p.id));
    const extras = SYSTEM_EXTRA_PATIENTS.filter(p => !propIds.has(p.id));
    return [...patients, ...extras];
  }, [patients]);

  const filteredPatients = allSystemPatients.filter(p => {
    // 1. Search Logic
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.hn && p.hn.includes(searchTerm)) ||
      (p.cid && String(p.cid).includes(searchTerm)) ||
      (p.id && String(p.id).includes(searchTerm));

    // 2. Filter Logic
    // Diagnosis - check medicalCondition if available, or assume all match if no diagnosis field
    const pDiagnosis = p.medicalCondition || "Cleft Lip - left - microform"; // Fallback to what we see in UI for now
    const matchesDiagnosis = filterCriteria.diagnoses.length === 0 || filterCriteria.diagnoses.some(d => pDiagnosis.includes(d));

    // Rights - not present in mock, assume match if empty filter
    const pRights = p.rights || "บัตรทอง"; // Mock default
    const matchesRights = filterCriteria.rights.length === 0 || filterCriteria.rights.includes(pRights);

    // 3. Patient Status filter (สถานะผู้ป่วย)
    const pPatientStatusLabel = p.patientStatusLabel || 'ปกติ';
    const matchesPatientStatus = filterCriteria.patientStatuses.length === 0 || filterCriteria.patientStatuses.includes(pPatientStatusLabel);

    // 4. Case Status filter (สถานะผู้ใช้งาน)
    const pCaseStatus = p.status || "Active";
    const matchesCaseStatus = filterCriteria.caseStatuses.length === 0 || filterCriteria.caseStatuses.includes(pCaseStatus);

    return matchesSearch && matchesDiagnosis && matchesRights && matchesPatientStatus && matchesCaseStatus;
  });

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
            className="w-full pl-12 pr-4 py-3 rounded-[8px] border-none shadow-sm text-[16px] text-[#3c3c3c] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7066a9]/20 bg-white/50"
          />
        </div>

        {/* Add Patient Button (Notify Case Manager) */}
        <button 
          onClick={() => setIsNotifyFormOpen(true)}
          className="w-full bg-[#ff8a4c] h-[48px] rounded-[16px] flex items-center justify-center shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] active:scale-95 transition-all"
        >
           <span className="text-white font-['IBM_Plex_Sans_Thai'] font-bold text-[16px]">แจ้ง Case Manager</span>
        </button>
      </div>

      <CaseManagerNotifyForm 
        isOpen={isNotifyFormOpen} 
        onOpenChange={setIsNotifyFormOpen} 
        onSubmit={() => setIsNotifyFormOpen(false)} 
      />

      {/* Results List Section */}
      <div className="bg-white rounded-t-[24px] flex-1 p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col relative">
        <h3 className="text-[18px] font-medium text-[#3c3c3c] mb-4 flex justify-between items-center">
          <span>
            {searchTerm 
                    ? `พบข้อมูล ‘${searchTerm}’ ${filteredPatients.length} รายการ`
                    : `รายชื่อผู้ป่วยทั้งหมด ${filteredPatients.length} รายการ`
            }
          </span>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="w-[32px] h-[32px] rounded-full overflow-hidden hover:opacity-80 transition-opacity shadow-sm"
          >
            <SlotClone />
          </button>
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
                     <p className="font-semibold text-[#3c3c3c] text-[20px] leading-tight truncate">{patient.name}</p>
                     <div className="flex items-center justify-between mt-0.5">
                       <p className="text-[#787878] text-[16px] font-medium truncate">HN: {patient.hn}</p>
                       {(() => {
                         const statusInfo = getPatientStatusInfo(patient);
                         return (
                           <Badge className={cn(
                             "text-white border-none px-2 py-0.5 text-[10px] md:text-xs rounded-full shadow-sm",
                             statusInfo.bg
                           )}>
                             {statusInfo.label}
                           </Badge>
                         );
                       })()}
                     </div>
                     <div className="flex items-center justify-between mt-0.5">
                       <p className="text-[#787878] text-[14px] font-medium truncate flex-1">
                          {patient.age ? `อายุ ${patient.age.split(' ')[0]} ปี` : ''}
                       </p>
                       <div className="bg-white border border-[#2F80ED] px-2 py-0.5 rounded-full flex items-center justify-center shrink-0 ml-2 text-[rgb(112,102,169)]">
                         <span className="text-[10px] font-bold text-[rgb(112,102,169)]">Cleft Lip - left</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Arrow Icon */}

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
      
      {/* Filter Sheet */}
      <PatientFilterSheet 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(newCriteria) => setFilterCriteria(newCriteria)}
        initialCriteria={filterCriteria}
      />
    </div>
  );
}