---
type: Agent Tool
title: query_cloudsql_cloudsql_records
description: Retrieve cloudsql records from CloudSQL for the Database Performance Advisor workflow.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_cloudsql_cloudsql_records

Retrieve cloudsql records from CloudSQL for the Database Performance Advisor workflow.

- **Kind:** query
- **Source system:** [CloudSQL](/systems/cloudsql.md)

## Inputs

- lookup_key
- date_range

## Outputs

- cloudsql_records_records
- cloudsql_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [CloudSQL](/systems/cloudsql.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [query_performance_collection](/workflow/query-performance-collection.md)

## Evals

- [Run the Database Performance Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/database-performance-advisor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- cloudsql_records_records
- cloudsql_records_summary

# Examples

```
query_cloudsql_cloudsql_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [CloudSQL](/systems/cloudsql.md)
