import { createServer } from "node:net";

// Find an open TCP port by binding port 0 (the OS assigns a free one), reading the
// assigned port, then releasing it. Replaces the fixed proxy port that made two
// concurrent `ge` invocations collide.
export function findOpenPort(host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, host, () => {
      const { port } = server.address();
      server.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}
