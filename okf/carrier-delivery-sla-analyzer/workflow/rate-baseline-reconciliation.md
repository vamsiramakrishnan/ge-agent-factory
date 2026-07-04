---
type: Workflow Stage
title: "Rate & Baseline Reconciliation"
description: "Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to isolate carrier-level SLA variance and cost-per-package drift from the contracted rate card."
source_id: rate_baseline_reconciliation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Rate & Baseline Reconciliation

Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to isolate carrier-level SLA variance and cost-per-package drift from the contracted rate card.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)

Next: [Lane & Carrier Scorecard Scoring](/workflow/lane-carrier-scorecard-scoring.md)
