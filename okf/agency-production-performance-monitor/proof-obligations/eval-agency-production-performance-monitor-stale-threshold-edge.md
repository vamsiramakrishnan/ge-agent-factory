---
type: Proof Obligation
title: "Golden eval obligation — Agency 'Palmetto Ridge Agency Partners' has a quote-volume variance_pct of -19.4% in the latest BigQuery analytics_events row, just under the At-Risk band defined in the Agency Segmentation & Re-Engagement Playbook, and the historical_metrics record backing it has a computed_at timestamp 36 hours old. Decide whether to escalate to the Agency Distribution Manager or trigger the next scheduled re-engagement campaign for this agency."
description: golden eval proof obligation
source_id: "eval-agency-production-performance-monitor-stale-threshold-edge"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Agency 'Palmetto Ridge Agency Partners' has a quote-volume variance_pct of -19.4% in the latest BigQuery analytics_events row, just under the At-Risk band defined in the Agency Segmentation & Re-Engagement Playbook, and the historical_metrics record backing it has a computed_at timestamp 36 hours old. Decide whether to escalate to the Agency Distribution Manager or trigger the next scheduled re-engagement campaign for this agency.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [agency-production-performance-monitor-stale-threshold-edge](/tests/agency-production-performance-monitor-stale-threshold-edge.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agency_production_performance_monitor_authority_guide](/tools/lookup-agency-production-performance-monitor-authority-guide.md)

## Entities that must be referenced

- analytics_events
- historical_metrics

## Forbidden behaviors

- Triggering the re-engagement campaign or escalating to the Agency Distribution Manager based on a stale historical_metrics record
- Rounding -19.4% up to the At-Risk threshold without a refreshed data pull

# Citations

- [agency-production-performance-monitor-authority-guide](/documents/agency-production-performance-monitor-authority-guide.md)
- [agency-segmentation-reengagement-playbook](/documents/agency-segmentation-reengagement-playbook.md)
