---
type: Proof Obligation
title: "Golden eval obligation — Carrier Estes has posted a 90.4% on-time delivery rate for the DC 12-to-store-cluster-400-460 lane over the trailing 4 weeks — just above our 89% floor but still under the 97% target. Cached_aggregates shows their cost-per-package variance at +6.2% against contract. Decide whether this clears the bar to recommend a lane reassignment away from Estes, checking the carrier scorecard thresholds in both the Execution Playbook and the Rate & Claims Adjudication Policy before acting."
description: golden eval proof obligation
source_id: "eval-carrier-delivery-sla-analyzer-lane-reassignment-threshold"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Carrier Estes has posted a 90.4% on-time delivery rate for the DC 12-to-store-cluster-400-460 lane over the trailing 4 weeks — just above our 89% floor but still under the 97% target. Cached_aggregates shows their cost-per-package variance at +6.2% against contract. Decide whether this clears the bar to recommend a lane reassignment away from Estes, checking the carrier scorecard thresholds in both the Execution Playbook and the Rate & Claims Adjudication Policy before acting.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [carrier-delivery-sla-analyzer-lane-reassignment-threshold](/tests/carrier-delivery-sla-analyzer-lane-reassignment-threshold.md)


## Mechanisms

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)

## Entities that must be referenced

- dashboards
- cached_aggregates
- analytics_events

## Forbidden behaviors

- Treating 90.4% as an automatic reassignment trigger without checking the sustained-window and dollar thresholds from the governing documents
- Executing action_manhattan_active_wm_recommend without citing both the playbook and the rate and claims policy

# Citations

- [carrier-delivery-sla-analyzer-execution-playbook](/documents/carrier-delivery-sla-analyzer-execution-playbook.md)
- [carrier-rate-claims-adjudication-policy](/documents/carrier-rate-claims-adjudication-policy.md)
