import { createServer } from "node:net";

// Test environments used by coding agents can forbid loopback listeners while
// still allowing outbound HTTP. Keep wire tests enabled everywhere a real
// listener is possible and skip only that capability in restricted sandboxes.
export function canBindLoopback(host = "127.0.0.1") {
  return new Promise((resolve) => {
    const server = createServer();
    let settled = false;
    const finish = (available) => {
      if (settled) return;
      settled = true;
      resolve(available);
    };
    server.once("error", () => finish(false));
    server.listen(0, host, () => {
      server.close((error) => finish(!error));
    });
  });
}
