import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";
import { 
  Plus, 
  Search, 
  FileText,
  User,
  ArrowRight,
  ChevronLeft,
  Filter,
  Building2,
  Hospital,
  Send
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import { ReferralRequestForm } from "./forms/ReferralRequestForm";
import { REFERRAL_DATA } from "../../../../data/patientData";
import { ReferralDetail } from "../patient/History/ReferralDetail";
import { SystemFilterDrawer, GenericFilterState, FilterTabConfig } from "../../../../components/shared/SystemFilterDrawer";
import { CalendarFilterButton, DateFilterLabel, DEFAULT_FILTER_DATE, formatThaiDateWithDay } from "../../../../components/shared/ThaiCalendarDrawer";

export default function ReferralDashboard({ onBack, onRequestReferral, initialHN, onExit, onNavigateToPatient, readOnly }: { onBack?: () => void, onRequestReferral?: () => void, initialHN?: string, onExit?: () => void, onNavigateToPatient?: (patientHn: string) => void, readOnly?: boolean }) {
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // Keeping this for backward compatibility if needed, but we will use new filter
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [view, setView] = useState<'list' | 'detail'>('list');
  const [referralType, setReferralType] = useState<'Refer Out' | 'Refer In' | 'History'>('Refer Out');
  const [historyType, setHistoryType] = useState<'All' | 'Refer In' | 'Refer Out'>('All');
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [drawerFilters, setDrawerFilters] = useState<GenericFilterState>({ sourceHospital: [], destHospital: [] });
  const [filterDate, setFilterDate] = useState<Date>(DEFAULT_FILTER_DATE);

  // Use Centralized Data (declared early so useMemo can reference it)
  const [referrals, setReferrals] = useState<any[]>(REFERRAL_DATA);

  // Drag-to-scroll for Status Pills
  const statusScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingStatus = useRef(false);
  const startXStatus = useRef(0);
  const scrollLeftStatus = useRef(0);
  const hasDraggedStatus = useRef(false);
  const handleStatusMouseDown = useCallback((e: React.MouseEvent) => { isDraggingStatus.current = true; hasDraggedStatus.current = false; startXStatus.current = e.pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeftStatus.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const handleStatusMouseMove = useCallback((e: React.MouseEvent) => { if (!isDraggingStatus.current || !statusScrollRef.current) return; e.preventDefault(); const x = e.pageX - (statusScrollRef.current.offsetLeft || 0); const walk = x - startXStatus.current; if (Math.abs(walk) > 3) hasDraggedStatus.current = true; statusScrollRef.current.scrollLeft = scrollLeftStatus.current - walk * 1.5; }, []);
  const handleStatusMouseUp = useCallback(() => { isDraggingStatus.current = false; }, []);
  const handleStatusTouchStart = useCallback((e: React.TouchEvent) => { isDraggingStatus.current = true; hasDraggedStatus.current = false; startXStatus.current = e.touches[0].pageX - (statusScrollRef.current?.offsetLeft || 0); scrollLeftStatus.current = statusScrollRef.current?.scrollLeft || 0; }, []);
  const handleStatusTouchMove = useCallback((e: React.TouchEvent) => { if (!isDraggingStatus.current || !statusScrollRef.current) return; const x = e.touches[0].pageX - (statusScrollRef.current.offsetLeft || 0); const walk = x - startXStatus.current; if (Math.abs(walk) > 3) hasDraggedStatus.current = true; statusScrollRef.current.scrollLeft = scrollLeftStatus.current - walk * 1.5; }, []);

  const STATUS_PILLS = [
    { id: 'All', label: 'ทั้งหมด', color: 'bg-slate-100 text-slate-600', activeColor: 'bg-[#7367f0] text-white shadow-md shadow-indigo-200' },
    { id: 'Pending', label: 'รอตอบรับ', color: 'bg-blue-50 text-blue-600 border border-blue-200', activeColor: 'bg-blue-500 text-white shadow-md shadow-blue-200' },
    { id: 'Accepted', label: 'รอรับตัว', color: 'bg-orange-50 text-orange-600 border border-orange-200', activeColor: 'bg-orange-500 text-white shadow-md shadow-orange-200' },
    { id: 'Rejected', label: 'ปฏิเสธ', color: 'bg-red-50 text-red-600 border border-red-200', activeColor: 'bg-red-500 text-white shadow-md shadow-red-200' },
    { id: 'Examined', label: 'ตรวจแล้ว', color: 'bg-teal-50 text-teal-600 border border-teal-200', activeColor: 'bg-teal-500 text-white shadow-md shadow-teal-200' },
    { id: 'Treated', label: 'รักษาแล้ว', color: 'bg-green-50 text-green-600 border border-green-200', activeColor: 'bg-green-500 text-white shadow-md shadow-green-200' },
  ];

  // Helper: get hospital description from name
  const getHospitalDesc = (name: string): string => {
    if (name.includes('รพ.สต.')) return 'โรงพยาบาลส่งเสริมสุขภาพตำบล';
    if (name.includes('มหาราช')) return 'โรงพยาบาลมหาวิทยาลัย';
    if (name.includes('เอกชน')) return 'โรงพยาบาลเอกชน';
    if (name.includes('ศูนย์') || name.includes('นครพิงค์') || name.includes('ประชานุเคราะห์')) return 'โรงพยาบาลศูนย์';
    if (name.includes('ฝาง')) return 'โรงพยาบาลชุมชน อ.ฝาง';
    if (name.includes('ลำปาง')) return 'โรงพยาบาลศูนย์ลำปาง';
    return 'โรงพยาบาล';
  };

  // Dynamic filter options from mock data
  const REFERRAL_FILTER_TABS: FilterTabConfig[] = useMemo(() => {
    const sourceSet = new Set<string>();
    const destSet = new Set<string>();
    referrals.forEach(r => {
      const src = r.hospital || r.sourceHospital;
      const dst = r.destinationHospital || r.destination;
      if (src) sourceSet.add(src);
      if (dst) destSet.add(dst);
    });

    const sourceOptions = Array.from(sourceSet).map((name, i) => ({
      id: `src-${i}`,
      label: name,
      description: getHospitalDesc(name),
      icon: name.includes('รพ.สต.') 
        ? <Building2 className="w-4 h-4 text-green-500" />
        : <Hospital className="w-4 h-4 text-blue-500" />,
    }));

    const destOptions = Array.from(destSet).map((name, i) => ({
      id: `dst-${i}`,
      label: name,
      description: getHospitalDesc(name),
      icon: name.includes('รพ.สต.') 
        ? <Building2 className="w-4 h-4 text-green-500" />
        : <Hospital className="w-4 h-4 text-purple-500" />,
    }));

    return [
      { key: 'sourceHospital', label: 'ต้นทาง', type: 'list' as const, searchPlaceholder: 'ค้นหาโรงพยาบาลต้นทาง...', options: sourceOptions, emptyText: 'ไม่พบโรงพยาบาล', emptyIcon: <Hospital className="w-10 h-10 mb-2 opacity-30" /> },
      { key: 'destHospital', label: 'ปลายทาง', type: 'list' as const, searchPlaceholder: 'ค้นหาโรงพยาบาลปลายทาง...', options: destOptions, emptyText: 'ไม่พบโรงพยาบาล', emptyIcon: <Hospital className="w-10 h-10 mb-2 opacity-30" /> },
    ];
  }, [referrals]);

  const FILTER_OPTIONS = [
    { id: 'All', label: 'ทั้งหมด' },
    { id: 'Pending', label: 'รอตอบรับ' },
    { id: 'Rejected', label: 'ปฏิเสธ' },
    { id: 'Accepted', label: 'รอรับตัว' }
  ];

  const handleFilterSelect = (status: string) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
  };

  // Effect to handle initialHN
  React.useEffect(() => {
    if (initialHN) {
      // Defer to next tick to ensure referrals state is initialized (though it is sync here)
      const found = referrals.find(r => r.hn === initialHN || r.patientHn === initialHN);
      if (found) {
        setSelectedReferral(found);
        setView('detail');
      }
    }
  }, [initialHN, referrals]);

  const handleReject = (id: number, reason?: string) => {
      const updatedReferrals = referrals.map(r => {
          if (r.id === id) {
              return {
                  ...r,
                  status: 'Rejected',
                  logs: [
                      ...(r.logs || []),
                      {
                          status: 'Rejected',
                          date: new Date().toISOString(),
                          description: reason ? `ปฏิเสธ: ${reason}` : 'ปฏิเสธคำขอ',
                          actor: 'เจ้าหน้าที่'
                      }
                  ]
              };
          }
          return r;
      });

      setReferrals(updatedReferrals);
      
      // Update selected referral to reflect changes in UI immediately
      const updatedItem = updatedReferrals.find(r => r.id === id);
      if (updatedItem) {
          setSelectedReferral(updatedItem);
      }

      toast.error("ปฏิเสธคำขอส่งตัวเรียบร้อยแล้ว");
  };

  const handleDeleteReferral = (id: number) => {
      // Remove from local state
      const updatedReferrals = referrals.filter(r => r.id !== id);
      setReferrals(updatedReferrals);

      // Remove from global data (to sync across app)
      const index = REFERRAL_DATA.findIndex(r => r.id === id);
      if (index !== -1) {
          REFERRAL_DATA.splice(index, 1);
      }

      toast.success("ยกเลิกคำขอส่งตัวเรียบร้อยแล้ว");
      setView('list');
      setSelectedReferral(null);
  };

  const handleAccept = (id: number, date?: Date, details?: string) => {
      // Helper to format date as Local ISO string (YYYY-MM-DDTHH:mm:ss.sss)
      // This ensures AppointmentSystem list view parses the time correctly without timezone shifts
      const formatLocalISO = (d: Date) => {
          const tzOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
          return new Date(d.getTime() - tzOffset).toISOString().slice(0, -1);
      };

      const dateStr = date ? formatLocalISO(date) : formatLocalISO(new Date());

      // Update global data for synchronization with AppointmentSystem
      const globalRef = REFERRAL_DATA.find(r => r.id === id);
      if (globalRef) {
          globalRef.status = 'Accepted';
          globalRef.acceptedDate = dateStr;
          globalRef.acceptedReason = details || '';
          // Ensure we preserve other fields
      }

      setReferrals(prev => prev.map(r => {
          if (r.id === id) {
              return {
                  ...r,
                  status: 'Accepted',
                  acceptedDate: dateStr,
                  acceptedReason: details || '',
                  logs: [
                      ...(r.logs || []),
                      {
                          status: 'Accepted',
                          date: dateStr,
                          description: details ? `ตอบรับ: ${details}` : 'ตอบรับการส่งตัว',
                          actor: 'เจ้าหน้าที่รับส่งตัว'
                      }
                  ]
              };
          }
          return r;
      }));
      toast.success("ยอมรับการส่งตัวเรียบร้อยแล้ว");
      setView('list');
      setSelectedReferral(null);
  };
  
  const handleCreateReferral = (data: any) => {
        const newReferral = {
            id: Date.now(),
            patientName: data.patientData?.name || data.patient,
            patientHn: data.patientData?.hn || "N/A",
            hn: data.patientData?.hn || "N/A",
            hospital: data.fromHospital,
            destinationHospital: data.toHospital,
            destination: data.toHospital,
            status: "Pending", // Default status
            type: "Refer Out",
            creatorRole: "CM", // Mark as created by CM
            referralDate: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
            title: data.diagnosis || "ส่งต่อผู้ป่วย",
            diagnosis: data.diagnosis,
            reason: data.reason,
            doctor: "แพทย์เจ้าของไข้", // Placeholder
            image: data.patientData?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
        };

        // Add to local state
        setReferrals(prev => [newReferral, ...prev]);
        
        // Add to global data source to sync with other components
        REFERRAL_DATA.unshift(newReferral);

        // Ensure we switch to "Refer Out" tab so the user sees their new request
        setReferralType('Refer Out');
        setFilterStatus('All'); // Reset filter to show all
        setView('list');

        toast.success("สร้างใบส่งตัวเรียบร้อยแล้ว");
        setShowReferralForm(false);
  };

  const filtered = useMemo(() => referrals.filter(r => {
    const matchesSearch = (r.patientName || '').includes(searchTerm) || (r.hn || '').includes(searchTerm);
    // Combined status filter: standard status check AND new filter menu check
    const matchesStatus = (statusFilter === 'all' || r.status === statusFilter) && 
                          (filterStatus === 'All' || r.status === filterStatus);
    
    // Drawer filter: source & destination hospital
    const srcFilters = Array.isArray(drawerFilters.sourceHospital) ? drawerFilters.sourceHospital as string[] : [];
    const dstFilters = Array.isArray(drawerFilters.destHospital) ? drawerFilters.destHospital as string[] : [];
    const matchesSource = srcFilters.length === 0 || srcFilters.some(h => (r.hospital || r.sourceHospital || '').includes(h));
    const matchesDest = dstFilters.length === 0 || dstFilters.some(h => (r.destinationHospital || r.destination || '').includes(h));

    // UX/UI Logic: Status Lifecycle Definition
    // Active: Work in progress (Sender/Receiver)
    const activeStatuses = ['Pending', 'Accepted', 'NotTreated', 'Waiting', 'Arrived', 'Treating', 'pending', 'accepted', 'referred'];
    // Terminal: Completed work or Cancelled/Rejected (History)
    const terminalStatuses = ['Treated', 'Rejected', 'Completed', 'Cancelled', 'NoShow', 'treated', 'rejected', 'completed', 'cancelled'];

    let matchesType = false;
    if (referralType === 'History') {
        // History Menu: Show ALL statuses (matched with HomeVisit pattern)
        matchesType = true;
        
        // Apply Sub-filter for History (All / Refer Out / Refer In)
        if (historyType !== 'All') {
            matchesType = r.type === historyType;
        }
    } else {
        // Operational Menu (Refer Out / Refer In): Show only Active states
        matchesType = r.type === referralType && activeStatuses.includes(r.status);
    }
    
    // Role Isolation Logic
    // Only show referrals created by CM or relevant to CM
    // For "Refer Out", we generally only see what WE sent (creatorRole === 'CM')
    // For legacy data (undefined creatorRole), we assume it's CM unless it's explicitly PCU
    if (referralType === 'Refer Out') {
        const isCreatedByCM = r.creatorRole === 'CM' || (!r.creatorRole && !r.hospital?.includes('รพ.สต.'));
        matchesType = matchesType && isCreatedByCM;
    }

    return matchesSearch && matchesStatus && matchesType && matchesSource && matchesDest;
  }), [referrals, searchTerm, statusFilter, filterStatus, referralType, historyType, drawerFilters]);

  const renderReferralCard = (referral: any) => (
    <div 
        key={referral.id} 
        onClick={() => {
            setSelectedReferral(referral);
            setView('detail');
        }}
        className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
         <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex flex-col">
                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                            {referral.patientName}
                        </h3>
                        <span className="font-['IBM_Plex_Sans_Thai'] font-normal text-[#6a7282] text-[14px] leading-[20px] mt-0.5">
                            HN:{referral.hn || referral.patientHn}
                        </span>
                    </div>

                </div>

                {(referral.status === 'Pending' || referral.status === 'pending') && (
                    <div className="bg-blue-50 px-2 py-0.5 rounded-lg">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-blue-600 text-[12px]">รอการตอบรับ</span>
                    </div>
                )}
                {referral.status === 'Accepted' && (
                    <div className="bg-orange-50 px-2 py-0.5 rounded-lg">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-orange-600 text-[12px]">รอรับตัว</span>
                    </div>
                )}
                {referral.status === 'Rejected' && (
                    <div className="bg-red-50 px-2 py-0.5 rounded-lg">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-red-500 text-[12px]">ปฏิเสธ</span>
                    </div>
                )}
                {(referral.status === 'Treated' || referral.status === 'treated') && (
                    <div className="bg-emerald-50 px-2 py-0.5 rounded-lg">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-emerald-600 text-[12px]">รักษาแล้ว</span>
                    </div>
                )}
                {referral.status === 'Examined' && (
                    <div className="bg-teal-50 px-2 py-0.5 rounded-lg">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-teal-600 text-[12px]">ตรวจแล้ว</span>
                    </div>
                )}
                {referral.status === 'WaitingReceive' && (
                    <div className="bg-orange-50 px-2 py-0.5 rounded-lg">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-orange-600 text-[12px]">รอรับตัว</span>
                    </div>
                )}
                {!['Pending', 'pending', 'Accepted', 'Rejected', 'Treated', 'treated', 'Examined', 'WaitingReceive'].includes(referral.status) && (
                     <div className="bg-slate-100 px-2 py-0.5 rounded-lg">
                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-slate-600 text-[12px]">{referral.status === 'NotTreated' ? 'รอตรวจ' : referral.status}</span>
                     </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                 <span className="text-xs text-slate-500 truncate max-w-[40%] text-[16px]">
                    {referral.type === 'Refer Out' && referral.hospital?.includes('รพ.สต.') ? 'รพ.ฝาง' : referral.hospital?.replace('โรงพยาบาล', 'รพ.')}
                 </span>
                 <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                 <span className="text-xs text-[#7367f0] font-medium line-clamp-2 max-w-[40%] text-[16px]">
                    {referral.destinationHospital?.replace('โรงพยาบาล', 'รพ.') || referral.destination?.replace('โรงพยาบาล', 'รพ.') || '-'}
                 </span>
            </div>

            <div className="flex justify-end items-center pt-2 mt-1 border-t border-slate-100">
                <span className="text-xs text-slate-400 text-[13px]">
                    {referral.referralDate ? new Date(referral.referralDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}
                </span>
            </div>
         </div>
    </div>
  );

  const renderListView = () => (
    <>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
             {/* Top Row: Search */}
             <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                            placeholder="ค้นหาชื่อ, เลขที่, HN..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 border-slate-200 bg-slate-50 focus:bg-white transition-all rounded-xl w-full"
                        />
                    </div>
                    
                    {/* Filter Button */}
                    <SystemFilterDrawer
                      tabs={REFERRAL_FILTER_TABS}
                      filters={drawerFilters}
                      onApply={setDrawerFilters}
                      title="ตัวกรอง (Filter)"
                      description="กรองรายการส่งตัว"
                      trigger={
                        <button className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center transition-colors shrink-0 shadow-sm relative",
                          (drawerFilters.sourceHospital.length > 0 || drawerFilters.destHospital.length > 0)
                            ? "bg-[#7367f0] text-white border border-[#7367f0] hover:bg-[#685dd8]"
                            : "bg-white border border-gray-200 text-slate-500 hover:bg-slate-50"
                        )}>
                          <Filter className="w-5 h-5" />
                        </button>
                      }
                    />
                    <CalendarFilterButton filterDate={filterDate} onDateSelect={setFilterDate} accentColor="#ff6d00" drawerTitle="กรองวันที่" />
                </div>
             </div>

             {/* Toggle Menu */}
             <div className="bg-[#f1f5f9] p-1 rounded-[10px] flex items-center">
                <button 
                    onClick={() => setReferralType('Refer In')}
                    className={cn(
                        "flex-1 h-[36px] font-semibold text-[16px] rounded-[8px] transition-all relative",
                        referralType === 'Refer In' 
                            ? "bg-white text-[#7367f0] shadow-sm" 
                            : "text-[#6a7282] hover:text-[#4b5563]"
                    )}
                >
                    รับตัว
                    {REFERRAL_DATA.filter(r => r.type === 'Refer In' && (r.status === 'Pending' || r.status === 'pending')).length > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm z-10">
                            {REFERRAL_DATA.filter(r => r.type === 'Refer In' && (r.status === 'Pending' || r.status === 'pending')).length}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => setReferralType('Refer Out')}
                    className={cn(
                        "flex-1 h-[36px] font-semibold text-[16px] rounded-[8px] transition-all",
                        referralType === 'Refer Out' 
                            ? "bg-white text-[#7367f0] shadow-sm" 
                            : "text-[#6a7282] hover:text-[#4b5563]"
                    )}
                >
                    ส่งตัว
                </button>
                <button 
                    onClick={() => setReferralType('History')}
                    className={cn(
                        "flex-1 h-[36px] font-semibold text-[16px] rounded-[8px] transition-all",
                        referralType === 'History' 
                            ? "bg-white text-[#7367f0] shadow-sm" 
                            : "text-[#6a7282] hover:text-[#4b5563]"
                    )}
                >
                    ประวัติ
                </button>
             </div>

             {referralType === 'History' && (
                <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-top-1 duration-200 w-full">
                    <button 
                        onClick={() => setHistoryType('Refer In')}
                        className={cn(
                            "flex-1 px-3 py-1 text-[14px] rounded-full border transition-all text-center",
                            historyType === 'Refer In' 
                                ? "bg-[#7066a9] text-white border-[#7066a9]" 
                                : "bg-white text-gray-600 border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        ประวัติรับตัว
                    </button>
                    <button 
                        onClick={() => setHistoryType('Refer Out')}
                        className={cn(
                            "flex-1 px-3 py-1 text-[14px] rounded-full border transition-all text-center",
                            historyType === 'Refer Out' 
                                ? "bg-[#7066a9] text-white border-[#7066a9]" 
                                : "bg-white text-gray-600 border-slate-200 hover:bg-slate-50"
                        )}
                    >
                        ประวัติส่งตัว
                    </button>
                </div>
             )}

             <Separator className="bg-slate-100" />
          </div>

          {/* Status Pills */}
          <div className="flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1" ref={statusScrollRef} onMouseDown={handleStatusMouseDown} onMouseMove={handleStatusMouseMove} onMouseUp={handleStatusMouseUp} onMouseLeave={handleStatusMouseUp} onTouchStart={handleStatusTouchStart} onTouchMove={handleStatusTouchMove} onTouchEnd={handleStatusMouseUp}>
            {STATUS_PILLS.map((option) => (
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

          {/* Date Label */}
          {referralType !== 'History' && <DateFilterLabel filterDate={filterDate} />}

          {/* Data Display */}
          <div className="min-h-[300px]">
             {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <FileText className="h-8 w-8 text-gray-300" />
                    </div>
                    <p>ไม่พบข้อมูลรายการส่งตัว</p>
                </div>
             ) : (
                <div className="space-y-3 pb-24">
                    {referralType === 'History' ? (
                      // Group by date for history (matched with HomeVisit pattern)
                      (() => {
                        const groups: { date: string; label: string; items: typeof filtered }[] = [];
                        const map = new Map<string, typeof filtered>();
                        filtered.forEach(item => {
                          const dateKey = item.referralDate ? item.referralDate.split('T')[0] : item.date || 'unknown';
                          if (!map.has(dateKey)) map.set(dateKey, []);
                          map.get(dateKey)!.push(item);
                        });
                        const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
                        sortedKeys.forEach(dateKey => {
                          let label = dateKey;
                          if (dateKey.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            const d = new Date(dateKey + 'T00:00:00');
                            label = formatThaiDateWithDay(d);
                          }
                          groups.push({ date: dateKey, label, items: map.get(dateKey)! });
                        });
                        return groups.map(group => (
                          <div key={group.date} className="space-y-3">
                            <div className="flex items-center gap-3 px-1 py-1">
                              <div className="h-px flex-1 bg-gray-200" />
                              <span className="text-[15px] text-[#b4b7bd] whitespace-nowrap">{group.label}</span>
                              <div className="h-px flex-1 bg-gray-200" />
                            </div>
                            {group.items.map(renderReferralCard)}
                          </div>
                        ));
                      })()
                    ) : (
                      filtered.map(renderReferralCard)
                    )}
                </div>
             )}
          </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 font-['IBM_Plex_Sans_Thai'] relative">
      {/* Sticky Header Container */}
      <div className="sticky top-0 z-30 bg-[#7066a9] shadow-md">
        {/* Navigation Bar */}
        <div className="h-[64px] px-4 flex items-center gap-3">
            {onBack && (
                <button onClick={onBack} className="text-white p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
                    <ChevronLeft size={24} />
                </button>
            )}
            <h1 className="text-white text-xl font-bold flex items-center gap-2">
               ระบบส่งตัว (Referral)
            </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {view === 'list' && renderListView()}
      </div>



      {view === 'detail' && selectedReferral && (
        <ReferralDetail 
            referral={{
                ...selectedReferral,
                date: selectedReferral.referralDate ? new Date(selectedReferral.referralDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-',
                from: selectedReferral.type === 'Refer Out' && selectedReferral.hospital?.includes('รพ.สต.') ? 'รพ.ฝาง' : selectedReferral.hospital?.replace('โรงพยาบาล', 'รพ.') || 'รพ.ต้นทาง',
                to: selectedReferral.destinationHospital?.replace('โรงพยาบาล', 'รพ.') || selectedReferral.destination?.replace('โรงพยาบาล', 'รพ.') || 'รพ.ปลายทาง',
                doctor: selectedReferral.doctor || '-',
                title: selectedReferral.title || selectedReferral.diagnosis || 'ส่งต่อผู้ป่วย',
                reason: selectedReferral.reason || '-',
                referralNo: selectedReferral.referralNo || `REF-${new Date().getFullYear()}-${selectedReferral.id}`
            }}
            patient={{
                name: selectedReferral.patientName,
                hn: selectedReferral.hn || selectedReferral.patientHn,
                image: selectedReferral.image
            }}
            onBack={() => setView('list')}
            onAccept={handleAccept}
            onReject={handleReject}
            onDelete={handleDeleteReferral}
            onViewPatient={(hn) => {
                // If callback provided, use it
                if (onNavigateToPatient) {
                    onNavigateToPatient(hn);
                } else {
                    // Fallback log or toast if no navigation handler
                    console.log("Navigate to patient:", hn);
                }
            }}
            readOnly={readOnly}
        />
      )}

      {/* Referral Request Form Dialog/Modal */}
      {showReferralForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden flex flex-col">
                <ReferralRequestForm 
                    onClose={() => setShowReferralForm(false)} 
                    onSubmit={handleCreateReferral}
                />
            </div>
        </div>
      )}
    </div>
  );
}