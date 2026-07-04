---
type: Eval Scenario
title: Run the Card Dispute Chargeback Orchestrator workflow for the current period....
description: "Run the Card Dispute Chargeback Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "card-dispute-chargeback-orchestrator-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Card Dispute Chargeback Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [dispute-intake-reason-code-classification](/queries/dispute-intake-reason-code-classification.md)

## Mechanisms to call

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)

## Success rubric

Action escalate executed against FIS Payments Hub, with audit-trail entry and Dispute Resolution Specialist notified of outcomes.

# Citations

- [Card Dispute Chargeback Orchestrator Banking Compliance Policy](/documents/card-dispute-chargeback-orchestrator-compliance-policy.md)
