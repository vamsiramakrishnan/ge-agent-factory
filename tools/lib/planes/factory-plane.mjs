import { join } from "node:path";
import { existsSync } from "node:fs";
import { createCheckCollector } from "../doctor/report.mjs";
import { assertRemoteAuthorized } from "../remote-guard.mjs";

const noop = () => {};

// Hardcoded to match installer/terraform/ui_services.tf's `name = "ge-agent-factory-console"`
// (the console Cloud Run service, unlike gateway/worker, has no configurable
// *_service_name terraform var/output — so there's no cfg.consoleService to read).
export const CONSOLE_SERVICE = "ge-agent-factory-console";
export const FACTORY_IMAGE_BIND_TARGETS = [
  "google_service_account.runner",
  "google_service_account.gateway",
  "google_service_account.builder",
  "google_project_iam_custom_role.build_submitter",
  "google_project_iam_custom_role.agent_identity_iam_binder",
  "google_project_iam_member.runner",
  "google_project_iam_member.gateway",
  "google_project_iam_member.builder",
  "google_project_iam_member.runner_build_submitter",
  "google_project_iam_member.builder_agent_identity_iam_binder",
  "google_service_account_iam_member.gateway_can_impersonate_runner",
  "google_service_account_iam_member.runner_can_impersonate_builder",
  "google_storage_bucket.factory",
  "google_storage_bucket_iam_member.runner_bucket_admin",
  "google_storage_bucket_iam_member.gateway_bucket_admin",
  "google_cloud_tasks_queue.factory_stages",
  "google_cloud_run_v2_service.worker",
  "google_cloud_run_v2_service.gateway",
  "google_cloud_run_v2_service_iam_member.gateway_invokes_worker",
  "google_cloud_run_v2_service_iam_member.runner_invokes_worker",
  "google_cloud_run_v2_service_iam_member.discoveryengine_invokes_worker",
];
export const CONSOLE_IMAGE_BIND_TARGETS = [
  "google_cloud_run_v2_service.console",
];

export function serviceUrl(service) {
  return service?.status?.url || null;
}

export function serviceIapEnabled(service) {
  return String({ ...(service?.metadata?.annotations || {}) }["run.googleapis.com/iap-enabled"] || "").toLowerCase() === "true";
}

export function serviceMemory(service) {
  try { return service.spec.template.spec.containers[0].resources.limits.memory; } catch { return null; }
}

export function serviceEnv(service, key) {
  try { return (service.spec.template.spec.containers[0].env || []).find((item) => item.name === key)?.value; } catch { return undefined; }
}

export function terraformVarArgs(cfg, extra = {}) {
  const vars = {
    project_id: cfg.project,
    project_number: cfg.projectNumber,
    agent_identity_org_id: cfg.agentIdentityOrgId,
    gemini_enterprise_app_id: cfg.geAppId,
    region: cfg.region,
    gemini_enterprise_location: cfg.geLocation,
    ...extra,
  };
  const args = [];
  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined && value !== "" && value !== null) args.push("-var", `${key}=${value}`);
  }
  return args;
}

export function terraformTargetArgs(targets = []) {
  return targets.flatMap((target) => ["-target", target]);
}

function parseBindings(text) {
  try {
    return JSON.parse(text || "{}").bindings || [];
  } catch {
    return [];
  }
}

function bindingHasMember(bindings, role, memberNeedle) {
  return bindings.some((binding) => binding.role === role && (binding.members || []).some((member) => member.includes(memberNeedle)));
}

export function createFactoryPlane({
  repoRoot,
  terraformDir,
  ensureGcloud,
  ensureTerraform,
  ensureAgentIdentityConfig,
  persistAgentIdentityConfig,
  tfOutputs,
  run,
  gcloud,
  gitShortSha,
  writeTextFile,
  authorize = assertRemoteAuthorized,
} = {}) {
  if (!repoRoot || !terraformDir || !ensureGcloud || !ensureTerraform || !ensureAgentIdentityConfig || !persistAgentIdentityConfig || !tfOutputs || !run || !gcloud || !gitShortSha || !writeTextFile) {
    throw new Error("createFactoryPlane requires repo, terraform, identity, command, and file dependencies");
  }

  function describeRun(cfg, service) {
    const result = gcloud(["run", "services", "describe", service, "--project", cfg.project, "--region", cfg.region, "--format=json"], { allowFail: true });
    if (!result.ok) return null;
    try { return JSON.parse(result.out); } catch { return null; }
  }

  function terraformStateList() {
    const result = run("terraform", [`-chdir=${terraformDir}`, "state", "list"], { allowFail: true });
    if (!result.ok) return [];
    return String(result.out || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  }

  function stateHasAddress(state, address) {
    return state.some((item) => item === address || item.endsWith(`.${address}`));
  }

  function assertImageTargetsTerraformManaged(cfg) {
    const state = terraformStateList();
    const missing = [];
    const gatewayExists = cfg.gatewayService && describeRun(cfg, cfg.gatewayService);
    const workerExists = cfg.workerService && describeRun(cfg, cfg.workerService);
    if (gatewayExists && !stateHasAddress(state, "google_cloud_run_v2_service.gateway")) missing.push(cfg.gatewayService);
    if (workerExists && !stateHasAddress(state, "google_cloud_run_v2_service.worker")) missing.push(cfg.workerService);
    if (!missing.length) return;
    throw new Error(
      `refusing Terraform image bind: existing Cloud Run service(s) ${missing.join(", ")} are not managed in installer/terraform state. ` +
      "Import/reconcile Terraform state before running `ge images deploy`; otherwise Terraform will plan a full duplicate infra create.",
    );
  }

  function resolveRepo(cfg) {
    const outputs = tfOutputs();
    return outputs.artifact_repository || `${cfg.region}-docker.pkg.dev/${cfg.project}/ge-agent-factory`;
  }

  function builderImageTag(cfg) {
    return `${resolveRepo(cfg)}/ge-agent-factory-builder:latest`;
  }

  function currentServiceImage(cfg, service) {
    const described = describeRun(cfg, service);
    return described?.spec?.template?.spec?.containers?.[0]?.image || null;
  }

  function defaultApplyTargets({ gatewayImage, workerImage, consoleImage } = {}) {
    if ((gatewayImage || workerImage) && !consoleImage) return FACTORY_IMAGE_BIND_TARGETS;
    if (consoleImage && !gatewayImage && !workerImage) return CONSOLE_IMAGE_BIND_TARGETS;
    return [];
  }

  function infra(cfg, { sub, gatewayImage, workerImage, consoleImage, targets = null, yes = false, log = noop } = {}) {
    ensureTerraform();
    const chdir = `-chdir=${terraformDir}`;
    const consoleOnlyBind = Boolean(consoleImage && !gatewayImage && !workerImage);
    if (consoleOnlyBind) {
      gatewayImage = currentServiceImage(cfg, cfg.gatewayService) || gatewayImage;
      workerImage = currentServiceImage(cfg, cfg.workerService) || workerImage;
    }
    const imageVars = {};
    if (gatewayImage) imageVars.gateway_image = gatewayImage;
    if (workerImage) imageVars.worker_image = workerImage;
    if (consoleImage) imageVars.console_image = consoleImage;
    const inferredTargets = consoleOnlyBind
      ? CONSOLE_IMAGE_BIND_TARGETS
      : defaultApplyTargets({ gatewayImage, workerImage, consoleImage });
    if (["apply", "plan"].includes(sub)) {
      if (!cfg.project || !cfg.projectNumber) throw new Error("project & projectNumber required (run `ge init`).");
      if (!cfg.geAppId) throw new Error("geAppId required.");
      ensureAgentIdentityConfig(cfg, { log });
      persistAgentIdentityConfig(cfg);
      const lines = [
        "# Generated by `ge infra` from .ge.json / env.",
        `project_id                 = "${cfg.project}"`,
        `project_number             = "${cfg.projectNumber || ""}"`,
        `agent_identity_org_id      = "${cfg.agentIdentityOrgId || ""}"`,
        `region                     = "${cfg.region}"`,
        `gemini_enterprise_app_id   = "${cfg.geAppId || ""}"`,
        `gemini_enterprise_location = "${cfg.geLocation}"`,
      ];
      writeTextFile(join(repoRoot, "installer", "values.tfvars"), lines.join("\n") + "\n");
      log("wrote installer/values.tfvars");
    }
    switch (sub) {
      case "init":
        run("terraform", [chdir, "init"], { capture: false });
        return { sub };
      case "plan":
        run("terraform", [chdir, "init", "-input=false"], { capture: false });
        run("terraform", [chdir, "plan", ...terraformTargetArgs(targets || inferredTargets), ...terraformVarArgs(cfg, imageVars)], { capture: false });
        return { sub };
      case "apply":
        run("terraform", [chdir, "init", "-input=false"], { capture: false });
        run("terraform", ["-chdir=" + terraformDir, "apply", "-auto-approve", ...terraformTargetArgs(targets || inferredTargets), ...terraformVarArgs(cfg, imageVars)], { capture: false });
        return { sub };
      case "output":
        return { sub, outputs: tfOutputs() };
      case "destroy":
        if (!yes) throw new Error("refusing to destroy without yes=true");
        run("terraform", [chdir, "destroy", "-auto-approve", ...terraformVarArgs(cfg)], { capture: false });
        return { sub };
      default:
        throw new Error("usage: ge infra <init|plan|apply|output|destroy>");
    }
  }

  function build(cfg, { target, tag: tagOverride, log = noop } = {}) {
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init`.");
    if (target === "builder") {
      const repo = resolveRepo(cfg);
      run("gcloud", ["artifacts", "repositories", "create", repo.split("/").pop(), "--repository-format=docker", "--location", cfg.region, "--project", cfg.project], { allowFail: true });
      const image = builderImageTag(cfg);
      log(`building shared builder image → ${image}`);
      run("gcloud", ["builds", "submit", "apps/factory", "--project", cfg.project, "--config", "apps/factory/cloudbuild.builder.yaml", "--substitutions", `_IMAGE=${image}`], { capture: false });
      return { builderImage: image };
    }
    if (target === "console") {
      const repo = resolveRepo(cfg);
      const arRepoId = repo.split("/").pop();
      const tag = tagOverride || gitShortSha();
      const consoleImage = `${repo}/${CONSOLE_SERVICE}:${tag}`;
      log(`building console → ${consoleImage}`);
      // Console's Dockerfile needs tools/ + the generator (outside apps/console), and its
      // cloudbuild.yaml (unlike the worker's) takes discrete _REGION/_AR_REPO/_SERVICE_NAME/
      // _TAG substitutions rather than one _IMAGE — mirrors installer/build-and-deploy.sh's
      // console build step exactly, so `ge images build console` and the installer produce
      // the same Cloud Build invocation shape. Positional source = repoRoot, same reason as
      // the worker build below.
      run("gcloud", ["builds", "submit", repoRoot, "--project", cfg.project, "--region", cfg.region,
        "--config", "apps/console/cloudbuild.yaml",
        "--substitutions", `_REGION=${cfg.region},_AR_REPO=${arRepoId},_SERVICE_NAME=${CONSOLE_SERVICE},_TAG=${tag}`], { capture: false });
      return { consoleImage };
    }
    const repo = resolveRepo(cfg);
    const tag = tagOverride || gitShortSha();
    const gatewayImage = `${repo}/${cfg.gatewayService}:${tag}`;
    const workerImage = `${repo}/${cfg.workerService}:${tag}`;
    log(`building gateway → ${gatewayImage}`);
    run("gcloud", ["builds", "submit", repoRoot, "--project", cfg.project,
      "--config", "apps/factory/cloudbuild.gateway.yaml",
      "--substitutions", `_IMAGE=${gatewayImage}`], { capture: false });
    log(`building worker → ${workerImage}`);
    // Build the worker from the repo-root context via its cloudbuild config (mirrors
    // mcp-plane / the gateway): the worker imports @ge/run-ledger + @ge/okf (packages/)
    // and tools/lib/*, which live OUTSIDE apps/factory, so `--tag` (app-dir
    // context) can't include them. Positional source = repoRoot.
    run("gcloud", ["builds", "submit", repoRoot, "--project", cfg.project,
      "--config", "apps/factory/cloudbuild.worker.yaml",
      "--substitutions", `_IMAGE=${workerImage}`], { capture: false });
    return { gatewayImage, workerImage };
  }

  function deploy(cfg, { target = "all", tag = null, log = noop } = {}) {
    // Gate: builds images and runs terraform apply against real Cloud Run.
    const { dryRun } = authorize("ge factory deploy", { mode: cfg.mode });
    ensureGcloud();
    ensureTerraform();
    if (!cfg.project) throw new Error("No project. Run `ge init`.");
    if (dryRun) {
      log("[dry-run] skipping image build + terraform apply — set GE_CONFIRM=1 to deploy");
      return { deployed: [], dryRun: true };
    }
    assertImageTargetsTerraformManaged(cfg);
    log("building gateway + worker images");
    const { gatewayImage, workerImage } = build(cfg, { tag, log });
    log("binding images via terraform apply (Terraform owns Cloud Run config)");
    infra(cfg, { sub: "apply", gatewayImage, workerImage, log });
    const deployed = target === "gateway" ? [cfg.gatewayService]
      : target === "worker" ? [cfg.workerService]
      : [cfg.gatewayService, cfg.workerService];
    return { deployed, gatewayImage, workerImage };
  }

  function doctor(cfg) {
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init` first.");
    const collector = createCheckCollector();
    const { add } = collector;

    const auth = gcloud(["auth", "list", "--filter=status:ACTIVE", "--format=value(account)"], { allowFail: true });
    add("gcloud auth", auth.ok && auth.out ? "pass" : "fail", auth.out || "no active account", "gcloud auth login");

    for (const [label, svc] of [["gateway", cfg.gatewayService], ["worker", cfg.workerService]]) {
      const service = describeRun(cfg, svc);
      if (!service) {
        add(`${label} service`, "fail", `${svc} not found`, `ge deploy ${label}`);
        continue;
      }
      const ready = (service.status?.conditions || []).find((condition) => condition.type === "Ready");
      add(`${label} ready`, ready?.status === "True" ? "pass" : "fail", `${svc}: ${ready?.status || "?"} ${ready?.message || ""}`, `ge logs --service ${svc}`);
      if (serviceIapEnabled(service)) add(`${label} IAP`, "warn", "platform IAP enabled — blocks programmatic calls", `gcloud run services update ${svc} --project ${cfg.project} --region ${cfg.region} --no-iap`);
      const memory = serviceMemory(service);
      if (label === "gateway" && memory && /^(128|256|384)Mi$/.test(memory)) add("gateway memory", "fail", `${memory} — too small, OOMs during scaffolding`, "ge deploy gateway");
      if (label === "gateway") {
        const workerUrl = serviceEnv(service, "GE_AGENT_FACTORY_WORKER_URL");
        add("gateway GE_AGENT_FACTORY_WORKER_URL", workerUrl ? "pass" : "fail", workerUrl || "empty (gateway crashes on boot)", "ge deploy gateway");
      }
      if (label === "worker") {
        const builderImage = serviceEnv(service, "GE_AGENT_FACTORY_BUILDER_IMAGE");
        add("worker GE_AGENT_FACTORY_BUILDER_IMAGE", builderImage ? "pass" : "fail",
          builderImage || "empty — release stages fall back to the public uv base image and lose the shared runner script/cache",
          "ge images build builder && ge images deploy");
        const genaiLocation = serviceEnv(service, "GOOGLE_GENAI_LOCATION");
        const expectedLocation = cfg.geLocation || "global";
        add("worker GOOGLE_GENAI_LOCATION", genaiLocation === expectedLocation ? "pass" : "warn",
          genaiLocation ? `${genaiLocation} (expected ${expectedLocation})` : "empty",
          "ge infra apply");
      }
    }

    const policy = gcloud(["run", "services", "get-iam-policy", cfg.workerService, "--project", cfg.project, "--region", cfg.region, "--format=json"], { allowFail: true });
    const invoker = policy.ok && bindingHasMember(parseBindings(policy.out), "roles/run.invoker", cfg.serviceAccount);
    add("runner SA → worker invoker", invoker ? "pass" : "warn", invoker ? cfg.serviceAccount : `not granted to ${cfg.serviceAccount}`,
      `gcloud run services add-iam-policy-binding ${cfg.workerService} --project ${cfg.project} --region ${cfg.region} --member=serviceAccount:${cfg.serviceAccount} --role=roles/run.invoker`);

    const builderSa = cfg.builderServiceAccount || `ge-agent-factory-builder@${cfg.project}.iam.gserviceaccount.com`;
    const projectPolicy = gcloud(["projects", "get-iam-policy", cfg.project, "--format=json"], { allowFail: true });
    const projectBindings = projectPolicy.ok ? parseBindings(projectPolicy.out) : [];
    const requiredBuilderRoles = [
      "roles/aiplatform.user",
      "roles/discoveryengine.editor",
      "roles/serviceusage.serviceUsageConsumer",
    ];
    const missingBuilderRoles = requiredBuilderRoles.filter((role) => !bindingHasMember(projectBindings, role, builderSa));
    add("builder SA release-stage roles", missingBuilderRoles.length === 0 ? "pass" : "fail",
      missingBuilderRoles.length === 0 ? builderSa : `missing ${missingBuilderRoles.join(", ")} for ${builderSa}`,
      "ge infra apply");

    const queue = gcloud(["tasks", "queues", "describe", cfg.tasksQueue, "--location", cfg.region, "--project", cfg.project, "--format=value(state)"], { allowFail: true });
    add("tasks queue", queue.ok && queue.out === "RUNNING" ? "pass" : "warn", queue.ok ? queue.out : "not found", `gcloud tasks queues resume ${cfg.tasksQueue} --location ${cfg.region} --project ${cfg.project}`);

    return collector.report({ project: cfg.project, region: cfg.region });
  }

  // Console checks (image-gated Cloud Run service — installer/terraform/
  // ui_services.tf only creates it once console_image is non-empty). Deliberately
  // never throws: unlike doctor() above (which asserts cfg.project up front for the
  // mutating gateway/worker plane), a missing project/undeployed console is just
  // another failed check here, not a hard stop — `ge console doctor` should always
  // return a report, even against a project that has never run `ge console deploy`.
  function consoleDoctor(cfg) {
    const collector = createCheckCollector();
    const { add } = collector;

    add("project configured", cfg.project ? "pass" : "fail", cfg.project || "no project (run `ge init`)", "ge init --project <id>");

    const gcloudCheck = gcloud(["--version"], { allowFail: true });
    add("gcloud installed", gcloudCheck.ok ? "pass" : "warn", gcloudCheck.ok ? "available" : "not found on PATH", "mise run setup");

    add("terraform root present", existsSync(terraformDir) ? "pass" : "fail", existsSync(terraformDir) ? terraformDir : `${terraformDir} not found`, "check out installer/terraform");

    const outputs = tfOutputs();
    add("console_image bound", outputs.console_url ? "pass" : "warn",
      outputs.console_url || "console_url terraform output is empty — console_image var not set, service not created",
      "ge console deploy");

    add("gatewayUrl configured", cfg.gatewayUrl ? "pass" : "warn",
      cfg.gatewayUrl || "empty — the deployed console reaches the gateway directly (API_GATEWAY_URL), independent of this, but local `ge` needs it too",
      "ge init");

    const service = cfg.project ? describeRun(cfg, CONSOLE_SERVICE) : null;
    if (!service) {
      add("console service", "warn", `${CONSOLE_SERVICE} not found (not deployed, or --project/region mismatch)`, "ge console deploy");
    } else {
      const ready = (service.status?.conditions || []).find((condition) => condition.type === "Ready");
      add("console ready", ready?.status === "True" ? "pass" : "fail", `${CONSOLE_SERVICE}: ${ready?.status || "?"} ${ready?.message || ""}`, `ge logs --service ${CONSOLE_SERVICE}`);
      if (serviceIapEnabled(service)) add("console IAP", "warn", "platform IAP enabled — blocks programmatic calls", `gcloud run services update ${CONSOLE_SERVICE} --project ${cfg.project} --region ${cfg.region} --no-iap`);
      const readonly = serviceEnv(service, "GE_CONSOLE_READONLY");
      const locked = /^(1|true|yes|on)$/i.test(String(readonly || ""));
      add("console mutation mode", locked ? "warn" : "pass",
        locked ? "GE_CONSOLE_READONLY is set — Console mutations are blocked" : "enabled — mutating actions delegate to the runtime gateway",
        "unset GE_CONSOLE_READONLY unless intentionally running a read-only console");
    }

    const report = collector.report({ project: cfg.project, region: cfg.region, service: CONSOLE_SERVICE });
    return { ok: report.fails === 0, ...report };
  }

  return { build, builderImageTag, deploy, describeRun, doctor, consoleDoctor, infra, resolveRepo };
}
