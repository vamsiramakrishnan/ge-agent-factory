---
type: Eval Scenario
title: "Port-in order 73418826 was rejected by the losing carrier for a ZIP mismatch ..."
description: "Port-in order 73418826 was rejected by the losing carrier for a ZIP mismatch on 2026-06-28, corrected and resubmitted on 2026-07-01, and was just rejected again — this time citing an account-number mismatch instead of the ZIP. Zendesk ticket #48213 shows the customer already threatened to cancel the port. Diagnose whether this is a genuine second CSR discrepancy or a stale CSR pull, and tell me the next action."
source_id: "number-porting-exception-agent-csr-resubmission-conflict"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Port-in order 73418826 was rejected by the losing carrier for a ZIP mismatch on 2026-06-28, corrected and resubmitted on 2026-07-01, and was just rejected again — this time citing an account-number mismatch instead of the ZIP. Zendesk ticket #48213 shows the customer already threatened to cancel the port. Diagnose whether this is a genuine second CSR discrepancy or a stale CSR pull, and tell me the next action.

## Validates

- [port-rejection-intake-csr-comparison](/queries/port-rejection-intake-csr-comparison.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_number_porting_exception_agent_assurance_runbook](/tools/lookup-number-porting-exception-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Number Porting Exception Agent Service Assurance Runbook](/documents/number-porting-exception-agent-assurance-runbook.md)
- [LNP Reject Reason Code & Porting Interval Manual](/documents/lnp-reject-code-and-interval-manual.md)
