---
type: Workflow Stage
title: "Western Electric Run-Rule Evaluation"
description: "Evaluate each quality_checks time series per characteristic against Western Electric zone rules (e.g., 4-of-5 consecutive points beyond 1 sigma on the same side of center) and cpk trend, flagging candidate SPC signals on the inspection_lots still awaiting usage_decision."
source_id: western_electric_run_rule_evaluation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Western Electric Run-Rule Evaluation

Evaluate each quality_checks time series per characteristic against Western Electric zone rules (e.g., 4-of-5 consecutive points beyond 1 sigma on the same side of center) and cpk trend, flagging candidate SPC signals on the inspection_lots still awaiting usage_decision.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)

Next: [Baseline & Capability Reconciliation](/workflow/baseline-capability-reconciliation.md)
