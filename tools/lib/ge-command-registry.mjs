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
 *   - "read-only" — reads/reports state only; mutates nothing (cloud, repo,
 *     or local processes).
 *   The console types `GeCommand.risk` from `@ge/contracts`' RiskLevelSchema;
 *   parity between this table and that schema is enforced by
 *   tools/contracts-registry-parity.test.mjs (new value here → extend the
 *   contracts enum, or that test fails in CI).
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
 *     - "runtime-events" — pipeline-graph runtime events, polled via
 *       `statusCommand`.
 *   - `events` (boolean) — whether the command streams structured events.
 *   - `statusCommand` (string, optional) — CLI command to poll status.
 *   - `eventLog` (string, optional) — path to a JSONL event log.
 *   - `artifacts` (string[], optional) — generated file globs to surface.
 * - `mcp` (object, optional): presence means this command is exposed as an MCP
 *   tool by tools/mcp-server.mjs (which derives name/description/schema from
 *   here — never hand-write them there).
 *   - `tool` (string) — MCP tool name, `factory_*` convention.
 *   - `description` (string) — full tool description shown to models.
 *   - `params` (object) — flat param descriptors, keyed by param name:
 *     { type: "string"|"boolean"|"number", enum?: string[], optional?: true,
 *       description?: string }
 */
export const GE_COMMANDS = {
  // ── the golden path (capture → prove → handoff) ────────────────────────────
  // Front-door verbs; each delegates to the same core function on every
  // surface (tools/lib/golden-path.mjs via factory-core). Listed first so
  // every registry consumer (console command list, generated API reference,
  // MCP tool listing) leads with them.
  "capture": {
    id: "capture",
    method: null, // no console route: capture IS the console (the Interview)
    path: null,
    cli: "ge capture",
    label: "Capture a contract",
    summary: "Open the console Interview to capture an agent contract (starts the console if needed); --from registers an existing contract file",
    guide: {
      when: "no contract exists yet for the use case, or an already-written agent-spec.json needs registering (--from)",
      next: ["ge prove", "ge evals compile"],
    },
    risk: "starts-local-workloads",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_capture",
      description: "Start the golden path: ensures the console is running and returns the Interview deep link for conversational contract capture (document grounding, contract editing). Optional from=<path> registers an already-captured agent-spec.json with the catalog. Read-mostly: starts a local dev server if one is not already up.",
      params: {
        from: { type: "string", optional: true, description: "Path to an agent-spec.json to register" },
      },
    },
    argv: (body = {}) => ["capture", ...(body.from ? ["--from", String(body.from)] : [])],
  },
  "prove": {
    id: "prove",
    method: "POST",
    path: "/api/ge/prove",
    cli: "ge prove",
    label: "Prove the contracts",
    summary: "Prove contracts end to end: fresh machine → health check + first agent build; agents built already → rebuild their proof",
    guide: {
      when: "a contract exists and needs proving — fresh machine gets the first proof; built agents get re-proven after any contract change",
      next: ["ge handoff agents-cli", "ge prove --live --evalset <evalset> --max-cases 1"],
    },
    risk: "starts-local-workloads",
    expectedDuration: "varies",
    observability: {
      mode: "local-factory-events",
      events: true,
      eventLog: ".ge/factory/factory-events.jsonl",
    },
    requirements: {
      bins: ["node", "uv"],
      config: [],
      localToolchain: true,
    },
    mcp: {
      tool: "factory_prove",
      description: "Mutating (local): prove the current contracts. Dispatch rule: no local workspaces yet → the fresh-machine proof (health check → one validated workspace from the catalog); workspaces present → rebuild them through the harness to the build boundary (agents build). Returns the proof verdicts; hand off with factory_handoff afterwards.",
      params: {
        id: { type: "string", optional: true, description: "Prove one use-case/workspace id" },
        target: { type: "string", optional: true, description: "Stop at this stage" },
        force: { type: "boolean", optional: true },
      },
    },
    argv: (body = {}) => {
      const argv = ["prove"];
      if (body.id) argv.push("--id", String(body.id));
      if (body.target) argv.push("--target", String(body.target));
      if (body.force) argv.push("--force");
      return argv;
    },
  },
  "handoff": {
    id: "handoff",
    method: "POST",
    path: "/api/ge/handoff",
    cli: "ge handoff",
    label: "Hand off to deploy",
    summary: "Hand proven agents to a deploy target (agents-cli → Agent Engine → Gemini Enterprise)",
    guide: {
      when: "local proof passed and the agent should ship — runs only the post-boundary release stages, costs real cloud resources",
      next: ["ge agents status --watch", "ge drive"],
    },
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
      shipHandoff: true,
      bigQueryHard: true,
    },
    mcp: {
      tool: "factory_handoff",
      description: "Mutating: hand proven, locally-built agents to a deploy target. 'agents-cli' is the supported target today (uploads the prebuilt workspaces, then runs deploy→register→publish remotely). An unsupported target returns a structured what/where/why/fix error, never a stack trace. Poll the resulting cloud run(s) with factory_status.",
      params: {
        target: { type: "string", enum: ["agents-cli"], optional: true, description: "Deploy target (default agents-cli)" },
        ids: { type: "string", optional: true, description: "Comma-separated local workspace ids" },
        startStage: { type: "string", optional: true },
        targetStage: { type: "string", optional: true },
        noProxy: { type: "boolean", optional: true },
      },
    },
    argv: (body = {}) => {
      const argv = ["handoff", body.target ? String(body.target) : "agents-cli"];
      if (body.ids) argv.push("--ids", String(body.ids));
      if (body.startStage) argv.push("--start-stage", String(body.startStage));
      if (body.targetStage) argv.push("--target-stage", String(body.targetStage));
      return argv;
    },
  },
  // ── live surfaces (drive / verify / load the shipped agent) ───────────────
  // The behavioral layer over the deployed assist surface. Every command here
  // accepts a cassette (recorded stream) so consoles/CI can run it with zero
  // cloud calls; live runs are explicit and cost-guarded.
  "drive": {
    id: "drive",
    method: "POST",
    path: "/api/ge/drive",
    cli: "ge drive",
    label: "Drive the shipped agent",
    summary: "Talk to the deployed agent over its live assist surface with per-turn timing/responder instrumentation; record conversations as eval cases or cassettes",
    guide: {
      when: "a deployed agent should be exercised by hand or script — first live contact, reproducing a failure, or recording eval cases/cassettes",
      next: ["ge prove --live --evalset evals/recorded.evalset.json --max-cases 1", "ge bench --cassette <recording>"],
    },
    risk: "starts-workloads",
    expectedDuration: "varies",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_drive",
      description: "Drive the deployed agent through its live assist surface (or replay a recorded cassette with zero cloud calls). Sends the given user turns as one threaded conversation and returns the LiveTranscript: per-turn answers, timings (time-to-first-text, full response, stalls), session threading, responder-identity assertion, tool invocations, citations. Optionally records the conversation as an ADK eval case (record=<evalset path>) and/or a replayable cassette (recordCassette=<path>). Live turns burn real tokens; pass cassette=<path> for deterministic replay.",
      params: {
        turns: { type: "string", description: "User turns, one per line" },
        cassette: { type: "string", optional: true, description: "Replay this recorded cassette instead of live traffic" },
        record: { type: "string", optional: true, description: "Append the conversation to this evalset as an eval case" },
        recordId: { type: "string", optional: true, description: "Eval case id to record under" },
        recordCassette: { type: "string", optional: true, description: "Record the live stream to this cassette path" },
        targetAgent: { type: "string", optional: true, description: "Expected responding agent id (asserted against the stream)" },
        assistant: { type: "string", optional: true, description: "Assistant id on the engine (default default_assistant)" },
        strictResponder: { type: "boolean", optional: true },
      },
    },
    argv: (body = {}) => {
      const argv = ["drive", "--json"];
      // Inline turns (the documented `turns` body field, one user turn per
      // line) transport as a first-class `--turns` flag — the CLI splits it
      // into the conversation. This keeps the registry a pure data leaf (no
      // fs/temp files) while giving the console's generic dispatch a real
      // path for `{turns: "..."}`.
      if (body.turns) argv.push("--turns", String(body.turns));
      if (body.script) argv.push("--script", String(body.script));
      if (body.cassette) argv.push("--cassette", String(body.cassette));
      if (body.record) argv.push("--record", String(body.record));
      if (body.recordId) argv.push("--record-id", String(body.recordId));
      if (body.recordCassette) argv.push("--record-cassette", String(body.recordCassette));
      if (body.targetAgent) argv.push("--target-agent", String(body.targetAgent));
      if (body.assistant) argv.push("--assistant", String(body.assistant));
      if (body.strictResponder) argv.push("--strict-responder");
      return argv;
    },
  },
  "prove.live": {
    id: "prove.live",
    method: "POST",
    path: "/api/ge/prove/live",
    cli: "ge prove --live",
    label: "Prove live",
    summary: "Release verification: run evalset cases through the deployed agent's assist surface — metric grid, conformance baselines, live gate verdict",
    risk: "starts-workloads",
    expectedDuration: "varies",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_prove_live",
      description: "Release verification: run an evalset's conversations through the deployed agent's live assist surface (or a recorded cassette — deterministic, zero cloud) and return the LiveProofResult: per-case transcripts, the GE-owned metric grid (transport, session threading, responder identity, structural response match, tool trajectory where the stream exposes tools, grounding citations), conformance vs stored baselines (drift blocks), and the live gate verdict. Cost-guard live runs with maxCases/maxTurns. updateBaseline accepts current behavior as the new baseline.",
      params: {
        evalset: { type: "string", description: "Path to the ADK-compatible evalset to prove" },
        cassette: { type: "string", optional: true, description: "Replay this cassette instead of live traffic" },
        maxCases: { type: "number", optional: true },
        maxTurns: { type: "number", optional: true },
        strictResponder: { type: "boolean", optional: true },
        updateBaseline: { type: "boolean", optional: true },
        targetAgent: { type: "string", optional: true },
        assistant: { type: "string", optional: true },
      },
    },
    argv: (body = {}) => {
      const argv = ["prove", "--live", "--json"];
      if (body.evalset) argv.push("--evalset", String(body.evalset));
      if (body.cassette) argv.push("--cassette", String(body.cassette));
      if (body.maxCases) argv.push("--max-cases", String(body.maxCases));
      if (body.maxTurns) argv.push("--max-turns", String(body.maxTurns));
      if (body.strictResponder) argv.push("--strict-responder");
      if (body.updateBaseline) argv.push("--update-baseline");
      if (body.targetAgent) argv.push("--target-agent", String(body.targetAgent));
      if (body.assistant) argv.push("--assistant", String(body.assistant));
      return argv;
    },
  },
  "bench": {
    id: "bench",
    method: "POST",
    path: "/api/ge/bench",
    cli: "ge bench",
    label: "Bench against budgets",
    summary: "Load the assist surface within hard cost guards and verdict the latency/error budgets (ttft, full response, stalls, errors, responder rates)",
    guide: {
      when: "behavior is proven and latency/error budgets need a pass/fail verdict — replay a cassette first; live runs need --yes",
      next: ["ge prove --live --evalset <evalset>", "ge drive"],
    },
    risk: "starts-workloads",
    expectedDuration: "varies",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_bench",
      description: "Run N sessions × M turns at swept concurrency against the deployed assist surface and return the LiveBenchResult: nearest-rank percentiles (time-to-first-text, full response, inter-chunk stalls), error taxonomy, responder identity rates, and a pass/fail verdict against the budgets in .ge.json live.budgets. Hard guard rails (live.bench) cap sessions/turns/concurrency/duration before anything runs. A LIVE run costs real money and requires confirm=true; cassette replay (cassette=<path>) is deterministic and free.",
      params: {
        cassette: { type: "string", optional: true, description: "Replay this cassette (deterministic, no cloud, no confirm needed)" },
        sessions: { type: "number", optional: true },
        turns: { type: "number", optional: true },
        concurrency: { type: "string", optional: true, description: "Sweep, e.g. '1,2,4'" },
        targetAgent: { type: "string", optional: true },
        confirm: { type: "boolean", optional: true, description: "Required for live runs (real traffic, real cost)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["bench", "--json"];
      if (body.cassette) argv.push("--cassette", String(body.cassette));
      if (body.sessions) argv.push("--sessions", String(body.sessions));
      if (body.turns) argv.push("--turns", String(body.turns));
      if (body.concurrency) argv.push("--concurrency", String(body.concurrency));
      if (body.targetAgent) argv.push("--target-agent", String(body.targetAgent));
      if (body.confirm) argv.push("--yes");
      return argv;
    },
  },
  "evals.compile": {
    id: "evals.compile",
    method: "POST",
    path: "/api/ge/evals/compile",
    cli: "ge evals compile",
    label: "Compile behavioral evals",
    summary: "Compile a captured agent contract (or any spec envelope) into the executable behavior suite: graph, coverage, selected cases, ADK evalset, dataset, load profile",
    risk: "starts-local-workloads",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_evals_compile",
      description: "Local, deterministic: compile an agent contract into executable behavior. Reads a registered/captured spec (id=<spec-id>, or the only one when exactly one exists) or any GenerationSpecEnvelope JSON (spec=<path>), derives the capability/authority/tool-behavior graphs, over-generates conversation cases (happy paths, missing/conflicting evidence, refusals, escalations, write-tool confirmation/duplicate/cancellation/permission cases), and set-cover-selects a minimal suite. Emits graph, coverage report, selected cases, ADK evalset, agents-cli dataset, bench profile, and the metric-applicability matrix under .ge/behavioral. Feed the evalset to factory_prove_live.",
      params: {
        spec: { type: "string", optional: true, description: "Path to a GenerationSpecEnvelope JSON (bring your own)" },
        id: { type: "string", optional: true, description: "Registered spec id" },
        maxCases: { type: "number", optional: true, description: "Case budget for set-cover selection (default 40)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["evals", "compile", "--json"];
      if (body.spec) argv.push("--spec", String(body.spec));
      if (body.id) argv.push("--id", String(body.id));
      if (body.maxCases) argv.push("--max-cases", String(body.maxCases));
      return argv;
    },
  },
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
    mcp: {
      tool: "factory_mcp_deploy",
      description: "Deploy the per-department custom MCP services to Cloud Run (fleet-level).",
      params: {},
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
    mcp: {
      tool: "factory_provision",
      description: "Mutating: build agents. local=true runs on-machine via the Antigravity harness (stops at the local build boundary; use factory_handoff to hand off to the cloud afterwards); otherwise submits directly to the cloud gateway end-to-end. scope: 'canary' | 'all'; or dept/ids. Poll cloud submissions with factory_status.",
      params: {
        scope: { type: "string", enum: ["canary", "all"], optional: true },
        dept: { type: "string", optional: true },
        ids: { type: "string", optional: true },
        concurrency: { type: "string", optional: true },
        force: { type: "boolean", optional: true },
        noProxy: { type: "boolean", optional: true },
        local: { type: "boolean", optional: true },
        vertex: { type: "boolean", optional: true },
        target: { type: "string", optional: true },
        limit: { type: "string", optional: true },
      },
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
  "pipeline.run": {
    id: "pipeline.run",
    method: null,
    path: null,
    cli: "ge pipeline run",
    label: "Run the pipeline",
    summary: "Run spec, data, simulator, build, eval, and preview gates as a resumable pipeline run",
    risk: "starts-local-workloads",
    expectedDuration: "varies",
    observability: {
      mode: "runtime-events",
      events: true,
      statusCommand: "ge pipeline status <run-id>",
    },
    requirements: {
      bins: ["node", "uv"],
      config: ["project"],
      localToolchain: true,
      dataGenerationRuntime: true,
    },
    argv: () => ["pipeline", "run"],
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
    mcp: {
      tool: "factory_sync",
      description: "Mutating: sync generated agent CODE (not deploy state) to/from git. local=true pushes on-machine harness workspaces (to agentsRepo/remote); otherwise pulls the cloud-built output from GCS into generated-agents/. Distinct from factory_handoff, which releases local builds into the cloud deploy pipeline rather than syncing source.",
      params: {
        force: { type: "boolean", optional: true },
        push: { type: "boolean", optional: true },
        commit: { type: "boolean", optional: true },
        local: { type: "boolean", optional: true },
        remote: { type: "string", optional: true },
        create: { type: "boolean", optional: true },
      },
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
  // --- Read-only observe commands (no console job route: method/path null) ----
  "usecases.list": {
    id: "usecases.list",
    method: null,
    path: null,
    cli: "factory list-usecases",
    label: "List use cases",
    summary: "List the agent use-case catalog, filterable by department or search term",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_list_usecases",
      description: "List the agent use-case catalog (filterable by department/search).",
      params: {
        department: { type: "string", optional: true },
        search: { type: "string", optional: true },
        limit: { type: "number", optional: true },
      },
    },
    argv: () => ["list-usecases"],
  },
  "doctor": {
    id: "doctor",
    method: null,
    path: null,
    cli: "ge doctor",
    label: "Factory doctor",
    summary: "Preflight the factory/cloud plane health with suggested fixes",
    guide: {
      when: "anything is failing or before starting work in an unfamiliar checkout — every failed check names its fix command",
      next: ["ge", "ge prove"],
    },
    risk: "read-only",
    expectedDuration: "under 1m",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_doctor",
      description: "Preflight the FACTORY/cloud plane: required GCP APIs, IAM bindings, IAP, memory, and core service health, with suggested fixes. Scope: the factory pipeline itself (build/deploy machinery), not the per-department MCP tool services. See also: factory_mcp_doctor for MCP-service-specific checks.",
      params: {},
    },
    argv: () => ["doctor"],
  },
  "status": {
    id: "status",
    method: null,
    path: null,
    cli: "ge agents status",
    label: "Poll run status",
    summary: "Poll already-submitted cloud runs and report the stage tally per run",
    risk: "read-only",
    expectedDuration: "under 1m",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_status",
      description: "Read-only: poll already-submitted CLOUD runs (from a prior factory_provision without local=true) and return the stage tally + per-run status. Does not track local harness builds — see factory_provision's local mode for those.",
      params: {
        noProxy: { type: "boolean", optional: true },
      },
    },
    argv: (body = {}) => {
      const argv = ["agents", "status"];
      if (body.noProxy) argv.push("--no-proxy");
      return argv;
    },
  },
  "logs": {
    id: "logs",
    method: null,
    path: null,
    cli: "ge agents logs",
    label: "Fetch run logs",
    summary: "Fetch a stage's result JSON for a run",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_logs",
      description: "Fetch a stage's result JSON for a run (errors, exit codes, build log URL).",
      params: {
        runId: { type: "string" },
        stage: { type: "string", optional: true },
        item: { type: "string", optional: true },
      },
    },
    argv: (body = {}) => {
      const argv = ["agents", "logs"];
      if (body.runId) argv.push(String(body.runId));
      if (body.stage) argv.push("--stage", String(body.stage));
      if (body.item) argv.push("--item", String(body.item));
      return argv;
    },
  },
  "mcp.doctor": {
    id: "mcp.doctor",
    method: null,
    path: null,
    cli: "ge mcp doctor",
    label: "Tool-plane doctor",
    summary: "Check per-department MCP service health and Agent Registry entries",
    risk: "read-only",
    expectedDuration: "under 1m",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_mcp_doctor",
      description: "Check the TOOL plane only: per-department custom MCP service health (Cloud Run readiness) + Agent Registry entries. Narrower than factory_doctor, which covers the overall factory/cloud plane (APIs, IAM, IAP, memory) and does not inspect individual MCP services.",
      params: {},
    },
    argv: () => ["mcp", "doctor"],
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
