---
type: Workflow Stage
title: Changeover Log Correlation
description: Pull process_orders and work_center_confirmations from SAP S/4HANA PP (query_sap_s_4hana_pp_process_orders) and correlate them against production_orders and machine_events in Siemens Opcenter MES (query_siemens_opcenter_mes_production_orders) for the same resource and shift window so every recorded changeover has a matched setup_time_min and event trail.
source_id: changeover_log_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Changeover Log Correlation

Pull process_orders and work_center_confirmations from SAP S/4HANA PP (query_sap_s_4hana_pp_process_orders) and correlate them against production_orders and machine_events in Siemens Opcenter MES (query_siemens_opcenter_mes_production_orders) for the same resource and shift window so every recorded changeover has a matched setup_time_min and event trail.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_changeover_time_optimization_agent_sop](/tools/lookup-changeover-time-optimization-agent-sop.md)
- [action_sap_s_4hana_pp_route](/tools/action-sap-s-4hana-pp-route.md)

Next: [Crew & Family Benchmarking](/workflow/crew-family-benchmarking.md)
