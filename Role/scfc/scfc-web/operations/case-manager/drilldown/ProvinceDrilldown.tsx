import React, { useMemo } from 'react';
import { ArrowLeft, Users, UserCheck, Building2, Eye, MapPin, Baby, Home, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { CASE_MANAGER_DATA, CaseManager } from '../../../../../../data/patientData';
import { PURPLE } from '../../../../../../data/themeConfig';
import { getStatusLabel, getStatusStyle } from './shared';

interface Props {
  province: string;
  onBack: () => void;
  onSelectCM: (cm: CaseManager) => void;
}

export function ProvinceDrilldown({ province, onBack, onSelectCM }: Props) {
  const filtered = useMemo(() => CASE_MANAGER_DATA.filter(cm => cm.province === province), [province]);

  const stats = useMemo(() => ({
    total: filtered.length,
    active: filtered.filter(c => c.status === 'active').length,
    totalPatients: filtered.reduce((s, c) => s + c.patientCount, 0),
    totalHospitals: new Set(filtered.flatMap(c => c.hospitals.map(h => h.id))).size,
    avgPatients: filtered.length > 0 ? Math.round(filtered.reduce((s, c) => s + c.patientCount, 0) / filtered.length) : 0,
    overloaded: filtered.filter(c => c.patientCount > 40 && c.status === 'active').length,
  }), [filtered]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="p-2.5 rounded-xl bg-[#7367f0]/10"><MapPin className="w-6 h-6 text-[#7367f0]" /></div>
        <div className="flex-1"><h1 className="text-[#5e5873] text-xl">จังหวัด{province}</h1><p className="text-xs text-gray-500">ข้อมูล Case Manager ในจังหวัด</p></div>
        <span className="text-xs text-white bg-[#7367f0] px-3 py-1.5 rounded-full shrink-0">{filtered.length} คน</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'CM ในจังหวัด', value: `${stats.total} คน`, icon: Users, ic: 'text-[#7367f0]', ib: 'bg-[#7367f0]/10' },
          { label: 'ปฏิบัติงาน', value: `${stats.active} คน`, icon: UserCheck, ic: 'text-[#28c76f]', ib: 'bg-[#28c76f]/10' },
          { label: 'ผู้ป่วยรวม', value: `${stats.totalPatients} คน`, icon: Baby, ic: 'text-[#4285f4]', ib: 'bg-[#4285f4]/10' },
          { label: 'เฉลี่ยต่อ CM', value: `${stats.avgPatients} คน`, icon: Building2, ic: 'text-[#ff6d00]', ib: 'bg-[#ff6d00]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl"><CardContent className="p-4 flex items-center gap-3"><div className={cn("p-2.5 rounded-xl", s.ib)}><s.icon className={cn("w-4 h-4", s.ic)} /></div><div><p className="text-xs text-gray-500">{s.label}</p><p className={cn("text-xl", s.ic)}>{s.value}</p></div></CardContent></Card>
        ))}
      </div>

      {stats.overloaded > 0 && (
        <Card className="border-gray-100 shadow-sm rounded-xl border-l-4 border-l-[#EA5455]">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><AlertCircle className="w-5 h-5 text-[#EA5455]" /> CM ภาระงานเกิน ({stats.overloaded} คน)</CardTitle></CardHeader>
          <CardContent><div className="space-y-2">
            {filtered.filter(c => c.patientCount > 40 && c.status === 'active').map(cm => (
              <div key={cm.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSelectCM(cm)}>
                <img src={cm.image} alt={cm.name} className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-sm text-[#5e5873] truncate">{cm.name}</p><p className="text-xs text-[#EA5455]">{cm.patientCount} ผู้ป่วย | {cm.hospitals.length} รพ.</p></div>
                <ChevronRight size={16} className="text-gray-300 shrink-0" />
              </div>
            ))}
          </div></CardContent>
        </Card>
      )}

      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Users className="w-5 h-5 text-[#7367f0]" /> CM ในจังหวัด{province}</CardTitle><span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{filtered.length} คน</span></CardHeader>
        <CardContent className="p-0"><div className="overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-[#EDE9FE]/30">
            <TableHead className="text-xs text-[#5e5873]">ชื่อ / รหัส</TableHead><TableHead className="text-xs text-[#5e5873]">โรงพยาบาล</TableHead><TableHead className="text-xs text-[#5e5873] text-center">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873] text-center">เยี่ยมบ้าน</TableHead><TableHead className="text-xs text-[#5e5873] text-center">สถานะ</TableHead><TableHead className="text-xs w-[60px]"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(cm => {
              const ss = getStatusStyle(cm.status);
              return (<TableRow key={cm.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectCM(cm)}>
                <TableCell><div className="flex items-center gap-3"><img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 border border-white shadow-sm shrink-0" /><div><div className="text-sm text-[#5e5873]">{cm.name}</div><div className="text-xs text-gray-400">{cm.id}</div></div></div></TableCell>
                <TableCell><div className="flex flex-wrap gap-1 max-w-[200px]">{cm.hospitals.slice(0, 2).map(h => (<span key={h.id} className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2 py-0.5 rounded-md border border-gray-100"><Building2 size={10} className="text-[#7367f0]" />{h.name.replace('รพ.', '')}</span>))}{cm.hospitals.length > 2 && <span className="text-xs text-[#7367f0]">+{cm.hospitals.length - 2}</span>}</div></TableCell>
                <TableCell className="text-center"><span className={cn("text-sm", cm.patientCount > 40 ? "text-[#EA5455]" : "text-[#5e5873]")}>{cm.patientCount}</span></TableCell>
                <TableCell className="text-center"><span className="text-sm text-[#28c76f]">{cm.activeVisits}</span><span className="text-xs text-gray-400"> / {cm.completedVisits}</span></TableCell>
                <TableCell className="text-center"><span className={cn("px-2.5 py-1 rounded-full text-xs inline-flex items-center gap-1.5", ss.bg, ss.color)}><span className={cn("w-1.5 h-1.5 rounded-full", ss.dot)}></span>{getStatusLabel(cm.status)}</span></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table></div>
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400"><MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบ CM ในจังหวัดนี้</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
