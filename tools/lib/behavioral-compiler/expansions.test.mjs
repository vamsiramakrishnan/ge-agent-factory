// Expansion contract: every graph dimension yields its full case family,
// every case is well-formed (unique id, valid intent, tagged coverage), and
// worlds/expectations line up with what each case family is fishing for.
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBehavioralGraph } from "./compile-from-agent-spec.mjs";
import { expandConversationCases } from "./expansions.mjs";
import { ConversationCaseSchema } from "./graph.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "benefits-enrollment.spec.json");
const envelope = JSON.parse(readFileSync(FIXTURE, "utf8"));
const graph = compileBehavioralGraph(envelope, { sourcePath: FIXTURE });
const pool = graph.conversations;

test("every case parses as a ConversationCase with unique id and tagged coverage", () => {
  const ids = new Set();
  for (const kase of pool) {
    const parsed = ConversationCaseSchema.safeParse(kase);
    expect(parsed.success).toBe(true);
    expect(ids.has(kase.id)).toBe(false);
    ids.add(kase.id);
    expect(kase.coverage.length).toBeGreaterThanOrEqual(1);
    expect(kase.turns.length).toBeGreaterThanOrEqual(1);
    expect(kase.turns.length).toBeLessThanOrEqual(3);
  }
});

test("each in-scope capability expands into its five intents", () => {
  for (const capability of graph.capabilities.filter((cap) => cap.kind === "in_scope")) {
    const intents = pool
      .filter((kase) => kase.coverage.includes(`capability:${capability.id}`) && kase.id.startsWith(`case-${capability.id}-`))
      .map((kase) => kase.intent)
      .sort();
    expect(intents).toEqual(["clarification", "contradiction", "failure", "happy_path", "interruption"]);
  }
});

test("each out-of-scope capability gets a mustRefuse refusal case", () => {
  for (const capability of graph.capabilities.filter((cap) => cap.kind === "out_of_scope")) {
    const cases = pool.filter((kase) => kase.coverage.includes(`refusal:${capability.id}`));
    expect(cases).toHaveLength(1);
    expect(cases[0].intent).toBe("refusal");
    expect(cases[0].expected.mustRefuse).toBe(true);
  }
});

test("each escalation rule gets a mustEscalate case", () => {
  const escalations = pool.filter((kase) => kase.coverage.some((tag) => tag.startsWith("escalation:")));
  expect(escalations).toHaveLength(envelope.generationSpec.behaviorContract.escalationRules.length);
  for (const kase of escalations) expect(kase.expected.mustEscalate).toBe(true);
});

test("every write tool expands into its five write-behavior cases", () => {
  const writeTools = graph.tools.filter((tool) => tool.operation === "write");
  expect(writeTools.length).toBeGreaterThan(0);
  for (const tool of writeTools) {
    const cases = pool.filter((kase) => kase.coverage.includes(`write_tool:${tool.toolName}`));
    expect(cases).toHaveLength(5);
    for (const kase of cases) expect(kase.riskWeight).toBe(3);
    const byVariant = (variant) => cases.find((kase) => kase.id.endsWith(`-${variant}`));
    expect(byVariant("confirmation").expected.mustCall).toEqual([tool.toolName]);
    expect(byVariant("cancellation").expected.mustNotCall).toEqual([tool.toolName]);
    expect(byVariant("permission-denied").expected.mustRefuse).toBe(true);
    expect(byVariant("partial-failure").intent).toBe("failure");
    expect(byVariant("duplicate")).toBeDefined();
  }
});

test("every authority edge expands into citation, stale, conflicting, and trap cases", () => {
  for (const edge of graph.authority) {
    const cases = pool.filter((kase) => kase.coverage.includes(`claim:${edge.claimId}`));
    expect(cases).toHaveLength(4);
    for (const kase of cases) expect(kase.riskWeight).toBe(2);
    const citation = cases.find((kase) => kase.id.endsWith("-citation"));
    expect(citation.expected.mustCite).toEqual([edge.claimId]);
    // The fabrication trap runs in a degraded world and demands a refusal.
    const trap = cases.find((kase) => kase.id.endsWith("-fabricated-citation"));
    expect(trap.expected.mustRefuse).toBe(true);
    expect(trap.worldId).toContain("degraded");
  }
});

test("golden evals seed happy-path cases with the eval prompt and tool calls", () => {
  const goldens = envelope.generationSpec.behaviorContract.goldenEvals;
  const cases = pool.filter((kase) => kase.coverage.some((tag) => tag.startsWith("golden:")));
  expect(cases).toHaveLength(goldens.length);
  goldens.forEach((golden, index) => {
    const kase = cases.find((entry) => entry.coverage.includes(`golden:${index + 1}`));
    expect(kase.intent).toBe("happy_path");
    expect(kase.turns[0].user).toBe(golden.prompt);
    expect(kase.expected.mustCall).toEqual(golden.expectedToolCalls);
  });
});

test("expansion is deterministic", () => {
  const parts = {
    capabilities: graph.capabilities,
    authority: graph.authority,
    tools: graph.tools,
    personas: graph.personas,
    worlds: graph.worlds,
    escalationRules: envelope.generationSpec.behaviorContract.escalationRules,
    goldenEvals: envelope.generationSpec.behaviorContract.goldenEvals,
  };
  expect(JSON.stringify(expandConversationCases(parts))).toBe(JSON.stringify(expandConversationCases(parts)));
});
