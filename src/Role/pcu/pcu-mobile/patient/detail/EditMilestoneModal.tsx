import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

interface EditMilestoneModalProps {
    milestone: any;
    onBack: () => void;
    onSave: (data: any) => void;
    onDelete: () => void;
}

export const EditMilestoneModal: React.FC<EditMilestoneModalProps> = ({ milestone, onBack, onSave, onDelete }) => {
    const [formData, setFormData] = useState(milestone || {});

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold">แก้ไขข้อมูลพัฒนาการ</h2>
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 p-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ช่วงอายุ</label>
                        <input
                            type="text"
                            value={formData.age || ''}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ระยะการรักษา</label>
                        <input
                            type="text"
                            value={formData.stage || ''}
                            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
                        <select
                            value={formData.status || 'pending'}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="pending">รอการดำเนินการ</option>
                            <option value="current">กำลังดำเนินการ</option>
                            <option value="completed">เสร็จสิ้น</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t flex gap-3">
                <button
                    onClick={onDelete}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold"
                >
                    <Trash2 size={20} />
                    ลบ
                </button>
                <button
                    onClick={() => onSave(formData)}
                    className="flex-[2] flex items-center justify-center gap-2 bg-[#7066a9] text-white py-3 rounded-xl font-bold"
                >
                    <Save size={20} />
                    บันทึก
                </button>
            </div>
        </div>
    );
};
