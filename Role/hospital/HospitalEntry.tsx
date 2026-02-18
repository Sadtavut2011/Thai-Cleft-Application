import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import HospitalWebDashboard from './dashboard/HospitalDashboard';
import HospitalMobileLayout from './hospital-mobile/layout/MobileLayout';

export default function HospitalEntry() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (isDesktop) {
    return <HospitalWebDashboard />;
  }

  return <HospitalMobileLayout />;
}
