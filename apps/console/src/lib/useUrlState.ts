import { useCallback, useEffect, useState } from "react";

// View filters live in the hash query (e.g. "#/fleet?dept=hr&status=blocked") so a
// filtered view is shareable and survives reload — operators coordinate by URL
// ("look at the blocked HR agents") instead of "click Fleet then set 3 dropdowns".

function currentParams(): URLSearchParams {
  const i = location.hash.indexOf("?");
  return new URLSearchParams(i >= 0 ? location.hash.slice(i + 1) : "");
}

export function setHashQuery(updates: Record<string, string | null>) {
  const hash = location.hash || "#/";
  const qIdx = hash.indexOf("?");
  const base = qIdx >= 0 ? hash.slice(0, qIdx) : hash;
  const params = new URLSearchParams(qIdx >= 0 ? hash.slice(qIdx + 1) : "");
  for (const [k, v] of Object.entries(updates)) {
    if (v == null || v === "") params.delete(k);
    else params.set(k, v);
  }
  const qs = params.toString();
  const next = qs ? `${base}?${qs}` : base;
  if (next === hash) return;
  // replaceState (not assigning location.hash) so typing in a filter doesn't spam
  // browser history; dispatch hashchange ourselves since replaceState doesn't.
  history.replaceState(null, "", next);
  window.dispatchEvent(new Event("hashchange"));
}

/** useState-like binding to a single hash query param. */
export function useUrlParam(key: string, fallback = ""): [string, (v: string) => void] {
  const [value, setValue] = useState(() => currentParams().get(key) ?? fallback);

  useEffect(() => {
    const handler = () => setValue(currentParams().get(key) ?? fallback);
    window.addEventListener("hashchange", handler);
    handler(); // resync if the hash changed before this effect ran
    return () => window.removeEventListener("hashchange", handler);
  }, [key, fallback]);

  const set = useCallback((v: string) => setHashQuery({ [key]: v && v !== fallback ? v : null }), [key, fallback]);
  return [value, set];
}
