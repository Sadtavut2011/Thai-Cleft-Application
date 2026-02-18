// ============================================================
// SHARED TYPES — Single Source of Truth for CM Mobile & CM Web
// ============================================================
// ทุก module ทั้ง mobile และ web ควร import types จากไฟล์นี้
// เพื่อให้ interface ตรงกันเสมอ

// --- Home Visit Statuses ---
export type HomeVisitStatus =
  | 'Pending'      // รอตอบรับ
  | 'WaitVisit'    // รอเยี่ยม
  | 'InProgress'   // ดำเนินการ
  | 'Completed'    // เสร็จสิ้น
  | 'Rejected'     // ปฏิเสธ
  | 'NotHome'      // ไม่อยู่
  | 'NotAllowed';  // ไม่อนุญาต

export type HomeVisitType = 'Joint' | 'Delegated' | 'Routine';

export interface HomeVisitRequest {
  id: string;
  patientName: string;
  patientId: string;  // HN
  patientImage?: string;
  patientDob?: string;
  patientGender?: string;
  patientAddress: string;
  patientPhone?: string;
  diagnosis?: string;
  type: HomeVisitType;
  rph: string;          // รพ.สต.
  requestDate: string;
  date?: string;
  time?: string;
  status: HomeVisitStatus;
  note?: string;
  detail?: string;
  images?: string[];
  data?: any;
}

// --- Referral Statuses ---
export type ReferralStatus =
  | 'Pending'     // รอตอบรับ
  | 'Accepted'    // รอรับตัว / ตอบรับแล้ว
  | 'Rejected'    // ปฏิเสธ
  | 'Examined'    // ตรวจแล้ว
  | 'Completed'   // เสร็จสิ้น
  | 'Canceled';   // ยกเลิก

export type ReferralType = 'Refer Out' | 'Refer In';

export type ReferralUrgency = 'Routine' | 'Urgent' | 'Emergency';

export interface ReferralRequest {
  id: string;
  patientName: string;
  patientHn: string;
  patientImage?: string;
  patientDob?: string;
  patientGender?: string;
  diagnosis?: string;
  referralNo?: string;
  date: string;
  referralDate?: string;
  lastUpdateDate?: string;
  acceptedDate?: string;
  time?: string;
  type: ReferralType;
  status: ReferralStatus;
  sourceHospital?: string;
  destinationHospital?: string;
  destinationContact?: string;
  reason?: string;
  urgency?: ReferralUrgency;
  documents?: string[];
  logs?: ReferralLog[];
}

export interface ReferralLog {
  date: string;
  status: string;
  description: string;
  actor: string;
}

// --- Tele-med Statuses ---
export type TelemedStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type TelemedChannel = 'Direct' | 'Intermediary';

export interface TeleAppointment {
  id: string;
  patientImage?: string | null;
  patientName: string;
  hn: string;
  treatmentDetails?: string;
  date: string;
  time: string;
  requestDate?: string;
  meetingLink: string;
  channel: TelemedChannel;
  intermediaryName?: string;
  status: TelemedStatus;
  caseManager?: string;
  hospital?: string;
  pcu?: string;
  zoomUser?: string;
  agency_name?: string;
}

// --- Appointment Statuses ---
export type AppointmentStatus =
  | 'waiting'     // รอพบแพทย์
  | 'confirmed'   // ยืนยันแล้ว
  | 'completed'   // เสร็จสิ้น
  | 'cancelled';  // ยกเลิก/ขาดนัด

export interface Appointment {
  id: string | number;
  patientImage?: string | null;
  patientName: string;
  hn: string;
  date: string;
  time: string;
  requestDate?: string;
  location?: string;
  hospital?: string;
  room?: string;
  doctor?: string;
  doctorName?: string;
  clinic?: string;
  status: string; // flexible for raw data
  type?: string;
  detail?: string;
  reason?: string;
  title?: string;
  note?: string;
  createdBy?: string;
}

// --- Funding Statuses ---
export type FundingStatus = 'Pending' | 'Approved' | 'Rejected';

export interface FundRequest {
  id: string;
  patientName: string;
  patientId: string;  // HN
  patientImage?: string;
  patientDob?: string;
  patientGender?: string;
  diagnosis?: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: FundingStatus;
  hospital: string;
  type: string;       // Fund name
}

// --- Treatment Timeline Statuses ---
export type TimelineStatus = 'completed' | 'upcoming' | 'overdue' | 'pending' | 'current';

export interface TimelineItem {
  age: string;
  stage: string;
  status: TimelineStatus;
  date: string;
  estimatedDate?: string;
  secondaryBookings?: SecondaryBooking[];
}

export interface SecondaryBooking {
  date: string;
  title: string;
}

// --- Treatment Milestone (Web format) ---
export type MilestoneStatus = 'Pending' | 'Upcoming' | 'Overdue' | 'Completed';
export type MilestoneCategory = 'Surgery' | 'Dental' | 'Speech' | 'ENT' | 'General';

export interface Milestone {
  id: string;
  title: string;
  category: MilestoneCategory;
  targetAge: string;
  targetDate: string;
  estimatedDate?: string;
  actualDate?: string;
  status: MilestoneStatus;
  notes?: string;
  location?: string;
  room?: string;
  doctor?: string;
  secondaryBookings?: SecondaryBooking[];
}