// Focused Zod-level tests for the OPTIONAL quality-bearing spec extensions
// (grounding/tool contracts, structured policies, personas, error paths,
// semantic column contracts, SLOs, variant bindings, capability dependencies,
// provenance). Contract under test: every extension is optional (legacy specs
// keep parsing), each field's enums reject junk, and loose objects keep
// unknown keys — same posture as the base schema.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BehaviorContractSchema,
  CapabilityDependencySchema,
  ErrorPathBehaviorSchema,
  GenerationSpecSchema,
  GroundingContractSchema,
  RefusalPolicySchema,
  SchemaColumnSchema,
  SlosSchema,
  SpecPersonaSchema,
  SpecProvenanceSchema,
  ToolContractSchema,
  VariantBindingsSchema,
  VariantOfSchema,
} from "../src/schema";

const HERE = dirname(fileURLToPath(import.meta.url));

function catalogGradeSpec(): Record<string, unknown> {
  const raw = JSON.parse(
    readFileSync(join(HERE, "fixtures", "specs", "catalog-grade.json"), "utf8"),
  ) as { generationSpec: Record<string, unknown> };
  return raw.generationSpec;
}

describe("quality-bearing extensions are optional and additive", () => {
  test("a legacy spec without any extension field still parses", () => {
    const result = GenerationSpecSchema.safeParse(catalogGradeSpec());
    expect(result.success).toBe(true);
  });

  test("a spec carrying every extension field parses", () => {
    const spec = catalogGradeSpec();
    const bc = spec.behaviorContract as Record<string, unknown>;
    bc.groundingContracts = [
      {
        claimType: "balance_status",
        evidence: [{ system: "sap_s4hana_fi", tool: "query_gl", entity: "gl_entries", field: "balance" }],
        citationRequired: true,
      },
    ];
    bc.toolContracts = [
      {
        tool: "query_gl",
        preconditions: ["period is closed"],
        postconditions: ["balances returned"],
        idempotency: "safe",
        confirmationPolicy: "never",
      },
    ];
    bc.refusalPolicies = [
      {
        trigger: { kind: "data_sensitivity", sensitivity: "regulated" },
        response: "Refuse and cite the data-handling policy.",
        rationale: "Regulated data may not leave the system of record.",
      },
    ];
    bc.escalationPolicies = [
      {
        trigger: { kind: "authority_missing", authority: "sap_s4hana_fi" },
        response: "Escalate to the reconciliation lead.",
        rationale: "No authoritative balance without the ERP.",
        handoffTarget: "recon-lead-queue",
      },
    ];
    bc.personas = [
      { id: "controller", role: "financial controller", goals: ["close the books"], patience: "low", adversarial: false },
    ];
    bc.errorPathBehavior = [
      {
        failureMode: "rate_limited",
        behavior: "retry",
        maxRetries: 3,
        toolOverrides: { query_gl: { behavior: "degrade", fallback: "serve cached balances" } },
      },
    ];
    bc.slos = {
      taskSuccess: { definition: "reconciliation completed with citations", target: 0.9 },
      latency: { p95TtftMs: 1200, p95FullMs: 8000 },
      containment: { target: 0.75 },
    };
    bc.capabilityDependencies = [
      { capability: "balance-lookup", requires: ["sap_s4hana_fi"], fallback: "refuse" },
    ];
    spec.variantOf = { baseId: "account-reconciliation-agent", kind: "source-swap" };
    spec.bindings = {
      systems: { workday: "sap_s4hana_fi" },
      terminology: { Workday: "SAP S/4HANA" },
      policyOverlays: [{ kind: "refusal", rule: "Never post to a closed period." }],
      workflowOverrides: { steps: [{ id: "pull", tools: ["query_gl"] }] },
    };
    spec.provenance = {
      origin: "variant",
      sourceRef: "okf/account-reconciliation-agent",
      status: "draft",
      lineage: ["account-reconciliation-agent"],
    };
    const result = GenerationSpecSchema.safeParse(spec);
    expect(result.success, result.success ? "" : JSON.stringify(result.error.issues)).toBe(true);
  });
});

describe("extension enums reject junk", () => {
  test("toolContracts.idempotency and confirmationPolicy are closed enums", () => {
    const base = { tool: "t", preconditions: [], postconditions: [] };
    expect(ToolContractSchema.safeParse({ ...base, idempotency: "safe", confirmationPolicy: "always" }).success).toBe(true);
    expect(ToolContractSchema.safeParse({ ...base, idempotency: "sometimes", confirmationPolicy: "always" }).success).toBe(false);
    expect(ToolContractSchema.safeParse({ ...base, idempotency: "safe", confirmationPolicy: "maybe" }).success).toBe(false);
  });

  test("refusal policy trigger kind is a closed enum", () => {
    const ok = { trigger: { kind: "request_category", category: "legal advice" }, response: "r", rationale: "why" };
    expect(RefusalPolicySchema.safeParse(ok).success).toBe(true);
    expect(RefusalPolicySchema.safeParse({ ...ok, trigger: { kind: "vibes" } }).success).toBe(false);
  });

  test("error path failure mode and behavior are closed enums", () => {
    expect(ErrorPathBehaviorSchema.safeParse({ failureMode: "timeout", behavior: "inform" }).success).toBe(true);
    expect(ErrorPathBehaviorSchema.safeParse({ failureMode: "gremlins", behavior: "inform" }).success).toBe(false);
    expect(ErrorPathBehaviorSchema.safeParse({ failureMode: "timeout", behavior: "panic" }).success).toBe(false);
  });

  test("column piiClass is a closed enum; unit/range/maskingPolicy are free-form", () => {
    const col = { name: "salary", type: "float", unit: "USD", range: { min: 0, max: 500000 }, piiClass: "sensitive", maskingPolicy: "redact" };
    expect(SchemaColumnSchema.safeParse(col).success).toBe(true);
    expect(SchemaColumnSchema.safeParse({ ...col, piiClass: "spicy" }).success).toBe(false);
    // range requires both bounds
    expect(SchemaColumnSchema.safeParse({ name: "n", type: "float", range: { min: 0 } }).success).toBe(false);
  });

  test("variantOf kind and provenance origin/status are closed enums", () => {
    expect(VariantOfSchema.safeParse({ baseId: "b", kind: "vertical" }).success).toBe(true);
    expect(VariantOfSchema.safeParse({ baseId: "b", kind: "remix" }).success).toBe(false);
    expect(SpecProvenanceSchema.safeParse({ origin: "interview", status: "promoted" }).success).toBe(true);
    expect(SpecProvenanceSchema.safeParse({ origin: "dream" }).success).toBe(false);
    expect(SpecProvenanceSchema.safeParse({ origin: "manual", status: "vibing" }).success).toBe(false);
  });
});

describe("extension minimums and shapes", () => {
  test("grounding contracts need at least one evidence ref with a system", () => {
    expect(
      GroundingContractSchema.safeParse({ claimType: "c", evidence: [], citationRequired: false }).success,
    ).toBe(false);
    expect(
      GroundingContractSchema.safeParse({ claimType: "c", evidence: [{ system: "s" }], citationRequired: false }).success,
    ).toBe(true);
    expect(
      GroundingContractSchema.safeParse({ claimType: "c", evidence: [{ tool: "t" }], citationRequired: false }).success,
    ).toBe(false);
  });

  test("personas need an id, role, and at least one goal", () => {
    expect(SpecPersonaSchema.safeParse({ id: "p", role: "r", goals: [] }).success).toBe(false);
    expect(SpecPersonaSchema.safeParse({ id: "p", role: "r", goals: ["g"], adversarial: true }).success).toBe(true);
  });

  test("capability dependencies need at least one required system", () => {
    expect(CapabilityDependencySchema.safeParse({ capability: "c", requires: [] }).success).toBe(false);
    expect(CapabilityDependencySchema.safeParse({ capability: "c", requires: ["s"], fallback: "degrade" }).success).toBe(true);
    expect(CapabilityDependencySchema.safeParse({ capability: "c", requires: ["s"], fallback: "explode" }).success).toBe(false);
  });

  test("slos parts are independently optional", () => {
    expect(SlosSchema.safeParse({}).success).toBe(true);
    expect(SlosSchema.safeParse({ latency: { p95FullMs: 4000 } }).success).toBe(true);
    expect(SlosSchema.safeParse({ taskSuccess: { definition: "d" } }).success).toBe(false); // target required
  });

  test("bindings records map string to string; overlays accept prose or escalation objects", () => {
    expect(VariantBindingsSchema.safeParse({ systems: { a: "b" } }).success).toBe(true);
    expect(VariantBindingsSchema.safeParse({ systems: { a: 7 } }).success).toBe(false);
    expect(
      VariantBindingsSchema.safeParse({
        policyOverlays: [
          { kind: "refusal", rule: "Never guess." },
          { kind: "escalation", rule: { trigger: "t", action: "escalate_to_human", rationale: "r" } },
        ],
      }).success,
    ).toBe(true);
    expect(VariantBindingsSchema.safeParse({ policyOverlays: [{ kind: "vibe", rule: "x" }] }).success).toBe(false);
  });

  test("extension objects are loose: unknown keys survive parsing", () => {
    const parsed = ToolContractSchema.parse({
      tool: "t",
      preconditions: [],
      postconditions: [],
      idempotency: "effectful",
      confirmationPolicy: "destructive",
      futureField: { keep: "me" },
    });
    expect((parsed as Record<string, unknown>).futureField).toEqual({ keep: "me" });
  });

  test("behaviorContract accepts the extension arrays without disturbing required minimums", () => {
    const bc = (catalogGradeSpec() as { behaviorContract: Record<string, unknown> }).behaviorContract;
    const withExtensions = { ...bc, personas: [{ id: "p", role: "r", goals: ["g"] }], slos: {} };
    expect(BehaviorContractSchema.safeParse(withExtensions).success).toBe(true);
  });
});
