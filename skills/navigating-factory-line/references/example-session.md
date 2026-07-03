# Example session — prove the skill map before handing the line to a fresh harness

A worked interaction showing the navigation-layer audit loop: coverage →
quality → spec portability → manifest sync. Outputs are real, trimmed. Read
this when it's unclear which auditor answers which question or what "good"
output looks like.

## The ask

> Operator: "A fresh harness takes over the factory line tomorrow. Prove the
> skill map is complete, every skill it might load is well-formed, and the
> manifest it boots from is current — before we automate anything."

Constraints extracted: this is a navigation-layer question, not a station
question — no factory runs, no cloud. Everything needed is the three local
auditors plus the manifest sync; all deterministic, all free.

## Step 1 — coverage: is every station mapped to a skill?

```console
$ node skills/navigating-factory-line/scripts/audit-skill-coverage.mjs
{
  "ok": true,
  "skills": [
    { "name": "navigating-factory-line", "exists": true },
    { "name": "interviewing-specs", "exists": true },
    …
  ],
  "stages": [
    { "name": "user_interview", "mapped": true },
    …
    { "name": "verify_live", "mapped": true }
  ]
}
```

Decision: `ok: true` → every required skill exists and every factory stage
has a row in `references/stage-skill-map.md`. If a stage showed
`"mapped": false`, stop and fix the map before automating — per the coverage
rule, an unmapped station means the harness has no named next move there.

## Step 2 — quality: is each skill shaped for progressive disclosure?

```console
$ node skills/navigating-factory-line/scripts/audit-skill-quality.mjs
{
  "ok": true,
  "results": [
    { "skill": "driving-live-proof", "ok": true, "issues": [] },
    { "skill": "navigating-factory-line", "ok": true, "issues": [] },
    …
  ]
}
```

Reading it: one entry per skill directory; any `issues` string names the
exact defect (missing example session, unlinked reference/script, SKILL.md
over 250 lines, nested resources). Exit code is nonzero if anything fails —
`skills-sync` runs this auditor first and refuses to write the manifest
while it is red (see the failure variant below).

## Step 3 — spec portability: will the skills load outside this repo?

```console
$ node skills/navigating-factory-line/scripts/audit-agent-skills-spec.mjs
{
  "ok": true,
  "strictOk": false,
  "summary": {
    "roots": ["skills"],
    "skills": 19,
    "errors": 0,
    "warnings": 20,
    "missingEvals": 18,
    "nonportableFrontmatter": 1,
    …
  },
  "routing": { "path": "skills/skill-routing.json", "issues": [] },
  …
}
```

Decisions made here:

- `errors: 0` → nothing violates the Agent Skills spec; the skills are
  portable. Errors (bad name, oversize description, frontmatter mismatch)
  would block; warnings (`evals:missing`, `frontmatter:nonportable-key`) are
  triage items, not blockers.
- `routing.issues: []` → `skills/skill-routing.json` parses and every
  trigger/compose target names a real skill directory.
- For a hard gate (CI, release), rerun with `--strict` — it exits nonzero
  while any warning remains. `--all` widens to mirrored/legacy skill roots.

## Step 4 — sync the manifest the harness boots from

```console
$ node scripts/sync-harness-skills.mjs
Synced 19 harness skills -> .ge/skills/manifest.json
```

The sync reruns the quality and coverage auditors internally, then writes
`.ge/skills/manifest.json` and `.ge/skills/env.sh` (both gitignored, never
committed). `mise run skills-doctor` (which runs the sync with `--check`)
proves the manifest is current without rewriting it.

## Step 5 — report back

> Agent: "The line is ready for a fresh harness: all 18 factory stages map
> to an existing skill (coverage ok), every skill passes the quality audit,
> the spec-portability audit shows 0 errors (20 warnings, mostly missing
> `evals/` suites — logged for follow-up, not blockers), and the harness
> manifest is freshly synced at `.ge/skills/manifest.json` with routing
> intact. Nothing left the machine — all three auditors and the sync are
> local and deterministic."

The report names which auditor proved what, separates errors from warnings,
and says where the manifest lives — never "skills look fine" without the
audit artifacts.

## Failure variant — quality audit red, manifest sync refused

A skill gained a script that SKILL.md never mentions, and has no worked
example session. The sync fails closed:

```console
$ node scripts/sync-harness-skills.mjs
skills/navigating-factory-line/scripts/audit-skill-quality.mjs failed:
{
  "ok": false,
  "results": [
    …
    {
      "skill": "navigating-factory-line",
      "ok": false,
      "issues": [
        "missing references/example-session.md (worked example interaction — progressive disclosure L2)",
        "scripts/audit-agent-skills-spec.mjs is on disk but never mentioned in SKILL.md — unlinked context is unreachable"
      ]
    }
  ]
}
```

Do NOT delete the flagged script or hand-write the manifest to get green.
Each issue string is the fix instruction: add the missing
`references/example-session.md` (a worked ask → commands → output → verdict
session, like this file), and mention every on-disk `references/*` and
`scripts/*` file from `SKILL.md` with a one-line cue. Then rerun the quality
auditor alone until its entry reads `"ok": true`, and only then rerun the
sync. If the red entry is a skill someone else is actively editing, fix your
own skill's issues and report the other — don't "fix" work mid-edit.
