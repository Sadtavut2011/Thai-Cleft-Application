import React, { useState, useMemo, useEffect } from 'react';
import {
    FileText,
    Calendar,
    Building,
    Phone,
    User,
    CheckCircle,
    XCircle,
    File,
    ChevronRight,
    ChevronDown,
    Info,
    Send,
    Clock,
    Pencil,
    Trash2,
    X,
    History,
    Ambulance,
    Users,
    Plus,
    Upload,
    Map,
    CreditCard,
    MapPin,
    Navigation,
    LayoutGrid,
    ArrowLeft,
    Home,
    Activity,
    Search,
    MessageCircle,
    List,
    Filter,
    Book,
    Briefcase,
    Video,
    TrendingUp,
    Smartphone,
    Building2,
    ChevronUp
} from 'lucide-react';
import { HomeVisitSystem } from '../../../cm/cm-mobile/home-visit/HomeVisitSystem';
import ReferralDashboard from '../../../cm/cm-mobile/referral/ReferralDashboard';
import { TeleConsultationSystem } from '../tele-med/TeleConsultationSystem';
import { FundingSystem } from '../../../cm/cm-mobile/funding/FundingSystem';
import { PATIENTS_DATA, REFERRAL_DATA, HOME_VISIT_DATA, TELEMED_DATA } from '../../../../data/patientData';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

// --- HELPER FUNCTIONS ---
const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
        case 'emergency': return 'text-red-600 bg-red-50 border-red-100';
        case 'urgent': return 'text-orange-600 bg-orange-50 border-orange-100';
        default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
};

const SystemsDashboard = ({ onNavigate, stats }: { onNavigate: (sys: string, params?: any) => void, stats: any }) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [showAllTasks, setShowAllTasks] = useState(false);

    // DEMO DATE: 2025-12-04
    const TODAY = '2025-12-04';
    const displayDate = "พฤหัสบดี 4 ธ.ค. 68"; // Hardcoded for demo consistency

    // Reset showAllTasks when filter changes
    useEffect(() => {
        setShowAllTasks(false);
    }, [activeFilter]);

    // --- FILTER TASKS FOR TODAY ---
    const todaysTasks = useMemo(() => {
        const tasks: any[] = [];

        // 1. Appointments (Hospital Check-up)
        PATIENTS_DATA.forEach(p => {
            if (p.date === TODAY) {
                tasks.push({
                    id: `appt-${p.id}`,
                    type: 'appointment',
                    time: p.time,
                    title: 'นัดหมายตรวจรักษา',
                    patient: p.name,
                    hn: p.hn,
                    detail: p.hospital ? `ที่ ${p.hospital}` : 'นัดหมายปกติ',
                    status: p.status,
                    raw: p
                });
            }
        });

        // 2. Tele-med (Tele-consult)
        TELEMED_DATA.forEach(t => {
            if (t.date === TODAY) {
                tasks.push({
                    id: `tele-${t.id}`,
                    type: 'tele',
                    time: t.time,
                    title: 'Tele-consultation',
                    patient: t.name,
                    hn: t.hn,
                    detail: t.channel === 'mobile' ? 'ผ่านมือถือ' : 'ผ่านโรงพยาบาล',
                    status: t.status,
                    raw: t
                });
            }
        });

        // 3. Home Visit (Joint Visit)
        HOME_VISIT_DATA.forEach(v => {
            if (v.date === TODAY) {
                tasks.push({
                    id: `visit-${v.id}`,
                    type: 'visit',
                    time: v.time,
                    title: v.type === 'Joint Visit' ? 'เยี่ยมบ้านผู้ป่วย)' : 'เยี่ยมบ้านผู้ป่วย',
                    patient: v.name,
                    hn: v.hn,
                    detail: v.rph ? `พื้นที่: ${v.rph}` : 'ลงพื้นที่',
                    status: v.status,
                    raw: v
                });
            }
        });

        // 4. Referral (Receive - Inbound)
        // Focus on "Receive case where hospital scheduled transfer"
        REFERRAL_DATA.forEach(r => {
            // If type is Refer In and date matches (meaning arrival/transfer date)
            if (r.type === 'Refer In' && r.date === TODAY) {
                tasks.push({
                    id: `refer-${r.id}`,
                    type: 'referral',
                    time: r.time,
                    title: 'รับตัวผู้ป่วยส่งต่อ',
                    patient: r.patientName || r.name,
                    hn: r.patientHn || r.hn,
                    detail: `จาก: ${r.hospital}`,
                    status: r.status,
                    raw: r
                });
            }
        });

        return tasks.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }, []);

    const filteredTasks = todaysTasks.filter(task => activeFilter === 'all' || task.type === activeFilter);

    // Filter logic for My Tasks section
    const myTasks = todaysTasks.filter(task =>
        task.type !== 'referral' &&
        (activeFilter === 'all' || activeFilter === task.type)
    );

    const displayedTasks = showAllTasks ? myTasks : myTasks.slice(0, 3);
    const remainingCount = myTasks.length - displayedTasks.length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3">
                {/* 1. Appointments Today */}
                <div
                    onClick={() => onNavigate('appointment')}
                    className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col gap-4 h-auto cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full bg-[#7066a9] flex items-center justify-center text-white shadow-md shadow-indigo-100">
                            <Calendar size={22} />
                        </div>
                        <div className="bg-[#dcfce7] text-[#166534] text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                            <TrendingUp size={14} /> 10 นัด
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">ระบบนัดหมาย</div>
                        <div className="text-3xl font-bold text-[#1e2939] mb-1">10</div>
                        <div className="text-slate-400 text-xs">นัดหมายวันนี้</div>
                    </div>
                </div>

                {/* 2. Tele-consult */}
                <div
                    onClick={() => onNavigate('teleconsult')}
                    className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col gap-4 h-auto cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full bg-[#ef4444] flex items-center justify-center text-white shadow-md shadow-red-100">
                            <Video size={22} />
                        </div>
                        <div className="bg-[#dcfce7] text-[#166534] text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                            <TrendingUp size={14} /> +5%
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Tele-consult</div>
                        <div className="text-3xl font-bold text-[#1e2939] mb-1">32</div>
                        <div className="text-slate-400 text-xs">ชั่วโมงปรึกษา</div>
                    </div>
                </div>
            </div>

            {/* System Navigation Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: My Tasks */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        <div>
                            <div className="flex flex-col gap-3 mb-4">
                                <div className="flex justify-end w-full">
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                        <button onClick={() => setActiveFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'all' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>ทั้งหมด ({todaysTasks.length})</button>
                                        <button onClick={() => setActiveFilter('appointment')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'appointment' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>นัดหมาย</button>
                                        <button onClick={() => setActiveFilter('tele')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-sm transition-colors ${activeFilter === 'tele' ? 'bg-[#7066a9] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Tele</button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <LayoutGrid className="text-blue-600" size={20} />
                                        งานของฉันวันนี้
                                    </h2>
                                    <span className="text-sm text-gray-500">{displayDate}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {displayedTasks.map(task => {
                                    if (task.type === 'appointment') {
                                        return (
                                            <div key={task.id} onClick={() => onNavigate('appointment')} className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-gray-800">{task.title} ({task.time} น.)</span>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User size={14} className="text-blue-500" />
                                                        <span>{task.patient} (HN: {task.hn})</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        );
                                    } else if (task.type === 'tele') {
                                        return (
                                            <div key={task.id} onClick={() => onNavigate('teleconsult')} className="bg-green-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-green-100 transition-colors">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-gray-800">{task.title} ({task.time} น.)</span>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User size={14} className="text-green-500" />
                                                        <span>{task.patient} (HN: {task.hn})</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        );
                                    } else if (task.type === 'visit') {
                                        return (
                                            <div key={task.id} onClick={() => onNavigate('visit')} className="bg-[#7066a9]/10 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-[#7066a9]/20 transition-colors">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-gray-800">{task.title}</span>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User size={14} className="text-[#7066a9]" />
                                                        <span>{task.patient} (HN: {task.hn})</span>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-[#7066a9] flex items-center justify-center text-white shadow-sm">
                                                    <ChevronRight size={18} />
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}

                                {myTasks.length === 0 && (
                                    <div className="text-center py-6 text-slate-400">
                                        <p className="text-sm">ไม่มีงานที่ต้องทำในช่วงนี้</p>
                                    </div>
                                )}

                                {/* Show More Button */}
                                {(remainingCount > 0 || showAllTasks) && myTasks.length > 3 && (
                                    <div className="flex justify-center pt-2">
                                        <button
                                            onClick={() => setShowAllTasks(!showAllTasks)}
                                            className="text-sm text-[#7066a9] font-medium hover:underline flex items-center gap-1 transition-colors"
                                        >
                                            {showAllTasks ? (
                                                <>
                                                    ย่อรายการ <ChevronUp size={14} />
                                                </>
                                            ) : (
                                                <>
                                                    แสดงเพิ่มเติมอีก {remainingCount} รายการ <ChevronDown size={14} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Briefcase className="text-[#7066a9]" size={20} />
                                    งานที่อยู่ในการดูแล
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {(activeFilter === 'all' || activeFilter === 'referral') && REFERRAL_DATA.filter(r => r.type === 'Refer In' && (r.status === 'Pending' || r.status === 'pending')).map(r => (
                                    <div key={r.id} onClick={() => onNavigate('referral', { hn: r.hn })} className="bg-blue-50 p-4 rounded-2xl flex justify-between cursor-pointer hover:bg-blue-100 transition-colors">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-gray-800">ระบบส่งตัวผู้ป่วย</span>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <User size={14} className="text-blue-500" />
                                                    <span>{r.patientName} (HN: {r.patientHn || r.hn})</span>
                                                </div>
                                            </div>

                                            <div className="bg-[#f8fafc] border border-[#f1f5f9] rounded-[10px] px-3 py-1.5 flex items-center gap-2 w-fit">
                                                <span className="text-[#62748e] text-[12px]">{r.hospital}</span>
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                                                    <path d="M2.5 6H9.5" stroke="#90A1B9" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M6 2.5L9.5 6L6 9.5" stroke="#90A1B9" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span className="text-[#7367f0] text-[12px] font-medium">รพ.ฝาง</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm shrink-0">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(activeFilter === 'all' || activeFilter === 'referral') && REFERRAL_DATA.filter(r => r.type === 'Refer In' && (r.status === 'Pending' || r.status === 'pending')).length === 0 && (
                                    <div className="text-center py-6 text-slate-400">
                                        <p className="text-sm">ไม่มีงานที่อยู่ในการดูแล</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function HospitalMobileWorkSystems({
    outgoingCases = [],
    currentSystem: initialSystem = 'dashboard',
    onRequestFund,
    onRequestReferral,
    onVisitFormStateChange,
    initialHN,
    onExitDetail
}: {
    outgoingCases?: any[],
    currentSystem?: string,
    onRequestFund?: () => void,
    onRequestReferral?: () => void,
    onVisitFormStateChange?: (isOpen: boolean) => void,
    initialHN?: string,
    onExitDetail?: () => void
}) {
    const [currentSystem, setCurrentSystem] = useState(initialSystem);

    // Stats for Dashboard using Central Data
    const stats = useMemo(() => ({
        referral: REFERRAL_DATA.length,
        appointments: PATIENTS_DATA.filter(p => p.date === '2025-12-04').length,
        pending: REFERRAL_DATA.filter(r => (r.status === 'pending' || r.status === 'Pending')).length,
        inbound: REFERRAL_DATA.filter(r => r.type === 'Refer In').length,
        outbound: REFERRAL_DATA.filter(r => r.type === 'Refer Out').length
    }), []);

    // Effect to handle external navigation props
    React.useEffect(() => {
        if (initialHN) {
            setCurrentSystem('referral');
        }
    }, [initialHN]);

    // Wrapper for navigation that handles params if needed (e.g. auto-select patient in referral)
    // In a real app, this might pass props down. For now, we rely on initialHN prop pattern or Context.
    // But since we can't easily change the top-level Props from here without a callback, 
    // we'll assume the sub-components handle their own state or we pass `initialHN` if we could.
    // Note: The `ReferralDashboard` already takes `initialHN`. 
    // If we navigate internally, we might need a way to pass that state.

    // Local state for internal navigation params
    const [navParams, setNavParams] = useState<any>({});

    const handleNavigate = (sys: string, params?: any) => {
        setCurrentSystem(sys);
        if (params) {
            setNavParams(params);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ${(currentSystem === 'visit' || currentSystem === 'teleconsult' || currentSystem === 'referral' || currentSystem === 'funding') ? 'p-0' : 'p-4 md:p-6'}`}>
                {currentSystem === 'dashboard' && (
                    <SystemsDashboard onNavigate={handleNavigate} stats={stats} />
                )}

                {currentSystem === 'referral' && (
                    <ReferralDashboard
                        onBack={() => setCurrentSystem('dashboard')}
                        onRequestReferral={onRequestReferral}
                        initialHN={navParams.hn || initialHN}
                        onExit={() => {
                            setNavParams({});
                            if (onExitDetail) onExitDetail();
                            else setCurrentSystem('dashboard');
                        }}
                    />
                )}

                {currentSystem === 'funding' && (
                    <FundingSystem
                        onBack={() => setCurrentSystem('dashboard')}
                        onRequestFund={onRequestFund}
                    />
                )}

                {currentSystem === 'teleconsult' && (
                    <TeleConsultationSystem onBack={() => setCurrentSystem('dashboard')} />
                )}

                {currentSystem === 'visit' && (
                    <HomeVisitSystem
                        onBack={() => setCurrentSystem('dashboard')}
                        onVisitFormStateChange={onVisitFormStateChange}
                    />
                )}

                {currentSystem === 'appointment' && (
                    // If user clicks appointment card, they probably want to see the calendar or list
                    // Since App.tsx handles the main tabs, we might just show a placeholder or 
                    // ideally this component shouldn't handle 'appointment' view if it's a sibling tab.
                    // However, if we must show it here:
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Calendar size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-slate-600">ระบบนัดหมาย</h3>
                        <p className="text-slate-500 mt-2">กรุณาใช้เมนู "ปฏิทิน" ด้านล่างเพื่อจัดการนัดหมาย</p>
                        <button onClick={() => setCurrentSystem('dashboard')} className="mt-4 text-blue-500 hover:underline">กลับหน้าหลัก</button>
                    </div>
                )}
            </div>
        </div>
    );
}
