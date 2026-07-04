// @ge/okf compile — unit tests for the typed OKF→spec compiler.
//
// Covers: legacy byte-compatibility on an in-memory bundle, new concept types
// flowing into the new spec fields, every structured error code the compiler
// can emit for referential problems, and variant resolution semantics
// (system swap, terminology, policy overlays, workflow overrides, sibling
// convention, cycle detection). Run with: bun test.

import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { renderConcept } from "../index.mjs";
import {
  COMPILE_ERROR_CODES as E,
  compileConcepts,
  compileOkfBundle,
  conceptsFromEntries,
  parseBundle,
  renderIr,
  toDxError,
} from "./index.mjs";

// ─── fixtures ────────────────────────────────────────────────────────────────

/** A minimal legacy bundle (playbook + system + table + tool + workflow). */
function legacyEntries() {
  return [
    {
      relPath: "index",
      frontmatter: { okf_version: "0.1", type: "Knowledge Bundle", title: "Recon" },
      body: "# Recon\n",
    },
    {
      relPath: "playbook",
      frontmatter: { type: "Playbook", title: "Recon — Playbook" },
      body: [
        "# Playbook",
        "",
        "## Role",
        "",
        "Reconciliation copilot for the finance close.",
        "",
        "## Primary objective",
        "",
        "Reconcile balances before close with cited evidence.",
        "",
        "## In scope",
        "",
        "- answer balance questions",
        "- prepare workpapers",
        "",
        "## Out of scope",
        "",
        "- posting journal entries",
        "",
        "## Refusal rules",
        "",
        "- Never invent balances.",
      ].join("\n"),
    },
    {
      relPath: "systems/workday",
      frontmatter: { type: "Source System", title: "Workday" },
      body: "# Workday\n\n- **Protocol:** REST API\n\n# Schema\n\n- [gl_entries](/tables/gl_entries.md)",
    },
    {
      relPath: "tables/gl_entries",
      frontmatter: { type: "Data Entity", title: "gl_entries" },
      body: [
        "# gl_entries",
        "",
        "# Schema",
        "",
        "| Field | Type | Constraints |",
        "|---|---|---|",
        "| id | seq | required |",
        "| status | enum | values: open, closed |",
        "",
        "# Citations",
        "",
        "- Owned by [Workday](/systems/workday.md)",
      ].join("\n"),
    },
    {
      relPath: "tools/query-balances",
      frontmatter: { type: "Agent Tool", title: "query_balances", description: "Fetch GL balances." },
      body: [
        "# query_balances",
        "",
        "- **Kind:** query",
        "- **Source system:** [Workday](/systems/workday.md)",
        "",
        "## Required inputs",
        "",
        "- period",
        "",
        "## Produces",
        "",
        "- balances",
        "",
        "## Evidence emitted",
        "",
        "- source_system_record",
      ].join("\n"),
    },
    {
      relPath: "workflow/index",
      frontmatter: { type: "Index", title: "Workflow Stages" },
      body: "# Workflow Stages\n\n- **Mode:** sequential\n\n1. [Pull balances](/workflow/pull-balances.md)",
    },
    {
      relPath: "workflow/pull-balances",
      frontmatter: { type: "Workflow Stage", title: "Pull balances", source_id: "pull_balances" },
      body: "# Pull balances\n\n## Tools\n\n- [query_balances](/tools/query-balances.md)",
    },
  ];
}

/** The new quality-bearing concepts, referencing the legacy fixture's ids. */
function extensionEntries() {
  return [
    {
      relPath: "grounding/balance-status",
      frontmatter: {
        type: "Grounding Contract",
        title: "balance_status",
        claim_type: "balance_status",
        citation_required: "true",
      },
      body: [
        "# balance_status",
        "",
        "## Evidence",
        "",
        "| System | Tool | Entity | Field |",
        "|---|---|---|---|",
        "| workday | query_balances | gl_entries | status |",
      ].join("\n"),
    },
    {
      relPath: "contracts/query-balances",
      frontmatter: {
        type: "Tool Contract",
        title: "Contract — query_balances",
        tool: "query_balances",
        idempotency: "safe",
        confirmation_policy: "never",
      },
      body: "# Contract — query_balances\n\n## Preconditions\n\n- period exists\n\n## Postconditions\n\n- balances returned",
    },
    {
      relPath: "policies/refuse-regulated",
      frontmatter: {
        type: "Policy",
        title: "Refusal — refuse-regulated",
        source_id: "refuse-regulated",
        policy_kind: "refusal",
        trigger_kind: "data_sensitivity",
        trigger_sensitivity: "regulated",
      },
      body: "# Refusal — refuse-regulated\n\n## Response\n\nDecline and cite the data policy.\n\n## Rationale\n\nRegulated data stays in the system of record.",
    },
    {
      relPath: "personas/controller",
      frontmatter: { type: "Persona", title: "financial controller", persona_id: "controller", patience: "low", adversarial: "false" },
      body: "# financial controller\n\n## Role\n\nfinancial controller\n\n## Goals\n\n- close the books on time",
    },
    {
      relPath: "error-paths/timeout",
      frontmatter: { type: "Error Path", title: "timeout", failure_mode: "timeout", behavior: "retry", max_retries: "3" },
      body: "# timeout\n\n## Fallback\n\nServe the last reconciled balance.\n\n## Tool Overrides\n\n- query_balances: behavior = degrade; fallback = cached balances",
    },
    {
      relPath: "slos",
      frontmatter: { type: "SLO", title: "Service Level Objectives" },
      body: "# SLOs\n\n## Task Success\n\n- definition: reconciliation completed with citations\n- target: 0.9\n\n## Latency\n\n- p95_full_ms: 8000\n\n## Containment\n\n- target: 0.75",
    },
    {
      relPath: "queries/balance-lookup",
      frontmatter: { type: "Query Capability", title: "Balance lookup", description: "What is the current GL balance?", source_id: "balance-lookup" },
      body: [
        "# What is the current GL balance?",
        "",
        "## Tools used",
        "",
        "- [query_balances](/tools/query-balances.md)",
        "",
        "## Evidence expected",
        "",
        "- source_system_record",
        "",
        "## Requires Systems",
        "",
        "- [workday](/systems/workday.md)",
        "",
        "## Fallback",
        "",
        "- degrade: answer from the latest cached snapshot",
      ].join("\n"),
    },
  ];
}

async function writeBundle(dir, entries) {
  for (const entry of entries) {
    const abs = join(dir, `${entry.relPath}.md`);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, renderConcept(entry.frontmatter, entry.body), "utf8");
  }
}

// ─── legacy compatibility ────────────────────────────────────────────────────

describe("legacy extraction", () => {
  test("legacy bundle compiles with zero errors and no new spec fields", async () => {
    const result = await compileConcepts(legacyEntries());
    expect(result.errors).toEqual([]);
    const bc = result.spec.behaviorContract;
    expect(bc.role).toBe("Reconciliation copilot for the finance close.");
    expect(bc.inScope).toEqual(["answer balance questions", "prepare workpapers"]);
    expect(bc.refusalRules).toEqual(["Never invent balances."]);
    expect(bc.toolIntents.map((t) => t.name)).toEqual(["query_balances"]);
    expect(bc.workflow.steps.map((s) => s.id)).toEqual(["pull_balances"]);
    expect(result.spec.generationSpec.sourceSystems).toEqual([
      { id: "workday", name: "Workday", protocol: "REST API", owns: ["gl_entries"] },
    ]);
    // No extension keys leak onto a legacy-only compile.
    for (const key of ["groundingContracts", "toolContracts", "refusalPolicies", "escalationPolicies", "personas", "errorPathBehavior", "slos", "capabilityDependencies"]) {
      expect(key in bc).toBe(false);
    }
    for (const key of ["variantOf", "bindings", "provenance"]) {
      expect(key in result.spec.generationSpec).toBe(false);
    }
  });
});

// ─── new fields flow ─────────────────────────────────────────────────────────

describe("quality-bearing concept types compile into the new spec fields", () => {
  test("grounding/tool contracts, policies, personas, error paths, SLOs, capability deps", async () => {
    const result = await compileConcepts([...legacyEntries(), ...extensionEntries()]);
    expect(result.errors).toEqual([]);
    const bc = result.spec.behaviorContract;
    expect(bc.groundingContracts).toEqual([
      {
        claimType: "balance_status",
        evidence: [{ system: "workday", tool: "query_balances", entity: "gl_entries", field: "status" }],
        citationRequired: true,
      },
    ]);
    expect(bc.toolContracts).toEqual([
      {
        tool: "query_balances",
        preconditions: ["period exists"],
        postconditions: ["balances returned"],
        idempotency: "safe",
        confirmationPolicy: "never",
      },
    ]);
    expect(bc.refusalPolicies).toEqual([
      {
        id: "refuse-regulated",
        trigger: { kind: "data_sensitivity", sensitivity: "regulated" },
        response: "Decline and cite the data policy.",
        rationale: "Regulated data stays in the system of record.",
      },
    ]);
    expect(bc.personas).toEqual([
      { id: "controller", role: "financial controller", goals: ["close the books on time"], patience: "low", adversarial: false },
    ]);
    expect(bc.errorPathBehavior).toEqual([
      {
        failureMode: "timeout",
        behavior: "retry",
        maxRetries: 3,
        fallback: "Serve the last reconciled balance.",
        toolOverrides: { query_balances: { behavior: "degrade", fallback: "cached balances" } },
      },
    ]);
    expect(bc.slos).toEqual({
      taskSuccess: { definition: "reconciliation completed with citations", target: 0.9 },
      latency: { p95FullMs: 8000 },
      containment: { target: 0.75 },
    });
    expect(bc.capabilityDependencies).toEqual([
      { capability: "balance-lookup", requires: ["workday"], fallback: "degrade", fallbackDetail: "answer from the latest cached snapshot" },
    ]);
    // The query itself still compiles as an answerableQuery (legacy path).
    expect(bc.answerableQueries.map((q) => q.id)).toEqual(["balance-lookup"]);
  });

  test("root frontmatter carries provenance", async () => {
    const entries = legacyEntries();
    entries[0].frontmatter = {
      ...entries[0].frontmatter,
      provenance_origin: "migration",
      provenance_source_ref: "decks/recon.pdf",
      provenance_status: "draft",
      provenance_lineage: ["recon-v0"],
    };
    const result = await compileConcepts(entries);
    expect(result.errors).toEqual([]);
    expect(result.spec.generationSpec.provenance).toEqual({
      origin: "migration",
      sourceRef: "decks/recon.pdf",
      status: "draft",
      lineage: ["recon-v0"],
    });
  });
});

// ─── structured errors ───────────────────────────────────────────────────────

describe("structured compile errors (never silent drops)", () => {
  const errorOf = (result, code) => result.errors.find((e) => e.code === code);

  test("unknown concept type", async () => {
    const result = await compileConcepts([
      ...legacyEntries(),
      { relPath: "mystery/x", frontmatter: { type: "Mystery" }, body: "# X" },
    ]);
    const err = errorOf(result, E.UNKNOWN_CONCEPT_TYPE);
    expect(err).toBeTruthy();
    expect(err.conceptPath).toBe("mystery/x.md");
    expect(err.fix).toBeTruthy();
  });

  test("grounding contract citing an undeclared system and an unknown tool", async () => {
    const grounding = extensionEntries()[0];
    grounding.body = grounding.body.replace("| workday | query_balances |", "| netsuite | query_nothing |");
    const result = await compileConcepts([...legacyEntries(), grounding]);
    expect(errorOf(result, E.GROUNDING_UNDECLARED_SYSTEM)).toBeTruthy();
    expect(errorOf(result, E.GROUNDING_UNKNOWN_TOOL)).toBeTruthy();
    // The malformed field is not emitted half-baked... the contract itself
    // still parses (refs are the problem), so it IS emitted alongside errors.
    expect(result.spec.behaviorContract.groundingContracts).toBeTruthy();
  });

  test("tool contract for a nonexistent tool", async () => {
    const contract = extensionEntries()[1];
    contract.frontmatter.tool = "no_such_tool";
    const result = await compileConcepts([...legacyEntries(), contract]);
    expect(errorOf(result, E.TOOL_CONTRACT_UNKNOWN_TOOL)).toBeTruthy();
  });

  test("error path overriding an unknown tool / capability requiring an unknown system", async () => {
    const [, , , , errorPath, , query] = extensionEntries();
    errorPath.body = errorPath.body.replace("- query_balances:", "- ghost_tool:");
    query.body = query.body.replace("- [workday](/systems/workday.md)", "- netsuite");
    const result = await compileConcepts([...legacyEntries(), errorPath, query]);
    expect(errorOf(result, E.ERROR_PATH_UNKNOWN_TOOL)).toBeTruthy();
    expect(errorOf(result, E.CAPABILITY_UNKNOWN_SYSTEM)).toBeTruthy();
  });

  test("invalid enum frontmatter is OKF_INVALID_FIELD with a fix", async () => {
    const contract = extensionEntries()[1];
    contract.frontmatter.idempotency = "sometimes";
    const result = await compileConcepts([...legacyEntries(), contract]);
    const err = errorOf(result, E.INVALID_FIELD);
    expect(err).toBeTruthy();
    expect(err.message).toContain("sometimes");
    expect(err.fix).toContain("idempotency");
  });

  test("toDxError aggregates into a DxError with what/where/why/fix", async () => {
    const result = await compileConcepts([
      ...legacyEntries(),
      { relPath: "mystery/x", frontmatter: { type: "Mystery" }, body: "# X" },
    ]);
    const err = toDxError(result.errors, "/tmp/bundle");
    expect(err.name).toBe("DxError");
    expect(err.what).toContain("OKF compile failed");
    expect(err.where).toContain("mystery/x.md");
    expect(err.why).toContain(E.UNKNOWN_CONCEPT_TYPE);
    expect(typeof err.fix).toBe("string");
    expect(err.errors.length).toBe(result.errors.length);
  });
});

// ─── variant resolution ──────────────────────────────────────────────────────

function variantEntries({ withBindings = true } = {}) {
  const entries = [
    {
      relPath: "index",
      frontmatter: {
        okf_version: "0.1",
        type: "Knowledge Bundle",
        title: "Recon (SAP)",
        variant_of: "recon-base",
        variant_kind: "source-swap",
        provenance_origin: "variant",
      },
      body: "# Recon (SAP)\n",
    },
  ];
  if (withBindings) {
    entries.push({
      relPath: "variant/bindings",
      frontmatter: { type: "Variant Binding", title: "Variant Bindings" },
      body: [
        "# Variant Bindings",
        "",
        "## System Bindings",
        "",
        "| From | To |",
        "|---|---|",
        "| workday | sap_s4hana_fi |",
        "",
        "## Terminology",
        "",
        "| From | To |",
        "|---|---|",
        "| Workday | SAP S/4HANA FI |",
        "",
        "## Policy Overlays",
        "",
        "- refusal: Never post to a closed period.",
        "- escalation: trigger = posting period locked; action = escalate_to_human; handoff = close-lead; rationale = period control",
        "",
        "## Workflow Overrides",
        "",
        "- mode: sequential",
        "- step pull_balances: label = Pull SAP balances; tools = query_balances",
      ].join("\n"),
    });
  }
  return entries;
}

describe("variant resolution", () => {
  test("system swap + terminology + policy overlays + workflow overrides (pure loadBaseIr)", async () => {
    const base = parseBundle(conceptsFromEntries(legacyEntries()));
    const result = await compileConcepts(variantEntries(), {
      loadBaseIr: async () => ({ ir: base.ir, errors: base.errors }),
    });
    expect(result.errors).toEqual([]);
    const spec = result.spec;
    // System swap rewrites system ids and every reference.
    expect(spec.generationSpec.sourceSystems.map((s) => s.id)).toEqual(["sap_s4hana_fi"]);
    expect(spec.generationSpec.entities[0].sourceSystemId).toBe("sap_s4hana_fi");
    expect(spec.behaviorContract.toolIntents[0].sourceSystemId).toBe("sap_s4hana_fi");
    // Terminology rewrites display strings, not ids.
    expect(spec.generationSpec.sourceSystems[0].name).toBe("SAP S/4HANA FI");
    // Policy overlays append.
    expect(spec.behaviorContract.refusalRules).toEqual([
      "Never invent balances.",
      "Never post to a closed period.",
    ]);
    expect(spec.behaviorContract.escalationRules).toEqual([
      { trigger: "posting period locked", action: "escalate_to_human", rationale: "period control", handoffTarget: "close-lead" },
    ]);
    // Workflow overrides patch the step in place.
    expect(spec.behaviorContract.workflow.steps[0].label).toBe("Pull SAP balances");
    expect(spec.behaviorContract.workflow.steps[0].tools).toEqual(["query_balances"]);
    // The variant declaration and bindings ride along on the emitted spec.
    expect(spec.generationSpec.variantOf).toEqual({ baseId: "recon-base", kind: "source-swap" });
    expect(spec.generationSpec.bindings.systems).toEqual({ workday: "sap_s4hana_fi" });
    expect(spec.generationSpec.provenance).toEqual({ origin: "variant" });
  });

  test("binding swapping a system the base never declares is an error", async () => {
    const base = parseBundle(conceptsFromEntries(legacyEntries()));
    const entries = variantEntries();
    entries[1].body = entries[1].body.replace("| workday |", "| netsuite |");
    const result = await compileConcepts(entries, {
      loadBaseIr: async () => ({ ir: base.ir, errors: base.errors }),
    });
    const err = result.errors.find((e) => e.code === E.BINDING_UNKNOWN_SYSTEM);
    expect(err).toBeTruthy();
    expect(err.message).toContain("netsuite");
  });

  test("workflow override targeting an unknown step is an error", async () => {
    const base = parseBundle(conceptsFromEntries(legacyEntries()));
    const entries = variantEntries();
    entries[1].body = entries[1].body.replace("- step pull_balances:", "- step ghost_step:");
    const result = await compileConcepts(entries, {
      loadBaseIr: async () => ({ ir: base.ir, errors: base.errors }),
    });
    expect(result.errors.some((e) => e.code === E.WORKFLOW_OVERRIDE_UNKNOWN_STEP)).toBe(true);
  });

  test("sibling-path convention resolves the base bundle on disk", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-variant-"));
    try {
      await writeBundle(join(dir, "recon-base"), legacyEntries());
      await writeBundle(join(dir, "recon-sap"), variantEntries());
      const result = await compileOkfBundle(join(dir, "recon-sap"));
      expect(result.errors).toEqual([]);
      expect(result.spec.generationSpec.sourceSystems.map((s) => s.id)).toEqual(["sap_s4hana_fi"]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("explicit baseDir option overrides the sibling convention", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-variant-"));
    try {
      await writeBundle(join(dir, "elsewhere", "the-base"), legacyEntries());
      await writeBundle(join(dir, "recon-sap"), variantEntries());
      const result = await compileOkfBundle(join(dir, "recon-sap"), { baseDir: join(dir, "elsewhere", "the-base") });
      expect(result.errors).toEqual([]);
      expect(result.spec.behaviorContract.toolIntents[0].sourceSystemId).toBe("sap_s4hana_fi");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("missing base bundle is OKF_VARIANT_BASE_MISSING (spec still emitted)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-variant-"));
    try {
      await writeBundle(join(dir, "recon-sap"), variantEntries());
      const result = await compileOkfBundle(join(dir, "recon-sap"));
      const err = result.errors.find((e) => e.code === E.VARIANT_BASE_MISSING);
      expect(err).toBeTruthy();
      expect(err.fix).toContain("--variant-base");
      expect(result.spec.generationSpec.variantOf.baseId).toBe("recon-base");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("variant cycles are detected (a → b → a)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-cycle-"));
    try {
      const bundleA = [{ relPath: "index", frontmatter: { okf_version: "0.1", type: "Knowledge Bundle", title: "A", variant_of: "b", variant_kind: "custom" }, body: "# A\n" }];
      const bundleB = [{ relPath: "index", frontmatter: { okf_version: "0.1", type: "Knowledge Bundle", title: "B", variant_of: "a", variant_kind: "custom" }, body: "# B\n" }];
      await writeBundle(join(dir, "a"), bundleA);
      await writeBundle(join(dir, "b"), bundleB);
      const result = await compileOkfBundle(join(dir, "a"));
      expect(result.errors.some((e) => e.code === E.VARIANT_CYCLE)).toBe(true);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("self-referencing variant is a cycle", async () => {
    const dir = await mkdtemp(join(tmpdir(), "okf-cycle-"));
    try {
      await writeBundle(join(dir, "a"), [
        { relPath: "index", frontmatter: { okf_version: "0.1", type: "Knowledge Bundle", title: "A", variant_of: "a", variant_kind: "custom" }, body: "# A\n" },
      ]);
      const result = await compileOkfBundle(join(dir, "a"));
      expect(result.errors.some((e) => e.code === E.VARIANT_CYCLE)).toBe(true);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("variant concepts override base concepts by key; new ones append", async () => {
    const base = parseBundle(conceptsFromEntries(legacyEntries()));
    const entries = [
      ...variantEntries({ withBindings: false }),
      // Override the base's tool (same name) and add a new one.
      {
        relPath: "tools/query-balances",
        frontmatter: { type: "Agent Tool", title: "query_balances", description: "Fetch SAP GL balances." },
        body: "# query_balances\n\n- **Kind:** query\n\n## Required inputs\n\n- company_code\n\n## Produces\n\n- balances\n\n## Evidence emitted\n\n- source_system_record",
      },
      {
        relPath: "tools/post-accrual",
        frontmatter: { type: "Agent Tool", title: "post_accrual", description: "Post an accrual." },
        body: "# post_accrual\n\n- **Kind:** action\n\n## Required inputs\n\n- amount\n\n## Produces\n\n- document_id\n\n## Evidence emitted\n\n- generated_audit_trail",
      },
    ];
    const result = await compileConcepts(entries, {
      loadBaseIr: async () => ({ ir: base.ir, errors: base.errors }),
    });
    expect(result.errors).toEqual([]);
    const tools = result.spec.behaviorContract.toolIntents;
    expect(tools.map((t) => t.name)).toEqual(["query_balances", "post_accrual"]);
    expect(tools[0].description).toBe("Fetch SAP GL balances.");
    expect(tools[0].requiredInputs).toEqual(["company_code"]);
  });
});

// ─── render/parse coherence smoke (exhaustive version in property tests) ─────

describe("renderIr emits parseable concepts", () => {
  test("a rendered IR bundle compiles with zero errors", async () => {
    const base = parseBundle(conceptsFromEntries([...legacyEntries(), ...extensionEntries()]));
    expect(base.errors).toEqual([]);
    const rendered = renderIr(base.ir).map((entry) => ({ relPath: entry.relPath, frontmatter: entry.frontmatter, body: entry.body }));
    const reparsed = parseBundle(conceptsFromEntries(rendered));
    expect(reparsed.errors).toEqual([]);
    expect(reparsed.ir.systems).toEqual(base.ir.systems);
    expect(reparsed.ir.tools).toEqual(base.ir.tools);
    expect(reparsed.ir.groundingContracts).toEqual(base.ir.groundingContracts);
    expect(reparsed.ir.toolContracts).toEqual(base.ir.toolContracts);
    expect(reparsed.ir.personas).toEqual(base.ir.personas);
    expect(reparsed.ir.errorPaths).toEqual(base.ir.errorPaths);
    expect(reparsed.ir.slos).toEqual(base.ir.slos);
  });
});
