import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Filter as FilterIcon, 
  MoreHorizontal, 
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  Trash2,
  MapPin,
  Home,
  Stethoscope,
  User,
  Save,
  PenSquare,
  Phone,
  AlertTriangle,
  X,
  ChevronRight,
  Baby,
  Video,
  Hospital as HospitalIcon,
  Info,
  TrendingUp,
  Activity,
  Users,
  ChevronDown,
  ChevronUp,
  Globe
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "../../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { cn } from "../../../../components/ui/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../components/ui/tabs";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Separator } from "../../../../components/ui/separator";
import { AddMedicalRecord } from "../patient/AddMedicalRecord";
import { EditMedicalRecord } from "../patient/EditMedicalRecord";

// --- Types ---

interface Patient {
  id: string;
  hn: string;
  name: string;
  dob: string;
  diagnosis: "Cleft Lip" | "Cleft Palate" | "Cleft Lip and Palate";
  status: "Active" | "Completed" | "Drop-out" | "Inactive" | "Loss to Follow-up";
  hospital: string;
  province: string;
  diagnosingPhysician: string;
  currentSpecialty: "Surgery" | "Dental" | "Speech Therapy" | "ENT" | "General";
  img?: string;
  hasAlert?: boolean; 
  lastActiveDate: string; 
}

interface Milestone {
  id: string;
  title: string;
  category: "Surgery" | "Dental" | "Speech Therapy" | "ENT" | "General";
  targetAge: string; 
  targetDate: string; 
  actualDate?: string;
  status: "Pending" | "Upcoming" | "Overdue" | "Completed";
  notes?: string;
  location?: string;
  room?: string;
  doctor?: string;
}

// --- Mock Data ---

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    hn: "1-1000-00493-00-0",
    name: "สมชาย ใจดี",
    dob: "2023-10-15",
    diagnosis: "Cleft Lip",
    status: "Active",
    hospital: "รพ.มหาราชนครเชียงใหม่",
    province: "เชียงใหม่",
    diagnosingPhysician: "นพ. สมศักดิ์ ประเสริฐสุข",
    currentSpecialty: "Surgery",
    hasAlert: true,
    lastActiveDate: "2025-01-10"
  },
  {
    id: "2",
    hn: "1-1001-00868-00-1",
    name: "วิภาวี รักไทย",
    dob: "2020-05-20",
    diagnosis: "Cleft Palate",
    status: "Loss to Follow-up",
    hospital: "รพ.เชียงรายประชานุเคราะห์",
    province: "เชียงราย",
    diagnosingPhysician: "พญ. พรทิพย์ มั่งคั่ง",
    currentSpecialty: "Speech Therapy",
    hasAlert: true,
    lastActiveDate: "2023-05-20"
  },
  {
    id: "3",
    hn: "1-1002-00034-00-2",
    name: "ประวิทย์ มั่นคง",
    dob: "2024-01-01",
    diagnosis: "Cleft Lip and Palate",
    status: "Active",
    hospital: "รพ.ลำพูน",
    province: "ลำพูน",
    diagnosingPhysician: "นพ. วิศรุต เก่งกาจ",
    currentSpecialty: "Dental",
    hasAlert: true,
    lastActiveDate: "2025-01-20"
  },
  {
    id: "4",
    hn: "1-1003-00123-00-3",
    name: "กัญญา รักเรียน",
    dob: "2022-03-12",
    diagnosis: "Cleft Lip",
    status: "Inactive",
    hospital: "รพ.ฝาง",
    province: "เชียงใหม่",
    diagnosingPhysician: "พญ. รสสุคนธ์",
    currentSpecialty: "ENT",
    hasAlert: false,
    lastActiveDate: "2024-02-15"
  },
  {
    id: "5",
    hn: "1-1004-00555-00-4",
    name: "มานะ ขยันยิ่ง",
    dob: "2021-11-30",
    diagnosis: "Cleft Palate",
    status: "Active",
    hospital: "รพ.มหาราชนครเชียงใหม่",
    province: "เชียงใหม่",
    diagnosingPhysician: "นพ. เกรียงไกร",
    currentSpecialty: "Surgery",
    hasAlert: false,
    lastActiveDate: "2025-01-05"
  }
];

const DEFAULT_PLAN_CL: Milestone[] = [
  { id: "m1", title: "รับคำปรึกษาเบื้องต้น", category: "General", targetAge: "แรกเกิด", targetDate: "2023-10-20", status: "Completed", actualDate: "2023-10-20" },
  { id: "m2", title: "ใส่เพดานเทียม (Obturator)", category: "Dental", targetAge: "1-2 สัปดาห์", targetDate: "2023-11-01", status: "Completed", actualDate: "2023-11-05" },
  { id: "m3", title: "เย็บริมฝีปาก (Cheiloplasty)", category: "Surgery", targetAge: "3 เดือน", targetDate: "2024-01-15", status: "Overdue", notes: "ผู้ป่วยป่วย เลื่อนนัด" },
  { id: "m4", title: "ตรวจการได้ยิน", category: "ENT", targetAge: "3-6 เดือน", targetDate: "2024-03-15", status: "Upcoming" },
];

const DEFAULT_PLAN_CP: Milestone[] = [
  { id: "m1", title: "รับคำปรึกษาเบื้องต้น", category: "General", targetAge: "แรกเกิด", targetDate: "2020-05-25", status: "Completed" },
  { id: "m2", title: "เย็บเพดานปาก (Palatoplasty)", category: "Surgery", targetAge: "9-12 เดือน", targetDate: "2021-05-20", status: "Completed" },
  { id: "m3", title: "ฝึกพูด (Speech Therapy)", category: "Speech Therapy", targetAge: "2-3 ปี", targetDate: "2023-05-20", status: "Completed" },
  { id: "m4", title: "ประเมินพัฒนาการ", category: "General", targetAge: "4 ปี", targetDate: "2024-05-20", status: "Pending" },
];

const DEFAULT_PLAN_CLP: Milestone[] = [
  { id: "m1", title: "รับคำปรึกษา/จัดท่าให้นม", category: "General", targetAge: "แรกเกิด", targetDate: "2024-01-05", status: "Completed" },
  { id: "m2", title: "NAM / Obturator", category: "Dental", targetAge: "1 สัปดาห์", targetDate: "2024-01-10", status: "Upcoming" },
  { id: "m3", title: "เย็บริมฝีปาก", category: "Surgery", targetAge: "3 เดือน", targetDate: "2024-04-01", status: "Pending" },
  { id: "m4", title: "เย็บเพดานปาก", category: "Surgery", targetAge: "9-12 เดือน", targetDate: "2025-01-01", status: "Pending" },
];

// --- Helpers ---

const getStatusColor = (status: Milestone["status"]) => {
  switch (status) {
    case "Completed": return "text-green-500 bg-green-50 border-green-200";
    case "Upcoming": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "Overdue": return "text-[#F44336] bg-red-50 border-red-200";
    default: return "text-gray-400 bg-gray-50 border-gray-200";
  }
};

const getStatusIcon = (status: Milestone["status"]) => {
  switch (status) {
    case "Completed": return <CheckCircle2 className="w-5 h-5" />;
    case "Upcoming": return <Clock className="w-5 h-5" />;
    case "Overdue": return <AlertCircle className="w-5 h-5" />;
    default: return <Circle className="w-5 h-5" />;
  }
};

// --- Components ---

interface TreatmentPlanSystemProps {
  initialPatientId?: string | null;
  onBack?: () => void;
  onViewPatient?: (patient: any) => void;
}

export function TreatmentPlanSystem({ initialPatientId, onBack, onViewPatient }: TreatmentPlanSystemProps = {}) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(initialPatientId || null);

  useEffect(() => {
    if (initialPatientId) setSelectedPatientId(initialPatientId);
  }, [initialPatientId]);
  
  // Advanced Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvince, setFilterProvince] = useState<string>("All");
  const [filterHospital, setFilterHospital] = useState<string>("All");
  const [filterDiagnosis, setFilterDiagnosis] = useState<string>("All");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("All");
  const [filterActivity, setFilterActivity] = useState<string>("All"); 
  const [needsFollowUpOnly, setNeedsFollowUpOnly] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  const [currentPlan, setCurrentPlan] = useState<Milestone[]>([]);

  useEffect(() => {
    if (selectedPatientId) {
      const patient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);
      if (patient) {
        if (patient.diagnosis === "Cleft Lip") setCurrentPlan([...DEFAULT_PLAN_CL]);
        else if (patient.diagnosis === "Cleft Palate") setCurrentPlan([...DEFAULT_PLAN_CP]);
        else setCurrentPlan([...DEFAULT_PLAN_CLP]);
      }
    } else {
      setCurrentPlan([]);
    }
  }, [selectedPatientId]);

  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);

  // Filter Logic
  const filteredPatients = MOCK_PATIENTS.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.hn.includes(searchTerm);
    const matchesProvince = filterProvince === "All" || p.province === filterProvince;
    const matchesHospital = filterHospital === "All" || p.hospital === filterHospital;
    const matchesDiagnosis = filterDiagnosis === "All" || p.diagnosis === filterDiagnosis;
    const matchesSpecialty = filterSpecialty === "All" || p.currentSpecialty === filterSpecialty;
    const matchesActivity = filterActivity === "All" || 
      (filterActivity === "Active" && p.status === "Active") || 
      (filterActivity === "Inactive" && p.status === "Inactive");
    
    const matchesFollowUp = !needsFollowUpOnly || (p.hasAlert || p.status === "Loss to Follow-up");

    return matchesSearch && matchesProvince && matchesHospital && matchesDiagnosis && matchesSpecialty && matchesActivity && matchesFollowUp;
  });

  const clearFilters = () => {
    setFilterProvince("All");
    setFilterHospital("All");
    setFilterDiagnosis("All");
    setFilterSpecialty("All");
    setFilterActivity("All");
    setNeedsFollowUpOnly(false);
    setSearchTerm("");
  };

  const handleUpdateMilestone = (updated: Milestone) => {
    setCurrentPlan(prev => prev.map(m => m.id === updated.id ? updated : m));
    setEditingMilestone(null);
  };

  const handleAddMilestone = (newMilestone: Milestone) => {
    setCurrentPlan(prev => [...prev, newMilestone].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()));
  };

  const handlePatientClick = (patientId: string) => {
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null);
    } else {
      setSelectedPatientId(patientId);
    }
  };

  const hasActiveFilters = filterProvince !== "All" || filterHospital !== "All" || filterDiagnosis !== "All" || filterSpecialty !== "All" || filterActivity !== "All" || needsFollowUpOnly;

  return (
    <div className="flex h-[calc(100vh-100px)] w-full bg-slate-50 overflow-hidden rounded-xl border shadow-sm font-sans">
      
      {/* Sidebar: Patient List */}
      <div className="w-[360px] flex flex-col border-r bg-white shrink-0">
        <div className="p-5 border-b space-y-4 bg-white sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-[#4B465C] uppercase tracking-wider text-xs">
              <User className="w-4 h-4 text-[#7C4DFF]" />
              รายชื่อผู้ป่วย
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ค้นหาชื่อ หรือ HN..." 
              className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl font-bold text-sm" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs value={needsFollowUpOnly ? "alert" : "all"} onValueChange={(v) => setNeedsFollowUpOnly(v === "alert")} className="w-full">
            <TabsList className="w-full grid grid-cols-2 p-1 bg-slate-100 rounded-xl h-10">
              <TabsTrigger value="all" className="rounded-lg text-xs font-bold">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="alert" className="rounded-lg text-xs font-bold data-[state=active]:text-[#F44336] data-[state=active]:bg-white">
                <AlertTriangle className="w-3 h-3 mr-1.5" />
                ต้องติดตาม
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-slate-50">
            {filteredPatients.length > 0 ? filteredPatients.map(patient => (
              <div 
                key={patient.id}
                onClick={() => handlePatientClick(patient.id)}
                className={cn(
                  "p-5 cursor-pointer hover:bg-slate-50 transition-all flex items-start gap-4",
                  selectedPatientId === patient.id ? "bg-[#7C4DFF]/5 border-l-4 border-[#7C4DFF]" : "border-l-4 border-transparent"
                )}
              >
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-100">
                  <AvatarFallback className={cn("text-xs font-black", selectedPatientId === patient.id ? "text-white bg-[#7C4DFF]" : "bg-slate-100 text-slate-500")}>
                    {patient.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-[15px] truncate text-[#4B465C] tracking-tight leading-none mb-1">{patient.name}</h4>
                    {(patient.hasAlert || patient.status === "Loss to Follow-up") && <div className="w-2 h-2 rounded-full bg-[#F44336] shadow-[0_0_8px_rgba(244,67,54,0.5)] mt-1 animate-pulse" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium">HN: {patient.hn}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <HospitalIcon className="w-3 h-3 text-slate-400" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{patient.hospital}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2.5">
                    <Badge variant="outline" className="text-[9px] px-2 py-0.5 h-auto font-black uppercase tracking-widest bg-white border-slate-200">
                      {patient.diagnosis}
                    </Badge>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center space-y-2 opacity-50">
                <Search className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold text-slate-400">ไม่พบรายชื่อผู้ป่วย</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
        {/* Header Filter Bar - Persistent for Main Content */}
        {!isAdding && !editingMilestone && (
          <div className="bg-white border-b px-8 py-4 z-20 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Globe className="w-4 h-4 text-[#7C4DFF]" />
                <select 
                  className="bg-transparent text-xs font-black uppercase tracking-tight outline-none cursor-pointer text-[#4B465C]"
                  value={filterProvince}
                  onChange={(e) => setFilterProvince(e.target.value)}
                >
                  <option value="All">ทุกจังหวัด</option>
                  <option value="เชียงใหม่">เชียงใหม่</option>
                  <option value="เชียงราย">เชียงราย</option>
                  <option value="ลำพูน">ลำพูน</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <HospitalIcon className="w-4 h-4 text-[#7C4DFF]" />
                <select 
                  className="bg-transparent text-xs font-black uppercase tracking-tight outline-none cursor-pointer text-[#4B465C]"
                  value={filterHospital}
                  onChange={(e) => setFilterHospital(e.target.value)}
                >
                  <option value="All">ทุกโรงพยาบาล</option>
                  <option value="รพ.มหาราชนครเชียงใหม่">มหาราชนครเชียงใหม่</option>
                  <option value="รพ.ฝาง">รพ.ฝาง</option>
                  <option value="รพ.เชียงรายประชานุเคราะห์">เชียงรายประชานุเคราะห์</option>
                  <option value="รพ.ลำพูน">รพ.ลำพูน</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Activity className="w-4 h-4 text-[#7C4DFF]" />
                <select 
                  className="bg-transparent text-xs font-black uppercase tracking-tight outline-none cursor-pointer text-[#4B465C]"
                  value={filterDiagnosis}
                  onChange={(e) => setFilterDiagnosis(e.target.value)}
                >
                  <option value="All">ทุกประเภทโรค</option>
                  <option value="Cleft Lip">ปากแหว่ง</option>
                  <option value="Cleft Palate">เพดานโหว่</option>
                  <option value="Cleft Lip and Palate">ปากแหว่งเพดานโหว่</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Stethoscope className="w-4 h-4 text-[#7C4DFF]" />
                <select 
                  className="bg-transparent text-xs font-black uppercase tracking-tight outline-none cursor-pointer text-[#4B465C]"
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                >
                  <option value="All">ทุกสายงาน</option>
                  <option value="Surgery">ศัลยกรรม</option>
                  <option value="Dental">ทันตกรรม</option>
                  <option value="ENT">หูคอจมูก</option>
                  <option value="Speech Therapy">ฝึกพูด</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl">
                 <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn("h-6 px-2 text-[9px] font-black rounded-lg transition-all", filterActivity === "Active" ? "bg-[#7C4DFF] text-white" : "text-slate-500 hover:bg-slate-200")}
                    onClick={() => setFilterActivity(filterActivity === "Active" ? "All" : "Active")}
                 >
                    Active
                 </Button>
                 <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn("h-6 px-2 text-[9px] font-black rounded-lg transition-all", filterActivity === "Inactive" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-200")}
                    onClick={() => setFilterActivity(filterActivity === "Inactive" ? "All" : "Inactive")}
                 >
                    Inactive
                 </Button>
              </div>

              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 px-4 text-[10px] font-black text-[#F44336] uppercase tracking-widest hover:bg-red-50"
                  onClick={clearFilters}
                >
                  <X className="w-3 h-3 mr-2" />
                  ล้างค่าทั้งหมด
                </Button>
              )}
            </div>

            {hasActiveFilters && (
               <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-50 mt-1">
                  {filterProvince !== "All" && <Badge className="bg-[#7C4DFF]/10 text-[#7C4DFF] font-black text-[9px] uppercase">จ.{filterProvince}</Badge>}
                  {filterHospital !== "All" && <Badge className="bg-[#7C4DFF]/10 text-[#7C4DFF] font-black text-[9px] uppercase">{filterHospital}</Badge>}
                  {filterDiagnosis !== "All" && <Badge className="bg-slate-100 text-slate-600 font-black text-[9px] uppercase">{filterDiagnosis}</Badge>}
                  {filterSpecialty !== "All" && <Badge className="bg-emerald-50 text-emerald-600 font-black text-[9px] uppercase">{filterSpecialty}</Badge>}
               </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {isAdding ? (
              <AddMedicalRecord 
                  onAdd={(data) => {
                      handleAddMilestone(data);
                      setIsAdding(false);
                  }}
                  onBack={() => setIsAdding(false)}
              />
          ) : editingMilestone ? (
              <EditMedicalRecord 
                  initialData={editingMilestone}
                  onSave={handleUpdateMilestone}
                  onBack={() => setEditingMilestone(null)}
              />
          ) : selectedPatient ? (
            <>
              {/* Header Profile */}
              <header className="bg-white border-b px-8 py-6 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-6">
                   <div className="h-16 w-16 rounded-2xl bg-[#7C4DFF]/10 flex items-center justify-center shadow-inner border border-[#7C4DFF]/20 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                      <Baby className="w-8 h-8 text-[#7C4DFF] group-hover:scale-110 transition-transform" />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1.5">
                         <h1 className="text-2xl font-black text-[#4B465C] tracking-tight">{selectedPatient.name}</h1>
                         <Badge className={cn("font-black text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm", 
                           selectedPatient.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : 
                           selectedPatient.status === "Loss to Follow-up" ? "bg-[#F44336] text-white shadow-red-500/20" : "bg-slate-400 text-white")}>
                           {selectedPatient.status}
                         </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-bold">
                          <FileText className="w-3.5 h-3.5 text-slate-400" /> 
                          <span className="text-slate-500">HN:</span> {selectedPatient.hn}
                        </div>
                        <Separator orientation="vertical" className="h-3 bg-slate-200" />
                        <div className="flex items-center gap-1.5 font-bold">
                          <HospitalIcon className="w-3.5 h-3.5 text-[#7C4DFF]" />
                          <span className="text-[#7C4DFF] uppercase tracking-tight">{selectedPatient.hospital}</span>
                        </div>
                        <Separator orientation="vertical" className="h-3 bg-slate-200" />
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-[#7C4DFF]/5 text-[#7C4DFF] border-[#7C4DFF]/20 gap-2 py-1 px-3 rounded-xl font-black text-[11px] uppercase tracking-widest">
                            {selectedPatient.diagnosis}
                            <Separator orientation="vertical" className="h-3 bg-[#7C4DFF]/20" />
                            <span className="opacity-80">ผู้รับผิดชอบ: {selectedPatient.diagnosingPhysician}</span>
                          </Badge>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center">
                      <Button className="bg-[#7C4DFF] hover:bg-[#6B3FD4] rounded-l-2xl rounded-r-none border-r border-white/20 h-12 px-6 font-black text-xs uppercase tracking-widest shadow-lg shadow-[#7C4DFF]/20 transition-all active:scale-95">
                        <Video className="w-4 h-4 mr-2" />
                        Start Tele-consult
                      </Button>
                      <Button variant="outline" className="bg-white text-[#7C4DFF] border-[#7C4DFF] border-l-0 rounded-r-2xl rounded-l-none h-12 px-5 font-black text-xs uppercase tracking-widest hover:bg-[#7C4DFF]/5 shadow-sm transition-all">
                        <Info className="w-4 h-4 mr-2" />
                        ข้อมูลติดต่อ
                      </Button>
                   </div>
                   <Button 
                      className="bg-slate-900 hover:bg-black text-white h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-black/10 transition-all active:scale-95"
                      onClick={() => setIsAdding(true)}
                   >
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มรายการ
                   </Button>
                </div>
              </header>

              {/* Timeline Area */}
              <div className="p-8 md:px-16 scroll-smooth">
                 <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h2 className="text-xl font-black text-[#4B465C] flex items-center gap-2 uppercase tracking-tight">
                             <MapPin className="w-6 h-6 text-[#7C4DFF]" />
                             เส้นทางการรักษา <span className="text-[#7C4DFF] font-black italic">(Treatment Journey)</span>
                          </h2>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Comprehensive Multidisciplinary Care Pathway</p>
                       </div>
                       <Badge variant="secondary" className="bg-white text-slate-500 border border-slate-200 px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-sm">
                          ทั้งหมด {currentPlan.length} ขั้นตอน
                       </Badge>
                    </div>

                    {/* Vertical Timeline */}
                    <div className="relative pl-10 space-y-10 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-1 before:bg-slate-200 before:rounded-full">
                       {currentPlan.map((milestone, index) => (
                          <TimelineNode 
                             key={milestone.id} 
                             milestone={milestone} 
                             isLast={index === currentPlan.length - 1}
                             onEdit={() => setEditingMilestone(milestone)}
                          />
                       ))}
                       
                       {/* End Node */}
                       <div className="relative flex items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                          <div className="absolute -left-[35px] w-10 h-10 rounded-full border-4 border-slate-100 bg-slate-200 flex items-center justify-center z-10 shadow-sm">
                             <div className="w-3 h-3 rounded-full bg-slate-400" />
                          </div>
                          <div className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] italic bg-slate-100 px-4 py-2 rounded-xl border border-dashed border-slate-300">
                             สิ้นสุดแผนการรักษาปัจจุบัน
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </>
          ) : (
            <SystemOverview onSelectPatient={handlePatientClick} />
          )}
        </div>
      </div>

    </div>
  );
}

// --- Sub-Components ---

function SystemOverview({ onSelectPatient }: { onSelectPatient: (id: string) => void }) {
  return (
    <div className="p-8 bg-[#f8f9fa] scroll-smooth">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-[#7C4DFF]/5 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C4DFF]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <Badge className="bg-[#7C4DFF]/10 text-[#7C4DFF] hover:bg-[#7C4DFF]/15 border-none px-4 py-1.5 rounded-full font-black text-[11px] uppercase tracking-[0.2em] mb-4">
              Dashboard ศูนย์บัญชาการ (Command Center)
            </Badge>
            <h1 className="text-4xl font-black text-[#4B465C] tracking-tight leading-tight mb-4">
              ThaiCleftLink <span className="text-[#7C4DFF]">Overview</span>
            </h1>
            <p className="text-slate-500 font-medium max-w-2xl leading-relaxed">
              ยินดีต้อนรับสู่ระบบบริหารจัดการผู้ป่วยปากแหว่งเพดานโหว่ (SCFC Overseer) 
              คุณสามารถติดตามสถานะการรักษา งบประมาณ และการออกเยี่ยมบ้านได้จากภาพรวมด้านล่างนี้
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "ผู้ป่วยทั้งหมด", value: "1,284", icon: Users, color: "text-[#7C4DFF]", bg: "bg-[#7C4DFF]/10" },
            { label: "แผนการรักษาที่ดำเนินอยู่", value: "452", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "รอการผ่าตัด", value: "28", icon: Stethoscope, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "แจ้งเตือนเกินกำหนด", value: "12", icon: AlertTriangle, color: "text-[#F44336]", bg: "bg-red-50" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <div className="text-2xl font-black text-[#4B465C] tracking-tight mb-0.5">{stat.value}</div>
                <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Urgent Actions */}
          <Card className="lg:col-span-2 border-none shadow-sm rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-[#4B465C] uppercase tracking-tight">รายการที่ต้องติดตามเร่งด่วน</CardTitle>
                  <CardDescription className="font-bold text-xs uppercase tracking-widest mt-1 text-slate-400">Items requiring immediate oversight</CardDescription>
                </div>
                <Button variant="ghost" className="text-[#7C4DFF] font-black text-[10px] uppercase tracking-widest">ดูทั้งหมด</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {MOCK_PATIENTS.filter(p => p.hasAlert || p.status === "Loss to Follow-up").map((p) => (
                  <div key={p.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onSelectPatient(p.id)}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarFallback className="bg-[#7C4DFF]/5 text-[#7C4DFF] font-black text-xs">{p.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-black text-[15px] text-[#4B465C] leading-none mb-1.5 group-hover:text-[#7C4DFF] transition-colors">{p.name}</h4>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-rose-100 text-[#F44336] bg-red-50/50">
                            {p.status === "Loss to Follow-up" ? "Loss to Follow-up" : "เกินกำหนด: ผ่าตัด"}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><HospitalIcon className="w-3 h-3" /> {p.hospital}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <div className="space-y-6">
            <div className="bg-[#7C4DFF] rounded-[2rem] p-8 text-white shadow-lg shadow-[#7C4DFF]/20 relative overflow-hidden">
               <TrendingUp className="absolute -bottom-8 -right-8 w-40 h-40 text-white/10" />
               <div className="relative z-10">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">งบประมาณกองทุน</h3>
                  <div className="text-3xl font-black mb-4">฿4.2M <span className="text-xs font-normal opacity-70">คงเหลือ</span></div>
                  <div className="w-full bg-white/20 h-2 rounded-full mb-6">
                    <div className="bg-white h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                  <Button className="w-full bg-white text-[#7C4DFF] hover:bg-white/90 font-black text-[10px] uppercase tracking-widest rounded-xl h-10 border-none">
                    ตรวจสอบรายงานกองทุน
                  </Button>
               </div>
            </div>

            <Card className="border-none shadow-sm rounded-[2rem] p-8 space-y-4">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">การจัดการด่วน</h3>
               <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="justify-start h-12 rounded-2xl border-slate-100 font-bold text-slate-600 text-xs hover:bg-slate-50 hover:text-[#7C4DFF] hover:border-[#7C4DFF]/20 group">
                    <Home className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#7C4DFF]" />
                    ตารางออกเยี่ยมบ้าน
                  </Button>
                  <Button variant="outline" className="justify-start h-12 rounded-2xl border-slate-100 font-bold text-slate-600 text-xs hover:bg-slate-50 hover:text-[#7C4DFF] hover:border-[#7C4DFF]/20 group">
                    <Video className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#7C4DFF]" />
                    คิวปรึกษาทางไกล
                  </Button>
                  <Button variant="outline" className="justify-start h-12 rounded-2xl border-slate-100 font-bold text-slate-600 text-xs hover:bg-slate-50 hover:text-[#7C4DFF] hover:border-[#7C4DFF]/20 group">
                    <FileText className="w-4 h-4 mr-3 text-slate-400 group-hover:text-[#7C4DFF]" />
                    แดชบอร์ดการส่งตัว
                  </Button>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function TimelineNode({ milestone, isLast, onEdit }: { 
  milestone: Milestone; 
  isLast: boolean; 
  onEdit: () => void;
}) {
  const colorClass = getStatusColor(milestone.status);

  return (
    <div className="relative group animate-in slide-in-from-left-4 duration-700">
      {/* Connector Dot */}
      <div className={cn(
        "absolute -left-[37px] top-2 w-12 h-12 rounded-full border-[6px] border-slate-50 bg-white flex items-center justify-center z-10 transition-all group-hover:scale-110 cursor-pointer shadow-md",
        colorClass
      )}
      onClick={onEdit}
      >
         {getStatusIcon(milestone.status)}
      </div>

      {/* Content Card */}
      <Card 
        className={cn(
           "border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-[#7C4DFF]/20 cursor-pointer relative overflow-hidden rounded-[1.5rem]",
           milestone.status === 'Upcoming' ? "bg-white" : 
           milestone.status === 'Overdue' ? "bg-rose-50/30" : "bg-white"
        )}
        onClick={onEdit}
      >
         {/* Status Strip */}
         <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", 
            milestone.status === 'Completed' ? "bg-green-500" :
            milestone.status === 'Upcoming' ? "bg-amber-400" :
            milestone.status === 'Overdue' ? "bg-[#F44336] shadow-[0_0_10px_rgba(244,67,54,0.5)]" : "bg-gray-300"
         )} />

         <CardContent className="p-6 pl-8">
            <div className="flex justify-between items-start mb-4">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5 block">
                    ช่วงอายุ: {milestone.targetAge}
                  </span>
                  <h4 className="font-black text-lg text-[#4B465C] tracking-tight group-hover:text-[#7C4DFF] transition-colors leading-tight">
                    {milestone.title}
                  </h4>
               </div>
               <Badge className={cn("ml-4 rounded-lg font-black text-[9px] uppercase tracking-widest px-2.5 py-1 shadow-sm border-none", colorClass)} variant="outline">
                  {milestone.status}
               </Badge>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-slate-500 mt-2">
               <div className="flex items-center gap-2 font-bold uppercase tracking-tighter">
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  {milestone.targetDate}
               </div>
               <div className="flex items-center gap-2 font-bold uppercase tracking-tighter">
                  <div className="p-1.5 rounded-lg bg-[#7C4DFF]/5 text-[#7C4DFF]">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                  {milestone.category}
               </div>
            </div>

            {milestone.notes && (
               <div className="mt-5 text-[11px] bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 text-slate-600 font-medium leading-relaxed italic">
                  <span className="font-black text-[9px] uppercase tracking-widest text-slate-400 block mb-1">บันทึกทางการแพทย์:</span>
                  {milestone.notes}
               </div>
            )}

            {/* Overdue Action Button */}
            {milestone.status === 'Overdue' && (
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#F44336] hover:bg-red-50 text-[10px] font-black h-9 px-4 gap-2 rounded-xl transition-all border border-red-100 hover:border-red-200 uppercase tracking-widest"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("กำลังเริ่มขั้นตอนการปรับเปลี่ยนกำหนดการ...");
                  }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  เลื่อนนัด / ติดตามผล
                </Button>
              </div>
            )}
         </CardContent>
      </Card>
    </div>
  );
}
