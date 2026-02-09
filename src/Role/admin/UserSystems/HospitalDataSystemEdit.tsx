import React from 'react';
import { Button } from "../../../components/ui/button";
import { ChevronLeft } from "lucide-react";

interface HospitalDataSystemEditProps {
    onBack: () => void;
}

export function HospitalDataSystemEdit({ onBack }: HospitalDataSystemEditProps) {
    return (
        <div className="p-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
                <ChevronLeft className="w-4 h-4 mr-2" />
                ย้อนกลับ
            </Button>
            <div className="text-center p-8 text-gray-500">
                ยังไม่เปิดให้บริการส่วนแก้ไขข้อมูล (Coming Soon)
            </div>
        </div>
    );
}
