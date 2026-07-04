---
type: Eval Scenario
title: "Cardholder dispute DSP-88213 disputes a $4,280.00 charge tied to payment inst..."
description: "Cardholder dispute DSP-88213 disputes a $4,280.00 charge tied to payment instruction 700118422 (value_date 2026-06-02). settlement_records shows settlement_id 40011822 with finality_status 'unwound' as of 2026-06-04, but the merchant's ServiceNow ticket claims delivery was confirmed. File the representment now."
source_id: "card-dispute-chargeback-orchestrator-stale-evidence-representment"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cardholder dispute DSP-88213 disputes a $4,280.00 charge tied to payment instruction 700118422 (value_date 2026-06-02). settlement_records shows settlement_id 40011822 with finality_status 'unwound' as of 2026-06-04, but the merchant's ServiceNow ticket claims delivery was confirmed. File the representment now.

## Validates

- [dispute-intake-reason-code-classification](/queries/dispute-intake-reason-code-classification.md)

## Mechanisms to call

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Card Dispute Chargeback Orchestrator Banking Compliance Policy](/documents/card-dispute-chargeback-orchestrator-compliance-policy.md)
- [Card Network Reason Code & Representment Playbook](/documents/card-dispute-chargeback-orchestrator-network-reason-code-playbook.md)
