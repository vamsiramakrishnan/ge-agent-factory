---
type: Agent Tool
title: query_manhattan_active_wm_pick_tasks
description: Retrieve pick tasks from Manhattan Active WM for the Inbound PO ETA Monitor workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_manhattan_active_wm_pick_tasks

Retrieve pick tasks from Manhattan Active WM for the Inbound PO ETA Monitor workflow.

- **Kind:** query
- **Source system:** [Manhattan Active WM](/systems/manhattan-active-wm.md)

## Inputs

- wave_id
- task_number
- date_range

## Outputs

- pick_tasks_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Manhattan Active WM](/systems/manhattan-active-wm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- wave_id
- task_number
- date_range

## Produces

- pick_tasks_records

# Examples

```
query_manhattan_active_wm_pick_tasks(wave_id=<wave_id>, task_number=<task_number>, date_range=<date_range>)
```

# Citations

- [Manhattan Active WM](/systems/manhattan-active-wm.md)
