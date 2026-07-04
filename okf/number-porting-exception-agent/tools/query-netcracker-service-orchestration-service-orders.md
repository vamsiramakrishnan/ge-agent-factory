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

- [port_rejection_intake_csr_comparison](/workflow/port-rejection-intake-csr-comparison.md)
- [provisioning_fallout_correlation](/workflow/provisioning-fallout-correlation.md)
- [runbook_reject_code_evidence_validation](/workflow/runbook-reject-code-evidence-validation.md)
- [resubmission_drafting_or_escalation_audit](/workflow/resubmission-drafting-or-escalation-audit.md)

## Evals

- [Run the Number Porting Exception Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/number-porting-exception-agent-end-to-end.md)
- [Port-in order 73418826 was rejected by the losing carrier for a ZIP mismatch on 2026-06-28, corrected and resubmitted on 2026-07-01, and was just rejected again — this time citing an account-number mismatch instead of the ZIP. Zendesk ticket #48213 shows the customer already threatened to cancel the port. Diagnose whether this is a genuine second CSR discrepancy or a stale CSR pull, and tell me the next action.](/tests/number-porting-exception-agent-csr-resubmission-conflict.md)
- [Consumer port-in order 73982210 was submitted at 4:45pm on 2026-07-02 (a Thursday) and is still order_status in_flight with fallout_status none as of this morning, 2026-07-03. It's a simple port with no LNP complexity flags. BigQuery's analytics_events shows the current-week rejection baseline running at 9.5%. Is this order breaching the FCC simple-port interval, and what should the desk do?](/tests/number-porting-exception-agent-fcc-interval-edge.md)

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
