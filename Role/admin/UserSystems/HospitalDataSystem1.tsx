import React, { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Edit2, Building2, MapPin, Users, Activity, Stethoscope, ChevronLeft } from "lucide-react";
import { HospitalDataSystemEdit } from './HospitalDataSystemEdit';

interface HospitalDataSystem1Props {
  id?: number;
  onBack?: () => void;
}

const mockHospitalDetails: Record<number, any> = {
  1: {
    name: "โรงพยาบาลมหาราชนครเชียงใหม่",
    code: "10001",
    province: "เชียงใหม่",
    status: "Active",
    examRooms: [
        { id: '101', name: 'ห้องตรวจอายุรกรรม 1' },
        { id: '102', name: 'ห้องตรวจอายุรกรรม 2' },
        { id: '103', name: 'ห้องตรวจศัลยกรรม 1' },
        { id: '104', name: 'ห้องตรวจกุมารเวชกรรม' },
        { id: '105', name: 'ห้องฉุกเฉิน' },
    ],
    staff: [
        { id: 's1', name: 'ศ.นพ. สมชาย ใจดี' },
        { id: 's2', name: 'รศ.พญ. สมหญิง รักดี' },
        { id: 's3', name: 'ผศ.นพ. เก่งกาจ วิชา' },
        { id: 's4', name: 'อ.พญ. เมตตา ปรานี' },
        { id: 's5', name: 'พญ. สุดา งามตา' },
    ]
  },
  2: {
    name: "โรงพยาบาลสันป่าตอง",
    code: "10002",
    province: "เชียงใหม่",
    status: "Active",
    examRooms: [
        { id: '201', name: 'OPD 1' },
        { id: '202', name: 'OPD 2' },
        { id: '203', name: 'ห้องทำแผล' },
    ],
    staff: [
        { id: 's6', name: 'นพ. วิชัย มั่นคง' },
        { id: 's7', name: 'พญ. กานดา สดใส' },
        { id: 's8', name: 'ทพ. สมศักดิ์ ฟันดี' },
    ]
  },
  3: {
    name: "รพ.สต.บ้านกลาง",
    code: "20001",
    province: "เชียงใหม่",
    status: "Active",
    examRooms: [
        { id: '301', name: 'ห้องตรวจโรคทั่วไป' },
        { id: '302', name: 'ห้องให้คำปรึกษา' },
    ],
    staff: [
        { id: 's9', name: 'นาง สมศรี พยาบาล' },
        { id: 's10', name: 'นาย สมชาย สาธารณสุข' },
    ]
  },
  4: {
    name: "รพ.สต.ทุ่งต้อม",
    code: "20002",
    province: "เชียงใหม่",
    status: "Inactive",
    examRooms: [
        { id: '401', name: 'ห้องตรวจโรคทั่วไป' },
    ],
    staff: [
        { id: 's11', name: 'นาง มาลี ใจดี' },
    ]
  },
  5: {
    name: "โรงพยาบาลนครพิงค์",
    code: "10003",
    province: "เชียงใหม่",
    status: "Active",
    examRooms: [
        { id: '501', name: 'ห้องตรวจอายุรกรรม' },
        { id: '502', name: 'ห้องตรวจศัลยกรรม' },
        { id: '503', name: 'ห้องตรวจสูตินารีเวช' },
        { id: '504', name: 'ห้องทันตกรรม' },
    ],
    staff: [
        { id: 's12', name: 'นพ. ปรีชา สามารถ' },
        { id: 's13', name: 'พญ. วรรณา งดงาม' },
        { id: 's14', name: 'ทพญ. สุดสวย ยิ้มสวย' },
        { id: 's15', name: 'ภก. สมหมาย ยาดี' },
    ]
  },
  6: {
    name: "รพ.สต.ดอนแก้ว",
    code: "20003",
    province: "เชียงใหม่",
    status: "Active",
    examRooms: [
        { id: '601', name: 'ห้องตรวจโรคทั่วไป 1' },
        { id: '602', name: 'ห้องตรวจโรคทั่วไป 2' },
        { id: '603', name: 'ห้องกายภาพบำบัด' },
    ],
    staff: [
        { id: 's16', name: 'นาย อุดม สมบูรณ์' },
        { id: 's17', name: 'นาง สาวิตรี มีโชค' },
        { id: 's18', name: 'นส. กรรณิการ์ น่ารัก' },
    ]
  }
};

const defaultHospital = {
    name: "โรงพยาบาลไม่ระบุ",
    code: "UNKNOWN",
    province: "ไม่ระบุ",
    status: "Inactive",
    examRooms: [],
    staff: []
};

export function HospitalDataSystem1({ id, onBack }: HospitalDataSystem1Props) {
  const [isEditing, setIsEditing] = useState(false);

  // Get data based on ID
  const hospitalData = id ? (mockHospitalDetails[id] || defaultHospital) : defaultHospital;

  if (isEditing) {
    return <HospitalDataSystemEdit onBack={() => setIsEditing(false)} />;
  }

  return (
    <div className="bg-white min-h-full rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300 relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
             {onBack && (
               <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                 <ChevronLeft className="w-5 h-5 text-slate-500" />
               </Button>
             )}
             <div className="p-3 bg-indigo-50 rounded-xl">
                 <Building2 className="w-8 h-8 text-[#5e50ee]" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-800">ข้อมูลโรงพยาบาล</h2>
                <p className="text-slate-500 text-sm">รายละเอียดและสถานะปัจจุบันของโรงพยาบาล</p>
             </div>
        </div>
        <Button 
          onClick={() => setIsEditing(true)}
          className="bg-[#5e50ee] hover:bg-[#4b3fd0] text-white shadow-md shadow-indigo-100"
        >
          <Edit2 className="mr-2 h-4 w-4" /> แก้ไขข้อมูล
        </Button>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Main Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Hospital Identity */}
            <Card className="md:col-span-2 border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#5e50ee] to-[#7367f0] p-6 text-white">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {hospitalData.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 opacity-90">
                        <MapPin className="w-4 h-4" />
                        <span>จังหวัด{hospitalData.province}</span>
                    </div>
                </div>
                <div className="p-6 bg-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">สถานะการใช้งาน</p>
                            <Badge className={hospitalData.status === 'Active' ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-slate-100 text-slate-700"}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${hospitalData.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                {hospitalData.status}
                            </Badge>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-slate-500 mb-1">รหัสหน่วยงาน</p>
                             <p className="font-mono font-medium text-slate-700">{hospitalData.code}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats / Summary */}
            <Card className="border-slate-100 shadow-sm p-6 flex flex-col justify-center space-y-4">
                 <div className="flex items-center gap-4">
                     <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                         <Stethoscope className="w-6 h-6" />
                     </div>
                     <div>
                         <p className="text-2xl font-bold text-slate-800">{hospitalData.examRooms.length}</p>
                         <p className="text-sm text-slate-500">ห้องตรวจทั้งหมด</p>
                     </div>
                 </div>
                 <div className="w-full h-px bg-slate-100"></div>
                 <div className="flex items-center gap-4">
                     <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                         <Users className="w-6 h-6" />
                     </div>
                     <div>
                         <p className="text-2xl font-bold text-slate-800">{hospitalData.staff.length}</p>
                         <p className="text-sm text-slate-500">บุคลากรทางการแพทย์</p>
                     </div>
                 </div>
            </Card>

        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Exam Rooms List */}
            <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    รายชื่อห้องตรวจ
                </h4>
                <div className="bg-slate-50 rounded-xl p-1">
                    {hospitalData.examRooms.map((room: any, index: number) => (
                        <div key={room.id} className="p-4 bg-white m-1 rounded-lg shadow-sm border border-slate-100 flex items-center justify-between">
                            <span className="font-medium text-slate-700">{room.name}</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Room {index + 1}</span>
                        </div>
                    ))}
                    {hospitalData.examRooms.length === 0 && (
                        <div className="p-8 text-center text-slate-400">ไม่พบข้อมูลห้องตรวจ</div>
                    )}
                </div>
            </div>

            {/* Staff List */}
            <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    รายชื่อผู้รักษา
                </h4>
                <div className="bg-slate-50 rounded-xl p-1">
                    {hospitalData.staff.map((person: any) => (
                        <div key={person.id} className="p-4 bg-white m-1 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {person.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-slate-700">{person.name}</p>
                                <p className="text-xs text-slate-400">Medical Staff</p>
                            </div>
                        </div>
                    ))}
                    {hospitalData.staff.length === 0 && (
                        <div className="p-8 text-center text-slate-400">ไม่พบข้อมูลบุคลากร</div>
                    )}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
