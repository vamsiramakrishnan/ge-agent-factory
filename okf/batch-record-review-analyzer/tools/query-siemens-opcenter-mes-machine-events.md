---
type: Agent Tool
title: query_siemens_opcenter_mes_machine_events
description: Retrieve machine events from Siemens Opcenter MES for the Batch Record Review Analyzer workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_siemens_opcenter_mes_machine_events

Retrieve machine events from Siemens Opcenter MES for the Batch Record Review Analyzer workflow.

- **Kind:** query
- **Source system:** [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)

## Inputs

- asset_number
- date_range

## Outputs

- machine_events_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- asset_number
- date_range

## Produces

- machine_events_records

# Examples

```
query_siemens_opcenter_mes_machine_events(asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [Siemens Opcenter MES](/systems/siemens-opcenter-mes.md)
