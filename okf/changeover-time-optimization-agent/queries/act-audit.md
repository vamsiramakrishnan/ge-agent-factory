---
type: Query Capability
title: "Execute the route step in SAP S/4HANA PP with a full audit trail, and escalat..."
description: "Execute the route step in SAP S/4HANA PP with a full audit trail, and escalate exceptions to the Production Supervisor."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in SAP S/4HANA PP with a full audit trail, and escalate exceptions to the Production Supervisor.

## Tools used

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [action_sap_s_4hana_pp_route](/tools/action-sap-s-4hana-pp-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Changeover Time Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/changeover-time-optimization-agent-end-to-end.md)

# Citations

- [Changeover Time Optimization Agent Standard Operating Procedure](/documents/changeover-time-optimization-agent-sop.md)
