import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  MessageCircle, 
  Activity 
} from 'lucide-react';

interface BottomNavProps {
  activeTab?: 'dashboard' | 'patients' | 'referrals' | 'calendar' | 'chat';
  onNavigate?: (tab: 'dashboard' | 'patients' | 'referrals' | 'calendar' | 'chat') => void;
}

export default function BottomNav({ activeTab = 'patients', onNavigate }: BottomNavProps) {
  const handleNav = (tab: 'dashboard' | 'patients' | 'referrals' | 'calendar' | 'chat') => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white z-50 rounded-t-[24px] shadow-[0px_-6px_4px_0px_rgba(0,0,0,0.04)] border-t-2 border-[#d2cee7] flex flex-row items-center pb-[20px] pt-[12px] px-[12px] md:static md:w-auto md:bg-transparent md:border-none md:shadow-none md:rounded-none md:flex-col md:gap-6 md:py-4 md:px-0 md:col-span-1 md:z-auto pb-safe">
       <div className="hidden md:flex w-10 h-10 bg-[#49358e] rounded-xl items-center justify-center text-white shadow-lg shadow-[#49358e]/40">
         <Activity size={24} />
       </div>
       
       <nav className="flex flex-row md:flex-col w-full md:w-auto md:gap-4">
         {/* Home (Dashboard) */}
         <button 
             onClick={() => handleNav('dashboard')}
             className={\`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full \${
                 activeTab === 'dashboard' 
                 ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                 : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
             }\`}
         >
             <Home size={20} className="md:w-5 md:h-5" />
             <span className={\`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap \${activeTab === 'dashboard' ? 'font-bold' : 'font-medium'}\`}>หน้าหลัก</span>
         </button>

         {/* Patients */}
         <button 
            onClick={() => handleNav('patients')}
            className={\`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full \${
                activeTab === 'patients' 
                ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
            }\`}
         >
            <Users size={20} className="md:w-5 md:h-5" />
            <span className={\`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap \${activeTab === 'patients' ? 'font-bold' : 'font-medium'}\`}>ผู้ป่วย</span>
         </button>

         {/* My Work (Referrals) */}
         <button 
            onClick={() => handleNav('referrals')}
            className={\`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full \${
                activeTab === 'referrals' 
                ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
            }\`}
         >
             <FileText size={20} className="md:w-5 md:h-5" />
             <span className={\`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap \${activeTab === 'referrals' ? 'font-bold' : 'font-medium'}\`}>งานของฉัน</span>
         </button>

         {/* Appointments (Calendar) */}
         <button 
             onClick={() => handleNav('calendar')}
             className={\`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full \${
                 activeTab === 'calendar' 
                 ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                 : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
             }\`}
         >
             <Calendar size={20} className="md:w-5 md:h-5" />
             <span className={\`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap \${activeTab === 'calendar' ? 'font-bold' : 'font-medium'}\`}>นัดหมาย</span>
         </button>

         {/* Chat */}
         <button 
            onClick={() => handleNav('chat')}
            className={\`flex-1 flex flex-col items-center gap-[8px] md:gap-1 p-0 md:p-3 rounded-xl transition-all md:w-full \${
                activeTab === 'chat' 
                ? 'text-[#49358e] md:text-primary md:bg-white md:shadow-sm' 
                : 'text-[#b8aeea] md:text-slate-400 md:hover:bg-white md:hover:text-slate-600'
            }\`}
         >
             <MessageCircle size={20} className="md:w-5 md:h-5" />
             <span className={\`text-[12px] md:text-[10px] leading-[1.5] md:font-medium whitespace-nowrap \${activeTab === 'chat' ? 'font-bold' : 'font-medium'}\`}>สนทนา</span>
         </button>
       </nav>
    </div>
  );
}
