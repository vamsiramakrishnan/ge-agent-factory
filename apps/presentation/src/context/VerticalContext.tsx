import React, { createContext, useContext, useState } from "react";
import { VERTICALS, getVertical, VerticalConfig } from "../verticals";

interface VerticalContextType {
  vertical: string;
  setVertical: (key: string) => void;
  config: VerticalConfig;
  allVerticals: VerticalConfig[];
}

const VerticalContext = createContext<VerticalContextType | undefined>(undefined);

export const VerticalProvider = ({ children }: { children: React.ReactNode }) => {
  const [vertical, setVertical] = useState(VERTICALS[0].key);
  const config = getVertical(vertical);

  return (
    <VerticalContext.Provider value={{ vertical, setVertical, config, allVerticals: VERTICALS }}>
      {children}
    </VerticalContext.Provider>
  );
};

export const useVertical = () => {
  const context = useContext(VerticalContext);
  if (!context) throw new Error("useVertical must be used within a VerticalProvider");
  return context;
};

// Re-export for convenience
export type { VerticalConfig };
