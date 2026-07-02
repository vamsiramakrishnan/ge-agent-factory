// The console's one data-fetching layer (TanStack Query).
//
// Before this existed, every view hand-rolled the same stack: useState for
// data/error/loading + useEffect + setInterval + a "ge:job:done" listener +
// a manual refresh handler — ten near-identical copies with subtly different
// bugs (stale closures, missing cleanup, double fetches). Query gives the
// same behavior with caching, request dedupe, and focus refetch for free;
// this module pins the conventions so views stay one-liners:
//
//   const fleet = useGeQuery(["fleet"], () => ge.fleet(), { intervalMs: 5300 });
//
// Conventions:
// - Poll intervals stay the views' calm off-:00 cadences (they were chosen
//   deliberately; see the original Overview comment).
// - A completed followed job invalidates EVERYTHING once, globally — the
//   same semantics as the old per-view "ge:job:done" listeners, minus nine
//   duplicate registrations.
// - Errors surface as `query.error` for the existing <ErrorBanner> pattern;
//   `query.refetch` backs the existing Refresh buttons.
import { QueryClient, useQuery, type QueryKey } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Polling views own their freshness via refetchInterval; a short
      // staleTime keeps route flips from refetching what a poller just got.
      staleTime: 2_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

// One global listener replaces the per-view copies: when a followed job
// completes (JobToast broadcasts ge:job:done), every live query refetches so
// plane/fleet/run state never lingers stale after an action.
if (typeof window !== "undefined") {
  window.addEventListener("ge:job:done", () => {
    void queryClient.invalidateQueries();
  });
}

export interface GeQueryOptions<T> {
  /**
   * Poll cadence in ms (the calm off-:00 values the views already used), or a
   * function of the latest data for conditional cadences (e.g. fast-poll a
   * run detail only while it's live).
   */
  intervalMs?: number | ((data: T | undefined) => number | false);
  enabled?: boolean;
}

export function useGeQuery<T>(key: QueryKey, fn: () => Promise<T>, { intervalMs, enabled }: GeQueryOptions<T> = {}) {
  return useQuery({
    queryKey: key,
    queryFn: fn,
    refetchInterval: typeof intervalMs === "function" ? (query) => intervalMs(query.state.data as T | undefined) : intervalMs,
    enabled,
  });
}
