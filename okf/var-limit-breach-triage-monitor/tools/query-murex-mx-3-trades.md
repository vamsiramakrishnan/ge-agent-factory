---
type: Agent Tool
title: query_murex_mx_3_trades
description: Retrieve trades from Murex MX.3 for the VaR Limit Breach Triage Monitor workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_murex_mx_3_trades

Retrieve trades from Murex MX.3 for the VaR Limit Breach Triage Monitor workflow.

- **Kind:** query
- **Source system:** [Murex MX.3](/systems/murex-mx-3.md)

## Inputs

- trade_id
- cusip
- date_range

## Outputs

- trades_records
- trades_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Murex MX.3](/systems/murex-mx-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [risk_run_breach_detection](/workflow/risk-run-breach-detection.md)
- [trade_position_decomposition](/workflow/trade-position-decomposition.md)
- [escalation_audit_trail](/workflow/escalation-audit-trail.md)

## Evals

- [Run the VaR Limit Breach Triage Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/var-limit-breach-triage-monitor-end-to-end.md)
- [Risk run as_of_date 2026-07-03 shows measure_id 542118 for the rates desk with measure_value $21,400,000 against approved_limit_value $21,000,000 (limit_utilization_pct 101.9%) and backtest_exceptions_250d = 1. The Murex MX.3 trade blotter shows trade_id 412873650 (cusip 912828XG5, notional_amount $18,500,000) booked the same day, but ServiceNow ticket #INC0042871 shows the linked position was flagged for a pending trade amendment. Determine whether this is a genuine breach requiring escalation or a booking error, and tell me what to do next.](/tests/var-limit-breach-triage-monitor-single-backtest-exception-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- trade_id
- cusip
- date_range

## Produces

- trades_records
- trades_summary

# Examples

```
query_murex_mx_3_trades(trade_id=<trade_id>, cusip=<cusip>, date_range=<date_range>)
```

# Citations

- [Murex MX.3](/systems/murex-mx-3.md)
