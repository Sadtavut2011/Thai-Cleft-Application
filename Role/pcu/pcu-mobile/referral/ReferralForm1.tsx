import React from 'react';
import { ReferralRequestForm } from './forms/ReferralRequestForm';

export function ReferralForm1(props: { onBack: () => void; onSubmit?: (data: any) => void }) {
  return <ReferralRequestForm onClose={props.onBack} onSubmit={props.onSubmit} role="PCU" />;
}
