// Compiler front-end contract: a real catalog spec lowers to a schema-valid
// graph whose node counts trace 1:1 to the contract, and the whole compile
// is deterministic (same envelope → deep-equal graph, same sourceHash).
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { compileBehavioralGraph } from "./compile-from-agent-spec.mjs";
import { validateBehavioralGraph } from "./graph.mjs";
import { isDxError } from "@ge/std/dx-error";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "benefits-enrollment.spec.json");
const envelope = () => JSON.parse(readFileSync(FIXTURE, "utf8"));

test("compiles the benefits-enrollment fixture into a schema-valid graph", () => {
  const graph = compileBehavioralGraph(envelope(), { sourcePath: FIXTURE });
  const result = validateBehavioralGraph(graph);
  expect(result.issues).toEqual([]);
  expect(result.ok).toBe(true);
  expect(graph.subject.agentId).toBe("help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr");
  expect(graph.subject.source).toBe("agent-spec");
  expect(graph.subject.sourcePath).toBe(FIXTURE);
  expect(graph.subject.sourceHash).toMatch(/^[0-9a-f]{64}$/);
});

test("capability, tool, and authority counts trace to the contract", () => {
  const input = envelope();
  const contract = input.generationSpec.behaviorContract;
  const graph = compileBehavioralGraph(input, { sourcePath: FIXTURE });
  const expectedCapabilities =
    contract.inScope.length + contract.outOfScope.length + (contract.answerableQueries?.length ?? 0);
  expect(graph.capabilities).toHaveLength(expectedCapabilities);
  expect(graph.capabilities.filter((cap) => cap.kind === "in_scope")).toHaveLength(contract.inScope.length);
  expect(graph.capabilities.filter((cap) => cap.kind === "out_of_scope")).toHaveLength(contract.outOfScope.length);
  expect(graph.tools).toHaveLength(contract.toolIntents.length);
  expect(graph.authority).toHaveLength(contract.evidenceRequirements.length);
});

test("action/notification intents become guarded writes; queries stay reads", () => {
  const input = envelope();
  const graph = compileBehavioralGraph(input, { sourcePath: FIXTURE });
  const byName = new Map(graph.tools.map((tool) => [tool.toolName, tool]));
  for (const intent of input.generationSpec.behaviorContract.toolIntents) {
    const tool = byName.get(intent.name);
    const isWrite = intent.kind === "action" || intent.kind === "notification";
    expect(tool.operation).toBe(isWrite ? "write" : "read");
    expect(tool.requiresConfirmation).toBe(isWrite);
    expect(tool.requiresIdempotency).toBe(isWrite);
  }
});

test("authority edges carry the requirement's source system and require citation", () => {
  const input = envelope();
  const graph = compileBehavioralGraph(input, { sourcePath: FIXTURE });
  input.generationSpec.behaviorContract.evidenceRequirements.forEach((requirement, index) => {
    const edge = graph.authority[index];
    expect(edge.claim).toBe(requirement.claim);
    expect(edge.sourceSystemId).toBe(requirement.sourceSystemIds[0]);
    expect(edge.citationRequired).toBe(true);
    expect(edge.claimId.startsWith("auth-")).toBe(true);
  });
});

test("emits the fixed persona set and one degraded world per source system", () => {
  const input = envelope();
  const graph = compileBehavioralGraph(input, { sourcePath: FIXTURE });
  expect(graph.personas.map((persona) => persona.id)).toEqual([
    "persona-normal",
    "persona-confused",
    "persona-impatient",
    "persona-expert",
    "persona-unauthorized",
  ]);
  const worldIds = graph.worlds.map((world) => world.id);
  expect(worldIds).toContain("world-healthy");
  expect(worldIds).toContain("world-stale");
  expect(worldIds).toContain("world-conflicting");
  const degraded = worldIds.filter((id) => id.endsWith("-degraded"));
  expect(degraded).toHaveLength(input.generationSpec.sourceSystems.length);
});

test("compile is deterministic: two runs are deep-equal with the same hash", () => {
  const first = compileBehavioralGraph(envelope(), { sourcePath: FIXTURE });
  const second = compileBehavioralGraph(envelope(), { sourcePath: FIXTURE });
  expect(second.subject.sourceHash).toBe(first.subject.sourceHash);
  expect(JSON.stringify(second)).toBe(JSON.stringify(first));
});

test("rejects an envelope without a behavior contract with a DxError", () => {
  let thrown;
  try {
    compileBehavioralGraph({ id: "x", generationSpec: {} });
  } catch (error) {
    thrown = error;
  }
  expect(isDxError(thrown)).toBe(true);
  expect(thrown.fix).toContain("behaviorContract");
});
