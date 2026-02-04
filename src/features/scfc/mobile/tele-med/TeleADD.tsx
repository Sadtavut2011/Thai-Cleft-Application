import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, Smartphone, Video, AlertCircle, Save } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";

interface TeleADDProps {
    onBack: () => void;
    onSubmit: (data: any) => void;
}

export function TeleADD({ onBack, onSubmit }: TeleADDProps) {
    const [formData, setFormData] = useState({
        patientName: '',
        hn: '',
        sourceUnit: '',
        platform: 'Zoom',
        urgency: 'Normal',
        details: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-3 sticky top-0 z-20 border-b border-slate-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">นัดหมาย Tele-Consult</h1>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">สร้างรายการใหม่</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                {/* Patient Info Section */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <User size={16} className="text-teal-600" /> ข้อมูลผู้ป่วย
                    </h2>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="patientName" className="text-xs font-bold text-slate-600">ชื่อ-นามสกุล</Label>
                            <Input
                                id="patientName"
                                placeholder="ระบุชื่อผู้ป่วย"
                                value={formData.patientName}
                                onChange={(e) => handleChange('patientName', e.target.value)}
                                className="bg-slate-50 border-slate-200"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hn" className="text-xs font-bold text-slate-600">HN</Label>
                                <Input
                                    id="hn"
                                    placeholder="ระบุ HN"
                                    value={formData.hn}
                                    onChange={(e) => handleChange('hn', e.target.value)}
                                    className="bg-slate-50 border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="urgency" className="text-xs font-bold text-slate-600">ความเร่งด่วน</Label>
                                <Select value={formData.urgency} onValueChange={(val) => handleChange('urgency', val)}>
                                    <SelectTrigger className="bg-slate-50 border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Normal">ปกติ (Normal)</SelectItem>
                                        <SelectItem value="Urgent">ด่วน (Urgent)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consultation Details */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Video size={16} className="text-teal-600" /> รายละเอียดการปรึกษา
                    </h2>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="platform" className="text-xs font-bold text-slate-600">ช่องทาง (Platform)</Label>
                            <Select value={formData.platform} onValueChange={(val) => handleChange('platform', val)}>
                                <SelectTrigger className="bg-slate-50 border-slate-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Zoom">Zoom</SelectItem>
                                    <SelectItem value="MS Teams">MS Teams</SelectItem>
                                    <SelectItem value="Hospital Link">Hospital Link</SelectItem>
                                    <SelectItem value="Line">Line Video Call</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sourceUnit" className="text-xs font-bold text-slate-600">หน่วยงานต้นทาง</Label>
                            <Input
                                id="sourceUnit"
                                placeholder="เช่น รพ.สต. บ้านหนองหอย"
                                value={formData.sourceUnit}
                                onChange={(e) => handleChange('sourceUnit', e.target.value)}
                                className="bg-slate-50 border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="details" className="text-xs font-bold text-slate-600">รายละเอียดเพิ่มเติม</Label>
                            <Textarea
                                id="details"
                                placeholder="ระบุอาการเบื้องต้น หรือ สาเหตุที่ต้องการปรึกษา..."
                                value={formData.details}
                                onChange={(e) => handleChange('details', e.target.value)}
                                className="bg-slate-50 border-slate-200 min-h-[100px]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-8 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-30">
                <Button
                    onClick={() => onSubmit(formData)}
                    className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 text-base"
                >
                    <Save size={20} className="mr-2" /> บันทึกการนัดหมาย
                </Button>
            </div>
        </div>
    );
}
