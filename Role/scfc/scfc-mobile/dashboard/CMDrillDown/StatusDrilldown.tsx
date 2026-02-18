import React, { useMemo } from 'react';
import {
  ArrowLeft, Users, UserCheck, Building2, MapPin, Baby, Home,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { CASE_MANAGER_DATA, CaseManager, getStatusLabel, getStatusStyle } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  filter: string;
  label: string;
  onBack: () => void;
  onSelectCM: (cm: CaseManager) => void;
}

export function StatusDrilldown({ filter, label, onBack, onSelectCM }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return CASE_MANAGER_DATA;
    return CASE_MANAGER_DATA.filter(cm => cm.status === filter);
  }, [filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    active: filtered.filter(c => c.status === 'active').length,
    leave: filtered.filter(c => c.status === 'leave').length,
    totalPatients: filtered.reduce((s, c) => s + c.patientCount, 0),
    totalHospitals: new Set(filtered.flatMap(c => c.hospitals.map(h => h.id))).size,
  }), [filtered]);

  const pieData = [
    { name: 'ปฏิบัติงาน', value: stats.active, color: '#28c76f' },
    { name: 'ลาพัก', value: stats.leave, color: '#ff9f43' },
    { name: 'ไม่ใช้งาน', value: filtered.filter(c => c.status === 'inactive').length, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const provData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(cm => map.set(cm.province, (map.get(cm.province) || 0) + cm.patientCount));
    return Array.from(map.entries()).map(([name, patients]) => ({ name, patients })).sort((a, b) => b.patients - a.patients);
  }, [filtered]);

  const headerColor = filter === 'active' ? '#28c76f' : filter === 'leave' ? '#ff9f43' : filter === 'inactive' ? '#ea5455' : '#49358E';

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">รายละเอียด Case Manager</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{filtered.length} คน</span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Stat cards */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {[
            { label: 'CM ทั้งหมด', value: `${stats.total} คน`, icon: Users, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'ปฏิบัติงาน', value: `${stats.active} คน`, icon: UserCheck, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
            { label: 'ผู้ป่วยในระบบ', value: `${stats.totalPatients} คน`, icon: Baby, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'โรงพยาบาล', value: `${stats.totalHospitals} แห่ง`, icon: Building2, iconColor: 'text-[#ff6d00]', iconBg: 'bg-orange-50', border: 'border-orange-100' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border", s.border)}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}>
                <s.icon size={20} className={s.iconColor} />
              </div>
              <div>
                <span className="text-2xl font-black text-[#37286A] leading-none">{s.value}</span>
                <p className="text-[14px] font-bold text-[#7066A9]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <PieChartIcon className="text-[#7066A9]" size={18} /> สถานะ CM
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-[110px] h-[110px] relative shrink-0" style={{ minWidth: 110, minHeight: 110 }}>
              <PieChart width={110} height={110}>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[18px] font-black text-[#37286A]">{stats.total}</span>
                <span className="text-[12px] text-[#7066A9]">คน</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[16px] text-[#5e5873]">{item.name}</span>
                  </div>
                  <span className="text-[16px] font-black text-[#37286A]">{item.value} คน</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Province */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
            <MapPin className="text-[#7066A9]" size={18} /> ผู้ป่วยต่อจังหวัด
          </h3>
          <div className="space-y-3">
            {provData.map(p => {
              const maxV = provData[0]?.patients || 1;
              const pct = Math.round((p.patients / maxV) * 100);
              return (
                <div key={p.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] text-[#37286A]">จ.{p.name}</span>
                    <span className="text-[16px] font-black text-[#49358E]">{p.patients} คน</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#49358E]" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CM list */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
          <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <Users className="text-[#7066A9]" size={18} /> รายชื่อ Case Manager
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length} คน</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#7066A9]">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบ Case Manager</p>
            </div>
          ) : (
            <div className="divide-y divide-dashed divide-gray-100">
              {filtered.slice(0, 20).map(cm => {
                const ss = getStatusStyle(cm.status);
                return (
                  <div key={cm.id} className="px-4 py-3 hover:bg-[#F4F0FF]/30 cursor-pointer active:bg-[#F4F0FF]/50 transition-colors" onClick={() => onSelectCM(cm)}>
                    <div className="flex items-center gap-3">
                      <img src={cm.image} alt={cm.name} className="w-11 h-11 rounded-full bg-slate-100 border-2 border-white shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#37286A] text-[18px] truncate">{cm.name}</span>
                          <span className={cn("rounded-full px-2.5 py-0.5 text-[14px] font-bold shrink-0 flex items-center gap-1", ss.bg, ss.color)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", ss.dot)}></span>
                            {getStatusLabel(cm.status)}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#7066A9]">{cm.id} — จ.{cm.province}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1"><Baby size={14} className="text-[#4285f4]" /><span className="text-[14px] text-[#37286A]">{cm.patientCount} ผู้ป่วย</span></div>
                          <div className="flex items-center gap-1"><Building2 size={14} className="text-[#7066A9]" /><span className="text-[14px] text-[#37286A]">{cm.hospitals.length} รพ.</span></div>
                          <div className="flex items-center gap-1"><Home size={14} className="text-[#28c76f]" /><span className="text-[14px] text-[#37286A]">{cm.activeVisits}/{cm.completedVisits}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}