---
type: Workflow Stage
title: "Nightly MES-SAP Scrap Attribution Pull"
description: "Query production_orders, machine_events, and quality_checks from Siemens Opcenter MES and join against process_orders and work_center_confirmations from SAP S/4HANA PP to attribute scrap_qty and scrap dollars down to machine, shift, material lot, and operator."
source_id: nightly_mes_sap_scrap_attribution_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly MES-SAP Scrap Attribution Pull

Query production_orders, machine_events, and quality_checks from Siemens Opcenter MES and join against process_orders and work_center_confirmations from SAP S/4HANA PP to attribute scrap_qty and scrap dollars down to machine, shift, material lot, and operator.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)

Next: [Rework Loop & Order-Number Reconciliation](/workflow/rework-loop-order-number-reconciliation.md)
