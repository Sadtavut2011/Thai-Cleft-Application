import React, { useState } from 'react';
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { Textarea } from "../../../../../components/ui/textarea";
import { ArrowLeft, Home, Calendar, Clock, MapPin, User, Navigation, Search as SearchIcon } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { cn } from "../../../../../components/ui/utils";

interface CreateHomeVisitPageProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

// --- Mock Data --- (Copied from HomeVisitSystem.tsx)
const MOCK_PATIENTS = [
  { id: "HN001", name: "ด.ช. สมชาย รักดี", address: "123 ม.1 ต.บ้านใหม่", rph: "รพ.สต. บ้านใหม่" },
  { id: "HN002", name: "ด.ญ. มานี ใจผ่อง", address: "45 ม.2 ต.ทุ่งนา", rph: "รพ.สต. ทุ่งนา" },
  { id: "HN003", name: "ด.ช. ปิติ มีทรัพย์", address: "88 ม.5 ต.ดอนเมือง", rph: "รพ.สต. ดอนเมือง" },
];

const MOCK_RPH = [
  "รพ.สต. บ้านใหม่",
  "รพ.สต. ทุ่งนา",
  "รพ.สต. ดอนเมือง",
  "รพ.สต. สันกำแพง"
];

export function CreateHomeVisitPage({ onBack, onSubmit, initialData }: CreateHomeVisitPageProps) {
  const isEditMode = !!initialData;
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialData?.patientId || "");
  const [newRequest, setNewRequest] = useState<any>({
     type: initialData?.type || 'Joint',
     rph: initialData?.rph || "",
     note: initialData?.note || (isEditMode ? "ติดตามอาการหลังผ่าตัด 1 สัปดาห์" : "")
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Filter patients based on search term
  const filteredPatients = MOCK_PATIENTS.filter(p => 
      p.name.includes(searchTerm) || p.id.includes(searchTerm)
  );

  const handleSelectPatient = (patient: typeof MOCK_PATIENTS[0]) => {
      setSelectedPatientId(patient.id);
      setNewRequest((prev: any) => ({ ...prev, rph: patient.rph }));
      setSearchTerm("");
      setShowResults(false);
  };

  const handleClearSelection = () => {
      setSelectedPatientId("");
      setNewRequest((prev: any) => ({ ...prev, rph: undefined }));
  };

  const handleSubmit = () => {
    if (!selectedPatientId || !newRequest.rph) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const patient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);
    if (!patient) return;

    // Construct data object to pass back
    const requestData = {
        patientId: patient.id,
        patientName: patient.name,
        patientAddress: patient.address,
        type: newRequest.type,
        rph: newRequest.rph,
        note: newRequest.note
    };

    onSubmit(requestData);
  };

  const inputStyle = "bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] focus:bg-white transition-colors h-11";

  const selectedPatient = MOCK_PATIENTS.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-['Montserrat','Noto_Sans_Thai',sans-serif]">
        {/* Header Banner */}
        <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#FFF4E5]/50 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-[#FFF4E5]/80 text-[#5e5873]">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
                <h1 className="text-[#5e5873] font-bold text-lg flex items-center gap-2">
                    {isEditMode ? "แก้ไขคำขอเยี่ยมบ้าน (Edit Home Visit)" : "สร้างคำขอเยี่ยมบ้าน (Create Home Visit)"}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? "แก้ไขรายละเอียดการเยี่ยมบ้าน" : "กรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็ว"}
                </p>
            </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-[#EBE9F1] p-6 max-w-4xl mx-auto">
             
             <div className="space-y-8">
                 {/* Step 1: Search Patient */}
                 <div className="space-y-4">
                     <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                        <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                     </h3>
                     
                     {!selectedPatientId ? (
                         <div className="space-y-2 relative">
                             <Label className="text-sm font-semibold text-[#5e5873]">ค้นหาผู้ป่วย (ชื่อ หรือ HN)</Label>
                             <div className="relative">
                                 <SearchIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                 <Input 
                                     placeholder="พิมพ์ชื่อ-นามสกุล หรือ HN เพื่อค้นหา..." 
                                     className="pl-9 bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0] h-11"
                                     value={searchTerm}
                                     onChange={(e) => {
                                         setSearchTerm(e.target.value);
                                         setShowResults(true);
                                     }}
                                     onFocus={() => setShowResults(true)}
                                 />
                             </div>

                             {/* Search Results Dropdown */}
                             {showResults && searchTerm && (
                                 <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                                     {filteredPatients.length > 0 ? (
                                         filteredPatients.map(p => (
                                             <div 
                                                 key={p.id} 
                                                 className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 flex justify-between items-center group"
                                                 onClick={() => handleSelectPatient(p)}
                                             >
                                                 <div>
                                                     <p className="font-medium text-sm text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{p.name}</p>
                                                     <p className="text-xs text-gray-500">HN: {p.id}</p>
                                                 </div>
                                                 <div className="text-xs text-gray-400 group-hover:text-[#7367f0]">{p.rph}</div>
                                             </div>
                                         ))
                                     ) : (
                                         <div className="p-4 text-center text-sm text-gray-400">
                                             ไม่พบข้อมูลผู้ป่วย "{searchTerm}"
                                         </div>
                                     )}
                                 </div>
                             )}
                         </div>
                     ) : (
                        <div className="p-4 bg-blue-50/50 rounded-xl text-sm text-gray-600 border border-blue-100 flex items-start justify-between animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-2.5 rounded-full mt-1">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#5e5873] text-lg">{selectedPatient?.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                         <span className="bg-white border border-blue-200 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">HN: {selectedPatient?.id}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {selectedPatient?.address}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleClearSelection} className="text-gray-400 hover:text-red-500 hover:bg-red-50">
                                เปลี่ยนผู้ป่วย
                            </Button>
                        </div>
                     )}
                 </div>

                 {/* Step 2 */}
                 <div className="space-y-4">
                            <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Navigation className="w-5 h-5 text-[#7367f0]" /> รูปแบบการเยี่ยม
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div 
                                    className={cn(
                                        "border-2 rounded-xl p-4 cursor-pointer transition-all hover:border-[#7367f0] relative overflow-hidden",
                                        newRequest.type === 'Joint' ? "bg-[#7367f0]/5 border-[#7367f0]" : "bg-white border-gray-100"
                                    )}
                                    onClick={() => setNewRequest({...newRequest, type: 'Joint'})}
                                >
                                    <div className="font-bold text-base text-[#5e5873] mb-1 flex items-center gap-2">
                                        Joint Visit
                                        {newRequest.type === 'Joint' && <div className="w-2 h-2 rounded-full bg-[#7367f0]" />}
                                    </div>
                                    <div className="text-sm text-gray-500">รพ. ลงเยี่ยมพร้อม รพ.สต.</div>
                                </div>
                                <div 
                                    className={cn(
                                        "border-2 rounded-xl p-4 cursor-pointer transition-all hover:border-[#7367f0] relative overflow-hidden",
                                        newRequest.type === 'Delegated' ? "bg-[#7367f0]/5 border-[#7367f0]" : "bg-white border-gray-100"
                                    )}
                                    onClick={() => setNewRequest({...newRequest, type: 'Delegated'})}
                                >
                                    <div className="font-bold text-base text-[#5e5873] mb-1 flex items-center gap-2">
                                        Delegated
                                        {newRequest.type === 'Delegated' && <div className="w-2 h-2 rounded-full bg-[#7367f0]" />}
                                    </div>
                                    <div className="text-sm text-gray-500">ฝาก รพ.สต. เยี่ยมให้</div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Home className="w-5 h-5 text-[#7367f0]" /> รายละเอียดเพิ่มเติม
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#5e5873]">พื้นที่รับผิดชอบ (รพ.สต.)</Label>
                                    <Select 
                                        value={newRequest.rph} 
                                        onValueChange={(v) => setNewRequest({...newRequest, rph: v})}
                                    >
                                        <SelectTrigger className={inputStyle}>
                                            <SelectValue placeholder="เลือก รพ.สต." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_RPH.map((r, i) => (
                                                <SelectItem key={i} value={r}>{r}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-400">* ระบบเลือกให้อัตโนมัติตามที่อยู่ผู้ป่วย</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#5e5873]">หมายเหตุ / อาการที่ต้องติดตาม</Label>
                                <Textarea 
                                    placeholder="ระบุรายละเอียดเพิ่มเติม..." 
                                    value={newRequest.note || ""}
                                    onChange={(e) => setNewRequest({...newRequest, note: e.target.value})}
                                    className="min-h-[100px] bg-[#F8F8F8] border-none focus:ring-1 focus:ring-[#7367f0]"
                                />
                            </div>
                        </div>

                 {/* Actions */}
                 <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                     <Button variant="outline" onClick={onBack} className="h-11 px-8 text-gray-600">
                         ยกเลิก
                     </Button>
                     <Button onClick={handleSubmit} disabled={!selectedPatientId} className="bg-[#7367f0] hover:bg-[#5e54ce] h-11 px-8 shadow-md shadow-indigo-200 transition-all">
                         {isEditMode ? "บันทึกการแก้ไข" : "ส่งคำขอเยี่ยมบ้าน"}
                     </Button>
                 </div>
             </div>
        </div>
    </div>
  );
}