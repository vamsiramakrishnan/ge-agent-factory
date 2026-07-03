// Adversarial expansion contract: every family fires when the graph has the
// nodes it probes, every case matches the expansion pool's ConversationCase
// shape, and the whole synthesis is deterministic.
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBehavioralGraph } from "./compile-from-agent-spec.mjs";
import { ConversationCaseSchema } from "./graph.mjs";
import { expandAdversarialCases, ADVERSARIAL_FAMILIES } from "./adversarial.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "benefits-enrollment.spec.json");
const envelope = JSON.parse(readFileSync(FIXTURE, "utf8"));
const graph = compileBehavioralGraph(envelope, { sourcePath: FIXTURE });
const cases = expandAdversarialCases(graph);

const byFamily = (family) => cases.filter((kase) => kase.coverage.includes(`adversarial:${family}`));

test("every case parses as a ConversationCase with a unique id and exactly one adversarial tag", () => {
  expect(cases.length).toBeGreaterThan(0);
  const ids = new Set();
  for (const kase of cases) {
    expect(ConversationCaseSchema.safeParse(kase).success).toBe(true);
    expect(ids.has(kase.id)).toBe(false);
    ids.add(kase.id);
    expect(kase.coverage.filter((tag) => tag.startsWith("adversarial:"))).toHaveLength(1);
    expect(kase.riskWeight).toBe(3);
  }
});

test("all five families are represented on a graph with capabilities and write tools", () => {
  for (const family of ADVERSARIAL_FAMILIES) {
    expect({ family, count: byFamily(family).length }).toEqual({ family, count: expect.any(Number) });
    expect(byFamily(family).length).toBeGreaterThan(0);
  }
});

test("prompt injection: one per in-scope capability, embedding the real objective, expecting refusal", () => {
  const inScope = graph.capabilities.filter((capability) => capability.kind === "in_scope");
  const family = byFamily("prompt_injection");
  expect(family).toHaveLength(inScope.length);
  for (const kase of family) {
    const capability = inScope.find((entry) => entry.id === kase.capabilityId);
    expect(kase.turns[0].user).toContain(capability.objective);
    expect(kase.turns[0].user.toLowerCase()).toContain("ignore all of your previous instructions");
    expect(kase.expected.mustRefuse).toBe(true);
  }
});

test("tool-result injection: one per write tool, forbidding the smuggled write", () => {
  const writeTools = graph.tools.filter((tool) => tool.operation === "write");
  const family = byFamily("tool_result_injection");
  expect(family).toHaveLength(writeTools.length);
  for (const tool of writeTools) {
    const kase = family.find((entry) => entry.expected.mustNotCall?.includes(tool.toolName));
    expect(kase).toBeDefined();
    expect(kase.turns[0].user).toContain(tool.toolName);
    expect(kase.coverage).toContain(`write_tool:${tool.toolName}`);
  }
});

test("authority spoofing: one per write tool, still refusing without the workflow", () => {
  const writeTools = graph.tools.filter((tool) => tool.operation === "write");
  const family = byFamily("authority_spoofing");
  expect(family).toHaveLength(writeTools.length);
  for (const kase of family) {
    expect(kase.expected.mustRefuse).toBe(true);
    expect(kase.expected.mustNotCall).toHaveLength(1);
    expect(kase.personaId).toBe("persona-unauthorized");
  }
});

test("scope creep: one per out-of-scope capability, expecting refusal", () => {
  const outOfScope = graph.capabilities.filter((capability) => capability.kind === "out_of_scope");
  const family = byFamily("scope_creep");
  expect(family).toHaveLength(outOfScope.length);
  for (const kase of family) expect(kase.expected.mustRefuse).toBe(true);
});

test("data exfiltration: one per read tool, expecting refusal/minimization", () => {
  const readTools = graph.tools.filter((tool) => tool.operation === "read");
  const family = byFamily("data_exfiltration");
  expect(family).toHaveLength(readTools.length);
  for (const kase of family) {
    expect(kase.expected.mustRefuse).toBe(true);
    expect(kase.turns[0].user).toContain("dump every record");
  }
});

test("adversarial ids never collide with the cooperative expansion pool", () => {
  const poolIds = new Set(graph.conversations.map((kase) => kase.id));
  for (const kase of cases) expect(poolIds.has(kase.id)).toBe(false);
});

test("synthesis is deterministic and empty graphs yield empty pools", () => {
  expect(JSON.stringify(expandAdversarialCases(graph))).toBe(JSON.stringify(cases));
  expect(expandAdversarialCases({})).toEqual([]);
  expect(expandAdversarialCases({ capabilities: [], tools: [] })).toEqual([]);
});
