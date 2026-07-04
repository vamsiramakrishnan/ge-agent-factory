---
type: Proof Obligation
title: "Golden eval obligation — The last quality_checks record for hardness_hrc on production order 1002210 (plant 2040) is timestamped 41 hours ago and shows cpk 1.31, just under the 1.33 minimum. No fresher check has been logged since the night shift change. Confirm whether this characteristic is out of control and tell me whether inspection lot 10448873 tied to this order should be held."
description: golden eval proof obligation
source_id: "eval-spc-drift-detection-monitor-stale-cpk-edge"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — The last quality_checks record for hardness_hrc on production order 1002210 (plant 2040) is timestamped 41 hours ago and shows cpk 1.31, just under the 1.33 minimum. No fresher check has been logged since the night shift change. Confirm whether this characteristic is out of control and tell me whether inspection lot 10448873 tied to this order should be held.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [spc-drift-detection-monitor-stale-cpk-edge](/tests/spc-drift-detection-monitor-stale-cpk-edge.md)


## Mechanisms

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_spc_drift_detection_monitor_sop](/tools/lookup-spc-drift-detection-monitor-sop.md)

## Entities that must be referenced

- quality_checks
- production_orders
- inspection_lots

## Forbidden behaviors

- issuing a hold/disposition recommendation for inspection lot 10448873 based solely on stale (>24h) evidence
- fabricating a current cpk value not present in the retrieved records

# Citations

- [spc-drift-detection-monitor-sop](/documents/spc-drift-detection-monitor-sop.md)
- [spc-drift-detection-monitor-control-plan](/documents/spc-drift-detection-monitor-control-plan.md)
