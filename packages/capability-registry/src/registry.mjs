/**
 * The capability registry — the single source of truth wiring every operator
 * capability into its surfaces: console route, CLI invocation, MCP tool, risk
 * level, preflight requirements, and observability shape. Every surface is a
 * consumer of this table, never a second declaration of it:
 *
 * - the `ge` CLI renders `guide`/`summary` in its help output (tools/ge/help.mjs)
 *   and derives per-command requirement checks (tools/lib/factory-core.mjs),
 * - the console serves routes from `commandForRoute` and ships
 *   `GE_COMMAND_LIST` to clients (apps/console/src/server/ge-api.mjs, via the
 *   apps/console/src/shared/ge-commands.mjs shim),
 * - the MCP server registers one tool per `mcp` block (tools/mcp-server.mjs —
 *   never hand-write a tool there),
 * - the docs site renders command cards from the same table at build time
 *   (apps/docs/src/lib/ge-commands.mjs), and the console-API reference is
 *   generated from it (tools/gen-console-api-reference.mjs).
 *
 * The field contract (risk levels, requirement keys, observability modes,
 * MCP param descriptors) lives in @ge/core-api — see
 * packages/core-api/src/capability.mjs for the closed vocabularies and their
 * meanings. `assertCapabilityTable` below validates this table against that
 * contract at import time, so a malformed entry fails every surface at load.
 *
 * Field notes beyond the kernel contract:
 * - `risk`: @ge/contracts' RiskLevelSchema is the zod twin the console types
 *   `GeCommand.risk` from; tools/contracts-registry-parity.test.mjs holds it
 *   equal to @ge/core-api's RISK_LEVELS (new value → extend both, or CI fails).
 * - `observability` defaults to `{ mode: "command-output", events: false }`
 *   via `capabilityMeta` when omitted.
 * - `mcp` presence means tools/mcp-server.mjs exposes the command as an MCP
 *   tool, deriving name/description/schema from here;
 *   tools/mcp-registry-parity.test.mjs freezes that tool surface.
 * - `argv(body)` maps a console/MCP request body to the equivalent `ge` argv —
 *   the CLI is the one execution path every surface shares.
 */
import { assertCapabilityTable, capabilityMeta } from "@ge/core-api";

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
      description: "Mutating: hand proven, locally-built agents to a deploy target. 'agents-cli' is the supported target today (uploads the prebuilt workspaces, then runs deploy→register→publish remotely). Every workspace passes the admission gate first (a recorded decision over its signed Agent Passport; audit-mode by default, enforced when .ge.json promotion.gates.admission.required is true). An unsupported target returns a structured what/where/why/fix error, never a stack trace. Poll the resulting cloud run(s) with factory_status.",
      params: {
        target: { type: "string", enum: ["agents-cli"], optional: true, description: "Deploy target (default agents-cli)" },
        ids: { type: "string", optional: true, description: "Comma-separated local workspace ids" },
        startStage: { type: "string", optional: true },
        targetStage: { type: "string", optional: true },
        noProxy: { type: "boolean", optional: true },
        force: { type: "boolean", optional: true, description: "Break-glass: release despite a denied admission decision (the override is recorded in the decision log)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["handoff", body.target ? String(body.target) : "agents-cli"];
      if (body.ids) argv.push("--ids", String(body.ids));
      if (body.startStage) argv.push("--start-stage", String(body.startStage));
      if (body.targetStage) argv.push("--target-stage", String(body.targetStage));
      if (body.force) argv.push("--force");
      return argv;
    },
  },
  "handoff.plan": {
    id: "handoff.plan",
    method: null,
    path: null,
    cli: "ge handoff plan",
    label: "Plan a handoff (dry run)",
    summary: "Report content digests and the admission verdict for a handoff, without uploading, submitting, or recording anything",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_handoff_plan",
      description: "Local, deterministic, zero cloud calls: report exactly what `ge handoff` would submit for the requested workspace(s) — content digests (workspace + contract) and the admission verdict each would get, evaluated against the same policy `ge handoff` consults but never recorded. No upload, no gateway call, no ledger write.",
      params: {
        ids: { type: "string", optional: true, description: "Comma-separated local workspace ids (default: all built locally)" },
        target: { type: "string", optional: true, description: "Deploy target the plan is for (default agents-cli)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["handoff", "plan", "--json"];
      if (body.ids) argv.push("--ids", String(body.ids));
      if (body.target) argv.push("--target", String(body.target));
      return argv;
    },
  },
  "handoff.package": {
    id: "handoff.package",
    method: null,
    path: null,
    cli: "ge handoff package",
    label: "Package a handoff",
    summary: "Build the same archive `ge handoff` uploads, to a local path, with a manifest of content digests — no upload, no cloud call",
    risk: "starts-local-workloads",
    expectedDuration: "under 30s",
    requirements: { bins: ["tar"], config: [] },
    mcp: {
      tool: "factory_handoff_package",
      description: "Local, deterministic: build the exact tar `ge handoff` uploads (same exclude list) for the requested workspace(s), to a local path instead of GCS, plus a manifest.json of content digests. Feed the output to factory_handoff_verify_package to check it for tamper/corruption before handing it off.",
      params: {
        ids: { type: "string", optional: true, description: "Comma-separated local workspace ids (default: all built locally)" },
        out: { type: "string", optional: true, description: "Output path (default ./handoff-package.tar.gz for one workspace, a directory for several)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["handoff", "package", "--json"];
      if (body.ids) argv.push("--ids", String(body.ids));
      if (body.out) argv.push("--out", String(body.out));
      return argv;
    },
  },
  "handoff.verifyPackage": {
    id: "handoff.verifyPackage",
    method: null,
    path: null,
    cli: "ge handoff verify-package",
    label: "Verify a handoff package",
    summary: "Re-extract a handoff package and compare its content digests against the manifest written at package time",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: ["tar"], config: [] },
    mcp: {
      tool: "factory_handoff_verify_package",
      description: "Local, deterministic: extract every archive a handoff package's manifest.json lists, recompute its content digest, and compare against what was recorded at package time. Reports ok:false (never throws) on a digest mismatch; throws a structured error if the manifest is missing or malformed.",
      params: {
        archive: { type: "string", description: "Path to the packaged archive (single workspace) or directory (several workspaces)" },
      },
    },
    argv: (body = {}) => ["handoff", "verify-package", String(body.archive || ""), "--json"],
  },
  // ── release admission (the passport + its gate) ─────────────────────────────
  // Contractual checks operationalized as an admission controller: the proof
  // pack becomes a signed, digest-bound Agent Passport (emit), integrity is
  // checkable offline (verify), and a recorded allow/deny decision gates the
  // handoff (admit — the same evaluation `ge handoff` enforces). Engine:
  // @ge/admission; operator wiring: tools/lib/admission/admission-ops.mjs.
  "passport.emit": {
    id: "passport.emit",
    method: "POST",
    path: "/api/ge/passport/emit",
    cli: "ge passport emit",
    label: "Emit the Agent Passport",
    summary: "Mint the consolidated signed Agent Passport for a proven workspace: subject digests plus DSSE attestations over the proof pack",
    guide: {
      when: "local proof passed and the workspace should carry verifiable evidence to the admission gate — after ge prove, before ge handoff",
      next: ["ge passport admit <id>", "ge handoff agents-cli"],
    },
    risk: "starts-local-workloads",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_passport_emit",
      description: "Local, deterministic: mint the signed Agent Passport (artifacts/agent-passport.json) for one locally-built workspace. Computes the subject identity (sha256 over everything that ships, evidence excluded, plus the contract digest) and signs in-toto/DSSE attestations over the promotion packet (and the live proof result when one exists) with the local Ed25519 issuing key (.ge/keys/, generated on first use). Requires the workspace to have a promotion packet — run factory_prove first.",
      params: {
        id: { type: "string", description: "Local workspace id (or use-case id)" },
      },
    },
    argv: (body = {}) => ["passport", "emit", String(body.id || ""), "--json"],
  },
  "passport.verify": {
    id: "passport.verify",
    method: "POST",
    path: "/api/ge/passport/verify",
    cli: "ge passport verify",
    label: "Verify the Agent Passport",
    summary: "Verify a passport's integrity: attestation signatures, and digest binding to the workspace bytes on disk",
    risk: "read-only",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_passport_verify",
      description: "Read-only: verify one workspace's Agent Passport offline — every DSSE attestation signature against the trusted key, and the subject binding (workspace digest + contract digest recomputed from the bytes on disk). A failed check means the evidence no longer describes this workspace (tampered, or changed since issuance) — re-prove and re-emit.",
      params: {
        id: { type: "string", description: "Local workspace id (or use-case id)" },
      },
    },
    argv: (body = {}) => ["passport", "verify", String(body.id || ""), "--json"],
  },
  "passport.admit": {
    id: "passport.admit",
    method: "POST",
    path: "/api/ge/passport/admit",
    cli: "ge passport admit",
    label: "Run the admission gate",
    summary: "Evaluate the admission gate over the passport (policy: .ge.json promotion.gates.admission) and record the allow/deny decision",
    guide: {
      when: "before a release, or in CI — the same decision ge handoff enforces, runnable standalone; the decision is recorded either way",
      next: ["ge handoff agents-cli"],
    },
    risk: "starts-local-workloads",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_passport_admit",
      description: "Local: run the admission gate for one workspace and return the AdmissionDecision — verified passport + recomputed digests + policy (.ge.json promotion.gates.admission: required, maxAgeDays, requireLiveProof, requireFreshProofBinding) → allowed true/false with stable GEADM001–GEADM009 blockers, each naming its fix command. The decision is recorded to the workspace's artifacts/admission-decision.json and the append-only .ge/admission/decisions.jsonl audit log. Audit-mode by default (required=false): denials are recorded, only a required gate refuses.",
      params: {
        id: { type: "string", description: "Local workspace id (or use-case id)" },
        stage: { type: "string", optional: true, description: "Stage the decision is for (default handoff)" },
        force: { type: "boolean", optional: true, description: "Break-glass: exit 0 despite a denial (recorded)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["passport", "admit", String(body.id || ""), "--json"];
      if (body.stage) argv.push("--stage", String(body.stage));
      if (body.force) argv.push("--force");
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
  "evals.import": {
    id: "evals.import",
    method: "POST",
    path: "/api/ge/evals/import",
    cli: "ge evals import",
    label: "Import an evalset",
    summary: "Import a bring-your-own ADK-compatible evalset into .ge/behavioral, alongside compiled suites, so it is discoverable by coverage/prove",
    risk: "starts-local-workloads",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_evals_import",
      description: "Import a bring-your-own ADK-compatible evalset file into .ge/behavioral/<id>.evalset.json (same location/naming `ge evals compile` uses), validating it via the shared ADK evalset loader. Returns {id, out, cases, turns, source}.",
      params: {
        evalset: { type: "string", description: "Path to an external ADK-compatible evalset JSON file" },
        id: { type: "string", optional: true, description: "Id to store the evalset under (default: the file's own evalSetId, or a filename slug)" },
        force: { type: "boolean", optional: true, description: "Overwrite an existing evalset with the same id" },
      },
    },
    argv: (body = {}) => {
      const argv = ["evals", "import", "--json"];
      if (body.evalset) argv.push("--evalset", String(body.evalset));
      if (body.id) argv.push("--id", String(body.id));
      if (body.force) argv.push("--force");
      return argv;
    },
  },
  "evals.coverage": {
    id: "evals.coverage",
    method: null,
    path: null,
    cli: "ge evals coverage",
    label: "Eval coverage report",
    summary: "Report per-dimension coverage (required/covered/gaps) from the last `ge evals compile`, optionally scoped to one evalset id",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_evals_coverage",
      description: "Read the coverage.json a prior `ge evals compile` wrote and return it plus a derived summary: per-dimension {required,covered,gapCount}, overall totals, and a flattened gap list. If id is given, also requires and returns {evalset:{path,cases}} for that id's <id>.evalset.json (compiled or imported).",
      params: {
        id: { type: "string", optional: true, description: "Evalset id to also report case counts for (compiled or imported)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["evals", "coverage", "--json"];
      if (body.id) argv.push("--id", String(body.id));
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
  "data.synth": {
    id: "data.synth",
    method: "POST",
    path: "/api/ge/data/synth",
    cli: "ge data synth",
    label: "Synthesize simulator seed",
    summary: "Generate deterministic synthetic seed data for a simulator system twin (pack contract → recipe → seeded rows → seed.json), with an opt-in statistical realism profile",
    risk: "writes-repo",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["node"], config: [] },
    mcp: {
      tool: "factory_data_synth",
      description: "Local, deterministic: synthesize seed data for a simulator system twin. Resolves the pack contract (system=<id> under apps/factory/simulator-systems/), builds a normalized recipe, realizes rows — Snowfakery tier when on PATH, offline in-process tier otherwise; profile=realistic switches to the statistical realism tier (skewed distributions, a shared persona pool, seeded edge cases) — applies materialization, merges scenario-coverage rows, verifies FK closure, and writes the pack's seed.json (or out=<path>). Identical (system, seed, profile) inputs produce identical bytes; no cloud calls.",
      params: {
        system: { type: "string", description: "Simulator system id (resolved under apps/factory/simulator-systems/)" },
        seed: { type: "number", optional: true, description: "Deterministic seed (default 42)" },
        profile: { type: "string", enum: ["baseline", "realistic"], optional: true, description: "Realization profile (default baseline)" },
        edgeCaseRate: { type: "number", optional: true, description: "Edge-case fraction for profile=realistic, 0..1 (default 0.06)" },
        out: { type: "string", optional: true, description: "Seed output path (default: the pack's own seed.json)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["data", "synth", "--json"];
      if (body.system) argv.push("--system", String(body.system));
      if (body.seed !== undefined) argv.push("--seed", String(body.seed));
      if (body.profile) argv.push("--profile", String(body.profile));
      if (body.edgeCaseRate !== undefined) argv.push("--edge-case-rate", String(body.edgeCaseRate));
      if (body.out) argv.push("--out", String(body.out));
      return argv;
    },
  },
  // ── the OKF agent lifecycle (customize → register → track) ────────────────
  // One bundle per agent under the OKF corpus root (GE_OKF_ROOT, default
  // okf/); the bundle is the agent's source of truth and the generated
  // catalog is compiled FROM it (`bun run catalog`).
  "okf.customize": {
    id: "okf.customize",
    method: "POST",
    path: "/api/ge/okf/customize",
    cli: "ge okf customize",
    label: "Customize an agent",
    summary: "Customize a base agent into a new variant OKF bundle (system swaps, terminology rewrites, vertical policy overlay) and compile it against the base",
    guide: {
      when: "an existing agent should be adapted — same behavior contract, different source systems, vocabulary, or vertical policy",
      next: ["ge agents register --bundle <id>", "ge okf compile --from bundle --to spec --bundle <dir> --out <spec.json>"],
    },
    risk: "writes-repo",
    expectedDuration: "under 10s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["node"], config: [] },
    mcp: {
      tool: "factory_okf_customize",
      description: "Local, deterministic: customize a base agent's bundle into a new variant OKF bundle. Writes the minimal variant (root index.md declaring variant_of/variant_kind + a Variant Binding concept) under the OKF corpus root, then immediately compiles it against the base with full variant resolution — a bad swap target or unknown term comes back as a structured error, never a silent no-op. base/id are agent ids under okf/ (or explicit paths). Register the result with factory_agents_register.",
      params: {
        base: { type: "string", description: "Base agent id (under the OKF corpus root) or bundle directory" },
        id: { type: "string", description: "New agent id for the variant" },
        swapSystem: { type: "string", optional: true, description: "System swaps, comma-separated <from>=<to> pairs" },
        rename: { type: "string", optional: true, description: "Terminology rewrites, comma-separated <term>=<replacement> pairs" },
        vertical: { type: "string", optional: true, description: "Vertical name (sets variant_kind vertical + a policy-overlay stub)" },
        out: { type: "string", optional: true, description: "Output bundle directory (default <okf root>/<id>)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["okf", "customize", "--json"];
      if (body.base) argv.push("--base", String(body.base));
      if (body.id) argv.push("--id", String(body.id));
      if (body.swapSystem) argv.push("--swap-system", String(body.swapSystem));
      if (body.rename) argv.push("--rename", String(body.rename));
      if (body.vertical) argv.push("--vertical", String(body.vertical));
      if (body.out) argv.push("--out", String(body.out));
      return argv;
    },
  },
  "agents.register": {
    id: "agents.register",
    method: "POST",
    path: "/api/ge/agents/register",
    cli: "ge agents register",
    label: "Register an agent",
    summary: "Register an OKF bundle as a tracked agent: compile it, flip provenance draft→registered (version +1), and refresh the generated catalog",
    guide: {
      when: "a bundle (interview-emitted, migrated, or customized) says what it means and should become a tracked, buildable agent",
      next: ["ge agents track --id <id>", "ge agents build --ids <id> --local"],
    },
    risk: "writes-repo",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_agents_register",
      description: "Mutating (repo): register an OKF bundle as a tracked agent. Compiles the bundle (variant resolution included) and fails with the compiler's structured errors if it does not resolve; on success flips provenance_status draft→registered in the bundle's root index.md, bumps provenance_version by one, stamps the owner, and re-runs the catalog regeneration so the generated registry picks the agent up. Returns {agentId, version, status, catalogEntry}.",
      params: {
        bundle: { type: "string", description: "Agent id (under the OKF corpus root) or bundle directory" },
        owner: { type: "string", optional: true, description: "Owner email to stamp into provenance" },
      },
    },
    argv: (body = {}) => {
      const argv = ["agents", "register", "--json"];
      if (body.bundle) argv.push("--bundle", String(body.bundle));
      if (body.owner) argv.push("--owner", String(body.owner));
      return argv;
    },
  },
  "create.fromLibrary": {
    id: "create.fromLibrary",
    method: "POST",
    path: "/api/ge/create",
    cli: "ge create",
    label: "Create from Agent Library",
    summary: "Materialize a receipt-backed agent workspace from a resolved Agent Library blueprint (OKF contract copy, stub app/twins/evals/proof scaffolding, ge.lock.json)",
    guide: {
      when: "a library blueprint (from library.search/inspect) is ready to become a working local agent workspace",
      next: ["ge prove", "ge library status <slug>"],
    },
    risk: "writes-repo",
    expectedDuration: "under 30s",
    observability: { mode: "command-output", events: false },
    requirements: { bins: ["bun"], config: [] },
    mcp: {
      tool: "factory_library_create",
      description: "Mutating (repo): resolve a library blueprint and materialize a new agent workspace from it — copies the OKF contract, writes stub app/twins/evals/proof scaffolding, runs a smoke proof unless noSmoke, and writes ge.lock.json. Fails with GE-CREATE-EXISTS if outDir already exists and force is not set. Same core as `ge create --from-library`.",
      params: {
        slug: { type: "string", description: "Library blueprint slug to create from" },
        out: { type: "string", optional: true, description: "Output workspace directory (default: the blueprint's leaf name)" },
        overlay: { type: "string", optional: true, description: "Path to a policy-overlay file to attach to the lock" },
        target: { type: "string", optional: true, description: "Build target (default adk)" },
        dryRun: { type: "boolean", optional: true, description: "Report the plan without writing files" },
        noSmoke: { type: "boolean", optional: true, description: "Skip the smoke proof pass" },
        force: { type: "boolean", optional: true, description: "Overwrite an existing output directory" },
      },
    },
    argv: (body = {}) => {
      const argv = ["create", "--json"];
      if (body.slug) argv.push("--from-library", String(body.slug));
      if (body.out) argv.push("--out", String(body.out));
      if (body.overlay) argv.push("--overlay", String(body.overlay));
      if (body.target) argv.push("--target", String(body.target));
      if (body.dryRun) argv.push("--dry-run");
      if (body.noSmoke) argv.push("--no-smoke");
      if (body.force) argv.push("--force");
      return argv;
    },
  },
  "systems.synth": {
    id: "systems.synth",
    // No console route yet -- the console keeps its bespoke POST
    // /api/systems/synthesize route (apps/console/src/server/ge-api-router.mjs),
    // now bound onto the same @ge/byo-systems core as this CLI/MCP surface.
    // Unifying the console route onto this registry entry is a future step,
    // not part of this pass.
    method: null,
    path: null,
    cli: "ge systems synth",
    label: "Synthesize a BYO system",
    summary: "Synthesize a brand-new live simulator system from a natural-language description, samples, or an OpenAPI spec, by spawning the generator's synthesize_cli.py",
    risk: "writes-repo",
    expectedDuration: "under 2m",
    requirements: { bins: ["node"], config: [], dataGenerationRuntime: true },
    mcp: {
      tool: "factory_systems_synth",
      description: "Mutating (repo, only with promote:true): synthesize a brand-new live simulator system from a natural-language description, samples, or an OpenAPI spec by spawning the generator's synthesize_cli.py. Without promote, the result lives only in the spawned process's in-process overlay and is not durable. Provide description (mode: nl, default), or fromOpenapi, or fromSamples.",
      params: {
        name: { type: "string", optional: true, description: "Display name for the synthesized system" },
        description: { type: "string", optional: true, description: "Natural-language description (mode: nl, the default)" },
        fromOpenapi: { type: "string", optional: true, description: "Path to an OpenAPI/Swagger JSON spec (mode: openapi)" },
        fromSamples: { type: "string", optional: true, description: "Path to a JSON file of {collection: [rows]} (mode: samples)" },
        promote: { type: "boolean", optional: true, description: "Also persist the result into the curated corpus (registry.json + per-section files)" },
      },
    },
    argv: (body = {}) => {
      const argv = ["systems", "synth", "--json"];
      if (body.name) argv.push("--name", String(body.name));
      if (body.description) argv.push("--description", String(body.description));
      if (body.fromOpenapi) argv.push("--from-openapi", String(body.fromOpenapi));
      if (body.fromSamples) argv.push("--from-samples", String(body.fromSamples));
      if (body.promote) argv.push("--promote");
      return argv;
    },
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
  "console.deploy": {
    id: "console.deploy",
    method: "POST",
    path: "/api/ge/console/deploy",
    cli: "ge console deploy",
    label: "Deploy the console UI",
    summary: "Build the operator console image (Cloud Build) and bind it via terraform apply (Terraform owns Cloud Run config; installer/terraform/ui_services.tf)",
    risk: "mutates-cloud",
    expectedDuration: "5-15m",
    requirements: {
      bins: ["gcloud", "terraform"],
      config: ["project", "geAppId"],
      cloudAuth: true,
      terraformRoot: true,
      configWritable: true,
    },
    // No `mcp` block: widening the MCP tool surface to a cloud build+deploy is a
    // deliberate follow-up, not bundled with this wiring — see docsNotes.
    argv: (body = {}) => {
      const argv = ["console", "deploy", "--json"];
      if (body.tag) argv.push("--tag", String(body.tag));
      if (body.noApply) argv.push("--no-apply");
      return argv;
    },
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
      tool: "factory_agents_build",
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
        detach: { type: "boolean", optional: true, description: "Local mode only: submit to the runtime daemon and return the run id immediately" },
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
      if (body.detach && body.local) argv.push("--detach");
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
      tool: "factory_usecases_list",
      description: "List the agent use-case catalog (filterable by department/search).",
      params: {
        department: { type: "string", optional: true },
        search: { type: "string", optional: true },
        limit: { type: "number", optional: true },
      },
    },
    argv: () => ["list-usecases"],
  },
  "library.stats": {
    id: "library.stats",
    method: null,
    path: null,
    cli: "ge library stats",
    label: "Agent Library stats",
    summary: "Show Agent Library inventory counts (blueprints, verticals, buildable, proven) from the generated index",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_library_stats",
      description: "Read the generated Agent Library index (okf/library/index.json, regenerated on first read if missing) and return its inventory counts: total blueprints, distinct verticals/departments, and buildable/proven counts.",
      params: {},
    },
    argv: () => ["library", "stats", "--json"],
  },
  "library.search": {
    id: "library.search",
    method: null,
    path: null,
    cli: "ge library search",
    label: "Search Agent Library",
    summary: "Search Agent Library blueprints by free-text query, optionally filtered by department, capped at a result limit",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_library_search",
      description: "Free-text search over the generated Agent Library index (matches across the whole blueprint record — title, taxonomy, behavior, inventory), optionally filtered to an exact department match, capped at limit results (default: every match). Same core as `ge library search`.",
      params: {
        query: { type: "string", optional: true, description: "Free-text search query" },
        department: { type: "string", optional: true, description: "Filter to an exact taxonomy.department match" },
        limit: { type: "number", optional: true, description: "Cap the number of returned blueprints" },
      },
    },
    argv: (body = {}) => {
      const argv = ["library", "search", "--json"];
      if (body.query) argv.push(String(body.query));
      if (body.department) argv.push("--department", String(body.department));
      return argv;
    },
  },
  "library.inspect": {
    id: "library.inspect",
    method: null,
    path: null,
    cli: "ge library inspect",
    label: "Inspect a blueprint",
    summary: "Inspect a single Agent Library blueprint's full metadata (taxonomy, behavior contract, inventory, targets, commands)",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_library_inspect",
      description: "Resolve one Agent Library blueprint by slug, id, or leaf name (via the generated index) and return its full AgentBlueprint record. Throws a GE-LIB-404-coded error for an unknown slug — same core as `ge library inspect`.",
      params: {
        slug: { type: "string", description: "Blueprint slug (e.g. banking/aml-alert-investigation-agent), id, or leaf name" },
      },
    },
    argv: (body = {}) => {
      const argv = ["library", "inspect", "--json"];
      if (body.slug) argv.push(String(body.slug));
      return argv;
    },
  },
  "library.status": {
    id: "library.status",
    method: null,
    path: null,
    cli: "ge library status",
    label: "Blueprint readiness",
    summary: "Show a blueprint's computed lifecycle readiness state and next command",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_library_status",
      description: "Compute a blueprint's lifecycle readiness state (one of READINESS_STATES, e.g. contract_valid/evals_ready) plus its next recommended command. Same core as `ge library status`.",
      params: {
        slug: { type: "string", description: "Blueprint slug, id, or leaf name" },
      },
    },
    argv: (body = {}) => {
      const argv = ["library", "status", "--json"];
      if (body.slug) argv.push(String(body.slug));
      return argv;
    },
  },
  "systems.list": {
    id: "systems.list",
    method: null,
    path: null,
    cli: "ge systems list",
    label: "List BYO systems",
    summary: "List the built-in simulated systems known to the generator's registry.json (id/displayName/maturity/family)",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_systems_list",
      description: "Read-only: list the built-in simulated systems known to the generator's registry.json (id/displayName/maturity/family).",
      params: {},
    },
    argv: () => ["systems", "list", "--json"],
  },
  "systems.doctor": {
    id: "systems.doctor",
    method: null,
    path: null,
    cli: "ge systems doctor",
    label: "BYO-systems doctor",
    summary: "Check the BYO-systems toolchain: python interpreter, synthesize_cli.py presence, registry.json parseability, and the overlay-backend durability setting",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_systems_doctor",
      description: "Read-only: check the BYO-systems toolchain (python interpreter resolvable + runnable, synthesize_cli.py present, registry.json parseable + system count, GE_SIMULATOR_OVERLAY_BACKEND value/durability note). Never throws on a failed check; returns {ok, checks[]}.",
      params: {},
    },
    argv: () => ["systems", "doctor", "--json"],
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
      description: "Read-only: poll already-submitted CLOUD runs (from a prior factory_agents_build without local=true) and return the stage tally + per-run status. Does not track local harness builds — see factory_agents_build's local mode for those.",
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
  "agents.track": {
    id: "agents.track",
    method: null,
    path: null,
    cli: "ge agents track",
    label: "Track an agent",
    summary: "Report one agent's lifecycle state: provenance block, registry presence, and the variant lineage chain back to the root base",
    risk: "read-only",
    expectedDuration: "under 10s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_agents_track",
      description: "Read-only: report one agent's lifecycle state from its OKF bundle. Returns the provenance block (origin, status draft|registered|promoted|retired, version, owner), whether the generated registry currently carries the agent, and the variant lineage chain — variant_of walked bundle by bundle to the root base, with missing links and cycles called out.",
      params: {
        id: { type: "string", description: "Agent id (under the OKF corpus root) or bundle directory" },
      },
    },
    argv: (body = {}) => {
      const argv = ["agents", "track", "--json"];
      if (body.id) argv.push("--id", String(body.id));
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
  "console.doctor": {
    id: "console.doctor",
    method: null,
    path: null,
    cli: "ge console doctor",
    label: "Console doctor",
    summary: "Check the console Cloud Run service readiness + config (read-only)",
    risk: "read-only",
    expectedDuration: "under 30s",
    requirements: { bins: [], config: [] },
    mcp: {
      tool: "factory_console_doctor",
      description: "Check the operator console's Cloud Run service (readiness, IAP, GE_CONSOLE_READONLY) plus config (console_image binding via terraform output, terraform root present, gatewayUrl configured). Read-only; never throws — always returns a report, even against an undeployed console or missing project. Returns {ok, checks[]}.",
      params: {},
    },
    argv: () => ["console", "doctor"],
  },
};

// Fail every surface at import if the table drifts from the kernel contract.
assertCapabilityTable(GE_COMMANDS);

export const GE_COMMAND_LIST = Object.values(GE_COMMANDS).map(capabilityMeta);

export function commandForRoute(method, parts) {
  const path = `/${parts.join("/")}`;
  return Object.values(GE_COMMANDS).find((command) => command.method === method && command.path === path) || null;
}

export function commandMeta(id) {
  const command = GE_COMMANDS[id];
  return command ? capabilityMeta(command) : null;
}

export function commandRequirements(id) {
  return GE_COMMANDS[id]?.requirements || null;
}

export function commandIds() {
  return Object.keys(GE_COMMANDS);
}
