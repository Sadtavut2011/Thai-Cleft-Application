// ===== Shared types & helpers for HomeVisit drill-downs (Mobile) =====

export interface FlatVisit {
  id: string; patientName: string; patientId: string; patientAddress: string;
  type: string; rph: string; status: string; requestDate: string;
  hospital: string; province: string; note?: string;
  name?: string; hn?: string; date?: string;
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  Completed:  { label: 'เสร็จสิ้น',  color: 'text-[#28C76F]', bg: 'bg-[#E5F8ED]', hex: '#28c76f' },
  Pending:    { label: 'รอการตอบรับ', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]', hex: '#ff9f43' },
  WaitVisit:  { label: 'รอเยี่ยม',   color: 'text-yellow-700', bg: 'bg-yellow-100', hex: '#f5a623' },
  InProgress: { label: 'ดำเนินการ',  color: 'text-[#00CFE8]', bg: 'bg-[#E0FBFC]', hex: '#00cfe8' },
  Rejected:   { label: 'ปฏิเสธ',    color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', hex: '#ea5455' },
  NotHome:    { label: 'ไม่อยู่',    color: 'text-[#B9B9C3]', bg: 'bg-[#F8F8F8]', hex: '#b9b9c3' },
  NotAllowed: { label: 'ไม่อนุญาต', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', hex: '#ea5455' },
};

export const getStatusConfig = (status: string) => {
  const s = (status || '').toLowerCase();
  if (['completed', 'done', 'success', 'เสร็จสิ้น', 'visited'].includes(s)) return STATUS_CONFIG.Completed;
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ'].includes(s)) return STATUS_CONFIG.Rejected;
  if (['inprogress', 'in_progress', 'working', 'ดำเนินการ'].includes(s)) return STATUS_CONFIG.InProgress;
  if (['accepted', 'waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(s)) return STATUS_CONFIG.WaitVisit;
  if (['nothome', 'not_home', 'ไม่อยู่'].includes(s)) return STATUS_CONFIG.NotHome;
  if (['notallowed', 'not_allowed', 'ไม่อนุญาต'].includes(s)) return STATUS_CONFIG.NotAllowed;
  return STATUS_CONFIG.Pending;
};

export const formatThaiShortDate = (raw: string | undefined): string => {
  if (!raw || raw === '-') return '-';
  if (/[ก-๙]/.test(raw)) return raw;
  try {
    const safeRaw = raw.match(/^\d{4}-\d{2}-\d{2}$/) ? raw + 'T00:00:00' : raw;
    const d = new Date(safeRaw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch { return raw; }
};

export type HVDrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'hospital'; hospitalName: string }
  | { type: 'pie' }
  | { type: 'team' }
  | { type: 'visitType' };