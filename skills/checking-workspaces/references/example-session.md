# Example session — get a blocked workspace through the preview gate

A worked interaction showing the whole loop: doctor → read blockers →
deterministic repair → re-check → verdict. Outputs are real, trimmed. Read
this when it's unclear which command comes next or what "good" output looks
like.

## The ask

> Operator: "The factory line says workspace `doctor-1783063688680` is
> blocked at preview. Figure out why and get it through the gate — without
> weakening anything."

Constraints extracted: target gate is `preview`; repair, don't bypass —
no editing gate producers, no deleting blockers.

## Step 1 — run doctor for the target gate

Never start by editing code. The doctor converts "something is wrong" into
blocker ids and repair tasks:

```console
$ node apps/factory/src/cli.js workspace doctor doctor-1783063688680 --stage preview
{
  "kind": "ge.workspace_doctor",
  "workspace": "doctor-1783063688680",
  "stage": "preview",
  "ok": false,
  …
  "summary": { "total": 9, "passed": 4, "failed": 5 },
  "blockers": [
    { "id": "validation:report",  "message": "artifacts/validation-report.json exists" },
    { "id": "validation:passing", "message": "validation report is passing" },
    { "id": "trace:artifact",     "message": "artifacts/spec-code-trace.json exists" },
    { "id": "trace:passing",      "message": "spec-to-code trace is passing" },
    { "id": "readiness:tests",    "message": "tests readiness is passing" }
  ],
  "repairTasks": [
    { "id": "run-validation",   "command": "ge-harness validate <workspace-id>", "owner": "generator" },
    { "id": "repair-spec-code", "command": "ge-harness validate <workspace-id>", "owner": "harness" }
  ]
}
```

Exit code is 1 on a failing gate; the same report lands in
`artifacts/workspace-doctor.json` (+ `artifacts/WORKSPACE_DOCTOR.md`).

Decision from the blocker prefixes (see `references/blocker-taxonomy.md`):
`contract:*` passes and `validation:*`/`trace:*` artifacts are simply
*missing* — the workspace was generated but never validated. That is
deterministic-repair territory (`run-validation`), not a code defect. If
`contract:required_files` had failed instead, repair could not rebuild it —
see the failure variant below.

## Step 2 — deterministic repair first

`--agent none` runs only the deterministic executors (re-validate, re-plan,
re-package); harness-assisted code repair stays off:

```console
$ node apps/factory/src/cli.js workspace repair doctor-1783063688680 --stage preview --agent none --attempts 3
{
  "kind": "ge.workspace_repair",
  "workspace": "doctor-1783063688680",
  "stage": "preview",
  "ok": true,
  …
  "attempts": [
    { "index": 1, "doctor": { "ok": false, "summary": { "failed": 5 } },
      "actions": [
        { "taskId": "run-validation",   "ok": true,  "summary": "validation passed" },
        { "taskId": "repair-spec-code", "ok": false, "skipped": true,
          "summary": "harness repair disabled by --agent none" } ] },
    { "index": 2, "doctor": { "ok": true, "summary": { "failed": 0 } }, "actions": [] }
  ],
  "finalDoctor": { "ok": true, … },
  "nextRepairTasks": []
}
```

Reading the attempts:

- Attempt 1 ran `run-validation`, which wrote a passing
  `artifacts/validation-report.json` and `artifacts/spec-code-trace.json`.
- `repair-spec-code` reporting `skipped … disabled by --agent none` is
  expected, not a failure — it only matters if blockers survive the
  deterministic pass.
- Attempt 2's doctor found 0 blockers, so the loop stopped early;
  `finalDoctor.ok: true` is the verdict that counts.

## Step 3 — confirm with the gate summary

```console
$ node skills/checking-workspaces/scripts/summarize-gate.mjs .ge/factory/workspaces/doctor-1783063688680
{
  "ok": true,
  "workspace": "doctor-1783063688680",
  "stage": "preview",
  "artifacts": {
    "workspace": true, "doctor": true, "repair": true,
    "validation": true, "specCodeTrace": true,
    "promotion": false, "deployPlan": false, "publishPlan": false
  },
  "blockers": [],
  "repairAttempts": 2
}
```

`promotion`/`deployPlan`/`publishPlan` still `false` is fine — those
artifacts belong to later gates, and the preview gate does not require them.

## Step 4 — report back

> Agent: "Preview gate is green for `doctor-1783063688680`: doctor went
> 4/9 → 9/9 after one deterministic repair pass (`run-validation` rebuilt
> the missing validation report and spec-code trace; no code was edited,
> no gates weakened). Evidence: `artifacts/workspace-doctor.json`,
> `artifacts/workspace-repair.json` (2 attempts), `artifacts/validation-report.json`,
> `artifacts/spec-code-trace.json`. Next station: `preview <workspace-id>`,
> then `promote:packet`."

The report names the gate, what changed, what was *not* touched, and where
the evidence lives — never "fixed" without artifact paths.

## Failure variant — repair blocked, escalate upstream

Same commands on a workspace whose generated code is actually broken
(`app/tools.py` missing). Deterministic repair cannot rebuild code, so the
run exits 1 with the truth intact:

```console
$ node apps/factory/src/cli.js workspace repair ws-benefits-agent --stage preview --agent none --attempts 3
{
  "ok": false,
  …
  "attempts": [
    { "index": 1, "doctor": { "ok": false, "summary": { "failed": 7 } },
      "actions": [
        { "taskId": "regenerate-workspace", "ok": false, "skipped": true,
          "summary": "No executor registered for regenerate-workspace" },
        { "taskId": "run-validation",   "ok": false, "summary": "validation failed" },
        { "taskId": "repair-spec-code", "ok": false, "skipped": true,
          "summary": "harness repair disabled by --agent none" } ] }
  ],
  "finalDoctor": { "ok": false, "blockers": [
    { "id": "contract:required_files", "message": "required workspace files exist",
      "detail": { "missing": ["app/tools.py"] } },
    { "id": "readiness:agent",    "message": "agent readiness is ready" },
    { "id": "validation:passing", "message": "validation report is passing" },
    { "id": "trace:passing",      "message": "spec-to-code trace is passing",
      "detail": { "blockers": [
        "intent not fully implemented: query_workday_employees",
        "intent not fully implemented: query_benefits_platform_enrollments",
        "intent not fully implemented: action_benefits_platform_enroll" ] } },
    { "id": "readiness:tests",    "message": "tests readiness is passing" } ] },
  "nextRepairTasks": [
    { "id": "regenerate-workspace", "command": "ge-harness create --usecase <id> --name <name>",
      "reason": "Required workspace files are missing.", "owner": "generator" },
    … ]
}
```

How to react — in order:

1. `contract:required_files` is the root blocker; the `validation:*` and
   `trace:*` failures are downstream of it. Fix the first prefix in the
   taxonomy order, not the loudest message.
2. Its repair task is `regenerate-workspace` with `owner: generator` and
   *no executor* — deterministic repair is the wrong tool by construction.
   Either regenerate (`ge-harness create …`) or, if the file was damaged by
   a refinement step, try harness-assisted repair:
   `workspace repair <id> --stage preview --agent antigravity-sdk --attempts 3`.
3. Do NOT hand-write a stub `app/tools.py` to turn the check green — the
   `trace:passing` blockers name three spec intents with no implementation;
   a stub converts an honest contract failure into a silent behavior gap.
4. Apply the upstream rule: the same blocker id with a similar message on
   3+ workspaces means the generator, not this workspace, is the defect
   owner. Record the signature for the Evidence Ledger — copy
   `assets/blocker-signature-example.json` as the starting event — and
   recommend the upstream fix instead of repairing workspace by workspace.
