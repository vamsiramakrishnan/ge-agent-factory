---
type: Workflow Stage
title: "Intent, Margin & Stock-Risk Scoring"
description: "Rank each abandoned cart against product_catalog_entries availability/catalog_status and BigQuery analytics_events/historical_metrics baselines (query_bigquery_analytics_events) to separate high-intent shoppers from bots and price-checkers."
source_id: intent_margin_stock_risk_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Intent, Margin & Stock-Risk Scoring

Rank each abandoned cart against product_catalog_entries availability/catalog_status and BigQuery analytics_events/historical_metrics baselines (query_bigquery_analytics_events) to separate high-intent shoppers from bots and price-checkers.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)

Next: [Recovery Play & Incentive Guardrail Selection](/workflow/recovery-play-incentive-guardrail-selection.md)
