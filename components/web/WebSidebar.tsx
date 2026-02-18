import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '../ui/utils';

interface WebSidebarProps {
  className?: string;
}

export function WebSidebar({ className }: WebSidebarProps) {
  const menuItems = [
    { icon: Users, label: 'จัดการข้อมูลผู้ป่วย', active: true },
    { icon: Settings, label: 'ระบบปฏิบัติการ', active: false },
    { icon: MessageCircle, label: 'ระบบสนทนา', active: false, badge: 3 },
  ];

  return (
    <div className={cn("w-[280px] bg-white h-screen border-r border-slate-200 flex flex-col shrink-0", className)}>
      {/* Logo Section */}
      <div className="h-[80px] flex items-center px-6 border-b border-slate-50">
        <div className="w-10 h-10 bg-[#4D45A4] rounded-lg flex items-center justify-center mr-3 shrink-0">
           {/* Elephant Icon Placeholder */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M18 10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V14C6 17.3137 8.68629 20 12 20H18V10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M10 14H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <h1 className="text-xl font-bold text-[#4D45A4] whitespace-nowrap">โรงพยาบาลฝาง</h1>
      </div>

      {/* Menu Section */}
      <div className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
              item.active 
                ? "bg-[#E0F2FE] text-[#1e293b]" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-5 h-5", item.active ? "text-[#0ea5e9]" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="font-bold text-[15px]">{item.label}</span>
            </div>
            {item.active && <ChevronRight className="w-4 h-4 text-[#0ea5e9]" />}
            {item.badge && (
              <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
}
