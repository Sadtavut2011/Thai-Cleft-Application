import React, { useState } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import SlotClone from "../../../../imports/SlotClone-4162-1830";
import { 
  ChevronLeft,
  Search, 
  Home,
  FileText,
  Calendar,
  Banknote,
  Clock
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import FundRequestForm from './forms/FundRequestForm';
import Icon from "../../../../imports/Icon";

// --- MOCK DATA ---
interface FundRequest {
  id: string;
  patientName: string;
  patientId: string; // HN
  amount: number;
  reason: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  hospital: string;
}

const INITIAL_FUNDS: FundRequest[] = [
  { 
    id: 'FUND-001', 
    patientName: 'นางมาลี สีสวย', 
    patientId: 'HN001234',
    amount: 5000, 
    reason: 'ค่าเดินทางฟอกไต', 
    status: 'Pending', 
    requestDate: '20 ต.ค. 66',
    hospital: 'รพ.สต. บ้านใหม่'
  },
  { 
    id: 'FUND-002', 
    patientName: 'นายดำรง คงมั่น', 
    patientId: 'HN005678',
    amount: 2500, 
    reason: 'อุปกรณ์ทำแผลกดทับ', 
    status: 'Approved', 
    requestDate: '15 ต.ค. 66',
    hospital: 'รพ.สต. ทุ่งนา'
  },
  { 
    id: 'FUND-003', 
    patientName: 'ด.ช. สมชาย ใจดี', 
    patientId: 'HN009012',
    amount: 3000, 
    reason: 'นมผงสำหรับเด็ก', 
    status: 'Rejected', 
    requestDate: '10 ต.ค. 66',
    hospital: 'รพ.สต. ดอนเมือง'
  },
  { 
    id: 'FUND-004', 
    patientName: 'นางสมศรี มีสุข', 
    patientId: 'HN003456',
    amount: 1500, 
    reason: 'ค่าเดินทางไปโรงพยาบาล', 
    status: 'Pending', 
    requestDate: '22 ต.ค. 66',
    hospital: 'รพ.สต. บ้านใหม่'
  },
];

interface FundingSystemProps {
  onBack?: () => void;
  onRequestFund?: () => void;
  initialPatient?: any;
}

export function FundingSystem({ onBack, onRequestFund, initialPatient }: FundingSystemProps) {
  // --- State ---
  const [activeTab, setActiveTab] = useState("requests");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [funds, setFunds] = useState<FundRequest[]>(INITIAL_FUNDS);
  
  // UI States
  const [isCreating, setIsCreating] = useState(!!initialPatient);

  const FILTER_OPTIONS = [
    { id: 'All', label: 'ทั้งหมด' },
    { id: 'Pending', label: 'รอพิจารณา' },
    { id: 'Approved', label: 'อนุมัติ' },
    { id: 'Rejected', label: 'ปฎิเสธ' },
  ];

  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  const getFilteredFunds = (tab: 'requests' | 'history') => {
    return funds.filter(fund => {
      // Tab filtering
      if (tab === 'requests' && fund.status !== 'Pending') return false;
      if (tab === 'history' && fund.status === 'Pending') return false;

      // Status filtering (only relevant if user picks a specific status in filter)
      // Note: If in 'requests' tab, status is always Pending, so filter might only be useful if we had sub-statuses.
      // But adhering to the design pattern, we keep the filter.
      // Actually, for 'history', it could be Approved or Rejected.
      if (filterStatus !== 'All' && fund.status !== filterStatus) return false;

      // Search filtering
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          fund.patientName.toLowerCase().includes(query) ||
          fund.patientId.toLowerCase().includes(query)
        );
      }

      return true;
    });
  };

  const handleCreateFund = (data: any) => {
    // This is a placeholder for actual submission logic
    // We would assume FundRequestForm calls onSubmit
    setIsCreating(false);
    toast.success("ส่งคำขอทุนเรียบร้อยแล้ว");
  };

  if (isCreating) {
     return (
        <FundRequestForm 
            patient={initialPatient || null}
            onClose={() => setIsCreating(false)}
            onSubmit={handleCreateFund}
        />
     );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">ระบบขอทุนสงเคราะห์</h1>
      </div>

      <div className="px-6 py-4 flex justify-end">
             <button 
                className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
                onClick={() => setIsCreating(true)}
             >
                <div className="bg-[#7066a9] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="Button">
                    <div className="relative shrink-0 size-[15.998px]" data-name="Icon">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.998 15.998">
                        <g id="Icon">
                          <path d="M3.33293 7.99902H12.6651" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                          <path d="M7.99902 3.33293V12.6651" id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33317" />
                        </g>
                      </svg>
                    </div>
                </div>
             </button>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, HN..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" 
                    />
                </div>
                
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <button className="h-12 w-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0 shadow-sm text-slate-500">
                       <div className="w-5 h-5">
                           <SlotClone />
                       </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[200px] p-2 rounded-xl bg-white shadow-xl border border-slate-100">
                      <div className="flex flex-col">
                          {FILTER_OPTIONS.map((option) => (
                              <button
                                  key={option.id}
                                  onClick={() => handleFilterSelect(option.id, () => setIsFilterOpen(false))}
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
             
             <TabsList className="bg-[#F3F4F6] p-1 h-12 rounded-xl grid grid-cols-2 w-full">
                <TabsTrigger value="requests" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold relative">
                   รายการทุน
                   {funds.filter(r => r.status === 'Pending').length > 0 && 
                     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {funds.filter(r => r.status === 'Pending').length}
                     </span>
                   }
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold">
                   ประวัติทุน
                </TabsTrigger>
             </TabsList>
          </div>

          {/* --- Tab 1: Fund Requests (รายการทุน) --- */}
          <TabsContent value="requests" className="space-y-4 mt-2">
             {getFilteredFunds('requests').map(req => (
                 <Card key={req.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group">
                    <CardContent className="p-3">
                        <div className="flex flex-col gap-1">
                            {/* Header Row */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                        {req.patientName} <span className="ml-1 font-normal text-[#6a7282]">{req.patientId}</span>
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <FileText className="w-[14px] h-[14px] text-[#6a7282]" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px]">
                                            กองทุนฟื้นฟูสมรรถภาพ
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-[#fff0e1] px-2 py-0.5 rounded-lg">
                                    <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#ff9f43] text-[12px]">รอพิจารณา</span>
                                </div>
                            </div>

                            {/* Details Row */}
                            <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Banknote className="w-[16px] h-[16px] text-[#7367f0]" />
                                    <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[14px]">
                                        {req.amount.toLocaleString()} บาท
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                        {req.requestDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
             {getFilteredFunds('requests').length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Banknote className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบรายการขอทุน</p>
                 </div>
             )}
          </TabsContent>

          {/* --- Tab 2: Fund History (ประวัติทุน) --- */}
          <TabsContent value="history" className="space-y-4 mt-2">
             {getFilteredFunds('history').map(req => (
                 <Card key={req.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group">
                    <CardContent className="p-3">
                        <div className="flex flex-col gap-1">
                            {/* Header Row */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                        {req.patientName} <span className="ml-1 font-normal text-[#6a7282]">{req.patientId}</span>
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <FileText className="w-[14px] h-[14px] text-[#6a7282]" />
                                        <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px]">
                                            กองทุนฟื้นฟูสมรรถภาพ
                                        </span>
                                    </div>
                                </div>

                                {req.status === 'Approved' && (
                                    <div className="bg-[#E0FBFC] px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">อนุมัติ</span>
                                    </div>
                                )}
                                {req.status === 'Rejected' && (
                                    <div className="bg-red-50 px-2 py-0.5 rounded-lg">
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-red-500 text-[12px]">ปฎิเสธ</span>
                                    </div>
                                )}
                            </div>

                            {/* Details Row */}
                            <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Banknote className="w-[16px] h-[16px] text-[#7367f0]" />
                                    <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[14px]">
                                        {req.amount.toLocaleString()} บาท
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-gray-400" />
                                    <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                        {req.requestDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
             {getFilteredFunds('history').length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Banknote className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบประวัติการขอทุน</p>
                 </div>
             )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
