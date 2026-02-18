import React, { useState } from "react";
import { 
  Users, 
  Settings, 
  BookOpen, 
  PenTool, 
  FolderCog,
  Landmark,
  ChevronDown,
  ChevronRight,
  FileText,
  Building,
  FileDigit,
  Building2,
  LayoutDashboard
} from "lucide-react";
import { cn } from "../../../components/ui/utils";
import imgThaiCleftLinkLogo from "figma:asset/12ae20be12afdbbc28ab9f595255380bf78a4390.png";

// Replaced missing SVG components with Lucide icons
const ActIcon = (props: any) => <FileText {...props} />;
const DepartmentIcon = (props: any) => <Building {...props} />;
const Icd9Icon = (props: any) => <FileDigit {...props} />;
const Icd10Icon = (props: any) => <FileDigit {...props} />;
const HospitalIcon = (props: any) => <Building2 {...props} />;

interface AdminSidebarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
}

type MenuItem = {
  id?: string;
  label: string;
  icon: any;
  children?: MenuItem[];
};

export default function AdminSidebar({ activePage = "dashboard", onNavigate = () => {} }: AdminSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["management"]);

  const menuItems: MenuItem[] = [
    { 
      id: "dashboard",
      label: "การจัดการ", 
      icon: FolderCog,
      children: [
        { id: "user_management", label: "จัดการผู้ใช้งาน", icon: Users },
        { id: "hospital_info", label: "ข้อมูลโรงพยาบาล", icon: HospitalIcon },
      ]
    },
    { id: "act", label: "ACT", icon: ActIcon },
    { id: "department", label: "แผนก", icon: DepartmentIcon },
    { id: "icd9", label: "ICD 9", icon: Icd9Icon },
    { id: "icd10", label: "ICD 10", icon: Icd10Icon },
    { id: "funding_management", label: "จัดการกองทุน", icon: Landmark },
    { id: "system_config", label: "ตั้งค่าแผนการรักษา", icon: Settings },
    { id: "content_management", label: "จัดการเนื้อหา", icon: BookOpen },
    { id: "form_builder", label: "สร้างฟอร์ม", icon: PenTool },
  ];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isActive = activePage === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.id ? expandedGroups.includes(item.id) : false;
    const isChildActive = item.children?.some(child => child.id === activePage);

    return (
      <div key={item.id}>
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300 relative mx-3 rounded-[5px] group cursor-pointer",
            "px-6 py-3",
            (isActive || isChildActive) && depth === 0 ? "text-[#5e5873]" : "text-[#5e5873] hover:bg-gray-50",
            isActive && depth > 0 ? "bg-[#7367f0]/10 text-[#7367f0]" : ""
          )}
          style={{ paddingLeft: `${24 + (depth * 20)}px` }}
          onClick={() => {
            if (hasChildren) {
              item.id && toggleGroup(item.id);
            }
            item.id && onNavigate(item.id);
          }}
        >
          {(isActive || (isChildActive && depth === 0)) && (
            <div className={cn("absolute inset-0 rounded-[5px] -z-10", depth === 0 ? "bg-[#DFF6F8]" : "")} />
          )}

          <div className="flex items-center gap-3">
            <item.icon size={20} className={cn("shrink-0", (isActive || isChildActive) ? "text-[#5e5873]" : "text-[#6e6b7b]")} />
            <span className={cn("font-medium text-[15px] whitespace-nowrap overflow-hidden transition-all duration-300", (isActive || isChildActive) ? "font-bold" : "")}>
              {item.label}
            </span>
          </div>

          {hasChildren && (
            <div className="text-[#6e6b7b]">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 mb-2 animate-in slide-in-from-top-2 duration-200">
            {item.children!.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-2 border-b border-gray-100">
        <div className="h-10 w-10 shrink-0">
           <img 
             src={imgThaiCleftLinkLogo} 
             alt="Thai Cleft Link Logo" 
             className="h-full w-full object-contain"
           />
        </div>
        <span className="font-bold text-xl text-gray-800">MedAdmin</span>
      </div>

      <nav className="flex-1 py-2 gap-1 flex flex-col pb-10">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      <div className="p-4 border-t border-gray-100">
      </div>
    </aside>
  );
}