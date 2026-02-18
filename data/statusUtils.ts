// ============================================================
// SHARED STATUS UTILITIES — Single Source of Truth
// ============================================================
// ใช้ร่วมกันทั้ง CM Mobile & CM Web
// รวม: แปลสถานะเป็นภาษาไทย, normalize status, สี/สไตล์

import type {
  HomeVisitStatus,
  ReferralStatus,
  TelemedStatus,
  FundingStatus,
  TimelineStatus,
  MilestoneStatus,
} from './types';

// =====================
// 1. HOME VISIT
// =====================

const HOME_VISIT_STATUS_MAP: Record<HomeVisitStatus, string> = {
  Pending: 'รอตอบรับ',
  WaitVisit: 'รอเยี่ยม',
  InProgress: 'ดำเนินการ',
  Completed: 'เสร็จสิ้น',
  Rejected: 'ปฏิเสธ',
  NotHome: 'ไม่อยู่',
  NotAllowed: 'ไม่อนุญาต',
};

const HOME_VISIT_STYLE_MAP: Record<HomeVisitStatus, StatusStyle> = {
  Pending:    { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', ring: 'ring-orange-100' },
  WaitVisit:  { bg: 'bg-cyan-100',   text: 'text-cyan-600',   border: 'border-cyan-200',   ring: 'ring-cyan-100' },
  InProgress: { bg: 'bg-blue-100',   text: 'text-blue-600',   border: 'border-blue-200',   ring: 'ring-blue-100' },
  Completed:  { bg: 'bg-green-100',  text: 'text-green-600',  border: 'border-green-200',  ring: 'ring-green-100' },
  Rejected:   { bg: 'bg-red-100',    text: 'text-red-600',    border: 'border-red-200',    ring: 'ring-red-100' },
  NotHome:    { bg: 'bg-gray-100',   text: 'text-gray-400',   border: 'border-gray-200',   ring: 'ring-gray-100' },
  NotAllowed: { bg: 'bg-red-100',    text: 'text-red-600',    border: 'border-red-200',    ring: 'ring-red-100' },
};

/** Normalize raw home visit status string to standard HomeVisitStatus */
export function normalizeHomeVisitStatus(raw: string): HomeVisitStatus {
  const s = (raw || '').toLowerCase().trim();
  if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited', 'อยู่ในพื้นที่', 'ลงพื้นที่'].includes(s)) return 'Completed';
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ', 'ยกเลิก'].includes(s)) return 'Rejected';
  if (['nothome', 'not_home', 'not home', 'ไม่อยู่'].includes(s)) return 'NotHome';
  if (['notallowed', 'not_allowed', 'not allowed', 'ไม่อนุญาต'].includes(s)) return 'NotAllowed';
  if (['inprogress', 'in_progress', 'working', 'ดำเนินการ'].includes(s)) return 'InProgress';
  if (['accepted', 'accept', 'รับงาน', 'ยืนยันรับงาน'].includes(s)) return 'InProgress'; // Accepted maps to InProgress
  if (['waitvisit', 'wait_visit', 'waiting', 'รอเยี่ยม'].includes(s)) return 'WaitVisit';
  return 'Pending';
}

export function formatHomeVisitStatus(status: HomeVisitStatus): string {
  return HOME_VISIT_STATUS_MAP[status] || status;
}

export function getHomeVisitStatusStyle(status: HomeVisitStatus): StatusStyle {
  return HOME_VISIT_STYLE_MAP[status] || HOME_VISIT_STYLE_MAP.Pending;
}

// =====================
// 2. REFERRAL
// =====================

const REFERRAL_STATUS_MAP: Record<ReferralStatus, string> = {
  Pending: 'รอตอบรับ',
  Accepted: 'รอรับตัว',
  Rejected: 'ปฏิเสธ',
  Examined: 'ตรวจแล้ว',
  Completed: 'เสร็จสิ้น',
  Canceled: 'ยกเลิก',
};

const REFERRAL_STYLE_MAP: Record<ReferralStatus, StatusStyle> = {
  Pending:   { bg: 'bg-blue-100',   text: 'text-blue-600',   border: 'border-blue-200',   ring: 'ring-blue-100' },
  Accepted:  { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', ring: 'ring-orange-100' },
  Rejected:  { bg: 'bg-red-100',    text: 'text-red-600',    border: 'border-red-200',    ring: 'ring-red-100' },
  Examined:  { bg: 'bg-teal-100',   text: 'text-teal-600',   border: 'border-teal-200',   ring: 'ring-teal-100' },
  Completed: { bg: 'bg-green-100',  text: 'text-green-600',  border: 'border-green-200',  ring: 'ring-green-100' },
  Canceled:  { bg: 'bg-gray-100',   text: 'text-gray-500',   border: 'border-gray-200',   ring: 'ring-gray-100' },
};

export function normalizeReferralStatus(raw: string): ReferralStatus {
  const s = (raw || '').toLowerCase().trim();
  if (['ตอบรับแล้ว', 'accepted', 'confirmed'].includes(s)) return 'Accepted';
  if (['ถูกปฏิเสธ', 'rejected'].includes(s)) return 'Rejected';
  if (['ตรวจแล้ว', 'examined'].includes(s)) return 'Examined';
  if (['เสร็จสิ้น', 'completed', 'treated'].includes(s)) return 'Completed';
  if (['ยกเลิก', 'canceled', 'cancelled'].includes(s)) return 'Canceled';
  return 'Pending';
}

export function formatReferralStatus(status: ReferralStatus): string {
  return REFERRAL_STATUS_MAP[status] || status;
}

export function getReferralStatusStyle(status: ReferralStatus): StatusStyle {
  return REFERRAL_STYLE_MAP[status] || REFERRAL_STYLE_MAP.Pending;
}

// =====================
// 3. TELE-MED
// =====================

const TELEMED_STATUS_MAP: Record<TelemedStatus, string> = {
  Scheduled: 'รอสาย',
  Completed: 'เสร็จสิ้น',
  Cancelled: 'ยกเลิก',
};

const TELEMED_STYLE_MAP: Record<TelemedStatus, StatusStyle> = {
  Scheduled: { bg: 'bg-blue-100',  text: 'text-blue-600',  border: 'border-blue-200',  ring: 'ring-blue-100' },
  Completed: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', ring: 'ring-green-100' },
  Cancelled: { bg: 'bg-red-100',   text: 'text-red-600',   border: 'border-red-200',   ring: 'ring-red-100' },
};

export function normalizeTelemedStatus(raw: string): TelemedStatus {
  const s = (raw || '').toLowerCase().trim();
  if (['completed', 'เสร็จสิ้น', 'done'].includes(s)) return 'Completed';
  if (['cancelled', 'canceled', 'ยกเลิก'].includes(s)) return 'Cancelled';
  return 'Scheduled';
}

export function formatTelemedStatus(status: TelemedStatus): string {
  return TELEMED_STATUS_MAP[status] || status;
}

export function getTelemedStatusStyle(status: TelemedStatus): StatusStyle {
  return TELEMED_STYLE_MAP[status] || TELEMED_STYLE_MAP.Scheduled;
}

// =====================
// 4. FUNDING
// =====================

const FUNDING_STATUS_MAP: Record<FundingStatus, string> = {
  Pending: 'รอพิจารณา',
  Approved: 'อนุมัติแล้ว',
  Rejected: 'ไม่อนุมัติ',
};

const FUNDING_STYLE_MAP: Record<FundingStatus, StatusStyle> = {
  Pending:  { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200', ring: 'ring-orange-100' },
  Approved: { bg: 'bg-green-100',  text: 'text-green-600',  border: 'border-green-200',  ring: 'ring-green-100' },
  Rejected: { bg: 'bg-red-100',    text: 'text-red-600',    border: 'border-red-200',    ring: 'ring-red-100' },
};

export function formatFundingStatus(status: FundingStatus): string {
  return FUNDING_STATUS_MAP[status] || status;
}

export function getFundingStatusStyle(status: FundingStatus): StatusStyle {
  return FUNDING_STYLE_MAP[status] || FUNDING_STYLE_MAP.Pending;
}

// =====================
// 5. TREATMENT TIMELINE
// =====================

const TIMELINE_STATUS_MAP: Record<TimelineStatus, string> = {
  completed: 'เสร็จสิ้น',
  upcoming: 'รอดำเนินการ',
  overdue: 'ล่าช้า',
  pending: 'รอดำเนินการ',
  current: 'กำลังดำเนินการ',
};

const TIMELINE_STYLE_MAP: Record<TimelineStatus, StatusStyle> = {
  completed: { bg: 'bg-green-50',  text: 'text-green-600',  border: 'border-green-200',  ring: 'ring-green-100' },
  upcoming:  { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   ring: 'ring-blue-100' },
  overdue:   { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    ring: 'ring-red-100' },
  pending:   { bg: 'bg-gray-50',   text: 'text-gray-500',   border: 'border-gray-200',   ring: 'ring-gray-100' },
  current:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   ring: 'ring-blue-100' },
};

export function formatTimelineStatus(status: TimelineStatus): string {
  return TIMELINE_STATUS_MAP[status] || status;
}

export function getTimelineStatusStyle(status: TimelineStatus): StatusStyle {
  return TIMELINE_STYLE_MAP[status] || TIMELINE_STYLE_MAP.pending;
}

// =====================
// 6. MILESTONE (Web format - PascalCase)
// =====================

const MILESTONE_STATUS_MAP: Record<MilestoneStatus, string> = {
  Completed: 'เสร็จสิ้น',
  Upcoming: 'กำลังจะถึง',
  Overdue: 'ล่าช้า',
  Pending: 'รอดำเนินการ',
};

export function formatMilestoneStatus(status: MilestoneStatus): string {
  return MILESTONE_STATUS_MAP[status] || status;
}

/** Convert lowercase timeline status to PascalCase milestone status */
export function timelineToMilestoneStatus(status: TimelineStatus): MilestoneStatus {
  switch (status) {
    case 'completed': return 'Completed';
    case 'overdue': return 'Overdue';
    case 'upcoming':
    case 'current': return 'Upcoming';
    default: return 'Pending';
  }
}

// =====================
// 7. APPOINTMENT
// =====================

const APPOINTMENT_STATUS_MAP: Record<string, string> = {
  waiting: 'รอพบแพทย์',
  confirmed: 'ยืนยันแล้ว',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก/ขาดนัด',
  'นัดหมาย': 'นัดหมาย',
  'เสร็จสิ้น': 'เสร็จสิ้น',
  'ขาดนัด': 'ขาดนัด',
};

const APPOINTMENT_STYLE_MAP: Record<string, StatusStyle> = {
  waiting:   { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', ring: 'ring-yellow-100' },
  confirmed: { bg: 'bg-blue-100',   text: 'text-blue-600',   border: 'border-blue-200',   ring: 'ring-blue-100' },
  completed: { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  ring: 'ring-green-100' },
  cancelled: { bg: 'bg-red-100',    text: 'text-red-600',    border: 'border-red-200',    ring: 'ring-red-100' },
};

export function formatAppointmentStatus(status: string): string {
  return APPOINTMENT_STATUS_MAP[status] || status;
}

export function getAppointmentStatusStyle(status: string): StatusStyle {
  return APPOINTMENT_STYLE_MAP[status] || APPOINTMENT_STYLE_MAP.waiting;
}

// =====================
// SHARED STYLE TYPE
// =====================

export interface StatusStyle {
  bg: string;       // Tailwind background class
  text: string;     // Tailwind text color class
  border: string;   // Tailwind border class
  ring: string;     // Tailwind ring class (for timeline dots)
}

// =====================
// GENERIC HELPER
// =====================

/**
 * Universal status formatter - tries all systems to find a Thai label.
 * Use this when the system context is unknown.
 */
export function formatStatusThai(status: string): string {
  if (!status) return '-';
  
  // Check all maps
  const allMaps: Record<string, string> = {
    ...HOME_VISIT_STATUS_MAP,
    ...REFERRAL_STATUS_MAP,
    ...TELEMED_STATUS_MAP,
    ...FUNDING_STATUS_MAP,
    ...MILESTONE_STATUS_MAP,
    ...APPOINTMENT_STATUS_MAP,
  };

  // Also check lowercase timeline
  const timelineLower: Record<string, string> = {
    completed: 'เสร็จสิ้น',
    upcoming: 'รอดำเนินการ',
    overdue: 'ล่าช้า',
    pending: 'รอดำเนินการ',
    current: 'กำลังดำเนินการ',
  };

  return allMaps[status] || timelineLower[status.toLowerCase()] || status;
}