import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Type, 
  CheckSquare, 
  Circle, 
  Calendar, 
  Trash2, 
  Settings, 
  GripVertical, 
  Eye, 
  Save,
  Plus,
  Image,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormField {
  id: string;
  type: "text" | "checkbox" | "radio" | "date" | "image" | "gps";
  label: string;
  required: boolean;
  options?: string[];
}

export function SmartFormBuilder() {
  const [formName, setFormName] = useState("แบบประเมินเบื้องต้น (Initial Assessment)");
  const [fields, setFields] = useState<FormField[]>([
    { id: "1", type: "text", label: "ชื่อ-นามสกุล (Full Name)", required: true },
    { id: "2", type: "radio", label: "เพศ (Gender)", required: true, options: ["ชาย", "หญิง"] },
    { id: "3", type: "date", label: "วันเกิด (Date of Birth)", required: true },
    { id: "4", type: "checkbox", label: "โรคประจำตัว (Medical History)", required: false, options: ["เบาหวาน", "ความดัน", "หัวใจ"] },
  ]);

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: "หัวข้อใหม่ (New Question)",
      required: false,
      options: type === "checkbox" || type === "radio" ? ["ตัวเลือก 1", "ตัวเลือก 2"] : undefined
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">เครื่องมือสร้างฟอร์ม (Form Builder)</h2>
          <p className="text-gray-500">สร้างแบบฟอร์มเก็บข้อมูลและกำหนดเงื่อนไขการแสดงผล</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" /> Save Form
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Toolbox Sidebar */}
        <Card className="lg:col-span-1 h-full overflow-y-auto border-none shadow-none bg-transparent">
          <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-900">เครื่องมือ (Toolbox)</h3>
              <p className="text-sm text-gray-500 mt-1">ลากหรือคลิกเพื่อเพิ่มฟิลด์</p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => addField("text")}
                className="flex items-center gap-4 w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all text-left group"
              >
                <Type className="h-5 w-5 text-blue-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">ข้อความ (Text)</span>
              </button>

              <button 
                onClick={() => addField("checkbox")}
                className="flex items-center gap-4 w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:shadow-sm transition-all text-left group"
              >
                <CheckSquare className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">ตัวเลือกหลายข้อ (Checkbox)</span>
              </button>

              <button 
                onClick={() => addField("radio")}
                className="flex items-center gap-4 w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-sm transition-all text-left group"
              >
                <Circle className="h-5 w-5 text-purple-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">ตัวเลือกเดียว (Radio)</span>
              </button>

              <button 
                onClick={() => addField("date")}
                className="flex items-center gap-4 w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-400 hover:shadow-sm transition-all text-left group"
              >
                <Calendar className="h-5 w-5 text-orange-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">วันที่ (Date)</span>
              </button>

              <button 
                onClick={() => addField("image")}
                className="flex items-center gap-4 w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-pink-400 hover:shadow-sm transition-all text-left group"
              >
                <Image className="h-5 w-5 text-pink-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">รูปภาพ (Image)</span>
              </button>

              <button 
                onClick={() => addField("gps")}
                className="flex items-center gap-4 w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:shadow-sm transition-all text-left group"
              >
                <MapPin className="h-5 w-5 text-red-500 shrink-0" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">พิกัด (GPS)</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Canvas Area */}
        <Card className="lg:col-span-3 h-full bg-gray-50/50 border-dashed overflow-y-auto">
          <CardHeader className="bg-white border-b sticky top-0 z-10">
            <div className="flex items-center gap-4">
               <Label htmlFor="formName" className="whitespace-nowrap">ชื่อฟอร์ม:</Label>
               <Input 
                 id="formName" 
                 value={formName} 
                 onChange={(e) => setFormName(e.target.value)} 
                 className="font-semibold text-lg border-transparent hover:border-gray-200 focus:border-blue-500"
               />
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-4">
             {fields.length === 0 ? (
               <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                 <p>ยังไม่มีฟิลด์ในแบบฟอร์ม</p>
                 <p className="text-sm">เลือกเครื่องมือจากด้านซ้ายเพื่อเริ่มต้น</p>
               </div>
             ) : (
               fields.map((field, index) => (
                 <div key={field.id} className="group relative bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-all">
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                       <Settings className="h-4 w-4" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600" onClick={() => removeField(field.id)}>
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                   
                   <div className="flex gap-4">
                     <div className="mt-1 cursor-move">
                       <GripVertical className="h-5 w-5 text-gray-300 hover:text-gray-500" />
                     </div>
                     <div className="flex-1 space-y-3">
                       <div className="flex items-center gap-3">
                         <Label className="text-base">{field.label}</Label>
                         {field.required && <Badge variant="destructive" className="text-[10px] h-5">Required</Badge>}
                       </div>
                       
                       {/* Preview based on type */}
                       <div className="pointer-events-none opacity-60">
                         {field.type === 'text' && <Input placeholder="คำตอบของคุณ..." />}
                         {field.type === 'date' && <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground"><Calendar className="mr-2 h-4 w-4" />Pick a date</Button>}
                         {field.type === 'radio' && (
                           <div className="flex gap-4">
                             {field.options?.map((opt, i) => (
                               <div key={i} className="flex items-center gap-2">
                                 <div className="h-4 w-4 rounded-full border border-gray-300" />
                                 <span className="text-sm">{opt}</span>
                               </div>
                             ))}
                           </div>
                         )}
                         {field.type === 'checkbox' && (
                           <div className="flex gap-4">
                             {field.options?.map((opt, i) => (
                               <div key={i} className="flex items-center gap-2">
                                 <div className="h-4 w-4 rounded border border-gray-300" />
                                 <span className="text-sm">{opt}</span>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                     </div>
                   </div>
                 </div>
               ))
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
