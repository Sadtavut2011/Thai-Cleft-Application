import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { cn } from "../../../../../components/ui/utils";
import { 
  Pencil, 
  Search, 
  User, 
  ArrowLeft,
  Activity, 
  Users,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2
} from "lucide-react";
import { PATIENTS_DATA } from "../../../../../data/patientData";

// Derive data from single source (PATIENTS_DATA)
const diagnoses = [
  "ปากแหว่งด้านเดียว",
  "เพดานโหว่สมบูรณ์",
  "ปากแหว่งและเพดานโหว่",
  "ปากแหว่งสองด้าน",
  "เพดานโหว่ไม่สมบูรณ์",
  "ปากแหว่งด้านซ้าย",
  "ปากแหว่งด้านขวา"
];

const fundStatuses = [
  "Active",
  "Inactive"
];

export interface Patient {
  id: number;
  code: string;
  idCard: string;
  name: string;
  diagnosis: string;
  hospital: string;
  responsibleHealthCenter?: string;
  treatmentRight: string;
  status: string;
  patientStatusLabel?: string;
  // Optional fields
  treatmentPlan?: any[];
  treatmentHistory?: any[];
  appointments?: any[];
  referrals?: any[];
  homeVisits?: any[];
  teleConsults?: any[];
  funds?: any[];
  hn?: string;
  cid?: string;
  rights?: string;
}

const treatmentRights = [
  "บัตรทอง",
  "ประกันสังคม",
  "ข้าราชการ/รัฐวิสาหกิจ",
  "ชำระเงินเอง"
];

// --- Derive MOCK_PATIENTS from PATIENTS_DATA (single source) ---
const MOCK_PATIENTS: Patient[] = PATIENTS_DATA.map((p, i) => ({
  id: i + 1,
  code: p.hn || p.id || String(i + 1).padStart(8, '0'),
  name: p.name,
  idCard: p.cid || '-',
  hn: p.hn || p.id,
  cid: p.cid || '-',
  diagnosis: p.diagnosis || diagnoses[i % diagnoses.length],
  hospital: p.hospital || "โรงพยาบาลฝาง",
  responsibleHealthCenter: p.responsibleHealthCenter || (p as any).hospitalInfo?.responsibleRph || '-',
  treatmentRight: p.rights || treatmentRights[i % treatmentRights.length],
  rights: p.rights || treatmentRights[i % treatmentRights.length],
  status: p.status || fundStatuses[i % fundStatuses.length],
  patientStatusLabel: p.patientStatusLabel || 'ปกติ',
}));

interface PatientManagementProps {
  onBack?: () => void;
  onViewPatient?: (patient: Patient) => void;
  onRegisterPatient?: () => void;
  onViewNewPatients?: () => void;
  
  // Props for compatibility with WebDashboard
  patients?: any[];
  onSelectPatient?: (patient: any) => void;
  onAddPatient?: () => void;
}

export default function PatientManagement({ 
    onBack, 
    onViewPatient, 
    onRegisterPatient, 
    onViewNewPatients,
    patients = [],
    onSelectPatient,
    onAddPatient
}: PatientManagementProps) {
  
  // Normalize handlers
  const handleViewPatient = onViewPatient || onSelectPatient;
  const handleRegisterPatient = onRegisterPatient || onAddPatient;

  // Use provided patients if available and not empty, otherwise use mock
  // But since the provided code has specific fields (diagnosis, treatmentRight) that might not be in the 'patients' prop if it comes from a different source,
  // we need to be careful. 
  // For now, let's prefer the MOCK_PATIENTS if 'patients' is empty, or if we want to stick to the design provided.
  // The user said "Check code and apply". I'll default to MOCK_PATIENTS if patients prop is empty.
  const dataToUse = (patients && patients.length > 0) ? patients : MOCK_PATIENTS;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Advanced Filters State — single-select dropdowns
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  const [selectedTreatmentRight, setSelectedTreatmentRight] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedHealthCenter, setSelectedHealthCenter] = useState("");

  // Dynamic list of รพ.สต. (health centers) from PATIENTS_DATA
  const healthCenterOptions = useMemo(() => {
    const centers = PATIENTS_DATA
      .map(p => p.responsibleHealthCenter || (p as any).hospitalInfo?.responsibleRph || '')
      .filter(c => c && c !== '-');
    return Array.from(new Set(centers)).sort();
  }, []);

  const activeFilterCount = (selectedDiagnosis ? 1 : 0) + (selectedTreatmentRight ? 1 : 0) + (selectedStatus ? 1 : 0) + (selectedHealthCenter ? 1 : 0);

  const clearFilters = () => {
    setSelectedDiagnosis("");
    setSelectedTreatmentRight("");
    setSelectedStatus("");
    setSelectedHealthCenter("");
  };

  // Helper to get color based on case status (สถานะผู้ใช้งาน: Active/Inactive)
  const getCaseStatusStyle = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'active') return { label: 'Active', dotColor: 'bg-emerald-500', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' };
    if (s === 'inactive') return { label: 'Inactive', dotColor: 'bg-gray-400', textColor: 'text-gray-500', bgColor: 'bg-gray-100' };
    return { label: status || '-', dotColor: 'bg-gray-400', textColor: 'text-gray-500', bgColor: 'bg-gray-100' };
  };

  // Helper to get color based on patient clinical status (สถานะผู้ป่วย: ปกติ, รักษาเสร็จสิ้น, etc.)
  const getPatientStatusStyle = (label: string) => {
    const l = (label || 'ปกติ').toLowerCase();
    if (l === 'ปกติ') return { label: 'ปกติ', style: 'text-[#28c76f] bg-[#28c76f]/10' };
    if (l === 'รักษาเสร็จสิ้น') return { label: 'รักษาเสร็จสิ้น', style: 'text-blue-600 bg-blue-50' };
    if (l === 'loss follow up') return { label: 'Loss follow up', style: 'text-orange-600 bg-orange-50' };
    if (l === 'เสียชีวิต') return { label: 'เสียชีวิต', style: 'text-red-600 bg-red-50' };
    if (l === 'มารดา') return { label: 'มารดา', style: 'text-pink-600 bg-pink-50' };
    return { label: label || 'ปกติ', style: 'text-[#5e5873] bg-gray-100' };
  };

  const displayedPatients = dataToUse.filter(patient => {
    const term = searchTerm.toLowerCase();
    const pName = patient.name || "";
    const pIdCard = patient.idCard || patient.cid || "";
    const pHn = patient.hn || patient.code || "";
    const pDiagnosis = patient.diagnosis || "";
    const pRight = patient.treatmentRight || patient.rights || "";
    const pStatus = patient.status || "";
    const pHealthCenter = patient.responsibleHealthCenter || "";

    const cleanIdCard = pIdCard.replace(/[^0-9]/g, '');
    const cleanTerm = term.replace(/[^0-9]/g, '');
    
    const matchesSearch = pName.toLowerCase().includes(term) || 
                          pHn.toLowerCase().includes(term) ||
                          (cleanTerm.length > 0 && cleanIdCard.includes(cleanTerm));
    
    const matchesDiagnosis = selectedDiagnosis === "" || selectedDiagnosis === pDiagnosis;
    const matchesRight = selectedTreatmentRight === "" || selectedTreatmentRight === pRight;
    const matchesStatusFilter = selectedStatus === "" || selectedStatus === pStatus;
    const matchesHealthCenter = selectedHealthCenter === "" || selectedHealthCenter === pHealthCenter;

    return matchesSearch && matchesDiagnosis && matchesRight && matchesStatusFilter && matchesHealthCenter;
  });

  const totalPages = Math.ceil(displayedPatients.length / itemsPerPage);
  const currentPatients = displayedPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const startItem = displayedPatients.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, displayedPatients.length);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative min-h-screen font-['IBM_Plex_Sans_Thai']">
      {/* Header Banner */}
      <div className="bg-[#DFF6F8] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
            {onBack && (
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-[#DFF6F8]/80 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            )}
            <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                <User className="w-5 h-5" /> จัดารข้อมูลผู้ป่วย (Patient Management)
            </h1>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{dataToUse.length}</p>
                  <p className="text-blue-600/80 text-sm">รายชื่อผู้ป่วยทั้งหมด</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">
                    {dataToUse.filter(p => (p.status || '').toLowerCase() === 'active').length}
                  </p>
                  <p className="text-green-600/80 text-sm">Active</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <Activity className="w-5 h-5 text-green-600" />
              </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-gray-600 font-bold text-2xl">
                    {dataToUse.filter(p => (p.status || '').toLowerCase() === 'inactive').length}
                  </p>
                  <p className="text-gray-600/80 text-sm">Inactive</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
              </div>
          </div>
          <div 
              className="bg-cyan-50 border border-cyan-100 rounded-lg p-4 flex items-center justify-between cursor-pointer hover:bg-cyan-100/50 transition-colors"
              onClick={onViewNewPatients}
          >
              <div>
                  <p className="text-cyan-600 font-bold text-2xl">3</p>
                  <p className="text-cyan-600/80 text-sm">ค้นพบผู้ป่วยใหม่</p>
              </div>
              <div className="bg-cyan-100 p-2 rounded-full">
                  <UserPlus className="w-5 h-5 text-cyan-600" />
              </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
          <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <h2 className="text-[18px] font-bold text-[#5e5873] border-b-2 border-[#7367f0] pb-1">
                        ข้อมูลผู้ป่วย
                    </h2>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button 
                        onClick={handleRegisterPatient}
                        className="bg-[#7367f0] hover:bg-[#685dd8] text-white font-medium h-[38px] shadow-sm"
                    >
                        ลงทะเบียนผู้ป่วยใหม่
                    </Button>

                    {/* Inline Dropdown Filters */}
                    <div className="flex items-center gap-2">
                        {/* ผลการวินิจฉัย */}
                        <select
                            value={selectedDiagnosis}
                            onChange={(e) => { setSelectedDiagnosis(e.target.value); setCurrentPage(1); }}
                            className={cn(
                                "h-[38px] px-3 pr-8 border rounded-[6px] bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0]",
                                selectedDiagnosis ? "border-[#7367f0] text-[#7367f0]" : "border-gray-200 text-[#5e5873]"
                            )}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                        >
                            <option value="">ผลการวินิจฉัย</option>
                            {diagnoses.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        {/* สิทธิการรักษา */}
                        <select
                            value={selectedTreatmentRight}
                            onChange={(e) => { setSelectedTreatmentRight(e.target.value); setCurrentPage(1); }}
                            className={cn(
                                "h-[38px] px-3 pr-8 border rounded-[6px] bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0]",
                                selectedTreatmentRight ? "border-[#7367f0] text-[#7367f0]" : "border-gray-200 text-[#5e5873]"
                            )}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                        >
                            <option value="">สิทธิการรักษา</option>
                            {treatmentRights.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>

                        {/* STATUS */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                            className={cn(
                                "h-[38px] px-3 pr-8 border rounded-[6px] bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0]",
                                selectedStatus ? "border-[#7367f0] text-[#7367f0]" : "border-gray-200 text-[#5e5873]"
                            )}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                        >
                            <option value="">Status</option>
                            {fundStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {/* รพ.สต. */}
                        <select
                            value={selectedHealthCenter}
                            onChange={(e) => { setSelectedHealthCenter(e.target.value); setCurrentPage(1); }}
                            className={cn(
                                "h-[38px] px-3 pr-8 border rounded-[6px] bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0]",
                                selectedHealthCenter ? "border-[#7367f0] text-[#7367f0]" : "border-gray-200 text-[#5e5873]"
                            )}
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                        >
                            <option value="">รพ.สต.</option>
                            {healthCenterOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        {/* Clear filters */}
                        {activeFilterCount > 0 && (
                            <button
                                onClick={() => { clearFilters(); setCurrentPage(1); }}
                                className="h-[38px] w-[38px] flex items-center justify-center rounded-[6px] border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                title="ล้างตัวกรองทั้งหมด"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center w-[250px] relative">
                        <Input 
                            placeholder="ค้นหา: เลขบัตรประชาชน, ชื่อ-สกุล, HN" 
                            className="pr-10 border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-sm h-[38px] bg-white"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                        <Button 
                            size="icon" 
                            className="absolute right-0 top-0 h-[38px] w-[38px] rounded-l-none bg-[#1BBC9B] hover:bg-[#16a086]"
                        >
                            <Search className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-[6px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#f3f2f7]">
                <TableRow className="hover:bg-[#f3f2f7] border-b-0">
                  <TableHead className="w-[80px] text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">HN</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">เลขบัตรประชาชน</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">ชื่อ-นามสกุล</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">โรงพยาบาลต้นสังกัด</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">ผลการวินิจฉัย</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">สิทธิการรักษา</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">STATUS</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">หน่วยงานที่รับผิดชอบ</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px] text-right pr-8">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPatients.length > 0 ? (
                    currentPatients.map((patient, index) => (
                      <TableRow 
                        key={index} 
                        className="hover:bg-gray-50 border-b border-gray-100 last:border-0 h-[50px] cursor-pointer"
                        onClick={() => handleViewPatient?.(patient)}
                      >
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.code || patient.hn}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.idCard || patient.cid}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.name}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.hospital}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.diagnosis}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.treatmentRight || patient.rights}</TableCell>
                        <TableCell className="text-[12px]">
                          {(() => {
                            const caseStatus = getCaseStatusStyle(patient.status || '');
                            return (
                              <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", caseStatus.bgColor, caseStatus.textColor)}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", caseStatus.dotColor)} />
                                {caseStatus.label}
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.responsibleHealthCenter || '-'}</TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                            <Pencil className="w-4 h-4 text-[#7367F0] cursor-pointer hover:text-[#5e50ee]" />
                            <Trash2 className="w-4 h-4 text-[#ea5455] cursor-pointer hover:text-[#d63031]" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={9} className="h-[200px] text-center text-gray-500">
                            ไม่พบข้อมูล
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {displayedPatients.length > 0 && (
            <div className="flex items-center justify-between mt-2 px-1">
              {/* จำนวนที่แสดง - ด้านซ้าย */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#5e5873] whitespace-nowrap">จำนวนที่แสดง</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-[36px] px-3 pr-8 border border-gray-200 rounded-[6px] bg-white text-sm text-[#5e5873] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              {/* แสดง X - Y จาก Z + Page Navigation - ด้านขวา */}
              <div className="flex items-center gap-6">
                <span className="text-sm text-[#5e5873] whitespace-nowrap">
                  {startItem} - {endItem} จาก {displayedPatients.length}
                </span>

                {/* Page Navigation */}
                <div className="flex items-center gap-1 border border-gray-200 rounded-[6px] bg-white shadow-sm px-1 py-1">
                  {/* Previous Arrow */}
                  <button
                    className={cn(
                      "h-[34px] w-[34px] flex items-center justify-center rounded transition-colors",
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-[#5e5873] hover:bg-[#7367f0]/10 hover:text-[#7367f0]"
                    )}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={cn(
                        "h-[34px] min-w-[34px] px-2 flex items-center justify-center rounded text-sm font-medium transition-colors",
                        currentPage === page
                          ? "bg-[#7367f0] text-white shadow-sm"
                          : "text-[#5e5873] hover:bg-[#7367f0]/10 hover:text-[#7367f0]"
                      )}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Arrow */}
                  <button
                    className={cn(
                      "h-[34px] w-[34px] flex items-center justify-center rounded transition-colors",
                      currentPage >= totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-[#5e5873] hover:bg-[#7367f0]/10 hover:text-[#7367f0]"
                    )}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}