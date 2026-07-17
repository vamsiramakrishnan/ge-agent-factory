// Tests for the eval mutation-testing harness.
//
// Two layers:
//   • Integration — drive the REAL offline proof (proveLive) over the
//     checked-in benefits cassette, proving each declared guard has teeth and
//     that missing guards surface as coverage gaps.
//   • Discrimination — inject a proof stub that enforces ONLY response_match,
//     proving the harness correctly reports the tool/citation mutants as
//     surviving (ornamental) rather than always reporting green kills.
import { test, expect, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runEvalMutants, readExpectations, planMutants, untestedGuards } from "./harness.mjs";
import {
  dropRequiredTool,
  injectForbiddenTool,
  stripCitations,
  replaceRequiredCitation,
  corruptAnswer,
  cassetteInvocationTools,
  cassetteHasCitations,
  toNdjson,
  toolNameOf,
} from "./cassette-mutations.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const EVALSET = join(HERE, "fixtures/benefits.evalset.json");
const UNDERGUARDED = join(HERE, "fixtures/benefits-underguarded.evalset.json");
const TOOLGAP = join(HERE, "fixtures/benefits-toolgap.evalset.json");
const CASSETTE = join(HERE, "../live/fixtures/success.ndjson");

function records() {
  return readFileSync(CASSETTE, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
}

describe("cassette mutation operators", () => {
  test("dropRequiredTool removes only the named tool and does not mutate input", () => {
    const before = records();
    const after = dropRequiredTool(before, "lookup_life_events");
    expect(cassetteInvocationTools(after)).toEqual(["check_enrollment_window"]);
    expect(cassetteInvocationTools(before)).toContain("lookup_life_events"); // input untouched
  });

  test("injectForbiddenTool adds a tool the cassette never called", () => {
    const after = injectForbiddenTool(records(), "submit_enrollment_change");
    expect(cassetteInvocationTools(after)).toContain("submit_enrollment_change");
  });

  test("stripCitations removes all grounding references", () => {
    expect(cassetteHasCitations(records())).toBe(true);
    expect(cassetteHasCitations(stripCitations(records()))).toBe(false);
  });

  test("replaceRequiredCitation preserves grounding but removes the required source", () => {
    const required = "projects/demo/locations/global/dataStores/benefits/documents/qle-policy";
    const after = replaceRequiredCitation(records(), required);
    expect(cassetteHasCitations(after)).toBe(true);
    expect(JSON.stringify(after)).not.toContain(`\"document\":\"${required}\"`);
    expect(JSON.stringify(after)).toContain("mutant://unrelated/");
  });

  test("replaceRequiredCitation also matches a required URI", () => {
    const required = "gs://benefits/policies/qle.pdf";
    const input = records();
    const reference = input
      .flatMap((record) => record.json?.answer?.replies || [])
      .flatMap((reply) => reply.groundedContent?.textGroundingMetadata?.references || [])[0];
    reference.documentMetadata.document = "projects/demo/documents/policy";
    reference.documentMetadata.uri = required;
    const after = replaceRequiredCitation(input, required);
    expect(JSON.stringify(after)).not.toContain(required);
    expect(JSON.stringify(after)).toContain("mutant://unrelated/");
  });

  test("toolNameOf normalizes string and object tool forms", () => {
    expect(toolNameOf("t")).toBe("t");
    expect(toolNameOf({ tool: "t" })).toBe("t");
    expect(toolNameOf({ name: "t" })).toBe("t");
  });

  test("dropRequiredTool handles object-form invocationTools", () => {
    const objForm = records().map((r) =>
      r.type === "chunk" && Array.isArray(r.json?.invocationTools)
        ? { ...r, json: { ...r.json, invocationTools: r.json.invocationTools.map((t) => ({ tool: t })) } }
        : r,
    );
    expect(cassetteInvocationTools(objForm)).toContain("lookup_life_events");
    expect(cassetteInvocationTools(dropRequiredTool(objForm, "lookup_life_events"))).not.toContain("lookup_life_events");
  });

  test("corruptAnswer replaces grounded answer text", () => {
    const after = corruptAnswer(records());
    const text = JSON.stringify(after);
    expect(text).toContain("Unrelated placeholder");
    expect(text).not.toContain("qualifying life event");
  });

  test("operators are deterministic (byte-identical across runs)", () => {
    expect(toNdjson(dropRequiredTool(records(), "lookup_life_events"))).toBe(
      toNdjson(dropRequiredTool(records(), "lookup_life_events")),
    );
  });
});

describe("expectation reading + planning", () => {
  test("readExpectations unions declared guards across cases", () => {
    const expected = readExpectations(JSON.parse(readFileSync(EVALSET, "utf8")));
    expect(expected.mustCall.sort()).toEqual(["check_enrollment_window", "lookup_life_events"]);
    expect(expected.mustNotCall).toEqual(["submit_enrollment_change"]);
    expect(expected.mustCite.length).toBe(1);
    expect(expected.hasReference).toBe(true);
  });

  test("planMutants emits one mutant per declared expectation", () => {
    const expected = readExpectations(JSON.parse(readFileSync(EVALSET, "utf8")));
    const plan = planMutants(expected);
    // 2 mustCall + 1 mustNotCall + citation presence + concrete citation
    // identity + 1 reference
    expect(plan.length).toBe(6);
    expect(plan.map((m) => m.id)).toContain(
      "replace_required_citation:projects/demo/locations/global/dataStores/benefits/documents/qle-policy",
    );
    expect(plan.map((m) => m.metric)).toContain("tool_trajectory");
    expect(plan.map((m) => m.metric)).toContain("grounding_citations");
    expect(plan.map((m) => m.metric)).toContain("response_match");
  });

  test("untestedGuards flags missing forbidden-tool and citation guards", () => {
    const expected = readExpectations(JSON.parse(readFileSync(UNDERGUARDED, "utf8")));
    const gaps = untestedGuards(expected, records());
    const guards = gaps.map((g) => g.guard).sort();
    expect(guards).toEqual(["mustCite", "mustNotCall"]);
  });

  test("untestedGuards exposes logical citation ids as presence-only", () => {
    const gaps = untestedGuards(
      { mustCall: ["lookup"], mustNotCall: ["write"], mustCite: ["claim-policy"], hasReference: false },
      records(),
    );
    expect(gaps.map((gap) => gap.guard)).toEqual(["mustCiteIdentity"]);
  });
});

describe("integration — real offline proof", () => {
  test("a fully-guarded evalset kills every mutant by its intended guard", async () => {
    const result = await runEvalMutants({ evalset: EVALSET, cassette: CASSETTE });
    expect(result.baseline.passed).toBe(true);
    expect(result.score.generated).toBe(6);
    expect(result.score.survived).toBe(0);
    expect(result.ornamental).toBe(false);
    expect(result.mutants.every((m) => m.killedByIntendedGuard)).toBe(true);
    expect(result.gaps.length).toBe(0);
  }, 30000);

  test("an under-guarded evalset kills its declared mutants but reports coverage gaps", async () => {
    const result = await runEvalMutants({ evalset: UNDERGUARDED, cassette: CASSETTE });
    expect(result.baseline.passed).toBe(true);
    expect(result.ornamental).toBe(false); // its declared guards (two mustCall tools) have teeth
    expect(result.survived.length).toBe(0);
    expect(result.gaps.map((g) => g.guard).sort()).toEqual(["mustCite", "mustNotCall"]);
  }, 30000);

  test("regression: a single required tool now has teeth under replay (dropping it fails)", async () => {
    // Before the prove-live fix, dropping the sole required tool left a
    // zero-tool transcript that degraded to "unavailable" (a pass). Under
    // cassette replay that is now authoritative → the drop FAILS, so the
    // single-tool case is no longer ornamental.
    const result = await runEvalMutants({ evalset: TOOLGAP, cassette: CASSETTE });
    expect(result.baseline.passed).toBe(true);
    expect(result.ornamental).toBe(false);
    expect(result.mutants.find((m) => m.id === "drop_required_tool:lookup_life_events").killed).toBe(true);
    // the citation guard on the same case also bites
    expect(result.mutants.find((m) => m.id === "strip_citations").killed).toBe(true);
  }, 30000);
});

describe("discrimination — a proof that ignores tool/citation guards", () => {
  // Stub proof: enforces ONLY response_match (detects the corruption
  // sentinel), ignoring tool_trajectory and grounding_citations entirely.
  function stubProveLive(_cfg, { cassette }) {
    const corrupted = readFileSync(cassette, "utf8").includes("Unrelated placeholder");
    return {
      status: corrupted ? "failed" : "passed",
      verdict: { passed: !corrupted, blockers: [] },
      cases: [{ id: "x", ok: !corrupted, metrics: corrupted ? [{ metric: "response_match", status: "fail" }] : [] }],
    };
  }

  test("tool and citation mutants survive → flagged ornamental", async () => {
    const result = await runEvalMutants({ evalset: EVALSET, cassette: CASSETTE }, { proveLiveImpl: stubProveLive });
    expect(result.ornamental).toBe(true);
    // drop×2 + inject×1 + strip×1 + replace-citation×1 survive;
    // corrupt_answer is killed by response_match.
    expect(result.score.survived).toBe(5);
    const survivedGuards = result.survived.map((m) => m.guard).sort();
    expect(survivedGuards).toEqual(["mustCall", "mustCall", "mustCite", "mustCite", "mustNotCall"]);
    expect(result.mutants.find((m) => m.id === "corrupt_answer").killed).toBe(true);
  });
});
