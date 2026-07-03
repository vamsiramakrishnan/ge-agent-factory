import { test, expect } from "bun:test";
import { resolveFix } from "./doctorFix";

test("resolveFix maps the dotted command vocabulary to ge.* actions", () => {
  expect(resolveFix("data up")?.label).toBe("ge data up");
  expect(resolveFix("mcp deploy")?.label).toBe("ge mcp deploy");
  expect(resolveFix("handoff")?.label).toBe("ge handoff");
  expect(resolveFix("agents sync")?.label).toBe("ge agents sync");
  expect(resolveFix("up")?.label).toBe("ge up");
});

test("resolveFix tolerates a leading 'ge ' and surrounding whitespace", () => {
  expect(resolveFix("  ge handoff  ")?.label).toBe("ge handoff");
  expect(resolveFix("ge handoff agents-cli --ids ws-1")?.label).toBe("ge handoff");
});

test("resolveFix detects --local across the flag, dotted, and spaced vocabularies", () => {
  // Doctor's command targets use the dotted form `agents.build.local`.
  expect(resolveFix("agents.build.local")?.label).toBe("ge agents build --local");
  expect(resolveFix("ge agents build --local")?.label).toBe("ge agents build --local");
  expect(resolveFix("agents build local")?.label).toBe("ge agents build --local");
  // Dotted build target matches the same handler as the spaced form.
  expect(resolveFix("agents.build")?.label).toBe("ge agents build");
});

test("resolveFix returns null for anything it cannot safely run", () => {
  expect(resolveFix("")).toBeNull();
  expect(resolveFix("rm -rf /")).toBeNull();
  // @ts-expect-error — defends against non-string input
  expect(resolveFix(undefined)).toBeNull();
});
