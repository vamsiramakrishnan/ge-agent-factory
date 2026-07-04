---
type: Proof Obligation
title: "Golden eval obligation — Run the Feature Store Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-feature-store-manager-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Feature Store Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [feature-store-manager-end-to-end](/tests/feature-store-manager-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_it_2_it_2_records](/tools/query-it-2-it-2-records.md)
- [query_it_3_it_3_records](/tools/query-it-3-it-3-records.md)
- [lookup_feature_store_manager_runbook](/tools/lookup-feature-store-manager-runbook.md)
- [action_it_2_recommend](/tools/action-it-2-recommend.md)

## Entities that must be referenced

- analytics_events
- it_2_records
- it_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [feature-store-manager-runbook](/documents/feature-store-manager-runbook.md)
