import React from 'react';
import { ReferralRequestForm } from './forms/ReferralRequestForm';

export function ReferralForm1(props: { onBack: () => void }) {
  return <ReferralRequestForm onClose={props.onBack} />;
}
