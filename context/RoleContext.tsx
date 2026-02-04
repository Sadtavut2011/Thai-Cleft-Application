import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'CM' | 'Hospital' | 'SCFC' | 'PCU' | 'Patient' | 'Admin';

interface RoleContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  isRole: (role: Role) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('CM');

  const isRole = (role: Role) => currentRole === role;

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole, isRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
