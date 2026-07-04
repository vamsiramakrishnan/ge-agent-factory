---
type: Workflow Stage
title: "Auto-Remediation & Replay"
description: "Apply the known-pattern fix (address normalization, port/NE conflict resolution) to the affected provisioning_tasks and replay the corrected service_orders record through the Netcracker Service Orchestration flow-through engine, watching task_status for completed."
source_id: auto_remediation_replay
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Auto-Remediation & Replay

Apply the known-pattern fix (address normalization, port/NE conflict resolution) to the affected provisioning_tasks and replay the corrected service_orders record through the Netcracker Service Orchestration flow-through engine, watching task_status for completed.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Runbook-Gated Escalation Review](/workflow/runbook-gated-escalation-review.md)
