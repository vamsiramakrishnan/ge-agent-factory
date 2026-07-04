---
type: Workflow Stage
title: Payment Proposal Extraction
description: "Pull pending payment proposals from ERP payment program. Aggregate invoice details, payment terms, and eligible discount offers from Taulia and C2FO."
source_id: payment_proposal_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Payment Proposal Extraction

Pull pending payment proposals from ERP payment program. Aggregate invoice details, payment terms, and eligible discount offers from Taulia and C2FO.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_c2fo_c2fo_records](/tools/query-c2fo-c2fo-records.md)
- [lookup_payment_optimization_agent_policy_guide](/tools/lookup-payment-optimization-agent-policy-guide.md)

Next: [Discount & Working Capital Optimization](/workflow/discount-working-capital-optimization.md)
