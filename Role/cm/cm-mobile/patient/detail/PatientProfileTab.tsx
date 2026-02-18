import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
    User, 
    ShieldCheck, 
    Stethoscope, 
    Route, 
    MapPin, 
    Calendar, 
    CheckCircle, 
    Pencil, 
    Save, 
    Users, 
    MessageCircle, 
    Settings, 
    Bookmark, 
    ChevronDown, 
    ChevronRight, 
    ChevronLeft, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    Activity,
    Image as ImageIcon,
    Upload,
    FileText,
    File,
    Download,
    Eye,
    Trash2,
    Plus,
    X,
    Home as HomeIcon,
    ScanLine,
    FlaskConical,
    ClipboardList,
    Camera,
    BarChart3,
    Info
} from 'lucide-react';
import { StatusBarIPhone16Main } from '../../../../../components/shared/layout/TopHeader';

const formatDateThai = (val: string | undefined) => {
    if (!val || val === '-') return '-';
    // Match YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        try {
            const d = new Date(val);
            return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
        } catch (e) {
            return val;
        }
    }
    return val;
};



const InfoField = ({ label, value, className, isEditing, editValue, onChange }: { 
    label: string, 
    value: string | undefined, 
    className?: string,
    isEditing?: boolean,
    editValue?: string,
    onChange?: (val: string) => void
}) => (
    <div className={cn("p-4 bg-slate-50 rounded-xl border border-slate-100", className)}>
        <span className="text-sm text-slate-400 uppercase tracking-wider font-semibold block mb-1 text-[14px]">{label}</span> 
        {isEditing && onChange ? (
            <Input 
                value={editValue || ""} 
                onChange={(e) => onChange(e.target.value)}
                className="h-9 bg-white border-slate-200 mt-1" 
            />
        ) : (
            <span className={cn("text-base font-medium text-slate-800 text-[18px]", !value || value === '-' ? "text-slate-400" : "")}>{formatDateThai(value)}</span>
        )}
    </div>
);
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { cn } from '../../../../../components/ui/utils';
import { toast } from 'sonner';
import FundRequestMobile from '../../funding/forms/FundRequestForm';
import { useRole } from '../../../../../context/RoleContext';
import { MutualFundHistory } from '../../funding/MutualFundHistory';
import { FundingDetail } from '../../funding/FundingDetail';
import StaffChatInterface from '../../chat/StaffChatInterface';
import type { ChatRoom, ChatMessage } from '../../chat/StaffChatInterface';

// Helper: parse age string like "3 เดือน", "9-18 เดือน", "2 ปี" to numeric months for sorting
const parseAgeToMonths = (ageStr: string): number => {
    if (!ageStr || ageStr === '-' || ageStr === 'แรกเกิด') return 0;
    const nums = ageStr.match(/(\d+)/g);
    if (!nums) return 0;
    const firstNum = parseInt(nums[0]);
    if (ageStr.includes('ปี')) return firstNum * 12;
    return firstNum; // treat as months
};

// Helper: format age string to normalized "X ปี Y เดือน" duration (matching EditCarePathway format)
const formatAgeDuration = (ageStr: string): string => {
    if (!ageStr || ageStr === '-') return '-';
    if (ageStr === 'แรกเกิด') return 'แรกเกิด';
    let years = 0, months = 0;
    if (ageStr.includes('ปี')) {
        const parts = ageStr.split('ปี');
        const yMatch = parts[0].trim().match(/(\d+)/);
        if (yMatch) years = parseInt(yMatch[1]);
        if (parts[1] && parts[1].includes('เดือน')) {
            const mMatch = parts[1].trim().match(/(\d+)/);
            if (mMatch) months = parseInt(mMatch[1]);
        }
    } else if (ageStr.includes('เดือน')) {
        const mMatch = ageStr.match(/(\d+)/);
        if (mMatch) months = parseInt(mMatch[1]);
    }
    let result = '';
    if (years > 0) result += `${years} ปี`;
    if (months > 0) result += `${result ? ' ' : ''}${months} เดือน`;
    return result || ageStr;
};

// Extracted Timeline Item Card Component
interface TimelineItemCardProps {
    item: any;
    isOverdue: boolean;
    isCompleted: boolean;
    onClick: () => void;
}

const TimelineItemCard: React.FC<TimelineItemCardProps> = ({ item, isOverdue, isCompleted }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Ensure we have secondary bookings for demo for every card
    const secondaryBookings = item.secondary_bookings || item.secondaryBookings || [
        { date: '10 ม.ค. 67', title: 'ติดตามอาการทั่วไป' },
        { date: '15 ม.ค. 67', title: 'นัดประเมินพัฒนาการ' }
    ]; 

    return (
        <div 
            onClick={() => {
                if (secondaryBookings.length > 0) {
                    setIsExpanded(!isExpanded);
                }
            }}
            className={cn(
                "bg-white p-4 rounded-2xl border transition-all flex flex-col h-auto relative overflow-hidden group cursor-pointer",
                isOverdue ? "border-red-200 shadow-sm shadow-red-50" :
                "border-slate-200 shadow-sm hover:border-blue-200"
            )}
        >
            {/* Header: Age Badge + Status on same row */}
            <div className="mb-2">
                <div className="flex items-center justify-between">
                    <span className={cn(
                        "text-sm font-bold px-3 py-1 rounded-md",
                        isOverdue ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                    )}>
                        {formatAgeDuration(item.age)}
                    </span>
                    {/* Status Badge */}
                    {isCompleted ? (
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md">
                            เสร็จสิ้น
                        </span>
                    ) : isOverdue ? (
                        <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-md">
                            ล่าช้า
                        </span>
                    ) : (
                        <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                            รอดำเนินการ
                        </span>
                    )}
                </div>
            </div>

            {/* Title */}
            <h5 className={cn("font-bold leading-tight mb-2 text-[20px] text-[16px]", isOverdue ? "text-red-700" : "text-slate-800")}>{item.stage}</h5>

            <div className="flex flex-col gap-2">
                {/* วันที่คาดการณ์ (Calculated Date) */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        
                        
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-slate-600 text-[16px]">
                            {(() => {
                                const d = item.estimatedDate || item.date || '-';
                                if (d === '-' || d === 'Completed' || d === 'Pending') return item.estimatedDate || '-';
                                if (d.includes('Auto-calc')) return d.replace('Auto-calc: ', '');
                                return d;
                            })()}
                        </span>
                    </div>
                </div>

                {/* Show More Link */}
                {secondaryBookings.length > 0 && (
                    <div 
                        className="flex items-center gap-1 cursor-pointer w-fit mt-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        <span className="font-bold text-blue-600 hover:text-blue-700 transition-colors text-[16px]">
                            {isExpanded ? 'ซ่อนนัดหมาย' : `ดูนัดหมายเพิ่มเติม (${secondaryBookings.length})`}
                        </span>
                        <ChevronLeft 
                            size={12} 
                            className={cn("text-blue-600 transition-transform duration-200", isExpanded ? "-rotate-90" : "-rotate-180")} 
                        />
                    </div>
                )}

                {/* Secondary_Bookings (Hidden Frame) */}
                {isExpanded && (
                    <div className="flex flex-col gap-2 pl-3 ml-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {secondaryBookings.map((booking: any, idx: number) => {
                            const isAssessment = booking.title?.includes('ประเมิน') || booking.title?.includes('Assessment');
                            const Icon = isAssessment ? Stethoscope : Clock;
                            
                            return (
                                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100 border-dashed">
                                    <Icon size={12} className="text-slate-400" />
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-400">{booking.title || 'ติดตามอาการ (Follow-up)'}</span>
                                        <span className="text-slate-600 font-medium text-[16px]">{booking.date}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

interface PatientProfileTabProps {
    patient: any;
    activeSubTab: string;
    setActiveSubTab: (tab: string) => void;
    isEditingInfo: boolean;
    setIsEditingInfo: (isEditing: boolean) => void;
    editData: any;
    setEditData: (data: any) => void;
    setInfoData: (data: any) => void;
    setIsEditCarePathwayOpen: (isOpen: boolean) => void;
    setSelectedMilestone: (milestone: any) => void;
    readOnly?: boolean;
}

export const PatientProfileTab: React.FC<PatientProfileTabProps> = ({
    patient,
    activeSubTab,
    setActiveSubTab,
    isEditingInfo,
    setIsEditingInfo,
    editData,
    setEditData,
    setInfoData,
    setIsEditCarePathwayOpen,
    setSelectedMilestone,
    readOnly = false
}) => {
    const { currentRole } = useRole();
    const [patientStatus, setPatientStatus] = useState<string>(patient.patientStatusLabel || 'ปกติ');
    const [isFundRequestOpen, setIsFundRequestOpen] = useState(false);
    const [isFundHistoryOpen, setIsFundHistoryOpen] = useState(false);
    const [selectedFundHistoryItem, setSelectedFundHistoryItem] = useState<any | null>(null);
    const [selectedFundIndex, setSelectedFundIndex] = useState(0);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<any | null>(null);
    const [showDirectChat, setShowDirectChat] = useState(false);

    // Build 1:1 ChatRoom for this patient
    const patientChatRoom: ChatRoom = {
        id: `direct-${patient.id || patient.hn}`,
        type: 'direct',
        name: patient.name || 'ผู้ป่วย',
        patientId: patient.hn || patient.id || '',
        patientName: patient.name || 'ผู้ป่วย',
        lastMessage: '',
        lastMessageTime: '',
        unreadCount: 0,
        status: 'online',
    };

    const patientChatMessages: ChatMessage[] = [
        { id: 'dm1', senderId: patient.hn || patient.id || 'p1', senderName: patient.name || 'ผู้ป่วย', senderRole: 'patient', content: 'สวัสดีครับ/ค่ะ อยากสอบถามเรื่องนัดหมายครั้งถัดไปครับ', timestamp: '09:00', type: 'text' },
        { id: 'dm2', senderId: 'scfc', senderName: 'CM เจ้าหน้าที่', senderRole: 'scfc', content: `สวัสดีค่ะ คุณ${(patient.name || '').split(' ').pop() || 'ผู้ป่วย'} มีอะไรให้ช่วยคะ?`, timestamp: '09:05', type: 'text' },
        { id: 'dm3', senderId: patient.hn || patient.id || 'p1', senderName: patient.name || 'ผู้ป่วย', senderRole: 'patient', content: 'อยากทราบว่านัดครั้งถัดไปวันไหนครับ ต้องเตรียมอะไรบ้าง', timestamp: '09:08', type: 'text' },
        { id: 'dm4', senderId: 'scfc', senderName: 'CM เจ้าหน้าที่', senderRole: 'scfc', content: 'รอสักครู่นะคะ กำลังตรวจสอบให้ค่ะ 😊', timestamp: '09:10', type: 'text' },
    ];
    const [documents, setDocuments] = useState([
        { id: '1', name: 'X-Ray ใบหน้า (Pre-op)', category: 'X-Ray', date: '15 มิ.ย. 67', fileType: 'image', size: '2.4 MB', uploadedBy: 'พญ.สมหญิง รักษาดี' },
        { id: '2', name: 'X-Ray Cephalometric', category: 'X-Ray', date: '15 มิ.ย. 67', fileType: 'image', size: '3.1 MB', uploadedBy: 'พญ.สมหญิง รักษาดี' },
        { id: '3', name: 'ผลตรวจเลือด CBC', category: 'ผลตรวจ', date: '10 มิ.ย. 67', fileType: 'pdf', size: '540 KB', uploadedBy: 'นพ.สมชาย ใจดี' },
        { id: '4', name: 'ใบยินยอมผ่าตัด (Consent Form)', category: 'เอกสารยินยอม', date: '20 มิ.ย. 67', fileType: 'pdf', size: '320 KB', uploadedBy: 'CM สมศรี' },
        { id: '5', name: 'รูปถ่ายก่อนผ่าตัด (Front view)', category: 'รูปถ่าย', date: '18 มิ.ย. 67', fileType: 'image', size: '1.8 MB', uploadedBy: 'CM สมศรี' },
        { id: '6', name: 'รูปถ่ายหลังผ่าตัด 3 เดือน', category: 'รูปถ่าย', date: '20 ก.ย. 67', fileType: 'image', size: '2.1 MB', uploadedBy: 'CM สมศรี' },
        { id: '7', name: 'ผลประเมินการพูด (Speech Assessment)', category: 'ผลประเมิน', date: '5 ต.ค. 67', fileType: 'pdf', size: '1.2 MB', uploadedBy: 'นักแก้ไขการพูด' },
        { id: '8', name: 'แบบประเมินพัฒนาการ DSPM', category: 'ผลประเมิน', date: '12 พ.ย. 67', fileType: 'pdf', size: '890 KB', uploadedBy: 'พยาบาล PCU' },
        { id: '9', name: 'บันทึกเยี่ยมบ้านครั้งที่ 1', category: 'เยี่ยมบ้าน', date: '15 มี.ค. 67', fileType: 'pdf', size: '1.5 MB', uploadedBy: 'ทีมเยี่ยมบ้าน รพ.สต.' },
        { id: '10', name: 'บันทึกเยี่ยมบ้านครั้งที่ 2', category: 'เยี่ยมบ้าน', date: '20 เม.ย. 67', fileType: 'pdf', size: '1.3 MB', uploadedBy: 'ทีมเยี่ยมบ้าน รพ.สต.' },
    ]);
    const [docFilter, setDocFilter] = useState<string>('all');
    const [selectedDocCategory, setSelectedDocCategory] = useState<string | null>(null);

    const documentCategories = [
        { id: 'home_visit', label: 'เอกสารผลการเยี่ยมบ้าน', subtitle: 'แตะเพื่อดูรายละเอียดบันทึก', icon: 'home' },
        { id: 'xray', label: 'X-Ray', subtitle: 'ภาพถ่ายรังสี', icon: 'scan' },
        { id: 'lab', label: 'ผลตรวจ', subtitle: 'ผลตรวจเลือด ผลตรวจทางห้องปฏิบัติการ', icon: 'flask' },
        { id: 'consent', label: 'เอกสารยินยอม', subtitle: 'ใบยินยอมผ่าตัด และเอกสารอนุญาต', icon: 'clipboard' },
        { id: 'photo', label: 'รูปถ่ายผู้ป่วย', subtitle: 'รูปถ่ายก่อน-หลังผ่าตัด', icon: 'camera' },
        { id: 'assessment', label: 'ผลประเมิน', subtitle: 'ผลประเมินการพูด พัฒนาการ', icon: 'chart' },
        { id: 'other', label: 'เอกสารอื่นๆ', subtitle: 'เอกสารทั่วไป', icon: 'file' },
    ];

    const getCategoryDocs = (catId: string) => {
        const catMap: Record<string, string> = {
            'xray': 'X-Ray',
            'lab': 'ผลตรวจ',
            'consent': 'เอกสารยินยอม',
            'photo': 'รูปถ่าย',
            'assessment': 'ผลประเมิน',
            'home_visit': 'เยี่ยมบ้าน',
            'other': 'อื่นๆ',
        };
        return documents.filter(d => d.category === catMap[catId]);
    };

    // Filter only approved funds
    const allFunds = patient.funds || [];
    const funds = allFunds.filter((f: any) => f.status?.toLowerCase() === 'approved' || f.status === 'อนุมัติ');
    
    // Ensure index is valid
    const safeIndex = selectedFundIndex >= funds.length ? 0 : selectedFundIndex;
    const currentFund = funds.length > 0 ? funds[safeIndex] : null;

    const subTabs = [
        { id: 'info', label: 'ข้อมูลส่วนตัว' },
        { id: 'diagnosis', label: 'วินิจฉัย' },
        { id: 'rights', label: 'ทุน' },
        { id: 'map', label: 'แผนที่' },
        { id: 'care_pathway', label: 'แผนการรักษา' },
        { id: 'documents', label: 'เอกสาร' }
    ];

    // Full-screen 1:1 Chat with patient (Portal to break out of all ancestor containers)
    const chatOverlay = showDirectChat ? ReactDOM.createPortal(
        <div className="fixed inset-0 bg-white flex flex-col font-['IBM_Plex_Sans_Thai']" style={{ zIndex: 99999 }}>
            <style>{`
                .mobile-bottom-nav { display: none !important; }
                .chat-portal-force .md\\:hidden { display: flex !important; }
            `}</style>
            {/* StatusBar - same as TopHeader */}
            <div className="shrink-0 w-full bg-[#7066a9]">
                <StatusBarIPhone16Main />
            </div>
            <div className="chat-portal-force flex-1 flex flex-col min-h-0">
                <StaffChatInterface 
                    chat={patientChatRoom}
                    messages={patientChatMessages}
                    onClose={() => setShowDirectChat(false)}
                />
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6 max-w-4xl mx-auto">
            {chatOverlay}
            
            {/* Patient Profile Card */}
            <div className="bg-white rounded-[32px] p-4 md:p-6 shadow-sm border border-slate-100 flex flex-row gap-4 md:gap-6 relative overflow-hidden">
                 {/* Decorative Background Blur */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>

                 {/* Image */}
                 <div className="shrink-0">
                     <img 
                        src={patient.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"} 
                        alt={patient.name} 
                        className="w-24 h-32 md:w-32 md:h-40 rounded-2xl object-cover shadow-md border-4 border-white bg-slate-100"
                     />
                 </div>

                 {/* Info */}
                 <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start">
                        <h2 className="text-lg md:text-3xl font-bold text-blue-600 tracking-tight truncate pr-2 text-[20px]">{patient.name}</h2>
                    </div>
                    
                    <div className="space-y-0.5 mt-1">
                        <div className="text-slate-500 text-sm md:text-sm font-medium text-[14px]">เลขประจำตัว : <span className="text-slate-700">{patient.cid || patient.hn}</span></div>
                        <div className="text-slate-500 text-sm md:text-sm text-[14px]">อายุ {patient.age}</div>
                        <div className="text-slate-700 font-medium text-sm md:text-base mt-1 truncate">{patient.diagnosis || 'Cleft Lip - left - microform'}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        
                        {/* Active/Inactive Badge */}
                        <Badge className={cn(
                            "border-none px-2 py-0.5 text-sm md:text-xs rounded-full shadow-sm text-white",
                            patient.status === 'Inactive' 
                                ? "bg-gray-400 hover:bg-gray-500 shadow-gray-200" 
                                : "bg-blue-500 hover:bg-blue-600 shadow-blue-200"
                        )}>
                            {patient.status === 'Inactive' ? 'Inactive' : 'Active'}
                        </Badge>

                        <Badge className={cn(
                            "border-none px-2 py-0.5 text-sm md:text-xs rounded-full shadow-sm text-white",
                            patientStatus === 'ปกติ' ? "bg-emerald-400 hover:bg-emerald-500 shadow-emerald-200" :
                            patientStatus === 'Loss follow up' ? "bg-orange-400 hover:bg-orange-500 shadow-orange-200" :
                            patientStatus === 'รักษาเสร็จสิ้น' ? "bg-blue-400 hover:bg-blue-500 shadow-blue-200" :
                            patientStatus === 'เสียชีวิต' ? "bg-red-400 hover:bg-red-500 shadow-red-200" :
                            patientStatus === 'มารดา' ? "bg-pink-400 hover:bg-pink-500 shadow-pink-200" :
                            "bg-emerald-400 hover:bg-emerald-500 shadow-emerald-200"
                        )}>
                            {patientStatus}
                        </Badge>
                    </div>

                    <div className="h-10 md:h-12" aria-hidden="true" />
                    <div className="absolute bottom-2 md:bottom-4 left-0 right-0 px-4 md:px-6 flex gap-2 z-10">
                        <Button type="button" variant="outline" onClick={() => toast.info('ดูข้อมูลผู้ปกครอง')} className="flex-1 rounded-md h-8 md:h-10 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 bg-white shadow-sm">
                            <Users className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowDirectChat(true)} className="flex-1 rounded-md h-8 md:h-10 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 bg-white shadow-sm">
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                        </Button>

                    </div>
                 </div>
            </div>

            {/* Sub-Menu Pills */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 pb-2">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={cn(
                            "w-full px-2 py-2.5 rounded-full text-[16px] font-medium transition-all duration-200 border whitespace-nowrap flex justify-center items-center",
                            activeSubTab === tab.id 
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" 
                                : "bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:bg-blue-50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 min-h-[400px] relative">
                {activeSubTab === 'info' && (
                    <div className="animate-in fade-in duration-300 relative">
                        <div className="absolute top-0 right-0 z-10">
                            {!readOnly && !isEditingInfo ? (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => {
                                        setEditData(patient);
                                        setIsEditingInfo(true);
                                    }}
                                    className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                >
                                    <Pencil size={20} />
                                </Button>
                            ) : null}
                        </div>

                        {/* 0. Patient Status */}
                        <div className="mb-6">
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                                <label className="text-sm text-slate-400 uppercase tracking-wider font-semibold block mb-2 text-[14px]">สถานะผู้ป่วย</label>
                                {currentRole === 'Patient' ? (
                                    <div
                                        className={cn(
                                            "w-full px-4 py-2.5 rounded-xl text-white font-medium text-[16px]",
                                            patientStatus === 'ปกติ' ? "bg-emerald-400" :
                                            patientStatus === 'Loss follow up' ? "bg-orange-400" :
                                            patientStatus === 'รักษาเสร็จสิ้น' ? "bg-blue-400" :
                                            patientStatus === 'เสียชีวิต' ? "bg-red-400" :
                                            patientStatus === 'มารดา' ? "bg-pink-400" :
                                            "bg-emerald-400"
                                        )}
                                    >
                                        {patientStatus}
                                    </div>
                                ) : (
                                    <select
                                        value={patientStatus}
                                        onChange={(e) => !readOnly && setPatientStatus(e.target.value)}
                                        disabled={readOnly}
                                        className={cn(
                                            "w-full appearance-none px-4 py-2.5 rounded-xl border-none text-white font-medium cursor-pointer outline-none transition-colors text-[16px]",
                                            patientStatus === 'ปกติ' ? "bg-emerald-400" :
                                            patientStatus === 'Loss follow up' ? "bg-orange-400" :
                                            patientStatus === 'รักษาเสร็จสิ้น' ? "bg-blue-400" :
                                            patientStatus === 'เสียชีวิต' ? "bg-red-400" :
                                            patientStatus === 'มารดา' ? "bg-pink-400" :
                                            "bg-emerald-400"
                                        )}
                                        style={{ 
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                            backgroundRepeat: 'no-repeat', 
                                            backgroundPosition: 'right 12px center',
                                            paddingRight: '36px'
                                        }}
                                    >
                                        <option value="ปกติ">ปกติ</option>
                                        <option value="Loss follow up">Loss follow up</option>
                                        <option value="รักษาเสร็จสิ้น">รักษาเสร็จสิ้น</option>
                                        <option value="เสียชีวิต">เสียชีวิต</option>
                                        <option value="มารดา">มารดา</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* 1. Identity & Personal Info */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2 text-[20px]">
                                <User className="text-blue-500" /> ข้อมูลส่วนตัว
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="เลขประจำตัวประชาชน" value={patient.cid} isEditing={isEditingInfo} 
                                    editValue={editData?.cid} onChange={(v) => setEditData({...editData, cid: v})} />
                                <InfoField label="วันเกิด" value={patient.dob} isEditing={isEditingInfo} 
                                    editValue={editData?.dob} onChange={(v) => setEditData({...editData, dob: v})} />
                                <InfoField label="อายุ" value={patient.age} />
                                <InfoField label="เพศ" value="ชาย" /> {/* Mock value if not in patient prop, assume Mock Data has it but prop might not map strictly yet */}
                                <InfoField label="หมู่เลือด" value={patient.bloodGroup} />
                                <InfoField label="เชื้อชาติ" value={patient.race} />
                                <InfoField label="สัญชาติ" value={patient.nationality} />
                                <InfoField label="ศาสนา" value={patient.religion} />
                                <InfoField label="สถานภาพ" value={patient.maritalStatus} />
                                <InfoField label="อาชีพ" value={patient.occupation} />
                            </div>
                        </div>

                        {/* 2. Contact Info */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2 text-[20px]">
                                <MessageCircle className="text-blue-500" /> ข้อมูลการติดต่อ
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="เบอร์โทรศัพท์มือถือ" value={patient.contact?.phone} />
                                <InfoField label="เบอร์โทรศัพท์บ้าน" value={patient.contact?.homePhone} />
                                <InfoField label="อีเมล" value={patient.email} />
                            </div>
                        </div>

                        {/* 2.5 Current Address */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2 text-[20px]">
                                <MapPin className="text-blue-500" /> ที่อยู่ปัจจุบัน
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <InfoField label="บ้านเลขที่" value={patient.addressNo} />
                                <InfoField label="หมู่ที่" value={patient.addressMoo} />
                                <InfoField label="ซอย" value={patient.addressSoi} />
                                <InfoField label="ถนน" value={patient.addressRoad} />
                                <InfoField label="ตำบล" value={patient.addressSubDistrict} />
                                <InfoField label="อำเภอ" value={patient.addressDistrict} />
                                <InfoField label="จังหวัด" value={patient.addressProvince} />
                                <InfoField label="รหัสไปรษณีย์" value={patient.addressPostalCode} />
                            </div>
                        </div>

                        {/* 3. Health Info */}
                         <div className="mb-8">
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2 text-[20px]">
                                <Activity className="text-blue-500" /> ข้อมูลสุขภาพ
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="ประวัติการแพ้อาหาร" value={patient.allergies} className="text-red-600 font-medium" />
                            </div>
                        </div>

                        {/* 4. Rights & Hospital */}
                        <div className="mb-8">
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2 text-[20px]">
                                <ShieldCheck className="text-blue-500" /> สิทธิการรักษาและข้อมูลโรงพยาบาล
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="สิทธิการรักษาหลัก" value={patient.rights} />
                                <InfoField label="สิทธิการรักษาย่อย" value="-" />
                                <InfoField label="หน่วยงานที่รับผิดชอบ" value={patient.hospitalInfo?.responsibleRph || '-'} />
                                <InfoField label="โรงพยาบาลที่รักษา" value={patient.hospital} />
                                <InfoField label="HN" value={patient.hn} />
                                <InfoField label="วันที่เข้ารับการรักษาครั้งแรก" value={patient.hospitalInfo?.firstDate} />
                                {/* <InfoField label="ระยะทาง (กม.)" value={patient.hospitalInfo?.distance} />
                                <InfoField label="ระยะเวลาเดินทาง (นาที)" value={patient.hospitalInfo?.travelTime} /> */}
                            </div>
                        </div>

                        {/* 5. Guardian */}
                        <div className="mb-6">
                            <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2 text-[20px]">
                                <Users className="text-blue-500" /> ข้อมูลผู้ปกครอง
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField label="ชื่อ-นามสกุล" value={patient.contact?.name} isEditing={isEditingInfo} 
                                    editValue={editData?.contact?.name} onChange={(v) => setEditData({...editData, contact: {...editData.contact, name: v}})} />
                                <InfoField label="ความสัมพันธ์" value={patient.contact?.relation} isEditing={isEditingInfo} 
                                    editValue={editData?.contact?.relationship} onChange={(v) => setEditData({...editData, contact: {...editData.contact, relationship: v}})} />
                                <InfoField label="เลขประจำตัวประชาชน" value={patient.contact?.idCard} />
                                <InfoField label="วันเกิด" value={patient.contact?.dob} />
                                <InfoField label="อายุ" value={patient.contact?.age} />
                                <InfoField label="อาชีพ" value={patient.contact?.occupation} />
                                <InfoField label="เบอร์โทรศัพท์" value={patient.contact?.phone} isEditing={isEditingInfo} 
                                    editValue={editData?.contact?.phone} onChange={(v) => setEditData({...editData, contact: {...editData.contact, phone: v}})} />
                                <InfoField label="สถานะ" value={patient.contact?.status} />
                            </div>
                        </div>

                        {isEditingInfo && (
                            <div className="flex justify-center pt-4 pb-2 animate-in slide-in-from-bottom-2 fade-in gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditingInfo(false);
                                        setEditData(null);
                                    }}
                                    className="px-8 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    ยกเลิก
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setInfoData(editData);
                                        toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
                                        setIsEditingInfo(false);
                                    }}
                                    className="bg-[#7066a9] hover:bg-[#5f5690] text-white px-8 rounded-full shadow-lg shadow-purple-200 transition-all active:scale-95"
                                >
                                    <Save size={18} className="mr-2" /> บันทึกข้อมูล
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {activeSubTab === 'diagnosis' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2 text-[20px]">
                            <Stethoscope className="text-blue-500" /> การวินิจฉัยโรค
                        </h3>
                        <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl mb-6">
                            <h4 className="font-bold text-blue-900 mb-2 text-[18px]">Diagnosis List</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm text-[16px]">
                                    Cleft Lip (ปากแหว่ง)
                                </span>
                                <span className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm text-[16px]">
                                    Cleft Palate (เพดานโหว่)
                                </span>
                                <span className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm text-[16px]">
                                    Microform
                                </span>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
                            <h4 className="text-sm font-semibold text-slate-500 mb-2 uppercase">แพทย์เจ้าของไข้</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    <Stethoscope size={20} />
                                </div>
                                <p className="text-lg font-bold text-slate-800">{patient.attendingPhysician}</p>
                            </div>
                        </div>
                        
                    </div>
                )}

                {activeSubTab === 'care_pathway' && (
                    <div className="h-full">
                        <>
                            <div className="mb-6">
                                <h4 className="font-bold text-slate-800 flex items-center mb-4 text-[20px]">
                                    <Route className="text-blue-500 mr-2 w-5 h-5" /> แผนการรักษา
                                </h4>
                                {!readOnly && currentRole?.toLowerCase() !== 'pcu' && (
                                <div className="flex justify-end">
                                    <button 
                                        onClick={() => setIsEditCarePathwayOpen(true)}
                                        className="bg-[#6a5acd] hover:bg-[#5a4db8] text-white font-['IBM_Plex_Sans_Thai'] px-4 py-2 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all active:scale-95 text-[16px]"
                                    >
                                        แก้ไขแผนการรักษา
                                    </button>
                                </div>
                                )}
                            </div>
                            <div className="relative pl-4 space-y-8">
                                {/* Vertical Line */}
                                <div className="absolute left-[23px] top-4 bottom-8 w-[2px] bg-slate-200 z-0"></div>

                                {[...(patient.timeline || [])].sort((a: any, b: any) => parseAgeToMonths(b.age) - parseAgeToMonths(a.age)).map((item: any, index: number) => {
                                    const isOverdue = item.status === 'overdue' || (item.status === 'pending' && item.stage.includes('ฝึกพูด'));
                                    const isCompleted = item.status === 'completed';
                                    
                                    return (
                                        <div key={index} className="relative pl-12 z-10">
                                            {/* Timeline Dot */}
                                            <div className={cn(
                                                "absolute left-3 top-6 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-sm z-20 flex items-center justify-center",
                                                isOverdue ? "bg-red-500 ring-2 ring-red-100" :
                                                isCompleted ? "bg-green-500 ring-2 ring-green-100" :
                                                "bg-blue-500 ring-2 ring-blue-100"
                                            )}>
                                                {isCompleted && <CheckCircle2 size={12} className="text-white" />}
                                                {isOverdue && <AlertCircle size={12} className="text-white" />}
                                            </div>
                                            
                                            {/* Card (Using extracted component) */}
                                            <TimelineItemCard 
                                                item={item}
                                                isOverdue={isOverdue}
                                                isCompleted={isCompleted}
                                                onClick={() => {}} // No-op as requested
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    </div>
                )}

                {activeSubTab === 'rights' && (
                    <div className="animate-in fade-in duration-300 space-y-6">
                        {currentFund ? (
                            <>
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2 text-[20px]">
                                            <ShieldCheck className="w-6 h-6 text-blue-500" /> รายชื่อทุนที่ได้รับ
                                        </h4>
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">อนุมัติ</span>
                                    </div>
                                    <div className="relative py-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex flex-col items-center justify-center gap-0.5">
                                            <span className="text-slate-500 text-sm font-medium text-[16px]">{currentFund.name}</span>
                                            <span className="text-blue-600 font-bold text-3xl">{currentFund.amount?.toLocaleString()} <span className="text-base text-slate-400 font-normal">บาท</span></span>
                                        </div>
                                        {funds.length > 1 && (
                                            <button 
                                                onClick={() => setSelectedFundIndex((prev) => {
                                                    const next = (prev + 1) % funds.length;
                                                    // Ensure we don't go out of bounds if funds changed
                                                    return next;
                                                })}
                                                className="absolute top-1/2 -translate-y-1/2 right-0 text-slate-400 hover:text-blue-600 transition-colors p-2"
                                            >
                                                <ChevronRight size={24} />
                                            </button>
                                        )}
                                        {funds.length > 1 && safeIndex > 0 && (
                                            <button 
                                                onClick={() => setSelectedFundIndex((prev) => {
                                                    const next = (prev - 1 + funds.length) % funds.length;
                                                    return next;
                                                })}
                                                className="absolute top-1/2 -translate-y-1/2 left-0 text-slate-400 hover:text-blue-600 transition-colors p-2"
                                            >
                                                <ChevronLeft size={24} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4 text-[20px]">
                                        <ShieldCheck className="w-6 h-6 text-blue-500" /> ประวัติการเบิกจ่าย
                                    </h4>
                                    <div className="flex justify-end">
                                        {!readOnly && currentRole?.toLowerCase() !== 'hospital' && currentRole?.toLowerCase() !== 'pcu' && (
                                            <button 
                                                onClick={() => setIsFundRequestOpen(true)}
                                                className="bg-[#6a5acd] hover:bg-[#5a4db8] text-white text-[16px] font-['IBM_Plex_Sans_Thai'] px-3 py-1.5 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                ขอการเบิกจ่ายทุน
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <h5 className="font-bold text-slate-800 mb-3 text-[18px]">{currentFund.historyTitle || 'ประวัติรายการ'}</h5>
                                <div className="space-y-3">
                                    {currentFund.history && currentFund.history.length > 0 ? (
                                        currentFund.history.map((f: any, idx: number) => (
                                            <div 
                                                key={idx} 
                                                onClick={() => setSelectedFundHistoryItem({ ...f, source: currentFund.name })}
                                                className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm cursor-pointer hover:border-blue-200 hover:shadow-md transition-all active:scale-[0.99]"
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-800 text-[18px]">{f.type}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1 text-sm text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                                            <Calendar size={10} className="text-slate-400" /> {f.date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-slate-800">{f.amount?.toLocaleString()} บ.</p>
                                                    <span className={`text-sm px-2 py-0.5 rounded-full ${f.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {f.status === 'approved' ? 'อนุมัติ' : f.status === 'pending' ? 'รอพิจารณา' : f.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            <p>ไม่มีประวัติการเบิกจ่ายสำหรับทุนนี้</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <ShieldCheck className="w-12 h-12 mb-2 opacity-20" />
                                <p>ไม่พบข้อมูลทุน</p>
                            </div>
                        )}
                    </div>
                )}

                {activeSubTab === 'map' && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-[20px]">
                            <MapPin className="text-blue-500" /> แผนที่บ้านผู้ป่วย
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="relative h-64 bg-slate-100 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1551729513-02ac4976572c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBtYXAlMjBzdHJlZXQlMjB2aWV3JTIwbG9jYXRpb258ZW58MXx8fHwxNzY1Mzc3Mzg2fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                                    alt="Map Location" 
                                
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="relative">
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 blur-sm rounded-full"></div>
                                        <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg -mt-4 animate-bounce" fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="text-center md:text-left space-y-1">
                                        <h4 className="font-bold text-slate-800 text-lg">บ้านพักผู้ป่วย</h4>
                                        <p className="text-slate-500 text-sm max-w-md">{patient.contact.address}</p>
                                    </div>
                                    <button type="button" onClick={() => toast.info('เปิด Google Maps')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 w-full md:w-auto justify-center">
                                        <Route size={20} /> ขอเส้นทาง (Google Maps)
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-6">
                            <div className="p-4 border-b border-slate-100">
                                <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                    <ImageIcon className="text-blue-500" /> รูปบ้านผู้ป่วย
                                </h4>
                            </div>
                            <div className="relative h-64 bg-slate-100 group">
                                <img 
                                    src="https://images.unsplash.com/photo-1644130171866-8236ff6d821a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwaG91c2UlMjBleHRlcmlvcnxlbnwxfHx8fDE3NzAyNzEzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                                    alt="House" 
                                />
                            </div>
                            {!readOnly && (
                            <div className="p-4">
                                <Button type="button" onClick={() => toast.info('เลือกไฟล์รูปภาพ')} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                                    <Upload size={20} /> อัปโหลดรูปภาพ
                                </Button>
                            </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSubTab === 'documents' && (() => {
                    // Filter specifically for Consent Forms and X-Ray as requested, but combine them
                    const targetDocs = documents.filter(d => d.category === 'เอกสารยินยอม' || d.category === 'X-Ray');

                    const renderDocCard = (doc: any) => (
                        <div
                            key={doc.id}
                            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                                    doc.fileType === 'image' ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500"
                                )}>
                                    {doc.fileType === 'image' ? <ImageIcon size={22} /> : <FileText size={22} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-slate-800 text-[16px] truncate">{doc.name}</h5>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                        <span className="text-sm text-slate-400 flex items-center gap-1">
                                            <Calendar size={12} /> {doc.date}
                                        </span>
                                        <span className="text-sm text-slate-400">{doc.size}</span>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    );

                    const renderEmptyState = (text: string) => (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <FileText className="w-10 h-10 mb-2 opacity-20" />
                            <p className="text-sm">{text}</p>
                        </div>
                    );

                    return (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2 text-[20px]">
                                <FileText className="text-[#7066A9]" /> เอกสารผู้ป่วย
                            </h3>

                            {/* Upload button — hidden for Patient (readOnly) role */}
                            {!readOnly && (
                            <div className="flex justify-end mb-6">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="bg-[#6a5acd] hover:bg-[#5a4db8] text-white font-['IBM_Plex_Sans_Thai'] px-4 py-2 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all active:scale-95 text-[16px] flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    อัปโหลดเอกสาร
                                </button>
                            </div>
                            )}

                            <div className="space-y-3">
                                {targetDocs.length > 0 ? targetDocs.map(renderDocCard) : renderEmptyState("ยังไม่มีเอกสาร")}
                            </div>
                        </div>
                    );
                })()}

            </div>

            {/* Upload Document Modal — hidden for Patient (readOnly) role */}
            {!readOnly && isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-2xl p-6 animate-in slide-in-from-bottom-4 duration-300 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 text-[20px]">
                                <Upload className="text-blue-500" /> อัปโหลดเอกสาร
                            </h3>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center bg-blue-50/30 hover:bg-blue-50 transition-colors cursor-pointer mb-6">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                                <Upload size={28} className="text-blue-500" />
                            </div>
                            <p className="font-medium text-slate-700 mb-1">กดเพื่อเลือกไฟล์</p>
                            <p className="text-sm text-slate-400">รองรับ JPG, PNG, PDF (สูงสุด 10MB)</p>
                        </div>

                        {/* Document Name */}
                        <div className="mb-4">
                            <label className="text-sm font-medium text-slate-600 block mb-1.5">ชื่อเอกสาร</label>
                            <Input placeholder="เช่น X-Ray ใบหน้า" className="rounded-xl border-slate-200 h-11" />
                        </div>

                        {/* Category Select */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-slate-600 block mb-1.5">หมวดหมู่</label>
                            <select className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400">
                                <option value="">เลือกหมวดหมู่</option>
                                <option value="X-Ray">X-Ray</option>
                                <option value="ผลตรวจ">ผลตรวจ</option>
                                <option value="เอกสารยินยอม">เอกสารยินยอม</option>
                                <option value="รูปถ่าย">รูปถ่าย</option>
                                <option value="ผลประเมิน">ผลประเมิน</option>
                                <option value="อื่นๆ">อื่นๆ</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsUploadModalOpen(false)}
                                className="flex-1 rounded-xl border-slate-200 text-slate-600 h-11"
                            >
                                ยกเลิก
                            </Button>
                            <Button
                                onClick={() => {
                                    const newDoc = {
                                        id: String(documents.length + 1),
                                        name: 'เอกสารใหม่',
                                        category: 'อื่นๆ',
                                        date: '12 ก.พ. 69',
                                        fileType: 'pdf' as const,
                                        size: '1.5 MB',
                                        uploadedBy: 'CM ผู้ใช้งาน'
                                    };
                                    setDocuments(prev => [newDoc, ...prev]);
                                    setIsUploadModalOpen(false);
                                    toast.success('อัปโหลดเอกสารสำเร็จ');
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 shadow-lg shadow-blue-200"
                            >
                                <Upload size={18} className="mr-2" /> อัปโหลด
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        {/* Preview Header */}
                        <div className="flex justify-between items-center p-4 border-b border-slate-100">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                    previewDoc.fileType === 'image' ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500"
                                )}>
                                    {previewDoc.fileType === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-medium text-slate-800 truncate">{previewDoc.name}</h4>
                                    <p className="text-sm text-slate-400">{previewDoc.date} | {previewDoc.size}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {previewDoc.fileType === 'image' ? (
                                <div className="bg-slate-50 rounded-xl p-2 flex items-center justify-center min-h-[300px]">
                                    <div className="text-center">
                                        <ImageIcon size={64} className="text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">{previewDoc.name}</p>
                                        <p className="text-sm text-slate-400 mt-1">ตัวอย่างรูปภาพ (Mock Preview)</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-center min-h-[300px]">
                                    <div className="text-center">
                                        <FileText size={64} className="text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">{previewDoc.name}</p>
                                        <p className="text-sm text-slate-400 mt-1">ตัวอย่างเอกสาร PDF (Mock Preview)</p>
                                    </div>
                                </div>
                            )}

                            {/* Detail Info */}
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm text-slate-400 block mb-0.5">หมวดหมู่</span>
                                    <span className="text-sm font-medium text-slate-700">{previewDoc.category}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm text-slate-400 block mb-0.5">วันที่อัปโหลด</span>
                                    <span className="text-sm font-medium text-slate-700">{previewDoc.date}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm text-slate-400 block mb-0.5">ขนาดไฟล์</span>
                                    <span className="text-sm font-medium text-slate-700">{previewDoc.size}</span>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl">
                                    <span className="text-sm text-slate-400 block mb-0.5">อัปโหลดโดย</span>
                                    <span className="text-sm font-medium text-slate-700">{previewDoc.uploadedBy}</span>
                                </div>
                            </div>
                        </div>

                        {/* Preview Footer */}
                        <div className="p-4 border-t border-slate-100 flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setPreviewDoc(null)}
                                className="flex-1 rounded-xl border-slate-200 text-slate-600"
                            >
                                ปิด
                            </Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200">
                                <Download size={18} className="mr-2" /> ดาวน์โหลด
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Fund Request Form Modal — hidden for Patient (readOnly) role */}
            {!readOnly && isFundRequestOpen && (
                <FundRequestMobile
                    patient={patient}
                    onClose={() => setIsFundRequestOpen(false)}
                    onSubmit={() => {
                        toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
                        setIsFundRequestOpen(false);
                    }}
                    formTitle="ฟอร์มเบิกจ่ายทุน"
                    initialFundType="Operation Smile"
                />
            )}

            {/* Fund History Full Page View */}
            {isFundHistoryOpen && (
                <MutualFundHistory
                    patient={patient}
                    onBack={() => setIsFundHistoryOpen(false)}
                />
            )}

            {/* Selected Fund Detail View */}
            {selectedFundHistoryItem && (
                <FundingDetail
                    fund={selectedFundHistoryItem}
                    patient={patient}
                    fundSource={selectedFundHistoryItem.source}
                    onBack={() => setSelectedFundHistoryItem(null)}
                />
            )}
        </div>
    );
};