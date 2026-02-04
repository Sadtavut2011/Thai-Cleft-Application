import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SystemContextType {
  isOffline: boolean;
  setIsOffline: (status: boolean) => void;
  isLoading: boolean;
  setIsLoading: (status: boolean) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SystemContext.Provider value={{ isOffline, setIsOffline, isLoading, setIsLoading }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}
