import React, { useMemo } from 'react';
import { ArrowLeft, Users, AlertCircle, Baby, Building2, Home, ChevronRight, Activity } from 'lucide-react';
import { cn } from '../../../../../../components/ui/utils';
import { Button } from '../../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../../../components/ui/table';
import { CASE_MANAGER_DATA, CaseManager } from '../../../../../../data/patientData';
import { getStatusLabel, getStatusStyle } from './shared';

const OVERLOAD_THRESHOLD = 40;

interface Props {
  onBack: () => void;
  onSelectCM: (cm: CaseManager) => void;
}

export function WorkloadDrilldown({ onBack, onSelectCM }: Props) {
  const allActive = useMemo(() =>
    CASE_MANAGER_DATA.filter(c => c.status === 'active').sort((a, b) => b.patientCount - a.patientCount),
  []);

  const overloaded = useMemo(() => allActive.filter(c => c.patientCount > OVERLOAD_THRESHOLD), [allActive]);
  const normal = useMemo(() => allActive.filter(c => c.patientCount <= OVERLOAD_THRESHOLD), [allActive]);

  const stats = useMemo(() => ({
    totalActive: allActive.length,
    overloaded: overloaded.length,
    avgPatients: allActive.length > 0 ? Math.round(allActive.reduce((s, c) => s + c.patientCount, 0) / allActive.length) : 0,
    maxPatients: allActive.length > 0 ? allActive[0].patientCount : 0,
  }), [allActive, overloaded]);

  const maxBar = stats.maxPatients || 1;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]"><ArrowLeft className="w-5 h-5" /></Button>
        <div className="bg-[#EA5455]/10 p-2.5 rounded-xl"><AlertCircle className="w-6 h-6 text-[#EA5455]" /></div>
        <div>
          <h1 className="text-[#5e5873] text-xl">Workload Alert</h1>
          <p className="text-xs text-gray-500">ภาระงาน CM ที่ปฏิบัติงาน (เกณฑ์ &gt; {OVERLOAD_THRESHOLD} ผู้ป่วย)</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'CM ที่ปฏิบัติงาน', value: stats.totalActive, color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10', icon: Users },
          { label: 'ภาระงานเกิน', value: stats.overloaded, color: 'text-[#EA5455]', bg: 'bg-[#EA5455]/10', icon: AlertCircle },
          { label: 'เฉลี่ยผู้ป่วย/CM', value: stats.avgPatients, color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10', icon: Activity },
          { label: 'มากสุด', value: stats.maxPatients, color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/10', icon: Baby },
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

      {/* Overloaded Section */}
      {overloaded.length > 0 && (
        <Card className="border-red-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#EA5455] flex items-center gap-2">
              <AlertCircle size={18} /> ภาระงานเกินเกณฑ์ ({overloaded.length} คน)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-red-50/50">
                    <TableHead className="text-xs text-[#5e5873]">ชื่อ CM</TableHead>
                    <TableHead className="text-xs text-[#5e5873] text-center">ผู้ป่วย</TableHead>
                    <TableHead className="text-xs text-[#5e5873] text-center">โรงพยาบาล</TableHead>
                    <TableHead className="text-xs text-[#5e5873]">ภาระงาน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overloaded.map((cm) => (
                    <TableRow key={cm.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectCM(cm)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                          <div>
                            <div className="text-sm text-[#5e5873]">{cm.name}</div>
                            <div className="text-xs text-gray-400">{cm.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-[#EA5455]">{cm.patientCount}</TableCell>
                      <TableCell className="text-center text-gray-600">{cm.hospitals.length}</TableCell>
                      <TableCell>
                        <div className="w-full max-w-[120px] h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#EA5455] rounded-full" style={{ width: `${(cm.patientCount / maxBar) * 100}%` }}></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden p-3 space-y-2">
              {overloaded.map((cm) => (
                <div key={cm.id} className="p-3 rounded-lg border border-red-100 bg-red-50/30 cursor-pointer hover:bg-red-50/60 transition-colors" onClick={() => onSelectCM(cm)}>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#5e5873] truncate">{cm.name}</p>
                      <p className="text-xs text-gray-400">{cm.id}</p>
                    </div>
                    <span className="text-sm text-[#EA5455]">{cm.patientCount} ผู้ป่วย</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EA5455] rounded-full" style={{ width: `${(cm.patientCount / maxBar) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Normal Section */}
      <Card className="border-gray-100 shadow-sm rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
            <Users size={18} className="text-[#28c76f]" /> ภาระงานปกติ ({normal.length} คน)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="text-xs text-[#5e5873]">ชื่อ CM</TableHead>
                  <TableHead className="text-xs text-[#5e5873] text-center">ผู้ป่วย</TableHead>
                  <TableHead className="text-xs text-[#5e5873] text-center">โรงพยาบาล</TableHead>
                  <TableHead className="text-xs text-[#5e5873]">ภาระงาน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {normal.map((cm) => (
                  <TableRow key={cm.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectCM(cm)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                        <div>
                          <div className="text-sm text-[#5e5873]">{cm.name}</div>
                          <div className="text-xs text-gray-400">{cm.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-[#5e5873]">{cm.patientCount}</TableCell>
                    <TableCell className="text-center text-gray-600">{cm.hospitals.length}</TableCell>
                    <TableCell>
                      <div className="w-full max-w-[120px] h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#28c76f] rounded-full" style={{ width: `${(cm.patientCount / maxBar) * 100}%` }}></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="md:hidden p-3 space-y-2">
            {normal.map((cm) => (
              <div key={cm.id} className="p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => onSelectCM(cm)}>
                <div className="flex items-center gap-3 mb-2">
                  <img src={cm.image} alt={cm.name} className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#5e5873] truncate">{cm.name}</p>
                    <p className="text-xs text-gray-400">{cm.id}</p>
                  </div>
                  <span className="text-sm text-[#5e5873]">{cm.patientCount} ผู้ป่วย</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#28c76f] rounded-full" style={{ width: `${(cm.patientCount / maxBar) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
