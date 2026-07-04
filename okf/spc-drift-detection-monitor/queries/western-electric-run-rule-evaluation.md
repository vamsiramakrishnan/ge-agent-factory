---
type: Query Capability
title: Evaluate each quality_checks time series per characteristic against Western E...
description: "Evaluate each quality_checks time series per characteristic against Western Electric zone rules (e.g., 4-of-5 consecutive points beyond 1 sigma on the same side of center) and cpk trend, flagging candidate SPC signals on the inspection_lots still awaiting usage_decision."
source_id: "western-electric-run-rule-evaluation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evaluate each quality_checks time series per characteristic against Western Electric zone rules (e.g., 4-of-5 consecutive points beyond 1 sigma on the same side of center) and cpk trend, flagging candidate SPC signals on the inspection_lots still awaiting usage_decision.

## Tools used

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)

## Runs in

- [western_electric_run_rule_evaluation](/workflow/western-electric-run-rule-evaluation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the SPC Drift Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spc-drift-detection-monitor-end-to-end.md)
- [Quality check 5041872 shows bore_diameter measured_value 12.4180 against limits 12.4000-12.4300 with cpk 1.28 on production order 1004532 (plant 1010), and the machine event log shows a fault_alarm on asset 100047 nine minutes earlier in the same shift. Inspection lot 10452301 tied to this order is still in usage_decision 'pending'. Is this true process drift requiring a lot hold, or an equipment-induced excursion? Walk me through the evidence and your recommendation.](/tests/spc-drift-detection-monitor-fault-confound.md)

# Citations

- [SPC Drift Detection Monitor Standard Operating Procedure](/documents/spc-drift-detection-monitor-sop.md)
- [CTQ Characteristic Control Plan and Out-of-Control Reaction Plan](/documents/spc-drift-detection-monitor-control-plan.md)
