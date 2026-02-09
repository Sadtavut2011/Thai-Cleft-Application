import React from 'react';
import { ArrowLeft, Video, Calendar, Link as LinkIcon, Clock, User, Monitor } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';

interface TeleConsultationSystemDetailProps {
    data: any;
    onBack: () => void;
}

export const TeleConsultationSystemDetail: React.FC<TeleConsultationSystemDetailProps> = ({ data, onBack }) => {
    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-[#5e5873]">รายละเอียด Tele-consult</h1>
                    <p className="text-sm text-gray-500">ข้อมูลการนัดหมายปรึกษาทางไกล</p>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl">
                <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#ea5455]/10 p-2 rounded-lg text-[#ea5455]">
                            <Video size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-[#5e5873]">นัดหมายปรึกษาแพทย์</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                                    data.type === 'Direct' ? "bg-cyan-50 text-cyan-600 border-cyan-100" : "bg-purple-50 text-purple-600 border-purple-100"
                                )}>
                                    {data.type === 'Direct' ? 'ส่งตรงหาผู้ป่วย' : 'ผ่าน รพ.สต.'}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    
                    {/* Meeting Link Card */}
                    <div className="bg-gradient-to-r from-[#7367f0] to-[#9e95f5] rounded-xl p-6 text-white shadow-lg shadow-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                 <Monitor size={24} />
                             </div>
                             <div>
                                 <h3 className="font-bold text-lg">ห้องสนทนาออนไลน์</h3>
                                 <p className="text-white/80 text-sm">กดปุ่มเพื่อเข้าร่วมเมื่อถึงเวลานัดหมาย</p>
                             </div>
                        </div>
                        <Button 
                            className="bg-white text-[#7367f0] hover:bg-white/90 font-bold px-6 shadow-md"
                            onClick={() => window.open(data.link, '_blank')}
                        >
                            <LinkIcon size={16} className="mr-2" /> เข้าร่วมประชุม
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Clock size={18} className="text-gray-400" /> วันและเวลา
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xl font-bold text-[#5e5873]">{data.datetime || '-'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <User size={18} className="text-gray-400" /> แพทย์ผู้ให้คำปรึกษา
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="font-medium text-gray-700">นพ. สมชาย รักษาดี</p>
                                <p className="text-xs text-gray-500">ศัลยแพทย์</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">หัวข้อการปรึกษา</h3>
                        <div className="p-6 bg-white border border-gray-200 rounded-xl">
                            <p className="text-gray-600">{data.detail || '-'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
