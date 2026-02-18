import React from 'react';
import { 
  BarChart2, 
  Wallet, 
  Check, 
  X,
  Home,
  Calendar,
  Ambulance,
  Briefcase,
  Video
} from 'lucide-react';
import DashboardTopBar from '../../../../components/shared/DashboardTopBar';

export default function MobileDashboard({ onRegisterPatient, onProfileClick, onNotificationClick, onNavigateSystem }: any) {
  
  const stats = [
    {
      value: '13',
      label: 'Total Patients',
      sublabel: 'รายชื่อผู้ป่วยทั้งหมด',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: '7',
      label: 'Active Cases',
      sublabel: 'สถานะปกติ',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: '6',
      label: 'Inactive',
      sublabel: 'ไม่เคลื่อนไหว',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
    },
    {
      value: '3',
      label: 'New Discoveries',
      sublabel: 'ผู้ป่วยใหม่',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    }
  ];

  const fundRequests = [
    {
      id: 1,
      name: 'Somchai Jaidee',
      hn: '1000-00201-00',
      status: 'Pending',
      request: 'Surgery Support',
      amount: '15,000',
      initial: 'S',
      initialBg: 'bg-orange-100',
      initialColor: 'text-orange-600'
    },
    {
      id: 2,
      name: 'Vipa Rakthai',
      hn: '1001-00201-00',
      status: 'Pending',
      request: 'Transportation',
      amount: '2,500',
      initial: 'V',
      initialBg: 'bg-purple-100',
      initialColor: 'text-purple-600'
    }
  ];

  const handleNav = (system: string) => {
    if (onNavigateSystem) {
      onNavigateSystem(system);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white font-['IBM_Plex_Sans_Thai'] overflow-hidden">
      
      {/* Top Bar */}
      <div className="shrink-0 z-[110] bg-white shadow-sm">
        <DashboardTopBar 
          onProfileClick={onProfileClick} 
          onNotificationClick={onNotificationClick} 
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Overview Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#7066A9] p-1.5 rounded-md text-white">
                <BarChart2 size={16} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Overview</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className={`rounded-[20px] p-5 flex flex-col justify-between h-[150px] ${stat.bgColor}`}>
                <span className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </span>
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${stat.color}`}>{stat.label}</span>
                  <span className={`text-xs opacity-70 ${stat.color}`}>{stat.sublabel}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fund Management Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className="text-yellow-500">
                    <Wallet size={24} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Fund Management</h2>
            </div>
            <button className="text-sm font-bold text-[#7066A9] hover:text-[#5a5288]">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {fundRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100">
                {/* User Info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${req.initialBg} ${req.initialColor}`}>
                      {req.initial}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{req.name}</h3>
                      <p className="text-slate-400 text-xs">HN: {req.hn}</p>
                    </div>
                  </div>
                  <span className="bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {req.status}
                  </span>
                </div>

                {/* Request Details */}
                <div className="flex items-center justify-between py-3 border-t border-slate-50 mb-3">
                  <span className="text-slate-500 text-sm">Request: {req.request}</span>
                  <span className="font-bold text-slate-800 text-lg">฿ {req.amount}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-[#D1FAE5] transition-colors">
                    <Check size={16} strokeWidth={3} /> Approve
                  </button>
                  <button className="flex-1 h-10 rounded-xl bg-[#FEF2F2] text-[#DC2626] font-bold text-sm flex items-center justify-center gap-1.5 hover:bg-[#FEE2E2] transition-colors">
                    <X size={16} strokeWidth={3} /> Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Menu Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4">เมนูด่วน</h2>
          
          {/* 3-button row */}
          <div className="grid grid-cols-3 gap-3 mb-3 select-none">
            {[
              { label: 'เยี่ยมบ้าน', icon: Home, color: 'text-blue-500', bg: 'bg-blue-50', nav: 'home-visit-system' },
              { label: 'นัดหมาย', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50', nav: 'appointment-dashboard' },
              { label: 'ส่งตัว', icon: Ambulance, color: 'text-orange-500', bg: 'bg-orange-50', nav: 'referrals' },
            ].map((item, idx) => (
              <button 
                key={idx}
                onClick={() => handleNav(item.nav)}
                className="bg-white py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-2.5 shadow-sm border border-slate-100 active:scale-95 transition-all"
              >
                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                  <item.icon className={item.color} size={20} />
                </div>
                <span className="text-slate-700 font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </div>
          
          {/* 2-card row */}
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer" 
              onClick={() => handleNav('funding-system')}
            >
              <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                <Briefcase size={18} />
              </div>
              <h3 className="text-slate-500 font-bold uppercase mb-1 text-sm">ขอทุน</h3>
              <div className="text-3xl font-black text-slate-800">8</div>
              <p className="text-sm text-slate-400 mt-1">รอพิจารณา</p>
              <div className="w-full h-1 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                <div className="h-full bg-teal-500 w-[60%]"></div>
              </div>
            </div>
            
            <div 
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer" 
              onClick={() => handleNav('telemed-system')}
            >
              <div className="w-9 h-9 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2">
                <Video size={18} />
              </div>
              <h3 className="text-slate-500 font-bold uppercase mb-1 text-sm">TELE-MED</h3>
              <div className="text-3xl font-black text-slate-800">12</div>
              <p className="text-sm text-slate-400 mt-1">กำลังใช้งาน</p>
              <div className="flex -space-x-1.5 mt-2.5">
                {[1,2,3].map(i => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200"></div>
                ))}
                <div className="w-5 h-5 rounded-full border border-white bg-slate-100 flex items-center justify-center text-[8px] text-slate-500 font-bold">+9</div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}