---
type: Workflow Stage
title: "Repeat-Contact & Known-Issue Correlation"
description: "Cross-reference Zendesk tickets, macros, and satisfaction_scores for the same account_number via query_zendesk_tickets to detect open P1/P2 tickets, low satisfaction_scores, and repeat-contact spirals before suggesting a next-best troubleshooting step."
source_id: repeat_contact_known_issue_correlation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Repeat-Contact & Known-Issue Correlation

Cross-reference Zendesk tickets, macros, and satisfaction_scores for the same account_number via query_zendesk_tickets to detect open P1/P2 tickets, low satisfaction_scores, and repeat-contact spirals before suggesting a next-best troubleshooting step.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)

Next: [Governing-Document & Offer-Cap Gate](/workflow/governing-document-offer-cap-gate.md)
