// spec-to-okf-golden.test.js
//
// Byte-parity ORACLE for the pure OKF bundle builder `buildBundle` exported by
// scripts/spec-to-okf.mjs. It calls buildBundle on a representative spec that
// exercises every concept kind (systems, tables, tools, workflow, documents,
// queries, tests, kpis, evals, plus slug-collision disambiguation) and asserts
// the returned concepts are byte-identical against a committed golden.
//
// This is a refactor safety net: extracting helpers out of spec-to-okf.mjs must
// keep buildBundle's output byte-for-byte identical. Run with: bun test.
//
// To (re)generate the golden after an INTENTIONAL change, run with:
//   GE_UPDATE_GOLDEN=1 bun test apps/factory/tests/spec-to-okf-golden.test.js

import { test, expect } from "bun:test";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildBundle } from "../scripts/spec-to-okf.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const GOLDEN_PATH = resolve(
  TEST_DIR,
  "fixtures",
  "spec-to-okf-golden",
  "concepts.golden.json",
);

// A representative spec that exercises every branch of buildBundle:
//   - persona/subtitle/department/title/kpis (root index)
//   - behaviorContract role/scope/escalation/refusal/evidence (playbook)
//   - sourceSystems with connections + owns (systems/)
//   - entities with string/object fields, primaryKey, values, required (tables/)
//   - toolIntents with requiredInputs/produces/evidence + slug collision (tools/)
//   - a sequential workflow with steps + tools (workflow/)
//   - generationSpec.documents (documents/ + citations)
//   - derived answerableQueries + goldenEvals (queries/, tests/, evals)
const SPEC = {
  id: "okf-golden-agent",
  title: "OKF Golden Agent",
  subtitle: "A representative spec for byte-parity testing.",
  persona: "Operations Analyst",
  department: "Finance",
  kpis: [
    { label: "Cycle time", before: "5 days", after: "1 day" },
    { label: "Manual touches", before: "12", after: "2" },
  ],
  architecture: {
    connections: [
      { system: "Core Ledger", description: "Primary ledger of record.", protocol: "rest" },
    ],
  },
  generationSpec: {
    sourceSystems: [
      {
        id: "core-ledger",
        name: "Core Ledger",
        protocol: "rest",
        resource: "ledger://core",
        localBacking: ["ledger.duckdb"],
        owns: ["GLEntry"],
      },
      { id: "notify-svc", name: "Notification Service" },
    ],
    entities: [
      {
        name: "GLEntry",
        sourceSystemId: "core-ledger",
        primaryKey: "entryId",
        fields: [
          { name: "entryId", type: "string", required: true },
          { name: "status", type: "enum", values: ["open", "closed"] },
          "rawNote",
        ],
      },
      { name: "Orphan" },
    ],
    documents: [
      {
        id: "controls-playbook",
        title: "Controls Playbook",
        type: "policy",
        description: "Internal controls reference.",
        anchors: ["section-3", "section-4"],
      },
    ],
    behaviorContract: {
      role: "Reconcile and close ledger periods.",
      primaryObjective: "Close the books accurately and on time.",
      inScope: ["Pull balances", "Reconcile entries"],
      outOfScope: ["Tax filing"],
      escalationRules: [
        { trigger: "Variance > 1%", action: "Notify manager", rationale: "Material threshold" },
      ],
      refusalRules: ["Never post without approval"],
      evidenceRequirements: ["Cite the GL entry id"],
      toolIntents: [
        {
          name: "query_core_ledger_gl",
          kind: "query",
          description: "Read GL entries.",
          sourceSystemId: "core-ledger",
          requiredInputs: ["period"],
          produces: ["balances"],
          evidenceEmitted: ["gl_entry"],
        },
        { name: "notify_manager", kind: "action", description: "underscore variant", sourceSystemId: "notify-svc" },
        { name: "notify-manager", kind: "action", description: "hyphen variant", sourceSystemId: "notify-svc" },
      ],
      workflow: {
        mode: "sequential",
        steps: [
          { id: "balance_pull", label: "Balance Pull", description: "Pull period balances.", tools: ["query_core_ledger_gl"] },
          { id: "reconcile", label: "Reconcile", tools: ["notify_manager", "notify-manager"] },
        ],
      },
      goldenEvals: [
        {
          id: "e2e-close",
          prompt: "Close the current period end-to-end.",
          mechanisms: ["query_core_ledger_gl"],
          expectedToolCalls: ["query_core_ledger_gl"],
          mustCiteDocuments: ["controls-playbook"],
          rubric: "Pulls balances and cites the controls playbook.",
        },
        "Plain string eval prompt.",
      ],
    },
  },
};

const TIMESTAMP = "2026-01-01T00:00:00.000Z";

async function fileExists(path) {
  return stat(path).then(() => true).catch(() => false);
}

test("buildBundle output is byte-identical to the committed golden", async () => {
  const concepts = buildBundle(SPEC, { timestamp: TIMESTAMP });
  const actual = JSON.stringify(concepts, null, 2);

  if (process.env.GE_UPDATE_GOLDEN === "1" || !(await fileExists(GOLDEN_PATH))) {
    await mkdir(dirname(GOLDEN_PATH), { recursive: true });
    await writeFile(GOLDEN_PATH, `${actual}\n`, "utf8");
  }

  const golden = await readFile(GOLDEN_PATH, "utf8");
  expect(actual).toBe(golden.replace(/\n$/, ""));
});

test("buildBundle is deterministic given a fixed timestamp", () => {
  const a = JSON.stringify(buildBundle(SPEC, { timestamp: TIMESTAMP }), null, 2);
  const b = JSON.stringify(buildBundle(SPEC, { timestamp: TIMESTAMP }), null, 2);
  expect(a).toBe(b);
});
