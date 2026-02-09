import React from 'react';
import CMWebLayout from '../../cm-web/layout/CMWebLayout';
import { Users, Activity, Clock, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Metrics Data based on request
const metrics = [
  {
    title: 'ผู้ป่วยทั้งหมด (Total Patients)',
    value: '19,256',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'ติดตามต่อเนื่อง (Follow-ups)',
    value: '7,789',
    change: '+5.2%',
    trend: 'up',
    icon: Activity,
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'รอการส่งตัว (Pending Referral)',
    value: '342',
    change: '-2.4%',
    trend: 'down',
    icon: Clock,
    color: 'bg-orange-500',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'เอกสารรออนุมัติ (Documents)',
    value: '128',
    change: '+8.1%',
    trend: 'up',
    icon: FileText,
    color: 'bg-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50'
  }
];

export default function CMDashboard() {
  // This file seems to be an old version or just a simple dashboard component.
  // We are moving it to cm-mobile but it imports CMWebLayout?
  // The user asked to move existing stuff to mobile.
  // This looks like a desktop dashboard though.
  // I'll keep it as is but fix the import path.
  // Wait, if it's mobile, why use CMWebLayout? 
  // It seems this was the ORIGINAL CMDashboard which was actually Desktop focused before I split it.
  // But now I have WebDashboard.tsx.
  // I will move this to cm-mobile/dashboard/CMDashboard.tsx for archival purposes as requested "move into mobile"
  // But I will comment out the CMWebLayout import or fix it.
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Mobile Dashboard (Legacy)</h1>
      <p>Use the new mobile dashboard.</p>
    </div>
  );
}
