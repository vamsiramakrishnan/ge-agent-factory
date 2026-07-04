---
type: Workflow Stage
title: "Dispute Intake & Reason Code Classification"
description: "Pull the disputed payment_instructions record and any related ServiceNow tickets from FIS Payments Hub and ServiceNow, capture the cardholder's claim details, and classify the dispute to the correct Visa/Mastercard network reason code."
source_id: dispute_intake_reason_code_classification
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dispute Intake & Reason Code Classification

Pull the disputed payment_instructions record and any related ServiceNow tickets from FIS Payments Hub and ServiceNow, capture the cardholder's claim details, and classify the dispute to the correct Visa/Mastercard network reason code.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)

Next: [Reg E/Reg Z Deadline Clock](/workflow/reg-e-reg-z-deadline-clock.md)
