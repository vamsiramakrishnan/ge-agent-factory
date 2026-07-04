---
type: Query Capability
title: Execute the draft step in Netcracker Service Orchestration with a full audit ...
description: "Execute the draft step in Netcracker Service Orchestration with a full audit trail, and escalate exceptions to the Delivery Program Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the draft step in Netcracker Service Orchestration with a full audit trail, and escalate exceptions to the Delivery Program Manager.

## Tools used

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [action_netcracker_service_orchestration_draft](/tools/action-netcracker-service-orchestration-draft.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Order Jeopardy Prediction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/order-jeopardy-prediction-engine-end-to-end.md)

# Citations

- [Order Jeopardy Prediction Engine Service Assurance Runbook](/documents/order-jeopardy-prediction-engine-assurance-runbook.md)
