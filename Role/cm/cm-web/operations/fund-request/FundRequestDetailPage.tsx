import React from 'react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { 
  FileText, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar as CalendarIcon, 
  User, 
  DollarSign, 
  Upload, 
  AlertCircle, 
  Phone, 
  Printer,
  Banknote,
  Building,
  Edit,
  X,
  CreditCard,
  ClipboardList,
  Download
} from "lucide-react";
import { cn } from "../../../../../components/ui/utils";
import { getPatientByHn } from "../../../../../data/patientData";

interface FundRequestDetailPageProps {
    request: any;
    onBack: () => void;
}

// Helper: Format ISO date to Thai short date
const formatThaiShortDate = (raw: string | undefined): string => {
    if (!raw || raw === '-') return '-';
    if (/[ก-๙]/.test(raw)) return raw;
    try {
        const safeRaw = raw.match(/^\d{4}-\d{2}-\d{2}$/) ? raw + 'T00:00:00' : raw;
        const d = new Date(safeRaw);
        if (isNaN(d.getTime())) return raw;
        return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
    } catch {
        return raw;
    }
};

// Helper: Format ISO datetime to Thai Buddhist date + time
const formatThaiDateTime = (isoStr: string | undefined): { date: string; time: string } | null => {
    if (!isoStr) return null;
    try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return null;
        const datePart = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
        const timePart = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
        return { date: datePart, time: timePart };
    } catch {
        return null;
    }
};

// Status config
const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; badgeClass: string; bannerClass: string; borderClass: string; iconBg: string }> = {
    Approved: {
        label: 'อนุมัติแล้ว',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        badgeClass: 'bg-green-50 text-green-600 border-green-200',
        bannerClass: 'bg-emerald-50 border-emerald-100',
        borderClass: 'text-emerald-600',
        iconBg: 'bg-white border-emerald-100 text-emerald-600',
    },
    Pending: {
        label: 'รอพิจารณา',
        icon: <Clock className="w-3.5 h-3.5" />,
        badgeClass: 'bg-amber-50 text-amber-600 border-amber-200',
        bannerClass: 'bg-amber-50 border-amber-100',
        borderClass: 'text-amber-600',
        iconBg: 'bg-white border-amber-100 text-amber-600',
    },
    Rejected: {
        label: 'ไม่อนุมัติ',
        icon: <XCircle className="w-3.5 h-3.5" />,
        badgeClass: 'bg-red-50 text-red-600 border-red-200',
        bannerClass: 'bg-red-50 border-red-100',
        borderClass: 'text-red-500',
        iconBg: 'bg-white border-red-100 text-red-500',
    },
};

export function FundRequestDetailPage({ request: req, onBack }: FundRequestDetailPageProps) {
    // --- Computed Patient Data (Single Source from PATIENTS_DATA) ---
    const patientRecord = getPatientByHn(req?.hn);
    const patientDob = patientRecord?.dob || req?.patientDob;
    const patientGender = patientRecord?.gender || req?.patientGender;
    const patientDiagnosis = patientRecord?.diagnosis || req?.diagnosis || '-';
    const resolvedImage = patientRecord?.image || req?.patientImage;

    const patientAge = (() => {
        if (!patientDob) return null;
        const dob = new Date(patientDob);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const md = today.getMonth() - dob.getMonth();
        if (md < 0 || (md === 0 && today.getDate() < dob.getDate())) age--;
        return age;
    })();
    const patientAgeGenderText = [
        patientAge !== null ? `${patientAge} ปี` : null,
        patientGender || null
    ].filter(Boolean).join(' / ') || '-';

    // Status
    const statusKey = req.status || 'Pending';
    const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.Pending;

    // Dates
    const approvedDT = formatThaiDateTime(req?.approvedDate);
    const rejectedDT = formatThaiDateTime(req?.rejectedDate);

    // Build timeline steps
    const timelineSteps = (() => {
        const steps: { label: string; date: string; actor: string; active: boolean; color: string }[] = [];

        // Step 1: สร้างคำขอ — always active
        steps.push({
            label: 'สร้างคำขอทุน',
            date: formatThaiShortDate(req?.requestDate),
            actor: req?.doctor || 'Case Manager',
            active: true,
            color: 'bg-green-500',
        });

        // Step 2: พิจารณา
        if (statusKey === 'Approved' || statusKey === 'Rejected') {
            steps.push({
                label: statusKey === 'Approved' ? 'อนุมัติทุน' : 'ปฏิเสธทุน',
                date: formatThaiShortDate(req?.approvedDate || req?.rejectedDate),
                actor: req?.approver || 'ผู้อนุมัติ',
                active: true,
                color: statusKey === 'Approved' ? 'bg-green-500' : 'bg-red-500',
            });
        } else {
            steps.push({
                label: 'รอพิจารณาอนุมัติ',
                date: '-',
                actor: '-',
                active: false,
                color: 'bg-gray-300',
            });
        }

        // Step 3: เบิกจ่าย
        if (statusKey === 'Approved') {
            steps.push({
                label: 'ดำเนินการเบิกจ่าย',
                date: '-',
                actor: '-',
                active: false,
                color: 'bg-gray-300',
            });
        }

        return steps;
    })();

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20 font-['IBM_Plex_Sans_Thai'] space-y-6">
            {/* Header Banner — matching ReferralSystemDetail */}
            <div className="bg-[rgb(255,255,255)] p-4 rounded-[6px] shadow-sm border border-[#EBE9F1]/50 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-[#5e5873] font-bold text-lg">
                        รายละเอียดคำขอทุน {req.id}
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        ข้อมูลรายละเอียดและเอกสารประกอบการขอทุนสงเคราะห์
                    </p>
                </div>
                <Button variant="outline" size="icon" className="shrink-0 text-gray-500 border-gray-200 hover:bg-slate-50 hover:text-[#7367f0]" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                </Button>
            </div>

            {/* Approved/Rejected Date Banner (matching ReferralSystemDetail pattern) */}
            {statusKey === 'Approved' && approvedDT && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white p-2.5 rounded-full shadow-sm border border-emerald-100">
                        <CalendarIcon className="text-emerald-600 w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-sm text-emerald-600 font-semibold block mb-0.5">วันที่ได้รับอนุมัติทุน</span>
                        <span className="text-emerald-900 font-bold text-lg">{approvedDT.date}</span>
                        <span className="text-emerald-700 text-sm ml-2">{approvedDT.time} น.</span>
                    </div>
                </div>
            )}
            {statusKey === 'Rejected' && rejectedDT && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-white p-2.5 rounded-full shadow-sm border border-red-100">
                        <CalendarIcon className="text-red-500 w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-sm text-red-500 font-semibold block mb-0.5">วันที่ปฏิเสธทุน</span>
                        <span className="text-red-900 font-bold text-lg">{rejectedDT.date}</span>
                        <span className="text-red-700 text-sm ml-2">{rejectedDT.time} น.</span>
                    </div>
                </div>
            )}

            {/* Content: 3-column grid matching Referral pattern */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

                {/* ===== Left Column (col-span-2) ===== */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Patient Info Card */}
                    <Card className="border-gray-100 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="text-lg text-[#5e5873] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#7367f0]" /> ข้อมูลผู้ป่วย
                                </div>
                                <span className={cn(config.badgeClass, "px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border")}>
                                    {config.icon}
                                    {config.label}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-5">
                                <div className="w-[72px] h-[72px] bg-gray-100 rounded-full shrink-0 overflow-hidden border-2 border-white shadow">
                                    {resolvedImage ? (
                                        <img 
                                            src={resolvedImage}
                                            alt={req.patientName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-[#7367f0] font-bold text-2xl">
                                                {req.patientName ? req.patientName.charAt(0) : "U"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 text-xl truncate">{req.patientName || 'ไม่ระบุชื่อ'}</h3>
                                    <p className="text-sm text-slate-500">HN: {req.hn || '-'}</p>
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
                                        <p className="text-sm text-gray-500">รหัสคำขอ: {req.id || '-'}</p>
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
                                        {req.name || req.fundType || '-'}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">จำนวนเงินที่ขอ</p>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2">
                                        <span className="text-[#7367f0] font-mono font-bold text-lg">
                                            ฿{req.amount ? req.amount.toLocaleString() : '0'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">วันที่สร้างคำขอ</p>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
                                        <CalendarIcon size={16} className="text-gray-400 shrink-0" />
                                        {formatThaiShortDate(req.requestDate || req.date)}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-sm font-medium text-gray-500">ผู้ยื่นคำขอ</p>
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 min-h-[48px] flex items-center gap-2 text-gray-700">
                                        <User size={16} className="text-gray-400 shrink-0" />
                                        {req.requester || req.doctor || 'Case Manager A'}
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            {(req.description || req.reason || true) && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                        <div className="bg-[#7367f0]/10 p-2 rounded-lg text-[#7367f0]">
                                            <FileText size={20} />
                                        </div>
                                        <h3 className="font-bold text-lg text-[#5e5873]">เหตุผลความจำเป็น</h3>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[80px] text-gray-600 leading-relaxed">
                                        {req.description || req.reason || "ผู้ป่วยมีฐานะยากจน ไม่สามารถชำระค่าเดินทางมารักษาได้ เนื่องจากต้องเดินทางไกลและมีค่าใช้จ่ายในการเดินทางสูง ครอบครัวมีรายได้น้อย"}
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

                    {/* Additional Documents for Approved Requests */}
                    {statusKey === 'Approved' && (
                        <Card className="border-emerald-200 shadow-sm bg-emerald-50/30">
                            <CardHeader className="pb-3 border-b border-emerald-100">
                                <CardTitle className="text-lg text-emerald-700 flex items-center gap-2">
                                    <Upload className="w-5 h-5" /> เอกสารที่ต���องยื่นเพิ่มเติม (สำหรับเบิกจ่าย)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-2 border-dashed border-emerald-300/50 bg-white/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-emerald-400 transition-all group">
                                        <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">ใบเสร็จรับเงิน</p>
                                        <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG, PDF</p>
                                    </div>
                                    <div className="border-2 border-dashed border-emerald-300/50 bg-white/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-emerald-400 transition-all group">
                                        <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">รูปถ่ายขณะรักษา</p>
                                        <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-600 bg-white/80 p-3 rounded-lg border border-emerald-200/60">
                                    <AlertCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                    <p>กรุณาแนบเอกสารหลักฐานการจ่ายเงินให้ครบถ้วนภายใน 30 วันหลังจากได้รับอนุมัติ เพื่อดำเนินการเบิกจ่ายเงินสนับสนุนเข้าบัญชีผู้ป่วย</p>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        ส่งเอกสารเพิ่มเติม
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* ===== Right Column (sidebar) ===== */}
                <div className="space-y-6">

                    {/* การดำเนินการ */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="text-lg text-[#5e5873]">การดำเนินการ</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {statusKey === 'Pending' && (
                                <div className="space-y-4">
                                    <Button
                                        variant="outline"
                                        className="w-full h-10 border-gray-200 text-gray-600 hover:text-[#7367f0] hover:bg-slate-50"
                                    >
                                        <Edit className="w-4 h-4 mr-2" /> แก้ไขคำขอทุน
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full text-red-600 hover:bg-red-50 border-red-200 h-11"
                                    >
                                        <X className="w-4 h-4 mr-2" /> ยกเลิกคำขอทุน
                                    </Button>
                                </div>
                            )}
                            {statusKey === 'Approved' && (
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-11">
                                    <DollarSign className="w-4 h-4 mr-2" /> ดำเนินการเบิกจ่าย
                                </Button>
                            )}
                            {statusKey === 'Rejected' && (
                                <div className="text-center text-sm text-slate-500 py-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <XCircle className="w-5 h-5 mx-auto mb-1.5 text-red-400" />
                                    คำขอทุนถูกปฏิเสธแล้ว
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* สถานะการติดตาม */}
                    <Card className="border-gray-100 shadow-sm">
                        <CardHeader className="pb-3 border-b border-gray-50">
                            <CardTitle className="text-lg text-[#5e5873]">สถานะการติดตาม</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                                {timelineSteps.map((step, index) => (
                                    <div key={index} className="relative">
                                        <div className={cn(
                                            "absolute -left-[21px] top-1 w-3 h-3 rounded-full ring-4 ring-white",
                                            step.color
                                        )} />
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "text-sm font-bold",
                                                step.active ? "text-[#5e5873]" : "text-gray-400"
                                            )}>{step.label}</span>
                                            <span className="text-sm text-gray-400">{step.date}</span>
                                            {step.actor && step.actor !== '-' && (
                                                <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <User size={10} /> {step.actor}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}