export interface VisitRequest {
  id: string;
  patientName: string;
  patientId: string; // HN
  patientAddress: string;
  type: 'Joint' | 'Delegated';
  rph: string; // Responsible Health Center (PCU)
  requestDate: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'NotHome' | 'NotAllowed' | 'Cancelled';
  note?: string;
  
  // Optional fields for Detail View compatibility if aliases are used
  name?: string; 
  hn?: string;
  contact?: {
      address?: string;
      phone?: string;
  };
}

export interface VisitForm {
  patientName: string;
  patientId: string;
  patientAddress: string;
  type: 'Joint' | 'Delegated';
  rph: string;
  note?: string;
}

export interface MapPinData {
  id: string;
  lat: number;
  lng: number;
  patientName: string;
  status: string;
  address: string;
}
