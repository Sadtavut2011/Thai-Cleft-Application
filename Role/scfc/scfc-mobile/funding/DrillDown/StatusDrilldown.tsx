import React, { useMemo, useState } from 'react';
import {
  ArrowLeft, Coins, CheckCircle2, Clock, XCircle, TrendingUp,
  Building2, PieChart as PieChartIcon, Wallet, Filter,
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { FlatFundRequest, STATUS_CONFIG, getStatusConfig } from './shared';
import { PATIENTS_DATA } from '../../../../../data/patientData';
import { useDragScroll } from '../../components/useDragScroll';

interface Props {
  requests: FlatFundRequest[];
  filter: string;
  label: string;
  onBack: () => void;
  onSelectRequest?: (r: FlatFundRequest) => void;
}

/** Resolve patient image from PATIENTS_DATA by hn */
const resolvePatientImage = (hn: string): string => {
  const p = PATIENTS_DATA.find((pt: any) => pt.hn === hn);
  return p?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${hn}`;
};

/** Status badge renderer */
function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusConfig(status);
  return (
    <span className={cn("text-[12px] font-bold px-2 py-0.5 rounded-full shrink-0", cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  );
}

// Fund name → color mapping
const FUND_COLORS: Record<string, string> = {
  'กองทุนมูลนิธิตะวันยิ้ม': '#f5a623',
  'ทุนสภากาชาดไทย': '#ea5455',
  'ทุนอบจ.เชียงใหม่': '#00cfe8',
  'มูลนิธิสร้างรอยยิ้ม': '#7367f0',
  'Northern Care Fund': '#49358E',
  'กองทุนฟื้นฟูสมรรถภาพ จ.เชียงใหม่': '#28c76f',
  'สภากาชาดไทย': '#ea5455',
  'กองทุนช่วยเหลือฉุกเฉิน': '#ff6d00',
  'กองทุนพัฒนาคุณภาพชีวิต': '#00cfe8',
  'มูลนิธิเพื่อผู้ป่วยยากไร้': '#ff9f43',
};
const DEFAULT_FUND_COLORS = ['#49358E', '#f5a623', '#ea5455', '#28c76f', '#00cfe8', '#7367f0', '#ff9f43'];

export function StatusDrilldown({ requests, filter, label, onBack, onSelectRequest }: Props) {
  // ═══ Status filter ═══
  const statusFiltered = useMemo(() => {
    if (filter === 'all') return requests;
    if (filter === 'approved_received') return requests.filter(r => r.status === 'Approved' || r.status === 'Received');
    return requests.filter(r => r.status === filter);
  }, [requests, filter]);

  // ═══ Fund filter ═══
  const [selectedFund, setSelectedFund] = useState('ทุกกองทุน');

  // Available fund names
  const fundNames = useMemo(() => {
    const set = new Set<string>();
    statusFiltered.forEach(r => { set.add(r.fundType || 'ไม่ระบุ'); });
    return Array.from(set).sort();
  }, [statusFiltered]);

  // Assign colors per fund
  const fundColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    let idx = 0;
    fundNames.forEach(f => {
      map[f] = FUND_COLORS[f] || DEFAULT_FUND_COLORS[idx % DEFAULT_FUND_COLORS.length];
      idx++;
    });
    return map;
  }, [fundNames]);

  // Final filtered list (status + fund)
  const filtered = useMemo(() => {
    if (selectedFund === 'ทุกกองทุน') return statusFiltered;
    return statusFiltered.filter(r => (r.fundType || 'ไม่ระบุ') === selectedFund);
  }, [statusFiltered, selectedFund]);

  // ═══ Stats ═══
  const stats = useMemo(() => ({
    total: filtered.length,
    totalAmount: filtered.reduce((s, r) => s + (r.amount || 0), 0),
    pending: filtered.filter(r => r.status === 'Pending').length,
    approved: filtered.filter(r => r.status === 'Approved' || r.status === 'Received').length,
    disbursed: filtered.filter(r => r.status === 'Disbursed').length,
    rejected: filtered.filter(r => r.status === 'Rejected').length,
  }), [filtered]);

  // ═══ Pie data ═══
  const pieData = useMemo(() => [
    { name: 'รอพิจารณา', value: stats.pending, color: '#f5a623' },
    { name: 'อนุมัติ/รับเงิน', value: stats.approved, color: '#4285f4' },
    { name: 'จ่ายเงินแล้ว', value: stats.disbursed, color: '#28c76f' },
    { name: 'ปฏิเสธ', value: stats.rejected, color: '#ea5455' },
  ].filter(d => d.value > 0), [stats]);

  // ═══ Fund summary chips data ═══
  const fundSummary = useMemo(() => {
    return fundNames.map(name => {
      const items = statusFiltered.filter(r => (r.fundType || 'ไม่ระบุ') === name);
      return {
        name,
        count: items.length,
        amount: items.reduce((s, r) => s + (r.amount || 0), 0),
        color: fundColorMap[name] || '#49358E',
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [statusFiltered, fundNames, fundColorMap]);

  // ═══ Hospital breakdown ═══
  const hospData = useMemo(() => {
    const map = new Map<string, { count: number; amount: number }>();
    filtered.forEach(r => {
      const h = r.hospital || '-';
      if (!map.has(h)) map.set(h, { count: 0, amount: 0 });
      const e = map.get(h)!; e.count++; e.amount += r.amount || 0;
    });
    return Array.from(map.entries())
      .map(([name, d]) => ({ name: name.replace('โรงพยาบาล', 'รพ.').trim(), ...d }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [filtered]);

  const statsDrag = useDragScroll();
  const fundFilterDrag = useDragScroll();

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col pb-20">
      {/* ═══ Purple sticky header ═══ */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"><ArrowLeft size={24} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] font-bold truncate">{label}</h1>
          <p className="text-white/70 text-[14px] truncate">
            {filter === 'all' ? 'ภาพรวมคำขอทุนทั้งหมด' : `สถานะ "${getStatusConfig(filter).label}"`}
          </p>
        </div>
        <span className="text-white text-[14px] font-bold bg-white/20 px-3 py-1 rounded-full shrink-0">{filtered.length} คำขอ</span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* ═══ Stat cards (scrollable) ═══ */}
        <div
          ref={statsDrag.ref}
          {...statsDrag.handlers}
          className="flex gap-3 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ cursor: 'grab', scrollSnapType: 'x mandatory', touchAction: 'pan-x' }}
        >
          {[
            { label: 'คำขอทั้งหมด', value: String(stats.total), icon: Coins, iconColor: 'text-[#49358E]', iconBg: 'bg-[#F4F0FF]', border: 'border-[#E3E0F0]' },
            { label: 'รอพิจารณา', value: String(stats.pending), icon: Clock, iconColor: 'text-[#f5a623]', iconBg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'อนุมัติแล้ว', value: String(stats.approved), icon: CheckCircle2, iconColor: 'text-[#4285f4]', iconBg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'ยอดรวม', value: `฿${stats.totalAmount.toLocaleString()}`, icon: TrendingUp, iconColor: 'text-[#28c76f]', iconBg: 'bg-green-50', border: 'border-green-100' },
          ].map((s, i) => (
            <div key={i} className={cn("bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-3 min-w-[155px] shrink-0 border snap-center", s.border)}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", s.iconBg)}>
                <s.icon size={20} className={s.iconColor} />
              </div>
              <div>
                <span className="text-2xl font-black text-[#37286A] leading-none">{s.value}</span>
                <p className="text-[16px] font-bold text-[#7066A9]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ Fund filter chips ═══ */}
        {fundNames.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[#7066A9]" />
              <span className="text-[16px] font-bold text-[#37286A]">กรองกองทุน</span>
            </div>
            <div
              ref={fundFilterDrag.ref}
              {...fundFilterDrag.handlers}
              className="flex gap-2 overflow-x-auto pb-1 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ cursor: 'grab', touchAction: 'pan-x' }}
            >
              {/* "ทุกกองทุน" chip */}
              <button
                onClick={() => { if (!fundFilterDrag.hasMoved.current) setSelectedFund('ทุกกองทุน'); }}
                className={cn(
                  "shrink-0 px-3 py-2 rounded-xl text-[14px] font-bold transition-all active:scale-95 border whitespace-nowrap",
                  selectedFund === 'ทุกกองทุน'
                    ? "bg-[#49358E] text-white border-[#49358E] shadow-md shadow-[#49358E]/20"
                    : "bg-white text-[#37286A] border-[#E3E0F0] hover:bg-[#F4F0FF]"
                )}
              >
                ทุกกองทุน ({statusFiltered.length})
              </button>

              {/* Per-fund chips */}
              {fundSummary.map(f => {
                const isActive = selectedFund === f.name;
                return (
                  <button
                    key={f.name}
                    onClick={() => { if (!fundFilterDrag.hasMoved.current) setSelectedFund(f.name); }}
                    className={cn(
                      "shrink-0 px-3 py-2 rounded-xl text-[14px] font-bold transition-all active:scale-95 border whitespace-nowrap flex items-center gap-1.5",
                      isActive
                        ? "text-white shadow-md border-transparent"
                        : "bg-white text-[#37286A] border-[#E3E0F0] hover:bg-[#F4F0FF]"
                    )}
                    style={isActive ? { backgroundColor: f.color, boxShadow: `0 4px 12px ${f.color}33` } : undefined}
                  >
                    {!isActive && <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: f.color }}></div>}
                    {f.name.length > 16 ? f.name.slice(0, 14) + '..' : f.name}
                    <span className={cn("text-[12px] px-1.5 py-0.5 rounded-full", isActive ? "bg-white/25 text-white" : "bg-[#F4F0FF] text-[#49358E]")}>
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected fund summary bar */}
            {selectedFund !== 'ทุกกองทุน' && (() => {
              const info = fundSummary.find(f => f.name === selectedFund);
              if (!info) return null;
              return (
                <div className="bg-white rounded-xl border border-[#E3E0F0] px-3 py-2.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${info.color}15` }}>
                    <Coins size={16} style={{ color: info.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-bold text-[#37286A] truncate block">{info.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[14px] text-[#7066A9]">{info.count} คำขอ</span>
                    <span className="text-[14px] font-black text-[#f5a623]">฿{info.amount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ═══ Pie chart (vertical) ═══ */}
        {pieData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
            <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2 mb-3">
              <PieChartIcon className="text-[#7066A9]" size={18} /> สัดส่วนสถานะ
            </h3>
            <div className="flex flex-col items-center gap-4">
              <div className="w-[130px] h-[130px] relative shrink-0" style={{ minWidth: 130, minHeight: 130 }}>
                <PieChart width={130} height={130}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[18px] font-black text-[#37286A]">{stats.total}</span>
                  <span className="text-[12px] text-[#7066A9]">คำขอ</span>
                </div>
              </div>
              <div className="w-full space-y-2">
                {pieData.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[16px] text-[#5e5873]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[16px] font-black text-[#37286A]">{item.value}</span>
                      <span className="text-[14px] text-[#7066A9]">({stats.total > 0 ? Math.round(item.value / stats.total * 100) : 0}%)</span>
                    </div>
                  </div>
                ))}
                <div className="pt-1.5 border-t border-[#F4F0FF]">
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] text-[#7066A9]">ยอดรวม</span>
                    <span className="text-[16px] font-black text-[#f5a623]">฿{stats.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Patient list ═══ */}
        {filtered.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
                <Wallet className="text-[#7066A9]" size={18} /> รายชื่อผู้ป่วย
              </h3>
              <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{filtered.length} คำขอ</span>
            </div>

            <div className="space-y-3">
              {filtered.map((req) => {
                const img = req.image || resolvePatientImage(req.hn);
                const hospShort = (req.hospital || '-').replace('โรงพยาบาล', 'รพ.').trim();
                const fColor = fundColorMap[req.fundType] || '#49358E';
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4 active:bg-[#F4F0FF] transition-colors cursor-pointer"
                    onClick={() => onSelectRequest?.(req)}
                  >
                    {/* Row 1: patient info */}
                    <div className="flex items-start gap-3">
                      <img
                        src={img}
                        alt={req.patientName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-[#E3E0F0] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[16px] font-bold text-[#37286A] truncate">{req.patientName}</span>
                          <StatusBadge status={req.status} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[14px] text-[#7066A9]">HN: {req.hn}</span>
                          <span className="text-[14px] text-[#D2CEE7]">&bull;</span>
                          <span className="text-[14px] text-[#7066A9] truncate">{hospShort}</span>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: fund + amount */}
                    <div className="mt-3 pt-2.5 border-t border-[#F4F0FF] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fColor }}></div>
                        <span className="text-[14px] text-[#7066A9] truncate">{req.fundType || 'ไม่ระบุ'}</span>
                      </div>
                      <span className="text-[16px] font-black text-[#f5a623] shrink-0">฿{(req.amount || 0).toLocaleString()}</span>
                    </div>

                    {/* Row 3: diagnosis + date */}
                    {(req.diagnosis || req.requestDate) && (
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-[13px] text-[#7066A9] truncate">{req.diagnosis || '-'}</span>
                        {req.requestDate && req.requestDate !== '-' && (
                          <span className="text-[12px] text-[#D2CEE7] shrink-0">วันที่ยื่น: {req.requestDate}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ Hospital summary ═══ */}
        {hospData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] overflow-hidden">
            <div className="p-4 border-b border-[#F4F0FF] flex items-center justify-between">
              <h3 className="font-bold text-[#37286A] text-[18px] flex items-center gap-2">
                <Building2 className="text-[#7066A9]" size={18} /> แยกตามโรงพยาบาล
              </h3>
              <span className="text-[14px] font-bold text-white bg-[#49358E] px-2 py-0.5 rounded-full">{hospData.length} แห่ง</span>
            </div>
            <div className="divide-y divide-[#F4F0FF]">
              {hospData.map(h => (
                <div key={h.name} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-full bg-[#F4F0FF] text-[#49358E] flex items-center justify-center shrink-0"><Building2 size={18} /></div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[16px] font-bold text-[#37286A] truncate block">{h.name}</span>
                    <span className="text-[14px] text-[#7066A9]">{h.count} คำขอ</span>
                  </div>
                  <span className="text-[16px] font-black text-[#f5a623] shrink-0">฿{h.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ Empty state ═══ */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-8 flex flex-col items-center gap-3 text-center">
            <Coins size={36} className="text-[#D2CEE7]" />
            <p className="text-[16px] text-[#7066A9]">ไม่พบคำขอทุน</p>
            <p className="text-[14px] text-[#D2CEE7]">
              {selectedFund !== 'ทุกกองทุน' ? `ไม่มีคำขอจากกองทุน "${selectedFund}"` : 'สำหรับสถานะที่เลือก'}
            </p>
            {selectedFund !== 'ทุกกองทุน' && (
              <button
                onClick={() => setSelectedFund('ทุกกองทุน')}
                className="text-[14px] font-bold text-[#49358E] hover:text-[#37286A] mt-1"
              >
                ดูทุกกองทุน →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
