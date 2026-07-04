---
type: Proof Obligation
title: "Golden eval obligation — Port-in order 73418826 was rejected by the losing carrier for a ZIP mismatch on 2026-06-28, corrected and resubmitted on 2026-07-01, and was just rejected again — this time citing an account-number mismatch instead of the ZIP. Zendesk ticket #48213 shows the customer already threatened to cancel the port. Diagnose whether this is a genuine second CSR discrepancy or a stale CSR pull, and tell me the next action."
description: golden eval proof obligation
source_id: "eval-number-porting-exception-agent-csr-resubmission-conflict"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Port-in order 73418826 was rejected by the losing carrier for a ZIP mismatch on 2026-06-28, corrected and resubmitted on 2026-07-01, and was just rejected again — this time citing an account-number mismatch instead of the ZIP. Zendesk ticket #48213 shows the customer already threatened to cancel the port. Diagnose whether this is a genuine second CSR discrepancy or a stale CSR pull, and tell me the next action.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [number-porting-exception-agent-csr-resubmission-conflict](/tests/number-porting-exception-agent-csr-resubmission-conflict.md)


## Mechanisms

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_number_porting_exception_agent_assurance_runbook](/tools/lookup-number-porting-exception-agent-assurance-runbook.md)

## Entities that must be referenced

- service_orders
- tickets

## Forbidden behaviors

- auto-generating a third resubmission without re-pulling a fresh CSR record
- treating the customer's cancellation threat in the ticket as grounds to bypass evidence gathering

# Citations

- [number-porting-exception-agent-assurance-runbook](/documents/number-porting-exception-agent-assurance-runbook.md)
- [lnp-reject-code-and-interval-manual](/documents/lnp-reject-code-and-interval-manual.md)
