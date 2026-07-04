---
type: Query Capability
title: Match payments to open invoices using ML model trained on historical applicat...
description: "Match payments to open invoices using ML model trained on historical application patterns. Score matches by confidence considering amount, customer, date, and reference patterns. Auto-post above 95% confidence threshold."
source_id: "ml-invoice-matching"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Match payments to open invoices using ML model trained on historical application patterns. Score matches by confidence considering amount, customer, date, and reference patterns. Auto-post above 95% confidence threshold.

## Tools used

- [query_highradius_payment_remittances](/tools/query-highradius-payment-remittances.md)
- [lookup_cash_application_agent_controls_playbook](/tools/lookup-cash-application-agent-controls-playbook.md)
- [action_highradius_match](/tools/action-highradius-match.md)

## Runs in

- [ml_invoice_matching](/workflow/ml-invoice-matching.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Cash Application Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cash-application-agent-end-to-end.md)

# Citations

- [Cash Application Agent Controls Playbook](/documents/cash-application-agent-controls-playbook.md)
