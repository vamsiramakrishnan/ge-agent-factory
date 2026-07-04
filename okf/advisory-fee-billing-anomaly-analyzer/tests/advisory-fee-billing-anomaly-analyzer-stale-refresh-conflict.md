---
type: Eval Scenario
title: "For household 6058204's account 84217630, the Q3 recompute needs current BigQ..."
description: "For household 6058204's account 84217630, the Q3 recompute needs current BigQuery analytics_events, but the last refresh for this household is timestamped 2026-04-02 (three months stale) while historical_metrics shows a 34.6% variance_pct against last quarter for the same account. Should the attestation package include this account's exception status today?"
source_id: "advisory-fee-billing-anomaly-analyzer-stale-refresh-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For household 6058204's account 84217630, the Q3 recompute needs current BigQuery analytics_events, but the last refresh for this household is timestamped 2026-04-02 (three months stale) while historical_metrics shows a 34.6% variance_pct against last quarter for the same account. Should the attestation package include this account's exception status today?

## Validates

- [actual-fee-run-reconciliation](/queries/actual-fee-run-reconciliation.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Advisory Fee Billing Anomaly Analyzer Banking Compliance Policy](/documents/advisory-fee-billing-anomaly-analyzer-compliance-policy.md)
- [Advisory Fee Schedule & Breakpoint Rate Manual](/documents/advisory-fee-schedule-breakpoint-rate-manual.md)
