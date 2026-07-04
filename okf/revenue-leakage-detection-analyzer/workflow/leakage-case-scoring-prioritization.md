---
type: Workflow Stage
title: "Leakage Case Scoring & Prioritization"
description: "Score variance_pct anomalies from analytics_events and Looker dashboards against historical_metrics baselines, then rank leakage cases by recoverable_amount, credit_class, and account_status for the Revenue Assurance Analyst queue."
source_id: leakage_case_scoring_prioritization
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Leakage Case Scoring & Prioritization

Score variance_pct anomalies from analytics_events and Looker dashboards against historical_metrics baselines, then rank leakage cases by recoverable_amount, credit_class, and account_status for the Revenue Assurance Analyst queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_revenue_leakage_detection_analyzer_assurance_runbook](/tools/lookup-revenue-leakage-detection-analyzer-assurance-runbook.md)

Next: [Runbook-Gated Evidence Validation](/workflow/runbook-gated-evidence-validation.md)
