---
type: Workflow Stage
title: Retrieve Records
description: Query production orders and machine events from Siemens Opcenter MES and correlate with SAP S/4HANA PP for the Scrap and Rework Analytics Engine workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query production orders and machine events from Siemens Opcenter MES and correlate with SAP S/4HANA PP for the Scrap and Rework Analytics Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
