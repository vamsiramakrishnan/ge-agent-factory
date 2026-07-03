---
name: doing-the-thing
description: Third-person summary of what this skill operates in the GE Agent Factory. Use when <concrete trigger 1>, <concrete trigger 2>, or <concrete trigger 3>.
---

# Doing The Thing

Use this skill when <the one situation this station owns>.

In plain language: <two or three sentences a non-expert operator would
understand — what this station takes in, what it proves, and why it exists>.

## Assembly-Line Slot

- **First step:** <the check that confirms this skill applies right now>.
- **Plays a role in:** <which stations/stages this sits between>.
- **Input:** <artifacts/state this skill starts from>.
- **Output:** <artifacts/verdicts this skill produces, with paths>.
- **Next step:** <which skill or station consumes the output>.

## Workflow

1. <Read current state — prefer JSON output and artifact files.>
2. <Run the narrowest command that advances or diagnoses the station.>
3. <Read the verdict from the artifact, not the exit code alone.>
4. <Decide the next station and hand off.>

## Commands

```bash
bun tools/ge.mjs <verified command — copy flags from real source, never invent>
```

## Common mistakes

- <A tempting shortcut and why it backfires.>
- <A misread output and what it actually means.>

## Done when

- <The artifact/verdict that proves the station is complete, and where it lives.>

## References

- Read `references/example-session.md` first if this is your first run — a
  worked session (ask → decisions → commands → trimmed real output →
  verdict), with a failure variant.

<!--
After copying this into skills/<name>/SKILL.md:
1. name (frontmatter) must equal the directory name; description must stay
   third person and contain "Use when".
2. Create references/example-session.md and link every references/* and
   scripts/* file from this SKILL.md — the quality auditor fails unlinked files.
3. Add trigger keywords / composes to skills/skill-routing.json (NOT to
   frontmatter) and a capability binding in apps/factory/src/skill-registry.js.
4. Validate: node skills/navigating-factory-line/scripts/audit-skill-quality.mjs
   then mise run skills-sync.
-->
