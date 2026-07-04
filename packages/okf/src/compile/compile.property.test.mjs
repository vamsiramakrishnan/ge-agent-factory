// @ge/okf compile — property tests (fast-check).
//
// Two invariants hold the compiler together:
//
//   1. ROUND-TRIP: for arbitrary valid IR, parse(render(ir)) ≡ ir — the
//      forward renderers in render.mjs and the grammars in parse.mjs are
//      exact inverses over the renderable collections (systems, tools,
//      grounding contracts, tool contracts, structured policies, personas,
//      error paths, SLOs, variant bindings, root variant/provenance).
//
//   2. COMPILE-TOTAL: compiling ANY rendered bundle (optionally polluted
//      with junk concepts) never throws — it always yields a spec plus
//      structured errors, and every emitted new-field group is schema-valid
//      by construction (an OKF_SPEC_SCHEMA error would betray a parser bug).
//
// Arbitraries are deliberately SMALL and grammar-safe: ids are slug-safe,
// display text avoids the reserved separators (| ; = newline) the section
// grammars use. That is the authoring contract, not a test convenience.

import { describe, expect, test } from "bun:test";
import fc from "fast-check";

import {
  compileConcepts,
  conceptsFromEntries,
  makeEmptyIr,
  parseBundle,
  renderIr,
} from "./index.mjs";

// ─── arbitraries ─────────────────────────────────────────────────────────────

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

const word = fc
  .array(fc.constantFrom(...(LOWER + DIGITS)), { minLength: 1, maxLength: 8 })
  .map((cs) => `w${cs.join("")}`); // leading letter: slug- and YAML-safe

/** Grammar-safe display text: words joined by single spaces. */
const text = fc.array(word, { minLength: 1, maxLength: 4 }).map((ws) => ws.join(" "));

const uniqueWords = (constraints) => fc.uniqueArray(word, constraints);

const optional = (arb) => fc.option(arb, { nil: undefined });

/** fc.tuple over a possibly-empty list of arbitraries. */
const tupleOf = (arbs) => (arbs.length ? fc.tuple(...arbs) : fc.constant([]));

const systemArb = (id) =>
  fc.record(
    { name: text, protocol: optional(text), owns: uniqueWords({ maxLength: 2 }) },
    { requiredKeys: ["name", "owns"] },
  ).map((s) => ({ id, ...s }));

const toolArb = (name) =>
  fc.record(
    {
      kind: optional(fc.constantFrom("query", "action", "evidence_lookup", "notification", "calculation")),
      sourceSystemId: optional(word),
      description: optional(text),
      requiredInputs: fc.array(text, { maxLength: 2 }),
      produces: fc.array(text, { maxLength: 2 }),
      evidenceEmitted: fc.array(text, { maxLength: 2 }),
    },
    { requiredKeys: ["requiredInputs", "produces", "evidenceEmitted"] },
  ).map((t) => ({ name, kind: t.kind, sourceSystemId: t.sourceSystemId, description: t.description, requiredInputs: t.requiredInputs, produces: t.produces, evidenceEmitted: t.evidenceEmitted }));

const evidenceRefArb = fc.record(
  { system: word, tool: optional(word), entity: optional(word), field: optional(word) },
  { requiredKeys: ["system"] },
);

const groundingArb = (claimType) =>
  fc.record({
    evidence: fc.array(evidenceRefArb, { minLength: 1, maxLength: 3 }),
    citationRequired: fc.boolean(),
  }).map((g) => ({ claimType, ...g }));

const toolContractArb = (tool) =>
  fc.record({
    preconditions: fc.array(text, { maxLength: 2 }),
    postconditions: fc.array(text, { maxLength: 2 }),
    idempotency: fc.constantFrom("safe", "idempotent", "effectful"),
    confirmationPolicy: fc.constantFrom("never", "destructive", "always"),
  }).map((c) => ({ tool, ...c }));

const triggerArb = fc.record(
  {
    kind: fc.constantFrom("entity_condition", "request_category", "authority_missing", "data_sensitivity"),
    entity: optional(word),
    condition: optional(text),
    category: optional(text),
    authority: optional(word),
    sensitivity: optional(fc.constantFrom("none", "personal", "sensitive", "regulated")),
  },
  { requiredKeys: ["kind"] },
);

const refusalPolicyArb = (id) =>
  fc.record({ trigger: triggerArb, response: text, rationale: text }).map((p) => ({ id, ...p }));

const escalationPolicyArb = (id) =>
  fc.record(
    { trigger: triggerArb, response: text, rationale: text, handoffTarget: optional(word) },
    { requiredKeys: ["trigger", "response", "rationale"] },
  ).map((p) => ({ id, trigger: p.trigger, response: p.response, rationale: p.rationale, ...(p.handoffTarget !== undefined ? { handoffTarget: p.handoffTarget } : {}) }));

const personaArb = (id) =>
  fc.record(
    {
      role: text,
      goals: fc.array(text, { minLength: 1, maxLength: 3 }),
      vocabulary: optional(text),
      patience: optional(fc.constantFrom("low", "medium", "high")),
      adversarial: optional(fc.boolean()),
      simulationInstruction: optional(text),
    },
    { requiredKeys: ["role", "goals"] },
  ).map((p) => ({ id, ...p }));

const overrideArb = fc.record(
  { behavior: fc.constantFrom("retry", "inform", "escalate", "degrade"), maxRetries: optional(fc.nat({ max: 9 })), fallback: optional(text) },
  { requiredKeys: ["behavior"] },
);

const errorPathArb = (failureMode) =>
  fc.record(
    {
      behavior: fc.constantFrom("retry", "inform", "escalate", "degrade"),
      maxRetries: optional(fc.nat({ max: 9 })),
      fallback: optional(text),
      toolOverrides: optional(fc.dictionary(word, overrideArb, { minKeys: 1, maxKeys: 2 })),
    },
    { requiredKeys: ["behavior"] },
  ).map((e) => ({ failureMode, ...e }));

const slosArb = fc.record(
  {
    taskSuccess: optional(fc.record({ definition: text, target: fc.nat({ max: 100 }).map((n) => n / 100) })),
    latency: optional(
      fc.oneof(
        fc.record({ p95TtftMs: fc.nat({ max: 60000 }) }),
        fc.record({ p95FullMs: fc.nat({ max: 60000 }) }),
        fc.record({ p95TtftMs: fc.nat({ max: 60000 }), p95FullMs: fc.nat({ max: 60000 }) }),
      ),
    ),
    containment: optional(fc.record({ target: fc.nat({ max: 100 }).map((n) => n / 100) })),
  },
  { requiredKeys: [] },
).filter((s) => s.taskSuccess !== undefined || s.latency !== undefined || s.containment !== undefined);

const policyOverlayArb = fc.oneof(
  fc.record({ kind: fc.constant("refusal"), rule: text }),
  fc.record({
    kind: fc.constant("escalation"),
    rule: fc.record(
      { trigger: text, action: fc.constantFrom("escalate_to_human", "refuse", "request_more_info", "use_fallback_tool"), rationale: text, handoffTarget: optional(word) },
      { requiredKeys: ["trigger", "action", "rationale"] },
    ).map((r) => ({ trigger: r.trigger, action: r.action, rationale: r.rationale, ...(r.handoffTarget !== undefined ? { handoffTarget: r.handoffTarget } : {}) })),
  }),
);

const stepOverrideArb = (id) =>
  fc.oneof(
    fc.constant({ id, remove: true }),
    fc.record(
      { label: optional(text), description: optional(text), tools: optional(uniqueWords({ minLength: 1, maxLength: 2 })) },
      { requiredKeys: [] },
    )
      .filter((s) => s.label !== undefined || s.description !== undefined || s.tools !== undefined)
      .map((s) => ({ id, ...s })),
  );

const bindingsArb = fc.record(
  {
    systems: optional(fc.dictionary(word, word, { minKeys: 1, maxKeys: 2 })),
    terminology: optional(fc.dictionary(text, text, { minKeys: 1, maxKeys: 2 })),
    policyOverlays: optional(fc.array(policyOverlayArb, { minLength: 1, maxLength: 2 })),
    workflowOverrides: optional(
      fc.record(
        {
          mode: optional(fc.constantFrom("sequential", "parallel")),
          steps: optional(uniqueWords({ minLength: 1, maxLength: 2 }).chain((ids) => tupleOf(ids.map(stepOverrideArb)))),
        },
        { requiredKeys: [] },
      )
        .map((w) => ({ ...(w.mode !== undefined ? { mode: w.mode } : {}), ...(w.steps !== undefined ? { steps: [...w.steps] } : {}) }))
        .filter((w) => w.mode !== undefined || w.steps !== undefined),
    ),
  },
  { requiredKeys: [] },
).filter((b) => Object.values(b).some((v) => v !== undefined));

const rootArb = fc.record({
  variantOf: optional(fc.record({ baseId: word, kind: fc.constantFrom("vertical", "source-swap", "custom") })),
  provenance: optional(
    fc.record(
      {
        origin: fc.constantFrom("interview", "deck", "migration", "variant", "manual"),
        sourceRef: optional(word),
        version: optional(word),
        owner: optional(word),
        status: optional(fc.constantFrom("draft", "registered", "promoted", "retired")),
        createdAt: optional(fc.constant("2026-01-01T00:00:00.000Z")),
        lineage: optional(uniqueWords({ minLength: 1, maxLength: 2 })),
      },
      { requiredKeys: ["origin"] },
    ),
  ),
}).map((r) => ({ variantOf: r.variantOf ?? null, provenance: r.provenance ?? null }));

/** Arbitrary valid IR over the renderable collections. */
const irArb = fc
  .record({
    root: rootArb,
    systemIds: uniqueWords({ maxLength: 3 }),
    toolNames: uniqueWords({ maxLength: 3 }),
    claimTypes: uniqueWords({ maxLength: 2 }),
    contractTools: uniqueWords({ maxLength: 2 }),
    policyIds: uniqueWords({ maxLength: 3 }),
    personaIds: uniqueWords({ maxLength: 2 }),
    failureModes: fc.uniqueArray(
      fc.constantFrom("rate_limited", "timeout", "conflict", "validation_error", "not_found", "permission_denied", "unavailable"),
      { maxLength: 2 },
    ),
    slos: optional(slosArb),
    bindings: optional(bindingsArb),
  })
  .chain((shape) => {
    const refusalCount = Math.floor(shape.policyIds.length / 2);
    return fc.record({
      root: fc.constant(shape.root),
      systems: tupleOf(shape.systemIds.map(systemArb)),
      tools: tupleOf(shape.toolNames.map(toolArb)),
      groundingContracts: tupleOf(shape.claimTypes.map(groundingArb)),
      toolContracts: tupleOf(shape.contractTools.map(toolContractArb)),
      refusalPolicies: tupleOf(shape.policyIds.slice(0, refusalCount).map(refusalPolicyArb)),
      escalationPolicies: tupleOf(shape.policyIds.slice(refusalCount).map(escalationPolicyArb)),
      personas: tupleOf(shape.personaIds.map(personaArb)),
      errorPaths: tupleOf(shape.failureModes.map(errorPathArb)),
      slos: fc.constant(shape.slos ?? null),
      bindings: fc.constant(shape.bindings ?? null),
    });
  })
  .map((parts) => ({
    ...makeEmptyIr(),
    ...parts,
    systems: [...parts.systems],
    tools: [...parts.tools],
    groundingContracts: [...parts.groundingContracts],
    toolContracts: [...parts.toolContracts],
    refusalPolicies: [...parts.refusalPolicies],
    escalationPolicies: [...parts.escalationPolicies],
    personas: [...parts.personas],
    errorPaths: [...parts.errorPaths],
  }));

// ─── helpers ─────────────────────────────────────────────────────────────────

const sortByKey = (list, keyOf) => [...list].sort((a, b) => (keyOf(a) < keyOf(b) ? -1 : keyOf(a) > keyOf(b) ? 1 : 0));

/** Strip undefined-valued keys so toEqual comparisons are shape-exact. */
function compact(value) {
  if (Array.isArray(value)) return value.map(compact);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) if (v !== undefined) out[k] = compact(v);
    return out;
  }
  return value;
}

// Parse.mjs collects typed concepts sorted by concept id (their slugged
// path), so canonicalize both sides with the same ordering.
function canonical(ir) {
  const bySlugOf = (keyOf) => (node) => String(keyOf(node)).replace(/_/g, "-");
  return compact({
    root: ir.root,
    systems: ir.systems,
    tools: ir.tools,
    groundingContracts: sortByKey(ir.groundingContracts, bySlugOf((g) => g.claimType)),
    toolContracts: sortByKey(ir.toolContracts, bySlugOf((c) => c.tool)),
    refusalPolicies: sortByKey(ir.refusalPolicies, bySlugOf((p) => p.id)),
    escalationPolicies: sortByKey(ir.escalationPolicies, bySlugOf((p) => p.id)),
    personas: sortByKey(ir.personas, bySlugOf((p) => p.id)),
    errorPaths: sortByKey(ir.errorPaths, bySlugOf((e) => e.failureMode)),
    slos: ir.slos,
    bindings: ir.bindings,
  });
}

const FC_RUNS = { numRuns: 120 };

// ─── properties ──────────────────────────────────────────────────────────────

describe("property: parse(render(ir)) ≡ ir", () => {
  test("round-trips every renderable collection", () => {
    fc.assert(
      fc.property(irArb, (ir) => {
        const entries = renderIr(ir);
        const { ir: reparsed, errors } = parseBundle(conceptsFromEntries(entries));
        expect(errors).toEqual([]);
        expect(canonical(reparsed)).toEqual(canonical(ir));
      }),
      FC_RUNS,
    );
  });
});

describe("property: compile is total", () => {
  const junkConceptArb = fc.record({
    relPath: word.map((w) => `junk/${w}`),
    frontmatter: fc.record({ type: fc.oneof(fc.constant(""), word.map((w) => `Junk ${w}`)) }),
    body: text.map((t) => `# ${t}`),
  });

  test("never throws; always yields a spec + structured errors; no compiler-bug schema errors", async () => {
    await fc.assert(
      fc.asyncProperty(irArb, fc.array(junkConceptArb, { maxLength: 2 }), async (ir, junk) => {
        const entries = [...renderIr(ir), ...junk];
        const result = await compileConcepts(entries);
        // Always a spec with the two top-level parts.
        expect(result.spec).toBeTruthy();
        expect(result.spec.behaviorContract).toBeTruthy();
        expect(result.spec.generationSpec).toBeTruthy();
        // Every error is structured: code + message + fix.
        for (const error of result.errors) {
          expect(typeof error.code).toBe("string");
          expect(error.code.startsWith("OKF_")).toBe(true);
          expect(typeof error.message).toBe("string");
          expect(typeof error.fix).toBe("string");
          // A parsed-but-schema-invalid field is a compiler bug by definition.
          expect(error.code).not.toBe("OKF_SPEC_SCHEMA");
        }
        // Junk concepts are structured errors, never silent drops.
        for (const j of junk) {
          expect(result.errors.some((e) => e.conceptPath === `${j.relPath}.md` && e.code === "OKF_UNKNOWN_CONCEPT_TYPE")).toBe(true);
        }
      }),
      { numRuns: 60 },
    );
  });

  test("a clean rendered bundle with resolvable refs compiles error-free", async () => {
    await fc.assert(
      fc.asyncProperty(irArb, async (ir) => {
        // Make every cross-reference resolvable: rewrite refs onto the
        // declared systems/tools (or drop the referencing collections).
        const sysId = ir.systems[0]?.id;
        const toolName = ir.tools[0]?.name;
        const clean = {
          ...ir,
          root: { ...ir.root, variantOf: null }, // no base bundle here
          bindings: null,
          tools: ir.tools.map((t) => compact({ ...t, sourceSystemId: undefined })),
          groundingContracts: sysId
            ? ir.groundingContracts.map((g) => ({
                ...g,
                evidence: g.evidence.map((ref) => compact({ ...ref, system: sysId, tool: toolName, entity: undefined, field: undefined })),
              }))
            : [],
          toolContracts: toolName ? ir.toolContracts.map((c) => ({ ...c, tool: toolName })) : [],
          refusalPolicies: ir.refusalPolicies.map((p) => ({ ...p, trigger: compact({ ...p.trigger, entity: undefined }) })),
          escalationPolicies: ir.escalationPolicies.map((p) => ({ ...p, trigger: compact({ ...p.trigger, entity: undefined }) })),
          errorPaths: ir.errorPaths.map((e) => {
            const { toolOverrides, ...rest } = e;
            return toolName && toolOverrides
              ? { ...rest, toolOverrides: { [toolName]: Object.values(toolOverrides)[0] } }
              : rest;
          }),
        };
        const result = await compileConcepts(renderIr(clean));
        expect(result.errors).toEqual([]);
      }),
      { numRuns: 60 },
    );
  });
});
