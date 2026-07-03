# Example session — release a locally-proven agent to Gemini Enterprise

A worked interaction covering the release end of the line: readiness check →
plans → explicit handoff → watch remote stages → artifact-verified verdict.
Local command outputs are real, trimmed; cloud-stage outputs are authored
from the CLI's render code and marked as such — never run those to "see what
happens". Read this when it's unclear which release command comes next or
what counts as proof.

## The ask

> Operator: "ws-account-reconciliation-agent passed local proof and preview
> yesterday. Get it published to Gemini Enterprise — plans first, and don't
> tell me it's live until the artifacts say so."

Constraints extracted: local build → the release is an explicit `ge handoff`
(never implicit); plan artifacts before any cloud stage; success is claimed
from proof artifacts, not from a green submit.

## Step 1 — read where the workspace stands (local, free)

```console
$ node skills/running-release/scripts/summarize-release.mjs .ge/factory/projects/ws-account-reconciliation-agent
{
  "ok": false,
  "missing": [
    "loadReport",
    "deployment",
    "toolRegistration",
    "enterpriseRegistration",
    "liveVerification"
  ],
  "artifacts": {
    "deployPlan": true,
    "publishPlan": true,
    "loadReport": false,
    …
  },
  "next": "continue_release_or_observe_remote_stage"
}
```

Exit code 1 here means "release incomplete", not "error". Decision: this is
the *expected pre-handoff shape* — both plan artifacts exist, and everything
missing is written by cloud stages that have not run yet. If `deployPlan` or
`publishPlan` were also false, stop and write the plans first (step 2); do
not skip the deploy plan.

## Step 2 — write/refresh the plans (local artifact writers, gated, no cloud mutation)

```console
$ node apps/factory/src/cli.js deploy:plan ws-account-reconciliation-agent --target agent_runtime
{
  "ok": true,
  "plan": "artifacts/DEPLOY_PLAN.md",
  "readiness": { …, "deployPlan": { "status": "ready", … } },
  "nextActions": ["publish:plan"]
}
$ node apps/factory/src/cli.js publish:plan ws-account-reconciliation-agent --app-id demo-ge-app
{
  "ok": true,
  "plan": "artifacts/PUBLISH_PLAN.md",
  "readiness": { …, "publishPlan": { "status": "ready", … } },
  "nextActions": ["iterate", "deploy", "publish"]
}
```

(Authored from `apps/factory/src/cli.js` — safe to run for real: both
commands only write `artifacts/deploy-plan.json` / `artifacts/publish-plan.json`
and their markdown twins into the workspace.)

Decision: gates passed and `nextActions` now includes `deploy`/`publish`.
The promotion packet's handoff policy is explicit — "Plan-only after
preview. Do not deploy or publish without explicit approval." — so pause
here and get the operator's go-ahead before anything cloud-side. Operator
approves.

## Step 3 — hand off past the build boundary (cloud-mutating; approval given)

```console
$ bun tools/ge.mjs handoff agents-cli --ids ws-account-reconciliation-agent
  ✓ ws-account-reconciliation-agent → run-mc3k9t2f (from load_data)

Handoff
  target    agents-cli   agents-cli deploy → Agent Engine → Gemini Enterprise
  shipped   1  failed 0   load_data → publish_enterprise, remote

  next  ge agents status --watch   (follow the handoff to done)
```

(Authored from `tools/ge/handoff.mjs` — uploads the workspace tarball to
`gs://<bucket>/prebuilt/<id>/workspace.tar.gz` and submits a remote run;
never run it in an example or dry-run context.) Decisions: the defaults
already say `--start-stage load_data --target-stage publish_enterprise`, so
no stage flags are needed — deploy planning happened locally, which is why
the remote run starts *past* `plan_deploy`. Local repair tools are useless
from here on: the state being advanced is remote.

## Step 4 — watch the remote stages to terminal

```console
$ bun tools/ge.mjs agents status --watch
Status — 1 runs  2026-07-03T09:41:12.417Z
  ✓ done 0   ● running 1   ○ queued 0   ✗ failed 0   unknown 0
  by stage: deploy_runtime:1
…(re-polls every 15s)…
Status — 1 runs  2026-07-03T09:52:41.902Z
  ✓ done 1   ● running 0   ○ queued 0   ✗ failed 0   unknown 0
  by stage: publish_enterprise:1

✓ All runs terminal.
```

(Authored from `tools/ge/agents.mjs`.) Had the tally shown `failed 1`, the
next moves are printed by the command itself: `ge agents resume` (retry
failed stages from the ledger) and `ge agents logs run-mc3k9t2f --stage
deploy_runtime` (pretty-prints that stage's result + errors from
`gs://<bucket>/runs/<runId>/items/<workspaceId>/factory-<stage>-result.json`).

## Step 5 — verify artifacts before claiming success (real)

```console
$ node skills/running-release/scripts/summarize-release.mjs .ge/factory/projects/ws-account-reconciliation-agent
{
  "ok": true,
  "missing": [],
  "artifacts": {
    "deployPlan": true,
    "publishPlan": true,
    "loadReport": true,
    "deployment": true,
    "toolRegistration": true,
    "enterpriseRegistration": true,
    "liveVerification": true
  },
  "next": "record_release_evidence"
}
```

Exit 0. Then spot-read the two artifacts that carry the actual claim —
`gemini_enterprise_registration.json` (which app, which agent id) and
`artifacts/live-verification-report.json` (live smoke verdict) — because a
tally proves presence, not content. "Do not claim publish success from plan
artifact alone" (`references/release-stages.md`).

## Step 6 — report back

> Agent: "ws-account-reconciliation-agent is published: data loaded (see
> `mock_data/cloud/load-report.json`), runtime deployed
> (`deployment_metadata.json`), tools registered
> (`agent_registry_registration.json`), registered in Gemini Enterprise app
> demo-ge-app (`gemini_enterprise_registration.json`), and live verification
> passed (`artifacts/live-verification-report.json`). One handoff run
> (run-mc3k9t2f), load_data → publish_enterprise, zero failures. Recording
> these as release facts in the Evidence Ledger; next step is live-behavior
> proof (driving-live-proof skill)."

The report names each release fact with the artifact that proves it — never
"it's live" from the submit line alone.

## Failure variant — deploy:plan blocked by the workspace doctor gate

```console
$ node apps/factory/src/cli.js deploy:plan ws-account-reconciliation-agent
{
  "ok": false,
  "doctor": {
    "kind": "ge.workspace_doctor",
    "workspace": "ws-account-reconciliation-agent",
    "stage": "deploy:plan",
    "ok": false,
    "blockers": [
      { "id": "promotion:gate", "message": "promotion gate is passing",
        "detail": { "blockers": ["preview report is missing"] } }
    ],
    "repairTasks": [
      { "id": "write-promotion-packet",
        "command": "ge-harness promote:packet <workspace-id>",
        "reason": "preview report is missing" }
    ]
  }
}
```

(Authored from `apps/factory/src/workspace-doctor.js`; exit code 1. A
blocker's `message` states the check that *should* hold.) React by running
the repair task's literal command — here the real gap is upstream (preview
evidence), so the fix routes back to the checking-workspaces station, not
forward. Never work around the gate by calling `ge handoff` anyway: the gate
is what keeps cloud spend behind local proof. The other common first-run
failure is config, not gates — `ge handoff` exits 1 with
`✗ geAppId unset. Add it to .ge.json or set GEMINI_ENTERPRISE_APP_ID.` —
fix `.ge.json` (see `assets/release-target-example.json`), don't retry blind.
