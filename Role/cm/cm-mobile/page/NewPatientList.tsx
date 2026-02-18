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

const MOCK_PATIENTS: Patient[] = [
    {
        id: '1',
        hn: '1100702356891',
        name: 'ด.ญ. มานี มีใจ',
        age: '5',
        condition: 'Cleft Lip - left - microform',
        lastVisit: '3 มีนาคม 2567',
        tags: ['Consent', 'ใช้งานอยู่'],
        image: 'https://images.unsplash.com/photo-1612018888057-0c0fef6de098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWRoZWFkJTIwd29tYW4lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3ODAwNTU2fDA&ixlib=rb-4.1.0&q=80&w=400',
        bookmarked: true
    },
    {
        id: '2',
        hn: '1250800345678',
        name: 'ด.ช. ปิติ รักเรียน',
        age: '8',
        condition: 'Cleft Lip - left - microform',
        lastVisit: '3 มีนาคม 2567',
        tags: ['Loss F/U', 'Consent'],
        image: 'https://images.unsplash.com/photo-1611086551388-f0cf4d044c76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9uZGUlMjB3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc3MDUyOTN8MA&ixlib=rb-4.1.0&q=80&w=400',
        bookmarked: true
    },
    {
        id: '3',
        hn: '3100502345123',
        name: 'นาย สมชาย ใจดี',
        age: '45',
        condition: 'Cleft Lip - left - microform',
        lastVisit: '3 มีนาคม 2567',
        tags: ['Loss F/U', 'เสียชีวิต'],
        image: 'https://images.unsplash.com/photo-1547941269-2582b3914420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2x5bmVzaWFuJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc4MDA1NTZ8MA&ixlib=rb-4.1.0&q=80&w=400',
        bookmarked: false
    },
    {
        id: '4',
        hn: '1509900234567',
        name: 'นาง สมศรี มั่งมี',
        age: '32',
        condition: 'Pregnancy',
        lastVisit: '3 มีนาคม 2567',
        tags: ['ใช้งานอยู่'],
        image: 'https://images.unsplash.com/photo-1628682819415-afbd0eb5f93a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYW1lcmljYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc4MDA1NTZ8MA&ixlib=rb-4.1.0&q=80&w=400',
        bookmarked: true
    },
    {
        id: '5',
        hn: '2100400123456',
        name: 'ด.ญ. วีณา มานะ',
        age: '4',
        condition: 'Cleft Lip - left - microform',
        lastVisit: '3 มีนาคม 2567',
        tags: ['ใช้งานอยู่'],
        image: 'https://images.unsplash.com/photo-1618202458332-b2e66c630b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWRkbGUlMjBlYXN0ZXJuJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc3NjY2MTV8MA&ixlib=rb-4.1.0&q=80&w=400',
        bookmarked: true
    }
];

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