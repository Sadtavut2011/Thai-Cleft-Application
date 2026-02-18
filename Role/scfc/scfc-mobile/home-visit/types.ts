export interface VisitRequest {
  id: string;
  patientName?: string;
  name?: string; // used in Detail
  patientId: string;
  hn?: string; // used in Detail
  patientAddress?: string;
  type: 'Joint' | 'Delegated';
  rph: string;
  requestDate: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'NotHome' | 'NotAllowed' | 'Rejected';
  note?: string;
  urgency?: string;
  contact?: {
      address?: string;
      phone?: string;
  };
}

export interface VisitForm {
  // Add properties if needed based on HomeVisitForm usage
  // Currently HomeVisitForm uses internal state and onSave(data: any)
  [key: string]: any;
}

export interface MapPinData {
  id: string;
  lat: number;
  lng: number;
  patientName: string;
  status: string;
  address: string;
}
