import React, { useRef, useCallback } from 'react';
import { 
  Search, 
  ChevronRight, 
  User,
  Heart,
  Briefcase
} from 'lucide-react';
import DashboardTopBar from '../../../../components/shared/DashboardTopBar';
import { StatusBarIPhone16Main } from '../../../../components/shared/layout/TopHeader';
import imgFrame36 from "figma:asset/d2e5b3611c651e5539da38843ee22972bf9fa81f.png";
import imgImage2 from "figma:asset/59a7cc50d1086cde4a964d74ca0097bd1d33ca70.png";

export default function MobileDashboard({ onRegisterPatient, onProfileClick, onNotificationClick, onReportNewPatient }: any) {
  const tagScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleTagMouseDown = useCallback((e: React.MouseEvent) => {
    const el = tagScrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  }, []);

  const handleTagMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const el = tagScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const handleTagMouseUp = useCallback(() => {
    isDragging.current = false;
    const el = tagScrollRef.current;
    if (el) {
      el.style.cursor = 'grab';
      el.style.userSelect = '';
    }
  }, []);

  const allTags = [
    'แผนกศัลยกรรม', 'แผนก ENT', 'แผนกทันตกรรม', 'แผนกกายภาพ',
    'แผนกจิตเวช', 'แผนกโภชนาการ', 'แผนกเวชกรรม', 'แผนกฟื้นฟู'
  ];

  const newsItems = [
    {
      id: 'n1',
      category: 'ข่าวสาร',
      title: 'อัปเดตแนวทางผ่าตัดซ่อมเพดานปากมาตรฐานใหม่ 2569',
      description: 'ราชวิทยาลัยศัลยแพทย์ เผยแพร่ CPG ฉบับปรับปรุงล่าสุด',
      date: '13 ก.พ. 2569',
      color: 'bg-purple-50 border-purple-100',
      badge: 'bg-[#7367f0] text-white',
      icon: '📢',
    },
    {
      id: 'n2',
      category: 'ข่าวสาร',
      title: 'ประกาศตารางห้องผ่าตัด Cleft เดือน มี.ค. 2569',
      description: 'แผนกศัลยกรรม กำหนดตารางผ่าตัดเดือนมีนาคม พร้อมรายชื่อผู้ป่วย',
      date: '11 ก.พ. 2569',
      color: 'bg-purple-50 border-purple-100',
      badge: 'bg-[#7367f0] text-white',
      icon: '📢',
    },
  ];

  const knowledgeItems = [
    {
      id: 'k1',
      category: 'สื่อความรู้',
      title: 'E-Learning: การดูแลหลังผ่าตัดปากแหว่งเพดานโหว่',
      description: 'หลักสูตรออนไลน์สำหรับบุคลากรทางการแพทย์ 6 ชั่วโมง CME',
      date: '11 ก.พ. 2569',
      color: 'bg-emerald-50 border-emerald-100',
      badge: 'bg-[#28c76f] text-white',
      icon: '🎓',
    },
    {
      id: 'k2',
      category: 'สื่อความรู้',
      title: 'วิดีโอ: เทคนิค Nasoalveolar Molding (NAM)',
      description: 'สื่อการสอนสำหรับทันตแพทย์ เทคนิค NAM ก่อนผ่าตัด',
      date: '8 ก.พ. 2569',
      color: 'bg-emerald-50 border-emerald-100',
      badge: 'bg-[#28c76f] text-white',
      icon: '🎥',
    },
  ];



  return (
    <div className="relative w-full h-full bg-[#f8f9fa]">
      
      {/* LAYER 1: HEADER - Staff Profile (Fixed behind scrollable content) */}
      <div className="absolute top-0 left-0 w-full z-0">
        <div className="w-full">
          <HospitalStaffHeader />
        </div>
      </div>

      {/* LAYER 2: SCROLLABLE CONTENT (White Card) */}
      <div className="absolute inset-0 z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="sticky top-0 z-50">
           <div className="bg-[#7066A9]">
             <StatusBarIPhone16Main />
           </div>
           <DashboardTopBar onProfileClick={onProfileClick} onNotificationClick={onNotificationClick} />
        </div>
        {/* Margin top to reveal the staff profile initially */}
        <div className="mt-[180px] w-full bg-white rounded-t-[30px] min-h-screen shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          
          {/* Scrollable Content Body */}
          <div className="p-4 pb-24">
            
            {/* Notification Banner */}
            

            {/* Search Section */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-700">ค้นหาข้อมูลผู้ป่วย</h2>
            </div>

            <div className="relative mb-3">
               <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-purple-400" />
               </div>
              <input 
                type="text" 
                placeholder="ค้นหาระบุ HN หรือรายชื่อผู้ป่วย" 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6A5ACD] bg-white text-gray-600 shadow-sm"
              />
            </div>

            <button className="w-full bg-[#5B4D9D] text-white py-2.5 rounded-xl font-bold shadow-lg mb-4 hover:bg-[#4a3e85] transition">
              ค้นหา
            </button>

            {/* Department Tags */}
            <h2 className="text-lg font-bold text-gray-700 mb-2">แผนกที่รับผิดชอบ ({allTags.length} แผนก)</h2>
            <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2 mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" ref={tagScrollRef} onMouseDown={handleTagMouseDown} onMouseMove={handleTagMouseMove} onMouseUp={handleTagMouseUp}>
              {allTags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                    idx % 3 === 0 ? 'bg-pink-100 text-pink-700' : 
                    idx % 3 === 1 ? 'bg-orange-100 text-orange-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* News Notifications */}
            <div className="flex justify-between items-end mb-3">
               <h2 className="text-lg font-bold text-gray-700">การแจ้งเตือนข่าวสาร</h2>
               <span className="text-[#6A5ACD] font-bold text-sm cursor-pointer hover:underline">ดูทั้งหมด</span>
            </div>
            
            <div className="space-y-3 mb-5">
              {newsItems.map((item) => (
                <div key={item.id} className={`p-4 rounded-2xl flex items-start gap-3 cursor-pointer hover:shadow-md transition-all border shadow-sm ${item.color}`}>
                  
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badge}`}>{item.category}</span>
                        <span className="text-[11px] text-gray-400">{item.date}</span>
                      </div>
                      <p className="font-bold text-gray-800 text-[15px] leading-snug mb-0.5 line-clamp-2">{item.title}</p>
                      <p className="text-[13px] text-gray-500 leading-snug line-clamp-1">{item.description}</p>
                  </div>
                  
                </div>
              ))}
            </div>

            {/* Knowledge Media */}
            <div className="flex justify-between items-end mb-3">
               <h2 className="text-lg font-bold text-gray-700">สื่อความรู้</h2>
               <span className="text-[#6A5ACD] font-bold text-sm cursor-pointer hover:underline">ดูทั้งหมด</span>
            </div>
            
            <div className="space-y-3">
              {knowledgeItems.map((item) => (
                <div key={item.id} className={`p-4 rounded-2xl flex items-start gap-3 cursor-pointer hover:shadow-md transition-all border shadow-sm ${item.color}`}>
                  
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badge}`}>{item.category}</span>
                        <span className="text-[11px] text-gray-400">{item.date}</span>
                      </div>
                      <p className="font-bold text-gray-800 text-[15px] leading-snug mb-0.5 line-clamp-2">{item.title}</p>
                      <p className="text-[13px] text-gray-500 leading-snug line-clamp-1">{item.description}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#28c76f] flex items-center justify-center text-white shadow-sm shrink-0 mt-2">
                      <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

/* ─── Hospital Staff Profile Header ─── */
function HospitalStaffHeader() {
  return (
    <div className="relative w-full min-h-[300px] overflow-hidden rounded-b-[30px]">
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <img alt="" className="absolute max-w-none object-cover w-full h-full" src={imgFrame36} />
        <div className="absolute bg-[rgba(112,102,169,0.4)] inset-0 mix-blend-multiply" />
      </div>

      {/* Content — pt-[115px] clears the sticky StatusBar+TopBar (~108px) */}
      <div className="size-full relative z-10">
        <div className="flex flex-col px-4 pt-[115px] pb-4 h-full">
          {/* Staff Profile Card */}
          <div className="bg-[#8B7FC7]/60 backdrop-blur-sm rounded-[22px] p-3.5 border border-white/15">
            {/* Welcome + Name */}
            <p className="text-indigo-100 text-sm font-medium mb-0.5">ยินดีต้อนรับ</p>
            <h2 className="text-white text-[22px] font-bold leading-tight mb-1 font-['IBM_Plex_Sans_Thai']">
              พว. วรัญญา รักษา
            </h2>
            {/* Role Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-400/30 text-green-50 border border-green-400/40 rounded-md px-2 py-0.5 text-[11px] font-medium">
                กำลังปฏิบัติงาน
              </span>
              <span className="text-indigo-100 text-xs opacity-80">พยาบาลวิชาชีพ (RN)</span>
            </div>

            {/* Two Info Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Heart size={13} className="text-pink-200" />
                  <span className="text-indigo-100 text-[11px]">เคสที่ดูแลทั้งหมด</span>
                </div>
                <p className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai']">
                  45 <span className="text-xs font-normal text-indigo-100">เคส</span>
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <Briefcase size={13} className="text-yellow-200" />
                  <span className="text-indigo-100 text-[11px]">งานของฉันวันนี้</span>
                </div>
                <p className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai']">
                  12 <span className="text-xs font-normal text-indigo-100">งาน</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}