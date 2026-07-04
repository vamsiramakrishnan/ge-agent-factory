---
type: Eval Scenario
title: Run the Scrap and Rework Analytics Engine workflow for the current period. Ci...
description: "Run the Scrap and Rework Analytics Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "scrap-and-rework-analytics-engine-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Scrap and Rework Analytics Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [nightly-mes-sap-scrap-attribution-pull](/queries/nightly-mes-sap-scrap-attribution-pull.md)

## Mechanisms to call

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)

## Success rubric

Action publish executed against Siemens Opcenter MES, with audit-trail entry and Plant Controller notified of outcomes.

# Citations

- [Scrap and Rework Analytics Engine Standard Operating Procedure](/documents/scrap-and-rework-analytics-engine-sop.md)
