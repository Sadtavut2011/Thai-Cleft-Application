import React, { useState, useEffect } from 'react';
import { UserCog, User, Building2, Activity, Users, Edit2, Folder, Calendar, Send, Home, Map, Video, ChevronDown, ChevronRight, FileText, FilePlus2, LayoutDashboard, Coins } from 'lucide-react';
import { cn } from '../../../../components/ui/utils';
import imgLogo from "figma:asset/59a7cc50d1086cde4a964d74ca0097bd1d33ca70.png";

interface SidebarProps {
  className?: string;
  currentView?: string;
  onNavigate?: (page: string) => void;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  subItems?: MenuItem[];
}

const SidebarItem = ({ 
  item,
  activePage,
  expandedMenus,
  onToggle,
  onNavigate,
  depth = 0
}: { 
  item: MenuItem, 
  activePage: string,
  expandedMenus: string[],
  onToggle: (label: string) => void,
  onNavigate: (label: string) => void,
  depth?: number
}) => {
  const isActive = activePage === item.label;
  const isExpanded = expandedMenus.includes(item.label);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  
  // Check if any child is active
  const isChildActive = item.subItems?.some(sub => sub.label === activePage);

  const handleClick = () => {
    if (hasSubItems) {
      onToggle(item.label);
    }
    // Always navigate to the item's page, even if it has subitems
    onNavigate(item.label);
  };

  return (
    <>
      <div 
        className={cn(
          "flex items-center justify-between px-6 py-3 cursor-pointer transition-colors relative mx-3 rounded-[5px]",
          (isActive || isChildActive) && depth === 0 ? "text-[#5e5873]" : "text-[#5e5873] hover:bg-gray-50",
          isActive && depth > 0 ? "bg-[#7367f0]/10 text-[#7367f0]" : ""
        )}
        style={{ paddingLeft: `${24 + (depth * 20)}px` }}
        onClick={handleClick}
      >
        {(isActive || (isChildActive && depth === 0)) && (
           <div className={cn("absolute inset-0 rounded-[5px] -z-10", depth === 0 ? "bg-[#DFF6F8]" : "")} />
        )}
        
        <div className="flex items-center gap-3">
          <item.icon size={20} className={cn("shrink-0", (isActive || isChildActive) ? "text-[#5e5873]" : "text-[#6e6b7b]")} />
          <span className={cn("font-medium text-[15px]", (isActive || isChildActive) ? "font-bold" : "")}>
            {item.label}
          </span>
        </div>

        {hasSubItems && (
          <div className="text-[#6e6b7b]">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </div>

      {/* Submenu Items */}
      {hasSubItems && isExpanded && (
        <div className="mt-1 mb-2">
          {item.subItems!.map((subItem) => (
            <SidebarItem 
              key={subItem.label}
              item={subItem}
              activePage={activePage}
              expandedMenus={expandedMenus}
              onToggle={onToggle}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default function CMSidebar({ className, currentView, onNavigate }: SidebarProps) {
  const [activePage, setActivePage] = useState("จัดการข้อมูลผู้ป่วย");
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    { 
      label: "จัดการข้อมูลผู้ป่วย", 
      icon: User,
      subItems: [
        { label: "แผนการรักษา", icon: FileText },
        { label: "แผนที่(GIS)", icon: Map }
      ]
    },
    {
      label: "ระบบปฏิบัติการ",
      icon: LayoutDashboard,
      subItems: [
        { label: "ระบบเยี่ยมบ้าน", icon: Home },
        { label: "ระบบนัดหมาย", icon: Calendar },
        { label: "Tele-consult", icon: Video },
        { label: "ระบบส่งตัวผู้ป่วย", icon: Send },
        { label: "ระบบขอทุน", icon: Coins }
      ]
    },
  ];

  // Auto-expand menu if a child is active (on mount or activePage change)
  useEffect(() => {
    if (currentView) {
        setActivePage(currentView);
    }
  }, [currentView]);

  useEffect(() => {
    const parent = menuItems.find(item => item.subItems?.some(sub => sub.label === activePage));
    if (parent && !expandedMenus.includes(parent.label)) {
      setExpandedMenus(prev => [...prev, parent.label]);
    }
  }, [activePage]);

  const handleToggle = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

  const handleNavigation = (label: string) => {
    setActivePage(label);
    if (onNavigate) {
      onNavigate(label);
    }
  };

  return (
    <nav className={cn("w-[250px] bg-white h-screen shadow-[0px_0px_15px_0px_rgba(0,0,0,0.05)] flex flex-col shrink-0 overflow-y-auto", className)}>
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 mb-4 sticky top-0 bg-white z-10">
        <div className="h-[34px] w-[34px] flex items-center justify-center shrink-0 overflow-hidden">
          <img src={imgLogo} className="w-full h-full object-cover" alt="Logo" />
        </div>
        <span className="text-[rgb(73,53,142)] font-bold text-[18px] tracking-tight">
          โรงพยาบาลฝาง
        </span>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col py-2 gap-1 pb-10">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.label}
            item={item}
            activePage={activePage}
            expandedMenus={expandedMenus}
            onToggle={handleToggle}
            onNavigate={handleNavigation}
          />
        ))}

        {/* Chat System Item */}
        <div 
          className={cn(
            "flex items-center justify-between px-6 py-3 cursor-pointer transition-colors relative mx-3 rounded-[5px]",
            activePage === "ระบบสนทนา" ? "text-[#5e5873]" : "text-[#5e5873] hover:bg-gray-50"
          )}
          onClick={() => handleNavigation("ระบบสนทนา")}
        >
           {/* Active Background */}
           {activePage === "ระบบสนทนา" && (
             <div className="absolute inset-0 rounded-[5px] -z-10 bg-[#DFF6F8]" />
           )}
           
           <div className="flex items-center gap-3">
              {/* Icon */}
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={cn("shrink-0", activePage === "ระบบสนทนา" ? "text-[#5e5873]" : "text-[#6e6b7b]")}
              >
                 <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span className={cn("font-medium text-[15px]", activePage === "ระบบสนทนา" ? "font-bold" : "")}>
                ระบบสนทนา
              </span>
           </div>
           
           {/* Badge */}
           <div className="w-5 h-5 rounded-full bg-[#FF3E3E] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              3
           </div>
        </div>
      </div>
    </nav>
  );
}
