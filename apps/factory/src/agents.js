import { access } from "node:fs/promises";
import { spawn } from "node:child_process";
import { delimiter, join } from "node:path";
import { capabilityForAgent, normalizePermissionProfile, PERMISSION_PROFILES } from "./harness-runtime.js";
import { resolveHarnessPython } from "./harness-python.js";

const DEFAULT_MODELS = [{ id: "default", label: "Default" }];

export const AGENT_DEFS = [
  {
    id: "antigravity-sdk",
    name: "Antigravity SDK",
    bin: "python3",
    // Resolved at detect time so a repo-local .venv created during the same
    // bootstrap (uv) is picked up; falls back to python3 (worker image).
    resolveBin: () => resolveHarnessPython(),
    models: DEFAULT_MODELS,
    buildArgs: (_prompt, options = {}) => {
      const args = [
        new URL("../scripts/antigravity-sdk-agent.py", import.meta.url).pathname,
        "--permission-profile",
        normalizePermissionProfile(options.permissionProfile),
        "--workspace-dir",
        options.cwd || process.cwd(),
      ];
      if (options.model && options.model !== "default") args.push("--model", options.model);
      if (options.vertex) args.push("--vertex");
      else if (options.vertex === false) args.push("--no-vertex");
      if (options.project) args.push("--project", options.project);
      if (options.location) args.push("--location", options.location);
      for (const skillPath of options.skillsPaths || []) args.push("--skills-path", skillPath);
      // Newly-wired SDK capabilities — all optional, so default runs are unchanged.
      for (const spec of options.mcpServers || []) args.push("--mcp", typeof spec === "string" ? spec : JSON.stringify(spec));
      for (const file of options.attachments || []) args.push("--attach", file);
      if (options.enableFactoryTools) args.push("--enable-factory-tools");
      if (options.subagents === false) args.push("--no-subagents");
      if (options.enableSubagents) args.push("--enable-subagents");
      if (options.conversationId) args.push("--conversation-id", options.conversationId);
      if (options.saveDir) args.push("--save-dir", options.saveDir);
      if (options.triggerEvery) args.push("--trigger-every", String(options.triggerEvery));
      if (options.policy) args.push("--policy", options.policy);
      if (options.responseSchemaFile) args.push("--response-schema-file", options.responseSchemaFile);
      for (const name of options.protectFiles || []) args.push("--protect-file", name);
      for (const name of options.disableTools || []) args.push("--disable-tool", name);
      return args;
    },
    promptViaStdin: true,
    streamFormat: "plain",
    checkAvailable: async () => hasPythonModule("google.antigravity"),
  },
  {
    id: "agy",
    name: "Antigravity CLI",
    bin: "agy",
    models: DEFAULT_MODELS,
    buildArgs: (_prompt, options = {}) => {
      const args = [];
      if (options.agentLogFilePath) args.push("--log-file", options.agentLogFilePath);
      args.push("-p", "-");
      return args;
    },
    promptViaStdin: true,
    streamFormat: "plain",
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    bin: "gemini",
    models: [
      ...DEFAULT_MODELS,
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
      { id: "gemini-3.1-flash", label: "Gemini 3.1 Flash" },
      { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (Preview)" },
      { id: "gemini-3.1-flash-lite-preview", label: "Gemini 3.1 Flash Lite (Preview)" },
    ],
    buildArgs: (_prompt, options = {}) => {
      const args = ["--output-format", "stream-json"];
      if (normalizePermissionProfile(options.permissionProfile) !== "review") args.push("--approval-mode", "yolo");
      if (options.model && options.model !== "default") args.push("--model", options.model);
      return args;
    },
    promptViaStdin: true,
    streamFormat: "json-lines",
  },
  {
    id: "mock",
    name: "Mock Harness Agent",
    bin: process.execPath,
    bundled: true,
    models: DEFAULT_MODELS,
    buildArgs: () => [
      new URL("./mock-agent.js", import.meta.url).pathname,
    ],
    promptViaStdin: true,
    streamFormat: "plain",
  },
  {
    id: "codex",
    name: "Codex CLI",
    bin: "codex",
    models: [
      ...DEFAULT_MODELS,
      { id: "gpt-5-codex", label: "gpt-5-codex" },
      { id: "gpt-5.5", label: "gpt-5.5" },
      { id: "gpt-5.4", label: "gpt-5.4" },
    ],
    // Interaction-form parity with the Antigravity driver, via Codex's own MCP
    // support. Codex takes `-c key=value` config overrides (values parsed as
    // JSON), so the same request_user_input bridge is registered as an
    // mcp_servers entry when a run has an interaction dir. TOML bare keys can't
    // contain hyphens, so the server id is `ge_interaction` here (the bridge
    // script is identical). Wired per Codex's documented config surface;
    // live behavior on a real codex binary is not exercised in CI (same status
    // as the claude adapter's --mcp-config path).
    supportsInteraction: true,
    buildArgs: (_prompt, options = {}) => {
      const args = ["exec", "--json", "--skip-git-repo-check"];
      if (normalizePermissionProfile(options.permissionProfile) !== "review") args.push("--full-auto");
      if (options.cwd) args.push("-C", options.cwd);
      if (options.model && options.model !== "default") args.push("--model", options.model);
      if (options.interactionDir) {
        const bridge = new URL("../scripts/claude-interaction-mcp.mjs", import.meta.url).pathname;
        args.push("-c", `mcp_servers.ge_interaction.command=${JSON.stringify(process.execPath)}`);
        args.push("-c", `mcp_servers.ge_interaction.args=${JSON.stringify([bridge])}`);
        args.push("-c", `mcp_servers.ge_interaction.env=${JSON.stringify({ GE_HARNESS_INTERACTION_DIR: options.interactionDir })}`);
      }
      return args;
    },
    promptViaStdin: true,
    streamFormat: "json-lines",
  },
  {
    id: "claude",
    name: "Claude Code",
    bin: "claude",
    models: [
      ...DEFAULT_MODELS,
      { id: "sonnet", label: "Sonnet" },
      { id: "opus", label: "Opus" },
    ],
    supportsInteraction: true,
    buildArgs: (_prompt, options = {}) => {
      const args = ["-p", "--output-format", "stream-json", "--verbose"];
      if (normalizePermissionProfile(options.permissionProfile) !== "review") args.push("--permission-mode", "bypassPermissions");
      if (options.model && options.model !== "default") args.push("--model", options.model);
      // Interaction-form parity with the Antigravity driver: when a run has an
      // interaction dir (console interview / any form-capable run), expose the
      // request_user_input MCP bridge that round-trips question forms through
      // the same requests/-responses/ protocol the console UI answers.
      if (options.interactionDir) {
        const bridge = new URL("../scripts/claude-interaction-mcp.mjs", import.meta.url).pathname;
        args.push("--mcp-config", JSON.stringify({
          mcpServers: {
            "ge-interaction": {
              command: process.execPath,
              args: [bridge],
              env: { GE_HARNESS_INTERACTION_DIR: options.interactionDir },
            },
          },
        }));
        args.push("--allowedTools", "mcp__ge-interaction__request_user_input");
      }
      return args;
    },
    promptViaStdin: true,
    streamFormat: "json-lines",
  },
  {
    id: "opencode",
    name: "OpenCode",
    bin: "opencode",
    models: DEFAULT_MODELS,
    buildArgs: () => ["run", "--print"],
    promptViaStdin: true,
    streamFormat: "plain",
  },
];

async function findOnPath(bin) {
  if (!bin) return null;
  if (bin.includes("/") || bin.includes("\\")) {
    try {
      await access(bin);
      return bin;
    } catch {
      return null;
    }
  }

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

function hasPythonModule(moduleName) {
  return new Promise((resolve) => {
    const child = spawn(resolveHarnessPython(), ["-c", `import importlib.util; raise SystemExit(0 if importlib.util.find_spec(${JSON.stringify(moduleName)}) else 1)`], {
      stdio: ["ignore", "ignore", "ignore"],
    });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

export async function detectAgents() {
  const out = [];
  for (const def of AGENT_DEFS) {
    const binToUse = typeof def.resolveBin === "function" ? def.resolveBin() : def.bin;
    const resolvedBin = def.bundled ? binToUse : await findOnPath(binToUse);
    const dependencyAvailable = resolvedBin && typeof def.checkAvailable === "function" ? await def.checkAvailable() : true;
    out.push({
      id: def.id,
      name: def.name,
      bin: binToUse,
      available: Boolean(resolvedBin && dependencyAvailable),
      resolvedBin,
      unavailableReason: resolvedBin && !dependencyAvailable ? "missing runtime dependency" : resolvedBin ? null : "binary not found on PATH",
      models: def.models || DEFAULT_MODELS,
      streamFormat: def.streamFormat,
      capabilities: capabilityForAgent(def.id),
      contract: runtimeAdapterContract(def),
    });
  }
  return out;
}

export async function getAgentDef(id) {
  const def = AGENT_DEFS.find((item) => item.id === id) || AGENT_DEFS.find((item) => item.id === "gemini") || AGENT_DEFS[0];
  const binToUse = typeof def.resolveBin === "function" ? def.resolveBin() : def.bin;
  const resolvedBin = def.bundled ? binToUse : await findOnPath(binToUse);
  const dependencyAvailable = resolvedBin && typeof def.checkAvailable === "function" ? await def.checkAvailable() : true;
  return {
    ...def,
    bin: binToUse,
    resolvedBin: resolvedBin && dependencyAvailable ? resolvedBin : null,
    unavailableReason: resolvedBin && !dependencyAvailable ? "missing runtime dependency" : resolvedBin ? null : "binary not found on PATH",
    capabilities: capabilityForAgent(def.id),
    contract: runtimeAdapterContract(def),
  };
}

export function runtimeAdapterContract(def) {
  return {
    id: def.id,
    adapterKind: def.bundled ? "process" : "cli",
    promptTransport: def.promptViaStdin ? "stdin" : "argv",
    streamFormat: def.streamFormat || "plain",
    supportsResume: Boolean(def.supportsResume),
    supportsUsage: def.streamFormat === "json-lines",
    supportsInteraction: Boolean(def.supportsInteraction),
    envPolicy: "allowlist-plus-scoped-secrets",
    requiredSecretNames: Array.isArray(def.requiredSecretNames) ? def.requiredSecretNames : [],
    capabilities: capabilityForAgent(def.id).primary,
    permissionProfiles: Object.values(PERMISSION_PROFILES),
  };
}

// Whether an adapter speaks the interaction-form protocol through the
// request_user_input MCP bridge (claude via --mcp-config, codex via -c
// mcp_servers). Declarative capability, so the harness runner drives the
// prompt section + request watcher off this instead of hardcoding adapter ids.
export function agentSupportsInteraction(id) {
  return Boolean(AGENT_DEFS.find((def) => def.id === id)?.supportsInteraction);
}
