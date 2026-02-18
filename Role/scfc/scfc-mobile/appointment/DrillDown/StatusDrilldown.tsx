import React, { useMemo } from 'react';
import {
  ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Clock,
  XCircle, ClipboardList, Building2, Stethoscope,
  Activity, PieChart as PieChartIcon, MapPin,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { FlatAppointment, STATUS_CONFIG, getStatusConfig } from './shared';
import { useDragScroll } from '../../components/useDragScroll';

const TREATMENT_MAP: Record<string, string> = {
  'ผ่าตัด': 'ศัลยกรรม', 'ติดตามอาการ': 'อายุรกรรม', 'ฝึกพูด': 'แก้ไขการพูด',
  'ตรวจรักษา': 'ตรวจรักษาทั่วไป', 'นัดหมายตรวจรักษา': 'ตรวจรักษาทั่วไป',
  'ตรวจประเมิน': 'จิตเวช/พัฒนาการ', 'นัดผ่าตัด': 'ศัลยกรรม',
  'ศัลยกรรม': 'ศัลยกรรม', 'อายุรกรรม': 'อายุรกรรม',
};

interface Props {
  appointments: FlatAppointment[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectAppointment: (a: FlatAppointment) => void;
}

export function StatusDrilldown({ appointments, filter, label, onBack, onSelectAppointment }: Props) {
  const filtered = useMemo(() => {
    if (filter === 'all') return appointments;
    const cfg = STATUS_CONFIG[filter];
    if (!cfg) return appointments;
    return appointments.filter(a => getStatusConfig(a.status) === cfg);
  }, [appointments, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    confirmed: filtered.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.confirmed).length,
    waiting: filtered.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.waiting).length,
    completed: filtered.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.completed).length,
    cancelled: filtered.filter(a => getStatusConfig(a.status) === STATUS_CONFIG.cancelled).length,
  }), [filtered]);

  const pieData = [
    { name: 'ยืนยันแล้ว', value: stats.confirmed, color: '#4285f4' },
    { name: 'รอการยืนยัน', value: stats.waiting, color: '#ff9f43' },
    { name: 'เสร็จสิ้น', value: stats.completed, color: '#28c76f' },
    { name: 'ขาดนัด/ยกเลิก', value: stats.cancelled, color: '#ea5455' },
  ].filter(d => d.value > 0);

  const hospitalData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(a => {
      const h = (a.hospital || 'อื่นๆ').replace('โรงพยาบาล', 'รพ.').trim();
      map.set(h, (map.get(h) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered]);

  const treatmentData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(a => {
      const raw = (a.type || a.clinic || 'ไม่ระบุ').trim();
      map.set(TREATMENT_MAP[raw] || raw, (map.get(TREATMENT_MAP[raw] || raw) || 0) + 1);
    });
    const colors = ['#49358E', '#4285f4', '#28c76f', '#ff9f43', '#ea5455', '#00cfe8'];
    return Array.from(map.entries()).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [filtered]);

  const statsDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai'] pb-20">
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">{filter === 'all' ? 'ภาพรวมนัดหมายทั้งหมด' : `สถานะ "${STATUS_CONFIG[filter]?.label}"`}</p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{filtered.length} รายการ</span>
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
            { label: 'ทั้งหมด', value: stats.total, icon: ClipboardList, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'ยืนยันแล้ว', value: stats.confirmed, icon: CheckCircle2, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'รอยืนยัน', value: stats.waiting, icon: Clock, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'ขาดนัด', value: stats.cancelled, icon: XCircle, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', border: 'border-rose-100' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border", s.border)}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}><s.icon size={20} className={s.iconColor} /></div>
              <div><span className="text-2xl font-black text-[#37286A] leading-none">{s.value}</span><p className="text-[16px] font-bold text-[#7066A9]">{s.label}</p></div>
            </div>
          ))}
        </div>

        {/* Pie */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3"><PieChartIcon className="text-[#7066A9]" size={18} /> สัดส่วนสถานะ</h3>
          <div className="flex items-center gap-4">
            <div className="w-[110px] h-[110px] relative shrink-0" style={{ minWidth: 110, minHeight: 110 }}>
              <PieChart width={110} height={110}><Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none">{pieData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-[18px] font-black text-[#37286A]">{stats.total}</span><span className="text-[12px] text-[#7066A9]">ทั้งหมด</span></div>
            </div>
            <div className="flex-1 space-y-2">
              {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div><span className="text-[16px] text-[#5e5873]">{item.name}</span></div>
                  <div className="flex items-center gap-1"><span className="text-[16px] font-black text-[#37286A]">{item.value}</span><span className="text-[14px] text-[#7066A9]">({stats.total > 0 ? Math.round(item.value / stats.total * 100) : 0}%)</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Treatment */}
        {treatmentData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3"><Activity className="text-[#7066A9]" size={18} /> ประเภทการรักษา</h3>
            <div className="space-y-3">
              {treatmentData.map(tt => {
                const pct = Math.round((tt.value / (treatmentData[0]?.value || 1)) * 100);
                return (
                  <div key={tt.name} className="space-y-1.5">
                    <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tt.color }}></div><span className="text-[16px] text-[#37286A]">{tt.name}</span></div><span className="text-[16px] font-black text-[#37286A]">{tt.value}</span></div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: tt.color }}></div></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hospital */}
        {hospitalData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between"><h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2"><Building2 className="text-[#7066A9]" size={18} /> แยกตามโรงพยาบาล</h3></div>
            <div className="divide-y divide-[#F4F0FF]">
              {hospitalData.map(h => (
                <div key={h.name} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0"><Building2 size={18} /></div>
                  <span className="flex-1 text-[16px] font-bold text-[#37286A] truncate">{h.name}</span>
                  <span className="text-[18px] font-black text-[#37286A]">{h.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments list */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
              <CalendarIcon className="text-[#7066A9]" size={18} /> รายการนัดหมาย
            </h3>
            <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#E3E0F0] text-[#7066A9]">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-[16px]">ไม่พบรายการนัดหมาย</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.slice(0, 20).map(a => {
                const sc = getStatusConfig(a.status);
                return (
                  <div
                    key={a.id}
                    onClick={() => onSelectAppointment(a)}
                    className="bg-white border border-[#E3E0F0] shadow-sm rounded-2xl active:scale-[0.98] transition-all cursor-pointer overflow-hidden hover:border-[#7066A9] hover:shadow-md"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-[#5e5873] text-[18px] truncate">{a.patientName}</h4>
                          <p className="text-[14px] text-[#6a7282] mt-0.5">HN: {a.hn}</p>
                        </div>
                        <span className={cn("rounded-full px-3 py-1 text-[12px] font-bold shrink-0 ml-2", sc.bg, sc.color)}>{sc.label}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-[#7066a9] shrink-0" />
                        <span className="text-[16px] text-slate-600 truncate">{a.hospital || 'ไม่ได้ระบุสถานที่'}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-100">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-[14px] text-slate-500">{a.clinic || a.type || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#6a7282]" />
                          <span className="text-[14px] text-[#6a7282]">{a.date || '-'} • {a.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length > 20 && (
                <p className="text-center text-[16px] text-[#7066A9] py-2">แสดง 20 จาก {filtered.length} รายการ</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}