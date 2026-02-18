import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Database, Building2, Users, DollarSign,
  TrendingUp, Coins, ChevronDown, ChevronUp, ChevronRight,
  BarChart3, Wallet, Calendar, Eye, FileText,
  CheckCircle2, Clock, XCircle, Activity, Banknote,
  Heart, Stethoscope, Bus, GraduationCap, Phone,
  Mail, MapPin, Info, Shield, Target, Search
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Input } from "../../../../../components/ui/input";
import { cn } from "../../../../../components/ui/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';
import { PURPLE, SYSTEM_ICON_COLORS } from "../../../../../data/themeConfig";

const ICON = SYSTEM_ICON_COLORS.fund;

export interface FundSourceInfo {
  id: string;
  name: string;
  totalBudget: number;
  disbursed: number;
  status: string;
}

interface PatientFundRecord {
  name: string;
  hn: string;
  amount: number;
  date: string;
  status: string;
  hospital: string;
  category?: string;
}

interface HospitalDistribution {
  hospital: string;
  province: string;
  amount: number;
  patients: number;
  patientList: PatientFundRecord[];
}

// Status config
const STATUS_CFG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  Pending:   { label: 'รอพิจารณา', color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10', icon: Clock },
  Approved:  { label: 'อนุมัติแล้ว', color: 'text-[#4285f4]', bg: 'bg-blue-50', icon: CheckCircle2 },
  Rejected:  { label: 'ปฏิเสธ', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', icon: XCircle },
  Disbursed: { label: 'จ่ายเงินแล้ว', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]', icon: CheckCircle2 },
  Received:  { label: 'ได้รับเงินแล้ว', color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10', icon: Banknote },
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

// ============ FUND DETAIL DATA ============
interface FundDetailData {
  description: string;
  objectives: string[];
  conditions: string[];
  maxPerPatient: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  categories: { name: string; amount: number; color: string; icon: typeof Heart }[];
  yearlyData: { year: string; disbursed: number; patients: number }[];
  statusBreakdown: { status: string; count: number; amount: number }[];
  hospitals: HospitalDistribution[];
  recentTransactions: { date: string; patient: string; hospital: string; amount: number; action: string }[];
}

const FUND_DETAILS: Record<string, FundDetailData> = {
  'S1': {
    description: 'กองทุนสภากาชาดไทยให้การสนับสนุนค่าใช้จ่ายด้านการรักษาพยาบาล การผ่าตัด และการฟื้นฟูสมรรถภาพสำหรับผู้ป่วยปากแหว่งเพดานโหว่ที่ขาดแคลนทุนทรัพย์ในเขตภาคเหนือ',
    objectives: [
      'สนับสนุนค่าผ่าตัดซ่อมแซมปากแหว่งเพดานโหว่',
      'ช่วยเหลือค่าเดินทางมารักษาในโรงพยาบาล',
      'สนับสนุนค่าฟื้นฟูการพูดและการได้ยิน',
      'ให้ทุนสำหรับอุปกรณ์ทางการแพทย์ที่จำเป็น'
    ],
    conditions: [
      'ผู้ป่วยต้องมีรายได้ครัวเรือนไม่เกิน 100,000 บาท/ปี',
      'ต้องมีใบรับรองแพทย์ยืนยันการวินิจฉัย',
      'มีเอกสาร สำเนาบัตร ทะเบียนบ้าน ครบถ้วน',
      'ผ่านการประเมินจาก Case Manager'
    ],
    maxPerPatient: 50000,
    contactName: 'คุณสมศรี วิชาญ (ฝ่ายสวัสดิการ)',
    contactPhone: '053-999-888',
    contactEmail: 'redcross.fund@trc.or.th',
    address: 'สำนักงานสภากาชาดไทย สาขาภาคเหนือ จ.เชียงใหม่',
    categories: [
      { name: 'ค่าผ่าตัด', amount: 55000, color: '#ea5455', icon: Stethoscope },
      { name: 'ค่าเดินทาง', amount: 28000, color: '#4285f4', icon: Bus },
      { name: 'ค่าฟื้นฟูการพูด', amount: 22000, color: '#f5a623', icon: Heart },
      { name: 'อุปกรณ์การแพทย์', amount: 15000, color: '#7367f0', icon: Shield },
    ],
    yearlyData: [
      { year: '2565', disbursed: 65000, patients: 5 },
      { year: '2566', disbursed: 78000, patients: 7 },
      { year: '2567', disbursed: 92000, patients: 9 },
      { year: '2568', disbursed: 105000, patients: 11 },
      { year: '2569', disbursed: 120000, patients: 14 },
    ],
    statusBreakdown: [
      { status: 'Pending', count: 3, amount: 31000 },
      { status: 'Approved', count: 4, amount: 42000 },
      { status: 'Disbursed', count: 7, amount: 47000 },
    ],
    hospitals: [
      { hospital: 'รพ.มหาราชนครเชียงใหม่', province: 'เชียงใหม่', amount: 45000, patients: 5, patientList: [
        { name: 'ด.ช. อนันต์ สุขใจ', hn: 'HN12345', amount: 15000, date: '2026-01-18', status: 'Pending', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าผ่าตัด' },
        { name: 'นาง สมพร แสงแก้ว', hn: 'HN99887', amount: 3000, date: '2026-01-10', status: 'Disbursed', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าเดินทาง' },
        { name: 'ด.ช. ธนา รักดี', hn: 'HN33211', amount: 12000, date: '2025-11-15', status: 'Approved', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าผ่าตัด' },
        { name: 'น.ส. วิไล จันทร์แจ่ม', hn: 'HN44522', amount: 8000, date: '2025-09-20', status: 'Disbursed', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าฟื้นฟูการพูด' },
        { name: 'นาย มานะ ใจเย็น', hn: 'HN55633', amount: 7000, date: '2025-07-12', status: 'Disbursed', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าเดินทาง' },
      ]},
      { hospital: 'รพ.ลำพูน', province: 'ลำพูน', amount: 30000, patients: 3, patientList: [
        { name: 'ด.ญ. มนัส ยินดี', hn: 'HN77211', amount: 12000, date: '2025-12-05', status: 'Approved', hospital: 'รพ.ลำพูน', category: 'ค่าผ่าตัด' },
        { name: 'นาย ประยุทธ์ ทองดี', hn: 'HN77344', amount: 10000, date: '2025-10-18', status: 'Disbursed', hospital: 'รพ.ลำพูน', category: 'ค่าเดินทาง' },
        { name: 'น.ส. สุภา สว่าง', hn: 'HN77455', amount: 8000, date: '2025-08-22', status: 'Disbursed', hospital: 'รพ.ลำพูน', category: 'ค่าฟื้นฟูการพูด' },
      ]},
      { hospital: 'รพ.เชียงรายประชานุเคราะห์', province: 'เชียงราย', amount: 25000, patients: 3, patientList: [
        { name: 'ด.ช. สมศักดิ์ มั่นคง', hn: 'HN88211', amount: 10000, date: '2025-11-30', status: 'Approved', hospital: 'รพ.เชียงรายประชานุเคราะห์', category: 'ค่าผ่าตัด' },
        { name: 'น.ส. พิมพ์ ใจดี', hn: 'HN88322', amount: 8000, date: '2025-09-15', status: 'Disbursed', hospital: 'รพ.เชียงรายประชานุเคราะห์', category: 'อุปกรณ์การแพทย์' },
        { name: 'นาย ชาย สุขสันต์', hn: 'HN88433', amount: 7000, date: '2025-07-08', status: 'Disbursed', hospital: 'รพ.เชียงรายประชานุเคราะห์', category: 'ค่าเดินทาง' },
      ]},
      { hospital: 'รพ.ฝาง', province: 'เชียงใหม่', amount: 20000, patients: 3, patientList: [
        { name: 'ด.ญ. ดารา รักษ์', hn: 'HN99211', amount: 8000, date: '2025-12-20', status: 'Pending', hospital: 'รพ.ฝาง', category: 'ค่าผ่าตัด' },
        { name: 'นาง มะลิ วงษ์', hn: 'HN99322', amount: 7000, date: '2025-10-05', status: 'Disbursed', hospital: 'รพ.ฝาง', category: 'ค่าเดินทาง' },
        { name: 'นาย สุชาติ ขอบคุณ', hn: 'HN99433', amount: 5000, date: '2025-08-15', status: 'Disbursed', hospital: 'รพ.ฝาง', category: 'ค่าฟื้นฟูการพูด' },
      ]},
    ],
    recentTransactions: [
      { date: '2026-01-18', patient: 'ด.ช. อนันต์ สุขใจ', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 15000, action: 'ยื่นคำขอใหม่' },
      { date: '2026-01-10', patient: 'นาง สมพร แสงแก้ว', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 3000, action: 'จ่ายเงินแล้ว' },
      { date: '2025-12-20', patient: 'ด.ญ. ดารา รักษ์', hospital: 'รพ.ฝาง', amount: 8000, action: 'ยื่นคำขอใหม่' },
      { date: '2025-12-05', patient: 'ด.ญ. มนัส ยินดี', hospital: 'รพ.ลำพูน', amount: 12000, action: 'อนุมัติแล้ว' },
      { date: '2025-11-30', patient: 'ด.ช. สมศักดิ์ มั่นคง', hospital: 'รพ.เชียงรายประชานุเคราะห์', amount: 10000, action: 'อนุมัติแล้ว' },
    ],
  },
  'S2': {
    description: 'มูลนิธิเพื่อผู้ป่วยยากไร้ให้การช่วยเหลือด้านค่ารักษาพยาบาล ค่าครองชีพ และค่าเดินทาง สำหรับผู้ป่วยที่มีฐานะยากลำบากในพื้นที่ห่างไกล โดยเฉพาะพื้นที่สูงและชายแดน',
    objectives: [
      'ช่วยเหลือค่าครองชีพระหว่างเข้ารักษา',
      'สนับสนุนค่าเดินทางจากพื้นที่ห่างไกล',
      'ให้ทุนฟื้นฟูหลังผ่าตัด',
      'ส่งเสริมพัฒนาการเด็กหลังการรักษา'
    ],
    conditions: [
      'ผู้ป่วยอยู่ในพื้นที่ห่างไกลหรือชายแดน',
      'ครอบครัวมีรายได้ต่ำกว่าเกณฑ์',
      'ได้รับการส่งต่อจาก Case Manager ของ SCFC',
      'มีเอกสารรับรองสถานะครอบครัว'
    ],
    maxPerPatient: 30000,
    contactName: 'คุณวราภรณ์ ดวงดี (ผู้ประสานงาน)',
    contactPhone: '053-777-666',
    contactEmail: 'foundation.help@gmail.com',
    address: 'มูลนิธิเพื่อผู้ป่วยยากไร้ อ.เมือง จ.เชียงใหม่',
    categories: [
      { name: 'ค่าครองชีพ', amount: 30000, color: '#28c76f', icon: Heart },
      { name: 'ค่าเดินทาง', amount: 25000, color: '#4285f4', icon: Bus },
      { name: 'ค่าฟื้นฟูหลังผ่าตัด', amount: 18000, color: '#f5a623', icon: Activity },
      { name: 'ค่าพัฒนาการเด็ก', amount: 12000, color: '#e91e63', icon: GraduationCap },
    ],
    yearlyData: [
      { year: '2565', disbursed: 35000, patients: 3 },
      { year: '2566', disbursed: 48000, patients: 5 },
      { year: '2567', disbursed: 62000, patients: 6 },
      { year: '2568', disbursed: 75000, patients: 8 },
      { year: '2569', disbursed: 85000, patients: 10 },
    ],
    statusBreakdown: [
      { status: 'Pending', count: 2, amount: 18000 },
      { status: 'Approved', count: 2, amount: 22000 },
      { status: 'Disbursed', count: 6, amount: 45000 },
    ],
    hospitals: [
      { hospital: 'รพ.แม่ฮ่องสอน', province: 'แม่ฮ่องสอน', amount: 35000, patients: 4, patientList: [
        { name: 'ด.ช. ภาณุ ลือชา', hn: 'HN11211', amount: 12000, date: '2026-01-08', status: 'Approved', hospital: 'รพ.แม่ฮ่องสอน', category: 'ค่าครองชีพ' },
        { name: 'น.ส. เพ็ญ พิมพ์', hn: 'HN11322', amount: 10000, date: '2025-11-22', status: 'Disbursed', hospital: 'รพ.แม่ฮ่องสอน', category: 'ค่าเดินทาง' },
        { name: 'นาย สุรศักดิ์ ใจดี', hn: 'HN11433', amount: 8000, date: '2025-09-10', status: 'Disbursed', hospital: 'รพ.แม่ฮ่องสอน', category: 'ค่าฟื้นฟูหลังผ่าตัด' },
        { name: 'ด.ญ. ลัดดา ทองคำ', hn: 'HN11544', amount: 5000, date: '2025-07-05', status: 'Disbursed', hospital: 'รพ.แม่ฮ่องสอน', category: 'ค่าพัฒนาการเด็ก' },
      ]},
      { hospital: 'รพ.ปาย', province: 'แม่ฮ่องสอน', amount: 25000, patients: 3, patientList: [
        { name: 'ด.ช. วิชัย แสนดี', hn: 'HN22211', amount: 10000, date: '2025-12-15', status: 'Approved', hospital: 'รพ.ปาย', category: 'ค่าครองชีพ' },
        { name: 'น.ส. สุดา บุญมี', hn: 'HN22322', amount: 8000, date: '2025-10-20', status: 'Disbursed', hospital: 'รพ.ปาย', category: 'ค่าเดินทาง' },
        { name: 'นาย ประเสริฐ คำดี', hn: 'HN22433', amount: 7000, date: '2025-08-12', status: 'Disbursed', hospital: 'รพ.ปาย', category: 'ค่าฟื้นฟูหลังผ่าตัด' },
      ]},
      { hospital: 'รพ.นครพิงค์', province: 'เชียงใหม่', amount: 25000, patients: 3, patientList: [
        { name: 'ด.ญ. จิราภรณ์ แสงเพชร', hn: 'HN33212', amount: 10000, date: '2025-11-28', status: 'Pending', hospital: 'รพ.นครพิงค์', category: 'ค่าครองชีพ' },
        { name: 'นาง ประนอม สุขี', hn: 'HN33323', amount: 8000, date: '2025-09-18', status: 'Disbursed', hospital: 'รพ.นครพิงค์', category: 'ค่าเดินทาง' },
        { name: 'นาย อนุชา รักดี', hn: 'HN33434', amount: 7000, date: '2025-07-22', status: 'Disbursed', hospital: 'รพ.นครพิงค์', category: 'ค่าพัฒนาการเด็ก' },
      ]},
    ],
    recentTransactions: [
      { date: '2026-01-08', patient: 'ด.ช. ภาณุ ลือชา', hospital: 'รพ.แม่ฮ่องสอน', amount: 12000, action: 'อนุมัติแล้ว' },
      { date: '2025-12-15', patient: 'ด.ช. วิชัย แสนดี', hospital: 'รพ.ปาย', amount: 10000, action: 'อนุมัติแล้ว' },
      { date: '2025-11-28', patient: 'ด.ญ. จิราภรณ์ แสงเพชร', hospital: 'รพ.นครพิงค์', amount: 10000, action: 'ยื่นคำขอใหม่' },
      { date: '2025-11-22', patient: 'น.ส. เพ็ญ พิมพ์', hospital: 'รพ.แม่ฮ่องสอน', amount: 10000, action: 'จ่ายเงินแล้ว' },
    ],
  },
  'S3': {
    description: 'กองทุนรัฐบาล Northern Care เป็นกองทุนหลักที่ให้การสนับสนุนการรักษาผู้ป่วยปากแหว่งเพดานโหว่ครอบคลุมค่าผ่าตัด ค่ายา ค่าฟื้นฟู และค่าติดตามผลระยะยาว ภายใต้โครงการดูแลสุขภาพภาคเหนือ',
    objectives: [
      'ครอบคลุมค่าผ่าตัดหลัก (Primary Surgery)',
      'สนับสนุนค่าผ่าตัดแก้ไข (Secondary Surgery)',
      'ให้ทุนค่ารักษาฟื้นฟูและกายภาพบำบัด',
      'ติดตามผลการรักษาระยะยาว 5 ปี',
      'วิจัยและพัฒนาเทคนิคการรักษา'
    ],
    conditions: [
      'ผู้ป่วยในเขตสุขภาพภาคเหนือ (เขต 1-3)',
      'มีใบส่งตัวจากแพทย์ผู้เชี่ยวชาญ',
      'ผ่านการคัดกรองตามเกณฑ์ SCFC',
      'ยินยอมเข้าร่วมการติดตามผลระยะยาว',
      'ไม่มีสิทธิ์ซ้ำซ้อนกับกองทุนอื่น'
    ],
    maxPerPatient: 100000,
    contactName: 'นพ. สุรพล เจริญสุข (ผู้อำนวยการกองทุน)',
    contactPhone: '053-888-777',
    contactEmail: 'northern.care@moph.go.th',
    address: 'สำนักงานเขตสุขภาพที่ 1 จ.เชียงใหม่',
    categories: [
      { name: 'ค่าผ่าตัดหลัก', amount: 220000, color: '#ea5455', icon: Stethoscope },
      { name: 'ค่าผ่าตัดแก้ไข', amount: 110000, color: '#7367f0', icon: Activity },
      { name: 'ค่าฟื้นฟูและกายภาพ', amount: 75000, color: '#f5a623', icon: Heart },
      { name: 'ค่าติดตามผล', amount: 30000, color: '#4285f4', icon: Eye },
      { name: 'ค่าวิจัย', amount: 15000, color: '#28c76f', icon: GraduationCap },
    ],
    yearlyData: [
      { year: '2565', disbursed: 280000, patients: 18 },
      { year: '2566', disbursed: 320000, patients: 22 },
      { year: '2567', disbursed: 380000, patients: 28 },
      { year: '2568', disbursed: 420000, patients: 32 },
      { year: '2569', disbursed: 450000, patients: 38 },
    ],
    statusBreakdown: [
      { status: 'Pending', count: 4, amount: 93000 },
      { status: 'Approved', count: 5, amount: 83000 },
      { status: 'Rejected', count: 1, amount: 45000 },
      { status: 'Disbursed', count: 5, amount: 80000 },
    ],
    hospitals: [
      { hospital: 'รพ.มหาราชนครเชียงใหม่', province: 'เชียงใหม่', amount: 180000, patients: 6, patientList: [
        { name: 'ด.ช. กิตติ เจริญ', hn: 'HN44211', amount: 25000, date: '2026-01-22', status: 'Pending', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าผ่าตัดหลัก' },
        { name: 'น.ส. มะลิ แซ่ลี้', hn: 'HN67890', amount: 25000, date: '2026-01-20', status: 'Pending', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าผ่าตัดแก้ไข' },
        { name: 'นาย สมชาย จริงใจ', hn: 'HN54321', amount: 5000, date: '2026-01-15', status: 'Approved', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าติดตามผล' },
        { name: 'ด.ญ. ศิริ มงคล', hn: 'HN44322', amount: 20000, date: '2025-12-10', status: 'Approved', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าผ่าตัดหลัก' },
        { name: 'นาง ประภา ดวงแก้ว', hn: 'HN44433', amount: 18000, date: '2025-11-05', status: 'Disbursed', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าฟื้นฟูและกายภาพ' },
        { name: 'นาย อภิชาติ กลิ่นหอม', hn: 'HN44544', amount: 15000, date: '2025-09-28', status: 'Disbursed', hospital: 'รพ.มหาราชนครเชียงใหม่', category: 'ค่าผ่าตัดแก้ไข' },
      ]},
      { hospital: 'รพ.เชียงรายประชานุเคราะห์', province: 'เชียงราย', amount: 120000, patients: 3, patientList: [
        { name: 'ด.ช. ภูมิ รักไทย', hn: 'HN55211', amount: 20000, date: '2025-12-18', status: 'Approved', hospital: 'รพ.เชียงรายประชานุเคราะห์', category: 'ค่าผ่าตัดหลัก' },
        { name: 'น.ส. พิมพา ชัยมงคล', hn: 'HN55322', amount: 18000, date: '2025-10-22', status: 'Disbursed', hospital: 'รพ.เชียงรายประชานุเคราะห์', category: 'ค่าฟื้นฟูและกายภาพ' },
        { name: 'นาย วิโรจน์ ธรรมดี', hn: 'HN55433', amount: 15000, date: '2025-08-15', status: 'Disbursed', hospital: 'รพ.เชียงรายประชานุเคราะห์', category: 'ค่าผ่าตัดแก้ไข' },
      ]},
      { hospital: 'รพ.ลำปาง', province: 'ลำปาง', amount: 80000, patients: 3, patientList: [
        { name: 'ด.ญ. กนกพร มีสุข', hn: 'HN44556', amount: 45000, date: '2026-01-05', status: 'Rejected', hospital: 'รพ.ลำปาง', category: 'ค่าผ่าตัดหลัก' },
        { name: 'นาย สุรชัย พลังดี', hn: 'HN66322', amount: 20000, date: '2025-11-12', status: 'Disbursed', hospital: 'รพ.ลำปาง', category: 'ค่าผ่าตัดแก้ไข' },
        { name: 'น.ส. วรรณา ขาวสะอาด', hn: 'HN66433', amount: 15000, date: '2025-09-05', status: 'Disbursed', hospital: 'รพ.ลำปาง', category: 'ค่าฟื้นฟูและกายภาพ' },
      ]},
      { hospital: 'รพ.แม่ฮ่องสอน', province: 'แม่ฮ่องสอน', amount: 70000, patients: 3, patientList: [
        { name: 'ด.ช. ธนวัฒน์ เจริญสุข', hn: 'HN77212', amount: 18000, date: '2025-12-28', status: 'Approved', hospital: 'รพ.แม่ฮ่องสอน', category: 'ค่าผ่าตัดหลัก' },
        { name: 'น.ส. พจนา ลำดวน', hn: 'HN77323', amount: 15000, date: '2025-10-15', status: 'Disbursed', hospital: 'รพ.แม่ฮ่องสอน', category: 'ค่าผ่าตัดแก้ไข' },
        { name: 'นาง สำราญ ดีใจ', hn: 'HN77434', amount: 12000, date: '2025-08-08', status: 'Disbursed', hospital: 'รพ.แม่ฮ่องสอน', category: 'ค่าฟื้นฟูและกายภาพ' },
      ]},
    ],
    recentTransactions: [
      { date: '2026-01-22', patient: 'ด.ช. กิตติ เจริญ', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 25000, action: 'ยื่นคำขอใหม่' },
      { date: '2026-01-20', patient: 'น.ส. มะลิ แซ่ลี้', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 25000, action: 'ยื่นคำขอใหม่' },
      { date: '2026-01-15', patient: 'นาย สมชาย จริงใจ', hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 5000, action: 'อนุมัติแล้ว' },
      { date: '2026-01-05', patient: 'ด.ญ. กนกพร มีสุข', hospital: 'รพ.ลำปาง', amount: 45000, action: 'ปฏิเสธ' },
      { date: '2025-12-28', patient: 'ด.ช. ธนวัฒน์ เจริญสุข', hospital: 'รพ.แม่ฮ่องสอน', amount: 18000, action: 'อนุมัติแล้ว' },
    ],
  },
};

// ============ COMPONENT ============
interface FundSourceDetailPageProps {
  source: FundSourceInfo;
  onBack: () => void;
}

export function FundSourceDetailPage({ source, onBack }: FundSourceDetailPageProps) {
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hospitals' | 'transactions'>('overview');
  const [hospitalSearch, setHospitalSearch] = useState('');

  const detail = FUND_DETAILS[source.id] || FUND_DETAILS['S1'];
  const remaining = source.totalBudget - source.disbursed;
  const usagePercent = Math.round((source.disbursed / source.totalBudget) * 100);
  const totalPatients = detail.hospitals.reduce((s, h) => s + h.patients, 0);
  const totalCategoryAmount = detail.categories.reduce((s, c) => s + c.amount, 0);

  const filteredHospitals = useMemo(() => {
    if (!hospitalSearch.trim()) return detail.hospitals;
    const term = hospitalSearch.toLowerCase();
    return detail.hospitals.filter(h =>
      h.hospital.toLowerCase().includes(term) ||
      h.province.toLowerCase().includes(term)
    );
  }, [detail.hospitals, hospitalSearch]);

  const toggleHospital = (h: string) => {
    setExpandedHospital(prev => prev === h ? null : h);
  };

  const statusPieData = detail.statusBreakdown.map(s => {
    const cfg = getStatusCfg(s.status);
    const colorMap: Record<string, string> = {
      Pending: '#f5a623', Approved: '#4285f4', Rejected: '#ea5455',
      Disbursed: '#28c76f', Received: '#7367f0'
    };
    return { name: cfg.label, value: s.count, color: colorMap[s.status] || '#999', amount: s.amount };
  });

  const getTransactionColor = (action: string) => {
    if (action.includes('ยื่น')) return { color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10', icon: FileText };
    if (action.includes('อนุมัติ')) return { color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10', icon: CheckCircle2 };
    if (action.includes('จ่าย')) return { color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10', icon: DollarSign };
    if (action.includes('ปฏิเสธ')) return { color: 'text-[#ea5455]', bg: 'bg-[#ea5455]/10', icon: XCircle };
    return { color: 'text-gray-500', bg: 'bg-gray-100', icon: Activity };
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="bg-[#f5a623]/10 p-2.5 rounded-xl">
          <Database className={cn("w-6 h-6", ICON.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[#5e5873] text-xl truncate">{source.name}</h1>
          <p className="text-xs text-gray-500">รายละเอียดแหล่งทุน</p>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs shrink-0",
          source.status === 'Active' ? "bg-green-50 text-[#28c76f]" : "bg-gray-100 text-gray-400"
        )}>
          {source.status === 'Active' ? 'ใช้งาน' : 'ปิด'}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'งบประมาณรวม', value: `฿${source.totalBudget.toLocaleString()}`, icon: Wallet, color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
          { label: 'เบิกจ่ายแล้ว', value: `฿${source.disbursed.toLocaleString()}`, icon: DollarSign, color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' },
          { label: 'คงเหลือ', value: `฿${remaining.toLocaleString()}`, icon: TrendingUp, color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
          { label: 'ผู้ป่วยทั้งหมด', value: `${totalPatients} ราย`, icon: Users, color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-all">
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

      {/* Usage progress */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#5e5873]">อัตราการใช้งบประมาณ</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">วงเงินสูงสุดต่อราย ฿{detail.maxPerPatient.toLocaleString()}</span>
              <span className="text-sm text-[#f5a623]">{usagePercent}%</span>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${usagePercent}%`, background: 'linear-gradient(90deg, #f5a623, #f7c56e)' }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>เบิกจ่าย ฿{source.disbursed.toLocaleString()}</span>
            <span>คงเหลือ ฿{remaining.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex gap-1">
        {[
          { id: 'overview' as const, label: 'ภาพรวม', icon: BarChart3 },
          { id: 'hospitals' as const, label: 'โรงพยาบาล', icon: Building2 },
          { id: 'transactions' as const, label: 'ธุรกรรมล่าสุด', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all",
              activeTab === tab.id
                ? "bg-[#7367f0] text-white shadow-sm"
                : "text-gray-500 hover:text-[#7367f0] hover:bg-gray-50"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== TAB: OVERVIEW ===== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Description + Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-gray-100 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#f5a623]" /> รายละเอียดกองทุน
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm text-gray-600 leading-relaxed">{detail.description}</p>

                <div>
                  <h4 className="text-sm text-[#5e5873] mb-2 flex items-center gap-2">
                    <Target size={14} className="text-[#7367f0]" /> วัตถุประสงค์
                  </h4>
                  <div className="space-y-2 ml-1">
                    {detail.objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#f5a623] mt-1.5 shrink-0" />
                        <span className="text-sm text-gray-600">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-[#5e5873] mb-2 flex items-center gap-2">
                    <Shield size={14} className="text-[#7367f0]" /> เงื่อนไขการขอรับทุน
                  </h4>
                  <div className="space-y-2 ml-1">
                    {detail.conditions.map((cond, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#28c76f] mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-600">{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-gray-100 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#f5a623]" /> ข้อมูลติดต่อ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-gray-50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Users size={15} className="text-[#7367f0] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">ผู้รับผิดชอบ</p>
                      <p className="text-sm text-[#5e5873]">{detail.contactName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone size={15} className="text-[#7367f0] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">โทรศัพท์</p>
                      <p className="text-sm text-[#5e5873]">{detail.contactPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Mail size={15} className="text-[#7367f0] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">อีเมล</p>
                      <p className="text-sm text-[#5e5873] break-all">{detail.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin size={15} className="text-[#7367f0] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">ที่อยู่</p>
                      <p className="text-sm text-[#5e5873]">{detail.address}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">สถิติย่อ</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-[#7367f0]/5 text-center">
                      <p className="text-lg text-[#7367f0]">{detail.hospitals.length}</p>
                      <p className="text-xs text-gray-400">โรงพยาบาล</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#f5a623]/5 text-center">
                      <p className="text-lg text-[#f5a623]">{detail.categories.length}</p>
                      <p className="text-xs text-gray-400">หมวดค่าใช้จ่าย</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown + Status Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories */}
            <Card className="border-gray-100 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <Coins className="w-5 h-5 text-[#f5a623]" /> หมวดค่าใช้จ่าย
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {detail.categories.map((cat, i) => {
                  const catPct = totalCategoryAmount > 0 ? Math.round((cat.amount / totalCategoryAmount) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#7367f0]/20 transition-colors">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${cat.color}15` }}>
                        <cat.icon size={16} style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#5e5873]">{cat.name}</span>
                          <span className="text-sm" style={{ color: cat.color }}>฿{cat.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${catPct}%`, backgroundColor: cat.color }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{catPct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Status Breakdown Pie */}
            <Card className="border-gray-100 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#f5a623]" /> สถานะคำขอทุน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="h-[200px] relative" style={{ minHeight: 200, minWidth: 180 }}>
                    <ResponsiveContainer width="100%" height={200} minWidth={0} debounce={50}>
                      <PieChart>
                        <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                          {statusPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                          formatter={(value: number, name: string) => [`${value} รายการ`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl text-[#5e5873]">{detail.statusBreakdown.reduce((s, x) => s + x.count, 0)}</span>
                      <span className="text-xs text-gray-400">รายการ</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {statusPieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-[#5e5873]">{item.value} รายการ</span>
                          <p className="text-xs text-gray-400">฿{item.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5-Year Bar Chart */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#f5a623]" /> ยอดเบิกจ่าย 5 ปีย้อนหลัง (พ.ศ.)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ minHeight: 280, minWidth: 200 }}>
                <ResponsiveContainer width="100%" height={280} minWidth={0} debounce={50}>
                  <BarChart data={detail.yearlyData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6e6b7b' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6e6b7b' }} tickFormatter={(v: number) => `฿${(v / 1000).toFixed(0)}k`} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                      formatter={(value: number, name: string) => {
                        const label = name === 'disbursed' ? 'ยอดเบิกจ่าย' : 'จำนวนผู้ป่วย';
                        return [name === 'disbursed' ? `฿${value.toLocaleString()}` : `${value} ราย`, label];
                      }}
                    />
                    <Bar dataKey="disbursed" fill="#f5a623" radius={[6, 6, 0, 0]} name="disbursed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-3">
                {detail.yearlyData.map((d) => (
                  <div key={d.year} className="text-center">
                    <p className="text-xs text-gray-400">{d.year}</p>
                    <p className="text-xs text-[#5e5873]">{d.patients} ราย</p>
                    <p className="text-xs text-[#f5a623]">฿{d.disbursed.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== TAB: HOSPITALS ===== */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาโรงพยาบาล, จังหวัด..."
                value={hospitalSearch}
                onChange={(e) => setHospitalSearch(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm text-gray-600">การกระจายทุนตามโรงพยาบาล</h3>
            <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filteredHospitals.length} แห่ง</span>
          </div>

          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 space-y-3">
              {filteredHospitals.map((h) => {
                const isExpanded = expandedHospital === h.hospital;
                const hPct = source.disbursed > 0 ? Math.round((h.amount / source.disbursed) * 100) : 0;
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
                          <span className="text-sm text-[#f5a623] ml-2">฿{h.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#7367f0] rounded-full transition-all" style={{ width: `${hPct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{hPct}%</span>
                          <span className="text-xs text-gray-400">{h.patients} ราย</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={18} className="text-gray-400 shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                    </button>

                    {/* Expanded patient list */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50/30">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-[#EDE9FE]/30">
                                <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead>
                                <TableHead className="text-xs text-[#5e5873]">HN</TableHead>
                                <TableHead className="text-xs text-[#5e5873]">หมวด</TableHead>
                                <TableHead className="text-xs text-[#5e5873] text-right">จำนวนเงิน</TableHead>
                                <TableHead className="text-xs text-[#5e5873]">วันที่</TableHead>
                                <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {h.patientList.map((p, pi) => {
                                const sc = getStatusCfg(p.status);
                                return (
                                  <TableRow key={pi} className="hover:bg-white transition-colors">
                                    <TableCell className="text-sm text-[#5e5873]">{p.name}</TableCell>
                                    <TableCell className="text-xs text-gray-500">{p.hn}</TableCell>
                                    <TableCell className="text-xs text-gray-500">{p.category || '-'}</TableCell>
                                    <TableCell className="text-right text-sm text-[#f5a623]">฿{p.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-xs text-gray-500">{formatThaiDate(p.date)}</TableCell>
                                    <TableCell>
                                      <span className={cn("px-2 py-1 rounded-full text-xs", sc.bg, sc.color)}>
                                        {sc.label}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                        {/* Hospital Summary */}
                        <div className="px-4 py-3 bg-[#EDE9FE]/20 flex items-center justify-between">
                          <span className="text-xs text-gray-500">รวม {h.patients} ราย</span>
                          <span className="text-sm text-[#7367f0]">฿{h.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredHospitals.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Building2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">ไม่พบโรงพยาบาลที่ค้นหา</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===== TAB: TRANSACTIONS ===== */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm text-gray-600">ธุรกรรมล่าสุด</h3>
            <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{detail.recentTransactions.length} รายการ</span>
          </div>

          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 space-y-0">
              {detail.recentTransactions.map((tx, i) => {
                const txCfg = getTransactionColor(tx.action);
                const TxIcon = txCfg.icon;
                return (
                  <div key={i} className={cn(
                    "flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors",
                    i < detail.recentTransactions.length - 1 ? "border-b border-gray-100" : ""
                  )}>
                    <div className={cn("p-2.5 rounded-xl shrink-0", txCfg.bg)}>
                      <TxIcon size={18} className={txCfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#5e5873]">{tx.patient}</span>
                        <span className="text-sm text-[#f5a623] shrink-0 ml-2">฿{tx.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-400">{tx.hospital}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={cn("px-2 py-1 rounded-full text-xs", txCfg.bg, txCfg.color)}>{tx.action}</span>
                      <p className="text-xs text-gray-400 mt-1">{formatThaiDate(tx.date)}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* All patients table */}
          <Card className="border-gray-100 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#f5a623]" /> รายชื่อผู้ป่วยทั้งหมดที่ได้รับทุน ({totalPatients} ราย)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#EDE9FE]/30">
                      <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">HN</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">หมวด</TableHead>
                      <TableHead className="text-xs text-[#5e5873] text-right">จำนวนเงิน</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">วันที่</TableHead>
                      <TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detail.hospitals.flatMap(h => h.patientList).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((p, pi) => {
                      const sc = getStatusCfg(p.status);
                      return (
                        <TableRow key={pi} className="hover:bg-[#EDE9FE]/10 transition-colors">
                          <TableCell className="text-sm text-[#5e5873]">{p.name}</TableCell>
                          <TableCell className="text-xs text-gray-500">{p.hn}</TableCell>
                          <TableCell className="text-xs text-gray-500">{p.hospital}</TableCell>
                          <TableCell className="text-xs text-gray-500">{p.category || '-'}</TableCell>
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
      )}
    </div>
  );
}
