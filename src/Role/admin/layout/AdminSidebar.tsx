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
      label: "การจัดการ (Management)", 
      icon: FolderCog,
      children: [
        { id: "user_management", label: "จัดการผู้ใช้งาน (User & Access)", icon: Users },
        { id: "hospital_info", label: "ข้อมูลโรงพยาบาล (Hospital Info)", icon: HospitalIcon },
      ]
    },
    { id: "act", label: "ACT", icon: ActIcon },
    { id: "department", label: "แผนก", icon: DepartmentIcon },
    { id: "icd9", label: "ICD 9", icon: Icd9Icon },
    { id: "icd10", label: "ICD 10", icon: Icd10Icon },
    { id: "funding_management", label: "จัดการกองทุน (Funding)", icon: Landmark },
    { id: "system_config", label: "ตั้งค่าแผนการรักษา (Treatment Plan)", icon: Settings },
    { id: "content_management", label: "จัดการเนื้อหา (Content)", icon: BookOpen },
    { id: "form_builder", label: "สร้างฟอร์ม (Form Builder)", icon: PenTool },
  ];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.children) {
      const isExpanded = expandedGroups.includes(item.id!);
      const isActiveChild = item.children.some(child => child.id === activePage);
      const isSelfActive = activePage === item.id;
      
      return (
        <div key={item.id} className="space-y-1">
          <div
            className={cn(
              "flex items-center w-full text-sm font-medium rounded-lg transition-colors pr-2",
              isActiveChild || isSelfActive ? "text-blue-600 bg-blue-50/50" : "text-gray-700 hover:bg-gray-50"
            )}
          >
            <button
              onClick={() => item.id && onNavigate(item.id)}
              className="flex items-center gap-3 flex-1 px-4 py-3 text-left"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="text-xs leading-tight">{item.label}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                item.id && toggleGroup(item.id);
              }}
              className="p-1 rounded-md hover:bg-black/5 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          
          {isExpanded && (
            <div className="pl-4 space-y-1">
              {item.children.map(child => (
                <button
                  key={child.id}
                  onClick={() => child.id && onNavigate(child.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors border-l-2 ml-4 text-left",
                    activePage === child.id
                      ? "border-blue-600 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <child.icon className="h-4 w-4 shrink-0" />
                  <span className="text-xs leading-tight">{child.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => item.id && onNavigate(item.id)}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors text-left",
          activePage === item.id
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="text-xs leading-tight">{item.label}</span>
      </button>
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

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(renderMenuItem)}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <Users className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-700">Admin User</p>
            <p className="text-gray-500 text-xs">admin@scfc.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
