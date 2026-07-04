---
type: Workflow Stage
title: "Cutoff monitoring & queue escalation"
description: "Track clearing_batches cutoff_date and settlement_window against repair-queue depth and ServiceNow ticket volume, notifying the Payments Operations Manager before a same-day cutoff is missed."
source_id: cutoff_monitoring_queue_escalation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cutoff monitoring & queue escalation

Track clearing_batches cutoff_date and settlement_window against repair-queue depth and ServiceNow ticket volume, notifying the Payments Operations Manager before a same-day cutoff is missed.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)
