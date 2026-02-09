import React from 'react';
import SCFCSidebar from './SCFCSidebar';
import DashboardTopBar from '@/components/shared/DashboardTopBar';

interface SCFCWebLayoutProps {
  children: React.ReactNode;
}

export default function SCFCWebLayout({ children }: SCFCWebLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-['IBM_Plex_Sans_Thai']">
      {/* Fixed Sidebar */}
      <SCFCSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-[280px] flex flex-col min-w-0">
        {/* Top Header */}
        <div className="sticky top-0 z-30">
          <DashboardTopBar 
            onProfileClick={() => console.log('Profile Clicked')} 
            onNotificationClick={() => console.log('Notification Clicked')} 
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
