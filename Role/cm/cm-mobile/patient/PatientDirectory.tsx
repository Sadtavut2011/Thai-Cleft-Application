import React, { useState, useMemo, useRef } from 'react';
import { Search, Plus, ChevronRight, CheckCircle, MapPin, Building2, ChevronDown } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import SlotClone from '../../../../imports/SlotClone';
import PatientFilterSheet, { FilterCriteria } from './PatientFilterSheet';
import RegistrationContainer from './registration/RegistrationContainer';
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { cn } from "../../../../components/ui/utils";

// Imports from Figma design for assets
import imgFrame1171276583 from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";

// --- Mock Data for System Patients (Simulating DB) ---
const SYSTEM_EXTRA_PATIENTS: any[] = [];

// Mock Data for Filters (SCFC)
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
  rights?: string;
  status?: string;
  patientStatusLabel?: string;
  [key: string]: any;
}

interface PatientsViewProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onAddPatient: () => void;
  role?: 'cm' | 'scfc' | 'pcu';
}

export default function PatientDirectory({ patients, onSelectPatient, onAddPatient, role = 'cm' }: PatientsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
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

  // SCFC Specific State
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isHospitalOpen, setIsHospitalOpen] = useState(false);
  
  // Drag to Scroll Logic (SCFC)
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
  
  // Combine props patients with mock system patients
  const allSystemPatients = useMemo(() => {
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
    const pDiagnosis = p.medicalCondition || "Cleft Lip - left - microform"; 
    const matchesDiagnosis = filterCriteria.diagnoses.length === 0 || filterCriteria.diagnoses.some(d => pDiagnosis.includes(d));

    const pRights = p.rights || "บัตรทอง"; 
    const matchesRights = filterCriteria.rights.length === 0 || filterCriteria.rights.includes(pRights);

    // 3. Patient Status filter (สถานะผู้ป่วย: ปกติ, Loss follow up, รักษาเสร็จสิ้น, เสียชีวิต, มารดา)
    const pPatientStatusLabel = p.patientStatusLabel || 'ปกติ';
    const matchesPatientStatus = filterCriteria.patientStatuses.length === 0 || filterCriteria.patientStatuses.includes(pPatientStatusLabel);

    // 4. Case Status filter (สถานะผู้ใช้งาน: Active, Inactive)
    const pCaseStatus = p.status || "Active";
    const matchesCaseStatus = filterCriteria.caseStatuses.length === 0 || filterCriteria.caseStatuses.includes(pCaseStatus);

    // 5. SCFC Specific Filters
    if (role === 'scfc') {
        const pProvince = p.province || p.contact?.address || ''; 
        const matchesProvince = selectedProvince === 'All' || pProvince.includes(selectedProvince);

        const pHospital = p.hospital || ''; 
        const matchesHospital = selectedHospital === 'All' || pHospital.includes(selectedHospital);
        
        return matchesSearch && matchesDiagnosis && matchesRights && matchesPatientStatus && matchesCaseStatus && matchesProvince && matchesHospital;
    }

    return matchesSearch && matchesDiagnosis && matchesRights && matchesPatientStatus && matchesCaseStatus;
  });

  // Calculate Stats (SCFC)
  const stats = useMemo(() => {
    // Logic from PatientSystems.tsx
    // Keep hardcoded values as requested in original file logic or use dynamic if needed.
    // Using hardcoded values as per PatientSystems.tsx for consistency with design request
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
      {/* Header Section */}
      <div className="p-5 pb-4 flex flex-col gap-4">
        
        {role === 'scfc' ? (
             /* SCFC Header Style */
            <>
                <div className="flex flex-row items-center justify-between gap-3">
                  <div className="flex items-center pl-1 shrink-0">
                    <button className="text-[18px] font-bold transition-colors relative pb-1 text-[#3c3c3c]">
                      ผู้ป่วย
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-[3px] bg-[#7066a9] rounded-full" />
                    </button>
                  </div>
                  
                  {/* Province and Hospital Filters (Custom Popover Style) */}
                  <div className="flex gap-2 flex-1 justify-end min-w-0">
                    {/* Province Filter */}
                    <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative flex-1 max-w-[160px] min-w-[120px] h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066a9]/20 transition-all active:scale-95">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066a9] pointer-events-none">
                                     <MapPin size={18} />
                                 </div>
                                 <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">
                                     {selectedProvince === 'All' ? 'ทุกจังหวัด' : selectedProvince}
                                 </span>
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                     <ChevronDown size={18} />
                                 </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                             <div className="flex flex-col">
                                 <button
                                      onClick={() => { setSelectedProvince('All'); setIsProvinceOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedProvince === 'All' ? "bg-slate-50 text-[#7367f0]" : "text-slate-700 hover:bg-slate-50"
                                      )}
                                  >
                                      ทุกจังหวัด
                                  </button>
                                 {PROVINCES.map(p => (
                                   <button
                                      key={p}
                                      onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedProvince === p ? "bg-slate-50 text-[#7367f0]" : "text-slate-700 hover:bg-slate-50"
                                      )}
                                  >
                                      {p}
                                  </button>
                                 ))}
                             </div>
                        </PopoverContent>
                    </Popover>

                    {/* Hospital Filter */}
                    <Popover open={isHospitalOpen} onOpenChange={setIsHospitalOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative flex-1 max-w-[160px] min-w-[120px] h-[44px] bg-white border border-slate-200 rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066a9]/20 transition-all active:scale-95">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066a9] pointer-events-none">
                                     <Building2 size={18} />
                                 </div>
                                 <span className="pl-7 pr-6 text-[14px] font-medium text-slate-700 truncate">
                                     {selectedHospital === 'All' ? 'ทุก รพ.' : selectedHospital}
                                 </span>
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                     <ChevronDown size={18} />
                                 </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-slate-100 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                             <div className="flex flex-col">
                                 <button
                                      onClick={() => { setSelectedHospital('All'); setIsHospitalOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedHospital === 'All' ? "bg-slate-50 text-[#7367f0]" : "text-slate-700 hover:bg-slate-50"
                                      )}
                                  >
                                      ทุกโรงพยาบาล
                                  </button>
                                 {HOSPITALS.map(h => (
                                   <button
                                      key={h}
                                      onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedHospital === h ? "bg-slate-50 text-[#7367f0]" : "text-slate-700 hover:bg-slate-50"
                                      )}
                                  >
                                      {h}
                                  </button>
                                 ))}
                             </div>
                        </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Dashboard Stats Cards */}
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
            </>
        ) : (
            /* CM Header Style */
            <div className="flex items-center gap-6 pl-1">
              <button className="text-[20px] font-medium transition-colors relative pb-1 text-[#3c3c3c]">
                ข้อมูลผู้ป่วย
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-[3px] bg-[#7066a9] rounded-full" />
              </button>
            </div>
        )}

        {/* Search Input and Add Button Row */}
        {role === 'scfc' ? (
             /* SCFC Style Search Row */
            <div className="flex gap-3 items-center">
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
        ) : (
             /* CM Style Search Row */
            <>
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
                <button 
                  onClick={() => setIsRegistering(true)}
                  className="w-full bg-[rgb(255,255,255)] h-[47px] rounded-[16px] flex items-center justify-center gap-2 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] active:scale-95 transition-all"
                >
                   <div className="bg-[#7066a9] rounded-full w-[24px] h-[24px] flex items-center justify-center">
                     <Plus size={14} className="text-white" />
                   </div>
                   <span className="text-[#3c3c3c] font-semibold text-[18px]">เพิ่มข้อมูล ผู้ป่วยใหม่</span>
                </button>
            </>
        )}
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
                     <p className={`font-semibold text-[#3c3c3c] leading-tight truncate ${role === 'scfc' ? 'text-[16px]' : 'text-[20px]'}`}>{patient.name}</p>
                     <div className="flex items-center justify-between mt-0.5">
                       <p className={`text-[#787878] font-medium truncate ${role === 'scfc' ? 'text-[14px]' : 'text-[16px]'}`}>HN: {patient.hn}</p>
                       {(() => {
                         const statusInfo = getPatientStatusInfo(patient);
                         return (
                           <Badge className={cn(
                             "text-white border-none gap-1 px-2 py-0.5 text-[10px] md:text-xs rounded-full shadow-sm",
                             statusInfo.bg
                           )}>
                             {role === 'scfc' && <CheckCircle className="w-3 h-3" strokeWidth={3} />} {statusInfo.label}
                           </Badge>
                         );
                       })()}
                     </div>
                     <div className="flex items-center justify-between mt-0.5">
                       <p className="text-[#787878] text-[14px] font-medium truncate flex-1">
                          {role === 'scfc' ? (
                                <>
                                    {patient.age ? `อายุ ${patient.age}` : ''}
                                    {(patient.province || patient.contact?.address) ? `, ${patient.province || patient.contact?.address}` : ''}
                                </>
                          ) : (
                                patient.age ? `อายุ ${patient.age.split(' ')[0]} ปี` : ''
                          )}
                       </p>
                       <div className="bg-white border border-[#2F80ED] px-2 py-0.5 rounded-full flex items-center justify-center shrink-0 ml-2 text-[rgb(112,102,169)]">
                         <span className="text-[10px] font-bold text-[rgb(112,102,169)]">Cleft Lip - left</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 {role === 'scfc' && (
                     null
                 )}
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