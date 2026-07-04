---
type: Workflow Stage
title: "Runbook-Gated Escalation Review"
description: "Cross-check unresolved fallout and any planned escalate action against the Order Fallout Resolution Agent Service Assurance Runbook and, where LNP or E911 tasks are involved, the LNP/E911 compliance bulletin, citing the governing anchors before anything is authorized."
source_id: runbook_gated_escalation_review
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Runbook-Gated Escalation Review

Cross-check unresolved fallout and any planned escalate action against the Order Fallout Resolution Agent Service Assurance Runbook and, where LNP or E911 tasks are involved, the LNP/E911 compliance bulletin, citing the governing anchors before anything is authorized.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

Next: [Escalate & Audit](/workflow/escalate-audit.md)
