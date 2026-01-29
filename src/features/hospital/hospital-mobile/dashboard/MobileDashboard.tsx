import React from 'react';
import { 
  Calendar, 
  ArrowRight,
  LayoutGrid,
  Users,
  ClipboardList,
  MessageCircle,
  RefreshCw,
  FileText
} from 'lucide-react';
import DashboardTopBar from '../../../../components/shared/DashboardTopBar';
import { StatusBarIPhone16Main } from '../../../../components/shared/layout/TopHeader';
import imgAvatar from "figma:asset/8a9466548174483751717904d603a1103c830849.png";

export default function MobileDashboard({ onRegisterPatient, onProfileClick, onNotificationClick, onReportNewPatient }: any) {
  
  return (
    <div className="relative w-full h-full bg-white">
      
      {/* Scrollable Content */}
      <div className="absolute inset-0 z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 shadow-sm">
           <div className="bg-[#7066A9]">
             <StatusBarIPhone16Main />
           </div>
           <DashboardTopBar onProfileClick={onProfileClick} onNotificationClick={onNotificationClick} />
        </div>
        
        {/* Content Body */}
        <div className="p-4 pb-24 flex flex-col gap-6 mt-2">
          
          {/* 1. Appointment Card (Blue Gradient) */}
          <div className="bg-[#7066A9] rounded-[24px] p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
             {/* Background decoration elements */}
             <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
             <div className="absolute right-[20px] bottom-[-40px] w-40 h-40 bg-indigo-400 opacity-20 rounded-full blur-3xl"></div>

             {/* Header Line */}
             <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-sm md:text-base text-indigo-50">ข้อมูลเจ้าหน้าที่</span>
             </div>

             {/* Name and Role */}
             <div className="mb-6 relative z-10">
                <div className="text-2xl font-bold leading-tight mb-1">พญ. วรัญญา รักษา</div>
                <div className="text-white/80 text-sm font-medium">
                   แพทย์เวชปฏิบัติทั่วไป (GP)
                </div>
                <div className="flex items-center gap-2 mt-2">
                   <div className="px-2 py-0.5 bg-green-400/30 text-green-50 border border-green-400/40 rounded text-[10px] font-medium">
                      กำลังปฏิบัติงาน
                   </div>
                   <div className="text-xs text-indigo-100 opacity-80">ID: DOC-2567001</div>
                </div>
             </div>

             {/* Stats Row */}
             <div className="grid grid-cols-2 gap-4 mb-5 relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                   <div className="text-indigo-100 text-xs mb-1">งานวันนี้</div>
                   <div className="text-xl font-bold">12 <span className="text-xs font-normal text-indigo-100">งาน</span></div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                   <div className="text-indigo-100 text-xs mb-1">เคสที่ดูแลทั้งหมด</div>
                   <div className="text-xl font-bold">45 <span className="text-xs font-normal text-indigo-100">เคส</span></div>
                </div>
             </div>

             {/* Action Button */}
             <button className="w-full bg-white text-[#7066A9] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors relative z-10 shadow-sm">
                จัดการข้อมูลส่วนตัว
                <ArrowRight className="w-4 h-4" />
             </button>
          </div>

          {/* 2. Main Menu (Grid) */}
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2 text-slate-800 font-bold text-lg px-1">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
                เมนูหลัก
             </div>
             
             <div className="grid grid-cols-4 gap-3">
                {/* Menu Item 1: Record */}
                <button className="flex flex-col items-center gap-2 group">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:shadow-md transition-all group-active:scale-95 hover:border-blue-200">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                         <FileText className="w-5 h-5" />
                      </div>
                   </div>
                   <span className="text-xs font-medium text-slate-600 text-center leading-tight group-hover:text-blue-600 transition-colors">บันทึก<br/>การรักษา</span>
                </button>

                {/* Menu Item 2: Patient List */}
                <button 
                  onClick={onReportNewPatient} // Using existing prop for demo interaction
                  className="flex flex-col items-center gap-2 group"
                >
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:shadow-md transition-all group-active:scale-95 hover:border-green-200">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                         <Users className="w-5 h-5" />
                      </div>
                   </div>
                   <span className="text-xs font-medium text-slate-600 text-center leading-tight group-hover:text-green-600 transition-colors">รายชื่อ<br/>คนไข้ส่งตัว</span>
                </button>

                {/* Menu Item 3: Appointment */}
                <button className="flex flex-col items-center gap-2 group">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:shadow-md transition-all group-active:scale-95 hover:border-purple-200">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                         <Calendar className="w-5 h-5" />
                      </div>
                   </div>
                   <span className="text-xs font-medium text-slate-600 text-center leading-tight group-hover:text-purple-600 transition-colors">จอง<br/>นัดหมาย</span>
                </button>

                {/* Menu Item 4: Chat */}
                <button className="flex flex-col items-center gap-2 group">
                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:shadow-md transition-all group-active:scale-95 hover:border-orange-200">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                         <MessageCircle className="w-5 h-5" />
                      </div>
                   </div>
                   <span className="text-xs font-medium text-slate-600 text-center leading-tight group-hover:text-orange-600 transition-colors">แชท<br/>ทีมแพทย์</span>
                </button>
             </div>
          </div>

          {/* 3. Pending Tasks */}
          <div className="flex flex-col gap-3">
             <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                   <ClipboardList className="w-5 h-5 text-blue-600" />
                   แจ้งเตือน & สถานะ
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline bg-blue-50 px-3 py-1 rounded-full">ดูทั้งหมด</button>
             </div>

             {/* Card Item 1 */}
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                   <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-100">
                      <img src={imgAvatar} alt="Patient" className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                         <h3 className="font-bold text-slate-800 text-base truncate pr-2">คุณวิภาวรรณ ใจดี</h3>
                         <span className="shrink-0 bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-md border border-yellow-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                            เร่งด่วน
                         </span>
                      </div>
                      <div className="text-slate-500 text-sm mt-1 truncate flex items-center gap-2">
                         <span className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600">HN: 65-02-00432</span>
                         <span>• Ward 4 ห้อง 402</span>
                      </div>
                   </div>
                </div>

                {/* Action Bar */}
                <button className="w-full bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-colors rounded-xl py-3 px-3 flex items-center justify-center gap-2 text-blue-600 text-sm font-bold border border-blue-100 group">
                   <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                   อัปเดตแผนการรักษา (Treatment Plan)
                </button>
             </div>
             
             {/* Card Item 2 (Placeholder) */}
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                   <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Users size={24} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                         <h3 className="font-bold text-slate-800 text-base truncate pr-2">นายสมศักดิ์ รักดี</h3>
                      </div>
                      <div className="text-slate-500 text-sm mt-1 truncate flex items-center gap-2">
                         <span className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600">HN: 65-08-00112</span>
                         <span>• Ward 2 ห้อง 205</span>
                      </div>
                   </div>
                </div>

                <button className="w-full bg-white hover:bg-slate-50 transition-colors rounded-xl py-3 px-3 flex items-center justify-center gap-2 text-slate-600 text-sm font-medium border border-slate-200">
                   <FileText className="w-4 h-4" />
                   สรุปผลการตรวจ (Diagnosis)
                </button>
             </div>

          </div>
          
          {/* Spacer for bottom nav */}
          <div className="h-20"></div>

        </div>
      </div>

    </div>
  );
}
