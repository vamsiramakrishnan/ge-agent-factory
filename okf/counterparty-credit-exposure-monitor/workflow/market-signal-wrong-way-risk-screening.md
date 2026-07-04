---
type: Workflow Stage
title: "Market Signal & Wrong-Way Risk Screening"
description: "Compare BigQuery analytics_events (CDS spread moves, ratings actions) against historical_metrics baselines to flag counterparties whose credit profile is deteriorating faster than their exposure is being reduced."
source_id: market_signal_wrong_way_risk_screening
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Market Signal & Wrong-Way Risk Screening

Compare BigQuery analytics_events (CDS spread moves, ratings actions) against historical_metrics baselines to flag counterparties whose credit profile is deteriorating faster than their exposure is being reduced.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)
- [action_murex_mx_3_file](/tools/action-murex-mx-3-file.md)

Next: [Margin Call Dispute Reconciliation](/workflow/margin-call-dispute-reconciliation.md)
