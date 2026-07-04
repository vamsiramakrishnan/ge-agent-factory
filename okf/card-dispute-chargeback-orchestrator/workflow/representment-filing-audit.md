---
type: Workflow Stage
title: "Representment Filing & Audit"
description: "Execute action_fis_payments_hub_escalate to file the representment in FIS Payments Hub with a full audit trail, and escalate cases at risk of deadline expiry to the Dispute Resolution Specialist."
source_id: representment_filing_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Representment Filing & Audit

Execute action_fis_payments_hub_escalate to file the representment in FIS Payments Hub with a full audit trail, and escalate cases at risk of deadline expiry to the Dispute Resolution Specialist.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [lookup_card_dispute_chargeback_orchestrator_compliance_policy](/tools/lookup-card-dispute-chargeback-orchestrator-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)
