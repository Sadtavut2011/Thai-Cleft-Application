import React, { useState } from 'react';
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
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { AddAppointmentModal } from "./AddAppointmentModal";
import { AppointmentDetailPage } from "./AppointmentDetailPage";
import { MedicalRecordForm } from "./MedicalRecordForm";
import { ReferralRequestForm } from "./ReferralRequestForm";

interface AppointmentSystemProps {
  onBack?: () => void;
}

// --- Mock Data Types ---

interface Appointment {
  id: string;
  patientName: string;
  hn: string;
  hospital: string;
  clinic: string; // แผนก/คลินิก
  date: string;
  time: string;
  doctorName: string;
  createdBy: string; // ผู้สร้างนัดหมาย
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed' | 'Missed';
  note?: string;
}

// --- Mock Data ---

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-001",
    patientName: "ด.ช. สมชาย รักดี",
    hn: "HN001",
    hospital: "โรงพยาบาลฝาง",
    clinic: "คลินิกศัลยกรรมตกแต่ง",
    date: "2026-01-06",
    time: "09:00",
    doctorName: "นพ. ใจดี มีสุข",
    createdBy: "Staff Nurse A",
    status: "Confirmed",
    note: "ติดตามผลหลังผ่าตัด 1 เดือน"
  },
  {
    id: "APT-002",
    patientName: "ด.ญ. มานี ใจผ่อง",
    hn: "HN002",
    hospital: "โรงพยาบาลฝาง",
    clinic: "คลินิกทันตกรรม",
    date: "2026-01-06",
    time: "10:30",
    doctorName: "ทพญ. สวยใส ไร้ฟันผุ",
    createdBy: "SCFC Admin",
    status: "Pending",
    note: "พิมพ์ปากทำเพดานเทียม"
  },
  {
    id: "APT-003",
    patientName: "ด.ช. ปิติ มีทรัพย์",
    hn: "HN003",
    hospital: "โรงพยาบาลฝาง",
    clinic: "คลินิกหูคอจมูก",
    date: "2026-01-07",
    time: "13:00",
    doctorName: "พญ. หูทิพย์",
    createdBy: "Staff Nurse B",
    status: "Confirmed",
    note: "ตรวจการได้ยินซ้ำ"
  },
  {
    id: "APT-004",
    patientName: "ด.ญ. ชูใจ ใฝ่ดี",
    hn: "HN004",
    hospital: "โรงพยาบาลฝาง",
    clinic: "คลินิกกุมารเวช",
    date: "2026-01-06",
    time: "14:00",
    doctorName: "นพ. เด็กดี",
    createdBy: "Staff Nurse A",
    status: "Cancelled",
    note: "ผู้ป่วยขอเลื่อน"
  }
];

const HOSPITALS = [
  "ทั้งหมด",
  "โรงพยาบาลฝาง",
  "โรงพยาบาลมฝาง",
  "โรงพยาบาลนครพิงค์",
  "โรงพยาบาลลำปาง",
  "โรงพยาบาลเชียงรายประชานุเคราะห์"
];

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
  { value: "Confirmed", label: "ยืนยันแล้ว" },
  { value: "Pending", label: "รอการยืนยัน" },
  { value: "Cancelled", label: "ยกเลิก" },
  { value: "Missed", label: "ขาดนัด" },
  { value: "Completed", label: "เสร็จสิ้น" }
];

export default function AppointmentSystem({ onBack }: AppointmentSystemProps) {
  // --- State ---
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedHospital, setSelectedHospital] = useState("ทั้งหมด");
  const [selectedClinic, setSelectedClinic] = useState("ทั้งหมด");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(""); // Default show all
  const [activeTab, setActiveTab] = useState("current");

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

  // --- Logic ---

  // Filter Logic
  const filteredAppointments = appointments.filter(apt => {
    // Tab Filter
    const isCurrentTab = activeTab === 'current';
    const tabStatusMatch = isCurrentTab 
        ? ['Pending', 'Confirmed', 'Missed'].includes(apt.status)
        : ['Completed', 'Cancelled'].includes(apt.status);

    const matchHospital = selectedHospital === "ทั้งหมด" || apt.hospital === selectedHospital;
    const matchClinic = selectedClinic === "ทั้งหมด" || apt.clinic === selectedClinic;
    const matchStatus = selectedStatus === "ทั้งหมด" || apt.status === selectedStatus;
    const matchDate = !selectedDate || apt.date === selectedDate;
    const matchSearch = apt.patientName.includes(searchQuery) || apt.hn.includes(searchQuery);
    
    return tabStatusMatch && matchHospital && matchClinic && matchStatus && matchDate && matchSearch;
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Stats Logic (For dashboard cards - ignores Status filter to show overview)
  const statsAppointments = appointments.filter(apt => {
    const matchHospital = selectedHospital === "ทั้งหมด" || apt.hospital === selectedHospital;
    const matchClinic = selectedClinic === "ทั้งหมด" || apt.clinic === selectedClinic;
    const matchDate = !selectedDate || apt.date === selectedDate;
    const matchSearch = apt.patientName.includes(searchQuery) || apt.hn.includes(searchQuery);
    
    return matchHospital && matchClinic && matchDate && matchSearch;
  });

  // Handlers
  const handleEditClick = (apt: Appointment) => {
    setEditingApt({ ...apt }); // Clone for editing
    setIsAddFlowOpen(true);
  };

  const handleCreateClick = () => {
    setEditingApt(null);
    setIsAddFlowOpen(true);
  };

  const handleDeleteClick = (apt: Appointment) => {
    setTargetApt(apt);
    setIsDeleteOpen(true);
  };

  const handleSave = () => {
    if (!editingApt?.patientName || !editingApt?.date) {
      toast.error("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน");
      return;
    }

    if (appointments.some(a => a.id === editingApt.id)) {
      // Update
      setAppointments(prev => prev.map(a => a.id === editingApt.id ? editingApt as Appointment : a));
      toast.success("บันทึกการแก้ไขเรียบร้อยแล้ว", {
        description: "ระบบได้บันทึกประวัติการแก้ไขโดย SCFC ไว้แล้ว"
      });
    } else {
      // Create
      setAppointments(prev => [editingApt as Appointment, ...prev]);
      toast.success("สร้างนัดหมายใหม่เรียบร้อยแล้ว", {
        description: "ระบบได้ส่งการแจ้งเตือนไปยังผู้เกี่ยวข้องแล้ว"
      });
    }
    setIsEditOpen(false);
    setEditingApt(null);
  };

  const handleConfirmDelete = () => {
    if (targetApt) {
      setAppointments(prev => prev.filter(a => a.id !== targetApt.id));
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
          setAppointments(prev => prev.map(apt => 
              apt.id === selectedDetailApt.id 
                  ? { ...apt, status: 'Confirmed' } 
                  : apt
          ));
          
          toast.success("ยืนยันการรักษาเรียบร้อยแล้ว", {
              description: `ผู้ป่วย: ${selectedDetailApt.patientName} - สถานะปรับเป็นยืนยันแล้ว`
          });
      }
      setSelectedDetailApt(null);
  };

  const handleDetailCancel = () => {
      setAppointments(prev => prev.map(a => a.id === selectedDetailApt?.id ? { ...a, status: 'Cancelled' } : a));
      toast.success("ยกเลิกนัดหมายเรียบร้อยแล้ว");
      setSelectedDetailApt(null);
  };
  
  const handleDetailContact = () => {
      toast.info("กำลังเปิดระบบติดต่อผู้ป่วย...", {
          description: `โทรหา ${selectedDetailApt?.patientName} (08x-xxx-xxxx)`
      });
      // In a real app, this might open a dialer or log a contact attempt
  };

  const handleDetailEdit = () => {
      if (selectedDetailApt) {
          setSelectedDetailApt(null);
          handleEditClick(selectedDetailApt);
      }
  };
  
  const handlePrint = (apt: Appointment) => {
    toast.info("กำลังสร้างไฟล์ PDF...", {
      description: `ใบนัดหมาย: ${apt.patientName} - ${apt.date}`
    });
  };

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
        />
      );
  }

  if (isMedicalRecordOpen && medicalRecordApt) {
      return (
          <MedicalRecordForm 
              appointment={medicalRecordApt} 
              onBack={() => setIsMedicalRecordOpen(false)}
              onSave={(data: any) => {
                  if (data?.status === 'Completed') {
                      setAppointments(prev => prev.map(apt => 
                          apt.id === medicalRecordApt.id 
                              ? { ...apt, status: 'Completed' } 
                              : apt
                      ));
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
                setAppointments(prev => prev.map(a => 
                    a.id === editingApt.id 
                    ? { 
                        ...a,
                        patientName: data.patientName,
                        hn: data.hn !== "-" ? data.hn : a.hn, // Keep original HN if not provided
                        hospital: data.hospital,
                        clinic: data.clinic,
                        date: data.date,
                        time: data.time,
                        doctorName: data.doctorName,
                        note: data.note
                      } 
                    : a
                ));
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
                    status: "Pending",
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



      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-blue-600 font-bold text-2xl">{statsAppointments.length}</p>
                  <p className="text-blue-600/80 text-sm">นัดหมายทั้งหมด</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
              </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-orange-600 font-bold text-2xl">{statsAppointments.filter(a => a.status === 'Pending').length}</p>
                  <p className="text-orange-600/80 text-sm">รอการยืนยัน</p>
              </div>
              <div className="bg-orange-100 p-2 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
              </div>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-green-600 font-bold text-2xl">{statsAppointments.filter(a => a.status === 'Confirmed').length}</p>
                  <p className="text-green-600/80 text-sm">ยืนยันแล้ว</p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                  <p className="text-red-600 font-bold text-2xl">{statsAppointments.filter(a => a.status === 'Missed').length}</p>
                  <p className="text-red-600/80 text-sm">ขาดนัด</p>
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

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[180px] bg-white border-gray-200 h-[40px] text-sm justify-start text-left font-normal shadow-sm",
                                !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                                (() => {
                                    const date = new Date(selectedDate);
                                    const year = date.getFullYear() + 543;
                                    return `${format(date, "d MMM", { locale: th })} ${year}`;
                                })()
                            ) : (
                                <span>ทั้งหมด</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={cn("w-auto p-0")} align="start" side="left">
                        <CalendarPicker
                            mode="single"
                            selected={selectedDate ? new Date(selectedDate) : undefined}
                            onSelect={(date) => setSelectedDate(date ? format(date, "yyyy-MM-dd") : "")}
                            locale={th}
                            formatters={{
                                formatCaption: (date) => {
                                    const year = date.getFullYear() + 543;
                                    return `${format(date, "MMMM", { locale: th })} ${year}`;
                                }
                            }}
                            classNames={{
                                day_selected: "bg-[#7367f0] text-white hover:bg-[#7367f0] hover:text-white focus:bg-[#7367f0] focus:text-white rounded-md",
                            }}
                        />
                    </PopoverContent>
                </Popover>

                <Button 
                  onClick={handleCreateClick}
                  className="bg-[#7367f0] hover:bg-[#685dd8] text-white font-medium px-4 py-2 h-[42px] rounded-[5px] shadow-sm gap-2"
                >
                   <Plus className="h-4 w-4" />
                   <span>เพิ่มนัดหมาย</span>
                </Button>
            </div>
        </div>

        {/* Filters Section */}
        <div className="px-6 pt-6 pb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50 p-4 rounded-lg border border-dashed border-gray-200">
                    <TabsList className="bg-white p-1 h-auto rounded-lg grid grid-cols-2 w-full md:w-[320px] border border-gray-200 shadow-sm mx-auto md:mx-0">
                        <TabsTrigger value="current" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-1.5 text-sm rounded-md transition-all">
                            รายการนัดหมาย
                        </TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-[#7367f0] data-[state=active]:text-white py-1.5 text-sm rounded-md transition-all">
                            ประวัติย้อนหลัง
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex flex-wrap items-center gap-3 justify-end w-full md:w-auto">
                        <div className="flex items-center gap-2">
                            <Label className="text-[#5e5873] font-medium text-xs uppercase tracking-wide">พื้นที่:</Label>
                            <Select defaultValue="fang">
                                <SelectTrigger className="w-[140px] bg-white border-gray-200 h-9 text-sm">
                                    <SelectValue placeholder="เลือกอำเภอ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fang">อำเภอฝาง</SelectItem>
                                    <SelectItem value="mae-ai">อำเภอแม่อาย</SelectItem>
                                    <SelectItem value="chai-prakan">อำเภอไชยปราการ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
                        {filteredAppointments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-400 py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <CalendarIcon className="w-10 h-10 opacity-20" />
                                        <p className="text-sm">ไม่พบข้อมูลนัดหมาย</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAppointments.map((apt) => (
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
                                             {format(new Date(apt.date), "d MMM yy", { locale: th })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-bold text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{apt.patientName}</div>
                                            <Badge variant="outline" className="text-gray-500 text-[10px] h-5">HN: {apt.hn}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-[#5e5873] font-medium truncate max-w-[180px]" title={apt.hospital}>{apt.hospital}</div>
                                        <div className="flex items-center gap-1 text-xs text-[#b9b9c3] mt-1">
                                            <MapPin className="w-3 h-3" /> {apt.clinic}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-[#5e5873]">{apt.doctorName}</div>
                                        {apt.note && (
                                            <div className="text-xs text-gray-400 mt-1 italic truncate max-w-[150px]">
                                                "{apt.note}"
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {apt.status === 'Confirmed' && <Badge className="bg-green-100 text-green-600 hover:bg-green-200 border-green-200">ยืนยันแล้ว</Badge>}
                                        {apt.status === 'Pending' && <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-orange-200">รอการยืนยัน</Badge>}
                                        {apt.status === 'Cancelled' && <Badge className="bg-red-100 text-red-600 hover:bg-red-200 border-red-200">ยกเลิก</Badge>}
                                        {apt.status === 'Missed' && <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200">ขาดนัด</Badge>}
                                        {apt.status === 'Completed' && <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200">เสร็จสิ้น</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#28C76F] hover:text-[#23af62]" onClick={(e) => { e.stopPropagation(); handlePrint(apt); }}>
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:text-[#5e50ee]" onClick={(e) => { e.stopPropagation(); handleEditClick(apt); }}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                 variant="ghost" 
                                                 size="icon" 
                                                 className="h-8 w-8 text-[#EA5455] hover:text-[#d33a3b]" 
                                                 onClick={(e) => {
                                                     e.stopPropagation(); 
                                                     handleDeleteClick(apt);
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
      </Card>

      {/* --- Modals (Logic Retained) --- */}
      
      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[700px]">
            <DialogHeader className="bg-[#f8f9fa] -mx-6 -mt-6 p-6 border-b">
                <DialogTitle className="flex items-center gap-2 text-[#7367f0]">
                    <Edit className="w-5 h-5" /> 
                    {editingApt?.id ? 'แก้ไขข้อมูลนัดหมาย' : 'สร้างนัดหมายใหม่'}
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 mt-1">
                    Full System Control Mode
                </DialogDescription>
            </DialogHeader>
            
            {editingApt && (
                <div className="grid grid-cols-2 gap-6 py-4">
                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <div className="space-y-2">
                            <Label>ชื่อผู้ป่วย <span className="text-red-500">*</span></Label>
                            <Input 
                                value={editingApt.patientName || ''} 
                                onChange={e => setEditingApt({...editingApt, patientName: e.target.value})}
                                placeholder="ระบุชื่อผู้ป่วย"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>HN</Label>
                            <Input 
                                value={editingApt.hn || ''} 
                                onChange={e => setEditingApt({...editingApt, hn: e.target.value})}
                                placeholder="ระบุ HN"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>โรงพยาบาล <span className="text-red-500">*</span></Label>
                            <Select 
                                value={editingApt.hospital} 
                                onValueChange={v => setEditingApt({...editingApt, hospital: v})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกโรงพยาบาล" />
                                </SelectTrigger>
                                <SelectContent>
                                    {HOSPITALS.filter(h => h !== "ทั้งหมด").map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>คลินิก/แผนก</Label>
                            <Select 
                                value={editingApt.clinic} 
                                onValueChange={v => setEditingApt({...editingApt, clinic: v})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกแผนก" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CLINICS.filter(c => c !== "ทั้งหมด").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4 col-span-2 md:col-span-1">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label>วันที่นัด <span className="text-red-500">*</span></Label>
                                <Input 
                                    type="date"
                                    value={editingApt.date || ''} 
                                    onChange={e => setEditingApt({...editingApt, date: e.target.value})}
                                />
                             </div>
                             <div className="space-y-2">
                                <Label>เวลา <span className="text-red-500">*</span></Label>
                                <Input 
                                    type="time"
                                    value={editingApt.time || ''} 
                                    onChange={e => setEditingApt({...editingApt, time: e.target.value})}
                                />
                             </div>
                        </div>

                        <div className="space-y-2">
                            <Label>แพทย์ผู้ตรวจ</Label>
                            <Input 
                                value={editingApt.doctorName || ''} 
                                onChange={e => setEditingApt({...editingApt, doctorName: e.target.value})}
                                placeholder="ระบุชื่อแพทย"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>สถานะ</Label>
                            <Select 
                                value={editingApt.status} 
                                onValueChange={v => setEditingApt({...editingApt, status: v as any})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกสถานะ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Confirmed">ยืนยันแล้ว (Confirmed)</SelectItem>
                                    <SelectItem value="Pending">รอการยืนยัน (Pending)</SelectItem>
                                    <SelectItem value="Cancelled">ยกเลิก (Cancelled)</SelectItem>
                                    <SelectItem value="Missed">ขาดนัด (Missed)</SelectItem>
                                    <SelectItem value="Completed">เสร็จสิ้น (Completed)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>หมายเหตุ / กิจกรรม</Label>
                            <Textarea 
                                value={editingApt.note || ''} 
                                onChange={e => setEditingApt({...editingApt, note: e.target.value})}
                                placeholder="รายละเอียดเพิ่มเติม..."
                            />
                        </div>
                    </div>
                </div>
            )}

            <DialogFooter className="bg-gray-50 -mx-6 -mb-6 p-4 border-t flex justify-between items-center sm:justify-between">
                <div className="text-xs text-gray-400 flex items-center gap-1">
                    <History className="w-3 h-3" />
                    Last edited by: {editingApt?.createdBy || 'SCFC Admin'}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditOpen(false)}>ยกเลิก</Button>
                    <Button className="bg-[#7367f0] hover:bg-[#685dd8]" onClick={handleSave}>บันทึกข้อมูล</Button>
                </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
         <DialogContent className="max-w-[400px]">
             <DialogHeader>
                 <DialogTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" /> ยืนยันการลบ
                 </DialogTitle>
                 <DialogDescription className="sr-only">
                    ยืนยันการลบรายการนัดหมาย
                 </DialogDescription>
             </DialogHeader>
             <div className="py-4 text-center">
                <p className="text-gray-600">คุณต้องการลบนัดหมายของ</p>
                <p className="text-lg font-bold text-[#5e5873] my-2">{targetApt?.patientName}</p>
                <p className="text-sm text-gray-400">การกระทำนี้ไม่สามารถเรียกคืนได้</p>
             </div>
             <DialogFooter className="flex gap-2 justify-center sm:justify-center">
                 <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>ยกเลิก</Button>
                 <Button variant="destructive" onClick={handleConfirmDelete}>ยืนยันลบ</Button>
             </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* Step 2 Selection Dialog */}
      <Dialog open={isStep2Open} onOpenChange={setIsStep2Open}>
         <DialogContent className="max-w-[500px]">
             <DialogHeader>
                 <DialogTitle className="text-[#7367f0] flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6" /> บันทึกการรักษาเรียบร้อยแล้ว
                 </DialogTitle>
                 <DialogDescription>
                    กรุณาเลือกขั้นตอนต่อไปสำหรับการดูแลผู้ป่วย
                 </DialogDescription>
             </DialogHeader>
             
             <div className="grid grid-cols-2 gap-4 py-6">
                <Button 
                    variant="outline" 
                    className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed hover:border-[#7367f0] hover:bg-[#7367f0]/5 group"
                    onClick={() => {
                        setIsStep2Open(false);
                        // Pre-fill for next appointment
                         setEditingApt({
                            patientName: medicalRecordApt?.patientName,
                            hn: medicalRecordApt?.hn,
                            hospital: medicalRecordApt?.hospital,
                        });
                        setIsAddFlowOpen(true);
                    }}
                >
                    <div className="w-12 h-12 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#7367f0] group-hover:scale-110 transition-transform">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-gray-700">นัดหมายครั้งถัดไป</div>
                        <div className="text-xs text-gray-400 mt-1">สร้างนัดหมายใหม่</div>
                    </div>
                </Button>

                <Button 
                    variant="outline" 
                    className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed hover:border-red-500 hover:bg-red-50 group"
                    onClick={() => {
                        setIsStep2Open(false);
                        setIsReferralOpen(true);
                    }}
                >
                    <div className="w-12 h-12 rounded-full bg-[#FFF0F0] flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-gray-700">ส่งตัวผู้ป่วย</div>
                        <div className="text-xs text-gray-400 mt-1">สร้างใบส่งตัว (Referral)</div>
                    </div>
                </Button>
             </div>

             <DialogFooter>
                 <Button variant="ghost" onClick={() => setIsStep2Open(false)} className="text-gray-400">
                    ปิดหน้าต่าง
                 </Button>
             </DialogFooter>
         </DialogContent>
      </Dialog>

    </div>
  );
}
