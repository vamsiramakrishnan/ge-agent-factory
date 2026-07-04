---
type: Agent Tool
title: query_assessment_platform_assessment_platform_records
description: Retrieve assessment platform records from Assessment Platform for the Successor Readiness Assessment workflow.
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

# query_assessment_platform_assessment_platform_records

Retrieve assessment platform records from Assessment Platform for the Successor Readiness Assessment workflow.

- **Kind:** query
- **Source system:** [Assessment Platform](/systems/assessment-platform.md)

## Inputs

- lookup_key
- date_range

## Outputs

- assessment_platform_records_records
- assessment_platform_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Assessment Platform](/systems/assessment-platform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [talent_data_aggregation](/workflow/talent-data-aggregation.md)
- [potential_modeling_9_box](/workflow/potential-modeling-9-box.md)

## Evals

- [Run the Successor Readiness Assessment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/successor-readiness-assessment-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- assessment_platform_records_records
- assessment_platform_records_summary

# Examples

```
query_assessment_platform_assessment_platform_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Assessment Platform](/systems/assessment-platform.md)
