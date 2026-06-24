import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createFactoryPlane, serviceEnv, serviceIapEnabled, serviceMemory, serviceUrl, terraformVarArgs } from "./factory-plane.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

const readyService = {
  metadata: { annotations: { "run.googleapis.com/iap-enabled": "false" } },
  status: { url: "https://gateway.example", conditions: [{ type: "Ready", status: "True" }] },
  spec: {
    template: {
      spec: {
        containers: [{
          resources: { limits: { memory: "1Gi" } },
          env: [{ name: "GE_AGENT_FACTORY_WORKER_URL", value: "https://worker.example" }],
        }],
      },
    },
  },
};

function makePlane(overrides = {}) {
  const calls = [];
  const plane = createFactoryPlane({
    repoRoot: "/repo",
    terraformDir: "/repo/installer/terraform",
    ensureGcloud: () => calls.push(["ensureGcloud"]),
    ensureTerraform: () => calls.push(["ensureTerraform"]),
    ensureAgentIdentityConfig: (cfg) => { cfg.agentIdentityOrgId ||= "456"; },
    persistAgentIdentityConfig: () => calls.push(["persistAgentIdentityConfig"]),
    tfOutputs: () => overrides.tfOutputs?.() ?? { artifact_repository: "us-docker.pkg.dev/demo/ge-agent-factory" },
    gitShortSha: () => "abc123",
    writeTextFile: (path, content) => calls.push(["writeTextFile", path, content]),
    run: (bin, args, opts) => {
      calls.push(["run", bin, args, opts]);
      return { ok: true, out: "ok", err: "" };
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

test("infra writes tfvars and runs terraform apply with image vars", () => {
  const { calls, plane } = makePlane();

  const result = plane.infra({
    project: "demo",
    projectNumber: "123",
    geAppId: "app",
    region: "us-central1",
    geLocation: "global",
  }, { sub: "apply", gatewayImage: "gateway:tag" });

  expect(result).toEqual({ sub: "apply" });
  expect(calls.find((call) => call[0] === "writeTextFile")[2]).toContain('project_id                 = "demo"');
  expect(calls.filter((call) => call[0] === "run").map((call) => call[2][1])).toEqual(["init", "apply"]);
  expect(calls.at(-1)[2]).toContain("gateway_image=gateway:tag");
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

  // The worker now builds from the repo-root context via its cloudbuild config + the
  // _IMAGE substitution (mirrors mcp-plane), so @ge/run-ledger + @ge/okf (packages/)
  // and tools/lib/* — all outside the app dir — are in the build context.
  const workerBuild = builds.find((call) => call[2].includes("apps/ge-demo-generator/cloudbuild.worker.yaml"));
  expect(workerBuild).toBeDefined();
  expect(workerBuild[2]).toContain("--config");
  expect(workerBuild[2]).toContain("--substitutions");
  expect(workerBuild[2]).toContain("_IMAGE=us-docker.pkg.dev/demo/ge-agent-factory/worker:abc123");
  // positional source = repo root (build context is the whole repo), and NOT --tag.
  expect(workerBuild[2]).toContain("/repo");
  expect(workerBuild[2]).not.toContain("--tag");
});

test("worker cloudbuild.worker.yaml is well-formed and uses repo-root context", () => {
  const yamlPath = join(HERE, "..", "..", "apps", "ge-demo-generator", "cloudbuild.worker.yaml");
  const yaml = readFileSync(yamlPath, "utf8");
  expect(yaml).toContain("steps:");
  expect(yaml).toContain("gcr.io/cloud-builders/docker");
  expect(yaml).toContain('"build", "-f", "apps/ge-demo-generator/Dockerfile", "-t", "${_IMAGE}", "."');
  expect(yaml).toContain('"push", "${_IMAGE}"');
  expect(yaml).toContain("images:");
  expect(yaml).toContain("substitutions:");
  expect(yaml).toContain("_IMAGE:");
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
  expect(calls.filter((call) => call[0] === "run" && call[2][1] === "apply")).toHaveLength(1);
});

test("doctor reports service readiness, worker URL, invoker, and queue", () => {
  const { plane } = makePlane({
    gcloud: (args) => {
      const joined = args.join(" ");
      if (joined.includes("run services describe")) return { ok: true, out: JSON.stringify(readyService) };
      if (joined.includes("run services get-iam-policy")) {
        return { ok: true, out: JSON.stringify({ bindings: [{ role: "roles/run.invoker", members: ["serviceAccount:runner@demo.iam.gserviceaccount.com"] }] }) };
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
  });

  expect(report.fails).toBe(0);
  expect(report.checks.map((check) => check.status)).toEqual(["pass", "pass", "pass", "pass", "pass", "pass"]);
});
