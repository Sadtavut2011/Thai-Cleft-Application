import React from 'react';
import { ArrowLeft, CreditCard, Calendar, CheckCircle2, FileText, Download } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';
import { Badge } from '../../../../../components/ui/badge';

interface FundRequestDetailPageProps {
    data: any;
    onBack: () => void;
}

export const FundRequestDetailPage: React.FC<FundRequestDetailPageProps> = ({ data, onBack }) => {
    return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-slate-500 hover:bg-slate-100">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-[#5e5873]">รายละเอียดข้อมูลทุน</h1>
                    <p className="text-sm text-gray-500">ประวัติการขอรับทุนสนับสนุนค่าเดินทางและรักษาพยาบาล</p>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden bg-white rounded-xl">
                <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#ff9f43]/10 p-2 rounded-lg text-[#ff9f43]">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-[#5e5873]">{data.name || 'ไม่ระบุชื่อทุน'}</CardTitle>
                                <p className="text-sm text-gray-500">รหัสคำขอ: FUND-{Math.floor(Math.random() * 10000)}</p>
                            </div>
                        </div>
                        <Badge className={cn(
                            "px-3 py-1 text-sm",
                            data.status === 'Approved' ? "bg-green-100 text-green-700 hover:bg-green-100" :
                            data.status === 'Pending' ? "bg-orange-100 text-orange-700 hover:bg-orange-100" :
                            "bg-gray-100 text-gray-700 hover:bg-gray-100"
                        )}>
                            {data.status === 'Approved' ? 'อนุมัติแล้ว' : 
                             data.status === 'Pending' ? 'รอการพิจารณา' : data.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    
                    {/* Amount Card */}
                    <div className="bg-white border-2 border-[#7367f0]/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
                        <p className="text-gray-500 mb-2 font-medium">จำนวนเงินที่ได้รับอนุมัติ</p>
                        <h2 className="text-4xl font-bold text-[#7367f0]">฿{data.amount ? data.amount.toLocaleString() : '0'}</h2>
                        <p className="text-sm text-gray-400 mt-2">โอนเข้าบัญชี: xxx-x-xx123-4</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <Calendar size={18} className="text-gray-400" /> วันที่ได้รับ
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-gray-700 font-medium">{data.date || '-'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-gray-400" /> ผู้อนุมัติ
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-gray-700 font-medium">SCFC center</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <FileText size={18} className="text-gray-400" /> เอกสารแนบ
                        </h3>
                        <div className="space-y-2">
                            {['สำเนาบัตรประชาชน.pdf', 'ใบรับรองแพทย์.pdf', 'หน้าสมุดบัญชี.jpg'].map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-500 text-xs font-bold">PDF</div>
                                        <span className="text-sm text-gray-700">{file}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                                        <Download size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};
