---
type: Workflow Stage
title: Retrieve Records
description: Query payment instructions and clearing batches from FIS Payments Hub and correlate with ServiceNow for the Wire Exception Repair Agent workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query payment instructions and clearing batches from FIS Payments Hub and correlate with ServiceNow for the Wire Exception Repair Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
