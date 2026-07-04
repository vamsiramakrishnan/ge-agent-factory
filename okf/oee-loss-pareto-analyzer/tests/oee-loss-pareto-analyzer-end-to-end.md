---
type: Eval Scenario
title: Run the OEE Loss Pareto Analyzer workflow for the current period. Cite the re...
description: "Run the OEE Loss Pareto Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "oee-loss-pareto-analyzer-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the OEE Loss Pareto Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [shift-line-data-pull](/queries/shift-line-data-pull.md)

## Mechanisms to call

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)

## Success rubric

Action publish executed against Siemens Opcenter MES, with audit-trail entry and Continuous Improvement Lead notified of outcomes.

# Citations

- [OEE Loss Pareto Analyzer Standard Operating Procedure](/documents/oee-loss-pareto-analyzer-sop.md)
