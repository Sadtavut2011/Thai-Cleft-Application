import React, { useState } from 'react';
import {
  ArrowLeft, Building2, Users, DollarSign,
  TrendingUp, Coins, ChevronDown, ChevronUp,
  BarChart3, Calendar, Eye, Database
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { cn } from "../../../../../components/ui/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { PURPLE, SYSTEM_ICON_COLORS } from "../../../../../data/themeConfig";

const ICON = SYSTEM_ICON_COLORS.fund;

// Status config
const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  Pending:   { label: 'รอพิจารณา', color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' },
  Approved:  { label: 'อนุมัติแล้ว', color: 'text-[#4285f4]', bg: 'bg-blue-50' },
  Rejected:  { label: 'ปฏิเสธ', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]' },
  Disbursed: { label: 'จ่ายเงินแล้ว', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]' },
  Received:  { label: 'ได้รับเงินแล้ว', color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
};
const getStatusCfg = (s: string) => STATUS_CFG[s] || STATUS_CFG.Pending;

const formatThaiDate = (raw: string): string => {
  if (!raw || raw === '-') return '-';
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch { return raw; }
};

// ============ MOCK DATA ============
interface PatientFundRecord {
  name: string;
  hn: string;
  amount: number;
  date: string;
  status: string;
  fundSource: string;
}

interface HospitalFundInfo {
  hospital: string;
  province: string;
  totalAmount: number;
  totalPatients: number;
  fundBreakdown: { source: string; amount: number; patients: number }[];
  patientList: PatientFundRecord[];
  yearlyData: { year: string; amount: number }[];
}

const HOSPITAL_FUND_DATA: HospitalFundInfo[] = [
  {
    hospital: 'รพ.มหาราชนครเชียงใหม่',
    province: 'เชียงใหม่',
    totalAmount: 225000,
    totalPatients: 11,
    fundBreakdown: [
      { source: 'สภากาชาดไทย (Red Cross)', amount: 45000, patients: 5 },
      { source: 'กองทุนรัฐบาล (Northern Care)', amount: 180000, patients: 6 },
    ],
    patientList: [
      { name: 'ด.ช. อนันต์ สุขใจ', hn: 'HN12345', amount: 15000, date: '2026-01-18', status: 'Pending', fundSource: 'สภากาชาดไทย' },
      { name: 'นาง สมพร แสงแก้ว', hn: 'HN99887', amount: 3000, date: '2026-01-10', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
      { name: 'ด.ช. ธนา รักดี', hn: 'HN33211', amount: 12000, date: '2025-11-15', status: 'Approved', fundSource: 'สภากาชาดไทย' },
      { name: 'ด.ช. กิตติ เจริญ', hn: 'HN44211', amount: 25000, date: '2026-01-22', status: 'Pending', fundSource: 'Northern Care' },
      { name: 'น.ส. มะลิ แซ่ลี้', hn: 'HN67890', amount: 25000, date: '2026-01-20', status: 'Pending', fundSource: 'Northern Care' },
      { name: 'นาย สมชาย จริงใจ', hn: 'HN54321', amount: 5000, date: '2026-01-15', status: 'Approved', fundSource: 'Northern Care' },
      { name: 'ด.ญ. ศิริ มงคล', hn: 'HN44322', amount: 20000, date: '2025-12-10', status: 'Approved', fundSource: 'Northern Care' },
      { name: 'นาง ประภา ดวงแก้ว', hn: 'HN44433', amount: 18000, date: '2025-11-05', status: 'Disbursed', fundSource: 'Northern Care' },
      { name: 'นาย อภิชาติ กลิ่นหอม', hn: 'HN44544', amount: 15000, date: '2025-09-28', status: 'Disbursed', fundSource: 'Northern Care' },
      { name: 'น.ส. วิไล จันทร์แจ่ม', hn: 'HN44522', amount: 8000, date: '2025-09-20', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
      { name: 'นาย มานะ ใจเย็น', hn: 'HN55633', amount: 7000, date: '2025-07-12', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
    ],
    yearlyData: [
      { year: '2565', amount: 120000 },
      { year: '2566', amount: 150000 },
      { year: '2567', amount: 175000 },
      { year: '2568', amount: 200000 },
      { year: '2569', amount: 225000 },
    ],
  },
  {
    hospital: 'รพ.เชียงรายประชานุเคราะห์',
    province: 'เชียงราย',
    totalAmount: 145000,
    totalPatients: 6,
    fundBreakdown: [
      { source: 'สภากาชาดไทย (Red Cross)', amount: 25000, patients: 3 },
      { source: 'กองทุนรัฐบาล (Northern Care)', amount: 120000, patients: 3 },
    ],
    patientList: [
      { name: 'ด.ช. สมศักดิ์ มั่นคง', hn: 'HN88211', amount: 10000, date: '2025-11-30', status: 'Approved', fundSource: 'สภากาชาดไทย' },
      { name: 'น.ส. พิมพ์ ใจดี', hn: 'HN88322', amount: 8000, date: '2025-09-15', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
      { name: 'นาย ชาย สุขสันต์', hn: 'HN88433', amount: 7000, date: '2025-07-08', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
      { name: 'ด.ช. ภูมิ รักไทย', hn: 'HN55211', amount: 20000, date: '2025-12-18', status: 'Approved', fundSource: 'Northern Care' },
      { name: 'น.ส. พิมพา ชัยมงคล', hn: 'HN55322', amount: 18000, date: '2025-10-22', status: 'Disbursed', fundSource: 'Northern Care' },
      { name: 'นาย วิโรจน์ ธรรมดี', hn: 'HN55433', amount: 15000, date: '2025-08-15', status: 'Disbursed', fundSource: 'Northern Care' },
    ],
    yearlyData: [
      { year: '2565', amount: 80000 },
      { year: '2566', amount: 95000 },
      { year: '2567', amount: 110000 },
      { year: '2568', amount: 130000 },
      { year: '2569', amount: 145000 },
    ],
  },
  {
    hospital: 'รพ.แม่ฮ่องสอน',
    province: 'แม่ฮ่องสอน',
    totalAmount: 105000,
    totalPatients: 7,
    fundBreakdown: [
      { source: 'มูลนิธิเพื่อผู้ป่วยยากไร้', amount: 35000, patients: 4 },
      { source: 'กองทุนรัฐบาล (Northern Care)', amount: 70000, patients: 3 },
    ],
    patientList: [
      { name: 'ด.ช. ภาณุ ลือชา', hn: 'HN11211', amount: 12000, date: '2026-01-08', status: 'Approved', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
      { name: 'น.ส. เพ็ญ พิมพ์', hn: 'HN11322', amount: 10000, date: '2025-11-22', status: 'Disbursed', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
      { name: 'นาย สุรศักดิ์ ใจดี', hn: 'HN11433', amount: 8000, date: '2025-09-10', status: 'Disbursed', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
      { name: 'ด.ญ. ลัดดา ทองคำ', hn: 'HN11544', amount: 5000, date: '2025-07-05', status: 'Disbursed', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
      { name: 'ด.ช. ธนวัฒน์ เจริญสุข', hn: 'HN77212', amount: 18000, date: '2025-12-28', status: 'Approved', fundSource: 'Northern Care' },
      { name: 'น.ส. พจนา ลำดวน', hn: 'HN77323', amount: 15000, date: '2025-10-15', status: 'Disbursed', fundSource: 'Northern Care' },
      { name: 'นาง สำราญ ดีใจ', hn: 'HN77434', amount: 12000, date: '2025-08-08', status: 'Disbursed', fundSource: 'Northern Care' },
    ],
    yearlyData: [
      { year: '2565', amount: 55000 },
      { year: '2566', amount: 68000 },
      { year: '2567', amount: 82000 },
      { year: '2568', amount: 95000 },
      { year: '2569', amount: 105000 },
    ],
  },
  {
    hospital: 'รพ.ลำปาง',
    province: 'ลำปาง',
    totalAmount: 80000,
    totalPatients: 3,
    fundBreakdown: [
      { source: 'กองทุนรัฐบาล (Northern Care)', amount: 80000, patients: 3 },
    ],
    patientList: [
      { name: 'ด.ญ. กนกพร มีสุข', hn: 'HN44556', amount: 45000, date: '2026-01-05', status: 'Rejected', fundSource: 'Northern Care' },
      { name: 'นาย สุรชัย พลังดี', hn: 'HN66322', amount: 20000, date: '2025-11-12', status: 'Disbursed', fundSource: 'Northern Care' },
      { name: 'น.ส. วรรณา ขาวสะอาด', hn: 'HN66433', amount: 15000, date: '2025-09-05', status: 'Disbursed', fundSource: 'Northern Care' },
    ],
    yearlyData: [
      { year: '2565', amount: 40000 },
      { year: '2566', amount: 50000 },
      { year: '2567', amount: 60000 },
      { year: '2568', amount: 70000 },
      { year: '2569', amount: 80000 },
    ],
  },
  {
    hospital: 'รพ.ลำพูน',
    province: 'ลำพูน',
    totalAmount: 30000,
    totalPatients: 3,
    fundBreakdown: [
      { source: 'สภากาชาดไทย (Red Cross)', amount: 30000, patients: 3 },
    ],
    patientList: [
      { name: 'ด.ญ. มนัส ยินดี', hn: 'HN77211', amount: 12000, date: '2025-12-05', status: 'Approved', fundSource: 'สภากาชาดไทย' },
      { name: 'นาย ประยุทธ์ ทองดี', hn: 'HN77344', amount: 10000, date: '2025-10-18', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
      { name: 'น.ส. สุภา สว่าง', hn: 'HN77455', amount: 8000, date: '2025-08-22', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
    ],
    yearlyData: [
      { year: '2565', amount: 15000 },
      { year: '2566', amount: 18000 },
      { year: '2567', amount: 22000 },
      { year: '2568', amount: 26000 },
      { year: '2569', amount: 30000 },
    ],
  },
  {
    hospital: 'รพ.ปาย',
    province: 'แม่ฮ่องสอน',
    totalAmount: 25000,
    totalPatients: 3,
    fundBreakdown: [
      { source: 'มูลนิธิเพื่อผู้ป่วยยากไร้', amount: 25000, patients: 3 },
    ],
    patientList: [
      { name: 'ด.ช. วิชัย แสนดี', hn: 'HN22211', amount: 10000, date: '2025-12-15', status: 'Approved', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
      { name: 'น.ส. สุดา บุญมี', hn: 'HN22322', amount: 8000, date: '2025-10-20', status: 'Disbursed', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
      { name: 'นาย ประเสริฐ คำดี', hn: 'HN22433', amount: 7000, date: '2025-08-12', status: 'Disbursed', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
    ],
    yearlyData: [
      { year: '2565', amount: 12000 },
      { year: '2566', amount: 15000 },
      { year: '2567', amount: 18000 },
      { year: '2568', amount: 22000 },
      { year: '2569', amount: 25000 },
    ],
  },
  {
    hospital: 'รพ.นครพิงค์',
    province: 'เชียงใหม่',
    totalAmount: 25000,
    totalPatients: 3,
    fundBreakdown: [
      { source: 'มูลนิธิเพื่อผู้ป่วยยากไร้', amount: 25000, patients: 3 },
    ],
    patientList: [
      { name: 'ด.ญ. จิราภรณ์ แสงเพชร', hn: 'HN33212', amount: 10000, date: '2025-11-28', status: 'Pending', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
      { name: 'นาง ประนอม สุขี', hn: 'HN33323', amount: 8000, date: '2025-09-18', status: 'Disbursed', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
      { name: 'นาย อนุชา รักดี', hn: 'HN33434', amount: 7000, date: '2025-07-22', status: 'Disbursed', fundSource: 'มูลนิธิเพื่อผู้ป่วยยากไร้' },
    ],
    yearlyData: [
      { year: '2565', amount: 10000 },
      { year: '2566', amount: 14000 },
      { year: '2567', amount: 18000 },
      { year: '2568', amount: 22000 },
      { year: '2569', amount: 25000 },
    ],
  },
  {
    hospital: 'รพ.ฝาง',
    province: 'เชียงใหม่',
    totalAmount: 20000,
    totalPatients: 3,
    fundBreakdown: [
      { source: 'สภากาชาดไทย (Red Cross)', amount: 20000, patients: 3 },
    ],
    patientList: [
      { name: 'ด.ญ. ดารา รักษ์', hn: 'HN99211', amount: 8000, date: '2025-12-20', status: 'Pending', fundSource: 'สภากาชาดไทย' },
      { name: 'นาง มะลิ วงษ์', hn: 'HN99322', amount: 7000, date: '2025-10-05', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
      { name: 'นาย สุชาติ ขอบคุณ', hn: 'HN99433', amount: 5000, date: '2025-08-15', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
    ],
    yearlyData: [
      { year: '2565', amount: 8000 },
      { year: '2566', amount: 12000 },
      { year: '2567', amount: 15000 },
      { year: '2568', amount: 18000 },
      { year: '2569', amount: 20000 },
    ],
  },
];

// 5-year aggregated bar chart data by hospital
const YEARLY_OVERVIEW = [
  { year: '2565', total: 340000 },
  { year: '2566', total: 422000 },
  { year: '2567', total: 500000 },
  { year: '2568', total: 583000 },
  { year: '2569', total: 655000 },
];

interface HospitalFundSummaryPageProps {
  onBack: () => void;
}

export function HospitalFundSummaryPage({ onBack }: HospitalFundSummaryPageProps) {
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null);
  const [selectedHospitalDetail, setSelectedHospitalDetail] = useState<HospitalFundInfo | null>(null);

  const grandTotal = HOSPITAL_FUND_DATA.reduce((s, h) => s + h.totalAmount, 0);
  const totalPatients = HOSPITAL_FUND_DATA.reduce((s, h) => s + h.totalPatients, 0);

  const toggleHospital = (h: string) => {
    setExpandedHospital(prev => prev === h ? null : h);
  };

  // Drill into a specific hospital
  if (selectedHospitalDetail) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
        {/* Header */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedHospitalDetail(null)} className="hover:bg-slate-100 text-[#5e5873]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="bg-[#7367f0]/10 p-2.5 rounded-xl">
            <Building2 className="w-6 h-6 text-[#7367f0]" />
          </div>
          <div className="flex-1">
            <h1 className="text-[#5e5873] text-xl">{selectedHospitalDetail.hospital}</h1>
            <p className="text-xs text-gray-500">จังหวัด{selectedHospitalDetail.province} — รายละเอียดทุนทั้งหมด</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'ยอดทุนรวม', value: `฿${selectedHospitalDetail.totalAmount.toLocaleString()}`, icon: DollarSign, color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' },
            { label: 'ผู้ป่วยที่ได้รับทุน', value: `${selectedHospitalDetail.totalPatients} ราย`, icon: Users, color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10' },
            { label: 'แหล่งทุน', value: `${selectedHospitalDetail.fundBreakdown.length} แหล่ง`, icon: Database, color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
          ].map((stat, i) => (
            <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={cn("text-lg", stat.color)}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 5-year bar chart for this hospital */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#f5a623]" /> ยอดทุน 5 ปีย้อนหลัง — {selectedHospitalDetail.hospital}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ minHeight: 260, minWidth: 200 }}>
              <ResponsiveContainer width="100%" height={260} minWidth={0} debounce={50}>
                <BarChart data={selectedHospitalDetail.yearlyData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6e6b7b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6e6b7b' }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(value: number) => [`฿${value.toLocaleString()}`, 'ยอดทุน']}
                  />
                  <Bar dataKey="amount" fill="#7367f0" radius={[6, 6, 0, 0]} name="ยอดทุน" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fund breakdown */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#f5a623]" /> แหล่งทุนที่ให้
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedHospitalDetail.fundBreakdown.map((fb, i) => {
              const pct = selectedHospitalDetail.totalAmount > 0 ? Math.round((fb.amount / selectedHospitalDetail.totalAmount) * 100) : 0;
              return (
                <div key={i} className="p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Coins size={14} className={ICON.text} />
                      <span className="text-sm text-[#5e5873]">{fb.source}</span>
                    </div>
                    <span className="text-sm text-[#f5a623]">฿{fb.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f5a623] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{pct}% ({fb.patients} ราย)</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* All patients from this hospital */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#f5a623]" /> รายชื่อผู้ป่วยที่ได้รับทุน ({selectedHospitalDetail.totalPatients} ราย)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EDE9FE]/30">
                    <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">HN</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">แหล่งทุน</TableHead>
                    <TableHead className="text-xs text-[#5e5873] text-right">จำนวนเงิน</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">วันที่</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedHospitalDetail.patientList.map((p, pi) => {
                    const sc = getStatusCfg(p.status);
                    return (
                      <TableRow key={pi} className="hover:bg-[#EDE9FE]/10 transition-colors">
                        <TableCell className="text-sm text-[#5e5873]">{p.name}</TableCell>
                        <TableCell className="text-xs text-gray-500">{p.hn}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Coins size={12} className={ICON.text} />
                            <span className="text-xs text-gray-600">{p.fundSource}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-[#f5a623]">฿{p.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-gray-500">{formatThaiDate(p.date)}</TableCell>
                        <TableCell>
                          <span className={cn("px-2 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ===== Main hospital summary view =====
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="bg-[#f5a623]/10 p-2.5 rounded-xl">
          <Building2 className="w-6 h-6 text-[#f5a623]" />
        </div>
        <div>
          <h1 className="text-[#5e5873] text-xl">สรุปภาพรวมทุนตามโรงพยาบาล</h1>
          <p className="text-xs text-gray-500">รายละเอียดการจัดสรรทุนแต่ละโรงพยาบาล 5 ปีย้อนหลัง</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'ยอดทุนรวมทุก รพ.', value: `฿${grandTotal.toLocaleString()}`, icon: DollarSign, color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' },
          { label: 'จำนวนผู้ป่วย', value: `${totalPatients} ราย`, icon: Users, color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10' },
          { label: 'โรงพยาบาลทั้งหมด', value: `${HOSPITAL_FUND_DATA.length} แห่ง`, icon: Building2, color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={cn("text-lg", stat.color)}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 5-year overview bar chart */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#f5a623]" /> ยอดเบิกจ่ายรวมทุก รพ. — 5 ปีย้อนหลัง (พ.ศ.)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ minHeight: 280, minWidth: 200 }}>
            <ResponsiveContainer width="100%" height={280} minWidth={0} debounce={50}>
              <BarChart data={YEARLY_OVERVIEW} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6e6b7b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6e6b7b' }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  formatter={(value: number) => [`฿${value.toLocaleString()}`, 'ยอดรวม']}
                />
                <Bar dataKey="total" fill="#f5a623" radius={[6, 6, 0, 0]} name="ยอดรวมทั้งหมด" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hospital list */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#f5a623]" /> รายละเอียดแต่ละโรงพยาบาล
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {HOSPITAL_FUND_DATA.sort((a, b) => b.totalAmount - a.totalAmount).map((h) => {
            const isExpanded = expandedHospital === h.hospital;
            const pct = grandTotal > 0 ? Math.round((h.totalAmount / grandTotal) * 100) : 0;
            return (
              <div key={h.hospital} className="border border-gray-100 rounded-xl overflow-hidden hover:border-[#7367f0]/30 transition-colors">
                {/* Hospital row */}
                <button
                  onClick={() => toggleHospital(h.hospital)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="bg-[#7367f0]/10 p-2.5 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#7367f0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-[#5e5873]">{h.hospital}</span>
                        <span className="text-xs text-gray-400 ml-2">({h.province})</span>
                      </div>
                      <span className="text-sm text-[#f5a623]">฿{h.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7367f0] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{pct}% • {h.totalPatients} ราย</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/30 p-4 space-y-4">
                    {/* Fund sources */}
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">แหล่งทุนที่ให้:</p>
                      {h.fundBreakdown.map((fb, fi) => (
                        <div key={fi} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-2">
                            <Coins size={14} className={ICON.text} />
                            <span className="text-sm text-[#5e5873]">{fb.source}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-[#f5a623]">฿{fb.amount.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">{fb.patients} ราย</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Patient preview */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">ผู้ป่วยล่าสุด (แสดง 3 รายการ):</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#7367f0] text-xs h-7"
                          onClick={(e) => { e.stopPropagation(); setSelectedHospitalDetail(h); }}
                        >
                          ดูทั้งหมด <Eye size={14} className="ml-1" />
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-[#EDE9FE]/20">
                              <TableHead className="text-xs text-[#5e5873]">ชื่อ</TableHead>
                              <TableHead className="text-xs text-[#5e5873]">แหล่งทุน</TableHead>
                              <TableHead className="text-xs text-[#5e5873] text-right">จำนวน</TableHead>
                              <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {h.patientList.slice(0, 3).map((p, pi) => {
                              const sc = getStatusCfg(p.status);
                              return (
                                <TableRow key={pi} className="hover:bg-white">
                                  <TableCell>
                                    <div className="text-sm text-[#5e5873]">{p.name}</div>
                                    <div className="text-xs text-gray-400">{p.hn}</div>
                                  </TableCell>
                                  <TableCell className="text-xs text-gray-600">{p.fundSource}</TableCell>
                                  <TableCell className="text-right text-sm text-[#f5a623]">฿{p.amount.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <span className={cn("px-2 py-0.5 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
