---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in Netcracker Service Orchestration with a full audit trail, and escalate exceptions to the Provisioning Engineer."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in Netcracker Service Orchestration with a full audit trail, and escalate exceptions to the Provisioning Engineer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)
