import React, { useMemo } from 'react';
import { ArrowLeft, Users, TrendingUp, Baby, Building2, Home, ChevronRight, Award } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { CASE_MANAGER_DATA, CaseManager } from '../../../../../../data/patientData';
import { getStatusLabel, getStatusStyle } from './shared';

interface Props {
  onBack: () => void;
  onSelectCM: (cm: CaseManager) => void;
}

export function TopPerformersDrilldown({ onBack, onSelectCM }: Props) {
  const ranked = useMemo(() =>
    CASE_MANAGER_DATA.filter(c => c.status === 'active').sort((a, b) => b.patientCount - a.patientCount),
  []);

  const stats = useMemo(() => ({
    total: ranked.length,
    totalPatients: ranked.reduce((s, c) => s + c.patientCount, 0),
    avgPatients: ranked.length > 0 ? Math.round(ranked.reduce((s, c) => s + c.patientCount, 0) / ranked.length) : 0,
    totalHospitals: new Set(ranked.flatMap(c => c.hospitals.map(h => h.id))).size,
  }), [ranked]);

  const maxPatients = ranked.length > 0 ? ranked[0].patientCount : 1;

  const getRankStyle = (i: number) => {
    if (i === 0) return 'bg-[#7367f0] text-white';
    if (i === 1) return 'bg-[#9e95f5] text-white';
    if (i === 2) return 'bg-[#c4bffa] text-[#5e5873]';
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="bg-[#7367f0]/10 p-2.5 rounded-xl"><TrendingUp className="w-6 h-6 text-[#7367f0]" /></div>
        <div>
          <h1 className="text-[#5e5873] text-xl">CM ดูแลมากที่สุด</h1>
          <p className="text-xs text-gray-500">จัดอันดับ CM ตามจำนวนผู้ป่วยที่ดูแล</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'CM ปฏิบัติงาน', value: stats.total, color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10', icon: Users },
          { label: 'ผู้ป่วยรวม', value: stats.totalPatients, color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10', icon: Baby },
          { label: 'เฉลี่ย/CM', value: stats.avgPatients, color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10', icon: TrendingUp },
          { label: 'โรงพยาบาล', value: stats.totalHospitals, color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/10', icon: Building2 },
        ].map((s, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl", s.bg)}><s.icon className={cn("w-5 h-5", s.color)} /></div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={cn("text-2xl", s.color)}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ranking Table */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
            <Award size={18} className="text-[#7367f0]" /> อันดับ CM ({ranked.length} คน)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop */}
          <div className="overflow-x-auto hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-xs text-[#5e5873] w-[60px] text-center">อันดับ</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">ชื่อ CM</TableHead>
                  <TableHead className="text-xs text-[#5e5873] text-center">ผู้ป่วย</TableHead>
                  <TableHead className="text-xs text-[#5e5873] text-center">โรงพยาบาล</TableHead>
                  <TableHead className="text-xs text-[#5e5873] text-center">เยี่ยมบ้าน</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">สัดส่วน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranked.map((cm, i) => (
                  <TableRow key={cm.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectCM(cm)}>
                    <TableCell className="text-center">
                      <span className={cn("w-7 h-7 rounded-full inline-flex items-center justify-center text-xs", getRankStyle(i))}>{i + 1}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                        <div>
                          <div className="text-sm text-[#5e5873]">{cm.name}</div>
                          <div className="text-xs text-gray-400">{cm.id} • จ.{cm.province}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn("text-sm", i < 3 ? "text-[#7367f0]" : "text-[#5e5873]")}>{cm.patientCount}</span>
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-600">{cm.hospitals.length}</TableCell>
                    <TableCell className="text-center text-sm text-[#28c76f]">{cm.activeVisits}</TableCell>
                    <TableCell>
                      <div className="w-full max-w-[120px] h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#7367f0] rounded-full" style={{ width: `${(cm.patientCount / maxPatients) * 100}%` }}></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile */}
          <div className="md:hidden p-3 space-y-2">
            {ranked.map((cm, i) => (
              <div key={cm.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => onSelectCM(cm)}>
                <span className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0", getRankStyle(i))}>{i + 1}</span>
                <img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#5e5873] truncate">{cm.name}</p>
                  <p className="text-xs text-gray-400">{cm.hospitals.length} รพ.</p>
                </div>
                <span className={cn("text-sm", i < 3 ? "text-[#7367f0]" : "text-[#5e5873]")}>{cm.patientCount}</span>
                <ChevronRight size={14} className="text-gray-300 shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
