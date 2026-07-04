---
type: Agent Tool
title: query_sap_s_4hana_qm_inspection_lots
description: Retrieve inspection lots from SAP S/4HANA QM for the Batch Record Review Analyzer workflow.
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

# query_sap_s_4hana_qm_inspection_lots

Retrieve inspection lots from SAP S/4HANA QM for the Batch Record Review Analyzer workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)

## Inputs

- inspection_lot_number
- date_range

## Outputs

- inspection_lots_records
- inspection_lots_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [batch_closure_intake](/workflow/batch-closure-intake.md)
- [spec_control_limit_screening](/workflow/spec-control-limit-screening.md)
- [nc_capa_cross_reference](/workflow/nc-capa-cross-reference.md)
- [sop_gated_release_audit](/workflow/sop-gated-release-audit.md)

## Evals

- [Run the Batch Record Review Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/batch-record-review-analyzer-end-to-end.md)
- [Inspection lot 14582061 (material 452891) is running under skip-lot sampling. Quality check 5183042 on characteristic bore_diameter for that lot just came back at measured_value 12.4188 against limits 12.4000-12.4150 -- a fail -- but the lot's usage_decision in SAP S/4HANA QM is still showing accepted from Tuesday's run. Can we ship it?](/tests/batch-record-review-analyzer-skip-lot-fail-conflict.md)
- [Nonconformance NC 642187 (severity critical, mrb_required true) was detected against material 452216 eleven days ago. The linked CAPA 74381 is still sitting in containment status and effectiveness_verified is false. Production wants inspection lot 14577903, same material, released today -- walk me through whether it's clear.](/tests/batch-record-review-analyzer-capa-effectiveness-gap.md)

## Evidence emitted

- source_system_record

## Required inputs

- inspection_lot_number
- date_range

## Produces

- inspection_lots_records
- inspection_lots_summary

# Examples

```
query_sap_s_4hana_qm_inspection_lots(inspection_lot_number=<inspection_lot_number>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA QM](/systems/sap-s-4hana-qm.md)
