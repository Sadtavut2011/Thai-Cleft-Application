import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  GripVertical, 
  Plus, 
  Trash2, 
  Pencil,
  Save,
  Settings,
  Clock,
  UserCircle,
  Bell,
  AlignLeft,
  Stethoscope
} from "lucide-react";

interface Milestone {
  id: number;
  title: string;
  ageRange: string; // e.g., "3-6 เดือน"
  type: string;
  responsibleRole: string;
  description: string;
  alertBeforeDays: number;
}

export function SystemConfiguration() {
  // Config Page
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="h-8 w-8 text-blue-600" />
          ตั้งค่าระบบ (System Configuration)
        </h2>
        <p className="text-gray-500">กำหนดแผนการรักษามาตรฐาน (Standard Treatment Plans) และขั้นตอนการทำงาน</p>
      </div>

      <TreatmentPlanBuilder />
    </div>
  );
}

function TreatmentPlanBuilder() {
  const [activePlan, setActivePlan] = useState("cleft_lip");
  
  // Mock Initial Data with new structure
  const [milestones, setMilestones] = useState<Milestone[]>([
    { 
      id: 1, 
      title: "ผ่าตัดเย็บริมฝีปาก (Cheiloplasty)", 
      ageRange: "3-4 เดือน", 
      type: "Surgery",
      responsibleRole: "plastic_surgeon",
      description: "การผ่าตัดศัลยกรรมตกแต่งริมฝีปาก เพื่อแก้ไขภาวะปากแหว่ง ต้องงดน้ำและอาหาร 6 ชม. ก่อนผ่าตัด",
      alertBeforeDays: 30
    },
    { 
      id: 2, 
      title: "ติดตามแผลหลังผ่าตัด", 
      ageRange: "4-5 เดือน", 
      type: "Follow-up",
      responsibleRole: "plastic_surgeon",
      description: "ตรวจดูแผลผ่าตัด และประเมินแผลเป็น (Scar Assessment)",
      alertBeforeDays: 7
    },
    { 
      id: 3, 
      title: "ประเมินการพูดและภาษา ครั้งที่ 1", 
      ageRange: "12-18 เดือน", 
      type: "Assessment",
      responsibleRole: "speech_therapist",
      description: "ประเมินพัฒนาการทางภาษาและการออกเสียง ก่อนเริ่มฝึกพูด",
      alertBeforeDays: 14
    },
    { 
      id: 4, 
      title: "ผ่าตัดเพดานโหว่ (Palatoplasty)", 
      ageRange: "18-24 เดือน", 
      type: "Surgery",
      responsibleRole: "plastic_surgeon",
      description: "ผ่าตัดปิดเพดานโหว่เพื่อช่วยในการพูดและการกลืน",
      alertBeforeDays: 60
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Partial<Milestone> | null>(null);

  const handleAddNew = () => {
    setEditingMilestone({
      title: "",
      ageRange: "",
      type: "Follow-up",
      responsibleRole: "coordinator",
      description: "",
      alertBeforeDays: 7
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (ms: Milestone) => {
    setEditingMilestone({ ...ms });
    setIsDialogOpen(true);
  };

  const handleSaveMilestone = () => {
    if (!editingMilestone) return;

    if (editingMilestone.id) {
      // Update existing
      setMilestones(milestones.map(ms => ms.id === editingMilestone.id ? editingMilestone as Milestone : ms));
    } else {
      // Add new
      const newId = Math.max(...milestones.map(m => m.id), 0) + 1;
      setMilestones([...milestones, { ...editingMilestone, id: newId } as Milestone]);
    }
    setIsDialogOpen(false);
    setEditingMilestone(null);
  };

  const handleDelete = (id: number) => {
    setMilestones(milestones.filter(ms => ms.id !== id));
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case "plastic_surgeon": return "ศัลยแพทย์ตกแต่ง";
      case "orthodontist": return "ทันตแพทย์จัดฟัน";
      case "speech_therapist": return "นักแก้ไขการพูด";
      case "ent_doctor": return "โสต ศอ นาสิกแพทย์";
      case "pediatrician": return "กุมารแพทย์";
      case "coordinator": return "พยาบาล/ผู้ประสานงาน";
      default: return role;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case "Surgery": return "bg-red-50 text-red-700 border-red-200";
      case "Therapy": return "bg-green-50 text-green-700 border-green-200";
      case "Follow-up": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar - Plan Selection */}
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>เลือกกลุ่มโรค (Disease Group)</CardTitle>
          <CardDescription>จัดการ Timeline มาตรฐานสำหรับแต่ละกลุ่ม</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant={activePlan === "cleft_lip" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => setActivePlan("cleft_lip")}
          >
            ปากแหว่งอย่างเดียว (Cleft Lip Only)
          </Button>
          <Button 
            variant={activePlan === "cleft_palate" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => setActivePlan("cleft_palate")}
          >
            เพดานโหว่อย่างเดียว (Cleft Palate Only)
          </Button>
          <Button 
            variant={activePlan === "both" ? "default" : "outline"} 
            className="w-full justify-start"
            onClick={() => setActivePlan("both")}
          >
            ปากแหว่งและเพดานโหว่ (Both)
          </Button>
          <Button variant="ghost" className="w-full text-blue-600 border-dashed border border-blue-200 mt-4">
            <Plus className="mr-2 h-4 w-4" /> เพิ่มกลุ่มโรคใหม่
          </Button>
        </CardContent>
      </Card>

      {/* Main Content - Timeline Editor */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Timeline Editor</CardTitle>
            <CardDescription>
              {activePlan === "cleft_lip" ? "ปากแหว่งอย่างเดียว (Cleft Lip Only)" : 
               activePlan === "cleft_palate" ? "เพดานโหว่อย่างเดียว (Cleft Palate Only)" : 
               "ปากแหว่งและเพดานโหว่ (Both)"}
            </CardDescription>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> บันทึก Template
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((ms, index) => (
              <div key={ms.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:border-blue-300 transition-all group cursor-grab active:cursor-grabbing shadow-sm">
                <div className="flex flex-col items-center gap-2 pt-1">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{ms.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className={getTypeColor(ms.type)}>
                          {ms.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                          <Clock className="h-3 w-3" />
                          {ms.ageRange}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 border-blue-200 bg-blue-50 text-blue-700">
                          <UserCircle className="h-3 w-3" />
                          {getRoleLabel(ms.responsibleRole)}
                        </Badge>
                        {ms.alertBeforeDays > 0 && (
                           <span className="text-xs text-orange-600 flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                             <Bell className="h-3 w-3" />
                             เตือนล่วงหน้า {ms.alertBeforeDays} วัน
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {ms.description && (
                    <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 mt-2">
                      <span className="font-medium text-gray-700 mr-2">สิ่งที่ต้องทำ:</span>
                      {ms.description}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-center pl-2 border-l border-gray-100">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => handleEdit(ms)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(ms.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full border-dashed py-8 text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50"
              onClick={handleAddNew}
            >
              <Plus className="mr-2 h-4 w-4" /> เพิ่มขั้นตอนการรักษาใหม่ (Add Milestone)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingMilestone?.id ? "แก้ไขขั้นตอนการรักษา" : "เพิ่มขั้นตอนการรักษาใหม่"}
            </DialogTitle>
            <DialogDescription>
              กำหนดรายละเอียดผู้รับผิดชอบและสิ่งที่ต้องทำในขั้นตอนนี้
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="required">ชื่อขั้นตอน (Milestone Name)</Label>
              <Input 
                id="title" 
                value={editingMilestone?.title || ""} 
                onChange={(e) => setEditingMilestone(prev => ({ ...prev, title: e.target.value }))}
                placeholder="เช่น ผ่าตัดเย็บริมฝีปาก"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ageRange">ช่วงอายุ (Age Range)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    id="ageRange" 
                    className="pl-9"
                    value={editingMilestone?.ageRange || ""}
                    onChange={(e) => setEditingMilestone(prev => ({ ...prev, ageRange: e.target.value }))}
                    placeholder="เช่น 3-6 เดือน" 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">ประเภทกิจกรรม</Label>
                <Select 
                  value={editingMilestone?.type} 
                  onValueChange={(val) => setEditingMilestone(prev => ({ ...prev, type: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Surgery">Surgery (ผ่าตัด)</SelectItem>
                    <SelectItem value="Follow-up">Follow-up (ติดตามผล)</SelectItem>
                    <SelectItem value="Therapy">Therapy (บำบัด/ฝึก)</SelectItem>
                    <SelectItem value="Assessment">Assessment (ประเมิน)</SelectItem>
                    <SelectItem value="Other">Other (อื่นๆ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">สหสาขาวิชาชีพผู้รับผิดชอบ (Specialty/Role)</Label>
              <Select 
                value={editingMilestone?.responsibleRole} 
                onValueChange={(val) => setEditingMilestone(prev => ({ ...prev, responsibleRole: val }))}
              >
                <SelectTrigger className="w-full">
                   <div className="flex items-center gap-2">
                     <Stethoscope className="h-4 w-4 text-gray-500" />
                     <SelectValue placeholder="เลือกผู้รับผิดชอบ" />
                   </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plastic_surgeon">ศัลยแพทย์ตกแต่ง (Plastic Surgeon)</SelectItem>
                  <SelectItem value="orthodontist">ทันตแพทย์จัดฟัน (Orthodontist)</SelectItem>
                  <SelectItem value="speech_therapist">นักแก้ไขการพูด (Speech Therapist)</SelectItem>
                  <SelectItem value="ent_doctor">โสต ศอ นาสิกแพทย์ (ENT)</SelectItem>
                  <SelectItem value="pediatrician">กุมารแพทย์ (Pediatrician)</SelectItem>
                  <SelectItem value="coordinator">พยาบาล/ผู้ประสานงาน (Coordinator)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">รายละเอียด/สิ่งที่ต้องทำ (Action Description)</Label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea 
                  id="description" 
                  className="pl-9 min-h-[80px]"
                  value={editingMilestone?.description || ""}
                  onChange={(e) => setEditingMilestone(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="รายละเอียดคำแนะนำสำหรับการเตรียมตัว หรือสิ่งที่แพทย์ต้องทำ..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="alert">แจ้งเตือนล่วงหน้า (Alert Configuration)</Label>
              <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                    <Bell className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type="number" 
                      className="pl-9"
                      value={editingMilestone?.alertBeforeDays}
                      onChange={(e) => setEditingMilestone(prev => ({ ...prev, alertBeforeDays: parseInt(e.target.value) || 0 }))}
                    />
                 </div>
                 <span className="text-sm text-gray-500">วัน ก่อนถึงกำหนด</span>
              </div>
              <p className="text-xs text-gray-500">ระบบจะส่งแจ้งเตือนไปยัง Case Manager และ Application ของผู้ป่วย</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSaveMilestone} className="bg-blue-600 hover:bg-blue-700">บันทึกข้อมูล</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
