---
type: Query Capability
title: Pull pending payment proposals from ERP payment program. Aggregate invoice de...
description: "Pull pending payment proposals from ERP payment program. Aggregate invoice details, payment terms, and eligible discount offers from Taulia and C2FO."
source_id: "payment-proposal-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull pending payment proposals from ERP payment program. Aggregate invoice details, payment terms, and eligible discount offers from Taulia and C2FO.

## Tools used

- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_c2fo_c2fo_records](/tools/query-c2fo-c2fo-records.md)
- [lookup_payment_optimization_agent_policy_guide](/tools/lookup-payment-optimization-agent-policy-guide.md)

## Runs in

- [payment_proposal_extraction](/workflow/payment-proposal-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payment-optimization-agent-end-to-end.md)

# Citations

- [Payment Optimization Agent Procurement Policy Guide](/documents/payment-optimization-agent-policy-guide.md)
