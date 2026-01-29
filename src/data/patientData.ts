export interface Patient {
    id: string;
    hn: string;
    cid: string;
    name: string;
    age: string;
    dob: string;
    diagnosis: string;
    status: 'Active' | 'Pending' | 'Completed' | 'Referred' | 'Missed' | 'Cancelled' | 'Waiting' | 'Checked-in' | 'in_progress' | 'waiting' | 'waiting-doctor' | 'waiting_staff';
    hospital: string;
    contact: {
        name: string;
        phone: string;
        address: string;
        relation?: string;
    };
    rights: string;
    nextAppointment: string | null;
    image: string;
    timeline: Array<{
        age: string;
        stage: string;
        status: 'completed' | 'current' | 'pending';
        date: string;
    }>;
    history: Array<{
        id: number;
        date: string;
        title: string;
        detail: string;
        doctor: string;
        department: string;
        time?: string;
        nextAppt?: string;
        status?: string;
        note?: string;
    }>;
    funding: Array<{
        type: string;
        status: 'approved' | 'pending' | 'rejected';
        amount: string;
    }>;
    // Additional fields for other modules
    type?: string;
    date?: string; // For calendar view consistency
    time?: string;
    urgency?: string;
    channel?: string;
    detail?: string;
    room?: string;
    // Referral specific
    referralNo?: string;
    destinationHospital?: string;
    referralDate?: string;
    reason?: string;
    documents?: string[];
    logs?: any[];
    // Home Visit specific
    rph?: string;
    requestDate?: string;
    note?: string;
    // Telemed specific
    caseManager?: string;
    pcu?: string;
    zoomUser?: string;
    treatmentDetails?: string;
    meetingLink?: string;
}

export const PATIENTS_DATA: Patient[] = [
    {
        id: 'P001',
        hn: '6600123',
        cid: '1-1000-12345-67-1',
        name: 'ด.ช. สมชาย ใจดี',
        age: '2 ปี 6 เดือน',
        dob: '12-01-2021',
        diagnosis: 'Cleft Lip and Palate (ปากแหว่งเพดานโหว่)',
        status: 'Checked-in',
        hospital: 'รพ.มหาราช',
        contact: { name: 'นางสมร ใจดี (มารดา)', phone: '081-234-5678', address: '123 หมู่ 1 ต.บ้านใหม่ อ.เมือง จ.เชียงใหม่' },
        rights: 'บัตรทอง (รพ.สต. ทุ่งสุข)',
        nextAppointment: '2025-12-04 09:00',
        image: 'https://images.unsplash.com/photo-1647151481252-0e39fe9176b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwYXNpYW4lMjBib3klMjBzbWlsaW5nfGVufDF8fHx8MTc2NDgyMjc5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [
            { age: 'แรกเกิด', stage: 'ให้คำปรึกษาเบื้องต้น/การป้อนนม', status: 'completed', date: '2021-04-10' },
            { age: '3 เดือน', stage: 'ผ่าตัดเย็บซ่อมริมฝีปาก', status: 'completed', date: '2021-07-15' },
            { age: '1 ปี', stage: 'ผ่าตัดเย็บซ่อมเพดาน', status: 'completed', date: '2022-04-20' },
            { age: '2-5 ปี', stage: 'ฝึกพูด/ตรวจการได้ยิน', status: 'current', date: 'กำลังดำเนินการ' },
            { age: '7-9 ปี', stage: 'ปลูกกระดูกเบ้าฟัน', status: 'pending', date: 'รอถึงเกณฑ์' },
        ],
        history: [
            { id: 1, date: '2023-08-10', title: 'ตรวจติดตามแผลผ่าตัด', detail: 'แผลแห้งดี ไม่มีหนอง', doctor: 'นพ. วิชัย', department: 'ศัลยกรรมตกแต่ง' },
            { id: 2, date: '2023-09-15', title: 'ประเมินการพูด', detail: 'เริ่มออกเสียงคำง่ายๆ ได้', doctor: 'ทพญ. สุดา', department: 'ทันตกรรม' }
        ],
        funding: [
            { type: 'ค่าเดินทาง', status: 'approved', amount: '5,000' },
            { type: 'นมผง', status: 'pending', amount: 'รอพิจารณา' }
        ],
        date: '2025-12-04', time: '09:00', type: 'Follow-up', room: '1'
    },
    {
        id: 'P002',
        hn: '6600456',
        cid: '1-2000-54321-12-3',
        name: 'ด.ญ. มานี รักเรียน',
        age: '6 เดือน',
        dob: '20-04-2023',
        diagnosis: 'Cleft Palate Only (เพดานโหว่)',
        status: 'waiting-doctor',
        hospital: 'รพ.สต. ทุ่งสุข',
        contact: { name: 'นายมานะ รักเรียน (บิดา)', phone: '089-999-8888', address: '456 หมู่ 2 ต.ทุ่งสุข อ.แม่ริม จ.เชียงใหม่' },
        rights: 'เบิกจ่ายตรง',
        nextAppointment: '2025-12-04 09:30',
        image: 'https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwYXNpYW4lMjB0ZWVuYWdlJTIwZ2lybCUyMHNtaWxpbmd8ZW58MXx8fHwxNzY0ODIyNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [
            { age: 'แรกเกิด', stage: 'ให้คำปรึกษาเบื้องต้น', status: 'completed', date: '2023-04-25' },
            { age: '9-12 เดือน', stage: 'ผ่าตัดเย็บซ่อมเพดาน', status: 'pending', date: 'รอถึงเกณฑ์' },
        ],
        history: [
            { id: 1, date: '2023-05-10', title: 'แนะนำการจัดท่าให้นม', detail: 'มารดาเข้าใจและปฏิบัติได้ถูกต้อง', doctor: 'พยาบาลสมศรี', department: 'กุมารเวชกรรม' }
        ],
        funding: [],
        date: '2025-12-04', time: '09:30', type: 'New Case', room: '2'
    },
    { 
        id: 'P004', 
        hn: '66012345', 
        cid: '1-4000-12345-12-4',
        name: 'ด.ช. รักดี มีสุข', 
        age: '5 ปี', 
        dob: '01-01-2020',
        diagnosis: 'Cleft Lip',
        status: 'Pending', 
        hospital: 'รพ.มหาราช',
        contact: { name: 'ผู้ปกครอง', phone: '081-000-0000', address: 'เชียงใหม่' },
        rights: 'บัตรทอง',
        nextAppointment: '2025-12-04 10:00',
        image: 'https://images.unsplash.com/photo-1647151481252-0e39fe9176b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwYXNpYW4lMjBib3klMjBzbWlsaW5nfGVufDF8fHx8MTc2NDgyMjc5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [],
        history: [],
        funding: [],
        date: '2025-12-04', time: '10:00', type: 'Follow-up', room: '1'
    },
    { 
        id: 'P005', 
        hn: '66088990', 
        cid: '1-5000-88990-12-5',
        name: 'น.ส. ใจใส มั่นคง', 
        age: '16 ปี',
        dob: '01-01-2009',
        diagnosis: 'Cleft Palate',
        status: 'Checked-in', 
        hospital: 'รพ.มหาราช',
        contact: { name: 'ผู้ปกครอง', phone: '081-000-0000', address: 'เชียงใหม่' },
        rights: 'บัตรทอง',
        nextAppointment: '2025-12-04 10:30', 
        image: 'https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwYXNpYW4lMjB0ZWVuYWdlJTIwZ2lybCUyMHNtaWxpbmd8ZW58MXx8fHwxNzY0ODIyNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [],
        history: [],
        funding: [],
        date: '2025-12-04', time: '10:30', type: 'New Case', room: '2'
    },
    { 
        id: 'P006', 
        hn: '65112233', 
        cid: '1-6000-11223-12-6',
        name: 'ด.ญ. พอใจ ยิ้มสวย', 
        age: '2 ปี',
        dob: '01-01-2023',
        diagnosis: 'Cleft Lip and Palate',
        status: 'Waiting', 
        hospital: 'รพ.มหาราช',
        contact: { name: 'ผู้ปกครอง', phone: '081-000-0000', address: 'เชียงใหม่' },
        rights: 'บัตรทอง',
        nextAppointment: '2025-12-04 11:00',
        image: 'https://images.unsplash.com/photo-1647151481252-0e39fe9176b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwYXNpYW4lMjBib3klMjBzbWlsaW5nfGVufDF8fHx8MTc2NDgyMjc5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [],
        history: [],
        funding: [],
        date: '2025-12-04', time: '11:00', type: 'Follow-up', room: '1'
    },
    { 
        id: 'P007', 
        hn: '65778811', 
        cid: '1-7000-77881-12-7',
        name: 'นาย สมชาย แข็งแรง', 
        age: '25 ปี',
        dob: '01-01-2000',
        diagnosis: 'Surgery Plan',
        status: 'Completed', 
        hospital: 'รพ.มหาราช',
        contact: { name: 'ผู้ปกครอง', phone: '081-000-0000', address: 'เชียงใหม่' },
        rights: 'ประกันสังคม',
        nextAppointment: '2025-12-04 13:00',
        image: 'https://images.unsplash.com/photo-1464892216009-6d356060e72c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwYXNpYW4lMjBwYXRpZW50JTIwc21pbGluZyUyMGZhY2V8ZW58MXx8fHwxNzY0ODIyNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [],
        history: [],
        funding: [],
        date: '2025-12-04', time: '13:00', type: 'Surgery Plan', room: '3'
    },
    { 
        id: 'P008', 
        hn: '66012346', 
        cid: '1-8000-12346-12-8',
        name: 'นางสาว มุ่งมั่น ทำดี', 
        age: '20 ปี', 
        dob: '01-01-2005',
        diagnosis: 'Cleft Palate',
        status: 'Pending',
        hospital: 'รพ.มหาราช',
        contact: { name: 'ผู้ปกครอง', phone: '081-000-0000', address: 'เชียงใหม่' },
        rights: 'บัตรทอง',
        nextAppointment: '2025-12-04 13:30',
        image: 'https://images.unsplash.com/photo-1631284443067-d875ada6ff9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwZ2lybCUyMHNtaWxpbmd8ZW58MXx8fHwxNzY0ODIyNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [],
        history: [],
        funding: [],
        date: '2025-12-04', time: '13:30', type: 'Follow-up', room: '1'
    },
    { 
        id: 'P009', 
        hn: '66012347', 
        cid: '1-9000-12347-12-9',
        name: 'ด.ช. อดทน เก่งมาก', 
        age: '7 ปี', 
        dob: '01-01-2018',
        diagnosis: 'New Case',
        status: 'Pending',
        hospital: 'รพ.มหาราช',
        contact: { name: 'ผู้ปกครอง', phone: '081-000-0000', address: 'เชียงใหม่' },
        rights: 'บัตรทอง',
        nextAppointment: '2025-12-04 14:00',
        image: 'https://images.unsplash.com/photo-1647151481252-0e39fe9176b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwYm95JTIwc21pbGluZ3xlbnwxfHx8fDE3NjQ4MjI3OTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [],
        history: [],
        funding: [],
        date: '2025-12-04', time: '14:00', type: 'New Case', room: '2'
    },
    { 
        id: 'P010', 
        hn: '66012348', 
        cid: '1-0000-12348-12-0',
        name: 'นาย ปรีดา สุขใจ', 
        age: '50 ปี', 
        dob: '01-01-1975',
        diagnosis: 'Follow-up',
        status: 'Pending',
        hospital: 'รพ.มหาราช',
        contact: { name: 'ผู้ปกครอง', phone: '081-000-0000', address: 'เชียงใหม่' },
        rights: 'บัตรทอง',
        nextAppointment: '2025-12-04 14:30',
        image: 'https://images.unsplash.com/photo-1464892216009-6d356060e72c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9mJTIwYWR1bHR8ZW58MXx8fHwxNzY0ODIyNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        timeline: [],
        history: [],
        funding: [],
        date: '2025-12-04', time: '14:30', type: 'Follow-up', room: '1'
    },
    { 
        id: 'P011', 
        hn: '66012399', 
        cid: '1-1100-12399-12-1',
        name: 'เด็กชาย ขาดนัด ประจำ', 
        age: '6 ปี', 
        dob: '01-01-2019',
        diagnosis: 'Follow-up',
        status: 'Missed',
        hospital: 'รพ.มหาราช',
        contact: { name: 'ผู้ปกครอง', phone: '081-000-0000', address: 'เชียงใหม่' },
        rights: 'บัตรทอง',
        nextAppointment: '2025-12-04 15:00',
        image: 'https://images.unsplash.com/photo-1596962850195-da481ce4cc82?auto=format&fit=crop&q=80&w=800',
        timeline: [],
        history: [],
        funding: [],
        date: '2025-12-04', time: '15:00', type: 'Follow-up', room: '-'
    }
];

// Reusing PATIENTS_DATA to create consistent mock data for other modules
// This ensures that HN and Names match across the entire application

export const REFERRAL_DATA = [
    { 
      ...PATIENTS_DATA.find(p => p.hn === '66088990'), // น.ส. ใจใส มั่นคง
      id: 1001, 
      time: '09:00', 
      date: '2025-12-04', 
      status: 'pending', 
      type: 'Refer In', 
      hospital: 'รพ.สต.บ้านดอย',
      referralNo: 'REF-IN-6612-001',
      referralDate: '2025-12-03T09:00:00',
      urgency: 'Emergency',
      patientName: PATIENTS_DATA.find(p => p.hn === '66088990')?.name,
      patientHn: '66088990',
      destinationHospital: 'รพ.มหาราช',
      reason: 'ผู้ป่วยมีอาการปวดท้องรุนแรง สงสัยไส้ติ่งอักเสบ ต้องการส่งตัวเพื่อผ่าตัดด่วน',
      documents: ['ใบส่งตัว.pdf', 'ผลเลือด.pdf'],
      logs: []
    },
    { 
      ...PATIENTS_DATA.find(p => p.hn === '66012348'), // นาย ปรีดา สุขใจ
      id: 1002, 
      time: '10:30', 
      date: '2025-12-04', 
      status: 'Accepted', 
      appointmentDate: '2026-01-26',
      appointmentTime: '09:14', 
      type: 'Refer Out', 
      hospital: 'รพ.ศูนย์ B',
      referralNo: 'REF-OUT-6612-002',
      referralDate: '2025-12-04T08:30:00',
      urgency: 'Standard',
      patientName: PATIENTS_DATA.find(p => p.hn === '66012348')?.name,
      patientHn: '66012348',
      destinationHospital: 'รพ.ศูนย์ B',
      reason: 'ส่งต่อเพื่อทำ MRI เพิ่มเติมตามสิทธิ์การรักษา',
      documents: ['ประวัติการรักษา.pdf'],
      logs: []
    },
    { 
      ...PATIENTS_DATA.find(p => p.hn === '66012347'), // ด.ช. อดทน เก่งมาก
      id: 1003, 
      time: '14:00', 
      date: '2025-12-04', 
      status: 'pending', 
      type: 'Refer In', 
      hospital: 'รพ.ชุมชน C',
      referralNo: 'REF-IN-6612-003',
      referralDate: '2025-12-04T10:00:00',
      urgency: 'Urgent',
      patientName: PATIENTS_DATA.find(p => p.hn === '66012347')?.name,
      patientHn: '66012347',
      destinationHospital: 'รพ.มหาราช',
      reason: 'เด็กมีไข้สูง ชักเกร็ง ไม่ทราบสาเหตุ',
      documents: [],
      logs: []
    }
];

export const HOME_VISIT_DATA = [
    { 
        ...PATIENTS_DATA.find(p => p.hn === '66012345'), // ด.ช. รักดี มีสุข
        id: 3001, 
        date: '2025-12-04', 
        status: 'InProgress', 
        type: 'Joint Visit', 
        time: '09:30',
        detail: 'เยี่ยมบ้านติดตามอาการหลังผ่าตัด',
        rph: 'รพ.สต. แม่ริม',
        requestDate: '1 ธ.ค. 68',
        note: 'ผู้ป่วยมีอาการซึมเล็กน้อย แผลแห้งดี'
    },
    { 
        ...PATIENTS_DATA.find(p => p.hn === '66012346'), // นางสาว มุ่งมั่น ทำดี
        id: 3002, 
        date: '2025-12-04', 
        status: 'Pending', 
        type: 'Routine', 
        time: '13:00',
        detail: 'ติดตามโภชนาการ',
        rph: 'รพ.สต. สันกำแพง',
        requestDate: '2 ธ.ค. 68',
        note: 'ติดตามน้ำหนักและส่วนสูง'
    }
];

export const TELEMED_DATA = [
    { 
        ...PATIENTS_DATA.find(p => p.hn === '66012399'), // เด็กชาย ขาดนัด ประจำ
        id: 4001, 
        date: '2025-12-04', 
        detail: 'ติดตามอาการเบาหวานและแผลกดทับ', 
        type: 'Telemed', 
        time: '10:00', 
        channel: 'mobile', 
        status: 'Waiting',
        caseManager: 'พยาบาลวิชาชีพ A',
        pcu: 'รพ.สต. แม่ริม',
        zoomUser: 'User_Patient_001',
        treatmentDetails: 'ติดตามระดับน้ำตาลในเลือด และประเมินแผลกดทับบริเวณก้นกบ',
        meetingLink: 'https://zoom.us/j/123456789'
    },
    { 
        ...PATIENTS_DATA.find(p => p.hn === '65112233'), // ด.ญ. พอใจ ยิ้มสวย
        id: 4002, 
        date: '2025-12-04', 
        detail: 'ปรึกษาปัญหาแผลเรื้อรัง', 
        type: 'Telemed', 
        time: '14:30', 
        channel: 'hospital', 
        status: 'Completed',
        caseManager: 'พยาบาลวิชาชีพ B',
        pcu: 'รพ.สต. สันกำแพง',
        zoomUser: 'Hospital_Unit_02',
        treatmentDetails: 'ปรึกษาเรื่องการทำแผล และการใช้อุปกรณ์ทำแผลแบบพิเศษ',
        meetingLink: ''
    },
    { 
        ...PATIENTS_DATA.find(p => p.hn === '65778811'), // นาย สมชาย แข็งแรง
        id: 4003, 
        date: '2025-12-04', 
        detail: 'ติดตามความดันโลหิต', 
        type: 'Telemed', 
        time: '15:00', 
        channel: 'mobile', 
        status: 'Cancelled',
        caseManager: 'พยาบาลวิชาชีพ C',
        pcu: 'รพ.สต. หางดง',
        zoomUser: 'User_Patient_003',
        treatmentDetails: 'ติดตามผลการวัดความดันโลหิตที่บ้าน 7 วันย้อนหลัง',
        meetingLink: ''
    }
];