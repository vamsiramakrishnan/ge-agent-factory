// Daemon base URL shared by the daemon-backed transports (jobs, repair,
// doctor). Verbatim move from transport.mjs; the port is read per call so tests
// and operators can repoint GE_DAEMON_PORT at runtime.

export function daemonBaseUrl() {
  return `http://127.0.0.1:${Number(process.env.GE_DAEMON_PORT || 17654)}`;
}
