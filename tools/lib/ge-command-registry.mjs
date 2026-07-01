/**
 * Single source of truth wiring a `ge` CLI command into the console (route,
 * CLI invocation, risk level, requirements, observability shape) — see
 * `commandForRoute`, `commandMeta`, and `factory/registry.mjs`'s `dispatch()`
 * for how this table is consumed.
 *
 * Field contract for each entry:
 * - `risk` (string): one of
 *   - "mutates-cloud" — calls out to GCP/Terraform and changes cloud state.
 *   - "starts-workloads" — kicks off cloud-side (remote) build/run work.
 *   - "starts-local-workloads" — starts a process on the operator's machine
 *     (local factory harness, daemon, etc.), no cloud mutation.
 *   - "writes-repo" — writes/commits files into the local git repo.
 *   Keep `apps/console/src/services/geClient.ts`'s `GeCommand.risk` union in
 *   sync with any new value added here.
 * - `requirements` (object, all keys optional): preflight checks the console
 *   runs before allowing the command to be invoked.
 *   - `bins` (string[]) — CLI binaries that must be on PATH.
 *   - `config` (string[]) — `.ge.json` keys that must already be set.
 *   - `cloudAuth` (boolean) — requires an authenticated gcloud session.
 *   - `terraformRoot` (boolean) — requires a Terraform root to be present.
 *   - `configWritable` (boolean) — `.ge.json` must be writable (command may
 *     merge new values into it).
 *   - `localToolchain` (boolean) — requires the local dev toolchain (e.g.
 *     `uv`) provisioned by `mise run setup`.
 *   - `toolPlane` (boolean) — requires the MCP tool plane to be deployed.
 *   - `bigQueryHard` (boolean) — hard preflight blocker: BigQuery API must be
 *     enabled (not a soft warning).
 *   - `shipHandoff` (boolean) — requires the cloud-run-proxy gcloud component
 *     and gateway agent-provision flag for the ship handoff.
 *   - `dataGenerationRuntime` (boolean) — requires the local data-generation
 *     runtime to be available.
 * - `observability` (object, optional — defaults to
 *   `{ mode: "command-output", events: false }` via `commandMetaFromCommand`):
 *   - `mode` (string): one of
 *     - "command-output" — no structured events; console shows raw stdout.
 *     - "remote-stage-logs" — cloud factory stage logs, polled via
 *       `statusCommand`.
 *     - "local-factory-events" — local harness emits a JSONL event log
 *       (`eventLog`) plus generated `artifacts`.
 *     - "runtime-events" — mission-graph runtime events, polled via
 *       `statusCommand`.
 *   - `events` (boolean) — whether the command streams structured events.
 *   - `statusCommand` (string, optional) — CLI command to poll status.
 *   - `eventLog` (string, optional) — path to a JSONL event log.
 *   - `artifacts` (string[], optional) — generated file globs to surface.
 */
export const GE_COMMANDS = {
  "up": {
    id: "up",
    method: "POST",
    path: "/api/ge/up",
    cli: "ge up",
    label: "Stand up platform",
    summary: "Provision infra, data, and tool planes",
    risk: "mutates-cloud",
    expectedDuration: "20-45m",
    requirements: {
      bins: ["gcloud", "terraform"],
      config: ["project", "geAppId"],
      cloudAuth: true,
      terraformRoot: true,
      configWritable: true,
    },
    argv: (body = {}) => ["up", ...((body.planes || []).map((p) => `--${p}`))],
  },
  "data.up": {
    id: "data.up",
    method: "POST",
    path: "/api/ge/data/up",
    cli: "ge data up",
    label: "Provision data plane",
    summary: "Apply Terraform for shared stores and merge coordinates into .ge.json",
    risk: "mutates-cloud",
    expectedDuration: "10-25m",
    requirements: {
      bins: ["gcloud", "terraform"],
      config: ["project", "geAppId"],
      cloudAuth: true,
      terraformRoot: true,
      configWritable: true,
      // load_data needs the BigQuery API — a hard pre-flight blocker for the data plane.
      bigQueryHard: true,
    },
    argv: () => ["data", "up"],
  },
  "mcp.deploy": {
    id: "mcp.deploy",
    method: "POST",
    path: "/api/ge/mcp/deploy",
    cli: "ge mcp deploy",
    label: "Deploy tool plane",
    summary: "Deploy per-department MCP services",
    risk: "mutates-cloud",
    expectedDuration: "5-20m",
    requirements: {
      bins: ["gcloud"],
      config: ["project", "serviceAccount", "dataBucket"],
      cloudAuth: true,
      configWritable: true,
    },
    argv: () => ["mcp", "deploy"],
  },
  "agents.build": {
    id: "agents.build",
    method: "POST",
    path: "/api/ge/agents/build",
    cli: "ge agents build",
    label: "Build agents",
    summary: "Build selected agents through the cloud factory",
    risk: "starts-workloads",
    expectedDuration: "varies",
    observability: {
      mode: "remote-stage-logs",
      statusCommand: "ge agents status --watch",
      events: false,
    },
    requirements: {
      bins: ["gcloud"],
      config: ["project", "geAppId", "gatewayUrl"],
      cloudAuth: true,
      toolPlane: true,
    },
    argv: (body = {}) => {
      const argv = ["agents", "build"];
      if (body.scope === "canary") argv.push("--canary");
      else if (body.scope === "all") argv.push("--all");
      if (body.ids) argv.push("--ids", String(body.ids));
      if (body.dept) argv.push("--dept", String(body.dept));
      if (body.local) argv.push("--local");
      if (body.force) argv.push("--force");
      return argv;
    },
  },
  "agents.build.local": {
    id: "agents.build.local",
    method: null,
    path: null,
    cli: "ge agents build --local",
    label: "Build agents locally",
    summary: "Build selected agents on this machine via the local harness",
    risk: "starts-local-workloads",
    expectedDuration: "varies",
    observability: {
      mode: "local-factory-events",
      events: true,
      eventLog: ".ge/factory/factory-events.jsonl",
      artifacts: [
        ".ge/factory/factory-plan.json",
        ".ge/factory/FACTORY_PLAN.md",
        ".ge/factory/factory-run-*.json",
        ".ge/factory/FACTORY_RUN_*.md",
      ],
    },
    requirements: {
      bins: ["node", "uv"],
      config: ["project"],
      localToolchain: true,
    },
    argv: (body = {}) => {
      const argv = GE_COMMANDS["agents.build"].argv({ ...body, local: true });
      return argv.includes("--local") ? argv : [...argv, "--local"];
    },
  },
  "mission.run": {
    id: "mission.run",
    method: null,
    path: null,
    cli: "ge mission run",
    label: "Run mission pipeline",
    summary: "Run spec, data, simulator, build, eval, and preview gates as a resumable mission graph",
    risk: "starts-local-workloads",
    expectedDuration: "varies",
    observability: {
      mode: "runtime-events",
      events: true,
      statusCommand: "ge mission status <mission-id>",
    },
    requirements: {
      bins: ["node", "uv"],
      config: ["project"],
      localToolchain: true,
      dataGenerationRuntime: true,
    },
    argv: () => ["mission", "run"],
  },
  "agents.ship": {
    id: "agents.ship",
    method: "POST",
    path: "/api/ge/agents/ship",
    cli: "ge agents ship",
    label: "Ship agents",
    summary: "Upload locally built agents and continue cloud deployment",
    risk: "mutates-cloud",
    expectedDuration: "varies",
    observability: {
      mode: "remote-stage-logs",
      statusCommand: "ge agents status --watch",
      events: false,
    },
    requirements: {
      bins: ["gcloud"],
      config: ["project", "gatewayUrl", "dataBucket"],
      cloudAuth: true,
      toolPlane: true,
      // Ship-handoff blockers caught live mid-run: the cloud-run-proxy gcloud
      // component (ship's gateway proxy) + GE_ENABLE_AGENT_PROVISION=true on the
      // gateway. load_data also needs the BigQuery API (hard, not a soft warn).
      shipHandoff: true,
      bigQueryHard: true,
    },
    argv: (body = {}) => {
      const argv = ["agents", "ship"];
      if (body.ids) argv.push("--ids", String(body.ids));
      if (body.startStage) argv.push("--start-stage", String(body.startStage));
      if (body.targetStage) argv.push("--target-stage", String(body.targetStage));
      return argv;
    },
  },
  "agents.sync": {
    id: "agents.sync",
    method: "POST",
    path: "/api/ge/agents/sync",
    cli: "ge agents sync",
    label: "Sync generated agents",
    summary: "Copy generated agent code into the repository",
    risk: "writes-repo",
    expectedDuration: "1-5m",
    observability: {
      mode: "command-output",
      events: false,
    },
    requirements: {
      bins: ["git"],
      config: [],
    },
    argv: (body = {}) => {
      const argv = ["agents", "sync"];
      if (body.ids) argv.push("--ids", Array.isArray(body.ids) ? body.ids.join(",") : String(body.ids));
      if (body.push) argv.push("--push");
      if (body.local) argv.push("--local");
      if (body.remoteMode) argv.push("--remote-mode");
      if (body.remote) argv.push("--remote", String(body.remote));
      if (body.create) argv.push("--create");
      if (body.noCommit) argv.push("--no-commit");
      return argv;
    },
  },
  "daemon.start": {
    id: "daemon.start",
    method: "POST",
    path: "/api/ge/daemon/start",
    cli: "ge daemon start",
    label: "Start local daemon",
    summary: "Start the local GE runtime daemon (idempotent — no-op if already running)",
    risk: "starts-local-workloads",
    expectedDuration: "under 10s",
    observability: {
      mode: "command-output",
      events: false,
    },
    requirements: {
      bins: ["node"],
      config: [],
    },
    argv: () => ["daemon", "start"],
  },
};

export const GE_COMMAND_LIST = Object.values(GE_COMMANDS).map(commandMetaFromCommand);

export function commandForRoute(method, parts) {
  const path = `/${parts.join("/")}`;
  return Object.values(GE_COMMANDS).find((command) => command.method === method && command.path === path) || null;
}

export function commandMeta(id) {
  const command = GE_COMMANDS[id];
  return command ? commandMetaFromCommand(command) : null;
}

export function commandRequirements(id) {
  return GE_COMMANDS[id]?.requirements || null;
}

export function commandIds() {
  return Object.keys(GE_COMMANDS);
}

function commandMetaFromCommand(command) {
  return {
    id: command.id,
    method: command.method,
    path: command.path,
    cli: command.cli,
    label: command.label,
    summary: command.summary,
    risk: command.risk,
    expectedDuration: command.expectedDuration,
    requirements: command.requirements,
    observability: command.observability || { mode: "command-output", events: false },
  };
}
