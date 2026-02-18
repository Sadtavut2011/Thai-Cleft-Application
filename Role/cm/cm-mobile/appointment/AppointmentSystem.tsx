import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Clock,
  Filter as FilterIcon,
  MoreHorizontal,
  Settings,
  Trash,
  FileText,
  Pencil,
  Send,
  Smartphone,
  Building2,
  MapPin
} from 'lucide-react';
import Filter from '../../../../components/shared/Filter';
import { Button } from '../../../../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { cn } from "../../../../components/ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContentProps,
} from "../../../../components/ui/dropdown-menu";
import { PATIENTS_DATA, REFERRAL_DATA, HOME_VISIT_DATA, TELEMED_DATA, CASE_MANAGER_DATA } from '../../../../data/patientData';
import AppointmentForm from './forms/AppointmentForm';
import { TeleForm } from '../tele-med/TeleForm';
import { AppointmentDetail } from '../patient/History/AppointmentDetail';
import { ReferralDetail } from '../referral/forms/ReferralDetail';
import { ReferralDetail as ReferralDetailView } from '../patient/History/ReferralDetail';
import { VisitDetail } from '../patient/History/VisitDetail';
import { TeleConsultDetail } from '../patient/History/TeleConsultDetail';
import StandardPageLayout from '../../../../components/shared/layout/StandardPageLayout';
import ConfirmModal from '../../../../components/shared/ConfirmModal';
import { toast } from 'sonner';
import { useRole } from '../../../../context/RoleContext';

// Helper function: แปลง Date Object เป็น YYYY-MM-DD (Local Time Safe)
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function: แปลง Date Object เป็น ชื่อเดือนไทย
const formatMonthYear = (date: Date) => date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });

// Helper function: แปลง YYYY-MM-DD เป็น วันที่/เดือน/ปี ไทย
const formatThaiDate = (dateString: string) => {
  if (!dateString) return 'ไม่ได้ระบุ';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); 
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

// Helper function: แปลง YYYY-MM-DD เป็น วันที่/เดือนย่อ/ปี(2หลัก) ไทย
const formatThaiShortDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); 
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
};

// Helper function: แปลงคำนำหน้าชื่อให้สั้นลง
const formatPatientName = (name: string) => {
  if (!name) return '';
  return name
    .replace('เด็กชาย', 'ด.ช.')
    .replace('เด็กหญิง', 'ด.ญ.')
    .replace('นางสาว', 'น.ส.')
    .replace('นาย', 'น.');
};

const CalendarView = ({ 
    currentMonth, 
    setCurrentMonth, 
    allEvents,
    selectedDate, 
    setSelectedDate, 
    today, 
    isCalendarOpen, 
    setIsCalendarOpen,
    setNewPatient,
    setIsWalkInModalOpen,
    setCurrentView,
    scope = 'appointment'
}: any) => {
    const { currentRole } = useRole();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - (startDate.getDay() === 0 ? 6 : startDate.getDay() - 1));

    const days = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endOfMonth || days.length % 7 !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const appointmentsPerDay = useMemo(() => {
      const map = new Map();
      allEvents.forEach((p: any) => {
        // Filter based on scope to ensure calendar counts reflect the current tab
        let matchesScope = false;
        let dateKey = p.date;

        if (scope === 'appointment') {
            const type = p.type || '';
            // Sync exclusion list with DailyAppointmentList and use appointmentDate
            const isExcluded = ['Refer In', 'Refer Out', 'Home Visit', 'Joint Visit', 'Telemed', 'Routine', 'Delegated', 'ฝากเยี่ยม', 'Joint', 'เยี่ยมร่วม'].includes(type);
            
            // Check specifically for appointmentDate as requested
            if (!isExcluded && p.appointmentDate) {
                matchesScope = true;
                dateKey = p.appointmentDate;
            } else if (!isExcluded && !p.visitDate && !p.referralAppointmentDate && p.scope === 'appointment') {
                 // Fallback for items that are clearly appointments but might miss the specific field (safety)
                 matchesScope = true;
            }
        } else if (scope === 'refer') {
            matchesScope = p.type === 'Refer In' && !['pending', 'referred', 'Pending', 'Rejected', 'rejected'].includes(p.status || '');
        } else if (scope === 'homevisit') {
            if (currentRole === 'PCU') {
                matchesScope = p.type === 'Delegated' || p.type === 'ฝากเยี่ยม';
                // Add Status Filter for PCU Calendar View as well to be consistent
                const status = (p.status || '').toLowerCase();
                const isAllowedStatus = ['waitvisit', 'inprogress', 'completed', 'waiting', 'in_progress'].includes(status);
                matchesScope = matchesScope && isAllowedStatus;
            } else {
                matchesScope = p.type === 'Joint Visit' || p.type === 'Joint' || p.type === 'เยี่ยมร่วม';
            }
        } else if (scope === 'telemed') {
            matchesScope = p.type === 'Telemed';
        } else {
            matchesScope = true;
        }

        if (dateKey && matchesScope) {
            map.set(dateKey, (map.get(dateKey) || 0) + 1);
        }
      });
      return map;
    }, [allEvents, scope, currentRole]);
    
    const changeMonth = (amount: number) => {
      setCurrentMonth((prev: Date) => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    };

    const getThemeColor = () => {
        switch(scope) {
            case 'refer': return 'bg-orange-500';
            case 'homevisit': return 'bg-green-500';
            case 'telemed': return 'bg-pink-500';
            default: return 'bg-blue-500';
        }
    };

    const getThemeTextColor = () => {
        switch(scope) {
            case 'refer': return 'text-orange-500';
            case 'homevisit': return 'text-green-500';
            case 'telemed': return 'text-pink-500';
            default: return 'text-blue-500';
        }
    };

    const getThemeBorderColor = () => {
         switch(scope) {
            case 'refer': return 'border-orange-500 bg-orange-50';
            case 'homevisit': return 'border-green-500 bg-green-50';
            case 'telemed': return 'border-pink-500 bg-pink-50';
            default: return 'border-blue-500 bg-blue-50';
        }
    };

    const getThemeTextTodayColor = () => {
         switch(scope) {
            case 'refer': return 'text-orange-700';
            case 'homevisit': return 'text-green-700';
            case 'telemed': return 'text-pink-700';
            default: return 'text-blue-700';
        }
    };

    return (
      <div className="mb-0 transition-all duration-300">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
             <button onClick={() => changeMonth(-1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" disabled={!isCalendarOpen}>
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-lg text-slate-800 text-[16px]">
                  {formatMonthYear(currentMonth)}
              </h3>
              <button onClick={() => changeMonth(1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full" disabled={!isCalendarOpen}>
                <ChevronRight size={18} />
              </button>
              
              <div className="bg-slate-100 p-1 rounded-lg inline-flex items-center ml-2">
                <button 
                  onClick={() => setSelectedDate(null)} 
                  className={`px-3 py-1 text-[14px] font-medium rounded-md transition-all ${!selectedDate ? 'bg-white shadow text-slate-700' : 'text-slate-500'}`}
                >
                  ทั้งหมด
                </button>
                <button 
                  onClick={() => setSelectedDate(formatDate(today))} 
                  className={`px-3 py-1 text-[14px] font-medium rounded-md transition-all ${selectedDate === formatDate(today) ? 'bg-white shadow text-slate-700' : 'text-slate-500'}`}
                >
                  วันนี้
                </button>
             </div>
          </div>
          <div className="flex items-center gap-2">
             {scope === 'appointment' && currentRole !== 'SCFC' && (
               <button 
                  onClick={() => setIsWalkInModalOpen(true)}
                  className={`fixed bottom-[90px] right-4 w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-50 ${getThemeColor()} hover:opacity-90`}
               >
                  <Plus size={28} />
               </button>
             )}
             <button 
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="w-8 h-8 flex items-center justify-center p-1 text-slate-500 hover:bg-slate-200 rounded-full transition-all text-[16px]"
            >
              {isCalendarOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCalendarOpen ? 'max-h-screen p-4' : 'max-h-0 p-0'}`}>
          <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500 mb-2">
            {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map(day => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dateString = formatDate(day);
              const isSelected = dateString === selectedDate;
              const isToday = dateString === formatDate(today);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const appointmentCount = appointmentsPerDay.get(dateString) || 0;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(selectedDate === dateString ? null : dateString)}
                  disabled={!isCurrentMonth}
                  className={`aspect-square w-full p-1 rounded-lg flex flex-col items-center justify-center transition-colors 
                    ${!isCurrentMonth ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-primary/5'}
                    ${isSelected ? `${getThemeColor()} text-white shadow-md` : 'bg-white text-slate-800'}
                    ${isToday && !isSelected ? `border-2 ${getThemeBorderColor()}` : ''}
                  `}
                >
                  <span className={`text-[16px] font-bold ${isSelected ? 'text-white' : (isToday ? getThemeTextTodayColor() : 'text-slate-800')}`}>
                    {day.getDate()}
                  </span>
                  {appointmentCount > 0 && (
                    <span className={`text-[12px] font-medium mt-0.5 px-1.5 py-0.5 rounded-full 
                      ${isSelected ? `bg-white ${getThemeTextColor()}` : `${getThemeColor()}/20 ${getThemeTextColor()}`}
                    `}>
                      {appointmentCount} นัด
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
};

const DailyAppointmentList = ({
    allPatients,
    selectedDate,
    currentMonth,
    setNewPatient,
    setEditingAppointment,
    setIsWalkInModalOpen,
    onDelete,
    onEdit,
    onViewPatient,
    onSelectAppointment,
    onViewDetail,
    setCurrentView,
    readOnly = false,
    ignoreDateFilter = false,
    setSelectedDate,
    today,
    scope,
    setScope,
    onViewHomeVisit,
    hiddenScopes = [],
    isCalendarOpen
}: any) => {
    const { currentRole } = useRole();
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const getFilterOptions = () => {
        if (scope === 'refer') {
            return [
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'pending_receive', label: 'รอรับตัว' },
                { id: 'waiting_exam', label: 'รอตรวจ' },
                { id: 'examined', label: 'ตรวจแล้ว' },
            ];
        }
        if (scope === 'homevisit') {
            if (currentRole === 'PCU') {
                 return [
                    { id: 'all', label: 'ทั้งหมด' },
                    { id: 'wait_visit', label: 'รอเยี่ยม' },
                    { id: 'in_progress', label: 'กำลังเยี่ยม' },
                    { id: 'completed', label: 'เสร็จสิ้น' },
                ];
            }
            return [
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'wait_visit', label: 'รอเยี่ยม' },
                { id: 'in_progress', label: 'ดำเนินการ' },
                { id: 'completed', label: 'เสร็จสิ้น' },
            ];
        }
        if (scope === 'telemed') {
             return [
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'waiting', label: 'รอสาย' },
                { id: 'completed', label: 'เสร็จสิ้น' },
                { id: 'cancelled', label: 'ยกเลิก', isRed: true },
            ];
        }
        // Default Appointment
        return [
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'waiting', label: 'รอตรวจ' },
            { id: 'confirmed', label: 'ยืนยันแล้ว' },
            { id: 'completed', label: 'เสร็จสิ้น' },
            { id: 'cancelled', label: 'ยกเลิก', isRed: true },
        ];
    };
    
    const handleFilterSelect = (status: string) => {
        setStatusFilter(status);
        setIsFilterOpen(false);
    };

    const appointmentsOnSelectedDate = allPatients
      .filter((p: any) => {
        // Status Filter
        if (statusFilter !== 'all') {
            const status = (p.status || '').toLowerCase();
            const filter = statusFilter.toLowerCase();

            if (scope === 'refer') {
                 if (filter === 'pending_receive') {
                      if (!['accepted', 'confirmed'].includes(status)) return false;
                 } else if (filter === 'waiting_exam') {
                      if (!['arrived', 'waiting', 'received', 'waiting_doctor'].includes(status)) return false;
                 } else if (filter === 'examined') {
                      if (!['completed', 'treated'].includes(status)) return false;
                 }
            } else if (scope === 'homevisit') {
                 if (filter === 'wait_visit') {
                      if (!['waitvisit', 'wait_visit', 'waiting', 'confirmed'].includes(status)) return false;
                      // Exclude pending if role is PCU (double check, though already filtered in main loop)
                 } else if (filter === 'in_progress') {
                      if (!['inprogress', 'in_progress'].includes(status)) return false;
                 } else if (filter === 'completed') {
                      if (status !== 'completed') return false;
                 }
            } else if (scope === 'telemed') {
                 if (filter === 'waiting') {
                      if (!['waiting', 'pending'].includes(status)) return false;
                 } else if (filter === 'in_progress') {
                      if (!['inprogress', 'in_progress'].includes(status)) return false;
                 } else if (filter === 'completed') {
                      if (status !== 'completed') return false;
                 } else if (filter === 'cancelled') {
                      if (!['cancelled', 'missed'].includes(status)) return false;
                 }
            } else {
                 // Default Scope
                 if (filter === 'waiting') {
                    if (status !== 'waiting') return false;
                 } else if (filter === 'confirmed') {
                    if (!['checked-in', 'referred', 'confirmed', 'accepted'].includes(status)) return false;
                 } else if (filter === 'completed') {
                    if (!['completed', 'treated'].includes(status)) return false;
                 } else if (filter === 'cancelled') {
                    if (!['cancelled', 'missed', 'rejected', 'cancel'].includes(status)) return false;
                 } else {
                    if (status !== filter) return false;
                 }
            }
        }

        if (ignoreDateFilter) return true;
        if (!selectedDate) {
             if (!currentMonth) return true;
             if (!p.date) return false;
             const pDate = new Date(p.date);
             return pDate.getMonth() === currentMonth.getMonth() && pDate.getFullYear() === currentMonth.getFullYear();
        }
        return p.date === selectedDate;
      })
      .filter((p: any) => {
          // Scope Filter using real data types and normalized logic
          // Scope: appointment -> Show normal appointments (not refer/homevisit/telemed)
          // Scope: refer -> Show 'Refer In'
          // Scope: homevisit -> Show 'Home Visit' or 'Joint Visit'
          // Scope: telemed -> Show 'Telemed'

          if (scope === 'appointment') {
             // Exclude special types
             const type = p.type || '';
             return !['Refer In', 'Refer Out', 'Home Visit', 'Joint Visit', 'Telemed', 'Routine', 'Delegated', 'ฝากเยี่ยม', 'Joint'].includes(type);
          }
          if (scope === 'refer') return p.type === 'Refer In' && !['pending', 'referred', 'Pending', 'Rejected', 'rejected'].includes(p.status || '');
          if (scope === 'homevisit') {
              if (currentRole === 'PCU') {
                  // If role is PCU, show ONLY Delegated type
                  const isDelegated = p.type === 'Delegated' || p.type === 'ฝากเยี่ยม';
                  
                  // Filter Status: WaitVisit, InProgress, Completed
                  const status = (p.status || '').toLowerCase();
                  const isAllowedStatus = ['waitvisit', 'wait_visit', 'inprogress', 'in_progress', 'completed', 'waiting'].includes(status);
                  
                  return isDelegated && isAllowedStatus;
              }
              // For others (CM included), show ONLY Joint visits in this calendar view
              return ['Joint Visit', 'Joint', 'เยี่ยมร่วม'].includes(p.type);
          }
          if (scope === 'telemed') return p.type === 'Telemed';
          
          return true;
      })
      .sort((a: any, b: any) => (a.time || '').localeCompare(b.time || ''));

    const displayDate = selectedDate ? formatThaiDate(selectedDate) : (currentMonth ? formatMonthYear(currentMonth) : 'ทั้งหมด');

    const handleRowClick = (patient: any) => {
        if (onSelectAppointment) {
            onSelectAppointment(patient);
        }
    };

    return (
      <div className="overflow-hidden relative flex-1 flex flex-col">
        <div className="px-4 pt-4 bg-white flex items-center gap-2">
             <div className="bg-slate-100 p-1 rounded-xl flex items-center flex-1 overflow-x-auto no-scrollbar">
                {!hiddenScopes.includes('appointment') && (
                    <button 
                      onClick={() => setScope('appointment')}
                      className={`flex-1 py-2 px-2 text-[16px] font-medium rounded-lg transition-all whitespace-nowrap ${scope === 'appointment' ? 'bg-white shadow text-blue-500' : 'text-slate-500'}`}
                    >
                      นัดหมาย
                    </button>
                )}
                {!hiddenScopes.includes('refer') && (
                    <button 
                      onClick={() => setScope('refer')}
                      className={`flex-1 py-2 px-2 text-[16px] font-medium rounded-lg transition-all whitespace-nowrap ${scope === 'refer' ? 'bg-white shadow text-orange-500' : 'text-slate-500'}`}
                    >
                      รับตัว
                    </button>
                )}
                {!hiddenScopes.includes('homevisit') && (
                    <button 
                      onClick={() => setScope('homevisit')}
                      className={`flex-1 py-2 px-2 text-[16px] font-medium rounded-lg transition-all whitespace-nowrap ${scope === 'homevisit' ? 'bg-white shadow text-green-500' : 'text-slate-500'}`}
                    >
                      {currentRole === 'PCU' ? 'ฝากเยี่ยม' : 'ลงเยี่ยม'}
                    </button>
                )}
                {!hiddenScopes.includes('telemed') && (
                    <button 
                      onClick={() => setScope('telemed')}
                      className={`flex-1 py-2 px-2 text-[16px] font-medium rounded-lg transition-all whitespace-nowrap ${scope === 'telemed' ? 'bg-white shadow text-pink-500' : 'text-slate-500'}`}
                    >
                      Tele-med
                    </button>
                )}
             </div>
        </div>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {ignoreDateFilter ? 'รายชื่อผู้ป่วยขาดนัด (ทั้งหมด)' : `: ${displayDate}`}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 text-[16px]">รวม: {appointmentsOnSelectedDate.length}</span>
            <div className="relative">
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                      <FilterIcon size={16} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    align="end" 
                    side={isCalendarOpen ? "top" : "bottom"}
                    className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100"
                  >
                      <div className="flex flex-col">
                          {getFilterOptions().map((option: any) => (
                              <button
                                  key={option.id}
                                  onClick={() => handleFilterSelect(option.id)}
                                  className={cn(
                                      "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
                                      statusFilter === option.id 
                                        ? "bg-slate-50 text-[#7367f0]" 
                                        : option.isRed 
                                            ? "text-red-500 hover:bg-red-50"
                                            : "text-slate-700 hover:bg-slate-50"
                                  )}
                              >
                                  {option.label}
                              </button>
                          ))}
                      </div>
                  </PopoverContent>
                </Popover>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {appointmentsOnSelectedDate.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Clock size={32} className="mx-auto mb-3 text-slate-300" />
                  <p>{ignoreDateFilter ? 'ไม่พบผู้ป่วย' : 'ไม่มีรายการนัดหมายในวันนี้'}</p>
                </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-600 text-xs md:text-sm sticky top-0 z-10">
                <tr>
                  <th className="p-2 font-medium whitespace-nowrap w-[60px] text-[14px]">เวลา</th>
                  <th className="p-2 font-medium text-[14px]">HN / ชื่อ-สกุล</th>
                  <th className="p-2 font-medium text-center md:text-right w-[120px] text-[14px]">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointmentsOnSelectedDate.map((patient: any, index: number) => (
                  <tr 
                    key={`${patient.id}-${index}`} 
                    className={cn("cursor-pointer", index % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]")}
                    onClick={() => handleRowClick(patient)}
                  >
                    <td className="p-2 font-mono text-slate-600 text-xs md:text-sm align-top md:align-middle font-bold text-[#1f2937]">
                      <div className="font-['IBM_Plex_Sans_Thai'] text-sm md:text-base text-[18px]">{patient.time.split('-')[0].trim()}</div>
                      <div className="font-['IBM_Plex_Sans_Thai'] text-[14px] text-slate-500 font-normal mt-0.5 whitespace-nowrap">{formatThaiShortDate(patient.date)}</div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="font-bold text-[#1f2937] md:text-[16px] leading-tight line-clamp-1 md:line-clamp-none text-[18px]">{formatPatientName(patient.name)}</div>
                      <div className="text-[12px] md:text-[14px] text-slate-500 font-medium flex flex-col gap-0.5 mt-1">
                         {scope === 'appointment' && (
                             <div className="flex flex-col">
                                <span className="text-slate-500 text-[16px]">{patient.age}</span>
                                {patient.room && <span className="text-[rgb(47,128,237)] mt-0.5 text-[16px]">{patient.room}</span>}
                             </div>
                         )}
                         {scope === 'refer' && (
                             <div className="flex flex-col">
                                <span className="text-slate-500 text-[16px]">{patient.age}</span>
                                <span className="text-[rgb(249,115,22)] text-xs mt-0.5 text-[16px]">
                                   {patient.hospital}
                                </span>
                             </div>
                         )}
                         {scope === 'homevisit' && (
                             <div className="flex flex-col">
                                 <span className="text-slate-500 text-[16px]">{patient.age}</span>
                                 <span className="text-[#7066a9] mt-0.5 text-[16px] text-[rgb(34,197,94)]">
                                    {patient.rph || patient.hospital}
                                 </span>
                             </div>
                         )}
                         {scope === 'telemed' && (
                             <div className="flex flex-col">
                                 <span className="text-slate-500 text-[16px]">{patient.age}</span>
                                 <span className={`flex items-center gap-1 mt-0.5 text-[16px] ${patient.channel === 'mobile' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                    {patient.channel === 'mobile' ? <Smartphone size={12} /> : <Building2 size={12} />}
                                    {patient.channel === 'mobile' ? 'Mobile' : 'Hospital'}
                                 </span>
                             </div>
                         )}
                      </div>
                    </td>
                    <td className="p-2 align-middle text-center md:text-right">
                       {(() => {
                          let status = (patient.apptStatus || patient.status)?.toLowerCase() || '';
                          let colorClass = 'bg-slate-100 text-slate-600';
                          let label = status;

                          if (scope === 'appointment') {
                              if (status === 'waiting') { colorClass = 'bg-orange-100 text-orange-700'; label = 'รอตรวจ'; }
                              else if (['checked-in', 'confirmed', 'accepted'].includes(status)) { colorClass = 'bg-blue-100 text-blue-700'; label = 'ยืนยันแล้ว'; }
                              else if (['completed', 'treated'].includes(status)) { colorClass = 'bg-emerald-100 text-emerald-700'; label = 'เสร็จสิ้น'; }
                              else if (['missed', 'cancelled', 'rejected'].includes(status)) { colorClass = 'bg-red-100 text-red-700'; label = 'ยกเลิก'; }
                          } else if (scope === 'refer') {
                              if (['accepted', 'confirmed'].includes(status)) { colorClass = 'bg-orange-100 text-orange-700'; label = 'รอรับตัว'; }
                              else if (['pending', 'referred'].includes(status)) { colorClass = 'bg-yellow-100 text-yellow-700'; label = 'รอการตอบรับ'; }
                              else if (['received', 'waiting_doctor', 'waiting'].includes(status)) { colorClass = 'bg-blue-100 text-blue-700'; label = 'รอตรวจ'; }
                              else if (['completed', 'treated'].includes(status)) { colorClass = 'bg-emerald-100 text-emerald-700'; label = 'ตรวจแล้ว'; }
                              else if (status === 'rejected') { colorClass = 'bg-red-100 text-red-700'; label = 'ปฏิเสธ'; }
                              else { label = status; }
                          } else if (scope === 'homevisit') {
                              if (['waitvisit', 'wait_visit', 'waiting', 'confirmed'].includes(status)) { colorClass = 'bg-yellow-100 text-yellow-700'; label = 'รอเยี่ยม'; }
                              else if (['inprogress', 'in_progress'].includes(status)) { colorClass = 'bg-blue-100 text-blue-700'; label = 'กำลังเยี่ยม'; }
                              else if (status === 'completed') { colorClass = 'bg-emerald-100 text-emerald-700'; label = 'เสร็จสิ้น'; }
                              else if (['pending'].includes(status)) { colorClass = 'bg-orange-100 text-orange-700'; label = 'รอตอบรับ'; }
                          } else if (scope === 'telemed') {
                              if (['waiting', 'pending'].includes(status)) { colorClass = 'bg-orange-100 text-orange-700'; label = 'รอสาย'; }
                              else if (['inprogress', 'in_progress'].includes(status)) { colorClass = 'bg-blue-100 text-blue-700'; label = 'ดำเนินการ'; }
                              else if (status === 'completed') { colorClass = 'bg-emerald-100 text-emerald-700'; label = 'เสร็จสิ้น'; }
                              else if (['cancelled', 'missed'].includes(status)) { colorClass = 'bg-red-100 text-red-700'; label = 'ยกเลิก'; }
                          }
                          
                          return (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap ${colorClass}`}>
                                <span className="w-2 h-2 rounded-full bg-current opacity-75"></span>
                                <span>{label === 'กำลังเยี่ยม' ? 'ดำเนินการ' : label}</span>
                              </span>
                          );
                       })()}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
};

export default function AppointmentSystem({
    onNavigateToSystem, // For external navigation
    patients,
    onUpdatePatient,
    hiddenScopes = []
}: any) {
    // State
    const { currentRole } = useRole();
    const today = useMemo(() => new Date(), []);
    // Default to December 2025 (2568 BE) as requested
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1));
    const [isCalendarOpen, setIsCalendarOpen] = useState(true);
    const [scope, setScope] = useState('appointment');
    const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isAppointmentDetailOpen, setIsAppointmentDetailOpen] = useState(false);
    const [isVisitViewOpen, setIsVisitViewOpen] = useState(false);
    const [isTeleViewOpen, setIsTeleViewOpen] = useState(false);
    const [isReferralViewOpen, setIsReferralViewOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState<any>(null);
    const [isTeleFormOpen, setIsTeleFormOpen] = useState(false);
    const [selectedTelemedAppointment, setSelectedTelemedAppointment] = useState<any>(null);
    const [isHomeVisitDetailOpen, setIsHomeVisitDetailOpen] = useState(false);
    const [selectedHomeVisitAppointment, setSelectedHomeVisitAppointment] = useState<any>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // New State for ReferralDetail Overlay
    const [isReferralDetailOpen, setIsReferralDetailOpen] = useState(false);
    const [selectedReferralData, setSelectedReferralData] = useState<any>(null);

    // SCFC-specific: Hospital filter
    const [selectedHospital, setSelectedHospital] = useState<string>('all');
    const [isHospitalFilterOpen, setIsHospitalFilterOpen] = useState(false);
    const isSCFC = currentRole === 'SCFC';

    // SCFC-specific: Province filter
    const [selectedProvince, setSelectedProvince] = useState<string>('all');
    const [isProvinceFilterOpen, setIsProvinceFilterOpen] = useState(false);

    // Derive unique provinces from patient data for SCFC filter
    const provinceList = useMemo(() => {
        const provinces = new Set<string>();
        (patients || PATIENTS_DATA).forEach((p: any) => {
            const prov = p.addressProvince || p.address?.province;
            if (prov && prov !== '-') provinces.add(prov);
        });
        return Array.from(provinces).sort();
    }, [patients]);

    // Derive unique hospitals from patient data for SCFC filter (filtered by province)
    const hospitalList = useMemo(() => {
        const hospitals = new Set<string>();
        const allCMHospitals = CASE_MANAGER_DATA.flatMap(cm => cm.hospitals.map((h: any) => h.name));
        allCMHospitals.forEach(h => hospitals.add(h));
        (patients || PATIENTS_DATA).forEach((p: any) => {
            if (p.hospital) {
                // If a province is selected, only include hospitals from that province
                if (selectedProvince !== 'all') {
                    const prov = p.addressProvince || p.address?.province;
                    if (prov === selectedProvince) hospitals.add(p.hospital);
                } else {
                    hospitals.add(p.hospital);
                }
            }
        });
        return Array.from(hospitals).sort();
    }, [patients, selectedProvince]);

    // Combine and flatten all patient history into events
    const allEvents = useMemo(() => {
        const basePatients = patients || PATIENTS_DATA;
        const events: any[] = [];
        // Depend on refreshTrigger to force re-calc
        const _trigger = refreshTrigger;

        basePatients.forEach((p: any) => {
            // 1. Appointments
            if (p.appointmentHistory) {
                p.appointmentHistory.forEach((appt: any) => {
                   if (!appt.rawDate) return;
                   
                   events.push({
                       ...p, // Inherit patient details
                       patientId: p.id, // Preserve original ID
                       id: `appt-${p.id}-${appt.rawDate}`,
                       rawDate: appt.rawDate, // Added rawDate for update matching
                       date: appt.rawDate.split('T')[0],
                       appointmentDate: appt.rawDate.split('T')[0], // Explicit variable for Appointment Date
                       time: appt.time || appt.rawDate.split('T')[1]?.substring(0, 5) || '00:00',
                       type: appt.title || 'นัดหมายทั่วไป', // Fallback title
                       location: appt.location,
                       room: appt.room || appt.location, // Map for UI
                       doctor: appt.doctor,
                       status: appt.status,
                       apptStatus: appt.status, // Map for UI logic
                       scope: 'appointment'
                   });
                });
            }

            // 2. Referrals (synced with Global REFERRAL_DATA)
            const patientReferrals = REFERRAL_DATA.filter((r: any) => r.patientHn === p.hn || r.hn === p.hn);
            patientReferrals.forEach((ref: any) => {
                 // Use acceptedDate if available
                 const dateStr = ref.acceptedDate || ref.appointmentDate || ref.date || ref.referralDate;
                 if (!dateStr) return;
                 
                 const dateYMD = dateStr.split('T')[0];
                 const timeStr = dateStr.includes('T') ? dateStr.split('T')[1].substring(0, 5) : (ref.time || '09:00');

                 events.push({
                     ...p,
                     patientId: p.id,
                     id: `ref-${ref.id}`,
                     rawDate: dateStr,
                     date: dateYMD,
                     referralAppointmentDate: dateYMD, // Explicit variable for Referral Appointment Date
                     time: timeStr,
                     type: 'Refer In', 
                     status: ref.status,
                     apptStatus: ref.status,
                     hospital: ref.hospital || ref.from,
                     reason: ref.reason || ref.title,
                     doctor: '-',
                     scope: 'refer',
                     // Include all referral fields for Detail View
                     acceptedDate: ref.acceptedDate,
                     referralDate: ref.referralDate || ref.date,
                     from: ref.from || ref.hospital,
                     to: ref.to || ref.destinationHospital,
                     referralNo: ref.referralNo,
                     title: ref.title
                 });
            });

            // 3. Home Visits (Synced with Global HOME_VISIT_DATA)
            // Use HOME_VISIT_DATA instead of stale p.visitHistory to ensure synchronization with HomeVisitListView
            const patientVisits = HOME_VISIT_DATA.filter(v => v.patientHn === p.hn || v.hn === p.hn);
            
            patientVisits.forEach((visit: any) => {
                    // Allow Joint and Delegated types
                    if (visit.type !== 'Joint' && visit.type !== 'Delegated' && visit.type !== 'ฝากเยี่ยม') return;

                    events.push({
                        ...p,
                        patientId: p.id,
                        id: visit.id,
                        rawDate: visit.date,
                        date: visit.date.split('T')[0],
                        visitDate: visit.date.split('T')[0], 
                        time: visit.time || '10:00', 
                        type: visit.type, 
                        status: visit.status,
                        apptStatus: visit.status,
                        provider: visit.rph,
                        rph: visit.rph,
                        results: visit.detail || visit.note || visit.results,
                        scope: 'homevisit',
                        visitType: visit.type
                    });
            });

            // 4. Telemed
            if (p.teleConsultHistory) {
                 p.teleConsultHistory.forEach((tele: any) => {
                    if (!tele.rawDate) return;
                    events.push({
                        ...p,
                        patientId: p.id,
                        id: `tele-${p.id}-${tele.rawDate}`,
                        rawDate: tele.rawDate,
                        date: tele.rawDate.split('T')[0],
                        time: tele.rawDate.split('T')[1]?.substring(0, 5) || '00:00',
                        type: 'Telemed', // Ensure it matches scope filter
                        status: tele.status,
                        apptStatus: tele.status, // Ensure UI uses this status
                        channel: (tele.from === 'Home' || tele.from === 'บ้าน') ? 'mobile' : 'hospital',
                        scope: 'telemed'
                    });
                 });
            }
        });
        
        return events;
    }, [patients, refreshTrigger]);

    // SCFC: filter events by selected province and hospital
    const filteredEvents = useMemo(() => {
        if (!isSCFC) return allEvents;
        return allEvents.filter((e: any) => {
            // Province filter
            if (selectedProvince !== 'all') {
                const eventProvince = e.addressProvince || e.address?.province || '';
                if (eventProvince !== selectedProvince) return false;
            }
            // Hospital filter
            if (selectedHospital !== 'all') {
                const eventHospital = e.hospital || e.rph || '';
                if (!eventHospital.includes(selectedHospital) && !selectedHospital.includes(eventHospital)) return false;
            }
            return true;
        });
    }, [allEvents, isSCFC, selectedHospital, selectedProvince]);

    const handleNavigate = (patient: any) => {
        if (!onNavigateToSystem) {
             console.log("No navigation handler provided", patient);
             return;
        }

        if (scope === 'telemed') {
             // Open TeleForm modal instead of navigating
             setSelectedTelemedAppointment(patient);
             setIsTeleFormOpen(true);
        } else if (scope === 'homevisit') {
             setSelectedHomeVisitAppointment(patient);
             setIsHomeVisitDetailOpen(true);
        } else if (scope === 'refer') {
             // SPECIAL LOGIC: 
             // If status is 'pending' (Wait for receive), show as 'Accepted' (Approved) in Detail view
             // to match the requested visual result
             const isWaitingForReceive = ['pending', 'referred', 'Pending'].includes(patient.status);
             
             const mappedReferral = {
                 ...patient,
                 patientName: patient.name || patient.patientName,
                 patientHn: patient.hn || patient.patientHn,
                 destinationHospital: patient.destinationHospital || 'รพ.ฝาง',
                 // Force Accepted status if it was pending to show Approved view
                 status: isWaitingForReceive ? 'Accepted' : patient.status,
                 // Ensure appointment date exists for Accepted view
                 appointmentDate: isWaitingForReceive ? (patient.date || new Date().toISOString()) : patient.appointmentDate,
                 referralNo: patient.referralNo || `REF-${patient.id}`
             };

             setSelectedReferralData(mappedReferral);
             setIsReferralDetailOpen(true);
        } else {
             // Default Appointment view? 
             // Currently no specific system for appointment details other than modal edit
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* SCFC Province & Hospital Filter Bar */}
            {isSCFC && (
                <div className="bg-white border-b border-slate-100 px-4 py-3 flex flex-row gap-2">
                    {/* Province Filter */}
                    <Popover open={isProvinceFilterOpen} onOpenChange={setIsProvinceFilterOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative flex-1 min-w-0 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-[0.98]">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                     <MapPin size={18} />
                                 </div>
                                 <span className="pl-7 pr-6 text-[14px] font-medium text-[#37286A] truncate">
                                     {selectedProvince === 'all' ? 'ทุกจังหวัด' : selectedProvince}
                                 </span>
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                     <ChevronDown size={18} />
                                 </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[280px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                             <div className="flex flex-col">
                                 <button
                                      onClick={() => { setSelectedProvince('all'); setSelectedHospital('all'); setIsProvinceFilterOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedProvince === 'all' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                      )}
                                  >
                                      ทุกจังหวัด
                                  </button>
                                 {provinceList.map(prov => (
                                   <button
                                      key={prov}
                                      onClick={() => { setSelectedProvince(prov); setSelectedHospital('all'); setIsProvinceFilterOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedProvince === prov ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                      )}
                                  >
                                      {prov}
                                  </button>
                                 ))}
                             </div>
                        </PopoverContent>
                    </Popover>

                    {/* Hospital Filter */}
                    <Popover open={isHospitalFilterOpen} onOpenChange={setIsHospitalFilterOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative flex-1 min-w-0 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-[0.98]">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                     <Building2 size={18} />
                                 </div>
                                 <span className="pl-7 pr-6 text-[14px] font-medium text-[#37286A] truncate">
                                     {selectedHospital === 'all' ? 'ทุกโรงพยาบาล' : selectedHospital}
                                 </span>
                                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none">
                                     <ChevronDown size={18} />
                                 </div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[280px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                             <div className="flex flex-col">
                                 <button
                                      onClick={() => { setSelectedHospital('all'); setIsHospitalFilterOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedHospital === 'all' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                      )}
                                  >
                                      ทุกโรงพยาบาล
                                  </button>
                                 {hospitalList.map(h => (
                                   <button
                                      key={h}
                                      onClick={() => { setSelectedHospital(h); setIsHospitalFilterOpen(false); }}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[14px] font-medium transition-colors rounded-lg",
                                          selectedHospital === h ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                      )}
                                  >
                                      {h}
                                  </button>
                                 ))}
                             </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            <CalendarView 
                scope={scope}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                allEvents={filteredEvents}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                today={today}
                isCalendarOpen={isCalendarOpen}
                setIsCalendarOpen={setIsCalendarOpen}
                setNewPatient={() => {}} // Placeholder
                setIsWalkInModalOpen={isSCFC ? () => {} : setIsWalkInModalOpen}
                setCurrentView={() => {}} // Placeholder
            />
            <DailyAppointmentList 
                scope={scope}
                setScope={setScope}
                allPatients={filteredEvents} 
                selectedDate={selectedDate}
                currentMonth={currentMonth}
                setNewPatient={() => {}}
                setEditingAppointment={() => {}} // Placeholder
                setIsWalkInModalOpen={setIsWalkInModalOpen}
                onDelete={() => {}}
                onEdit={(appt: any) => {
                    setSelectedAppointment(appt);
                    setIsWalkInModalOpen(true);
                }}
                onViewPatient={() => {}}
                onSelectAppointment={setConfirmModalData}
                onViewDetail={handleNavigate}
                onViewHomeVisit={handleNavigate}
                setCurrentView={() => {}}
                setSelectedDate={setSelectedDate}
                today={today}
                hiddenScopes={hiddenScopes}
                isCalendarOpen={isCalendarOpen}
            />
            
             {/* Form Modal - hidden for SCFC */}
             {isWalkInModalOpen && !isSCFC && (
                <AppointmentForm 
                    onClose={() => {
                        setIsWalkInModalOpen(false);
                        setSelectedAppointment(null);
                    }}
                    onSubmit={(data: any) => {
                        const targetPatient = patients.find((p: any) => String(p.id) === String(data.patientId));
                        
                        if (targetPatient && onUpdatePatient) {
                            const rawDate = `${data.date}T${data.startTime}:00`;
                            
                            const newAppt = {
                                rawDate: rawDate,
                                time: data.time, // Save formatted time range
                                title: data.treatment || 'นัดหมาย',
                                location: data.location,
                                doctor: data.doctor,
                                status: 'waiting',
                                note: data.reason,
                                room: data.selectedRoom || data.room, // Prioritize explicit field
                                roomName: data.selectedRoom || data.room, // Prioritize explicit field
                                department: data.selectedRoom || data.room // Prioritize explicit field
                            };

                            let updatedHistory = [...(targetPatient.appointmentHistory || [])];

                            if (selectedAppointment) {
                                // Edit Mode: Filter out the old appointment
                                updatedHistory = updatedHistory.filter((a: any) => a.rawDate !== selectedAppointment.rawDate);
                            }

                            updatedHistory.push(newAppt);

                            const updatedPatient = {
                                ...targetPatient,
                                appointmentHistory: updatedHistory
                            };

                            onUpdatePatient(updatedPatient);
                            setRefreshTrigger(prev => prev + 1); // Force refresh
                            toast.success(selectedAppointment ? "แก้ไขนัดหมายเรียบร้อย" : "สร้างนัดหมายเรียบร้อย");
                        } else {
                            toast.error("เกิดข้อผิดพลาด: ไม่พบข้อมูลผู้ป่วย");
                        }

                        setIsWalkInModalOpen(false);
                        setSelectedAppointment(null);
                    }}
                    initialDate={selectedDate || undefined}
                    initialPatient={selectedAppointment}
                    isEditMode={!!selectedAppointment}
                />
            )}

            {isTeleFormOpen && selectedTelemedAppointment && (
                <TeleForm 
                    data={selectedTelemedAppointment}
                    onBack={() => {
                        setIsTeleFormOpen(false);
                        setSelectedTelemedAppointment(null);
                    }}
                    onViewHistory={() => {
                        if (onNavigateToSystem) {
                            onNavigateToSystem('patient-detail', {
                                ...selectedTelemedAppointment,
                                returnTo: 'appointments'
                            });
                            setIsTeleFormOpen(false);
                        }
                    }}
                />
            )}

            {isHomeVisitDetailOpen && selectedHomeVisitAppointment && (
                <VisitDetail 
                    visit={selectedHomeVisitAppointment}
                    onBack={() => {
                        setIsHomeVisitDetailOpen(false);
                        setSelectedHomeVisitAppointment(null);
                    }}
                    showFooter={true}
                    onViewHistory={() => {
                        if (onNavigateToSystem) {
                            onNavigateToSystem('patient-detail', {
                                ...selectedHomeVisitAppointment,
                                returnTo: 'appointments'
                            });
                            setIsHomeVisitDetailOpen(false);
                        }
                    }}
                    onContactPCU={() => {
                        toast.success("ติดต่อ รพ.สต. แล้ว");
                    }}
                />
            )}

            {/* Referral Detail Overlay */}
            {isReferralDetailOpen && selectedReferralData && (
                <ReferralDetail 
                    referral={selectedReferralData}
                    onBack={() => {
                        setIsReferralDetailOpen(false);
                        setSelectedReferralData(null);
                    }}
                    initialHN={selectedReferralData.patientHn}
                    onExit={() => {
                         setIsReferralDetailOpen(false);
                         setSelectedReferralData(null);
                    }}
                    onAccept={(id: any, date: any, details: any) => {
                        // Update Global Data
                        const targetId = id || selectedReferralData.id;
                        const refIndex = REFERRAL_DATA.findIndex(r => r.id === targetId || String(r.id) === String(targetId));
                        
                        if (refIndex !== -1) {
                             REFERRAL_DATA[refIndex].status = 'Accepted';
                             // Update Accepted Date with Time
                             if (date) {
                                 // Create Local ISO String to preserve selected time
                                 const tzOffset = date.getTimezoneOffset() * 60000;
                                 const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, -1);
                                 REFERRAL_DATA[refIndex].acceptedDate = localISOTime;
                                 
                                 // Also update standard date fields for compatibility
                                 REFERRAL_DATA[refIndex].date = localISOTime; 
                             }
                        }

                        setRefreshTrigger(prev => prev + 1);
                        setIsReferralDetailOpen(false);
                        setSelectedReferralData(null);
                        toast.success("ยอมรับการส่งตัวเรียบร้อยแล้ว");
                    }}
                    onReject={() => {
                        setIsReferralDetailOpen(false);
                        toast.error("ปฏิเสธคำขอส่งตัวเรียบร้อยแล้ว");
                    }}
                />
            )}

            {isAppointmentDetailOpen && selectedAppointment && (
                 <StandardPageLayout title="รายละเอียดนัดหมาย" onBack={() => setIsAppointmentDetailOpen(false)} bypassContentCard={true}>
                     <div />
                 </StandardPageLayout>
            )}
            {isAppointmentDetailOpen && selectedAppointment && (
                 <AppointmentDetail 
                     appointment={selectedAppointment}
                     patient={patients.find(p => String(p.id) === String(selectedAppointment.patientId)) || selectedAppointment}
                     onBack={() => setIsAppointmentDetailOpen(false)}
                     onReschedule={() => {
                        setIsAppointmentDetailOpen(false);
                        setIsWalkInModalOpen(true);
                     }}
                     onCancel={() => {
                        const targetPatient = patients.find((p: any) => String(p.id) === String(selectedAppointment.patientId));
                        if (targetPatient && onUpdatePatient) {
                             const updatedPatient = { ...targetPatient };
                             if (updatedPatient.appointmentHistory) {
                                 updatedPatient.appointmentHistory = updatedPatient.appointmentHistory.filter((a: any) => a.rawDate !== selectedAppointment.rawDate);
                             }
                             if (updatedPatient.appointments) {
                                 updatedPatient.appointments = updatedPatient.appointments.filter((a: any) => a.date_time !== selectedAppointment.rawDate);
                             }
                             onUpdatePatient(updatedPatient);
                             setRefreshTrigger(prev => prev + 1);
                             toast.success("ลบนัดหมายเรียบร้อยแล้ว");
                             setIsAppointmentDetailOpen(false);
                        }
                     }}
                 />
            )}

            {isVisitViewOpen && selectedHomeVisitAppointment && (
                 <VisitDetail 
                     visit={selectedHomeVisitAppointment}
                     patient={patients.find(p => String(p.id) === String(selectedHomeVisitAppointment.patientId)) || selectedHomeVisitAppointment}
                     onBack={() => setIsVisitViewOpen(false)}
                 />
            )}

            {isTeleViewOpen && selectedTelemedAppointment && (
                 <TeleConsultDetail 
                     consult={selectedTelemedAppointment}
                     patient={patients.find(p => String(p.id) === String(selectedTelemedAppointment.patientId)) || selectedTelemedAppointment}
                     onBack={() => setIsTeleViewOpen(false)}
                 />
            )}

            {isReferralViewOpen && selectedReferralData && (
                 <ReferralDetailView 
                     referral={selectedReferralData}
                     patient={patients.find(p => String(p.id) === String(selectedReferralData.patientId)) || selectedReferralData}
                     onBack={() => setIsReferralViewOpen(false)}
                 />
            )}

            <ConfirmModal 
                isOpen={!!confirmModalData} 
                onClose={() => setConfirmModalData(null)} 
                appointment={confirmModalData}
                role={currentRole}
                onViewDetail={() => {
                    if (!confirmModalData) return;
                    const type = confirmModalData.type;
                    
                    if (['Home Visit', 'Joint Visit', 'Routine', 'Joint', 'Delegated', 'ฝากเยี่ยม', 'เยี่ยมร่วม'].includes(type)) {
                         setSelectedHomeVisitAppointment(confirmModalData);
                         setIsVisitViewOpen(true);
                    } else if (['Referred', 'Refer In', 'Refer Out', 'รับตัว'].includes(type)) {
                         setSelectedReferralData(confirmModalData);
                         setIsReferralViewOpen(true);
                    } else if (type === 'Telemed') {
                         setSelectedTelemedAppointment(confirmModalData);
                         setIsTeleViewOpen(true);
                    } else {
                         setSelectedAppointment(confirmModalData);
                         setIsAppointmentDetailOpen(true);
                    }
                    setConfirmModalData(null); 
                }}
                onConfirm={() => {
                     // SCFC cannot perform confirm actions
                     if (isSCFC) { setConfirmModalData(null); return; }
                     if (confirmModalData && onUpdatePatient) {
                         const patientId = confirmModalData.patientId;
                         // Find the real patient object from the source list
                         const originalPatient = patients?.find((p: any) => String(p.id) === String(patientId));
                         
                         if (originalPatient) {
                             const updatedPatient = { ...originalPatient };
                             const rawDate = confirmModalData.rawDate;
                             const scope = confirmModalData.scope;
                             const currentStatus = confirmModalData.status?.toLowerCase();

                             // Helper to normalize status for UI consistency
                             const updateHistoryStatus = (history: any[], targetRawDate: string, newStatus: string) => {
                                return history.map((item: any) => {
                                   if (item.rawDate === targetRawDate) {
                                       return { ...item, status: newStatus };
                                   }
                                   return item;
                                });
                             };

                             // Update Logic based on Scope
                             if (scope === 'telemed') {
                                 const nextStatus = ['waiting', 'pending'].includes(currentStatus) ? 'in_progress' : 'completed';
                                 updatedPatient.teleConsultHistory = updateHistoryStatus(updatedPatient.teleConsultHistory || [], rawDate, nextStatus === 'in_progress' ? 'inprogress' : 'completed');
                                 
                                 if (nextStatus === 'in_progress') toast.success("เข้าร่วมการประชุมแล้ว");
                                 else toast.success("การประชุมเสร็จสิ้น");
                                 
                             } else if (scope === 'homevisit') {
                                 // Update Global HOME_VISIT_DATA directly
                                 const visitIndex = HOME_VISIT_DATA.findIndex(v => v.id === confirmModalData.id);

                                 if (['waitvisit', 'wait_visit', 'pending', 'waiting', 'confirmed', 'accepted'].includes(currentStatus)) {
                                     if (visitIndex !== -1) {
                                         HOME_VISIT_DATA[visitIndex].status = 'InProgress';
                                     }
                                     updatedPatient.visitHistory = updateHistoryStatus(updatedPatient.visitHistory || [], rawDate, 'in_progress');
                                     toast.success("เริ่มการเยี่ยมบ้าน (สถานะ: ดำเนินการ)");
                                     setRefreshTrigger(prev => prev + 1);
                                 } else if (['inprogress', 'in_progress'].includes(currentStatus)) {
                                     if (visitIndex !== -1) {
                                         HOME_VISIT_DATA[visitIndex].status = 'Completed';
                                     }
                                     updatedPatient.visitHistory = updateHistoryStatus(updatedPatient.visitHistory || [], rawDate, 'completed');
                                     toast.success("บันทึกการเยี่ยมเสร็จสิ้น");
                                     setRefreshTrigger(prev => prev + 1);
                                 }

                             } else if (scope === 'refer') {
                                 // Referral confirmation logic
                                 if (['pending', 'referred'].includes(currentStatus)) {
                                      updatedPatient.referralHistory = updateHistoryStatus(updatedPatient.referralHistory || [], rawDate, 'Accepted');
                                      toast.success("ตอบรับการส่งตัวแล้ว");
                                 } else if (['accepted', 'confirmed'].includes(currentStatus)) {
                                      // Step 2: Accepted -> Received (Waiting for Doctor)
                                      updatedPatient.referralHistory = updateHistoryStatus(updatedPatient.referralHistory || [], rawDate, 'Received');
                                      
                                      // Also update global REFERRAL_DATA for consistency
                                      const refIndex = REFERRAL_DATA.findIndex(r => r.id === confirmModalData.id || `ref-${r.id}` === confirmModalData.id);
                                      if (refIndex !== -1) {
                                          REFERRAL_DATA[refIndex].status = 'Received';
                                      }
                                      
                                      toast.success("ยืนยันรับตัวผู้ป่วยแล้ว (รอตรวจ)");
                                 }

                             } else {
                                 // Default Appointment
                                 // Update specific history item
                                 if (updatedPatient.appointmentHistory) {
                                     updatedPatient.appointmentHistory = updateHistoryStatus(updatedPatient.appointmentHistory, rawDate, 'confirmed');
                                 }
                                 
                                 // ALSO Update top-level status if this is the MAIN appointment
                                 // Check if the dates match or if it's the "nextAppointment"
                                 // Simplified: Always update top level status if we are confirming a normal appointment
                                 updatedPatient.status = 'confirmed';
                                 if (updatedPatient.appointments) {
                                     updatedPatient.appointments = updatedPatient.appointments.map((a: any) => {
                                         if (a.date_time === rawDate) return { ...a, status: 'ยืนยันแล้ว' };
                                         return a;
                                     });
                                 }
                                 
                                 toast.success("ยืนยันการนัดหมายเรียบร้อยแล้ว");
                             }

                             // Send the full patient object back to parent
                             onUpdatePatient(updatedPatient);
                         } else {
                             // Fallback for standalone usage or missing patientId
                             console.warn("Could not find original patient to update. Falling back to shallow update.");
                             onUpdatePatient({ ...confirmModalData, status: 'confirmed' });
                         }
                     }
                     setConfirmModalData(null);
                }}
                onOpenVisitForm={() => {
                    if (onNavigateToSystem && confirmModalData) {
                         onNavigateToSystem('home-visit-form', confirmModalData);
                         setConfirmModalData(null);
                    }
                }}
                onRecordTreatment={() => {
                     if (onNavigateToSystem && confirmModalData) {
                         // Pass returnTo logic if supported by system, or just data
                         onNavigateToSystem('add-medical-record', { 
                             ...confirmModalData,
                             returnTo: 'appointments', // Hint for navigation
                             referralId: confirmModalData.id // Pass ID to update status later
                         });
                         setConfirmModalData(null);
                     }
                }}
                onReschedule={() => {
                     console.log('Reschedule');
                     setConfirmModalData(null);
                }}
                onRequestRefer={() => {
                     if (onNavigateToSystem && confirmModalData) {
                         onNavigateToSystem('referrals', { hn: confirmModalData.hn });
                         setConfirmModalData(null);
                     }
                }}
                onViewHistory={() => {
                     if (onNavigateToSystem && confirmModalData) {
                         onNavigateToSystem('patient-detail', {
                             ...confirmModalData,
                             returnTo: 'appointments'
                         });
                         setConfirmModalData(null);
                     }
                }}
            />
        </div>
    );
}
