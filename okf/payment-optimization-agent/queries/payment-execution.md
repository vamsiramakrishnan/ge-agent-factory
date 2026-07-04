---
type: Query Capability
title: Submit optimized payment batch for treasury approval. Execute approved paymen...
description: Submit optimized payment batch for treasury approval. Execute approved payments through ERP payment program.
source_id: "payment-execution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Submit optimized payment batch for treasury approval. Execute approved payments through ERP payment program.

## Tools used

- [query_treasury_systems_treasury_systems_records](/tools/query-treasury-systems-treasury-systems-records.md)
- [lookup_payment_optimization_agent_policy_guide](/tools/lookup-payment-optimization-agent-policy-guide.md)

## Runs in

- [payment_execution](/workflow/payment-execution.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payment-optimization-agent-end-to-end.md)

# Citations

- [Payment Optimization Agent Procurement Policy Guide](/documents/payment-optimization-agent-policy-guide.md)
