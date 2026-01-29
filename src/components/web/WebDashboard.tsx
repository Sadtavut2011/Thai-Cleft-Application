import React from 'react';
import { 
  Users, 
  Activity, 
  UserX, 
  UserPlus, 
  ArrowLeft
} from 'lucide-react';
import { WebSidebar } from './WebSidebar';
import { PatientTable } from './PatientTable';
import imgAvatar from 'figma:asset/c2e2d231a98f5864c2f755616b9c7eb4b9a069c8.png'; // Using existing avatar asset

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  colorClass: string;
  iconBgClass: string;
  textColorClass: string;
}

function StatCard({ label, value, icon: Icon, colorClass, iconBgClass, textColorClass }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <div className={`text-3xl font-bold ${textColorClass} mb-1`}>{value}</div>
        <div className={`text-sm font-medium ${textColorClass}`}>{label}</div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass}`}>
        <Icon className={`w-6 h-6 ${textColorClass}`} />
      </div>
    </div>
  );
}

export function WebDashboard() {
  const stats = [
    { 
      label: 'รายชื่อผู้ป่วยทั้งหมด', 
      value: '13', 
      icon: Users, 
      colorClass: 'bg-blue-50', 
      iconBgClass: 'bg-blue-100', 
      textColorClass: 'text-blue-600' 
    },
    { 
      label: 'Active', 
      value: '7', 
      icon: Activity, 
      colorClass: 'bg-green-50', 
      iconBgClass: 'bg-green-100', 
      textColorClass: 'text-green-600' 
    },
    { 
      label: 'Inactive', 
      value: '6', 
      icon: UserX, 
      colorClass: 'bg-slate-50', 
      iconBgClass: 'bg-slate-100', 
      textColorClass: 'text-slate-600' 
    },
    { 
      label: 'ค้นพบผู้ป่วยใหม่', 
      value: '3', 
      icon: UserPlus, 
      colorClass: 'bg-cyan-50', 
      iconBgClass: 'bg-cyan-100', 
      textColorClass: 'text-cyan-600' 
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-['IBM_Plex_Sans_Thai']">
      <WebSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-[80px] bg-white border-b border-slate-200 px-8 flex items-center justify-end gap-4 sticky top-0 z-30">
           <button className="bg-[#5D5FEF] hover:bg-[#4b4dcf] text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-colors text-sm">
              Thai Cleft Link
           </button>
           <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                  <div className="text-sm font-bold text-slate-800">John Doe</div>
                  <div className="text-xs text-slate-500">Admin</div>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100">
                  <img src={imgAvatar} alt="User" className="w-full h-full object-cover" />
              </div>
           </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-4 mb-8">
                <button className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-slate-700">จัดการข้อมูลผู้ป่วย (Patient Management)</h1>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Main Content (Table) */}
            <PatientTable />
        </main>
      </div>
    </div>
  );
}
