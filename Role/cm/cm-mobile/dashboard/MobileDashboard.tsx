import React, { useRef, useCallback, useMemo, useState } from 'react';
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
  ChevronDown,
  X
} from 'lucide-react';
import DashboardHeader from '../../../../components/shared/DashboardHeader';
import DashboardTopBar from '../../../../components/shared/DashboardTopBar';
import { PATIENTS_DATA } from '../../../../data/patientData';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import { Badge } from '../../../../components/ui/badge';
import imgDefaultAvatar from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";

export default function MobileDashboard({ onRegisterPatient, onProfileClick, onNotificationClick, onReportNewPatient }: any) {
  const tagScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  const handleTagMouseDown = useCallback((e: React.MouseEvent) => {
    const el = tagScrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
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
    el.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleTagMouseUp = useCallback(() => {
    isDragging.current = false;
    const el = tagScrollRef.current;
    if (el) {
      el.style.cursor = 'grab';
      el.style.userSelect = '';
    }
  }, []);

  const allTags = useMemo(() => {
    const units = PATIENTS_DATA
      .map(p => p.responsibleHealthCenter)
      .filter((v): v is string => !!v && v !== '-');
    return Array.from(new Set(units));
  }, []);

  // Filter patients by selected unit
  const filteredPatientsByUnit = useMemo(() => {
    if (!selectedUnit) return [];
    return PATIENTS_DATA.filter(p => p.responsibleHealthCenter === selectedUnit);
  }, [selectedUnit]);

  // Patient status helper (same as PatientDirectory)
  const getPatientStatusInfo = (patient: any) => {
    const label = patient.patientStatusLabel || 'ปกติ';
    switch (label) {
      case 'ปกติ':
        return { label, bg: 'bg-emerald-400 hover:bg-emerald-500 shadow-emerald-200' };
      case 'Loss follow up':
        return { label, bg: 'bg-orange-400 hover:bg-orange-500 shadow-orange-200' };
      case 'รักษาเสร็จสิ้น':
        return { label, bg: 'bg-blue-400 hover:bg-blue-500 shadow-blue-200' };
      case 'เสียชีวิต':
        return { label, bg: 'bg-red-400 hover:bg-red-500 shadow-red-200' };
      case 'มารดา':
        return { label, bg: 'bg-pink-400 hover:bg-pink-500 shadow-pink-200' };
      default:
        return { label, bg: 'bg-emerald-400 hover:bg-emerald-500 shadow-emerald-200' };
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedUnit(prev => prev === tag ? null : tag);
  };

  const newsItems = [
    {
      id: 'n1',
      category: 'ข่าวสาร',
      title: 'แนวทางการดูแลผู้ป่วยปากแหว่งเพดานโหว่ พ.ศ. 2569',
      description: 'กรมการแพทย์ เผยแพร่แนวปฏิบัติใหม่สำหรับการดูแลผู้ป่วยปากแหว่ง',
      date: '13 ก.พ. 2569',
      color: 'bg-purple-50 border-purple-100',
      badge: 'bg-[#7367f0] text-white',
      icon: '📢',
    },
    {
      id: 'n2',
      category: 'ข่าวสาร',
      title: 'ประชุมวิชาการ ThaiCleft ครั้งที่ 15 เชียงใหม่',
      description: 'ขอเชิญบุคลากรเข้าร่วมประชุมวิชาการประจำปี 12-14 มี.ค. 2569',
      date: '10 ก.พ. 2569',
      color: 'bg-purple-50 border-purple-100',
      badge: 'bg-[#7367f0] text-white',
      icon: '📢',
    },
  ];

  const knowledgeItems = [
    {
      id: 'k1',
      category: 'สื่อความรู้',
      title: 'วิดีโอ: เทคนิคการให้นมทารกปากแหว่ง',
      description: 'สื่อการสอนสำหรับผู้ปกครองในการให้อาหารทารกที่มีภาวะปากแหว่ง',
      date: '10 ก.พ. 2569',
      color: 'bg-emerald-50 border-emerald-100',
      badge: 'bg-[#28c76f] text-white',
      icon: '🎥',
    },
    {
      id: 'k2',
      category: 'สื่อความรู้',
      title: 'คู่มือ: การฝึกพูดสำหรับเด็กเพดานโหว่',
      description: 'แนวทางการฝึกพูดเบื้องต้นที่ผู้ปกครองสามารถทำได้ที่บ้าน',
      date: '5 ก.พ. 2569',
      color: 'bg-emerald-50 border-emerald-100',
      badge: 'bg-[#28c76f] text-white',
      icon: '📖',
    },
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
            <DashboardHeader hospitalName="รพ.สต.บ้านดง" />
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
            <h2 className="text-lg font-bold text-gray-700 mb-2">หน่วยงานที่รับผิดชอบ ({allTags.length} แห่ง)</h2>
            <div 
              ref={tagScrollRef}
              onMouseDown={handleTagMouseDown}
              onMouseMove={handleTagMouseMove}
              onMouseUp={handleTagMouseUp}
              className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2 mb-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
              {allTags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
                    selectedUnit === tag 
                      ? 'bg-[#7367f0] text-white ring-2 ring-[#7367f0]/30' 
                      : idx % 3 === 0 ? 'bg-pink-100 text-pink-700' : 
                        idx % 3 === 1 ? 'bg-orange-100 text-orange-700' : 
                        'bg-blue-100 text-blue-700'
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Patient List for Selected Unit */}
            {selectedUnit && (
              <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-bold text-gray-700">
                    ผู้ป่วยใน {selectedUnit} ({filteredPatientsByUnit.length} ราย)
                  </h3>
                  <button 
                    onClick={() => setSelectedUnit(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {filteredPatientsByUnit.length > 0 ? (
                    filteredPatientsByUnit.map((patient) => {
                      const statusInfo = getPatientStatusInfo(patient);
                      const diagnosisLabel = patient.diagnosisTags?.[0] || patient.medicalCondition || patient.diagnosis || '-';
                      return (
                        <div 
                          key={patient.id}
                          className="bg-white rounded-[16px] p-3 flex items-center justify-between cursor-pointer border border-gray-200 shadow-md transition-all hover:shadow-lg"
                        >
                          <div className="flex items-center gap-3 overflow-hidden flex-1">
                            {/* Avatar */}
                            <div className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden shrink-0 border border-white shadow-sm">
                              <ImageWithFallback 
                                src={patient.image || imgDefaultAvatar} 
                                alt={patient.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Patient Info */}
                            <div className="flex flex-col min-w-0 justify-center flex-1">
                              <p className="font-semibold text-[#3c3c3c] leading-tight truncate text-[20px]">{patient.name}</p>
                              <div className="flex items-center justify-between mt-0.5">
                                <p className="text-[#787878] font-medium truncate text-[16px]">HN: {patient.hn}</p>
                                <Badge className={`text-white border-none gap-1 px-2 py-0.5 text-[10px] rounded-full shadow-sm ${statusInfo.bg}`}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-0.5">
                                <p className="text-[#787878] text-[14px] font-medium truncate flex-1">
                                  {patient.age ? `อายุ ${patient.age.split(' ')[0]} ปี` : ''}
                                </p>
                                <div className="bg-white border border-[#2F80ED] px-2 py-0.5 rounded-full flex items-center justify-center shrink-0 ml-2 text-[rgb(112,102,169)]">
                                  <span className="text-[10px] font-bold text-[rgb(112,102,169)]">{diagnosisLabel}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <User className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-gray-400 text-sm">ไม่พบผู้ป่วยในหน่วยงานนี้</p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                        <span className={`font-bold px-2 py-0.5 rounded-full ${item.badge} text-[14px]`}>{item.category}</span>
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

    </div>
  );
}