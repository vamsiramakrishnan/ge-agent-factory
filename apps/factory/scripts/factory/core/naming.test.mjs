import { describe, expect, test } from "bun:test";
import {
  shortAgentName,
  snakeCase,
  canonicalSystemId,
  safePyName,
  validPythonIdentifierName,
  titleCase,
} from "./naming.mjs";

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

// Golden corpus — pins the exact identifier strings the whole repo derives from
// human-facing names. snakeCase here is the single source of truth shared by
// spec-code-trace, plan-mock-data and scaffold-simulator-pack, so any drift in
// the casing library (or an accidental re-divergence of a copy) is caught here
// before it can rename a generated tool, fixture path or cloud resource.
describe("naming golden corpus", () => {
  test("snakeCase collapses acronyms and word boundaries", () => {
    expect(snakeCase("")).toBe("");
    expect(snakeCase("order_items")).toBe("order_items");
    expect(snakeCase("fooBar")).toBe("foo_bar");
    expect(snakeCase("account-reconciliation")).toBe("account_reconciliation");
    expect(snakeCase("Salesforce CRM")).toBe("salesforce_crm");
    expect(snakeCase("ServiceNow ITSM")).toBe("service_now_itsm");
    expect(snakeCase("POReconciliation")).toBe("po_reconciliation");
    expect(snakeCase("HTTP API v2")).toBe("http_api_v2");
    expect(snakeCase("GeminiEnterprise")).toBe("gemini_enterprise");
    expect(snakeCase("123-leading-digits")).toBe("123_leading_digits");
    expect(snakeCase("Weird Mixed CASE name!!!")).toBe("weird_mixed_case_name");
  });

  test("canonicalSystemId falls back to source_system on empty", () => {
    expect(canonicalSystemId("")).toBe("source_system");
    expect(canonicalSystemId("Salesforce CRM")).toBe("salesforce_crm");
    expect(canonicalSystemId("Workday HCM")).toBe("workday_hcm");
  });

  test("safePyName / validPythonIdentifierName guard leading non-identifier chars", () => {
    expect(safePyName("")).toBe("value");
    expect(safePyName("123-leading-digits")).toBe("_123_leading_digits");
    expect(safePyName("Salesforce CRM")).toBe("salesforce_crm");
    expect(validPythonIdentifierName("")).toBe("agent");
    expect(validPythonIdentifierName("123-leading-digits")).toBe("agent_123_leading_digits");
  });

  test("titleCase preserves acronyms (display-only, intentionally not change-case)", () => {
    expect(titleCase("account-reconciliation")).toBe("Account Reconciliation");
    expect(titleCase("Salesforce CRM")).toBe("Salesforce CRM");
    expect(titleCase("Workday HCM")).toBe("Workday HCM");
  });
});
