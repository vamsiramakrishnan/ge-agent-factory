import { DepartmentConfig } from "./types";
import { hrDepartment } from "./hr";
import { procurementDepartment } from "./procurement";
import { financeDepartment } from "./finance";
import { itDepartment } from "./it";
import { marketingDepartment } from "./marketing";

// ┌─────────────────────────────────────────────────────────┐
// │  DEPARTMENT REGISTRY                                     │
// │                                                          │
// │  To add a new department (e.g., Finance):                │
// │  1. Create src/departments/finance.ts with data          │
// │  2. Import and add to DEPARTMENTS array below            │
// │  3. Add domains to src/constants/domains.ts              │
// │  4. Add agents to src/constants/agents.ts                │
// │  5. Create domain catalogs + use case components         │
// │  6. Add slide entries to src/config/slides.tsx           │
// │                                                          │
// │  Steps 1-2 handle all story content automatically.       │
// │  The DepartmentSwitcher, Periodic Table, Personas,       │
// │  Day-in-Life, Challenge, and RACI slides all read        │
// │  from this registry — zero code changes needed.          │
// └─────────────────────────────────────────────────────────┘

export const DEPARTMENTS: DepartmentConfig[] = [
  hrDepartment,
  procurementDepartment,
  financeDepartment,
  itDepartment,
  marketingDepartment,
  // Add new departments here:
];

export const getDepartment = (key: string): DepartmentConfig => {
  const dept = DEPARTMENTS.find(d => d.key === key);
  if (!dept) throw new Error(`Department "${key}" not found in registry`);
  return dept;
};

export const getDepartmentKeys = (): string[] => DEPARTMENTS.map(d => d.key);

export type { DepartmentConfig } from "./types";
