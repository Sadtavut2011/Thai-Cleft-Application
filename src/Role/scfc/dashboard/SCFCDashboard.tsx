import React from 'react';
import SCFCWebLayout from '../layout/SCFCWebLayout';
import { HandCoins, HeartHandshake, Baby, CheckCircle, ArrowUpRight } from 'lucide-react';
import UnderDevelopment from '@/components/shared/UnderDevelopment';

// Metrics Data for SCFC
const metrics = [
  {
    title: 'คำขอรับเงินทุน (Fund Requests)',
    value: '24',
    change: '+8 new',
    trend: 'up',
    icon: HandCoins,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    title: 'เคสที่ดูแล (Active Cases)',
    value: '189',
    change: '+12 this month',
    trend: 'up',
    icon: Baby,
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'เยี่ยมบ้าน (Home Visits)',
    value: '12',
    change: 'Pending',
    trend: 'neutral',
    icon: HeartHandshake,
    color: 'bg-pink-500',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    title: 'อนุมัติแล้ว (Approved)',
    value: '1.2M',
    change: 'THB Total',
    trend: 'up',
    icon: CheckCircle,
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export default function SCFCDashboard() {
  return (
    <SCFCWebLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">SCFC Dashboard</h1>
            <p className="text-slate-500 mt-1">ศูนย์ความร่วมมือแก้ไขความพิการฯ (SCFC Center)</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            ข้อมูลล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl ${metric.bgColor} flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.textColor}`} />
                </div>
                <span className="flex items-center text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
                  {metric.change} {metric.trend === 'up' && <ArrowUpRight size={12} className="ml-1" />}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1">{metric.value}</h3>
                <p className="text-sm font-medium text-slate-500">{metric.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Fund Requests List */}
           <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">คำขอทุนล่าสุด (Recent Fund Requests)</h3>
                <button className="text-sm text-yellow-600 font-bold hover:underline">ดูทั้งหมด</button>
              </div>
              
              <div className="space-y-4">
                 {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                             <Baby size={20} className="text-slate-500" />
                          </div>
                          <div>
                             <p className="font-bold text-slate-700">ด.ญ. สุดา ใจดี</p>
                             <p className="text-xs text-slate-500">ค่าเดินทาง • 1,500 THB</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg mb-1">
                             รออนุมัติ
                          </span>
                          <p className="text-xs text-slate-400">10:30 น.</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Stats / Graph Placeholder */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">งบประมาณคงเหลือ</h3>
              </div>
              <UnderDevelopment featureName="Budget Chart" role="SCFC" />
           </div>
        </div>
      </div>
    </SCFCWebLayout>
  );
}
