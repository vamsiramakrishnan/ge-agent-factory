---
type: Agent Tool
title: query_quality_management_systems_quality_management_systems_records
description: Retrieve quality management systems records from Quality Management Systems for the Quality Incident Analyzer workflow.
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

# query_quality_management_systems_quality_management_systems_records

Retrieve quality management systems records from Quality Management Systems for the Quality Incident Analyzer workflow.

- **Kind:** query
- **Source system:** [Quality Management Systems](/systems/quality-management-systems.md)

## Inputs

- lookup_key
- date_range

## Outputs

- quality_management_systems_records_records
- quality_management_systems_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Quality Management Systems](/systems/quality-management-systems.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ncr_intake_history_pull](/workflow/ncr-intake-history-pull.md)

## Evals

- [Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/quality-incident-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- quality_management_systems_records_records
- quality_management_systems_records_summary

# Examples

```
query_quality_management_systems_quality_management_systems_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Quality Management Systems](/systems/quality-management-systems.md)
