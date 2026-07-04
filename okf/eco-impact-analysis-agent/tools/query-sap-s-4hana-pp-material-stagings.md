---
type: Agent Tool
title: query_sap_s_4hana_pp_material_stagings
description: Retrieve material stagings from SAP S/4HANA PP for the ECO Impact Analysis Agent workflow.
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

# query_sap_s_4hana_pp_material_stagings

Retrieve material stagings from SAP S/4HANA PP for the ECO Impact Analysis Agent workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)

## Inputs

- staging_number
- date_range

## Outputs

- material_stagings_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [ECO 24831 (class_1_form_fit_function, effectivity_type=immediate_use_up, effectivity_date=2026-07-10) supersedes bom revision C for material 447213. Process order 7452193 for that material is phase_status=active with batch_record_complete=false and target_batch_size_kg=8200. Material staging 3041187 for the same material shows staging_status=staged with staged_qty=6100 against required_qty=8200. Tell me whether we can cut in the ECO on the proposed date.](/tests/eco-impact-analysis-agent-cutin-conflict.md)

## Evidence emitted

- source_system_record

## Required inputs

- staging_number
- date_range

## Produces

- material_stagings_records

# Examples

```
query_sap_s_4hana_pp_material_stagings(staging_number=<staging_number>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)
