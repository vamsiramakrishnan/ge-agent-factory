---
type: Workflow Stage
title: "Fill Rate, Lead-Time & Invoice Scoring"
description: "Run query_bigquery_analytics_events against historical_metrics and cached_aggregates baselines in BigQuery to compute weekly fill rate, on-time delivery, lead-time variance, and invoice accuracy per vendor."
source_id: fill_rate_lead_time_invoice_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Fill Rate, Lead-Time & Invoice Scoring

Run query_bigquery_analytics_events against historical_metrics and cached_aggregates baselines in BigQuery to compute weekly fill rate, on-time delivery, lead-time variance, and invoice accuracy per vendor.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)

Next: [Compliance & Chargeback Evidence Assembly](/workflow/compliance-chargeback-evidence-assembly.md)
