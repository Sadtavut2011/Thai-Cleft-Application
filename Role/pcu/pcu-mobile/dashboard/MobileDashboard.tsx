import React, { useState } from 'react';
import { AlertCircle, FileText, Search, Play, Home, Video, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import DashboardTopBar from '../../../../components/shared/DashboardTopBar';

interface DashboardViewProps {
  onRegisterPatient: () => void;
  onNotificationClick?: () => void;
  onEditPatient: (patient: any) => void;
  onDeletePatient: (id: number) => void;
  patients: any[];
}

export default function DashboardView({ onRegisterPatient, onNotificationClick, onEditPatient, onDeletePatient, patients, onProfileClick }: DashboardViewProps & { onProfileClick?: () => void }) {
  // Mock Data
  const [requests, setRequests] = useState([
    { id: 101, patientName: 'นายสมชาย ใจดี', reason: 'ติดตามอาการหลังออกจาก รพ.', requester: 'รพ.แม่ข่าย A', date: '17 ธ.ค. 68', urgent: true, status: 'pending' },
  ]);

  const handleConfirm = (id: number) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'accepted' } : req
    ));
  };

  const newsItems = [
    {
      id: 'n1',
      category: 'ข่าวสาร',
      title: 'แนวทางการดูแลผู้ป่วยปากแหว่งเพดานโหว่ พ.ศ. 2569',
      description: 'กรมการแพทย์ เผยแพร่แนวปฏิบัติใหม่สำหรับการดูแลผู้ป่วย...',
      date: '13 ก.พ. 2569',
      color: 'bg-purple-50 border-purple-100',
      badge: 'bg-[#7367f0] text-white',
    },
    {
      id: 'n2',
      category: 'ข่าวสาร',
      title: 'ประชุมวิชาการ ThaiCleft ครั้งที่ 15 เชียงใหม่',
      description: 'ขอเชิญบุคลากรเข้าร่วมประชุมวิชาการประจำปี 12-14 มี.ค....',
      date: '10 ก.พ. 2569',
      color: 'bg-purple-50 border-purple-100',
      badge: 'bg-[#7367f0] text-white',
    },
  ];

  const knowledgeItems = [
    {
      id: 'k1',
      category: 'สื่อความรู้',
      title: 'วิดีโอ: เทคนิคการให้นมทารกปากแหว่ง',
      description: 'สื่อการสอนสำหรับผู้ปกครองในการให้อาหารทารกที่มีภาวะปา...',
      date: '10 ก.พ. 2569',
      color: 'bg-emerald-50 border-emerald-100',
      badge: 'bg-[#28c76f] text-white',
    },
    {
      id: 'k2',
      category: 'สื่อความรู้',
      title: 'คู่มือ: การฝึกพูดสำหรับเด็กเพดานโหว่',
      description: 'แนวทางการฝึกพูดเบื้องต้นที่ผู้ปกครองสามารถทำได้ที่บ้าน',
      date: '5 ก.พ. 2569',
      color: 'bg-emerald-50 border-emerald-100',
      badge: 'bg-[#28c76f] text-white',
    },
  ];

  return (
    <div className="bg-slate-50 h-full overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <DashboardTopBar onNotificationClick={onNotificationClick} onProfileClick={onProfileClick} />
      <div className="p-4 space-y-6 pt-4">
        {/* Welcome Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <img 
            src="https://images.unsplash.com/photo-1612638059828-c93f8882d376?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwYXNpYW4lMjBoZWFsdGhjYXJlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwODYyNzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="สมศักดิ์"
            className="w-12 h-12 rounded-full object-cover border-2 border-teal-200"
          />
          <div>
            <h2 className="font-bold text-gray-800 text-[20px]">สวัสดี, คุณสมศักดิ์</h2>
            <p className="text-sm text-gray-500">รพ.สต.ริมใต้</p>
          </div>
        </div>
      </div>

      {/* Today's Dashboard */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex justify-between items-end text-[20px]">
          แดชบอร์ดงานของวันนี้
          <span className="text-sm text-gray-500 font-normal text-[16px]">พุธ 7 ม.ค. 69</span>
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center py-4">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Home size={20} />
            </div>
            <span className="text-xs font-bold text-gray-700 text-[14px]">เยี่ยมบ้าน</span>
            <span className="text-lg font-bold text-green-600">5</span>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center py-4">
             <div className="w-10 h-10 bg-[#F6339A]/10 text-[#F6339A] rounded-full flex items-center justify-center">
              <Video size={20} />
            </div>
            <span className="text-xs font-bold text-gray-700 text-[14px]">Tele-med</span>
            <span className="text-lg font-bold text-[#F6339A]">2</span>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center py-4">
             <div className="w-10 h-10 bg-[#2B7FFF]/10 text-[#2B7FFF] rounded-full flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-gray-700 text-[14px]">นัดหมาย</span>
            <span className="text-lg font-bold text-[#2B7FFF]">8</span>
          </div>
        </div>


        <h3 className="text-lg font-bold text-gray-800 mb-3 flex justify-between items-center text-[20px]">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" />
            แจ้งเตือนและสถานะ
          </div>
          <span className="text-sm text-gray-500 font-normal text-[16px]">ดูทั้งหมด</span>
        </h3>
        {requests.map(req => (
          <div key={req.id} className="bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 mb-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">นางสาว มุ่งมั่น ทำดี</h4>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <FileText size={14} /> 66012346
                  </div>
                </div>
              </div>
              <span className="bg-orange-50 text-orange-500 text-xs font-bold px-3 py-1 rounded-lg">Urgent</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4 flex items-center gap-2 text-sm">
              <span className="font-bold text-gray-600">รพ.สต.ริมใต้</span>
              <ArrowRight size={16} className="text-gray-400" />
              <span className="font-bold text-blue-600">รพ.มหาราชนครเชียงใหม่</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                <Clock size={16} />
                <span>4 ธ.ค. 23 10:30</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-bold text-green-600">อนุมัติ</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* การแจ้งเตือนข่าวสาร — CM-mobile pattern */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-bold text-gray-700">การแจ้งเตือนข่าวสาร</h2>
          <span className="text-[#6A5ACD] font-bold text-sm cursor-pointer hover:underline">ดูทั้งหมด</span>
        </div>
        
        <div className="space-y-3 mb-5">
          {newsItems.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl flex items-start gap-3 cursor-pointer hover:shadow-md transition-all border shadow-sm ${item.color}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold px-2 py-0.5 rounded-full ${item.badge} text-[14px]`}>{item.category}</span>
                  <span className="text-[11px] text-gray-400">{item.date}</span>
                </div>
                <p className="font-bold text-gray-800 text-[15px] leading-snug mb-0.5 line-clamp-2">{item.title}</p>
                <p className="text-[13px] text-gray-500 leading-snug line-clamp-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* สื่อความรู้ — CM-mobile pattern */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <h2 className="text-lg font-bold text-gray-700">สื่อความรู้</h2>
          <span className="text-[#6A5ACD] font-bold text-sm cursor-pointer hover:underline">ดูทั้งหมด</span>
        </div>
        
        <div className="space-y-3">
          {knowledgeItems.map((item) => (
            <div key={item.id} className={`p-4 rounded-2xl flex items-start gap-3 cursor-pointer hover:shadow-md transition-all border shadow-sm ${item.color}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold px-2 py-0.5 rounded-full ${item.badge} text-[14px]`}>{item.category}</span>
                  <span className="text-[11px] text-gray-400">{item.date}</span>
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