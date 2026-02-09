import React from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  User, 
  Building2, 
  DollarSign, 
  Activity,
  History,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Download,
  Info,
  Paperclip
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../components/ui/card";
import { Separator } from "../../../../../components/ui/separator";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { cn } from "../../../../../components/ui/utils";

interface FundRequest {
  id: string;
  patientName: string;
  hn: string;
  diagnosis: string;
  fundType: string;
  amount: number;
  requestDate: string;
  urgency: 'Normal' | 'Urgent' | 'Emergency';
  hospital: string;
  status: string;
  rejectReason?: string;
  documents: string[];
  history: { date: string; action: string; user: string }[];
}

interface FundRequestDetailPageProps {
  request: FundRequest;
  onBack: () => void;
  onApprove: (req: FundRequest) => void;
  onReject: () => void;
}

export function FundRequestDetailPage({ request, onBack, onApprove, onReject }: FundRequestDetailPageProps) {
  const UrgencyBadge = ({ level }: { level: string }) => {
    const colors = {
      Normal: "bg-teal-50 text-teal-700 border-teal-100",
      Urgent: "bg-amber-50 text-amber-700 border-amber-100",
      Emergency: "bg-rose-50 text-rose-700 border-rose-100",
    } as any;
    const labels = { Normal: 'ปกติ', Urgent: 'เร่งด่วน', Emergency: 'วิกฤต/เร่งด่วนที่สุด' } as any;
    return <Badge className={cn("border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5", colors[level])}>{labels[level]}</Badge>;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-teal-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 rounded-full hover:bg-teal-50 text-teal-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UrgencyBadge level={request.urgency} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Request ID: {request.id}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{request.patientName}</h2>
            <p className="text-sm font-bold text-slate-500">HN: {request.hn} • {request.hospital}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 md:flex-none h-11 border-rose-200 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[10px] rounded-xl"
            onClick={onReject}
          >
            <XCircle className="w-4 h-4 mr-2" /> ปฏิเสธ (Reject)
          </Button>
          <Button 
            className="flex-1 md:flex-none h-11 bg-teal-600 hover:bg-teal-700 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-teal-600/20"
            onClick={() => onApprove(request)}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" /> อนุมัติทุน (Approve)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                <Info className="w-4 h-4" /> รายละเอียดการขอทุน
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-6">
                  <div className="group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-teal-500" /> แหล่งทุนที่เสนอ
                    </p>
                    <p className="text-sm font-black text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-teal-200 transition-colors">
                      {request.fundType}
                    </p>
                  </div>

                  <div className="group">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Activity className="w-3 h-3 text-teal-500" /> การวินิจฉัย / เหตุผลที่ขอ
                    </p>
                    <p className="text-sm font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[100px] leading-relaxed group-hover:border-teal-200 transition-colors">
                      {request.diagnosis}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-600/20 transform transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-teal-100 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <DollarSign className="w-3 h-3" /> จำนวนเงินที่ต้องการ
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black tracking-tight">฿{request.amount.toLocaleString()}</span>
                      <span className="text-teal-100 text-xs font-bold uppercase">บาท</span>
                    </div>
                    <Separator className="my-4 bg-white/20" />
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-teal-100">
                      <span>สถานะปัจจุบัน:</span>
                      <Badge className="bg-white/20 text-white border-none text-[9px] px-2">รอพิจารณา</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-teal-500" /> ข้อมูลเวลา
                    </p>
                    <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-500">วันที่ยื่นคำขอ:</span>
                      <span className="font-black text-slate-900">{request.requestDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                <Paperclip className="w-4 h-4" /> เอกสารประกอบ (Documents)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {request.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-teal-400 hover:bg-white transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="bg-teal-100 p-3 rounded-xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 tracking-tight">{doc}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">PDF • 2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-teal-600 hover:bg-teal-50">
                          <Eye className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                          <Download className="w-4 h-4" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Context */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-teal-600 flex items-center gap-2">
                <History className="w-4 h-4" /> ประวัติการทำงาน (Audit Log)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-6 space-y-6 relative">
                  <div className="absolute left-[33px] top-8 bottom-8 w-0.5 bg-slate-100"></div>
                  {request.history.map((log, i) => (
                    <div key={i} className="flex items-start gap-4 relative z-10">
                      <div className={cn(
                        "p-2 rounded-full border shadow-sm",
                        i === 0 ? "bg-teal-600 text-white border-teal-500" : "bg-white text-slate-400 border-slate-100"
                      )}>
                        <Activity className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-slate-800 tracking-tight">{log.action}</p>
                        <div className="flex flex-col mt-1">
                          <p className="text-[9px] text-teal-600 font-black uppercase tracking-widest flex items-center gap-1.5">
                             <User className="w-2.5 h-2.5" /> {log.user}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1.5 mt-0.5">
                             <Clock className="w-2.5 h-2.5" /> {log.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="border border-teal-100 bg-teal-50/30 rounded-2xl p-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-teal-600 p-2 rounded-lg text-white shadow-md">
                   <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-[11px] font-black text-teal-800 uppercase tracking-widest">ข้อแนะนำ SCFC</h4>
             </div>
             <p className="text-xs font-medium text-teal-700 leading-relaxed italic">
               "โปรดตรวจสอบเอกสารรายได้และภาพถ่ายบ้านของผู้ป่วยให้ครบถ้วนก่อนการอนุมัติ เพื่อให้มั่นใจว่าทุนการศึกษา/ทุนสนับสนุนเข้าถึงกลุ่มเป้าหมายที่แท้จริง"
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
}