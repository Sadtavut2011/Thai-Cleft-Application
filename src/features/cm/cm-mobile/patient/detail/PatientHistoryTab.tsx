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
    CheckCircle 
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { HomeVisitForm } from '../../home-visit/forms/HomeVisitForm';

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
    onViewTeleConsultDetail
}) => {
    const [isHomeVisitFormOpen, setIsHomeVisitFormOpen] = useState(false);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
            {/* History Sub-Menu Pills */}
            <div className="grid grid-cols-3 gap-3 pb-6">
                {[
                    { id: 'treatment', label: 'การรักษา' },
                    { id: 'visit', label: 'การเยี่ยม' },
                    { id: 'appointment', label: 'การนัดหมาย' },
                    { id: 'referral', label: 'การส่งตัว' },
                    { id: 'teleconsult', label: 'Tele-consult' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveHistoryTab(tab.id)}
                        className={cn(
                            "w-full px-2 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap flex justify-center items-center",
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
                            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[16px]">
                            <Clock className="text-blue-500" /> ประวัติการรักษาทั้งหมด
                            </h3>
                            
                            {patient.history && patient.history.length > 0 ? (
                            <div className="relative pl-2 ml-2">
                                {patient.history.map((h: any, idx: number) => {
                                    const isExpanded = expandedHistoryIndex === idx;
                                    return (
                                    <div key={idx} className="relative pl-8 pb-8 last:pb-0">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 bg-blue-500 ring-blue-100"></div>
                                        {idx !== patient.history.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                        
                                        <div 
                                            className={`bg-slate-50 p-4 rounded-xl border border-slate-100 transition-all cursor-pointer ${isExpanded ? 'bg-blue-50/50 border-blue-100 shadow-sm' : 'hover:bg-slate-100'}`}
                                            onClick={() => onViewTreatmentDetail ? onViewTreatmentDetail(h) : setExpandedHistoryIndex(isExpanded ? null : idx)}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-slate-500">{h.date}</span>
                                                {!isExpanded && h.detail && <span className="text-[10px] text-blue-500 font-medium">คลิกเพื่อดูรายละเอียด</span>}
                                            </div>
                                            <h5 className="font-bold text-slate-800 text-sm">{h.title}</h5>
                                            <div className="text-xs text-slate-500 mt-2 space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} /> ห้องตรวจ: {h.department}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User size={12} /> {h.doctor}
                                                </div>
                                                {isExpanded && h.detail && (
                                                    <div className="text-slate-600 mt-3 pt-3 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-1 text-sm leading-relaxed">
                                                        {h.detail}
                                                    </div>
                                                )}
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
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => setIsHomeVisitFormOpen(true)}
                                    className="bg-[#6a5acd] hover:bg-[#5a4db8] text-white text-[14px] font-['IBM_Plex_Sans_Thai'] px-3 py-1.5 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.33188 7.99648H12.6611" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M7.99648 3.33188V12.6611" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    เพิ่มข้อมูลเยี่ยมบ้าน
                                </button>
                            </div>
                        </div>
                        <div className="relative pl-2 ml-2">
                            {patient.visitHistory?.map((visit: any, index: number) => (
                                <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 bg-blue-500 ring-blue-100"></div>
                                    {index !== patient.visitHistory.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                    
                                    <div 
                                        className="bg-slate-50 p-4 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 hover:border-blue-200 transition-all"
                                        onClick={() => onViewVisitDetail && onViewVisitDetail(visit)}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500">{visit.date}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${visit.type === 'เยี่ยมบ้าน' ? 'bg-blue-100 text-blue-700' : 'bg-blue-100 text-blue-700'}`}>
                                                เยี่ยมบ้าน
                                            </span>
                                        </div>
                                        <h5 className="font-bold text-slate-800 text-sm">{visit.title}</h5>
                                        <div className="text-xs text-slate-500 mt-2 space-y-1">
                                            <div className="flex items-center gap-1">
                                                <User size={12} /> ผู้ให้บริการ: {visit.provider}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}

                    {activeHistoryTab === 'appointment' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[16px]">
                            <CalendarPlus className="text-blue-500" /> ประวัตินัดหมาย
                        </h3>
                        <div className="relative pl-2 ml-2">
                            {patient.appointmentHistory?.map((appt: any, index: number) => (
                                <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 ${appt.status === 'upcoming' ? 'bg-blue-500 ring-blue-100' : 'bg-blue-400 ring-blue-100/50'}`}></div>
                                        {index !== patient.appointmentHistory.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                        
                                        <div 
                                            className={`p-4 rounded-xl border transition-all cursor-pointer ${appt.status === 'upcoming' ? 'bg-blue-50 border-blue-100 shadow-sm hover:border-blue-300' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:border-slate-300'}`}
                                            onClick={() => onViewAppointmentDetail && onViewAppointmentDetail(appt)}
                                        >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-xs font-bold ${appt.status === 'upcoming' ? 'text-blue-600' : 'text-slate-500'}`}>{appt.date} • {appt.time}</span>
                                            {appt.status === 'upcoming' && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold animate-pulse">
                                                    นัดหมายครั้งถัดไป
                                                </span>
                                            )}
                                        </div>
                                        <h5 className={`font-bold text-sm ${appt.status === 'upcoming' ? 'text-blue-900' : 'text-slate-800'}`}>{appt.title}</h5>
                                        <div className="text-xs text-slate-500 mt-2 space-y-1">
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
                            ))}
                        </div>
                    </div>
                    )}

                    {activeHistoryTab === 'referral' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[16px]">
                            <Send className="text-blue-500" /> ประวัติการส่งตัว
                        </h3>
                        <div className="relative pl-2 ml-2">
                            {patient.referralHistory?.map((ref: any, index: number) => (
                                <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 bg-blue-500 ring-blue-100"></div>
                                        {index !== patient.referralHistory.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                        
                                        <div 
                                        className={`bg-slate-50 p-4 rounded-xl border transition-all cursor-pointer ${expandedHistoryIndex === index ? 'border-blue-400 shadow-md bg-white' : 'border-slate-100 hover:border-blue-300'}`}
                                        onClick={() => onViewReferralDetail ? onViewReferralDetail(ref) : setExpandedHistoryIndex(expandedHistoryIndex === index ? null : index)}
                                        >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500">{ref.date}</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">
                                                Referral
                                            </span>
                                        </div>
                                        <h5 className="font-bold text-slate-800 text-sm">{ref.title}</h5>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                            <span className="flex items-center gap-1"><Home size={12} /> {ref.from} <ChevronLeft size={10} className="rotate-180" /> {ref.to}</span>
                                        </div>
                                        {ref.doctor !== '-' && (
                                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <User size={12} /> {ref.doctor}
                                            </div>
                                        )}

                                        {expandedHistoryIndex === index && !onViewReferralDetail && (
                                            <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 animate-in fade-in duration-200 cursor-default" onClick={(e) => e.stopPropagation()}>
                                                <div className="grid grid-cols-2 gap-2 mb-3">
                                                    <div>
                                                        <span className="block text-slate-400 text-[10px] uppercase font-semibold">เลขที่ใบส่งตัว</span>
                                                        <span className="font-medium text-slate-700 flex items-center gap-1">
                                                            REF-6701-{1000 + index} <FileText size={10} className="text-slate-400" />
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-slate-400 text-[10px] uppercase font-semibold">สถานะ</span>
                                                        <span className="font-medium text-green-600 flex items-center gap-1">
                                                            <CheckCircle size={10} /> อนุมัติแล้ว
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-3 space-y-1">
                                                    <span className="block text-slate-400 text-[10px] uppercase font-semibold">เหตุผลการส่งต่อ</span>
                                                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                        ผู้ป่วยมีภาวะปากแหว่งเพดานโหว่ ต้องการการประเมินและวางแผนการผ่าตัดร่วมกับศัลยแพทย์ตกแต่งและกุมารแพทย์
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}

                    {activeHistoryTab === 'teleconsult' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[16px]">
                            <Video className="text-blue-500" /> Tele-consult History
                        </h3>
                        <div className="relative pl-2 ml-2">
                            {patient.teleConsultHistory?.map((item: any, index: number) => (
                                <div key={index} className="relative pl-8 pb-8 last:pb-0">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ring-2 z-10 bg-blue-500 ring-blue-100"></div>
                                        {index !== patient.teleConsultHistory.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-slate-100"></div>}
                                        
                                        <div 
                                        className={cn(
                                            "bg-slate-50 p-4 rounded-xl border border-slate-100 cursor-pointer transition-all duration-200",
                                            expandedHistoryIndex === index ? "border-blue-400 bg-blue-50/30 shadow-sm" : "hover:border-blue-300"
                                        )}
                                        onClick={() => onViewTeleConsultDetail ? onViewTeleConsultDetail(item) : setExpandedHistoryIndex(expandedHistoryIndex === index ? null : index)}
                                        >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-slate-500">{item.date}</span>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">
                                                Tele-consult
                                            </span>
                                        </div>
                                        <h5 className="font-bold text-slate-800 text-sm">{item.title}</h5>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                            <div className="flex flex-col items-start gap-0.5">
                                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                                    <User size={12} />
                                                    {item.from === 'บ้าน' || item.from === 'Home' ? 'Direct (ผู้ป่วยเชื่อมต่อเอง)' : 'Via Host (ผ่านหน่วยงาน)'}
                                                </span>

                                            </div>
                                        </div>
                                        {item.doctor !== '-' && (
                                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                <User size={12} /> {item.doctor}
                                            </div>
                                        )}

                                        {/* Expanded Details - Only show if NO click handler provided, otherwise assume navigation */}
                                        {expandedHistoryIndex === index && !onViewTeleConsultDetail && (
                                            <div className="mt-4 pt-4 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-1 duration-200 cursor-default" onClick={(e) => e.stopPropagation()}>
                                                <div className="space-y-3">
                                                    <div>
                                                        <span className="text-xs font-bold text-slate-700 block mb-1">รายละเอียดการปรึกษา</span>
                                                        <p className="text-sm text-slate-600 leading-relaxed bg-white/50 p-3 rounded-lg border border-slate-100">
                                                            {item.detail || "ผู้ป่วยมีอาการดีขึ้นตามลำดับ แผลแห้งดี ไม่มีอาการบวมแดงหรือมีหนอง ผู้ปกครองสามารถดูแลทำความสะอาดแผลได้ถูกต้อง แนะนำให้สังเกตอาการต่อเนื่องและมาตามนัดครั้งถัดไป"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
            </div>

            {isHomeVisitFormOpen && createPortal(
                <div className="fixed inset-0 z-[9999] bg-white">
                    <HomeVisitForm 
                        onBack={() => setIsHomeVisitFormOpen(false)}
                        onSave={() => setIsHomeVisitFormOpen(false)} 
                    />
                </div>,
                document.body
            )}
        </div>
    );
};
