import React, { useState, useEffect } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { 
  ChevronLeft,
  Search, 
  Home,
  MapPin
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import { HomeVisitForm } from "./forms/HomeVisitForm";
import { HomeVisitDetail } from "./HomeVisitDetail";
import Icon from "../../../../imports/Icon";
import { VisitRequest, VisitForm, MapPinData } from "./types";
import VisitTypeIcon from "../../../../imports/Icon-4061-1646";
import DocIcon from "../../../../imports/Icon-4061-1692";
import EditIcon from "../../../../imports/Icon-4062-1729";
import DeleteIcon from "../../../../imports/Icon-4062-1733";

interface HomeVisitSystemProps {
  onBack?: () => void;
  onVisitFormStateChange?: (isOpen: boolean) => void;
  initialSearch?: string;
  onViewDetail?: (visit: VisitRequest) => void;
}

export function HomeVisitSystem({ onBack, onVisitFormStateChange, initialSearch, onViewDetail }: HomeVisitSystemProps) {
  // --- State ---
  const [activeTab, setActiveTab] = useState("requests");
  
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
      patientAddress: "99 ม.3 ต.ดอนเ��ือง",
      type: 'Joint',
      rph: "รพ.สต. ดอนเมือง",
      requestDate: "12 ธ.ค. 68",
      status: 'InProgress',
      note: "เยี่ยมติดตามอาการเบาหวาน"
    }
  ]);

  // 3. Map Data State
  const [pins] = useState<MapPinData[]>([
    { id: "P1", lat: 30, lng: 40, patientName: "ด.ช. สมชาย รักดี", status: "รอเยี่ยม", address: "123 ม.1 ต.บ้านใหม่" },
    { id: "P2", lat: 60, lng: 70, patientName: "ด.ญ. มานี ใจผ่อง", status: "ดำเนินการ", address: "45 ม.2 ต.ทุ่งนา" },
    { id: "P3", lat: 45, lng: 20, patientName: "ด.ช. ปิติ มีทรัพย์", status: "เยี่ยมแล้ว", address: "88 ม.5 ต.ดอนเมือง" },
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
      <HomeVisitForm 
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
             <Button 
                className="fixed bottom-[90px] right-4 w-14 h-14 rounded-full bg-[#5b4d9d] hover:bg-[#4b3f85] shadow-xl z-50 p-0 flex items-center justify-center" 
                onClick={() => setIsCreating(true)}
             >
                <div className="w-7 h-7">
                    <Icon />
                </div>
             </Button>
      </div>

      <div className="p-4 md:p-6 max-w-[800px] mx-auto w-full flex-1 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="ค้นหาชื่อผู้ป่วย, เลขที่ส่งตัว..." 
                  defaultValue={initialSearch}
                  className="pl-12 bg-[#F3F4F6] border-transparent focus:bg-white transition-all rounded-xl h-12 text-base shadow-sm" 
                />
             </div>
             
             <TabsList className="bg-[#F3F4F6] p-1 h-12 rounded-xl grid grid-cols-3 w-full">
                <TabsTrigger value="requests" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold relative">
                   ฝากเยี่ยม
                   {requests.filter(r => r.status === 'Pending' && r.type === 'Delegated').length > 0 && 
                     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {requests.filter(r => r.status === 'Pending' && r.type === 'Delegated').length}
                     </span>
                   }
                </TabsTrigger>
                <TabsTrigger value="forms" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold">
                   ลงเยี่ยมร่วม
                </TabsTrigger>
                <TabsTrigger value="map" className="data-[state=active]:bg-white data-[state=active]:text-[#7367f0] data-[state=active]:shadow-sm rounded-lg transition-all h-full font-semibold">
                   แผนที่
                </TabsTrigger>
             </TabsList>
          </div>

          {/* --- Tab 1: Delegated Requests (ฝากเยี่ยม) --- */}
          <TabsContent value="requests" className="space-y-4 mt-2">
             {requests.filter(req => req.type === 'Delegated').map(req => (
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
                                        
                                        {/* Buttons */}
                                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-gray-100 transition-colors">
                                                <div className="w-[16px] h-[16px]">
                                                    <EditIcon />
                                                </div>
                                            </button>
                                            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-gray-100 transition-colors" onClick={() => handleCancelRequest(req.id)}>
                                                <div className="w-[16px] h-[16px]">
                                                    <DeleteIcon />
                                                </div>
                                            </button>
                                        </div>
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
             {requests.filter(req => req.type === 'Delegated').length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ยังไม่มีคำขอฝากเยี่ยม</p>
                 </div>
             )}
          </TabsContent>

          {/* --- Tab 2: Joint Visits (ลงเยี่ยมร่วม) --- */}
          <TabsContent value="forms" className="space-y-4 mt-2">
             {requests.filter(req => req.type === 'Joint').map(req => (
                 <Card key={req.id} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group" onClick={() => setSelectedRequest(req)}>
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
                                        
                                        {/* Buttons */}
                                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-gray-100 transition-colors">
                                                <div className="w-[16px] h-[16px]">
                                                    <EditIcon />
                                                </div>
                                            </button>
                                            <button className="w-[32px] h-[32px] flex items-center justify-center rounded-[10px] hover:bg-gray-100 transition-colors" onClick={() => handleCancelRequest(req.id)}>
                                                <div className="w-[16px] h-[16px]">
                                                    <DeleteIcon />
                                                </div>
                                            </button>
                                        </div>
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
             {requests.filter(req => req.type === 'Joint').length === 0 && (
                 <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                     <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                     <p>ยังไม่มีรายการลงเยี่ยมร่วม</p>
                 </div>
             )}
          </TabsContent>

          {/* --- Tab 3: Map --- */}
          <TabsContent value="map" className="h-[calc(100vh-250px)] min-h-[500px] flex flex-col gap-4 mt-2">
               <div className="space-y-3 pt-2 w-full">
                <Label className="text-[#5e5873] font-semibold">เลือกพื้นที่</Label>
                <div className="flex gap-2 w-full">
                    <Select defaultValue="fang">
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-12 rounded-xl flex-1">
                            <SelectValue placeholder="เลือกอำเภอ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fang">อำเภอฝาง</SelectItem>
                            <SelectItem value="mae-ai">อำเภอแม่อาย</SelectItem>
                            <SelectItem value="chai-prakan">อำเภอไชยปราการ</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                        <SelectTrigger className="bg-gray-50 border-gray-200 h-12 rounded-xl flex-1">
                            <SelectValue placeholder="เลือกพื้นที่" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">ทั้งหมด</SelectItem>
                            <SelectItem value="area1">ต.บ้านใหม่</SelectItem>
                            <SelectItem value="area2">ต.ทุ่งนา</SelectItem>
                            <SelectItem value="area3">ต.ดอนเมือง</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
              <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 relative overflow-hidden group">
                  <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3753.689626577903!2d99.03057531494883!3d19.809279030623315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a7e91a66a1b%3A0x4d567c9e0d167735!2sFang%20Hospital!5e0!3m2!1sen!2sth!4v1625567891234!5m2!1sen!2sth"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                  />
                  
                  {/* Map Controls */}
                  <div className="absolute right-4 bottom-8 flex flex-col gap-2">
                       <Button size="icon" className="bg-white text-gray-700 hover:bg-gray-50 shadow-md rounded-xl h-10 w-10">
                           <MapPin className="h-5 w-5" />
                       </Button>
                  </div>
              </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
