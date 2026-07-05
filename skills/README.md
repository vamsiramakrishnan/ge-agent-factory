# Harness skills

Reusable, composable skills that teach an agent harness (Antigravity SDK, agents-cli,
or any CLI that reads skills) how to run the GE Agent Factory — interview, build,
simulate, release, deploy, and operate — without bespoke per-run prompting.

Each skill is a directory with a `SKILL.md` (+ optional `references/`, `scripts/`).

## Two layers

- **Station skills** own one assembly-line station: `interviewing-specs`,
  `planning-missions`, `running-factory`, `building-simulators`, `checking-workspaces`,
  `running-release`, `admitting-agents`, `driving-live-proof`, `operating-console`,
  `recording-evidence`, `navigating-factory-line`, `authoring-okf-specs`,
  `enriching-okf-blueprints`, `bringing-your-own`, `observing-runs`.
- **Operator skills** sit on top and run the *operator's* job end to end:
  `installing-the-factory` (the bootstrap: bare machine → verified install —
  self-contained, so an assistant holding only that skill can install
  everything else), `operating-the-factory` (the orchestrator/loop),
  `standing-up-the-platform`, `deploying-the-control-plane`,
  `grounding-interviews-with-documents`, `managing-access`, `triaging-runs`,
  and the shared safety rail `guarding-the-factory`.

## The factory-line matrix

Each skill maps to the `ge` commands it drives, the engine packages behind
those commands, and the reference docs that explain them — rendered from
`skills/skill-routing.json`, `FACTORY_SKILL_BINDINGS`, and the shared command
registry, so the table cannot drift from those sources:

<!-- BEGIN GENERATED: skill-matrix — do not edit; run `bun run docs:skill-matrix` -->
| Station skill | Capability | `ge` commands | Engine packages | Reference docs |
|---|---|---|---|---|
| [`installing-the-factory`](installing-the-factory/) | `factory_install` | `ge doctor`, `ge prove` | — | [`getting-started.md`](../docs/start/getting-started.md) |
| [`navigating-factory-line`](navigating-factory-line/) | `factory_line` | — | — | [`architecture.md`](../docs/reference/architecture.md), [`atomic-capabilities.md`](../docs/reference/atomic-capabilities.md) |
| [`interviewing-specs`](interviewing-specs/) | `spec_interview` | `ge capture`, `ge agents register` | [`@ge/agent-spec`](../packages/agent-spec/) | [`spec-schema.md`](../docs/reference/spec-schema.md) |
| [`planning-missions`](planning-missions/) | `mission_planning` | — | — | — |
| [`running-factory`](running-factory/) | `factory_run` | `ge pipeline run`, `ge daemon start`, `ge prove`, `ge agents build`, `ge agents build --local`, `ge agents sync`, `ge evals compile` | [`@ge/evalkit`](../packages/evalkit/) | [`agent-generation.md`](../docs/reference/agent-generation.md), [`evaluation-generation.md`](../docs/reference/evaluation-generation.md) |
| [`building-simulators`](building-simulators/) | `simulator_build` | `ge data synth`, `ge pipeline run`, `ge daemon start` | [`@ge/synthkit`](../packages/synthkit/) | [`synthetic-data.md`](../docs/reference/synthetic-data.md), [`simulator-systems.md`](../docs/reference/simulator-systems.md) |
| [`checking-workspaces`](checking-workspaces/) | `workspace_check` | — | [`@ge/agent-workspace`](../packages/agent-workspace/) | — |
| [`running-release`](running-release/) | `release_run` | `ge handoff`, `ge handoff plan`, `ge handoff package`, `ge handoff verify-package`, `ge agents status`, `ge agents logs` | — | [`cli.md`](../docs/reference/cli.md) |
| [`admitting-agents`](admitting-agents/) | `release_admission` | `ge passport emit`, `ge passport verify`, `ge passport admit`, `ge handoff` | [`@ge/admission`](../packages/admission/) | [`admission.md`](../docs/reference/admission.md), [`admit-an-agent.md`](../docs/cookbooks/admit-an-agent.md), [`agent-passport-and-proof-pack.md`](../docs/concepts/agent-passport-and-proof-pack.md) |
| [`driving-live-proof`](driving-live-proof/) | `live_proof` | `ge evals compile`, `ge drive`, `ge prove --live`, `ge bench` | [`@ge/evalkit`](../packages/evalkit/) | [`evaluation-generation.md`](../docs/reference/evaluation-generation.md), [`metric-applicability.md`](../docs/reference/metric-applicability.md), [`live-transcript.md`](../docs/reference/live-transcript.md), [`live-budgets.md`](../docs/reference/live-budgets.md) |
| [`operating-console`](operating-console/) | `console_operation` | `ge daemon start` | — | [`console-and-apis.md`](../docs/reference/console-and-apis.md) |
| [`recording-evidence`](recording-evidence/) | `evidence_recording` | — | [`@ge/run-ledger`](../packages/run-ledger/) | — |
| [`operating-the-factory`](operating-the-factory/) | `factory_operation` | `ge agents status`, `ge doctor`, `factory list-usecases` | — | [`agent-operability.md`](../docs/reference/agent-operability.md), [`cli.md`](../docs/reference/cli.md) |
| [`standing-up-the-platform`](standing-up-the-platform/) | `platform_readiness` | `ge up`, `ge data up`, `ge mcp deploy`, `ge doctor`, `ge mcp doctor` | — | [`config.md`](../docs/reference/config.md), [`architecture.md`](../docs/reference/architecture.md) |
| [`deploying-the-control-plane`](deploying-the-control-plane/) | `control_plane_deploy` | — | — | [`architecture.md`](../docs/reference/architecture.md) |
| [`grounding-interviews-with-documents`](grounding-interviews-with-documents/) | `document_grounding` | `ge capture` | — | [`spec-schema.md`](../docs/reference/spec-schema.md) |
| [`managing-access`](managing-access/) | `access_control` | — | — | — |
| [`triaging-runs`](triaging-runs/) | `run_triage` | `ge agents status`, `ge agents logs` | — | — |
| [`guarding-the-factory`](guarding-the-factory/) | `factory_safety` | — | — | — |
| [`authoring-okf-specs`](authoring-okf-specs/) | `knowledge_format` | `ge okf customize`, `ge agents register`, `ge agents track` | [`@ge/okf`](../packages/okf/) | [`okf.md`](../docs/reference/okf.md), [`agent-lifecycle.md`](../docs/reference/agent-lifecycle.md) |
| [`bringing-your-own`](bringing-your-own/) | `byo_customization` | `ge byo doctor`, `ge byo apply`, `ge systems bind`, `ge systems bindings`, `ge systems unbind`, `ge systems synth`, `ge evals import`, `ge models doctor` | [`@ge/byo-systems`](../packages/byo-systems/) | [`bring-your-own-systems.md`](../docs/cookbooks/bring-your-own-systems.md), [`cli.md`](../docs/reference/cli.md) |
| [`observing-runs`](observing-runs/) | `run_observation` | `ge agents status`, `ge agents logs`, `ge agents track`, `ge evals coverage`, `ge doctor`, `ge daemon start` | — | [`agent-operability.md`](../docs/reference/agent-operability.md), [`cli.md`](../docs/reference/cli.md) |
| [`enriching-okf-blueprints`](enriching-okf-blueprints/) | — | `ge okf quality audit`, `ge okf enrich plan`, `ge okf enrich generate`, `ge okf enrich apply`, `ge okf enrich shard`, `ge okf eval verify` | — | [`enrichment-rules.md`](enriching-okf-blueprints/references/enrichment-rules.md) |
<!-- END GENERATED: skill-matrix -->

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
   `skills/skill-routing.json`, not to `SKILL.md` frontmatter — and declare the
   skill's `commands` (command-registry ids), `engines` (`@ge/*` packages), and
   `docs` there too, then regenerate the matrix above with
   `bun run docs:skill-matrix` (validated + drift-checked by `docs:gate`).
   Body: `## Assembly-Line Slot`
   (First step / Plays a role in / Input / Output / Next step), `## Workflow`,
   `## Common mistakes`, `## Done when`. Keep it tight (single responsibility).
2. Bind it in `apps/factory/src/skill-registry.js` (`FACTORY_SKILL_BINDINGS`
   capability→stages→skill, and any `CAPABILITY_ALIASES`).
3. `mise run skills-sync && mise run skills-doctor` (both must pass; the manifest is gitignored —
   never commit `.ge/skills/manifest.json`).
