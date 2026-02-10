import React from "react";
import { 
  Briefcase, 
  Video, 
  Users,
  Activity,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { cn } from "../../../../components/ui/utils";
import { DashboardFilters } from "../components/scfc/DashboardFilters";
import { ApprovalInbox } from "../components/scfc/ApprovalInbox";
import { HomeVisitMonitoring } from "../components/scfc/HomeVisitMap";
import { ReferralPipeline } from "../components/scfc/ReferralPipeline";
import { AppointmentMonitoring } from "../components/scfc/AppointmentMonitoring";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSystem } from "../../../../context/SystemContext";

const fundDistributionData = [
  { name: 'การศึกษา', value: 45000, color: '#0d9488' },
  { name: 'รักษาพยาบาล', value: 85000, color: '#0891b2' },
  { name: 'การเดินทาง', value: 12000, color: '#0f766e' },
  { name: 'ค่าครองชีพ', value: 25000, color: '#115e59' },
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  variant: 'teal' | 'cyan' | 'slate' | 'rose';
}

function StatCard({ title, value, subtitle, icon, trend, trendUp, variant }: StatCardProps) {
  const variants = {
    teal: "bg-teal-50 border-teal-100 text-teal-600",
    cyan: "bg-cyan-50 border-cyan-100 text-cyan-600",
    slate: "bg-slate-50 border-slate-100 text-slate-600",
    rose: "bg-rose-50 border-rose-100 text-rose-600",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between transition-all hover:shadow-md hover:border-teal-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-lg border", variants[variant])}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
            trendUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
          )}>
            {trendUp ? <TrendingUp size={10} className="mr-1" /> : null}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-2xl font-black text-slate-800 tracking-tight">{value}</div>
        {subtitle && (
          <div className="flex items-center gap-1 mt-2">
            <div className="h-1 w-1 rounded-full bg-slate-300"></div>
            <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function OperationsDashboard() {
  const { stats } = useSystem();

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="bg-teal-600 text-white p-1 rounded">
               <ShieldCheck size={16} />
             </div>
             <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">SCFC Overseer Mode</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Monitoring <span className="text-teal-600">&</span> Audit</h1>
          <p className="text-slate-500 text-sm font-medium">ภาพรวมการบริหารจัดการเครือข่าย ThaiCleftLink ภาคเหนือ</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-bold">
           <span className="text-slate-400">STATUS:</span>
           <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             SYSTEM NORMAL
           </span>
        </div>
      </div>

      {/* Global Filters */}
      <DashboardFilters />

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="คำขอทุนรอพิจารณา" 
          value={stats.funds.pending} 
          subtitle="ต้องการการอนุมัติทันที" 
          icon={<Briefcase size={20} />}
          variant="teal"
          trend="8 High Priority"
        />
        <StatCard 
          title="ผู้ป่วยขาดนัด (Loss follow-up)" 
          value={stats.appointments.noShow + "%"} 
          subtitle="เสี่ยงต่อการขาดการรักษา" 
          icon={<AlertCircle size={20} />}
          variant="rose"
          trend="+2 New Alerts"
        />
        <StatCard 
          title="Tele-consult Network" 
          value={stats.teleConsult.active} 
          subtitle="เคสปรึกษาสำเร็จเดือนนี้" 
          icon={<Video size={20} />}
          variant="cyan"
          trendUp={true}
          trend="12% Growth"
        />
        <StatCard 
          title="Case Manager ในระบบ" 
          value="48" 
          subtitle="บุคลากรผู้ประสานงาน" 
          icon={<Users size={20} />}
          variant="slate"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Priority Inbox */}
        <div className="xl:col-span-2 space-y-6">
          <ApprovalInbox />
          <HomeVisitMonitoring />
        </div>

        {/* Right Column: Tracking & Pipeline */}
        <div className="space-y-6">
           <ReferralPipeline />
           <AppointmentMonitoring />
           
           {/* Fund Distribution Chart */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Activity className="text-teal-600" size={18} />
                การกระจายงบประมาณ (Fund Distribution)
              </h3>
              <div className="h-[200px] w-full min-h-[200px] min-w-0" style={{ minHeight: '200px', height: '200px', width: '100%', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                  <BarChart data={fundDistributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {fundDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-teal-600 hover:gap-3 transition-all">
                VIEW FINANCIAL REPORT <ArrowRight size={14} />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
