import React from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole, Role } from "@/context/RoleContext";

function Frame2() {
  return (
    <div className="absolute bg-[#e02424] flex items-center justify-center left-[16px] px-[2px] py-0 rounded-[99px] top-[-6px]">
      <p className="font-['IBM_Plex_Sans_Thai',sans-serif] h-[16px] leading-[1.5] not-italic relative shrink-0 text-[12px] text-white w-[22px] text-center font-medium">99+</p>
    </div>
  );
}

function Icon({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white flex flex-col gap-[10px] items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px] cursor-pointer hover:bg-slate-50 transition-colors" 
      data-name="Icon"
    >
      <Bell className="text-[#faca15] fill-[#faca15] w-5 h-5" />
      <Frame2 />
    </div>
  );
}

function Icon1({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white flex flex-col items-center justify-center p-[10px] relative rounded-[99px] shrink-0 size-[40px] cursor-pointer hover:bg-slate-50 transition-colors" 
      data-name="Icon"
    >
      <User className="text-[#49358e] fill-[#49358e] w-5 h-5" />
    </div>
  );
}

function Frame1({ onProfileClick, onNotificationClick }: { onProfileClick?: () => void, onNotificationClick?: () => void }) {
  return (
    <div className="flex gap-[12px] h-[40px] items-center relative shrink-0">
      <Icon onClick={onNotificationClick} />
      <Icon1 onClick={onProfileClick} />
    </div>
  );
}

export default function DashboardTopBar({ onProfileClick, onNotificationClick }: { onProfileClick?: () => void, onNotificationClick?: () => void }) {
  const { currentRole, setCurrentRole } = useRole();

  const roleLabels: Record<Role, string> = {
    'CM': 'Case Manager (โรงพยาบาลฝาง)',
    'Hospital': 'Hospital (รพ.แม่ข่าย)',
    'SCFC': 'SCFC (ศูนย์ฯ)',
    'PCU': 'รพ.สต.',
    'Patient': 'ผู้ป่วย',
    'Admin': 'Admin IT',
  };

  return (
    <div className="flex items-center justify-between px-[16px] py-[12px] sticky top-0 z-[100] w-full h-[64px] bg-[#7066A9]">
      <div className="flex items-center gap-1">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-[#f6f5ff] h-[32px] rounded-full shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex items-center px-3 gap-2 cursor-pointer hover:bg-white transition-colors">
               <span className="font-['IBM_Plex_Sans_Thai',sans-serif] font-medium text-[#49358e] text-[16px] truncate max-w-[200px]">
                 {roleLabels[currentRole]}
               </span>
               <ChevronDown className="w-3 h-3 text-gray-500 shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            {(Object.keys(roleLabels) as Role[]).map((role) => (
              <DropdownMenuItem 
                key={role} 
                onClick={() => setCurrentRole(role)}
                className={currentRole === role ? "bg-[#e8e6f6] font-bold text-[#49358e]" : "text-slate-600"}
              >
                {roleLabels[role]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      <Frame1 onProfileClick={onProfileClick} onNotificationClick={onNotificationClick} />
    </div>
  );
}
