# Skill Quality Rules

These rules keep the factory skills easy for a harness to discover and use.

## Naming

Use short gerund names:

- `interviewing-specs`
- `planning-missions`
- `running-factory`
- `checking-workspaces`

Avoid poetic or architecture-heavy names. The name should describe the activity.

The frontmatter `name` must match the directory exactly, use lowercase letters, numbers, and single hyphens, and stay under 64 characters.

## Description

Descriptions must be third person and specific. They should say what the skill does and when to use it.

Good:

```yaml
description: Checks and repairs generated GE agent workspaces. Use when validating workspace readiness...
```

Avoid:

```yaml
description: Helps with stuff
description: I can help operate the factory
```

Descriptions should include `Use when` trigger language so discovery works from a large skill index.

## Body

Keep `SKILL.md` compact:

- simple plain-language context first
- first step / role / input / output / next step
- scripts and references listed directly
- deeper detail in one-level reference files
- avoid nested references that require following a second reference file
- keep GE-only routing data in `skills/skill-routing.json`, not in `SKILL.md` frontmatter

## Scripts

Scripts should solve a deterministic check:

- validate a mission
- summarize artifacts
- audit coverage
- audit console wiring

They should fail with clear error messages.

## Evals

Skills that own fragile workflows should include `evals/evals.json` with realistic prompts,
expected outputs, and concrete assertions. Keep eval files one level deep under `evals/`.

## Canonical Index

The harness manifest must include every discoverable skill with both the display path and `absolutePath`. Repository skills are the required boot substrate; installed Google Agents CLI skills should still appear so a harness can prove where ADK workflow guidance lives.
