// Guard for the local control plane (web-server / daemon proxy). The control
// plane can start runs and trigger GCP-mutating deploys, so "bound to loopback"
// is not by itself sufficient — a malicious web page can still reach it via
// DNS rebinding (resolving its own domain to 127.0.0.1 and letting the browser
// send privileged requests).
//
// Policy:
//   - GE_CONTROL_TOKEN set  → require it (Authorization: Bearer <t> or x-ge-token).
//     This works for any deployment, including one fronted by nginx on a real host.
//   - no token (default dev) → require a loopback Host header (DNS-rebinding defense).
function bearer(authorization) {
  const m = /^Bearer\s+(.+)$/i.exec(String(authorization || ""));
  return m ? m[1].trim() : null;
}

function isLoopbackHost(host) {
  const hostname = String(host || "").replace(/:\d+$/, "").replace(/^\[|\]$/g, "");
  return hostname === "" || hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function controlAuthVerdict(headers = {}, { token = process.env.GE_CONTROL_TOKEN } = {}) {
  if (token) {
    const provided = bearer(headers.authorization) || headers["x-ge-token"];
    if (provided !== token) return { ok: false, status: 401, message: "missing or invalid control token" };
    return { ok: true };
  }
  if (!isLoopbackHost(headers.host)) {
    return { ok: false, status: 403, message: "control plane is loopback-only; set GE_CONTROL_TOKEN to allow remote access" };
  }
  return { ok: true };
}
