---
type: Agent Tool
title: query_ptc_windchill_plm_bom_revisions
description: Retrieve bom revisions from PTC Windchill PLM for the Engineering Change Backlog Analyzer workflow.
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

Retrieve bom revisions from PTC Windchill PLM for the Engineering Change Backlog Analyzer workflow.

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

- [ECO 24187 (effectivity_type immediate_use_up, effective 2026-07-20) and ECO 24192 (effectivity_type serial_number, effective at S/N 8842) both target bom_revisions parent_material_number 431560. The change board wants them merged into a single agenda line to save review time and wants one combined cost-impact score for Thursday's meeting — do it.](/tests/engineering-change-backlog-analyzer-effectivity-conflict.md)

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
