import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  FileText, 
  Video, 
  MoreHorizontal, 
  Calendar, 
  Eye,
  Tag,
  Edit,
  Trash,
  Upload
} from "lucide-react";

export function ContentManagement() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">จัดการเนื้อหา (Content Management)</h2>
        <p className="text-gray-500">บริหารจัดการข่าวประชาสัมพันธ์และคลังความรู้</p>
      </div>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="bg-white border border-gray-200 p-1 h-auto mb-6">
          <TabsTrigger value="news" className="px-6 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">ข่าวประชาสัมพันธ์ (News & PR)</TabsTrigger>
          <TabsTrigger value="learning" className="px-6 py-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900">คลังความรู้ (Learning Hub)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="news">
          <NewsManager />
        </TabsContent>
        
        <TabsContent value="learning">
          <LearningHubManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewsManager() {
  const newsItems = [
    { id: 1, title: "โครงการยิ้มสวย เสียงใส ปี 2567", category: "Activity", target: "Patient", status: "Published", author: "Admin", date: "2023-10-25", views: 1250 },
    { id: 2, title: "ประกาศปิดปรับปรุงระบบชั่วคราว", category: "Announcement", target: "All", status: "Draft", author: "System", date: "2023-11-01", views: 0 },
    { id: 3, title: "สรุปผลการดำเนินงานไตรมาส 3", category: "Report", target: "Staff", status: "Draft", author: "Dr. Somchai", date: "-", views: 0 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>รายการข่าว (News List)</CardTitle>
          <CardDescription>จัดการข่าวสารที่แสดงบนหน้าเว็บไซต์หลักและแอปพลิเคชัน</CardDescription>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="ค้นหาข่าว..." className="pl-10" />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> สร้างข่าวใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>สร้างข่าวใหม่ (Create New News)</DialogTitle>
                <DialogDescription>
                  สร้างประกาศหรือข่าวประชาสัมพันธ์เพื่อสื่อสารกับผู้ใช้งาน
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                
                {/* Input: Title, Category, Cover Image */}
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="news-title">หัวข้อข่าว (Title)</Label>
                      <Input id="news-title" placeholder="ชื่อหัวข้อข่าว" />
                    </div>
                    <div className="space-y-2">
                      <Label>หมวดหมู่ (Category)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เ��ือกหมวดหมู่" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activity">กิจกรรม (Activity)</SelectItem>
                          <SelectItem value="announcement">ประกาศ (Announcement)</SelectItem>
                          <SelectItem value="report">รายงาน (Report)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                     <Label>รูปปก (Cover Image)</Label>
                     <div className="h-32 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center text-gray-500">
                           <Upload className="h-8 w-8 mb-2" />
                           <span className="text-sm font-medium">Click to upload cover image</span>
                           <span className="text-xs text-gray-400">JPG, PNG up to 5MB</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Editor: Content */}
                <div className="space-y-2 border-t pt-4">
                   <Label htmlFor="news-content">เนื้อหาข่าว (Content)</Label>
                   <Textarea id="news-content" placeholder="รายละเอียดเนื้อหาข่าว..." className="min-h-[150px]" />
                </div>

                {/* Config: Checkbox Target */}
                <div className="space-y-3 border-t pt-4">
                   <Label>กลุ่มเป้าหมาย (Target Audience)</Label>
                   <div className="flex items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="news-target-patient" />
                        <Label htmlFor="news-target-patient" className="font-normal cursor-pointer">Patient</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="news-target-staff" />
                        <Label htmlFor="news-target-staff" className="font-normal cursor-pointer">Primary care</Label>
                      </div>
                   </div>
                </div>

              </div>
              <DialogFooter>
                <Button variant="outline">ยกเลิก</Button>
                <Button type="submit">สร้างข่าว</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[350px]">หัวข้อข่าว (Title)</TableHead>
              <TableHead>หมวดหมู่</TableHead>
              <TableHead>กลุ่มเป้าหมาย</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>ผู้ลง</TableHead>
              <TableHead>วันที่เผยแพร่</TableHead>
              <TableHead>ยอดเข้าชม</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-500">ID: #{item.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={item.target === 'Staff' ? 'rounded-full border-purple-200 bg-purple-50 text-purple-700 px-3' : 'rounded-full border-green-200 bg-green-50 text-green-700 px-3'}>
                    <Tag className="mr-1 h-3 w-3" /> {item.target === 'Staff' ? 'Primary care' : item.target}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={item.status === 'Published'} />
                    <span className={`text-sm ${item.status === 'Published' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      {item.status === 'Published' ? 'Published' : item.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {item.author}
                </TableCell>
                <TableCell className="text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {item.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="h-3 w-3" /> {item.views.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>การจัดการ</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> แก้ไข
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> ลบ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LearningHubManager() {
  const resources = [
    { id: 1, title: "คู่มือการดูแลแผลหลังผ่าตัด", type: "Video", target: "Family", date: "2023-10-15", views: 1540, status: "Published", author: "Admin" },
    { id: 2, title: "Protocol การส่งต่อผู้ป่วยปากแหว่ง", type: "PDF", target: "Doctor", date: "2023-10-10", views: 850, status: "Published", author: "Dr. Somchai" },
    { id: 3, title: "เทคนิคการให้นมบุตร", type: "Video", target: "Family", date: "2023-09-28", views: 320, status: "Draft", author: "Admin" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>สื่อการเรียนรู้ (Learning Resources)</CardTitle>
          <CardDescription>จัดการวิดีโอและเอกสารสำหรับแพทย์และผู้ปกครอง</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> อัปโหลดสื่อใหม่
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>อัปโหลดสื่อใหม่ (Upload New Media)</DialogTitle>
              <DialogDescription>
                เพิ่มวิดีโอหรือเอกสารให้ความรู้สำหรับผู้ป่วยและบุคลากรทางการแพทย์
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              
              {/* Input: Title, Category, Cover Image */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">หัวข้อ (Title)</Label>
                    <Input id="title" placeholder="ชื่อสื่อการเรียนรู้" />
                  </div>
                  <div className="space-y-2">
                    <Label>หมวดหมู่ (Category)</Label>
                     <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">ความรู้ทั่วไป (General)</SelectItem>
                        <SelectItem value="surgery">การผ่าตัด (Surgery)</SelectItem>
                        <SelectItem value="care">การดูแลรักษา (Care)</SelectItem>
                        <SelectItem value="nutrition">โภชนาการ (Nutrition)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                   <Label>รูปปก (Cover Image)</Label>
                   <div className="h-32 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex flex-col items-center text-gray-500">
                         <Upload className="h-8 w-8 mb-2" />
                         <span className="text-sm font-medium">Click to upload cover image</span>
                         <span className="text-xs text-gray-400">JPG, PNG up to 5MB</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Media: Link Youtube, Attach PDF */}
              <div className="space-y-4 border-t pt-4">
                 <h4 className="font-medium text-sm text-gray-900">ไฟล์สื่อ (Media Source)</h4>
                 <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="youtube">ลิงก์ YouTube (Link)</Label>
                      <Input id="youtube" placeholder="https://www.youtube.com/watch?v=..." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>แนบไฟล์เอกสาร (Attach PDF)</Label>
                      <Input type="file" accept=".pdf" className="cursor-pointer" />
                    </div>
                 </div>
              </div>

              {/* Editor: Rich Text Area */}
              <div className="space-y-2 border-t pt-4">
                 <Label htmlFor="description">เนื้อหา/รายละเอียด (Rich Text Editor)</Label>
                 <Textarea id="description" placeholder="พิมพ์รายละเอียดเนื้อหาที่นี่..." className="min-h-[120px]" />
              </div>

              {/* Config: Checkbox Target */}
              <div className="space-y-3 border-t pt-4">
                 <Label>กลุ่มเป้าหมาย (Target Audience)</Label>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="target-patient" />
                      <Label htmlFor="target-patient" className="font-normal cursor-pointer">Patient</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="target-staff" />
                      <Label htmlFor="target-staff" className="font-normal cursor-pointer">Primary care</Label>
                    </div>
                 </div>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline">ยกเลิก</Button>
              <Button type="submit">บันทึกสื่อ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">ชื่อสื่อ (Resource Name)</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>กลุ่มเป้าหมาย</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>ผู้ลง</TableHead>
                <TableHead>วันที่อัปโหลด</TableHead>
                <TableHead>ยอดเข้าชม</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-md flex items-center justify-center shrink-0 ${item.type === 'Video' ? 'bg-red-50' : 'bg-blue-50'}`}>
                        {item.type === 'Video' ? <Video className="h-5 w-5 text-red-500" /> : <FileText className="h-5 w-5 text-blue-500" />}
                      </div>
                      <div>
                        <p className="line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-500">ID: #{item.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={item.target === 'Doctor' ? 'rounded-full border-purple-200 bg-purple-50 text-purple-700 px-3' : 'rounded-full border-green-200 bg-green-50 text-green-700 px-3'}>
                      <Tag className="mr-1 h-3 w-3" /> {item.target === 'Family' ? 'Patient' : item.target === 'Doctor' ? 'Primary care' : item.target}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={item.status === 'Published'} />
                      <span className={`text-sm ${item.status === 'Published' ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                        {item.status === 'Published' ? 'Published' : item.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {item.author}
                  </TableCell>
                  <TableCell className="text-gray-500">{item.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="h-3 w-3" /> {item.views.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </CardContent>
    </Card>
  );
}
