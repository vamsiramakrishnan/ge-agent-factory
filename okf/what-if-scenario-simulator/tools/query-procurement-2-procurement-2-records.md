---
type: Agent Tool
title: query_procurement_2_procurement_2_records
description: "Retrieve procurement 2 records from PROCUREMENT 2 for the What-If Scenario Simulator workflow."
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

# query_procurement_2_procurement_2_records

Retrieve procurement 2 records from PROCUREMENT 2 for the What-If Scenario Simulator workflow.

- **Kind:** query
- **Source system:** [PROCUREMENT 2](/systems/procurement-2.md)

## Inputs

- lookup_key
- date_range

## Outputs

- procurement_2_records_records
- procurement_2_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [PROCUREMENT 2](/systems/procurement-2.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the What-If Scenario Simulator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/what-if-scenario-simulator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- procurement_2_records_records
- procurement_2_records_summary

# Examples

```
query_procurement_2_procurement_2_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [PROCUREMENT 2](/systems/procurement-2.md)
