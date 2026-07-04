---
type: Proof Obligation
title: "Golden eval obligation — Run the SPC Drift Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-spc-drift-detection-monitor-end-to-end"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the SPC Drift Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [spc-drift-detection-monitor-end-to-end](/tests/spc-drift-detection-monitor-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_spc_drift_detection_monitor_sop](/tools/lookup-spc-drift-detection-monitor-sop.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)

## Entities that must be referenced

- inspection_lots
- production_orders
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [spc-drift-detection-monitor-sop](/documents/spc-drift-detection-monitor-sop.md)
