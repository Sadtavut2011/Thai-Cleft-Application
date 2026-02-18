import React from 'react';
import { ArrowLeft, CreditCard, Calendar, CheckCircle2, Clock, XCircle, FileText, Download, Printer, User, Phone, ClipboardList } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { cn } from '../../../../../components/ui/utils';
import { formatThaiDate } from '../../utils/formatThaiDate';
import { getPatientByHn } from '../../../../../data/patientData';

interface FundRequestDetailPageProps {
    data: any;
    patient?: { name: string; hn: string; image?: string };
    onBack: () => void;
}

export const FundRequestDetailPage: React.FC<FundRequestDetailPageProps> = ({ data, patient, onBack }) => {
    // Single source lookup for full patient data
    const patientRecord = patient ? getPatientByHn(patient.hn) : null;
    const resolvedDob = patientRecord?.dob;
    const resolvedGender = patientRecord?.gender;
    const patientDiagnosis = patientRecord?.diagnosis || '-';
    const patientAge = (() => {
        if (!resolvedDob) return null;
        const dob = new Date(resolvedDob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const md = today.getMonth() - dob.getMonth();
        if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
        return age;
    })();
    const patientAgeGenderText = [
        patientAge !== null ? `${patientAge} ปี` : null,
        resolvedGender || null
    ].filter(Boolean).join(' / ') || '-';

    // Status badge - synced with FundRequestDetailPage.tsx (operations)
    const getStatusBadge = () => {
        if (data.status === 'Approved') {
            return (
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-green-50 text-green-600 border border-green-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> อนุมัติแล้ว
                </span>
            );
        }
        if (data.status === 'Pending') {
            return (
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-orange-50 text-orange-600 border border-orange-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> รอพิจารณา
                </span>
            );
        }
        if (data.status === 'Rejected') {
            return (
                <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-red-50 text-red-600 border border-red-200 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" /> ไม่อนุมัติ
                </span>
            );
        }
        return (
            <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-700 border border-gray-200">
                {data.status || '-'}
            </span>
        );
    };

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20 font-['IBM_Plex_Sans_Thai']">
            {/* Header */}
            <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-[#5e5873] font-bold text-lg">
                        รายละเอียดคำขอ {data.id || '-'}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        ข้อมูลรายละเอียดและเอกสารประกอบการขอทุน
                    </p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Patient Info Card */}
                    {patient && (
                        <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="pb-3 border-b border-gray-50">
                                <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                                    </div>
                                    {getStatusBadge()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-[72px] h-[72px] bg-gray-100 rounded-full shrink-0 overflow-hidden border-2 border-white shadow">
                                        <img 
                                            src={patient.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                                            alt={patient.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-800 text-xl truncate">{patient.name || 'ไม่ระบุชื่อ'}</h3>
                                        <p className="text-sm text-slate-500">HN: {patient.hn || '-'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                            <Phone className="w-4 h-4" /> ติดต่อ
                                        </Button>
                                        <Button variant="outline" size="sm" className="gap-1.5 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50">
                                            <ClipboardList className="w-4 h-4" /> ดูประวัติ
                                        </Button>
                                    </div>
                                </div>

                                {/* Info strip: อายุ/เพศ + ผลการวินิจฉัย */}
                                <div className="grid grid-cols-2 mt-5 bg-[#F4F9FF] rounded-lg border border-blue-100/60 overflow-hidden">
                                    <div className="px-5 py-3 border-r border-blue-100/60">
                                        <span className="text-xs text-slate-500 block mb-0.5">อายุ / เพศ</span>
                                        <span className="text-sm text-slate-800 font-semibold">{patientAgeGenderText}</span>
                                    </div>
                                    <div className="px-5 py-3">
                                        <span className="text-xs text-slate-500 block mb-0.5">ผลการวินิจฉัย</span>
                                        <span className="text-sm text-slate-800 font-semibold">{patientDiagnosis}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Fund Detail Card */}
                    <Card className="border-gray-100 shadow-sm overflow-hidden bg-white rounded-xl">
                        <CardHeader className="bg-[#f8f8f8] border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#f5a623]/10 p-2 rounded-lg text-[#f5a623]">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-[#5e5873]">รายละเอียดการขอทุน</CardTitle>
                                        <p className="text-sm text-gray-500">รหัสคำขอ: {data.id || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            
                            {/* Fund Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">กองทุน</p>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
                                        <CreditCard size={16} className="text-gray-400 shrink-0" />
                                        {data.name || data.fundType || '-'}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">จำนวนเงินที่ขอ</p>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2">
                                        <span className="text-[#7367f0] font-mono font-bold text-lg">
                                            ฿{data.amount ? data.amount.toLocaleString() : '0'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">วันที่สร้างคำขอ</p>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
                                        <Calendar size={16} className="text-gray-400 shrink-0" />
                                        {formatThaiDate(data.requestDate || data.date)}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">ผู้ยื่นคำขอ</p>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
                                        <User size={16} className="text-gray-400 shrink-0" />
                                        {data.requester || data.doctor || 'Case Manager A'}
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            {(data.description || data.reason) && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                            <FileText size={20} />
                                        </div>
                                        <h3 className="font-bold text-lg text-[#5e5873]">เหตุผลความจำเป็น</h3>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[80px] text-gray-600 leading-relaxed">
                                        {data.description || data.reason || '-'}
                                    </div>
                                </div>
                            )}

                            {/* Documents */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-[#5e5873]">เอกสารแนบ</h3>
                                </div>
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

                {/* Right Column: Tracking Timeline */}
                <div className="space-y-6">
                    <Card className="border-gray-100 shadow-sm rounded-xl">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="text-lg text-[#5e5873]">สถานะการติดตาม</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                                {/* Step 1: Created */}
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-[#5e5873]">สร้างคำขอทุน</span>
                                        <span className="text-sm text-gray-400">{formatThaiDate(data.requestDate || data.date)}</span>
                                    </div>
                                </div>

                                {/* Step 2: Under Review */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        data.status === 'Approved' ? "bg-green-500" : data.status === 'Pending' ? "bg-orange-400" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            data.status === 'Pending' || data.status === 'Approved' ? "text-[#5e5873]" : "text-gray-400"
                                        )}>รอพิจารณา</span>
                                        <span className="text-sm text-gray-400">-</span>
                                    </div>
                                </div>

                                {/* Step 3: Approved / Rejected */}
                                <div className="relative">
                                    <div className={cn(
                                        "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                        data.status === 'Approved' ? "bg-green-500" : "bg-gray-300"
                                    )}></div>
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            data.status === 'Approved' ? "text-[#5e5873]" : "text-gray-400"
                                        )}>อนุมัติ / ปฏิเสธ</span>
                                        <span className="text-sm text-gray-400">-</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};