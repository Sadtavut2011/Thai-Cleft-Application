import React from 'react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar as CalendarIcon, 
  User, 
  Phone,
  Navigation,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";

// Define the interface locally or import it if shared. 
// For simplicity and avoiding circular deps if not exported, re-defining compatible shape here or using 'any' if lazy.
// Ideally, types should be in a shared types file. 
// I will redefine a compatible interface here for now.

export interface VisitRequestDetailProps {
  request: {
    id: string;
    patientName: string;
    patientId: string;
    patientAddress: string;
    type: 'Joint' | 'Delegated';
    rph: string;
    requestDate: string;
    status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
    note?: string;
  };
  onBack: () => void;
  onRecordResult?: () => void;
}

export function HomeVisitRequestDetail({ request, onBack, onRecordResult }: VisitRequestDetailProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div>
                <h2 className="text-xl font-bold text-[#5e5873]">รายละเอียดคำขอเยี่ยมบ้าน</h2>
                <p className="text-sm text-gray-500">รหัสคำขอ: {request.id}</p>
            </div>
        </div>
        <div className="flex items-center gap-3 pl-14 md:pl-0">
            {request.status === 'Pending' && (
                <Badge className="bg-orange-100 text-orange-600 border-orange-200 px-4 py-1.5 text-sm">รอการตอบรับ</Badge>
            )}
            {request.status === 'Accepted' && (
                <Badge className="bg-blue-100 text-blue-600 border-blue-200 px-4 py-1.5 text-sm">กำลังดำเนินการ</Badge>
            )}
            {request.status === 'Completed' && (
                <Badge className="bg-green-100 text-green-600 border-green-200 px-4 py-1.5 text-sm">เสร็จสิ้น</Badge>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
              <Card>
                  <CardHeader className="pb-3 border-b">
                      <CardTitle className="text-lg text-[#5e5873] flex items-center gap-2">
                          <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="flex items-start gap-6">
                          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                              <User className="w-10 h-10 text-gray-400" />
                          </div>
                          <div className="space-y-4 flex-1">
                              <div>
                                  <h3 className="text-xl font-bold text-[#5e5873]">{request.patientName}</h3>
                                  <p className="text-gray-500">HN: {request.patientId}</p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-start gap-2 text-sm text-gray-600">
                                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                                      <span>{request.patientAddress}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Phone className="w-4 h-4 text-gray-400" />
                                      <span>08x-xxx-xxxx</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader className="pb-3 border-b">
                      <CardTitle className="text-lg text-[#5e5873] flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#7367f0]" /> รายละเอียดการเยี่ยม
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                              <label className="text-sm text-gray-500">ประเภทการเยี่ยม</label>
                              <div className="font-medium flex items-center gap-2">
                                  {request.type === 'Joint' ? (
                                      <span className="flex items-center gap-1 text-[#7367f0]">
                                          <User className="w-4 h-4" /> ลงเยี่ยมพร้อม รพ.สต.
                                      </span>
                                  ) : (
                                      <span className="flex items-center gap-1 text-[#7367f0]">
                                          <Navigation className="w-4 h-4" /> ฝาก รพ.สต. เยี่ยม
                                      </span>
                                  )}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-sm text-gray-500">หน่วยงานที่รับผิดชอบ</label>
                              <div className="font-medium flex items-center gap-2">
                                  <Home className="w-4 h-4 text-gray-400" /> {request.rph}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-sm text-gray-500">วันที่แจ้งคำขอ</label>
                              <div className="font-medium flex items-center gap-2">
                                  <CalendarIcon className="w-4 h-4 text-gray-400" /> {request.requestDate}
                              </div>
                          </div>
                          <div className="space-y-1">
                              <label className="text-sm text-gray-500">ความเร่งด่วน</label>
                              <div className="font-medium flex items-center gap-2 text-orange-500">
                                  <AlertCircle className="w-4 h-4" /> ปานกลาง
                              </div>
                          </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200 mt-4">
                          <label className="text-sm text-gray-500 block mb-2">หมายเหตุ / อาการเบื้องต้น</label>
                          <p className="text-gray-700 leading-relaxed">
                              {request.note || "ไม่มีรายละเอียดเพิ่มเติม"}
                          </p>
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
              <Card>
                  <CardHeader className="pb-3 border-b">
                      <CardTitle className="text-lg text-[#5e5873]">การดำเนินการ</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-3">
                      {request.status === 'Accepted' && request.type === 'Joint' && (
                        <Button 
                            className="w-full bg-green-600 hover:bg-green-700 shadow-md text-white mb-2"
                            onClick={onRecordResult}
                        >
                            <FileText className="w-4 h-4 mr-2" /> บันทึกผลการเยี่ยมบ้าน (F1)
                        </Button>
                      )}
                      
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Phone className="w-4 h-4 mr-2" /> ติดต่อ รพ.สต.
                      </Button>
                      <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                          ยกเลิกคำขอ
                      </Button>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader className="pb-3 border-b">
                      <CardTitle className="text-lg text-[#5e5873]">สถานะการติดตาม</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                      <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                          <div className="relative">
                              <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                              <p className="text-sm font-semibold text-[#5e5873]">สร้างคำขอเยี่ยมบ้าน</p>
                              <p className="text-xs text-gray-400">{request.requestDate}</p>
                          </div>
                          <div className="relative">
                              <div className={cn("absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white", request.status !== 'Pending' ? "bg-green-500" : "bg-gray-300")}></div>
                              <p className={cn("text-sm font-semibold", request.status !== 'Pending' ? "text-[#5e5873]" : "text-gray-400")}>ตอบรับคำขอ</p>
                              <p className="text-xs text-gray-400">-</p>
                          </div>
                          <div className="relative">
                              <div className={cn("absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white", request.status === 'Completed' ? "bg-green-500" : "bg-gray-300")}></div>
                              <p className={cn("text-sm font-semibold", request.status === 'Completed' ? "text-[#5e5873]" : "text-gray-400")}>ลงพื้นที่เยี่ยมบ้าน</p>
                              <p className="text-xs text-gray-400">-</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}