import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  FileText, 
  MapPin,
  Clock,
  Wifi,
  Battery,
  Signal,
  ChevronDown
} from 'lucide-react';
import DashboardHeader from '../../../../components/shared/DashboardHeader';
import DashboardTopBar from '../../../../components/shared/DashboardTopBar';

export default function MobileDashboard({ onRegisterPatient, onProfileClick, onNotificationClick, onReportNewPatient }: any) {
  const tags = [
    'ต.เวียง (เทศบาลฝาง)', 'ต.แม่สูน', 'ต.แม่ข่า', '1+',
    'ต.แม่งอน', 'ต.แม่ฝาง', 'ต.ม่อนปิ่น', 'ต.โป่งน้ำร้อน'
  ];

  const appointments = [
    {
      type: 'Tele-consult',
      name: 'นางรัตนา วิมารหนาม',
      details: 'อายุ 34 ปี, ต.เวียง (เทศบาลฝาง)',
      date: 'จันทร์, 8 ก.ย.',
      time: '12:00-12:30',
      color: 'bg-purple-50'
    },
    {
      type: 'งานเยี่ยมบ้าน',
      name: 'กาณิศา รัตนเศรษฐา',
      details: 'อายุ 34 ปี, ต.เวียง (เทศบาลฝาง)',
      date: 'จันทร์, 8 ก.ย.',
      time: '16:00-18:30',
      color: 'bg-purple-50'
    }
  ];

  return (
    <div className="relative w-full h-full bg-[#f8f9fa]">
      
      {/* -------------------------------------------
          LAYER 1: HEADER & STATS (Fixed/Absolute relative to container)
          - Starts below the App Header
          - Z-Index: 0
      -------------------------------------------- */}
      <div className="absolute top-0 left-0 w-full z-0">
         {/* Purple background container to match header if needed, or let Frame1 handle it */}
         <div className="w-full">
            <DashboardHeader />
         </div>
      </div>


      {/* -------------------------------------------
          LAYER 2: SCROLLABLE CONTENT (White Card)
          - Z-Index: 10 (Scrolls over the stats)
          - Use absolute inset with overflow-y-auto to create the scroll area
      -------------------------------------------- */}
      <div className="absolute inset-0 z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="sticky top-0 z-50">
           <DashboardTopBar onProfileClick={onProfileClick} onNotificationClick={onNotificationClick} />
        </div>
        {/* Margin top to reveal the stats initially */}
        <div className="mt-[196px] w-full bg-white rounded-t-[30px] min-h-screen shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          
          {/* Scrollable Content Body - Compact Mode */}
          <div className="p-4 pb-24">
            
            {/* Notification Banner */}
            <div 
              onClick={onReportNewPatient}
              className="bg-[#FFD8B8] rounded-2xl p-3 flex items-center justify-between mb-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2.5 rounded-full shadow-sm">
                  <div className="font-bold text-xl text-[#F99C38] w-6 h-6 flex items-center justify-center">?</div>
                </div>
                <div>
                  <div className="font-bold text-gray-800">ค้นพบผู้ป่วยใหม่</div>
                  <div className="text-gray-700 text-sm">ตรวจสอบข้อมูลผู้ป่วยใหม่</div>
                </div>
              </div>
              <div className="bg-[#FCA564] p-1.5 rounded-full text-white">
                 <ChevronRight size={20} />
              </div>
            </div>

            {/* Search Section */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-700">ค้นหาข้อมูลผู้ป่วย</h2>
              <button 
                  onClick={onRegisterPatient}
                  className="bg-[#6A5ACD] text-white text-sm px-3 py-1.5 rounded-lg flex items-center shadow-md hover:bg-[#584ab5] transition"
              >
                <Plus size={16} className="mr-1" /> เพิ่มผู้ป่วยใหม่
              </button>
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

            {/* Area Tags */}
            <h2 className="text-lg font-bold text-gray-700 mb-2">พื้นที่ในการดูแล (8 เขต)</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    tag === '1+' ? 'bg-gray-100 text-gray-500' :
                    idx % 3 === 0 ? 'bg-pink-100 text-pink-700' : 
                    idx % 3 === 1 ? 'bg-orange-100 text-orange-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Upcoming Appointments */}
            <div className="flex justify-between items-end mb-2">
               <h2 className="text-lg font-bold text-gray-700">นัดหมายที่กำลังจะถึง (2)</h2>
               <span className="text-[#6A5ACD] font-bold text-sm">วันนี้</span>
            </div>
            
            <div className="space-y-3">
              {appointments.map((appt, idx) => (
                <div key={idx} className={`${appt.color} p-3 rounded-2xl flex justify-between items-center relative overflow-hidden`}>
                  <div className="z-10 w-full">
                    <div className="text-[#6A5ACD] text-sm font-semibold mb-1">{appt.date} • {appt.time}</div>
                    <div className="text-gray-800 font-bold text-lg">{appt.type}</div>
                    <div className="text-gray-900 font-medium text-base mb-1">{appt.name}</div>
                    <div className="text-gray-500 text-xs mb-3">{appt.details}</div>
                    
                    <div className="flex space-x-2">
                      <button className="bg-white/80 backdrop-blur text-[#5B4D9D] text-xs px-3 py-1.5 rounded-lg font-bold flex items-center shadow-sm">
                        <Plus size={12} className="mr-1" /> เพิ่ม
                      </button>
                      <button className="bg-[#FFC96F] text-yellow-900 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center shadow-sm">
                        <FileText size={12} className="mr-1" /> ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                  
                  {/* Right Arrow Circle */}
                  <div className="bg-[#6A5ACD] p-2 rounded-full text-white shadow-lg shrink-0 z-10">
                     <ChevronRight size={20} />
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
