---
type: Query Capability
title: "Execute the escalate step in Oracle Field Service with a full audit trail, an..."
description: "Execute the escalate step in Oracle Field Service with a full audit trail, and escalate exceptions to the Construction Program Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Oracle Field Service with a full audit trail, and escalate exceptions to the Construction Program Manager.

## Tools used

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_escalate](/tools/action-oracle-field-service-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Fiber Build Permitting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fiber-build-permitting-agent-end-to-end.md)

# Citations

- [Fiber Build Permitting Agent Service Assurance Runbook](/documents/fiber-build-permitting-agent-assurance-runbook.md)
