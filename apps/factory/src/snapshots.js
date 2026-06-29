import { execFile } from "node:child_process";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { ensureProjectDir, normalizeWorkspaceRelativePath, projectDir } from "./projects.js";

const execFileAsync = promisify(execFile);
const EXCLUDE_MARKER = "# ge-harness workspace operational paths";
const EXCLUDES = [
  "/runs/",
  "/versions/",
  "/workspace.json",
  "/brief.json",
  "/.env",
  "/.env.*",
  "/node_modules/",
  "/.venv/",
  "/venv/",
  "/__pycache__/",
  "*.pyc",
  "*.pem",
  ".*.artifact.json",
];

async function git(cwd, args, options = {}) {
  const result = await execFileAsync("git", args, {
    cwd,
    maxBuffer: options.maxBuffer || 4 * 1024 * 1024,
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: "0",
      ...options.env,
    },
  });
  return result.stdout;
}

async function ensureExcludeFile(gitDir) {
  const excludePath = join(gitDir, "info", "exclude");
  await mkdir(join(gitDir, "info"), { recursive: true });
  const existing = existsSync(excludePath) ? await readFile(excludePath, "utf8") : "";
  if (existing.includes(EXCLUDE_MARKER)) return;
  const block = `\n${EXCLUDE_MARKER}\n${EXCLUDES.join("\n")}\n`;
  if (existsSync(excludePath)) await appendFile(excludePath, block, "utf8");
  else await writeFile(excludePath, block, "utf8");
}

export async function ensureGitWorkspace(projectsRoot, projectId) {
  const cwd = await ensureProjectDir(projectsRoot, projectId);
  if (!existsSync(join(cwd, ".git"))) {
    await git(cwd, ["init", "--quiet"]);
  }
  await ensureExcludeFile(join(cwd, ".git"));
  await git(cwd, ["config", "user.name", "GE Harness"]);
  await git(cwd, ["config", "user.email", "ge-harness@example.local"]);
  await git(cwd, ["config", "commit.gpgsign", "false"]);
  return cwd;
}

export async function listSnapshotFiles(projectsRoot, projectId, ref = "HEAD") {
  const cwd = projectDir(projectsRoot, projectId);
  const output = await git(cwd, ["ls-tree", "-r", "-z", "--long", ref], { maxBuffer: 16 * 1024 * 1024 });
  return output
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const tab = line.indexOf("\t");
      const meta = line.slice(0, tab).trim().split(/\s+/);
      const path = line.slice(tab + 1);
      return {
        path,
        mode: meta[0],
        object: meta[2],
        size: Number(meta[3]) || 0,
      };
    });
}

export async function createWorkspaceSnapshot(projectsRoot, projectId, { message = "workspace snapshot" } = {}) {
  const cwd = await ensureGitWorkspace(projectsRoot, projectId);
  await git(cwd, ["add", "-A", "--", "."]);
  await git(cwd, ["commit", "--allow-empty", "--quiet", "-m", message], {
    env: {
      GIT_AUTHOR_NAME: "GE Harness",
      GIT_AUTHOR_EMAIL: "ge-harness@example.local",
      GIT_COMMITTER_NAME: "GE Harness",
      GIT_COMMITTER_EMAIL: "ge-harness@example.local",
    },
  });
  const commit = (await git(cwd, ["rev-parse", "HEAD"])).trim();
  const files = await listSnapshotFiles(projectsRoot, projectId, commit);
  return {
    kind: "git",
    commit,
    fileSnapshot: files,
  };
}

export async function restoreWorkspaceSnapshot(projectsRoot, projectId, snapshotRef) {
  if (!/^[0-9a-f]{40}$/i.test(String(snapshotRef || ""))) {
    throw new Error("invalid snapshot ref");
  }
  const cwd = await ensureGitWorkspace(projectsRoot, projectId);
  await git(cwd, ["cat-file", "-e", `${snapshotRef}^{commit}`]);
  await git(cwd, ["reset", "--hard", "--quiet", snapshotRef]);
  await git(cwd, ["clean", "-fd", "--quiet", "--", "."]);
  return {
    kind: "git",
    commit: snapshotRef,
    fileSnapshot: await listSnapshotFiles(projectsRoot, projectId, snapshotRef),
  };
}

export function normalizeAgentDirName(value) {
  const rel = normalizeWorkspaceRelativePath(value, { allowEmpty: false });
  if (rel.split("/").some((part) => part.startsWith("."))) {
    throw new Error("invalid agent directory");
  }
  return rel;
}
