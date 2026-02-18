import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import WebDashboard from './scfc-web/dashboard/WebDashboard';
import MobileLayout from './scfc-mobile/layout/MobileLayout';

export default function SCFCEntry() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return <WebDashboard />;
  }

  return <MobileLayout />;
}
