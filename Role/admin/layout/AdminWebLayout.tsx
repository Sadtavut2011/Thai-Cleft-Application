import React from 'react';
import AdminSidebar from './AdminSidebar';
import { WebHeader } from './WebHeader';

interface AdminWebLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export default function AdminWebLayout({ children, activePage, onNavigate }: AdminWebLayoutProps) {
  return (
    <div className="flex h-screen bg-[#F1F5F9] font-['IBM_Plex_Sans_Thai'] overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar activePage={activePage} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header */}
        <div className="sticky top-0 z-30 w-full px-4 pt-4 md:px-8">
          <WebHeader 
            onNavigate={(page) => console.log('Navigate to:', page)} 
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
