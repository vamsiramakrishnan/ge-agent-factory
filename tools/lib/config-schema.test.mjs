import { test, expect } from "bun:test";
import {
  buildFactoryConfig,
  classifyReadinessCheck,
  classifyReadinessSection,
  effectiveConfigFile,
  explainConfig,
  explainFactoryConfig,
  resolveConfigField,
  resolveScalars,
  validateConfigFor,
} from "./config-schema.mjs";

test("precedence: flag beats env beats file beats default", () => {
  const inputs = {
    flags: { region: "flag-region" },
    env: { GCP_REGION: "env-region" },
    file: { region: "file-region" },
  };
  expect(resolveConfigField("region", inputs)).toEqual({ value: "flag-region", source: "flag" });
  expect(resolveConfigField("region", { env: inputs.env, file: inputs.file })).toEqual({ value: "env-region", source: "env:GCP_REGION" });
  expect(resolveConfigField("region", { file: inputs.file })).toEqual({ value: "file-region", source: "file" });
  expect(resolveConfigField("region", {})).toEqual({ value: "us-central1", source: "default" });
});

test("project reads either env alias", () => {
  expect(resolveConfigField("project", { env: { GOOGLE_CLOUD_PROJECT: "p2" } })).toEqual({ value: "p2", source: "env:GOOGLE_CLOUD_PROJECT" });
  expect(resolveConfigField("project", { env: { GCP_PROJECT_ID: "p1", GOOGLE_CLOUD_PROJECT: "p2" } }).value).toBe("p1");
  // GCLOUD_PROJECT is honored as a last-resort fallback (gcp-config.mjs parity),
  // without displacing GCP_PROJECT_ID / GOOGLE_CLOUD_PROJECT precedence.
  expect(resolveConfigField("project", { env: { GCLOUD_PROJECT: "p3" } })).toEqual({ value: "p3", source: "env:GCLOUD_PROJECT" });
  expect(resolveConfigField("project", { env: { GOOGLE_CLOUD_PROJECT: "p2", GCLOUD_PROJECT: "p3" } }).value).toBe("p2");
});

test("geApp flag maps to geAppId field", () => {
  expect(resolveConfigField("geAppId", { flags: { geApp: "app/x" } })).toEqual({ value: "app/x", source: "flag" });
});

test("resolveScalars returns all fields with defaults", () => {
  const s = resolveScalars({});
  expect(s.region).toBe("us-central1");
  expect(s.mode).toBe("local");
  expect(s.geLocation).toBe("global");
  expect(s.agentsRepo).toBe("");
  expect(s.project).toBeUndefined();
});

test("explainConfig reports source per field", () => {
  const r = explainConfig({ flags: { project: "demo" }, env: { GE_MODE: "local" } });
  expect(r.project).toEqual({ value: "demo", source: "flag" });
  expect(r.mode).toEqual({ value: "local", source: "env:GE_MODE" });
  expect(r.region.source).toBe("default");
});

test("validateConfigFor throws on missing required field", () => {
  expect(() => validateConfigFor("agents", {})).toThrow(/project|geAppId/);
  expect(validateConfigFor("agents", { flags: { project: "p", geApp: "a" } })).toBe(true);
});

test("effectiveConfigFile drops cached project-scoped values when project is overridden", () => {
  const rawFile = {
    project: "old-project",
    projectNumber: "111",
    bucket: "old-bucket",
    geAppId: "old-app",
    gatewayUrl: "https://old.example",
    serviceAccount: "runner@old-project.iam.gserviceaccount.com",
    dataBucket: "old-data",
    mcpServices: { hr: "https://old-mcp.example" },
    tasksQueue: "custom-queue",
  };
  const { file, projectOverridden } = effectiveConfigFile(rawFile, { project: "new-project" }, {});
  expect(projectOverridden).toBe(true);
  expect(file.project).toBe("old-project");
  expect(file.projectNumber).toBeUndefined();
  expect(file.bucket).toBeUndefined();
  expect(file.geAppId).toBeUndefined();
  expect(file.gatewayUrl).toBeUndefined();
  expect(file.serviceAccount).toBeUndefined();
  expect(file.dataBucket).toBeUndefined();
  expect(file.mcpServices).toBeUndefined();
  expect(file.tasksQueue).toBe("custom-queue");
});

test("effectiveConfigFile preserves cached project-scoped values when project matches", () => {
  const rawFile = { project: "same-project", projectNumber: "111", bucket: "same-bucket" };
  const { file, projectOverridden } = effectiveConfigFile(rawFile, { project: "same-project" }, {});
  expect(projectOverridden).toBe(false);
  expect(file).toBe(rawFile);
});

test("buildFactoryConfig mirrors derived defaults from factory-core loadConfig", () => {
  const cfg = buildFactoryConfig({
    flags: { project: "demo", geApp: "apps/demo" },
    env: { GOOGLE_CLOUD_PROJECT_NUMBER: "123", GE_AGENT_IDENTITY_ORG_ID: "456" },
    file: {},
  });
  expect(cfg).toMatchObject({
    project: "demo",
    projectNumber: "123",
    region: "us-central1",
    gatewayService: "ge-agent-factory-gateway",
    workerService: "ge-agent-factory-worker",
    bucket: "demo-ge-agent-factory",
    geAppId: "apps/demo",
    geLocation: "global",
    serviceAccount: "ge-agent-factory-runner@demo.iam.gserviceaccount.com",
    tasksQueue: "ge-agent-factory-stages",
    dataBucket: "demo-ge-agent-data",
    alloydbDsnSecret: "ge-agent-alloydb-dsn",
    bigtableInstance: "ge-agent-data",
    bqLocation: "US",
    mode: "local",
    mcpServices: {},
    agentIdentityOrgId: "456",
  });
  expect(cfg.agentIdentityPrincipalSet).toBe("principalSet://agents.global.org-456.system.id.goog/attribute.platformContainer/aiplatform/projects/123");
});

test("buildFactoryConfig avoids stale project-scoped file values after project override", () => {
  const cfg = buildFactoryConfig({
    flags: { project: "new-project" },
    file: {
      project: "old-project",
      projectNumber: "111",
      bucket: "old-bucket",
      geAppId: "old-app",
      gatewayUrl: "https://old.example",
      dataBucket: "old-data",
      mcpServices: { hr: "https://old-mcp.example" },
    },
  });
  expect(cfg.project).toBe("new-project");
  expect(cfg.projectNumber).toBeUndefined();
  expect(cfg.bucket).toBe("new-project-ge-agent-factory");
  expect(cfg.geAppId).toBeUndefined();
  expect(cfg.gatewayUrl).toBeUndefined();
  expect(cfg.dataBucket).toBe("new-project-ge-agent-data");
  expect(cfg.mcpServices).toEqual({});
});

test("buildFactoryConfig tolerates the $schema key `ge init` writes into .ge.json", () => {
  // init() (factory-core.mjs) writes `"$schema": "./.ge.schema.json"` so
  // editors pick up the generated schema. Config resolution reads .ge.json
  // by named keys only, so the extra key must change nothing and not leak.
  const file = { project: "demo", region: "eu-west1" };
  const withSchema = buildFactoryConfig({ file: { $schema: "./.ge.schema.json", ...file } });
  expect(withSchema).toEqual(buildFactoryConfig({ file }));
  expect("$schema" in withSchema).toBe(false);
});

test("effectiveConfigFile keeps $schema on project override (not project-scoped)", () => {
  const { file, projectOverridden } = effectiveConfigFile(
    { $schema: "./.ge.schema.json", project: "old-project", projectNumber: "111" },
    { project: "new-project" },
    {},
  );
  expect(projectOverridden).toBe(true);
  expect(file.$schema).toBe("./.ge.schema.json");
  expect(file.projectNumber).toBeUndefined();
});

test("explainFactoryConfig reports project override guard", () => {
  const report = explainFactoryConfig({
    flags: { project: "new-project" },
    file: { project: "old-project", projectNumber: "111" },
  });
  expect(report.project).toEqual({ value: "new-project", source: "flag" });
  expect(report.projectNumber).toEqual({ value: undefined, source: "unset" });
  expect(report._note).toMatch(/project overridden/);
});

test("classifyReadinessCheck maps known doctor failures to repair categories", () => {
  expect(classifyReadinessCheck("readiness: up", { name: "config geAppId", status: "fail", detail: "<unset>" })).toMatchObject({
    category: "setup-config",
    action: "ge init",
  });
  expect(classifyReadinessCheck("data plane", { name: "agent-data bucket", status: "warn", detail: "missing", fix: "ge data up" })).toMatchObject({
    category: "data-plane",
    action: "ge data up",
  });
  expect(classifyReadinessCheck("tool plane", { name: "mcp hr", status: "warn", detail: "not deployed" })).toMatchObject({
    category: "tool-plane",
    action: "ge mcp deploy",
  });
  expect(classifyReadinessCheck("factory", { name: "gateway", status: "pass", detail: "ok" })).toMatchObject({
    category: "ready",
    action: "none",
  });
});

test("classifyReadinessSection produces section repair plan", () => {
  const section = classifyReadinessSection({
    name: "factory",
    checks: [
      { name: "gateway", status: "pass", detail: "ok" },
      { name: "worker Cloud Run service", status: "fail", detail: "missing" },
    ],
    fails: 1,
  });
  expect(section.checks[0].category).toBe("ready");
  expect(section.repairPlan).toEqual([
    { check: "worker Cloud Run service", category: "factory-plane", command: "ge up --infra", status: "fail" },
  ]);
});

test("env-only knobs resolve env over file, with their documented defaults", () => {
  const fields = [
    ["dataBackend", "GE_DATA_BACKEND", "fixtures"],
    ["consoleReadonly", "GE_CONSOLE_READONLY", "false"],
    ["allowUnpromoted", "GE_ALLOW_UNPROMOTED", "false"],
    ["simulatorOverlayBackend", "GE_SIMULATOR_OVERLAY_BACKEND", "memory"],
  ];
  for (const [field, envName, def] of fields) {
    expect(resolveConfigField(field, {})).toEqual({ value: def, source: "default" });
    expect(resolveConfigField(field, { file: { [field]: "from-file" } })).toEqual({ value: "from-file", source: "file" });
    expect(resolveConfigField(field, {
      env: { [envName]: "from-env" },
      file: { [field]: "from-file" },
    })).toEqual({ value: "from-env", source: `env:${envName}` });
  }
  // harnessPythonPath has no config default — its runtime fallback (python3 /
  // discovered venv) lives in tools/lib/doctor/engine.mjs, not CONFIG_FIELDS.
  expect(resolveConfigField("harnessPythonPath", {})).toEqual({ value: undefined, source: "unset" });
  expect(resolveConfigField("harnessPythonPath", { env: { GE_HARNESS_PYTHON: "/opt/venv/bin/python3" } }))
    .toEqual({ value: "/opt/venv/bin/python3", source: "env:GE_HARNESS_PYTHON" });
});

test("buildFactoryConfig carries simulatorOverlayBackend (mcp-plane's deploy consumer) but not the env-first-only knobs", () => {
  expect(buildFactoryConfig({}).simulatorOverlayBackend).toBe("memory");
  expect(buildFactoryConfig({ env: { GE_SIMULATOR_OVERLAY_BACKEND: "firestore" } }).simulatorOverlayBackend).toBe("firestore");
  // No JS reader consumes cfg.dataBackend / cfg.consoleReadonly / cfg.harnessPythonPath /
  // cfg.allowUnpromoted today (Python and process.env read the env var directly) —
  // buildFactoryConfig deliberately does not carry them, to avoid dead config plumbing.
  const cfg = buildFactoryConfig({});
  expect(cfg.dataBackend).toBeUndefined();
  expect(cfg.consoleReadonly).toBeUndefined();
  expect(cfg.harnessPythonPath).toBeUndefined();
  expect(cfg.allowUnpromoted).toBeUndefined();
});

test("gatewayTransport resolves proxy by default, direct via env/flag/file", () => {
  expect(buildFactoryConfig({}).gatewayTransport).toBe("proxy");
  expect(buildFactoryConfig({ env: { GE_GATEWAY_TRANSPORT: "direct" } }).gatewayTransport).toBe("direct");
  expect(buildFactoryConfig({ flags: { gatewayTransport: "direct" } }).gatewayTransport).toBe("direct");
  expect(buildFactoryConfig({ file: { gatewayTransport: "direct" } }).gatewayTransport).toBe("direct");
});
