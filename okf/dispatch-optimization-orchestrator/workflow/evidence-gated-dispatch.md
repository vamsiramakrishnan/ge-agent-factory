---
type: Workflow Stage
title: "Evidence-Gated Dispatch"
description: "Cite the governing sections of the Dispatch Optimization Orchestrator Service Assurance Runbook before calling action_oracle_field_service_route, and refuse or escalate when two-system evidence is missing."
source_id: evidence_gated_dispatch
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence-Gated Dispatch

Cite the governing sections of the Dispatch Optimization Orchestrator Service Assurance Runbook before calling action_oracle_field_service_route, and refuse or escalate when two-system evidence is missing.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_dispatch_optimization_orchestrator_assurance_runbook](/tools/lookup-dispatch-optimization-orchestrator-assurance-runbook.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)

Next: [ETA Notification & Audit Close-Out](/workflow/eta-notification-audit-close-out.md)
