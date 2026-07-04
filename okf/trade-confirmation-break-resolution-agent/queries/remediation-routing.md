---
type: Query Capability
title: "Draft counterparty chaser correspondence for external-side discrepancies and ..."
description: "Draft counterparty chaser correspondence for external-side discrepancies and open ServiceNow tickets to the booking desk for internal booking errors, so the fix lands with whoever owns the mismatched field."
source_id: "remediation-routing"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft counterparty chaser correspondence for external-side discrepancies and open ServiceNow tickets to the booking desk for internal booking errors, so the fix lands with whoever owns the mismatched field.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)

## Runs in

- [remediation_routing](/workflow/remediation-routing.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Trade Confirmation Break Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/trade-confirmation-break-resolution-agent-end-to-end.md)
- [Trade 412458901 (CUSIP 456789123, interest_rate_swap, notional $18,400,000 with Meridian Capital Partners) shows settlement_status 'matched' in the latest Murex MX.3 trades extract, but the ServiceNow ticket opened against that same trade_id is still open and unresolved from three business days ago. Reconcile the conflict and tell me whether this break is actually closed.](/tests/trade-confirmation-break-resolution-agent-cross-entity-conflict.md)

# Citations

- [Trade Confirmation Break Resolution Agent Banking Compliance Policy](/documents/trade-confirmation-break-resolution-agent-compliance-policy.md)
- [Trade Confirmation Matching & Affirmation SLA Schedule](/documents/trade-confirmation-matching-sla-schedule.md)
