import React from 'react';
import HospitalWebLayout from '../layout/HospitalWebLayout';
import { FileInput, BedDouble, Stethoscope, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import UnderDevelopment from '@/components/shared/UnderDevelopment';

// Metrics Data for Hospital
const metrics = [
  {
    title: 'รับการส่งตัว (Incoming)',
    value: '42',
    change: '+3 new',
    trend: 'up',
    icon: FileInput,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'รอผ่าตัด (Surgery Queue)',
    value: '18',
    change: '-2 today',
    trend: 'down',
    icon: Stethoscope,
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'เตียงว่าง (Available Beds)',
    value: '6',
    change: 'Critical',
    trend: 'down',
    icon: BedDouble,
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'รักษาเสร็จสิ้น (Completed)',
    value: '156',
    change: '+12.5%',
    trend: 'up',
    icon: CheckCircle,
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export default function HospitalDashboard() {
  return (
    <HospitalWebLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Hospital Dashboard</h1>
            <p className="text-slate-500 mt-1">ระบบบริหารจัดการผู้ป่วยรับส่งต่อ (Referral Center)</p>
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
                {metric.trend === 'up' ? (
                  <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {metric.change} <ArrowUpRight size={12} className="ml-1" />
                  </span>
                ) : (
                  <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${metric.title.includes('เตียง') ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-50'}`}>
                    {metric.change} {metric.trend === 'down' && !metric.title.includes('เตียง') && <ArrowDownRight size={12} className="ml-1" />}
                  </span>
                )}
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
           {/* Surgery Schedule */}
           <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">ตารางผ่าตัด (Surgery Schedule)</h3>
                <button className="text-sm text-blue-600 font-bold hover:underline">จัดการตาราง</button>
              </div>
              <UnderDevelopment featureName="Surgery Schedule View" role="Hospital" />
           </div>

           {/* Incoming Referrals List */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">คำขอส่งตัวล่าสุด</h3>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">รอตอบรับ</span>
                       <span className="text-xs text-slate-400">2 ชม. ที่แล้ว</span>
                    </div>
                    <p className="font-bold text-slate-700">ด.ช. มีใจ รักดี</p>
                    <p className="text-sm text-slate-500">ส่งจาก: รพ.สต. บ้านใหม่</p>
                    <div className="mt-3 flex gap-2">
                        <button className="flex-1 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium">ตอบรับ</button>
                        <button className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg font-medium">ดูข้อมูล</button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </HospitalWebLayout>
  );
}
