import React, { useState } from 'react';
import { CheckCircle, XCircle, Plus, ChevronLeft } from 'lucide-react';
import FundRequestForm from './forms/FundRequestForm';

// --- MOCK DATA ---
const INITIAL_FUNDS = [
  { id: 'FUND-001', patient: 'นางมาลี สีสวย', amount: 5000, reason: 'ค่าเดินทางฟอกไต', status: 'approved', date: '2023-10-20' },
  { id: 'FUND-002', patient: 'นายดำรง คงมั่น', amount: 2500, reason: 'อุปกรณ์ทำแผลกดทับ', status: 'pending', date: '2023-10-26' },
];

const Badge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'รอการตอบรับ': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    'ยอมรับการส่งตัว': 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    'ปฏิเสธการส่งตัว': 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-red-100 text-red-800 border-red-200',
    'เร่งด่วน': 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    low: 'bg-green-100 text-green-800 border-green-200',
    urgent: 'bg-red-500 text-white',
    normal: 'bg-blue-500 text-white',
    visited: 'bg-gray-400 text-white',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    'ขอส่งตัว': 'bg-blue-50 text-blue-600 border-blue-200',
    referred: 'bg-blue-50 text-blue-600 border-blue-200',
    inbound: 'bg-blue-100 text-blue-800 border-blue-200',
    outbound: 'bg-purple-100 text-purple-800 border-purple-200'
  };
  
  const labels: Record<string, string> = {
    pending: 'รออนุมัติ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ปฏิเสธ',
    high: 'วิกฤต',
    medium: 'ปานกลาง',
    low: 'ทั่วไป',
    urgent: 'เร่งด่วน',
    normal: 'ทั่วไป',
    visited: 'เยี่ยมแล้ว',
    'รอการตอบรับ': 'รอการตอบรับ',
    'ยอมรับการส่งตัว': 'ยอมรับการส่งตัว',
    'ปฏิเสธการส่งตัว': 'ปฏิเสธการส่งตัว',
    'ขอส่งตัว': 'ขอส่งตัว',
    inbound: 'รับเข้า',
    outbound: 'ส่งออก'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs border ${styles[status] || 'bg-gray-100'} whitespace-nowrap`}>
      {labels[status] || status}
    </span>
  );
};

export function FundingSystem({ onBack, onRequestFund, initialPatient }: { onBack?: () => void, onRequestFund?: () => void, initialPatient?: any }) {
  const [funds] = useState(INITIAL_FUNDS);
  const [showForm, setShowForm] = useState(!!initialPatient);

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-20">
            <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-bold">ระบบขอทุนสงเคราะห์</h1>
      </div>

      <div className="flex-1 overflow-auto no-scrollbar p-4 md:p-6">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Status & History */}
          <div className="order-2 lg:order-2 lg:col-span-2 space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-4 text-slate-800">สถานะล่าสุด</h3>
              {funds.filter(f => f.status === 'pending').map(fund => (
                <div key={fund.id} className="border rounded-lg p-4 mb-3 relative overflow-hidden hover:shadow-sm transition-all">
                  <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                  <div className="flex justify-between items-start">
                      <div>
                          <h4 className="font-bold text-slate-800">{fund.patient}</h4>
                          <p className="text-sm text-slate-500 line-clamp-1">{fund.reason}</p>
                          <p className="text-sm font-medium text-slate-700 mt-1">{fund.amount.toLocaleString()} บาท</p>
                      </div>
                      <Badge status={fund.status} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-4 text-slate-800">ประวัติ (History)</h3>
              <div className="space-y-3">
                {funds.filter(f => f.status !== 'pending').map(fund => (
                  <div key={fund.id} className="flex items-center justify-between p-3 border-b last:border-0 md:border-0 md:hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${fund.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {fund.status === 'approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{fund.patient}</p>
                            <p className="text-xs text-slate-500">{fund.date}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{fund.amount.toLocaleString()} ฿</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Funding Form Sidebar */}
          <div className="order-1 lg:order-1 lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
            <div className="mb-6">
                <h3 className="font-bold text-2xl text-slate-800 mb-1">จัดการขอทุน</h3>
                <p className="text-slate-500 font-medium text-sm">Funding Management System</p>
            </div>
            <button 
                onClick={() => {
                    if (onRequestFund) {
                        onRequestFund();
                    } else {
                        setShowForm(true);
                    }
                }}
                className="w-full bg-blue-600 text-white h-[50px] rounded-xl hover:bg-blue-700 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
            >
                <Plus size={24} />
                ยื่นขอทุนใหม่
            </button>
          </div>

          {/* Fund Request Mobile Form */}
          {(showForm || initialPatient) && !onRequestFund && (
            <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-right duration-300">
               <FundRequestForm 
                  patient={initialPatient || null}
                  onClose={() => setShowForm(false)} 
                  onSubmit={() => setShowForm(false)} 
               />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
