export interface VisitRequest {
  id: string;
  patientName: string;
  patientId: string; // HN
  patientAddress: string;
  type: 'Joint' | 'Delegated'; // Joint = ลงเยี่ยมร่วม, Delegated = ฝากเยี่ยม
  rph: string; // Responsible Health Center (รพ.สต.)
  requestDate: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
  note?: string;
  
  // Additional fields for detail view compatibility
  hn?: string;
  name?: string;
  date?: string;
  time?: string;
  contact?: {
      phone: string;
      address: string;
      map?: { lat: number, lng: number };
  };
  tags?: string[];
  priority?: 'Normal' | 'Urgent' | 'Emergency';
}

export interface VisitForm {
    patientName: string;
    patientId: string;
    patientAddress: string;
    type: 'Joint' | 'Delegated';
    rph: string;
    date: string;
    time: string;
    contactName: string;
    contactPhone: string;
    note: string;
}

export interface MapPinData {
  id: string;
  lat: number;
  lng: number;
  patientName: string;
  status: string;
  address: string;
}
