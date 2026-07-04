---
type: Workflow Stage
title: "Authority & Reserve Check"
description: "Confirm the reserve_lines medical reserve_type, transaction_amount, and authority_level_used against escalation thresholds before any pay/reduce/deny recommendation crosses an adjuster's delegated authority."
source_id: authority_reserve_check
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Authority & Reserve Check

Confirm the reserve_lines medical reserve_type, transaction_amount, and authority_level_used against escalation thresholds before any pay/reduce/deny recommendation crosses an adjuster's delegated authority.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)

Next: [Pay/Reduce/Deny Recommendation & EOR Drafting](/workflow/pay-reduce-deny-recommendation-eor-drafting.md)
