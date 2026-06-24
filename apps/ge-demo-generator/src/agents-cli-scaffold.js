import { spawn } from "node:child_process";
import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { delimiter, join } from "node:path";

async function findOnPath(bin) {
  for (const dir of (process.env.PATH || "").split(delimiter)) {
    if (!dir) continue;
    const candidate = join(dir, bin);
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Continue scanning PATH.
    }
  }
  return null;
}

function slug(value) {
  const safe = String(value || "ge-agent")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 26);
  return safe || "ge-agent";
}

function run(command, args, { cwd, env }) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("error", (error) => resolve({ code: 1, stdout, stderr: `${stderr}\n${error.message}`.trim() }));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function copyMissing(src, dest) {
  if (await exists(dest)) return false;
  const info = await stat(src);
  if (info.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    for (const entry of entries) await copyMissing(join(src, entry), join(dest, entry));
    return true;
  }
  await mkdir(dest.slice(0, dest.lastIndexOf("/")) || ".", { recursive: true });
  await cp(src, dest, { recursive: false, force: false });
  return true;
}

async function normalizePyproject(workspaceDir) {
  const path = join(workspaceDir, "pyproject.toml");
  try {
    const text = await readFile(path, "utf8");
    const normalized = text.replace(/packages = \["app","frontend"\]/g, 'packages = ["app"]');
    if (normalized !== text) await writeFile(path, normalized, "utf8");
  } catch {
    // pyproject is optional for failed or partial scaffolds.
  }
}

async function normalizeAppInit(workspaceDir) {
  const path = join(workspaceDir, "app", "__init__.py");
  const content = [
    "from .agent import root_agent",
    "",
    "app = root_agent",
    "",
    "__all__ = [\"app\", \"root_agent\"]",
    "",
  ].join("\n");
  await writeFile(path, content, "utf8");
}

export async function scaffoldWithAgentsCli({ workspaceDir, projectName, dataRoot, repoRoot }) {
  const bin = await findOnPath("agents-cli");
  if (!bin) return { ok: false, skipped: true, reason: "agents-cli not found on PATH" };

  const name = slug(projectName);
  const scratchRoot = join(dataRoot, "agents-cli-scaffolds");
  const home = join(dataRoot, "agents-cli-home");
  const outputDir = join(scratchRoot, `${name}-${Date.now()}`);
  await mkdir(outputDir, { recursive: true });
  await mkdir(home, { recursive: true });

  const guidanceFilename = process.env.AGENT_GUIDANCE_FILENAME || "AGENTS.md";
  const result = await run(bin, [
    "create",
    name,
    "--output-dir",
    outputDir,
    "--agent",
    "adk",
    "--prototype",
    "--deployment-target",
    "none",
    "--skip-checks",
    "--agent-guidance-filename",
    guidanceFilename,
    "--google-api-key",
    "PLACEHOLDER",
  ], {
    cwd: repoRoot,
    env: {
      ...process.env,
      HOME: home,
      GIT_TERMINAL_PROMPT: "0",
    },
  });

  const scaffoldDir = join(outputDir, name);
  if (result.code !== 0 || !await exists(scaffoldDir)) {
    await rm(outputDir, { recursive: true, force: true });
    return {
      ok: false,
      skipped: false,
      command: "agents-cli create",
      code: result.code,
      stderr: result.stderr.slice(-4000),
    };
  }

  const copied = [];
  for (const rel of ["pyproject.toml", "README.md", "AGENTS.md", "Dockerfile", "app", "tests"]) {
    if (await copyMissing(join(scaffoldDir, rel), join(workspaceDir, rel))) copied.push(rel);
  }
  await normalizePyproject(workspaceDir);
  await normalizeAppInit(workspaceDir);
  await rm(outputDir, { recursive: true, force: true });
  return {
    ok: true,
    command: "agents-cli create",
    projectName: name,
    copied,
  };
}
