import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, FileText, Activity } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';

interface AppointmentDetailPageProps {
    data: any;
    onBack: () => void;
}

export const AppointmentDetailPage: React.FC<AppointmentDetailPageProps> = ({ data, onBack }) => {
    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-[#5e5873]">รายละเอียดนัดหมาย</h1>
                    <p className="text-sm text-gray-500">ข้อมูลการนัดหมายและรายละเอียดเพิ่มเติม</p>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl">
                <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-[#5e5873]">ข้อมูลนัดหมาย</CardTitle>
                            <p className="text-sm text-gray-500">รหัสการนัดหมาย: #{Math.floor(Math.random() * 10000)}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Time & Date */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Clock size={18} className="text-gray-400" /> วันและเวลา
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-lg font-bold text-[#7367f0]">{data.datetime || '-'}</p>
                                <p className="text-sm text-gray-500">ระยะเวลาโดยประมาณ: 30 นาที</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin size={18} className="text-gray-400" /> สถานที่นัดหมาย
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="font-medium text-gray-700">{data.hospital || 'โรงพยาบาลมหาราชนครเชียงใหม่'}</p>
                                <p className="text-sm text-gray-500">แผนกศัลยกรรมตกแต่ง ชั้น 2</p>
                            </div>
                        </div>

                        {/* Doctor */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <User size={18} className="text-gray-400" /> แพทย์ผู้นัดหมาย
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">{data.doctor || 'นพ. สมชาย รักษาดี'}</p>
                                    <p className="text-xs text-gray-500">ศัลยแพทย์ตกแต่ง</p>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Activity size={18} className="text-gray-400" /> สถานะ
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold inline-block",
                                    data.status === 'upcoming' ? "bg-blue-100 text-blue-700" :
                                    data.status === 'completed' ? "bg-green-100 text-green-700" :
                                    "bg-gray-100 text-gray-700"
                                )}>
                                    {data.status === 'upcoming' ? 'นัดหมายล่วงหน้า' : 
                                     data.status === 'completed' ? 'เสร็จสิ้น' : 'รอยืนยัน'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <FileText size={18} className="text-gray-400" /> รายละเอียดการนัดหมาย
                        </h3>
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 min-h-[100px]">
                            <p className="text-gray-600 leading-relaxed">{data.detail || '-'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
