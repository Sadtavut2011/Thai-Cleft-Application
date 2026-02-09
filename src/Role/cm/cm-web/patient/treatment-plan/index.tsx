import React, { useState } from "react";
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
import { Badge } from "../../../../../components/ui/badge";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Label } from "../../../../../components/ui/label";
import { 
  Eye, 
  Pencil, 
  Search, 
  ArrowUpDown, 
  User, 
  ArrowLeft,
  Activity, 
  Users,
  UserPlus,
  Filter,
  ChevronUp,
  ChevronDown,
  X
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";

// Mock Data
const patientNames = [
  "สมชาย ใจดี", "วิภาวี รักไทย", "ประวิทย์ มั่นคง", "กานดา สุขใจ",
  "ณัฐพล มีทรัพย์", "สิริพร งามตา", "วรวิทย์ กล้าหาญ", "ดวงกมล สดใส",
  "อำพล ยิ่งใหญ่", "พิมพา วงศ์สวัสดิ์", "ธีรพงศ์ เก่งกล้า", "สุดาพร มั่งมี", "เกรียงไกร ชนะเลิศ"
];

const fundStatuses = [
  "Active",
  "Inactive"
];

const diagnoses = [
  "ปากแหว่งด้านเดียว",
  "เพดานโหว่สมบูรณ์",
  "ปากแหว่งและเพดานโหว่",
  "ปากแหว่งสองด้าน",
  "เพดานโหว่ไม่สมบูรณ์",
  "ปากแหว่งด้านซ้าย",
  "ปากแหว่งด้านขวา"
];

export interface Patient {
  id: number;
  code: string;
  idCard: string;
  name: string;
  diagnosis: string;
  hospital: string;
  treatmentRight: string;
  status: string;
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

const MOCK_PATIENTS: Patient[] = patientNames.map((name, i) => ({
  id: i + 1,
  code: String(i + 1).padStart(8, '0'),
  name: name,
  idCard: `1-100${i}-00${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-00-${i % 9}`,
  hn: `HN-${String(i + 1).padStart(6, '0')}`,
  cid: `1-100${i}-00${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-00-${i % 9}`,
  diagnosis: diagnoses[i % diagnoses.length],
  hospital: "โรงพยาบาลฝาง",
  treatmentRight: treatmentRights[i % treatmentRights.length],
  rights: treatmentRights[i % treatmentRights.length],
  status: fundStatuses[i % fundStatuses.length],
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
  
  // Advanced Filters State
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [selectedTreatmentRights, setSelectedTreatmentRights] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const activeFilterCount = selectedDiagnoses.length + selectedTreatmentRights.length + selectedStatuses.length;

  const toggleFilter = (current: string[], setFn: (val: string[]) => void, item: string) => {
    if (current.includes(item)) {
      setFn(current.filter(i => i !== item));
    } else {
      setFn([...current, item]);
    }
  };

  const clearFilters = () => {
    setSelectedDiagnoses([]);
    setSelectedTreatmentRights([]);
    setSelectedStatuses([]);
  };

  // Helper to get color based on status
  const getStatusColor = (status: string) => {
    // Normalize status check
    if (!status) return "text-[#5e5873]";
    const s = status.toLowerCase();
    
    if (s === 'active' || s === 'checked-in') return "text-[#28c76f] bg-[#28c76f]/10 px-2 py-1 rounded-full text-xs font-bold";
    if (s === 'inactive') return "text-[#82868b] bg-[#82868b]/10 px-2 py-1 rounded-full text-xs font-bold";
    return "text-[#5e5873] bg-gray-100 px-2 py-1 rounded-full text-xs font-bold";
  };

  const displayedPatients = dataToUse.filter(patient => {
    const term = searchTerm.toLowerCase();
    const pName = patient.name || "";
    const pIdCard = patient.idCard || patient.cid || "";
    const pHn = patient.hn || patient.code || "";
    const pDiagnosis = patient.diagnosis || "";
    const pRight = patient.treatmentRight || patient.rights || "";
    const pStatus = patient.status || "";

    const cleanIdCard = pIdCard.replace(/[^0-9]/g, '');
    const cleanTerm = term.replace(/[^0-9]/g, '');
    
    const matchesSearch = pName.toLowerCase().includes(term) || 
                          pHn.toLowerCase().includes(term) ||
                          (cleanTerm.length > 0 && cleanIdCard.includes(cleanTerm));
    
    const matchesDiagnosis = selectedDiagnoses.length === 0 || selectedDiagnoses.includes(pDiagnosis);
    const matchesRight = selectedTreatmentRights.length === 0 || selectedTreatmentRights.includes(pRight);
    const matchesStatusFilter = selectedStatuses.length === 0 || selectedStatuses.includes(pStatus);

    return matchesSearch && matchesDiagnosis && matchesRight && matchesStatusFilter;
  });

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
                <User className="w-5 h-5" /> จัดการข้อมูลผู้ป่วย (Patient Management)
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

                    {/* Sort & Filter Controls */}
                    <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        className={cn(
                            "h-[38px] border-gray-200 text-[#5e5873] bg-white gap-2",
                            activeFilterCount > 0 && "border-[#7367f0] text-[#7367f0] bg-[#7367f0]/5",
                            isFilterExpanded && "ring-2 ring-[#7367f0]/20 border-[#7367f0]"
                        )}
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    >
                        <Filter className="w-4 h-4" />
                        ตัวกรอง
                        {activeFilterCount > 0 && (
                            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-[#7367f0] text-white hover:bg-[#7367f0]">
                                {activeFilterCount}
                            </Badge>
                        )}
                        {isFilterExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                    </Button>

                         {/* Sort Button (Visual Only for now) */}
                         <Button variant="outline" size="icon" className="h-[38px] w-[38px] border-gray-200">
                            <ArrowUpDown className="text-[#5e5873] w-4 h-4" />
                         </Button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center w-[250px] relative">
                        <Input 
                            placeholder="ค้นหา: เลขบัตรประชาชน, ชื่อ-สกุล, HN" 
                            className="pr-10 border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-sm h-[38px] bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
            {isFilterExpanded && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white p-6 rounded-[6px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 mt-2">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h4 className="font-semibold text-[#5e5873] flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            ตัวกรองข้อมูลขั้นสูง (Advanced Filters)
                        </h4>
                        {(activeFilterCount > 0) && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                                onClick={clearFilters}
                            >
                                <X className="w-4 h-4" />
                                ล้างค่าทั้งหมด
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* 1. Diagnosis Filter */}
                        <div className="space-y-4">
                            <Label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                ผลการวินิจฉัย
                                {selectedDiagnoses.length > 0 && <span className="text-[#7367f0] text-xs">({selectedDiagnoses.length})</span>}
                            </Label>
                            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
                                {diagnoses.map((diagnosis) => (
                                    <div key={diagnosis} className="flex items-center space-x-2 group">
                                        <Checkbox 
                                            id={`diagnosis-${diagnosis}`} 
                                            checked={selectedDiagnoses.includes(diagnosis)}
                                            onCheckedChange={() => toggleFilter(selectedDiagnoses, setSelectedDiagnoses, diagnosis)}
                                            className="data-[state=checked]:bg-[#7367f0] data-[state=checked]:border-[#7367f0]"
                                        />
                                        <Label 
                                            htmlFor={`diagnosis-${diagnosis}`}
                                            className="text-sm font-normal cursor-pointer text-[#5e5873] group-hover:text-[#7367f0] transition-colors"
                                        >
                                            {diagnosis}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Treatment Rights Filter */}
                        <div className="space-y-4 border-l border-gray-100 pl-8">
                            <Label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                สิทธิการรักษา
                                {selectedTreatmentRights.length > 0 && <span className="text-[#7367f0] text-xs">({selectedTreatmentRights.length})</span>}
                            </Label>
                            <div className="grid grid-cols-1 gap-3">
                                {treatmentRights.map((right) => (
                                    <div key={right} className="flex items-center space-x-2 group">
                                        <Checkbox 
                                            id={`right-${right}`} 
                                            checked={selectedTreatmentRights.includes(right)}
                                            onCheckedChange={() => toggleFilter(selectedTreatmentRights, setSelectedTreatmentRights, right)}
                                            className="data-[state=checked]:bg-[#7367f0] data-[state=checked]:border-[#7367f0]"
                                        />
                                        <Label 
                                            htmlFor={`right-${right}`}
                                            className="text-sm font-normal cursor-pointer text-[#5e5873] group-hover:text-[#7367f0] transition-colors"
                                        >
                                            {right}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Status Filter */}
                        <div className="space-y-4 border-l border-gray-100 pl-8">
                            <Label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                สถานะ (Status)
                                {selectedStatuses.length > 0 && <span className="text-[#7367f0] text-xs">({selectedStatuses.length})</span>}
                            </Label>
                            <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 space-y-3">
                                {fundStatuses.map((status) => (
                                    <div key={status} className="flex items-center space-x-2 group">
                                        <Checkbox 
                                            id={`status-${status}`} 
                                            checked={selectedStatuses.includes(status)}
                                            onCheckedChange={() => toggleFilter(selectedStatuses, setSelectedStatuses, status)}
                                            className="data-[state=checked]:bg-[#7367f0] data-[state=checked]:border-[#7367f0]"
                                        />
                                        <Label 
                                            htmlFor={`status-${status}`}
                                            className="text-sm font-normal cursor-pointer text-[#5e5873] flex items-center gap-2 group-hover:text-[#7367f0] transition-colors"
                                        >
                                            {status}
                                            <span className={cn(
                                                "w-2 h-2 rounded-full inline-block",
                                                status === 'Active' ? "bg-green-500" : "bg-gray-400"
                                            )} />
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
          </div>

          <div className="bg-white rounded-[6px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#f3f2f7]">
                <TableRow className="hover:bg-[#f3f2f7] border-b-0">
                  <TableHead className="w-[50px] text-[#000] font-semibold uppercase tracking-wider text-[12px]">#</TableHead>
                  <TableHead className="w-[80px] text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">HN</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">เลขบัตรประชาชน</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">ชื่อ-นามสกุล</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">ผลการวินิจฉัย</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">โรงพยาบาลต้นสังกัด</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">สิทธิการรักษา</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px]">STATUS</TableHead>
                  <TableHead className="text-[#5e5873] font-semibold uppercase tracking-wider text-[12px] text-right pr-8">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPatients.length > 0 ? (
                    displayedPatients.map((patient, index) => (
                      <TableRow 
                        key={index} 
                        className="hover:bg-gray-50 border-b border-gray-100 last:border-0 h-[50px] cursor-pointer"
                        onClick={() => handleViewPatient?.(patient)}
                      >
                        <TableCell className="font-semibold text-black text-[12px]">{patient.id}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.code || patient.hn}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.idCard || patient.cid}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.name}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.diagnosis}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.hospital}</TableCell>
                        <TableCell className="text-[#5e5873] text-[12px]">{patient.treatmentRight || patient.rights}</TableCell>
                        <TableCell className="text-[12px]">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-bold",
                              patient.status?.toLowerCase() === "active"
                                ? "text-[#28c76f] bg-[#28c76f]/10"
                                : "text-[#82868b] bg-[#82868b]/10"
                            )}
                          >
                            {patient.status?.toLowerCase() === "active" ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                            <Eye 
                              className="w-4 h-4 text-[#53D1B6] cursor-pointer hover:text-[#42a890]" 
                              onClick={() => handleViewPatient?.(patient)}
                            />
                            <Pencil className="w-4 h-4 text-[#7367F0] cursor-pointer hover:text-[#5e50ee]" />
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
      </div>
    </div>
  );
}
