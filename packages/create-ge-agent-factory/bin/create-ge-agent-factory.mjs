#!/usr/bin/env node
// create-ge-agent-factory — the npx/bunx bootstrap for the GE Agent Factory.
//
//   curl -fsSL https://raw.githubusercontent.com/vamsiramakrishnan/ge-agent-factory/main/packages/create-ge-agent-factory/bin/create-ge-agent-factory.mjs \
//     | bun - --skills agents                    # clone + expose skills from GitHub
//   bunx create-ge-agent-factory                 # same UX after the npm package is published
//
// Design: this file is the *entry ramp*, not the installer of record. The
// authority for install phases is the repo's own bootstrap skill
// (skills/installing-the-factory) and its verify script; this bin gets the
// repo onto disk, optionally executes the phases with consent (--yes), and
// always ends by pointing at the skill so a coding agent can take over.
// Zero dependencies on purpose — it must run under bare `npx`/`bunx`.
import { execSync, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, symlinkSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { homedir } from "node:os";

const REPO_URL = "https://github.com/vamsiramakrishnan/ge-agent-factory.git";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback = null) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 && args[index + 1] && !args[index + 1].startsWith("--") ? args[index + 1] : fallback;
};

if (flag("help") || flag("h")) {
  process.stdout.write(`create-ge-agent-factory — bootstrap the GE Agent Factory

usage:
  curl -fsSL https://raw.githubusercontent.com/vamsiramakrishnan/ge-agent-factory/main/packages/create-ge-agent-factory/bin/create-ge-agent-factory.mjs \\
    | bun - -- [dir] [--yes] [--skills claude|agents|gemini] [--skills-dir <path>]

  create-ge-agent-factory [dir] [--yes] [--skills claude|agents|gemini] [--skills-dir <path>]

  [dir]                 where to clone (default ./ge-agent-factory; reused if already a checkout)
  --yes                 actually run the install phases (mise, mise run setup); default prints them
  --skills <target>     symlink the factory skills for an assistant:
                          claude → ~/.claude/skills   agents → ~/.agents/skills
                          gemini → prints the one-line extension install instead
  --skills-dir <path>   explicit skills directory (overrides --skills target)

The installer of record is the repo's own bootstrap skill
(skills/installing-the-factory/SKILL.md) — this command gets you to it.

Note: bare "bunx create-ge-agent-factory" resolves through npm and works only
after the package is published. The raw GitHub command above is the supported
Git-backed path for this monorepo.
`);
  process.exit(0);
}

const say = (line = "") => process.stdout.write(line + "\n");
const run = (cmd, options = {}) => execSync(cmd, { stdio: "inherit", ...options });
const can = (cmd, argv = ["--version"]) => {
  try {
    execFileSync(cmd, argv, { stdio: "ignore", timeout: 30000 });
    return true;
  } catch {
    return false; // best-effort probe: absence just routes to the install instructions
  }
};

// ── phase 0: the repo ────────────────────────────────────────────────────────
const targetArg = args.find((candidate) => !candidate.startsWith("--") && candidate !== opt("skills") && candidate !== opt("skills-dir"));
let repo = resolve(targetArg || "ge-agent-factory");
if (existsSync(join(process.cwd(), "mise.toml")) && existsSync(join(process.cwd(), "tools", "ge.mjs"))) {
  repo = process.cwd(); // already inside a checkout
} else if (!existsSync(join(repo, "mise.toml"))) {
  if (!can("git")) {
    say("✗ git is required to clone the factory. Install git, then re-run.");
    process.exit(1);
  }
  say(`→ cloning ${REPO_URL} into ${repo}`);
  run(`git clone ${JSON.stringify(REPO_URL)} ${JSON.stringify(repo)}`);
} else {
  say(`✓ using existing checkout at ${repo}`);
}

// ── phases 1-3: toolchain + setup (consent-gated) ───────────────────────────
const misePath = existsSync(join(homedir(), ".local", "bin", "mise")) ? join(homedir(), ".local", "bin", "mise") : "mise";
const haveMise = can(misePath);
const haveBun = can("bun");

const phases = [];
if (!haveMise) phases.push(`curl https://mise.run | sh && export PATH="$HOME/.local/bin:$PATH"`);
phases.push(`cd ${repo}`, `mise trust && mise install`, `mise run setup`, `node skills/installing-the-factory/scripts/verify-install.mjs`, `bun tools/ge.mjs prove`);

if (flag("yes")) {
  if (!haveMise) {
    say("→ installing mise (https://mise.run)");
    run(`curl -fsSL https://mise.run | sh`);
  }
  // Resolve the mise invocation ONCE, after any install: prefer whatever is
  // actually on PATH (Homebrew/asdf installs live elsewhere than ~/.local/bin),
  // and only fall back to the canonical install path when PATH has none. Using
  // the same resolved command for trust/install/setup avoids the
  // command-not-found the earlier hardcoded ~/.local/bin/mise caused.
  const localMise = join(homedir(), ".local", "bin", "mise");
  const mise = can("mise") ? "mise" : existsSync(localMise) ? localMise : "mise";
  say("→ provisioning toolchain + installing the factory (mise trust/install, mise run setup)");
  run(`${JSON.stringify(mise)} trust`, { cwd: repo });
  run(`${JSON.stringify(mise)} install`, { cwd: repo });
  run(`${JSON.stringify(mise)} run setup`, { cwd: repo });
  say("→ verifying");
  run(`node skills/installing-the-factory/scripts/verify-install.mjs`, { cwd: repo });
} else {
  say("\nInstall phases (re-run with --yes to execute them, or hand them to your coding agent):\n");
  for (const phase of phases) say(`  ${phase}`);
  if (haveMise && haveBun) say("\n  (mise and bun already present — the toolchain phases will be fast no-ops)");
}

// ── skills exposure ──────────────────────────────────────────────────────────
const skillsTarget = opt("skills-dir") || { claude: join(homedir(), ".claude", "skills"), agents: join(homedir(), ".agents", "skills") }[opt("skills") || ""];
if (opt("skills") === "gemini") {
  say(`\nGemini CLI: install the factory as an extension (ships skills + MCP tools):`);
  say(`  gemini extensions install https://github.com/vamsiramakrishnan/ge-agent-factory`);
} else if (skillsTarget) {
  mkdirSync(skillsTarget, { recursive: true });
  const skillsRoot = join(repo, "skills");
  let linked = 0;
  for (const entry of readdirSync(skillsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !existsSync(join(skillsRoot, entry.name, "SKILL.md"))) continue;
    const dest = join(skillsTarget, entry.name);
    rmSync(dest, { force: true });
    symlinkSync(join(skillsRoot, entry.name), dest);
    linked += 1;
  }
  say(`\n✓ linked ${linked} skill(s) → ${skillsTarget}`);
}

say(`\nNext: open ${join(repo, "skills", "installing-the-factory", "SKILL.md")} — the phase-checked bootstrap your agent can follow end to end.`);
say(`Claude Code users can instead: /plugin marketplace add vamsiramakrishnan/ge-agent-factory && /plugin install factory-bootstrap@ge-agent-factory`);
