---
type: Workflow Stage
title: Retrieve Records
description: Query process orders and work center confirmations from SAP S/4HANA PP and correlate with Siemens Opcenter MES for the Changeover Time Optimization Agent workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query process orders and work center confirmations from SAP S/4HANA PP and correlate with Siemens Opcenter MES for the Changeover Time Optimization Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_changeover_time_optimization_agent_sop](/tools/lookup-changeover-time-optimization-agent-sop.md)
- [action_sap_s_4hana_pp_route](/tools/action-sap-s-4hana-pp-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
