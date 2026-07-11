import { expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parse as parseYaml } from "yaml";
import { CONSOLE_IMAGE_BIND_TARGETS, CONSOLE_SERVICE, FACTORY_IMAGE_BIND_TARGETS, createFactoryPlane, serviceEnv, serviceIapEnabled, serviceMemory, serviceUrl, terraformTargetArgs, terraformVarArgs } from "./factory-plane.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

const readyService = {
  metadata: { annotations: { "run.googleapis.com/iap-enabled": "false" } },
  status: { url: "https://gateway.example", conditions: [{ type: "Ready", status: "True" }] },
  spec: {
    template: {
      spec: {
        containers: [{
          resources: { limits: { memory: "1Gi" } },
          env: [
            { name: "GE_AGENT_FACTORY_WORKER_URL", value: "https://worker.example" },
            { name: "GE_AGENT_FACTORY_BUILDER_IMAGE", value: "us-docker.pkg.dev/demo/ge-agent-factory/ge-agent-factory-builder:latest" },
            { name: "GOOGLE_GENAI_LOCATION", value: "global" },
          ],
        }],
      },
    },
  },
};

function makePlane(overrides = {}) {
  const calls = [];
  const plane = createFactoryPlane({
    repoRoot: "/repo",
    terraformDir: overrides.terraformDir ?? "/repo/installer/terraform",
    ensureGcloud: () => calls.push(["ensureGcloud"]),
    ensureTerraform: () => calls.push(["ensureTerraform"]),
    ensureAgentIdentityConfig: (cfg) => { cfg.agentIdentityOrgId ||= "456"; },
    persistAgentIdentityConfig: () => calls.push(["persistAgentIdentityConfig"]),
    tfOutputs: () => overrides.tfOutputs?.() ?? { artifact_repository: "us-docker.pkg.dev/demo/ge-agent-factory" },
    gitShortSha: () => "abc123",
    writeTextFile: (path, content) => calls.push(["writeTextFile", path, content]),
    run: (bin, args, opts) => {
      calls.push(["run", bin, args, opts]);
      return overrides.run?.(bin, args, opts) ?? { ok: true, out: "ok", err: "" };
    },
    gcloud: (args) => {
      calls.push(["gcloud", args]);
      return overrides.gcloud?.(args) ?? { ok: true, out: "ok", err: "" };
    },
    authorize: overrides.authorize ?? (() => ({ authorized: true, dryRun: false })),
  });
  return { calls, plane };
}

test("service helpers safely read Cloud Run service details", () => {
  expect(serviceUrl(readyService)).toBe("https://gateway.example");
  expect(serviceIapEnabled({ metadata: { annotations: { "run.googleapis.com/iap-enabled": "TRUE" } } })).toBe(true);
  expect(serviceMemory(readyService)).toBe("1Gi");
  expect(serviceEnv(readyService, "GE_AGENT_FACTORY_WORKER_URL")).toBe("https://worker.example");
});

test("terraformVarArgs includes non-empty core vars and image vars", () => {
  expect(terraformVarArgs({
    project: "demo",
    projectNumber: "123",
    agentIdentityOrgId: "",
    geAppId: "app",
    region: "us-central1",
    geLocation: "global",
  }, { gateway_image: "gateway:tag" })).toEqual([
    "-var", "project_id=demo",
    "-var", "project_number=123",
    "-var", "gemini_enterprise_app_id=app",
    "-var", "region=us-central1",
    "-var", "gemini_enterprise_location=global",
    "-var", "gateway_image=gateway:tag",
  ]);
});

test("terraformTargetArgs renders stable targeted apply flags", () => {
  expect(terraformTargetArgs(["google_cloud_run_v2_service.gateway", "google_cloud_tasks_queue.factory_stages"])).toEqual([
    "-target", "google_cloud_run_v2_service.gateway",
    "-target", "google_cloud_tasks_queue.factory_stages",
  ]);
});

test("infra writes tfvars and runs terraform apply with image vars", () => {
  const { calls, plane } = makePlane();

  const result = plane.infra({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    region: "us-central1",
    geLocation: "global",
  }, { sub: "apply", gatewayImage: "gateway:tag", workerImage: "worker:tag" });

  expect(result).toEqual({ sub: "apply" });
  expect(calls.find((call) => call[0] === "writeTextFile")[2]).toContain('project_id                 = "demo"');
  expect(calls.filter((call) => call[0] === "run").map((call) => call[2][1])).toEqual(["init", "apply"]);
  expect(calls.at(-1)[2]).toContain("gateway_image=gateway:tag");
  expect(calls.at(-1)[2]).toContain("worker_image=worker:tag");
  expect(calls.at(-1)[2]).toContain("-target");
  expect(calls.at(-1)[2]).toContain("google_cloud_run_v2_service.gateway");
  expect(calls.at(-1)[2]).toContain("google_cloud_tasks_queue.factory_stages");
});

test("partial worker image bind preserves the live gateway image", () => {
  const { calls, plane } = makePlane({
    gcloud: (args) => args.includes("describe") && args.includes("gateway")
      ? {
          ok: true,
          out: JSON.stringify({ spec: { template: { spec: { containers: [{ image: "gateway:current" }] } } } }),
          err: "",
        }
      : { ok: false, out: "", err: "not found" },
  });

  plane.infra({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    region: "us-central1",
    geLocation: "global",
    gatewayService: "gateway",
    workerService: "worker",
  }, { sub: "apply", workerImage: "worker:new" });

  const apply = calls.find((call) => call[0] === "run" && call[2][1] === "apply");
  expect(apply[2]).toContain("gateway_image=gateway:current");
  expect(apply[2]).toContain("worker_image=worker:new");
});

test("partial factory image bind fails closed when the peer image is not live", () => {
  const { plane } = makePlane({
    gcloud: () => ({ ok: false, out: "", err: "not found" }),
  });

  expect(() => plane.infra({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    region: "us-central1",
    geLocation: "global",
    gatewayService: "gateway",
    workerService: "worker",
  }, { sub: "apply", workerImage: "worker:new" })).toThrow("Pass both --gatewayImage and --workerImage");
});

test("mixed factory and console image bind targets their union instead of a full apply", () => {
  const { calls, plane } = makePlane();

  plane.infra({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    region: "us-central1",
    geLocation: "global",
  }, {
    sub: "apply",
    gatewayImage: "gateway:new",
    workerImage: "worker:new",
    consoleImage: "console:new",
  });

  const apply = calls.find((call) => call[0] === "run" && call[2][1] === "apply");
  expect(apply[2]).toContain("google_cloud_run_v2_service.gateway");
  expect(apply[2]).toContain("google_cloud_run_v2_service.worker");
  expect(apply[2]).toContain("google_cloud_run_v2_service.console");
});

test("build returns gateway and worker image tags", () => {
  const { calls, plane } = makePlane();

  const result = plane.build({
    project: "demo",
    region: "us-central1",
    gatewayService: "gateway",
    workerService: "worker",
  });

  expect(result).toEqual({
    gatewayImage: "us-docker.pkg.dev/demo/ge-agent-factory/gateway:abc123",
    workerImage: "us-docker.pkg.dev/demo/ge-agent-factory/worker:abc123",
  });
  const builds = calls.filter((call) => call[0] === "run" && call[2][0] === "builds");
  expect(builds).toHaveLength(2);

  const gatewayBuild = builds.find((call) => call[2].includes("apps/factory/cloudbuild.gateway.yaml"));
  expect(gatewayBuild).toBeDefined();
  expect(gatewayBuild[2]).toContain("--config");
  expect(gatewayBuild[2]).toContain("--substitutions");
  expect(gatewayBuild[2]).toContain("_IMAGE=us-docker.pkg.dev/demo/ge-agent-factory/gateway:abc123");
  expect(gatewayBuild[2]).toContain("/repo");
  expect(gatewayBuild[2]).not.toContain("--tag");

  // The worker now builds from the repo-root context via its cloudbuild config + the
  // _IMAGE substitution (mirrors mcp-plane), so @ge/run-ledger + @ge/okf (packages/)
  // and tools/lib/* — all outside the app dir — are in the build context.
  const workerBuild = builds.find((call) => call[2].includes("apps/factory/cloudbuild.worker.yaml"));
  expect(workerBuild).toBeDefined();
  expect(workerBuild[2]).toContain("--config");
  expect(workerBuild[2]).toContain("--substitutions");
  expect(workerBuild[2]).toContain("_IMAGE=us-docker.pkg.dev/demo/ge-agent-factory/worker:abc123");
  // positional source = repo root (build context is the whole repo), and NOT --tag.
  expect(workerBuild[2]).toContain("/repo");
  expect(workerBuild[2]).not.toContain("--tag");
});

test("build console target submits the console cloudbuild config with discrete substitutions", () => {
  const { calls, plane } = makePlane();

  const result = plane.build({
    project: "demo",
    region: "us-central1",
  }, { target: "console" });

  expect(result).toEqual({
    consoleImage: `us-docker.pkg.dev/demo/ge-agent-factory/${CONSOLE_SERVICE}:abc123`,
  });
  const builds = calls.filter((call) => call[0] === "run" && call[2][0] === "builds");
  expect(builds).toHaveLength(1);
  const [, , argv] = builds[0];
  expect(argv).toContain("/repo"); // positional source = repo root, same reason as the worker build
  expect(argv).toContain("--config");
  expect(argv).toContain("apps/console/cloudbuild.yaml");
  expect(argv).not.toContain("--tag");
  const subsIdx = argv.indexOf("--substitutions");
  expect(subsIdx).toBeGreaterThan(-1);
  expect(argv[subsIdx + 1]).toBe(`_REGION=us-central1,_AR_REPO=ge-agent-factory,_SERVICE_NAME=${CONSOLE_SERVICE},_TAG=abc123`);
});

test("build console target honors an explicit tag override", () => {
  const { plane } = makePlane();
  const result = plane.build({ project: "demo", region: "us-central1" }, { target: "console", tag: "v2" });
  expect(result.consoleImage).toBe(`us-docker.pkg.dev/demo/ge-agent-factory/${CONSOLE_SERVICE}:v2`);
});

test("infra plumbs console_image through terraform apply the same way as gateway/worker", () => {
  const { calls, plane } = makePlane();

  plane.infra({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    region: "us-central1",
    geLocation: "global",
  }, { sub: "apply", consoleImage: "console:tag" });

  expect(calls.at(-1)[2]).toContain("console_image=console:tag");
  expect(calls.at(-1)[2]).toContain("google_cloud_run_v2_service.console");
  expect(calls.at(-1)[2]).not.toContain("google_cloud_tasks_queue.factory_stages");
});

test("console image bind preserves current gateway and worker images while targeting only console", () => {
  const { calls, plane } = makePlane({
    gcloud: (args) => {
      const service = args[3];
      if (args.includes("describe")) {
        return {
          ok: true,
          out: JSON.stringify({
            spec: {
              template: {
                spec: {
                  containers: [{ image: service === "gateway" ? "gateway:current" : "worker:current" }],
                },
              },
            },
          }),
          err: "",
        };
      }
      return { ok: true, out: "", err: "" };
    },
  });

  plane.infra({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    region: "us-central1",
    geLocation: "global",
    gatewayService: "gateway",
    workerService: "worker",
  }, { sub: "apply", consoleImage: "console:tag" });

  const apply = calls.find((call) => call[0] === "run" && call[2][1] === "apply");
  expect(apply[2]).toContain("console_image=console:tag");
  expect(apply[2]).toContain("gateway_image=gateway:current");
  expect(apply[2]).toContain("worker_image=worker:current");
  expect(apply[2]).toContain("google_cloud_run_v2_service.console");
  expect(apply[2]).not.toContain("google_cloud_run_v2_service.gateway");
  expect(apply[2]).not.toContain("google_cloud_run_v2_service.worker");
});

test("consoleDoctor never throws and reports fail/warn/pass checks without a project", () => {
  const { plane } = makePlane();
  const report = plane.consoleDoctor({});
  expect(report.ok).toBe(false);
  expect(report.fails).toBeGreaterThan(0);
  expect(report.checks.find((check) => check.name === "project configured").status).toBe("fail");
  // No project → console service lookup is skipped, not attempted with an empty project.
  expect(report.checks.find((check) => check.name === "console service").status).toBe("warn");
});

test("consoleDoctor reports a healthy console service", () => {
  const { plane } = makePlane({
    terraformDir: join(HERE, "..", "..", "..", "installer", "terraform"),
    tfOutputs: () => ({ artifact_repository: "us-docker.pkg.dev/demo/ge-agent-factory", console_url: "https://console.example" }),
    gcloud: (args) => {
      const joined = args.join(" ");
      if (joined.includes("run services describe")) {
        return {
          ok: true,
          out: JSON.stringify({
            metadata: { annotations: { "run.googleapis.com/iap-enabled": "false" } },
            status: { conditions: [{ type: "Ready", status: "True" }] },
            spec: { template: { spec: { containers: [{ env: [{ name: "GE_GATEWAY_TRANSPORT", value: "direct" }] }] } } },
          }),
        };
      }
      return { ok: true, out: "" };
    },
  });

  const report = plane.consoleDoctor({ project: "demo", region: "us-central1", gatewayUrl: "https://gateway.example" });
  expect(report.ok).toBe(true);
  expect(report.checks.find((check) => check.name === "console ready").status).toBe("pass");
  expect(report.checks.find((check) => check.name === "console mutation mode").status).toBe("pass");
  expect(report.checks.find((check) => check.name === "console_image bound").status).toBe("pass");
});

test("worker cloudbuild.worker.yaml is well-formed and uses repo-root context", () => {
  const yamlPath = join(HERE, "..", "..", "..", "apps", "factory", "cloudbuild.worker.yaml");
  const yaml = readFileSync(yamlPath, "utf8");
  expect(yaml).toContain("steps:");
  expect(yaml).toContain("gcr.io/cloud-builders/docker");
  expect(yaml).toContain('"build", "-f", "apps/factory/Dockerfile", "-t", "${_IMAGE}", "."');
  expect(yaml).toContain('"push", "${_IMAGE}"');
  expect(yaml).toContain("images:");
  expect(yaml).toContain("substitutions:");
  expect(yaml).toContain("_IMAGE:");
});

test("gateway cloudbuild.gateway.yaml is well-formed and uses the factory gateway image", () => {
  const yamlPath = join(HERE, "..", "..", "..", "apps", "factory", "cloudbuild.gateway.yaml");
  const yaml = readFileSync(yamlPath, "utf8");
  expect(yaml).toContain("steps:");
  expect(yaml).toContain("gcr.io/cloud-builders/docker");
  expect(yaml).toContain("apps/factory/gateway.Dockerfile");
  expect(yaml).toContain("'${_IMAGE}'");
  expect(yaml).toContain("images:");
  expect(yaml).toContain("substitutions:");
  expect(yaml).toContain("_IMAGE:");
});

test("root Cloud Build context includes console image inputs without local build output", () => {
  const ignorePath = join(HERE, "..", "..", "..", ".gcloudignore");
  const ignore = readFileSync(ignorePath, "utf8");
  expect(ignore).toContain("!apps/console/**");
  expect(ignore).toContain("apps/console/node_modules/");
  expect(ignore).toContain("apps/console/dist/");
});

test("workspace Dockerfiles copy every app package manifest before frozen bun install", () => {
  const repoRoot = join(HERE, "..", "..", "..");
  const appManifests = readdirSync(join(repoRoot, "apps"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `apps/${entry.name}/package.json`)
    .sort();
  const dockerfiles = [
    "apps/console/Dockerfile",
    "apps/factory/Dockerfile",
    "apps/factory/gateway.Dockerfile",
    "apps/presentation/Dockerfile",
  ];

  for (const dockerfile of dockerfiles) {
    const text = readFileSync(join(repoRoot, dockerfile), "utf8");
    expect(text).toContain("COPY package.json bun.lock");
    expect(text).toContain("bun install --frozen-lockfile");
    for (const manifest of appManifests) {
      expect(text).toContain(manifest);
    }
  }
});

test("factory runtime Dockerfiles generate the use-case catalog artifact in-image", () => {
  const repoRoot = join(HERE, "..", "..", "..");
  for (const dockerfile of ["apps/factory/Dockerfile", "apps/factory/gateway.Dockerfile"]) {
    const text = readFileSync(join(repoRoot, dockerfile), "utf8");
    expect(text).not.toContain("COPY apps/factory/generated");
    expect(text).toContain("COPY apps/presentation/src/components/slides/use-cases");
    expect(text).toContain("bun scripts/sync-use-cases-from-slides.mjs");
  }
});

test("worker Dockerfile avoids native SQLite compilation during image builds", () => {
  const repoRoot = join(HERE, "..", "..", "..");
  const text = readFileSync(join(repoRoot, "apps/factory/Dockerfile"), "utf8");
  expect(text).toContain("bun install --frozen-lockfile --production --ignore-scripts");
  expect(text).toContain("openRunLedger falls back when no native driver is present");
});

test("gateway Dockerfile copies only existing Cloud Build stage configs", () => {
  const repoRoot = join(HERE, "..", "..", "..");
  const text = readFileSync(join(repoRoot, "apps/factory/gateway.Dockerfile"), "utf8");
  expect(text).toContain("cloudbuild.factory-stage.yaml");
  expect(text).not.toContain("cloudbuild.factory-stage.full.yaml");
});

test("factory release stage Cloud Build delegates to the shared builder script", () => {
  const repoRoot = join(HERE, "..", "..", "..");
  const yaml = readFileSync(join(repoRoot, "apps/factory/cloudbuild.factory-stage.yaml"), "utf8");
  const dockerfile = readFileSync(join(repoRoot, "apps/factory/builder.Dockerfile"), "utf8");
  const gcloudignore = readFileSync(join(repoRoot, "apps/factory/.gcloudignore"), "utf8");
  const script = readFileSync(join(repoRoot, "apps/factory/cloudbuild/run-factory-stage.sh"), "utf8");

  expect(() => parseYaml(yaml)).not.toThrow();
  expect(yaml.length).toBeLessThan(10000);
  expect(yaml).toContain('rm -f "artifacts/factory-${_STAGE}-result.json"');
  expect(yaml).toContain("ge-factory-run-stage > >(tee artifacts/run-stage.log) 2> >(tee -a artifacts/run-stage.log >&2) || STAGE_EXIT=$$?");
  expect(yaml).toContain('gcloud storage rsync "$dir" "${_ARTIFACT_PREFIX}/files/./$dir" --recursive --checksums-only');
  expect(yaml).toContain("PROJECT_ID=${PROJECT_ID}");
  expect(yaml).toContain("GOOGLE_CLOUD_PROJECT=${PROJECT_ID}");
  expect(yaml).toContain("$$STAGE_EXIT");
  expect(yaml).not.toMatch(/(?<!\$)\$STAGE_EXIT/);
  expect(yaml).not.toMatch(/(?<!\$)\$\{code\}/);
  expect(yaml).toContain(".ge-stage-exit");
  expect(yaml).toContain("fail-stage-if-needed");
  expect(yaml).toContain("_BUILDER_IMAGE");
  expect(yaml).not.toContain("agents-cli eval generate");
  expect(dockerfile).toContain("COPY cloudbuild/run-factory-stage.sh /usr/local/bin/ge-factory-run-stage");
  expect(dockerfile).toContain("COPY cloudbuild/run-deployed-smoke.mjs /opt/ge/run-deployed-smoke.mjs");
  expect(gcloudignore).toContain("!cloudbuild/run-factory-stage.sh");
  expect(gcloudignore).toContain("!cloudbuild/run-deployed-smoke.mjs");
  expect(dockerfile).toContain("nodejs npm unzip");
  expect(dockerfile).toContain("https://bun.sh/install");
  expect(dockerfile).toContain("uv sync --extra eval --extra lint --no-install-project");
  expect(script).toContain("set -euo pipefail");
  expect(script).toContain("write_failure_result");
  expect(script).toContain("bun /opt/ge/run-deployed-smoke.mjs");
  expect(script).toContain('write_failure_result "poll_runtime" "$SMOKE_EXIT"');
  expect(script).toContain("trap cleanup_transient_stage_state EXIT");
  expect(script).toContain("rm -rf artifacts/eval_case_workspaces .google-agents-cli");
  expect(yaml).toContain("--exclude artifacts/eval_case_workspaces");
  expect(yaml).toContain("--exclude='^eval_case_workspaces(/|$)'");
  expect(script).not.toContain("set -ceu");
  expect(existsSync(join(repoRoot, "apps/factory/cloudbuild/run-factory-stage.sh"))).toBe(true);
  const builderCopySources = [...dockerfile.matchAll(/^COPY\s+(\S+)\s+/gm)].map((match) => match[1]);
  for (const source of builderCopySources) {
    expect(gcloudignore).toContain(`!${source}`);
  }
});

test("factory Terraform exposes warm worker pool and queue fanout knobs", () => {
  const repoRoot = join(HERE, "..", "..", "..");
  const variables = readFileSync(join(repoRoot, "installer/terraform/variables.tf"), "utf8");
  const cloudRun = readFileSync(join(repoRoot, "installer/terraform/cloud_run.tf"), "utf8");
  const tasks = readFileSync(join(repoRoot, "installer/terraform/tasks.tf"), "utf8");

  expect(variables).toContain('variable "factory_worker_min_instances"');
  expect(variables).toContain("default     = 1");
  expect(variables).toContain('variable "factory_worker_max_instances"');
  expect(variables).toContain("default     = 50");
  expect(variables).toContain('variable "factory_tasks_max_concurrent_dispatches"');
  expect(cloudRun).toContain("min_instance_count = var.factory_worker_min_instances");
  expect(cloudRun).toContain("max_instance_count = var.factory_worker_max_instances");
  expect(cloudRun).toContain("min_instance_count = var.factory_gateway_min_instances");
  expect(cloudRun).toContain('name  = "GEMINI_ENTERPRISE_APP_ID"');
  expect(cloudRun).toContain('name  = "GEMINI_ENTERPRISE_LOCATION"');
  expect(cloudRun).toContain('name  = "GE_ENABLE_AGENT_PROVISION"');
  expect(tasks).toContain("max_dispatches_per_second = var.factory_tasks_max_dispatches_per_second");
  expect(tasks).toContain("max_concurrent_dispatches = var.factory_tasks_max_concurrent_dispatches");
});

test("factory image binds include the complete MCP registration IAM plane", () => {
  const terraform = readFileSync(join(HERE, "..", "..", "..", "installer", "terraform", "mcp.tf"), "utf8");
  expect(terraform).toContain('role_id     = "geAgentFactoryMcpIapPolicyBinder"');
  expect(terraform).toContain('"iap.webServices.getIamPolicy"');
  expect(terraform).toContain('"iap.webServices.setIamPolicy"');
  expect(terraform).not.toContain('role     = "roles/iap.admin"');
  for (const target of [
    "google_project_iam_member.mcp_tool_user",
    "google_project_iam_member.agentregistry_editor",
    "google_project_iam_member.agentregistry_viewer",
    "google_project_iam_custom_role.mcp_iap_policy_binder",
    "google_project_iam_member.mcp_iap_policy_binder",
  ]) {
    expect(FACTORY_IMAGE_BIND_TARGETS).toContain(target);
  }
});

test("workspace Dockerfile COPY sources exist in the repository", () => {
  const repoRoot = join(HERE, "..", "..", "..");
  const dockerfiles = [
    "apps/console/Dockerfile",
    "apps/factory/Dockerfile",
    "apps/factory/gateway.Dockerfile",
    "apps/presentation/Dockerfile",
  ];

  for (const dockerfile of dockerfiles) {
    const text = readFileSync(join(repoRoot, dockerfile), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("COPY ") || trimmed.includes("--from=")) continue;
      const parts = trimmed.split(/\s+/).slice(1);
      const sources = parts.slice(0, -1);
      for (const source of sources) {
        expect(existsSync(join(repoRoot, source))).toBe(true);
      }
    }
  }
});

test("deploy builds images then applies terraform image binding", () => {
  const { calls, plane } = makePlane();

  const result = plane.deploy({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    geLocation: "global",
    region: "us-central1",
    gatewayService: "gateway",
    workerService: "worker",
  }, { target: "gateway" });

  expect(result.deployed).toEqual(["gateway"]);
  const apply = calls.find((call) => call[0] === "run" && call[2][1] === "apply");
  expect(apply).toBeDefined();
  for (const target of FACTORY_IMAGE_BIND_TARGETS) expect(apply[2]).toContain(target);
  expect(apply[2]).not.toContain("google_cloud_run_v2_service.console");
});

test("deploy refuses Terraform image binding when Cloud Run exists outside Terraform state", () => {
  const { calls, plane } = makePlane({
    run: (bin, args) => {
      if (bin === "terraform" && args.includes("state")) {
        return { ok: true, out: "google_project_service.enabled[\"run.googleapis.com\"]", err: "" };
      }
      return { ok: true, out: "ok", err: "" };
    },
    gcloud: (args) => {
      if (args.includes("describe")) return { ok: true, out: JSON.stringify(readyService), err: "" };
      return { ok: true, out: "ok", err: "" };
    },
  });

  expect(() => plane.deploy({
    mode: "remote",
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    geLocation: "global",
    region: "us-central1",
    gatewayService: "gateway",
    workerService: "worker",
  })).toThrow(/refusing Terraform image bind/);
  expect(calls.some((call) => call[0] === "run" && call[2]?.[0] === "builds")).toBe(false);
});

test("deploy allows Terraform image binding when Cloud Run resources are in state", () => {
  const { calls, plane } = makePlane({
    run: (bin, args) => {
      if (bin === "terraform" && args.includes("state")) {
        return {
          ok: true,
          out: [
            "google_cloud_run_v2_service.gateway",
            "google_cloud_run_v2_service.worker",
          ].join("\n"),
          err: "",
        };
      }
      return { ok: true, out: "ok", err: "" };
    },
    gcloud: (args) => {
      if (args.includes("describe")) return { ok: true, out: JSON.stringify(readyService), err: "" };
      return { ok: true, out: "ok", err: "" };
    },
  });

  const result = plane.deploy({
    mode: "remote",
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    geLocation: "global",
    region: "us-central1",
    gatewayService: "gateway",
    workerService: "worker",
  });

  expect(result.deployed).toEqual(["gateway", "worker"]);
  expect(calls.some((call) => call[0] === "run" && call[2]?.includes("apps/factory/cloudbuild.gateway.yaml"))).toBe(true);
});

test("deploy accepts an explicit image tag for gateway and worker", () => {
  const { calls, plane } = makePlane();

  const result = plane.deploy({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    geLocation: "global",
    region: "us-central1",
    gatewayService: "gateway",
    workerService: "worker",
  }, { tag: "canary-fix" });

  expect(result.gatewayImage).toContain(":canary-fix");
  expect(result.workerImage).toContain(":canary-fix");
  const apply = calls.find((call) => call[0] === "run" && call[2][1] === "apply");
  expect(apply[2]).toContain("gateway_image=us-docker.pkg.dev/demo/ge-agent-factory/gateway:canary-fix");
  expect(apply[2]).toContain("worker_image=us-docker.pkg.dev/demo/ge-agent-factory/worker:canary-fix");
});

test("doctor reports service readiness, worker URL, invoker, and queue", () => {
  const { plane } = makePlane({
    gcloud: (args) => {
      const joined = args.join(" ");
      if (joined.includes("run services describe")) return { ok: true, out: JSON.stringify(readyService) };
      if (joined.includes("run services get-iam-policy")) {
        return { ok: true, out: JSON.stringify({ bindings: [{ role: "roles/run.invoker", members: ["serviceAccount:runner@demo.iam.gserviceaccount.com"] }] }) };
      }
      if (joined.includes("projects get-iam-policy")) {
        return {
          ok: true,
          out: JSON.stringify({
            bindings: [
              { role: "roles/aiplatform.user", members: ["serviceAccount:ge-agent-factory-builder@demo.iam.gserviceaccount.com"] },
              { role: "roles/discoveryengine.editor", members: ["serviceAccount:ge-agent-factory-builder@demo.iam.gserviceaccount.com"] },
              { role: "roles/serviceusage.serviceUsageConsumer", members: ["serviceAccount:ge-agent-factory-builder@demo.iam.gserviceaccount.com"] },
            ],
          }),
        };
      }
      if (joined.includes("tasks queues describe")) return { ok: true, out: "RUNNING" };
      return { ok: true, out: "account@example.com" };
    },
  });

  const report = plane.doctor({
    project: "demo",
    region: "us-central1",
    gatewayService: "gateway",
    workerService: "worker",
    serviceAccount: "runner@demo.iam.gserviceaccount.com",
    tasksQueue: "queue",
    geLocation: "global",
  });

  expect(report.fails).toBe(0);
  expect(report.checks.find((check) => check.name === "worker GE_AGENT_FACTORY_BUILDER_IMAGE").status).toBe("pass");
  expect(report.checks.find((check) => check.name === "worker GOOGLE_GENAI_LOCATION").status).toBe("pass");
  expect(report.checks.find((check) => check.name === "builder SA release-stage roles").status).toBe("pass");
});
