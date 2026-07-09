---
name: installing-the-factory
description: Installs the GE Agent Factory from a bare machine to a proven working install — repo clone, mise bootstrap, toolchain provisioning (Bun, Python, uv, Terraform), dependency install, the ge command on PATH, and a verified first proof — checking each phase before starting the next. Use when setting up the factory on a new machine or fresh clone, when ge, bun, or mise are missing from PATH, when an AI assistant (Claude Code, Antigravity, Codex, Gemini CLI) must self-install the factory before operating it, or when an existing install is broken and needs re-verification.
---

# Installing The Factory

Use this skill to take a machine from nothing to a working, verified GE Agent
Factory install, without asking a human to run setup steps.

In plain language: everything the factory needs is driven by two tools — `mise`
(toolchain + task runner) and `bun` (which mise provisions). Install mise, let
it provision everything else, verify each phase with a real command before
declaring it done, and finish by proving the install works (`ge prove`), not by
assuming it does.

This skill is self-contained on purpose: it can be copied alone into an
assistant's skill directory (`~/.claude/skills/`, `~/.agents/skills/`, or
equivalent) and used on a machine that does not have the repository yet —
phase 0 clones it. All later skills (`operating-the-factory`,
`driving-live-proof`, …) assume this skill's "Done when" holds.

## Assembly-Line Slot

- **First step:** detect what already exists (`git`, `mise`, `bun`, the repo, `ge`) — never reinstall blindly.
- **Plays a role in:** machine bootstrap; precedes every other skill.
- **Input:** a POSIX machine with `git` + `curl` and network access; optionally an existing checkout.
- **Output:** repo present, toolchain provisioned, deps installed, `ge` answering, first proof passed.
- **Next step:** `operating-the-factory` (build and run agents) or `standing-up-the-platform` (cloud planes, remote work).

## Workflow

Run the phases in order. Each phase has a check; if the check passes, skip the
phase — the whole workflow is idempotent and safe to re-run after a failure.

1. **Repo** — check: the working directory (or a chosen parent) contains
   `ge-agent-factory` with `mise.toml` at its root. If not, clone it.
2. **mise** — check: `mise --version` works. If not, install it and add the
   shims to PATH for this shell.
3. **Toolchain + deps + `ge`** — check: `bun --version` works inside the repo
   and `$BIN/ge` exists (default `~/.local/bin/ge`). If not, `mise trust && mise install`, then
   `mise run setup` (installs JS deps, syncs the use-case catalog and skills,
   installs the `ge` command, and starts the local run daemon — the daemon
   step is best-effort and may be skipped in sandboxes).
4. **Verify the install** — `node skills/installing-the-factory/scripts/verify-install.mjs`
   (structured pass/fail for every phase above), then `bun tools/ge.mjs doctor --local`
   for the factory's own readiness view.
5. **Configure** — `bun tools/ge.mjs init` discovers config and writes
   `.ge.json`. Cloud values (project, engine) can stay unset for local work;
   nothing in the local path touches GCP.
6. **First proof** — `bun tools/ge.mjs prove` (health check → first agent
   built and validated from the catalog, all local). This is the install's
   acceptance test: a machine that passes it can run every local skill.
7. **Hand over** — continue with `operating-the-factory` (or
   `driving-live-proof` for live verification of a deployed agent).

## Commands

Phase 0 — repo (skip if already inside a checkout):

```bash
git clone https://github.com/vamsiramakrishnan/ge-agent-factory.git
cd ge-agent-factory
```

Phase 1 — mise (skip if `mise --version` works):

```bash
curl https://mise.run | sh
export PATH="$HOME/.local/bin:$PATH"   # mise's default install target
eval "$(mise activate bash)"           # or zsh; per-shell activation
```

Phase 2 — toolchain, dependencies, `ge`:

```bash
mise trust && mise install    # provisions Bun, Python, uv, Terraform (pinned)
mise run setup                # bun install → catalog + deps + ge install + skills-sync + daemon
```

Phase 3 — verify (structured; exits non-zero with what/fix on any failure):

```bash
node skills/installing-the-factory/scripts/verify-install.mjs
bun tools/ge.mjs doctor --local
```

Phase 4/5 — configure and prove:

```bash
bun tools/ge.mjs init
bun tools/ge.mjs prove
```

Assistant-specific skill exposure (optional, after install):

```bash
mise run skills-install                          # symlink all skills → ~/.agents/skills (Antigravity/agents-cli/Codex)
AGENTS_SKILLS_DIR=~/.claude/skills mise run skills-install   # same, for Claude Code's skill directory
```

## Common mistakes

- Declaring success after `mise run setup` prints "Setup done." — the daemon
  start is best-effort (`|| true`); only `verify-install.mjs` + `ge doctor
  --local` + `ge prove` prove the install.
- Installing Bun/Terraform globally by hand — versions are pinned by mise;
  hand-installs drift and shadow the pinned ones.
- Running `mise run setup` before `mise trust` in a fresh clone — mise refuses
  untrusted config; trust the repo's `mise.toml` first.
- Skipping `ge init` and then treating cloud-config errors as install
  failures — a missing project/engine is configuration, not a broken install;
  the local path needs neither.
- Re-cloning into a nested checkout when a repo already exists — always detect
  first (phase checks), the workflow is idempotent.

## Done when

- `mise --version`, `bun --version`, and `$BIN/ge` (default
  `~/.local/bin/ge`) all resolve inside the repo.
- `node skills/installing-the-factory/scripts/verify-install.mjs` exits 0.
- `bun tools/ge.mjs doctor --local` reports the local toolchain green.
- `bun tools/ge.mjs prove` passes its first proof.
- The operator (human or assistant) has been pointed at `operating-the-factory` for what comes next.

## References

- Read `references/example-session.md` first on a bare machine — the whole bootstrap conversation (detect → provision → verify → prove) with real verifier output, including the phase-check failure variant and how to react to it.
- Read `references/machine-setup.md` for what each phase provisions, the environment variables that redirect installs (`BIN`, `GE_STATE_ROOT`, …), PATH/sandbox/proxy notes, and uninstall.
- Run `scripts/verify-install.mjs` (plain node, no repo deps) whenever install state is in doubt — one ✓/✗/○ line per phase with the exact fix, `--json` for machines.
