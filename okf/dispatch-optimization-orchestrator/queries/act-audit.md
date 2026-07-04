---
type: Query Capability
title: "Execute the route step in Oracle Field Service with a full audit trail, and e..."
description: "Execute the route step in Oracle Field Service with a full audit trail, and escalate exceptions to the Field Operations Supervisor."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in Oracle Field Service with a full audit trail, and escalate exceptions to the Field Operations Supervisor.

## Tools used

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Dispatch Optimization Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dispatch-optimization-orchestrator-end-to-end.md)

# Citations

- [Dispatch Optimization Orchestrator Service Assurance Runbook](/documents/dispatch-optimization-orchestrator-assurance-runbook.md)
