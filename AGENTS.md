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

For a guided, verified bootstrap (phase checks, structured failure fixes,
first proof), follow the skill at
[`skills/installing-the-factory/SKILL.md`](skills/installing-the-factory/SKILL.md)
— it's self-contained, so it also works copied alone into an assistant's
skill directory on a machine that doesn't have this repo yet.

## Skills — how an assistant learns to run this factory

Every operator job is packaged as a skill under [`skills/`](skills/README.md):
install (`installing-the-factory`), operate end to end
(`operating-the-factory`), stand up cloud planes, build, check, release,
drive/verify the live agent (`driving-live-proof`), triage. Factory-run
harnesses load them automatically. To expose them to an external assistant:

```bash
mise run skills-install                                      # → ~/.agents/skills (Antigravity, agents-cli, Codex)
AGENTS_SKILLS_DIR=~/.claude/skills mise run skills-install   # → Claude Code's skill directory
```

Distribution surfaces (no checkout needed): `bunx create-ge-agent-factory`
(npm bootstrap — clones, installs, verifies, links skills); Claude Code
plugin marketplace (`/plugin marketplace add vamsiramakrishnan/ge-agent-factory`,
then `factory-bootstrap` or `factory-operator` — manifest in
`.claude-plugin/marketplace.json`); Gemini CLI extension
(`gemini extensions install <repo url>` — `gemini-extension.json` +
`GEMINI.md` ship the skills and the MCP server).

The catalog + trigger routing lives in `skills/skill-routing.json`; the
`factory_*` MCP tools (`bun tools/mcp-server.mjs`, registry-derived) are the
matching action surface for MCP-capable assistants.

## Before you commit — the gate

Run this before every commit; it's cheap (seconds) and CI enforces it:

```bash
bun run source:hygiene && node tools/check-design-tokens.mjs
```

`source:hygiene` is the full chain: source hygiene, layering guards (both
directions), harness-schema drift, the frozen apps→tools/lib import surface,
the silent-catch policy, and `.ge.schema.json` drift. All of it is enforced
in CI too.

If you touched `docs/`, also run `bun run docs:gate` (link/image/blockquote
correctness, diagram drift, design-token drift, the language & copy gate —
register rules and the banned-phrase list per
[`docs/LANGUAGE.md`](docs/LANGUAGE.md), enforced by `tools/lang-gate.mjs` —
plus the generated-region checks: the `ge` CLI reference, the stage-graph diagram, the spec-schema
field tables, the console-API registry table, and the skill matrix (in
`skills/README.md` and `docs/reference/architecture.md`) are rendered from
source — regenerate with `bun run docs:cli`, `bun run docs:stage-diagram`,
`bun run docs:spec-ref`, `bun run docs:console-api`,
`bun run docs:skill-matrix`, and diagrams with `bun run docs:diagrams`). See
[`docs/DESIGN.md`](docs/DESIGN.md) for the diagram/callout authoring
conventions, including a silent-failure gotcha in the Mermaid renderer that's
worth reading before adding a new diagram.

The public docs website renders `docs/` through Astro/Starlight
(`apps/docs`, see its README). It syncs content at build time, so editing an
existing `docs/*.md` page needs nothing extra — but a **new top-level**
`docs/*.md` page needs a `PAGE_MAP` entry in
`apps/docs/scripts/sync-content.mjs`, and `bun run docs:site:build` proves
the site (and its link rewriting) still builds.

Then `bun run test:gated` (`node tools/check-test-results.mjs`) for the full
suite — it runs one `bun test` per directory shard (each app under `apps/`,
plus `tools/` and `packages/`; see `planTestShards` in
`tools/lib/test-results.mjs` for why a single repo-root scan is not safe
under a 4096 file-descriptor rlimit), merges the shards' JUnit reports,
cross-references failures against the checked-in
`tools/known-test-failures.json`, and exits non-zero **only** if a test
fails that isn't already in that list. That replaces the old "judge by the
set of failing test names, not the raw count" manual practice with a
structural check: a name you don't recognize is a regression by construction
(the tool will tell you), a name already in the list is not yours to fix. If
a known-failing test starts passing, the tool reports it separately
(informational) — trim it from `known-test-failures.json` once you've
confirmed why. The list is currently empty; keep it that way by preferring a
hermetic-test or code fix over parking a new entry.

A test file that uses `node:test`'s `describe()`/`test()` can crash outright
under Bun — instead of failing individual tests — when the run also loads the
`bun:test` symbols the root `[test].preload` pulls in ([bun#5090](https://github.com/oven-sh/bun/issues/5090)).
A file in that state is invisible to `check-test-results.mjs`'s name-based
comparison; the tool warns about the resulting count mismatch but can't fully
close the gap. Prefer `bun:test` for new test files to stay clear of this
(`packages/runtime/src/index.test.mjs` was the known offender and has been
moved onto `bun:test` for exactly this reason). If the count-mismatch warning
fires, check the raw `bun test` console output for a file that crashed rather
than failed. The gate also retries newly-failing test *files* exactly once
(logged) to absorb the known subprocess-load flakes — a real regression fails
twice.

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
(`@ge/capability-registry`, validated against the `@ge/core-api` capability
contract at import time) — a route/CLI-invocation/risk-level triple per
command, dispatched through one job-runner. Before adding a new
`/api/*` route for a console action, check whether the underlying `ge`/
`factory` command already exists and just needs a registry entry (see
`daemon.start` for a recent example) rather than bespoke route logic.

## Everything else

Repo layout, branch/commit conventions, running one app locally, skills,
specs/OKF, simulators — all in [`CONTRIBUTING.md`](CONTRIBUTING.md). Jargon
(harness, OKF, canary, planes, etc.) — [`docs/GLOSSARY.md`](docs/GLOSSARY.md).
Task-oriented walkthroughs — [`docs/cookbooks/`](docs/cookbooks/).
