---
type: Query Capability
title: "Execute the escalate step in IBM Maximo with a full audit trail, and escalate..."
description: "Execute the escalate step in IBM Maximo with a full audit trail, and escalate exceptions to the Maintenance Supervisor."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in IBM Maximo with a full audit trail, and escalate exceptions to the Maintenance Supervisor.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_escalate](/tools/action-ibm-maximo-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Work Order Backlog Triage Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/work-order-backlog-triage-orchestrator-end-to-end.md)

# Citations

- [Work Order Backlog Triage Orchestrator Standard Operating Procedure](/documents/work-order-backlog-triage-orchestrator-sop.md)
