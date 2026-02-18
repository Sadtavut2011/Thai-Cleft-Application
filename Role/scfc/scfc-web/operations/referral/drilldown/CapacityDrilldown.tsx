import React, { useMemo } from 'react';
import { ArrowLeft, Send, Building2, Eye, AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { SYSTEM_ICON_COLORS } from '../../../../../../data/themeConfig';
import { PATIENTS_DATA } from '../../../../../../data/patientData';
import { FlatReferral, getStatusConfig, getUrgencyConfig } from './shared';

const ICON = SYSTEM_ICON_COLORS.referral;

interface Props {
  referrals: FlatReferral[];
  hospitalName: string;
  onBack: () => void;
  onSelectReferral: (r: FlatReferral) => void;
}

export function CapacityDrilldown({ referrals, hospitalName, onBack, onSelectReferral }: Props) {
  const hospReferrals = useMemo(() => referrals.filter(r =>
    (r.sourceHospital || '').includes(hospitalName) || (r.destinationHospital || '').includes(hospitalName)
  ), [referrals, hospitalName]);

  const incoming = useMemo(() => hospReferrals.filter(r =>
    (r.destinationHospital || '').includes(hospitalName) && (r.status === 'Pending' || r.status === 'Accepted')
  ), [hospReferrals, hospitalName]);

  const outgoing = useMemo(() => hospReferrals.filter(r =>
    (r.sourceHospital || '').includes(hospitalName)
  ), [hospReferrals, hospitalName]);

  const patients = useMemo(() => PATIENTS_DATA.filter(p => (p.hospital || '').includes(hospitalName)), [hospitalName]);

  const stats = useMemo(() => ({
    totalReferrals: hospReferrals.length,
    incoming: incoming.length,
    outgoing: outgoing.length,
    patients: patients.length,
    pending: hospReferrals.filter(r => r.status === 'Pending').length,
    completed: hospReferrals.filter(r => r.status === 'Completed').length,
  }), [hospReferrals, incoming, outgoing, patients]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className={cn("p-2.5 rounded-xl", ICON.bg)}><Building2 className={cn("w-6 h-6", ICON.text)} /></div>
        <div className="flex-1"><h1 className="text-[#5e5873] text-xl">{hospitalName}</h1><p className="text-xs text-gray-500">ข้อมูลส่งตัวและผู้ป่วยในการดูแล</p></div>
        <span className="text-xs text-white bg-[#7367f0] px-3 py-1.5 rounded-full shrink-0">{stats.totalReferrals} การส่งตัว</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ผู้ป่วยในดูแล', value: stats.patients, icon: Users, ic: 'text-[#7367f0]', ib: 'bg-[#7367f0]/10' },
          { label: 'ส่งตัวเข้า (รอ)', value: stats.incoming, icon: AlertTriangle, ic: 'text-[#ff6d00]', ib: 'bg-[#ff6d00]/10' },
          { label: 'ส่งตัวออก', value: stats.outgoing, icon: Send, ic: ICON.text, ib: ICON.bg },
          { label: 'ตรวจเสร็จ', value: stats.completed, icon: CheckCircle2, ic: 'text-[#28c76f]', ib: 'bg-[#28c76f]/10' },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl"><CardContent className="p-4 flex items-center gap-3"><div className={cn("p-2.5 rounded-xl", s.ib)}><s.icon className={cn("w-4 h-4", s.ic)} /></div><div><p className="text-xs text-gray-500">{s.label}</p><p className="text-xl text-[#5e5873]">{s.value}</p></div></CardContent></Card>
        ))}
      </div>

      {/* Incoming referrals */}
      {incoming.length > 0 && (
        <Card className="border-gray-100 shadow-sm rounded-xl border-l-4 border-l-[#ff6d00]">
          <CardHeader className="pb-2"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-[#ff6d00]" /> รอส่งตัวเข้ามา ({incoming.length} ราย)</CardTitle></CardHeader>
          <CardContent><div className="space-y-2">
            {incoming.map(r => {
              const sc = getStatusConfig(r.status);
              const uc = getUrgencyConfig(r.urgency);
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => onSelectReferral(r)}>
                  <div className="flex-1 min-w-0"><div className="text-sm text-[#5e5873]">{r.patientName}</div><div className="text-xs text-gray-400">จาก: {r.sourceHospital}</div></div>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs shrink-0", uc.bg, uc.color)}>{uc.label}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs shrink-0", sc.bg, sc.color)}>{sc.label}</span>
                </div>
              );
            })}
          </div></CardContent>
        </Card>
      )}

      {/* All referrals for this hospital */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-base text-[#5e5873] flex items-center gap-2"><Send className={cn("w-5 h-5", ICON.text)} /> การส่งตัวทั้งหมด</CardTitle><span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full">{hospReferrals.length}</span></CardHeader>
        <CardContent className="p-0"><div className="overflow-x-auto"><Table>
          <TableHeader><TableRow className="bg-[#EDE9FE]/30">
            <TableHead className="text-xs text-[#5e5873]">ผู้ป่วย</TableHead><TableHead className="text-xs text-[#5e5873]">ต้นทาง → ปลายทาง</TableHead><TableHead className="text-xs text-[#5e5873]">ความเร่งด่วน</TableHead><TableHead className="text-xs text-[#5e5873]">สถานะ</TableHead><TableHead className="text-xs w-[60px]"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {hospReferrals.slice(0, 20).map((r) => {
              const sc = getStatusConfig(r.status);
              const uc = getUrgencyConfig(r.urgency);
              return (<TableRow key={r.id} className="hover:bg-[#EDE9FE]/10 cursor-pointer transition-colors" onClick={() => onSelectReferral(r)}>
                <TableCell><div className="text-sm text-[#5e5873]">{r.patientName}</div><div className="text-xs text-gray-400">{r.hn}</div></TableCell>
                <TableCell><div className="flex items-center gap-1 text-sm text-gray-600"><span className="truncate max-w-[80px]">{r.sourceHospital}</span><Send size={12} className="text-[#ff6d00] shrink-0" /><span className="truncate max-w-[80px] text-[#7367f0]">{r.destinationHospital}</span></div></TableCell>
                <TableCell><span className={cn("px-2 py-1 rounded-full text-xs", uc.bg, uc.color)}>{uc.label}</span></TableCell>
                <TableCell><span className={cn("px-2.5 py-1 rounded-full text-xs", sc.bg, sc.color)}>{sc.label}</span></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-[#7367f0] hover:bg-[#7367f0]/10"><Eye size={16} /></Button></TableCell>
              </TableRow>);
            })}
          </TableBody>
        </Table></div>
        {hospReferrals.length === 0 && <div className="text-center py-16 text-gray-400"><Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" /><p>ไม่พบรายการ</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}
