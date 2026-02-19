import React from 'react';
import { Bell } from 'lucide-react';
import { useRole, Role } from "@/context/RoleContext";
import imgImageUser from "figma:asset/5b8e3d80724f791826539183102d6b8d87301739.png";

const roleLabels: Record<Role, string> = {
  'CM': 'CM',
  'Hospital': 'Hospital',
  'SCFC': 'SCFC',
  'PCU': 'PCU',
  'Patient': 'Patient',
  'Admin': 'Admin',
};

interface WebHeaderProps {
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
}

export default function WebHeader({ onProfileClick, onNotificationClick }: WebHeaderProps) {
  const { currentRole } = useRole();

  return (
    <div className="bg-white flex items-center justify-end px-[24px] py-[12px] rounded-[6px] shadow-[0px_4px_24px_0px_rgba(24,41,47,0.1)] w-full h-[62px] font-['IBM_Plex_Sans_Thai',sans-serif]">
      {/* Right side - Thai Cleft Link + Notification + User */}
      <div className="flex items-center gap-[24px]">
        {/* Thai Cleft Link Button */}
        <div className="bg-[#5b4d9d] h-[40px] rounded-[8px] flex items-center px-[16px] cursor-pointer hover:bg-[#4D4280] transition-colors">
          <p className="font-medium text-[16px] text-white leading-[24px] whitespace-nowrap">
            Thai Cleft Link
          </p>
        </div>

        {/* Notification Bell */}
        <div
          onClick={onNotificationClick}
          className="relative bg-white flex items-center justify-center rounded-full size-[40px] cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <Bell className="text-[#faca15] fill-[#faca15] w-5 h-5" />
          <div className="absolute bg-[#e02424] flex items-center justify-center left-[18px] top-[-4px] px-[4px] py-0 rounded-[99px]">
            <p className="text-[10px] text-white font-medium leading-[16px]">99+</p>
          </div>
        </div>

        {/* User Info + Avatar */}
        <div
          className="flex items-center gap-[12px] cursor-pointer"
          onClick={onProfileClick}
        >
          <div className="flex flex-col items-end gap-[2px]">
            <p className="font-medium text-[14px] text-[#6e6b7b] leading-[14px]">
              John Doe
            </p>
            <p className="text-[12px] text-[#b9b9c3] leading-[12px]">
              {roleLabels[currentRole]}
            </p>
          </div>

          {/* Avatar */}
          <div className="relative size-[38px]">
            <div className="rounded-full overflow-hidden size-full">
              <img
                alt="User"
                className="object-cover size-full rounded-full"
                src={imgImageUser}
              />
            </div>
            <div className="absolute border-2 border-solid border-white inset-0 rounded-full shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] pointer-events-none" />
            {/* Green online dot */}
            <div className="absolute bg-[#28c76f] border-2 border-solid border-white rounded-full size-[11px] right-0 bottom-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
