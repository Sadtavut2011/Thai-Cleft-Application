// ===== Shared types & helpers for Appointment mobile drill-downs =====
import { PATIENTS_DATA } from '../../../../../data/patientData';

export interface FlatAppointment {
  id: string; patientName: string; hn: string; image: string;
  hospital: string; province: string; clinic: string;
  date: string; rawDate: string; time: string;
  type: string; status: string; doctor: string; room: string;
  note: string; requestDate: string;
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  confirmed: { label: 'ยืนยันแล้ว', color: 'text-blue-600', bg: 'bg-blue-50', hex: '#4285f4' },
  waiting:   { label: 'รอตรวจ', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', hex: '#ff9f43' },
  completed: { label: 'เสร็จสิ้น', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]', hex: '#28c76f' },
  cancelled: { label: 'ยกเลิก', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', hex: '#ea5455' },
};

export const getStatusConfig = (status: string) => {
  const s = (status || '').toLowerCase();
  if (['confirmed', 'checked-in', 'ยืนยันแล้ว', 'มาตามนัด'].includes(s)) return STATUS_CONFIG.confirmed;
  if (['completed', 'done', 'เสร็จสิ้น'].includes(s)) return STATUS_CONFIG.completed;
  if (['cancelled', 'missed', 'ยกเลิก', 'ขาดนัด'].includes(s)) return STATUS_CONFIG.cancelled;
  return STATUS_CONFIG.waiting;
};

export const TREATMENT_MAP: Record<string, string> = {
  'ผ่าตัด': 'ศัลยกรรม',
  'ติดตามอาการ': 'อายุรกรรม',
  'ฝึกพูด': 'แก้ไขการพูด',
  'ตรวจรักษา': 'ตรวจรักษาทั่วไป',
  'นัดหมายตรวจรักษา': 'ตรวจรักษาทั่วไป',
  'ตรวจประเมิน': 'จิตเวช/พัฒนาการ',
  'นัดผ่าตัด': 'ศัลยกรรม',
  'ศัลยกรรม': 'ศัลยกรรม',
  'อายุรกรรม': 'อายุรกรรม',
};

export type AptDrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'peakHours' }
  | { type: 'treatment'; name: string; color: string };

/** Build FlatAppointment[] from PATIENTS_DATA */
export function buildFlatAppointments(): FlatAppointment[] {
  return PATIENTS_DATA.flatMap((p: any) =>
    (p.appointmentHistory || []).map((a: any, idx: number) => ({
      id: `APT-${p.hn}-${idx}`,
      patientName: p.name,
      hn: p.hn,
      image: p.image || '',
      hospital: p.hospital || a.location || '-',
      province: p.province || 'เชียงใหม่',
      clinic: a.title || a.clinic || a.detail || '-',
      date: a.date || '2026-01-21',
      rawDate: a.rawDate || a.date || '2026-01-21',
      time: a.time || '09:00',
      type: a.title || a.type || 'มาตรวจที่ รพ.',
      status: a.status || 'waiting',
      doctor: a.doctor || '-',
      room: a.room || '-',
      note: a.note || '',
      requestDate: a.date || '',
    }))
  );
}