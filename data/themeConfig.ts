// ===== SCFC Shared Theme Configuration =====
// UI ทุกระบบ → โทนสีม่วง (#7367f0)
// ไอคอน → สีประจำระบบ

import { PATIENTS_DATA } from './patientData';

export const PURPLE = {
  primary: '#7367f0',
  dark: '#5B4FCC',
  medium: '#9b93f5',
  light: '#EDE9FE',
  border: '#C4BFFA',
  bg: 'bg-[#7367f0]',
  bgLight: 'bg-[#EDE9FE]',
  text: 'text-[#7367f0]',
  textDark: 'text-[#5e5873]',
  hover: 'hover:bg-[#5B4FCC]',
};

// สีประจำระบบ — ใช้เฉพาะ icon เท่านั้น
export const SYSTEM_ICON_COLORS = {
  homeVisit:   { color: '#28c76f', text: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
  appointment: { color: '#4285f4', text: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10' },
  referral:    { color: '#ff6d00', text: 'text-[#ff6d00]', bg: 'bg-[#ff6d00]/10' },
  telemed:     { color: '#e91e63', text: 'text-[#e91e63]', bg: 'bg-[#e91e63]/10' },
  treatment:   { color: '#7367f0', text: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
  fund:        { color: '#f5a623', text: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' },
  caseManager: { color: '#7367f0', text: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
};

// Provinces and Hospitals for SCFC filters
export const PROVINCES = ['ทั้งหมด', 'เชียงใหม่', 'เชียงราย', 'ลำปาง', 'แม่ฮ่องสอน', 'พะเยา', 'แพร่', 'น่าน', 'ลำพูน'];

export const HOSPITALS = [
  'ทั้งหมด',
  'โรงพยาบาลฝาง',
  'รพ.มหาราชนครเชียงใหม่',
  'รพ.นครพิงค์',
  'รพ.เชียงรายประชานุเคราะห์',
  'รพ.ลำพูน',
  'รพ.ลำปาง',
  'รพ.แม่ฮ่องสอน',
  'รพ.ปาย',
  'รพ.ฝาง',
  'รพ.สันทราย',
];

export const AREAS = [
  'ทั้งหมด',
  'เขตเมือง',
  'เขตชนบท',
  'พื้นที่สูง',
  'ชายแดน',
];

// ===== Hospital Capacity Mock Data (shared between mobile & web) =====
export const MOCK_CAPACITY: Record<string, number> = {
  'โรงพยาบาลฝาง': 15,
  'โรงพยาบาลมหาราชนครเชียงใหม่': 25,
  'โรงพยาบาลนครพิงค์': 20,
  'โรงพยาบาลเชียงรายประชานุเคราะห์': 22,
  'โรงพยาบาลจอมทอง': 12,
  'โรงพยาบาลแม่จัน': 10,
  'รพ.มหาราชนครเชียงใหม่': 25,
  'รพ.นครพิงค์': 20,
  'รพ.ฝาง': 15,
  'รพ.สันทราย': 12,
  'รพ.เชียงใหม่ราม': 18,
  'รพ.ปาย': 10,
};

// ===== Hospital → Province mapping (shared between mobile & web) =====
export const HOSPITAL_PROVINCE_MAP: Record<string, string> = {
  'โรงพยาบาลมหาราชนครเชียงใหม่': 'เชียงใหม่',
  'โรงพยาบาลนครพิงค์': 'เชียงใหม่',
  'โรงพยาบาลฝาง': 'เชียงใหม่',
  'โรงพยาบาลจอมทอง': 'เชียงใหม่',
  'โรงพยาบาลเชียงรายประชานุเคราะห์': 'เชียงราย',
  'โรงพยาบาลแม่จัน': 'เชียงราย',
  'โรงพยาบาลลำพูน': 'ลำพูน',
  'โรงพยาบาลลำปาง': 'ลำปาง',
  'โรงพยาบาลแม่ฮ่องสอน': 'แม่ฮ่องสอน',
  'รพ.มหาราชนครเชียงใหม่': 'เชียงใหม่',
  'รพ.นครพิงค์': 'เชียงใหม่',
  'รพ.ฝาง': 'เชียงใหม่',
  'รพ.จอมทอง': 'เชียงใหม่',
  'รพ.เชียงรายประชานุเคราะห์': 'เชียงราย',
  'รพ.แม่จัน': 'เชียงราย',
  'รพ.สต. บ้านหนองหอย': 'เชียงใหม่',
};

// ===== Shared filter helpers =====
/** Match hospital name (full or short) with filter value */
export const matchHospitalFilter = (dataHospital: string, filterHospital: string): boolean => {
  if (filterHospital === 'ทั้งหมด' || filterHospital === 'ทุกหน่วยงาน') return true;
  const normalized = (dataHospital || '').replace('โรงพยาบาล', 'รพ.').trim();
  return normalized === filterHospital || dataHospital === filterHospital || dataHospital.includes(filterHospital.replace('รพ.', ''));
};

/** Get province from hospital name */
export const getProvinceFromHospital = (hosp: string): string => {
  return HOSPITAL_PROVINCE_MAP[hosp] || HOSPITAL_PROVINCE_MAP[(hosp || '').replace('โรงพยาบาล', 'รพ.').trim()] || '';
};

// ===== Fund Source Types & Data (shared between mobile & web) =====
export interface FundSourceInfo {
  id: string;
  name: string;
  totalBudget: number;
  disbursed: number;
  status: string;
}

export const FUND_SOURCES: FundSourceInfo[] = [
  { id: 'S1', name: 'สภากาชาดไทย', totalBudget: 500000, disbursed: 120000, status: 'Active' },
  { id: 'S2', name: 'มูลนิธิเพื่อผู้ป่วยยากไร้', totalBudget: 200000, disbursed: 85000, status: 'Active' },
  { id: 'S3', name: 'กองทุนรัฐบาล (Northern Care)', totalBudget: 1000000, disbursed: 450000, status: 'Active' },
];

// ===== 5-Year Disbursement Data (shared between mobile & web) =====
export const FIVE_YEAR_DATA = [
  { year: '2565', redCross: 65000, foundation: 35000, northern: 280000 },
  { year: '2566', redCross: 78000, foundation: 48000, northern: 320000 },
  { year: '2567', redCross: 92000, foundation: 62000, northern: 380000 },
  { year: '2568', redCross: 105000, foundation: 75000, northern: 420000 },
  { year: '2569', redCross: 120000, foundation: 85000, northern: 450000 },
];

// ===== Hospital Fund Summary (shared between mobile & web) =====
export const HOSPITAL_SUMMARY = [
  { hospital: 'รพ.มหาราชนครเชียงใหม่', amount: 225000, patients: 11 },
  { hospital: 'รพ.เชียงรายฯ', amount: 145000, patients: 6 },
  { hospital: 'รพ.แม่ฮ่องสอน', amount: 105000, patients: 7 },
  { hospital: 'รพ.ลำปาง', amount: 80000, patients: 3 },
];

// ===== PCU → Parent Hospital mapping (shared between mobile & web) =====
export const PCU_PARENT_MAP: Record<string, string> = {
  'รพ.สต.ริมใต้': 'รพ.ฝาง',
  'รพ.สต.แม่งอน': 'รพ.ฝาง',
  'รพ.สต.ช้างเผือก': 'รพ.นครพิงค์',
  'รพ.สต.แม่สา': 'รพ.นครพิงค์',
  'รพ.สต.เวียงเหนือ': 'รพ.เชียงราย',
};

// ===== Service Unit Types & Builder (shared between mobile & web) =====
export interface ServiceUnit {
  name: string;
  parentHospital: string;
  caseCount: number;
  patientCount: number;
}

/** Build service-unit data from PATIENTS_DATA */
export function buildServiceUnits(): ServiceUnit[] {
  const unitMap = new Map<string, { hnSet: Set<string>; caseCount: number }>();
  PATIENTS_DATA.forEach((p: any) => {
    const pcu: string = p.responsibleHealthCenter;
    if (!pcu || pcu === '-') return;
    if (!unitMap.has(pcu)) unitMap.set(pcu, { hnSet: new Set(), caseCount: 0 });
    const entry = unitMap.get(pcu)!;
    entry.hnSet.add(p.hn);
    entry.caseCount += Math.max(Array.isArray(p.timeline) ? p.timeline.length : 0, 1);
  });
  return Array.from(unitMap.entries())
    .map(([name, { hnSet, caseCount }]) => ({
      name,
      parentHospital: PCU_PARENT_MAP[name] || 'รพ.ฝาง',
      caseCount,
      patientCount: hnSet.size,
    }))
    .sort((a, b) => b.caseCount - a.caseCount);
}