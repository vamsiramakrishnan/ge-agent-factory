/**
 * Transport-agnostic GE API handler.
 * Reusable by both Bun server and Vite dev middleware.
 */
import { GE_COMMANDS, GE_COMMAND_LIST, commandForRoute } from "../shared/ge-commands.mjs";

// Parse GE_CONSOLE_READONLY as a boolean — only 1/true/yes/on enable read-only.
// (Raw truthiness would treat the strings "false"/"0" as read-only.)
export function isConsoleReadonly() {
  return /^(1|true|yes|on)$/i.test(String(process.env.GE_CONSOLE_READONLY || "").trim());
}

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

    // GET routes
    if (req.method === "GET") {
      // /api/ge/status
      if (parts[2] === "status") {
        return { status: 200, json: core.statusBoard(cfg) };
      }

      // /api/ge/commands
      if (parts[2] === "commands") {
        return { status: 200, json: { commands: GE_COMMAND_LIST } };
      }

      // /api/ge/specs/review — inspect a generated interview spec artifact.
      if (parts[2] === "specs" && parts[3] === "review") {
        return {
          status: 200,
          json: await core.reviewSpec({
            usecaseId: req.query?.usecaseId || req.query?.usecase || null,
            path: req.query?.path || null,
          }),
        };
      }

      // /api/ge/specs
      if (parts[2] === "specs") {
        return {
          status: 200,
          json: await core.listSpecs({
            department: req.query?.department && req.query.department !== "all" ? req.query.department : null,
            search: req.query?.q || req.query?.search || "",
            ids: splitCsv(req.query?.ids),
            limit: req.query?.limit || 100,
          }),
        };
      }

      // /api/ge/doctor
      if (parts[2] === "doctor") {
        if (parts[3] === "stream") {
          return { stream: "doctor", scope: req.query?.scope || "all", command: req.query?.command, query: req.query || {} };
        }
        const scope = req.query?.scope;
        return { status: 200, json: core.doctorAll(cfg, scopeOpts(scope, req.query?.command)) };
      }

      // /api/ge/fleet
      if (parts[2] === "fleet") {
        return { status: 200, json: await core.fleetStatus(cfg) };
      }

      // /api/ge/factory/runs
      if (parts[2] === "factory" && parts[3] === "runs") {
        return {
          status: 200,
          json: await core.listFactoryRuns(cfg, { limit: req.query?.limit || 10 }),
        };
      }

      // /api/ge/apply/plan — declarative reconcile drift (desired vs actual).
      if (parts[2] === "apply" && parts[3] === "plan") {
        return { status: 200, json: await core.applyPlan(cfg, {}) };
      }

      // /api/ge/ledger/runs · /:id · /:id/events (live SSE) — the durable run ledger.
      if (parts[2] === "ledger" && parts[3] === "runs") {
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
      }

      // /api/ge/journey
      if (parts[2] === "journey") {
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
            const missionTask = tasks.find((t) => t.kind === "mission.run");
            if (missionTask?.output?.graph) graph = missionTask.output.graph;
          }
        } catch {
          // Graceful degrade: daemon down or unreachable → planned-only journey
        }
        return {
          status: 200,
          json: await core.journeyPlan(cfg, {
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
      }

      // /api/ge/mission
      if (parts[2] === "mission") {
        return {
          status: 200,
          json: await core.missionPlan(cfg, {
            ids: req.query?.ids || [],
            targetStage: req.query?.targetStage || req.query?.stage || "preview",
            repair: req.query?.repair !== "false",
            attempts: req.query?.attempts || 3,
            runPreview: req.query?.runPreview === "true",
          }),
        };
      }

      // /api/ge/agents/:id
      if (parts[2] === "agents" && parts[3]) {
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
      }

      // /api/ge/workspaces/:id/doctor
      if (parts[2] === "workspaces" && parts[3] && parts[4] === "doctor") {
        return { status: 200, json: core.workspaceDoctor(cfg, { id: parts[3], stage: req.query?.stage || "preview" }) };
      }

      // /api/ge/logs/:runId
      if (parts[2] === "logs" && parts[3]) {
        const runId = parts[3];
        const stage = req.query?.stage;
        const item = req.query?.item;
        return { status: 200, json: core.tailLog(cfg, { runId, stage, item }) };
      }

      // /api/ge/artifacts/:runId/:item/:name
      if (parts[2] === "artifacts" && parts[3] && parts[4] && parts[5]) {
        const runId = parts[3];
        const item = parts[4];
        const name = parts[5];
        return { status: 200, json: core.readArtifact(cfg, { runId, item, name }) };
      }

      // /api/ge/runs/:runId/logs
      if (parts[2] === "runs" && parts[3] && parts[4] === "logs") {
        const runId = parts[3];
        const stage = req.query?.stage;
        const item = req.query?.item;
        return { stream: "logs", runId, stage, item };
      }

      // /api/ge/runs/:runId/events
      if (parts[2] === "runs" && parts[3] && parts[4] === "events") {
        const runId = parts[3];
        return { stream: "events", runId };
      }

      // /api/ge/jobs/:id  → status (transport resolves)
      if (parts[2] === "jobs" && !parts[3]) {
        return { jobList: { limit: req.query?.limit } };
      }

      // /api/ge/jobs/:id  → status (transport resolves)
      if (parts[2] === "jobs" && parts[3] && !parts[4]) {
        return { jobStatus: parts[3] };
      }

      // /api/ge/jobs/:id/logs → live job log stream (transport resolves)
      if (parts[2] === "jobs" && parts[3] && parts[4] === "logs") {
        return { stream: "job", jobId: parts[3] };
      }

      // /api/ge/autopilot
      if (parts[2] === "autopilot" && !parts[3]) {
        return { autopilotList: { limit: req.query?.limit } };
      }

      // /api/ge/autopilot/:id
      if (parts[2] === "autopilot" && parts[3] && !parts[4]) {
        return { autopilotGet: parts[3] };
      }

      // /api/ge/autopilot/:id/events
      if (parts[2] === "autopilot" && parts[3] && parts[4] === "events") {
        return { autopilotEvents: { id: parts[3], afterSeq: req.query?.afterSeq } };
      }
    }

    // POST routes
    if (req.method === "POST") {
      const body = req.body || {};

      // /api/ge/mode — fast, runs synchronously and returns the new mode.
      if (parts[2] === "mode") {
        return { status: 200, json: core.setMode(body.mode) };
      }

      // /api/ge/specs/register — promote an interview artifact into the build catalog.
      if (parts[2] === "specs" && parts[3] === "register") {
        return {
          status: 200,
          json: await core.registerSpec({
            input: body.input || body.path,
            allowDraft: body.allowDraft === true,
            syncCatalog: body.syncCatalog !== false,
          }),
        };
      }

      // /api/ge/workspaces/:id/repair — local deterministic repair loop.
      if (parts[2] === "workspaces" && parts[3] && parts[4] === "repair") {
        return {
          status: 200,
          json: core.workspaceRepair(cfg, {
            id: parts[3],
            stage: body.stage || "preview",
            attempts: body.attempts || body.maxAttempts || 3,
            agent: body.agent || "none",
            runPreview: body.runPreview === true,
          }),
        };
      }

      // /api/ge/autopilot
      if (parts[2] === "autopilot" && !parts[3]) {
        return {
          autopilotStart: {
            ids: body.ids || [],
            targetStage: body.targetStage || body.stage || "preview",
            repair: body.repair !== false,
            attempts: body.attempts || 3,
            runPreview: body.runPreview === true,
            query: req.query || {},
          },
        };
      }

      // /api/ge/autopilot/:id/resume
      if (parts[2] === "autopilot" && parts[3] && parts[4] === "resume") {
        return { autopilotResume: { id: parts[3], query: req.query || {} } };
      }

      // The remaining mutating ops are long-running (terraform / gcloud deploy).
      // Return a `job` sentinel: the transport spawns `ge <argv>` async, returns a
      // jobId immediately, and streams logs — so the server never blocks.

      const command = commandForRoute(req.method, parts);
      if (command) {
        const effectiveCommand = command.id === "agents.build" && (body.local === true || (body.local == null && cfg.mode === "local"))
          ? GE_COMMANDS["agents.build.local"]
          : command;
        const { argv: _argv, ...meta } = effectiveCommand;
        // Carry the selection so the transport's preflight gates the right departments
        // (e.g. remote build is blocked until the selected agents' tool plane is deployed).
        const selection = { ids: body.ids ?? null, dept: body.dept ?? null, scope: body.scope ?? null };
        return { job: effectiveCommand.argv(body), command: meta, cfg, selection };
      }
    }

    // Unknown route (should not reach here due to isKnownRoute check)
    return { status: 404, json: { error: "not found", path: req.path } };

  } catch (e) {
    return { status: 500, json: { error: e.message } };
  }
}

/**
 * Check if the route is known before calling core methods.
 */
function isKnownRoute(method, parts) {
  if (method === "GET") {
    if (parts[2] === "status") return true;
    if (parts[2] === "commands") return true;
    if (parts[2] === "specs") return true;
    if (parts[2] === "doctor") return true;
    if (parts[2] === "journey") return true;
    if (parts[2] === "mission") return true;
    if (parts[2] === "workspaces" && parts[3] && parts[4] === "doctor") return true;
    if (parts[2] === "fleet") return true;
    if (parts[2] === "factory" && parts[3] === "runs") return true;
    if (parts[2] === "ledger" && parts[3] === "runs") return true;
    if (parts[2] === "apply" && parts[3] === "plan") return true;
    if (parts[2] === "agents" && parts[3]) return true;
    if (parts[2] === "logs" && parts[3]) return true;
    if (parts[2] === "artifacts" && parts[3] && parts[4] && parts[5]) return true;
    if (parts[2] === "runs" && parts[3] && parts[4] === "logs") return true;
    if (parts[2] === "runs" && parts[3] && parts[4] === "events") return true;
    if (parts[2] === "jobs") return true;
    if (parts[2] === "autopilot") return true;
  }
  if (method === "POST") {
    if (parts[2] === "mode") return true;
    if (parts[2] === "specs" && parts[3] === "register") return true;
    if (parts[2] === "workspaces" && parts[3] && parts[4] === "repair") return true;
    if (parts[2] === "autopilot" && !parts[3]) return true;
    if (parts[2] === "autopilot" && parts[3] && parts[4] === "resume") return true;
    if (commandForRoute(method, parts)) return true;
  }
  return false;
}

function splitCsv(value) {
  if (Array.isArray(value)) return value;
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
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
