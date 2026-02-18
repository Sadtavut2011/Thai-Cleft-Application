import React, { useMemo } from 'react';
import { ArrowLeft, Home, CheckCircle2, ClipboardList, Building2, Eye, MapPin, Share2, Handshake } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { SYSTEM_ICON_COLORS } from '../../../../../../data/themeConfig';
import { FlatVisit, getStatusConfig } from './shared';

const ICON = SYSTEM_ICON_COLORS.homeVisit;

interface Props {
  visits: FlatVisit[];
  hospitalName: string;
  onBack: () => void;
  onSelectVisit: (v: FlatVisit) => void;
}

export function HospitalDrilldown({ visits, hospitalName, onBack, onSelectVisit }: Props) {
  const filtered = useMemo(() => {
    return visits.filter(v => {
      const h = (v.hospital || '').replace('โรงพยาบาล', 'รพ.').trim();
      return h === hospitalName || v.hospital === hospitalName || h.includes(hospitalName.replace('รพ.', '').replace('..', ''));
    });
  }, [visits, hospitalName]);

  const stats = useMemo(() => ({
    total: filtered.length,
    completed: filtered.filter(v => getStatusConfig(v.status).label === 'เสร็จสิ้น').length,
    delegated: filtered.filter(v => (v.type || '').toLowerCase() === 'delegated').length,
    joint: filtered.filter(v => (v.type || '').toLowerCase() !== 'delegated').length,
  }), [filtered]);

  const rphData = useMemo(() => {
    const map = new Map<string, { total: number; delegated: number; joint: number }>();
    filtered.forEach(v => {
      const r = v.rph || '-';
      if (!map.has(r)) map.set(r, { total: 0, delegated: 0, joint: 0 });
      const e = map.get(r)!;
      e.total++;
      if ((v.type || '').toLowerCase() === 'delegated') e.delegated++; else e.joint++;
    });
    return Array.from(map.entries()).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.total - a.total);
  }, [filtered]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className={cn("p-2.5 rounded-xl", ICON.bg)}><Building2 className={cn("w-6 h-6", ICON.text)} /></div>
        <div className="flex-1"><h1 className="text-[#5e5873] text-xl">{hospitalName}</h1><p className="text-xs text-gray-500">รายละเอียดการเยี่ยมบ้านของโรงพยาบาล</p></div>
        <span className="text-xs text-white bg-[#7367f0] px-3 py-1.5 rounded-full shrink-0">{filtered.length} รายการ</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ทั้งหมด', value: stats.total, icon: ClipboardList, ic: ICON.text, ib: ICON.bg },
          { label: 'เสร็จสิ้น', value: stats.completed, icon: CheckCircle2, ic: 'text-[#28c76f]', ib: 'bg-[#28c76f]/10' },
          { label: 'ฝากเยี่ยม', value: stats.delegated, icon: Share2, ic: 'text-[#ff9f43]', ib: 'bg-[#ff9f43]/10' },
          { label: 'เยี่ยมร่วม', value: stats.joint, icon: Handshake, ic: 'text-[#00cfe8]', ib: 'bg-[#00cfe8]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl", s.ib)}><s.icon className={cn("w-4 h-4", s.ic)} /></div>
              <div><p className="text-xs text-gray-500">{s.label}</p><p className="text-xl text-[#5e5873]">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rphData.length > 0 && (
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><MapPin className={cn("w-5 h-5", ICON.text)} /> รพ.สต. ในสังกัด ({rphData.length} แห่ง)</CardTitle></CardHeader>
          <CardContent><div className="space-y-3">
            {rphData.map(r => {
              const dPct = r.total > 0 ? Math.round((r.delegated / r.total) * 100) : 0;
              const jPct = r.total > 0 ? Math.round((r.joint / r.total) * 100) : 0;
              return (
                <div key={r.name} className="p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#5e5873]">{r.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{r.total} เคส</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#ff9f43] rounded-l-full" style={{ width: `${dPct}%` }}></div>
                      <div className="h-full bg-[#00cfe8] rounded-r-full" style={{ width: `${jPct}%` }}></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                    <span>ฝากเยี่ยม {r.delegated}</span><span>เยี่ยมร่วม {r.joint}</span>
                  </div>
                </div>
              );
            })}
          </div></CardContent>
        </Card>
      )}

      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Home className={cn("w-5 h-5", ICON.text)} /> รายการเยี่ยมบ้าน — {hospitalName}</CardTitle>
          <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length}</span>
        </CardHeader>
        <CardContent className="p-0"><div className="overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-[#EDE9FE]/30">
            <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873]">ประเภท</TableHead>
            <TableHead className="text-xs text-[#5e5873]">หน่วยบริการ</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead>
            <TableHead className="text-xs w-[60px]"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.slice(0, 20).map((v) => {
              const sc = getStatusConfig(v.status);
              return (
                <TableRow key={v.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectVisit(v)}>
                  <TableCell><div className="text-sm text-[#5e5873]">{v.patientName}</div><div className="text-xs text-gray-400">{v.patientId}</div></TableCell>
                  <TableCell><span className="text-sm text-[#7367f0]">{v.type === 'Delegated' ? 'ฝาก รพ.สต.' : 'เยี่ยมร่วม'}</span></TableCell>
                  <TableCell className="text-sm text-gray-600">{v.rph}</TableCell>
                  <TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table></div>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการ</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
