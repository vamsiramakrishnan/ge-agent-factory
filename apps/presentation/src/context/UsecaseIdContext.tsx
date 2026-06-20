import { createContext, useContext, ReactNode } from "react";

export const UsecaseIdContext = createContext<string | null>(null);

export function useUsecaseId(): string | null {
  return useContext(UsecaseIdContext);
}

export function UsecaseIdProvider({ value, children }: { value: string | null; children: ReactNode }) {
  return <UsecaseIdContext.Provider value={value}>{children}</UsecaseIdContext.Provider>;
}
