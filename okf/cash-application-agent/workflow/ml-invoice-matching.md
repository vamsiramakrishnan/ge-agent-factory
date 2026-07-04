---
type: Workflow Stage
title: ML Invoice Matching
description: "Match payments to open invoices using ML model trained on historical application patterns. Score matches by confidence considering amount, customer, date, and reference patterns. Auto-post above 95% confidence threshold."
source_id: ml_invoice_matching
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML Invoice Matching

Match payments to open invoices using ML model trained on historical application patterns. Score matches by confidence considering amount, customer, date, and reference patterns. Auto-post above 95% confidence threshold.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [lookup_cash_application_agent_controls_playbook](/tools/lookup-cash-application-agent-controls-playbook.md)
- [action_highradius_match](/tools/action-highradius-match.md)

Next: [Posting & Exception Routing](/workflow/posting-exception-routing.md)
