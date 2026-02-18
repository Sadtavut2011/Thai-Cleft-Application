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
  Building2
} from 'lucide-react';
import Filter from '../../../../components/shared/Filter';
import { Button } from '../../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { PATIENTS_DATA, REFERRAL_DATA, HOME_VISIT_DATA, TELEMED_DATA } from '../../../../data/patientData';
import AppointmentForm from './forms/AppointmentForm';
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
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
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
        if (scope === 'appointment') {
            const type = p.type || '';
            matchesScope = !['Refer In', 'Refer Out', 'Home Visit', 'Joint Visit', 'Telemed', 'Routine'].includes(type);
        } else if (scope === 'refer') {
            matchesScope = p.type === 'Refer In' || p.type === 'Refer Out';
        } else if (scope === 'homevisit') {
            matchesScope = p.type === 'Home Visit' || p.type === 'Joint Visit' || p.type === 'Routine';
        } else if (scope === 'telemed') {
            matchesScope = p.type === 'Telemed';
        } else {
            matchesScope = true;
        }

        if (p.date && matchesScope) {
            map.set(p.date, (map.get(p.date) || 0) + 1);
        }
      });
      return map;
    }, [allEvents, scope]);
    
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
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!selectedDate ? 'bg-white shadow text-slate-700' : 'text-slate-500'}`}
                >
                  ทั้งหมด
                </button>
                <button 
                  onClick={() => setSelectedDate(formatDate(today))} 
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${selectedDate === formatDate(today) ? 'bg-white shadow text-slate-700' : 'text-slate-500'}`}
                >
                  วันนี้
                </button>
             </div>
          </div>
          <div className="flex items-center gap-2">
             {scope === 'appointment' && (
               <button 
                  onClick={() => setIsWalkInModalOpen(true)}
                  className={`fixed bottom-[90px] right-4 w-14 h-14 text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-50 ${getThemeColor()} hover:opacity-90`}
               >
                  <Plus size={28} />
               </button>
             )}
             <button 
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="p-1 text-slate-500 hover:bg-slate-200 rounded-full transition-all"
            >
              {isCalendarOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : (isToday ? getThemeTextTodayColor() : 'text-slate-800')}`}>
                    {day.getDate()}
                  </span>
                  {appointmentCount > 0 && (
                    <span className={`text-[9px] font-medium mt-0.5 px-1.5 py-0.5 rounded-full 
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
    onViewHomeVisit
}: any) => {
    const [statusFilter, setStatusFilter] = useState('all');

    const appointmentsOnSelectedDate = allPatients
      .filter((p: any) => {
        // Status Filter
        if (statusFilter !== 'all') {
            const status = (p.status || '').toLowerCase();
            const filter = statusFilter.toLowerCase();

            if (filter === 'waiting') {
                if (!['pending', 'waiting-doctor', 'waiting_staff', 'waiting'].includes(status)) return false;
            } else if (filter === 'confirmed') {
                if (!['checked-in', 'referred', 'confirmed', 'accepted'].includes(status)) return false;
            } else if (filter === 'completed') {
                if (!['completed', 'treated'].includes(status)) return false;
            } else {
                if (status !== filter) return false;
            }
        }

        if (ignoreDateFilter) return true;
        if (!selectedDate) {
             if (!currentMonth) return true;
             if (!p.date) return true;
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
             return !['Refer In', 'Refer Out', 'Home Visit', 'Joint Visit', 'Telemed', 'Routine'].includes(type);
          }
          if (scope === 'refer') return p.type === 'Refer In' || p.type === 'Refer Out';
          if (scope === 'homevisit') return p.type === 'Home Visit' || p.type === 'Joint Visit' || p.type === 'Routine';
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
                <button 
                  onClick={() => setScope('appointment')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${scope === 'appointment' ? 'bg-white shadow text-blue-500' : 'text-slate-500'}`}
                >
                  นัดหมาย
                </button>
                <button 
                  onClick={() => setScope('telemed')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${scope === 'telemed' ? 'bg-white shadow text-pink-500' : 'text-slate-500'}`}
                >
                  Tele-med
                </button>
             </div>
        </div>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {ignoreDateFilter ? 'รายชื่อผู้ป่วยขาดนัด (ทั้งหมด)' : `: ${displayDate}`}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">รวม: {appointmentsOnSelectedDate.length}</span>
            <div className="w-[32px] h-[32px] relative cursor-pointer hover:opacity-90">
                <Filter onFilterSelect={setStatusFilter} scope={scope} />
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
                  <th className="p-2 font-medium whitespace-nowrap w-[60px]">เวลา</th>
                  <th className="p-2 font-medium">HN / ชื่อ-สกุล</th>
                  <th className="p-2 font-medium text-center md:text-right w-[120px]">สถานะ</th>
                  <th className="p-2 font-medium text-center whitespace-nowrap">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointmentsOnSelectedDate.map((patient: any) => (
                  <tr 
                    key={patient.id} 
                    className="bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(patient)}
                  >
                    <td className="p-2 font-mono text-slate-600 text-xs md:text-sm align-top md:align-middle font-bold text-[#1f2937]">
                      <div className="text-sm md:text-base">{patient.time}</div>
                      <div className="text-[12px] text-slate-500 font-normal mt-0.5 whitespace-nowrap">{formatThaiShortDate(patient.date)}</div>
                    </td>
                    <td className="p-2 align-middle">
                      <div className="font-bold text-[#1f2937] text-sm md:text-[16px] leading-tight line-clamp-1 md:line-clamp-none">{formatPatientName(patient.name)}</div>
                      <div className="text-[12px] md:text-[14px] text-slate-500 font-medium flex flex-col gap-0.5 mt-1">
                         {scope === 'appointment' && (
                             <div className="flex flex-col">
                                <span className="text-slate-500">{patient.age}</span>
                                {patient.room && <span className="text-[rgb(47,128,237)] mt-0.5">ห้อง {patient.room}</span>}
                             </div>
                         )}
                         {scope === 'refer' && (
                             <div className="flex flex-col">
                                <span className="text-slate-500">{patient.age}</span>
                                <span className="text-green-600 text-xs mt-0.5">
                                   {patient.hospital}
                                </span>
                             </div>
                         )}
                         {scope === 'homevisit' && (
                             <div className="flex flex-col">
                                 <span className="text-slate-500">{patient.age}</span>
                                 <span className="text-[#7066a9] mt-0.5">
                                    {patient.rph || patient.hospital}
                                 </span>
                             </div>
                         )}
                         {scope === 'telemed' && (
                             <div className="flex flex-col">
                                 <span className="text-slate-500">{patient.age}</span>
                                 <span className={`flex items-center gap-1 mt-0.5 ${patient.channel === 'mobile' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                    {patient.channel === 'mobile' ? <Smartphone size={12} /> : <Building2 size={12} />}
                                    {patient.channel === 'mobile' ? 'Mobile' : 'Hospital'}
                                 </span>
                             </div>
                         )}
                      </div>
                    </td>
                    <td className="p-2 align-middle text-center md:text-right">
                       {(() => {
                          let status = patient.status?.toLowerCase() || '';
                          let colorClass = 'bg-slate-100 text-slate-600';
                          let label = status;

                          if (scope === 'appointment') {
                              if (['waiting', 'waiting-doctor', 'pending', 'waiting_staff'].includes(status)) { colorClass = 'bg-orange-100 text-orange-700'; label = 'รอตรวจ'; }
                              else if (['checked-in', 'confirmed', 'accepted'].includes(status)) { colorClass = 'bg-blue-100 text-blue-700'; label = 'ยืนยันแล้ว'; }
                              else if (['completed', 'treated'].includes(status)) { colorClass = 'bg-emerald-100 text-emerald-700'; label = 'เสร็จสิ้น'; }
                              else if (['missed', 'cancelled', 'rejected'].includes(status)) { colorClass = 'bg-red-100 text-red-700'; label = 'ยกเลิก'; }
                          } else if (scope === 'refer') {
                              if (['pending', 'referred'].includes(status)) { colorClass = 'bg-orange-100 text-orange-700'; label = 'รอรับตัว'; }
                              else if (['accepted', 'confirmed'].includes(status)) { colorClass = 'bg-blue-100 text-blue-700'; label = 'รอตรวจ'; }
                              else if (['completed', 'treated'].includes(status)) { colorClass = 'bg-emerald-100 text-emerald-700'; label = 'ตรวจแล้ว'; }
                              else if (status === 'rejected') { colorClass = 'bg-red-100 text-red-700'; label = 'ปฏิเสธ'; }
                              else { label = status; }
                          } else if (scope === 'homevisit') {
                              if (['pending', 'waiting', 'confirmed', 'accepted'].includes(status)) { colorClass = 'bg-yellow-100 text-yellow-700'; label = 'รอเยี่ยม'; }
                              else if (['inprogress', 'in_progress'].includes(status)) { colorClass = 'bg-blue-100 text-blue-700'; label = 'กำลังเยี่ยม'; }
                              else if (status === 'completed') { colorClass = 'bg-emerald-100 text-emerald-700'; label = 'เสร็จสิ้น'; }
                          } else if (scope === 'telemed') {
                              if (['waiting', 'pending'].includes(status)) { colorClass = 'bg-orange-100 text-orange-700'; label = 'รอสาย'; }
                              else if (['inprogress', 'in_progress'].includes(status)) { colorClass = 'bg-blue-100 text-blue-700'; label = 'ดำเนินการ'; }
                              else if (status === 'completed') { colorClass = 'bg-emerald-100 text-emerald-700'; label = 'เสร็จสิ้น'; }
                              else if (['cancelled', 'missed'].includes(status)) { colorClass = 'bg-red-100 text-red-700'; label = 'ยกเลิก'; }
                          }
                          
                          return (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap ${colorClass}`}>
                                <span className="w-2 h-2 rounded-full bg-current opacity-75"></span>
                                <span>{label}</span>
                              </span>
                          );
                       })()}
                    </td>
                    <td className="p-2 align-middle text-center" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          className="h-12 w-12 p-0 hover:bg-slate-100 rounded-full"
                          onClick={(e) => {
                             e.stopPropagation();
                             if (scope === 'refer') {
                                 onViewDetail?.(patient);
                             } else if (scope === 'homevisit') {
                                 if(onViewHomeVisit) onViewHomeVisit(patient);
                             } else if (scope === 'telemed') {
                                 if(onViewDetail) onViewDetail(patient);
                             } else {
                                 if (setEditingAppointment) setEditingAppointment(patient);
                                 setCurrentView('appointment-f2');
                             }
                          }}
                        >
                           <span className="sr-only">View Detail</span>
                           <FileText className="h-7 w-7 text-slate-500" />
                        </Button>
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
    onUpdatePatient
}: any) {
    // State
    const { currentRole } = useRole();
    const today = useMemo(() => new Date(2025, 11, 4), []);
    const [selectedDate, setSelectedDate] = useState<string | null>('2025-12-04');
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1));
    const [isCalendarOpen, setIsCalendarOpen] = useState(true);
    const [scope, setScope] = useState('appointment');
    const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
    const [confirmModalData, setConfirmModalData] = useState<any>(null);
    
    // Combine all mock data
    const allEvents = useMemo(() => {
        const basePatients = patients || PATIENTS_DATA;
        const staticData = [...REFERRAL_DATA, ...HOME_VISIT_DATA, ...TELEMED_DATA];

        // Filter out static data items that are already in basePatients (by ID)
        const uniqueStatic = staticData.filter(staticItem => 
            !basePatients.some((p: any) => String(p.id) === String(staticItem.id))
        );

        return [...basePatients, ...uniqueStatic];
    }, [patients]);

    const handleNavigate = (patient: any) => {
        if (!onNavigateToSystem) {
             console.log("No navigation handler provided", patient);
             return;
        }

        if (scope === 'telemed') {
             onNavigateToSystem('telemed-system', patient);
        } else if (scope === 'homevisit') {
             onNavigateToSystem('home-visit-detail', patient);
        } else if (scope === 'refer') {
             onNavigateToSystem('referrals', { hn: patient.hn });
        } else {
             // Default Appointment view? 
             // Currently no specific system for appointment details other than modal edit
        }
    };



    return (
        <div className="flex flex-col h-full bg-slate-50">
            <CalendarView 
                scope={scope}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                allEvents={allEvents}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                today={today}
                isCalendarOpen={isCalendarOpen}
                setIsCalendarOpen={setIsCalendarOpen}
                setNewPatient={() => {}} // Placeholder
                setIsWalkInModalOpen={setIsWalkInModalOpen}
                setCurrentView={() => {}} // Placeholder
            />
            <DailyAppointmentList 
                scope={scope}
                setScope={setScope}
                allPatients={allEvents} 
                selectedDate={selectedDate}
                currentMonth={currentMonth}
                setNewPatient={() => {}}
                setEditingAppointment={() => {}} // Placeholder
                setIsWalkInModalOpen={setIsWalkInModalOpen}
                onDelete={() => {}}
                onEdit={() => {}}
                onViewPatient={() => {}}
                onSelectAppointment={setConfirmModalData}
                onViewDetail={handleNavigate}
                onViewHomeVisit={handleNavigate}
                setCurrentView={() => {}}
                setSelectedDate={setSelectedDate}
                today={today}
            />
            
             {/* Form Modal */}
             {isWalkInModalOpen && (
                <AppointmentForm 
                    onClose={() => setIsWalkInModalOpen(false)}
                    onSubmit={(data) => {
                        console.log('New Appointment:', data);
                        setIsWalkInModalOpen(false);
                        // In a real app, you'd add this to state
                    }}
                    initialDate={selectedDate || undefined}
                />
            )}

            <ConfirmModal 
                isOpen={!!confirmModalData} 
                onClose={() => setConfirmModalData(null)} 
                appointment={confirmModalData}
                role={currentRole}
                onConfirm={() => {
                     if (confirmModalData && onUpdatePatient) {
                         const status = confirmModalData.status?.toLowerCase();
                         const type = confirmModalData.type;
                         
                         if (type === 'Telemed') {
                             if (['waiting', 'pending'].includes(status)) {
                                 onUpdatePatient({ ...confirmModalData, status: 'in_progress' });
                                 toast.success("เข้าร่วมการประชุมแล้ว");
                             } else if (['inprogress', 'in_progress'].includes(status)) {
                                 onUpdatePatient({ ...confirmModalData, status: 'completed' });
                                 toast.success("การประชุมเสร็จสิ้น");
                             }
                         } else {
                             onUpdatePatient({ ...confirmModalData, status: 'confirmed' });
                             toast.success("ยืนยันนัดหมายแล้ว");
                         }
                     }
                     setConfirmModalData(null);
                }}
                onRecordTreatment={() => {
                     if (onNavigateToSystem && confirmModalData) {
                         onNavigateToSystem('add-medical-record', { 
                             ...confirmModalData,
                             returnTo: 'appointments'
                         });
                         setConfirmModalData(null);
                     }
                }}
                onReschedule={() => {
                     setConfirmModalData(null);
                     toast.info("ฟีเจอร์เลื่อนนัดหมายกำลังพัฒนา");
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
                onContactPatient={() => {
                    toast.info("กำลังติดต่อผู้ป่วย...");
                    setConfirmModalData(null);
                }}
                onOpenVisitForm={() => {
                    if (onNavigateToSystem && confirmModalData) {
                         onNavigateToSystem('home-visit-form', confirmModalData);
                         setConfirmModalData(null);
                    }
                }}
            />
        </div>
    );
}
