---
type: Eval Scenario
title: "Trade 412458901 (CUSIP 456789123, interest_rate_swap, notional $18,400,000 wi..."
description: "Trade 412458901 (CUSIP 456789123, interest_rate_swap, notional $18,400,000 with Meridian Capital Partners) shows settlement_status 'matched' in the latest Murex MX.3 trades extract, but the ServiceNow ticket opened against that same trade_id is still open and unresolved from three business days ago. Reconcile the conflict and tell me whether this break is actually closed."
source_id: "trade-confirmation-break-resolution-agent-cross-entity-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Trade 412458901 (CUSIP 456789123, interest_rate_swap, notional $18,400,000 with Meridian Capital Partners) shows settlement_status 'matched' in the latest Murex MX.3 trades extract, but the ServiceNow ticket opened against that same trade_id is still open and unresolved from three business days ago. Reconcile the conflict and tell me whether this break is actually closed.

## Validates

- [confirmation-booking-intake](/queries/confirmation-booking-intake.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Trade Confirmation Break Resolution Agent Banking Compliance Policy](/documents/trade-confirmation-break-resolution-agent-compliance-policy.md)
- [Trade Confirmation Matching & Affirmation SLA Schedule](/documents/trade-confirmation-matching-sla-schedule.md)
