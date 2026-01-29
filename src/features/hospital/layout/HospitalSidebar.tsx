import React from 'react';
import { 
  Home, 
  Stethoscope, 
  FileInput, 
  BedDouble, 
  History,
  Settings,
  LogOut
} from 'lucide-react';
import thaiCleftLogo from 'figma:asset/12ae20be12afdbbc28ab9f595255380bf78a4390.png';

export default function HospitalSidebar() {
  const menuItems = [
    { icon: Home, label: 'ภาพรวม (Dashboard)', active: true },
    { icon: FileInput, label: 'รับการส่งตัว (Incoming)', active: false },
    { icon: Stethoscope, label: 'การรักษา (Treatment)', active: false },
    { icon: BedDouble, label: 'จัดการเตียง (Ward)', active: false },
    { icon: History, label: 'ประวัติการรักษา (History)', active: false },
  ];

  return (
    <div className="w-[280px] bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo Section */}
      <div className="h-[80px] flex items-center px-6 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl overflow-hidden mr-3">
          <img src={thaiCleftLogo} alt="Thai Cleft Link" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="font-bold text-[#49358e] text-lg leading-tight">Thai Cleft Link</h1>
          <p className="text-xs text-slate-500">Hospital Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Hospital Menu
        </div>
        
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              item.active 
                ? 'bg-[#f6f5ff] text-[#49358e] shadow-sm font-bold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}

        <div className="mt-8 mb-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          System
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium transition-all">
          <Settings size={20} />
          <span className="text-sm">ตั้งค่า (Settings)</span>
        </button>
      </nav>

      {/* User Profile / Footer */}
      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all">
          <LogOut size={20} />
          <span className="text-sm">ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
}
