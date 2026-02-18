import React, { useState } from 'react';
import { 
  Clock, 
  Wallet, 
  CheckCircle2, 
  History,
  FileText
} from 'lucide-react';
import FundDetailView from '../FundDetailView';
import { cn } from '../../../../components/ui/utils';

// Mock Data for Grants
const GRANTS_DATA = [
  {
    id: 1,
    title: 'ค่าอุปกรณ์ทางการแพทย์',
    amount: '1,500 บ.',
    status: 'รอตรวจสอบ',
    date: '01 ก.ย. 68',
    category: 'Equipment'
  },
  {
    id: 2,
    title: 'ค่าผ่าตัดส่วนเกิน',
    amount: '500 บ.',
    status: 'อนุมัติแล้ว',
    date: '15 ส.ค. 68',
    category: 'Surgery'
  },
  {
    id: 3,
    title: 'ค่าผ่าตัดเย็บเพดานปาก',
    amount: '2,000 บ.',
    status: 'อนุมัติแล้ว',
    date: '10 มิ.ย. 68',
    category: 'Nutrition'
  }
];

export function FundingSystem(props: any) {
  const [selectedFund, setSelectedFund] = useState<any>(null);

  if (selectedFund) {
      return <FundDetailView fund={selectedFund} onBack={() => setSelectedFund(null)} />;
  }

  // Filter Grants
  const activeGrants = GRANTS_DATA.filter(g => g.status === 'รอตรวจสอบ' || g.status === 'กำลังดำเนินการ');
  const historyGrants = GRANTS_DATA.filter(g => g.status === 'อนุมัติแล้ว' || g.status === 'ปฏิเสธ');
  const allGrants = [...activeGrants, ...historyGrants];

  const totalGrantAmount = historyGrants.reduce((sum, item) => {
    return sum + parseInt(item.amount.replace(/[^0-9]/g, ''));
  }, 0);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] p-4 overflow-y-auto pb-24 md:pb-4 font-['IBM_Plex_Sans_Thai'] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <h2 className="text-xl font-bold text-slate-800 mb-4">ทุนรักษาพยาบาล</h2>
      
      <div className="space-y-4">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-[#7066a9] to-[#8d84c2] rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
           <div className="flex items-center gap-3 mb-2 opacity-90">
              <div className="p-2 bg-white/20 rounded-lg">
                 <Wallet size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium">ยอดรวมทุนที่ได้รับ (Operation Smile)</span>
           </div>
           <div className="text-3xl font-bold mt-1">
              {totalGrantAmount.toLocaleString()} <span className="text-lg font-normal opacity-80">บาท</span>
           </div>
           <div className="mt-4 text-xs bg-white/10 inline-block px-3 py-1 rounded-full border border-white/20">
              ข้อมูลจาก Operation Smile Thailand
           </div>
        </div>

        {/* Grants List */}
        <div>
           <div className="flex items-center justify-between mb-3 pl-1">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">ประวัติการขอทุน</h3>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                 <History size={12} />
                 ล่าสุด: 01 ก.ย. 68
              </span>
           </div>
           
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
              {allGrants.map((grant) => (
                 <div 
                    key={grant.id} 
                    onClick={() => setSelectedFund(grant)}
                    className="p-4 hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer"
                 >
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 bg-slate-100 rounded-xl text-slate-500 text-xs font-bold py-2 h-14">
                       <span>{grant.date.split(' ')[0]}</span>
                       <span>{grant.date.split(' ')[1]}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{grant.title}</h4>
                          <span className="text-[#7066a9] font-bold text-sm shrink-0">{grant.amount}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                             <FileText size={12} />
                             {grant.category}
                          </div>
                          <GrantBadgeStatus status={grant.status} />
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="text-center text-xs text-slate-400 mt-6 px-8">
           หากพบข้อมูลไม่ถูกต้อง กรุณาติดต่อ Case Manager <br/>หรือเจ้าหน้าที่มูลนิธิ
        </div>
      </div>
    </div>
  );
}

function GrantBadgeStatus({ status }: { status: string }) {
    switch (status) {
      case 'อนุมัติแล้ว':
        return (
            <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 font-medium">
                <CheckCircle2 size={10} />
                อนุมัติแล้ว
            </span>
        );
      case 'รอตรวจสอบ':
        return (
            <span className="flex items-center gap-1 text-[10px] bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full border border-yellow-100 font-medium">
                <Clock size={10} />
                รอตรวจสอบ
            </span>
        );
      default:
        return (
            <span className="flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                {status}
            </span>
        );
    }
}

export default FundingSystem;