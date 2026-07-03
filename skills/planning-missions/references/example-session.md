# Example session — decide ownership before the line moves

A worked planning pass: plan → read the graph → decide Factory vs Autopilot →
run → resume. Outputs are real, trimmed. Read this when it's unclear how to
read a pipeline plan/graph or what to do when the run surface is down.

## The ask

> Operator: "We're picking up hr-onboarding-agent again. Before anything
> runs: who owns the next move? This machine, target preview."

Constraints extracted: local mode, target gate `preview`, and the question
is ownership — so the answer is a plan, not a launch.

## Step 1 — plan (pure computation, nothing runs)

```console
$ bun tools/ge.mjs pipeline plan --scenario employee_onboarding --ids hr-onboarding-agent --target-stage preview
Pipeline employee-onboarding
  status     pending
  target     preview
  scenario   employee_onboarding
  agents     hr-onboarding-agent

  Next
  pending  Data  runtime
  action   Generate data
  $ ge pipeline run --scenario employee_onboarding --target-stage preview

  Pipeline
  skipped  Interview    antigravity
  done     Spec         antigravity
  pending  Data         runtime · ge pipeline run --scenario employee_onboarding --target-stage preview
  pending  Simulator    runtime · ge pipeline run --scenario employee_onboarding --target-stage preview
  skipped  Agent Build  factory · ge agents build --ids hr-onboarding-agent --local
  pending  Eval         antigravity · node apps/factory/scripts/spec-workbench.mjs golden-evals prompt --spec .ge/interviews/employee-onboarding/agent-spec.json
  pending  Preview      repair · ge pipeline run --scenario employee_onboarding --run-preview
  pending  Deploy       factory · ge handoff agents-cli --ids hr-onboarding-agent
```

Ownership read directly off the plan: Spec already `done` (don't redo it),
the scenario data layer is `runtime`-owned and next, the build is
`factory`-owned, convergence/preview is `repair` (Autopilot) — and every
stage names its first command.

## Step 2 — inspect the executable DAG behind it

```console
$ bun tools/ge.mjs pipeline graph --scenario employee_onboarding --ids hr-onboarding-agent
Pipeline run pipeline-1783065961395
  status    pending
  nodes     0 done · 0 blocked · 7 pending · 8 total
  factory   represented, not auto-run

  Graph
  pending  preflight.doctor              doctor.gate
  pending  antigravity.spec-data-review  harness.run ← preflight.doctor
                                         agent antigravity-sdk | stages spec_generation,mock_data,simulation,eval
  pending  mock.generate                 mock.generate ← antigravity.spec-data-review
  pending  snowfakery.generate           snowfakery.generate ← mock.generate
  pending  simulator.seed                simulator.seed ← snowfakery.generate
  pending  simulator.validate            simulator.validate ← simulator.seed
  skipped  factory.build                 agent.build ← simulator.validate
  pending  repair.converge               repair.run ← simulator.validate
```

Decisions made here:

- `factory represented, not auto-run` / `factory.build skipped` — the build
  node exists in the graph but only executes with `--with-factory`. Planning
  never rebuilds agents by accident.
- The Antigravity review node sits before data generation by default; drop
  it with `--no-antigravity` only for deterministic debugging.
- The plan matches the operator's intent (local, preview, one agent) — only
  now is running it justified.

## Step 3 — run, then supervise by id (never recompute intent)

```console
$ bun tools/ge.mjs daemon start
$ bun tools/ge.mjs pipeline run --scenario employee_onboarding --ids hr-onboarding-agent --target-stage preview
✓ started pipeline run pipeline-…
  $ ge pipeline status <id>          status
  $ ge runs events <id> --follow     live events
```

On resume (`ge pipeline status <id>` → `ge pipeline resume <id>`), the run's
own persisted `input` and each node's `resumePlan` are the source of truth —
do not re-derive scenario/ids/target from whatever is currently selected in
a UI or conversation.

## Step 4 — report back

> Agent: "Ownership for hr-onboarding-agent → preview: spec is done; the
> daemon owns data + simulator next; the factory build node is represented
> but won't auto-run; Autopilot's repair.converge supervises the preview
> gate after simulator.validate. Started run `pipeline-…` — following via
> `ge runs events`. Nothing was rebuilt and nothing touched the cloud."

## Failure variant — the run surface is down

```console
$ bun tools/ge.mjs pipeline run --scenario employee_onboarding --target-stage preview
✗ ge daemon is stopped; run: ge daemon start
```

React with exactly the printed fix (`ge daemon start`), then re-issue the
same run command. Do not fall back to executing graph nodes by hand — the
daemon's task record is what makes `pipeline status`/`resume` and the event
stream possible. Note that `plan` and `graph` still work with the daemon
down (pure computation); only run/status-by-id/resume/runs need it.

And when validating a legacy mission contract, the validator names the
broken invariant:

```console
$ node skills/planning-missions/scripts/validate-mission.mjs mission.json
remote mode requires remote_observe_only capability
```

That is the local/remote rule from this skill: a remote-mode mission must
not claim local repair capability — fix the contract, don't relax the check.
