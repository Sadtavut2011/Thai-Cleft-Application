import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import WebDashboard from './cm-web/dashboard/WebDashboard';
import MobileLayout from './cm-mobile/layout/MobileLayout';

export default function CMEntry() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return <WebDashboard />;
  }

  return <MobileLayout />;
}
