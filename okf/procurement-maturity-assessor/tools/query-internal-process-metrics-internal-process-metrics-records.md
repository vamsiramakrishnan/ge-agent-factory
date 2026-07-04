---
type: Agent Tool
title: query_internal_process_metrics_internal_process_metrics_records
description: Retrieve internal process metrics records from Internal Process Metrics for the Procurement Maturity Assessor workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_internal_process_metrics_internal_process_metrics_records

Retrieve internal process metrics records from Internal Process Metrics for the Procurement Maturity Assessor workflow.

- **Kind:** query
- **Source system:** [Internal Process Metrics](/systems/internal-process-metrics.md)

## Inputs

- lookup_key
- date_range

## Outputs

- internal_process_metrics_records_records
- internal_process_metrics_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Internal Process Metrics](/systems/internal-process-metrics.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [survey_metrics_collection](/workflow/survey-metrics-collection.md)

## Evals

- [Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-maturity-assessor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- internal_process_metrics_records_records
- internal_process_metrics_records_summary

# Examples

```
query_internal_process_metrics_internal_process_metrics_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Internal Process Metrics](/systems/internal-process-metrics.md)
