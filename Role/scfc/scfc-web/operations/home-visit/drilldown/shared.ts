// ===== Shared types & helpers for HomeVisit drill-downs =====

export interface FlatVisit {
  id: string; patientName: string; patientId: string; patientAddress: string;
  type: string; rph: string; status: string; requestDate: string;
  hospital: string; province: string; note?: string;
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  Completed:  { label: 'เสร็จสิ้น',  color: 'text-[#28C76F]', bg: 'bg-[#E5F8ED]', hex: '#28c76f' },
  Pending:    { label: 'รอการตอบรับ', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', hex: '#ff9f43' },
  WaitVisit:  { label: 'รอเยี่ยม',   color: 'text-yellow-700', bg: 'bg-yellow-100', hex: '#f5a623' },
  InProgress: { label: 'ดำเนินการ',  color: 'text-[#00CFE8]', bg: 'bg-[#E0FBFC]', hex: '#00cfe8' },
  Rejected:   { label: 'ปฏิเสธ',    color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', hex: '#ea5455' },
};

export const getStatusConfig = (status: string) => {
  const s = (status || '').toLowerCase();
  if (['completed', 'done', 'success', 'เสร็จสิ้น', 'visited'].includes(s)) return STATUS_CONFIG.Completed;
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ'].includes(s)) return STATUS_CONFIG.Rejected;
  if (['inprogress', 'in_progress', 'working', 'ดำเนินการ'].includes(s)) return STATUS_CONFIG.InProgress;
  if (['accepted', 'waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(s)) return STATUS_CONFIG.WaitVisit;
  return STATUS_CONFIG.Pending;
};

export type HVDrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'hospital'; hospitalName: string }
  | { type: 'pie' };
