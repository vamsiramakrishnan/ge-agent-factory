---
type: Agent Tool
title: query_lexisnexis_risk_solutions_mvr_records
description: Retrieve mvr records from LexisNexis Risk Solutions for the Renewal Risk Requalification Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_lexisnexis_risk_solutions_mvr_records

Retrieve mvr records from LexisNexis Risk Solutions for the Renewal Risk Requalification Agent workflow.

- **Kind:** query
- **Source system:** [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)

## Inputs

- mvr_id
- driver_name
- date_range

## Outputs

- mvr_records_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- sql_result

## Required inputs

- mvr_id
- driver_name
- date_range

## Produces

- mvr_records_records

# Examples

```
query_lexisnexis_risk_solutions_mvr_records(mvr_id=<mvr_id>, driver_name=<driver_name>, date_range=<date_range>)
```

# Citations

- [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
