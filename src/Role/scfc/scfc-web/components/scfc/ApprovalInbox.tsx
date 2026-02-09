import React from 'react';
import { CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';

export function ApprovalInbox() {
  const items = [
    { id: 1, title: 'ขอทุนการศึกษา (รายใหม่)', name: 'ด.ช. รักดี มีสุข', time: '10 นาทีที่แล้ว', status: 'pending' },
    { id: 2, title: 'อนุมัติการส่งตัว', name: 'น.ส. ใจดี สู้เสือ', time: '2 ชม. ที่แล้ว', status: 'approved' },
    { id: 3, title: 'เบิกจ่ายค่าเดินทาง', name: 'นาย สมชาย ใจดี', time: '5 ชม. ที่แล้ว', status: 'pending' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">รายการรอพิจารณา (Approval Inbox)</h3>
        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">3 pending</span>
      </div>
      <div className="divide-y divide-slate-50">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {item.status === 'pending' ? <Clock size={20} /> : <CheckCircle2 size={20} />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700">{item.title}</h4>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{item.name}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
        ))}
      </div>
      <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
        <button className="text-xs font-bold text-teal-600 hover:text-teal-700">ดูทั้งหมด</button>
      </div>
    </div>
  );
}
