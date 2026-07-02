// Cloud-facing lifecycle stage orchestration: MCP tool-plane management,
// deploy (Agent Runtime / Cloud Run), Agent Registry registration, and
// Gemini Enterprise publish — plus every gcloud/agents-cli helper those
// commands share. Extracted verbatim out of factory.mjs (moving code, not
// changing behavior): these commands were already tightly coupled to each
// other (register/publish/deploy-status all read deployment_metadata.json
// through the same parseAgentRuntimeId/hydrateDeployStepFromMetadata path;
// cmdMcp delegates its "plan" action to cmdSourceIntegrationPlan) but only
// loosely coupled to the rest of factory.mjs's local pipeline commands, so
// this is a real seam.
//
// Dependency injection, not import-back: factory.mjs still owns pipeline
// state I/O (loadPipeline/savePipeline/markStep/requireStep), the ok()/fail()
// return-or-throw contract, nextCommandFor, the process-runner (runCommand),
// the promotion-gate check (assertPromotable), and the resolved AGENT_MODEL.
// Those are passed in via `deps` exactly like buildAgentQualityPlan is
// injected into deriveSchemaFromUseCase elsewhere in this tree — it's what
// keeps this a one-way dependency graph instead of a cycle back into
// factory.mjs.
import { join, basename } from "node:path";
import { mkdir } from "node:fs/promises";
import { snakeCase } from "@ge/std/naming";
import { resolveGcpProject } from "@ge/std/gcp-config";
import { MANAGED_MCP_SERVICES } from "../integration/source-integration.mjs";
import { mcpToolDescriptors } from "../data/mcp-tool-descriptors.mjs";

// ── gcloud helpers ───────────────────────────────────────────

async function getGcloudProject(flags, { runCommand }) {
  const p = resolveGcpProject({ explicit: flags.project });
  if (p) return p;
  try {
    const r = await runCommand("gcloud", ["config", "get-value", "project"], { timeout: 10000 });
    const val = r.stdout.trim();
    if (val && val !== "(unset)") return val;
  } catch {}
  return null;
}

async function getGcloudProjectNumber(project, { runCommand }) {
  if (process.env.GOOGLE_CLOUD_PROJECT_NUMBER) return process.env.GOOGLE_CLOUD_PROJECT_NUMBER;
  if (!project || project.includes("<")) return null;
  try {
    const r = await runCommand("gcloud", ["projects", "describe", project, "--format=value(projectNumber)"], { timeout: 15000, allowFail: true });
    return r.stdout.trim() || null;
  } catch {
    return null;
  }
}

async function getGcloudRegion(flags) {
  return flags.region || process.env.GOOGLE_CLOUD_LOCATION || "us-central1";
}

function parseAgentRuntimeId(meta, fallback = null) {
  const candidates = [
    meta?.remote_agent_runtime_id,
    meta?.agent_runtime_id,
    meta?.resource_name,
    meta?.reasoning_engine,
    fallback,
    process.env.AGENT_RUNTIME_ID,
  ].filter(Boolean).map(String);
  const valid = candidates.find((value) => value && value !== "None" && value.includes("/reasoningEngines/"));
  return valid || candidates.find((value) => value && value !== "None") || null;
}

function agentRuntimeRunUrl(runtimeId) {
  const text = String(runtimeId || "");
  const parts = text.split("/");
  const project = parts[parts.indexOf("projects") + 1];
  const location = parts[parts.indexOf("locations") + 1];
  const engine = parts[parts.indexOf("reasoningEngines") + 1];
  if (!project || !location || !engine) return null;
  return `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/reasoningEngines/${engine}`;
}

async function hydrateDeployStepFromMetadata(dir, pipeline, flags = {}, deps) {
  const { readJson, markStep, savePipeline } = deps;
  if (pipeline.steps?.deploy?.status === "done") return pipeline.steps.deploy;
  const metaPath = join(dir, "deployment_metadata.json");
  const meta = await readJson(metaPath, null);
  const runtimeId = parseAgentRuntimeId(meta, pipeline.steps?.deploy?.runtimeId);
  if (!runtimeId) return pipeline.steps?.deploy || null;

  const project = resolveGcpProject({ explicit: flags.project }) || runtimeId.match(/^projects\/([^/]+)/)?.[1] || null;
  const region = flags.region || flags.location || process.env.GOOGLE_CLOUD_LOCATION || runtimeId.match(/\/locations\/([^/]+)/)?.[1] || null;
  markStep(pipeline, "deploy", "done", {
    ...(pipeline.steps?.deploy || {}),
    project,
    region,
    target: meta?.deployment_target || pipeline.steps?.deploy?.target || "agent_runtime",
    runtimeId,
    isA2a: meta?.is_a2a || false,
    deploymentMetadata: metaPath,
    hydratedFromMetadata: true,
  });
  await savePipeline(dir, pipeline);
  return pipeline.steps.deploy;
}

function parseOperationId(output) {
  const text = String(output || "");
  return text.match(/projects\/[^ \n]+\/locations\/[^ \n]+\/[^ \n]*operations\/[A-Za-z0-9_-]+/)?.[0]
    || text.match(/Operation:\s*([^\s]+)/)?.[1]
    || text.match(/operation(?: name)?:\s*([^\s]+)/i)?.[1]
    || null;
}

function safeAgentsCliProjectName(value) {
  const normalized = String(value || "ge-agent")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const prefixed = /^[a-z]/.test(normalized) ? normalized : `ge-${normalized}`;
  return (prefixed || "ge-agent").slice(0, 26).replace(/-+$/g, "") || "ge-agent";
}

function normalizeGeminiEnterpriseAppResource(value, project, location = "global") {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (raw.startsWith("projects/") && raw.includes("/engines/")) return raw;
  if (raw.includes("/engines/")) {
    const idx = raw.indexOf("projects/");
    return idx >= 0 ? raw.slice(idx) : raw;
  }
  if (project && /^[a-z][a-z0-9_-]*$/i.test(raw) && !/\s/.test(raw)) {
    return `projects/${project}/locations/${location}/collections/default_collection/engines/${raw}`;
  }
  return raw;
}

function parseGeminiEnterpriseApps(text) {
  const apps = [];
  for (const line of String(text || "").split("\n")) {
    const resource = line.match(/projects\/[^ \t│]+\/locations\/[^ \t│]+\/collections\/[^ \t│]+\/engines\/[^ \t│]+/)?.[0];
    if (!resource) continue;
    const cells = line.split("│").map((cell) => cell.trim()).filter(Boolean);
    const displayName = cells.find((cell) => !cell.startsWith("projects/") && !["Display Name", "Location", "Resource"].includes(cell)) || null;
    const id = resource.match(/\/engines\/([^/]+)$/)?.[1] || null;
    apps.push({ displayName, id, resource });
  }
  return apps;
}

async function resolveGeminiEnterpriseAppId(rawAppId, { project, projectNumber, location }, { runCommand }) {
  const raw = String(rawAppId || "").trim();
  if (!raw) return { appId: null, matched: null };
  if (raw.startsWith("projects/") && raw.includes("/engines/")) return { appId: raw, matched: "full_resource" };

  try {
    const listArgs = ["publish", "gemini-enterprise", "--list"];
    if (projectNumber) listArgs.push("--project-number", projectNumber);
    const listed = await runCommand("agents-cli", listArgs, { timeout: 30000, allowFail: true, env: { COLUMNS: "240" } });
    const apps = parseGeminiEnterpriseApps(`${listed.stdout}\n${listed.stderr}`);
    const exact = apps.find((app) => app.id === raw || app.displayName === raw || app.resource === raw);
    if (exact?.resource) return { appId: exact.resource, matched: exact.displayName === raw ? "display_name" : "engine_id", apps };
  } catch {}

  if (project) {
    try {
      const discovered = await runCommand("gcloud", [
        "discovery-engine", "engines", "list",
        `--project=${project}`,
        `--location=${location || "global"}`,
        "--collection=default_collection",
        "--format=json(name,displayName)",
      ], { timeout: 30000, allowFail: true });
      const parsed = discovered.stdout.trim() ? JSON.parse(discovered.stdout) : [];
      const match = parsed.find((app) => app.name === raw || app.displayName === raw || app.name?.endsWith(`/engines/${raw}`));
      if (match?.name) return { appId: match.name, matched: match.displayName === raw ? "display_name" : "engine_id", apps: parsed };
    } catch {}
  }

  return { appId: normalizeGeminiEnterpriseAppResource(raw, project, location), matched: "constructed_or_raw" };
}

// ── MCP Server Management ────────────────────────────────────

export async function cmdMcp(dir, flags, deps) {
  const { loadPipeline, savePipeline, markStep, nextCommandFor, fail, ok, runCommand, cmdSourceIntegrationPlan } = deps;
  const pipeline = await loadPipeline(dir);
  const action = flags.action || flags._sub || "list";

  if (action === "plan") {
    return cmdSourceIntegrationPlan(dir, flags);
  }

  const project = await getGcloudProject(flags, { runCommand });
  if (!project) fail("--project required (or set GOOGLE_CLOUD_PROJECT / gcloud config)", "GE0008");

  if (action === "list" || action === "ls") {
    console.error(`Listing managed MCP servers for project ${project}...`);
    const results = [];
    for (const svc of MANAGED_MCP_SERVICES) {
      try {
        const r = await runCommand("gcloud", ["services", "list", "--enabled", "--filter", `name:${svc.api}`, "--project", project, "--format=value(name)"], { timeout: 15000 });
        results.push({ ...svc, enabled: r.stdout.trim().includes(svc.api) });
      } catch {
        results.push({ ...svc, enabled: false, error: "check failed" });
      }
    }
    try {
      console.error("Checking Agent Registry services...");
      const r = await runCommand("gcloud", ["alpha", "agent-registry", "services", "list", "--project", project, "--location", await getGcloudRegion(flags), "--format=json"], { timeout: 15000, allowFail: true });
      const registryServices = r.stdout.trim() ? JSON.parse(r.stdout) : [];
      return ok({ step: "mcp", action: "list", project, managedServices: results, registryServices });
    } catch {
      return ok({ step: "mcp", action: "list", project, managedServices: results, registryServices: [] });
    }
  }

  if (action === "enable") {
    const serviceId = flags.service;
    if (!serviceId) fail("--service required (e.g., bigquery, maps, spanner)");
    const svc = MANAGED_MCP_SERVICES.find((s) => s.id === serviceId);
    if (!svc) fail(`Unknown service: ${serviceId}. Available: ${MANAGED_MCP_SERVICES.map((s) => s.id).join(", ")}`);

    console.error(`Enabling ${svc.api} in project ${project}; Agent Registry auto-discovers supported first-party MCP tools for enabled Google Cloud APIs...`);
    try {
      await runCommand("gcloud", ["services", "enable", svc.api, `--project=${project}`], { stream: true, timeout: 60000 });
      markStep(pipeline, "register", "done", { mode: "mcp", service: svc.id, project });
      await savePipeline(dir, pipeline);
      return ok({
        step: "mcp",
        action: "enable",
        service: svc.id,
        api: svc.api,
        project,
        registryBehavior: "First-party Google MCP servers are automatically registered in Agent Registry when the supported API is enabled.",
        adkUsage: `from google.adk.tools import ApiRegistry\ntools = ApiRegistry.get_toolset("${svc.api}")`,
        nextCommand: nextCommandFor(pipeline, dir),
      });
    } catch (e) {
      fail(`Failed to enable ${svc.api}: ${e.message}`);
    }
  }

  if (action === "disable") {
    const serviceId = flags.service;
    if (!serviceId) fail("--service required");
    const svc = MANAGED_MCP_SERVICES.find((s) => s.id === serviceId);
    if (!svc) fail(`Unknown service: ${serviceId}`);
    console.error(`Disabling MCP for ${svc.api}...`);
    try {
      await runCommand("gcloud", ["beta", "services", "mcp", "disable", svc.api, `--project=${project}`], { stream: true, timeout: 60000 });
      return ok({ step: "mcp", action: "disable", service: svc.id });
    } catch (e) {
      fail(`Failed to disable: ${e.message}`);
    }
  }

  fail(`Unknown mcp action: ${action}. Use: plan, list, enable, disable`);
}

// ── Deploy (Agent Runtime or Cloud Run) ──────────────────────

export async function cmdDeploy(dir, flags, deps) {
  const { loadPipeline, savePipeline, markStep, requireStep, nextCommandFor, fail, ok, runCommand, assertPromotable } = deps;
  const pipeline = await loadPipeline(dir);
  requireStep(pipeline, "tools");
  await assertPromotable(dir, flags);
  const project = await getGcloudProject(flags, { runCommand });
  const region = await getGcloudRegion(flags);
  if (!project) fail("--project required (or set GOOGLE_CLOUD_PROJECT)", "GE0008");
  const target = flags.target || "agent_runtime";

  console.error(`Enhancing scaffold for ${target} deployment...`);
  try {
    const projectName = safeAgentsCliProjectName(pipeline.name || basename(dir));
    await runCommand("agents-cli", ["scaffold", "enhance", ".", "--name", projectName, "--deployment-target", target, "--agent-directory", "app", "--yes"], { cwd: dir, stream: true, timeout: 60000 });
    await runCommand("uv", ["lock"], { cwd: dir, stream: true, timeout: 120000 });
  } catch (e) {
    console.error(`Scaffold enhance: ${e.message}`);
  }

  if (target === "cloud_run") {
    console.error(`Deploying to Cloud Run in ${project} / ${region}...`);
    try {
      const serviceName = snakeCase(pipeline.name || "mock-agent").replace(/_/g, "-");
      await runCommand("gcloud", [
        "run", "deploy", serviceName,
        "--source", ".",
        "--project", project,
        "--region", region,
        "--allow-unauthenticated",
        "--set-env-vars", `GOOGLE_CLOUD_PROJECT=${project}`,
      ], { cwd: dir, stream: true, timeout: 300000 });

      const urlResult = await runCommand("gcloud", [
        "run", "services", "describe", serviceName,
        "--project", project, "--region", region,
        "--format=value(status.url)",
      ], { timeout: 15000 });
      const serviceUrl = urlResult.stdout.trim();

      markStep(pipeline, "deploy", "done", { project, region, target, serviceName, serviceUrl });
      await savePipeline(dir, pipeline);
      return ok({ step: "deploy", target, project, region, serviceName, serviceUrl, nextCommand: nextCommandFor(pipeline, dir) });
    } catch (e) {
      markStep(pipeline, "deploy", "failed", { error: e.message });
      await savePipeline(dir, pipeline);
      fail(`Cloud Run deploy failed: ${e.message}`, "GE0009");
    }
  }

  console.error(`Deploying to Agent Runtime in ${project} / ${region}...`);
  try {
    const noWait = flags.wait === "true" ? false : true;
    const deployArgs = ["deploy", "--project", project, "--region", region, "--no-confirm-project"];
    if (noWait) deployArgs.push("--no-wait");
    const timeoutMs = Number(flags["deploy-timeout-ms"] || process.env.GE_DEPLOY_TIMEOUT_MS || (noWait ? 180000 : 900000));
    const deployResult = await runCommand("agents-cli", deployArgs, { cwd: dir, stream: true, timeout: timeoutMs });

    const metaPath = join(dir, "deployment_metadata.json");
    const meta = await deps.readJson(metaPath, null);
    const runtimeId = parseAgentRuntimeId(meta);
    const operation = parseOperationId(`${deployResult.stdout}\n${deployResult.stderr}`);

    if (noWait && !runtimeId) {
      markStep(pipeline, "deploy", "running", {
        project,
        region,
        target,
        operation,
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
      await savePipeline(dir, pipeline);
      return ok({
        step: "deploy",
        status: "running",
        target,
        project,
        region,
        operation,
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
    }

    markStep(pipeline, "deploy", "done", {
      project, region, target,
      runtimeId,
      isA2a: meta?.is_a2a || false,
    });
    await savePipeline(dir, pipeline);
    return ok({ step: "deploy", target, project, region, runtimeId, deploymentMetadata: metaPath, nextCommand: nextCommandFor(pipeline, dir) });
  } catch (e) {
    if (e.message === "timeout") {
      const operation = parseOperationId(`${e.stdout || ""}\n${e.stderr || ""}`);
      markStep(pipeline, "deploy", "running", {
        project,
        region,
        target,
        operation,
        timeoutMs: Number(flags["deploy-timeout-ms"] || process.env.GE_DEPLOY_TIMEOUT_MS || 900000),
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
      await savePipeline(dir, pipeline);
      return ok({
        step: "deploy",
        status: "running",
        target,
        project,
        region,
        operation,
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
    }
    markStep(pipeline, "deploy", "failed", { error: e.message });
    await savePipeline(dir, pipeline);
    fail(`Deploy failed: ${e.message}`, "GE0009");
  }
}

export async function cmdDeployStatus(dir, flags, deps) {
  const { loadPipeline, savePipeline, markStep, nextCommandFor, fail, ok, runCommand, readJson } = deps;
  const pipeline = await loadPipeline(dir);
  const project = await getGcloudProject(flags, { runCommand });
  const region = await getGcloudRegion(flags);
  if (!project) fail("--project required (or set GOOGLE_CLOUD_PROJECT)", "GE0008");
  console.error(`Checking Agent Runtime deploy status in ${project} / ${region}...`);
  try {
    const statusResult = await runCommand("agents-cli", ["deploy", "--status", "--project", project, "--region", region, "--no-confirm-project"], { cwd: dir, stream: true, timeout: 180000 });
    const metaPath = join(dir, "deployment_metadata.json");
    const meta = await readJson(metaPath, null);
    const runtimeId = parseAgentRuntimeId(meta);
    if (!runtimeId) {
      markStep(pipeline, "deploy", "running", {
        project,
        region,
        target: "agent_runtime",
        operation: parseOperationId(`${statusResult.stdout}\n${statusResult.stderr}`) || pipeline.steps.deploy?.operation || null,
        statusCommand: `factory deploy-status --dir ${dir} --project ${project} --region ${region}`,
      });
      await savePipeline(dir, pipeline);
      return ok({ step: "deploy-status", status: "running", project, region, runtimeId: null });
    }
    markStep(pipeline, "deploy", "done", { project, region, target: "agent_runtime", runtimeId, isA2a: meta?.is_a2a || false });
    await savePipeline(dir, pipeline);
    return ok({ step: "deploy-status", status: "done", project, region, runtimeId, deploymentMetadata: metaPath, nextCommand: nextCommandFor(pipeline, dir) });
  } catch (e) {
    markStep(pipeline, "deploy", "failed", { error: e.message, project, region, target: "agent_runtime" });
    await savePipeline(dir, pipeline);
    fail(`Deploy status failed: ${e.message}`, "GE0009");
  }
}

export async function cmdVerifyLive(dir, flags, deps) {
  const { loadPipeline, savePipeline, markStep, requireStep, nextCommandFor, fail, ok, readJson, GENERATED_AT, runLifecycleCommand } = deps;
  const pipeline = await loadPipeline(dir);
  await hydrateDeployStepFromMetadata(dir, pipeline, flags, deps);
  requireStep(pipeline, "deploy");
  const deployStep = pipeline.steps.deploy || {};
  const meta = await readJson(join(dir, "deployment_metadata.json"), null);
  const runtimeId = parseAgentRuntimeId(meta, deployStep.runtimeId);
  const target = flags.url || deployStep.serviceUrl || agentRuntimeRunUrl(runtimeId);
  const mode = flags.mode || (runtimeId ? "adk" : "a2a");
  const prompt = flags.prompt || "hello";
  if (!target) fail("No deployed URL or Agent Runtime metadata found. Run deploy-status first or pass --url.");

  try {
    await mkdir(join(dir, "artifacts"), { recursive: true }).catch(() => {});
    const args = ["run", prompt, "--url", target, "--mode", mode];
    if (flags["app-name"]) args.push("--app-name", flags["app-name"]);
    const result = await runLifecycleCommand({
      dir,
      name: "verify-live",
      args,
      timeout: Number(flags["timeout-ms"] || 180000),
      artifact: "agents-cli-verify-live.log.md",
    });
    const report = {
      kind: "ge.agents_cli.verify_live",
      ok: result.ok,
      generatedAt: GENERATED_AT,
      target,
      mode,
      prompt,
      runtimeId,
      command: result.command,
      exitCode: result.exitCode,
      stdoutTail: result.stdout,
      stderrTail: result.stderr,
    };
    await deps.writeJson(join(dir, "artifacts", "agents-cli-verify-live.json"), report);
    markStep(pipeline, "verifyLive", result.ok ? "done" : "failed", {
      output: "artifacts/agents-cli-verify-live.json",
      target,
      mode,
      exitCode: result.exitCode,
    });
    await savePipeline(dir, pipeline);
    return ok({ step: "verify-live", ...report, nextCommand: nextCommandFor(pipeline, dir) });
  } catch (e) {
    markStep(pipeline, "verifyLive", "failed", { error: e.message, target, mode });
    await savePipeline(dir, pipeline);
    fail(`Live verification failed: ${e.message}`);
  }
}

// ── Register (Agent Registry via gcloud alpha agent-registry) ─

async function buildToolSpec(dir, manifest, { fail, writeText }) {
  const maxBytes = 10 * 1024;
  const tools = mcpToolDescriptors(manifest);
  const specPath = join(dir, "mock_systems", "toolspec.json");
  let spec = { tools };
  let content = JSON.stringify(spec, null, 2) + "\n";
  if (Buffer.byteLength(content, "utf8") > maxBytes) {
    const compactTools = tools.map((tool) => ({
      name: tool.name,
      description: String(tool.description || tool.name).slice(0, 160),
      ...(tool.simulator ? { simulator: tool.simulator } : {}),
      inputSchema: tool.inputSchema?.properties ? {
        type: "object",
        properties: Object.fromEntries(Object.entries(tool.inputSchema.properties).slice(0, 4).map(([key, value]) => [
          key,
          { type: value?.type || "string" },
        ])),
        ...(tool.inputSchema.required?.length ? { required: tool.inputSchema.required.slice(0, 4) } : {}),
      } : { type: "object", properties: {} },
    }));
    spec = { tools: compactTools };
    content = JSON.stringify(spec, null, 2) + "\n";
  }
  if (Buffer.byteLength(content, "utf8") > maxBytes) {
    const baseTools = spec.tools.slice(0, Math.max(1, spec.tools.findIndex((tool) => String(tool.name || "").startsWith("query_"))));
    const queryTools = spec.tools.filter((tool) => String(tool.name || "").startsWith("query_")).slice(0, 20);
    const actionTools = spec.tools.filter((tool) => !String(tool.name || "").startsWith("query_") && tool.name !== "list_systems").slice(0, 20);
    spec = { tools: [...baseTools, ...queryTools, ...actionTools] };
    content = JSON.stringify(spec, null, 2) + "\n";
  }
  if (Buffer.byteLength(content, "utf8") > maxBytes) {
    fail(`Generated toolspec.json exceeds 10 KB Agent Registry limit after compaction (${Buffer.byteLength(content, "utf8")} bytes). Reduce exposed tools or split the MCP server by source system.`, "GE0010");
  }
  await writeText(specPath, content);
  return specPath;
}

async function testServiceReachability(url) {
  console.error(`Testing reachability of Cloud Run service at ${url}...`);
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10s timeout
    const res = await fetch(url, { signal: controller.signal, method: "GET" });
    clearTimeout(id);
    console.error(`Reachability check result: HTTP ${res.status} (${res.statusText})`);
    return { ok: true, status: res.status, statusText: res.statusText };
  } catch (e) {
    console.error(`Warning: Reachability check failed: ${e.message}`);
    return { ok: false, error: e.message };
  }
}

function normalizeAgentRegistryProtocol(protocolInput) {
  const value = String(protocolInput || "sse").toLowerCase().replace(/_/g, "-");
  if (value === "sse" || value === "jsonrpc" || value === "json-rpc") return "JSONRPC";
  if (value === "http-json" || value === "httpjson") return "HTTP_JSON";
  if (value === "grpc") return "GRPC";
  return String(protocolInput || "JSONRPC").toUpperCase().replace(/-/g, "_");
}

function assertSupportedAgentRegistryLocation(location, { fail }) {
  const value = String(location || "").toLowerCase();
  if (value === "us" || value === "eu") {
    fail("Manual Agent Registry MCP registration is not supported in the us or eu multi-region locations. Use a supported region or global.", "GE0010");
  }
}

export async function cmdRegister(dir, flags, deps) {
  const { loadPipeline, savePipeline, markStep, requireStep, nextCommandFor, fail, ok, runCommand, readJson, manifestPath, AGENT_MODEL } = deps;
  const pipeline = await loadPipeline(dir);
  await hydrateDeployStepFromMetadata(dir, pipeline, flags, deps);
  requireStep(pipeline, "deploy");
  const project = await getGcloudProject(flags, { runCommand });
  const region = await getGcloudRegion(flags);
  const mode = flags.as || "adk";
  const deployStep = pipeline.steps.deploy || {};
  const manifest = await readJson(manifestPath(dir), null);
  const serverName = snakeCase(pipeline.name || "mock-agent").replace(/_/g, "-");
  const displayName = flags["display-name"] || pipeline.name || "Mock Agent";

  if (mode === "mcp") {
    assertSupportedAgentRegistryLocation(region, { fail });
    // Per-department multi-tenant MCP service: register this agent at the dept URL
    // scoped by ?agent=<id>. --service-url comes from .ge.json mcpServices[<dept>]
    // (the worker passes it); fall back to a per-agent deploy serviceUrl if present.
    const agentId = flags["agent-id"] || snakeCase(pipeline.name || "mock-agent").replace(/_/g, "-");
    let serviceUrl = flags["service-url"] || deployStep.serviceUrl;
    if (!serviceUrl) fail("No --service-url (department MCP) and no deploy serviceUrl. Run `ge mcp deploy` and pass --service-url.", "GE0010");
    const u = new URL(serviceUrl.endsWith("/mcp") ? serviceUrl : `${serviceUrl.replace(/\/$/, "")}/mcp`);
    u.searchParams.set("agent", agentId);
    serviceUrl = u.toString();

    const protocolInput = flags.protocol || "jsonrpc";
    const protocolBinding = normalizeAgentRegistryProtocol(protocolInput);

    // Warm-up and Reachability Check
    const reachability = await testServiceReachability(serviceUrl);

    console.error(`Building tool spec from manifest...`);
    const specPath = await buildToolSpec(dir, manifest, { fail, writeText: deps.writeText });

    console.error(`Registering "${serverName}" as MCP service in Agent Registry...`);
    console.error(`Project: ${project} | Region: ${region}`);
    console.error(`URL: ${serviceUrl} | ProtocolBinding: ${protocolBinding}`);
    try {
      await runCommand("gcloud", [
        "alpha", "agent-registry", "services", "create", serverName,
        `--project=${project}`,
        `--location=${region}`,
        `--display-name=${displayName}`,
        "--mcp-server-spec-type=tool-spec",
        `--mcp-server-spec-content=${specPath}`,
        `--interfaces=url=${serviceUrl},protocolBinding=${protocolBinding}`,
      ], { stream: true, timeout: 60000 });

      // Authorize the agent identity to call this MCP server (governed agent→MCP egress).
      // Per gemini-enterprise-agent-platform/govern/policies/assign-identity-iam#agent-to-mcp-server,
      // the role is roles/iap.egressor bound on the mcpServer (optionally read-only conditioned).
      let principalSet = flags["agent-principalset"] || flags.principalset || "";
      if (!principalSet) {
        const pn = await runCommand("gcloud", ["projects", "describe", project, "--format=value(projectNumber)"], { stream: false });
        const num = (pn.stdout || "").trim();
        const orgId = flags["agent-identity-org-id"] || flags["agent-org-id"] || process.env.GE_AGENT_IDENTITY_ORG_ID || "";
        if (num && orgId) principalSet = `principalSet://agents.global.org-${orgId}.system.id.goog/attribute.platformContainer/aiplatform/projects/${num}`;
      }
      let egressGranted = false;
      if (principalSet) {
        const egress = ["beta", "iap", "web", "add-iam-policy-binding",
          `--project=${project}`, `--region=${region}`, `--mcpServer=${serverName}`,
          `--member=${principalSet}`, "--role=roles/iap.egressor"];
        if (flags["read-only"]) egress.push("--condition=expression=request.auth.type == 'MCP' && mcp.tool.isReadOnly,title=read-only-egress");
        else egress.push("--condition=None");
        console.error(`Granting roles/iap.egressor (agent→MCP) on mcpServer ${serverName}${flags["read-only"] ? " [read-only]" : ""}…`);
        const g = await runCommand("gcloud", egress, { stream: false });
        egressGranted = g.code === 0;
        console.error(egressGranted
          ? `  ✓ iap.egressor → ${principalSet}`
          : `  ⚠ iap.egressor grant failed (verify 'gcloud beta iap web add-iam-policy-binding --mcpServer' on your authed host): ${(g.stderr || "").split("\n")[0]}`);
      } else {
        console.error("  ⚠ skipped iap.egressor grant: no agent principalSet (pass --agent-principalset or set GE_AGENT_IDENTITY_ORG_ID)");
      }

      markStep(pipeline, "register", "done", { mode: "mcp", serverName, serviceUrl, protocol: protocolInput, specPath, reachability, egressGranted });
      await savePipeline(dir, pipeline);
      return ok({
        step: "register",
        mode: "mcp",
        serverName,
        serviceUrl,
        protocol: protocolInput,
        toolSpec: specPath,
        reachability,
        adkUsage: [
          `# Authentic ADK code with GCP Authentication for Agent Registry:`,
          `import os`,
          `from google.adk.agents.llm_agent import LlmAgent`,
          `from google.adk.auth.credential_manager import CredentialManager`,
          `from google.adk.integrations.agent_identity import GcpAuthProvider`,
          `from google.adk.integrations.agent_registry import AgentRegistry`,
          ``,
          `# 1. Register the GCP auth provider for automatic credential binding`,
          `CredentialManager.register_auth_provider(GcpAuthProvider())`,
          ``,
          `# 2. Initialize the registry client using ADC`,
          `registry = AgentRegistry(`,
          `    project_id=os.environ.get("GOOGLE_CLOUD_PROJECT", "${project}"),`,
          `    location=os.environ.get("GOOGLE_CLOUD_LOCATION", "${region}"),`,
          `)`,
          ``,
          `# 3. Retrieve the authenticated MCP toolset (bindings are resolved automatically)`,
          `mcp_tools = registry.get_mcp_toolset(`,
          `    mcp_server_name="projects/${project}/locations/${region}/mcpServers/${serverName}"`,
          `)`,
          ``,
          `# 4. Compose your agent with the toolset`,
          `agent = LlmAgent(`,
          `    name="orchestrator_agent",`,
          `    model="${AGENT_MODEL}",`,
          `    instruction="Use the registered MCP tools to answer questions.",`,
          `    tools=[mcp_tools]`,
          `)`,
        ].join("\n"),
        gcloudCommand: `gcloud alpha agent-registry services describe ${serverName} --project=${project} --location=${region}`,
        nextCommand: nextCommandFor(pipeline, dir),
      });
    } catch (e) {
      fail(`Agent Registry registration failed: ${e.message}`, "GE0010");
    }
  }

  if (mode === "a2a") {
    const serviceUrl = deployStep.serviceUrl;
    if (!serviceUrl) fail("No serviceUrl from deploy. Deploy with --target cloud_run first.", "GE0010");

    const a2aUrl = serviceUrl.endsWith("/") ? `${serviceUrl}.well-known/agent.json` : `${serviceUrl}/.well-known/agent.json`;

    // Warm-up and Reachability Check
    const reachability = await testServiceReachability(a2aUrl);

    console.error(`Registering "${serverName}" as A2A agent in Agent Registry...`);
    try {
      await runCommand("gcloud", [
        "alpha", "agent-registry", "services", "create", serverName,
        `--project=${project}`,
        `--location=${region}`,
        `--display-name=${displayName}`,
        `--interfaces=url=${a2aUrl},protocolBinding=HTTP_JSON`,
      ], { stream: true, timeout: 60000 });

      markStep(pipeline, "register", "done", { mode: "a2a", serverName, serviceUrl, reachability });
      await savePipeline(dir, pipeline);
      return ok({
        step: "register",
        mode: "a2a",
        serverName,
        serviceUrl,
        reachability,
        adkUsage: [
          `# Authentic ADK code with GCP Authentication for Agent Registry (A2A):`,
          `import os`,
          `import httpx`,
          `import google.auth`,
          `from google.auth.transport.requests import Request`,
          `from google.adk.integrations.agent_registry import AgentRegistry`,
          `from google.adk.agents.llm_agent import LlmAgent`,
          ``,
          `class GoogleAuth(httpx.Auth):`,
          `    def __init__(self):`,
          `        self.creds, _ = google.auth.default()`,
          `    def auth_flow(self, request):`,
          `        if not self.creds.valid:`,
          `            self.creds.refresh(Request())`,
          `        request.headers["Authorization"] = f"Bearer {self.creds.token}"`,
          `        yield request`,
          ``,
          `# Initialize the registry client`,
          `registry = AgentRegistry(`,
          `    project_id=os.environ.get("GOOGLE_CLOUD_PROJECT", "${project}"),`,
          `    location=os.environ.get("GOOGLE_CLOUD_LOCATION", "${region}"),`,
          `)`,
          ``,
          `# Configure the HTTP client with GoogleAuth and a timeout`,
          `httpx_client = httpx.AsyncClient(auth=GoogleAuth(), timeout=httpx.Timeout(60.0))`,
          ``,
          `# Retrieve the remote A2A agent`,
          `remote_agent = registry.get_remote_a2a_agent(`,
          `    agent_name="projects/${project}/locations/${region}/agents/${serverName}",`,
          `    httpx_client=httpx_client`,
          `)`,
          ``,
          `# Compose your orchestrator`,
          `orchestrator = LlmAgent(`,
          `    name="orchestrator_agent",`,
          `    model="${AGENT_MODEL}",`,
          `    instruction="Delegate tasks to the remote A2A agent when needed.",`,
          `    tools=[remote_agent]`,
          `)`,
        ].join("\n"),
        nextCommand: nextCommandFor(pipeline, dir),
      });
    } catch (e) {
      fail(`A2A registration failed: ${e.message}`, "GE0010");
    }
  }

  // mode === "adk" — Agent Runtime, ready for Gemini Enterprise publish
  const meta = await readJson(join(dir, "deployment_metadata.json"), null);
  const runtimeId = parseAgentRuntimeId(meta, deployStep.runtimeId);
  if (!runtimeId) fail("No runtime ID. Deploy with --target agent_runtime first, or use --as mcp/a2a for Cloud Run services.", "GE0010");

  markStep(pipeline, "register", "done", { mode: "adk", runtimeId });
  await savePipeline(dir, pipeline);
  return ok({
    step: "register",
    mode: "adk",
    runtimeId,
    nextStep: `factory publish --dir ${dir} --app-id <GEMINI_ENTERPRISE_APP_ID>`,
    nextCommand: nextCommandFor(pipeline, dir),
  });
}

// ── Publish (Gemini Enterprise) ──────────────────────────────

export async function cmdPublish(dir, flags, deps) {
  const { loadPipeline, savePipeline, markStep, requireStep, nextCommandFor, fail, ok, runCommand, readJson, writeJson, GENERATED_AT } = deps;
  const pipeline = await loadPipeline(dir);
  await hydrateDeployStepFromMetadata(dir, pipeline, flags, deps);
  requireStep(pipeline, "deploy");
  const project = await getGcloudProject(flags, { runCommand });
  const location = flags.location || flags.region || process.env.GEMINI_ENTERPRISE_LOCATION || "global";
  const projectNumber = flags["project-number"] || await getGcloudProjectNumber(project, { runCommand });
  const rawAppId = flags["app-id"] || process.env.GEMINI_ENTERPRISE_APP_ID || process.env.ID;
  if (!rawAppId) fail("--app-id required (or set GEMINI_ENTERPRISE_APP_ID)", "GE0011");
  const resolvedApp = await resolveGeminiEnterpriseAppId(rawAppId, { project, projectNumber, location }, { runCommand });
  const appId = resolvedApp.appId;

  const meta = await readJson(join(dir, "deployment_metadata.json"), null);
  const regType = meta?.is_a2a ? "a2a" : "adk";
  const runtimeId = parseAgentRuntimeId(meta, pipeline.steps.deploy?.runtimeId);
  if (regType === "adk" && !runtimeId) {
    fail("No valid Agent Runtime ID found. Run factory deploy-status until deployment writes deployment_metadata.json before publishing.", "GE0011");
  }
  const displayName = flags["display-name"] || pipeline.name || "Mock Demo Agent";
  const description = flags.description || `Generated mock agent for ${pipeline.domain} domain`;

  console.error(`Publishing to Gemini Enterprise (${regType})...`);
  try {
    const publishArgs = ["publish", "gemini-enterprise",
      "--gemini-enterprise-app-id", appId,
      "--display-name", displayName,
      "--description", description,
      "--tool-description", description,
      "--registration-type", regType];
    if (project) publishArgs.push("--project-id", project);
    if (projectNumber) publishArgs.push("--project-number", projectNumber);
    if (runtimeId && regType === "adk") publishArgs.push("--agent-runtime-id", runtimeId);
    await runCommand("agents-cli", publishArgs, { cwd: dir, stream: true, timeout: 180000 });

    const registration = {
      generatedAt: GENERATED_AT,
      appId,
      rawAppId,
      appIdResolution: resolvedApp.matched,
      project,
      projectNumber,
      location,
      regType,
      runtimeId,
      displayName,
      description,
    };
    await writeJson(join(dir, "gemini_enterprise_registration.json"), registration);
    markStep(pipeline, "publish", "done", registration);
    await savePipeline(dir, pipeline);
    return ok({ step: "publish", appId, rawAppId, appIdResolution: resolvedApp.matched, projectNumber, regType, runtimeId, displayName, registration: join(dir, "gemini_enterprise_registration.json"), nextCommand: nextCommandFor(pipeline, dir) });
  } catch (e) {
    markStep(pipeline, "publish", "failed", { error: e.message });
    await savePipeline(dir, pipeline);
    fail(`Publish failed: ${e.message}`, "GE0011");
  }
}

// Exported for tests / callers that want the individual gcloud helpers
// without going through a cmd* function.
export const __internal = {
  getGcloudProject,
  getGcloudProjectNumber,
  getGcloudRegion,
  parseAgentRuntimeId,
  agentRuntimeRunUrl,
  hydrateDeployStepFromMetadata,
  parseOperationId,
  safeAgentsCliProjectName,
  normalizeGeminiEnterpriseAppResource,
  parseGeminiEnterpriseApps,
  resolveGeminiEnterpriseAppId,
  buildToolSpec,
  testServiceReachability,
  normalizeAgentRegistryProtocol,
  assertSupportedAgentRegistryLocation,
};
