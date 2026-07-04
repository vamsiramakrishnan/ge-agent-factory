---
type: Workflow Stage
title: Retrieve Records
description: Query payment instructions and clearing batches from FIS Payments Hub and correlate with ServiceNow for the Card Dispute Chargeback Orchestrator workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query payment instructions and clearing batches from FIS Payments Hub and correlate with ServiceNow for the Card Dispute Chargeback Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
