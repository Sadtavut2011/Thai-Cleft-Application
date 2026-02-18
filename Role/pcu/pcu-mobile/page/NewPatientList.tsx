import React from 'react';
import { 
    Search, 
    Filter, 
    Bookmark, 
    Check, 
    X,
    ChevronLeft
} from 'lucide-react';
import { TopHeader } from '../../../../components/shared/layout/TopHeader';
import { MinHeader } from '../../../../components/shared/layout/MinHeader';
import { PATIENTS_DATA } from '../../../../data/patientData';

interface Patient {
    id: string;
    hn: string;
    name: string;
    age: string;
    condition: string;
    lastVisit: string;
    tags: string[];
    image: string;
    bookmarked?: boolean;
}

// --- Derive patient list from PATIENTS_DATA (single source) ---
const MOCK_PATIENTS: Patient[] = PATIENTS_DATA.map((p, i) => ({
    id: p.id || String(i + 1),
    hn: p.cid || p.hn || '-',
    name: p.name,
    age: p.age ? String(p.age).replace(/[^\d]/g, '').slice(0, 2) || '0' : '0',
    condition: p.diagnosis || 'Cleft Lip',
    lastVisit: '3 มีนาคม 2567',
    tags: [p.status === 'Active' ? 'Active' : (p.status || 'Active'), 'Consent'],
    image: p.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=7367f0&color=fff`,
    bookmarked: i < 3
}));

interface NewPatientsProps {
    onBack: () => void;
    onSubmit: (data: any) => void;
}

export const NewPatientList: React.FC<NewPatientsProps> = ({ onBack, onSubmit }) => {
    return (
        <div className="bg-slate-50 h-full flex flex-col font-['IBM_Plex_Sans_Thai']">
            <TopHeader />
            {/* Header / Search Bar */}
            <div className="bg-[#7066a9] sticky top-0 z-10 shadow-sm">
                <MinHeader onBack={onBack} title="รายชื่อผู้ป่วย" />
            </div>

            {/* List */}
            <div className="p-4 space-y-4 pb-24 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {MOCK_PATIENTS.map(patient => (
                    <div 
                        key={patient.id} 
                        onClick={() => onSubmit(patient)} // Trigger action on click
                        className="bg-white rounded-[16px] px-3 py-3 flex items-center justify-center shadow-sm border border-transparent hover:border-[#7066a9]/30 transition-all cursor-pointer relative"
                    >
                        <div className="flex items-start gap-3 w-full justify-between">
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="w-[36px] h-[36px] shrink-0 rounded-full overflow-hidden shadow-sm border border-white">
                                    <img src={patient.image} alt="Patient" className="w-full h-full object-cover" />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-[#3c3c3c] text-[16px] font-semibold leading-tight">
                                        {patient.name}
                                    </h3>
                                    <p className="text-[#787878] text-[14px] leading-tight">
                                        เลขปชช : <span className="uppercase">{patient.hn}</span>
                                    </p>
                                    <p className="text-[#787878] text-[14px] leading-tight">
                                        อายุ {patient.age} ปี
                                    </p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="w-[32px] h-[32px] shrink-0 bg-[#ff6900] rounded-full flex items-center justify-center shadow-sm">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.4967 14.9934L12.4945 9.9956L7.4967 4.9978" stroke="white" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};