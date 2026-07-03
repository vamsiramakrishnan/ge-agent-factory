# Example session — turn an overnight fleet failure into ledger facts

A worked interaction showing the whole loop: read the run ledger → pull the
proving artifacts → validate and emit typed events → spot the repeated
signature → recommend the upstream fix. Outputs are real, trimmed. Read this
when it's unclear what a "fact, not narration" report looks like end to end.

## The ask

> Operator: "The overnight fleet build failed on three HR workspaces. Record
> the evidence properly — and tell me whether that's three repairs or one
> upstream bug."

Constraints extracted: the mission's `modeContract` is `local_doctor_repair`
(local mode) → workspace artifacts are readable on disk; the answer must be
artifact-backed facts, never "it looks like the generator".

## Step 1 — establish what ran, from the durable run ledger

```console
$ bun tools/ge.mjs ledger runs
Ledger Runs
  id                 mode   status  items                 updated
  run-20260703-0407  local  failed  3 item(s) · 3 failed  2026-07-03T04:12:41.000Z

$ bun tools/ge.mjs ledger fleet
Ledger Fleet
  status  use case                   workspace              stage
  failed  uc-hr-benefits-exceptions  ws-benefits-agent      validated
  failed  uc-hr-onboarding-docs      ws-onboarding-agent    validated
  failed  uc-hr-leave-policy         ws-leave-policy-agent  validated
```

Two ledgers, one subject: `ge ledger` is the durable *run* ledger (which
run, which stage, what status — add `--json` for the full record); the
Evidence Ledger events emitted below are the typed facts layered on top of
it. Decision: all three items failed at the same stage (`validated`) — that
smells like one defect, but it stays a smell until an artifact proves it.

## Step 2 — pull the proving artifact for each workspace

In local mode the evidence lives under
`.ge/factory/projects/<workspace>/artifacts/`.

```console
$ jq '{ok, failed: [.checks[] | select(.ok == false) | {id, message, foundModel}]}' \
    .ge/factory/projects/ws-benefits-agent/artifacts/validation-report.json
{
  "ok": false,
  "failed": [
    {
      "id": "agent:model_is_gemini_3_5_flash",
      "message": "agent.py uses model='gemini-3.5-flash'",
      "foundModel": "gemini-2.0-flash"
    }
  ]
}
```

The same query against the other two workspaces returns the same failed
check id and the same `foundModel`. Decision: this is a blocker *signature* —
`agent:model_is_gemini_3_5_flash` across 3 workspaces — not three unrelated
breaks. Each workspace still gets its own event, artifact pointer included.

## Step 3 — draft the typed events and validate before emitting

One `blocker.detected` per workspace, shaped per
`references/ledger-contract.md` (start from
`assets/ledger-event-example.json` — it is this exact event). Validate every
event before it goes anywhere:

```console
$ node skills/recording-evidence/scripts/validate-ledger-event.mjs blocker-ws-benefits.json
{
  "ok": true,
  "type": "blocker.detected",
  "subject": {
    "kind": "workspace",
    "id": "ws-benefits-agent"
  },
  "status": "blocked"
}
```

Only after `"ok": true` does the event get appended to the mission's
evidence stream (the contract fixes the event shape, not the storage path —
this mission keeps an NDJSON file next to the mission record):

```console
$ jq -c . blocker-ws-benefits.json >> evidence/mission_hr_q3.ndjson
```

## Step 4 — three workspaces, one signature → recommend the upstream fix

The contract's rule: the same blocker signature in three or more workspaces
stops being a repair problem. Emit `upstream.fix.recommended` naming the
blocker, the affected workspaces, the likely owner, and the evidence event
ids in `causality.parentEventIds` — validated the same way:

```console
$ node skills/recording-evidence/scripts/validate-ledger-event.mjs upstream-fix.json
{
  "ok": true,
  "type": "upstream.fix.recommended",
  "subject": {
    "kind": "blocker",
    "id": "agent:model_is_gemini_3_5_flash"
  },
  "status": "observed"
}
```

## Step 5 — check what the pipeline would do next, and hold it

```console
$ bun tools/ge.mjs ledger plan
Ledger Plan
  action  use case                   stage                  reason
  retry   uc-hr-benefits-exceptions  validated → validated  validated failed — retry
  retry   uc-hr-onboarding-docs      validated → validated  validated failed — retry
  retry   uc-hr-leave-policy         validated → validated  validated failed — retry

  next  ge agents resume   (fold this plan into executable commands; --run to execute)
```

Decision: do NOT run `ge agents resume` yet. The state machine correctly
says "retry", but a retry regenerates with the same defective generator and
produces the same blocker — the upstream fix lands first, then the retry.

## Step 6 — report back

> Agent: "Finding: `agent:model_is_gemini_3_5_flash` fails identically in
> all three workspaces (`foundModel: gemini-2.0-flash`). Scope: 3/3 items of
> run-20260703-0407, all at stage `validated`. Evidence: events
> evt_run-20260703-0407_blocker_001..003, each pointing at
> `artifacts/validation-report.json` in its workspace. Likely owner:
> generator (the template that renders `app/agent.py`). Recommended fix: one
> generator change to the model id, then regenerate — not three manual
> repairs. I emitted `upstream.fix.recommended` and held the retry:
> `ge ledger plan` proposes it, but it would reproduce the defect."

Facts first — event type, subject, evidence path, owner, next change — in
the reporting format from `references/harness-playbook.md`.

## Failure variant — the validator rejects a drafted event

A first draft that skips `mode` and writes `actor.kind: "agent"`:

```console
$ node skills/recording-evidence/scripts/validate-ledger-event.mjs blocker-draft.json
missing required field(s): mode.name
$ echo $?
1
```

After adding `mode` it fails again, one rule further in:

```console
$ node skills/recording-evidence/scripts/validate-ledger-event.mjs blocker-draft.json
actor.kind must be system, harness, or human
```

React by fixing the draft, not the pipeline: a harness emitting events is
`actor.kind: "harness"` (there is no `"agent"` kind), and `mode.name` must be
`local` or `remote` because rollups split on it. Never append an event that
did not print `"ok": true`, and never loosen the validator to accept a
draft — the required fields are exactly what makes the ledger queryable.
