import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  FileText, 
  User,
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
                  <div className="font-bold text-gray-800 text-[18px]">ค้นพบผู้ป่วยใหม่</div>
                  <div className="text-gray-700 text-sm text-[16px]">ตรวจสอบข้อมูลผู้ป่วยใหม่</div>
                </div>
              </div>
              <div className="bg-[#FCA564] p-1.5 rounded-full text-white">
                 <ChevronRight size={20} />
              </div>
            </div>

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

            <button 
              className="w-full bg-[#5B4D9D] text-white py-2.5 rounded-xl font-bold shadow-lg mb-4 hover:bg-[#4a3e85] transition"
              style={{ backgroundColor: '#5B4D9D', color: 'white' }}
            >
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
                <div key={idx} className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm">
                  <div className="flex flex-col gap-1">
                      <span className="font-bold text-gray-800 text-[18px]">{appt.type} ({appt.time.split('-')[0]} น.)</span>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                          <User size={14} className="text-blue-500 mt-1 shrink-0" />
                          <div className="flex flex-col">
                              <span className="font-medium text-[16px] text-[15px]">{appt.name}</span>
                              <span className="text-gray-500 text-[14px]">{appt.details}</span>
                          </div>
                      </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm shrink-0">
                      <ChevronRight size={18} />
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
