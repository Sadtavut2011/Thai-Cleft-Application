import React from 'react';
import { Button } from "../../../../../components/ui/button";
import { FileText, ArrowLeft, Clock, CheckCircle2, XCircle, Calendar, User, DollarSign, Upload, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Badge } from "../../../../../components/ui/badge";
import { Card } from "../../../../../components/ui/card";

interface FundRequestDetailPageProps {
    request: any;
    onBack: () => void;
}

export function FundRequestDetailPage({ request: req, onBack }: FundRequestDetailPageProps) {
  // Format date if needed, otherwise use raw if simple string
  const displayDate = req?.requestDate 
    ? format(new Date(req.requestDate), "d MMM yy", { locale: th }) 
    : "ไม่ระบุวันที่";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20 font-['Montserrat','Noto_Sans_Thai',sans-serif]">
        
        {/* Header Banner */}
        <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#FFF4E5]/50 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-[#FFF4E5]/80 text-[#5e5873]">
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-[#5e5873] font-bold text-lg">
                        รายละเอียดคำขอ {req.id}
                    </h1>
                    {req.status === 'Approved' && (
                        <Badge className="bg-green-100 text-green-800 border-none font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> อนุมัติแล้ว
                        </Badge>
                    )}
                    {req.status === 'Pending' && (
                        <Badge className="bg-orange-100 text-orange-800 border-none font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> รอพิจารณา
                        </Badge>
                    )}
                    {req.status === 'Rejected' && (
                        <Badge className="bg-red-100 text-red-800 border-none font-medium flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> ไม่อนุมัติ
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    ข้อมูลรายละเอียดและเอกสารประกอบการขอทุน
                </p>
            </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Left Column: Main Info */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Patient Info Card */}
                <Card className="p-6 border-[#EBE9F1] shadow-sm">
                    <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                        <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                    </h3>
                    <div className="flex items-center gap-4 bg-[#F8F9FA] p-4 rounded-xl">
                        <div className="h-14 w-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#7367f0] font-bold text-2xl shadow-sm">
                            {req.patientName ? req.patientName.charAt(0) : "U"}
                        </div>
                        <div>
                            <h3 className="font-bold text-[#120d26] text-lg">{req.patientName}</h3>
                            <p className="text-slate-500 text-sm">HN: {req.hn}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>อายุ: 45 ปี</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span>สิทธิการรักษา: บัตรทอง</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Request Details Card */}
                <Card className="p-6 border-[#EBE9F1] shadow-sm">
                     <h3 className="font-semibold text-base text-[#5e5873] flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                        <FileText className="w-5 h-5 text-[#7367f0]" /> รายละเอียดการขอทุน
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-slate-400 text-xs mb-1">ประเภททุน</p>
                                <p className="font-medium text-[#120d26]">{req.fundType}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs mb-1">จำนวนเงินที่ขอ</p>
                                <p className="font-medium text-[#120d26] text-lg text-[#7367f0] font-mono">
                                    {req.amount?.toLocaleString()} บาท
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs mb-2">เหตุผลความจำเป็น</p>
                            <div className="bg-[#F8F9FA] p-4 rounded-xl text-sm text-[#120d26] leading-relaxed border border-gray-100">
                                {req.reason || "ผู้ป่วยมีฐานะยากจน ไม่สามารถชำระค่าเดินทางมารักษาได้ เนื่องจากต้องเดินทางไกลและมีค่าใช้จ่ายในการเดินทางสูง ครอบครัวมีรายได้น้อย"}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Additional Documents for Approved Requests */}
                {req.status === 'Approved' && (
                    <Card className="p-6 border-[#28c76f]/20 bg-[#28c76f]/5 shadow-sm">
                         <h3 className="font-semibold text-base text-[#28c76f] flex items-center gap-2 border-b border-[#28c76f]/20 pb-3 mb-4">
                            <FileText className="w-5 h-5" /> เอกสารที่ต้องยื่นเพิ่มเติม (สำหรับเบิกจ่าย)
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border-2 border-dashed border-[#28c76f]/30 bg-white/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-[#28c76f] transition-all group">
                                    <div className="h-12 w-12 bg-[#28c76f]/10 text-[#28c76f] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">ใบเสร็จรับเงิน</p>
                                    <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG, PDF</p>
                                </div>
                                <div className="border-2 border-dashed border-[#28c76f]/30 bg-white/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-[#28c76f] transition-all group">
                                    <div className="h-12 w-12 bg-[#28c76f]/10 text-[#28c76f] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">รูปถ่ายขณะรักษา</p>
                                    <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-600 bg-white/80 p-3 rounded-lg border border-[#28c76f]/20">
                                <AlertCircle className="w-5 h-5 text-[#28c76f] mt-0.5 shrink-0" />
                                <p>กรุณาแนบเอกสารหลักฐานการจ่ายเงินให้ครบถ้วนภายใน 30 วันหลังจากได้รับอนุมัติ เพื่อดำเนินการเบิกจ่ายเงินสนับสนุนเข้าบัญชีผู้ป่วย</p>
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button className="bg-[#28c76f] hover:bg-[#20a35a] text-white">
                                    ส่งเอกสารเพิ่มเติม
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

            </div>

            {/* Right Column: Meta & Docs */}
            <div className="space-y-6">
                
                {/* Meta Info Card */}
                <Card className="p-6 border-[#EBE9F1] shadow-sm">
                    <h3 className="font-semibold text-sm text-[#5e5873] mb-4">ข้อมูลการยื่น</h3>
                    <div className="space-y-4">
                         <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">วันที่ยื่น</span>
                            <span className="font-medium text-[#120d26] text-sm flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" /> {displayDate}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                            <span className="text-gray-500 text-sm">ผู้ยื่นคำขอ</span>
                            <span className="font-medium text-[#120d26] text-sm">{req.doctor || "Case Manager A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-gray-500 text-sm">สถานะปัจจุบัน</span>
                             <span className="font-medium text-[#120d26] text-sm">{req.status}</span>
                        </div>
                    </div>
                </Card>

                {/* Documents Card */}
                <Card className="p-6 border-[#EBE9F1] shadow-sm">
                    <h3 className="font-semibold text-sm text-[#5e5873] mb-4 flex items-center justify-between">
                        เอกสารแนบ 
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">3</span>
                    </h3>
                    <div className="space-y-3">
                        {['สำเนาบัตรประชาชน', 'ใบรับรองแพทย์', 'รูปถ่ายบ้าน'].map((doc, i) => (
                            <div key={i} className="flex items-center gap-3 border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                                    <FileText className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#120d26] truncate">{doc}</p>
                                    <p className="text-xs text-gray-400">PDF, 1.2 MB</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Actions */}
                {req.status === 'Pending' && (
                     null
                )}
            </div>
        </div>
    </div>
  );
}