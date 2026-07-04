---
type: Workflow Stage
title: Retrieve Records
description: Query production orders and machine events from Siemens Opcenter MES for the OEE Loss Pareto Analyzer workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query production orders and machine events from Siemens Opcenter MES for the OEE Loss Pareto Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
