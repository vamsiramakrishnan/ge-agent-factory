# Example session — stand up a Lever recruiting simulator

A worked interaction showing the loop: plan → archetype → scaffold →
validate → report. Outputs are real, trimmed. Read this when it's unclear
which command comes next or what a healthy conformance report looks like.

## The ask

> Operator: "The InterviewScheduling use case needs its ATS to be concrete.
> Stand up a Lever simulator the factory can seed and the generated agent
> can call — schema, tools, approvals, audit — and validate it. Local only,
> no cloud runs."

Constraints extracted: source system named (Lever), use case known
(InterviewScheduling), local only → deterministic scaffolding and
validation now; the daemon-run data/simulator nodes get proposed at the
end, not run.

## Step 1 — plan the scenario to see where the simulator slots in

```console
$ bun tools/ge.mjs pipeline plan --scenario InterviewScheduling --systems lever --target-stage preview --json
{
  "kind": "ge.pipeline.plan",
  "id": "interviewscheduling",
  "mode": "local",
  "input": { "scenario": "InterviewScheduling", "systems": ["lever"], … },
  "status": "pending",
  "counts": { "pending": 7, "skipped": 1 },
  "stages": [
    { "id": "interview", "owner": "antigravity", "status": "pending", … },
    { "id": "spec",      "owner": "antigravity", "status": "pending", … },
    { "id": "data",      "owner": "runtime",     "status": "pending",
      "actionPlan": { "commands": ["ge pipeline run --scenario InterviewScheduling --systems lever --target-stage preview"] } },
    { "id": "simulator", "owner": "runtime",     "status": "pending", … },
    …
  ]
}
```

Decision: the `data` and `simulator` stages are runtime-owned and pending,
and they need a `lever` pack that does not exist —
`apps/factory/simulator-systems/` has `greenhouse` but no `lever`, and the
registry (`apps/factory/simulator-systems/registry.json`) is the source of
truth. Scaffold before running anything.

## Step 2 — pick the archetype

```console
$ npm run generator:scaffold-simulator -- --list-archetypes true
{
  "ok": true,
  "archetypes": [
    …
    {
      "id": "recruiting",
      "family": "hr-talent",
      "entities": ["candidate", "application", "job", "interview", "offer", "approval"],
      "workflows": ["candidate_search", "application_review", "interview_scheduling", "offer_approval", "audit"],
      "roles": ["recruiter", "hiring_manager", "interviewer", "comp_partner", "candidate_coordinator"],
      "primaryCollection": "candidates",
      "collections": ["candidates", "jobs", "applications", "interviews", "offers", "approvals", "audit_events"]
    },
    …
  ]
}
```

Decision: Lever is an ATS → `recruiting` (the archetype map's example
systems are literally "Greenhouse, ATS, Lever"), no clarifying question
needed. Realism `enterprise`, because the agent must reason over offer
approval and role gates, not just read rows. Record the choice — copy
`assets/decision-record-example.json` and fill it in.

## Step 3 — scaffold the pack

```console
$ npm run generator:scaffold-simulator -- --id lever --name "Lever" --archetype recruiting --realism enterprise
{
  "ok": true,
  "id": "lever",
  "archetype": "recruiting",
  "packDir": "…/apps/factory/simulator-systems/lever",
  "registry": "apps/factory/simulator-systems/registry.json",
  "next": [
    "npm run generator:validate-simulators -- --system lever",
    "Use generic handlers immediately; add custom runtime handlers only for system-specific workflow semantics.",
    "npm run generator:test-simulators",
    "npm run generator:simulator-coverage"
  ]
}
```

The scaffolder wrote all six pack files (`schema.json`, `tools.json`,
`projection.json`, `materialization.json`, `workflows.json`, `seed.json`)
and registered the system. Rerunning on an existing pack fails with
`…/lever exists; pass --force true to overwrite pack files` — that guard is
there so enrichment edits are never silently clobbered.

## Step 4 — validate conformance

```console
$ npm run generator:validate-simulators -- --system lever
{
  "ok": true,
  "strict": false,
  "simulators": [
    {
      "id": "lever",
      "ok": true,
      "errors": [],
      "warnings": [
        "tool search_candidates has no explicit binding",
        "tool submit_candidate_update has no explicit binding",
        "workflow submit_candidate_update approval blocker has no matching pending approvals row",
        …
      ],
      "tools": 5, "boundTools": 0, "collections": 7, "workflowHandlers": 1
    }
  ]
}
```

Reading the report: `errors` gate (non-empty errors → `"ok": false`, exit
code 2); `warnings` are repair guidance, not blockers. Here the warnings
say the fresh pack's tools rely on implicit name-based binding and the
starter seed has no pending-approval row to exercise the blocker — both are
enrichment work, not stop-the-line failures. `submit_candidate_update`
plus approval blockers means the pack already has a state-changing
workflow, which is the minimum bar for an operational archetype.

## Step 5 — report back

> Agent: "Lever simulator scaffolded and registered: recruiting archetype,
> 7 collections, 5 tools including `submit_candidate_update` with role
> gates, state transitions, and approval blockers. Conformance report is
> ok (0 errors, 6 warnings — implicit tool bindings and a seed row gap,
> noted for enrichment). Decision record written. Nothing cloud was
> touched. Next: `ge daemon start`, then
> `ge pipeline run --scenario InterviewScheduling --systems lever --target-stage preview`
> to run the data → simulator nodes, and
> `npm run generator:simulator-coverage` after."

The report names what exists, what the warnings mean, and the exact next
commands — never "simulator done" without the conformance numbers.

## Failure variant — enrichment breaks conformance

A later edit adds a `submit_offer_update` handler to `workflows.json` with
a collection typo and a role the registry never declared:

```console
$ npm run generator:validate-simulators -- --system lever
{
  "ok": false,
  "simulators": [
    {
      "id": "lever",
      "ok": false,
      "errors": [
        "workflow handler submit_offer_update missing from tools.json",
        "workflow handler submit_offer_update collection offer_packets missing from schema",
        "workflow handler submit_offer_update unknown allowed role talent_ops"
      ],
      …
    }
  ]
}
$ echo $?
2
```

Each error names the artifact to fix — patch the pack contract, never the
generated rows:

1. `missing from tools.json` → declare the `submit_offer_update` tool (or
   drop the handler if the workflow was speculative).
2. `collection offer_packets missing from schema` → the schema collection
   is `offers`; fix the handler's `collection`, or add the collection to
   `schema.json` if it is genuinely new.
3. `unknown allowed role talent_ops` → align `allowedRoles` with the roles
   the registry entry declares (`recruiter`, `hiring_manager`, …) or add
   the role there first.

Fix in that order, rerun the same validate command, and only hand off when
`errors` is empty. One more sharp edge: a typo in `--system` fails with
`Error: No simulator matched <id>` (exit 1) — that means the registry has
no such entry, not that the pack is broken.
