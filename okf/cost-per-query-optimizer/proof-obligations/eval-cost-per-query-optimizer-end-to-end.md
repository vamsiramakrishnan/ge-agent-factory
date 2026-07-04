---
type: Proof Obligation
title: "Golden eval obligation — Run the Cost-per-Query Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-cost-per-query-optimizer-end-to-end"
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

# Golden eval obligation — Run the Cost-per-Query Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [cost-per-query-optimizer-end-to-end](/tests/cost-per-query-optimizer-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_admin_analytics_events](/tools/query-bigquery-admin-analytics-events.md)
- [lookup_cost_per_query_optimizer_runbook](/tools/lookup-cost-per-query-optimizer-runbook.md)
- [action_bigquery_recommend](/tools/action-bigquery-recommend.md)

## Entities that must be referenced

- analytics_events
- alerts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [cost-per-query-optimizer-runbook](/documents/cost-per-query-optimizer-runbook.md)
