---
type: Agent Tool
title: query_genesys_cloud_cx_agent_schedules
description: Retrieve agent schedules from Genesys Cloud CX for the Care Call Resolution Copilot Agent workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_genesys_cloud_cx_agent_schedules

Retrieve agent schedules from Genesys Cloud CX for the Care Call Resolution Copilot Agent workflow.

- **Kind:** query
- **Source system:** [Genesys Cloud CX](/systems/genesys-cloud-cx.md)

## Inputs

- agent_id
- date_range

## Outputs

- agent_schedules_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Genesys Cloud CX](/systems/genesys-cloud-cx.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- agent_id
- date_range

## Produces

- agent_schedules_records

# Examples

```
query_genesys_cloud_cx_agent_schedules(agent_id=<agent_id>, date_range=<date_range>)
```

# Citations

- [Genesys Cloud CX](/systems/genesys-cloud-cx.md)
