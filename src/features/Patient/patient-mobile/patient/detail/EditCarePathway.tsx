import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Button } from "../../../../../components/ui/button";
import { Badge } from "../../../../../components/ui/badge";
import { cn } from "../../../../../components/ui/utils";
import { StatusBarIPhone16Main } from "../../../../../components/shared/layout/TopHeader";
import { EditStageDetail } from '../EditStageDetail';
import { toast } from 'sonner';

interface EditCarePathwayProps {
  onBack: () => void;
  onSave?: () => void;
  patient?: any;
}

export function EditCarePathway({ onBack, onSave, patient }: EditCarePathwayProps) {
  // Dummy patient data if not provided
  const patientData = patient || {
    name: "ด.ช. รักษา ดีจริง",
    dob: "10 ม.ค. 66",
    diagnosis: "ปากแหว่งเพดานโหว่ (Cleft Lip & Palate)"
  };

  // Mock initial timeline data
  const [stages, setStages] = useState([
    { 
      id: 1, 
      ageRange: "แรกเกิด", 
      treatment: "การให้คำปรึกษาและส่งต่อ", 
      date: "10 ม.ค. 66", 
      status: "completed",
    },
    { 
      id: 2, 
      ageRange: "3 เดือน", 
      treatment: "ผ่าตัดเย็บซ่อมริมฝีปาก", 
      date: "15 เม.ย. 66", 
      status: "completed",
    },
    { 
      id: 3, 
      ageRange: "9-18 เดือน", 
      treatment: "ผ่าตัดเย็บซ่อมเพดานปาก", 
      date: "Auto-calc: 10 ต.ค. 66", 
      status: "pending", // Will show as overdue in UI logic below if needed, or just pending
    },
    { 
      id: 4, 
      ageRange: "2-5 ปี", 
      treatment: "ฝึกพูดและประเมินพัฒนาการ", 
      date: "-", 
      status: "overdue", // Overdue Example
    }
  ]);

  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [isAddingStage, setIsAddingStage] = useState(false);

  const deleteStage = (id: number) => {
    if (id === -1) {
        setIsAddingStage(false);
        return;
    }
    setStages(stages.filter(stage => stage.id !== id));
    setEditingStageId(null);
    toast.success("ลบขั้นตอนการรักษาเรียบร้อยแล้ว");
  };

  const handleSaveStage = (updatedStage: any) => {
    if (updatedStage.id === -1) {
        // Add new stage
        const newStage = {
            ...updatedStage,
            id: Math.max(...stages.map(s => s.id)) + 1
        };
        setStages([...stages, newStage]);
        setIsAddingStage(false);
        toast.success("เพิ่มขั้นตอนการรักษาเรียบร้อยแล้ว");
    } else {
        // Update existing stage
        setStages(stages.map(stage => stage.id === updatedStage.id ? updatedStage : stage));
        setEditingStageId(null);
        toast.success("บันทึกข้อมูลเรียบร้อยแล้ว");
    }
  };

  const editingStage = isAddingStage 
    ? { id: -1, ageRange: "", treatment: "", date: "Auto-calc: -", status: "pending" }
    : stages.find(s => s.id === editingStageId);

  // If editing a specific stage or adding a new one, show the detail page
  if ((editingStageId && editingStage) || isAddingStage) {
    return (
        <EditStageDetail 
            stage={editingStage}
            patient={patientData}
            onBack={() => {
                setEditingStageId(null);
                setIsAddingStage(false);
            }}
            onSave={handleSaveStage}
            onDelete={deleteStage}
        />
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-50 w-full h-[100dvh] overflow-y-auto flex flex-col font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      
      {/* Header */}
      <div className="sticky top-0 z-[10000] w-full bg-[#7066a9] shadow-md flex flex-col">
        {/* Status Bar */}
        <div className="w-full">
            <StatusBarIPhone16Main />
        </div>
        
        {/* Navigation Bar */}
        <div className="h-[64px] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-white text-lg font-bold">แก้ไขแผนการรักษา</h1>
            </div>
        </div>
        
        {/* Patient Context Bar */}
        <div className="px-4 py-2 bg-white border-b border-slate-200 flex flex-col text-base text-slate-700 shadow-sm relative z-10 w-full">
            <div className="flex items-center justify-between w-full">
                <span className="font-bold text-[#7066a9]">ผู้ป่วย:</span> 
                <span className="font-medium truncate ml-2 text-right">{patientData.name}</span>
            </div>
            <div className="flex items-center justify-between w-full mt-0.5">
                <span className="font-bold text-[#7066a9]">วันเกิด:</span> 
                <span className="font-medium truncate ml-2 text-right">{patientData.dob}</span>
            </div>
            <div className="flex items-center justify-between w-full mt-0.5">
                <span className="font-bold text-[#7066a9] whitespace-nowrap">การวินิจฉัย:</span> 
                <span className="font-medium truncate ml-2 text-right">{patientData.diagnosis}</span>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full pb-24">
        
        {/* Add Button */}
        <button 
            onClick={() => setIsAddingStage(true)}
            className="w-full mb-8 flex items-center justify-center gap-2 bg-[#6a5acd] hover:bg-[#5a4db8] text-white text-[14px] font-['IBM_Plex_Sans_Thai'] h-12 rounded-[10px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all active:scale-95"
        >
            <Plus size={18} /> เพิ่มขั้นตอนการรักษา
        </button>

        {/* Timeline */}
        <div className="relative pl-4 space-y-8">
            {/* Vertical Line */}
            <div className="absolute left-[23px] top-4 bottom-8 w-[2px] bg-slate-200 z-0"></div>

            {stages.map((stage) => {
                const isOverdue = stage.status === 'overdue';
                
                return (
                    <div key={stage.id} className="relative pl-12 z-10">
                        {/* Timeline Dot */}
                        <div className={cn(
                            "absolute left-3 top-6 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-sm z-20 flex items-center justify-center",
                            isOverdue ? "bg-red-500 ring-2 ring-red-100" : 
                            stage.status === 'completed' ? "bg-green-500 ring-2 ring-green-100" : 
                            "bg-blue-500 ring-2 ring-blue-100"
                        )}>
                            {stage.status === 'completed' && <CheckCircle2 size={12} className="text-white" />}
                            {isOverdue && <AlertCircle size={12} className="text-white" />}
                        </div>

                        {/* Card Container */}
                        <div className={cn(
                            "bg-white rounded-2xl border transition-all duration-300",
                            isOverdue ? "border-red-200 shadow-sm shadow-red-50" : 
                            "border-slate-200 shadow-sm hover:border-blue-200"
                        )}>
                            
                            {/* View Mode (Now the only mode in list) */}
                            <div className="p-4 flex items-start justify-between group cursor-pointer hover:bg-slate-50 rounded-2xl transition-colors"
                                 onClick={() => setEditingStageId(stage.id)}
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-md",
                                            isOverdue ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600"
                                        )}>
                                            {stage.ageRange}
                                        </span>
                                        {isOverdue && (
                                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-medium border-none bg-red-100 text-red-600 hover:bg-red-200 shadow-none">
                                                ล่าช้า (Overdue)
                                            </Badge>
                                        )}
                                    </div>
                                    <h4 className={cn(
                                        "font-bold text-base mb-1",
                                        isOverdue ? "text-red-700" : "text-slate-800"
                                    )}>
                                        {stage.treatment}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} /> {stage.date}
                                        </div>
                                        {stage.status === 'completed' && (
                                            <span className="text-green-600 font-medium flex items-center gap-1">
                                                <CheckCircle2 size={12} /> เสร็จสิ้น
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1 opacity-100 transition-opacity">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingStageId(stage.id);
                                        }}
                                        className="h-8 w-8 text-slate-400 hover:text-[#7066a9] hover:bg-purple-50 rounded-full"
                                    >
                                        <Pencil size={16} />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteStage(stage.id);
                                        }}
                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

      </div>

      {/* Footer / History Log */}
      <div className="bg-slate-50 p-4 text-center border-t border-slate-200 mt-auto">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Clock size={12} />
              ประวัติการแก้ไขล่าสุด: โดย พญ. สมหญิง เมื่อ 15/01/26 10:30น. (Last edited by Dr. Somying)
          </p>
      </div>

    </div>
  );
}
