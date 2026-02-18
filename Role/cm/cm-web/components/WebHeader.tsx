import React from 'react';
import { WebHeader as ScfcWebHeader } from '../../../scfc/scfc-web/components/WebHeader';

export function WebHeader(props: { onNavigate?: (page: string) => void }) {
  return <ScfcWebHeader {...props} />;
}
