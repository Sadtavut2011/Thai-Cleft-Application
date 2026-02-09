import { useState } from "react";
import { 
  Users, 
  Activity, 
  UserPlus, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldAlert,
  Server,
  Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import AdminWebLayout from '../layout/AdminWebLayout';
import { UserManagementSystem } from "../UserSystems/UserManagementSystem";
import { HospitalInfoManager } from "../UserSystems/HospitalInfoSystem";
import { FundingManagement } from "../Funding/FundingManagement";
import { SystemConfiguration } from "../Treatmentplan/SystemConfiguration";
import { ContentManagement } from "../content/ContentManagement";
import { SmartFormBuilder } from "../FormsSystems/SmartFormBuilder";

// Mock Data for Charts
const loginActivityData = Array.from({ length: 30 }, (_, i) => ({
  date: `วันที่ ${i + 1}`,
  staff: Math.floor(Math.random() * 50) + 20,
  patient: Math.floor(Math.random() * 30) + 10,
}));

const dataGrowthData = [
  { name: 'ม.ค.', treatments: 120, referrals: 45 },
  { name: 'ก.พ.', treatments: 150, referrals: 52 },
  { name: 'มี.ค.', treatments: 200, referrals: 48 },
  { name: 'เม.ย.', treatments: 280, referrals: 60 },
  { name: 'พ.ค.', treatments: 350, referrals: 75 },
  { name: 'มิ.ย.', treatments: 420, referrals: 85 },
];

const systemLogs = [
  { id: 1, action: "เข้าสู่ระบบสำเร็จ", user: "Admin User", time: "2 นาทีที่แล้ว", status: "Success" },
  { id: 2, action: "อัปเดตข้อมูลหลัก (Master Data)", user: "เจ้าหน้าที่ SCFC", time: "15 นาทีที่แล้ว", status: "Success" },
  { id: 3, action: "คำขอลงทะเบียนใหม่", user: "นพ. สมชาย", time: "1 ชั่วโมงที่แล้ว", status: "Pending" },
  { id: 4, action: "สำรองข้อมูลระบบอัตโนมัติ", user: "ระบบ", time: "3 ชั่วโมงที่แล้ว", status: "Success" },
  { id: 5, action: "พยายามเข้าสู่ระบบผิดพลาด", user: "ไม่ทราบ IP", time: "5 ชั่วโมงที่แล้ว", status: "Warning" },
];

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    if (activePage === "hospital_info") {
      return (
        <div className="animate-in fade-in duration-300">
          <HospitalInfoManager />
        </div>
      );
    }

    if (activePage === "funding_management") {
      return (
        <div className="animate-in fade-in duration-300">
          <FundingManagement />
        </div>
      );
    }

    if (activePage === "system_config") {
      return (
        <div className="animate-in fade-in duration-300">
          <SystemConfiguration />
        </div>
      );
    }

    if (activePage === "content_management") {
      return (
        <div className="animate-in fade-in duration-300">
          <ContentManagement />
        </div>
      );
    }

    if (activePage === "form_builder") {
      return (
        <div className="animate-in fade-in duration-300">
          <SmartFormBuilder />
        </div>
      );
    }

    if (activePage === "user_management") {
      return (
        <div className="animate-in fade-in duration-300">
          <UserManagementSystem />
        </div>
      );
    }

    if (activePage === "dashboard") {
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              ศูนย์เฝ้าระวังระบบ (System Monitor Center)
            </h2>
            <p className="text-gray-500">
              ภาพรวมประสิทธิภาพระบบและสถิติการใช้งาน
            </p>
          </div>

          {/* Top Row: Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ผู้ใช้งานทั้งหมด</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">
                  +12% จากเดือนที่แล้ว
                </p>
                <div className="mt-2 text-xs flex gap-2">
                  <span className="text-blue-600 bg-blue-50 px-1 rounded">จนท.: 420</span>
                  <span className="text-green-600 bg-green-50 px-1 rounded">ผู้ป่วย: 828</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">บัญชีที่ใช้งานอยู่ (Active)</CardTitle>
                <Activity className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">856</div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">ไม่เคลื่อนไหว (&gt;18ด): <span className="text-red-500 font-medium">142</span></p>
                </div>
                <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-1 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setActivePage('user_management')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">รอการอนุมัติสิทธิ์</CardTitle>
                <UserPlus className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">12</div>
                <p className="text-xs text-muted-foreground">
                  คำขอลงทะเบียนเจ้าหน้าที่ใหม่
                </p>
                <Button variant="link" className="p-0 h-auto text-xs text-blue-600 mt-2">
                  ตรวจสอบคำขอ &rarr;
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ปริมาณข้อมูลเข้า</CardTitle>
                <Database className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">482</div>
                <p className="text-xs text-muted-foreground">
                  รายการบันทึกวันนี้
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+5.2% เทียบเมื่อวาน</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row: Charts */}
          <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>การใช้งานระบบ (Login Activity)</CardTitle>
                <CardDescription>
                  จำนวนการเข้าใช้งานระบบในรอบ 30 วัน (เจ้าหน้าที่ vs ผู้ป่วย)
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] min-h-[300px] w-full min-w-0" style={{ minHeight: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={loginActivityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => parseInt(value.split(' ')[1]) % 5 === 0 ? value : ''}
                      />
                      <YAxis 
                        stroke="#888888" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="staff" name="เจ้าหน้าที่" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="patient" name="ผู้ป่วย/ญาติ" fill="#a855f7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>แนวโน้มปริมาณข้อมูล</CardTitle>
                <CardDescription>
                  สถิติการบันทึกการรักษาและการส่งต่อ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] min-h-[300px] w-full min-w-0" style={{ minHeight: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <LineChart data={dataGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="treatments" name="การรักษา" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="referrals" name="การส่งต่อ" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row: Logs & Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    บันทึกระบบล่าสุด (System Logs)
                  </CardTitle>
                  <Button variant="outline" size="sm" className="h-8">ดูทั้งหมด</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'Success' ? 'bg-green-500' : 
                          log.status === 'Warning' ? 'bg-red-500' : 'bg-orange-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{log.action}</p>
                          <p className="text-xs text-gray-500">โดย {log.user}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">เนื้อหาและข้อมูลหลัก</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">ข่าวที่เผยแพร่</span>
                    </div>
                    <span className="font-bold text-gray-800">24</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-medium">กองทุน (Funding)</span>
                    </div>
                    <span className="font-bold text-gray-800">8</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium">สื่อการเรียนรู้</span>
                    </div>
                    <span className="font-bold text-gray-800">156</span>
                 </div>
                 
                 <div className="pt-2">
                    <Button className="w-full" variant="outline" onClick={() => setActivePage('content_management')}>
                      จัดการเนื้อหา
                    </Button>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    // Fallback for other pages
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Server className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-600">กำลังปรับปรุงระบบ</h3>
        <p>หน้า "{activePage}" อยู่ระหว่างการพัฒนา</p>
        <Button variant="outline" className="mt-4" onClick={() => setActivePage('dashboard')}>
          กลับสู่หน้าหลัก
        </Button>
      </div>
    );
  };

  return (
    <AdminWebLayout activePage={activePage} onNavigate={setActivePage}>
      {renderContent()}
    </AdminWebLayout>
  );
}
