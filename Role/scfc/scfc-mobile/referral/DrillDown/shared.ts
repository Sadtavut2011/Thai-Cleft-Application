// ===== Shared types & helpers for Referral mobile drill-downs =====
import { PATIENTS_DATA, REFERRAL_DATA } from '../../../../../data/patientData';

export interface FlatReferral {
  id: string;
  patientName: string;
  hn: string;
  image: string;
  sourceHospital: string;
  destinationHospital: string;
  status: string;
  urgency: string;
  date: string;
  reason: string;
  province: string;
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  Pending:   { label: 'รอการตอบรับ', color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10', hex: '#4285f4' },
  Accepted:  { label: 'รอรับตัว',    color: 'text-[#ff6d00]', bg: 'bg-[#ff6d00]/10', hex: '#ff6d00' },
  Completed: { label: 'ตรวจแล้ว',    color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10', hex: '#28c76f' },
  Rejected:  { label: 'ปฏิเสธ',      color: 'text-[#ea5455]', bg: 'bg-[#ea5455]/10', hex: '#ea5455' },
};

export const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  Emergency: { label: 'ฉุกเฉิน',  color: 'text-[#ea5455]', bg: 'bg-[#ea5455]/10', hex: '#ea5455' },
  Urgent:    { label: 'เร่งด่วน',  color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/10', hex: '#ff9f43' },
  Routine:   { label: 'ปกติ',      color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10', hex: '#28c76f' },
};

export const getStatusConfig = (s: string) => STATUS_CONFIG[s] || STATUS_CONFIG.Pending;
export const getUrgencyConfig = (u: string) => URGENCY_CONFIG[u] || URGENCY_CONFIG.Routine;

export type RefDrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'urgency'; filter: string; label: string }
  | { type: 'capacity'; hospitalName: string }
  | { type: 'overdue'; filter: string; label: string };

/** Build FlatReferral[] from REFERRAL_DATA + PATIENTS_DATA */
export function buildFlatReferrals(): FlatReferral[] {
  return (REFERRAL_DATA || []).map((r: any) => {
    const patient = PATIENTS_DATA.find(
      (p: any) => p.hn === (r.patientHn || r.hn) || p.name === (r.patientName || r.name)
    );
    return {
      id: r.id || `REF-${Math.random().toString(36).substr(2, 6)}`,
      patientName: r.patientName || r.name || 'ไม่ระบุ',
      hn: r.patientHn || r.hn || '-',
      image: patient?.image || '',
      sourceHospital: r.sourceHospital || r.hospital || '-',
      destinationHospital: r.destinationHospital || '-',
      status: r.status || 'Pending',
      urgency: r.urgency || 'Routine',
      date: r.referralDate || r.date || '-',
      reason: r.reason || r.diagnosis || '-',
      province: patient?.province || 'เชียงใหม่',
    };
  });
}