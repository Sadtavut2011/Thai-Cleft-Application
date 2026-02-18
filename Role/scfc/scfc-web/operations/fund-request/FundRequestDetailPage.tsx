import React from 'react';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  User,
  Building2,
  DollarSign,
  Activity,
  History,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Download,
  Coins,
  Paperclip
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Separator } from "../../../../../components/ui/separator";
import { ScrollArea } from "../../../../../components/ui/scroll-area";
import { cn } from "../../../../../components/ui/utils";
import { SYSTEM_ICON_COLORS } from "../../../../../data/themeConfig";

const ICON = SYSTEM_ICON_COLORS.fund;

// Status Config — เหมือน FundSystem.tsx
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Pending:   { label: 'รอพิจารณา', color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' },
  Approved:  { label: 'อนุมัติแล้ว', color: 'text-[#4285f4]', bg: 'bg-blue-50' },
  Rejected:  { label: 'ปฏิเสธ', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]' },
  Received:  { label: 'ได้รับเงินแล้ว', color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
  Disbursed: { label: 'จ่ายเงินแล้ว', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]' },
};

const getStatusConfig = (status: string) => STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

const getUrgencyConfig = (urgency: string) => {
  if (urgency === 'Emergency') return { label: 'ฉุกเฉิน', color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' };
  if (urgency === 'Urgent') return { label: 'เร่งด่วน', color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10', icon: '🟡' };
  return { label: 'ปกติ', color: 'text-gray-600', bg: 'bg-gray-50', icon: '🟢' };
};

const formatThaiShortDate = (raw: string | undefined): string => {
  if (!raw || raw === '-') return '-';
  if (/[ก-๙]/.test(raw)) return raw;
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch { return raw; }
};

interface FundRequest {
  id: string;
  patientName: string;
  hn: string;
  diagnosis: string;
  fundType: string;
  amount: number;
  requestDate: string;
  urgency: 'Normal' | 'Urgent' | 'Emergency';
  hospital: string;
  status: string;
  rejectReason?: string;
  documents: string[];
  history: { date: string; action: string; user: string }[];
}

interface FundRequestDetailPageProps {
  request: FundRequest;
  onBack: () => void;
  onApprove: (req: FundRequest) => void;
  onReject: () => void;
}

export function FundRequestDetailPage({ request, onBack, onApprove, onReject }: FundRequestDetailPageProps) {
  const sc = getStatusConfig(request.status);
  const uc = getUrgencyConfig(request.urgency);
  const isPending = request.status === 'Pending';

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">

      {/* ===== Header ===== */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="bg-[#f5a623]/10 p-2.5 rounded-xl">
            <Coins className={cn("w-6 h-6", ICON.text)} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-[#5e5873] text-xl">{request.patientName}</h1>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs", uc.bg, uc.color)}>{uc.label}</span>
            </div>
            <p className="text-xs text-gray-500">HN: {request.hn} &bull; {request.hospital} &bull; <span className="text-gray-400">{request.id}</span></p>
          </div>
        </div>

        {isPending && (
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none h-10 border-red-200 text-[#EA5455] hover:bg-red-50 rounded-xl text-sm"
              onClick={onReject}
            >
              <XCircle className="w-4 h-4 mr-1.5" /> ปฏิเสธ
            </Button>
            <Button
              className="flex-1 md:flex-none h-10 bg-[#28c76f] hover:bg-[#28c76f]/90 text-white rounded-xl shadow-sm text-sm"
              onClick={() => onApprove(request)}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> อนุมัติทุน
            </Button>
          </div>
        )}
      </div>

      {/* ===== Status Bar ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">สถานะ:</span>
            <span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span>
          </div>
          <Separator orientation="vertical" className="h-5 bg-gray-200 hidden md:block" />
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#f5a623]" />
            <span className="text-xs text-gray-500">วันที่ขอ:</span>
            <span className="text-xs text-[#5e5873]">{formatThaiShortDate(request.requestDate)}</span>
          </div>
          <Separator orientation="vertical" className="h-5 bg-gray-200 hidden md:block" />
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#f5a623]" />
            <span className="text-xs text-gray-500">โรงพยาบาล:</span>
            <span className="text-xs text-[#5e5873]">{request.hospital}</span>
          </div>
          {request.rejectReason && (
            <div className="flex items-center gap-2">
              <Separator orientation="vertical" className="h-5 bg-gray-200 hidden md:block" />
              <AlertCircle className="w-3.5 h-3.5 text-[#EA5455]" />
              <span className="text-xs text-[#EA5455]">เหตุผลปฏิเสธ: {request.rejectReason}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Main Content (left 2 cols) ===== */}
        <div className="lg:col-span-2 space-y-6">

          {/* Fund Detail Card */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#f5a623]" /> รายละเอียดการขอทุน
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3 text-[#f5a623]" /> แหล่งทุนที่เสนอ
                    </p>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-sm text-[#5e5873]">{request.fundType}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-[#f5a623]" /> การวินิจฉัย / เหตุผลที่ขอ
                    </p>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 min-h-[100px]">
                      <span className="text-sm text-[#5e5873] leading-relaxed">{request.diagnosis}</span>
                    </div>
                  </div>
                </div>

                {/* Right — Amount Card */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#7367f0] to-[#5B4FCC] rounded-xl p-6 text-white shadow-lg">
                    <p className="text-xs text-white/70 mb-2 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" /> จำนวนเงินที่ขอ
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl">฿{request.amount.toLocaleString()}</span>
                      <span className="text-white/60 text-xs">บาท</span>
                    </div>
                    <Separator className="my-4 bg-white/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">สถานะปัจจุบัน</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs">{sc.label}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-[#f5a623]" />
                        <span className="text-xs text-gray-500">ระดับเร่งด่วน</span>
                      </div>
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs", uc.bg, uc.color)}>{uc.label}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#f5a623]" />
                        <span className="text-xs text-gray-500">วันที่ยื่นคำขอ</span>
                      </div>
                      <span className="text-xs text-[#5e5873]">{formatThaiShortDate(request.requestDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-[#f5a623]" /> เอกสารประกอบ
                <span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full">{request.documents.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {request.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-100 group cursor-pointer hover:border-[#7367f0]/30 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#f5a623]/10 p-2.5 rounded-lg text-[#f5a623] group-hover:bg-[#7367f0]/10 group-hover:text-[#7367f0] transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-[#5e5873]">{doc}</p>
                        <p className="text-xs text-gray-400 mt-0.5">PDF &bull; 2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg text-[#7367f0] hover:bg-[#7367f0]/10 flex items-center justify-center transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== Sidebar (right col) ===== */}
        <div className="space-y-6">

          {/* Audit Log Timeline */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <History className="w-5 h-5 text-[#f5a623]" /> ประวัติการดำเนินการ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[380px]">
                <div className="p-5 space-y-5 relative">
                  {/* Timeline line */}
                  <div className="absolute left-[29px] top-8 bottom-8 w-0.5 bg-gray-100"></div>

                  {request.history.map((log, i) => (
                    <div key={i} className="flex items-start gap-3.5 relative z-10">
                      <div className={cn(
                        "p-2 rounded-full border shadow-sm shrink-0",
                        i === 0
                          ? "bg-[#7367f0] text-white border-[#7367f0]"
                          : "bg-white text-gray-400 border-gray-200"
                      )}>
                        <Activity className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#5e5873]">{log.action}</p>
                        <div className="flex flex-col gap-0.5 mt-1">
                          <p className="text-xs text-[#7367f0] flex items-center gap-1">
                            <User className="w-3 h-3" /> {log.user}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatThaiShortDate(log.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* SCFC Guide Card */}
          <Card className="border-[#7367f0]/20 bg-[#EDE9FE]/30 rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#7367f0] p-2 rounded-lg text-white shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-sm text-[#5e5873]">ข้อแนะนำ SCFC</span>
              </div>
              <p className="text-xs text-[#5e5873]/80 leading-relaxed">
                "โปรดตรวจสอบเอกสารรายได้และภาพถ่ายบ้านของผู้ป่วยให้ครบถ้วนก่อนการอนุมัติ
                เพื่อให้มั่นใจว่าทุนสนับสนุนเข้าถึงกลุ่มเป้าหมายที่แท้จริง"
              </p>
            </CardContent>
          </Card>

          {/* Quick Patient Info */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <User className="w-5 h-5 text-[#f5a623]" /> ข้อมูลผู้ป่วย
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[
                { label: 'ชื่อ-สกุล', value: request.patientName, icon: User },
                { label: 'HN', value: request.hn, icon: FileText },
                { label: 'โรงพยาบาล', value: request.hospital, icon: Building2 },
                { label: 'การวินิจฉัย', value: request.diagnosis, icon: Activity },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="bg-[#f5a623]/10 p-1.5 rounded-md shrink-0 mt-0.5">
                    <item.icon className="w-3.5 h-3.5 text-[#f5a623]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm text-[#5e5873] truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
