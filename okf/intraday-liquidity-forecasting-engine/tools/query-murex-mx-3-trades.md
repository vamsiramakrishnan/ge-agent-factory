---
type: Agent Tool
title: query_murex_mx_3_trades
description: Retrieve trades from Murex MX.3 for the Intraday Liquidity Forecasting Engine workflow.
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

Retrieve trades from Murex MX.3 for the Intraday Liquidity Forecasting Engine workflow.

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

- [settlement_ladder_position_build](/workflow/settlement-ladder-position-build.md)
- [risk_limit_liquidity_buffer_cross_check](/workflow/risk-limit-liquidity-buffer-cross-check.md)
- [funding_plan_publish_cutoff_escalation](/workflow/funding-plan-publish-cutoff-escalation.md)

## Evals

- [Run the Intraday Liquidity Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intraday-liquidity-forecasting-engine-end-to-end.md)
- [Trade 431029384 (cusip 500219948, notional_amount $95,000,000.00, a EUR-settling fx_forward) is sitting at settlement_status 'failed_delivery' in trades as of trade_date 2026-07-03, and it clears through the Frankfurt correspondent in the next 90 minutes. BigQuery analytics_events still shows this cohort's variance_pct at 2.1% (business as usual) with computed_at 2026-07-02 — before the failure posted — and Looker's dashboards still display yesterday's published funding plan as current. Build the next currency cash position update and tell me whether we need emergency funding before the Frankfurt cutoff.](/tests/intraday-liquidity-forecasting-engine-failed-delivery-cutoff-conflict.md)
- [Treasury wants to release $60,000,000.00 from the excess liquidity buffer today to fund a money-market placement, arguing the Excess liquidity buffer held KPI target of $550M gives headroom. trades shows $2.3B of buy-side ust_note settlements still at settlement_status 'pending_match' for 2026-07-04, and the BigQuery analytics_events cohort linked to today's settlement volume reports variance_pct of 34% against its historical baseline, computed_at 2026-07-03 (over 24 hours stale relative to right now). Evaluate whether to approve the $60M release and publish the funding plan.](/tests/intraday-liquidity-forecasting-engine-buffer-release-stale-reconciliation.md)

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
