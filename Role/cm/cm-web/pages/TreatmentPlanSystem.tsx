import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
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
  ChevronDown,
  ChevronUp
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
import { AddMedicalRecord } from "../patient/AddMedicalRecord";
import { EditMedicalRecord } from "../patient/EditMedicalRecord";
import { AppointmentDetailPage } from "../patient/details/AppointmentDetailPage";
import { PATIENTS_DATA } from "../../../../data/patientData";
import type { MilestoneStatus, MilestoneCategory, SecondaryBooking } from "../../../../data/types";
import { formatMilestoneStatus } from "../../../../data/statusUtils";

// --- Types --- (Using shared types from /data/types.ts)

interface Milestone {
  id: string;
  title: string;
  category: MilestoneCategory;
  targetAge: string;
  targetDate: string;
  estimatedDate?: string;
  actualDate?: string;
  status: MilestoneStatus;
  notes?: string;
  location?: string;
  room?: string;
  doctor?: string;
  secondaryBookings?: SecondaryBooking[];
}

// --- Helpers ---

const getStatusColor = (status: Milestone["status"]) => {
  switch (status) {
    case "Completed": return "text-green-500 bg-green-50 border-green-200";
    case "Upcoming": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "Overdue": return "text-red-500 bg-red-50 border-red-200";
    case "Pending": return "text-blue-500 bg-blue-50 border-blue-200";
    default: return "text-gray-400 bg-gray-50 border-gray-200";
  }
};

const getStatusIcon = (status: Milestone["status"]) => {
  switch (status) {
    case "Completed": return <CheckCircle2 className="w-5 h-5" />;
    case "Upcoming": return <Clock className="w-5 h-5" />;
    case "Overdue": return <AlertCircle className="w-5 h-5" />;
    case "Pending": return <Clock className="w-5 h-5" />;
    default: return <Circle className="w-5 h-5" />;
  }
};

const getCategoryFromTitle = (title: string): Milestone["category"] => {
  if (title.includes("ผ่าตัด") || title.includes("เย็บ")) return "Surgery";
  if (title.includes("ฟัน") || title.includes("เพดานเทียม") || title.includes("NAM")) return "Dental";
  if (title.includes("พูด")) return "Speech";
  if (title.includes("หู") || title.includes("การได้ยิน")) return "ENT";
  return "General";
};

const mapPatientTimelineToMilestones = (timeline: any[]): Milestone[] => {
  return timeline.map((item, index) => {
    let status: Milestone["status"] = "Pending";
    const lowerStatus = (item.status || "").toLowerCase();
    
    if (lowerStatus === "completed" || lowerStatus === "done") status = "Completed";
    else if (lowerStatus === "overdue" || lowerStatus === "delayed" || lowerStatus === "overdue/delayed") status = "Overdue";
    else if (lowerStatus === "upcoming" || lowerStatus === "waiting") status = "Upcoming";

    const bookings = item.secondaryBookings || item.secondary_bookings || [];

    return {
      id: `m-${index}`,
      title: item.stage,
      category: getCategoryFromTitle(item.stage),
      targetAge: item.age,
      targetDate: item.estimatedDate || item.date || "",
      estimatedDate: item.estimatedDate || "",
      status: status,
      secondaryBookings: bookings,
      notes: bookings.length > 0 ? undefined : undefined
    };
  });
};

// --- Components ---

interface TreatmentPlanSystemProps {
  initialPatientId?: string | null;
  onBack?: () => void;
  onViewPatient?: (patient: any) => void;
}

// Helper: parse age string to numeric months for filtering
const parseAgeToMonths = (ageStr: string): number => {
  if (!ageStr || ageStr === '-') return -1;
  const yearMatch = ageStr.match(/(\d+)\s*ปี/);
  const monthMatch = ageStr.match(/(\d+)\s*เดือน/);
  let months = 0;
  if (yearMatch) months += parseInt(yearMatch[1]) * 12;
  if (monthMatch) months += parseInt(monthMatch[1]);
  return months;
};

// Helper: format age string to normalized "X ปี Y เดือน" duration (matching EditCarePathway format)
const formatAgeDuration = (ageStr: string): string => {
    if (!ageStr || ageStr === '-') return '-';
    if (ageStr === 'แรกเกิด') return 'แรกเกิด';
    let years = 0, months = 0;
    if (ageStr.includes('ปี')) {
        const parts = ageStr.split('ปี');
        const yMatch = parts[0].trim().match(/(\d+)/);
        if (yMatch) years = parseInt(yMatch[1]);
        if (parts[1] && parts[1].includes('เดือน')) {
            const mMatch = parts[1].trim().match(/(\d+)/);
            if (mMatch) months = parseInt(mMatch[1]);
        }
    } else if (ageStr.includes('เดือน')) {
        const mMatch = ageStr.match(/(\d+)/);
        if (mMatch) months = parseInt(mMatch[1]);
    } else if (ageStr.includes('สัปดาห์')) {
        return ageStr; // keep week format as-is
    }
    let result = '';
    if (years > 0) result += `${years} ปี`;
    if (months > 0) result += `${result ? ' ' : ''}${months} เดือน`;
    return result || ageStr;
};

// Helper: check if patient has an upcoming treatment within N days
const getTreatmentProximity = (patient: any): 'today' | 'approaching' | null => {
  if (patient.nextAppointment) {
    const apptDate = new Date(patient.nextAppointment);
    const today = new Date();
    // Compare date only (ignore time)
    const apptDay = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.round((apptDay.getTime() - todayDay.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'today';
    if (diffDays > 0 && diffDays <= 14) return 'approaching';
  }
  // Also check timeline status for approaching
  if (patient.timeline?.some((t: any) => t.status === 'upcoming' || t.status === 'waiting')) {
    return 'approaching';
  }
  return null;
};

// Get unique diagnosis list from data
const UNIQUE_DIAGNOSES = Array.from(new Set(PATIENTS_DATA.map(p => p.diagnosis))).filter(Boolean);

// Age range filter options
const AGE_RANGES = [
  { label: 'ทุกช่วงอายุ', value: 'all' },
  { label: '0 - 1 ปี', value: '0-12', min: 0, max: 12 },
  { label: '1 - 3 ปี', value: '12-36', min: 12, max: 36 },
  { label: '3 - 6 ปี', value: '36-72', min: 36, max: 72 },
  { label: '6 - 12 ปี', value: '72-144', min: 72, max: 144 },
  { label: '12 ปีขึ้นไป', value: '144+', min: 144, max: Infinity },
];

export function TreatmentPlanSystem({ initialPatientId, onBack, onViewPatient }: TreatmentPlanSystemProps = {}) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(initialPatientId || null);

  useEffect(() => {
    if (initialPatientId) setSelectedPatientId(initialPatientId);
  }, [initialPatientId]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, alert
  const [filterDiagnosis, setFilterDiagnosis] = useState("all");
  const [filterAge, setFilterAge] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any>(null);

  // State for the currently viewed plan
  const [currentPlan, setCurrentPlan] = useState<Milestone[]>([]);

  // Load plan when patient selected
  useEffect(() => {
    if (selectedPatientId) {
      const patient = PATIENTS_DATA.find(p => p.id === selectedPatientId);
      if (patient) {
        // Map timeline from patient data to local Milestone format
        const milestones = mapPatientTimelineToMilestones(patient.timeline || []);
        
        // If no timeline exists in data, generate some defaults based on diagnosis (optional fallback)
        if (milestones.length === 0) {
           // Basic fallback if needed, or leave empty
        }
        
        setCurrentPlan(milestones);
      }
    } else {
      setCurrentPlan([]);
    }
  }, [selectedPatientId]);

  const selectedPatient = PATIENTS_DATA.find(p => p.id === selectedPatientId);

  const filteredPatients = PATIENTS_DATA.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.hn.includes(searchTerm);
    const hasAlert = p.timeline?.some((t: any) => t.status === 'overdue' || t.status === 'delayed');
    const matchesFilter = filterStatus === "alert" ? hasAlert : true;
    const matchesDiagnosis = filterDiagnosis === "all" ? true : p.diagnosis === filterDiagnosis;
    const matchesAge = filterAge === "all" ? true : parseAgeToMonths(p.age) >= (AGE_RANGES.find(a => a.value === filterAge)?.min || -1) && parseAgeToMonths(p.age) <= (AGE_RANGES.find(a => a.value === filterAge)?.max || Infinity);
    return matchesSearch && matchesFilter && matchesDiagnosis && matchesAge;
  }).sort((a, b) => {
    const proximityOrder = { today: 0, approaching: 1 };
    const pa = getTreatmentProximity(a);
    const pb = getTreatmentProximity(b);
    const oa = pa ? proximityOrder[pa] : 2;
    const ob = pb ? proximityOrder[pb] : 2;
    return oa - ob;
  });

  // Action Handlers
  const handleUpdateMilestone = (updated: Milestone) => {
    setCurrentPlan(prev => prev.map(m => m.id === updated.id ? updated : m));
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = (id: string) => {
    if (confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) {
      setCurrentPlan(prev => prev.filter(m => m.id !== id));
      setEditingMilestone(null);
    }
  };

  const handleAddMilestone = (newMilestone: Milestone) => {
    setCurrentPlan(prev => [...prev, newMilestone].sort((a, b) => {
       // Sort by age descending (future on top, past on bottom)
       return parseAgeToMonths(b.targetAge) - parseAgeToMonths(a.targetAge);
    }));
  };

  // ── Full-page: AppointmentDetailPage (when clicking secondary booking) ──
  if (selectedBookingDetail) {
    return (
      <div className="h-[calc(100vh-100px)] w-full bg-[#f8f9fa] overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6">
          <AppointmentDetailPage 
            data={{
              id: selectedBookingDetail.id || "sb-1",
              date: selectedBookingDetail.date,
              time: selectedBookingDetail.time || "09:00",
              requestDate: selectedBookingDetail.date,
              location: selectedBookingDetail.location || selectedPatient?.hospital || '-',
              room: selectedBookingDetail.room || 'ห้องตรวจ 1',
              doctor: selectedBookingDetail.doctor || selectedPatient?.doctor || '-',
              title: selectedBookingDetail.title,
              treatment: selectedBookingDetail.title,
              detail: selectedBookingDetail.title,
              note: selectedBookingDetail.note || `นัดหมายย่อยจากแผนการรักษา: ${selectedBookingDetail.parentTreatment || '-'}`,
              status: selectedBookingDetail.status || 'completed',
              recorder: 'ระบบบันทึกอัตโนมัติ',
            }}
            patient={selectedPatient ? { name: selectedPatient.name, hn: selectedPatient.hn, image: selectedPatient.image } : undefined}
            onBack={() => setSelectedBookingDetail(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] w-full bg-slate-50 overflow-hidden rounded-lg border shadow-sm">
      
      {/* Sidebar: Patient List */}
      <div className="w-[320px] flex flex-col border-r bg-white shrink-0">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center gap-2 font-bold text-[#4B465C]">
            <User className="w-5 h-5 text-[#7367f0]" />
            รายชื่อผู้ป่วย (Patients)
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="ค้นหาชื่อ หรือ HN..." 
              className="pl-9 bg-slate-50" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" onValueChange={setFilterStatus} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="alert" className="data-[state=active]:text-red-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                ที่ต้องติดตาม
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter Dropdowns */}
          <div className="flex flex-col gap-2">
            <select
              value={filterDiagnosis}
              onChange={(e) => setFilterDiagnosis(e.target.value)}
              className="h-[34px] w-full px-2.5 pr-7 border border-gray-200 rounded-[6px] bg-slate-50 text-xs text-[#5e5873] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0] truncate"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
            >
              <option value="all">ผลการวินิจฉัย: ทั้งหมด</option>
              {UNIQUE_DIAGNOSES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="h-[34px] w-full px-2.5 pr-7 border border-gray-200 rounded-[6px] bg-slate-50 text-xs text-[#5e5873] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
            >
              {AGE_RANGES.map(r => (
                <option key={r.value} value={r.value}>
                  {r.value === 'all' ? 'ช่วงอายุ: ทั้งหมด' : `อายุ: ${r.label}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredPatients.map(patient => {
               const hasAlert = patient.timeline?.some((t: any) => t.status === 'overdue' || t.status === 'delayed');
               const proximity = getTreatmentProximity(patient);
               return (
                <div 
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-3",
                    selectedPatientId === patient.id ? "bg-[#7367f0]/5 border-l-4 border-[#7367f0]" : "border-l-4 border-transparent"
                  )}
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={patient.image} alt={patient.name} />
                    <AvatarFallback className={cn("text-xs font-bold", selectedPatientId === patient.id ? "text-[#7367f0] bg-white" : "bg-slate-100 text-slate-500")}>
                      {patient.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm truncate text-[#4B465C]">{patient.name}</h4>
                      {hasAlert && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">HN: {patient.hn}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal bg-white">
                        {patient.diagnosis}
                      </Badge>
                      {proximity === 'today' && (
                        <Badge className="text-[10px] px-1.5 py-0 h-5 font-normal bg-[#00A63E]/10 text-[#00A63E] border-[#00A63E]/30 hover:bg-[#00A63E]/15" variant="outline">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" />
                          วันรักษาวันนี้
                        </Badge>
                      )}
                      {proximity === 'approaching' && (
                        <Badge className="text-[10px] px-1.5 py-0 h-5 font-normal bg-[#ff9f43]/10 text-[#ff9f43] border-[#ff9f43]/30 hover:bg-[#ff9f43]/15" variant="outline">
                          <Clock className="w-3 h-3 mr-0.5" />
                          ใกล้ถึงวันรักษา
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] overflow-hidden">
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
                initialData={{
                    ...editingMilestone,
                    treatmentName: editingMilestone.title,
                    targetAgeRange: editingMilestone.targetAge,
                    calculatedDate: editingMilestone.estimatedDate || "",
                    birthDate: selectedPatient?.dob || "2024-01-01",
                }}
                onSave={handleUpdateMilestone}
                onBack={() => setEditingMilestone(null)}
                onDelete={handleDeleteMilestone}
            />
        ) : selectedPatient ? (
          <>
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-4">
                 <Avatar className="h-12 w-12 border-2 border-[#7367f0]/20">
                    <AvatarImage src={selectedPatient.image} alt={selectedPatient.name} />
                    <AvatarFallback className="text-sm font-bold text-[#7367f0] bg-[#7367f0]/10">
                       {selectedPatient.name.substring(0, 2)}
                    </AvatarFallback>
                 </Avatar>
                 <div>
                    <h1 className="text-xl font-bold text-[#4B465C]">{selectedPatient.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> HN: {selectedPatient.hn}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{selectedPatient.diagnosis}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>อายุ: {selectedPatient.age}</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Phone className="w-4 h-4 mr-2" />
                    ติดต่อผู้ป่วย
                 </Button>
                 <Button 
                    className="bg-[#7367f0] hover:bg-[#655bd3]"
                    onClick={() => setIsAdding(true)}
                 >
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มรายการ
                 </Button>
              </div>
            </header>

            {/* Timeline Area */}
            <div className="flex-1 overflow-y-auto p-6 md:px-12">
               <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                     <h2 className="text-lg font-bold text-[#4B465C] flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#7367f0]" />
                        เส้นทางการรักษา (Treatment Journey)
                     </h2>
                     <Badge variant="secondary" className="bg-white text-slate-500 border shadow-sm">
                        ทั้งหมด {currentPlan.length} รายการ
                     </Badge>
                  </div>

                  {/* Vertical Timeline */}
                  {currentPlan.length > 0 ? (
                    <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                        {/* Sort: future (higher age) on top, past (lower age) at bottom */}
                        {[...currentPlan].sort((a, b) => {
                            return parseAgeToMonths(b.targetAge) - parseAgeToMonths(a.targetAge);
                        }).map((milestone, index) => (
                            <TimelineNode 
                            key={milestone.id} 
                            milestone={milestone} 
                            isLast={index === currentPlan.length - 1}
                            onEdit={() => setEditingMilestone(milestone)}
                            onViewBooking={(booking) => setSelectedBookingDetail({
                                ...booking,
                                parentTreatment: milestone.title,
                                status: milestone.status === 'Completed' ? 'completed' : 'waiting',
                                doctor: selectedPatient?.doctor,
                                location: selectedPatient?.hospital,
                            })}
                            />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>ยังไม่มีแผนการรักษา</p>
                    </div>
                  )}
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-slate-300" />
             </div>
             <h3 className="text-lg font-semibold text-[#4B465C]">เลือกผู้ป่วยเพื่อดูแผนการรักษา</h3>
             <p className="text-sm">ค้นหาและเลือกรายชื่อจากแถบด้านซ้าย</p>
          </div>
        )}
      </div>

    </div>
  );
}

// --- Sub-Components ---

function TimelineNode({ milestone, isLast, onEdit, onViewBooking }: { 
  milestone: Milestone; 
  isLast: boolean; 
  onEdit: () => void;
  onViewBooking: (booking: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colorClass = getStatusColor(milestone.status);
  const bookings = milestone.secondaryBookings || [];

  return (
    <div className="relative group animate-in slide-in-from-bottom-4 duration-500">
      {/* Connector Dot */}
      <div className={cn(
        "absolute -left-[29px] top-1 w-8 h-8 rounded-full border-4 bg-white flex items-center justify-center z-10 transition-transform group-hover:scale-110 cursor-pointer shadow-sm",
        colorClass
      )}
      onClick={onEdit}
      >
         {getStatusIcon(milestone.status)}
      </div>

      {/* Content Card */}
      <Card 
        className={cn(
           "border-none shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden",
           milestone.status === 'Upcoming' ? "bg-yellow-50/50" : 
           milestone.status === 'Overdue' ? "bg-red-50/50" : 
           milestone.status === 'Pending' ? "bg-blue-50/50" : "bg-white"
        )}
        onClick={onEdit}
      >
         {/* Status Strip */}
         <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
            milestone.status === 'Completed' ? "bg-green-500" :
            milestone.status === 'Upcoming' ? "bg-yellow-500" :
            milestone.status === 'Overdue' ? "bg-red-500" : 
            milestone.status === 'Pending' ? "bg-blue-500" : "bg-gray-300"
         )} />

         <CardContent className="p-4 pl-5">
            <div className="flex justify-between items-start mb-1">
               <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    ช่วงอายุ: {formatAgeDuration(milestone.targetAge)}
                  </span>
                  <h4 className="font-bold text-base text-[#4B465C]">
                    {milestone.title}
                  </h4>
               </div>
               <Badge className={cn("ml-2", colorClass)} variant="outline">
                  {formatMilestoneStatus(milestone.status)}
               </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
               {/* Estimated Date - show in red for non-completed */}
               {milestone.estimatedDate && (
                  <div className={cn(
                    "flex items-center gap-1.5",
                    milestone.status !== 'Completed' ? "text-red-500 font-medium" : "text-slate-500"
                  )}>
                     <Calendar className="w-3.5 h-3.5" />
                     <span>คาดการณ์: {milestone.estimatedDate}</span>
                  </div>
               )}
            </div>

            {/* Expandable Secondary Bookings — matches mobile TimelineItemCard */}
            {bookings.length > 0 && (
               <div className="mt-3">
                  <button 
                     className="flex items-center gap-1.5 text-sm font-semibold text-[#7367f0] hover:text-[#655bd3] transition-colors"
                     onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                  >
                     {isExpanded ? 'ซ่อนนัดหมาย' : `ดูนัดหมายเพิ่มเติม (${bookings.length})`}
                     {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {isExpanded && (
                     <div className="flex flex-col gap-2 pl-3 ml-1 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {bookings.map((booking, idx) => {
                           const isAssessment = booking.title?.includes('ประเมิน') || booking.title?.includes('Assessment');
                           const Icon = isAssessment ? Stethoscope : Clock;
                           return (
                              <div 
                                 key={idx} 
                                 className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200 hover:bg-[#7367f0]/5 hover:border-[#7367f0]/30 cursor-pointer transition-colors"
                                 onClick={(e) => { e.stopPropagation(); onViewBooking(booking); }}
                              >
                                 <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                 <div className="flex flex-col flex-1">
                                    <span className="text-sm text-slate-500">{booking.title || 'ติดตามอาการ (Follow-up)'}</span>
                                    <span className="text-sm text-slate-700 font-medium">{booking.date}</span>
                                 </div>
                                 <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                              </div>
                           );
                        })}
                     </div>
                  )}
               </div>
            )}

            {milestone.notes && (
               <div className="mt-3 text-sm bg-white/50 p-2 rounded border border-dashed border-slate-200 text-slate-600">
                  Note: {milestone.notes}
               </div>
            )}
         </CardContent>
      </Card>
    </div>
  );
}