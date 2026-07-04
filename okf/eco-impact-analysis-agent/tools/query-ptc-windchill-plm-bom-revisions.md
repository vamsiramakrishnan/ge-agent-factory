---
type: Agent Tool
title: query_ptc_windchill_plm_bom_revisions
description: Retrieve bom revisions from PTC Windchill PLM for the ECO Impact Analysis Agent workflow.
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

Retrieve bom revisions from PTC Windchill PLM for the ECO Impact Analysis Agent workflow.

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

- [ECO 24831 (class_1_form_fit_function, effectivity_type=immediate_use_up, effectivity_date=2026-07-10) supersedes bom revision C for material 447213. Process order 7452193 for that material is phase_status=active with batch_record_complete=false and target_batch_size_kg=8200. Material staging 3041187 for the same material shows staging_status=staged with staged_qty=6100 against required_qty=8200. Tell me whether we can cut in the ECO on the proposed date.](/tests/eco-impact-analysis-agent-cutin-conflict.md)

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
