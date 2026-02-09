import React from 'react';
import { ArrowLeft, Home, Calendar, FileText, CheckCircle2, User, MapPin } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';

interface HomeVisitRequestDetailProps {
    data: any;
    onBack: () => void;
}

export const HomeVisitRequestDetail: React.FC<HomeVisitRequestDetailProps> = ({ data, onBack }) => {
    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-[#5e5873]">รายละเอียดการเยี่ยมบ้าน</h1>
                    <p className="text-sm text-gray-500">บันทึกผลการติดตามเยี่ยมบ้านผู้ป่วย</p>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl">
                <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#28c76f]/10 p-2 rounded-lg text-[#28c76f]">
                            <Home size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-[#5e5873]">บันทึกการเยี่ยมบ้าน</CardTitle>
                            <p className="text-sm text-gray-500">วันที่: {data.date || '-'}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    {/* Visitor Info */}
                    <div className="flex items-center gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm">
                             <User size={24} />
                         </div>
                         <div>
                             <p className="font-bold text-[#5e5873]">ทีมเยี่ยมบ้าน รพ.สต. บ้านใหม่</p>
                             <p className="text-sm text-gray-500">ผู้บันทึก: พยาบาลวิชาชีพ ดวงใจ</p>
                         </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <FileText size={18} className="text-gray-400" /> รายละเอียดการเยี่ยม
                        </h3>
                        <div className="p-6 bg-white border border-gray-200 rounded-xl min-h-[100px]">
                            <p className="text-gray-600 leading-relaxed">{data.detail || '-'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-gray-400" /> ผลการประเมิน
                            </h3>
                            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                                <p className="text-green-700 font-medium">{data.status || 'เรียบร้อย'}</p>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin size={18} className="text-gray-400" /> พิกัด
                            </h3>
                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                                <span className="text-gray-600 text-sm">18.796, 98.979</span>
                                <Button variant="link" size="sm" className="h-auto p-0 text-[#7367f0]">ดูแผนที่</Button>
                            </div>
                         </div>
                    </div>

                    {/* Images Placeholder */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">รูปภาพประกอบ</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400">
                                    IMG_{i}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
