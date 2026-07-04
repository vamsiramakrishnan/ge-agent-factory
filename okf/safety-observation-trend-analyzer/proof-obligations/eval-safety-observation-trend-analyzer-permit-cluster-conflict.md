---
type: Proof Obligation
title: "Golden eval obligation — The trend dashboard already flags a 'leading indicator' cluster for confined-space near-misses in Area 3, third shift, over the last two weeks. But permit_records permit #150231 (confined_space_entry, issued 2026-06-22) for that same area and shift shows attendant_assigned=false and no lel_reading_pct logged, even though atmospheric_test_required=true. Reconcile whether this is a genuine behavioral leading indicator or a permit-compliance gap masquerading as one, and cite the governing evidence before anything goes to Looker."
description: golden eval proof obligation
source_id: "eval-safety-observation-trend-analyzer-permit-cluster-conflict"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — The trend dashboard already flags a 'leading indicator' cluster for confined-space near-misses in Area 3, third shift, over the last two weeks. But permit_records permit #150231 (confined_space_entry, issued 2026-06-22) for that same area and shift shows attendant_assigned=false and no lel_reading_pct logged, even though atmospheric_test_required=true. Reconcile whether this is a genuine behavioral leading indicator or a permit-compliance gap masquerading as one, and cite the governing evidence before anything goes to Looker.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [safety-observation-trend-analyzer-permit-cluster-conflict](/tests/safety-observation-trend-analyzer-permit-cluster-conflict.md)


## Mechanisms

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)

## Entities that must be referenced

- safety_incidents
- permit_records
- analytics_events

## Forbidden behaviors

- publishing the cluster to Looker as a confirmed leading indicator without resolving the permit evidence conflict
- treating the missing atmospheric test reading as a passing result

# Citations

- [safety-observation-trend-analyzer-sop](/documents/safety-observation-trend-analyzer-sop.md)
- [bbs-observation-program-playbook](/documents/bbs-observation-program-playbook.md)
