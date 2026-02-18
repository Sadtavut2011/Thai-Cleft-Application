import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Video, 
  MapPin, 
  Building2, 
  Smartphone,
  CheckCircle2,
  XCircle,
  Stethoscope
} from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";


const THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const formatThaiFullDate = (d: Date) => `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;

interface TeleFormProps {
  data: any;
  onBack: () => void;
}

export function TeleForm({ data, onBack }: TeleFormProps) {
  if (!data) return null;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300">
      {/* CSS Hack to hide mobile bottom navigation */}
      <style>{`
        .fixed.bottom-0.z-50.rounded-t-\\[24px\\] {
            display: none !important;
        }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">รายละเอียดนัดหมาย</h1>
      </div>

      <div className="p-4 md:p-6 max-w-2xl mx-auto w-full space-y-6 pb-24">
            {/* Status Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                     data.status === 'Completed' ? 'bg-green-100 text-green-600' :
                     data.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                     'bg-blue-100 text-blue-600'
                 }`}>
                     {data.status === 'Completed' ? <CheckCircle2 size={32} /> :
                      data.status === 'Cancelled' ? <XCircle size={32} /> :
                      <Calendar size={32} />}
                 </div>
                 <h2 className="text-xl font-bold text-slate-800">
                     {data.status === 'Completed' ? 'เสร็จสิ้น' :
                      data.status === 'Cancelled' ? 'ยกเลิก' :
                      'นัดหมายล่วงหน้า'}
                 </h2>
                 <p className="text-slate-500 text-sm">
                    รหัสการนัดหมาย: {data.id}
                 </p>
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                 <div className="flex items-center gap-2 text-[#7066a9] border-b border-slate-100 pb-3">
                     <User size={20} />
                     <h3 className="font-bold text-lg">ข้อมูลผู้ป่วย</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                         <label className="text-xs text-slate-400 block mb-1">ชื่อ-นามสกุล</label>
                         <div className="font-medium text-slate-800">{data.patientName}</div>
                     </div>
                     <div>
                         <label className="text-xs text-slate-400 block mb-1">HN</label>
                         <div className="font-medium text-slate-800">{data.hn || '-'}</div>
                     </div>
                 </div>
            </div>

            {/* Appointment Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                 <div className="flex items-center gap-2 text-[#7066a9] border-b border-slate-100 pb-3">
                     <Clock size={20} />
                     <h3 className="font-bold text-lg">วันและเวลา</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                         <label className="text-xs text-slate-400 block mb-1">วันที่</label>
                         <div className="font-medium text-slate-800">
                            {data.date ? formatThaiFullDate(new Date(data.date)) : '-'}
                         </div>
                     </div>
                     <div>
                         <label className="text-xs text-slate-400 block mb-1">เวลา</label>
                         <div className="font-medium text-slate-800">{data.time || '-'} น.</div>
                     </div>
                 </div>
            </div>

            {/* Treatment Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                 <div className="flex items-center gap-2 text-[#7066a9] border-b border-slate-100 pb-3">
                     <Stethoscope size={20} />
                     <h3 className="font-bold text-lg">รายละเอียดการรักษา</h3>
                 </div>
                 <p className="text-slate-700 leading-relaxed">
                     {data.treatmentDetails || '-'}
                 </p>
            </div>

            {/* Connection Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                 <div className="flex items-center gap-2 text-[#7066a9] border-b border-slate-100 pb-3">
                     <Video size={20} />
                     <h3 className="font-bold text-lg">ช่องทางการเชื่อมต่อ</h3>
                 </div>
                 
                 <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          data.channel === 'Direct' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                          {data.channel === 'Direct' ? <Smartphone size={20} /> : <Building2 size={20} />}
                      </div>
                      <div>
                          <div className="font-bold text-slate-800">
                              {data.channel === 'Direct' ? 'Direct (ผู้ป่วยเชื่อมต่อเอง)' : 'Via Host (ผ่านหน่วยงาน)'}
                          </div>
                          {data.channel === 'Intermediary' && data.intermediaryName && (
                              <div className="text-xs text-slate-500">
                                  ผ่าน: {data.intermediaryName}
                              </div>
                          )}
                      </div>
                 </div>

                 <div>
                     <label className="text-xs text-slate-400 block mb-1">Meeting Link</label>
                     <a href={data.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all block">
                         {data.meetingLink || '-'}
                     </a>
                 </div>

                 {/* Participants */}
                 <div className="pt-2">
                     <label className="text-xs text-slate-400 block mb-2">ผู้เข้าร่วม</label>
                     <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-500">Case Manager:</span>
                             <span className="font-medium text-slate-800 text-right">{data.caseManager || '-'}</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-slate-500">Hospital:</span>
                             <span className="font-medium text-slate-800 text-right">{data.hospital || '-'}</span>
                         </div>
                         {data.channel === 'Intermediary' && (
                             <div className="flex justify-between text-sm">
                                 <span className="text-slate-500">PCU/Host:</span>
                                 <span className="font-medium text-slate-800 text-right">{data.pcu || '-'}</span>
                             </div>
                         )}
                     </div>
                 </div>
            </div>

            {/* Fixed Footer with Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[60] flex gap-3">
                <Button 
                    onClick={onBack}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl text-base border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                    ย้อนกลับ
                </Button>
                <Button 
                    onClick={() => data.meetingLink && window.open(data.meetingLink, '_blank')}
                    disabled={!data.meetingLink}
                    className="flex-1 h-12 rounded-xl text-base bg-[#7066a9] hover:bg-[#5f5690] text-white shadow-md shadow-indigo-200 font-bold flex items-center justify-center gap-2"
                >
                    <Video size={20} />
                    เข้าร่วมประชุม
                </Button>
            </div>
      </div>
    </div>
  );
}