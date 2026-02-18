import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Database, Building2, Users, DollarSign, TrendingUp,
  Coins, CheckCircle2, Clock, XCircle, Activity, Heart,
  Stethoscope, Bus, GraduationCap, Shield, Target, Phone, Mail, Info,
  Calendar as CalendarIcon, ChevronDown, ChevronUp, Eye,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { FundSourceInfo, getStatusConfig } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

// ============ FUND DETAIL MOCK DATA ============
interface FundDetailData {
  description: string;
  objectives: string[];
  conditions: string[];
  maxPerPatient: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  categories: { name: string; amount: number; color: string }[];
  statusBreakdown: { status: string; count: number; amount: number }[];
  hospitals: { hospital: string; province: string; amount: number; patients: number; patientList: { name: string; hn: string; amount: number; date: string; status: string; category?: string }[] }[];
  recentTransactions: { date: string; patient: string; hospital: string; amount: number; action: string }[];
}

const FUND_DETAILS: Record<string, FundDetailData> = {
  'S1': {
    description: 'กองทุนสภากาชาดไทยให้การสนับสนุนค่าใช้จ่ายด้านการรักษาพยาบาล การผ่าตัด และการฟื้นฟูสมรรถภาพสำหรับผู้ป่วยปากแหว่งเพดานโหว่ที่ขาดแคลนทุนทรัพย์',
    objectives: ['สนับสนุนค่าผ่าตัดซ่อมแซมปากแหว่งเพดานโหว่', 'ช่วยเหลือค่าเดินทางมารักษา', 'สนับสนุนค่าฟื้นฟูการพูดและการได้ยิน', 'ให้ทุนสำหรับอุปกรณ์ทางการแพทย์ที่จำเป็น'],
    conditions: ['ผู้ป่วยต้องมีรายได้ครัวเรือนไม่เกิน 100,000 บาท/ปี', 'ต้องมีใบรับรองแพทย์ยืนยันการวินิจฉัย', 'มีเอกสาร สำเนาบัตร ทะเบียนบ้าน ครบถ้วน', 'ผ่านการประเมินจาก Case Manager'],
    maxPerPatient: 50000,
    contactName: 'คุณสมศรี วิชาญ',
    contactPhone: '053-999-888',
    contactEmail: 'redcross.fund@trc.or.th',
    categories: [
      { name: 'ค่าผ่าตัด', amount: 55000, color: '#ea5455' },
      { name: 'ค่าเดินทาง', amount: 28000, color: '#4285f4' },
      { name: 'ค่าฟื้นฟูการพูด', amount: 22000, color: '#f5a623' },
      { name: 'อุปกรณ์การแพทย์', amount: 15000, color: '#7367f0' },
    ],
    statusBreakdown: [{ status: 'Pending', count: 3, amount: 31000 }, { status: 'Approved', count: 4, amount: 42000 }, { status: 'Disbursed', count: 7, amount: 47000 }],
    hospitals: [
      { hospital: 'รพ.มหาราชนครเชียงใหม่', province: 'เชียงใหม่', amount: 45000, patients: 5, patientList: [
        { name: 'ด.ช. อนันต์ สุขใจ', hn: 'HN12345', amount: 15000, date: '2026-01-18', status: 'Pending', category: 'ค่าผ่าตัด' },
        { name: 'นาง สมพร แสงแก้ว', hn: 'HN99887', amount: 3000, date: '2026-01-10', status: 'Disbursed', category: 'ค่าเดินทาง' },
        { name: 'ด.ช. ธนา รักดี', hn: 'HN33211', amount: 12000, date: '2025-11-15', status: 'Approved', category: 'ค่าผ่าตัด' },
      ]},
      { hospital: 'รพ.ลำพูน', province: 'ลำพูน', amount: 30000, patients: 3, patientList: [
        { name: 'ด.ญ. มนัส ยินดี', hn: 'HN77211', amount: 12000, date: '2025-12-05', status: 'Approved', category: 'ค่าผ่าตัด' },
        { name: 'นาย ประยุทธ์ ทองดี', hn: 'HN77344', amount: 10000, date: '2025-10-18', status: 'Disbursed', category: 'ค่าเดินทาง' },
      ]},
    ],
    recentTransactions: [
      { date: '2026-01-18', patient: 'ด.ช. อนันต์ สุขใจ', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 15000, action: 'ยื่นคำขอใหม่' },
      { date: '2026-01-10', patient: 'นาง สมพร แสงแก้ว', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 3000, action: 'จ่ายเงินแล้ว' },
      { date: '2025-12-05', patient: 'ด.ญ. มนัส ยินดี', hospital: 'รพ.ลำพูน', amount: 12000, action: 'อนุมัติแล้ว' },
    ],
  },
  'S2': {
    description: 'มูลนิธิเพื่อผู้ป่วยยากไร้ให้การช่วยเหลือด้านค่ารักษาพยาบาล ค่าครองชีพ และค่าเดินทาง สำหรับผู้ป่วยที่มีฐานะยากลำบาก',
    objectives: ['ช่วยเหลือค่าครองชีพระหว่างเข้ารักษา', 'สนับสนุนค่าเดินทางจากพื้นที่ห่างไกล', 'ให้ทุนฟื้นฟูหลังผ่าตัด', 'ส่งเสริมพัฒนาการเด็กหลังการรักษา'],
    conditions: ['ผู้ป่วยอยู่ในพื้นที่ห่างไกลหรือชายแดน', 'ครอบครัวมีรายได้ต่ำกว่าเกณฑ์', 'ได้รับการส่งต่อจาก Case Manager ของ SCFC', 'มีเอกสารรับรองสถานะครอบครัว'],
    maxPerPatient: 30000,
    contactName: 'คุณวราภรณ์ ดวงดี',
    contactPhone: '053-777-666',
    contactEmail: 'foundation.help@gmail.com',
    categories: [
      { name: 'ค่าครองชีพ', amount: 30000, color: '#28c76f' },
      { name: 'ค่าเดินทาง', amount: 25000, color: '#4285f4' },
      { name: 'ค่าฟื้นฟูหลังผ่าตัด', amount: 18000, color: '#f5a623' },
      { name: 'ค่าพัฒนาการเด็ก', amount: 12000, color: '#e91e63' },
    ],
    statusBreakdown: [{ status: 'Pending', count: 2, amount: 18000 }, { status: 'Approved', count: 2, amount: 22000 }, { status: 'Disbursed', count: 6, amount: 45000 }],
    hospitals: [
      { hospital: 'รพ.แม่ฮ่องสอน', province: 'แม่ฮ่องสอน', amount: 35000, patients: 4, patientList: [
        { name: 'ด.ช. ภาณุ ลือชา', hn: 'HN11211', amount: 12000, date: '2026-01-08', status: 'Approved', category: 'ค่าครองชีพ' },
        { name: 'น.ส. เพ็ญ พิมพ์', hn: 'HN11322', amount: 10000, date: '2025-11-22', status: 'Disbursed', category: 'ค่าเดินทาง' },
      ]},
      { hospital: 'รพ.ปาย', province: 'แม่ฮ่องสอน', amount: 25000, patients: 3, patientList: [
        { name: 'ด.ช. วิชัย แสนดี', hn: 'HN22211', amount: 10000, date: '2025-12-15', status: 'Approved', category: 'ค่าครองชีพ' },
      ]},
    ],
    recentTransactions: [
      { date: '2026-01-08', patient: 'ด.ช. ภาณุ ลือชา', hospital: 'รพ.แม่ฮ่องสอน', amount: 12000, action: 'อนุมัติแล้ว' },
      { date: '2025-12-15', patient: 'ด.ช. วิชัย แสนดี', hospital: 'รพ.ปาย', amount: 10000, action: 'อนุมัติแล้ว' },
    ],
  },
  'S3': {
    description: 'กองทุนรัฐบาล Northern Care เป็นกองทุนหลักที่ให้การสนับสนุนการรักษาผู้ป่วยปากแหว่งเพดานโหว่ครอบคลุมค่าผ่าตัด ค่ายา ค่าฟื้นฟู และค่าติดตามผลระยะยาว',
    objectives: ['ครอบคลุมค่าผ่าตัดหลัก (Primary Surgery)', 'สนับสนุนค่าผ่าตัดแก้ไข (Secondary Surgery)', 'ให้ทุนค่ารักษาฟื้นฟูและกายภาพบำบัด', 'ติดตามผลการรักษาระยะยาว 5 ปี'],
    conditions: ['ผู้ป่วยในเขตสุขภาพภาคเหนือ (เขต 1-3)', 'มีใบส่งตัวจากแพทย์ผู้เชี่ยวชาญ', 'ผ่านการคัดกรองตามเกณฑ์ SCFC', 'ยินยอมเข้าร่วมการติดตามผลระยะยาว'],
    maxPerPatient: 100000,
    contactName: 'นพ. สุรพล เจริญสุข',
    contactPhone: '053-888-777',
    contactEmail: 'northern.care@moph.go.th',
    categories: [
      { name: 'ค่าผ่าตัดหลัก', amount: 220000, color: '#ea5455' },
      { name: 'ค่าผ่าตัดแก้ไข', amount: 110000, color: '#7367f0' },
      { name: 'ค่าฟื้นฟูและกายภาพ', amount: 75000, color: '#f5a623' },
      { name: 'ค่าติดตามผล', amount: 30000, color: '#4285f4' },
    ],
    statusBreakdown: [{ status: 'Pending', count: 4, amount: 93000 }, { status: 'Approved', count: 5, amount: 83000 }, { status: 'Rejected', count: 1, amount: 45000 }, { status: 'Disbursed', count: 5, amount: 80000 }],
    hospitals: [
      { hospital: 'รพ.มหาราชนครเชียงใหม่', province: 'เชียงใหม่', amount: 180000, patients: 6, patientList: [
        { name: 'ด.ช. กิตติ เจริญ', hn: 'HN44211', amount: 25000, date: '2026-01-22', status: 'Pending', category: 'ค่าผ่าตัดหลัก' },
        { name: 'น.ส. มะลิ แซ่ลี้', hn: 'HN67890', amount: 25000, date: '2026-01-20', status: 'Pending', category: 'ค่า���่าตัดแก้ไข' },
        { name: 'นาย สมชาย จริงใจ', hn: 'HN54321', amount: 5000, date: '2026-01-15', status: 'Approved', category: 'ค่าติดตามผล' },
      ]},
      { hospital: 'รพ.เชียงรายประชานุเคราะห์', province: 'เชียงราย', amount: 120000, patients: 3, patientList: [
        { name: 'ด.ช. ภูมิ รักไทย', hn: 'HN55211', amount: 20000, date: '2025-12-18', status: 'Approved', category: 'ค่าผ่าตัดหลัก' },
      ]},
    ],
    recentTransactions: [
      { date: '2026-01-22', patient: 'ด.ช. กิตติ เจริญ', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 25000, action: 'ยื่นคำขอใหม่' },
      { date: '2026-01-20', patient: 'น.ส. มะลิ แซ่ลี้', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 25000, action: 'ยื่นคำขอใหม่' },
      { date: '2026-01-15', patient: 'นาย สมชาย จริงใจ', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 5000, action: 'อนุมัติแล้ว' },
    ],
  },
};

const STATUS_CLR: Record<string, string> = { Pending: '#f5a623', Approved: '#4285f4', Rejected: '#ea5455', Disbursed: '#28c76f', Received: '#7367f0' };

const getTransactionStyle = (action: string) => {
  if (action.includes('ยื่น')) return { color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' };
  if (action.includes('อนุมัติ')) return { color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10' };
  if (action.includes('จ่าย')) return { color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' };
  if (action.includes('ปฏิเสธ')) return { color: 'text-[#ea5455]', bg: 'bg-[#ea5455]/10' };
  return { color: 'text-gray-500', bg: 'bg-gray-100' };
};

interface Props {
  source: FundSourceInfo;
  onBack: () => void;
}

export function FundSourceDetailDrilldown({ source, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'hospitals' | 'transactions'>('overview');
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null);

  const detail = FUND_DETAILS[source.id] || FUND_DETAILS['S1'];
  const remaining = source.totalBudget - source.disbursed;
  const usagePercent = Math.round((source.disbursed / source.totalBudget) * 100);
  const totalPatients = detail.hospitals.reduce((s, h) => s + h.patients, 0);
  const totalCategoryAmount = detail.categories.reduce((s, c) => s + c.amount, 0);

  const statusPieData = detail.statusBreakdown.map(s => ({
    name: getStatusConfig(s.status).label,
    value: s.count,
    color: STATUS_CLR[s.status] || '#999',
    amount: s.amount,
  }));

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      {/* Purple sticky header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{source.name}</h1>
          <p className="text-white/70 text-[14px] truncate">รายละเอียดแหล่งทุน</p>
        </div>
        <span className={cn("text-[14px] font-bold px-3 py-1 rounded-full shrink-0", source.status === 'Active' ? "bg-green-500/20 text-green-200" : "bg-white/20 text-white/70")}>
          {source.status === 'Active' ? 'ใช้งาน' : 'ปิด'}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Summary stats */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {[
            { label: 'งบประมาณรวม', value: `฿${source.totalBudget.toLocaleString()}`, icon: DollarSign, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'เบิกจ่ายแล้ว', value: `฿${source.disbursed.toLocaleString()}`, icon: TrendingUp, iconColor: 'text-[#f5a623]', iconBg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'คงเหลือ', value: `฿${remaining.toLocaleString()}`, icon: Coins, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
            { label: 'ผู้ป่วย', value: `${totalPatients} ราย`, icon: Users, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border", s.border)}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}>
                <s.icon size={20} className={s.iconColor} />
              </div>
              <div>
                <span className="text-[16px] font-black text-[#37286A] leading-none">{s.value}</span>
                <p className="text-[14px] font-bold text-[#7066A9]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Usage progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[16px] text-[#37286A] font-bold">อัตราการใช้งบประมาณ</span>
            <span className="text-[16px] font-black text-[#f5a623]">{usagePercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${usagePercent}%`, background: 'linear-gradient(90deg, #f5a623, #f7c56e)' }} />
          </div>
          <div className="flex justify-between text-[14px] text-[#7066A9] mt-2">
            <span>เบิกจ่าย ฿{source.disbursed.toLocaleString()}</span>
            <span>สูงสุดต่อราย ฿{detail.maxPerPatient.toLocaleString()}</span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-[#E3E0F0] flex gap-1">
          {[
            { id: 'overview' as const, label: 'ภาพรวม' },
            { id: 'hospitals' as const, label: 'โรงพยาบาล' },
            { id: 'transactions' as const, label: 'ธุรกรรม' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("flex-1 py-2.5 rounded-lg text-[16px] font-bold transition-all text-center", activeTab === tab.id ? "bg-[#49358E] text-white shadow-sm" : "text-[#7066A9] hover:bg-[#F4F0FF]")}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== TAB: OVERVIEW ===== */}
        {activeTab === 'overview' && (
          <>
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
                <Info className="text-[#7066A9]" size={18} /> รายละเอียดกองทุน
              </h3>
              <p className="text-[16px] text-[#6a7282] leading-relaxed">{detail.description}</p>

              <h4 className="font-bold text-[#37286A] text-[16px] flex items-center gap-2 mt-4 mb-2">
                <Target size={16} className="text-[#49358E]" /> วัตถุประสงค์
              </h4>
              <div className="space-y-2">
                {detail.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f5a623] mt-2 shrink-0" />
                    <span className="text-[16px] text-[#6a7282]">{obj}</span>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-[#37286A] text-[16px] flex items-center gap-2 mt-4 mb-2">
                <Shield size={16} className="text-[#49358E]" /> เงื่อนไข
              </h4>
              <div className="space-y-2">
                {detail.conditions.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#28c76f] mt-0.5 shrink-0" />
                    <span className="text-[16px] text-[#6a7282]">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status pie */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
                <Activity className="text-[#7066A9]" size={18} /> สถานะคำขอ
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-[100px] h-[100px] relative shrink-0" style={{ minWidth: 100, minHeight: 100 }}>
                  <PieChart width={100} height={100}>
                    <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={28} outerRadius={46} paddingAngle={5} dataKey="value" stroke="none">
                      {statusPieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </div>
                <div className="flex-1 space-y-2">
                  {statusPieData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[16px] text-[#5e5873]">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[16px] font-black text-[#37286A]">{item.value}</span>
                        <span className="text-[14px] text-[#f5a623] ml-1">฿{item.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
                <Coins className="text-[#7066A9]" size={18} /> หมวดค่าใช้จ่าย
              </h3>
              <div className="space-y-3">
                {detail.categories.map(cat => {
                  const pct = totalCategoryAmount > 0 ? Math.round((cat.amount / totalCategoryAmount) * 100) : 0;
                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                          <span className="text-[16px] font-bold text-[#37286A]">{cat.name}</span>
                        </div>
                        <span className="text-[16px] font-black text-[#f5a623]">฿{cat.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
                <Phone className="text-[#7066A9]" size={18} /> ข้อมูลติดต่อ
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><Users size={16} className="text-[#49358E] shrink-0" /><div><p className="text-[14px] text-[#7066A9]">ผู้รับผิดชอบ</p><p className="text-[16px] text-[#37286A] font-bold">{detail.contactName}</p></div></div>
                <div className="flex items-center gap-3"><Phone size={16} className="text-[#49358E] shrink-0" /><div><p className="text-[14px] text-[#7066A9]">โทรศัพท์</p><p className="text-[16px] text-[#37286A] font-bold">{detail.contactPhone}</p></div></div>
                <div className="flex items-center gap-3"><Mail size={16} className="text-[#49358E] shrink-0" /><div><p className="text-[14px] text-[#7066A9]">อีเมล</p><p className="text-[16px] text-[#37286A] font-bold break-all">{detail.contactEmail}</p></div></div>
              </div>
            </div>
          </>
        )}

        {/* ===== TAB: HOSPITALS ===== */}
        {activeTab === 'hospitals' && (
          <div className="space-y-3">
            {detail.hospitals.map(h => {
              const isExpanded = expandedHospital === h.hospital;
              return (
                <div key={h.hospital} className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
                  <button onClick={() => setExpandedHospital(isExpanded ? null : h.hospital)} className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F0FF]/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0"><Building2 size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[16px] font-bold text-[#37286A] truncate">{h.hospital}</span>
                        <span className="text-[16px] font-black text-[#f5a623] shrink-0">฿{h.amount.toLocaleString()}</span>
                      </div>
                      <span className="text-[14px] text-[#7066A9]">{h.province} • {h.patients} ราย</span>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-[#7066A9] shrink-0" /> : <ChevronDown size={18} className="text-[#7066A9] shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#F4F0FF] p-4 space-y-3">
                      {h.patientList.map((p, pi) => {
                        const sc = getStatusConfig(p.status);
                        return (
                          <div key={pi} className="bg-white border border-[#E3E0F0] shadow-sm rounded-2xl overflow-hidden">
                            <div className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-bold text-[#5e5873] text-[18px] truncate">{p.name}</h4>
                                  <p className="text-[14px] text-[#6a7282] mt-0.5">HN: {p.hn}</p>
                                </div>
                                <span className={cn("rounded-full px-2 py-0.5 text-[12px] font-bold shrink-0 ml-2", sc.bg, sc.color)}>{sc.label}</span>
                              </div>
                              {p.category && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Coins size={14} className="text-[#7066A9] shrink-0" />
                                  <span className="text-[16px] text-[#7367f0]">{p.category}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-100">
                                <div className="flex items-center gap-1.5">
                                  <DollarSign size={14} className="text-[#f5a623]" />
                                  <span className="text-[16px] font-bold text-[#f5a623]">{p.amount.toLocaleString()} บาท</span>
                                </div>
                                <span className="text-[14px] text-[#6a7282]">{p.date}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ===== TAB: TRANSACTIONS ===== */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF]">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
                <Activity className="text-[#7066A9]" size={18} /> ธุรกรรมล่าสุด
              </h3>
            </div>
            <div className="divide-y divide-dashed divide-gray-100">
              {detail.recentTransactions.map((tx, i) => {
                const style = getTransactionStyle(tx.action);
                return (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-bold text-[#37286A]">{tx.patient}</span>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-[14px] font-bold", style.bg, style.color)}>{tx.action}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1.5"><CalendarIcon size={14} className="text-[#7066A9]" /><span className="text-[14px] text-[#6a7282]">{tx.date}</span></div>
                      <span className="text-[14px] text-[#7066A9] truncate">{tx.hospital}</span>
                      <span className="text-[14px] font-bold text-[#f5a623] shrink-0 ml-auto">฿{tx.amount.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}