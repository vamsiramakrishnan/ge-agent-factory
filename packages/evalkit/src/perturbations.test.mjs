// Perturbation contract: variants are deterministic, correctly identified
// (ids/tags), grading fields carry over untouched, and typo injection never
// mangles entity identifiers.
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBehavioralGraph } from "./compile-from-agent-spec.mjs";
import { ConversationCaseSchema } from "./graph.mjs";
import { perturbCase, expandWithPerturbations, fnv1a, PERTURBATION_KINDS } from "./perturbations.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "benefits-enrollment.spec.json");
const envelope = JSON.parse(readFileSync(FIXTURE, "utf8"));
const graph = compileBehavioralGraph(envelope, { sourcePath: FIXTURE });

const PARENT = {
  id: "case-example-happy_path",
  capabilityId: "cap-example",
  personaId: "persona-normal",
  worldId: "world-healthy",
  intent: "happy_path",
  riskWeight: 2,
  turns: [{ user: "Retrieve pending benefits exceptions for employee EMP101 and reconcile the wellness deduction." }],
  expected: { mustCall: ["query_sap_s_4hana_fi_employees"] },
  coverage: ["capability:cap-example", "intent:happy_path"],
};

test("fnv1a is a stable 32-bit hash", () => {
  expect(fnv1a("case-x#1")).toBe(fnv1a("case-x#1"));
  expect(fnv1a("case-x#1")).not.toBe(fnv1a("case-x#2"));
  expect(fnv1a("")).toBe(0x811c9dc5);
});

test("perturbCase is deterministic: same input, byte-identical output twice", () => {
  const first = perturbCase(PARENT, { variants: 4 });
  const second = perturbCase(PARENT, { variants: 4 });
  expect(JSON.stringify(first)).toBe(JSON.stringify(second));
});

test("variant ids, count, and tags: <id>.pN plus perturbation:<kind> on top of parent coverage", () => {
  const variants = perturbCase(PARENT, { variants: 3 });
  expect(variants).toHaveLength(3);
  variants.forEach((variant, index) => {
    expect(variant.id).toBe(`${PARENT.id}.p${index + 1}`);
    for (const tag of PARENT.coverage) expect(variant.coverage).toContain(tag);
    const kindTags = variant.coverage.filter((tag) => tag.startsWith("perturbation:"));
    expect(kindTags).toHaveLength(1);
    expect(PERTURBATION_KINDS).toContain(kindTags[0].slice("perturbation:".length));
  });
  // Up to four variants of the same parent rotate through distinct kinds.
  const four = perturbCase(PARENT, { variants: 4 });
  const kinds = four.map((variant) => variant.coverage.at(-1));
  expect(new Set(kinds).size).toBe(4);
});

test("grading fields carry over unchanged; only turn text moves", () => {
  for (const variant of perturbCase(PARENT, { variants: 4 })) {
    expect(variant.expected).toEqual(PARENT.expected);
    expect(variant.capabilityId).toBe(PARENT.capabilityId);
    expect(variant.personaId).toBe(PARENT.personaId);
    expect(variant.worldId).toBe(PARENT.worldId);
    expect(variant.intent).toBe(PARENT.intent);
    expect(variant.riskWeight).toBe(PARENT.riskWeight);
    expect(variant.turns).toHaveLength(PARENT.turns.length);
    expect(ConversationCaseSchema.safeParse(variant).success).toBe(true);
  }
  // The parent object itself is never mutated.
  expect(PARENT.turns[0].user).toContain("EMP101");
  expect(PARENT.coverage).toHaveLength(2);
});

test("typo injection changes phrasing but never entity identifiers", () => {
  const variants = perturbCase(PARENT, { variants: 4 });
  const typo = variants.find((variant) => variant.coverage.includes("perturbation:typo"));
  expect(typo).toBeDefined();
  expect(typo.turns[0].user).not.toBe(PARENT.turns[0].user);
  expect(typo.turns[0].user).toContain("EMP101"); // entity id untouched
});

test("register/distractor/compound wrap the original ask instead of rewriting it away", () => {
  const variants = perturbCase(PARENT, { variants: 4 });
  const byKind = (kind) => variants.find((variant) => variant.coverage.includes(`perturbation:${kind}`));
  expect(byKind("register_shift").turns[0].user).toContain(PARENT.turns[0].user);
  expect(byKind("distractor").turns[0].user).toContain(PARENT.turns[0].user);
  expect(byKind("compound_ask").turns.at(-1).user.startsWith(PARENT.turns.at(-1).user)).toBe(true);
});

test("expandWithPerturbations keeps each parent immediately followed by its variants", () => {
  const cases = graph.conversations.slice(0, 5);
  const expanded = expandWithPerturbations(cases, { variants: 2 });
  expect(expanded).toHaveLength(cases.length * 3);
  cases.forEach((parent, index) => {
    expect(expanded[index * 3].id).toBe(parent.id);
    expect(expanded[index * 3 + 1].id).toBe(`${parent.id}.p1`);
    expect(expanded[index * 3 + 2].id).toBe(`${parent.id}.p2`);
  });
  expect(JSON.stringify(expandWithPerturbations(cases, { variants: 2 }))).toBe(JSON.stringify(expanded));
});

test("every variant of every real pool case stays schema-valid", () => {
  const expanded = expandWithPerturbations(graph.conversations, { variants: 2 });
  for (const kase of expanded) expect(ConversationCaseSchema.safeParse(kase).success).toBe(true);
  const ids = new Set(expanded.map((kase) => kase.id));
  expect(ids.size).toBe(expanded.length);
});
