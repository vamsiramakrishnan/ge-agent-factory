---
type: Agent Tool
title: query_cision_cision_records
description: "Retrieve cision records from Cision for the Analyst & Influencer Relations Tracker workflow."
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_cision_cision_records

Retrieve cision records from Cision for the Analyst & Influencer Relations Tracker workflow.

- **Kind:** query
- **Source system:** [Cision](/systems/cision.md)

## Inputs

- lookup_key
- date_range

## Outputs

- cision_records_records
- cision_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Cision](/systems/cision.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [coverage_aggregation](/workflow/coverage-aggregation.md)

## Evals

- [Run the Analyst & Influencer Relations Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/analyst-influencer-relations-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- cision_records_records
- cision_records_summary

# Examples

```
query_cision_cision_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Cision](/systems/cision.md)
