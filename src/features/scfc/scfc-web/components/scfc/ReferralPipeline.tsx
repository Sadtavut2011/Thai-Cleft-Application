import React from 'react';

export function ReferralPipeline() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="font-bold text-slate-800 mb-4">สถานะการส่งตัว (Referral Pipeline)</h3>
      <div className="space-y-4">
        {[
          { label: 'ส่งตัวเข้า (Refer In)', val: 24, max: 50, color: 'bg-indigo-500' },
          { label: 'ส่งตัวออก (Refer Out)', val: 12, max: 50, color: 'bg-rose-500' },
          { label: 'รอตอบรับ', val: 8, max: 50, color: 'bg-amber-500' },
        ].map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-600">{item.label}</span>
              <span className="font-bold text-slate-800">{item.val} เคส</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color}`} 
                style={{ width: `${(item.val / item.max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
