# Working in this repo as an agent

This file is for autonomous/agentic sessions (Claude Code, Cursor, Codex, or
similar). It's deliberately short — depth lives in
[`CONTRIBUTING.md`](CONTRIBUTING.md), [`SETUP.md`](SETUP.md), and
[`docs/developers.md`](docs/developers.md); read those for the full picture.
This file exists for the handful of things that aren't written down anywhere
else and will bite you if you don't know them going in.

## Bootstrap

```bash
curl https://mise.run | sh   # once, if you don't have mise
mise run setup                # provisions Bun/Python/uv/Terraform, deps, `ge`, daemon
mise tasks                    # every task, with descriptions
```

`mise run <task>` is the task runner (there is no `Makefile` — it was replaced
wholesale). `ge` is the operator CLI mise installs onto `PATH`. `factory` is
the lower-level generator engine `ge`/the console drive per-stage — you rarely
invoke it directly.

## Before you commit — the gate

Run this before every commit; it's cheap (seconds) and CI enforces it:

```bash
node tools/source-hygiene.mjs && node tools/check-no-app-imports.mjs && node apps/factory/scripts/gen-harness-schemas.mjs --check
```

Then `bun test apps tools packages` for the full suite. **Judge test health by
the *set of failing test names*, not the raw count.** This repo has a small,
stable set of pre-existing failures unrelated to most changes (missing Python
`simulator_runtime` module, `antigravity-sdk` harness unavailable in this
environment, a couple of skill-registry/harness-config tests) — the count
shifts slightly as other work lands, but the *names* don't. If you see a
failing test name you don't recognize, that's a regression; if it's already in
the known set, it's not yours to fix.

## Layering rule

`tools/lib/*` (the shared operator core) must never import from `apps/*`.
`node tools/check-no-app-imports.mjs` enforces this — it's part of the gate
above, not a suggestion.

## Golden/parity-oracle tests are byte-exact on purpose

Several test files compare generator output against checked-in fixtures
byte-for-byte (search for `-golden.test` / `parity-oracle`). If one fails after
your change, the fixture is very likely correct and your change broke
determinism — don't "fix" the test by regenerating the fixture unless you've
confirmed the *new* output is actually right.

## If you're running multiple agents/worktrees in parallel

**Never use `git stash`.** Worktrees in this repo share a single stash stack
across concurrently-running sessions — one agent's `git stash pop` can pop
(and appear to lose) a different agent's uncommitted work. If you need to
shelve something, commit it to a throwaway branch instead.

## Code convention: return/throw, don't print/exit, from library code

`tools/lib/*` and `apps/factory/scripts/factory.mjs`'s command handlers return
data on success and throw on failure — they don't `console.log` JSON or
`process.exit()` directly. A single boundary (`ge.mjs`'s `emit()`, or
`factory/registry.mjs`'s `dispatch()`) renders JSON for non-TTY/subprocess
callers (byte-identical, no flags needed) and a short human-readable summary
at a real terminal. Follow this shape for new commands — it's what makes them
composable in-process instead of forced through a subprocess.

## Don't invent new backend endpoints casually

The console, CLI, and MCP server share one command registry
(`tools/lib/ge-command-registry.mjs`) — a route/CLI-invocation/risk-level
triple per command, dispatched through one job-runner. Before adding a new
`/api/*` route for a console action, check whether the underlying `ge`/
`factory` command already exists and just needs a registry entry (see
`daemon.start` for a recent example) rather than bespoke route logic.

## Everything else

Repo layout, branch/commit conventions, running one app locally, skills,
specs/OKF, simulators — all in [`CONTRIBUTING.md`](CONTRIBUTING.md). Jargon
(harness, OKF, canary, planes, etc.) — [`docs/GLOSSARY.md`](docs/GLOSSARY.md).
Task-oriented walkthroughs — [`docs/cookbooks/`](docs/cookbooks/).
