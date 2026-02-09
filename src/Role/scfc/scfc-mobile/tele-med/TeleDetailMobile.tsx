import React from 'react';
import { 
  ArrowLeft, 
  Monitor, 
  Signal, 
  ShieldAlert, 
  Video, 
  Clock, 
  Stethoscope,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { cn } from "../../../../components/ui/utils";

export type TeleStatus = 'Active' | 'Waiting' | 'Scheduled' | 'Delayed' | 'Tech Issue' | 'Completed';
export type Platform = 'Zoom' | 'MS Teams' | 'Hospital Link';

export interface TeleSession {
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

interface TeleDetailMobileProps {
  session: TeleSession;
  onBack: () => void;
}

export function TeleDetailMobile({ session, onBack }: TeleDetailMobileProps) {
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
    <div className="flex flex-col h-full bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">Tele-Consult</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{session.id}</p>
          </div>
        </div>
        <Badge className={cn("text-[9px] font-bold px-2 py-1 rounded-full border-none", getStatusColor(session.status))}>
            {session.status}
        </Badge>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1 pb-24">
         {/* Patient Info Card */}
         <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Monitor size={14} className="text-teal-600" /> ข้อมูลผู้ป่วย
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                    <Clock size={12} /> {session.startTime || 'N/A'}
                </div>
            </div>
            <div className="p-4 space-y-3">
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-medium">ชื่อ-นามสกุล</span>
                    <span className="text-xs text-slate-800 font-bold">{session.patientName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-medium">HN</span>
                    <span className="text-xs text-slate-800 font-bold">{session.hn}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-slate-500 font-medium">หน่วยงานต้นทาง</span>
                    <span className="text-xs text-slate-800 font-bold text-right max-w-[200px] truncate">{session.sourceUnit}</span>
                </div>
            </div>
         </Card>

         {/* Connection Info */}
         <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
             <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                     <Signal size={14} className="text-teal-600" /> สถานะการเชื่อมต่อ
                 </span>
                 <div className="flex items-center gap-1">
                     <div className={cn("w-1.5 h-1.5 rounded-full", session.connectionStability > 80 ? "bg-emerald-500 animate-pulse" : "bg-rose-500")}></div>
                     <span className={cn("text-[9px] font-black uppercase tracking-widest", session.connectionStability > 80 ? "text-emerald-600" : "text-rose-600")}>
                         {session.connectionStability > 80 ? "Stable" : "Unstable"}
                     </span>
                 </div>
             </div>
             <div className="p-4 grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                     <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Platform</p>
                     <p className="text-sm font-black text-slate-800">{session.platform}</p>
                 </div>
                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                     <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Waiting</p>
                     <p className={cn("text-sm font-black", session.waitingTime > 30 ? "text-rose-600" : "text-slate-800")}>{session.waitingTime} min</p>
                 </div>
             </div>
         </Card>

         {/* Specialist Info */}
         <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
             <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                 <Stethoscope size={14} className="text-teal-600" />
                 <span className="text-xs font-bold text-slate-700">แพทย์ผู้เชี่ยวชาญ</span>
             </div>
             <div className="p-4 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shadow-sm">
                     <Stethoscope size={20} />
                 </div>
                 <div>
                     <p className="text-sm font-black text-slate-800">{session.specialist}</p>
                     <p className="text-[10px] text-teal-600 font-bold uppercase">{session.specialistHospital}</p>
                 </div>
             </div>
         </Card>


      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] flex gap-3 z-30">
          <Button variant="outline" className="flex-1 h-12 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">
              <ShieldAlert size={18} className="mr-2 text-rose-500" /> แจ้งปัญหา
          </Button>
          <Button className="flex-[2] h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20">
              <Video size={18} className="mr-2" /> เข้าสู่ระบบ
          </Button>
      </div>
    </div>
  );
}
