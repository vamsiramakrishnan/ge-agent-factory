import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { agentPrincipal, createMcpPlane, hasIamRole, mcpImageTag, mcpServiceName } from "./mcp-plane.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

const readyService = {
  status: {
    url: "https://mcp.example",
    conditions: [{ type: "Ready", status: "True" }],
  },
};

function makePlane(overrides = {}) {
  let stored = { project: "demo" };
  const commands = [];
  const plane = createMcpPlane({
    departments: ["hr"],
    serviceDir: "/repo/apps/ge-demo-generator/mcp-service",
    repoRoot: "/repo",
    ensureGcloud: () => commands.push(["ensureGcloud"]),
    describeRun: (_cfg, service) => Object.hasOwn(overrides, "describeRun") ? overrides.describeRun(service) : readyService,
    serviceUrl: (service) => service?.status?.url || null,
    readConfig: () => stored,
    writeConfig: (next) => { stored = next; },
    gcloud: (args, opts) => {
      commands.push([args, opts]);
      return overrides.gcloud?.(args, opts) ?? { ok: true, out: "ok" };
    },
  });
  return { plane, commands, stored: () => stored };
}

test("mcpServiceName and agentPrincipal produce stable identities", () => {
  expect(mcpServiceName("finance")).toBe("ge-agent-factory-mcp-finance");
  expect(agentPrincipal({ agentIdentityPrincipalSet: "principalSet://agents" })).toBe("principalSet://agents");
  expect(agentPrincipal({ serviceAccount: "runner@example.iam.gserviceaccount.com" })).toBe("serviceAccount:runner@example.iam.gserviceaccount.com");
});

test("hasIamRole matches exact role and member", () => {
  const bindings = [{ role: "roles/run.invoker", members: ["serviceAccount:a@example.com"] }];
  expect(hasIamRole(bindings, "roles/run.invoker", "serviceAccount:a@example.com")).toBe(true);
  expect(hasIamRole(bindings, "roles/run.invoker", "serviceAccount:b@example.com")).toBe(false);
});

test("mcpImageTag matches the Artifact Registry convention", () => {
  expect(mcpImageTag({ project: "demo", region: "us-central1" }, "ge-agent-factory-mcp-hr"))
    .toBe("us-central1-docker.pkg.dev/demo/ge-agent-factory/ge-agent-factory-mcp-hr:latest");
  expect(mcpImageTag({ project: "demo", region: "us-central1" }, "ge-agent-factory-mcp-hr", "20260620"))
    .toBe("us-central1-docker.pkg.dev/demo/ge-agent-factory/ge-agent-factory-mcp-hr:20260620");
});

test("mcpDeploy builds via Cloud Build with the repo root context, then deploys by image", () => {
  const { plane, commands, stored } = makePlane();
  const result = plane.mcpDeploy({
    project: "demo",
    region: "us-central1",
    serviceAccount: "runner@demo.iam.gserviceaccount.com",
    dataBucket: "demo-data",
    agentIdentityPrincipalSet: "principalSet://agents",
  }, { depts: ["hr"], memory: "2Gi", cpu: "2" });

  expect(result.services).toEqual({ hr: "https://mcp.example" });
  expect(stored().mcpServices).toEqual({ hr: "https://mcp.example" });

  const image = "us-central1-docker.pkg.dev/demo/ge-agent-factory/ge-agent-factory-mcp-hr:latest";

  // (a) `builds submit` runs with the repo root as the source context + the cloudbuild
  //     config + the _IMAGE substitution.
  const build = commands.find((entry) => Array.isArray(entry[0]) && entry[0][0] === "builds" && entry[0][1] === "submit");
  expect(build).toBeDefined();
  expect(build[0]).toContain("--config");
  expect(build[0]).toContain("apps/ge-demo-generator/mcp-service/cloudbuild.yaml");
  expect(build[0]).toContain("--substitutions");
  expect(build[0]).toContain(`_IMAGE=${image}`);
  // positional source = repo root → build context is the whole repo.
  expect(build[0][build[0].length - 1]).toBe("/repo");
  // global Cloud Build: no --region on the build step.
  expect(build[0]).not.toContain("--region");

  // (b) `run deploy` uses --image <tag>, NOT --source.
  const deploy = commands.find((entry) => Array.isArray(entry[0]) && entry[0][0] === "run" && entry[0][1] === "deploy");
  expect(deploy).toBeDefined();
  expect(deploy[0]).toContain("--image");
  expect(deploy[0]).toContain(image);
  expect(deploy[0]).not.toContain("--source");

  // (c) service-account, env vars, sizing, and invoker grants are unchanged.
  expect(deploy[0]).toContain("--service-account");
  expect(deploy[0]).toContain("runner@demo.iam.gserviceaccount.com");
  expect(deploy[0]).toContain("--memory");
  expect(deploy[0]).toContain("2Gi");
  expect(deploy[0]).toContain("--cpu");
  expect(deploy[0]).toContain("2");
  expect(deploy[0]).toContain("--update-env-vars");
  const envVars = deploy[0][deploy[0].indexOf("--update-env-vars") + 1];
  expect(envVars).toContain("GE_DATA_BACKEND=mcp");
  expect(envVars).toContain("GE_AGENT_DATA_BUCKET=demo-data");
  expect(commands.filter((entry) => Array.isArray(entry[0]) && entry[0].includes("add-iam-policy-binding")).length).toBe(2);
});

test("mcpDeploy honors a custom imageTag", () => {
  const { plane, commands } = makePlane();
  plane.mcpDeploy({ project: "demo", region: "us-central1", serviceAccount: "runner@demo.iam.gserviceaccount.com" },
    { depts: ["hr"], imageTag: "20260620" });
  const image = "us-central1-docker.pkg.dev/demo/ge-agent-factory/ge-agent-factory-mcp-hr:20260620";
  const build = commands.find((entry) => Array.isArray(entry[0]) && entry[0][0] === "builds");
  const deploy = commands.find((entry) => Array.isArray(entry[0]) && entry[0][0] === "run" && entry[0][1] === "deploy");
  expect(build[0]).toContain(`_IMAGE=${image}`);
  expect(deploy[0]).toContain(image);
});

test("createMcpPlane requires repoRoot", () => {
  expect(() => createMcpPlane({
    departments: ["hr"],
    serviceDir: "/repo/apps/ge-demo-generator/mcp-service",
    ensureGcloud: () => {},
    describeRun: () => null,
    serviceUrl: () => null,
    readConfig: () => ({}),
    writeConfig: () => {},
    gcloud: () => ({ ok: true }),
  })).toThrow(/repoRoot/);
});

test("mcp-service cloudbuild.yaml is well-formed and uses repo-root context", () => {
  const yamlPath = join(HERE, "..", "..", "apps", "ge-demo-generator", "mcp-service", "cloudbuild.yaml");
  const yaml = readFileSync(yamlPath, "utf8");
  // sanity-check the structural keys + the load-bearing build args without a YAML dep.
  expect(yaml).toContain("steps:");
  expect(yaml).toContain("gcr.io/cloud-builders/docker");
  expect(yaml).toContain('"build", "-f", "apps/ge-demo-generator/mcp-service/Dockerfile", "-t", "${_IMAGE}", "."');
  expect(yaml).toContain('"push", "${_IMAGE}"');
  expect(yaml).toContain("images:");
  expect(yaml).toContain("${_IMAGE}");
  expect(yaml).toContain("substitutions:");
  expect(yaml).toContain("_IMAGE:");
});

test("mcpDeploy preserves unrelated config and existing service URLs", () => {
  let stored = { project: "demo", gatewayUrl: "https://gateway", mcpServices: { finance: "https://finance.example" } };
  const plane = createMcpPlane({
    departments: ["hr", "finance"],
    serviceDir: "/repo/apps/ge-demo-generator/mcp-service",
    repoRoot: "/repo",
    ensureGcloud: () => {},
    describeRun: () => readyService,
    serviceUrl: (service) => service?.status?.url || null,
    readConfig: () => stored,
    writeConfig: (next) => { stored = next; },
    gcloud: () => ({ ok: true, out: "ok" }),
  });

  plane.mcpDeploy({ project: "demo", region: "us-central1", mcpServices: stored.mcpServices }, { depts: ["hr"] });

  expect(stored).toEqual({
    project: "demo",
    gatewayUrl: "https://gateway",
    mcpServices: {
      finance: "https://finance.example",
      hr: "https://mcp.example",
    },
  });
});

test("mcpDoctor reports deployed service readiness and IAM role checks", () => {
  const principal = "principalSet://agents";
  const { plane } = makePlane({
    gcloud: (args) => {
      const joined = args.join(" ");
      if (joined.includes("run services get-iam-policy")) {
        return { ok: true, out: JSON.stringify({ bindings: [{ role: "roles/run.invoker", members: [principal] }] }) };
      }
      if (joined.includes("projects get-iam-policy")) {
        return {
          ok: true,
          out: JSON.stringify({
            bindings: [
              { role: "roles/agentregistry.viewer", members: [principal] },
              { role: "roles/mcp.toolUser", members: [principal] },
            ],
          }),
        };
      }
      return { ok: true, out: "ok" };
    },
  });

  const report = plane.mcpDoctor({ project: "demo", region: "us-central1", agentIdentityPrincipalSet: principal });

  expect(report.fails).toBe(0);
  expect(report.checks.map((check) => check.status)).toEqual(["pass", "pass", "pass", "pass", "pass", "pass"]);
});

test("mcpDoctor warns when services are missing and agent identity is not configured", () => {
  const { plane } = makePlane({
    describeRun: () => null,
    gcloud: (args) => args[0] === "projects"
      ? { ok: true, out: JSON.stringify({ bindings: [] }) }
      : { ok: false, out: "", err: "missing" },
  });

  const report = plane.mcpDoctor({ project: "demo", region: "us-central1" });

  expect(report.fails).toBe(0);
  expect(report.checks.find((check) => check.name === "mcp hr")).toMatchObject({ status: "warn" });
  expect(report.checks.find((check) => check.name === "agent identity agentregistry.viewer").detail).toMatch(/agentIdentityOrgId/);
});
