import React from 'react';
import CMSidebar from './CMSidebar';
import WebHeader from '../../../../components/shared/WebHeader';

interface CMWebLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function CMWebLayout({ children, currentView, onNavigate }: CMWebLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex font-['IBM_Plex_Sans_Thai']">
      {/* Fixed Sidebar */}
      <CMSidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 ml-[250px] flex flex-col min-w-0">
        {/* Top Header */}
        <div className="sticky top-0 z-30 p-[10px] bg-[#F8F8F8]">
          <WebHeader 
            onProfileClick={() => onNavigate("ข้อมูลส่วนตัว")} 
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