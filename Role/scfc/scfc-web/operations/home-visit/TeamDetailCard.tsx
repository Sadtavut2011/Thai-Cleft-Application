import React, { useMemo, useState } from 'react';
import {
  Users, Building2, MapPin, ChevronRight, ArrowLeft,
  Home, Phone, User, Activity, Clock, CheckCircle2,
  XCircle, AlertCircle, FileText, ChevronDown, X, Eye
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { PATIENTS_DATA, HOME_VISIT_DATA } from '../../../../../data/patientData';
import { SYSTEM_ICON_COLORS } from '../../../../../data/themeConfig';

const ICON = SYSTEM_ICON_COLORS.homeVisit;

// ===== Types =====
interface TeamInfo {
  name: string;
  parentHospital: string;
  province: string;
  district: string;
  subDistrict: string;
  totalPatients: number;
  activeVisits: number;
  completedVisits: number;
  pendingVisits: number;
  status: string;
  patients: PatientInTeam[];
  visits: any[];
}

interface PatientInTeam {
  hn: string;
  name: string;
  image: string;
  diagnosis: string;
  hospital: string;
  phone: string;
  address: string;
  status: string;
}

// ===== Status Config — consistent with HomeVisitSystem.tsx =====
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Pending:    { label: 'รอการตอบรับ', color: 'text-[#ff9f43]', bg: 'bg-[#fff0e1]' },
  WaitVisit:  { label: 'รอเยี่ยม',   color: 'text-yellow-700', bg: 'bg-yellow-100' },
  InProgress: { label: 'ดำเนินการ',  color: 'text-[#00CFE8]', bg: 'bg-[#E0FBFC]' },
  Completed:  { label: 'เสร็จสิ้น',  color: 'text-[#28C76F]', bg: 'bg-[#E5F8ED]' },
  Rejected:   { label: 'ปฏิเสธ',    color: 'text-[#EA5455]', bg: 'bg-[#FCEAEA]' },
  NotHome:    { label: 'ไม่อยู่',    color: 'text-[#B9B9C3]', bg: 'bg-[#F8F8F8]' },
};

const getVisitStatusConfig = (status: string) => {
  const s = (status || '').toLowerCase();
  if (['completed', 'complete', 'done', 'success', 'เสร็จสิ้น', 'visited'].includes(s)) return STATUS_CONFIG.Completed;
  if (['inprogress', 'in_progress', 'working', 'ดำเนินการ'].includes(s)) return STATUS_CONFIG.InProgress;
  if (['waitvisit', 'wait_visit', 'รอเยี่ยม'].includes(s)) return STATUS_CONFIG.WaitVisit;
  if (['rejected', 'cancel', 'cancelled', 'ปฏิเสธ'].includes(s)) return STATUS_CONFIG.Rejected;
  if (['nothome', 'not_home', 'ไม่อยู่'].includes(s)) return STATUS_CONFIG.NotHome;
  return STATUS_CONFIG.Pending;
};

const formatThaiShortDate = (raw: string | undefined): string => {
  if (!raw || raw === '-') return '-';
  if (/[ก-๙]/.test(raw)) return raw;
  try {
    const d = new Date(raw.match(/^\d{4}-\d{2}-\d{2}$/) ? raw + 'T00:00:00' : raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  } catch { return raw; }
};

// ===== Build Team Data =====
function buildTeamData(provinceFilter: string, hospitalFilter: string): TeamInfo[] {
  // Build mapping: pcu_affiliation → parent hospital info from PATIENTS_DATA
  const pcuMap = new Map<string, {
    parentHospital: string;
    province: string;
    district: string;
    subDistrict: string;
    patients: PatientInTeam[];
  }>();

  PATIENTS_DATA.forEach((p: any) => {
    const pcu = p.responsibleHealthCenter || p.hospitalInfo?.responsibleRph || '-';
    if (pcu === '-') return;

    if (!pcuMap.has(pcu)) {
      pcuMap.set(pcu, {
        parentHospital: p.hospital || '-',
        province: p.addressProvince || 'เชียงใหม่',
        district: p.addressDistrict || '-',
        subDistrict: p.addressSubDistrict || '-',
        patients: [],
      });
    }

    const entry = pcuMap.get(pcu)!;
    // Avoid duplicate patients
    if (!entry.patients.find(pt => pt.hn === p.hn)) {
      entry.patients.push({
        hn: p.hn,
        name: p.name,
        image: p.image || '',
        diagnosis: p.diagnosis || '-',
        hospital: p.hospital || '-',
        phone: p.contact?.phone || '-',
        address: p.contact?.address || '-',
        status: p.patientStatusLabel || p.status || 'ปกติ',
      });
    }
  });

  // Build visit counts per rph
  const visitMap = new Map<string, any[]>();
  const visitSource = HOME_VISIT_DATA && HOME_VISIT_DATA.length > 0 ? HOME_VISIT_DATA : [];
  visitSource.forEach((v: any) => {
    const rph = v.rph || '-';
    if (!visitMap.has(rph)) visitMap.set(rph, []);
    visitMap.get(rph)!.push(v);
  });

  // Merge
  const allKeys = new Set([...pcuMap.keys(), ...visitMap.keys()]);
  const teams: TeamInfo[] = [];

  allKeys.forEach(key => {
    if (key === '-') return;

    const pcuInfo = pcuMap.get(key);
    const visits = visitMap.get(key) || [];

    // If no pcuInfo from patients, try to infer from other teams or use default
    const parentHospital = pcuInfo?.parentHospital || 'โรงพยาบาลฝาง';
    const province = pcuInfo?.province || 'เชียงใหม่';
    const district = pcuInfo?.district || '-';
    const subDistrict = pcuInfo?.subDistrict || '-';
    const patients = pcuInfo?.patients || [];

    const completed = visits.filter(v => getVisitStatusConfig(v.status) === STATUS_CONFIG.Completed).length;
    const pending = visits.filter(v => {
      const sc = getVisitStatusConfig(v.status);
      return sc === STATUS_CONFIG.Pending || sc === STATUS_CONFIG.WaitVisit;
    }).length;

    const teamStatus = pending > 3 ? 'งานค้าง' : 'ปกติ';

    teams.push({
      name: key,
      parentHospital,
      province,
      district,
      subDistrict,
      totalPatients: patients.length,
      activeVisits: visits.length,
      completedVisits: completed,
      pendingVisits: pending,
      status: teamStatus,
      patients,
      visits,
    });
  });

  // Apply filters
  let filtered = teams;
  if (provinceFilter && provinceFilter !== 'ทั้งหมด') {
    filtered = filtered.filter(t => t.province.includes(provinceFilter));
  }
  if (hospitalFilter && hospitalFilter !== 'ทั้งหมด') {
    filtered = filtered.filter(t =>
      t.parentHospital.includes(hospitalFilter) ||
      t.name.includes(hospitalFilter)
    );
  }

  return filtered.sort((a, b) => b.activeVisits - a.activeVisits);
}

// ===== Team Detail View =====
function TeamDetailView({ team, onBack, onSelectVisit }: { team: TeamInfo; onBack: () => void; onSelectVisit?: (visit: any) => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'visits'>('overview');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
      {/* Header */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className={cn("p-2.5 rounded-xl", ICON.bg)}>
            <Users className={cn("w-6 h-6", ICON.text)} />
          </div>
          <div>
            <h1 className="text-[#5e5873] text-xl">{team.name}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-[#7367f0]" />
              สังกัด: {team.parentHospital}
              <span className="text-gray-300 mx-1">&bull;</span>
              <MapPin className="w-3 h-3 text-[#7367f0]" />
              {team.district !== '-' ? `อ.${team.district}` : ''} จ.{team.province}
            </p>
          </div>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs",
          team.status === 'ปกติ' ? "bg-[#EDE9FE] text-[#7367f0]" : "bg-[#fff0e1] text-[#ff9f43]"
        )}>
          {team.status}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ผู้ป่วยในพื้นที่', value: team.totalPatients, icon: User, color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
          { label: 'เยี่ยมบ้านทั้งหมด', value: team.activeVisits, icon: Home, color: ICON.text, bg: ICON.bg },
          { label: 'เสร็จสิ้น', value: team.completedVisits, icon: CheckCircle2, color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
          { label: 'รอดำเนินการ', value: team.pendingVisits, icon: Clock, color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl text-[#5e5873]">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { key: 'overview' as const, label: 'ภาพรวม', icon: Activity },
            { key: 'patients' as const, label: `ผู้ป่วย (${team.patients.length})`, icon: User },
            { key: 'visits' as const, label: `เยี่ยมบ้าน (${team.visits.length})`, icon: Home },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-5 py-3 text-sm transition-all border-b-2",
                activeTab === tab.key
                  ? "border-[#7367f0] text-[#7367f0]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Info Card */}
              <div className="space-y-4">
                <h3 className="text-sm text-[#5e5873] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#28c76f]" /> ข้อมูลหน่วยบริการ
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'ชื่อหน่วยบริการ', value: team.name, icon: Home },
                    { label: 'สังกัดโรงพยาบาลแม่ข่าย', value: team.parentHospital, icon: Building2 },
                    { label: 'จังหวัด', value: team.province, icon: MapPin },
                    { label: 'อำเภอ', value: team.district, icon: MapPin },
                    { label: 'ตำบล', value: team.subDistrict, icon: MapPin },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="bg-[#28c76f]/10 p-2 rounded-lg shrink-0">
                        <item.icon className="w-4 h-4 text-[#28c76f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm text-[#5e5873]">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="space-y-4">
                <h3 className="text-sm text-[#5e5873] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#28c76f]" /> สรุปผลงาน
                </h3>
                <div className="bg-gradient-to-br from-[#7367f0] to-[#5B4FCC] rounded-xl p-5 text-white shadow-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/60">ผู้ป่วยที่ดูแล</p>
                      <p className="text-2xl mt-1">{team.totalPatients} ราย</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">เยี่ยมบ้านทั้งหมด</p>
                      <p className="text-2xl mt-1">{team.activeVisits} ครั้ง</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/60">เสร็จสิ้น</p>
                      <p className="text-lg text-[#28c76f]">{team.completedVisits}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">รอดำเนินการ</p>
                      <p className="text-lg text-[#ff9f43]">{team.pendingVisits}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">ความคืบหน้าเยี่ยมบ้าน</span>
                    <span className="text-xs text-[#7367f0]">
                      {team.activeVisits > 0 ? Math.round((team.completedVisits / team.activeVisits) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#28c76f] rounded-full transition-all"
                      style={{ width: `${team.activeVisits > 0 ? (team.completedVisits / team.activeVisits) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Area Info */}
                <div className="p-4 bg-[#EDE9FE]/30 rounded-lg border border-[#7367f0]/10">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#7367f0] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#5e5873]">พื้นที่รับผิดชอบ</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {team.name} อยู่ในพื้นที่รับผิดชอบของ <span className="text-[#7367f0]">{team.parentHospital}</span>
                        {team.district !== '-' && (
                          <span> ครอบคลุมพื้นที่ อ.{team.district} จ.{team.province}</span>
                        )}
                        {team.subDistrict !== '-' && (
                          <span> ต.{team.subDistrict}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="space-y-3">
              {team.patients.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <User className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">ไม่พบข้อมูลผู้ป่วยในพื้นที่</p>
                </div>
              ) : (
                team.patients.map((pt) => (
                  <div key={pt.hn} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#7367f0]/30 hover:shadow-sm transition-all cursor-pointer group">
                    <img
                      src={pt.image}
                      alt={pt.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#5e5873]">{pt.name}</span>
                        <span className="text-xs text-gray-400">HN: {pt.hn}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Activity className="w-3 h-3 text-[#28c76f]" /> {pt.diagnosis}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {pt.hospital}
                        </span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs shrink-0",
                      pt.status === 'ปกติ' || pt.status === 'Active'
                        ? "bg-[#E5F8ED] text-[#28c76f]"
                        : "bg-[#fff0e1] text-[#ff9f43]"
                    )}>
                      {pt.status}
                    </span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#7367f0] transition-colors shrink-0" />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Visits Tab */}
          {activeTab === 'visits' && (
            <div className="space-y-3">
              {team.visits.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Home className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">ไม่มีรายการเยี่ยมบ้าน</p>
                </div>
              ) : (
                team.visits.map((v: any, i: number) => {
                  const sc = getVisitStatusConfig(v.status);
                  return (
                    <div
                      key={v.id || i}
                      className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#7367f0]/30 hover:shadow-sm transition-all cursor-pointer group"
                      onClick={() => onSelectVisit?.(v)}
                    >
                      <div className={cn("p-2.5 rounded-lg shrink-0", ICON.bg)}>
                        <Home className={cn("w-4 h-4", ICON.text)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#5e5873]">{v.patientName || v.name}</span>
                          <span className="text-xs text-gray-400">{v.hn || v.patientId}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatThaiShortDate(v.requestDate || v.date)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {v.type === 'Delegated' ? 'ฝาก รพ.สต.' : 'ลงเยี่ยมร่วม'}
                          </span>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs shrink-0", sc.bg, sc.color)}>
                        {sc.label}
                      </span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#7367f0] transition-colors shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Main Export: TeamDetailCard =====
interface TeamDetailCardProps {
  provinceFilter: string;
  hospitalFilter: string;
  onSelectVisit?: (visit: any) => void;
  onBack?: () => void;
  fullPage?: boolean;
}

export function TeamDetailCard({ provinceFilter, hospitalFilter, onSelectVisit, onBack, fullPage }: TeamDetailCardProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);

  const teams = useMemo(() => {
    return buildTeamData(provinceFilter, hospitalFilter);
  }, [provinceFilter, hospitalFilter]);

  // Detail View
  if (selectedTeam) {
    return (
      <TeamDetailView
        team={selectedTeam}
        onBack={() => setSelectedTeam(null)}
        onSelectVisit={onSelectVisit}
      />
    );
  }

  // Full-page mode (when rendered standalone)
  if (fullPage) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">
        {/* Header */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 text-[#5e5873]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className={cn("p-2.5 rounded-xl", ICON.bg)}>
            <Users className={cn("w-6 h-6", ICON.text)} />
          </div>
          <div>
            <h1 className="text-[#5e5873] text-xl">ทีมงานทั้งหมด</h1>
            <p className="text-xs text-gray-500">รายการหน่วยบริการที่ปฏิบัติหน้าที่เยี่ยมบ้าน</p>
          </div>
          <span className="text-xs text-white bg-[#7367f0] px-2.5 py-1 rounded-full ml-auto">{teams.length} ทีม</span>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card
              key={team.name}
              className="border-gray-100 shadow-sm rounded-xl hover:border-[#7367f0]/30 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedTeam(team)}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-lg", ICON.bg)}>
                    <Building2 className={cn("w-5 h-5", ICON.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#5e5873] group-hover:text-[#7367f0] transition-colors truncate">{team.name}</p>
                    <p className="text-xs text-gray-400 truncate">{team.parentHospital}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs shrink-0",
                    team.status === 'ปกติ' ? "bg-[#EDE9FE] text-[#7367f0]" : "bg-[#fff0e1] text-[#ff9f43]"
                  )}>{team.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg text-[#5e5873]">{team.totalPatients}</p>
                    <p className="text-xs text-gray-400">ผู้ป่วย</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg text-[#28c76f]">{team.completedVisits}</p>
                    <p className="text-xs text-gray-400">เสร็จสิ้น</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg text-[#ff9f43]">{team.pendingVisits}</p>
                    <p className="text-xs text-gray-400">รอดำเนินการ</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> จ.{team.province}
                  </span>
                  <span className="text-xs text-[#7367f0] group-hover:underline flex items-center gap-1">
                    ดูรายละเอียด <ChevronRight size={14} />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>ไม่พบทีมงานตาม filter ที่เลือก</p>
          </div>
        )}
      </div>
    );
  }

  // List View (card in dashboard)
  return (
    <Card className="border-gray-100 shadow-sm rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#7367f0]" /> ทีมงานที่ปฏิบัติหน้าที่
          <span className="text-xs text-white bg-[#7367f0] px-2 py-0.5 rounded-full">{teams.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {teams.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm">ไม่พบทีมงานตาม filter ที่เลือก</p>
          </div>
        ) : (
          teams.map((team, i) => (
            <div
              key={team.name}
              className="flex items-center gap-3 py-3 px-3 rounded-lg border border-gray-100 hover:border-[#7367f0]/30 hover:shadow-sm transition-all cursor-pointer group"
              onClick={() => setSelectedTeam(team)}
            >
              <div className={cn("p-2.5 rounded-lg shrink-0", ICON.bg)}>
                <Building2 className={cn("w-4 h-4", ICON.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#5e5873] group-hover:text-[#7367f0] transition-colors">{team.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{team.activeVisits} เคสที่ดูแลอยู่</span>
                  <span className="text-xs text-gray-300">&bull;</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {team.parentHospital}
                  </span>
                </div>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs shrink-0",
                team.status === 'ปกติ' ? "bg-[#EDE9FE] text-[#7367f0]" : "bg-[#fff0e1] text-[#ff9f43]"
              )}>
                {team.status}
              </span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-[#7367f0] transition-colors shrink-0" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}