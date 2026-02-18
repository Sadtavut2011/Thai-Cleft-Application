// ===== Shared types & helpers for Fund drill-downs =====

export interface FlatFundRequest {
  id: string; patientName: string; hn: string; diagnosis: string;
  fundType: string; amount: number; requestDate: string;
  urgency: string; hospital: string; status: string;
  rejectReason?: string; documents: string[];
  history: { date: string; action: string; user: string }[];
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  Pending:   { label: 'รอพิจารณา', color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10', hex: '#f5a623' },
  Approved:  { label: 'อนุมัติแล้ว', color: 'text-[#4285f4]', bg: 'bg-blue-50', hex: '#4285f4' },
  Rejected:  { label: 'ปฏิเสธ', color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]', hex: '#ea5455' },
  Received:  { label: 'ได้รับเงินแล้ว', color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10', hex: '#7367f0' },
  Disbursed: { label: 'จ่ายเงินแล้ว', color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]', hex: '#28c76f' },
};

export const getStatusConfig = (s: string) => STATUS_CONFIG[s] || STATUS_CONFIG.Pending;

export type FundDrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'yearly' };
