import React, { useState, useMemo, useEffect } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card } from "../../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../../../../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Calendar as CalendarPicker } from "../../../../../components/ui/calendar";
import { Textarea } from "../../../../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  Clock, 
  MapPin, 
  Edit, 
  Trash2, 
  Printer, 
  User,
  ShieldAlert,
  History,
  Edit2,
  X,
  Eye,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { toast } from "sonner";
import { th } from "date-fns/locale";
import { AddAppointmentModal } from "./AddAppointmentModal";
import { AppointmentDetailPage } from "./AppointmentDetailPage";
import { AddMedicalRecordForm } from "../../patient/AddMedicalRecordForm";
import { ReferralRequestForm } from "./ReferralRequestForm";
import { PatientDetailView } from "../../patient/PatientDetailView";
import { PATIENTS_DATA } from "../../../../../data/patientData";
import { WebCalendarView, ViewModeToggle } from "../shared/WebCalendarView";

const THAI_MONTHS_FULL = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

function toISODateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

interface AppointmentSystemProps {
  onBack?: () => void;
}

// --- Mock Data Types (Matched with Mobile) ---

interface Appointment {
  id: string | number;
  patientImage?: string | null;
  patientName: string;
  hn: string;
  date: string;
  time: string;
  location?: string;
  hospital?: string;
  room?: string;
  doctor?: string;
  doctorName?: string; // Compat
  clinic?: string; // Compat
  status: string;
  type?: string;
  detail?: string;
  reason?: string;
  title?: string;
  note?: string;
  createdBy?: string;
  requestDate?: string; // วันที่สร้างคำขอ — synced with history
}

const CLINICS = [
  "ทั้งหมด",
  "คลินิกศัลยกรรมตกแต่ง",
  "คลินิกทันตกรรม",
  "คลินิกหูคอจมูก",
  "คลินิกกุมารเวช",
  "คลินิกอรรถบำบัด"
];

const STATUSES = [
  { value: "ทั้งหมด", label: "ทั้งหมด" },
  { value: "pending", label: "รอตรวจ" }, // waiting/pending
  { value: "confirmed", label: "ยืนยันแล้ว" },
  { value: "completed", label: "เสร็จสิ้น" },
  { value: "cancelled", label: "ยกเลิก" },
];

// --- Data Mapping (Copied from Mobile logic) ---
const mapAppointmentData = (data: typeof PATIENTS_DATA): Appointment[] => {
    return data.filter((item: any) => {
        // Ensure date exists
        if (!item.date) return false;
        
        // Filter out non-appointment types similar to AppointmentSystem logic
        const type = item.type || '';
        return !['Refer In', 'Refer Out', 'Home Visit', 'Joint Visit', 'Telemed', 'Routine', 'Delegated', 'ฝากเยี่ยม', 'Joint', 'เยี่ยมร่วม'].includes(type);
    }).map((item: any) => {
        // Compute requestDate (7 days before appointment, same logic as patientData.ts)
        let requestDate = '-';
        if (item.date) {
            try {
                const d = new Date(item.date + (item.date.includes('T') ? '' : 'T00:00:00'));
                if (!isNaN(d.getTime())) {
                    const reqD = new Date(d);
                    reqD.setDate(d.getDate() - 7);
                    requestDate = reqD.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
                }
            } catch { /* fallback to '-' */ }
        }

        return {
            id: item.id,
            patientImage: item.image,
            patientName: item.name,
            hn: item.hn,
            date: item.date,
            time: item.time || '00:00',
            hospital: item.hospital || "โรงพยาบาลฝาง",
            clinic: item.department || "คลินิกทั่วไป",
            room: item.room,
            location: item.hospital, // Fallback
            doctor: item.doctor,
            doctorName: item.doctor, // Compat
            status: item.apptStatus || item.status || 'pending',
            title: item.title || 'นัดหมายตรวจรักษา',
            reason: item.reason || item.note,
            note: item.note,
            createdBy: 'System',
            requestDate: requestDate,
        };
    });
};

export default function AppointmentSystem({ onBack }: AppointmentSystemProps) {
  // --- State ---
  
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [history, setHistory] = useState<Appointment[]>([]);

  const [selectedHospital, setSelectedHospital] = useState("ทั้งหมด");
  const [selectedClinic, setSelectedClinic] = useState("ทั้งหมด");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(""); // Default show all
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming vs history

  // Edit/Create Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<Partial<Appointment> | null>(null);
  const [targetApt, setTargetApt] = useState<Appointment | null>(null); // For deletion confirmation
  
  // Custom Flow State
  const [isAddFlowOpen, setIsAddFlowOpen] = useState(false);

  // Detail Modal State
  const [selectedDetailApt, setSelectedDetailApt] = useState<Appointment | null>(null);

  // Medical Record Form State
  const [isMedicalRecordOpen, setIsMedicalRecordOpen] = useState(false);
  const [medicalRecordApt, setMedicalRecordApt] = useState<Appointment | null>(null);

  // Next Step / Referral State
  const [isStep2Open, setIsStep2Open] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);

  // Patient Detail State
  const [isPatientViewOpen, setIsPatientViewOpen] = useState(false);
  const [viewingPatientId, setViewingPatientId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState<string | null>(null);

  // --- Logic ---

  useEffect(() => {
      const mapped = mapAppointmentData(PATIENTS_DATA);
      setAllAppointments(mapped);
      
      // Split logic matches Mobile
      const upcomingStatuses = ['waiting', 'confirmed', 'checked-in', 'pending', 'accepted'];
      
      const upcoming = mapped.filter(d => upcomingStatuses.includes(d.status.toLowerCase()));
      const past = mapped.filter(d => !upcomingStatuses.includes(d.status.toLowerCase()));
      
      setAppointments(upcoming);
      setHistory(past);
  }, []);

  // Filter Logic (Generic)
  const getFilteredData = (data: Appointment[]) => {
    return data.filter(apt => {
        const matchHospital = selectedHospital === "ทั้งหมด" || apt.hospital === selectedHospital;
        const matchClinic = selectedClinic === "ทั้งหมด" || apt.clinic === selectedClinic;
        
        let matchStatus = true;
        if (selectedStatus !== "ทั้งหมด") {
             // Simple mapping for filter
             if (selectedStatus === 'pending') matchStatus = ['waiting', 'pending'].includes(apt.status.toLowerCase());
             else matchStatus = apt.status.toLowerCase() === selectedStatus.toLowerCase();
        }

        const matchDate = !selectedDate || apt.date === selectedDate;
        const matchSearch = apt.patientName.includes(searchQuery) || apt.hn.includes(searchQuery);
        
        return matchHospital && matchClinic && matchStatus && matchDate && matchSearch;
    }).sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });
  };

  // Helper for Status UI (Matches Mobile Colors)
  const getStatusColor = (status: string) => {
      switch(status.toLowerCase()) {
          case 'waiting': 
          case 'pending': return 'bg-orange-100 text-orange-700';
          case 'confirmed': 
          case 'checked-in':
          case 'accepted': return 'bg-blue-100 text-blue-700';
          case 'completed': 
          case 'treated': return 'bg-green-100 text-green-700';
          case 'cancelled':
          case 'missed': 
          case 'rejected': return 'bg-red-100 text-red-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  const getStatusLabel = (status: string) => {
      switch(status.toLowerCase()) {
          case 'waiting':
          case 'pending': return 'รอตรวจ';
          case 'confirmed': 
          case 'checked-in':
          case 'accepted': return 'ยืนยันแล้ว';
          case 'completed': 
          case 'treated': return 'เสร็จสิ้น';
          case 'cancelled': 
          case 'missed': 
          case 'rejected': return 'ยกเลิก';
          default: return status;
      }
  };

  // Handlers
  const handleEditClick = (apt: Appointment) => {
    setEditingApt({ ...apt }); // Clone for editing
    setIsAddFlowOpen(true);
  };

  const handleCreateClick = () => {
    setEditingApt(null);
    setIsAddFlowOpen(true);
  };

  const handleConfirmDelete = () => {
    if (targetApt) {
      // In a real app, this would delete from backend. Here we update local state.
      setAppointments(prev => prev.filter(a => a.id !== targetApt.id));
      setHistory(prev => prev.filter(a => a.id !== targetApt.id));
      
      toast.success("ลบนัดหมายเรียบร้อยแล้ว", {
         description: `ลบนัดหมายของ ${targetApt.patientName} โดย SCFC`
      });
      setIsDeleteOpen(false);
      setTargetApt(null);
    }
  };

  const handleDetailAddRecord = () => {
      if (selectedDetailApt) {
          setSelectedDetailApt(null);
          setMedicalRecordApt(selectedDetailApt);
          setIsMedicalRecordOpen(true);
      }
  };

  const handleRowClick = (apt: Appointment) => {
      setSelectedDetailApt(apt);
  };

  const handleDetailConfirm = () => {
      if (selectedDetailApt) {
          // Logic to move to confirmed
          const updated = { ...selectedDetailApt, status: 'confirmed' };
          // Update lists
          setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
          
          toast.success("ยืนยันการรักษาเรียบร้อยแล้ว", {
              description: `ผู้ป่วย: ${selectedDetailApt.patientName} - สถานะปรับเป็นยืนยันแล้ว`
          });
          
          // Update the detail view to reflect the new status instead of closing it
          setSelectedDetailApt(updated);
      }
  };

  const handleDetailCancel = () => {
      if (selectedDetailApt) {
          const updated = { ...selectedDetailApt, status: 'cancelled' };
          // Move from appointments to history if logic dictates, or just update status
          setAppointments(prev => prev.filter(a => a.id !== updated.id));
          setHistory(prev => [updated, ...prev]);

          toast.success("ยกเลิกนัดหมายเรียบร้อยแล้ว");
      }
      setSelectedDetailApt(null);
  };
  
  const handleDetailContact = () => {
      toast.info("กำลังเปิดระบบติดต่อผู้ป่วย...", {
          description: `โทรหา ${selectedDetailApt?.patientName} (08x-xxx-xxxx)`
      });
  };

  const handleDetailEdit = () => {
      if (selectedDetailApt) {
          setSelectedDetailApt(null);
          handleEditClick(selectedDetailApt);
      }
  };
  
  if (isPatientViewOpen && viewingPatientId) {
      // Find patient data from PATIENTS_DATA
      const patientData = PATIENTS_DATA.find((p: any) => p.code === viewingPatientId || p.hn === viewingPatientId || p.id === viewingPatientId) || PATIENTS_DATA[0];
      
      return (
          <PatientDetailView
              patient={patientData}
              onBack={() => {
                  setIsPatientViewOpen(false);
                  setViewingPatientId(null);
              }}
          />
      );
  }

  if (selectedDetailApt) {
      return (
        <AppointmentDetailPage
            appointment={selectedDetailApt}
            onBack={() => setSelectedDetailApt(null)}
            onConfirm={handleDetailConfirm}
            onCancel={handleDetailCancel}
            onContact={handleDetailContact}
            onEdit={handleDetailEdit}
            onAddRecord={handleDetailAddRecord}
            onViewPatient={() => {
                if (selectedDetailApt) {
                    setViewingPatientId(selectedDetailApt.hn || selectedDetailApt.patientName); // Use HN or Name as ID
                    setIsPatientViewOpen(true);
                    // Don't close selectedDetailApt yet if we want to preserve state? 
                    // Actually usually we replace the view.
                    setSelectedDetailApt(null);
                }
            }}
        />
      );
  }

  if (isMedicalRecordOpen && medicalRecordApt) {
      return (
          <AddMedicalRecordForm 
              initialAppointment={medicalRecordApt}
              mode="appointment"
              onBack={() => setIsMedicalRecordOpen(false)}
              onSave={(data: any) => {
                  if (data?.status === 'Completed') {
                      // Move to history
                      const updated = { ...medicalRecordApt, status: 'completed' };
                      setAppointments(prev => prev.filter(a => a.id !== updated.id));
                      setHistory(prev => [updated, ...prev]);
                  }

                  toast.success("บันทึกข้อมูลเรียบร้อยแล้ว", {
                      description: `บันทึกข้อมูลการรักษาของ ${medicalRecordApt.patientName}`
                  });
                  setIsMedicalRecordOpen(false);
                  setIsStep2Open(true);
              }}
          />
      );
  }

  if (isReferralOpen && medicalRecordApt) {
      return (
        <ReferralRequestForm
            patientData={medicalRecordApt}
            onBack={() => setIsReferralOpen(false)}
            onConfirm={(data) => {
                toast.success("สร้างใบส่งตัวเรียบร้อยแล้ว", {
                    description: `ส่งตัว ${medicalRecordApt.patientName} ไปยัง ${data.targetHospital}`
                });
                setIsReferralOpen(false);
            }}
        />
      );
  }

  if (isAddFlowOpen) {
    return (
      <AddAppointmentModal 
        onBack={() => {
            setIsAddFlowOpen(false);
            setEditingApt(null);
        }}
        initialData={editingApt}
        onConfirm={(data: any) => {
            if (editingApt) {
                // Update existing appointment
                const updated = { 
                    ...editingApt,
                    ...data,
                    hn: data.hn !== "-" ? data.hn : editingApt.hn
                } as Appointment;

                setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
                setHistory(prev => prev.map(a => a.id === updated.id ? updated : a));

                toast.success("แก้ไขนัดหมายเรียบร้อยแล้ว", {
                    description: `แก้ไขข้อมูลนัดหมายของ ${data.patientName}`
                });
            } else {
                // Create new appointment
                const newApt: Appointment = {
                    id: `APT-${Date.now()}`,
                    patientName: data.patientName,
                    hn: data.hn || "N/A",
                    hospital: data.hospital,
                    clinic: data.clinic || "แผนกทั่วไป",
                    date: data.date,
                    time: data.time,
                    doctorName: data.doctorName || "ไม่ระบุ",
                    createdBy: "SCFC Staff",
                    status: "pending",
                    note: data.note
                };
                setAppointments(prev => [newApt, ...prev]);
                toast.success("บันทึกนัดหมายเรียบร้อยแล้ว", {
                    description: `สร้างนัดหมายสำหรับ ${data.patientName}`
                });
            }
            setIsAddFlowOpen(false);
            setEditingApt(null);
        }}
      />
    );
  }

  const activeData = activeTab === 'upcoming' ? getFilteredData(appointments) : getFilteredData(history);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative min-h-screen font-['Montserrat','Noto_Sans_Thai',sans-serif]">

      {/* Header Banner */}
      <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#DFF6F8]/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" /> ระบบจัดการนัดหมาย
            </h1>
        </div>
      </div>

      {/* Dashboard Stats Cards (Derived from Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{allAppointments.length}</p>
                  <p className="text-blue-600/80 text-sm">นัดหมายทั้งหมด</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-orange-600 font-bold text-2xl">
                      {allAppointments.filter(a => ['waiting', 'pending'].includes(a.status.toLowerCase())).length}
                  </p>
                  <p className="text-orange-600/80 text-sm">รอการตรวจ</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">
                      {allAppointments.filter(a => ['confirmed', 'accepted'].includes(a.status.toLowerCase())).length}
                  </p>
                  <p className="text-green-600/80 text-sm">ยืนยันแล้ว</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">
                      {allAppointments.filter(a => ['missed', 'cancelled', 'rejected'].includes(a.status.toLowerCase())).length}
                  </p>
                  <p className="text-red-600/80 text-sm">ยกเลิก/ขาดนัด</p>
              </div>
              <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
          </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-none shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Card Header with Title and Search */}
        <div className="p-6 border-b border-[#EBE9F1] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-[18px] font-bold text-[#5e5873] flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#7367f0]" /> รายการนัดหมาย
            </h2>
            
            <div className="flex items-center gap-3">
                <div className="relative w-full max-w-[250px]">
                    <Input 
                        placeholder="ค้นหาชื่อผู้ป่วย / HN" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10 h-[40px] border-[#EBE9F1] bg-white focus:ring-[#7367f0]"
                    />
                    <div className="absolute right-0 top-0 h-full w-10 bg-[#7367f0] flex items-center justify-center rounded-r-md cursor-pointer hover:bg-[#685dd8]">
                        <Search className="h-4 w-4 text-white" />
                    </div>
                </div>

                <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />

                <Button 
                  onClick={handleCreateClick}
                  className="bg-[#7367f0] hover:bg-[#685dd8] text-white font-medium px-4 py-2 h-[42px] rounded-[5px] shadow-sm gap-2"
                >
                   <Plus className="h-4 w-4" />
                   <span>เพิ่มนัดหมาย</span>
                </Button>
            </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="p-6 space-y-6">
            <WebCalendarView
              items={allAppointments}
              dateField="date"
              themeColor="#4285f4"
              countLabel="นัด"
              selectedDate={calendarDate}
              onDateSelect={setCalendarDate}
              itemFilter={(item) => !!item.date}
            />
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead>วัน/เวลา</TableHead>
                    <TableHead>ผู้ป่วย</TableHead>
                    <TableHead>สถานที่/แผนก</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const calItems = allAppointments.filter(apt => {
                      if (!apt.date) return false;
                      if (calendarDate && apt.date !== calendarDate) return false;
                      if (searchQuery) {
                        const q = searchQuery.toLowerCase();
                        if (!apt.patientName.toLowerCase().includes(q) && !apt.hn.toLowerCase().includes(q)) return false;
                      }
                      return true;
                    });
                    if (calItems.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-400 py-12">
                            <div className="flex flex-col items-center gap-3">
                              <CalendarIcon className="w-10 h-10 opacity-20" />
                              <p className="text-sm">{calendarDate ? 'ไม่พบรายการในวันที่เลือก' : 'เลือกวันที่เพื่อดูรายการ'}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return calItems.map(apt => (
                      <TableRow key={apt.id} className="cursor-pointer hover:bg-slate-50 group" onClick={() => handleRowClick(apt)}>
                        <TableCell>
                          <div className="text-[#5e5873] font-medium">{apt.time}</div>
                          <div className="text-xs text-[#b9b9c3] mt-0.5">
                            {apt.date && !isNaN(new Date(apt.date).getTime()) ? new Date(apt.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{apt.patientName}</div>
                            <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {apt.hn}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[#5e5873] font-medium">{apt.clinic}</div>
                          <div className="text-xs text-gray-400">{apt.hospital}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("font-normal border-none", getStatusColor(apt.status))}>{getStatusLabel(apt.status)}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#7367f0]" onClick={(e) => { e.stopPropagation(); handleEditClick(apt); }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
        <>
        {/* Filters Section */}
        <div className="px-6 pt-6 pb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-lg border border-dashed border-gray-200">
                    <TabsList className="bg-white p-1 h-auto rounded-lg grid grid-cols-2 w-full md:w-[320px] border border-gray-200 shadow-sm mx-auto md:mx-0">
                        <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-1.5 text-sm rounded-md transition-all">
                            รายการนัดหมาย
                        </TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-1.5 text-sm rounded-md transition-all">
                            ประวัติย้อนหลัง
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex flex-wrap items-center gap-3 justify-end w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <Label className="text-[#5e5873] font-medium text-xs uppercase tracking-wide">แผนก:</Label>
                            <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                                <SelectTrigger className="w-[180px] bg-white border-gray-200 h-9 text-sm">
                                    <SelectValue placeholder="เลือกแผนก" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CLINICS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="text-[#5e5873] font-medium text-xs uppercase tracking-wide">สถานะ:</Label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[150px] bg-white border-gray-200 h-9 text-sm">
                                    <SelectValue placeholder="เลือกสถานะ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">วันที่สร้างคำขอ:</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] bg-white border-gray-200 rounded-[6px] h-[38px] text-sm justify-start text-left font-normal">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                        {selectedDate ? (() => {
                                            const date = new Date(selectedDate);
                                            return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
                                        })() : "ทั้งหมด"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <CalendarPicker
                                        mode="single"
                                        selected={selectedDate ? new Date(selectedDate) : undefined}
                                        onSelect={(date) => setSelectedDate(date ? toISODateString(date) : "")}
                                        locale={th}
                                        formatters={{
                                            formatCaption: (date) => {
                                                const year = date.getFullYear() + 543;
                                                return `${THAI_MONTHS_FULL[date.getMonth()]} ${year}`;
                                            }
                                        }}
                                        classNames={{
                                            day_selected: "bg-[#7367f0] text-white hover:bg-[#7367f0] hover:text-white focus:bg-[#7367f0] focus:text-white rounded-md",
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </Tabs>
        </div>
        
        <div className="p-6">
            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead>วัน/เวลา</TableHead>
                            <TableHead>ผู้ป่วย</TableHead>
                            <TableHead>สถานที่/แผนก</TableHead>
                            <TableHead>ผู้ดูแลรับผิดชอบ</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead className="text-right">จัดการ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <CalendarIcon className="w-10 h-10 opacity-20" />
                                        <p className="text-sm">ไม่พบข้อมูลนัดหมาย</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            activeData.map((apt) => (
                                <TableRow 
                                    key={apt.id} 
                                    className="cursor-pointer hover:bg-slate-50 group"
                                    onClick={() => handleRowClick(apt)}
                                >
                                    <TableCell>
                                        <div className="text-[#5e5873] font-medium">
                                            {apt.time.includes('-') ? apt.time : (
                                                <>
                                                    {apt.time} - {(() => {
                                                        const [h, m] = apt.time.split(':').map(Number);
                                                        if (isNaN(h) || isNaN(m)) return apt.time;
                                                        const endH = (h + 1) % 24;
                                                        return `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                                    })()}
                                                </>
                                            )}
                                        </div>
                                        <div className="text-xs text-[#b9b9c3] mt-0.5">
                                             {apt.date && !isNaN(new Date(apt.date).getTime()) ? new Date(apt.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{apt.patientName}</div>
                                            <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {apt.hn}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="text-sm text-[#5e5873] font-medium">{apt.clinic}</div>
                                            <div className="text-xs text-gray-400">{apt.hospital}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-[#5e5873]">{apt.doctor || apt.doctorName || "-"}</div>
                                    </TableCell>
                                    <TableCell>
                                         <Badge className={cn("font-normal border-none", getStatusColor(apt.status))}>
                                            {getStatusLabel(apt.status)}
                                         </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-gray-400 hover:text-[#7367f0]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(apt);
                                                }}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-gray-400 hover:text-red-500" 
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    setTargetApt(apt);
                                                    setIsDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
        </>
        )}
      </Card>
    </div>
  );
}