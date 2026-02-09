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
  ChevronLeft
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import { ReferralRequestForm } from "./forms/ReferralRequestForm";
import { REFERRAL_DATA } from "../../../../data/patientData";
import { ReferralDetail } from "./forms/ReferralDetail";

export default function ReferralDashboard({ onBack, onRequestReferral, initialHN, onExit }: { onBack?: () => void, onRequestReferral?: () => void, initialHN?: string, onExit?: () => void }) {
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [referralType, setReferralType] = useState<'Refer Out' | 'Refer In' | 'History'>('Refer Out');
  const [historyType, setHistoryType] = useState<'All' | 'Refer In' | 'Refer Out'>('All');
  const [selectedReferral, setSelectedReferral] = useState<any>(null);

  // Use Centralized Data
  const [referrals, setReferrals] = useState<any[]>(REFERRAL_DATA);

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

  const handleDelete = (id: number) => {
      toast.success("ยกเลิกคำขอเรียบร้อยแล้ว");
      setView('list');
      setSelectedReferral(null);
  };

  const handleAccept = (id: number, date?: Date, details?: string) => {
      setReferrals(prev => prev.map(r => {
          if (r.id === id) {
              return {
                  ...r,
                  status: 'Accepted',
                  acceptedDate: date ? date.toISOString() : new Date().toISOString(),
                  acceptedReason: details || '',
                  logs: [
                      ...(r.logs || []),
                      {
                          status: 'Accepted',
                          date: date ? date.toISOString() : new Date().toISOString(),
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

  const filtered = referrals.filter(r => {
    const matchesSearch = (r.patientName || '').includes(searchTerm) || (r.hn || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    
    // UX/UI Logic: Status Lifecycle Definition
    // Active: Work in progress (Sender/Receiver)
    const activeStatuses = ['Pending', 'Accepted', 'NotTreated', 'Waiting', 'Arrived', 'Treating', 'pending', 'accepted', 'referred'];
    // Terminal: Completed work or Cancelled/Rejected (History)
    const terminalStatuses = ['Treated', 'Rejected', 'Completed', 'Cancelled', 'NoShow', 'treated', 'rejected', 'completed', 'cancelled'];

    let matchesType = false;
    if (referralType === 'History') {
        // History Menu: Show only Terminal states (Completed, Rejected, etc.)
        matchesType = terminalStatuses.includes(r.status);
        
        // Apply Sub-filter for History (All / Refer Out / Refer In)
        if (historyType !== 'All') {
            matchesType = matchesType && r.type === historyType;
        }
    } else {
        // Operational Menu (Refer Out / Refer In): Show only Active states
        matchesType = r.type === referralType && activeStatuses.includes(r.status);
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  const renderListView = () => (
    <>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
             {/* Top Row: Search */}
             <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                        placeholder="ค้นหาชื่อ, เลขที่, HN..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 border-slate-200 bg-slate-50 focus:bg-white transition-all rounded-lg"
                    />
                </div>
             </div>

             {/* Toggle Menu */}
             <div className="bg-[#f1f5f9] p-1 rounded-[10px] flex items-center">
                <button 
                    onClick={() => setReferralType('Refer Out')}
                    className={cn(
                        "flex-1 h-[36px] font-semibold text-sm rounded-[8px] transition-all",
                        referralType === 'Refer Out' 
                            ? "bg-white text-[#7367f0] shadow-sm" 
                            : "text-[#6a7282] hover:text-[#4b5563]"
                    )}
                >
                    ส่งตัว
                </button>
                <button 
                    onClick={() => setReferralType('Refer In')}
                    className={cn(
                        "flex-1 h-[36px] font-semibold text-sm rounded-[8px] transition-all",
                        referralType === 'Refer In' 
                            ? "bg-white text-[#7367f0] shadow-sm" 
                            : "text-[#6a7282] hover:text-[#4b5563]"
                    )}
                >
                    รับตัว
                </button>
                <button 
                    onClick={() => setReferralType('History')}
                    className={cn(
                        "flex-1 h-[36px] font-semibold text-sm rounded-[8px] transition-all",
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
                            "flex-1 px-3 py-1 text-xs rounded-full border transition-all text-center",
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
                            "flex-1 px-3 py-1 text-xs rounded-full border transition-all text-center",
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
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                             <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-3">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", 
                                        referral.urgency === 'Emergency' ? "bg-red-50 text-red-600" :
                                        referral.urgency === 'Urgent' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                                    )}>
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{referral.patientName}</div>
                                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                            <FileText className="h-3 w-3" /> {referral.hn || referral.patientHn}
                                        </div>
                                    </div>
                                </div>
                                <div className={cn("font-medium flex items-center gap-1.5 text-xs",
                                     referral.status === 'Pending' ? "text-yellow-600" :
                                     referral.status === 'Accepted' ? "text-green-600" :
                                     referral.status === 'Rejected' ? "text-red-600" :
                                     referral.status === 'NotTreated' ? "text-slate-500" :
                                     referral.status === 'Treated' ? "text-emerald-600" : "text-slate-500"
                                )}>
                                    <div className={cn("w-1.5 h-1.5 rounded-full",
                                         referral.status === 'Pending' ? "bg-yellow-500" :
                                         referral.status === 'Accepted' ? "bg-green-500" :
                                         referral.status === 'Rejected' ? "bg-red-500" :
                                         referral.status === 'NotTreated' ? "bg-slate-400" :
                                         referral.status === 'Treated' ? "bg-emerald-500" : "bg-slate-500"
                                    )} />
                                    {referral.status === 'Accepted' ? 'อนุมัติ' : 
                                     referral.status === 'Pending' ? 'รออนุมัติ' : 
                                     referral.status === 'Rejected' ? 'ปฏิเสธ' : 
                                     referral.status === 'NotTreated' ? 'รอตรวจ' :
                                     referral.status === 'Treated' ? 'รักษาแล้ว' : referral.status}
                                </div>
                             </div>

                             <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                 <span className="text-xs text-slate-500 truncate max-w-[40%]">
                                    {referral.type === 'Refer Out' && referral.hospital?.includes('รพ.สต.') ? 'รพ.ฝาง' : referral.hospital?.replace('โรงพยาบาล', 'รพ.')}
                                 </span>
                                 <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                                 <span className="text-xs text-[#7367f0] font-medium truncate max-w-[40%]">
                                    {referral.destinationHospital?.replace('โรงพยาบาล', 'รพ.') || referral.destination?.replace('โรงพยาบาล', 'รพ.') || '-'}
                                 </span>
                             </div>

                             <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400">
                                    {referral.referralDate}
                                </span>
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-[#7367f0] hover:bg-indigo-50 hover:text-[#7367f0] p-0 px-2">
                                    ดูรายละเอียด
                                </Button>
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
            <h1 className="text-white text-xl font-bold flex items-center gap-2">
               ระบบส่งตัว (Referral)
            </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {view === 'list' && renderListView()}
      </div>

      {view === 'list' && (
        <Button 
            onClick={() => {
                if (onRequestReferral) {
                    onRequestReferral();
                } else {
                    setShowReferralForm(true);
                }
            }}
            className="fixed bottom-[90px] right-4 h-14 w-14 rounded-full shadow-xl bg-[#7066a9] hover:bg-[#5f5690] text-white z-50 p-0 flex items-center justify-center transition-transform hover:scale-105"
        >
            <Plus className="h-8 w-8" />
        </Button>
      )}

      {view === 'detail' && selectedReferral && (
        <ReferralDetail 
            referral={selectedReferral}
            onBack={() => setView('list')}
            onExit={onExit}
            initialHN={initialHN}
            onAccept={handleAccept}
            onReject={(id) => handleDelete(id)}
        />
      )}

      {/* Referral Request Form Dialog/Modal */}
      {showReferralForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl overflow-hidden flex flex-col">
                <ReferralRequestForm 
                    onClose={() => setShowReferralForm(false)} 
                    onSubmit={(data) => {
                        console.log("Referral Created:", data);
                        toast.success("สร้างใบส่งตัวสำเร็จ");
                        setShowReferralForm(false);
                    }}
                />
            </div>
        </div>
      )}
    </div>
  );
}
