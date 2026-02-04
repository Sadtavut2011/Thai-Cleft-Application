import React, { useState } from 'react';
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose, DialogTrigger } from "../../../../components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription, DrawerTrigger, DrawerClose } from "../../../../components/ui/drawer";
import { Textarea } from "../../../../components/ui/textarea";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Separator } from "../../../../components/ui/separator";
import {
  ArrowLeft,
  ArrowDown,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Printer,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  FileText,
  User,
  ShieldAlert,
  Ambulance,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Paperclip,
  Upload,
  ChevronRight,
  ChevronLeft,
  Bell,
  History,
  FileCheck,
  Stethoscope,
  Building,
  Hospital
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { AcceptReferralDialog } from "./AcceptReferralDialog";
import { ReferralForm1 } from "./ReferralForm1";




export function ReferralSystem({ onBack }: { onBack?: () => void }) {
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [referralType, setReferralType] = useState<'Refer Out' | 'Refer In'>('Refer Out');
  const [selectedReferral, setSelectedReferral] = useState<any>(null);

  // Constants
  const STATUS_LABELS: Record<string, string> = {
    'Accepted': 'ยอมรับแล้ว',
    'Pending': 'รอการตอบรับ',
    'Rejected': 'ปฏิเสธ',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-700 hover:bg-green-100 border-none';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none';
      case 'Rejected': return 'bg-red-100 text-red-700 hover:bg-red-100 border-none';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = (id: number) => {
    toast.success("ยกเลิกคำขอเรียบร้อยแล้ว");
    setView('list');
    setSelectedReferral(null);
  };

  const handleAccept = (id: number) => {
    toast.success("ยอมรับการส่งตัวเรียบร้อยแล้ว");
    setView('list');
    setSelectedReferral(null);
  };

  // Mock data for referrals
  const [referrals, setReferrals] = useState([
    {
      id: 1,
      referralNo: 'REF-6612-001',
      patientName: 'นางสาว มุ่งมั่น ทำดี',
      hn: '66012346',
      patientHn: '66012346',
      hospital: 'รพ.สต.บ้านทุ่ง',
      destination: 'โรงพยาบาลมหาราชนครเชียงใหม่',
      destinationHospital: 'โรงพยาบาลมหาราชนครเชียงใหม่',
      date: '2023-12-04T10:30:00',
      referralDate: '2023-12-04T10:30:00',
      status: 'Pending',
      urgency: 'Urgent',
      diagnosis: 'Fracture of right arm',
      reason: 'ผู้ป่วยมีอาการปวดแขนขวาอย่างรุนแรงหลังหกล้ม ผล X-ray เบื้องต้นพบกระดูกหัก',
      documents: ['X-Ray.pdf', 'Lab-Report.pdf'],
      type: 'Refer Out',
      logs: [
        { status: 'Pending', date: '2023-12-04T10:30:00', description: 'ส่งคำขอส่งตัว', actor: 'พยาบาลวิชาชีพ A' }
      ]
    },
    {
      id: 2,
      referralNo: 'REF-6612-002',
      patientName: 'นาย สมชาย ใจดี',
      hn: '66091234',
      patientHn: '66091234',
      hospital: 'รพ.สต.บ้านใหม่',
      destination: 'โรงพยาบาลลำปาง',
      destinationHospital: 'โรงพยาบาลลำปาง',
      date: '2023-12-05T14:20:00',
      referralDate: '2023-12-05T14:20:00',
      status: 'Accepted',
      urgency: 'Routine',
      diagnosis: 'Diabetes Mellitus Type 2',
      reason: 'ผู้ป่วยเบาหวาน คุมน้ำตาลไม่ได้ ต้องการปรับยา',
      documents: ['History.pdf'],
      type: 'Refer Out',
      destinationContact: 'พยาบาล B',
      logs: [
        { status: 'Pending', date: '2023-12-05T09:00:00', description: 'ส่งคำขอส่งตัว', actor: 'พยาบาลวิชาชีพ C' },
        { status: 'Accepted', date: '2023-12-05T14:20:00', description: 'ตอบรับการส่งตัว', actor: 'พยาบาล B' }
      ]
    },
    {
      id: 3,
      referralNo: 'REF-6612-003',
      patientName: 'นาง สมหญิง จริงใจ',
      hn: '66095678',
      patientHn: '66095678',
      hospital: 'รพ.สต.สันกำแพง',
      destination: 'โรงพยาบาลนครพิงค์',
      destinationHospital: 'โรงพยาบาลนครพิงค์',
      date: '2023-12-06T08:15:00',
      referralDate: '2023-12-06T08:15:00',
      status: 'Rejected',
      urgency: 'Routine',
      diagnosis: 'Hypertension',
      reason: 'ความดันโลหิตสูง',
      documents: [],
      type: 'Refer Out',
      logs: [
        { status: 'Pending', date: '2023-12-06T08:00:00', description: 'ส่งคำขอส่งตัว', actor: 'พยาบาลวิชาชีพ D' },
        { status: 'Rejected', date: '2023-12-06T08:15:00', description: 'ปฏิเสธ: เตียงเต็ม', actor: 'พยาบาล E' }
      ]
    },
    // Mock Data for Refer In
    {
      id: 4,
      referralNo: 'REF-IN-6612-001',
      patientName: 'นาย รักษา ดี',
      hn: 'HN-6600999',
      patientHn: 'HN-6600999',
      hospital: 'รพ.สต.บ้านดอย',
      destination: 'โรงพยาบาลฝาง',
      destinationHospital: 'โรงพยาบาลฝาง',
      date: '2023-12-07T09:00:00',
      referralDate: '2023-12-07T09:00:00',
      status: 'Pending',
      urgency: 'Emergency',
      diagnosis: 'Acute Appendicitis',
      reason: 'ปวดท้องน้อยด้านขวา มีไข้สูง',
      documents: ['Lab-Result.pdf'],
      type: 'Refer In',
      logs: [
        { status: 'Pending', date: '2023-12-07T09:00:00', description: 'ส่งคำขอส่งตัว', actor: 'รพ.สต.บ้านดอย' }
      ]
    },
    {
      id: 5,
      referralNo: 'REF-IN-6612-002',
      patientName: 'เด็กชาย กล้าหาญ ชาญชัย',
      hn: 'HN-6601001',
      patientHn: 'HN-6601001',
      hospital: 'รพ.สต.แม่ข่า',
      destination: 'โรงพยาบาลฝาง',
      destinationHospital: 'โรงพยาบาลฝาง',
      date: '2023-12-07T11:30:00',
      referralDate: '2023-12-07T11:30:00',
      status: 'Pending',
      urgency: 'Urgent',
      diagnosis: 'High Fever',
      reason: 'ไข้สูงลอย 3 วัน สงสัยไข้เลือดออก',
      documents: [],
      type: 'Refer In',
      logs: [
        { status: 'Pending', date: '2023-12-07T11:30:00', description: 'ส่งคำขอส่งตัว', actor: 'รพ.สต.แม่ข่า' }
      ]
    }
  ]);

  const filtered = referrals.filter(r => {
    const matchesSearch = r.patientName.includes(searchTerm) || r.hn.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    // Logic change: When Refer In (History) is selected, show only Accepted or Rejected
    if (referralType === 'Refer In') {
      return matchesSearch && matchesStatus && (r.status === 'Accepted' || r.status === 'Rejected');
    }

    const matchesType = r.type === referralType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const renderDetailView = () => {
    if (!selectedReferral) return null;

    return (
      <div className="space-y-6 pb-10">
        {/* Header / Nav */}
        <div className="sticky top-0 z-40 bg-[#7066a9] -mt-6 -mx-6 mb-6 shadow-md pb-2 pt-2">
          <div className="h-[44px] flex items-center px-4 relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView('list')}
              className="text-white hover:bg-white/20 rounded-full absolute left-4 h-10 w-10"
            >
              <ChevronLeft size={24} />
            </Button>
            <h1 className="text-white text-lg font-bold font-['IBM_Plex_Sans_Thai'] mx-auto">สร้างคำขอส่งตัว</h1>
          </div>
        </div>

        {/* Header Action Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="min-w-0 flex-1 pr-20 md:pr-0">
              <div className="flex items-baseline gap-2 mb-2 mt-8 md:mt-0">
                <h2 className="text-xl font-bold text-[#5e5873] truncate">{String(selectedReferral.patientName)}</h2>
                <span className="text-sm text-gray-500 whitespace-nowrap">(HN: {String(selectedReferral.patientHn)})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 shrink-0">ส่งต่อไปยัง:</span>
                <span className="font-medium text-gray-700 truncate">{String(selectedReferral.destinationHospital)}</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
              <Badge className={cn("text-xs px-3 py-1 absolute top-6 right-6 md:static", getStatusColor(selectedReferral.status))}>
                {String(STATUS_LABELS[selectedReferral.status] || selectedReferral.status)}
              </Badge>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {(selectedReferral.status === 'Pending' || selectedReferral.type === 'Refer In') && (
                  <div className="flex gap-2 w-full md:w-auto">
                    {/* For Refer In, show Cancel and Accept buttons */}
                    {referralType === 'Refer In' && selectedReferral.status === 'Pending' ? (
                      <>
                        <Drawer open={isRejectOpen} onOpenChange={(open: boolean) => {
                          setIsRejectOpen(open);
                          if (open) setRejectReason('');
                        }}>
                          <DrawerTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 text-xs border-red-200 text-red-600 hover:bg-red-50 flex-1 md:flex-none">
                              ปฎิเสธคำขอ
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle className="text-red-600 flex items-center justify-center gap-2 pt-4 text-xl">
                                <AlertTriangle className="h-6 w-6" />
                                ยืนยันการปฎิเสธคำขอ
                              </DrawerTitle>
                              <DrawerDescription className="text-center px-4 text-gray-500">
                                การปฎิเสธคำขอส่งตัว จะทำให้สถานะเปลี่ยนเป็น "ปฎิเสธ" และไม่สามารถดำเนินการต่อได้
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="px-6 py-4">
                              <div className="grid gap-2">
                                <Label className="text-red-500 font-medium">
                                  เหตุผลการปฎิเสธ *
                                </Label>
                                <Textarea
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  placeholder="ระบุสาเหตุที่ต้องการยกเลิก..."
                                  className="min-h-[120px] border-red-200 focus:border-red-400 focus:ring-red-100 bg-red-50/10 text-base"
                                />
                              </div>
                            </div>
                            <DrawerFooter className="px-6 pb-8 pt-2">
                              <div className="flex flex-col gap-3 w-full">
                                <Button
                                  variant="destructive"
                                  className="w-full h-12 text-base bg-red-600 hover:bg-red-700 shadow-md shadow-red-100"
                                  onClick={() => {
                                    if (rejectReason.trim()) {
                                      handleDelete(selectedReferral.id);
                                      setIsRejectOpen(false);
                                    } else {
                                      toast.error("กรุณาระบุเหตุผล");
                                    }
                                  }}
                                >
                                  ยืนยันการปฎิเสธ
                                </Button>
                                <DrawerClose asChild>
                                  <Button variant="outline" className="w-full h-12 text-base border-gray-200 text-gray-700 hover:bg-gray-50">กลับ</Button>
                                </DrawerClose>
                              </div>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                        <AcceptReferralDialog
                          referralId={selectedReferral.id}
                          onAccept={(id) => handleAccept(id)}
                        />
                      </>
                    ) : (
                      // For Refer Out, usually only Cancel is available if pending
                      selectedReferral.status === 'Pending' && (
                        <Button variant="outline" size="sm" className="h-9 text-xs border-red-200 text-red-600 hover:bg-red-50 w-full md:w-auto" onClick={() => handleDelete(selectedReferral.id)}>
                          ยกเลิกคำขอ
                        </Button>
                      )
                    )}
                  </div>
                )}

                <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200 text-slate-600 w-full md:w-auto mt-1 md:mt-0">
                  <Printer className="mr-1.5 h-3.5 w-3.5" /> พิมพ์ใบส่งตัว
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="text-[#7367f0]" size={20} /> รายละเอียดการส่งตัว
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500 text-xs uppercase">วันที่ส่งเรื่อง</Label>
                    <div className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                      <CalendarIcon size={16} className="text-gray-400" />
                      {format(new Date(selectedReferral.referralDate), "d MMMM yyyy เวลา HH:mm", { locale: th })}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-500 text-xs uppercase">ความเร่งด่วน</Label>
                    <div className={cn("font-medium mt-1",
                      selectedReferral.urgency === 'Emergency' ? 'text-red-600' :
                        selectedReferral.urgency === 'Urgent' ? 'text-orange-600' : 'text-slate-600'
                    )}>
                      {String(selectedReferral.urgency)}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-500 text-xs uppercase">การวินิจฉัย (Diagnosis)</Label>
                  <p className="text-gray-800 font-medium mt-1">{String(selectedReferral.diagnosis)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <Label className="text-gray-500 text-xs uppercase mb-2 block">เหตุผล / รายละเอียดเพิ่มเติม</Label>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {String(selectedReferral.reason)}
                  </p>
                </div>

                <div>
                  <Label className="text-gray-500 text-xs uppercase mb-3 block">เอกสารแนบ ({selectedReferral.documents.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedReferral.documents.map((doc: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                        <Paperclip size={14} />
                        {String(doc)}
                      </div>
                    ))}
                    {selectedReferral.documents.length === 0 && <span className="text-gray-400 text-sm">- ไม่มีเอกสารแนบ -</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Col: Timeline & Contact */}
          <div className="space-y-6">
            {/* Destination Contact */}
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3 bg-[#f8f9fa] border-b border-gray-100">
                <CardTitle className="text-sm font-bold text-gray-600 flex items-center gap-2">
                  <Hospital size={16} /> ผู้ส่งเรื่องต้นทาง
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {selectedReferral.hospital ? (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#dff6f8] text-[#00cfe8] flex items-center justify-center font-bold">
                      {String(selectedReferral.hospital).charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-800">{String(selectedReferral.hospital)}</div>
                      <div className="text-xs text-gray-500">ผู้ส่งเรื่อง</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic">ไม่ระบุข้อมูล...</div>
                )}
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="shadow-sm border-gray-100 overflow-hidden h-full">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="text-[#ff9f43]" size={20} /> ประวัติสถานะ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 relative">
                <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gray-100"></div>
                <div className="space-y-6 relative">
                  {selectedReferral.logs.map((log: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className={cn(
                        "relative z-10 h-3 w-3 rounded-full mt-1.5 border-2",
                        log.status === 'Accepted' ? "bg-green-500 border-green-100 ring-4 ring-green-50" :
                          log.status === 'Rejected' ? "bg-red-500 border-red-100 ring-4 ring-red-50" :
                            index === 0 ? "bg-[#7367f0] border-[#e0e0fc] ring-4 ring-[#e0e0fc]" :
                              "bg-gray-400 border-gray-200"
                      )}></div>
                      <div>
                        <div className="text-xs text-gray-400 mb-0.5">
                          {format(new Date(log.date), "d MMM HH:mm", { locale: th })}
                        </div>
                        <div className="font-semibold text-sm text-gray-800">{String(STATUS_LABELS[log.status] || log.status)}</div>
                        <div className="text-sm text-gray-600">{String(log.description)}</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <User size={10} /> {String(log.actor)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedReferral.status === 'Pending' && (
                    <div className="flex gap-4 opacity-50">
                      <div className="relative z-10 h-3 w-3 rounded-full mt-1.5 border-2 bg-gray-200 border-gray-50"></div>
                      <div className="text-sm text-gray-400 italic">รอการดำเนินการต่อไป...</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <>
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        {/* Top Row: Search */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ค้นหาชื่อ, เลขที่, HN..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-slate-200 bg-slate-50 focus:bg-white transition-all rounded-lg"
            />
          </div>
        </div>

        {/* Toggle Menu */}
        <div className="bg-[#f1f5f9] p-1 rounded-[10px] flex items-center">
          <button
            onClick={() => setReferralType('Refer Out')}
            className={cn(
              "flex-1 h-[36px] font-semibold text-sm rounded-[8px] transition-all",
              referralType === 'Refer Out'
                ? "bg-white text-[#7367f0] shadow-sm"
                : "text-[#6a7282] hover:text-[#4b5563]"
            )}
          >
            ส่งตัว
          </button>
          <button
            onClick={() => setReferralType('Refer In')}
            className={cn(
              "flex-1 h-[36px] font-semibold text-sm rounded-[8px] transition-all",
              referralType === 'Refer In'
                ? "bg-white text-[#7367f0] shadow-sm"
                : "text-[#6a7282] hover:text-[#4b5563]"
            )}
          >
            ประวัติการส่งตัว
          </button>
        </div>

        <Separator className="bg-slate-100" />
      </div>

      {/* Data Display */}
      <div className="min-h-[300px]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="bg-gray-100 p-4 rounded-full mb-3">
              <FileText className="h-8 w-8 text-gray-300" />
            </div>
            <p>ไม่พบรายการส่งตัว ({referralType === 'Refer In' ? 'ประวัติการส่งตัว' : referralType})</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {filtered.map((referral) => (
              (referralType === 'Refer Out' && (referral.status === 'Accepted' || referral.status === 'Rejected')) ? null : (
                <div
                  key={referral.id}
                  onClick={() => {
                    setSelectedReferral(referral);
                    setView('detail');
                  }}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        referral.urgency === 'Emergency' ? "bg-red-50 text-red-600" :
                          referral.urgency === 'Urgent' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                      )}>
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{referral.patientName}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <FileText className="h-3 w-3" /> {referral.hn}
                        </div>
                      </div>
                    </div>
                    <div className={cn("px-2 py-1 rounded text-[10px] font-bold border",
                      referral.urgency === 'Emergency' ? "bg-red-50 text-red-600 border-red-100" :
                        referral.urgency === 'Urgent' ? "bg-orange-50 text-orange-500 border-orange-100" : "bg-slate-50 text-slate-500 border-slate-100"
                    )}>
                      {referral.urgency === 'Routine' ? 'ปกติ' : referral.urgency}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 truncate max-w-[40%]">
                      {referral.hospital.replace('โรงพยาบาล', 'รพ.')}
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="text-xs text-[#7367f0] font-medium truncate max-w-[40%]">
                      {referral.destination.replace('โรงพยาบาล', 'รพ.')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div className="text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(referral.date), "d MMM yy HH:mm", { locale: th })}
                    </div>
                    <div className={cn("font-medium flex items-center gap-1.5",
                      referral.status === 'Pending' ? "text-yellow-600" :
                        referral.status === 'Accepted' ? "text-green-600" :
                          referral.status === 'Rejected' ? "text-red-600" : "text-slate-500"
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full",
                        referral.status === 'Pending' ? "bg-yellow-500" :
                          referral.status === 'Accepted' ? "bg-green-500" :
                            referral.status === 'Rejected' ? "bg-red-500" : "bg-slate-500"
                      )} />
                      {referral.status === 'Accepted' ? 'อนุมัติ' :
                        referral.status === 'Pending' ? 'รออนุมัติ' :
                          referral.status === 'Rejected' ? 'ปฏิเสธ' : referral.status}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* FAB for creating referral */}
      <button
        onClick={() => setShowReferralForm(true)}
        className="fixed bottom-[90px] right-4 w-14 h-14 bg-[#7066A9] hover:bg-[#5b528a] text-white rounded-full flex items-center justify-center shadow-lg z-50"
      >
        <Plus size={28} />
      </button>
    </>
  );



  if (showReferralForm) {
    return <ReferralForm1 onBack={() => setShowReferralForm(false)} />;
  }

  return (
    <div className="min-h-full bg-slate-50 font-['Montserrat','Noto_Sans_Thai',sans-serif]">
      {/* Header */}
      {view === 'list' && (
        <div className="sticky top-0 z-40 bg-white h-[64px] px-4 flex items-center gap-3 shrink-0 shadow-sm border-b border-slate-100">
          <button onClick={onBack} className="text-[#554e80] hover:bg-slate-50 p-2 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[#554e80] text-lg font-bold">ระบบส่งตัวผู้ป่วย</h1>
        </div>
      )}

      {/* Content */}
      <div className="p-4 md:p-6 pb-20">
        {view === 'list' ? renderListView() : renderDetailView()}
      </div>
    </div>
  );
}

export default ReferralSystem;