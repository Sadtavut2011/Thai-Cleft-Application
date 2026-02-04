import React from 'react';
import { Construction } from 'lucide-react';

interface UnderDevelopmentProps {
  featureName?: string;
  role?: string;
}

export default function UnderDevelopment({ featureName, role }: UnderDevelopmentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
        <Construction size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">
        {featureName || 'Functionality'} Under Development
      </h3>
      <p className="text-slate-500 max-w-md">
        ส่วนงาน{role ? \`สำหรับ \${role}\` : ''} นี้กำลังอยู่ในระหว่างการพัฒนา (กำลังพัฒนา)
      </p>
    </div>
  );
}
