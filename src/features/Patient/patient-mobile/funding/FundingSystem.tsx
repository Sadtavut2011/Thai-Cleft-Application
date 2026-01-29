import React, { useState } from 'react';
import { 
  Clock, 
  Wallet, 
  MapPin, 
  Car, 
  CheckCircle2, 
  History,
  AlertCircle,
  Banknote,
  ChevronRight,
  FileText
} from 'lucide-react';
import FundDetailView from '../FundDetailView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
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

// Mock Data for Travel Reimbursements (from Thai Cleft Link DB)
const TRAVEL_HISTORY = [
  {
    id: 't1',
    date: '15 ก.พ. 68',
    location: 'โรงพยาบาลมหาราชนครเชียงใหม่',
    amount: '500 บ.',
    status: 'Paid', // จ่ายแล้ว
    visitType: 'ติดตามอาการ'
  },
  {
    id: 't2',
    date: '10 ม.ค. 68',
    location: 'โรงพยาบาลมหาราชนครเชียงใหม่',
    amount: '450 บ.',
    status: 'Paid',
    visitType: 'ทำฟัน'
  },
  {
    id: 't3',
    date: '12 ธ.ค. 67',
    location: 'โรงพยาบาลมหาราชนครเชียงใหม่',
    amount: '500 บ.',
    status: 'Paid',
    visitType: 'ผ่าตัด'
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

  const totalTravelReimbursed = TRAVEL_HISTORY.reduce((sum, item) => {
    return sum + parseInt(item.amount.replace(/[^0-9]/g, ''));
  }, 0);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] p-4 overflow-y-auto pb-24 md:pb-4 font-['IBM_Plex_Sans_Thai']">
      <h2 className="text-xl font-bold text-slate-800 mb-4">ทุนและการเบิกจ่าย</h2>
      
      <Tabs defaultValue="grants" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4 bg-white p-1 h-12 rounded-xl shadow-sm border border-slate-100">
          <TabsTrigger 
            value="grants" 
            className="rounded-lg data-[state=active]:bg-[#7066a9] data-[state=active]:text-white text-slate-500"
          >
            <Wallet size={16} className="mr-2" />
            ทุนรักษาพยาบาล
          </TabsTrigger>
          <TabsTrigger 
            value="travel"
            className="rounded-lg data-[state=active]:bg-[#7066a9] data-[state=active]:text-white text-slate-500"
          >
            <Car size={16} className="mr-2" />
            ค่าเดินทาง
          </TabsTrigger>
        </TabsList>

        {/* --- Grants Tab --- */}
        <TabsContent value="grants" className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
          
          {/* Summary Card - Updated to match Travel Tab */}
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

          {/* Grants List - Updated to match Travel List Style */}
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

        </TabsContent>

        {/* --- Travel Tab --- */}
        <TabsContent value="travel" className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
          
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-[#7066a9] to-[#8d84c2] rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
             <div className="flex items-center gap-3 mb-2 opacity-90">
                <div className="p-2 bg-white/20 rounded-lg">
                   <Car size={20} className="text-white" />
                </div>
                <span className="text-sm font-medium">ยอดรวมเงินช่วยเหลือค่าเดินทาง</span>
             </div>
             <div className="text-3xl font-bold mt-1">
                {totalTravelReimbursed.toLocaleString()} <span className="text-lg font-normal opacity-80">บาท</span>
             </div>
             <div className="mt-4 text-xs bg-white/10 inline-block px-3 py-1 rounded-full border border-white/20">
                ข้อมูลจาก Thai Cleft Link
             </div>
          </div>

          {/* History List */}
          <div>
             <div className="flex items-center justify-between mb-3 pl-1">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">ประวัติการเบิกเงินค่าเดินทาง</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                   <History size={12} />
                   ล่าสุด: 15 ก.พ. 68
                </span>
             </div>
             
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
                {TRAVEL_HISTORY.map((item, index) => (
                   <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4">
                      <div className="flex-shrink-0 flex flex-col items-center justify-center w-12 bg-slate-100 rounded-xl text-slate-500 text-xs font-bold py-2 h-14">
                         <span>{item.date.split(' ')[0]}</span>
                         <span>{item.date.split(' ')[1]}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{item.location}</h4>
                            <span className="text-green-600 font-bold text-sm shrink-0">+{item.amount}</span>
                         </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                               <MapPin size={12} />
                               {item.visitType}
                            </div>
                            <BadgeStatus status={item.status} />
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="text-center text-xs text-slate-400 mt-6 px-8">
             หากพบข้อมูลไม่ถูกต้อง กรุณาติดต่อ Case Manager <br/>หรือเจ้าหน้าที่ประจำศูนย์
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}

function BadgeStatus({ status }: { status: string }) {
   if (status === 'Paid') {
      return (
         <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100 font-medium">
            <CheckCircle2 size={10} />
            โอนแล้ว
         </span>
      );
   }
   return (
      <span className="flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
         {status}
      </span>
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
