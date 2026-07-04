---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in Netcracker Service Orchestration with a full audit trail, and escalate exceptions to the Porting Desk Analyst."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in Netcracker Service Orchestration with a full audit trail, and escalate exceptions to the Porting Desk Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_number_porting_exception_agent_assurance_runbook](/tools/lookup-number-porting-exception-agent-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)
