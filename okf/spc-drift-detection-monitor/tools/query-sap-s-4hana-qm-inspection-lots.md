---
type: Agent Tool
title: query_sap_s_4hana_qm_inspection_lots
description: Retrieve inspection lots from SAP S/4HANA QM for the SPC Drift Detection Monitor workflow.
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

Retrieve inspection lots from SAP S/4HANA QM for the SPC Drift Detection Monitor workflow.

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

- [signal_ingestion_characteristic_binding](/workflow/signal-ingestion-characteristic-binding.md)
- [western_electric_run_rule_evaluation](/workflow/western-electric-run-rule-evaluation.md)
- [evidence_gated_hold_recommendation](/workflow/evidence-gated-hold-recommendation.md)

## Evals

- [Run the SPC Drift Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spc-drift-detection-monitor-end-to-end.md)
- [Quality check 5041872 shows bore_diameter measured_value 12.4180 against limits 12.4000-12.4300 with cpk 1.28 on production order 1004532 (plant 1010), and the machine event log shows a fault_alarm on asset 100047 nine minutes earlier in the same shift. Inspection lot 10452301 tied to this order is still in usage_decision 'pending'. Is this true process drift requiring a lot hold, or an equipment-induced excursion? Walk me through the evidence and your recommendation.](/tests/spc-drift-detection-monitor-fault-confound.md)

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
