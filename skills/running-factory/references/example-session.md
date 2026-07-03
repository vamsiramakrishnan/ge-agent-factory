# Example session — build a benefits workspace to data_packaged

A worked interaction showing the early-station loop: orient → pipeline plan →
factory plan → factory run → summarize → hand to workspace gates. Outputs are
real, trimmed. Read this when it's unclear which command comes next or what a
good factory-run result looks like.

## The ask

> Operator: "The benefits Q&A spec is already captured. Generate its workspace
> and build the data package locally — factory stations only, no deploy — and
> tell me where the artifacts land."

Constraints extracted: local mode; stop at `data_packaged` (no preview, no
deploy); the spec exists, so interview/spec stations should show done.

## Step 1 — orient: what is already running?

```console
$ bun tools/ge.mjs runs list
Runs
  daemon   healthy  http://127.0.0.1:17654

  status  source   kind        id                          detail
  done    runtime  ge.command  job-1783066037945-2d913473  2026-07-03T08:07:42.527Z
  done    ledger   build       oracle-ledger-20028         2026-06-15T10:00:03.000Z
```

Reading: daemon healthy, no pipeline run in flight — nothing to resume, safe
to start fresh. If a `pipeline.run` were mid-flight for this scenario, resume
it (`ge pipeline resume <id>`) instead of starting a parallel run.

## Step 2 — pipeline plan: confirm position on the line

```console
$ bun tools/ge.mjs pipeline plan --scenario benefits-q-a-enrollment --ids benefits-q-a-enrollment --target-stage preview
Pipeline benefits-q-a-enrollment
  status     pending
  target     preview
  scenario   benefits-q-a-enrollment
  agents     benefits-q-a-enrollment

  Next
  pending  Data  runtime
  action   Generate data
  $ ge pipeline run --scenario benefits-q-a-enrollment --target-stage preview

  Pipeline
  skipped  Interview    antigravity
  done     Spec         antigravity
  pending  Data         runtime · ge pipeline run --scenario benefits-q-a-enrollment --target-stage preview
  …
```

Decisions made here:

- `Spec done` confirms the operator's claim — the factory has something to
  build from. If Spec were `pending`, route back to `interviewing-specs`
  first; the factory does not invent contracts.
- The graph offers `ge pipeline run` (daemon-owned, end-to-end). The operator
  asked for factory stations only, so take the narrow path: direct
  `factory plan` / `factory run`. Use `ge pipeline run --with-factory` when
  the graph should own data, simulators, and convergence too.

## Step 3 — factory plan: create the work items

```console
$ node apps/factory/src/cli.js factory plan --usecases benefits-q-a-enrollment --target data_packaged
{
  "ok": true,
  "plan": "/home/user/ge-agent-factory/.ge/factory/factory-plan.json",
  "markdown": "/home/user/ge-agent-factory/.ge/factory/FACTORY_PLAN.md",
  "totals": { "workItems": 1, "departments": 1, "domains": 1 },
  "targetStage": "data_packaged"
}
```

One work item, as intended (`--usecases` filtered; without it the plan covers
every known use case). The plan JSON carries the decisions worth checking
before running: `workspaceName` (`factory-hr-benefits-q-a-enrollment`),
`rows: 80` with `rowReason: "transactional workflow"`, seed, and the inferred
`datastores` (alloydb, firestore, gcs_discovery_engine).

## Step 4 — factory run: drive items to the target stage

```console
$ node apps/factory/src/cli.js factory run --target data_packaged --continue true --stream true
factory run: 1 item(s) → data_packaged
1/1 factory-hr-benefits-q-a-enrollment: started
1/1 factory-hr-benefits-q-a-enrollment: created…
1/1 factory-hr-benefits-q-a-enrollment: created done
1/1 factory-hr-benefits-q-a-enrollment: validated…
1/1 factory-hr-benefits-q-a-enrollment: validated done
1/1 factory-hr-benefits-q-a-enrollment: harness_reviewed…
1/1 factory-hr-benefits-q-a-enrollment: harness_reviewed done
1/1 factory-hr-benefits-q-a-enrollment: harness_refined…
1/1 factory-hr-benefits-q-a-enrollment: post_refine_validated done
1/1 factory-hr-benefits-q-a-enrollment: harness_refined done
1/1 factory-hr-benefits-q-a-enrollment: data_packaged done
1/1 factory-hr-benefits-q-a-enrollment: data_packaged
factory run: done · 0 failed
{
  "ok": true,
  "run": "/home/user/ge-agent-factory/.ge/factory/factory-run-2026-07-03T08-12-04-118Z.json",
  "markdown": "/home/user/ge-agent-factory/.ge/factory/FACTORY_RUN_2026-07-03T08-12-04-118Z.md",
  "totals": { "workItems": 1, "failed": 0, "byStatus": { "data_packaged": 1 } },
  "targetStage": "data_packaged"
}
```

Reading: a `data_packaged` target includes the harness stations —
`harness_reviewed`/`harness_refined` ran through the antigravity-sdk harness,
and refine was re-validated (`post_refine_validated`) before data packaging.
Inspect `artifacts/antigravity-sdk-harness-refine.json` in the workspace
before trusting the refined code. Event lines stream to stderr; the final
JSON on stdout is the state transition to parse.

## Step 5 — summarize the run artifact and hand off

```console
$ node skills/running-factory/scripts/summarize-factory-run.mjs .ge/factory/factory-run-2026-07-03T08-12-04-118Z.json
{
  "ok": true,
  "targetStage": "data_packaged",
  "totals": { "workItems": 1, "failed": 0, "byStatus": { "data_packaged": 1 } },
  "statuses": {},
  "next": "workspace_gate_repair"
}
```

`next: workspace_gate_repair` → this skill's job ends; the workspace goes to
`checking-workspaces` for the gates.

## Step 6 — report back

> Agent: "1/1 work item reached `data_packaged`, zero failures. Workspace:
> `.ge/factory/workspaces/factory-hr-benefits-q-a-enrollment` — code, tools,
> validation report (`artifacts/validation-report.json`), harness review +
> refine artifacts, data plan (`mock_data/plan/data-plan.json`), package index
> (`mock_data/package-index.yaml`), cloud topology
> (`artifacts/cloud-topology.json`). Run record:
> `.ge/factory/factory-run-2026-07-03T08-12-04-118Z.json`. Nothing was
> deployed. Next station: `checking-workspaces` on this workspace."

The report names the stage reached, the artifact paths, and the next station
— never "factory done" without the run record.

## Failure variant — a work item fails mid-run

```console
$ node apps/factory/src/cli.js factory run --target data_packaged --continue true --stream true
factory run: 1 item(s) → data_packaged
1/1 factory-hr-benefits-q-a-enrollment: created done
1/1 factory-hr-benefits-q-a-enrollment: validated…
1/1 factory-hr-benefits-q-a-enrollment: failed node src/cli.js validate factory-hr-benefits-q-a-enrollment failed: …
factory run: blocked · 1 failed
{
  "ok": false,
  …
  "totals": { "workItems": 1, "failed": 1, "byStatus": { "created": 1 } },
  "targetStage": "data_packaged"
}
$ echo $?
1
$ node skills/running-factory/scripts/summarize-factory-run.mjs .ge/factory/factory-run-<stamp>.json
{
  "ok": false,
  …
  "next": "inspect_failed_items"
}
```

Do NOT rerun blindly. Read the failed item's `error` in the run JSON, open
the workspace's `artifacts/validation-report.json`, and route the repair
through `checking-workspaces` (`workspace doctor` / `workspace repair`) —
then rerun `factory run` with the same target; already-reached stages are
skipped. Without `--continue true` the run stops at the first failure, which
is the right default when diagnosing one item.

Related: `ge pipeline run`/`runs`/`resume` need the daemon and fail with
`✗ ge daemon is stopped; run: ge daemon start` (exit 1) — the fix is the
message; `factory plan`/`factory run` never need the daemon.
