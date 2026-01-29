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

  return (
    <div className="bg-slate-50 h-full overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <DashboardTopBar onNotificationClick={onNotificationClick} onProfileClick={onProfileClick} />
      <div className="p-4 space-y-6 pt-4">
        {/* Welcome Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">จนท.</div>
          <div>
            <h2 className="font-bold text-gray-800">สวัสดี, คุณสมศักดิ์</h2>
            <p className="text-sm text-gray-500">รพ.สต. บ้านแม่กา</p>
          </div>
        </div>
      </div>

      {/* Today's Dashboard */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex justify-between items-end">
          แดชบอร์ดงานของวันนี้
          <span className="text-sm text-gray-500 font-normal">พุธ 7 ม.ค. 69</span>
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center py-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Home size={20} />
            </div>
            <span className="text-xs font-bold text-gray-700">เยี่ยมบ้าน</span>
            <span className="text-lg font-bold text-blue-600">5</span>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center py-4">
             <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Video size={20} />
            </div>
            <span className="text-xs font-bold text-gray-700">Tele-consult</span>
            <span className="text-lg font-bold text-purple-600">2</span>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 text-center py-4">
             <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Calendar size={20} />
            </div>
            <span className="text-xs font-bold text-gray-700">นัดหมาย</span>
            <span className="text-lg font-bold text-green-600">8</span>
          </div>
        </div>


        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle size={20} className="text-orange-500" />
          แจ้งเตือนและสถานะ
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
              <span className="font-bold text-gray-600">รพ.สต.บ้านแม่กา</span>
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

      {/* TOR 4: สื่อการเรียนรู้ / ข่าวสาร */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">ข่าวสารและประกาศ</h3>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
          <FileText className="text-blue-600 shrink-0" />
          <div>
            <h4 className="font-bold text-blue-900 text-sm">แนวทางดูแลผู้ป่วยเบาหวานฉบับใหม่</h4>
            <p className="text-xs text-blue-700 mt-1">อัปเดตเมื่อ 15 ธ.ค. 68 - กดเพื่ออ่านเพิ่มเติม</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}