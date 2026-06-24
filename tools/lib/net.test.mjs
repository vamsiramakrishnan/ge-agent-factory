import { test, expect } from "bun:test";
import { createServer } from "node:net";
import { findOpenPort } from "./net.mjs";

// Some sandboxes forbid binding 127.0.0.1 (EPERM/EACCES). findOpenPort is a pure
// TCP-bind helper, so skip (don't fail) where the environment can't bind at all.
const canBind = await new Promise((resolve) => {
  const s = createServer();
  s.once("error", () => resolve(false));
  s.listen(0, "127.0.0.1", () => s.close(() => resolve(true)));
});
const maybe = canBind ? test : test.skip;
if (!canBind) console.warn("net.test: skipping — local TCP bind forbidden in this environment");

maybe("findOpenPort returns a usable port number", async () => {
  const port = await findOpenPort();
  expect(Number.isInteger(port)).toBe(true);
  expect(port).toBeGreaterThan(0);
  await new Promise((resolve, reject) => {
    const s = createServer();
    s.once("error", reject);
    s.listen(port, "127.0.0.1", () => s.close(resolve));
  });
});

maybe("two calls do not collide on the same fixed port", async () => {
  const first = await findOpenPort();
  const held = await new Promise((resolve) => {
    const s = createServer();
    s.listen(first, "127.0.0.1", () => resolve(s));
  });
  try {
    const second = await findOpenPort();
    expect(second).not.toBe(first);
  } finally {
    held.close();
  }
});
