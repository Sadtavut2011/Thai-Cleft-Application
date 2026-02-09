import React, { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Map, MapPin, Navigation, Search, Layers, User, Filter, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../components/ui/popover";
import { Label } from "../../../../../components/ui/label";
import { cn } from "../../../../../components/ui/utils";

// Mock Data for Map Points
const mapPoints = [
  { id: 1, lat: 50, lng: 30, name: "ด.ช. สมชาย ใจดี", hospital: "โรงพยาบาลฝาง", status: "รอการรักษา", type: "ปากแหว่ง", address: "ต.เวียง อ.ฝาง จ.เชียงใหม่" },
  { id: 2, lat: 45, lng: 60, name: "ด.ญ. วิภาวี รักไทย", hospital: "โรงพยาบาลเชียงรายประชานุเคราะห์", status: "กำลังรักษา", type: "เพดานโหว่", address: "ต.รอบเวียง อ.เมือง จ.เชียงราย" },
  { id: 3, lat: 70, lng: 40, name: "นาย ประวิทย์ มั่นคง", hospital: "โรงพยาบาลฝาง", status: "รักษาแล้ว", type: "ปากแหว่งและเพดานโหว่", address: "ต.ม่อนปิ่น อ.ฝาง จ.เชียงใหม่" },
  { id: 4, lat: 30, lng: 70, name: "ด.ญ. กานดา สุขใจ", hospital: "โรงพยาบาลนครพิงค์", status: "รอการรักษา", type: "ปากแหว่ง", address: "ต.ดอนแก้ว อ.แม่ริม จ.เชียงใหม่" },
  { id: 5, lat: 60, lng: 20, name: "นาย ณัฐพล มีทรัพย์", hospital: "โรงพยาบาลมหาราชนครเชียงใหม่", status: "กำลังรักษา", type: "เพดานโหว่", address: "ต.สุเทพ อ.เมือง จ.เชียงใหม่" },
];

const patientTypes = [
  "ปากแหว่ง",
  "เพดานโหว่",
  "ปากแหว่งและเพดานโหว่"
];

interface GISSystemProps {
  onViewPatient?: (patient: any) => void;
}

export default function GISSystem({ onViewPatient }: GISSystemProps) {
  const [selectedHospital] = useState("โรงพยาบาลฝาง");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPoints = mapPoints.filter(point => {
    const matchHospital = point.hospital === selectedHospital;
    const matchType = selectedType === "all" || point.type === selectedType;
    const matchSearch = point.name.includes(searchTerm) || point.address.includes(searchTerm);
    return matchHospital && matchType && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#120d26] flex items-center gap-2">
            <Map className="w-8 h-8 text-[#5669FF]" />
            ระบบสารสนเทศภูมิศาสตร์ (GIS)
          </h1>
          <p className="text-gray-500 mt-1">แผนที่แสดงพิกัดผู้ป่วยและการกระจายตัวของเคสในพื้นที่รับผิดชอบ</p>
        </div>
        
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
                <Layers className="w-4 h-4" />
                ชั้นข้อมูล
            </Button>
            <Button className="bg-[#5669FF] hover:bg-[#4854d6] text-white gap-2">
                <Navigation className="w-4 h-4" />
                นำทางไปยังพื้นที่
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[700px]">
        {/* Filters and List Side */}
        <div className="lg:col-span-1 flex flex-col gap-4 h-full">
            <Card className="flex-1 flex flex-col border-none shadow-md overflow-hidden">
                <CardHeader className="bg-white border-b pb-4">
                    <CardTitle className="text-lg">ตัวกรองข้อมูล</CardTitle>
                    <div className="space-y-3 mt-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input 
                                placeholder="ค้นหาชื่อ,HN" 
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* Fixed Hospital Filter */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-medium text-gray-700">โรงพยาบาล</span>
                            <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-600 cursor-not-allowed">
                                โรงพยาบาลฝาง
                            </div>
                        </div>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between bg-white hover:bg-gray-50 text-[#5e5873] border-gray-200 h-10 px-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        <span className="text-sm font-medium">ตัวกรอง</span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="right" align="start" className="w-[320px] p-0 shadow-xl border-gray-200 overflow-hidden" sideOffset={10}>
                                <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                                        <Filter className="w-4 h-4" /> ตัวกรองละเอียด
                                    </h4>
                                    <span className="text-[10px] text-gray-500 bg-white border px-1.5 rounded">Super Filter</span>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="space-y-3">
                                        <Label className="text-[#5e5873] font-medium text-xs uppercase tracking-wide">พื้นที่:</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Select defaultValue="fang">
                                                <SelectTrigger className="bg-white border-gray-200 h-9 text-xs">
                                                    <SelectValue placeholder="อำเภอ" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="fang">อ.ฝาง</SelectItem>
                                                    <SelectItem value="mae-ai">อ.แม่อาย</SelectItem>
                                                    <SelectItem value="chai-prakan">อ.ไชยปราการ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select defaultValue="all">
                                                <SelectTrigger className="bg-white border-gray-200 h-9 text-xs">
                                                    <SelectValue placeholder="ตำบล" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">ทุกตำบล</SelectItem>
                                                    <SelectItem value="wiang">ต.เวียง</SelectItem>
                                                    <SelectItem value="mon-pin">ต.ม่อนปิ่น</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Label className="text-[#5e5873] font-medium text-xs uppercase tracking-wide mt-2 block">ผลการวินิจฉัย:</Label>
                                        <Select value={selectedType} onValueChange={setSelectedType}>
                                            <SelectTrigger className="bg-white border-gray-200 h-9 text-xs">
                                                <SelectValue placeholder="เลือกการวินิจฉัย" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">ทั้งหมด</SelectItem>
                                                {patientTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                        <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-500 hover:text-red-500">ล้างค่า</Button>
                                        <Button size="sm" className="h-8 text-xs bg-[#7367f0] hover:bg-[#685dd8]">ค้นหา</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-0 bg-gray-50">
                    <div className="divide-y">
                        {filteredPoints.length > 0 ? (
                            filteredPoints.map(point => (
                                <div 
                                    key={point.id} 
                                    className={cn(
                                        "p-4 cursor-pointer hover:bg-white transition-colors",
                                        selectedPoint?.id === point.id ? "bg-white border-l-4 border-[#5669FF]" : ""
                                    )}
                                    onClick={() => setSelectedPoint(point)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-sm text-[#120d26]">{point.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {point.address}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "w-2 h-2 rounded-full mt-1.5",
                                            point.status === "รอการรักษา" ? "bg-red-500" :
                                            point.status === "กำลังรักษา" ? "bg-yellow-500" : "bg-green-500"
                                        )} />
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                                            {point.type}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                ไม่พบข้อมูลที่ค้นหา
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Map Visualization Area */}
        <div className="lg:col-span-3 h-full relative rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-[#e5e7eb]">
            {/* Map Placeholder Background */}
            <div className="absolute inset-0 bg-[#AAD3DF] opacity-50 pattern-grid-lg" 
                 style={{ 
                     backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Chiang_Mai_Amphoe.svg/800px-Chiang_Mai_Amphoe.svg.png")',
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     filter: 'grayscale(30%) opacity(0.6)'
                 }}
            >
                {/* Fallback pattern if image fails to load or for style */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="icon" className="bg-white text-gray-700 hover:bg-gray-100 shadow-md">
                    <span className="text-xl">+</span>
                </Button>
                <Button size="icon" className="bg-white text-gray-700 hover:bg-gray-100 shadow-md">
                    <span className="text-xl">-</span>
                </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-100 text-xs space-y-2">
                <h4 className="font-semibold mb-1">สถานะผู้ป่วย</h4>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>รอการรักษา</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span>กำลังรักษา</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>รักษาแล้ว</span>
                </div>
            </div>

            {/* Map Markers (Simulated) */}
            {filteredPoints.map((point) => (
                <div
                    key={point.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10"
                    style={{ 
                        top: `${point.lat}%`, 
                        left: `${point.lng}%` 
                    }}
                    onClick={() => setSelectedPoint(point)}
                >
                    <div className="relative group">
                        <MapPin 
                            className={cn(
                                "w-8 h-8 drop-shadow-md",
                                point.status === "รอการรักษา" ? "text-red-500 fill-red-100" :
                                point.status === "กำลังรักษา" ? "text-yellow-500 fill-yellow-100" : "text-green-500 fill-green-100"
                            )} 
                        />
                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black/80 text-white text-xs p-2 rounded whitespace-nowrap z-20">
                            {point.name}
                        </div>
                    </div>
                </div>
            ))}

            {/* Selected Point Detail Popover (Simulated on Map) */}
            {selectedPoint && (
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl p-4 w-[280px] border border-gray-100 animate-in fade-in zoom-in-95 duration-200 z-30">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-[#120d26]">{selectedPoint.name}</h3>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-gray-400 hover:text-gray-600 -mt-1 -mr-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPoint(null);
                            }}
                        >
                            x
                        </Button>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{selectedPoint.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4 shrink-0" />
                            <span>{selectedPoint.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Layers className="w-4 h-4 shrink-0" />
                            <span>{selectedPoint.hospital}</span>
                        </div>
                        
                        <div className="pt-2 border-t mt-2 flex justify-between items-center">
                            <span className={cn(
                                "px-2 py-1 rounded text-xs font-bold",
                                selectedPoint.status === "รอการรักษา" ? "bg-red-100 text-red-700" :
                                selectedPoint.status === "กำลังรักษา" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                            )}>
                                {selectedPoint.status}
                            </span>
                            <Button 
                                size="sm" 
                                variant="link" 
                                className="text-[#5669FF] p-0 h-auto"
                                onClick={() => {
                                    const mockPatient = {
                                        id: selectedPoint.id,
                                        code: `HN-${String(selectedPoint.id).padStart(6, '0')}`,
                                        idCard: "x-xxxx-xxxxx-xx-x",
                                        name: selectedPoint.name,
                                        diagnosis: selectedPoint.type,
                                        hospital: selectedPoint.hospital,
                                        treatmentRight: "บัตรทอง",
                                        status: selectedPoint.status === "กำลังรักษา" ? "Active" : "Inactive",
                                    };
                                    onViewPatient?.(mockPatient);
                                }}
                            >
                                ดูรายละเอียด
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}