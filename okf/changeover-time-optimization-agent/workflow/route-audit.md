---
type: Workflow Stage
title: "Route & Audit"
description: "Execute the approved resequencing through action_sap_s_4hana_pp_route in SAP S/4HANA PP with a full audit trail, and notify the Production Supervisor in real time when a live changeover on the floor exceeds 120% of standard so help can be routed to the line."
source_id: route_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Route & Audit

Execute the approved resequencing through action_sap_s_4hana_pp_route in SAP S/4HANA PP with a full audit trail, and notify the Production Supervisor in real time when a live changeover on the floor exceeds 120% of standard so help can be routed to the line.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_changeover_time_optimization_agent_sop](/tools/lookup-changeover-time-optimization-agent-sop.md)
- [action_sap_s_4hana_pp_route](/tools/action-sap-s-4hana-pp-route.md)
