---
type: Agent Tool
title: query_leandata_leandata_records
description: "Retrieve leandata records from LeanData for the Lead Routing & Assignment Engine workflow."
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

# query_leandata_leandata_records

Retrieve leandata records from LeanData for the Lead Routing & Assignment Engine workflow.

- **Kind:** query
- **Source system:** [LeanData](/systems/leandata.md)

## Inputs

- lookup_key
- date_range

## Outputs

- leandata_records_records
- leandata_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LeanData](/systems/leandata.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-routing-assignment-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- leandata_records_records
- leandata_records_summary

# Examples

```
query_leandata_leandata_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [LeanData](/systems/leandata.md)
