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
  Baby
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

// --- Types ---

interface Patient {
  id: string;
  hn: string;
  name: string;
  dob: string;
  diagnosis: "Cleft Lip" | "Cleft Palate" | "Cleft Lip and Palate";
  status: "Active" | "Completed" | "Drop-out" | "Inactive";
  img?: string;
  hasAlert?: boolean; // For demo: logic could be dynamic
}

interface Milestone {
  id: string;
  title: string;
  category: "Surgery" | "Dental" | "Speech" | "ENT" | "General";
  targetAge: string; // e.g. "3 Months"
  targetDate: string; // ISO Date
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
    hasAlert: true
  },
  {
    id: "2",
    hn: "1-1001-00868-00-1",
    name: "วิภาวี รักไทย",
    dob: "2020-05-20",
    diagnosis: "Cleft Palate",
    status: "Inactive",
    hasAlert: false
  },
  {
    id: "3",
    hn: "1-1002-00034-00-2",
    name: "ประวิทย์ มั่นคง",
    dob: "2024-01-01",
    diagnosis: "Cleft Lip and Palate",
    status: "Active",
    hasAlert: true
  },
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
  { id: "m3", title: "ฝึกพูด (Speech Therapy)", category: "Speech", targetAge: "2-3 ปี", targetDate: "2023-05-20", status: "Completed" },
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
    case "Overdue": return "text-red-500 bg-red-50 border-red-200";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, alert
  const [activeTab, setActiveTab] = useState("timeline");
  const [isAdding, setIsAdding] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  // State for the currently viewed plan (in a real app, this would be fetched)
  const [currentPlan, setCurrentPlan] = useState<Milestone[]>([]);

  // Load plan when patient selected
  useEffect(() => {
    if (selectedPatientId) {
      const patient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);
      if (patient) {
        // Simulate fetching plan
        if (patient.diagnosis === "Cleft Lip") setCurrentPlan([...DEFAULT_PLAN_CL]);
        else if (patient.diagnosis === "Cleft Palate") setCurrentPlan([...DEFAULT_PLAN_CP]);
        else setCurrentPlan([...DEFAULT_PLAN_CLP]);
      }
    } else {
      setCurrentPlan([]);
    }
  }, [selectedPatientId]);

  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);

  const filteredPatients = MOCK_PATIENTS.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.hn.includes(searchTerm);
    const matchesFilter = filterStatus === "alert" ? p.hasAlert : true;
    return matchesSearch && matchesFilter;
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
    setCurrentPlan(prev => [...prev, newMilestone].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()));
  };

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
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y">
            {filteredPatients.map(patient => (
              <div 
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={cn(
                  "p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-3",
                  selectedPatientId === patient.id ? "bg-[#7367f0]/5 border-l-4 border-[#7367f0]" : "border-l-4 border-transparent"
                )}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className={cn("text-xs font-bold", selectedPatientId === patient.id ? "text-[#7367f0] bg-white" : "bg-slate-100 text-slate-500")}>
                    {patient.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm truncate text-[#4B465C]">{patient.name}</h4>
                    {patient.hasAlert && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">HN: {patient.hn}</p>
                  <Badge variant="outline" className="mt-2 text-[10px] px-1.5 py-0 h-5 font-normal bg-white">
                    {patient.diagnosis}
                  </Badge>
                </div>
              </div>
            ))}
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
                initialData={editingMilestone}
                onSave={handleUpdateMilestone}
                onBack={() => setEditingMilestone(null)}
                onDelete={handleDeleteMilestone}
            />
        ) : selectedPatient ? (
          <>
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-[#7367f0]/10 flex items-center justify-center">
                    <Baby className="w-6 h-6 text-[#7367f0]" />
                 </div>
                 <div>
                    <h1 className="text-xl font-bold text-[#4B465C]">{selectedPatient.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> HN: {selectedPatient.hn}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{selectedPatient.diagnosis}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>อายุ: 1 ปี 2 เดือน</span>
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
                  <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                     {currentPlan.map((milestone, index) => (
                        <TimelineNode 
                           key={milestone.id} 
                           milestone={milestone} 
                           isLast={index === currentPlan.length - 1}
                           onEdit={() => setEditingMilestone(milestone)}
                        />
                     ))}
                     
                     {/* End Node */}
                     <div className="relative flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                        <div className="absolute -left-[27px] w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-100 flex items-center justify-center z-10">
                           <div className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                        <div className="text-sm text-muted-foreground italic">
                           สิ้นสุดแผนการรักษาปัจจุบัน
                        </div>
                     </div>
                  </div>
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

function TimelineNode({ milestone, isLast, onEdit }: { 
  milestone: Milestone; 
  isLast: boolean; 
  onEdit: () => void;
}) {
  const colorClass = getStatusColor(milestone.status);

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
           milestone.status === 'Overdue' ? "bg-red-50/50" : "bg-white"
        )}
        onClick={onEdit}
      >
         {/* Status Strip */}
         <div className={cn("absolute left-0 top-0 bottom-0 w-1", 
            milestone.status === 'Completed' ? "bg-green-500" :
            milestone.status === 'Upcoming' ? "bg-yellow-500" :
            milestone.status === 'Overdue' ? "bg-red-500" : "bg-gray-300"
         )} />

         <CardContent className="p-4 pl-5">
            <div className="flex justify-between items-start mb-1">
               <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    ช่วงอายุ: {milestone.targetAge}
                  </span>
                  <h4 className="font-bold text-base text-[#4B465C]">
                    {milestone.title}
                  </h4>
               </div>
               <Badge className={cn("ml-2", colorClass)} variant="outline">
                  {milestone.status}
               </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
               <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {milestone.targetDate}
               </div>
               <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  {milestone.category}
               </div>
            </div>

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
