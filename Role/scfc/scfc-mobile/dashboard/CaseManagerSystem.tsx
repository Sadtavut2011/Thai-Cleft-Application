import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
    ArrowLeft,
    Search,
    Users,
    Building2,
    MapPin,
    ChevronDown,
    ArrowRight,
    TrendingUp,
    Phone,
    Mail,
    ChevronRight,
    ChevronLeft,
    Baby,
    Home,
    Briefcase,
    Clock,
    CheckCircle,
    AlertCircle,
    UserCheck,
    UserX,
    CalendarOff,
    X,
    Activity,
    Eye,
    PieChart as PieChartIcon
} from 'lucide-react';
import { cn } from '../../../../components/ui/utils';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Card } from '../../../../components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { CASE_MANAGER_DATA, CaseManager, PATIENTS_DATA } from '../../../../data/patientData';
import { buildServiceUnits } from '../../../../data/themeConfig';
import { createPortal } from 'react-dom';
import { CMDrilldownView } from './CMDrillDown/shared';
import { StatusDrilldown as CMStatusDrilldown } from './CMDrillDown/StatusDrilldown';
import { ProvinceDrilldown } from './CMDrillDown/ProvinceDrilldown';
import { WorkloadDrilldown } from './CMDrillDown/WorkloadDrilldown';
import { TopPerformersDrilldown } from './CMDrillDown/TopPerformersDrilldown';
import { useDragScroll } from '../components/useDragScroll';

// ── Purple Theme (mobile) ──
// Primary: #49358E, Medium: #7066A9, Dark: #37286A
// Light: #E3E0F0, #D2CEE7, #F4F0FF
// CM accent: #7367f0

const PROVINCES = ['ทุกจังหวัด', 'เชียงใหม่', 'เชียงราย', 'ลำพูน', 'ลำปาง', 'พะเยา', 'แพร่', 'น่าน', 'แม่ฮ่องสอน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

const STATUS_PILLS = [
    { id: 'all', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#49358E] text-white shadow-md shadow-[#49358E]/20' },
    { id: 'active', label: 'ปฏิบัติงาน', color: 'bg-emerald-50 text-emerald-600 border border-emerald-200', activeColor: 'bg-emerald-500 text-white shadow-md shadow-emerald-200' },
    { id: 'leave', label: 'ลาพัก', color: 'bg-amber-50 text-amber-600 border border-amber-200', activeColor: 'bg-amber-500 text-white shadow-md shadow-amber-200' },
    { id: 'inactive', label: 'ไม่ใช้งาน', color: 'bg-red-50 text-red-500 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
];

// ── Helpers ──
const getStatusLabel = (status: string) => {
    switch (status) {
        case 'active': return 'ปฏิบัติงาน';
        case 'leave': return 'ลาพัก';
        case 'inactive': return 'ไม่ใช้งาน';
        default: return status;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'active': return 'bg-emerald-100 text-emerald-700';
        case 'leave': return 'bg-amber-100 text-amber-700';
        case 'inactive': return 'bg-red-100 text-red-600';
        default: return 'bg-slate-100 text-slate-600';
    }
};

const formatLastActive = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs} ชม.ที่แล้ว`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays} วันที่แล้ว`;
    } catch { return dateStr; }
};

// ── CM Detail View ──
function CMDetailView({ cm, onBack }: { cm: CaseManager; onBack: () => void }) {
    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#f8f9fa] w-full h-[100dvh] overflow-y-auto font-sans [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Header */}
            <div className="sticky top-0 z-[10000] w-full bg-[#7066a9] shadow-md">
                <div className="h-[64px] px-4 flex items-center gap-3 shrink-0">
                    <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-white text-lg">ข้อมูล Case Manager</h1>
                </div>
            </div>

            <div className="p-4 space-y-4 max-w-lg mx-auto w-full pb-24">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3E0F0]">
                    <div className="flex items-center gap-4 mb-4">
                        <img src={cm.image} alt={cm.name} className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-md" />
                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-[#37286A] text-[18px] truncate">{cm.name}</h2>
                            <p className="text-[16px] text-[#7066A9]">{cm.position}</p>
                            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[16px] font-bold ${getStatusColor(cm.status)}`}>
                                {getStatusLabel(cm.status)}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5 text-[16px]">
                        <div className="flex items-center gap-3 text-[#37286A]">
                            <Phone size={16} className="text-[#7367f0] shrink-0" />
                            <span>{cm.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#37286A]">
                            <Mail size={16} className="text-[#7367f0] shrink-0" />
                            <span className="truncate">{cm.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#37286A]">
                            <MapPin size={16} className="text-[#7367f0] shrink-0" />
                            <span>จ.{cm.province}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#37286A]">
                            <Clock size={16} className="text-[#7367f0] shrink-0" />
                            <span>เข้าร่วม: {new Date(cm.joinDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-[#E3E0F0] shadow-sm">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2"><Baby size={18} /></div>
                        <span className="text-2xl font-black text-[#37286A]">{cm.patientCount}</span>
                        <p className="text-[16px] font-bold text-[#7066A9] mt-0.5">ผู้ป่วยในความดูแล</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E3E0F0] shadow-sm">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2"><Home size={18} /></div>
                        <span className="text-2xl font-black text-[#37286A]">{cm.activeVisits}</span>
                        <p className="text-[16px] font-bold text-[#7066A9] mt-0.5">เยี่ยมบ้านที่ดำเนินการ</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E3E0F0] shadow-sm">
                        <div className="w-9 h-9 rounded-lg bg-[#F4F0FF] text-[#49358E] flex items-center justify-center mb-2"><CheckCircle size={18} /></div>
                        <span className="text-2xl font-black text-[#37286A]">{cm.completedVisits}</span>
                        <p className="text-[16px] font-bold text-[#7066A9] mt-0.5">เยี่ยมสำเร็จแล้ว</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-[#E3E0F0] shadow-sm">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2"><Briefcase size={18} /></div>
                        <span className="text-2xl font-black text-[#37286A]">{cm.pendingFunds}</span>
                        <p className="text-[16px] font-bold text-[#7066A9] mt-0.5">ทุนรอพิจารณา</p>
                    </div>
                </div>

                {/* Hospitals Managed */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3E0F0]">
                    <h3 className="font-bold text-[#37286A] text-[16px] mb-3 flex items-center gap-2">
                        <Building2 size={16} className="text-[#7367f0]" />
                        โรงพยาบาลที่รับผิดชอบ ({cm.hospitals.length})
                    </h3>
                    <div className="space-y-2">
                        {cm.hospitals.map((h) => (
                            <div key={h.id} className="flex items-center gap-3 p-3 bg-[#F4F0FF]/40 rounded-xl border border-[#E3E0F0]">
                                <div className="w-8 h-8 rounded-full bg-[#E3E0F0] text-[#49358E] flex items-center justify-center shrink-0">
                                    <Building2 size={14} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-[#37286A] text-[14px] truncate">{h.name}</p>
                                    <p className="text-[16px] text-[#7066A9]">จ.{h.province}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E3E0F0]">
                    <h3 className="font-bold text-[#37286A] text-[16px] mb-4">กิจกรรมล่าสุด</h3>
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-6 ml-2">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                            <p className="text-[16px] font-bold text-[#37286A]">เยี่ยมบ้านผู้ป่วย ด.ช. สมชาย</p>
                            <p className="text-[16px] text-[#7066A9]">เมื่อวาน 14:30 น.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                            <p className="text-[16px] font-bold text-[#37286A]">ส่งรายงานทุนสงเคราะห์</p>
                            <p className="text-[16px] text-[#7066A9]">2 วันที่แล้ว</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#49358E] ring-4 ring-white"></div>
                            <p className="text-[16px] font-bold text-[#37286A]">ประสานงานส่งตัวผู้ป่วย</p>
                            <p className="text-[16px] text-[#7066A9]">5 วันที่แล้ว</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ── CM List View ──
function CMListView({ data, onSelect, onBack, searchQuery, onSearchChange }: {
    data: CaseManager[];
    onSelect: (cm: CaseManager) => void;
    onBack: () => void;
    searchQuery: string;
    onSearchChange: (v: string) => void;
}) {
    const [filterStatus, setFilterStatus] = useState('all');

    const statusScrollRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const handleMouseDown = useCallback((e: React.MouseEvent) => { isDraggingRef.current = true; startXRef.current = e.pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeftRef.current = statusScrollRef.current?.scrollLeft || 0; }, []);
    const handleMouseMove = useCallback((e: React.MouseEvent) => { if (!isDraggingRef.current || !statusScrollRef.current) return; e.preventDefault(); const x = e.pageX - (statusScrollRef.current.offsetLeft || 0); statusScrollRef.current.scrollLeft = scrollLeftRef.current - (x - startXRef.current) * 1.5; }, []);
    const handleMouseUp = useCallback(() => { isDraggingRef.current = false; }, []);

    const filtered = data.filter(cm => {
        const matchesStatus = filterStatus === 'all' || cm.status === filterStatus;
        const matchesSearch = !searchQuery || cm.name.includes(searchQuery) || cm.id.includes(searchQuery) || cm.hospitals.some(h => h.name.includes(searchQuery));
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
            <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
                <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-white text-lg font-bold">รายชื่อ Case Manager</h1>
                <span className="ml-auto bg-white/20 text-white px-3 py-1 rounded-full text-[16px]">{filtered.length} คน</span>
            </div>

            <div className="p-4 space-y-4 flex-1">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="ค้นหาชื่อ CM, รหัส, โรงพยาบาล..."
                        className="pl-12 bg-white border-[#E3E0F0] focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm"
                    />
                </div>

                <div
                    ref={statusScrollRef}
                    className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {STATUS_PILLS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setFilterStatus(p.id)}
                            className={cn(
                                "px-4 py-2 rounded-full text-[16px] font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                                filterStatus === p.id ? p.activeColor : p.color
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {filtered.map(cm => (
                        <Card
                            key={cm.id}
                            className="shadow-sm border-[#E3E0F0] rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer"
                            onClick={() => onSelect(cm)}
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <img src={cm.image} alt={cm.name} className="w-11 h-11 rounded-full bg-slate-100 border border-white shadow-sm shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-[#37286A] text-[16px] truncate">{cm.name}</h3>
                                                <p className="text-[13px] text-[#7066A9] mt-0.5">{cm.id} | จ.{cm.province}</p>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${getStatusColor(cm.status)}`}>
                                                {getStatusLabel(cm.status)}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {cm.hospitals.map(h => (
                                                <span key={h.id} className="inline-flex items-center gap-1 bg-[#F4F0FF] text-[#49358E] text-[16px] px-2 py-0.5 rounded-full">
                                                    <Building2 size={10} /> {h.name.replace('รพ.', '')}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-4 mt-2.5 text-[16px] text-[#7066A9]">
                                            <span className="flex items-center gap-1"><Baby size={12} className="text-blue-500" /> {cm.patientCount}</span>
                                            <span className="flex items-center gap-1"><Home size={12} className="text-emerald-500" /> {cm.activeVisits}</span>
                                            <span className="flex items-center gap-1"><Briefcase size={12} className="text-amber-500" /> {cm.pendingFunds}</span>
                                            <span className="ml-auto text-[16px] text-[#7066A9]">{formatLastActive(cm.lastActive)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-[#7066A9]">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>ไม่พบ Case Manager</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Dashboard Component ──
export default function CaseManagerSystem({ onBack }: { onBack: () => void }) {
    const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'detail'>('dashboard');
    const [selectedCM, setSelectedCM] = useState<CaseManager | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('ทุกจังหวัด');
    const [isProvinceOpen, setIsProvinceOpen] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<string>('All');
    const [isHospitalOpen, setIsHospitalOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [drilldown, setDrilldown] = useState<CMDrilldownView>(null);

    const statsDrag = useDragScroll();
    const chartsDrag = useDragScroll();

    useEffect(() => { setIsMounted(true); }, []);

    // Computed stats
    const stats = useMemo(() => {
        const all = CASE_MANAGER_DATA;
        const filtered = selectedProvince === 'ทุกจังหวัด' ? all : all.filter(c => c.province === selectedProvince);
        return {
            total: filtered.length,
            active: filtered.filter(c => c.status === 'active').length,
            leave: filtered.filter(c => c.status === 'leave').length,
            inactive: filtered.filter(c => c.status === 'inactive').length,
            totalPatients: filtered.reduce((s, c) => s + c.patientCount, 0),
            totalHospitals: new Set(filtered.flatMap(c => c.hospitals.map(h => h.id))).size,
            avgPatients: filtered.length > 0 ? Math.round(filtered.reduce((s, c) => s + c.patientCount, 0) / filtered.length) : 0,
        };
    }, [selectedProvince]);

    // Status pie data
    const statusChartData = useMemo(() => [
        { name: 'ปฏิบัติงาน', value: stats.active, color: '#28c76f' },
        { name: 'ลาพัก', value: stats.leave, color: '#ff9f43' },
        { name: 'ไม่ใช้งาน', value: stats.inactive, color: '#ea5455' },
    ].filter(d => d.value > 0), [stats]);

    // Province chart data
    const provinceChartData = useMemo(() => {
        const map = new Map<string, number>();
        CASE_MANAGER_DATA.forEach(cm => map.set(cm.province, (map.get(cm.province) || 0) + cm.patientCount));
        return Array.from(map.entries())
            .map(([name, value]) => ({ name: name.length > 6 ? name.slice(0, 4) + '..' : name, value, fullName: name }))
            .sort((a, b) => b.value - a.value);
    }, []);

    // Overloaded CMs
    const overloadedCMs = useMemo(() => CASE_MANAGER_DATA.filter(c => c.patientCount > 40 && c.status === 'active'), []);

    // Top performers
    const topCMs = useMemo(() => CASE_MANAGER_DATA.filter(c => c.status === 'active').sort((a, b) => b.patientCount - a.patientCount).slice(0, 3), []);

    // Service units data
    const serviceUnits = useMemo(() => buildServiceUnits(), []);
    const totalServiceCases = useMemo(() => serviceUnits.reduce((s, u) => s + u.caseCount, 0), [serviceUnits]);

    const handleSelectCM = (cm: CaseManager) => {
        setSelectedCM(cm);
        setCurrentView('detail');
    };

    // Scroll dashboard charts
    const scrollDashboard = (direction: 'left' | 'right') => {
        if (chartsDrag.ref.current) {
            chartsDrag.ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
        }
    };

    // ═══ Drill-down views ═══
    if (drilldown && drilldown.type === 'status') {
        return (
            <CMStatusDrilldown
                filter={drilldown.filter}
                label={drilldown.label}
                onBack={() => setDrilldown(null)}
                onSelectCM={(cm) => {
                    setDrilldown(null);
                    handleSelectCM(cm);
                }}
            />
        );
    }

    if (drilldown && drilldown.type === 'province') {
        return (
            <ProvinceDrilldown
                province={drilldown.province}
                onBack={() => setDrilldown(null)}
                onSelectCM={(cm) => {
                    setDrilldown(null);
                    handleSelectCM(cm);
                }}
            />
        );
    }

    if (drilldown && drilldown.type === 'workload') {
        return (
            <WorkloadDrilldown
                onBack={() => setDrilldown(null)}
                onSelectCM={(cm) => {
                    setDrilldown(null);
                    handleSelectCM(cm);
                }}
            />
        );
    }

    if (drilldown && drilldown.type === 'topPerformers') {
        return (
            <TopPerformersDrilldown
                onBack={() => setDrilldown(null)}
                onSelectCM={(cm) => {
                    setDrilldown(null);
                    handleSelectCM(cm);
                }}
            />
        );
    }

    // ── Views ──
    if (currentView === 'detail' && selectedCM) {
        return <CMDetailView cm={selectedCM} onBack={() => setCurrentView('list')} />;
    }

    if (currentView === 'list') {
        return (
            <CMListView
                data={selectedProvince === 'ทุกจังหวัด' ? CASE_MANAGER_DATA : CASE_MANAGER_DATA.filter(c => c.province === selectedProvince)}
                onSelect={handleSelectCM}
                onBack={() => setCurrentView('dashboard')}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
        );
    }

    // ── Dashboard View ──
    return (
        <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-sans pb-20">
            {/* Header */}
            <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
                <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-white text-lg font-bold">จัดการ Case Manager</h1>
            </div>

            <div className="p-4 space-y-5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                {/* --- Filter Section --- */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E3E0F0] flex flex-col gap-3">
                    {/* Province & Hospital dropdowns — horizontal row */}
                    <div className="flex gap-3">
                    <Popover open={isProvinceOpen} onOpenChange={setIsProvinceOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative flex-1 min-w-0 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><MapPin size={18} /></div>
                                <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">{selectedProvince}</span>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><ChevronDown size={18} /></div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[220px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                            <div className="flex flex-col">
                                {PROVINCES.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => { setSelectedProvince(p); setIsProvinceOpen(false); }}
                                        className={cn(
                                            "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
                                            selectedProvince === p ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover open={isHospitalOpen} onOpenChange={setIsHospitalOpen}>
                        <PopoverTrigger asChild>
                            <button className="relative flex-1 min-w-0 h-[44px] bg-[#F4F0FF]/50 border border-[#E3E0F0] rounded-xl flex items-center px-3 text-left focus:outline-none focus:ring-2 focus:ring-[#7066A9]/30 transition-all active:scale-95">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><Building2 size={18} /></div>
                                <span className="pl-7 pr-6 text-[16px] font-medium text-[#37286A] truncate">{selectedHospital === 'All' ? 'ทุกโรงพยาบาล' : selectedHospital}</span>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7066A9] pointer-events-none"><ChevronDown size={18} /></div>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-[240px] p-2 rounded-xl bg-white shadow-xl border border-[#E3E0F0] max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                            <div className="flex flex-col">
                                <button onClick={() => { setSelectedHospital('All'); setIsHospitalOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedHospital === 'All' ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>ทุกโรงพยาบาล</button>
                                {HOSPITALS.map(h => (
                                    <button key={h} onClick={() => { setSelectedHospital(h); setIsHospitalOpen(false); }} className={cn("w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg", selectedHospital === h ? "bg-[#F4F0FF] text-[#49358E]" : "text-slate-700 hover:bg-[#F4F0FF]/50")}>{h}</button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    </div>

                    <Button
                        onClick={() => setCurrentView('list')}
                        className="w-full bg-[#49358E] hover:bg-[#37286A] text-white rounded-xl h-12 text-base font-bold shadow-md shadow-[#49358E]/20 flex items-center justify-center gap-2 transition-all"
                    >
                        ดูรายละเอียด
                        <ArrowRight size={18} />
                    </Button>
                </div>

                {/* --- Stats Summary (4 cards) — horizontal drag-scrollable --- */}
                <div
                    ref={statsDrag.ref}
                    {...statsDrag.handlers}
                    className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
                >
                    <div className="bg-white px-4 py-3 rounded-2xl border border-[#E3E0F0] shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'all', label: 'CM ทั้งหมด' }); }}>
                        <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0">
                            <Users size={20} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-[#37286A] leading-none">{stats.total}</span>
                            <p className="text-[16px] font-bold text-[#7066A9]">CM ทั้งหมด</p>
                        </div>
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl border border-green-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center cursor-pointer active:scale-95 transition-transform" onClick={() => { if (!statsDrag.hasMoved.current) setDrilldown({ type: 'status', filter: 'active', label: 'ปฏิบัติงาน' }); }}>
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-[#37286A] leading-none">{stats.active}</span>
                            <p className="text-[16px] font-bold text-[#7066A9]">ปฏิัติงาน</p>
                        </div>
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl border border-blue-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Baby size={20} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-[#37286A] leading-none">{stats.totalPatients}</span>
                            <p className="text-[16px] font-bold text-[#7066A9]">ผู้ป่วยในระบบ</p>
                        </div>
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3 min-w-[160px] shrink-0 snap-center">
                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Building2 size={20} />
                        </div>
                        <div>
                            <span className="text-2xl font-black text-[#37286A] leading-none">{stats.totalHospitals}</span>
                            <p className="text-[16px] font-bold text-[#7066A9]">โรงพยาบาล</p>
                        </div>
                    </div>
                </div>

                {/* --- แดชบอร์ด: สถิติสถานะ Pie Chart (standalone, no drilldown) --- */}
                <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden">
                    <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                        <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                            <PieChartIcon className="text-[#7066A9]" size={13} /> สถานะ CM
                        </h3>
                    </div>
                    <div className="p-4 flex flex-col items-center gap-4">
                        <div className="w-[160px] h-[160px] relative shrink-0" style={{ minWidth: 160, minHeight: 160 }}>
                            {isMounted && (
                                <PieChart width={160} height={160}>
                                    <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                                        {statusChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[22px] font-black text-[#37286A]">{stats.total}</span>
                                <span className="text-[12px] text-[#7066A9]">คน</span>
                            </div>
                        </div>
                        <div className="w-full space-y-2.5">
                            {statusChartData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-[16px] font-bold text-[#5e5873]">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[16px] font-black text-[#37286A]">{item.value}</span>
                                        <span className="text-[14px] text-[#7066A9]">({stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* --- ข้อมูล CM (drag-scrollable) --- */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 uppercase tracking-wider">
                            <Activity className="text-[#7066A9]" size={14} /> ข้อมูล CM
                        </h3>
                        <div className="flex items-center gap-1">
                            <button onClick={() => scrollDashboard('left')} className="w-7 h-7 rounded-full bg-white border border-[#E3E0F0] flex items-center justify-center text-[#7066A9] hover:bg-[#F4F0FF] transition-colors shadow-sm">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={() => scrollDashboard('right')} className="w-7 h-7 rounded-full bg-white border border-[#E3E0F0] flex items-center justify-center text-[#7066A9] hover:bg-[#F4F0FF] transition-colors shadow-sm">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={chartsDrag.ref}
                        {...chartsDrag.handlers}
                        className="flex gap-4 overflow-x-auto pb-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
                    >
                        {/* Card A: ทีมงาน/หน่วยบริการ (Service Units) */}
                        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
                            <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                                    <Users className="text-[#7066A9]" size={13} /> หน่วยที่อยู่ในสังกัด
                                </h3>
                                <span className="text-[16px] font-bold text-white bg-[#49358E] px-1.5 py-0.5 rounded-full">{serviceUnits.length} แห่ง</span>
                            </div>
                            <div className="p-3 space-y-2.5 flex-1">
                                {serviceUnits.slice(0, 2).map((unit) => (
                                    <div key={unit.name} className="p-2.5 rounded-lg bg-[#FAFAFE] border border-[#E3E0F0]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-lg bg-[#F4F0FF] flex items-center justify-center shrink-0">
                                                <Building2 size={12} className="text-[#7066A9]" />
                                            </div>
                                            <span className="font-bold text-[#37286A] text-[14px] truncate">{unit.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span className="bg-[#EDE9FF] text-[#5B4FCC] text-[12px] font-bold px-2 py-0.5 rounded-full">{unit.caseCount} เคส</span>
                                                <span className="bg-[#E0FBFC] text-[#00B8D4] text-[12px] font-bold px-2 py-0.5 rounded-full">{unit.patientCount} ผู้ป่วย</span>
                                            </div>
                                            <span className="text-[#9E9E9E] text-[12px] shrink-0">{unit.parentHospital}</span>
                                        </div>
                                    </div>
                                ))}
                                {serviceUnits.length > 2 && (
                                    <div className="text-center text-[#7066A9] text-[14px] font-medium pt-1">+{serviceUnits.length - 2} หน่วยเพิ่มเติม</div>
                                )}
                                {/* Summary */}
                                <div className="pt-2 mt-1 border-t border-[#F4F0FF] flex items-center justify-between px-1">
                                    <span className="text-[16px] text-[#7066A9]">เคสรวม</span>
                                    <span className="text-[16px] font-black text-[#49358E]">{totalServiceCases} เคส</span>
                                </div>
                            </div>
                            {/* ดูรายละเอียด button */}
                            <div className="px-3 pb-3 pt-1 mt-auto">
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (!chartsDrag.hasMoved.current) setCurrentView('list'); }}
                                    className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                                >
                                    <Eye size={16} />
                                    ดูรายละเอียด
                                </button>
                            </div>
                        </Card>

                        {/* Card B: Workload Alert */}
                        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
                            <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                                    <AlertCircle className={overloadedCMs.length > 0 ? "text-[#EA5455]" : "text-[#7066A9]"} size={13} /> Workload Alert
                                </h3>
                                {overloadedCMs.length > 0 && (
                                    <span className="text-[16px] font-bold text-[#EA5455] bg-[#FCEAEA] px-1.5 py-0.5 rounded-full">{overloadedCMs.length} คน</span>
                                )}
                            </div>
                            <div className="p-3 space-y-2 flex-1">
                                {overloadedCMs.length > 0 ? (
                                    overloadedCMs.map(cm => (
                                        <div
                                            key={cm.id}
                                            className="flex items-center gap-2 py-2 px-2.5 rounded-lg bg-amber-50/50 border border-amber-100 cursor-pointer active:scale-[0.98] transition-all"
                                            onClick={() => { if (!chartsDrag.hasMoved.current) handleSelectCM(cm); }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[16px] font-bold text-[#37286A] truncate">{cm.name}</p>
                                                <p className="text-[16px] text-[#EA5455]">{cm.patientCount} ผู้ป่วย | {cm.hospitals.length} รพ.</p>
                                            </div>
                                            <ChevronRight size={14} className="text-[#7066A9]" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-[#7066A9]">
                                        <CheckCircle className="w-8 h-8 mx-auto mb-1 opacity-20" />
                                        <p className="text-[16px]">ภาระงานปกติ</p>
                                    </div>
                                )}
                            </div>
                            {/* ดูรายละเอียด button */}
                            <div className="px-3 pb-3 pt-1 mt-auto">
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'workload' }); }}
                                    className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                                >
                                    <Eye size={16} />
                                    ดูรายละเอียด
                                </button>
                            </div>
                        </Card>

                        {/* Card C: Top Performers */}
                        <Card className="border-[#E3E0F0] shadow-sm bg-white rounded-xl overflow-hidden min-w-[300px] w-[85vw] max-w-[360px] shrink-0 snap-center flex flex-col">
                            <div className="p-3 border-b border-[#F4F0FF] flex items-center justify-between">
                                <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-1.5 uppercase tracking-wider">
                                    <TrendingUp className="text-[#7066A9]" size={13} /> CM ดูแลมากที่สุด
                                </h3>
                            </div>
                            <div className="p-3 space-y-2 flex-1">
                                {topCMs.map((cm, i) => (
                                    <div
                                        key={cm.id}
                                        className="flex items-center gap-2 py-2 px-2.5 rounded-lg bg-[#F4F0FF]/40 border border-[#E3E0F0] cursor-pointer active:scale-[0.98] transition-all"
                                        onClick={() => { if (!chartsDrag.hasMoved.current) handleSelectCM(cm); }}
                                    >
                                        <span className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-[16px] font-bold shrink-0",
                                            i === 0 ? "bg-[#49358E] text-white" : i === 1 ? "bg-[#7066A9] text-white" : "bg-[#D2CEE7] text-[#49358E]"
                                        )}>{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[16px] font-bold text-[#37286A] truncate">{cm.name}</p>
                                            <p className="text-[16px] text-[#7066A9]">{cm.hospitals.length} รพ.</p>
                                        </div>
                                        <span className="text-[16px] font-black text-[#49358E]">{cm.patientCount}</span>
                                    </div>
                                ))}
                            </div>
                            {/* ดูรายละเอียด button */}
                            <div className="px-3 pb-3 pt-1 mt-auto">
                                <button
                                    onClick={(e) => { e.stopPropagation(); if (!chartsDrag.hasMoved.current) setDrilldown({ type: 'topPerformers' }); }}
                                    className="w-full h-[42px] bg-[#F4F0FF] hover:bg-[#E3E0F0] text-[#49358E] rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] active:scale-[0.97] transition-all border border-[#E3E0F0]"
                                >
                                    <Eye size={16} />
                                    ดูรายละเอียด
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Scroll dots indicator */}
                    <div className="flex justify-center gap-1.5 mt-2">
                        {[0, 1, 2].map(i => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#D2CEE7]"></div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}