---
type: Workflow Stage
title: "Shift & Line Data Pull"
description: "Query production_orders and machine_events from Siemens Opcenter MES for the target plant, line, and shift window to assemble the run and downtime event log the Pareto will be built from."
source_id: shift_line_data_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Shift & Line Data Pull

Query production_orders and machine_events from Siemens Opcenter MES for the target plant, line, and shift window to assemble the run and downtime event log the Pareto will be built from.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)

Next: [Baseline & Variance Comparison](/workflow/baseline-variance-comparison.md)
