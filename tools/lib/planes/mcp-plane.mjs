import { createCheckCollector } from "../doctor/report.mjs";

const noop = () => {};

export function mcpServiceName(dept) {
  return `ge-agent-factory-mcp-${dept}`;
}

export function agentPrincipal(cfg = {}) {
  return cfg.agentIdentityPrincipalSet || (cfg.serviceAccount ? `serviceAccount:${cfg.serviceAccount}` : "");
}

export function hasIamRole(bindings = [], role, member) {
  return !!member && bindings.some((binding) => (
    binding.role === role && (binding.members || []).includes(member)
  ));
}

function parseBindings(text) {
  try {
    return JSON.parse(text || "{}").bindings || [];
  } catch {
    return [];
  }
}

function deployEnvVars(cfg) {
  const vars = [`GE_DATA_BACKEND=mcp`, `GE_AGENT_DATA_BUCKET=${cfg.dataBucket || ""}`];
  // Durable simulator state (per docs/runbooks/simulator-durable-state.md). Opt-in:
  // set via .ge.json `simulatorStateBackend` or env GE_SIMULATOR_STATE_BACKEND
  // (firestore|alloydb). Absent ⇒ unchanged (memory default everywhere).
  const backend = cfg.simulatorStateBackend || process.env.GE_SIMULATOR_STATE_BACKEND;
  if (backend) {
    vars.push(`GE_SIMULATOR_STATE_BACKEND=${backend}`);
    if (cfg.project) vars.push(`GOOGLE_CLOUD_PROJECT=${cfg.project}`);
    const dsn = cfg.alloydbDsn || process.env.GE_AGENT_ALLOYDB_DSN;
    if (dsn) vars.push(`GE_AGENT_ALLOYDB_DSN=${dsn}`);
  }
  // BYO-twin overlay backend (docs/reference/simulator-systems.mdx). cfg.simulatorOverlayBackend
  // is a CONFIG_FIELDS scalar (flag → env → file → "memory" default), so it already reflects env
  // precedence; process.env is only a fallback for callers passing a bare cfg. "memory" is the
  // no-op default everywhere, so only forward the var when a durable backend is configured.
  const overlayBackend = cfg.simulatorOverlayBackend || process.env.GE_SIMULATOR_OVERLAY_BACKEND;
  if (overlayBackend && overlayBackend !== "memory") {
    vars.push(`GE_SIMULATOR_OVERLAY_BACKEND=${overlayBackend}`);
  }
  return vars.join(",");
}

// Full Artifact Registry tag for an MCP service image. Matches the convention used
// by the gateway/worker/builder images (see factory-plane.mjs):
//   <region>-docker.pkg.dev/<project>/ge-agent-factory/<svc>:<tag>
export function mcpImageTag(cfg, svc, imageTag = "latest") {
  return `${cfg.region}-docker.pkg.dev/${cfg.project}/ge-agent-factory/${svc}:${imageTag}`;
}

export function createMcpPlane({
  departments,
  serviceDir,
  repoRoot,
  cloudBuildConfig = "apps/factory/mcp-service/cloudbuild.yaml",
  ensureGcloud,
  describeRun,
  serviceUrl,
  readConfig,
  writeConfig,
  gcloud,
} = {}) {
  if (!departments || !serviceDir || !repoRoot || !ensureGcloud || !describeRun || !serviceUrl || !readConfig || !writeConfig || !gcloud) {
    throw new Error("createMcpPlane requires departments, service, repoRoot, config, and gcloud dependencies");
  }

  function mcpDeploy(cfg, { depts = departments, memory = "1Gi", cpu = "1", imageTag = "latest", log = noop } = {}) {
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init`.");
    const services = { ...(cfg.mcpServices || {}) };

    for (const dept of depts) {
      const svc = mcpServiceName(dept);
      const image = mcpImageTag(cfg, svc, imageTag);
      // Build with the repo root as the build context (positional source = repoRoot) so the
      // Dockerfile can COPY packages/simulator-runtime, which lives outside the app dir.
      // `gcloud run deploy --source` cannot do this — it pins the context to the source dir —
      // so we build via Cloud Build then deploy the resulting image.
      log(`building ${svc} → ${image}`);
      gcloud(["builds", "submit", "--config", cloudBuildConfig,
        "--substitutions", `_IMAGE=${image}`, "--project", cfg.project, repoRoot], { capture: false });

      log(`deploying ${svc}`);
      gcloud(["run", "deploy", svc, "--image", image, "--project", cfg.project, "--region", cfg.region,
        "--no-allow-unauthenticated", "--memory", memory, "--cpu", cpu,
        "--service-account", cfg.serviceAccount,
        "--update-env-vars", deployEnvVars(cfg)], { capture: false });

      const grantInvoker = (member) => {
        if (!member) return;
        const result = gcloud(["run", "services", "add-iam-policy-binding", svc, "--project", cfg.project, "--region", cfg.region,
          "--member", member, "--role", "roles/run.invoker", "--condition=None"], { allowFail: true });
        const err = (result.err || "").split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 3).join(" ");
        log(`  invoker ${result.ok ? "✓" : "✗"} ${member}${result.ok ? "" : " — " + (err || "failed")}`);
      };

      grantInvoker(cfg.agentIdentityPrincipalSet);
      grantInvoker(cfg.serviceAccount ? `serviceAccount:${cfg.serviceAccount}` : null);

      const url = serviceUrl(describeRun(cfg, svc));
      if (url) services[dept] = url;
    }

    writeConfig({ ...readConfig(), mcpServices: services });
    log("wrote mcpServices to .ge.json");
    return { services };
  }

  function mcpDoctor(cfg) {
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init`.");
    const collector = createCheckCollector();
    const { add } = collector;
    const principal = agentPrincipal(cfg);
    const agentIdentityConfigured = !!cfg.agentIdentityPrincipalSet;

    for (const dept of departments) {
      const svc = mcpServiceName(dept);
      const service = describeRun(cfg, svc);
      if (!service) {
        add(`mcp ${dept}`, "warn", `${svc} not deployed`, "ge mcp deploy");
        continue;
      }
      const ready = (service.status?.conditions || []).find((condition) => condition.type === "Ready");
      add(`mcp ${dept}`, ready?.status === "True" ? "pass" : "fail", `${svc}: ${ready?.status || "?"}`, `ge logs --service ${svc}`);

      const policy = gcloud(["run", "services", "get-iam-policy", svc, "--project", cfg.project, "--region", cfg.region, "--format=json"], { allowFail: true });
      const canInvoke = policy.ok && hasIamRole(parseBindings(policy.out), "roles/run.invoker", principal);
      add(`mcp ${dept} invoker`, canInvoke ? "pass" : "warn", canInvoke ? "agent identity can invoke" : `${principal || "agent identity"} lacks run.invoker`, "ge mcp deploy");
    }

    const registryApi = gcloud(["services", "list", "--enabled", "--project", cfg.project, "--filter=config.name=agentregistry.googleapis.com", "--format=value(config.name)"], { allowFail: true });
    add("agent registry API", registryApi.ok && registryApi.out ? "pass" : "warn", registryApi.out || "agentregistry.googleapis.com not enabled", "ge data up  (or enable_mcp=true)");

    const registryCli = gcloud(["alpha", "agent-registry", "services", "list", "--project", cfg.project, "--location", cfg.region, "--format=value(name)"], { allowFail: true });
    add("agent-registry CLI", registryCli.ok ? "pass" : "warn", registryCli.ok ? "available" : "gcloud alpha agent-registry unavailable", "gcloud components install alpha");

    const projectPolicy = gcloud(["projects", "get-iam-policy", cfg.project, "--format=json"], { allowFail: true });
    const projectBindings = projectPolicy.ok ? parseBindings(projectPolicy.out) : [];
    for (const role of ["roles/agentregistry.viewer", "roles/mcp.toolUser"]) {
      const short = role.split("/")[1];
      const ok = hasIamRole(projectBindings, role, principal);
      const missingDetail = agentIdentityConfigured
        ? `not granted to ${principal}`
        : "agentIdentityOrgId is not configured, so Terraform cannot compute the Agent Identity principalSet";
      const fix = agentIdentityConfigured
        ? "ge up --infra  (apply agent_identity.tf)"
        : "ge init  (or set GE_AGENT_IDENTITY_ORG_ID, then ge up --infra)";
      add(`agent identity ${short}`, ok ? "pass" : "warn", ok ? `granted to ${principal}` : missingDetail, fix);
    }

    return collector.report({ project: cfg.project, region: cfg.region, principal });
  }

  return { mcpDeploy, mcpDoctor };
}
