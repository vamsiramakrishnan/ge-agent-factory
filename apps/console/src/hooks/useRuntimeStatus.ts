import { useState, useEffect, useCallback, useRef } from "react";
import { ge, type RuntimeStatus } from "../services/geClient";

const DEFAULT_RESTART = "ge daemon stop && ge daemon start";

// Polls the local runtime daemon health via /api/runtime/status. The server
// already degrades gracefully (returns { ok: false, status: "stopped", ... })
// when the daemon is unreachable, so a thrown error here means the console API
// itself is down — surfaced the same way (not ok).
export function useRuntimeStatus(intervalMs = 10000) {
  const [status, setStatus] = useState<RuntimeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStatus(await ge.runtimeStatus());
    } catch (err: any) {
      setStatus({
        ok: false,
        status: "unavailable",
        error: err?.message || "Runtime unavailable",
        supportedTaskKinds: [],
        capabilities: {},
        restartCommand: DEFAULT_RESTART,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs, refresh]);

  return { status, loading, refresh };
}
