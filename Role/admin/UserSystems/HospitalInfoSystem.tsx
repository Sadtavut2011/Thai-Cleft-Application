import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  MapPin, 
  Building2, 
  Users, 
  Activity, 
  Pencil, 
  Building,
  UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/components/ui/utils";
import { HospitalDataSystem1 } from "./HospitalDataSystem1";

// Types
interface HospitalStats {
  totalPatients: number;
  activeCases: number;
  staffCount: number;
}

interface Hospital {
  id: number;
  name: string;
  code: string;
  province: string;
  district: string;
  type: "Parent" | "PCU";
  parentNetwork: string | null; // Name of parent hospital if PCU, null if Parent
  stats: HospitalStats;
  status: "Active" | "Inactive";
}

// Mock Data
const mockHospitals: Hospital[] = [
  {
    id: 1,
    name: "โรงพยาบาลมหาราชนครเชียงใหม่",
    code: "10001",
    province: "เชียงใหม่",
    district: "เมือง",
    type: "Parent",
    parentNetwork: null,
    stats: { totalPatients: 1250, activeCases: 450, staffCount: 120 },
    status: "Active",
  },
  {
    id: 2,
    name: "โรงพยาบาลสันป่าตอง",
    code: "10002",
    province: "เชียงใหม่",
    district: "สันป่าตอง",
    type: "Parent",
    parentNetwork: null,
    stats: { totalPatients: 850, activeCases: 210, staffCount: 45 },
    status: "Active",
  },
  {
    id: 3,
    name: "รพ.สต.บ้านกลาง",
    code: "20001",
    province: "เชียงใหม่",
    district: "สันป่าตอง",
    type: "PCU",
    parentNetwork: "โรงพยาบาลสันป่าตอง",
    stats: { totalPatients: 45, activeCases: 12, staffCount: 5 },
    status: "Active",
  },
  {
    id: 4,
    name: "รพ.สต.ทุ่งต้อม",
    code: "20002",
    province: "เชียงใหม่",
    district: "สันป่าตอง",
    type: "PCU",
    parentNetwork: "โรงพยาบาลสันป่าตอง",
    stats: { totalPatients: 32, activeCases: 8, staffCount: 4 },
    status: "Inactive",
  },
  {
    id: 5,
    name: "โรงพยาบาลนครพิงค์",
    code: "10003",
    province: "เชียงใหม่",
    district: "แม่ริม",
    type: "Parent",
    parentNetwork: null,
    stats: { totalPatients: 980, activeCases: 320, staffCount: 85 },
    status: "Active",
  },
  {
    id: 6,
    name: "รพ.สต.ดอนแก้ว",
    code: "20003",
    province: "เชียงใหม่",
    district: "แม่ริม",
    type: "PCU",
    parentNetwork: "โรงพยาบาลนครพิงค์",
    stats: { totalPatients: 65, activeCases: 25, staffCount: 8 },
    status: "Active",
  },
];

export function HospitalInfoManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null);

  if (selectedHospitalId) {
    return <HospitalDataSystem1 id={selectedHospitalId} onBack={() => setSelectedHospitalId(null)} />;
  }

  // Get unique provinces
  const provinces = Array.from(new Set(mockHospitals.map(h => h.province)));

  // Filter Logic
  const filteredHospitals = mockHospitals.filter(hospital => {
    const matchesSearch = 
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      hospital.code.includes(searchTerm);
    const matchesType = selectedType === "all" || hospital.type === selectedType;
    const matchesProvince = selectedProvince === "all" || hospital.province === selectedProvince;

    return matchesSearch && matchesType && matchesProvince;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800">ข้อมูลโรงพยาบาล (Hospital Information)</h2>
        <div className="text-sm text-gray-500">จัดการข้อมูลเครือข่ายโรงพยาบาลและหน่วยบริการปฐมภูมิ</div>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-1 gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="ค้นหาชื่อ หรือ รหัสโรงพยาบาล..." 
              className="pl-9 bg-white border-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="w-[200px]">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="ประเภทโรงพยาบาล" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด (All Types)</SelectItem>
                <SelectItem value="Parent">แม่ข่าย (Parent Hospital)</SelectItem>
                <SelectItem value="PCU">รพ.สต./ศูนย์สุขภาพ (PCU)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Province Filter */}
          <div className="w-[180px]">
             <Select value={selectedProvince} onValueChange={setSelectedProvince}>
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="จังหวัด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกจังหวัด</SelectItem>
                {provinces.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="bg-[#7367f0] hover:bg-[#655bd3] text-white gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          ลงทะเบียนโรงพยาบาลใหม่
        </Button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-[0px_4px_24px_0px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100">
        <Table>
          <TableHeader className="bg-[#f8f8f8]">
            <TableRow>
              <TableHead className="w-[50px] font-semibold text-gray-600">#</TableHead>
              <TableHead className="w-[300px] font-semibold text-gray-600">ข้อมูลโรงพยาบาล (Hospital Info)</TableHead>
              <TableHead className="w-[150px] font-semibold text-gray-600">ประเภท (Type)</TableHead>
              <TableHead className="w-[200px] font-semibold text-gray-600">สังกัดเครือข่าย (CUP)</TableHead>
              <TableHead className="font-semibold text-gray-600">สถิติการดำเนินงาน (Performance)</TableHead>
              <TableHead className="w-[100px] font-semibold text-gray-600">สถานะ</TableHead>
              <TableHead className="w-[100px] text-right font-semibold text-gray-600">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital, index) => (
                <TableRow 
                  key={hospital.id} 
                  className="hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => setSelectedHospitalId(hospital.id)}
                >
                  <TableCell className="text-gray-500">{index + 1}</TableCell>
                  
                  {/* General Info */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#5e5873] text-[15px]">{hospital.name}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">#{hospital.code}</span>
                        <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {hospital.district}, {hospital.province}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    {hospital.type === 'Parent' ? (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none shadow-none font-medium">
                        <Building2 className="h-3 w-3 mr-1" /> Parent Hospital
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none font-medium">
                        <Building className="h-3 w-3 mr-1" /> PCU / Health Center
                      </Badge>
                    )}
                  </TableCell>

                  {/* Parent Network */}
                  <TableCell>
                    {hospital.type === 'PCU' ? (
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        {hospital.parentNetwork}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>

                  {/* Performance Stats */}
                  <TableCell>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-gray-500 text-xs mb-0.5">
                                <Users className="h-3 w-3" />
                                <span>ผู้ป่วย</span>
                            </div>
                            <span className="font-semibold text-gray-700">{hospital.stats.totalPatients}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-emerald-600 text-xs mb-0.5">
                                <Activity className="h-3 w-3" />
                                <span>รักษาอยู่</span>
                            </div>
                            <span className="font-semibold text-emerald-600">{hospital.stats.activeCases}</span>
                        </div>
                         <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 text-blue-600 text-xs mb-0.5">
                                <UserCog className="h-3 w-3" />
                                <span>จนท.</span>
                            </div>
                            <span className="font-semibold text-blue-600">{hospital.stats.staffCount}</span>
                        </div>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <Switch checked={hospital.status === 'Active'} />
                        <span className={cn(
                            "text-xs font-medium",
                            hospital.status === 'Active' ? "text-emerald-600" : "text-gray-400"
                        )}>
                            {hospital.status}
                        </span>
                     </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#7367f0] hover:bg-indigo-50">
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#7367f0] hover:bg-indigo-50">
                            <UserCog className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                  ไม่พบข้อมูลโรงพยาบาลที่ค้นหา
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
