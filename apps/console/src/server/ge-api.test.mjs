import { test, expect } from "bun:test";
import { handleGeApi, isKnownRoute } from "./ge-api.mjs";
import { handleGeNodeRequest } from "./ge-api-router.mjs";
import { GE_COMMANDS, GE_COMMAND_LIST } from "../shared/ge-commands.mjs";

const core = {
  loadConfig: () => ({ project: "p", region: "r", mode: "remote" }),
  statusBoard: () => ({ mode: "remote", planes: [], next: "ge up" }),
  doctorAll: (_c, opts) => ({ sections: [], fails: 0, opts }),
  listSpecs: (opts) => ({ kind: "ge.agent_spec.catalog", specs: [{ id: "a1", title: "A1" }], opts }),
  reviewSpec: (opts) => ({ kind: "ge.spec.review", found: true, path: ".ge/interviews/new/agent-spec.json", opts }),
  registerSpec: (opts) => ({ ok: true, id: "new-spec", path: "catalog/interview-specs/new-spec.json", opts }),
  journeyPlan: (_c, opts) => ({ kind: "ge.journey.plan", input: opts, stages: [] }),
  missionPlan: (_c, opts) => ({ kind: "ge.factory_autopilot.mission", target: { requested: opts.targetStage }, summary: { selected: 1 } }),
  listFactoryRuns: (_c, opts) => ({ kind: "ge.factory.runs", runs: [{ id: "factory-run-1" }], opts }),
  ledgerRuns: async () => [{ id: "local-1" }],
  ledgerRun: async (id) => (id === "local-1" ? { id: "local-1", status: "done" } : null),
  workspaceDoctor: (_c, opts) => ({ ok: false, workspace: opts.id, stage: opts.stage, blockers: [{ id: "b" }], repairTasks: [] }),
  workspaceRepair: (_c, opts) => ({ ok: true, workspace: opts.id, stage: opts.stage, attempts: [], finalDoctor: { ok: true, blockers: [], repairTasks: [] } }),
  fleetStatus: async () => ({ total: 2, byDept: {}, byStatus: {}, agents: [{ id: "a1" }, { id: "a2" }] }),
  setMode: (m) => ({ mode: m }),
  ship: async () => ({ submitted: 1 }),
  applyPlan: async () => ({ kind: "ge.apply.plan", drift: [] }),
  tailLog: (_c, opts) => ({ found: true, runId: opts.runId, lines: [] }),
  readArtifact: (_c, opts) => ({ found: true, name: opts.name, content: "" }),
  resolveCatalogId: async () => null,
  // Same contract as tools/lib/golden-path.mjs's goldenPathPosition (re-exported
  // by factory-core): three fixed stages + current/blocker/next.
  goldenPathPosition: async (_cfg, { haveConfig = true, operateNext = null } = {}) => ({
    stages: [
      { id: "capture", done: true, detail: "1 contract(s) captured" },
      { id: "prove", done: false, detail: "no proof built yet" },
      { id: "handoff", done: false, detail: "nothing handed off yet" },
    ],
    current: "prove",
    blocker: haveConfig ? null : "no project configured",
    next: haveConfig ? (operateNext || "ge prove") : "ge init",
  }),
};

test("GET status", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/status", query: {}, body: null }, core);
  expect(r.status).toBe(200); expect(r.json.next).toBe("ge up");
});
test("GET ledger runs list", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/ledger/runs", query: { limit: "5" }, body: null }, core);
  expect(r.status).toBe(200); expect(r.json.runs[0].id).toBe("local-1");
});
test("GET ledger run by id (404 for unknown)", async () => {
  const ok = await handleGeApi({ method: "GET", path: "/api/ge/ledger/runs/local-1", query: {}, body: null }, core);
  expect(ok.status).toBe(200); expect(ok.json.status).toBe("done");
  const missing = await handleGeApi({ method: "GET", path: "/api/ge/ledger/runs/nope", query: {}, body: null }, core);
  expect(missing.status).toBe(404);
});
test("GET ledger run events → SSE stream descriptor", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/ledger/runs/local-1/events", query: { afterSeq: "3", source: "firestore" }, body: null }, core);
  expect(r.stream).toBe("ledger"); expect(r.runId).toBe("local-1"); expect(r.afterSeq).toBe(3); expect(r.source).toBe("firestore");
});
test("runtime node middleware does not fall through after responding", async () => {
  process.env.GE_DAEMON_PORT = "9";
  const req = {
    method: "GET",
    url: "/api/runtime/tasks?limit=5&full=true",
    on() {},
    async *[Symbol.asyncIterator]() {},
  };
  const chunks = [];
  const headers = {};
  const res = {
    statusCode: 200,
    writableEnded: false,
    destroyed: false,
    headersSent: false,
    setHeader(key, value) {
      if (this.headersSent) throw new Error("headers already sent");
      headers[key] = value;
    },
    end(chunk) {
      this.headersSent = true;
      this.writableEnded = true;
      chunks.push(String(chunk || ""));
    },
    writeHead(status, values) {
      this.statusCode = status;
      this.headersSent = true;
      Object.assign(headers, values);
    },
    write(chunk) {
      chunks.push(String(chunk || ""));
    },
  };
  let nextCalled = false;
  await handleGeNodeRequest(req, res, () => { nextCalled = true; });

  expect(nextCalled).toBe(false);
  expect(chunks.length).toBe(1);
  expect(res.statusCode).toBe(200);
  expect(JSON.parse(chunks[0]).tasks).toEqual([]);
});
test("runtime node middleware proxies task starts to daemon", async () => {
  let received = null;
  const previousPort = process.env.GE_DAEMON_PORT;
  const previousFetch = globalThis.fetch;
  process.env.GE_DAEMON_PORT = "18764";
  globalThis.fetch = async (_url, init) => {
    received = JSON.parse(String(init?.body || "{}"));
    return new Response(JSON.stringify({ id: "mission-1", kind: received.kind, status: "running" }), {
      status: 202,
      headers: { "content-type": "application/json" },
    });
  };

  const req = {
    method: "POST",
    url: "/api/runtime/tasks",
    on() {},
    async *[Symbol.asyncIterator]() {
      yield Buffer.from(JSON.stringify({ kind: "mission.run", scenario: "benefits-enrollment", systems: ["workday"] }));
    },
  };
  const chunks = [];
  const res = {
    statusCode: 200,
    writableEnded: false,
    destroyed: false,
    headersSent: false,
    setHeader() {},
    end(chunk) {
      this.headersSent = true;
      this.writableEnded = true;
      chunks.push(String(chunk || ""));
    },
    writeHead(status) {
      this.statusCode = status;
      this.headersSent = true;
    },
    write(chunk) {
      chunks.push(String(chunk || ""));
    },
  };
  try {
    await handleGeNodeRequest(req, res, () => { throw new Error("should not fall through"); });
    expect(received).toEqual({ kind: "mission.run", scenario: "benefits-enrollment", systems: ["workday"] });
    expect(res.statusCode).toBe(202);
    expect(JSON.parse(chunks[0]).id).toBe("mission-1");
  } finally {
    if (previousPort === undefined) delete process.env.GE_DAEMON_PORT;
    else process.env.GE_DAEMON_PORT = previousPort;
    globalThis.fetch = previousFetch;
  }
});
test("runtime node middleware proxies daemon status", async () => {
  const previousPort = process.env.GE_DAEMON_PORT;
  const previousFetch = globalThis.fetch;
  process.env.GE_DAEMON_PORT = "18765";
  globalThis.fetch = async () => new Response(JSON.stringify({
    ok: true,
    protocolVersion: 2,
    supportedTaskKinds: ["harness.run"],
    capabilities: { harnessRun: true },
  }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

  const req = {
    method: "GET",
    url: "/api/runtime/status",
    on() {},
    async *[Symbol.asyncIterator]() {},
  };
  const chunks = [];
  const res = {
    statusCode: 200,
    writableEnded: false,
    destroyed: false,
    headersSent: false,
    setHeader() {},
    end(chunk) {
      this.headersSent = true;
      this.writableEnded = true;
      chunks.push(String(chunk || ""));
    },
    writeHead(status) {
      this.statusCode = status;
      this.headersSent = true;
    },
    write(chunk) {
      chunks.push(String(chunk || ""));
    },
  };
  try {
    await handleGeNodeRequest(req, res, () => { throw new Error("should not fall through"); });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(chunks[0]).supportedTaskKinds).toContain("harness.run");
  } finally {
    if (previousPort === undefined) delete process.env.GE_DAEMON_PORT;
    else process.env.GE_DAEMON_PORT = previousPort;
    globalThis.fetch = previousFetch;
  }
});
test("GET position returns the golden-path position contract", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/position", query: {}, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.stages.map((s) => s.id)).toEqual(["capture", "prove", "handoff"]);
  for (const stage of r.json.stages) {
    expect(typeof stage.done).toBe("boolean");
    expect(typeof stage.detail).toBe("string");
  }
  expect(["capture", "prove", "handoff"]).toContain(r.json.current);
  // The mock statusBoard has no project → the route mirrors bare `ge`:
  // haveConfig=false means the next command is `ge init` and a blocker is set.
  expect(r.json.next).toBe("ge init");
  expect(r.json.blocker).toBe("no project configured");
});

test("GET position derives haveConfig/operateNext from the status board (tools/ge.mjs parity)", async () => {
  const seen = [];
  const positionCore = {
    ...core,
    statusBoard: () => ({ mode: "remote", planes: [], next: "ge up", project: "p" }),
    goldenPathPosition: async (_cfg, opts) => {
      seen.push(opts);
      return { stages: [], current: "handoff", blocker: null, next: opts.operateNext };
    },
  };
  const r = await handleGeApi({ method: "GET", path: "/api/ge/position", query: {}, body: null }, positionCore);
  expect(r.status).toBe(200);
  expect(seen).toEqual([{ haveConfig: true, operateNext: "ge up" }]);
  expect(r.json.next).toBe("ge up");
});

test("POST prove and handoff flow through the registry commandForRoute handler", async () => {
  const prove = await handleGeApi({ method: "POST", path: "/api/ge/prove", query: {}, body: { id: "a1", force: true } }, core);
  expect(prove.job).toEqual(["prove", "--id", "a1", "--force"]);
  expect(prove.command.id).toBe("prove");
  expect(prove.command.cli).toBe("ge prove");
  const handoff = await handleGeApi({ method: "POST", path: "/api/ge/handoff", query: {}, body: {} }, core);
  expect(handoff.job).toEqual(["handoff", "agents-cli"]);
  expect(handoff.command.id).toBe("handoff");
  expect(handoff.command.cli).toBe("ge handoff");
});

test("GET commands returns mutating command registry metadata", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/commands", query: {}, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.commands.some((c) => c.id === "data.up" && c.path === "/api/ge/data/up")).toBe(true);
});
test("GET specs returns searchable spec catalog", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/specs", query: { q: "reconcile", department: "finance", limit: "20" }, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.kind).toBe("ge.agent_spec.catalog");
  expect(r.json.opts).toMatchObject({ search: "reconcile", department: "finance", limit: "20" });
});
test("GET specs treats department=all as no department filter", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/specs", query: { department: "all", limit: "20" }, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.opts).toMatchObject({ department: null, limit: "20" });
});
test("GET specs/review inspects generated spec artifacts", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/specs/review", query: { usecaseId: "new" }, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.kind).toBe("ge.spec.review");
  expect(r.json.opts.usecaseId).toBe("new");
});
test("POST specs/register promotes an interview spec", async () => {
  const r = await handleGeApi({ method: "POST", path: "/api/ge/specs/register", query: {}, body: { input: ".ge/interviews/new/agent-spec.json", syncCatalog: false } }, core);
  expect(r.status).toBe(200);
  expect(r.json.ok).toBe(true);
  expect(r.json.opts.input).toBe(".ge/interviews/new/agent-spec.json");
  expect(r.json.opts.syncCatalog).toBe(false);
});
test("registered commands expose readiness requirements", () => {
  for (const command of GE_COMMAND_LIST) {
    expect(command.label.length).toBeGreaterThan(0);
    expect(command.cli.length).toBeGreaterThan(0);
    expect(command.requirements).toBeTruthy();
    expect(Array.isArray(command.requirements.config)).toBe(true);
  }
});
test("GET agents/:id finds the agent", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/agents/a2", query: {}, body: null }, core);
  expect(r.json.agent.id).toBe("a2");
});
test("GET runs/:id/logs → stream sentinel", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/runs/run1/logs", query: { stage: "validate" }, body: null }, core);
  expect(r.stream).toBe("logs"); expect(r.runId).toBe("run1"); expect(r.stage).toBe("validate");
});
test("GET doctor passes command readiness target", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/doctor", query: { scope: "data", command: "data.up" }, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.opts).toEqual({ local: false, cloud: false, data: true, mcp: false, command: "data.up" });
});
test("GET doctor stream returns stream sentinel", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/doctor/stream", query: { scope: "mcp", command: "mcp.doctor" }, body: null }, core);
  expect(r.stream).toBe("doctor");
  expect(r.scope).toBe("mcp");
  expect(r.command).toBe("mcp.doctor");
});
test("GET workspaces/:id/doctor returns workspace gate report", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/workspaces/ws-1/doctor", query: { stage: "preview" }, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.workspace).toBe("ws-1");
  expect(r.json.stage).toBe("preview");
});
test("GET mission returns factory/autopilot contract", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/mission", query: { ids: "a1", targetStage: "deploy:plan" }, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.kind).toBe("ge.factory_autopilot.mission");
  expect(r.json.target.requested).toBe("deploy:plan");
});
test("GET journey returns the user-facing pipeline contract", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/journey", query: { scenario: "benefits", spec: ".ge/interviews/benefits/agent-spec.json", systems: "workday,sap", ids: "a1" }, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.kind).toBe("ge.journey.plan");
  expect(r.json.input).toMatchObject({ scenario: "benefits", spec: ".ge/interviews/benefits/agent-spec.json", systems: ["workday", "sap"], ids: ["a1"] });
});
test("POST workspaces/:id/repair runs workspace repair", async () => {
  const r = await handleGeApi({ method: "POST", path: "/api/ge/workspaces/ws-1/repair", query: {}, body: { stage: "preview", attempts: 2, agent: "none" } }, core);
  expect(r.status).toBe(200);
  expect(r.json.ok).toBe(true);
  expect(r.json.workspace).toBe("ws-1");
});
test("GET autopilot list and detail return sentinels", async () => {
  const list = await handleGeApi({ method: "GET", path: "/api/ge/autopilot", query: { limit: "5" }, body: null }, core);
  expect(list.autopilotList.limit).toBe("5");
  const detail = await handleGeApi({ method: "GET", path: "/api/ge/autopilot/auto-1", query: {}, body: null }, core);
  expect(detail.autopilotGet).toBe("auto-1");
});
test("POST autopilot start and resume return sentinels", async () => {
  const start = await handleGeApi({ method: "POST", path: "/api/ge/autopilot", query: {}, body: { ids: ["a1"], targetStage: "preview", repair: true } }, core);
  expect(start.autopilotStart.ids).toEqual(["a1"]);
  expect(start.autopilotStart.targetStage).toBe("preview");
  const resume = await handleGeApi({ method: "POST", path: "/api/ge/autopilot/auto-1/resume", query: {}, body: {} }, core);
  expect(resume.autopilotResume.id).toBe("auto-1");
});
test("GET jobs returns job list sentinel", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/jobs", query: { limit: "10" }, body: null }, core);
  expect(r.jobList.limit).toBe("10");
});
test("GET factory/runs returns durable local factory runs", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/factory/runs", query: { limit: "3" }, body: null }, core);
  expect(r.status).toBe(200);
  expect(r.json.kind).toBe("ge.factory.runs");
  expect(r.json.opts.limit).toBe("3");
});
test("POST mode (mutating) works when not readonly", async () => {
  const r = await handleGeApi({ method: "POST", path: "/api/ge/mode", query: {}, body: { mode: "local" } }, core);
  expect(r.json.mode).toBe("local");
});
test("POST data/up starts the ge data up job", async () => {
  const r = await handleGeApi({ method: "POST", path: "/api/ge/data/up", query: {}, body: {} }, core);
  expect(r.job).toEqual(["data", "up"]);
  expect(r.command.id).toBe("data.up");
});
test("POST agents/build uses shared command argv builder", async () => {
  const r = await handleGeApi({ method: "POST", path: "/api/ge/agents/build", query: {}, body: { scope: "canary", local: true, force: true } }, core);
  expect(r.job).toEqual(["agents", "build", "--canary", "--local", "--force"]);
  expect(r.command.id).toBe("agents.build.local");
});
test("POST agents/build uses local readiness metadata in local mode", async () => {
  const localCore = {
    ...core,
    loadConfig: () => ({ project: "p", region: "r", mode: "local" }),
  };
  const r = await handleGeApi({ method: "POST", path: "/api/ge/agents/build", query: {}, body: { ids: "ad-hoc-query-agent" } }, localCore);
  expect(r.job).toEqual(["agents", "build", "--ids", "ad-hoc-query-agent", "--local"]);
  expect(r.command.id).toBe("agents.build.local");
  expect(r.command.requirements.localToolchain).toBe(true);
  expect(r.command.requirements.config.includes("gatewayUrl")).toBe(false);
  expect(r.command.observability).toMatchObject({
    mode: "local-factory-events",
    events: true,
    eventLog: ".ge/factory/factory-events.jsonl",
  });
});
test("POST agents/sync passes selected ids and target repo to CLI job", async () => {
  const r = await handleGeApi({
    method: "POST",
    path: "/api/ge/agents/sync",
    query: {},
    body: {
      ids: ["account-reconciliation-agent", "audit-report-generator"],
      local: true,
      push: true,
      remote: "ssh://example.com/generated-agents.git",
      create: true,
      noCommit: true,
    },
  }, core);
  expect(r.job).toEqual([
    "agents",
    "sync",
    "--ids",
    "account-reconciliation-agent,audit-report-generator",
    "--push",
    "--local",
    "--remote",
    "ssh://example.com/generated-agents.git",
    "--create",
    "--no-commit",
  ]);
  expect(r.command.id).toBe("agents.sync");
});
test("readonly gate blocks POST", async () => {
  process.env.GE_CONSOLE_READONLY = "1";
  const r = await handleGeApi({ method: "POST", path: "/api/ge/agents/ship", query: {}, body: { ids: "x" } }, core);
  delete process.env.GE_CONSOLE_READONLY;
  expect(r.status).toBe(403);
});
test("readonly is parsed as a boolean — 'false' does NOT enable it", async () => {
  process.env.GE_CONSOLE_READONLY = "false";
  const r = await handleGeApi({ method: "POST", path: "/api/ge/mode", query: {}, body: { mode: "local" } }, core);
  delete process.env.GE_CONSOLE_READONLY;
  expect(r.status).toBe(200); // not blocked
});
test("unknown route → 404", async () => {
  const r = await handleGeApi({ method: "GET", path: "/api/ge/nope", query: {}, body: null }, {});
  expect(r.status).toBe(404);
});

// --- Route-table parity matrix -----------------------------------------------
// 404 parity with the pre-ROUTES if-chain: "known" cases must not 404 (they
// return a JSON response or a transport sentinel), "unknown" cases must 404.
const ROUTE_MATRIX = [
  // known — JSON or sentinel responses
  { method: "GET", path: "/api/ge/status", known: true },
  // the old dispatch matched parts[2] only — deeper paths still hit statusBoard
  { method: "GET", path: "/api/ge/status/extra", known: true },
  { method: "GET", path: "/api/ge/commands", known: true },
  { method: "GET", path: "/api/ge/position", known: true },
  { method: "GET", path: "/api/ge/specs", known: true },
  { method: "GET", path: "/api/ge/specs/review", known: true },
  { method: "GET", path: "/api/ge/doctor", known: true },
  { method: "GET", path: "/api/ge/doctor/stream", known: true },
  { method: "GET", path: "/api/ge/fleet", known: true },
  { method: "GET", path: "/api/ge/factory/runs", known: true },
  { method: "GET", path: "/api/ge/apply/plan", known: true },
  { method: "GET", path: "/api/ge/ledger/runs", known: true },
  { method: "GET", path: "/api/ge/ledger/runs/local-1", known: true },
  { method: "GET", path: "/api/ge/ledger/runs/local-1/events", known: true },
  { method: "GET", path: "/api/ge/journey", known: true },
  { method: "GET", path: "/api/ge/mission", known: true },
  { method: "GET", path: "/api/ge/agents/a2", known: true },
  { method: "GET", path: "/api/ge/workspaces/ws-1/doctor", known: true },
  { method: "GET", path: "/api/ge/logs/run-1", known: true },
  { method: "GET", path: "/api/ge/artifacts/run-1/item-1/name-1", known: true },
  { method: "GET", path: "/api/ge/runs/run-1/logs", known: true },
  { method: "GET", path: "/api/ge/runs/run-1/events", known: true },
  { method: "GET", path: "/api/ge/jobs", known: true },
  { method: "GET", path: "/api/ge/jobs/j1", known: true },
  { method: "GET", path: "/api/ge/jobs/j1/logs", known: true },
  { method: "GET", path: "/api/ge/autopilot", known: true },
  { method: "GET", path: "/api/ge/autopilot/auto-1", known: true },
  { method: "GET", path: "/api/ge/autopilot/auto-1/events", known: true },
  { method: "POST", path: "/api/ge/mode", known: true },
  { method: "POST", path: "/api/ge/specs/register", known: true },
  { method: "POST", path: "/api/ge/workspaces/ws-1/repair", known: true },
  { method: "POST", path: "/api/ge/autopilot", known: true },
  { method: "POST", path: "/api/ge/autopilot/auto-1/resume", known: true },
  { method: "POST", path: "/api/ge/up", known: true },
  { method: "POST", path: "/api/ge/data/up", known: true },
  { method: "POST", path: "/api/ge/mcp/deploy", known: true },
  { method: "POST", path: "/api/ge/agents/build", known: true },
  { method: "POST", path: "/api/ge/agents/ship", known: true },
  { method: "POST", path: "/api/ge/agents/sync", known: true },
  { method: "POST", path: "/api/ge/daemon/start", known: true },
  // Golden-path verbs (registry-driven POST routes via commandForRoute).
  { method: "POST", path: "/api/ge/prove", known: true },
  { method: "POST", path: "/api/ge/handoff", known: true },
  { method: "POST", path: "/api/ge/position", known: false },
  // unknown — 404, exactly as the old if-chain + isKnownRoute pair behaved
  { method: "GET", path: "/api/ge/nope", known: false },
  { method: "GET", path: "/api/ge/mode", known: false },
  { method: "POST", path: "/api/ge/status", known: false },
  { method: "GET", path: "/api/ge/agents", known: false },
  { method: "GET", path: "/api/ge/workspaces/ws-1", known: false },
  { method: "GET", path: "/api/ge/jobs/j1/nope", known: false },
  { method: "GET", path: "/api/ge/autopilot/auto-1/nope", known: false },
  { method: "POST", path: "/api/ge/autopilot/auto-1", known: false },
  { method: "GET", path: "/api/ge/artifacts/run-1/item-1", known: false },
  { method: "GET", path: "/api/ge/runs/run-1", known: false },
  { method: "POST", path: "/api/ge/agents/nope", known: false },
  { method: "POST", path: "/api/ge/journey", known: false },
];

test("route matrix: known/unknown 404 parity with the pre-table dispatch", async () => {
  for (const { method, path, known } of ROUTE_MATRIX) {
    const body = method === "POST" ? {} : null;
    const r = await handleGeApi({ method, path, query: {}, body }, core);
    if (known) {
      expect({ path: `${method} ${path}`, notFound: r.status === 404 }).toEqual({ path: `${method} ${path}`, notFound: false });
    } else {
      expect({ path: `${method} ${path}`, status: r.status }).toEqual({ path: `${method} ${path}`, status: 404 });
      expect(r.json).toEqual({ error: "not found", path });
    }
  }
});

test("every registry command with a console route is matched by a ROUTES row", () => {
  for (const command of Object.values(GE_COMMANDS)) {
    if (!command.path) continue;
    const parts = command.path.split("/").filter((p) => p);
    expect({ id: command.id, known: isKnownRoute(command.method, parts) }).toEqual({ id: command.id, known: true });
  }
});

// --- Opt-in Firebase auth gate (default OFF) ---------------------------------
function makeNodeReqRes(url, headers = {}) {
  const chunks = [];
  const req = { method: "GET", url, headers, on() {}, async *[Symbol.asyncIterator]() {} };
  const res = {
    statusCode: 200, writableEnded: false, destroyed: false, headersSent: false,
    setHeader() {},
    end(chunk) { this.headersSent = true; this.writableEnded = true; chunks.push(String(chunk || "")); },
    writeHead(status) { this.statusCode = status; this.headersSent = true; },
    write(chunk) { chunks.push(String(chunk || "")); },
  };
  return { req, res, chunks };
}

test("auth gate is a no-op when GE_AUTH_MODE unset (node passthrough)", async () => {
  delete process.env.GE_AUTH_MODE;
  const previousFetch = globalThis.fetch;
  const previousPort = process.env.GE_DAEMON_PORT;
  process.env.GE_DAEMON_PORT = "18799";
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true, supportedTaskKinds: [] }), {
    status: 200, headers: { "content-type": "application/json" },
  });
  try {
    // No Authorization header at all → must NOT 401; request flows through to the
    // runtime proxy exactly as it does today.
    const { req, res, chunks } = makeNodeReqRes("/api/runtime/status");
    await handleGeNodeRequest(req, res, () => { throw new Error("should not fall through"); });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(chunks[0]).ok).toBe(true);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousPort === undefined) delete process.env.GE_DAEMON_PORT;
    else process.env.GE_DAEMON_PORT = previousPort;
  }
});

test("auth gate rejects missing token when GE_AUTH_MODE=firebase (node)", async () => {
  process.env.GE_AUTH_MODE = "firebase";
  try {
    const { req, res, chunks } = makeNodeReqRes("/api/ge/status");
    await handleGeNodeRequest(req, res, () => { throw new Error("should not fall through"); });
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(chunks[0]).error).toBe("unauthenticated");
  } finally {
    delete process.env.GE_AUTH_MODE;
  }
});

test("auth gate rejects a bogus bearer token when enforcement is on (node)", async () => {
  process.env.GE_AUTH_MODE = "firebase";
  const prevPid = process.env.FIREBASE_PROJECT_ID;
  process.env.FIREBASE_PROJECT_ID = "test-project";
  try {
    const { req, res, chunks } = makeNodeReqRes("/api/ge/status", { authorization: "Bearer not-a-real-jwt" });
    await handleGeNodeRequest(req, res, () => { throw new Error("should not fall through"); });
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(chunks[0]).error).toBe("unauthenticated");
  } finally {
    delete process.env.GE_AUTH_MODE;
    if (prevPid === undefined) delete process.env.FIREBASE_PROJECT_ID;
    else process.env.FIREBASE_PROJECT_ID = prevPid;
  }
});
