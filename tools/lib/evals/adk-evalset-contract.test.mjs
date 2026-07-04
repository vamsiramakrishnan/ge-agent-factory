// ADK emitter contract: the emitted evalset must be consumable by the same
// normalizeEvalset()/loadEvalset() path every live surface uses, with case
// ids intact and GE-owned metadata riding as an unknown-to-ADK field that
// round-trips untouched (raw is preserved on the normalized shape).
import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { emitAdkEvalset, writeAdkEvalset } from "@ge/evalkit/emitters";
import { compileBehavioralSuite } from "@ge/evalkit/compiler";
import { normalizeEvalset, loadEvalset } from "./evalset.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "packages", "evalkit", "src", "fixtures", "benefits-enrollment.spec.json");
const envelope = JSON.parse(readFileSync(FIXTURE, "utf8"));
const { graph, selection } = compileBehavioralSuite(envelope, { sourcePath: FIXTURE });

test("emitted evalset loads cleanly through normalizeEvalset", () => {
  const evalset = emitAdkEvalset(graph, selection.selected, { evalSetId: "benefits-behavioral" });
  const normalized = normalizeEvalset(evalset);
  expect(normalized.id).toBe("benefits-behavioral");
  expect(normalized.cases).toHaveLength(selection.selected.length);
  // Every turn carries user text — the property live driving depends on.
  for (const kase of normalized.cases) {
    for (const turn of kase.turns) expect(turn.user.length).toBeGreaterThan(0);
  }
});

test("eval ids and turn text match the selected cases exactly", () => {
  const evalset = emitAdkEvalset(graph, selection.selected);
  expect(evalset.evalSetId).toBe(`${graph.subject.agentId}-behavioral`);
  expect(evalset.evalCases.map((kase) => kase.evalId)).toEqual(selection.selected.map((kase) => kase.id));
  selection.selected.forEach((kase, index) => {
    const emitted = evalset.evalCases[index];
    expect(emitted.conversation.map((invocation) => invocation.userContent.parts[0].text)).toEqual(
      kase.turns.map((turn) => turn.user),
    );
  });
});

test("geMetadata carries the behavioral context and survives normalization on raw", () => {
  const evalset = emitAdkEvalset(graph, selection.selected);
  const normalized = normalizeEvalset(evalset);
  normalized.cases.forEach((kase, index) => {
    // normalizeEvalset does not understand geMetadata (unknown field) — the
    // round-trip policy keeps it reachable verbatim via raw.
    const metadata = kase.raw.geMetadata;
    const source = selection.selected[index];
    expect(metadata.capabilityId).toBe(source.capabilityId);
    expect(metadata.personaId).toBe(source.personaId);
    expect(metadata.worldId).toBe(source.worldId);
    expect(metadata.intent).toBe(source.intent);
    expect(metadata.coverage).toEqual(source.coverage);
    expect(metadata.expected).toEqual(source.expected);
  });
});

test("writeAdkEvalset persists a file loadEvalset accepts", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-adk-emit-"));
  const path = join(dir, "behavioral.evalset.json");
  const receipt = writeAdkEvalset(path, graph, selection.selected, { evalSetId: "on-disk" });
  expect(receipt.caseCount).toBe(selection.selected.length);
  const loaded = loadEvalset(path);
  expect(loaded.id).toBe("on-disk");
  expect(loaded.cases.map((kase) => kase.id)).toEqual(selection.selected.map((kase) => kase.id));
});
