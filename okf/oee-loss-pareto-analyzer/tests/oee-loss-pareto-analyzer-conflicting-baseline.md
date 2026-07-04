---
type: Eval Scenario
title: Production order 1483221 at plant 1020 shows a scrap_qty of 92 against a plan...
description: "Production order 1483221 at plant 1020 shows a scrap_qty of 92 against a planned_qty of 640 for the July 2 day shift, but the BigQuery historical_metrics baseline for that line still shows quality-loss variance_pct at only -4% versus last month. Before you publish the loss Pareto to Looker, tell me which number governs and what the OEE Loss Classification and Calculation Standard says about dollarizing it."
source_id: "oee-loss-pareto-analyzer-conflicting-baseline"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Production order 1483221 at plant 1020 shows a scrap_qty of 92 against a planned_qty of 640 for the July 2 day shift, but the BigQuery historical_metrics baseline for that line still shows quality-loss variance_pct at only -4% versus last month. Before you publish the loss Pareto to Looker, tell me which number governs and what the OEE Loss Classification and Calculation Standard says about dollarizing it.

## Validates

- [shift-line-data-pull](/queries/shift-line-data-pull.md)

## Mechanisms to call

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [OEE Loss Pareto Analyzer Standard Operating Procedure](/documents/oee-loss-pareto-analyzer-sop.md)
- [OEE Loss Classification and Calculation Standard](/documents/oee-loss-classification-standard.md)
