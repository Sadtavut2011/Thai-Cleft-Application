import React, { useState } from 'react';
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
  Send
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
// Import from CM components
import { ReferralRequestForm } from "./forms/ReferralRequestForm";
import { ReferralDetail } from "../../../cm/cm-mobile/patient/History/ReferralDetail";
import { REFERRAL_DATA } from "../../../../data/patientData";

export default function ReferralDashboard({ onBack, onRequestReferral, initialHN, onExit, onNavigateToPatient }: { onBack?: () => void, onRequestReferral?: () => void, initialHN?: string, onExit?: () => void, onNavigateToPatient?: (patientHn: string) => void }) {
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [filterStatus, setFilterStatus] = useState<string>("All"); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [view, setView] = useState<'list' | 'detail'>('list');
  // PCU defaults to Refer Out, and we won't show Refer In
  const [referralType, setReferralType] = useState<'Refer Out' | 'Refer In' | 'History'>('Refer Out');
  const [historyType, setHistoryType] = useState<'All' | 'Refer In' | 'Refer Out'>('Refer Out'); // Default to Refer Out for history
  const [selectedReferral, setSelectedReferral] = useState<any>(null);

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

  // Use Centralized Data
  const [referrals, setReferrals] = useState<any[]>(REFERRAL_DATA);

  // Effect to handle initialHN
  React.useEffect(() => {
    if (initialHN) {
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
      
      const updatedItem = updatedReferrals.find(r => r.id === id);
      if (updatedItem) {
          setSelectedReferral(updatedItem);
      }

      toast.error("ปฏิเสธคำขอส่งตัวเรียบร้อยแล้ว");
  };

  const handleDeleteReferral = (id: number) => {
      const updatedReferrals = referrals.filter(r => r.id !== id);
      setReferrals(updatedReferrals);

      const index = REFERRAL_DATA.findIndex(r => r.id === id);
      if (index !== -1) {
          REFERRAL_DATA.splice(index, 1);
      }

      toast.success("ยกเลิกคำขอส่งตัวเรียบร้อยแล้ว");
      setView('list');
      setSelectedReferral(null);
  };

  const handleAccept = (id: number, date?: Date, details?: string) => {
      const formatLocalISO = (d: Date) => {
          const tzOffset = d.getTimezoneOffset() * 60000; 
          return new Date(d.getTime() - tzOffset).toISOString().slice(0, -1);
      };

      const dateStr = date ? formatLocalISO(date) : formatLocalISO(new Date());

      const globalRef = REFERRAL_DATA.find(r => r.id === id);
      if (globalRef) {
          globalRef.status = 'Accepted';
          globalRef.acceptedDate = dateStr;
          globalRef.acceptedReason = details || '';
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
            status: "Pending", 
            type: "Refer Out",
            creatorRole: "PCU", // Mark as created by PCU
            referralDate: new Date().toISOString(),
            date: new Date().toISOString().split('T')[0],
            title: data.diagnosis || "ส่งต่อผู้ป่วย",
            diagnosis: data.diagnosis,
            reason: data.reason,
            doctor: "แพทย์เจ้าของไข้", 
            image: data.patientData?.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"
        };

        setReferrals(prev => [newReferral, ...prev]);
        REFERRAL_DATA.unshift(newReferral);

        setReferralType('Refer Out');
        setFilterStatus('All'); 
        setView('list');

        toast.success("สร้างใบส่งตัวเรียบร้อยแล้ว");
        setShowReferralForm(false);
  };

  const filtered = referrals.filter(r => {
    const matchesSearch = (r.patientName || '').includes(searchTerm) || (r.hn || '').includes(searchTerm);
    const matchesStatus = (statusFilter === 'all' || r.status === statusFilter) && 
                          (filterStatus === 'All' || r.status === filterStatus);
    
    const activeStatuses = ['Pending', 'Accepted', 'NotTreated', 'Waiting', 'Arrived', 'Treating', 'pending', 'accepted', 'referred'];
    const terminalStatuses = ['Treated', 'Rejected', 'Completed', 'Cancelled', 'NoShow', 'treated', 'rejected', 'completed', 'cancelled'];

    let matchesType = false;
    if (referralType === 'History') {
        matchesType = terminalStatuses.includes(r.status);
        
        // Only show Refer Out history for PCU if desired, but user just said "Hide Receive Menu"
        // If we want to hide "Receive" completely, we should filter by Refer Out here too if historyType is Refer Out
        if (historyType !== 'All') {
            matchesType = matchesType && r.type === historyType;
        } else {
             // If History Type is "All" (which shouldn't happen if we force Refer Out), we might see Refer In history
             // Let's force it to Refer Out only for consistency if we hide the toggle
             // matchesType = matchesType && r.type === 'Refer Out'; 
        }
    } else {
        matchesType = r.type === referralType && activeStatuses.includes(r.status);
    }
    
    // Role Isolation Logic
    // Only show referrals created by PCU
    if (referralType === 'Refer Out') {
        const isCreatedByPCU = r.creatorRole === 'PCU' || (!r.creatorRole && r.hospital?.includes('รพ.สต.'));
        matchesType = matchesType && isCreatedByPCU;
    }

    return matchesSearch && matchesStatus && matchesType;
  });

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
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <PopoverTrigger asChild>
                        <button className="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0 shadow-sm text-slate-500">
                           <Filter className="w-5 h-5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100">
                          <div className="flex flex-col">
                              {FILTER_OPTIONS.map((option) => (
                                  <button
                                      key={option.id}
                                      onClick={() => handleFilterSelect(option.id)}
                                      className={cn(
                                          "w-full text-left px-3 py-3 text-[16px] font-medium transition-colors rounded-lg",
                                          filterStatus === option.id ? "bg-slate-50 text-[#7367f0]" : "text-slate-700 hover:bg-slate-50"
                                      )}
                                  >
                                      {option.label}
                                  </button>
                              ))}
                              <div className="my-1 border-t border-slate-100" />
                              <button 
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full text-left px-3 py-3 text-[16px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                ยกเลิก
                              </button>
                          </div>
                      </PopoverContent>
                    </Popover>
                </div>
             </div>

             {/* Toggle Menu - PCU Modified: Show all options like CM */}
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
                    {filtered.map((referral) => (
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
                                            <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[16px] leading-[20px] truncate">
                                                {referral.patientName}
                                            </h3>
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-normal text-[#6a7282] text-[14px] leading-[20px] mt-0.5">
                                                {referral.hn || referral.patientHn}
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
                                    {referral.status === 'WaitingReceive' && (
                                        <div className="bg-orange-50 px-2 py-0.5 rounded-lg">
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-orange-600 text-[12px]">รอรับตัว</span>
                                        </div>
                                    )}
                                    {!['Pending', 'pending', 'Accepted', 'Rejected', 'Treated', 'treated', 'WaitingReceive'].includes(referral.status) && (
                                         <div className="bg-slate-100 px-2 py-0.5 rounded-lg">
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-slate-600 text-[12px]">{referral.status === 'NotTreated' ? 'รอตรวจ' : referral.status}</span>
                                         </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-2 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                     <span className="text-xs text-slate-500 truncate max-w-[40%] text-[16px]">
                                        {referral.creatorRole === 'PCU' 
                                            ? (referral.hospital || '-') 
                                            : (referral.type === 'Refer Out' && referral.hospital?.includes('รพ.สต.') 
                                                ? 'รพ.ฝาง' 
                                                : referral.hospital?.replace('โรงพยาบาล', 'รพ.'))}
                                     </span>
                                     <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                                     <span className="text-xs text-[#7367f0] font-medium line-clamp-2 max-w-[40%] text-[16px]">
                                        {referral.destinationHospital?.replace('โรงพยาบาล', 'รพ.') || referral.destination?.replace('โรงพยาบาล', 'รพ.') || '-'}
                                     </span>
                                </div>

                                <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100">
                                    <span className="text-xs text-slate-400 text-[13px]">
                                        {referral.referralDate ? new Date(referral.referralDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs text-[#7367f0] hover:bg-indigo-50 hover:text-[#7367f0] p-0 px-2 text-[14px]">
                                        ดูรายละเอียด
                                    </Button>
                                </div>
                             </div>
                        </div>
                    ))}
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
            <h1 className="text-white text-xl font-bold flex items-center gap-2 flex-1">
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
                from: selectedReferral.creatorRole === 'PCU' 
                    ? (selectedReferral.hospital || '-') 
                    : (selectedReferral.type === 'Refer Out' && selectedReferral.hospital?.includes('รพ.สต.') 
                        ? 'รพ.ฝาง' 
                        : (selectedReferral.hospital?.replace('โรงพยาบาล', 'รพ.') || 'รพ.ต้นทาง')),
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
                if (onNavigateToPatient) {
                    onNavigateToPatient(hn);
                } else {
                    console.log("Navigate to patient:", hn);
                }
            }}
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