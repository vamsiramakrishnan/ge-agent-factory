---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the route step in SAP S/4HANA PP with a full audit trail, and escalate exceptions to the Production Supervisor."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the route step in SAP S/4HANA PP with a full audit trail, and escalate exceptions to the Production Supervisor.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [action_sap_s_4hana_pp_route](/tools/action-sap-s-4hana-pp-route.md)
