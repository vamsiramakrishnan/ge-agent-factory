import { describe, expect, test } from "bun:test";
import { shortAgentName } from "./naming.mjs";

const MAX = 26;
const VALID = /^[a-z_][a-z0-9_]*$/; // snake_case, agents-cli-normalizable, valid Python id

describe("shortAgentName", () => {
  test("short inputs pass through as snake_case (no hash suffix)", () => {
    expect(shortAgentName("generated_agent")).toBe("generated_agent");
    expect(shortAgentName("account-reconciliation")).toBe("account_reconciliation");
    expect(shortAgentName("a")).toBe("a");
  });

  test("over-long inputs are shortened to <=26 chars", () => {
    // The two names from the live deploy_runtime failure.
    const itemId = "factory-finance-account-reconciliation-agent-3"; // 46 chars
    const agentId = "account_reconciliation_agent"; // 28 chars
    for (const id of [itemId, agentId]) {
      const out = shortAgentName(id);
      expect(out.length).toBeLessThanOrEqual(MAX);
    }
  });

  test("output is always a valid (lowercase snake_case) identifier", () => {
    const ids = [
      "factory-finance-account-reconciliation-agent-3",
      "account_reconciliation_agent",
      "Weird Mixed CASE name!!!",
      "123-leading-digits",
      "x".repeat(200),
      "",
    ];
    for (const id of ids) {
      const out = shortAgentName(id);
      expect(out.length).toBeLessThanOrEqual(MAX);
      expect(out.length).toBeGreaterThan(0);
      expect(VALID.test(out)).toBe(true);
    }
  });

  test("deterministic: same input -> same output", () => {
    const id = "factory-finance-account-reconciliation-agent-3";
    expect(shortAgentName(id)).toBe(shortAgentName(id));
  });

  test("unique: distinct ids -> distinct names, even when they share a long prefix", () => {
    const a = shortAgentName("factory-finance-account-reconciliation-agent-3");
    const b = shortAgentName("factory-finance-account-reconciliation-agent-4");
    expect(a).not.toBe(b);
    // Both still within the bound and valid.
    expect(a.length).toBeLessThanOrEqual(MAX);
    expect(b.length).toBeLessThanOrEqual(MAX);
  });

  test("no double underscores or trailing underscore before the hash suffix", () => {
    // A base that would truncate right on an underscore boundary.
    const out = shortAgentName("aaaaaaaaaaaaaaaaaaa_bbbbbbbbbb"); // 30 chars
    expect(out).not.toMatch(/__/);
    expect(out).not.toMatch(/_-/);
    expect(out.length).toBeLessThanOrEqual(MAX);
    // Suffix is _<6 hex>.
    expect(out).toMatch(/_[0-9a-f]{6}$/);
  });

  test("respects a custom maxLen", () => {
    const out = shortAgentName("factory-finance-account-reconciliation-agent-3", { maxLen: 16 });
    expect(out.length).toBeLessThanOrEqual(16);
    expect(VALID.test(out)).toBe(true);
  });

  test("empty / nullish falls back to a valid name", () => {
    expect(VALID.test(shortAgentName(""))).toBe(true);
    expect(VALID.test(shortAgentName(null))).toBe(true);
    expect(VALID.test(shortAgentName(undefined))).toBe(true);
  });
});
