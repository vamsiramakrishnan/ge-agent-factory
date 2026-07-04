---
type: Agent Tool
title: query_workday_compensation
description: "Retrieve compensation history and market benchmarks to identify compensation-gap attrition drivers."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_workday_compensation

Retrieve compensation history and market benchmarks to identify compensation-gap attrition drivers.

- **Kind:** query
- **Source system:** [Workday](/systems/workday.md)

## Inputs

- employee_id
- role

## Outputs

- current_salary
- market_benchmark
- gap_percentage

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [feature_engineering](/workflow/feature-engineering.md)

## Evals

- [Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.](/tests/individual-risk-with-root-cause-and-recommendation.md)

## Evidence emitted

- source_system_record

## Required inputs

- employee_id
- role

## Produces

- current_salary
- market_benchmark
- gap_percentage

# Examples

```
query_workday_compensation(employee_id=<employee_id>, role=<role>)
```

# Citations

- [Workday](/systems/workday.md)
