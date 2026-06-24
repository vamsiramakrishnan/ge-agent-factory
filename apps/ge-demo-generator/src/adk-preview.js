import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { delimiter, dirname, join, resolve } from "node:path";
import { writeJson } from "../../../tools/lib/json-io.mjs";
import { createPromotionPacket } from "./promotion-packet.js";
import { updateWorkspaceCapabilities } from "./workspace-capabilities.js";
import { ARTIFACT_PATHS, WORKSPACE_PATHS } from "./workspace-contract.js";

function readDotEnvSync(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    env[key] = value;
  }
  return env;
}

export function buildAdkPreviewEnv({ workspaceDir, repoRoot, dataRoot, extra = {} } = {}) {
  const env = {};
  const exact = ["PATH", "HOME", "USER", "LOGNAME", "SHELL", "TMPDIR", "TEMP", "TMP", "LANG", "LC_ALL", "SSL_CERT_FILE", "REQUESTS_CA_BUNDLE"];
  for (const key of exact) if (process.env[key]) env[key] = process.env[key];
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
    ...(dataRoot ? readDotEnvSync(join(dataRoot, ".env")) : {}),
    ...(workspaceDir ? readDotEnvSync(join(workspaceDir, ".env")) : {}),
  };
  return {
    ...env,
    ...configuredEnv,
    GIT_TERMINAL_PROMPT: "0",
    UV_CACHE_DIR: configuredEnv.UV_CACHE_DIR || process.env.UV_CACHE_DIR || (dataRoot && dataRoot !== "/" ? join(dataRoot, "uv-cache") : workspaceDir ? join(workspaceDir, ".ge-harness", "uv-cache") : undefined),
    PATH: [join(repoRoot || "", "node_modules", ".bin"), env.PATH].filter(Boolean).join(delimiter),
    ...extra,
  };
}

export function findRootAgentDir(workspaceDir) {
  const candidates = [
    { relativePath: "app", file: join(workspaceDir, "app", "agent.py") },
    { relativePath: ".", file: join(workspaceDir, "agent.py") },
  ];
  for (const candidate of candidates) {
    try {
      if (/\broot_agent\b/.test(readFileSync(candidate.file, "utf8"))) return candidate;
    } catch {
      // Keep looking.
    }
  }
  return candidates.find((candidate) => existsSync(candidate.file)) || candidates[0];
}

export function parseAdkRunResponse(stdout) {
  const lines = String(stdout || "").split(/\r?\n/);
  const chunks = [];
  let capturing = false;
  for (const line of lines) {
    const speaker = line.match(/^\[([^\]]+)\]:\s*(.*)$/);
    if (speaker) {
      capturing = speaker[1] !== "user";
      if (capturing) chunks.push(speaker[2]);
      continue;
    }
    if (capturing) chunks.push(line);
  }
  const adkResponse = chunks.join("\n").trim();
  if (adkResponse) return adkResponse;
  return lines
    .filter((line) => !/^Log setup complete:/.test(line))
    .filter((line) => !/^To access latest log:/.test(line))
    .filter((line) => !/^Using project root directory:/.test(line))
    .filter((line) => !/^Local server/.test(line))
    .join("\n")
    .trim();
}

function terminateChild(child, signal = "SIGTERM") {
  if (!child || child.killed) return;
  child.kill(signal);
}

function inferPreviewPrompt(workspaceDir, prompt) {
  const explicit = String(prompt || "").trim();
  if (explicit && explicit !== "hello") return explicit;
  try {
    const golden = JSON.parse(readFileSync(join(workspaceDir, WORKSPACE_PATHS.goldenEvals), "utf8"));
    const firstPrompt = golden?.evals?.find((item) => String(item?.prompt || "").trim())?.prompt;
    if (firstPrompt) return firstPrompt;
  } catch {
    // Fall back below.
  }
  try {
    const spec = JSON.parse(readFileSync(join(workspaceDir, WORKSPACE_PATHS.useCaseSpec), "utf8"));
    const objective = spec?.behaviorContract?.primaryObjective;
    if (objective) return `Run the generated agent workflow for this objective: ${objective}`;
  } catch {
    // Fall back below.
  }
  return explicit || "hello";
}

export async function runAdkPreviewForWorkspace({
  workspaceDir,
  projectId,
  prompt = "hello",
  repoRoot = resolve(workspaceDir, "..", "..", ".."),
  dataRoot = resolve(workspaceDir, "..", ".."),
  timeoutMs = 60_000,
  createPacket = true,
  source = "adk-run-preview",
} = {}) {
  if (!workspaceDir || !projectId) throw new Error("workspaceDir and projectId are required");
  const previewPrompt = inferPreviewPrompt(workspaceDir, prompt);
  const effectiveDataRoot = dataRoot === "/" ? join(workspaceDir, ".ge-harness") : dataRoot;
  const rootAgentDir = findRootAgentDir(workspaceDir);
  const runDir = join(workspaceDir, ".ge-harness", "adk-run");
  mkdirSync(runDir, { recursive: true });
  const replayPath = join(runDir, `replay-${Date.now()}.json`);
  writeJson(replayPath, { state: {}, queries: [previewPrompt], runner: "agents-cli run" });

  const result = await new Promise((resolveRun) => {
    const child = spawn("uv", [
      "tool",
      "run",
      "google-agents-cli",
      "run",
      previewPrompt,
      "--start-server",
    ], {
      cwd: workspaceDir,
      env: buildAdkPreviewEnv({
        workspaceDir,
        repoRoot,
        dataRoot: effectiveDataRoot,
        extra: {
          PYTHONPATH: [workspaceDir, process.env.PYTHONPATH].filter(Boolean).join(delimiter),
          FIXTURES_ROOT: join(workspaceDir, "fixtures"),
        },
      }),
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      terminateChild(child, "SIGTERM");
    }, timeoutMs);
    timer.unref?.();
    child.stdout?.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr?.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolveRun({ ok: false, code: 1, timedOut, prompt, replayPath, rootAgentPath: rootAgentDir.relativePath, stdout, stderr: `${stderr}${error.message}`, response: "" });
    });
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolveRun({
        ok: code === 0 && !timedOut,
        code,
        signal,
        timedOut,
        prompt: previewPrompt,
        replayPath,
        rootAgentPath: rootAgentDir.relativePath,
        runner: "agents-cli run",
        stdout: stdout.slice(-80_000),
        stderr: stderr.slice(-80_000),
        response: parseAdkRunResponse(stdout),
      });
    });
  });
  const recorded = await recordAdkPreviewEvidence({
    workspaceDir,
    projectId,
    result,
    repoRoot,
    createPacket,
    source,
  });
  return { ...result, ...recorded };
}

export async function recordAdkPreviewEvidence({
  workspaceDir,
  projectId,
  result,
  repoRoot,
  createPacket = true,
  source = "adk-run-preview",
} = {}) {
  const generatedAt = new Date().toISOString();
  const previewReport = {
    kind: "ge.harness.preview_report",
    workspace: projectId,
    ok: result.ok === true,
    prompt: result.prompt,
    response: result.response,
    rootAgentPath: result.rootAgentPath,
    code: result.code ?? null,
    signal: result.signal ?? null,
    timedOut: result.timedOut === true,
    replayPath: result.replayPath,
    runner: result.runner || "agents-cli run",
    stdoutTail: result.stdout || "",
    stderrTail: result.stderr || "",
    generatedAt,
  };
  mkdirSync(join(workspaceDir, "artifacts"), { recursive: true });
  writeJson(join(workspaceDir, ARTIFACT_PATHS.previewReport), previewReport);
  writeFileSync(join(workspaceDir, "artifacts", "PREVIEW_REPORT.md"), [
    "# Preview Report",
    "",
    `Workspace: ${projectId}`,
    `Status: ${result.ok ? "pass" : "fail"}`,
    `Generated: ${generatedAt}`,
    `Agent path: ${result.rootAgentPath || "app"}`,
    "",
    "## Prompt",
    result.prompt || "hello",
    "",
    "## Response",
    result.response || "No response captured.",
    "",
    "## Command",
    "`uv tool run google-agents-cli run <prompt> --start-server`",
    "",
    `Exit: ${result.code ?? "unknown"}`,
    result.stderr ? `\n## Stderr\n\n\`\`\`\n${result.stderr}\n\`\`\`` : "",
  ].join("\n"), "utf8");

  const pipelinePath = join(workspaceDir, "mock_systems", "pipeline.json");
  let pipeline = {};
  try {
    pipeline = JSON.parse(readFileSync(pipelinePath, "utf8"));
  } catch {
    mkdirSync(dirname(pipelinePath), { recursive: true });
  }
  pipeline.steps = {
    ...(pipeline.steps || {}),
    serve: {
      ...(pipeline.steps?.serve || {}),
      status: result.ok ? "done" : "failed",
      mode: "agents_cli_run",
      completedAt: generatedAt,
      output: ARTIFACT_PATHS.previewReport,
      exitCode: result.code ?? null,
    },
  };
  pipeline.nextStep = result.ok ? "deploy:plan" : "preview";
  writeJson(pipelinePath, pipeline);

  const manifestPath = join(workspaceDir, WORKSPACE_PATHS.workspaceManifest);
  let promotionPacket = null;
  if (result.ok && createPacket) {
    const promotion = await createPromotionPacket({ workspaceDir, manifestPath, projectId, repoRoot, source });
    promotionPacket = { paths: promotion.paths, nextActions: promotion.packet.nextActions };
  } else {
    await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot } });
  }
  return {
    previewReport: ARTIFACT_PATHS.previewReport,
    promotionPacket,
  };
}
