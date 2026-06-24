import React, { createContext, useContext, useState } from "react";
import { DEPARTMENTS, getDepartment, DepartmentConfig } from "../departments";

interface DepartmentContextType {
  department: string;
  setDepartment: (key: string) => void;
  config: DepartmentConfig;
  allDepartments: DepartmentConfig[];
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const DepartmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [department, setDepartment] = useState(DEPARTMENTS[0].key);
  const config = getDepartment(department);

  return (
    <DepartmentContext.Provider value={{ department, setDepartment, config, allDepartments: DEPARTMENTS }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) throw new Error("useDepartment must be used within DepartmentProvider");
  return context;
};

// Re-export for convenience
export type { DepartmentConfig };
