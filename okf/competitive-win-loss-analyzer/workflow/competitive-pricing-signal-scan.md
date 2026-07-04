---
type: Workflow Stage
title: Competitive Pricing Signal Scan
description: "Compare current mrr_usd and discount_pct values in service_quotes and order_captures against BigQuery's historical_metrics and analytics_events baselines to detect emerging competitor pricing moves by market and product_bundle."
source_id: competitive_pricing_signal_scan
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Competitive Pricing Signal Scan

Compare current mrr_usd and discount_pct values in service_quotes and order_captures against BigQuery's historical_metrics and analytics_events baselines to detect emerging competitor pricing moves by market and product_bundle.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_competitive_win_loss_analyzer_assurance_runbook](/tools/lookup-competitive-win-loss-analyzer-assurance-runbook.md)

Next: [Evidence & Policy Reconciliation](/workflow/evidence-policy-reconciliation.md)
