import React, { useMemo, useState } from 'react';
import {
  Users, Building2, MapPin, ChevronRight, ChevronLeft,
  Home, User, Activity, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cn } from '../../../../../components/ui/utils';
import { ImageWithFallback } from '../../../../../components/figma/ImageWithFallback';
import { PATIENTS_DATA, HOME_VISIT_DATA } from '../../../../../data/patientData';
import { SYSTEM_ICON_COLORS } from '../../../../../data/themeConfig';
import { FlatVisit, STATUS_CONFIG, getStatusConfig, formatThaiShortDate } from './shared';
import VisitTypeIcon from '../../../../../imports/Icon-4061-1646';

// Fallback avatar image
import imgFrame1171276583 from "figma:asset/7f12ea1300756f144a0fb5daaf68dbfc01103a46.png";

const ICON = SYSTEM_ICON_COLORS.homeVisit;

// Helper: get patient status label and style
const getPatientStatusInfo = (patient: PatientInTeam) => {
  const label = patient.status || 'ปกติ';
  switch (label) {
    case 'ปกติ':
    case 'Active':
      return { label: 'ปกติ', bg: 'bg-emerald-400', textColor: 'text-white' };
    case 'Loss follow up':
      return { label, bg: 'bg-orange-400', textColor: 'text-white' };
    case 'รักษาเสร็จสิ้น':
    case 'Completed':
      return { label: 'รักษาเสร็จสิ้น', bg: 'bg-blue-400', textColor: 'text-white' };
    case 'เสียชีวิต':
      return { label, bg: 'bg-red-400', textColor: 'text-white' };
    case 'มารดา':
      return { label, bg: 'bg-pink-400', textColor: 'text-white' };
    default:
      return { label, bg: 'bg-emerald-400', textColor: 'text-white' };
  }
};

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
  age: string;
  province: string;
}

// ===== Build Team Data =====
function buildTeamData(provinceFilter: string, hospitalFilter: string): TeamInfo[] {
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
        age: p.age || '-',
        province: p.addressProvince || 'เชียงใหม่',
      });
    }
  });

  const visitMap = new Map<string, any[]>();
  const visitSource = HOME_VISIT_DATA && HOME_VISIT_DATA.length > 0 ? HOME_VISIT_DATA : [];
  visitSource.forEach((v: any) => {
    const rph = v.rph || '-';
    if (!visitMap.has(rph)) visitMap.set(rph, []);
    visitMap.get(rph)!.push(v);
  });

  const allKeys = new Set([...pcuMap.keys(), ...visitMap.keys()]);
  const teams: TeamInfo[] = [];

  allKeys.forEach(key => {
    if (key === '-') return;
    const pcuInfo = pcuMap.get(key);
    const visits = visitMap.get(key) || [];
    const parentHospital = pcuInfo?.parentHospital || 'โรงพยาบาลฝาง';
    const province = pcuInfo?.province || 'เชียงใหม่';
    const district = pcuInfo?.district || '-';
    const subDistrict = pcuInfo?.subDistrict || '-';
    const patients = pcuInfo?.patients || [];

    const completed = visits.filter(v => getStatusConfig(v.status) === STATUS_CONFIG.Completed).length;
    const pending = visits.filter(v => {
      const sc = getStatusConfig(v.status);
      return sc === STATUS_CONFIG.Pending || sc === STATUS_CONFIG.WaitVisit;
    }).length;

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
      status: pending > 3 ? 'งานค้าง' : 'ปกติ',
      patients,
      visits,
    });
  });

  let filtered = teams;
  if (provinceFilter && provinceFilter !== 'ทั้งหมด') {
    filtered = filtered.filter(t => t.province.includes(provinceFilter));
  }
  if (hospitalFilter && hospitalFilter !== 'ทั้งหมด') {
    filtered = filtered.filter(t =>
      t.parentHospital.includes(hospitalFilter) || t.name.includes(hospitalFilter)
    );
  }

  return filtered.sort((a, b) => b.activeVisits - a.activeVisits);
}

// ===== Team Detail View (Mobile) =====
function TeamDetailViewMobile({ team, onBack, onSelectVisit }: { team: TeamInfo; onBack: () => void; onSelectVisit?: (visit: any) => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'visits'>('overview');

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Mobile Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-[18px] truncate">{team.name}</h1>
          <p className="text-white/70 text-[16px] truncate">สังกัด: {team.parentHospital}</p>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-[16px] shrink-0",
          team.status === 'ปกติ' ? "bg-white/20 text-white" : "bg-[#fff0e1] text-[#ff9f43]"
        )}>
          {team.status}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* ── Unit Info Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E3E0F0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F4F0FF] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[#49358E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#37286A] text-[18px] truncate">{team.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={16} className="text-[#7066A9] shrink-0" />
                <p className="text-[16px] text-[#7066A9] truncate">สังกัด {team.parentHospital}</p>
              </div>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-[16px] shrink-0",
              team.status === 'ปกติ' ? "bg-[#E5F8ED] text-[#28c76f]" : "bg-[#fff0e1] text-[#ff9f43]"
            )}>
              {team.status}
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'ผู้ป่วยในพื้นที่', value: team.totalPatients, icon: User, color: 'text-[#49358E]', bg: 'bg-[#49358E]/10' },
            { label: 'เยี่ยมบ้านทั้งหมด', value: team.activeVisits, icon: Home, color: ICON.text, bg: ICON.bg },
            { label: 'เสร็จสิ้น', value: team.completedVisits, icon: CheckCircle2, color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
            { label: 'รอดำเนินการ', value: team.pendingVisits, icon: Clock, color: 'text-[#ff9f43]', bg: 'bg-[#ff9f43]/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border-none shadow-sm p-3 flex items-center gap-3">
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-3 h-3", stat.color)} />
              </div>
              <div>
                <p className="text-[16px] text-[#6a7282]">{stat.label}</p>
                <p className="font-black text-[#37286A] text-[18px]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-[#E3E0F0]">
            {[
              { key: 'overview' as const, label: 'ภาพรวม', icon: Activity },
              { key: 'patients' as const, label: `ผู้ป่วย (${team.patients.length})`, icon: User },
              { key: 'visits' as const, label: `เยี่ยมบ้าน (${team.visits.length})`, icon: Home },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-3 text-[16px] transition-all border-b-2 flex-1 justify-center",
                  activeTab === tab.key
                    ? "border-[#49358E] text-[#49358E]"
                    : "border-transparent text-[#6a7282]"
                )}
              >
                 {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Team Info */}
                <h3 className="text-[16px] text-[#37286A] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#28c76f]" /> ข้อมูลหน่วยบริการ
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'ชื่อหน่วยบริการ', value: team.name, icon: Home },
                    { label: 'สังกัดโรงพยาบาลแม่ข่าย', value: team.parentHospital, icon: Building2 },
                    { label: 'จังหวัด', value: team.province, icon: MapPin },
                    { label: 'อำเภอ', value: team.district, icon: MapPin },
                    { label: 'ตำบล', value: team.subDistrict, icon: MapPin },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-[#F4F0FF]/50 rounded-xl border border-[#E3E0F0]">
                      <div className="bg-[#28c76f]/10 p-2 rounded-lg shrink-0">
                        <item.icon className="w-4 h-4 text-[#28c76f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[16px] text-[#6a7282]">{item.label}</p>
                        <p className="text-[16px] text-[#5e5873]">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Card */}
                

                {/* Progress */}
                <div className="p-4 bg-white rounded-xl border border-[#E3E0F0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[16px] text-[#6a7282]">ความคืบหน้าเยี่ยมบ้าน</span>
                    <span className="text-[16px] text-[#49358E]">
                      {team.activeVisits > 0 ? Math.round((team.completedVisits / team.activeVisits) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#E3E0F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#28c76f] rounded-full transition-all"
                      style={{ width: `${team.activeVisits > 0 ? (team.completedVisits / team.activeVisits) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="space-y-3">
                {team.patients.length === 0 ? (
                  <div className="text-center py-12 text-[#6a7282]">
                    <User className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-[16px]">ไม่พบข้อมูลผู้ป่วยในพื้นที่</p>
                  </div>
                ) : (
                  team.patients.map((pt, index) => {
                    const statusInfo = getPatientStatusInfo(pt);
                    return (
                      <div
                        key={pt.hn}
                        className="bg-white rounded-[16px] p-3 flex items-center justify-between border border-gray-200 shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                          {/* Avatar */}
                          <div className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden shrink-0 border border-white shadow-sm">
                            <ImageWithFallback
                              src={pt.image || imgFrame1171276583}
                              alt={pt.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Patient Info */}
                          <div className="flex flex-col min-w-0 justify-center flex-1">
                            <p className="font-semibold text-[#3c3c3c] text-[20px] leading-tight truncate">{pt.name}</p>
                            <div className="flex items-center justify-between mt-0.5">
                              <p className="text-[#787878] font-medium text-[16px] truncate">HN: {pt.hn}</p>
                              <span className={cn(
                                "text-white border-none gap-1 px-2 py-0.5 text-[10px] rounded-full shadow-sm inline-flex items-center shrink-0 ml-2",
                                statusInfo.bg
                              )}>
                                <CheckCircle2 className="w-3 h-3" strokeWidth={3} /> {statusInfo.label}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <p className="text-[#787878] text-[14px] font-medium truncate flex-1">
                                {pt.age && pt.age !== '-' ? `อายุ ${pt.age.split(' ')[0]} ปี` : ''}
                                {pt.province && pt.province !== '-' ? `, ${pt.province}` : ''}
                              </p>
                              <div className="bg-white border border-[#2F80ED] px-2 py-0.5 rounded-full flex items-center justify-center shrink-0 ml-2">
                                <span className="text-[10px] font-bold text-[rgb(112,102,169)]">{pt.diagnosis !== '-' ? pt.diagnosis : 'Cleft Lip - left'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Visits Tab */}
            {activeTab === 'visits' && (
              <div className="space-y-3">
                {team.visits.length === 0 ? (
                  <div className="text-center py-12 text-[#6a7282]">
                    <Home className="w-10 h-10 mx-auto mb-3 opacity-20" />
                    <p className="text-[16px]">ไม่มีรายการเยี่ยมบ้าน</p>
                  </div>
                ) : (
                  team.visits.map((v: any, i: number) => {
                    const sc = getStatusConfig(v.status);
                    return (
                      <div
                        key={v.id || i}
                        className="bg-white p-3 rounded-xl border border-[#E3E0F0] hover:border-[#C4BFFA] transition-all cursor-pointer"
                        onClick={() => onSelectVisit?.(v)}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-['IBM_Plex_Sans_Thai'] font-bold text-[#5e5873] text-[18px] leading-[20px] truncate">
                                {v.patientName || v.name}
                              </h3>
                              <div className="mt-0.5">
                                <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[16px]">
                                  HN: {v.patientId || v.hn}
                                </span>
                              </div>
                            </div>
                            <div className={cn("px-3 py-1 rounded-[10px]", sc.bg)}>
                              <span className={cn("font-['IBM_Plex_Sans_Thai'] font-medium text-[16px]", sc.color)}>
                                {sc.label}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full mt-1">
                            <div className="flex items-center gap-2">
                              <div className="w-[16px] h-[16px]">
                                <VisitTypeIcon />
                              </div>
                              <span className="font-['IBM_Plex_Sans_Thai'] font-medium text-[#7367f0] text-[16px]">
                                {v.rph || 'ไม่ระบุหน่วยบริการ'}
                              </span>
                            </div>
                            <span className="font-['IBM_Plex_Sans_Thai'] text-[#6a7282] text-[16px]">
                              {formatThaiShortDate(v.requestDate || v.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Main Export: TeamDetailCard (Mobile) =====
interface TeamDetailCardProps {
  provinceFilter: string;
  hospitalFilter: string;
  onSelectVisit?: (visit: any) => void;
  onBack?: () => void;
}

export function TeamDetailCard({ provinceFilter, hospitalFilter, onSelectVisit, onBack }: TeamDetailCardProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);

  const teams = useMemo(() => {
    return buildTeamData(provinceFilter, hospitalFilter);
  }, [provinceFilter, hospitalFilter]);

  if (selectedTeam) {
    return (
      <TeamDetailViewMobile
        team={selectedTeam}
        onBack={() => setSelectedTeam(null)}
        onSelectVisit={onSelectVisit}
      />
    );
  }

  return (
    <div className="bg-[#F4F0FF]/40 min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      {/* Mobile Header */}
      <div className="sticky top-0 w-full bg-[#7066a9] h-[64px] px-4 flex items-center gap-3 shrink-0 z-50 shadow-md">
        {onBack && (
          <button onClick={onBack} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
        )}
        <Users className="w-5 h-5 text-white" />
        <h1 className="text-white text-[18px] flex-1">ทีมงานทั้งหมด</h1>
        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[16px]">{teams.length} ทีม</span>
      </div>

      <div className="p-4 space-y-3 flex-1">
        {teams.map((team) => (
          <div
            key={team.name}
            className="bg-white rounded-2xl shadow-sm p-4 border border-[#E3E0F0] hover:border-[#C4BFFA] transition-all cursor-pointer active:scale-[0.98]"
            onClick={() => setSelectedTeam(team)}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#F4F0FF] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-[#49358E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#37286A] text-[18px] truncate">{team.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[16px] text-[#7066A9]">{team.activeVisits} เคส</span>
                  <span className="text-[16px] text-[#D2CEE7]">&bull;</span>
                  <span className="text-[16px] text-[#7066A9] truncate">{team.parentHospital}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#D2CEE7] shrink-0" />
            </div>
          </div>
        ))}

        {teams.length === 0 && (
          <div className="text-center py-16 text-[#6a7282]">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-[16px]">ไม่พบทีมงานตาม filter ที่เลือก</p>
          </div>
        )}
      </div>
    </div>
  );
}