---
type: Agent Tool
title: query_capability_assessments_capability_assessments_records
description: Retrieve capability assessments records from Capability Assessments for the Supplier Development Planner workflow.
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

# query_capability_assessments_capability_assessments_records

Retrieve capability assessments records from Capability Assessments for the Supplier Development Planner workflow.

- **Kind:** query
- **Source system:** [Capability Assessments](/systems/capability-assessments.md)

## Inputs

- lookup_key
- date_range

## Outputs

- capability_assessments_records_records
- capability_assessments_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Capability Assessments](/systems/capability-assessments.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [threshold_detection_data_pull](/workflow/threshold-detection-data-pull.md)
- [development_program_design](/workflow/development-program-design.md)

## Evals

- [Run the Supplier Development Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-development-planner-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- capability_assessments_records_records
- capability_assessments_records_summary

# Examples

```
query_capability_assessments_capability_assessments_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Capability Assessments](/systems/capability-assessments.md)
