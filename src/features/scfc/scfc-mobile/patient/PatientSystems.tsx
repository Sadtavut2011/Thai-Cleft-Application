import React, { useState, useMemo, useRef } from 'react';
import { Search, Plus, ChevronRight, CheckCircle, MapPin, Building2, ChevronDown } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import SlotClone from '../../../../imports/SlotClone';
import PatientFilterSheet, { FilterCriteria } from '../../../cm/cm-mobile/patient/PatientFilterSheet';
import RegistrationContainer from '../../../cm/cm-mobile/patient/registration/RegistrationContainer';

// Imports from Figma design for assets
import imgFrame1171276583 from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";

// --- Mock Data for System Patients (Simulating DB) ---
const SYSTEM_EXTRA_PATIENTS: any[] = [];

// Mock Data for Filters
const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

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
  province?: string;
  hospital?: string;
  [key: string]: any;
}

interface PatientsViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
}

export default function PatientSystems({ patients, onSelectPatient, onAddPatient }: PatientsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
      diagnoses: [],
      rights: [],
      statuses: []
  });
  
  // New Filter State
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  
  // Drag to Scroll Logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const allSystemPatients = useMemo(() => {
    const propIds = new Set(patients.map(p => p.hn || p.id));
    const extras = SYSTEM_EXTRA_PATIENTS.filter(p => !propIds.has(p.id));
    return [...patients, ...extras];
  }, [patients]);

  const filteredPatients = allSystemPatients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.hn && p.hn.includes(searchTerm)) ||
      (p.cid && String(p.cid).includes(searchTerm)) ||
      (p.id && String(p.id).includes(searchTerm));

    const pDiagnosis = p.medicalCondition || "Cleft Lip - left - microform"; 
    const matchesDiagnosis = filterCriteria.diagnoses.length === 0 || filterCriteria.diagnoses.some(d => pDiagnosis.includes(d));

    const pRights = p.rights || "บัตรทอง"; 
    const matchesRights = filterCriteria.rights.length === 0 || filterCriteria.rights.includes(pRights);

    const pStatus = p.status || "Active";
    const matchesStatus = filterCriteria.statuses.length === 0 || filterCriteria.statuses.includes(pStatus);

    const pProvince = p.province || p.contact?.address || ''; 
    const matchesProvince = selectedProvince === 'All' || pProvince.includes(selectedProvince);

    const pHospital = p.hospital || ''; 
    const matchesHospital = selectedHospital === 'All' || pHospital.includes(selectedHospital);

    return matchesSearch && matchesDiagnosis && matchesRights && matchesStatus && matchesProvince && matchesHospital;
  });

  const stats = useMemo(() => {
    const total = allSystemPatients.length;
    const active = allSystemPatients.filter(p => !p.status || p.status === 'Active').length;
    const inactive = total - active; 

    return [
      {
        value: 13,
        label: 'Total Patients',
        sublabel: 'รายชื่อผู้ป่วยทั้งหมด',
        bgColor: 'bg-[#F0F7FF]',
        textColor: 'text-[#2E6ADF]',
        borderColor: 'border-[#DAE9FE]'
      },
      {
        value: 7,
        label: 'Active',
        sublabel: 'กำลังรักษา',
        bgColor: 'bg-[#F0FDF4]',
        textColor: 'text-[#16A34A]',
        borderColor: 'border-[#DCFCE7]'
      },
      {
        value: 6,
        label: 'Inactive',
        sublabel: 'จำหน่าย/สิ้นสุด',
        bgColor: 'bg-[#F8FAFC]',
        textColor: 'text-[#475569]',
        borderColor: 'border-[#E2E8F0]'
      }
    ];
  }, [allSystemPatients]);

  if (isRegistering) {
    return (
      <RegistrationContainer 
        onBack={() => setIsRegistering(false)} 
        onSubmit={(data) => {
          console.log("Registered patient:", data);
          setIsRegistering(false);
        }} 
      />
    );
  }

  return (
    <div className="h-full flex flex-col font-['IBM_Plex_Sans_Thai'] bg-[#edebfe]">
      {/* Search and Header Section */}
      <div className="p-5 pb-4 flex flex-col gap-4">
        
        {/* Tabs Header and Filters Combined */}
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center pl-1 shrink-0">
            <button 
              className="text-[18px] font-bold transition-colors relative pb-1 text-[#3c3c3c]"
            >
              ผู้ป่วย (SCFC)
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-[3px] bg-[#7066a9] rounded-full" />
            </button>
          </div>
          
          {/* Province and Hospital Filters */}
          <div className="flex gap-2 flex-1 justify-end min-w-0">
            <div className="relative flex-1 max-w-[140px] min-w-[100px]">
               <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7066a9] pointer-events-none">
                  <MapPin size={14} />
               </div>
               <select 
                 value={selectedProvince}
                 onChange={(e) => setSelectedProvince(e.target.value)}
                 className="w-full h-[36px] pl-8 pr-6 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-[#7066a9]/20 truncate"
               >
                 <option value="All">ทุกจังหวัด</option>
                 {PROVINCES.map(p => (
                   <option key={p} value={p}>{p}</option>
                 ))}
               </select>
               <div className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDown size={14} />
               </div>
            </div>

            <div className="relative flex-1 max-w-[140px] min-w-[100px]">
               <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7066a9] pointer-events-none">
                  <Building2 size={14} />
               </div>
               <select 
                 value={selectedHospital}
                 onChange={(e) => setSelectedHospital(e.target.value)}
                 className="w-full h-[36px] pl-8 pr-6 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 appearance-none focus:outline-none focus:ring-2 focus:ring-[#7066a9]/20 truncate"
               >
                 <option value="All">ทุก รพ.</option>
                 {HOSPITALS.map(h => (
                   <option key={h} value={h}>{h}</option>
                 ))}
               </select>
               <div className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDown size={14} />
               </div>
            </div>
          </div>
        </div>

        {/* Dashboard Stats Cards - Horizontal Scroll with Drag */}
        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] cursor-grab active:cursor-grabbing select-none"
        >
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className={`min-w-[150px] h-[100px] rounded-[20px] p-4 flex flex-col justify-between border ${stat.bgColor} ${stat.borderColor} shrink-0 pointer-events-none`}
            >
              <span className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</span>
              <div>
                <p className={`text-[14px] font-bold ${stat.textColor} leading-tight`}>{stat.sublabel}</p>
                <p className={`text-[10px] ${stat.textColor} opacity-80 uppercase font-semibold`}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Search Input and Add Button Row */}
        <div className="flex gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7066a9]">
                 <Search size={20} />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหา..."
                className="w-full pl-12 pr-4 py-3 rounded-[16px] border-none shadow-sm text-[16px] text-[#3c3c3c] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7066a9]/20"
              />
            </div>

            {/* Add Patient Button */}
            <button 
              onClick={() => setIsRegistering(true)}
              className="bg-white h-[47px] px-4 rounded-[16px] flex items-center justify-center gap-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] active:scale-95 transition-all whitespace-nowrap"
            >
               <div className="bg-[#7066a9] rounded-full w-[24px] h-[24px] flex items-center justify-center shrink-0">
                 <Plus size={14} className="text-white" />
               </div>
               <span className="text-[#3c3c3c] font-semibold text-[14px]">เพิ่ม</span>
            </button>
        </div>
      </div>

      {/* Results List Section */}
      <div className="bg-white rounded-t-[24px] flex-1 p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col relative">
        <h3 className="text-[18px] font-medium text-[#3c3c3c] mb-4 flex justify-between items-center">
          <span>
            {searchTerm 
                    ? `พบข้อมูล '${searchTerm}' ${filteredPatients.length} รายการ`
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
                          {(patient.province || patient.contact?.address) ? `, ${patient.province || patient.contact?.address}` : ''}
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
           ) : (
             <div className="flex flex-col items-center justify-start pt-8 gap-6 animate-in fade-in duration-300">
                <div className="text-center">
                  <p className="text-[18px] text-[#3c3c3c]">
                     <span className="text-red-500 font-medium">ไม่พบข้อมูล</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                     {searchTerm 
                        ? `ไม่พบข้อมูลที่ตรงกับ "${searchTerm}"` 
                        : "ไม่พบข้อมูลตามเงื่อนไขที่เลือก"}
                  </p>
                </div>
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
