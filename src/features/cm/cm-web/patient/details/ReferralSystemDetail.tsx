import React from 'react';
import { ArrowLeft, Building2, Calendar, FileText, Send, MapPin, User, CheckCircle2, Clock, AlertCircle, Activity } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';

interface ReferralSystemDetailProps {
    data: any;
    onBack: () => void;
}

export const ReferralSystemDetail: React.FC<ReferralSystemDetailProps> = ({ data, onBack }) => {
    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-[#5e5873]">รายละเอียดการส่งตัว</h1>
                    <p className="text-sm text-gray-500">ข้อมูลการส่งต่อผู้ป่วยและสถานะการดำเนินการ</p>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl mb-6">
                <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#00cfe8]/10 p-2 rounded-lg text-[#00cfe8]">
                                <Send size={24} />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-[#5e5873]">ใบส่งตัว (Referral Letter)</CardTitle>
                                <p className="text-sm text-gray-500">เลขที่อ้างอิง: REF-{Math.floor(Math.random() * 10000)}</p>
                            </div>
                        </div>
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2",
                            data.status === 'Accepted' || data.status === 'Approved' ? "bg-green-100 text-green-700" :
                            data.status === 'Rejected' ? "bg-red-100 text-red-700" :
                            "bg-orange-100 text-orange-700"
                        )}>
                            {data.status === 'Accepted' || data.status === 'Approved' ? <CheckCircle2 size={16} /> :
                             data.status === 'Rejected' ? <AlertCircle size={16} /> :
                             <Clock size={16} />}
                            {data.status === 'Accepted' || data.status === 'Approved' ? 'อนุมัติ/ตอบรับแล้ว' :
                             data.status === 'Rejected' ? 'ปฏิเสธ' : 'รอการตอบรับ'}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    {/* Flow */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                         <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">ต้นทาง</p>
                                <p className="font-semibold text-gray-700">รพ.สต. บ้านใหม่</p>
                            </div>
                         </div>
                         
                         <div className="flex-1 w-full md:px-4 flex items-center justify-center">
                            <div className="h-[2px] w-full bg-gray-300 relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-2 text-gray-400">
                                    <Send size={16} />
                                </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <div className="text-right">
                                <p className="text-xs text-gray-500">ปลายทาง</p>
                                <p className="font-semibold text-[#7367f0]">{data.destination || 'ไม่ระบุ'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#7367f0] flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <Building2 size={20} />
                            </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Calendar size={18} className="text-gray-400" /> วันที่ส่งตัว
                            </h3>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl">
                                <p className="text-gray-700">{data.date || '-'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <FileText size={18} className="text-gray-400" /> สิทธิการรักษา
                            </h3>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl">
                                <p className="text-gray-700">บัตรทอง (UC)</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Activity size={18} className="text-gray-400" /> สาเหตุการส่งตัว / การวินิจฉัย
                        </h3>
                        <div className="p-6 bg-white border border-gray-200 rounded-xl min-h-[120px]">
                            <p className="text-gray-600 leading-relaxed">
                                {data.treatment || '-'}
                                <br/>
                                <span className="text-sm text-gray-400 mt-2 block">
                                    หมายเหตุ: ผู้ป่วยต้องการการดูแลเฉพาะทางเพิ่มเติมในส่วนของศัลยกรรมตกแต่ง
                                </span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
