// Daemon base URL shared by the daemon-backed transports (jobs, repair,
// doctor). Verbatim move from transport.mjs; the port is read per call so tests
// and operators can repoint GE_DAEMON_PORT at runtime.
//
// daemonClient() is the thin binding onto the shared HTTP client
// (tools/lib/daemon/client.mjs, reached through factory-core.mjs — see
// tools/check-app-import-surface.mjs, this file has no allowlisted pair
// straight onto tools/lib/daemon/client.mjs). It re-resolves daemonBaseUrl()
// on every call (never memoized) for the same reason daemonBaseUrl() itself
// does: tests and operators repoint GE_DAEMON_PORT at runtime and expect the
// next call to honor it.
import { createDaemonClient } from "../../../../../tools/lib/factory-core.mjs";

export function daemonBaseUrl() {
  return `http://127.0.0.1:${Number(process.env.GE_DAEMON_PORT || 17654)}`;
}

export function daemonClient({ timeoutMs } = {}) {
  return createDaemonClient({ baseUrl: daemonBaseUrl(), timeoutMs });
}
