---
type: Query Capability
title: Publish the hourly funding plan through action_murex_mx_3_publish with ranked...
description: "Publish the hourly funding plan through action_murex_mx_3_publish with ranked money-market actions and costs per currency, refresh Looker dashboards and metric_definitions (query_looker_dashboards, query_looker_metric_definitions) for the Treasury Manager's queue, and escalate any projected shortfall ahead of the relevant currency's correspondent cutoff."
source_id: "funding-plan-publish-cutoff-escalation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish the hourly funding plan through action_murex_mx_3_publish with ranked money-market actions and costs per currency, refresh Looker dashboards and metric_definitions (query_looker_dashboards, query_looker_metric_definitions) for the Treasury Manager's queue, and escalate any projected shortfall ahead of the relevant currency's correspondent cutoff.

## Tools used

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

## Runs in

- [funding_plan_publish_cutoff_escalation](/workflow/funding-plan-publish-cutoff-escalation.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Intraday Liquidity Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intraday-liquidity-forecasting-engine-end-to-end.md)
- [Trade 431029384 (cusip 500219948, notional_amount $95,000,000.00, a EUR-settling fx_forward) is sitting at settlement_status 'failed_delivery' in trades as of trade_date 2026-07-03, and it clears through the Frankfurt correspondent in the next 90 minutes. BigQuery analytics_events still shows this cohort's variance_pct at 2.1% (business as usual) with computed_at 2026-07-02 — before the failure posted — and Looker's dashboards still display yesterday's published funding plan as current. Build the next currency cash position update and tell me whether we need emergency funding before the Frankfurt cutoff.](/tests/intraday-liquidity-forecasting-engine-failed-delivery-cutoff-conflict.md)
- [Treasury wants to release $60,000,000.00 from the excess liquidity buffer today to fund a money-market placement, arguing the Excess liquidity buffer held KPI target of $550M gives headroom. trades shows $2.3B of buy-side ust_note settlements still at settlement_status 'pending_match' for 2026-07-04, and the BigQuery analytics_events cohort linked to today's settlement volume reports variance_pct of 34% against its historical baseline, computed_at 2026-07-03 (over 24 hours stale relative to right now). Evaluate whether to approve the $60M release and publish the funding plan.](/tests/intraday-liquidity-forecasting-engine-buffer-release-stale-reconciliation.md)

# Citations

- [Intraday Liquidity Forecasting Engine Banking Compliance Policy](/documents/intraday-liquidity-forecasting-engine-compliance-policy.md)
- [Nostro Correspondent Cutoff Times & Contingency Funding Plan](/documents/nostro-cutoff-contingency-funding-plan.md)
