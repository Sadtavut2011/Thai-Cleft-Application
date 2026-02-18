import React from 'react';
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { Avatar as UiAvatar, AvatarImage, AvatarFallback } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { 
    ChevronLeft, 
    ChevronRight, 
    Bell, 
    Globe, 
    Moon, 
    LogOut, 
    HelpCircle, 
    FileText, 
    Smartphone, 
    Camera, 
    Lock, 
    Mail, 
    Phone,
    History,
    Building2,
    Stethoscope
} from "lucide-react";

export default function HospitalUserProfileMenu({ onBack }: { onBack?: () => void }) {
  return (
    <div className="bg-slate-50 h-full flex flex-col">
       {/* Header */}
       <div className="bg-[#7066a9] h-16 px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
           <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20 rounded-full">
               <ChevronLeft className="w-6 h-6" />
           </Button>
           <h1 className="text-white text-lg font-bold">จัดการบัญชี</h1>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
           <div className="max-w-md mx-auto p-4 space-y-6">
               {/* 1. Personal Information */}
               <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center gap-4 relative overflow-hidden">
                   <div className="relative group cursor-pointer">
                       <UiAvatar className="w-24 h-24 border-4 border-slate-50 shadow-sm">
                           <AvatarImage src="https://images.unsplash.com/photo-1691935152684-ea61702ec5c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwZmVtYWxlJTIwbnVyc2UlMjBob3NwaXRhbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDg5MTY0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                           <AvatarFallback>พว</AvatarFallback>
                       </UiAvatar>
                       <div className="absolute bottom-0 right-0 bg-[#7066a9] text-white p-2 rounded-full hover:bg-[#5a5288] transition-colors shadow-sm">
                           <Camera size={16} />
                       </div>
                   </div>
                   
                   <div className="text-center">
                       <h2 className="text-xl font-bold text-slate-800">พว. วรัญญา รักษา</h2>
                       <p className="text-slate-500 text-sm">พยาบาลวิชาชีพ (RN)</p>
                       <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                            <Badge variant="secondary" className="bg-purple-50 text-[#7066a9] hover:bg-purple-100 border-purple-100">Staff ID: 70234</Badge>
                            <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-100">กำลังปฏิบัติงาน</Badge>
                       </div>
                   </div>
                   
                   <div className="w-full grid grid-cols-1 gap-3 mt-2">
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Building2 size={16} className="text-[#7066a9] shrink-0" />
                            <span className="truncate">โรงพยาบาลแม่ข่าย (รพ.ฝาง)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Stethoscope size={16} className="text-[#7066a9] shrink-0" />
                            <span className="truncate">แผนกศัลยกรรม / แผนก ENT</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Mail size={16} className="text-[#7066a9] shrink-0" />
                            <span className="truncate">waranya.r@hospital-fang.go.th</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <Phone size={16} className="text-[#7066a9] shrink-0" />
                            <span>089-765-4321</span>
                        </div>
                   </div>

                   <Button variant="outline" className="w-full border-[#7066a9] text-[#7066a9] hover:bg-purple-50">
                       แก้ไขข้อมูลส่วนตัว
                   </Button>
               </div>

               {/* 2. Security */}
               <div className="space-y-3">
                   <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">ความปลอดภัย</h3>
                   <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
                       <MenuItem icon={Lock} label="เปลี่ยนรหัสผ่าน" />
                       <MenuItem icon={Smartphone} label="ยืนยันตัวตน 2 ขั้นตอน (2FA)" value="เปิด" color="text-green-600" />
                       <MenuItem icon={Globe} label="บัญชีที่เชื่อมต่อ" value="Google" />
                   </div>
               </div>

               {/* 3. Preferences */}
               <div className="space-y-3">
                   <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">การตั้งค่า</h3>
                   <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
                       <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#7066a9]">
                                   <Bell size={18} />
                               </div>
                               <span className="font-medium text-slate-700">การแจ้งเตือน</span>
                           </div>
                           <Switch id="notify" />
                       </div>
                        <MenuItem icon={Globe} label="ภาษา" value="ไทย" />
                        <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                           <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#7066a9]">
                                   <Moon size={18} />
                               </div>
                               <span className="font-medium text-slate-700">โหมดมืด</span>
                           </div>
                           <Switch id="dark-mode" />
                       </div>
                   </div>
               </div>
               
               {/* 4. History */}
                <div className="space-y-3">
                   <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">ประวัติการใช้งาน</h3>
                   <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
                        <MenuItem icon={History} label="ประวัติการเข้าสู่ระบบ" value="5 นาทีที่แล้ว" />
                   </div>
               </div>

               {/* 5. Support */}
               <div className="space-y-3">
                   <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider ml-1">ความช่วยเหลือ</h3>
                   <div className="bg-white rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
                        <MenuItem icon={HelpCircle} label="ศูนย์ช่วยเหลือ" />
                        <MenuItem icon={FileText} label="นโยบายความเป็นส่วนตัว" />
                   </div>
               </div>

               {/* 6. Danger Zone */}
               <div className="space-y-4 pt-4">
                   <Button variant="outline" className="w-full h-12 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 justify-start px-4 bg-white">
                       <LogOut size={20} className="mr-3" />
                       ออกจากระบบ
                   </Button>

                   <p className="text-center text-sm text-slate-300 font-mono">
                       v1.0.2 (20250107)
                   </p>
               </div>
           </div>
       </div>
    </div>
  )
}

function MenuItem({ icon: Icon, label, value, color = "text-slate-500", onClick }: any) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#7066a9]">
                    <Icon size={18} />
                </div>
                <span className="font-medium text-slate-700">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {value && <span className={`text-sm ${color}`}>{value}</span>}
                <ChevronRight size={18} className="text-slate-300" />
            </div>
        </button>
    )
}
