---
type: Agent Tool
title: query_lexisnexis_risk_solutions_prefill_datasets
description: Retrieve prefill datasets from LexisNexis Risk Solutions for the Application Fraud Screening Agent workflow.
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

# query_lexisnexis_risk_solutions_prefill_datasets

Retrieve prefill datasets from LexisNexis Risk Solutions for the Application Fraud Screening Agent workflow.

- **Kind:** query
- **Source system:** [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)

## Inputs

- prefill_id
- quote_number
- date_range

## Outputs

- prefill_datasets_records

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

- prefill_id
- quote_number
- date_range

## Produces

- prefill_datasets_records

# Examples

```
query_lexisnexis_risk_solutions_prefill_datasets(prefill_id=<prefill_id>, quote_number=<quote_number>, date_range=<date_range>)
```

# Citations

- [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
