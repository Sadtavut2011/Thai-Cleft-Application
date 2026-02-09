import React from 'react';
import { 
  ArrowLeft, 
  Monitor, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  ExternalLink, 
  UserCheck, 
  UserX, 
  Signal, 
  ShieldAlert, 
  Video, 
  Clock, 
  Building2,
  Stethoscope,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/ui/select";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Separator } from "../../../../../components/ui/separator";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
import { cn } from "../../../../../components/ui/utils";

type TeleStatus = 'Active' | 'Waiting' | 'Scheduled' | 'Delayed' | 'Tech Issue' | 'Completed';
type Platform = 'Zoom' | 'MS Teams' | 'Hospital Link';

interface TeleSession {
  id: string;
  patientName: string;
  hn: string;
  sourceUnit: string;
  specialist: string;
  specialistHospital: string;
  platform: Platform;
  status: TeleStatus;
  urgency: 'Normal' | 'Urgent';
  linkStatus: 'Live' | 'Expired' | 'Checking';
  waitingTime: number;
  connectionStability: number;
  startTime?: string;
}

interface TeleDetailPageProps {
  session: TeleSession;
  stabilityData: any[];
  onBack: () => void;
}

export function TeleDetailPage({ session, stabilityData, onBack }: TeleDetailPageProps) {
  const getStatusColor = (status: TeleStatus) => {
    switch (status) {
      case 'Active': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Waiting': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Tech Issue': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Delayed': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 font-sans pb-12">
      
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-5">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-12 w-12 rounded-full hover:bg-teal-50 text-teal-600 border border-teal-50 transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1.5">
               <Badge className={cn("text-[9px] h-4 font-black uppercase px-2 border-none tracking-widest", getStatusColor(session.status))}>
                  {session.status}
               </Badge>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session ID: {session.id}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{session.patientName}</h2>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-500 mt-1">
               <span className="flex items-center gap-1.5"><Building2 size={14} className="text-teal-500" /> {session.sourceUnit}</span>
               <span className="w-1 h-1 rounded-full bg-slate-300"></span>
               <span className="flex items-center gap-1.5"><Video size={14} className="text-teal-500" /> {session.platform}</span>
               {session.startTime && (
                 <>
                   <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                   <span className="flex items-center gap-1.5"><Clock size={14} className="text-teal-500" /> {session.startTime}</span>
                 </>
               )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <Button variant="outline" className="flex-1 md:flex-none h-12 border-rose-200 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all">
             <ShieldAlert size={16} className="mr-2" /> รายงานปัญหาเทคนิค
           </Button>
           <Button className="flex-1 md:flex-none h-12 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-teal-600/20 px-8 transition-all active:scale-95">
             <Monitor size={16} className="mr-2" /> เข้าสู่ระบบตรวจ (JOIN)
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Control Column */}
        <div className="xl:col-span-2 space-y-6">
           
           {/* Connection Stability Graph */}
           <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                   <Signal className="w-4 h-4" /> วิเคราะห์ความเสถียรของการเชื่อมต่อ (Live Connectivity)
                </CardTitle>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Stable Connection</span>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[250px] w-full" style={{ width: '100%', height: '250px', minWidth: 0 }}>
                   <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                      <AreaChart data={stabilityData}>
                         <defs>
                           <linearGradient id="colorStability" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                           </linearGradient>
                         </defs>
                         <Area type="monotone" dataKey="stability" stroke="#0d9488" fill="url(#colorStability)" strokeWidth={3} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Packet Loss</p>
                      <p className="text-lg font-black text-slate-800">0.02%</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Latency</p>
                      <p className="text-lg font-black text-teal-600">45ms</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Bitrate</p>
                      <p className="text-lg font-black text-slate-800">4.2 Mbps</p>
                   </div>
                </div>
              </CardContent>
           </Card>

           {/* Technical and Specialist Controls */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                 <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                   <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                      <Cpu className="w-4 h-4" /> Technical Controls
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <Button variant="outline" className="w-full h-12 border-amber-200 text-amber-600 bg-amber-50/50 hover:bg-amber-100 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                       <RefreshCw size={18} className="mr-2" /> สร้างลิงก์สำรอง (RE-GENERATE LINK)
                    </Button>
                    <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95">
                       <ExternalLink size={18} className="mr-2" /> บังคับเปิดห้องประชุม (FORCE START)
                    </Button>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                 <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                   <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" /> Specialist Management
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">เปลี่ยนตัวแพทย์ผู้เชี่ยวชาญ</p>
                       <Select defaultValue="none">
                          <SelectTrigger className="h-12 text-[11px] font-black uppercase border-slate-200 rounded-xl bg-slate-50">
                             <div className="flex items-center gap-2">
                                <UserCheck size={18} className="text-teal-600" /> 
                                <SelectValue placeholder="เลือกแพทย์จากรายชื่อสำรอง..." />
                             </div>
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl font-sans">
                             <SelectItem value="none" className="text-xs font-bold">เลือกแพทย์สำรอง...</SelectItem>
                             <SelectItem value="d1" className="text-xs font-bold">นพ. เกรียงไกร (ว่าง)</SelectItem>
                             <SelectItem value="d2" className="text-xs font-bold">พญ. จันจิรา (ว่าง)</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <Button variant="outline" className="w-full h-12 border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-100 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
                       <UserX size={18} className="mr-2" /> แจ้งแพทย์ล่าช้าเกิน 15 นาที
                    </Button>
                 </CardContent>
              </Card>
           </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
           
           {/* Case Coordinator Messaging */}
           <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white flex flex-col h-[500px]">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
                <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                   <MessageSquare className="w-4 h-4" /> ช่องทางสื่อสารประสานงาน
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                 <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                       <div className="flex flex-col gap-2">
                          <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 text-sm font-medium text-slate-700 leading-relaxed max-w-[90%]">
                             <p className="text-[10px] font-black text-teal-600 uppercase tracking-tighter mb-1">Case Manager (ป่าซาง)</p>
                             ลิงก์ Zoom เข้าไม่ได้ครับ เหมือนคนไข้หลุดบ่อย ช่วยตรวจสอบหน่อยครับ
                          </div>
                       </div>

                       <div className="flex flex-col gap-2 items-end">
                          <div className="bg-teal-600 text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-teal-600/10 text-sm font-medium leading-relaxed max-w-[90%]">
                             <p className="text-[10px] font-black text-teal-100 uppercase tracking-tighter mb-1">SCFC Admin</p>
                             รับทราบครับ ตรวจสอบความเสถียรแล้วพบความผิดปกติที่ต้นทาง กำลังรีเซ็ตลิงก์และเตรียมลิงก์สำรองให้ครับ
                          </div>
                       </div>
                    </div>
                 </ScrollArea>
                 <div className="p-4 border-t border-slate-50">
                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                       <Input 
                         placeholder="คุยกับหน่วยงาน..." 
                         className="border-none bg-transparent h-10 focus-visible:ring-0 text-xs font-bold"
                       />
                       <Button size="icon" className="h-10 w-10 bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-600/20 shrink-0">
                          <Send size={16} />
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Specialist Info Card */}
           <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white p-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="bg-teal-50 p-3 rounded-2xl text-teal-600">
                    <Stethoscope size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">แพทย์ผู้ให้คำปรึกษา</p>
                    <h4 className="text-base font-black text-slate-900 leading-tight">{session.specialist}</h4>
                    <p className="text-[10px] text-teal-600 font-bold mt-1 uppercase tracking-tighter">{session.specialistHospital}</p>
                 </div>
              </div>
              <Separator className="mb-6" />
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">นัดหมายเวลา</span>
                    <span className="text-[11px] font-black text-slate-800 tracking-tight">13:30 น. (Today)</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ประเภทการตรวจ</span>
                    <Badge variant="outline" className="text-[9px] font-black text-teal-600 border-teal-100 uppercase tracking-widest">Initial Consultation</Badge>
                 </div>
              </div>
           </Card>

           {/* System Recommendation */}
           <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldCheck size={100} />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-teal-400">
                <ShieldCheck size={16} /> Technical Audit Guide
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium italic relative z-10">
                "หากการเชื่อมต่อมีค่า Latency สูงเกิน 150ms แนะนำให้สลับไปใช้ระบบ Hospital Link (Internal) เพื่อความปลอดภัยของข้อมูลและความเสถียรสูงสุด"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}