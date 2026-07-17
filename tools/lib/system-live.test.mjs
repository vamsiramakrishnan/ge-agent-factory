import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { REDACTION_POLICY_SCHEMA_VERSION, hashRedactionPolicy } from "@ge/redaction";
import { buildSystemProfile, probeAllowed } from "./system-profile.mjs";
import {
  MAX_CALLS_HARD_CAP,
  MAX_IMPORT_BYTES,
  MAX_IMPORT_ENTRIES,
  REPLAY_CORPUS_SCHEMA_VERSION,
  corpusToNdjson,
  importTraces,
  parseCorpus,
  projectCorpusToSamples,
  recordSystemTraces,
} from "./system-record.mjs";
import { MAX_COMPARE_CALLS_HARD_CAP, compareSystemTwin } from "./system-compare.mjs";

const SPEC = {
  openapi: "3.0.0",
  info: { title: "CRM" },
  paths: {
    "/cases": { get: { operationId: "listCases" }, post: { operationId: "createCase" } },
    "/cases/{case_id}": { get: { operationId: "getCase" }, patch: { operationId: "updateCase" } },
  },
  components: { schemas: { Case: { properties: { case_id: { type: "string" }, status: { type: "string" } } } } },
};
const PII_SPEC = { ...SPEC, components: { schemas: { Customer: { properties: { email: { type: "string" } } } } } };
const POLICY = { schemaVersion: REDACTION_POLICY_SCHEMA_VERSION, fields: [] };
const publicResolver = async () => [{ address: "93.184.216.34", family: 4 }];

function stubFetch(body = { results: [{ case_id: "C1", status: "open", owner_team: "tier2" }] }, status = 200) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, method: init.method, authorization: init.headers?.authorization });
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  };
  return { impl, calls };
}

describe("buildSystemProfile", () => {
  test("splits read allowlist from write denylist; auth by reference; no dial without probe", async () => {
    const { impl, calls } = stubFetch();
    const profile = await buildSystemProfile({
      system: "crm",
      baseUrl: "https://crm.example.com",
      openapiText: JSON.stringify(SPEC),
      authRef: "env:CRM_TOKEN",
      fetchImpl: impl,
    });
    expect(profile.allowedProbes.map((op) => `${op.method} ${op.path}`)).toEqual(["GET /cases", "GET /cases/{case_id}"]);
    expect(profile.forbiddenOperations.map((op) => `${op.method} ${op.path}`)).toEqual(["POST /cases", "PATCH /cases/{case_id}"]);
    expect(profile.auth).toEqual({ type: "env", var: "CRM_TOKEN" });
    expect(JSON.stringify(profile)).not.toContain("CRM_TOKEN_VALUE");
    expect(calls).toHaveLength(0);
    expect(profile.openapiHash).toMatch(/^sha256:/);
  });

  test("rejects credential-bearing or query-bearing base URLs before persisting a profile", async () => {
    for (const baseUrl of [
      "https://user:topsecret@crm.example.com/api",
      "https://crm.example.com/api?token=topsecret",
      "https://crm.example.com/api#topsecret",
      "http://crm.example.com/api",
    ]) {
      await expect(
        buildSystemProfile({ system: "crm", baseUrl, openapiText: JSON.stringify(SPEC) }),
      ).rejects.toThrow();
    }
    const profile = await buildSystemProfile({
      system: "crm",
      baseUrl: "https://crm.example.com/api",
      openapiText: JSON.stringify(SPEC),
    });
    expect(profile.baseUrl).toBe("https://crm.example.com/api/");
  });

  test("PII-shaped spec without a redaction policy is refused outright", async () => {
    await expect(
      buildSystemProfile({ system: "crm", openapiText: JSON.stringify(PII_SPEC) }),
    ).rejects.toThrow("redaction policy is required");
    const ok = await buildSystemProfile({
      system: "crm",
      openapiText: JSON.stringify(PII_SPEC),
      redactionPolicyText: JSON.stringify(POLICY),
    });
    expect(ok.redactionPolicyHash).toMatch(/^sha256:/);
    expect(ok.redactionPolicyHash).toBe(hashRedactionPolicy(POLICY));
  });

  test("detects sensitive camelCase, nested, referenced, formatted, token, and password schemas", async () => {
    const sensitiveSpecs = [
      {
        ...SPEC,
        components: { schemas: { Customer: { properties: { profile: { properties: { customerEmail: { type: "string" } } } } } } },
      },
      {
        ...SPEC,
        components: {
          schemas: {
            Wrapper: { properties: { credentials: { $ref: "#/components/schemas/Credential" } } },
            Credential: { properties: { accessToken: { type: "string" }, password: { type: "string" } } },
          },
        },
      },
      {
        ...SPEC,
        components: { schemas: { Contact: { properties: { destination: { type: "string", format: "email" } } } } },
      },
      {
        ...SPEC,
        paths: { "/cases": { get: { parameters: [{ in: "query", name: "apiKey", schema: { type: "string" } }] } } },
      },
    ];
    for (const spec of sensitiveSpecs) {
      await expect(buildSystemProfile({ system: "crm", openapiText: JSON.stringify(spec) })).rejects.toThrow(
        "redaction policy is required",
      );
    }
  });

  test("policy identity is semantic rather than JSON-format dependent", async () => {
    const one = await buildSystemProfile({
      system: "crm",
      openapiText: JSON.stringify(PII_SPEC),
      redactionPolicyText: JSON.stringify(POLICY),
    });
    const two = await buildSystemProfile({
      system: "crm",
      openapiText: JSON.stringify(PII_SPEC),
      redactionPolicyText: '{\n  "fields": [],\n  "schemaVersion": "ge.redaction-policy.v1"\n}',
    });
    expect(one.redactionPolicyHash).toBe(two.redactionPolicyHash);
  });

  test("probe dials exactly once, read-only", async () => {
    const { impl, calls } = stubFetch({}, 200);
    const profile = await buildSystemProfile({
      system: "crm",
      baseUrl: "https://crm.example.com",
      openapiText: JSON.stringify(SPEC),
      probe: true,
      fetchImpl: impl,
      resolveHost: publicResolver,
    });
    expect(profile.probe.reachable).toBe(true);
    for (const call of calls) expect(["GET", "HEAD"]).toContain(call.method);
  });

  test("probeAllowed matches templates, not prefixes", async () => {
    const profile = await buildSystemProfile({ system: "crm", openapiText: JSON.stringify(SPEC) });
    expect(probeAllowed(profile, "/cases")).toBe(true);
    expect(probeAllowed(profile, "/cases/C-1")).toBe(true);
    expect(probeAllowed(profile, "/cases/C-1/audit")).toBe(false);
    expect(probeAllowed(profile, "/customers")).toBe(false);
  });
});

describe("recordSystemTraces", () => {
  const profileFor = async () =>
    buildSystemProfile({ system: "crm", baseUrl: "https://crm.example.com", openapiText: JSON.stringify(SPEC), authRef: "env:CRM_TOKEN" });

  test("bounded, allowlisted, redacted-before-write", async () => {
    const { impl, calls } = stubFetch({ results: [{ case_id: "C1", contact: "jane@example.com" }] });
    const profile = await profileFor();
    const result = await recordSystemTraces({
      profile,
      script: { calls: [{ name: "list", path: "/cases" }, { name: "one", path: "/cases/C-1" }, { name: "extra", path: "/cases" }] },
      policy: POLICY,
      maxCalls: 2,
      env: { CRM_TOKEN: "tok-value" },
      fetchImpl: impl,
      resolveHost: publicResolver,
    });
    expect(result.calls).toBe(2); // budget enforced
    expect(calls).toHaveLength(2);
    const text = corpusToNdjson(result.lines);
    expect(text).not.toContain("jane@example.com"); // redacted before any serialization
    expect(text).not.toContain("tok-value");
    const { header, entries } = parseCorpus(text);
    expect(header.kind).toBe("system_trace");
    expect(entries[0].latencyMs).toBeGreaterThanOrEqual(0);
    expect(["business_hours", "off_hours"]).toContain(entries[0].timestampClass);
    expect(result.redactionReport.totalRedactions).toBeGreaterThan(0);
    expect(() => parseCorpus(text, { profile, system: "crm" })).not.toThrow();
  });

  test("a script path outside the allowlist is refused before dialing", async () => {
    const { impl, calls } = stubFetch();
    const profile = await profileFor();
    await expect(
      recordSystemTraces({ profile, script: { calls: [{ path: "/admin/secrets" }] }, maxCalls: 5, fetchImpl: impl }),
    ).rejects.toThrow("outside the profile's read allowlist");
    expect(calls).toHaveLength(0);
  });

  test("HEAD capture preserves the exact profiled method and never becomes GET", async () => {
    const headSpec = structuredClone(SPEC);
    headSpec.paths["/health"] = { head: { operationId: "headHealth" } };
    const profile = await buildSystemProfile({
      system: "crm",
      baseUrl: "https://crm.example.com",
      openapiText: JSON.stringify(headSpec),
    });
    const { impl, calls } = stubFetch({ must_not_be_captured: true });
    const result = await recordSystemTraces({
      profile,
      script: { calls: [{ method: "HEAD", path: "/health" }] },
      maxCalls: 1,
      fetchImpl: impl,
      resolveHost: publicResolver,
    });
    expect(calls[0].method).toBe("HEAD");
    expect(result.lines[1].request.method).toBe("HEAD");
    await expect(
      recordSystemTraces({
        profile,
        script: { calls: [{ method: "HEAD", path: "/cases" }] },
        maxCalls: 1,
        fetchImpl: impl,
      }),
    ).rejects.toThrow("outside the profile's read allowlist");
  });

  test("maxCalls is mandatory", async () => {
    const profile = await profileFor();
    await expect(recordSystemTraces({ profile, script: { calls: [{ path: "/cases" }] } })).rejects.toThrow("--max-calls is required");
    await expect(
      recordSystemTraces({ profile, script: { calls: [{ path: "/cases" }] }, maxCalls: MAX_CALLS_HARD_CAP + 1 }),
    ).rejects.toThrow("--max-calls is required");
  });

  test("profile policy and system identity are checked before dialing", async () => {
    const { impl, calls } = stubFetch();
    const profile = await buildSystemProfile({
      system: "crm",
      baseUrl: "https://crm.example.com",
      openapiText: JSON.stringify(PII_SPEC),
      redactionPolicyText: JSON.stringify(POLICY),
    });
    const differentPolicy = {
      schemaVersion: REDACTION_POLICY_SCHEMA_VERSION,
      fields: [{ path: "response.body.email", action: "drop" }],
    };
    await expect(
      recordSystemTraces({ profile, system: "crm", script: { calls: [{ path: "/cases" }] }, policy: differentPolicy, maxCalls: 1, fetchImpl: impl }),
    ).rejects.toThrow("redaction policy mismatch");
    await expect(
      recordSystemTraces({ profile, system: "billing", script: { calls: [{ path: "/cases" }] }, policy: POLICY, maxCalls: 1, fetchImpl: impl }),
    ).rejects.toThrow("identity mismatch");
    expect(calls).toHaveLength(0);
  });

  test("HAR import goes through redaction and drops write traffic", () => {
    const har = {
      log: {
        entries: [
          {
            request: { method: "GET", url: "https://crm.example.com/cases", headers: [{ name: "Authorization", value: "Bearer secret-har" }] },
            response: { status: 200, headers: [], content: { text: JSON.stringify({ email: "jane@example.com" }) } },
            time: 42.7,
          },
          {
            request: { method: "POST", url: "https://crm.example.com/cases", headers: [] },
            response: { status: 201, headers: [], content: { text: "{}" } },
          },
        ],
      },
    };
    const result = importTraces({ format: "har", text: JSON.stringify(har), system: "crm", policy: POLICY });
    expect(result.calls).toBe(1); // POST dropped
    const text = corpusToNdjson(result.lines);
    expect(text).not.toContain("secret-har");
    expect(text).not.toContain("jane@example.com");
  });

  test("NDJSON import rejects writes and mismatched corpus identity", () => {
    const header = {
      schemaVersion: REPLAY_CORPUS_SCHEMA_VERSION,
      kind: "system_trace",
      system: "crm",
      profileHash: null,
      policyHash: null,
    };
    const write = { request: { method: "POST", path: "/cases" }, response: { status: 201, body: {} } };
    expect(() => importTraces({ format: "ndjson", text: corpusToNdjson([header, write]), system: "crm" })).toThrow(
      "non-read request method",
    );
    expect(() => importTraces({ format: "ndjson", text: corpusToNdjson([{ ...header, system: "billing" }]), system: "crm" })).toThrow(
      "identity mismatch",
    );
  });

  test("imports have byte and entry hard caps", () => {
    expect(() => importTraces({ format: "ndjson", text: "x".repeat(MAX_IMPORT_BYTES + 1), system: "crm" })).toThrow(
      "byte hard cap",
    );
    const readEntry = JSON.stringify({ request: { method: "GET", path: "/cases" }, response: { status: 200 } });
    const oversized = `${Array.from({ length: MAX_IMPORT_ENTRIES + 1 }, () => readEntry).join("\n")}\n`;
    expect(() => importTraces({ format: "ndjson", text: oversized, system: "crm" })).toThrow("entry hard cap");
  });

  test("parseCorpus verifies the exact profile hash", async () => {
    const profile = await profileFor();
    const { impl } = stubFetch();
    const result = await recordSystemTraces({
      profile,
      system: "crm",
      script: { calls: [{ path: "/cases" }] },
      maxCalls: 1,
      env: { CRM_TOKEN: "test-token" },
      fetchImpl: impl,
      resolveHost: publicResolver,
    });
    const tampered = structuredClone(result.lines);
    tampered[0].profileHash = "sha256:not-the-profile";
    expect(() => parseCorpus(corpusToNdjson(tampered), { profile, system: "crm" })).toThrow("profile/corpus identity mismatch");
  });
});

describe("projectCorpusToSamples", () => {
  test("keys rows by collection path and surfaces observed latency/status", () => {
    const corpus = {
      entries: [
        { request: { path: "/cases" }, response: { status: 200, body: { results: [{ case_id: "C1", owner_team: "t2" }] } }, latencyMs: 30 },
        { request: { path: "/cases/C1" }, response: { status: 200, body: { case_id: "C1", sla: "gold" } }, latencyMs: 10 },
        { request: { path: "/admin" }, response: { status: 500, body: null }, latencyMs: 5 },
      ],
    };
    const { samples, observed } = projectCorpusToSamples(corpus);
    // /cases and /cases/C1 both fold into "cases" (id-segment stripped); /admin had no rows.
    expect(Object.keys(samples)).toEqual(["cases"]);
    expect(samples.cases).toHaveLength(2);
    expect(samples.cases[0]).toHaveProperty("owner_team");
    expect(samples.cases[1]).toHaveProperty("sla");
    expect(observed.latencies).toEqual([5, 10, 30]);
    expect(observed.statuses).toEqual({ 200: 2, 500: 1 });
  });
});

describe("compareSystemTwin", () => {
  test("reports mechanical coverage and advisory realism with next commands", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ge-compare-"));
    try {
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, "schema.json"), JSON.stringify({ collections: { cases: { fields: { case_id: "string", status: "string" } } } }));
      await writeFile(
        join(dir, "tools.json"),
        JSON.stringify({ tools: [{ name: "search_cases", binding: { op: "search", collection: "cases" } }] }),
      );
      await writeFile(join(dir, "workflows.json"), JSON.stringify({ toolHandlers: {} }));

      const profile = await buildSystemProfile({
        system: "crm",
        baseUrl: "https://crm.example.com",
        openapiText: JSON.stringify(SPEC),
      });
      const { impl, calls } = stubFetch({ results: [{ case_id: "C1", status: "open", owner_team: "tier2" }] });
      const report = await compareSystemTwin({
        profile,
        repoRoot: "/nonexistent",
        packDir: dir,
        maxCalls: 5,
        fetchImpl: impl,
        resolveHost: publicResolver,
      });

      expect(report.dimensions.endpoint_coverage.status).toBe("pass"); // both GETs map to cases
      expect(report.dimensions.field_coverage.status).toBe("gap"); // owner_team missing from twin
      expect(report.dimensions.field_coverage.collections[0].missingFromTwin).toEqual(["owner_team"]);
      expect(report.dimensions.latency.kind).toBe("advisory");
      expect(report.next.join("\n")).toContain("--from-traces");
      for (const call of calls) expect(call.method).toBe("GET"); // never a write
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("refuses to run without a live baseUrl or without a twin", async () => {
    await expect(compareSystemTwin({ profile: { system: "x" }, repoRoot: "/tmp" })).rejects.toThrow("schemaVersion");
    const profile = await buildSystemProfile({ system: "ghost", baseUrl: "https://x.example.com", openapiText: JSON.stringify(SPEC) });
    await expect(compareSystemTwin({ profile, repoRoot: "/nonexistent" })).rejects.toThrow("no twin pack found");
  });

  test("identity and call budgets are validated before pack reads or live calls", async () => {
    const profile = await buildSystemProfile({ system: "crm", baseUrl: "https://x.example.com", openapiText: JSON.stringify(SPEC) });
    await expect(compareSystemTwin({ profile, system: "billing", repoRoot: "/nonexistent" })).rejects.toThrow("identity mismatch");
    await expect(compareSystemTwin({ profile, repoRoot: "/nonexistent", maxCalls: Number.NaN })).rejects.toThrow("maxCalls");
    await expect(
      compareSystemTwin({ profile, repoRoot: "/nonexistent", maxCalls: MAX_COMPARE_CALLS_HARD_CAP + 1 }),
    ).rejects.toThrow("maxCalls");
  });
});
