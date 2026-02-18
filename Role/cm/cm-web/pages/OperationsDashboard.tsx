import React from "react";
import { 
  Home, 
  Calendar, 
  Briefcase, 
  Video, 
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Ambulance
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  iconColor: string;
}

function StatCard({ title, value, subtitle, icon, trend, trendUp, iconColor }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-full transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: iconColor + '1A' }}>
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            trendUp ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          )}>
            {trendUp ? <TrendingUp size={12} className="mr-1" /> : null}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}

export function OperationsDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-[#5e5873]">ระบบปฎิบัติการ (Operations Dashboard)</h2>
          <p className="text-gray-500">ภาพรวมสถิติการดำเนินงานของระบบต่างๆ</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select defaultValue="january">
            <SelectTrigger className="w-[160px] bg-white border-gray-200 h-[40px]">
              <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-gray-500" />
                 <SelectValue placeholder="เลือกเดือน" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">มกราคม</SelectItem>
              <SelectItem value="february">กุมภาพันธ์</SelectItem>
              <SelectItem value="march">มีนาคม</SelectItem>
              <SelectItem value="april">เมษายน</SelectItem>
              <SelectItem value="may">พฤษภาคม</SelectItem>
              <SelectItem value="june">มิถุนายน</SelectItem>
              <SelectItem value="july">กรกฎาคม</SelectItem>
              <SelectItem value="august">สิงหาคม</SelectItem>
              <SelectItem value="september">กันยายน</SelectItem>
              <SelectItem value="october">ตุลาคม</SelectItem>
              <SelectItem value="november">พฤศจิกายน</SelectItem>
              <SelectItem value="december">ธันวาคม</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="2025">
            <SelectTrigger className="w-[100px] bg-white border-gray-200 h-[40px]">
              <SelectValue placeholder="เลือกปี" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="ระบบเยี่ยมบ้าน" 
          value="124" 
          subtitle="ลงพื้นที่แล้วในเดือนนี้" 
          icon={<Home size={24} />}
          iconColor="#28c76f"
          trend="+12% จากเดือนที่แล้ว"
          trendUp={true}
        />
        <StatCard 
          title="ระบบนัดหมาย" 
          value="45" 
          subtitle="นัดหมายที่กำลังจะมาถึง" 
          icon={<Calendar size={24} />}
          iconColor="#4285f4"
          trend="วันนี้ 8 นัดหมาย"
          trendUp={true}
        />
        <StatCard 
          title="ระบบขอทุน" 
          value="89" 
          subtitle="คำขอทั้งหมด" 
          icon={<Briefcase size={24} />}
          iconColor="#f5a623"
        />
        <StatCard 
          title="Tele-med" 
          value="32" 
          subtitle="ชั่วโมงปรึกษา" 
          icon={<Video size={24} />}
          iconColor="#e91e63"
          trend="+5%"
          trendUp={true}
        />
        <StatCard 
          title="ระบบส่งตัว" 
          value="18" 
          subtitle="เคสส่งตัวเดือนนี้" 
          icon={<Ambulance size={24} />}
          iconColor="#ff6d00"
          trend="In 12 / Out 6"
          trendUp={true}
        />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Fund System Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#5e5873] flex items-center gap-2">
              <Briefcase size={20} className="text-[#28c76f]" />
              สถานะการขอทุน
            </h3>
            <span className="text-xs text-gray-400">ข้อมูลล่าสุด 2 นาทีที่แล้ว</span>
          </div>

          <div className="flex items-center gap-8 mb-6">
             <div className="flex-1 bg-[#28c76f]/10 rounded-xl p-5 border border-[#28c76f]/20 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#28c76f] flex items-center justify-center text-white shadow-lg shadow-[#28c76f]/30">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#28c76f]">65</div>
                  <div className="text-sm text-gray-600">อนุมัติแล้ว</div>
                </div>
             </div>
             
             <div className="flex-1 bg-[#ff9f43]/10 rounded-xl p-5 border border-[#ff9f43]/20 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#ff9f43] flex items-center justify-center text-white shadow-lg shadow-[#ff9f43]/30">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#ff9f43]">24</div>
                  <div className="text-sm text-gray-600">รออนุมัติ</div>
                </div>
             </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">รายการล่าสุด</h4>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                 <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                      {["S", "W", "P"][i-1]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">คำขอทุนการศึกษา #{202300 + i}</div>
                      <div className="text-xs text-gray-400">ยื่นเมื่อ 2 วันที่แล้ว</div>
                    </div>
                 </div>
                 <span className={cn(
                   "text-xs px-2 py-1 rounded-full",
                   i === 2 ? "bg-[#ff9f43]/10 text-[#ff9f43]" : "bg-[#28c76f]/10 text-[#28c76f]"
                 )}>
                   {i === 2 ? "รออนุมัติ" : "อนุมัติแล้ว"}
                 </span>
              </div>
            ))}
            <button className="w-full text-center text-sm text-[#7367f0] mt-2 hover:underline">ดูทั้งหมด</button>
          </div>
        </div>

        {/* Tele-consult Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#5e5873] flex items-center gap-2">
              <Video size={20} className="text-[#ea5455]" />
              Tele-consult Overview
            </h3>
            <span className="text-xs text-gray-400">เดือนนี้</span>
          </div>
          
          <div className="relative h-[200px] w-full flex items-end justify-between px-4 pb-4 border-b border-gray-100">
             {[40, 70, 45, 90, 60, 85, 55].map((h, i) => (
               <div key={i} className="group relative flex flex-col items-center gap-2 w-1/12">
                  <div 
                    className="w-full bg-[#ea5455]/80 rounded-t-sm transition-all group-hover:bg-[#ea5455]" 
                    style={{ height: `${h}%` }}
                  ></div>
                  <span className="text-xs text-gray-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h} mins
                  </div>
               </div>
             ))}
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Users size={18} /></div>
               <div>
                 <div className="text-lg font-bold">12</div>
                 <div className="text-xs text-gray-500">Active Doctors</div>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-50 rounded-lg text-purple-500"><Video size={18} /></div>
               <div>
                 <div className="text-lg font-bold">156</div>
                 <div className="text-xs text-gray-500">Total Sessions</div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}