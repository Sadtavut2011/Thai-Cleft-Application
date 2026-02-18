import React from 'react';
import CMSidebar from './CMSidebar';
import { Button } from '../../../../components/ui/button';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';

interface CMWebLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function CMWebLayout({ children, currentView, onNavigate }: CMWebLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-['IBM_Plex_Sans_Thai']">
      {/* Fixed Sidebar */}
      <CMSidebar currentView={currentView} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex-1 ml-[250px] flex flex-col min-w-0">
        {/* Top Header - White Theme */}
        <div className="sticky top-0 z-30 bg-white h-[72px] px-8 flex items-center justify-between shadow-sm">
           {/* Left side (Spacer or Breadcrumbs if needed) */}
           <div></div>

           {/* Right Side */}
           <div className="flex items-center gap-6">
              <Button 
                className="bg-[#5A4E93] hover:bg-[#4D4280] text-white rounded-lg px-6 h-10 font-medium"
              >
                Thai Cleft Link
              </Button>

              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-slate-700 leading-tight">John Doe</p>
                    <p className="text-xs text-slate-400 font-medium">Admin</p>
                 </div>
                 <div className="relative">
                    <ImageWithFallback 
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=60" 
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
