---
type: Workflow Stage
title: "Confirmation & Booking Intake"
description: Pull trades sitting in pending_match or failed_delivery from Murex MX.3 via query_murex_mx_3_trades and load open items from ServiceNow tickets via query_servicenow_tickets so every break already in the queue is accounted for before diagnosis starts.
source_id: confirmation_booking_intake
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Confirmation & Booking Intake

Pull trades sitting in pending_match or failed_delivery from Murex MX.3 via query_murex_mx_3_trades and load open items from ServiceNow tickets via query_servicenow_tickets so every break already in the queue is accounted for before diagnosis starts.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

Next: [Field-Level Break Diagnosis](/workflow/field-level-break-diagnosis.md)
