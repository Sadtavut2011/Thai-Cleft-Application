import React from "react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../components/ui/utils";
import { PatientAvatar } from "./PatientAvatar";
import {
  ArrowLeft,
  Video,
  Send,
  CreditCard,
  Home,
  FileText,
  ChevronDown,
  Pencil,
  X,
  Trash2,
  IdCard,
  ClipboardList,
  Info,
  ShieldCheck,
  Users,
  Building2,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";

const EDIT_SECTIONS = [
  { step: 1, label: "การระบุตัวตน", icon: IdCard },
  { step: 2, label: "ประวัติผู้ป่วย", icon: ClipboardList },
  { step: 3, label: "ข้อมูลทั่วไป", icon: Info },
  { step: 4, label: "ที่อยู่ปัจจุบัน", icon: MapPin },
  { step: 5, label: "สิทธิการรักษา", icon: ShieldCheck },
  { step: 6, label: "ข้อมูลผู้ปกครอง", icon: Users },
  { step: 7, label: "ข้อมูลโรงพยาบาล", icon: Building2 },
];

interface PatientDetailHeaderProps {
  formData: {
    name: string;
    code: string;
    hospital: string;
    image?: string;
  };
  patientStatus?: string;
  isEditing: boolean;
  onBack: () => void;
  onToggleEdit: () => void;
  onEditSection: (step: number) => void;
  onShowTeleConsult: () => void;
  onShowReferral: () => void;
  onShowFund: () => void;
  onShowHomeVisit: () => void;
  onShowAddMedicalRecord: () => void;
}

export function PatientDetailHeader({
  formData,
  patientStatus,
  isEditing,
  onBack,
  onToggleEdit,
  onEditSection,
  onShowTeleConsult,
  onShowReferral,
  onShowFund,
  onShowHomeVisit,
  onShowAddMedicalRecord,
}: PatientDetailHeaderProps) {
  return (
    <div className="sticky top-0 bg-white z-10 rounded-tr-xl shadow-sm border-b border-[#E0E0E0]">
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-2 text-gray-500 hover:text-[#7367f0] hover:bg-[#7367f0]/10"
            >
              <ArrowLeft size={24} />
            </Button>
            <PatientAvatar image={formData.image} name={formData.name} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#5e5873]">
                  {formData.name}
                </h2>
                {patientStatus && (
                  <span className={cn(
                    "px-2.5 py-0.5 text-xs font-medium rounded-full text-white",
                    patientStatus === 'ปกติ' ? "bg-emerald-400" :
                    patientStatus === 'Loss follow up' ? "bg-orange-400" :
                    patientStatus === 'รักษาเสร็จสิ้น' ? "bg-blue-400" :
                    patientStatus === 'เสียชีวิต' ? "bg-red-400" :
                    patientStatus === 'มารดา' ? "bg-pink-400" :
                    "bg-emerald-400"
                  )}>
                    {patientStatus}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#b9b9c3]">
                HN: {formData.code} | {formData.hospital}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Placeholder for Quick Actions */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Action Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/5 font-bold px-6 h-[45px] rounded-xl text-base flex items-center gap-2">
                เมนูปฏิบัติการ
                <ChevronDown size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] p-2">
              <DropdownMenuItem
                onClick={onShowTeleConsult}
                className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#7367f0] focus:text-[#7367f0] focus:bg-[#7367f0]/5"
              >
                <Video size={18} className="mr-3" />
                <span className="font-medium">สร้างนัดหมายผู้ป่วย</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onShowReferral}
                className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#7367f0] focus:text-[#7367f0] focus:bg-[#7367f0]/5"
              >
                <Send size={18} className="mr-3" />
                <span className="font-medium">ส่งตัวผู้ป่วย</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onShowFund}
                className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#7367f0] focus:text-[#7367f0] focus:bg-[#7367f0]/5"
              >
                <CreditCard size={18} className="mr-3" />
                <span className="font-medium">ขอยื่นรับทุน</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onShowHomeVisit}
                className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#7367f0] focus:text-[#7367f0] focus:bg-[#7367f0]/5"
              >
                <Home size={18} className="mr-3" />
                <span className="font-medium">ส่งคำขอเยี่ยมบ้าน</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onShowAddMedicalRecord}
                className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#7367f0] focus:text-[#7367f0] focus:bg-[#7367f0]/5 border-t mt-1 pt-3"
              >
                <FileText size={18} className="mr-3" />
                <span className="font-medium">บันทึกการรักษา</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit Button with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="text-[#7367f0] border-[#7367f0] hover:bg-[#7367f0]/5 h-[45px] w-[45px] rounded-xl p-0 flex items-center justify-center"
              >
                <Pencil size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] p-2">
              <div className="px-4 py-2 text-xs font-medium text-[#b9b9c3] uppercase tracking-wider">
                เลือกหัวข้อที่ต้องการแก้ไข
              </div>
              {EDIT_SECTIONS.map((section) => {
                const Icon = section.icon;
                return (
                  <DropdownMenuItem
                    key={section.step}
                    onClick={() => onEditSection(section.step)}
                    className="py-3 px-4 cursor-pointer text-[#5e5873] hover:text-[#7367f0] focus:text-[#7367f0] focus:bg-[#7367f0]/5"
                  >
                    <Icon size={18} className="mr-3" />
                    <span className="font-medium">{section.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Button (Icon Only) */}
          <Button
            variant="outline"
            className="text-[#ea5455] border-[#ea5455] hover:bg-[#ea5455]/5 h-[45px] w-[45px] rounded-xl p-0 flex items-center justify-center"
            onClick={() => {
              if (window.confirm("ยืนยันการลบข้อมูลผู้ป่วยรายนี้?")) {
                onBack();
              }
            }}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}