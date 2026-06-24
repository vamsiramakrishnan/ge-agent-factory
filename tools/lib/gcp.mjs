// Shared helpers for the factory CLIs (ge.mjs and the legacy bulk-* scripts).
//
// Keeping these in one place avoids the copy-paste drift we had when each
// script carried its own identical getIdToken/pool.

import { execFileSync } from "node:child_process";

let cachedToken = null;
let tokenExpiry = 0;

// Validate before the value flows into a URL or a subprocess arg. Even though the
// gcloud call below uses execFile (no shell), a malformed audience is a bug we
// want to surface loudly, and this bans the shell-metacharacter class outright.
export function assertValidAudience(audience) {
  const value = String(audience || "").trim();
  if (!value || /\s/.test(value) || /[;&|`$(){}<>\\'"]/.test(value)) {
    throw new Error(`invalid audience: ${JSON.stringify(audience)}`);
  }
  return value;
}

/**
 * Mint a Google OIDC identity token for `audience`, in priority order:
 *   1. GATEWAY_ID_TOKEN env (a token you minted yourself — most reliable when
 *      SA impersonation is restricted),
 *   2. the GCE/Cloud Shell metadata server,
 *   3. `gcloud auth print-identity-token`.
 * Returns null if none succeed (caller sends no Authorization header — correct
 * when going through `gcloud run services proxy`).
 */
export async function idTokenFor(audience) {
  if (process.env.GATEWAY_ID_TOKEN) return process.env.GATEWAY_ID_TOKEN.trim();

  const aud = assertValidAudience(audience);

  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const cache = (token) => {
    cachedToken = token;
    tokenExpiry = Date.now() + 45 * 60 * 1000;
    return token;
  };

  try {
    const res = await fetch(
      `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${encodeURIComponent(aud)}`,
      { headers: { "Metadata-Flavor": "Google" }, signal: AbortSignal.timeout(2000) },
    );
    if (res.ok) {
      const token = (await res.text()).trim();
      if (token) return cache(token);
    }
  } catch {
    /* fall through to gcloud */
  }

  try {
    // execFile (no shell) — the audience is passed as a discrete argv entry, so it
    // can never be interpreted as a shell command even if validation were bypassed.
    const token = execFileSync("gcloud", ["auth", "print-identity-token", `--audiences=${aud}`], {
      stdio: ["pipe", "pipe", "ignore"],
    }).toString().trim();
    if (token) return cache(token);
  } catch {
    /* no metadata server and no gcloud / CAA-blocked */
  }

  return null;
}

/**
 * Continuous promise pool (p-limit style): runs `fn` over `items` with at most
 * `concurrency` in flight. Resolves to all results in input order.
 */
export async function pool(items, concurrency, fn) {
  const results = [];
  const executing = new Set();
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= concurrency) await Promise.race(executing);
  }
  return Promise.all(results);
}
