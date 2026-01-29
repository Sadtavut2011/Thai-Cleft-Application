import React, { createContext, useContext } from 'react';

const defaultStats = {
  funds: { pending: 8 },
  appointments: { 
    total: 1250,
    pending: 12, 
    noShow: 15,
    teleRatio: "35:65"
  },
  teleConsult: { 
    active: 32,
    avgWait: "15m",
    stability: 98,
    specialists: 12
  }
};

const SystemContext = createContext({ stats: defaultStats });

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SystemContext.Provider value={{ stats: defaultStats }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => useContext(SystemContext);
