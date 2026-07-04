---
type: Agent Tool
title: query_nice_actimize_investigation_cases
description: Retrieve investigation cases from NICE Actimize for the Fraud Alert Triage Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_nice_actimize_investigation_cases

Retrieve investigation cases from NICE Actimize for the Fraud Alert Triage Agent workflow.

- **Kind:** query
- **Source system:** [NICE Actimize](/systems/nice-actimize.md)

## Inputs

- case_number
- date_range

## Outputs

- investigation_cases_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [NICE Actimize](/systems/nice-actimize.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- case_number
- date_range

## Produces

- investigation_cases_records

# Examples

```
query_nice_actimize_investigation_cases(case_number=<case_number>, date_range=<date_range>)
```

# Citations

- [NICE Actimize](/systems/nice-actimize.md)
