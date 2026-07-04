---
type: Query Capability
title: Execute the file step in Netcracker Service Orchestration with a full audit t...
description: "Execute the file step in Netcracker Service Orchestration with a full audit trail, and escalate exceptions to the Provisioning Engineer."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the file step in Netcracker Service Orchestration with a full audit trail, and escalate exceptions to the Provisioning Engineer.

## Tools used

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [action_netcracker_service_orchestration_file](/tools/action-netcracker-service-orchestration-file.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the eSIM Activation Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/esim-activation-orchestrator-end-to-end.md)

# Citations

- [eSIM Activation Orchestrator Service Assurance Runbook](/documents/esim-activation-orchestrator-assurance-runbook.md)
