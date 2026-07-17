import { describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MAX_RESPONSE_BYTES_HARD_CAP } from "@ge/connector-core";
import {
  DIALABLE_KINDS,
  DIRECTIVE_SCHEMA_VERSION,
  DISPATCH_REASONS,
  LIVE_CONFIRM_ENV,
  buildDispatchDirective,
  resolveAllDispatch,
  resolveDispatch,
  resolveDispatchDecision,
} from "./dispatch.mjs";
import { writeBinding } from "./bindings.mjs";

const rest = (mode, extra = {}) => ({ system: "crm", boundTo: "https://crm.example.com", kind: "rest", mode, ...extra });
const mcp = (mode) => ({ system: "crm", boundTo: "https://mcp.example.com", kind: "mcp", mode });
const twin = (mode) => ({ system: "crm", boundTo: "crm-twin", kind: "twin", mode });

describe("resolveDispatchDecision — the full precedence table", () => {
  test("unbound resolves to twin", () => {
    for (const binding of [null, undefined]) {
      const d = resolveDispatchDecision(binding);
      expect(d).toMatchObject({ decision: "twin", writeDecision: "twin", reason: "unbound", binding: null, live: null });
    }
  });

  test("an invalid binding resolves to twin with the problems attached, never throws", () => {
    const d = resolveDispatchDecision({ system: "crm", boundTo: "not-a-url", kind: "rest", mode: "live_first" });
    expect(d.decision).toBe("twin");
    expect(d.reason).toBe("invalid_binding");
    expect(d.problems.length).toBeGreaterThan(0);
  });

  test("twin_only pins to twin for every kind", () => {
    for (const binding of [rest("twin_only"), mcp("twin_only"), twin("twin_only")]) {
      expect(resolveDispatchDecision(binding)).toMatchObject({ decision: "twin", reason: "twin_only", live: null });
    }
  });

  test("twin_first keeps twin leading but attaches the live side for dialable kinds", () => {
    const d = resolveDispatchDecision(rest("twin_first", { connector: "@ge/connector-core", config: { authEnv: "CRM_TOKEN" } }));
    expect(d.decision).toBe("twin");
    expect(d.reason).toBe("twin_first");
    expect(d.live).toMatchObject({ kind: "rest", boundTo: "https://crm.example.com", config: { authEnv: "CRM_TOKEN" } });
  });

  test("twin_first on an undialable kind attaches no live side", () => {
    for (const binding of [mcp("twin_first"), twin("twin_first")]) {
      expect(resolveDispatchDecision(binding)).toMatchObject({ decision: "twin", reason: "twin_first", live: null });
    }
  });

  test("live_first flips the read decision to live only for dialable kinds", () => {
    const d = resolveDispatchDecision(rest("live_first"));
    expect(d.decision).toBe("live");
    expect(d.reason).toBe("live_first");
    expect(d.live).toMatchObject({ kind: "rest", boundTo: "https://crm.example.com" });
  });

  test("unsafe REST activation fails closed unless its policy exceptions are explicit", () => {
    for (const boundTo of ["http://api.example.com", "https://127.0.0.1", "https://user:pass@api.example.com"]) {
      const d = resolveDispatchDecision(rest("live_first", { boundTo }));
      expect(d).toMatchObject({ decision: "twin", reason: "invalid_binding", live: null });
      expect(d.problems.length).toBeGreaterThan(0);
    }
    expect(
      resolveDispatchDecision(
        rest("live_first", {
          boundTo: "http://127.0.0.1:8080",
          config: { allowInsecureHttp: true, allowPrivateNetwork: true },
        }),
      ),
    ).toMatchObject({ decision: "live", reason: "live_first" });
  });

  test("response limits above the connector hard cap fail closed", () => {
    const d = resolveDispatchDecision(
      rest("live_first", { config: { maxResponseBytes: MAX_RESPONSE_BYTES_HARD_CAP + 1 } }),
    );
    expect(d).toMatchObject({ decision: "twin", reason: "invalid_binding", live: null });
    expect(d.problems).toContain(
      `config.maxResponseBytes must be an integer between 1 and ${MAX_RESPONSE_BYTES_HARD_CAP}`,
    );
  });

  test("live_first on an undialable kind stays twin with a distinct reason", () => {
    for (const binding of [mcp("live_first"), twin("live_first")]) {
      expect(resolveDispatchDecision(binding)).toMatchObject({ decision: "twin", reason: "live_first_undialable", live: null });
    }
  });

  test("writes never leave the twin, whatever the mode", () => {
    for (const binding of [null, rest("twin_only"), rest("twin_first"), rest("live_first"), mcp("live_first")]) {
      expect(resolveDispatchDecision(binding).writeDecision).toBe("twin");
    }
  });

  test("every reason the table can produce is in the closed vocabulary", () => {
    const produced = [
      resolveDispatchDecision(null),
      resolveDispatchDecision({ kind: "rest" }),
      resolveDispatchDecision(rest("twin_only")),
      resolveDispatchDecision(rest("twin_first")),
      resolveDispatchDecision(rest("live_first")),
      resolveDispatchDecision(mcp("live_first")),
    ].map((d) => d.reason);
    for (const reason of produced) expect(DISPATCH_REASONS).toContain(reason);
  });

  test("only rest is dialable today", () => {
    expect([...DIALABLE_KINDS]).toEqual(["rest"]);
  });
});

describe("resolveDispatch / resolveAllDispatch — store-backed", () => {
  test("reads the stored binding; unbound systems resolve without error", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-dispatch-"));
    try {
      await writeBinding({ dir, binding: rest("live_first") });
      const bound = await resolveDispatch("crm", { dir });
      expect(bound).toMatchObject({ system: "crm", decision: "live", reason: "live_first" });

      const unbound = await resolveDispatch("erp", { dir });
      expect(unbound).toMatchObject({ system: "erp", decision: "twin", reason: "unbound" });

      const all = await resolveAllDispatch({ dir });
      expect(Object.keys(all)).toEqual(["crm"]);
      expect(all.crm.decision).toBe("live");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("a missing store directory is the common case, not an error", async () => {
    const dir = join(tmpdir(), "ge-dispatch-never-created");
    expect(await resolveDispatch("crm", { dir })).toMatchObject({ decision: "twin", reason: "unbound" });
    expect(await resolveAllDispatch({ dir })).toEqual({});
  });

  test("requires system and dir explicitly", async () => {
    await expect(resolveDispatch("", { dir: "/tmp" })).rejects.toThrow("system");
    await expect(resolveDispatch("crm", {})).rejects.toThrow("dir");
    await expect(resolveAllDispatch({})).rejects.toThrow("dir");
  });
});

describe("buildDispatchDirective — the env contract the tool plane reads", () => {
  test("both fallback orders become guarded entries; auth travels as an env var NAME", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-directive-"));
    try {
      await writeBinding({ dir, binding: rest("live_first", { config: { authEnv: "CRM_TOKEN", timeoutMs: 5000 } }) });
      await writeBinding({ dir, binding: { ...rest("twin_first"), system: "erp", boundTo: "https://erp.example.com" } });
      await writeBinding({ dir, binding: { ...mcp("live_first"), system: "chat" } });

      const directive = await buildDispatchDirective({ dir });
      expect(directive.schemaVersion).toBe(DIRECTIVE_SCHEMA_VERSION);
      expect(Object.keys(directive.systems)).toEqual(["crm", "erp"]); // undialable live_first excluded
      expect(directive.systems.crm).toEqual({
        decision: "live",
        mode: "live_first",
        fallback: "twin",
        kind: "rest",
        baseUrl: "https://crm.example.com",
        requiresApproval: true,
        authEnv: "CRM_TOKEN",
        timeoutMs: 5000,
        maxResponseBytes: 1048576,
      });
      expect(directive.systems.erp).toMatchObject({
        decision: "twin",
        mode: "twin_first",
        fallback: "live",
        kind: "rest",
        requiresApproval: true,
      });
      // Secrets by reference: no token VALUE can appear — nothing here reads env.
      expect(JSON.stringify(directive)).not.toContain("Bearer");
      expect(LIVE_CONFIRM_ENV).toBe("GE_SIMULATOR_LIVE_CONFIRM");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("no live bindings yields a valid empty directive", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-directive-"));
    try {
      await writeBinding({ dir, binding: twin("twin_only") });
      expect(await buildDispatchDirective({ dir })).toEqual({
        schemaVersion: DIRECTIVE_SCHEMA_VERSION,
        systems: {},
      });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
