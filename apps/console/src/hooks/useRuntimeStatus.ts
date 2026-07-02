import { useCallback } from "react";
import { ge, type RuntimeStatus } from "../services/geClient";
import { useGeQuery } from "../lib/query";

const DEFAULT_RESTART = "ge daemon stop && ge daemon start";

// Polls the local runtime daemon health via /api/runtime/status. The server
// already degrades gracefully (returns { ok: false, status: "stopped", ... })
// when the daemon is unreachable, so a thrown error here means the console API
// itself is down — surfaced the same way (not ok). The fetcher catches and
// synthesizes that degraded status itself, so the query never enters an error
// state and consumers keep the simple { status, loading, refresh } shape.
export function useRuntimeStatus(intervalMs = 10000) {
  const query = useGeQuery<RuntimeStatus>(
    ["runtimeStatus"],
    async () => {
      try {
        return await ge.runtimeStatus();
      } catch (err: any) {
        return {
          ok: false,
          status: "unavailable",
          error: err?.message || "Runtime unavailable",
          supportedTaskKinds: [],
          capabilities: {},
          restartCommand: DEFAULT_RESTART,
        };
      }
    },
    { intervalMs },
  );

  const { refetch } = query;
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return { status: query.data ?? null, loading: query.isPending, refresh };
}
