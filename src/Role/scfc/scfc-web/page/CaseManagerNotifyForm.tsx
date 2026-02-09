import React from 'react';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { ArrowLeft, Send } from 'lucide-react';

interface CaseManagerNotifyFormProps {
    patient: any;
    onBack: () => void;
    onSubmit: () => void;
}

export const CaseManagerNotifyForm: React.FC<CaseManagerNotifyFormProps> = ({ patient, onBack, onSubmit }) => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold text-[#49358E]">แจ้งเตือน Case Manager</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-2">ข้อมูลผู้ป่วย</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p><span className="text-slate-500">ชื่อ-สกุล:</span> {patient?.name}</p>
                        <p><span className="text-slate-500">HN:</span> {patient?.hn}</p>
                        <p><span className="text-slate-500">อายุ:</span> {patient?.age}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>รายละเอียดเพิ่มเติม / อาการเบื้องต้น</Label>
                    <Textarea placeholder="ระบุรายละเอียด..." className="h-32" />
                </div>

                <div className="space-y-2">
                    <Label>ระดับความเร่งด่วน</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="urgency" className="text-[#49358E]" defaultChecked />
                            <span>ปกติ (Standard)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="urgency" className="text-orange-500" />
                            <span>เร่งด่วน (Urgent)</span>
                        </label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={onBack}>ยกเลิก</Button>
                    <Button className="bg-[#49358E] hover:bg-[#3b2a75] text-white" onClick={onSubmit}>
                        <Send className="w-4 h-4 mr-2" />
                        ส่งแจ้งเตือน
                    </Button>
                </div>
            </div>
        </div>
    );
};
