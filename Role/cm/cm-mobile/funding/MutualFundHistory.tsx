import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Calendar, 
  Banknote, 
  Clock, 
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import { MutualFundDetail } from './MutualFundDetail';
import { StatusBarIPhone16Main } from "../../../../components/shared/layout/TopHeader";

interface MutualFundHistoryProps {
  patient: any;
  onBack: () => void;
}

export const MutualFundHistory: React.FC<MutualFundHistoryProps> = ({ patient, onBack }) => {
  const [selectedFund, setSelectedFund] = useState<any | null>(null);

  // If viewing detail, show Detail component
  if (selectedFund) {
    return (
      <MutualFundDetail 
        fund={selectedFund} 
        onBack={() => setSelectedFund(null)} 
      />
    );
  }

  // Helper to map patient.funds to display format if needed, 
  // currently assuming patient.funds structure matches what we need or mapping it here.
  // The patientData.ts maps 'funds' array with { name, amount, status, reason, history... }
  
  // We need to make sure we display all grants (Approved, Pending, Rejected)
  // In patientData.ts, 'funds' might have been filtered or processed. 
  // Let's ensure we use the 'funding' array or 'funds' array correctly.
  // Actually, in patientData.ts mapping:
  // 'funds' array contains consolidated grants.
  // Let's use that.

  const funds = patient.funds || [];

  return (
    <div className="fixed inset-0 z-[50000] bg-[#f8f9fa] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] animate-in fade-in slide-in-from-right-4 duration-300">
        <style>{`
            .fixed.bottom-0.left-0.w-full.bg-white.z-50 { display: none !important; }
        `}</style>

      {/* Header */}
      <div className="bg-[#7066a9] shrink-0 z-20 shadow-md">
        <StatusBarIPhone16Main />
        <div className="h-[64px] px-4 flex items-center gap-3">
          <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-white text-lg font-bold">ประวัติการขอกองทุน</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Summary Card (Optional) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden">
                <img src={patient.image} alt={patient.name} className="w-full h-full object-cover" />
            </div>
            <div>
                <h2 className="font-bold text-slate-800 text-[20px]">{patient.name}</h2>
                <p className="text-sm text-slate-500">HN: {patient.hn}</p>
            </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-500 ml-1 text-[16px]">รายการทั้งหมด ({funds.length})</h3>

        {funds.length === 0 ? (
             <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                 <Banknote className="w-12 h-12 mx-auto mb-4 opacity-20" />
                 <p>ไม่พบประวัติการขอทุน</p>
             </div>
        ) : (
            <div className="space-y-3">
                {funds.map((fund: any, index: number) => {
                    // Map status to display
                    const status = fund.status || 'Approved';
                    let StatusIcon = CheckCircle2;
                    let statusColor = 'text-green-500';
                    let statusBg = 'bg-green-50';
                    let statusLabel = 'อนุมัติ';

                    if (status === 'Pending') {
                        StatusIcon = Clock;
                        statusColor = 'text-orange-500';
                        statusBg = 'bg-[#fff0e1]'; // Matches FundingSystem
                        statusLabel = 'รอพิจารณา';
                    } else if (status === 'Rejected') {
                        StatusIcon = XCircle;
                        statusColor = 'text-red-500';
                        statusBg = 'bg-red-50';
                        statusLabel = 'ปฏิเสธ';
                    }

                    // Prepare object for Detail View
                    const detailObj = {
                        ...fund,
                        type: fund.name, // MutualFundDetail uses 'type' or 'reason' as name
                        patientName: patient.name,
                        patientId: patient.hn,
                        patientImage: patient.image,
                        requestDate: fund.date || '20 ต.ค. 66' // Fallback if no date in this object
                    };

                    return (
                        <Card 
                            key={index}
                            onClick={() => setSelectedFund(detailObj)}
                            className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all bg-white cursor-pointer group"
                        >
                            <CardContent className="p-3">
                                <div className="flex flex-col gap-1">
                                    {/* Header Row */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0 pr-2">
                                            {/* Use Fund Name as Main Title in History View */}
                                            <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                                {fund.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <FileText className="w-[14px] h-[14px] text-[#6a7282] shrink-0" />
                                                <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[16px] leading-[16px] line-clamp-1">
                                                    {fund.reason || 'ไม่ระบุรายละเอียด'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        {status === 'Pending' && (
                                            <div className="bg-[#fff0e1] px-2 py-0.5 rounded-lg shrink-0">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#ff9f43] text-[12px]">รอพิจารณา</span>
                                            </div>
                                        )}
                                        {(status === 'Approved' || status === 'อนุมัติ') && (
                                            <div className="bg-[#E0FBFC] px-2 py-0.5 rounded-lg shrink-0">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#00CFE8] text-[12px]">อนุมัติ</span>
                                            </div>
                                        )}
                                        {status === 'Rejected' && (
                                            <div className="bg-red-50 px-2 py-0.5 rounded-lg shrink-0">
                                                <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-red-500 text-[12px]">ปฎิเสธ</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Row */}
                                    <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-dashed border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Banknote className="w-[16px] h-[16px] text-[#7367f0]" />
                                            <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[20px]">
                                                {typeof fund.amount === 'number' ? fund.amount.toLocaleString() : fund.amount} บาท
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {status === 'Pending' ? (
                                                <Clock className="w-3 h-3 text-gray-400" />
                                            ) : (
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                            )}
                                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[14px]">
                                                {fund.date || 'ไม่ระบุวันที่'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};