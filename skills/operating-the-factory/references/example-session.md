# Example session — run the operator loop for one goal

A worked conductor session: assess → guard → pick one station → observe →
record → repeat. CLI outputs are real, trimmed. Read this when it's unclear
what "one decision at a time" looks like in practice, or how the loop reacts
to a blocker.

## The ask

> Operator: "Get hr-onboarding-agent to a passing preview on this machine.
> Don't deploy anything to the cloud without asking me."

Constraints extracted: target gate = preview, mode = local; anything
outward-facing (handoff/publish) → `guarding-the-factory` says escalate, so
the loop's terminal state is *preview passed + a hand-back*, not a deploy.

## Iteration 1 — assess before acting

```console
$ bun tools/ge.mjs status
GE Agent Factory
  capture → prove → handoff   (nothing handed off yet)
  blocker   no project configured
  next      ge init
```

```console
$ bun tools/ge.mjs doctor --local
  toolchain  (2 fail)
  ✓ bun installed                  v1.3.11
  ✓ uv installed                   uv 0.8.17
  ✗ agents-cli                     not found
      fix: uv tool install google-agents-cli
  ✗ google-antigravity SDK         not importable (python3)
      fix: mise run deps  (creates .venv via uv + installs the SDK)
  ✓ harness skills manifest        19 skills discoverable
  ✓ workspace registry             16 registered workspaces
✗ 2 hard failure(s).
```

Decision: doctor red → per the station map, that is `standing-up-the-platform`
territory (here: local toolchain, so run doctor's own printed fixes). "No
project configured" is NOT a blocker for a local preview goal — do not run
`ge init` cloud discovery just because status suggests it; the goal decides.

One station this iteration: fix the toolchain (`mise run deps`,
`uv tool install google-agents-cli`), re-run doctor, record the decision.

## Iteration 2 — plan, don't launch

Doctor green now. Next station per the map: spec exists in the catalog →
`planning-missions` owns "who does what next".

```console
$ bun tools/ge.mjs pipeline plan --scenario employee_onboarding --ids hr-onboarding-agent --target-stage preview
Pipeline employee-onboarding
  status     pending
  target     preview
  agents     hr-onboarding-agent

  Next
  pending  Data  runtime
  action   Generate data
  $ ge pipeline run --scenario employee_onboarding --target-stage preview

  Pipeline
  skipped  Interview    antigravity
  done     Spec         antigravity
  pending  Data         runtime · ge pipeline run --scenario employee_onboarding --target-stage preview
  pending  Simulator    runtime
  skipped  Agent Build  factory · ge agents build --ids hr-onboarding-agent --local
  pending  Eval         antigravity
  pending  Preview      repair · ge pipeline run --scenario employee_onboarding --run-preview
  pending  Deploy       factory · ge handoff agents-cli --ids hr-onboarding-agent
```

Reading it: Spec is `done`, Data is the next pending stage, and every stage
names its owner and first command. The plan's `Deploy` line exists but is
outside this goal (operator said no cloud) — note it, don't run it.

## Iteration 3 — run one station, observe to *finished*

```console
$ bun tools/ge.mjs daemon start
$ bun tools/ge.mjs pipeline run --scenario employee_onboarding --ids hr-onboarding-agent --target-stage preview --follow
```

Observe via the streamed events (or `ge runs events <id> --follow`) until the
run is *terminal*. A started run is not a result: only `done`/`blocked` node
states count. On `blocked`, hand to `triaging-runs` — do not re-run the whole
pipeline hoping.

## Iteration 4 — guard, then stop at the line the operator drew

Preview passed. The plan's next command is `ge handoff agents-cli …` —
outward-facing, so `guarding-the-factory` classifies it: cloud deploy →
needs explicit sign-off → escalate instead of act.

> Agent: "hr-onboarding-agent passes preview locally: data + simulator
> generated, build validated, preview gate green (run `pipeline-…`, artifacts
> under `.ge/pipelines/employee_onboarding/`). I stopped before `ge handoff
> agents-cli --ids hr-onboarding-agent` — that deploys to Agent Engine and
> you asked me not to touch the cloud. Say the word and I'll run it with
> `running-release`."

Each iteration was recorded (decision + outcome) via `recording-evidence` —
the report above is assembled from those records, not memory.

## Failure variant — acting on a dead daemon

```console
$ bun tools/ge.mjs pipeline run --scenario employee_onboarding --target-stage preview
✗ ge daemon is stopped; run: ge daemon start
```

React: run exactly the printed fix (`ge daemon start`), re-run the command
once, and continue the loop. Do NOT switch to running the stations by hand
(mock generate, simulator seed, …) to route around the daemon — the pipeline
run is the durable, resumable record; hand-run stations leave no trail and
break resume. If the daemon won't start, that is a `triaging-runs` /
`standing-up-the-platform` problem and the loop pauses there.
