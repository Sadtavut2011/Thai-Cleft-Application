import React, { useState } from 'react';
import {
  ArrowLeft, Building2, Users, DollarSign, TrendingUp,
  Coins, ChevronDown, ChevronUp, Database, Calendar as CalendarIcon,
  BarChart3, Wallet,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { getStatusConfig } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

// ============ MOCK DATA ============
interface PatientFundRecord {
  name: string; hn: string; amount: number; date: string; status: string; fundSource: string;
}

interface HospitalFundInfo {
  hospital: string; province: string; totalAmount: number; totalPatients: number;
  fundBreakdown: { source: string; amount: number; patients: number }[];
  patientList: PatientFundRecord[];
  yearlyData: { year: string; amount: number }[];
}

const HOSPITAL_FUND_DATA: HospitalFundInfo[] = [
  {
    hospital: 'รพ.มหาราชนครเชียงใหม่', province: 'เชียงใหม่', totalAmount: 225000, totalPatients: 11,
    fundBreakdown: [{ source: 'สภากาชาดไทย', amount: 45000, patients: 5 }, { source: 'กองทุนรัฐบาล (Northern Care)', amount: 180000, patients: 6 }],
    patientList: [
      { name: 'ด.ช. อนันต์ สุขใจ', hn: 'HN12345', amount: 15000, date: '2026-01-18', status: 'Pending', fundSource: 'สภากาชาดไทย' },
      { name: 'ด.ช. กิตติ เจริญ', hn: 'HN44211', amount: 25000, date: '2026-01-22', status: 'Pending', fundSource: 'Northern Care' },
      { name: 'น.ส. มะลิ แซ่ลี้', hn: 'HN67890', amount: 25000, date: '2026-01-20', status: 'Pending', fundSource: 'Northern Care' },
      { name: 'นาย สมชาย จริงใจ', hn: 'HN54321', amount: 5000, date: '2026-01-15', status: 'Approved', fundSource: 'Northern Care' },
      { name: 'นาง สมพร แสงแก้ว', hn: 'HN99887', amount: 3000, date: '2026-01-10', status: 'Disbursed', fundSource: 'สภากาชาดไทย' },
    ],
    yearlyData: [{ year: '2565', amount: 120000 }, { year: '2566', amount: 150000 }, { year: '2567', amount: 175000 }, { year: '2568', amount: 200000 }, { year: '2569', amount: 225000 }],
  },
  {
    hospital: 'รพ.เชียงรายประชานุเคราะห์', province: 'เชียงราย', totalAmount: 145000, totalPatients: 6,
    fundBreakdown: [{ source: 'สภากาชาดไทย', amount: 25000, patients: 3 }, { source: 'กองทุนรัฐบาล (Northern Care)', amount: 120000, patients: 3 }],
    patientList: [
      { name: 'ด.ช. สมศักดิ์ มั่นคง', hn: 'HN88211', amount: 10000, date: '2025-11-30', status: 'Approved', fundSource: 'สภากาชาดไทย' },
      { name: 'ด.ช. ภูมิ รักไทย', hn: 'HN55211', amount: 20000, date: '2025-12-18', status: 'Approved', fundSource: 'Northern Care' },
    ],
    yearlyData: [{ year: '2565', amount: 80000 }, { year: '2566', amount: 95000 }, { year: '2567', amount: 110000 }, { year: '2568', amount: 130000 }, { year: '2569', amount: 145000 }],
  },
  {
    hospital: 'รพ.แม่ฮ่องสอน', province: 'แม่ฮ่องสอน', totalAmount: 105000, totalPatients: 7,
    fundBreakdown: [{ source: 'มูลนิธิเพื่อผู้ป่วยยากไร้', amount: 35000, patients: 4 }, { source: 'กองทุนรัฐบาล (Northern Care)', amount: 70000, patients: 3 }],
    patientList: [
      { name: 'ด.ช. ภาณุ ลือชา', hn: 'HN11211', amount: 12000, date: '2026-01-08', status: 'Approved', fundSource: 'มูลนิธิฯ' },
      { name: 'ด.ช. ธนวัฒน์ เจริญสุข', hn: 'HN77212', amount: 18000, date: '2025-12-28', status: 'Approved', fundSource: 'Northern Care' },
    ],
    yearlyData: [{ year: '2565', amount: 55000 }, { year: '2566', amount: 68000 }, { year: '2567', amount: 82000 }, { year: '2568', amount: 95000 }, { year: '2569', amount: 105000 }],
  },
  {
    hospital: 'รพ.ลำปาง', province: 'ลำปาง', totalAmount: 80000, totalPatients: 3,
    fundBreakdown: [{ source: 'กองทุนรัฐบาล (Northern Care)', amount: 80000, patients: 3 }],
    patientList: [
      { name: 'ด.ญ. กนกพร มีสุข', hn: 'HN44556', amount: 45000, date: '2026-01-05', status: 'Rejected', fundSource: 'Northern Care' },
      { name: 'นาย สุรชัย พลังดี', hn: 'HN66322', amount: 20000, date: '2025-11-12', status: 'Disbursed', fundSource: 'Northern Care' },
    ],
    yearlyData: [{ year: '2565', amount: 40000 }, { year: '2566', amount: 50000 }, { year: '2567', amount: 60000 }, { year: '2568', amount: 70000 }, { year: '2569', amount: 80000 }],
  },
  {
    hospital: 'รพ.ลำพูน', province: 'ลำพูน', totalAmount: 30000, totalPatients: 3,
    fundBreakdown: [{ source: 'สภากาชาดไทย', amount: 30000, patients: 3 }],
    patientList: [
      { name: 'ด.ญ. มนัส ยินดี', hn: 'HN77211', amount: 12000, date: '2025-12-05', status: 'Approved', fundSource: 'สภากาชาดไทย' },
    ],
    yearlyData: [{ year: '2565', amount: 15000 }, { year: '2566', amount: 18000 }, { year: '2567', amount: 22000 }, { year: '2568', amount: 26000 }, { year: '2569', amount: 30000 }],
  },
];

const YEARLY_OVERVIEW = [
  { year: '2565', total: 340000 }, { year: '2566', total: 422000 }, { year: '2567', total: 500000 },
  { year: '2568', total: 583000 }, { year: '2569', total: 655000 },
];

interface Props {
  onBack: () => void;
}

export function HospitalFundSummaryDrilldown({ onBack }: Props) {
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalFundInfo | null>(null);

  const grandTotal = HOSPITAL_FUND_DATA.reduce((s, h) => s + h.totalAmount, 0);
  const totalPatients = HOSPITAL_FUND_DATA.reduce((s, h) => s + h.totalPatients, 0);

  const statsDragDetail = useDragScroll();
  const statsDragMain = useDragScroll();

  // Drill into specific hospital
  if (selectedHospital) {
    return (
      <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
        <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
          <button onClick={() => setSelectedHospital(null)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-[18px] font-bold truncate">{selectedHospital.hospital}</h1>
            <p className="text-white/70 text-[14px] truncate">จ.{selectedHospital.province} — ทุนทั้งหมด</p>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Stats */}
          <div
            ref={statsDragDetail.ref}
            {...statsDragDetail.handlers}
            className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
          >
            {[
              { label: 'ยอดทุนรวม', value: `฿${selectedHospital.totalAmount.toLocaleString()}`, icon: DollarSign, iconColor: 'text-[#f5a623]', iconBg: 'bg-amber-50', border: 'border-amber-100' },
              { label: 'ผู้ป่วย', value: `${selectedHospital.totalPatients} ราย`, icon: Users, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
              { label: 'แหล่งทุน', value: `${selectedHospital.fundBreakdown.length} แหล่ง`, icon: Database, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            ].map((s, i) => (
              <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[140px] shrink-0 border", s.border)}>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}>
                  <s.icon size={20} className={s.iconColor} />
                </div>
                <div>
                  <span className="text-[16px] font-black text-[#37286A] leading-none">{s.value}</span>
                  <p className="text-[14px] font-bold text-[#7066A9]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 5 year bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
              <BarChart3 className="text-[#7066A9]" size={18} /> ยอดทุน 5 ปีย้อนหลัง
            </h3>
            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={selectedHospital.yearlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#7066A9' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#7066A9' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '14px' }} formatter={(v: any) => [`฿${Number(v).toLocaleString()}`, 'ยอดทุน']} />
                  <Bar dataKey="amount" fill="#49358E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fund sources */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
              <Database className="text-[#7066A9]" size={18} /> แหล่งทุนที่ให้
            </h3>
            <div className="space-y-3">
              {selectedHospital.fundBreakdown.map((fb, i) => {
                const pct = selectedHospital.totalAmount > 0 ? Math.round((fb.amount / selectedHospital.totalAmount) * 100) : 0;
                return (
                  <div key={i} className="p-3 rounded-xl bg-[#F4F0FF]/50 border border-[#E3E0F0]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2"><Coins size={16} className="text-[#49358E]" /><span className="text-[16px] font-bold text-[#37286A] truncate">{fb.source}</span></div>
                      <span className="text-[16px] font-black text-[#f5a623] shrink-0">฿{fb.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#f5a623] rounded-full" style={{ width: `${pct}%` }} /></div>
                      <span className="text-[14px] text-[#7066A9]">{pct}% ({fb.patients} ราย)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patient list */}
          <div>
            <div className="flex items-center justify-between px-1 mb-3">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
                <Users className="text-[#7066A9]" size={18} /> ผู้ป่วยที่ได้รับทุน
              </h3>
              <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{selectedHospital.totalPatients} ราย</span>
            </div>
            <div className="space-y-3">
              {selectedHospital.patientList.map((p, pi) => {
                const sc = getStatusConfig(p.status);
                return (
                  <div key={pi} className="bg-white border border-[#E3E0F0] shadow-sm rounded-2xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#5e5873] text-[18px] truncate">{p.name}</h4>
                          <p className="text-[14px] text-[#6a7282] mt-0.5">HN: {p.hn}</p>
                        </div>
                        <span className={cn("rounded-full px-2 py-0.5 text-[12px] font-bold shrink-0 ml-2", sc.bg, sc.color)}>{sc.label}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Wallet size={14} className="text-[#7066A9] shrink-0" />
                        <span className="text-[16px] text-[#7367f0] truncate">{p.fundSource}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={14} className="text-[#f5a623]" />
                          <span className="text-[16px] font-bold text-[#f5a623]">{p.amount.toLocaleString()} บาท</span>
                        </div>
                        <span className="text-[14px] text-[#6a7282]">{p.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Main hospital summary view =====
  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">สรุปทุนตามโรงพยาบาล</h1>
          <p className="text-white/70 text-[14px] truncate">ภาพรวม 5 ปีย้อนหลัง</p>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Summary stats */}
        <div
          ref={statsDragMain.ref}
          {...statsDragMain.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {[
            { label: 'ยอดทุนรวม', value: `฿${grandTotal.toLocaleString()}`, icon: DollarSign, iconColor: 'text-[#f5a623]', iconBg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'จำนวนผู้ป่วย', value: `${totalPatients} ราย`, icon: Users, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'โรงพยาบาล', value: `${HOSPITAL_FUND_DATA.length} แห่ง`, icon: Building2, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border", s.border)}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}>
                <s.icon size={20} className={s.iconColor} />
              </div>
              <div>
                <span className="text-[16px] font-black text-[#37286A] leading-none">{s.value}</span>
                <p className="text-[14px] font-bold text-[#7066A9]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 5-year overview bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <BarChart3 className="text-[#7066A9]" size={18} /> ยอดรวม 5 ปี (พ.ศ.)
          </h3>
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={YEARLY_OVERVIEW} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#7066A9' }} />
                <YAxis tick={{ fontSize: 10, fill: '#7066A9' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E3E0F0', fontSize: '14px' }} formatter={(v: any) => [`฿${Number(v).toLocaleString()}`, 'ยอดรวม']} />
                <Bar dataKey="total" fill="#f5a623" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hospital list with expandable detail */}
        <div className="space-y-3">
          {HOSPITAL_FUND_DATA.sort((a, b) => b.totalAmount - a.totalAmount).map(h => {
            const isExpanded = expandedHospital === h.hospital;
            const pct = grandTotal > 0 ? Math.round((h.totalAmount / grandTotal) * 100) : 0;
            return (
              <div key={h.hospital} className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
                <button onClick={() => setExpandedHospital(isExpanded ? null : h.hospital)} className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F0FF]/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0"><Building2 size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[16px] font-bold text-[#37286A] truncate block">{h.hospital}</span>
                        <span className="text-[14px] text-[#7066A9]">จ.{h.province}</span>
                      </div>
                      <span className="text-[16px] font-black text-[#f5a623] shrink-0">฿{h.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#49358E] rounded-full" style={{ width: `${pct}%` }} /></div>
                      <span className="text-[14px] text-[#7066A9] whitespace-nowrap">{pct}% • {h.totalPatients} ราย</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={18} className="text-[#7066A9] shrink-0" /> : <ChevronDown size={18} className="text-[#7066A9] shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-[#F4F0FF] p-4 space-y-3 bg-[#F4F0FF]/20">
                    <p className="text-[14px] text-[#7066A9] font-bold">แหล่งทุนที่ให้:</p>
                    {h.fundBreakdown.map((fb, fi) => (
                      <div key={fi} className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#E3E0F0]">
                        <div className="flex items-center gap-2"><Coins size={14} className="text-[#49358E]" /><span className="text-[16px] text-[#37286A] truncate">{fb.source}</span></div>
                        <div className="flex items-center gap-2 shrink-0"><span className="text-[16px] font-bold text-[#f5a623]">฿{fb.amount.toLocaleString()}</span><span className="text-[14px] text-[#7066A9]">{fb.patients} ราย</span></div>
                      </div>
                    ))}

                    <button onClick={() => setSelectedHospital(h)} className="w-full flex items-center justify-center gap-2 bg-[#49358E] text-white py-2.5 rounded-xl text-[16px] font-bold active:bg-[#37286A] transition-colors">
                      ดูรายละเอียดทั้งหมด
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}