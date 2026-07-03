# Harness skills

Reusable, composable skills that teach an agent harness (Antigravity SDK, agents-cli,
or any CLI that reads skills) how to run the GE Agent Factory — interview, build,
simulate, release, deploy, and operate — without bespoke per-run prompting.

Each skill is a directory with a `SKILL.md` (+ optional `references/`, `scripts/`).

## Two layers

- **Station skills** own one assembly-line station: `interviewing-specs`,
  `planning-missions`, `running-factory`, `building-simulators`, `checking-workspaces`,
  `running-release`, `driving-live-proof`, `operating-console`, `recording-evidence`,
  `navigating-factory-line`.
- **Operator skills** sit on top and run the *operator's* job end to end:
  `installing-the-factory` (the bootstrap: bare machine → verified install —
  self-contained, so an assistant holding only that skill can install
  everything else), `operating-the-factory` (the orchestrator/loop),
  `standing-up-the-platform`, `deploying-the-control-plane`,
  `grounding-interviews-with-documents`, `managing-access`, `triaging-runs`,
  and the shared safety rail `guarding-the-factory`.

## Composition

Machine routing lives in `skills/skill-routing.json`, not portable `SKILL.md`
frontmatter. That sidecar records GE-specific trigger keywords and composition
edges, is parsed by `apps/factory/src/skill-registry.js`, written into the
synced manifest, and rendered into the agent's context — so `operating-the-factory`
pulls in the stations it conducts, and risky stations pull in `guarding-the-factory`.
Selection also works by **capability/stage bindings** (`FACTORY_SKILL_BINDINGS`),
**capability aliases** (`CAPABILITY_ALIASES` — the `operating` alias pulls the whole
conductor set), and routing-file trigger matching in the run message.

## How the harness loads them (auto)

Per run, `apps/factory/src/harness-runner.js`:
1. `loadSkillRegistry()` discovers everything under `skills/`.
2. `selectSkillsForContext({ capabilities, stages, message })` picks the relevant set.
3. `materializeSkillsForWorkspace()` copies them into the run's `.ge-harness/skills/`.
4. `renderSkillInstructions()` injects "read and follow these skills" into the agent.

So for factory/Antigravity runs there is no manual install — just keep the manifest current.

## Headless install + run

```bash
mise run skills-sync       # validate + write .ge/skills/{manifest.json,env.sh}
mise run skills-doctor     # verify the manifest is current + skills are discoverable

# Optional: expose the skills to a bare agent harness (Antigravity/agents-cli/Codex/Gemini)
# by symlinking them into the cross-runtime dir it scans (default ~/.agents/skills):
mise run skills-install                                  # or: AGENTS_SKILLS_DIR=/path mise run skills-install

# Drive the factory headless (no console) — same path the console uses:
source .ge/skills/env.sh
ge daemon start
curl -s localhost:17654/api/tasks -X POST -H 'content-type: application/json' -d '{
  "kind":"harness.run",
  "input":{"agent":"antigravity-sdk","workspaceDir":".",
           "stage":"interview,spec_generation,mock_data,simulation,eval",
           "message":"Operate the factory: get use-case A-306 live. Use the operating-the-factory skill."}}'
# …or expose the factory as MCP for an external model: ge mcp-server
```

`mise run skills-install` symlinks (so edits propagate); `AGENTS_SKILLS_DIR` overrides the
target. Note: this repo's own registry loads operator/station skills from `skills/`
directly — `~/.agents/skills/` matters only when a *non-factory* harness is the driver.

## Progressive disclosure — the four levels

A skill is read lazily; structure it so each level costs context only when it
earns it. The quality auditor
(`skills/navigating-factory-line/scripts/audit-skill-quality.mjs`, run by
`skills-sync`) enforces the shape.

- **L0 — frontmatter `description`.** The only text a router/agent sees before
  choosing the skill. Third person, with concrete "Use when …" triggers.
- **L1 — `SKILL.md` body (≤ 250 lines).** The decision layer: slot, workflow,
  the handful of commands you almost always need, common mistakes, done-when.
  Anything an agent needs *only sometimes* moves down a level and is linked.
- **L2 — `references/*.md` (composed detail).** Deep material loaded on
  demand: command/flag matrices, failure catalogs, schema notes — and at
  least one **`references/example-session.md`**: a realistic operator↔agent
  interaction (ask → decisions → commands → trimmed real output → verdict →
  next step) so an agent can pattern-match a whole session, not just a
  command. Every reference file must be linked from `SKILL.md` with a
  one-line "read this when …" cue — an unlinked file is unreachable context.
- **L3 — `scripts/*.mjs` + `assets/`.** Executables an agent runs instead of
  reasoning (preflights, smoke loops — thin wrappers over the `ge` CLI, never
  reimplementations), and copyable starting artifacts (templates, example
  configs) under `assets/`, each mentioned from `SKILL.md`.

## Authoring a new skill

1. Create `skills/<verb-phrase>/SKILL.md` with spec-portable frontmatter `name` and
   `description` (must contain "Use when …" — the quality auditor enforces it).
   Add GE-specific trigger keywords and composed sub-skills to
   `skills/skill-routing.json`, not to `SKILL.md` frontmatter. Body: `## Assembly-Line Slot`
   (First step / Plays a role in / Input / Output / Next step), `## Workflow`,
   `## Common mistakes`, `## Done when`. Keep it tight (single responsibility).
2. Bind it in `apps/factory/src/skill-registry.js` (`FACTORY_SKILL_BINDINGS`
   capability→stages→skill, and any `CAPABILITY_ALIASES`).
3. `mise run skills-sync && mise run skills-doctor` (both must pass; the manifest is gitignored —
   never commit `.ge/skills/manifest.json`).
