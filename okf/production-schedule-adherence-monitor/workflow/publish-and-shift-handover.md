---
type: Workflow Stage
title: Publish and shift handover
description: "Execute action_sap_s_4hana_pp_publish to push the approved re-sequence back to SAP S/4HANA PP with a full audit trail, refresh the shift-start adherence dashboard via query_looker_dashboards, and notify the Production Scheduler of the top three at-risk orders."
source_id: publish_and_shift_handover
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish and shift handover

Execute action_sap_s_4hana_pp_publish to push the approved re-sequence back to SAP S/4HANA PP with a full audit trail, refresh the shift-start adherence dashboard via query_looker_dashboards, and notify the Production Scheduler of the top three at-risk orders.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_production_schedule_adherence_monitor_sop](/tools/lookup-production-schedule-adherence-monitor-sop.md)
- [action_sap_s_4hana_pp_publish](/tools/action-sap-s-4hana-pp-publish.md)
