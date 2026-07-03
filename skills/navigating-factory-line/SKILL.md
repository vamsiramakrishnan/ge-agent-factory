---
name: navigating-factory-line
description: Use when operating the full GE Agent Factory line end to end, choosing the right skill for the current step, moving from interview to spec to build to gates to release, and explaining what happens next in simple terms.
---

# Factory Line

Use this skill when a harness needs to run or reason about the whole factory from user interview to live verification.

In plain language: this is the map of the factory floor. It tells the harness where it is, which skill to use, what result proves the step is done, and what should happen next. The CLI and console are user-facing controls; a harness may operate them, but it should always explain the step in human terms.

## First Step

Identify the current station:

- user idea or interview
- spec exists
- mission exists
- factory plan exists
- workspace generated
- gate blocked
- local build ready for cloud
- remote run active
- deploy/publish in progress
- evidence/learning needed

Then read `references/stage-skill-map.md` and load the skill named for that station.

## Assembly-Line Role

- **Plays a role in:** the whole line from raw use case to published/live-verified agent.
- **Input:** user intent, CLI/console output, mission contracts, workspace artifacts, factory run status, and evidence events.
- **Output:** the next skill, next command, expected artifact, and next station.
- **Next step:** run the selected station skill and feed its result back into this map.

## Operating Loop

1. Read current state from CLI, console API, or artifacts.
2. Find the station in `references/stage-skill-map.md`.
3. Load the station skill.
4. Run the narrowest command that advances or diagnoses that station.
5. Prefer JSON output and artifact files over terminal prose.
6. Decide the next station from the output.
7. Record important facts through `recording-evidence`.

## Scripts

Audit skill coverage for every factory stage:

```bash
node skills/navigating-factory-line/scripts/audit-skill-coverage.mjs
```

Audit skill authoring quality:

```bash
node skills/navigating-factory-line/scripts/audit-skill-quality.mjs
```

Audit Agent Skills spec portability (frontmatter, layout, routing file; `--strict` fails on warnings, `--all` includes mirrored skill roots):

```bash
node skills/navigating-factory-line/scripts/audit-agent-skills-spec.mjs
```

## References

- Read `references/example-session.md` first if this is your first pass over the skill map — a worked session (coverage → quality → spec audit → manifest sync), with real output and a red-audit failure variant.
- Read `references/stage-skill-map.md` for the stage-to-skill coverage matrix.
- Read `references/harness-cli-loop.md` for how a harness should operate CLI/console surfaces.
- Read `references/skill-quality-rules.md` before changing skill names, descriptions, references, or scripts.
- Read `references/evaluation-scenarios.md` when testing whether a fresh harness can choose the right skill.
- Copy `assets/skill-template.md` as the starting `SKILL.md` when authoring a new station skill — a skeleton that passes the quality auditor, with the routing/binding checklist inline.
