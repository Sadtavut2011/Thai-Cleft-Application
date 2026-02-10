import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  PenTool, 
  Camera, 
  Smartphone, 
  Mail, 
  Phone, 
  Building, 
  LogOut, 
  Laptop, 
  ArrowLeft
} from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import { Switch } from "../../../../components/ui/switch";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { toast } from "sonner@2.0.3";

interface ProfilePageProps {
  onBack?: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab />;
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      case "esignature":
        return <ESignatureTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex items-center mb-6 gap-4">
        {onBack && (
          <Button variant="outline" size="icon" onClick={onBack} className="h-10 w-10 shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">การตั้งค่าบัญชี (Account Settings)</h1>
          <p className="text-slate-500">จัดการข้อมูลส่วนตัว ความปลอดภัย และการแจ้งเตือน</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full overflow-x-auto pb-2">
          <nav className="flex items-center gap-2 min-w-max">
            <MenuButton 
              active={activeTab === "general"} 
              onClick={() => setActiveTab("general")} 
              icon={<User size={18} />} 
              label="ข้อมูลทั่วไป" 
            />
            <MenuButton 
              active={activeTab === "security"} 
              onClick={() => setActiveTab("security")} 
              icon={<Shield size={18} />} 
              label="ความปลอดภัย" 
            />
            <MenuButton 
              active={activeTab === "notifications"} 
              onClick={() => setActiveTab("notifications")} 
              icon={<Bell size={18} />} 
              label="การแจ้งเตือน" 
            />
            <MenuButton 
              active={activeTab === "esignature"} 
              onClick={() => setActiveTab("esignature")} 
              icon={<PenTool size={18} />} 
              label="ลายมือชื่อดิจิทัล" 
            />
          </nav>
        </div>

        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

const MenuButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap
      ${active 
        ? "bg-[#7367f0] text-white shadow-md" 
        : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
      }`}
  >
    {icon}
    {label}
  </button>
);

const GeneralTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>รูปโปรไฟล์ (Profile Picture)</CardTitle>
          <CardDescription>รูปภาพจะแสดงในส่วนหัวและรายการบุคลากร</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-slate-200 hover:bg-slate-50 text-slate-600">
              <Camera size={16} />
            </button>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <div className="flex gap-3">
              <Button variant="outline" size="sm">อัปโหลดรูปใหม่</Button>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">ลบรูปภาพ</Button>
            </div>
            <p className="text-xs text-slate-400">แนะนำขนาด 400x400px JPG หรือ PNG ไม่เกิน 2MB</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลส่วนตัว (Personal Information)</CardTitle>
          <CardDescription>ข้อมูลเกี่ยวกับบทบาทและหน่วยงานของคุณ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ชื่อ - นามสกุล</Label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>ตำแหน่ง/บทบาท (Role)</Label>
              <Input value="พยาบาลวิชาชีพ (Case Manager)" readOnly className="bg-slate-50 text-slate-500" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>หน่วยงาน/สังกัด (Organization)</Label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border rounded-md text-slate-600">
                <Building size={16} />
                <span>โรงพยาบาลฝาง</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลติดต่อ (Contact Information)</CardTitle>
          <CardDescription>ช่องทางสำหรับการติดต่อประสานงาน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>อีเมล (Email)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input defaultValue="john.doe@hospital.go.th" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>เบอร์โทรศัพท์มือถือ</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input defaultValue="081-234-5678" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>เบอร์โทรศัพท์ที่ทำงาน (Work Phone)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input defaultValue="053-910-600" className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>เบอร์ต่อ (Ext.)</Label>
              <Input defaultValue="1234" placeholder="เช่น 1234" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t flex justify-end p-4">
            <Button onClick={() => toast.success("บันทึกข้อมูลเรียบร้อย")}>บันทึกการเปลี่ยนแปลง</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const SecurityTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>เปลี่ยนรหัสผ่าน (Change Password)</CardTitle>
          <CardDescription>เพื่อความปลอดภัย ควรเปลี่ยนรหัสผ่านทุก 3-6 เดือน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>รหัสผ่านปัจจุบัน</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>รหัสผ่านใหม่</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>ยืนยันรหัสผ่านใหม่</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t flex justify-end p-4">
            <Button onClick={() => toast.success("เปลี่ยนรหัสผ่านเรียบร้อย")}>อัปเดตรหัสผ่าน</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>อุปกรณ์ที่ใช้งานอยู่ (Active Sessions)</CardTitle>
          <CardDescription>จัดการเซสชันการเข้าสู่ระบบของคุณในอุปกรณ์ต่างๆ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm text-green-600">
                        <Laptop size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900">Chrome on Windows (อุปกรณ์นี้)</div>
                        <div className="text-xs text-slate-500">Chiang Rai, Thailand • Online now</div>
                    </div>
                </div>
                <div className="text-xs font-medium text-green-600 bg-white px-2 py-1 rounded-full border border-green-200">
                    Active
                </div>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900">Safari on iPhone 13</div>
                        <div className="text-xs text-slate-500">Chiang Mai, Thailand • 2 hours ago</div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500">
                    ออกจากระบบ
                </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t p-4">
            <Button variant="outline" className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200">
                <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบจากอุปกรณ์อื่นทั้งหมด
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ประวัติการเข้าสู่ระบบ (Login History)</CardTitle>
          <CardDescription>กิจกรรมการเข้าใช้งานบัญชีของคุณล่าสุด</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>อุปกรณ์ / เบราว์เซอร์</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>เวลา</TableHead>
                        <TableHead>สถานะ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Chrome on Windows</TableCell>
                        <TableCell>192.168.1.1</TableCell>
                        <TableCell>2023-10-25 09:30</TableCell>
                        <TableCell><span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">Success</span></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Safari on iPhone</TableCell>
                        <TableCell>184.22.14.5</TableCell>
                        <TableCell>2023-10-24 18:45</TableCell>
                        <TableCell><span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">Success</span></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Chrome on Android</TableCell>
                        <TableCell>112.54.22.1</TableCell>
                        <TableCell>2023-10-20 14:20</TableCell>
                        <TableCell><span className="text-red-600 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full">Failed</span></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const NotificationsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ช่องทางการแจ้งเตือน (Channels)</CardTitle>
          <CardDescription>เลือกช่องทางที่คุณต้องการรับข่าวสาร</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                <div className="space-y-0.5">
                    <Label className="text-base">อีเมล (Email)</Label>
                    <p className="text-sm text-slate-500">รับสรุปงานและการแจ้งเตือนสำคัญทางอีเมล</p>
                </div>
                <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                <div className="space-y-0.5">
                    <Label className="text-base">การแจ้งเตือนบนเว็บ (Web Notification)</Label>
                    <p className="text-sm text-slate-500">แสดง Pop-up มุมขวาบนเมื่อใช้งานระบบ</p>
                </div>
                <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">LINE Notification <span className="bg-[#06C755] text-white text-[10px] px-1.5 py-0.5 rounded">Recommeded</span></Label>
                    <p className="text-sm text-slate-500">รับการแจ้งเตือนแบบ Real-time ผ่าน LINE OA</p>
                </div>
                <Switch />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ประเภทการแจ้งเตือน (Preferences)</CardTitle>
          <CardDescription>เลือกหัวข้อที่คุณสนใจ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-4">
                <div className="flex items-start space-x-3">
                    <Checkbox id="notify-1" defaultChecked />
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="notify-1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            เมื่อมีคนส่งเคสใหม่เข้ามา (New Referral Case)
                        </label>
                        <p className="text-sm text-slate-500">แจ้งเตือนทันทีเมื่อมีเคสส่งตัวมาถึงหน่วยงานของคุณ</p>
                    </div>
                </div>
                
                <Separator />

                <div className="flex items-start space-x-3">
                    <Checkbox id="notify-2" defaultChecked />
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="notify-2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            เมื่อสถานะเคสมีการเปลี่ยนแปลง (Status Update)
                        </label>
                        <p className="text-sm text-slate-500">เช่น เมื่อปลายทางกดรับเคส หรือมีการตอบกลับ</p>
                    </div>
                </div>

                <Separator />

                <div className="flex items-start space-x-3">
                    <Checkbox id="notify-3" />
                    <div className="grid gap-1.5 leading-none">
                        <label htmlFor="notify-3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            ข่าวสารประชาสัมพันธ์จากส่วนกลาง (News & Announcements)
                        </label>
                        <p className="text-sm text-slate-500">ประกาศสำคัญ กิจกรรม หรือการอัปเดตระบบ</p>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t flex justify-end p-4">
            <Button onClick={() => toast.success("บันทึกการตั้งค่าเรียบร้อย")}>บันทึกการเปลี่ยนแปลง</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const ESignatureTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ลายมือชื่อดิจิทัล (E-Signature)</CardTitle>
          <CardDescription>อัปโหลดลายเซ็นของคุณเพื่อใช้ในการลงนามเอกสารอัตโนมัติ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-4">
                    <PenTool size={32} />
                </div>
                <h3 className="font-semibold text-lg text-slate-700 mb-1">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-4">รองรับไฟล์ PNG (พื้นหลังใส) หรือ JPG ขนาดไม่เกิน 5MB</p>
                <Button variant="outline">เลือกไฟล์</Button>
            </div>

            <div className="space-y-2">
                <Label>ตัวอย่างการแสดงผล</Label>
                <div className="border rounded-lg p-6 bg-white">
                    <div className="flex justify-between items-end">
                        <div className="text-sm text-slate-500">
                            ลงชื่อ..........................................................<br/>
                            ( นางสาวใจดี มีสุข )<br/>
                            พยาบาลวิชาชีพปฏิบัติการ
                        </div>
                        <div className="opacity-30">
                            <div className="w-32 h-12 bg-slate-200 rounded flex items-center justify-center text-xs">
                                Signature Preview
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 border-t flex justify-end p-4">
            <Button disabled>บันทึก</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
