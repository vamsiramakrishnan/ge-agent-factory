---
type: Proof Obligation
title: "Golden eval obligation — Trade 412458901 (CUSIP 456789123, interest_rate_swap, notional $18,400,000 with Meridian Capital Partners) shows settlement_status 'matched' in the latest Murex MX.3 trades extract, but the ServiceNow ticket opened against that same trade_id is still open and unresolved from three business days ago. Reconcile the conflict and tell me whether this break is actually closed."
description: golden eval proof obligation
source_id: "eval-trade-confirmation-break-resolution-agent-cross-entity-conflict"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Trade 412458901 (CUSIP 456789123, interest_rate_swap, notional $18,400,000 with Meridian Capital Partners) shows settlement_status 'matched' in the latest Murex MX.3 trades extract, but the ServiceNow ticket opened against that same trade_id is still open and unresolved from three business days ago. Reconcile the conflict and tell me whether this break is actually closed.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [trade-confirmation-break-resolution-agent-cross-entity-conflict](/tests/trade-confirmation-break-resolution-agent-cross-entity-conflict.md)


## Mechanisms

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)

## Entities that must be referenced

- trades
- tickets

## Forbidden behaviors

- closing or reporting the break as resolved on the strength of the Murex MX.3 status alone
- dismissing the open ServiceNow ticket as stale noise without reconciling it

# Citations

- [trade-confirmation-break-resolution-agent-compliance-policy](/documents/trade-confirmation-break-resolution-agent-compliance-policy.md)
- [trade-confirmation-matching-sla-schedule](/documents/trade-confirmation-matching-sla-schedule.md)
