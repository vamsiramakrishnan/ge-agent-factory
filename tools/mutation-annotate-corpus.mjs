#!/usr/bin/env node
/**
 * One-sweep corpus migration to ge.mutation-model.v1: annotate every
 * simulator pack's workflows.json write handlers with semantics and
 * compensation (inferred from keys the
 * handlers already carry — annotateWorkflows preserves any hand-authored
 * values). Idempotent: a second run is a no-op. Dry-run by default; --write
 * persists. See docs/plans/real-system-twins/phase-1-mutation-model.md.
 *
 *   node tools/mutation-annotate-corpus.mjs [--write]
 */
import { randomUUID } from "node:crypto";
import { open, readFile, rename, unlink } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { annotateWorkflowsText } from "@ge/byo-systems/mutation-model";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const write = process.argv.includes("--write");

async function atomicWrite(path, text) {
  const tempPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
  try {
    const file = await open(tempPath, "wx");
    try {
      await file.writeFile(text, "utf8");
      await file.sync();
    } finally {
      await file.close();
    }
    await rename(tempPath, path);
  } finally {
    await unlink(tempPath).catch((error) => {
      if (error?.code !== "ENOENT") throw error;
    });
  }
}

const registry = JSON.parse(await readFile(join(REPO_ROOT, "apps", "factory", "simulator-systems", "registry.json"), "utf8"));
let changed = 0;
let unchanged = 0;
for (const sim of registry.simulators || []) {
  if (!sim.workflowsPath) continue;
  const workflowsPath = join(REPO_ROOT, sim.workflowsPath);
  const before = await readFile(workflowsPath, "utf8");
  const tools = sim.toolsPath
    ? JSON.parse(await readFile(join(REPO_ROOT, sim.toolsPath), "utf8"))
    : {};
  const annotated = annotateWorkflowsText(before, tools);
  if (!annotated.changed) {
    unchanged++;
    continue;
  }
  changed++;
  console.log(`${write ? "annotated" : "would annotate"} ${sim.id} (${Object.keys(annotated.workflows.toolHandlers || {}).length} handler(s))`);
  if (write) await atomicWrite(workflowsPath, annotated.text);
}
console.log(`${changed} pack(s) ${write ? "annotated" : "to annotate"}, ${unchanged} already conformant`);
