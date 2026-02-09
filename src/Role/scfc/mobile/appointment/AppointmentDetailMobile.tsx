import React from 'react';
import { 
  Hospital,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Printer
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Appointment } from "./AppointmentSystem";

export function AppointmentDetailMobile({ appointment, onBack }: { appointment: Appointment, onBack: () => void }) {
    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center gap-3 shadow-sm">
                <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">รายละเอียดนัดหมาย</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{appointment.id}</p>
                </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <Card className="p-4 border-slate-200 shadow-sm bg-white rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                             <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-black text-lg">
                                 {appointment.patientName.charAt(0)}
                             </div>
                             <div>
                                 <h3 className="font-bold text-slate-800 text-base">{appointment.patientName}</h3>
                                 <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                     <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{appointment.hn}</span>
                                     <span>• {appointment.province}</span>
                                 </div>
                             </div>
                        </div>
                        <Badge variant="outline" className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            appointment.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            appointment.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                            {appointment.status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                         <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <div className="flex items-center gap-2 text-slate-400 mb-1">
                                 <Calendar size={14} />
                                 <span className="text-[10px] font-bold uppercase">วันที่นัดหมาย</span>
                             </div>
                             <div className="text-sm font-bold text-slate-800">
                                 {format(new Date(appointment.date), "d MMM yyyy", { locale: th })}
                             </div>
                         </div>
                         <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <div className="flex items-center gap-2 text-slate-400 mb-1">
                                 <Clock size={14} />
                                 <span className="text-[10px] font-bold uppercase">เวลา</span>
                             </div>
                             <div className="text-sm font-bold text-slate-800">
                                 {appointment.time} น.
                             </div>
                         </div>
                    </div>

                    <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Hospital size={14} className="text-teal-600" />
                            <span className="text-xs font-bold text-slate-700">{appointment.hospital}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-teal-600" />
                            <span className="text-xs font-medium text-slate-600">{appointment.clinic}</span>
                        </div>
                    </div>
                </Card>

                {appointment.needsIntervention && (
                    <Card className="p-4 border-rose-100 bg-rose-50/50 shadow-sm rounded-xl">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                                <AlertTriangle size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-rose-700 mb-1">ต้องการการประสานงาน</h3>
                                <p className="text-xs text-rose-600/80 leading-relaxed">
                                    เคสนี้มีความเสี่ยงสูงหรือต้องการการยืนยันด่วน กรุณาติดต่อผู้ป่วยหรือโรงพยาบาลปลายทาง
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button className="flex-1 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 shadow-sm h-9 text-xs font-bold">
                                <Phone size={14} className="mr-1.5" /> โทรติดต่อ
                            </Button>
                             <Button className="flex-1 bg-rose-600 text-white hover:bg-rose-700 shadow-sm h-9 text-xs font-bold">
                                รับเรื่อง
                            </Button>
                        </div>
                    </Card>
                )}

                <div className="grid grid-cols-2 gap-3">
                     <Button variant="outline" className="h-12 border-slate-200 text-slate-600 font-bold bg-white rounded-xl shadow-sm">
                         <Printer size={16} className="mr-2" /> พิมพ์ใบนัด
                     </Button>
                     <Button className="h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md shadow-teal-100">
                         <CheckCircle2 size={16} className="mr-2" /> ยืนยันนัดหมาย
                     </Button>
                </div>
            </div>
        </div>
    )
}
