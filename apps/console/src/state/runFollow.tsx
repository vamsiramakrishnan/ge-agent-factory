import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

// Metadata a trigger can attach so the drawer header reads well before any event
// arrives (e.g. kind/source of the run).
export interface RunFollowMeta {
  kind?: string;
  source?: string;
}

export interface RunFollowState {
  runId: string | null;
  meta: RunFollowMeta | null;
  open: boolean;
  pinned: boolean;
  followRun: (runId: string, meta?: RunFollowMeta) => void;
  unfollow: () => void;
  pin: () => void;
  unpin: () => void;
  setOpen: (open: boolean) => void;
  // Called by the drawer when the run reaches a terminal frame: auto-collapse
  // unless the operator pinned it open.
  onComplete: () => void;
}

const RunFollowContext = createContext<RunFollowState | null>(null);

export function RunFollowProvider({ children }: { children: ReactNode }) {
  const [runId, setRunId] = useState<string | null>(null);
  const [meta, setMeta] = useState<RunFollowMeta | null>(null);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const followRun = useCallback((id: string, m?: RunFollowMeta) => {
    if (!id) return;
    setRunId(id);
    setMeta(m || null);
    setPinned(false);
    setOpen(true);
  }, []);

  const unfollow = useCallback(() => {
    setOpen(false);
    setPinned(false);
  }, []);

  const pin = useCallback(() => setPinned(true), []);
  const unpin = useCallback(() => setPinned(false), []);

  const onComplete = useCallback(() => {
    setPinned((isPinned) => {
      if (!isPinned) setOpen(false);
      return isPinned;
    });
  }, []);

  const value = useMemo<RunFollowState>(
    () => ({ runId, meta, open, pinned, followRun, unfollow, pin, unpin, setOpen, onComplete }),
    [runId, meta, open, pinned, followRun, unfollow, pin, unpin, onComplete],
  );

  return <RunFollowContext.Provider value={value}>{children}</RunFollowContext.Provider>;
}

export function useRunFollow(): RunFollowState {
  const ctx = useContext(RunFollowContext);
  if (!ctx) throw new Error("useRunFollow must be used within a RunFollowProvider");
  return ctx;
}
