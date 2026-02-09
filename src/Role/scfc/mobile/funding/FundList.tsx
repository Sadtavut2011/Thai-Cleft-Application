import React from 'react';
import { 
  ArrowRight, 
  Calendar,
  Building2,
  AlertCircle,
  Coins,
  FileText,
  Banknote,
  Clock
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { FundRequest, FundStatus, UrgencyLevel } from "./FundDetailMobile";

interface FundListProps {
  data: FundRequest[];
  onSelect: (item: FundRequest) => void;
}

export function FundList({ data, onSelect }: FundListProps) {
  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'Emergency': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Urgent': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-teal-50 text-teal-600 border-teal-100';
    }
  };

  const getStatusColor = (status: FundStatus) => {
      switch(status) {
          case 'Pending': return 'text-amber-600 bg-amber-50';
          case 'Approved': return 'text-blue-600 bg-blue-50';
          case 'Rejected': return 'text-rose-600 bg-rose-50';
          case 'Received': return 'text-purple-600 bg-purple-50';
          case 'Disbursed': return 'text-emerald-600 bg-emerald-50';
          default: return 'text-slate-600 bg-slate-50';
      }
  };
  
  const getStatusLabel = (status: FundStatus) => {
      switch(status) {
          case 'Pending': return 'รอพิจารณา';
          case 'Approved': return 'อนุมัติแล้ว';
          case 'Rejected': return 'ปฏิเสธ';
          case 'Received': return 'ได้รับเงินแล้ว';
          case 'Disbursed': return 'จ่ายเงินแล้ว';
          default: return status;
      }
  };

  const getUrgencyLabel = (level: UrgencyLevel) => {
      switch(level) {
          case 'Normal': return 'ปกติ';
          case 'Urgent': return 'เร่งด่วน';
          case 'Emergency': return 'วิกฤต';
          default: return level;
      }
  };

  return (
    <div className="pb-4">
        <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-slate-700 text-sm">รายการขอทุน</h3>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{data.length} รายการ</span>
        </div>
        
        <div className="space-y-3">
            {data.map((req) => (
                <Card 
                    key={req.id}
                    onClick={() => onSelect(req)}
                    className="bg-white border-slate-200 shadow-sm rounded-xl p-3 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
                >
                    <div className="flex flex-col gap-1">
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-2">
                                <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[14px] leading-[20px] truncate">
                                    {req.patientName} <span className="ml-1 font-normal text-[#6a7282]">{req.hn}</span>
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <FileText className="w-[14px] h-[14px] text-[#6a7282]" />
                                    <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px] leading-[16px] truncate">
                                        {req.fundType}
                                    </span>
                                </div>
                            </div>

                            <div className={cn("px-2 py-0.5 rounded-lg flex-shrink-0", getStatusColor(req.status))}>
                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[12px] whitespace-nowrap">
                                   {getStatusLabel(req.status)}
                                </span>
                            </div>
                        </div>

                        {/* Details Row */}
                        <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-gray-100">
                            <div className="flex items-center gap-2">
                                <Banknote className="w-[16px] h-[16px] text-[#7367f0]" />
                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[14px]">
                                    {req.amount.toLocaleString()} บาท
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[12px]">
                                    {req.requestDate}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
}
