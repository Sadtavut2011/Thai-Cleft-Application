// ===== Shared types & helpers for Fund mobile drill-downs =====
import { PATIENTS_DATA } from '../../../../../data/patientData';

export interface FlatFundRequest {
  id: string; patientName: string; hn: string; image: string;
  diagnosis: string; fundType: string; amount: number;
  requestDate: string; urgency: string; hospital: string;
  status: string; province: string;
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  Pending:   { label: 'รอพิจารณา',     color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10', hex: '#f5a623' },
  Approved:  { label: 'อนุมัติแล้ว',    color: 'text-[#4285f4]', bg: 'bg-blue-50',      hex: '#4285f4' },
  Rejected:  { label: 'ปฏิเสธ',        color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]',    hex: '#ea5455' },
  Received:  { label: 'ได้รับเงินแล้ว', color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10', hex: '#7367f0' },
  Disbursed: { label: 'จ่ายเงินแล้ว',   color: 'text-[#28c76f]', bg: 'bg-[#E5F8ED]',    hex: '#28c76f' },
};

export const getStatusConfig = (s: string) => STATUS_CONFIG[s] || STATUS_CONFIG.Pending;

export interface FundSourceInfo {
  id: string; name: string; totalBudget: number; disbursed: number; status: string;
}

export type FundDrilldownView =
  | null
  | { type: 'status'; filter: string; label: string }
  | { type: 'fundSource'; source: FundSourceInfo }
  | { type: 'hospitalSummary' }
  | { type: 'yearly' }
  | { type: 'fundsReceived'; funds: FundReceivedItem[]; filterLabel: string };

export interface FundReceivedItem {
  name: string;
  count: number;
  amount: number;
  color: string;
}

/** Build FlatFundRequest[] from PATIENTS_DATA */
export function buildFlatFundRequests(): FlatFundRequest[] {
  const results: FlatFundRequest[] = [];
  PATIENTS_DATA.forEach((p: any) => {
    const fundings = p.funding || [];
    fundings.forEach((f: any, idx: number) => {
      results.push({
        id: `FR-${p.hn}-${idx}`,
        patientName: p.name,
        hn: p.hn,
        image: p.image || '',
        diagnosis: p.diagnosis || 'Cleft Lip/Palate',
        fundType: f.type || 'ไม่ระบุ',
        amount: parseInt(f.amount) || 0,
        requestDate: f.date || '2026-01-15',
        urgency: f.urgency || 'Normal',
        hospital: p.hospital || '-',
        status: (['Pending', 'Approved', 'Rejected', 'Received', 'Disbursed'].includes(f.status) ? f.status : 'Pending'),
        province: p.province || 'เชียงใหม่',
      });
    });
  });
  // Fallback
  if (results.length === 0) {
    return [
      { id: 'FR-2026-001', patientName: 'ด.ช. อนันต์ สุขใจ', hn: 'HN12345', image: '', diagnosis: 'Cleft Lip & Palate', fundType: 'สภากาชาดไทย', amount: 15000, requestDate: '2026-01-18', urgency: 'Emergency', hospital: 'รพ.มหาราชนครเชียงใหม่', status: 'Pending', province: 'เชียงใหม่' },
      { id: 'FR-2026-002', patientName: 'น.ส. มะลิ แซ่ลี้', hn: 'HN67890', image: '', diagnosis: 'Secondary Deformity', fundType: 'Northern Care Fund', amount: 25000, requestDate: '2026-01-20', urgency: 'Urgent', hospital: 'รพ.เชียงรายประชานุเคราะห์', status: 'Pending', province: 'เชียงราย' },
      { id: 'FR-2026-003', patientName: 'นาย สมชาย จริงใจ', hn: 'HN54321', image: '', diagnosis: 'Speech Delay', fundType: 'Northern Care Fund', amount: 5000, requestDate: '2026-01-15', urgency: 'Normal', hospital: 'รพ.ฝาง', status: 'Approved', province: 'เชียงใหม่' },
      { id: 'FR-2026-004', patientName: 'นาง สมพร แสงแก้ว', hn: 'HN99887', image: '', diagnosis: 'Post-op Follow-up', fundType: 'สภากาชาดไทย', amount: 3000, requestDate: '2026-01-10', urgency: 'Normal', hospital: 'รพ.ลำพูน', status: 'Disbursed', province: 'ลำพูน' },
      { id: 'FR-2026-005', patientName: 'ด.ญ. กนกพร มีสุข', hn: 'HN44556', image: '', diagnosis: 'Cleft Palate Repair', fundType: 'Northern Care Fund', amount: 45000, requestDate: '2026-01-05', urgency: 'Urgent', hospital: 'รพ.แม่ฮ่องสอน', status: 'Rejected', province: 'แม่ฮ่องสอน' },
    ];
  }
  return results;
}