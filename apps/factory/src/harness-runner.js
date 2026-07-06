import { spawn } from "node:child_process";
import { parseList } from "@ge/std/list";
import { randomUUID } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, delimiter, join, resolve, sep } from "node:path";
import { loadConfig } from "c12";
import { splitLines } from "@ge/runtime/events";
import { readDotEnv } from "./dotenv.mjs";
import { agentSupportsInteraction, detectAgents, getAgentDef } from "./agents.js";
import { buildHandoffPacket, buildHarnessRunPlan } from "./harness-runtime.js";
import { openJournal, recordRun } from "./harness-journal.js";
import { writeJson } from "@ge/std/json-io";
import { resolveGcpProject } from "@ge/std/gcp-config";
import { createOutputParser, detectFormat } from "./output-parsers.js";
import { readSecretsEnv } from "./secrets.js";
import { loadSkillRegistry, materializeSkillsForWorkspace, selectSkillsForContext } from "./skill-registry.js";
import { renderSystemPrompt } from "./systems.js";
import {
  GENERATOR_DATA_ROOT,
  GENERATOR_SKILLS_MANIFEST,
  GENERATOR_UV_CACHE,
} from "./state-paths.js";

// Build a concise "Spec workflow to validate against" section for the harness
// review/refine prompt. Sourced from the agent-workflow sidecar the generator
// emits (artifacts/agent-workflow.json); additive — returns null when absent so
// the existing prompt is unchanged for workspaces generated before this landed.
function buildSpecWorkflowSection(workspaceDir) {
  try {
    const sidecar = join(workspaceDir, "artifacts", "agent-workflow.json");
    if (!existsSync(sidecar)) return null;
    const wf = JSON.parse(readFileSync(sidecar, "utf8"));
    const lines = ["# Spec workflow to validate against"];
    lines.push(`Expected agent topology: ${wf.topology}.`);
    if (wf.topology === "single") {
      lines.push("- The emitted app/agent.py MUST be a single root Agent(...) with tools=source_adapters.");
      lines.push("- It must NOT use SequentialAgent/ParallelAgent or _pick(...).");
    } else {
      const cls = wf.topology === "parallel" ? "ParallelAgent" : "SequentialAgent";
      lines.push(`- The root agent MUST be a ${cls} with one sub-agent per stage (${(wf.steps || []).length} stages).`);
      for (const step of wf.steps || []) {
        const tools = (step.toolNames || []).join(", ") || "(no tools)";
        lines.push(`  - Stage "${step.label}" (id=${step.id}) → tools: ${tools}`);
      }
      lines.push("- Each sub-agent's _pick(...) tools must match its stage exactly; no tools may leak across stages.");
    }
    if (Array.isArray(wf.expectedTools) && wf.expectedTools.length) {
      lines.push(`- Every expected tool must be reachable: ${wf.expectedTools.join(", ")}.`);
    }
    lines.push("- The three guardrail callbacks (initialize_workflow_state, enforce_tool_contract, capture_tool_evidence) must be present and wired.");
    lines.push("Verify the generated topology matches this spec and correct app/agent.py if it does not (tools.py must stay unchanged).");
    return lines.join("\n");
  } catch {
    return null;
  }
}

// Build a "Query/Test coverage to validate against" section from the OKF coverage
// sidecar (artifacts/okf-coverage.json) the generator emits. OKF is the spec
// spine: it states what queries the agent answers + how each is tested. This
// asks the harness to confirm the built agent COVERS every Query Capability (its
// tools reachable in the topology) and that every Eval Scenario's mechanisms are
// callable. Additive — returns null when the sidecar is absent (older workspaces).
function buildSpecCoverageSection(workspaceDir) {
  try {
    const sidecar = join(workspaceDir, "artifacts", "okf-coverage.json");
    if (!existsSync(sidecar)) return null;
    const cov = JSON.parse(readFileSync(sidecar, "utf8"));
    const queries = Array.isArray(cov.queries) ? cov.queries : [];
    const tests = Array.isArray(cov.tests) ? cov.tests : [];
    if (!queries.length && !tests.length) return null;
    const lines = ["# Query/Test coverage to validate against (OKF spine)"];
    if (queries.length) {
      lines.push("Every Query Capability the agent claims to answer — each tool MUST be reachable from some (sub-)agent:");
      for (const q of queries) {
        const tools = (q.tools || []).join(", ") || "(no tools)";
        lines.push(`  - Query "${q.request}" (id=${q.id})${q.stage ? ` [stage ${q.stage}]` : ""} → tools: ${tools}`);
      }
    }
    if (tests.length) {
      lines.push("Every Eval Scenario's mechanisms — these tools MUST be callable (present in _TOOLS_BY_NAME / source_adapters):");
      for (const t of tests) {
        const mech = (t.mechanisms || []).join(", ") || "(none)";
        lines.push(`  - Test id=${t.id}${t.validates ? ` (validates ${t.validates})` : ""} → mechanisms: ${mech}`);
      }
    }
    lines.push("If any query's tool or any test's mechanism is NOT reachable/callable in app/agent.py, that is a COVERAGE GAP: when write-enabled, correct app/agent.py to wire the missing tool into the right stage; otherwise flag the gap precisely. tools.py must stay unchanged.");
    return lines.join("\n");
  } catch {
    return null;
  }
}

// Build a "Subagent validation plan" section that tells a write-enabled harness
// to delegate each INDEPENDENT validation dimension (topology, OKF query
// coverage, eval mechanisms) to its own subagent — each reads only what it needs
// and returns a compact verdict, keeping the parent context clean — then
// synthesize and fix. Subagent delegation is model-driven, so this guides an
// already-enabled capability rather than forcing it. Returns null when subagents
// are unavailable, the opt-out env is set, or no validation sidecar exists
// (additive: older workspaces and read-only runs are unchanged).
function buildSubagentPlanSection(workspaceDir, { subagentsAvailable = false } = {}) {
  if (!subagentsAvailable) return null;
  const optOut = String(process.env.GE_HARNESS_NO_SUBAGENT_FANOUT || "").toLowerCase();
  if (["1", "true", "yes", "on"].includes(optOut)) return null;
  const hasWorkflow = existsSync(join(workspaceDir, "artifacts", "agent-workflow.json"));
  const hasCoverage = existsSync(join(workspaceDir, "artifacts", "okf-coverage.json"));
  if (!hasWorkflow && !hasCoverage) return null;
  const dimensions = [];
  if (hasWorkflow) {
    dimensions.push('- "topology": app/agent.py matches the spec workflow — agent kind, per-stage tools, and the three guardrail callbacks (see the spec-workflow section).');
  }
  if (hasCoverage) {
    dimensions.push('- "okf_query_coverage": every Query Capability\'s tools are reachable in the built topology (see the OKF coverage section).');
    dimensions.push('- "eval_mechanisms": every Eval Scenario\'s mechanisms are callable from some (sub-)agent (see the OKF coverage section).');
  }
  return [
    "# Subagent validation plan",
    "This workspace has independent validation dimensions. To review each thoroughly without saturating your own context, delegate each dimension below to a subagent (start_subagent). Each subagent should read only what it needs and return a compact JSON verdict {\"dimension\":\"...\",\"status\":\"pass|partial|fail\",\"gaps\":[]}.",
    ...dimensions,
    `Spawn at most ${dimensions.length} subagents (one per dimension). Then, in the parent, synthesize their verdicts, apply any fixes (respecting the write rules above), and return the required output schema.`,
  ].join("\n");
}


// Load the workspace .ge.json via c12 (cwd = repoRoot). c12 brings layered
// resolution — `extends`, NODE_ENV overlays (.ge.<env>.json / $env keys) and
// .config/ge.json — over the previous bespoke read. It resolves the file at
// repoRoot (the location resolveVertexDefaults always defaulted to); it does not
// walk above the repo, which only ever risked picking up a stray external .ge.json.
async function loadGeConfig(repoRoot) {
  const { config } = await loadConfig({ cwd: resolve(repoRoot || process.cwd()), configFile: ".ge.json" });
  return config || {};
}

async function resolveVertexDefaults({ repoRoot, project, location, vertex }) {
  const cfg = await loadGeConfig(repoRoot);
  const resolvedProject = resolveGcpProject({ explicit: project, fallbackEnvVars: ["GCP_PROJECT_ID"] }) || cfg.project || null;
  const resolvedLocation = location
    || process.env.GOOGLE_CLOUD_LOCATION
    || process.env.GOOGLE_GENAI_LOCATION
    || process.env.GEMINI_ENTERPRISE_LOCATION
    || cfg.geLocation
    || "global";
  return {
    vertex,
    project: resolvedProject,
    location: resolvedLocation,
  };
}

// Interaction-form support for adapters that speak the request_user_input MCP
// bridge (claude, codex — the declarative supportsInteraction capability): tell
// the model the bridge exists and when to use it. The Antigravity driver has
// its own native interaction hook (and its own instructions). Returns null for
// adapters without the capability, or with no interaction dir — existing
// prompts are byte-unchanged.
function buildInteractionSection(adapterId, interactionDir) {
  if (!interactionDir || !agentSupportsInteraction(adapterId)) return null;
  return [
    "# Asking the operator",
    "When you need structured input from the human operator — interview answers, choices between options, confirmations — call the `request_user_input` tool (ge-interaction MCP server). It renders a form in the operator's console and blocks until they answer. Never invent answers the operator should give; ask instead.",
  ].join("\n");
}

// Watch the interaction dir's requests/ for forms written by an adapter-side
// bridge (claude-interaction-mcp.mjs) and surface each as the SAME
// antigravity.interaction_request status event the console's Interview view
// already renders. The Antigravity driver reports its own requests on stderr,
// so the watcher only runs for other adapters. Returns a stop() disposer.
function watchInteractionRequests({ interactionDir, onRequest, pollMs = 500 }) {
  const requestsDir = join(interactionDir, "requests");
  const seen = new Set();
  const scan = () => {
    let entries = [];
    try {
      entries = readdirSync(requestsDir).filter((name) => name.endsWith(".json"));
    } catch {
      return; // dir may not exist until the bridge's first question
    }
    for (const name of entries) {
      if (seen.has(name)) continue;
      seen.add(name);
      try {
        const request = JSON.parse(readFileSync(join(requestsDir, name), "utf8"));
        if (request?.id && request?.form) onRequest(request);
      } catch {
        seen.delete(name); // partially-written file — retry on the next tick
      }
    }
  };
  const timer = setInterval(scan, pollMs);
  timer.unref?.();
  return () => {
    clearInterval(timer);
    scan(); // final sweep so a request written just before exit still surfaces
  };
}

// Prompt-level guardrail fallback for adapters without the Antigravity SDK's
// native protect-file/disable-tool enforcement (the Claude Code, Codex, and
// Gemini CLI compat adapters): state the constraints in the prompt so a
// write-enabled run on those adapters still respects them. Returns null for
// the native adapter or when nothing is constrained — existing prompts are
// byte-unchanged.
function buildCompatGuardrailSection(adapterId, { protectFiles = [], disableTools = [] } = {}) {
  if (adapterId === "antigravity-sdk") return null;
  const lines = [];
  if (protectFiles.length) lines.push(`- Do NOT modify these protected files: ${protectFiles.join(", ")}. Treat them as read-only.`);
  if (disableTools.length) lines.push(`- These capabilities are disabled for this run — never perform them: ${disableTools.join(", ")}.`);
  if (!lines.length) return null;
  return ["# Guardrails", ...lines].join("\n");
}

export const __test = {
  createLineBuffer,
  loadGeConfig,
  parseAntigravityStatusLines,
  resolveVertexDefaults,
  buildSubagentPlanSection,
  buildCompatGuardrailSection,
  buildInteractionSection,
  watchInteractionRequests,
};

function materializeWorkspaceCommandShims({ workspaceDir, repoRoot }) {
  const binDir = join(workspaceDir, ".ge-harness", "bin");
  mkdirSync(binDir, { recursive: true });
  const shims = [
    ["ge", ["src", "cli.js"]],
    ["factory", ["scripts", "factory.mjs"]],
  ];
  for (const [name, parts] of shims) {
    const target = join(repoRoot, ...parts);
    const path = join(binDir, name);
    writeFileSync(path, `#!/usr/bin/env bash\nexec "${process.execPath}" "${target}" "$@"\n`, "utf8");
    chmodSync(path, 0o755);
  }
  return binDir;
}

function buildHarnessEnv({ repoRoot, dataRoot, workspaceDir, binDir, extra = {} }) {
  const env = {};
  const exact = [
    "PATH", "HOME", "USER", "LOGNAME", "SHELL", "TMPDIR", "TEMP", "TMP",
    "LANG", "LC_ALL", "SSL_CERT_FILE", "REQUESTS_CA_BUNDLE",
  ];
  for (const key of exact) {
    if (process.env[key]) env[key] = process.env[key];
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (
      key === "GOOGLE_CLOUD_PROJECT" ||
      key === "GOOGLE_CLOUD_LOCATION" ||
      key === "GOOGLE_GENAI_USE_VERTEXAI" ||
      key === "GOOGLE_GENAI_LOCATION" ||
      key === "GOOGLE_API_KEY" ||
      key === "GEMINI_API_KEY" ||
      key === "GOOGLE_APPLICATION_CREDENTIALS" ||
      key === "CLOUDSDK_CONFIG" ||
      key === "GCLOUD_PROJECT" ||
      key === "GEMINI_ENTERPRISE_APP_ID" ||
      key === "GEMINI_ENTERPRISE_LOCATION" ||
      key.startsWith("GE_HARNESS_")
    ) {
      env[key] = value;
    }
  }
  const configuredEnv = {
    ...readDotEnv(join(dataRoot, ".env")),
    ...readDotEnv(join(workspaceDir, ".env")),
  };
  return {
    ...env,
    ...configuredEnv,
    GIT_TERMINAL_PROMPT: "0",
    UV_CACHE_DIR: configuredEnv.UV_CACHE_DIR || process.env.UV_CACHE_DIR || GENERATOR_UV_CACHE,
    PATH: [binDir, join(repoRoot, "node_modules", ".bin"), env.PATH].filter(Boolean).join(delimiter),
    GE_HARNESS_WORKSPACE: workspaceDir,
    GE_HARNESS_REPO_ROOT: repoRoot,
    GE_HARNESS_BIN: binDir,
    GE_HARNESS_SKILLS_MANIFEST: GENERATOR_SKILLS_MANIFEST,
    ...extra,
  };
}

function normalizeAgentEvent(ev) {
  if (ev.kind === "text") return { type: "text_delta", delta: ev.text || "" };
  if (ev.kind === "thinking") return { type: "thinking", delta: ev.text || "" };
  if (ev.kind === "tool_use") return { type: "tool_use", name: ev.name, id: ev.id, raw: ev };
  if (ev.kind === "tool_result") return { type: "tool_result", toolUseId: ev.toolUseId, delta: ev.content, isError: ev.isError };
  if (ev.kind === "error") return { type: "stderr", delta: ev.text || "" };
  if (ev.kind === "status") return { type: "status", label: ev.label || "status", raw: ev.raw };
  if (ev.kind === "usage") return { type: "usage", inputTokens: ev.inputTokens, outputTokens: ev.outputTokens, costUsd: ev.costUsd };
  return { type: "json_event", raw: ev.raw || ev, delta: ev.text || "" };
}

function parseAntigravityStatusLines(text) {
  const events = [];
  const passthrough = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (typeof parsed?.type === "string" && parsed.type.startsWith("antigravity.")) {
        events.push(parsed);
        continue;
      }
    } catch {
      // Keep non-JSON stderr as normal diagnostics.
    }
    passthrough.push(line);
  }
  return { events, passthrough: passthrough.length ? `${passthrough.join("\n")}\n` : "" };
}

// Incremental line buffer for streamed stderr. This was a local re-implementation
// of @ge/runtime's splitLines(); delegate to the shared one so there's a single
// line-buffer in the codebase (it also strips a trailing \r — CRLF the old copy
// left in place). A function (not a const alias) so it hoists above __test below.
function createLineBuffer() {
  return splitLines();
}

function pathHasHiddenSegment(path) {
  return resolve(path).split(sep).some((part) => part.startsWith(".") && part.length > 1);
}

function visibleWorkspaceAlias({ realWorkspaceDir, runId, agentId } = {}) {
  if (agentId !== "antigravity-sdk" || !pathHasHiddenSegment(realWorkspaceDir)) return realWorkspaceDir;
  const aliasRoot = join(process.env.TMPDIR || "/tmp", "ge-antigravity-workspaces", runId);
  const aliasPath = join(aliasRoot, basename(realWorkspaceDir));
  mkdirSync(aliasRoot, { recursive: true });
  if (!existsSync(aliasPath)) symlinkSync(realWorkspaceDir, aliasPath, "dir");
  return aliasPath;
}

export async function runHarnessTask({
  repoRoot,
  dataRoot,
  workspaceDir,
  agentId = "gemini",
  message,
  task = null,
  stages = [],
  permissionProfile = "review",
  ownedPaths = [],
  avoidPaths = [],
  model = "default",
  vertex = true,
  project: vertexProject = null,
  location = null,
  secretNames = [],
  timeoutSec = 0,
  allowFallback = false,
  responseSchemaFile = null,
  protectFiles = [],
  disableTools = [],
  enableSubagents = false,
  conversationId = null,
  saveDir = null,
  onEvent = null,
} = {}) {
  const resolvedRepoRoot = resolve(repoRoot || new URL("..", import.meta.url).pathname);
  const resolvedDataRoot = resolve(dataRoot || GENERATOR_DATA_ROOT);
  const cwd = resolve(workspaceDir || resolvedRepoRoot);
  const userRequest = String(message || "").trim();
  if (!userRequest) throw new Error("message required");

  const run = {
    id: randomUUID(),
    projectId: null,
    agentId,
    events: [],
  };
  const executionCwd = visibleWorkspaceAlias({ realWorkspaceDir: cwd, runId: run.id, agentId });
  const emit = (event, data) => {
    const record = { id: run.events.length + 1, event, data, createdAt: new Date().toISOString() };
    run.events.push(record);
    if (typeof onEvent === "function") onEvent(record);
    return record;
  };

  const agents = await detectAgents();
  const requested = agents.find((agent) => agent.id === agentId);
  if (!allowFallback && agentId && (!requested || !requested.available)) {
    const reason = requested?.unavailableReason || "not registered";
    throw new Error(`${agentId} harness is unavailable: ${reason}`);
  }
  const plan = buildHarnessRunPlan({
    agents,
    requestedAgentId: agentId,
    message: userRequest,
    task,
    permissionProfile,
    ownedPaths: ownedPaths.length ? ownedPaths : [executionCwd],
    avoidPaths,
  });
  const skillRegistry = await loadSkillRegistry(resolvedRepoRoot);
  plan.skills = await materializeSkillsForWorkspace({
    workspaceDir: cwd,
    skills: selectSkillsForContext({
      registry: skillRegistry,
      capabilities: plan.requestedCapabilities,
      stages,
      message: userRequest,
    }),
  });

  const harnessProject = { id: "cli-harness", name: "CLI Harness" };
  // Subagent fan-out is only meaningful when the adapter supports it and the run
  // is write-enabled (CapabilitiesConfig — and thus subagents — is only built for
  // non-review profiles in the driver).
  const subagentsAvailable = plan.adapterId === "antigravity-sdk"
    && (!["review", "read-only", "readonly"].includes(plan.permissionProfile.id) || Boolean(enableSubagents));
  const prompt = [
    "# Instructions",
    renderSystemPrompt(),
    "",
    `Workspace: ${executionCwd}`,
    executionCwd !== cwd ? `Real workspace: ${cwd}` : null,
    `Repository root: ${resolvedRepoRoot}`,
    "Run mode: non-web CLI harness.",
    "",
    buildHandoffPacket({
      sender: "ge-harness-cli",
      receiver: plan.adapterId,
      run,
      project: harnessProject,
      cwd: executionCwd,
      repoRoot: resolvedRepoRoot,
      userRequest,
      task,
      plan,
    }),
    // Additive: when the workspace has a generated agent-workflow sidecar, give the
    // harness the spec topology + per-stage tools so it can validate/correct the
    // emitted agent.py against the intended multi-agent structure.
    buildSpecWorkflowSection(cwd),
    // Additive: OKF coverage — verify the agent covers every Query Capability's
    // tools and every Eval Scenario's mechanisms; self-correct/flag gaps.
    buildSpecCoverageSection(cwd),
    // Additive: when the run is write-enabled and validation sidecars exist,
    // direct the harness to fan the independent checks out to subagents.
    buildSubagentPlanSection(cwd, { subagentsAvailable }),
    // Additive: on non-Antigravity adapters, protect-file/disable-tool
    // constraints are stated in the prompt instead of silently dropped.
    buildCompatGuardrailSection(plan.adapterId, { protectFiles, disableTools }),
    // Additive: on the Claude adapter with an interaction dir, point the model
    // at the request_user_input form bridge.
    buildInteractionSection(plan.adapterId, process.env.GE_HARNESS_INTERACTION_DIR || null),
  ].filter(Boolean).join("\n");

  const binDir = materializeWorkspaceCommandShims({ workspaceDir: cwd, repoRoot: resolvedRepoRoot });
  const secretEnv = await readSecretsEnv(resolvedDataRoot, secretNames);

  // Open local run journal
  const runsDir = join(resolvedDataRoot, "runs");
  const journal = openJournal(runsDir, { runId: run.id, agentId: plan.adapterId, stage: "run" });
  const runDir = join(runsDir, run.id);
  const agentLogFilePath = join(runDir, `${plan.adapterId}.log`);
  writeFileSync(join(runDir, "prompt.txt"), prompt, "utf8");

  const vertexDefaults = await resolveVertexDefaults({
    repoRoot: resolvedRepoRoot,
    project: vertexProject,
    location,
    vertex,
  });
  if (vertexDefaults.vertex !== false && plan.adapterId === "antigravity-sdk" && (!vertexDefaults.project || !vertexDefaults.location) && !process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    throw new Error("Antigravity Vertex execution requires project and location. Run `ge init`, set GOOGLE_CLOUD_PROJECT, or provide an API key for Express Mode.");
  }

  const def = await getAgentDef(plan.adapterId);
  if (!def.resolvedBin) throw new Error(`${def.name} is not installed or not on PATH.`);
  const skillPaths = plan.skills.map((skill) => skill.workspacePath ? join(executionCwd, skill.workspaceRelativePath.replace(/\/SKILL\.md$/, "")) : null).filter(Boolean);
  // Newly-wired Antigravity SDK capabilities — sourced from the plan, with a
  // headless env opt-in. All default-off, so existing runs are unchanged.
  const sdkCaps = {};
  if (plan.adapterId === "antigravity-sdk") {
    if (Array.isArray(plan.mcpServers) && plan.mcpServers.length) sdkCaps.mcpServers = plan.mcpServers;
    else if (process.env.GE_HARNESS_MCP) {
      try {
        const v = JSON.parse(process.env.GE_HARNESS_MCP);
        sdkCaps.mcpServers = Array.isArray(v) ? v : [v];
      } catch {
        sdkCaps.mcpServers = parseList(process.env.GE_HARNESS_MCP)
          .map((url, i) => ({ transport: "sse", name: `mcp${i}`, url }));
      }
    }
    if (Array.isArray(plan.attachments) && plan.attachments.length) sdkCaps.attachments = plan.attachments;
    else if (process.env.GE_HARNESS_ATTACH) sdkCaps.attachments = parseList(process.env.GE_HARNESS_ATTACH);
    if (plan.enableFactoryTools || process.env.GE_HARNESS_FACTORY_TOOLS === "1") sdkCaps.enableFactoryTools = true;
    if (plan.conversationId) sdkCaps.conversationId = plan.conversationId;
    if (plan.saveDir) sdkCaps.saveDir = plan.saveDir;
    if (plan.triggerEvery) sdkCaps.triggerEvery = plan.triggerEvery;
    if (plan.subagents === false) sdkCaps.subagents = false;
    // Structured-output schema + protected-file write guards. Caller-provided
    // (preferred) with an env opt-in, both default-off so existing runs are
    // unchanged. The Python driver degrades gracefully if the SDK rejects either.
    const schemaFile = responseSchemaFile || process.env.GE_HARNESS_RESPONSE_SCHEMA || null;
    if (schemaFile) sdkCaps.responseSchemaFile = schemaFile;
    const protect = (Array.isArray(protectFiles) && protectFiles.length)
      ? protectFiles
      : (process.env.GE_HARNESS_PROTECT
        ? parseList(process.env.GE_HARNESS_PROTECT)
        : []);
    if (protect.length) sdkCaps.protectFiles = protect;
    const disable = (Array.isArray(disableTools) && disableTools.length)
      ? disableTools
      : (process.env.GE_HARNESS_DISABLE_TOOLS
        ? parseList(process.env.GE_HARNESS_DISABLE_TOOLS)
        : []);
    if (disable.length) sdkCaps.disableTools = disable;
    // Force capabilities (and subagents) on for a read-only validator fan-out.
    if (enableSubagents) sdkCaps.enableSubagents = true;
    // Durable / resumable session — caller-provided, with env opt-ins.
    const convId = conversationId || process.env.GE_HARNESS_CONVERSATION_ID || null;
    if (convId) sdkCaps.conversationId = convId;
    const sdir = saveDir || process.env.GE_HARNESS_SAVE_DIR || null;
    if (sdir) sdkCaps.saveDir = sdir;
  }
  const interactionDir = process.env.GE_HARNESS_INTERACTION_DIR || null;
  const args = def.buildArgs(prompt, { cwd: executionCwd, model, permissionProfile: plan.permissionProfile.id, vertex: vertexDefaults.vertex, project: vertexDefaults.project, location: vertexDefaults.location, agentLogFilePath, skillsPaths: skillPaths, interactionDir, ...sdkCaps });

  return await new Promise((resolveRun) => {
    let stdout = "";
    let stderr = "";
    const normalizedEvents = [];
    const parser = createOutputParser(def.streamFormat === "json-lines" ? detectFormat(def.id) : "plain");
    const stderrLines = createLineBuffer();
    const handleStderrLine = (line) => {
      const parsed = parseAntigravityStatusLines(`${line}\n`);
      for (const status of parsed.events) {
        const ev = { type: "status", label: status.type, raw: status };
        normalizedEvents.push(ev);
        emit("status", ev);
      }
      if (parsed.passthrough) {
        const ev = { type: "stderr", delta: parsed.passthrough };
        normalizedEvents.push(ev);
        emit("agent", ev);
      }
    };
    const child = spawn(def.resolvedBin, args, {
      cwd: executionCwd,
      env: buildHarnessEnv({
        repoRoot: resolvedRepoRoot,
        dataRoot: resolvedDataRoot,
        workspaceDir: executionCwd,
        binDir,
        extra: {
          GE_HARNESS_RUN_ID: run.id,
          GE_HARNESS_PROJECT_ID: harnessProject.id,
          GE_HARNESS_REAL_WORKSPACE: cwd,
          ...secretEnv,
        },
      }),
      stdio: ["pipe", "pipe", "pipe"],
    });
    emit("plan", {
      adapterId: plan.adapterId,
      adapterName: plan.adapterName,
      requestedAgentId: agentId,
      fallbackFrom: plan.fallbackFrom,
      selectionReason: plan.selectionReason,
      permissionProfile: plan.permissionProfile.id,
      requestedCapabilities: plan.requestedCapabilities,
      skills: plan.skills.map((skill) => ({ id: skill.id, path: skill.relativePath, workspacePath: skill.workspaceRelativePath, capability: skill.capability })),
      ownedPaths: plan.ownedPaths,
      avoidPaths: plan.avoidPaths,
    });
    emit("status", { label: "spawned", agentId: def.id, pid: child.pid });
    journal.event({ type: "stage_started", level: "info" });

    // Non-Antigravity adapters raise interaction forms through the on-disk
    // bridge; surface each request as the status event the console renders.
    // (The Antigravity driver reports its own requests on stderr.)
    let stopInteractionWatch = null;
    if (interactionDir && plan.adapterId !== "antigravity-sdk") {
      stopInteractionWatch = watchInteractionRequests({
        interactionDir,
        onRequest: (request) => {
          const raw = { type: "antigravity.interaction_request", interactionId: request.id, form: request.form };
          const ev = { type: "status", label: raw.type, raw };
          normalizedEvents.push(ev);
          emit("status", ev);
        },
      });
    }

    let timeout = null;
    if (timeoutSec > 0) {
      timeout = setTimeout(() => {
        emit("error", { code: "RUN_TIMEOUT", message: `run exceeded ${timeoutSec}s timeout` });
        child.kill("SIGTERM");
      }, timeoutSec * 1000);
      timeout.unref?.();
    }

    if (def.promptViaStdin) child.stdin.end(prompt);
    child.stdout.on("data", (chunk) => {
      const text = chunk.toString("utf8");
      stdout += text;
      journal.log("stdout", text);
      for (const parsed of parser.feed(text)) {
        const ev = normalizeAgentEvent(parsed);
        normalizedEvents.push(ev);
        emit(ev.type === "status" ? "status" : "agent", ev);
      }
    });
    child.stderr.on("data", (chunk) => {
      const text = chunk.toString("utf8");
      stderr += text;
      journal.log("stderr", text);
      for (const line of stderrLines.push(text)) handleStderrLine(line);
    });
    child.on("error", (error) => {
      if (timeout) clearTimeout(timeout);
      if (stopInteractionWatch) stopInteractionWatch();
      emit("error", { code: "SPAWN_FAILED", message: error.message });
      resolveRun({ ok: false, status: "failed", code: 1, signal: null, stdout, stderr, text: normalizedEvents.filter((ev) => ev.type === "text_delta").map((ev) => ev.delta).join(""), events: run.events, agentEvents: normalizedEvents, plan });
    });
    child.on("close", (code, signal) => {
      if (timeout) clearTimeout(timeout);
      if (stopInteractionWatch) stopInteractionWatch();
      for (const parsed of parser.flush()) {
        const ev = normalizeAgentEvent(parsed);
        normalizedEvents.push(ev);
        emit(ev.type === "status" ? "status" : "agent", ev);
      }
      for (const line of stderrLines.flush()) handleStderrLine(line);
      const timedOut = run.events.some((event) => event.event === "error" && event.data?.code === "RUN_TIMEOUT");
      const status = timedOut ? "failed" : code === 0 ? "succeeded" : "failed";
      emit("end", { status, code, signal });
      journal.event({ type: code === 0 ? "stage_done" : "stage_failed", level: code === 0 ? "info" : "error" });
      recordRun(runsDir, { runId: run.id, agentId: plan.adapterId, stage: "run", status: code === 0 ? "done" : "failed" });
      Promise.resolve()
        .then(async () => {
          const agentLog = existsSync(agentLogFilePath) ? await readFile(agentLogFilePath, "utf8").catch(() => "") : ""; // best-effort: summary excerpt only; log may vanish between the existsSync check and the read
          const summary = {
            schemaVersion: 1,
            runId: run.id,
            adapter: plan.adapterId,
            status,
            exitCode: code,
            signal,
            workspaceDir: cwd,
            promptPath: join(runDir, "prompt.txt"),
            agentLogPath: existsSync(agentLogFilePath) ? agentLogFilePath : null,
            executionWorkspaceDir: executionCwd,
            diagnostics: classifyAgentDiagnostics({ adapterId: plan.adapterId, stdout, stderr, agentLog }),
            completedAt: new Date().toISOString(),
          };
          writeJson(join(runDir, "summary.json"), summary);
          return { agentLog, summary };
        })
        .then(({ agentLog, summary }) => resolveRun({
        ok: status === "succeeded",
        status,
        code,
        signal,
        stdout,
        stderr,
        agentLog,
        summary,
        text: normalizedEvents.filter((ev) => ev.type === "text_delta").map((ev) => ev.delta).join(""),
        events: run.events,
        agentEvents: normalizedEvents,
        plan,
      }));
    });
  });
}

function classifyAgentDiagnostics({ adapterId, stdout = "", stderr = "", agentLog = "" } = {}) {
  const text = `${stdout}\n${stderr}\n${agentLog}`;
  const diagnostics = [];
  if (adapterId === "agy" && !agentLog) {
    diagnostics.push({ code: "AGY_LOG_MISSING", message: "Antigravity CLI did not write a diagnostic log; verify agy supports --log-file and is authenticated." });
  }
  if (/RESOURCE_EXHAUSTED|quota/i.test(text)) {
    diagnostics.push({ code: "RESOURCE_EXHAUSTED", message: "Antigravity upstream quota was exhausted." });
  }
  if (/auth|login|credential|unauthenticated/i.test(text)) {
    diagnostics.push({ code: "AUTH_MISSING", message: "Antigravity authentication appears missing or expired; run interactive agy login on that runner." });
  }
  if (!stdout.trim() && !stderr.trim() && adapterId === "agy") {
    diagnostics.push({ code: "EMPTY_AGY_OUTPUT", message: "Antigravity CLI produced empty stdout/stderr; inspect the agy log for auth/quota/upstream failures." });
  }
  return diagnostics;
}
