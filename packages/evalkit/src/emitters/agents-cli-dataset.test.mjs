// agents-cli dataset emitter: flat grading records with prompt/turns/
// expected/metadata per selected case; file form wraps as { cases }.
import { test, expect } from "bun:test";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { emitAgentsCliDataset, writeAgentsCliDataset } from "./agents-cli-dataset.mjs";
import { compileBehavioralSuite } from "../compile.mjs";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "benefits-enrollment.spec.json");
const envelope = JSON.parse(readFileSync(FIXTURE, "utf8"));
const { graph, selection } = compileBehavioralSuite(envelope, { sourcePath: FIXTURE });

test("emits one flat record per selected case", () => {
  const records = emitAgentsCliDataset(graph, selection.selected);
  expect(records).toHaveLength(selection.selected.length);
  records.forEach((record, index) => {
    const source = selection.selected[index];
    expect(record.id).toBe(source.id);
    expect(record.prompt).toBe(source.turns[0].user);
    expect(record.turns).toEqual(source.turns.map((turn) => turn.user));
    expect(record.expected).toEqual(source.expected);
    expect(record.metadata).toEqual({ coverage: source.coverage, intent: source.intent });
  });
});

test("records are newline-delimited-friendly (self-contained, single-line serializable)", () => {
  const records = emitAgentsCliDataset(graph, selection.selected);
  for (const record of records) {
    const line = JSON.stringify(record);
    expect(line.includes("\n")).toBe(false);
    expect(JSON.parse(line)).toEqual(record);
  }
});

test("writeAgentsCliDataset persists { cases } and round-trips", () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-agents-cli-emit-"));
  const path = join(dir, "dataset.json");
  const receipt = writeAgentsCliDataset(path, graph, selection.selected);
  expect(receipt.caseCount).toBe(selection.selected.length);
  const loaded = JSON.parse(readFileSync(path, "utf8"));
  expect(loaded.cases).toEqual(emitAgentsCliDataset(graph, selection.selected));
});
