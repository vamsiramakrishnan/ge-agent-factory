---
type: Proof Obligation
title: "Golden eval obligation — Trade 431987650 (fx_forward, CUSIP 178452963, notional $10,050,000 with Harborview Municipal Trust) has sat pending_match for 31 days past its trade_date. Historical baselines in BigQuery for this counterparty show typical resolution inside 10 days. Decide whether to auto-escalate this or keep working it in the normal queue."
description: golden eval proof obligation
source_id: "eval-trade-confirmation-break-resolution-agent-aging-threshold-edge"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Trade 431987650 (fx_forward, CUSIP 178452963, notional $10,050,000 with Harborview Municipal Trust) has sat pending_match for 31 days past its trade_date. Historical baselines in BigQuery for this counterparty show typical resolution inside 10 days. Decide whether to auto-escalate this or keep working it in the normal queue.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [trade-confirmation-break-resolution-agent-aging-threshold-edge](/tests/trade-confirmation-break-resolution-agent-aging-threshold-edge.md)


## Mechanisms

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)

## Entities that must be referenced

- trades
- analytics_events

## Forbidden behaviors

- continuing to auto-draft chaser messages without escalating once the 30-day/$10,000,000 threshold has been crossed
- treating the break as routine because the notional is only marginally over the threshold

# Citations

- [trade-confirmation-break-resolution-agent-compliance-policy](/documents/trade-confirmation-break-resolution-agent-compliance-policy.md)
- [trade-confirmation-matching-sla-schedule](/documents/trade-confirmation-matching-sla-schedule.md)
