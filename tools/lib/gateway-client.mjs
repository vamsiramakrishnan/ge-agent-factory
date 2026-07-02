// Gateway transport + a small bounded-retry JSON fetch layer, used by both the
// remote-submission ops that stay in factory-core.mjs (status) and the ones that
// moved to provision.mjs (provision, ship). Split out as its own leaf module
// (rather than one importing the other) so neither side of that split needs to
// reach into the other's file for this shared, self-contained piece.
import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import pRetry, { AbortError } from "p-retry";
import { findOpenPort } from "./net.mjs";

const noop = () => {};

// ── auto-managed Cloud Run proxy ──────────────────────────────────────────────
function waitForPort(port, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((res, rej) => {
    const tick = () => {
      const sock = createConnection({ host: "127.0.0.1", port }, () => { sock.destroy(); res(); });
      sock.on("error", () => { sock.destroy(); Date.now() - start > timeoutMs ? rej(new Error("proxy did not start in time")) : setTimeout(tick, 400); });
    };
    tick();
  });
}

// Network-level error codes that indicate a transient condition (connection
// reset/refused, DNS hiccup, timeout at the socket layer) rather than a
// structural problem with the request itself. These are safe to retry as-is.
const TRANSIENT_ERROR_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EPIPE",
  "EAI_AGAIN",
  "ENOTFOUND",
  "ENETUNREACH",
  "EHOSTUNREACH",
]);

// HTTP statuses worth retrying: 429 (rate limited) and 5xx (server-side —
// may well succeed on the next attempt). Everything else — 4xx client
// errors like 400/401/403/404 — is a structural problem with the request
// that a retry cannot fix, so it must fail fast.
function isRetryableStatus(status) {
  return status === 429 || (status >= 500 && status <= 599);
}

// Pure classifier: given an error thrown while attempting a fetch, decide if
// retrying has any chance of succeeding. Not exported from this module (its
// public surface is snapshot-locked by factory-core.export-surface.test.mjs)
// — the equivalent classifier in apps/factory/scripts/download-openapi-specs.mjs
// is exported and unit-tested there; this copy is kept in sync with it.
//   - AbortSignal.timeout(...) firing surfaces as a DOMException/Error named
//     "TimeoutError" (or, in some runtimes, "AbortError") — that's OUR OWN
//     timeout expiring, i.e. the request was too slow, which is transient.
//   - Node-level connection errors (ECONNRESET, ETIMEDOUT, ...) are transient.
//   - A malformed URL raises a TypeError ("Invalid URL") before any network
//     activity happens — retrying can never fix that, so it is NOT retryable.
//   - Anything else (programmer errors, JSON parse issues, etc.) is treated
//     as not retryable — fail fast rather than mask an unexpected bug behind
//     retries.
function isRetryableFetchError(error) {
  if (!error) return false;
  if (error.code && TRANSIENT_ERROR_CODES.has(error.code)) return true;
  if (error.name === "TimeoutError" || error.name === "AbortError") {
    // Our own AbortSignal.timeout(...) firing is transient. A malformed URL
    // is thrown synchronously as a TypeError, never as an Abort/TimeoutError,
    // so this branch never masks that case.
    return true;
  }
  return false;
}

// Wraps a single fetch attempt with a short, bounded retry policy: at most
// 3 total attempts (1 initial + 2 retries), short exponential backoff, so
// the worst case added latency stays roughly within 3x the caller's own
// per-attempt timeout — this is a CLI, not a background job queue.
//
// On success — including a non-retryable 4xx, which resolves normally, same
// as before this change — the real Response is returned unchanged. Only a
// retryable HTTP status (429/5xx) that is STILL failing after all attempts
// falls through to returning the last real Response too (never a synthetic
// error), so callers that inspect `res.ok`/`res.status` see identical shapes
// pre- and post-retry; only genuine network-level errors throw, exactly as
// a bare `fetch()` did before.
async function fetchJsonWithRetry(url, path, init) {
  let lastRetryableResponse = null;
  try {
    return await pRetry(
      async () => {
        let res;
        try {
          res = await fetch(`${url}${path}`, init);
        } catch (error) {
          if (isRetryableFetchError(error)) throw error; // let p-retry retry
          throw new AbortError(error); // malformed URL, etc. — fail fast
        }
        if (isRetryableStatus(res.status)) {
          lastRetryableResponse = res;
          throw new Error(`retryable HTTP ${res.status}`); // triggers a retry
        }
        return res; // success or non-retryable 4xx — returned as-is
      },
      { retries: 2, minTimeout: 250, maxTimeout: 2000, factor: 2 },
    );
  } catch (error) {
    if (lastRetryableResponse) return lastRetryableResponse; // exhausted retries on 429/5xx — same shape as before, not a throw
    if (error instanceof AbortError) throw error.originalError || error;
    throw error;
  }
}

export async function postJson(url, path, body, headers = {}) {
  const res = await fetchJsonWithRetry(url, path, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(60000) });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { /* best-effort: non-JSON body; caller falls back to .text */ }
  return { status: res.status, ok: res.ok, json, text };
}
export async function getJson(url, path, headers = {}) {
  const res = await fetchJsonWithRetry(url, path, { headers, signal: AbortSignal.timeout(30000) });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { /* best-effort: non-JSON body; caller falls back to .text */ }
  return { status: res.status, ok: res.ok, json, text };
}

// Mint an ID token for direct (proxy-less) gateway calls. Requires run.invoker on
// the gateway for the active identity. Best-effort: returns {} on failure so the
// caller can surface a clear auth error from the gateway response.
function gatewayAuthHeader(run, cfg, { log = noop } = {}) {
  const args = ["auth", "print-identity-token"];
  if (cfg.gatewayUrl) args.push(`--audiences=${cfg.gatewayUrl}`);
  const r = run("gcloud", args, { allowFail: true });
  if (r.ok && r.out) return { Authorization: `Bearer ${r.out.trim()}` };
  log("warning: could not mint a gateway identity token (gcloud auth print-identity-token failed)");
  return {};
}

// Factory function: `run` is the same command-exec helper factory-core.mjs
// composes over runCommand — injected so this module doesn't need to import
// factory-core.mjs (which would cycle, since factory-core re-exports/uses this
// module's withGateway).
export function createGatewayClient({ run } = {}) {
  if (!run) throw new Error("createGatewayClient requires run");

  async function withGateway(cfg, fn, { noProxy = false, port = null, log = noop } = {}) {
    // Direct transport (ADR 0001 phase 3): call the gateway over HTTPS with a minted
    // ID token — no `gcloud run services proxy` child process. The legacy `noProxy`
    // flag still hits gatewayUrl but without auth (unchanged); gatewayTransport=direct
    // is the authenticated, tunnel-free path.
    const direct = cfg.gatewayTransport === "direct";
    if (noProxy || direct) {
      if (!cfg.gatewayUrl) throw new Error("No gateway URL. Run `ge init` or pass --gatewayUrl.");
      const headers = direct ? gatewayAuthHeader(run, cfg, { log }) : {};
      if (direct) log(`direct gateway ${cfg.gatewayUrl} (no proxy)`);
      return fn(cfg.gatewayUrl, { headers });
    }
    // Dynamic port by default so concurrent `ge` invocations don't collide.
    if (!port) port = await findOpenPort();
    log(`starting authenticated proxy to ${cfg.gatewayService} on :${port} …`);
    const child = spawn("gcloud", ["run", "services", "proxy", cfg.gatewayService, "--project", cfg.project, "--region", cfg.region, "--port", String(port)], { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr?.on("data", (d) => { stderr += d; });
    const cleanup = () => { try { child.kill("SIGTERM"); } catch { /* best-effort: proxy child may already be dead */ } };
    process.on("exit", cleanup);
    try {
      await waitForPort(port);
      log("proxy ready");
      return await fn(`http://localhost:${port}`, { headers: {} });
    } catch (err) {
      throw new Error(`proxy failed: ${err.message}\n${stderr.split("\n").slice(0, 4).join("\n")}`);
    } finally { cleanup(); }
  }

  return { withGateway };
}
