import React from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Activity, 
  MessageCircle, 
  BookOpen, 
  ChevronRight,
  FileText
} from 'lucide-react';
import DashboardTopBar from '../../../../components/shared/DashboardTopBar';

export default function MobileDashboard({ onRegisterPatient, onViewHealthInfo, onViewKnowledge, onProfileClick, onNotificationClick }: any) {
  return (
    <div className="h-full w-full overflow-y-auto bg-white font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden">
      
      {/* App Header - Sticky */}
      <div className="sticky top-0 z-50">
        <DashboardTopBar onProfileClick={onProfileClick} onNotificationClick={onNotificationClick} />
      </div>

      {/* Header Section (Profile Summary) */}
      <div className="bg-[#7066A9] text-white px-6 pb-8 rounded-b-[30px] shadow-lg relative -mt-1 pt-2">
        {/* Top Bar Content */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-purple-200 text-sm mb-1">ยินดีต้อนรับ</div>
            <h1 className="text-2xl font-bold mb-1">ด.ช.มีบุญ ใจดี</h1>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                HN-6609123
              </span>
              <span className="text-sm opacity-90">2 ปี 6 เดือน</span>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1 text-purple-100 text-xs">
              <Heart size={14} /> HN-6609123
            </div>
            <div className="font-semibold text-white">กำลังฝึกพูด</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1 text-purple-100 text-xs">
              <ShieldCheck size={14} /> สิทธิการรักษา
            </div>
            <div className="font-semibold text-white">บัตรทอง</div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 py-6 space-y-6 pb-24">
        
        {/* Next Appointment */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-[#5B4D9D]" /> นัดหมายถัดไป
            </h2>
            <span className="bg-purple-100 text-[#5B4D9D] text-xs font-bold px-2.5 py-1 rounded-lg">
              อีก 5 วัน
            </span>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-white rounded-xl p-2 min-w-[60px] text-center shadow-sm">
                <div className="text-purple-600 text-xs font-bold">ต.ค.</div>
                <div className="text-[#5B4D9D] text-xl font-black">15</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">ติดตามผลผ่าตัด</h3>
                <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-1">
                  <Clock size={14} /> 09:00 - 10:30
                </div>
                <div className="text-gray-500 text-xs leading-relaxed">
                  อาคารผู้ป่วยนอก ชั้น 2 รพ.มหาราชนครเชียงใหม่
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Menu */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">เมนูด่วน</h2>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={onViewHealthInfo}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-[#5B4D9D]">
                <Activity size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700">ประวัติรักษา</span>
            </button>
            <button className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform">
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                <MessageCircle size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700">แชทกับหมอ</span>
            </button>
            <button 
              onClick={onViewKnowledge}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                <BookOpen size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700">สื่อความรู้</span>
            </button>
          </div>
        </div>

        {/* Notifications & Status */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">แจ้งเตือน & สถานะ</h2>
          <div className="space-y-3">
            {/* Item 1 */}
            <div className="bg-[#F0F4FF] rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-[#E5ECFF] transition-colors">
              <div>
                <h3 className="font-bold text-gray-800 mb-0.5">อนุมัติทุนค่าเดินทาง</h3>
                <p className="text-gray-500 text-xs">รายการขอทุนเมื่อ 01 ก.ย. 68</p>
              </div>
              <div className="bg-[#7066A9] rounded-full p-1.5 text-white">
                <ChevronRight size={20} />
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-[#F6F5FF] rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:bg-[#EEEDFF] transition-colors">
              <div>
                <h3 className="font-bold text-gray-800 mb-0.5">แบบประเมินหลังเยี่ยมบ้าน</h3>
                <p className="text-gray-500 text-xs">กรุณากรอกข้อมูลเพื่อติดตามผล</p>
              </div>
              <div className="bg-[#FFC96F] text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <FileText size={12} /> ทำเลย
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}