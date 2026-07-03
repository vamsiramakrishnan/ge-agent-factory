import { test, expect } from "bun:test";
import { normalizeStatus, statusStyle } from "./runStatus";

// The exhaustive normalizeStatus assertions now live in the shared package
// (packages/run-ledger/src/index.test.mjs). This smoke test only verifies the
// console re-exports the shared normalization; statusStyle (the Tailwind palette,
// console-only) is covered fully below.
test("normalizeStatus is re-exported from @ge/run-ledger and wired", () => {
  expect(normalizeStatus("queued")).toBe("pending");
  expect(normalizeStatus("in-progress")).toBe("running");
  expect(normalizeStatus("cancelled")).toBe("failed");
  expect(normalizeStatus("")).toBe("pending");
});

test("statusStyle exposes one source of truth per status", () => {
  expect(statusStyle("done").dotClass).toContain("status-passed");
  expect(statusStyle("failed").dotClass).toContain("status-failed");
  expect(statusStyle("blocked").dotClass).toContain("status-blocked");
  expect(statusStyle("running").dotClass).toContain("status-running");
  expect(statusStyle("pending").dotClass).toContain("status-queued");
  expect(statusStyle("running").icon).toBe("◐");
});
