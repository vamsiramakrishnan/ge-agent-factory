import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { link, mkdir, mkdtemp, readFile, readdir, rm, symlink, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  MUTATION_APPLY_LOCK_SCHEMA_VERSION,
  MUTATION_APPLY_LOCK_MAX_AGE_MS,
  MUTATION_MODEL_SCHEMA_VERSION,
  MUTATION_SEMANTICS,
  applyMutationProposal,
  annotateWorkflows,
  annotateWorkflowsText,
  buildMutationProposal,
  inferHandlerAnnotations,
  isWriteTool,
  validatePackMutations,
} from "./mutation-model.mjs";

const SCHEMA = {
  collections: {
    cases: { primaryKey: "case_id", fields: { case_id: "string", status: "enum:open|investigating|closed|escalated" } },
    approvals: { fields: { case_id: "string", state: "string" } },
    audit_events: { fields: {} },
  },
};
const TOOLS = {
  tools: [
    { name: "search_cases", inputSchema: { type: "object", properties: {} }, binding: { op: "search", collection: "cases" } },
    {
      name: "submit_case_update",
      inputSchema: {
        type: "object",
        properties: { case_id: { type: "string" }, status: { type: "string" }, idempotency_key: { type: "string" } },
      },
      binding: { op: "submit", collection: "cases", primaryKey: "case_id" },
    },
  ],
};
const HANDLER = {
  primitive: "state_machine",
  collection: "cases",
  primaryKey: "case_id",
  stateField: "status",
  transitions: { open: ["investigating", "closed"], investigating: ["closed", "escalated"] },
  approvalBlockers: [{ collection: "approvals", sourceRecordField: "case_id", states: ["pending"], blockedTargetStates: ["closed"] }],
};

async function makeRepoPack(prefix = "ge-mutation-", system = "crm") {
  const repoRoot = await mkdtemp(join(tmpdir(), prefix));
  const packDir = join(repoRoot, "apps", "factory", "simulator-systems", system);
  await mkdir(packDir, { recursive: true });
  return { repoRoot, packDir };
}

function proposalFor(baseWorkflowsText = null, system = "crm") {
  return buildMutationProposal({
    contract: {
      toolCatalog: { tools: TOOLS.tools },
      workflowCatalog: { id: `${system}.workflows`, version: 1, toolHandlers: { submit_case_update: HANDLER } },
    },
    system,
    source: { mode: "openapi" },
    baseWorkflowsText,
  });
}

const testHash = (text) => `sha256:${createHash("sha256").update(text).digest("hex")}`;

describe("inferHandlerAnnotations", () => {
  test("state machines infer state_transition; async infers async_job; bare create infers create", () => {
    expect(inferHandlerAnnotations(HANDLER).semantics).toBe("state_transition");
    expect(inferHandlerAnnotations({ async: true, stateField: "status" }).semantics).toBe("async_job");
    expect(inferHandlerAnnotations({}, { bindingOp: "create" }).semantics).toBe("create");
    expect(inferHandlerAnnotations({}).semantics).toBe("unmodeled");
  });

  test("hand-authored annotations win", () => {
    const a = inferHandlerAnnotations({ ...HANDLER, semantics: "unmodeled", compensation: "none" });
    expect(a).toEqual({ semantics: "unmodeled", compensation: "none" });
  });
});

describe("annotateWorkflows", () => {
  test("is pure, deterministic, and stamps the model version", () => {
    const workflows = { id: "crm.workflows", version: 1, toolHandlers: { submit_case_update: HANDLER } };
    const out1 = annotateWorkflows(workflows, TOOLS);
    const out2 = annotateWorkflows(workflows, TOOLS);
    expect(JSON.stringify(out1)).toBe(JSON.stringify(out2)); // byte-stable
    expect(workflows.toolHandlers.submit_case_update.semantics).toBeUndefined(); // input untouched
    expect(out1.mutationModel).toBe(MUTATION_MODEL_SCHEMA_VERSION);
    expect(out1.toolHandlers.submit_case_update).toMatchObject({
      semantics: "state_transition",
      compensation: "manual",
    });
  });

  test("annotating an already-annotated section is idempotent", () => {
    const workflows = { version: 1, toolHandlers: { submit_case_update: HANDLER } };
    const once = annotateWorkflows(workflows, TOOLS);
    expect(annotateWorkflows(once, TOOLS)).toEqual(once);
  });

  test("only runtime write handlers are annotated, without reformatting unrelated JSON", () => {
    const source = `{
  "version": 1,
  "toolHandlers": {
    "search_cases": { "collection": "cases", "compact": ["keep", "this"] },
    "submit_case_update": {
      "collection": "cases",
      "primaryKey": "case_id",
      "stateField": "status",
      "transitions": { "open": ["closed"] }
    }
  }
}\n`;
    const result = annotateWorkflowsText(source, TOOLS);
    expect(result.text).toContain('"compact": ["keep", "this"]');
    expect(result.workflows.toolHandlers.search_cases.semantics).toBeUndefined();
    expect(result.workflows.toolHandlers.submit_case_update.semantics).toBe("state_transition");
    expect(annotateWorkflowsText(result.text, TOOLS).changed).toBe(false);
  });
});

describe("validatePackMutations", () => {
  const annotated = () => annotateWorkflows({ version: 1, toolHandlers: { submit_case_update: HANDLER } }, TOOLS);

  test("an annotated pack with a closed state graph passes", () => {
    const result = validatePackMutations({ schema: SCHEMA, tools: TOOLS, workflows: annotated() });
    expect(result.problems).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.writeToolCount).toBe(1);
  });

  test("missing annotations fail with the exact contract violations", () => {
    const result = validatePackMutations({
      schema: SCHEMA,
      tools: TOOLS,
      workflows: { version: 1, mutationModel: MUTATION_MODEL_SCHEMA_VERSION, toolHandlers: { submit_case_update: HANDLER } },
    });
    expect(result.ok).toBe(false);
    expect(result.problems.join("\n")).toContain("semantics must be one of");
    expect(result.problems.join("\n")).toContain("compensation must be one of");
  });

  test("the workflows contract version and mutation model are mandatory", () => {
    const workflows = annotated();
    delete workflows.version;
    workflows.mutationModel = "ge.mutation-model.v0";
    const result = validatePackMutations({ schema: SCHEMA, tools: TOOLS, workflows });
    expect(result.problems.join("\n")).toContain("workflows.version must be a positive integer");
    expect(result.problems.join("\n")).toContain(`workflows.mutationModel must be ${MUTATION_MODEL_SCHEMA_VERSION}`);
  });

  test("a submit write tool with no handler is a silent dead write", () => {
    const result = validatePackMutations({
      schema: SCHEMA,
      tools: TOOLS,
      workflows: { version: 1, mutationModel: MUTATION_MODEL_SCHEMA_VERSION, toolHandlers: {} },
    });
    expect(result.problems.join("\n")).toContain("submit_case_update: write tool (op: submit) has no workflows.toolHandlers entry");
  });

  test("unknown collections in handler or approvalBlockers fail", () => {
    const workflows = annotateWorkflows(
      {
        version: 1,
        toolHandlers: {
          submit_case_update: {
            ...HANDLER,
            collection: "ghosts",
            approvalBlockers: [{ collection: "nope" }],
          },
        },
      },
      TOOLS,
    );
    const result = validatePackMutations({ schema: SCHEMA, tools: TOOLS, workflows });
    expect(result.problems.join("\n")).toContain('collection "ghosts" is not in schema.collections');
    expect(result.problems.join("\n")).toContain('approvalBlockers collection "nope" is not in schema.collections');
  });

  test("unmodeled is a warning, never a failure — the sweep's escape hatch", () => {
    const workflows = annotateWorkflows(
      { version: 1, toolHandlers: { submit_case_update: { collection: "cases", primaryKey: "case_id" } } },
      TOOLS,
    );
    // No stateField/transitions and no create binding -> unmodeled.
    const result = validatePackMutations({ schema: SCHEMA, tools: TOOLS, workflows });
    expect(result.ok).toBe(true);
    expect(result.warnings.join("\n")).toContain('"unmodeled"');
  });

  test("idempotency declarations use the runtime field and actual inputSchema", () => {
    const workflows = annotateWorkflows(
      { version: 1, toolHandlers: { submit_case_update: { ...HANDLER, idempotency: { keyFields: ["request_id"] } } } },
      TOOLS,
    );
    const result = validatePackMutations({ schema: SCHEMA, tools: TOOLS, workflows });
    expect(result.problems.join("\n")).toContain('runtime only honors idempotency key field "idempotency_key"');

    workflows.toolHandlers.submit_case_update.idempotency.keyFields = ["idempotency_key"];
    expect(validatePackMutations({ schema: SCHEMA, tools: TOOLS, workflows }).problems).toEqual([]);
  });

  test("handlers must link to a write tool with matching runtime binding fields", () => {
    const workflows = annotated();
    workflows.toolHandlers.search_cases = {
      ...HANDLER,
      semantics: "state_transition",
      compensation: "manual",
    };
    workflows.toolHandlers.submit_case_update.collection = "approvals";
    const result = validatePackMutations({ schema: SCHEMA, tools: TOOLS, workflows });
    expect(result.problems.join("\n")).toContain("search_cases: handler is linked to non-write tool");
    expect(result.problems.join("\n")).toContain("submit_case_update: handler.collection must match binding.collection");
  });

  test("transition edges stay inside a declared enum vocabulary", () => {
    const workflows = annotated();
    workflows.toolHandlers.submit_case_update.transitions.open.push("invented");
    const result = validatePackMutations({ schema: SCHEMA, tools: TOOLS, workflows });
    expect(result.problems.join("\n")).toContain('transition target "invented" is not in the declared state vocabulary');
  });

  test("submit_worker_change is a legacy runtime write, not an unclassified handler", () => {
    const tool = {
      name: "submit_worker_change",
      inputSchema: { type: "object", properties: { worker_id: {}, status: {} } },
    };
    expect(isWriteTool(tool)).toBe(true);
    const workflows = annotateWorkflows(
      {
        version: 1,
        toolHandlers: {
          submit_worker_change: { ...HANDLER, collection: "cases", primaryKey: "case_id" },
        },
      },
      { tools: [tool] },
    );
    expect(workflows.toolHandlers.submit_worker_change.semantics).toBe("state_transition");
  });

  test("proposal round-trip: build → apply dry-run → apply write → hash guard", async () => {
    const { repoRoot, packDir } = await makeRepoPack();
    try {
      const baseText = `${JSON.stringify({ id: "crm.workflows", version: 1, toolHandlers: { submit_case_update: HANDLER } }, null, 2)}\n`;
      await writeFile(join(packDir, "workflows.json"), baseText);

      const proposalTools = [
        ...TOOLS.tools,
        {
          name: "submit_order_update",
          inputSchema: { type: "object", properties: { case_id: {}, status: {} } },
          binding: { op: "submit", collection: "cases", primaryKey: "case_id" },
        },
        {
          name: "create_case",
          inputSchema: { type: "object", properties: { name: {} } },
          binding: { op: "create", collection: "cases", primaryKey: "case_id" },
        },
      ];
      const contract = {
        toolCatalog: { tools: proposalTools },
        workflowCatalog: {
          id: "crm.workflows",
          version: 1,
          toolHandlers: {
            submit_case_update: HANDLER,
            submit_order_update: { collection: "cases", primaryKey: "case_id", stateField: "status", transitions: { open: ["closed"] } },
          },
        },
      };
      const proposal = buildMutationProposal({ contract, system: "crm", source: { mode: "openapi" }, baseWorkflowsText: baseText });
      expect(proposal.workflows.toolHandlers.submit_case_update.semantics).toBe("state_transition");
      expect(proposal.writeBindings.map((b) => b.name)).toEqual(["submit_case_update", "submit_order_update", "create_case"]);

      const dry = await applyMutationProposal({ proposal, repoRoot });
      expect(dry.dryRun).toBe(true);
      expect(dry.changes).toEqual([
        { handler: "submit_case_update", kind: "annotated", keys: ["semantics", "compensation"] },
        { handler: "submit_order_update", kind: "added" },
      ]);
      // Dry-run wrote nothing.
      expect(await readFile(join(packDir, "workflows.json"), "utf8")).toBe(baseText);

      const applied = await applyMutationProposal({ proposal, repoRoot, write: true });
      expect(applied.dryRun).toBe(false);
      const merged = JSON.parse(await readFile(join(packDir, "workflows.json"), "utf8"));
      expect(merged.toolHandlers.submit_case_update.transitions).toEqual(HANDLER.transitions); // hand-authored kept
      expect(merged.toolHandlers.submit_case_update.semantics).toBe("state_transition");
      expect(merged.toolHandlers.submit_order_update.compensation).toBe("manual");
      expect(await readFile(join(packDir, "workflows.json.mutation-apply.lock"), "utf8").catch((error) => error.code)).toBe("ENOENT");

      // The file changed → the same proposal now fails the hash guard.
      await expect(applyMutationProposal({ proposal, repoRoot, write: true })).rejects.toThrow("hash mismatch");
      await expect(applyMutationProposal({ proposal, repoRoot, force: true })).resolves.toMatchObject({ dryRun: true });
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });

  test("apply treats an absent base as a hash precondition and surfaces corrupt JSON", async () => {
    const { repoRoot, packDir } = await makeRepoPack("ge-mutation-guard-");
    try {
      const contract = {
        toolCatalog: { tools: TOOLS.tools },
        workflowCatalog: { id: "crm.workflows", version: 1, toolHandlers: { submit_case_update: HANDLER } },
      };
      const proposal = buildMutationProposal({ contract, system: "crm", source: { mode: "openapi" } });
      expect(proposal.baseWorkflowsHash).toBeNull();

      await writeFile(join(packDir, "workflows.json"), '{"version":1,"toolHandlers":{}}\n');
      await expect(applyMutationProposal({ proposal, repoRoot, write: true })).rejects.toThrow("hash mismatch");

      await writeFile(join(packDir, "workflows.json"), "{not json\n");
      await expect(applyMutationProposal({ proposal, repoRoot, force: true })).rejects.toThrow("could not parse");
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });

  test("proposal ids and pack overrides cannot traverse or redirect outside the canonical repo corpus", async () => {
    expect(() => proposalFor(null, "../outside")).toThrow("mutation system id");

    const { repoRoot, packDir } = await makeRepoPack("ge-mutation-containment-");
    const outsideDir = await mkdtemp(join(tmpdir(), "ge-mutation-outside-"));
    try {
      const baseText = '{"version":1,"toolHandlers":{}}\n';
      await writeFile(join(packDir, "workflows.json"), baseText);
      await writeFile(join(outsideDir, "workflows.json"), baseText);
      const proposal = proposalFor(baseText);

      await expect(applyMutationProposal({ proposal, repoRoot, packDir: outsideDir, write: true })).rejects.toThrow(
        "must be the repository pack",
      );
      expect(await readFile(join(outsideDir, "workflows.json"), "utf8")).toBe(baseText);

      await rm(packDir, { recursive: true, force: true });
      await symlink(outsideDir, packDir, "dir");
      await expect(applyMutationProposal({ proposal, repoRoot, write: true })).rejects.toThrow("non-symlinked direct child");
      expect(await readFile(join(outsideDir, "workflows.json"), "utf8")).toBe(baseText);
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
      await rm(outsideDir, { recursive: true, force: true });
    }
  });

  test("apply fails closed for an active or ambiguous lock", async () => {
    const { repoRoot, packDir } = await makeRepoPack("ge-mutation-lock-active-");
    try {
      const baseText = `${JSON.stringify({ version: 1, toolHandlers: { submit_case_update: HANDLER } }, null, 2)}\n`;
      const workflowsPath = join(packDir, "workflows.json");
      const lockPath = `${workflowsPath}.mutation-apply.lock`;
      const proposal = proposalFor(baseText);
      await writeFile(workflowsPath, baseText);
      await writeFile(lockPath, `${JSON.stringify({
        schemaVersion: MUTATION_APPLY_LOCK_SCHEMA_VERSION,
        ownerPid: process.pid,
        createdAtMs: Date.now(),
        token: "00000000-0000-4000-8000-000000000000",
      })}\n`);

      await expect(applyMutationProposal({ proposal, repoRoot, write: true })).rejects.toThrow("holds");
      expect(await readFile(workflowsPath, "utf8")).toBe(baseText);

      await writeFile(lockPath, "{}\n");
      await expect(applyMutationProposal({ proposal, repoRoot, write: true })).rejects.toThrow("refusing ambiguous recovery");
      expect(await readFile(workflowsPath, "utf8")).toBe(baseText);
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });

  test("apply reclaims a bounded valid lock only when its owner pid is dead", async () => {
    const { repoRoot, packDir } = await makeRepoPack("ge-mutation-lock-stale-");
    try {
      const baseText = `${JSON.stringify({ version: 1, toolHandlers: { submit_case_update: HANDLER } }, null, 2)}\n`;
      const workflowsPath = join(packDir, "workflows.json");
      const lockPath = `${workflowsPath}.mutation-apply.lock`;
      const proposal = proposalFor(baseText);
      await writeFile(workflowsPath, baseText);
      await writeFile(lockPath, `${JSON.stringify({
        schemaVersion: MUTATION_APPLY_LOCK_SCHEMA_VERSION,
        ownerPid: 2_147_483_647,
        createdAtMs: Date.now() - 60_000,
        token: "00000000-0000-4000-8000-000000000001",
      })}\n`);

      await expect(applyMutationProposal({ proposal, repoRoot, write: true })).resolves.toMatchObject({ dryRun: false });
      expect(JSON.parse(await readFile(workflowsPath, "utf8")).mutationModel).toBe(MUTATION_MODEL_SCHEMA_VERSION);
      expect(await readFile(lockPath, "utf8").catch((error) => error.code)).toBe("ENOENT");
      expect(await readFile(`${lockPath}.recovery`, "utf8").catch((error) => error.code)).toBe("ENOENT");
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });

  test("an expired lock lease is reclaimable even when its pid has been reused", async () => {
    const { repoRoot, packDir } = await makeRepoPack("ge-mutation-lock-expired-");
    try {
      const baseText = `${JSON.stringify({ version: 1, toolHandlers: { submit_case_update: HANDLER } }, null, 2)}\n`;
      const workflowsPath = join(packDir, "workflows.json");
      const lockPath = `${workflowsPath}.mutation-apply.lock`;
      const proposal = proposalFor(baseText);
      await writeFile(workflowsPath, baseText);
      await writeFile(lockPath, `${JSON.stringify({
        schemaVersion: MUTATION_APPLY_LOCK_SCHEMA_VERSION,
        ownerPid: process.pid,
        createdAtMs: Date.now() - MUTATION_APPLY_LOCK_MAX_AGE_MS - 1_000,
        token: "00000000-0000-4000-8000-000000000002",
      })}\n`);

      await expect(applyMutationProposal({ proposal, repoRoot, write: true })).resolves.toMatchObject({ dryRun: false });
      expect(await readFile(lockPath, "utf8").catch((error) => error.code)).toBe("ENOENT");
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });

  test("stale recovery guard restores its verified detached backup after process death", async () => {
    const { repoRoot, packDir } = await makeRepoPack("ge-mutation-crash-recovery-");
    try {
      const baseText = `${JSON.stringify({ version: 1, toolHandlers: { submit_case_update: HANDLER } }, null, 2)}\n`;
      const workflowsPath = join(packDir, "workflows.json");
      const lockPath = `${workflowsPath}.mutation-apply.lock`;
      const guardPath = `${lockPath}.recovery`;
      const token = "00000000-0000-4000-8000-000000000003";
      const backupName = `workflows.json.${process.pid}.${token}.mutation-apply-backup`;
      const backupPath = join(packDir, backupName);
      const proposal = proposalFor(baseText);
      await writeFile(workflowsPath, baseText);
      await link(workflowsPath, backupPath);
      await unlink(workflowsPath);
      await writeFile(lockPath, `${JSON.stringify({
        schemaVersion: MUTATION_APPLY_LOCK_SCHEMA_VERSION,
        ownerPid: process.pid,
        createdAtMs: Date.now() - MUTATION_APPLY_LOCK_MAX_AGE_MS - 1_000,
        token,
        transaction: {
          schemaVersion: "ge.mutation-apply-transaction.v1",
          workflowsName: "workflows.json",
          backupName,
          currentHash: testHash(baseText),
          nextHash: testHash("next"),
        },
      })}\n`);
      await link(lockPath, guardPath);

      await expect(applyMutationProposal({ proposal, repoRoot, write: true })).resolves.toMatchObject({ dryRun: false });
      expect(JSON.parse(await readFile(workflowsPath, "utf8")).mutationModel).toBe(MUTATION_MODEL_SCHEMA_VERSION);
      for (const path of [lockPath, guardPath, backupPath]) {
        expect(await readFile(path, "utf8").catch((error) => error.code)).toBe("ENOENT");
      }
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });

  test("a non-cooperating writer cannot be overwritten between target verification and install", async () => {
    const { repoRoot, packDir } = await makeRepoPack("ge-mutation-race-");
    try {
      const baseText = `${JSON.stringify({ version: 1, toolHandlers: { submit_case_update: HANDLER } }, null, 2)}\n`;
      const workflowsPath = join(packDir, "workflows.json");
      const proposal = proposalFor(baseText);
      const externalText = '{"version":99,"toolHandlers":{},"external":true}\n';
      await writeFile(workflowsPath, baseText);

      await expect(applyMutationProposal({
        proposal,
        repoRoot,
        write: true,
        testHooks: { afterTargetDetached: () => writeFile(workflowsPath, externalText) },
      })).rejects.toThrow("refusing to overwrite");
      expect(await readFile(workflowsPath, "utf8")).toBe(externalText);
      const backups = (await readdir(packDir)).filter((name) => name.endsWith(".mutation-apply-backup"));
      expect(backups).toHaveLength(1);
      expect(await readFile(join(packDir, backups[0]), "utf8")).toBe(baseText);
    } finally {
      await rm(repoRoot, { recursive: true, force: true });
    }
  });

  test("isWriteTool: explicit ops and runtime legacy conventions", () => {
    expect(isWriteTool({ name: "create_case", binding: { op: "create" } })).toBe(true);
    expect(isWriteTool({ name: "search_cases", binding: { op: "search" } })).toBe(false);
    expect(isWriteTool({ name: "submit_case_update" })).toBe(true); // legacy, no binding
    expect(isWriteTool({ name: "submit_worker_change" })).toBe(true);
    expect(isWriteTool({ name: "submit_case_update", binding: { op: "search" } })).toBe(false);
    expect(MUTATION_SEMANTICS).toContain("unmodeled");
  });
});
