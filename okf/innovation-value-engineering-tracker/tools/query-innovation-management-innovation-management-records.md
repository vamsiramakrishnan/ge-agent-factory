---
type: Agent Tool
title: query_innovation_management_innovation_management_records
description: "Retrieve innovation management records from Innovation Management for the Innovation & Value Engineering Tracker workflow."
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

# query_innovation_management_innovation_management_records

Retrieve innovation management records from Innovation Management for the Innovation & Value Engineering Tracker workflow.

- **Kind:** query
- **Source system:** [Innovation Management](/systems/innovation-management.md)

## Inputs

- lookup_key
- date_range

## Outputs

- innovation_management_records_records
- innovation_management_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Innovation Management](/systems/innovation-management.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [proposal_intake_triage](/workflow/proposal-intake-triage.md)
- [pipeline_analytics_categorization](/workflow/pipeline-analytics-categorization.md)

## Evals

- [Run the Innovation & Value Engineering Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/innovation-value-engineering-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- innovation_management_records_records
- innovation_management_records_summary

# Examples

```
query_innovation_management_innovation_management_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Innovation Management](/systems/innovation-management.md)
