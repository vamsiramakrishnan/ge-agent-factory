import { useMemo } from "react";
import { useGeQuery } from "../lib/query";
import { ge, type FleetAgent } from "../services/geClient";

// Active-agent slice of the fleet for the Runs view. Data comes from the
// shared query layer — the same ["fleet"] key Overview/Fleet observe, so this
// hook never issues a duplicate fleet request; it only reshapes the cache.
export function useActivity(intervalMs = 8000) {
  const query = useGeQuery(["fleet"], () => ge.fleet(), { intervalMs });

  const agents: FleetAgent[] = useMemo(() => {
    const all = query.data?.agents ?? [];
    // Active agents only, most "interesting" first: failed, then submitted.
    return all
      .filter((a) => a.status !== "none")
      .sort((a, b) => {
        const scoreA = a.status === "failed" ? 3 : a.status === "submitted" ? 2 : 1;
        const scoreB = b.status === "failed" ? 3 : b.status === "submitted" ? 2 : 1;
        return scoreB - scoreA;
      });
  }, [query.data]);

  return {
    agents,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message || "Failed to fetch activity" : null,
    refresh: () => { void query.refetch(); },
  };
}
