# Harness skills

Reusable, composable skills that teach an agent harness (Antigravity SDK, agents-cli,
or any CLI that reads skills) how to run the GE Agent Factory — interview, build,
simulate, release, deploy, and operate — without bespoke per-run prompting.

Each skill is a directory with a `SKILL.md` (+ optional `references/`, `scripts/`).

## Two layers

- **Station skills** own one assembly-line station: `interviewing-specs`,
  `planning-missions`, `running-factory`, `building-simulators`, `checking-workspaces`,
  `running-release`, `operating-console`, `recording-evidence`, `navigating-factory-line`.
- **Operator skills** sit on top and run the *operator's* job end to end:
  `operating-the-factory` (the orchestrator/loop), `standing-up-the-platform`,
  `deploying-the-control-plane`, `grounding-interviews-with-documents`,
  `managing-access`, `triaging-runs`, and the shared safety rail `guarding-the-factory`.

## Composition

Machine routing lives in `skills/skill-routing.json`, not portable `SKILL.md`
frontmatter. That sidecar records GE-specific trigger keywords and composition
edges, is parsed by `apps/ge-demo-generator/src/skill-registry.js`, written into the
synced manifest, and rendered into the agent's context — so `operating-the-factory`
pulls in the stations it conducts, and risky stations pull in `guarding-the-factory`.
Selection also works by **capability/stage bindings** (`FACTORY_SKILL_BINDINGS`),
**capability aliases** (`CAPABILITY_ALIASES` — the `operating` alias pulls the whole
conductor set), and routing-file trigger matching in the run message.

## How the harness loads them (auto)

Per run, `apps/ge-demo-generator/src/harness-runner.js`:
1. `loadSkillRegistry()` discovers everything under `skills/`.
2. `selectSkillsForContext({ capabilities, stages, message })` picks the relevant set.
3. `materializeSkillsForWorkspace()` copies them into the run's `.ge-harness/skills/`.
4. `renderSkillInstructions()` injects "read and follow these skills" into the agent.

So for factory/Antigravity runs there is no manual install — just keep the manifest current.

## Headless install + run

```bash
make skills-sync       # validate + write .ge/skills/{manifest.json,env.sh}
make skills-doctor     # verify the manifest is current + skills are discoverable

# Optional: expose the skills to a bare agent harness (Antigravity/agents-cli/Codex/Gemini)
# by symlinking them into the cross-runtime dir it scans (default ~/.agents/skills):
make skills-install                                  # or: AGENTS_SKILLS_DIR=/path make skills-install

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

`make skills-install` symlinks (so edits propagate); `AGENTS_SKILLS_DIR` overrides the
target. Note: this repo's own registry loads operator/station skills from `skills/`
directly — `~/.agents/skills/` matters only when a *non-factory* harness is the driver.

## Authoring a new skill

1. Create `skills/<verb-phrase>/SKILL.md` with spec-portable frontmatter `name` and
   `description` (must contain "Use when …" — the quality auditor enforces it).
   Add GE-specific trigger keywords and composed sub-skills to
   `skills/skill-routing.json`, not to `SKILL.md` frontmatter. Body: `## Assembly-Line Slot`
   (First step / Plays a role in / Input / Output / Next step), `## Workflow`,
   `## Common mistakes`, `## Done when`. Keep it tight (single responsibility).
2. Bind it in `apps/ge-demo-generator/src/skill-registry.js` (`FACTORY_SKILL_BINDINGS`
   capability→stages→skill, and any `CAPABILITY_ALIASES`).
3. `make skills-sync && make skills-doctor` (both must pass; the manifest is gitignored —
   never commit `.ge/skills/manifest.json`).
