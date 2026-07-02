import { access, readdir } from "node:fs/promises";
import { createServer } from "node:net";
import { delimiter, join } from "node:path";
import { spawn } from "node:child_process";
import { detectAgents } from "./agents.js";
import { resolveHarnessPython } from "./harness-python.js";

const REQUIRED_TOOLS = [
  { id: "node", bin: "node", requiredFor: ["local"] },
  { id: "npm", bin: "npm", requiredFor: ["local"] },
  { id: "uv", bin: "uv", requiredFor: ["validate", "preview"] },
  { id: "gcloud", bin: "gcloud", requiredFor: ["deploy", "publish"] },
  { id: "agents-cli", bin: "agents-cli", requiredFor: ["deploy", "publish"] },
  { id: "google-antigravity", bin: "python3", requiredFor: ["harness"] },
  { id: "agy", bin: "agy", requiredFor: ["harness"] },
  { id: "gemini", bin: "gemini", requiredFor: ["harness"] },
  { id: "codex", bin: "codex", requiredFor: ["harness"] },
  { id: "claude", bin: "claude", requiredFor: ["harness"] },
];

async function findOnPath(bin) {
  for (const dir of (process.env.PATH || "").split(delimiter)) {
    if (!dir) continue;
    const candidate = join(dir, bin);
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Keep scanning PATH.
    }
  }
  return null;
}

async function listGeminiExtensionIssues(home = process.env.HOME) {
  if (!home) return [];
  const root = join(home, ".gemini", "extensions");
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []); // best-effort: no ~/.gemini/extensions dir means no extension issues to report
  const issues = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const configPath = join(root, entry.name, "gemini-extension.json");
    try {
      await access(configPath);
    } catch {
      issues.push({
        extension: entry.name,
        code: "GEMINI_EXTENSION_CONFIG_MISSING",
        message: `Gemini extension ${entry.name} is missing gemini-extension.json`,
        path: configPath,
      });
    }
  }
  return issues;
}

async function hasLibsecret() {
  const candidates = [
    "/usr/lib/x86_64-linux-gnu/libsecret-1.so.0",
    "/usr/lib/aarch64-linux-gnu/libsecret-1.so.0",
    "/usr/lib64/libsecret-1.so.0",
    "/usr/lib/libsecret-1.so.0",
  ];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return true;
    } catch {
      // Keep checking common library locations.
    }
  }
  return false;
}

function commandVersion(bin, args = ["--version"], timeoutMs = 2500) {
  return new Promise((resolve) => {
    const child = spawn(bin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      resolve(null);
    }, timeoutMs);
    child.stdout.on("data", (chunk) => { output += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { output += chunk.toString("utf8"); });
    child.on("error", () => {
      clearTimeout(timer);
      resolve(null);
    });
    child.on("close", () => {
      clearTimeout(timer);
      resolve(output.trim().split("\n")[0] || null);
    });
  });
}

async function hasPythonModule(moduleName) {
  return new Promise((resolve) => {
    const child = spawn(resolveHarnessPython(), ["-c", `import importlib.util; raise SystemExit(0 if importlib.util.find_spec(${JSON.stringify(moduleName)}) else 1)`], {
      stdio: ["ignore", "ignore", "ignore"],
    });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

function canBindPort(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", (error) => resolve({ available: false, reason: error.code || error.message }));
    server.listen(port, host, () => server.close(() => resolve({ available: true, reason: null })));
  });
}

export async function runPreflight({
  repoRoot,
  dataRoot,
  daemonPort = 17654,
  webPort = 17655,
  versionTimeoutMs = 2500,
} = {}) {
  const tools = [];
  for (const tool of REQUIRED_TOOLS) {
    const path = await findOnPath(tool.bin);
    tools.push({
      ...tool,
      available: Boolean(path),
      path,
      version: path ? await commandVersion(tool.bin, ["--version"], versionTimeoutMs) : null,
    });
  }

  const agents = await detectAgents();
  const antigravitySdkAvailable = await hasPythonModule("google.antigravity");
  const geminiExtensionIssues = await listGeminiExtensionIssues();
  const libsecretAvailable = await hasLibsecret();
  const daemonPortCheck = await canBindPort(Number(daemonPort));
  const webPortCheck = await canBindPort(Number(webPort));
  const ports = [
    { id: "daemon", port: Number(daemonPort), ...daemonPortCheck },
    { id: "web", port: Number(webPort), ...webPortCheck },
  ];
  const localReady = tools.filter((tool) => tool.requiredFor.includes("local")).every((tool) => tool.available);
  const validationReady = localReady && tools.filter((tool) => tool.requiredFor.includes("validate")).every((tool) => tool.available);
  const deployReady = tools.filter((tool) => tool.requiredFor.includes("deploy")).every((tool) => tool.available);
  const harnessReady = agents.some((agent) => agent.available && agent.id !== "mock");

  const findings = [];
  for (const tool of tools) {
    if (!tool.available && tool.requiredFor.includes("local")) findings.push({ level: "error", code: `MISSING_${tool.id.toUpperCase()}`, message: `${tool.bin} is required for local workflow` });
    else if (!tool.available) findings.push({ level: "warn", code: `MISSING_${tool.id.toUpperCase()}`, message: `${tool.bin} missing; ${tool.requiredFor.join(", ")} capabilities degraded` });
  }
  for (const port of ports) {
    if (!port.available && port.reason === "EADDRINUSE") findings.push({ level: "warn", code: `PORT_${port.port}_BUSY`, message: `${port.id} port ${port.port} is already in use` });
    else if (!port.available) findings.push({ level: "warn", code: `PORT_${port.port}_UNAVAILABLE`, message: `${port.id} port ${port.port} cannot be bound in this environment (${port.reason})` });
  }
  for (const issue of geminiExtensionIssues) {
    findings.push({ level: "warn", code: issue.code, message: issue.message, path: issue.path });
  }
  if (!libsecretAvailable) {
    findings.push({
      level: "warn",
      code: "LIBSECRET_MISSING",
      message: "libsecret-1.so.0 is missing; local Google harness CLIs may be unable to use Linux Secret Service keyring silently in headless environments",
    });
  }
  if (!harnessReady) findings.push({ level: "warn", code: "NO_LIVE_HARNESS", message: "Only the bundled mock harness is available" });
  if (!antigravitySdkAvailable) {
    findings.push({
      level: "warn",
      code: "ANTIGRAVITY_SDK_MISSING",
      message: "google-antigravity Python SDK is not importable from the harness interpreter; programmatic Antigravity harness runs will fail. Fix: `mise run deps` (creates the repo .venv via uv and installs it there)",
    });
  }

  return {
    ok: findings.every((finding) => finding.level !== "error"),
    repoRoot,
    dataRoot,
    tools,
    agents,
    ports,
    gemini: {
      extensions: {
        issues: geminiExtensionIssues,
      },
      keychain: {
        libsecretAvailable,
        fallbackExpected: !libsecretAvailable,
      },
    },
    agy: {
      auth: {
        owner: "agy",
        storage: "OS native keyring or ~/.gemini/antigravity-cli local state",
        gatewayPolicy: "do not store tokens; launch under the same OS user and surface auth-required output",
      },
    },
    antigravitySdk: {
      available: antigravitySdkAvailable,
      auth: {
        owner: "gateway environment",
        expected: "GEMINI_API_KEY for Gemini Developer API, or Vertex mode with GOOGLE_CLOUD_PROJECT/GCLOUD_PROJECT plus GOOGLE_CLOUD_LOCATION/GOOGLE_GENAI_LOCATION and ADC",
        gatewayPolicy: "prefer SDK for factory-scale programmatic review/enrichment; use agy CLI only as local keyring fallback",
        vertex: {
          enabledBy: "pass --vertex true, or set ANTIGRAVITY_USE_VERTEXAI=true/GOOGLE_GENAI_USE_VERTEXAI=true",
          project: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null,
          location: process.env.GOOGLE_CLOUD_LOCATION || process.env.GOOGLE_GENAI_LOCATION || null,
          credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS ? "service_account_file" : "adc_or_gcloud_user",
        },
      },
    },
    readiness: {
      local: localReady,
      validation: validationReady,
      deploy: deployReady,
      harness: harnessReady,
    },
    findings,
  };
}
