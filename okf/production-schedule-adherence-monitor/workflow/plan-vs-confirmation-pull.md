---
type: Workflow Stage
title: "Plan-vs-confirmation pull"
description: "Query SAP S/4HANA PP process_orders and Siemens Opcenter MES production_orders for the current shift via query_sap_s_4hana_pp_process_orders and query_siemens_opcenter_mes_production_orders, matching on order_number and material_number to find orders where confirmed_qty is falling behind scheduled_start."
source_id: plan_vs_confirmation_pull
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Plan-vs-confirmation pull

Query SAP S/4HANA PP process_orders and Siemens Opcenter MES production_orders for the current shift via query_sap_s_4hana_pp_process_orders and query_siemens_opcenter_mes_production_orders, matching on order_number and material_number to find orders where confirmed_qty is falling behind scheduled_start.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_production_schedule_adherence_monitor_sop](/tools/lookup-production-schedule-adherence-monitor-sop.md)
- [action_sap_s_4hana_pp_publish](/tools/action-sap-s-4hana-pp-publish.md)

Next: [Staging and constraint check](/workflow/staging-and-constraint-check.md)
