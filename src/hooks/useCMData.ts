import { useState, useMemo } from 'react';
import { PATIENTS_DATA, REFERRAL_DATA, HOME_VISIT_DATA, TELEMED_DATA } from '../data/patientData';

export const useCMData = () => {
    // Shared Date Logic
    // DEMO DATE: 2025-12-04
    const TODAY = '2025-12-04'; 
    const todayDateObj = useMemo(() => new Date(2025, 11, 4), []);
    const displayDate = "พฤหัสบดี 4 ธ.ค. 68"; 

    // Filter State
    const [activeTaskFilter, setActiveTaskFilter] = useState('all');

    // --- TASKS LOGIC ---
    const todaysTasks = useMemo(() => {
        const tasks: any[] = [];

        // 1. Appointments
        PATIENTS_DATA.forEach(p => {
            if (p.date === TODAY) {
                tasks.push({
                    id: `appt-${p.id}`,
                    type: 'appointment',
                    time: p.time,
                    title: 'นัดหมายตรวจรักษา',
                    patient: p.name,
                    hn: p.hn,
                    detail: p.hospital ? `ที่ ${p.hospital}` : 'นัดหมายปกติ',
                    status: p.status,
                    raw: p
                });
            }
        });

        // 2. Tele-med
        TELEMED_DATA.forEach(t => {
            if (t.date === TODAY) {
                tasks.push({
                    id: `tele-${t.id}`,
                    type: 'tele',
                    time: t.time,
                    title: 'Tele-consultation',
                    patient: t.name,
                    hn: t.hn,
                    detail: t.channel === 'mobile' ? 'ผ่านมือถือ' : 'ผ่านโรงพยาบาล',
                    status: t.status,
                    raw: t
                });
            }
        });

        // 3. Home Visit
        HOME_VISIT_DATA.forEach(v => {
            if (v.date === TODAY) {
                tasks.push({
                    id: `visit-${v.id}`,
                    type: 'visit',
                    time: v.time,
                    title: v.type === 'Joint Visit' ? 'เยี่ยมบ้านผู้สูงอายุ (LTC)' : 'เยี่ยมบ้าน',
                    patient: v.name,
                    hn: v.hn,
                    detail: v.rph ? `พื้นที่: ${v.rph}` : 'ลงพื้นที่',
                    status: v.status,
                    raw: v
                });
            }
        });

        // 4. Referral (Receive - Inbound) for TODAY
        REFERRAL_DATA.forEach(r => {
            if (r.type === 'Refer In' && r.date === TODAY) {
                 tasks.push({
                    id: `refer-${r.id}`,
                    type: 'referral',
                    time: r.time,
                    title: 'รับตัวผู้ป่วยส่งต่อ',
                    patient: r.patientName || r.name,
                    hn: r.patientHn || r.hn,
                    detail: `จาก: ${r.hospital}`,
                    status: r.status,
                    raw: r
                });
            }
        });

        return tasks.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    }, []);

    // Filter logic for "My Work Today" (excluding general referrals which go to "Work Under Care")
    const myTasks = useMemo(() => {
        return todaysTasks.filter(task => 
            task.type !== 'referral' && 
            (activeTaskFilter === 'all' || activeTaskFilter === task.type)
        );
    }, [todaysTasks, activeTaskFilter]);

    // Logic for "Work Under Care" (Referrals Pending)
    const workUnderCare = useMemo(() => {
        return REFERRAL_DATA.filter(r => 
            r.type === 'Refer In' && 
            (r.status === 'Pending' || r.status === 'pending')
        );
    }, []);

    // --- STATS LOGIC ---
    const stats = useMemo(() => ({
        referral: REFERRAL_DATA.length,
        appointments: PATIENTS_DATA.filter(p => p.date === TODAY).length,
        pending: workUnderCare.length,
        inbound: REFERRAL_DATA.filter(r => r.type === 'Refer In').length,
        outbound: REFERRAL_DATA.filter(r => r.type === 'Refer Out').length
    }), [workUnderCare]);

    return {
        todayDateObj,
        displayDate,
        activeTaskFilter,
        setActiveTaskFilter,
        todaysTasks,
        myTasks,
        workUnderCare,
        stats,
        // Raw Data Access
        allPatients: PATIENTS_DATA,
        allReferrals: REFERRAL_DATA,
        allVisits: HOME_VISIT_DATA,
        allTelemed: TELEMED_DATA
    };
};
