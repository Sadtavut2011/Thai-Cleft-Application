import React from 'react';
import { Users, Activity, Clock, FileText } from 'lucide-react';

// Metrics Data based on request
const metrics = [
  {
    title: 'ผู้ป่วยทั้งหมด (Total Patients)',
    value: '19,256',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'ติดตามต่อเนื่อง (Follow-ups)',
    value: '7,789',
    change: '+5.2%',
    trend: 'up',
    icon: Activity,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'รอการส่งตัว (Pending Referral)',
    value: '342',
    change: '-2.4%',
    trend: 'down',
    icon: Clock,
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'เอกสารรออนุมัติ (Documents)',
    value: '128',
    change: '+8.1%',
    trend: 'up',
    icon: FileText,
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export default function HospitalMobileDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Hospital Mobile Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {metrics.map((metric, index) => (
          <div key={index} className={`${metric.bgColor} p-4 rounded-xl`}>
             <metric.icon className={`${metric.textColor} mb-2`} size={24} />
             <div className="text-2xl font-bold">{metric.value}</div>
             <div className="text-xs text-gray-500">{metric.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
