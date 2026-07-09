#!/usr/bin/env node
// Structured install verification for the installing-the-factory skill.
// Checks every bootstrap phase with a real command and prints one line per
// check (✓/✗ + what/fix), plus a JSON summary on stdout when --json is
// passed. Exits non-zero if any required check fails — "Setup done." text is
// not proof; this is.
//
// Runs under plain `node` (no repo deps) so it works the moment mise has
// provisioned a runtime — and under bun identically.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

// The skill may be invoked from anywhere (including a copy in an assistant's
// skill dir); locate the repo by walking up from cwd, falling back to the
// script's own location for in-repo invocations.
function findRepoRoot() {
  for (let dir = resolve(process.cwd()); ; dir = dirname(dir)) {
    if (existsSync(join(dir, "mise.toml")) && existsSync(join(dir, "tools", "ge.mjs"))) return dir;
    if (dirname(dir) === dir) break;
  }
  const here = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
  if (existsSync(join(here, "mise.toml"))) return here;
  return null;
}

function tryRun(cmd, args, opts = {}) {
  try {
    return { ok: true, out: execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60000, ...opts }).trim() };
  } catch (error) {
    return { ok: false, out: String(error?.message || error) };
  }
}

const repo = findRepoRoot();
const checks = [];
const add = (name, ok, { detail = "", fix = "", required = true } = {}) => checks.push({ name, ok, detail, fix, required });

add("repo checkout", !!repo, {
  detail: repo || "no ge-agent-factory checkout found upward from cwd",
  fix: "git clone https://github.com/vamsiramakrishnan/ge-agent-factory.git && cd ge-agent-factory",
});

const bun = tryRun("bun", ["--version"], repo ? { cwd: repo } : {});
add("bun (toolchain)", bun.ok, {
  detail: bun.ok ? `bun ${bun.out}` : "bun not resolvable — toolchain not provisioned",
  fix: "mise trust && mise install",
});

if (repo) {
  add("workspace deps", existsSync(join(repo, "node_modules", "citty")), {
    detail: existsSync(join(repo, "node_modules")) ? "node_modules present" : "node_modules missing",
    fix: "mise run setup   (or: bun install)",
  });
  const geBin = join(process.env.BIN || join(homedir(), ".local", "bin"), "ge");
  add("ge command installed", existsSync(geBin), {
    detail: existsSync(geBin) ? geBin : `${geBin} missing`,
    fix: "mise run setup   (or: mise run install)",
    required: false, // bun tools/ge.mjs always works; the installed command is convenience
  });
  const ge = bun.ok ? tryRun("bun", ["tools/ge.mjs", "--help"], { cwd: repo }) : { ok: false, out: "bun unavailable" };
  add("ge answers", ge.ok, {
    detail: ge.ok ? "ge --help renders" : ge.out.split("\n")[0],
    fix: "mise run setup",
  });
  add("skills manifest synced", existsSync(join(repo, ".ge", "skills", "manifest.json")), {
    detail: ".ge/skills/manifest.json",
    fix: "mise run skills-sync",
    required: false,
  });
  add("config (.ge.json)", existsSync(join(repo, ".ge.json")), {
    detail: existsSync(join(repo, ".ge.json")) ? ".ge.json present" : "not configured yet (fine for a fresh install)",
    fix: "bun tools/ge.mjs init",
    required: false,
  });
}

// mise is the provisioning path, not the outcome — required only when the
// outcome checks show something still needs provisioning (mise is the fix);
// advisory in environments that were provisioned another way (CI images,
// sandboxes with bun preinstalled) but otherwise fully work.
const outcomeOk = checks.filter((check) => check.required).every((check) => check.ok);
const misePath = process.env.MISE_BIN || (existsSync(join(homedir(), ".local", "bin", "mise")) ? join(homedir(), ".local", "bin", "mise") : "mise");
const mise = tryRun(misePath, ["--version"]);
add("mise", mise.ok, {
  detail: mise.ok ? mise.out.split("\n")[0] : outcomeOk ? "mise not found, but the toolchain works without it (provisioned another way)" : "mise not on PATH (or ~/.local/bin)",
  fix: 'curl https://mise.run | sh && export PATH="$HOME/.local/bin:$PATH"',
  required: !outcomeOk,
});

const failedRequired = checks.filter((check) => check.required && !check.ok);
const json = process.argv.includes("--json");
if (json) {
  process.stdout.write(JSON.stringify({ ok: failedRequired.length === 0, checks }, null, 2) + "\n");
} else {
  for (const check of checks) {
    process.stdout.write(`${check.ok ? "✓" : check.required ? "✗" : "○"} ${check.name}  ${check.detail}\n`);
    if (!check.ok && check.fix) process.stdout.write(`    fix: ${check.fix}\n`);
  }
  process.stdout.write(failedRequired.length ? `\ninstall NOT verified — ${failedRequired.length} required check(s) failing\n` : "\ninstall verified — next: bun tools/ge.mjs prove\n");
}
process.exit(failedRequired.length ? 1 : 0);
