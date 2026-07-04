---
type: Agent Tool
title: query_ptc_windchill_plm_bom_revisions
description: Retrieve bom revisions from PTC Windchill PLM for the NPI Launch Readiness Orchestrator workflow.
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

# query_ptc_windchill_plm_bom_revisions

Retrieve bom revisions from PTC Windchill PLM for the NPI Launch Readiness Orchestrator workflow.

- **Kind:** query
- **Source system:** [PTC Windchill PLM](/systems/ptc-windchill-plm.md)

## Inputs

- bom_number
- date_range

## Outputs

- bom_revisions_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [PTC Windchill PLM](/systems/ptc-windchill-plm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- bom_number
- date_range

## Produces

- bom_revisions_records

# Examples

```
query_ptc_windchill_plm_bom_revisions(bom_number=<bom_number>, date_range=<date_range>)
```

# Citations

- [PTC Windchill PLM](/systems/ptc-windchill-plm.md)
