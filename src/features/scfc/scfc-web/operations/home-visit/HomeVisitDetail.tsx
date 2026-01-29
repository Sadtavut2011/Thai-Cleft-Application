import React from 'react';
import { 
  ArrowLeft, Calendar, User, FileText, 
  CheckCircle2, XCircle, MapPin, Users,
  Activity, ArrowUpRight, Camera, Phone, Clock
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Badge } from "../../../../../components/ui/badge";
import { Separator } from "../../../../../components/ui/separator";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "../../../../../components/ui/utils";

export interface Visit {
  id: string;
  patientName: string;
  hn: string;
  province: string;
  hospital: string;
  team: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Missed';
  type: 'ทั่วไป' | 'หลังผ่าตัด' | 'ฉุกเฉิน';
  priority: 'ต่ำ' | 'กลาง' | 'สูง';
}

interface HomeVisitDetailProps {
  visit: Visit;
  onBack: () => void;
}

export function HomeVisitDetail({ visit, onBack }: HomeVisitDetailProps) {
  // Mock Timeline Data
  const timeline = [
    { date: '2026-01-10 09:00', title: 'สร้างคำขอเยี่ยมบ้าน', by: 'พญ. สมหญิง (ศัลยแพทย์)', status: 'completed' },
    { date: '2026-01-11 14:30', title: 'SCFC อนุมัติและมอบหมายทีม', by: 'Admin Center', status: 'completed' },
    { date: '2026-01-12 10:00', title: 'ทีมรับเรื่องและยืนยันนัด', by: visit.team, status: 'completed' },
    { date: visit.date, title: 'กำหนดการเยี่ยมบ้าน', by: 'ระบบอัตโนมัติ', status: visit.status === 'Confirmed' ? 'current' : 'pending' },
    { date: '-', title: 'บันทึกผลการเยี่ยม', by: '-', status: 'pending' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack} className="h-10 w-10 p-0 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50">
            <ArrowLeft size={18} className="text-slate-600" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">รายละเอียดการเยี่ยมบ้าน</h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <span>รหัสการเยี่ยม: {visit.id}</span>
              <span className="text-slate-300">•</span>
              <span>HN: {visit.hn}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="h-10 border-slate-200 text-slate-700 font-bold bg-white shadow-sm">
                <Phone size={16} className="mr-2"/> ติดต่อทีมเยี่ยมบ้าน
            </Button>
            <Button variant="default" className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-10 px-4 rounded-lg shadow-sm">
                <FileText size={16} className="mr-2"/> บันทึกผลการเยี่ยม
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient & Location Card */}
          <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
               <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                 <User size={16} className="text-teal-600" /> ข้อมูลผู้ป่วยและสถานที่
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">ชื่อ-นามสกุล</label>
                    <div className="text-base font-bold text-slate-900">{visit.patientName}</div>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">HN</label>
                    <div className="text-base font-bold text-slate-900">{visit.hn}</div>
                </div>
                <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">ที่อยู่ / พิกัด</label>
                    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <MapPin size={20} className="text-teal-600 mt-0.5 shrink-0" />
                        <div>
                            <div className="text-sm font-bold text-slate-800">บ้านเลขที่ 123 หมู่ 4 ต.แม่ริม อ.แม่ริม จ.เชียงใหม่ 50180</div>
                            <div className="text-xs text-slate-500 mt-1">Lat: 18.9134, Long: 98.9432</div>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                            <ArrowUpRight size={16} /> นำทาง
                        </Button>
                    </div>
                </div>
            </CardContent>
          </Card>

          {/* Visit Details Card */}
          <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
               <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                 <Activity size={16} className="text-teal-600" /> ข้อมูลการปฏิบัติงาน
               </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">วันที่นัดหมาย</label>
                    <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Calendar size={16} className="text-teal-500"/>
                        {format(new Date(visit.date), "d MMMM yyyy", { locale: th })}
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">ทีมรับผิดชอบ</label>
                    <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Users size={16} className="text-teal-500"/> {visit.team}
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">ประเภทการเยี่ยม</label>
                    <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 text-xs font-bold px-3 py-1">
                        {visit.type}
                    </Badge>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">ความเร่งด่วน</label>
                    <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
                        visit.priority === 'สูง' ? "bg-rose-50 text-rose-600" :
                        visit.priority === 'กลาง' ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
                    )}>
                        {visit.priority}
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">วัตถุประสงค์ / หมายเหตุ</label>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                        ติดตามอาการหลังผ่าตัดศัลยกรรมตกแต่งริมฝีปาก ตรวจดูแผลผ่าตัด และแนะนำการดูแลรักษาความสะอาดช่องปากเพิ่มเติม รวมถึงประเมินพัฒนาการเบื้องต้น
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Status & Timeline */}
        <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                    <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-wider">สถานะการดำเนินงาน</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div className="flex flex-col gap-2">
                         <div className={cn(
                           "w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm font-black uppercase tracking-widest border",
                           visit.status === 'Confirmed' ? "bg-teal-50 text-teal-600 border-teal-100" :
                           visit.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                           "bg-rose-50 text-rose-600 border-rose-100"
                         )}>
                           {visit.status === 'Confirmed' ? <CheckCircle2 size={20}/> :
                            visit.status === 'Pending' ? <Clock size={20}/> : <XCircle size={20}/>}
                           {visit.status === 'Confirmed' ? 'ยืนยันการเยี่ยมแล้ว' :
                            visit.status === 'Pending' ? 'รอยืนยัน / กำลังดำเนินการ' : 'ขาดการเยี่ยม / ยกเลิก'}
                         </div>
                    </div>

                    <Separator className="bg-slate-100" />
                    
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-4">Timeline การติดตาม</label>
                        <div className="relative pl-2 space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            {timeline.map((item, index) => (
                                <div key={index} className="relative flex gap-4">
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 ring-4 ring-white",
                                        item.status === 'completed' ? "bg-teal-600" :
                                        item.status === 'current' ? "bg-amber-500 animate-pulse" : "bg-slate-300"
                                    )}></div>
                                    <div className="flex-1">
                                        <div className={cn("text-xs font-bold", item.status === 'pending' ? "text-slate-400" : "text-slate-800")}>
                                            {item.title}
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">{item.by}</div>
                                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                    <CardTitle className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Camera size={16} className="text-teal-600" /> รูปภาพการเยี่ยม (ล่าสุด)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-32 flex flex-col items-center justify-center text-slate-400 gap-2 hover:bg-slate-100 transition-colors cursor-pointer">
                        <Camera size={24} />
                        <span className="text-xs font-bold">ยังไม่มีรูปภาพ</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}