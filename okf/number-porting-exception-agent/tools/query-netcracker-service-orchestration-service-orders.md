---
type: Agent Tool
title: query_netcracker_service_orchestration_service_orders
description: Retrieve service orders from Netcracker Service Orchestration for the Number Porting Exception Agent workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_netcracker_service_orchestration_service_orders

Retrieve service orders from Netcracker Service Orchestration for the Number Porting Exception Agent workflow.

- **Kind:** query
- **Source system:** [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)

## Inputs

- order_number
- date_range

## Outputs

- service_orders_records
- service_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [validate_evidence](/workflow/validate-evidence.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Number Porting Exception Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/number-porting-exception-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- order_number
- date_range

## Produces

- service_orders_records
- service_orders_summary

# Examples

```
query_netcracker_service_orchestration_service_orders(order_number=<order_number>, date_range=<date_range>)
```

# Citations

- [Netcracker Service Orchestration](/systems/netcracker-service-orchestration.md)
