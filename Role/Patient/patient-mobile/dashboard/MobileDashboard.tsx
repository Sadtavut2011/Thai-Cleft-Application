import React, { useRef, useCallback } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Activity, 
  MessageCircle, 
  BookOpen, 
  ChevronRight,
  FileText,
  ClipboardList,
  Stethoscope
} from 'lucide-react';
import DashboardTopBar from '../../../../components/shared/DashboardTopBar';

/* ── Horizontal drag-to-scroll hook ── */
function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    state.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    el.style.cursor = 'grabbing';
  }, []);

  const onMouseLeave = useCallback(() => {
    state.current.isDown = false;
    if (ref.current) ref.current.style.cursor = 'grab';
  }, []);

  const onMouseUp = useCallback(() => {
    state.current.isDown = false;
    if (ref.current) ref.current.style.cursor = 'grab';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!state.current.isDown) return;
    e.preventDefault();
    const el = ref.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - state.current.startX) * 1.5;
    el.scrollLeft = state.current.scrollLeft - walk;
  }, []);

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
}

export default function MobileDashboard({ onRegisterPatient, onViewHealthInfo, onViewKnowledge, onViewCarePlan, onProfileClick, onNotificationClick }: any) {
  const dragScroll = useDragScroll();

  return (
    <div className="h-full w-full overflow-y-auto bg-white font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden">
      
      {/* App Header - Sticky */}
      <div className="sticky top-0 z-50">
        <DashboardTopBar onProfileClick={onProfileClick} onNotificationClick={onNotificationClick} />
      </div>

      {/* Header Section (Profile Summary) — ข้อมูลจาก mock: เด็กชายสมชาย ใจดี */}
      <div className="bg-[#7066A9] text-white px-6 pb-8 rounded-b-[30px] shadow-lg relative -mt-1 pt-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-purple-200 text-sm mb-1">ยินดีต้อนรับ</div>
            <h1 className="text-2xl font-bold mb-1">ด.ช.สมชาย ใจดี</h1>
            <div className="flex items-center gap-3">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                HN: 64001234
              </span>
              <span className="text-sm opacity-90">2 ปี 3 เดือน</span>
            </div>
          </div>
        </div>

        {/* Status Cards — ข้อมูลจาก mock */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1 text-purple-100 text-xs">
              <Stethoscope size={14} /> การวินิจฉัย
            </div>
            <div className="font-semibold text-white text-sm">Cleft Lip and Palate</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1 text-purple-100 text-xs">
              <ShieldCheck size={14} /> สิทธิการรักษา
            </div>
            <div className="font-semibold text-white text-sm">บัตรทอง (UC)</div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 py-6 space-y-6 pb-24">
        
        {/* Next Appointment — ข้อมูลจาก mock APP-006 ปรับเป็นนัดถัดไป */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-[#5B4D9D]" /> นัดหมายถัดไป
            </h2>
            <span className="bg-purple-100 text-[#5B4D9D] text-xs font-bold px-2.5 py-1 rounded-lg">
              อีก 36 วัน
            </span>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-white rounded-xl p-2 min-w-[60px] text-center shadow-sm">
                <div className="text-purple-600 text-xs font-bold">มี.ค.</div>
                <div className="text-[#5B4D9D] text-xl font-black">20</div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">ติดตามอาการ</h3>
                <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-1">
                  <Clock size={14} /> 09:00 - 10:30
                </div>
                <div className="text-gray-500 text-xs leading-relaxed">
                  รพ.มหาราชนครเชียงใหม่, อาคารผู้ป่วยนอก
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  แพทย์: นพ.วิชัย เกียรติเกรียงไกร
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Menu — drag to scroll horizontally */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">เมนูด่วน</h2>
          <div
            ref={dragScroll.ref}
            onMouseDown={dragScroll.onMouseDown}
            onMouseLeave={dragScroll.onMouseLeave}
            onMouseUp={dragScroll.onMouseUp}
            onMouseMove={dragScroll.onMouseMove}
            className="flex gap-3 overflow-x-auto cursor-grab select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <button 
              onClick={onViewHealthInfo}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform min-w-[100px] shrink-0"
            >
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-[#5B4D9D]">
                <Activity size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">ประวัติการรักษา</span>
            </button>
            <button className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform min-w-[100px] shrink-0">
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600">
                <MessageCircle size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">แชทกับหมอ</span>
            </button>
            <button 
              onClick={onViewKnowledge}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform min-w-[100px] shrink-0"
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                <BookOpen size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">สื่อความรู้</span>
            </button>
            <button 
              onClick={onViewCarePlan}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform min-w-[100px] shrink-0"
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <ClipboardList size={24} />
              </div>
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">แผนการรักษา</span>
            </button>
          </div>
        </div>

        {/* Treatment Progress — ข้อมูลจาก mock treatment_plan */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Heart size={20} className="text-[#5B4D9D]" /> ความคืบหน้าการรักษา
          </h2>
          <div className="space-y-2.5">
            {[
              { task: 'ผ่าตัดเย็บปากแหว่ง', status: 'เสร็จสิ้น', color: 'bg-green-100 text-green-700' },
              { task: 'ผ่าตัดเย็บเพดานโหว่', status: 'เสร็จสิ้น', color: 'bg-green-100 text-green-700' },
              { task: 'ฝึกพูด (Speech Therapy)', status: 'เสร็จสิ้น', color: 'bg-green-100 text-green-700' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
                <span className="text-sm text-gray-700 font-medium">{item.task}</span>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Status */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">แจ้งเตือนข่าวสาร</h2>
          <div className="space-y-3">
            {[
              {
                id: 1,
                date: '13 ก.พ. 2569',
                title: 'เปิดรับสมัครกองทุนช่วยเหลือค่ารักษา ปี 2569',
                description: 'มูลนิธิตะวันยิ้ม เปิดรับคำขอทุนค่าผ่าตัดและฟื้นฟู...',
              },
              {
                id: 2,
                date: '10 ก.พ. 2569',
                title: 'กองทุนค่าเดินทาง-ที่พัก สำหรับผู้ป่วยต่างจังหวัด',
                description: 'สนับสนุนค่าเดินทางและที่พักสำหรับครอบครัวผู้ป่วย...',
              },
              {
                id: 3,
                date: '5 ก.พ. 2569',
                title: 'ทุนสงเคราะห์ครอบครัวผู้มีรายได้น้อย รอบ 2/2569',
                description: 'กรมพัฒนาสังคมฯ เปิดรับคำขอทุนสงเคราะห์ครอบครัว...',
              },
              {
                id: 4,
                date: '1 ก.พ. 2569',
                title: 'โครงการอุปกรณ์ช่วยฝึกพูดฟรี สำหรับเด็กปากแหว่ง',
                description: 'มูลนิธิสร้างรอยยิ้ม แจกอุปกรณ์ฝึกพูดสำหรับเด็ก...',
              },
            ].map((item) => (
              <div key={item.id} className="p-4 rounded-2xl flex items-start gap-3 cursor-pointer hover:shadow-md transition-all bg-[#F0EDF9] border border-[#E0DAF0] shadow-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold px-3 py-0.5 rounded-full bg-[#7066A9] text-white text-[13px]">ข่าวสาร</span>
                    <span className="text-[12px] text-gray-400">{item.date}</span>
                  </div>
                  <p className="font-bold text-gray-800 text-[15px] leading-snug mb-0.5 line-clamp-2">{item.title}</p>
                  <p className="text-[13px] text-gray-500 leading-snug line-clamp-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}