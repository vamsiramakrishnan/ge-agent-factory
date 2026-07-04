---
type: Agent Tool
title: query_procurement_3_procurement_3_records
description: Retrieve procurement 3 records from PROCUREMENT 3 for the Capability Assessment Agent workflow.
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

# query_procurement_3_procurement_3_records

Retrieve procurement 3 records from PROCUREMENT 3 for the Capability Assessment Agent workflow.

- **Kind:** query
- **Source system:** [PROCUREMENT 3](/systems/procurement-3.md)

## Inputs

- lookup_key
- date_range

## Outputs

- procurement_3_records_records
- procurement_3_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [PROCUREMENT 3](/systems/procurement-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capability-assessment-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- procurement_3_records_records
- procurement_3_records_summary

# Examples

```
query_procurement_3_procurement_3_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [PROCUREMENT 3](/systems/procurement-3.md)
