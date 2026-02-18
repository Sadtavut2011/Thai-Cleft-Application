// ===== Shared types & helpers for CaseManager drill-downs =====
import type { CaseManager } from '../../../../../../data/patientData';

export const getStatusLabel = (s: string) =>
  s === 'active' ? 'ปฏิบัติงาน' : s === 'leave' ? 'ลาพัก' : 'ไม่ใช้งาน';

export const getStatusStyle = (s: string) => {
  if (s === 'active') return { color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]', dot: 'bg-[#28c76f]', hex: '#28c76f' };
  if (s === 'leave') return { color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', dot: 'bg-[#ff9f43]', hex: '#ff9f43' };
  return { color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', dot: 'bg-[#EA5455]', hex: '#ea5455' };
};

export type CMDrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'province'; province: string }
  | { type: 'workload' }
  | { type: 'topPerformers' };