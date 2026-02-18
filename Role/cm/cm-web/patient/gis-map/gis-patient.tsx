import React, { useState, useMemo } from "react";
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
import { Map, MapPin, Search, Layers, User } from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { PATIENTS_DATA, Patient } from "../../../../../data/patientData";

// Get unique diagnosis list from data (same pattern as TreatmentPlanSystem)
const UNIQUE_DIAGNOSES = Array.from(new Set(PATIENTS_DATA.map(p => p.diagnosis))).filter(Boolean);

// Age range filter options (same as TreatmentPlanSystem)
const AGE_RANGES = [
  { label: 'ทุกช่วงอายุ', value: 'all' },
  { label: '0 - 1 ปี', value: '0-12', min: 0, max: 12 },
  { label: '1 - 3 ปี', value: '12-36', min: 12, max: 36 },
  { label: '3 - 6 ปี', value: '36-72', min: 36, max: 72 },
  { label: '6 - 12 ปี', value: '72-144', min: 72, max: 144 },
  { label: '12 ปีขึ้นไป', value: '144+', min: 144, max: Infinity },
];

// Helper: parse age string to numeric months for filtering
const parseAgeToMonths = (ageStr: string): number => {
  if (!ageStr || ageStr === '-') return -1;
  const yearMatch = ageStr.match(/(\d+)\s*ปี/);
  const monthMatch = ageStr.match(/(\d+)\s*เดือน/);
  let months = 0;
  if (yearMatch) months += parseInt(yearMatch[1]) * 12;
  if (monthMatch) months += parseInt(monthMatch[1]);
  return months;
};

// Approximate bounds for Chiang Mai
const MAP_BOUNDS = {
  minLat: 17.5,
  maxLat: 20.2, // Expanded slightly to fit Fang (19.9)
  minLng: 97.8,
  maxLng: 99.8
};

interface GISSystemProps {
  onViewPatient?: (patient: any) => void;
}

export default function GISSystem({ onViewPatient }: GISSystemProps) {
  const [selectedHospital] = useState("โรงพยาบาลฝาง");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAge, setFilterAge] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("fang");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState("all");

  // Transform PATIENTS_DATA into Map Points
  const mapPoints = useMemo(() => {
    return PATIENTS_DATA.map((p, index) => {
      // 1. Calculate position percentage
      // Default to center of CM if no GPS
      const lat = p.gpsLocation?.lat || 18.8; 
      const lng = p.gpsLocation?.lng || 99.0;

      // Simple linear interpolation to % (inverted Y for top)
      let topPct = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
      let leftPct = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;

      // Clamp to keep inside container
      topPct = Math.max(5, Math.min(95, topPct));
      leftPct = Math.max(5, Math.min(95, leftPct));

      // 2. Map Status
      let statusThai = "รอการรักษา"; // Default
      if (p.status === 'Active') statusThai = "กำลังรักษา";
      else if (p.status === 'Completed') statusThai = "รักษาแล้ว";
      else if (p.status === 'Inactive') statusThai = "รอการรักษา";

      // 3. Map Diagnosis
      let typeThai = "Cleft Lip and Palate";
      const diag = (p.diagnosis || "").toLowerCase();
      if (diag.includes("lip") && !diag.includes("palate")) typeThai = "Cleft Lip";
      else if (!diag.includes("lip") && diag.includes("palate")) typeThai = "Cleft Palate";

      return {
        id: p.id,
        // use index as numeric id for mapping if needed, or string id
        lat: topPct,
        lng: leftPct,
        name: p.name,
        hospital: p.hospital || "โรงพยาบาลฝาง",
        status: statusThai,
        type: typeThai,
        address: p.contact?.address || "ไม่ระบุที่อยู่",
        originalData: p
      };
    });
  }, []);

  const filteredPoints = mapPoints.filter(point => {
    const matchHospital = point.hospital.includes("ฝาง") || selectedHospital === "โรงพยาบาลฝาง"; 
    
    const matchType = selectedType === "all" || point.originalData.diagnosis === selectedType;
    const matchSearch = point.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        point.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (point.originalData.hn && point.originalData.hn.includes(searchTerm));
    const matchesAge = filterAge === "all" ? true : parseAgeToMonths(point.originalData.age) >= (AGE_RANGES.find(a => a.value === filterAge)?.min || -1) && parseAgeToMonths(point.originalData.age) <= (AGE_RANGES.find(a => a.value === filterAge)?.max || Infinity);
    
    return matchHospital && matchType && matchSearch && matchesAge;
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
                                placeholder="ค้นหาชื่อ, HN" 
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Dropdowns - same style as TreatmentPlanSystem */}
                        <div className="flex flex-col gap-2">
                          <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="h-[34px] w-full px-2.5 pr-7 border border-gray-200 rounded-[6px] bg-slate-50 text-xs text-[#5e5873] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0] truncate"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                          >
                            <option value="all">ผลการวินิจฉัย: ทั้งหมด</option>
                            {UNIQUE_DIAGNOSES.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                          <select
                            value={filterAge}
                            onChange={(e) => setFilterAge(e.target.value)}
                            className="h-[34px] w-full px-2.5 pr-7 border border-gray-200 rounded-[6px] bg-slate-50 text-xs text-[#5e5873] appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#7367f0] focus:border-[#7367f0]"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%235e5873' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                          >
                            {AGE_RANGES.map(r => (
                              <option key={r.value} value={r.value}>
                                {r.value === 'all' ? 'ช่วงอายุ: ทั้งหมด' : `อายุ: ${r.label}`}
                              </option>
                            ))}
                          </select>
                        </div>
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
            {/* Area Filter - Top of Map */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                <span className="text-xs font-medium text-[#5e5873] bg-white px-2 py-1.5 rounded-[6px] shadow-md border border-gray-200">พื้นที่:</span>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="bg-white border-gray-200 h-8 text-xs w-[130px] shadow-md">
                        <SelectValue placeholder="อำเภอ" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fang">อ.ฝาง</SelectItem>
                        <SelectItem value="mae-ai">อ.แม่อาย</SelectItem>
                        <SelectItem value="chai-prakan">อ.ไชยปราการ</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={selectedSubDistrict} onValueChange={setSelectedSubDistrict}>
                    <SelectTrigger className="bg-white border-gray-200 h-8 text-xs w-[130px] shadow-md">
                        <SelectValue placeholder="ตำบล" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">ทุกตำบล</SelectItem>
                        <SelectItem value="wiang">ต.เวียง</SelectItem>
                        <SelectItem value="mon-pin">ต.ม่อนปิ่น</SelectItem>
                        <SelectItem value="santhisuk">ต.สันทิศุข</SelectItem>
                        <SelectItem value="mae-ngon">ต.แม่งอน</SelectItem>
                        <SelectItem value="mae-suk">ต.แม่สูน</SelectItem>
                    </SelectContent>
                </Select>
            </div>

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

            {/* Map Markers (Using Calculated Percentage) */}
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
                                    if (onViewPatient) {
                                        onViewPatient(selectedPoint.originalData);
                                    }
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