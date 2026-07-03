# Example session — rough idea to a registered, buildable spec

A worked interview→register loop: elicit → author normalized JSON → generate
and validate golden evals → register → sync. Validator and workbench outputs
are real, trimmed. Read this when it's unclear which command comes next or
what the quality gates actually say when they fail.

## The ask

> Operator: "HR wastes days every payroll cycle fixing benefits enrollment
> exceptions between SAP and BlackLine. I want an agent for that. Systems:
> SAP S/4HANA FI, BlackLine, some history in BigQuery."

Decisions: not a catalog selection, not a variant → new spec via the harness
interview path. Systems are named, so the interview asks only what changes
the build (thresholds, refusal rules, escalation target) — per
`references/harness-interview.md`. Answers that change the build go through
an interaction form (`references/interaction-forms.md`), never a log stream.

## Step 1 — author the normalized spec

Interview answers become one JSON object shaped like
`references/spec-shape.md` (start from `assets/normalized-spec-skeleton.json`).
Then check it *before* registering:

```console
$ node skills/interviewing-specs/scripts/validate-usecase-spec.mjs benefits-spec.json
{
  "ok": true,
  "maturity": "factory_grade_catalog_spec",
  "gaps": []
}
```

## Step 2 — golden evals: prompt → harness authors → validate

```console
$ node apps/factory/scripts/spec-workbench.mjs golden-evals prompt --spec benefits-spec.json --out /tmp/golden-evals.prompt.txt
```

The prompt hard-constrains the harness ("Use only the declared tool intent
names… Cover every declared tool intent at least once"). Antigravity returns
`golden-evals.json`; validate it deterministically:

```console
$ node apps/factory/scripts/spec-workbench.mjs golden-evals validate --spec benefits-spec.json --evals golden-evals.json
{
  "ok": false,
  "errors": [
    "bad-eval:missing_expected_tool_calls",
    "golden_evals_missing_tool_coverage:query_sap_s_4hana_fi_employees,…,action_blackline_update_deduction",
    "golden_evals_missing_write_safety_coverage:action_sap_s_4hana_fi_sync_enrollment,action_blackline_update_deduction"
  ],
  "warnings": [ "golden_evals_do_not_assert_citations" ],
  "coverage": { "toolCoverage": 0, "missingToolCoverage": [ "…9 tools…" ] }
}
```

Reading it: every error names the gap — evals must call out expected tool
calls, cover every declared tool, and include a safety/refusal eval per
write-like action tool. Fix the *evals* (or re-prompt the harness with the
errors), never delete tool intents from the spec to shrink coverage. When
`ok: true`, apply:

```console
$ node apps/factory/scripts/spec-workbench.mjs golden-evals apply --spec benefits-spec.json --evals golden-evals.json --out benefits-spec.with-evals.json
```

## Step 3 — register through the quality gates

```console
$ node apps/factory/scripts/register-agent-spec.mjs --input benefits-spec.with-evals.json
{
  "ok": true,
  "path": ".../catalog/interview-specs/help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr.json",
  "id": "help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr",
  "title": "Help HR Teams Resolve Benefits Enrollment Exceptions Before Payroll Cutover",
  "buildable": true,
  "gaps": [],
  "familyId": "help-hr-teams-resolve-benefits-enrollment-exceptions-before-payr"
}
```

`"buildable": true` is the gate that matters — a spec registered with
`--allow-draft true` is stored but will not build.

## Step 4 — sync into the build catalog, hand off

```console
$ node apps/factory/scripts/sync-use-cases-from-slides.mjs
Synced 365 use cases to apps/factory/generated/use-cases.generated.json
```

> Agent: "Registered `help-hr-teams-resolve-benefits-enrollment-exceptions-
> before-payr` — buildable, no gaps; 5 golden evals covering all 9 tool
> intents incl. write-safety refusals; synced to the catalog. Next:
> `planning-missions` with this id (or `ge agents build --ids <id> --local
> --target previewed` to build straight away)."

## Failure variant — registration refused by the quality gates

Registering a spec with hollow sections fails loudly, before anything is
written:

```console
$ node apps/factory/scripts/register-agent-spec.mjs --input benefits-spec.json
Error: interview spec is not buildable: missing_schema_contracts, document_missing_required_sections:benefits-enrollment-runbook, document_missing_minimum_word_count:benefits-enrollment-runbook
```

React by fixing the named gaps in the spec — here: entities lost their
column schemas (`missing_schema_contracts`), and the runbook document needs
`requiredSections` + `minimumWordCount` so generated documents have real
substance. Re-validate with `validate-usecase-spec.mjs` (same gap codes,
JSON), then re-register. Do NOT reach for `--allow-draft true` to make the
error go away — that stores an unbuildable draft and moves the failure
downstream to a confused factory run.
