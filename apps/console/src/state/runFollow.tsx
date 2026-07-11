import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

// Metadata a trigger can attach so the drawer header reads well before any event
// arrives (e.g. kind/source of the run).
export interface RunFollowMeta {
  kind?: string;
  source?: string;
  ledgerSource?: "local" | "firestore";
  mode?: "local" | "remote";
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

// The followed run survives a tab close/reload the same way in-flight jobs do
// (JobToast's ge:active-jobs): persist the follow target and re-attach on boot.
// Cleared when the operator closes the drawer or the run completes, so a stale
// finished run doesn't reopen on every load.
const STORAGE_KEY = "ge.runFollow.active";

function readPersistedFollow(): { runId: string; meta: RunFollowMeta | null } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.runId !== "string" || !parsed.runId) return null;
    return { runId: parsed.runId, meta: parsed.meta ?? null };
  } catch {
    // Unavailable/corrupt storage just means no restore — never block boot.
    return null;
  }
}

function persistFollow(runId: string, meta: RunFollowMeta | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ runId, meta }));
  } catch {
    // Storage full/unavailable: live-follow still works for this session.
  }
}

function clearPersistedFollow() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}

export function RunFollowProvider({ children }: { children: ReactNode }) {
  // Restore the followed run from the previous session (if any) so closing the
  // tab mid-run doesn't lose the live view — the drawer re-attaches and the
  // ledger stream replays events. If the run finished meanwhile, the terminal
  // frame auto-collapses the drawer and clears the persisted target.
  const [initial] = useState(readPersistedFollow);
  const [runId, setRunId] = useState<string | null>(initial?.runId ?? null);
  const [meta, setMeta] = useState<RunFollowMeta | null>(initial?.meta ?? null);
  const [open, setOpen] = useState(!!initial);
  const [pinned, setPinned] = useState(false);

  const followRun = useCallback((id: string, m?: RunFollowMeta) => {
    if (!id) return;
    setRunId(id);
    setMeta(m || null);
    setPinned(false);
    setOpen(true);
    persistFollow(id, m || null);
  }, []);

  const unfollow = useCallback(() => {
    setOpen(false);
    setPinned(false);
    clearPersistedFollow();
  }, []);

  const pin = useCallback(() => setPinned(true), []);
  const unpin = useCallback(() => setPinned(false), []);

  const onComplete = useCallback(() => {
    clearPersistedFollow();
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
