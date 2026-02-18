// ===== Shared types & helpers for TeleConsultation mobile drill-downs =====
import { PATIENTS_DATA } from '../../../../../data/patientData';

export interface FlatSession {
  id: string; patientName: string; hn: string;
  status: string; doctor: string; channel: string;
  datetime: string; title: string; hospital: string;
  sourceUnit: string; diagnosis: string;
  patientDob?: string;
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  waiting:    { label: 'รอสาย',     color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', hex: '#ff9f43' },
  inprogress: { label: 'ดำเนินการ', color: 'text-blue-600',  bg: 'bg-blue-50',   hex: '#4285f4' },
  completed:  { label: 'เสร็จสิ้น', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]', hex: '#28c76f' },
  cancelled:  { label: 'ยกเลิก',   color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', hex: '#ea5455' },
};

export const getStatusKey = (status: string): string => {
  const s = (status || '').toLowerCase();
  if (['waiting', 'pending', 'scheduled'].includes(s)) return 'waiting';
  if (['inprogress', 'in_progress', 'working', 'active', 'กำลังปรึกษา'].includes(s)) return 'inprogress';
  if (['cancelled', 'missed', 'rejected'].includes(s)) return 'cancelled';
  return 'completed';
};

export const getStatusConfig = (status: string) => {
  return STATUS_CONFIG[getStatusKey(status)] || STATUS_CONFIG.completed;
};

export type TeleDrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'channel'; filter: string; label: string }
  | { type: 'peakHours'; filter: string; label: string }
  | { type: 'provider'; filter: string; label: string };

/** Build FlatSession[] from PATIENTS_DATA */
export function buildFlatSessions(): FlatSession[] {
  return PATIENTS_DATA.flatMap((p: any) =>
    (p.teleConsultHistory || []).map((t: any, idx: number) => ({
      id: `TM-${p.hn}-${idx}`,
      patientName: p.name || 'ไม่ระบุ',
      hn: p.hn || '-',
      status: t.status || 'completed',
      doctor: t.doctor || '-',
      channel: t.channel || 'mobile',
      datetime: t.date || t.rawDate || '-',
      title: t.title || t.treatmentDetails || '-',
      hospital: p.hospital || '-',
      sourceUnit: t.agency_name || p.hospital || '-',
      diagnosis: p.diagnosis || '-',
      patientDob: p.dob || undefined,
    }))
  );
}

// ══ Provider (Online Staff) Mock Data ══
export interface TeleProvider {
  id: string;
  name: string;
  role: 'doctor' | 'nurse';
  specialty?: string;
  hospital: string;
  shortHospital: string;
  online: boolean;
  activePatients: number;
}

export interface TeleHospitalProvider {
  hospital: string;
  shortName: string;
  online: boolean;
  doctors: TeleProvider[];
  nurses: TeleProvider[];
  totalSessions: number;
}

/** Build provider mock data from PATIENTS_DATA hospital distribution */
export function buildProviderData(): TeleHospitalProvider[] {
  // Gather unique hospitals from patients who have tele data
  const hospMap = new Map<string, number>();
  PATIENTS_DATA.forEach((p: any) => {
    const teleCount = (p.teleConsultHistory || []).length;
    if (teleCount > 0 && p.hospital) {
      hospMap.set(p.hospital, (hospMap.get(p.hospital) || 0) + teleCount);
    }
  });

  // Static provider roster per hospital
  const PROVIDER_ROSTER: Record<string, { doctors: Omit<TeleProvider, 'hospital' | 'shortHospital'>[]; nurses: Omit<TeleProvider, 'hospital' | 'shortHospital'>[] }> = {
    'โรงพยาบาลฝาง': {
      doctors: [
        { id: 'DR-FG-01', name: 'นพ.วิชัย เกียรติเกรียงไกร', role: 'doctor', specialty: 'ศัลยกรรมตกแต่ง', online: true, activePatients: 2 },
        { id: 'DR-FG-02', name: 'นพ.ประเสริฐ ดีเยี่ยม', role: 'doctor', specialty: 'กุมารเวชศาสตร์', online: true, activePatients: 1 },
      ],
      nurses: [
        { id: 'NR-FG-01', name: 'พย.สุภาภรณ์ ใจงาม', role: 'nurse', specialty: 'พยาบาลเวชปฏิบัติ', online: true, activePatients: 3 },
        { id: 'NR-FG-02', name: 'พย.วิไล แก่นเกิด', role: 'nurse', specialty: 'พยาบาล Tele-med', online: false, activePatients: 0 },
      ],
    },
    'โรงพยาบาลมหาราชนครเชียงใหม่': {
      doctors: [
        { id: 'DR-MR-01', name: 'พญ.อรุณี รักดี', role: 'doctor', specialty: 'ศัลยกรรมตกแต่ง', online: true, activePatients: 1 },
      ],
      nurses: [
        { id: 'NR-MR-01', name: 'พย.พิมพ์ใจ ศรีสุข', role: 'nurse', specialty: 'พยาบาลประสานงาน', online: true, activePatients: 1 },
        { id: 'NR-MR-02', name: 'พย.ดวงกมล วงค์เมือง', role: 'nurse', specialty: 'พยาบาล Tele-med', online: true, activePatients: 1 },
      ],
    },
    'โรงพยาบาลนครพิงค์': {
      doctors: [
        { id: 'DR-NP-01', name: 'นพ.เกรียงไกร เก่งกาจ', role: 'doctor', specialty: 'ศัลยกรรมตกแต่ง', online: true, activePatients: 1 },
        { id: 'DR-NP-02', name: 'ทพญ.สมศรี มีฟัน', role: 'doctor', specialty: 'ทันตกรรม', online: false, activePatients: 0 },
      ],
      nurses: [
        { id: 'NR-NP-01', name: 'พย.อัมพร สุขสม', role: 'nurse', specialty: 'พยาบาล Tele-med', online: true, activePatients: 2 },
      ],
    },
  };

  return Array.from(hospMap.entries()).map(([hospital, totalSessions]) => {
    const shortName = hospital.replace('โรงพยาบาล', 'รพ.').trim();
    const roster = PROVIDER_ROSTER[hospital];
    const doctors = (roster?.doctors || []).map(d => ({ ...d, hospital, shortHospital: shortName }));
    const nurses = (roster?.nurses || []).map(n => ({ ...n, hospital, shortHospital: shortName }));
    const online = doctors.some(d => d.online) || nurses.some(n => n.online);
    return { hospital, shortName, online, doctors, nurses, totalSessions };
  }).sort((a, b) => b.totalSessions - a.totalSessions);
}