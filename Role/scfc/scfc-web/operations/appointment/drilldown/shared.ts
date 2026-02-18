// ===== Shared types & helpers for Appointment drill-downs =====

export interface FlatAppointment {
  id: string; patientName: string; hn: string; image: string;
  hospital: string; province: string; clinic: string;
  date: string; rawDate: string; time: string;
  type: string; status: string; doctor: string; room: string;
  note: string; requestDate: string;
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  confirmed: { label: 'ยืนยันแล้ว', color: 'text-blue-600', bg: 'bg-blue-50', hex: '#4285f4' },
  waiting:   { label: 'รอการยืนยัน', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', hex: '#ff9f43' },
  completed: { label: 'เสร็จสิ้น', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]', hex: '#28c76f' },
  cancelled: { label: 'ขาดนัด/ยกเลิก', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', hex: '#ea5455' },
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

export type DrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'hospital'; hospital: string; fullName: string }
  | { type: 'peakHours' }
  | { type: 'treatment'; name: string; color: string };
