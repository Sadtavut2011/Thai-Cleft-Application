import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
    Clock, 
    MapPin, 
    User, 
    Home, 
    CalendarPlus, 
    Send, 
    Video, 
    ChevronLeft, 
    FileText, 
    CheckCircle,
    Smartphone,
    Building2
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { HomeVisitForm } from '../../home-visit/forms/HomeVisitForm';
import { REFERRAL_DATA, HOME_VISIT_DATA } from '../../../../../data/patientData';
import { toast } from 'sonner';

interface PatientHistoryTabProps {
    patient: any;
    activeHistoryTab: string;
    setActiveHistoryTab: (tab: string) => void;
    expandedHistoryIndex: number | null;
    setExpandedHistoryIndex: (index: number | null) => void;
    onViewTreatmentDetail?: (treatment: any) => void;
    onViewVisitDetail?: (visit: any) => void;
    onViewAppointmentDetail?: (appointment: any) => void;
    onViewReferralDetail?: (referral: any) => void;
    onViewTeleConsultDetail?: (consult: any) => void;
    readOnly?: boolean;
}

export const PatientHistoryTab: React.FC<PatientHistoryTabProps> = ({
    patient,
    activeHistoryTab,
    setActiveHistoryTab,
    expandedHistoryIndex,
    setExpandedHistoryIndex,
    onViewTreatmentDetail,
    onViewVisitDetail,
    onViewAppointmentDetail,
    onViewReferralDetail,
    onViewTeleConsultDetail,
    readOnly = false
}) => {
    const [isHomeVisitFormOpen, setIsHomeVisitFormOpen] = useState(false);

    // Helper to map status to color/label (Standard Appointment)
    const getStatusConfig = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'waiting':
                return { color: 'bg-orange-100 text-orange-700', ring: 'bg-orange-500 ring-orange-100', border: 'bg-orange-50 border-orange-100 shadow-sm hover:border-orange-300', text: 'text-orange-900', label: 'รอตรวจ' };
            case 'confirmed':
            case 'checked-in':
            case 'accepted':
                return { color: 'bg-blue-100 text-blue-700', ring: 'bg-blue-500 ring-blue-100', border: 'bg-blue-50 border-blue-100 shadow-sm hover:border-blue-300', text: 'text-blue-900', label: 'ยืนยันแล้ว' };
            case 'cancelled':
            case 'missed':
            case 'rejected':
                return { color: 'bg-red-100 text-red-700', ring: 'bg-red-500 ring-red-100', border: 'bg-red-50 border-red-100 hover:border-red-300', text: 'text-red-900', label: 'ยกเลิก' };
            default: // completed
                return { color: 'bg-green-100 text-green-700', ring: 'bg-green-500 ring-green-100', border: 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-300', text: 'text-slate-800', label: 'เสร็จสิ้น' };
        }
    };

    const getReferralStatusConfig = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'pending':
            case 'referred':
                return { color: 'bg-yellow-100 text-yellow-700', ring: 'bg-yellow-500 ring-yellow-100', border: 'bg-yellow-50 border-yellow-100 shadow-sm hover:border-yellow-300', text: 'text-yellow-900', label: 'รอการตอบรับ' };
            case 'accepted':
            case 'confirmed':
                return { color: 'bg-orange-100 text-orange-700', ring: 'bg-orange-500 ring-orange-100', border: 'bg-orange-50 border-orange-100 shadow-sm hover:border-orange-300', text: 'text-orange-900', label: 'รอรับตัว' };
            case 'received':
            case 'waiting_doctor':
                return { color: 'bg-blue-100 text-blue-700', ring: 'bg-blue-500 ring-blue-100', border: 'bg-blue-50 border-blue-100 shadow-sm hover:border-blue-300', text: 'text-blue-900', label: 'รอตรวจ' };
            case 'completed':
            case 'treated':
                return { color: 'bg-green-100 text-green-700', ring: 'bg-green-500 ring-green-100', border: 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-300', text: 'text-slate-800', label: 'ตรวจแล้ว' };
            case 'rejected':
                return { color: 'bg-red-100 text-red-700', ring: 'bg-red-500 ring-red-100', border: 'bg-red-50 border-red-100 hover:border-red-300', text: 'text-red-900', label: 'ปฏิเสธ' };
            default:
                return { color: 'bg-slate-100 text-slate-700', ring: 'bg-slate-500 ring-slate-100', border: 'bg-slate-50 border-slate-100', text: 'text-slate-800', label: status };
        }
    };

    const getVisitStatusConfig = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'pending':
                return { color: 'bg-[#fff0e1] text-[#ff9f43]', ring: 'bg-[#ff9f43] ring-[#fff0e1]', border: 'bg-[#fff0e1] border-[#ff9f43] shadow-sm hover:border-orange-300', text: 'text-[#ff9f43]', label: 'รอตอบรับ' };
            case 'accepted':
                return { color: 'bg-purple-100 text-purple-700', ring: 'bg-purple-500 ring-purple-100', border: 'bg-purple-50 border-purple-100 shadow-sm hover:border-purple-300', text: 'text-purple-900', label: 'รับงาน' };
            case 'waitvisit':
            case 'wait_visit':
                return { color: 'bg-yellow-100 text-yellow-700', ring: 'bg-yellow-500 ring-yellow-100', border: 'bg-yellow-50 border-yellow-100 shadow-sm hover:border-yellow-300', text: 'text-yellow-900', label: 'รอเยี่ยม' };
            case 'inprogress':
            case 'in_progress':
                return { color: 'bg-blue-100 text-blue-700', ring: 'bg-blue-500 ring-blue-100', border: 'bg-blue-50 border-blue-100 shadow-sm hover:border-blue-300', text: 'text-blue-900', label: 'ดำเนินการ' };
            case 'completed':
                return { color: 'bg-[#E5F8ED] text-[#28C76F]', ring: 'bg-[#28C76F] ring-[#E5F8ED]', border: 'bg-[#E5F8ED] border-[#28C76F] shadow-sm hover:border-green-300', text: 'text-[#28C76F]', label: 'เสร็จสิ้น' };
            case 'rejected':
                return { color: 'bg-[#FCEAEA] text-[#EA5455]', ring: 'bg-[#EA5455] ring-[#FCEAEA]', border: 'bg-[#FCEAEA] border-[#EA5455] shadow-sm hover:border-red-300', text: 'text-[#EA5455]', label: 'ปฏิเสธ' };
            case 'nothome':
                return { color: 'bg-[#FCEAEA] text-[#EA5455]', ring: 'bg-[#EA5455] ring-[#FCEAEA]', border: 'bg-[#FCEAEA] border-[#EA5455] shadow-sm hover:border-red-300', text: 'text-[#EA5455]', label: 'ไม่อยู่' };
            case 'notallowed':
                return { color: 'bg-[#F8F8F8] text-[#B9B9C3]', ring: 'bg-[#B9B9C3] ring-[#F8F8F8]', border: 'bg-[#F8F8F8] border-[#B9B9C3] shadow-sm hover:border-gray-300', text: 'text-[#B9B9C3]', label: 'ไม่อนุญาต' };
            default:
                return { color: 'bg-slate-100 text-slate-700', ring: 'bg-slate-500 ring-slate-100', border: 'bg-slate-50 border-slate-100', text: 'text-slate-800', label: status };
        }
    };

    const getTelemedStatusConfig = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'waiting':
            case 'pending':
                return { color: 'bg-orange-100 text-orange-700', ring: 'bg-orange-500 ring-orange-100', border: 'bg-orange-50 border-orange-100 shadow-sm hover:border-orange-300', text: 'text-orange-900', label: 'รอสาย' };
            case 'inprogress':
            case 'in_progress':
                return { color: 'bg-blue-100 text-blue-700', ring: 'bg-blue-500 ring-blue-100', border: 'bg-blue-50 border-blue-100 shadow-sm hover:border-blue-300', text: 'text-blue-900', label: 'ดำเนินการ' };
            case 'completed':
                return { color: 'bg-green-100 text-green-700', ring: 'bg-green-500 ring-green-100', border: 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-300', text: 'text-slate-800', label: 'เสร็จสิ้น' };
            case 'cancelled':
            case 'missed':
                 return { color: 'bg-red-100 text-red-700', ring: 'bg-red-500 ring-red-100', border: 'bg-red-50 border-red-100 hover:border-red-300', text: 'text-red-900', label: 'ยกเลิก' };
            default:
                return { color: 'bg-slate-100 text-slate-700', ring: 'bg-slate-500 ring-slate-100', border: 'bg-slate-50 border-slate-100', text: 'text-slate-800', label: status };
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
            {/* History Sub-Menu Pills */}
            <div className="grid grid-cols-3 gap-3 pb-6">
                {[
                    { id: 'treatment', label: 'การรักษา' },
                    { id: 'visit', label: 'การเยี่ยม' },
                    { id: 'appointment', label: 'การนัดหมาย' },
                    { id: 'referral', label: 'การส่งตัว' },
                    { id: 'teleconsult', label: 'Tele-med' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveHistoryTab(tab.id)}
                        className={cn(
                            "w-full px-2 py-2.5 rounded-full text-[16px] font-medium transition-all duration-200 border whitespace-nowrap flex justify-center items-center",
                            activeHistoryTab === tab.id 
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" 
                                : "bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:bg-blue-50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* History Tab Content */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 min-h-[500px]">
                    
                    {activeHistoryTab === 'treatment' && (
                    <div className="animate-in fade-in duration-300">
                            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[20px]">
                            <Clock className="text-blue-500" /> ประวัติการรักษาทั้งหมด
                            </h3>
                            
                            {patient.history && patient.history.length > 0 ? (
                            <div className="relative pl-2 ml-2">
                                {patient.history && [...patient.history].sort((a: any, b: any) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()).map((h: any, idx: number) => {
                                    const isExpanded = expandedHistoryIndex === idx;
                                    const config = getStatusConfig(h.status);
                                    return (
                                    <div key={idx} className="relative pl-8 pb-8 last:pb-0">
                                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${config.ring}`}></div>
                                        {idx !== patient.history.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                        
                                        <div 
                                            className={`bg-slate-50 p-4 rounded-xl border transition-all cursor-pointer ${config.border}`}
                                            onClick={() => onViewTreatmentDetail?.(h)}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[16px] font-bold text-slate-500">{h.date}</span>
                                                
                                            </div>
                                            <h5 className={`font-bold text-sm text-[16px] ${config.text}`}>{h.title}</h5>
                                            <div className="text-[14px] text-slate-500 mt-2 space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} /> ห้องตรวจ: {h.department}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User size={12} /> {h.doctor}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                            ) : (
                            <div className="text-center py-20 text-slate-400">
                                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                                <p>ไม่พบประวัติการรักษา</p>
                            </div>
                            )}
                    </div>
                    )}

                    {activeHistoryTab === 'visit' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="mb-6">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 text-[16px] mb-4">
                                <Home className="text-blue-500" /> ประวัติการเยี่ยม
                            </h3>
                            {!readOnly && (
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => setIsHomeVisitFormOpen(true)}
                                    className="bg-[#6a5acd] hover:bg-[#5a4db8] text-white font-['IBM_Plex_Sans_Thai'] px-3 py-1.5 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all active:scale-95 flex items-center gap-2 text-[16px]"
                                >
                                    เพิ่มข้อมูลเยี่ยมบ้าน
                                </button>
                            </div>
                            )}
                        </div>
                        <div className="relative pl-2 ml-2">
                            {/* Use global HOME_VISIT_DATA to ensure sync with PCU role */}
                            {HOME_VISIT_DATA.filter(v => v.hn === patient.hn || v.patientHn === patient.hn)
                                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((visit: any, index: number, arr: any[]) => {
                                const config = getVisitStatusConfig(visit.status);
                                // Map HOME_VISIT_DATA fields to display fields expected by this component
                                const displayVisit = {
                                    ...visit,
                                    dateFormatted: new Date(visit.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
                                    title: visit.detail || visit.note || 'เยี่ยมบ้าน',
                                    provider: visit.rph
                                };
                                
                                return (
                                <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${config.ring}`}></div>
                                    {index !== arr.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                    
                                    <div 
                                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 transition-all cursor-pointer hover:shadow-sm"
                                        onClick={() => onViewVisitDetail && onViewVisitDetail(displayVisit)}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500 text-[16px]">{displayVisit.dateFormatted}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <h5 className={`font-bold text-sm text-[16px] ${config.text}`}>
                                            {displayVisit.type === 'Delegated' ? 'ฝากเยี่ยม' : displayVisit.type === 'Joint' ? 'ลงเยี่ยมร่วม' : displayVisit.title}
                                        </h5>
                                        <div className="text-[14px] text-slate-500 mt-2 space-y-1">
                                            <div className="flex items-center gap-1">
                                                <User size={12} /> ผู้ให้บริการ: {displayVisit.provider}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                    )}

                    {activeHistoryTab === 'appointment' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[16px]">
                            <CalendarPlus className="text-blue-500" /> ประวัตินัดหมาย
                        </h3>
                        <div className="relative pl-2 ml-2">
                            {patient.appointmentHistory && [...patient.appointmentHistory].sort((a: any, b: any) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()).map((appt: any, index: number) => {
                                const config = getStatusConfig(appt.status);
                                return (
                                <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${config.ring}`}></div>
                                        {index !== patient.appointmentHistory.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                        
                                        <div 
                                            className={`p-4 rounded-xl border transition-all cursor-pointer ${config.border}`}
                                            onClick={() => onViewAppointmentDetail && onViewAppointmentDetail(appt)}
                                        >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-[16px] font-bold ${config.label === 'รอตรวจ' ? 'text-orange-600' : 'text-slate-500'}`}>{appt.date}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.color} ${config.label === 'รอตรวจ' ? 'animate-pulse' : ''}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <h5 className={`font-bold text-[16px] ${config.text}`}>{appt.title}</h5>
                                        <div className="text-[14px] text-slate-500 mt-2 space-y-1">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={12} /> {appt.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User size={12} /> {appt.doctor}
                                            </div>
                                            {appt.note && (
                                                <div className="flex items-center gap-1 text-blue-600/80 mt-1">
                                                    * {appt.note}
                                                </div>
                                            )}
                                        </div>
                                        </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                    )}

                    {activeHistoryTab === 'referral' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[16px]">
                            <Send className="text-blue-500" /> ประวัติการส่งตัว
                        </h3>
                        <div className="relative pl-2 ml-2">
                            {/* Use global REFERRAL_DATA instead of stale patient.referralHistory */}
                            {REFERRAL_DATA.filter(r => r.hn === patient.hn || r.patientHn === patient.hn)
                                .sort((a: any, b: any) => new Date(b.date || b.referralDate).getTime() - new Date(a.date || a.referralDate).getTime())
                                .map((ref: any, index: number, arr: any[]) => {
                                    // Map REFERRAL_DATA fields to display format
                                    const displayRef = {
                                        ...ref,
                                        acceptedDateFormatted: ref.acceptedDate ? new Date(ref.acceptedDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : null,
                                        dateFormatted: new Date(ref.date || ref.referralDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
                                        from: ref.hospital || ref.from,
                                        to: ref.destinationHospital || ref.to,
                                        title: ref.reason || ref.title
                                    };
                                    
                                    const config = getReferralStatusConfig(displayRef.status);
                                    
                                    return (
                                        <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${config.ring}`}></div>
                                            {index !== arr.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                            
                                            <div 
                                                className={`bg-slate-50 p-4 rounded-xl border transition-all cursor-pointer ${config.border}`}
                                                onClick={() => onViewReferralDetail?.(displayRef)}
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs font-bold text-slate-500 text-[16px]">
                                                        {displayRef.acceptedDateFormatted || displayRef.dateFormatted}
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.color}`}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <h5 className={`font-bold text-sm text-[16px] ${config.text}`}>{displayRef.title}</h5>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                                    <span className="flex items-center gap-1 text-[13px]">
                                                        <Home size={12} /> {displayRef.from} <ChevronLeft size={10} className="rotate-180" /> {displayRef.to}
                                                    </span>
                                                </div>
                                                {displayRef.doctor && displayRef.doctor !== '-' && (
                                                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                        <User size={12} /> {displayRef.doctor}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    )}

                    {activeHistoryTab === 'teleconsult' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[16px]">
                            <Video className="text-blue-500" /> Tele-med History
                        </h3>
                        <div className="relative pl-2 ml-2">
                            {patient.teleConsultHistory && [...patient.teleConsultHistory].sort((a: any, b: any) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()).map((item: any, index: number) => {
                                const config = getTelemedStatusConfig(item.status);
                                return (
                                <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${config.ring}`}></div>
                                        {index !== patient.teleConsultHistory.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                        
                                        <div 
                                        className={`bg-slate-50 p-4 rounded-xl border transition-all cursor-pointer ${config.border}`}
                                        onClick={() => onViewTeleConsultDetail?.(item)}
                                        >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500 text-[16px]">{item.date}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.color}`}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <h5 className={`font-bold text-sm text-[16px] ${config.text}`}>{item.title}</h5>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="flex items-center gap-1 text-xs text-slate-400 text-[14px]">
                                                    {item.channel === 'mobile' ? (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Smartphone size={12} /> Direct (ผู้ป่วยเชื่อมต่อเอง)
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Building2 size={12} /> Via Host (ผ่านหน่วยงาน)
                                                        </span>
                                                    )}
                                                </span>

                                            </div>
                                        </div>
                                        {item.doctor !== '-' && (
                                            <div className="text-[14px] text-slate-400 mt-1 flex items-center gap-1">
                                                <User size={12} /> {item.doctor}
                                            </div>
                                        )}
                                        </div>
                                </div>
                            )})}
                        </div>
                    </div>
                    )}
            </div>

            {!readOnly && isHomeVisitFormOpen && createPortal(
                <div className="fixed inset-0 z-[9999] bg-white">
                    <HomeVisitForm 
                        onBack={() => setIsHomeVisitFormOpen(false)}
                        onSave={() => setIsHomeVisitFormOpen(false)} 
                        initialPatientId={patient.hn}
                        patientName={patient.name}
                    />
                </div>,
                document.body
            )}
        </div>
    );
};