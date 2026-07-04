---
type: Agent Tool
title: query_bigquery_historical_exceptions
description: Query BigQuery historical benefits exceptions logs for anomaly resolution patterns.
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

# query_bigquery_historical_exceptions

Query BigQuery historical benefits exceptions logs for anomaly resolution patterns.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- employee_id

## Outputs

- historical_exceptions

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- sql_result

## Required inputs

- employee_id

## Produces

- historical_exceptions

# Examples

```
query_bigquery_historical_exceptions(employee_id=<employee_id>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
