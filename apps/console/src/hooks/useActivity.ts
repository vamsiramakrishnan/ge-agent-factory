import { useState, useEffect, useCallback, useRef } from "react";
import { ge, type FleetAgent } from "../services/geClient";

export function useActivity(intervalMs = 8000) {
  const [agents, setAgents] = useState<FleetAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      const fleet = await ge.fleet();

      // Filter to active agents (non-"none" status)
      const active = fleet.agents.filter((a) => a.status !== "none");

      // Sort: failed first, then submitted, then others (most "interesting" first)
      const sorted = active.sort((a, b) => {
        const scoreA = a.status === "failed" ? 3 : a.status === "submitted" ? 2 : 1;
        const scoreB = b.status === "failed" ? 3 : b.status === "submitted" ? 2 : 1;
        return scoreB - scoreA;
      });

      setAgents(sorted);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch activity");
      // Keep existing agents on error (best-effort)
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetchAgents();
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchAgents();

    // Set up polling
    intervalRef.current = setInterval(fetchAgents, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalMs]);

  return { agents, loading, error, refresh };
}
