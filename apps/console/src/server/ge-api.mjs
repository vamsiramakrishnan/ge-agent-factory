/**
 * Transport-agnostic GE API handler.
 * Reusable by both Bun server and Vite dev middleware.
 */
import { GE_COMMANDS, GE_COMMAND_LIST, commandForRoute } from "../shared/ge-commands.mjs";
import { parseList } from "@ge/std/list";

// Parse GE_CONSOLE_READONLY as a boolean — only 1/true/yes/on enable read-only.
// (Raw truthiness would treat the strings "false"/"0" as read-only.)
export function isConsoleReadonly() {
  return /^(1|true|yes|on)$/i.test(String(process.env.GE_CONSOLE_READONLY || "").trim());
}

function readStatusBoard(core, cfg) {
  return typeof core.statusBoardAsync === "function"
    ? core.statusBoardAsync(cfg)
    : core.statusBoard(cfg);
}

// The single route table. `match(parts)` returns a params object or null.
// Adding a route = adding one row; isKnownRoute derives from this table.
// Handlers receive { req, core, cfg, parts, body } and return the same
// response/sentinel shapes handleGeApi always has.
export const ROUTES = [
  // /api/ge/status
  {
    method: "GET",
    match: (p) => p[2] === "status" ? {} : null,
    handle: async ({ core, cfg }) => ({ status: 200, json: await readStatusBoard(core, cfg) }),
  },
  // /api/ge/commands
  {
    method: "GET",
    match: (p) => p[2] === "commands" ? {} : null,
    handle: () => ({ status: 200, json: { commands: GE_COMMAND_LIST } }),
  },
  // /api/ge/position — golden-path position (capture → prove → handoff): which
  // stage is lit, what blocks it, and the exact next command. Calls the same
  // goldenPathPosition() that renders the bare-`ge` board — through the
  // injected core (factory-core re-exports it), the same seam every other
  // route uses — so the console's position band and the terminal can never
  // disagree about where you are.
  {
    method: "GET",
    match: (p) => p[2] === "position" ? {} : null,
    handle: async ({ core, cfg }) => {
      // Mirror tools/ge.mjs's board wiring: haveConfig/operateNext come from
      // the same status board when it's available.
      let haveConfig = !!cfg.project;
      let operateNext = null;
      try {
        const board = await readStatusBoard(core, cfg);
        haveConfig = !!board.project;
        operateNext = board.next || null;
      } catch {
        // best-effort: the board is decoration here — position still renders
        // from cfg + file state when statusBoard is unavailable.
      }
      return { status: 200, json: await core.goldenPathPosition(cfg, { haveConfig, operateNext }) };
    },
  },
  // /api/ge/specs/review — inspect a generated interview spec artifact.
  {
    method: "GET",
    match: (p) => p[2] === "specs" && p[3] === "review" ? {} : null,
    handle: async ({ req, core }) => ({
      status: 200,
      json: await core.reviewSpec({
        usecaseId: req.query?.usecaseId || req.query?.usecase || null,
        path: req.query?.path || null,
      }),
    }),
  },
  // /api/ge/specs
  {
    method: "GET",
    match: (p) => p[2] === "specs" ? {} : null,
    handle: async ({ req, core }) => ({
      status: 200,
      json: await core.listSpecs({
        department: req.query?.department && req.query.department !== "all" ? req.query.department : null,
        search: req.query?.q || req.query?.search || "",
        ids: splitCsv(req.query?.ids),
        limit: req.query?.limit || 100,
      }),
    }),
  },
  // /api/ge/doctor (and /api/ge/doctor/stream)
  {
    method: "GET",
    match: (p) => p[2] === "doctor" ? {} : null,
    handle: ({ req, core, cfg, parts }) => {
      if (parts[3] === "stream") {
        return { stream: "doctor", scope: req.query?.scope || "all", command: req.query?.command, query: req.query || {} };
      }
      const scope = req.query?.scope;
      return { status: 200, json: core.doctorAll(cfg, scopeOpts(scope, req.query?.command)) };
    },
  },
  // /api/ge/fleet
  {
    method: "GET",
    match: (p) => p[2] === "fleet" ? {} : null,
    handle: async ({ core, cfg }) => ({ status: 200, json: await core.fleetStatus(cfg) }),
  },
  // /api/ge/factory/runs
  {
    method: "GET",
    match: (p) => p[2] === "factory" && p[3] === "runs" ? {} : null,
    handle: async ({ req, core, cfg }) => ({
      status: 200,
      json: await core.listFactoryRuns(cfg, { limit: req.query?.limit || 10 }),
    }),
  },
  // /api/ge/apply/plan — declarative reconcile drift (desired vs actual).
  {
    method: "GET",
    match: (p) => p[2] === "apply" && p[3] === "plan" ? {} : null,
    handle: async ({ core, cfg }) => ({ status: 200, json: await core.applyPlan(cfg, {}) }),
  },
  // /api/ge/ledger/runs · /:id · /:id/events (live SSE) — the durable run ledger.
  {
    method: "GET",
    match: (p) => p[2] === "ledger" && p[3] === "runs" ? {} : null,
    handle: async ({ req, core, parts }) => {
      if (parts[4] && parts[5] === "events") {
        return {
          stream: "ledger",
          runId: decodeURIComponent(parts[4]),
          afterSeq: Number(req.query?.afterSeq || 0),
          source: req.query?.source || req.query?.ledgerSource || null,
        };
      }
      if (parts[4]) {
        const run = await core.ledgerRun(decodeURIComponent(parts[4]));
        return { status: run ? 200 : 404, json: run || { error: "unknown run" } };
      }
      return { status: 200, json: { runs: await core.ledgerRuns({ limit: Number(req.query?.limit || 25) }) } };
    },
  },
  // /api/ge/pipeline/plan
  {
    method: "GET",
    match: (p) => p[2] === "pipeline" && p[3] === "plan" ? {} : null,
    handle: async ({ req, core, cfg }) => {
      let tasks = [];
      let graph = null;
      try {
        const port = Number(process.env.GE_DAEMON_PORT || 17654);
        const response = await fetch(`http://127.0.0.1:${port}/api/tasks?limit=50&full=true`, {
          signal: AbortSignal.timeout(800),
        });
        if (response.ok) {
          const data = await response.json();
          tasks = data.tasks || [];
          const pipelineTask = tasks.find((t) => t.kind === "pipeline.run");
          if (pipelineTask?.output?.graph) graph = pipelineTask.output.graph;
        }
      } catch {
        // Graceful degrade: daemon down or unreachable → planned-only pipeline plan
      }
      return {
        status: 200,
        json: await core.pipelinePlan(cfg, {
          scenario: req.query?.scenario || null,
          usecaseId: req.query?.usecaseId || req.query?.usecase || null,
          spec: req.query?.spec || null,
          systems: splitCsv(req.query?.systems),
          ids: splitCsv(req.query?.ids),
          targetStage: req.query?.targetStage || req.query?.stage || "preview",
          tasks,
          graph,
        }),
      };
    },
  },
  // /api/ge/pipeline/graph
  {
    method: "GET",
    match: (p) => p[2] === "pipeline" && p[3] === "graph" ? {} : null,
    handle: async ({ req, core, cfg }) => ({
      status: 200,
      json: await core.pipelineGraphPlan(cfg, {
        ids: req.query?.ids || [],
        targetStage: req.query?.targetStage || req.query?.stage || "preview",
        repair: req.query?.repair !== "false",
        attempts: req.query?.attempts || 3,
        runPreview: req.query?.runPreview === "true",
      }),
    }),
  },
  // /api/ge/agents/:id
  {
    method: "GET",
    match: (p) => p[2] === "agents" && p[3] ? {} : null,
    handle: async ({ core, cfg, parts }) => {
      const id = parts[3];
      const fleet = await core.fleetStatus(cfg);
      let agent = fleet.agents.find(a => a.id === id) || null;
      if (!agent) {
        const resolvedId = await core.resolveCatalogId(id);
        if (resolvedId) {
          agent = fleet.agents.find(a => a.id === resolvedId) || null;
        }
      }
      return { status: 200, json: { agent } };
    },
  },
  // /api/ge/workspaces/:id/doctor
  {
    method: "GET",
    match: (p) => p[2] === "workspaces" && p[3] && p[4] === "doctor" ? {} : null,
    handle: ({ req, core, cfg, parts }) => (
      { status: 200, json: core.workspaceDoctor(cfg, { id: parts[3], stage: req.query?.stage || "preview" }) }
    ),
  },
  // /api/ge/logs/:runId
  {
    method: "GET",
    match: (p) => p[2] === "logs" && p[3] ? {} : null,
    handle: ({ req, core, cfg, parts }) => {
      const runId = parts[3];
      const stage = req.query?.stage;
      const item = req.query?.item;
      return { status: 200, json: core.tailLog(cfg, { runId, stage, item }) };
    },
  },
  // /api/ge/artifacts/:runId/:item/:name
  {
    method: "GET",
    match: (p) => p[2] === "artifacts" && p[3] && p[4] && p[5] ? {} : null,
    handle: ({ core, cfg, parts }) => {
      const runId = parts[3];
      const item = parts[4];
      const name = parts[5];
      return { status: 200, json: core.readArtifact(cfg, { runId, item, name }) };
    },
  },
  // /api/ge/runs/:runId/logs
  {
    method: "GET",
    match: (p) => p[2] === "runs" && p[3] && p[4] === "logs" ? {} : null,
    handle: ({ req, parts }) => {
      const runId = parts[3];
      const stage = req.query?.stage;
      const item = req.query?.item;
      return { stream: "logs", runId, stage, item };
    },
  },
  // /api/ge/runs/:runId/events
  {
    method: "GET",
    match: (p) => p[2] === "runs" && p[3] && p[4] === "events" ? {} : null,
    handle: ({ req, parts }) => ({
      stream: "ledger",
      runId: decodeURIComponent(parts[3]),
      afterSeq: Number(req.query?.afterSeq || 0),
      source: req.query?.source || req.query?.ledgerSource || null,
    }),
  },
  // /api/ge/jobs → list (transport resolves)
  {
    method: "GET",
    match: (p) => p[2] === "jobs" && !p[3] ? {} : null,
    handle: ({ req }) => ({ jobList: { limit: req.query?.limit } }),
  },
  // /api/ge/jobs/:id → status (transport resolves)
  {
    method: "GET",
    match: (p) => p[2] === "jobs" && p[3] && !p[4] ? {} : null,
    handle: ({ parts }) => ({ jobStatus: parts[3] }),
  },
  // /api/ge/jobs/:id/logs → live job log stream (transport resolves)
  {
    method: "GET",
    match: (p) => p[2] === "jobs" && p[3] && p[4] === "logs" ? {} : null,
    handle: ({ parts }) => ({ stream: "job", jobId: parts[3] }),
  },
  // /api/ge/repair
  {
    method: "GET",
    match: (p) => p[2] === "repair" && !p[3] ? {} : null,
    handle: ({ req }) => ({ repairList: { limit: req.query?.limit } }),
  },
  // /api/ge/repair/:id
  {
    method: "GET",
    match: (p) => p[2] === "repair" && p[3] && !p[4] ? {} : null,
    handle: ({ parts }) => ({ repairGet: parts[3] }),
  },
  // /api/ge/repair/:id/events
  {
    method: "GET",
    match: (p) => p[2] === "repair" && p[3] && p[4] === "events" ? {} : null,
    handle: ({ req, parts }) => ({ repairEvents: { id: parts[3], afterSeq: req.query?.afterSeq } }),
  },
  // /api/ge/mode — fast, runs synchronously and returns the new mode.
  {
    method: "POST",
    match: (p) => p[2] === "mode" ? {} : null,
    handle: ({ core, body }) => ({ status: 200, json: core.setMode(body.mode) }),
  },
  // /api/ge/specs/register — promote an interview artifact into the build catalog.
  {
    method: "POST",
    match: (p) => p[2] === "specs" && p[3] === "register" ? {} : null,
    handle: async ({ core, body }) => ({
      status: 200,
      json: await core.registerSpec({
        input: body.input || body.path,
        allowDraft: body.allowDraft === true,
        syncCatalog: body.syncCatalog !== false,
      }),
    }),
  },
  // /api/ge/workspaces/:id/repair — local deterministic repair loop.
  {
    method: "POST",
    match: (p) => p[2] === "workspaces" && p[3] && p[4] === "repair" ? {} : null,
    handle: ({ core, cfg, parts, body }) => ({
      status: 200,
      json: core.workspaceRepair(cfg, {
        id: parts[3],
        stage: body.stage || "preview",
        attempts: body.attempts || body.maxAttempts || 3,
        agent: body.agent || "none",
        runPreview: body.runPreview === true,
      }),
    }),
  },
  // /api/ge/repair
  {
    method: "POST",
    match: (p) => p[2] === "repair" && !p[3] ? {} : null,
    handle: ({ req, body }) => ({
      repairStart: {
        ids: body.ids || [],
        targetStage: body.targetStage || body.stage || "preview",
        repair: body.repair !== false,
        attempts: body.attempts || 3,
        runPreview: body.runPreview === true,
        query: req.query || {},
      },
    }),
  },
  // /api/ge/repair/:id/resume
  {
    method: "POST",
    match: (p) => p[2] === "repair" && p[3] && p[4] === "resume" ? {} : null,
    handle: ({ req, parts }) => ({ repairResume: { id: parts[3], query: req.query || {} } }),
  },
  // The remaining mutating ops are long-running (terraform / gcloud deploy).
  // Return a `job` sentinel: the transport spawns `ge <argv>` async, returns a
  // jobId immediately, and streams logs — so the server never blocks.
  {
    method: "POST",
    match: (p) => commandForRoute("POST", p) ? {} : null,
    handle: ({ cfg, parts, body }) => {
      const command = commandForRoute("POST", parts);
      const effectiveCommand = command.id === "agents.build" && (body.local === true || (body.local == null && cfg.mode === "local"))
        ? GE_COMMANDS["agents.build.local"]
        : command;
      const { argv: _argv, ...meta } = effectiveCommand;
      // Carry the selection so the transport's preflight gates the right departments
      // (e.g. remote build is blocked until the selected agents' tool plane is deployed).
      const selection = { ids: body.ids ?? null, dept: body.dept ?? null, scope: body.scope ?? null };
      return { job: effectiveCommand.argv(body), command: meta, cfg, selection, dispatch: dispatchForCommand(cfg, effectiveCommand, body) };
    },
  },
  // Read-only, fast (expectedDuration "under 10s") commands with no bespoke
  // GET row above: dispatch in-process to the same core.* functions
  // tools/mcp-server.mjs calls for their mcp tools — never spawn `ge <argv>`
  // for these, there's no job to run. Extend GET_HANDLERS as more
  // GET-routed registry entries are added; do not special-case paths here.
  {
    method: "GET",
    match: (p) => commandForRoute("GET", p) ? {} : null,
    handle: async ({ core, req, parts, cfg }) => {
      const command = commandForRoute("GET", parts);
      const GET_HANDLERS = {
        "systems.bindings": () => core.systemsBindings(),
        "byo.doctor": (q) => core.byoDoctor(q),
        "evals.coverage": (q) => core.evalsCoverage(q),
        "daemon.cloud": () => core.cloudDaemonStatus(cfg),
      };
      const fn = GET_HANDLERS[command.id];
      if (!fn) return { status: 501, json: { error: `no GET handler wired for ${command.id}` } };
      return { status: 200, json: await fn(req.query || {}) };
    },
  },
];

/**
 * @param {Object} req - Request object { method, path, query, body }
 * @param {Object} core - Factory core module (injected)
 * @returns {Promise<Object>} Response object { status, json } or { stream, runId, stage?, item? }
 */
export async function handleGeApi(req, core) {
  try {
    const parts = req.path.split("/").filter(p => p); // ["api", "ge", ...]

    // Check if it's a valid route first
    const isValidRoute = isKnownRoute(req.method, parts);
    if (!isValidRoute) {
      return { status: 404, json: { error: "not found", path: req.path } };
    }

    // Readonly gate for POST requests
    if (req.method === "POST" && isConsoleReadonly()) {
      return {
        status: 403,
        json: { error: "console is read-only (GE_CONSOLE_READONLY)" }
      };
    }

    const cfg = core.loadConfig(req.query || {});
    const body = req.body || {};

    const route = ROUTES.find((r) => r.method === req.method && r.match(parts) !== null);
    if (route) {
      return await route.handle({ req, core, cfg, parts, body });
    }

    // Unknown route (should not reach here due to isKnownRoute check)
    return { status: 404, json: { error: "not found", path: req.path } };

  } catch (e) {
    return { status: 500, json: { error: e.message } };
  }
}

/**
 * Check if the route is known before calling core methods — derived from
 * ROUTES, never hand-listed.
 */
export function isKnownRoute(method, parts) {
  return ROUTES.some((r) => r.method === method && r.match(parts) !== null);
}

function splitCsv(value) {
  if (Array.isArray(value)) return value;
  return parseList(String(value || ""));
}

function dispatchForCommand(cfg, command, body = {}) {
  const explicitLocal = body.local === true || body.mode === "local";
  const explicitRemote = body.local === false || body.mode === "remote";
  const mode = command.id.endsWith(".local") || explicitLocal
    ? "local"
    : (explicitRemote || cfg.mode === "remote" ? "remote" : "local");
  return {
    mode,
    runtime: mode === "remote" ? "cloud-gateway" : "local-daemon",
  };
}

/**
 * Convert scope string to options object for doctorAll.
 */
function scopeOpts(scope, command) {
  const withCommand = (opts) => command ? { ...opts, command } : opts;
  if (scope === "local") return withCommand({ local: true, cloud: false, data: false, mcp: false });
  if (scope === "cloud") return withCommand({ local: false, cloud: true, data: false, mcp: false });
  if (scope === "data") return withCommand({ local: false, cloud: false, data: true, mcp: false });
  if (scope === "mcp") return withCommand({ local: false, cloud: false, data: false, mcp: true });
  return withCommand({ local: false, cloud: true, data: true, mcp: true });
}
