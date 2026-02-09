import React from 'react';
import { ChevronLeft, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface FundDetailViewProps {
  fund: {
    id: number;
    title: string;
    amount: string;
    status: string;
    date: string;
  };
  onBack: () => void;
}

export default function FundDetailView({ fund, onBack }: FundDetailViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'อนุมัติแล้ว':
        return 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]';
      case 'รอตรวจสอบ':
        return 'bg-[#FEF9C3] text-[#A16207] border-[#FEF08A]';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] p-4 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100">
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h2 className="text-lg font-bold text-slate-800">รายละเอียดคำขอ</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
          <div className="flex justify-between items-start">
             <h3 className="text-xl font-bold text-slate-800">{fund.title}</h3>
             <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(fund.status)}`}>
               {fund.status}
             </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
             <Clock size={16} />
             <span>วันที่ขอ: {fund.date}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 font-medium">จำนวนเงินที่ขอ</label>
            <div className="text-2xl font-bold text-[#49358e] mt-1">{fund.amount}</div>
          </div>

          <div>
            <label className="text-sm text-slate-500 font-medium">เหตุผลความจำเป็น</label>
            <p className="text-slate-800 mt-1 text-sm leading-relaxed">
              ผู้ป่วยมีความจำเป็นต้องใช้อุปกรณ์ทางการแพทย์เพิ่มเติมเพื่อช่วยในการฟื้นฟูสภาพร่างกายที่บ้าน ตามคำแนะนำของแพทย์เจ้าของไข้ แต่เนื่องจากอุปกรณ์ดังกล่าวมีราคาสูงและไม่อยู่ในสิทธิการรักษา
            </p>
          </div>

          <div>
            <label className="text-sm text-slate-500 font-medium">เอกสารแนบ</label>
            <div className="flex gap-3 mt-2">
              <div className="w-20 h-20 bg-slate-100 rounded-lg flex flex-col items-center justify-center border border-slate-200 text-slate-400">
                 <FileText size={24} />
                 <span className="text-[10px] mt-1">ใบรับรองแพทย์</span>
              </div>
              <div className="w-20 h-20 bg-slate-100 rounded-lg flex flex-col items-center justify-center border border-slate-200 text-slate-400">
                 <FileText size={24} />
                 <span className="text-[10px] mt-1">ใบเสนอราคา</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
