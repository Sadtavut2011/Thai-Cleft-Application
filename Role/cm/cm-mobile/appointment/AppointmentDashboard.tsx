import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { 
  ChevronLeft,
  Search, 
  Calendar, 
  User, 
  Clock,
  Filter,
  Home,
  MapPin,
  Stethoscope,
  CalendarDays,
  DoorOpen,
  Scissors,
  X as XIcon
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { formatThaiDateShort, formatThaiDateWithDay } from "../../../../components/shared/ThaiCalendarDrawer";

import { AppointmentDetail } from '../patient/History/AppointmentDetail';
import { AppointmentFilterDrawer, FilterState } from './AppointmentFilterDrawer';
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE } from '../../../../components/shared/ThaiCalendarDrawer';
import { PATIENTS_DATA } from "../../../../data/patientData";

interface AppointmentDashboardProps {
  onBack?: () => void;
}

// --- Types ---
export interface Appointment {
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
  status: string;
  type?: string;
  detail?: string;
  reason?: string;
  title?: string;
  note?: string;
}

// --- Data Mapping ---
const mapAppointmentData = (data: typeof PATIENTS_DATA): Appointment[] => {
    return data.filter((item: any) => {
        // Ensure date exists
        if (!item.date) return false;
        
        // Filter out non-appointment types similar to AppointmentSystem logic
        const type = item.type || '';
        return !['Refer In', 'Refer Out', 'Home Visit', 'Joint Visit', 'Telemed', 'Routine', 'Delegated', 'ฝากเยี่ยม', 'Joint', 'เยี่ยมร่วม'].includes(type);
    }).map((item: any) => ({
        id: item.id,
        patientImage: item.image,
        patientName: item.name,
        hn: item.hn,
        date: item.date,
        time: item.time || '00:00',
        hospital: item.hospital,
        room: item.room,
        location: item.hospital, // Fallback
        doctor: item.doctor,
        status: item.apptStatus || item.status || 'waiting',
        title: item.title || 'นัดหมายตรวจรักษา',
        reason: item.reason || item.note,
        note: item.note
    }));
};

export default function AppointmentDashboard({ onBack }: AppointmentDashboardProps) {
  // Initialize with centralized data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filters, setFilters] = useState<FilterState>({ rooms: [], treatments: [] });
  const [filterDate, setFilterDate] = useState<Date>(DEFAULT_FILTER_DATE);

  // Form State
  const [viewingData, setViewingData] = useState<Appointment | null>(null);

  // Drag-to-scroll for status pills
  const statusScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (statusScrollRef.current?.offsetLeft || 0);
    scrollLeftStart.current = statusScrollRef.current?.scrollLeft || 0;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !statusScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (statusScrollRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    statusScrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - (statusScrollRef.current?.offsetLeft || 0);
    scrollLeftStart.current = statusScrollRef.current?.scrollLeft || 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current || !statusScrollRef.current) return;
    const x = e.touches[0].pageX - (statusScrollRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    statusScrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  }, []);

  useEffect(() => {
      const mapped = mapAppointmentData(PATIENTS_DATA);
      
      // Keep all appointments for history tab
      setAllAppointments(mapped);
      
      // Split into Upcoming (Scheduled/Waiting) — only for "รายการนัดหมาย" tab
      const upcomingStatuses = ['waiting', 'confirmed', 'checked-in', 'pending', 'accepted'];
      const upcoming = mapped.filter(d => upcomingStatuses.includes(d.status.toLowerCase()));
      setAppointments(upcoming);
  }, []);

  const handleEditClick = (apt: Appointment) => {
    setViewingData(apt);
  };

  const FILTER_OPTIONS = [
    { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#7367f0] text-white shadow-md shadow-indigo-200' },
    { id: 'waiting', label: 'รอตรวจ', color: 'bg-orange-50 text-orange-600 border border-orange-200', activeColor: 'bg-orange-500 text-white shadow-md shadow-orange-200' },
    { id: 'confirmed', label: 'ยืนยันแล้ว', color: 'bg-blue-50 text-blue-600 border border-blue-200', activeColor: 'bg-blue-500 text-white shadow-md shadow-blue-200' },
    { id: 'completed', label: 'เสร็จสิ้น', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
    { id: 'cancelled', label: 'ยกเลิก', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' }
  ];

  const getFilteredData = (data: Appointment[]) => {
    return data.filter(item => {
        const matchesSearch = item.patientName.includes(searchTerm) || item.hn.includes(searchTerm);
        
        let matchesFilter = true;
        if (filterStatus !== 'All') {
            const s = item.status.toLowerCase();
            const f = filterStatus.toLowerCase();
            if (f === 'confirmed') {
                matchesFilter = ['confirmed', 'checked-in', 'accepted'].includes(s);
            } else if (f === 'completed') {
                matchesFilter = ['completed', 'treated'].includes(s);
            } else if (f === 'cancelled') {
                matchesFilter = ['cancelled', 'missed', 'rejected'].includes(s);
            } else {
                matchesFilter = s === f;
            }
        }
        
        // Date filter from CalendarFilterButton
        let matchesDate = true;
        if (filterDate) {
            const filterDateStr = toISODateString(filterDate);
            matchesDate = item.date === filterDateStr;
        }

        // Room filter from AppointmentFilterDrawer
        let matchesRoom = true;
        if (filters.rooms.length > 0) {
            matchesRoom = filters.rooms.some(r => (item.room || '').includes(r));
        }

        // Treatment filter from AppointmentFilterDrawer
        let matchesTreatment = true;
        if (filters.treatments.length > 0) {
            matchesTreatment = filters.treatments.some(t => 
              (item.title || '').includes(t) || (item.reason || '').includes(t) || (item.note || '').includes(t)
            );
        }
        
        return matchesSearch && matchesFilter && matchesDate && matchesRoom && matchesTreatment;
    }).sort((a, b) => {
        // Sort by date then time
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });
  };

  const getStatusColor = (status: string) => {
      switch(status.toLowerCase()) {
          case 'waiting': return 'bg-orange-100 text-orange-700';
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
          case 'waiting': return 'รอตรวจ';
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

  // --- History tab helpers (matching HomeVisitSystem pattern) ---
  // Get history data: ALL appointments, filtered by search + status + room/treatment (NO date filter), sorted newest first
  const getHistoryAppointments = () => {
    return allAppointments.filter(item => {
      const matchesSearch = !searchTerm || item.patientName.includes(searchTerm) || item.hn.includes(searchTerm);

      let matchesFilter = true;
      if (filterStatus !== 'All') {
        const s = item.status.toLowerCase();
        const f = filterStatus.toLowerCase();
        if (f === 'confirmed') {
          matchesFilter = ['confirmed', 'checked-in', 'accepted'].includes(s);
        } else if (f === 'completed') {
          matchesFilter = ['completed', 'treated'].includes(s);
        } else if (f === 'cancelled') {
          matchesFilter = ['cancelled', 'missed', 'rejected'].includes(s);
        } else {
          matchesFilter = s === f;
        }
      }

      let matchesRoom = true;
      if (filters.rooms.length > 0) {
        matchesRoom = filters.rooms.some(r => (item.room || '').includes(r));
      }

      let matchesTreatment = true;
      if (filters.treatments.length > 0) {
        matchesTreatment = filters.treatments.some(t =>
          (item.title || '').includes(t) || (item.reason || '').includes(t) || (item.note || '').includes(t)
        );
      }

      return matchesSearch && matchesFilter && matchesRoom && matchesTreatment;
    }).sort((a, b) => {
      // Sort by date descending (newest first)
      const dateA = String(a.date || '');
      const dateB = String(b.date || '');
      return dateB.localeCompare(dateA);
    });
  };

  // Group appointments by date for history display (matching HomeVisitSystem pattern)
  const groupByDate = (items: Appointment[]) => {
    const groups: { date: string; label: string; items: Appointment[] }[] = [];
    const map = new Map<string, Appointment[]>();
    items.forEach(item => {
      const dateKey = String(item.date || 'unknown');
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey)!.push(item);
    });
    // Sort date keys descending (newest first)
    const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    sortedKeys.forEach(dateKey => {
      let label = dateKey;
      if (dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const d = new Date(dateKey + 'T00:00:00');
        label = formatThaiDateWithDay(d);
      }
      groups.push({ date: dateKey, label, items: map.get(dateKey)! });
    });
    return groups;
  };

  if (viewingData) {
    // Convert to prop format expected by AppointmentDetail
    // Note: AppointmentDetail expects specific prop structure
    // We'll map our Appointment interface to match what AppointmentDetail likely needs
    // or just pass the raw data if it handles it.
    // Looking at AppointmentSystem.tsx, it imports AppointmentDetail from '../patient/History/AppointmentDetail'
    
    // Let's assume we can mock the props for now based on common patterns
    const detailProps = {
        appointment: {
            ...viewingData,
            doctorName: viewingData.doctor,
            location: viewingData.location
        },
        patient: {
            name: viewingData.patientName,
            hn: viewingData.hn,
            image: viewingData.patientImage
        },
        onBack: () => setViewingData(null)
    };

    return (
      <AppointmentDetail 
        {...detailProps}
      />
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in duration-300">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">รายการนัดหมาย</h1>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             {/* Search + Filter Button + Calendar Button */}
             <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, HN..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" 
                    />
                </div>
                
                {/* Filter Button → Opens AppointmentFilterDrawer (room + treatment only) */}
                <AppointmentFilterDrawer
                  filters={filters}
                  onApply={(newFilters) => setFilters(newFilters)}
                  trigger={
                    <button className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm relative",
                      (filters.rooms.length > 0 || filters.treatments.length > 0)
                        ? "bg-[#7367f0] text-white border border-[#7367f0] hover:bg-[#685dd8]"
                        : "bg-white border border-gray-200 text-slate-500 hover:bg-slate-50"
                    )}>
                       <Filter className="w-5 h-5" />
                       {(filters.rooms.length > 0 || filters.treatments.length > 0) && (
                         <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                           {filters.rooms.length + filters.treatments.length}
                         </span>
                       )}
                    </button>
                  }
                />

                {/* Calendar Filter Button (separate, matching other systems) */}
                <CalendarFilterButton filterDate={filterDate} onDateSelect={setFilterDate} accentColor="#4285f4" drawerTitle="กรองวันที่" />
             </div>

             {/* Active Filter Chips (room + treatment only, date is managed by calendar button) */}
             {(filters.rooms.length > 0 || filters.treatments.length > 0) && (
               <div className="flex flex-wrap items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {filters.rooms.map(room => (
                    <div key={room} className="flex items-center gap-1.5 bg-blue-50 text-blue-600 pl-2.5 pr-1 py-1 rounded-full border border-blue-200">
                      <DoorOpen className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium truncate max-w-[120px]">{room}</span>
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, rooms: prev.rooms.filter(r => r !== room) }))}
                        className="w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {filters.treatments.map(treatment => (
                    <div key={treatment} className="flex items-center gap-1.5 bg-green-50 text-green-600 pl-2.5 pr-1 py-1 rounded-full border border-green-200">
                      <Scissors className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-medium truncate max-w-[120px]">{treatment}</span>
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, treatments: prev.treatments.filter(t => t !== treatment) }))}
                        className="w-5 h-5 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
               </div>
             )}
             
             <TabsList className="bg-[#F3F4F6] p-1 h-12 rounded-xl grid grid-cols-2 w-full">
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold relative text-[16px]">
                   รายการนัดหมาย
                   {appointments.length > 0 && 
                     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {appointments.length}
                     </span>
                   }
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold text-[16px]">
                   ประวัติ
                </TabsTrigger>
             </TabsList>
          </div>

          {/* Horizontal Scrollable Status Pills - Outside white card, before patient cards */}
          <div 
            ref={statusScrollRef}
            className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setFilterStatus(option.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                  filterStatus === option.id ? option.activeColor : option.color
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Selected Date Label — hidden on history tab (history uses groupByDate dividers instead) */}
          {activeTab !== 'history' && <DateFilterLabel filterDate={filterDate} />}

          {/* --- Tab 1: Upcoming Appointments --- */}
          <TabsContent value="upcoming" className="space-y-4 mt-2">
             {getFilteredData(appointments).map(apt => (
                 <Card key={apt.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => handleEditClick(apt)}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Right Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                {/* Header Row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                            {apt.patientName}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">
                                                HN:{apt.hn}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Status Badge */}
                                        <div className={`px-3 py-1 rounded-[10px] ${getStatusColor(apt.status)}`}>
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px]">
                                                {getStatusLabel(apt.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Row */}
                                <div className="flex items-center justify-between w-full mt-2">
                                    {/* Location */}
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-[16px] h-[16px] text-[#7066a9]" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-slate-600">
                                            {apt.room || 'ไม่ได้ระบุสถานที่'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-100">
                                    {apt.doctor ? (
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="w-[14px] h-[14px] text-slate-400" />
                                            <span className="text-xs text-slate-500 text-[14px]">{apt.doctor}</span>
                                        </div>
                                    ) : <div></div>}
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                                            {apt.date && !isNaN(new Date(apt.date).getTime()) ? formatThaiDateShort(new Date(apt.date)) : '-'} • {apt.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
             {getFilteredData(appointments).length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบรายการนัดหมาย</p>
                 </div>
             )}
          </TabsContent>

          {/* --- Tab 2: History --- */}
          <TabsContent value="history" className="space-y-4 mt-2">
             {groupByDate(getHistoryAppointments()).map(group => (
               <div key={group.date} className="space-y-3">
                 {/* Date Divider — matching HomeVisitSystem pattern */}
                 <div className="flex items-center gap-3 px-1 py-1">
                   <div className="h-px flex-1 bg-gray-200" />
                   <span className="text-[15px] text-[#b4b7bd] whitespace-nowrap">
                     {group.label}
                   </span>
                   <div className="h-px flex-1 bg-gray-200" />
                 </div>
                 {group.items.map(apt => (
                   <Card key={apt.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => handleEditClick(apt)}>
                      <CardContent className="p-4">
                          <div className="flex gap-4">
                              {/* Right Content */}
                              <div className="flex-1 min-w-0 flex flex-col gap-1">
                                  {/* Header Row */}
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                              {apt.patientName}
                                          </h3>
                                          <div className="flex items-center gap-1.5 mt-0.5">
                                              <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px] leading-[16px]">
                                                  HN:{apt.hn}
                                              </span>
                                          </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                          {/* Status Badge */}
                                          <div className={`px-3 py-1 rounded-[10px] ${getStatusColor(apt.status)}`}>
                                              <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px]">
                                                  {getStatusLabel(apt.status)}
                                              </span>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Details Row */}
                                  <div className="flex items-center justify-between w-full mt-2">
                                      {/* Location */}
                                      <div className="flex items-center gap-2">
                                          <MapPin className="w-[16px] h-[16px] text-[#7066a9]" />
                                          <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[16px] text-slate-600">
                                              {apt.room || 'ไม่ได้ระบุสถานที่'}
                                          </span>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-100">
                                      {apt.doctor ? (
                                          <div className="flex items-center gap-2">
                                              <Stethoscope className="w-[14px] h-[14px] text-slate-400" />
                                              <span className="text-xs text-slate-500 text-[14px]">{apt.doctor}</span>
                                          </div>
                                      ) : <div></div>}
                                      <div className="flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                                          <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                                              {apt.date && !isNaN(new Date(apt.date).getTime()) ? formatThaiDateShort(new Date(apt.date)) : '-'} • {apt.time}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </CardContent>
                   </Card>
                 ))}
               </div>
             ))}
             {getHistoryAppointments().length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบประวัติ</p>
                 </div>
             )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const toISODateString = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;