import React from 'react';
import { TopHeader } from './TopHeader';

interface StandardPageLayoutProps {
    title: string;
    children: React.ReactNode;
    bypassContentCard?: boolean;
    onBack?: () => void;
}

export default function StandardPageLayout({ title, children, bypassContentCard, onBack }: StandardPageLayoutProps) {
    return (
        <div className="bg-[#edebfe] h-full flex flex-col relative overflow-hidden">
            {/* Global Header */}
            <TopHeader onBack={onBack} title={title} />

            {/* Main Content Card */}
            {bypassContentCard ? (
                 <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
                    {children}
                </div>
            ) : (
                <div className="bg-white flex-1 rounded-t-[24px] flex flex-col overflow-hidden shadow-[0_-4px_20px_rgba(0,0,0,0.02)] relative z-10">
                    {children}
                </div>
            )}
        </div>
    );
}