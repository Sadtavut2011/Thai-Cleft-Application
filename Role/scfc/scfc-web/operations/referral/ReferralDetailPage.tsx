import React from 'react';
import { 
  ArrowLeft, 
  XCircle, 
  MessageSquare, 
  Send, 
  History, 
  Stethoscope, 
  MapPin, 
  Building2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Activity,
  Ambulance,
  ArrowRight,
  AlertCircle,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { Separator } from "../../../../../components/ui/separator";
import { cn } from "../../../../../components/ui/utils";

type ReferralStatus = 'ส่งคำขอแล้ว' | 'รอการตอบรับ' | 'นัดหมายแล้ว' | 'ได้รับการรักษาแล้ว' | 'ส่งตัวกลับพื้นที่';
type Urgency = 'ปกติ' | 'เร่งด่วน' | 'ฉุกเฉิน';

interface ReferralCase {
  id: string;
  patientName: string;
  hn: string;
  sourceHospital: string;
  destHospital?: string;
  destinationHospital?: string;
  status: ReferralStatus;
  urgency: Urgency;
  requestDate?: string;
  date?: string;
  responseTime?: string; 
  isBottleneck?: boolean;
  history?: { date: string; action: string; user: string }[];
}

interface ReferralDetailPageProps {
  referral: ReferralCase;
  onBack: () => void;
}

export function ReferralDetailPage({ referral, onBack }: ReferralDetailPageProps) {
  const destHospital = referral.destHospital || (referral as any).destinationHospital || '-';
  const requestDate = referral.requestDate || (referral as any).date || '-';
  const history = referral.history || [
    { date: requestDate, action: 'ส่งคำขอส่งตัวผู้ป่วย', user: 'ระบบอัตโนมัติ' },
    { date: requestDate, action: 'รอการตอบรับจากโรงพยาบาลปลายทาง', user: 'SCFC Admin' },
  ];

  const getUrgencyColor = (urgency: Urgency) => {
    switch (urgency) {
      case 'ฉุกเฉิน': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'เร่งด่วน': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-teal-50 text-teal-600 border-teal-100';
    }
  };

  const getStatusStep = (status: ReferralStatus) => {
    const steps = ['ส่งคำขอแล้ว', 'รอการตอบรับ', 'นัดหมายแล้ว', 'ได้รับการรักษาแล้ว', 'ส่งตัวกลับพื้นที่'];
    return steps.indexOf(status);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 font-sans pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-teal-100 shadow-sm sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 rounded-full hover:bg-teal-50 text-teal-600">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="bg-teal-600 text-white p-3 rounded-2xl shadow-lg shadow-teal-600/20 hidden sm:flex">
              <Ambulance size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn("text-[9px] h-4 font-black uppercase px-2 border-none tracking-widest", getUrgencyColor(referral.urgency))}>
                  {referral.urgency}
                </Badge>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case ID: {referral.id}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{referral.patientName}</h2>
              <p className="text-xs font-bold text-slate-500">HN: {referral.hn} • สถานะ: {referral.status}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-11 border-slate-200 text-slate-600 font-black uppercase tracking-widest text-[10px] rounded-xl px-6">
            <MoreVertical className="w-4 h-4 mr-2" /> ตัวเลือกเพิ่มเติม
          </Button>
          <Button className="flex-1 md:flex-none h-11 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-teal-600/20 px-8">
            <CheckCircle2 className="w-4 h-4 mr-2" /> อัปเดตสถานะ (Update)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Tracker Card */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                <Activity className="w-4 h-4" /> แผนภูมิกระบวนการส่งต่อ (Referral Pipeline)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative">
                <div className="absolute top-[22px] left-0 right-0 h-1 bg-slate-100 rounded-full"></div>
                <div 
                  className="absolute top-[22px] left-0 h-1 bg-teal-600 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(13,148,136,0.4)]"
                  style={{ width: `${(getStatusStep(referral.status) / 4) * 100}%` }}
                ></div>
                <div className="relative flex justify-between">
                  {['ส่งคำขอ', 'รอตอบรับ', 'นัดหมาย', 'รักษา', 'ส่งกลับ'].map((step, i) => {
                    const isActive = i <= getStatusStep(referral.status);
                    const isCurrent = i === getStatusStep(referral.status);
                    return (
                      <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-md transition-all duration-500",
                          isActive ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          {i === 0 && <Send size={18} />}
                          {i === 1 && <Clock size={18} />}
                          {i === 2 && <Calendar size={18} />}
                          {i === 3 && <Stethoscope size={18} />}
                          {i === 4 && <RotateCcw size={18} />}
                        </div>
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          isActive ? "text-teal-700" : "text-slate-400"
                        )}>{step}</span>
                        {isCurrent && (
                          <div className="absolute -top-10 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-md animate-bounce uppercase">
                            Current
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Path Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white p-6 flex items-center gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">โรงพยาบาลต้นทาง (Source)</p>
                   <h4 className="text-base font-black text-slate-900 leading-tight">{referral.sourceHospital}</h4>
                   <p className="text-[10px] text-teal-600 font-bold mt-1">ประสานงานสำเร็จ</p>
                </div>
             </Card>

             <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white p-6 flex items-center gap-6">
                <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
                   <MapPin className="w-8 h-8 text-teal-600" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">โรงพยาบาลปลายทาง (Destination)</p>
                   <h4 className="text-base font-black text-teal-700 leading-tight">{destHospital}</h4>
                   <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <p className="text-[10px] text-emerald-600 font-bold">รอตอบรับ (Pending)</p>
                   </div>
                </div>
             </Card>
          </div>

          {/* Clinical Context / Messaging Section */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row justify-between items-center">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> การสื่อสารระหว่างหน่วยงาน (Communication Hub)
              </CardTitle>
              <Badge variant="outline" className="bg-white text-teal-600 border-teal-100 text-[9px] font-black px-2">LIVE CHAT</Badge>
            </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[350px] p-6">
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-xl bg-slate-200 shrink-0 flex items-center justify-center text-[10px] font-black">CS</div>
                        <div className="space-y-2">
                           <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm max-w-[85%]">
                              <p className="text-[10px] font-black text-teal-600 uppercase tracking-tighter mb-1">Case Manager (ป่าซาง)</p>
                              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                 คนไข้มีอาการติดเชื้อรุนแรงที่เพดานโหว่ มีไข้สูง 39.5 องศา ต้องการส่งด่วนไปที่มหาราชเพื่อผ่าตัดล้างแผลครับ แผนกศัลยกรรมแจ้งว่าเตียงเต็ม
                              </p>
                           </div>
                           <p className="text-[9px] text-slate-400 font-bold ml-1 uppercase tracking-tighter">08:30 น. • อ่านแล้ว</p>
                        </div>
                     </div>

                     <div className="flex gap-4 flex-row-reverse">
                        <div className="w-8 h-8 rounded-xl bg-teal-600 text-white shrink-0 flex items-center justify-center text-[10px] font-black shadow-md shadow-teal-600/20">SC</div>
                        <div className="space-y-2 flex flex-col items-end">
                           <div className="bg-teal-600 text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-teal-600/10 max-w-[85%]">
                              <p className="text-[10px] font-black text-teal-100 uppercase tracking-tighter mb-1">SCFC Admin (Central)</p>
                              <p className="text-sm font-medium leading-relaxed">
                                 รับเรื่องแล้วครับ กำลังประสานงานกับแผนกฉุกเฉิน (ER) มหาราชเพื่อหาเตียงสำรองให้ครับ คาดว่าจะทราบผลภายใน 15 นาที
                              </p>
                           </div>
                           <p className="text-[9px] text-slate-400 font-bold mr-1 uppercase tracking-tighter">08:35 น. • ส่งแล้ว</p>
                        </div>
                     </div>
                  </div>
               </ScrollArea>
               <Separator />
               <div className="p-4 bg-slate-50/50 flex gap-3">
                  <Input 
                    placeholder="พิมพ์ข้อความตอบกลับหน่วยงาน..." 
                    className="h-12 border-slate-200 bg-white shadow-inner rounded-xl font-bold text-xs"
                  />
                  <Button className="h-12 w-12 bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-600/20 shrink-0 active:scale-95 transition-all">
                     <Send className="w-5 h-5" />
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          {/* History / Audit Log */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                <History className="w-4 h-4" /> บันทึกสถานะ (Audit Trail)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <ScrollArea className="h-[450px]">
                  <div className="p-8 space-y-8 relative">
                     <div className="absolute left-[41px] top-10 bottom-10 w-0.5 bg-slate-100 shadow-inner"></div>
                     {history.map((h, i) => (
                        <div key={i} className="flex gap-5 relative z-10">
                           <div className={cn(
                             "w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500",
                             i === 0 ? "bg-teal-600 text-white ring-4 ring-teal-50" : "bg-white text-slate-300 border-slate-100"
                           )}>
                             <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-white animate-pulse" : "bg-slate-300")}></div>
                           </div>
                           <div className="flex-1">
                              <p className="text-[11px] font-black text-slate-800 tracking-tight leading-none mb-1.5">{h.action}</p>
                              <div className="flex flex-col gap-0.5">
                                 <p className="text-[9px] text-teal-600 font-black uppercase tracking-widest">{h.user}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1.5">
                                    <Clock size={10} /> {h.date}
                                 </p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </ScrollArea>
            </CardContent>
          </Card>

          {/* SCFC System Recommendation */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                <ShieldCheck size={120} />
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-teal-400">
                <AlertCircle size={16} /> การประเมินความเสี่ยง SCFC
             </div>
             <p className="text-xs text-slate-300 leading-relaxed font-medium mb-6 relative z-10">
                เคสนี้เป็น <span className="text-white font-black underline decoration-teal-500 decoration-2 underline-offset-4 tracking-tight">ฉุกเฉินระดับ 1</span> แนะนำให้เจ้าหน้าที่ประสานงานผ่านช่องทางโทรศัพท์ด่วน (สายด่วนส่งต่อ) หากไม่ได้รับคำตอบภายใน 10 นาที
             </p>
             <Button className="w-full h-11 bg-teal-600 hover:bg-teal-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-teal-600/20 relative z-10 active:scale-95 transition-all">
                โทรประสานงานด่วน
             </Button>
          </div>

          <Card className="border border-teal-100 bg-teal-50/30 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-teal-600 p-2 rounded-lg text-white shadow-md">
                   <Activity size={14} />
                </div>
                <h4 className="text-[11px] font-black text-teal-800 uppercase tracking-widest">Clinical Guideline</h4>
             </div>
             <ul className="space-y-2">
                {['ประเมินสัญญาณชีพทุก 15 นาที', 'งดน้ำและอาหาร (NPO)', 'เตรียมผล Lab ล่าสุดใส่ซองส่งตัว'].map((item, i) => (
                   <li key={i} className="flex items-start gap-2 text-[10px] font-medium text-teal-700 leading-relaxed">
                      <div className="w-1 h-1 rounded-full bg-teal-400 mt-1.5 shrink-0"></div>
                      {item}
                   </li>
                ))}
             </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RotateCcw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}