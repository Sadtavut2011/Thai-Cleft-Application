import React from 'react';
import AdminSidebar from './AdminSidebar';
import WebHeader from '../../../components/shared/WebHeader';

interface AdminWebLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export default function AdminWebLayout({ children, activePage, onNavigate }: AdminWebLayoutProps) {
  return (
    <div className="flex h-screen bg-[#F8F8F8] font-['IBM_Plex_Sans_Thai'] overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar activePage={activePage} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header */}
        <div className="sticky top-0 z-30 p-[10px] bg-[#F8F8F8]">
          <WebHeader 
            onProfileClick={() => onNavigate?.("ข้อมูลส่วนตัว")} 
            onNotificationClick={() => console.log('Notification Clicked')} 
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 text-slate-800">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}