---
type: Workflow Stage
title: "Repair-queue intake & triage"
description: "Pull payment_instructions and clearing_batches kicked to the repair queue from the FIS Payments Hub and correlate open ServiceNow tickets to separate known root causes (prior BIC/ABA errors, duplicate NOAD) from novel exceptions."
source_id: repair_queue_intake_triage
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Repair-queue intake & triage

Pull payment_instructions and clearing_batches kicked to the repair queue from the FIS Payments Hub and correlate open ServiceNow tickets to separate known root causes (prior BIC/ABA errors, duplicate NOAD) from novel exceptions.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)

Next: [Beneficiary data reconstruction](/workflow/beneficiary-data-reconstruction.md)
