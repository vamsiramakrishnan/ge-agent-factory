---
type: Proof Obligation
title: "Golden eval obligation — Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-slo-sli-monitor-reporter-end-to-end"
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

# Golden eval obligation — Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [slo-sli-monitor-reporter-end-to-end](/tests/slo-sli-monitor-reporter-end-to-end.md)


## Mechanisms

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_slo_sli_monitor_reporter_runbook](/tools/lookup-slo-sli-monitor-reporter-runbook.md)
- [action_datadog_recommend](/tools/action-datadog-recommend.md)

## Entities that must be referenced

- alerts
- incidents
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [slo-sli-monitor-reporter-runbook](/documents/slo-sli-monitor-reporter-runbook.md)
