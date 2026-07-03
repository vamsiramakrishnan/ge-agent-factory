# Example session — spec → OKF bundle → edited BRD → back into a spec

A worked round-trip: export a generated spec, inspect conformance, hand the
bundle to a human author, ingest the edits back. Outputs are real, trimmed.
Read this when it's unclear what a conformant bundle looks like on disk or
what the reverse converter actually recovers.

## The ask

> Operator: "Benefits ops wants to review the enrollment agent's BRD in
> plain Markdown — export the spec as OKF, let them edit, and bring their
> changes back."

Decisions: direction 1 is export (`--id` resolves from the generated
catalog); the return path is ingest → the recovered partial spec goes back
through `interviewing-specs`, never straight to a build.

## Step 1 — export

```console
$ node apps/factory/scripts/spec-to-okf.mjs --id help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr --out artifacts/okf/benefits
{
  "bundle": ".../artifacts/okf/benefits",
  "conceptCount": 40,
  "files": [
    "documents/benefits-enrollment-runbook.md",
    "evals.md", "index.md", "kpis.md", "playbook.md",
    "queries/retrieve-records.md", "…",
    "systems/blackline.md", "systems/sap-s-4hana-fi.md",
    "tables/benefit-enrollments.md", "…",
    "tests/happy-path-reconciliation.md", "tests/refusal-inactive-employee.md",
    "tools/query-sap-s-4hana-fi-employees.md", "…",
    "workflow/retrieve-records.md", "…"
  ]
}
```

## Step 2 — inspect conformance before handing it over

```console
$ head -6 artifacts/okf/benefits/index.md
---
okf_version: "0.1"
type: Knowledge Bundle
title: Help HR Teams Resolve Benefits Enrollment Exceptions Before Payroll Cutover
description: "Help HR teams resolve benefits enrollment exceptions before payroll…"
tags:
```

Checklist walked: root `index.md` (and only it) carries `okf_version: "0.1"`;
every concept has a non-empty `type` (`Agent Tool`, `Source System`,
`Query Capability`, …); each directory has an `index.md`; relationships are
bundle-absolute links (`[SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)`).
Slugs are filesystem-safe on purpose (lossy), but tool names, system
identities, and workflow step order survive the round trip.

Human authors edit concepts (or add new ones) following the conventional
headings — start new concepts from `assets/okf-concept-example.md`.

## Step 3 — ingest the edited bundle

```console
$ node apps/factory/scripts/okf-to-spec.mjs --bundle artifacts/okf/benefits > partial-spec.json
$ head -8 partial-spec.json
{
  "behaviorContract": {
    "role": "Benefits enrollment copilot for active GE employees in SAP S/4HANA FI and BlackLine",
    "primaryObjective": "Help HR teams resolve benefits enrollment exceptions before payroll cutover…",
    "inScope": [
      "Inquire employee benefit status and eligibility in SAP S/4HANA FI",
```

The reverse converter recovers `behaviorContract` (role, objective, scope,
refusal rules, toolIntents, ordered workflow with per-step tools) plus
`sourceSystems` and `entities`. It is a *partial* spec — no golden evals,
no registry metadata — so the verdict step is:

> Agent: "Exported 40 concepts, bundle conforms to OKF v0.1; ingested the
> edited bundle back — the ops team tightened two refusal rules and added a
> BigQuery trend query to the workflow. Recovered partial spec is at
> `partial-spec.json`; next I'll run it through `interviewing-specs`
> (validate → golden evals → register) before anything builds."

## Step 4 — validate the machinery when in doubt

```console
$ bun test apps/factory/scripts/spec-to-okf.test.mjs
(fail) round-trip recovers tool names, systems, and workflow step order
(fail) capability spine: queries/, tests/, documents/ concepts emitted + round-trip
 9 pass
 2 fail
```

Those two failures are the *known* id-mangling round-trip bug listed in
`tools/known-test-failures.json` (see its `notes` field) — expected, not
yours to fix in passing. Any OTHER failing name in this file is a regression
you introduced.

## Failure variant — pointing the converters at the wrong thing

```console
$ node apps/factory/scripts/spec-to-okf.mjs --id benefits-agent
Use case 'benefits-agent' not found in .../apps/factory/generated/use-cases.generated.json.
```

React: the id must be the exact catalog id — list candidates from
`apps/factory/generated/use-cases.generated.json` (or pass the file directly
with `--spec <path/to/usecase-spec.json>`). If a freshly registered
interview spec is missing here, the registry wasn't synced: run
`node apps/factory/scripts/sync-use-cases-from-slides.mjs` first.

```console
$ node apps/factory/scripts/okf-to-spec.mjs --bundle artifacts/okf/wrong-dir
Bundle directory not found: .../artifacts/okf/wrong-dir
```

React: pass the bundle *root* (the directory containing the `okf_version`
`index.md`), not a subdirectory or a single concept file.
