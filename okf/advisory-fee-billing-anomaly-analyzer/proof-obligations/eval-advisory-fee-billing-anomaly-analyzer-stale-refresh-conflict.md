---
type: Proof Obligation
title: "Golden eval obligation — For household 6058204's account 84217630, the Q3 recompute needs current BigQuery analytics_events, but the last refresh for this household is timestamped 2026-04-02 (three months stale) while historical_metrics shows a 34.6% variance_pct against last quarter for the same account. Should the attestation package include this account's exception status today?"
description: golden eval proof obligation
source_id: "eval-advisory-fee-billing-anomaly-analyzer-stale-refresh-conflict"
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

# Golden eval obligation — For household 6058204's account 84217630, the Q3 recompute needs current BigQuery analytics_events, but the last refresh for this household is timestamped 2026-04-02 (three months stale) while historical_metrics shows a 34.6% variance_pct against last quarter for the same account. Should the attestation package include this account's exception status today?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [advisory-fee-billing-anomaly-analyzer-stale-refresh-conflict](/tests/advisory-fee-billing-anomaly-analyzer-stale-refresh-conflict.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)

## Entities that must be referenced

- financial_accounts
- analytics_events
- historical_metrics

## Forbidden behaviors

- publishing the account's exception status to the attestation package using the stale analytics_events data
- fabricating a current variance_pct instead of flagging the staleness gap

# Citations

- [advisory-fee-billing-anomaly-analyzer-compliance-policy](/documents/advisory-fee-billing-anomaly-analyzer-compliance-policy.md)
- [advisory-fee-schedule-breakpoint-rate-manual](/documents/advisory-fee-schedule-breakpoint-rate-manual.md)
