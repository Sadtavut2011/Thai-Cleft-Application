import React, { useState, useEffect } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { Checkbox } from "../../../../components/ui/checkbox";
import SlotClone from "../../../../imports/SlotClone-4162-1830";
import { 
  ChevronLeft,
  Search, 
  Home,
  MapPin,
  Building2,
  ChevronDown
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import { HomeVisitADD } from "./forms/HomeVisitADD";
import { HomeVisitDetail } from "./HomeVisitDetail";
import Icon from "../../../../imports/Icon";
import { VisitRequest, VisitForm, MapPinData } from "./types";
import VisitTypeIcon from "../../../../imports/Icon-4061-1646";
import DocIcon from "../../../../imports/Icon-4061-1692";
import EditIcon from "../../../../imports/Icon-4062-1729";
import DeleteIcon from "../../../../imports/Icon-4062-1733";

// Mock Data for Filters
const PROVINCES = ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];
const HOSPITALS = ['รพ.มหาราชนครเชียงใหม่', 'รพ.นครพิงค์', 'รพ.ฝาง', 'รพ.จอมทอง', 'รพ.เชียงรายประชานุเคราะห์', 'รพ.แม่จัน'];

interface HomeVisitSystemProps {
  onBack?: () => void;
  onVisitFormStateChange?: (isOpen: boolean) => void;
  initialSearch?: string;
  onViewDetail?: (visit: VisitRequest) => void;
}

export function HomeVisitSystem({ onBack, onVisitFormStateChange, initialSearch, onViewDetail }: HomeVisitSystemProps) {
  // --- State ---
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // New Filter State
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<string>('All');
  
  // 1. Request Management State
  const [requests, setRequests] = useState<VisitRequest[]>([
    {
      id: "REQ-001",
      patientName: "ด.ช. สมชาย รักดี",
      patientId: "HN001",
      patientAddress: "123 ม.1 ต.บ้านใหม่",
      type: 'Joint',
      rph: "รพ.สต. บ้านใหม่",
      requestDate: "14 ธ.ค. 68",
      status: 'Pending',
      note: "ติดตามแผลผ่าตัด"
    },
    {
      id: "REQ-002",
      patientName: "ด.ญ. มานี ใจผ่อง",
      patientId: "HN002",
      patientAddress: "45 ม.2 ต.ทุ่งนา",
      type: 'Delegated',
      rph: "รพ.สต. ทุ่งนา",
      requestDate: "14 มิ.ย. 66",
      status: 'InProgress',
      note: "ประเมินพัฒนาการ"
    },
    {
      id: "REQ-003",
      patientName: "นาย สมศักดิ์ แข็งแรง",
      patientId: "HN004",
      patientAddress: "99 ม.3 ต.ดอนเมือง",
      type: 'Joint',
      rph: "รพ.สต. ดอนเมือง",
      requestDate: "12 ธ.ค. 68",
      status: 'InProgress',
      note: "เยี่ยมติดตามอาการเบาหวาน"
    }
  ]);

  // UI States
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<VisitRequest | null>(null);

  // Sync with App Sidebar
  useEffect(() => {
    if (onVisitFormStateChange) {
      onVisitFormStateChange(isCreating);
    }
  }, [isCreating, onVisitFormStateChange]);

  const FILTER_OPTIONS = [
    { id: 'All', label: 'ทั้งหมด' },
    { id: 'Pending', label: 'รอตอบรับ' },
    { id: 'InProgress', label: 'ดำเนินการ' },
    { id: 'Rejected', label: 'ปฎิเสธ' },
    { id: 'Completed', label: 'เสร็จสิ้น' }
  ];

  const handleFilterSelect = (status: string, closeFn: () => void) => {
    setFilterStatus(status);
    closeFn();
  };

  const getAllFilteredRequests = () => {
    return requests.filter(req => {
      const statusMatch = filterStatus === 'All' || req.status === filterStatus;
      
      // Basic implementation of hospital/province filter
      // In a real app, you'd check req.hospital or req.province fields
      const hospitalMatch = selectedHospital === 'All' || true; // Mock
      const provinceMatch = selectedProvince === 'All' || true; // Mock

      return statusMatch && hospitalMatch && provinceMatch;
    });
  };

  // --- Handlers ---

  const handleCreateRequest = (data: any) => {
    const request: VisitRequest = {
      id: `REQ-${Date.now()}`,
      patientName: data.patientName,
      patientId: data.patientId,
      patientAddress: data.patientAddress,
      type: data.type,
      rph: data.rph,
      requestDate: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }),
      status: 'Pending',
      note: data.note
    };

    setRequests([request, ...requests]);
    setIsCreating(false);
    toast.success("ส่งคำขอเยี่ยมบ้านเรียบร้อยแล้ว", {
      description: `แจ้งเตือนไปยัง ${request.rph} แล้ว`
    });
  };

  const handleCancelRequest = (id: string) => {
    if (confirm("ยืนยันการยกเลิกคำขอ?")) {
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success("ยกเลิกคำขอเรียบร้อยแล้ว");
    }
  };

  if (isCreating) {
    return (
      <HomeVisitADD 
        onBack={() => setIsCreating(false)} 
        onSubmit={handleCreateRequest}
      />
    );
  }

  if (selectedRequest) {
    return (
      <HomeVisitDetail 
        request={selectedRequest} 
        onBack={() => setSelectedRequest(null)} 
        onCancelRequest={(id) => {
            handleCancelRequest(id);
            setSelectedRequest(null);
        }}
        onOpenForm={() => setIsEditingForm(true)}
      />
    );
  }

  const displayedRequests = getAllFilteredRequests();

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">ระบบเยี่ยมบ้าน</h1>
      </div>

      <div className="px-6 py-4 flex justify-end">
             <button 
                className="fixed bottom-[90px] right-4 w-14 h-14 z-50 p-0 border-none bg-transparent shadow-none hover:opacity-90 transition-opacity" 
                onClick={() => setIsCreating(true)}
             >
                <div className="bg-[#7066a9] content-stretch flex items-center justify-center relative rounded-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="Button">
                    <div className="relative shrink-0 w-4 h-4" data-name="Icon">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
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
          <div className="space-y-4">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                      placeholder="ค้นหาชื่อผู้ป่วย, เลขที่ส่งตัว..." 
                      defaultValue={initialSearch}
                      className="pl-10 bg-white border-slate-200 rounded-xl h-11 text-sm shadow-sm focus:ring-teal-500" 
                  />
              </div>

              <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-slate-700 text-lg text-[14px]">รายการคำขอเยี่ยมบ้าน</h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{displayedRequests.length} รายการ</span>
              </div>
          </div>

          <div className="space-y-4">
             {displayedRequests.map(req => (
                 <Card key={req.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => {
                     if (onViewDetail) onViewDetail(req);
                     else setSelectedRequest(req);
                 }}>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            {/* Right Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                {/* Header Row */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                            {req.patientName}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="w-[14px] h-[14px]">
                                                <DocIcon />
                                            </div>
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px]">
                                                {req.patientId}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Status Badge */}
                                        {req.status === 'Pending' && (
                                            <div className="bg-[#fff0e1] px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#ff9f43] text-[12px]">รอการตอบรับ</span>
                                            </div>
                                        )}
                                        {req.status === 'InProgress' && (
                                            <div className="bg-[#E0FBFC] px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">ดำเนินการ</span>
                                            </div>
                                        )}
                                        {req.status === 'Completed' && (
                                            <div className="bg-gray-100 px-3 py-1 rounded-[10px]">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-gray-600 text-[12px]">เยี่ยมเสร็จสิ้น</span>
                                            </div>
                                        )}
                                        
                                    </div>
                                </div>

                                {/* Details Row */}
                                <div className="flex items-center justify-between w-full mt-1">
                                    {/* Visit Type */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-[16px] h-[16px]">
                                            <VisitTypeIcon />
                                        </div>
                                        <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[12px]">
                                            {req.type === 'Joint' ? 'ลงเยี่ยมพร้อม รพ.สต.' : 'ฝาก รพ.สต. เยี่ยม'}
                                        </span>
                                    </div>
                                    <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                        วันนัด {req.requestDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
             ))}
             {displayedRequests.length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ไม่พบรายการคำขอ</p>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
}
