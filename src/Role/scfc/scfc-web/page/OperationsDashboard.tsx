import React, { useMemo, useState } from "react";
import {
  Video, Users, Activity,
  Calendar, Home, Send, Coins, BarChart3,
  AlertCircle,
  Building2, MapPin, Filter
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import { PATIENTS_DATA, HOME_VISIT_DATA, REFERRAL_DATA, CASE_MANAGER_DATA } from "../../../../data/patientData";
import { PURPLE, PROVINCES, HOSPITALS } from "../../../../data/themeConfig";

const MONTHS = [
  { value: "1", label: "มกราคม" },
  { value: "2", label: "กุมภาพันธ์" },
  { value: "3", label: "มีนาคม" },
  { value: "4", label: "เมษายน" },
  { value: "5", label: "พฤษภาคม" },
  { value: "6", label: "มิถุนายน" },
  { value: "7", label: "กรกฎาคม" },
  { value: "8", label: "สิงหาคม" },
  { value: "9", label: "กันยายน" },
  { value: "10", label: "ตุลาคม" },
  { value: "11", label: "พฤศจิกายน" },
  { value: "12", label: "ธันวาคม" },
];
const YEARS = ["2024", "2025", "2026"];

export function OperationsDashboard() {
  const [provinceFilter, setProvinceFilter] = useState('ทั้งหมด');
  const [hospitalFilter, setHospitalFilter] = useState('ทั้งหมด');
  const [selectedMonth, setSelectedMonth] = useState("2");
  const [selectedYear, setSelectedYear] = useState("2025");

  // Filter patients by province/hospital
  const filteredPatients = useMemo(() => {
    return PATIENTS_DATA.filter(p => {
      const matchProv = provinceFilter === 'ทั้งหมด' || (p.province || '').includes(provinceFilter);
      const matchHosp = hospitalFilter === 'ทั้งหมด' || (p.hospital || '').includes(hospitalFilter);
      return matchProv && matchHosp;
    });
  }, [provinceFilter, hospitalFilter]);

  // Aggregate stats from filtered data
  const stats = useMemo(() => {
    const totalPatients = filteredPatients.length;
    const filteredHNs = new Set(filteredPatients.map(p => p.hn));

    const totalVisits = (HOME_VISIT_DATA || []).filter((v: any) => !filteredHNs.size || filteredHNs.has(v.hn)).length;
    const totalReferrals = (REFERRAL_DATA || []).filter((r: any) => !filteredHNs.size || filteredHNs.has(r.hn)).length;
    const totalCM = CASE_MANAGER_DATA?.length || 0;

    let totalAppointments = 0;
    let pendingAppts = 0;
    filteredPatients.forEach(p => {
      const appts = p.appointmentHistory || [];
      totalAppointments += appts.length;
      pendingAppts += appts.filter((a: any) => a.status === 'waiting' || a.status === 'pending').length;
    });

    let totalFunds = 0;
    let pendingFunds = 0;
    filteredPatients.forEach(p => {
      const funds = p.funding || [];
      totalFunds += funds.length;
      pendingFunds += funds.filter((f: any) => f.status === 'Pending').length;
    });

    let totalTele = 0;
    filteredPatients.forEach(p => {
      totalTele += (p.teleConsultHistory || []).length;
    });

    return {
      totalPatients, totalVisits, totalReferrals, totalCM,
      totalAppointments, pendingAppts, totalFunds, pendingFunds, totalTele
    };
  }, [filteredPatients]);

  // System overview chart
  const systemData = [
    { name: 'เยี่ยมบ้าน', value: stats.totalVisits, color: '#28c76f' },
    { name: 'นัดหมาย', value: stats.totalAppointments, color: '#4285f4' },
    { name: 'ส่งตัว', value: stats.totalReferrals, color: '#ff6d00' },
    { name: 'Tele-med', value: stats.totalTele, color: '#e91e63' },
    { name: 'ขอทุน', value: stats.totalFunds, color: '#f5a623' },
  ].filter(d => d.value > 0);

  // Province distribution
  const provinceData = useMemo(() => {
    const map = new Map<string, number>();
    filteredPatients.forEach(p => {
      const prov = p.province || 'ไม่ระบุ';
      map.set(prov, (map.get(prov) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredPatients]);

  // Hospital distribution
  const hospitalData = useMemo(() => {
    const map = new Map<string, number>();
    filteredPatients.forEach(p => {
      const h = (p.hospital || 'ไม่ระบุ').replace('โรงพยาบาล', 'รพ.').trim();
      map.set(h, (map.get(h) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name: name.length > 12 ? name.slice(0, 12) + '..' : name, fullName: name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredPatients]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 animate-in fade-in duration-300 font-['IBM_Plex_Sans_Thai']">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#5e5873] text-xl">แดชบอร์ดภาพรวม</h1>
          <p className="text-sm text-gray-400 mt-0.5">ศูนย์กลางบริหารจัดการเครือข่าย ThaiCleftLink ภาคเหนือ</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Month Dropdown */}
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[150px] bg-white border-gray-200 h-[38px] rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7367f0]" />
                <SelectValue placeholder="เลือกเดือน" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year Dropdown */}
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] bg-white border-gray-200 h-[38px] rounded-lg text-sm">
              <SelectValue placeholder="เลือกปี" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter size={14} className="text-[#7367f0]" />
          <span>กรองข้อมูล:</span>
        </div>
        <Select value={provinceFilter} onValueChange={setProvinceFilter}>
          <SelectTrigger className="w-[160px] h-10 border-gray-200 rounded-lg text-sm">
            <div className="flex items-center gap-2"><MapPin size={14} className="text-[#7367f0]" /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>{PROVINCES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
          <SelectTrigger className="w-[200px] h-10 border-gray-200 rounded-lg text-sm">
            <div className="flex items-center gap-2"><Building2 size={14} className="text-[#7367f0]" /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>{HOSPITALS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
        </Select>
        {(provinceFilter !== 'ทั้งหมด' || hospitalFilter !== 'ทั้งหมด') && (
          <Button variant="ghost" size="sm" className="text-[#7367f0] text-sm" onClick={() => { setProvinceFilter('ทั้งหมด'); setHospitalFilter('ทั้งหมด'); }}>
            ล้างตัวกรอง
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'ผู้ป่วย', value: stats.totalPatients, icon: Users, color: 'text-[#7367f0]', bg: 'bg-[#7367f0]/10' },
          { label: 'เยี่ยมบ้าน', value: stats.totalVisits, icon: Home, color: 'text-[#28c76f]', bg: 'bg-[#28c76f]/10' },
          { label: 'นัดหมาย', value: stats.totalAppointments, icon: Calendar, color: 'text-[#4285f4]', bg: 'bg-[#4285f4]/10' },
          { label: 'ส่งตัว', value: stats.totalReferrals, icon: Send, color: 'text-[#ff6d00]', bg: 'bg-[#ff6d00]/10' },
          { label: 'Tele-med', value: stats.totalTele, icon: Video, color: 'text-[#e91e63]', bg: 'bg-[#e91e63]/10' },
          { label: 'ขอทุน', value: stats.totalFunds, icon: Coins, color: 'text-[#f5a623]', bg: 'bg-[#f5a623]/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-all">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <p className={cn("text-2xl", stat.color)}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* System Overview Pie */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#7367f0]" /> ภาพรวมระบบทั้งหมด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-[240px] relative" style={{ minHeight: 240, minWidth: 240 }}>
                <ResponsiveContainer width="100%" height={240} minWidth={0} debounce={50}>
                  <PieChart>
                    <Pie data={systemData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={5} dataKey="value" stroke="none">
                      {systemData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm text-gray-400">รายการทั้งหมด</span>
                  <span className="text-3xl text-[#5e5873]">{systemData.reduce((s, d) => s + d.value, 0)}</span>
                </div>
              </div>
              <div className="space-y-3">
                {systemData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm text-[#5e5873]">{item.value} รายการ</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hospital Distribution Bar Chart */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#7367f0]" /> ผู้ป่วยตามโรงพยาบาล
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]" style={{ minWidth: 0, minHeight: 260 }}>
              <ResponsiveContainer width="100%" height={260} debounce={50}>
                <BarChart data={hospitalData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#888' }} allowDecimals={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #eee', fontSize: '12px' }} formatter={(val: any, _: any, props: any) => [`${val} ราย`, props.payload.fullName]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={28} fill={PURPLE.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Province + Action Items Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Province Distribution */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#7367f0]" /> ผู้ป่วยรายจังหวัด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full min-w-0" style={{ minWidth: 0, minHeight: 220 }}>
              <ResponsiveContainer width="100%" height={220} minWidth={0} debounce={50}>
                <BarChart data={provinceData} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={75} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                    {provinceData.map((_, idx) => <Cell key={idx} fill={idx === 0 ? '#7367f0' : idx === 1 ? '#9e95f5' : '#c4bffa'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#f5a623]" /> คำขอรอพิจารณา
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#f5a623]/5 rounded-lg border border-[#f5a623]/10">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-[#f5a623]" />
                <span className="text-sm text-gray-600">ทุนรอพิจารณา</span>
              </div>
              <span className="text-[#f5a623]">{stats.pendingFunds} รายการ</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#4285f4]/5 rounded-lg border border-[#4285f4]/10">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#4285f4]" />
                <span className="text-sm text-gray-600">นัดหมายรอยืนยัน</span>
              </div>
              <span className="text-[#4285f4]">{stats.pendingAppts} รายการ</span>
            </div>
          </CardContent>
        </Card>

        {/* CM Overview */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#7367f0]" /> Case Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {CASE_MANAGER_DATA.slice(0, 4).map(cm => (
              <div key={cm.id} className="flex items-center gap-3">
                
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-[#5e5873] truncate block">{cm.name}</span>
                  <span className="text-xs text-gray-400">{cm.patientCount} ผู้ป่วย</span>
                </div>
                <span className={cn("w-2 h-2 rounded-full shrink-0",
                  cm.status === 'active' ? "bg-[#28c76f]" : cm.status === 'leave' ? "bg-[#ff9f43]" : "bg-[#EA5455]"
                )}></span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[#5e5873] flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#7367f0]" /> กิจกรรมล่าสุด
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l-2 border-gray-100 space-y-4 ml-1">
              {[
                { label: 'เยี่ยมบ้านเสร็จสิ้น 2 รายการ', time: 'วันนี้ 14:30', color: 'bg-[#28c76f]' },
                { label: 'อนุมัติทุนสงเคราะห์ 1 ราย', time: 'วันนี้ 10:00', color: 'bg-[#f5a623]' },
                { label: 'ส่งตัวผู้ป่วยใหม่ 1 ราย', time: 'เมื่อวาน', color: 'bg-[#ff6d00]' },
                { label: 'Tele-med สำเร็จ 3 เซสชัน', time: '2 วันที่แล้ว', color: 'bg-[#e91e63]' },
              ].map((act, i) => (
                <div key={i} className="relative">
                  <div className={cn("absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full ring-3 ring-white", act.color)}></div>
                  <p className="text-sm text-[#5e5873]">{act.label}</p>
                  <p className="text-xs text-gray-400">{act.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}